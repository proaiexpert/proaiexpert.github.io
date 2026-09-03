const params = new URLSearchParams(location.search);
const requested = (params.get('concept') || 'A').toUpperCase();
const concept = ['A', 'B', 'C'].includes(requested) ? requested : 'A';
const isCapture = params.has('capture');
const view = params.get('view');
const demo = params.has('demo');

if (isCapture) {
  document.querySelector('.review-nav')?.remove();
  document.getElementById('runtime-status')?.remove();
}

for (const button of document.querySelectorAll('[data-concept]')) {
  const value = button.dataset.concept;
  button.setAttribute('aria-current', value === concept ? 'true' : 'false');
  button.addEventListener('click', () => {
    const next = new URL(location.href);
    next.search = '';
    next.searchParams.set('concept', value);
    location.href = next.toString();
  });
}

function smoother(value) {
  const x = Math.max(0, Math.min(1, value));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

async function waitForApi() {
  for (let i = 0; i < 1200; i += 1) {
    if (window.__PROAI_CUBE_R1_2?.ready === true) return window.__PROAI_CUBE_R1_2;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error('R3 review API did not become ready');
}

function chooseReviewPoses(api) {
  const poses = [];
  for (let t = 0; t <= 68; t += 0.35) {
    const pose = api.getSemanticPoseAt(t);
    if (pose) poses.push(pose);
  }
  poses.sort((a, b) => b.dot - a.dot);
  const front = poses[0];
  const candidates = poses.filter((pose) => pose.face === front.face && pose.dot > 0.68 && pose.dot < 0.94);
  const threeQuarter = [...(candidates.length ? candidates : poses)].sort((a, b) => Math.abs(a.dot - 0.82) - Math.abs(b.dot - 0.82))[0];
  return { front, threeQuarter };
}

function setFullSemantic(api, pose) {
  api.setReviewPresentation(pose.timeSec, 1, false);
  api.setSemanticReviewState({ face: pose.face, surface: 1, formation: 1, luminance: 0.82, sweep: 0.54, exit: 0 }, false);
  api.renderReviewFrame();
}

async function runReviewMode() {
  if (!isCapture || (!view && !demo)) return;
  const api = await waitForApi();
  const poses = chooseReviewPoses(api);

  if (view) {
    const pose = view === 'front' ? poses.front : poses.threeQuarter;
    setFullSemantic(api, pose);
    return;
  }

  const pose = poses.front;
  const duration = 3500;
  const cycle = 4100;
  let cycleStart = performance.now();

  function frame(now) {
    let elapsed = now - cycleStart;
    if (elapsed >= cycle) {
      cycleStart = now;
      elapsed = 0;
      api.clearSemanticReviewState();
    }
    const t = elapsed / 1000;
    let surface = 0;
    let formation = 0;
    let luminance = 0;
    let exit = 0;
    let sweep = -0.18;

    if (t >= 0.42 && t < 1.28) surface = smoother((t - 0.42) / 0.86);
    else if (t >= 1.28 && t < 2.86) surface = 1;
    else if (t >= 2.86 && t < 3.48) surface = 1 - smoother((t - 2.86) / 0.62);

    if (t >= 0.56 && t < 1.30) formation = smoother((t - 0.56) / 0.74);
    else if (t >= 1.30 && t < 2.72) formation = 1;
    else if (t >= 2.72 && t < 3.28) formation = 1 - smoother((t - 2.72) / 0.56);

    if (t >= 0.68 && t < 1.36) luminance = smoother((t - 0.68) / 0.68) * 0.82;
    else if (t >= 1.36 && t < 2.70) luminance = 0.82;
    else if (t >= 2.70 && t < 3.24) luminance = (1 - smoother((t - 2.70) / 0.54)) * 0.82;

    if (t >= 2.72) exit = smoother((t - 2.72) / 0.58);
    if (t >= 0.80) sweep = Math.min(1.12, -0.12 + (t - 0.80) * 0.66);

    api.setReviewPresentation(pose.timeSec, 1, false);
    api.setSemanticReviewState({ face: pose.face, surface, formation, luminance, sweep, exit }, false);
    api.renderReviewFrame();
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

void runReviewMode();
