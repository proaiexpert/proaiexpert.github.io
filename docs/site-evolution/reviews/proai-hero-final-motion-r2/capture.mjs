import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = 'docs/site-evolution/reviews/proai-hero-final-motion-r2';
const OUT = path.join(ROOT, 'media');
const BASE = 'http://127.0.0.1:4173/' + ROOT + '/review.html';
const SEEDS = [142857, 271828, 314159];
await fs.mkdir(OUT, { recursive: true });

function qAngleDeg(a, b) {
  const dot = Math.min(1, Math.abs(a[0]*b[0] + a[1]*b[1] + a[2]*b[2] + a[3]*b[3]));
  return (2 * Math.acos(dot)) * 180 / Math.PI;
}

async function waitReady(page) {
  await page.waitForFunction(() => document.documentElement.dataset.reviewReady === 'true', null, { timeout: 30000 });
  const ready = await page.evaluate(() => ({
    product: window.__PROAI_FULL_HERO_REVIEW?.cubeProduct,
    seed: window.__PROAI_FULL_HERO_REVIEW?.runtime?.getMotionSeed?.(),
    diag: window.__PROAI_FULL_HERO_REVIEW?.runtime?.getDiagnostics?.(),
  }));
  if (!ready.diag?.ready) throw new Error('R2 runtime not ready');
  return ready;
}

async function aspectCheck(page) {
  return page.evaluate(() => {
    const review = window.__PROAI_FULL_HERO_REVIEW;
    const life = review.aspectLifecycle.afterResize;
    const diffs = {
      cssCamera: Math.abs(life.canvasCss.aspect - life.cameraAspect),
      cssBacking: Math.abs(life.canvasCss.aspect - life.canvasBacking.aspect),
    };
    return { ...life, diffs, pass: diffs.cssCamera < 0.012 && diffs.cssBacking < 0.012 };
  });
}

async function runtimeSample(page) {
  return page.evaluate(() => {
    const r = window.__PROAI_FULL_HERO_REVIEW.runtime;
    const d = r.getDiagnostics();
    return {
      at: performance.now(),
      seed: r.getMotionSeed(),
      quaternion: d.presentation.quaternion,
      speed: d.presentation.angularVelocityDegPerSec,
      axis: d.presentation.rotationAxis,
      poseQuality: d.presentation.poseQuality,
      guardActive: d.presentation.guardActive,
      activeTurns: d.activeTurns.length,
      interaction: d.interaction,
      scheduler: d.scheduler,
    };
  });
}

async function waitForActiveTurn(page, timeoutMs = 5000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const active = await page.evaluate(() => window.__PROAI_FULL_HERO_REVIEW.runtime.getDiagnostics().activeTurns.length);
    if (active > 0) return true;
    await page.waitForTimeout(80);
  }
  return false;
}

async function desktopDrag(page) {
  const box = await page.locator('#cube-canvas').boundingBox();
  if (!box) throw new Error('desktop canvas unavailable');
  const x = box.x + box.width * 0.55;
  const y = box.y + box.height * 0.54;
  await page.mouse.move(x, y);
  const before = await runtimeSample(page);
  await page.mouse.down();
  for (let i = 1; i <= 9; i++) {
    await page.mouse.move(x + i * 12, y - i * 5, { steps: 2 });
    await page.waitForTimeout(45);
  }
  const held = await runtimeSample(page);
  await page.waitForTimeout(1350);
  const heldLate = await runtimeSample(page);
  await page.mouse.up();
  const release = await runtimeSample(page);
  await page.waitForTimeout(80);
  const release80 = await runtimeSample(page);
  await page.waitForTimeout(520);
  const resume600 = await runtimeSample(page);
  return {
    before, held, heldLate, release, release80, resume600,
    dragAngleDeg: qAngleDeg(before.quaternion, held.quaternion),
    releaseSnapDeg: qAngleDeg(release.quaternion, release80.quaternion),
    resumedAngleDeg: qAngleDeg(release.quaternion, resume600.quaternion),
    activeSliceCompletedWhileHeld: held.activeTurns > 0 && heldLate.activeTurns === 0,
    pass: qAngleDeg(before.quaternion, held.quaternion) > 5 && qAngleDeg(release.quaternion, release80.quaternion) < 0.25 && qAngleDeg(release.quaternion, resume600.quaternion) > 0.01,
  };
}

