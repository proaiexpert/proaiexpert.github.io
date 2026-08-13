import './runtime-r2.js';

const params = new URLSearchParams(location.search);
const captureMode = params.has('capture');
const base = window.__PROAI_CUBE_R1_2;

const R2 = Object.freeze({
  face: '-X',
  baselinePresentationDurationSec: 27,
  selectedPresentationSec: 7.58,
  decelStartPresentationSec: 7.36,
  decelerationSec: 0.44,
  revealSurfaceStartSec: 0.32,
  revealTextStartSec: 0.34,
  revealEndSec: 1.04,
  specularStartSec: 0.96,
  specularEndSec: 1.52,
  holdEndSec: 2.52,
  textExitEndSec: 3.04,
  surfaceRestoreStartSec: 2.56,
  surfaceRestoreEndSec: 3.04,
  accelerationStartSec: 3.04,
  accelerationSec: 0.44,
  eventWallStartSec: 7.36,
  eventWallEndSec: 10.84,
  addedWallTimeSec: 3.04,
  finalWallDurationSec: 30.04,
  minVisibilityDot: 0.88,
  preferredVisibilityDot: 0.92,
  minSchedulerLeadMs: 270,
});

function clamp01(value) { return Math.min(1, Math.max(0, value)); }
function smootherstep(value) {
  const x = clamp01(value);
  return x * x * x * (x * (x * 6 - 15) + 10);
}
function integralSmootherstep(x) {
  const u = clamp01(x);
  return u ** 3 - 0.5 * u ** 4;
}
function integralOneMinusSmootherstep(x) {
  const u = clamp01(x);
  return u - u ** 3 + 0.5 * u ** 4;
}

function ownerPresentationTime(wallSec) {
  const w = Math.max(0, wallSec);
  const d0 = R2.eventWallStartSec;
  const d1 = d0 + R2.decelerationSec;
  const a0 = R2.eventWallStartSec + R2.accelerationStartSec;
  const a1 = a0 + R2.accelerationSec;
  if (w <= d0) return w;
  if (w < d1) {
    const u = (w - d0) / R2.decelerationSec;
    return R2.decelStartPresentationSec + R2.decelerationSec * integralOneMinusSmootherstep(u);
  }
  if (w < a0) return R2.selectedPresentationSec;
  if (w < a1) {
    const u = (w - a0) / R2.accelerationSec;
    return R2.selectedPresentationSec + R2.accelerationSec * integralSmootherstep(u);
  }
  return R2.selectedPresentationSec + R2.accelerationSec * 0.5 + (w - a1);
}

function ownerTimeScale(wallSec) {
  const w = Math.max(0, wallSec);
  const d0 = R2.eventWallStartSec;
  const d1 = d0 + R2.decelerationSec;
  const a0 = R2.eventWallStartSec + R2.accelerationStartSec;
  const a1 = a0 + R2.accelerationSec;
  if (w < d0) return 1;
  if (w < d1) return 1 - smootherstep((w - d0) / R2.decelerationSec);
  if (w < a0) return 0;
  if (w < a1) return smootherstep((w - a0) / R2.accelerationSec);
  return 1;
}

function semanticStateAtElapsed(elapsedSec) {
  const e = elapsedSec;
  if (e < R2.revealSurfaceStartSec || e >= R2.surfaceRestoreEndSec) {
    return { surface: 0, text: 0, specular: 0 };
  }
  let surface = smootherstep((e - R2.revealSurfaceStartSec) / (R2.revealEndSec - R2.revealSurfaceStartSec));
  let text = e < R2.revealTextStartSec
    ? 0
    : smootherstep((e - R2.revealTextStartSec) / (R2.revealEndSec - R2.revealTextStartSec));
  if (e >= R2.holdEndSec) {
    text = 1 - smootherstep((e - R2.holdEndSec) / (R2.textExitEndSec - R2.holdEndSec));
  }
  if (e >= R2.surfaceRestoreStartSec) {
    surface = 1 - smootherstep((e - R2.surfaceRestoreStartSec) / (R2.surfaceRestoreEndSec - R2.surfaceRestoreStartSec));
  }
  const specular = e >= R2.specularStartSec && e <= R2.specularEndSec
    ? clamp01((e - R2.specularStartSec) / (R2.specularEndSec - R2.specularStartSec))
    : 0;
  return { surface, text, specular };
}

