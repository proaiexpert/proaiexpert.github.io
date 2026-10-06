import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

const BOOT_AT = performance.now();
const params = new URLSearchParams(location.search);
const MODULE_COUNT = params.get('layout') === '24' ? 24 : 20;
const CAMERA_OPTION = (params.get('camera') || 'B').toUpperCase() === 'A' ? 'A' : 'B';
const JOINT_OPTION = (params.get('joint') || 'A').toUpperCase() === 'B' ? 'B' : 'A';
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

const canvas = document.getElementById('clearance-canvas');
const stateLabel = document.getElementById('state-label');
const layoutLabel = document.getElementById('layout-label');
const metricModules = document.getElementById('metric-modules');
const metricRenderer = document.getElementById('metric-renderer');
const metricDpr = document.getElementById('metric-dpr');
const metricFps = document.getElementById('metric-fps');
const metricFirst = document.getElementById('metric-first');
const metricLatency = document.getElementById('metric-latency');
const metricRaf = document.getElementById('metric-raf');
const metricRestCollisions = document.getElementById('metric-rest-collisions');
const metricPressureCollisions = document.getElementById('metric-pressure-collisions');
const metricThresholdCollisions = document.getElementById('metric-threshold-collisions');
const silhouetteToggle = document.getElementById('silhouette-toggle');
const chassisToggle = document.getElementById('chassis-toggle');
const seamToggle = document.getElementById('seam-toggle');
const modeButtons = [...document.querySelectorAll('[data-mode]')];

if (layoutLabel) layoutLabel.textContent = MODULE_COUNT === 20 ? '20 · SELECTED' : '24 · STUDY';
if (metricModules) metricModules.textContent = String(MODULE_COUNT);

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const coarsePointer = matchMedia('(any-pointer: coarse)');
const compact = () => innerWidth <= 920 || coarsePointer.matches;
const isClean = () => document.documentElement.classList.contains('clean-view');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050607);
scene.fog = new THREE.FogExp2(0x050607, 0.017);

const camera = new THREE.PerspectiveCamera(29, 1, 0.1, 50);
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance'
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.76;

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
pmrem.dispose();
RectAreaLightUniformsLib.init();

const assembly = new THREE.Group();
assembly.rotation.set(-0.028, -0.052, 0.008);
scene.add(assembly);

const shellRadii = new THREE.Vector3(1.58, 1.32, 1.38);
const chassisRadii = new THREE.Vector3(1.54, 1.27, 1.34);

const JOINTS = {
  A: {
    label: 'offset diagonal structural seam',
    normal: new THREE.Vector3(0.72, -0.10, 0.69).normalize(),
    focal: new THREE.Vector3(0.14, 0.02, 0.94),
    field(p) {
      return p.dot(this.normal) - 0.03;
    }
  },
  B: {
    label: 'slightly curved faceted seam',
    normal: new THREE.Vector3(0.72, -0.10, 0.69).normalize(),
    focal: new THREE.Vector3(0.14, 0.02, 0.94),
    field(p) {
      return p.dot(this.normal) + 0.07 * p.y * p.z - 0.03;
    }
  }
};
const joint = JOINTS[JOINT_OPTION];

function smooth01(value) {
  const x = THREE.MathUtils.clamp(value, 0, 1);
  return x * x * (3 - 2 * x);
}

function createModuleGeometry() {
  const w = MODULE_COUNT === 20 ? 0.76 : 0.68;
  const h = MODULE_COUNT === 20 ? 0.54 : 0.48;
  const x = w / 2;
  const y = h / 2;

  // Repeatable manufactured panel: controlled shoulders, no geological polygon.
  const shape = new THREE.Shape();
  shape.moveTo(-x * 0.88, -y);
  shape.lineTo(x * 0.78, -y);
  shape.quadraticCurveTo(x, -y * 0.88, x, -y * 0.62);
  shape.lineTo(x, y * 0.55);
  shape.quadraticCurveTo(x * 0.94, y * 0.88, x * 0.72, y);
  shape.lineTo(-x * 0.82, y);
  shape.quadraticCurveTo(-x, y * 0.82, -x, y * 0.56);
  shape.lineTo(-x, -y * 0.60);
  shape.quadraticCurveTo(-x * 0.98, -y * 0.86, -x * 0.88, -y);
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.30,
    bevelEnabled: true,
    bevelThickness: 0.024,
    bevelSize: 0.024,
    bevelSegments: 2,
    curveSegments: 2,
    steps: 1
  });
  geometry.translate(0, 0, -0.15);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}

