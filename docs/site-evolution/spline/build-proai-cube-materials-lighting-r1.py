from pathlib import Path
import json
import re
import shutil

ROOT = Path(__file__).resolve().parent
SRC = ROOT / 'proai-cube-presentation-motion-r1-2'
DST = ROOT / 'proai-cube-materials-lighting-r1'

if not SRC.exists():
    raise SystemExit(f'Missing R1.2 baseline: {SRC}')
if DST.exists():
    shutil.rmtree(DST)

IGNORE = shutil.ignore_patterns('node_modules', 'dist', 'review', 'review-internal', 'QA.json', 'REPORT.md', 'MOTION_FREEZE.json')
shutil.copytree(SRC, DST, ignore=IGNORE)


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise SystemExit(f'Anchor not found: {label}')
    return text.replace(old, new, 1)


def sub_once(text: str, pattern: str, replacement: str, label: str) -> str:
    out, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise SystemExit(f'Regex anchor not found: {label} ({count})')
    return out

main_path = DST / 'main.js'
main = main_path.read_text()

main = replace_once(
    main,
    "import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';",
    "import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';\nimport { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';",
    'RectAreaLight import',
)

main = replace_once(main, "renderer.toneMappingExposure = 1.08;", "renderer.toneMappingExposure = 0.96;", 'exposure')
main = replace_once(main, "renderer.setClearColor(0x07090c, 1);", "renderer.setClearColor(0x050607, 1);", 'clear color')

old_environment = """const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07090c);
if (!captureMode) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const roomEnvironment = new RoomEnvironment();
  scene.environment = pmrem.fromScene(roomEnvironment, 0.035).texture;
  roomEnvironment.dispose();
  pmrem.dispose();
}
"""
new_environment = """const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050607);
RectAreaLightUniformsLib.init();

function createStudioCard(environmentScene, { position, width, height, color, intensity }) {
  const geometry = new THREE.PlaneGeometry(width, height);
  const cardColor = new THREE.Color(color).multiplyScalar(intensity);
  const material = new THREE.MeshBasicMaterial({
    color: cardColor,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const card = new THREE.Mesh(geometry, material);
  card.position.fromArray(position);
  card.lookAt(0, 0, 0);
  environmentScene.add(card);
  return card;
}

function createPremiumStudioEnvironment(pmrem) {
  const environmentScene = new THREE.Scene();
  environmentScene.background = new THREE.Color(0x020304);
  const cards = [
    createStudioCard(environmentScene, { position: [4.8, 3.6, 5.8], width: 7.8, height: 4.8, color: 0xf2f4f7, intensity: 2.25 }),
    createStudioCard(environmentScene, { position: [-5.8, 1.4, 3.9], width: 3.2, height: 6.4, color: 0xaab2bc, intensity: 1.28 }),
    createStudioCard(environmentScene, { position: [-3.8, 4.6, -5.6], width: 2.4, height: 7.4, color: 0xffffff, intensity: 1.75 }),
    createStudioCard(environmentScene, { position: [2.6, -4.8, -2.8], width: 5.6, height: 2.0, color: 0x7d858f, intensity: 0.72 }),
  ];
  const texture = pmrem.fromScene(environmentScene, 0.055, 0.1, 30).texture;
  for (const card of cards) {
    card.geometry.dispose();
    card.material.dispose();
  }
  return texture;
}

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = createPremiumStudioEnvironment(pmrem);
pmrem.dispose();
"""
main = replace_once(main, old_environment, new_environment, 'environment block')

