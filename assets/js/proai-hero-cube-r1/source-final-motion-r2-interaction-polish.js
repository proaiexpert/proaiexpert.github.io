// ProAI Cube FINAL MOTION R2 — interaction preservation derivative.
// Base product is frozen at 1361e550abd270f168999188eb4e4a8e52c8e23b.
// Scope: compose living autonomous R2 motion with direct pointer/touch deltas.

const baseUrl = new URL('./source-final-motion-r2.js', import.meta.url);
const materialsUrl = new URL('./source-materials-r1.js', import.meta.url);
const glbUrl = new URL('../../models/proai-cube/rubik_39_s_cube_animation.glb', import.meta.url);

const response = await fetch(baseUrl, { cache: 'no-store' });
if (!response.ok) throw new Error(`FINAL MOTION R2 interaction base HTTP ${response.status}`);
let source = await response.text();

const baseSourceMarker = "const sourceUrl = new URL('./source-materials-r1.js', import.meta.url);";
const baseGlbMarker = "const glbUrl = new URL('../../models/proai-cube/rubik_39_s_cube_animation.glb', import.meta.url);";
if (!source.includes(baseSourceMarker) || !source.includes(baseGlbMarker)) {
  throw new Error('FINAL MOTION R2 interaction polish refused unexpected base URL markers');
}
source = source.replace(baseSourceMarker, `const sourceUrl = new URL('${materialsUrl.href}');`);
source = source.replace(baseGlbMarker, `const glbUrl = new URL('${glbUrl.href}');`);

const interactionConfigOld = "  interaction: Object.freeze({\n    dragRadiansPerPixel: 0.0052,\n    resumeGraceMs: 420,\n  }),";
const interactionConfigNew = "  interaction: Object.freeze({\n    dragRadiansPerPixel: 0.0052,\n    activeAutoInfluence: 0.30,\n    resumeGraceMs: 0,\n  }),";
if (!source.includes(interactionConfigOld)) throw new Error('FINAL MOTION R2 interaction config marker missing');
source = source.replace(interactionConfigOld, interactionConfigNew);

const blockedAutonomy = "const autonomyR2 = `function presentationAutonomyBlocked() { return interactionActive; }\nfunction sliceAutonomyBlocked() {\n  return interactionActive || performance.now() - interactionReleaseAtMs < FINAL_MOTION_R2.interaction.resumeGraceMs;\n}\nfunction autonomyBlocked() { return presentationAutonomyBlocked(); }`;";
const livingAutonomy = "const autonomyR2 = `function presentationAutonomyBlocked() { return false; }\nfunction sliceAutonomyBlocked() { return false; }\nfunction autonomyBlocked() { return false; }`;";
if (!source.includes(blockedAutonomy)) throw new Error('FINAL MOTION R2 autonomy marker missing');
source = source.replace(blockedAutonomy, livingAutonomy);

const interactionMotionPattern = /  if \(interactionActive\) \{\n    presentationResumeBlend = 0;[\s\S]*?    presentationTargetVelocity\.copy\(presentationFieldAxis\)\.multiplyScalar\(targetSpeedRad\);\n  \}\n\n  const maxAccel/;
const interactionMotionReplacement = `  const autoInfluence = interactionActive ? FINAL_MOTION_R2.interaction.activeAutoInfluence : 1;
  presentationResumeBlend = autoInfluence;
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
  const targetSpeedRad = THREE.MathUtils.degToRad(targetSpeedDeg) * autoInfluence;
  presentationTargetVelocity.copy(presentationFieldAxis).multiplyScalar(targetSpeedRad);

  const maxAccel`;
if (!interactionMotionPattern.test(source)) throw new Error('FINAL MOTION R2 interaction motion block missing');
source = source.replace(interactionMotionPattern, interactionMotionReplacement);

const frozenRotationGate = "  if (!interactionActive && angularSpeed > 1e-7) {";
if (!source.includes(frozenRotationGate)) throw new Error('FINAL MOTION R2 rotation gate missing');
source = source.replace(frozenRotationGate, "  if (angularSpeed > 1e-7) {");

const pointerPattern = /canvas\.addEventListener\('pointerdown',[\s\S]*?canvas\.addEventListener\('pointercancel', finishDirectInteraction, \{ passive: true \}\);/;
const pointerReplacement = `canvas.addEventListener('pointerdown', (event) => {
  if (!api.ready || prefersReducedMotion || interactionActive || event.isPrimary === false) return;
  interactionActive = true;
  activePointerId = event.pointerId;
  dragLastX = event.clientX;
  dragLastY = event.clientY;
  canvas.style.cursor = 'grabbing';
  canvas.setPointerCapture?.(event.pointerId);
  event.preventDefault();
}, { passive: false });
canvas.addEventListener('pointermove', (event) => {
  if (!interactionActive || event.pointerId !== activePointerId || event.isPrimary === false) return;
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
  const releasedPointerId = activePointerId;
  interactionActive = false;
  interactionReleaseAtMs = performance.now();
  activePointerId = null;
  canvas.style.cursor = 'grab';
  if (releasedPointerId != null && canvas.hasPointerCapture?.(releasedPointerId)) {
    canvas.releasePointerCapture?.(releasedPointerId);
  }
}
canvas.addEventListener('pointerup', finishDirectInteraction, { passive: true });
canvas.addEventListener('pointercancel', finishDirectInteraction, { passive: true });
canvas.addEventListener('lostpointercapture', (event) => {
  if (interactionActive && event.pointerId === activePointerId) finishDirectInteraction(event);
}, { passive: true });`;
if (!pointerPattern.test(source)) throw new Error('FINAL MOTION R2 pointer interaction block missing');
source = source.replace(pointerPattern, pointerReplacement);

source = source.replace(
  "Geometry R1 frozen. FINAL MOTION R2 active. Materials + Lighting R1 frozen.",
  "Geometry R1 frozen. FINAL MOTION R2 interaction polish active. Materials + Lighting R1 frozen.",
);

if (source.includes('return interactionActive || performance.now() - interactionReleaseAtMs')) {
  throw new Error('FINAL MOTION R2 interaction polish left slice blocking active');
}
if (source.includes('if (!interactionActive && angularSpeed > 1e-7)')) {
  throw new Error('FINAL MOTION R2 interaction polish left whole-object freeze gate');
}
if (!source.includes('activeAutoInfluence: 0.30')) {
  throw new Error('FINAL MOTION R2 interaction polish auto influence missing');
}
if (!source.includes("motionAuthority: 'proai-final-motion-r2'")) {
  throw new Error('FINAL MOTION R2 authority missing after interaction polish');
}
if (!source.includes("selectedPreset: 'premiumHybrid'")) {
  throw new Error('FINAL MOTION R2 premiumHybrid look freeze missing after interaction polish');
}

const moduleUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
try {
  await import(moduleUrl);
} finally {
  URL.revokeObjectURL(moduleUrl);
}
