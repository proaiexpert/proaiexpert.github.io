// ProAI Cube FINAL MOTION R2 — single authoritative motion derivative.
// Visual substrate: source-materials-r1.js (geometry/materials/lighting frozen).
// This file does NOT chain R1.3/R1.4. It replaces the complete whole-object + slice + interaction motion layer once.

const sourceUrl = new URL('./source-materials-r1.js', import.meta.url);
const glbUrl = new URL('../../models/proai-cube/rubik_39_s_cube_animation.glb', import.meta.url);

const response = await fetch(sourceUrl, { cache: 'no-store' });
if (!response.ok) throw new Error(`FINAL MOTION R2 base source HTTP ${response.status}`);
let source = await response.text();

const REQUIRED_BASE_MARKERS = [
  "motionAuthority: 'quaternion-editorial-spatial-r1.2-premium'",
  'const SLICE_R1_2 = Object.freeze({',
  "eventPattern: Object.freeze(['single', 'pair', 'single', 'single', 'phrase', 'single', 'pair', 'single', 'single', 'phrase'])",
  'seed: 0x51a7c0de',
  'const PRIMARY_PHRASE = Object.freeze([',
  'const RESOLUTION_PHRASE = Object.freeze(',
  'const CHOREOGRAPHY = Object.freeze([...PRIMARY_PHRASE, ...RESOLUTION_PHRASE]);',
  "selectedPreset: 'premiumHybrid'",
  "const GLB_URL = new URL('./rubik_39_s_cube_animation.glb', import.meta.url).href;",
];
for (const marker of REQUIRED_BASE_MARKERS) {
  if (!source.includes(marker)) throw new Error(`FINAL MOTION R2 refused unexpected frozen base: ${marker}`);
}

source = source.replace(
  "const GLB_URL = new URL('./rubik_39_s_cube_animation.glb', import.meta.url).href;",
  `const GLB_URL = '${glbUrl.href}';`,
);

source = source.replace(
  /const MOTION = Object\.freeze\(\{[\s\S]*?\n\}\);\n\nconst PRESENTATION_R1_2/,
  `const MOTION = Object.freeze({
  turnDurationRangeMs: [900, 1350],
  easing: [0.34, 0.0, 0.16, 1.0],
  orbitDampingFactor: 0.074,
  orbitRotateSpeed: 0.0,
  orbitZoomSpeed: 0.0,
  manualResumeDelayMs: 180,
  manualResumeBlendMs: 2600,
  sliceResumeStaggerMs: 420,
});

const PRESENTATION_R1_2`,
);

