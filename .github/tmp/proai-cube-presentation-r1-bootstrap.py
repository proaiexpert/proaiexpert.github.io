from pathlib import Path
import json, shutil

ROOT = Path('.')
SRC = ROOT / 'docs/site-evolution/spline/proai-cube-geometry-r1'
DST = ROOT / 'docs/site-evolution/spline/proai-cube-presentation-motion-r1'

if DST.exists():
    shutil.rmtree(DST)
shutil.copytree(SRC, DST)
shutil.rmtree(DST / 'review', ignore_errors=True)
(DST / 'review').mkdir(parents=True, exist_ok=True)
for name in ['QA.json', 'REPORT.md']:
    p = DST / name
    if p.exists(): p.unlink()

p = DST / 'main.js'
s = p.read_text()

s = s.replace("const captureMode = params.has('capture');\n", "const captureMode = params.has('capture');\nconst qaMode = params.has('qa');\n", 1)
s = s.replace("let choreographyEnabled = !captureMode && !prefersReducedMotion;", "let choreographyEnabled = !captureMode && !qaMode && !prefersReducedMotion;", 1)

marker = "const CHOREOGRAPHY = Object.freeze([...PRIMARY_PHRASE, ...RESOLUTION_PHRASE]);\n"
insert = r'''

const PRESENTATION = Object.freeze({
  rotationRangeDeg: [138, 360],
  durationRangeMs: [5200, 8800],
  settleRangeMs: [1300, 1800],
  inspectionMoves: Object.freeze([
    Object.freeze({ id: 'inspection-156', yawDeg: 156, targetPitchDeg: 6.0, targetRollDeg: -0.8, pitchWaveDeg: 4.8, rollWaveDeg: 0.65, durationMs: 5600, settleMs: 1350, easing: [0.42, 0.0, 0.12, 1.0], sliceTrigger: 0.72 }),
    Object.freeze({ id: 'inspection-minus228', yawDeg: -228, targetPitchDeg: -5.0, targetRollDeg: 0.6, pitchWaveDeg: -5.8, rollWaveDeg: -0.90, durationMs: 6900, settleMs: 1500, easing: [0.40, 0.0, 0.10, 1.0], sliceTrigger: 0.75 }),
    Object.freeze({ id: 'inspection-360', yawDeg: 360, targetPitchDeg: 3.0, targetRollDeg: -0.3, pitchWaveDeg: 6.5, rollWaveDeg: 1.10, durationMs: 8800, settleMs: 1800, easing: [0.38, 0.0, 0.08, 1.0], sliceTrigger: 0.78 }),
    Object.freeze({ id: 'inspection-minus138', yawDeg: -138, targetPitchDeg: 0.0, targetRollDeg: 0.0, pitchWaveDeg: -4.2, rollWaveDeg: 0.70, durationMs: 5200, settleMs: 1300, easing: [0.44, 0.0, 0.14, 1.0], sliceTrigger: 0.70 }),
  ]),
  triggerSliceIndices: Object.freeze([2, 5, 10, 14]),
});
'''
assert marker in s
s = s.replace(marker, marker + insert, 1)

s = s.replace("controls.maxPolarAngle = Math.PI * 0.83;\n", "controls.maxPolarAngle = Math.PI * 0.83;\ncontrols.minAzimuthAngle = -Infinity;\ncontrols.maxAzimuthAngle = Infinity;\n", 1)

state_marker = "let geometryStats = null;\n"
state_insert = r'''let presentationAngles = { yaw: 0, pitch: 0, roll: 0 };
let activePresentationMove = null;
let lastPresentationMove = null;
let presentationMoveSerial = 0;
let presentationCycle = 0;
'''
assert state_marker in s
s = s.replace(state_marker, state_marker + state_insert, 1)

s = s.replace("  geometryConfig: GEOMETRY_R1,\n", "  geometryConfig: GEOMETRY_R1,\n  presentationConfig: PRESENTATION,\n", 1)
s = s.replace("  setReviewPresentation,\n", "  setReviewPresentation,\n  beginReviewPresentationMove,\n  setReviewPresentationMoveProgress,\n  runPresentationMove,\n  getPresentationState,\n", 1)

old = "      if (!autonomyBlocked()) elapsed += delta;"
assert old in s
s = s.replace(old, "      elapsed += delta;", 1)

