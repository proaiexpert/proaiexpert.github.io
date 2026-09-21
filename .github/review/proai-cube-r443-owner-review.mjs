import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const url = process.env.REVIEW_URL;
if (!url) throw new Error('REVIEW_URL missing');
const out = path.resolve('review-evidence/r443');
fs.mkdirSync(out, { recursive: true });
const fatal = [];
const median = values => {
  if (!values.length) return null;
  const a = [...values].sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
};
const deltaCounts = (a, b, keys) => Object.fromEntries(keys.map(k => [k, (b?.[k] || 0) - (a?.[k] || 0)]));
const browser = await chromium.launch({ headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
const ready = async page => {
  page.on('pageerror', e => fatal.push('pageerror:' + String(e)));
  page.on('console', m => { if (m.type() === 'error') fatal.push('console:' + m.text()); });
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  if (!response || response.status() !== 200) throw new Error('navigation status ' + response?.status());
  await page.waitForFunction(() => window.__PROAI_CUBE_R1_2?.ready === true, null, { timeout: 60000 });
};
const read = page => page.evaluate(() => ({
  s: window.__PROAI_CUBE_R1_2.getSemanticDiagnostics(),
  d: window.__PROAI_CUBE_R1_2.getDiagnostics(),
  interaction: window.__PROAI_CUBE_R1_2.getInteractionState(),
}));
const copyVideo = async (video, name) => {
  const p = await video.path();
  const dest = path.join(out, name);
  fs.copyFileSync(p, dest);
  return dest;
};

// 60 seconds wall-clock, with telemetry sampled inside the page to avoid
// SwiftShader + Playwright IPC becoming the measurement bottleneck.
const desktop = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1,
  reducedMotion: 'no-preference',
  recordVideo: { dir: out, size: { width: 1280, height: 720 } },
});
const page = await desktop.newPage();
await ready(page);
const desktopVideo = page.video();
const start = await read(page);
const startSim = start.d.presentation.simTimeMs;
await page.evaluate(() => {
  const t0 = performance.now();
  window.__R443_QA_TRACE = [];
  window.__R443_QA_TIMER = setInterval(() => {
    try {
      const s = window.__PROAI_CUBE_R1_2.getSemanticDiagnostics();
      const d = window.__PROAI_CUBE_R1_2.getDiagnostics();
      const r = s.r443Lifecycle || {};
      const m = s.r443Motion || {};
      window.__R443_QA_TRACE.push({
        wallSec: (performance.now() - t0) / 1000,
        presentationMs: d.presentation.simTimeMs,
        phase: r.phase,
        yawVelocityDegPerSec: m.yawVelocityDegPerSec,
        signedYawDeg: m.signedYawDeg,
        cumulativeYawDeg: m.cumulativeYawDeg,
        timeScale: s.timeScale ?? 1,
        protected: s.r442DynamicFace?.protected === true,
        protectedFace: s.r442DynamicFace?.protectedFace || null,
      });
    } catch {}
  }, 1000);
});
await page.waitForTimeout(60000);
const end = await page.evaluate(() => {
  clearInterval(window.__R443_QA_TIMER);
  return {
    s: window.__PROAI_CUBE_R1_2.getSemanticDiagnostics(),
    d: window.__PROAI_CUBE_R1_2.getDiagnostics(),
    interaction: window.__PROAI_CUBE_R1_2.getInteractionState(),
    trace: window.__R443_QA_TRACE || [],
  };
});
await page.screenshot({ path: path.join(out, 'desktop-60s-end.png'), fullPage: true });
await desktop.close();
await copyVideo(desktopVideo, 'desktop-observation-60s.webm');

