import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const bootAt = performance.now();
const canvas = document.getElementById('clearance-canvas');
const stateLabel = document.getElementById('state-label');
const metricRenderer = document.getElementById('metric-renderer');
const metricDpr = document.getElementById('metric-dpr');
const metricFps = document.getElementById('metric-fps');
const metricFirst = document.getElementById('metric-first');
const metricLatency = document.getElementById('metric-latency');
const modeButtons = [...document.querySelectorAll('[data-mode]')];

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const coarsePointer = matchMedia('(any-pointer: coarse)');
const compact = () => innerWidth <= 900 || coarsePointer.matches;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x060708);
scene.fog = new THREE.FogExp2(0x060708, 0.035);

const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 40);
camera.position.set(0.95, 0.72, 7.25);
camera.lookAt(0, -0.02, 0);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance'
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.92;

const pmrem = new THREE.PMREMGenerator(renderer);
const environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.035).texture;
scene.environment = environment;
pmrem.dispose();

const assembly = new THREE.Group();
assembly.rotation.set(-0.055, -0.17, -0.018);
assembly.position.y = -0.02;
scene.add(assembly);

const moduleGeometry = new RoundedBoxGeometry(0.62, 0.48, 0.19, 5, 0.045);
moduleGeometry.computeVertexNormals();

const materials = {
  graphite: new THREE.MeshPhysicalMaterial({
    color: 0x171a1d, metalness: 0.58, roughness: 0.28,
    clearcoat: 0.12, clearcoatRoughness: 0.42
  }),
  gunmetal: new THREE.MeshPhysicalMaterial({
    color: 0x2b3035, metalness: 0.72, roughness: 0.25,
    clearcoat: 0.08, clearcoatRoughness: 0.38
  }),
  silver: new THREE.MeshPhysicalMaterial({
    color: 0x9a9da0, metalness: 0.8, roughness: 0.22,
    clearcoat: 0.08, clearcoatRoughness: 0.32
  }),
  authority: new THREE.MeshPhysicalMaterial({
    color: 0xa4977d, metalness: 0.84, roughness: 0.24,
    clearcoat: 0.12, clearcoatRoughness: 0.28
  })
};

const rows = 4;
const cols = 8;
const modules = [];
const directField = new Float32Array(rows * cols);
const neighborField = new Float32Array(rows * cols);

function xFor(col, tight) {
  const inner = tight ? 0.40 : 0.55;
  const step = tight ? 0.68 : 0.82;
  return col < 4
    ? -(inner + (3 - col) * step)
    : +(inner + (col - 4) * step);
}
function yFor(row, col, tight) {
  const step = tight ? 0.60 : 0.67;
  const stagger = tight ? 0 : ((col % 2 ? 1 : -1) * 0.025);
  return (row - 1.5) * step + stagger;
}
function zFor(row, col, tight) {
  const x = xFor(col, tight);
  const crown = 0.16 - Math.abs(x) * 0.028;
  const rowLift = (1.5 - Math.abs(row - 1.5)) * 0.018;
  return crown + rowLift + (tight ? 0.014 : ((col + row) % 2 ? 0.015 : -0.006));
}

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const index = row * cols + col;
    const family = index % 11 === 0 || index % 13 === 0
      ? 'silver'
      : (index % 4 === 0 || index % 7 === 0 ? 'gunmetal' : 'graphite');
    const mesh = new THREE.Mesh(moduleGeometry, materials[family]);
    const base = new THREE.Vector3(xFor(col, false), yFor(row, col, false), zFor(row, col, false));
    const tight = new THREE.Vector3(xFor(col, true), yFor(row, col, true), zFor(row, col, true));
    mesh.position.copy(base);
    mesh.rotation.set(
      (row - 1.5) * -0.010,
      (col - 3.5) * -0.012 + (index % 2 ? 0.012 : -0.008),
      ((row + col) % 2 ? 1 : -1) * 0.018
    );
    mesh.userData = {
      index, row, col, base, tight,
      baseRotation: mesh.rotation.clone(),
      tightRotation: new THREE.Euler(0, (col - 3.5) * -0.004, 0),
      influence: 0
    };
    assembly.add(mesh);
    modules.push(mesh);
  }
}

// Authority registration belongs to a physically separate class. These inserts never
// follow pointer input, scale, pulse, glow, or inherit per-module tightening.
const authorityGeometry = new RoundedBoxGeometry(0.055, 0.26, 0.205, 4, 0.018);
[-0.72, 0, 0.72].forEach((y, i) => {
  const insert = new THREE.Mesh(authorityGeometry, materials.authority);
  insert.position.set(0, y, 0.19 + i * 0.004);
  insert.rotation.z = i === 1 ? 0 : (i === 0 ? -0.015 : 0.015);
  assembly.add(insert);
});

const interactionPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(8.2, 5.2),
  new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
);
interactionPlane.position.z = 0.34;
assembly.add(interactionPlane);

const stageFloor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 7),
  new THREE.MeshStandardMaterial({ color: 0x07090a, metalness: 0.1, roughness: 0.82 })
);
stageFloor.rotation.x = -Math.PI / 2;
stageFloor.position.set(0, -2.05, -0.25);
scene.add(stageFloor);

const key = new THREE.DirectionalLight(0xe9e7e0, 3.1);
key.position.set(-3.4, 4.8, 6.5);
scene.add(key);
const rim = new THREE.DirectionalLight(0xa7adb6, 1.75);
rim.position.set(4.8, 1.8, 3.2);
scene.add(rim);
const low = new THREE.DirectionalLight(0x6b7077, 0.65);
low.position.set(-1.5, -2.8, 2.2);
scene.add(low);

const raycaster = new THREE.Raycaster();
const pointerNdc = new THREE.Vector2();
const pointerLocal = new THREE.Vector3(0, 0, 0);
let pointerActive = false;
let pointerMovedAt = 0;
let inputStamp = null;
let manualMode = 'rest';
let autoPhase = 'idle';
let autoStartedAt = 0;
let autoComplete = false;
let rafId = 0;
let lastFrameAt = performance.now();
let firstRendered = false;
let sampleStartedAt = 0;
let sampleFrames = 0;
let sampleDone = false;
let paused = document.hidden;

function setRendererSize() {
  const rect = canvas.getBoundingClientRect();
  const dprCap = compact() ? 1.35 : 1.6;
  const dpr = Math.min(devicePixelRatio || 1, dprCap);
  renderer.setPixelRatio(dpr);
  renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
  camera.aspect = Math.max(1, rect.width) / Math.max(1, rect.height);
  camera.updateProjectionMatrix();
  metricDpr.textContent = dpr.toFixed(2);
  metricRenderer.textContent = renderer.capabilities.isWebGL2 ? 'WebGL 2' : 'WebGL';
  schedule();
}
setRendererSize();

function smooth01(value) {
  const x = THREE.MathUtils.clamp(value, 0, 1);
  return x * x * (3 - 2 * x);
}

function pointerToLocal(event) {
  const rect = canvas.getBoundingClientRect();
  pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointerNdc, camera);
  const hit = raycaster.intersectObject(interactionPlane, false)[0];
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

function setActiveButton(mode) {
  modeButtons.forEach(button => {
    button.dataset.active = String(button.dataset.mode === mode);
  });
}

function setManualMode(mode) {
  manualMode = mode;
  autoPhase = 'cancelled';
  autoComplete = true;
  if (mode === 'rest') {
    pointerActive = false;
  } else {
    pointerActive = true;
    pointerLocal.set(0, 0, 0);
    pointerMovedAt = performance.now();
  }
  setActiveButton(mode);
  if (reducedMotion.matches) applyReducedMotionPose();
  schedule();
}

modeButtons.forEach(button => {
  button.addEventListener('click', () => setManualMode(button.dataset.mode));
});

function computeFields() {
  if (manualMode === 'threshold') {
    directField.fill(1);
    neighborField.fill(1);
    return;
  }
  if (!pointerActive) {
    directField.fill(0);
    neighborField.fill(0);
    return;
  }

  const radius = manualMode === 'pressure' ? 2.15 : 1.62;
  const pressureScale = manualMode === 'pressure' ? 0.78 : 1;
  for (const mesh of modules) {
    const { index, base } = mesh.userData;
    const dx = base.x - pointerLocal.x;
    const dy = base.y - pointerLocal.y;
    const distance = Math.hypot(dx, dy);
    directField[index] = smooth01(1 - distance / radius) * pressureScale;
  }

  for (const mesh of modules) {
    const { index, row, col } = mesh.userData;
    let sum = 0;
    let count = 0;
    const neighbors = [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]];
    for (const [r, c] of neighbors) {
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        sum += directField[r * cols + c];
        count++;
      }
    }
    neighborField[index] = THREE.MathUtils.clamp(directField[index] + (count ? (sum / count) * 0.42 : 0), 0, 1);
  }
}

