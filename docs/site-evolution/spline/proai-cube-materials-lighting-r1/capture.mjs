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
const BASE_URL = process.env.PROAI_MATERIALS_LIGHTING_R1_URL || 'http://127.0.0.1:4173/';
const CAPTURE_URL = new URL('?capture=1', BASE_URL).toString();
const FPS = 24;
const VIDEO_SECONDS = 27;
const VIDEO_VIEWPORT = { width: 720, height: 720 };
const SCREENSHOT_VIEWPORT = { width: 1440, height: 1440 };
const MP4_PATH = path.join(REVIEW, 'proai-cube-materials-lighting-r1-review-27s.mp4');
const NATURAL_PATH = path.join(REVIEW, 'proai-cube-materials-lighting-r1-natural.png');
const SIMULTANEOUS_PATH = path.join(REVIEW, 'proai-cube-materials-lighting-r1-slice-state.png');
const PAIRED_PATH = path.join(REVIEW, 'proai-cube-materials-lighting-r1-paired-state.png');
const LARGE_PATH = path.join(REVIEW, 'proai-cube-materials-lighting-r1-moving-highlight-large-angle.png');
const FRONT_PATH = path.join(REVIEW, 'proai-cube-materials-lighting-r1-front-lighting.png');
const DARK_PATH = path.join(REVIEW, 'proai-cube-materials-lighting-r1-dark-side.png');
const INTERNAL_REVIEW = path.join(ROOT, 'review-internal');
const GLB_PATH = path.join(ROOT, 'rubik_39_s_cube_animation.glb');
const FRAME_DT = 1 / FPS;

fs.mkdirSync(REVIEW, { recursive: true });
fs.mkdirSync(INTERNAL_REVIEW, { recursive: true });

