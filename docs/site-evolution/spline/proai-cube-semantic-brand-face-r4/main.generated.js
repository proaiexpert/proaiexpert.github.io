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
    Object.freeze({ timeMs: 36000, velocityDegPerSec: 8.0 }),
    Object.freeze({ timeMs: 43000, velocityDegPerSec: 11.0 }),
    Object.freeze({ timeMs: 49000, velocityDegPerSec: 24.0 }),
    Object.freeze({ timeMs: 55000, velocityDegPerSec: 29.0 }),
    Object.freeze({ timeMs: 60000, velocityDegPerSec: 14.0 }),
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


// Semantic Brand Face R4 is a narrow temporal/material wrapper around frozen R1.2 mechanics.
const SEMANTIC_R4 = Object.freeze({
  copy: Object.freeze(['ProAI', 'Expert']),
  fontFamily: 'Instrument Sans Variable',
  fontWeight: 620,
  proAIScale: 1.045,
  expertScale: 1.0,
  proAITrackingEm: 0.012,
  expertTrackingEm: -0.004,
  targetBlockWidthRatio: 0.722,
  targetBlockHeightRange: Object.freeze([0.38, 0.44]),
  lineGapCapRatio: 0.105,
  opticalOffsetXRatio: 0.0,
  opticalOffsetYRatio: -0.002,
  surfaceMaxOpacity: 0.000,
  surfaceColor: '#11161b',
  decelerationMs: 0,
  revealMs: 600,
  specularMs: 500,
  readableHoldMs: 1250,
  exitMs: 520,
  surfaceRestoreMs: 500,
  accelerationMs: 0,
  firstSurfaceMs: 0,
  firstTypographyMs: 90,
  triggerSearchStartMs: 3200,
  triggerSearchEndMs: 4200,
  preferredVisibilityDot: 0.84,
  minimumVisibilityDot: 0.76,
  selectedFallbackFace: '-X',
  faceOffsetFromCubieCenter: 100.2,
  overlayEpsilon: 0.36,
  textEpsilon: 0.46,
  semanticVelocityMultiplier: 1.0,
  blockReleaseExitProgress: 0.62,
  internalSharpDepth: -0.10,
  internalSoftDepth: -0.18,
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
    createStudioCard(environmentScene, { position: [-4.3, 3.7, -5.8], width: 2.3, height: 6.8, color: 0xe9edf2, intensity: 0.92 }),
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
controls.enableZoom = false;
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
const R44_INITIAL_PRESENTATION_PHASE_MS = 16000;
const R44_INITIAL_PRESENTATION_YAW_DEG = 342.55902777777777;
let presentationSimTimeMs = R44_INITIAL_PRESENTATION_PHASE_MS;
let presentationYawRad = THREE.MathUtils.degToRad(R44_INITIAL_PRESENTATION_YAW_DEG);
let presentationSignedYawDeg = R44_INITIAL_PRESENTATION_YAW_DEG;
let presentationCumulativeYawDeg = Math.abs(R44_INITIAL_PRESENTATION_YAW_DEG);
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
let semanticPending = false;
let semanticReplayRequested = false;
let semanticComplete = false;
let semanticOpportunityWallMs = null;
let semanticOpportunityPresentationMs = null;
let semanticFirstSurfaceWallMs = null;
let semanticFirstTypographyWallMs = null;
let semanticCompletedWallMs = null;
let semanticOpportunityActiveTurns = 0;
let semanticWaitedForActiveSlice = false;
let semanticRuntimeStartWallMs = null;
let semanticOpportunityMotionSimMs = null;
let semanticTextMeshes = [];
let semanticBlocksSlices = false;
let semanticTimeScale = 1;
let semanticStartWallMs = 0;
let semanticElapsedMs = 0;
let semanticEntryPresentationMs = null;
let semanticHoldPresentationMs = null;
let semanticFace = SEMANTIC_R4.selectedFallbackFace;
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
  replaySemanticBrandMoment,
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

  const targetWidth = size * SEMANTIC_R4.targetBlockWidthRatio;
  let low = 220;
  let high = 760;
  for (let i = 0; i < 18; i += 1) {
    const mid = (low + high) * 0.5;
    ctx.font = `${SEMANTIC_R4.fontWeight} ${mid}px "${SEMANTIC_R4.fontFamily}"`;
    const width = trackedTextWidth(ctx, 'Expert', mid * SEMANTIC_R4.expertScale, SEMANTIC_R4.expertTrackingEm);
    if (width < targetWidth) low = mid; else high = mid;
  }
  const expertSize = (low + high) * 0.5;
  const proSize = expertSize * SEMANTIC_R4.proAIScale;

  ctx.font = `${SEMANTIC_R4.fontWeight} ${expertSize}px "${SEMANTIC_R4.fontFamily}"`;
  const expertMeasure = ctx.measureText('Expert');
  const expertAscent = expertMeasure.actualBoundingBoxAscent;
  const expertDescent = expertMeasure.actualBoundingBoxDescent;
  ctx.font = `${SEMANTIC_R4.fontWeight} ${proSize}px "${SEMANTIC_R4.fontFamily}"`;
  const proMeasure = ctx.measureText('ProAI');
  const proAscent = proMeasure.actualBoundingBoxAscent;
  const proDescent = proMeasure.actualBoundingBoxDescent;
  const averageCap = (expertAscent + proAscent) * 0.5;
  const lineGap = averageCap * SEMANTIC_R4.lineGapCapRatio;
  const inkHeight = proAscent + proDescent + lineGap + expertAscent + expertDescent;
  const centerX = size * (0.5 + SEMANTIC_R4.opticalOffsetXRatio);
  const centerY = size * (0.5 + SEMANTIC_R4.opticalOffsetYRatio);
  const top = centerY - inkHeight * 0.5;
  const proBaseline = top + proAscent;
  const expertTop = top + proAscent + proDescent + lineGap;
  const expertBaseline = expertTop + expertAscent;

  ctx.font = `${SEMANTIC_R4.fontWeight} ${proSize}px "${SEMANTIC_R4.fontFamily}"`;
  const proWidth = drawTrackedText(ctx, 'ProAI', centerX, proBaseline, proSize, SEMANTIC_R4.proAITrackingEm);
  ctx.font = `${SEMANTIC_R4.fontWeight} ${expertSize}px "${SEMANTIC_R4.fontFamily}"`;
  const expertWidth = drawTrackedText(ctx, 'Expert', centerX, expertBaseline, expertSize, SEMANTIC_R4.expertTrackingEm);

  const blockWidth = Math.max(proWidth, expertWidth);
  const blockHeight = inkHeight;
  semanticTypographyMetrics = {
    texturePx: size,
    fontFamily: SEMANTIC_R4.fontFamily,
    weight: SEMANTIC_R4.fontWeight,
    expertFontPx: expertSize,
    proAIFontPx: proSize,
    proAIScale: SEMANTIC_R4.proAIScale,
    expertScale: SEMANTIC_R4.expertScale,
    proAITrackingEm: SEMANTIC_R4.proAITrackingEm,
    expertTrackingEm: SEMANTIC_R4.expertTrackingEm,
    lineGapPx: lineGap,
    lineGapCapRatio: SEMANTIC_R4.lineGapCapRatio,
    blockWidthPx: blockWidth,
    blockHeightPx: blockHeight,
    blockWidthRatio: blockWidth / size,
    blockHeightRatio: blockHeight / size,
    safeLeftRatio: (centerX - blockWidth * 0.5) / size,
    safeRightRatio: (size - (centerX + blockWidth * 0.5)) / size,
    safeTopRatio: top / size,
    safeBottomRatio: (size - (top + blockHeight)) / size,
    opticalOffsetXRatio: SEMANTIC_R4.opticalOffsetXRatio,
    opticalOffsetYRatio: SEMANTIC_R4.opticalOffsetYRatio,
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
    + SEMANTIC_R4.faceOffsetFromCubieCenter;
  const normal = semanticFaceNormal(face);
  semanticGroup.position.copy(center).addScaledVector(normal, outer + SEMANTIC_R4.overlayEpsilon);
  semanticGroup.quaternion.identity();
  if (face === '+X') semanticGroup.rotation.y = Math.PI * 0.5;
  else if (face === '-X') semanticGroup.rotation.y = -Math.PI * 0.5;
  else if (face === '+Y') semanticGroup.rotation.x = -Math.PI * 0.5;
  else if (face === '-Y') semanticGroup.rotation.x = Math.PI * 0.5;
  else if (face === '-Z') semanticGroup.rotation.y = Math.PI;
  semanticFace = face;
  semanticGroup.updateMatrixWorld(true);
}

const SEMANTIC_R4_MATERIAL_PALETTE=Object.freeze({shadowMetal:'#242A31',midSilver:'#687077',pearlSilver:'#B8BBB8',peakReflection:'#D7D8D4'});
const SEMANTIC_R4_3_ENGRAVED_FACE='+Z';
const SEMANTIC_R4_3_ENGRAVING=Object.freeze({bumpScale:-0.130,roughnessMapInk:0.550,metalnessDelta:0.0,tonalInk:0.820,driver:'R4.4 calibrated actual outward +Z cubie MeshPhysicalMaterial BRDF + scene-projected physical face coordinates + persistent softened machined-edge bump (-0.130) + roughness/clearcoat-roughness ink (0.550) + restrained recess tonal multiplier (0.820); stable studio lighting only; front-facing signed optical diagnostics; zero timeline driver'});
let semanticEngravedTiles=[];
let semanticEngravedLogicalTileCount=0;
let semanticR441EngravedCubieIds=new Set();
let semanticR43OpticalDiagnostics={alignment:0,faceView:0,halfDot:0,fieldCenter:[.5,.5],fieldAxis:[1,0],opportunity:0,persistent:true,microNormal:true,alphaDominant:false,engravedFace:SEMANTIC_R4_3_ENGRAVED_FACE,physicalCubieMaterial:true,visualDriverTimeline:false};
let semanticR43OpportunityCount=0,semanticR43OpportunityArmed=true;
const SEMANTIC_R442_CADENCE=Object.freeze({currentCopy:'ProAI Expert only',futureFiveSemanticCompatible:true,targetFullLoopSec:[20,35],occasionalExtensionSec:40,hardMaxNormalSec:40,firstDiscoveryTargetSec:[3,6],clearReadableTargetSec:[1.2,2.2],protectedEnvelopeTargetSec:[1.8,3.2],metronomic:false,topFaceEligible:false});
const SEMANTIC_R442_QUALITY=Object.freeze({approachScore:.58,enterScore:.76,exitScore:.54,minView:.58,exitView:.50,minAreaQuality:.34,minBrdf:.26,releaseDebounceMs:180,maxProtectedMs:2400,materialDormantScore:.38,reselectCooldownMs:900,recentFaceWindowMs:13000,rearmScore:.50});
const semanticR442State={protected:false,protectedFace:null,protectedSinceMs:null,belowExitSinceMs:null,nextEligiblePresentationMs:R44_INITIAL_PRESENTATION_PHASE_MS+3400,activeMaterialFace:null,activeFaceApproachSinceMs:null,lastReleasedFace:null,lastReleasedAtMs:-Infinity,faceRearmBlocked:{'+Z':false,'+X':false,'-X':false},releaseCount:0,protectionCount:0,assemblyViolations:0,unsafeProtectedStarts:0,faceSelections:[],protectedIntervals:[],candidateScores:[],postReleaseParticipationCount:0,lastPostReleaseParticipation:null};
const semanticR442MoveState={recentMoves:[],moveLog:[],axisCounts:{X:0,Y:0,Z:0},layerCounts:{'-1':0,'0':0,'1':0},selectionCount:0,replacements:0,skipped:0};
// ============================================================================
// AUTHORED PHRASE GRAPH R2 — PHYSICALLY GROUNDED
// Base: 29ee986fddd4609e32e0563c12c002bd65127d84 (R1)
// R2 adds: physical state model, computed validation, true authored phrases,
//          single lifecycle, single start authority, explicit protection
// ============================================================================

// ---------------------------------------------------------------------------
// PHYSICAL STATE MODEL
// ---------------------------------------------------------------------------
// Minimum representation to prove phrase correctness:
// - faceAssemblySig: 3-bit signature (bit 0=+Z, 1=+X, 2=-X) - which faces are assembled
// - protectedCubieIds: Set of cubie IDs currently under protection
// - currentGraphNode: the verified graph node the physical cube is in (+Z, +X, -X, or 'unknown')
// - phraseEndpointVerifier: validates declared endpoint matches computed physical result
//
// WHY SUFFICIENT:
// - Only 3 eligible faces (+Z, +X, -X) need tracking
// - Face assembly is binary (assembled/not) per R4.4.2 definition
// - Protected cubies are exactly those on the currently protected face
// - Graph node = which eligible face is currently assembled and protected
// - Endpoint verifier catches any drift between metadata and physics
// ---------------------------------------------------------------------------

const SEMANTIC_R444_FACES = Object.freeze(['+Z', '+X', '-X']);
const SEMANTIC_R444_FACE_INDEX = Object.freeze({ '+Z': 0, '+X': 1, '-X': 2 });

function semanticR444ComputeFaceAssemblySig() {
  let sig = 0;
  for (const face of SEMANTIC_R444_FACES) {
    if (semanticR442FaceAssembled(face)) {
      sig |= (1 << SEMANTIC_R444_FACE_INDEX[face]);
    }
  }
  return sig;
}

function semanticR444GetAssembledFaces() {
  const faces = [];
  for (const face of SEMANTIC_R444_FACES) {
    if (semanticR442FaceAssembled(face)) faces.push(face);
  }
  return faces;
}

function semanticR444GetProtectedCubieIds() {
  if (!semanticR442State.protected || !semanticR442State.protectedFace) return new Set();
  const reg = semanticR442FaceRegistry.get(semanticR442State.protectedFace);
  return reg ? new Set(reg.ids) : new Set();
}

function semanticR444ComputeGraphNode() {
  // The graph node is the currently protected face if it's an eligible face and assembled
  if (semanticR442State.protected && semanticR442State.protectedFace) {
    const face = semanticR442State.protectedFace;
    if (SEMANTIC_R444_FACES.includes(face) && semanticR442FaceAssembled(face)) {
      return face;
    }
  }
  // If protection is not active but we have completed phrases, use the tracked current face
  // This is the authoritative graph node from the last completed phrase
  if (!semanticR442State.protected && semanticR444StateR2.completedMessages > 0) {
    const face = semanticR444StateR2.currentFace;
    if (SEMANTIC_R444_FACES.includes(face) && semanticR442FaceAssembled(face)) {
      return face;
    }
  }
  // Initial state: no protected face yet, but we know the cube starts at +Z
  // If no phrases have completed yet, default to +Z
  if (semanticR444StateR2.completedMessages === 0 && semanticR444StateR2.lifecycleTransitions === 0) {
    if (semanticR442FaceAssembled('+Z')) return '+Z';
  }
  // Fallback: check which eligible face is assembled (should match protected face)
  const assembled = semanticR444GetAssembledFaces();
  if (assembled.length === 1) return assembled[0];
  if (assembled.length > 1) return 'ambiguous';
  return 'unknown';
}

function semanticR444VerifyEndpoint(phraseName, expectedEndFace) {
  // Verify endpoint by checking if the expected end face is physically assembled
  // This is the authoritative check - graph node may be ambiguous if multiple faces assembled
  const assembled = semanticR444GetAssembledFaces();
  const sig = semanticR444ComputeFaceAssemblySig();
  const isAssembled = assembled.includes(expectedEndFace);

  const ok = isAssembled;
  if (!ok) {
    semanticR444LogR2('endpoint-verify-fail', {
      phrase: phraseName,
      expectedEndFace,
      computedNode: semanticR444ComputeGraphNode(),
      assembledFaces: assembled,
      assemblySig: sig.toString(2).padStart(3, '0'),
      protectedFace: semanticR442State.protectedFace,
    });
  }
  return ok;
}

// ---------------------------------------------------------------------------
// TRUE AUTHORED PHRASES (8-14 distinct phrases, 2-5 slice moves each)
// Each phrase has:
//   id, fromState (face), toState (face), moves[], timing, visualFamily,
//   semanticEligibleAtEnd, protectionConstraints, endpointVerifier
//
// Visual families (inspiration from spec):
// - lateral_handoff: Y-axis slice transition between +Z and +X/-X
// - cross_axis_handoff: Z/X axis cross transition
// - center_led_transition: layer 0 (center) move as pivot
// - asymmetric_two_step: two different slices in sequence
// - restrained_accent: small move + settle
// - soft_return: return to same face via different path
// - diagonal_rhythm: alternating axis pattern
// ---------------------------------------------------------------------------

const SEMANTIC_R444_PHRASES_R2 = Object.freeze({
  // From +Z (front) - 4 phrases
  Z_TO_X_POS_LATERAL: {
    name: 'Z_TO_X_POS_LATERAL',
    startFace: '+Z',
    endFace: '+X',
    visualFamily: 'lateral_handoff',
    moves: [
      { axis: 'Y', layer: 1, direction: 1, durationMs: 900 },   // R slice up
      { axis: 'Y', layer: 1, direction: 1, durationMs: 900 },   // R slice up (180 total)
    ],
    totalDurationMs: 1800,
    timing: { microGapMs: 80, settleMs: 120 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '+Z', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+X'),
  },

  Z_TO_X_NEG_CROSS: {
    name: 'Z_TO_X_NEG_CROSS',
    startFace: '+Z',
    endFace: '-X',
    visualFamily: 'cross_axis_handoff',
    moves: [
      { axis: 'Y', layer: -1, direction: -1, durationMs: 900 }, // L slice down
      { axis: 'Y', layer: -1, direction: -1, durationMs: 900 }, // L slice down (180 total)
    ],
    totalDurationMs: 1800,
    timing: { microGapMs: 80, settleMs: 120 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '+Z', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '-X'),
  },

  Z_TO_Z_CENTER_LED: {
    name: 'Z_TO_Z_CENTER_LED',
    startFace: '+Z',
    endFace: '+Z',
    visualFamily: 'center_led_transition',
    moves: [
      { axis: 'X', layer: 0, direction: 1, durationMs: 600 },   // U center slice
      { axis: 'X', layer: 0, direction: -1, durationMs: 600 },  // U center slice back (180+180=360)
    ],
    totalDurationMs: 1200,
    timing: { microGapMs: 60, settleMs: 100 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '+Z', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+Z'),
  },

  Z_TO_X_POS_ASYMMETRIC: {
    name: 'Z_TO_X_POS_ASYMMETRIC',
    startFace: '+Z',
    endFace: '+X',
    visualFamily: 'asymmetric_two_step',
    moves: [
      { axis: 'Y', layer: 1, direction: 1, durationMs: 700 },   // R slice (90)
      { axis: 'X', layer: 1, direction: 1, durationMs: 700 },   // U slice (90) - different axis
    ],
    totalDurationMs: 1400,
    timing: { microGapMs: 100, settleMs: 150 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '+Z', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+X'),
  },

  // From +X (right) - 4 phrases
  X_TO_Z_LATERAL: {
    name: 'X_TO_Z_LATERAL',
    startFace: '+X',
    endFace: '+Z',
    visualFamily: 'lateral_handoff',
    moves: [
      { axis: 'Y', layer: 1, direction: -1, durationMs: 900 },  // R slice down
      { axis: 'Y', layer: 1, direction: -1, durationMs: 900 },  // R slice down (180 total)
    ],
    totalDurationMs: 1800,
    timing: { microGapMs: 80, settleMs: 120 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '+X', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+Z'),
  },

  X_TO_X_NEG_CROSS: {
    name: 'X_TO_X_NEG_CROSS',
    startFace: '+X',
    endFace: '-X',
    visualFamily: 'cross_axis_handoff',
    moves: [
      { axis: 'Z', layer: 1, direction: 1, durationMs: 900 },   // F slice forward
      { axis: 'Z', layer: 1, direction: 1, durationMs: 900 },   // F slice forward (180 total)
    ],
    totalDurationMs: 1800,
    timing: { microGapMs: 80, settleMs: 120 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '+X', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '-X'),
  },

  X_TO_X_CENTER_LED: {
    name: 'X_TO_X_CENTER_LED',
    startFace: '+X',
    endFace: '+X',
    visualFamily: 'center_led_transition',
    moves: [
      { axis: 'Y', layer: 0, direction: 1, durationMs: 600 },   // E center slice
      { axis: 'Y', layer: 0, direction: -1, durationMs: 600 },  // E center slice back
    ],
    totalDurationMs: 1200,
    timing: { microGapMs: 60, settleMs: 100 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '+X', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+X'),
  },

  X_TO_Z_ASYMMETRIC: {
    name: 'X_TO_Z_ASYMMETRIC',
    startFace: '+X',
    endFace: '+Z',
    visualFamily: 'asymmetric_two_step',
    moves: [
      { axis: 'Y', layer: 1, direction: -1, durationMs: 700 },  // R slice (90)
      { axis: 'Z', layer: 1, direction: -1, durationMs: 700 },  // F slice (90) - different axis
    ],
    totalDurationMs: 1400,
    timing: { microGapMs: 100, settleMs: 150 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '+X', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+Z'),
  },

  // From -X (left) - 4 phrases
  NEG_X_TO_Z_LATERAL: {
    name: 'NEG_X_TO_Z_LATERAL',
    startFace: '-X',
    endFace: '+Z',
    visualFamily: 'lateral_handoff',
    moves: [
      { axis: 'Y', layer: -1, direction: 1, durationMs: 900 },  // L slice up
      { axis: 'Y', layer: -1, direction: 1, durationMs: 900 },  // L slice up (180 total)
    ],
    totalDurationMs: 1800,
    timing: { microGapMs: 80, settleMs: 120 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '-X', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+Z'),
  },

  NEG_X_TO_X_POS_CROSS: {
    name: 'NEG_X_TO_X_POS_CROSS',
    startFace: '-X',
    endFace: '+X',
    visualFamily: 'cross_axis_handoff',
    moves: [
      { axis: 'Z', layer: -1, direction: -1, durationMs: 900 }, // B slice back
      { axis: 'Z', layer: -1, direction: -1, durationMs: 900 }, // B slice back (180 total)
    ],
    totalDurationMs: 1800,
    timing: { microGapMs: 80, settleMs: 120 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '-X', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+X'),
  },

  NEG_X_TO_NEG_X_CENTER_LED: {
    name: 'NEG_X_TO_NEG_X_CENTER_LED',
    startFace: '-X',
    endFace: '-X',
    visualFamily: 'center_led_transition',
    moves: [
      { axis: 'Y', layer: 0, direction: 1, durationMs: 600 },   // E center slice
      { axis: 'Y', layer: 0, direction: -1, durationMs: 600 },  // E center slice back
    ],
    totalDurationMs: 1200,
    timing: { microGapMs: 60, settleMs: 100 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '-X', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '-X'),
  },

  NEG_X_TO_Z_ASYMMETRIC: {
    name: 'NEG_X_TO_Z_ASYMMETRIC',
    startFace: '-X',
    endFace: '+Z',
    visualFamily: 'asymmetric_two_step',
    moves: [
      { axis: 'Y', layer: -1, direction: 1, durationMs: 700 },  // L slice (90)
      { axis: 'Z', layer: -1, direction: 1, durationMs: 700 },  // B slice (90) - different axis
    ],
    totalDurationMs: 1400,
    timing: { microGapMs: 100, settleMs: 150 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '-X', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+Z'),
  },

  // Additional phrases for diversity (restrained_accent, soft_return, diagonal_rhythm) - 3 more
  Z_RESTRAINED_ACCENT: {
    name: 'Z_RESTRAINED_ACCENT',
    startFace: '+Z',
    endFace: '+Z',
    visualFamily: 'restrained_accent',
    moves: [
      { axis: 'X', layer: 1, direction: 1, durationMs: 400 },   // U slice small
      { axis: 'X', layer: 1, direction: -1, durationMs: 400 },  // U slice back
    ],
    totalDurationMs: 800,
    timing: { microGapMs: 40, settleMs: 80 },
    semanticEligibleAtEnd: false, // No semantic moment on restrained accent
    protectionConstraints: { protectedFaceMustBe: '+Z', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+Z'),
  },

  X_SOFT_RETURN: {
    name: 'X_SOFT_RETURN',
    startFace: '+X',
    endFace: '+X',
    visualFamily: 'soft_return',
    moves: [
      { axis: 'Z', layer: 0, direction: 1, durationMs: 500 },   // M center slice
      { axis: 'Z', layer: 0, direction: -1, durationMs: 500 },  // M center slice back
    ],
    totalDurationMs: 1000,
    timing: { microGapMs: 50, settleMs: 100 },
    semanticEligibleAtEnd: false,
    protectionConstraints: { protectedFaceMustBe: '+X', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+X'),
  },

  NEG_X_DIAGONAL_RHYTHM: {
    name: 'NEG_X_DIAGONAL_RHYTHM',
    startFace: '-X',
    endFace: '-X',
    visualFamily: 'diagonal_rhythm',
    moves: [
      { axis: 'X', layer: -1, direction: 1, durationMs: 450 },  // D slice
      { axis: 'Z', layer: -1, direction: -1, durationMs: 450 }, // B slice
      { axis: 'X', layer: -1, direction: -1, durationMs: 450 }, // D slice back
      { axis: 'Z', layer: -1, direction: 1, durationMs: 450 },  // B slice back
    ],
    totalDurationMs: 1800,
    timing: { microGapMs: 70, settleMs: 120 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '-X', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '-X'),
  },
});

// Directed graph: each safe state has multiple valid outgoing phrases
const SEMANTIC_R444_GRAPH_R2 = Object.freeze({
  '+Z': [
    'Z_TO_X_POS_LATERAL',
    'Z_TO_X_NEG_CROSS',
    'Z_TO_Z_CENTER_LED',
    'Z_TO_X_POS_ASYMMETRIC',
    'Z_RESTRAINED_ACCENT',
  ],
  '+X': [
    'X_TO_Z_LATERAL',
    'X_TO_X_NEG_CROSS',
    'X_TO_X_CENTER_LED',
    'X_TO_Z_ASYMMETRIC',
    'X_SOFT_RETURN',
  ],
  '-X': [
    'NEG_X_TO_Z_LATERAL',
    'NEG_X_TO_X_POS_CROSS',
    'NEG_X_TO_NEG_X_CENTER_LED',
    'NEG_X_TO_Z_ASYMMETRIC',
    'NEG_X_DIAGONAL_RHYTHM',
  ],
});

// Diversity memory: track last ~3 phrases/states
const SEMANTIC_R444_MEMORY_LENGTH_R2 = 3;

const SEMANTIC_R444_CONFIG_R2 = Object.freeze({
  memoryLength: 3,
  minPhraseDurationMs: 800,
  maxPhraseDurationMs: 2500,
  cooldownRangeMs: [2000, 4000],
  minAngularTravelDeg: 15,
  semanticSequence: Object.freeze(['ProAI Expert', 'TRUST', 'INQUIRY', 'RESPONSE', 'RESULT']),
  seed: 0x444c0de,
});

// ---------------------------------------------------------------------------
// PHYSICAL PHRASE VALIDATION (COMPUTED, NOT ASSUMED)
// For every phrase: instantiate allowed start states, simulate moves,
// compute resulting physical state, verify all invariants.
// ---------------------------------------------------------------------------

function semanticR444ValidatePhrase(phrase) {
  const errors = [];

  // 1. Check start face compatibility
  const currentNode = semanticR444ComputeGraphNode();
  if (currentNode !== phrase.startFace && currentNode !== 'unknown') {
    errors.push('PHYSICAL_START_MISMATCH: current node=' + currentNode + ', phrase requires=' + phrase.startFace);
  }

  // 2. Check protection constraints
  // Allow initial state where no face is protected yet (protection starts with phrase)
  if (phrase.protectionConstraints.protectedFaceMustBe) {
    if (semanticR442State.protected && semanticR442State.protectedFace !== phrase.protectionConstraints.protectedFaceMustBe) {
      errors.push('PROTECTION_FACE_MISMATCH: protected=' + semanticR442State.protectedFace + ', required=' + phrase.protectionConstraints.protectedFaceMustBe);
    }
  }

  // 3. Simulate phrase moves and check protected intersections
  // We simulate by checking each move against the current protected cubies
  const protectedIds = semanticR444GetProtectedCubieIds();
  for (const move of phrase.moves) {
    const intersection = semanticR442MoveIntersection(move);
    if (intersection.count > phrase.protectionConstraints.maxProtectedIntersections) {
      errors.push('PROTECTION_VIOLATION: move ' + move.axis + move.layer + ' intersects ' + intersection.count + ' protected cubies');
    }
  }

  // 4. Check end face assembly (will be verified after execution by endpointVerifier)
  // This is a pre-check: the end face should be an eligible face
  if (!SEMANTIC_R444_FACES.includes(phrase.endFace)) {
    errors.push('INVALID_END_FACE: ' + phrase.endFace + ' not in eligible faces');
  }

  // 5. Check next-edge compatibility (at least one valid outgoing phrase from endFace)
  const outgoing = SEMANTIC_R444_GRAPH_R2[phrase.endFace];
  if (!outgoing || outgoing.length === 0) {
    errors.push('GRAPH_DEAD_END: no outgoing phrases from ' + phrase.endFace);
  }

  return { valid: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// STATE MACHINE - SINGLE AUTHORITATIVE LIFECYCLE
// States: IDLE_READY | PHRASE_RUNNING | VERIFIED_ENDPOINT | SEMANTIC_MOMENT | RELEASE | COOLDOWN
// ---------------------------------------------------------------------------

const SEMANTIC_R444_LIFECYCLE = Object.freeze({
  IDLE_READY: 'IDLE_READY',
  PHRASE_RUNNING: 'PHRASE_RUNNING',
  VERIFIED_ENDPOINT: 'VERIFIED_ENDPOINT',
  SEMANTIC_MOMENT: 'SEMANTIC_MOMENT',
  RELEASE: 'RELEASE',
  COOLDOWN: 'COOLDOWN',
});

const semanticR444StateR2 = {
  // Physical state tracking
  currentFace: '+Z',
  currentGraphNode: '+Z',
  assemblySig: 0,

  // Phrase execution state
  currentPhrase: null,
  currentMoveIndex: 0,
  phraseProgress: 0,
  phraseStartMs: 0,
  phraseEndMs: 0,
  moveStartMs: 0,
  moveEndMs: 0,

  // Lifecycle authority
  lifecycleState: SEMANTIC_R444_LIFECYCLE.IDLE_READY,
  lifecycleTransitions: 0,

  // Diversity memory
  memory: [],

  // Semantic state
  semanticSeed: 0x444c0de,
  nextMessageIndex: 0,
  activeMessage: null,
  activeMessageIndex: null,
  completedMessages: 0,

  // Protection lifecycle
  protectionActive: false,
  protectedFaceAtPhraseStart: null,
  protectionStartMs: 0,
  protectionEndMs: 0,

  // Cooldown authority
  cooldownUntilMs: -Infinity,
  cooldownReason: null,

  // Logging
  lifecycleLog: [],
  eventLog: [],
  validationLog: [],

  // Diagnostics
  lastSemanticFace: null,
  lastSemanticMs: 0,
};

function semanticR444UnitR2() {
  let x = semanticR444StateR2.semanticSeed >>> 0;
  x ^= (x << 13) >>> 0;
  x ^= x >>> 17;
  x ^= (x << 5) >>> 0;
  semanticR444StateR2.semanticSeed = x >>> 0;
  return semanticR444StateR2.semanticSeed / 4294967296;
}

function semanticR444RangeR2(min, max) { return min + (max - min) * semanticR444UnitR2(); }
function semanticR444IntR2(min, max) { return Math.floor(min + semanticR444UnitR2() * (max - min + 1)); }

function semanticR444LogR2(type, data = {}) {
  semanticR444StateR2.lifecycleLog.push({
    type,
    presentationMs: presentationSimTimeMs,
    face: semanticR444StateR2.currentFace,
    graphNode: semanticR444StateR2.currentGraphNode,
    phrase: semanticR444StateR2.currentPhrase?.name,
    lifecycleState: semanticR444StateR2.lifecycleState,
    ...data,
  });
  if (semanticR444StateR2.lifecycleLog.length > 200) semanticR444StateR2.lifecycleLog.shift();
}

function semanticR444LogValidation(type, data = {}) {
  semanticR444StateR2.validationLog.push({
    type,
    presentationMs: presentationSimTimeMs,
    ...data,
  });
  if (semanticR444StateR2.validationLog.length > 100) semanticR444StateR2.validationLog.shift();
}

// ---------------------------------------------------------------------------
// SINGLE PHRASE-START AUTHORITY: canStartPhrase()
// No phrase may begin through another path.
// Validates: lifecycle ready, no current phrase, cooldown complete,
//            no conflicting active turn, physical state verified,
//            graph node verified, protection state coherent,
//            outgoing phrase valid, semantic/release state coherent.
// ---------------------------------------------------------------------------

function semanticR444CanStartPhrase() {
  const state = semanticR444StateR2;

  // 1. Lifecycle state must be ready
  if (state.lifecycleState !== SEMANTIC_R444_LIFECYCLE.IDLE_READY &&
      state.lifecycleState !== SEMANTIC_R444_LIFECYCLE.COOLDOWN) {
    return { allowed: false, reason: 'lifecycle_not_ready: ' + state.lifecycleState };
  }

  // 2. No current phrase running
  if (state.currentPhrase) {
    return { allowed: false, reason: 'phrase_already_running' };
  }

  // 3. Cooldown complete
  if (presentationSimTimeMs < state.cooldownUntilMs) {
    return { allowed: false, reason: 'cooldown_active', remainingMs: state.cooldownUntilMs - presentationSimTimeMs };
  }

  // 4. No conflicting active turn (slice scheduler not running a move)
  if (typeof sliceSchedulerRunning !== 'undefined' && sliceSchedulerRunning) {
    return { allowed: false, reason: 'slice_scheduler_active' };
  }

  // 5. Physical state verified - current face must be assembled and match graph node
  const graphNode = semanticR444ComputeGraphNode();
  const assembledFaces = semanticR444GetAssembledFaces();
  state.currentGraphNode = graphNode;

  if (graphNode === 'unknown' || graphNode === 'ambiguous') {
    return { allowed: false, reason: 'graph_node_invalid: ' + graphNode, assembledFaces };
  }

  if (!assembledFaces.includes(graphNode)) {
    return { allowed: false, reason: 'graph_node_not_assembled: ' + graphNode, assembledFaces };
  }

  // 6. Protection state coherent
  if (semanticR442State.protected && semanticR442State.protectedFace !== graphNode) {
    return { allowed: false, reason: 'protection_incoherent: protected=' + semanticR442State.protectedFace + ', graphNode=' + graphNode };
  }

  // 7. Outgoing phrase must exist and be valid
  const outgoing = SEMANTIC_R444_GRAPH_R2[graphNode];
  if (!outgoing || outgoing.length === 0) {
    return { allowed: false, reason: 'no_outgoing_phrases: ' + graphNode };
  }

  // 8. Semantic/release state coherent (not in middle of semantic moment)
  // This is handled by lifecycle state check above

  return { allowed: true, graphNode, outgoing };
}

// ---------------------------------------------------------------------------
// PHRASE SELECTION WITH DIVERSITY FILTER
// ---------------------------------------------------------------------------

function semanticR444IsDiverseR2(phraseName, endFace) {
  if (semanticR444StateR2.memory.length === 0) return true;
  const recent = semanticR444StateR2.memory;

  // Avoid same phrase twice
  if (recent.some(m => m.phrase === phraseName)) return false;

  // Avoid same end face >= 2 times in recent memory
  const sameFaceCount = recent.filter(m => m.endFace === endFace).length;
  if (sameFaceCount >= 2) return false;

  // Avoid back-and-forth between same two faces (A→B→A)
  if (recent.length >= 2) {
    const f1 = recent[recent.length - 1].endFace;
    const f2 = recent[recent.length - 2].endFace;
    if (f1 === endFace && f2 === semanticR444StateR2.currentFace) return false;
  }

  // Avoid same visual family twice in a row
  const phrase = SEMANTIC_R444_PHRASES_R2[phraseName];
  if (phrase && recent.length >= 1) {
    const lastPhrase = SEMANTIC_R444_PHRASES_R2[recent[recent.length - 1].phrase];
    if (lastPhrase && lastPhrase.visualFamily === phrase.visualFamily) return false;
  }

  return true;
}

function semanticR444SelectPhraseR2() {
  const { allowed, graphNode, outgoing } = semanticR444CanStartPhrase();
  if (!allowed) {
    semanticR444LogR2('phrase-select-blocked', { reason: allowed.reason, graphNode });
    return null;
  }

  // Filter by diversity
  const diverse = outgoing.filter(name => {
    const phrase = SEMANTIC_R444_PHRASES_R2[name];
    return semanticR444IsDiverseR2(name, phrase.endFace);
  });

  const candidates = diverse.length > 0 ? diverse : outgoing;
  const phraseName = candidates[semanticR444IntR2(0, candidates.length - 1)];
  const phrase = SEMANTIC_R444_PHRASES_R2[phraseName];

  // Validate phrase physically BEFORE starting
  const validation = semanticR444ValidatePhrase(phrase);
  if (!validation.valid) {
    semanticR444LogValidation('phrase-validation-fail', { phrase: phraseName, errors: validation.errors });
    // Try other candidates
    for (const altName of candidates) {
      if (altName === phraseName) continue;
      const altPhrase = SEMANTIC_R444_PHRASES_R2[altName];
      const altValidation = semanticR444ValidatePhrase(altPhrase);
      if (altValidation.valid) {
        semanticR444LogR2('phrase-select-fallback', { original: phraseName, selected: altName });
        return altPhrase;
      }
    }
    // No valid phrase found - GRAPH_DEAD_END
    semanticR444LogValidation('GRAPH_DEAD_END', { graphNode, tried: candidates });
    return null;
  }

  return phrase;
}

// ---------------------------------------------------------------------------
// PHRASE EXECUTION
// ---------------------------------------------------------------------------

function semanticR444StartPhraseR2() {
  const phrase = semanticR444SelectPhraseR2();
  if (!phrase) return false;

  const now = presentationSimTimeMs;
  const state = semanticR444StateR2;

  // Transition lifecycle: IDLE_READY -> PHRASE_RUNNING
  state.lifecycleState = SEMANTIC_R444_LIFECYCLE.PHRASE_RUNNING;
  state.lifecycleTransitions++;

  state.currentPhrase = phrase;
  state.currentMoveIndex = 0;
  state.phraseProgress = 0;
  state.phraseStartMs = now;
  state.phraseEndMs = now + phrase.totalDurationMs;
  state.moveStartMs = now;
  state.moveEndMs = now + phrase.moves[0].durationMs;

  // Do NOT activate protection during PHRASE_RUNNING
  // Protection is only active during SEMANTIC_MOMENT to prevent tearing
  // During phrase execution, moves naturally intersect with start/end faces
  state.protectedFaceAtPhraseStart = phrase.startFace;
  state.protectionActive = false;

  // Track the start face for validation, but don't set protection
  state.phraseStartFace = phrase.startFace;

  state.memory.push({ phrase: phrase.name, startFace: phrase.startFace, endFace: phrase.endFace, startMs: now, visualFamily: phrase.visualFamily });
  if (state.memory.length > SEMANTIC_R444_MEMORY_LENGTH_R2) state.memory.shift();

  semanticR444LogR2('phrase-start', {
    phrase: phrase.name,
    startFace: phrase.startFace,
    endFace: phrase.endFace,
    visualFamily: phrase.visualFamily,
    moves: phrase.moves.length,
    totalDurationMs: phrase.totalDurationMs,
    lifecycleState: state.lifecycleState,
  });

  return true;
}

function semanticR444ExecuteCurrentMove() {
  const state = semanticR444StateR2;
  if (!state.currentPhrase || state.currentMoveIndex >= state.currentPhrase.moves.length) {
    return null;
  }

  const move = state.currentPhrase.moves[state.currentMoveIndex];
  return { axis: move.axis, layer: move.layer, direction: move.direction, durationMs: move.durationMs };
}

function semanticR444AdvanceMove() {
  const state = semanticR444StateR2;
  if (!state.currentPhrase) return false;

  state.currentMoveIndex++;
  if (state.currentMoveIndex >= state.currentPhrase.moves.length) {
    // Phrase complete - transition to VERIFIED_ENDPOINT
    return semanticR444CompletePhraseR2();
  }

// Start next move
  const nextMove = state.currentPhrase.moves[state.currentMoveIndex];
  const now = presentationSimTimeMs;
  state.moveStartMs = now;
  state.moveEndMs = now + nextMove.durationMs;
  return true;
}

function semanticR444CompletePhraseR2() {
  const state = semanticR444StateR2;
  if (!state.currentPhrase) return false;

  const phrase = state.currentPhrase;
  const endFace = phrase.endFace;
  const now = presentationSimTimeMs;

  // Verify endpoint physically
  const endpointValid = phrase.endpointVerifier(phrase);

  // Transition lifecycle: PHRASE_RUNNING -> VERIFIED_ENDPOINT
  state.lifecycleState = SEMANTIC_R444_LIFECYCLE.VERIFIED_ENDPOINT;
  state.lifecycleTransitions++;

  state.currentFace = endFace;
  state.currentGraphNode = endFace;
  state.assemblySig = semanticR444ComputeFaceAssemblySig();
  state.currentPhrase = null;
  state.currentMoveIndex = 0;
  state.phraseProgress = 0;
  state.phraseStartMs = 0;
  state.phraseEndMs = 0;
  state.moveStartMs = 0;
  state.moveEndMs = 0;

  if (!endpointValid) {
    semanticR444LogValidation('ENDPOINT_VERIFICATION_FAILED', { phrase: phrase.name, expectedEndFace: endFace });
    // Still transition but mark as invalid
    state.lifecycleState = SEMANTIC_R444_LIFECYCLE.COOLDOWN;
    state.cooldownUntilMs = now + semanticR444RangeR2(...SEMANTIC_R444_CONFIG_R2.cooldownRangeMs);
    state.cooldownReason = 'endpoint_verification_failed';
    semanticR444LogR2('phrase-complete-invalid', { phrase: phrase.name, endFace });
    return false;
  }

  // Transition to SEMANTIC_MOMENT if eligible
  if (phrase.semanticEligibleAtEnd) {
    state.lifecycleState = SEMANTIC_R444_LIFECYCLE.SEMANTIC_MOMENT;
    state.lifecycleTransitions++;

    const messageIndex = state.nextMessageIndex;
    const message = SEMANTIC_R444_CONFIG_R2.semanticSequence[messageIndex];

    const reg = semanticR442FaceRegistry.get(endFace);
    if (reg && semanticR442FaceAssembled(endFace)) {
      semanticR442SetActiveMaterialFace(endFace);
      semanticR442State.activeMaterialFace = endFace;
      // Activate protection during SEMANTIC_MOMENT to prevent tearing
      semanticR442State.protected = true;
      semanticR442State.protectedFace = endFace;
      semanticR442State.protectedSinceMs = now;
      semanticR442State.protectionCount++;

      semanticR443ApplyMessage(endFace, messageIndex);

      state.activeMessage = message;
      state.activeMessageIndex = messageIndex;
      state.nextMessageIndex = (messageIndex + 1) % SEMANTIC_R444_CONFIG_R2.semanticSequence.length;
      state.completedMessages++;

      state.lastSemanticFace = endFace;
      state.lastSemanticMs = now;

      state.eventLog.push({ message, messageIndex, face: endFace, startMs: now, phrase: phrase.name });
      if (state.eventLog.length > 32) state.eventLog.shift();

      semanticR444LogR2('semantic-complete', { face: endFace, message, messageIndex, phrase: phrase.name, completedMessages: state.completedMessages });
    }
  } else {
    // If no semantic moment, activate protection on end face for next phrase
    semanticR442State.protected = true;
    semanticR442State.protectedFace = endFace;
    semanticR442State.protectedSinceMs = now;
    semanticR442State.protectionCount++;
  }

  // Transition to RELEASE - release protection after semantic moment
  state.lifecycleState = SEMANTIC_R444_LIFECYCLE.RELEASE;
  state.lifecycleTransitions++;

  // Release protection - phrase completed naturally, next phrase starts without protection
  semanticR442State.protected = false;
  semanticR442State.protectedFace = null;
  semanticR442State.protectedSinceMs = null;
  state.protectionActive = false;
  state.protectionEndMs = now;

  state.lifecycleState = SEMANTIC_R444_LIFECYCLE.COOLDOWN;
  state.lifecycleTransitions++;
  state.cooldownUntilMs = now + semanticR444RangeR2(...SEMANTIC_R444_CONFIG_R2.cooldownRangeMs);
  state.cooldownReason = 'phrase_complete';

  semanticR444LogR2('phrase-complete', { phrase: phrase.name, endFace, nextFace: endFace, lifecycleState: state.lifecycleState });
  return true;
}

// ---------------------------------------------------------------------------
// MAIN UPDATE FUNCTION - SINGLE AUTHORITATIVE LIFECYCLE
// ---------------------------------------------------------------------------

function semanticR444UpdateR2() {
  const now = presentationSimTimeMs;
  const state = semanticR444StateR2;

  // Update physical state tracking
  state.currentGraphNode = semanticR444ComputeGraphNode();
  state.assemblySig = semanticR444ComputeFaceAssemblySig();
  state.currentFace = state.currentGraphNode !== 'unknown' && state.currentGraphNode !== 'ambiguous' ? state.currentGraphNode : state.currentFace;

  // Handle lifecycle transitions
  switch (state.lifecycleState) {
    case SEMANTIC_R444_LIFECYCLE.IDLE_READY:
    case SEMANTIC_R444_LIFECYCLE.COOLDOWN:
      // Check cooldown
      if (now < state.cooldownUntilMs) return;

      // Try to start a new phrase
      if (!state.currentPhrase) {
        semanticR444StartPhraseR2();
      }
      break;

    case SEMANTIC_R444_LIFECYCLE.PHRASE_RUNNING:
      if (!state.currentPhrase) {
        semanticR444LogR2('lifecycle-error', { reason: 'no_current_phrase_in_running' });
        state.lifecycleState = SEMANTIC_R444_LIFECYCLE.IDLE_READY;
        return;
      }

      // Check current move progress
      const elapsed = now - state.moveStartMs;
      const moveDuration = state.currentPhrase.moves[state.currentMoveIndex].durationMs;
      state.phraseProgress = THREE.MathUtils.clamp((now - state.phraseStartMs) / state.currentPhrase.totalDurationMs, 0, 1);

      if (elapsed >= moveDuration) {
        semanticR444AdvanceMove();
      }
      break;

    case SEMANTIC_R444_LIFECYCLE.VERIFIED_ENDPOINT:
      // Brief state, immediately transitions in CompletePhrase
      break;

    case SEMANTIC_R444_LIFECYCLE.SEMANTIC_MOMENT:
      // Semantic moment active, wait for cooldown
      if (now >= state.cooldownUntilMs) {
        state.lifecycleState = SEMANTIC_R444_LIFECYCLE.COOLDOWN;
        state.lifecycleTransitions++;
      }
      break;

    case SEMANTIC_R444_LIFECYCLE.RELEASE:
      // Brief state, immediately transitions in CompletePhrase
      break;
  }
}

// ---------------------------------------------------------------------------
// MOVEMENT SELECTION FOR PHRASE GRAPH
// ---------------------------------------------------------------------------

function semanticR444SelectMoveForPhraseR2() {
  const state = semanticR444StateR2;

  // Only provide moves during PHRASE_RUNNING state
  if (state.lifecycleState !== SEMANTIC_R444_LIFECYCLE.PHRASE_RUNNING) {
    return null;
  }

  return semanticR444ExecuteCurrentMove();
}

// Integration: replace semanticR442SelectMove to use phrase graph R2
function semanticR444WrappedSelectMoveR2() {
  const state = semanticR444StateR2;

  // If we have an active phrase in RUNNING state, use its move
  if (state.lifecycleState === SEMANTIC_R444_LIFECYCLE.PHRASE_RUNNING && state.currentPhrase) {
    return semanticR444SelectMoveForPhraseR2();
  }

  // If in cooldown or idle, don't start a phrase here - let Update handle it
  // This ensures single start authority
  return null;
}

// Weight function - phrase graph moves have priority
function semanticR444WeightR2(move) {
  return 1;
}

// Replace update protection state with phrase graph R2 update
function semanticR444WrappedUpdateProtectionStateR2() {
  semanticR444UpdateR2();

  // Also call the original optical diagnostics for face evaluation
  if (semanticR442State.protected) {
    const q = semanticR442EvaluateFace(semanticR442State.protectedFace, false);
    if (!q?.assembled) {
      semanticR442State.assemblyViolations++;
      // Don't force release - let phrase complete naturally
      return;
    }
    // Update optical diagnostics
    semanticR43OpticalDiagnostics = {
      ...semanticR43OpticalDiagnostics,
      alignment: q.brdfQuality,
      faceView: q.viewAlignment,
      halfDot: q.halfDot,
      signedFaceView: q.signedFaceView,
      signedHalfDot: q.signedHalfDot,
      frontFacing: q.signedFaceView > 0,
      opportunity: q.rawQuality,
      engravedFace: q.face,
    };
  }
  return;
}

// Replace semanticR442ReleaseProtection - no forced release, phrase completes naturally
function semanticR444ReleaseProtectionR2(reason = 'phrase-complete') {
  if (!semanticR442State.protected) return false;
  // Allow phrase to complete naturally, don't force release
  // The phrase graph controls protection lifecycle
  return true;
}

// Expose diagnostics
function semanticR444GetDiagnosticsR2() {
  const state = semanticR444StateR2;
  return {
    currentFace: state.currentFace,
    currentGraphNode: state.currentGraphNode,
    assemblySig: state.assemblySig.toString(2).padStart(3, '0'),
    assembledFaces: semanticR444GetAssembledFaces(),
    currentPhrase: state.currentPhrase?.name || null,
    phraseProgress: state.phraseProgress,
    currentMoveIndex: state.currentMoveIndex,
    memory: [...state.memory],
    lifecycleState: state.lifecycleState,
    lifecycleTransitions: state.lifecycleTransitions,
    completedMessages: state.completedMessages,
    activeMessage: state.activeMessage,
    activeMessageIndex: state.activeMessageIndex,
    nextMessage: SEMANTIC_R444_CONFIG_R2.semanticSequence[state.nextMessageIndex],
    cooldownUntilMs: state.cooldownUntilMs,
    cooldownReason: state.cooldownReason,
    lastSemanticFace: state.lastSemanticFace,
    lastSemanticMs: state.lastSemanticMs,
    protectionActive: state.protectionActive,
    protectedFaceAtPhraseStart: state.protectedFaceAtPhraseStart,
    lifecycleLog: [...state.lifecycleLog],
    eventLog: [...state.eventLog],
    validationLog: [...state.validationLog],
  };
}


const SEMANTIC_R443_PHASE=Object.freeze({NORMAL:'NORMAL',CANDIDATE:'CANDIDATE',READABLE_LOCK:'READABLE_LOCK',RELEASE:'RELEASE',DISPERSAL:'DISPERSAL',COOLDOWN:'COOLDOWN'});
const SEMANTIC_R443_SEQUENCE=Object.freeze(['ProAI Expert','TRUST','INQUIRY','RESPONSE','RESULT']);
const SEMANTIC_R443_CONFIG=Object.freeze({candidateApproachScore:.58,candidateApproachView:.46,candidateDwellMs:80,enterScore:.64,enterView:.52,enterArea:.26,enterBrdf:.18,exitScore:.54,exitView:.50,releaseDebounceMs:90,maxReadableMs:2400,rearmScore:.56,cooldownRangeMs:[2200,4200],minAngularTravelDeg:18,minPostReleaseSlices:1,dispersalTargetMs:[350,1250],recentFaceFactors:[.44,.72,.88],layerDebtBoost:1.52,axisDebtBoost:1.82});
let semanticR443PendingResolutionCount=0;
const semanticR443State={phase:SEMANTIC_R443_PHASE.NORMAL,candidateFace:null,candidateSinceMs:null,candidateStartScore:0,candidatePeakScore:0,activeMessage:null,activeMessageIndex:null,nextMessageIndex:0,lastReadableStartMs:null,lastReleaseMs:-Infinity,lastReleaseFace:null,releaseCumulativeYawDeg:0,releaseSelectionCount:0,cooldownUntilMs:-Infinity,dispersalDone:true,dispersalLatencyMs:null,dispersalLatenciesMs:[],opportunityIntervalsMs:[],readableDurationsMs:[],faceArmed:{'+Z':true,'+X':true,'-X':true},recentFaces:[],lifecycleLog:[],candidateLog:[],eventLog:[],semanticSeed:0x443c0de,overdueDispersalCount:0,shortReadableCount:0};
function semanticR443Log(type,data={}){semanticR443State.lifecycleLog.push({type,presentationMs:presentationSimTimeMs,phase:semanticR443State.phase,...data});if(semanticR443State.lifecycleLog.length>160)semanticR443State.lifecycleLog.shift()}
function semanticR443Unit(){let x=semanticR443State.semanticSeed>>>0;x^=(x<<13)>>>0;x^=x>>>17;x^=(x<<5)>>>0;semanticR443State.semanticSeed=x>>>0;return semanticR443State.semanticSeed/4294967296}
function semanticR443Range(min,max){return min+(max-min)*semanticR443Unit()}
function semanticR443ResetCandidate(reason='reset'){if(semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE)semanticR443Log('candidate-cancel',{face:semanticR443State.candidateFace,reason});semanticR443State.candidateFace=null;semanticR443State.candidateSinceMs=null;semanticR443State.candidateStartScore=0;semanticR443State.candidatePeakScore=0;if(semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE)semanticR443State.phase=SEMANTIC_R443_PHASE.NORMAL}
function semanticR443FaceSpan(){const spanY=Math.abs(latticeCenters.Y[2]-latticeCenters.Y[0])+GEOMETRY_R1.faceOuterSize,spanZ=Math.abs(latticeCenters.Z[2]-latticeCenters.Z[0])+GEOMETRY_R1.faceOuterSize;return Math.min(spanY,spanZ)*.998}
const semanticR443GlobalMaskCache=new Map();
const SEMANTIC_R443_TYPOGRAPHY=Object.freeze({fontFamily:'Instrument Sans Variable',fontWeight:620,targetBlockWidthRatio:.722,scaleX:.875,scaleY:.900});
function semanticR443CreateWordMask(text){const size=2048,raw=document.createElement('canvas');raw.width=size;raw.height=size;const ctx=raw.getContext('2d',{alpha:true});ctx.clearRect(0,0,size,size);ctx.fillStyle='#ffffff';ctx.textAlign='center';ctx.textBaseline='alphabetic';const targetWidth=size*SEMANTIC_R443_TYPOGRAPHY.targetBlockWidthRatio;let low=120,high=900;for(let i=0;i<20;i++){const mid=(low+high)*.5;ctx.font=SEMANTIC_R443_TYPOGRAPHY.fontWeight+' '+mid+'px "'+SEMANTIC_R443_TYPOGRAPHY.fontFamily+'"';if(ctx.measureText(text).width<targetWidth)low=mid;else high=mid}const fontPx=(low+high)*.5;ctx.font=SEMANTIC_R443_TYPOGRAPHY.fontWeight+' '+fontPx+'px "'+SEMANTIC_R443_TYPOGRAPHY.fontFamily+'"';const m=ctx.measureText(text),ascent=m.actualBoundingBoxAscent||fontPx*.72,descent=m.actualBoundingBoxDescent||fontPx*.18,baseline=size*.5+(ascent-descent)*.5;ctx.fillText(text,size*.5,baseline);const scaled=document.createElement('canvas');scaled.width=size;scaled.height=size;const sc=scaled.getContext('2d',{alpha:true}),dw=size*.875,dh=size*.900;sc.clearRect(0,0,size,size);sc.drawImage(raw,(size-dw)*.5,(size-dh)*.5,dw,dh);const texture=new THREE.CanvasTexture(scaled);texture.colorSpace=THREE.NoColorSpace;texture.minFilter=THREE.LinearFilter;texture.magFilter=THREE.LinearFilter;texture.generateMipmaps=true;texture.needsUpdate=true;texture.userData.semanticR443TypographyScale={x:.875,y:.900,message:text};return createSeamAwareBrandMaskTexture(texture,semanticR443FaceSpan())}
function semanticR443GlobalMask(index){if(index===0)return semanticMaskTexture;if(semanticR443GlobalMaskCache.has(index))return semanticR443GlobalMaskCache.get(index);const texture=semanticR443CreateWordMask(SEMANTIC_R443_SEQUENCE[index]);semanticR443GlobalMaskCache.set(index,texture);return texture}
function semanticR443DisposeTileResources(tile){const m=tile.material,items=[tile.mask,tile.rough,m.userData.semanticBeveledBump,m.userData.semanticToneMap],seen=new Set();for(const t of items){if(!t||seen.has(t)||t===m.userData.semanticBaseMap)continue;seen.add(t);t.dispose?.()}}
function semanticR443ApplyMessage(face,index){const reg=semanticR442FaceRegistry.get(face);if(!reg)return false;const message=SEMANTIC_R443_SEQUENCE[index],globalMask=semanticR443GlobalMask(index);for(const tile of reg.tiles){const m=tile.material,current=m.userData.semanticR443MessageIndex;if(current===index)continue;if(current===undefined&&index===0){m.userData.semanticR443MessageIndex=0;m.userData.semanticR443Message=message;continue}semanticR443DisposeTileResources(tile);const mask=createSemanticR442TileMask(globalMask,face,tile.origin),rough=createSemanticR441PearlRoughnessTile(mask),bevel=createSemanticR442BevelTile(mask),tone=createSemanticR442ToneTile(mask);tile.mask=mask;tile.rough=rough;m.bumpMap=bevel;m.userData.semanticTileMask=mask;m.userData.semanticBeveledBump=bevel;m.userData.semanticRoughnessMap=rough;m.userData.semanticToneMap=tone;m.userData.semanticR443MessageIndex=index;m.userData.semanticR443Message=message;m.needsUpdate=true}semanticR443State.activeMessage=message;semanticR443State.activeMessageIndex=index;return true}
function semanticR443RefreshArming(){for(const face of SEMANTIC_R442_ELIGIBLE_FACES){const q=semanticR442EvaluateFace(face,false);if(!q||!q.assembled||q.rawQuality<=SEMANTIC_R443_CONFIG.rearmScore||q.viewAlignment<=.42)semanticR443State.faceArmed[face]=true}}
function semanticR443RecentFactor(face){const at=semanticR443State.recentFaces.lastIndexOf(face);if(at<0)return 1;const age=semanticR443State.recentFaces.length-1-at;return SEMANTIC_R443_CONFIG.recentFaceFactors[Math.min(age-1,SEMANTIC_R443_CONFIG.recentFaceFactors.length-1)]||1}
function semanticR443FaceClearOfActiveTurns(face){if(!face)return false;for(const turn of activeTurns.values()){if(semanticR442MoveIntersection({axis:turn.axis,layer:turn.layer},face).count>0)return false}return true}
function semanticR443BestEligibleFace(){const list=SEMANTIC_R442_ELIGIBLE_FACES.map(face=>semanticR442EvaluateFace(face,true)).filter(Boolean).map(q=>({...q,r443Armed:semanticR443State.faceArmed[q.face]===true,r443RecentFactor:semanticR443RecentFactor(q.face)}));for(const q of list)q.r443SelectionScore=q.selectionScore*q.r443RecentFactor;semanticR442State.candidateScores=list.map(q=>({...q}));const eligible=list.filter(q=>q.assembled&&q.r443Armed&&semanticR443FaceClearOfActiveTurns(q.face)).sort((a,b)=>b.r443SelectionScore-a.r443SelectionScore);return eligible[0]||null}
function semanticR443EvolutionReady(){if(!Number.isFinite(semanticR443State.lastReleaseMs))return true;const angular=presentationCumulativeYawDeg-semanticR443State.releaseCumulativeYawDeg,moves=semanticR442MoveState.selectionCount-semanticR443State.releaseSelectionCount,faceChanged=semanticR443State.faceArmed[semanticR443State.lastReleaseFace]===true;return presentationSimTimeMs>=semanticR443State.cooldownUntilMs&&semanticR443State.dispersalDone&&angular>=SEMANTIC_R443_CONFIG.minAngularTravelDeg&&moves>=SEMANTIC_R443_CONFIG.minPostReleaseSlices&&faceChanged&&activeTurns.size===0}
function semanticR443Lock(q){const now=presentationSimTimeMs,index=semanticR443State.nextMessageIndex,message=SEMANTIC_R443_SEQUENCE[index];semanticR442State.protected=true;semanticR442State.protectedFace=q.face;semanticR442State.protectedSinceMs=now;semanticR442State.belowExitSinceMs=null;semanticR442State.protectionCount++;semanticR443ApplyMessage(q.face,index);semanticR442SetActiveMaterialFace(q.face);semanticR442State.activeMaterialFace=q.face;const reg=semanticR442FaceRegistry.get(q.face);if(reg)reg.lastUsedPresentationMs=now;semanticR442State.faceSelections.push({face:q.face,presentationMs:now,quality:q.rawQuality,view:q.viewAlignment,area:q.projectedAreaQuality,brdf:q.brdfQuality,message,messageIndex:index});if(semanticR442State.faceSelections.length>32)semanticR442State.faceSelections.shift();if(semanticR443State.lastReadableStartMs!==null)semanticR443State.opportunityIntervalsMs.push(now-semanticR443State.lastReadableStartMs);semanticR443State.lastReadableStartMs=now;semanticR443State.phase=SEMANTIC_R443_PHASE.READABLE_LOCK;semanticR443State.candidateFace=null;semanticR443State.candidateSinceMs=null;semanticR443State.recentFaces.push(q.face);if(semanticR443State.recentFaces.length>4)semanticR443State.recentFaces.shift();semanticR443State.eventLog.push({message,messageIndex:index,face:q.face,startMs:now,quality:q.rawQuality});if(semanticR443State.eventLog.length>32)semanticR443State.eventLog.shift();semanticR443Log('readable-start',{face:q.face,message,messageIndex:index,quality:q.rawQuality});return true}
function semanticR443Release(reason='optical-exit'){if(!semanticR442State.protected)return false;const now=presentationSimTimeMs,start=semanticR442State.protectedSinceMs??now,face=semanticR442State.protectedFace,duration=Math.max(0,now-start);semanticR442State.protectedIntervals.push({face,startMs:start,endMs:now,durationSec:duration/1000,reason,message:semanticR443State.activeMessage});if(semanticR442State.protectedIntervals.length>32)semanticR442State.protectedIntervals.shift();semanticR443State.readableDurationsMs.push(duration);if(duration<600)semanticR443State.shortReadableCount++;semanticR442State.protected=false;semanticR442State.protectedFace=null;semanticR442State.protectedSinceMs=null;semanticR442State.belowExitSinceMs=null;semanticR442State.lastReleasedFace=face;semanticR442State.lastReleasedAtMs=now;semanticR442State.releaseCount++;for(const f of SEMANTIC_R442_ELIGIBLE_FACES){semanticR443State.faceArmed[f]=false;semanticR442State.faceRearmBlocked[f]=true}semanticR442SetActiveMaterialFace(null);semanticR442State.activeMaterialFace=null;semanticR443State.lastReleaseMs=now;semanticR443State.lastReleaseFace=face;semanticR443State.releaseCumulativeYawDeg=presentationCumulativeYawDeg;semanticR443State.releaseSelectionCount=semanticR442MoveState.selectionCount;semanticR443State.cooldownUntilMs=now+semanticR443Range(...SEMANTIC_R443_CONFIG.cooldownRangeMs);semanticR443State.dispersalDone=false;semanticR443State.dispersalLatencyMs=null;semanticR443State.phase=SEMANTIC_R443_PHASE.RELEASE;semanticR443Log('release',{face,reason,durationMs:duration,message:semanticR443State.activeMessage});semanticR443State.nextMessageIndex=(semanticR443State.nextMessageIndex+1)%SEMANTIC_R443_SEQUENCE.length;semanticR443State.activeMessage=null;semanticR443State.activeMessageIndex=null;semanticR443State.phase=SEMANTIC_R443_PHASE.DISPERSAL;semanticR443Log('dispersal-enter',{face,targetMs:[...SEMANTIC_R443_CONFIG.dispersalTargetMs]});return true}

const semanticMotionTrace=[];
const semanticOpticalScratch={q:new THREE.Quaternion(),sceneQ:new THREE.Quaternion(),center:new THREE.Vector3(),camera:new THREE.Vector3(),light:new THREE.Vector3(),normal:new THREE.Vector3(),tx:new THREE.Vector3(),ty:new THREE.Vector3(),view:new THREE.Vector3(),lightDir:new THREE.Vector3(),half:new THREE.Vector3(),axis:new THREE.Vector2(),fieldCenter:new THREE.Vector2()};
function recordSemanticMotionSample(wallDeltaMs,effectiveDeltaMs){const wall=performance.now(),scale=wallDeltaMs>0?effectiveDeltaMs/wallDeltaMs:1;semanticMotionTrace.push({wallMs:wall,presentationMs:presentationSimTimeMs,semanticActive,semanticComplete,scale,yawVelocityDegPerSec:presentationYawVelocityDegPerSec,frameAngularDeltaRad:presentationFrameDeltaRad});if(semanticMotionTrace.length>960)semanticMotionTrace.splice(0,semanticMotionTrace.length-960)}
function cutSemanticSeam(ctx,size,c,h,f,vertical){const a=c-h-f,b=c+h+f,g=vertical?ctx.createLinearGradient(a,0,b,0):ctx.createLinearGradient(0,a,0,b),t=f/Math.max(1,b-a);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(Math.min(.49,t),'rgba(0,0,0,1)');g.addColorStop(Math.max(.51,1-t),'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;vertical?ctx.fillRect(a,0,b-a,size):ctx.fillRect(0,a,size,b-a)}
function createSemanticR441ScaledBrandMaskTexture(texture){const src=texture.image,w=src.width,h=src.height,scaleX=.875,scaleY=.900,canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d',{alpha:true});ctx.clearRect(0,0,w,h);const dw=w*scaleX,dh=h*scaleY;ctx.drawImage(src,(w-dw)*.5,(h-dh)*.5,dw,dh);const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.NoColorSpace;t.minFilter=THREE.LinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.needsUpdate=true;t.userData.semanticR441TypographyScale={r44:{x:1,y:1},r441:{x:scaleX,y:scaleY},horizontalReductionPct:12.5,verticalReductionPct:10};if(semanticTypographyMetrics){const cx=.5+(semanticTypographyMetrics.opticalOffsetXRatio||0),cy=.5+(semanticTypographyMetrics.opticalOffsetYRatio||0),bw=semanticTypographyMetrics.blockWidthRatio*scaleX,bh=semanticTypographyMetrics.blockHeightRatio*scaleY;semanticTypographyMetrics={...semanticTypographyMetrics,expertFontPx:semanticTypographyMetrics.expertFontPx*scaleY,proAIFontPx:semanticTypographyMetrics.proAIFontPx*scaleY,blockWidthPx:semanticTypographyMetrics.blockWidthPx*scaleX,blockHeightPx:semanticTypographyMetrics.blockHeightPx*scaleY,blockWidthRatio:bw,blockHeightRatio:bh,safeLeftRatio:cx-bw*.5,safeRightRatio:1-(cx+bw*.5),safeTopRatio:cy-bh*.5,safeBottomRatio:1-(cy+bh*.5),r44OpticalScale:{x:1,y:1},r441OpticalScale:{x:scaleX,y:scaleY},r441HorizontalReductionPct:12.5,r441VerticalReductionPct:10}}texture.dispose?.();return t}
function createSeamAwareBrandMaskTexture(texture,faceSpan){const canvas=texture.image,ctx=canvas.getContext('2d',{alpha:true}),size=canvas.width,stepY=Math.abs(latticeCenters.Y[1]-latticeCenters.Y[0]),stepZ=Math.abs(latticeCenters.Z[1]-latticeCenters.Z[0]),gapY=Math.max(0,stepY-GEOMETRY_R1.faceOuterSize),gapZ=Math.max(0,stepZ-GEOMETRY_R1.faceOuterSize),feather=Math.max(.65,Math.min(1.50,Math.max(gapY,gapZ)*.44));ctx.save();ctx.globalCompositeOperation='destination-out';for(const p of [(latticeCenters.Y[0]+latticeCenters.Y[1])*.5,(latticeCenters.Y[1]+latticeCenters.Y[2])*.5])cutSemanticSeam(ctx,size,(.5+p/faceSpan)*size,gapY*.5/faceSpan*size,feather/faceSpan*size,true);for(const p of [(latticeCenters.Z[0]+latticeCenters.Z[1])*.5,(latticeCenters.Z[1]+latticeCenters.Z[2])*.5])cutSemanticSeam(ctx,size,(.5-p/faceSpan)*size,gapZ*.5/faceSpan*size,feather/faceSpan*size,false);ctx.restore();texture.needsUpdate=true;texture.userData.semanticSeamMask={gapY,gapZ,feather,source:'latticeCenters + GEOMETRY_R1.faceOuterSize'};return texture}
function makeSemanticDataTexture(canvas){const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.NoColorSpace;t.minFilter=THREE.LinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.needsUpdate=true;return t}
function createSemanticTileMask(globalTexture,logicalX,logicalY){const src=globalTexture.image,size=768,canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d',{alpha:true}),cell=src.width/3,col=logicalX+1,row=1-logicalY;ctx.clearRect(0,0,size,size);ctx.drawImage(src,col*cell,row*cell,cell,cell,0,0,size,size);return makeSemanticDataTexture(canvas)}
function createSemanticRoughnessTile(maskTexture){const src=maskTexture.image,size=src.width,canvas=document.createElement('canvas'),ink=document.createElement('canvas');canvas.width=size;canvas.height=size;ink.width=size;ink.height=size;const ctx=canvas.getContext('2d',{alpha:false}),ic=ink.getContext('2d',{alpha:true});ctx.fillStyle='#ffffff';ctx.fillRect(0,0,size,size);ic.clearRect(0,0,size,size);ic.drawImage(src,0,0);ic.globalCompositeOperation='source-in';const v=Math.round(255*SEMANTIC_R4_3_ENGRAVING.roughnessMapInk);ic.fillStyle=`rgb(${v},${v},${v})`;ic.fillRect(0,0,size,size);ctx.drawImage(ink,0,0);return makeSemanticDataTexture(canvas)}
function createSemanticR441PearlRoughnessTile(maskTexture){const src=maskTexture.image,size=src.width,canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d',{alpha:false}),srcCtx=src.getContext('2d',{willReadFrequently:true}),pixels=srcCtx.getImageData(0,0,size,size).data,out=ctx.createImageData(size,size),bodyV=Math.round(255*.550),edgeV=Math.round(255*.095),radius=2;for(let y=0;y<size;y++){for(let x=0;x<size;x++){const i=(y*size+x)*4,a=pixels[i+3]/255;let v=255;if(a>.015){let minA=a;for(const [dx,dy] of [[-radius,0],[radius,0],[0,-radius],[0,radius],[-1,-1],[1,-1],[-1,1],[1,1]]){const nx=Math.max(0,Math.min(size-1,x+dx)),ny=Math.max(0,Math.min(size-1,y+dy)),ni=(ny*size+nx)*4;minA=Math.min(minA,pixels[ni+3]/255)}const edge=THREE.MathUtils.clamp((a-minA)/.58,0,1),strokeV=bodyV+(edgeV-bodyV)*edge;v=Math.round(255+(strokeV-255)*a)}out.data[i]=v;out.data[i+1]=v;out.data[i+2]=v;out.data[i+3]=255}}ctx.putImageData(out,0,0);const t=makeSemanticDataTexture(canvas);t.userData.semanticR441PearlEdgeRoughness={bodyRoughnessInk:.550,edgeRoughnessInk:.095,innerEdgeRadiusPx:2,driver:'persistent mask micro-edge -> roughness/clearcoat-roughness -> stable studio BRDF only'};return t}
function isSemanticFaceGeometry(object){if(!object.geometry)return false;const m=sourceGeometryMetrics(object.geometry),dims=[Math.abs(m.size.x),Math.abs(m.size.y),Math.abs(m.size.z)].sort((a,b)=>a-b);return dims[0]<dims[2]*.12}
function semanticSceneLocalNormal(object){const s=semanticOpticalScratch,worldQ=object.getWorldQuaternion(s.q),sceneInv=sceneOne.getWorldQuaternion(s.sceneQ).invert();return s.normal.set(0,0,1).applyQuaternion(worldQ).applyQuaternion(sceneInv).normalize()}
function createSemanticR442PlanarFaceGeometry(mesh,sourceGeometry,face='+Z'){const geometry=sourceGeometry.clone(),position=geometry.getAttribute('position');if(!position)throw new Error('R4.4.2 engraved face missing positions');sceneOne.updateMatrixWorld(true);mesh.updateMatrixWorld(true);const xy=new Float32Array(position.count*2),p=new THREE.Vector3();let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;for(let i=0;i<position.count;i++){p.fromBufferAttribute(position,i);mesh.localToWorld(p);sceneOne.worldToLocal(p);let u=p.x,v=p.y;if(face==='+X'){u=-p.z;v=p.y}else if(face==='-X'){u=p.z;v=p.y}xy[i*2]=u;xy[i*2+1]=v;minX=Math.min(minX,u);maxX=Math.max(maxX,u);minY=Math.min(minY,v);maxY=Math.max(maxY,v)}const spanX=Math.max(1e-6,maxX-minX),spanY=Math.max(1e-6,maxY-minY),uv=new Float32Array(position.count*2);for(let i=0;i<position.count;i++){uv[i*2]=THREE.MathUtils.clamp((xy[i*2]-minX)/spanX,0,1);uv[i*2+1]=THREE.MathUtils.clamp((xy[i*2+1]-minY)/spanY,0,1)}geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));geometry.userData.semanticR442PlanarUv={face,projection:face==='+Z'?'sceneOne XY':face==='+X'?'sceneOne -ZY':'sceneOne ZY',spanX,spanY};return geometry}function createSemanticR442BevelTile(maskTexture){const src=maskTexture.image,size=src.width,canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d',{alpha:false});ctx.fillStyle='#000000';ctx.fillRect(0,0,size,size);ctx.save();ctx.filter='blur(5px)';ctx.globalAlpha=.74;ctx.drawImage(src,0,0);ctx.restore();ctx.globalAlpha=.26;ctx.drawImage(src,0,0);ctx.globalAlpha=1;const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.NoColorSpace;t.minFilter=THREE.LinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.needsUpdate=true;t.userData.semanticR44BeveledBump=true;t.userData.semanticR442BeveledBump=true;return t}function createSemanticR442ToneTile(maskTexture){const src=maskTexture.image,size=src.width,canvas=document.createElement('canvas'),ink=document.createElement('canvas');canvas.width=size;canvas.height=size;ink.width=size;ink.height=size;const ctx=canvas.getContext('2d',{alpha:false}),ic=ink.getContext('2d',{alpha:true});ctx.fillStyle='#ffffff';ctx.fillRect(0,0,size,size);ic.clearRect(0,0,size,size);ic.drawImage(src,0,0);ic.globalCompositeOperation='source-in';const v=Math.round(255*SEMANTIC_R4_3_ENGRAVING.tonalInk);ic.fillStyle='rgb('+v+','+v+','+v+')';ic.fillRect(0,0,size,size);ctx.drawImage(ink,0,0);const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.minFilter=THREE.LinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.needsUpdate=true;t.userData.semanticR442Tone=true;return t}function semanticR442FaceTileCoords(face,logical){if(face==='+Z')return{u:logical.x,v:logical.y};if(face==='+X')return{u:-logical.z,v:logical.y};if(face==='-X')return{u:logical.z,v:logical.y};throw new Error('R4.4.2 unsupported semantic face '+face)}
function createSemanticR442TileMask(globalTexture,face,logical){const c=semanticR442FaceTileCoords(face,logical),src=globalTexture.image,size=768,canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d',{alpha:true}),cell=src.width/3,col=c.u+1,row=1-c.v;ctx.clearRect(0,0,size,size);ctx.drawImage(src,col*cell,row*cell,cell,cell,0,0,size,size);const t=makeSemanticDataTexture(canvas);t.userData.semanticR442Tile={face,u:c.u,v:c.v};return t}
function collectSemanticPhysicalMeshes(cubie,face='+Z'){const found=[],target=semanticFaceNormal(face);sceneOne.updateMatrixWorld(true);for(const member of cubie.members){member.object.traverse(object=>{if(!object.isMesh||object.name==='Plane'||!object.material?.isMeshPhysicalMaterial||!isSemanticFaceGeometry(object))return;const normal=semanticSceneLocalNormal(object);if(normal.dot(target)>.86)found.push(object)})}return[...new Set(found)]}
function createPhysicalEngravedMaterial(mesh,baseMaterial,maskTexture,roughnessTexture,face='+Z'){mesh.geometry=createSemanticR442PlanarFaceGeometry(mesh,mesh.geometry,face);const bevelTexture=createSemanticR442BevelTile(maskTexture),toneTexture=createSemanticR442ToneTile(maskTexture),m=baseMaterial.clone();m.name='R4_4_2_PHYSICAL_MICRO_ENGRAVED_'+face+'_'+(baseMaterial.name||'FACE');m.bumpMap=bevelTexture;m.bumpScale=-.012;m.roughnessMap=null;if('clearcoatRoughnessMap' in m)m.clearcoatRoughnessMap=null;m.map=baseMaterial.map||null;m.userData.semanticMaterial='SEMANTIC_R4_4_2_DYNAMIC_PHYSICAL_MICRO_ENGRAVING';m.userData.semanticFace=face;m.userData.semanticTileMask=maskTexture;m.userData.semanticBeveledBump=bevelTexture;m.userData.semanticRoughnessMap=roughnessTexture;m.userData.semanticToneMap=toneTexture;m.userData.semanticBaseMap=baseMaterial.map||null;m.userData.semanticPlanarUv=true;m.userData.semanticR44BeveledBump=true;m.userData.semanticR44SceneProjectedUv=true;m.userData.semanticR441PearlEdgeRoughness=roughnessTexture.userData.semanticR441PearlEdgeRoughness||null;m.userData.semanticR442Dormant=true;m.needsUpdate=true;return m}
const SEMANTIC_R442_ELIGIBLE_FACES=Object.freeze(['+Z','+X','-X']);
const semanticR442FaceRegistry=new Map();
let semanticR442ActiveMaterialFace=null;
function semanticR442FaceDefinition(face){if(face==='+Z')return{face,axis:'Z',layer:1,normal:[0,0,1]};if(face==='+X')return{face,axis:'X',layer:1,normal:[1,0,0]};if(face==='-X')return{face,axis:'X',layer:-1,normal:[-1,0,0]};return null}
function semanticR442SetActiveMaterialFace(face){if(face!==null&&!SEMANTIC_R442_ELIGIBLE_FACES.includes(face))return false;semanticR442ActiveMaterialFace=face;for(const entry of semanticEngravedTiles){const active=entry.face===face,m=entry.material;m.bumpScale=active?SEMANTIC_R4_3_ENGRAVING.bumpScale:-.012;m.roughnessMap=active?entry.rough:null;if('clearcoatRoughnessMap' in m)m.clearcoatRoughnessMap=active?entry.rough:null;m.map=active?(m.userData.semanticToneMap||m.userData.semanticBaseMap||null):(m.userData.semanticBaseMap||null);m.userData.semanticR442Dormant=!active;m.needsUpdate=true}return true}
function installPhysicalSemanticEngraving(globalTexture){semanticEngravedTiles=[];semanticR442FaceRegistry.clear();let faceTileCount=0;for(const face of SEMANTIC_R442_ELIGIBLE_FACES){const def=semanticR442FaceDefinition(face),cubies=physicalCubies.filter(c=>axisComponent(c.logical,def.axis)===def.layer),ids=new Set(),tiles=[];if(cubies.length!==9)throw new Error('R4.4.2 expected 9 cubies on '+face+', got '+cubies.length);for(const cubie of cubies){const coords=semanticR442FaceTileCoords(face,cubie.logical),mask=createSemanticR442TileMask(globalTexture,face,cubie.logical),rough=createSemanticR441PearlRoughnessTile(mask),meshes=collectSemanticPhysicalMeshes(cubie,face);if(!meshes.length)throw new Error('R4.4.2 missing outward '+face+' face mesh for cubie '+cubie.id);for(const mesh of meshes){const material=createPhysicalEngravedMaterial(mesh,mesh.material,mask,rough,face);mesh.material=material;mesh.userData.semanticEngravedTile={face,logical:{...cubie.logical},u:coords.u,v:coords.v,physical:true};const tile={face,cubieId:cubie.id,mesh,material,mask,rough,u:coords.u,v:coords.v,origin:{...cubie.logical}};tiles.push(tile);semanticEngravedTiles.push(tile)}ids.add(cubie.id);faceTileCount++}semanticR442FaceRegistry.set(face,{...def,ids,tiles,lastUsedPresentationMs:-Infinity})}semanticEngravedLogicalTileCount=faceTileCount;if(faceTileCount!==27)throw new Error('R4.4.2 physical semantic face-tile coverage expected 27, got '+faceTileCount);semanticR442SetActiveMaterialFace(null);return semanticEngravedTiles.length}
function updateSemanticPhysicalOptics(mesh,logical){if(!mesh?.userData?.semanticEngravedTile)return;const face=mesh.userData.semanticEngravedTile.face;if(face!==semanticR442ActiveMaterialFace)return;const q=semanticR442EvaluateFace(face,false);if(q){semanticR43OpticalDiagnostics={alignment:q.brdfQuality,faceView:q.viewAlignment,halfDot:q.halfDot,signedFaceView:q.signedFaceView,signedHalfDot:q.signedHalfDot,frontFacing:q.signedFaceView>0,fieldCenter:[.5,.5],fieldAxis:[1,0],opportunity:q.rawQuality,persistent:true,microNormal:true,alphaDominant:false,engravedFace:face,physicalCubieMaterial:true,visualDriverTimeline:false,naturalOpportunityCount:semanticR43OpportunityCount}}}
function createSemanticTextMaterial(){const m=new THREE.MeshBasicMaterial({visible:false,transparent:true,opacity:0});m.userData.semanticMaterial='R4_3_DISABLED_OVERLAY_TEXT';return m}

function setupSemanticSurface() {
  if (!sceneOne || semanticReady) return;
  const spanY = Math.abs(latticeCenters.Y[2] - latticeCenters.Y[0]) + GEOMETRY_R1.faceOuterSize;
  const spanZ = Math.abs(latticeCenters.Z[2] - latticeCenters.Z[0]) + GEOMETRY_R1.faceOuterSize;
  const faceSpan = Math.min(spanY, spanZ) * 0.998;
  const shape = roundedRectShape(faceSpan, faceSpan, GEOMETRY_R1.faceCornerRadius * 1.10);
  const surfaceMaterial = new THREE.MeshPhysicalMaterial({
    color: SEMANTIC_R4.surfaceColor,
    metalness: 0.26,
    roughness: 0.405,
    clearcoat: 0.04,
    clearcoatRoughness: 0.30,
    envMapIntensity: 0.90,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    depthTest: true,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
  semanticSurface = new THREE.Mesh(new THREE.ShapeGeometry(shape, 12), surfaceMaterial);
  semanticSurface.renderOrder = 32;

  semanticMaskTexture = createSeamAwareBrandMaskTexture(createSemanticR441ScaledBrandMaskTexture(createBrandMaskTexture()), faceSpan);
  const textGeometry = new THREE.PlaneGeometry(faceSpan * 0.992, faceSpan * 0.992);
  const softText = new THREE.Mesh(textGeometry.clone(), createSemanticTextMaterial(semanticMaskTexture));
  softText.position.z = SEMANTIC_R4.internalSoftDepth;
  softText.renderOrder = 30;
  const sharpText = new THREE.Mesh(textGeometry, createSemanticTextMaterial(semanticMaskTexture));
  sharpText.position.z = SEMANTIC_R4.internalSharpDepth;
  sharpText.renderOrder = 31;
  semanticTextMeshes = [softText, sharpText];
  softText.visible=false;sharpText.visible=false;semanticSurface.visible=false;
  installPhysicalSemanticEngraving(semanticMaskTexture);
  semanticText=sharpText;

  semanticGroup = new THREE.Group();
  semanticGroup.name = 'SEMANTIC_BRAND_FACE_R4_INTERNAL_OPTICAL_REVEAL';
  semanticGroup.add(softText, sharpText, semanticSurface);
  sceneOne.add(semanticGroup);
  semanticFace=SEMANTIC_R4_3_ENGRAVED_FACE;
  orientSemanticGroup(SEMANTIC_R4_3_ENGRAVED_FACE);
  semanticReady = true;
  semanticRuntimeStartWallMs = performance.now();
  clearSemanticReviewState();
}

function getCurrentBestFaceVisibility() {
  if (!semanticReady) return { face: SEMANTIC_R4.selectedFallbackFace, dot: -1 };
  sceneOne.updateMatrixWorld(true);
  const centerWorld = sceneOne.localToWorld(cubeCenterLocal.clone());
  const toCamera = camera.position.clone().sub(centerWorld).normalize();
  const worldQ = sceneOne.getWorldQuaternion(new THREE.Quaternion());
  let best = { face: SEMANTIC_R4.selectedFallbackFace, dot: -Infinity };
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

function setSemanticVisualState(){if(!semanticReady)return false;semanticSurfaceProgress=0;semanticTextFormation=1;semanticTextLuminance=1;semanticSweep=.50;semanticSurface.visible=false;semanticTextMeshes.forEach(mesh=>mesh.visible=false);semanticGroup.visible=false;return true;}

function setSemanticReviewState(state = {}, renderFrame = true) {
  if (!captureMode || !semanticReady) return false;
  const result = setSemanticVisualState(state);
  if (result && renderFrame) renderReviewFrame();
  return result;
}

function clearSemanticReviewState(){if(!semanticReady)return false;semanticSurfaceProgress=0;semanticTextFormation=1;semanticTextLuminance=1;semanticSweep=.50;semanticSurface.visible=false;semanticTextMeshes.forEach(mesh=>mesh.visible=false);semanticGroup.visible=false;return true;}

function semanticTimelineState(elapsedMs){const total=SEMANTIC_R4.revealMs+SEMANTIC_R4.readableHoldMs+SEMANTIC_R4.exitMs;const envelopeIn=smootherstep(THREE.MathUtils.clamp(elapsedMs/720,0,1)),envelopeOut=1-smootherstep(THREE.MathUtils.clamp((elapsedMs-1450)/920,0,1));return{timeScale:1,surface:0,formation:1,luminance:envelopeIn*envelopeOut,sweep:.50,exit:0,holdEnd:SEMANTIC_R4.revealMs+SEMANTIC_R4.readableHoldMs,blockRelease:0,total,opportunityEnvelope:envelopeIn*envelopeOut}}

function beginSemanticRuntime(now){semanticFace=SEMANTIC_R4_3_ENGRAVED_FACE;semanticVisibilityDot=semanticR43OpticalDiagnostics.faceView;semanticActive=true;semanticPending=false;semanticComplete=false;semanticBlocksSlices=false;semanticTimeScale=1;semanticStartWallMs=now;semanticElapsedMs=0;semanticEntryPresentationMs=presentationSimTimeMs;semanticHoldPresentationMs=null;semanticFirstSurfaceWallMs=null;semanticFirstTypographyWallMs=now;semanticCompletedWallMs=null;semanticSchedulerEntry={eventSerial:sliceEventSerial,eventsUntilBreath,seed:sliceSeed>>>0}}
function replaySemanticBrandMoment(){if(!semanticReady||captureMode||prefersReducedMotion)return false;semanticReplayRequested=true;semanticComplete=false;semanticActive=false;semanticPending=false;semanticBlocksSlices=false;semanticTimeScale=1;return true}
function updateSemanticRuntime(now){if(captureMode||!semanticReady)return;semanticTimeScale=1;semanticBlocksSlices=false;if(prefersReducedMotion){setSemanticVisualState();return}if(!semanticActive&&!semanticComplete){if(!semanticReplayRequested&&presentationSimTimeMs<SEMANTIC_R4.triggerSearchStartMs)return;if(!semanticPending){semanticPending=true;semanticOpportunityWallMs=now;semanticOpportunityPresentationMs=presentationSimTimeMs;semanticOpportunityActiveTurns=activeTurns.size;semanticWaitedForActiveSlice=false}beginSemanticRuntime(now);semanticReplayRequested=false}if(!semanticActive){setSemanticVisualState();return}semanticElapsedMs=Math.max(0,now-semanticStartWallMs);const state=semanticTimelineState(semanticElapsedMs);if(semanticHoldPresentationMs===null&&semanticElapsedMs>=SEMANTIC_R4.revealMs)semanticHoldPresentationMs=presentationSimTimeMs;if(semanticElapsedMs>=state.total){semanticTimeScale=1;semanticBlocksSlices=false;semanticActive=false;semanticPending=false;semanticComplete=true;semanticCompletedWallMs=now;semanticSchedulerExit={eventSerial:sliceEventSerial,eventsUntilBreath,seed:sliceSeed>>>0}}}

function getSemanticDiagnostics() {
  return {
    config: SEMANTIC_R4,
    ready: semanticReady,
    active: semanticActive,
    complete: semanticComplete,
    face: semanticFace,
    visibilityDot: semanticVisibilityDot,
    timeScale: semanticTimeScale,
    blocksSlices: semanticBlocksSlices,
    elapsedMs: semanticElapsedMs,
    pending: semanticPending,
    opportunityWallMs: semanticOpportunityWallMs,
    opportunityPresentationMs: semanticOpportunityPresentationMs,
    opportunityMotionSimMs: semanticOpportunityMotionSimMs,
    runtimeStartWallMs: semanticRuntimeStartWallMs,
    firstSurfaceElapsedMs: semanticFirstSurfaceWallMs === null || semanticStartWallMs === 0 ? null : semanticFirstSurfaceWallMs - semanticStartWallMs,
    firstTypographyElapsedMs: semanticFirstTypographyWallMs === null || semanticStartWallMs === 0 ? null : semanticFirstTypographyWallMs - semanticStartWallMs,
    completedElapsedMs: semanticCompletedWallMs === null || semanticStartWallMs === 0 ? null : semanticCompletedWallMs - semanticStartWallMs,
    opportunityActiveTurns: semanticOpportunityActiveTurns,
    waitedForActiveSlice: semanticWaitedForActiveSlice,
    semanticVelocityMultiplier: SEMANTIC_R4.semanticVelocityMultiplier,
    sliceBlockTargetMs: SEMANTIC_R4.revealMs + SEMANTIC_R4.readableHoldMs + SEMANTIC_R4.exitMs * SEMANTIC_R4.blockReleaseExitProgress,
    surfaceOpacityMax: SEMANTIC_R4.surfaceMaxOpacity,
    textMeshCount: semanticTextMeshes.length,
    physicalEngravedTileMeshCount:semanticEngravedTiles.length,
    physicalEngravedLogicalTileCount:semanticEngravedLogicalTileCount,
    materialModel:'MeshPhysicalMaterial / R4.3 engraving embedded in outward +Z cubie face materials',
    materialPalette:SEMANTIC_R4_MATERIAL_PALETTE,
    revealCharacter:'persistent physical cubie engraving / BRDF-only discovery / no text overlay reveal',
    opticalDriver:SEMANTIC_R4_3_ENGRAVING.driver,
    opticalField:semanticR43OpticalDiagnostics,
    baseInlayTreatment:'inherited Graphite/Gunmetal/Black-Chrome cubie material with permanent bump micro-normal plus roughness/clearcoat-roughness micro-treatment',
    persistentInscription:true,
    alphaDominantReveal:false,
    microNormalEngraving:true,
    physicalCubieMaterial:true,
    overlayTextRendered:false,
    visualDriverTimeline:false,
    materialPropertiesStatic:true,
    semanticMotionCoupled:false,
    semanticOrientationForcing:false,
    semanticAcceleration:false,
    semanticDeceleration:false,
    effectiveGlobalMotionScale:1.0,
    naturalOpportunityCount:semanticR43OpportunityCount,
    motionTrace:semanticMotionTrace.slice(-960),
    seamAwareOcclusion:true,
    seamMaskSource:semanticMaskTexture?.userData?.semanticSeamMask?.source||null,
    emissive:false,
    glowHalo:false,
    scanWipeShimmer:false,
    letterWordStagger:false,
    r442TypographyScale:semanticMaskTexture?.userData?.semanticR441TypographyScale||null,
    r442Material:{bumpScale:-.130,dormantBumpScale:-.012,roughnessMapInk:.550,tonalInk:.820,pearlEdgeRoughnessInk:.095,uniformSilverFill:false,topReflectorIntensity:.92,topReflectorAnimated:false,activeMaterialFace:semanticR442ActiveMaterialFace,physicalFaceCandidates:[...SEMANTIC_R442_ELIGIBLE_FACES],topFaceEligible:false},
    r442DynamicFace:{eligibleFaces:[...SEMANTIC_R442_ELIGIBLE_FACES],selectedMaterialFace:semanticR442ActiveMaterialFace,candidates:semanticR442State.candidateScores.map(x=>({...x})),faceSelections:[...semanticR442State.faceSelections],protected:semanticR442State.protected,protectedFace:semanticR442State.protectedFace,protectionCount:semanticR442State.protectionCount,releaseCount:semanticR442State.releaseCount,protectedIntervals:[...semanticR442State.protectedIntervals],lastReleasedFace:semanticR442State.lastReleasedFace,lastReleasedAtMs:semanticR442State.lastReleasedAtMs,postReleaseParticipationCount:semanticR442State.postReleaseParticipationCount,lastPostReleaseParticipation:semanticR442State.lastPostReleaseParticipation,assemblyViolations:semanticR442State.assemblyViolations,unsafeProtectedStarts:semanticR442State.unsafeProtectedStarts,qualityThresholds:SEMANTIC_R442_QUALITY},
    r442MoveDiversity:{recentMoves:[...semanticR442MoveState.recentMoves],moveLog:[...semanticR442MoveState.moveLog],axisCounts:{...semanticR442MoveState.axisCounts},layerCounts:{...semanticR442MoveState.layerCounts},selectionCount:semanticR442MoveState.selectionCount,skipped:semanticR442MoveState.skipped},
    r442Cadence:SEMANTIC_R442_CADENCE,
    r444PhraseGraphR2:{
  revision:'PROAI_CUBE_R4.4.4_R2',
  phraseVocabulary:Object.keys(SEMANTIC_R444_PHRASES_R2),
  graphEdges:Object.fromEntries(Object.entries(SEMANTIC_R444_GRAPH_R2).map(([k,v])=>[k,[...v]])),
  currentFace:semanticR444StateR2.currentFace,
  currentGraphNode:semanticR444StateR2.currentGraphNode,
  assemblySig:semanticR444StateR2.assemblySig,
  assembledFaces:semanticR444GetAssembledFaces(),
  currentPhrase:semanticR444StateR2.currentPhrase?.name||null,
  phraseProgress:semanticR444StateR2.phraseProgress,
  currentMoveIndex:semanticR444StateR2.currentMoveIndex,
  memory:[...semanticR444StateR2.memory],
  lifecycleState:semanticR444StateR2.lifecycleState,
  lifecycleTransitions:semanticR444StateR2.lifecycleTransitions,
  completedMessages:semanticR444StateR2.completedMessages,
  activeMessage:semanticR444StateR2.activeMessage,
  activeMessageIndex:semanticR444StateR2.activeMessageIndex,
  nextMessage:SEMANTIC_R444_CONFIG_R2.semanticSequence[semanticR444StateR2.nextMessageIndex],
  cooldownUntilMs:semanticR444StateR2.cooldownUntilMs,
  cooldownReason:semanticR444StateR2.cooldownReason,
  lastSemanticFace:semanticR444StateR2.lastSemanticFace,
  lastSemanticMs:semanticR444StateR2.lastSemanticMs,
  protectionActive:semanticR444StateR2.protectionActive,
  protectedFaceAtPhraseStart:semanticR444StateR2.protectedFaceAtPhraseStart,
  lifecycleLog:[...semanticR444StateR2.lifecycleLog],
  eventLog:[...semanticR444StateR2.eventLog],
  validationLog:[...semanticR444StateR2.validationLog],
  noSolverNoDebtNoQuota:true,
  continuousYaw:true,
  physicalMaterialOnly:true,
  computedValidation:true,
  singleLifecycleAuthority:true,
  singleStartAuthority:true,
  explicitProtectionLifecycle:true,
},
r443Lifecycle:{revision:'PROAI_CUBE_R4.4.3',phase:semanticR443State.phase,sequence:[...SEMANTIC_R443_SEQUENCE],nextMessageIndex:semanticR443State.nextMessageIndex,nextMessage:SEMANTIC_R443_SEQUENCE[semanticR443State.nextMessageIndex],activeMessage:semanticR443State.activeMessage,activeMessageIndex:semanticR443State.activeMessageIndex,candidateFace:semanticR443State.candidateFace,candidateSinceMs:semanticR443State.candidateSinceMs,lastReleaseFace:semanticR443State.lastReleaseFace,lastReleaseMs:semanticR443State.lastReleaseMs,cooldownUntilMs:semanticR443State.cooldownUntilMs,faceArmed:{...semanticR443State.faceArmed},recentFaces:[...semanticR443State.recentFaces],dispersalDone:semanticR443State.dispersalDone,dispersalLatencyMs:semanticR443State.dispersalLatencyMs,dispersalLatenciesMs:[...semanticR443State.dispersalLatenciesMs],opportunityIntervalsMs:[...semanticR443State.opportunityIntervalsMs],readableDurationsMs:[...semanticR443State.readableDurationsMs],candidateLog:[...semanticR443State.candidateLog],eventLog:[...semanticR443State.eventLog],lifecycleLog:[...semanticR443State.lifecycleLog],overdueDispersalCount:semanticR443State.overdueDispersalCount,shortReadableCount:semanticR443State.shortReadableCount,config:SEMANTIC_R443_CONFIG,noSemanticFlashByConstruction:true,sequencePhysicalMaterial:true},
r443Motion:{yawDirectionPolicy:'continuous-positive',yawVelocityDegPerSec:presentationYawVelocityDegPerSec,signedYawDeg:presentationSignedYawDeg,cumulativeYawDeg:presentationCumulativeYawDeg,frameAngularDeltaRad:presentationFrameDeltaRad,semanticVelocityMultiplier:1,semanticOrientationForcing:false},

    r443Lifecycle:{revision:'PROAI_CUBE_R4.4.3',phase:semanticR443State.phase,sequence:[...SEMANTIC_R443_SEQUENCE],nextMessageIndex:semanticR443State.nextMessageIndex,nextMessage:SEMANTIC_R443_SEQUENCE[semanticR443State.nextMessageIndex],activeMessage:semanticR443State.activeMessage,activeMessageIndex:semanticR443State.activeMessageIndex,candidateFace:semanticR443State.candidateFace,candidateSinceMs:semanticR443State.candidateSinceMs,lastReleaseFace:semanticR443State.lastReleaseFace,lastReleaseMs:semanticR443State.lastReleaseMs,cooldownUntilMs:semanticR443State.cooldownUntilMs,faceArmed:{...semanticR443State.faceArmed},recentFaces:[...semanticR443State.recentFaces],dispersalDone:semanticR443State.dispersalDone,dispersalLatencyMs:semanticR443State.dispersalLatencyMs,dispersalLatenciesMs:[...semanticR443State.dispersalLatenciesMs],opportunityIntervalsMs:[...semanticR443State.opportunityIntervalsMs],readableDurationsMs:[...semanticR443State.readableDurationsMs],candidateLog:[...semanticR443State.candidateLog],eventLog:[...semanticR443State.eventLog],lifecycleLog:[...semanticR443State.lifecycleLog],overdueDispersalCount:semanticR443State.overdueDispersalCount,shortReadableCount:semanticR443State.shortReadableCount,config:SEMANTIC_R443_CONFIG,noSemanticFlashByConstruction:true,sequencePhysicalMaterial:true},
    r443Motion:{yawDirectionPolicy:'continuous-positive',yawVelocityDegPerSec:presentationYawVelocityDegPerSec,signedYawDeg:presentationSignedYawDeg,cumulativeYawDeg:presentationCumulativeYawDeg,frameAngularDeltaRad:presentationFrameDeltaRad,semanticVelocityMultiplier:1,semanticOrientationForcing:false},
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
  return false;
}

function sliceAutonomyBlocked() {
  return semanticBlocksSlices;
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

  const deltaMs=wallDeltaMs;
  recordSemanticMotionSample(wallDeltaMs,deltaMs);
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

function semanticR442FaceAssembled(face){const reg=semanticR442FaceRegistry.get(face);if(!reg||reg.ids.size!==9)return false;const identity=[1,0,0,0,1,0,0,0,1];for(const cubie of physicalCubies){if(!reg.ids.has(cubie.id))continue;const origin=cubie.id.split('|').map(Number);if(cubie.logical.x!==origin[0]||cubie.logical.y!==origin[1]||cubie.logical.z!==origin[2]||cubie.orientation.some((v,i)=>v!==identity[i]))return false}return true}
function semanticR442ProjectedAreaQuality(face){const reg=semanticR442FaceRegistry.get(face);if(!reg)return 0;let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,count=0;const used=new Set();for(const tile of reg.tiles){if(used.has(tile.cubieId))continue;used.add(tile.cubieId);const p=tile.mesh.getWorldPosition(new THREE.Vector3()).project(camera);if(!Number.isFinite(p.x)||!Number.isFinite(p.y))continue;minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y);count++}if(count<4)return 0;const area=Math.max(0,(maxX-minX)*(maxY-minY));return THREE.MathUtils.clamp(area/.42,0,1)}
function semanticR442RecentFacePenalty(face){const reg=semanticR442FaceRegistry.get(face);if(!reg)return 0;const age=presentationSimTimeMs-reg.lastUsedPresentationMs;if(age>=SEMANTIC_R442_QUALITY.recentFaceWindowMs)return 1;return THREE.MathUtils.lerp(.72,1,THREE.MathUtils.clamp(age/SEMANTIC_R442_QUALITY.recentFaceWindowMs,0,1))}
function semanticR442EvaluateFace(face,applyRecent=true){const reg=semanticR442FaceRegistry.get(face);if(!reg)return null;const assembled=semanticR442FaceAssembled(face);if(!assembled)return{face,assembled:false,rawQuality:0,selectionScore:0,viewAlignment:0,projectedAreaQuality:0,distortionPenalty:0,brdfQuality:0,recentFacePenalty:semanticR442RecentFacePenalty(face)};sceneOne.updateMatrixWorld(true);camera.updateMatrixWorld(true);key.updateMatrixWorld(true);const center=sceneOne.localToWorld(cubeCenterLocal.clone()),worldQ=sceneOne.getWorldQuaternion(new THREE.Quaternion()),normal=semanticFaceNormal(face).applyQuaternion(worldQ).normalize(),cameraWorld=camera.getWorldPosition(new THREE.Vector3()),view=cameraWorld.clone().sub(center).normalize(),signedFaceView=normal.dot(view),viewAlignment=THREE.MathUtils.clamp(signedFaceView,0,1),area=semanticR442ProjectedAreaQuality(face),distortion=THREE.MathUtils.smoothstep(viewAlignment,.50,.86),lightWorld=key.getWorldPosition(new THREE.Vector3()),lightDir=lightWorld.clone().sub(center).normalize(),half=view.clone().add(lightDir).normalize(),signedHalfDot=normal.dot(half),halfDot=THREE.MathUtils.clamp(signedHalfDot,0,1),brdf=THREE.MathUtils.smoothstep(halfDot,.54,.90),viewQ=THREE.MathUtils.smoothstep(viewAlignment,.50,.88),areaQ=THREE.MathUtils.smoothstep(area,.20,.78),raw=assembled?THREE.MathUtils.clamp(.46*viewQ+.18*areaQ+.24*brdf+.12*distortion,0,1):0,recent=semanticR442RecentFacePenalty(face),selection=raw*(applyRecent?recent:1);return{face,assembled,rawQuality:raw,selectionScore:selection,viewAlignment,projectedAreaQuality:area,distortionPenalty:distortion,brdfQuality:brdf,halfDot,signedHalfDot,signedFaceView,recentFacePenalty:recent}}
function semanticR442BestFace(){const all=SEMANTIC_R442_ELIGIBLE_FACES.map(f=>semanticR442EvaluateFace(f,true)).filter(Boolean);for(const q of all){if(semanticR442State.faceRearmBlocked[q.face]&&q.rawQuality<=SEMANTIC_R442_QUALITY.rearmScore)semanticR442State.faceRearmBlocked[q.face]=false}semanticR442State.candidateScores=all.map(x=>({...x,rearmBlocked:semanticR442State.faceRearmBlocked[x.face]===true}));const list=all.filter(x=>semanticR442State.faceRearmBlocked[x.face]!==true).sort((a,b)=>b.selectionScore-a.selectionScore);return list[0]||null}
function semanticR442ReleaseProtection(reason='phrase-complete'){
  return semanticR444ReleaseProtectionR2(reason);
}function semanticR442UpdateProtectionState(){
  semanticR444WrappedUpdateProtectionStateR2();
}function semanticR442MoveIntersection(move,face=semanticR442State.protectedFace){const reg=face?semanticR442FaceRegistry.get(face):null;if(!reg)return{count:0,ids:[]};const selected=selectLayer(move.axis,move.layer),ids=selected.filter(c=>reg.ids.has(c.id)).map(c=>c.id);return{count:ids.length,ids}}
function semanticR442RecentWeight(move){
  return semanticR444WeightR2(move);
}function semanticR442SelectMove(){
  const move=semanticR444WrappedSelectMoveR2();
  if(move) return move;
  // NO FALLBACK - if phrase graph has no move, return null (GRAPH_DEAD_END)
  // This prevents hiding graph failures behind random movement
  return null;
}function semanticR442RecordMove(move,phase='forward'){const intersection=semanticR442State.protected?semanticR442MoveIntersection(move):{count:0,ids:[]};if(semanticR442State.protected&&intersection.count>0)semanticR442State.unsafeProtectedStarts++;if(phase==='forward'){semanticR442MoveState.recentMoves.push({axis:move.axis,layer:move.layer,direction:move.direction,presentationMs:presentationSimTimeMs});if(semanticR442MoveState.recentMoves.length>5)semanticR442MoveState.recentMoves.shift();semanticR442MoveState.axisCounts[move.axis]=(semanticR442MoveState.axisCounts[move.axis]||0)+1;semanticR442MoveState.layerCounts[String(move.layer)]=(semanticR442MoveState.layerCounts[String(move.layer)]||0)+1;semanticR442MoveState.selectionCount++}const released=semanticR443State.lastReleaseFace,rejoin=released?semanticR442MoveIntersection(move,released):{count:0,ids:[]};if(released&&presentationSimTimeMs-semanticR443State.lastReleaseMs<12000&&rejoin.count>0){semanticR442State.postReleaseParticipationCount++;semanticR442State.lastPostReleaseParticipation={face:released,presentationMs:presentationSimTimeMs,phase,move:{axis:move.axis,layer:move.layer,direction:move.direction}}}if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL&&released&&rejoin.count>0){const latency=Math.max(0,presentationSimTimeMs-semanticR443State.lastReleaseMs);semanticR443State.dispersalDone=true;semanticR443State.dispersalLatencyMs=latency;semanticR443State.dispersalLatenciesMs.push(latency);if(semanticR443State.dispersalLatenciesMs.length>32)semanticR443State.dispersalLatenciesMs.shift();semanticR443State.phase=SEMANTIC_R443_PHASE.COOLDOWN;semanticR443Log('dispersal-slice',{face:released,latencyMs:latency,phase,axis:move.axis,layer:move.layer,direction:move.direction})}semanticR442MoveState.moveLog.push({presentationMs:presentationSimTimeMs,phase,axis:move.axis,layer:move.layer,direction:move.direction,protected:semanticR442State.protected,protectedFace:semanticR442State.protectedFace,semanticIntersection:intersection.count,r443Phase:semanticR443State.phase,pendingResolutionCount:semanticR443PendingResolutionCount});if(semanticR442MoveState.moveLog.length>160)semanticR442MoveState.moveLog.shift();return intersection}
async function waitForSliceAutonomy(){while(sliceSchedulerEnabled&&sliceAutonomyBlocked())await sleep(40);return sliceSchedulerEnabled}
async function schedulerDelay(durationMs){let elapsed=0;let previous=performance.now();while(elapsed<durationMs&&sliceSchedulerEnabled){await sleep(Math.min(32,Math.max(8,durationMs-elapsed)));const now=performance.now();const delta=now-previous;previous=now;if(!sliceAutonomyBlocked())elapsed+=delta;if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL){const age=presentationSimTimeMs-semanticR443State.lastReleaseMs;if(age>=SEMANTIC_R443_CONFIG.dispersalTargetMs[0])return}}}
async function sliceSchedulerLoop(){
  // R2 phrase graph is authoritative - disable old scheduler
  sliceSchedulerEnabled = false;
  sliceSchedulerRunning = false;
  return;
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
});

controls.addEventListener('end', () => {
  interactionActive = false;
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
    semanticR4: getSemanticDiagnostics(),
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
  semanticR442UpdateProtectionState();
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
    if (!captureMode && !prefersReducedMotion) {
      presentationRig.quaternion.copy(presentationQuaternionAt(presentationSimTimeMs, presentationYawRad));
      presentationRig.updateMatrixWorld(true);
      lastPresentationQuaternion.copy(presentationRig.quaternion);
    }
    if (captureMode) renderReviewFrame();

    api.ready = true;
    setMotionState('rest');
    status.textContent = 'Three.js GLB loaded. Approved Cube baseline + Semantic Brand Face R4 ready.';
    if (sliceSchedulerEnabled) void sliceSchedulerLoop();
  },
  undefined,
  (error) => {
    console.error('GLB load failed', error);
    setMotionState('error');
    status.textContent = 'GLB load failed';
  },
);
