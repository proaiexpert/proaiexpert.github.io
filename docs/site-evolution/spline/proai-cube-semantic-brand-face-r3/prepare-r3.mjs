import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const here = path.dirname(new URL(import.meta.url).pathname);
const baseDir = path.resolve(here, '../proai-cube-semantic-brand-moment-r2');
const baseMainPath = path.join(baseDir, 'main.js');
const baseGlbPath = path.join(baseDir, 'rubik_39_s_cube_animation.glb');
const outMainPath = path.join(here, 'main.generated.js');
const outGlbPath = path.join(here, 'rubik_39_s_cube_animation.glb');
const expectedGlbSha = 'dbb7fc4156f8c9ed2481dd76443dffb9a45ecb5493463f99bffb34dd3b59c79b';

let source = fs.readFileSync(baseMainPath, 'utf8');

function replaceOnce(find, replacement, label) {
  const index = source.indexOf(find);
  if (index < 0) throw new Error(`R3 transform anchor missing: ${label}`);
  if (source.indexOf(find, index + find.length) >= 0) throw new Error(`R3 transform anchor not unique: ${label}`);
  source = source.slice(0, index) + replacement + source.slice(index + find.length);
}

function replaceRegex(regex, replacement, label) {
  const flags = regex.flags.includes('g') ? regex.flags : `${regex.flags}g`;
  const matches = [...source.matchAll(new RegExp(regex.source, flags))];
  if (matches.length !== 1) throw new Error(`R3 regex anchor ${label} expected 1 match, got ${matches.length}`);
  source = source.replace(regex, replacement);
}

replaceOnce(
  "const reviewMode = params.has('review');\n",
  "const reviewMode = params.has('review');\nconst semanticR3RequestedConcept = (params.get('concept') || 'A').toUpperCase();\nconst semanticR3Concept = ['A', 'B', 'C'].includes(semanticR3RequestedConcept) ? semanticR3RequestedConcept : 'A';\n",
  'concept query',
);

for (const [from, to, label] of [
  ['  proAIScale: 1.035,', '  proAIScale: 1.075,', 'ProAI hierarchy'],
  ['  revealMs: 720,', '  revealMs: 900,', 'reveal timing'],
  ['  specularMs: 560,', '  specularMs: 680,', 'specular timing'],
  ['  readableHoldMs: 1380,', '  readableHoldMs: 1900,', 'hold timing'],
  ['  exitMs: 520,', '  exitMs: 700,', 'text exit timing'],
  ['  surfaceRestoreMs: 440,', '  surfaceRestoreMs: 820,', 'surface exit timing'],
  ['  accelerationMs: 440,', '  accelerationMs: 520,', 'acceleration timing'],
  ['  firstTypographyMs: 72,', '  firstTypographyMs: 160,', 'typography onset'],
]) replaceOnce(from, to, label);

const configBlock = `  textEpsilon: 0.46,
});

const SEMANTIC_R3 = Object.freeze({
  name: 'Semantic Brand Face R3',
  concept: semanticR3Concept,
  composition: 'two-line / ProAI dominant',
  concepts: Object.freeze({
    A: Object.freeze({ id: 'A', name: 'Smoked Semantic Veil', surfaceColor: '#141a20', surfaceOpacity: 0.32, metalness: 0.34, roughnessIdle: 0.38, roughnessActive: 0.30, clearcoat: 0.10, clearcoatRoughness: 0.24, envMapIntensity: 1.05, textDepth: 0.10, surfaceMode: 'continuous-veil' }),
    B: Object.freeze({ id: 'B', name: 'Nine-Cubie Semantic Inlay', surfaceColor: '#1a2027', surfaceOpacity: 0.20, metalness: 0.56, roughnessIdle: 0.34, roughnessActive: 0.27, clearcoat: 0.10, clearcoatRoughness: 0.20, envMapIntensity: 1.12, textDepth: 0.08, surfaceMode: 'nine-cubie-inlay' }),
    C: Object.freeze({ id: 'C', name: 'Internal Optical Reveal', surfaceColor: '#101419', surfaceOpacity: 0.12, metalness: 0.22, roughnessIdle: 0.42, roughnessActive: 0.36, clearcoat: 0.06, clearcoatRoughness: 0.28, envMapIntensity: 0.90, textDepth: -0.10, surfaceMode: 'subsurface-approximation' }),
  }),
});

const renderer`;

replaceOnce(
  "  textEpsilon: 0.46,\n});\n\nconst renderer",
  configBlock,
  'R3 config insertion',
);

