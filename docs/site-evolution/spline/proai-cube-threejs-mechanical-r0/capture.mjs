import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REVIEW = path.join(ROOT, 'review');
const URL = process.env.PROAI_R0_URL || 'http://127.0.0.1:4173/?capture=1';
const VIDEO_URL = `${URL}${URL.includes('?') ? '&' : '?'}video=1`;
const VIEWPORT = { width: 900, height: 1040 };
const TARGET_VIDEO_DURATION_SEC = 12;
fs.mkdirSync(REVIEW, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=swiftshader'],
});

function attachDiagnostics(page, bucket) {
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') bucket.console.push(`${msg.type()}: ${msg.text()}`);
  });
  page.on('pageerror', (error) => bucket.pageErrors.push(String(error)));
  page.on('request', (request) => bucket.requests.push(request.url()));
}

async function waitReady(page, url = URL) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForFunction(() => window.__PROAI_CUBE_R0?.ready === true, null, { timeout: 90000 });
  await page.waitForTimeout(250);
}

async function screenshot(page, filename) {
  const dataUrl = await page.evaluate(() => window.__PROAI_CUBE_R0.captureFrame());
  const comma = dataUrl.indexOf(',');
  if (!dataUrl.startsWith('data:image/png') || comma < 0) throw new Error('Canvas PNG capture failed');
  fs.writeFileSync(path.join(REVIEW, filename), Buffer.from(dataUrl.slice(comma + 1), 'base64'));
}

function findPlaywrightFfmpeg() {
  const cacheRoot = path.join(os.homedir(), '.cache', 'ms-playwright');
  if (!fs.existsSync(cacheRoot)) throw new Error(`Playwright cache not found: ${cacheRoot}`);
  const dirs = fs.readdirSync(cacheRoot).filter((name) => name.startsWith('ffmpeg-')).sort().reverse();
  for (const dir of dirs) {
    for (const binary of ['ffmpeg-linux', 'ffmpeg']) {
      const candidate = path.join(cacheRoot, dir, binary);
      if (fs.existsSync(candidate)) return candidate;
    }
  }
  throw new Error(`Playwright ffmpeg binary not found in ${cacheRoot}`);
}

function probeWebmDuration(ffmpegPath, filepath) {
  const probe = spawnSync(ffmpegPath, ['-hide_banner', '-i', filepath], { encoding: 'utf8' });
  const text = `${probe.stdout || ''}\n${probe.stderr || ''}`;
  const match = text.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/i);
  if (!match) return null;
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
}

function retimeReviewVideo(rawVideo, targetVideo) {
  const ffmpegPath = findPlaywrightFfmpeg();
  const sourceMediaDurationSec = probeWebmDuration(ffmpegPath, rawVideo);
  if (!sourceMediaDurationSec || sourceMediaDurationSec <= 0) {
    throw new Error('Unable to determine source WebM media duration');
  }
  const timestampScale = TARGET_VIDEO_DURATION_SEC / sourceMediaDurationSec;
  const result = spawnSync(
    ffmpegPath,
    [
      '-y',
      '-itsscale', String(timestampScale),
      '-i', rawVideo,
      '-map', '0:v:0',
      '-an',
      '-c:v', 'libvpx',
      '-deadline', 'realtime',
      '-cpu-used', '8',
      '-pix_fmt', 'yuv420p',
      '-auto-alt-ref', '0',
      '-b:v', '1200k',
      targetVideo,
    ],
    { encoding: 'utf8' },
  );
  if (result.status !== 0 || !fs.existsSync(targetVideo)) {
    throw new Error(`Playwright ffmpeg VP8 retime failed: ${result.stderr || result.stdout || `exit ${result.status}`}`);
  }
  const outputDurationSec = probeWebmDuration(ffmpegPath, targetVideo);
  if (outputDurationSec == null) throw new Error('Unable to verify retimed WebM duration');
  return { sourceMediaDurationSec, timestampScale, outputDurationSec };
}

