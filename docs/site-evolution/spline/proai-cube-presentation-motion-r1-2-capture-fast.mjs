import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REVIEW = path.join(ROOT, 'review');
const QA_PATH = path.join(ROOT, 'QA.json');
const REPORT_PATH = path.join(ROOT, 'REPORT.md');
const BASE_URL = process.env.PROAI_PRESENTATION_R1_2_URL || 'http://127.0.0.1:4173/';
const CAPTURE_URL = new URL('?capture=1', BASE_URL).toString();
const REVIEW_URL = new URL('?review=1', BASE_URL).toString();
const FPS = 24;
const VIDEO_SECONDS = 30;
const VIDEO_VIEWPORT = { width: 960, height: 960 };
const SCREENSHOT_VIEWPORT = { width: 960, height: 1060 };
const MP4_PATH = path.join(REVIEW, 'proai-cube-presentation-motion-r1-2-review-30s.mp4');
const RAW_VIDEO_PATH = path.join(REVIEW, 'proai-cube-presentation-motion-r1-2-review-runtime.webm');
const NATURAL_PATH = path.join(REVIEW, 'proai-cube-presentation-motion-r1-2-natural.png');
const SIMULTANEOUS_PATH = path.join(REVIEW, 'proai-cube-presentation-motion-r1-2-simultaneous.png');
const PAIRED_PATH = path.join(REVIEW, 'proai-cube-presentation-motion-r1-2-paired.png');
const LARGE_PATH = path.join(REVIEW, 'proai-cube-presentation-motion-r1-2-large-angle.png');
const GLB_PATH = path.join(ROOT, 'rubik_39_s_cube_animation.glb');

fs.mkdirSync(REVIEW, { recursive: true });

