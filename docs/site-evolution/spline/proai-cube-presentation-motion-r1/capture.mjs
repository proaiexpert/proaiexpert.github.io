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
const CAPTURE_URL = process.env.PROAI_PRESENTATION_R1_URL || 'http://127.0.0.1:4173/?capture=1';
const liveUrl = new URL(CAPTURE_URL);
liveUrl.search = '';
liveUrl.hash = '';
liveUrl.pathname = '/';
const LIVE_URL = liveUrl.toString();
const FPS = 24;
const VIDEO_VIEWPORT = { width: 640, height: 760 };
const SCREENSHOT_VIEWPORT = { width: 900, height: 1040 };
const MP4_PATH = path.join(REVIEW, 'proai-cube-presentation-motion-r1-review-20s.mp4');
const WEBM_PATH = path.join(REVIEW, 'proai-cube-presentation-motion-r1-review-20s.webm');
const NATURAL_PATH = path.join(REVIEW, 'proai-cube-presentation-motion-r1-natural.png');
const LARGE_PATH = path.join(REVIEW, 'proai-cube-presentation-motion-r1-large-angle.png');
const SLICE_PATH = path.join(REVIEW, 'proai-cube-presentation-motion-r1-slice-plus-presentation.png');
const GLB_PATH = path.join(ROOT, 'rubik_39_s_cube_animation.glb');

