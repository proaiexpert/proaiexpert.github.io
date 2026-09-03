import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

const GLB_URL = new URL('./proai-cube-r1.glb?sha=2A97D4671F5A', import.meta.url).href;
const PROAI_CUBE_IDENTITY = Object.freeze({
  schema: 'proai.asset.provenance.v1',
  assetId: 'PAI-CUBE-0001',
  publicName: 'PROAI CUBE',
  assetFamily: 'proai-cube',
  revision: 'r1',
  buildId: 'PAI-CUBE-R1-7B0942A0',
  forensicId: '2D2B518012AECCAC',
  sourceCommit: '7b0942a042ef23e10cd74592208eeae94479b45e',
  provenanceState: 'owner-review',
  plannedProvenanceUrl: 'https://proai-expert.com/provenance/proai-cube/r1',
  provenanceUrl: 'https://proai-expert.com/provenance/proai-cube/r1',
  protectionProfile: 'ownership-protection-r2',
  signatureNodeId: 'PROAI_SIG_KINETIC_R1',
  forensicNodeId: 'PROAI_FORENSIC_WITNESS_R1',
  signatureReveal: 'disabled-production',
});
const EXPECTED_GLB_SHA256 = '2A97D4671F5AED2E23E5688081C53E1E234A525CF145C6A89BA4C9909FB2B480';
const MICRO_ETCH_ID = 'PROAI_MICRO_ETCH_R2';
const MICRO_ETCH_TARGET = Object.freeze({ x: 1, y: 0, z: 0, face: '+X' });
let assetIntegrity = {
  expectedSha256: EXPECTED_GLB_SHA256,
  actualSha256: null,
  status: 'pending',
  requestCount: 0,
};
let runtimeIdentity = {
  status: 'pending',
  metadata: null,
  witnessPresent: false,
};
const getOwnershipFingerprint = () => Object.freeze({ ...PROAI_CUBE_IDENTITY, glbUrl: GLB_URL });
const canvas = document.getElementById('cube-canvas');
const status = document.getElementById('runtime-status');
canvas?.setAttribute('data-proai-asset-id', PROAI_CUBE_IDENTITY.assetId);
const params = new URLSearchParams(location.search);
const captureMode = params.has('capture');
const reviewMode = params.has('review');
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

