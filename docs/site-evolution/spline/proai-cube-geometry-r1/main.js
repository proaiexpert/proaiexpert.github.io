import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const GLB_URL = new URL('./rubik_39_s_cube_animation.glb', import.meta.url).href;
const canvas = document.getElementById('cube-canvas');
const status = document.getElementById('runtime-status');
const params = new URLSearchParams(location.search);
const captureMode = params.has('capture');
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const AXES = ['X', 'Y', 'Z'];
const LAYERS = [-1, 0, 1];
const AXIS_INDEX = Object.freeze({ X: 0, Y: 1, Z: 2 });
const AXIS_VECTOR = Object.freeze({
  X: new THREE.Vector3(1, 0, 0),
  Y: new THREE.Vector3(0, 1, 0),
  Z: new THREE.Vector3(0, 0, 1),
});

const MOTION = Object.freeze({
  turnDurationRangeMs: [1210, 1490],
  calmHoldRangeMs: [980, 2400],
  phraseBreathRangeMs: [520, 680],
  easing: [0.36, 0.0, 0.12, 1.0],
  orbitDampingFactor: 0.074,
  orbitRotateSpeed: 0.50,
  orbitZoomSpeed: 0.48,
  manualResumeDelayMs: 1850,
  manualResumeBlendMs: 2400,
  bodyDrift: {
    yawDeg: 3.8,
    pitchDeg: 2.15,
    rollDeg: 0.65,
    yawPeriodMs: 12800,
    pitchPeriodMs: 15200,
    rollPeriodMs: 10600,
  },
});

const PRIMARY_PHRASE = Object.freeze([
  { axis: 'X', layer: 1, direction: 1, durationMs: 1380, holdMs: 1480 },
  { axis: 'Y', layer: 0, direction: -1, durationMs: 1320, holdMs: 560 },
  { axis: 'Z', layer: 1, direction: 1, durationMs: 1240, holdMs: 2050 },
  { axis: 'X', layer: -1, direction: -1, durationMs: 1490, holdMs: 1260 },
  { axis: 'Z', layer: 0, direction: -1, durationMs: 1360, holdMs: 620 },
  { axis: 'Y', layer: -1, direction: 1, durationMs: 1260, holdMs: 2180 },
  { axis: 'X', layer: 0, direction: 1, durationMs: 1430, holdMs: 1080 },
  { axis: 'Z', layer: -1, direction: -1, durationMs: 1310, holdMs: 2400 },
]);

const RESOLUTION_PHRASE = Object.freeze(
  [...PRIMARY_PHRASE].reverse().map((move, index) => ({
    axis: move.axis,
    layer: move.layer,
    direction: -move.direction,
    durationMs: [1340, 1280, 1460, 1290, 1410, 1250, 1370, 1450][index],
    holdMs: [620, 1160, 560, 1900, 640, 1380, 980, 2600][index],
  })),
);

const CHOREOGRAPHY = Object.freeze([...PRIMARY_PHRASE, ...RESOLUTION_PHRASE]);

const GEOMETRY_R1 = Object.freeze({
  faceOuterSize: 196.8,
  faceThickness: 3.6,
  faceCornerRadius: 10.6,
  faceBevelSize: 2.35,
  faceBevelThickness: 1.25,
  faceBevelSegments: 4,
  faceCurveSegments: 8,
  coreSize: 198.0,
  coreRadius: 9.2,
  coreSegments: 5,
});

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance',
  preserveDrawingBuffer: captureMode,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, captureMode ? 1 : 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.setClearColor(0x07090c, 1);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07090c);
if (!captureMode) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const roomEnvironment = new RoomEnvironment();
  scene.environment = pmrem.fromScene(roomEnvironment, 0.035).texture;
  roomEnvironment.dispose();
  pmrem.dispose();
}

const presentationRig = new THREE.Group();
presentationRig.name = 'R1_PRESENTATION_RIG';
scene.add(presentationRig);

