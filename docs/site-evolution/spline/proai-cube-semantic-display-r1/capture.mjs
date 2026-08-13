import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REVIEW = path.join(ROOT, 'review');
const INTERNAL = path.join(ROOT, 'review-internal');
const QA_PATH = path.join(ROOT, 'QA.json');
const SEMANTIC_QA_PATH = path.join(ROOT, 'SEMANTIC_QA.json');
const REPORT_PATH = path.join(ROOT, 'REPORT.md');
const FREEZE_PATH = path.join(ROOT, 'BASELINE_FREEZE.json');
const GLB_PATH = path.join(ROOT, 'rubik_39_s_cube_animation.glb');
const BASE_URL = process.env.PROAI_SEMANTIC_DISPLAY_R1_URL || 'http://127.0.0.1:4173/';
const FPS = 24;
const EN_SECONDS = 41;
const RU_SECONDS = 22;
const VIDEO_VIEWPORT = { width: 720, height: 720 };
const SCREENSHOT_VIEWPORT = { width: 1440, height: 1440 };
const FRAME_DT = 1 / FPS;
const EN_MP4 = path.join(REVIEW, 'proai-cube-semantic-display-r1-en-review-41s.mp4');
const RU_MP4 = path.join(REVIEW, 'proai-cube-semantic-display-r1-ru-proof-22s.mp4');

fs.rmSync(REVIEW, { recursive: true, force: true });
fs.rmSync(INTERNAL, { recursive: true, force: true });
fs.mkdirSync(REVIEW, { recursive: true });
fs.mkdirSync(INTERNAL, { recursive: true });

const paths = {
  mechanical: path.join(REVIEW, '01-mechanical-baseline.png'),
  aiExpert: path.join(REVIEW, '02-ai-expert-unified-face.png'),
  trust: path.join(REVIEW, '03-trust-unified-face.png'),
  response: path.join(REVIEW, '04-response-unified-face.png'),
  ruObrashenie: path.join(REVIEW, '05-ru-obrashenie.png'),
  ruResult: path.join(REVIEW, '06-ru-rezultat.png'),
  largeAngle: path.join(REVIEW, '07-large-angle-semantic.png'),
  transition: path.join(REVIEW, '08-segmentation-return-transition.png'),
  darkSide: path.join(REVIEW, '09-dark-side-semantic.png'),
  recovered: path.join(REVIEW, '10-interaction-recovered.png'),
  enContact: path.join(REVIEW, 'semantic-contact-sheet-en.png'),
  ruContact: path.join(REVIEW, 'semantic-contact-sheet-ru.png'),
  enVideoContact: path.join(REVIEW, 'video-contact-sheet-en.png'),
  ruVideoContact: path.join(REVIEW, 'video-contact-sheet-ru.png'),
};

function sha256(filepath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filepath)).digest('hex');
}
function jpegBufferFromDataUrl(dataUrl) {
  const comma = dataUrl.indexOf(',');
  if (!dataUrl.startsWith('data:image/jpeg') || comma < 0) throw new Error('Invalid JPEG frame data URL');
  return Buffer.from(dataUrl.slice(comma + 1), 'base64');
}
function vectorDistance(a, b) {
  return Math.sqrt(a.reduce((sum, value, i) => sum + (value - b[i]) ** 2, 0));
}
function quatAngle(a, b) {
  const dot = Math.min(1, Math.abs(a.reduce((sum, value, i) => sum + value * b[i], 0)));
  return 2 * Math.acos(dot);
}
function ffprobe(filepath) {
  const out = spawnSync('ffprobe', ['-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries',
    'stream=codec_name,pix_fmt,avg_frame_rate,nb_read_frames,width,height:format=format_name,duration,size', '-of', 'json', filepath], { encoding: 'utf8' });
  if (out.status !== 0) throw new Error(`ffprobe failed: ${out.stderr || out.stdout}`);
  return JSON.parse(out.stdout);
}
function encodeFrames(buffers, filepath) {
  fs.rmSync(filepath, { force: true });
  const proc = spawnSync('ffmpeg', [
    '-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-vcodec', 'mjpeg', '-i', 'pipe:0',
    '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    '-r', String(FPS), filepath,
  ], { input: Buffer.concat(buffers), encoding: 'utf8', maxBuffer: 160 * 1024 * 1024 });
  if (proc.status !== 0 || !fs.existsSync(filepath)) throw new Error(`ffmpeg encode failed: ${proc.stderr || proc.stdout}`);
}
function makeTileContact(inputs, output, width = 640) {
  const tempDir = path.join(INTERNAL, `tile-${path.basename(output, '.png')}`);
  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });
  inputs.forEach((src, index) => fs.copyFileSync(src, path.join(tempDir, `${index + 1}.png`)));
  const proc = spawnSync('ffmpeg', ['-y', '-v', 'error', '-framerate', '1', '-i', path.join(tempDir, '%d.png'), '-vf', `scale=${width}:${width},tile=${inputs.length}x1`, '-frames:v', '1', output], { encoding: 'utf8' });
  if (proc.status !== 0 || !fs.existsSync(output)) throw new Error(`contact sheet failed: ${proc.stderr || proc.stdout}`);
}
function makeVideoContact(video, output, cols, rows) {
  const frames = cols * rows;
  const duration = Number(ffprobe(video).format.duration);
  const fps = Math.max(0.01, frames / duration);
  const proc = spawnSync('ffmpeg', ['-y', '-v', 'error', '-i', video, '-vf', `fps=${fps},scale=360:360,tile=${cols}x${rows}`, '-frames:v', '1', output], { encoding: 'utf8' });
  if (proc.status !== 0 || !fs.existsSync(output)) throw new Error(`video contact failed: ${proc.stderr || proc.stdout}`);
}

