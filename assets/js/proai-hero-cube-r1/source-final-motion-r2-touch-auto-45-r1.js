// ProAI Cube FINAL MOTION R2 — touch/pointer living-auto 45% micro-tune.
// Exact owner baseline remains frozen at source-final-motion-r2-interaction-polish.js.
// The ONLY runtime tuning value changed here is activeAutoInfluence: 0.30 -> 0.45.

const interactionUrl = new URL('./source-final-motion-r2-interaction-polish.js', import.meta.url);
const baseR2Url = new URL('./source-final-motion-r2.js', import.meta.url);
const materialsUrl = new URL('./source-materials-r1.js', import.meta.url);
const glbUrl = new URL('../../models/proai-cube/rubik_39_s_cube_animation.glb', import.meta.url);

const response = await fetch(interactionUrl, { cache: 'no-store' });
if (!response.ok) throw new Error(`FINAL MOTION R2 touch-auto baseline HTTP ${response.status}`);
let source = await response.text();

// The baseline derivative is evaluated from a Blob, so pin only its resource block.
// This is packaging only; it does not change motion, material, lighting or interaction values.
const resourceBlock = `const baseR2Url = new URL('./source-final-motion-r2.js', import.meta.url);
const materialsUrl = new URL('./source-materials-r1.js', import.meta.url);
const glbUrl = new URL('../../models/proai-cube/rubik_39_s_cube_animation.glb', import.meta.url);`;
const pinnedResourceBlock = `const baseR2Url = new URL('${baseR2Url.href}');
const materialsUrl = new URL('${materialsUrl.href}');
const glbUrl = new URL('${glbUrl.href}');`;
if ((source.split(resourceBlock).length - 1) !== 1) {
  throw new Error('FINAL MOTION R2 touch-auto resource block mismatch');
}
source = source.replace(resourceBlock, pinnedResourceBlock);

const tuneA = 'activeAutoInfluence: 0.30';
const tuneB = 'activeAutoInfluence: 0.45';
const tuneCount = source.split(tuneA).length - 1;
if (tuneCount !== 2) {
  throw new Error(`FINAL MOTION R2 touch-auto expected 2 baseline markers, found ${tuneCount}`);
}
source = source.split(tuneA).join(tuneB);

const frozenMarkers = [
  'dragRadiansPerPixel: 0.0052',
  'const autoInfluenceTau = interactionActive ? 0.10 : 0.55;',
  'maxAccelDegPerSec2: 18.0',
  'maxJerkDegPerSec3: 68.0',
  'function sliceAutonomyBlocked() { return false; }',
  "motionAuthority: 'proai-final-motion-r2'",
  "selectedPreset: 'premiumHybrid'",
];
for (const marker of frozenMarkers) {
  if (!source.includes(marker)) throw new Error(`FINAL MOTION R2 touch-auto frozen authority missing: ${marker}`);
}
if (source.includes(tuneA) || !source.includes(tuneB)) {
  throw new Error('FINAL MOTION R2 touch-auto value patch failed');
}

const moduleUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
try {
  await import(moduleUrl);
  window.__PROAI_CUBE_TOUCH_AUTO_45_R1 = window.__PROAI_CUBE_FINAL_MOTION_R2_INTERACTION_POLISH || window.__PROAI_CUBE_FINAL_MOTION_R2;
} finally {
  URL.revokeObjectURL(moduleUrl);
}