// Runtime whole-object presentation authority — R1.2 premium editorial spatial motion.
const PRESENTATION_SPATIAL_R1_2 = Object.freeze({
  cycleMs: 66000,
  motionAuthority: 'quaternion-editorial-spatial-r1.2-premium',
  keyframes: Object.freeze([
    Object.freeze({ timeMs: 0, poseDeg: Object.freeze([0, 0, 0]), motion: 'sweep', label: 'natural-3q' }),
    Object.freeze({ timeMs: 5600, poseDeg: Object.freeze([24, 58, -23]), motion: 'breath', label: 'top-side-3q' }),
    Object.freeze({ timeMs: 8200, poseDeg: Object.freeze([22, 64, -21]), motion: 'sweep', label: 'top-side-breath' }),
    Object.freeze({ timeMs: 13900, poseDeg: Object.freeze([-42, 38, -23]), motion: 'breath', label: 'lower-side-inspection' }),
    Object.freeze({ timeMs: 16400, poseDeg: Object.freeze([-40, 45, -21]), motion: 'sweep', label: 'lower-side-breath' }),
    Object.freeze({ timeMs: 22000, poseDeg: Object.freeze([9, 87, 6]), motion: 'breath', label: 'opposite-3q-a' }),
    Object.freeze({ timeMs: 24700, poseDeg: Object.freeze([7, 94, 8]), motion: 'sweep', label: 'opposite-3q-a-breath' }),
    Object.freeze({ timeMs: 30900, poseDeg: Object.freeze([-18, 178, -16]), motion: 'breath', label: 'deep-opposite-3q' }),
    Object.freeze({ timeMs: 33700, poseDeg: Object.freeze([-16, 184, -14]), motion: 'sweep', label: 'deep-opposite-breath' }),
    Object.freeze({ timeMs: 38600, poseDeg: Object.freeze([24, 138, 23]), motion: 'breath', label: 'high-opposite-return' }),
    Object.freeze({ timeMs: 41200, poseDeg: Object.freeze([22, 144, 21]), motion: 'sweep', label: 'high-opposite-breath' }),
    Object.freeze({ timeMs: 46900, poseDeg: Object.freeze([-27, 96, 31]), motion: 'breath', label: 'diagonal-return-inspection' }),
    Object.freeze({ timeMs: 49400, poseDeg: Object.freeze([-24, 102, 29]), motion: 'sweep', label: 'diagonal-return-breath' }),
    Object.freeze({ timeMs: 55500, poseDeg: Object.freeze([19, 42, -14]), motion: 'breath', label: 'front-side-3q' }),
    Object.freeze({ timeMs: 58100, poseDeg: Object.freeze([17, 48, -12]), motion: 'sweep', label: 'front-side-breath' }),
    Object.freeze({ timeMs: 66000, poseDeg: Object.freeze([0, 0, 0]), motion: 'sweep', label: 'natural-3q-loop' }),
  ]),
  easing: Object.freeze({ sweepLinearWeight: 0.14, breathLinearWeight: 0.72, sweepSettleBias: 0.075 }),
  targetBreathSpeedDegPerSec: Object.freeze([2, 6]),
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
const signatureMaterial = physicalMaterial({ color: '#b9f3ff', metalness: 0.86, roughness: 0.22, clearcoat: 0.22, clearcoatRoughness: 0.12, envMapIntensity: 1.34 });
signatureMaterial.emissive.set('#0b3442');
signatureMaterial.emissiveIntensity = 0.72;
signatureMaterial.transparent = true;
signatureMaterial.opacity = 0;
signatureMaterial.side = THREE.DoubleSide;
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
let ownershipSignatureRoot = null;
let forensicWitnessRoot = null;
let microEtchRoot = null;
let microEtchHost = null;
let microEtchMaterial = null;
let microEtchFace = null;
let microEtchGlintActive = false;
let microEtchGlintNextAt = 0;
let microEtchGlintEndsAt = 0;
let microEtchGlintCount = 0;
let ownershipSignatureReveal = 0;
let ownershipSignatureInspection = false;
let ownershipSignatureLastNow = 0;

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
let presentationLastNow = 0;
let presentationFrameDeltaRad = 0;
let presentationAngularTravelDeg = 0;
let presentationAngularVelocityDegPerSec = 0;
let presentationPhase = PRESENTATION_SPATIAL_R1_2.keyframes[0].motion;
let presentationPoseLabel = PRESENTATION_SPATIAL_R1_2.keyframes[0].label;
let lastPresentationQuaternion = new THREE.Quaternion();
const presentationPoseEuler = new THREE.Euler();
const presentationPoseQuaternionA = new THREE.Quaternion();
const presentationPoseQuaternionB = new THREE.Quaternion();
const presentationInverseQuaternion = new THREE.Quaternion();
const presentationRelativeQuaternion = new THREE.Quaternion();
const presentationTargetQuaternion = new THREE.Quaternion();
const presentationAxis = new THREE.Vector3();

const api = {
  ready: false,
  identity: PROAI_CUBE_IDENTITY,
  motionState,
  motionConfig: MOTION,
  geometryConfig: GEOMETRY_R1,
  presentationConfig: PRESENTATION_SPATIAL_R1_2,
  sliceConfig: SLICE_R1_2,
  geometry: null,
  hierarchy: null,
  mechanics: null,
  turnSlice,
  runAutomatedQA,
  runPairedTurnQA,
  getDiagnostics,
  getInteractionState,
  getOwnershipFingerprint,
  setSignatureInspection(enabled = false) {
    ownershipSignatureInspection = false;
    ownershipSignatureReveal = 0;
    signatureMaterial.opacity = 0;
    if (!ownershipSignatureRoot) return false;
    ownershipSignatureRoot.visible = false;
    return false;
  },
  setForensicInspection(enabled = false) {
    if (!forensicWitnessRoot) return false;
    forensicWitnessRoot.visible = Boolean(enabled);
    return forensicWitnessRoot.visible;
  },
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
  captureFrame(type = 'image/png', quality = 0.94) {
    renderReviewFrame();
    return canvas.toDataURL(type, quality);
  },
};
window.__PROAI_CUBE_R1_2 = api;
window.__PROAI_CUBE_R1 = api;
window.__PROAI_CUBE_ML_R1 = api;
window.__PROAI_CUBE_SPATIAL_R1 = api;
window.__PROAI_CUBE_SPATIAL_R1_1 = api;
window.__PROAI_CUBE_SPATIAL_R1_2 = api;

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

function isOwnershipNode(object) {
  return Boolean(object.userData?.proaiNodeId)
    || object.name === 'PROAI_SIG_KINETIC_R1'
    || object.name === 'PROAI_FORENSIC_WITNESS_R1'
    || object.name === MICRO_ETCH_ID;
}

function setupOwnershipNodes() {
  ownershipSignatureRoot = cubeRoot.getObjectByName(PROAI_CUBE_IDENTITY.signatureNodeId);
  forensicWitnessRoot = cubeRoot.getObjectByName(PROAI_CUBE_IDENTITY.forensicNodeId);
  if (!ownershipSignatureRoot || !forensicWitnessRoot) {
    throw new Error('ProAI ownership nodes missing from canonical GLB');
  }
  ownershipSignatureRoot.traverse((object) => {
    if (!object.isMesh) return;
    object.material = signatureMaterial;
    object.renderOrder = 2;
    object.castShadow = false;
    object.receiveShadow = false;
  });
  signatureMaterial.depthTest = false;
  signatureMaterial.depthWrite = false;
  ownershipSignatureRoot.visible = false;
  signatureMaterial.opacity = 0;
  forensicWitnessRoot.visible = false;
  ownershipSignatureReveal = 0;
  ownershipSignatureInspection = false;
  ownershipSignatureLastNow = 0;
}

function createMicroEtchBar(group, x1, y1, x2, y2, thickness = 1.85) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);
  if (!length) return;
  const geometry = new THREE.ExtrudeGeometry(new THREE.Shape([
    new THREE.Vector2(-length * 0.5, -thickness * 0.5),
    new THREE.Vector2(length * 0.5, -thickness * 0.5),
    new THREE.Vector2(length * 0.5, thickness * 0.5),
    new THREE.Vector2(-length * 0.5, thickness * 0.5),
  ]), {
    depth: 0.14,
    bevelEnabled: false,
    steps: 1,
  });
  geometry.translate(0, 0, -0.035);
  const mesh = new THREE.Mesh(geometry, microEtchMaterial);
  mesh.position.set((x1 + x2) * 0.5, (y1 + y2) * 0.5, 0);
  mesh.rotation.z = Math.atan2(dy, dx);
  mesh.name = `${MICRO_ETCH_ID}_STROKE`;
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  group.add(mesh);
}

