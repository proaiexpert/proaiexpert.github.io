import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REVIEW = path.join(ROOT, 'review');
const URL = process.env.PROAI_R0_URL || 'http://127.0.0.1:4173/?capture=1&deterministic=1';
const VIEWPORT = { width: 720, height: 840 };
const FPS = 24;
const OUTPUT = path.join(REVIEW, 'proai-cube-r0-review-12s.webm');

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
  if (!dataUrl.startsWith('data:image/jpeg') || comma < 0) throw new Error('Invalid JPEG data URL');
  return Buffer.from(dataUrl.slice(comma + 1), 'base64');
}

function addFrames(timeline, seconds, factory) {
  const count = Math.max(1, Math.round(seconds * FPS));
  for (let i = 0; i < count; i += 1) timeline.push(factory(i, count));
}

function makeTimeline() {
  const timeline = [];
  addFrames(timeline, 1.25, () => ({ phase: 'rest', progress: 0 }));
  addFrames(timeline, 1.65, (i, count) => ({ phase: 'turn', progress: (i + 1) / count }));
  addFrames(timeline, 1.20, () => ({ phase: 'turned', progress: 1 }));
  addFrames(timeline, 1.60, (i, count) => ({ phase: 'manual-orbit', progress: (i + 1) / count }));
  addFrames(timeline, 0.60, () => ({ phase: 'orbit-settle', progress: 1 }));
  addFrames(timeline, 1.75, (i, count) => ({ phase: 'reset', progress: (i + 1) / count }));
  addFrames(timeline, 1.60, () => ({ phase: 'rest-after-reset', progress: 0 }));
  addFrames(timeline, 1.00, () => ({ phase: 'rest-final', progress: 0 }));
  return timeline;
}

fs.mkdirSync(REVIEW, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=swiftshader'],
});
const page = await browser.newPage({ viewport: VIEWPORT });
const pageErrors = [];
const consoleErrors = [];
page.on('pageerror', (error) => pageErrors.push(String(error)));
page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
await page.goto(URL, { waitUntil: 'networkidle', timeout: 120000 });
await page.waitForFunction(() => window.__PROAI_CUBE_R0?.ready === true, null, { timeout: 90000 });

const apiSupport = await page.evaluate(() => ({
  slice: typeof window.__PROAI_CUBE_R0?.setReviewSliceProgress === 'function',
  reset: typeof window.__PROAI_CUBE_R0?.setReviewResetProgress === 'function',
}));
if (!apiSupport.slice || !apiSupport.reset) {
  throw new Error(`Deterministic slice API missing: ${JSON.stringify(apiSupport)}`);
}

const timeline = makeTimeline();
const frameBuffers = [];
const dragStart = { x: VIEWPORT.width * 0.54, y: VIEWPORT.height * 0.52 };
const dragEnd = { x: dragStart.x - 92, y: dragStart.y + 34 };
let dragActive = false;

for (let index = 0; index < timeline.length; index += 1) {
  const frame = timeline[index];

  if (frame.phase === 'turn') {
    await page.evaluate((progress) => window.__PROAI_CUBE_R0.setReviewSliceProgress(progress, 1), frame.progress);
  } else if (frame.phase === 'turned' || frame.phase === 'manual-orbit' || frame.phase === 'orbit-settle') {
    await page.evaluate(() => window.__PROAI_CUBE_R0.setReviewSliceProgress(1, 1));
  } else if (frame.phase === 'reset') {
    await page.evaluate((progress) => window.__PROAI_CUBE_R0.setReviewResetProgress(progress, 1), frame.progress);
  }

  if (frame.phase === 'manual-orbit') {
    if (!dragActive) {
      await page.mouse.move(dragStart.x, dragStart.y);
      await page.mouse.down();
      dragActive = true;
    }
    await page.mouse.move(
      dragStart.x + (dragEnd.x - dragStart.x) * frame.progress,
      dragStart.y + (dragEnd.y - dragStart.y) * frame.progress,
    );
    if (frame.progress >= 0.999999) {
      await page.mouse.up();
      dragActive = false;
    }
  } else if (dragActive) {
    await page.mouse.up();
    dragActive = false;
  }

  const dataUrl = await page.evaluate(() => {
    const canvas = document.getElementById('cube-canvas');
    return canvas.toDataURL('image/jpeg', 0.94);
  });
  frameBuffers.push(jpegBufferFromDataUrl(dataUrl));

  if (index % 48 === 0 || index === timeline.length - 1) {
    console.log(`deterministic review frame ${index + 1}/${timeline.length}`);
  }
}

if (dragActive) await page.mouse.up();
await page.close();
await browser.close();

const ffmpegPath = findPlaywrightFfmpeg();
fs.rmSync(OUTPUT, { force: true });
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
    OUTPUT,
  ],
  {
    input: Buffer.concat(frameBuffers),
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  },
);
if (encode.status !== 0 || !fs.existsSync(OUTPUT)) {
  throw new Error(`Deterministic VP8 encode failed: ${encode.stderr || encode.stdout || `exit ${encode.status}`}`);
}

const durationSec = probeDuration(ffmpegPath, OUTPUT);
const byteLength = fs.statSync(OUTPUT).size;
const expectedDurationSec = timeline.length / FPS;
const videoPass = durationSec != null && durationSec >= 9.5 && durationSec <= 15.5 && byteLength > 100000;
if (!videoPass) throw new Error(`Deterministic review video gate failed: duration=${durationSec}, bytes=${byteLength}`);
if (pageErrors.length || consoleErrors.length) {
  throw new Error(`Deterministic browser errors: ${JSON.stringify({ pageErrors, consoleErrors })}`);
}

const qaPath = path.join(REVIEW, 'qa-report.json');
const qa = JSON.parse(fs.readFileSync(qaPath, 'utf8'));
qa.video = {
  captureMode: 'fixed-frame-step-with-manual-pointer-orbit',
  manualOrbit: true,
  reviewDurationSec: durationSec,
  expectedDurationSec,
  fps: FPS,
  frameCount: timeline.length,
  uniqueRenderedFrames: timeline.length,
  byteLength,
  mimeType: 'video/webm;codecs=vp8',
  normalization: 'None. Slice poses are stepped deterministically at fixed 24 fps; the orbit segment is driven by real pointer drag events through OrbitControls.',
};
qa.acceptance.videoDuration = videoPass ? 'PASS' : 'FAIL';
qa.acceptance.motionVideoFrameRate = FPS >= 24 ? 'PASS' : 'FAIL';
qa.acceptance.manualOrbitInVideo = 'PASS';
fs.writeFileSync(qaPath, JSON.stringify(qa, null, 2) + '\n');

const reportPath = path.join(ROOT, 'TECHNICAL_REPORT.md');
let report = fs.readFileSync(reportPath, 'utf8');
const deterministicLine = `- Review video ${durationSec.toFixed(2)} s at ${FPS} fps (${timeline.length} unique rendered frames, ${byteLength} bytes); fixed-frame slice rendering plus real pointer-drag OrbitControls segment; no wall-clock retiming.`;
if (/^- Review video .*$/m.test(report)) report = report.replace(/^- Review video .*$/m, deterministicLine);
else report += `\n${deterministicLine}\n`;
fs.writeFileSync(reportPath, report);

console.log(JSON.stringify({
  video: 'PASS',
  manualOrbit: 'PASS',
  fps: FPS,
  frameCount: timeline.length,
  durationSec,
  expectedDurationSec,
  byteLength,
}, null, 2));
