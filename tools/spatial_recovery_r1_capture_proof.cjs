const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const proof = path.resolve(process.env.PROOF_DIR || 'spatial-motion-capture-proof');
const base = process.env.LOCAL_BASE || 'http://127.0.0.1:4000';
const result = { samples: [], fatal: [], networkFailures: [], consoleErrors: [], frames: [], pass: false };

function angle(a, b) {
  const dot = Math.min(1, Math.abs(a.reduce((sum, value, index) => sum + value * b[index], 0)));
  return 2 * Math.acos(dot);
}

(async () => {
  fs.mkdirSync(proof, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BIN,
    headless: true,
    args: ['--no-sandbox','--disable-dev-shm-usage','--ignore-gpu-blocklist','--enable-webgl','--enable-unsafe-swiftshader','--use-angle=swiftshader'],
  });
  const page = await browser.newPage();
  page.on('pageerror', (e) => result.fatal.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') {
      const text = `console: ${m.text()}`;
      result.consoleErrors.push(text);
      if (/GLB load failed|initialization failed|Uncaught|TypeError|ReferenceError|SyntaxError/i.test(text)) result.fatal.push(text);
    }
  });
  page.on('requestfailed', (r) => {
    const text = `${r.url()} ${r.failure()?.errorText || ''}`;
    result.networkFailures.push(text);
    if (/\.(js|css|glb)(\?|$)/i.test(r.url())) result.fatal.push(`requestfailed: ${text}`);
  });
  try {
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
    const response = await page.goto(`${base}/?capture`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForFunction(() => window.__PROAI_HERO_CUBE_R1?.runtime?.ready === true, { timeout: 30000 });
    result.http = response?.status() || 0;
    result.boot = await page.evaluate(() => ({
      hero: document.querySelectorAll('#hero').length,
      cube: document.querySelectorAll('#cube-canvas').length,
      ready: window.__PROAI_HERO_CUBE_R1.runtime.ready,
      authority: window.__PROAI_HERO_CUBE_R1.runtime.getDiagnostics().presentation.authority,
    }));

    const times = [0,4,8,12,16,20,24,28,32];
    for (const timeSec of times) {
      const sample = await page.evaluate((t) => window.__PROAI_HERO_CUBE_R1.runtime.setReviewPresentation(t, 1, true), timeSec);
      result.samples.push(sample);
      if ([4,12,20,32].includes(timeSec)) {
        const file = `spatial-${String(timeSec).padStart(2,'0')}s.png`;
        await page.screenshot({ path: path.join(proof, file) });
        result.frames.push(file);
      }
    }

    const quats = result.samples.map((s) => s.quaternion);
    result.maxQuaternionSeparation = Math.max(...quats.flatMap((a, i) => quats.slice(i + 1).map((b) => angle(a, b))));
    const pitches = result.samples.map((s) => s.eulerDeg.pitchDeg);
    const rolls = result.samples.map((s) => s.eulerDeg.rollDeg);
    const moves = result.samples.filter((s) => s.activeInspection).map((s) => s.activeInspection.yawDeg);
    result.pitchSignVariation = pitches.some((v) => v > 1) && pitches.some((v) => v < -1);
    result.rollSignVariation = rolls.some((v) => v > 0.1) && rolls.some((v) => v < -0.1);
    result.move150 = moves.includes(150);
    result.moveNeg225 = moves.includes(-225);
    result.move360 = moves.includes(360);
    result.move175 = moves.includes(175);
    result.baseAccumulation = result.samples.some((s) => s.completedMoves >= 1 && Math.abs(s.baseQuaternion[3] - 1) > 0.01);
    result.pass = result.http === 200
      && result.boot.hero === 1
      && result.boot.cube === 1
      && result.boot.ready
      && result.boot.authority === 'PRESENTATION_R1_1_SPATIAL_INSPECTION'
      && result.maxQuaternionSeparation > 1.0
      && result.pitchSignVariation
      && result.rollSignVariation
      && result.move150 && result.moveNeg225 && result.move360 && result.move175
      && result.baseAccumulation
      && result.fatal.length === 0;
  } catch (e) {
    result.fatal.push(`harness: ${e.stack || e}`);
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(proof, 'CAPTURE_QA.json'), JSON.stringify(result, null, 2));
  }
  if (!result.pass) process.exit(2);
})();