function sha256(filepath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filepath)).digest('hex');
}
function vectorDistance(a, b) {
  return Math.sqrt(a.reduce((sum, value, index) => sum + (value - b[index]) ** 2, 0));
}
function quatAngle(a, b) {
  const dot = Math.min(1, Math.abs(a.reduce((sum, value, index) => sum + value * b[index], 0)));
  return 2 * Math.acos(dot);
}
function ffprobe(filepath) {
  const out = spawnSync('ffprobe', ['-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries',
    'stream=codec_name,pix_fmt,avg_frame_rate,nb_read_frames,width,height:format=format_name,duration', '-of', 'json', filepath], { encoding: 'utf8' });
  if (out.status !== 0) throw new Error(`ffprobe failed for ${filepath}: ${out.stderr || out.stdout}`);
  return JSON.parse(out.stdout);
}
function runFfmpeg(args) {
  const out = spawnSync('ffmpeg', ['-y', '-v', 'error', ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (out.status !== 0) throw new Error(`ffmpeg failed: ${out.stderr || out.stdout}`);
}

const browser = await chromium.launch({ headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=swiftshader'] });
const requests = [];
const pageErrors = [];
const consoleErrors = [];
function wirePage(page) {
  page.on('request', (request) => requests.push(request.url()));
  page.on('pageerror', (error) => pageErrors.push(String(error)));
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
}
async function openPage(url, viewport, context = null) {
  const ownContext = context || await browser.newContext({ viewport });
  const page = await ownContext.newPage();
  if (!context) await page.setViewportSize(viewport);
  wirePage(page);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForFunction(() => (window.__PROAI_CUBE_R1_2 || window.__PROAI_CUBE_R1)?.ready === true, null, { timeout: 90000 });
  return { page, context: ownContext };
}
async function closePair(pair) {
  await pair.page.close();
  await pair.context.close();
}

// Mechanical + continuous-presentation QA.
const qaPair = await openPage(CAPTURE_URL, SCREENSHOT_VIEWPORT);
const qaPage = qaPair.page;
const initialDiagnostics = await qaPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const mechanicalQA = await qaPage.evaluate(() => window.__PROAI_CUBE_R1_2.runAutomatedQA());
const expectedGeometry = {
  faceOuterSize: 196.8, faceThickness: 3.6, faceCornerRadius: 10.6,
  faceBevelSize: 2.35, faceBevelThickness: 1.25, faceBevelSegments: 4, faceCurveSegments: 8,
  coreSize: 198, coreRadius: 9.2, coreSegments: 5,
};
const geometryConfigFrozen = JSON.stringify(initialDiagnostics.geometryConfig) === JSON.stringify(expectedGeometry);
const geometryStatsFrozen = initialDiagnostics.geometry?.faceMeshes === 180
  && initialDiagnostics.geometry?.coreMeshes === 30
  && initialDiagnostics.geometry?.nonPlaneMeshes === 210
  && Math.abs(initialDiagnostics.geometry?.faceGapRange?.min - 3.6999999999999886) < 1e-9
  && Math.abs(initialDiagnostics.geometry?.faceGapRange?.max - 8.199999999999932) < 1e-9
  && Math.abs(initialDiagnostics.geometry?.coreGapRange?.min - 2.5) < 1e-9
  && Math.abs(initialDiagnostics.geometry?.coreGapRange?.max - 6.999999999999943) < 1e-9;
const geometryCodeFrozen = process.env.PROAI_GEOMETRY_CODE_FROZEN === '1';
const presentationSamples = [];
for (const timeSec of [0, 4, 8, 12, 16, 18, 19]) {
  presentationSamples.push(await qaPage.evaluate((timeSec) => window.__PROAI_CUBE_R1_2.getReviewPresentationSample(timeSec), timeSec));
}
const full360Sample = presentationSamples.find((sample) => sample.timeSec === 18);
const post360Sample = presentationSamples.find((sample) => sample.timeSec === 19);
const full360Pass = full360Sample.signedYawDeg >= 360
  && Math.abs(post360Sample.signedYawDeg - full360Sample.signedYawDeg) > 5
  && Math.abs(post360Sample.velocityDegPerSec) > 5;
await closePair(qaPair);

// Deterministic interaction semantics QA.
const interactionPair = await openPage(REVIEW_URL, SCREENSHOT_VIEWPORT);
const interactionPage = interactionPair.page;
await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.stopSliceScheduler());
await interactionPage.waitForFunction(() => window.__PROAI_CUBE_R1_2.getDiagnostics().activeTurns.length === 0, null, { timeout: 5000 });
const manualSliceStarted = await interactionPage.evaluate(() => {
  void window.__PROAI_CUBE_R1_2.turnSlice({ axis: 'X', layer: 1, direction: 1, durationMs: 1320 });
  return window.__PROAI_CUBE_R1_2.getDiagnostics().activeTurns.length === 1;
});
if (!manualSliceStarted) throw new Error('Could not start deterministic interaction slice');
await interactionPage.waitForTimeout(110);
const liveBox = await interactionPage.evaluate(() => {
  const r = document.getElementById('cube-canvas').getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height };
});
const beforeDrag = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const dragTurn = { ...beforeDrag.activeTurns[0] };
const x0 = liveBox.x + liveBox.width * 0.50;
const y0 = liveBox.y + liveBox.height * 0.49;
await interactionPage.mouse.move(x0, y0);
await interactionPage.mouse.down();
for (let i = 1; i <= 9; i += 1) {
  await interactionPage.mouse.move(x0 + 175 * (i / 9), y0 - 22 * (i / 9));
  await interactionPage.waitForTimeout(18);
}
const duringDrag = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
await interactionPage.waitForFunction(() => window.__PROAI_CUBE_R1_2.getDiagnostics().activeTurns.length === 0, null, { timeout: 3000 });
const sliceFinishedWhileDrag = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const blockedNewSliceAttempt = await interactionPage.evaluate(async () => window.__PROAI_CUBE_R1_2.turnSlice({ axis: 'Y', layer: 0, direction: -1, durationMs: 1240 }));
await interactionPage.waitForTimeout(750);
const held = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const cameraAtHeldAngle = held.interaction.cameraPosition;
await interactionPage.mouse.up();
await interactionPage.waitForTimeout(80);
const afterRelease = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
await interactionPage.waitForTimeout(1050);
const duringCalm = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
await interactionPage.waitForTimeout(930);
const presentationReturned = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
await interactionPage.waitForTimeout(330);
const staggerWindow = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
await interactionPage.waitForTimeout(650);
const blended = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const activeSliceCompleted = sliceFinishedWhileDrag.lastTurnResult?.id === dragTurn.id
  && sliceFinishedWhileDrag.lastTurnResult?.endpointErrorRad === 0;
const nextSliceBlocked = blockedNewSliceAttempt === false && held.activeTurns.length === 0 && held.interaction.interactionActive;
const cameraNoSnap = vectorDistance(cameraAtHeldAngle, blended.interaction.cameraPosition) < 1.0;
const interactionPass = duringDrag.interaction.interactionActive
  && duringDrag.interaction.autonomyBlocked
  && activeSliceCompleted
  && nextSliceBlocked
  && !afterRelease.interaction.interactionActive
  && afterRelease.interaction.resumeDelayRemainingMs > 1500
  && duringCalm.interaction.autonomyBlocked
  && presentationReturned.interaction.presentationResumeActive
  && staggerWindow.interaction.sliceResumeDelayRemainingMs <= 80
  && cameraNoSnap;
await closePair(interactionPair);

// Static owner-review evidence.
async function screenshot(pathname, setup) {
  const pair = await openPage(CAPTURE_URL, SCREENSHOT_VIEWPORT);
  await pair.page.evaluate(setup);
  await pair.page.screenshot({ path: pathname, fullPage: true });
  await closePair(pair);
}
await screenshot(NATURAL_PATH, () => window.__PROAI_CUBE_R1_2.setReviewPresentation(2.8));
await screenshot(SIMULTANEOUS_PATH, () => {
  const api = window.__PROAI_CUBE_R1_2;
  api.setReviewPresentation(9.4);
  const turn = api.beginReviewTurn('Z', 1, 1);
  api.setReviewTurnProgress(turn.id, 0.54);
});
await screenshot(PAIRED_PATH, () => {
  const api = window.__PROAI_CUBE_R1_2;
  api.setReviewPresentation(11.2);
  const pair = api.beginReviewPair('X', -1, 1, 1, -1);
  api.setReviewPairProgress(pair.map((entry) => entry.id), 0.62, 0.43);
});
await screenshot(LARGE_PATH, () => window.__PROAI_CUBE_R1_2.setReviewPresentation(18.4));

// Real continuous runtime recording. Playwright's compositor video avoids per-frame canvas readback.
const videoContext = await browser.newContext({
  viewport: VIDEO_VIEWPORT,
  recordVideo: { dir: REVIEW, size: VIDEO_VIEWPORT },
});
const videoPage = await videoContext.newPage();
wirePage(videoPage);
await videoPage.goto(REVIEW_URL, { waitUntil: 'networkidle', timeout: 120000 });
await videoPage.waitForFunction(() => window.__PROAI_CUBE_R1_2?.ready === true, null, { timeout: 90000 });
const videoHandle = videoPage.video();
const traceStart = await videoPage.evaluate(() => {
  const api = window.__PROAI_CUBE_R1_2;
  const first = api.getDiagnostics();
  const start = performance.now();
  window.__R12_TRACE = [];
  window.__R12_TRACE_STOP = false;
  window.__R12_TRACE_START = start;
  window.__R12_START_CUMULATIVE_YAW = first.presentation.cumulativeYawDeg;
  function tick(now) {
    if (window.__R12_TRACE_STOP) return;
    const d = api.getDiagnostics();
    window.__R12_TRACE.push({
      t: (now - start) / 1000,
      q: d.presentation.quaternion,
      cumulativeYawDeg: d.presentation.cumulativeYawDeg,
      signedYawDeg: d.presentation.signedYawDeg,
      yawVelocityDegPerSec: d.presentation.yawVelocityDegPerSec,
      activeTurns: d.activeTurns.map((turn) => ({ id: turn.id, axis: turn.axis, layer: turn.layer, direction: turn.direction })),
      lastTurnSerial: d.lastTurnResult?.serial || 0,
      interactionActive: d.interaction.interactionActive,
      calmRemainingMs: d.interaction.resumeDelayRemainingMs,
      presentationResumeActive: d.interaction.presentationResumeActive,
      sliceResumeRemainingMs: d.interaction.sliceResumeDelayRemainingMs,
      cameraPosition: d.interaction.cameraPosition,
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  return { startCumulativeYawDeg: first.presentation.cumulativeYawDeg, camera: first.interaction.cameraPosition };
});

const runtimeWallStart = Date.now();
let full360WallSec = null;
let manualStarted = false;
let manualReleased = false;
let manualStartSec = null;
let manualReleaseSec = null;
let manualTurnId = null;
let activeSliceFinishedDuringHeldDrag = false;
let cameraAtManualRelease = null;

// Wait for a cumulative 360 after recording begins; keep scheduler fully autonomous through that phase.
await videoPage.waitForFunction((startYaw) => {
  const d = window.__PROAI_CUBE_R1_2.getDiagnostics();
  return d.presentation.cumulativeYawDeg - startYaw >= 360;
}, traceStart.startCumulativeYawDeg, { timeout: 24000, polling: 100 });
full360WallSec = (Date.now() - runtimeWallStart) / 1000;
await videoPage.waitForTimeout(650);

// Start the manual Orbit demo only when a single autonomous slice is already active.
try {
  await videoPage.waitForFunction(() => window.__PROAI_CUBE_R1_2.getDiagnostics().activeTurns.length === 1, null, { timeout: 3500, polling: 80 });
  const box = await videoPage.evaluate(() => {
    const r = document.getElementById('cube-canvas').getBoundingClientRect();
    const d = window.__PROAI_CUBE_R1_2.getDiagnostics();
    return { x: r.x, y: r.y, width: r.width, height: r.height, turnId: d.activeTurns[0]?.id || null };
  });
  if (box.turnId) {
    manualStarted = true;
    manualStartSec = (Date.now() - runtimeWallStart) / 1000;
    manualTurnId = box.turnId;
    const mx = box.x + box.width * 0.49;
    const my = box.y + box.height * 0.50;
    await videoPage.mouse.move(mx, my);
    await videoPage.mouse.down();
    for (let i = 1; i <= 12; i += 1) {
      const p = i / 12;
      await videoPage.mouse.move(mx + 185 * p, my - 25 * p);
      await videoPage.waitForTimeout(85);
      const d = await videoPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
      if (d.activeTurns.length === 0 && d.interaction.interactionActive && d.lastTurnResult?.id === manualTurnId) {
        activeSliceFinishedDuringHeldDrag = true;
      }
    }
    cameraAtManualRelease = (await videoPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics())).interaction.cameraPosition;
    await videoPage.mouse.up();
    manualReleased = true;
    manualReleaseSec = (Date.now() - runtimeWallStart) / 1000;
  }
} catch (error) {
  console.log(`Manual runtime demo window not acquired: ${error}`);
}

const elapsedAfterInteractionMs = Date.now() - runtimeWallStart;
const remainingMs = Math.max(0, VIDEO_SECONDS * 1000 - elapsedAfterInteractionMs);
if (remainingMs > 0) await videoPage.waitForTimeout(remainingMs);
const finalRuntimeDiagnostics = await videoPage.evaluate(() => {
  window.__R12_TRACE_STOP = true;
  return window.__PROAI_CUBE_R1_2.getDiagnostics();
});
const trace = await videoPage.evaluate(() => window.__R12_TRACE || []);
const videoEndCamera = finalRuntimeDiagnostics.interaction.cameraPosition;
await videoPage.close();
const recordedPath = await videoHandle.path();
await videoContext.close();
fs.copyFileSync(recordedPath, RAW_VIDEO_PATH);
await browser.close();

// Trim to the final 30 seconds of the compositor recording (removes page load) and encode required primary MP4.
runFfmpeg(['-sseof', `-${VIDEO_SECONDS}`, '-i', RAW_VIDEO_PATH, '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-movflags', '+faststart', MP4_PATH]);
const mp4Probe = ffprobe(MP4_PATH);
const rawProbe = ffprobe(RAW_VIDEO_PATH);
const mp4Stream = mp4Probe.streams[0];
const mp4Duration = Number(mp4Probe.format.duration);
const mp4Pass = mp4Stream.codec_name === 'h264'
  && mp4Stream.pix_fmt === 'yuv420p'
  && mp4Stream.avg_frame_rate === '24/1'
  && mp4Stream.width === VIDEO_VIEWPORT.width
  && mp4Stream.height === VIDEO_VIEWPORT.height
  && Math.abs(mp4Duration - VIDEO_SECONDS) < 0.35
  && String(mp4Probe.format.format_name).includes('mp4');

// Frame-level liveness metrics from actual browser requestAnimationFrame states.
let eligibleFrames = 0;
let presentationActiveFrames = 0;
let sliceActiveFrames = 0;
let overlapActiveFrames = 0;
let pairedActiveFrames = 0;
let longestBothStaticMs = 0;
let staticStartT = null;
let prevEligible = null;
let previousTurnSerial = 0;
let previousTurnFinishT = null;
let closeTurnFinishes = 0;
const observedAxes = new Set();
let pairedObserved = false;
let densePhraseObserved = false;
let sliceAround360 = false;
let first360Trace = null;
for (const state of trace) {
  for (const turn of state.activeTurns) observedAxes.add(turn.axis);
  if (state.activeTurns.length > 1) pairedObserved = true;
  if (state.lastTurnSerial && state.lastTurnSerial !== previousTurnSerial) {
    if (previousTurnFinishT !== null && state.t - previousTurnFinishT < 1.75) closeTurnFinishes += 1;
    previousTurnFinishT = state.t;
    previousTurnSerial = state.lastTurnSerial;
    if (closeTurnFinishes >= 2) densePhraseObserved = true;
  }
  if (!first360Trace && state.cumulativeYawDeg - traceStart.startCumulativeYawDeg >= 360) first360Trace = state;
  if (first360Trace && Math.abs(state.t - first360Trace.t) <= 2 && state.activeTurns.length > 0) sliceAround360 = true;

  const eligible = !state.interactionActive && state.calmRemainingMs <= 0;
  if (!eligible) {
    prevEligible = null;
    staticStartT = null;
    continue;
  }
  if (!prevEligible) {
    prevEligible = state;
    continue;
  }
  eligibleFrames += 1;
  const bodyDelta = quatAngle(prevEligible.q, state.q);
  const presentationActive = bodyDelta > 0.00004;
  const sliceActive = state.activeTurns.length > 0;
  if (presentationActive) presentationActiveFrames += 1;
  if (sliceActive) sliceActiveFrames += 1;
  if (presentationActive && sliceActive) overlapActiveFrames += 1;
  if (state.activeTurns.length > 1) pairedActiveFrames += 1;
  if (!presentationActive && !sliceActive) {
    if (staticStartT === null) staticStartT = prevEligible.t;
    longestBothStaticMs = Math.max(longestBothStaticMs, (state.t - staticStartT) * 1000);
  } else staticStartT = null;
  prevEligible = state;
}
const presentationActiveFrameRatio = presentationActiveFrames / Math.max(1, eligibleFrames);
const sliceActiveFrameRatio = sliceActiveFrames / Math.max(1, eligibleFrames);
const overlapActiveFrameRatio = overlapActiveFrames / Math.max(1, eligibleFrames);
const pairedActiveFrameRatio = pairedActiveFrames / Math.max(1, eligibleFrames);
const post360Trace = first360Trace ? trace.find((state) => state.t >= first360Trace.t + 0.75) : null;
const post360Continues = Boolean(first360Trace && post360Trace && post360Trace.cumulativeYawDeg > first360Trace.cumulativeYawDeg + 4);
const full360DuringRuntime = Boolean(first360Trace);
const cameraPreservedAfterRuntimeInteraction = !cameraAtManualRelease || vectorDistance(cameraAtManualRelease, videoEndCamera) < 1.0;
const recoveryTrace = manualReleaseSec === null ? [] : trace.filter((state) => state.t >= manualReleaseSec && state.t <= manualReleaseSec + 5.0);
const calmObserved = recoveryTrace.some((state) => state.calmRemainingMs > 1000);
const presentationResumeObserved = recoveryTrace.some((state) => state.presentationResumeActive);
const staggerObserved = recoveryTrace.some((state) => state.presentationResumeActive && state.sliceResumeRemainingMs > 0);
const runtimeInteractionPass = manualStarted && manualReleased && activeSliceFinishedDuringHeldDrag
  && cameraPreservedAfterRuntimeInteraction && calmObserved && presentationResumeObserved && staggerObserved;

const forbiddenRequests = requests.filter((url) => /splinetool|prod\.spline\.design|\.splinecode/i.test(url));
const axisPass = Object.fromEntries(Object.entries(mechanicalQA.axisSupport).map(([axis, result]) => [axis, result.forwardEndpointErrorRad === 0 && result.inverseEndpointErrorRad === 0 && result.restoredAfterPair]));
const layerPass = Object.values(mechanicalQA.layerSupport).every((layers) => Object.values(layers).every((entry) => entry.pass));
const runtimePass = pageErrors.length === 0 && consoleErrors.length === 0 && forbiddenRequests.length === 0;
const livenessPass = presentationActiveFrameRatio > 0.95
  && sliceActiveFrameRatio >= 0.55 && sliceActiveFrameRatio <= 0.75
  && overlapActiveFrameRatio >= 0.50
  && longestBothStaticMs <= 400;
const videoCoveragePass = observedAxes.has('X') && observedAxes.has('Y') && observedAxes.has('Z')
  && pairedObserved && densePhraseObserved && full360DuringRuntime && post360Continues && sliceAround360
  && runtimeInteractionPass;
const allPass = geometryConfigFrozen && geometryStatsFrozen && geometryCodeFrozen && full360Pass && interactionPass
  && axisPass.X && axisPass.Y && axisPass.Z && layerPass
  && mechanicalQA.repeatability30.pass && mechanicalQA.inverseRestoration.pass && mechanicalQA.pairedTurnQA.pass
  && runtimePass && mp4Pass && livenessPass && videoCoveragePass;

const autonomousVelocities = trace.filter((state) => !state.interactionActive && state.calmRemainingMs <= 0).map((state) => state.yawVelocityDegPerSec);
const qa = {
  generatedAt: new Date().toISOString(),
  source: {
    implementationBaseBranch: 'agent/proai-cube-presentation-motion-r1',
    implementationBaseCommit: 'd176101a818a9f7b00963a4ece13cd90d222a21c',
    geometryBaselineBranch: 'agent/proai-cube-geometry-r1',
    geometryBaselineCommit: '73082717909b6f4225841401fe4962d6ff4bbcca',
    branch: 'agent/proai-cube-presentation-motion-r1-2',
    prototypePath: 'docs/site-evolution/spline/proai-cube-presentation-motion-r1-2/',
    glbBytes: fs.statSync(GLB_PATH).size,
    glbSha256: sha256(GLB_PATH),
  },
  geometryFreeze: {
    config: initialDiagnostics.geometryConfig,
    stats: initialDiagnostics.geometry,
    configFrozen: geometryConfigFrozen,
    statsFrozen: geometryStatsFrozen,
    codeFrozen: geometryCodeFrozen,
    pass: geometryConfigFrozen && geometryStatsFrozen && geometryCodeFrozen,
  },
  presentation: {
    config: initialDiagnostics.presentationConfig,
    samples: presentationSamples,
    full360Pass,
    runtimeFirst360Sec: first360Trace?.t ?? null,
    runtimeFull360WallSec: full360WallSec,
    post360Continues,
    measuredYawVelocityRangeDegPerSec: autonomousVelocities.length ? [Math.min(...autonomousVelocities), Math.max(...autonomousVelocities)] : [],
  },
  sliceScheduler: {
    config: initialDiagnostics.sliceConfig,
    observedAxes: [...observedAxes],
    pairedObserved,
    densePhraseObserved,
    sliceAround360,
  },
  mechanicalQA,
  interactionQA: {
    deterministic: {
      dragTurn,
      activeSliceCompleted,
      blockedNewSliceAttempt,
      nextSliceBlocked,
      cameraNoSnap,
      pass: interactionPass,
    },
    ownerRuntime: {
      manualStarted,
      manualReleased,
      manualStartSec,
      manualReleaseSec,
      manualTurnId,
      activeSliceFinishedDuringHeldDrag,
      cameraPreservedAfterRuntimeInteraction,
      calmObserved,
      presentationResumeObserved,
      staggerObserved,
      pass: runtimeInteractionPass,
    },
  },
  liveness: {
    autonomousFrames: eligibleFrames,
    presentationActiveFrameRatio,
    sliceActiveFrameRatio,
    overlapActiveFrameRatio,
    pairedActiveFrameRatio,
    longestBothStaticAutonomousMs: longestBothStaticMs,
    pass: livenessPass,
  },
  video: {
    mp4: { path: 'review/' + path.basename(MP4_PATH), ...mp4Probe, byteLength: fs.statSync(MP4_PATH).size },
    rawWebm: { path: 'review/' + path.basename(RAW_VIDEO_PATH), ...rawProbe, byteLength: fs.statSync(RAW_VIDEO_PATH).size },
    fps: FPS,
    expectedDurationSec: VIDEO_SECONDS,
    viewport: VIDEO_VIEWPORT,
    traceFrames: trace.length,
    coverage: {
      continuousBodyPlusSlices: overlapActiveFrameRatio >= 0.50,
      XYZ: observedAxes.has('X') && observedAxes.has('Y') && observedAxes.has('Z'),
      densePhrase: densePhraseObserved,
      pairedLayer: pairedObserved,
      full360: full360DuringRuntime,
      sliceDuring360Window: sliceAround360,
      noStopAfter360: post360Continues,
      manualOrbit: manualStarted && manualReleased,
      activeSliceFinishesDuringInteraction: activeSliceFinishedDuringHeldDrag,
      selectedAnglePreserved: cameraPreservedAfterRuntimeInteraction,
      calmDelay: calmObserved,
      softRecovery: presentationResumeObserved,
      staggeredEngineReentry: staggerObserved,
    },
    pass: videoCoveragePass && mp4Pass,
  },
  runtime: { totalRequests: requests.length, forbiddenRequests, splineDependency: forbiddenRequests.length ? 'FOUND' : 'NONE', pageErrors, consoleErrors, pass: runtimePass },
  acceptance: {
    geometryR1Preserved: geometryConfigFrozen && geometryStatsFrozen && geometryCodeFrozen ? 'PASS' : 'FAIL',
    wholeCube360Continuous: full360Pass && full360DuringRuntime && post360Continues ? 'PASS' : 'FAIL',
    interaction: interactionPass && runtimeInteractionPass ? 'PASS' : 'FAIL',
    pairedTurns: mechanicalQA.pairedTurnQA.pass ? 'PASS' : 'FAIL',
    liveness: livenessPass ? 'PASS' : 'FAIL',
    X: axisPass.X ? 'PASS' : 'FAIL',
    Y: axisPass.Y ? 'PASS' : 'FAIL',
    Z: axisPass.Z ? 'PASS' : 'FAIL',
    layerSupport: layerPass ? 'PASS' : 'FAIL',
    repeatability30: mechanicalQA.repeatability30.pass ? 'PASS' : 'FAIL',
    inverseRestoration: mechanicalQA.inverseRestoration.pass ? 'PASS' : 'FAIL',
    runtime: runtimePass ? 'PASS' : 'FAIL',
    ownerReviewMP4: mp4Pass ? 'PASS' : 'FAIL',
    splineDependency: forbiddenRequests.length ? 'FOUND' : 'NONE',
    overall: allPass ? 'PASS' : 'FAIL',
  },
};
fs.writeFileSync(QA_PATH, JSON.stringify(qa, null, 2) + '\n');

const p = initialDiagnostics.presentationConfig;
const s = initialDiagnostics.sliceConfig;
const report = `# ProAI Rubik Cube — Presentation Motion R1.2\n\n## Scope\n\nContinuous dual-motion refactor from Presentation Motion R1.1 commit \`d176101a818a9f7b00963a4ece13cd90d222a21c\`. Geometry R1, temporary materials/lights, clean GLB and exact Rubik model remain locked.\n\n## Engine A — continuous whole-cube presentation\n\n- Normal yaw art-direction range: **${p.normalYawVelocityDegPerSec.join('–')}°/s**.\n- Strong inspection range: **${p.inspectionYawVelocityDegPerSec.join('–')}°/s**.\n- Pitch envelope: **±${p.pitchEnvelopeDeg}°**; roll envelope: **±${p.rollEnvelopeDeg}°**.\n- Measured autonomous yaw velocity: **${qa.presentation.measuredYawVelocityRangeDegPerSec.map((v) => v.toFixed(2)).join(' to ')}°/s**.\n- Cumulative 360 reached in live runtime at **${qa.presentation.runtimeFirst360Sec?.toFixed(2)} s** and motion continued afterward: **${qa.presentation.post360Continues ? 'PASS' : 'FAIL'}**.\n\n## Engine B — independent Rubik scheduler\n\n- Turn duration: **${s.turnDurationRangeMs.join('–')} ms**.\n- Typical event gap: **${s.typicalGapRangeMs.join('–')} ms**.\n- Breathing gap: **${s.breathingGapRangeMs.join('–')} ms**.\n- Paired-layer stagger: **${s.pairedStaggerRangeMs.join('–')} ms**.\n- Event distribution: **60% single / 20% paired same-axis distinct-layer / 20% tight phrase**.\n\n## Liveness\n\n- presentationActiveFrameRatio: **${presentationActiveFrameRatio.toFixed(4)}**.\n- sliceActiveFrameRatio: **${sliceActiveFrameRatio.toFixed(4)}**.\n- overlapActiveFrameRatio: **${overlapActiveFrameRatio.toFixed(4)}**.\n- longestBothStaticAutonomousMs: **${longestBothStaticMs.toFixed(1)} ms**.\n\n## QA\n\n- Geometry R1 preserved: **${qa.acceptance.geometryR1Preserved}**.\n- X / Y / Z: **${qa.acceptance.X} / ${qa.acceptance.Y} / ${qa.acceptance.Z}**.\n- 30 mixed turns: **${qa.acceptance.repeatability30}**; max position ${mechanicalQA.repeatability30.maxCanonicalPosition}; quaternion ${mechanicalQA.repeatability30.maxCanonicalQuaternionRad}; scale ${mechanicalQA.repeatability30.maxCanonicalScale}.\n- Inverse restoration: **${qa.acceptance.inverseRestoration}**.\n- Paired-turn safety/inverse: **${qa.acceptance.pairedTurns}**; cubie intersection ${mechanicalQA.pairedTurnQA.physicalCubieIntersectionCount}.\n- Interaction: **${qa.acceptance.interaction}**.\n- Browser/runtime: **${qa.acceptance.runtime}**; Spline dependency **${qa.acceptance.splineDependency}**.\n- Owner MP4: **${qa.acceptance.ownerReviewMP4}**, ${VIDEO_SECONDS.toFixed(3)} s @ ${FPS} fps, H.264/yuv420p, ${VIDEO_VIEWPORT.width}×${VIDEO_VIEWPORT.height}.\n\n## Review evidence\n\n- \`review/proai-cube-presentation-motion-r1-2-natural.png\`\n- \`review/proai-cube-presentation-motion-r1-2-simultaneous.png\`\n- \`review/proai-cube-presentation-motion-r1-2-paired.png\`\n- \`review/proai-cube-presentation-motion-r1-2-large-angle.png\`\n- \`review/proai-cube-presentation-motion-r1-2-review-30s.mp4\` (primary)\n- \`QA.json\`\n\n## Gate\n\nAutomated acceptance: **${qa.acceptance.overall}**. Materials + Lighting remain blocked pending owner visual review.\n`;
fs.writeFileSync(REPORT_PATH, report);

console.log(JSON.stringify({ acceptance: qa.acceptance, liveness: qa.liveness, presentation: qa.presentation, sliceScheduler: qa.sliceScheduler, interaction: qa.interactionQA, paired: mechanicalQA.pairedTurnQA, video: qa.video }, null, 2));
if (!allPass) process.exitCode = 1;
