const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const proof = path.resolve(process.env.PROOF_DIR || 'spatial-motion-proof-v2');
const base = process.env.LOCAL_BASE || 'http://127.0.0.1:4000';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const result = {
  candidateSha: process.env.CANDIDATE_SHA || null,
  boot: {},
  samples: [],
  fatal: [],
  consoleErrors: [],
  networkFailures: [],
  simultaneous: false,
  manualInteraction: null,
  environment: null,
  pass: false,
};

function attach(page, label) {
  page.on('pageerror', (error) => {
    const text = `${label}: pageerror: ${error.message}`;
    result.consoleErrors.push(text);
    result.fatal.push(text);
  });
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const text = `${label}: console: ${message.text()}`;
    result.consoleErrors.push(text);
    if (/GLB load failed|initialization failed|Uncaught|TypeError|ReferenceError|SyntaxError/i.test(text)) result.fatal.push(text);
  });
  page.on('requestfailed', (request) => {
    const url = request.url();
    const text = `${label}: requestfailed: ${url} ${request.failure()?.errorText || ''}`;
    result.networkFailures.push(text);
    if ((url.startsWith(base) && /\.(js|css|glb)(\?|$)/i.test(url)) || /\.glb(\?|$)/i.test(url)) result.fatal.push(text);
  });
}

async function installDesktopMediaShim(page) {
  await page.evaluateOnNewDocument(() => {
    const nativeMatchMedia = window.matchMedia.bind(window);
    window.matchMedia = (query) => {
      if (query === '(hover: none), (pointer: coarse)' || /hover:\s*none|pointer:\s*coarse/.test(query)) {
        return {
          matches: false,
          media: query,
          onchange: null,
          addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; },
        };
      }
      return nativeMatchMedia(query);
    };
  });
}

async function open(browser, route, label) {
  const page = await browser.newPage();
  attach(page, label);
  await installDesktopMediaShim(page);
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await page.bringToFront();
  const response = await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.bringToFront();
  await page.waitForFunction(
    () => document.querySelector('.proai-hero-object-slot[data-proai-hero-object]')?.dataset.cubeMounted === 'true'
      && window.__PROAI_HERO_CUBE_R1?.runtime?.ready === true,
    { timeout: 30000 },
  );
  return { page, status: response?.status() || 0 };
}

async function boot(browser, route, label) {
  const { page, status } = await open(browser, route, label);
  const state = await page.evaluate((httpStatus) => ({
    status: httpStatus,
    hero: document.querySelectorAll('#hero').length,
    cube: document.querySelectorAll('#cube-canvas').length,
    ready: window.__PROAI_HERO_CUBE_R1?.runtime?.ready === true,
    authority: window.__PROAI_HERO_CUBE_R1?.runtime?.getDiagnostics()?.presentation?.authority || null,
    hidden: document.hidden,
    visibilityState: document.visibilityState,
    coarsePointer: window.__PROAI_HERO_CUBE_R1?.coarsePointer,
    reducedMotion: window.__PROAI_HERO_CUBE_R1?.reducedMotion,
  }), status);
  await page.close();
  return state;
}

function quatAngle(a, b) {
  const dot = Math.min(1, Math.abs(a.reduce((sum, value, index) => sum + value * b[index], 0)));
  return 2 * Math.acos(dot);
}

