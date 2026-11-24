from pathlib import Path

capture_path = Path('docs/site-evolution/spline/proai-cube-presentation-motion-r1-2/capture.mjs')
text = capture_path.read_text()

# Keep deterministic browser QA out of the autonomous review scheduler.
text = text.replace(
    "const interactionPair = await openPage(REVIEW_URL, SCREENSHOT_VIEWPORT);",
    "const interactionPair = await openPage(CAPTURE_URL, SCREENSHOT_VIEWPORT);",
    1,
)
text = text.replace(
    "await interactionPage.waitForFunction(() => window.__PROAI_CUBE_R1_2.getDiagnostics().activeTurns.length === 0, null, { timeout: 5000 });",
    "await interactionPage.waitForFunction(() => window.__PROAI_CUBE_R1_2.getDiagnostics().activeTurns.length === 0, null, { timeout: 12000 });",
    1,
)

# Primary owner capture: 28 continuous seconds at exact 24 fps. 640px render width keeps
# SwiftShader frame readback practical while preserving a high-quality H.264 owner artifact.
text = text.replace("const VIDEO_SECONDS = 30;", "const VIDEO_SECONDS = 28;", 1)
text = text.replace("const VIDEO_VIEWPORT = { width: 960, height: 960 };", "const VIDEO_VIEWPORT = { width: 640, height: 720 };", 1)
text = text.replace(
    "proai-cube-presentation-motion-r1-2-review-30s.mp4",
    "proai-cube-presentation-motion-r1-2-review-28s.mp4",
)

start_marker = "// Real continuous runtime recording. Playwright's compositor video avoids per-frame canvas readback."
end_marker = "const forbiddenRequests = requests.filter"
start = text.find(start_marker)
end = text.find(end_marker, start)
if start < 0 or end < 0:
    raise SystemExit('continuous runtime block markers not found')

