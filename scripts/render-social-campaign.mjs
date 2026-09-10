import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const outDir = 'assets/social';
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'no-preference' });

async function prepare(lang) {
  await page.goto(`http://127.0.0.1:4173/tools/social-campaign/preview.html?lang=${lang}&capture=1&motionSeed=20260910`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForFunction(() => document.documentElement.dataset.goldenCubeReady === 'true', null, { timeout: 30000 });
  await page.evaluate(async () => {
    await document.fonts.ready;
    const img = document.querySelector('.proai-logo-r341__static');
    if (img && !img.complete) await new Promise((resolve) => img.addEventListener('load', resolve, { once: true }));
  });
  await page.evaluate(() => {
    const runtime = window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime
      || window.__PROAI_CUBE_TOUCH_AUTO_45_R1
      || window.__PROAI_CUBE_FINAL_MOTION_R2_INTERACTION_POLISH
      || window.__PROAI_CUBE_FINAL_MOTION_R2;
    runtime?.stopChoreography?.();
    runtime?.stopSliceScheduler?.();
    runtime?.setRenderLoopActive?.(true);
    if (!runtime?.turnSlice) throw new Error('Production cube turnSlice API unavailable');
    window.__PROAI_SOCIAL_TURN_PROMISE = runtime.turnSlice({ axis: 'Y', layer: -1, direction: -1, durationMs: 1180, ignoreInteraction: true });
  });
  await page.waitForTimeout(520);
  await page.evaluate(() => {
    const runtime = window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime
      || window.__PROAI_CUBE_TOUCH_AUTO_45_R1
      || window.__PROAI_CUBE_FINAL_MOTION_R2_INTERACTION_POLISH
      || window.__PROAI_CUBE_FINAL_MOTION_R2;
    runtime?.setRenderLoopActive?.(false);
  });
  await page.waitForTimeout(60);
}

for (const lang of ['en','ru']) {
  await prepare(lang);
  await page.screenshot({ path: `${outDir}/proai-social-${lang}-r1.png`, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
}

await browser.close();
for (const file of ['proai-social-en-r1.png','proai-social-ru-r1.png']) {
  const stat = await fs.stat(`${outDir}/${file}`);
  console.log(`${file}: ${stat.size} bytes`);
}
