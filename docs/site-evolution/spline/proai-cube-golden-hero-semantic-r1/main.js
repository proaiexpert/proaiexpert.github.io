import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

/*
 * ProAI Cube — Golden Hero + Local Semantic Envelope R1
 * One authoritative runtime. No generated patch stack.
 *
 * Golden source lineage:
 *   accepted product 735982473854c29a6f1eeeb4d87773abbc573b4d
 *   frozen runtime    d17806da42275db617d8a46b231a2d877706a179
 *   source blob       bab6b00e73b20fc2a51aeb00cb7fc08f16129e72
 *   bootstrap blob    b46b26164efc000daef8ecb3416039008db7cd79
 *   canonical GLB     dbb7fc4156f8c9ed2481dd76443dffb9a45ecb5493463f99bffb34dd3b59c79b
 */

const GOLDEN = Object.freeze({
  acceptedProductSha: '735982473854c29a6f1eeeb4d87773abbc573b4d',
  sourceLineageSha: 'd17806da42275db617d8a46b231a2d877706a179',
  sourceBlob: 'bab6b00e73b20fc2a51aeb00cb7fc08f16129e72',
  bootstrapBlob: 'b46b26164efc000daef8ecb3416039008db7cd79',
  glbSha256: 'dbb7fc4156f8c9ed2481dd76443dffb9a45ecb5493463f99bffb34dd3b59c79b',
  glbBytes: 279412,
});

const GLB_URL = `https://raw.githubusercontent.com/proaiexpert/proaiexpert.github.io/${GOLDEN.acceptedProductSha}/assets/models/proai-cube/rubik_39_s_cube_animation.glb`;
const canvas = document.getElementById('cube-canvas');
const status = document.getElementById('runtime-status');
const params = new URLSearchParams(location.search);
const semanticEnabled = params.get('semantic') !== '0';
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = matchMedia('(hover: none), (pointer: coarse)').matches;

const AXES = Object.freeze(['X', 'Y', 'Z']);
const LAYERS = Object.freeze([-1, 0, 1]);
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
  seed: 0x51a7c0de,
});

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

const LOOKDEV_R1 = Object.freeze({
  materialGroups: Object.freeze({
    graphiteFace: Object.freeze({ color: '#242a31', metalness: 0.84, roughness: 0.295, clearcoat: 0.16, clearcoatRoughness: 0.20, envMapIntensity: 1.18 }),
    gunmetalFace: Object.freeze({ color: '#2b323a', metalness: 0.86, roughness: 0.265, clearcoat: 0.20, clearcoatRoughness: 0.18, envMapIntensity: 1.22 }),
    blackChromeFace: Object.freeze({ color: '#181d23', metalness: 0.92, roughness: 0.225, clearcoat: 0.16, clearcoatRoughness: 0.16, envMapIntensity: 1.26 }),
    smokedCore: Object.freeze({ color: '#0c0f13', metalness: 0.48, roughness: 0.44, clearcoat: 0.06, clearcoatRoughness: 0.28, envMapIntensity: 0.66 }),
  }),
  lighting: Object.freeze({ hemisphereIntensity: 0.52, keyIntensity: 5.2, fillIntensity: 4.0, rimIntensity: 4.6 }),
});

const SEMANTIC = Object.freeze({
  faces: Object.freeze(['+Z', '+X', '-X']),
  messages: Object.freeze(['ProAI Expert', 'TRUST', 'INQUIRY', 'RESPONSE', 'RESULT']),
  typography: Object.freeze({ family: 'Instrument Sans', weight: 620, scaleX: 0.875, scaleY: 0.900, targetWidthRatio: 0.722 }),
  material: Object.freeze({ bumpScale: -0.130, roughnessMapInk: 0.550, tonalInk: 0.820, pearlEdgeRoughnessInk: 0.095, innerEdgePx: 3 }),
  observer: Object.freeze({
    stageScoreMin: 0.12,
    stageScoreMax: 0.72,
    stageViewMin: 0.36,
    stageAreaMin: 0.20,
    stageBrdfMin: 0.00,
    candidateApproachScore: 0.54,
    candidateApproachView: 0.44,
    candidateDwellMs: 80,
    enterScore: 0.60,
    enterView: 0.48,
    enterArea: 0.24,
    enterBrdf: 0.10,
    exitScore: 0.50,
    exitView: 0.46,
    releaseDebounceMs: 90,
    minReadableMs: 900,
    maxReadableHoldMs: 1600,
    releaseMs: 520,
    cooldownRangeMs: [5000, 8000],
  }),
});

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.5 : 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
scene.background = null;
RectAreaLightUniformsLib.init();

function createStudioCard(environmentScene, { position, width, height, color, intensity }) {
  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide, toneMapped: false });
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
  for (const card of cards) { card.geometry.dispose(); card.material.dispose(); }
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
if (coarsePointer) {
  controls.enabled = false;
  canvas.style.pointerEvents = 'none';
}

function physicalMaterial(spec) {
  return new THREE.MeshPhysicalMaterial({ color: spec.color, metalness: spec.metalness, roughness: spec.roughness, clearcoat: spec.clearcoat, clearcoatRoughness: spec.clearcoatRoughness, envMapIntensity: spec.envMapIntensity });
}
const faceGraphiteMaterial = physicalMaterial(LOOKDEV_R1.materialGroups.graphiteFace);
const faceGunmetalMaterial = physicalMaterial(LOOKDEV_R1.materialGroups.gunmetalFace);
const faceBlackChromeMaterial = physicalMaterial(LOOKDEV_R1.materialGroups.blackChromeFace);
const coreMaterial = physicalMaterial(LOOKDEV_R1.materialGroups.smokedCore);

const hemisphereFill = new THREE.HemisphereLight(0x8a949f, 0x0b0e12, LOOKDEV_R1.lighting.hemisphereIntensity);
scene.add(hemisphereFill);
const key = new THREE.RectAreaLight(0xe2e6eb, LOOKDEV_R1.lighting.keyIntensity, 1, 1);
const fill = new THREE.RectAreaLight(0xb7c0ca, LOOKDEV_R1.lighting.fillIntensity, 1, 1);
const rim = new THREE.RectAreaLight(0xe8ecf1, LOOKDEV_R1.lighting.rimIntensity, 1, 1);
scene.add(key, fill, rim);

let cubeRoot = null;
let sceneOne = null;
let cubieParents = [];
let physicalCubies = [];
let latticeCenters = null;
const cubeCenterLocal = new THREE.Vector3();
let activeTurns = new Map();
let motionState = 'loading';
let sliceSchedulerEnabled = !prefersReducedMotion;
let sliceSchedulerRunning = false;
let turnSerial = 0;
let lastTurnResult = null;
let lastTurnResults = [];
let sliceSeed = SLICE_R1_2.seed >>> 0;
let sliceEventSerial = 0;
let eventsUntilBreath = 4;
let presentationSimTimeMs = 0;
let presentationYawRad = 0;
let presentationSignedYawDeg = 0;
let presentationCumulativeYawDeg = 0;
let presentationYawVelocityDegPerSec = 0;
let presentationLastNow = 0;
let presentationPitchDeg = 0;
let presentationRollDeg = 0;

const counters = {
  single: 0, pair: 0, phrase: 0, concurrentPairs: 0,
  axes: { X: 0, Y: 0, Z: 0 }, layers: { '-1': 0, '0': 0, '1': 0 },
  maxSimultaneousTurns: 0, pairOverlapEvents: 0,
};

const semanticState = {
  state: 'DORMANT', face: null, messageIndex: 0, message: null,
  stageMs: null, candidateMs: null, readableMs: null, releaseMs: null,
  readableDurationMs: null, belowExitSinceMs: null, candidatePeak: 0,
  envelope: 0, releaseStartEnvelope: 0, releaseSuccess: false,
  nextEligibleMs: 0, stageCancellations: 0, protectedSubstitutions: 0,
  safePairsDuringProtection: 0, tearingViolations: 0, wholeFaceDeferrals: 0,
  wholeFaceReadableRotationsExecuted: 0, firstEligibilityMs: null,
  firstStageMs: null, firstCandidateMs: null, firstReadableMs: null, firstReleaseMs: null,
  firstFace: null, firstMessage: null, lastUpdateMs: 0, snapshot: null,
};
let semanticSeed = 0x5e4a71c3 >>> 0;
let readyAtMs = 0;

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
function smoothstep(value) { const x = THREE.MathUtils.clamp(value, 0, 1); return x * x * (3 - 2 * x); }

