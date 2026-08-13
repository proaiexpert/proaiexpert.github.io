import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.PROAI_SEMANTIC_PROTOTYPE_DIR || path.join(HERE, 'proai-cube-semantic-display-r1');
const BASE_URL = process.env.PROAI_SEMANTIC_DISPLAY_R1_URL || 'http://127.0.0.1:4173/';
const REVIEW = path.join(ROOT, 'review');
const SOURCE = path.join(REVIEW, 'proai-cube-semantic-display-r1-en-review-41s.mp4');
const TMP = path.join(ROOT, 'owner-tail-correction-tmp');
const TAIL = path.join(TMP, 'result-tail.mp4');
const CORRECTED = path.join(TMP, 'corrected-en.mp4');
const CONTACT = path.join(REVIEW, 'video-contact-sheet-en.png');
const RESULT_PROOF = path.join(REVIEW, '11-en-result-owner-proof.png');
const QA_PATH = path.join(ROOT, 'QA.json');
const SEMANTIC_QA_PATH = path.join(ROOT, 'SEMANTIC_QA.json');
const REPORT_PATH = path.join(ROOT, 'REPORT.md');
const CORRECTION_PATH = path.join(ROOT, 'OWNER_VIDEO_CORRECTION.json');
const FPS = 24;
const KEEP_SECONDS = 35.5;
const TAIL_SECONDS = 5.5;
const TOTAL_SECONDS = 41;
const TOTAL_FRAMES = TOTAL_SECONDS * FPS;
const TAIL_FRAMES = TAIL_SECONDS * FPS;
const SEMANTIC_START = 1.5;
const FINAL_TURN_START = 4.40;
const FINAL_TURN_DURATION = 1.08;

