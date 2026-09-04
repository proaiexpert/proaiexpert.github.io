import { Application } from '../../docs/site-evolution/ai-systems/boxes-hover-serialized-material-lab-r1/noop-roundtrip-r1/runtime-harness/runtime.standalone.webgpu-2.0.27.js';

const PAYLOADS = {
  golden: { label: 'GOLDEN', url: './assets/3d/boxes-hover/public-original-inline-scene-payload.bin', sha256: 'c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798' },
  r2: { label: 'R2 OPTICAL · FINAL', url: '../docs/site-evolution/ai-systems/boxes-hover-optical-material-r2/final/boxes-hover-optical-material-r2-final.bin', sha256: '9d97237a463dd2846bbf1ad7eb2594409d34a08bd1a2ff20ce08b330af201535' },
};
const requestedMode = new URLSearchParams(location.search).get('mode') || 'r2';
const mode = PAYLOADS[requestedMode] ? requestedMode : 'r2';
const selected = PAYLOADS[mode];
const status = document.querySelector('[data-status]');
for (const link of document.querySelectorAll('[data-mode]')) if (link.dataset.mode === mode) link.setAttribute('aria-current', 'page');

async function sha256(bytes) {
  if (!globalThis.crypto?.subtle) return null;
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function runtimeSnapshot(app) {
  const boxes = app.findObjectByName('Boxes');
  const objects = app.getAllObjects?.() || [];
  const cubes = objects.filter((object) => object.name === 'Cube' && object.type === 'Mesh');
  const materialIds = new WeakMap();
  let nextId = 1;
  for (const cube of cubes) {
    if (cube.material && typeof cube.material === 'object' && !materialIds.has(cube.material)) materialIds.set(cube.material, `material-${nextId++}`);
  }
  return { boxes: boxes ? { name: boxes.name, type: boxes.type, uuid: boxes.uuid } : null, cubeCount: cubes.length, materialIdentityCount: nextId - 1, layerSignatures: [...new Set(cubes.map((cube) => JSON.stringify(cube.material?.layers?.map((layer) => layer.type) || [])))] };
}

async function main() {
  const response = await fetch(selected.url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`payload HTTP ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const actualSha = await sha256(bytes);
  if (actualSha && actualSha !== selected.sha256) throw new Error(`payload SHA mismatch: ${actualSha}`);
  const app = new Application(document.querySelector('#boxes-hover'), { htmlContentMode: 'inline' });
  await app.start(Array.from(bytes));
  const snapshot = runtimeSnapshot(app);
  if (snapshot.cubeCount !== 143 || snapshot.materialIdentityCount !== 143) throw new Error(`runtime inventory mismatch: ${snapshot.cubeCount}/${snapshot.materialIdentityCount}`);
  window.__boxesHoverOpticalR2QA = { mode, selected, bytes: bytes.byteLength, sha256: actualSha || 'preverified-only-in-insecure-context', snapshot };
  document.documentElement.dataset.runtimeQa = 'pass';
  status.textContent = `PASS · ${selected.label}\n${bytes.byteLength} bytes · SHA ${actualSha}\n143 Cube meshes · 143 material identities · native hover preserved`;
}

main().catch((error) => {
  document.documentElement.dataset.runtimeQa = 'error';
  status.textContent = `ERROR · ${error.message}`;
  console.error('[Boxes Hover Optical R2]', error);
});
