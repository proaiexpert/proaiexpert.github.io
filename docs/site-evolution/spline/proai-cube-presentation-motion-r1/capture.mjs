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
const BASE_URL = process.env.PROAI_PRESENTATION_R1_URL || 'http://127.0.0.1:4173/';
const FPS = 24;
const VIDEO_VIEWPORT = { width: 640, height: 760 };
const SCREENSHOT_VIEWPORT = { width: 900, height: 1040 };
const VIDEO_PATH = path.join(REVIEW, 'proai-cube-presentation-motion-r1-review-21s.mp4');
const NATURAL_PATH = path.join(REVIEW, 'proai-cube-presentation-motion-r1-natural.png');
const LARGE_PATH = path.join(REVIEW, 'proai-cube-presentation-motion-r1-large-inspection.png');
const COMPOSITE_PATH = path.join(REVIEW, 'proai-cube-presentation-motion-r1-360-slice.png');
const CURRENT_MAIN = path.join(ROOT, 'main.js');
const BASELINE_MAIN = path.resolve(ROOT, '../proai-cube-geometry-r1/main.js');
const CURRENT_GLB = path.join(ROOT, 'rubik_39_s_cube_animation.glb');
const BASELINE_GLB = path.resolve(ROOT, '../proai-cube-geometry-r1/rubik_39_s_cube_animation.glb');

fs.mkdirSync(REVIEW, { recursive: true });

function sha256Buffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function sha256File(filepath) {
  return sha256Buffer(fs.readFileSync(filepath));
}

function section(text, start, end) {
  const a = text.indexOf(start);
  const b = text.indexOf(end, a + start.length);
  if (a < 0 || b < 0) throw new Error(`Could not extract section ${start} -> ${end}`);
  return text.slice(a, b);
}

function throughLine(text, start, terminalLine) {
  const a = text.indexOf(start);
  const b = text.indexOf(terminalLine, a + start.length);
  if (a < 0 || b < 0) throw new Error(`Could not extract section ${start} -> ${terminalLine}`);
  return text.slice(a, b + terminalLine.length);
}

function hashText(text) {
  return sha256Buffer(Buffer.from(text, 'utf8'));
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

function ffprobeJson(filepath) {
  const result = spawnSync('ffprobe', ['-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=codec_name,pix_fmt,avg_frame_rate,r_frame_rate,nb_read_frames,width,height', '-show_entries', 'format=format_name,duration', '-of', 'json', filepath], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`ffprobe failed: ${result.stderr || result.stdout}`);
  return JSON.parse(result.stdout);
}

const baselineText = fs.readFileSync(BASELINE_MAIN, 'utf8');
const currentText = fs.readFileSync(CURRENT_MAIN, 'utf8');
const freezeSections = {
  geometryConstants: ['const GEOMETRY_R1 = Object.freeze({', 'const renderer = new THREE.WebGLRenderer'],
  neutralLightingMaterials: ['// Temporary neutral studio baseline for geometry inspection only.', 'let cubeRoot;'],
  geometryFunctions: ['function classifyReviewMaterial(mesh) {', 'function findCubieParents() {'],
};
const geometryFreeze = {};
for (const [name, [start, end]] of Object.entries(freezeSections)) {
  const baseline = section(baselineText, start, end);
  const current = section(currentText, start, end);
  geometryFreeze[name] = { baselineSha256: hashText(baseline), currentSha256: hashText(current), pass: baseline === current };
}
const motionBlockBaseline = section(baselineText, 'const MOTION = Object.freeze({', 'const PRIMARY_PHRASE = Object.freeze([');
const motionBlockCurrent = section(currentText, 'const MOTION = Object.freeze({', 'const PRIMARY_PHRASE = Object.freeze([');
const choreographyTerminal = 'const CHOREOGRAPHY = Object.freeze([...PRIMARY_PHRASE, ...RESOLUTION_PHRASE]);';
const choreographyBaseline = throughLine(baselineText, 'const PRIMARY_PHRASE = Object.freeze([', choreographyTerminal);
const choreographyCurrent = throughLine(currentText, 'const PRIMARY_PHRASE = Object.freeze([', choreographyTerminal);
geometryFreeze.motionConfig = { pass: motionBlockBaseline === motionBlockCurrent, baselineSha256: hashText(motionBlockBaseline), currentSha256: hashText(motionBlockCurrent) };
geometryFreeze.sliceChoreography = { pass: choreographyBaseline === choreographyCurrent, baselineSha256: hashText(choreographyBaseline), currentSha256: hashText(choreographyCurrent) };
geometryFreeze.glb = { baselineSha256: sha256File(BASELINE_GLB), currentSha256: sha256File(CURRENT_GLB), pass: sha256File(BASELINE_GLB) === sha256File(CURRENT_GLB) };
geometryFreeze.pass = Object.values(geometryFreeze).filter((entry) => typeof entry === 'object' && 'pass' in entry).every((entry) => entry.pass);

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=swiftshader'],
});
const context = await browser.newContext();
const requests = [];
const pageErrors = [];
const consoleErrors = [];
context.on('request', (request) => requests.push(request.url()));