(async () => {
  fs.mkdirSync(proof, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BIN,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--ignore-gpu-blocklist',
      '--enable-webgl',
      '--enable-unsafe-swiftshader',
      '--use-angle=swiftshader',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
      '--disable-features=CalculateNativeWinOcclusion',
    ],
  });
  try {
    result.boot.en = await boot(browser, '/', 'en');
    result.boot.ru = await boot(browser, '/ru/', 'ru');

    const { page } = await open(browser, '/', 'motion');
    await page.bringToFront();
    result.environment = await page.evaluate(() => ({
      hidden: document.hidden,
      visibilityState: document.visibilityState,
      coarsePointer: window.__PROAI_HERO_CUBE_R1.coarsePointer,
      reducedMotion: window.__PROAI_HERO_CUBE_R1.reducedMotion,
      heroRect: document.querySelector('#hero')?.getBoundingClientRect().toJSON(),
      mountRect: document.querySelector('#proai-hero-cube-mount')?.getBoundingClientRect().toJSON(),
    }));

    const started = Date.now();
    for (const targetSec of [0, 4, 8, 12, 16, 20, 24, 28]) {
      while (Date.now() - started < targetSec * 1000) {
        await page.bringToFront();
        await sleep(Math.min(100, targetSec * 1000 - (Date.now() - started)));
      }
      const sample = await page.evaluate(() => {
        const runtime = window.__PROAI_HERO_CUBE_R1.runtime;
        const diagnostics = runtime.getDiagnostics();
        return {
          wallMs: performance.now(),
          hidden: document.hidden,
          visibilityState: document.visibilityState,
          presentation: diagnostics.presentation,
          activeTurns: diagnostics.activeTurns,
          scheduler: diagnostics.scheduler,
          interaction: diagnostics.interaction,
          canonicalError: diagnostics.canonicalError,
        };
      });
      sample.targetSec = targetSec;
      result.samples.push(sample);
      if (sample.presentation?.activeInspection && sample.activeTurns?.length) result.simultaneous = true;
    }

    const authored = await page.evaluate(() => [0, 4, 8, 12, 16, 20, 24, 28, 32, 36]
      .map((timeSec) => window.__PROAI_HERO_CUBE_R1.runtime.getReviewPresentationSample(timeSec)));
    result.authoredSamples = authored;

    const quaternions = result.samples.map((sample) => sample.presentation.quaternion);
    result.maxSampleQuaternionSeparation = Math.max(
      ...quaternions.flatMap((a, index) => quaternions.slice(index + 1).map((b) => quatAngle(a, b))),
    );
    const pitches = result.samples.map((sample) => sample.presentation.eulerDeg?.pitchDeg).filter(Number.isFinite);
    const rolls = result.samples.map((sample) => sample.presentation.eulerDeg?.rollDeg).filter(Number.isFinite);
    result.pitchSignVariation = pitches.some((value) => value > 1) && pitches.some((value) => value < -1);
    result.rollSignVariation = rolls.some((value) => value > 0.1) && rolls.some((value) => value < -0.1);
    result.earlyDirectionReversal = result.samples.some((sample) => sample.presentation.activeInspection?.yawDeg < 0);
    result.explicit360 = result.samples.some((sample) => sample.presentation.activeInspection?.yawDeg === 360)
      || authored.some((sample) => sample.activeInspection?.yawDeg === 360);
    result.baseAccumulation = result.samples.some((sample) => sample.presentation.completedMoves >= 1
      && Math.abs(sample.presentation.baseQuaternion[3] - 1) > 0.01);
    result.liveMotionProgress = Math.max(...result.samples.map((sample) => sample.presentation.completedMoves
      + (sample.presentation.activeInspection?.linear || 0))) > 1.2;

    await page.waitForFunction(() => window.__PROAI_HERO_CUBE_R1.runtime.getDiagnostics().presentation.activeInspection !== null, { timeout: 12000 });
    const canvas = await page.$('#cube-canvas');
    const box = await canvas.boundingBox();
    const before = await page.evaluate(() => window.__PROAI_HERO_CUBE_R1.runtime.getDiagnostics());
    await page.mouse.move(box.x + box.width * 0.58, box.y + box.height * 0.48);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.34, box.y + box.height * 0.36, { steps: 10 });
    await sleep(900);
    const during = await page.evaluate(() => window.__PROAI_HERO_CUBE_R1.runtime.getDiagnostics());
    await page.mouse.up();
    const released = await page.evaluate(() => window.__PROAI_HERO_CUBE_R1.runtime.getDiagnostics());
    await sleep(1950);
    const blend = await page.evaluate(() => window.__PROAI_HERO_CUBE_R1.runtime.getDiagnostics());
    await sleep(2600);
    const resumed = await page.evaluate(() => window.__PROAI_HERO_CUBE_R1.runtime.getDiagnostics());

    const beforeLinear = before.presentation.activeInspection?.linear ?? null;
    const duringLinear = during.presentation.activeInspection?.linear ?? null;
    const resumedLinear = resumed.presentation.activeInspection?.linear ?? null;
    result.manualInteraction = {
      beforeLinear,
      duringLinear,
      resumedLinear,
      interactionActiveDuring: during.interaction.interactionActive === true,
      paused: beforeLinear !== null && duringLinear !== null && Math.abs(duringLinear - beforeLinear) < 0.035,
      releaseDelay: released.interaction.resumeDelayRemainingMs > 1500,
      blendActive: blend.interaction.presentationResumeActive === true,
      resumedProgress: resumedLinear === null || beforeLinear === null || resumedLinear > beforeLinear + 0.02,
      cameraBefore: before.interaction.cameraPosition,
      cameraDuring: during.interaction.cameraPosition,
      cameraResumed: resumed.interaction.cameraPosition,
      cameraChanged: before.interaction.cameraPosition.some((value, index) => Math.abs(value - during.interaction.cameraPosition[index]) > 0.02),
      canonicalAfter: resumed.canonicalError,
    };

    const sliceProof = await page.evaluate(async () => {
      const runtime = window.__PROAI_HERO_CUBE_R1.runtime;
      runtime.stopChoreography();
      while (runtime.getDiagnostics().activeTurns.length) await new Promise((resolve) => setTimeout(resolve, 25));
      const paired = await runtime.runPairedTurnQA();
      return {
        paired,
        mechanics: runtime.getDiagnostics().mechanics,
        sliceConfig: runtime.getDiagnostics().sliceConfig,
        canonical: runtime.getDiagnostics().canonicalError,
      };
    });
    result.sliceProof = sliceProof;

    await page.screenshot({ path: path.join(proof, 'owner-spatial-candidate-v2.png') });
    await page.close();

    const observedMoves = authored.filter((sample) => sample.activeInspection).map((sample) => sample.activeInspection.yawDeg);
    result.move1Observed = observedMoves.includes(150);
    result.move2Observed = observedMoves.includes(-225);
    result.move3Observed = observedMoves.includes(360);
    result.move4Observed = observedMoves.includes(175);

    result.pass = result.boot.en.status === 200
      && result.boot.ru.status === 200
      && result.boot.en.hero === 1
      && result.boot.ru.hero === 1
      && result.boot.en.cube === 1
      && result.boot.ru.cube === 1
      && result.boot.en.ready
      && result.boot.ru.ready
      && result.boot.en.authority === 'PRESENTATION_R1_1_SPATIAL_INSPECTION'
      && result.boot.ru.authority === 'PRESENTATION_R1_1_SPATIAL_INSPECTION'
      && result.environment.hidden === false
      && result.environment.coarsePointer === false
      && result.maxSampleQuaternionSeparation > 0.8
      && result.liveMotionProgress
      && result.pitchSignVariation
      && result.rollSignVariation
      && result.earlyDirectionReversal
      && result.explicit360
      && result.baseAccumulation
      && result.simultaneous
      && result.move1Observed
      && result.move2Observed
      && result.move3Observed
      && result.move4Observed
      && result.manualInteraction.interactionActiveDuring
      && result.manualInteraction.paused
      && result.manualInteraction.releaseDelay
      && result.manualInteraction.blendActive
      && result.manualInteraction.resumedProgress
      && result.manualInteraction.cameraChanged
      && result.sliceProof.paired.pass
      && result.sliceProof.mechanics.axes.join(',') === 'X,Y,Z'
      && JSON.stringify(result.sliceProof.mechanics.layers) === JSON.stringify([-1,0,1])
      && result.sliceProof.canonical?.maxPosition < 1e-6
      && result.sliceProof.canonical?.maxQuaternionRad < 1e-6
      && result.fatal.length === 0;
  } catch (error) {
    result.fatal.push(`harness: ${error.stack || error}`);
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(proof, 'QA_RESULTS_V2.json'), JSON.stringify(result, null, 2));
    fs.writeFileSync(path.join(proof, 'console-errors-v2.txt'), result.consoleErrors.join('\n'));
    fs.writeFileSync(path.join(proof, 'network-failures-v2.txt'), result.networkFailures.join('\n'));
  }
  if (!result.pass) process.exit(2);
})();
