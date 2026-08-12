import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REVIEW = path.join(ROOT, 'review');
const QA_PATH = path.join(ROOT, 'QA.json');
const REPORT_PATH = path.join(ROOT, 'REPORT.md');
const URL = process.env.PROAI_R1_URL || 'http://127.0.0.1:4173/?capture=1';
const FPS = 24;
const VIDEO_VIEWPORT = { width: 640, height: 760 };
const SCREENSHOT_VIEWPORT = { width: 900, height: 1040 };
const VIDEO_PATH = path.join(REVIEW, 'proai-cube-motion-r1-review-18s.webm');
const NATURAL_PATH = path.join(REVIEW, 'proai-cube-motion-r1-natural.png');
const PHRASE_PATH = path.join(REVIEW, 'proai-cube-motion-r1-multi-axis.png');
const GLB_PATH = path.join(ROOT, 'rubik_39_s_cube_animation.glb');

fs.mkdirSync(REVIEW, { recursive: true });

function sha256(filepath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filepath)).digest('hex');
}

function findPlaywrightFfmpeg() {
  const cacheRoot = path.join(os.homedir(), '.cache', 'ms-playwright');
  const dirs = fs.readdirSync(cacheRoot).filter((name) => name.startsWith('ffmpeg-')).sort().reverse();
  for (const dir of dirs) {
    for (const binary of ['ffmpeg-linux', 'ffmpeg']) {
      const candidate = path.join(cacheRoot, dir, binary);
      if (fs.existsSync(candidate)) return candidate;
    }
  }
  throw new Error(`Playwright ffmpeg binary not found in ${cacheRoot}`);
}

function probeDuration(ffmpegPath, filepath) {
  const probe = spawnSync(ffmpegPath, ['-hide_banner', '-i', filepath], { encoding: 'utf8' });
  const text = `${probe.stdout || ''}\n${probe.stderr || ''}`;
  const match = text.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/i);
  if (!match) return null;
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
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
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
}

async function openR1Page(viewport) {
  const page = await context.newPage();
  await page.setViewportSize(viewport);
  wirePage(page);
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForFunction(() => window.__PROAI_CUBE_R1?.ready === true, null, { timeout: 90000 });
  return page;
}

const qaPage = await openR1Page(SCREENSHOT_VIEWPORT);
const initialDiagnostics = await qaPage.evaluate(() => window.__PROAI_CUBE_R1.getDiagnostics());
const mechanicalQA = await qaPage.evaluate(() => window.__PROAI_CUBE_R1.runAutomatedQA());

const box = await qaPage.locator('#cube-canvas').boundingBox();
if (!box) throw new Error('Cube canvas box unavailable for OrbitControls QA');
await qaPage.evaluate(() => window.__PROAI_CUBE_R1.setReviewPresentation(3.2, 1));
const interactionBefore = await qaPage.evaluate(() => window.__PROAI_CUBE_R1.getInteractionState());
const startX = box.x + box.width * 0.52;
const startY = box.y + box.height * 0.49;
await qaPage.mouse.move(startX, startY);
await qaPage.mouse.down();
await qaPage.waitForTimeout(40);
const interactionDuringStart = await qaPage.evaluate(() => window.__PROAI_CUBE_R1.getInteractionState());
for (let i = 1; i <= 6; i += 1) {
  await qaPage.mouse.move(startX + 78 * (i / 6), startY - 26 * (i / 6));
  await qaPage.evaluate(() => window.__PROAI_CUBE_R1.renderReviewFrame());
}
const interactionDuringEnd = await qaPage.evaluate(() => window.__PROAI_CUBE_R1.getInteractionState());
await qaPage.mouse.up();
await qaPage.waitForTimeout(50);
const interactionAfterEnd = await qaPage.evaluate(() => window.__PROAI_CUBE_R1.getInteractionState());
for (let i = 0; i < 72; i += 1) {
  await qaPage.evaluate(() => window.__PROAI_CUBE_R1.renderReviewFrame());
}
const cameraBeforePresentationBlend = await qaPage.evaluate(() => window.__PROAI_CUBE_R1.getInteractionState().cameraPosition);

