import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const base = process.env.R44_BASE_URL || 'http://127.0.0.1:4173';
const out = process.env.R44_OUT || 'r4-4-owner-review';
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const route = '/hero-a-plus-c-shape-preview/';
const browser = await chromium.launch({ headless: true });

async function ready(page, url) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
  await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
}

// 1) Desktop static owner check.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await ready(page, `${base}${route}?mode=static`);
  await page.screenshot({ path: path.join(out, 'R44_DESKTOP_STATIC.png'), fullPage: false });
  await context.close();
}

// 2) Mobile static owner check.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await ready(page, `${base}${route}?mode=static`);
  await page.screenshot({ path: path.join(out, 'R44_MOBILE_STATIC.png'), fullPage: false });
  await context.close();
}

// 3) One browser-native motion preview. Preserve the lean owner-review contract.
const videoDir = path.join(out, '.video-tmp');
fs.mkdirSync(videoDir, { recursive: true });
let webmPath;
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    recordVideo: { dir: videoDir, size: { width: 1440, height: 900 } }
  });
  const page = await context.newPage();
  await ready(page, `${base}${route}`);
  const video = page.video();
  await page.waitForTimeout(10800);
  await page.close();
  webmPath = await video.path();
  await context.close();
}
await browser.close();

const mp4 = path.join(out, 'R44_DESKTOP_MOTION.mp4');
const ff = spawnSync('ffmpeg', [
  '-y', '-i', webmPath,
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
  mp4
], { stdio: 'inherit' });
if (ff.status !== 0) process.exit(ff.status ?? 1);
fs.rmSync(videoDir, { recursive: true, force: true });

for (const file of ['R44_DESKTOP_STATIC.png','R44_MOBILE_STATIC.png','R44_DESKTOP_MOTION.mp4']) {
  const p = path.join(out, file);
  if (!fs.existsSync(p) || fs.statSync(p).size < 1000) throw new Error(`Missing/empty output: ${p}`);
}
console.log('R4.4 lean owner-review package complete:', fs.readdirSync(out));
