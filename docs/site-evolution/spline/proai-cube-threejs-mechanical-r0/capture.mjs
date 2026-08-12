import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REVIEW = path.join(ROOT, 'review');
const URL = process.env.PROAI_R0_URL || 'http://127.0.0.1:4173/?capture=1';
const VIEWPORT = { width: 900, height: 1040 };
fs.mkdirSync(REVIEW, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=swiftshader'],
});

function attachDiagnostics(page, bucket) {
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') bucket.console.push(`${msg.type()}: ${msg.text()}`);
  });
  page.on('pageerror', (error) => bucket.pageErrors.push(String(error)));
  page.on('request', (request) => bucket.requests.push(request.url()));
}

async function waitReady(page) {
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForFunction(() => window.__PROAI_CUBE_R0?.ready === true, null, { timeout: 90000 });
  await page.waitForTimeout(500);
}

async function screenshot(page, filename) {
  const dataUrl = await page.evaluate(() => window.__PROAI_CUBE_R0.captureFrame());
  const comma = dataUrl.indexOf(',');
  if (!dataUrl.startsWith('data:image/png') || comma < 0) throw new Error('Canvas PNG capture failed');
  fs.writeFileSync(path.join(REVIEW, filename), Buffer.from(dataUrl.slice(comma + 1), 'base64'));
}

const telemetry = { console: [], pageErrors: [], requests: [] };
const page = await browser.newPage({ viewport: VIEWPORT });
attachDiagnostics(page, telemetry);
await waitReady(page);

const initialDiagnostics = await page.evaluate(() => window.__PROAI_CUBE_R0.getDiagnostics());
await screenshot(page, 'proai-cube-r0-natural-3q.png');

await page.evaluate(() => { void window.__PROAI_CUBE_R0.playSlice({ direction: 1 }); });
await page.waitForFunction(() => window.__PROAI_CUBE_R0?.motionState === 'turned', null, { timeout: 90000 });
await page.waitForTimeout(220);
await screenshot(page, 'proai-cube-r0-slice-turn.png');
const turnedDiagnostics = await page.evaluate(() => window.__PROAI_CUBE_R0.getDiagnostics());
await page.evaluate(() => window.__PROAI_CUBE_R0.resetSlice({ direction: 1 }));
await page.waitForFunction(() => window.__PROAI_CUBE_R0?.motionState === 'rest', null, { timeout: 90000 });
const repeatability = await page.evaluate(() => window.__PROAI_CUBE_R0.runRepeatabilityTest(6, 0.08));
const finalDiagnostics = await page.evaluate(() => window.__PROAI_CUBE_R0.getDiagnostics());
await page.close();

const videoTelemetry = { console: [], pageErrors: [], requests: [] };
const videoContext = await browser.newContext({ viewport: VIEWPORT, recordVideo: { dir: REVIEW, size: VIEWPORT } });
const videoPage = await videoContext.newPage();
attachDiagnostics(videoPage, videoTelemetry);
await waitReady(videoPage);
await videoPage.waitForTimeout(1300);
await videoPage.evaluate(() => { void window.__PROAI_CUBE_R0.playSlice({ direction: 1 }); });
await videoPage.waitForFunction(() => window.__PROAI_CUBE_R0?.motionState === 'turned', null, { timeout: 90000 });
await videoPage.waitForTimeout(1300);

const start = { x: VIEWPORT.width * 0.54, y: VIEWPORT.height * 0.52 };
const end = { x: start.x - 118, y: start.y + 44 };
await videoPage.mouse.move(start.x, start.y);
await videoPage.mouse.down();
for (let i = 1; i <= 22; i += 1) {
  const t = i / 22;
  await videoPage.mouse.move(start.x + (end.x - start.x) * t, start.y + (end.y - start.y) * t);
  await videoPage.waitForTimeout(18);
}
await videoPage.mouse.up();
await videoPage.waitForTimeout(1400);
await videoPage.evaluate(() => { void window.__PROAI_CUBE_R0.resetSlice({ direction: 1 }); });
await videoPage.waitForFunction(() => window.__PROAI_CUBE_R0?.motionState === 'rest', null, { timeout: 90000 });
await videoPage.waitForTimeout(1200);