const telemetry = { console: [], pageErrors: [], requests: [] };
const page = await browser.newPage({ viewport: VIEWPORT });
attachDiagnostics(page, telemetry);
await waitReady(page);
const initialDiagnostics = await page.evaluate(() => window.__PROAI_CUBE_R0.getDiagnostics());
await screenshot(page, 'proai-cube-r0-natural-3q.png');
await page.evaluate(() => { void window.__PROAI_CUBE_R0.playSlice({ direction: 1 }); });
await page.waitForFunction(() => window.__PROAI_CUBE_R0?.motionState === 'turned', null, { timeout: 90000 });
await page.waitForTimeout(150);
await screenshot(page, 'proai-cube-r0-slice-turn.png');
const turnedDiagnostics = await page.evaluate(() => window.__PROAI_CUBE_R0.getDiagnostics());
await page.evaluate(() => window.__PROAI_CUBE_R0.resetSlice({ direction: 1 }));
await page.waitForFunction(() => window.__PROAI_CUBE_R0?.motionState === 'rest', null, { timeout: 90000 });
const repeatability = await page.evaluate(() => window.__PROAI_CUBE_R0.runRepeatabilityTest(6, 0.08));
const finalDiagnostics = await page.evaluate(() => window.__PROAI_CUBE_R0.getDiagnostics());
await page.close();

const videoTelemetry = { console: [], pageErrors: [], requests: [] };
const videoPage = await browser.newPage({ viewport: VIEWPORT });
attachDiagnostics(videoPage, videoTelemetry);
await waitReady(videoPage, VIDEO_URL);
const mediaRecorderSupport = await videoPage.evaluate(() => {
  const candidates = ['video/webm;codecs=vp8', 'video/webm'];
  const mimeType = candidates.find((type) => MediaRecorder.isTypeSupported(type)) || '';
  const canvas = document.getElementById('cube-canvas');
  if (!canvas?.captureStream || typeof MediaRecorder === 'undefined') return { supported: false, mimeType: null };
  const stream = canvas.captureStream(30);
  const chunks = [];
  const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
  recorder.addEventListener('dataavailable', (event) => { if (event.data?.size) chunks.push(event.data); });
  window.__R0_CAPTURE_RECORDER = { recorder, chunks, startedAt: performance.now() };
  recorder.start(250);
  return { supported: true, mimeType: recorder.mimeType };
});
if (!mediaRecorderSupport.supported) throw new Error('Canvas MediaRecorder VP8 capture is unavailable');

await videoPage.waitForTimeout(1450);
await videoPage.evaluate(() => { void window.__PROAI_CUBE_R0.playSlice({ direction: 1 }); });
await videoPage.waitForFunction(() => window.__PROAI_CUBE_R0?.motionState === 'turned', null, { timeout: 90000 });
await videoPage.waitForTimeout(1450);
const start = { x: VIEWPORT.width * 0.54, y: VIEWPORT.height * 0.52 };
const end = { x: start.x - 118, y: start.y + 44 };
await videoPage.mouse.move(start.x, start.y);
await videoPage.mouse.down();
for (let i = 1; i <= 24; i += 1) {
  const t = i / 24;
  await videoPage.mouse.move(start.x + (end.x - start.x) * t, start.y + (end.y - start.y) * t);
  await videoPage.waitForTimeout(20);
}
await videoPage.mouse.up();
await videoPage.waitForTimeout(1450);
await videoPage.evaluate(() => { void window.__PROAI_CUBE_R0.resetSlice({ direction: 1 }); });
await videoPage.waitForFunction(() => window.__PROAI_CUBE_R0?.motionState === 'rest', null, { timeout: 90000 });
await videoPage.waitForTimeout(2100);
const videoPayload = await videoPage.evaluate(() => new Promise((resolve, reject) => {
  const state = window.__R0_CAPTURE_RECORDER;
  if (!state?.recorder) return reject(new Error('MediaRecorder state missing'));
  const finish = async () => {
    try {
      const blob = new Blob(state.chunks, { type: state.recorder.mimeType || 'video/webm' });
      const bytes = new Uint8Array(await blob.arrayBuffer());
      let binary = '';
      const chunkSize = 0x8000;
      for (let offset = 0; offset < bytes.length; offset += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(offset, Math.min(offset + chunkSize, bytes.length)));
      }
      resolve({
        base64: btoa(binary),
        mimeType: blob.type,
        byteLength: bytes.length,
        wallClockDurationMs: performance.now() - state.startedAt,
      });
    } catch (error) { reject(error); }
  };
  state.recorder.addEventListener('stop', finish, { once: true });
  state.recorder.stop();
}));

