import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = 'docs/site-evolution/reviews/proai-hero-final-motion-r2';
const OUT = path.join(ROOT, 'media');
const BASE = 'http://127.0.0.1:4173/' + ROOT + '/review.html';
const SEEDS = [142857, 271828, 314159];
const VIDEO_SEED = SEEDS[0];
const SCENARIO_MS = 29500;
await fs.mkdir(OUT, { recursive: true });

function qAngleDeg(a, b) {
  const dot = Math.min(1, Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]));
  return (2 * Math.acos(dot)) * 180 / Math.PI;
}

async function waitReady(page) {
  await page.waitForFunction(() => document.documentElement.dataset.reviewReady === 'true', null, { timeout: 45000 });
  const ready = await page.evaluate(() => {
    const runtime = window.__PROAI_FULL_HERO_REVIEW?.runtime;
    const raw = new URL(location.href).searchParams.get('motionSeed');
    const requestedSeed = raw == null ? null : Number.parseInt(raw, 10);
    return {
      product: window.__PROAI_FULL_HERO_REVIEW?.cubeProduct,
      seed: Number.isFinite(requestedSeed) ? requestedSeed >>> 0 : runtime?.getMotionSeed?.(),
      rngState: runtime?.getMotionSeed?.(),
      diag: runtime?.getDiagnostics?.(),
      presentation: runtime?.getReviewPresentationSample?.(),
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
    const p = r.getReviewPresentationSample?.() || {};
    return {
      at: performance.now(),
      rngState: r.getMotionSeed(),
      requestedSeed: d.scheduler.requestedSeed,
      quaternion: d.presentation.quaternion,
      speed: d.presentation.angularVelocityDegPerSec,
      axis: d.presentation.rotationAxis,
      poseQuality: Number.isFinite(d.presentation?.poseQuality) ? d.presentation.poseQuality : p.poseQuality,
      guardActive: d.presentation?.guardActive ?? p.guardActive ?? false,
      activeTurns: d.activeTurns.length,
      interaction: d.interaction,
      scheduler: d.scheduler,
    };
  });
}

async function waitForActiveTurn(page, timeoutMs = 7000) {
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
  const activeObserved = await waitForActiveTurn(page);
  const before = await runtimeSample(page);
  await page.mouse.down();
  for (let i = 1; i <= 9; i += 1) {
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
  await page.waitForTimeout(6000);
  const resume6080 = await runtimeSample(page);
  const dragAngleDeg = qAngleDeg(before.quaternion, held.quaternion);
  const releaseSnapDeg = qAngleDeg(release.quaternion, release80.quaternion);
  const resumedAngleDeg = qAngleDeg(release.quaternion, resume6080.quaternion);
  const activeSliceCompletedWhileHeld = activeObserved && before.activeTurns > 0 && heldLate.activeTurns === 0;
  const noVelocityJump = Math.abs(release80.speed - release.speed) < 0.35;
  return {
    activeObserved, before, held, heldLate, release, release80, resume6080,
    dragAngleDeg, releaseSnapDeg, resumedAngleDeg, noVelocityJump,
    activeSliceCompletedWhileHeld,
    pass: activeSliceCompletedWhileHeld && dragAngleDeg > 5 && releaseSnapDeg < 0.25 && resumedAngleDeg > 0.05 && noVelocityJump,
  };
}

async function touchDrag(page) {
  const box = await page.locator('#cube-canvas').boundingBox();
  if (!box) throw new Error('mobile canvas unavailable');
  const x = box.x + box.width * 0.52;
  const y = box.y + box.height * 0.55;
  const activeObserved = await waitForActiveTurn(page);
  const before = await runtimeSample(page);
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, radiusX: 1, radiusY: 1, force: 1, id: 77 }] });
  for (let i = 1; i <= 8; i += 1) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + i * 8, y: y - i * 4, radiusX: 1, radiusY: 1, force: 1, id: 77 }] });
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
  await page.waitForTimeout(6000);
  const resume6080 = await runtimeSample(page);
  const dragAngleDeg = qAngleDeg(before.quaternion, held.quaternion);
  const releaseSnapDeg = qAngleDeg(release.quaternion, release80.quaternion);
  const resumedAngleDeg = qAngleDeg(release.quaternion, resume6080.quaternion);
  const activeSliceCompletedWhileHeld = activeObserved && before.activeTurns > 0 && heldLate.activeTurns === 0;
  const noVelocityJump = Math.abs(release80.speed - release.speed) < 0.35;
  return {
    activeObserved, before, held, heldLate, release, release80, resume6080,
    dragAngleDeg, releaseSnapDeg, resumedAngleDeg, noVelocityJump,
    activeSliceCompletedWhileHeld,
    pass: activeSliceCompletedWhileHeld && dragAngleDeg > 4 && releaseSnapDeg < 0.25 && resumedAngleDeg > 0.05 && noVelocityJump,
  };
}