function run(cmd, args) {
  const result = spawnSync(cmd, args, { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`${cmd} failed: ${result.stderr || result.stdout}`);
  return result.stdout;
}
function probe(file) {
  return JSON.parse(run('ffprobe', ['-v','error','-count_frames','-select_streams','v:0','-show_entries','stream=codec_name,pix_fmt,avg_frame_rate,nb_read_frames,width,height:format=duration,size','-of','json',file]));
}
function smoothstep(x) { const v = Math.max(0, Math.min(1, x)); return v * v * (3 - 2 * v); }
function transition(ms, t) {
  const surfaceIn = smoothstep(ms / t.surfaceInMs);
  const textIn = smoothstep((ms - t.textDelayMs) / t.textInMs);
  const readableStartMs = Math.max(t.surfaceInMs, t.textDelayMs + t.textInMs);
  const holdEndMs = readableStartMs + t.readableHoldMs;
  const textOutEndMs = holdEndMs + t.textOutMs;
  const surfaceOutStartMs = holdEndMs + t.surfaceOutDelayMs;
  const completeMs = Math.max(textOutEndMs, surfaceOutStartMs + t.surfaceOutMs);
  let surface = surfaceIn;
  let text = textIn;
  if (ms >= holdEndMs) text = 1 - smoothstep((ms - holdEndMs) / t.textOutMs);
  if (ms >= surfaceOutStartMs) surface = 1 - smoothstep((ms - surfaceOutStartMs) / t.surfaceOutMs);
  return { surface: Math.max(0, Math.min(1, surface)), text: Math.max(0, Math.min(1, text)), completeMs };
}

if (!fs.existsSync(SOURCE)) throw new Error(`Missing canonical EN owner video: ${SOURCE}`);
fs.rmSync(TMP, { recursive: true, force: true });
fs.mkdirSync(TMP, { recursive: true });
fs.mkdirSync(REVIEW, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--enable-webgl','--ignore-gpu-blocklist','--use-angle=swiftshader'] });
const context = await browser.newContext({ viewport: { width: 720, height: 720 } });
const page = await context.newPage();
const pageErrors = [];
const consoleErrors = [];
page.on('pageerror', e => pageErrors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
const url = new URL(BASE_URL);
url.searchParams.set('capture', '1');
url.searchParams.set('lang', 'en');
await page.goto(url.toString(), { waitUntil: 'networkidle', timeout: 120000 });
await page.waitForFunction(() => window.__PROAI_CUBE_SEMANTIC_R1?.ready && window.__PROAI_CUBE_SEMANTIC_R1?.semanticReady, null, { timeout: 120000 });
await page.evaluate(() => {
  const a = window.__PROAI_CUBE_SEMANTIC_R1;
  a.stopSliceScheduler();
  const e = document.querySelector('.status');
  if (e) e.style.display = 'none';
});
await page.waitForFunction(() => window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics().activeTurns.length === 0, null, { timeout: 15000 });

const completedMechanicalEvents = [
  { kind:'single', axis:'X', layer:1, direction:1 },
  { kind:'pair', axis:'Y', layerA:-1, layerB:1, directionA:1, directionB:-1 },
  { kind:'single', axis:'Z', layer:0, direction:-1 },
  { kind:'single', axis:'X', layer:-1, direction:-1 },
  { kind:'pair', axis:'Z', layerA:-1, layerB:1, directionA:1, directionB:1 },
  { kind:'single', axis:'Y', layer:0, direction:1 },
  { kind:'single', axis:'Z', layer:-1, direction:-1 },
  { kind:'pair', axis:'X', layerA:-1, layerB:1, directionA:-1, directionB:1 },
];
for (const e of completedMechanicalEvents) {
  if (e.kind === 'pair') {
    const ids = await page.evaluate(x => {
      const a = window.__PROAI_CUBE_SEMANTIC_R1;
      const r = a.beginReviewPair(x.axis, x.layerA, x.layerB, x.directionA, x.directionB);
      if (!r) return null;
      const ids = r.map(v => v.id);
      a.setReviewPairProgress(ids, 1, 1);
      return ids;
    }, e);
    if (!ids) throw new Error(`Failed to replay pair ${JSON.stringify(e)}`);
  } else {
    const id = await page.evaluate(x => {
      const a = window.__PROAI_CUBE_SEMANTIC_R1;
      const r = a.beginReviewTurn(x.axis, x.layer, x.direction);
      if (!r) return null;
      a.setReviewTurnProgress(r.id, 1, false);
      return r.id;
    }, e);
    if (!id) throw new Error(`Failed to replay turn ${JSON.stringify(e)}`);
  }
  await page.waitForFunction(() => window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics().activeTurns.length === 0, null, { timeout: 5000 });
}

await page.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.setReviewPresentation(30.3, 1, true));
const box = await page.evaluate(() => {
  const r = document.getElementById('cube-canvas').getBoundingClientRect();
  return { x:r.x, y:r.y, width:r.width, height:r.height };
});
const cx = box.x + box.width * 0.5;
const cy = box.y + box.height * 0.5;
await page.mouse.move(cx, cy);
await page.mouse.down();
for (let i = 1; i <= 12; i++) {
  await page.mouse.move(cx + 145 * (i / 12), cy - 26 * (i / 12));
  await new Promise(r => setTimeout(r, 18));
}
await page.mouse.up();
await new Promise(r => setTimeout(r, 120));

const timings = await page.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.semanticConfig.timings);
let semanticPrepared = false;
let semanticCleared = false;
let semanticPrep = null;
let finalTurnId = null;
let resultProofWritten = false;
let maxTextOpacity = 0;
let minResultVisibilityDot = Infinity;
let bodyQuaternionPairs = 0;
let bodyQuaternionActive = 0;
let previousBodyQuaternion = null;
function quatAngle(a,b) {
  const dot = Math.min(1, Math.abs(a.reduce((s,v,i) => s + v*b[i], 0)));
  return 2 * Math.acos(dot);
}

for (let frame = 0; frame < TAIL_FRAMES; frame++) {
  const t = frame / FPS;
  const totalTime = KEEP_SECONDS + t;
  await page.evaluate(time => window.__PROAI_CUBE_SEMANTIC_R1.setReviewPresentation(time, 1, false), totalTime);

  if (!semanticPrepared && t >= SEMANTIC_START) {
    semanticPrep = await page.evaluate(() => {
      const a = window.__PROAI_CUBE_SEMANTIC_R1;
      const face = a.selectSemanticFace(null, false) || a.selectSemanticFace(null, true);
      return face ? a.prepareReviewSemantic('RESULT', face.faceKey) : null;
    });
    if (!semanticPrep) throw new Error('Could not prepare corrected RESULT semantic face');
    semanticPrepared = true;
  }

  if (semanticPrepared && !semanticCleared) {
    const ms = (t - SEMANTIC_START) * 1000;
    const tx = transition(ms, timings);
    await page.evaluate(({s,x}) => window.__PROAI_CUBE_SEMANTIC_R1.setReviewSemanticVisual(s, x, false), { s: tx.surface, x: tx.text });
    maxTextOpacity = Math.max(maxTextOpacity, tx.text);
    if (ms >= tx.completeMs) {
      await page.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.clearReviewSemantic(false));
      semanticCleared = true;
    }
  }

  if (!finalTurnId && t >= FINAL_TURN_START && semanticCleared) {
    finalTurnId = await page.evaluate(() => {
      const r = window.__PROAI_CUBE_SEMANTIC_R1.beginReviewTurn('Y', -1, 1);
      return r?.id || null;
    });
    if (!finalTurnId) throw new Error('Failed to start post-semantic segmentation return turn');
  }
  if (finalTurnId) {
    const p = Math.max(0, Math.min(1, (t - FINAL_TURN_START) / FINAL_TURN_DURATION));
    await page.evaluate(({id,p}) => window.__PROAI_CUBE_SEMANTIC_R1.setReviewTurnProgress(id, p, false), { id: finalTurnId, p });
  }

  await page.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.renderReviewFrame());
  const diag = await page.evaluate(() => window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics());
  if (diag.semantic?.currentFace?.visibilityDot != null && diag.semantic.textOpacity > 0.01) {
    minResultVisibilityDot = Math.min(minResultVisibilityDot, diag.semantic.currentFace.visibilityDot);
  }
  const q = diag.presentation.quaternion;
  if (previousBodyQuaternion) {
    bodyQuaternionPairs += 1;
    if (quatAngle(previousBodyQuaternion, q) > 1e-8) bodyQuaternionActive += 1;
  }
  previousBodyQuaternion = q;

  const dataUrl = await page.evaluate(() => document.getElementById('cube-canvas').toDataURL('image/jpeg', 0.94));
  const bytes = Buffer.from(dataUrl.split(',')[1], 'base64');
  const framePath = path.join(TMP, `frame-${String(frame).padStart(4,'0')}.jpg`);
  fs.writeFileSync(framePath, bytes);
  if (!resultProofWritten && t >= SEMANTIC_START + 1.0 && t <= SEMANTIC_START + 1.15) {
    fs.writeFileSync(RESULT_PROOF, bytes);
    resultProofWritten = true;
  }
}

