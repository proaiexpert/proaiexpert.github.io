import './assets/index-vldOIrE-.js';

const SOURCE = Object.freeze({
  branch: 'agent/proai-cube-semantic-brand-face-r4',
  productSha: 'd4902a151b5f4cc98032c956e3d9e1d0fca94827',
  activeBranchHeadInspected: '0c9cafc0d7a29879a257f11cd26a0db77bb187e6',
  geometryFoundationSha: '73082717909b6f4225841401fe4962d6ff4bbcca',
  presentationMotionSha: '89965750e4456a6e2d54d8309809471f8dbfcc75',
  materialsLightingSha: 'd17806da42275db617d8a46b231a2d877706a179',
  glbBlob: '7992019d85304c16244d0ca55a8cf15c13c26190',
  glbBytes: 279412,
  glbSha256: 'dbb7fc4156f8c9ed2481dd76443dffb9a45ecb5493463f99bffb34dd3b59c79b',
  compiledRuntimeBlob: '614b2ad663b6a50fb8df6dd15e3ead6b4bb69750',
});

const CANONICAL_HOME = Object.freeze({
  timeSec: 7.0,
  face: '-X',
  dot: 0.8157899685625494,
  yawDeg: 105.27831152343752,
  pitchDeg: -1.334899592494815,
  rollDeg: -1.2040611736578124,
});

const LIVING = Object.freeze({
  timeScale: 0.18,
  signatureEntryYawDegPerSecApprox: 4.66,
  fullCanonicalCycleSecApprox: 377.8,
  sliceChoreography: false,
  semanticFace: false,
  wordmarkAnimated: false,
});

function waitForApi(timeoutMs = 45000) {
  const started = performance.now();
  return new Promise((resolve, reject) => {
    function poll() {
      const api = window.__PROAI_CUBE_R1_2;
      if (api?.ready) return resolve(api);
      if (performance.now() - started > timeoutMs) return reject(new Error('Canonical ProAI Cube runtime did not become ready'));
      requestAnimationFrame(poll);
    }
    poll();
  });
}

function resolveCanonicalHomePose(api) {
  const pose = api.getSemanticPoseAt(CANONICAL_HOME.timeSec);
  if (!pose) throw new Error('Canonical R4.1 home pose is unavailable');
  if (pose.face !== CANONICAL_HOME.face || Math.abs(pose.dot - CANONICAL_HOME.dot) > 0.02) {
    throw new Error(`Canonical R4.1 home pose provenance mismatch: ${pose.face} / ${pose.dot}`);
  }
  return pose;
}

function neutralizeSemanticAndSlices(api) {
  api.stopSliceScheduler?.();
  api.clearSemanticReviewState?.();
}

function publishState(mode, pose, speedScale = 0) {
  window.__PROAI_LOGO_R3 = Object.freeze({
    ready: true,
    mode,
    source: SOURCE,
    canonicalHomeReference: CANONICAL_HOME,
    canonicalHomePose: pose,
    living: LIVING,
    speedScale,
    wordmark: 'PROAI EXPERT',
    composition: 'CUBE LEFT + WORDMARK RIGHT + ONE ROW',
    identityRule: 'same canonical ProAI Cube; no new logo geometry',
  });
  window.__PROAI_LOGO_R3_LIVE = { virtualTimeSec: pose.timeSec, frames: 0 };
  document.documentElement.dataset.proaiLogoR3Ready = 'true';
  const status = document.getElementById('runtime-status');
  if (status) status.textContent = mode === 'living'
    ? 'CANONICAL PROAI CUBE · SLOW LIVING SIGNATURE · 0.18× PRESENTATION TIME'
    : 'CANONICAL PROAI CUBE · STATIC HOME POSE · FROZEN R4.1 PRODUCT';
}

async function init() {
  const mode = document.body.dataset.r3Mode || 'static';
  const api = await waitForApi();
  neutralizeSemanticAndSlices(api);
  const home = resolveCanonicalHomePose(api);

  if (mode === 'living') {
    const started = performance.now();
    publishState(mode, home, LIVING.timeScale);
    const tick = (now) => {
      const virtualTimeSec = home.timeSec + ((now - started) / 1000) * LIVING.timeScale;
      api.setReviewPresentation(virtualTimeSec, 1, false);
      api.clearSemanticReviewState?.();
      api.renderReviewFrame();
      window.__PROAI_LOGO_R3_LIVE.virtualTimeSec = virtualTimeSec;
      window.__PROAI_LOGO_R3_LIVE.frames += 1;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return;
  }

  api.setReviewPresentation(home.timeSec, 1, false);
  api.clearSemanticReviewState?.();
  api.renderReviewFrame();
  publishState(mode, home, 0);
}

init().catch((error) => {
  console.error(error);
  const status = document.getElementById('runtime-status');
  if (status) status.textContent = `R3 review error: ${error.message}`;
  document.documentElement.dataset.proaiLogoR3Ready = 'error';
});