const rawVideo = path.join(REVIEW, 'proai-cube-r0-review-source-webgl.webm');
const targetVideo = path.join(REVIEW, 'proai-cube-r0-review-12s.webm');
for (const file of [rawVideo, targetVideo]) if (fs.existsSync(file)) fs.rmSync(file);
fs.writeFileSync(rawVideo, Buffer.from(videoPayload.base64, 'base64'));
const sourceWallClockDurationSec = videoPayload.wallClockDurationMs / 1000;
const retime = retimeReviewVideo(rawVideo, targetVideo);
const videoDurationSec = retime.outputDurationSec;
const targetVideoBytes = fs.statSync(targetVideo).size;
fs.rmSync(rawVideo);
await videoPage.close();
await browser.close();

const allRequests = [...telemetry.requests, ...videoTelemetry.requests];
const forbiddenRequests = [...new Set(allRequests.filter((url) => /prod\.spline\.design|\.splinecode(?:$|\?)/i.test(url)))];
const browserErrors = [...telemetry.pageErrors, ...videoTelemetry.pageErrors];
const consoleErrors = [...telemetry.console, ...videoTelemetry.console].filter((line) => line.startsWith('error:'));
const forward = turnedDiagnostics.forwardTelemetry;
const hierarchyPass = initialDiagnostics.hierarchy?.pass === true;
const mechanicsPass = initialDiagnostics.mechanics?.axis === 'X' && initialDiagnostics.mechanics?.rightLayerUniqueSpatialCubies === 9 && Math.abs(turnedDiagnostics.endpointErrorRad ?? 999) < 1e-8 && repeatability.pass === true;
const motionTelemetryPass = Boolean(forward) && forward.sampleCount >= 2 && forward.monotonic === true && forward.overshoot === false && Math.abs(turnedDiagnostics.endpointErrorRad ?? 999) < 1e-8 && (forward.firstStepRad ?? 1) < 0.02;
const videoDurationPass = videoDurationSec >= 9.5 && videoDurationSec <= 15.5 && targetVideoBytes > 1024;
const splineDependencyNone = forbiddenRequests.length === 0;
const runtimePass = browserErrors.length === 0 && consoleErrors.length === 0;

const qa = {
  generatedAt: new Date().toISOString(), url: URL, viewport: VIEWPORT,
  initialDiagnostics, turnedDiagnostics, finalDiagnostics, repeatability,
  video: {
    sourceWallClockDurationSec,
    sourceMediaDurationSec: retime.sourceMediaDurationSec,
    reviewDurationSec: videoDurationSec,
    timestampScale: retime.timestampScale,
    byteLength: targetVideoBytes,
    mimeType: videoPayload.mimeType,
    normalization: 'VP8 timestamps normalized from actual source WebM media duration to a 12-second review clip; rendered frame order is unchanged.',
  },
  network: { totalRequests: allRequests.length, forbiddenRequests, splineDependency: splineDependencyNone ? 'NONE' : 'FOUND' },
  browser: { pageErrors: browserErrors, consoleErrors },
  acceptance: {
    hierarchy: hierarchyPass ? 'PASS' : 'FAIL',
    sliceMechanics90: mechanicsPass ? 'PASS' : 'FAIL',
    motionTelemetry: motionTelemetryPass ? 'PASS' : 'FAIL',
    videoDuration: videoDurationPass ? 'PASS' : 'FAIL',
    runtime: runtimePass ? 'PASS' : 'FAIL',
    splineDependency: splineDependencyNone ? 'NONE' : 'FOUND',
  },
};
fs.writeFileSync(path.join(REVIEW, 'qa-report.json'), JSON.stringify(qa, null, 2) + '\n');