replaceOnce(
  'let semanticText = null;\n',
  'let semanticText = null;\nlet semanticSurfaceMeshes = [];\nlet semanticTextMeshes = [];\nlet semanticMaskTextures = [];\n',
  'semantic mesh arrays',
);

replaceOnce(
  '  presentationConfig: PRESENTATION_R1_2,\n  sliceConfig: SLICE_R1_2,\n  geometry: null,\n',
  '  presentationConfig: PRESENTATION_R1_2,\n  sliceConfig: SLICE_R1_2,\n  semanticR3Concept,\n  semanticR3Config: SEMANTIC_R3,\n  geometry: null,\n',
  'R3 API fields',
);

const helpers = `function createR3SurfaceMaterial(config) {
  return new THREE.MeshPhysicalMaterial({
    color: config.surfaceColor,
    metalness: config.metalness,
    roughness: config.roughnessIdle,
    clearcoat: config.clearcoat,
    clearcoatRoughness: config.clearcoatRoughness,
    envMapIntensity: config.envMapIntensity,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    depthTest: true,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
}

function createR3RoundedSurface(size, radius, config) {
  const geometry = new THREE.ShapeGeometry(roundedRectShape(size, size, radius), 12);
  const mesh = new THREE.Mesh(geometry, createR3SurfaceMaterial(config));
  mesh.renderOrder = 30;
  return mesh;
}

function createR3MaskTile(sourceTexture, col, row) {
  const sourceCanvas = sourceTexture.image;
  const width = Math.floor(sourceCanvas.width / 3);
  const height = Math.floor(sourceCanvas.height / 3);
  const tileCanvas = document.createElement('canvas');
  tileCanvas.width = width;
  tileCanvas.height = height;
  const ctx = tileCanvas.getContext('2d', { alpha: true });
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(sourceCanvas, col * width, row * height, width, height, 0, 0, width, height);
  const texture = new THREE.CanvasTexture(tileCanvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  semanticMaskTextures.push(texture);
  return texture;
}

function createR3TextPlane(width, height, maskTexture, depth = 0.1) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), createSemanticTextMaterial(maskTexture));
  mesh.position.z = depth;
  mesh.renderOrder = 31;
  return mesh;
}`;

replaceOnce(
  'function setupSemanticSurface() {',
  `${helpers}\n\nfunction setupSemanticSurface() {`,
  'R3 helpers',
);

const setupBlock = `function setupSemanticSurface() {
  if (!sceneOne || semanticReady) return;
  const spanY = Math.abs(latticeCenters.Y[2] - latticeCenters.Y[0]) + GEOMETRY_R1.faceOuterSize;
  const spanZ = Math.abs(latticeCenters.Z[2] - latticeCenters.Z[0]) + GEOMETRY_R1.faceOuterSize;
  const faceSpan = Math.min(spanY, spanZ) * 0.998;
  const config = SEMANTIC_R3.concepts[semanticR3Concept];

  semanticSurfaceMeshes = [];
  semanticTextMeshes = [];
  semanticMaskTextures = [];
  semanticMaskTexture = createBrandMaskTexture();
  semanticMaskTextures.push(semanticMaskTexture);
  semanticGroup = new THREE.Group();
  semanticGroup.name = 'SEMANTIC_BRAND_FACE_R3_' + semanticR3Concept;

  if (semanticR3Concept === 'B') {
    const gridStep = (faceSpan - GEOMETRY_R1.faceOuterSize) * 0.5;
    const tileSize = GEOMETRY_R1.faceOuterSize * 0.986;
    const tileRadius = GEOMETRY_R1.faceCornerRadius * 1.02;
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        const x = (col - 1) * gridStep;
        const y = (1 - row) * gridStep;
        const surface = createR3RoundedSurface(tileSize, tileRadius, config);
        surface.position.set(x, y, 0);
        const tileMask = createR3MaskTile(semanticMaskTexture, col, row);
        const text = createR3TextPlane(tileSize * 0.994, tileSize * 0.994, tileMask, config.textDepth);
        text.position.x = x;
        text.position.y = y;
        semanticSurfaceMeshes.push(surface);
        semanticTextMeshes.push(text);
        semanticGroup.add(surface, text);
      }
    }
  } else {
    const surface = createR3RoundedSurface(faceSpan, GEOMETRY_R1.faceCornerRadius * 1.10, config);
    const text = createR3TextPlane(faceSpan * 0.992, faceSpan * 0.992, semanticMaskTexture, config.textDepth);
    if (semanticR3Concept === 'C') {
      surface.renderOrder = 32;
      text.renderOrder = 31;
    }
    semanticSurfaceMeshes.push(surface);
    semanticTextMeshes.push(text);
    semanticGroup.add(text, surface);
  }

  semanticSurface = semanticSurfaceMeshes[0] || null;
  semanticText = semanticTextMeshes[0] || null;
  sceneOne.add(semanticGroup);
  orientSemanticGroup(SEMANTIC_R2.selectedFallbackFace);
  semanticReady = true;
  clearSemanticReviewState();
}`;

