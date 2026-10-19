import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('.');
const outDir = path.join(root, 'out', 'logo-bevel-diagnostics');
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
});

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://127.0.0.1:5181/', { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => window.__proAIR1?.loaded === true, null, { timeout: 90000 });
await page.waitForTimeout(1000);

const beforeBevelPath = path.join(outDir, 'bevel-before.png');
await page.screenshot({ path: beforeBevelPath, fullPage: false });

const probe = await page.evaluate(() => {
  const app = window.__proAIR1.app;
  const proxyFace = app
    .getAllObjects()
    .find((object) => object.name === 'verde' && object.parentUuid === 'd0f2f312-20b7-4585-bcde-95e9276568f8');
  const internalFace = app._scene?.getObjectByProperty?.('uuid', proxyFace.uuid);
  const data = internalFace?.data || {};
  const geometry = data.geometry || internalFace?.geometry;
  const before = {
    proxyKeys: Object.keys(proxyFace || {}),
    proxyCandidateValues: Object.fromEntries(
      [
        'bevel',
        'bevelSize',
        'bevelRadius',
        'cornerRadius',
        'roundness',
        'smooth',
        'smoothAngle',
        'edgeSoftness',
      ].map((key) => [key, proxyFace?.[key] ?? proxyFace?.geometry?.[key] ?? proxyFace?.geometry?.parameters?.[key]]),
    ),
    internalType: internalFace?.type,
    internalKeys: internalFace ? Object.keys(internalFace).slice(0, 120) : [],
    dataType: data.type,
    dataKeys: Object.keys(data).slice(0, 120),
    geometryType: geometry?.type,
    geometryKeys: geometry ? Object.keys(geometry).slice(0, 120) : [],
    geometrySnapshot: geometry
      ? JSON.parse(
          JSON.stringify(geometry, (key, value) => {
            if (key === 'buffer' || key === 'array' || key === 'data') return `[${typeof value}]`;
            if (typeof value === 'function') return '[function]';
            return value;
          }).slice(0, 6000),
        )
      : null,
  };

  const attempts = [];
  for (const key of ['bevel', 'bevelSize', 'bevelRadius', 'cornerRadius', 'roundness', 'smoothAngle', 'edgeSoftness']) {
    try {
      const previous = proxyFace[key];
      proxyFace[key] = 6;
      attempts.push({ surface: 'proxy', key, previous, after: proxyFace[key], ok: proxyFace[key] === 6 });
      proxyFace[key] = previous;
    } catch (error) {
      attempts.push({ surface: 'proxy', key, error: error.message, ok: false });
    }
    if (geometry) {
      try {
        const previous = geometry[key];
        geometry[key] = 6;
        attempts.push({ surface: 'geometry', key, previous, after: geometry[key], ok: geometry[key] === 6 });
        geometry[key] = previous;
      } catch (error) {
        attempts.push({ surface: 'geometry', key, error: error.message, ok: false });
      }
    }
  }

  return {
    before,
    attempts,
    hasSwapGeometry: typeof app.swapGeometry === 'function',
    watermarkState: {
      hasSplineWatermarkImage: Boolean(app._data?.shared?.images?.SplineWatermark),
      logoOverlayEnabled: app._renderer?.pipeline?.logoOverlayPass?.enabled,
      scenePublishWebLogo: app._data?.scene?.publish?.settings?.web?.logo,
    },
  };
});

const afterBevelPath = path.join(outDir, 'bevel-after-attempt.png');
await page.screenshot({ path: afterBevelPath, fullPage: false });

const reportPath = path.join(outDir, 'startup-bevel-report.json');
await fs.writeFile(
  reportPath,
  JSON.stringify(
    {
      probe,
      beforeBevelPath,
      afterBevelPath,
    },
    null,
    2,
  ),
  'utf8',
);

await browser.close();
console.log(reportPath);
