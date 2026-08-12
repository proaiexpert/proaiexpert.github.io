from pathlib import Path
import shutil

ROOT = Path('.').resolve()
src = ROOT / 'docs/site-evolution/spline/proai-cube-geometry-r1'
dst = ROOT / 'docs/site-evolution/spline/proai-cube-presentation-motion-r1'
if dst.exists():
    shutil.rmtree(dst)
shutil.copytree(src, dst, ignore=shutil.ignore_patterns('review', 'QA.json', 'REPORT.md', 'node_modules', 'dist', 'package-lock.json'))
(dst / 'review').mkdir(parents=True, exist_ok=True)

main_path = dst / 'main.js'
text = main_path.read_text()

def rep(old, new):
    global text
    if old not in text:
        raise RuntimeError('patch anchor not found: ' + old[:120])
    text = text.replace(old, new, 1)

motion_anchor = """const PRIMARY_PHRASE = Object.freeze(["""
presentation_cfg = """const PRESENTATION_R1_1 = Object.freeze({
  inspectionDurationRangeMs: [6400, 8800],
  autonomousYawRangeDeg: [150, 360],
  fullTurnDeg: 360,
  easingProfiles: Object.freeze([
    [0.42, 0.0, 0.12, 1.0],
    [0.38, 0.0, 0.10, 1.0],
    [0.46, 0.0, 0.14, 1.0],
  ]),
  moves: Object.freeze([
    Object.freeze({ yawDeg: 150, pitchAmpDeg: 6.2, rollAmpDeg: -1.05, durationMs: 6400, holdMs: 1450, easing: [0.42, 0.0, 0.12, 1.0] }),
    Object.freeze({ yawDeg: -225, pitchAmpDeg: -7.6, rollAmpDeg: 1.45, durationMs: 7600, holdMs: 1720, easing: [0.38, 0.0, 0.10, 1.0] }),
    Object.freeze({ yawDeg: 360, pitchAmpDeg: 7.5, rollAmpDeg: -1.35, durationMs: 8800, holdMs: 2180, easing: [0.46, 0.0, 0.14, 1.0], rare: true }),
    Object.freeze({ yawDeg: 175, pitchAmpDeg: -5.8, rollAmpDeg: 0.95, durationMs: 6900, holdMs: 1580, easing: [0.40, 0.0, 0.11, 1.0] }),
  ]),
  overlapStartProgress: 0.72,
});

const PRIMARY_PHRASE = Object.freeze(["""
rep(motion_anchor, presentation_cfg)

var_anchor = """let geometryStats = null;\n\nconst api = {"""
var_new = """let geometryStats = null;
let presentationBaseQuaternion = new THREE.Quaternion();
let activeInspection = null;
let inspectionSerial = 0;
let presentationLastNow = 0;
let reviewInspection = null;

const api = {"""
rep(var_anchor, var_new)

api_anchor = """  geometryConfig: GEOMETRY_R1,\n  geometry: null,"""
api_new = """  geometryConfig: GEOMETRY_R1,
  presentationConfig: PRESENTATION_R1_1,
  geometry: null,"""
rep(api_anchor, api_new)

api_methods_anchor = """  beginReviewTurn,\n  setReviewTurnProgress,\n  setReviewPresentation,\n  renderReviewFrame,"""
api_methods_new = """  beginReviewTurn,
  setReviewTurnProgress,
  beginReviewInspection,
  setReviewInspectionProgress,
  setReviewPresentation,
  renderReviewFrame,"""
rep(api_methods_anchor, api_methods_new)

old_anim = """      if (!autonomyBlocked()) elapsed += delta;\n      const linear = THREE.MathUtils.clamp(elapsed / Math.max(1, durationMs), 0, 1);"""
new_anim = """      elapsed += delta;
      const linear = THREE.MathUtils.clamp(elapsed / Math.max(1, durationMs), 0, 1);"""
