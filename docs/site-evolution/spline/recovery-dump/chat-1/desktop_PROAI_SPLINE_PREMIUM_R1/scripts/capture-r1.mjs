import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('.');
const outDir = path.join(root, 'out', 'r1-review');
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--use-angle=default'],
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: outDir, size: { width: 1440, height: 900 } },
});

const page = await context.newPage();
const consoleLines = [];
const pageErrors = [];
page.on('console', (msg) => consoleLines.push(`${msg.type()}: ${msg.text()}`));
page.on('pageerror', (error) => pageErrors.push(error.stack || error.message));

await page.goto('http://127.0.0.1:5181/', { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => window.__proAIR1?.loaded === true, null, { timeout: 90000 });
await page.waitForTimeout(1800);

const screenshotA = path.join(outDir, 'proai-spline-premium-r1-1440x900.png');
await page.screenshot({ path: screenshotA, fullPage: false });

const center = await page.evaluate(() => {
  const rect = document.getElementById('canvas3d').getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
});

await page.mouse.move(center.x, center.y);
await page.mouse.down();
await page.mouse.move(center.x + 260, center.y + 120, { steps: 24 });
await page.mouse.up();
await page.mouse.wheel(0, -320);
await page.waitForTimeout(1200);

const screenshotB = path.join(outDir, 'proai-spline-premium-r1-angle-2.png');
await page.screenshot({ path: screenshotB, fullPage: false });

await page.mouse.move(center.x + 80, center.y + 20);
for (let i = 0; i < 9; i += 1) {
  await page.mouse.down();
  await page.mouse.move(center.x - 180 + i * 35, center.y + 60 - i * 12, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(850);
  await page.mouse.wheel(0, i % 2 === 0 ? 80 : -80);
}
await page.waitForTimeout(5500);

const report = await page.evaluate(() => {
  const { app, ...serializableReport } = window.__proAIR1;
  return serializableReport;
});
const reportPath = path.join(outDir, 'proai-spline-premium-r1-report.json');
await fs.writeFile(
  reportPath,
  JSON.stringify({ report, consoleLines, pageErrors, screenshotA, screenshotB }, null, 2),
  'utf8',
);

const video = page.video();
await context.close();
await browser.close();

const videoPath = video ? await video.path() : null;
const finalVideo = path.join(outDir, 'proai-spline-premium-r1-review.webm');
if (videoPath) await fs.copyFile(videoPath, finalVideo);

console.log(
  JSON.stringify(
    {
      screenshotA,
      screenshotB,
      video: videoPath ? finalVideo : null,
      reportPath,
    },
    null,
    2,
  ),
);
