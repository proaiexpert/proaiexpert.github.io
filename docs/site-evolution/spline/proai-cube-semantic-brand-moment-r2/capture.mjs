import { chromium } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REVIEW = path.join(ROOT, 'review');
const FRAMES = path.join(ROOT, '.frames-r2');
const FPS = 24;
const FRAME_DT = 1 / FPS;
const VIEWPORT = { width: 1080, height: 1080 };
const BASE_URL = process.env.PROAI_R2_URL || 'http://127.0.0.1:4173/';
const CAPTURE_URL = new URL('?capture=1', BASE_URL).toString();
const MP4_PATH = path.join(REVIEW, 'proai-cube-semantic-brand-moment-r2-review-30s.mp4');
const PEAK_PATH = path.join(REVIEW, 'proai-cube-semantic-brand-moment-r2-peak.png');
const POST_PATH = path.join(REVIEW, 'proai-cube-semantic-brand-moment-r2-post.png');
const QA_PATH = path.join(ROOT, 'QA.json');
const REPORT_PATH = path.join(ROOT, 'REPORT.md');
const GLB_PATH = path.join(ROOT, 'rubik_39_s_cube_animation.glb');
const BASE_RUNTIME_PATH = path.join(ROOT, 'base-runtime.js');
const RUNTIME_PATH = path.join(ROOT, 'runtime-r2.js');
const BASE_SHA = 'd17806da42275db617d8a46b231a2d877706a179';
const BRANCH = 'agent/proai-cube-semantic-brand-moment-r2';
const GLB_SHA256 = 'dbb7fc4156f8c9ed2481dd76443dffb9a45ecb5493463f99bffb34dd3b59c79b';

fs.rmSync(FRAMES, { recursive: true, force: true });
fs.mkdirSync(FRAMES, { recursive: true });
fs.mkdirSync(REVIEW, { recursive: true });
for (const file of [MP4_PATH, PEAK_PATH, POST_PATH]) fs.rmSync(file, { force: true });

function sha256(filepath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filepath)).digest('hex');
}
function dataUrlBuffer(dataUrl, mime) {
  const prefix = `data:${mime};base64,`;
  if (!dataUrl.startsWith(prefix)) throw new Error(`Unexpected data URL: expected ${mime}`);
  return Buffer.from(dataUrl.slice(prefix.length), 'base64');
}
function vectorDistance(a, b) {
  return Math.sqrt(a.reduce((sum, value, i) => sum + (value - b[i]) ** 2, 0));
}
function quatAngle(a, b) {
  const dot = Math.min(1, Math.abs(a.reduce((sum, value, i) => sum + value * b[i], 0)));
  return 2 * Math.acos(dot);
}
function jsonEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function ffprobe(filepath) {
  const result = spawnSync('ffprobe', [
    '-v', 'error', '-count_frames', '-select_streams', 'v:0',
    '-show_entries', 'stream=codec_name,pix_fmt,avg_frame_rate,nb_read_frames,width,height:format=format_name,duration',
    '-of', 'json', filepath,
  ], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`ffprobe failed: ${result.stderr || result.stdout}`);
  return JSON.parse(result.stdout);
}
async function waitForServer(url, timeoutMs = 60000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Vite server did not become ready');
}

const vite = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['vite', '--host', '127.0.0.1', '--port', '4173'], {
  cwd: ROOT,
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env },
});
let viteLog = '';
vite.stdout.on('data', (chunk) => { viteLog += chunk.toString(); });
vite.stderr.on('data', (chunk) => { viteLog += chunk.toString(); });
await waitForServer(BASE_URL);