function addMicroEtchGlyph(group, glyph, offsetX) {
  const y = -4.2;
  const strokes = {
    P: [[0, y, 0, y + 8.4], [0, y + 8.4, 4.2, y + 8.4], [4.2, y + 8.4, 4.2, y + 4.2], [4.2, y + 4.2, 0, y + 4.2]],
    R: [[0, y, 0, y + 8.4], [0, y + 8.4, 4.2, y + 8.4], [4.2, y + 8.4, 4.2, y + 4.2], [4.2, y + 4.2, 0, y + 4.2], [0, y + 4.2, 4.4, y]],
    O: [[0, y, 0, y + 8.4], [0, y + 8.4, 4.2, y + 8.4], [4.2, y + 8.4, 4.2, y], [4.2, y, 0, y]],
    A: [[0, y, 2.1, y + 8.4], [2.1, y + 8.4, 4.2, y], [0.85, y + 3.25, 3.35, y + 3.25]],
    I: [[0, y + 8.4, 4.2, y + 8.4], [2.1, y + 8.4, 2.1, y], [0, y, 4.2, y]],
  }[glyph];
  if (!strokes) throw new Error(`Unsupported micro-etch glyph: ${glyph}`);
  for (const [x1, y1, x2, y2] of strokes) createMicroEtchBar(group, x1 + offsetX, y1, x2 + offsetX, y2);
}

function buildMicroEtchGeometry() {
  const group = new THREE.Group();
  group.name = MICRO_ETCH_ID;
  group.userData.proaiNodeId = MICRO_ETCH_ID;
  group.userData.role = 'single-face-center-runtime-micro-etch';
  const glyphs = [...'PROAI'];
  const glyphWidth = 4.2;
  const glyphGap = 2.2;
  const totalWidth = glyphs.length * glyphWidth + (glyphs.length - 1) * glyphGap;
  glyphs.forEach((glyph, index) => addMicroEtchGlyph(group, glyph, -totalWidth * 0.5 + index * (glyphWidth + glyphGap)));
  return group;
}