const motionConfigPattern = /\/\/ Runtime whole-object presentation authority — R1\.2 premium editorial spatial motion\.\nconst PRESENTATION_SPATIAL_R1_2 = Object\.freeze\(\{[\s\S]*?const CHOREOGRAPHY = Object\.freeze\(\[\.\.\.PRIMARY_PHRASE, \.\.\.RESOLUTION_PHRASE\]\);/;
const motionConfigR2 = `// FINAL MOTION R2 — complete motion authority. Frozen LOOK/GEOMETRY begin below.
const FINAL_MOTION_R2 = Object.freeze({
  motionAuthority: 'proai-final-motion-r2',
  presentation: Object.freeze({
    targetSpeedDegPerSec: Object.freeze({ calm: [8, 13], normal: [13, 19], emphasis: [19, 24] }),
    maxSpeedDegPerSec: 24.5,
    maxAccelDegPerSec2: 18.0,
    maxJerkDegPerSec3: 68.0,
    poseQualitySoft: 0.56,
    poseQualityHard: 0.42,
    poseGuardTrigger: 0.62,
    poseLookaheadSec: 1.0,
    guardSampleDeg: 5.0,
    guardContinuityWeight: 0.12,
    fieldPeriodsSec: Object.freeze([43.7, 67.3, 101.9, 151.1]),
  }),
  slice: Object.freeze({
    turnDurationRangeMs: Object.freeze([900, 1350]),
    microGapRangeMs: Object.freeze([90, 240]),
    normalGapRangeMs: Object.freeze([220, 520]),
    breathingGapRangeMs: Object.freeze([650, 1400]),
    pairStaggerRangeMs: Object.freeze([110, 230]),
    eventWeights: Object.freeze({ single: 0.54, pair: 0.24, phrase: 0.22 }),
    historyWindow: 24,
    inverseBanWindow: 6,
    phraseWindow: 24,
    phraseLengths: Object.freeze([2, 3, 4, 5]),
  }),
  interaction: Object.freeze({
    dragRadiansPerPixel: 0.0052,
    resumeGraceMs: 420,
  }),
});
const PRESENTATION_SPATIAL_R1_2 = FINAL_MOTION_R2.presentation;
const SLICE_R1_2 = FINAL_MOTION_R2.slice;`;
if (!motionConfigPattern.test(source)) throw new Error('FINAL MOTION R2 config patch target missing');
source = source.replace(motionConfigPattern, motionConfigR2);

source = source.replace(
  "let sliceSeed = SLICE_R1_2.seed >>> 0;",
  `const requestedMotionSeed = Number.parseInt(params.get('motionSeed') || '', 10);
const randomMotionSeed = (() => {
  if (Number.isFinite(requestedMotionSeed)) return requestedMotionSeed >>> 0;
  if (globalThis.crypto?.getRandomValues) {
    const value = new Uint32Array(1);
    globalThis.crypto.getRandomValues(value);
    return value[0] >>> 0;
  }
  return ((Date.now() ^ Math.floor(performance.now() * 1000)) >>> 0) || 0x9e3779b9;
})();
let sliceSeed = randomMotionSeed || 0x9e3779b9;`,
);
source = source.replace(
  'let eventsUntilBreath = 4;',
  `let eventsUntilBreath = 3;
let interactionReleaseAtMs = -Infinity;
let presentationVelocity = new THREE.Vector3(0.12, 0.17, 0.08);
let presentationAcceleration = new THREE.Vector3();
let presentationTargetVelocity = new THREE.Vector3();
let presentationLastVelocity = new THREE.Vector3();
let presentationFieldAxis = new THREE.Vector3(0.45, 0.76, 0.46).normalize();
let presentationPoseQuality = 1;
let presentationGuardActive = false;
let presentationSpeedDegPerSec = 0;
let presentationResumeBlend = 1;
let activePointerId = null;
let dragLastX = 0;
let dragLastY = 0;
const sliceHistory = [];
const recentPhraseSignatures = new Map();
const motionEventLog = [];
const sliceCounters = { axis: { X: 0, Y: 0, Z: 0 }, layer: { '-1': 0, '0': 0, '1': 0 }, direction: { '-1': 0, '1': 0 }, kinds: { single: 0, pair: 0, phrase: 0, breath: 0 } };`,
);
source = source.replace("let presentationPhase = PRESENTATION_SPATIAL_R1_2.keyframes[0].motion;", "let presentationPhase = 'continuous';");
source = source.replace("let presentationPoseLabel = PRESENTATION_SPATIAL_R1_2.keyframes[0].label;", "let presentationPoseLabel = 'guarded-3q';");
source = source.replace('  presentationConfig: PRESENTATION_SPATIAL_R1_2,\n  sliceConfig: SLICE_R1_2,', `  presentationConfig: FINAL_MOTION_R2.presentation,
  sliceConfig: FINAL_MOTION_R2.slice,`);
source = source.replace('  runPairedTurnQA,', `  runPairedTurnQA,
  runMotionAudit,
  getMotionLog() { return motionEventLog.map((entry) => ({ ...entry })); },
  getMotionSeed() { return sliceSeed >>> 0; },`);
source = source.replace('window.__PROAI_CUBE_SPATIAL_R1_2 = api;', `window.__PROAI_CUBE_SPATIAL_R1_2 = api;
window.__PROAI_CUBE_FINAL_MOTION_R2 = api;`);

const autonomyStub = `function presentationAutonomyBlocked() {
  return false;
}

function sliceAutonomyBlocked() {
  return false;
}

function autonomyBlocked() {
  return presentationAutonomyBlocked();
}`;
const autonomyR2 = `function presentationAutonomyBlocked() { return interactionActive; }
function sliceAutonomyBlocked() {
  return interactionActive || performance.now() - interactionReleaseAtMs < FINAL_MOTION_R2.interaction.resumeGraceMs;
}
function autonomyBlocked() { return presentationAutonomyBlocked(); }`;
if (!source.includes(autonomyStub)) throw new Error('FINAL MOTION R2 autonomy patch target missing');
source = source.replace(autonomyStub, autonomyR2);

const presentationFunctionsPattern = /function presentationPoseQuaternion\([\s\S]*?\nfunction seededUnit\(\) \{/;
const presentationFunctionsR2 = `const WORLD_X = new THREE.Vector3(1, 0, 0);
const WORLD_Y = new THREE.Vector3(0, 1, 0);
const WORLD_Z = new THREE.Vector3(0, 0, 1);
const motionDeltaQuaternion = new THREE.Quaternion();
const guardTestQuaternion = new THREE.Quaternion();
const guardAxis = new THREE.Vector3();
const viewDirection = new THREE.Vector3();
const basisScratch = new THREE.Vector3();
const fieldScratch = new THREE.Vector3();
const targetAccelScratch = new THREE.Vector3();
const desiredAccelScratch = new THREE.Vector3();
const jerkScratch = new THREE.Vector3();
const dragYawQuaternion = new THREE.Quaternion();
const dragPitchQuaternion = new THREE.Quaternion();
const predictedQuaternion = new THREE.Quaternion();
const predictedDeltaQuaternion = new THREE.Quaternion();
const velocityAxisScratch = new THREE.Vector3();
const guardCandidateAxis = new THREE.Vector3();
const GUARD_AXES = Object.freeze([
  WORLD_X, WORLD_Y, WORLD_Z,
  new THREE.Vector3(1, 1, 0).normalize(),
  new THREE.Vector3(1, 0, 1).normalize(),
  new THREE.Vector3(0, 1, 1).normalize(),
  new THREE.Vector3(1, -1, 0).normalize(),
  new THREE.Vector3(1, 0, -1).normalize(),
  new THREE.Vector3(0, 1, -1).normalize(),
]);

function fieldAtSeconds(timeSec, out = presentationFieldAxis) {
  const p = FINAL_MOTION_R2.presentation.fieldPeriodsSec;
  const tau = Math.PI * 2;
  out.set(
    0.44 + 0.50 * Math.sin(tau * timeSec / p[0] + 0.30) + 0.21 * Math.sin(tau * timeSec / p[3] + 1.70),
    0.48 + 0.46 * Math.sin(tau * timeSec / p[1] + 1.45) + 0.19 * Math.sin(tau * timeSec / p[0] + 2.20),
    0.39 + 0.44 * Math.sin(tau * timeSec / p[2] + 2.55) + 0.18 * Math.sin(tau * timeSec / p[1] + 0.65),
  );
  if (out.lengthSq() < 1e-8) out.set(0.45, 0.74, 0.49);
  return out.normalize();
}

function speedAtSeconds(timeSec) {
  const tau = Math.PI * 2;
  const speed = 16.1
    + 3.15 * Math.sin(tau * timeSec / 37.9 + 0.42)
    + 1.85 * Math.sin(tau * timeSec / 71.3 + 2.08)
    + 0.85 * Math.sin(tau * timeSec / 113.7 + 1.18);
  return THREE.MathUtils.clamp(speed, 8.5, FINAL_MOTION_R2.presentation.maxSpeedDegPerSec);
}

function currentViewDirection(out = viewDirection) {
  const target = controls?.target || cubeCenterLocal;
  return out.copy(camera.position).sub(target).normalize();
}

function poseQualityForQuaternion(quaternion) {
  const view = currentViewDirection();
  const contributions = [WORLD_X, WORLD_Y, WORLD_Z].map((axis) => Math.abs(basisScratch.copy(axis).applyQuaternion(quaternion).dot(view)));
  contributions.sort((a, b) => b - a);
  const [primary, secondary, tertiary] = contributions;
  const dominance = THREE.MathUtils.clamp((primary - 0.73) / 0.24, 0, 1);
  const secondaryLoss = THREE.MathUtils.clamp((0.31 - secondary) / 0.31, 0, 1);
  const tertiaryLoss = THREE.MathUtils.clamp((0.13 - tertiary) / 0.13, 0, 1);
  return THREE.MathUtils.clamp(1 - 0.42 * dominance - 0.43 * secondaryLoss - 0.15 * tertiaryLoss, 0, 1);
}

function bestPoseGuardAxis(quaternion, currentAxis) {
  const step = THREE.MathUtils.degToRad(FINAL_MOTION_R2.presentation.guardSampleDeg);
  const baseScore = poseQualityForQuaternion(quaternion);
  let bestScore = baseScore;
  let bestMerit = -Infinity;
  guardAxis.set(0, 0, 0);
  for (const axis of GUARD_AXES) {
    for (const sign of [-1, 1]) {
      guardCandidateAxis.copy(axis).multiplyScalar(sign);
      motionDeltaQuaternion.setFromAxisAngle(guardCandidateAxis, step);
      guardTestQuaternion.copy(motionDeltaQuaternion).multiply(quaternion).normalize();
      const score = poseQualityForQuaternion(guardTestQuaternion);
      const improvement = score - baseScore;
      if (improvement <= 0.0005) continue;
      const continuity = currentAxis ? guardCandidateAxis.dot(currentAxis) : 0;
      const merit = improvement + FINAL_MOTION_R2.presentation.guardContinuityWeight * continuity;
      if (merit > bestMerit) {
        bestMerit = merit;
        bestScore = score;
        guardAxis.copy(guardCandidateAxis);
      }
    }
  }
  return { axis: guardAxis, score: bestScore };
}

function clampVectorLength(vector, maxLength) {
  const length = vector.length();
  if (length > maxLength && length > 1e-9) vector.multiplyScalar(maxLength / length);
  return vector;
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
  if (sinHalf > 1e-7) presentationAxis.set(presentationRelativeQuaternion.x / sinHalf, presentationRelativeQuaternion.y / sinHalf, presentationRelativeQuaternion.z / sinHalf).normalize();
  else presentationAxis.copy(presentationFieldAxis);
  return { axis: presentationAxis.clone(), angleRad, angleDeg: THREE.MathUtils.radToDeg(angleRad), speedDegPerSec: THREE.MathUtils.radToDeg(angleRad) / Math.max(1e-6, durationSec) };
}

function spatialDominantAxis(axis) {
  const components = [Math.abs(axis.x), Math.abs(axis.y), Math.abs(axis.z)];
  return AXES[components.indexOf(Math.max(...components))];
}

function getReviewPresentationSample(timeSec = presentationSimTimeMs / 1000) {
  const field = fieldAtSeconds(Math.max(0, timeSec), fieldScratch);
  const speed = speedAtSeconds(Math.max(0, timeSec));
  const euler = new THREE.Euler().setFromQuaternion(presentationRig.quaternion, 'YXZ');
  return {
    timeSec,
    signedYawDeg: THREE.MathUtils.radToDeg(euler.y),
    cumulativeYawDeg: presentationAngularTravelDeg,
    velocityDegPerSec: presentationSpeedDegPerSec || speed,
    targetVelocityDegPerSec: speed,
    pitchDeg: THREE.MathUtils.radToDeg(euler.x),
    rollDeg: THREE.MathUtils.radToDeg(euler.z),
    angularTravelDeg: presentationAngularTravelDeg,
    dominantAxis: spatialDominantAxis(presentationVelocity.lengthSq() > 1e-8 ? presentationVelocity.clone().normalize() : field),
    rotationAxis: (presentationVelocity.lengthSq() > 1e-8 ? presentationVelocity.clone().normalize() : field.clone()).toArray(),
    targetAxis: field.toArray(),
    phase: presentationPhase,
    poseLabel: presentationPoseLabel,
    poseQuality: presentationPoseQuality,
    guardActive: presentationGuardActive,
    engine: FINAL_MOTION_R2.motionAuthority,
  };
}

function updatePresentationMotion(now) {
  if (!api.ready || captureMode || prefersReducedMotion) return;
  if (!presentationLastNow) {
    presentationLastNow = now;
    lastPresentationQuaternion.copy(presentationRig.quaternion);
    return;
  }
  const deltaMs = Math.min(50, Math.max(0, now - presentationLastNow));
  presentationLastNow = now;
  const dt = Math.max(1e-4, deltaMs / 1000);
  presentationSimTimeMs += deltaMs;

  if (interactionActive) {
    presentationResumeBlend = 0;
    presentationTargetVelocity.set(0, 0, 0);
  } else {
    const sinceRelease = now - interactionReleaseAtMs;
    const resumeT = THREE.MathUtils.clamp((sinceRelease - FINAL_MOTION_R2.interaction.resumeGraceMs) / MOTION.manualResumeBlendMs, 0, 1);
    presentationResumeBlend = smoothstep(resumeT);
    fieldAtSeconds(presentationSimTimeMs / 1000, presentationFieldAxis);
    presentationPoseQuality = poseQualityForQuaternion(presentationRig.quaternion);
    const currentAxis = presentationVelocity.lengthSq() > 1e-8
      ? velocityAxisScratch.copy(presentationVelocity).normalize()
      : velocityAxisScratch.copy(presentationFieldAxis);
    if (presentationFieldAxis.dot(currentAxis) < 0) presentationFieldAxis.negate();

    let targetSpeedDeg = speedAtSeconds(presentationSimTimeMs / 1000);
    const lookaheadRad = THREE.MathUtils.degToRad(targetSpeedDeg) * FINAL_MOTION_R2.presentation.poseLookaheadSec;
    predictedDeltaQuaternion.setFromAxisAngle(presentationFieldAxis, lookaheadRad);
    predictedQuaternion.copy(predictedDeltaQuaternion).multiply(presentationRig.quaternion).normalize();
    const predictedQuality = poseQualityForQuaternion(predictedQuaternion);
    const guardReference = predictedQuality < presentationPoseQuality ? predictedQuaternion : presentationRig.quaternion;
    const guard = bestPoseGuardAxis(guardReference, currentAxis);
    const guardMetric = Math.min(presentationPoseQuality, predictedQuality);
    presentationGuardActive = (predictedQuality < FINAL_MOTION_R2.presentation.poseGuardTrigger
      || presentationPoseQuality < FINAL_MOTION_R2.presentation.poseQualitySoft)
      && guard.axis.lengthSq() > 0;
    if (presentationGuardActive) {
      const severity = THREE.MathUtils.clamp(
        (FINAL_MOTION_R2.presentation.poseGuardTrigger - guardMetric)
          / (FINAL_MOTION_R2.presentation.poseGuardTrigger - FINAL_MOTION_R2.presentation.poseQualityHard),
        0,
        1,
      );
      const guardWeight = Math.min(0.95, 0.78 + 0.15 * severity);
      presentationFieldAxis.lerp(guard.axis, guardWeight).normalize();
      if (guardMetric < FINAL_MOTION_R2.presentation.poseQualityHard) targetSpeedDeg = Math.min(targetSpeedDeg, 12);
    }
    const targetSpeedRad = THREE.MathUtils.degToRad(targetSpeedDeg) * presentationResumeBlend;
    presentationTargetVelocity.copy(presentationFieldAxis).multiplyScalar(targetSpeedRad);
  }

  const maxAccel = THREE.MathUtils.degToRad(FINAL_MOTION_R2.presentation.maxAccelDegPerSec2);
  const maxJerk = THREE.MathUtils.degToRad(FINAL_MOTION_R2.presentation.maxJerkDegPerSec3);
  desiredAccelScratch.copy(presentationTargetVelocity).sub(presentationVelocity).divideScalar(dt);
  clampVectorLength(desiredAccelScratch, maxAccel);
  jerkScratch.copy(desiredAccelScratch).sub(presentationAcceleration);
  clampVectorLength(jerkScratch, maxJerk * dt);
  presentationAcceleration.add(jerkScratch);
  clampVectorLength(presentationAcceleration, maxAccel);
  presentationLastVelocity.copy(presentationVelocity);
  presentationVelocity.addScaledVector(presentationAcceleration, dt);

  const maxSpeedRad = THREE.MathUtils.degToRad(FINAL_MOTION_R2.presentation.maxSpeedDegPerSec);
  clampVectorLength(presentationVelocity, maxSpeedRad);
  const angularSpeed = presentationVelocity.length();
  presentationSpeedDegPerSec = THREE.MathUtils.radToDeg(angularSpeed);
  presentationAngularVelocityDegPerSec = presentationSpeedDegPerSec;
  presentationPhase = presentationSpeedDegPerSec < 12 ? 'calm' : presentationSpeedDegPerSec > 19 ? 'emphasis' : 'normal';
  presentationPoseLabel = presentationGuardActive ? 'guarded-3q' : 'living-3q';

  if (!interactionActive && angularSpeed > 1e-7) {
    motionDeltaQuaternion.setFromAxisAngle(presentationVelocity.clone().normalize(), angularSpeed * dt);
    const before = presentationRig.quaternion.clone();
    presentationRig.quaternion.premultiply(motionDeltaQuaternion).normalize();
    presentationFrameDeltaRad = before.angleTo(presentationRig.quaternion);
    presentationAngularTravelDeg += THREE.MathUtils.radToDeg(presentationFrameDeltaRad);
    lastPresentationQuaternion.copy(presentationRig.quaternion);
  } else {
    presentationFrameDeltaRad = 0;
  }
}

function seededUnit() {`;
if (!presentationFunctionsPattern.test(source)) throw new Error('FINAL MOTION R2 presentation patch target missing');
source = source.replace(presentationFunctionsPattern, presentationFunctionsR2);

const schedulerPattern = /function seededUnit\(\) \{[\s\S]*?controls\.addEventListener\('end', \(\) => \{\n  interactionActive = false;\n\}\);/;
const schedulerR2 = `function seededUnit() {
  let x = sliceSeed >>> 0;
  x ^= (x << 13) >>> 0;
  x ^= x >>> 17;
  x ^= (x << 5) >>> 0;
  sliceSeed = x >>> 0;
  return sliceSeed / 4294967296;
}

function seededRange(min, max) { return min + (max - min) * seededUnit(); }
function seededInt(min, maxInclusive) { return Math.floor(seededRange(min, maxInclusive + 1)); }
function chooseWeighted(items, weightFn, randomFn = seededUnit) {
  const weighted = items.map((item) => ({ item, weight: Math.max(0, weightFn(item)) }));
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  if (total <= 1e-9) return null;
  let cursor = randomFn() * total;
  for (const entry of weighted) {
    cursor -= entry.weight;
    if (cursor <= 0) return entry.item;
  }
  return weighted.at(-1)?.item || null;
}

function moveKey(move) { return move.axis + ':' + move.layer + ':' + (move.direction > 0 ? '+' : '-'); }
function layerKey(move) { return move.axis + ':' + move.layer; }
function inverseKey(move) { return move.axis + ':' + move.layer + ':' + (move.direction > 0 ? '-' : '+'); }
function mirrorMove(move) { return { ...move, layer: -move.layer }; }
function invertMove(move) { return { ...move, direction: -move.direction }; }
function sequenceKey(sequence) { return sequence.map(moveKey).join('>'); }
function mirroredSequenceKey(sequence) { return sequenceKey(sequence.map(mirrorMove)); }
function invertedSequenceKey(sequence) { return sequenceKey(sequence.map(invertMove)); }
function mirroredInvertedSequenceKey(sequence) { return sequenceKey(sequence.map((move) => invertMove(mirrorMove(move)))); }

function recentCount(window, predicate) { return window.reduce((count, move) => count + (predicate(move) ? 1 : 0), 0); }
function sequenceAlreadyRecent(history, candidate) {
  const extended = [...history, candidate];
  for (const length of FINAL_MOTION_R2.slice.phraseLengths) {
    if (extended.length < length) continue;
    const tail = extended.slice(-length);
    const variants = new Set([sequenceKey(tail), mirroredSequenceKey(tail), invertedSequenceKey(tail), mirroredInvertedSequenceKey(tail)]);
    const start = Math.max(0, history.length - FINAL_MOTION_R2.slice.phraseWindow - length);
    for (let i = start; i <= history.length - length; i += 1) {
      const prior = history.slice(i, i + length);
      if (variants.has(sequenceKey(prior))) return true;
    }
  }
  return false;
}

function currentWholeSpeedNormalized() {
  return THREE.MathUtils.clamp((presentationSpeedDegPerSec - 8) / 16, 0, 1);
}

function layerVisibilityScore(move) {
  const view = currentViewDirection();
  const localAxis = move.axis === 'X' ? WORLD_X : move.axis === 'Y' ? WORLD_Y : WORLD_Z;
  const normal = basisScratch.copy(localAxis).applyQuaternion(presentationRig.quaternion).normalize();
  const signed = normal.dot(view) * (move.layer || 1);
  const edge = 1 - Math.abs(normal.dot(view));
  if (move.layer === 0) return THREE.MathUtils.clamp(0.48 + 0.42 * edge, 0.25, 0.95);
  return THREE.MathUtils.clamp(0.30 + 0.62 * Math.max(0, signed) + 0.24 * edge, 0.18, 1.15);
}

function candidateMoveWeight(move, history = sliceHistory, neutralVisibility = false) {
  const last = history.at(-1);
  if (last && moveKey(last) === moveKey(move)) return 0;
  if (last && inverseKey(last) === moveKey(move)) return 0;
  const inverseWindow = history.slice(-FINAL_MOTION_R2.slice.inverseBanWindow);
  if (inverseWindow.some((entry) => inverseKey(entry) === moveKey(move))) return 0;
  if (sequenceAlreadyRecent(history, move)) return 0;

  const recent4 = history.slice(-4);
  const recent8 = history.slice(-8);
  const recent24 = history.slice(-24);
  const sameLayer4 = recentCount(recent4, (entry) => layerKey(entry) === layerKey(move));
  const sameLayer8 = recentCount(recent8, (entry) => layerKey(entry) === layerKey(move));
  const axis8 = recentCount(recent8, (entry) => entry.axis === move.axis);
  const direction8 = recentCount(recent8, (entry) => entry.direction === move.direction);
  const direction24 = recentCount(recent24, (entry) => entry.direction === move.direction);
  const axis24 = recentCount(recent24, (entry) => entry.axis === move.axis);
  const layer24 = recentCount(recent24, (entry) => layerKey(entry) === layerKey(move));

  if (sameLayer4 >= 2) return 0;
  let weight = 1;
  weight *= Math.pow(0.52, sameLayer8);
  weight *= Math.pow(0.76, axis8);
  weight *= Math.pow(0.86, direction8);
  weight *= Math.pow(0.86, Math.max(0, direction24 - 12));
  weight *= 1 / (1 + Math.max(0, axis24 - 8) * 0.18);
  weight *= 1 / (1 + Math.max(0, layer24 - 4) * 0.25);
  if (move.layer === 0) weight *= 1.03; else weight *= 0.96;
  if (!neutralVisibility) weight *= 0.55 + 0.65 * layerVisibilityScore(move);

  if (!neutralVisibility && presentationVelocity.lengthSq() > 1e-8) {
    const axisVector = move.axis === 'X' ? WORLD_X : move.axis === 'Y' ? WORLD_Y : WORLD_Z;
    const alignment = Math.abs(axisVector.dot(presentationVelocity.clone().normalize()));
    if (alignment > 0.78 && move.direction === Math.sign(axisVector.dot(presentationVelocity))) weight *= 0.78;
  }
  return Math.max(0, weight);
}

function chooseMove({ history = sliceHistory, neutralVisibility = false } = {}) {
  const candidates = [];
  for (const axis of AXES) for (const layer of LAYERS) for (const direction of [-1, 1]) candidates.push({ axis, layer, direction });
  let move = chooseWeighted(candidates, (candidate) => candidateMoveWeight(candidate, history, neutralVisibility));
  if (!move) {
    const last = history.at(-1);
    move = candidates.find((candidate) => !last || (moveKey(candidate) !== moveKey(last) && moveKey(candidate) !== inverseKey(last))) || candidates[0];
  }
  return { ...move, durationMs: Math.round(seededRange(...FINAL_MOTION_R2.slice.turnDurationRangeMs)) };
}

function rememberMove(move, kind, eventId) {
  const entry = { axis: move.axis, layer: move.layer, direction: move.direction, kind, eventId, atMs: performance.now(), durationMs: move.durationMs };
  sliceHistory.push(entry);
  if (sliceHistory.length > 96) sliceHistory.splice(0, sliceHistory.length - 96);
  sliceCounters.axis[move.axis] += 1;
  sliceCounters.layer[String(move.layer)] += 1;
  sliceCounters.direction[String(move.direction)] += 1;
  motionEventLog.push(entry);
  if (motionEventLog.length > 600) motionEventLog.splice(0, motionEventLog.length - 600);
  for (const length of FINAL_MOTION_R2.slice.phraseLengths) {
    if (sliceHistory.length >= length) recentPhraseSignatures.set(sequenceKey(sliceHistory.slice(-length)), sliceEventSerial);
  }
}

function recentCompletedEventKinds(limit = 6) {
  const kinds = [];
  const seen = new Set();
  for (let index = motionEventLog.length - 1; index >= 0 && kinds.length < limit; index -= 1) {
    const entry = motionEventLog[index];
    if (!entry?.axis || seen.has(entry.eventId)) continue;
    seen.add(entry.eventId);
    kinds.push(entry.kind);
  }
  return kinds;
}

function eventStarvationBoost(kind, recentEvents) {
  const index = recentEvents.indexOf(kind);
  const gap = index < 0 ? recentEvents.length + 1 : index;
  if (gap >= 4) return kind === 'pair' ? 5.5 : 4.6;
  if (gap >= 3) return kind === 'pair' ? 3.2 : 2.8;
  if (gap >= 2) return 1.65;
  return 1;
}

function eventWeights() {
  const base = FINAL_MOTION_R2.slice.eventWeights;
  const speed = currentWholeSpeedNormalized();
  const readable = THREE.MathUtils.clamp((presentationPoseQuality - 0.42) / 0.42, 0, 1);
  const recentMoves = motionEventLog.slice(-8).map((entry) => entry.kind);
  const recentEvents = recentCompletedEventKinds(6);
  return {
    single: base.single * (0.95 + 0.40 * speed) * (recentMoves.at(-1) === 'single' ? 0.88 : 1),
    pair: base.pair * (1.18 - 0.55 * speed) * (0.72 + 0.55 * readable)
      * (recentMoves.includes('pair') ? 0.86 : 1) * eventStarvationBoost('pair', recentEvents),
    phrase: base.phrase * (1.22 - 0.62 * speed) * (0.66 + 0.62 * readable)
      * (recentMoves.includes('phrase') ? 0.82 : 1) * eventStarvationBoost('phrase', recentEvents),
  };
}

function chooseEventType() {
  const weights = eventWeights();
  return chooseWeighted(['single', 'pair', 'phrase'], (kind) => weights[kind]) || 'single';
}

async function waitForSliceAutonomy() {
  while (sliceSchedulerEnabled && sliceAutonomyBlocked()) await sleep(32);
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

async function runSingleScheduledEvent(eventId) {
  if (!await waitForSliceAutonomy()) return false;
  const move = chooseMove();
  const result = await turnSlice(move);
  if (result) rememberMove(move, 'single', eventId);
  return Boolean(result);
}

function pairCompatibility(first, second) {
  if (first.axis === second.axis && first.layer !== second.layer) return { simultaneous: true, score: Math.abs(first.layer - second.layer) === 2 ? 1.25 : 0.72 };
  if (first.axis !== second.axis) return { simultaneous: false, score: 1.10 };
  return { simultaneous: false, score: 0 };
}

async function runPairedScheduledEvent(eventId) {
  if (!await waitForSliceAutonomy()) return false;
  const first = chooseMove();
  const provisionalHistory = [...sliceHistory, first];
  const secondCandidates = [];
  for (const axis of AXES) for (const layer of LAYERS) for (const direction of [-1, 1]) {
    const candidate = { axis, layer, direction };
    const compatibility = pairCompatibility(first, candidate);
    if (compatibility.score <= 0) continue;
    let weight = candidateMoveWeight(candidate, provisionalHistory) * compatibility.score;
    if (first.axis === candidate.axis && first.layer !== candidate.layer && first.direction === candidate.direction) weight *= 0.28;
    if (first.axis === candidate.axis && Math.abs(first.layer - candidate.layer) === 1) weight *= 0.48;
    secondCandidates.push({ ...candidate, _weight: weight, _simultaneous: compatibility.simultaneous });
  }
  const secondBase = chooseWeighted(secondCandidates, (candidate) => candidate._weight) || chooseMove({ history: provisionalHistory });
  const second = { axis: secondBase.axis, layer: secondBase.layer, direction: secondBase.direction, durationMs: Math.round(seededRange(...FINAL_MOTION_R2.slice.turnDurationRangeMs)) };
  const simultaneous = Boolean(secondBase._simultaneous);
  if (simultaneous) {
    const firstPromise = turnSlice(first);
    await sleep(Math.round(seededRange(...FINAL_MOTION_R2.slice.pairStaggerRangeMs)));
    const secondPromise = turnSlice(second);
    const [a, b] = await Promise.all([firstPromise, secondPromise]);
    if (a) rememberMove(first, 'pair', eventId);
    if (b) rememberMove(second, 'pair', eventId);
    return Boolean(a || b);
  }
  const a = await turnSlice(first);
  if (a) rememberMove(first, 'pair', eventId);
  await schedulerDelay(Math.round(seededRange(...FINAL_MOTION_R2.slice.microGapRangeMs)));
  if (!await waitForSliceAutonomy()) return Boolean(a);
  const b = await turnSlice(second);
  if (b) rememberMove(second, 'pair', eventId);
  return Boolean(a || b);
}

async function runPhraseScheduledEvent(eventId) {
  const roll = seededUnit();
  const phraseLength = roll < 0.48 ? 2 : roll < 0.82 ? 3 : 4;
  let completed = false;
  for (let index = 0; index < phraseLength; index += 1) {
    if (!await waitForSliceAutonomy()) return completed;
    const move = chooseMove();
    const durationScale = index === 0 ? seededRange(0.96, 1.05) : index === phraseLength - 1 ? seededRange(1.02, 1.12) : seededRange(0.90, 1.02);
    move.durationMs = Math.round(move.durationMs * durationScale);
    const result = await turnSlice(move);
    if (result) { rememberMove(move, 'phrase', eventId); completed = true; }
    if (index < phraseLength - 1) await schedulerDelay(Math.round(seededRange(...FINAL_MOTION_R2.slice.microGapRangeMs)));
  }
  return completed;
}

async function sliceSchedulerLoop() {
  if (sliceSchedulerRunning) return;
  sliceSchedulerRunning = true;
  await schedulerDelay(Math.round(seededRange(360, 760)));
  while (sliceSchedulerEnabled) {
    if (!await waitForSliceAutonomy()) break;
    const eventId = ++sliceEventSerial;
    const eventType = chooseEventType();
    let completed = false;
    if (eventType === 'pair') completed = await runPairedScheduledEvent(eventId);
    else if (eventType === 'phrase') completed = await runPhraseScheduledEvent(eventId);
    else completed = await runSingleScheduledEvent(eventId);
    if (completed) sliceCounters.kinds[eventType] += 1;
    if (!sliceSchedulerEnabled) break;

    eventsUntilBreath -= 1;
    const forceBreath = eventsUntilBreath <= 0 || currentWholeSpeedNormalized() > 0.82;
    if (forceBreath) {
      sliceCounters.kinds.breath += 1;
      motionEventLog.push({ kind: 'breath', eventId, atMs: performance.now() });
      await schedulerDelay(Math.round(seededRange(...FINAL_MOTION_R2.slice.breathingGapRangeMs)));
      eventsUntilBreath = seededInt(2, 5);
    } else {
      await schedulerDelay(Math.round(seededRange(...FINAL_MOTION_R2.slice.normalGapRangeMs)));
    }
  }
  sliceSchedulerRunning = false;
}

function makeLocalRng(seed) {
  let state = (seed >>> 0) || 0x9e3779b9;
  return () => {
    let x = state >>> 0;
    x ^= (x << 13) >>> 0; x ^= x >>> 17; x ^= (x << 5) >>> 0;
    state = x >>> 0;
    return state / 4294967296;
  };
}

function chooseMoveOffline(history, rng) {
  const candidates = [];
  for (const axis of AXES) for (const layer of LAYERS) for (const direction of [-1, 1]) candidates.push({ axis, layer, direction });
  return chooseWeighted(candidates, (candidate) => candidateMoveWeight(candidate, history, true), rng)
    || candidates.find((candidate) => !history.length || (moveKey(candidate) !== moveKey(history.at(-1)) && moveKey(candidate) !== inverseKey(history.at(-1))))
    || candidates[0];
}

function auditSequence(seed, moveCount = 240) {
  const rng = makeLocalRng(seed);
  const history = [];
  const counts = { axis: { X: 0, Y: 0, Z: 0 }, layer: {}, direction: { '-1': 0, '1': 0 } };
  let immediateInverse = 0;
  let shortInverse = 0;
  let exactRepeat = 0;
  const phraseRepeats = { 2: 0, 3: 0, 4: 0, 5: 0 };
  const phraseRepeatMinDistance = { 2: Infinity, 3: Infinity, 4: Infinity, 5: Infinity };
  const lastSeen = { 2: new Map(), 3: new Map(), 4: new Map(), 5: new Map() };
  for (let i = 0; i < moveCount; i += 1) {
    const move = chooseMoveOffline(history, rng);
    const last = history.at(-1);
    if (last && moveKey(move) === moveKey(last)) exactRepeat += 1;
    if (last && moveKey(move) === inverseKey(last)) immediateInverse += 1;
    if (history.slice(-FINAL_MOTION_R2.slice.inverseBanWindow).some((entry) => moveKey(move) === inverseKey(entry))) shortInverse += 1;
    history.push({ ...move });
    counts.axis[move.axis] += 1;
    counts.layer[layerKey(move)] = (counts.layer[layerKey(move)] || 0) + 1;
    counts.direction[String(move.direction)] += 1;
    for (const length of FINAL_MOTION_R2.slice.phraseLengths) {
      if (history.length < length) continue;
      const signature = sequenceKey(history.slice(-length));
      const priorIndex = lastSeen[length].get(signature);
      if (priorIndex != null) {
        const distance = i - priorIndex;
        phraseRepeatMinDistance[length] = Math.min(phraseRepeatMinDistance[length], distance);
        if (distance <= FINAL_MOTION_R2.slice.phraseWindow) phraseRepeats[length] += 1;
      }
      lastSeen[length].set(signature, i);
    }
  }
  const axisValues = Object.values(counts.axis);
  const directionValues = Object.values(counts.direction);
  const axisSpread = (Math.max(...axisValues) - Math.min(...axisValues)) / moveCount;
  const directionSpread = Math.abs(directionValues[0] - directionValues[1]) / moveCount;
  return {
    seed: seed >>> 0,
    moveCount,
    exactRepeat,
    immediateInverse,
    shortInverse,
    phraseRepeats,
    phraseRepeatMinDistance: Object.fromEntries(Object.entries(phraseRepeatMinDistance).map(([length, value]) => [length, Number.isFinite(value) ? value : null])),
    counts,
    axisSpread,
    directionSpread,
    pass: exactRepeat === 0 && immediateInverse === 0 && shortInverse === 0 && phraseRepeats[2] === 0 && phraseRepeats[3] === 0 && axisSpread <= 0.12 && directionSpread <= 0.12,
    sequence: history.map(moveKey),
  };
}

function runMotionAudit({ seeds = [142857, 271828, 314159], minutes = 5, estimatedMovesPerMinute = 42 } = {}) {
  const moveCount = Math.max(180, Math.round(minutes * estimatedMovesPerMinute));
  const seedReports = seeds.map((seed) => auditSequence(seed, moveCount));
  return { authority: FINAL_MOTION_R2.motionAuthority, generatedAt: new Date().toISOString(), minutes, moveCountPerSeed: moveCount, seeds: seedReports, pass: seedReports.every((report) => report.pass) };
}

function getInteractionState() {
  return {
    interactionActive,
    autonomyBlocked: presentationAutonomyBlocked(),
    sliceAutonomyBlocked: sliceAutonomyBlocked(),
    resumeDelayRemainingMs: Math.max(0, FINAL_MOTION_R2.interaction.resumeGraceMs - (performance.now() - interactionReleaseAtMs)),
    sliceResumeDelayRemainingMs: Math.max(0, FINAL_MOTION_R2.interaction.resumeGraceMs - (performance.now() - interactionReleaseAtMs)),
    presentationResumeActive: !interactionActive && presentationResumeBlend < 0.999,
    presentationResumeBlend,
    presentationSimTimeMs,
    sliceEventSerial,
    activeTurnCount: activeTurns.size,
    activeTurnProgress: activeTurnList().map((turn) => ({ id: turn.id, linear: turn.linear, eased: turn.eased })),
    cameraPosition: camera.position.toArray(),
    presentationQuaternion: presentationRig.quaternion.toArray(),
    angularVelocityDegPerSec: presentationSpeedDegPerSec,
  };
}

controls.enableRotate = false;
controls.enableZoom = false;
canvas.style.cursor = 'grab';
canvas.addEventListener('pointerdown', (event) => {
  if (!api.ready || prefersReducedMotion) return;
  interactionActive = true;
  activePointerId = event.pointerId;
  dragLastX = event.clientX;
  dragLastY = event.clientY;
  frozenPresentationQuaternion.copy(presentationRig.quaternion);
  presentationResumeBlend = 0;
  presentationTargetVelocity.set(0, 0, 0);
  canvas.style.cursor = 'grabbing';
  canvas.setPointerCapture?.(event.pointerId);
  event.preventDefault();
}, { passive: false });
canvas.addEventListener('pointermove', (event) => {
  if (!interactionActive || event.pointerId !== activePointerId) return;
  const dx = event.clientX - dragLastX;
  const dy = event.clientY - dragLastY;
  dragLastX = event.clientX;
  dragLastY = event.clientY;
  const scale = FINAL_MOTION_R2.interaction.dragRadiansPerPixel;
  dragYawQuaternion.setFromAxisAngle(WORLD_Y, dx * scale);
  dragPitchQuaternion.setFromAxisAngle(WORLD_X, dy * scale);
  presentationRig.quaternion.premultiply(dragYawQuaternion).multiply(dragPitchQuaternion).normalize();
  presentationPoseQuality = poseQualityForQuaternion(presentationRig.quaternion);
  event.preventDefault();
}, { passive: false });
function finishDirectInteraction(event) {
  if (!interactionActive || (event?.pointerId != null && event.pointerId !== activePointerId)) return;
  interactionActive = false;
  interactionReleaseAtMs = performance.now();
  activePointerId = null;
  presentationVelocity.set(0, 0, 0);
  presentationAcceleration.set(0, 0, 0);
  presentationTargetVelocity.set(0, 0, 0);
  presentationResumeBlend = 0;
  canvas.style.cursor = 'grab';
  if (event?.pointerId != null) canvas.releasePointerCapture?.(event.pointerId);
}
canvas.addEventListener('pointerup', finishDirectInteraction, { passive: true });
canvas.addEventListener('pointercancel', finishDirectInteraction, { passive: true });`;
if (!schedulerPattern.test(source)) throw new Error('FINAL MOTION R2 scheduler/interaction patch target missing');
source = source.replace(schedulerPattern, schedulerR2);

source = source.replace(
  /function setReviewPresentation\(timeSec = 0, resumeProgress = 1, renderFrame = true\) \{[\s\S]*?\n\}/,
  `function setReviewPresentation(timeSec = 0, resumeProgress = 1, renderFrame = true) {
  if (!captureMode || !api.ready) return false;
  presentationSimTimeMs = Math.max(0, timeSec) * 1000;
  const sample = getReviewPresentationSample(timeSec);
  presentationResumeBlend = THREE.MathUtils.clamp(resumeProgress, 0, 1);
  if (renderFrame) renderReviewFrame();
  return { ...sample, quaternion: presentationRig.quaternion.toArray() };
}`,
);

source = source.replaceAll('presentationConfig: PRESENTATION_SPATIAL_R1_2', 'presentationConfig: FINAL_MOTION_R2.presentation');
source = source.replaceAll('sliceConfig: SLICE_R1_2', 'sliceConfig: FINAL_MOTION_R2.slice');
source = source.replaceAll('engine: PRESENTATION_SPATIAL_R1_2.motionAuthority', 'engine: FINAL_MOTION_R2.motionAuthority');
source = source.replace('    eventsUntilBreath,', `    eventsUntilBreath,
      seed: sliceSeed >>> 0,
      requestedSeed: Number.isFinite(requestedMotionSeed) ? requestedMotionSeed >>> 0 : null,
      history: sliceHistory.slice(-24).map((move) => ({ ...move })),
      counts: JSON.parse(JSON.stringify(sliceCounters)),`);
source = source.replace('    phase: presentationPhase,\n    poseLabel: presentationPoseLabel,', `    phase: presentationPhase,
    poseLabel: presentationPoseLabel,
    poseQuality: presentationPoseQuality,
    guardActive: presentationGuardActive,
    resumeBlend: presentationResumeBlend,`);
source = source.replace('Geometry R1 + Motion R1.2 frozen. Materials + Lighting R1 ready.', 'Geometry R1 frozen. FINAL MOTION R2 active. Materials + Lighting R1 frozen.');

if (source.includes('const PRIMARY_PHRASE = Object.freeze([')) throw new Error('FINAL MOTION R2 left PRIMARY_PHRASE authority');
if (source.includes('const RESOLUTION_PHRASE = Object.freeze(')) throw new Error('FINAL MOTION R2 left RESOLUTION_PHRASE authority');
if (source.includes('eventPattern: Object.freeze')) throw new Error('FINAL MOTION R2 left fixed eventPattern');
if (!source.includes("motionAuthority: 'proai-final-motion-r2'")) throw new Error('FINAL MOTION R2 authority missing');
if (!source.includes("selectedPreset: 'premiumHybrid'")) throw new Error('FINAL MOTION R2 look freeze missing');
if (!source.includes('window.__PROAI_CUBE_FINAL_MOTION_R2 = api;')) throw new Error('FINAL MOTION R2 API alias missing');

const moduleUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
try {
  await import(moduleUrl);
} finally {
  URL.revokeObjectURL(moduleUrl);
}
