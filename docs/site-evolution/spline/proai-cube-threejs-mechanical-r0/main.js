import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const GLB_URL = new URL('./rubik_39_s_cube_animation.glb', import.meta.url).href;
const canvas = document.getElementById('cube-canvas');
const status = document.getElementById('runtime-status');
const captureMode = new URLSearchParams(location.search).has('capture');
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const MOTION = Object.freeze({
  turnDurationMs: 1650,
  resetDurationMs: 1750,
  holdAfterTurnMs: 1600,
  idleBetweenCyclesMs: 1800,
  easing: [0.42, 0, 0.16, 1],
  orbitDampingFactor: 0.068,
  orbitRotateSpeed: 0.55,
  orbitZoomSpeed: 0.55,
});

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance',
  preserveDrawingBuffer: captureMode,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.setClearColor(0x07090c, 1);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07090c);
const pmrem = new THREE.PMREMGenerator(renderer);
const roomEnvironment = new RoomEnvironment();
scene.environment = pmrem.fromScene(roomEnvironment, 0.035).texture;
roomEnvironment.dispose();
pmrem.dispose();

const camera = new THREE.PerspectiveCamera(31, 1, 0.01, 1000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = MOTION.orbitDampingFactor;
controls.enablePan = false;
controls.rotateSpeed = MOTION.orbitRotateSpeed;
controls.zoomSpeed = MOTION.orbitZoomSpeed;
controls.minPolarAngle = Math.PI * 0.15;
controls.maxPolarAngle = Math.PI * 0.85;

scene.add(new THREE.HemisphereLight(0xe8edf4, 0x11141a, 1.35));
const key = new THREE.DirectionalLight(0xffffff, 3.8);
key.position.set(5.4, 7.5, 6.2);
scene.add(key);
const fill = new THREE.DirectionalLight(0xb8c0cc, 1.7);
fill.position.set(-5.8, 1.8, 3.1);
scene.add(fill);
const rim = new THREE.DirectionalLight(0xffffff, 1.25);
rim.position.set(1.8, 3.6, -6.5);
scene.add(rim);

const faceMaterial = new THREE.MeshStandardMaterial({
  color: 0x3b4049,
  metalness: 0.82,
  roughness: 0.235,
  envMapIntensity: 1.0,
});
const coreMaterial = new THREE.MeshStandardMaterial({
  color: 0x11141a,
  metalness: 0.56,
  roughness: 0.39,
  envMapIntensity: 0.72,
});

let cubeRoot;
let sceneOne;
let cubieParents = [];
let rightSliceMembers = [];
let sliceOriginalStates = [];
let slicePivot = null;
let rightClusterMeanX = 0;
let cubeCenterLocal = new THREE.Vector3();
let motionState = 'loading';
let motionBusy = false;
let manualOrbitUntil = 0;
let autoLoopEnabled = !captureMode && !prefersReducedMotion;
let lastForwardTelemetry = [];
let lastResetTelemetry = [];
let lastEndpointErrorRad = null;

const api = {
  ready: false,
  motionState,
  motionConfig: MOTION,
  hierarchy: null,
  mechanics: null,
  lastForwardTelemetry,
  lastResetTelemetry,
  playSlice,
  resetSlice,
  runRepeatabilityTest,
  getDiagnostics,
  captureFrame() {
    controls.update();
    renderer.render(scene, camera);
    return canvas.toDataURL('image/png');
  },
  stopAutoLoop() { autoLoopEnabled = false; },
  startAutoLoop() {
    if (!prefersReducedMotion) {
      autoLoopEnabled = true;
      void autonomousLoop();
    }
  },
};
window.__PROAI_CUBE_R0 = api;

function setMotionState(next) {
  motionState = next;
  api.motionState = next;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cubicBezierEase(x) {
  const [x1, y1, x2, y2] = MOTION.easing;
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t) => ((ay * t + by) * t + cy) * t;
  const sampleDX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  let t = x;
  for (let i = 0; i < 7; i += 1) {
    const error = sampleX(t) - x;
    const slope = sampleDX(t);
    if (Math.abs(error) < 1e-7 || Math.abs(slope) < 1e-7) break;
    t = THREE.MathUtils.clamp(t - error / slope, 0, 1);
  }
  let low = 0;
  let high = 1;
  for (let i = 0; i < 10 && Math.abs(sampleX(t) - x) > 1e-6; i += 1) {
    if (sampleX(t) < x) low = t;
    else high = t;
    t = (low + high) * 0.5;
  }
  return sampleY(t);
}

function directChildSignature(group) {
  return group.children
    .map((child) => child.name?.replace(/_[0-9]+$/, ''))
    .filter(Boolean)
    .sort();
}

function hierarchyCheck() {
  const expected = ['Cube', 'arancio', 'bianco', 'blu', 'giallo', 'rosso', 'verde'].sort();
  const groups = {};
  let pass = true;
  for (const name of ['right', 'center', 'left']) {
    const group = cubeRoot.getObjectByName(name);
    const children = group ? directChildSignature(group) : [];
    const exactChildren = JSON.stringify(children) === JSON.stringify(expected);
    groups[name] = {
      found: Boolean(group),
      type: group?.type ?? null,
      directChildren: children,
      exactChildren,
      parent: group?.parent?.name || '(unnamed)',
    };
    pass &&= Boolean(group) && exactChildren;
  }
  return { pass, groups };
}

function classifyReviewMaterial(mesh) {
  if (!mesh.geometry) return faceMaterial;
  mesh.geometry.computeBoundingBox();
  const size = new THREE.Vector3();
  mesh.geometry.boundingBox?.getSize(size);
  const dimensions = [Math.abs(size.x), Math.abs(size.y), Math.abs(size.z)].sort((a, b) => a - b);
  const isPlate = dimensions[0] < dimensions[2] * 0.12;
  return isPlate ? faceMaterial : coreMaterial;
}

function findCubieParents() {
  const found = [];
  cubeRoot.traverse((object) => {
    if (object.children.length === 7 && object.children.every((child) => child.isMesh)) found.push(object);
  });
  return found;
}

function positionInSceneOne(object) {
  sceneOne.updateWorldMatrix(true, false);
  object.updateWorldMatrix(true, false);
  const world = object.getWorldPosition(new THREE.Vector3());
  return sceneOne.worldToLocal(world.clone());
}

function clusterByAxis(items, axis = 'x', maxGap = 32) {
  const axisIndex = { x: 0, y: 1, z: 2 }[axis];
  const sorted = items
    .map((object) => ({ object, position: positionInSceneOne(object) }))
    .sort((a, b) => a.position.getComponent(axisIndex) - b.position.getComponent(axisIndex));
  const clusters = [];
  for (const item of sorted) {
    const value = item.position.getComponent(axisIndex);
    const current = clusters.at(-1);
    if (!current || value - current.max > maxGap) {
      clusters.push({ items: [item], min: value, max: value, mean: value });
      continue;
    }
    current.items.push(item);
    current.min = Math.min(current.min, value);
    current.max = Math.max(current.max, value);
    current.mean = current.items.reduce((sum, entry) => sum + entry.position.getComponent(axisIndex), 0) / current.items.length;
  }
  return clusters;
}

function uniqueRightSpatialPositions(items) {
  const keys = new Set();
  for (const item of items) {
    const p = positionInSceneOne(item.object ?? item);
    keys.add(`${Math.round(p.y * 10) / 10}|${Math.round(p.z * 10) / 10}`);
  }
  return [...keys];
}

function prepareSliceMembers() {
  cubieParents = findCubieParents();
  const xClusters = clusterByAxis(cubieParents, 'x');
  if (xClusters.length !== 3) throw new Error(`Expected 3 X clusters, got ${xClusters.length}`);
  const rightCluster = xClusters.at(-1);
  rightSliceMembers = rightCluster.items.map((entry) => entry.object);
  rightClusterMeanX = rightCluster.mean;

  const positions = cubieParents.map(positionInSceneOne);
  const min = new THREE.Vector3(Infinity, Infinity, Infinity);
  const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
  positions.forEach((p) => { min.min(p); max.max(p); });
  cubeCenterLocal.copy(min).add(max).multiplyScalar(0.5);

  const uniqueSpatialPositions = uniqueRightSpatialPositions(rightCluster.items);
  if (uniqueSpatialPositions.length !== 9) {
    throw new Error(`Right slice must resolve to 9 spatial cubies; got ${uniqueSpatialPositions.length}`);
  }

  sliceOriginalStates = rightSliceMembers.map((object) => ({
    object,
    parent: object.parent,
    position: object.position.clone(),
    quaternion: object.quaternion.clone(),
    scale: object.scale.clone(),
  }));

  api.mechanics = {
    axis: 'X',
    xClusterMeans: xClusters.map((cluster) => cluster.mean),
    xClusterObjectCounts: xClusters.map((cluster) => cluster.items.length),
    rightLayerObjectCount: rightSliceMembers.length,
    rightLayerUniqueSpatialCubies: uniqueSpatialPositions.length,
    rightLayerSpatialKeys: uniqueSpatialPositions,
    rightClusterMeanX,
  };
}

function createSlicePivot() {
  if (slicePivot) return;
  cubeRoot.updateMatrixWorld(true);
  sceneOne.updateMatrixWorld(true);
  slicePivot = new THREE.Group();
  slicePivot.name = 'R0_TEMP_RIGHT_SLICE_PIVOT';
  slicePivot.position.set(rightClusterMeanX, cubeCenterLocal.y, cubeCenterLocal.z);
  sceneOne.add(slicePivot);
  sceneOne.updateMatrixWorld(true);
  rightSliceMembers.forEach((object) => slicePivot.attach(object));
  slicePivot.updateMatrixWorld(true);
}

function destroySlicePivotAndRestoreExact() {
  if (!slicePivot) return;
  slicePivot.quaternion.identity();
  slicePivot.updateMatrixWorld(true);
  for (const state of sliceOriginalStates) {
    state.parent.attach(state.object);
    state.object.position.copy(state.position);
    state.object.quaternion.copy(state.quaternion);
    state.object.scale.copy(state.scale);
    state.object.updateMatrix();
  }
  sceneOne.remove(slicePivot);
  slicePivot = null;
  cubeRoot.updateMatrixWorld(true);
}

function animatePivotQuaternion(from, to, durationMs, telemetryTarget) {
  return new Promise((resolve) => {
    const started = performance.now();
    telemetryTarget.length = 0;
    let previousAngle = from.angleTo(new THREE.Quaternion());
    function tick(now) {
      const linear = THREE.MathUtils.clamp((now - started) / durationMs, 0, 1);
      const eased = cubicBezierEase(linear);
      slicePivot.quaternion.slerpQuaternions(from, to, eased);
      slicePivot.updateMatrixWorld(true);
      const identity = new THREE.Quaternion();
      const angle = slicePivot.quaternion.angleTo(identity);
      telemetryTarget.push({ tMs: now - started, linear, eased, angle, deltaAngle: angle - previousAngle });
      previousAngle = angle;
      if (linear < 1) {
        requestAnimationFrame(tick);
      } else {
        slicePivot.quaternion.copy(to);
        slicePivot.updateMatrixWorld(true);
        resolve();
      }
    }
    requestAnimationFrame(tick);
  });
}

async function playSlice({ direction = 1, durationScale = 1 } = {}) {
  if (!api.ready || motionBusy || motionState !== 'rest') return false;
  motionBusy = true;
  setMotionState('turning');
  createSlicePivot();
  const target = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), direction * Math.PI / 2);
  const from = new THREE.Quaternion();
  lastForwardTelemetry = [];
  api.lastForwardTelemetry = lastForwardTelemetry;
  await animatePivotQuaternion(from, target, Math.max(1, MOTION.turnDurationMs * durationScale), lastForwardTelemetry);
  lastEndpointErrorRad = slicePivot.quaternion.angleTo(target);
  setMotionState('turned');
  motionBusy = false;
  return true;
}

