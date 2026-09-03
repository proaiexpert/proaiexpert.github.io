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

const beforePath = path.join(outDir, 'bevel-test-before.png');
await page.screenshot({ path: beforePath, fullPage: false });

const result = await page.evaluate(() => {
  const app = window.__proAIR1.app;
  const proxyFace = app
    .getAllObjects()
    .find((object) => object.name === 'verde' && object.parentUuid === 'd0f2f312-20b7-4585-bcde-95e9276568f8');
  const internalFace = app._scene?.getObjectByProperty?.('uuid', proxyFace.uuid);
  const before = JSON.parse(JSON.stringify(internalFace?.data?.geometry || null));
  const attempts = [];

  try {
    const nextGeometry = {
      ...internalFace.data.geometry,
      cornerRadius: [14, 14, 14, 14],
      extrudeBevelSize: 4,
      extrudeBevelSegments: 3,
    };
    internalFace.updateByOp(
      {
        type: 0,
        path: [],
        props: { geometry: nextGeometry },
      },
      { ...internalFace.data, geometry: nextGeometry },
      { shared: app._sharedAssetsManager, scene: app._scene },
      false,
    );
    internalFace.updateMatrix?.();
    app.requestRender?.();
    attempts.push({ method: 'internalFace.updateByOp(path:[], props.geometry)', ok: true });
  } catch (error) {
    attempts.push({
      method: 'internalFace.updateByOp(path:[], props.geometry)',
      ok: false,
      error: error.message,
    });
  }

  const after = JSON.parse(JSON.stringify(internalFace?.data?.geometry || null));
  return { target: { name: proxyFace.name, uuid: proxyFace.uuid }, before, after, attempts };
});

await page.waitForTimeout(1000);
const afterPath = path.join(outDir, 'bevel-test-after.png');
await page.screenshot({ path: afterPath, fullPage: false });

const reportPath = path.join(outDir, 'bevel-internal-test-report.json');
await fs.writeFile(
  reportPath,
  JSON.stringify({ result, beforePath, afterPath }, null, 2),
  'utf8',
);

await browser.close();
console.log(reportPath);