function createChassisGeometry() {
  const geometry = new THREE.IcosahedronGeometry(1, 2);
  const position = geometry.attributes.position;
  const p = new THREE.Vector3();

  for (let i = 0; i < position.count; i++) {
    p.fromBufferAttribute(position, i).normalize();

    let x = p.x * chassisRadii.x;
    let y = p.y * chassisRadii.y;
    let z = p.z * chassisRadii.z;

    // Authored industrial asymmetry, not a perfect mathematical sphere.
    if (x < -0.45) x += 0.020;
    if (y > 0.55) y -= 0.015;
    if (z < -0.45) z += 0.020;
    x *= 1 + 0.018 * Math.max(0, y);
    z *= 1 - 0.014 * Math.max(0, -x);

    position.setXYZ(i, x, y, z);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

const moduleGeometry = createModuleGeometry();
const chassisGeometry = createChassisGeometry();

const materials = {
  graphite: new THREE.MeshPhysicalMaterial({
    color: 0x111315,
    metalness: 0.34,
    roughness: 0.43,
    clearcoat: 0.07,
    clearcoatRoughness: 0.56
  }),
  gunmetal: new THREE.MeshPhysicalMaterial({
    color: 0x222629,
    metalness: 0.61,
    roughness: 0.34,
    clearcoat: 0.05,
    clearcoatRoughness: 0.47
  }),
  silver: new THREE.MeshPhysicalMaterial({
    color: 0x50555a,
    metalness: 0.72,
    roughness: 0.38,
    clearcoat: 0.04,
    clearcoatRoughness: 0.48
  }),
  chassis: new THREE.MeshPhysicalMaterial({
    color: 0x0b0d0f,
    metalness: 0.24,
    roughness: 0.61,
    clearcoat: 0.02,
    clearcoatRoughness: 0.72,
    flatShading: true
  }),
  authority: new THREE.MeshPhysicalMaterial({
    color: 0x94866f,
    metalness: 0.78,
    roughness: 0.34,
    clearcoat: 0.05,
    clearcoatRoughness: 0.43
  }),
  bearing: new THREE.MeshPhysicalMaterial({
    color: 0x171a1c,
    metalness: 0.49,
    roughness: 0.46
  }),
  silhouette: new THREE.MeshStandardMaterial({
    color: 0x4c5053,
    metalness: 0,
    roughness: 0.92
  }),
  chassisDebug: new THREE.MeshStandardMaterial({
    color: 0x555b60,
    metalness: 0,
    roughness: 0.76,
    wireframe: false
  }),
  seamDebug: new THREE.MeshBasicMaterial({
    color: 0x8f969d,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide,
    depthWrite: false
  })
};

const chassis = new THREE.Mesh(chassisGeometry, materials.chassis);
assembly.add(chassis);

function shellPoint(index) {
  const t = (index + 0.5) / MODULE_COUNT;
  const yUnit = 1 - 2 * t;
  const radial = Math.sqrt(Math.max(0, 1 - yUnit * yUnit));
  const theta = index * GOLDEN_ANGLE + 0.18;

  const p = new THREE.Vector3(
    Math.cos(theta) * radial * shellRadii.x,
    yUnit * shellRadii.y,
    Math.sin(theta) * radial * shellRadii.z
  );

  if (p.x < -0.52) p.x += 0.025;
  if (p.y > 0.70) p.y -= 0.015;
  if (p.z < -0.60) p.z += 0.020;

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

  if (roll) {
    q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), roll));
  }
  return q;
}

const modules = [];
for (let i = 0; i < MODULE_COUNT; i++) {
  const shell = shellPoint(i);
  const normal = surfaceNormal(shell);
  const seamValue = joint.field(shell);
  const side = seamValue >= 0 ? 1 : -1;
  const seamDistance = Math.abs(seamValue);
  const focalDistance = shell.distanceTo(joint.focal);

  const frontness = smooth01((shell.z + 0.40) / 1.65);
  const seamNearness = smooth01(1 - seamDistance / 1.08);
  const focalNearness = smooth01(1 - focalDistance / 2.55);
  const focalWeight = seamNearness * focalNearness * (0.52 + 0.48 * frontness);

  // Modules are physically seated into the static chassis.
  const rest = shell.clone()
    .addScaledVector(normal, -0.070)
    .addScaledVector(joint.normal, side * 0.055 * focalWeight);

  // Threshold is more seated/aligned, never more open.
  const tight = shell.clone()
    .addScaledVector(normal, -(0.088 + 0.010 * focalWeight))
    .addScaledVector(joint.normal, side * 0.026 * focalWeight);

  const baseQ = orientationFor(normal, 0.008 * Math.sin(i * 0.73));
  const alignmentDelta = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    -side * 0.042 * focalWeight
  );
  const tightQ = baseQ.clone().multiply(alignmentDelta);

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
    scale: new THREE.Vector3(1, 1, 1),
    family: 'graphite',
    sizeFamily: 'primary',
    influence: 0,
    targetInfluence: 0,
    group: null,
    instanceIndex: -1
  });
}

