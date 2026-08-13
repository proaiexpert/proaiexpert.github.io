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

function replaceOnce(find, replacement, label) {
  const index = source.indexOf(find);
  if (index < 0) throw new Error(`R4 transform anchor missing: ${label}`);
  if (source.indexOf(find, index + find.length) >= 0) throw new Error(`R4 transform anchor not unique: ${label}`);
  source = source.slice(0, index) + replacement + source.slice(index + find.length);
}

function replaceRegex(regex, replacement, label) {
  const flags = regex.flags.includes('g') ? regex.flags : `${regex.flags}g`;
  const matches = [...source.matchAll(new RegExp(regex.source, flags))];
  if (matches.length !== 1) throw new Error(`R4 regex anchor ${label} expected 1 match, got ${matches.length}`);
  source = source.replace(regex, replacement);
}

for (const [from, to, label] of [
  ['  proAIScale: 1.035,', '  proAIScale: 1.045,', 'ProAI hierarchy'],
  ['  surfaceMaxOpacity: 0.88,', '  surfaceMaxOpacity: 0.065,', 'surface opacity'],
  ["  surfaceColor: '#161c23',", "  surfaceColor: '#11161b',", 'surface color'],
  ['  decelerationMs: 440,', '  decelerationMs: 350,', 'deceleration timing'],
  ['  revealMs: 720,', '  revealMs: 600,', 'reveal timing'],
  ['  specularMs: 560,', '  specularMs: 520,', 'specular timing'],
  ['  readableHoldMs: 1380,', '  readableHoldMs: 1250,', 'hold timing'],
  ['  surfaceRestoreMs: 440,', '  surfaceRestoreMs: 500,', 'surface restore'],
  ['  accelerationMs: 440,', '  accelerationMs: 400,', 'acceleration timing'],
  ['  firstSurfaceMs: 38,', '  firstSurfaceMs: 0,', 'surface onset'],
  ['  firstTypographyMs: 72,', '  firstTypographyMs: 90,', 'typography onset'],
  ['  triggerSearchStartMs: 7100,', '  triggerSearchStartMs: 3200,', 'early trigger start'],
  ['  triggerSearchEndMs: 8200,', '  triggerSearchEndMs: 4200,', 'early trigger end'],
  ['  preferredVisibilityDot: 0.92,', '  preferredVisibilityDot: 0.84,', 'preferred face visibility'],
  ['  minimumVisibilityDot: 0.88,', '  minimumVisibilityDot: 0.76,', 'minimum face visibility'],
]) replaceOnce(from, to, label);

replaceOnce(
  '  textEpsilon: 0.46,\n});',
  `  textEpsilon: 0.46,
  semanticVelocityMultiplier: 0.70,
  blockReleaseExitProgress: 0.62,
  internalSharpDepth: -0.10,
  internalSoftDepth: -0.18,
});`,
  'R4 optical config',
);

replaceOnce(
  'controls.enablePan = false;\n',
  'controls.enablePan = false;\ncontrols.enableZoom = false;\n',
  'disable zoom',
);