async function stopAndReadCanonical(page) {
  await page.evaluate(() => window.__PROAI_FULL_HERO_REVIEW.runtime.stopChoreography?.());
  await page.waitForFunction(() => window.__PROAI_FULL_HERO_REVIEW.runtime.getDiagnostics().activeTurns.length === 0, null, { timeout: 12000 });
  return page.evaluate(() => {
    const r = window.__PROAI_FULL_HERO_REVIEW.runtime;
    return { diag: r.getDiagnostics(), log: r.getMotionLog() };
  });
}

function eventCoverage(log) {
  const unique = kind => new Set(log.filter(e => e.kind === kind).map(e => e.eventId)).size;
  return {
    singleEvents: unique('single'),
    pairEvents: unique('pair'),
    phraseEvents: unique('phrase'),
    breaths: log.filter(e => e.kind === 'breath').length,
  };
}

function coveragePass(c) {
  return c.singleEvents >= 2 && c.pairEvents >= 2 && c.phraseEvents >= 2 && c.breaths >= 1;
}

async function runInteractionScenario(browser, { seed, viewport, mobile = false, recordName = null }) {
  const contextOptions = { viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile };
  if (recordName) {
    const videoDir = path.join(OUT, '_video-' + recordName);
    await fs.mkdir(videoDir, { recursive: true });
    contextOptions.recordVideo = { dir: videoDir, size: viewport };
  }
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => consoleErrors.push(String(err)));
  await page.goto(BASE + '?motionSeed=' + seed, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const ready = await waitReady(page);
  const scenarioStarted = Date.now();
  const aspect = await aspectCheck(page);
  const samples = [];

  await page.waitForTimeout(6000);
  samples.push(await runtimeSample(page));
  await page.waitForTimeout(16000);
  samples.push(await runtimeSample(page));
  const interaction = mobile ? await touchDrag(page) : await desktopDrag(page);
  samples.push(await runtimeSample(page));
  await page.waitForTimeout(Math.max(0, SCENARIO_MS - (Date.now() - scenarioStarted)));
  samples.push(await runtimeSample(page));

  const finalDiag = await stopAndReadCanonical(page);
  const coverage = eventCoverage(finalDiag.log);
  const video = page.video();
  await context.close();
  if (recordName && video) {
    const videoPath = await video.path();
    await fs.copyFile(videoPath, path.join(OUT, `${recordName}.webm`));
  }
  return { seed, ready, aspect, interaction, samples, finalDiag, coverage, consoleErrors };
}

