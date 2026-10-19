import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.resolve(here, '../proai-cube-semantic-brand-moment-r2');
const baseMainPath = path.join(baseDir, 'main.js');
const baseGlbPath = path.join(baseDir, 'rubik_39_s_cube_animation.glb');
const outMainPath = path.join(here, 'main.generated.js');
const outGlbPath = path.join(here, 'rubik_39_s_cube_animation.glb');
const expectedGlbBytes = 279412;
const expectedGlbSha = 'dbb7fc4156f8c9ed2481dd76443dffb9a45ecb5493463f99bffb34dd3b59c79b';

let source = fs.readFileSync(baseMainPath, 'utf8');

function one(find, replacement, label) {
  const at = source.indexOf(find);
  if (at < 0) throw new Error(`R4 anchor missing: ${label}`);
  if (source.indexOf(find, at + find.length) >= 0) throw new Error(`R4 anchor not unique: ${label}`);
  source = source.slice(0, at) + replacement + source.slice(at + find.length);
}

function regex(pattern, replacement, label) {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  const matches = [...source.matchAll(new RegExp(pattern.source, flags))];
  if (matches.length !== 1) throw new Error(`R4 regex ${label}: expected 1, got ${matches.length}`);
  source = source.replace(pattern, replacement);
}

for (const [from, to, label] of [
  ['  proAIScale: 1.035,', '  proAIScale: 1.045,', 'typography hierarchy'],
  ['  surfaceMaxOpacity: 0.88,', '  surfaceMaxOpacity: 0.065,', 'optical surface opacity'],
  ["  surfaceColor: '#161c23',", "  surfaceColor: '#11161b',", 'optical surface color'],
  ['  decelerationMs: 440,', '  decelerationMs: 350,', 'deceleration'],
  ['  revealMs: 720,', '  revealMs: 600,', 'reveal'],
  ['  specularMs: 560,', '  specularMs: 500,', 'specular'],
  ['  readableHoldMs: 1380,', '  readableHoldMs: 1250,', 'readable hold'],
  ['  exitMs: 520,', '  exitMs: 520,', 'exit'],
  ['  surfaceRestoreMs: 440,', '  surfaceRestoreMs: 500,', 'surface restore'],
  ['  accelerationMs: 440,', '  accelerationMs: 400,', 'acceleration'],
  ['  firstSurfaceMs: 38,', '  firstSurfaceMs: 0,', 'material onset'],
  ['  firstTypographyMs: 72,', '  firstTypographyMs: 90,', 'typography onset'],
  ['  triggerSearchStartMs: 7100,', '  triggerSearchStartMs: 3200,', 'trigger start'],
  ['  triggerSearchEndMs: 8200,', '  triggerSearchEndMs: 4200,', 'trigger end'],
  ['  preferredVisibilityDot: 0.92,', '  preferredVisibilityDot: 0.84,', 'preferred visibility'],
  ['  minimumVisibilityDot: 0.88,', '  minimumVisibilityDot: 0.76,', 'minimum visibility'],
]) one(from, to, label);

one(
  '  textEpsilon: 0.46,\n});',
  `  textEpsilon: 0.46,
  semanticVelocityMultiplier: 0.70,
  blockReleaseExitProgress: 0.62,
  internalSharpDepth: -0.10,
  internalSoftDepth: -0.18,
});`,
  'R4 semantic config',
);

one('controls.enablePan = false;\n', 'controls.enablePan = false;\ncontrols.enableZoom = false;\n', 'disable zoom');

one(
  'let semanticActive = false;\nlet semanticComplete = false;\n',
  `let semanticActive = false;
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
let semanticTextMeshes = [];
`,
  'semantic runtime state',
);

one(
  '  clearSemanticReviewState,\n  getBaselineComparableState,\n',
  '  clearSemanticReviewState,\n  replaySemanticBrandMoment,\n  getBaselineComparableState,\n',
  'review replay API',
);