function setupMicroEtch() {
  const target = physicalCubies.find((cubie) => Object.entries(MICRO_ETCH_TARGET)
    .slice(0, 3)
    .every(([axis, value]) => cubie.logical[axis] === value));
  if (!target || !target.members[0]?.object) throw new Error('Micro-etch target cubie 1|0|0 missing');
  const host = target.members[0].object;
  const targetCenter = sceneOne.localToWorld(logicalPosition(target.logical).clone());
  const faceAxis = { X: 0, Y: 1, Z: 2 }[MICRO_ETCH_TARGET.face[1]];
  const targetNormalLocal = new THREE.Vector3().setComponent(faceAxis, MICRO_ETCH_TARGET.face[0] === '+' ? 1 : -1);
  const targetNormal = targetNormalLocal.clone()
    .applyQuaternion(sceneOne.getWorldQuaternion(new THREE.Quaternion()))
    .normalize();
  host.updateWorldMatrix(true, true);
  const hostInverse = host.matrixWorld.clone().invert();
  let best = null;
  host.traverse((object) => {
    if (!object.isMesh || !object.geometry) return;
    const source = sourceGeometryMetrics(object.geometry);
    const dimensions = [Math.abs(source.size.x), Math.abs(source.size.y), Math.abs(source.size.z)].sort((a, b) => a - b);
    if (dimensions[0] >= dimensions[2] * 0.12) return;
    object.updateWorldMatrix(true, false);
    const objectQuaternion = object.getWorldQuaternion(new THREE.Quaternion());
    const worldCenter = object.localToWorld(source.center.clone());
    const worldNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(objectQuaternion).normalize();
    const depth = worldCenter.clone().sub(targetCenter).dot(targetNormal);
    const normalAlignment = worldNormal.dot(targetNormal);
    const score = normalAlignment * 1000 + depth;
    if (!best || score > best.score) best = { object, source, worldCenter, worldNormal, score };
  });
  if (!best || best.worldNormal.dot(targetNormal) < 0.75) throw new Error(`Micro-etch ${MICRO_ETCH_TARGET.face} outward face could not be resolved`);
  const faceSurfaceLocal = best.source.center.clone();
  faceSurfaceLocal.setComponent(
    best.source.thinAxis,
    faceSurfaceLocal.getComponent(best.source.thinAxis) + best.source.size.getComponent(best.source.thinAxis) * 0.5,
  );
  const surfaceWorldCenter = best.object.localToWorld(faceSurfaceLocal);
  const localCenter = surfaceWorldCenter.applyMatrix4(hostInverse);
  const localNormal = best.worldNormal.clone().transformDirection(hostInverse).normalize();
  const localX = new THREE.Vector3(1, 0, 0).applyQuaternion(best.object.getWorldQuaternion(new THREE.Quaternion())).transformDirection(hostInverse).normalize();
  const localY = new THREE.Vector3(0, 1, 0).applyQuaternion(best.object.getWorldQuaternion(new THREE.Quaternion())).transformDirection(hostInverse).normalize();
  const basis = new THREE.Matrix4().makeBasis(localX, localY, localNormal);
  microEtchMaterial = new THREE.MeshPhysicalMaterial({
    color: '#252c33',
    metalness: 0.95,
    roughness: 0.30,
    clearcoat: 0.28,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.45,
    side: THREE.FrontSide,
    depthTest: true,
    depthWrite: true,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  microEtchRoot = buildMicroEtchGeometry();
  microEtchRoot.scale.setScalar(1.4);
  microEtchRoot.position.copy(localCenter).addScaledVector(localNormal, 0.01);
  microEtchRoot.quaternion.setFromRotationMatrix(basis);
  host.add(microEtchRoot);
  microEtchHost = host;
  microEtchFace = { target: { ...MICRO_ETCH_TARGET }, normal: targetNormal.toArray(), sourceMesh: best.object.name || '(unnamed)' };
  microEtchGlintNextAt = performance.now() + 26000;
}

function updateMicroEtchGlint(now = performance.now()) {
  if (!microEtchMaterial) return;
  if (prefersReducedMotion) {
    microEtchGlintActive = false;
    microEtchMaterial.roughness = 0.30;
    microEtchMaterial.clearcoatRoughness = 0.12;
    return;
  }
  if (!microEtchGlintActive && now >= microEtchGlintNextAt) {
    microEtchGlintActive = true;
    microEtchGlintEndsAt = now + 720;
    microEtchGlintCount += 1;
  }
  if (microEtchGlintActive) {
    const progress = THREE.MathUtils.clamp((now - (microEtchGlintEndsAt - 720)) / 720, 0, 1);
    const envelope = Math.sin(progress * Math.PI);
    microEtchMaterial.roughness = 0.30 - envelope * 0.035;
    microEtchMaterial.clearcoatRoughness = 0.12 - envelope * 0.025;
    if (now >= microEtchGlintEndsAt) {
      microEtchGlintActive = false;
      microEtchGlintNextAt = now + 27000;
      microEtchMaterial.roughness = 0.30;
      microEtchMaterial.clearcoatRoughness = 0.12;
    }
  }
}

function updateOwnershipSignatureReveal(now = performance.now()) {
  if (!ownershipSignatureRoot) return;
  ownershipSignatureInspection = false;
  ownershipSignatureReveal = 0;
  signatureMaterial.opacity = 0;
  ownershipSignatureRoot.visible = false;
}

function ownershipNodeBounds(root) {
  if (!root) return null;
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  return {
    min: box.min.toArray(),
    max: box.max.toArray(),
    size: box.getSize(new THREE.Vector3()).toArray(),
  };
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
    if (!object.isMesh || object.name === 'Plane' || isOwnershipNode(object) || !object.geometry) return;
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
  return false;
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

function presentationPoseQuaternion(poseDeg, outQuaternion = presentationTargetQuaternion) {
  presentationPoseEuler.set(
    THREE.MathUtils.degToRad(poseDeg[0]),
    THREE.MathUtils.degToRad(poseDeg[1]),
    THREE.MathUtils.degToRad(poseDeg[2]),
    'YXZ',
  );
  return outQuaternion.setFromEuler(presentationPoseEuler).normalize();
}

function presentationSegmentAt(timeMs) {
  const cycle = PRESENTATION_SPATIAL_R1_2.cycleMs;
  let local = timeMs % cycle;
  if (local < 0) local += cycle;
  const keys = PRESENTATION_SPATIAL_R1_2.keyframes;
  for (let index = 0; index < keys.length - 1; index += 1) {
    const a = keys[index];
    const b = keys[index + 1];
    if (local <= b.timeMs) {
      return {
        index,
        a,
        b,
        local,
        durationMs: Math.max(1, b.timeMs - a.timeMs),
        progress: THREE.MathUtils.clamp((local - a.timeMs) / Math.max(1, b.timeMs - a.timeMs), 0, 1),
      };
    }
  }
  const a = keys[keys.length - 2];
  const b = keys[keys.length - 1];
  return { index: keys.length - 2, a, b, local, durationMs: b.timeMs - a.timeMs, progress: 1 };
}

function presentationEditorialEase(progress, phase) {
  const p = THREE.MathUtils.clamp(progress, 0, 1);
  const linearWeight = phase === 'breath' ? PRESENTATION_SPATIAL_R1_2.easing.breathLinearWeight : PRESENTATION_SPATIAL_R1_2.easing.sweepLinearWeight;
  if (phase === 'breath') return THREE.MathUtils.lerp(smoothstep(p), p, linearWeight);
  const biased = THREE.MathUtils.clamp(p + PRESENTATION_SPATIAL_R1_2.easing.sweepSettleBias * Math.sin(Math.PI * p), 0, 1);
  return THREE.MathUtils.lerp(smoothstep(biased), biased, linearWeight);
}

function presentationEditorialEaseDerivative(progress, phase) {
  const p = THREE.MathUtils.clamp(progress, 0, 1);
  const e = 0.001, lo = Math.max(0, p - e), hi = Math.min(1, p + e);
  return hi <= lo ? 0 : (presentationEditorialEase(hi, phase) - presentationEditorialEase(lo, phase)) / (hi - lo);
}

function presentationSegmentGeometry(a, b) {
  const qa = presentationPoseQuaternion(a.poseDeg, presentationPoseQuaternionA);
  const qb = presentationPoseQuaternion(b.poseDeg, presentationPoseQuaternionB);
  presentationInverseQuaternion.copy(qa).invert();
  presentationRelativeQuaternion.copy(qb).multiply(presentationInverseQuaternion).normalize();
  if (presentationRelativeQuaternion.w < 0) {
    presentationRelativeQuaternion.x *= -1;
    presentationRelativeQuaternion.y *= -1;
    presentationRelativeQuaternion.z *= -1;
    presentationRelativeQuaternion.w *= -1;
  }
  const w = THREE.MathUtils.clamp(presentationRelativeQuaternion.w, -1, 1);
  const angleRad = 2 * Math.acos(w);
  const sinHalf = Math.sqrt(Math.max(0, 1 - w * w));
  if (sinHalf > 1e-6) {
    presentationAxis.set(
      presentationRelativeQuaternion.x / sinHalf,
      presentationRelativeQuaternion.y / sinHalf,
      presentationRelativeQuaternion.z / sinHalf,
    ).normalize();
  } else {
    presentationAxis.set(0, 1, 0);
  }
  return { qa, qb, axis: presentationAxis, angleRad, angleDeg: THREE.MathUtils.radToDeg(angleRad) };
}

function presentationQuaternionAt(timeMs, outQuaternion = presentationTargetQuaternion) {
  const segment = presentationSegmentAt(timeMs);
  const geometry = presentationSegmentGeometry(segment.a, segment.b);
  const eased = presentationEditorialEase(segment.progress, segment.a.motion);
  return outQuaternion.slerpQuaternions(geometry.qa, geometry.qb, eased).normalize();
}

function presentationCycleTravelDeg() {
  const keys = PRESENTATION_SPATIAL_R1_2.keyframes;
  let total = 0;
  for (let index = 0; index < keys.length - 1; index += 1) {
    total += presentationSegmentGeometry(keys[index], keys[index + 1]).angleDeg;
  }
  return total;
}

const PRESENTATION_SPATIAL_R1_2_CYCLE_TRAVEL_DEG = presentationCycleTravelDeg();

function presentationTravelAt(timeMs) {
  const target = Math.max(0, timeMs);
  const cycle = PRESENTATION_SPATIAL_R1_2.cycleMs;
  const completeCycles = Math.floor(target / cycle);
  const local = target % cycle;
  const keys = PRESENTATION_SPATIAL_R1_2.keyframes;
  let travelDeg = completeCycles * PRESENTATION_SPATIAL_R1_2_CYCLE_TRAVEL_DEG;
  for (let index = 0; index < keys.length - 1; index += 1) {
    const a = keys[index];
    const b = keys[index + 1];
    const geometry = presentationSegmentGeometry(a, b);
    if (local >= b.timeMs) {
      travelDeg += geometry.angleDeg;
      continue;
    }
    if (local > a.timeMs) {
      const progress = (local - a.timeMs) / Math.max(1, b.timeMs - a.timeMs);
      travelDeg += geometry.angleDeg * presentationEditorialEase(progress, a.motion);
    }
    break;
  }
  return travelDeg;
}

function spatialDominantAxis(axis) {
  const components = [Math.abs(axis.x), Math.abs(axis.y), Math.abs(axis.z)];
  return AXES[components.indexOf(Math.max(...components))];
}

function presentationMetricsAt(timeMs) {
  const segment = presentationSegmentAt(timeMs);
  const geometry = presentationSegmentGeometry(segment.a, segment.b);
  const durationSec = segment.durationMs / 1000;
  const derivative = presentationEditorialEaseDerivative(segment.progress, segment.a.motion);
  const speedDegPerSec = (geometry.angleDeg / Math.max(0.001, durationSec)) * derivative;
  return {
    segmentIndex: segment.index,
    phase: segment.a.motion,
    poseLabel: segment.a.label,
    axis: geometry.axis.clone(),
    dominantAxis: spatialDominantAxis(geometry.axis),
    speedDegPerSec,
    segmentArcDeg: geometry.angleDeg,
  };
}

function getReviewPresentationSample(timeSec = 0) {
  const timeMs = Math.max(0, timeSec) * 1000;
  const target = presentationQuaternionAt(timeMs, presentationTargetQuaternion);
  const euler = new THREE.Euler().setFromQuaternion(target, 'YXZ');
  const metrics = presentationMetricsAt(timeMs);
  return {
    timeSec,
    signedYawDeg: THREE.MathUtils.radToDeg(euler.y),
    cumulativeYawDeg: presentationTravelAt(timeMs),
    velocityDegPerSec: metrics.speedDegPerSec,
    pitchDeg: THREE.MathUtils.radToDeg(euler.x),
    rollDeg: THREE.MathUtils.radToDeg(euler.z),
    angularTravelDeg: presentationTravelAt(timeMs),
    dominantAxis: metrics.dominantAxis,
    rotationAxis: metrics.axis.toArray(),
    phase: metrics.phase,
    poseLabel: metrics.poseLabel,
    engine: PRESENTATION_SPATIAL_R1_2.motionAuthority,
  };
}

function updatePresentationMotion(now) {
  if (!api.ready || captureMode || prefersReducedMotion) return;
  if (!presentationLastNow) {
    presentationLastNow = now;
    lastPresentationQuaternion.copy(presentationRig.quaternion);
    return;
  }
  const deltaMs = Math.min(80, Math.max(0, now - presentationLastNow));
  presentationLastNow = now;
  presentationSimTimeMs += deltaMs;
  presentationQuaternionAt(presentationSimTimeMs, presentationTargetQuaternion);
  const metrics = presentationMetricsAt(presentationSimTimeMs);
  presentationAngularVelocityDegPerSec = metrics.speedDegPerSec;
  presentationAngularTravelDeg += metrics.speedDegPerSec * (deltaMs / 1000);
  presentationPhase = metrics.phase;
  presentationPoseLabel = metrics.poseLabel;
  const before = presentationRig.quaternion.clone();

  presentationRig.quaternion.copy(presentationTargetQuaternion);
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
  return {
    interactionActive,
    autonomyBlocked: false,
    sliceAutonomyBlocked: false,
    resumeDelayRemainingMs: 0,
    sliceResumeDelayRemainingMs: 0,
    presentationResumeActive: false,
    presentationSimTimeMs,
    sliceEventSerial,
    activeTurnCount: activeTurns.size,
    activeTurnProgress: activeTurnList().map((turn) => ({ id: turn.id, linear: turn.linear, eased: turn.eased })),
    cameraPosition: camera.position.toArray(),
    presentationQuaternion: presentationRig.quaternion.toArray(),
  };
}

controls.addEventListener('start', () => {
  interactionActive = true;
  frozenPresentationQuaternion.copy(presentationRig.quaternion);
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
  const target = presentationQuaternionAt(sample.timeSec * 1000, presentationTargetQuaternion);
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
  const now = performance.now();
  updateOwnershipSignatureReveal(now);
  updateMicroEtchGlint(now);
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

function getDiagnostics() {
  const presentationSample = getReviewPresentationSample(presentationSimTimeMs / 1000);
  return {
    ownership: {
      ...getOwnershipFingerprint(),
      integrity: { ...assetIntegrity },
      identity: {
        ...runtimeIdentity,
        expected: {
          schema: PROAI_CUBE_IDENTITY.schema,
          assetId: PROAI_CUBE_IDENTITY.assetId,
          forensicId: PROAI_CUBE_IDENTITY.forensicId,
          hiddenWitness: PROAI_CUBE_IDENTITY.forensicNodeId,
        },
      },
      signature: {
        nodeId: PROAI_CUBE_IDENTITY.signatureNodeId,
        revealProgress: ownershipSignatureReveal,
        visible: Boolean(ownershipSignatureRoot?.visible),
        material: 'physical-metallic-recess',
        bounds: ownershipNodeBounds(ownershipSignatureRoot),
      },
      forensicWitness: {
        nodeId: PROAI_CUBE_IDENTITY.forensicNodeId,
        visible: Boolean(forensicWitnessRoot?.visible),
        visibility: 'internal-inspection-only',
      },
      microEtch: {
        nodeId: MICRO_ETCH_ID,
        attached: Boolean(microEtchRoot && microEtchHost),
        targetCubie: { ...MICRO_ETCH_TARGET },
        targetFace: microEtchFace?.target?.face || MICRO_ETCH_TARGET.face,
        face: microEtchFace,
        bounds: ownershipNodeBounds(microEtchRoot),
        hostName: microEtchHost?.name || null,
        material: microEtchMaterial ? {
          type: microEtchMaterial.type,
          color: microEtchMaterial.color.getHexString(),
          metalness: microEtchMaterial.metalness,
          roughness: microEtchMaterial.roughness,
          depthTest: microEtchMaterial.depthTest,
          transparent: microEtchMaterial.transparent,
          emissive: microEtchMaterial.emissive.getHexString(),
        } : null,
        glintEnabled: !prefersReducedMotion,
        glintActive: microEtchGlintActive,
        glintCount: microEtchGlintCount,
        reducedMotion: prefersReducedMotion,
      },
    },
    ready: api.ready,
    motionState,
    hierarchy: api.hierarchy,
    mechanics: api.mechanics,
    motionConfig: MOTION,
    presentationConfig: PRESENTATION_SPATIAL_R1_2,
    sliceConfig: SLICE_R1_2,
    presentation: {
    simTimeMs: presentationSimTimeMs,
    angularTravelDeg: presentationAngularTravelDeg,
    angularVelocityDegPerSec: presentationAngularVelocityDegPerSec,
    rotationAxis: presentationSample.rotationAxis,
    dominantAxis: presentationSample.dominantAxis,
    pitchDeg: presentationSample.pitchDeg,
    yawDeg: presentationSample.signedYawDeg,
    rollDeg: presentationSample.rollDeg,
    phase: presentationPhase,
    poseLabel: presentationPoseLabel,
    frameAngularDeltaRad: presentationFrameDeltaRad,
    quaternion: presentationRig.quaternion.toArray(),
    engine: PRESENTATION_SPATIAL_R1_2.motionAuthority,
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
  updatePresentationMotion(now);
  updateOwnershipSignatureReveal(now);
  updateMicroEtchGlint(now);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
if (!captureMode) requestAnimationFrame(render);

const loader = new GLTFLoader();

function sha256Hex(buffer) {
  return crypto.subtle.digest('SHA-256', buffer).then((digest) => [...new Uint8Array(digest)]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase());
}

function validateRuntimeIdentity(gltf) {
  const metadata = gltf?.parser?.json?.asset?.extras?.proai || null;
  const witnessPresent = Boolean(gltf?.scene?.getObjectByName(PROAI_CUBE_IDENTITY.forensicNodeId));
  const checks = {
    schema: metadata?.schema === PROAI_CUBE_IDENTITY.schema,
    assetId: metadata?.asset_id === PROAI_CUBE_IDENTITY.assetId,
    revision: metadata?.revision === PROAI_CUBE_IDENTITY.revision,
    forensicId: metadata?.forensic_id === PROAI_CUBE_IDENTITY.forensicId,
    hiddenWitness: witnessPresent,
  };
  const pass = Object.values(checks).every(Boolean);
  runtimeIdentity = { status: pass ? 'pass' : 'fail', metadata, witnessPresent, checks };
  if (!pass) throw new Error(`ProAI Cube identity validation failed: ${JSON.stringify(checks)}`);
  return true;
}

async function loadVerifiedCube() {
  const response = await fetch(GLB_URL, { cache: 'no-store' });
  assetIntegrity = { ...assetIntegrity, requestCount: assetIntegrity.requestCount + 1 };
  if (!response.ok) {
    assetIntegrity = { ...assetIntegrity, status: 'fail' };
    throw new Error(`GLB request failed with HTTP ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const actualSha256 = await sha256Hex(arrayBuffer);
  const pass = actualSha256 === EXPECTED_GLB_SHA256;
  assetIntegrity = { ...assetIntegrity, actualSha256, status: pass ? 'pass' : 'fail' };
  if (!pass) throw new Error(`ProAI Cube GLB integrity mismatch: expected ${EXPECTED_GLB_SHA256}, got ${actualSha256}`);
  let basePath = document.baseURI;
  try {
    basePath = new URL('./', GLB_URL).href;
  } catch {
    // Dynamic Blob module URLs are valid fetch targets but not valid URL bases.
  }
  const gltf = await loader.parseAsync(arrayBuffer, basePath);
  validateRuntimeIdentity(gltf);
  return gltf;
}

void loadVerifiedCube().then((gltf) => {
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
      if (object.isMesh && object.name !== 'Plane' && !isOwnershipNode(object)) {
        object.material = classifyReviewMaterial(object);
        object.castShadow = false;
        object.receiveShadow = false;
      }
    });
    setupOwnershipNodes();
    setupMicroEtch();
    frameCamera();
    resize();
    if (captureMode) renderReviewFrame();

    api.ready = true;
    setMotionState('rest');
    status.textContent = 'Three.js GLB loaded. Geometry R1 + Motion R1.2 frozen. Materials + Lighting R1 ready.';
    if (sliceSchedulerEnabled) void sliceSchedulerLoop();
  }).catch((error) => {
    if (cubeRoot) {
      cubeRoot.visible = false;
      presentationRig.remove(cubeRoot);
    }
    console.error('[ProAI Cube] Verified initialization failed.', error);
    setMotionState('error');
    status.textContent = 'Verified Cube initialization failed';
  });
