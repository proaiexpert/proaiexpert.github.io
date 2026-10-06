import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

const BOOT_AT = performance.now();
const MODULE_COUNT = 30;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const params = new URLSearchParams(location.search);
const CAMERA_OPTION = (params.get('camera') || 'A').toUpperCase() === 'B' ? 'B' : 'A';

const canvas = document.getElementById('clearance-canvas');
const stateLabel = document.getElementById('state-label');
const metricRenderer = document.getElementById('metric-renderer');
const metricDpr = document.getElementById('metric-dpr');
const metricFps = document.getElementById('metric-fps');
const metricFirst = document.getElementById('metric-first');
const metricLatency = document.getElementById('metric-latency');
const metricRaf = document.getElementById('metric-raf');
const metricRestCollisions = document.getElementById('metric-rest-collisions');
const metricThresholdCollisions = document.getElementById('metric-threshold-collisions');
const silhouetteToggle = document.getElementById('silhouette-toggle');
const cleanToggle = document.getElementById('clean-toggle');
const modeButtons = [...document.querySelectorAll('[data-mode]')];

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const coarsePointer = matchMedia('(any-pointer: coarse)');
const isClean = () => document.documentElement.classList.contains('clean-view');
const compact = () => innerWidth <= 920 || coarsePointer.matches;

cleanToggle?.addEventListener('click', () => {
  location.href = isClean() ? location.pathname : location.pathname + '?clean=1';
});

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050607);
scene.fog = new THREE.FogExp2(0x050607, 0.019);

const camera = new THREE.PerspectiveCamera(29, 1, 0.1, 50);
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance'
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.78;

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
pmrem.dispose();
RectAreaLightUniformsLib.init();

const assembly = new THREE.Group();
assembly.rotation.set(-0.035, -0.075, 0.010);
scene.add(assembly);

const seam = {
  normal: new THREE.Vector3(0.70, -0.12, 0.70).normalize(),
  focal: new THREE.Vector3(0.18, 0.02, 1.02),
  field(p) {
    return p.dot(this.normal) + 0.10 * p.y * p.z - 0.04;
  }
};

function smooth01(value) {
  const x = THREE.MathUtils.clamp(value, 0, 1);
  return x * x * (3 - 2 * x);
}

function createModuleGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.39, -0.24);
  shape.lineTo(0.22, -0.27);
  shape.lineTo(0.42, -0.11);
  shape.lineTo(0.37, 0.19);
  shape.lineTo(0.10, 0.29);
  shape.lineTo(-0.35, 0.21);
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.24,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.035,
    bevelSegments: 2,
    curveSegments: 1,
    steps: 1
  });
  geometry.translate(0, 0, -0.12);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}

const moduleGeometry = createModuleGeometry();

const materials = {
  graphite: new THREE.MeshPhysicalMaterial({
    color: 0x121416,
    metalness: 0.39,
    roughness: 0.39,
    clearcoat: 0.08,
    clearcoatRoughness: 0.52
  }),
  gunmetal: new THREE.MeshPhysicalMaterial({
    color: 0x23272a,
    metalness: 0.65,
    roughness: 0.34,
    clearcoat: 0.06,
    clearcoatRoughness: 0.45
  }),
  silver: new THREE.MeshPhysicalMaterial({
    color: 0x555a5e,
    metalness: 0.72,
    roughness: 0.37,
    clearcoat: 0.05,
    clearcoatRoughness: 0.44
  }),
  authority: new THREE.MeshPhysicalMaterial({
    color: 0x978970,
    metalness: 0.78,
    roughness: 0.33,
    clearcoat: 0.07,
    clearcoatRoughness: 0.40
  }),
  bearing: new THREE.MeshPhysicalMaterial({
    color: 0x181b1d,
    metalness: 0.58,
    roughness: 0.42
  }),
  silhouette: new THREE.MeshStandardMaterial({
    color: 0x55585b,
    metalness: 0.0,
    roughness: 0.88
  })
};

