import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const outDir = 'assets/social';
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function openReadyPage(lang='en') {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:4173/tools/social-og/preview.html?lang=${lang}&capture=1&motionSeed=20260910`, {
    waitUntil: 'networkidle', timeout: 60000,
  });
  await page.waitForFunction(() => document.documentElement.dataset.goldenCubeReady === 'true', null, { timeout: 30000 });
  await page.evaluate(async () => {
    await document.fonts.ready;
    const img = document.querySelector('.proai-logo-r341__static');
    if (img && !img.complete) await new Promise((resolve) => img.addEventListener('load', resolve, { once: true }));
  });
  return page;
}

async function freeze(page) {
  await page.evaluate(() => {
    const runtime = window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime
      || window.__PROAI_CUBE_TOUCH_AUTO_45_R1
      || window.__PROAI_CUBE_FINAL_MOTION_R2_INTERACTION_POLISH
      || window.__PROAI_CUBE_FINAL_MOTION_R2;
    runtime?.stopChoreography?.();
    runtime?.stopSliceScheduler?.();
    runtime?.setRenderLoopActive?.(false);
  });
  await page.waitForTimeout(60);
}

for (const delay of [850, 1100, 1350, 1600, 1900]) {
  const page = await openReadyPage('en');
  await page.waitForTimeout(delay);
  await freeze(page);
  await page.screenshot({
    path: `${outDir}/proai-og-frame-${delay}.png`, type: 'png',
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });
  await page.close();
}

await browser.close();