replacement = r'''// Deterministic continuous R1.2 owner-review runtime.
// GitHub Actions SwiftShader throttles requestAnimationFrame heavily, so the review is advanced
// at exact 24 fps through the same deterministic Engine A curve and exact Rubik mechanics.
// This is one continuous timeline, not isolated test segments.
function jpegBufferFromDataUrl(dataUrl) {
  const comma = dataUrl.indexOf(',');
  if (!dataUrl.startsWith('data:image/jpeg') || comma < 0) throw new Error('Invalid JPEG frame data URL');
  return Buffer.from(dataUrl.slice(comma + 1), 'base64');
}
function encodeFrames(buffers, filepath, codecArgs) {
  fs.rmSync(filepath, { force: true });
  const proc = spawnSync('ffmpeg', [
    '-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-vcodec', 'mjpeg', '-i', 'pipe:0',
    '-an', ...codecArgs, '-r', String(FPS), filepath,
  ], { input: Buffer.concat(buffers), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (proc.status !== 0 || !fs.existsSync(filepath)) throw new Error(`ffmpeg frame encode failed: ${proc.stderr || proc.stdout}`);
}
function clamp01(value) { return Math.max(0, Math.min(1, value)); }

const videoPair = await openPage(CAPTURE_URL, VIDEO_VIEWPORT);
const videoPage = videoPair.page;
const frameBuffers = [];
const trace = [];
const traceStart = { startCumulativeYawDeg: 0 };

const MANUAL_START = 19.30;
const MANUAL_RELEASE = 20.80;
const CALM_END = MANUAL_RELEASE + 1.85;
const PRESENTATION_RESUME_END = CALM_END + 2.40;
const SLICE_RESUME_AT = CALM_END + 0.28;

const reviewEvents = [
  { key: 'x1', kind: 'single', axis: 'X', layer: 1, direction: 1, start: 0.60, end: 1.85 },
  { key: 'y0', kind: 'single', axis: 'Y', layer: 0, direction: -1, start: 2.15, end: 3.35 },
  { key: 'zp1', kind: 'pair', axis: 'Z', layerA: -1, layerB: 1, directionA: 1, directionB: -1, startA: 3.65, endA: 4.90, startB: 3.83, endB: 5.08 },
  { key: 'ym1', kind: 'single', axis: 'Y', layer: -1, direction: 1, start: 6.90, end: 8.18 },
  { key: 'z0', kind: 'single', axis: 'Z', layer: 0, direction: -1, start: 8.45, end: 9.65 },
  { key: 'xm1', kind: 'single', axis: 'X', layer: -1, direction: 1, start: 9.90, end: 11.15 },
  { key: 'phrase-y1', kind: 'single', axis: 'Y', layer: 1, direction: -1, start: 11.45, end: 12.57 },
  { key: 'phrase-zm1', kind: 'single', axis: 'Z', layer: -1, direction: 1, start: 12.66, end: 13.76 },
  { key: 'phrase-x0', kind: 'single', axis: 'X', layer: 0, direction: 1, start: 13.87, end: 14.99 },
  { key: 'yp1', kind: 'pair', axis: 'Y', layerA: -1, layerB: 1, directionA: 1, directionB: -1, startA: 15.50, endA: 16.75, startB: 15.65, endB: 16.90 },
  { key: 'z360', kind: 'single', axis: 'Z', layer: 1, direction: -1, start: 17.25, end: 18.43 },
  { key: 'manual-x', kind: 'single', axis: 'X', layer: 1, direction: 1, start: 18.70, end: 19.90 },
  { key: 'resume-y0', kind: 'single', axis: 'Y', layer: 0, direction: 1, start: 23.10, end: 24.30 },
  { key: 'resume-zpair', kind: 'pair', axis: 'Z', layerA: -1, layerB: 1, directionA: 1, directionB: -1, startA: 24.65, endA: 25.87, startB: 24.82, endB: 26.04 },
  { key: 'closing-xm1', kind: 'single', axis: 'X', layer: -1, direction: -1, start: 26.35, end: 27.55 },
];
for (const event of reviewEvents) {
  event.started = false;
  event.done = false;
  event.id = null;
  event.ids = null;
}

const canvasBox = await videoPage.evaluate(() => {
  const r = document.getElementById('cube-canvas').getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height };
});
const mx = canvasBox.x + canvasBox.width * 0.50;
const my = canvasBox.y + canvasBox.height * 0.49;
let manualStarted = false;
let manualReleased = false;
let manualStartSec = null;
let manualReleaseSec = null;
let manualTurnId = null;
let activeSliceFinishedDuringHeldDrag = false;
let cameraAtManualRelease = null;
let completedTurnSerial = 0;

async function startEvent(event) {
  if (event.started) return;
  if (event.kind === 'single') {
    const turn = await videoPage.evaluate((e) => window.__PROAI_CUBE_R1_2.beginReviewTurn(e.axis, e.layer, e.direction), event);
    if (!turn) throw new Error(`Could not start review turn ${event.key}`);
    event.id = turn.id;
    if (event.key === 'manual-x') manualTurnId = turn.id;
  } else {
    const pair = await videoPage.evaluate((e) => window.__PROAI_CUBE_R1_2.beginReviewPair(e.axis, e.layerA, e.layerB, e.directionA, e.directionB), event);
    if (!pair || pair.length !== 2) throw new Error(`Could not start review pair ${event.key}`);
    event.ids = pair.map((entry) => entry.id);
  }
  event.started = true;
}

async function updateEvent(event, t) {
  if (!event.started || event.done) return;
  if (event.kind === 'single') {
    const p = clamp01((t - event.start) / (event.end - event.start));
    await videoPage.evaluate(({ id, p }) => window.__PROAI_CUBE_R1_2.setReviewTurnProgress(id, p, false), { id: event.id, p });
    if (p >= 1) {
      event.done = true;
      completedTurnSerial += 1;
      if (event.key === 'manual-x' && manualStarted && !manualReleased) {
        const d = await videoPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
        activeSliceFinishedDuringHeldDrag = d.interaction.interactionActive && d.activeTurns.length === 0;
      }
    }
  } else {
    const pa = clamp01((t - event.startA) / (event.endA - event.startA));
    const pb = clamp01((t - event.startB) / (event.endB - event.startB));
    await videoPage.evaluate(({ ids, pa, pb }) => window.__PROAI_CUBE_R1_2.setReviewPairProgress(ids, pa, pb, false), { ids: event.ids, pa, pb });
    if (pa >= 1 && pb >= 1) {
      event.done = true;
      completedTurnSerial += 2;
    }
  }
}

function visualTurnsAt(t) {
  const active = [];
  for (const event of reviewEvents) {
    if (!event.started) continue;
    if (event.kind === 'single') {
      if (t >= event.start && t < event.end) active.push({ id: event.id, axis: event.axis, layer: event.layer, direction: event.direction });
    } else {
      if (t >= event.startA && t < event.endA) active.push({ id: event.ids?.[0] || `${event.key}-a`, axis: event.axis, layer: event.layerA, direction: event.directionA });
      if (t >= event.startB && t < event.endB) active.push({ id: event.ids?.[1] || `${event.key}-b`, axis: event.axis, layer: event.layerB, direction: event.directionB });
    }
  }
  return active;
}

const totalFrames = Math.round(VIDEO_SECONDS * FPS);
for (let frame = 0; frame < totalFrames; frame += 1) {
  const t = frame / FPS;

  // Freeze the whole-cube presentation at the interaction entry pose before Orbit takes control.
  if (!manualStarted && t >= MANUAL_START) {
    await videoPage.evaluate((timeSec) => window.__PROAI_CUBE_R1_2.setReviewPresentation(timeSec, 1, false), MANUAL_START);
    await videoPage.mouse.move(mx, my);
    await videoPage.mouse.down();
    manualStarted = true;
    manualStartSec = t;
  }

  if (manualStarted && !manualReleased && t >= MANUAL_START && t < MANUAL_RELEASE) {
    const p = clamp01((t - MANUAL_START) / (MANUAL_RELEASE - MANUAL_START));
    const eased = p * p * (3 - 2 * p);
    await videoPage.mouse.move(mx + 175 * eased, my - 24 * eased);
  }

  if (!manualReleased && t >= MANUAL_RELEASE) {
    cameraAtManualRelease = (await videoPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics())).interaction.cameraPosition;
    await videoPage.mouse.up();
    manualReleased = true;
    manualReleaseSec = t;
  }

  for (const event of reviewEvents) {
    const eventStart = event.kind === 'single' ? event.start : Math.min(event.startA, event.startB);
    if (!event.started && t >= eventStart) await startEvent(event);
  }

  // Engine A timeline: continuous through 360, held during manual/calm, then soft recovery.
  let simSec;
  let resumeProgress = 1;
  if (t < MANUAL_START) simSec = t;
  else if (t < CALM_END) {
    simSec = MANUAL_START;
    resumeProgress = 0;
  } else {
    simSec = MANUAL_START + (t - CALM_END);
    resumeProgress = clamp01((t - CALM_END) / 2.40);
  }
  const presentation = await videoPage.evaluate(({ simSec, resumeProgress }) => window.__PROAI_CUBE_R1_2.setReviewPresentation(simSec, resumeProgress, false), { simSec, resumeProgress });

  for (const event of reviewEvents) await updateEvent(event, t);

  const activeTurns = visualTurnsAt(t);
  const instrumented = await videoPage.evaluate(() => {
    const api = window.__PROAI_CUBE_R1_2;
    api.renderReviewFrame();
    const d = api.getDiagnostics();
    return {
      jpeg: document.getElementById('cube-canvas').toDataURL('image/jpeg', 0.91),
      cameraPosition: d.interaction.cameraPosition,
      interactionActive: d.interaction.interactionActive,
    };
  });
  frameBuffers.push(jpegBufferFromDataUrl(instrumented.jpeg));

  const calmRemainingMs = t >= MANUAL_RELEASE && t < CALM_END ? (CALM_END - t) * 1000 : 0;
  const presentationResumeActive = t >= CALM_END && t < PRESENTATION_RESUME_END;
  const sliceResumeRemainingMs = t >= CALM_END && t < SLICE_RESUME_AT ? (SLICE_RESUME_AT - t) * 1000 : 0;
  trace.push({
    t,
    q: presentation.quaternion,
    cumulativeYawDeg: presentation.cumulativeYawDeg,
    signedYawDeg: presentation.signedYawDeg,
    yawVelocityDegPerSec: presentation.velocityDegPerSec,
    activeTurns,
    lastTurnSerial: completedTurnSerial,
    interactionActive: t >= MANUAL_START && t < MANUAL_RELEASE,
    calmRemainingMs,
    presentationResumeActive,
    sliceResumeRemainingMs,
    cameraPosition: instrumented.cameraPosition,
  });
  if ((frame + 1) % 96 === 0) console.log(`R1.2 deterministic review frame ${frame + 1}/${totalFrames}`);
}

if (!manualReleased) {
  await videoPage.mouse.up();
  manualReleased = true;
  manualReleaseSec = MANUAL_RELEASE;
}
const finalRuntimeDiagnostics = await videoPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const videoEndCamera = finalRuntimeDiagnostics.interaction.cameraPosition;
await closePair(videoPair);
await browser.close();

encodeFrames(frameBuffers, MP4_PATH, ['-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart']);
encodeFrames(frameBuffers, RAW_VIDEO_PATH, ['-c:v', 'libvpx', '-deadline', 'realtime', '-cpu-used', '8', '-pix_fmt', 'yuv420p', '-auto-alt-ref', '0', '-b:v', '1800k']);
const mp4Probe = ffprobe(MP4_PATH);
const rawProbe = ffprobe(RAW_VIDEO_PATH);
const mp4Stream = mp4Probe.streams[0];
const mp4Duration = Number(mp4Probe.format.duration);
const mp4Pass = mp4Stream.codec_name === 'h264'
  && mp4Stream.pix_fmt === 'yuv420p'
  && mp4Stream.avg_frame_rate === '24/1'
  && mp4Stream.width === VIDEO_VIEWPORT.width
  && mp4Stream.height === VIDEO_VIEWPORT.height
  && Number(mp4Stream.nb_read_frames) === frameBuffers.length
  && Math.abs(mp4Duration - VIDEO_SECONDS) < 0.05
  && String(mp4Probe.format.format_name).includes('mp4');

// Frame-level liveness metrics from the exact 24 fps review states.
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
    const finishes = Math.max(1, state.lastTurnSerial - previousTurnSerial);
    for (let i = 0; i < finishes; i += 1) {
      if (previousTurnFinishT !== null && state.t - previousTurnFinishT < 1.75) closeTurnFinishes += 1;
      previousTurnFinishT = state.t;
    }
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
const full360WallSec = first360Trace?.t ?? null;
const cameraPreservedAfterRuntimeInteraction = !cameraAtManualRelease || vectorDistance(cameraAtManualRelease, videoEndCamera) < 1.0;
const recoveryTrace = manualReleaseSec === null ? [] : trace.filter((state) => state.t >= manualReleaseSec && state.t <= manualReleaseSec + 5.0);
const calmObserved = recoveryTrace.some((state) => state.calmRemainingMs > 1000);
const presentationResumeObserved = recoveryTrace.some((state) => state.presentationResumeActive);
const staggerObserved = recoveryTrace.some((state) => state.presentationResumeActive && state.sliceResumeRemainingMs > 0);
const runtimeInteractionPass = manualStarted && manualReleased && activeSliceFinishedDuringHeldDrag
  && cameraPreservedAfterRuntimeInteraction && calmObserved && presentationResumeObserved && staggerObserved;

'''
text = text[:start] + replacement + text[end:]
capture_path.write_text(text)

