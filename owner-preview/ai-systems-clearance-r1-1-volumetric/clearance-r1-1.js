import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

const BOOT_AT = performance.now();
const MODULE_COUNT = 30;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const SELECTED_SEAM = (new URLSearchParams(location.search).get('seam') || 'B').toUpperCase() === 'A' ? 'A' : 'B';

const canvas = document.getElementById('clearance-canvas');
const stateLabel = document.getElementById('state-label');
const metricRenderer = document.getElementById('metric-renderer');
const metricDpr = document.getElementById('metric-dpr');
const metricFps = document.getElementById('metric-fps');
const metricFirst = document.getElementById('metric-first');
const metricLatency = document.getElementById('metric-latency');
const metricRaf = document.getElementById('metric-raf');
const modeButtons = [...document.querySelectorAll('[data-mode]')];
const cleanToggle = document.getElementById('clean-toggle');

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const coarsePointer = matchMedia('(any-pointer: coarse)');
const isClean = () => document.documentElement.classList.contains('clean-view');
const compact = () => innerWidth <= 920 || coarsePointer.matches;

cleanToggle?.addEventListener('click', () => {
  location.href = isClean() ? location.pathname : location.pathname + '?clean=1';
});

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050607);
scene.fog = new THREE.FogExp2(0x050607, 0.025);

const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance'
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.84;

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.03).texture;
pmrem.dispose();

RectAreaLightUniformsLib.init();

const assembly = new THREE.Group();
assembly.rotation.set(-0.05, -0.10, 0.015);
scene.add(assembly);

const SEAM_OPTIONS = {
  A: {
    label: 'diagonal axial plane',
    normal: new THREE.Vector3(0.78, 0.24, 0.58).normalize(),
    field(p) {
      return p.dot(this.normal) - 0.02;
    },
    focal: new THREE.Vector3(0.18, 0.10, 1.18)
  },
  B: {
    label: 'offset faceted axial seam',
    normal: new THREE.Vector3(0.70, -0.12, 0.70).normalize(),
    field(p) {
      return p.dot(this.normal) + 0.12 * p.y * p.z - 0.06;
    },
    focal: new THREE.Vector3(0.20, 0.02, 1.28)
  }
};
const seam = SEAM_OPTIONS[SELECTED_SEAM];

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
    depth: 0.22,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.035,
    bevelSegments: 2,
    curveSegments: 1,
    steps: 1
  });
  geometry.translate(0, 0, -0.11);
  geometry.computeVertexNormals();
  return geometry;
}

const moduleGeometry = createModuleGeometry();
const materials = {
  graphite: new THREE.MeshPhysicalMaterial({
    color: 0x111416,
    metalness: 0.42,
    roughness: 0.32,
    clearcoat: 0.12,
    clearcoatRoughness: 0.45
  }),
  gunmetal: new THREE.MeshPhysicalMaterial({
    color: 0x262b2f,
    metalness: 0.72,
    roughness: 0.24,
    clearcoat: 0.08,
    clearcoatRoughness: 0.34
  }),
  silver: new THREE.MeshPhysicalMaterial({
    color: 0x737a7f,
    metalness: 0.82,
    roughness: 0.23,
    clearcoat: 0.08,
    clearcoatRoughness: 0.30
  }),
  authority: new THREE.MeshPhysicalMaterial({
    color: 0x9c8f76,
    metalness: 0.86,
    roughness: 0.27,
    clearcoat: 0.10,
    clearcoatRoughness: 0.32
  }),
  bearing: new THREE.MeshPhysicalMaterial({
    color: 0x1d2022,
    metalness: 0.78,
    roughness: 0.26
  })
};

function shellPoint(index) {
  const t = (index + 0.5) / MODULE_COUNT;
  const y = 1 - 2 * t;
  const radial = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = index * GOLDEN_ANGLE + 0.24;
  const unit = new THREE.Vector3(
    Math.cos(theta) * radial,
    y,
    Math.sin(theta) * radial
  );

  const p = new THREE.Vector3(
    unit.x * 1.90,
    unit.y * 1.52,
    unit.z * 1.58
  );

  // Authored asymmetry: a compressed left shoulder, subtle crown, and a
  // controlled rear taper. This keeps an approximately ovoid read without Orb 2.
  if (p.x < -0.65) p.x += 0.10;
  if (p.y > 0.75) p.y -= 0.06;
  if (p.z < -0.70) p.z += 0.09;
  p.x += 0.035 * Math.sin(index * 1.7);
  p.y += 0.025 * Math.cos(index * 1.3);
  p.z += 0.028 * Math.sin(index * 0.9 + 0.4);
  return p;
}