const shellRadii = { x: 1.65, y: 1.38, z: 1.44 };

function shellPoint(index) {
  const t = (index + 0.5) / MODULE_COUNT;
  const y = 1 - 2 * t;
  const radial = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = index * GOLDEN_ANGLE + 0.24;

  const p = new THREE.Vector3(
    Math.cos(theta) * radial * shellRadii.x,
    y * shellRadii.y,
    Math.sin(theta) * radial * shellRadii.z
  );

  // Designed asymmetry only: shoulder compression, crown correction, rear taper.
  if (p.x < -0.55) p.x += 0.035;
  if (p.y > 0.72) p.y -= 0.018;
  if (p.z < -0.65) p.z += 0.025;

  // Very small deterministic deviation; reduced sharply from R1.1.
  p.x += 0.007 * Math.sin(index * 1.7);
  p.y += 0.006 * Math.cos(index * 1.3);
  p.z += 0.006 * Math.sin(index * 0.9 + 0.4);
  return p;
}

function surfaceNormal(p) {
  return new THREE.Vector3(
    p.x / (shellRadii.x * shellRadii.x),
    p.y / (shellRadii.y * shellRadii.y),
    p.z / (shellRadii.z * shellRadii.z)
  ).normalize();
}

function orientationFor(normal, roll = 0) {
  const referenceUp = Math.abs(normal.y) > 0.93
    ? new THREE.Vector3(1, 0, 0)
    : new THREE.Vector3(0, 1, 0);
  const xAxis = new THREE.Vector3().crossVectors(referenceUp, normal).normalize();
  const yAxis = new THREE.Vector3().crossVectors(normal, xAxis).normalize();
  const basis = new THREE.Matrix4().makeBasis(xAxis, yAxis, normal);
  const q = new THREE.Quaternion().setFromRotationMatrix(basis);
  if (roll) q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), roll));
  return q;
}

const modules = [];
for (let i = 0; i < MODULE_COUNT; i++) {
  const shell = shellPoint(i);
  const normal = surfaceNormal(shell);
  const seamValue = seam.field(shell);
  const side = seamValue >= 0 ? 1 : -1;
  const seamDistance = Math.abs(seamValue);
  const focalDistance = shell.distanceTo(seam.focal);

  const frontness = smooth01((shell.z + 0.45) / 1.75);
  const seamNearness = smooth01(1 - seamDistance / 1.05);
  const focalNearness = smooth01(1 - focalDistance / 2.50);
  const focalWeight = seamNearness * focalNearness * (0.48 + 0.52 * frontness);

  // R1.2 cohesion: much smaller global seam relaxation at REST and restrained
  // threshold travel. Ordinary joints stay quiet; focal clearance remains largest.
  const rest = shell.clone()
    .addScaledVector(seam.normal, side * 0.095 * focalWeight);

  const tight = shell.clone()
    .addScaledVector(seam.normal, side * 0.040 * focalWeight)
    .addScaledVector(normal, -0.018 * focalWeight);

  const baseQ = orientationFor(normal, 0.018 * Math.sin(i * 0.73));
  const alignmentDelta = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    -side * 0.065 * focalWeight
  );
  const tightQ = baseQ.clone().multiply(alignmentDelta);

  const scale = 0.82
    + 0.025 * smooth01((shell.z + shellRadii.z) / (shellRadii.z * 2))
    + 0.008 * Math.cos(i * 1.17);
  const scaleVector = new THREE.Vector3(scale, scale * 0.97, 0.99 + scale * 0.03);

  modules.push({
    index: i,
    shell,
    normal,
    side,
    focalWeight,
    rest,
    tight,
    baseQ,
    tightQ,
    scale: scaleVector,
    influence: 0,
    targetInfluence: 0,
    family: 'graphite',
    group: null,
    instanceIndex: -1
  });
}

