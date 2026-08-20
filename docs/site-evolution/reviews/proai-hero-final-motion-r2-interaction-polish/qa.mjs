import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = 'docs/site-evolution/reviews/proai-hero-final-motion-r2-interaction-polish';
const BASE = 'http://127.0.0.1:4173/' + ROOT + '/review.html';
const OUT = path.join(ROOT, 'qa-artifacts');
const PRODUCT = '145ca598a1b4e36b5d5bd6e12a9258551690da3e';
const BASE_PRODUCT = '1361e550abd270f168999188eb4e4a8e52c8e23b';
const SEEDS = [142857, 271828, 314159];
await fs.mkdir(OUT, { recursive: true });

function qAngleDeg(a, b) {
  const dot = Math.min(1, Math.abs(a[0]*b[0] + a[1]*b[1] + a[2]*b[2] + a[3]*b[3]));
  return 2 * Math.acos(dot) * 180 / Math.PI;
}

async function waitReady(page) {
  await page.waitForFunction(() => document.documentElement.dataset.reviewReady === 'true', null, { timeout: 45000 });
  return page.evaluate(() => {
    const review = window.__PROAI_FULL_HERO_REVIEW;
    const d = review.runtime.getDiagnostics();
    return { product: review.cubeProduct, source: review.productSource, ready: d.ready, seed: d.scheduler.requestedSeed };
  });
}

async function snap(page) {
  return page.evaluate(() => {
    const runtime = window.__PROAI_FULL_HERO_REVIEW.runtime;
    const d = runtime.getDiagnostics();
    const p = runtime.getReviewPresentationSample?.() || {};
    return {
      q: d.presentation.quaternion,
      autoTravel: p.angularTravelDeg,
      poseQuality: Number.isFinite(d.presentation.poseQuality) ? d.presentation.poseQuality : p.poseQuality,
      speed: d.presentation.angularVelocityDegPerSec,
      eventSerial: d.scheduler.eventSerial,
      activeIds: d.activeTurns.map(turn => turn.id),
      interaction: d.interaction,
      canonical: d.canonicalError,
      scheduler: d.scheduler,
    };
  });
}

async function aspect(page) {
  return page.evaluate(() => {
    const a = window.__PROAI_FULL_HERO_REVIEW.aspectLifecycle.afterResize;
    const cssCamera = Math.abs(a.canvasCss.aspect - a.cameraAspect);
    const cssBacking = Math.abs(a.canvasCss.aspect - a.canvasBacking.aspect);
    return { ...a, cssCamera, cssBacking, pass: cssCamera < 0.012 && cssBacking < 0.012 };
  });
}

async function waitActive(page, timeoutMs = 8000) {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    const s = await snap(page);
    if (s.activeIds.length) return s;
    await page.waitForTimeout(80);
  }
  return null;
}

async function mouseEvent(cdp, type, x, y, down = false) {
  const payload = { type, x, y, button: 'left', buttons: down ? 1 : 0 };
  if (type === 'mousePressed' || type === 'mouseReleased') payload.clickCount = 1;
  await cdp.send('Input.dispatchMouseEvent', payload);
}