function surfaceNormal(p) {
  return new THREE.Vector3(
    p.x / (1.90 * 1.90),
    p.y / (1.52 * 1.52),
    p.z / (1.58 * 1.58)
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
  const seamValue = seam.field(shell);
  const side = seamValue >= 0 ? 1 : -1;
  const seamDistance = Math.abs(seamValue);
  const focalDistance = shell.distanceTo(seam.focal);
  const frontness = smooth01((shell.z + 0.25) / 1.75);
  const seamNearness = smooth01(1 - seamDistance / 0.78);
  const focalNearness = smooth01(1 - focalDistance / 2.35);
  const focalWeight = seamNearness * focalNearness * (0.28 + 0.72 * frontness);

  const rest = shell.clone()
    .addScaledVector(seam.normal, side * 0.145 * focalWeight)
    .addScaledVector(normal, 0.025 * Math.sin(i * 1.1));

  // The two masses approach the seam but retain a small authored tolerance.
  // R1's fixed 0.18 grid value is intentionally not preserved.
  const tight = shell.clone()
    .addScaledVector(seam.normal, side * 0.055 * focalWeight)
    .addScaledVector(normal, -0.035 * focalWeight);

  const baseQ = orientationFor(normal, 0.045 * Math.sin(i * 0.73));
  const alignmentDelta = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    -side * 0.085 * focalWeight
  );
  const tightQ = baseQ.clone().multiply(alignmentDelta);

  const scale = 0.86 + 0.10 * smooth01((shell.z + 1.5) / 3.0)
    + 0.035 * Math.cos(i * 1.17);
  const scaleVector = new THREE.Vector3(scale, scale * 0.96, 0.92 + scale * 0.07);

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

// Material hierarchy is structural, not modulo/random:
// two most important front seam shoulders become restrained silver;
// the next seam-supporting housings become gunmetal.
const structuralOrder = [...modules].sort((a, b) => b.focalWeight - a.focalWeight);
structuralOrder.slice(0, 2).forEach(m => { m.family = 'silver'; });
structuralOrder.slice(2, 10).forEach(m => { m.family = 'gunmetal'; });

const familyLists = {
  graphite: modules.filter(m => m.family === 'graphite'),
  gunmetal: modules.filter(m => m.family === 'gunmetal'),
  silver: modules.filter(m => m.family === 'silver')
};

for (const family of ['graphite', 'gunmetal', 'silver']) {
  const list = familyLists[family];
  const mesh = new THREE.InstancedMesh(moduleGeometry, materials[family], list.length);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  list.forEach((module, instanceIndex) => {
    module.group = mesh;
    module.instanceIndex = instanceIndex;
  });
  assembly.add(mesh);
}

const adjacency = modules.map((module) => {
  return modules
    .filter(other => other !== module)
    .map(other => ({
      index: other.index,
      distance: module.rest.distanceTo(other.rest)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 4)
    .map(item => item.index);
});

// Recessed immutable authority datum. It is spatially inside the selected focal
// joint; it never receives machine transforms, scale, pulse, glow or pointer state.
const datumGroup = new THREE.Group();
const datumGeometry = new RoundedBoxGeometry(0.10, 0.82, 0.075, 4, 0.018);
const bearingGeometry = new RoundedBoxGeometry(0.17, 0.92, 0.11, 4, 0.022);
const datum = new THREE.Mesh(datumGeometry, materials.authority);
const bearing = new THREE.Mesh(bearingGeometry, materials.bearing);
bearing.position.z = -0.055;
datumGroup.add(bearing, datum);

const datumNormal = seam.normal.clone();
const datumTangent = new THREE.Vector3(0, 1, 0)
  .sub(datumNormal.clone().multiplyScalar(datumNormal.y))
  .normalize();
const datumSide = new THREE.Vector3().crossVectors(datumTangent, datumNormal).normalize();
const datumBasis = new THREE.Matrix4().makeBasis(datumSide, datumTangent, datumNormal);
datumGroup.quaternion.setFromRotationMatrix(datumBasis);
datumGroup.position.copy(seam.focal).addScaledVector(seam.normal, -0.16).addScaledVector(new THREE.Vector3(0,0,1), -0.16);
datumGroup.scale.setScalar(0.82);
assembly.add(datumGroup);

const interactionShell = new THREE.Mesh(
  new THREE.SphereGeometry(2.12, 18, 14),
  new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
);
interactionShell.scale.set(1, 0.82, 0.84);
assembly.add(interactionShell);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 9),
  new THREE.MeshStandardMaterial({ color: 0x060708, metalness: 0.08, roughness: 0.88 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.set(0, -2.28, -0.45);
scene.add(floor);

const key = new THREE.RectAreaLight(0xe8e5de, 6.2, 5.5, 4.0);
key.position.set(-3.5, 4.5, 5.7);
key.lookAt(0, 0.15, 0);
scene.add(key);

const edge = new THREE.RectAreaLight(0x9aa0a7, 4.1, 3.0, 5.0);
edge.position.set(4.8, 1.4, 2.3);
edge.lookAt(0.1, 0, 0);
scene.add(edge);

const top = new THREE.RectAreaLight(0xd3d0c8, 2.0, 4.0, 2.0);
top.position.set(0.0, 5.0, -0.8);
top.lookAt(0, 0, 0);
scene.add(top);

const rim = new THREE.DirectionalLight(0x90969d, 0.85);
rim.position.set(-2.5, 1.0, -5.0);
scene.add(rim);

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
      camera.position.set(3.25, 1.75, 7.65);
      assembly.scale.setScalar(0.90);
    } else {
      camera.position.set(3.25, 1.95, 8.25);
      assembly.scale.setScalar(0.88);
    }
  } else {
    camera.position.set(3.75, 2.20, 7.65);
    assembly.scale.setScalar(isClean() ? 1.04 : 0.98);
  }
  camera.lookAt(0.02, 0.0, 0.05);
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
      direct[module.index] = module.focalWeight;
    }
  } else if (pointerActive) {
    const radius = manualMode === 'pressure' ? 1.75 : 1.45;
    const pressureScale = manualMode === 'pressure' ? 0.76 : 1;
    for (const module of modules) {
      const distance = module.rest.distanceTo(pointerLocal);
      const local = smooth01(1 - distance / radius);
      const structural = 0.18 + 0.82 * module.focalWeight;
      direct[module.index] = local * structural * pressureScale;
    }
  }

  for (const module of modules) {
    const neighbors = adjacency[module.index];
    let neighborSum = 0;
    for (const index of neighbors) neighborSum += direct[index];
    const propagated = neighbors.length ? (neighborSum / neighbors.length) * 0.36 : 0;
    const structuralCap = 0.14 + 0.86 * module.focalWeight;
    module.targetInfluence = THREE.MathUtils.clamp(
      Math.max(direct[module.index], direct[module.index] + propagated) * structuralCap,
      0,
      1
    );
  }
}