rep(old_anim, new_anim)

start = text.index('function driftQuaternion(timeMs) {')
end = text.index('function getInteractionState() {')
new_section = r'''function driftQuaternion(timeMs) {
  const drift = MOTION.bodyDrift;
  const yaw = THREE.MathUtils.degToRad(drift.yawDeg) * Math.sin((timeMs / drift.yawPeriodMs) * Math.PI * 2 + 0.35);
  const pitch = THREE.MathUtils.degToRad(drift.pitchDeg) * Math.sin((timeMs / drift.pitchPeriodMs) * Math.PI * 2 + 1.15);
  const roll = THREE.MathUtils.degToRad(drift.rollDeg) * Math.sin((timeMs / drift.rollPeriodMs) * Math.PI * 2 + 2.1);
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, roll, 'XYZ'));
}

function presentationBezierEase(x, curve) {
  const [x1, y1, x2, y2] = curve;
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t) => ((ay * t + by) * t + cy) * t;
  const sampleDX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  let t = THREE.MathUtils.clamp(x, 0, 1);
  for (let i = 0; i < 7; i += 1) {
    const error = sampleX(t) - x;
    const slope = sampleDX(t);
    if (Math.abs(error) < 1e-7 || Math.abs(slope) < 1e-7) break;
    t = THREE.MathUtils.clamp(t - error / slope, 0, 1);
  }
  return sampleY(t);
}

function inspectionDeltaQuaternion(move, eased) {
  const yaw = THREE.MathUtils.degToRad(move.yawDeg) * eased;
  const arc = Math.sin(Math.PI * eased);
  const pitch = THREE.MathUtils.degToRad(move.pitchAmpDeg) * arc;
  const roll = THREE.MathUtils.degToRad(move.rollAmpDeg) * arc;
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, roll, 'YXZ')).normalize();
}

function inspectionFinalYawQuaternion(move) {
  return new THREE.Quaternion().setFromAxisAngle(AXIS_VECTOR.Y, THREE.MathUtils.degToRad(move.yawDeg)).normalize();
}

function currentPresentationTarget(now) {
  const target = presentationBaseQuaternion.clone();
  if (activeInspection) target.multiply(inspectionDeltaQuaternion(activeInspection.move, activeInspection.eased));
  target.multiply(driftQuaternion(now));
  return target.normalize();
}

function beginInspection(move) {
  if (activeInspection) return false;
  activeInspection = { serial: ++inspectionSerial, move, elapsedMs: 0, eased: 0, linear: 0, lastNow: performance.now(), resolve: null };
  return activeInspection;
}

function finalizeInspection() {
  if (!activeInspection) return false;
  const finished = activeInspection;
  presentationBaseQuaternion.multiply(inspectionFinalYawQuaternion(finished.move)).normalize();
  activeInspection = null;
  if (finished.resolve) finished.resolve({ serial: finished.serial, yawDeg: finished.move.yawDeg, durationMs: finished.move.durationMs });
  return true;
}

function updatePresentationMotion(now) {
  if (!api.ready || captureMode) return;
  if (!presentationLastNow) presentationLastNow = now;
  const delta = Math.max(0, now - presentationLastNow);
  presentationLastNow = now;
  const blocked = autonomyBlocked();
  if (activeInspection) {
    activeInspection.lastNow = now;
    if (!blocked) {
      activeInspection.elapsedMs += delta;
      activeInspection.linear = THREE.MathUtils.clamp(activeInspection.elapsedMs / activeInspection.move.durationMs, 0, 1);
      activeInspection.eased = presentationBezierEase(activeInspection.linear, activeInspection.move.easing);
      if (activeInspection.linear >= 1) finalizeInspection();
    }
  }
  if (blocked) return;
  const target = currentPresentationTarget(now);
  if (presentationResumeStart > 0 && now < presentationResumeStart + MOTION.manualResumeBlendMs) {
    const progress = smoothstep((now - presentationResumeStart) / MOTION.manualResumeBlendMs);
    presentationRig.quaternion.slerpQuaternions(presentationResumeFrom, target, progress).normalize();
  } else {
    presentationRig.quaternion.copy(target);
    if (presentationResumeStart > 0) presentationResumeStart = 0;
  }
}

function animateInspection(move) {
  return new Promise((resolve) => {
    const state = beginInspection(move);
    if (!state) { resolve(false); return; }
    state.resolve = resolve;
  });
}

async function sleepAutonomous(durationMs) {
  let elapsed = 0;
  let previous = performance.now();
  while (elapsed < durationMs && choreographyEnabled) {
    await sleep(32);
    const now = performance.now();
    const delta = now - previous;
    previous = now;
    if (!autonomyBlocked()) elapsed += delta;
  }
}

async function runAutonomousSlice(move) {
  while (autonomyBlocked() && choreographyEnabled) await sleep(48);
  if (!choreographyEnabled) return false;
  const result = await turnSlice({ ...move, ignoreInteraction: false });
  if (!result) return false;
  await sleepAutonomous(move.holdMs);
  return result;
}

async function runAutonomousInspection(move, overlapSlice = null) {
  while (autonomyBlocked() && choreographyEnabled) await sleep(48);
  if (!choreographyEnabled) return false;
  const inspectionPromise = animateInspection(move);
  if (overlapSlice) {
    await sleepAutonomous(move.durationMs * PRESENTATION_R1_1.overlapStartProgress);
    while (autonomyBlocked() && choreographyEnabled) await sleep(48);
    if (choreographyEnabled) {
      await turnSlice({ ...overlapSlice, ignoreInteraction: false });
      await sleepAutonomous(overlapSlice.holdMs);
    }
  }
  await inspectionPromise;
  await sleepAutonomous(move.holdMs);
  return true;
}

async function autonomousLoop() {
  if (choreographyRunning) return;
  choreographyRunning = true;
  await sleepAutonomous(1550);
  while (choreographyEnabled) {
    let i = 0;
    await runAutonomousSlice(CHOREOGRAPHY[i++]);
    await runAutonomousSlice(CHOREOGRAPHY[i++]);
    await runAutonomousInspection(PRESENTATION_R1_1.moves[0], CHOREOGRAPHY[i++]);
    await runAutonomousSlice(CHOREOGRAPHY[i++]);
    await runAutonomousSlice(CHOREOGRAPHY[i++]);
    await runAutonomousInspection(PRESENTATION_R1_1.moves[1]);
    await runAutonomousSlice(CHOREOGRAPHY[i++]);
    await runAutonomousSlice(CHOREOGRAPHY[i++]);
    await runAutonomousSlice(CHOREOGRAPHY[i++]);
    await runAutonomousInspection(PRESENTATION_R1_1.moves[2], CHOREOGRAPHY[i++]);
    while (i < CHOREOGRAPHY.length && choreographyEnabled) await runAutonomousSlice(CHOREOGRAPHY[i++]);
    if (choreographyEnabled) await runAutonomousInspection(PRESENTATION_R1_1.moves[3]);
  }
  choreographyRunning = false;
}

'''
text = text[:start] + new_section + text[end:]