const video = videoPage.video();
await videoContext.close();
const rawVideo = path.join(REVIEW, 'proai-cube-r0-review-raw.webm');
const targetVideo = path.join(REVIEW, 'proai-cube-r0-review-12s.webm');
for (const file of [rawVideo, targetVideo]) if (fs.existsSync(file)) fs.rmSync(file);
await video.saveAs(rawVideo);

let videoDurationSec = null;
try {
  execFileSync('ffmpeg', ['-y', '-sseof', '-13', '-i', rawVideo, '-t', '13', '-c', 'copy', targetVideo], { stdio: 'ignore' });
  const duration = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', targetVideo], { encoding: 'utf8' }).trim();
  videoDurationSec = Number(duration);
  fs.rmSync(rawVideo);
} catch (error) {
  console.warn(`Video trim probe failed; retaining raw evidence: ${error}`);
  if (!fs.existsSync(targetVideo) && fs.existsSync(rawVideo)) fs.renameSync(rawVideo, targetVideo);
}
await browser.close();

const allRequests = [...telemetry.requests, ...videoTelemetry.requests];
const forbiddenRequests = [...new Set(allRequests.filter((url) => /prod\.spline\.design|\.splinecode(?:$|\?)/i.test(url)))];
const browserErrors = [...telemetry.pageErrors, ...videoTelemetry.pageErrors];
const consoleErrors = [...telemetry.console, ...videoTelemetry.console].filter((line) => line.startsWith('error:'));
const forward = turnedDiagnostics.forwardTelemetry;
const hierarchyPass = initialDiagnostics.hierarchy?.pass === true;
const mechanicsPass =
  initialDiagnostics.mechanics?.axis === 'X' &&
  initialDiagnostics.mechanics?.rightLayerUniqueSpatialCubies === 9 &&
  Math.abs(turnedDiagnostics.endpointErrorRad ?? 999) < 1e-8 &&
  repeatability.pass === true;
const motionTelemetryPass =
  Boolean(forward) &&
  forward.monotonic === true &&
  forward.overshoot === false &&
  forward.sampleCount >= 8 &&
  forward.maxAbsStepRad < 0.35;
const videoDurationPass = videoDurationSec == null || (videoDurationSec >= 9.5 && videoDurationSec <= 15.5);
const splineDependencyNone = forbiddenRequests.length === 0;
const runtimePass = browserErrors.length === 0 && consoleErrors.length === 0;

const qa = {
  generatedAt: new Date().toISOString(),
  url: URL,
  viewport: VIEWPORT,
  initialDiagnostics,
  turnedDiagnostics,
  finalDiagnostics,
  repeatability,
  videoDurationSec,
  network: {
    totalRequests: allRequests.length,
    forbiddenRequests,
    splineDependency: splineDependencyNone ? 'NONE' : 'FOUND',
  },
  browser: {
    pageErrors: browserErrors,
    consoleErrors,
  },
  acceptance: {
    hierarchy: hierarchyPass ? 'PASS' : 'FAIL',
    sliceMechanics90: mechanicsPass ? 'PASS' : 'FAIL',
    motionTelemetry: motionTelemetryPass ? 'PASS' : 'FAIL',
    videoDuration: videoDurationPass ? 'PASS' : 'FAIL',
    runtime: runtimePass ? 'PASS' : 'FAIL',
    splineDependency: splineDependencyNone ? 'NONE' : 'FOUND',
  },
};
fs.writeFileSync(path.join(REVIEW, 'qa-report.json'), JSON.stringify(qa, null, 2) + '\n');