function cubicBezierEase(x) {
  const [x1, y1, x2, y2] = MOTION.easing;
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t) => ((ay * t + by) * t + cy) * t;
  const sampleDX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  let t = x;
  for (let i = 0; i < 7; i += 1) {
    const error = sampleX(t) - x, slope = sampleDX(t);
    if (Math.abs(error) < 1e-7 || Math.abs(slope) < 1e-7) break;
    t = THREE.MathUtils.clamp(t - error / slope, 0, 1);
  }
  let low = 0, high = 1;
  for (let i = 0; i < 10 && Math.abs(sampleX(t) - x) > 1e-6; i += 1) {
    if (sampleX(t) < x) low = t; else high = t;
    t = (low + high) * 0.5;
  }
  return sampleY(t);
}

function identityOrientation() { return [1, 0, 0, 0, 1, 0, 0, 0, 1]; }
function multiplyOrientation(a, b) {
  const out = new Array(9).fill(0);
  for (let row = 0; row < 3; row += 1) for (let col = 0; col < 3; col += 1) {
    let value = 0;
    for (let k = 0; k < 3; k += 1) value += a[row * 3 + k] * b[k * 3 + col];
    out[row * 3 + col] = Math.round(value);
  }
  return out;
}
function quarterTurnMatrix(axis, direction) {
  const d = direction >= 0 ? 1 : -1;
  if (axis === 'X') return d > 0 ? [1,0,0,0,0,-1,0,1,0] : [1,0,0,0,0,1,0,-1,0];
  if (axis === 'Y') return d > 0 ? [0,0,1,0,1,0,-1,0,0] : [0,0,-1,0,1,0,1,0,0];
  if (axis === 'Z') return d > 0 ? [0,-1,0,1,0,0,0,0,1] : [0,1,0,-1,0,0,0,0,1];
  throw new Error(`Unsupported axis ${axis}`);
}
function orientationQuaternion(matrix) {
  const m = new THREE.Matrix4().set(matrix[0],matrix[1],matrix[2],0,matrix[3],matrix[4],matrix[5],0,matrix[6],matrix[7],matrix[8],0,0,0,0,1);
  return new THREE.Quaternion().setFromRotationMatrix(m).normalize();
}
function rotateLogical(logical, axis, direction) {
  const { x, y, z } = logical, d = direction >= 0 ? 1 : -1;
  if (axis === 'X') return d > 0 ? { x, y: -z, z: y } : { x, y: z, z: -y };
  if (axis === 'Y') return d > 0 ? { x: z, y, z: -x } : { x: -z, y, z: x };
  if (axis === 'Z') return d > 0 ? { x: -y, y: x, z } : { x: y, y: -x, z };
  throw new Error(`Unsupported axis ${axis}`);
}
function axisComponent(logical, axis) { return logical[axis.toLowerCase()]; }

function roundedRectShape(width, height, radius) {
  const w = width * 0.5, h = height * 0.5, r = Math.min(radius, w - 0.001, h - 0.001);
  const shape = new THREE.Shape();
  shape.moveTo(-w+r,-h); shape.lineTo(w-r,-h); shape.quadraticCurveTo(w,-h,w,-h+r);
  shape.lineTo(w,h-r); shape.quadraticCurveTo(w,h,w-r,h); shape.lineTo(-w+r,h);
  shape.quadraticCurveTo(-w,h,-w,h-r); shape.lineTo(-w,-h+r); shape.quadraticCurveTo(-w,-h,-w+r,-h);
  return shape;
}
function sourceGeometryMetrics(geometry) {
  geometry.computeBoundingBox(); const box = geometry.boundingBox.clone();
  const size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
  const abs = [Math.abs(size.x),Math.abs(size.y),Math.abs(size.z)];
  return { box, size, center, thinAxis: abs.indexOf(Math.min(...abs)) };
}
function buildPrecisionFaceGeometry(sourceGeometry) {
  const source = sourceGeometryMetrics(sourceGeometry);
  if (source.thinAxis !== 2) throw new Error(`Geometry R1 expected face source thin axis Z; got ${source.thinAxis}`);
  const geometry = new THREE.ExtrudeGeometry(roundedRectShape(180,180,GEOMETRY_R1.faceCornerRadius), {
    depth:0.9,steps:1,curveSegments:GEOMETRY_R1.faceCurveSegments,bevelEnabled:true,
    bevelThickness:GEOMETRY_R1.faceBevelThickness,bevelSize:GEOMETRY_R1.faceBevelSize,bevelSegments:GEOMETRY_R1.faceBevelSegments,
  });
  geometry.computeBoundingBox(); let box=geometry.boundingBox.clone(), center=box.getCenter(new THREE.Vector3());
  geometry.translate(-center.x,-center.y,-box.max.z); geometry.computeBoundingBox(); box=geometry.boundingBox.clone();
  const size=box.getSize(new THREE.Vector3());
  geometry.scale(GEOMETRY_R1.faceOuterSize/size.x,GEOMETRY_R1.faceOuterSize/size.y,GEOMETRY_R1.faceThickness/size.z);
  geometry.translate(source.center.x,source.center.y,source.center.z);
  geometry.computeVertexNormals(); geometry.computeBoundingBox(); geometry.computeBoundingSphere();
  geometry.userData.proaiGoldenFace=true;
  return geometry;
}
function buildPrecisionCoreGeometry(sourceGeometry) {
  const source=sourceGeometryMetrics(sourceGeometry);
  const geometry=new RoundedBoxGeometry(GEOMETRY_R1.coreSize,GEOMETRY_R1.coreSize,GEOMETRY_R1.coreSize,GEOMETRY_R1.coreSegments,GEOMETRY_R1.coreRadius);
  geometry.translate(source.center.x,source.center.y,source.center.z); geometry.computeVertexNormals(); geometry.computeBoundingBox(); geometry.computeBoundingSphere();
  geometry.userData.proaiGoldenCore=true; return geometry;
}
function enhanceRenderGeometry() {
  const cache=new Map(); const stats={faceMeshes:0,coreMeshes:0,nonPlaneMeshes:0};
  cubeRoot.traverse((object)=>{
    if(!object.isMesh||object.name==='Plane'||!object.geometry)return;
    stats.nonPlaneMeshes++; const source=sourceGeometryMetrics(object.geometry);
    const dims=[Math.abs(source.size.x),Math.abs(source.size.y),Math.abs(source.size.z)].sort((a,b)=>a-b);
    const isFace=dims[0]<dims[2]*0.12, key=`${isFace?'face':'core'}:${object.geometry.uuid}`;
    if(!cache.has(key))cache.set(key,isFace?buildPrecisionFaceGeometry(object.geometry):buildPrecisionCoreGeometry(object.geometry));
    object.geometry=cache.get(key); if(isFace)stats.faceMeshes++;else stats.coreMeshes++;
  });
  const pitches={}; for(const axis of AXES){const c=latticeCenters[axis];pitches[axis]=((c[1]-c[0])+(c[2]-c[1]))*.5;}
  const minPitch=Math.min(...Object.values(pitches));
  stats.latticePitches=pitches; stats.faceGapMin=minPitch-GEOMETRY_R1.faceOuterSize; stats.coreGapMin=minPitch-GEOMETRY_R1.coreSize;
  stats.pass=stats.faceMeshes===180&&stats.coreMeshes===30&&stats.nonPlaneMeshes===210&&stats.faceGapMin>3&&stats.coreGapMin>2;
  return stats;
}

function findCubieParents(){const found=[];cubeRoot.traverse((o)=>{if(o.children.length===7&&o.children.every((c)=>c.isMesh))found.push(o);});return found;}
function sceneTransformOf(object){sceneOne.updateMatrixWorld(true);object.updateMatrixWorld(true);const matrix=sceneOne.matrixWorld.clone().invert().multiply(object.matrixWorld.clone());const position=new THREE.Vector3(),quaternion=new THREE.Quaternion(),scale=new THREE.Vector3();matrix.decompose(position,quaternion,scale);return{matrix,position,quaternion,scale};}
function clusterValues(values,maxGap=32){const sorted=[...values].sort((a,b)=>a-b),clusters=[];for(const value of sorted){const c=clusters.at(-1);if(!c||value-c.max>maxGap){clusters.push({values:[value],max:value,mean:value});continue;}c.values.push(value);c.max=Math.max(c.max,value);c.mean=c.values.reduce((s,n)=>s+n,0)/c.values.length;}return clusters.map((c)=>c.mean);}
function nearestLayer(value,centers){let bi=0,bd=Infinity;centers.forEach((c,i)=>{const d=Math.abs(value-c);if(d<bd){bd=d;bi=i;}});return bi-1;}
function logicalPosition(logical){return new THREE.Vector3(latticeCenters.X[logical.x+1],latticeCenters.Y[logical.y+1],latticeCenters.Z[logical.z+1]);}