function wirePage(page) {
  page.on('pageerror', (error) => pageErrors.push(String(error)));
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
}

async function openPage(viewport, mode = 'capture') {
  const page = await context.newPage();
  await page.setViewportSize(viewport);
  wirePage(page);
  const url = new URL(BASE_URL);
  url.searchParams.set(mode, '1');
  await page.goto(url.href, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForFunction(() => window.__PROAI_CUBE_R1?.ready === true, null, { timeout: 90000 });
  return page;
}

const qaPage = await openPage(SCREENSHOT_VIEWPORT, 'qa');
const initialDiagnostics = await qaPage.evaluate(() => window.__PROAI_CUBE_R1.getDiagnostics());
const mechanicalQA = await qaPage.evaluate(() => window.__PROAI_CUBE_R1.runAutomatedQA());

// Interaction QA: whole-cube move + active slice; drag must pause presentation but allow slice completion.
const interactionBox = await qaPage.evaluate(() => {
  const rect = document.getElementById('cube-canvas')?.getBoundingClientRect();
  return rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null;
});
if (!interactionBox) throw new Error('Cube canvas unavailable for interaction QA');
await qaPage.evaluate(() => {
  const api = window.__PROAI_CUBE_R1;
  window.__presentationQaPromise = api.runPresentationMove({
    id: 'qa-interaction-hold',
    yawDeg: 156,
    targetPitchDeg: 6.0,
    targetRollDeg: -0.8,
    pitchWaveDeg: 4.8,
    rollWaveDeg: 0.65,
    // Deliberately huge only for headless interaction QA: SwiftShader rAF virtual time can advance ~30x wall time.
    durationMs: 600000,
    settleMs: 1350,
    easing: [0.48, 0.0, 0.38, 1.0],
    sliceTrigger: 0.72,
  });
});
await qaPage.waitForTimeout(900);
await qaPage.evaluate(() => {
  const api = window.__PROAI_CUBE_R1;
  window.__sliceQaPromise = api.turnSlice({ axis: 'X', layer: 1, direction: 1, durationMs: 1200, ignoreInteraction: true });
});
await qaPage.waitForTimeout(250);
const interactionBeforeDrag = await qaPage.evaluate(() => ({ interaction: window.__PROAI_CUBE_R1.getInteractionState(), diagnostics: window.__PROAI_CUBE_R1.getDiagnostics() }));
const x0 = interactionBox.x + interactionBox.width * 0.52;
const y0 = interactionBox.y + interactionBox.height * 0.50;
await qaPage.mouse.move(x0, y0);
await qaPage.mouse.down();
await qaPage.waitForTimeout(60);
const interactionAtStart = await qaPage.evaluate(() => window.__PROAI_CUBE_R1.getInteractionState());
for (let i = 1; i <= 9; i += 1) {
  const p = i / 9;
  await qaPage.mouse.move(x0 + 132 * p, y0 - 34 * Math.sin(Math.PI * p * 0.75));
  await qaPage.waitForTimeout(150);
}
const interactionWhileHeld = await qaPage.evaluate(() => ({ interaction: window.__PROAI_CUBE_R1.getInteractionState(), diagnostics: window.__PROAI_CUBE_R1.getDiagnostics() }));
const blockedNextSlice = await qaPage.evaluate(() => window.__PROAI_CUBE_R1.turnSlice({ axis: 'Y', layer: 0, direction: -1, durationMs: 100 }));
await qaPage.mouse.up();
await qaPage.waitForTimeout(100);
const interactionAfterRelease = await qaPage.evaluate(() => window.__PROAI_CUBE_R1.getInteractionState());
await qaPage.waitForTimeout(1150);
const interactionDuringDelay = await qaPage.evaluate(() => window.__PROAI_CUBE_R1.getInteractionState());
const cameraSettled = interactionDuringDelay.cameraPosition;
await qaPage.waitForTimeout(850);
const resumeSamples = [];
for (let i = 0; i < 20; i += 1) {
  await qaPage.waitForTimeout(120);
  resumeSamples.push(await qaPage.evaluate(() => window.__PROAI_CUBE_R1.getInteractionState()));
}
const interactionAfterResume = resumeSamples.at(-1);
let maxResumeQuaternionStepRad = 0;
for (let i = 1; i < resumeSamples.length; i += 1) {
  maxResumeQuaternionStepRad = Math.max(maxResumeQuaternionStepRad, quatAngle(resumeSamples[i - 1].presentationQuaternion, resumeSamples[i].presentationQuaternion));
}
const preSliceLinear = interactionBeforeDrag.interaction.activeSlice?.linear ?? null;
const heldSliceCompleted = interactionWhileHeld.interaction.activeSlice === null && interactionWhileHeld.diagnostics.lastTurnResult?.endpointErrorRad === 0;
const presentationProgressBefore = interactionBeforeDrag.interaction.presentation.activeMove?.linear ?? 0;
const presentationProgressHeld = interactionWhileHeld.interaction.presentation.activeMove?.linear ?? presentationProgressBefore;
const presentationProgressDelay = interactionDuringDelay.presentation.activeMove?.linear ?? presentationProgressHeld;
const presentationProgressResumed = interactionAfterResume.presentation.activeMove?.linear ?? presentationProgressDelay;
const cameraMoved = vectorDistance(interactionBeforeDrag.interaction.cameraPosition, interactionWhileHeld.interaction.cameraPosition) > 1;
const cameraStayedAfterResume = vectorDistance(cameraSettled, interactionAfterResume.cameraPosition) < 0.8;
const interactionPass = Boolean(interactionAtStart.interactionActive)
  && preSliceLinear > 0 && preSliceLinear < 1
  && heldSliceCompleted
  && blockedNextSlice === false
  && Math.abs(presentationProgressHeld - presentationProgressBefore) < 0.04
  && interactionAfterRelease.autonomyBlocked
  && interactionAfterRelease.resumeDelayRemainingMs > 1500
  && interactionDuringDelay.autonomyBlocked
  && Math.abs(presentationProgressDelay - presentationProgressHeld) < 0.04
  && presentationProgressResumed > presentationProgressDelay + 0.05
  && cameraMoved
  && cameraStayedAfterResume
  && maxResumeQuaternionStepRad < 0.16;
await qaPage.close();

// Technical 360 support QA with deterministic unwrapped yaw and smooth quaternion samples.
const turn360Page = await openPage(SCREENSHOT_VIEWPORT, 'capture');
const initial360 = await turn360Page.evaluate(() => ({ presentation: window.__PROAI_CUBE_R1.getPresentationState(), quaternion: window.__PROAI_CUBE_R1.getInteractionState().presentationQuaternion }));
const began360 = await turn360Page.evaluate(() => window.__PROAI_CUBE_R1.beginReviewPresentationMove('inspection-360'));
const samples360 = [];
for (let i = 0; i <= 96; i += 1) {
  const progress = i / 96;
  const durationSec = began360.durationMs / 1000;
  await turn360Page.evaluate(({ progress, durationSec }) => window.__PROAI_CUBE_R1.setReviewPresentationMoveProgress(progress, progress * durationSec), { progress, durationSec });
  samples360.push(await turn360Page.evaluate(() => ({ presentation: window.__PROAI_CUBE_R1.getPresentationState(), quaternion: window.__PROAI_CUBE_R1.getInteractionState().presentationQuaternion })));
}
let max360QuaternionStepRad = 0;
for (let i = 1; i < samples360.length; i += 1) max360QuaternionStepRad = Math.max(max360QuaternionStepRad, quatAngle(samples360[i - 1].quaternion, samples360[i].quaternion));
const final360 = samples360.at(-1);
const yaw360DeltaDeg = final360.presentation.anglesDeg.yaw - initial360.presentation.anglesDeg.yaw;
const full360Pass = began360?.yawDeg === 360 && Math.abs(yaw360DeltaDeg - 360) < 1e-6 && final360.presentation.lastMove?.yawDeltaDeg === 360 && max360QuaternionStepRad < 0.18;
await turn360Page.close();

// Screenshots.
const naturalPage = await openPage(SCREENSHOT_VIEWPORT, 'capture');
await naturalPage.evaluate(() => window.__PROAI_CUBE_R1.setReviewPresentation(1.4, 1));
await naturalPage.screenshot({ path: NATURAL_PATH, fullPage: true });
await naturalPage.close();

const largePage = await openPage(SCREENSHOT_VIEWPORT, 'capture');
await largePage.evaluate(() => {
  const api = window.__PROAI_CUBE_R1;
  api.beginReviewPresentationMove('inspection-156');
  api.setReviewPresentationMoveProgress(0.62, 3.4);
});
await largePage.screenshot({ path: LARGE_PATH, fullPage: true });
await largePage.close();

const compositePage = await openPage(SCREENSHOT_VIEWPORT, 'capture');
await compositePage.evaluate(() => {
  const api = window.__PROAI_CUBE_R1;
  api.beginReviewPresentationMove('inspection-360');
  api.setReviewPresentationMoveProgress(0.66, 5.8);
  api.beginReviewTurn('Z', 1, 1);
  api.setReviewTurnProgress(0.48);
});
await compositePage.screenshot({ path: COMPOSITE_PATH, fullPage: true });
await compositePage.close();

// Deterministic 21.29 second owner review video.
const videoPage = await openPage(VIDEO_VIEWPORT, 'capture');
const frames = [];
const segments = [];
let videoTimeSec = 0;
let frameIndex = 0;
let heldPresentationProgress = 0.22;

async function captureFrame() {
  const dataUrl = await videoPage.evaluate(() => {
    window.__PROAI_CUBE_R1.renderReviewFrame();
    return document.getElementById('cube-canvas').toDataURL('image/jpeg', 0.92);
  });
  frames.push(jpegBufferFromDataUrl(dataUrl));
  frameIndex += 1;
  if (frameIndex % 96 === 0) console.log(`Presentation R1.1 review frame ${frameIndex}`);
}

async function addHold(label, framesCount) {
  const start = videoTimeSec;
  for (let i = 0; i < framesCount; i += 1) {
    await videoPage.evaluate(({ timeSec }) => window.__PROAI_CUBE_R1.setReviewPresentation(timeSec, 1), { timeSec: videoTimeSec });
    await captureFrame();
    videoTimeSec += 1 / FPS;
  }
  segments.push({ label, startSec: start, endSec: videoTimeSec, frames: framesCount });
}

async function addTurn(label, axis, layer, direction, framesCount) {
  const start = videoTimeSec;
  const began = await videoPage.evaluate(({ axis, layer, direction }) => window.__PROAI_CUBE_R1.beginReviewTurn(axis, layer, direction), { axis, layer, direction });
  if (!began) throw new Error(`Could not begin review slice ${label}`);
  for (let i = 0; i < framesCount; i += 1) {
    const progress = (i + 1) / framesCount;
    await videoPage.evaluate(({ progress, timeSec }) => {
      const api = window.__PROAI_CUBE_R1;
      api.setReviewPresentation(timeSec, 1);
      api.setReviewTurnProgress(progress);
    }, { progress, timeSec: videoTimeSec });
    await captureFrame();
    videoTimeSec += 1 / FPS;
  }
  segments.push({ label, axis, layer, direction, startSec: start, endSec: videoTimeSec, frames: framesCount });
}

async function add360Inspection(framesCount) {
  const start = videoTimeSec;
  const began = await videoPage.evaluate(() => window.__PROAI_CUBE_R1.beginReviewPresentationMove('inspection-360'));
  if (!began) throw new Error('Could not begin deterministic 360 inspection');
  const sliceStart = 179;
  const sliceFrames = 30;
  let sliceStarted = false;
  for (let i = 0; i < framesCount; i += 1) {
    const progress = (i + 1) / framesCount;
    if (i === sliceStart) {
      sliceStarted = await videoPage.evaluate(() => Boolean(window.__PROAI_CUBE_R1.beginReviewTurn('Z', 1, 1)));
      if (!sliceStarted) throw new Error('Could not begin concurrent Z slice during 360 review');
    }
    await videoPage.evaluate(({ progress, timeSec, sliceProgress }) => {
      const api = window.__PROAI_CUBE_R1;
      api.setReviewPresentationMoveProgress(progress, timeSec);
      if (sliceProgress !== null) api.setReviewTurnProgress(sliceProgress);
    }, {
      progress,
      timeSec: videoTimeSec,
      sliceProgress: sliceStarted && i >= sliceStart ? Math.min(1, (i - sliceStart + 1) / sliceFrames) : null,
    });
    await captureFrame();
    videoTimeSec += 1 / FPS;
  }
  segments.push({ label: 'full-360-inspection-with-z-slice', yawDeg: 360, startSec: start, endSec: videoTimeSec, frames: framesCount, concurrentSlice: 'Z+1' });
}

async function addManualDuringActiveSlice(framesCount) {
  const start = videoTimeSec;
  const box = await videoPage.evaluate(() => {
    const rect = document.getElementById('cube-canvas')?.getBoundingClientRect();
    return rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null;
  });
  if (!box) throw new Error('Video canvas unavailable for manual segment');
  const mx = box.x + box.width * 0.52;
  const my = box.y + box.height * 0.50;
  await videoPage.evaluate(() => {
    const api = window.__PROAI_CUBE_R1;
    api.beginReviewPresentationMove('inspection-minus138');
    api.setReviewPresentationMoveProgress(0.18, 0);
    api.beginReviewTurn('X', -1, -1);
  });
  const preDragFrames = 6;
  await videoPage.mouse.move(mx, my);
  for (let i = 0; i < framesCount; i += 1) {
    const sliceProgress = (i + 1) / framesCount;
    if (i < preDragFrames) {
      const bodyProgress = 0.18 + 0.04 * ((i + 1) / preDragFrames);
      heldPresentationProgress = bodyProgress;
      await videoPage.evaluate(({ bodyProgress, sliceProgress, timeSec }) => {
        const api = window.__PROAI_CUBE_R1;
        api.setReviewPresentationMoveProgress(bodyProgress, timeSec);
        api.setReviewTurnProgress(sliceProgress);
      }, { bodyProgress, sliceProgress, timeSec: videoTimeSec });
      if (i === preDragFrames - 1) await videoPage.mouse.down();
    } else {
      const p = (i - preDragFrames + 1) / (framesCount - preDragFrames);
      const eased = p * p * (3 - 2 * p);
      await videoPage.mouse.move(mx + 112 * eased, my - 30 * Math.sin(Math.PI * p * 0.72));
      await videoPage.evaluate(({ sliceProgress }) => window.__PROAI_CUBE_R1.setReviewTurnProgress(sliceProgress), { sliceProgress });
    }
    await captureFrame();
    videoTimeSec += 1 / FPS;
  }
  await videoPage.mouse.up();
  segments.push({ label: 'manual-orbit-during-active-slice', startSec: start, endSec: videoTimeSec, frames: framesCount, sliceCompletesWhileDragging: true });
}

async function addFrozenDelay(label, framesCount) {
  const start = videoTimeSec;
  for (let i = 0; i < framesCount; i += 1) {
    await captureFrame();
    videoTimeSec += 1 / FPS;
  }
  segments.push({ label, startSec: start, endSec: videoTimeSec, frames: framesCount });
}

async function addSoftResume(framesCount) {
  const start = videoTimeSec;
  const targetEnd = 0.50;
  for (let i = 0; i < framesCount; i += 1) {
    const resumeProgress = (i + 1) / framesCount;
    const bodyProgress = heldPresentationProgress + (targetEnd - heldPresentationProgress) * resumeProgress;
    await videoPage.evaluate(({ bodyProgress, timeSec, resumeProgress }) => {
      const api = window.__PROAI_CUBE_R1;
      api.setReviewPresentationMoveProgress(bodyProgress, timeSec);
      api.setReviewPresentation(timeSec, resumeProgress);
    }, { bodyProgress, timeSec: videoTimeSec, resumeProgress });
    await captureFrame();
    videoTimeSec += 1 / FPS;
  }
  heldPresentationProgress = targetEnd;
  segments.push({ label: 'soft-autonomous-resume', startSec: start, endSec: videoTimeSec, frames: framesCount, blendSec: framesCount / FPS });
}

await addHold('normal-3q-micro-motion', 29);
await addTurn('primary-x1', 'X', 1, 1, 33);
await addHold('post-x-hold', 14);
await addTurn('primary-y0', 'Y', 0, -1, 32);
await addHold('pre-inspection-settle', 12);
await add360Inspection(230);
await addHold('post-360-settle', 18);
await addManualDuringActiveSlice(36);
await addFrozenDelay('manual-release-calm-delay', 36);
await addSoftResume(58);
await addFrozenDelay('closing-settle', 13);

await videoPage.close();
await browser.close();

fs.rmSync(VIDEO_PATH, { force: true });
const encode = spawnSync('ffmpeg', [
  '-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-vcodec', 'mjpeg', '-i', 'pipe:0', '-an',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-r', String(FPS), VIDEO_PATH,
], { input: Buffer.concat(frames), encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
if (encode.status !== 0 || !fs.existsSync(VIDEO_PATH)) throw new Error(`H.264 MP4 encode failed: ${encode.stderr || encode.stdout || encode.status}`);
const videoProbe = ffprobeJson(VIDEO_PATH);
const stream = videoProbe.streams?.[0] || {};
const format = videoProbe.format || {};
const expectedFrames = frames.length;
const expectedDurationSec = expectedFrames / FPS;
const videoPass = stream.codec_name === 'h264'
  && stream.pix_fmt === 'yuv420p'
  && stream.avg_frame_rate === '24/1'
  && Number(stream.nb_read_frames) === expectedFrames
  && Math.abs(Number(format.duration) - expectedDurationSec) < 0.01
  && String(format.format_name).includes('mp4');

const forbiddenRequests = requests.filter((url) => /splinetool|prod\.spline\.design|\.splinecode/i.test(url));
const runtimePass = pageErrors.length === 0 && consoleErrors.length === 0 && forbiddenRequests.length === 0;
const axisPass = Object.fromEntries(Object.entries(mechanicalQA.axisSupport).map(([axis, result]) => [axis, result.forwardEndpointErrorRad === 0 && result.inverseEndpointErrorRad === 0 && result.restoredAfterPair]));
const layerPass = Object.values(mechanicalQA.layerSupport).every((layers) => Object.values(layers).every((entry) => entry.pass));
const geometryPass = initialDiagnostics.geometry?.pass === true && geometryFreeze.pass;

const qa = {
  generatedAt: new Date().toISOString(),
  source: {
    baselineBranch: 'agent/proai-cube-geometry-r1',
    baselineCommit: '73082717909b6f4225841401fe4962d6ff4bbcca',
    branch: 'agent/proai-cube-presentation-motion-r1',
    prototypePath: 'docs/site-evolution/spline/proai-cube-presentation-motion-r1/',
    glbBytes: fs.statSync(CURRENT_GLB).size,
    glbSha256: sha256File(CURRENT_GLB),
  },
  geometryFreeze,
  initialDiagnostics,
  presentation: {
    config: initialDiagnostics.presentationConfig,
    full360: {
      began: began360,
      yawDeltaDeg: yaw360DeltaDeg,
      maxQuaternionStepRad: max360QuaternionStepRad,
      finalState: final360.presentation,
      pass: full360Pass,
    },
  },
  mechanicalQA,
  interactionQA: {
    preDrag: interactionBeforeDrag,
    atStart: interactionAtStart,
    whileHeld: interactionWhileHeld,
    blockedNextSlice,
    afterRelease: interactionAfterRelease,
    duringDelay: interactionDuringDelay,
    afterResume: interactionAfterResume,
    presentationProgressBefore,
    presentationProgressHeld,
    presentationProgressDelay,
    presentationProgressResumed,
    heldSliceCompleted,
    cameraMoved,
    cameraStayedAfterResume,
    maxResumeQuaternionStepRad,
    pass: interactionPass,
  },
  video: {
    path: 'review/proai-cube-presentation-motion-r1-review-21s.mp4',
    codec: stream.codec_name,
    pixelFormat: stream.pix_fmt,
    fps: stream.avg_frame_rate,
    frameCount: Number(stream.nb_read_frames),
    expectedFrames,
    durationSec: Number(format.duration),
    expectedDurationSec,
    width: stream.width,
    height: stream.height,
    byteLength: fs.statSync(VIDEO_PATH).size,
    segments,
    pass: videoPass,
  },
  runtime: {
    totalRequests: requests.length,
    forbiddenRequests,
    splineDependency: forbiddenRequests.length === 0 ? 'NONE' : 'FOUND',
    pageErrors,
    consoleErrors,
    pass: runtimePass,
  },
  acceptance: {
    geometryR1Unchanged: geometryPass ? 'PASS' : 'FAIL',
    wholeCube360: full360Pass ? 'PASS' : 'FAIL',
    interaction: interactionPass ? 'PASS' : 'FAIL',
    X: axisPass.X ? 'PASS' : 'FAIL',
    Y: axisPass.Y ? 'PASS' : 'FAIL',
    Z: axisPass.Z ? 'PASS' : 'FAIL',
    layerSupport: layerPass ? 'PASS' : 'FAIL',
    repeatability30: mechanicalQA.repeatability30.pass ? 'PASS' : 'FAIL',
    inverseRestoration: mechanicalQA.inverseRestoration.pass ? 'PASS' : 'FAIL',
    videoMp4: videoPass ? 'PASS' : 'FAIL',
    runtime: runtimePass ? 'PASS' : 'FAIL',
    splineDependency: forbiddenRequests.length === 0 ? 'NONE' : 'FOUND',
    visualIntersections: 'PENDING_DIRECT_QC',
  },
};

fs.writeFileSync(QA_PATH, `${JSON.stringify(qa, null, 2)}\n`);

const presentationMoves = initialDiagnostics.presentationConfig?.inspectionMoves || [];
const report = `# ProAI Rubik Cube — Presentation Motion R1.1\n\n## Scope\n\nNarrow presentation-motion refinement built from Geometry R1 commit \`73082717909b6f4225841401fe4962d6ff4bbcca\`. Geometry, bevel, gaps, GLB, neutral materials/lighting, logical slice engine and existing Rubik slice choreography are frozen. No Hero integration, merge or deploy.\n\n## Whole-cube presentation system\n\n- Large autonomous yaw moves: ${presentationMoves.map((m) => `${m.yawDeg}°`).join(', ')}.\n- Duration range: ${initialDiagnostics.presentationConfig?.durationRangeMs?.join('–')} ms.\n- Settle range: ${initialDiagnostics.presentationConfig?.settleRangeMs?.join('–')} ms.\n- Full 360 move: **${full360Pass ? 'PASS' : 'FAIL'}**; deterministic unwrapped yaw delta ${yaw360DeltaDeg.toFixed(6)}°.\n- Large moves use per-move cubic-bezier profiles with soft pitch / minimal roll modulation; no bounce or overshoot.\n- Existing micro-drift remains ${initialDiagnostics.motionConfig?.bodyDrift?.yawDeg}° yaw / ${initialDiagnostics.motionConfig?.bodyDrift?.pitchDeg}° pitch / ${initialDiagnostics.motionConfig?.bodyDrift?.rollDeg}° roll.\n\n## Interaction semantics\n\n- Manual Orbit start pauses whole-cube presentation immediately.\n- A slice already in progress continues to its exact ±90° endpoint.\n- New autonomous slice starts are blocked while dragging and during calm delay.\n- Calm delay: ${initialDiagnostics.motionConfig?.manualResumeDelayMs} ms.\n- Soft presentation blend: ${initialDiagnostics.motionConfig?.manualResumeBlendMs} ms.\n- Camera is never reset by the presentation system.\n- Interaction QA: **${interactionPass ? 'PASS' : 'FAIL'}**.\n\n## Frozen Geometry R1\n\n- Geometry constants/functions: **${geometryPass ? 'PASS' : 'FAIL'}**.\n- Neutral material/light block unchanged: **${geometryFreeze.neutralLightingMaterials.pass ? 'PASS' : 'FAIL'}**.\n- GLB exact SHA match: **${geometryFreeze.glb.pass ? 'PASS' : 'FAIL'}**.\n- Existing Rubik slice choreography byte-equivalent: **${geometryFreeze.sliceChoreography.pass ? 'PASS' : 'FAIL'}**.\n\n## Mechanical QA\n\n- X / Y / Z: **${axisPass.X ? 'PASS' : 'FAIL'} / ${axisPass.Y ? 'PASS' : 'FAIL'} / ${axisPass.Z ? 'PASS' : 'FAIL'}**.\n- 30 mixed turns: **${mechanicalQA.repeatability30.pass ? 'PASS' : 'FAIL'}**; endpoint max ${mechanicalQA.repeatability30.endpointMaxErrorRad}, position ${mechanicalQA.repeatability30.maxCanonicalPosition}, quaternion ${mechanicalQA.repeatability30.maxCanonicalQuaternionRad}, scale ${mechanicalQA.repeatability30.maxCanonicalScale}.\n- Exact inverse restoration: **${mechanicalQA.inverseRestoration.pass ? 'PASS' : 'FAIL'}**.\n- Runtime/browser errors: ${pageErrors.length + consoleErrors.length}; Spline dependency **${forbiddenRequests.length === 0 ? 'NONE' : 'FOUND'}**.\n\n## Owner review evidence\n\n- \`review/proai-cube-presentation-motion-r1-natural.png\`\n- \`review/proai-cube-presentation-motion-r1-large-inspection.png\`\n- \`review/proai-cube-presentation-motion-r1-360-slice.png\`\n- \`review/proai-cube-presentation-motion-r1-review-21s.mp4\` — H.264 / yuv420p / 24 fps / ${expectedDurationSec.toFixed(2)} s.\n- \`QA.json\`\n\n## Gate\n\nAutomated mechanics, whole-cube 360, interaction, geometry-freeze and runtime gates must all be green. Visible intersections / presentation quality require direct screenshot/video QC before final handoff. Materials + Lighting must not start before owner review.\n`;
fs.writeFileSync(REPORT_PATH, report);

const hardPass = geometryPass && full360Pass && interactionPass && axisPass.X && axisPass.Y && axisPass.Z && layerPass && mechanicalQA.repeatability30.pass && mechanicalQA.inverseRestoration.pass && runtimePass && videoPass;
if (!hardPass) throw new Error(`Presentation Motion R1.1 QA failed: ${JSON.stringify(qa.acceptance)}`);
console.log(JSON.stringify(qa.acceptance, null, 2));