replaceRegex(
  /function setupSemanticSurface\(\) \{[\s\S]*?\n\}\n\nfunction getCurrentBestFaceVisibility\(\) \{/,
  `${setupBlock}\n\nfunction getCurrentBestFaceVisibility() {`,
  'setup semantic surface',
);

const visualBlock = `function setSemanticVisualState({ face = semanticFace, surface = 0, formation = 0, luminance = 0, sweep = -0.2, exit = 0 } = {}) {
  if (!semanticReady) return false;
  orientSemanticGroup(face);
  const config = SEMANTIC_R3.concepts[semanticR3Concept];
  semanticSurfaceProgress = THREE.MathUtils.clamp(surface, 0, 1);
  semanticTextFormation = THREE.MathUtils.clamp(formation, 0, 1);
  semanticTextLuminance = THREE.MathUtils.clamp(luminance, 0, 1);
  semanticSweep = sweep;

  for (const mesh of semanticSurfaceMeshes) {
    mesh.material.opacity = config.surfaceOpacity * semanticSurfaceProgress;
    mesh.material.roughness = THREE.MathUtils.lerp(config.roughnessIdle, config.roughnessActive, semanticSurfaceProgress);
  }
  for (const mesh of semanticTextMeshes) {
    mesh.material.uniforms.uFormation.value = semanticTextFormation;
    mesh.material.uniforms.uLuminance.value = semanticTextLuminance * (semanticR3Concept === 'C' ? 0.78 : 1.0);
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
  semanticSweep = -0.2;
  for (const mesh of semanticSurfaceMeshes) mesh.material.opacity = 0;
  for (const mesh of semanticTextMeshes) {
    mesh.material.uniforms.uFormation.value = 0;
    mesh.material.uniforms.uLuminance.value = 0;
    mesh.material.uniforms.uSweep.value = -0.2;
    mesh.material.uniforms.uExit.value = 1;
  }
  semanticGroup.visible = false;
  return true;
}`;

replaceRegex(
  /function clearSemanticReviewState\(\) \{[\s\S]*?\n\}\n\nfunction semanticTimelineState/,
  `${clearBlock}\n\nfunction semanticTimelineState`,
  'clear semantic state',
);

replaceOnce(
  '  if (captureMode || prefersReducedMotion || !semanticReady || semanticComplete || interactionActive) return;\n',
  `  if (captureMode || !semanticReady || semanticComplete || interactionActive) return;
  if (prefersReducedMotion) {
    if (!semanticActive) {
      const best = getCurrentBestFaceVisibility();
      semanticFace = best.face || SEMANTIC_R2.selectedFallbackFace;
      semanticVisibilityDot = best.dot;
      semanticActive = true;
      semanticBlocksSlices = true;
      semanticTimeScale = 0;
      setSemanticVisualState({ face: semanticFace, surface: 0.92, formation: 1, luminance: 0.78, sweep: 0.46, exit: 0 });
    }
    return;
  }
`,
  'reduced motion semantic state',
);

replaceOnce(
  '    config: SEMANTIC_R2,\n',
  "    config: SEMANTIC_R2,\n    r3Concept: semanticR3Concept,\n    r3ConceptConfig: SEMANTIC_R3.concepts[semanticR3Concept],\n    surfaceMeshCount: semanticSurfaceMeshes.length,\n    textMeshCount: semanticTextMeshes.length,\n",
  'semantic diagnostics',
);

source = source.replaceAll('Semantic Brand Moment R2', 'Semantic Brand Face R3');
fs.writeFileSync(outMainPath, source);
fs.copyFileSync(baseGlbPath, outGlbPath);

const glb = fs.readFileSync(outGlbPath);
const glbSha = crypto.createHash('sha256').update(glb).digest('hex');
if (glbSha !== expectedGlbSha) throw new Error(`GLB SHA mismatch: ${glbSha}`);

console.log(JSON.stringify({
  outputMain: outMainPath,
  concepts: ['A', 'B', 'C'],
  glbBytes: glb.length,
  glbSha256: glbSha,
}, null, 2));