function prepareMechanicalModel(){
  cubieParents=findCubieParents(); const transforms=cubieParents.map((object)=>({object,...sceneTransformOf(object)}));
  const x=clusterValues(transforms.map((e)=>e.position.x)),y=clusterValues(transforms.map((e)=>e.position.y)),z=clusterValues(transforms.map((e)=>e.position.z));
  if(x.length!==3||y.length!==3||z.length!==3)throw new Error(`Expected 3 lattice centers per axis; got X=${x.length} Y=${y.length} Z=${z.length}`);
  latticeCenters={X:x,Y:y,Z:z};cubeCenterLocal.set(x[1],y[1],z[1]); const grouped=new Map();
  for(const entry of transforms){const logical={x:nearestLayer(entry.position.x,x),y:nearestLayer(entry.position.y,y),z:nearestLayer(entry.position.z,z)},id=`${logical.x}|${logical.y}|${logical.z}`;
    if(!grouped.has(id))grouped.set(id,{id,logical:{...logical},orientation:identityOrientation(),members:[]});
    grouped.get(id).members.push({object:entry.object,originalParent:entry.object.parent,baseSceneQuaternion:entry.quaternion.clone(),baseSceneScale:entry.scale.clone()});}
  physicalCubies=[...grouped.values()].sort((a,b)=>a.id.localeCompare(b.id));
  if(physicalCubies.length!==27)throw new Error(`Expected 27 physical cubies; got ${physicalCubies.length}`);
  for(const axis of AXES)for(const layer of LAYERS)if(selectLayer(axis,layer).length!==9)throw new Error(`Invalid layer ${axis}${layer}`);
}

function desiredScenePose(cubie,member,logical=cubie.logical,orientation=cubie.orientation){const position=logicalPosition(logical),q=orientationQuaternion(orientation).multiply(member.baseSceneQuaternion.clone()).normalize();return{position,quaternion:q,scale:member.baseSceneScale.clone()};}
function applyExactScenePose(cubie,member){sceneOne.updateMatrixWorld(true);member.originalParent.updateMatrixWorld(true);const p=desiredScenePose(cubie,member),sceneMatrix=new THREE.Matrix4().compose(p.position,p.quaternion,p.scale),desiredWorld=sceneOne.matrixWorld.clone().multiply(sceneMatrix),local=member.originalParent.matrixWorld.clone().invert().multiply(desiredWorld);local.decompose(member.object.position,member.object.quaternion,member.object.scale);member.object.quaternion.normalize();member.object.updateMatrix();member.object.updateMatrixWorld(true);}
function selectLayer(axis,layer){if(!AXES.includes(axis)||!LAYERS.includes(layer))throw new Error(`Unsupported layer ${axis}${layer}`);const selected=physicalCubies.filter((c)=>axisComponent(c.logical,axis)===layer);if(selected.length!==9)throw new Error(`${axis}${layer} selection must contain 9 cubies; got ${selected.length}`);return selected;}
function activeTurnList(){return[...activeTurns.values()];}
function activeTurnById(x){if(!x)return null;if(typeof x==='string')return activeTurns.get(x)||null;return x.id?activeTurns.get(x.id)||x:x;}
function turnSafety(axis,layer){const normalizedAxis=String(axis).toUpperCase(),selected=selectLayer(normalizedAxis,layer),ids=new Set(selected.map((c)=>c.id)),conflicts=[];for(const existing of activeTurns.values()){const eids=new Set(existing.cubiePlans.map((p)=>p.cubie.id)),intersection=[...ids].filter((id)=>eids.has(id));if(existing.axis!==normalizedAxis||existing.layer===layer||intersection.length)conflicts.push({turnId:existing.id,intersection});}return{pass:conflicts.length===0,normalizedAxis,selected,conflicts};}

function beginTurn(axis='X',layer=1,direction=1){
  if(activeTurns.size>=2)throw new Error('At most two concurrent disjoint slice turns are supported');
  const safety=turnSafety(axis,layer);if(!safety.pass)throw new Error(`Unsafe concurrent slice request: ${JSON.stringify(safety.conflicts)}`);
  const normalizedDirection=direction>=0?1:-1,normalizedAxis=safety.normalizedAxis,selected=safety.selected,axisIndex=AXIS_INDEX[normalizedAxis];
  const pivot=new THREE.Group(),serial=++turnSerial,id=`turn-${serial}`;pivot.position.copy(cubeCenterLocal);pivot.position.setComponent(axisIndex,latticeCenters[normalizedAxis][layer+1]);sceneOne.add(pivot);sceneOne.updateMatrixWorld(true);
  const targetQuaternion=new THREE.Quaternion().setFromAxisAngle(AXIS_VECTOR[normalizedAxis],normalizedDirection*Math.PI/2).normalize(),inverseTarget=targetQuaternion.clone().invert(),rotationMatrix=quarterTurnMatrix(normalizedAxis,normalizedDirection);
  const cubiePlans=selected.map((cubie)=>({cubie,nextLogical:rotateLogical(cubie.logical,normalizedAxis,normalizedDirection),nextOrientation:multiplyOrientation(rotationMatrix,cubie.orientation)})),memberStates=[];
  for(const plan of cubiePlans)for(const member of plan.cubie.members){pivot.attach(member.object);const target=desiredScenePose(plan.cubie,member,plan.nextLogical,plan.nextOrientation);memberStates.push({plan,member,startLocalPosition:member.object.position.clone(),startLocalQuaternion:member.object.quaternion.clone(),startLocalScale:member.object.scale.clone(),targetLocalPosition:target.position.clone().sub(pivot.position).applyQuaternion(inverseTarget),targetLocalQuaternion:inverseTarget.clone().multiply(target.quaternion).normalize(),targetLocalScale:target.scale.clone()});}
  const turn={id,serial,axis:normalizedAxis,layer,direction:normalizedDirection,pivot,targetQuaternion,cubiePlans,memberStates,linear:0,eased:0};activeTurns.set(id,turn);motionState='turning';counters.maxSimultaneousTurns=Math.max(counters.maxSimultaneousTurns,activeTurns.size);return turn;
}
function setTurnProgress(turnOrId,linear,{finalize=false}={}){const turn=activeTurnById(turnOrId);if(!turn)throw new Error('No active turn');const progress=THREE.MathUtils.clamp(linear,0,1),eased=cubicBezierEase(progress);turn.linear=progress;turn.eased=eased;turn.pivot.quaternion.slerpQuaternions(new THREE.Quaternion(),turn.targetQuaternion,eased).normalize();for(const s of turn.memberStates){s.member.object.position.lerpVectors(s.startLocalPosition,s.targetLocalPosition,eased);s.member.object.quaternion.slerpQuaternions(s.startLocalQuaternion,s.targetLocalQuaternion,eased).normalize();s.member.object.scale.lerpVectors(s.startLocalScale,s.targetLocalScale,eased);s.member.object.updateMatrix();}turn.pivot.updateMatrixWorld(true);return(finalize||progress>=1)?finalizeTurn(turn):turn;}
function finalizeTurn(turnOrId){const turn=activeTurnById(turnOrId);if(!turn)throw new Error('No active turn');turn.pivot.quaternion.copy(turn.targetQuaternion);for(const s of turn.memberStates){s.member.object.position.copy(s.targetLocalPosition);s.member.object.quaternion.copy(s.targetLocalQuaternion);s.member.object.scale.copy(s.targetLocalScale);s.member.object.updateMatrix();}turn.pivot.updateMatrixWorld(true);for(const p of turn.cubiePlans){p.cubie.logical={...p.nextLogical};p.cubie.orientation=[...p.nextOrientation];}for(const s of turn.memberStates)s.member.originalParent.attach(s.member.object);for(const p of turn.cubiePlans)for(const m of p.cubie.members)applyExactScenePose(p.cubie,m);sceneOne.remove(turn.pivot);activeTurns.delete(turn.id);sceneOne.updateMatrixWorld(true);motionState=activeTurns.size?'turning':'rest';const canonical=activeTurns.size===0?canonicalTransformError():null,result={id:turn.id,serial:turn.serial,axis:turn.axis,layer:turn.layer,direction:turn.direction,endpointErrorRad:0,canonical};lastTurnResult=result;lastTurnResults.push(result);if(lastTurnResults.length>24)lastTurnResults=lastTurnResults.slice(-24);return result;}
function animateTurn(turnOrId,durationMs){const turn=activeTurnById(turnOrId);if(!turn)return Promise.resolve(false);return new Promise((resolve)=>{let elapsed=0,previous=performance.now();function tick(now){const delta=Math.max(0,now-previous);previous=now;elapsed+=delta;const linear=THREE.MathUtils.clamp(elapsed/Math.max(1,durationMs),0,1);if(linear>=1){resolve(setTurnProgress(turn.id,1,{finalize:true}));return;}setTurnProgress(turn.id,linear);requestAnimationFrame(tick);}requestAnimationFrame(tick);});}
async function turnSlice(move){let turn;try{turn=beginTurn(move.axis,move.layer,move.direction);}catch(error){if(String(error).includes('Unsafe concurrent')||String(error).includes('At most two'))return false;throw error;}return animateTurn(turn.id,move.durationMs??1250);}
function canonicalTransformError(){let maxPosition=0,maxQuaternionRad=0,maxScale=0;for(const cubie of physicalCubies)for(const member of cubie.members){const actual=sceneTransformOf(member.object),expected=desiredScenePose(cubie,member);maxPosition=Math.max(maxPosition,actual.position.distanceTo(expected.position));maxQuaternionRad=Math.max(maxQuaternionRad,actual.quaternion.angleTo(expected.quaternion));maxScale=Math.max(maxScale,actual.scale.distanceTo(expected.scale));}return{maxPosition,maxQuaternionRad,maxScale};}