// R1.2 hierarchy: 80% graphite, 16.7% gunmetal, 3.3% silver.
// Assignment is structural, not random/modulo.
const structuralOrder = [...modules].sort((a, b) => b.focalWeight - a.focalWeight);
structuralOrder.slice(0, 1).forEach(m => { m.family = 'silver'; });
structuralOrder.slice(1, 6).forEach(m => { m.family = 'gunmetal'; });

const familyLists = {
  graphite: modules.filter(m => m.family === 'graphite'),
  gunmetal: modules.filter(m => m.family === 'gunmetal'),
  silver: modules.filter(m => m.family === 'silver')
};

const instanceGroups = {};
for (const family of ['graphite', 'gunmetal', 'silver']) {
  const list = familyLists[family];
  const mesh = new THREE.InstancedMesh(moduleGeometry, materials[family], list.length);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  list.forEach((module, instanceIndex) => {
    module.group = mesh;
    module.instanceIndex = instanceIndex;
  });
  instanceGroups[family] = mesh;
  assembly.add(mesh);
}

const adjacency = modules.map(module => {
  return modules
    .filter(other => other !== module)
    .map(other => ({ index: other.index, distance: module.rest.distanceTo(other.rest) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 4)
    .map(item => item.index);
});

// Immutable authority datum: slightly broader bearing face, but warm visible area
// remains restrained and is discovered through the focal joint.
const datumGroup = new THREE.Group();
const datumGeometry = new THREE.BoxGeometry(0.095, 0.66, 0.055);
const bearingGeometry = new THREE.BoxGeometry(0.22, 0.80, 0.095);
const datum = new THREE.Mesh(datumGeometry, materials.authority);
const bearing = new THREE.Mesh(bearingGeometry, materials.bearing);
bearing.position.z = -0.050;
datumGroup.add(bearing, datum);

const datumNormal = seam.normal.clone();
const datumTangent = new THREE.Vector3(0, 1, 0)
  .sub(datumNormal.clone().multiplyScalar(datumNormal.y))
  .normalize();
const datumSide = new THREE.Vector3().crossVectors(datumTangent, datumNormal).normalize();
const datumBasis = new THREE.Matrix4().makeBasis(datumSide, datumTangent, datumNormal);
datumGroup.quaternion.setFromRotationMatrix(datumBasis);
datumGroup.position.copy(seam.focal)
  .addScaledVector(seam.normal, -0.115)
  .addScaledVector(new THREE.Vector3(0, 0, 1), -0.105);
datumGroup.scale.setScalar(0.82);
assembly.add(datumGroup);

// Invisible volumetric interaction shell.
const interactionShell = new THREE.Mesh(
  new THREE.SphereGeometry(1.92, 18, 14),
  new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
);
interactionShell.scale.set(1, 0.84, 0.87);
assembly.add(interactionShell);

// Grounding option B: deep void + faint local grounding shadow, no visible stage edge.
const groundShadow = new THREE.Mesh(
  new THREE.CircleGeometry(1.58, 64),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.34,
    depthWrite: false
  })
);
groundShadow.rotation.x = -Math.PI / 2;
groundShadow.scale.set(1.28, 0.74, 1);
groundShadow.position.set(0.08, -1.62, 0.10);
scene.add(groundShadow);

// Broader, more continuous product lighting.
const key = new THREE.RectAreaLight(0xe3e0d9, 4.7, 6.8, 5.6);
key.position.set(-3.8, 4.4, 5.9);
key.lookAt(0, 0.05, 0);
scene.add(key);

const edge = new THREE.RectAreaLight(0x858b91, 2.2, 4.4, 5.6);
edge.position.set(5.0, 1.1, 2.0);
edge.lookAt(0.1, 0.0, 0);
scene.add(edge);

const topLight = new THREE.RectAreaLight(0xc4c1ba, 1.35, 5.0, 2.6);
topLight.position.set(-0.4, 5.2, -0.5);
topLight.lookAt(0, 0, 0);
scene.add(topLight);