const resumeQuaternions = [];
for (let i = 0; i <= 12; i += 1) {
  const progress = i / 12;
  await qaPage.evaluate(({ progress }) => window.__PROAI_CUBE_R1.setReviewPresentation(6.1, progress), { progress });
  resumeQuaternions.push(await qaPage.evaluate(() => window.__PROAI_CUBE_R1.getInteractionState().presentationQuaternion));
}
const interactionAfterResume = await qaPage.evaluate(() => window.__PROAI_CUBE_R1.getInteractionState());
let maxResumeQuaternionStepRad = 0;
for (let i = 1; i < resumeQuaternions.length; i += 1) {
  maxResumeQuaternionStepRad = Math.max(maxResumeQuaternionStepRad, quatAngle(resumeQuaternions[i - 1], resumeQuaternions[i]));
}
const cameraMoved = vectorDistance(interactionBefore.cameraPosition, interactionAfterEnd.cameraPosition) > 1;
const presentationStayedFrozen = quatAngle(interactionBefore.presentationQuaternion, interactionDuringEnd.presentationQuaternion) < 1e-7;
const cameraStayedAfterResume = vectorDistance(cameraBeforePresentationBlend, interactionAfterResume.cameraPosition) < 0.5;
const interactionPass = interactionDuringStart.interactionActive
  && interactionDuringStart.autonomyBlocked
  && interactionDuringEnd.interactionActive
  && !interactionAfterEnd.interactionActive
  && interactionAfterEnd.autonomyBlocked
  && interactionAfterEnd.resumeDelayRemainingMs > 1000
  && cameraMoved
  && presentationStayedFrozen
  && cameraStayedAfterResume
  && maxResumeQuaternionStepRad < 0.03;
await qaPage.close();

const screenshotPage = await openR1Page(SCREENSHOT_VIEWPORT);
await screenshotPage.evaluate(() => window.__PROAI_CUBE_R1.setReviewPresentation(1.6, 1));
await screenshotPage.screenshot({ path: NATURAL_PATH, fullPage: true });
await screenshotPage.evaluate(() => {
  const api = window.__PROAI_CUBE_R1;
  api.beginReviewTurn('X', 1, 1);
  api.setReviewTurnProgress(1);
  api.beginReviewTurn('Y', 0, -1);
  api.setReviewTurnProgress(1);
  api.beginReviewTurn('Z', 1, 1);
  api.setReviewPresentation(5.7, 1);
  api.setReviewTurnProgress(0.56);
});
await screenshotPage.screenshot({ path: PHRASE_PATH, fullPage: true });
await screenshotPage.close();

const videoPage = await openR1Page(VIDEO_VIEWPORT);
const frameBuffers = [];
const segments = [];
let videoTimeSec = 0;
let frameIndex = 0;

async function captureCurrentFrame() {
  const dataUrl = await videoPage.evaluate(() => {
    window.__PROAI_CUBE_R1.renderReviewFrame();
    return document.getElementById('cube-canvas').toDataURL('image/jpeg', 0.92);
  });
  frameBuffers.push(jpegBufferFromDataUrl(dataUrl));
  frameIndex += 1;
  if (frameIndex % 72 === 0) console.log(`Motion R1 deterministic review frame ${frameIndex}`);
}