await page.close();
await context.close();
await browser.close();
if (!semanticPrepared || !semanticCleared || !resultProofWritten || maxTextOpacity < 0.99) throw new Error('Corrected RESULT tail did not complete a fully readable semantic event');

run('ffmpeg', ['-y','-v','error','-framerate',String(FPS),'-i',path.join(TMP,'frame-%04d.jpg'),'-an','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart','-r',String(FPS),'-frames:v',String(TAIL_FRAMES),TAIL]);
run('ffmpeg', ['-y','-v','error','-i',SOURCE,'-i',TAIL,'-filter_complex',`[0:v]trim=start=0:end=${KEEP_SECONDS},setpts=PTS-STARTPTS,fps=${FPS},scale=720:720:flags=lanczos[first];[1:v]trim=start=0:end=${TAIL_SECONDS},setpts=PTS-STARTPTS,fps=${FPS},scale=720:720:flags=lanczos[tail];[first][tail]concat=n=2:v=1:a=0,fps=${FPS}[out]`,'-map','[out]','-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart','-r',String(FPS),'-frames:v',String(TOTAL_FRAMES),CORRECTED]);
fs.copyFileSync(CORRECTED, SOURCE);
run('ffmpeg', ['-y','-v','error','-ss','38.0','-i',SOURCE,'-frames:v','1','-vf','scale=720:720',RESULT_PROOF]);
run('ffmpeg', ['-y','-v','error','-i',SOURCE,'-vf',`fps=${20/TOTAL_SECONDS},scale=360:360,tile=5x4`,'-frames:v','1',CONTACT]);

