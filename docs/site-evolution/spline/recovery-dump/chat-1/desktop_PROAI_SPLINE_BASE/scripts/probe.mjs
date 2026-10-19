import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('.');
const outDir = path.join(root, 'out');
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--use-angle=default'],
});

const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const consoleLines = [];
const pageErrors = [];
page.on('console', (msg) => consoleLines.push(`${msg.type()}: ${msg.text()}`));
page.on('pageerror', (error) => pageErrors.push(error.stack || error.message));

await page.goto('http://127.0.0.1:5177/', { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => window.__splineProbe?.loaded === true, null, {
  timeout: 90000,
});
await page.waitForTimeout(2500);

const beforePath = path.join(outDir, 'before.png');
await page.screenshot({ path: beforePath, fullPage: false });

const interaction = await page.evaluate(async () => {
  const canvas = document.getElementById('canvas3d');
  const rect = canvas.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
});

await page.mouse.move(interaction.x, interaction.y);
await page.mouse.down();
await page.mouse.move(interaction.x + 180, interaction.y + 80, { steps: 16 });
await page.mouse.up();
await page.waitForTimeout(1500);

const afterInteractionPath = path.join(outDir, 'after-interaction.png');
await page.screenshot({ path: afterInteractionPath, fullPage: false });

const detailed = await page.evaluate(() => {
  const probe = window.__splineProbe;
  const app = probe.app;
  const objects = app.getAllObjects();
  const terms = [
    'right',
    'center',
    'left',
    'cube',
    'plane',
    'directional light',
    'verde',
    'giallo',
    'bianco',
    'blu',
    'arancio',
    'rosso',
  ];

  const important = objects.filter((object) =>
    terms.some((term) => object.name?.toLowerCase().includes(term.toLowerCase())),
  );
  const faces = objects.filter((object) =>
    ['verde', 'giallo', 'bianco', 'blu', 'arancio', 'rosso'].some((term) =>
      object.name?.toLowerCase().includes(term),
    ),
  );
  const plane = objects.find((object) => object.name?.toLowerCase().includes('plane'));
  const light = objects.find((object) =>
    object.name?.toLowerCase().includes('directional light'),
  );

  function propsOf(value) {
    const result = {};
    if (!value) return result;
    for (const key of Object.keys(value)) {
      if (/type|category|color|rough|metal|reflect|intensity|opacity|visible|enabled/i.test(key)) {
        try {
          const item = value[key];
          result[key] =
            item && typeof item === 'object' && typeof item.toArray === 'function'
              ? item.toArray()
              : item;
        } catch (error) {
          result[key] = `[error: ${error.message}]`;
        }
      }
    }
    return result;
  }

  function writable(target, key, value) {
    if (!target) return false;
    try {
      const before = target[key];
      target[key] = value ?? before;
      return target[key] === value || target[key] === before || typeof target[key] !== 'undefined';
    } catch {
      return false;
    }
  }

  const materialDetails = faces.slice(0, 18).map((object) => ({
    name: object.name,
    id: object.id,
    type: object.type,
    parentName: object.parent?.name,
    materialKeys: Object.keys(object.material || {}),
    materialProps: propsOf(object.material),
    layers: (object.material?.layers || []).map((layer) => ({
      keys: Object.keys(layer || {}),
      props: propsOf(layer),
      writable: {
        color: writable(layer, 'color'),
        roughness: writable(layer, 'roughness'),
        metalness: writable(layer, 'metalness'),
        reflectivity: writable(layer, 'reflectivity'),
      },
    })),
  }));

  return {
    objectCount: objects.length,
    important: important.map((object) => ({
      name: object.name,
      id: object.id,
      type: object.type,
      parentName: object.parent?.name,
      parentId: object.parent?.id,
      visible: object.visible,
    })),
    faceCount: faces.length,
    materialDetails,
    mutationReport: probe.mutationReport,
    controlReport: probe.controlReport,
    canAccess: {
      plane: Boolean(plane),
      light: Boolean(light),
      faces: faces.length > 0,
      objectVisibility: faces.length > 0 && writable(faces[0], 'visible', faces[0]?.visible),
      objectTransform:
        faces.length > 0 &&
        Boolean(faces[0].position) &&
        writable(faces[0].position, 'x', faces[0].position.x),
      faceColor: faces.length > 0 && writable(faces[0], 'color', '#17191D'),
      planeVisibility: Boolean(plane) && writable(plane, 'visible', plane.visible),
      planeColor: Boolean(plane) && writable(plane, 'color', plane.color || '#17191D'),
      lightColor: Boolean(light) && writable(light, 'color', light.color || '#ffffff'),
      lightIntensity: Boolean(light) && writable(light, 'intensity', light.intensity),
    },
  };
});

const finalPath = path.join(outDir, 'proai-spline-runtime-graphite-face.png');
await page.screenshot({ path: finalPath, fullPage: false });

await browser.close();

const report = {
  url: 'http://127.0.0.1:5177/',
  sceneUrl: 'https://prod.spline.design/Ps48UZeUPJBLxiy2/scene.splinecode',
  screenshots: {
    before: beforePath,
    afterInteraction: afterInteractionPath,
    final: finalPath,
  },
  consoleLines,
  pageErrors,
  detailed,
};

const reportPath = path.join(outDir, 'probe-report.json');
await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
console.log(reportPath);