function presentationVelocityAt(timeMs){const cycle=PRESENTATION_R1_2.velocityCycleMs;let local=timeMs%cycle;if(local<0)local+=cycle;const keys=PRESENTATION_R1_2.velocityKeyframes;for(let i=0;i<keys.length-1;i++){const a=keys[i],b=keys[i+1];if(local<=b.timeMs){const p=smoothstep((local-a.timeMs)/Math.max(1,b.timeMs-a.timeMs));return THREE.MathUtils.lerp(a.velocityDegPerSec,b.velocityDegPerSec,p);}}return keys[0].velocityDegPerSec;}
function presentationPitchRollAt(timeMs){const pitch=THREE.MathUtils.degToRad(8.65*Math.sin((timeMs/PRESENTATION_R1_2.pitchPrimaryPeriodMs)*Math.PI*2+.42)+1.55*Math.sin((timeMs/PRESENTATION_R1_2.pitchSecondaryPeriodMs)*Math.PI*2+1.18));const roll=THREE.MathUtils.degToRad(1.92*Math.sin((timeMs/PRESENTATION_R1_2.rollPrimaryPeriodMs)*Math.PI*2+1.35)+.48*Math.sin((timeMs/PRESENTATION_R1_2.rollSecondaryPeriodMs)*Math.PI*2+2.20));return{pitch,roll};}
function presentationQuaternionAt(timeMs,yawRad){const{pitch,roll}=presentationPitchRollAt(timeMs);return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch,yawRad,roll,'YXZ')).normalize();}
function updatePresentationMotion(now){if(!runtimeState.ready||prefersReducedMotion)return;if(!presentationLastNow){presentationLastNow=now;return;}const deltaMs=Math.min(80,Math.max(0,now-presentationLastNow));presentationLastNow=now;presentationSimTimeMs+=deltaMs;presentationYawVelocityDegPerSec=presentationVelocityAt(presentationSimTimeMs);const yawStepDeg=presentationYawVelocityDegPerSec*(deltaMs/1000);presentationYawRad+=THREE.MathUtils.degToRad(yawStepDeg);presentationSignedYawDeg+=yawStepDeg;presentationCumulativeYawDeg+=Math.abs(yawStepDeg);const pr=presentationPitchRollAt(presentationSimTimeMs);presentationPitchDeg=THREE.MathUtils.radToDeg(pr.pitch);presentationRollDeg=THREE.MathUtils.radToDeg(pr.roll);presentationRig.quaternion.copy(presentationQuaternionAt(presentationSimTimeMs,presentationYawRad));}

function seededUnit(){let x=sliceSeed>>>0;x^=(x<<13)>>>0;x^=x>>>17;x^=(x<<5)>>>0;sliceSeed=x>>>0;return sliceSeed/4294967296;}
function seededRange(min,max){return min+(max-min)*seededUnit();}
function seededInt(min,maxInclusive){return Math.floor(seededRange(min,maxInclusive+1));}
function makeScheduledMove(axis=null,layer=null){const selectedAxis=axis||AXES[sliceEventSerial%AXES.length],selectedLayer=layer??LAYERS[seededInt(0,LAYERS.length-1)];return{axis:selectedAxis,layer:selectedLayer,direction:seededUnit()<.5?-1:1,durationMs:Math.round(seededRange(...SLICE_R1_2.turnDurationRangeMs))};}
function semanticUnit(){let x=semanticSeed>>>0;x^=(x<<13)>>>0;x^=x>>>17;x^=(x<<5)>>>0;semanticSeed=x>>>0;return semanticSeed/4294967296;}
function semanticRange(min,max){return min+(max-min)*semanticUnit();}
async function schedulerDelay(durationMs){let elapsed=0,previous=performance.now();while(elapsed<durationMs&&sliceSchedulerEnabled){await sleep(Math.min(32,Math.max(8,durationMs-elapsed)));const now=performance.now();elapsed+=now-previous;previous=now;}return sliceSchedulerEnabled;}

function eventSingleProposal(){const axis=AXES[sliceEventSerial%AXES.length];return{type:'single',moves:[makeScheduledMove(axis)]};}
function eventPairProposal(){const axis=AXES[sliceEventSerial%AXES.length],firstLayer=LAYERS[seededInt(0,2)],other=LAYERS.filter((v)=>v!==firstLayer),secondLayer=other[seededInt(0,other.length-1)],first=makeScheduledMove(axis,firstLayer),second=makeScheduledMove(axis,secondLayer),staggerMs:Math.round(seededRange(...SLICE_R1_2.pairedStaggerRangeMs));return{type:'pair',moves:[first,second],staggerMs};}
function eventPhraseProposal(){const length=seededUnit()<.72?2:3,moves=[],microGaps=[];for(let i=0;i<length;i++){const axis=AXES[(sliceEventSerial+i)%AXES.length];moves.push(makeScheduledMove(axis));if(i<length-1)microGaps.push(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)));}return{type:'phrase',moves,microGaps};}
function proposeGoldenEvent(type){if(type==='pair')return eventPairProposal();if(type==='phrase')return eventPhraseProposal();return eventSingleProposal();}

function protectedFace(){return ['CANDIDATE','READABLE'].includes(semanticState.state)&&semanticState.snapshot?semanticState.snapshot.face:null;}
function faceDefinition(face){if(face==='+Z')return{axis:'Z',layer:1,normal:new THREE.Vector3(0,0,1),u:new THREE.Vector3(1,0,0),v:new THREE.Vector3(0,1,0)};if(face==='+X')return{axis:'X',layer:1,normal:new THREE.Vector3(1,0,0),u:new THREE.Vector3(0,0,-1),v:new THREE.Vector3(0,1,0)};if(face==='-X')return{axis:'X',layer:-1,normal:new THREE.Vector3(-1,0,0),u:new THREE.Vector3(0,0,1),v:new THREE.Vector3(0,1,0)};throw new Error(`Unknown semantic face ${face}`);}
function currentFacePlane(face){const def=faceDefinition(face),cubies=selectLayer(def.axis,def.layer),ids=new Set(cubies.map((c)=>c.id));return{face,...def,cubies,ids};}
function activeFacePlane(face){const snapshot=semanticState.snapshot;return snapshot&&snapshot.face===face?snapshot:currentFacePlane(face);}
function moveIntersection(move,face){const snapshot=semanticState.snapshot;if(!snapshot||snapshot.face!==face)return{count:0,ids:[]};const ids=selectLayer(move.axis,move.layer).filter((c)=>snapshot.ids.has(c.id)).map((c)=>c.id);return{count:ids.length,ids};}
function eventIntersections(event,face){return event.moves.map((move)=>moveIntersection(move,face));}
function eventUnsafeForProtected(event,face){return eventIntersections(event,face).some((x)=>x.count>0);}
function countWholeFaceDeferrals(event,face){return eventIntersections(event,face).filter((x)=>x.count===9).length;}

function setFaceEnvelope(face,value){const e=THREE.MathUtils.clamp(value,0,1),snapshot=semanticState.snapshot,active=snapshot&&snapshot.face===face?e:0;if(snapshot)for(const tile of snapshot.tiles)for(const material of tile.materials||[]){material.bumpScale=SEMANTIC.material.bumpScale*active;material.userData.semanticEnvelope=active;if(material.userData.semanticUniforms)material.userData.semanticUniforms.uSemanticEnvelope.value=active;}semanticState.envelope=active;}
function clearSemanticSnapshot(){const snapshot=semanticState.snapshot;if(!snapshot){semanticState.envelope=0;return;}setFaceEnvelope(null,0);for(const tile of snapshot.tiles){disposeTileTextures(tile);const mesh=tile.mesh,semanticGeometry=mesh.geometry,semanticMaterialInstance=tile.semanticMaterial;mesh.material=tile.baseMaterial;mesh.geometry=tile.baseGeometry;if(semanticGeometry&&semanticGeometry!==tile.baseGeometry)semanticGeometry.dispose?.();semanticMaterialInstance?.dispose?.();tile.bump=null;tile.rough=null;}semanticState.snapshot=null;semanticState.envelope=0;}
function resetStageImmediate(reason='stage-cancel'){if(semanticState.state==='STAGED')semanticState.stageCancellations++;clearSemanticSnapshot();semanticState.state='DORMANT';semanticState.face=null;semanticState.message=null;semanticState.stageMs=null;semanticState.candidateMs=null;semanticState.readableMs=null;semanticState.releaseMs=null;semanticState.belowExitSinceMs=null;semanticState.candidatePeak=0;if(reason)semanticState.lastCancelReason=reason;}