old_state = """    presentationQuaternion: presentationRig.quaternion.toArray(),\n  };"""
new_state = """    presentationQuaternion: presentationRig.quaternion.toArray(),
    activeInspection: activeInspection ? { serial: activeInspection.serial, yawDeg: activeInspection.move.yawDeg, linear: activeInspection.linear, eased: activeInspection.eased } : null,
  };"""
rep(old_state, new_state)

review_start = text.index('function beginReviewTurn(axis, layer, direction) {')
review_end = text.index('function renderReviewFrame() {')
review_section = r'''function beginReviewTurn(axis, layer, direction) {
  if (!captureMode || !api.ready || motionBusy || activeTurn) return false;
  motionBusy = true;
  const turn = beginTurn(axis, layer, direction);
  return { axis: turn.axis, layer: turn.layer, direction: turn.direction };
}

function setReviewTurnProgress(linear) {
  if (!captureMode || !activeTurn) return false;
  const progress = THREE.MathUtils.clamp(linear, 0, 1);
  const result = setActiveTurnProgress(progress, { finalize: progress >= 1 });
  if (progress >= 1) motionBusy = false;
  renderReviewFrame();
  return result;
}

function beginReviewInspection(index = 0) {
  if (!captureMode || !api.ready || reviewInspection) return false;
  const move = PRESENTATION_R1_1.moves[index];
  if (!move) return false;
  reviewInspection = { index, move, baseQuaternion: presentationBaseQuaternion.clone() };
  return { index, ...move };
}

function setReviewInspectionProgress(linear, timeSec = 0) {
  if (!captureMode || !reviewInspection) return false;
  const progress = THREE.MathUtils.clamp(linear, 0, 1);
  const eased = presentationBezierEase(progress, reviewInspection.move.easing);
  const target = reviewInspection.baseQuaternion.clone().multiply(inspectionDeltaQuaternion(reviewInspection.move, eased)).multiply(driftQuaternion(Math.max(0, timeSec) * 1000)).normalize();
  presentationRig.quaternion.copy(target);
  const result = { index: reviewInspection.index, progress, eased, yawTravelDeg: reviewInspection.move.yawDeg * eased, pitchAmpDeg: reviewInspection.move.pitchAmpDeg, rollAmpDeg: reviewInspection.move.rollAmpDeg };
  if (progress >= 1) {
    presentationBaseQuaternion.copy(reviewInspection.baseQuaternion).multiply(inspectionFinalYawQuaternion(reviewInspection.move)).normalize();
    reviewInspection = null;
  }
  renderReviewFrame();
  return result;
}

function setReviewPresentation(timeSec = 0, resumeProgress = 1) {
  if (!captureMode || !api.ready) return false;
  const target = presentationBaseQuaternion.clone().multiply(driftQuaternion(Math.max(0, timeSec) * 1000)).normalize();
  if (resumeProgress < 1) {
    const progress = smoothstep(resumeProgress);
    presentationRig.quaternion.slerpQuaternions(frozenPresentationQuaternion, target, progress).normalize();
  } else {
    presentationRig.quaternion.copy(target);
  }
  renderReviewFrame();
  return presentationRig.quaternion.toArray();
}

'''
text = text[:review_start] + review_section + text[review_end:]

