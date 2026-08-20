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
  const ready = await page.evaluate(() => {
    const runtime = window.__PROAI_FULL_HERO_REVIEW?.runtime;
    const raw = new URL(location.href).searchParams.get('motionSeed');
    const requestedSeed = raw == null ? null : Number.parseInt(raw, 10);
    return {
      product: window.__PROAI_FULL_HERO_REVIEW?.cubeProduct,
      seed: Number.isFinite(requestedSeed) ? requestedSeed >>> 0 : runtime?.getMotionSeed?.(),
      rngState: runtime?.getMotionSeed?.(),
      diag: runtime?.getDiagnostics?.(),
    };
  });
  if (!ready.diag?.ready) throw new Error('R2 runtime not ready');
  return ready;
}

async function aspectCheck(page) {
  return page.evaluate(() => {
    const life = window.__PROAI_FULL_HERO_REVIEW.aspectLifecycle.afterResize;
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
      rngState: r.getMotionSeed(),
      requestedSeed: d.scheduler.requestedSeed,
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

async function waitForActiveTurn(page, timeoutMs = 6000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const active = await page.evaluate(() => window.__PROAI_FULL_HERO_REVIEW.runtime.getDiagnostics().activeTurns.length);
    if (active > 0) return true;
    await page.waitForTimeout(70);
  }
  return false;
}

async function desktopDrag(page) {
  const box = await page.locator('#cube-canvas').boundingBox();
  if (!box) throw new Error('desktop canvas unavailable');
  const x = box.x + box.width * 0.55;
  const y = box.y + box.height * 0.54;
  await page.mouse.move(x, y);
  const activeObserved = await waitForActiveTurn(page, 6000);
  const before = await runtimeSample(page);
  await page.mouse.down();
  for (let i = 1; i <= 9; i++) {
    await page.mouse.move(x + i * 12, y - i * 5, { steps: 2 });
    await page.waitForTimeout(45);
  }
  const held = await runtimeSample(page);
  await page.waitForTimeout(1450);
  const heldLate = await runtimeSample(page);
  await page.mouse.up();
  const release = await runtimeSample(page);
  await page.waitForTimeout(80);
  const release80 = await runtimeSample(page);
  await page.waitForTimeout(520);
  const resume600 = await runtimeSample(page);
  const dragAngleDeg = qAngleDeg(before.quaternion, held.quaternion);
  const releaseSnapDeg = qAngleDeg(release.quaternion, release80.quaternion);
  const resumedAngleDeg = qAngleDeg(release.quaternion, resume600.quaternion);
  const activeSliceCompletedWhileHeld = activeObserved && before.activeTurns > 0 && heldLate.activeTurns === 0;
  return {
    activeObserved, before, held, heldLate, release, release80, resume600,
    dragAngleDeg, releaseSnapDeg, resumedAngleDeg,
    activeSliceCompletedWhileHeld,
    pass: activeSliceCompletedWhileHeld && dragAngleDeg > 5 && releaseSnapDeg < 0.25 && resumedAngleDeg > 0.01,
  };
}

async function touchDrag(page) {
  const box = await page.locator('#cube-canvas').boundingBox();
  if (!box) throw new Error('mobile canvas unavailable');
  const x = box.x + box.width * 0.52;
  const y = box.y + box.height * 0.55;
  const activeObserved = await waitForActiveTurn(page, 6000);
  const before = await runtimeSample(page);
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, radiusX: 1, radiusY: 1, force: 1, id: 77 }] });
  for (let i = 1; i <= 8; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x+i*8, y: y-i*4, radiusX: 1, radiusY: 1, force: 1, id: 77 }] });
    await page.waitForTimeout(55);
  }
  const held = await runtimeSample(page);
  await page.waitForTimeout(1450);
  const heldLate = await runtimeSample(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await cdp.detach();
  const release = await runtimeSample(page);
  await page.waitForTimeout(80);
  const release80 = await runtimeSample(page);
  await page.waitForTimeout(520);
  const resume600 = await runtimeSample(page);
  const dragAngleDeg = qAngleDeg(before.quaternion, held.quaternion);
  const releaseSnapDeg = qAngleDeg(release.quaternion, release80.quaternion);
  const resumedAngleDeg = qAngleDeg(release.quaternion, resume600.quaternion);
  const activeSliceCompletedWhileHeld = activeObserved && before.activeTurns > 0 && heldLate.activeTurns === 0;
  return {
    activeObserved, before, held, heldLate, release, release80, resume600,
    dragAngleDeg, releaseSnapDeg, resumedAngleDeg,
    activeSliceCompletedWhileHeld,
    pass: activeSliceCompletedWhileHeld && dragAngleDeg > 4 && releaseSnapDeg < 0.25 && resumedAngleDeg > 0.01,
  };
}