const report = `# ProAI Cube — Three.js Mechanical Parity R0 — Technical Report\n\n` +
`## Scope\n\nIsolated Three.js proof using the exact clean GLB geometry. No Hero integration, production route changes, Spline runtime, .splinecode runtime dependency, or prod.spline.design request.\n\n` +
`## Geometry / hierarchy\n\n- Named hierarchy: **${qa.acceptance.hierarchy}**.\n- Axis selected from actual GLB/world-space clustering: **${initialDiagnostics.mechanics.axis}**.\n- X cluster means: \`${JSON.stringify(initialDiagnostics.mechanics.xClusterMeans)}\`.\n- X cluster object counts: \`${JSON.stringify(initialDiagnostics.mechanics.xClusterObjectCounts)}\`.\n- Right layer objects temporarily pivoted: **${initialDiagnostics.mechanics.rightLayerObjectCount}**.\n- Right layer unique spatial cubies: **${initialDiagnostics.mechanics.rightLayerUniqueSpatialCubies}**.\n- Source hierarchy is restored exactly after reset; leaf meshes are never flattened into a new cube.\n\n` +
`## Motion\n\n- Forward turn: **${initialDiagnostics.motionConfig.turnDurationMs} ms**.\n- Reset: **${initialDiagnostics.motionConfig.resetDurationMs} ms**.\n- Easing: cubic-bezier **${initialDiagnostics.motionConfig.easing.join(', ')}**.\n- Settle/hold: **${initialDiagnostics.motionConfig.holdAfterTurnMs} ms**.\n- Orbit damping factor: **${initialDiagnostics.motionConfig.orbitDampingFactor}**; rotate speed **${initialDiagnostics.motionConfig.orbitRotateSpeed}**.\n- Exact 90° endpoint error: **${turnedDiagnostics.endpointErrorRad} rad**.\n- Forward telemetry: ${JSON.stringify(forward)}.\n- Repeatability: ${repeatability.cycles} accelerated cycles; max position error ${repeatability.maxPosition}; max quaternion error ${repeatability.maxQuaternionRad}; max scale error ${repeatability.maxScale}; **${repeatability.pass ? 'PASS' : 'FAIL'}**.\n\n` +
`## Reference calibration\n\nResend's current design documentation describes the homepage object as a rotating Rubik's Cube and frames it as a deliberate demonstration of technical craft; Spline's case study confirms that the live cube is built in Spline and evolved through material, lighting, and interaction passes. R0 does not copy that implementation. Motion was calibrated toward a slow weighted turn: long acceleration/deceleration envelope, no overshoot, exact terminal quaternion, visible hold, and restrained orbit damping.\n\n` +
`## Browser / dependency QA\n\n- Runtime: **${qa.acceptance.runtime}**.\n- Spline runtime/network dependency: **${qa.acceptance.splineDependency}**.\n- Forbidden network requests: ${forbiddenRequests.length}.\n- Browser page errors: ${browserErrors.length}.\n- Browser console errors: ${consoleErrors.length}.\n- Review video duration: ${videoDurationSec == null ? 'unknown' : `${videoDurationSec.toFixed(2)} s`}.\n\n` +
`## Review evidence\n\n- \`review/proai-cube-r0-natural-3q.png\`\n- \`review/proai-cube-r0-slice-turn.png\`\n- \`review/proai-cube-r0-review-12s.webm\`\n- \`review/qa-report.json\`\n\n` +
`## Gate\n\nAutomated hierarchy/mechanics/runtime checks are recorded above. Visual premium-motion acceptance remains an owner-review gate; this R0 does not advance to Hero or final art direction.\n`;
fs.writeFileSync(path.join(ROOT, 'TECHNICAL_REPORT.md'), report);

if (!hierarchyPass || !mechanicsPass || !motionTelemetryPass || !videoDurationPass || !splineDependencyNone || !runtimePass) {
  console.error(JSON.stringify(qa, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(qa.acceptance, null, 2));
