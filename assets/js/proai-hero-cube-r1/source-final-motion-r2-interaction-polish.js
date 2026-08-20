// ProAI Cube FINAL MOTION R2 — interaction preservation derivative.
// Base product is frozen at source-final-motion-r2.js. This derivative changes only
// direct interaction composition: autonomous whole-object life and procedural slices
// remain alive while the user drags, with no release reset or dead window.

const baseR2Url = new URL('./source-final-motion-r2.js', import.meta.url);
const materialsUrl = new URL('./source-materials-r1.js', import.meta.url);
const glbUrl = new URL('../../models/proai-cube/rubik_39_s_cube_animation.glb', import.meta.url);

const response = await fetch(baseR2Url, { cache: 'no-store' });
if (!response.ok) throw new Error(`FINAL MOTION R2 interaction base HTTP ${response.status}`);
let source = await response.text();

function replaceOnce(oldValue, newValue, label) {
  const count = source.split(oldValue).length - 1;
  if (count !== 1) throw new Error(`FINAL MOTION R2 interaction polish refused ${label}: ${count} matches`);
  source = source.replace(oldValue, newValue);
}

// The base patcher is imported from a Blob below, so preserve its relative resource
// semantics by pinning the two URLs before evaluating it.
replaceOnce(
  "const sourceUrl = new URL('./source-materials-r1.js', import.meta.url);",
  `const sourceUrl = new URL('${materialsUrl.href}');`,
  'materials URL',
);
replaceOnce(
  "const glbUrl = new URL('../../models/proai-cube/rubik_39_s_cube_animation.glb', import.meta.url);",
  `const glbUrl = new URL('${glbUrl.href}');`,
  'GLB URL',
);

// Keep the proven R2 drag sensitivity. Add a bounded living-auto contribution and
// remove the post-release grace period that previously stalled slice autonomy.
replaceOnce(
  "    dragRadiansPerPixel: 0.0052,\n    resumeGraceMs: 420,",
  "    dragRadiansPerPixel: 0.0052,\n    activeAutoInfluence: 0.30,\n    resumeGraceMs: 0,",
  'interaction config',
);

replaceOnce(
  `const autonomyR2 = \`function presentationAutonomyBlocked() { return interactionActive; }
function sliceAutonomyBlocked() {
  return interactionActive || performance.now() - interactionReleaseAtMs < FINAL_MOTION_R2.interaction.resumeGraceMs;
}
function autonomyBlocked() { return presentationAutonomyBlocked(); }\`;`,
  `const autonomyR2 = \`function presentationAutonomyBlocked() { return false; }
function sliceAutonomyBlocked() { return false; }
function autonomyBlocked() { return false; }\`;`,
  'autonomy composition',
);

// Preserve the full R2 simulation state during direct manipulation. The simulation
// keeps evolving at full fidelity; only its visible orientation contribution is
// smoothly attenuated while held so manual control dominates without killing life.
replaceOnce(
  `  if (interactionActive) {
    presentationResumeBlend = 0;
    presentationTargetVelocity.set(0, 0, 0);
  } else {
    const sinceRelease = now - interactionReleaseAtMs;
    const resumeT = THREE.MathUtils.clamp((sinceRelease - FINAL_MOTION_R2.interaction.resumeGraceMs) / MOTION.manualResumeBlendMs, 0, 1);
    presentationResumeBlend = smoothstep(resumeT);
    fieldAtSeconds(presentationSimTimeMs / 1000, presentationFieldAxis);`,
  `  {
    fieldAtSeconds(presentationSimTimeMs / 1000, presentationFieldAxis);`,
  'presentation freeze branch',
);
replaceOnce(
  `    const targetSpeedRad = THREE.MathUtils.degToRad(targetSpeedDeg) * presentationResumeBlend;
    presentationTargetVelocity.copy(presentationFieldAxis).multiplyScalar(targetSpeedRad);
  }

  const maxAccel =`,
  `    const targetSpeedRad = THREE.MathUtils.degToRad(targetSpeedDeg);
    presentationTargetVelocity.copy(presentationFieldAxis).multiplyScalar(targetSpeedRad);
  }

  const autoInfluenceTarget = interactionActive ? FINAL_MOTION_R2.interaction.activeAutoInfluence : 1;
  const autoInfluenceTau = interactionActive ? 0.10 : 0.55;
  presentationResumeBlend += (autoInfluenceTarget - presentationResumeBlend) * (1 - Math.exp(-dt / autoInfluenceTau));
  presentationResumeBlend = THREE.MathUtils.clamp(
    presentationResumeBlend,
    FINAL_MOTION_R2.interaction.activeAutoInfluence,
    1,
  );

  const maxAccel =`,
  'living auto influence',
);
replaceOnce(
  `  if (!interactionActive && angularSpeed > 1e-7) {
    motionDeltaQuaternion.setFromAxisAngle(presentationVelocity.clone().normalize(), angularSpeed * dt);`,
  `  if (angularSpeed > 1e-7) {
    motionDeltaQuaternion.setFromAxisAngle(
      presentationVelocity.clone().normalize(),
      angularSpeed * dt * presentationResumeBlend,
    );`,
  'additive whole-object application',
);

