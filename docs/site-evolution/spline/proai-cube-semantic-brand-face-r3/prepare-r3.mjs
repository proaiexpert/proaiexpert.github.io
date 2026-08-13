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
  const matches = [...source.matchAll(new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : `${regex.flags}g`))];
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

replaceOnce(
  "  textEpsilon: 0.46,\n});\n\nconst renderer",
  `  textEpsilon: 0.46,\n});\n\nconst SEMANTIC_R3 = Object.freeze({\n  name: 'Semantic Brand Face R3',\n  concept: semanticR3Concept,\n  composition: 'two-line / ProAI dominant',\n  concepts: Object.freeze({\n    A: Object.freeze({\n      id: 'A',\n      name: 'Smoked Semantic Veil',\n      surfaceColor: '#141a20',\n      surfaceOpacity: 0.32,\n      metalness: 0.34,\n      roughnessIdle: 0.38,\n      roughnessActive: 0.30,\n      clearcoat: 0.10,\n      clearcoatRoughness: 0.24,\n      envMapIntensity: 1.05,\n      textAlpha: 0.88,\n      textInternal: 0.08,\n      underlayAlpha: 0.0,\n      surfaceMode: 'continuous-veil',\n    }),\n    B: Object.freeze({\n      id: 'B',\n      name: 'Nine-Cubie Semantic Inlay',\n      surfaceColor: '#1a2027',\n      surfaceOpacity: 0.20,\n      metalness: 0.56,\n      roughnessIdle: 0.34,\n      roughnessActive: 0.27,\n      clearcoat: 0.10,\n      clearcoatRoughness: 0.20,\n      envMapIntensity: 1.12,\n      textAlpha: 0.92,\n      textInternal: 0.04,\n      underlayAlpha: 0.0,\n      surfaceMode: 'nine-cubie-inlay',\n    }),\n    C: Object.freeze({\n      id: 'C',\n      name: 'Internal Optical Reveal',\n      surfaceColor: '#101419',\n      surfaceOpacity: 0.12,\n      metalness: 0.22,\n      roughnessIdle: 0.42,\n      roughnessActive: 0.36,\n      clearcoat: 0.06,\n      clearcoatRoughness: 0.28,\n      envMapIntensity: 0.90,\n      textAlpha: 0.70,\n      textInternal: 0.62,\n      underlayAlpha: 0.28,\n      surfaceMode: 'subsurface-approximation',\n    }),\n  }),\n});\n\nconst renderer`,
  'R3 config insertion',
);

replaceOnce(
  'let semanticText = null;\n',
  'let semanticText = null;\nlet semanticSurfaceMeshes = [];\nlet semanticTextMeshes = [];\nlet semanticUnderlayMeshes = [];\n',
  'semantic mesh arrays',
);

replaceOnce(
  '  sliceConfig: SLICE_R1_2,\n',
  '  sliceConfig: SLICE_R1_2,\n  semanticR3Concept,\n  semanticR3Config: SEMANTIC_R3,\n',
  'R3 API fields',
);

