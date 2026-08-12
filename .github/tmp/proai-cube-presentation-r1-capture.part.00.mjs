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
await livePage.waitForFunction(() => {
  const d = window.__PROAI_CUBE_R1.getDiagnostics();
  return d.activeTurn && d.activeTurn.linear > 0.08 && d.activeTurn.linear < 0.88;
}, null, { timeout: 9000 });
const liveBox = await livePage.locator('#cube-canvas').boundingBox();
if (!liveBox) throw new Error('Live canvas box unavailable');
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
await livePage.waitForTimeout(1200);
const blockedAfterSlice = await livePage.evaluate(() => window.__PROAI_CUBE_R1.getDiagnostics());
const cameraAtHeldAngle = blockedAfterSlice.interaction.cameraPosition;
await livePage.mouse.up();
await livePage.waitForTimeout(60);
const afterRelease = await livePage.evaluate(() => window.__PROAI_CUBE_R1.getDiagnostics());
await livePage.waitForTimeout(950);
