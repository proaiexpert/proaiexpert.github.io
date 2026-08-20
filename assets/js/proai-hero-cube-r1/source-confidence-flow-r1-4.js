// ProAI Cube R1.4 — confidence / momentum polish.
// R1.3 remains preserved byte-for-byte in source-continuous-flow-r1-3.js.
// This authority replaces only Candidate B whole-object presentation code at module-load time.

const sourceUrl = new URL('./source-materials-r1.js', import.meta.url);
const glbUrl = new URL('../../models/proai-cube/rubik_39_s_cube_animation.glb', import.meta.url);

const response = await fetch(sourceUrl, { cache: 'no-store' });
if (!response.ok) throw new Error(`R1.4 base source HTTP ${response.status}`);
let source = await response.text();

const REQUIRED_B_MARKERS = [
  "motionAuthority: 'quaternion-editorial-spatial-r1.2-premium'",
  'const SLICE_R1_2 = Object.freeze({',
  'seed: 0x51a7c0de',
  "selectedPreset: 'premiumHybrid'",
  "const GLB_URL = new URL('./rubik_39_s_cube_animation.glb', import.meta.url).href;",
];
for (const marker of REQUIRED_B_MARKERS) {
  if (!source.includes(marker)) throw new Error(`R1.4 refused unexpected Candidate B source: ${marker}`);
}

source = source.replace(
  "const GLB_URL = new URL('./rubik_39_s_cube_animation.glb', import.meta.url).href;",
  `const GLB_URL = '${glbUrl.href}';`,
);

const presentationConfigPattern = /\/\/ Runtime whole-object presentation authority — R1\.2 premium editorial spatial motion\.\nconst PRESENTATION_SPATIAL_R1_2 = Object\.freeze\(\{[\s\S]*?\n\}\);\n\nconst SLICE_R1_2/;
const presentationConfigR14 = `// Runtime whole-object presentation authority — R1.4 confidence / momentum polish.
const PRESENTATION_SPATIAL_R1_4 = Object.freeze({
  cycleMs: 75000,
  motionAuthority: 'quaternion-confidence-flow-r1.4',
  rotorTurns: Object.freeze({ primary: 3, secondary: 1 }),
  primaryAxis: Object.freeze([0.42, 0.84, 0.34]),
  secondaryAxis: Object.freeze([0.86, -0.18, 0.48]),
  phaseModulation: Object.freeze({
    primaryRad: 0.25,
    primaryPhaseRad: 0.20,
    secondaryRad: 0.16,
    secondaryPhaseRad: 1.20,
  }),
  metricEpsilonMs: 8,
  travelSampleStepMs: 20,
  confidenceWindowMs: 1000,
  targetSpeedDegPerSec: Object.freeze({ calm: [11, 15], normal: [15, 20], emphasis: [20, 24] }),
});

const SLICE_R1_2`;
if (!presentationConfigPattern.test(source)) throw new Error('R1.4 presentation-config patch target missing');
source = source.replace(presentationConfigPattern, presentationConfigR14);
source = source.replaceAll('PRESENTATION_SPATIAL_R1_2', 'PRESENTATION_SPATIAL_R1_4');
source = source.replace(
  "let presentationPhase = PRESENTATION_SPATIAL_R1_4.keyframes[0].motion;",
  "let presentationPhase = 'continuous';",
);
source = source.replace(
  "let presentationPoseLabel = PRESENTATION_SPATIAL_R1_4.keyframes[0].label;",
  "let presentationPoseLabel = 'confidence-flow';",
);
source = source.replace(
  'window.__PROAI_CUBE_SPATIAL_R1_2 = api;',
  'window.__PROAI_CUBE_SPATIAL_R1_2 = api;\nwindow.__PROAI_CUBE_SPATIAL_R1_4 = api;',
);