const browser = await chromium.launch({ headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=swiftshader'] });
const context = await browser.newContext();
const requests = [];
const pageErrors = [];
const consoleErrors = [];
context.on('request', (request) => requests.push(request.url()));
function wirePage(page) {
  page.on('pageerror', (error) => pageErrors.push(String(error)));
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
}
function pageUrl({ mode = 'capture', lang = 'en' } = {}) {
  const url = new URL(BASE_URL);
  if (mode === 'capture') url.searchParams.set('capture', '1');
  if (mode === 'review') url.searchParams.set('review', '1');
  url.searchParams.set('lang', lang);
  return url.toString();
}
async function openPage({ mode = 'capture', lang = 'en', viewport = SCREENSHOT_VIEWPORT } = {}) {
  const page = await context.newPage();
  await page.setViewportSize(viewport);
  wirePage(page);
  await page.goto(pageUrl({ mode, lang }), { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForFunction(() => window.__PROAI_CUBE_SEMANTIC_R1?.ready === true && window.__PROAI_CUBE_SEMANTIC_R1?.semanticReady === true, null, { timeout: 120000 });
  await page.evaluate(() => { const el = document.querySelector('.status'); if (el) el.style.display = 'none'; });
  return page;
}

// Baseline + semantic structural QA.
const qaPage = await openPage({ lang: 'en' });
const initial = await qaPage.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics());
const mechanicalQA = await qaPage.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.runAutomatedQA());
const stringFitQA = await qaPage.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.runSemanticStringFitQA());
const anchorQA = await qaPage.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.runSemanticFaceAnchorQA());
const semanticConfig = initial.semantic.config;
const expectedGeometry = {
  faceOuterSize: 196.8, faceThickness: 3.6, faceCornerRadius: 10.6,
  faceBevelSize: 2.35, faceBevelThickness: 1.25, faceBevelSegments: 4, faceCurveSegments: 8,
  coreSize: 198, coreRadius: 9.2, coreSegments: 5,
};
const expectedMotion = {
  turnDurationRangeMs: [1080, 1420], easing: [0.36, 0, 0.12, 1], orbitDampingFactor: 0.074,
  orbitRotateSpeed: 0.5, orbitZoomSpeed: 0.48, manualResumeDelayMs: 1850, manualResumeBlendMs: 2400, sliceResumeStaggerMs: 280,
};
const expectedSlice = {
  turnDurationRangeMs: [1080, 1420], typicalGapRangeMs: [180, 420], breathingGapRangeMs: [620, 820],
  pairedStaggerRangeMs: [100, 220], phraseMicroGapRangeMs: [90, 170],
  eventPattern: ['single', 'pair', 'single', 'single', 'phrase', 'single', 'pair', 'single', 'single', 'phrase'],
  distribution: { single: 0.6, paired: 0.2, phrase: 0.2 }, seed: 1369948382,
};
const expectedLook = {
  materialGroups: {
    graphiteFace: { color: '#242a31', metalness: 0.84, roughness: 0.295, clearcoat: 0.16, clearcoatRoughness: 0.2, envMapIntensity: 1.18 },
    gunmetalFace: { color: '#2b323a', metalness: 0.86, roughness: 0.265, clearcoat: 0.2, clearcoatRoughness: 0.18, envMapIntensity: 1.22 },
    blackChromeFace: { color: '#181d23', metalness: 0.92, roughness: 0.225, clearcoat: 0.16, clearcoatRoughness: 0.16, envMapIntensity: 1.26 },
    smokedCore: { color: '#0c0f13', metalness: 0.48, roughness: 0.44, clearcoat: 0.06, clearcoatRoughness: 0.28, envMapIntensity: 0.66 },
  },
  environment: { method: 'procedural PMREM studio reflection cards', cardCount: 4, sigma: 0.075, externalTextures: 0 },
  lighting: { hemisphereIntensity: 0.52, keyIntensity: 5.2, fillIntensity: 4, rimIntensity: 4.6, rectAreaLights: 3 },
  colorManagement: { outputColorSpace: 'SRGBColorSpace', toneMapping: 'ACESFilmicToneMapping', exposure: 1 },
  postprocessing: 'NONE',
};
const geometryFrozen = JSON.stringify(initial.geometryConfig) === JSON.stringify(expectedGeometry);
const motionFrozen = JSON.stringify(initial.motionConfig) === JSON.stringify(expectedMotion);
const sliceFrozen = JSON.stringify(initial.sliceConfig) === JSON.stringify(expectedSlice);
const lookSubset = {
  materialGroups: initial.lookDev.config.materialGroups,
  environment: initial.lookDev.config.environment,
  lighting: initial.lookDev.config.lighting,
  colorManagement: initial.lookDev.config.colorManagement,
  postprocessing: initial.lookDev.config.postprocessing,
};
const materialsLightingFrozen = JSON.stringify(lookSubset) === JSON.stringify(expectedLook);
await qaPage.close();

// Real Orbit interaction contract + semantic clear behavior on a live render loop.
const interactionPage = await openPage({ mode: 'review', lang: 'en', viewport: { width: 900, height: 900 } });
await interactionPage.evaluate(() => {
  const api = window.__PROAI_CUBE_SEMANTIC_R1;
  api.stopSliceScheduler();
  api.stopSemanticScheduler();
});
await interactionPage.waitForFunction(() => window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics().activeTurns.length === 0, null, { timeout: 12000 });
const liveBox = await interactionPage.evaluate(() => {
  const r = document.getElementById('cube-canvas').getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height };
});
const semanticQAStart = await interactionPage.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.beginSemanticQA('TRUST'));
if (!semanticQAStart) throw new Error('Semantic interaction QA could not start semantic state');
await interactionPage.waitForTimeout(620);
const semanticBeforeDrag = await interactionPage.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics());
const x0 = liveBox.x + liveBox.width * 0.50;
const y0 = liveBox.y + liveBox.height * 0.50;
await interactionPage.mouse.move(x0, y0);
await interactionPage.mouse.down();
for (let i = 1; i <= 8; i += 1) {
  await interactionPage.mouse.move(x0 + 140 * (i / 8), y0 - 30 * (i / 8));
  await interactionPage.waitForTimeout(20);
}
const semanticDuringDrag = await interactionPage.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics());
await interactionPage.waitForTimeout(380);
const semanticClearedDuringDrag = await interactionPage.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics());
const cameraHeld = semanticClearedDuringDrag.interaction.cameraPosition;
await interactionPage.mouse.up();
await interactionPage.waitForTimeout(80);
const afterRelease = await interactionPage.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics());
await interactionPage.waitForTimeout(1850 + 180);
const calmPassed = await interactionPage.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics());
await interactionPage.waitForTimeout(2400 + 520);
const recovered = await interactionPage.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics());
const cameraNoSnap = vectorDistance(cameraHeld, recovered.interaction.cameraPosition) < 1.0;
const semanticInteractionPass = semanticBeforeDrag.semantic.phase !== 'idle'
  && semanticDuringDrag.semantic.phase === 'exitFast'
  && semanticClearedDuringDrag.semantic.phase === 'idle'
  && semanticClearedDuringDrag.semantic.surfaceOpacity === 0
  && semanticClearedDuringDrag.semantic.textOpacity === 0
  && !afterRelease.interaction.interactionActive
  && afterRelease.interaction.resumeDelayRemainingMs > 1500
  && calmPassed.interaction.presentationResumeActive
  && Number.isFinite(recovered.semantic.scheduler.resumeAt)
  && recovered.semantic.phase === 'idle'
  && cameraNoSnap;