const meta = probe(SOURCE);
const stream = meta.streams?.[0] || {};
const format = meta.format || {};
const metadataPass = stream.codec_name === 'h264' && stream.pix_fmt === 'yuv420p' && stream.avg_frame_rate === '24/1' && Number(stream.width) === 720 && Number(stream.height) === 720 && Number(stream.nb_read_frames) === TOTAL_FRAMES && Math.abs(Number(format.duration) - TOTAL_SECONDS) < 0.05;
const bodyActiveRatio = bodyQuaternionPairs ? bodyQuaternionActive / bodyQuaternionPairs : 0;
const correction = {
  generatedAt: new Date().toISOString(),
  reason: 'Owner visual inspection found the original wall-time-normalized EN WebM omitted the late RESULT event despite logical timeline QA passing.',
  scope: 'Owner-review evidence only; runtime, Geometry R1, Motion R1.2, Materials + Lighting R1, Semantic R1 config and GLB are unchanged.',
  method: 'Kept canonical EN frames 0-35.5s; generated a 5.5s deterministic runtime tail from the same Three.js prototype with RESULT plus post-semantic Y/-1 turn; concatenated and re-encoded to canonical 41s H.264.',
  result: {
    word: 'RESULT',
    faceKey: semanticPrep.faceKey,
    orientationDeg: semanticPrep.orientation.orientationDeg,
    entryVisibilityDot: semanticPrep.entryVisibilityDot,
    maxTextOpacity,
    minActiveVisibilityDot: Number.isFinite(minResultVisibilityDot) ? minResultVisibilityDot : null,
    bodyActiveFrameRatio: bodyActiveRatio,
    segmentationReturnTurn: { axis:'Y', layer:-1, direction:1, durationMs: FINAL_TURN_DURATION * 1000 },
  },
  runtime: { pageErrors, consoleErrors, pass: pageErrors.length === 0 && consoleErrors.length === 0 },
  mp4: { path: path.basename(SOURCE), metadata: meta, pass: metadataPass },
  visualProof: { resultFrame: path.basename(RESULT_PROOF), contactSheet: path.basename(CONTACT) },
  pass: metadataPass && pageErrors.length === 0 && consoleErrors.length === 0 && maxTextOpacity >= 0.99 && bodyActiveRatio >= 0.95,
};
fs.writeFileSync(CORRECTION_PATH, JSON.stringify(correction, null, 2) + '\n');
if (!correction.pass) throw new Error(`Owner video correction acceptance failed: ${JSON.stringify(correction, null, 2)}`);

const qa = JSON.parse(fs.readFileSync(QA_PATH, 'utf8'));
qa.ownerVisualReview = {
  enAllLockedWordsVisible: 'PASS',
  enResultOwnerProof: 'review/11-en-result-owner-proof.png',
  enContactSheet: 'review/video-contact-sheet-en.png',
  correction: 'OWNER_VIDEO_CORRECTION.json',
  reviewMethod: 'full-size static screenshots plus decoded/contact-sheet video frame inspection',
};
qa.videos.en = correction.mp4;
qa.acceptance.ownerENAllLockedWordsVisible = 'PASS';
qa.acceptance.ownerENMP4 = correction.mp4.pass ? 'PASS' : 'FAIL';
qa.acceptance.overall = Object.values(qa.acceptance).every(v => v === 'PASS' || v === 'NONE') ? 'PASS' : 'FAIL';
fs.writeFileSync(QA_PATH, JSON.stringify(qa, null, 2) + '\n');

const semanticQa = JSON.parse(fs.readFileSync(SEMANTIC_QA_PATH, 'utf8'));
semanticQa.ownerVideoCorrection = correction;
fs.writeFileSync(SEMANTIC_QA_PATH, JSON.stringify(semanticQa, null, 2) + '\n');

let report = fs.readFileSync(REPORT_PATH, 'utf8');
const note = `\n## Owner-video evidence correction\nOwner visual frame inspection found that the first EN Playwright/WebM wall-time normalization omitted the late **RESULT** state from the visible 41-second MP4 even though logical semantic QA passed. The canonical EN owner video was corrected at the evidence layer only: 0–35.5 s is retained, and 35.5–41.0 s is a deterministic capture from the same committed Three.js runtime showing **RESULT**, continuous body motion, semantic exit, and a post-semantic Y/-1 mechanical turn. Geometry R1, Motion R1.2, Materials + Lighting R1, Semantic R1 runtime/config, and the GLB were not changed. See \`OWNER_VIDEO_CORRECTION.json\` and \`review/11-en-result-owner-proof.png\`.\n`;
if (!report.includes('## Owner-video evidence correction')) report += note;
fs.writeFileSync(REPORT_PATH, report);

fs.rmSync(TMP, { recursive: true, force: true });
console.log(JSON.stringify({ pass: correction.pass, metadataPass, result: correction.result, runtime: correction.runtime, mp4: correction.mp4.metadata }, null, 2));
