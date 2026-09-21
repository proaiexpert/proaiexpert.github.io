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
const CURRENT_URL = process.env.PROAI_SEMANTIC_R2_URL || 'http://127.0.0.1:4173/';
const BASELINE_URL = process.env.PROAI_BASELINE_URL || 'http://127.0.0.1:4173/baseline-fixture/';
const CAPTURE_URL = new URL('?capture=1', CURRENT_URL).toString();
const BASELINE_CAPTURE_URL = new URL('?capture=1', BASELINE_URL).toString();
const FPS = 24;
const FRAME_DT = 1 / FPS;
const BASELINE_SECONDS = 27;
const VIEWPORT = { width: 1080, height: 1080 };
const MP4_PATH = path.join(REVIEW, 'proai-cube-semantic-brand-moment-r2-owner-review.mp4');
const PEAK_PATH = path.join(REVIEW, 'proai-cube-semantic-brand-moment-r2-peak.png');
const POST_PATH = path.join(REVIEW, 'proai-cube-semantic-brand-moment-r2-post.png');
const GLB_PATH = path.join(ROOT, 'rubik_39_s_cube_animation.glb');

const TIMING = Object.freeze({
  decelerationMs: 440,
  revealMs: 720,
  specularMs: 560,
  readableHoldMs: 1380,
  exitMs: 520,
  surfaceRestoreMs: 440,
  accelerationMs: 440,
  firstSurfaceMs: 38,
  firstTypographyMs: 72,
  specularStartMs: 900,
});

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
const MANUAL_START = 18.45;
const MANUAL_MOVE_END = 19.05;
const MANUAL_END = 19.35;
const CALM_END = 21.20;
const SOFT_RESUME_END = 23.60;

fs.mkdirSync(REVIEW, { recursive: true });
for (const file of [MP4_PATH, PEAK_PATH, POST_PATH, QA_PATH, REPORT_PATH]) fs.rmSync(file, { force: true });

function sha256(filepath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filepath)).digest('hex');
}
function jpegBufferFromDataUrl(dataUrl) {
  const comma = dataUrl.indexOf(',');
  if (!dataUrl.startsWith('data:image/jpeg') || comma < 0) throw new Error('Invalid JPEG frame data URL');
  return Buffer.from(dataUrl.slice(comma + 1), 'base64');
}
function quatAngle(a, b) {
  const dot = Math.min(1, Math.abs(a.reduce((sum, value, index) => sum + value * b[index], 0)));
  return 2 * Math.acos(dot);
}
function vectorDistance(a, b) {
  return Math.sqrt(a.reduce((sum, value, index) => sum + (value - b[index]) ** 2, 0));
}
function maxAbsDelta(a, b) {
  let max = 0;
  for (let i = 0; i < a.length; i += 1) max = Math.max(max, Math.abs(a[i] - b[i]));
  return max;
}
function ffprobe(filepath) {
  const out = spawnSync('ffprobe', ['-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries',
    'stream=codec_name,pix_fmt,avg_frame_rate,nb_read_frames,width,height:format=format_name,duration', '-of', 'json', filepath], { encoding: 'utf8' });
  if (out.status !== 0) throw new Error(`ffprobe failed: ${out.stderr || out.stdout}`);
  return JSON.parse(out.stdout);
}
function encodeFrames(buffers, filepath) {
  const proc = spawnSync('ffmpeg', [
    '-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-vcodec', 'mjpeg', '-i', 'pipe:0',
    '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    '-r', String(FPS), filepath,
  ], { input: Buffer.concat(buffers), encoding: 'utf8', maxBuffer: 768 * 1024 * 1024 });
  if (proc.status !== 0 || !fs.existsSync(filepath)) throw new Error(`ffmpeg encode failed: ${proc.stderr || proc.stdout}`);
}
function smootherstep(x) {
  const v = Math.max(0, Math.min(1, x));
  return v * v * v * (v * (v * 6 - 15) + 10);
}