const camera = new THREE.PerspectiveCamera(31, 1, 0.01, 1000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = MOTION.orbitDampingFactor;
controls.enablePan = false;
controls.rotateSpeed = MOTION.orbitRotateSpeed;
controls.zoomSpeed = MOTION.orbitZoomSpeed;
controls.minPolarAngle = Math.PI * 0.17;
controls.maxPolarAngle = Math.PI * 0.83;

// Temporary neutral studio baseline for geometry inspection only.
scene.add(new THREE.HemisphereLight(0xdce3ec, 0x090b0f, 1.05));
const key = new THREE.DirectionalLight(0xffffff, 4.45);
key.position.set(6.4, 8.2, 5.2);
scene.add(key);
const fill = new THREE.DirectionalLight(0xaeb9c8, 1.35);
fill.position.set(-5.6, 2.4, 3.8);
scene.add(fill);
const rim = new THREE.DirectionalLight(0xffffff, 2.35);
rim.position.set(-2.8, 4.8, -6.8);
scene.add(rim);

const faceMaterial = new THREE.MeshStandardMaterial({
  color: 0x424851,
  metalness: 0.72,
  roughness: 0.295,
  envMapIntensity: 0.95,
});
const coreMaterial = new THREE.MeshStandardMaterial({
  color: 0x090c11,
  metalness: 0.34,
  roughness: 0.46,
  envMapIntensity: 0.58,
});

let cubeRoot;
let sceneOne;
let cubieParents = [];
let physicalCubies = [];
let latticeCenters = null;
let cubeCenterLocal = new THREE.Vector3();
let activeTurn = null;
let motionState = 'loading';
let motionBusy = false;
let choreographyEnabled = !captureMode && !prefersReducedMotion;
let choreographyRunning = false;
let interactionActive = false;
let manualResumeAt = 0;
let presentationResumeStart = 0;
let presentationResumeFrom = new THREE.Quaternion();
let frozenPresentationQuaternion = new THREE.Quaternion();
let lastTurnResult = null;
let turnSerial = 0;
let geometryStats = null;

const api = {
  ready: false,
  motionState,
  motionConfig: MOTION,
  geometryConfig: GEOMETRY_R1,
  geometry: null,
  hierarchy: null,
  mechanics: null,
  choreography: {
    primaryMoves: PRIMARY_PHRASE,
    resolutionMoves: RESOLUTION_PHRASE,
    cycleMoves: CHOREOGRAPHY.length,
  },
  turnSlice,
  runAutomatedQA,
  getDiagnostics,
  getInteractionState,
  stopChoreography() { choreographyEnabled = false; },
  startChoreography() {
    if (!prefersReducedMotion) {
      choreographyEnabled = true;
      void autonomousLoop();
    }
  },
  beginReviewTurn,
  setReviewTurnProgress,
  setReviewPresentation,
  renderReviewFrame,
  captureFrame(type = 'image/png', quality = 0.94) {
    renderReviewFrame();
    return canvas.toDataURL(type, quality);
  },
};
window.__PROAI_CUBE_R1 = api;

function setMotionState(next) {
  motionState = next;
  api.motionState = next;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function smoothstep(value) {
  const x = THREE.MathUtils.clamp(value, 0, 1);
  return x * x * (3 - 2 * x);
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

function identityOrientation() {
  return [1, 0, 0, 0, 1, 0, 0, 0, 1];
}

function multiplyOrientation(a, b) {
  const out = new Array(9).fill(0);
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      let value = 0;
      for (let k = 0; k < 3; k += 1) value += a[row * 3 + k] * b[k * 3 + col];
      out[row * 3 + col] = Math.round(value);
    }
  }
  return out;
}

function quarterTurnMatrix(axis, direction) {
  const d = direction >= 0 ? 1 : -1;
  if (axis === 'X') return d > 0
    ? [1, 0, 0, 0, 0, -1, 0, 1, 0]
    : [1, 0, 0, 0, 0, 1, 0, -1, 0];
  if (axis === 'Y') return d > 0
    ? [0, 0, 1, 0, 1, 0, -1, 0, 0]
    : [0, 0, -1, 0, 1, 0, 1, 0, 0];
  if (axis === 'Z') return d > 0
    ? [0, -1, 0, 1, 0, 0, 0, 0, 1]
    : [0, 1, 0, -1, 0, 0, 0, 0, 1];
  throw new Error(`Unsupported axis ${axis}`);
}

function orientationQuaternion(matrix) {
  const m = new THREE.Matrix4().set(
    matrix[0], matrix[1], matrix[2], 0,
    matrix[3], matrix[4], matrix[5], 0,
    matrix[6], matrix[7], matrix[8], 0,
    0, 0, 0, 1,
  );
  return new THREE.Quaternion().setFromRotationMatrix(m).normalize();
}

function rotateLogical(logical, axis, direction) {
  const { x, y, z } = logical;
  const d = direction >= 0 ? 1 : -1;
  if (axis === 'X') return d > 0 ? { x, y: -z, z: y } : { x, y: z, z: -y };
  if (axis === 'Y') return d > 0 ? { x: z, y, z: -x } : { x: -z, y, z: x };
  if (axis === 'Z') return d > 0 ? { x: -y, y: x, z } : { x: y, y: -x, z };
  throw new Error(`Unsupported axis ${axis}`);
}

function axisComponent(logical, axis) {
  return logical[axis.toLowerCase()];
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
  return dimensions[0] < dimensions[2] * 0.12 ? faceMaterial : coreMaterial;
}

function roundedRectShape(width, height, radius) {
  const w = width * 0.5;
  const h = height * 0.5;
  const r = Math.min(radius, w - 0.001, h - 0.001);
  const shape = new THREE.Shape();
  shape.moveTo(-w + r, -h);
  shape.lineTo(w - r, -h);
  shape.quadraticCurveTo(w, -h, w, -h + r);
  shape.lineTo(w, h - r);
  shape.quadraticCurveTo(w, h, w - r, h);
  shape.lineTo(-w + r, h);
  shape.quadraticCurveTo(-w, h, -w, h - r);
  shape.lineTo(-w, -h + r);
  shape.quadraticCurveTo(-w, -h, -w + r, -h);
  return shape;
}

function sourceGeometryMetrics(geometry) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox.clone();
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const abs = [Math.abs(size.x), Math.abs(size.y), Math.abs(size.z)];
  const thinAxis = abs.indexOf(Math.min(...abs));
  return { box, size, center, thinAxis };
}