async function resetSlice({ direction = 1, durationScale = 1 } = {}) {
  if (!api.ready || motionBusy || motionState !== 'turned' || !slicePivot) return false;
  motionBusy = true;
  setMotionState('resetting');
  const from = slicePivot.quaternion.clone();
  const identity = new THREE.Quaternion();
  lastResetTelemetry = [];
  api.lastResetTelemetry = lastResetTelemetry;
  await animatePivotQuaternion(from, identity, Math.max(1, MOTION.resetDurationMs * durationScale), lastResetTelemetry);
  slicePivot.quaternion.identity();
  destroySlicePivotAndRestoreExact();
  setMotionState('rest');
  motionBusy = false;
  return true;
}

function snapshotSliceLocals() {
  return sliceOriginalStates.map(({ object }) => ({
    position: object.position.toArray(),
    quaternion: object.quaternion.toArray(),
    scale: object.scale.toArray(),
  }));
}

function maxSnapshotError(reference, current) {
  let maxPosition = 0;
  let maxQuaternion = 0;
  let maxScale = 0;
  reference.forEach((entry, index) => {
    const now = current[index];
    maxPosition = Math.max(maxPosition, ...entry.position.map((value, i) => Math.abs(value - now.position[i])));
    const qa = new THREE.Quaternion(...entry.quaternion);
    const qb = new THREE.Quaternion(...now.quaternion);
    maxQuaternion = Math.max(maxQuaternion, qa.angleTo(qb));
    maxScale = Math.max(maxScale, ...entry.scale.map((value, i) => Math.abs(value - now.scale[i])));
  });
  return { maxPosition, maxQuaternionRad: maxQuaternion, maxScale };
}

