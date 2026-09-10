import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const outDir = 'assets/social';
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

await page.goto('http://127.0.0.1:4173/tools/social-og/preview.html?lang=en&capture=1&motionSeed=20260910', {
  waitUntil: 'networkidle',
  timeout: 60000,
});

await page.waitForFunction(() => document.documentElement.dataset.goldenCubeReady === 'true', null, { timeout: 30000 });
await page.evaluate(async () => {
  await document.fonts.ready;
  const img = document.querySelector('.proai-logo-r341__static');
  if (img && !img.complete) await new Promise((resolve) => img.addEventListener('load', resolve, { once: true }));
});

// Let the exact production runtime settle into its natural three-quarter presentation,
// then freeze the real production object so EN/RU use the identical cube frame.
await page.waitForTimeout(900);
await page.evaluate(() => {
  const runtime = window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime
    || window.__PROAI_CUBE_TOUCH_AUTO_45_R1
    || window.__PROAI_CUBE_FINAL_MOTION_R2_INTERACTION_POLISH
    || window.__PROAI_CUBE_FINAL_MOTION_R2;
  runtime?.stopChoreography?.();
  runtime?.stopSliceScheduler?.();
  runtime?.setRenderLoopActive?.(false);
});
await page.waitForTimeout(80);

await page.screenshot({
  path: `${outDir}/proai-og-en-v2.png`,
  type: 'png',
  clip: { x: 0, y: 0, width: 1200, height: 630 },
});

await page.evaluate(() => {
  document.documentElement.lang = 'ru';
  document.body.classList.remove('lang-en');
  document.body.classList.add('lang-ru');
  document.getElementById('og-title').innerHTML = [
    'AI-системы,',
    'автоматизация бизнеса,',
    'сайты и брендинг',
  ].map((s) => `<span style="display:block">${s}</span>`).join('');
  document.getElementById('og-sub').textContent = 'Для сервисных компаний в США';
});
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(80);

await page.screenshot({
  path: `${outDir}/proai-og-ru-v2.png`,
  type: 'png',
  clip: { x: 0, y: 0, width: 1200, height: 630 },
});

await browser.close();

for (const file of ['proai-og-en-v2.png', 'proai-og-ru-v2.png']) {
  const stat = await fs.stat(`${outDir}/${file}`);
  console.log(`${file}: ${stat.size} bytes`);
}
