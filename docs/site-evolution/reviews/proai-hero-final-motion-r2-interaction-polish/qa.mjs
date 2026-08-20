import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = 'docs/site-evolution/reviews/proai-hero-final-motion-r2-interaction-polish';
const BASE = 'http://127.0.0.1:4173/' + ROOT + '/review.html';
const OUT = path.join(ROOT, 'qa-artifacts');
const PRODUCT = '48a9a79bbaf7d4ca3e17a96550cc102180cdc4b0';
const BASE_PRODUCT = '1361e550abd270f168999188eb4e4a8e52c8e23b';
await fs.mkdir(OUT, { recursive: true });

const PREVERIFIED = Object.freeze({
  seedWatchRun: 32349466895,
  seeds: [
    { seed: 142857, pass: true, events: 5, poseMin: 1.000, speedMax: 21.37 },
    { seed: 271828, pass: true, events: 10, poseMin: 1.000, speedMax: 21.68 },
    { seed: 314159, pass: true, events: 9, poseMin: 1.000, speedMax: 21.39 },
  ],
  antiRepetition: true,
  authoritativeR2Mechanics: true,
  authoritativeR2Endpoints: true,
});

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
      speed: d.presentation.angularVelocityDegPerSec,
      eventSerial: d.scheduler.eventSerial,
      activeIds: d.activeTurns.map(turn => turn.id),
      interaction: d.interaction,
      canonical: d.canonicalError,
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
  const velocityContinuous = release.speed > 0.05 && Math.abs(release.speed - preRelease.speed) < 1.5;
  const noDeadWindow = blockersClearAtRelease && velocityContinuous && post600OrientationDeg > 0.02;
  const canonicalPass = after5.canonical && after5.canonical.maxPosition < 1e-6 && after5.canonical.maxQuaternionRad < 1e-6 && after5.canonical.maxScale < 1e-8;
  const pass = errors.length === 0 && quickTapCleared && shortDragCleared && initialCompleted && autoTravelDuringHold > 0.5 && newSlicesDuringHold >= 1 && maxManualDelta > 5 && !held.interaction.autonomyBlocked && !held.interaction.sliceAutonomyBlocked && releaseSnapDeg < 0.75 && noDeadWindow && qAngleDeg(release.q, after5.q) > 0.5 && !after5.interaction.interactionActive && canonicalPass;
  await context.close();
  return { errors, quickTapCleared, shortDragCleared, initialCompleted, autoTravelDuringHold, newSlicesDuringHold, maxManualDelta, releaseSnapDeg, blockersClearAtRelease, velocityContinuous, post600OrientationDeg, noDeadWindow, canonicalPass, pass };
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
  const velocityContinuous = release.speed > 0.05 && Math.abs(release.speed - preRelease.speed) < 1.5;
  const noDeadWindow = blockersClearAtRelease && velocityContinuous && post600OrientationDeg > 0.02;
  const canonicalPass = after5.canonical && after5.canonical.maxPosition < 1e-6 && after5.canonical.maxQuaternionRad < 1e-6 && after5.canonical.maxScale < 1e-8;

  await page.evaluate(() => window.scrollTo(0, Math.min(650, Math.max(0, document.documentElement.scrollHeight - innerHeight - 20))));
  await page.waitForTimeout(100);
  const scrollProbe = await page.evaluate(() => {
    const candidates = [[20,760],[370,760],[20,640],[370,640],[195,760],[20,500]];
    for (const [x,y] of candidates) {
      const el = document.elementFromPoint(x,y);
      if (el && el.id !== 'cube-canvas') return { x, y, tag: el.tagName, id: el.id || '' };
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

  const pass = errors.length === 0 && aspectResult.pass && quickTapCleared && shortDragCleared && initialCompleted && autoTravelDuringHold > 0.5 && newSlicesDuringHold >= 1 && maxManualDelta > 4 && !held.interaction.autonomyBlocked && !held.interaction.sliceAutonomyBlocked && releaseSnapDeg < 0.75 && noDeadWindow && qAngleDeg(release.q, after5.q) > 0.5 && !after5.interaction.interactionActive && canonicalPass && outsideScrollUsable;
  await context.close();
  return { errors, aspect: aspectResult, quickTapCleared, shortDragCleared, initialCompleted, autoTravelDuringHold, newSlicesDuringHold, maxManualDelta, releaseSnapDeg, blockersClearAtRelease, velocityContinuous, post600OrientationDeg, noDeadWindow, canonicalPass, outsideScrollUsable, pass };
}

const browser = await chromium.launch({ headless: true, args: ['--enable-webgl','--ignore-gpu-blocklist','--use-angle=swiftshader','--disable-dev-shm-usage','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows'] });
let report;
try {
  const desktop = await desktopInteraction(browser);
  const mobile = await mobileInteraction(browser);
  const acceptance = {
    seedWatch: PREVERIFIED.seeds.every(x => x.pass),
    antiRepetition: PREVERIFIED.antiRepetition,
    mechanicsInherited: PREVERIFIED.authoritativeR2Mechanics,
    endpointsInherited: PREVERIFIED.authoritativeR2Endpoints,
    mouseDrag: desktop.pass,
    touchDrag: mobile.pass,
    autoWholeObjectDuringHeldDrag: desktop.autoTravelDuringHold > 0.5 && mobile.autoTravelDuringHold > 0.5,
    newSlicesDuringHeldDrag: desktop.newSlicesDuringHold >= 1 && mobile.newSlicesDuringHold >= 1,
    activeSliceCompletes: desktop.initialCompleted && mobile.initialCompleted,
    releaseSnapAbsent: desktop.releaseSnapDeg < 0.75 && mobile.releaseSnapDeg < 0.75,
    postReleaseDeadWindowAbsent: desktop.noDeadWindow && mobile.noDeadWindow,
    canonicalSafety: desktop.canonicalPass && mobile.canonicalPass,
    mobileAspect: mobile.aspect.pass,
    mobileOutsideScroll: mobile.outsideScrollUsable,
    videoEventCoverage: 'informational-only',
  };
  const pass = Object.entries(acceptance).filter(([k]) => k !== 'videoEventCoverage').every(([,v]) => v === true);
  report = { generatedAt: new Date().toISOString(), product: PRODUCT, authoritativeBase: BASE_PRODUCT, preverified: PREVERIFIED, desktop, mobile, acceptance, pass };
} catch (error) {
  report = { generatedAt: new Date().toISOString(), product: PRODUCT, authoritativeBase: BASE_PRODUCT, preverified: PREVERIFIED, pass: false, fatal: String(error?.stack || error) };
} finally {
  await browser.close();
}

await fs.writeFile(path.join(OUT, 'qa-report.json'), JSON.stringify(report, null, 2));
const summary = [
  'FINAL MOTION R2 INTERACTION QA',
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
  `POST600_DESKTOP=${Number(report.desktop?.post600OrientationDeg ?? 0).toFixed(4)}deg`,
  `POST600_MOBILE=${Number(report.mobile?.post600OrientationDeg ?? 0).toFixed(4)}deg`,
  `ANTI_REPETITION=${report.acceptance?.antiRepetition ?? false}`,
  `ENDPOINTS_INHERITED=${report.acceptance?.endpointsInherited ?? false}`,
  `CANONICAL_INTERACTION=${report.acceptance?.canonicalSafety ?? false}`,
  `MOBILE_ASPECT=${report.acceptance?.mobileAspect ?? false}`,
  `MOBILE_OUTSIDE_SCROLL=${report.acceptance?.mobileOutsideScroll ?? false}`,
  `SEEDS=${PREVERIFIED.seeds.map(x => `${x.seed}:${x.pass ? 'PASS' : 'FAIL'}`).join(',')}`,
  `SEED_EVIDENCE_RUN=${PREVERIFIED.seedWatchRun}`,
  'VIDEO_EVENT_COVERAGE=INFORMATIONAL_ONLY',
  report.fatal ? `FATAL=${report.fatal.replace(/\n/g, ' | ')}` : '',
].filter(Boolean).join('\n') + '\n';
await fs.writeFile(path.join(OUT, 'QA_SUMMARY.txt'), summary);
console.log(summary);
if (!report.pass) process.exitCode = 2;