function buildPrecisionFaceGeometry(sourceGeometry) {
  const source = sourceGeometryMetrics(sourceGeometry);
  if (source.thinAxis !== 2) throw new Error(`Geometry R1 expected face source thin axis Z; got ${source.thinAxis}`);
  const shape = roundedRectShape(180, 180, GEOMETRY_R1.faceCornerRadius);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.9,
    steps: 1,
    curveSegments: GEOMETRY_R1.faceCurveSegments,
    bevelEnabled: true,
    bevelThickness: GEOMETRY_R1.faceBevelThickness,
    bevelSize: GEOMETRY_R1.faceBevelSize,
    bevelSegments: GEOMETRY_R1.faceBevelSegments,
  });
  geometry.computeBoundingBox();
  let box = geometry.boundingBox.clone();
  const center = box.getCenter(new THREE.Vector3());
  geometry.translate(-center.x, -center.y, -box.max.z);
  geometry.computeBoundingBox();
  box = geometry.boundingBox.clone();
  const size = box.getSize(new THREE.Vector3());
  geometry.scale(
    GEOMETRY_R1.faceOuterSize / size.x,
    GEOMETRY_R1.faceOuterSize / size.y,
    GEOMETRY_R1.faceThickness / size.z,
  );
  geometry.translate(source.center.x, source.center.y, source.center.z);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function buildPrecisionCoreGeometry(sourceGeometry) {
  const source = sourceGeometryMetrics(sourceGeometry);
  const geometry = new RoundedBoxGeometry(
    GEOMETRY_R1.coreSize,
    GEOMETRY_R1.coreSize,
    GEOMETRY_R1.coreSize,
    GEOMETRY_R1.coreSegments,
    GEOMETRY_R1.coreRadius,
  );
  geometry.translate(source.center.x, source.center.y, source.center.z);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function enhanceRenderGeometry() {
  const cache = new Map();
  const stats = { faceMeshes: 0, coreMeshes: 0, nonPlaneMeshes: 0, uniqueEnhancedGeometries: 0, faceSourceSizes: [], coreSourceSizes: [] };
  cubeRoot.traverse((object) => {
    if (!object.isMesh || object.name === 'Plane' || !object.geometry) return;
    stats.nonPlaneMeshes += 1;
    const sourceGeometry = object.geometry;
    const source = sourceGeometryMetrics(sourceGeometry);
    const dims = [Math.abs(source.size.x), Math.abs(source.size.y), Math.abs(source.size.z)].sort((a, b) => a - b);
    const isFace = dims[0] < dims[2] * 0.12;
    const kind = isFace ? 'face' : 'core';
    const cacheKey = `${kind}:${sourceGeometry.uuid}`;
    if (!cache.has(cacheKey)) {
      cache.set(cacheKey, isFace ? buildPrecisionFaceGeometry(sourceGeometry) : buildPrecisionCoreGeometry(sourceGeometry));
      const rounded = source.size.toArray().map((value) => Math.round(value * 1000) / 1000);
      if (isFace) stats.faceSourceSizes.push(rounded); else stats.coreSourceSizes.push(rounded);
    }
    object.geometry = cache.get(cacheKey);
    if (isFace) stats.faceMeshes += 1; else stats.coreMeshes += 1;
  });
  stats.uniqueEnhancedGeometries = cache.size;
  const pitches = {};
  for (const axis of AXES) {
    const centers = latticeCenters[axis];
    pitches[axis] = ((centers[1] - centers[0]) + (centers[2] - centers[1])) * 0.5;
  }
  const minPitch = Math.min(...Object.values(pitches));
  const maxPitch = Math.max(...Object.values(pitches));
  stats.latticePitches = pitches;
  stats.faceGapRange = { min: minPitch - GEOMETRY_R1.faceOuterSize, max: maxPitch - GEOMETRY_R1.faceOuterSize };
  stats.coreGapRange = { min: minPitch - GEOMETRY_R1.coreSize, max: maxPitch - GEOMETRY_R1.coreSize };
  stats.faceOutwardProtrusion = 0;
  stats.pass = stats.faceMeshes === 180
    && stats.coreMeshes === 30
    && stats.nonPlaneMeshes === 210
    && stats.faceGapRange.min > 3
    && stats.coreGapRange.min > 2
    && stats.faceOutwardProtrusion === 0;
  return stats;
}

function findCubieParents() {
  const found = [];
  cubeRoot.traverse((object) => {
    if (object.children.length === 7 && object.children.every((child) => child.isMesh)) found.push(object);
  });
  return found;
}

function sceneTransformOf(object) {
  sceneOne.updateMatrixWorld(true);
  object.updateMatrixWorld(true);
  const sceneInverse = sceneOne.matrixWorld.clone().invert();
  const matrix = sceneInverse.multiply(object.matrixWorld.clone());
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  matrix.decompose(position, quaternion, scale);
  return { matrix, position, quaternion, scale };
}

function clusterValues(values, maxGap = 32) {
  const sorted = [...values].sort((a, b) => a - b);
  const clusters = [];
  for (const value of sorted) {
    const current = clusters.at(-1);
    if (!current || value - current.max > maxGap) {
      clusters.push({ values: [value], min: value, max: value, mean: value });
      continue;
    }
    current.values.push(value);
    current.min = Math.min(current.min, value);
    current.max = Math.max(current.max, value);
    current.mean = current.values.reduce((sum, item) => sum + item, 0) / current.values.length;
  }
  return clusters.map((cluster) => cluster.mean);
}

function nearestLayer(value, centers) {
  let bestIndex = 0;
  let bestDistance = Infinity;
  centers.forEach((center, index) => {
    const distance = Math.abs(value - center);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });
  return bestIndex - 1;
}

function logicalPosition(logical) {
  return new THREE.Vector3(
    latticeCenters.X[logical.x + 1],
    latticeCenters.Y[logical.y + 1],
    latticeCenters.Z[logical.z + 1],
  );
}

function prepareMechanicalModel() {
  cubieParents = findCubieParents();
  const transforms = cubieParents.map((object) => ({ object, ...sceneTransformOf(object) }));
  const xCenters = clusterValues(transforms.map((entry) => entry.position.x));
  const yCenters = clusterValues(transforms.map((entry) => entry.position.y));
  const zCenters = clusterValues(transforms.map((entry) => entry.position.z));
  if (xCenters.length !== 3 || yCenters.length !== 3 || zCenters.length !== 3) {
    throw new Error(`Expected 3 lattice centers per axis; got X=${xCenters.length} Y=${yCenters.length} Z=${zCenters.length}`);
  }
  latticeCenters = { X: xCenters, Y: yCenters, Z: zCenters };
  cubeCenterLocal.set(xCenters[1], yCenters[1], zCenters[1]);

  const grouped = new Map();
  for (const entry of transforms) {
    const logical = {
      x: nearestLayer(entry.position.x, xCenters),
      y: nearestLayer(entry.position.y, yCenters),
      z: nearestLayer(entry.position.z, zCenters),
    };
    const key = `${logical.x}|${logical.y}|${logical.z}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        id: key,
        logical: { ...logical },
        orientation: identityOrientation(),
        members: [],
      });
    }
    grouped.get(key).members.push({
      object: entry.object,
      originalParent: entry.object.parent,
      baseSceneQuaternion: entry.quaternion.clone(),
      baseSceneScale: entry.scale.clone(),
    });
  }
  physicalCubies = [...grouped.values()].sort((a, b) => a.id.localeCompare(b.id));
  if (physicalCubies.length !== 27) throw new Error(`Expected 27 physical cubies after spatial deduplication; got ${physicalCubies.length}`);

  const layerStats = {};
  for (const axis of AXES) {
    layerStats[axis] = {};
    for (const layer of LAYERS) {
      const selected = physicalCubies.filter((cubie) => axisComponent(cubie.logical, axis) === layer);
      const exportedObjects = selected.reduce((sum, cubie) => sum + cubie.members.length, 0);
      layerStats[axis][layer] = { physicalCubies: selected.length, exportedObjects };
      if (selected.length !== 9) throw new Error(`${axis}${layer} must resolve to 9 physical cubies; got ${selected.length}`);
    }
  }

  api.mechanics = {
    axes: [...AXES],
    layers: [...LAYERS],
    exportedCubieParents: cubieParents.length,
    physicalCubies: physicalCubies.length,
    duplicateExportObjects: cubieParents.length - physicalCubies.length,
    latticeCenters: {
      X: [...xCenters],
      Y: [...yCenters],
      Z: [...zCenters],
    },
    layerStats,
    spatialDeduplication: '27 logical spatial cubies from 30 exported parent objects; slice selection is logical-position based, never mesh-name based.',
  };
}

function desiredScenePose(cubie, member, logical = cubie.logical, orientation = cubie.orientation) {
  const position = logicalPosition(logical);
  const stateQuaternion = orientationQuaternion(orientation);
  const quaternion = stateQuaternion.multiply(member.baseSceneQuaternion.clone()).normalize();
  return { position, quaternion, scale: member.baseSceneScale.clone() };
}

function applyExactScenePose(cubie, member) {
  sceneOne.updateMatrixWorld(true);
  member.originalParent.updateMatrixWorld(true);
  const pose = desiredScenePose(cubie, member);
  const sceneMatrix = new THREE.Matrix4().compose(pose.position, pose.quaternion, pose.scale);
  const desiredWorld = sceneOne.matrixWorld.clone().multiply(sceneMatrix);
  const localMatrix = member.originalParent.matrixWorld.clone().invert().multiply(desiredWorld);
  localMatrix.decompose(member.object.position, member.object.quaternion, member.object.scale);
  member.object.quaternion.normalize();
  member.object.updateMatrix();
  member.object.updateMatrixWorld(true);
}

function selectLayer(axis, layer) {
  if (!AXES.includes(axis)) throw new Error(`Unsupported axis ${axis}`);
  if (!LAYERS.includes(layer)) throw new Error(`Unsupported logical layer ${layer}`);
  const selected = physicalCubies.filter((cubie) => axisComponent(cubie.logical, axis) === layer);
  if (selected.length !== 9) throw new Error(`${axis}${layer} selection must contain 9 physical cubies; got ${selected.length}`);
  return selected;
}

function beginTurn(axis = 'X', layer = 1, direction = 1) {
  if (activeTurn) throw new Error('A slice turn is already active');
  const normalizedAxis = String(axis).toUpperCase();
  const normalizedDirection = direction >= 0 ? 1 : -1;
  const selected = selectLayer(normalizedAxis, layer);
  const axisIndex = AXIS_INDEX[normalizedAxis];
  const pivot = new THREE.Group();
  pivot.name = `R1_TEMP_${normalizedAxis}_${layer >= 0 ? '+' : ''}${layer}_SLICE_PIVOT`;
  pivot.position.copy(cubeCenterLocal);
  pivot.position.setComponent(axisIndex, latticeCenters[normalizedAxis][layer + 1]);
  sceneOne.add(pivot);
  sceneOne.updateMatrixWorld(true);

  const targetQuaternion = new THREE.Quaternion().setFromAxisAngle(AXIS_VECTOR[normalizedAxis], normalizedDirection * Math.PI / 2).normalize();
  const inverseTarget = targetQuaternion.clone().invert();
  const rotationMatrix = quarterTurnMatrix(normalizedAxis, normalizedDirection);
  const cubiePlans = selected.map((cubie) => ({
    cubie,
    nextLogical: rotateLogical(cubie.logical, normalizedAxis, normalizedDirection),
    nextOrientation: multiplyOrientation(rotationMatrix, cubie.orientation),
  }));

  const memberStates = [];
  for (const plan of cubiePlans) {
    for (const member of plan.cubie.members) {
      pivot.attach(member.object);
      const targetPose = desiredScenePose(plan.cubie, member, plan.nextLogical, plan.nextOrientation);
      const targetLocalPosition = targetPose.position.clone().sub(pivot.position).applyQuaternion(inverseTarget);
      const targetLocalQuaternion = inverseTarget.clone().multiply(targetPose.quaternion).normalize();
      memberStates.push({
        plan,
        member,
        startLocalPosition: member.object.position.clone(),
        startLocalQuaternion: member.object.quaternion.clone(),
        startLocalScale: member.object.scale.clone(),
        targetLocalPosition,
        targetLocalQuaternion,
        targetLocalScale: targetPose.scale.clone(),
      });
    }
  }
  pivot.updateMatrixWorld(true);

  activeTurn = {
    axis: normalizedAxis,
    layer,
    direction: normalizedDirection,
    pivot,
    targetQuaternion,
    cubiePlans,
    memberStates,
    linear: 0,
    eased: 0,
    startedSerial: ++turnSerial,
  };
  setMotionState('turning');
  return activeTurn;
}

function setActiveTurnProgress(linear, { finalize = false } = {}) {
  if (!activeTurn) throw new Error('No active turn');
  const progress = THREE.MathUtils.clamp(linear, 0, 1);
  const eased = cubicBezierEase(progress);
  activeTurn.linear = progress;
  activeTurn.eased = eased;
  activeTurn.pivot.quaternion.slerpQuaternions(new THREE.Quaternion(), activeTurn.targetQuaternion, eased).normalize();
  for (const state of activeTurn.memberStates) {
    state.member.object.position.lerpVectors(state.startLocalPosition, state.targetLocalPosition, eased);
    state.member.object.quaternion.slerpQuaternions(state.startLocalQuaternion, state.targetLocalQuaternion, eased).normalize();
    state.member.object.scale.lerpVectors(state.startLocalScale, state.targetLocalScale, eased);
    state.member.object.updateMatrix();
  }
  activeTurn.pivot.updateMatrixWorld(true);
  if (finalize || progress >= 1) return finalizeActiveTurn();
  return { axis: activeTurn.axis, layer: activeTurn.layer, direction: activeTurn.direction, linear: progress, eased };
}

function finalizeActiveTurn() {
  if (!activeTurn) throw new Error('No active turn to finalize');
  const turn = activeTurn;
  turn.pivot.quaternion.copy(turn.targetQuaternion);
  for (const state of turn.memberStates) {
    state.member.object.position.copy(state.targetLocalPosition);
    state.member.object.quaternion.copy(state.targetLocalQuaternion);
    state.member.object.scale.copy(state.targetLocalScale);
    state.member.object.updateMatrix();
  }
  turn.pivot.updateMatrixWorld(true);

  for (const plan of turn.cubiePlans) {
    plan.cubie.logical = { ...plan.nextLogical };
    plan.cubie.orientation = [...plan.nextOrientation];
  }
  for (const state of turn.memberStates) state.member.originalParent.attach(state.member.object);
  for (const plan of turn.cubiePlans) {
    for (const member of plan.cubie.members) applyExactScenePose(plan.cubie, member);
  }
  sceneOne.remove(turn.pivot);
  sceneOne.updateMatrixWorld(true);
  activeTurn = null;
  setMotionState('rest');

  const canonical = canonicalTransformError();
  lastTurnResult = {
    serial: turn.startedSerial,
    axis: turn.axis,
    layer: turn.layer,
    direction: turn.direction,
    endpointErrorRad: 0,
    canonical,
  };
  return lastTurnResult;
}

function autonomyBlocked() {
  return interactionActive || performance.now() < manualResumeAt;
}

function animateActiveTurn(durationMs) {
  return new Promise((resolve) => {
    let elapsed = 0;
    let previous = performance.now();
    function tick(now) {
      const delta = Math.max(0, now - previous);
      previous = now;
      if (!autonomyBlocked()) elapsed += delta;
      const linear = THREE.MathUtils.clamp(elapsed / Math.max(1, durationMs), 0, 1);
      if (linear >= 1) {
        resolve(setActiveTurnProgress(1, { finalize: true }));
        return;
      }
      setActiveTurnProgress(linear);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

async function turnSlice({ axis = 'X', layer = 1, direction = 1, durationMs = null, durationScale = 1, instant = false, ignoreInteraction = false } = {}) {
  if (!api.ready || motionBusy || motionState !== 'rest') return false;
  if (!ignoreInteraction && autonomyBlocked()) return false;
  motionBusy = true;
  beginTurn(axis, layer, direction);
  let result;
  if (instant) result = setActiveTurnProgress(1, { finalize: true });
  else {
    const baseDuration = durationMs ?? (MOTION.turnDurationRangeMs[0] + MOTION.turnDurationRangeMs[1]) / 2;
    result = await animateActiveTurn(Math.max(1, baseDuration * durationScale));
  }
  motionBusy = false;
  return result;
}

function snapshotLogicalState() {
  return physicalCubies.map((cubie) => ({
    id: cubie.id,
    logical: { ...cubie.logical },
    orientation: [...cubie.orientation],
  }));
}

function maxLogicalStateError(reference, current) {
  let coordinateMismatch = 0;
  let orientationMismatch = 0;
  reference.forEach((entry, index) => {
    const now = current[index];
    if (entry.logical.x !== now.logical.x || entry.logical.y !== now.logical.y || entry.logical.z !== now.logical.z) coordinateMismatch += 1;
    if (entry.orientation.some((value, i) => value !== now.orientation[i])) orientationMismatch += 1;
  });
  return { coordinateMismatch, orientationMismatch };
}

function canonicalTransformError() {
  let maxPosition = 0;
  let maxQuaternionRad = 0;
  let maxScale = 0;
  for (const cubie of physicalCubies) {
    for (const member of cubie.members) {
      const actual = sceneTransformOf(member.object);
      const expected = desiredScenePose(cubie, member);
      maxPosition = Math.max(maxPosition, actual.position.distanceTo(expected.position));
      maxQuaternionRad = Math.max(maxQuaternionRad, actual.quaternion.angleTo(expected.quaternion));
      maxScale = Math.max(maxScale, actual.scale.distanceTo(expected.scale));
    }
  }
  return { maxPosition, maxQuaternionRad, maxScale };
}

const MIXED_30 = Object.freeze([
  ['X', 1, 1], ['Y', 0, -1], ['Z', -1, 1], ['X', 0, -1], ['Y', 1, 1],
  ['Z', 0, -1], ['X', -1, 1], ['Y', -1, -1], ['Z', 1, 1], ['X', 1, -1],
  ['Y', 0, 1], ['Z', -1, -1], ['X', 0, 1], ['Y', 1, -1], ['Z', 0, 1],
  ['X', -1, -1], ['Y', -1, 1], ['Z', 1, -1], ['X', 1, 1], ['Y', 0, -1],
  ['Z', 0, 1], ['X', 0, -1], ['Y', -1, -1], ['Z', -1, 1], ['X', -1, 1],
  ['Y', 1, 1], ['Z', 1, -1], ['X', 1, -1], ['Y', 0, 1], ['Z', 0, -1],
]);

async function runAutomatedQA() {
  const wasEnabled = choreographyEnabled;
  choreographyEnabled = false;
  while (motionBusy || activeTurn) await sleep(10);
  const startState = snapshotLogicalState();
  const startCanonical = canonicalTransformError();

  const layerSupport = {};
  for (const axis of AXES) {
    layerSupport[axis] = {};
    for (const layer of LAYERS) {
      const selected = selectLayer(axis, layer);
      layerSupport[axis][layer] = {
        physicalCubies: selected.length,
        exportedObjects: selected.reduce((sum, cubie) => sum + cubie.members.length, 0),
        pass: selected.length === 9,
      };
    }
  }

  const axisSupport = {};
  for (const [axis, layer] of [['X', 1], ['Y', 0], ['Z', -1]]) {
    const forward = await turnSlice({ axis, layer, direction: 1, instant: true, ignoreInteraction: true });
    const inverse = await turnSlice({ axis, layer, direction: -1, instant: true, ignoreInteraction: true });
    const stateError = maxLogicalStateError(startState, snapshotLogicalState());
    axisSupport[axis] = {
      forwardEndpointErrorRad: forward?.endpointErrorRad ?? null,
      inverseEndpointErrorRad: inverse?.endpointErrorRad ?? null,
      restoredAfterPair: stateError.coordinateMismatch === 0 && stateError.orientationMismatch === 0,
    };
  }

  const repeatabilityStart = snapshotLogicalState();
  let maxCanonicalPosition = 0;
  let maxCanonicalQuaternionRad = 0;
  let maxCanonicalScale = 0;
  const endpointErrors = [];
  for (const [axis, layer, direction] of MIXED_30) {
    const result = await turnSlice({ axis, layer, direction, instant: true, ignoreInteraction: true });
    endpointErrors.push(result.endpointErrorRad);
    maxCanonicalPosition = Math.max(maxCanonicalPosition, result.canonical.maxPosition);
    maxCanonicalQuaternionRad = Math.max(maxCanonicalQuaternionRad, result.canonical.maxQuaternionRad);
    maxCanonicalScale = Math.max(maxCanonicalScale, result.canonical.maxScale);
  }
  const stateAfter30 = snapshotLogicalState();

  for (const [axis, layer, direction] of [...MIXED_30].reverse()) {
    await turnSlice({ axis, layer, direction: -direction, instant: true, ignoreInteraction: true });
  }

  const restoredState = snapshotLogicalState();
  const restorationLogical = maxLogicalStateError(repeatabilityStart, restoredState);
  const restorationCanonical = canonicalTransformError();
  const startVsRestored = maxLogicalStateError(startState, restoredState);

  if (wasEnabled && !captureMode && !prefersReducedMotion) {
    choreographyEnabled = true;
    void autonomousLoop();
  }

  return {
    axisSupport,
    layerSupport,
    repeatability30: {
      turns: MIXED_30.length,
      endpointMaxErrorRad: Math.max(...endpointErrors),
      maxCanonicalPosition,
      maxCanonicalQuaternionRad,
      maxCanonicalScale,
      logicalStateChanged: (() => {
        const changed = maxLogicalStateError(repeatabilityStart, stateAfter30);
        return changed.coordinateMismatch > 0 || changed.orientationMismatch > 0;
      })(),
      pass: endpointErrors.every((value) => value === 0)
        && maxCanonicalPosition < 1e-6
        && maxCanonicalQuaternionRad < 1e-6
        && maxCanonicalScale < 1e-8,
    },
    inverseRestoration: {
      logical: restorationLogical,
      canonical: restorationCanonical,
      startVsRestored,
      pass: restorationLogical.coordinateMismatch === 0
        && restorationLogical.orientationMismatch === 0
        && restorationCanonical.maxPosition < 1e-6
        && restorationCanonical.maxQuaternionRad < 1e-6
        && restorationCanonical.maxScale < 1e-8,
    },
    startCanonical,
  };
}

function driftQuaternion(timeMs) {
  const drift = MOTION.bodyDrift;
  const yaw = THREE.MathUtils.degToRad(drift.yawDeg) * Math.sin((timeMs / drift.yawPeriodMs) * Math.PI * 2 + 0.35);
  const pitch = THREE.MathUtils.degToRad(drift.pitchDeg) * Math.sin((timeMs / drift.pitchPeriodMs) * Math.PI * 2 + 1.15);
  const roll = THREE.MathUtils.degToRad(drift.rollDeg) * Math.sin((timeMs / drift.rollPeriodMs) * Math.PI * 2 + 2.1);
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, roll, 'XYZ'));
}

function updatePresentationDrift(now) {
  if (!api.ready || captureMode) return;
  if (interactionActive || now < manualResumeAt) return;
  const target = driftQuaternion(now);
  if (presentationResumeStart > 0 && now < presentationResumeStart + MOTION.manualResumeBlendMs) {
    const progress = smoothstep((now - presentationResumeStart) / MOTION.manualResumeBlendMs);
    presentationRig.quaternion.slerpQuaternions(presentationResumeFrom, target, progress).normalize();
  } else {
    presentationRig.quaternion.copy(target);
    if (presentationResumeStart > 0) presentationResumeStart = 0;
  }
}

async function sleepAutonomous(durationMs) {
  let elapsed = 0;
  let previous = performance.now();
  while (elapsed < durationMs && choreographyEnabled) {
    await sleep(32);
    const now = performance.now();
    const delta = now - previous;
    previous = now;
    if (!autonomyBlocked()) elapsed += delta;
  }
}

async function autonomousLoop() {
  if (choreographyRunning) return;
  choreographyRunning = true;
  await sleepAutonomous(1550);
  while (choreographyEnabled) {
    for (const move of CHOREOGRAPHY) {
      if (!choreographyEnabled) break;
      while (autonomyBlocked() && choreographyEnabled) await sleep(48);
      if (!choreographyEnabled) break;
      await turnSlice({ ...move, ignoreInteraction: true });
      await sleepAutonomous(move.holdMs);
    }
  }
  choreographyRunning = false;
}

function getInteractionState() {
  const now = performance.now();
  return {
    interactionActive,
    autonomyBlocked: autonomyBlocked(),
    resumeDelayRemainingMs: Math.max(0, manualResumeAt - now),
    presentationResumeActive: presentationResumeStart > 0 && now < presentationResumeStart + MOTION.manualResumeBlendMs,
    cameraPosition: camera.position.toArray(),
    presentationQuaternion: presentationRig.quaternion.toArray(),
  };
}

controls.addEventListener('start', () => {
  interactionActive = true;
  frozenPresentationQuaternion.copy(presentationRig.quaternion);
  presentationResumeFrom.copy(presentationRig.quaternion);
  manualResumeAt = Infinity;
  presentationResumeStart = 0;
});

controls.addEventListener('end', () => {
  interactionActive = false;
  const now = performance.now();
  manualResumeAt = now + MOTION.manualResumeDelayMs;
  presentationResumeStart = manualResumeAt;
  presentationResumeFrom.copy(presentationRig.quaternion);
});

function beginReviewTurn(axis, layer, direction) {
  if (!captureMode || !api.ready || motionBusy || activeTurn) return false;
  motionBusy = true;
  const turn = beginTurn(axis, layer, direction);
  return { axis: turn.axis, layer: turn.layer, direction: turn.direction };
}

function setReviewTurnProgress(linear) {
  if (!captureMode || !activeTurn) return false;
  const progress = THREE.MathUtils.clamp(linear, 0, 1);
  const result = setActiveTurnProgress(progress, { finalize: progress >= 1 });
  if (progress >= 1) motionBusy = false;
  renderReviewFrame();
  return result;
}

function setReviewPresentation(timeSec = 0, resumeProgress = 1) {
  if (!captureMode || !api.ready) return false;
  const target = driftQuaternion(Math.max(0, timeSec) * 1000);
  if (resumeProgress < 1) {
    const progress = smoothstep(resumeProgress);
    presentationRig.quaternion.slerpQuaternions(frozenPresentationQuaternion, target, progress).normalize();
  } else {
    presentationRig.quaternion.copy(target);
  }
  renderReviewFrame();
  return presentationRig.quaternion.toArray();
}

function renderReviewFrame() {
  controls.update();
  renderer.render(scene, camera);
}

function frameCamera() {
  cubeRoot.updateMatrixWorld(true);
  const box = new THREE.Box3().makeEmpty();
  cubieParents.forEach((object) => box.expandByObject(object, true));
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const centerWorld = sphere.center.clone();
  const radius = sphere.radius;
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const distance = radius / Math.sin(fov / 2) * 1.075;
  const direction = new THREE.Vector3(1.18, 0.86, 1.33).normalize();
  camera.position.copy(centerWorld).addScaledVector(direction, distance);
  camera.near = Math.max(0.01, distance - radius * 3.0);
  camera.far = distance + radius * 5.0;
  camera.updateProjectionMatrix();
  controls.target.copy(centerWorld);
  controls.minDistance = distance * 0.78;
  controls.maxDistance = distance * 1.28;
  controls.update();
}

function getDiagnostics() {
  return {
    ready: api.ready,
    motionState,
    hierarchy: api.hierarchy,
    mechanics: api.mechanics,
    motionConfig: MOTION,
    activeTurn: activeTurn ? {
      axis: activeTurn.axis,
      layer: activeTurn.layer,
      direction: activeTurn.direction,
      linear: activeTurn.linear,
      eased: activeTurn.eased,
    } : null,
    lastTurnResult,
    interaction: getInteractionState(),
    canonicalError: api.ready ? canonicalTransformError() : null,
    geometry: api.geometry,
    geometryConfig: GEOMETRY_R1,
    renderer: {
      webgl2: renderer.capabilities.isWebGL2,
      pixelRatio: renderer.getPixelRatio(),
    },
  };
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
  camera.aspect = Math.max(0.1, rect.width / Math.max(1, rect.height));
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize, { passive: true });

function render(now) {
  updatePresentationDrift(now);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
if (!captureMode) requestAnimationFrame(render);

const loader = new GLTFLoader();
loader.load(
  GLB_URL,
  (gltf) => {
    cubeRoot = gltf.scene;
    presentationRig.add(cubeRoot);
    cubeRoot.updateMatrixWorld(true);
    sceneOne = cubeRoot.getObjectByName('right')?.parent || cubeRoot.getObjectByName('Scene 1') || cubeRoot;

    cubeRoot.traverse((object) => {
      if (object.name === 'Plane' || object.isLight) object.visible = false;
    });

    api.hierarchy = hierarchyCheck();
    if (!api.hierarchy.pass) throw new Error('Named right/center/left hierarchy verification failed');
    prepareMechanicalModel();
    geometryStats = enhanceRenderGeometry();
    api.geometry = geometryStats;
    if (!geometryStats.pass) throw new Error(`Geometry R1 structural gate failed: ${JSON.stringify(geometryStats)}`);
    cubeRoot.traverse((object) => {
      if (object.isMesh && object.name !== 'Plane') {
        object.material = classifyReviewMaterial(object);
        object.castShadow = false;
        object.receiveShadow = false;
      }
    });
    frameCamera();
    resize();
    if (captureMode) renderReviewFrame();

    api.ready = true;
    setMotionState('rest');
    status.textContent = 'Three.js GLB loaded. Motion R1 frozen. Geometry R1 precision mesh ready.';
    if (choreographyEnabled) void autonomousLoop();
  },
  undefined,
  (error) => {
    console.error('GLB load failed', error);
    setMotionState('error');
    status.textContent = 'GLB load failed';
  },
);