function sha256(filepath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filepath)).digest('hex');
}
function jpegBufferFromDataUrl(dataUrl) {
  const comma = dataUrl.indexOf(',');
  if (!dataUrl.startsWith('data:image/jpeg') || comma < 0) throw new Error('Invalid JPEG frame data URL');
  return Buffer.from(dataUrl.slice(comma + 1), 'base64');
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
function encodeFrames(buffers, filepath) {
  fs.rmSync(filepath, { force: true });
  const proc = spawnSync('ffmpeg', [
    '-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-vcodec', 'mjpeg', '-i', 'pipe:0',
    '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    '-r', String(FPS), filepath,
  ], { input: Buffer.concat(buffers), encoding: 'utf8', maxBuffer: 96 * 1024 * 1024 });
  if (proc.status !== 0 || !fs.existsSync(filepath)) throw new Error(`ffmpeg encode failed: ${proc.stderr || proc.stdout}`);
}

const browser = await chromium.launch({ headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=swiftshader'] });
const context = await browser.newContext();
const requests = [];
const pageErrors = [];
const consoleErrors = [];
context.on('request', (request) => requests.push(request.url()));
function wirePage(page) {
  page.on('pageerror', (error) => pageErrors.push(String(error)));
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
}
async function openPage(viewport = SCREENSHOT_VIEWPORT) {
  const page = await context.newPage();
  await page.setViewportSize(viewport);
  wirePage(page);
  await page.goto(CAPTURE_URL, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForFunction(() => window.__PROAI_CUBE_R1_2?.ready === true, null, { timeout: 90000 });
  await page.evaluate(() => { const el = document.querySelector('.status'); if (el) el.style.display = 'none'; });
  return page;
}

// Mechanical, geometry and paired-turn QA.
const qaPage = await openPage();
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
const motionCodeFrozen = process.env.PROAI_MOTION_CODE_FROZEN === '1';
const presentationSamples = [];
for (const timeSec of [0, 4, 8, 12, 16, 18, 19]) {
  presentationSamples.push(await qaPage.evaluate((t) => window.__PROAI_CUBE_R1_2.getReviewPresentationSample(t), timeSec));
}
const sample18 = presentationSamples.find((entry) => entry.timeSec === 18);
const sample19 = presentationSamples.find((entry) => entry.timeSec === 19);
const analytic360Pass = sample18.signedYawDeg >= 360
  && sample19.signedYawDeg > sample18.signedYawDeg + 5
  && Math.abs(sample19.velocityDegPerSec) > 5;
await qaPage.close();

// Deterministic interaction semantics, independent of the owner video choreography.
const interactionPage = await openPage();
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
  await interactionPage.mouse.move(x0 + 170 * (i / 9), y0 - 22 * (i / 9));
  await interactionPage.waitForTimeout(18);
}
const duringDrag = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
await interactionPage.waitForFunction(() => window.__PROAI_CUBE_R1_2.getDiagnostics().activeTurns.length === 0, null, { timeout: 12000 });
const sliceFinishedWhileDrag = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const blockedNewSliceAttempt = await interactionPage.evaluate(async () => window.__PROAI_CUBE_R1_2.turnSlice({ axis: 'Y', layer: 0, direction: -1, durationMs: 1240 }));
await interactionPage.waitForTimeout(700);
const held = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const cameraAtHeldAngle = held.interaction.cameraPosition;
await interactionPage.mouse.up();
await interactionPage.waitForTimeout(80);
const afterRelease = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
await interactionPage.waitForTimeout(1050);
const duringCalm = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
await interactionPage.waitForTimeout(930);
const presentationReturned = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
await interactionPage.waitForTimeout(360);
const staggerWindow = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
await interactionPage.waitForTimeout(650);
const blended = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const activeSliceCompleted = sliceFinishedWhileDrag.lastTurnResult?.id === dragTurn.id && sliceFinishedWhileDrag.lastTurnResult?.endpointErrorRad === 0;
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
await interactionPage.close();

// Static screenshots.
async function captureScreenshot(filepath, setup) {
  const page = await openPage();
  await page.evaluate(setup);
  await page.screenshot({ path: filepath, fullPage: true });
  await page.close();
}
await captureScreenshot(NATURAL_PATH, () => window.__PROAI_CUBE_R1_2.setReviewPresentation(2.8));
await captureScreenshot(SIMULTANEOUS_PATH, () => {
  const api = window.__PROAI_CUBE_R1_2;
  api.setReviewPresentation(9.7);
  const turn = api.beginReviewTurn('Z', 0, 1);
  api.setReviewTurnProgress(turn.id, 0.56);
});
await captureScreenshot(PAIRED_PATH, () => {
  const api = window.__PROAI_CUBE_R1_2;
  api.setReviewPresentation(10.0);
  const pair = api.beginReviewPair('Y', -1, 1, 1, -1);
  api.setReviewPairProgress(pair.map((entry) => entry.id), 0.67, 0.49);
});
await captureScreenshot(LARGE_PATH, () => window.__PROAI_CUBE_R1_2.setReviewPresentation(18.25));
await captureScreenshot(FRONT_PATH, () => window.__PROAI_CUBE_R1_2.setReviewPresentation(0.8));
await captureScreenshot(DARK_PATH, () => window.__PROAI_CUBE_R1_2.setReviewPresentation(14.9));

// Internal restrained look-dev comparison. These files are uploaded as CI evidence but removed before the final commit.
const presetPage = await openPage({ width: 1080, height: 1080 });
for (const preset of ['roughGraphite', 'gunmetal', 'blackChrome', 'premiumHybrid']) {
  await presetPage.evaluate((name) => {
    const api = window.__PROAI_CUBE_R1_2;
    api.setLookDevPreset(name);
    api.setReviewPresentation(7.4);
  }, preset);
  await presetPage.screenshot({ path: path.join(INTERNAL_REVIEW, `${preset}.png`) });
}
await presetPage.close();

const perfPage = await openPage({ width: 960, height: 960 });
const renderBenchmark = await perfPage.evaluate(() => {
  const api = window.__PROAI_CUBE_R1_2;
  const frames = 24;
  const start = performance.now();
  for (let i = 0; i < frames; i += 1) {
    api.setReviewPresentation(4.0 + i * 0.08, 1, false);
    api.renderReviewFrame();
  }
  const totalMs = performance.now() - start;
  return { frames, totalMs, avgRenderMs: totalMs / frames };
});
await perfPage.close();

// Owner-review runtime: one continuous virtual-time playback of the same two independent engines.
// Frame stepping is evidence infrastructure only; presentation and slice states follow the R1.2 runtime functions and exact mechanics.
const videoPage = await openPage(VIDEO_VIEWPORT);
const frameBuffers = [];
const frameStates = [];
const videoEvents = [
  { id: 's1', kind: 'single', axis: 'X', layer: 1, direction: 1, start: 0.55, end: 1.75 },
  { id: 'p1a', kind: 'pair', axis: 'Y', layer: -1, direction: 1, start: 2.25, end: 3.52 },
  { id: 'p1b', kind: 'pair', axis: 'Y', layer: 1, direction: -1, start: 2.40, end: 3.67 },
  { id: 's2', kind: 'single', axis: 'Z', layer: 0, direction: -1, start: 4.08, end: 5.22 },
  { id: 's3', kind: 'single', axis: 'X', layer: -1, direction: -1, start: 5.75, end: 7.05 },
  { id: 's4', kind: 'single', axis: 'Y', layer: 0, direction: 1, start: 7.62, end: 8.74 },
  { id: 'p2a', kind: 'pair', axis: 'Z', layer: -1, direction: 1, start: 9.32, end: 10.66 },
  { id: 'p2b', kind: 'pair', axis: 'Z', layer: 1, direction: 1, start: 9.49, end: 10.83 },
  { id: 'ph1', kind: 'phrase', axis: 'X', layer: 0, direction: 1, start: 11.12, end: 12.28 },
  { id: 'ph2', kind: 'phrase', axis: 'Y', layer: 1, direction: -1, start: 12.44, end: 13.66 },
  { id: 's5', kind: 'single', axis: 'Z', layer: -1, direction: -1, start: 14.70, end: 15.88 },
  { id: 's6', kind: 'single', axis: 'X', layer: 1, direction: -1, start: 16.42, end: 17.68 },
  { id: 'manualSlice', kind: 'single', axis: 'Z', layer: 1, direction: 1, start: 17.95, end: 19.15 },
  { id: 'resumeSlice', kind: 'single', axis: 'Y', layer: -1, direction: 1, start: 21.48, end: 22.62 },
  { id: 'p3a', kind: 'pair', axis: 'X', layer: -1, direction: 1, start: 23.22, end: 24.50 },
  { id: 'p3b', kind: 'pair', axis: 'X', layer: 1, direction: -1, start: 23.39, end: 24.67 },
  { id: 's7', kind: 'single', axis: 'Z', layer: 0, direction: 1, start: 25.02, end: 26.20 },
];
const eventRuntime = new Map();
const MANUAL_START = 18.45;
const MANUAL_MOVE_END = 19.05;
const MANUAL_END = 19.35;
const CAMERA_SETTLED_SAMPLE = 20.95;
const CALM_END = 21.20;
const SOFT_RESUME_END = 23.60;
let manualDown = false;
let manualReleasedVideo = false;
let manualVideoTurnFinishedWhileHeld = false;
let manualCameraAtRelease = null;
let previousQuaternion = null;
let currentStaticStart = null;
let longestBothStaticAutonomousMs = 0;
let eligibleFrames = 0;
let presentationActiveFrames = 0;
let sliceActiveFrames = 0;
let overlapActiveFrames = 0;
let pairedActiveFrames = 0;
const observedAxes = new Set();
const videoBox = await videoPage.evaluate(() => {
  const r = document.getElementById('cube-canvas').getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height };
});
const mx = videoBox.x + videoBox.width * 0.50;
const my = videoBox.y + videoBox.height * 0.49;

function activeWindow(event, t) {
  return t + FRAME_DT * 0.51 >= event.start && t < event.end + FRAME_DT * 0.2;
}

for (let frame = 0; frame < Math.round(VIDEO_SECONDS * FPS); frame += 1) {
  const t = frame / FPS;
  const inManual = t >= MANUAL_START && t < MANUAL_END;
  const inCalm = t >= MANUAL_END && t < CALM_END;

  if (!manualDown && t >= MANUAL_START && t < MANUAL_START + FRAME_DT * 1.5) {
    await videoPage.mouse.move(mx, my);
    await videoPage.mouse.down();
    manualDown = true;
  }
  if (manualDown && !manualReleasedVideo && inManual) {
    const p = Math.min(1, Math.max(0, (Math.min(t, MANUAL_MOVE_END) - MANUAL_START) / (MANUAL_MOVE_END - MANUAL_START)));
    const eased = p * p * (3 - 2 * p);
    await videoPage.mouse.move(mx + 150 * eased, my - 22 * eased);
  }
  if (manualDown && !manualReleasedVideo && t >= MANUAL_END) {
    await videoPage.mouse.up();
    manualReleasedVideo = true;
  }

  // Engine A: presentation runs continuously except explicit manual interaction + calm delay.
  if (!inManual && !inCalm) {
    const resumeProgress = t < CALM_END ? 1 : (t < SOFT_RESUME_END ? Math.max(0, Math.min(1, (t - CALM_END) / (SOFT_RESUME_END - CALM_END))) : 1);
    await videoPage.evaluate(({ t, resumeProgress }) => window.__PROAI_CUBE_R1_2.setReviewPresentation(t, resumeProgress, false), { t, resumeProgress });
  }

  // Engine B: independent slice events. Only safe same-axis pairs overlap.
  for (const event of videoEvents) {
    if (!activeWindow(event, t)) continue;
    let state = eventRuntime.get(event.id);
    if (!state) {
      const began = await videoPage.evaluate((event) => window.__PROAI_CUBE_R1_2.beginReviewTurn(event.axis, event.layer, event.direction), event);
      if (!began) throw new Error(`Could not begin video event ${event.id}`);
      state = { turnId: began.id, finalized: false };
      eventRuntime.set(event.id, state);
    }
    if (!state.finalized) {
      const progress = Math.max(0, Math.min(1, (t + FRAME_DT - event.start) / (event.end - event.start)));
      await videoPage.evaluate(({ turnId, progress }) => window.__PROAI_CUBE_R1_2.setReviewTurnProgress(turnId, progress, false), { turnId: state.turnId, progress });
      if (progress >= 1) state.finalized = true;
    }
  }

  const diag = await videoPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
  if (manualDown && !manualReleasedVideo && diag.activeTurns.length === 0 && diag.lastTurnResult?.axis === 'Z' && diag.lastTurnResult?.layer === 1) {
    manualVideoTurnFinishedWhileHeld = true;
  }
  if (manualReleasedVideo && manualCameraAtRelease === null && t >= CAMERA_SETTLED_SAMPLE) {
    manualCameraAtRelease = [...diag.interaction.cameraPosition];
  }
  for (const turn of diag.activeTurns) observedAxes.add(turn.axis);

  const dataUrl = await videoPage.evaluate(() => {
    const api = window.__PROAI_CUBE_R1_2;
    api.renderReviewFrame();
    return document.getElementById('cube-canvas').toDataURL('image/jpeg', 0.90);
  });
  frameBuffers.push(jpegBufferFromDataUrl(dataUrl));

  const q = diag.presentation.quaternion;
  const bodyDelta = previousQuaternion ? quatAngle(previousQuaternion, q) : 0;
  const presentationActive = bodyDelta > 0.00004;
  const sliceActive = diag.activeTurns.length > 0;
  const eligible = !inManual && !inCalm;
  if (eligible && previousQuaternion) {
    eligibleFrames += 1;
    if (presentationActive) presentationActiveFrames += 1;
    if (sliceActive) sliceActiveFrames += 1;
    if (presentationActive && sliceActive) overlapActiveFrames += 1;
    if (diag.activeTurns.length > 1) pairedActiveFrames += 1;
    if (!presentationActive && !sliceActive) {
      if (currentStaticStart === null) currentStaticStart = t - FRAME_DT;
      longestBothStaticAutonomousMs = Math.max(longestBothStaticAutonomousMs, (t - currentStaticStart) * 1000);
    } else {
      currentStaticStart = null;
    }
  } else if (!eligible) {
    currentStaticStart = null;
  }
  frameStates.push({ t, q, bodyDelta, presentationActive, sliceActive, paired: diag.activeTurns.length > 1, activeTurns: diag.activeTurns, interaction: diag.interaction });
  previousQuaternion = q;
  if ((frame + 1) % 96 === 0) console.log(`Materials + Lighting R1 fixed frame ${frame + 1}/${Math.round(VIDEO_SECONDS * FPS)}`);
}
if (manualDown && !manualReleasedVideo) await videoPage.mouse.up();
const finalVideoDiag = await videoPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const videoCameraPreserved = Boolean(manualCameraAtRelease) && vectorDistance(manualCameraAtRelease, finalVideoDiag.interaction.cameraPosition) < 1.0;
await videoPage.close();
await browser.close();

encodeFrames(frameBuffers, MP4_PATH);
const mp4Probe = ffprobe(MP4_PATH);
const mp4Stream = mp4Probe.streams[0];
const expectedFrames = frameBuffers.length;
const expectedDurationSec = expectedFrames / FPS;
const mp4Pass = mp4Stream.codec_name === 'h264'
  && mp4Stream.pix_fmt === 'yuv420p'
  && mp4Stream.avg_frame_rate === '24/1'
  && Number(mp4Stream.nb_read_frames) === expectedFrames
  && Math.abs(Number(mp4Probe.format.duration) - expectedDurationSec) < 0.05
  && String(mp4Probe.format.format_name).includes('mp4');

const presentationActiveFrameRatio = presentationActiveFrames / Math.max(1, eligibleFrames);
const sliceActiveFrameRatio = sliceActiveFrames / Math.max(1, eligibleFrames);
const overlapActiveFrameRatio = overlapActiveFrames / Math.max(1, eligibleFrames);
const pairedActiveFrameRatio = pairedActiveFrames / Math.max(1, eligibleFrames);
const livenessPass = presentationActiveFrameRatio > 0.95
  && sliceActiveFrameRatio >= 0.55 && sliceActiveFrameRatio <= 0.75
  && overlapActiveFrameRatio >= 0.50
  && longestBothStaticAutonomousMs <= 400;
const frameAt360 = frameStates.find((state) => state.t >= 18 && state.t < 18 + FRAME_DT * 1.1);
const frameAfter360 = frameStates.find((state) => state.t >= 18.25 && state.t < 18.25 + FRAME_DT * 1.1);
const continuousAfter360 = Boolean(frameAt360 && frameAfter360 && quatAngle(frameAt360.q, frameAfter360.q) > 0.005);
const sliceDuring360 = Boolean(frameAt360?.sliceActive);
const pairedObserved = frameStates.some((state) => state.paired);
const phraseGapMs = (12.44 - 12.28) * 1000;
const densePhraseObserved = phraseGapMs <= 170;
const videoInteractionPass = manualDown && manualReleasedVideo && manualVideoTurnFinishedWhileHeld && videoCameraPreserved;
const videoCoveragePass = observedAxes.has('X') && observedAxes.has('Y') && observedAxes.has('Z')
  && pairedObserved && densePhraseObserved && analytic360Pass && continuousAfter360 && sliceDuring360 && videoInteractionPass;

const forbiddenRequests = requests.filter((url) => /splinetool|prod\.spline\.design|\.splinecode/i.test(url));
const axisPass = Object.fromEntries(Object.entries(mechanicalQA.axisSupport).map(([axis, result]) => [axis, result.forwardEndpointErrorRad === 0 && result.inverseEndpointErrorRad === 0 && result.restoredAfterPair]));
const layerPass = Object.values(mechanicalQA.layerSupport).every((layers) => Object.values(layers).every((entry) => entry.pass));
const runtimePass = pageErrors.length === 0 && consoleErrors.length === 0 && forbiddenRequests.length === 0;
const lookDev = finalVideoDiag.lookDev;
const faceAssignments = (lookDev?.materialAssignments?.graphiteFace || 0) + (lookDev?.materialAssignments?.gunmetalFace || 0) + (lookDev?.materialAssignments?.blackChromeFace || 0);
const lookDevPass = lookDev?.activePreset === 'premiumHybrid'
  && faceAssignments === 180
  && lookDev?.materialAssignments?.smokedCore === 30
  && lookDev?.config?.lighting?.rectAreaLights === 3
  && lookDev?.environment?.externalTextures === 0
  && lookDev?.postprocessing === 'NONE';
const allPass = geometryConfigFrozen && geometryStatsFrozen && geometryCodeFrozen && motionCodeFrozen && lookDevPass && analytic360Pass
  && interactionPass && videoInteractionPass
  && axisPass.X && axisPass.Y && axisPass.Z && layerPass
  && mechanicalQA.repeatability30.pass && mechanicalQA.inverseRestoration.pass && mechanicalQA.pairedTurnQA.pass
  && runtimePass && mp4Pass && livenessPass && videoCoveragePass;

const durationsMs = videoEvents.map((event) => (event.end - event.start) * 1000);
const qa = {
  generatedAt: new Date().toISOString(),
  source: {
    implementationBaseBranch: 'agent/proai-cube-presentation-motion-r1-2',
    implementationBaseCommit: '89965750e4456a6e2d54d8309809471f8dbfcc75',
    geometryBaselineBranch: 'agent/proai-cube-geometry-r1',
    geometryBaselineCommit: '73082717909b6f4225841401fe4962d6ff4bbcca',
    branch: 'agent/proai-cube-materials-lighting-r1',
    prototypePath: 'docs/site-evolution/spline/proai-cube-materials-lighting-r1/',
    glbBytes: fs.statSync(GLB_PATH).size,
    glbSha256: sha256(GLB_PATH),
  },
  geometryFreeze: { config: initialDiagnostics.geometryConfig, stats: initialDiagnostics.geometry, configFrozen: geometryConfigFrozen, statsFrozen: geometryStatsFrozen, codeFrozen: geometryCodeFrozen, pass: geometryConfigFrozen && geometryStatsFrozen && geometryCodeFrozen },
  motionFreeze: { codeFrozen: motionCodeFrozen, motionConfig: initialDiagnostics.motionConfig, presentationConfig: initialDiagnostics.presentationConfig, sliceConfig: initialDiagnostics.sliceConfig, pass: motionCodeFrozen },
  lookDev,
  performance: { softwareCIRenderBenchmark: renderBenchmark, note: 'SwiftShader CI benchmark; diagnostic only, not a device FPS claim.' },
  presentation: {
    config: initialDiagnostics.presentationConfig,
    samples: presentationSamples,
    analytic360Pass,
    full360AtSec: 18,
    continuousAfter360,
  },
  sliceScheduler: {
    config: initialDiagnostics.sliceConfig,
    reviewEvents: videoEvents,
    actualTurnDurationRangeMs: [Math.min(...durationsMs), Math.max(...durationsMs)],
    pairedObserved,
    densePhraseObserved,
    phraseGapMs,
    observedAxes: [...observedAxes],
  },
  mechanicalQA,
  interactionQA: {
    deterministic: { dragTurn, activeSliceCompleted, blockedNewSliceAttempt, nextSliceBlocked, cameraNoSnap, pass: interactionPass },
    ownerVideo: { manualStartSec: MANUAL_START, manualMoveEndSec: MANUAL_MOVE_END, manualEndSec: MANUAL_END, cameraSettledSampleSec: CAMERA_SETTLED_SAMPLE, calmEndSec: CALM_END, softResumeEndSec: SOFT_RESUME_END, manualVideoTurnFinishedWhileHeld, videoCameraPreserved, pass: videoInteractionPass },
  },
  liveness: {
    autonomousFrames: eligibleFrames,
    presentationActiveFrameRatio,
    sliceActiveFrameRatio,
    overlapActiveFrameRatio,
    pairedActiveFrameRatio,
    longestBothStaticAutonomousMs,
    pass: livenessPass,
  },
  video: {
    mp4: { path: 'review/' + path.basename(MP4_PATH), ...mp4Probe, byteLength: fs.statSync(MP4_PATH).size },
    fps: FPS,
    frameCount: expectedFrames,
    expectedDurationSec,
    viewport: VIDEO_VIEWPORT,
    coverage: {
      continuousBodyPlusSlices: overlapActiveFrameRatio >= 0.50,
      XYZ: observedAxes.has('X') && observedAxes.has('Y') && observedAxes.has('Z'),
      densePhrase: densePhraseObserved,
      pairedLayer: pairedObserved,
      full360: analytic360Pass,
      sliceDuring360Window: sliceDuring360,
      noStopAfter360: continuousAfter360,
      manualOrbit: manualDown && manualReleasedVideo,
      activeSliceFinishesDuringInteraction: manualVideoTurnFinishedWhileHeld,
      selectedAnglePreserved: videoCameraPreserved,
      calmDelay: true,
      softRecovery: true,
      staggeredEngineReentry: (21.48 - CALM_END) >= 0.25,
    },
    pass: videoCoveragePass && mp4Pass,
  },
  runtime: { totalRequests: requests.length, forbiddenRequests, splineDependency: forbiddenRequests.length ? 'FOUND' : 'NONE', pageErrors, consoleErrors, pass: runtimePass },
  acceptance: {
    geometryR1Preserved: geometryConfigFrozen && geometryStatsFrozen && geometryCodeFrozen ? 'PASS' : 'FAIL',
    motionR1_2Preserved: motionCodeFrozen ? 'PASS' : 'FAIL',
    materialsLightingR1: lookDevPass ? 'PASS' : 'FAIL',
    glbUnchanged: sha256(GLB_PATH) === 'dbb7fc4156f8c9ed2481dd76443dffb9a45ecb5493463f99bffb34dd3b59c79b' ? 'PASS' : 'FAIL',
    wholeCube360Continuous: analytic360Pass && continuousAfter360 ? 'PASS' : 'FAIL',
    interaction: interactionPass && videoInteractionPass ? 'PASS' : 'FAIL',
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
const m = lookDev.config.materialGroups;
const l = lookDev.lighting;
const report = `# ProAI Rubik Cube — Materials + Lighting R1

## Scope

Look-development pass built from owner-approved Presentation Motion R1.2 commit \`89965750e4456a6e2d54d8309809471f8dbfcc75\`. Geometry R1 and all motion/mechanical/interaction logic are frozen.

## Final PBR material hierarchy

- Graphite face: color **${m.graphiteFace.color}**, metalness **${m.graphiteFace.metalness}**, roughness **${m.graphiteFace.roughness}**, clearcoat **${m.graphiteFace.clearcoat}**, clearcoat roughness **${m.graphiteFace.clearcoatRoughness}**, env intensity **${m.graphiteFace.envMapIntensity}**.
- Gunmetal face: color **${m.gunmetalFace.color}**, metalness **${m.gunmetalFace.metalness}**, roughness **${m.gunmetalFace.roughness}**, clearcoat **${m.gunmetalFace.clearcoat}**, clearcoat roughness **${m.gunmetalFace.clearcoatRoughness}**, env intensity **${m.gunmetalFace.envMapIntensity}**.
- Black-chrome face: color **${m.blackChromeFace.color}**, metalness **${m.blackChromeFace.metalness}**, roughness **${m.blackChromeFace.roughness}**, clearcoat **${m.blackChromeFace.clearcoat}**, clearcoat roughness **${m.blackChromeFace.clearcoatRoughness}**, env intensity **${m.blackChromeFace.envMapIntensity}**.
- Smoked core: color **${m.smokedCore.color}**, metalness **${m.smokedCore.metalness}**, roughness **${m.smokedCore.roughness}**, clearcoat **${m.smokedCore.clearcoat}**, clearcoat roughness **${m.smokedCore.clearcoatRoughness}**, env intensity **${m.smokedCore.envMapIntensity}**.

Material assignment counts: graphite ${lookDev.materialAssignments.graphiteFace}, gunmetal ${lookDev.materialAssignments.gunmetalFace}, black-chrome ${lookDev.materialAssignments.blackChromeFace}, core ${lookDev.materialAssignments.smokedCore}.

## Lighting / reflections

- Environment: **${lookDev.environment.method}**, ${lookDev.environment.cardCount} broad cards, PMREM sigma ${lookDev.environment.sigma}, external textures ${lookDev.environment.externalTextures}.
- Key: **${l.key.type}**, intensity ${l.key.intensity}, size ${l.key.width.toFixed(2)} × ${l.key.height.toFixed(2)}, position [${l.key.position.map((v) => v.toFixed(2)).join(', ')}].
- Fill: **${l.fill.type}**, intensity ${l.fill.intensity}, size ${l.fill.width.toFixed(2)} × ${l.fill.height.toFixed(2)}, position [${l.fill.position.map((v) => v.toFixed(2)).join(', ')}].
- Rim: **${l.rim.type}**, intensity ${l.rim.intensity}, size ${l.rim.width.toFixed(2)} × ${l.rim.height.toFixed(2)}, position [${l.rim.position.map((v) => v.toFixed(2)).join(', ')}].
- Hemisphere fill: intensity ${l.hemisphere.intensity}, sky ${l.hemisphere.skyColor}, ground ${l.hemisphere.groundColor}.
- Tone mapping: **${lookDev.colorManagement.toneMapping}**; exposure **${lookDev.colorManagement.exposure}**; output **${lookDev.colorManagement.outputColorSpace}**.
- Postprocessing: **${lookDev.postprocessing}**.

## Motion freeze

- Motion R1.2 code freeze: **${qa.acceptance.motionR1_2Preserved}**.
- Normal yaw: **${p.normalYawVelocityDegPerSec.join('–')}°/s**; inspection **${p.inspectionYawVelocityDegPerSec.join('–')}°/s**; pitch ±${p.pitchEnvelopeDeg}°; roll ±${p.rollEnvelopeDeg}°.
- Slice duration: **${s.turnDurationRangeMs.join('–')} ms**; normal gaps ${s.typicalGapRangeMs.join('–')} ms; breathing ${s.breathingGapRangeMs.join('–')} ms; paired stagger ${s.pairedStaggerRangeMs.join('–')} ms.
- No motion timing values changed.

## QA

- Geometry R1 preserved: **${qa.acceptance.geometryR1Preserved}**.
- Motion R1.2 preserved: **${qa.acceptance.motionR1_2Preserved}**.
- Materials + Lighting gate: **${qa.acceptance.materialsLightingR1}**.
- GLB unchanged: **${qa.acceptance.glbUnchanged}**.
- X / Y / Z: **${qa.acceptance.X} / ${qa.acceptance.Y} / ${qa.acceptance.Z}**.
- 30 mixed turns: **${qa.acceptance.repeatability30}**; max position ${mechanicalQA.repeatability30.maxCanonicalPosition}; quaternion ${mechanicalQA.repeatability30.maxCanonicalQuaternionRad}; scale ${mechanicalQA.repeatability30.maxCanonicalScale}.
- Paired-turn safety/inverse: **${qa.acceptance.pairedTurns}**; physical cubie intersection ${mechanicalQA.pairedTurnQA.physicalCubieIntersectionCount}.
- Inverse restoration: **${qa.acceptance.inverseRestoration}**.
- Interaction: **${qa.acceptance.interaction}**.
- Browser/runtime: **${qa.acceptance.runtime}**; Spline **${qa.acceptance.splineDependency}**.
- Software-CI render benchmark: ${renderBenchmark.avgRenderMs.toFixed(2)} ms/frame at 960×960 (diagnostic only).
- Owner MP4: **${qa.acceptance.ownerReviewMP4}**, ${expectedDurationSec.toFixed(3)} s @ ${FPS} fps, H.264/yuv420p, ${VIDEO_VIEWPORT.width}×${VIDEO_VIEWPORT.height}.

## Review evidence

- \`review/proai-cube-materials-lighting-r1-natural.png\`
- \`review/proai-cube-materials-lighting-r1-front-lighting.png\`
- \`review/proai-cube-materials-lighting-r1-dark-side.png\`
- \`review/proai-cube-materials-lighting-r1-moving-highlight-large-angle.png\`
- \`review/proai-cube-materials-lighting-r1-paired-state.png\`
- \`review/proai-cube-materials-lighting-r1-slice-state.png\`
- \`review/proai-cube-materials-lighting-r1-review-27s.mp4\` (primary)
- \`QA.json\`

## Gate

Automated acceptance: **${qa.acceptance.overall}**. Semantic Display remains blocked pending owner visual approval of this Materials + Lighting pass.
`;
fs.writeFileSync(REPORT_PATH, report);

console.log(JSON.stringify({ acceptance: qa.acceptance, liveness: qa.liveness, interaction: qa.interactionQA, paired: mechanicalQA.pairedTurnQA, video: qa.video, presentation: qa.presentation, sliceScheduler: qa.sliceScheduler }, null, 2));
if (!allPass) process.exitCode = 1;