function applyReducedMotionPose() {
  for (const module of modules) {
    if (manualMode === 'threshold') module.influence = module.focalWeight;
    else if (manualMode === 'pressure') module.influence = module.focalWeight * 0.58;
    else module.influence = 0;
  }
  applyModuleMatrices();
  updateStateLabel();
}

function updateMobileOneShot(now) {
  if (reducedMotion.matches || !compact() || autoComplete || autoPhase === 'cancelled' || manualMode !== 'rest') return;
  if (!autoStartedAt) autoStartedAt = now;
  const elapsed = now - autoStartedAt;

  if (elapsed < 750) {
    autoPhase = 'idle';
    pointerActive = false;
    return;
  }
  if (elapsed < 2350) {
    autoPhase = 'press';
    pointerActive = true;
    pointerLocal.copy(seam.focal);
    pointerMovedAt = autoStartedAt + 820;
    return;
  }
  if (elapsed < 3200) {
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
  else if (pointerActive && stableInput && topInfluence > 0.45) state = 'STILLNESS';
  else if (pointerActive && topInfluence > 0.12) state = 'REGISTRATION';
  else if (pointerActive) state = 'PRESSURE';
  else if (topInfluence > 0.025) state = 'RETURN';

  stateLabel.textContent = state;
}

function update(now, dt) {
  updateMobileOneShot(now);
  computeTargets();

  let moving = false;
  const attack = manualMode === 'threshold' ? 0.40 : 0.52;
  const release = 0.98;

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
