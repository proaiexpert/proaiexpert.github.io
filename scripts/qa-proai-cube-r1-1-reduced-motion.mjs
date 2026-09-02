import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const baseUrl = 'http://127.0.0.1:4173/docs/site-evolution/reviews/proai-cube-ownership-fingerprint-r1/review.html?capture=1&review=1&etch=signature';
const evidenceDir = 'docs/site-evolution/reviews/proai-cube-r1-1-visual-recovery';
const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.goto(baseUrl, { waitUntil: 'load' });
await page.waitForFunction(() => document.documentElement.dataset.proaiCubeReady === 'true', null, { timeout: 15000 });
await page.waitForTimeout(1200);
const diagnostics = await page.evaluate(() => window.__PROAI_CUBE_R1_2?.getDiagnostics?.());
await fs.mkdir(evidenceDir, { recursive: true });
await page.screenshot({ path: `${evidenceDir}/13-reduced-motion.png` });
await fs.writeFile(`${evidenceDir}/13-reduced-motion.json`, JSON.stringify({
  mediaReduced: await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches),
  ready: await page.evaluate(() => document.documentElement.dataset.proaiCubeReady === 'true'),
  diagnostics,
  errors,
}, null, 2));
console.log(JSON.stringify({
  mediaReduced: await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches),
  ready: await page.evaluate(() => document.documentElement.dataset.proaiCubeReady === 'true'),
  scheduler: diagnostics?.scheduler,
  errors,
}, null, 2));
await browser.close();