fs.mkdirSync(REVIEW, { recursive: true });

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
  const args = ['-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries',
    'stream=codec_name,pix_fmt,avg_frame_rate,nb_read_frames,width,height:format=format_name,duration',
    '-of', 'json', filepath];
  const out = spawnSync('ffprobe', args, { encoding: 'utf8' });
  if (out.status !== 0) throw new Error(`ffprobe failed for ${filepath}: ${out.stderr || out.stdout}`);
  return JSON.parse(out.stdout);
}
function encodeFrames(buffers, filepath, codecArgs) {
  fs.rmSync(filepath, { force: true });
  const proc = spawnSync('ffmpeg', [
    '-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-vcodec', 'mjpeg', '-i', 'pipe:0',
    '-an', ...codecArgs, '-r', String(FPS), filepath,
  ], { input: Buffer.concat(buffers), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
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
async function openPage(url, viewport) {
  const page = await context.newPage();
  await page.setViewportSize(viewport);
  wirePage(page);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForFunction(() => window.__PROAI_CUBE_R1?.ready === true, null, { timeout: 90000 });
  return page;
}

const qaPage = await openPage(CAPTURE_URL, SCREENSHOT_VIEWPORT);
const initialDiagnostics = await qaPage.evaluate(() => window.__PROAI_CUBE_R1.getDiagnostics());
const mechanicalQA = await qaPage.evaluate(() => window.__PROAI_CUBE_R1.runAutomatedQA());
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

const full360Move = await qaPage.evaluate(() => window.__PROAI_CUBE_R1.beginReviewInspection(2));
if (!full360Move || full360Move.yawDeg !== 360) throw new Error('Full 360 inspection move unavailable');
const full360Samples = [];
for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
  full360Samples.push(await qaPage.evaluate(({ progress }) => window.__PROAI_CUBE_R1.setReviewInspectionProgress(progress, progress * 8.8), { progress }));
}
const full360Pass = Math.abs(full360Samples.at(-1).yawTravelDeg - 360) < 1e-9
  && full360Samples[1].yawTravelDeg > 20
  && full360Samples[2].yawTravelDeg > 120
  && full360Samples[3].yawTravelDeg > 250;
await qaPage.close();

const livePage = await openPage(LIVE_URL, SCREENSHOT_VIEWPORT);
await livePage.evaluate(() => window.__PROAI_CUBE_R1.stopChoreography());
await livePage.waitForFunction(() => {
  const d = window.__PROAI_CUBE_R1.getDiagnostics();
  return d.activeTurn === null && d.motionState === 'rest';
}, null, { timeout: 5000 });
await livePage.waitForTimeout(120);
const manualSliceStarted = await livePage.evaluate(() => {
  void window.__PROAI_CUBE_R1.turnSlice({ axis: 'X', layer: 1, direction: 1, durationMs: 1380, ignoreInteraction: false });
  return window.__PROAI_CUBE_R1.getDiagnostics().activeTurn !== null;
});
if (!manualSliceStarted) throw new Error('Could not start deterministic interaction slice');
await livePage.waitForTimeout(100);
const liveBox = await livePage.evaluate(() => {
  const el = document.getElementById('cube-canvas');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height };
});
if (!liveBox || liveBox.width <= 0 || liveBox.height <= 0) throw new Error('Live canvas rect unavailable');
const beforeDrag = await livePage.evaluate(() => window.__PROAI_CUBE_R1.getDiagnostics());
const dragTurn = { ...beforeDrag.activeTurn };
const x0 = liveBox.x + liveBox.width * 0.50;
const y0 = liveBox.y + liveBox.height * 0.49;
await livePage.mouse.move(x0, y0);
await livePage.mouse.down();
for (let i = 1; i <= 8; i += 1) {
  await livePage.mouse.move(x0 + 170 * (i / 8), y0 - 18 * (i / 8));
  await livePage.waitForTimeout(18);
}
const duringDrag = await livePage.evaluate(() => window.__PROAI_CUBE_R1.getDiagnostics());
await livePage.waitForFunction(() => window.__PROAI_CUBE_R1.getDiagnostics().activeTurn === null, null, { timeout: 3000 });
const sliceFinishedWhileDrag = await livePage.evaluate(() => window.__PROAI_CUBE_R1.getDiagnostics());
const blockedNewSliceAttempt = await livePage.evaluate(async () => window.__PROAI_CUBE_R1.turnSlice({ axis: 'Y', layer: 0, direction: -1, durationMs: 1320, ignoreInteraction: false }));
await livePage.waitForTimeout(1200);
const blockedAfterSlice = await livePage.evaluate(() => window.__PROAI_CUBE_R1.getDiagnostics());
const cameraAtHeldAngle = blockedAfterSlice.interaction.cameraPosition;
await livePage.mouse.up();
await livePage.waitForTimeout(60);
const afterRelease = await livePage.evaluate(() => window.__PROAI_CUBE_R1.getDiagnostics());
await livePage.waitForTimeout(950);
const duringCalmDelay = await livePage.evaluate(() => window.__PROAI_CUBE_R1.getDiagnostics());
await livePage.waitForTimeout(1050);
const earlyResume = await livePage.evaluate(() => window.__PROAI_CUBE_R1.getDiagnostics());
await livePage.waitForTimeout(700);
const blendedResume = await livePage.evaluate(() => window.__PROAI_CUBE_R1.getDiagnostics());
const cameraNoSnap = vectorDistance(cameraAtHeldAngle, blendedResume.interaction.cameraPosition) < 1.0;
const activeSliceCompleted = sliceFinishedWhileDrag.activeTurn === null
  && sliceFinishedWhileDrag.lastTurnResult?.axis === dragTurn.axis
  && sliceFinishedWhileDrag.lastTurnResult?.layer === dragTurn.layer
  && sliceFinishedWhileDrag.lastTurnResult?.endpointErrorRad === 0;
const nextSliceBlocked = blockedNewSliceAttempt === false && blockedAfterSlice.activeTurn === null && blockedAfterSlice.interaction.interactionActive;
const interactionPass = duringDrag.interaction.interactionActive
  && duringDrag.interaction.autonomyBlocked
  && activeSliceCompleted
  && nextSliceBlocked
  && !afterRelease.interaction.interactionActive
  && afterRelease.interaction.resumeDelayRemainingMs > 1500
  && duringCalmDelay.interaction.autonomyBlocked
  && earlyResume.interaction.presentationResumeActive
  && blendedResume.interaction.presentationResumeActive
  && cameraNoSnap;
await livePage.close();

const naturalPage = await openPage(CAPTURE_URL, SCREENSHOT_VIEWPORT);
await naturalPage.evaluate(() => window.__PROAI_CUBE_R1.setReviewPresentation(1.4, 1));
await naturalPage.screenshot({ path: NATURAL_PATH, fullPage: true });
await naturalPage.close();

const largePage = await openPage(CAPTURE_URL, SCREENSHOT_VIEWPORT);
await largePage.evaluate(() => {
  window.__PROAI_CUBE_R1.beginReviewInspection(1);
  window.__PROAI_CUBE_R1.setReviewInspectionProgress(0.52, 4.0);
});
await largePage.screenshot({ path: LARGE_PATH, fullPage: true });
await largePage.close();

const slicePage = await openPage(CAPTURE_URL, SCREENSHOT_VIEWPORT);
await slicePage.evaluate(() => {
  const api = window.__PROAI_CUBE_R1;
  api.beginReviewInspection(0);
  api.setReviewInspectionProgress(0.64, 4.3);
  api.beginReviewTurn('Z', 1, 1);
  api.setReviewTurnProgress(0.54);
});
await slicePage.screenshot({ path: SLICE_PATH, fullPage: true });
await slicePage.close();

const videoPage = await openPage(CAPTURE_URL, VIDEO_VIEWPORT);
const frameBuffers = [];
const segments = [];
let videoTimeSec = 0;
let frameIndex = 0;
async function captureCurrentFrame() {
  const dataUrl = await videoPage.evaluate(() => {
    window.__PROAI_CUBE_R1.renderReviewFrame();
    return document.getElementById('cube-canvas').toDataURL('image/jpeg', 0.93);
  });
  frameBuffers.push(jpegBufferFromDataUrl(dataUrl));
  frameIndex += 1;
  if (frameIndex % 96 === 0) console.log(`Presentation R1.1 frame ${frameIndex}`);
}
async function addHold(label, seconds, { frozen = false, resume = false } = {}) {
  const count = Math.round(seconds * FPS);
  const start = videoTimeSec;
  for (let i = 0; i < count; i += 1) {
    if (!frozen) {
      const resumeProgress = resume ? (i + 1) / count : 1;
      await videoPage.evaluate(({ timeSec, resumeProgress }) => window.__PROAI_CUBE_R1.setReviewPresentation(timeSec, resumeProgress), { timeSec: videoTimeSec, resumeProgress });
    }
    await captureCurrentFrame();
    videoTimeSec += 1 / FPS;
  }
  segments.push({ label, startSec: start, endSec: videoTimeSec, frames: count });
}
async function addTurn(label, axis, layer, direction, seconds) {
  const count = Math.round(seconds * FPS);
  const start = videoTimeSec;
  const began = await videoPage.evaluate(({ axis, layer, direction }) => window.__PROAI_CUBE_R1.beginReviewTurn(axis, layer, direction), { axis, layer, direction });
  if (!began) throw new Error(`Could not begin review slice ${label}`);
  for (let i = 0; i < count; i += 1) {
    const progress = (i + 1) / count;
    await videoPage.evaluate(({ progress, timeSec }) => {
      const api = window.__PROAI_CUBE_R1;
      api.setReviewPresentation(timeSec, 1);
      api.setReviewTurnProgress(progress);
    }, { progress, timeSec: videoTimeSec });
    await captureCurrentFrame();
    videoTimeSec += 1 / FPS;
  }
  segments.push({ label, axis, layer, direction, startSec: start, endSec: videoTimeSec, frames: count });
}
async function addInspectionWithSlice(label, moveIndex, seconds, overlap) {
  const count = Math.round(seconds * FPS);
  const start = videoTimeSec;
  const move = await videoPage.evaluate(({ moveIndex }) => window.__PROAI_CUBE_R1.beginReviewInspection(moveIndex), { moveIndex });
  if (!move) throw new Error(`Could not begin inspection ${label}`);
  const sliceStartFrame = Math.round(count * overlap.startProgress);
  const sliceFrames = Math.round(overlap.seconds * FPS);
  let sliceBegan = false;
  for (let i = 0; i < count; i += 1) {
    const progress = (i + 1) / count;
    await videoPage.evaluate(({ progress, timeSec }) => window.__PROAI_CUBE_R1.setReviewInspectionProgress(progress, timeSec), { progress, timeSec: videoTimeSec });
    if (i >= sliceStartFrame && !sliceBegan) {
      sliceBegan = Boolean(await videoPage.evaluate(({ overlap }) => window.__PROAI_CUBE_R1.beginReviewTurn(overlap.axis, overlap.layer, overlap.direction), { overlap }));
      if (!sliceBegan) throw new Error('Could not begin overlapping slice during inspection');
    }
    if (sliceBegan && i >= sliceStartFrame) {
      const sliceProgress = Math.min(1, (i - sliceStartFrame + 1) / sliceFrames);
      await videoPage.evaluate(({ sliceProgress }) => window.__PROAI_CUBE_R1.setReviewTurnProgress(sliceProgress), { sliceProgress });
    }
    await captureCurrentFrame();
    videoTimeSec += 1 / FPS;
  }
  segments.push({ label, moveIndex, yawDeg: move.yawDeg, pitchAmpDeg: move.pitchAmpDeg, rollAmpDeg: move.rollAmpDeg, startSec: start, endSec: videoTimeSec, frames: count, overlapSlice: overlap });
}
async function addManualOrbit(label, seconds) {
  const count = Math.round(seconds * FPS);
  const start = videoTimeSec;
  const box = await videoPage.evaluate(() => {
    const el = document.getElementById('cube-canvas');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  if (!box || box.width <= 0 || box.height <= 0) throw new Error('Video canvas rect unavailable');
  const x = box.x + box.width * 0.51;
  const y = box.y + box.height * 0.49;
  await videoPage.mouse.move(x, y);
  await videoPage.mouse.down();
  for (let i = 0; i < count; i += 1) {
    const p = (i + 1) / count;
    const eased = p * p * (3 - 2 * p);
    await videoPage.mouse.move(x + 150 * eased, y - 20 * eased);
    await captureCurrentFrame();
    videoTimeSec += 1 / FPS;
  }
  await videoPage.mouse.up();
  segments.push({ label, startSec: start, endSec: videoTimeSec, frames: count, manualOrbit: true });
}

await addHold('normal-3q-hold', 1.40);
await addTurn('rubik-x1', 'X', 1, 1, 1.38);
await addHold('post-slice-breath', 0.60);
await addInspectionWithSlice('full-360-inspection-multiaxis', 2, 8.80, { axis: 'Z', layer: 1, direction: 1, seconds: 1.24, startProgress: 0.72 });
await addHold('inspection-settle', 0.70);
await addManualOrbit('manual-orbit-drag', 1.10);
await addHold('manual-calm-delay', 1.85, { frozen: true });
await addHold('soft-autonomous-resume', 2.40, { resume: true });
await addTurn('rubik-y0-after-resume', 'Y', 0, -1, 1.32);
await addHold('closing-settle', 0.70);
await videoPage.close();
await browser.close();

encodeFrames(frameBuffers, MP4_PATH, ['-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart']);
encodeFrames(frameBuffers, WEBM_PATH, ['-c:v', 'libvpx', '-deadline', 'realtime', '-cpu-used', '8', '-pix_fmt', 'yuv420p', '-auto-alt-ref', '0', '-b:v', '1800k']);
const mp4Probe = ffprobe(MP4_PATH);
const webmProbe = ffprobe(WEBM_PATH);
const mp4Stream = mp4Probe.streams[0];
const mp4Format = mp4Probe.format;
const expectedFrames = frameBuffers.length;
const expectedDurationSec = expectedFrames / FPS;
const mp4Pass = mp4Stream.codec_name === 'h264'
  && mp4Stream.pix_fmt === 'yuv420p'
  && mp4Stream.avg_frame_rate === '24/1'
  && Number(mp4Stream.nb_read_frames) === expectedFrames
  && Math.abs(Number(mp4Format.duration) - expectedDurationSec) < 0.05
  && String(mp4Format.format_name).includes('mp4');

const forbiddenRequests = requests.filter((url) => /splinetool|prod\.spline\.design|\.splinecode/i.test(url));
const axisPass = Object.fromEntries(Object.entries(mechanicalQA.axisSupport).map(([axis, result]) => [axis, result.forwardEndpointErrorRad === 0 && result.inverseEndpointErrorRad === 0 && result.restoredAfterPair]));
const layerPass = Object.values(mechanicalQA.layerSupport).every((layers) => Object.values(layers).every((entry) => entry.pass));
const runtimePass = pageErrors.length === 0 && consoleErrors.length === 0 && forbiddenRequests.length === 0;
const allPass = geometryConfigFrozen && geometryStatsFrozen && geometryCodeFrozen && full360Pass && interactionPass
  && axisPass.X && axisPass.Y && axisPass.Z && layerPass
  && mechanicalQA.repeatability30.pass && mechanicalQA.inverseRestoration.pass && runtimePass && mp4Pass;

const qa = {
  generatedAt: new Date().toISOString(),
  source: {
    baselineBranch: 'agent/proai-cube-geometry-r1',
    baselineCommit: '73082717909b6f4225841401fe4962d6ff4bbcca',
    branch: 'agent/proai-cube-presentation-motion-r1',
    prototypePath: 'docs/site-evolution/spline/proai-cube-presentation-motion-r1/',
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
    full360Move,
    full360Samples,
    full360Pass,
  },
  mechanicalQA,
  interactionQA: {
    dragTurn,
    duringDrag: duringDrag.interaction,
    sliceFinishedWhileDrag: { activeTurn: sliceFinishedWhileDrag.activeTurn, lastTurnResult: sliceFinishedWhileDrag.lastTurnResult },
    blockedAfterSlice: { activeTurn: blockedAfterSlice.activeTurn, interaction: blockedAfterSlice.interaction },
    afterRelease: afterRelease.interaction,
    duringCalmDelay: duringCalmDelay.interaction,
    earlyResume: earlyResume.interaction,
    blendedResume: blendedResume.interaction,
    activeSliceCompleted,
    blockedNewSliceAttempt,
    nextSliceBlocked,
    cameraNoSnap,
    pass: interactionPass,
  },
  video: {
    mp4: { path: 'review/' + path.basename(MP4_PATH), ...mp4Probe, byteLength: fs.statSync(MP4_PATH).size },
    webm: { path: 'review/' + path.basename(WEBM_PATH), ...webmProbe, byteLength: fs.statSync(WEBM_PATH).size },
    fps: FPS,
    frameCount: expectedFrames,
    expectedDurationSec,
    segments,
    mp4Pass,
    coverage: {
      normal3q: true,
      rubikSlices: true,
      largeAngleRotation: true,
      full360: true,
      multiAxisPresentation: true,
      settle: true,
      manualOrbitDrag: true,
      softAutonomousResume: true,
      sliceDuringInspection: true,
    },
  },
  runtime: { totalRequests: requests.length, forbiddenRequests, splineDependency: forbiddenRequests.length ? 'FOUND' : 'NONE', pageErrors, consoleErrors, pass: runtimePass },
  acceptance: {
    geometryR1Preserved: geometryConfigFrozen && geometryStatsFrozen && geometryCodeFrozen ? 'PASS' : 'FAIL',
    wholeCube360: full360Pass ? 'PASS' : 'FAIL',
    interaction: interactionPass ? 'PASS' : 'FAIL',
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
const report = `# ProAI Rubik Cube — Presentation Motion R1.1\n\n## Scope\n\nPresentation-motion-only refinement from Geometry R1 commit \`73082717909b6f4225841401fe4962d6ff4bbcca\`. Geometry R1, bevel/gaps, temporary materials/lights and X/Y/Z slice mechanics are frozen.\n\n## Whole-cube presentation\n\n- Large yaw moves: **${p.moves.map((m) => m.yawDeg + '°').join(', ')}**.\n- Duration range: **${p.inspectionDurationRangeMs[0]}–${p.inspectionDurationRangeMs[1]} ms**.\n- Full 360 move: **${p.moves.find((m) => Math.abs(m.yawDeg) === 360).durationMs} ms**, rare in the autonomous sequence.\n- Secondary modulation: pitch up to **±${Math.max(...p.moves.map((m) => Math.abs(m.pitchAmpDeg)))}°**, roll up to **±${Math.max(...p.moves.map((m) => Math.abs(m.rollAmpDeg)))}°**.\n- Presentation easing profiles: ${p.easingProfiles.map((curve) => `cubic-bezier(${curve.join(', ')})`).join('; ')}.\n- Existing micro drift remains unchanged: yaw ±3.8°, pitch ±2.15°, roll ±0.65°.\n\n## Interaction semantics\n\n- Manual Orbit drag pauses whole-cube presentation and blocks new autonomous slices.\n- An already active Rubik slice continues to its exact ±90° endpoint during drag.\n- Release delay remains **1850 ms**; presentation blend remains **2400 ms**.\n- Camera remains at the manually chosen orbit; no automatic camera reset/snap.\n- Horizontal azimuth is unrestricted; vertical polar range remains Geometry R1 / Motion R1 bounds.\n\n## QA\n\n- Geometry R1 preserved: **${qa.acceptance.geometryR1Preserved}**.\n- Full 360 inspection: **${qa.acceptance.wholeCube360}**.\n- Interaction active-slice completion / no next slice / no snap: **${qa.acceptance.interaction}**.\n- X / Y / Z: **${qa.acceptance.X} / ${qa.acceptance.Y} / ${qa.acceptance.Z}**.\n- 30 mixed turns: **${qa.acceptance.repeatability30}**; max position ${mechanicalQA.repeatability30.maxCanonicalPosition}; quaternion ${mechanicalQA.repeatability30.maxCanonicalQuaternionRad}; scale ${mechanicalQA.repeatability30.maxCanonicalScale}.\n- Inverse restoration: **${qa.acceptance.inverseRestoration}**.\n- Browser/runtime: **${qa.acceptance.runtime}**; Spline dependency **${qa.acceptance.splineDependency}**.\n- Owner MP4: **${qa.acceptance.ownerReviewMP4}**, ${expectedDurationSec.toFixed(3)} s @ ${FPS} fps, H.264/yuv420p.\n\n## Review evidence\n\n- \`review/proai-cube-presentation-motion-r1-natural.png\`\n- \`review/proai-cube-presentation-motion-r1-large-angle.png\`\n- \`review/proai-cube-presentation-motion-r1-slice-plus-presentation.png\`\n- \`review/proai-cube-presentation-motion-r1-review-20s.mp4\` (primary)\n- \`review/proai-cube-presentation-motion-r1-review-20s.webm\` (secondary)\n- \`QA.json\`\n\n## Gate\n\nAutomated acceptance: **${qa.acceptance.overall}**. Materials + Lighting remain blocked pending owner review.\n`;
fs.writeFileSync(REPORT_PATH, report);

console.log(JSON.stringify({ acceptance: qa.acceptance, video: { frames: expectedFrames, duration: expectedDurationSec, mp4: mp4Probe }, interaction: { activeSliceCompleted, nextSliceBlocked, cameraNoSnap }, full360Samples }, null, 2));
if (!allPass) process.exitCode = 1;