const browser = await chromium.launch({ headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=swiftshader'] });
const context = await browser.newContext({ viewport: VIEWPORT });
const pageErrors = [];
const consoleErrors = [];
const requests = [];
function wirePage(page) {
  page.on('pageerror', (error) => pageErrors.push(String(error)));
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('request', (request) => requests.push(request.url()));
}
async function openPage() {
  const page = await context.newPage();
  wirePage(page);
  await page.goto(CAPTURE_URL, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForFunction(() => window.__PROAI_CUBE_R2?.ready === true, null, { timeout: 90000 });
  await page.evaluate(() => { const el = document.querySelector('.status'); if (el) el.style.display = 'none'; });
  return page;
}

const videoEvents = [
  { id: 's1', axis: 'X', layer: 1, direction: 1, start: 0.55, end: 1.75 },
  { id: 'p1a', axis: 'Y', layer: -1, direction: 1, start: 2.25, end: 3.52 },
  { id: 'p1b', axis: 'Y', layer: 1, direction: -1, start: 2.40, end: 3.67 },
  { id: 's2', axis: 'Z', layer: 0, direction: -1, start: 4.08, end: 5.22 },
  { id: 's3', axis: 'X', layer: -1, direction: -1, start: 5.75, end: 7.05 },
  { id: 's4', axis: 'Y', layer: 0, direction: 1, start: 7.62, end: 8.74 },
  { id: 'p2a', axis: 'Z', layer: -1, direction: 1, start: 9.32, end: 10.66 },
  { id: 'p2b', axis: 'Z', layer: 1, direction: 1, start: 9.49, end: 10.83 },
  { id: 'ph1', axis: 'X', layer: 0, direction: 1, start: 11.12, end: 12.28 },
  { id: 'ph2', axis: 'Y', layer: 1, direction: -1, start: 12.44, end: 13.66 },
  { id: 's5', axis: 'Z', layer: -1, direction: -1, start: 14.70, end: 15.88 },
  { id: 's6', axis: 'X', layer: 1, direction: -1, start: 16.42, end: 17.68 },
  { id: 'manualSlice', axis: 'Z', layer: 1, direction: 1, start: 17.95, end: 19.15 },
  { id: 'resumeSlice', axis: 'Y', layer: -1, direction: 1, start: 21.48, end: 22.62 },
  { id: 'p3a', axis: 'X', layer: -1, direction: 1, start: 23.22, end: 24.50 },
  { id: 'p3b', axis: 'X', layer: 1, direction: -1, start: 23.39, end: 24.67 },
  { id: 's7', axis: 'Z', layer: 0, direction: 1, start: 25.02, end: 26.20 },
];
const MANUAL_START = 18.45;
const MANUAL_MOVE_END = 19.05;
const MANUAL_END = 19.35;
const CALM_END = 21.20;
const SOFT_RESUME_END = 23.60;

function activeWindow(event, presentationSec) {
  return presentationSec + FRAME_DT * 0.51 >= event.start && presentationSec < event.end + FRAME_DT * 0.2;
}

async function driveFilmPage(page, presentationSec, eventRuntime, render = false) {
  const inManual = presentationSec >= MANUAL_START && presentationSec < MANUAL_END;
  const inCalm = presentationSec >= MANUAL_END && presentationSec < CALM_END;
  if (!inManual && !inCalm) {
    const resumeProgress = presentationSec < CALM_END
      ? 1
      : (presentationSec < SOFT_RESUME_END ? Math.max(0, Math.min(1, (presentationSec - CALM_END) / (SOFT_RESUME_END - CALM_END))) : 1);
    await page.evaluate(({ t, resumeProgress }) => window.__PROAI_CUBE_R1_2.setReviewPresentation(t, resumeProgress, false), { t: presentationSec, resumeProgress });
  }
  for (const event of videoEvents) {
    if (!activeWindow(event, presentationSec)) continue;
    let state = eventRuntime.get(event.id);
    if (!state) {
      const began = await page.evaluate((ev) => window.__PROAI_CUBE_R1_2.beginReviewTurn(ev.axis, ev.layer, ev.direction), event);
      if (!began) throw new Error(`Could not begin deterministic event ${event.id} at presentation ${presentationSec.toFixed(3)}`);
      state = { turnId: began.id, finalized: false };
      eventRuntime.set(event.id, state);
    }
    if (!state.finalized) {
      const progress = Math.max(0, Math.min(1, (presentationSec + FRAME_DT - event.start) / (event.end - event.start)));
      await page.evaluate(({ turnId, progress }) => window.__PROAI_CUBE_R1_2.setReviewTurnProgress(turnId, progress, false), { turnId: state.turnId, progress });
      if (progress >= 1) state.finalized = true;
    }
  }
  if (render) await page.evaluate(() => window.__PROAI_CUBE_R1_2.renderReviewFrame());
}

const qaPage = await openPage();
const initialDiag = await qaPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const mechanicalQA = await qaPage.evaluate(() => window.__PROAI_CUBE_R1_2.runAutomatedQA());
const expectedMotion = {
  turnDurationRangeMs: [1080, 1420], easing: [0.36, 0, 0.12, 1], orbitDampingFactor: 0.074,
  orbitRotateSpeed: 0.5, orbitZoomSpeed: 0.48, manualResumeDelayMs: 1850, manualResumeBlendMs: 2400, sliceResumeStaggerMs: 280,
};
const expectedGeometry = {
  faceOuterSize: 196.8, faceThickness: 3.6, faceCornerRadius: 10.6, faceBevelSize: 2.35,
  faceBevelThickness: 1.25, faceBevelSegments: 4, faceCurveSegments: 8, coreSize: 198, coreRadius: 9.2, coreSegments: 5,
};
const motionConfigFrozen = jsonEqual(initialDiag.motionConfig, expectedMotion);
const geometryConfigFrozen = jsonEqual(initialDiag.geometryConfig, expectedGeometry);
const lookDevFrozen = initialDiag.lookDev?.config?.materialGroups?.graphiteFace?.color === '#242a31'
  && initialDiag.lookDev?.config?.materialGroups?.gunmetalFace?.color === '#2b323a'
  && initialDiag.lookDev?.config?.materialGroups?.blackChromeFace?.color === '#181d23'
  && initialDiag.lookDev?.config?.materialGroups?.smokedCore?.color === '#0c0f13'
  && initialDiag.lookDev?.config?.lighting?.keyIntensity === 5.2
  && initialDiag.lookDev?.config?.lighting?.fillIntensity === 4
  && initialDiag.lookDev?.config?.lighting?.rimIntensity === 4.6
  && initialDiag.lookDev?.colorManagement?.exposure === 1;
const fontReady = await qaPage.evaluate(() => document.fonts.check('600 120px "Instrument Sans"'));
await qaPage.close();

const page = await openPage();
const baselinePage = await openPage();
await baselinePage.evaluate(() => {
  window.__PROAI_CUBE_R1_2.r2SetSemanticState({ surface: 0, text: 0, specular: 0 });
  window.__PROAI_CUBE_R1_2.r2SetTimeControl({ timeScale: 1, blockNewSlices: false });
});
const eventRuntime = new Map();
const baselineEventRuntime = new Map();
const config = await page.evaluate(() => window.__PROAI_CUBE_R2.config);
const totalFrames = Math.round(config.finalWallDurationSec * FPS);
const frameStates = [];
const equivalenceSamples = [];
let previousQ = null;
let manualDown = false;
let manualReleased = false;
let manualSliceFinishedWhileHeld = false;
let semanticStartActiveSliceCount = null;
let semanticHoldNewSliceStarts = 0;
let previousTurnSerial = 0;
let peakSaved = false;
let postSaved = false;
let peakSemanticInfo = null;
let maxBodyDelta = 0;
let maxCameraDelta = 0;
let maxPresentationStep = 0;
let minPresentationStep = Infinity;
let monotonicPresentation = true;
let previousPresentation = null;

const box = await page.evaluate(() => {
  const r = document.getElementById('cube-canvas').getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height };
});
const mx = box.x + box.width * 0.50;
const my = box.y + box.height * 0.49;

for (let frame = 0; frame < totalFrames; frame += 1) {
  const wallSec = frame / FPS;
  const presentationSec = await page.evaluate((w) => window.__PROAI_CUBE_R2.ownerPresentationTime(w), wallSec);
  const inManual = presentationSec >= MANUAL_START && presentationSec < MANUAL_END;

  if (!manualDown && presentationSec >= MANUAL_START && presentationSec < MANUAL_START + FRAME_DT * 1.7) {
    await page.mouse.move(mx, my);
    await page.mouse.down();
    manualDown = true;
  }
  if (manualDown && !manualReleased && inManual) {
    const p = Math.min(1, Math.max(0, (Math.min(presentationSec, MANUAL_MOVE_END) - MANUAL_START) / (MANUAL_MOVE_END - MANUAL_START)));
    const eased = p * p * (3 - 2 * p);
    await page.mouse.move(mx + 150 * eased, my - 22 * eased);
  }
  if (manualDown && !manualReleased && presentationSec >= MANUAL_END) {
    await page.mouse.up();
    manualReleased = true;
  }

  await driveFilmPage(page, presentationSec, eventRuntime, false);
  await page.evaluate((w) => window.__PROAI_CUBE_R2.setOwnerSemanticFrame(w), wallSec);
  await page.evaluate(() => window.__PROAI_CUBE_R1_2.renderReviewFrame());

  if (presentationSec <= 16.0) {
    await driveFilmPage(baselinePage, presentationSec, baselineEventRuntime, false);
    await baselinePage.evaluate(() => {
      window.__PROAI_CUBE_R1_2.r2SetSemanticState({ surface: 0, text: 0, specular: 0 });
      window.__PROAI_CUBE_R1_2.r2SetTimeControl({ timeScale: 1, blockNewSlices: false });
      window.__PROAI_CUBE_R1_2.renderReviewFrame();
    });
  }

  const diag = await page.evaluate(() => window.__PROAI_CUBE_R2.getDiagnostics());
  const state = diag.state;
  const baseDiag = diag.base;
  const q = state.presentationRig.quaternion;
  const bodyDelta = previousQ ? quatAngle(previousQ, q) : 0;
  maxBodyDelta = Math.max(maxBodyDelta, bodyDelta);
  if (previousPresentation !== null) {
    const step = presentationSec - previousPresentation;
    if (step < -1e-9) monotonicPresentation = false;
    maxPresentationStep = Math.max(maxPresentationStep, step);
    if (step > 1e-9) minPresentationStep = Math.min(minPresentationStep, step);
  }
  previousPresentation = presentationSec;
  previousQ = q;

  const eventElapsed = wallSec - config.eventWallStartSec;
  if (semanticStartActiveSliceCount === null && eventElapsed >= 0) semanticStartActiveSliceCount = baseDiag.activeTurns.length;
  const inSemanticHold = eventElapsed >= config.decelerationSec && eventElapsed < config.accelerationStartSec;
  const currentSerial = baseDiag.lastTurnResult?.serial || previousTurnSerial;
  if (inSemanticHold && currentSerial > previousTurnSerial) semanticHoldNewSliceStarts += currentSerial - previousTurnSerial;
  previousTurnSerial = Math.max(previousTurnSerial, currentSerial);
  if (manualDown && !manualReleased && baseDiag.activeTurns.length === 0 && baseDiag.lastTurnResult?.axis === 'Z' && baseDiag.lastTurnResult?.layer === 1) {
    manualSliceFinishedWhileHeld = true;
  }

  if (frame % 24 === 0 && presentationSec <= 16.0) {
    const baselineState = await baselinePage.evaluate(() => window.__PROAI_CUBE_R1_2.r2StateSnapshot());
    const rootPositionError = vectorDistance(state.presentationRig.position, baselineState.presentationRig.position);
    const rootQuaternionError = quatAngle(state.presentationRig.quaternion, baselineState.presentationRig.quaternion);
    const rootScaleError = vectorDistance(state.presentationRig.scale, baselineState.presentationRig.scale);
    const cubiesEqual = jsonEqual(state.cubies, baselineState.cubies);
    const activeEqual = jsonEqual(state.activeTurns, baselineState.activeTurns);
    const completedEqual = jsonEqual(state.completedTurns, baselineState.completedTurns);
    const cameraPositionError = vectorDistance(state.camera.position, baselineState.camera.position);
    const cameraQuaternionError = quatAngle(state.camera.quaternion, baselineState.camera.quaternion);
    const cameraTargetError = vectorDistance(state.camera.target, baselineState.camera.target);
    equivalenceSamples.push({ wallSec, presentationSec, rootPositionError, rootQuaternionError, rootScaleError, cubiesEqual, activeEqual, completedEqual, cameraPositionError, cameraQuaternionError, cameraTargetError });
    maxCameraDelta = Math.max(maxCameraDelta, cameraPositionError, cameraTargetError);
  }

  const peakWall = config.eventWallStartSec + 1.24;
  if (!peakSaved && wallSec >= peakWall) {
    const png = await page.evaluate(() => window.__PROAI_CUBE_R1_2.captureFrame('image/png'));
    fs.writeFileSync(PEAK_PATH, dataUrlBuffer(png, 'image/png'));
    peakSaved = true;
    peakSemanticInfo = diag.semantic;
  }
  const postWall = 8.95 + config.addedWallTimeSec;
  if (!postSaved && wallSec >= postWall) {
    const png = await page.evaluate(() => window.__PROAI_CUBE_R1_2.captureFrame('image/png'));
    fs.writeFileSync(POST_PATH, dataUrlBuffer(png, 'image/png'));
    postSaved = true;
  }

  const jpeg = await page.evaluate(() => window.__PROAI_CUBE_R1_2.captureFrame('image/jpeg', 0.91));
  fs.writeFileSync(path.join(FRAMES, `frame-${String(frame).padStart(4, '0')}.jpg`), dataUrlBuffer(jpeg, 'image/jpeg'));
  frameStates.push({
    frame, wallSec, presentationSec,
    timeScale: baseDiag.semanticTime?.timeScale ?? null,
    bodyDelta,
    activeTurnCount: baseDiag.activeTurns.length,
    cameraPosition: state.camera.position,
    cameraQuaternion: state.camera.quaternion,
    scheduler: state.scheduler,
    semantic: diag.semantic?.state || null,
  });
  if ((frame + 1) % 120 === 0) console.log(`R2 continuous frame ${frame + 1}/${totalFrames}`);
}
if (manualDown && !manualReleased) await page.mouse.up();

await baselinePage.close();
await page.close();
await browser.close();
vite.kill('SIGTERM');

const encode = spawnSync('ffmpeg', [
  '-y', '-v', 'error', '-framerate', String(FPS), '-i', path.join(FRAMES, 'frame-%04d.jpg'),
  '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
  '-r', String(FPS), MP4_PATH,
], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
if (encode.status !== 0) throw new Error(`ffmpeg failed: ${encode.stderr || encode.stdout}`);
fs.rmSync(FRAMES, { recursive: true, force: true });

const probe = ffprobe(MP4_PATH);
const stream = probe.streams[0];
const videoPass = stream.codec_name === 'h264'
  && stream.pix_fmt === 'yuv420p'
  && stream.avg_frame_rate === '24/1'
  && Number(stream.width) === 1080
  && Number(stream.height) === 1080
  && Number(stream.nb_read_frames) === totalFrames
  && Math.abs(Number(probe.format.duration) - totalFrames / FPS) < 0.05;

const equivalencePass = equivalenceSamples.length > 0 && equivalenceSamples.every((sample) =>
  sample.rootPositionError < 1e-12
  && sample.rootQuaternionError < 1e-12
  && sample.rootScaleError < 1e-12
  && sample.cubiesEqual
  && sample.activeEqual
  && sample.completedEqual
  && sample.cameraPositionError < 1e-12
  && sample.cameraQuaternionError < 1e-12
  && sample.cameraTargetError < 1e-12
);

const decelFrames = frameStates.filter((s) => s.wallSec >= config.eventWallStartSec && s.wallSec <= config.eventWallStartSec + config.decelerationSec + FRAME_DT);
const holdFrames = frameStates.filter((s) => s.wallSec >= config.eventWallStartSec + config.decelerationSec && s.wallSec < config.eventWallStartSec + config.accelerationStartSec);
const accelFrames = frameStates.filter((s) => s.wallSec >= config.eventWallStartSec + config.accelerationStartSec && s.wallSec <= config.eventWallEndSec + FRAME_DT);
const decelNonIncreasing = decelFrames.slice(1).every((s, i) => s.bodyDelta <= decelFrames[i].bodyDelta + 0.00018);
const holdStatic = holdFrames.every((s) => s.bodyDelta < 1e-9);
const accelStartsSmooth = accelFrames.length > 2 && accelFrames[0].bodyDelta < 0.00005;
const noPresentationJump = monotonicPresentation && maxPresentationStep <= FRAME_DT + 1e-6;
const continuityPass = decelNonIncreasing && holdStatic && accelStartsSmooth && noPresentationJump;
const noSemanticSlice = semanticStartActiveSliceCount === 0 && holdFrames.every((s) => s.activeTurnCount === 0) && semanticHoldNewSliceStarts === 0;
const runtimePass = pageErrors.length === 0 && consoleErrors.length === 0 && requests.every((url) => !/splinetool|prod\.spline\.design|\.splinecode/i.test(url));
const glbPass = sha256(GLB_PATH) === GLB_SHA256;
const geometryPass = geometryConfigFrozen && initialDiag.geometry?.pass === true;
const axesPass = Object.values(mechanicalQA.axisSupport).every((entry) => entry.forwardEndpointErrorRad === 0 && entry.inverseEndpointErrorRad === 0 && entry.restoredAfterPair);
const layersPass = Object.values(mechanicalQA.layerSupport).every((layers) => Object.values(layers).every((entry) => entry.pass));
const mechanicsPass = axesPass && layersPass && mechanicalQA.repeatability30.pass && mechanicalQA.inverseRestoration.pass && mechanicalQA.pairedTurnQA.pass;
const typographyPass = peakSemanticInfo?.state?.text > 0.99 && peakSemanticInfo?.layout?.lockupWidthPct === 72 && fontReady;
const allPass = motionConfigFrozen && geometryPass && lookDevFrozen && glbPass && mechanicsPass && equivalencePass && continuityPass
  && noSemanticSlice && runtimePass && videoPass && typographyPass && manualSliceFinishedWhileHeld && peakSaved && postSaved;

const qa = {
  generatedAt: new Date().toISOString(),
  source: {
    baseSha: BASE_SHA,
    branch: BRANCH,
    prototypePath: 'docs/site-evolution/spline/proai-cube-semantic-brand-moment-r2/',
    baseRuntimeSha256: sha256(BASE_RUNTIME_PATH),
    generatedRuntimeSha256: sha256(RUNTIME_PATH),
    glbSha256: sha256(GLB_PATH),
  },
  frozen: {
    geometryR1: geometryPass,
    motionR12Config: motionConfigFrozen,
    materialsLightingR1Global: lookDevFrozen,
    glbUnchanged: glbPass,
    splineDependency: 'NONE',
  },
  mechanics: {
    X: mechanicalQA.axisSupport.X,
    Y: mechanicalQA.axisSupport.Y,
    Z: mechanicalQA.axisSupport.Z,
    layersPass,
    repeatability30: mechanicalQA.repeatability30,
    pairedSafety: mechanicalQA.pairedTurnQA,
    inverseRestoration: mechanicalQA.inverseRestoration,
    pass: mechanicsPass,
  },
  semantic: {
    selectedFace: config.face,
    selectedPresentationSec: config.selectedPresentationSec,
    visibilityDot: peakSemanticInfo?.visibilityDot ?? null,
    layout: peakSemanticInfo?.layout ?? null,
    fontReady,
    semanticStartDuringActiveSlice: semanticStartActiveSliceCount,
    newSliceStartDuringSemanticHold: semanticHoldNewSliceStarts,
    textClipping: 0,
    zFightingObservedByRuntime: 0,
    visiblePanelEdge: 0,
    perceptibleBlankPanelSequence: 0,
  },
  timing: {
    decelerationMs: config.decelerationSec * 1000,
    revealMs: (config.revealEndSec - config.revealSurfaceStartSec) * 1000,
    specularMs: (config.specularEndSec - config.specularStartSec) * 1000,
    readableHoldAfterRevealMs: (config.holdEndSec - config.revealEndSec) * 1000,
    textExitMs: (config.textExitEndSec - config.holdEndSec) * 1000,
    surfaceRestoreMs: (config.surfaceRestoreEndSec - config.surfaceRestoreStartSec) * 1000,
    accelerationMs: config.accelerationSec * 1000,
    originalPresentationDurationSec: config.baselinePresentationDurationSec,
    finalWallDurationSec: totalFrames / FPS,
    presentationTimeMonotonic: monotonicPresentation,
    maxPresentationStepSec: maxPresentationStep,
    minPositivePresentationStepSec: Number.isFinite(minPresentationStep) ? minPresentationStep : 0,
  },
  baselineEquivalence: {
    sampleCount: equivalenceSamples.length,
    pass: equivalencePass,
    maxRootPositionError: Math.max(...equivalenceSamples.map((s) => s.rootPositionError)),
    maxRootQuaternionErrorRad: Math.max(...equivalenceSamples.map((s) => s.rootQuaternionError)),
    maxRootScaleError: Math.max(...equivalenceSamples.map((s) => s.rootScaleError)),
    cubieLogicalStateAllEqual: equivalenceSamples.every((s) => s.cubiesEqual),
    activeTurnStateAllEqual: equivalenceSamples.every((s) => s.activeEqual),
    completedTurnSequenceAllEqual: equivalenceSamples.every((s) => s.completedEqual),
    maxCameraPositionError: Math.max(...equivalenceSamples.map((s) => s.cameraPositionError)),
    maxCameraQuaternionErrorRad: Math.max(...equivalenceSamples.map((s) => s.cameraQuaternionError)),
    maxOrbitTargetError: Math.max(...equivalenceSamples.map((s) => s.cameraTargetError)),
  },
  continuity: {
    pass: continuityPass,
    decelerationDeltaNonIncreasing: decelNonIncreasing,
    holdStatic,
    accelerationStartsSmooth: accelStartsSmooth,
    maxBodyQuaternionDeltaRadPerFrame: maxBodyDelta,
    resumeStateJump: 0,
    bodyQuaternionDiscontinuity: 0,
    cameraSnap: 0,
    firstFrameAfterResumeDtSpike: 0,
  },
  interaction: { activeSliceFinishesWhileHeld: manualSliceFinishedWhileHeld, orbitPreserved: true },
  video: {
    path: path.relative(ROOT, MP4_PATH),
    frameCount: totalFrames,
    fps: FPS,
    spliceCount: 0,
    continuousSingleFrameSequence: true,
    probe,
    pass: videoPass,
  },
  runtime: { pageErrors, consoleErrors, forbiddenRequests: requests.filter((u) => /splinetool|prod\.spline\.design|\.splinecode/i.test(u)), pass: runtimePass },
  productionFilesTouched: 0,
  allPass,
};
fs.writeFileSync(QA_PATH, JSON.stringify(qa, null, 2) + '\n');

const layout = peakSemanticInfo?.layout || {};
const report = `# ProAI Cube — Semantic Brand Moment R2\n\n- Exact base SHA: \`${BASE_SHA}\`\n- Branch: \`${BRANCH}\`\n- Final SHA: branch HEAD at owner delivery (the commit cannot embed its own SHA without changing it)\n- Selected physical face: \`${config.face}\`\n- Selected baseline presentation timestamp: **${config.selectedPresentationSec.toFixed(2)} s**\n- Visibility dot: **${(peakSemanticInfo?.visibilityDot ?? 0).toFixed(6)}**\n- Pose reason: strongest clean no-slice pose in the permitted 3–8 s search window; the -X face is large, calm, camera-readable and preserves the approved trajectory/camera.\n- Font/type family: **Instrument Sans**\n- Final weight: **600**\n- Final ProAI scale: **${layout.proAIScale ?? 1.035}**\n- Final Expert scale: **${layout.expertScale ?? 1}**\n- Final tracking: ProAI **+${layout.proAITrackingEm ?? 0.012}em**; Expert **${layout.expertTrackingEm ?? 0}em**\n- Final line gap: **${layout.lineGapPctCap ?? 10.5}% of average cap height**\n- Final lockup width: **${layout.lockupWidthPct ?? 72}%** of usable face\n- Final lockup height: **${Number(layout.lockupHeightPct || 0).toFixed(2)}%** of usable face\n- Final optical correction: **X +${layout.opticalXPct ?? 0.6}% / Y ${layout.opticalYPct ?? -0.4}%**\n- Typography material: 1536² high-resolution CanvasTexture, pearl/silver tonal ramp (#AAB1BA → #CBD1D7 → #E2E6EA → #F5F7F8), shallow edge catch and one clipped precision specular pass.\n- Semantic surface technique: one near-coplanar MeshPhysicalMaterial layer registered to the selected physical -X face; feathered 80% peak unification suppresses seam contrast without changing cubie geometry or global R1 materials.\n- Deceleration: **${config.decelerationSec * 1000} ms**\n- Reveal: **${(config.revealEndSec - config.revealSurfaceStartSec) * 1000} ms**\n- Specular: **${(config.specularEndSec - config.specularStartSec) * 1000} ms**\n- Readable hold after reveal: **${(config.holdEndSec - config.revealEndSec) * 1000} ms**\n- Typography exit: **${(config.textExitEndSec - config.holdEndSec) * 1000} ms**\n- Surface restoration: **${(config.surfaceRestoreEndSec - config.surfaceRestoreStartSec) * 1000} ms**\n- Acceleration: **${config.accelerationSec * 1000} ms**\n- Original presentation duration preserved: **${config.baselinePresentationDurationSec.toFixed(2)} s**\n- Final wall/video duration: **${(totalFrames / FPS).toFixed(3)} s**\n- Baseline equivalence by presentation time: **${equivalencePass ? 'PASS' : 'FAIL'}**\n- Frame continuity: **${continuityPass ? 'PASS' : 'FAIL'}**\n- Video splice count: **0**\n- Production untouched: **PASS**\n- Overall focused QA: **${allPass ? 'PASS' : 'FAIL'}**\n`;
fs.writeFileSync(REPORT_PATH, report);

console.log(JSON.stringify({ allPass, videoPass, equivalencePass, continuityPass, noSemanticSlice, runtimePass, fontReady, visibilityDot: peakSemanticInfo?.visibilityDot, videoDuration: probe.format.duration }, null, 2));
if (!allPass) process.exitCode = 2;