const textMaterialBlock = `function createSemanticTextMaterial(maskTexture, options = {}) {\n  const uvScale = options.uvScale || [1, 1];\n  const uvOffset = options.uvOffset || [0, 0];\n  const alphaScale = options.alphaScale ?? 1;\n  const internal = options.internal ?? 0;\n  return new THREE.ShaderMaterial({\n    transparent: true,\n    depthWrite: false,\n    depthTest: true,\n    toneMapped: false,\n    uniforms: {\n      uMask: { value: maskTexture },\n      uFormation: { value: 0 },\n      uLuminance: { value: 0 },\n      uSweep: { value: -0.2 },\n      uExit: { value: 0 },\n      uTexel: { value: new THREE.Vector2(1 / 2048, 1 / 2048) },\n      uUvScale: { value: new THREE.Vector2(...uvScale) },\n      uUvOffset: { value: new THREE.Vector2(...uvOffset) },\n      uAlphaScale: { value: alphaScale },\n      uInternal: { value: internal },\n    },\n    vertexShader: \\`\n      varying vec2 vUv;\n      void main() {\n        vUv = uv;\n        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n      }\n    \\`,\n    fragmentShader: \\`\n      uniform sampler2D uMask;\n      uniform float uFormation;\n      uniform float uLuminance;\n      uniform float uSweep;\n      uniform float uExit;\n      uniform vec2 uTexel;\n      uniform vec2 uUvScale;\n      uniform vec2 uUvOffset;\n      uniform float uAlphaScale;\n      uniform float uInternal;\n      varying vec2 vUv;\n      void main() {\n        vec2 sampleUv = vUv * uUvScale + uUvOffset;\n        float a = texture2D(uMask, sampleUv).a;\n        float l = texture2D(uMask, sampleUv - vec2(uTexel.x * 1.7, 0.0)).a;\n        float r = texture2D(uMask, sampleUv + vec2(uTexel.x * 1.7, 0.0)).a;\n        float u = texture2D(uMask, sampleUv + vec2(0.0, uTexel.y * 1.7)).a;\n        float d = texture2D(uMask, sampleUv - vec2(0.0, uTexel.y * 1.7)).a;\n        float neighborMin = min(min(l, r), min(u, d));\n        float edge = clamp(a - neighborMin, 0.0, 1.0);\n        float threshold = mix(0.94, 0.02, uFormation);\n        float formed = smoothstep(threshold, threshold + 0.10, a) * smoothstep(0.0, 0.18, uFormation);\n        float alpha = formed * (1.0 - uExit);\n        if (alpha < 0.004) discard;\n\n        vec3 shadowSilver = vec3(0.655, 0.680, 0.714);\n        vec3 midSilver = vec3(0.790, 0.815, 0.842);\n        vec3 pearl = vec3(0.892, 0.907, 0.922);\n        vec3 hiPearl = vec3(0.958, 0.966, 0.972);\n        vec3 color = mix(shadowSilver, midSilver, clamp(vUv.y * 0.68 + 0.18, 0.0, 1.0));\n        color = mix(color, pearl, uLuminance * mix(0.84, 0.62, uInternal));\n        color += edge * mix(0.075, 0.035, uInternal);\n        float sweepCoord = vUv.x * 0.86 + (1.0 - vUv.y) * 0.18;\n        float sweep = exp(-pow((sweepCoord - uSweep) / 0.055, 2.0));\n        color = mix(color, hiPearl, sweep * uLuminance * mix(0.58, 0.30, uInternal));\n        color = mix(color, shadowSilver, uInternal * 0.12);\n        float materialAlpha = alpha * uAlphaScale * (0.34 + 0.66 * uLuminance) * mix(1.0, 0.86, uInternal);\n        gl_FragColor = vec4(color, materialAlpha);\n      }\n    \\`,\n  });\n}\n\nfunction createR3SurfaceMaterial(config) {\n  return new THREE.MeshPhysicalMaterial({\n    color: config.surfaceColor,\n    metalness: config.metalness,\n    roughness: config.roughnessIdle,\n    clearcoat: config.clearcoat,\n    clearcoatRoughness: config.clearcoatRoughness,\n    envMapIntensity: config.envMapIntensity,\n    transparent: true,\n    opacity: 0,\n    depthWrite: false,\n    depthTest: true,\n    polygonOffset: true,\n    polygonOffsetFactor: -2,\n    polygonOffsetUnits: -2,\n  });\n}\n\nfunction createR3RoundedSurface(size, radius, config) {\n  const geometry = new THREE.ShapeGeometry(roundedRectShape(size, size, radius), 12);\n  const mesh = new THREE.Mesh(geometry, createR3SurfaceMaterial(config));\n  mesh.renderOrder = 30;\n  return mesh;\n}\n\nfunction createR3TextPlane(width, height, maskTexture, options = {}) {\n  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), createSemanticTextMaterial(maskTexture, options));\n  mesh.renderOrder = options.renderOrder ?? 31;\n  return mesh;\n}\n`;