// Two standardized size families. Secondary panels are selected by curvature need.
const verticalOrder = [...modules].sort((a, b) => Math.abs(b.shell.y) - Math.abs(a.shell.y));
const secondaryCount = MODULE_COUNT === 20 ? 4 : 5;
const secondarySet = new Set(verticalOrder.slice(0, secondaryCount).map(m => m.index));

const structuralOrder = [...modules].sort((a, b) => b.focalWeight - a.focalWeight);
const silverModule = structuralOrder[0];
secondarySet.add(silverModule.index);

// Keep exactly the intended secondary-family count after forcing the silver shoulder smaller.
while (secondarySet.size > secondaryCount) {
  const removable = [...secondarySet].find(index => index !== silverModule.index && !verticalOrder.slice(0, secondaryCount - 1).some(m => m.index === index));
  if (removable === undefined) break;
  secondarySet.delete(removable);
}
while (secondarySet.size < secondaryCount) {
  const candidate = verticalOrder.find(m => !secondarySet.has(m.index) && m.index !== silverModule.index);
  if (!candidate) break;
  secondarySet.add(candidate.index);
}

for (const module of modules) {
  if (secondarySet.has(module.index)) {
    module.sizeFamily = 'secondary';
    module.scale.set(0.88, 0.88, 0.96);
  }
}

silverModule.family = 'silver';
const gunmetalCount = MODULE_COUNT === 20 ? 2 : 3;
structuralOrder.slice(1, 1 + gunmetalCount).forEach(m => { m.family = 'gunmetal'; });

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

// Static structural bearing + immutable authority datum, physically mounted into chassis.
const datumGroup = new THREE.Group();
const bearing = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.78, 0.11), materials.bearing);
const datum = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.58, 0.065), materials.authority);
bearing.position.z = -0.055;
datumGroup.add(bearing, datum);

const datumNormal = joint.normal.clone();
const datumTangent = new THREE.Vector3(0, 1, 0)
  .sub(datumNormal.clone().multiplyScalar(datumNormal.y))
  .normalize();
const datumSide = new THREE.Vector3().crossVectors(datumTangent, datumNormal).normalize();
const datumBasis = new THREE.Matrix4().makeBasis(datumSide, datumTangent, datumNormal);
datumGroup.quaternion.setFromRotationMatrix(datumBasis);
datumGroup.position.copy(joint.focal)
  .addScaledVector(joint.normal, -0.095)
  .addScaledVector(new THREE.Vector3(0, 0, 1), -0.080);
datumGroup.scale.setScalar(0.80);
assembly.add(datumGroup);

// Lab-only seam plane. Hidden by default and never shown in CLEAN.
const seamDebugPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.1), materials.seamDebug);
seamDebugPlane.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), joint.normal);
seamDebugPlane.position.copy(joint.focal).addScaledVector(joint.normal, -0.05);
seamDebugPlane.visible = false;
assembly.add(seamDebugPlane);

const interactionShell = new THREE.Mesh(
  new THREE.SphereGeometry(1.92, 18, 14),
  new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
);
interactionShell.scale.set(1, 0.84, 0.87);
assembly.add(interactionShell);

// Deep-void grounding only; no visible floor edge.
const groundShadow = new THREE.Mesh(
  new THREE.CircleGeometry(1.50, 64),
  new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.31, depthWrite: false })
);
groundShadow.rotation.x = -Math.PI / 2;
groundShadow.scale.set(1.30, 0.70, 1);
groundShadow.position.set(0.06, -1.58, 0.08);
scene.add(groundShadow);

// One broad key, subtle upper fill, controlled opposite rim, soft grounding bounce.
const key = new THREE.RectAreaLight(0xe2dfd8, 4.4, 7.4, 6.2);
key.position.set(-3.7, 4.2, 5.9);
key.lookAt(0, 0.02, 0);
scene.add(key);

const upperFill = new THREE.RectAreaLight(0xbab8b2, 1.10, 5.2, 3.0);
upperFill.position.set(0.2, 5.0, 0.1);
upperFill.lookAt(0, 0, 0);
scene.add(upperFill);