const trace = end.trace;
const life = end.s.r443Lifecycle || {};
const dyn = end.s.r442DynamicFace || {};
const moves = end.s.r442MoveDiversity || {};
const axisCounts = deltaCounts(start.s.r442MoveDiversity?.axisCounts, moves.axisCounts, ['X', 'Y', 'Z']);
const layerCounts = deltaCounts(start.s.r442MoveDiversity?.layerCounts, moves.layerCounts, ['-1', '0', '1']);
const forward = (moves.moveLog || []).filter(x => x.phase === 'forward' && x.presentationMs >= startSim).map(x => ({
  timestampSec: +((x.presentationMs - startSim) / 1000).toFixed(3), axis: x.axis, layer: x.layer, direction: x.direction, r443Phase: x.r443Phase,
}));
const candidates = (life.candidateLog || []).filter(x => x.presentationMs >= startSim).map(x => ({ ...x, timestampSec: +((x.presentationMs - startSim) / 1000).toFixed(3) }));
const events = (life.eventLog || []).filter(x => x.startMs >= startSim).map(x => ({ ...x, timestampSec: +((x.startMs - startSim) / 1000).toFixed(3) }));
const lifecycle = (life.lifecycleLog || []).filter(x => x.presentationMs >= startSim).map(x => ({ ...x, timestampSec: +((x.presentationMs - startSim) / 1000).toFixed(3) }));
const releases = lifecycle.filter(x => x.type === 'release');
const dispersals = lifecycle.filter(x => x.type === 'dispersal-slice');
const latencies = (life.dispersalLatenciesMs || []).map(x => x / 1000);
const intervals = (life.opportunityIntervalsMs || []).map(x => x / 1000);
const readable = (life.readableDurationsMs || []).map(x => x / 1000);
const faces = [...new Set(events.map(x => x.face))];
const seq = ['ProAI Expert', 'TRUST', 'INQUIRY', 'RESPONSE', 'RESULT'];
const sequencePass = events.length >= 5 && events.every((e, i) => e.message === seq[i % seq.length]);
const totalMoves = Object.values(axisCounts).reduce((a, b) => a + b, 0);
const maxAxisShare = totalMoves ? Math.max(...Object.values(axisCounts)) / totalMoves : 1;
const yawPositive = trace.length >= 40 && trace.every(x => Number.isFinite(x.yawVelocityDegPerSec) && x.yawVelocityDegPerSec > 0);
const yawContinuous = trace.every((x, i) => i === 0 || x.cumulativeYawDeg >= trace[i - 1].cumulativeYawDeg - 1e-5);
const motionIndependent = trace.length >= 40 && trace.every(x => Math.abs(x.timeScale - 1) < 1e-9) && end.s.r443Motion?.semanticVelocityMultiplier === 1;
const noTearing = (dyn.unsafeProtectedStarts || 0) === 0 && (dyn.assemblyViolations || 0) === 0;
const noFlash = (life.shortReadableCount || 0) === 0 && readable.every(x => x >= 0.6);
const targetDispersals = latencies.filter(x => x >= 0.35 && x <= 1.25).length;
const dispersalPass = latencies.length >= Math.max(1, releases.length - 1) && latencies.every(x => x >= 0.20 && x <= 2.0) && targetDispersals / Math.max(1, latencies.length) >= 0.60;
const cadencePass = intervals.length >= 3 && Math.min(...intervals) >= 3.2 && median(intervals) >= 4 && median(intervals) <= 9.5 && Math.max(...intervals) <= 18;
const diversityPass = ['X', 'Y', 'Z'].every(k => axisCounts[k] > 0) && ['-1', '0', '1'].every(k => layerCounts[k] > 0) && maxAxisShare <= 0.62;
const facePass = faces.length >= 2;

// Focused 15s clip: one lifecycle read after capture, no high-frequency IPC.
const focused = await browser.newContext({
  viewport: { width: 1000, height: 650 }, deviceScaleFactor: 1, reducedMotion: 'no-preference',
  recordVideo: { dir: out, size: { width: 1000, height: 650 } },
});
const fp = await focused.newPage();
await ready(fp);
const focusedVideo = fp.video();
const f0 = await read(fp);
const fStart = f0.d.presentation.simTimeMs;
await fp.waitForTimeout(15000);
const f1 = await read(fp);
const flog = (f1.s.r443Lifecycle?.lifecycleLog || []).filter(x => x.presentationMs >= fStart);
const readableStart = flog.find(x => x.type === 'readable-start')?.presentationMs ?? null;
const releaseAt = readableStart === null ? null : (flog.find(x => x.type === 'release' && x.presentationMs >= readableStart)?.presentationMs ?? null);
const dispersalAt = releaseAt === null ? null : (flog.find(x => x.type === 'dispersal-slice' && x.presentationMs >= releaseAt)?.presentationMs ?? null);
await fp.screenshot({ path: path.join(out, 'focused-semantic-release-dispersal.png') });
await focused.close();
await copyVideo(focusedVideo, 'focused-semantic-release-dispersal.webm');
const focusedPass = readableStart !== null && releaseAt !== null && dispersalAt !== null;

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'no-preference',
  recordVideo: { dir: out, size: { width: 390, height: 844 } },
});
const mp = await mobile.newPage();
await ready(mp);
const mobileVideo = mp.video();
const m0 = await read(mp);
await mp.waitForTimeout(12000);
const m1 = await read(mp);
await mp.screenshot({ path: path.join(out, 'mobile-390x844.png'), fullPage: true });
const canvasBox = await mp.locator('#cube-canvas').boundingBox();
await mobile.close();
await copyVideo(mobileVideo, 'mobile-12s.webm');
const mobilePass = m1.d.presentation.simTimeMs > m0.d.presentation.simTimeMs && canvasBox && canvasBox.width > 0 && canvasBox.x + canvasBox.width <= 390.5;