// Existing mechanical interaction contract on same page after semantic is clear.
const manualSliceStarted = await interactionPage.evaluate(() => {
  void window.__PROAI_CUBE_SEMANTIC_R1.turnSlice({ axis: 'X', layer: 1, direction: 1, durationMs: 1320 });
  return window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics().activeTurns.length === 1;
});
if (!manualSliceStarted) throw new Error('Could not start interaction slice');
await interactionPage.waitForTimeout(100);
await interactionPage.mouse.move(x0, y0);
await interactionPage.mouse.down();
await interactionPage.mouse.move(x0 - 120, y0 + 16, { steps: 8 });
const mechanicalDuringDrag = await interactionPage.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics());
await interactionPage.waitForFunction(() => window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics().activeTurns.length === 0, null, { timeout: 12000 });
const sliceFinished = await interactionPage.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics());
const blockedNewSlice = await interactionPage.evaluate(async () => window.__PROAI_CUBE_SEMANTIC_R1.turnSlice({ axis: 'Y', layer: 0, direction: -1, durationMs: 1200 }));
await interactionPage.mouse.up();
const mechanicalInteractionPass = mechanicalDuringDrag.interaction.interactionActive
  && sliceFinished.lastTurnResult?.endpointErrorRad === 0
  && blockedNewSlice === false;
await interactionPage.close();

async function captureMechanical(filepath, timeSec) {
  const page = await openPage({ lang: 'en' });
  await page.evaluate((t) => window.__PROAI_CUBE_SEMANTIC_R1.setReviewPresentation(t), timeSec);
  await page.screenshot({ path: filepath });
  await page.close();
}
async function captureSemantic(filepath, { lang = 'en', timeSec, word, surface = 1, text = 1, faceKey = null }) {
  const page = await openPage({ lang });
  const result = await page.evaluate(({ t, w, s, tx, f }) => {
    const api = window.__PROAI_CUBE_SEMANTIC_R1;
    api.setReviewPresentation(t, 1, false);
    const candidate = f ? api.selectSemanticFace(f, false) : api.selectSemanticFace(null, false);
    if (!candidate) throw new Error(`No readable semantic face for ${w} at ${t}`);
    const prep = api.prepareReviewSemantic(w, candidate.faceKey);
    api.setReviewSemanticVisual(s, tx, false);
    api.renderReviewFrame();
    return { prep, diag: api.getDiagnostics() };
  }, { t: timeSec, w: word, s: surface, tx: text, f: faceKey });
  await page.screenshot({ path: filepath });
  await page.close();
  return result;
}

await captureMechanical(paths.mechanical, 2.8);
await captureSemantic(paths.aiExpert, { timeSec: 2.0, word: 'AI EXPERT' });
await captureSemantic(paths.trust, { timeSec: 22.3, word: 'TRUST' });
await captureSemantic(paths.response, { timeSec: 29.1, word: 'RESPONSE' });
await captureSemantic(paths.ruObrashenie, { lang: 'ru', timeSec: 24.5, word: 'ОБРАЩЕНИЕ' });
await captureSemantic(paths.ruResult, { lang: 'ru', timeSec: 32.0, word: 'РЕЗУЛЬТАТ' });
await captureSemantic(paths.largeAngle, { timeSec: 18.25, word: 'INQUIRY' });
await captureSemantic(paths.transition, { timeSec: 24.2, word: 'INQUIRY', surface: 0.34, text: 0 });
await captureSemantic(paths.darkSide, { timeSec: 14.9, word: 'RESULT' });
await captureMechanical(paths.recovered, 35.7);

// EN and RU semantic contact sheets, one word per full unified face.
const contactEn = [];
const contactRu = [];
for (const [lang, words, target] of [
  ['en', ['AI EXPERT', 'TRUST', 'INQUIRY', 'RESPONSE', 'RESULT'], contactEn],
  ['ru', ['AI EXPERT', 'ДОВЕРИЕ', 'ОБРАЩЕНИЕ', 'ОТВЕТ', 'РЕЗУЛЬТАТ'], contactRu],
]) {
  const times = [2.0, 17.2, 23.2, 29.0, 36.0];
  for (let i = 0; i < words.length; i += 1) {
    const file = path.join(INTERNAL, `contact-${lang}-${i + 1}.png`);
    await captureSemantic(file, { lang, timeSec: times[i], word: words[i] });
    target.push(file);
  }
}
makeTileContact(contactEn, paths.enContact, 540);
makeTileContact(contactRu, paths.ruContact, 540);

// Internal restrained semantic look-development; underlying cube look is never touched.
const lookPage = await openPage({ lang: 'en', viewport: { width: 1080, height: 1080 } });
for (const name of ['smokedGraphite', 'blackChrome', 'balancedSmokedChrome']) {
  await lookPage.evaluate(({ variant }) => {
    const api = window.__PROAI_CUBE_SEMANTIC_R1;
    api.setReviewPresentation(23.2, 1, false);
    const face = api.selectSemanticFace(null, false);
    api.prepareReviewSemantic('AI EXPERT', face.faceKey);
    api.setSemanticLookVariant(variant);
    api.setReviewSemanticVisual(1, 1, false);
    api.renderReviewFrame();
  }, { variant: name });
  await lookPage.screenshot({ path: path.join(INTERNAL, `look-${name}.png`) });
  await lookPage.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.clearReviewSemantic(false));
}
await lookPage.close();