const rim = new THREE.DirectionalLight(0x7d8389, 0.46);
rim.position.set(-2.8, 0.7, -5.0);
scene.add(rim);

let silhouetteActive = false;
function applyMaterialMode() {
  for (const family of ['graphite', 'gunmetal', 'silver']) {
    instanceGroups[family].material = silhouetteActive ? materials.silhouette : materials[family];
  }
  datum.material = silhouetteActive ? materials.silhouette : materials.authority;
  bearing.material = silhouetteActive ? materials.silhouette : materials.bearing;
  silhouetteToggle?.setAttribute('data-active', String(silhouetteActive));
  schedule();
}
silhouetteToggle?.addEventListener('click', () => {
  silhouetteActive = !silhouetteActive;
  applyMaterialMode();
});

const matrix = new THREE.Matrix4();
const tempQ = new THREE.Quaternion();
const tempPos = new THREE.Vector3();

function modulePose(module, state = 'current') {
  if (state === 'rest') return { pos: module.rest, q: module.baseQ };
  if (state === 'tight') return { pos: module.tight, q: module.tightQ };
  const u = module.influence;
  tempPos.copy(module.rest).lerp(module.tight, u);
  tempQ.copy(module.baseQ).slerp(module.tightQ, u);
  return { pos: tempPos, q: tempQ };
}

function applyModuleMatrices() {
  const dirtyGroups = new Set();
  for (const module of modules) {
    const u = module.influence;
    const pos = module.rest.clone().lerp(module.tight, u);
    tempQ.copy(module.baseQ).slerp(module.tightQ, u);
    matrix.compose(pos, tempQ, module.scale);
    module.group.setMatrixAt(module.instanceIndex, matrix);
    dirtyGroups.add(module.group);
  }
  dirtyGroups.forEach(group => { group.instanceMatrix.needsUpdate = true; });
}
applyModuleMatrices();

// Explicit oriented-box collision audit for REST and THRESHOLD.
// It uses the module geometry's actual local bounding-box extents and full pose.
const localBounds = moduleGeometry.boundingBox;
const localHalf = localBounds.getSize(new THREE.Vector3()).multiplyScalar(0.5);

function obbData(module, state) {
  const pose = state === 'rest'
    ? { pos: module.rest, q: module.baseQ }
    : { pos: module.tight, q: module.tightQ };
  const rot = new THREE.Matrix3().setFromMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(pose.q));
  const axes = [
    new THREE.Vector3(rot.elements[0], rot.elements[1], rot.elements[2]).normalize(),
    new THREE.Vector3(rot.elements[3], rot.elements[4], rot.elements[5]).normalize(),
    new THREE.Vector3(rot.elements[6], rot.elements[7], rot.elements[8]).normalize()
  ];
  const half = new THREE.Vector3(
    localHalf.x * module.scale.x,
    localHalf.y * module.scale.y,
    localHalf.z * module.scale.z
  );
  return { center: pose.pos, axes, half };
}