old_lookdev = """// Temporary neutral studio baseline for geometry inspection only.
scene.add(new THREE.HemisphereLight(0xdce3ec, 0x090b0f, 1.05));
const key = new THREE.DirectionalLight(0xffffff, 4.45);
key.position.set(6.4, 8.2, 5.2);
scene.add(key);
const fill = new THREE.DirectionalLight(0xaeb9c8, 1.35);
fill.position.set(-5.6, 2.4, 3.8);
scene.add(fill);
const rim = new THREE.DirectionalLight(0xffffff, 2.35);
rim.position.set(-2.8, 4.8, -6.8);
scene.add(rim);

const faceMaterial = new THREE.MeshStandardMaterial({
  color: 0x424851,
  metalness: 0.72,
  roughness: 0.295,
  envMapIntensity: 0.95,
});
const coreMaterial = new THREE.MeshStandardMaterial({
  color: 0x090c11,
  metalness: 0.34,
  roughness: 0.46,
  envMapIntensity: 0.58,
});
"""
new_lookdev = """// Materials + Lighting R1: restrained graphite / gunmetal / black-chrome hierarchy.
const LOOKDEV_R1 = Object.freeze({
  selectedPreset: 'premiumHybrid',
  materialGroups: Object.freeze({
    graphiteFace: Object.freeze({ color: '#171b20', metalness: 0.90, roughness: 0.245, clearcoat: 0.22, clearcoatRoughness: 0.17, envMapIntensity: 1.34 }),
    gunmetalFace: Object.freeze({ color: '#20262d', metalness: 0.88, roughness: 0.205, clearcoat: 0.28, clearcoatRoughness: 0.14, envMapIntensity: 1.42 }),
    blackChromeFace: Object.freeze({ color: '#0d1014', metalness: 0.96, roughness: 0.165, clearcoat: 0.20, clearcoatRoughness: 0.12, envMapIntensity: 1.52 }),
    smokedCore: Object.freeze({ color: '#07090b', metalness: 0.62, roughness: 0.385, clearcoat: 0.08, clearcoatRoughness: 0.25, envMapIntensity: 0.72 }),
  }),
  environment: Object.freeze({ method: 'procedural PMREM studio reflection cards', cardCount: 4, sigma: 0.055, externalTextures: 0 }),
  lighting: Object.freeze({ hemisphereIntensity: 0.34, keyIntensity: 8.6, fillIntensity: 2.65, rimIntensity: 6.9, rectAreaLights: 3 }),
  colorManagement: Object.freeze({ outputColorSpace: 'SRGBColorSpace', toneMapping: 'ACESFilmicToneMapping', exposure: 0.96 }),
  postprocessing: 'NONE',
});

const LOOKDEV_PRESETS = Object.freeze({
  roughGraphite: Object.freeze({
    graphiteFace: { color: '#1a1e23', metalness: 0.82, roughness: 0.34, clearcoat: 0.10, clearcoatRoughness: 0.24, envMapIntensity: 1.16 },
    gunmetalFace: { color: '#1c2127', metalness: 0.84, roughness: 0.31, clearcoat: 0.12, clearcoatRoughness: 0.22, envMapIntensity: 1.18 },
    blackChromeFace: { color: '#111419', metalness: 0.87, roughness: 0.29, clearcoat: 0.12, clearcoatRoughness: 0.21, envMapIntensity: 1.20 },
  }),
  gunmetal: Object.freeze({
    graphiteFace: { color: '#171b20', metalness: 0.90, roughness: 0.23, clearcoat: 0.20, clearcoatRoughness: 0.16, envMapIntensity: 1.34 },
    gunmetalFace: { color: '#20262d', metalness: 0.91, roughness: 0.20, clearcoat: 0.25, clearcoatRoughness: 0.14, envMapIntensity: 1.42 },
    blackChromeFace: { color: '#101318', metalness: 0.93, roughness: 0.19, clearcoat: 0.22, clearcoatRoughness: 0.14, envMapIntensity: 1.46 },
  }),
  blackChrome: Object.freeze({
    graphiteFace: { color: '#111419', metalness: 0.95, roughness: 0.18, clearcoat: 0.26, clearcoatRoughness: 0.12, envMapIntensity: 1.52 },
    gunmetalFace: { color: '#151a20', metalness: 0.95, roughness: 0.16, clearcoat: 0.30, clearcoatRoughness: 0.10, envMapIntensity: 1.58 },
    blackChromeFace: { color: '#090b0e', metalness: 0.98, roughness: 0.12, clearcoat: 0.28, clearcoatRoughness: 0.09, envMapIntensity: 1.68 },
  }),
  premiumHybrid: LOOKDEV_R1.materialGroups,
});

function physicalMaterial(spec) {
  return new THREE.MeshPhysicalMaterial({
    color: spec.color,
    metalness: spec.metalness,
    roughness: spec.roughness,
    clearcoat: spec.clearcoat,
    clearcoatRoughness: spec.clearcoatRoughness,
    envMapIntensity: spec.envMapIntensity,
  });
}

const faceGraphiteMaterial = physicalMaterial(LOOKDEV_R1.materialGroups.graphiteFace);
const faceGunmetalMaterial = physicalMaterial(LOOKDEV_R1.materialGroups.gunmetalFace);
const faceBlackChromeMaterial = physicalMaterial(LOOKDEV_R1.materialGroups.blackChromeFace);
const coreMaterial = physicalMaterial(LOOKDEV_R1.materialGroups.smokedCore);
const faceMaterial = faceGraphiteMaterial;
const premiumMaterials = Object.freeze({
  graphiteFace: faceGraphiteMaterial,
  gunmetalFace: faceGunmetalMaterial,
  blackChromeFace: faceBlackChromeMaterial,
  smokedCore: coreMaterial,
});
let activeLookDevPreset = LOOKDEV_R1.selectedPreset;
let materialAssignmentCounts = { graphiteFace: 0, gunmetalFace: 0, blackChromeFace: 0, smokedCore: 0 };
let resolvedLighting = null;

function applyMaterialSpec(material, spec) {
  material.color.set(spec.color);
  material.metalness = spec.metalness;
  material.roughness = spec.roughness;
  material.clearcoat = spec.clearcoat;
  material.clearcoatRoughness = spec.clearcoatRoughness;
  material.envMapIntensity = spec.envMapIntensity;
  material.needsUpdate = true;
}

function setLookDevPreset(name = LOOKDEV_R1.selectedPreset) {
  if (!Object.hasOwn(LOOKDEV_PRESETS, name)) return false;
  if (!captureMode && name !== LOOKDEV_R1.selectedPreset) return false;
  const preset = LOOKDEV_PRESETS[name];
  applyMaterialSpec(faceGraphiteMaterial, preset.graphiteFace);
  applyMaterialSpec(faceGunmetalMaterial, preset.gunmetalFace);
  applyMaterialSpec(faceBlackChromeMaterial, preset.blackChromeFace);
  if (name === LOOKDEV_R1.selectedPreset) applyMaterialSpec(coreMaterial, LOOKDEV_R1.materialGroups.smokedCore);
  activeLookDevPreset = name;
  if (api.ready) renderReviewFrame();
  return true;
}

const hemisphereFill = new THREE.HemisphereLight(0x78818c, 0x080a0d, LOOKDEV_R1.lighting.hemisphereIntensity);
scene.add(hemisphereFill);
const key = new THREE.RectAreaLight(0xf5f7fa, LOOKDEV_R1.lighting.keyIntensity, 1, 1);
const fill = new THREE.RectAreaLight(0xaeb7c2, LOOKDEV_R1.lighting.fillIntensity, 1, 1);
const rim = new THREE.RectAreaLight(0xffffff, LOOKDEV_R1.lighting.rimIntensity, 1, 1);
scene.add(key, fill, rim);

function configureStudioLighting(centerWorld, radius) {
  const place = (light, offset, widthScale, heightScale) => {
    light.position.copy(centerWorld).add(new THREE.Vector3(...offset).multiplyScalar(radius));
    light.width = radius * widthScale;
    light.height = radius * heightScale;
    light.lookAt(centerWorld);
  };
  place(key, [1.72, 1.42, 1.82], 2.75, 1.85);
  place(fill, [-1.62, 0.18, 1.28], 2.45, 2.20);
  place(rim, [-1.18, 1.24, -1.92], 1.05, 2.75);
  resolvedLighting = {
    hemisphere: { type: 'HemisphereLight', skyColor: '#78818c', groundColor: '#080a0d', intensity: hemisphereFill.intensity },
    key: { type: 'RectAreaLight', color: '#f5f7fa', intensity: key.intensity, width: key.width, height: key.height, position: key.position.toArray() },
    fill: { type: 'RectAreaLight', color: '#aeb7c2', intensity: fill.intensity, width: fill.width, height: fill.height, position: fill.position.toArray() },
    rim: { type: 'RectAreaLight', color: '#ffffff', intensity: rim.intensity, width: rim.width, height: rim.height, position: rim.position.toArray() },
  };
}
"""
main = replace_once(main, old_lookdev, new_lookdev, 'lookdev block')

