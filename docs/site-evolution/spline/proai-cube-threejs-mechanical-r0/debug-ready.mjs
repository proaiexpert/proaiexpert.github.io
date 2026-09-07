// Browser readiness probe; rerun after GLTFLoader duplicate-name normalization.
import { chromium } from 'playwright';

const URL = process.env.PROAI_R0_URL || 'http://127.0.0.1:4173/?capture=1';
const events = { console: [], pageErrors: [], failedRequests: [], responses: [] };
const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 900, height: 1040 } });
page.on('console', (msg) => events.console.push(`${msg.type()}: ${msg.text()}`));
page.on('pageerror', (error) => events.pageErrors.push(String(error?.stack || error)));
page.on('requestfailed', (request) => events.failedRequests.push({ url: request.url(), failure: request.failure() }));
page.on('response', (response) => {
  if (!response.ok() || /\.glb(?:$|\?)/i.test(response.url())) {
    events.responses.push({ url: response.url(), status: response.status(), ok: response.ok() });
  }
});

await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(5000);
const state = await page.evaluate(() => ({
  apiExists: Boolean(window.__PROAI_CUBE_R0),
  api: window.__PROAI_CUBE_R0 ? {
    ready: window.__PROAI_CUBE_R0.ready,
    motionState: window.__PROAI_CUBE_R0.motionState,
    hierarchy: window.__PROAI_CUBE_R0.hierarchy,
    mechanics: window.__PROAI_CUBE_R0.mechanics,
  } : null,
  status: document.getElementById('runtime-status')?.textContent ?? null,
  canvas: (() => {
    const canvas = document.getElementById('cube-canvas');
    return canvas ? { width: canvas.width, height: canvas.height } : null;
  })(),
}));
console.log('PROAI_R0_READY_DEBUG');
console.log(JSON.stringify({ state, events }, null, 2));
await browser.close();
if (!state.api?.ready) process.exit(1);