const setup = `function setupSemanticSurface() {
  if (!sceneOne || semanticReady) return;
  const spanY = Math.abs(latticeCenters.Y[2] - latticeCenters.Y[0]) + GEOMETRY_R1.faceOuterSize;
  const spanZ = Math.abs(latticeCenters.Z[2] - latticeCenters.Z[0]) + GEOMETRY_R1.faceOuterSize;
  const faceSpan = Math.min(spanY, spanZ) * 0.998;
  const shape = roundedRectShape(faceSpan, faceSpan, GEOMETRY_R1.faceCornerRadius * 1.10);
  const surfaceMaterial = new THREE.MeshPhysicalMaterial({
    color: SEMANTIC_R2.surfaceColor,
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

  semanticMaskTexture = createBrandMaskTexture();
  const textGeometry = new THREE.PlaneGeometry(faceSpan * 0.992, faceSpan * 0.992);
  const softText = new THREE.Mesh(textGeometry.clone(), createSemanticTextMaterial(semanticMaskTexture));
  softText.position.z = SEMANTIC_R2.internalSoftDepth;
  softText.renderOrder = 30;
  const sharpText = new THREE.Mesh(textGeometry, createSemanticTextMaterial(semanticMaskTexture));
  sharpText.position.z = SEMANTIC_R2.internalSharpDepth;
  sharpText.renderOrder = 31;
  semanticTextMeshes = [softText, sharpText];
  semanticText = sharpText;

  semanticGroup = new THREE.Group();
  semanticGroup.name = 'SEMANTIC_BRAND_FACE_R4_INTERNAL_OPTICAL_REVEAL';
  semanticGroup.add(softText, sharpText, semanticSurface);
  sceneOne.add(semanticGroup);
  orientSemanticGroup(SEMANTIC_R2.selectedFallbackFace);
  semanticReady = true;
  clearSemanticReviewState();
}`;