async function addHold(label, seconds, { frozen = false, resume = false } = {}) {
  const count = Math.round(seconds * FPS);
  const start = videoTimeSec;
  for (let i = 0; i < count; i += 1) {
    if (!frozen) {
      const resumeProgress = resume ? (i + 1) / count : 1;
      await videoPage.evaluate(({ timeSec, resumeProgress }) => window.__PROAI_CUBE_R1.setReviewPresentation(timeSec, resumeProgress), {
        timeSec: videoTimeSec,
        resumeProgress,
      });
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
  if (!began) throw new Error(`Could not begin review turn ${axis}${layer}:${direction}`);
  for (let i = 0; i < count; i += 1) {
    const progress = (i + 1) / count;
    await videoPage.evaluate(({ timeSec, progress }) => {
      const api = window.__PROAI_CUBE_R1;
      api.setReviewPresentation(timeSec, 1);
      api.setReviewTurnProgress(progress);
    }, { timeSec: videoTimeSec, progress });
    await captureCurrentFrame();
    videoTimeSec += 1 / FPS;
  }
  segments.push({ label, axis, layer, direction, startSec: start, endSec: videoTimeSec, frames: count });
}

async function addManualOrbit(label, seconds) {
  const count = Math.round(seconds * FPS);
  const start = videoTimeSec;
  const canvasBox = await videoPage.locator('#cube-canvas').boundingBox();
  if (!canvasBox) throw new Error('Video canvas box unavailable for manual orbit segment');
  const x0 = canvasBox.x + canvasBox.width * 0.52;
  const y0 = canvasBox.y + canvasBox.height * 0.50;
  await videoPage.mouse.move(x0, y0);
  await videoPage.mouse.down();
  for (let i = 0; i < count; i += 1) {
    const p = (i + 1) / count;
    const eased = p * p * (3 - 2 * p);
    await videoPage.mouse.move(x0 + 84 * eased, y0 - 30 * eased);
    await captureCurrentFrame();
    videoTimeSec += 1 / FPS;
  }
  await videoPage.mouse.up();
  segments.push({ label, startSec: start, endSec: videoTimeSec, frames: count, manualOrbit: true });
}

await addHold('calm-3q-body-drift', 1.8);
await addTurn('x-axis-turn', 'X', 1, 1, 1.35);
await addHold('x-settle', 1.15);
await addTurn('two-turn-phrase-y', 'Y', 0, -1, 1.30);
await addHold('phrase-breath', 0.55);
await addTurn('two-turn-phrase-z', 'Z', 1, 1, 1.25);
await addHold('long-settle', 2.15);
await addHold('breathing-drift', 1.20);
await addManualOrbit('manual-orbitcontrols-drag', 1.00);
await addHold('post-interaction-calm-delay', 1.45, { frozen: true });
await addHold('soft-autonomous-return', 2.10, { resume: true });
await addTurn('closing-x-opposite-layer', 'X', -1, -1, 1.40);
await addHold('closing-settle', 1.30);

await videoPage.close();
await browser.close();

const ffmpegPath = findPlaywrightFfmpeg();
fs.rmSync(VIDEO_PATH, { force: true });
const encode = spawnSync(
  ffmpegPath,
  [
    '-y',
    '-f', 'image2pipe',
    '-framerate', String(FPS),
    '-vcodec', 'mjpeg',
    '-i', 'pipe:0',
    '-an',
    '-c:v', 'libvpx',
    '-deadline', 'realtime',
    '-cpu-used', '8',
    '-pix_fmt', 'yuv420p',
    '-auto-alt-ref', '0',
    '-b:v', '1800k',
    '-r', String(FPS),
    VIDEO_PATH,
  ],
  {
    input: Buffer.concat(frameBuffers),
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  },
);
if (encode.status !== 0 || !fs.existsSync(VIDEO_PATH)) {
  throw new Error(`Motion R1 VP8 encode failed: ${encode.stderr || encode.stdout || `exit ${encode.status}`}`);
}

const videoDurationSec = probeDuration(ffmpegPath, VIDEO_PATH);
const videoBytes = fs.statSync(VIDEO_PATH).size;
const expectedDurationSec = frameBuffers.length / FPS;
const forbiddenRequests = requests.filter((url) => /splinetool|prod\.spline\.design|\.splinecode/i.test(url));
const axisPass = Object.fromEntries(Object.entries(mechanicalQA.axisSupport).map(([axis, result]) => [axis, result.forwardEndpointErrorRad === 0 && result.inverseEndpointErrorRad === 0 && result.restoredAfterPair]));
const layerPass = Object.values(mechanicalQA.layerSupport).every((layers) => Object.values(layers).every((entry) => entry.pass));
const runtimePass = pageErrors.length === 0 && consoleErrors.length === 0 && forbiddenRequests.length === 0;
const videoPass = videoDurationSec != null && videoDurationSec >= 15 && videoDurationSec <= 20.5 && frameBuffers.length >= 360 && videoBytes > 150000;

const qa = {
  generatedAt: new Date().toISOString(),
  source: {
    baselineBranch: 'agent/proai-cube-threejs-mechanical-r0',
    baselineCommit: '32cf6e497b3c4402169ab8b677d3372cca439da3',
    motionBranch: 'agent/proai-cube-motion-r1',
    prototypePath: 'docs/site-evolution/spline/proai-cube-motion-r1/',
    glbBytes: fs.statSync(GLB_PATH).size,
    glbSha256: sha256(GLB_PATH),
  },
  initialDiagnostics,
  mechanicalQA,
  interactionQA: {
    interactionBefore,
    interactionDuringStart,
    interactionDuringEnd,
    interactionAfterEnd,
    cameraBeforePresentationBlend,
    interactionAfterResume,
    cameraMoved,
    presentationStayedFrozen,
    cameraStayedAfterResume,
    maxResumeQuaternionStepRad,
    pass: interactionPass,
  },
  video: {
    path: 'review/proai-cube-motion-r1-review-18s.webm',
    fps: FPS,
    frameCount: frameBuffers.length,
    expectedDurationSec,
    durationSec: videoDurationSec,
    byteLength: videoBytes,
    segments,
    coverage: {
      calmState: true,
      xAxisTurn: true,
      yAxisTurn: true,
      zAxisTurn: true,
      twoTurnPhrase: true,
      longSettle: true,
      slowBodyDrift: true,
      manualOrbitControls: true,
      softAutonomousReturn: true,
    },
  },
  runtime: {
    totalRequests: requests.length,
    forbiddenRequests,
    splineDependency: forbiddenRequests.length === 0 ? 'NONE' : 'FOUND',
    pageErrors,
    consoleErrors,
  },
  acceptance: {
    X: axisPass.X ? 'PASS' : 'FAIL',
    Y: axisPass.Y ? 'PASS' : 'FAIL',
    Z: axisPass.Z ? 'PASS' : 'FAIL',
    layerSupport: layerPass ? 'PASS' : 'FAIL',
    repeatability30: mechanicalQA.repeatability30.pass ? 'PASS' : 'FAIL',
    inverseRestoration: mechanicalQA.inverseRestoration.pass ? 'PASS' : 'FAIL',
    orbitAutonomousInteraction: interactionPass ? 'PASS' : 'FAIL',
    videoCoverage: videoPass ? 'PASS' : 'FAIL',
    runtime: runtimePass ? 'PASS' : 'FAIL',
    splineDependency: forbiddenRequests.length === 0 ? 'NONE' : 'FOUND',
  },
};

const overallPass = axisPass.X && axisPass.Y && axisPass.Z
  && layerPass
  && mechanicalQA.repeatability30.pass
  && mechanicalQA.inverseRestoration.pass
  && interactionPass
  && videoPass
  && runtimePass;

fs.writeFileSync(QA_PATH, JSON.stringify(qa, null, 2) + '\n');

const m = initialDiagnostics.motionConfig;
const report = `# ProAI Rubik Cube — Motion R1\n\n## Scope\n\nMotion-only pass built from the stable Three.js Mechanical R0 baseline. Geometry, neutral R0 materials/light, named hierarchy, clean GLB and OrbitControls are preserved. No semantic text, final material system, Hero integration, Spline runtime, merge or deployment.\n\n## Generalized slice engine\n\n- Axes: **X / Y / Z**.\n- Logical layers: **-1 / 0 / +1** on every axis.\n- Spatial deduplication: **${initialDiagnostics.mechanics.physicalCubies} physical cubies from ${initialDiagnostics.mechanics.exportedCubieParents} exported cubie-parent objects**.\n- Selection is based on logical spatial coordinates, never mesh names.\n- Slice turns use a temporary pivot; leaf face meshes are never flattened/reparented.\n- Each completed turn commits a discrete logical coordinate/orientation state and exact canonical transform. There is no visual transform reset between choreography moves.\n\n## Motion character\n\n- Turn durations used by autonomous choreography: **1210–1490 ms**.\n- Holds: **520–2600 ms**, including short phrase breaths and longer settles.\n- Easing: **cubic-bezier(${m.easing.join(', ')})**.\n- Body drift: yaw **±${m.bodyDrift.yawDeg}° / ${m.bodyDrift.yawPeriodMs / 1000}s**, pitch **±${m.bodyDrift.pitchDeg}° / ${m.bodyDrift.pitchPeriodMs / 1000}s**, roll **±${m.bodyDrift.rollDeg}° / ${m.bodyDrift.rollPeriodMs / 1000}s**.\n- OrbitControls: damping **${m.orbitDampingFactor}**, rotate speed **${m.orbitRotateSpeed}**, zoom speed **${m.orbitZoomSpeed}**, pan disabled.\n- Manual interaction pauses autonomous progression; resume delay **${m.manualResumeDelayMs} ms**, soft presentation blend **${m.manualResumeBlendMs} ms**. Camera is never snapped back.\n\n## Choreography\n\nThe autonomous program uses a curated 8-turn X/Y/Z phrase followed later by its exact inverse as an 8-turn resolution. This returns the cube naturally through real Rubik turns rather than a hidden transform reset. Short two-turn phrases alternate with longer breathing holds.\n\n## Automated QA\n\n- X axis: **${qa.acceptance.X}**.\n- Y axis: **${qa.acceptance.Y}**.\n- Z axis: **${qa.acceptance.Z}**.\n- Layers -1 / 0 / +1: **${qa.acceptance.layerSupport}**.\n- 30 mixed turns: **${qa.acceptance.repeatability30}**; max canonical position error ${mechanicalQA.repeatability30.maxCanonicalPosition}; quaternion error ${mechanicalQA.repeatability30.maxCanonicalQuaternionRad}; scale error ${mechanicalQA.repeatability30.maxCanonicalScale}.\n- Exact inverse restoration: **${qa.acceptance.inverseRestoration}**.\n- Orbit/autonomous interaction: **${qa.acceptance.orbitAutonomousInteraction}**; max deterministic resume quaternion step ${maxResumeQuaternionStepRad}.\n- Runtime/browser: **${qa.acceptance.runtime}**; Spline dependency **${qa.acceptance.splineDependency}**.\n- Review video: **${videoDurationSec?.toFixed(2)} s @ ${FPS} fps**, ${frameBuffers.length} frames; coverage **${qa.acceptance.videoCoverage}**.\n\n## Review evidence\n\n- \`review/proai-cube-motion-r1-natural.png\`\n- \`review/proai-cube-motion-r1-multi-axis.png\`\n- \`review/proai-cube-motion-r1-review-18s.webm\`\n- \`QA.json\`\n\n## Gate\n\nAutomated mechanical/runtime gates: **${overallPass ? 'PASS' : 'FAIL'}**. Final choreography visual-quality judgment remains an owner-review gate; Geometry Phase must not start before owner review.\n`;
fs.writeFileSync(REPORT_PATH, report);

console.log(JSON.stringify({
  overall: overallPass ? 'PASS' : 'FAIL',
  axis: axisPass,
  layerSupport: layerPass,
  repeatability30: mechanicalQA.repeatability30.pass,
  inverseRestoration: mechanicalQA.inverseRestoration.pass,
  orbitAutonomousInteraction: interactionPass,
  splineDependency: qa.acceptance.splineDependency,
  video: { durationSec: videoDurationSec, fps: FPS, frames: frameBuffers.length, bytes: videoBytes },
}, null, 2));

if (!overallPass) process.exit(1);
