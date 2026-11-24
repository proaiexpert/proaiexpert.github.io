import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import '@fontsource-variable/instrument-sans';

const GLB_URL = new URL('./rubik_39_s_cube_animation.glb', import.meta.url).href;
const canvas = document.getElementById('cube-canvas');
const status = document.getElementById('runtime-status');
const params = new URLSearchParams(location.search);
const captureMode = params.has('capture');
const reviewMode = params.has('review');
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const instrumentFontReady = (async () => {
  try {
    await document.fonts.load('620 64px "Instrument Sans Variable"');
    await document.fonts.ready;
    return document.fonts.check('620 64px "Instrument Sans Variable"');
  } catch (error) {
    console.warn('Instrument Sans load check failed', error);
    return false;
  }
})();

const AXES = ['X', 'Y', 'Z'];
const LAYERS = [-1, 0, 1];
const AXIS_INDEX = Object.freeze({ X: 0, Y: 1, Z: 2 });
const AXIS_VECTOR = Object.freeze({
  X: new THREE.Vector3(1, 0, 0),
  Y: new THREE.Vector3(0, 1, 0),
  Z: new THREE.Vector3(0, 0, 1),
});

const MOTION = Object.freeze({
  turnDurationRangeMs: [1080, 1420],
  easing: [0.36, 0.0, 0.12, 1.0],
  orbitDampingFactor: 0.074,
  orbitRotateSpeed: 0.50,
  orbitZoomSpeed: 0.48,
  manualResumeDelayMs: 1850,
  manualResumeBlendMs: 2400,
  sliceResumeStaggerMs: 280,
});

const PRESENTATION_R1_2 = Object.freeze({
  normalYawVelocityDegPerSec: [7, 12],
  inspectionYawVelocityDegPerSec: [18, 30],
  pitchEnvelopeDeg: 10.2,
  rollEnvelopeDeg: 2.45,
  velocityCycleMs: 68000,
  velocityKeyframes: Object.freeze([
    Object.freeze({ timeMs: 0, velocityDegPerSec: 8.0 }),
    Object.freeze({ timeMs: 3500, velocityDegPerSec: 11.0 }),
    Object.freeze({ timeMs: 5500, velocityDegPerSec: 24.0 }),
    Object.freeze({ timeMs: 9500, velocityDegPerSec: 30.0 }),
    Object.freeze({ timeMs: 13500, velocityDegPerSec: 27.0 }),
    Object.freeze({ timeMs: 16500, velocityDegPerSec: 12.0 }),
    Object.freeze({ timeMs: 23000, velocityDegPerSec: 8.0 }),
    Object.freeze({ timeMs: 29000, velocityDegPerSec: 10.0 }),
    Object.freeze({ timeMs: 36000, velocityDegPerSec: -8.0 }),
    Object.freeze({ timeMs: 43000, velocityDegPerSec: -11.0 }),
    Object.freeze({ timeMs: 49000, velocityDegPerSec: -24.0 }),
    Object.freeze({ timeMs: 55000, velocityDegPerSec: -29.0 }),
    Object.freeze({ timeMs: 60000, velocityDegPerSec: -14.0 }),
    Object.freeze({ timeMs: 68000, velocityDegPerSec: 8.0 }),
  ]),
  pitchPrimaryPeriodMs: 14800,
  pitchSecondaryPeriodMs: 31100,
  rollPrimaryPeriodMs: 18400,
  rollSecondaryPeriodMs: 36700,
  review360TargetSec: 18.0,
});

