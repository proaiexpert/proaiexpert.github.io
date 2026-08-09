import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const base = process.env.R45_BASE_URL || 'http://127.0.0.1:4173';
const out = process.env.R45_OUT || 'r4-5-owner-review';
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const route = '/hero-a-plus-c-shape-preview/';
const browser = await chromium.launch({ headless: true });

async function ready(page, url) {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
  await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
  await page.waitForFunction(() => typeof window.__r45SetFrame === 'function');
  if (pageErrors.length) throw new Error(`Browser script error: ${pageErrors.join(' | ')}`);
}

// 1) Desktop static owner gate — R4.4 static/UI/material base preserved.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await ready(page, `${base}${route}?mode=static`);
  await page.screenshot({ path: path.join(out, 'R45_DESKTOP_STATIC.png'), fullPage: false });
  await context.close();
}

// 2) Mobile remains static-only for this owner gate.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await ready(page, `${base}${route}?mode=static`);
  await page.screenshot({ path: path.join(out, 'R45_MOBILE_STATIC.png'), fullPage: false });
  await context.close();
}

// 3) Desktop motion — selected medium layered-parallax proof (~1.45° front-layer ceiling).
// The recording is intentionally long enough to show calm -> input -> processing -> output -> resolved calm.
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
  await ready(page, `${base}${route}?parallax=medium`);
  const video = page.video();
  await page.waitForTimeout(13800);
  await page.close();
  webmPath = await video.path();
  await context.close();
}
await browser.close();

const mp4 = path.join(out, 'R45_DESKTOP_MOTION.mp4');
const ff = spawnSync('ffmpeg', [
  '-y', '-i', webmPath,
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
  mp4
], { stdio: 'inherit' });
if (ff.status !== 0) process.exit(ff.status ?? 1);
fs.rmSync(videoDir, { recursive: true, force: true });

for (const file of ['R45_DESKTOP_STATIC.png','R45_DESKTOP_MOTION.mp4','R45_MOBILE_STATIC.png']) {
  const p = path.join(out, file);
  if (!fs.existsSync(p) || fs.statSync(p).size < 1000) throw new Error(`Missing/empty output: ${p}`);
}

const extras = fs.readdirSync(out).filter(name => !['R45_DESKTOP_STATIC.png','R45_DESKTOP_MOTION.mp4','R45_MOBILE_STATIC.png'].includes(name));
if (extras.length) throw new Error(`Unexpected owner-review output(s): ${extras.join(', ')}`);

console.log('R4.5 lean owner-review package complete:', fs.readdirSync(out));