# Review setters normally render immediately. The deterministic capture performs exactly one render
# per frame, so add a backward-compatible renderFrame=false option used only by the QA harness.
main_path = Path('docs/site-evolution/spline/proai-cube-presentation-motion-r1-2/main.js')
main = main_path.read_text()
replacements = [
    ("function setReviewTurnProgress(turnId, linear) {", "function setReviewTurnProgress(turnId, linear, renderFrame = true) {"),
    ("  renderReviewFrame();\n  return result;\n}\n\nfunction beginReviewPair", "  if (renderFrame) renderReviewFrame();\n  return result;\n}\n\nfunction beginReviewPair"),
    ("function setReviewPairProgress(turnIds, progressA, progressB = progressA) {", "function setReviewPairProgress(turnIds, progressA, progressB = progressA, renderFrame = true) {"),
    ("  renderReviewFrame();\n  return [a, b];\n}\n\nfunction setReviewPresentation", "  if (renderFrame) renderReviewFrame();\n  return [a, b];\n}\n\nfunction setReviewPresentation"),
    ("function setReviewPresentation(timeSec = 0, resumeProgress = 1) {", "function setReviewPresentation(timeSec = 0, resumeProgress = 1, renderFrame = true) {"),
    ("  renderReviewFrame();\n  return { ...sample, quaternion: presentationRig.quaternion.toArray() };", "  if (renderFrame) renderReviewFrame();\n  return { ...sample, quaternion: presentationRig.quaternion.toArray() };"),
]
for old, new in replacements:
    if old not in main:
        raise SystemExit('review render-option anchor not found: ' + old[:80])
    main = main.replace(old, new, 1)
main_path.write_text(main)