function ownerSemanticState(wallSec) {
  return semanticStateAtElapsed(wallSec - R2.eventWallStartSec);
}

async function waitForBase() {
  const deadline = performance.now() + 90000;
  while (!base?.ready) {
    if (performance.now() > deadline) throw new Error('Timed out waiting for frozen Materials R1 runtime');
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  try {
    await Promise.race([
      document.fonts.load('600 160px "Instrument Sans"'),
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);
  } catch {
    // Browser/system fallback remains a modern grotesk; capture QA records font readiness explicitly.
  }
  base.r2InitSemanticSurface(R2.face);
}

let liveEvent = null;
let liveCompleted = false;
let liveSelection = null;
let liveLastNow = 0;

function canBeginLiveEvent(diag) {
  const p = diag.presentation.simTimeMs / 1000;
  if (p < R2.decelStartPresentationSec || p > 8.0) return false;
  if (diag.activeTurns.length !== 0) return false;
  if ((diag.scheduler?.delayRemainingMs || 0) < R2.minSchedulerLeadMs) return false;
  const semantic = base.r2SemanticInfo();
  return Boolean(semantic && semantic.visibilityDot >= R2.minVisibilityDot);
}

function driveLive(now) {
  if (!base.ready || captureMode || liveCompleted) return;
  if (!liveLastNow) liveLastNow = now;
  liveLastNow = now;
  const diag = base.getDiagnostics();
  if (!liveEvent) {
    if (canBeginLiveEvent(diag)) {
      liveEvent = { wallStartMs: now, presentationStartSec: diag.presentation.simTimeMs / 1000 };
      liveSelection = {
        presentationStartSec: liveEvent.presentationStartSec,
        visibilityDot: base.r2SemanticInfo()?.visibilityDot ?? null,
      };
      base.r2SetTimeControl({ timeScale: 1, blockNewSlices: true });
    }
    requestAnimationFrame(driveLive);
    return;
  }

  const elapsed = (now - liveEvent.wallStartMs) / 1000;
  const decelProgress = clamp01(elapsed / R2.decelerationSec);
  let timeScale = 1;
  let blockNewSlices = true;
  if (elapsed < R2.decelerationSec) {
    timeScale = 1 - smootherstep(decelProgress);
  } else if (elapsed < R2.accelerationStartSec) {
    timeScale = 0;
  } else if (elapsed < R2.accelerationStartSec + R2.accelerationSec) {
    timeScale = smootherstep((elapsed - R2.accelerationStartSec) / R2.accelerationSec);
    blockNewSlices = false;
  } else {
    timeScale = 1;
    blockNewSlices = false;
  }
  base.r2SetTimeControl({ timeScale, blockNewSlices });
  base.r2SetSemanticState(semanticStateAtElapsed(elapsed));

  if (elapsed >= R2.accelerationStartSec + R2.accelerationSec) {
    base.r2SetTimeControl({ timeScale: 1, blockNewSlices: false });
    base.r2SetSemanticState({ surface: 0, text: 0, specular: 0 });
    liveCompleted = true;
    return;
  }
  requestAnimationFrame(driveLive);
}

const r2Api = {
  ready: false,
  config: R2,
  ownerPresentationTime,
  ownerTimeScale,
  ownerSemanticState,
  semanticStateAtElapsed,
  setOwnerSemanticFrame(wallSec) {
    if (!base.ready) return false;
    const timeScale = ownerTimeScale(wallSec);
    const elapsed = wallSec - R2.eventWallStartSec;
    const blockNewSlices = elapsed >= 0 && elapsed < R2.accelerationStartSec;
    base.r2SetTimeControl({ timeScale, blockNewSlices });
    return base.r2SetSemanticState(ownerSemanticState(wallSec));
  },
  getDiagnostics() {
    return {
      config: R2,
      liveEvent,
      liveCompleted,
      liveSelection,
      base: base.getDiagnostics(),
      semantic: base.r2SemanticInfo(),
      state: base.r2StateSnapshot(),
    };
  },
};
window.__PROAI_CUBE_R2 = r2Api;

await waitForBase();
r2Api.ready = true;
const status = document.getElementById('runtime-status');
if (status) status.textContent = 'ProAI Cube Semantic Brand Moment R2 ready.';
if (!captureMode) requestAnimationFrame(driveLive);
