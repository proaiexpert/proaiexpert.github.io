import { Application } from '../../docs/site-evolution/ai-systems/boxes-hover-serialized-material-lab-r1/noop-roundtrip-r1/runtime-harness/runtime.standalone.webgpu-2.0.27.js';

const PAYLOADS = {
  golden: {
    label: 'GOLDEN',
    url: './assets/3d/boxes-hover/public-original-inline-scene-payload.bin',
    sha256: 'c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798',
  },
  'stage-a': {
    label: 'STAGE A · PHYSICAL ONLY',
    url: '../docs/site-evolution/ai-systems/boxes-hover-black-chrome-material-r1/preview/assets/boxes-hover-black-chrome-stage-a-physical.bin',
    sha256: 'cc34bb1706496553b0f2d9dd83c8cfedfe998e04e9b31d9e3b02ab90d17d4787',
  },
  'black-chrome': {
    label: 'BLACK CHROME · STAGE B',
    url: '../docs/site-evolution/ai-systems/boxes-hover-black-chrome-material-r1/preview/assets/boxes-hover-black-chrome-r1.bin',
    sha256: '44b7218470e40d925d4cf6e827fe4d17869f86a4a35a28fdd439280ec25549d9',
  },
  'black-chrome-micro-1': {
    label: 'BLACK CHROME · MICRO 1',
    url: '../docs/site-evolution/ai-systems/boxes-hover-black-chrome-material-r1/preview/assets/boxes-hover-black-chrome-micro-1.bin',
    sha256: '4123f68ac0c9bf676f90f791f289c6ef2da14d26d8490d5887a50a649a33df72',
  },
  'black-chrome-micro-2': {
    label: 'BLACK CHROME · MICRO 2',
    url: '../docs/site-evolution/ai-systems/boxes-hover-black-chrome-material-r1/preview/assets/boxes-hover-black-chrome-micro-2.bin',
    sha256: 'aa79825f6f168dc2c75aa81f3e5cff6c52c1d882b10c1b1a5094e9a23b5cf8c8',
  },
  'black-chrome-micro-3': {
    label: 'BLACK CHROME · MICRO 3',
    url: '../docs/site-evolution/ai-systems/boxes-hover-black-chrome-material-r1/preview/assets/boxes-hover-black-chrome-micro-3.bin',
    sha256: 'f077b2c58e72b75e24ee6abc9afdf69eb2501d6c06467bf8e67bb2b7a1c333f1',
  },
};

const mode = new URLSearchParams(location.search).get('mode') || 'black-chrome';
const selected = PAYLOADS[mode] || PAYLOADS['black-chrome'];
const status = document.querySelector('[data-status]');
for (const link of document.querySelectorAll('[data-mode]')) {
  if (link.dataset.mode === mode) link.setAttribute('aria-current', 'page');
}

async function sha256(bytes) {
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function runtimeSnapshot(app) {
  const boxes = app.findObjectByName('Boxes');
  const objects = app.getAllObjects?.() || [];
  const cubes = objects.filter((object) => object.name === 'Cube' && object.type === 'Mesh');
  const materialIds = new WeakMap();
  let nextId = 1;
  const cubeSummaries = cubes.map((cube) => {
    let materialId = null;
    if (cube.material && typeof cube.material === 'object') {
      materialId = materialIds.get(cube.material);
      if (!materialId) { materialId = `material-${nextId++}`; materialIds.set(cube.material, materialId); }
    }
    return { uuid: cube.uuid, materialId, layers: cube.material?.layers?.map((layer) => layer.type) || [] };
  });
  return {
    boxes: boxes ? { name: boxes.name, type: boxes.type, uuid: boxes.uuid } : null,
    cubeCount: cubeSummaries.length,
    materialIdentityCount: new Set(cubeSummaries.map((cube) => cube.materialId).filter(Boolean)).size,
    layerSignatures: [...new Set(cubeSummaries.map((cube) => JSON.stringify(cube.layers)))],
  };
}

async function load() {
  const response = await fetch(selected.url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`payload HTTP ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const actualSha = await sha256(bytes);
  if (actualSha !== selected.sha256) throw new Error(`payload SHA mismatch: ${actualSha}`);
  const app = new Application(document.querySelector('#boxes-hover'), { htmlContentMode: 'inline' });
  await app.start(Array.from(bytes));
  const snapshot = runtimeSnapshot(app);
  if (snapshot.cubeCount !== 143 || snapshot.materialIdentityCount !== 143) {
    throw new Error(`runtime inventory mismatch: cubes=${snapshot.cubeCount}, materials=${snapshot.materialIdentityCount}`);
  }
  window.__boxesHoverBlackChromeQA = { mode, selected, bytes: bytes.byteLength, sha256: actualSha, snapshot };
  document.documentElement.dataset.runtimeQa = 'pass';
  status.textContent = `PASS · ${selected.label}\n${bytes.byteLength} bytes · SHA ${actualSha}\n143 Cube meshes · 143 material identities · native hover preserved`;
}

load().catch((error) => {
  document.documentElement.dataset.runtimeQa = 'error';
  status.textContent = `ERROR · ${error.message}`;
  console.error('[Boxes Hover Black Chrome R1]', error);
});