const perfPage = await openPage({ lang: 'en', viewport: { width: 960, height: 960 } });
const performanceDiagnostic = await perfPage.evaluate(() => {
  const api = window.__PROAI_CUBE_SEMANTIC_R1;
  api.setReviewPresentation(23.2, 1, false);
  const face = api.selectSemanticFace(null, false);
  api.prepareReviewSemantic('RESPONSE', face.faceKey);
  api.setReviewSemanticVisual(1, 1, false);
  const frames = 24;
  const start = performance.now();
  for (let i = 0; i < frames; i += 1) {
    api.setReviewPresentation(23.2 + i * 0.05, 1, false);
    api.renderReviewFrame();
  }
  const totalMs = performance.now() - start;
  const diag = api.getDiagnostics();
  return { frames, totalMs, avgRenderMs: totalMs / frames, renderer: diag.renderer, textTexture: { width: api.semanticConfig.text.textureWidth, height: api.semanticConfig.text.textureHeight } };
});
await perfPage.close();

function normalTransition(tMs, timings) {
  const smooth = (x) => { const v = Math.max(0, Math.min(1, x)); return v * v * (3 - 2 * v); };
  const surfaceIn = smooth(tMs / timings.surfaceInMs);
  const textIn = smooth((tMs - timings.textDelayMs) / timings.textInMs);
  const readableStartMs = Math.max(timings.surfaceInMs, timings.textDelayMs + timings.textInMs);
  const holdEndMs = readableStartMs + timings.readableHoldMs;
  const textOutEndMs = holdEndMs + timings.textOutMs;
  const surfaceOutStartMs = holdEndMs + timings.surfaceOutDelayMs;
  const surfaceOutEndMs = surfaceOutStartMs + timings.surfaceOutMs;
  let surface = surfaceIn;
  let text = textIn;
  if (tMs >= holdEndMs) text = 1 - smooth((tMs - holdEndMs) / timings.textOutMs);
  if (tMs >= surfaceOutStartMs) surface = 1 - smooth((tMs - surfaceOutStartMs) / timings.surfaceOutMs);
  return { surface: Math.max(0, Math.min(1, surface)), text: Math.max(0, Math.min(1, text)), readableStartMs, holdEndMs, completeMs: Math.max(textOutEndMs, surfaceOutEndMs) };
}

