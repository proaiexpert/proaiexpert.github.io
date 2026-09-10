import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const outDir = 'assets/social';
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
  reducedMotion: 'no-preference',
});

await page.goto('http://127.0.0.1:4173/tools/social-og/preview.html?lang=en&capture=1&motionSeed=20260910', {
  waitUntil: 'networkidle', timeout: 60000,
});

await page.waitForFunction(() => document.documentElement.dataset.goldenCubeReady === 'true', null, { timeout: 30000 });
await page.evaluate(async () => {
  await document.fonts.ready;
  const img = document.querySelector('.proai-logo-r341__static');
  if (img && !img.complete) await new Promise((resolve) => img.addEventListener('load', resolve, { once: true }));
});

// Freeze autonomous choreography first, then create one curated in-motion frame
// using the ACTUAL production runtime/geometry/materials. This is not a redraw.
await page.evaluate(() => {
  const runtime = window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime
    || window.__PROAI_CUBE_TOUCH_AUTO_45_R1
    || window.__PROAI_CUBE_FINAL_MOTION_R2_INTERACTION_POLISH
    || window.__PROAI_CUBE_FINAL_MOTION_R2;
  runtime?.stopChoreography?.();
  runtime?.stopSliceScheduler?.();
  runtime?.setRenderLoopActive?.(true);
  if (!runtime?.turnSlice) throw new Error('Production cube turnSlice API unavailable');
  window.__PROAI_OG_TURN_PROMISE = runtime.turnSlice({
    axis: 'X', layer: 1, direction: 1, durationMs: 1180, ignoreInteraction: true,
  });
});

// Capture mid-turn to preserve the signature kinetic character visible on the live Hero.
await page.waitForTimeout(545);
await page.evaluate(() => {
  const runtime = window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime
    || window.__PROAI_CUBE_TOUCH_AUTO_45_R1
    || window.__PROAI_CUBE_FINAL_MOTION_R2_INTERACTION_POLISH
    || window.__PROAI_CUBE_FINAL_MOTION_R2;
  runtime?.setRenderLoopActive?.(false);
});
await page.waitForTimeout(60);

await page.screenshot({
  path: `${outDir}/proai-home-og-en-r1.png`, type: 'png',
  clip: { x: 0, y: 0, width: 1200, height: 630 },
});

// Localize copy only. Keep the exact same frozen production cube frame.
await page.evaluate(() => {
  document.documentElement.lang = 'ru';
  document.body.classList.remove('lang-en');
  document.body.classList.add('lang-ru');
  document.getElementById('og-title').innerHTML = [
    'От первого впечатления',
    'до результата —',
    'одна система.',
  ].map((s) => `<span>${s}</span>`).join('');
  document.getElementById('og-services').textContent = 'AI · Автоматизация · Сайты · Брендинг';
});
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(80);

await page.screenshot({
  path: `${outDir}/proai-home-og-ru-r1.png`, type: 'png',
  clip: { x: 0, y: 0, width: 1200, height: 630 },
});

await browser.close();

for (const file of ['proai-home-og-en-r1.png', 'proai-home-og-ru-r1.png']) {
  const stat = await fs.stat(`${outDir}/${file}`);
  console.log(`${file}: ${stat.size} bytes`);
}