async function runRepeatabilityTest(cycles = 6, durationScale = 0.08) {
  api.stopAutoLoop();
  if (motionState === 'turned') await resetSlice({ durationScale });
  const reference = snapshotSliceLocals();
  for (let i = 0; i < cycles; i += 1) {
    await playSlice({ direction: 1, durationScale });
    await sleep(Math.max(12, 80 * durationScale));
    await resetSlice({ direction: 1, durationScale });
  }
  const current = snapshotSliceLocals();
  const error = maxSnapshotError(reference, current);
  return {
    cycles,
    durationScale,
    ...error,
    pass: error.maxPosition < 1e-7 && error.maxQuaternionRad < 1e-7 && error.maxScale < 1e-9,
  };
}

function telemetrySummary(samples) {
  if (!samples?.length) return null;
  let monotonic = true;
  let maxAbsStep = 0;
  let overshoot = false;
  for (let i = 1; i < samples.length; i += 1) {
    if (samples[i].eased + 1e-8 < samples[i - 1].eased) monotonic = false;
    maxAbsStep = Math.max(maxAbsStep, Math.abs(samples[i].deltaAngle));
    if (samples[i].eased < -1e-8 || samples[i].eased > 1 + 1e-8) overshoot = true;
  }
  const firstStep = samples.length > 1 ? Math.abs(samples[1].angle - samples[0].angle) : null;
  const lastStep = samples.length > 1 ? Math.abs(samples.at(-1).angle - samples.at(-2).angle) : null;
  return { sampleCount: samples.length, monotonic, overshoot, maxAbsStepRad: maxAbsStep, firstStepRad: firstStep, lastStepRad: lastStep };
}

