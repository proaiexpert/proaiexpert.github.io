from pathlib import Path
import shutil, json, gzip, base64

ROOT = Path(__file__).resolve().parent
SRC = ROOT / 'proai-cube-materials-lighting-r1'
DST = ROOT / 'proai-cube-semantic-display-r1'
CONFIG = ROOT / 'proai-cube-semantic-display-r1-config.js'
FUNCTION_PARTS = sorted(ROOT.glob('proai-cube-semantic-display-r1-functions-*.js'))
CAPTURE_B64 = ROOT / 'proai-cube-semantic-display-r1-capture.mjs.gz.b64'


def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f'Anchor not found: {label}')
    return text.replace(old, new, 1)

if not SRC.exists(): raise SystemExit(f'Missing source: {SRC}')
for p in [CONFIG, CAPTURE_B64]:
    if not p.exists(): raise SystemExit(f'Missing template: {p}')
if not FUNCTION_PARTS: raise SystemExit('Missing semantic function parts')
if DST.exists(): shutil.rmtree(DST)
ignore = shutil.ignore_patterns('node_modules', 'dist', 'review', 'review-internal', 'QA.json', 'REPORT.md', 'MOTION_FREEZE.json', 'BASELINE_FREEZE.json', 'SEMANTIC_QA.json', 'static-proof')
shutil.copytree(SRC, DST, ignore=ignore)

main_path = DST / 'main.js'
main = main_path.read_text()
config = CONFIG.read_text().rstrip()
functions = ''.join(p.read_text() for p in FUNCTION_PARTS).rstrip()

main = replace_once(main,
    "const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;",
    "const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;\nconst semanticLanguage = params.get('lang') === 'ru' ? 'ru' : 'en';",
    'semantic language')
geometry_block = """const GEOMETRY_R1 = Object.freeze({
  faceOuterSize: 196.8,
  faceThickness: 3.6,
  faceCornerRadius: 10.6,
  faceBevelSize: 2.35,
  faceBevelThickness: 1.25,
  faceBevelSegments: 4,
  faceCurveSegments: 8,
  coreSize: 198.0,
  coreRadius: 9.2,
  coreSegments: 5,
});

const renderer"""
main = replace_once(main, geometry_block, geometry_block[:-len('const renderer')] + config + "\n\nconst renderer", 'semantic config')

semantic_vars = """let lastPresentationQuaternion = new THREE.Quaternion();
let semanticReady = false;
let semanticSchedulerEnabled = !captureMode && !prefersReducedMotion;
let semanticSequenceIndex = 0;
let semanticSeed = SEMANTIC_R1.cadence.seed >>> 0;
let semanticNextOpportunityAt = 0;
let semanticResumeAt = 0;
let semanticSliceResumeAt = 0;
let semanticLastFaceKey = null;
let semanticDisplayGroup = null;
let semanticSurface = null;
let semanticSurfaceMaterial = null;
let semanticTextMesh = null;
let semanticTextMaterial = null;
let semanticTextCanvas = null;
let semanticTextContext = null;
let semanticTextTexture = null;
let semanticFaceMetrics = null;
let semanticBounds = null;
let semanticResolvedFont = 'system-ui';
let semanticFontStack = SEMANTIC_R1.text.requestedFontStack;
let semanticCurrentFit = null;
let semanticActiveLook = SEMANTIC_R1.selectedLook;
let semanticSurfaceOpacity = 0;
let semanticTextOpacity = 0;
let semanticReviewActive = false;
let semanticState = { phase: 'idle', word: null, faceKey: null, earlyExit: false, readableAccumulatedMs: 0 };
let semanticEventLog = [];
let semanticLastBodyQuaternion = new THREE.Quaternion();
let semanticStats = {
  semanticActivationCount: 0,
  semanticCompletedCount: 0,
  semanticEarlyExitCount: 0,
  semanticFrames: 0,
  bodyActiveFrames: 0,
  totalReadableHoldMs: 0,
  readableEventCount: 0,
  minimumEntryFaceVisibilityDot: Infinity,
  minimumActiveFaceVisibilityDot: Infinity,
  maxSimultaneousSemanticFaces: 1,
};"""
main = replace_once(main, "let lastPresentationQuaternion = new THREE.Quaternion();", semantic_vars, 'semantic vars')
main = replace_once(main, "  ready: false,\n  motionState,", "  ready: false,\n  semanticReady: false,\n  motionState,", 'api semantic ready')
main = replace_once(main,
    "  getReviewPresentationSample,\n  setLookDevPreset,",
    "  getReviewPresentationSample,\n  semanticConfig: SEMANTIC_R1,\n  getSemanticDiagnostics,\n  runSemanticStringFitQA,\n  runSemanticFaceAnchorQA,\n  selectSemanticFace,\n  prepareReviewSemantic,\n  setReviewSemanticVisual,\n  clearReviewSemantic,\n  advanceReviewSemanticExit,\n  semanticTransitionAt,\n  beginSemanticQA,\n  getCameraSnapshot() {\n    return {\n      position: camera.position.toArray(),\n      quaternion: camera.quaternion.toArray(),\n      target: controls.target.toArray(),\n    };\n  },\n  setSemanticLookVariant: applySemanticLookVariant,\n  stopSemanticScheduler() { semanticSchedulerEnabled = false; },\n  startSemanticScheduler() { if (!prefersReducedMotion && !captureMode) semanticSchedulerEnabled = true; },\n  setLookDevPreset,",
    'semantic api')