const SLICE_R1_2 = Object.freeze({
  turnDurationRangeMs: [1080, 1420],
  typicalGapRangeMs: [180, 420],
  breathingGapRangeMs: [620, 820],
  pairedStaggerRangeMs: [100, 220],
  phraseMicroGapRangeMs: [90, 170],
  eventPattern: Object.freeze(['single', 'pair', 'single', 'single', 'phrase', 'single', 'pair', 'single', 'single', 'phrase']),
  distribution: Object.freeze({ single: 0.60, paired: 0.20, phrase: 0.20 }),
  seed: 0x51a7c0de,
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


// Semantic Brand Moment R2 is a narrow temporal/material wrapper around frozen R1.2 mechanics.
const SEMANTIC_R2 = Object.freeze({
  copy: Object.freeze(['ProAI', 'Expert']),
  fontFamily: 'Instrument Sans Variable',
  fontWeight: 620,
  proAIScale: 1.035,
  expertScale: 1.0,
  proAITrackingEm: 0.012,
  expertTrackingEm: -0.004,
  targetBlockWidthRatio: 0.722,
  targetBlockHeightRange: Object.freeze([0.38, 0.44]),
  lineGapCapRatio: 0.105,
  opticalOffsetXRatio: 0.0,
  opticalOffsetYRatio: -0.002,
  surfaceMaxOpacity: 0.88,
  surfaceColor: '#161c23',
  decelerationMs: 440,
  revealMs: 720,
  specularMs: 560,
  readableHoldMs: 1380,
  exitMs: 520,
  surfaceRestoreMs: 440,
  accelerationMs: 440,
  firstSurfaceMs: 38,
  firstTypographyMs: 72,
  triggerSearchStartMs: 7100,
  triggerSearchEndMs: 8200,
  preferredVisibilityDot: 0.92,
  minimumVisibilityDot: 0.88,
  selectedFallbackFace: '-X',
  faceOffsetFromCubieCenter: 100.2,
  overlayEpsilon: 0.36,
  textEpsilon: 0.46,
});

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance',
  preserveDrawingBuffer: captureMode || reviewMode,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, (captureMode || reviewMode) ? 1 : 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.setClearColor(0x050607, 1);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050607);
RectAreaLightUniformsLib.init();

function createStudioCard(environmentScene, { position, width, height, color, intensity }) {
  const geometry = new THREE.PlaneGeometry(width, height);
  const cardColor = new THREE.Color(color).multiplyScalar(intensity);
  const material = new THREE.MeshBasicMaterial({
    color: cardColor,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const card = new THREE.Mesh(geometry, material);
  card.position.fromArray(position);
  card.lookAt(0, 0, 0);
  environmentScene.add(card);
  return card;
}

function createPremiumStudioEnvironment(pmrem) {
  const environmentScene = new THREE.Scene();
  environmentScene.background = new THREE.Color(0x06080b);
  const cards = [
    createStudioCard(environmentScene, { position: [4.8, 1.35, 5.8], width: 8.4, height: 5.8, color: 0xd9dee5, intensity: 1.34 }),
    createStudioCard(environmentScene, { position: [-5.8, 0.55, 4.6], width: 4.6, height: 7.0, color: 0xaeb6c0, intensity: 1.12 }),
    createStudioCard(environmentScene, { position: [-4.3, 3.7, -5.8], width: 2.3, height: 6.8, color: 0xe9edf2, intensity: 1.20 }),
    createStudioCard(environmentScene, { position: [2.8, -4.5, -2.5], width: 6.2, height: 2.4, color: 0x848c96, intensity: 0.54 }),
  ];
  const texture = pmrem.fromScene(environmentScene, 0.075, 0.1, 30).texture;
  for (const card of cards) {
    card.geometry.dispose();
    card.material.dispose();
  }
  return texture;
}

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = createPremiumStudioEnvironment(pmrem);
pmrem.dispose();

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
controls.minAzimuthAngle = -Infinity;
controls.maxAzimuthAngle = Infinity;

// Materials + Lighting R1: restrained graphite / gunmetal / black-chrome hierarchy.
const LOOKDEV_R1 = Object.freeze({
  selectedPreset: 'premiumHybrid',
  materialGroups: Object.freeze({
    graphiteFace: Object.freeze({ color: '#242a31', metalness: 0.84, roughness: 0.295, clearcoat: 0.16, clearcoatRoughness: 0.20, envMapIntensity: 1.18 }),
    gunmetalFace: Object.freeze({ color: '#2b323a', metalness: 0.86, roughness: 0.265, clearcoat: 0.20, clearcoatRoughness: 0.18, envMapIntensity: 1.22 }),
    blackChromeFace: Object.freeze({ color: '#181d23', metalness: 0.92, roughness: 0.225, clearcoat: 0.16, clearcoatRoughness: 0.16, envMapIntensity: 1.26 }),
    smokedCore: Object.freeze({ color: '#0c0f13', metalness: 0.48, roughness: 0.44, clearcoat: 0.06, clearcoatRoughness: 0.28, envMapIntensity: 0.66 }),
  }),
  environment: Object.freeze({ method: 'procedural PMREM studio reflection cards', cardCount: 4, sigma: 0.075, externalTextures: 0 }),
  lighting: Object.freeze({ hemisphereIntensity: 0.52, keyIntensity: 5.2, fillIntensity: 4.0, rimIntensity: 4.6, rectAreaLights: 3 }),
  colorManagement: Object.freeze({ outputColorSpace: 'SRGBColorSpace', toneMapping: 'ACESFilmicToneMapping', exposure: 1.0 }),
  postprocessing: 'NONE',
});

const LOOKDEV_PRESETS = Object.freeze({
  roughGraphite: Object.freeze({
    graphiteFace: { color: '#1a1e23', metalness: 0.82, roughness: 0.34, clearcoat: 0.10, clearcoatRoughness: 0.24, envMapIntensity: 1.16 },
    gunmetalFace: { color: '#1c2127', metalness: 0.84, roughness: 0.31, clearcoat: 0.12, clearcoatRoughness: 0.22, envMapIntensity: 1.18 },
    blackChromeFace: { color: '#111419', metalness: 0.87, roughness: 0.29, clearcoat: 0.12, clearcoatRoughness: 0.21, envMapIntensity: 1.20 },
  }),
  gunmetal: Object.freeze({
    graphiteFace: { color: '#171b20', metalness: 0.90, roughness: 0.23, clearcoat: 0.20, clearcoatRoughness: 0.16, envMapIntensity: 1.34 },
    gunmetalFace: { color: '#20262d', metalness: 0.91, roughness: 0.20, clearcoat: 0.25, clearcoatRoughness: 0.14, envMapIntensity: 1.42 },
    blackChromeFace: { color: '#101318', metalness: 0.93, roughness: 0.19, clearcoat: 0.22, clearcoatRoughness: 0.14, envMapIntensity: 1.46 },
  }),
  blackChrome: Object.freeze({
    graphiteFace: { color: '#111419', metalness: 0.95, roughness: 0.18, clearcoat: 0.26, clearcoatRoughness: 0.12, envMapIntensity: 1.52 },
    gunmetalFace: { color: '#151a20', metalness: 0.95, roughness: 0.16, clearcoat: 0.30, clearcoatRoughness: 0.10, envMapIntensity: 1.58 },
    blackChromeFace: { color: '#090b0e', metalness: 0.98, roughness: 0.12, clearcoat: 0.28, clearcoatRoughness: 0.09, envMapIntensity: 1.68 },
  }),
  premiumHybrid: LOOKDEV_R1.materialGroups,
});

function physicalMaterial(spec) {
  return new THREE.MeshPhysicalMaterial({
    color: spec.color,
    metalness: spec.metalness,
    roughness: spec.roughness,
    clearcoat: spec.clearcoat,
    clearcoatRoughness: spec.clearcoatRoughness,
    envMapIntensity: spec.envMapIntensity,
  });
}

const faceGraphiteMaterial = physicalMaterial(LOOKDEV_R1.materialGroups.graphiteFace);
const faceGunmetalMaterial = physicalMaterial(LOOKDEV_R1.materialGroups.gunmetalFace);
const faceBlackChromeMaterial = physicalMaterial(LOOKDEV_R1.materialGroups.blackChromeFace);
const coreMaterial = physicalMaterial(LOOKDEV_R1.materialGroups.smokedCore);
const faceMaterial = faceGraphiteMaterial;
const premiumMaterials = Object.freeze({
  graphiteFace: faceGraphiteMaterial,
  gunmetalFace: faceGunmetalMaterial,
  blackChromeFace: faceBlackChromeMaterial,
  smokedCore: coreMaterial,
});
let activeLookDevPreset = LOOKDEV_R1.selectedPreset;
let materialAssignmentCounts = { graphiteFace: 0, gunmetalFace: 0, blackChromeFace: 0, smokedCore: 0 };
let resolvedLighting = null;

function applyMaterialSpec(material, spec) {
  material.color.set(spec.color);
  material.metalness = spec.metalness;
  material.roughness = spec.roughness;
  material.clearcoat = spec.clearcoat;
  material.clearcoatRoughness = spec.clearcoatRoughness;
  material.envMapIntensity = spec.envMapIntensity;
  material.needsUpdate = true;
}

function setLookDevPreset(name = LOOKDEV_R1.selectedPreset) {
  if (!Object.hasOwn(LOOKDEV_PRESETS, name)) return false;
  if (!captureMode && name !== LOOKDEV_R1.selectedPreset) return false;
  const preset = LOOKDEV_PRESETS[name];
  applyMaterialSpec(faceGraphiteMaterial, preset.graphiteFace);
  applyMaterialSpec(faceGunmetalMaterial, preset.gunmetalFace);
  applyMaterialSpec(faceBlackChromeMaterial, preset.blackChromeFace);
  if (name === LOOKDEV_R1.selectedPreset) applyMaterialSpec(coreMaterial, LOOKDEV_R1.materialGroups.smokedCore);
  activeLookDevPreset = name;
  if (api.ready) renderReviewFrame();
  return true;
}

const hemisphereFill = new THREE.HemisphereLight(0x8a949f, 0x0b0e12, LOOKDEV_R1.lighting.hemisphereIntensity);
scene.add(hemisphereFill);
const key = new THREE.RectAreaLight(0xe2e6eb, LOOKDEV_R1.lighting.keyIntensity, 1, 1);
const fill = new THREE.RectAreaLight(0xb7c0ca, LOOKDEV_R1.lighting.fillIntensity, 1, 1);
const rim = new THREE.RectAreaLight(0xe8ecf1, LOOKDEV_R1.lighting.rimIntensity, 1, 1);
scene.add(key, fill, rim);

function configureStudioLighting(centerWorld, radius) {
  const place = (light, offset, widthScale, heightScale) => {
    light.position.copy(centerWorld).add(new THREE.Vector3(...offset).multiplyScalar(radius));
    light.width = radius * widthScale;
    light.height = radius * heightScale;
    light.lookAt(centerWorld);
  };
  place(key, [1.62, 0.62, 1.95], 3.20, 2.50);
  place(fill, [-1.45, 0.22, 1.72], 2.85, 2.65);
  place(rim, [-1.28, 1.02, -1.88], 1.15, 2.65);
  resolvedLighting = {
    hemisphere: { type: 'HemisphereLight', skyColor: '#8a949f', groundColor: '#0b0e12', intensity: hemisphereFill.intensity },
    key: { type: 'RectAreaLight', color: '#e2e6eb', intensity: key.intensity, width: key.width, height: key.height, position: key.position.toArray() },
    fill: { type: 'RectAreaLight', color: '#b7c0ca', intensity: fill.intensity, width: fill.width, height: fill.height, position: fill.position.toArray() },
    rim: { type: 'RectAreaLight', color: '#e8ecf1', intensity: rim.intensity, width: rim.width, height: rim.height, position: rim.position.toArray() },
  };
}

let cubeRoot;
let sceneOne;
let cubieParents = [];
let physicalCubies = [];
let latticeCenters = null;
let cubeCenterLocal = new THREE.Vector3();
let activeTurn = null;
let motionState = 'loading';
let sliceSchedulerEnabled = !captureMode && !prefersReducedMotion;
let sliceSchedulerRunning = false;
let interactionActive = false;
let manualResumeAt = 0;
let sliceResumeAt = 0;
let presentationResumeStart = 0;
let presentationResumeFrom = new THREE.Quaternion();
let frozenPresentationQuaternion = new THREE.Quaternion();
let lastTurnResult = null;
let lastTurnResults = [];
let turnSerial = 0;
let geometryStats = null;
let activeTurns = new Map();
let reviewTurnIds = [];
let sliceSeed = SLICE_R1_2.seed >>> 0;
let sliceEventSerial = 0;
let eventsUntilBreath = 4;
let presentationSimTimeMs = 0;
let presentationYawRad = 0;
let presentationSignedYawDeg = 0;
let presentationCumulativeYawDeg = 0;
let presentationYawVelocityDegPerSec = 0;
let presentationLastNow = 0;
let presentationFrameDeltaRad = 0;
let lastPresentationQuaternion = new THREE.Quaternion();


let semanticGroup = null;
let semanticSurface = null;
let semanticText = null;
let semanticMaskTexture = null;
let semanticReady = false;
let semanticActive = false;
let semanticComplete = false;
let semanticBlocksSlices = false;
let semanticTimeScale = 1;
let semanticStartWallMs = 0;
let semanticElapsedMs = 0;
let semanticEntryPresentationMs = null;
let semanticHoldPresentationMs = null;
let semanticFace = SEMANTIC_R2.selectedFallbackFace;
let semanticVisibilityDot = null;
let semanticSchedulerEntry = null;
let semanticSchedulerExit = null;
let semanticTypographyMetrics = null;
let semanticSurfaceProgress = 0;
let semanticTextFormation = 0;
let semanticTextLuminance = 0;
let semanticSweep = -0.2;

const api = {
  ready: false,
  motionState,
  motionConfig: MOTION,
  geometryConfig: GEOMETRY_R1,
  presentationConfig: PRESENTATION_R1_2,
  sliceConfig: SLICE_R1_2,
  geometry: null,
  hierarchy: null,
  mechanics: null,
  turnSlice,
  runAutomatedQA,
  runPairedTurnQA,
  getDiagnostics,
  getInteractionState,
  stopChoreography() { sliceSchedulerEnabled = false; },
  stopSliceScheduler() { sliceSchedulerEnabled = false; },
  startChoreography() {
    if (!prefersReducedMotion) {
      sliceSchedulerEnabled = true;
      void sliceSchedulerLoop();
    }
  },
  beginReviewTurn,
  setReviewTurnProgress,
  beginReviewPair,
  setReviewPairProgress,
  setReviewPresentation,
  getReviewPresentationSample,
  setLookDevPreset,
  renderReviewFrame,
  getSemanticDiagnostics,
  getSemanticPoseAt,
  setSemanticReviewState,
  clearSemanticReviewState,
  getBaselineComparableState,
  getLogicalSnapshot: snapshotLogicalState,
  captureFrame(type = 'image/png', quality = 0.94) {
    renderReviewFrame();
    return canvas.toDataURL(type, quality);
  },
};
window.__PROAI_CUBE_R1_2 = api;
window.__PROAI_CUBE_R1 = api;
window.__PROAI_CUBE_ML_R1 = api;

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


function smootherstep(value) {
  const x = THREE.MathUtils.clamp(value, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

function trackedTextWidth(ctx, text, fontSizePx, trackingEm) {
  let width = 0;
  const trackingPx = trackingEm * fontSizePx;
  for (let i = 0; i < text.length; i += 1) {
    width += ctx.measureText(text[i]).width;
    if (i < text.length - 1) width += trackingPx;
  }
  return width;
}

function drawTrackedText(ctx, text, centerX, baselineY, fontSizePx, trackingEm) {
  const trackingPx = trackingEm * fontSizePx;
  const widths = [...text].map((char) => ctx.measureText(char).width);
  const full = widths.reduce((sum, value) => sum + value, 0) + trackingPx * Math.max(0, text.length - 1);
  let x = centerX - full * 0.5;
  for (let i = 0; i < text.length; i += 1) {
    ctx.fillText(text[i], x, baselineY);
    x += widths[i] + (i < text.length - 1 ? trackingPx : 0);
  }
  return full;
}

function createBrandMaskTexture() {
  const size = 2048;
  const canvasMask = document.createElement('canvas');
  canvasMask.width = size;
  canvasMask.height = size;
  const ctx = canvasMask.getContext('2d', { alpha: true });
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  const targetWidth = size * SEMANTIC_R2.targetBlockWidthRatio;
  let low = 220;
  let high = 760;
  for (let i = 0; i < 18; i += 1) {
    const mid = (low + high) * 0.5;
    ctx.font = `${SEMANTIC_R2.fontWeight} ${mid}px "${SEMANTIC_R2.fontFamily}"`;
    const width = trackedTextWidth(ctx, 'Expert', mid * SEMANTIC_R2.expertScale, SEMANTIC_R2.expertTrackingEm);
    if (width < targetWidth) low = mid; else high = mid;
  }
  const expertSize = (low + high) * 0.5;
  const proSize = expertSize * SEMANTIC_R2.proAIScale;

  ctx.font = `${SEMANTIC_R2.fontWeight} ${expertSize}px "${SEMANTIC_R2.fontFamily}"`;
  const expertMeasure = ctx.measureText('Expert');
  const expertAscent = expertMeasure.actualBoundingBoxAscent;
  const expertDescent = expertMeasure.actualBoundingBoxDescent;
  ctx.font = `${SEMANTIC_R2.fontWeight} ${proSize}px "${SEMANTIC_R2.fontFamily}"`;
  const proMeasure = ctx.measureText('ProAI');
  const proAscent = proMeasure.actualBoundingBoxAscent;
  const proDescent = proMeasure.actualBoundingBoxDescent;
  const averageCap = (expertAscent + proAscent) * 0.5;
  const lineGap = averageCap * SEMANTIC_R2.lineGapCapRatio;
  const inkHeight = proAscent + proDescent + lineGap + expertAscent + expertDescent;
  const centerX = size * (0.5 + SEMANTIC_R2.opticalOffsetXRatio);
  const centerY = size * (0.5 + SEMANTIC_R2.opticalOffsetYRatio);
  const top = centerY - inkHeight * 0.5;
  const proBaseline = top + proAscent;
  const expertTop = top + proAscent + proDescent + lineGap;
  const expertBaseline = expertTop + expertAscent;

  ctx.font = `${SEMANTIC_R2.fontWeight} ${proSize}px "${SEMANTIC_R2.fontFamily}"`;
  const proWidth = drawTrackedText(ctx, 'ProAI', centerX, proBaseline, proSize, SEMANTIC_R2.proAITrackingEm);
  ctx.font = `${SEMANTIC_R2.fontWeight} ${expertSize}px "${SEMANTIC_R2.fontFamily}"`;
  const expertWidth = drawTrackedText(ctx, 'Expert', centerX, expertBaseline, expertSize, SEMANTIC_R2.expertTrackingEm);

  const blockWidth = Math.max(proWidth, expertWidth);
  const blockHeight = inkHeight;
  semanticTypographyMetrics = {
    texturePx: size,
    fontFamily: SEMANTIC_R2.fontFamily,
    weight: SEMANTIC_R2.fontWeight,
    expertFontPx: expertSize,
    proAIFontPx: proSize,
    proAIScale: SEMANTIC_R2.proAIScale,
    expertScale: SEMANTIC_R2.expertScale,
    proAITrackingEm: SEMANTIC_R2.proAITrackingEm,
    expertTrackingEm: SEMANTIC_R2.expertTrackingEm,
    lineGapPx: lineGap,
    lineGapCapRatio: SEMANTIC_R2.lineGapCapRatio,
    blockWidthPx: blockWidth,
    blockHeightPx: blockHeight,
    blockWidthRatio: blockWidth / size,
    blockHeightRatio: blockHeight / size,
    safeLeftRatio: (centerX - blockWidth * 0.5) / size,
    safeRightRatio: (size - (centerX + blockWidth * 0.5)) / size,
    safeTopRatio: top / size,
    safeBottomRatio: (size - (top + blockHeight)) / size,
    opticalOffsetXRatio: SEMANTIC_R2.opticalOffsetXRatio,
    opticalOffsetYRatio: SEMANTIC_R2.opticalOffsetYRatio,
  };

  const texture = new THREE.CanvasTexture(canvasMask);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

function semanticFaceNormal(face) {
  const sign = face.startsWith('-') ? -1 : 1;
  const axis = face.slice(-1);
  if (axis === 'X') return new THREE.Vector3(sign, 0, 0);
  if (axis === 'Y') return new THREE.Vector3(0, sign, 0);
  return new THREE.Vector3(0, 0, sign);
}

function orientSemanticGroup(face) {
  if (!semanticGroup) return;
  const axis = face.slice(-1);
  const sign = face.startsWith('-') ? -1 : 1;
  const center = cubeCenterLocal.clone();
  const centers = latticeCenters[axis];
  const outer = Math.max(Math.abs(centers[0] - center.getComponent(AXIS_INDEX[axis])), Math.abs(centers[2] - center.getComponent(AXIS_INDEX[axis])))
    + SEMANTIC_R2.faceOffsetFromCubieCenter;
  const normal = semanticFaceNormal(face);
  semanticGroup.position.copy(center).addScaledVector(normal, outer + SEMANTIC_R2.overlayEpsilon);
  semanticGroup.quaternion.identity();
  if (face === '+X') semanticGroup.rotation.y = Math.PI * 0.5;
  else if (face === '-X') semanticGroup.rotation.y = -Math.PI * 0.5;
  else if (face === '+Y') semanticGroup.rotation.x = -Math.PI * 0.5;
  else if (face === '-Y') semanticGroup.rotation.x = Math.PI * 0.5;
  else if (face === '-Z') semanticGroup.rotation.y = Math.PI;
  semanticFace = face;
  semanticGroup.updateMatrixWorld(true);
}

function createSemanticTextMaterial(maskTexture) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    toneMapped: false,
    uniforms: {
      uMask: { value: maskTexture },
      uFormation: { value: 0 },
      uLuminance: { value: 0 },
      uSweep: { value: -0.2 },
      uExit: { value: 0 },
      uTexel: { value: new THREE.Vector2(1 / 2048, 1 / 2048) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uMask;
      uniform float uFormation;
      uniform float uLuminance;
      uniform float uSweep;
      uniform float uExit;
      uniform vec2 uTexel;
      varying vec2 vUv;
      void main() {
        float a = texture2D(uMask, vUv).a;
        float l = texture2D(uMask, vUv - vec2(uTexel.x * 1.7, 0.0)).a;
        float r = texture2D(uMask, vUv + vec2(uTexel.x * 1.7, 0.0)).a;
        float u = texture2D(uMask, vUv + vec2(0.0, uTexel.y * 1.7)).a;
        float d = texture2D(uMask, vUv - vec2(0.0, uTexel.y * 1.7)).a;
        float neighborMin = min(min(l, r), min(u, d));
        float edge = clamp(a - neighborMin, 0.0, 1.0);
        float threshold = mix(0.94, 0.02, uFormation);
        float formed = smoothstep(threshold, threshold + 0.10, a) * smoothstep(0.0, 0.18, uFormation);
        float sink = 1.0 - uExit;
        float alpha = formed * sink;
        if (alpha < 0.004) discard;

        vec3 shadowSilver = vec3(0.667, 0.694, 0.729);
        vec3 midSilver = vec3(0.796, 0.820, 0.843);
        vec3 pearl = vec3(0.886, 0.902, 0.918);
        vec3 hiPearl = vec3(0.961, 0.969, 0.973);
        vec3 color = mix(shadowSilver, midSilver, clamp(vUv.y * 0.70 + 0.16, 0.0, 1.0));
        color = mix(color, pearl, uLuminance * 0.86);
        color += edge * (0.055 + 0.075 * uLuminance);
        float sweepCoord = vUv.x * 0.86 + (1.0 - vUv.y) * 0.18;
        float sweep = exp(-pow((sweepCoord - uSweep) / 0.052, 2.0));
        color = mix(color, hiPearl, sweep * 0.72 * uLuminance);
        float microHalo = smoothstep(0.02, 0.28, a) * 0.025 * uLuminance;
        color += microHalo;
        gl_FragColor = vec4(color, alpha * (0.34 + 0.66 * uLuminance));
      }
    `,
  });
}

function setupSemanticSurface() {
  if (!sceneOne || semanticReady) return;
  const spanY = Math.abs(latticeCenters.Y[2] - latticeCenters.Y[0]) + GEOMETRY_R1.faceOuterSize;
  const spanZ = Math.abs(latticeCenters.Z[2] - latticeCenters.Z[0]) + GEOMETRY_R1.faceOuterSize;
  const faceSpan = Math.min(spanY, spanZ) * 0.998;
  const shape = roundedRectShape(faceSpan, faceSpan, GEOMETRY_R1.faceCornerRadius * 1.14);
  const surfaceGeometry = new THREE.ShapeGeometry(shape, 12);
  const surfaceMaterial = new THREE.MeshPhysicalMaterial({
    color: SEMANTIC_R2.surfaceColor,
    metalness: 0.90,
    roughness: 0.245,
    clearcoat: 0.16,
    clearcoatRoughness: 0.18,
    envMapIntensity: 1.24,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
  semanticSurface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
  semanticSurface.renderOrder = 30;

  semanticMaskTexture = createBrandMaskTexture();
  const textGeometry = new THREE.PlaneGeometry(faceSpan * 0.996, faceSpan * 0.996);
  semanticText = new THREE.Mesh(textGeometry, createSemanticTextMaterial(semanticMaskTexture));
  semanticText.position.z = SEMANTIC_R2.textEpsilon - SEMANTIC_R2.overlayEpsilon;
  semanticText.renderOrder = 31;

  semanticGroup = new THREE.Group();
  semanticGroup.name = 'SEMANTIC_BRAND_MOMENT_R2';
  semanticGroup.add(semanticSurface, semanticText);
  sceneOne.add(semanticGroup);
  orientSemanticGroup(SEMANTIC_R2.selectedFallbackFace);
  semanticReady = true;
  clearSemanticReviewState();
}

function getCurrentBestFaceVisibility() {
  if (!semanticReady) return { face: SEMANTIC_R2.selectedFallbackFace, dot: -1 };
  sceneOne.updateMatrixWorld(true);
  const centerWorld = sceneOne.localToWorld(cubeCenterLocal.clone());
  const toCamera = camera.position.clone().sub(centerWorld).normalize();
  const worldQ = sceneOne.getWorldQuaternion(new THREE.Quaternion());
  let best = { face: SEMANTIC_R2.selectedFallbackFace, dot: -Infinity };
  for (const face of ['+X', '-X', '+Y', '-Y', '+Z', '-Z']) {
    const normal = semanticFaceNormal(face).applyQuaternion(worldQ).normalize();
    const dot = normal.dot(toCamera);
    if (dot > best.dot) best = { face, dot };
  }
  return best;
}

function getSemanticPoseAt(timeSec = 0) {
  if (!captureMode || !semanticReady) return false;
  const saved = presentationRig.quaternion.clone();
  const sample = getReviewPresentationSample(timeSec);
  presentationRig.quaternion.copy(presentationQuaternionAt(sample.timeSec * 1000, THREE.MathUtils.degToRad(sample.signedYawDeg)));
  presentationRig.updateMatrixWorld(true);
  const best = getCurrentBestFaceVisibility();
  presentationRig.quaternion.copy(saved);
  presentationRig.updateMatrixWorld(true);
  return { timeSec, ...best, sample };
}

function setSemanticVisualState({ face = semanticFace, surface = 0, formation = 0, luminance = 0, sweep = -0.2, exit = 0 } = {}) {
  if (!semanticReady) return false;
  orientSemanticGroup(face);
  semanticSurfaceProgress = THREE.MathUtils.clamp(surface, 0, 1);
  semanticTextFormation = THREE.MathUtils.clamp(formation, 0, 1);
  semanticTextLuminance = THREE.MathUtils.clamp(luminance, 0, 1);
  semanticSweep = sweep;
  semanticSurface.material.opacity = SEMANTIC_R2.surfaceMaxOpacity * semanticSurfaceProgress;
  semanticSurface.material.roughness = THREE.MathUtils.lerp(0.295, 0.235, semanticSurfaceProgress);
  semanticText.material.uniforms.uFormation.value = semanticTextFormation;
  semanticText.material.uniforms.uLuminance.value = semanticTextLuminance;
  semanticText.material.uniforms.uSweep.value = semanticSweep;
  semanticText.material.uniforms.uExit.value = THREE.MathUtils.clamp(exit, 0, 1);
  semanticGroup.visible = semanticSurfaceProgress > 0.001 || semanticTextFormation > 0.001;
  return true;
}

function setSemanticReviewState(state = {}, renderFrame = true) {
  if (!captureMode || !semanticReady) return false;
  const result = setSemanticVisualState(state);
  if (result && renderFrame) renderReviewFrame();
  return result;
}

function clearSemanticReviewState() {
  if (!semanticReady) return false;
  semanticSurfaceProgress = 0;
  semanticTextFormation = 0;
  semanticTextLuminance = 0;
  semanticSweep = -0.2;
  semanticSurface.material.opacity = 0;
  semanticText.material.uniforms.uFormation.value = 0;
  semanticText.material.uniforms.uLuminance.value = 0;
  semanticText.material.uniforms.uSweep.value = -0.2;
  semanticText.material.uniforms.uExit.value = 1;
  semanticGroup.visible = false;
  return true;
}

function semanticTimelineState(elapsedMs) {
  const decel = SEMANTIC_R2.decelerationMs;
  const revealStart = SEMANTIC_R2.firstSurfaceMs;
  const revealEnd = SEMANTIC_R2.revealMs;
  const textStart = SEMANTIC_R2.firstTypographyMs;
  const specStart = 900;
  const holdEnd = revealEnd + SEMANTIC_R2.readableHoldMs;
  const exitEnd = holdEnd + SEMANTIC_R2.exitMs;
  const surfaceExitStart = holdEnd + 40;
  const surfaceExitEnd = surfaceExitStart + SEMANTIC_R2.surfaceRestoreMs;
  const accelStart = Math.max(exitEnd, surfaceExitEnd);
  const total = accelStart + SEMANTIC_R2.accelerationMs;

  let timeScale = 1;
  if (elapsedMs < decel) timeScale = 1 - smootherstep(elapsedMs / decel);
  else if (elapsedMs < accelStart) timeScale = 0;
  else if (elapsedMs < total) timeScale = smootherstep((elapsedMs - accelStart) / SEMANTIC_R2.accelerationMs);

  let surface = smootherstep((elapsedMs - revealStart) / Math.max(1, revealEnd - revealStart));
  if (elapsedMs >= surfaceExitStart) surface *= 1 - smootherstep((elapsedMs - surfaceExitStart) / SEMANTIC_R2.surfaceRestoreMs);
  let formation = smootherstep((elapsedMs - textStart) / Math.max(1, revealEnd - textStart));
  let luminance = smootherstep((elapsedMs - (textStart + 70)) / Math.max(1, revealEnd - textStart - 70));
  let exit = 0;
  if (elapsedMs >= holdEnd) {
    exit = smootherstep((elapsedMs - holdEnd) / SEMANTIC_R2.exitMs);
    formation *= 1 - exit;
    luminance *= 1 - exit;
  }
  let sweep = -0.2;
  if (elapsedMs >= specStart && elapsedMs <= specStart + SEMANTIC_R2.specularMs) {
    sweep = THREE.MathUtils.lerp(-0.15, 1.17, smootherstep((elapsedMs - specStart) / SEMANTIC_R2.specularMs));
  } else if (elapsedMs > specStart + SEMANTIC_R2.specularMs) sweep = 1.17;
  return { timeScale, surface, formation, luminance, sweep, exit, holdEnd, accelStart, total };
}

function beginSemanticRuntime(now) {
  const best = getCurrentBestFaceVisibility();
  semanticFace = best.face;
  semanticVisibilityDot = best.dot;
  semanticActive = true;
  semanticComplete = false;
  semanticBlocksSlices = true;
  semanticStartWallMs = now;
  semanticElapsedMs = 0;
  semanticEntryPresentationMs = presentationSimTimeMs;
  semanticHoldPresentationMs = null;
  semanticSchedulerEntry = { eventSerial: sliceEventSerial, eventsUntilBreath, seed: sliceSeed >>> 0 };
  orientSemanticGroup(semanticFace);
}

function updateSemanticRuntime(now) {
  if (captureMode || prefersReducedMotion || !semanticReady || semanticComplete || interactionActive) return;
  if (!semanticActive) {
    if (presentationSimTimeMs < SEMANTIC_R2.triggerSearchStartMs) return;
    if (activeTurns.size > 0) return;
    const best = getCurrentBestFaceVisibility();
    const withinPrimaryWindow = presentationSimTimeMs <= SEMANTIC_R2.triggerSearchEndMs;
    if (best.dot < SEMANTIC_R2.minimumVisibilityDot && withinPrimaryWindow) return;
    if (best.dot < SEMANTIC_R2.minimumVisibilityDot && presentationSimTimeMs < 12000) return;
    beginSemanticRuntime(now);
  }

  semanticElapsedMs = Math.max(0, now - semanticStartWallMs);
  const state = semanticTimelineState(semanticElapsedMs);
  semanticTimeScale = state.timeScale;
  setSemanticVisualState({ face: semanticFace, surface: state.surface, formation: state.formation, luminance: state.luminance, sweep: state.sweep, exit: state.exit });
  if (semanticHoldPresentationMs === null && state.timeScale <= 0.0001) semanticHoldPresentationMs = presentationSimTimeMs;
  if (semanticElapsedMs >= state.accelStart) semanticBlocksSlices = false;
  if (semanticElapsedMs >= state.total) {
    semanticTimeScale = 1;
    semanticBlocksSlices = false;
    semanticActive = false;
    semanticComplete = true;
    semanticSchedulerExit = { eventSerial: sliceEventSerial, eventsUntilBreath, seed: sliceSeed >>> 0 };
    clearSemanticReviewState();
  }
}

function getSemanticDiagnostics() {
  return {
    config: SEMANTIC_R2,
    ready: semanticReady,
    active: semanticActive,
    complete: semanticComplete,
    face: semanticFace,
    visibilityDot: semanticVisibilityDot,
    timeScale: semanticTimeScale,
    blocksSlices: semanticBlocksSlices,
    elapsedMs: semanticElapsedMs,
    entryPresentationMs: semanticEntryPresentationMs,
    holdPresentationMs: semanticHoldPresentationMs,
    schedulerEntry: semanticSchedulerEntry,
    schedulerExit: semanticSchedulerExit,
    surfaceProgress: semanticSurfaceProgress,
    textFormation: semanticTextFormation,
    textLuminance: semanticTextLuminance,
    sweep: semanticSweep,
    typography: semanticTypographyMetrics,
  };
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
  const center = new THREE.Vector3();
  mesh.geometry.boundingBox?.getSize(size);
  mesh.geometry.boundingBox?.getCenter(center);
  const dimensions = [Math.abs(size.x), Math.abs(size.y), Math.abs(size.z)].sort((a, b) => a - b);
  const isFace = dimensions[0] < dimensions[2] * 0.12;
  if (!isFace) {
    materialAssignmentCounts.smokedCore += 1;
    return coreMaterial;
  }

  mesh.updateWorldMatrix(true, false);
  const sceneLocalCenter = sceneOne.worldToLocal(mesh.localToWorld(center.clone()));
  const relative = sceneLocalCenter.sub(cubeCenterLocal);
  const ax = Math.abs(relative.x);
  const ay = Math.abs(relative.y);
  const az = Math.abs(relative.z);
  if (ay >= ax && ay >= az) {
    materialAssignmentCounts.gunmetalFace += 1;
    return faceGunmetalMaterial;
  }
  if (ax >= az) {
    materialAssignmentCounts.blackChromeFace += 1;
    return faceBlackChromeMaterial;
  }
  materialAssignmentCounts.graphiteFace += 1;
  return faceGraphiteMaterial;
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

function activeTurnList() {
  return [...activeTurns.values()];
}

function activeTurnById(turnOrId) {
  if (!turnOrId) return null;
  if (typeof turnOrId === 'string') return activeTurns.get(turnOrId) || null;
  return turnOrId.id ? activeTurns.get(turnOrId.id) || turnOrId : turnOrId;
}

function turnSafety(axis, layer) {
  const normalizedAxis = String(axis).toUpperCase();
  const selected = selectLayer(normalizedAxis, layer);
  const selectedIds = new Set(selected.map((cubie) => cubie.id));
  const conflicts = [];
  for (const existing of activeTurns.values()) {
    const existingIds = new Set(existing.cubiePlans.map((plan) => plan.cubie.id));
    const intersection = [...selectedIds].filter((id) => existingIds.has(id));
    if (existing.axis !== normalizedAxis || existing.layer === layer || intersection.length > 0) {
      conflicts.push({ turnId: existing.id, axis: existing.axis, layer: existing.layer, intersection });
    }
  }
  return { pass: conflicts.length === 0, normalizedAxis, selected, conflicts };
}

function beginTurn(axis = 'X', layer = 1, direction = 1) {
  if (activeTurns.size >= 2) throw new Error('At most two concurrent disjoint slice turns are supported');
  const normalizedDirection = direction >= 0 ? 1 : -1;
  const safety = turnSafety(axis, layer);
  if (!safety.pass) throw new Error(`Unsafe concurrent slice request: ${JSON.stringify(safety.conflicts)}`);
  const normalizedAxis = safety.normalizedAxis;
  const selected = safety.selected;
  const axisIndex = AXIS_INDEX[normalizedAxis];
  const pivot = new THREE.Group();
  const serial = ++turnSerial;
  const id = `turn-${serial}`;
  pivot.name = `R1_2_TEMP_${normalizedAxis}_${layer >= 0 ? '+' : ''}${layer}_SLICE_PIVOT_${serial}`;
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

  const turn = {
    id,
    serial,
    axis: normalizedAxis,
    layer,
    direction: normalizedDirection,
    pivot,
    targetQuaternion,
    cubiePlans,
    memberStates,
    linear: 0,
    eased: 0,
  };
  activeTurns.set(id, turn);
  setMotionState('turning');
  return turn;
}

function setTurnProgress(turnOrId, linear, { finalize = false } = {}) {
  const turn = activeTurnById(turnOrId);
  if (!turn) throw new Error('No active turn');
  const progress = THREE.MathUtils.clamp(linear, 0, 1);
  const eased = cubicBezierEase(progress);
  turn.linear = progress;
  turn.eased = eased;
  turn.pivot.quaternion.slerpQuaternions(new THREE.Quaternion(), turn.targetQuaternion, eased).normalize();
  for (const state of turn.memberStates) {
    state.member.object.position.lerpVectors(state.startLocalPosition, state.targetLocalPosition, eased);
    state.member.object.quaternion.slerpQuaternions(state.startLocalQuaternion, state.targetLocalQuaternion, eased).normalize();
    state.member.object.scale.lerpVectors(state.startLocalScale, state.targetLocalScale, eased);
    state.member.object.updateMatrix();
  }
  turn.pivot.updateMatrixWorld(true);
  if (finalize || progress >= 1) return finalizeTurn(turn);
  return { id: turn.id, axis: turn.axis, layer: turn.layer, direction: turn.direction, linear: progress, eased };
}

function finalizeTurn(turnOrId) {
  const turn = activeTurnById(turnOrId);
  if (!turn) throw new Error('No active turn to finalize');
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
  activeTurns.delete(turn.id);
  sceneOne.updateMatrixWorld(true);
  setMotionState(activeTurns.size ? 'turning' : 'rest');

  const canonical = activeTurns.size === 0 ? canonicalTransformError() : null;
  const result = {
    id: turn.id,
    serial: turn.serial,
    axis: turn.axis,
    layer: turn.layer,
    direction: turn.direction,
    endpointErrorRad: 0,
    canonical,
  };
  lastTurnResult = result;
  lastTurnResults.push(result);
  if (lastTurnResults.length > 24) lastTurnResults = lastTurnResults.slice(-24);
  return result;
}

function presentationAutonomyBlocked() {
  return interactionActive || performance.now() < manualResumeAt;
}

function sliceAutonomyBlocked() {
  return interactionActive || performance.now() < sliceResumeAt || semanticBlocksSlices;
}

function autonomyBlocked() {
  return presentationAutonomyBlocked();
}

function animateTurn(turnOrId, durationMs) {
  const turn = activeTurnById(turnOrId);
  if (!turn) return Promise.resolve(false);
  return new Promise((resolve) => {
    let elapsed = 0;
    let previous = performance.now();
    function tick(now) {
      const delta = Math.max(0, now - previous);
      previous = now;
      elapsed += delta;
      const linear = THREE.MathUtils.clamp(elapsed / Math.max(1, durationMs), 0, 1);
      if (linear >= 1) {
        resolve(setTurnProgress(turn.id, 1, { finalize: true }));
        return;
      }
      setTurnProgress(turn.id, linear);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

async function turnSlice({ axis = 'X', layer = 1, direction = 1, durationMs = null, durationScale = 1, instant = false, ignoreInteraction = false } = {}) {
  if (!api.ready) return false;
  if (!ignoreInteraction && sliceAutonomyBlocked()) return false;
  let turn;
  try {
    turn = beginTurn(axis, layer, direction);
  } catch (error) {
    if (String(error).includes('Unsafe concurrent slice request') || String(error).includes('At most two concurrent')) return false;
    throw error;
  }
  if (instant) return setTurnProgress(turn.id, 1, { finalize: true });
  const baseDuration = durationMs ?? (MOTION.turnDurationRangeMs[0] + MOTION.turnDurationRangeMs[1]) / 2;
  return animateTurn(turn.id, Math.max(1, baseDuration * durationScale));
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

async function runPairedTurnQA() {
  const startState = snapshotLogicalState();
  while (activeTurns.size) await sleep(10);
  const pairAxis = 'X';
  const layers = [-1, 1];
  const selectedA = selectLayer(pairAxis, layers[0]);
  const selectedB = selectLayer(pairAxis, layers[1]);
  const idsA = new Set(selectedA.map((cubie) => cubie.id));
  const intersection = selectedB.map((cubie) => cubie.id).filter((id) => idsA.has(id));

  const a = beginTurn(pairAxis, layers[0], 1);
  const b = beginTurn(pairAxis, layers[1], -1);
  const simultaneousCount = activeTurns.size;
  const pivotMembersA = new Set(a.memberStates.map((state) => state.member.object.uuid));
  const memberIntersection = b.memberStates.map((state) => state.member.object.uuid).filter((id) => pivotMembersA.has(id));
  const forwardA = setTurnProgress(a.id, 1, { finalize: true });
  const forwardB = setTurnProgress(b.id, 1, { finalize: true });
  const afterForward = snapshotLogicalState();

  const ia = beginTurn(pairAxis, layers[0], -1);
  const ib = beginTurn(pairAxis, layers[1], 1);
  const inverseA = setTurnProgress(ia.id, 1, { finalize: true });
  const inverseB = setTurnProgress(ib.id, 1, { finalize: true });
  const restored = snapshotLogicalState();
  const restorationLogical = maxLogicalStateError(startState, restored);
  const restorationCanonical = canonicalTransformError();
  const changed = maxLogicalStateError(startState, afterForward);

  return {
    sameAxis: pairAxis,
    distinctLayers: layers[0] !== layers[1],
    physicalCubieIntersectionCount: intersection.length,
    memberObjectIntersectionCount: memberIntersection.length,
    simultaneousActiveTurns: simultaneousCount,
    forwardEndpointErrors: [forwardA.endpointErrorRad, forwardB.endpointErrorRad],
    inverseEndpointErrors: [inverseA.endpointErrorRad, inverseB.endpointErrorRad],
    logicalStateChangedAfterForward: changed.coordinateMismatch > 0 || changed.orientationMismatch > 0,
    restorationLogical,
    restorationCanonical,
    pass: layers[0] !== layers[1]
      && intersection.length === 0
      && memberIntersection.length === 0
      && simultaneousCount === 2
      && forwardA.endpointErrorRad === 0
      && forwardB.endpointErrorRad === 0
      && inverseA.endpointErrorRad === 0
      && inverseB.endpointErrorRad === 0
      && restorationLogical.coordinateMismatch === 0
      && restorationLogical.orientationMismatch === 0
      && restorationCanonical.maxPosition < 1e-6
      && restorationCanonical.maxQuaternionRad < 1e-6
      && restorationCanonical.maxScale < 1e-8,
  };
}

async function runAutomatedQA() {
  const wasEnabled = sliceSchedulerEnabled;
  sliceSchedulerEnabled = false;
  while (activeTurns.size) await sleep(10);
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
  const pairedTurnQA = await runPairedTurnQA();

  if (wasEnabled && !captureMode && !prefersReducedMotion) {
    sliceSchedulerEnabled = true;
    void sliceSchedulerLoop();
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
    pairedTurnQA,
    startCanonical,
  };
}

function presentationVelocityAt(timeMs) {
  const cycle = PRESENTATION_R1_2.velocityCycleMs;
  let local = timeMs % cycle;
  if (local < 0) local += cycle;
  const keys = PRESENTATION_R1_2.velocityKeyframes;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const a = keys[i];
    const b = keys[i + 1];
    if (local <= b.timeMs) {
      const p = smoothstep((local - a.timeMs) / Math.max(1, b.timeMs - a.timeMs));
      return THREE.MathUtils.lerp(a.velocityDegPerSec, b.velocityDegPerSec, p);
    }
  }
  return keys[0].velocityDegPerSec;
}

function presentationPitchRollAt(timeMs) {
  const pitch = THREE.MathUtils.degToRad(
    8.65 * Math.sin((timeMs / PRESENTATION_R1_2.pitchPrimaryPeriodMs) * Math.PI * 2 + 0.42)
    + 1.55 * Math.sin((timeMs / PRESENTATION_R1_2.pitchSecondaryPeriodMs) * Math.PI * 2 + 1.18),
  );
  const roll = THREE.MathUtils.degToRad(
    1.92 * Math.sin((timeMs / PRESENTATION_R1_2.rollPrimaryPeriodMs) * Math.PI * 2 + 1.35)
    + 0.48 * Math.sin((timeMs / PRESENTATION_R1_2.rollSecondaryPeriodMs) * Math.PI * 2 + 2.20),
  );
  return { pitch, roll };
}

function presentationQuaternionAt(timeMs, yawRad) {
  const { pitch, roll } = presentationPitchRollAt(timeMs);
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yawRad, roll, 'YXZ')).normalize();
}

function integratePresentationYawDeg(timeMs) {
  const stepMs = 10;
  let elapsed = 0;
  let yawDeg = 0;
  while (elapsed < timeMs) {
    const dt = Math.min(stepMs, timeMs - elapsed);
    yawDeg += presentationVelocityAt(elapsed + dt * 0.5) * (dt / 1000);
    elapsed += dt;
  }
  return yawDeg;
}

function getReviewPresentationSample(timeSec = 0) {
  const timeMs = Math.max(0, timeSec) * 1000;
  const signedYawDeg = integratePresentationYawDeg(timeMs);
  const velocityDegPerSec = presentationVelocityAt(timeMs);
  const { pitch, roll } = presentationPitchRollAt(timeMs);
  return {
    timeSec,
    signedYawDeg,
    cumulativeYawDeg: Math.abs(signedYawDeg),
    velocityDegPerSec,
    pitchDeg: THREE.MathUtils.radToDeg(pitch),
    rollDeg: THREE.MathUtils.radToDeg(roll),
  };
}

function updatePresentationMotion(now) {
  if (!api.ready || captureMode || prefersReducedMotion) return;
  if (!presentationLastNow) {
    presentationLastNow = now;
    lastPresentationQuaternion.copy(presentationRig.quaternion);
    return;
  }
  const wallDeltaMs = Math.min(80, Math.max(0, now - presentationLastNow));
  presentationLastNow = now;
  if (presentationAutonomyBlocked()) {
    presentationFrameDeltaRad = 0;
    lastPresentationQuaternion.copy(presentationRig.quaternion);
    return;
  }

  const deltaMs = wallDeltaMs * semanticTimeScale;
  presentationSimTimeMs += deltaMs;
  presentationYawVelocityDegPerSec = presentationVelocityAt(presentationSimTimeMs);
  const yawStepDeg = presentationYawVelocityDegPerSec * (deltaMs / 1000);
  presentationYawRad += THREE.MathUtils.degToRad(yawStepDeg);
  presentationSignedYawDeg += yawStepDeg;
  presentationCumulativeYawDeg += Math.abs(yawStepDeg);
  const target = presentationQuaternionAt(presentationSimTimeMs, presentationYawRad);
  const before = presentationRig.quaternion.clone();

  if (presentationResumeStart > 0 && now < presentationResumeStart + MOTION.manualResumeBlendMs) {
    const progress = smoothstep((now - presentationResumeStart) / MOTION.manualResumeBlendMs);
    presentationRig.quaternion.slerpQuaternions(presentationResumeFrom, target, progress).normalize();
  } else {
    presentationRig.quaternion.copy(target);
    if (presentationResumeStart > 0) presentationResumeStart = 0;
  }
  presentationFrameDeltaRad = before.angleTo(presentationRig.quaternion);
  lastPresentationQuaternion.copy(presentationRig.quaternion);
}

function seededUnit() {
  let x = sliceSeed >>> 0;
  x ^= (x << 13) >>> 0;
  x ^= x >>> 17;
  x ^= (x << 5) >>> 0;
  sliceSeed = x >>> 0;
  return sliceSeed / 4294967296;
}

function seededRange(min, max) {
  return min + (max - min) * seededUnit();
}

function seededInt(min, maxInclusive) {
  return Math.floor(seededRange(min, maxInclusive + 1));
}

function makeScheduledMove(axis = null, layer = null) {
  const selectedAxis = axis || AXES[sliceEventSerial % AXES.length];
  const selectedLayer = layer ?? LAYERS[seededInt(0, LAYERS.length - 1)];
  return {
    axis: selectedAxis,
    layer: selectedLayer,
    direction: seededUnit() < 0.5 ? -1 : 1,
    durationMs: Math.round(seededRange(...SLICE_R1_2.turnDurationRangeMs)),
  };
}

async function waitForSliceAutonomy() {
  while (sliceSchedulerEnabled && sliceAutonomyBlocked()) await sleep(40);
  return sliceSchedulerEnabled;
}

async function schedulerDelay(durationMs) {
  let elapsed = 0;
  let previous = performance.now();
  while (elapsed < durationMs && sliceSchedulerEnabled) {
    await sleep(Math.min(32, Math.max(8, durationMs - elapsed)));
    const now = performance.now();
    const delta = now - previous;
    previous = now;
    if (!sliceAutonomyBlocked()) elapsed += delta;
  }
}

async function runSingleScheduledEvent() {
  if (!await waitForSliceAutonomy()) return false;
  const axis = AXES[sliceEventSerial % AXES.length];
  const move = makeScheduledMove(axis);
  return turnSlice(move);
}

async function runPairedScheduledEvent() {
  if (!await waitForSliceAutonomy()) return false;
  const axis = AXES[sliceEventSerial % AXES.length];
  const firstLayer = LAYERS[seededInt(0, 2)];
  const otherLayers = LAYERS.filter((value) => value !== firstLayer);
  const secondLayer = otherLayers[seededInt(0, otherLayers.length - 1)];
  const firstMove = makeScheduledMove(axis, firstLayer);
  const secondMove = makeScheduledMove(axis, secondLayer);
  const firstPromise = turnSlice(firstMove);
  const staggerMs = Math.round(seededRange(...SLICE_R1_2.pairedStaggerRangeMs));
  await sleep(staggerMs);
  if (sliceAutonomyBlocked() || !sliceSchedulerEnabled) {
    await firstPromise;
    return true;
  }
  const secondPromise = turnSlice(secondMove);
  await Promise.all([firstPromise, secondPromise]);
  return true;
}

async function runPhraseScheduledEvent() {
  const phraseLength = seededUnit() < 0.72 ? 2 : 3;
  for (let i = 0; i < phraseLength; i += 1) {
    if (!await waitForSliceAutonomy()) return false;
    const axis = AXES[(sliceEventSerial + i) % AXES.length];
    const move = makeScheduledMove(axis);
    await turnSlice(move);
    if (i < phraseLength - 1) await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)));
  }
  return true;
}

async function sliceSchedulerLoop() {
  if (sliceSchedulerRunning) return;
  sliceSchedulerRunning = true;
  await schedulerDelay(420);
  while (sliceSchedulerEnabled) {
    if (!await waitForSliceAutonomy()) break;
    const eventType = SLICE_R1_2.eventPattern[sliceEventSerial % SLICE_R1_2.eventPattern.length];
    if (eventType === 'pair') await runPairedScheduledEvent();
    else if (eventType === 'phrase') await runPhraseScheduledEvent();
    else await runSingleScheduledEvent();
    sliceEventSerial += 1;
    eventsUntilBreath -= 1;
    if (!sliceSchedulerEnabled) break;
    if (eventsUntilBreath <= 0) {
      await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.breathingGapRangeMs)));
      eventsUntilBreath = seededInt(3, 4);
    } else {
      await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.typicalGapRangeMs)));
    }
  }
  sliceSchedulerRunning = false;
}

function getInteractionState() {
  const now = performance.now();
  return {
    interactionActive,
    autonomyBlocked: presentationAutonomyBlocked(),
    sliceAutonomyBlocked: sliceAutonomyBlocked(),
    resumeDelayRemainingMs: Math.max(0, manualResumeAt - now),
    sliceResumeDelayRemainingMs: Math.max(0, sliceResumeAt - now),
    presentationResumeActive: presentationResumeStart > 0 && now >= presentationResumeStart && now < presentationResumeStart + MOTION.manualResumeBlendMs,
    cameraPosition: camera.position.toArray(),
    presentationQuaternion: presentationRig.quaternion.toArray(),
  };
}

controls.addEventListener('start', () => {
  interactionActive = true;
  frozenPresentationQuaternion.copy(presentationRig.quaternion);
  presentationResumeFrom.copy(presentationRig.quaternion);
  manualResumeAt = Infinity;
  sliceResumeAt = Infinity;
  presentationResumeStart = 0;
});

controls.addEventListener('end', () => {
  interactionActive = false;
  const now = performance.now();
  manualResumeAt = now + MOTION.manualResumeDelayMs;
  sliceResumeAt = manualResumeAt + MOTION.sliceResumeStaggerMs;
  presentationResumeStart = manualResumeAt;
  presentationResumeFrom.copy(presentationRig.quaternion);
});

function beginReviewTurn(axis, layer, direction) {
  if (!captureMode || !api.ready) return false;
  const turn = beginTurn(axis, layer, direction);
  reviewTurnIds.push(turn.id);
  return { id: turn.id, axis: turn.axis, layer: turn.layer, direction: turn.direction };
}

function setReviewTurnProgress(turnId, linear, renderFrame = true) {
  if (!captureMode) return false;
  const progress = THREE.MathUtils.clamp(linear, 0, 1);
  const result = setTurnProgress(turnId, progress, { finalize: progress >= 1 });
  if (progress >= 1) reviewTurnIds = reviewTurnIds.filter((id) => id !== turnId);
  if (renderFrame) renderReviewFrame();
  return result;
}

function beginReviewPair(axis = 'X', layerA = -1, layerB = 1, directionA = 1, directionB = -1) {
  if (!captureMode || !api.ready || layerA === layerB) return false;
  const a = beginTurn(axis, layerA, directionA);
  const b = beginTurn(axis, layerB, directionB);
  reviewTurnIds.push(a.id, b.id);
  return [{ id: a.id, axis: a.axis, layer: a.layer, direction: a.direction }, { id: b.id, axis: b.axis, layer: b.layer, direction: b.direction }];
}

function setReviewPairProgress(turnIds, progressA, progressB = progressA) {
  if (!captureMode || !Array.isArray(turnIds) || turnIds.length !== 2) return false;
  const pa = THREE.MathUtils.clamp(progressA, 0, 1);
  const pb = THREE.MathUtils.clamp(progressB, 0, 1);
  const a = activeTurns.has(turnIds[0]) ? setTurnProgress(turnIds[0], pa, { finalize: pa >= 1 }) : null;
  const b = activeTurns.has(turnIds[1]) ? setTurnProgress(turnIds[1], pb, { finalize: pb >= 1 }) : null;
  if (pa >= 1) reviewTurnIds = reviewTurnIds.filter((id) => id !== turnIds[0]);
  if (pb >= 1) reviewTurnIds = reviewTurnIds.filter((id) => id !== turnIds[1]);
  renderReviewFrame();
  return [a, b];
}

function setReviewPresentation(timeSec = 0, resumeProgress = 1, renderFrame = true) {
  if (!captureMode || !api.ready) return false;
  const sample = getReviewPresentationSample(timeSec);
  const target = presentationQuaternionAt(sample.timeSec * 1000, THREE.MathUtils.degToRad(sample.signedYawDeg));
  if (resumeProgress < 1) {
    const progress = smoothstep(resumeProgress);
    presentationRig.quaternion.slerpQuaternions(frozenPresentationQuaternion, target, progress).normalize();
  } else {
    presentationRig.quaternion.copy(target);
  }
  if (renderFrame) renderReviewFrame();
  return { ...sample, quaternion: presentationRig.quaternion.toArray() };
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
  configureStudioLighting(centerWorld, radius);
  controls.update();
}

function getBaselineComparableState() {
  scene.updateMatrixWorld(true);
  return {
    presentationRig: {
      position: presentationRig.position.toArray(),
      quaternion: presentationRig.quaternion.toArray(),
      scale: presentationRig.scale.toArray(),
    },
    cubeRoot: cubeRoot ? {
      position: cubeRoot.position.toArray(),
      quaternion: cubeRoot.quaternion.toArray(),
      scale: cubeRoot.scale.toArray(),
    } : null,
    logical: snapshotLogicalState(),
    activeTurns: activeTurnList().map((turn) => ({ axis: turn.axis, layer: turn.layer, direction: turn.direction, linear: turn.linear, eased: turn.eased })),
    completedTurns: lastTurnResults.map((turn) => ({ axis: turn.axis, layer: turn.layer, direction: turn.direction, endpointErrorRad: turn.endpointErrorRad })),
    scheduler: { enabled: sliceSchedulerEnabled, running: sliceSchedulerRunning, eventSerial: sliceEventSerial, eventsUntilBreath, seed: sliceSeed >>> 0 },
    camera: {
      position: camera.position.toArray(),
      quaternion: camera.quaternion.toArray(),
      target: controls.target.toArray(),
    },
  };
}

function getDiagnostics() {
  return {
    ready: api.ready,
    motionState,
    hierarchy: api.hierarchy,
    mechanics: api.mechanics,
    motionConfig: MOTION,
    presentationConfig: PRESENTATION_R1_2,
    sliceConfig: SLICE_R1_2,
    presentation: {
      simTimeMs: presentationSimTimeMs,
      signedYawDeg: presentationSignedYawDeg,
      cumulativeYawDeg: presentationCumulativeYawDeg,
      yawVelocityDegPerSec: presentationYawVelocityDegPerSec,
      frameAngularDeltaRad: presentationFrameDeltaRad,
      quaternion: presentationRig.quaternion.toArray(),
    },
    activeTurns: activeTurnList().map((turn) => ({
      id: turn.id,
      serial: turn.serial,
      axis: turn.axis,
      layer: turn.layer,
      direction: turn.direction,
      linear: turn.linear,
      eased: turn.eased,
      physicalCubieIds: turn.cubiePlans.map((plan) => plan.cubie.id),
    })),
    lastTurnResult,
    lastTurnResults: [...lastTurnResults],
    interaction: getInteractionState(),
    scheduler: {
      enabled: sliceSchedulerEnabled,
      running: sliceSchedulerRunning,
      eventSerial: sliceEventSerial,
      eventsUntilBreath,
    },
    canonicalError: api.ready && activeTurns.size === 0 ? canonicalTransformError() : null,
    geometry: api.geometry,
    geometryConfig: GEOMETRY_R1,
    lookDev: {
      config: LOOKDEV_R1,
      activePreset: activeLookDevPreset,
      materialAssignments: { ...materialAssignmentCounts },
      lighting: resolvedLighting,
      environment: LOOKDEV_R1.environment,
      colorManagement: LOOKDEV_R1.colorManagement,
      postprocessing: LOOKDEV_R1.postprocessing,
      materialTypes: Object.fromEntries(Object.entries(premiumMaterials).map(([name, material]) => [name, material.type])),
    },
    semanticR2: getSemanticDiagnostics(),
    renderer: {
      webgl2: renderer.capabilities.isWebGL2,
      pixelRatio: renderer.getPixelRatio(),
      calls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
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
  updateSemanticRuntime(now);
  updatePresentationMotion(now);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
if (!captureMode) requestAnimationFrame(render);

const loader = new GLTFLoader();
loader.load(
  GLB_URL,
  async (gltf) => {
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
    materialAssignmentCounts = { graphiteFace: 0, gunmetalFace: 0, blackChromeFace: 0, smokedCore: 0 };
    cubeRoot.updateMatrixWorld(true);
    cubeRoot.traverse((object) => {
      if (object.isMesh && object.name !== 'Plane') {
        object.material = classifyReviewMaterial(object);
        object.castShadow = false;
        object.receiveShadow = false;
      }
    });
    frameCamera();
    resize();
    await instrumentFontReady;
    setupSemanticSurface();
    if (captureMode) renderReviewFrame();

    api.ready = true;
    setMotionState('rest');
    status.textContent = 'Three.js GLB loaded. Approved Cube baseline + Semantic Brand Moment R2 ready.';
    if (sliceSchedulerEnabled) void sliceSchedulerLoop();
  },
  undefined,
  (error) => {
    console.error('GLB load failed', error);
    setMotionState('error');
    status.textContent = 'GLB load failed';
  },
);