old_classifier = """function classifyReviewMaterial(mesh) {
  if (!mesh.geometry) return faceMaterial;
  mesh.geometry.computeBoundingBox();
  const size = new THREE.Vector3();
  mesh.geometry.boundingBox?.getSize(size);
  const dimensions = [Math.abs(size.x), Math.abs(size.y), Math.abs(size.z)].sort((a, b) => a - b);
  return dimensions[0] < dimensions[2] * 0.12 ? faceMaterial : coreMaterial;
}
"""
new_classifier = """function classifyReviewMaterial(mesh) {
  if (!mesh.geometry) return faceMaterial;
  mesh.geometry.computeBoundingBox();
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  mesh.geometry.boundingBox?.getSize(size);
  mesh.geometry.boundingBox?.getCenter(center);
  const dimensions = [Math.abs(size.x), Math.abs(size.y), Math.abs(size.z)].sort((a, b) => a - b);
  const isFace = dimensions[0] < dimensions[2] * 0.12;
  if (!isFace) {
    materialAssignmentCounts.smokedCore += 1;
    return coreMaterial;
  }

  mesh.updateWorldMatrix(true, false);
  const sceneLocalCenter = sceneOne.worldToLocal(mesh.localToWorld(center.clone()));
  const relative = sceneLocalCenter.sub(cubeCenterLocal);
  const ax = Math.abs(relative.x);
  const ay = Math.abs(relative.y);
  const az = Math.abs(relative.z);
  if (ay >= ax && ay >= az) {
    materialAssignmentCounts.gunmetalFace += 1;
    return faceGunmetalMaterial;
  }
  if (ax >= az) {
    materialAssignmentCounts.blackChromeFace += 1;
    return faceBlackChromeMaterial;
  }
  materialAssignmentCounts.graphiteFace += 1;
  return faceGraphiteMaterial;
}
"""
main = replace_once(main, old_classifier, new_classifier, 'material classifier')