const presentationFunctionsPattern = /function presentationPoseQuaternion\([\s\S]*?\nfunction seededUnit\(\) \{/;
const presentationFunctionsR14 = `const presentationFlowQPrimary = new THREE.Quaternion();
const presentationFlowQSecondary = new THREE.Quaternion();
const presentationMetricBefore = new THREE.Quaternion();
const presentationMetricAfter = new THREE.Quaternion();
const presentationPrimaryAxis = new THREE.Vector3(...PRESENTATION_SPATIAL_R1_4.primaryAxis).normalize();
const presentationSecondaryAxis = new THREE.Vector3(...PRESENTATION_SPATIAL_R1_4.secondaryAxis).normalize();

function presentationFlowAnglesAt(timeMs) {
  const cycle = PRESENTATION_SPATIAL_R1_4.cycleMs;
  let local = timeMs % cycle;
  if (local < 0) local += cycle;
  const u = Math.PI * 2 * (local / cycle);
  const phase = PRESENTATION_SPATIAL_R1_4.phaseModulation;
  return {
    primary: PRESENTATION_SPATIAL_R1_4.rotorTurns.primary * u
      + phase.primaryRad * Math.sin(u + phase.primaryPhaseRad),
    secondary: PRESENTATION_SPATIAL_R1_4.rotorTurns.secondary * u
      + phase.secondaryRad * Math.sin(u + phase.secondaryPhaseRad),
  };
}

function presentationQuaternionAt(timeMs, outQuaternion = presentationTargetQuaternion) {
  const angles = presentationFlowAnglesAt(timeMs);
  presentationFlowQPrimary.setFromAxisAngle(presentationPrimaryAxis, angles.primary);
  presentationFlowQSecondary.setFromAxisAngle(presentationSecondaryAxis, angles.secondary);
  return outQuaternion.copy(presentationFlowQPrimary).multiply(presentationFlowQSecondary).normalize();
}

function quaternionDeltaMetrics(before, after, durationSec) {
  presentationInverseQuaternion.copy(before).invert();
  presentationRelativeQuaternion.copy(after).multiply(presentationInverseQuaternion).normalize();
  if (presentationRelativeQuaternion.w < 0) {
    presentationRelativeQuaternion.x *= -1;
    presentationRelativeQuaternion.y *= -1;
    presentationRelativeQuaternion.z *= -1;
    presentationRelativeQuaternion.w *= -1;
  }
  const w = THREE.MathUtils.clamp(presentationRelativeQuaternion.w, -1, 1);
  const angleRad = 2 * Math.acos(w);
  const sinHalf = Math.sqrt(Math.max(0, 1 - w * w));
  if (sinHalf > 1e-7) {
    presentationAxis.set(
      presentationRelativeQuaternion.x / sinHalf,
      presentationRelativeQuaternion.y / sinHalf,
      presentationRelativeQuaternion.z / sinHalf,
    ).normalize();
  } else {
    presentationAxis.copy(presentationPrimaryAxis);
  }
  return {
    axis: presentationAxis.clone(),
    angleRad,
    angleDeg: THREE.MathUtils.radToDeg(angleRad),
    speedDegPerSec: THREE.MathUtils.radToDeg(angleRad) / Math.max(1e-6, durationSec),
  };
}

function spatialDominantAxis(axis) {
  const components = [Math.abs(axis.x), Math.abs(axis.y), Math.abs(axis.z)];
  return AXES[components.indexOf(Math.max(...components))];
}

function presentationMetricsAt(timeMs) {
  const epsilonMs = PRESENTATION_SPATIAL_R1_4.metricEpsilonMs;
  presentationQuaternionAt(timeMs - epsilonMs, presentationMetricBefore);
  presentationQuaternionAt(timeMs + epsilonMs, presentationMetricAfter);
  const metrics = quaternionDeltaMetrics(
    presentationMetricBefore,
    presentationMetricAfter,
    (2 * epsilonMs) / 1000,
  );
  return {
    phase: 'continuous',
    poseLabel: 'confidence-' + spatialDominantAxis(metrics.axis),
    axis: metrics.axis,
    dominantAxis: spatialDominantAxis(metrics.axis),
    speedDegPerSec: metrics.speedDegPerSec,
  };
}

function buildPresentationTravelLut() {
  const cycle = PRESENTATION_SPATIAL_R1_4.cycleMs;
  const step = PRESENTATION_SPATIAL_R1_4.travelSampleStepMs;
  const entries = [{ timeMs: 0, travelDeg: 0 }];
  let total = 0;
  let previous = presentationQuaternionAt(0, new THREE.Quaternion()).clone();
  for (let timeMs = step; timeMs < cycle; timeMs += step) {
    const current = presentationQuaternionAt(timeMs, new THREE.Quaternion()).clone();
    total += THREE.MathUtils.radToDeg(previous.angleTo(current));
    entries.push({ timeMs, travelDeg: total });
    previous = current;
  }
  const end = presentationQuaternionAt(cycle, new THREE.Quaternion()).clone();
  total += THREE.MathUtils.radToDeg(previous.angleTo(end));
  entries.push({ timeMs: cycle, travelDeg: total });
  return Object.freeze({ entries: Object.freeze(entries), cycleTravelDeg: total });
}

const PRESENTATION_SPATIAL_R1_4_TRAVEL = buildPresentationTravelLut();

function presentationTravelAt(timeMs) {
  const target = Math.max(0, timeMs);
  const cycle = PRESENTATION_SPATIAL_R1_4.cycleMs;
  const completeCycles = Math.floor(target / cycle);
  const local = target % cycle;
  const step = PRESENTATION_SPATIAL_R1_4.travelSampleStepMs;
  const entries = PRESENTATION_SPATIAL_R1_4_TRAVEL.entries;
  const index = Math.min(entries.length - 2, Math.floor(local / step));
  const a = entries[index];
  const b = entries[index + 1];
  const mix = THREE.MathUtils.clamp((local - a.timeMs) / Math.max(1, b.timeMs - a.timeMs), 0, 1);
  return completeCycles * PRESENTATION_SPATIAL_R1_4_TRAVEL.cycleTravelDeg
    + THREE.MathUtils.lerp(a.travelDeg, b.travelDeg, mix);
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
    engine: PRESENTATION_SPATIAL_R1_4.motionAuthority,
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
  presentationPhase = metrics.phase;
  presentationPoseLabel = metrics.poseLabel;
  const before = presentationRig.quaternion.clone();
  presentationRig.quaternion.copy(presentationTargetQuaternion);
  presentationFrameDeltaRad = before.angleTo(presentationRig.quaternion);
  presentationAngularTravelDeg += THREE.MathUtils.radToDeg(presentationFrameDeltaRad);
  lastPresentationQuaternion.copy(presentationRig.quaternion);
}

function seededUnit() {`;
if (!presentationFunctionsPattern.test(source)) throw new Error('R1.4 presentation-functions patch target missing');
source = source.replace(presentationFunctionsPattern, presentationFunctionsR14);

source = source.replace(
  'Geometry R1 + Motion R1.2 frozen. Materials + Lighting R1 ready.',
  'Geometry R1 + Slice Motion R1.2 frozen. Spatial Motion R1.4 confidence flow ready. Materials + Lighting R1 ready.',
);

if (source.includes('PRESENTATION_SPATIAL_R1_2')) throw new Error('R1.4 left stale presentation authority reference');
if (!source.includes("motionAuthority: 'quaternion-confidence-flow-r1.4'")) throw new Error('R1.4 authority missing');
if (!source.includes('const SLICE_R1_2 = Object.freeze({')) throw new Error('R1.4 slice freeze missing');
if (!source.includes("selectedPreset: 'premiumHybrid'")) throw new Error('R1.4 lookdev freeze missing');

const moduleUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
try {
  await import(moduleUrl);
} finally {
  URL.revokeObjectURL(moduleUrl);
}