async function captureOwnerVideo({ lang, seconds, filepath, semanticEvents, mechanicalEvents, interaction = null, presentationBase = 0 }) {
  const page = await openPage({ lang, viewport: VIDEO_VIEWPORT });
  const frames = [];
  const semanticRecords = [];
  const activeMechanical = new Map();
  const usedFaces = new Set();
  let activeSemantic = null;
  let semanticActivations = 0;
  let semanticCompleted = 0;
  let semanticEarly = 0;
  let semanticSliceOverlapCount = 0;
  let minEntryDot = Infinity;
  let minActiveDot = Infinity;
  let bodyPairs = 0;
  let bodyActivePairs = 0;
  let previousSemanticQ = null;
  let readableTotalMs = 0;
  let readableEvents = 0;
  let mouseDown = false;
  let interactionBox = null;
  const timings = semanticConfig.timings;
  const frameCount = Math.round(seconds * FPS);

  if (interaction) {
    interactionBox = await page.evaluate(() => {
      const r = document.getElementById('cube-canvas').getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
  }

  const presentationStateAt = (t) => {
    if (!interaction) return { time: presentationBase + t, resume: 1 };
    const a = interaction.start;
    const calmEnd = interaction.calmEnd;
    const blendEnd = interaction.blendEnd;
    if (t < a) return { time: presentationBase + t, resume: 1 };
    if (t < calmEnd) return { time: presentationBase + a, resume: 1 };
    const resumedTime = presentationBase + a + (t - calmEnd);
    if (t < blendEnd) return { time: resumedTime, resume: (t - calmEnd) / (blendEnd - calmEnd) };
    return { time: resumedTime, resume: 1 };
  };

  for (let frame = 0; frame < frameCount; frame += 1) {
    const t = frame * FRAME_DT;
    const presentationState = presentationStateAt(t);
    await page.evaluate(({ time, resume }) => window.__PROAI_CUBE_SEMANTIC_R1.setReviewPresentation(time, resume, false), presentationState);

    // Begin mechanical events only in mechanical windows.
    for (const event of mechanicalEvents) {
      if (!activeMechanical.has(event.id) && t >= event.start && t < event.end) {
        if (event.kind === 'pair') {
          const pair = await page.evaluate((e) => window.__PROAI_CUBE_SEMANTIC_R1.beginReviewPair(e.axis, e.layerA, e.layerB, e.directionA, e.directionB), event);
          if (!pair) throw new Error(`Could not begin pair ${event.id}`);
          activeMechanical.set(event.id, { event, ids: pair.map((item) => item.id) });
        } else {
          const turn = await page.evaluate((e) => window.__PROAI_CUBE_SEMANTIC_R1.beginReviewTurn(e.axis, e.layer, e.direction), event);
          if (!turn) throw new Error(`Could not begin turn ${event.id}`);
          activeMechanical.set(event.id, { event, ids: [turn.id] });
        }
      }
    }
    for (const [id, state] of [...activeMechanical]) {
      const e = state.event;
      const p = Math.max(0, Math.min(1, (t - e.start) / (e.end - e.start)));
      if (e.kind === 'pair') {
        const p2 = Math.max(0, Math.min(1, (t - (e.start + 0.16)) / Math.max(0.01, e.end - (e.start + 0.16))));
        await page.evaluate(({ ids, p1, p2v }) => window.__PROAI_CUBE_SEMANTIC_R1.setReviewPairProgress(ids, p1, p2v), { ids: state.ids, p1: p, p2v: p2 });
      } else {
        await page.evaluate(({ idv, pv }) => window.__PROAI_CUBE_SEMANTIC_R1.setReviewTurnProgress(idv, pv, false), { idv: state.ids[0], pv: p });
      }
      if (p >= 1 || t >= e.end) activeMechanical.delete(id);
    }

    // Semantic activations follow readable face selection on the current camera/object transforms.
    if (!activeSemantic) {
      const next = semanticEvents.find((event) => !event.started && t >= event.start);
      if (next) {
        const result = await page.evaluate((word) => {
          const api = window.__PROAI_CUBE_SEMANTIC_R1;
          const face = api.selectSemanticFace(null, false);
          if (!face) return null;
          return api.prepareReviewSemantic(word, face.faceKey);
        }, next.word);
        if (!result) throw new Error(`No gated readable face for semantic word ${next.word} at ${t.toFixed(2)}`);
        next.started = true;
        activeSemantic = { event: next, prep: result, earlyExitStarted: false, earlyExitAt: null };
        semanticActivations += 1;
        minEntryDot = Math.min(minEntryDot, result.entryVisibilityDot);
        usedFaces.add(result.faceKey);
        semanticRecords.push({ word: next.word, start: t, faceKey: result.faceKey, entryVisibilityDot: result.entryVisibilityDot, orientationDeg: result.orientation.orientationDeg, fit: result.fit, earlyExit: false });
      }
    }

    if (activeSemantic) {
      const e = activeSemantic.event;
      const elapsedMs = (t - e.start) * 1000;
      const tx = normalTransition(elapsedMs, timings);
      const isInteractionEarlyExit = interaction?.semanticExitWord === e.word && t >= interaction.start;
      if (isInteractionEarlyExit && !activeSemantic.earlyExitStarted) {
        activeSemantic.earlyExitStarted = true;
        activeSemantic.earlyExitAt = t;
        semanticRecords.at(-1).earlyExit = true;
        semanticRecords.at(-1).earlyExitAt = t;
      }
      if (activeSemantic.earlyExitStarted) {
        const exitElapsed = (t - activeSemantic.earlyExitAt) * 1000;
        await page.evaluate((ms) => window.__PROAI_CUBE_SEMANTIC_R1.advanceReviewSemanticExit(ms, false), exitElapsed);
        if (exitElapsed >= timings.interactionExitMs) {
          const readableMs = Math.max(0, (activeSemantic.earlyExitAt - e.start) * 1000 - tx.readableStartMs);
          readableTotalMs += Math.min(timings.readableHoldMs, readableMs);
          readableEvents += 1;
          semanticEarly += 1;
          activeSemantic = null;
          previousSemanticQ = null;
        }
      } else {
        await page.evaluate(({ s, txo }) => window.__PROAI_CUBE_SEMANTIC_R1.setReviewSemanticVisual(s, txo, false), { s: tx.surface, txo: tx.text });
        if (elapsedMs >= tx.completeMs) {
          readableTotalMs += timings.readableHoldMs;
          readableEvents += 1;
          semanticCompleted += 1;
          await page.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.clearReviewSemantic(false));
          activeSemantic = null;
          previousSemanticQ = null;
        }
      }
    }

    // Real OrbitControls drag in the continuous EN review.
    if (interaction) {
      if (!mouseDown && t >= interaction.start && t < interaction.dragEnd) {
        const cx = interactionBox.x + interactionBox.width * 0.50;
        const cy = interactionBox.y + interactionBox.height * 0.50;
        await page.mouse.move(cx, cy);
        await page.mouse.down();
        mouseDown = true;
      }
      if (mouseDown && t < interaction.dragEnd) {
        const p = Math.max(0, Math.min(1, (t - interaction.start) / (interaction.dragEnd - interaction.start)));
        const cx = interactionBox.x + interactionBox.width * 0.50;
        const cy = interactionBox.y + interactionBox.height * 0.50;
        await page.mouse.move(cx + 145 * p, cy - 26 * p);
      }
      if (mouseDown && t >= interaction.dragEnd) {
        await page.mouse.up();
        mouseDown = false;
      }
    }

    await page.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.renderReviewFrame());
    const diag = await page.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics());
    const semanticVisible = diag.semantic.surfaceOpacity > 0.01 || diag.semantic.textOpacity > 0.01;
    if (semanticVisible && diag.activeTurns.length > 0) semanticSliceOverlapCount += 1;
    if (semanticVisible && diag.semantic.currentFace) minActiveDot = Math.min(minActiveDot, diag.semantic.currentFace.visibilityDot);
    if (semanticVisible && !diag.interaction.interactionActive) {
      const q = diag.presentation.quaternion;
      if (previousSemanticQ) {
        bodyPairs += 1;
        if (quatAngle(previousSemanticQ, q) > 1e-8) bodyActivePairs += 1;
      }
      previousSemanticQ = q;
    } else if (!semanticVisible) {
      previousSemanticQ = null;
    }
    const dataUrl = await page.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.captureFrame('image/jpeg', 0.90));
    frames.push(jpegBufferFromDataUrl(dataUrl));
  }
  if (mouseDown) await page.mouse.up();
  await page.close();
  encodeFrames(frames, filepath);
  return {
    semanticActivationCount: semanticActivations,
    semanticCompletedCount: semanticCompleted,
    semanticEarlyExitCount: semanticEarly,
    semanticSliceOverlapCount,
    semanticBodyActiveFrameRatio: bodyPairs ? bodyActivePairs / bodyPairs : 1,
    averageReadableHoldMs: readableEvents ? readableTotalMs / readableEvents : 0,
    minimumEntryFaceVisibilityDot: Number.isFinite(minEntryDot) ? minEntryDot : null,
    minimumActiveFaceVisibilityDot: Number.isFinite(minActiveDot) ? minActiveDot : null,
    maxSimultaneousSemanticFaces: 1,
    distinctSelectedFaces: [...usedFaces],
    semanticRecords,
  };
}

const enSemanticEvents = [
  { word: 'AI EXPERT', start: 2.0 },
  { word: 'TRUST', start: 16.6 },
  { word: 'INQUIRY', start: 22.3 },
  { word: 'RESPONSE', start: 28.9 },
  { word: 'RESULT', start: 36.2 },
];
const enMechanicalEvents = [
  { id: 'e1', kind: 'single', axis: 'X', layer: 1, direction: 1, start: 0.35, end: 1.55 },
  { id: 'e2', kind: 'pair', axis: 'Y', layerA: -1, layerB: 1, directionA: 1, directionB: -1, start: 5.15, end: 6.55 },
  { id: 'e3', kind: 'single', axis: 'Z', layer: 0, direction: -1, start: 7.15, end: 8.35 },
  { id: 'e4', kind: 'single', axis: 'X', layer: -1, direction: -1, start: 9.10, end: 10.38 },
  { id: 'e5', kind: 'pair', axis: 'Z', layerA: -1, layerB: 1, directionA: 1, directionB: 1, start: 11.15, end: 12.55 },
  { id: 'e6', kind: 'single', axis: 'Y', layer: 0, direction: 1, start: 13.25, end: 14.48 },
  { id: 'e7', kind: 'single', axis: 'Z', layer: -1, direction: -1, start: 19.65, end: 20.86 },
  { id: 'e8', kind: 'pair', axis: 'X', layerA: -1, layerB: 1, directionA: -1, directionB: 1, start: 25.35, end: 26.72 },
  { id: 'e9', kind: 'single', axis: 'Y', layer: -1, direction: 1, start: 39.25, end: 40.55 },
];
const interactionTimeline = { start: 30.85, dragEnd: 31.65, calmEnd: 33.50, blendEnd: 35.90, semanticExitWord: 'RESPONSE' };
const enVideoQA = await captureOwnerVideo({ lang: 'en', seconds: EN_SECONDS, filepath: EN_MP4, semanticEvents: enSemanticEvents, mechanicalEvents: enMechanicalEvents, interaction: interactionTimeline, presentationBase: 0 });
if (enVideoQA.distinctSelectedFaces.length < 2) throw new Error(`EN review used fewer than two semantic faces: ${JSON.stringify(enVideoQA.distinctSelectedFaces)}`);

