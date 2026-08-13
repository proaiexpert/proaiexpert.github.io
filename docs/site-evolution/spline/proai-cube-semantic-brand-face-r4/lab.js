const params = new URLSearchParams(location.search);
const isCapture = params.has('capture');
const view = params.get('view');

if (isCapture) document.querySelector('.review-controls')?.remove();

async function waitForApi() {
  for (let i = 0; i < 1200; i += 1) {
    if (window.__PROAI_CUBE_R1_2?.ready === true) return window.__PROAI_CUBE_R1_2;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error('R4 review API did not become ready');
}

function chooseReviewPoses(api) {
  const poses = [];
  for (let t = 0; t <= 18; t += 0.20) {
    const pose = api.getSemanticPoseAt(t);
    if (pose) poses.push(pose);
  }
  poses.sort((a, b) => b.dot - a.dot);
  const front = poses[0];
  const candidates = poses.filter((pose) => pose.face === front.face && pose.dot > 0.72 && pose.dot < 0.91);
  const threeQuarter = [...(candidates.length ? candidates : poses)]
    .sort((a, b) => Math.abs(a.dot - 0.82) - Math.abs(b.dot - 0.82))[0];
  return { front, threeQuarter };
}

function showStaticSemantic(api, pose) {
  api.setReviewPresentation(pose.timeSec, 1, false);
  api.setSemanticReviewState({ face: pose.face, surface: 0.86, formation: 1, luminance: 0.74, sweep: 0.52, exit: 0 }, false);
  api.renderReviewFrame();
}

async function run() {
  const api = await waitForApi();

  if (isCapture && view) {
    const poses = chooseReviewPoses(api);
    showStaticSemantic(api, view === 'front' ? poses.front : poses.threeQuarter);
    return;
  }

  document.getElementById('replay-brand')?.addEventListener('click', () => {
    api.replaySemanticBrandMoment();
  });

  window.__PROAI_R4_REVIEW__ = Object.freeze({
    replay: () => api.replaySemanticBrandMoment(),
    diagnostics: () => api.getSemanticDiagnostics(),
  });
}

void run();
