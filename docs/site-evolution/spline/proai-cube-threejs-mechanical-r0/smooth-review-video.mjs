import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REVIEW = path.join(ROOT, 'review');
const FRAME_DIR = path.join(os.tmpdir(), 'proai-cube-r0-deterministic-frames');
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

function writePngDataUrl(dataUrl, filepath) {
  const comma = dataUrl.indexOf(',');
  if (!dataUrl.startsWith('data:image/png') || comma < 0) throw new Error('Invalid PNG data URL');
  fs.writeFileSync(filepath, Buffer.from(dataUrl.slice(comma + 1), 'base64'));
}

function addFrames(timeline, seconds, factory) {
  const count = Math.max(1, Math.round(seconds * FPS));
  for (let i = 0; i < count; i += 1) timeline.push(factory(i, count));
}

function makeTimeline() {
  const timeline = [];
  addFrames(timeline, 1.25, () => ({ phase: 'rest', progress: 0, orbit: 0 }));
  addFrames(timeline, 1.65, (i, count) => ({ phase: 'turn', progress: (i + 1) / count, orbit: 0 }));
  addFrames(timeline, 1.20, () => ({ phase: 'turned', progress: 1, orbit: 0 }));
  addFrames(timeline, 1.60, (i, count) => ({ phase: 'turned', progress: 1, orbit: (i + 1) / count }));
  addFrames(timeline, 0.60, () => ({ phase: 'turned', progress: 1, orbit: 1 }));
  addFrames(timeline, 1.75, (i, count) => ({ phase: 'reset', progress: (i + 1) / count, orbit: 1 }));
  addFrames(timeline, 1.60, (i, count) => ({ phase: 'rest', progress: 0, orbit: 1 - (i + 1) / count }));
  addFrames(timeline, 1.00, () => ({ phase: 'rest', progress: 0, orbit: 0 }));
  return timeline;
}

fs.mkdirSync(REVIEW, { recursive: true });
fs.rmSync(FRAME_DIR, { recursive: true, force: true });
fs.mkdirSync(FRAME_DIR, { recursive: true });

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
  orbit: typeof window.__PROAI_CUBE_R0?.setReviewOrbitProgress === 'function',
}));
if (!apiSupport.slice || !apiSupport.reset || !apiSupport.orbit) {
  throw new Error(`Deterministic review API missing: ${JSON.stringify(apiSupport)}`);
}

const timeline = makeTimeline();
for (let index = 0; index < timeline.length; index += 1) {
  const frame = timeline[index];
  const dataUrl = await page.evaluate(({ phase, progress, orbit }) => {
    const api = window.__PROAI_CUBE_R0;
    if (phase === 'turn' || phase === 'turned') api.setReviewSliceProgress(progress, 1);
    else if (phase === 'reset') api.setReviewResetProgress(progress, 1);
    api.setReviewOrbitProgress(orbit);
    return api.captureFrame();
  }, frame);
  writePngDataUrl(dataUrl, path.join(FRAME_DIR, `frame-${String(index).padStart(4, '0')}.png`));
  if (index % 48 === 0 || index === timeline.length - 1) {
    console.log(`deterministic review frame ${index + 1}/${timeline.length}`);
  }
}
await page.close();
await browser.close();

const ffmpegPath = findPlaywrightFfmpeg();
fs.rmSync(OUTPUT, { force: true });
const encode = spawnSync(
  ffmpegPath,
  [
    '-y',
    '-framerate', String(FPS),
    '-start_number', '0',
    '-i', path.join(FRAME_DIR, 'frame-%04d.png'),
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
  { encoding: 'utf8' },
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
  captureMode: 'deterministic-frame-step',
  reviewDurationSec: durationSec,
  expectedDurationSec,
  fps: FPS,
  frameCount: timeline.length,
  uniqueRenderedFrames: timeline.length,
  byteLength,
  mimeType: 'video/webm;codecs=vp8',
  normalization: 'None. The review clip is rendered at fixed 24 fps from deterministic Three.js slice/orbit poses, independent of SwiftShader wall-clock speed.',
};
qa.acceptance.videoDuration = videoPass ? 'PASS' : 'FAIL';
qa.acceptance.motionVideoFrameRate = FPS >= 24 ? 'PASS' : 'FAIL';
fs.writeFileSync(qaPath, JSON.stringify(qa, null, 2) + '\n');

const reportPath = path.join(ROOT, 'TECHNICAL_REPORT.md');
let report = fs.readFileSync(reportPath, 'utf8');
const deterministicLine = `- Review video ${durationSec.toFixed(2)} s at ${FPS} fps (${timeline.length} unique rendered frames, ${byteLength} bytes); deterministic frame-stepping, no wall-clock retiming.`;
if (/^- Review video .*$/m.test(report)) report = report.replace(/^- Review video .*$/m, deterministicLine);
else report += `\n${deterministicLine}\n`;
fs.writeFileSync(reportPath, report);

fs.rmSync(FRAME_DIR, { recursive: true, force: true });
console.log(JSON.stringify({
  video: 'PASS',
  fps: FPS,
  frameCount: timeline.length,
  durationSec,
  expectedDurationSec,
  byteLength,
}, null, 2));