function getDiagnostics() {
  return {
    ready: api.ready,
    motionState,
    hierarchy: api.hierarchy,
    mechanics: api.mechanics,
    motionConfig: MOTION,
    endpointErrorRad: lastEndpointErrorRad,
    forwardTelemetry: telemetrySummary(lastForwardTelemetry),
    resetTelemetry: telemetrySummary(lastResetTelemetry),
    renderer: {
      webgl2: renderer.capabilities.isWebGL2,
      pixelRatio: renderer.getPixelRatio(),
    },
  };
}

function frameCamera() {
  cubeRoot.updateMatrixWorld(true);
  const box = new THREE.Box3().makeEmpty();
  cubieParents.forEach((object) => box.expandByObject(object, true));
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const center = sphere.center;
  const radius = sphere.radius;
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const distance = radius / Math.sin(fov / 2) * 1.08;
  const direction = new THREE.Vector3(1.22, 0.88, 1.34).normalize();
  camera.position.copy(center).addScaledVector(direction, distance);
  camera.near = Math.max(0.01, distance - radius * 3.0);
  camera.far = distance + radius * 5.0;
  camera.updateProjectionMatrix();
  controls.target.copy(center);
  controls.minDistance = distance * 0.74;
  controls.maxDistance = distance * 1.35;
  controls.update();
}

async function autonomousLoop() {
  if (api._autoLoopRunning) return;
  api._autoLoopRunning = true;
  while (autoLoopEnabled) {
    await sleep(MOTION.idleBetweenCyclesMs);
    if (!autoLoopEnabled) break;
    if (performance.now() < manualOrbitUntil || motionState !== 'rest') continue;
    await playSlice({ direction: 1 });
    await sleep(MOTION.holdAfterTurnMs);
    if (!autoLoopEnabled) break;
    await resetSlice({ direction: 1 });
  }
  api._autoLoopRunning = false;
}

controls.addEventListener('start', () => {
  manualOrbitUntil = performance.now() + 5000;
});
controls.addEventListener('end', () => {
  manualOrbitUntil = performance.now() + 2600;
});

function resize() {
  const rect = canvas.getBoundingClientRect();
  renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
  camera.aspect = Math.max(0.1, rect.width / Math.max(1, rect.height));
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize, { passive: true });

function render() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();

const loader = new GLTFLoader();
loader.load(
  GLB_URL,
  (gltf) => {
    cubeRoot = gltf.scene;
    scene.add(cubeRoot);
    cubeRoot.updateMatrixWorld(true);
    sceneOne = cubeRoot.getObjectByName('right')?.parent || cubeRoot.getObjectByName('Scene 1') || cubeRoot;

    cubeRoot.traverse((object) => {
      if (object.name === 'Plane' || object.isLight) object.visible = false;
      if (object.isMesh && object.name !== 'Plane') {
        object.material = classifyReviewMaterial(object);
        object.castShadow = false;
        object.receiveShadow = false;
      }
    });

    api.hierarchy = hierarchyCheck();
    if (!api.hierarchy.pass) throw new Error('Named right/center/left hierarchy verification failed');
    prepareSliceMembers();
    frameCamera();
    resize();

    api.ready = true;
    setMotionState('rest');
    status.textContent = 'Three.js GLB loaded. Hierarchy verified. Mechanical R0 ready.';
    if (autoLoopEnabled) void autonomousLoop();
  },
  undefined,
  (error) => {
    console.error('GLB load failed', error);
    setMotionState('error');
    status.textContent = 'GLB load failed';
  },
);