// Direct pointer/touch deltas remain immediate. Do not zero the autonomous state on
// press or release. Reject accidental second pointers and harden capture cleanup.
replaceOnce(
  `canvas.addEventListener('pointerdown', (event) => {
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
}, { passive: false });`,
  `canvas.addEventListener('pointerdown', (event) => {
  if (!api.ready || prefersReducedMotion) return;
  if (activePointerId != null && activePointerId !== event.pointerId) return;
  interactionActive = true;
  activePointerId = event.pointerId;
  dragLastX = event.clientX;
  dragLastY = event.clientY;
  frozenPresentationQuaternion.copy(presentationRig.quaternion);
  canvas.style.cursor = 'grabbing';
  try { canvas.setPointerCapture?.(event.pointerId); } catch {}
  event.preventDefault();
}, { passive: false });`,
  'pointerdown state preservation',
);
replaceOnce(
  `function finishDirectInteraction(event) {
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
canvas.addEventListener('pointercancel', finishDirectInteraction, { passive: true });\`;`,
  `function finishDirectInteraction(event) {
  if (!interactionActive || (event?.pointerId != null && event.pointerId !== activePointerId)) return;
  const releasedPointerId = activePointerId;
  interactionActive = false;
  interactionReleaseAtMs = performance.now();
  activePointerId = null;
  canvas.style.cursor = 'grab';
  if (releasedPointerId != null && canvas.hasPointerCapture?.(releasedPointerId)) {
    try { canvas.releasePointerCapture?.(releasedPointerId); } catch {}
  }
}
canvas.addEventListener('pointerup', finishDirectInteraction, { passive: true });
canvas.addEventListener('pointercancel', finishDirectInteraction, { passive: true });
canvas.addEventListener('lostpointercapture', (event) => {
  if (interactionActive && event.pointerId === activePointerId) finishDirectInteraction(event);
}, { passive: true });\`;`,
  'release continuity',
);

const forbidden = [
  'function presentationAutonomyBlocked() { return interactionActive; }',
  'return interactionActive || performance.now() - interactionReleaseAtMs',
  'presentationVelocity.set(0, 0, 0);',
  'presentationAcceleration.set(0, 0, 0);',
];
for (const marker of forbidden) {
  if (source.includes(marker)) throw new Error(`FINAL MOTION R2 interaction regression remains: ${marker}`);
}

const required = [
  'activeAutoInfluence: 0.30',
  'function presentationAutonomyBlocked() { return false; }',
  'function sliceAutonomyBlocked() { return false; }',
  'angularSpeed * dt * presentationResumeBlend',
  "canvas.addEventListener('lostpointercapture'",
  "motionAuthority: 'proai-final-motion-r2'",
  "selectedPreset: 'premiumHybrid'",
];
for (const marker of required) {
  if (!source.includes(marker)) throw new Error(`FINAL MOTION R2 interaction requirement missing: ${marker}`);
}

const moduleUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
try {
  await import(moduleUrl);
  window.__PROAI_CUBE_FINAL_MOTION_R2_INTERACTION_POLISH = window.__PROAI_CUBE_FINAL_MOTION_R2;
} finally {
  URL.revokeObjectURL(moduleUrl);
}