start = s.index("function driftQuaternion(timeMs) {")
end = s.index("function beginReviewTurn(axis, layer, direction) {")
new_block = r'''function driftQuaternion(timeMs) {
  const drift = MOTION.bodyDrift;
  const yaw = THREE.MathUtils.degToRad(drift.yawDeg) * Math.sin((timeMs / drift.yawPeriodMs) * Math.PI * 2 + 0.35);
  const pitch = THREE.MathUtils.degToRad(drift.pitchDeg) * Math.sin((timeMs / drift.pitchPeriodMs) * Math.PI * 2 + 1.15);
  const roll = THREE.MathUtils.degToRad(drift.rollDeg) * Math.sin((timeMs / drift.rollPeriodMs) * Math.PI * 2 + 2.1);
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, roll, 'XYZ'));
}

function presentationBezierEase(x, easing) {
  const [x1, y1, x2, y2] = easing;
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
  let low = 0;
  let high = 1;
  for (let i = 0; i < 10 && Math.abs(sampleX(t) - x) > 1e-6; i += 1) {
    if (sampleX(t) < x) low = t;
    else high = t;
    t = (low + high) * 0.5;
  }
  return sampleY(t);
}

function presentationBaseQuaternion(angles = presentationAngles) {
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(angles.pitch, angles.yaw, angles.roll, 'YXZ')).normalize();
}

function presentationTargetQuaternion(timeMs) {
  return presentationBaseQuaternion().multiply(driftQuaternion(timeMs)).normalize();
}

function getPresentationState() {
  return {
    anglesDeg: {
      yaw: THREE.MathUtils.radToDeg(presentationAngles.yaw),
      pitch: THREE.MathUtils.radToDeg(presentationAngles.pitch),
      roll: THREE.MathUtils.radToDeg(presentationAngles.roll),
    },
    cycle: presentationCycle,
    activeMove: activePresentationMove ? {
      id: activePresentationMove.definition.id,
      serial: activePresentationMove.serial,
      linear: activePresentationMove.linear,
      eased: activePresentationMove.eased,
      yawDeltaDeg: activePresentationMove.definition.yawDeg,
      durationMs: activePresentationMove.definition.durationMs,
    } : null,
    lastMove: lastPresentationMove,
  };
}

function resolvePresentationDefinition(input) {
  if (typeof input === 'string') {
    const found = PRESENTATION.inspectionMoves.find((move) => move.id === input);
    if (!found) throw new Error(`Unknown presentation move ${input}`);
    return found;
  }
  if (!input || typeof input !== 'object') throw new Error('Presentation move definition required');
  return {
    id: input.id || `custom-${presentationMoveSerial + 1}`,
    yawDeg: Number(input.yawDeg || 0),
    targetPitchDeg: Number(input.targetPitchDeg || 0),
    targetRollDeg: Number(input.targetRollDeg || 0),
    pitchWaveDeg: Number(input.pitchWaveDeg || 0),
    rollWaveDeg: Number(input.rollWaveDeg || 0),
    durationMs: Number(input.durationMs || 6200),
    settleMs: Number(input.settleMs || 1400),
    easing: Array.isArray(input.easing) ? input.easing : [0.42, 0, 0.12, 1],
    sliceTrigger: Number.isFinite(input.sliceTrigger) ? input.sliceTrigger : 0.74,
  };
}

function beginPresentationMove(input) {
  if (activePresentationMove) throw new Error('A whole-cube presentation move is already active');
  const definition = resolvePresentationDefinition(input);
  const startAngles = { ...presentationAngles };
  const targetAngles = {
    yaw: startAngles.yaw + THREE.MathUtils.degToRad(definition.yawDeg),
    pitch: THREE.MathUtils.degToRad(definition.targetPitchDeg),
    roll: THREE.MathUtils.degToRad(definition.targetRollDeg),
  };
  activePresentationMove = {
    serial: ++presentationMoveSerial,
    definition,
    startAngles,
    targetAngles,
    linear: 0,
    eased: 0,
  };
  return activePresentationMove;
}

function setPresentationMoveProgress(linear, { finalize = false } = {}) {
  if (!activePresentationMove) throw new Error('No active whole-cube presentation move');
  const progress = THREE.MathUtils.clamp(linear, 0, 1);
  const move = activePresentationMove;
  const eased = presentationBezierEase(progress, move.definition.easing);
  const wave = Math.sin(Math.PI * eased);
  move.linear = progress;
  move.eased = eased;
  presentationAngles.yaw = THREE.MathUtils.lerp(move.startAngles.yaw, move.targetAngles.yaw, eased);
  presentationAngles.pitch = THREE.MathUtils.lerp(move.startAngles.pitch, move.targetAngles.pitch, eased)
    + THREE.MathUtils.degToRad(move.definition.pitchWaveDeg) * wave;
  presentationAngles.roll = THREE.MathUtils.lerp(move.startAngles.roll, move.targetAngles.roll, eased)
    + THREE.MathUtils.degToRad(move.definition.rollWaveDeg) * wave;
  if (finalize || progress >= 1) return finalizePresentationMove();
  return getPresentationState().activeMove;
}

function finalizePresentationMove() {
  if (!activePresentationMove) throw new Error('No active whole-cube presentation move to finalize');
  const move = activePresentationMove;
  presentationAngles = { ...move.targetAngles };
  lastPresentationMove = {
    serial: move.serial,
    id: move.definition.id,
    yawDeltaDeg: move.definition.yawDeg,
    durationMs: move.definition.durationMs,
    settleMs: move.definition.settleMs,
    easing: [...move.definition.easing],
    endpointLinear: 1,
    finalAnglesDeg: {
      yaw: THREE.MathUtils.radToDeg(presentationAngles.yaw),
      pitch: THREE.MathUtils.radToDeg(presentationAngles.pitch),
      roll: THREE.MathUtils.radToDeg(presentationAngles.roll),
    },
  };
  activePresentationMove = null;
  return lastPresentationMove;
}

function updatePresentationPose(now) {
  if (!api.ready || captureMode) return;
  if (interactionActive || now < manualResumeAt) return;
  const target = presentationTargetQuaternion(now);
  if (presentationResumeStart > 0 && now < presentationResumeStart + MOTION.manualResumeBlendMs) {
    const progress = smoothstep((now - presentationResumeStart) / MOTION.manualResumeBlendMs);
    presentationRig.quaternion.slerpQuaternions(presentationResumeFrom, target, progress).normalize();
  } else {
    presentationRig.quaternion.copy(target);
    if (presentationResumeStart > 0) presentationResumeStart = 0;
  }
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

async function animatePresentationMove(input, concurrentSlice = null) {
  const move = beginPresentationMove(input);
  let elapsed = 0;
  let previous = performance.now();
  let slicePromise = null;
  await new Promise((resolve) => {
    function tick(now) {
      const delta = Math.max(0, now - previous);
      previous = now;
      const blocked = autonomyBlocked();
      if (!blocked) elapsed += delta;
      const linear = THREE.MathUtils.clamp(elapsed / Math.max(1, move.definition.durationMs), 0, 1);
      if (!blocked) setPresentationMoveProgress(linear);
      if (!slicePromise && concurrentSlice && !blocked && linear >= move.definition.sliceTrigger && !motionBusy && motionState === 'rest') {
        slicePromise = turnSlice({ ...concurrentSlice, ignoreInteraction: true });
      }
      if (linear >= 1) {
        if (activePresentationMove) setPresentationMoveProgress(1, { finalize: true });
        resolve();
        return;
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
  if (slicePromise) await slicePromise;
  while (motionBusy || activeTurn) await sleep(16);
  return lastPresentationMove;
}

async function runPresentationMove(input = 'inspection-156', concurrentSlice = null) {
  if (!api.ready || activePresentationMove) return false;
  if (autonomyBlocked()) return false;
  return animatePresentationMove(input, concurrentSlice);
}

async function autonomousLoop() {
  if (choreographyRunning) return;
  choreographyRunning = true;
  await sleepAutonomous(1550);
  while (choreographyEnabled) {
    for (let index = 0; index < CHOREOGRAPHY.length; index += 1) {
      if (!choreographyEnabled) break;
      while ((autonomyBlocked() || motionBusy || activeTurn) && choreographyEnabled) await sleep(48);
      if (!choreographyEnabled) break;
      const move = CHOREOGRAPHY[index];
      const presentationSlot = PRESENTATION.triggerSliceIndices.indexOf(index);
      if (presentationSlot >= 0) {
        const inspection = PRESENTATION.inspectionMoves[presentationSlot];
        await animatePresentationMove(inspection, move);
        await sleepAutonomous(inspection.settleMs);
        await sleepAutonomous(move.holdMs);
      } else {
        await turnSlice({ ...move, ignoreInteraction: true });
        await sleepAutonomous(move.holdMs);
      }
    }
    presentationCycle += 1;
  }
  choreographyRunning = false;
}

function getInteractionState() {
  const now = performance.now();
  return {
    interactionActive,
    autonomyBlocked: autonomyBlocked(),
    resumeDelayRemainingMs: Number.isFinite(manualResumeAt) ? Math.max(0, manualResumeAt - now) : null,
    presentationResumeActive: presentationResumeStart > 0 && now < presentationResumeStart + MOTION.manualResumeBlendMs,
    cameraPosition: camera.position.toArray(),
    presentationQuaternion: presentationRig.quaternion.toArray(),
    activeSlice: activeTurn ? { axis: activeTurn.axis, layer: activeTurn.layer, direction: activeTurn.direction, linear: activeTurn.linear } : null,
    presentation: getPresentationState(),
  };
}

controls.addEventListener('start', () => {
  interactionActive = true;
  frozenPresentationQuaternion.copy(presentationRig.quaternion);
  presentationResumeFrom.copy(presentationRig.quaternion);
  manualResumeAt = Infinity;
  presentationResumeStart = 0;
});

controls.addEventListener('end', () => {
  interactionActive = false;
  const now = performance.now();
  manualResumeAt = now + MOTION.manualResumeDelayMs;
  presentationResumeStart = manualResumeAt;
  presentationResumeFrom.copy(presentationRig.quaternion);
});

'''
s = s[:start] + new_block + s[end:]