async function reviewSeed(browser, seed) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(String(err)));
  await page.goto(BASE + '?motionSeed=' + seed, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const ready = await waitReady(page);
  const samples = [];
  for (let i = 0; i < 18; i += 1) {
    await page.waitForTimeout(330);
    samples.push(await runtimeSample(page));
  }
  const data = await stopAndReadCanonical(page);
  await context.close();
  const poseValues = samples.map(s => s.poseQuality).filter(Number.isFinite);
  const poseMin = poseValues.length ? Math.min(...poseValues) : null;
  const speedMax = Math.max(...samples.map(s => s.speed));
  const speedMin = Math.min(...samples.map(s => s.speed));
  const canonical = data.diag.canonicalError;
  const canonicalPass = canonical && canonical.maxPosition < 1e-6 && canonical.maxQuaternionRad < 1e-6 && canonical.maxScale < 1e-8;
  return {
    requestedSeed: seed,
    readySeed: ready.seed,
    poseMin,
    speedMin,
    speedMax,
    moveCount: data.log.filter(x => x.axis).length,
    canonical,
    errors,
    pass: ready.seed === seed && errors.length === 0 && Number.isFinite(poseMin) && poseMin >= 0.35 && speedMax <= 25.1 && canonicalPass,
  };
}

const browser = await chromium.launch({ headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=swiftshader', '--disable-dev-shm-usage'] });
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

  const desktop = await runInteractionScenario(browser, { seed: VIDEO_SEED, recordName: 'desktop', viewport: { width: 1440, height: 900 }, mobile: false });
  const mobile = await runInteractionScenario(browser, { seed: VIDEO_SEED, recordName: 'mobile', viewport: { width: 390, height: 844 }, mobile: true });

  const mechanicsPass = Boolean(automatedQA?.repeatability30?.pass && automatedQA?.inverseRestoration?.pass && automatedQA?.pairedTurnQA?.pass);
  const canonicalPass = [desktop, mobile].every(x => {
    const c = x.finalDiag.diag.canonicalError;
    return c && c.maxPosition < 1e-6 && c.maxQuaternionRad < 1e-6 && c.maxScale < 1e-8;
  });
  const videoCoverage = coveragePass(desktop.coverage) && coveragePass(mobile.coverage);
  const poseEnvelopePass = [desktop, mobile].every(x => x.samples.every(s => Number.isFinite(s.poseQuality) && s.poseQuality >= 0.35 && s.speed <= 25.1));

  report = {
    generatedAt: new Date().toISOString(),
    product: desktop.ready.product,
    seeds: SEEDS,
    videoSeed: VIDEO_SEED,
    automatedQA,
    motionAudit,
    seedReviews,
    desktop: { aspect: desktop.aspect, interaction: desktop.interaction, samples: desktop.samples, coverage: desktop.coverage, consoleErrors: desktop.consoleErrors, scheduler: desktop.finalDiag.diag.scheduler, canonicalError: desktop.finalDiag.diag.canonicalError },
    mobile: { aspect: mobile.aspect, interaction: mobile.interaction, samples: mobile.samples, coverage: mobile.coverage, consoleErrors: mobile.consoleErrors, scheduler: mobile.finalDiag.diag.scheduler, canonicalError: mobile.finalDiag.diag.canonicalError },
  };
  report.pass = Boolean(
    mechanicsPass && motionAudit?.pass && seedReviews.every(x => x.pass) &&
    desktop.aspect.pass && mobile.aspect.pass && desktop.interaction.pass && mobile.interaction.pass &&
    canonicalPass && videoCoverage && poseEnvelopePass &&
    desktop.consoleErrors.length === 0 && mobile.consoleErrors.length === 0
  );
  report.acceptance = {
    mechanicsPass,
    canonicalPass,
    videoCoverage,
    poseEnvelopePass,
    antiRepetition: motionAudit?.pass === true,
    noReleaseSnap: desktop.interaction.releaseSnapDeg < 0.25 && mobile.interaction.releaseSnapDeg < 0.25,
    noVelocityJump: desktop.interaction.noVelocityJump && mobile.interaction.noVelocityJump,
    autoResume: desktop.interaction.resumedAngleDeg > 0.05 && mobile.interaction.resumedAngleDeg > 0.05,
    activeSliceCompletes: desktop.interaction.activeSliceCompletedWhileHeld && mobile.interaction.activeSliceCompletedWhileHeld,
    mobileAspect: mobile.aspect.pass,
  };
} finally {
  await browser.close();
}

await fs.writeFile(path.join(OUT, 'motion-audit.json'), JSON.stringify(report, null, 2));
const s = report.motionAudit.seeds;
const summary = `# Final Cube Motion R2 — Diagnostic Summary\n\n- Product: ${report.product}\n- Required seeds: ${report.seeds.join(', ')}\n- Owner-video seed: ${report.videoSeed}\n- Overall automated acceptance: **${report.pass ? 'PASS' : 'FAIL'}**\n- Mechanics / exact endpoints: **${report.acceptance.mechanicsPass ? 'PASS' : 'FAIL'}**\n- Anti-repetition audit: **${report.acceptance.antiRepetition ? 'PASS' : 'FAIL'}**\n- Pose readability envelope: **${report.acceptance.poseEnvelopePass ? 'PASS' : 'FAIL'}**\n- Active slice completes during held drag: **${report.acceptance.activeSliceCompletes ? 'PASS' : 'FAIL'}**\n- Desktop interaction/no-snap/resume: **${report.desktop.interaction.pass ? 'PASS' : 'FAIL'}** (snap ${report.desktop.interaction.releaseSnapDeg.toFixed(4)}°, resume ${report.desktop.interaction.resumedAngleDeg.toFixed(4)}°)\n- Mobile touch/no-snap/resume: **${report.mobile.interaction.pass ? 'PASS' : 'FAIL'}** (snap ${report.mobile.interaction.releaseSnapDeg.toFixed(4)}°, resume ${report.mobile.interaction.resumedAngleDeg.toFixed(4)}°)\n- No velocity jump: **${report.acceptance.noVelocityJump ? 'PASS' : 'FAIL'}**\n- Mobile aspect: **${report.mobile.aspect.pass ? 'PASS' : 'FAIL'}**\n- Canonical transform safety: **${report.acceptance.canonicalPass ? 'PASS' : 'FAIL'}**\n- Video event coverage: **${report.acceptance.videoCoverage ? 'PASS' : 'FAIL'}**\n- Desktop coverage: singles ${report.desktop.coverage.singleEvents}, pairs ${report.desktop.coverage.pairEvents}, phrases ${report.desktop.coverage.phraseEvents}, breaths ${report.desktop.coverage.breaths}\n- Mobile coverage: singles ${report.mobile.coverage.singleEvents}, pairs ${report.mobile.coverage.pairEvents}, phrases ${report.mobile.coverage.phraseEvents}, breaths ${report.mobile.coverage.breaths}\n\n## Five-minute generator audit\n${s.map(x => `- Seed ${x.seed}: ${x.pass ? 'PASS' : 'FAIL'}; moves ${x.moveCount}; exact repeats ${x.exactRepeat}; immediate inverse ${x.immediateInverse}; short-window inverse ${x.shortInverse}; recent phrase repeats 2/3/4/5 = ${x.phraseRepeats[2]}/${x.phraseRepeats[3]}/${x.phraseRepeats[4]}/${x.phraseRepeats[5]}; axis spread ${(x.axisSpread * 100).toFixed(1)}%; direction spread ${(x.directionSpread * 100).toFixed(1)}%`).join('\n')}\n\n## Runtime seed review\n${report.seedReviews.map(x => `- Seed ${x.requestedSeed}: ${x.pass ? 'PASS' : 'FAIL'}; pose quality min ${Number.isFinite(x.poseMin) ? x.poseMin.toFixed(3) : 'n/a'}; speed ${x.speedMin.toFixed(2)}–${x.speedMax.toFixed(2)} deg/s; observed moves ${x.moveCount}`).join('\n')}\n`;
await fs.writeFile(path.join(OUT, 'MOTION_DIAGNOSTIC_SUMMARY.md'), summary);
console.log(summary);
if (!report.pass) process.exitCode = 2;