function chooseSafeSingle(face,preferredAxis=null){const candidates=[];for(const axis of AXES)for(const layer of LAYERS){const probe={axis,layer,direction:1};if(moveIntersection(probe,face).count===0)candidates.push({axis,layer});}if(!candidates.length)return null;const ordered=preferredAxis?[...candidates.filter((c)=>c.axis===preferredAxis),...candidates.filter((c)=>c.axis!==preferredAxis)]:candidates;const chosen=ordered[Math.floor(semanticUnit()*ordered.length)%ordered.length];return makeSemanticMove(chosen.axis,chosen.layer);}
function makeSemanticMove(axis,layer){return{axis,layer,direction:semanticUnit()<.5?-1:1,durationMs:Math.round(SEMANTIC_SAFE_DURATION())};}
function SEMANTIC_SAFE_DURATION(){return SLICE_R1_2.turnDurationRangeMs[0]+(SLICE_R1_2.turnDurationRangeMs[1]-SLICE_R1_2.turnDurationRangeMs[0])*semanticUnit();}
function chooseSafePair(face,preferredAxis=null){const axisOrder=preferredAxis?[preferredAxis,...AXES.filter((a)=>a!==preferredAxis)]:[...AXES];for(const axis of axisOrder){const safeLayers=LAYERS.filter((layer)=>moveIntersection({axis,layer,direction:1},face).count===0);if(safeLayers.length>=2){const i=Math.floor(semanticUnit()*safeLayers.length)%safeLayers.length,firstLayer=safeLayers[i],remaining=safeLayers.filter((l)=>l!==firstLayer),secondLayer=remaining[Math.floor(semanticUnit()*remaining.length)%remaining.length];return{type:'pair',moves:[makeSemanticMove(axis,firstLayer),makeSemanticMove(axis,secondLayer)],staggerMs:Math.round(SLICE_R1_2.pairedStaggerRangeMs[0]+(SLICE_R1_2.pairedStaggerRangeMs[1]-SLICE_R1_2.pairedStaggerRangeMs[0])*semanticUnit())};}}return null;}

function adaptGoldenEvent(event){
  if(!semanticEnabled)return event;
  if(semanticState.state==='STAGED'&&semanticState.snapshot&&eventUnsafeForProtected(event,semanticState.snapshot.face)){resetStageImmediate('golden-event-conflict');return event;}
  const face=protectedFace();if(!face||!eventUnsafeForProtected(event,face))return event;
  semanticState.protectedSubstitutions++;
  semanticState.wholeFaceDeferrals+=countWholeFaceDeferrals(event,face);
  if(event.type==='pair'){const pair=chooseSafePair(face,event.moves[0]?.axis);if(!pair)throw new Error('No strict-safe semantic pair available');return pair;}
  if(event.type==='phrase'){const pair=chooseSafePair(face,event.moves[0]?.axis);if(pair)return pair;const single=chooseSafeSingle(face,event.moves[0]?.axis);if(!single)throw new Error('No strict-safe semantic fallback available');return{type:'single',moves:[single]};}
  const single=chooseSafeSingle(face,event.moves[0]?.axis);if(!single)throw new Error('No strict-safe semantic single available');return{type:'single',moves:[single]};
}

function assertProtectedMoveSafe(move){const face=protectedFace();if(!face)return;const intersection=moveIntersection(move,face);if(intersection.count===9)throw new Error(`Protected whole-face rotation attempted: ${face} ${move.axis}${move.layer}`);if(intersection.count>0){semanticState.tearingViolations++;throw new Error(`Protected semantic tearing attempted: ${face} ${move.axis}${move.layer} count=${intersection.count}`);}}
function assertProtectedPairSafe(a,b){const face=protectedFace();if(!face)return;const intersections=[moveIntersection(a,face),moveIntersection(b,face)];for(let i=0;i<intersections.length;i++){const intersection=intersections[i],move=i===0?a:b;if(intersection.count===9)throw new Error(`Protected whole-face pair rotation attempted: ${face} ${move.axis}${move.layer}`);if(intersection.count>0){semanticState.tearingViolations++;throw new Error(`Protected semantic pair tearing attempted: ${face} ${move.axis}${move.layer} count=${intersection.count}`);}}}
function recordMove(move){counters.axes[move.axis]++;counters.layers[String(move.layer)]++;}
async function executeSingle(event){const move=event.moves[0];assertProtectedMoveSafe(move);recordMove(move);counters.single++;return turnSlice(move);}
async function executePair(event){const [a,b]=event.moves;if(a.axis!==b.axis||a.layer===b.layer)throw new Error('Pair invariant failed');assertProtectedPairSafe(a,b);recordMove(a);recordMove(b);counters.pair++;const first=turnSlice(a);await sleep(event.staggerMs);const second=turnSlice(b);if(activeTurns.size===2){counters.concurrentPairs++;counters.pairOverlapEvents++;if(protectedFace())semanticState.safePairsDuringProtection++;}return Promise.all([first,second]);}
async function executePhrase(event){counters.phrase++;for(let i=0;i<event.moves.length;i++){const move=event.moves[i];assertProtectedMoveSafe(move);recordMove(move);await turnSlice(move);if(i<event.moves.length-1)await schedulerDelay(event.microGaps[i]);}return true;}
async function executeEvent(event){if(event.type==='pair')return executePair(event);if(event.type==='phrase')return executePhrase(event);return executeSingle(event);}

async function sliceSchedulerLoop(){if(sliceSchedulerRunning)return;sliceSchedulerRunning=true;await schedulerDelay(420);while(sliceSchedulerEnabled){const type=SLICE_R1_2.eventPattern[sliceEventSerial%SLICE_R1_2.eventPattern.length],golden=proposeGoldenEvent(type),event=adaptGoldenEvent(golden);await executeEvent(event);sliceEventSerial++;eventsUntilBreath--;if(!sliceSchedulerEnabled)break;if(eventsUntilBreath<=0){await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.breathingGapRangeMs)));eventsUntilBreath=seededInt(3,4);}else await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.typicalGapRangeMs)));}sliceSchedulerRunning=false;}

function semanticTileCoords(face,logical){if(face==='+Z')return{u:logical.x,v:logical.y};if(face==='+X')return{u:-logical.z,v:logical.y};return{u:logical.z,v:logical.y};}
function faceAssembled(face){const reg=activeFacePlane(face);if(!reg||reg.ids.size!==9)return false;return reg.cubies.every((cubie)=>axisComponent(cubie.logical,reg.axis)===reg.layer);}
function faceClearOfActiveTurns(face){const reg=activeFacePlane(face);if(!reg)return false;for(const turn of activeTurns.values())if(turn.cubiePlans.some((p)=>reg.ids.has(p.cubie.id)))return false;return true;}
function semanticCubieWorldCenter(cubie){const p=logicalPosition(cubie.logical);return sceneOne.localToWorld(p.clone());}
function projectedAreaQuality(face){const reg=activeFacePlane(face);if(!reg)return 0;let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,count=0;for(const cubie of reg.cubies){const p=semanticCubieWorldCenter(cubie).project(camera);if(!Number.isFinite(p.x)||!Number.isFinite(p.y))continue;minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y);count++;}if(count<4)return 0;return THREE.MathUtils.clamp(((maxX-minX)*(maxY-minY))/.42,0,1);}
function evaluateFace(face){const reg=activeFacePlane(face),assembled=faceAssembled(face);if(!reg||!assembled)return{face,assembled:false,rawQuality:0,selectionScore:0,viewAlignment:0,projectedAreaQuality:0,brdfQuality:0};sceneOne.updateMatrixWorld(true);camera.updateMatrixWorld(true);key.updateMatrixWorld(true);const center=new THREE.Vector3();for(const cubie of reg.cubies)center.add(semanticCubieWorldCenter(cubie));center.multiplyScalar(1/reg.cubies.length);const worldQ=sceneOne.getWorldQuaternion(new THREE.Quaternion()),normal=reg.normal.clone().applyQuaternion(worldQ).normalize(),cameraWorld=camera.getWorldPosition(new THREE.Vector3()),view=cameraWorld.clone().sub(center).normalize(),signedFaceView=normal.dot(view),viewAlignment=THREE.MathUtils.clamp(signedFaceView,0,1),area=projectedAreaQuality(face),lightWorld=key.getWorldPosition(new THREE.Vector3()),half=view.clone().add(lightWorld.clone().sub(center).normalize()).normalize(),signedHalfDot=normal.dot(half),brdf=THREE.MathUtils.smoothstep(THREE.MathUtils.clamp(signedHalfDot,0,1),.54,.90),viewQ=THREE.MathUtils.smoothstep(viewAlignment,.50,.88),areaQ=THREE.MathUtils.smoothstep(area,.20,.78),distortion=THREE.MathUtils.smoothstep(viewAlignment,.50,.86),raw=THREE.MathUtils.clamp(.46*viewQ+.18*areaQ+.24*brdf+.12*distortion,0,1);return{face,assembled:true,rawQuality:raw,selectionScore:raw,viewAlignment,projectedAreaQuality:area,brdfQuality:brdf,signedFaceView,signedHalfDot};}