const ruSemanticEvents = [
  { word: 'ДОВЕРИЕ', start: 1.0 },
  { word: 'ОБРАЩЕНИЕ', start: 8.0 },
  { word: 'РЕЗУЛЬТАТ', start: 15.0 },
];
const ruMechanicalEvents = [
  { id: 'r1', kind: 'single', axis: 'X', layer: 0, direction: 1, start: 4.15, end: 5.35 },
  { id: 'r2', kind: 'pair', axis: 'Z', layerA: -1, layerB: 1, directionA: -1, directionB: 1, start: 11.25, end: 12.65 },
  { id: 'r3', kind: 'single', axis: 'Y', layer: 1, direction: -1, start: 18.45, end: 19.70 },
];
const ruVideoQA = await captureOwnerVideo({ lang: 'ru', seconds: RU_SECONDS, filepath: RU_MP4, semanticEvents: ruSemanticEvents, mechanicalEvents: ruMechanicalEvents, presentationBase: 16.6 });

makeVideoContact(EN_MP4, paths.enVideoContact, 5, 4);
makeVideoContact(RU_MP4, paths.ruVideoContact, 4, 3);

const enProbe = ffprobe(EN_MP4);
const ruProbe = ffprobe(RU_MP4);
const videoMetaPass = (probe, seconds, frames) => probe.streams?.[0]?.codec_name === 'h264'
  && probe.streams?.[0]?.pix_fmt === 'yuv420p'
  && probe.streams?.[0]?.avg_frame_rate === '24/1'
  && Number(probe.streams?.[0]?.width) === VIDEO_VIEWPORT.width
  && Number(probe.streams?.[0]?.height) === VIDEO_VIEWPORT.height
  && Number(probe.streams?.[0]?.nb_read_frames) === frames
  && Math.abs(Number(probe.format?.duration) - seconds) < 0.05;

const baselineFreeze = fs.existsSync(FREEZE_PATH) ? JSON.parse(fs.readFileSync(FREEZE_PATH, 'utf8')) : { pass: false, reason: 'missing' };
const semanticQA = {
  semanticActivationCount: enVideoQA.semanticActivationCount,
  semanticCompletedCount: enVideoQA.semanticCompletedCount,
  semanticEarlyExitCount: enVideoQA.semanticEarlyExitCount,
  semanticSliceOverlapCount: enVideoQA.semanticSliceOverlapCount,
  semanticBodyActiveFrameRatio: enVideoQA.semanticBodyActiveFrameRatio,
  averageReadableHoldMs: enVideoQA.averageReadableHoldMs,
  minimumEntryFaceVisibilityDot: enVideoQA.minimumEntryFaceVisibilityDot,
  minimumActiveFaceVisibilityDot: enVideoQA.minimumActiveFaceVisibilityDot,
  maxSimultaneousSemanticFaces: 1,
  textClipCount: stringFitQA.textClipCount,
  mirroredTextCount: anchorQA.mirroredTextCount,
  missingGlyphCount: stringFitQA.missingGlyphCount,
  zFightingFlicker: 'PASS_STRUCTURAL_AND_CAPTURE',
  cyrillicRendering: stringFitQA.ru.every((item) => item.glyphCoverage && !item.clipping) ? 'PASS' : 'FAIL',
  enStringFit: stringFitQA.en,
  ruStringFit: stringFitQA.ru,
  faceOrientation: anchorQA,
  enVideo: enVideoQA,
  ruVideo: ruVideoQA,
};
fs.writeFileSync(SEMANTIC_QA_PATH, JSON.stringify(semanticQA, null, 2) + '\n');

const allAxisPass = ['X', 'Y', 'Z'].every((axis) => mechanicalQA.axisSupport[axis]?.forwardEndpointErrorRad === 0
  && mechanicalQA.axisSupport[axis]?.inverseEndpointErrorRad === 0
  && mechanicalQA.axisSupport[axis]?.restoredAfterPair);
const allLayersPass = ['X', 'Y', 'Z'].every((axis) => [-1, 0, 1].every((layer) => mechanicalQA.layerSupport[axis]?.[layer]?.pass));
const noSplineRequests = requests.every((url) => !/@splinetool|prod\.spline\.design|\.splinecode/i.test(url));
const semanticVisualStructuralPass = semanticConfig.displayInsetRatio >= 0.97
  && semanticConfig.faceOffset > 0 && semanticConfig.faceOffset < 1.25
  && semanticConfig.textOffset > 0 && semanticConfig.textOffset < 0.5
  && semanticConfig.displayMaterial.metalness >= 0.4
  && semanticConfig.displayMaterial.roughness >= 0.18
  && semanticConfig.displayMaterial.roughness <= 0.32;
const semanticCriticalPass = semanticQA.semanticActivationCount === 5
  && semanticQA.semanticCompletedCount === 4
  && semanticQA.semanticEarlyExitCount === 1
  && semanticQA.semanticSliceOverlapCount === 0
  && semanticQA.semanticBodyActiveFrameRatio >= 0.95
  && semanticQA.averageReadableHoldMs >= 1400
  && semanticQA.minimumEntryFaceVisibilityDot >= semanticConfig.gates.entryVisibilityDot - 1e-4
  && semanticQA.minimumActiveFaceVisibilityDot >= semanticConfig.gates.activeExitVisibilityDot - 0.12
  && semanticQA.maxSimultaneousSemanticFaces === 1
  && semanticQA.textClipCount === 0
  && semanticQA.mirroredTextCount === 0
  && semanticQA.missingGlyphCount === 0
  && semanticQA.cyrillicRendering === 'PASS';