function applyReducedMotionPose() {
  const threshold = manualMode === 'threshold';
  const pressure = manualMode === 'pressure';
  for (const mesh of modules) {
    const u = threshold ? 1 : (pressure ? 0.62 : 0);
    const { base, tight, baseRotation, tightRotation } = mesh.userData;
    mesh.userData.influence = u;
    mesh.position.lerpVectors(base, tight, u);
    mesh.rotation.set(
      THREE.MathUtils.lerp(baseRotation.x, tightRotation.x, u),
      THREE.MathUtils.lerp(baseRotation.y, tightRotation.y, u),
      THREE.MathUtils.lerp(baseRotation.z, tightRotation.z, u)
    );
  }
  updateStateLabel();
}

function updateMobileOneShot(now) {
  if (reducedMotion.matches || !compact() || autoComplete || autoPhase === 'cancelled' || manualMode !== 'rest') return;
  if (!autoStartedAt) autoStartedAt = now;
  const elapsed = now - autoStartedAt;

  if (elapsed < 850) {
    autoPhase = 'idle';
    return;
  }
  if (elapsed < 2450) {
    autoPhase = 'press';
    pointerActive = true;
    pointerLocal.set(0.06, -0.02, 0);
    pointerMovedAt = autoStartedAt + 950;
    return;
  }
  if (elapsed < 3350) {
    autoPhase = 'hold';
    pointerActive = true;
    pointerLocal.set(0.06, -0.02, 0);
    return;
  }
  autoPhase = 'release';
  pointerActive = false;
  if (elapsed > 4550) {
    autoComplete = true;
    autoPhase = 'done';
    manualMode = 'rest';
    setActiveButton('rest');
  }
}

function updateStateLabel(now = performance.now()) {
  const influences = modules.map(m => m.userData.influence).sort((a, b) => b - a);
  const top = influences.slice(0, 8).reduce((a, b) => a + b, 0) / 8;
  const stableInput = now - pointerMovedAt > 520;
  let state = 'REST';

  if (manualMode === 'threshold') state = 'STILLNESS';
  else if (pointerActive && stableInput && top > 0.54) state = 'STILLNESS';
  else if (pointerActive && top > 0.18) state = 'TIGHTEN';
  else if (pointerActive) state = 'PRESSURE';
  else if (top > 0.04) state = 'RETURN';
  stateLabel.textContent = state;
}

function update(now, dt) {
  updateMobileOneShot(now);
  computeFields();

  let moving = false;
  const attack = manualMode === 'threshold' ? 0.42 : 0.50;
  const release = 0.90;

  for (const mesh of modules) {
    const uData = mesh.userData;
    const target = neighborField[uData.index];
    const tau = target > uData.influence ? attack : release;
    const alpha = 1 - Math.exp(-dt / Math.max(0.001, tau));
    const next = THREE.MathUtils.lerp(uData.influence, target, alpha);
    uData.influence = Math.abs(next - target) < 0.0012 ? target : next;

    const u = uData.influence;
    const tx = THREE.MathUtils.lerp(uData.base.x, uData.tight.x, u);
    const ty = THREE.MathUtils.lerp(uData.base.y, uData.tight.y, u);
    const tz = THREE.MathUtils.lerp(uData.base.z, uData.tight.z, u);
    if (mesh.position.distanceToSquared({x:tx,y:ty,z:tz}) > 0.0000007) moving = true;
    mesh.position.set(tx, ty, tz);
    mesh.rotation.set(
      THREE.MathUtils.lerp(uData.baseRotation.x, uData.tightRotation.x, u),
      THREE.MathUtils.lerp(uData.baseRotation.y, uData.tightRotation.y, u),
      THREE.MathUtils.lerp(uData.baseRotation.z, uData.tightRotation.z, u)
    );
  }

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
    metricFirst.textContent = `${Math.round(performance.now() - bootAt)} ms`;
    sampleStartedAt = now;
    sampleFrames = 0;
  }

  if (!sampleDone) {
    sampleFrames++;
    const sampleDuration = now - sampleStartedAt;
    if (sampleDuration >= 1600) {
      const fps = sampleFrames / (sampleDuration / 1000);
      metricFps.textContent = `${fps.toFixed(1)} fps`;
      sampleDone = true;
    }
  }

  if (inputStamp !== null) {
    metricLatency.textContent = `${Math.max(0, performance.now() - inputStamp).toFixed(1)} ms`;
    inputStamp = null;
  }

  const autoRunning = compact() && !autoComplete && autoPhase !== 'cancelled' && !reducedMotion.matches;
  if (moving || pointerActive || !sampleDone || autoRunning) schedule();
}

function schedule() {
  if (paused || rafId) return;
  rafId = requestAnimationFrame(renderFrame);
}

document.addEventListener('visibilitychange', () => {
  paused = document.hidden;
  if (!paused) {
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