function intersectsObb(a, b) {
  const EPS = 1e-6;
  const A = a.axes;
  const B = b.axes;
  const ea = [a.half.x, a.half.y, a.half.z];
  const eb = [b.half.x, b.half.y, b.half.z];
  const R = Array.from({ length: 3 }, () => [0, 0, 0]);
  const AR = Array.from({ length: 3 }, () => [0, 0, 0]);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      R[i][j] = A[i].dot(B[j]);
      AR[i][j] = Math.abs(R[i][j]) + EPS;
    }
  }
  const delta = b.center.clone().sub(a.center);
  const t = [delta.dot(A[0]), delta.dot(A[1]), delta.dot(A[2])];

  for (let i = 0; i < 3; i++) {
    const ra = ea[i];
    const rb = eb[0] * AR[i][0] + eb[1] * AR[i][1] + eb[2] * AR[i][2];
    if (Math.abs(t[i]) > ra + rb) return false;
  }

  for (let j = 0; j < 3; j++) {
    const ra = ea[0] * AR[0][j] + ea[1] * AR[1][j] + ea[2] * AR[2][j];
    const rb = eb[j];
    const proj = Math.abs(t[0] * R[0][j] + t[1] * R[1][j] + t[2] * R[2][j]);
    if (proj > ra + rb) return false;
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const i1 = (i + 1) % 3;
      const i2 = (i + 2) % 3;
      const j1 = (j + 1) % 3;
      const j2 = (j + 2) % 3;
      const ra = ea[i1] * AR[i2][j] + ea[i2] * AR[i1][j];
      const rb = eb[j1] * AR[i][j2] + eb[j2] * AR[i][j1];
      const proj = Math.abs(t[i2] * R[i1][j] - t[i1] * R[i2][j]);
      if (proj > ra + rb) return false;
    }
  }
  return true;
}

function auditCollisions(state) {
  const boxes = modules.map(module => obbData(module, state));
  const collisions = [];
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      if (intersectsObb(boxes[i], boxes[j])) collisions.push([i, j]);
    }
  }
  return collisions;
}

const restCollisions = auditCollisions('rest');
const thresholdCollisions = auditCollisions('tight');
if (metricRestCollisions) metricRestCollisions.textContent = String(restCollisions.length);
if (metricThresholdCollisions) metricThresholdCollisions.textContent = String(thresholdCollisions.length);

const raycaster = new THREE.Raycaster();
const pointerNdc = new THREE.Vector2();
const pointerLocal = seam.focal.clone();
let pointerActive = false;
let pointerMovedAt = 0;
let inputStamp = null;
let manualMode = 'rest';
let autoPhase = 'idle';
let autoStartedAt = 0;
let autoComplete = false;
let rafId = 0;
let paused = document.hidden;
let lastFrameAt = performance.now();
let firstRendered = false;
let sampleStartedAt = 0;
let sampleFrames = 0;
let sampleDone = false;

function configureCamera() {
  if (compact()) {
    if (innerWidth > innerHeight) {
      camera.position.set(3.05, 1.44, 7.65);
      assembly.scale.setScalar(0.94);
    } else {
      camera.position.set(3.00, 1.72, 8.10);
      assembly.scale.setScalar(0.93);
    }
  } else if (CAMERA_OPTION === 'B') {
    camera.position.set(2.78, 1.24, 7.72);
    assembly.scale.setScalar(isClean() ? 1.05 : 0.99);
  } else {
    // Camera A selected: slightly more distant 3/4 product view.
    camera.position.set(3.42, 1.82, 8.28);
    assembly.scale.setScalar(isClean() ? 1.08 : 1.01);
  }
  camera.lookAt(0.01, -0.02, 0.04);
}

function setRendererSize() {
  const rect = canvas.getBoundingClientRect();
  const dprCap = compact() ? 1.35 : 1.60;
  const dpr = Math.min(devicePixelRatio || 1, dprCap);
  renderer.setPixelRatio(dpr);
  renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
  camera.aspect = Math.max(1, rect.width) / Math.max(1, rect.height);
  camera.updateProjectionMatrix();
  configureCamera();
  metricDpr.textContent = dpr.toFixed(2);
  metricRenderer.textContent = renderer.capabilities.isWebGL2 ? 'WebGL 2' : 'WebGL';
  schedule();
}
setRendererSize();

function setActiveButton(mode) {
  modeButtons.forEach(button => {
    button.dataset.active = String(button.dataset.mode === mode);
  });
}

function pointerToLocal(event) {
  const rect = canvas.getBoundingClientRect();
  pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointerNdc, camera);
  const hit = raycaster.intersectObject(interactionShell, false)[0];
  if (!hit) return false;
  pointerLocal.copy(assembly.worldToLocal(hit.point.clone()));
  pointerMovedAt = performance.now();
  inputStamp = pointerMovedAt;
  return true;
}