const report = `# ProAI Cube — Three.js Mechanical Parity R0 — Technical Report\n\n## Scope\n\nIsolated Three.js proof using the exact clean GLB geometry. No Hero integration, production route changes, Spline runtime, .splinecode runtime dependency, or prod.spline.design request.\n\n## Geometry / hierarchy\n\n- Named hierarchy: **${qa.acceptance.hierarchy}**.\n- Axis from actual GLB/world-space clustering: **${initialDiagnostics.mechanics.axis}**.\n- X cluster means: \`${JSON.stringify(initialDiagnostics.mechanics.xClusterMeans)}\`.\n- X cluster object counts: \`${JSON.stringify(initialDiagnostics.mechanics.xClusterObjectCounts)}\`.\n- Right layer objects temporarily pivoted: **${initialDiagnostics.mechanics.rightLayerObjectCount}**; unique spatial cubies: **${initialDiagnostics.mechanics.rightLayerUniqueSpatialCubies}**.\n- Source hierarchy is restored exactly after reset; leaf meshes are never flattened.\n\n## Motion\n\n- Forward turn **${initialDiagnostics.motionConfig.turnDurationMs} ms**; reset **${initialDiagnostics.motionConfig.resetDurationMs} ms**.\n- Easing cubic-bezier **${initialDiagnostics.motionConfig.easing.join(', ')}**; settle/hold **${initialDiagnostics.motionConfig.holdAfterTurnMs} ms**.\n- Orbit damping **${initialDiagnostics.motionConfig.orbitDampingFactor}**; rotate speed **${initialDiagnostics.motionConfig.orbitRotateSpeed}**.\n- Exact 90° endpoint error: **${turnedDiagnostics.endpointErrorRad} rad**.\n- Forward telemetry: ${JSON.stringify(forward)}.\n- Motion gate is frame-rate-independent: monotonic/no-overshoot easing, exact terminal quaternion, and soft first-step acceleration.\n- Repeatability: ${repeatability.cycles} cycles; max position error ${repeatability.maxPosition}; max quaternion error ${repeatability.maxQuaternionRad}; max scale error ${repeatability.maxScale}; **${repeatability.pass ? 'PASS' : 'FAIL'}**.\n\n## Reference calibration\n\nResend was used for motion character only. R0 does not copy the proprietary implementation. Motion is intentionally slow and weighted: long acceleration/deceleration, zero overshoot, visible hold, restrained orbit damping.\n\n## Browser / dependency QA\n\n- Runtime: **${qa.acceptance.runtime}**.\n- Spline runtime/network dependency: **${qa.acceptance.splineDependency}**.\n- Forbidden network requests: ${forbiddenRequests.length}. Browser errors: ${browserErrors.length}; console errors: ${consoleErrors.length}.\n- Review video: ${videoDurationSec.toFixed(2)} s, ${targetVideoBytes} bytes, ${videoPayload.mimeType}. Source media ${retime.sourceMediaDurationSec.toFixed(2)} s; SwiftShader wall clock ${sourceWallClockDurationSec.toFixed(2)} s; timestamp factor ${retime.timestampScale.toFixed(4)}.\n\n## Review evidence\n\n- \`review/proai-cube-r0-natural-3q.png\`\n- \`review/proai-cube-r0-slice-turn.png\`\n- \`review/proai-cube-r0-review-12s.webm\`\n- \`review/qa-report.json\`\n\n## Gate\n\nAutomated hierarchy/mechanics/runtime checks are recorded above. Visual premium-motion acceptance remains an owner-review gate; R0 does not advance to Hero or final art direction.\n`;
fs.writeFileSync(path.join(ROOT, 'TECHNICAL_REPORT.md'), report);

if (!hierarchyPass || !mechanicsPass || !motionTelemetryPass || !videoDurationPass || !splineDependencyNone || !runtimePass) {
  console.error(JSON.stringify(qa, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(qa.acceptance, null, 2));
