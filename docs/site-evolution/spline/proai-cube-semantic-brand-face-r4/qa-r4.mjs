import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = process.env.PROAI_URL || 'http://127.0.0.1:4173/';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const within = (value, min, max) => Number.isFinite(value) && value >= min && value <= max;

async function semantic(page) {
  return page.evaluate(() => window.__PROAI_CUBE_R1_2.getSemanticDiagnostics());
}

async function waitSemantic(page, predicate, timeoutMs, label) {
  const started = Date.now();
  let last = null;
  while (Date.now() - started < timeoutMs) {
    last = await semantic(page);
    if (predicate(last)) return last;
    await sleep(35);
  }
  throw new Error(`${label} timeout; last=${JSON.stringify(last)}`);
}

const browser = await chromium.launch({
  headless: false,
  args: [
    '--no-first-run',
    '--disable-infobars',
    '--use-gl=desktop',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--disable-dev-shm-usage',
  ],
});

const context = await browser.newContext({
  viewport: { width: 720, height: 720 },
  deviceScaleFactor: 1,
  reducedMotion: 'no-preference',
});
const page = await context.newPage();
const fatalErrors = [];
page.on('pageerror', (error) => fatalErrors.push(String(error)));
page.on('console', (message) => {
  const text = message.text();
  if (message.type() === 'error' && /GLB load failed|TypeError|ReferenceError|WebGL context lost/i.test(text)) {
    fatalErrors.push(text);
  }
});

try {
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => window.__PROAI_CUBE_R1_2?.ready === true, null, { timeout: 120000 });

  const normal = await waitSemantic(page, (state) => state.complete === true, 45000, 'normal semantic completion');
  const normalDiag = await page.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
  const normalPass = within(normal.opportunityPresentationMs, 3150, 4300)
    && within(normal.firstTypographyElapsedMs, 80, 180)
    && within(normal.completedElapsedMs, 2200, 2700)
    && normal.semanticVelocityMultiplier === 0.70
    && normal.surfaceOpacityMax <= 0.08
    && normalDiag.presentation.simTimeMs > normal.entryPresentationMs;

  await page.evaluate(() => window.__PROAI_CUBE_R1_2.stopSliceScheduler());
  await page.waitForFunction(() => window.__PROAI_CUBE_R1_2.getDiagnostics().activeTurns.length === 0, null, { timeout: 10000 });
  const activeSlicePromise = page.evaluate(() => window.__PROAI_CUBE_R1_2.turnSlice({ axis: 'X', layer: 1, direction: 1, durationMs: 1200 }));
  await sleep(120);
  const replayAccepted = await page.evaluate(() => window.__PROAI_CUBE_R1_2.replaySemanticBrandMoment());
  const pending = await waitSemantic(page, (state) => state.pending === true && state.waitedForActiveSlice === true, 5000, 'active-slice pending state');
  const turnResult = await activeSlicePromise;
  const afterSlice = await waitSemantic(page, (state) => state.active === true, 5000, 'semantic start after active slice');
  const activeSlicePass = replayAccepted === true
    && pending.opportunityActiveTurns > 0
    && turnResult?.endpointErrorRad === 0
    && afterSlice.active === true;

  await waitSemantic(page, (state) => state.complete === true, 10000, 'active-slice replay completion');
  await page.evaluate(() => window.__PROAI_CUBE_R1_2.replaySemanticBrandMoment());
  await waitSemantic(page, (state) => state.active === true && state.elapsedMs > 320, 5000, 'mouse replay start');

  const canvas = page.locator('#cube-canvas');
  const box = await canvas.boundingBox();
  const x = box.x + box.width * 0.52;
  const y = box.y + box.height * 0.48;
  const mouseBefore = await page.evaluate(() => ({
    semantic: window.__PROAI_CUBE_R1_2.getSemanticDiagnostics(),
    diagnostics: window.__PROAI_CUBE_R1_2.getDiagnostics(),
  }));
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 68, y + 22, { steps: 6 });
  await sleep(160);
  await page.mouse.up();
  const mouseAfter = await page.evaluate(() => ({
    semantic: window.__PROAI_CUBE_R1_2.getSemanticDiagnostics(),
    diagnostics: window.__PROAI_CUBE_R1_2.getDiagnostics(),
    interaction: window.__PROAI_CUBE_R1_2.getInteractionState(),
  }));
  const mousePass = mouseAfter.semantic.elapsedMs > mouseBefore.semantic.elapsedMs
    && mouseAfter.semantic.entryPresentationMs === mouseBefore.semantic.entryPresentationMs
    && mouseAfter.diagnostics.presentation.simTimeMs > mouseBefore.diagnostics.presentation.simTimeMs
    && mouseAfter.interaction.resumeDelayRemainingMs === 0
    && mouseAfter.interaction.sliceResumeDelayRemainingMs === 0;

  const metrics = {
    pass: normalPass && activeSlicePass && mousePass && fatalErrors.length === 0,
    normalPass,
    activeSlicePass,
    mousePass,
    normal: {
      opportunityPresentationMs: normal.opportunityPresentationMs,
      entryPresentationMs: normal.entryPresentationMs,
      firstSurfaceElapsedMs: normal.firstSurfaceElapsedMs,
      firstTypographyElapsedMs: normal.firstTypographyElapsedMs,
      completedElapsedMs: normal.completedElapsedMs,
      face: normal.face,
      visibilityDot: normal.visibilityDot,
      semanticVelocityMultiplier: normal.semanticVelocityMultiplier,
      sliceBlockTargetMs: normal.sliceBlockTargetMs,
      surfaceOpacityMax: normal.surfaceOpacityMax,
      textMeshCount: normal.textMeshCount,
    },
    activeSlice: { pending, turnResult, afterSlice },
    mouse: { before: mouseBefore, after: mouseAfter },
    fatalErrors,
  };

  fs.mkdirSync('review-evidence', { recursive: true });
  fs.writeFileSync('review-evidence/r4-qa-metrics.json', JSON.stringify(metrics, null, 2));
  console.log('R4_QA_RESULT', JSON.stringify(metrics));
  if (!metrics.pass) process.exitCode = 1;
} finally {
  await browser.close();
}