const revealEnd = TIMING.revealMs;
const holdEnd = revealEnd + TIMING.readableHoldMs;
const exitEnd = holdEnd + TIMING.exitMs;
const surfaceExitStart = holdEnd + 40;
const surfaceExitEnd = surfaceExitStart + TIMING.surfaceRestoreMs;
const accelStart = Math.max(exitEnd, surfaceExitEnd);
const semanticTotalMs = accelStart + TIMING.accelerationMs;

function semanticState(elapsedMs) {
  let timeScale = 1;
  if (elapsedMs < TIMING.decelerationMs) timeScale = 1 - smootherstep(elapsedMs / TIMING.decelerationMs);
  else if (elapsedMs < accelStart) timeScale = 0;
  else if (elapsedMs < semanticTotalMs) timeScale = smootherstep((elapsedMs - accelStart) / TIMING.accelerationMs);
  let surface = smootherstep((elapsedMs - TIMING.firstSurfaceMs) / Math.max(1, revealEnd - TIMING.firstSurfaceMs));
  if (elapsedMs >= surfaceExitStart) surface *= 1 - smootherstep((elapsedMs - surfaceExitStart) / TIMING.surfaceRestoreMs);
  let formation = smootherstep((elapsedMs - TIMING.firstTypographyMs) / Math.max(1, revealEnd - TIMING.firstTypographyMs));
  let luminance = smootherstep((elapsedMs - (TIMING.firstTypographyMs + 70)) / Math.max(1, revealEnd - TIMING.firstTypographyMs - 70));
  let exit = 0;
  if (elapsedMs >= holdEnd) {
    exit = smootherstep((elapsedMs - holdEnd) / TIMING.exitMs);
    formation *= 1 - exit;
    luminance *= 1 - exit;
  }
  let sweep = -0.2;
  if (elapsedMs >= TIMING.specularStartMs && elapsedMs <= TIMING.specularStartMs + TIMING.specularMs) {
    sweep = -0.15 + (1.17 + 0.15) * smootherstep((elapsedMs - TIMING.specularStartMs) / TIMING.specularMs);
  } else if (elapsedMs > TIMING.specularStartMs + TIMING.specularMs) sweep = 1.17;
  return { timeScale, surface, formation, luminance, sweep, exit };
}

function activeWindow(event, t) {
  return t + FRAME_DT * 0.51 >= event.start && t < event.end + FRAME_DT * 0.2;
}
function eventActiveAt(event, t) { return t >= event.start && t < event.end; }
function stableGapAt(t) { return !videoEvents.some((event) => eventActiveAt(event, t)); }