async function stopAndReadCanonical(page) {
  await page.evaluate(() => window.__PROAI_FULL_HERO_REVIEW.runtime.stopChoreography?.());
  await page.waitForFunction(() => window.__PROAI_FULL_HERO_REVIEW.runtime.getDiagnostics().activeTurns.length === 0, null, { timeout: 5000 });
  return page.evaluate(() => {
    const r = window.__PROAI_FULL_HERO_REVIEW.runtime;
    return { diag: r.getDiagnostics(), log: r.getMotionLog() };
  });
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
  const scenarioStarted = Date.now();
  const aspect = await aspectCheck(page);
  const samples = [];

  await page.waitForTimeout(3000);
  samples.push(await runtimeSample(page));
  await page.screenshot({ path: path.join(OUT, `${name}-01.png`), fullPage: false });
  await page.waitForTimeout(4000);
  samples.push(await runtimeSample(page));
  await page.screenshot({ path: path.join(OUT, `${name}-02.png`), fullPage: false });
  const interaction = mobile ? await touchDrag(page) : await desktopDrag(page);
  samples.push(await runtimeSample(page));
  await page.screenshot({ path: path.join(OUT, `${name}-03-interaction-resume.png`), fullPage: false });
  await page.waitForTimeout(5000);
  samples.push(await runtimeSample(page));
  await page.screenshot({ path: path.join(OUT, `${name}-04.png`), fullPage: false });
  await page.waitForTimeout(Math.max(0, 27500 - (Date.now() - scenarioStarted)));
  samples.push(await runtimeSample(page));

  const finalDiag = await stopAndReadCanonical(page);
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
  const data = await stopAndReadCanonical(page);
  await context.close();
  const poseMin = Math.min(...samples.map(s => s.poseQuality));
  const speedMax = Math.max(...samples.map(s => s.speed));
  const speedMin = Math.min(...samples.map(s => s.speed));
  const canonical = data.diag.canonicalError;
  const canonicalPass = canonical && canonical.maxPosition < 1e-6 && canonical.maxQuaternionRad < 1e-6 && canonical.maxScale < 1e-8;
  return { requestedSeed: seed, readySeed: ready.seed, rngState: ready.rngState, poseMin, speedMin, speedMax, moveCount: data.log.filter(x => x.axis).length, canonical, errors, pass: ready.seed === seed && errors.length === 0 && poseMin >= 0.35 && speedMax <= 25.1 && canonicalPass };
}

function eventCoverage(log) {
  const unique = kind => new Set(log.filter(e => e.kind === kind).map(e => e.eventId)).size;
  return { singleEvents: unique('single'), pairEvents: unique('pair'), phraseEvents: unique('phrase'), breaths: log.filter(e => e.kind === 'breath').length };
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

  const desktopCoverage = eventCoverage(desktop.finalDiag.log);
  const mobileCoverage = eventCoverage(mobile.finalDiag.log);
  const mechanicsPass = Boolean(automatedQA?.repeatability30?.pass && automatedQA?.inverseRestoration?.pass && automatedQA?.pairedTurnQA?.pass);
  const canonicalPass = [desktop, mobile].every(x => {
    const c = x.finalDiag.diag.canonicalError;
    return c && c.maxPosition < 1e-6 && c.maxQuaternionRad < 1e-6 && c.maxScale < 1e-8;
  });
  const coveragePass = [desktopCoverage, mobileCoverage].every(k => k.singleEvents >= 2 && k.pairEvents >= 2 && k.phraseEvents >= 2 && k.breaths >= 1);

  report = {
    generatedAt: new Date().toISOString(),
    product: desktop.ready.product,
    seeds: SEEDS,
    automatedQA,
    motionAudit,
    seedReviews,
    desktop: { aspect: desktop.aspect, interaction: desktop.interaction, samples: desktop.samples, coverage: desktopCoverage, consoleErrors: desktop.consoleErrors, scheduler: desktop.finalDiag.diag.scheduler, canonicalError: desktop.finalDiag.diag.canonicalError },
    mobile: { aspect: mobile.aspect, interaction: mobile.interaction, samples: mobile.samples, coverage: mobileCoverage, consoleErrors: mobile.consoleErrors, scheduler: mobile.finalDiag.diag.scheduler, canonicalError: mobile.finalDiag.diag.canonicalError },
  };
  report.pass = Boolean(mechanicsPass && motionAudit?.pass && seedReviews.every(x=>x.pass) && desktop.aspect.pass && mobile.aspect.pass && desktop.interaction.pass && mobile.interaction.pass && canonicalPass && coveragePass && desktop.consoleErrors.length === 0 && mobile.consoleErrors.length === 0);
  report.acceptance = { mechanicsPass, canonicalPass, videoCoverage: coveragePass, antiRepetition: motionAudit?.pass === true, noReleaseSnap: desktop.interaction.pass && mobile.interaction.pass, activeSliceCompletes: desktop.interaction.activeSliceCompletedWhileHeld && mobile.interaction.activeSliceCompletedWhileHeld, mobileAspect: mobile.aspect.pass };
} finally {
  await browser.close();
}