function onPointer(event) {
  if (reducedMotion.matches) return;
  if (!pointerToLocal(event)) return;
  manualMode = null;
  pointerActive = true;
  autoPhase = 'cancelled';
  autoComplete = true;
  setActiveButton(null);
  schedule();
}

canvas.addEventListener('pointerenter', onPointer);
canvas.addEventListener('pointermove', onPointer);
canvas.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'mouse') canvas.setPointerCapture?.(event.pointerId);
  onPointer(event);
});
canvas.addEventListener('pointerup', event => {
  if (event.pointerType !== 'mouse') {
    pointerActive = false;
    pointerMovedAt = performance.now();
    schedule();
  }
});
canvas.addEventListener('pointerleave', () => {
  if (manualMode === null) {
    pointerActive = false;
    pointerMovedAt = performance.now();
    schedule();
  }
});

function setManualMode(mode) {
  manualMode = mode;
  autoPhase = 'cancelled';
  autoComplete = true;
  if (mode === 'rest') {
    pointerActive = false;
  } else {
    pointerActive = true;
    pointerLocal.copy(seam.focal);
    pointerMovedAt = performance.now();
  }
  setActiveButton(mode);
  if (reducedMotion.matches) applyReducedMotionPose();
  schedule();
}
modeButtons.forEach(button => button.addEventListener('click', () => setManualMode(button.dataset.mode)));

function computeTargets() {
  const direct = new Float32Array(MODULE_COUNT);

  if (manualMode === 'threshold') {
    for (const module of modules) {
      direct[module.index] = smooth01(module.focalWeight / 0.52);
    }
  } else if (pointerActive) {
    const radius = manualMode === 'pressure' ? 1.46 : 1.34;
    const pressureScale = manualMode === 'pressure'
      ? 0.70
      : (autoPhase === 'hold' ? 0.92 : 1);

    for (const module of modules) {
      const distance = module.rest.distanceTo(pointerLocal);
      const local = smooth01(1 - distance / radius);
      const structural = 0.28 + 0.72 * module.focalWeight;
      direct[module.index] = local * structural * pressureScale;
    }
  }

  for (const module of modules) {
    const neighbors = adjacency[module.index];
    let neighborSum = 0;
    for (const index of neighbors) neighborSum += direct[index];
    const propagated = neighbors.length ? (neighborSum / neighbors.length) * 0.30 : 0;
    const structuralCap = 0.50 + 0.50 * module.focalWeight;
    module.targetInfluence = THREE.MathUtils.clamp(
      (direct[module.index] + propagated) * structuralCap,
      0,
      1
    );
  }
}

function applyReducedMotionPose() {
  for (const module of modules) {
    if (manualMode === 'threshold') module.influence = smooth01(module.focalWeight / 0.52);
    else if (manualMode === 'pressure') module.influence = module.focalWeight * 0.52;
    else module.influence = 0;
  }
  applyModuleMatrices();
  updateStateLabel();
}

function updateMobileOneShot(now) {
  if (reducedMotion.matches || !compact() || autoComplete || autoPhase === 'cancelled' || manualMode !== 'rest') return;
  if (!autoStartedAt) autoStartedAt = now;
  const elapsed = now - autoStartedAt;

  if (elapsed < 800) {
    autoPhase = 'idle';
    pointerActive = false;
    return;
  }
  if (elapsed < 2250) {
    autoPhase = 'press';
    pointerActive = true;
    pointerLocal.copy(seam.focal);
    pointerMovedAt = autoStartedAt + 860;
    return;
  }
  if (elapsed < 3150) {
    autoPhase = 'hold';
    pointerActive = true;
    pointerLocal.copy(seam.focal);
    return;
  }
  if (elapsed < 4550) {
    autoPhase = 'release';
    pointerActive = false;
    return;
  }
  autoComplete = true;
  autoPhase = 'done';
  manualMode = 'rest';
  pointerActive = false;
  setActiveButton('rest');
}