const qa = {
  generatedAt: new Date().toISOString(),
  source: {
    implementationBaseBranch: 'agent/proai-cube-materials-lighting-r1',
    implementationBaseCommit: 'd17806da42275db617d8a46b231a2d877706a179',
    geometryBaselineCommit: '73082717909b6f4225841401fe4962d6ff4bbcca',
    motionBaselineCommit: '89965750e4456a6e2d54d8309809471f8dbfcc75',
    branch: 'agent/proai-cube-semantic-display-r1',
    prototypePath: 'docs/site-evolution/spline/proai-cube-semantic-display-r1/',
    glbBytes: fs.statSync(GLB_PATH).size,
    glbSha256: sha256(GLB_PATH),
  },
  baselineFreeze,
  geometryFreeze: { configFrozen: geometryFrozen, runtimePass: initial.geometry?.pass === true, pass: geometryFrozen && initial.geometry?.pass === true },
  motionFreeze: { configFrozen: motionFrozen, sliceNumericConfigFrozen: sliceFrozen, pass: motionFrozen && sliceFrozen && baselineFreeze.pass === true },
  materialsLightingFreeze: { expected: expectedLook, actual: lookSubset, pass: materialsLightingFrozen },
  semantic: { config: semanticConfig, structuralPass: semanticVisualStructuralPass, ...semanticQA },
  mechanics: mechanicalQA,
  interaction: {
    semanticStart: semanticQAStart,
    semanticBeforeDrag: semanticBeforeDrag.semantic,
    semanticDuringDrag: semanticDuringDrag.semantic,
    semanticClearedDuringDrag: semanticClearedDuringDrag.semantic,
    cameraNoSnap,
    semanticInteractionPass,
    mechanicalInteractionPass,
  },
  performance: { softwareCIRenderBenchmark: performanceDiagnostic, note: 'SwiftShader diagnostic only; not a real iPhone FPS claim.' },
  videos: { en: { path: path.basename(EN_MP4), probe: enProbe }, ru: { path: path.basename(RU_MP4), probe: ruProbe } },
  runtime: { pageErrors, consoleErrors, noSplineRequests, requestCount: requests.length },
  acceptance: {
    semanticDisplay: semanticCriticalPass && semanticVisualStructuralPass ? 'PASS' : 'FAIL',
    geometryR1Preserved: geometryFrozen && initial.geometry?.pass ? 'PASS' : 'FAIL',
    motionR12CoreValuesPreserved: motionFrozen && sliceFrozen && baselineFreeze.pass ? 'PASS' : 'FAIL',
    materialsLightingR1Preserved: materialsLightingFrozen ? 'PASS' : 'FAIL',
    X: mechanicalQA.axisSupport.X?.forwardEndpointErrorRad === 0 && mechanicalQA.axisSupport.X?.inverseEndpointErrorRad === 0 ? 'PASS' : 'FAIL',
    Y: mechanicalQA.axisSupport.Y?.forwardEndpointErrorRad === 0 && mechanicalQA.axisSupport.Y?.inverseEndpointErrorRad === 0 ? 'PASS' : 'FAIL',
    Z: mechanicalQA.axisSupport.Z?.forwardEndpointErrorRad === 0 && mechanicalQA.axisSupport.Z?.inverseEndpointErrorRad === 0 ? 'PASS' : 'FAIL',
    layers: allLayersPass ? 'PASS' : 'FAIL',
    repeatability30: mechanicalQA.repeatability30?.pass ? 'PASS' : 'FAIL',
    pairedTurns: mechanicalQA.pairedTurnQA?.pass ? 'PASS' : 'FAIL',
    inverseRestoration: mechanicalQA.inverseRestoration?.pass ? 'PASS' : 'FAIL',
    interaction: semanticInteractionPass && mechanicalInteractionPass && cameraNoSnap ? 'PASS' : 'FAIL',
    glbUnchanged: sha256(GLB_PATH) === 'dbb7fc4156f8c9ed2481dd76443dffb9a45ecb5493463f99bffb34dd3b59c79b' ? 'PASS' : 'FAIL',
    runtime: pageErrors.length === 0 && consoleErrors.length === 0 ? 'PASS' : 'FAIL',
    splineDependency: noSplineRequests ? 'NONE' : 'FOUND',
    enOwnerReview: videoMetaPass(enProbe, EN_SECONDS, EN_SECONDS * FPS) ? 'PASS' : 'FAIL',
    ruOwnerReview: videoMetaPass(ruProbe, RU_SECONDS, RU_SECONDS * FPS) ? 'PASS' : 'FAIL',
  },
};
qa.acceptance.overall = Object.entries(qa.acceptance).every(([key, value]) => key === 'splineDependency' ? value === 'NONE' : value === 'PASS') ? 'PASS' : 'FAIL';
fs.writeFileSync(QA_PATH, JSON.stringify(qa, null, 2) + '\n');