main = replace_once(main, "window.__PROAI_CUBE_ML_R1 = api;", "window.__PROAI_CUBE_ML_R1 = api;\nwindow.__PROAI_CUBE_SEMANTIC_R1 = api;", 'semantic api alias')
main = replace_once(main, "function presentationAutonomyBlocked() {", functions + "\n\nfunction presentationAutonomyBlocked() {", 'semantic functions')
main = replace_once(main,
    "function sliceAutonomyBlocked() {\n  return interactionActive || performance.now() < sliceResumeAt;\n}",
    "function sliceAutonomyBlocked() {\n  return semanticBaseSliceBlocked() || semanticBlocksNewSlices();\n}",
    'semantic slice gate')
main = replace_once(main,
    "controls.addEventListener('start', () => {\n  interactionActive = true;",
    "controls.addEventListener('start', () => {\n  interactionActive = true;\n  requestSemanticExit('interaction', performance.now(), true);\n  semanticResumeAt = Infinity;",
    'semantic interaction exit')
main = replace_once(main,
    "  presentationResumeStart = manualResumeAt;\n  presentationResumeFrom.copy(presentationRig.quaternion);\n});",
    "  presentationResumeStart = manualResumeAt;\n  presentationResumeFrom.copy(presentationRig.quaternion);\n  semanticResumeAt = now + MOTION.manualResumeDelayMs + MOTION.manualResumeBlendMs + 420;\n});",
    'semantic interaction resume')
main = replace_once(main,
    "function render(now) {\n  updatePresentationMotion(now);\n  controls.update();",
    "function render(now) {\n  updatePresentationMotion(now);\n  updateSemanticRuntime(now);\n  controls.update();",
    'semantic runtime update')
main = replace_once(main, "    frameCamera();\n    resize();", "    initializeSemanticDisplay();\n    frameCamera();\n    resize();", 'semantic init')
main = replace_once(main,
    "    status.textContent = 'Three.js GLB loaded. Geometry R1 + Motion R1.2 frozen. Materials + Lighting R1 ready.';",
    "    status.textContent = 'Geometry R1 + Motion R1.2 + Materials/Lighting R1 frozen. Semantic Display R1 ready.';",
    'semantic status')
main = replace_once(main, "    lookDev: {\n      config: LOOKDEV_R1,", "    semantic: getSemanticDiagnostics(),\n    lookDev: {\n      config: LOOKDEV_R1,", 'semantic diagnostics')
main_path.write_text(main)

pkg_path = DST / 'package.json'
pkg = json.loads(pkg_path.read_text())
pkg['name'] = 'proai-cube-semantic-display-r1'
pkg_path.write_text(json.dumps(pkg, indent=2) + '\n')
index_path = DST / 'index.html'
index_path.write_text(index_path.read_text().replace('Materials + Lighting R1', 'Semantic Display R1'))
capture_bytes = gzip.decompress(base64.b64decode(CAPTURE_B64.read_text().strip()))
(DST / 'capture.mjs').write_bytes(capture_bytes)
print(DST)