await fs.writeFile(path.join(OUT, 'motion-audit.json'), JSON.stringify(report, null, 2));
const s = report.motionAudit.seeds;
const summary = `# Final Cube Motion R2 — Diagnostic Summary\n\n- Product: ${report.product}\n- Seeds: ${report.seeds.join(', ')}\n- Overall automated acceptance: **${report.pass ? 'PASS' : 'FAIL'}**\n- Mechanics / exact endpoints: **${report.acceptance.mechanicsPass ? 'PASS' : 'FAIL'}**\n- Anti-repetition audit: **${report.acceptance.antiRepetition ? 'PASS' : 'FAIL'}**\n- Active slice completes during held drag: **${report.acceptance.activeSliceCompletes ? 'PASS' : 'FAIL'}**\n- Desktop interaction/no-snap: **${report.desktop.interaction.pass ? 'PASS' : 'FAIL'}** (release delta ${report.desktop.interaction.releaseSnapDeg.toFixed(4)}°)\n- Mobile touch/no-snap: **${report.mobile.interaction.pass ? 'PASS' : 'FAIL'}** (release delta ${report.mobile.interaction.releaseSnapDeg.toFixed(4)}°)\n- Mobile aspect: **${report.mobile.aspect.pass ? 'PASS' : 'FAIL'}**\n- Canonical transform safety: **${report.acceptance.canonicalPass ? 'PASS' : 'FAIL'}**\n- Video event coverage: **${report.acceptance.videoCoverage ? 'PASS' : 'FAIL'}**\n- Desktop coverage: singles ${report.desktop.coverage.singleEvents}, pairs ${report.desktop.coverage.pairEvents}, phrases ${report.desktop.coverage.phraseEvents}, breaths ${report.desktop.coverage.breaths}\n- Mobile coverage: singles ${report.mobile.coverage.singleEvents}, pairs ${report.mobile.coverage.pairEvents}, phrases ${report.mobile.coverage.phraseEvents}, breaths ${report.mobile.coverage.breaths}\n\n## Five-minute generator audit\n${s.map(x=>`- Seed ${x.seed}: ${x.pass?'PASS':'FAIL'}; moves ${x.moveCount}; exact repeats ${x.exactRepeat}; immediate inverse ${x.immediateInverse}; short-window inverse ${x.shortInverse}; recent phrase repeats 2/3/4/5 = ${x.phraseRepeats[2]}/${x.phraseRepeats[3]}/${x.phraseRepeats[4]}/${x.phraseRepeats[5]}; axis spread ${(x.axisSpread*100).toFixed(1)}%; direction spread ${(x.directionSpread*100).toFixed(1)}%`).join('\n')}\n\n## Runtime seed review\n${report.seedReviews.map(x=>`- Seed ${x.requestedSeed}: ${x.pass?'PASS':'FAIL'}; pose quality min ${x.poseMin.toFixed(3)}; speed ${x.speedMin.toFixed(2)}–${x.speedMax.toFixed(2)} deg/s; observed moves ${x.moveCount}`).join('\n')}\n`;
await fs.writeFile(path.join(OUT, 'MOTION_DIAGNOSTIC_SUMMARY.md'), summary);
console.log(JSON.stringify({ pass: report.pass, product: report.product, seeds: report.seeds, acceptance: report.acceptance }, null, 2));
if (!report.pass) process.exitCode = 2;
