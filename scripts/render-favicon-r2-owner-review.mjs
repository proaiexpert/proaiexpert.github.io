import { chromium } from 'playwright';

const URL = 'http://127.0.0.1:4173/assets/brand/proai-logo-r341/live.html?mode=static&quality=4&startup=controlled';

async function render({ cssSize, outPath }) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: cssSize, height: cssSize },
    deviceScaleFactor: 4,
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForFunction(
    () => document.documentElement.dataset.proaiLogoReady === 'true',
    null,
    { timeout: 45000 },
  );
  await page.addStyleTag({ content: 'html,body{background:#050607!important}' });
  await page.evaluate(() => {
    const api = window.__PROAI_CUBE_R1_2;
    api?.stopChoreography?.();
    api?.stopSliceScheduler?.();
    api?.setLookDevPreset?.('premiumHybrid');
    api?.setSignatureFov?.(27, false);
    api?.setSignatureEuler?.(288, 4.5, -0.3, false);
    api?.renderReviewFrame?.();
  });
  await page.waitForTimeout(250);
  const state = await page.evaluate(() => window.__PROAI_LOGO_R341_STATE);
  console.log(JSON.stringify({ outPath, state }, null, 2));
  await page.screenshot({ path: outPath, fullPage: false, omitBackground: false });
  await browser.close();
}

await render({ cssSize: 512, outPath: 'owner-review/favicon-master-r2-2048.png' });
await render({ cssSize: 256, outPath: 'owner-review/favicon-micro-r2-source-1024.png' });