const oppositeRim = new THREE.RectAreaLight(0x858b91, 1.65, 4.0, 4.8);
oppositeRim.position.set(4.8, 0.9, 1.8);
oppositeRim.lookAt(0.1, 0.0, 0);
scene.add(oppositeRim);

const bounce = new THREE.DirectionalLight(0x6d7278, 0.26);
bounce.position.set(-1.5, -2.8, 3.0);
scene.add(bounce);

let debugMode = 'normal';

function setDebugMode(mode) {
  debugMode = debugMode === mode ? 'normal' : mode;

  silhouetteToggle?.setAttribute('data-active', String(debugMode === 'silhouette'));
  chassisToggle?.setAttribute('data-active', String(debugMode === 'chassis'));
  seamToggle?.setAttribute('data-active', String(debugMode === 'seam'));

  for (const family of ['graphite', 'gunmetal', 'silver']) {
    instanceGroups[family].material = debugMode === 'silhouette' ? materials.silhouette : materials[family];
  }

  datum.material = debugMode === 'silhouette' ? materials.silhouette : materials.authority;
  bearing.material = debugMode === 'silhouette' ? materials.silhouette : materials.bearing;

  chassis.material = debugMode === 'chassis'
    ? materials.chassisDebug
    : (debugMode === 'silhouette' ? materials.silhouette : materials.chassis);

  seamDebugPlane.visible = debugMode === 'seam' && !isClean();
  schedule();
}

silhouetteToggle?.addEventListener('click', () => setDebugMode('silhouette'));
chassisToggle?.addEventListener('click', () => setDebugMode('chassis'));
seamToggle?.addEventListener('click', () => setDebugMode('seam'));

const matrix = new THREE.Matrix4();
const tempQ = new THREE.Quaternion();

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

// Explicit OBB collision audit at REST, representative PRESSURE and THRESHOLD.
const localBounds = moduleGeometry.boundingBox;
const localHalf = localBounds.getSize(new THREE.Vector3()).multiplyScalar(0.5);

function poseAt(module, state) {
  let u = 0;
  if (state === 'pressure') u = smooth01(module.focalWeight / 0.55) * 0.45;
  if (state === 'threshold') u = 1;

  return {
    pos: module.rest.clone().lerp(module.tight, u),
    q: module.baseQ.clone().slerp(module.tightQ, u)
  };
}

function obbData(module, state) {
  const pose = poseAt(module, state);
  const rot4 = new THREE.Matrix4().makeRotationFromQuaternion(pose.q);
  const e = rot4.elements;
  const axes = [
    new THREE.Vector3(e[0], e[1], e[2]).normalize(),
    new THREE.Vector3(e[4], e[5], e[6]).normalize(),
    new THREE.Vector3(e[8], e[9], e[10]).normalize()
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
const pressureCollisions = auditCollisions('pressure');
const thresholdCollisions = auditCollisions('threshold');

if (metricRestCollisions) metricRestCollisions.textContent = String(restCollisions.length);
if (metricPressureCollisions) metricPressureCollisions.textContent = String(pressureCollisions.length);
if (metricThresholdCollisions) metricThresholdCollisions.textContent = String(thresholdCollisions.length);

const raycaster = new THREE.Raycaster();
const pointerNdc = new THREE.Vector2();
const pointerLocal = joint.focal.clone();
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
      camera.position.set(2.72, 1.42, 7.55);
      assembly.scale.setScalar(0.97);
    } else {
      camera.position.set(2.68, 1.62, 7.92);
      assembly.scale.setScalar(0.96);
    }
  } else if (CAMERA_OPTION === 'A') {
    // A: slightly more frontal 3/4.
    camera.position.set(2.65, 1.40, 8.20);
    assembly.scale.setScalar(isClean() ? 1.10 : 1.02);
  } else {
    // B selected: slightly higher and more compressed.
    camera.position.set(2.95, 2.10, 8.45);
    assembly.scale.setScalar(isClean() ? 1.11 : 1.03);
  }
  camera.lookAt(0.00, -0.02, 0.02);
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

  if (metricDpr) metricDpr.textContent = dpr.toFixed(2);
  if (metricRenderer) metricRenderer.textContent = renderer.capabilities.isWebGL2 ? 'WebGL 2' : 'WebGL';
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
    pointerLocal.copy(joint.focal);
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
      direct[module.index] = smooth01(module.focalWeight / 0.54);
    }
  } else if (pointerActive) {
    const radius = manualMode === 'pressure' ? 1.34 : 1.26;
    const pressureScale = manualMode === 'pressure'
      ? 0.64
      : (autoPhase === 'hold' ? 0.90 : 1);

    for (const module of modules) {
      const distance = module.rest.distanceTo(pointerLocal);
      const local = smooth01(1 - distance / radius);
      const structural = 0.26 + 0.74 * module.focalWeight;
      direct[module.index] = local * structural * pressureScale;
    }
  }

  for (const module of modules) {
    const neighbors = adjacency[module.index];
    let neighborSum = 0;
    for (const index of neighbors) neighborSum += direct[index];

    const propagated = neighbors.length ? (neighborSum / neighbors.length) * 0.26 : 0;
    const structuralCap = 0.48 + 0.52 * module.focalWeight;

    module.targetInfluence = THREE.MathUtils.clamp(
      (direct[module.index] + propagated) * structuralCap,
      0,
      1
    );
  }
}