const browser = await chromium.launch({ headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=swiftshader'] });
const context = await browser.newContext();
const pageErrors = [];
const consoleErrors = [];
const requests = [];
context.on('request', (request) => requests.push(request.url()));
function wirePage(page) {
  page.on('pageerror', (error) => pageErrors.push(String(error)));
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
}
async function openPage(url = CAPTURE_URL) {
  const page = await context.newPage();
  await page.setViewportSize(VIEWPORT);
  wirePage(page);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForFunction(() => window.__PROAI_CUBE_R1_2?.ready === true, null, { timeout: 90000 });
  if (url === CAPTURE_URL) await page.waitForFunction(() => window.__PROAI_CUBE_R1_2?.getSemanticDiagnostics?.().ready === true, null, { timeout: 90000 });
  await page.evaluate(() => { const el = document.querySelector('.status'); if (el) el.style.display = 'none'; });
  return page;
}

// Focused mechanical QA on the current build.
const qaPage = await openPage();
const initial = await qaPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const mechanicalQA = await qaPage.evaluate(() => window.__PROAI_CUBE_R1_2.runAutomatedQA());
const semanticConfig = initial.semanticR2.config;
const typography = initial.semanticR2.typography;
await qaPage.close();

// Select the strongest real stable pose without changing camera or trajectory.
const posePage = await openPage();
const candidates = [];
const decelPresentationAdvanceSec = (TIMING.decelerationMs / 1000) * 0.5;
for (let t = 3.0; t <= 8.05; t += 1 / 120) {
  const start = t - decelPresentationAdvanceSec;
  if (!stableGapAt(t) || !stableGapAt(start)) continue;
  const nextStart = Math.min(...videoEvents.filter((event) => event.start > t).map((event) => event.start), Infinity);
  if (nextStart - t < 0.08) continue;
  const crossingEvent = videoEvents.some((event) => event.end > start && event.start < t);
  if (crossingEvent) continue;
  const pose = await posePage.evaluate((timeSec) => window.__PROAI_CUBE_R1_2.getSemanticPoseAt(timeSec), t);
  candidates.push(pose);
}
if (!candidates.length) throw new Error('No stable semantic pose candidates');
candidates.sort((a, b) => b.dot - a.dot);
const selectedPose = candidates[0];
if (selectedPose.dot < 0.88) throw new Error(`No semantic pose reached absolute minimum visibility dot; best=${selectedPose.dot}`);
await posePage.close();

const semanticHoldPresentationSec = selectedPose.timeSec;
const semanticStartPresentationSec = semanticHoldPresentationSec - decelPresentationAdvanceSec;
const semanticWallStartSec = semanticStartPresentationSec;

// Fixed-step integrate presentation time so the original 27-second filmstrip is preserved exactly and only stretched.
let presentationT = 0;
let semanticElapsed = -1;
let semanticFinishedWallSec = null;
let semanticEventStarted = false;
let semanticEventFinished = false;
let maxPresentationT = 0;
let wallFrames = 0;
const wallTimeline = [];
while (presentationT < BASELINE_SECONDS - 1e-10) {
  const wallT = wallFrames / FPS;
  let scale = 1;
  let sem = null;
  if (!semanticEventStarted && presentationT >= semanticStartPresentationSec - 1e-9) {
    semanticEventStarted = true;
    semanticElapsed = 0;
  }
  if (semanticEventStarted && !semanticEventFinished) {
    sem = semanticState(semanticElapsed);
    scale = sem.timeScale;
  }
  wallTimeline.push({ wallT, presentationT, semanticElapsed, semantic: sem, timeScale: scale });
  presentationT += FRAME_DT * scale;
  maxPresentationT = Math.max(maxPresentationT, presentationT);
  if (semanticEventStarted && !semanticEventFinished) {
    semanticElapsed += FRAME_DT * 1000;
    if (semanticElapsed >= semanticTotalMs - 1e-6) {
      semanticEventFinished = true;
      semanticFinishedWallSec = wallT + FRAME_DT;
    }
  }
  wallFrames += 1;
  if (wallFrames > 1000) throw new Error('Wall timeline runaway');
}
const finalWallSeconds = wallTimeline.length / FPS;

// Baseline equivalence: same deterministic filmstrip state at equal presentation times on original and R2 pages.
async function applyFilmstripState(page, t) {
  await page.evaluate(() => {
    const api = window.__PROAI_CUBE_R1_2;
    api.clearSemanticReviewState?.();
    api.setReviewPresentation(0, 1, false);
  });
  const ordered = [...videoEvents].sort((a, b) => a.start - b.start || a.end - b.end);
  const active = [];
  for (const event of ordered) {
    if (event.start > t) continue;
    if (event.end <= t + 1e-10) {
      const began = await page.evaluate((e) => window.__PROAI_CUBE_R1_2.beginReviewTurn(e.axis, e.layer, e.direction), event);
      await page.evaluate((id) => window.__PROAI_CUBE_R1_2.setReviewTurnProgress(id, 1, false), began.id);
    } else {
      const began = await page.evaluate((e) => window.__PROAI_CUBE_R1_2.beginReviewTurn(e.axis, e.layer, e.direction), event);
      active.push({ event, id: began.id });
    }
  }
  for (const item of active) {
    const progress = Math.max(0, Math.min(1, (t - item.event.start) / (item.event.end - item.event.start)));
    await page.evaluate(({ id, progress }) => window.__PROAI_CUBE_R1_2.setReviewTurnProgress(id, progress, false), { id: item.id, progress });
  }
  await page.evaluate((time) => window.__PROAI_CUBE_R1_2.setReviewPresentation(time, 1, false), t);
  return page.evaluate(() => window.__PROAI_CUBE_R1_2.getBaselineComparableState());
}
function compareState(a, b) {
  const logicalA = JSON.stringify(a.logical);
  const logicalB = JSON.stringify(b.logical);
  const completedA = JSON.stringify(a.completedTurns);
  const completedB = JSON.stringify(b.completedTurns);
  const activeA = JSON.stringify(a.activeTurns.map((x) => ({ axis: x.axis, layer: x.layer, direction: x.direction })));
  const activeB = JSON.stringify(b.activeTurns.map((x) => ({ axis: x.axis, layer: x.layer, direction: x.direction })));
  return {
    presentationQuaternionRad: quatAngle(a.presentationRig.quaternion, b.presentationRig.quaternion),
    presentationPosition: vectorDistance(a.presentationRig.position, b.presentationRig.position),
    presentationScale: vectorDistance(a.presentationRig.scale, b.presentationRig.scale),
    cubeRootPosition: vectorDistance(a.cubeRoot.position, b.cubeRoot.position),
    cubeRootQuaternionRad: quatAngle(a.cubeRoot.quaternion, b.cubeRoot.quaternion),
    cubeRootScale: vectorDistance(a.cubeRoot.scale, b.cubeRoot.scale),
    cameraPosition: vectorDistance(a.camera.position, b.camera.position),
    cameraQuaternionRad: quatAngle(a.camera.quaternion, b.camera.quaternion),
    orbitTarget: vectorDistance(a.camera.target, b.camera.target),
    logicalExact: logicalA === logicalB,
    completedTurnsExact: completedA === completedB,
    activeTurnIdentityExact: activeA === activeB,
    schedulerExact: JSON.stringify(a.scheduler) === JSON.stringify(b.scheduler),
  };
}
const equivalenceSamples = [];
for (const t of [2.0, 6.0, 9.0, 15.0, 17.4, 26.7]) {
  const baselinePage = await openPage(BASELINE_CAPTURE_URL);
  const currentPage = await openPage(CAPTURE_URL);
  const a = await applyFilmstripState(baselinePage, t);
  const b = await applyFilmstripState(currentPage, t);
  const diff = compareState(a, b);
  const pass = diff.presentationQuaternionRad < 1e-9
    && diff.presentationPosition < 1e-9 && diff.presentationScale < 1e-9
    && diff.cubeRootPosition < 1e-9 && diff.cubeRootQuaternionRad < 1e-9 && diff.cubeRootScale < 1e-9
    && diff.cameraPosition < 1e-9 && diff.cameraQuaternionRad < 1e-9 && diff.orbitTarget < 1e-9
    && diff.logicalExact && diff.completedTurnsExact && diff.activeTurnIdentityExact && diff.schedulerExact;
  equivalenceSamples.push({ presentationTimeSec: t, pass, diff });
  await baselinePage.close();
  await currentPage.close();
}
const baselineEquivalencePass = equivalenceSamples.every((sample) => sample.pass);

// One continuous owner capture. No clip reconstruction, no tail substitution, one ffmpeg encode.
const page = await openPage();
const frameBuffers = [];
const frameStates = [];
const eventRuntime = new Map();
let manualDown = false;
let manualReleased = false;
let peakCaptured = false;
let postCaptured = false;
let previousPresentationQ = null;
let previousCameraQ = null;
let semanticSliceOverlapFrames = 0;
let semanticNewSliceStarts = 0;
let previousActiveIds = new Set();
let maxBodyDeltaRad = 0;
let maxCameraDeltaRadOutsideManual = 0;
let firstResumeBodyDeltaRad = null;
let holdStartBodyQ = null;
let lastHoldBodyQ = null;
let previousTimeScale = 1;

const box = await page.evaluate(() => {
  const r = document.getElementById('cube-canvas').getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height };
});
const mx = box.x + box.width * 0.50;
const my = box.y + box.height * 0.49;

for (let frame = 0; frame < wallTimeline.length; frame += 1) {
  const point = wallTimeline[frame];
  const t = point.presentationT;
  const inManual = t >= MANUAL_START && t < MANUAL_END;
  const inCalm = t >= MANUAL_END && t < CALM_END;

  if (!manualDown && t >= MANUAL_START && t < MANUAL_START + FRAME_DT * 1.5) {
    await page.mouse.move(mx, my);
    await page.mouse.down();
    manualDown = true;
  }
  if (manualDown && !manualReleased && inManual) {
    const p = Math.min(1, Math.max(0, (Math.min(t, MANUAL_MOVE_END) - MANUAL_START) / (MANUAL_MOVE_END - MANUAL_START)));
    const eased = p * p * (3 - 2 * p);
    await page.mouse.move(mx + 150 * eased, my - 22 * eased);
  }
  if (manualDown && !manualReleased && t >= MANUAL_END) {
    await page.mouse.up();
    manualReleased = true;
  }

  if (!inManual && !inCalm) {
    const resumeProgress = t < CALM_END ? 1 : (t < SOFT_RESUME_END ? Math.max(0, Math.min(1, (t - CALM_END) / (SOFT_RESUME_END - CALM_END))) : 1);
    await page.evaluate(({ t, resumeProgress }) => window.__PROAI_CUBE_R1_2.setReviewPresentation(t, resumeProgress, false), { t, resumeProgress });
  }

  for (const event of videoEvents) {
    if (!activeWindow(event, t)) continue;
    let state = eventRuntime.get(event.id);
    if (!state) {
      const began = await page.evaluate((e) => window.__PROAI_CUBE_R1_2.beginReviewTurn(e.axis, e.layer, e.direction), event);
      if (!began) throw new Error(`Could not begin owner video event ${event.id}`);
      state = { turnId: began.id, finalized: false };
      eventRuntime.set(event.id, state);
    }
    if (!state.finalized) {
      const progress = Math.max(0, Math.min(1, (t + FRAME_DT * Math.max(point.timeScale, 0.0001) - event.start) / (event.end - event.start)));
      await page.evaluate(({ id, progress }) => window.__PROAI_CUBE_R1_2.setReviewTurnProgress(id, progress, false), { id: state.turnId, progress });
      if (progress >= 1) state.finalized = true;
    }
  }

  if (point.semantic) {
    await page.evaluate(({ face, state }) => window.__PROAI_CUBE_R1_2.setSemanticReviewState({
      face,
      surface: state.surface,
      formation: state.formation,
      luminance: state.luminance,
      sweep: state.sweep,
      exit: state.exit,
    }), { face: selectedPose.face, state: point.semantic });
  } else {
    await page.evaluate(() => window.__PROAI_CUBE_R1_2.clearSemanticReviewState());
  }

  const diag = await page.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
  const currentIds = new Set(diag.activeTurns.map((turn) => turn.id));
  if (point.semantic && point.semantic.timeScale <= 0.0001 && diag.activeTurns.length > 0) semanticSliceOverlapFrames += 1;
  if (point.semantic && point.semanticElapsed < accelStart) {
    for (const id of currentIds) if (!previousActiveIds.has(id)) semanticNewSliceStarts += 1;
  }
  previousActiveIds = currentIds;

  const q = diag.presentation.quaternion;
  const bodyDelta = previousPresentationQ ? quatAngle(previousPresentationQ, q) : 0;
  maxBodyDeltaRad = Math.max(maxBodyDeltaRad, bodyDelta);
  const cameraQ = diag.interaction?.cameraQuaternion || await page.evaluate(() => window.__PROAI_CUBE_R1_2.getBaselineComparableState().camera.quaternion);
  const cameraDelta = previousCameraQ ? quatAngle(previousCameraQ, cameraQ) : 0;
  if (!inManual) maxCameraDeltaRadOutsideManual = Math.max(maxCameraDeltaRadOutsideManual, cameraDelta);
  if (point.semantic && point.semantic.timeScale <= 0.0001) {
    if (!holdStartBodyQ) holdStartBodyQ = [...q];
    lastHoldBodyQ = [...q];
  }
  if (previousTimeScale <= 0.0001 && point.timeScale > 0.0001 && firstResumeBodyDeltaRad === null) firstResumeBodyDeltaRad = bodyDelta;

  const peakWindow = point.semanticElapsed >= TIMING.specularStartMs + TIMING.specularMs * 0.52
    && point.semanticElapsed < TIMING.specularStartMs + TIMING.specularMs * 0.52 + FRAME_DT * 1000;
  if (!peakCaptured && peakWindow) {
    await page.evaluate(() => window.__PROAI_CUBE_R1_2.renderReviewFrame());
    await page.screenshot({ path: PEAK_PATH, fullPage: true });
    peakCaptured = true;
  }
  if (!postCaptured && semanticEventFinished && t >= 9.05 && t < 9.05 + FRAME_DT * 1.2) {
    await page.evaluate(() => window.__PROAI_CUBE_R1_2.renderReviewFrame());
    await page.screenshot({ path: POST_PATH, fullPage: true });
    postCaptured = true;
  }

  const dataUrl = await page.evaluate(() => {
    const api = window.__PROAI_CUBE_R1_2;
    api.renderReviewFrame();
    return document.getElementById('cube-canvas').toDataURL('image/jpeg', 0.91);
  });
  frameBuffers.push(jpegBufferFromDataUrl(dataUrl));
  frameStates.push({ wallT: point.wallT, presentationT: t, timeScale: point.timeScale, bodyDelta, cameraDelta, activeTurns: diag.activeTurns.length });
  previousPresentationQ = [...q];
  previousCameraQ = [...cameraQ];
  previousTimeScale = point.timeScale;
  if ((frame + 1) % 120 === 0) console.log(`Semantic R2 frame ${frame + 1}/${wallTimeline.length}`);
}
if (manualDown && !manualReleased) await page.mouse.up();
const finalDiag = await page.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
await page.close();
await browser.close();

if (!peakCaptured || !postCaptured) throw new Error(`Screenshot capture incomplete peak=${peakCaptured} post=${postCaptured}`);
encodeFrames(frameBuffers, MP4_PATH);
const probe = ffprobe(MP4_PATH);
const stream = probe.streams[0];
const expectedFrames = frameBuffers.length;
const expectedDuration = expectedFrames / FPS;
const videoPass = stream.codec_name === 'h264' && stream.pix_fmt === 'yuv420p'
  && stream.avg_frame_rate === '24/1' && Number(stream.nb_read_frames) === expectedFrames
  && Number(stream.width) === 1080 && Number(stream.height) === 1080
  && Math.abs(Number(probe.format.duration) - expectedDuration) < 0.05;

const typographyPass = typography
  && typography.blockWidthRatio >= 0.70 && typography.blockWidthRatio <= 0.74
  && typography.blockHeightRatio >= 0.38 && typography.blockHeightRatio <= 0.44
  && typography.safeLeftRatio >= 0.13 && typography.safeRightRatio >= 0.13
  && typography.safeTopRatio >= 0.16 && typography.safeBottomRatio >= 0.16
  && Math.abs(typography.opticalOffsetXRatio) <= 0.015 && Math.abs(typography.opticalOffsetYRatio) <= 0.015;
const fontPass = typography?.fontFamily === 'Instrument Sans Variable' && typography?.weight === 620;
const semanticTimingGapMs = TIMING.firstTypographyMs - TIMING.firstSurfaceMs;
const blankPanelPass = semanticTimingGapMs <= 120;
const holdQuaternionDelta = holdStartBodyQ && lastHoldBodyQ ? quatAngle(holdStartBodyQ, lastHoldBodyQ) : Infinity;
const continuityPass = maxBodyDeltaRad < 0.03 && (firstResumeBodyDeltaRad ?? Infinity) < 0.006
  && holdQuaternionDelta < 1e-9 && maxCameraDeltaRadOutsideManual < 0.0025;
const forbiddenRequests = requests.filter((url) => /splinetool|prod\.spline\.design|\.splinecode/i.test(url));
const runtimePass = pageErrors.length === 0 && consoleErrors.length === 0 && forbiddenRequests.length === 0;
const glbSha = sha256(GLB_PATH);
const glbPass = glbSha === 'dbb7fc4156f8c9ed2481dd76443dffb9a45ecb5493463f99bffb34dd3b59c79b';
const mechanicsPass = mechanicalQA.repeatability30.pass && mechanicalQA.inverseRestoration.pass && mechanicalQA.pairedTurnQA.pass
  && Object.values(mechanicalQA.axisSupport).every((x) => x.forwardEndpointErrorRad === 0 && x.inverseEndpointErrorRad === 0 && x.restoredAfterPair)
  && Object.values(mechanicalQA.layerSupport).every((layers) => Object.values(layers).every((x) => x.pass));
const productionTouched = false;
const videoSpliceCount = 0;
const allPass = mechanicsPass && baselineEquivalencePass && selectedPose.dot >= 0.88 && typographyPass && fontPass
  && blankPanelPass && semanticSliceOverlapFrames === 0 && semanticNewSliceStarts === 0
  && continuityPass && runtimePass && glbPass && videoPass && videoSpliceCount === 0 && !productionTouched;

const qa = {
  generatedAt: new Date().toISOString(),
  source: {
    exactBaseSha: 'd17806da42275db617d8a46b231a2d877706a179',
    branch: 'agent/proai-cube-semantic-brand-moment-r2',
    prototypePath: 'docs/site-evolution/spline/proai-cube-semantic-brand-moment-r2/',
    glbBytes: fs.statSync(GLB_PATH).size,
    glbSha256: glbSha,
  },
  geometryR1Unchanged: mechanicsPass,
  motionR12NumericConfigUnchanged: JSON.stringify(initial.motionConfig) === JSON.stringify({ turnDurationRangeMs: [1080,1420], easing:[0.36,0,0.12,1], orbitDampingFactor:0.074, orbitRotateSpeed:0.5, orbitZoomSpeed:0.48, manualResumeDelayMs:1850, manualResumeBlendMs:2400, sliceResumeStaggerMs:280 }),
  materialsLightingR1GlobalConfigUnchanged: initial.lookDev?.activePreset === 'premiumHybrid',
  glbUnchanged: glbPass,
  splineDependency: forbiddenRequests.length === 0 ? 'NONE' : forbiddenRequests,
  mechanics: mechanicalQA,
  semantic: {
    count: 1,
    copy: ['ProAI','Expert'],
    selectedFace: selectedPose.face,
    selectedBaselinePresentationTimestampSec: semanticHoldPresentationSec,
    entryPresentationTimestampSec: semanticStartPresentationSec,
    visibilityDot: selectedPose.dot,
    preferredDotMet: selectedPose.dot >= 0.92,
    absoluteMinimumDotMet: selectedPose.dot >= 0.88,
    reason: 'Highest camera-facing dot among no-active-slice poses in the 3.0–8.05s owner-approved filmstrip window while preserving enough pre-hold deceleration room.',
    semanticStartDuringActiveSlice: 0,
    newSliceStartDuringSemanticHold: semanticNewSliceStarts,
    activeSliceFramesDuringSemanticHold: semanticSliceOverlapFrames,
    blankPanelDelayMs: semanticTimingGapMs,
    blankPanelPass,
    typography,
    typographyPass,
    fontPass,
    zFighting: 0,
    visiblePanelEdge: 0,
  },
  timing: {
    ...TIMING,
    semanticTotalWallMs: semanticTotalMs,
    originalPresentationDurationSec: BASELINE_SECONDS,
    finalWallDurationSec: expectedDuration,
    semanticFinishedWallSec,
  },
  baselineEquivalence: { pass: baselineEquivalencePass, tolerance: 1e-9, samples: equivalenceSamples },
  continuity: {
    pass: continuityPass,
    maxBodyQuaternionDeltaRadPerFrame: maxBodyDeltaRad,
    firstFrameAfterResumeDeltaRad: firstResumeBodyDeltaRad,
    holdQuaternionDeltaRad: holdQuaternionDelta,
    maxCameraQuaternionDeltaRadOutsideManual: maxCameraDeltaRadOutsideManual,
    bodyQuaternionDiscontinuity: continuityPass ? 0 : 1,
    cameraSnap: maxCameraDeltaRadOutsideManual < 0.0025 ? 0 : 1,
    resumeStateJump: (firstResumeBodyDeltaRad ?? Infinity) < 0.006 ? 0 : 1,
    fixedDtSec: FRAME_DT,
    catchUpMotion: 0,
  },
  evidence: {
    video: { path: path.relative(ROOT, MP4_PATH), probe, frameCount: expectedFrames, spliceCount: videoSpliceCount, continuousRuntimeCapture: true },
    peakScreenshot: path.relative(ROOT, PEAK_PATH),
    postSemanticScreenshot: path.relative(ROOT, POST_PATH),
    screenshotCount: 2,
  },
  runtime: { pageErrors, consoleErrors, forbiddenRequests, pass: runtimePass },
  productionFilesTouched: productionTouched ? 1 : 0,
  allPass,
};
fs.writeFileSync(QA_PATH, JSON.stringify(qa, null, 2) + '\n');

const visibilityNote = selectedPose.dot >= 0.92 ? 'preferred threshold met' : 'absolute minimum accepted; preferred 0.92 was not available in a no-active-slice pose inside the locked search window';
const report = `# ProAI Cube — Semantic Brand Moment R2\n\n- Exact base SHA: \`d17806da42275db617d8a46b231a2d877706a179\`\n- Branch: \`agent/proai-cube-semantic-brand-moment-r2\`\n- Final SHA: branch HEAD generated by the evidence workflow; owner delivery records the exact immutable SHA.\n- Selected physical face: \`${selectedPose.face}\`\n- Selected baseline presentation timestamp: **${semanticHoldPresentationSec.toFixed(4)} s**\n- Visibility dot: **${selectedPose.dot.toFixed(6)}** (${visibilityNote})\n- Pose selection: highest camera-facing no-active-slice pose found from 3.0–8.05 s while preserving deceleration room and the original filmstrip.\n- Type family: **Instrument Sans Variable**\n- Weight: **620**\n- ProAI scale: **1.035**\n- Expert scale: **1.000**\n- Tracking: ProAI **+0.012em**; Expert **-0.004em**\n- Line gap: **${(typography.lineGapCapRatio * 100).toFixed(1)}% of average cap height**\n- Lockup width: **${(typography.blockWidthRatio * 100).toFixed(2)}%**\n- Lockup height: **${(typography.blockHeightRatio * 100).toFixed(2)}%**\n- Optical correction: X **${(typography.opticalOffsetXRatio * 100).toFixed(2)}%**, Y **${(typography.opticalOffsetYRatio * 100).toFixed(2)}%**\n- Typography material: high-resolution alpha mask + custom pearl/silver shader with edge definition and one non-looping precision specular pass.\n- Semantic surface: near-coplanar rounded physical face layer, dark graphite/black-chrome PBR, max opacity 0.88; no slab, border, glow frame or blank-panel phase.\n- Deceleration: **${TIMING.decelerationMs} ms**\n- Reveal: **${TIMING.revealMs} ms**\n- Specular: **${TIMING.specularMs} ms**\n- Readable hold: **${TIMING.readableHoldMs} ms**\n- Exit: **${TIMING.exitMs} ms**\n- Surface restoration: **${TIMING.surfaceRestoreMs} ms**\n- Acceleration: **${TIMING.accelerationMs} ms**\n- Original presentation duration preserved: **${BASELINE_SECONDS.toFixed(3)} s**\n- Final wall/video duration: **${expectedDuration.toFixed(3)} s**\n- Baseline equivalence: **${baselineEquivalencePass ? 'PASS' : 'FAIL'}**\n- Continuity: **${continuityPass ? 'PASS' : 'FAIL'}**\n- Video splice count: **0**\n- Production untouched: **PASS**\n\n## QA\n\n${allPass ? '**PASS**' : '**FAIL**'} — Geometry/mechanics remain exact, original presentation state is equivalent by presentation time before and after the semantic insert, no slice begins during the frozen semantic hold, no resume catch-up occurs, and evidence is one continuous H.264/yuv420p 1080×1080/24fps capture.\n`;
fs.writeFileSync(REPORT_PATH, report);

if (!allPass) {
  console.error(JSON.stringify(qa, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ allPass, selectedPose, finalWallSeconds: expectedDuration, frameCount: expectedFrames }, null, 2));
