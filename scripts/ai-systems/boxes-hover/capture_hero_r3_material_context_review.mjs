import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../');
const evidenceDir = path.join(repoRoot, 'docs/site-evolution/ai-systems/hero-r3-material-context-review-r1');
const qaDir = path.join(evidenceDir, 'runtime-qa');
const frameDir = path.join(evidenceDir, '.video-frames');
const baseUrl = 'http://127.0.0.1:4179/owner-preview/ai-systems-hero-r3-material-context-review-r1';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const modes = {
  golden: 'c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798',
  r3: '1269ea60eb7725e59822ba2b9e789a2d9dd8956f557ffbbedfbb39e97a12c4d0',
};
const reviewFile = (language) => language === 'ru'
  ? 'ai-systems-hero-r3-material-context-review-r1-ru.html'
  : 'ai-systems-hero-r3-material-context-review-r1.html';

fs.mkdirSync(qaDir, { recursive: true });
fs.mkdirSync(frameDir, { recursive: true });

const safeName = (name) => name.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function boot(page, mode, language = 'en') {
  const logs = [];
  page.on('console', (message) => logs.push({ type: message.type(), text: message.text() }));
  page.on('pageerror', (error) => logs.push({ type: 'pageerror', text: String(error) }));
  await page.goto(`http://127.0.0.1:4179/owner-preview/${reviewFile(language)}?mode=${mode}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => document.documentElement.dataset.heroReviewStatus === 'ready', { timeout: 30000 });
  return { logs, info: await page.evaluate(() => ({
    status: document.documentElement.dataset.heroReviewStatus,
    mode: document.documentElement.dataset.heroReviewMode,
    payload: document.documentElement.dataset.heroReviewPayload,
    cubes: document.documentElement.dataset.heroReviewCubes,
    materials: document.documentElement.dataset.heroReviewMaterialIdentities,
    uiHidden: document.documentElement.dataset.heroReviewUiHidden,
    webgpu: document.documentElement.dataset.heroReviewWebgpu,
    viewport: { width: innerWidth, height: innerHeight },
    bodyWidth: document.body.scrollWidth,
  })) };
}

async function captureStates(page, mode, prefix = mode) {
  const name = safeName(prefix);
  await page.screenshot({ path: path.join(qaDir, `${name}-rest.png`) });
  await page.mouse.move(1080, 450, { steps: 30 });
  await wait(900);
  await page.screenshot({ path: path.join(qaDir, `${name}-center-hover.png`) });
  await page.mouse.move(1360, 450, { steps: 30 });
  await wait(900);
  await page.screenshot({ path: path.join(qaDir, `${name}-edge-hover.png`) });
  await page.mouse.move(300, 760, { steps: 20 });
  await wait(1800);
  await page.screenshot({ path: path.join(qaDir, `${name}-settled.png`) });
}

async function captureVideo(page) {
  fs.rmSync(frameDir, { recursive: true, force: true });
  fs.mkdirSync(frameDir, { recursive: true });
  let frame = 0;
  const shot = async () => {
    frame += 1;
    await page.screenshot({ path: path.join(frameDir, `frame-${String(frame).padStart(4, '0')}.png`) });
  };
  for (let i = 0; i < 24; i += 1) { await shot(); await wait(100); }
  await page.mouse.move(1080, 450, { steps: 36 });
  for (let i = 0; i < 24; i += 1) { await shot(); await wait(100); }
  for (let i = 0; i < 24; i += 1) { await shot(); await wait(100); }
  await page.mouse.move(300, 760, { steps: 30 });
  for (let i = 0; i < 48; i += 1) { await shot(); await wait(100); }
  return frame;
}

const browser = await puppeteer.launch({
  headless: false,
  executablePath: chromePath,
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
  args: ['--enable-unsafe-webgpu', '--ignore-gpu-blocklist', '--use-angle=vulkan', '--disable-dev-shm-usage'],
});

const results = {};
for (const mode of Object.keys(modes)) {
  const page = await browser.newPage();
  const bootResult = await boot(page, mode);
  await captureStates(page, mode);
  results[mode] = { ...bootResult, expectedSha: modes[mode] };
  await page.close();
}

const ruPage = await browser.newPage();
const ruBoot = await boot(ruPage, 'r3', 'ru');
await captureStates(ruPage, 'r3', 'ru-r3');
results.ru = { ...ruBoot, expectedSha: modes.r3 };
await ruPage.close();

for (const viewport of [{ name: '390', width: 390, height: 844 }, { name: '320', width: 320, height: 760 }]) {
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1 });
  const mobileBoot = await boot(mobilePage, 'r3', 'en');
  results.mobile = results.mobile || {};
  results.mobile[viewport.name] = { ...mobileBoot, expectedSha: modes.r3 };
  await mobilePage.close();
}

const videoPage = await browser.newPage();
const videoBoot = await boot(videoPage, 'r3', 'en');
const frameCount = await captureVideo(videoPage);
results.video = { ...videoBoot, frameCount };
await videoPage.close();
await browser.close();

const ffmpeg = 'C:\\Users\\PC Profile\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg.Essentials_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1-essentials_build\\bin\\ffmpeg.exe';
const composite = path.join(qaDir, 'owner-composite.png');
execFileSync(ffmpeg, ['-y', '-i', path.join(qaDir, 'golden-rest.png'), '-i', path.join(qaDir, 'r3-rest.png'), '-i', path.join(qaDir, 'golden-center-hover.png'), '-i', path.join(qaDir, 'r3-center-hover.png'), '-filter_complex', '[0:v][1:v][2:v][3:v]xstack=inputs=4:layout=0_0|w0_0|0_h0|w0_h0', '-frames:v', '1', composite], { stdio: 'ignore' });
const video = path.join(evidenceDir, 'owner-r3-hero-rest-hover-settle.mp4');
execFileSync(ffmpeg, ['-y', '-framerate', '10', '-i', path.join(frameDir, 'frame-%04d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', video], { stdio: 'ignore' });
fs.rmSync(frameDir, { recursive: true, force: true });
for (const state of ['rest', 'center-hover', 'edge-hover', 'settled']) fs.rmSync(path.join(qaDir, `ru-r3-${state}.png`), { force: true });
fs.writeFileSync(path.join(evidenceDir, 'runtime-qa.json'), `${JSON.stringify({ runtime: '@splinetool/runtime@2.0.27', results }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ evidenceDir, results, composite, video, videoSeconds: 12 }, null, 2));