function applyReducedMotionPose() {
  for (const module of modules) {
    if (manualMode === 'threshold') module.influence = smooth01(module.focalWeight / 0.54);
    else if (manualMode === 'pressure') module.influence = module.focalWeight * 0.46;
    else module.influence = 0;
  }

  applyModuleMatrices();
  updateStateLabel();
}

function updateMobileOneShot(now) {
  if (reducedMotion.matches || !compact() || autoComplete || autoPhase === 'cancelled' || manualMode !== 'rest') return;
  if (!autoStartedAt) autoStartedAt = now;

  const elapsed = now - autoStartedAt;

  if (elapsed < 850) {
    autoPhase = 'idle';
    pointerActive = false;
    return;
  }

  if (elapsed < 2250) {
    autoPhase = 'press';
    pointerActive = true;
    pointerLocal.copy(joint.focal);
    pointerMovedAt = autoStartedAt + 900;
    return;
  }

  if (elapsed < 3150) {
    autoPhase = 'hold';
    pointerActive = true;
    pointerLocal.copy(joint.focal);
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
  const sampleCount = Math.min(6, ranked.length);
  const topInfluence = ranked.slice(0, sampleCount).reduce((sum, value) => sum + value, 0) / sampleCount;
  const stableInput = now - pointerMovedAt > 460;

  let state = 'REST';
  if (manualMode === 'threshold') state = 'STILLNESS';
  else if (pointerActive && stableInput && topInfluence > 0.34) state = 'STILLNESS';
  else if (pointerActive && topInfluence > 0.09) state = 'REGISTRATION';
  else if (pointerActive) state = 'PRESSURE';
  else if (topInfluence > 0.018) state = 'RETURN';

  if (stateLabel) stateLabel.textContent = state;
}

function update(now, dt) {
  updateMobileOneShot(now);
  computeTargets();

  let moving = false;
  const attack = manualMode === 'threshold' ? 0.44 : 0.58;
  const release = 1.02;

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
    if (metricFirst) metricFirst.textContent = `${Math.round(performance.now() - BOOT_AT)} ms`;
    sampleStartedAt = now;
    sampleFrames = 0;
  }

  if (!sampleDone) {
    sampleFrames++;
    const duration = now - sampleStartedAt;

    if (duration >= 1600) {
      if (metricFps) metricFps.textContent = `${(sampleFrames / (duration / 1000)).toFixed(1)} fps`;
      sampleDone = true;
    }
  }

  if (inputStamp !== null) {
    if (metricLatency) metricLatency.textContent = `${Math.max(0, performance.now() - inputStamp).toFixed(1)} ms`;
    inputStamp = null;
  }

  const autoRunning = compact() && !autoComplete && autoPhase !== 'cancelled' && !reducedMotion.matches;
  const needsAnotherFrame = moving || !sampleDone || autoRunning;

  if (needsAnotherFrame) {
    schedule();
  } else if (metricRaf) {
    metricRaf.textContent = 'IDLE';
  }
}

function schedule() {
  if (paused || rafId) return;
  if (metricRaf) metricRaf.textContent = 'ACTIVE';
  rafId = requestAnimationFrame(renderFrame);
}

document.addEventListener('visibilitychange', () => {
  paused = document.hidden;

  if (paused && rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
    if (metricRaf) metricRaf.textContent = 'PAUSED';
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
    if (metricRaf) metricRaf.textContent = 'IDLE';
  } else {
    autoComplete = false;
    autoStartedAt = 0;
    schedule();
  }
});

if (isClean()) {
  seamDebugPlane.visible = false;
}

if (reducedMotion.matches) {
  autoComplete = true;
  applyReducedMotionPose();
}

schedule();