function globalMessageCanvas(text){const size=2048,raw=document.createElement('canvas');raw.width=size;raw.height=size;const ctx=raw.getContext('2d',{alpha:true});ctx.clearRect(0,0,size,size);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='alphabetic';const target=size*SEMANTIC.typography.targetWidthRatio;let low=100,high=900;for(let i=0;i<20;i++){const mid=(low+high)*.5;ctx.font=`${SEMANTIC.typography.weight} ${mid}px \"${SEMANTIC.typography.family}\", sans-serif`;if(ctx.measureText(text).width<target)low=mid;else high=mid;}const fontPx=(low+high)*.5;ctx.font=`${SEMANTIC.typography.weight} ${fontPx}px \"${SEMANTIC.typography.family}\", sans-serif`;const metrics=ctx.measureText(text),ascent=metrics.actualBoundingBoxAscent||fontPx*.72,descent=metrics.actualBoundingBoxDescent||fontPx*.18,baseline=size*.5+(ascent-descent)*.5;ctx.fillText(text,size*.5,baseline);const scaled=document.createElement('canvas');scaled.width=size;scaled.height=size;const sc=scaled.getContext('2d',{alpha:true}),dw=size*SEMANTIC.typography.scaleX,dh=size*SEMANTIC.typography.scaleY;sc.drawImage(raw,(size-dw)*.5,(size-dh)*.5,dw,dh);return scaled;}
function tileMask(globalCanvas,u,v){const size=768,cell=globalCanvas.width/3,canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d',{alpha:true}),col=u+1,row=1-v;ctx.clearRect(0,0,size,size);ctx.drawImage(globalCanvas,col*cell,row*cell,cell,cell,0,0,size,size);return canvas;}
function makeCanvasTexture(canvas,colorSpace=THREE.NoColorSpace){const t=new THREE.CanvasTexture(canvas);t.colorSpace=colorSpace;t.minFilter=THREE.LinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.needsUpdate=true;return t;}
function bevelTexture(maskCanvas){const c=document.createElement('canvas');c.width=maskCanvas.width;c.height=maskCanvas.height;const ctx=c.getContext('2d',{alpha:false});ctx.fillStyle='#000';ctx.fillRect(0,0,c.width,c.height);ctx.save();ctx.filter='blur(5px)';ctx.globalAlpha=.74;ctx.drawImage(maskCanvas,0,0);ctx.restore();ctx.globalAlpha=.26;ctx.drawImage(maskCanvas,0,0);ctx.globalAlpha=1;return makeCanvasTexture(c);}
function pearlRoughnessTexture(maskCanvas){const size=maskCanvas.width,c=document.createElement('canvas');c.width=size;c.height=size;const ctx=c.getContext('2d',{alpha:false}),src=maskCanvas.getContext('2d',{willReadFrequently:true}).getImageData(0,0,size,size).data,out=ctx.createImageData(size,size),body=Math.round(255*SEMANTIC.material.roughnessMapInk),edge=Math.round(255*SEMANTIC.material.pearlEdgeRoughnessInk),r=SEMANTIC.material.innerEdgePx;for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=(y*size+x)*4,a=src[i+3]/255;let val=255;if(a>.015){let minA=a;for(const[dx,dy]of[[-r,0],[r,0],[0,-r],[0,r],[-r,-r],[r,-r],[-r,r],[r,r]]){const nx=Math.max(0,Math.min(size-1,x+dx)),ny=Math.max(0,Math.min(size-1,y+dy));minA=Math.min(minA,src[(ny*size+nx)*4+3]/255);}const e=THREE.MathUtils.clamp((a-minA)/.58,0,1),ink=body+(edge-body)*e;val=Math.round(255+(ink-255)*a);}out.data[i]=out.data[i+1]=out.data[i+2]=val;out.data[i+3]=255;}ctx.putImageData(out,0,0);return makeCanvasTexture(c);}
function blankTexture(){const c=document.createElement('canvas');c.width=4;c.height=4;const ctx=c.getContext('2d');ctx.fillStyle='#000';ctx.fillRect(0,0,4,4);return makeCanvasTexture(c);}
const BLANK_BUMP=blankTexture();
function whiteTexture(){const c=document.createElement('canvas');c.width=4;c.height=4;const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,4,4);return makeCanvasTexture(c);}
const BLANK_ROUGH=whiteTexture();

