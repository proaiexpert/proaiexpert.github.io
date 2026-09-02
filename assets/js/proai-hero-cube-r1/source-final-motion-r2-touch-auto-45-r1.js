// ProAI Cube FINAL MOTION R2 — touch/pointer living-auto 45% micro-tune.
// Direct derivative of the proven interaction-preservation source.
// The ONLY runtime tuning value changed from the owner baseline is activeAutoInfluence: 0.30 -> 0.45.
// This avoids the extra nested Blob wrapper used by the first B packaging, which failed to boot on real iPhone Safari.

const baseR2Url = new URL('./source-final-motion-r2.js', import.meta.url);
const materialsUrl = new URL('./source-materials-r1.js', import.meta.url);
const goldenReferenceMode = new URLSearchParams(location.search).has('golden-reference');
const glbUrl = new URL(
  goldenReferenceMode ? '../../models/proai-cube/rubik_39_s_cube_animation.glb' : '../../models/proai-cube/proai-cube-r1-1.glb?sha=3907E5ECB4FC',
  import.meta.url,
);

const response = await fetch(baseR2Url, { cache: 'no-store' });
if (!response.ok) throw new Error(`FINAL MOTION R2 touch-auto base HTTP ${response.status}`);
let source = await response.text();
source = source.replace(/\r\n?/g, '\n');

function replaceOnce(oldValue, newValue, label) {
  const count = source.split(oldValue).length - 1;
  if (count !== 1) throw new Error(`FINAL MOTION R2 touch-auto refused ${label}: ${count} matches`);
  source = source.replace(oldValue, newValue);
}

// Preserve the same resource semantics as the proven 30% interaction derivative.
replaceOnce(
  "const goldenReferenceMode = new URLSearchParams(location.search).has('golden-reference');",
  `const goldenReferenceMode = ${goldenReferenceMode};`,
  'review mode',
);
replaceOnce(
  "const sourceUrl = new URL('./source-materials-r1.js', import.meta.url);",
  `const sourceUrl = new URL('${materialsUrl.href}');`,
  'materials URL',
);
replaceOnce(
  `const glbUrl = new URL(\n  goldenReferenceMode ? '../../models/proai-cube/rubik_39_s_cube_animation.glb' : '../../models/proai-cube/proai-cube-r1-1.glb?sha=3907E5ECB4FC',\n  import.meta.url,\n);`,
  `const glbUrl = new URL('${glbUrl.href}');`,
  'GLB URL',
);
replaceOnce(
  "source = source.replace(/\\r\\n?/g, '\\n');",
  `source = source.replace(/\\r\\n?/g, '\\n');
source = source.replace(
  "const reviewQuery = new URLSearchParams(location.search);",
  \`const reviewQuery = new URLSearchParams(${JSON.stringify(location.search)});\`,
);
source = source.replace(
  "const goldenReferenceMode = new URLSearchParams(location.search).has('golden-reference');",
  "const goldenReferenceMode = ${goldenReferenceMode};",
);`,
  'inner review context',
);

// Same drag sensitivity and zero post-release dead window as the proven baseline.
// ONLY the held autonomous contribution changes: 30% -> 45%.
replaceOnce(
  "    dragRadiansPerPixel: 0.0052,\n    resumeGraceMs: 420,",
  "    dragRadiansPerPixel: 0.0052,\n    activeAutoInfluence: 0.45,\n    resumeGraceMs: 0,",
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
  if (source.includes(marker)) throw new Error(`FINAL MOTION R2 touch-auto interaction regression remains: ${marker}`);
}

const required = [
  'activeAutoInfluence: 0.45',
  'dragRadiansPerPixel: 0.0052',
  'const autoInfluenceTau = interactionActive ? 0.10 : 0.55;',
  'function presentationAutonomyBlocked() { return false; }',
  'function sliceAutonomyBlocked() { return false; }',
  'angularSpeed * dt * presentationResumeBlend',
  "canvas.addEventListener('lostpointercapture'",
  "motionAuthority: 'proai-final-motion-r2'",
  "selectedPreset: 'premiumHybrid'",
];
for (const marker of required) {
  if (!source.includes(marker)) throw new Error(`FINAL MOTION R2 touch-auto requirement missing: ${marker}`);
}

const moduleUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
try {
  await import(moduleUrl);
  window.__PROAI_CUBE_FINAL_MOTION_R2_INTERACTION_POLISH = window.__PROAI_CUBE_FINAL_MOTION_R2;
  window.__PROAI_CUBE_TOUCH_AUTO_45_R1 = window.__PROAI_CUBE_FINAL_MOTION_R2;
} finally {
  URL.revokeObjectURL(moduleUrl);
}
