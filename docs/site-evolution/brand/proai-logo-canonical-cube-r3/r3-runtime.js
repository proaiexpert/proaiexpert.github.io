import './assets/index-vldOIrE-.js';

const SOURCE = Object.freeze({
  branch: 'agent/proai-cube-semantic-brand-face-r4',
  sha: '0c9cafc0d7a29879a257f11cd26a0db77bb187e6',
  glbBlob: '7992019d85304c16244d0ca55a8cf15c13c26190',
  compiledRuntimeBlob: '614b2ad663b6a50fb8df6dd15e3ead6b4bb69750',
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

function selectCanonicalHomePose(api) {
  const poses = [];
  for (let t = 0; t <= 18; t += 0.2) {
    const pose = api.getSemanticPoseAt(Number(t.toFixed(1)));
    if (pose) poses.push(pose);
  }
  if (!poses.length) throw new Error('Canonical pose sampler returned no poses');
  const front = [...poses].sort((a, b) => b.dot - a.dot)[0];
  const sameFace = poses.filter((pose) => pose.face === front.face && pose.dot >= 0.70 && pose.dot <= 0.90);
  const broadPool = poses.filter((pose) => pose.dot >= 0.70 && pose.dot <= 0.90);
  const pool = sameFace.length ? sameFace : (broadPool.length ? broadPool : poses);
  const home = pool.reduce((best, pose) => Math.abs(pose.dot - 0.82) < Math.abs(best.dot - 0.82) ? pose : best, pool[0]);
  return { home, front };
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
  const { home } = selectCanonicalHomePose(api);

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
