import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

// Final QC rerun after isolated responsive overflow correction.
const baseURL = process.env.HERO_PREVIEW_BASE_URL || 'http://127.0.0.1:4173';
const route = `${baseURL}/hero-hybrid-connected-core-preview/`;
const outDir = path.resolve('hero-hybrid-core-owner-review');
const videoDir = path.join(outDir, 'video-raw');

await fs.rm(outDir, { recursive: true, force: true });
await fs.mkdir(videoDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist'],
});

async function waitForCore(page, settleMs = 1000) {
  await page.goto(route, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('#hybrid-system-scene', { state: 'visible' });
  await page.waitForFunction(
    () => document.documentElement.classList.contains('is-webgl'),
    null,
    { timeout: 30000 },
  );
  const canvasReady = await page.locator('#hybrid-core-canvas').evaluate((el) => el.width > 0 && el.height > 0);
  if (!canvasReady) throw new Error('Hybrid Core WebGL canvas did not initialize');
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

  // Full-page mobile captures must exercise the same offscreen visibility path as a real scroll.
  // Render the Core once while its scene intersects the viewport, then return to the top so the
  // resulting screenshot represents the complete page rather than an unpainted offscreen canvas.
  if (options.fullPage) {
    await page.locator('#hybrid-system-scene').scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);
  }

  await page.screenshot({
    path: path.join(outDir, filename),
    fullPage: options.fullPage ?? false,
    animations: 'allow',
  });
  await context.close();
}

await captureStatic('HYBRID_CORE_R1_DESKTOP_STATIC.png', { width: 1440, height: 900 }, { settleMs: 8300 });
await captureStatic('HYBRID_CORE_R1_MOBILE_390_STATIC.png', { width: 390, height: 844 }, { reducedMotion: 'reduce', settleMs: 1200 });
await captureStatic('HYBRID_CORE_R1_MOBILE_390_FULL.png', { width: 390, height: 844 }, { reducedMotion: 'reduce', settleMs: 1200, fullPage: true });
await captureStatic('HYBRID_CORE_R1_MOBILE_320_STATIC.png', { width: 320, height: 780 }, { reducedMotion: 'reduce', settleMs: 1200 });
await captureStatic('HYBRID_CORE_R1_MOBILE_320_FULL.png', { width: 320, height: 780 }, { reducedMotion: 'reduce', settleMs: 1200, fullPage: true });
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
await waitForCore(motionPage, 500);

// Replay the four narrative states only after the WebGL scene is fully ready.
// The workflow trims the final capture envelope so network/CDN load time is not part of owner review.
await motionPage.locator('[data-stage="0"]').focus();
await motionPage.waitForTimeout(1350);
await motionPage.locator('[data-stage="1"]').focus();
await motionPage.waitForTimeout(1400);
await motionPage.locator('[data-stage="2"]').focus();
await motionPage.waitForTimeout(1400);
await motionPage.locator('[data-stage="3"]').focus();
await motionPage.waitForTimeout(2200);

const video = motionPage.video();
await motionContext.close();
const rawVideoPath = await video.path();
await fs.copyFile(rawVideoPath, path.join(outDir, 'HYBRID_CORE_R1_DESKTOP_MOTION.webm'));

await browser.close();

console.log(`Captured owner-review package at ${outDir}`);
