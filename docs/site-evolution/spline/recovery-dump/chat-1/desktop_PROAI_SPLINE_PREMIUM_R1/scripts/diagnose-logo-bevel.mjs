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
const requests = [];
const responses = [];
page.on('request', (request) => requests.push({ url: request.url(), resourceType: request.resourceType() }));
page.on('response', (response) =>
  responses.push({
    url: response.url(),
    status: response.status(),
    contentType: response.headers()['content-type'] || '',
  }),
);

await page.goto('http://127.0.0.1:5181/', { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => window.__proAIR1?.loaded === true, null, { timeout: 90000 });
await page.waitForTimeout(1200);

const before = await page.evaluate(() => {
  const elements = [...document.querySelectorAll('*')].map((element) => {
    const rect = element.getBoundingClientRect();
    const text = (element.textContent || '').trim().replace(/\s+/g, ' ');
    const outer = element.outerHTML.slice(0, 500);
    const style = getComputedStyle(element);
    return {
      tag: element.tagName.toLowerCase(),
      id: element.id,
      className: String(element.className || ''),
      href: element.href || '',
      src: element.src || '',
      ariaLabel: element.getAttribute('aria-label') || '',
      title: element.getAttribute('title') || '',
      text,
      outer,
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      display: style.display,
      visibility: style.visibility,
      position: style.position,
      zIndex: style.zIndex,
    };
  });

  const splineElements = elements.filter((item) =>
    JSON.stringify(item).toLowerCase().includes('spline'),
  );
  const visibleBottomRight = elements.filter(
    (item) =>
      item.rect.width > 0 &&
      item.rect.height > 0 &&
      item.rect.x > window.innerWidth - 360 &&
      item.rect.y > window.innerHeight - 140,
  );

  const objects = window.__proAIR1.app.getAllObjects().map((object) => ({
    name: object.name,
    uuid: object.uuid,
    type: object.type,
    parentUuid: object.parentUuid,
    keys: Object.keys(object),
    geometryKeys: object.geometry ? Object.keys(object.geometry) : [],
    ownKeys: Object.keys(object),
    materialLayerKeys: (object.material?.layers || []).map((layer) => Object.keys(layer)),
  }));

  const face = window.__proAIR1.app
    .getAllObjects()
    .find((object) => object.name === 'verde' && object.parentUuid === 'd0f2f312-20b7-4585-bcde-95e9276568f8');

  const faceProbe = face
    ? {
        name: face.name,
        uuid: face.uuid,
        type: face.type,
        keys: Object.keys(face),
        geometryType: face.geometry?.type,
        geometryKeys: face.geometry ? Object.keys(face.geometry) : [],
        geometryParameters: face.geometry?.parameters || null,
        candidateProps: Object.fromEntries(
          [
            'bevel',
            'bevelSize',
            'bevelRadius',
            'radius',
            'cornerRadius',
            'smooth',
            'smoothAngle',
            'edgeSoftness',
            'roundness',
          ].map((key) => [key, face[key] ?? face.geometry?.[key] ?? face.geometry?.parameters?.[key]]),
        ),
      }
    : null;

  return {
    bodyText: document.body.innerText,
    splineElements,
    visibleBottomRight,
    objects,
    objectNamesWithSpline: objects.filter((object) =>
      `${object.name} ${object.type}`.toLowerCase().includes('spline'),
    ),
    faceProbe,
  };
});

const screenshotBefore = path.join(outDir, 'branding-before.png');
await page.screenshot({ path: screenshotBefore, fullPage: false });

const report = {
  before,
  requests: requests.filter((item) => item.url.toLowerCase().includes('spline')),
  responses: responses.filter((item) => item.url.toLowerCase().includes('spline')),
  screenshotBefore,
};

const reportPath = path.join(outDir, 'diagnose-logo-bevel-report.json');
await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');

await browser.close();

console.log(reportPath);