async function touchDrag(page) {
  const box = await page.locator('#cube-canvas').boundingBox();
  if (!box) throw new Error('mobile canvas unavailable');
  const x = box.x + box.width * 0.52;
  const y = box.y + box.height * 0.55;
  const before = await runtimeSample(page);
  await page.evaluate(({x,y}) => {
    const c = document.querySelector('#cube-canvas');
    c.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId:77,pointerType:'touch',clientX:x,clientY:y,isPrimary:true,buttons:1}));
  }, {x,y});
  for (let i = 1; i <= 8; i++) {
    await page.evaluate(({x,y,i}) => {
      const c = document.querySelector('#cube-canvas');
      c.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,cancelable:true,pointerId:77,pointerType:'touch',clientX:x+i*8,clientY:y-i*4,isPrimary:true,buttons:1}));
    }, {x,y,i});
    await page.waitForTimeout(55);
  }
  const held = await runtimeSample(page);
  await page.waitForTimeout(1300);
  const heldLate = await runtimeSample(page);
  await page.evaluate(({x,y}) => {
    const c = document.querySelector('#cube-canvas');
    c.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,cancelable:true,pointerId:77,pointerType:'touch',clientX:x+64,clientY:y-32,isPrimary:true,buttons:0}));
  }, {x,y});
  const release = await runtimeSample(page);
  await page.waitForTimeout(80);
  const release80 = await runtimeSample(page);
  await page.waitForTimeout(520);
  const resume600 = await runtimeSample(page);
  return {
    before, held, heldLate, release, release80, resume600,
    dragAngleDeg: qAngleDeg(before.quaternion, held.quaternion),
    releaseSnapDeg: qAngleDeg(release.quaternion, release80.quaternion),
    resumedAngleDeg: qAngleDeg(release.quaternion, resume600.quaternion),
    activeSliceCompletedWhileHeld: held.activeTurns > 0 && heldLate.activeTurns === 0,
    pass: qAngleDeg(before.quaternion, held.quaternion) > 4 && qAngleDeg(release.quaternion, release80.quaternion) < 0.25 && qAngleDeg(release.quaternion, resume600.quaternion) > 0.01,
  };
}

async function captureScenario(browser, { name, viewport, mobile = false }) {
  const videoDir = path.join(OUT, '_video-' + name);
  await fs.mkdir(videoDir, { recursive: true });
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    isMobile: mobile,
    hasTouch: mobile,
    recordVideo: { dir: videoDir, size: viewport },
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => consoleErrors.push(String(err)));
  await page.goto(BASE + '?motionSeed=' + SEEDS[0], { waitUntil: 'domcontentloaded', timeout: 30000 });
  const ready = await waitReady(page);
  const aspect = await aspectCheck(page);
  const samples = [];

  await page.waitForTimeout(3000);
  samples.push(await runtimeSample(page));
  await page.screenshot({ path: path.join(OUT, `${name}-01.png`), fullPage: false });
  await page.waitForTimeout(4000);
  samples.push(await runtimeSample(page));
  await page.screenshot({ path: path.join(OUT, `${name}-02.png`), fullPage: false });
  await waitForActiveTurn(page, 4000);
  const interaction = mobile ? await touchDrag(page) : await desktopDrag(page);
  samples.push(await runtimeSample(page));
  await page.screenshot({ path: path.join(OUT, `${name}-03-interaction-resume.png`), fullPage: false });
  await page.waitForTimeout(5000);
  samples.push(await runtimeSample(page));
  await page.screenshot({ path: path.join(OUT, `${name}-04.png`), fullPage: false });
  await page.waitForTimeout(7000);
  samples.push(await runtimeSample(page));

  const finalDiag = await page.evaluate(() => {
    const r = window.__PROAI_FULL_HERO_REVIEW.runtime;
    return { diag: r.getDiagnostics(), log: r.getMotionLog() };
  });
  const video = page.video();
  await context.close();
  const videoPath = await video.path();
  await fs.copyFile(videoPath, path.join(OUT, `${name}.webm`));
  return { ready, aspect, interaction, samples, finalDiag, consoleErrors };
}