old_diag = """    motionConfig: MOTION,\n    activeTurn:"""
new_diag = """    motionConfig: MOTION,
    presentationConfig: PRESENTATION_R1_1,
    presentation: {
      baseQuaternion: presentationBaseQuaternion.toArray(),
      activeInspection: activeInspection ? { serial: activeInspection.serial, yawDeg: activeInspection.move.yawDeg, durationMs: activeInspection.move.durationMs, linear: activeInspection.linear, eased: activeInspection.eased } : null,
    },
    activeTurn:"""
rep(old_diag, new_diag)
rep('  updatePresentationDrift(now);', '  updatePresentationMotion(now);')
controls_anchor = """controls.maxPolarAngle = Math.PI * 0.83;"""
controls_new = """controls.maxPolarAngle = Math.PI * 0.83;
controls.minAzimuthAngle = -Infinity;
controls.maxAzimuthAngle = Infinity;"""
rep(controls_anchor, controls_new)
rep("status.textContent = 'Three.js GLB loaded. Motion R1 frozen. Geometry R1 precision mesh ready.';", "status.textContent = 'Three.js GLB loaded. Geometry R1 frozen. Presentation Motion R1.1 ready.';")
main_path.write_text(text)
print('Presentation Motion R1.1 main.js materialized:', main_path)
