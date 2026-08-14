import './assets/index-vldOIrE-.js';

const SOURCE = Object.freeze({
  branch: 'agent/proai-cube-semantic-brand-face-r4',
  sha: '0c9cafc0d7a29879a257f11cd26a0db77bb187e6',
  glbBlob: '7992019d85304c16244d0ca55a8cf15c13c26190',
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
  if (!pose) throw new Error('Canonical R4 home pose is unavailable');
  if (pose.face !== CANONICAL_HOME.face || Math.abs(pose.dot - CANONICAL_HOME.dot) > 0.02) {
    throw new Error(`Canonical R4 home pose provenance mismatch: ${pose.face} / ${pose.dot}`);
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
    speedScale,
    identityRule: 'same canonical ProAI Cube; no new logo geometry',
  });
  document.documentElement.dataset.proaiLogoR3Ready = 'true';
  const status = document.getElementById('runtime-status');
  if (status) status.textContent = mode === 'living'
    ? 'CANONICAL PROAI CUBE · LIVING SIGNATURE · 0.10× PRESENTATION TIME'
    : 'CANONICAL PROAI CUBE · STATIC HOME POSE · R4.2 SOURCE';
}

async function init() {
  const mode = document.body.dataset.r3Mode || 'static';
  const api = await waitForApi();
  neutralizeSemanticAndSlices(api);
  const home = resolveCanonicalHomePose(api);

  if (mode === 'living') {
    const speedScale = 0.10;
    const started = performance.now();
    const tick = (now) => {
      const virtualTimeSec = home.timeSec + ((now - started) / 1000) * speedScale;
      api.setReviewPresentation(virtualTimeSec, 1, false);
      api.clearSemanticReviewState?.();
      api.renderReviewFrame();
      requestAnimationFrame(tick);
    };
    publishState(mode, home, speedScale);
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