async function reviewSeed(browser, seed) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', err => errors.push(String(err)));
  await page.goto(BASE + '?motionSeed=' + seed, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const ready = await waitReady(page);
  const samples = [];
  for (let i = 0; i < 18; i++) {
    await page.waitForTimeout(330);
    samples.push(await runtimeSample(page));
  }
  const data = await page.evaluate(() => {
    const r = window.__PROAI_FULL_HERO_REVIEW.runtime;
    return { seed: r.getMotionSeed(), log: r.getMotionLog(), diag: r.getDiagnostics() };
  });
  await context.close();
  const poseMin = Math.min(...samples.map(s => s.poseQuality));
  const speedMax = Math.max(...samples.map(s => s.speed));
  const speedMin = Math.min(...samples.map(s => s.speed));
  return { requestedSeed: seed, readySeed: ready.seed, poseMin, speedMin, speedMax, moveCount: data.log.filter(x => x.axis).length, errors, pass: ready.seed === seed && errors.length === 0 && poseMin >= 0.35 && speedMax <= 25.1 };
}

const browser = await chromium.launch({ headless: true, args: ['--enable-webgl','--ignore-gpu-blocklist','--use-angle=swiftshader','--disable-dev-shm-usage'] });
let report;
try {
  const auditContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const auditPage = await auditContext.newPage();
  await auditPage.goto(BASE + '?motionSeed=' + SEEDS[0], { waitUntil: 'domcontentloaded', timeout: 30000 });
  await waitReady(auditPage);
  const automatedQA = await auditPage.evaluate(() => window.__PROAI_FULL_HERO_REVIEW.runtime.runAutomatedQA());
  const motionAudit = await auditPage.evaluate(seeds => window.__PROAI_FULL_HERO_REVIEW.runtime.runMotionAudit({ seeds, minutes: 5 }), SEEDS);
  await auditContext.close();

  const seedReviews = [];
  for (const seed of SEEDS) seedReviews.push(await reviewSeed(browser, seed));
  const desktop = await captureScenario(browser, { name: 'desktop', viewport: { width: 1440, height: 900 }, mobile: false });
  const mobile = await captureScenario(browser, { name: 'mobile', viewport: { width: 390, height: 844 }, mobile: true });

  const desktopKinds = desktop.finalDiag.log.reduce((a,e)=>(a[e.kind]=(a[e.kind]||0)+1,a),{});
  const mobileKinds = mobile.finalDiag.log.reduce((a,e)=>(a[e.kind]=(a[e.kind]||0)+1,a),{});
  report = {
    generatedAt: new Date().toISOString(),
    product: desktop.ready.product,
    seeds: SEEDS,
    automatedQA,
    motionAudit,
    seedReviews,
    desktop: { aspect: desktop.aspect, interaction: desktop.interaction, samples: desktop.samples, kinds: desktopKinds, consoleErrors: desktop.consoleErrors, scheduler: desktop.finalDiag.diag.scheduler, canonicalError: desktop.finalDiag.diag.canonicalError },
    mobile: { aspect: mobile.aspect, interaction: mobile.interaction, samples: mobile.samples, kinds: mobileKinds, consoleErrors: mobile.consoleErrors, scheduler: mobile.finalDiag.diag.scheduler, canonicalError: mobile.finalDiag.diag.canonicalError },
  };
  const canonicalPass = [desktop, mobile].every(x => !x.finalDiag.diag.canonicalError || (x.finalDiag.diag.canonicalError.maxPosition < 1e-6 && x.finalDiag.diag.canonicalError.maxQuaternionRad < 1e-6));
  const videosHaveLivingEvents = [desktopKinds, mobileKinds].every(k => (k.single||0) >= 2 && (k.pair||0) >= 2 && (k.phrase||0) >= 4 && (k.breath||0) >= 1);
  report.pass = Boolean(automatedQA?.repeatability?.pass && automatedQA?.pairedTurnQA?.pass && motionAudit?.pass && seedReviews.every(x=>x.pass) && desktop.aspect.pass && mobile.aspect.pass && desktop.interaction.pass && mobile.interaction.pass && canonicalPass && videosHaveLivingEvents && desktop.consoleErrors.length === 0 && mobile.consoleErrors.length === 0);
  report.acceptance = { canonicalPass, videosHaveLivingEvents, antiRepetition: motionAudit?.pass === true, noReleaseSnap: desktop.interaction.pass && mobile.interaction.pass, mobileAspect: mobile.aspect.pass };
} finally {
  await browser.close();
}