async function desktopInteraction(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(`${BASE}?motionSeed=142857`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const ready = await waitReady(page);
  if (!ready.ready || ready.product !== PRODUCT) throw new Error('desktop review product mismatch');
  await page.waitForTimeout(8000);
  const box = await page.locator('#cube-canvas').boundingBox();
  if (!box) throw new Error('desktop canvas unavailable');
  const cx = box.x + box.width * 0.54;
  const cy = box.y + box.height * 0.55;
  const cdp = await page.context().newCDPSession(page);

  await mouseEvent(cdp, 'mouseMoved', cx, cy);
  await mouseEvent(cdp, 'mousePressed', cx, cy, true);
  await page.waitForTimeout(100);
  await mouseEvent(cdp, 'mouseReleased', cx, cy, false);
  await page.waitForTimeout(60);
  const quickTapCleared = !(await snap(page)).interaction.interactionActive;

  await mouseEvent(cdp, 'mouseMoved', cx, cy);
  await mouseEvent(cdp, 'mousePressed', cx, cy, true);
  await mouseEvent(cdp, 'mouseMoved', cx + 42, cy - 18, true);
  await page.waitForTimeout(120);
  await mouseEvent(cdp, 'mouseReleased', cx + 42, cy - 18, false);
  await page.waitForTimeout(60);
  const shortDragCleared = !(await snap(page)).interaction.interactionActive;

  const active = await waitActive(page);
  if (!active) throw new Error('desktop active slice unavailable');
  const initialActiveId = active.activeIds[0];
  const holdStart = await snap(page);
  let initialCompleted = false;
  let maxManualDelta = 0;

  await mouseEvent(cdp, 'mouseMoved', cx, cy);
  await mouseEvent(cdp, 'mousePressed', cx, cy, true);
  for (let i = 0; i < 80; i += 1) {
    const px = cx + Math.sin(i * 0.31) * box.width * 0.16;
    const py = cy + Math.sin(i * 0.49) * box.height * 0.10;
    await mouseEvent(cdp, 'mouseMoved', px, py, true);
    if (i % 8 === 0) {
      const s = await snap(page);
      if (!s.activeIds.includes(initialActiveId)) initialCompleted = true;
      maxManualDelta = Math.max(maxManualDelta, qAngleDeg(holdStart.q, s.q));
    }
    await page.waitForTimeout(100);
  }
  const held = await snap(page);
  const outsideX = box.x + box.width + 24;
  const outsideY = Math.max(20, box.y + box.height * 0.25);
  await mouseEvent(cdp, 'mouseMoved', outsideX, outsideY, true);
  const preRelease = await snap(page);
  await mouseEvent(cdp, 'mouseReleased', outsideX, outsideY, false);
  const release = await snap(page);
  await page.waitForTimeout(600);
  const after600 = await snap(page);
  await page.waitForTimeout(4400);
  const after5 = await snap(page);
  await cdp.detach();

  const autoTravelDuringHold = held.autoTravel - holdStart.autoTravel;
  const newSlicesDuringHold = held.eventSerial - holdStart.eventSerial;
  const releaseSnapDeg = qAngleDeg(preRelease.q, release.q);
  const post600OrientationDeg = qAngleDeg(release.q, after600.q);
  const blockersClearAtRelease = !release.interaction.autonomyBlocked && !release.interaction.sliceAutonomyBlocked && release.interaction.resumeDelayRemainingMs === 0 && release.interaction.sliceResumeDelayRemainingMs === 0;
  const blockersClearWhileHeld = !held.interaction.autonomyBlocked && !held.interaction.sliceAutonomyBlocked;
  const velocityContinuous = release.speed > 0.05 && Math.abs(release.speed - preRelease.speed) < 1.5;
  const noDeadWindow = blockersClearAtRelease && velocityContinuous && post600OrientationDeg > 0.05;
  const canonicalPass = after5.canonical && after5.canonical.maxPosition < 1e-6 && after5.canonical.maxQuaternionRad < 1e-6 && after5.canonical.maxScale < 1e-8;
  const pass = errors.length === 0 && quickTapCleared && shortDragCleared && initialCompleted && autoTravelDuringHold > 0.5 && newSlicesDuringHold >= 1 && maxManualDelta > 5 && blockersClearWhileHeld && releaseSnapDeg < 0.35 && noDeadWindow && qAngleDeg(release.q, after5.q) > 0.5 && !after5.interaction.interactionActive && canonicalPass;
  await context.close();
  return { errors, quickTapCleared, shortDragCleared, initialCompleted, autoTravelDuringHold, newSlicesDuringHold, maxManualDelta, blockersClearWhileHeld, releaseSnapDeg, blockersClearAtRelease, velocityContinuous, post600OrientationDeg, noDeadWindow, canonicalPass, pass };
}

async function touchEvent(cdp, type, points) {
  await cdp.send('Input.dispatchTouchEvent', { type, touchPoints: points });
}

async function mobileInteraction(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(`${BASE}?motionSeed=142857`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const ready = await waitReady(page);
  if (!ready.ready || ready.product !== PRODUCT) throw new Error('mobile review product mismatch');
  const aspectResult = await aspect(page);
  await page.waitForTimeout(8000);
  const box = await page.locator('#cube-canvas').boundingBox();
  if (!box) throw new Error('mobile canvas unavailable');
  const x = box.x + box.width * 0.52;
  const y = box.y + box.height * 0.55;
  const cdp = await page.context().newCDPSession(page);

  await touchEvent(cdp, 'touchStart', [{ x, y, id: 1, radiusX: 1, radiusY: 1, force: 1 }]);
  await page.waitForTimeout(100);
  await touchEvent(cdp, 'touchEnd', []);
  await page.waitForTimeout(60);
  const quickTapCleared = !(await snap(page)).interaction.interactionActive;

  await touchEvent(cdp, 'touchStart', [{ x, y, id: 2, radiusX: 1, radiusY: 1, force: 1 }]);
  await touchEvent(cdp, 'touchMove', [{ x: x + 32, y: y - 18, id: 2, radiusX: 1, radiusY: 1, force: 1 }]);
  await page.waitForTimeout(120);
  await touchEvent(cdp, 'touchEnd', []);
  await page.waitForTimeout(60);
  const shortDragCleared = !(await snap(page)).interaction.interactionActive;

  const active = await waitActive(page);
  if (!active) throw new Error('mobile active slice unavailable');
  const initialActiveId = active.activeIds[0];
  const holdStart = await snap(page);
  let initialCompleted = false;
  let maxManualDelta = 0;

  await touchEvent(cdp, 'touchStart', [{ x, y, id: 3, radiusX: 1, radiusY: 1, force: 1 }]);
  for (let i = 0; i < 80; i += 1) {
    const px = x + Math.sin(i * 0.34) * box.width * 0.18;
    const py = y + Math.sin(i * 0.53) * box.height * 0.09;
    const points = [{ x: px, y: py, id: 3, radiusX: 1, radiusY: 1, force: 1 }];
    if (i === 18) points.push({ x: px + 16, y: py + 10, id: 4, radiusX: 1, radiusY: 1, force: 0.5 });
    await touchEvent(cdp, 'touchMove', points);
    if (i % 8 === 0) {
      const s = await snap(page);
      if (!s.activeIds.includes(initialActiveId)) initialCompleted = true;
      maxManualDelta = Math.max(maxManualDelta, qAngleDeg(holdStart.q, s.q));
    }
    await page.waitForTimeout(100);
  }
  const held = await snap(page);
  const outsideX = Math.min(389, box.x + box.width + 16);
  const outsideY = Math.max(20, Math.min(843, box.y + box.height * 0.25));
  await touchEvent(cdp, 'touchMove', [{ x: outsideX, y: outsideY, id: 3, radiusX: 1, radiusY: 1, force: 1 }]);
  const preRelease = await snap(page);
  await touchEvent(cdp, 'touchEnd', []);
  const release = await snap(page);
  await page.waitForTimeout(600);
  const after600 = await snap(page);
  await page.waitForTimeout(4400);
  const after5 = await snap(page);

  const autoTravelDuringHold = held.autoTravel - holdStart.autoTravel;
  const newSlicesDuringHold = held.eventSerial - holdStart.eventSerial;
  const releaseSnapDeg = qAngleDeg(preRelease.q, release.q);
  const post600OrientationDeg = qAngleDeg(release.q, after600.q);
  const blockersClearAtRelease = !release.interaction.autonomyBlocked && !release.interaction.sliceAutonomyBlocked && release.interaction.resumeDelayRemainingMs === 0 && release.interaction.sliceResumeDelayRemainingMs === 0;
  const blockersClearWhileHeld = !held.interaction.autonomyBlocked && !held.interaction.sliceAutonomyBlocked;
  const velocityContinuous = release.speed > 0.05 && Math.abs(release.speed - preRelease.speed) < 1.5;
  const noDeadWindow = blockersClearAtRelease && velocityContinuous && post600OrientationDeg > 0.05;
  const canonicalPass = after5.canonical && after5.canonical.maxPosition < 1e-6 && after5.canonical.maxQuaternionRad < 1e-6 && after5.canonical.maxScale < 1e-8;

  await page.evaluate(() => window.scrollTo(0, Math.min(650, Math.max(0, document.documentElement.scrollHeight - innerHeight - 20))));
  await page.waitForTimeout(100);
  const scrollProbe = await page.evaluate(() => {
    const candidates = [[20,760],[370,760],[20,640],[370,640],[195,760],[20,500]];
    for (const [sx,sy] of candidates) {
      const el = document.elementFromPoint(sx,sy);
      if (el && el.id !== 'cube-canvas') return { x: sx, y: sy, tag: el.tagName, id: el.id || '' };
    }
    return null;
  });
  let outsideScrollUsable = false;
  if (scrollProbe) {
    const beforeScroll = await page.evaluate(() => window.scrollY);
    await touchEvent(cdp, 'touchStart', [{ x: scrollProbe.x, y: scrollProbe.y, id: 9, radiusX: 1, radiusY: 1, force: 1 }]);
    for (let i = 1; i <= 5; i += 1) {
      await touchEvent(cdp, 'touchMove', [{ x: scrollProbe.x, y: scrollProbe.y - i * 36, id: 9, radiusX: 1, radiusY: 1, force: 1 }]);
      await page.waitForTimeout(35);
    }
    await touchEvent(cdp, 'touchEnd', []);
    await page.waitForTimeout(180);
    const afterScroll = await page.evaluate(() => window.scrollY);
    outsideScrollUsable = Math.abs(afterScroll - beforeScroll) > 12;
  }
  await cdp.detach();

  const pass = errors.length === 0 && aspectResult.pass && quickTapCleared && shortDragCleared && initialCompleted && autoTravelDuringHold > 0.5 && newSlicesDuringHold >= 1 && maxManualDelta > 4 && blockersClearWhileHeld && releaseSnapDeg < 0.35 && noDeadWindow && qAngleDeg(release.q, after5.q) > 0.5 && !after5.interaction.interactionActive && canonicalPass && outsideScrollUsable;
  await context.close();
  return { errors, aspect: aspectResult, quickTapCleared, shortDragCleared, initialCompleted, autoTravelDuringHold, newSlicesDuringHold, maxManualDelta, blockersClearWhileHeld, releaseSnapDeg, blockersClearAtRelease, velocityContinuous, post600OrientationDeg, noDeadWindow, canonicalPass, outsideScrollUsable, pass };
}

async function coreAudit(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(`${BASE}?motionSeed=142857`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const ready = await waitReady(page);
  if (!ready.ready || ready.product !== PRODUCT) throw new Error('core audit product mismatch');
  const result = await page.evaluate((seeds) => {
    const r = window.__PROAI_FULL_HERO_REVIEW.runtime;
    return { automated: r.runAutomatedQA(), motion: r.runMotionAudit({ seeds, minutes: 5 }) };
  }, SEEDS);
  await context.close();
  const mechanicsPass = Boolean(result.automated?.repeatability30?.pass && result.automated?.inverseRestoration?.pass && result.automated?.pairedTurnQA?.pass);
  const endpointAccuracy = mechanicsPass;
  const antiRepetition = result.motion?.pass === true;
  const visibleUndoAbsent = Boolean(result.motion?.seeds?.every(x => x.immediateInverse === 0 && x.shortInverse === 0));
  return { ...result, errors, mechanicsPass, endpointAccuracy, antiRepetition, visibleUndoAbsent, pass: errors.length === 0 && mechanicsPass && antiRepetition && visibleUndoAbsent };
}

async function seedWatch(browser, seed) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(`${BASE}?motionSeed=${seed}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const ready = await waitReady(page);
  if (!ready.ready || ready.product !== PRODUCT || ready.seed !== seed) throw new Error(`seed ${seed} product/seed mismatch`);
  const samples = [];
  for (let i = 0; i < 9; i += 1) {
    await page.waitForTimeout(5000);
    samples.push(await snap(page));
  }
  const result = await page.evaluate(() => {
    const r = window.__PROAI_FULL_HERO_REVIEW.runtime;
    const log = r.getMotionLog();
    r.stopChoreography?.();
    return { log, diagnostics: r.getDiagnostics() };
  });
  await page.waitForTimeout(2500);
  const final = await snap(page);
  await context.close();
  const poseValues = samples.map(x => x.poseQuality).filter(Number.isFinite);
  const poseMin = poseValues.length ? Math.min(...poseValues) : null;
  const speedMax = Math.max(...samples.map(x => x.speed));
  const eventIds = new Set(result.log.filter(x => x.axis).map(x => x.eventId));
  const eventKinds = Object.fromEntries(['single','pair','phrase','breath'].map(kind => [kind, kind === 'breath' ? result.log.filter(x => x.kind === kind).length : new Set(result.log.filter(x => x.kind === kind).map(x => x.eventId)).size]));
  const canonical = final.canonical;
  const canonicalPass = canonical && canonical.maxPosition < 1e-6 && canonical.maxQuaternionRad < 1e-6 && canonical.maxScale < 1e-8;
  const pass = errors.length === 0 && Number.isFinite(poseMin) && poseMin >= 0.35 && speedMax <= 25.1 && eventIds.size >= 3 && canonicalPass;
  return { seed, seconds: 45, errors, poseMin, speedMax, eventCount: eventIds.size, eventKinds, canonicalPass, pass };
}

const browser = await chromium.launch({ headless: true, args: ['--enable-webgl','--ignore-gpu-blocklist','--use-angle=swiftshader','--disable-dev-shm-usage','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows'] });
let report;
try {
  const core = await coreAudit(browser);
  const seeds = [];
  for (const seed of SEEDS) seeds.push(await seedWatch(browser, seed));
  const desktop = await desktopInteraction(browser);
  const mobile = await mobileInteraction(browser);
  const acceptance = {
    mouseDrag: desktop.pass,
    touchDrag: mobile.pass,
    autoWholeObjectDuringHeldDrag: desktop.autoTravelDuringHold > 0.5 && mobile.autoTravelDuringHold > 0.5,
    newSlicesDuringHeldDrag: desktop.newSlicesDuringHold >= 1 && mobile.newSlicesDuringHold >= 1,
    activeSliceCompletes: desktop.initialCompleted && mobile.initialCompleted,
    releaseSnapAbsent: desktop.releaseSnapDeg < 0.35 && mobile.releaseSnapDeg < 0.35,
    postReleaseDeadWindowAbsent: desktop.noDeadWindow && mobile.noDeadWindow,
    antiRepetition: core.antiRepetition,
    visibleUndoAbsent: core.visibleUndoAbsent,
    endpointAccuracy: core.endpointAccuracy,
    canonicalSafety: desktop.canonicalPass && mobile.canonicalPass && seeds.every(x => x.canonicalPass),
    mobileAspect: mobile.aspect.pass,
    mobileOutsideScroll: mobile.outsideScrollUsable,
    multiSeed45s: seeds.every(x => x.pass),
    videoEventCoverage: 'informational-only',
  };
  const pass = core.pass && Object.entries(acceptance).filter(([k]) => k !== 'videoEventCoverage').every(([,v]) => v === true);
  report = { generatedAt: new Date().toISOString(), product: PRODUCT, authoritativeBase: BASE_PRODUCT, core, seeds, desktop, mobile, acceptance, pass };
} catch (error) {
  report = { generatedAt: new Date().toISOString(), product: PRODUCT, authoritativeBase: BASE_PRODUCT, pass: false, fatal: String(error?.stack || error) };
} finally {
  await browser.close();
}

await fs.writeFile(path.join(OUT, 'qa-report.json'), JSON.stringify(report, null, 2));
const summary = [
  'FINAL MOTION R2 INTERACTION + MICRO-POLISH QA',
  `PASS=${report.pass}`,
  `PRODUCT=${report.product}`,
  `MOUSE=${report.desktop?.pass ?? false}`,
  `TOUCH=${report.mobile?.pass ?? false}`,
  `AUTO_HELD_DESKTOP=${Number(report.desktop?.autoTravelDuringHold ?? 0).toFixed(3)}deg`,
  `AUTO_HELD_MOBILE=${Number(report.mobile?.autoTravelDuringHold ?? 0).toFixed(3)}deg`,
  `NEW_SLICES_DESKTOP=${report.desktop?.newSlicesDuringHold ?? 0}`,
  `NEW_SLICES_MOBILE=${report.mobile?.newSlicesDuringHold ?? 0}`,
  `ACTIVE_SLICE_COMPLETES=${report.acceptance?.activeSliceCompletes ?? false}`,
  `RELEASE_SNAP_DESKTOP=${Number(report.desktop?.releaseSnapDeg ?? 999).toFixed(4)}deg`,
  `RELEASE_SNAP_MOBILE=${Number(report.mobile?.releaseSnapDeg ?? 999).toFixed(4)}deg`,
  `NO_DEAD_WINDOW=${report.acceptance?.postReleaseDeadWindowAbsent ?? false}`,
  `ANTI_REPETITION=${report.acceptance?.antiRepetition ?? false}`,
  `VISIBLE_UNDO_ABSENT=${report.acceptance?.visibleUndoAbsent ?? false}`,
  `ENDPOINT_ACCURACY=${report.acceptance?.endpointAccuracy ?? false}`,
  `MOBILE_ASPECT=${report.acceptance?.mobileAspect ?? false}`,
  `MOBILE_OUTSIDE_SCROLL=${report.acceptance?.mobileOutsideScroll ?? false}`,
  `SEEDS_45S=${(report.seeds || []).map(x => `${x.seed}:${x.pass ? 'PASS' : 'FAIL'}:${x.eventCount}events`).join(',')}`,
  'VIDEO_EVENT_COVERAGE=INFORMATIONAL_ONLY',
  report.fatal ? `FATAL=${report.fatal.replace(/\n/g, ' | ')}` : '',
].filter(Boolean).join('\n') + '\n';
await fs.writeFile(path.join(OUT, 'QA_SUMMARY.txt'), summary);
console.log(summary);
if (!report.pass) process.exitCode = 2;