function planarizeSemanticGeometry(mesh,face){const basis=faceDefinition(face),geometry=mesh.geometry.clone(),position=geometry.getAttribute('position');sceneOne.updateMatrixWorld(true);mesh.updateMatrixWorld(true);const coords=[],p=new THREE.Vector3();let minU=Infinity,maxU=-Infinity,minV=Infinity,maxV=-Infinity;for(let i=0;i<position.count;i++){p.fromBufferAttribute(position,i);mesh.localToWorld(p);sceneOne.worldToLocal(p);const u=p.dot(basis.u),v=p.dot(basis.v);coords.push([u,v]);minU=Math.min(minU,u);maxU=Math.max(maxU,u);minV=Math.min(minV,v);maxV=Math.max(maxV,v);}const uv=new Float32Array(position.count*2),su=Math.max(1e-6,maxU-minU),sv=Math.max(1e-6,maxV-minV);coords.forEach(([u,v],i)=>{uv[i*2]=(u-minU)/su;uv[i*2+1]=(v-minV)/sv;});geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));return geometry;}
function semanticMaterial(mesh,base,face){const m=base.clone();m.name=`GOLDEN_SEMANTIC_R1_${face}_${base.name||'FACE'}`;m.bumpMap=BLANK_BUMP;m.bumpScale=0;m.userData.semanticEnvelope=0;m.userData.semanticRoughTexture=BLANK_ROUGH;m.customProgramCacheKey=()=> 'proai-golden-local-semantic-r1-v1';m.onBeforeCompile=(shader)=>{shader.uniforms.uSemanticEnvelope={value:m.userData.semanticEnvelope};shader.uniforms.uSemanticRoughness={value:m.userData.semanticRoughTexture};m.userData.semanticUniforms=shader.uniforms;shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>\nfloat proaiSemanticRough=texture2D(uSemanticRoughness,vBumpMapUv).r;\nroughnessFactor=mix(roughnessFactor,roughnessFactor*proaiSemanticRough,uSemanticEnvelope);`).replace('#include <map_fragment>',`#include <map_fragment>\nfloat proaiSemanticMask=texture2D(bumpMap,vBumpMapUv).r;\ndiffuseColor.rgb*=mix(1.0,mix(1.0,${SEMANTIC.material.tonalInk.toFixed(3)},proaiSemanticMask),uSemanticEnvelope);`);shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform float uSemanticEnvelope;\nuniform sampler2D uSemanticRoughness;');};mesh.geometry=planarizeSemanticGeometry(mesh,face);return m;}
function meshSceneCenter(mesh){mesh.geometry.computeBoundingBox();const p=mesh.geometry.boundingBox.getCenter(new THREE.Vector3());mesh.localToWorld(p);return sceneOne.worldToLocal(p);}
function outwardMesh(cubie,face){const normal=faceDefinition(face).normal,cubieCenter=logicalPosition(cubie.logical),candidates=[];sceneOne.updateMatrixWorld(true);for(const member of cubie.members)for(const mesh of member.object.children){if(!mesh.isMesh||mesh.name==='Plane'||!mesh.geometry?.userData?.proaiGoldenFace)continue;mesh.updateWorldMatrix(true,false);const score=meshSceneCenter(mesh).sub(cubieCenter).dot(normal);candidates.push({mesh,score});}if(!candidates.length)return null;candidates.sort((a,b)=>b.score-a.score);return candidates[0].score>0?candidates[0].mesh:null;}
function acquireSemanticSnapshot(face){const def=faceDefinition(face),cubies=selectLayer(def.axis,def.layer),ids=new Set(cubies.map((c)=>c.id)),tiles=[];if(cubies.length!==9)throw new Error(`Semantic ${face} expected 9 current cubies`);for(const cubie of cubies){const logical=Object.freeze({...cubie.logical}),coords=Object.freeze(semanticTileCoords(face,logical)),mesh=outwardMesh(cubie,face);if(!mesh)throw new Error(`Semantic ${face} missing current outward mesh for ${cubie.id}`);tiles.push({cubieId:cubie.id,cubie,logical,coords,mesh,baseGeometry:mesh.geometry,baseMaterial:mesh.material,semanticMaterial:null,materials:[],bump:null,rough:null});}if(new Set(tiles.map((tile)=>tile.mesh.uuid)).size!==9)throw new Error(`Semantic ${face} current outward mesh set must contain 9 unique tiles`);return{face,...def,cubies:[...cubies],ids,tiles};}
function installSemanticSnapshot(snapshot){for(const tile of snapshot.tiles){const material=semanticMaterial(tile.mesh,tile.baseMaterial,snapshot.face);tile.mesh.material=material;tile.semanticMaterial=material;tile.materials=[material];}}
function disposeTileTextures(tile){for(const t of [tile.bump,tile.rough])if(t&&t!==BLANK_BUMP&&t!==BLANK_ROUGH)t.dispose?.();}
function applyMessageToFace(face,message){const reg=semanticState.snapshot;if(!reg||reg.face!==face)throw new Error(`Semantic ${face} has no active snapshot`);const global=globalMessageCanvas(message);for(const tile of reg.tiles){disposeTileTextures(tile);const mask=tileMask(global,tile.coords.u,tile.coords.v),bump=bevelTexture(mask),rough=pearlRoughnessTexture(mask);tile.bump=bump;tile.rough=rough;for(const m of tile.materials){m.bumpMap=bump;m.userData.semanticRoughTexture=rough;if(m.userData.semanticUniforms)m.userData.semanticUniforms.uSemanticRoughness.value=rough;m.needsUpdate=true;}}}

function bestStageFace(){const list=SEMANTIC.faces.map(evaluateFace).filter((q)=>q.assembled&&faceClearOfActiveTurns(q.face)&&q.rawQuality>=SEMANTIC.observer.stageScoreMin&&q.rawQuality<=SEMANTIC.observer.stageScoreMax&&q.viewAlignment>=SEMANTIC.observer.stageViewMin&&q.projectedAreaQuality>=SEMANTIC.observer.stageAreaMin&&q.brdfQuality>=SEMANTIC.observer.stageBrdfMin).sort((a,b)=>b.selectionScore-a.selectionScore);return list[0]||null;}
function stageFace(q,now){const message=SEMANTIC.messages[semanticState.messageIndex],snapshot=acquireSemanticSnapshot(q.face);semanticState.snapshot=snapshot;try{installSemanticSnapshot(snapshot);applyMessageToFace(q.face,message);}catch(error){clearSemanticSnapshot();throw error;}semanticState.state='STAGED';semanticState.face=q.face;semanticState.message=message;semanticState.stageMs=now;semanticState.candidateMs=null;semanticState.readableMs=null;semanticState.releaseMs=null;semanticState.readableDurationMs=null;semanticState.candidatePeak=0;semanticState.belowExitSinceMs=null;if(semanticState.firstStageMs===null){semanticState.firstStageMs=now;semanticState.firstFace=q.face;semanticState.firstMessage=message;}setFaceEnvelope(q.face,.20);}
function startCandidate(q,now){semanticState.state='CANDIDATE';semanticState.candidateMs=now;semanticState.candidatePeak=q.rawQuality;if(semanticState.firstCandidateMs===null)semanticState.firstCandidateMs=now;}
function startReadable(q,now){semanticState.state='READABLE';semanticState.readableMs=now;semanticState.belowExitSinceMs=null;if(semanticState.firstReadableMs===null)semanticState.firstReadableMs=now;setFaceEnvelope(semanticState.face,1);}
function startRelease(now,success,reason){const duration=semanticState.readableMs===null?null:Math.max(0,now-semanticState.readableMs);semanticState.state='RELEASE';semanticState.releaseMs=now;semanticState.readableDurationMs=duration;semanticState.releaseStartEnvelope=semanticState.envelope;semanticState.releaseSuccess=success;semanticState.releaseReason=reason;if(semanticState.firstReleaseMs===null)semanticState.firstReleaseMs=now;}
function finishRelease(now){setFaceEnvelope(null,0);clearSemanticSnapshot();if(semanticState.releaseSuccess){semanticState.messageIndex=(semanticState.messageIndex+1)%SEMANTIC.messages.length;semanticState.nextEligibleMs=now+semanticRange(...SEMANTIC.observer.cooldownRangeMs);}semanticState.state='DORMANT';semanticState.face=null;semanticState.message=null;semanticState.stageMs=null;semanticState.candidateMs=null;semanticState.readableMs=null;semanticState.releaseMs=null;semanticState.belowExitSinceMs=null;semanticState.candidatePeak=0;}

function updateSemantic(now){
  if(!runtimeState.ready||!semanticEnabled)return;
  if(semanticState.firstEligibilityMs===null)semanticState.firstEligibilityMs=now;
  const dt=Math.max(0,Math.min(80,now-(semanticState.lastUpdateMs||now)));semanticState.lastUpdateMs=now;
  if(semanticState.state==='DORMANT'){
    if(now<semanticState.nextEligibleMs||activeTurns.size>0)return;
    const best=bestStageFace();if(best)stageFace(best,now);return;
  }
  if(!semanticState.face)return;
  if(semanticState.state==='RELEASE'){
    const p=THREE.MathUtils.clamp((now-semanticState.releaseMs)/SEMANTIC.observer.releaseMs,0,1),e=semanticState.releaseStartEnvelope*(1-smoothstep(p));setFaceEnvelope(semanticState.face,e);if(p>=1)finishRelease(now);return;
  }
  const q=evaluateFace(semanticState.face);
  if(semanticState.state==='STAGED'){
    if(!q.assembled){resetStageImmediate('assembly-lost');return;}
    const target=.18+.30*THREE.MathUtils.clamp((q.rawQuality-SEMANTIC.observer.stageScoreMin)/Math.max(.001,SEMANTIC.observer.enterScore-SEMANTIC.observer.stageScoreMin),0,1);
    setFaceEnvelope(semanticState.face,THREE.MathUtils.lerp(semanticState.envelope,target,1-Math.exp(-dt/180)));
    if(q.rawQuality>=SEMANTIC.observer.candidateApproachScore&&q.viewAlignment>=SEMANTIC.observer.candidateApproachView&&faceClearOfActiveTurns(q.face))startCandidate(q,now);
    return;
  }
  if(semanticState.state==='CANDIDATE'){
    if(!q.assembled){startRelease(now,false,'assembly-lost');return;}
    semanticState.candidatePeak=Math.max(semanticState.candidatePeak,q.rawQuality);setFaceEnvelope(semanticState.face,THREE.MathUtils.lerp(semanticState.envelope,.72,1-Math.exp(-dt/150)));
    if(q.rawQuality<SEMANTIC.observer.candidateApproachScore||q.viewAlignment<SEMANTIC.observer.candidateApproachView){startRelease(now,false,'candidate-optical-exit');return;}
    const dwell=now-semanticState.candidateMs,enter=q.rawQuality>=SEMANTIC.observer.enterScore&&q.viewAlignment>=SEMANTIC.observer.enterView&&q.projectedAreaQuality>=SEMANTIC.observer.enterArea&&q.brdfQuality>=SEMANTIC.observer.enterBrdf;
    if(dwell>=SEMANTIC.observer.candidateDwellMs&&enter)startReadable(q,now);return;
  }
  if(semanticState.state==='READABLE'){
    if(!q.assembled){semanticState.tearingViolations++;startRelease(now,true,'assembly-lost-violation');return;}
    setFaceEnvelope(semanticState.face,1);const elapsed=now-semanticState.readableMs,readable=q.rawQuality>=SEMANTIC.observer.exitScore&&q.viewAlignment>=SEMANTIC.observer.exitView;
    if(readable)semanticState.belowExitSinceMs=null;else if(semanticState.belowExitSinceMs===null)semanticState.belowExitSinceMs=now;
    const naturalExit=elapsed>=SEMANTIC.observer.minReadableMs&&semanticState.belowExitSinceMs!==null&&now-semanticState.belowExitSinceMs>=SEMANTIC.observer.releaseDebounceMs;
    if(naturalExit)startRelease(now,true,'natural-optical-exit');else if(elapsed>=SEMANTIC.observer.maxReadableHoldMs)startRelease(now,true,'max-readable-cap');return;
  }
}

function classifyReviewMaterial(mesh){if(mesh.geometry?.userData?.proaiGoldenCore)return coreMaterial;mesh.updateWorldMatrix(true,false);mesh.geometry.computeBoundingBox();const center=mesh.geometry.boundingBox.getCenter(new THREE.Vector3()),sceneCenter=sceneOne.worldToLocal(mesh.localToWorld(center)),relative=sceneCenter.sub(cubeCenterLocal),ax=Math.abs(relative.x),ay=Math.abs(relative.y),az=Math.abs(relative.z);if(ay>=ax&&ay>=az)return faceGunmetalMaterial;if(ax>=az)return faceBlackChromeMaterial;return faceGraphiteMaterial;}
function configureStudioLighting(centerWorld,radius){const place=(light,offset,ws,hs)=>{light.position.copy(centerWorld).add(new THREE.Vector3(...offset).multiplyScalar(radius));light.width=radius*ws;light.height=radius*hs;light.lookAt(centerWorld);};place(key,[1.62,.62,1.95],3.20,2.50);place(fill,[-1.45,.22,1.72],2.85,2.65);place(rim,[-1.28,1.02,-1.88],1.15,2.65);}
function frameCamera(){cubeRoot.updateMatrixWorld(true);const box=new THREE.Box3().makeEmpty();cubieParents.forEach((o)=>box.expandByObject(o,true));const sphere=box.getBoundingSphere(new THREE.Sphere()),center=sphere.center.clone(),radius=sphere.radius,fov=THREE.MathUtils.degToRad(camera.fov),distance=radius/Math.sin(fov/2)*1.075,direction=new THREE.Vector3(1.18,.86,1.33).normalize();camera.position.copy(center).addScaledVector(direction,distance);camera.near=Math.max(.01,distance-radius*3);camera.far=distance+radius*5;camera.updateProjectionMatrix();controls.target.copy(center);controls.minDistance=distance*.78;controls.maxDistance=distance*1.28;configureStudioLighting(center,radius);controls.update();}
function resize(){const rect=canvas.getBoundingClientRect();renderer.setSize(Math.max(1,rect.width),Math.max(1,rect.height),false);camera.aspect=Math.max(.1,rect.width/Math.max(1,rect.height));camera.updateProjectionMatrix();}
window.addEventListener('resize',resize,{passive:true});

function diagnosticsSnapshot(){return{
  ready:runtimeState.ready,semanticEnabled,golden:GOLDEN,motionState,
  signedYawVelocityDegPerSec:presentationYawVelocityDegPerSec,signedYawDeg:presentationSignedYawDeg,pitchDeg:presentationPitchDeg,rollDeg:presentationRollDeg,
  eventSerial:sliceEventSerial,singleCount:counters.single,pairCount:counters.pair,phraseCount:counters.phrase,actualConcurrentPairCount:counters.concurrentPairs,
  axisCounts:{...counters.axes},layerCounts:{...counters.layers},maxSimultaneousTurns:counters.maxSimultaneousTurns,pairOverlapEvents:counters.pairOverlapEvents,
  activeTurns:activeTurnList().map((t)=>({axis:t.axis,layer:t.layer,direction:t.direction,linear:t.linear,ids:t.cubiePlans.map((p)=>p.cubie.id)})),
  endpointError:lastTurnResult?.endpointErrorRad??null,canonicalError:runtimeState.ready&&activeTurns.size===0?canonicalTransformError():null,
  semanticState:semanticState.state,semanticMessage:semanticState.message,semanticFace:semanticState.face,semanticStageTime:semanticState.stageMs===null?null:semanticState.stageMs-readyAtMs,semanticCandidateTime:semanticState.candidateMs===null?null:semanticState.candidateMs-readyAtMs,semanticReadableTime:semanticState.readableMs===null?null:semanticState.readableMs-readyAtMs,semanticReleaseTime:semanticState.releaseMs===null?null:semanticState.releaseMs-readyAtMs,readableDuration:semanticState.readableDurationMs,
  protectedSubstitutions:semanticState.protectedSubstitutions,tearingViolations:semanticState.tearingViolations,wholeFaceDeferrals:semanticState.wholeFaceDeferrals,wholeFaceReadableRotationsExecuted:semanticState.wholeFaceReadableRotationsExecuted,safePairsDuringProtection:semanticState.safePairsDuringProtection,stageCancellations:semanticState.stageCancellations,semanticQueueIndex:semanticState.messageIndex,
  firstEligibility:semanticState.firstEligibilityMs===null?null:semanticState.firstEligibilityMs-readyAtMs,firstStage:semanticState.firstStageMs===null?null:semanticState.firstStageMs-readyAtMs,firstCandidate:semanticState.firstCandidateMs===null?null:semanticState.firstCandidateMs-readyAtMs,firstReadable:semanticState.firstReadableMs===null?null:semanticState.firstReadableMs-readyAtMs,firstRelease:semanticState.firstReleaseMs===null?null:semanticState.firstReleaseMs-readyAtMs,firstFace:semanticState.firstFace,firstMessage:semanticState.firstMessage,
  semanticFaces:[...SEMANTIC.faces],semanticSnapshotIds:semanticState.snapshot?[...semanticState.snapshot.ids]:[],semanticSnapshotMapping:semanticState.snapshot?semanticState.snapshot.tiles.map((tile)=>({id:tile.cubieId,u:tile.coords.u,v:tile.coords.v})):[],eventPattern:[...SLICE_R1_2.eventPattern],signedNegativeYawPreserved:PRESENTATION_R1_2.velocityKeyframes.some((k)=>k.velocityDegPerSec<0),
};}
const runtimeState={ready:false};
const diagnostics=Object.freeze({get ready(){return runtimeState.ready;},get snapshot(){return diagnosticsSnapshot();}});
Object.defineProperty(window,'__PROAI_GOLDEN_SEMANTIC_R1',{value:diagnostics,writable:false,configurable:false});

function render(now){updatePresentationMotion(now);updateSemantic(now);controls.update();renderer.render(scene,camera);requestAnimationFrame(render);}
requestAnimationFrame(render);

async function sha256Hex(buffer){const digest=await crypto.subtle.digest('SHA-256',buffer);return[...new Uint8Array(digest)].map((b)=>b.toString(16).padStart(2,'0')).join('');}
async function loadVerifiedGoldenGLB(){
  const response=await fetch(GLB_URL,{cache:'force-cache'});if(!response.ok)throw new Error(`Golden GLB HTTP ${response.status}`);const buffer=await response.arrayBuffer();
  if(buffer.byteLength!==GOLDEN.glbBytes)throw new Error(`Golden GLB byte mismatch ${buffer.byteLength}`);const hash=await sha256Hex(buffer);if(hash!==GOLDEN.glbSha256)throw new Error(`Golden GLB SHA256 mismatch ${hash}`);
  const loader=new GLTFLoader();return new Promise((resolve,reject)=>loader.parse(buffer,'',resolve,reject));
}

async function boot(){
  try{
    await document.fonts?.load?.('620 80px \"Instrument Sans\"');
    const gltf=await loadVerifiedGoldenGLB();cubeRoot=gltf.scene;presentationRig.add(cubeRoot);cubeRoot.updateMatrixWorld(true);sceneOne=cubeRoot.getObjectByName('right')?.parent||cubeRoot.getObjectByName('Scene 1')||cubeRoot;
    cubeRoot.traverse((o)=>{if(o.name==='Plane'||o.isLight)o.visible=false;});prepareMechanicalModel();const geometry=enhanceRenderGeometry();if(!geometry.pass)throw new Error(`Golden geometry gate failed ${JSON.stringify(geometry)}`);
    cubeRoot.updateMatrixWorld(true);cubeRoot.traverse((o)=>{if(o.isMesh&&o.name!=='Plane'){o.material=classifyReviewMaterial(o);o.castShadow=false;o.receiveShadow=false;}});
    frameCamera();resize();readyAtMs=performance.now();runtimeState.ready=true;motionState='rest';status.textContent=`Golden verified · semantics ${semanticEnabled?'enabled':'disabled'} · Owner review`;status.classList.add('ready');if(sliceSchedulerEnabled)void sliceSchedulerLoop();
  }catch(error){console.error('[Golden Semantic R1] boot failed',error);motionState='error';status.textContent=`Runtime error: ${error.message||error}`;status.classList.add('error');}
}
boot();