main = replace_once(main, "  renderReviewFrame,\n  captureFrame", "  setLookDevPreset,\n  renderReviewFrame,\n  captureFrame", 'api lookdev method')
main = replace_once(main, "window.__PROAI_CUBE_R1 = api;", "window.__PROAI_CUBE_R1 = api;\nwindow.__PROAI_CUBE_ML_R1 = api;", 'lookdev api alias')

main = replace_once(
    main,
    "  controls.maxDistance = distance * 1.28;\n  controls.update();",
    "  controls.maxDistance = distance * 1.28;\n  configureStudioLighting(centerWorld, radius);\n  controls.update();",
    'lighting fit',
)

main = replace_once(
    main,
    "    geometryConfig: GEOMETRY_R1,\n    renderer: {",
    "    geometryConfig: GEOMETRY_R1,\n    lookDev: {\n      config: LOOKDEV_R1,\n      activePreset: activeLookDevPreset,\n      materialAssignments: { ...materialAssignmentCounts },\n      lighting: resolvedLighting,\n      environment: LOOKDEV_R1.environment,\n      colorManagement: LOOKDEV_R1.colorManagement,\n      postprocessing: LOOKDEV_R1.postprocessing,\n      materialTypes: Object.fromEntries(Object.entries(premiumMaterials).map(([name, material]) => [name, material.type])),\n    },\n    renderer: {",
    'diagnostics lookdev',
)
main = replace_once(
    main,
    "      pixelRatio: renderer.getPixelRatio(),\n    },",
    "      pixelRatio: renderer.getPixelRatio(),\n      calls: renderer.info.render.calls,\n      triangles: renderer.info.render.triangles,\n    },",
    'renderer diagnostics',
)

main = replace_once(
    main,
    "    cubeRoot.traverse((object) => {\n      if (object.isMesh && object.name !== 'Plane') {\n        object.material = classifyReviewMaterial(object);",
    "    materialAssignmentCounts = { graphiteFace: 0, gunmetalFace: 0, blackChromeFace: 0, smokedCore: 0 };\n    cubeRoot.updateMatrixWorld(true);\n    cubeRoot.traverse((object) => {\n      if (object.isMesh && object.name !== 'Plane') {\n        object.material = classifyReviewMaterial(object);",
    'material assignment reset',
)
main = replace_once(
    main,
    "status.textContent = 'Three.js GLB loaded. Geometry R1 frozen. Presentation Motion R1.2 dual-motion ready.';",
    "status.textContent = 'Three.js GLB loaded. Geometry R1 + Motion R1.2 frozen. Materials + Lighting R1 ready.';",
    'status',
)

main_path.write_text(main)