function updateStateLabel(now = performance.now()) {
  const ranked = modules.map(m => m.influence).sort((a, b) => b - a);
  const topInfluence = ranked.slice(0, 7).reduce((sum, value) => sum + value, 0) / 7;
  const stableInput = now - pointerMovedAt > 460;
  let state = 'REST';

  if (manualMode === 'threshold') state = 'STILLNESS';
  else if (pointerActive && stableInput && topInfluence > 0.38) state = 'STILLNESS';
  else if (pointerActive && topInfluence > 0.10) state = 'REGISTRATION';
  else if (pointerActive) state = 'PRESSURE';
  else if (topInfluence > 0.020) state = 'RETURN';

  stateLabel.textContent = state;
}

function update(now, dt) {
  updateMobileOneShot(now);
  computeTargets();

  let moving = false;
  const attack = manualMode === 'threshold' ? 0.42 : 0.55;
  const release = 1.00;

  for (const module of modules) {
    const target = module.targetInfluence;
    const tau = target > module.influence ? attack : release;
    const alpha = 1 - Math.exp(-dt / Math.max(0.001, tau));
    const next = THREE.MathUtils.lerp(module.influence, target, alpha);
    if (Math.abs(next - target) < 0.0010) {
      module.influence = target;
    } else {
      module.influence = next;
      moving = true;
    }
  }

  applyModuleMatrices();
  updateStateLabel(now);
  return moving;
}

function renderFrame(now) {
  rafId = 0;
  if (paused) return;

  const dt = Math.min(0.05, Math.max(0.001, (now - lastFrameAt) / 1000));
  lastFrameAt = now;
  const moving = reducedMotion.matches ? false : update(now, dt);

  renderer.render(scene, camera);

  if (!firstRendered) {
    firstRendered = true;
    metricFirst.textContent = `${Math.round(performance.now() - BOOT_AT)} ms`;
    sampleStartedAt = now;
    sampleFrames = 0;
  }

  if (!sampleDone) {
    sampleFrames++;
    const duration = now - sampleStartedAt;
    if (duration >= 1600) {
      metricFps.textContent = `${(sampleFrames / (duration / 1000)).toFixed(1)} fps`;
      sampleDone = true;
    }
  }

  if (inputStamp !== null) {
    metricLatency.textContent = `${Math.max(0, performance.now() - inputStamp).toFixed(1)} ms`;
    inputStamp = null;
  }

  const autoRunning = compact() && !autoComplete && autoPhase !== 'cancelled' && !reducedMotion.matches;
  const needsAnotherFrame = moving || !sampleDone || autoRunning;

  if (needsAnotherFrame) {
    schedule();
  } else {
    metricRaf.textContent = 'IDLE';
  }
}

function schedule() {
  if (paused || rafId) return;
  metricRaf.textContent = 'ACTIVE';
  rafId = requestAnimationFrame(renderFrame);
}

document.addEventListener('visibilitychange', () => {
  paused = document.hidden;
  if (paused && rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
    metricRaf.textContent = 'PAUSED';
  } else if (!paused) {
    lastFrameAt = performance.now();
    schedule();
  }
});

addEventListener('resize', setRendererSize, { passive: true });

reducedMotion.addEventListener?.('change', () => {
  if (reducedMotion.matches) {
    autoComplete = true;
    pointerActive = false;
    manualMode = 'rest';
    setActiveButton('rest');
    applyReducedMotionPose();
    renderer.render(scene, camera);
    metricRaf.textContent = 'IDLE';
  } else {
    autoComplete = false;
    autoStartedAt = 0;
    schedule();
  }
});

if (reducedMotion.matches) {
  autoComplete = true;
  applyReducedMotionPose();
}
schedule();
