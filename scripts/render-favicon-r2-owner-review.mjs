import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = 'http://127.0.0.1:4173/assets/brand/proai-logo-r341/live.html?mode=static&quality=4&startup=controlled';

const browser = await chromium.launch({
  headless: true,
  args: [
    '--use-gl=swiftshader',
    '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox',
    '--disable-dev-shm-usage',
  ],
});
const context = await browser.newContext({
  viewport: { width: 512, height: 512 },
  deviceScaleFactor: 4,
  colorScheme: 'dark',
});
const page = await context.newPage();
page.on('console', msg => console.log('[browser console]', msg.type(), msg.text()));
page.on('pageerror', err => console.error('[browser pageerror]', err));
await page.goto(URL, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(
  () => document.documentElement.dataset.proaiLogoReady === 'true',
  null,
  { timeout: 240000 },
);
await page.evaluate(() => {
  const api = window.__PROAI_CUBE_R1_2;
  api?.stopChoreography?.();
  api?.stopSliceScheduler?.();
  api?.setLookDevPreset?.('premiumHybrid');
  api?.setSignatureFov?.(27, false);
  api?.setSignatureEuler?.(288, 4.5, -0.3, false);
  api?.renderReviewFrame?.();
});
await page.waitForTimeout(100);
const result = await page.evaluate(() => {
  const api = window.__PROAI_CUBE_R1_2;
  api?.renderReviewFrame?.();
  const canvas = document.getElementById('cube-canvas');
  return {
    state: window.__PROAI_LOGO_R341_STATE,
    width: canvas.width,
    height: canvas.height,
    png: canvas.toDataURL('image/png'),
  };
});
console.log(JSON.stringify({ width: result.width, height: result.height, state: result.state }, null, 2));
if (result.width !== 2048 || result.height !== 2048) {
  throw new Error(`Unexpected canvas size ${result.width}x${result.height}`);
}
const payload = result.png.replace(/^data:image\/png;base64,/, '');
fs.writeFileSync('owner-review/favicon-master-r2-2048-transparent.png', Buffer.from(payload, 'base64'));
await browser.close();