# Minimal neutral review field only; not final Hero background.
styles_path = DST / 'styles.css'
styles = styles_path.read_text()
styles = styles.replace('#07090c', '#050607')
styles = styles.replace(
    'radial-gradient(circle at 52% 44%, rgba(49, 56, 68, 0.18), rgba(5, 6, 7, 0) 52%),',
    'radial-gradient(circle at 52% 44%, rgba(39, 44, 52, 0.13), rgba(5, 6, 7, 0) 54%),',
)
styles_path.write_text(styles)

package_path = DST / 'package.json'
package = json.loads(package_path.read_text())
package['name'] = 'proai-cube-materials-lighting-r1'
package['version'] = '0.1.0'
package_path.write_text(json.dumps(package, indent=2) + '\n')

capture_path = DST / 'capture.mjs'
capture = capture_path.read_text()
capture = capture.replace("process.env.PROAI_PRESENTATION_R1_2_URL", "process.env.PROAI_MATERIALS_LIGHTING_R1_URL")
capture = capture.replace("const VIDEO_VIEWPORT = { width: 640, height: 760 };", "const VIDEO_VIEWPORT = { width: 1080, height: 1080 };")
capture = capture.replace("const SCREENSHOT_VIEWPORT = { width: 900, height: 1040 };", "const SCREENSHOT_VIEWPORT = { width: 1440, height: 1440 };")
capture = capture.replace("proai-cube-presentation-motion-r1-2-review-27s.mp4", "proai-cube-materials-lighting-r1-review-27s.mp4")
capture = capture.replace("proai-cube-presentation-motion-r1-2-natural.png", "proai-cube-materials-lighting-r1-natural.png")
capture = capture.replace("proai-cube-presentation-motion-r1-2-simultaneous.png", "proai-cube-materials-lighting-r1-slice-state.png")
capture = capture.replace("proai-cube-presentation-motion-r1-2-paired.png", "proai-cube-materials-lighting-r1-paired-state.png")
capture = capture.replace("proai-cube-presentation-motion-r1-2-large-angle.png", "proai-cube-materials-lighting-r1-moving-highlight-large-angle.png")
capture = replace_once(
    capture,
    "const LARGE_PATH = path.join(REVIEW, 'proai-cube-materials-lighting-r1-moving-highlight-large-angle.png');",
    "const LARGE_PATH = path.join(REVIEW, 'proai-cube-materials-lighting-r1-moving-highlight-large-angle.png');\nconst FRONT_PATH = path.join(REVIEW, 'proai-cube-materials-lighting-r1-front-lighting.png');\nconst DARK_PATH = path.join(REVIEW, 'proai-cube-materials-lighting-r1-dark-side.png');\nconst INTERNAL_REVIEW = path.join(ROOT, 'review-internal');",
    'capture paths',
)
capture = replace_once(capture, "fs.mkdirSync(REVIEW, { recursive: true });", "fs.mkdirSync(REVIEW, { recursive: true });\nfs.mkdirSync(INTERNAL_REVIEW, { recursive: true });", 'internal review dir')
capture = capture.replace("toDataURL('image/jpeg', 0.91)", "toDataURL('image/jpeg', 0.90)")
capture = capture.replace("Presentation R1.2 fixed frame", "Materials + Lighting R1 fixed frame")

capture = replace_once(
    capture,
    "  await page.waitForFunction(() => window.__PROAI_CUBE_R1_2?.ready === true, null, { timeout: 90000 });\n  return page;",
    "  await page.waitForFunction(() => window.__PROAI_CUBE_R1_2?.ready === true, null, { timeout: 90000 });\n  await page.evaluate(() => { const el = document.querySelector('.status'); if (el) el.style.display = 'none'; });\n  return page;",
    'hide status in evidence',
)

capture = replace_once(
    capture,
    "const geometryCodeFrozen = process.env.PROAI_GEOMETRY_CODE_FROZEN === '1';",
    "const geometryCodeFrozen = process.env.PROAI_GEOMETRY_CODE_FROZEN === '1';\nconst motionCodeFrozen = process.env.PROAI_MOTION_CODE_FROZEN === '1';",
    'motion freeze flag',
)

