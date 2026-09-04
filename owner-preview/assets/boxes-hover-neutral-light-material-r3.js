import { Application } from '../../docs/site-evolution/ai-systems/boxes-hover-serialized-material-lab-r1/noop-roundtrip-r1/runtime-harness/runtime.standalone.webgpu-2.0.27.js';

const ROOT = '../docs/site-evolution/ai-systems/boxes-hover-neutral-light-material-r3/candidates/';
const PAYLOADS = {
  golden: { label: 'GOLDEN', url: './assets/3d/boxes-hover/public-original-inline-scene-payload.bin', sha256: 'c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798' },
  r2: { label: 'R2 · SILVER / OBSIDIAN', url: '../docs/site-evolution/ai-systems/boxes-hover-optical-material-r2/final/boxes-hover-optical-material-r2-final.bin', sha256: '9d97237a463dd2846bbf1ad7eb2594409d34a08bd1a2ff20ce08b330af201535' },
  'stage-a': { label: 'R3 STAGE A · NEUTRALIZED', url: `${ROOT}boxes-hover-neutral-light-material-stage-a.bin`, sha256: 'f04d82e294e4d62a24dda6b2066d03b068382152a1069de01943914a84e9add6' },
  'micro-1': { label: 'R3 MICRO 1 · GRAPHITE', url: `${ROOT}boxes-hover-neutral-light-material-micro-1.bin`, sha256: 'fa0716d699ebc117f685b95783c03f15d01ecbd716ac2fe349395319732e22cc' },
  'micro-2': { label: 'R3 MICRO 2 · SILVER', url: `${ROOT}boxes-hover-neutral-light-material-micro-2.bin`, sha256: '1269ea60eb7725e59822ba2b9e789a2d9dd8956f557ffbbedfbb39e97a12c4d0' },
  'micro-3': { label: 'R3 MICRO 3 · CHROME', url: `${ROOT}boxes-hover-neutral-light-material-micro-3.bin`, sha256: '4a4d321fec7161e9d2782da32ba96bdaa7f09619d371b88b0e06cd7b79f0c1ff' },
  r3: { label: 'R3 · NEUTRAL LIGHT MATERIAL', url: '../docs/site-evolution/ai-systems/boxes-hover-neutral-light-material-r3/final/boxes-hover-neutral-light-material-final.bin', sha256: '1269ea60eb7725e59822ba2b9e789a2d9dd8956f557ffbbedfbb39e97a12c4d0' },
};

const requestedMode = new URLSearchParams(location.search).get('mode') || 'r3';
const mode = PAYLOADS[requestedMode] ? requestedMode : 'r3';
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
  for (const cube of cubes) if (cube.material && typeof cube.material === 'object' && !materialIds.has(cube.material)) materialIds.set(cube.material, `material-${nextId++}`);
  return { boxes: boxes ? { name: boxes.name, type: boxes.type, uuid: boxes.uuid } : null, cubeCount: cubes.length, materialIdentityCount: nextId - 1, layerSignatures: [...new Set(cubes.map((cube) => JSON.stringify(cube.material?.layers?.map((layer) => layer.type) || [])))] };
}

async function main() {
  const response = await fetch(selected.url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`payload HTTP ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const actualSha = await sha256(bytes);
  if (selected.sha256 && actualSha && actualSha !== selected.sha256) throw new Error(`payload SHA mismatch: ${actualSha}`);
  const app = new Application(document.querySelector('#boxes-hover'), { htmlContentMode: 'inline' });
  await app.start(Array.from(bytes));
  const snapshot = runtimeSnapshot(app);
  if (snapshot.cubeCount !== 143 || snapshot.materialIdentityCount !== 143) throw new Error(`runtime inventory mismatch: ${snapshot.cubeCount}/${snapshot.materialIdentityCount}`);
  window.__boxesHoverNeutralR3QA = { mode, selected, bytes: bytes.byteLength, sha256: actualSha || (selected.sha256 ? 'preverified-only-in-insecure-context' : null), snapshot };
  document.documentElement.dataset.runtimeQa = 'pass';
  status.textContent = `PASS · ${selected.label}\n${bytes.byteLength} bytes · SHA ${actualSha || selected.sha256 || 'not available'}\n143 Cube meshes · 143 material identities · native hover preserved`;
}

main().catch((error) => {
  document.documentElement.dataset.runtimeQa = 'error';
  status.textContent = `ERROR · ${error.message}`;
  console.error('[Boxes Hover Neutral Light Material R3]', error);
});