replaceOnce(
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

replaceOnce(
  '  clearSemanticReviewState,\n  getBaselineComparableState,\n',
  '  clearSemanticReviewState,\n  replaySemanticBrandMoment,\n  getBaselineComparableState,\n',
  'replay API',
);

const materialBlock = `function createSemanticTextMaterial(maskTexture, { alphaScale = 1, edgeScale = 1, luminanceScale = 1 } = {}) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    toneMapped: false,
    uniforms: {
      uMask: { value: maskTexture },
      uFormation: { value: 0 },
      uLuminance: { value: 0 },
      uSweep: { value: 0.36 },
      uExit: { value: 0 },
      uTexel: { value: new THREE.Vector2(1 / 2048, 1 / 2048) },
      uAlphaScale: { value: alphaScale },
      uEdgeScale: { value: edgeScale },
      uLuminanceScale: { value: luminanceScale },
    },
    vertexShader: \`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    \`,
    fragmentShader: \`
      uniform sampler2D uMask;
      uniform float uFormation;
      uniform float uLuminance;
      uniform float uSweep;
      uniform float uExit;
      uniform vec2 uTexel;
      uniform float uAlphaScale;
      uniform float uEdgeScale;
      uniform float uLuminanceScale;
      varying vec2 vUv;
      void main() {
        float a = texture2D(uMask, vUv).a;
        float l = texture2D(uMask, vUv - vec2(uTexel.x * 1.45, 0.0)).a;
        float r = texture2D(uMask, vUv + vec2(uTexel.x * 1.45, 0.0)).a;
        float u = texture2D(uMask, vUv + vec2(0.0, uTexel.y * 1.45)).a;
        float d = texture2D(uMask, vUv - vec2(0.0, uTexel.y * 1.45)).a;
        float neighborMin = min(min(l, r), min(u, d));
        float edge = clamp(a - neighborMin, 0.0, 1.0);
        float formed = smootherstep(0.0, 1.0, uFormation);
        float sink = 1.0 - uExit;
        float alpha = a * formed * sink * uAlphaScale;
        if (alpha < 0.003) discard;

        vec3 shadowSilver = vec3(0.640, 0.670, 0.704);
        vec3 midSilver = vec3(0.765, 0.794, 0.820);
        vec3 pearl = vec3(0.868, 0.887, 0.905);
        vec3 hiPearl = vec3(0.928, 0.940, 0.950);
        float vertical = clamp(vUv.y * 0.56 + 0.22, 0.0, 1.0);
        vec3 color = mix(shadowSilver, midSilver, vertical);
        color = mix(color, pearl, uLuminance * 0.54 * uLuminanceScale);
        color += edge * 0.050 * uEdgeScale;
        float sweepCoord = vUv.x * 0.74 + (1.0 - vUv.y) * 0.10;
        float sweep = exp(-pow((sweepCoord - uSweep) / 0.075, 2.0));
        color = mix(color, hiPearl, sweep * 0.20 * uLuminance);
        gl_FragColor = vec4(color, alpha * (0.30 + 0.48 * uLuminance));
      }
    \`,
  });
}`;

replaceRegex(
  /function createSemanticTextMaterial\(maskTexture\) \{[\s\S]*?\n\}\n\nfunction setupSemanticSurface\(\) \{/,
  `${materialBlock}\n\nfunction setupSemanticSurface() {`,
  'semantic text material',
);

const setupBlock = `function setupSemanticSurface() {
  if (!sceneOne || semanticReady) return;
  const spanY = Math.abs(latticeCenters.Y[2] - latticeCenters.Y[0]) + GEOMETRY_R1.faceOuterSize;
  const spanZ = Math.abs(latticeCenters.Z[2] - latticeCenters.Z[0]) + GEOMETRY_R1.faceOuterSize;
  const faceSpan = Math.min(spanY, spanZ) * 0.998;
  const shape = roundedRectShape(faceSpan, faceSpan, GEOMETRY_R1.faceCornerRadius * 1.10);
  const surfaceGeometry = new THREE.ShapeGeometry(shape, 12);
  const surfaceMaterial = new THREE.MeshPhysicalMaterial({
    color: SEMANTIC_R2.surfaceColor,
    metalness: 0.30,
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
  semanticSurface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
  semanticSurface.renderOrder = 32;

  semanticMaskTexture = createBrandMaskTexture();
  const textGeometry = new THREE.PlaneGeometry(faceSpan * 0.992, faceSpan * 0.992);
  const softText = new THREE.Mesh(textGeometry.clone(), createSemanticTextMaterial(semanticMaskTexture, { alphaScale: 0.42, edgeScale: 0.25, luminanceScale: 0.62 }));
  softText.position.z = SEMANTIC_R2.internalSoftDepth;
  softText.renderOrder = 30;
  const sharpText = new THREE.Mesh(textGeometry, createSemanticTextMaterial(semanticMaskTexture, { alphaScale: 0.92, edgeScale: 0.82, luminanceScale: 0.92 }));
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

replaceRegex(
  /function setupSemanticSurface\(\) \{[\s\S]*?\n\}\n\nfunction getCurrentBestFaceVisibility\(\) \{/,
  `${setupBlock}\n\nfunction getCurrentBestFaceVisibility() {`,
  'semantic surface setup',
);

const visualBlock = `function setSemanticVisualState({ face = semanticFace, surface = 0, formation = 0, luminance = 0, sweep = 0.36, exit = 0 } = {}) {
  if (!semanticReady) return false;
  orientSemanticGroup(face);
  semanticSurfaceProgress = THREE.MathUtils.clamp(surface, 0, 1);
  semanticTextFormation = THREE.MathUtils.clamp(formation, 0, 1);
  semanticTextLuminance = THREE.MathUtils.clamp(luminance, 0, 1);
  semanticSweep = sweep;
  semanticSurface.material.opacity = SEMANTIC_R2.surfaceMaxOpacity * semanticSurfaceProgress;
  semanticSurface.material.roughness = THREE.MathUtils.lerp(0.405, 0.355, semanticSurfaceProgress);
  for (const mesh of semanticTextMeshes) {
    mesh.material.uniforms.uFormation.value = semanticTextFormation;
    mesh.material.uniforms.uLuminance.value = semanticTextLuminance;
    mesh.material.uniforms.uSweep.value = semanticSweep;
    mesh.material.uniforms.uExit.value = THREE.MathUtils.clamp(exit, 0, 1);
  }
  semanticGroup.visible = semanticSurfaceProgress > 0.001 || semanticTextFormation > 0.001;
  return true;
}`;

replaceRegex(
  /function setSemanticVisualState\([\s\S]*?\n\}\n\nfunction setSemanticReviewState/,
  `${visualBlock}\n\nfunction setSemanticReviewState`,
  'semantic visual state',
);

const clearBlock = `function clearSemanticReviewState() {
  if (!semanticReady) return false;
  semanticSurfaceProgress = 0;
  semanticTextFormation = 0;
  semanticTextLuminance = 0;
  semanticSweep = 0.36;
  semanticSurface.material.opacity = 0;
  for (const mesh of semanticTextMeshes) {
    mesh.material.uniforms.uFormation.value = 0;
    mesh.material.uniforms.uLuminance.value = 0;
    mesh.material.uniforms.uSweep.value = 0.36;
    mesh.material.uniforms.uExit.value = 1;
  }
  semanticGroup.visible = false;
  return true;
}`;

replaceRegex(
  /function clearSemanticReviewState\(\) \{[\s\S]*?\n\}\n\nfunction semanticTimelineState/,
  `${clearBlock}\n\nfunction semanticTimelineState`,
  'semantic clear state',
);

const timelineBlock = `function semanticTimelineState(elapsedMs) {
  const decel = SEMANTIC_R2.decelerationMs;
  const revealStart = SEMANTIC_R2.firstSurfaceMs;
  const revealEnd = SEMANTIC_R2.revealMs;
  const textStart = SEMANTIC_R2.firstTypographyMs;
  const specStart = 430;
  const holdEnd = revealEnd + SEMANTIC_R2.readableHoldMs;
  const exitEnd = holdEnd + SEMANTIC_R2.exitMs;
  const surfaceExitStart = holdEnd - 20;
  const accelStart = holdEnd + 80;
  const accelEnd = accelStart + SEMANTIC_R2.accelerationMs;
  const blockRelease = holdEnd + SEMANTIC_R2.exitMs * SEMANTIC_R2.blockReleaseExitProgress;
  const total = Math.max(exitEnd, accelEnd);

  let timeScale = 1;
  if (elapsedMs < decel) {
    timeScale = THREE.MathUtils.lerp(1, SEMANTIC_R2.semanticVelocityMultiplier, smootherstep(elapsedMs / decel));
  } else if (elapsedMs < accelStart) {
    timeScale = SEMANTIC_R2.semanticVelocityMultiplier;
  } else if (elapsedMs < accelEnd) {
    timeScale = THREE.MathUtils.lerp(SEMANTIC_R2.semanticVelocityMultiplier, 1, smootherstep((elapsedMs - accelStart) / SEMANTIC_R2.accelerationMs));
  }

  let surface = smootherstep((elapsedMs - revealStart) / Math.max(1, revealEnd - revealStart));
  if (elapsedMs >= surfaceExitStart) surface *= 1 - smootherstep((elapsedMs - surfaceExitStart) / SEMANTIC_R2.surfaceRestoreMs);
  let formation = smootherstep((elapsedMs - textStart) / Math.max(1, revealEnd - textStart));
  let luminance = smootherstep((elapsedMs - (textStart + 45)) / Math.max(1, revealEnd - textStart - 45));
  let exit = 0;
  if (elapsedMs >= holdEnd) {
    exit = smootherstep((elapsedMs - holdEnd) / SEMANTIC_R2.exitMs);
    formation *= 1 - exit;
    luminance *= 1 - exit;
  }
  let sweep = 0.30;
  if (elapsedMs >= specStart && elapsedMs <= specStart + SEMANTIC_R2.specularMs) {
    sweep = THREE.MathUtils.lerp(0.30, 0.70, smootherstep((elapsedMs - specStart) / SEMANTIC_R2.specularMs));
  } else if (elapsedMs > specStart + SEMANTIC_R2.specularMs) sweep = 0.70;
  return { timeScale, surface, formation, luminance, sweep, exit, holdEnd, exitEnd, accelStart, accelEnd, blockRelease, total };
}`;

replaceRegex(
  /function semanticTimelineState\(elapsedMs\) \{[\s\S]*?\n\}\n\nfunction beginSemanticRuntime/,
  `${timelineBlock}\n\nfunction beginSemanticRuntime`,
  'semantic timeline',
);

const runtimeBlock = `function beginSemanticRuntime(now, face = null, visibilityDot = null) {
  const best = face ? { face, dot: visibilityDot } : getCurrentBestFaceVisibility();
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
  semanticPending = true;
  semanticBlocksSlices = true;
  semanticTimeScale = 1;
  semanticOpportunityWallMs = performance.now();
  semanticOpportunityPresentationMs = presentationSimTimeMs;
  semanticOpportunityActiveTurns = activeTurns.size;
  semanticWaitedForActiveSlice = activeTurns.size > 0;
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
      setSemanticVisualState({ face: semanticFace, surface: 0.72, formation: 1, luminance: 0.72, sweep: 0.50, exit: 0 });
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
    const withinPrimaryWindow = !semanticReplayRequested && presentationSimTimeMs <= SEMANTIC_R2.triggerSearchEndMs;
    if (withinPrimaryWindow && best.dot < SEMANTIC_R2.preferredVisibilityDot) return;
    beginSemanticRuntime(now, best.face, best.dot);
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

replaceRegex(
  /function beginSemanticRuntime\(now\) \{[\s\S]*?\n\}\n\nfunction updateSemanticRuntime\(now\) \{[\s\S]*?\n\}\n\nfunction getSemanticDiagnostics/,
  `${runtimeBlock}\n\nfunction getSemanticDiagnostics`,
  'semantic runtime',
);

replaceOnce(
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
  'semantic diagnostics timing',
);

replaceOnce(
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

replaceRegex(
  /controls\.addEventListener\('start',[\s\S]*?controls\.addEventListener\('end', \(\) => \{[\s\S]*?\n\}\);/,
  `controls.addEventListener('start', () => {
  interactionActive = true;
});

controls.addEventListener('end', () => {
  interactionActive = false;
});`,
  'touch-safe controls lifecycle',
);

replaceOnce(
  '    semanticR2: getSemanticDiagnostics(),\n',
  '    semanticR4: getSemanticDiagnostics(),\n',
  'diagnostics label',
);

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
  outputMain: outMainPath,
  glbBytes: glb.length,
  glbSha256: glbSha,
  timing: {
    triggerSearchStartMs: 3200,
    triggerSearchEndMs: 4200,
    firstTypographyMs: 90,
    revealMs: 600,
    readableHoldMs: 1250,
    exitMs: 520,
    totalTargetMs: 2370,
    semanticVelocityMultiplier: 0.70,
    sliceBlockTargetMs: 2172.4
  }
}, null, 2));