static_anchor = "await captureScreenshot(LARGE_PATH, () => window.__PROAI_CUBE_R1_2.setReviewPresentation(18.25));"
static_extra = """await captureScreenshot(LARGE_PATH, () => window.__PROAI_CUBE_R1_2.setReviewPresentation(18.25));
await captureScreenshot(FRONT_PATH, () => window.__PROAI_CUBE_R1_2.setReviewPresentation(0.8));
await captureScreenshot(DARK_PATH, () => window.__PROAI_CUBE_R1_2.setReviewPresentation(14.9));

// Internal restrained look-dev comparison. These files are uploaded as CI evidence but removed before the final commit.
const presetPage = await openPage({ width: 1080, height: 1080 });
for (const preset of ['roughGraphite', 'gunmetal', 'blackChrome', 'premiumHybrid']) {
  await presetPage.evaluate((name) => {
    const api = window.__PROAI_CUBE_R1_2;
    api.setLookDevPreset(name);
    api.setReviewPresentation(7.4);
  }, preset);
  await presetPage.screenshot({ path: path.join(INTERNAL_REVIEW, `${preset}.png`) });
}
await presetPage.close();

const perfPage = await openPage({ width: 960, height: 960 });
const renderBenchmark = await perfPage.evaluate(() => {
  const api = window.__PROAI_CUBE_R1_2;
  const frames = 24;
  const start = performance.now();
  for (let i = 0; i < frames; i += 1) {
    api.setReviewPresentation(4.0 + i * 0.08, 1, false);
    api.renderReviewFrame();
  }
  const totalMs = performance.now() - start;
  return { frames, totalMs, avgRenderMs: totalMs / frames };
});
await perfPage.close();"""
capture = replace_once(capture, static_anchor, static_extra, 'extra screenshots and lookdev comparison')

capture = replace_once(
    capture,
    "const runtimePass = pageErrors.length === 0 && consoleErrors.length === 0 && forbiddenRequests.length === 0;",
    "const runtimePass = pageErrors.length === 0 && consoleErrors.length === 0 && forbiddenRequests.length === 0;\nconst lookDev = finalVideoDiag.lookDev;\nconst faceAssignments = (lookDev?.materialAssignments?.graphiteFace || 0) + (lookDev?.materialAssignments?.gunmetalFace || 0) + (lookDev?.materialAssignments?.blackChromeFace || 0);\nconst lookDevPass = lookDev?.activePreset === 'premiumHybrid'\n  && faceAssignments === 180\n  && lookDev?.materialAssignments?.smokedCore === 30\n  && lookDev?.config?.lighting?.rectAreaLights === 3\n  && lookDev?.environment?.externalTextures === 0\n  && lookDev?.postprocessing === 'NONE';",
    'lookdev pass',
)

capture = replace_once(
    capture,
    "const allPass = geometryConfigFrozen && geometryStatsFrozen && geometryCodeFrozen && analytic360Pass",
    "const allPass = geometryConfigFrozen && geometryStatsFrozen && geometryCodeFrozen && motionCodeFrozen && lookDevPass && analytic360Pass",
    'all pass freeze/lookdev',
)

capture = capture.replace("implementationBaseBranch: 'agent/proai-cube-presentation-motion-r1',", "implementationBaseBranch: 'agent/proai-cube-presentation-motion-r1-2',")
capture = capture.replace("implementationBaseCommit: 'd176101a818a9f7b00963a4ece13cd90d222a21c',", "implementationBaseCommit: '89965750e4456a6e2d54d8309809471f8dbfcc75',")
capture = capture.replace("branch: 'agent/proai-cube-presentation-motion-r1-2',", "branch: 'agent/proai-cube-materials-lighting-r1',")
capture = capture.replace("prototypePath: 'docs/site-evolution/spline/proai-cube-presentation-motion-r1-2/',", "prototypePath: 'docs/site-evolution/spline/proai-cube-materials-lighting-r1/',")

capture = replace_once(
    capture,
    "  geometryFreeze: { config: initialDiagnostics.geometryConfig, stats: initialDiagnostics.geometry, configFrozen: geometryConfigFrozen, statsFrozen: geometryStatsFrozen, codeFrozen: geometryCodeFrozen, pass: geometryConfigFrozen && geometryStatsFrozen && geometryCodeFrozen },",
    "  geometryFreeze: { config: initialDiagnostics.geometryConfig, stats: initialDiagnostics.geometry, configFrozen: geometryConfigFrozen, statsFrozen: geometryStatsFrozen, codeFrozen: geometryCodeFrozen, pass: geometryConfigFrozen && geometryStatsFrozen && geometryCodeFrozen },\n  motionFreeze: { codeFrozen: motionCodeFrozen, motionConfig: initialDiagnostics.motionConfig, presentationConfig: initialDiagnostics.presentationConfig, sliceConfig: initialDiagnostics.sliceConfig, pass: motionCodeFrozen },\n  lookDev,\n  performance: { softwareCIRenderBenchmark: renderBenchmark, note: 'SwiftShader CI benchmark; diagnostic only, not a device FPS claim.' },",
    'qa lookdev/freeze',
)