const interaction = await browser.newContext({ viewport: { width: 900, height: 600 }, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
const ip = await interaction.newPage();
await ready(ip);
const ib = await ip.locator('#cube-canvas').boundingBox();
const i0 = await read(ip);
if (ib) {
  const x = ib.x + ib.width * 0.5, y = ib.y + ib.height * 0.5;
  await ip.mouse.move(x, y); await ip.mouse.down(); await ip.mouse.move(x + 105, y - 55, { steps: 10 }); await ip.mouse.up();
}
await ip.waitForTimeout(3200);
const i1 = await read(ip);
await interaction.close();
const c0 = i0.interaction.cameraPosition, c1 = i1.interaction.cameraPosition;
const cameraDelta = Math.hypot(c1[0] - c0[0], c1[1] - c0[1], c1[2] - c0[2]);
const interactionPass = cameraDelta > 1e-4 && i1.d.presentation.simTimeMs > i0.d.presentation.simTimeMs && Boolean(i1.s.r443Lifecycle);
await browser.close();

const checks = {
  sequencePass, yawPositive, yawContinuous, motionIndependent, noTearing, noFlash,
  dispersalPass, cadencePass, diversityPass, facePass, focusedPass, mobilePass, interactionPass,
};
checks.behaviorPass = Object.values(checks).every(Boolean);
const metrics = {
  revision: 'PROAI CUBE R4.4.3 — OWNER REVIEW CANDIDATE',
  productSha: '731f435c3ee895300d053a83153832cabe65f2ca',
  publicUrl: url,
  observationSec: 60,
  axisCounts, layerCounts, maxAxisShare,
  forwardSlices: forward, candidates, events, releases, dispersals,
  semanticFacesSelected: faces,
  readableDurationsSec: readable,
  opportunityIntervalsSec: intervals,
  dispersalLatenciesSec: latencies,
  dispersalLatencySummarySec: { min: latencies.length ? Math.min(...latencies) : null, median: median(latencies), max: latencies.length ? Math.max(...latencies) : null },
  orientationTrace: trace,
  focused: { readableStart, releaseAt, dispersalAt },
  interaction: { cameraDelta },
  checks,
  fatal,
};
fs.writeFileSync(path.join(out, 'r443-metrics.json'), JSON.stringify(metrics, null, 2));
fs.writeFileSync(path.join(out, 'r443-summary.txt'), [
  'PROAI CUBE R4.4.3 — OWNER REVIEW CANDIDATE',
  'product=731f435c3ee895300d053a83153832cabe65f2ca',
  'axisCounts=' + JSON.stringify(axisCounts),
  'layerCounts=' + JSON.stringify(layerCounts),
  'faces=' + JSON.stringify(faces),
  'readableDurationsSec=' + JSON.stringify(readable),
  'opportunityIntervalsSec=' + JSON.stringify(intervals),
  'dispersalLatenciesSec=' + JSON.stringify(latencies),
  'checks=' + JSON.stringify(checks),
  'fatal=' + JSON.stringify(fatal),
].join('\n') + '\n');
if (fatal.length) throw new Error('browser errors: ' + fatal.join(' | '));
if (!checks.behaviorPass) throw new Error('R4.4.3 behavioral gate failed: ' + JSON.stringify(checks));
