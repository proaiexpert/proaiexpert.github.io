import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.HERO_PREVIEW_BASE_URL || 'http://127.0.0.1:4173';
const route = `${baseURL}/hero-hybrid-connected-core-preview/`;
const outDir = path.resolve('hero-hybrid-core-owner-review');
const videoDir = path.join(outDir, 'video-raw');

await fs.rm(outDir, { recursive: true, force: true });
await fs.mkdir(videoDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function waitForCore(page, settleMs = 1000) {
  await page.goto(route, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('#hybrid-system-scene', { state: 'visible' });
  await page.waitForTimeout(settleMs);
}

async function captureStatic(filename, viewport, options = {}) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    reducedMotion: options.reducedMotion || 'no-preference',
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  await waitForCore(page, options.settleMs ?? 8500);
  await page.screenshot({
    path: path.join(outDir, filename),
    fullPage: false,
    animations: 'allow',
  });
  await context.close();
}

await captureStatic('HYBRID_CORE_R1_DESKTOP_STATIC.png', { width: 1440, height: 900 }, { settleMs: 8300 });
await captureStatic('HYBRID_CORE_R1_MOBILE_390_STATIC.png', { width: 390, height: 844 }, { reducedMotion: 'reduce', settleMs: 1200 });
await captureStatic('HYBRID_CORE_R1_MOBILE_320_STATIC.png', { width: 320, height: 780 }, { reducedMotion: 'reduce', settleMs: 1200 });
await captureStatic('HYBRID_CORE_R1_SHORT_LANDSCAPE_STATIC.png', { width: 844, height: 390 }, { reducedMotion: 'reduce', settleMs: 1200 });

const motionContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  colorScheme: 'dark',
  recordVideo: {
    dir: videoDir,
    size: { width: 1440, height: 900 },
  },
});
const motionPage = await motionContext.newPage();
await waitForCore(motionPage, 9000);
const video = motionPage.video();
await motionContext.close();
const rawVideoPath = await video.path();
await fs.copyFile(rawVideoPath, path.join(outDir, 'HYBRID_CORE_R1_DESKTOP_MOTION.webm'));

await browser.close();

console.log(`Captured owner-review package at ${outDir}`);