await fs.writeFile(path.join(OUT, 'motion-audit.json'), JSON.stringify(report, null, 2));
const s = report.motionAudit.seeds;
const summary = `# Final Cube Motion R2 — Diagnostic Summary\n\n- Product: ${report.product}\n- Seeds: ${report.seeds.join(', ')}\n- Overall automated acceptance: **${report.pass ? 'PASS' : 'FAIL'}**\n- Anti-repetition audit: **${report.acceptance.antiRepetition ? 'PASS' : 'FAIL'}**\n- Desktop interaction/no-snap: **${report.desktop.interaction.pass ? 'PASS' : 'FAIL'}** (release delta ${report.desktop.interaction.releaseSnapDeg.toFixed(4)}°)\n- Mobile touch/no-snap: **${report.mobile.interaction.pass ? 'PASS' : 'FAIL'}** (release delta ${report.mobile.interaction.releaseSnapDeg.toFixed(4)}°)\n- Mobile aspect: **${report.mobile.aspect.pass ? 'PASS' : 'FAIL'}**\n- Canonical transform safety: **${report.acceptance.canonicalPass ? 'PASS' : 'FAIL'}**\n- Video event coverage: **${report.acceptance.videosHaveLivingEvents ? 'PASS' : 'FAIL'}**\n\n## Five-minute generator audit\n${s.map(x=>`- Seed ${x.seed}: ${x.pass?'PASS':'FAIL'}; moves ${x.moveCount}; exact repeats ${x.exactRepeat}; immediate inverse ${x.immediateInverse}; short-window inverse ${x.shortInverse}; recent phrase repeats 2/3/4/5 = ${x.phraseRepeats[2]}/${x.phraseRepeats[3]}/${x.phraseRepeats[4]}/${x.phraseRepeats[5]}; axis spread ${(x.axisSpread*100).toFixed(1)}%; direction spread ${(x.directionSpread*100).toFixed(1)}%`).join('\n')}\n\n## Runtime seed review\n${report.seedReviews.map(x=>`- Seed ${x.requestedSeed}: ${x.pass?'PASS':'FAIL'}; pose quality min ${x.poseMin.toFixed(3)}; speed ${x.speedMin.toFixed(2)}–${x.speedMax.toFixed(2)} deg/s; observed moves ${x.moveCount}`).join('\n')}\n`;
await fs.writeFile(path.join(OUT, 'MOTION_DIAGNOSTIC_SUMMARY.md'), summary);
console.log(JSON.stringify({ pass: report.pass, product: report.product, seeds: report.seeds, acceptance: report.acceptance }, null, 2));
if (!report.pass) process.exitCode = 2;