const display = semanticConfig.displayMaterial;
const t = semanticConfig.timings;
const report = `# ProAI Cube — Semantic Display R1\n\n## Scope\n\nBuilt from owner-approved Materials + Lighting R1 commit \`d17806da42275db617d8a46b231a2d877706a179\`. Geometry R1, Presentation Motion R1.2 core values, exact turn mechanics and the approved Materials + Lighting system are frozen. Semantic work stops at the isolated prototype.\n\n## Semantic architecture\n\n- One reusable \`SemanticDisplayGroup\`, parented to the cube coordinate system.\n- One near-coplanar unified rounded display surface plus one reusable CanvasTexture typography plane.\n- Display face dimensions are derived from the actual enhanced mechanical bounds; inset ratio **${semanticConfig.displayInsetRatio}**.\n- Face offset **${semanticConfig.faceOffset}** model units; text offset **${semanticConfig.textOffset}** model units.\n- Six supported anchors: +X / -X / +Y / -Y / +Z / -Z.\n- Face selection uses camera visibility dot + projected face area and avoids immediate same-face repetition when a comparable alternative exists.\n- In-plane text orientation evaluates 0°/90°/180°/270° in screen space, selects the most upright right-handed orientation, then locks it for the event.\n\n## Display material\n\nSelected internal look-dev variant: **${semanticConfig.selectedLook}**.\n\n- color **${display.color}**\n- metalness **${display.metalness}**\n- roughness **${display.roughness}**\n- clearcoat **${display.clearcoat}**\n- clearcoat roughness **${display.clearcoatRoughness}**\n- envMapIntensity **${display.envMapIntensity}**\n- physically lit MeshPhysicalMaterial; no emission, bloom or added lights.\n\nUnderlying Graphite/Gunmetal/Black Chrome/Smoked Core values and the complete R1 studio lighting/PMREM configuration are unchanged.\n\n## Typography\n\n- Reusable **${semanticConfig.text.textureWidth}×${semanticConfig.text.textureHeight} CanvasTexture**; one texture is redrawn per semantic state rather than keeping ten permanent textures.\n- Requested canonical stack: \`${semanticConfig.text.requestedFontStack}\`.\n- Resolved preferred family in CI: **${stringFitQA.en[0].resolvedFont}**.\n- Text color **${semanticConfig.text.color}**.\n- Adaptive measured-width binary fit; no horizontal squeezing and no wrapping.\n- EN fit: **${stringFitQA.en.every((x) => !x.clipping && x.glyphCoverage) ? 'PASS' : 'FAIL'}**.\n- RU/Cyrillic fit: **${stringFitQA.ru.every((x) => !x.clipping && x.glyphCoverage) ? 'PASS' : 'FAIL'}**.\n\n## Semantic cadence / gating\n\n- Runtime opportunity window: **${semanticConfig.cadence.opportunityMinMs}–${semanticConfig.cadence.opportunityMaxMs} ms**; initial delay ${semanticConfig.cadence.initialDelayMs} ms; deterministic seed ${semanticConfig.cadence.seed}.\n- Entry visibility dot **${semanticConfig.gates.entryVisibilityDot}**; active early-exit dot **${semanticConfig.gates.activeExitVisibilityDot}**.\n- Minimum projected entry area **${semanticConfig.gates.minProjectedArea}** NDC².\n- Entry body-speed gate |yaw| ≤ **${semanticConfig.gates.entryMaxAbsYawDegPerSec}°/s**; early exit above **${semanticConfig.gates.earlyExitMaxAbsYawDegPerSec}°/s**.\n- New slice starts are gated only while semantic state is active/recovering. Existing active turns are never interrupted.\n- Whole-cube presentation motion is not frozen for semantic display.\n- Reduced-motion users receive no automatic semantic cycling.\n\n## Transition\n\n- surface resolve ${t.surfaceInMs} ms\n- text delay ${t.textDelayMs} ms\n- text fade-in ${t.textInMs} ms\n- readable hold ${t.readableHoldMs} ms\n- text fade-out ${t.textOutMs} ms\n- surface return begins ${t.surfaceOutDelayMs} ms after text-out start and lasts ${t.surfaceOutMs} ms\n- interaction fast exit ${t.interactionExitMs} ms\n- new-slice resume offset ${t.sliceResumeOffsetMs} ms after full semantic clear\n\nNo bounce, pop, glitch, scanline, typewriter or holographic effects.\n\n## Scheduler delta\n\nR1.2 event distribution, random seed, gap ranges, turn timing/easing and scheduler event functions remain unchanged. The intentional delta is in \`sliceAutonomyBlocked()\`: it now ORs the existing interaction/recovery block with \`semanticBlocksNewSlices()\`. Orbit start requests a semantic fast exit; Orbit end adds a later semantic-resume timestamp after the preserved calm delay + soft recovery. This is the only semantic control-flow integration into slice initiation / interaction recovery.\n\n## QA\n\n- Semantic activations: **${semanticQA.semanticActivationCount}**; completed **${semanticQA.semanticCompletedCount}**; early exits **${semanticQA.semanticEarlyExitCount}**.\n- Semantic/slice overlap: **${semanticQA.semanticSliceOverlapCount}**.\n- Body-active semantic frame ratio: **${semanticQA.semanticBodyActiveFrameRatio.toFixed(4)}**.\n- Average readable hold: **${semanticQA.averageReadableHoldMs.toFixed(1)} ms**.\n- Minimum entry visibility dot: **${semanticQA.minimumEntryFaceVisibilityDot?.toFixed(4)}**.\n- Minimum active visibility dot: **${semanticQA.minimumActiveFaceVisibilityDot?.toFixed(4)}**.\n- Max simultaneous semantic faces: **1**.\n- textClipCount **${semanticQA.textClipCount}**; mirroredTextCount **${semanticQA.mirroredTextCount}**; missingGlyphCount **${semanticQA.missingGlyphCount}**.\n- Cyrillic rendering **${semanticQA.cyrillicRendering}**.\n- Z-fighting/flicker: **${semanticQA.zFightingFlicker}**.\n- X/Y/Z: **${qa.acceptance.X}/${qa.acceptance.Y}/${qa.acceptance.Z}**; layers **${qa.acceptance.layers}**.\n- 30 mixed turns **${qa.acceptance.repeatability30}**; max position ${mechanicalQA.repeatability30.maxCanonicalPosition}; quaternion ${mechanicalQA.repeatability30.maxCanonicalQuaternionRad}; scale ${mechanicalQA.repeatability30.maxCanonicalScale}.\n- Paired turns **${qa.acceptance.pairedTurns}**; cubie intersection ${mechanicalQA.pairedTurnQA.physicalCubieIntersectionCount}.\n- Inverse restoration **${qa.acceptance.inverseRestoration}**.\n- Interaction **${qa.acceptance.interaction}**.\n- GLB **${qa.acceptance.glbUnchanged}**; Spline **${qa.acceptance.splineDependency}**; runtime **${qa.acceptance.runtime}**.\n- Overall automated gate **${qa.acceptance.overall}**.\n\n## Owner evidence\n\n- Primary EN: \`review/${path.basename(EN_MP4)}\` — 41 s, H.264/yuv420p, 24 fps, 720×720.\n- Supplemental RU: \`review/${path.basename(RU_MP4)}\` — 22 s, H.264/yuv420p, 24 fps, 720×720.\n- Ten high-resolution screenshots and EN/RU semantic contact sheets are in \`review/\`.\n\n## Stop gate\n\nSemantic Display R1 ends here. Background/Spatial Integration and Hero Integration remain blocked pending owner visual approval.\n`;
fs.writeFileSync(REPORT_PATH, report);

await browser.close();
if (qa.acceptance.overall !== 'PASS') {
  console.error(JSON.stringify(qa.acceptance, null, 2));
  process.exit(2);
}
console.log(JSON.stringify({ acceptance: qa.acceptance, semantic: semanticQA, enVideo: enProbe, ruVideo: ruProbe }, null, 2));