review_start = s.index("function setReviewPresentation(timeSec = 0, resumeProgress = 1) {")
review_end = s.index("function renderReviewFrame() {")
review_block = r'''function setReviewPresentation(timeSec = 0, resumeProgress = 1) {
  if (!captureMode || !api.ready) return false;
  const target = presentationTargetQuaternion(Math.max(0, timeSec) * 1000);
  if (resumeProgress < 1) {
    const progress = smoothstep(resumeProgress);
    presentationRig.quaternion.slerpQuaternions(frozenPresentationQuaternion, target, progress).normalize();
  } else {
    presentationRig.quaternion.copy(target);
  }
  renderReviewFrame();
  return presentationRig.quaternion.toArray();
}

function beginReviewPresentationMove(input = 'inspection-360') {
  if (!captureMode || !api.ready || activePresentationMove) return false;
  const move = beginPresentationMove(input);
  return { id: move.definition.id, yawDeg: move.definition.yawDeg, durationMs: move.definition.durationMs };
}

function setReviewPresentationMoveProgress(linear, timeSec = 0) {
  if (!captureMode || !activePresentationMove) return false;
  const progress = THREE.MathUtils.clamp(linear, 0, 1);
  const result = setPresentationMoveProgress(progress, { finalize: progress >= 1 });
  presentationRig.quaternion.copy(presentationTargetQuaternion(Math.max(0, timeSec) * 1000));
  renderReviewFrame();
  return result;
}

'''
s = s[:review_start] + review_block + s[review_end:]

s = s.replace("  updatePresentationDrift(now);", "  updatePresentationPose(now);", 1)
s = s.replace("status.textContent = 'Three.js GLB loaded. Motion R1 frozen. Geometry R1 precision mesh ready.';", "status.textContent = 'Three.js GLB loaded. Geometry R1 frozen. Presentation Motion R1.1 ready.';", 1)

p.write_text(s)

pkg = DST / 'package.json'
data = json.loads(pkg.read_text())
data['name'] = 'proai-cube-presentation-motion-r1'
pkg.write_text(json.dumps(data, indent=2) + '\n')

idx = DST / 'index.html'
text = idx.read_text()
text = text.replace('ProAI Cube — Geometry R1', 'ProAI Cube — Presentation Motion R1.1')
text = text.replace('Geometry R1', 'Presentation Motion R1.1')
idx.write_text(text)

print('Presentation Motion R1.1 prototype materialized')