regex(
  /function setupSemanticSurface\(\) \{[\s\S]*?\n\}\n\nfunction getCurrentBestFaceVisibility\(\) \{/,
  `${setup}\n\nfunction getCurrentBestFaceVisibility() {`,
  'semantic setup',
);

const visual = `function setSemanticVisualState({ face = semanticFace, surface = 0, formation = 0, luminance = 0, sweep = 0.34, exit = 0 } = {}) {
  if (!semanticReady) return false;
  orientSemanticGroup(face);
  semanticSurfaceProgress = THREE.MathUtils.clamp(surface, 0, 1);
  semanticTextFormation = THREE.MathUtils.clamp(formation, 0, 1);
  semanticTextLuminance = THREE.MathUtils.clamp(luminance, 0, 1);
  semanticSweep = sweep;
  semanticSurface.material.opacity = SEMANTIC_R2.surfaceMaxOpacity * semanticSurfaceProgress;
  semanticSurface.material.roughness = THREE.MathUtils.lerp(0.405, 0.355, semanticSurfaceProgress);
  semanticTextMeshes.forEach((mesh, index) => {
    mesh.material.uniforms.uFormation.value = semanticTextFormation;
    mesh.material.uniforms.uLuminance.value = semanticTextLuminance * (index === 0 ? 0.42 : 0.74);
    mesh.material.uniforms.uSweep.value = semanticSweep;
    mesh.material.uniforms.uExit.value = THREE.MathUtils.clamp(exit, 0, 1);
  });
  semanticGroup.visible = semanticSurfaceProgress > 0.001 || semanticTextFormation > 0.001;
  return true;
}`;

regex(
  /function setSemanticVisualState\([\s\S]*?\n\}\n\nfunction setSemanticReviewState/,
  `${visual}\n\nfunction setSemanticReviewState`,
  'visual state',
);

const clear = `function clearSemanticReviewState() {
  if (!semanticReady) return false;
  semanticSurfaceProgress = 0;
  semanticTextFormation = 0;
  semanticTextLuminance = 0;
  semanticSweep = 0.34;
  semanticSurface.material.opacity = 0;
  semanticTextMeshes.forEach((mesh) => {
    mesh.material.uniforms.uFormation.value = 0;
    mesh.material.uniforms.uLuminance.value = 0;
    mesh.material.uniforms.uSweep.value = 0.34;
    mesh.material.uniforms.uExit.value = 1;
  });
  semanticGroup.visible = false;
  return true;
}`;

regex(
  /function clearSemanticReviewState\(\) \{[\s\S]*?\n\}\n\nfunction semanticTimelineState/,
  `${clear}\n\nfunction semanticTimelineState`,
  'clear semantic state',
);

const timeline = `function semanticTimelineState(elapsedMs) {
  const revealEnd = SEMANTIC_R2.revealMs;
  const holdEnd = revealEnd + SEMANTIC_R2.readableHoldMs;
  const exitEnd = holdEnd + SEMANTIC_R2.exitMs;
  const accelStart = holdEnd + 80;
  const accelEnd = accelStart + SEMANTIC_R2.accelerationMs;
  const blockRelease = holdEnd + SEMANTIC_R2.exitMs * SEMANTIC_R2.blockReleaseExitProgress;
  const total = Math.max(exitEnd, accelEnd);

  let timeScale = SEMANTIC_R2.semanticVelocityMultiplier;
  if (elapsedMs < SEMANTIC_R2.decelerationMs) {
    timeScale = THREE.MathUtils.lerp(1, SEMANTIC_R2.semanticVelocityMultiplier, smootherstep(elapsedMs / SEMANTIC_R2.decelerationMs));
  } else if (elapsedMs >= accelStart) {
    timeScale = THREE.MathUtils.lerp(SEMANTIC_R2.semanticVelocityMultiplier, 1, smootherstep((elapsedMs - accelStart) / SEMANTIC_R2.accelerationMs));
  }

  let surface = smootherstep(elapsedMs / SEMANTIC_R2.revealMs);
  const surfaceExitStart = holdEnd - 20;
  if (elapsedMs >= surfaceExitStart) surface *= 1 - smootherstep((elapsedMs - surfaceExitStart) / SEMANTIC_R2.surfaceRestoreMs);
  let formation = smootherstep((elapsedMs - SEMANTIC_R2.firstTypographyMs) / Math.max(1, SEMANTIC_R2.revealMs - SEMANTIC_R2.firstTypographyMs));
  let luminance = smootherstep((elapsedMs - (SEMANTIC_R2.firstTypographyMs + 45)) / Math.max(1, SEMANTIC_R2.revealMs - SEMANTIC_R2.firstTypographyMs - 45));
  let exit = 0;
  if (elapsedMs >= holdEnd) {
    exit = smootherstep((elapsedMs - holdEnd) / SEMANTIC_R2.exitMs);
    formation *= 1 - exit;
    luminance *= 1 - exit;
  }
  let sweep = 0.34;
  const specStart = 430;
  if (elapsedMs >= specStart && elapsedMs <= specStart + SEMANTIC_R2.specularMs) {
    sweep = THREE.MathUtils.lerp(0.34, 0.62, smootherstep((elapsedMs - specStart) / SEMANTIC_R2.specularMs));
  } else if (elapsedMs > specStart + SEMANTIC_R2.specularMs) sweep = 0.62;
  return { timeScale, surface, formation, luminance, sweep, exit, holdEnd, blockRelease, total };
}`;

regex(
  /function semanticTimelineState\(elapsedMs\) \{[\s\S]*?\n\}\n\nfunction beginSemanticRuntime/,
  `${timeline}\n\nfunction beginSemanticRuntime`,
  'semantic timeline',
);

const runtime = `function beginSemanticRuntime(now, best = getCurrentBestFaceVisibility()) {
  semanticFace = best.face;
  semanticVisibilityDot = best.dot;
  semanticActive = true;
  semanticPending = false;
  semanticComplete = false;
  semanticBlocksSlices = true;
  semanticStartWallMs = now;
  semanticElapsedMs = 0;
  semanticEntryPresentationMs = presentationSimTimeMs;
  semanticHoldPresentationMs = null;
  semanticFirstSurfaceWallMs = null;
  semanticFirstTypographyWallMs = null;
  semanticCompletedWallMs = null;
  semanticSchedulerEntry = { eventSerial: sliceEventSerial, eventsUntilBreath, seed: sliceSeed >>> 0 };
  orientSemanticGroup(semanticFace);
}

function replaySemanticBrandMoment() {
  if (!semanticReady || captureMode || prefersReducedMotion) return false;
  semanticReplayRequested = true;
  semanticComplete = false;
  semanticActive = false;
  semanticPending = false;
  semanticBlocksSlices = false;
  semanticTimeScale = 1;
  clearSemanticReviewState();
  return true;
}

function updateSemanticRuntime(now) {
  if (captureMode || !semanticReady || semanticComplete) return;
  if (prefersReducedMotion) {
    if (!semanticActive) {
      const best = getCurrentBestFaceVisibility();
      semanticFace = best.face;
      semanticVisibilityDot = best.dot;
      semanticActive = true;
      semanticBlocksSlices = false;
      semanticTimeScale = 1;
      setSemanticVisualState({ face: semanticFace, surface: 0.70, formation: 1, luminance: 0.72, sweep: 0.50, exit: 0 });
    }
    return;
  }

  if (!semanticActive) {
    if (!semanticReplayRequested && presentationSimTimeMs < SEMANTIC_R2.triggerSearchStartMs) return;
    if (!semanticPending) {
      semanticPending = true;
      semanticBlocksSlices = true;
      semanticOpportunityWallMs = now;
      semanticOpportunityPresentationMs = presentationSimTimeMs;
      semanticOpportunityActiveTurns = activeTurns.size;
      semanticWaitedForActiveSlice = activeTurns.size > 0;
    }
    if (activeTurns.size > 0) {
      semanticWaitedForActiveSlice = true;
      return;
    }
    const best = getCurrentBestFaceVisibility();
    const insideWindow = !semanticReplayRequested && presentationSimTimeMs <= SEMANTIC_R2.triggerSearchEndMs;
    if (insideWindow && best.dot < SEMANTIC_R2.preferredVisibilityDot) return;
    beginSemanticRuntime(now, best);
    semanticReplayRequested = false;
  }

  semanticElapsedMs = Math.max(0, now - semanticStartWallMs);
  const state = semanticTimelineState(semanticElapsedMs);
  semanticTimeScale = state.timeScale;
  setSemanticVisualState({ face: semanticFace, surface: state.surface, formation: state.formation, luminance: state.luminance, sweep: state.sweep, exit: state.exit });
  if (semanticFirstSurfaceWallMs === null && state.surface >= 0.01) semanticFirstSurfaceWallMs = now;
  if (semanticFirstTypographyWallMs === null && state.formation >= 0.01) semanticFirstTypographyWallMs = now;
  if (semanticHoldPresentationMs === null && semanticElapsedMs >= SEMANTIC_R2.revealMs) semanticHoldPresentationMs = presentationSimTimeMs;
  semanticBlocksSlices = semanticElapsedMs < state.blockRelease;
  if (semanticElapsedMs >= state.total) {
    semanticTimeScale = 1;
    semanticBlocksSlices = false;
    semanticActive = false;
    semanticPending = false;
    semanticComplete = true;
    semanticCompletedWallMs = now;
    semanticSchedulerExit = { eventSerial: sliceEventSerial, eventsUntilBreath, seed: sliceSeed >>> 0 };
    clearSemanticReviewState();
  }
}`;

regex(
  /function beginSemanticRuntime\(now\) \{[\s\S]*?\n\}\n\nfunction updateSemanticRuntime\(now\) \{[\s\S]*?\n\}\n\nfunction getSemanticDiagnostics/,
  `${runtime}\n\nfunction getSemanticDiagnostics`,
  'semantic runtime',
);

one(
  '    elapsedMs: semanticElapsedMs,\n',
  `    elapsedMs: semanticElapsedMs,
    pending: semanticPending,
    opportunityWallMs: semanticOpportunityWallMs,
    opportunityPresentationMs: semanticOpportunityPresentationMs,
    firstSurfaceElapsedMs: semanticFirstSurfaceWallMs === null || semanticStartWallMs === 0 ? null : semanticFirstSurfaceWallMs - semanticStartWallMs,
    firstTypographyElapsedMs: semanticFirstTypographyWallMs === null || semanticStartWallMs === 0 ? null : semanticFirstTypographyWallMs - semanticStartWallMs,
    completedElapsedMs: semanticCompletedWallMs === null || semanticStartWallMs === 0 ? null : semanticCompletedWallMs - semanticStartWallMs,
    opportunityActiveTurns: semanticOpportunityActiveTurns,
    waitedForActiveSlice: semanticWaitedForActiveSlice,
    semanticVelocityMultiplier: SEMANTIC_R2.semanticVelocityMultiplier,
    sliceBlockTargetMs: SEMANTIC_R2.revealMs + SEMANTIC_R2.readableHoldMs + SEMANTIC_R2.exitMs * SEMANTIC_R2.blockReleaseExitProgress,
    surfaceOpacityMax: SEMANTIC_R2.surfaceMaxOpacity,
    textMeshCount: semanticTextMeshes.length,
`,
  'semantic diagnostics',
);

one(
  `function presentationAutonomyBlocked() {
  return interactionActive || performance.now() < manualResumeAt;
}

function sliceAutonomyBlocked() {
  return interactionActive || performance.now() < sliceResumeAt || semanticBlocksSlices;
}`,
  `function presentationAutonomyBlocked() {
  return false;
}

function sliceAutonomyBlocked() {
  return semanticBlocksSlices;
}`,
  'interaction autonomy gates',
);

regex(
  /controls\.addEventListener\('start',[\s\S]*?controls\.addEventListener\('end', \(\) => \{[\s\S]*?\n\}\);/,
  `controls.addEventListener('start', () => {
  interactionActive = true;
});

controls.addEventListener('end', () => {
  interactionActive = false;
});`,
  'touch-safe controls lifecycle',
);

one('    semanticR2: getSemanticDiagnostics(),\n', '    semanticR4: getSemanticDiagnostics(),\n', 'diagnostics label');

source = source.replaceAll('SEMANTIC_R2', 'SEMANTIC_R4');
source = source.replaceAll('Semantic Brand Moment R2', 'Semantic Brand Face R4');
source = source.replaceAll('SEMANTIC_BRAND_MOMENT_R2', 'SEMANTIC_BRAND_FACE_R4');

fs.writeFileSync(outMainPath, source);
fs.copyFileSync(baseGlbPath, outGlbPath);

const glb = fs.readFileSync(outGlbPath);
const glbSha = crypto.createHash('sha256').update(glb).digest('hex');
if (glb.length !== expectedGlbBytes) throw new Error(`GLB byte mismatch: ${glb.length}`);
if (glbSha !== expectedGlbSha) throw new Error(`GLB SHA mismatch: ${glbSha}`);

console.log(JSON.stringify({
  direction: 'Internal Optical Reveal',
  glbBytes: glb.length,
  glbSha256: glbSha,
  timing: {
    triggerSearchStartMs: 3200,
    triggerSearchEndMs: 4200,
    firstTypographyMs: 90,
    revealMs: 600,
    readableHoldMs: 1250,
    exitMs: 520,
    totalMs: 2370,
    semanticVelocityMultiplier: 0.70,
    sliceBlockMs: 2172.4
  }
}, null, 2));