replaceRegex(
  /function createSemanticTextMaterial\(maskTexture\) \{[\s\S]*?\n\}\n\nfunction setupSemanticSurface\(\) \{/,
  `${textMaterialBlock}\nfunction setupSemanticSurface() {`,
  'text material function',
);

const setupBlock = `function setupSemanticSurface() {\n  if (!sceneOne || semanticReady) return;\n  const spanY = Math.abs(latticeCenters.Y[2] - latticeCenters.Y[0]) + GEOMETRY_R1.faceOuterSize;\n  const spanZ = Math.abs(latticeCenters.Z[2] - latticeCenters.Z[0]) + GEOMETRY_R1.faceOuterSize;\n  const faceSpan = Math.min(spanY, spanZ) * 0.998;\n  const config = SEMANTIC_R3.concepts[semanticR3Concept];\n\n  semanticSurfaceMeshes = [];\n  semanticTextMeshes = [];\n  semanticUnderlayMeshes = [];\n  semanticMaskTexture = createBrandMaskTexture();\n  semanticGroup = new THREE.Group();\n  semanticGroup.name = \\`SEMANTIC_BRAND_FACE_R3_\${semanticR3Concept}\\`;\n\n  if (semanticR3Concept === 'A') {\n    const surface = createR3RoundedSurface(faceSpan, GEOMETRY_R1.faceCornerRadius * 1.10, config);\n    const text = createR3TextPlane(faceSpan * 0.992, faceSpan * 0.992, semanticMaskTexture, { alphaScale: config.textAlpha, internal: config.textInternal });\n    text.position.z = SEMANTIC_R2.textEpsilon - SEMANTIC_R2.overlayEpsilon;\n    semanticSurfaceMeshes.push(surface);\n    semanticTextMeshes.push(text);\n    semanticGroup.add(surface, text);\n  } else if (semanticR3Concept === 'B') {\n    const gridStep = (faceSpan - GEOMETRY_R1.faceOuterSize) * 0.5;\n    const tileSize = GEOMETRY_R1.faceOuterSize * 0.986;\n    const tileRadius = GEOMETRY_R1.faceCornerRadius * 1.02;\n    for (let row = 0; row < 3; row += 1) {\n      for (let col = 0; col < 3; col += 1) {\n        const x = (col - 1) * gridStep;\n        const y = (row - 1) * gridStep;\n        const surface = createR3RoundedSurface(tileSize, tileRadius, config);\n        surface.position.set(x, y, 0);\n        const text = createR3TextPlane(tileSize * 0.994, tileSize * 0.994, semanticMaskTexture, {\n          uvScale: [1 / 3, 1 / 3],\n          uvOffset: [col / 3, row / 3],\n          alphaScale: config.textAlpha,\n          internal: config.textInternal,\n        });\n        text.position.set(x, y, SEMANTIC_R2.textEpsilon - SEMANTIC_R2.overlayEpsilon - 0.02);\n        semanticSurfaceMeshes.push(surface);\n        semanticTextMeshes.push(text);\n        semanticGroup.add(surface, text);\n      }\n    }\n  } else {\n    const underlay = createR3TextPlane(faceSpan * 0.990, faceSpan * 0.990, semanticMaskTexture, {\n      alphaScale: config.underlayAlpha,\n      internal: 1.0,\n      renderOrder: 30,\n    });\n    underlay.position.z = -0.12;\n    const text = createR3TextPlane(faceSpan * 0.990, faceSpan * 0.990, semanticMaskTexture, {\n      alphaScale: config.textAlpha,\n      internal: config.textInternal,\n      renderOrder: 31,\n    });\n    text.position.z = -0.055;\n    const surface = createR3RoundedSurface(faceSpan, GEOMETRY_R1.faceCornerRadius * 1.08, config);\n    surface.renderOrder = 32;\n    semanticUnderlayMeshes.push(underlay);\n    semanticTextMeshes.push(text);\n    semanticSurfaceMeshes.push(surface);\n    semanticGroup.add(underlay, text, surface);\n  }\n\n  semanticSurface = semanticSurfaceMeshes[0] || null;\n  semanticText = semanticTextMeshes[0] || semanticUnderlayMeshes[0] || null;\n  sceneOne.add(semanticGroup);\n  orientSemanticGroup(SEMANTIC_R2.selectedFallbackFace);\n  semanticReady = true;\n  clearSemanticReviewState();\n}\n`;

replaceRegex(
  /function setupSemanticSurface\(\) \{[\s\S]*?\n\}\n\nfunction getCurrentBestFaceVisibility\(\) \{/,
  `${setupBlock}\nfunction getCurrentBestFaceVisibility() {`,
  'setup semantic surface',
);

const visualStateBlock = `function setSemanticVisualState({ face = semanticFace, surface = 0, formation = 0, luminance = 0, sweep = -0.2, exit = 0 } = {}) {\n  if (!semanticReady) return false;\n  orientSemanticGroup(face);\n  const config = SEMANTIC_R3.concepts[semanticR3Concept];\n  semanticSurfaceProgress = THREE.MathUtils.clamp(surface, 0, 1);\n  semanticTextFormation = THREE.MathUtils.clamp(formation, 0, 1);\n  semanticTextLuminance = THREE.MathUtils.clamp(luminance, 0, 1);\n  semanticSweep = sweep;\n\n  for (const mesh of semanticSurfaceMeshes) {\n    mesh.material.opacity = config.surfaceOpacity * semanticSurfaceProgress;\n    mesh.material.roughness = THREE.MathUtils.lerp(config.roughnessIdle, config.roughnessActive, semanticSurfaceProgress);\n  }\n  for (const mesh of semanticTextMeshes) {\n    mesh.material.uniforms.uFormation.value = semanticTextFormation;\n    mesh.material.uniforms.uLuminance.value = semanticTextLuminance;\n    mesh.material.uniforms.uSweep.value = semanticSweep;\n    mesh.material.uniforms.uExit.value = THREE.MathUtils.clamp(exit, 0, 1);\n  }\n  for (const mesh of semanticUnderlayMeshes) {\n    mesh.material.uniforms.uFormation.value = THREE.MathUtils.clamp(semanticTextFormation * 1.08 + semanticSurfaceProgress * 0.06, 0, 1);\n    mesh.material.uniforms.uLuminance.value = semanticTextLuminance * 0.78;\n    mesh.material.uniforms.uSweep.value = semanticSweep;\n    mesh.material.uniforms.uExit.value = THREE.MathUtils.clamp(exit * 0.92, 0, 1);\n  }\n  semanticGroup.visible = semanticSurfaceProgress > 0.001 || semanticTextFormation > 0.001;\n  return true;\n}\n`;

replaceRegex(
  /function setSemanticVisualState\([\s\S]*?\n\}\n\nfunction setSemanticReviewState/,
  `${visualStateBlock}\nfunction setSemanticReviewState`,
  'semantic visual state',
);

const clearBlock = `function clearSemanticReviewState() {\n  if (!semanticReady) return false;\n  semanticSurfaceProgress = 0;\n  semanticTextFormation = 0;\n  semanticTextLuminance = 0;\n  semanticSweep = -0.2;\n  for (const mesh of semanticSurfaceMeshes) mesh.material.opacity = 0;\n  for (const mesh of [...semanticTextMeshes, ...semanticUnderlayMeshes]) {\n    mesh.material.uniforms.uFormation.value = 0;\n    mesh.material.uniforms.uLuminance.value = 0;\n    mesh.material.uniforms.uSweep.value = -0.2;\n    mesh.material.uniforms.uExit.value = 1;\n  }\n  semanticGroup.visible = false;\n  return true;\n}\n`;

replaceRegex(
  /function clearSemanticReviewState\(\) \{[\s\S]*?\n\}\n\nfunction semanticTimelineState/,
  `${clearBlock}\nfunction semanticTimelineState`,
  'clear semantic state',
);

replaceOnce(
  '  if (captureMode || prefersReducedMotion || !semanticReady || semanticComplete || interactionActive) return;\n',
  `  if (captureMode || !semanticReady || semanticComplete || interactionActive) return;\n  if (prefersReducedMotion) {\n    if (!semanticActive) {\n      const best = getCurrentBestFaceVisibility();\n      semanticFace = best.face || SEMANTIC_R2.selectedFallbackFace;\n      semanticVisibilityDot = best.dot;\n      semanticActive = true;\n      semanticBlocksSlices = true;\n      semanticTimeScale = 0;\n      setSemanticVisualState({ face: semanticFace, surface: 0.92, formation: 1, luminance: 0.78, sweep: 0.46, exit: 0 });\n    }\n    return;\n  }\n`,
  'reduced motion semantic state',
);

replaceOnce(
  '    config: SEMANTIC_R2,\n',
  "    config: SEMANTIC_R2,\n    r3Concept: semanticR3Concept,\n    r3ConceptConfig: SEMANTIC_R3.concepts[semanticR3Concept],\n    surfaceMeshCount: semanticSurfaceMeshes.length,\n    textMeshCount: semanticTextMeshes.length,\n    underlayMeshCount: semanticUnderlayMeshes.length,\n",
  'semantic diagnostics',
);

source = source.replaceAll('Semantic Brand Moment R2', 'Semantic Brand Face R3');

fs.writeFileSync(outMainPath, source);
fs.copyFileSync(baseGlbPath, outGlbPath);

const glb = fs.readFileSync(outGlbPath);
const glbSha = crypto.createHash('sha256').update(glb).digest('hex');
if (glbSha !== expectedGlbSha) throw new Error(`GLB SHA mismatch: ${glbSha}`);

console.log(JSON.stringify({
  baseMain: baseMainPath,
  outputMain: outMainPath,
  conceptModes: ['A', 'B', 'C'],
  glbBytes: glb.length,
  glbSha256: glbSha,
}, null, 2));
