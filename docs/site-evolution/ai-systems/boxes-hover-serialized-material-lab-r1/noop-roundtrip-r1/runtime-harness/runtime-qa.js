import { Application } from './runtime.standalone.webgpu-2.0.27.js';

const GOLDEN_SHA = 'c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798';
const GOLDEN_URL = '../../../../../../owner-preview/assets/3d/boxes-hover/public-original-inline-scene-payload.bin';
const NOOP_URL = '../boxes-hover-noop-roundtrip-r1.bin';
const status = document.querySelector('[data-status]');
const singleMode = new URLSearchParams(location.search).get('single');

async function sha256(bytes) {
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function color(value) {
  if (!value || typeof value !== 'object') return null;
  const result = {};
  for (const key of ['r', 'g', 'b', 'a']) if (typeof value[key] === 'number') result[key] = value[key];
  return Object.keys(result).length ? result : null;
}

function layerSummary(layer) {
  return {
    type: layer?.type ?? null,
    category: layer?.category ?? null,
    colorA: color(layer?.colorA),
    colorB: color(layer?.colorB),
    metalness: layer?.metalness ?? null,
    roughness: layer?.roughness ?? null,
    reflectivity: layer?.reflectivity ?? null,
    ior: layer?.ior ?? null,
    thickness: layer?.thickness ?? null,
  };
}

function runtimeSnapshot(app) {
  const boxes = app.findObjectByName('Boxes');
  const objects = app.getAllObjects?.() || [];
  const cubes = objects.filter((object) => object.name === 'Cube' && object.type === 'Mesh' && object.parentUuid !== boxes?.uuid);
  const materialIds = new WeakMap();
  let nextId = 1;
  const cubeSummaries = cubes.slice().sort((a, b) => a.uuid.localeCompare(b.uuid)).map((cube) => {
    let materialId = null;
    if (cube.material && typeof cube.material === 'object') {
      materialId = materialIds.get(cube.material);
      if (!materialId) { materialId = `material-${nextId++}`; materialIds.set(cube.material, materialId); }
    }
    const layers = Array.isArray(cube.material?.layers) ? cube.material.layers.map(layerSummary) : [];
    return { uuid: cube.uuid, parentUuid: cube.parentUuid, materialId, layers };
  });
  return {
    runtime: '@splinetool/runtime@2.0.27',
    boxes: boxes ? { name: boxes.name, type: boxes.type, uuid: boxes.uuid } : null,
    cubeCount: cubeSummaries.length,
    materialIdentityCount: new Set(cubeSummaries.map((cube) => cube.materialId).filter(Boolean)).size,
    stableCubeLayerSignatures: cubeSummaries.map((cube) => JSON.stringify(cube.layers)).sort(),
    cubes: cubeSummaries,
  };
}

async function loadScene(kind, canvas, url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${kind} payload HTTP ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const sha = await sha256(bytes);
  const app = new Application(canvas, { htmlContentMode: 'inline' });
  await app.start(Array.from(bytes));
  const snapshot = runtimeSnapshot(app);
  return { kind, url, bytes: bytes.byteLength, sha256: sha, snapshot };
}

async function main() {
  if (singleMode === 'golden' || singleMode === 'noop') {
    document.body.dataset.single = singleMode;
    for (const section of document.querySelectorAll('section')) {
      if (section.querySelector(`[data-scene="${singleMode}"]`)) continue;
      section.remove();
    }
    const canvas = document.querySelector(`[data-scene="${singleMode}"]`);
    const url = singleMode === 'golden' ? GOLDEN_URL : NOOP_URL;
    const result = await loadScene(singleMode, canvas, url);
    window.__boxesHoverNoopRuntimeQA = { mode: singleMode, result };
    document.documentElement.dataset.runtimeQa = 'pass';
    status.textContent = `PASS · official runtime loaded ${singleMode} payload\n${result.bytes} bytes · SHA ${result.sha256}\nBoxes ${result.snapshot.boxes?.uuid} · Cubes ${result.snapshot.cubeCount} · material identities ${result.snapshot.materialIdentityCount}\nRead-only: no material, geometry, camera, event, or hover mutation.`;
    return;
  }
  const results = await Promise.all([
    loadScene('golden', document.querySelector('[data-scene="golden"]'), GOLDEN_URL),
    loadScene('noop', document.querySelector('[data-scene="noop"]'), NOOP_URL),
  ]);
  const [golden, noop] = results;
  const comparison = {
    payloadShaEqual: golden.sha256 === noop.sha256 && golden.sha256 === GOLDEN_SHA,
    payloadBytesEqual: golden.bytes === noop.bytes,
    runtimeTopologyEqual: JSON.stringify({
      boxes: golden.snapshot.boxes,
      cubeCount: golden.snapshot.cubeCount,
      materialIdentityCount: golden.snapshot.materialIdentityCount,
      stableCubeLayerSignatures: golden.snapshot.stableCubeLayerSignatures,
    }) === JSON.stringify({
      boxes: noop.snapshot.boxes,
      cubeCount: noop.snapshot.cubeCount,
      materialIdentityCount: noop.snapshot.materialIdentityCount,
      stableCubeLayerSignatures: noop.snapshot.stableCubeLayerSignatures,
    }),
    boxesIdentityEqual: golden.snapshot.boxes?.uuid === noop.snapshot.boxes?.uuid,
    cubeCountEqual: golden.snapshot.cubeCount === noop.snapshot.cubeCount,
    materialIdentityCountEqual: golden.snapshot.materialIdentityCount === noop.snapshot.materialIdentityCount,
  };
  const report = { golden, noop, comparison };
  window.__boxesHoverNoopRuntimeQA = report;
  const dump = document.createElement('script');
  dump.id = 'boxes-hover-noop-runtime-qa';
  dump.type = 'application/json';
  dump.textContent = JSON.stringify(report);
  document.body.appendChild(dump);
  document.documentElement.dataset.runtimeQa = Object.values(comparison).every(Boolean) ? 'pass' : 'fail';
  status.textContent = `${document.documentElement.dataset.runtimeQa.toUpperCase()} · official runtime loaded both payloads\nGolden ${golden.bytes} bytes · no-op ${noop.bytes} bytes · SHA equal ${comparison.payloadShaEqual}\nBoxes ${golden.snapshot.boxes?.uuid} · Cubes ${golden.snapshot.cubeCount} · material identities ${golden.snapshot.materialIdentityCount}\nStable runtime topology equal ${comparison.runtimeTopologyEqual}\nRead-only: no material, geometry, camera, event, or hover mutation.`;
}

main().catch((error) => {
  document.documentElement.dataset.runtimeQa = 'error';
  status.textContent = `ERROR · ${error.message}`;
  console.error('[Boxes Hover no-op runtime QA]', error);
});