capture = replace_once(
    capture,
    "    geometryR1Preserved: geometryConfigFrozen && geometryStatsFrozen && geometryCodeFrozen ? 'PASS' : 'FAIL',",
    "    geometryR1Preserved: geometryConfigFrozen && geometryStatsFrozen && geometryCodeFrozen ? 'PASS' : 'FAIL',\n    motionR1_2Preserved: motionCodeFrozen ? 'PASS' : 'FAIL',\n    materialsLightingR1: lookDevPass ? 'PASS' : 'FAIL',\n    glbUnchanged: sha256(GLB_PATH) === 'dbb7fc4156f8c9ed2481dd76443dffb9a45ecb5493463f99bffb34dd3b59c79b' ? 'PASS' : 'FAIL',",
    'acceptance lookdev',
)

report_pattern = r"const p = initialDiagnostics\.presentationConfig;.*?fs\.writeFileSync\(REPORT_PATH, report\);"
report_replacement = r'''const p = initialDiagnostics.presentationConfig;
const s = initialDiagnostics.sliceConfig;
const m = lookDev.config.materialGroups;
const l = lookDev.lighting;
const report = `# ProAI Rubik Cube — Materials + Lighting R1\n\n## Scope\n\nLook-development pass built from owner-approved Presentation Motion R1.2 commit \`89965750e4456a6e2d54d8309809471f8dbfcc75\`. Geometry R1 and all motion/mechanical/interaction logic are frozen.\n\n## Final PBR material hierarchy\n\n- Graphite face: color **${m.graphiteFace.color}**, metalness **${m.graphiteFace.metalness}**, roughness **${m.graphiteFace.roughness}**, clearcoat **${m.graphiteFace.clearcoat}**, clearcoat roughness **${m.graphiteFace.clearcoatRoughness}**, env intensity **${m.graphiteFace.envMapIntensity}**.\n- Gunmetal face: color **${m.gunmetalFace.color}**, metalness **${m.gunmetalFace.metalness}**, roughness **${m.gunmetalFace.roughness}**, clearcoat **${m.gunmetalFace.clearcoat}**, clearcoat roughness **${m.gunmetalFace.clearcoatRoughness}**, env intensity **${m.gunmetalFace.envMapIntensity}**.\n- Black-chrome face: color **${m.blackChromeFace.color}**, metalness **${m.blackChromeFace.metalness}**, roughness **${m.blackChromeFace.roughness}**, clearcoat **${m.blackChromeFace.clearcoat}**, clearcoat roughness **${m.blackChromeFace.clearcoatRoughness}**, env intensity **${m.blackChromeFace.envMapIntensity}**.\n- Smoked core: color **${m.smokedCore.color}**, metalness **${m.smokedCore.metalness}**, roughness **${m.smokedCore.roughness}**, clearcoat **${m.smokedCore.clearcoat}**, clearcoat roughness **${m.smokedCore.clearcoatRoughness}**, env intensity **${m.smokedCore.envMapIntensity}**.\n\nMaterial assignment counts: graphite ${lookDev.materialAssignments.graphiteFace}, gunmetal ${lookDev.materialAssignments.gunmetalFace}, black-chrome ${lookDev.materialAssignments.blackChromeFace}, core ${lookDev.materialAssignments.smokedCore}.\n\n## Lighting / reflections\n\n- Environment: **${lookDev.environment.method}**, ${lookDev.environment.cardCount} broad cards, PMREM sigma ${lookDev.environment.sigma}, external textures ${lookDev.environment.externalTextures}.\n- Key: **${l.key.type}**, intensity ${l.key.intensity}, size ${l.key.width.toFixed(2)} × ${l.key.height.toFixed(2)}, position [${l.key.position.map((v) => v.toFixed(2)).join(', ')}].\n- Fill: **${l.fill.type}**, intensity ${l.fill.intensity}, size ${l.fill.width.toFixed(2)} × ${l.fill.height.toFixed(2)}, position [${l.fill.position.map((v) => v.toFixed(2)).join(', ')}].\n- Rim: **${l.rim.type}**, intensity ${l.rim.intensity}, size ${l.rim.width.toFixed(2)} × ${l.rim.height.toFixed(2)}, position [${l.rim.position.map((v) => v.toFixed(2)).join(', ')}].\n- Hemisphere fill: intensity ${l.hemisphere.intensity}, sky ${l.hemisphere.skyColor}, ground ${l.hemisphere.groundColor}.\n- Tone mapping: **${lookDev.colorManagement.toneMapping}**; exposure **${lookDev.colorManagement.exposure}**; output **${lookDev.colorManagement.outputColorSpace}**.\n- Postprocessing: **${lookDev.postprocessing}**.\n\n## Motion freeze\n\n- Motion R1.2 code freeze: **${qa.acceptance.motionR1_2Preserved}**.\n- Normal yaw: **${p.normalYawVelocityDegPerSec.join('–')}°/s**; inspection **${p.inspectionYawVelocityDegPerSec.join('–')}°/s**; pitch ±${p.pitchEnvelopeDeg}°; roll ±${p.rollEnvelopeDeg}°.\n- Slice duration: **${s.turnDurationRangeMs.join('–')} ms**; normal gaps ${s.typicalGapRangeMs.join('–')} ms; breathing ${s.breathingGapRangeMs.join('–')} ms; paired stagger ${s.pairedStaggerRangeMs.join('–')} ms.\n- No motion timing values changed.\n\n## QA\n\n- Geometry R1 preserved: **${qa.acceptance.geometryR1Preserved}**.\n- Motion R1.2 preserved: **${qa.acceptance.motionR1_2Preserved}**.\n- Materials + Lighting gate: **${qa.acceptance.materialsLightingR1}**.\n- GLB unchanged: **${qa.acceptance.glbUnchanged}**.\n- X / Y / Z: **${qa.acceptance.X} / ${qa.acceptance.Y} / ${qa.acceptance.Z}**.\n- 30 mixed turns: **${qa.acceptance.repeatability30}**; max position ${mechanicalQA.repeatability30.maxCanonicalPosition}; quaternion ${mechanicalQA.repeatability30.maxCanonicalQuaternionRad}; scale ${mechanicalQA.repeatability30.maxCanonicalScale}.\n- Paired-turn safety/inverse: **${qa.acceptance.pairedTurns}**; physical cubie intersection ${mechanicalQA.pairedTurnQA.physicalCubieIntersectionCount}.\n- Inverse restoration: **${qa.acceptance.inverseRestoration}**.\n- Interaction: **${qa.acceptance.interaction}**.\n- Browser/runtime: **${qa.acceptance.runtime}**; Spline **${qa.acceptance.splineDependency}**.\n- Software-CI render benchmark: ${renderBenchmark.avgRenderMs.toFixed(2)} ms/frame at 960×960 (diagnostic only).\n- Owner MP4: **${qa.acceptance.ownerReviewMP4}**, ${expectedDurationSec.toFixed(3)} s @ ${FPS} fps, H.264/yuv420p, ${VIDEO_VIEWPORT.width}×${VIDEO_VIEWPORT.height}.\n\n## Review evidence\n\n- \`review/proai-cube-materials-lighting-r1-natural.png\`\n- \`review/proai-cube-materials-lighting-r1-front-lighting.png\`\n- \`review/proai-cube-materials-lighting-r1-dark-side.png\`\n- \`review/proai-cube-materials-lighting-r1-moving-highlight-large-angle.png\`\n- \`review/proai-cube-materials-lighting-r1-paired-state.png\`\n- \`review/proai-cube-materials-lighting-r1-slice-state.png\`\n- \`review/proai-cube-materials-lighting-r1-review-27s.mp4\` (primary)\n- \`QA.json\`\n\n## Gate\n\nAutomated acceptance: **${qa.acceptance.overall}**. Semantic Display remains blocked pending owner visual approval of this Materials + Lighting pass.\n`;
fs.writeFileSync(REPORT_PATH, report);'''
capture = sub_once(capture, report_pattern, report_replacement, 'report replacement')

capture_path.write_text(capture)

# Keep generated evidence out of source-control until the workflow produces final evidence.
(DST / '.gitignore').write_text('node_modules/\ndist/\nreview-internal/\n')

print(f'Generated {DST}')
