from pathlib import Path
import hashlib
import json
import sys

root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.')
path = root / 'assets/js/proai-hero-cube-r1/source-materials-r1.js'
proof_dir = root / 'spatial-motion-proof'
source = path.read_text()


def region(text, start_marker, end_marker):
    start = text.index(start_marker)
    end = text.index(end_marker, start)
    return text[start:end]


protected_specs = {
    'slice_config': ('const SLICE_R1_2 = Object.freeze({', 'const PRIMARY_PHRASE = Object.freeze(['),
    'slice_mechanics': ('function selectLayer(axis, layer) {', 'function presentationAutonomyBlocked() {'),
    'slice_scheduler': ('function seededUnit() {', 'function getInteractionState() {'),
}
before = {
    name: hashlib.sha256(region(source, *markers).encode()).hexdigest()
    for name, markers in protected_specs.items()
}


def replace_once(old, new, label):
    global source
    count = source.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected one match, got {count}')
    source = source.replace(old, new, 1)


replace_once(
    "  sliceResumeStaggerMs: 280,\n});",
    """  sliceResumeStaggerMs: 280,
  bodyDrift: Object.freeze({
    yawDeg: 3.8,
    pitchDeg: 2.15,
    rollDeg: 0.65,
    yawPeriodMs: 12800,
    pitchPeriodMs: 15200,
    rollPeriodMs: 10600,
  }),
});""",
    'add R1.1 micro drift',
)

r11 = """
const PRESENTATION_R1_1 = Object.freeze({
  inspectionDurationRangeMs: [6400, 8800],
  autonomousYawRangeDeg: [150, 360],
  fullTurnDeg: 360,
  initialDelayMs: 1550,
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
"""
marker = '\nconst SLICE_R1_2 = Object.freeze({'
if source.count(marker) != 1:
    raise SystemExit('R1.1 insertion marker mismatch')
source = source.replace(marker, r11 + marker, 1)

old_vars = """let presentationSimTimeMs = 0;
let presentationYawRad = 0;
let presentationSignedYawDeg = 0;
let presentationCumulativeYawDeg = 0;
let presentationYawVelocityDegPerSec = 0;
let presentationLastNow = 0;
let presentationFrameDeltaRad = 0;
let lastPresentationQuaternion = new THREE.Quaternion();"""
new_vars = """let presentationBaseQuaternion = new THREE.Quaternion();
let activeInspection = null;
let inspectionSerial = 0;
let presentationMoveIndex = 0;
let presentationCompletedMoves = 0;
let presentationSchedulerEnabled = !captureMode && !prefersReducedMotion;
let presentationSchedulerRunning = false;
let presentationDriftTimeMs = 0;
let presentationLastNow = 0;
let presentationFrameDeltaRad = 0;
let lastPresentationQuaternion = new THREE.Quaternion();"""
replace_once(old_vars, new_vars, 'replace continuous yaw state')

count = source.count('presentationConfig: PRESENTATION_R1_2,')
if count != 2:
    raise SystemExit(f'presentationConfig occurrences expected 2, got {count}')
source = source.replace('presentationConfig: PRESENTATION_R1_2,', 'presentationConfig: PRESENTATION_R1_1,')

old_api = """  stopChoreography() { sliceSchedulerEnabled = false; },
  stopSliceScheduler() { sliceSchedulerEnabled = false; },
  startChoreography() {
    if (!prefersReducedMotion) {
      sliceSchedulerEnabled = true;
      void sliceSchedulerLoop();
    }
  },"""
new_api = """  stopChoreography() {
    sliceSchedulerEnabled = false;
    presentationSchedulerEnabled = false;
  },
  stopSliceScheduler() { sliceSchedulerEnabled = false; },
  stopPresentationScheduler() { presentationSchedulerEnabled = false; },
  startChoreography() {
    if (!prefersReducedMotion) {
      sliceSchedulerEnabled = true;
      presentationSchedulerEnabled = true;
      void sliceSchedulerLoop();
      void presentationSchedulerLoop();
    }
  },"""
replace_once(old_api, new_api, 'separate presentation and slice engines')

start = source.index('function presentationVelocityAt(timeMs) {')
end = source.index('function seededUnit() {', start)
presentation_block = r"""function driftQuaternion(timeMs) {
  const drift = MOTION.bodyDrift;
  const yaw = THREE.MathUtils.degToRad(drift.yawDeg) * Math.sin((timeMs / drift.yawPeriodMs) * Math.PI * 2 + 0.35);
  const pitch = THREE.MathUtils.degToRad(drift.pitchDeg) * Math.sin((timeMs / drift.pitchPeriodMs) * Math.PI * 2 + 1.15);
  const roll = THREE.MathUtils.degToRad(drift.rollDeg) * Math.sin((timeMs / drift.rollPeriodMs) * Math.PI * 2 + 2.1);
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, roll, 'XYZ')).normalize();
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

function presentationEulerDegrees(quaternion) {
  const euler = new THREE.Euler().setFromQuaternion(quaternion, 'YXZ');
  return {
    pitchDeg: THREE.MathUtils.radToDeg(euler.x),
    yawDeg: THREE.MathUtils.radToDeg(euler.y),
    rollDeg: THREE.MathUtils.radToDeg(euler.z),
  };
}

function currentPresentationTarget(driftTimeMs = presentationDriftTimeMs) {
  const target = presentationBaseQuaternion.clone();
  if (activeInspection) target.multiply(inspectionDeltaQuaternion(activeInspection.move, activeInspection.eased));
  target.multiply(driftQuaternion(driftTimeMs));
  return target.normalize();
}

function beginInspection(move, moveIndex = presentationMoveIndex) {
  if (activeInspection) return false;
  activeInspection = {
    serial: ++inspectionSerial,
    moveIndex,
    move,
    elapsedMs: 0,
    eased: 0,
    linear: 0,
    resolve: null,
  };
  return activeInspection;
}

function finalizeInspection() {
  if (!activeInspection) return false;
  const finished = activeInspection;
  presentationBaseQuaternion.multiply(inspectionFinalYawQuaternion(finished.move)).normalize();
  presentationCompletedMoves += 1;
  activeInspection = null;
  if (finished.resolve) finished.resolve({
    serial: finished.serial,
    moveIndex: finished.moveIndex,
    yawDeg: finished.move.yawDeg,
    durationMs: finished.move.durationMs,
    baseQuaternion: presentationBaseQuaternion.toArray(),
  });
  return true;
}

function presentationInteractionBlocked() {
  return interactionActive || performance.now() < manualResumeAt;
}

function updatePresentationMotion(now) {
  if (!api.ready || captureMode || prefersReducedMotion) return;
  if (!presentationLastNow) {
    presentationLastNow = now;
    lastPresentationQuaternion.copy(presentationRig.quaternion);
    return;
  }
  const deltaMs = Math.min(80, Math.max(0, now - presentationLastNow));
  presentationLastNow = now;
  const blocked = presentationInteractionBlocked();
  if (activeInspection && !blocked) {
    activeInspection.elapsedMs += deltaMs;
    activeInspection.linear = THREE.MathUtils.clamp(activeInspection.elapsedMs / activeInspection.move.durationMs, 0, 1);
    activeInspection.eased = presentationBezierEase(activeInspection.linear, activeInspection.move.easing);
    if (activeInspection.linear >= 1) finalizeInspection();
  }
  if (blocked) {
    presentationFrameDeltaRad = 0;
    lastPresentationQuaternion.copy(presentationRig.quaternion);
    return;
  }

  presentationDriftTimeMs += deltaMs;
  const target = currentPresentationTarget(presentationDriftTimeMs);
  const before = presentationRig.quaternion.clone();
  if (presentationResumeStart > 0 && now < presentationResumeStart + MOTION.manualResumeBlendMs) {
    const progress = smoothstep((now - presentationResumeStart) / MOTION.manualResumeBlendMs);
    presentationRig.quaternion.slerpQuaternions(presentationResumeFrom, target, progress).normalize();
  } else {
    presentationRig.quaternion.copy(target);
    if (presentationResumeStart > 0) presentationResumeStart = 0;
  }
  presentationFrameDeltaRad = before.angleTo(presentationRig.quaternion);
  lastPresentationQuaternion.copy(presentationRig.quaternion);
}

function animateInspection(move, moveIndex = presentationMoveIndex) {
  return new Promise((resolve) => {
    const state = beginInspection(move, moveIndex);
    if (!state) { resolve(false); return; }
    state.resolve = resolve;
  });
}

async function presentationDelay(durationMs) {
  let elapsed = 0;
  let previous = performance.now();
  while (elapsed < durationMs && presentationSchedulerEnabled) {
    await sleep(Math.min(32, Math.max(8, durationMs - elapsed)));
    const now = performance.now();
    const delta = now - previous;
    previous = now;
    if (!presentationInteractionBlocked()) elapsed += delta;
  }
  return presentationSchedulerEnabled;
}

async function presentationSchedulerLoop() {
  if (presentationSchedulerRunning) return;
  presentationSchedulerRunning = true;
  if (!await presentationDelay(PRESENTATION_R1_1.initialDelayMs)) {
    presentationSchedulerRunning = false;
    return;
  }
  while (presentationSchedulerEnabled) {
    while (presentationSchedulerEnabled && presentationInteractionBlocked()) await sleep(40);
    if (!presentationSchedulerEnabled) break;
    const moveIndex = presentationMoveIndex % PRESENTATION_R1_1.moves.length;
    const move = PRESENTATION_R1_1.moves[moveIndex];
    const result = await animateInspection(move, moveIndex);
    if (!result && !presentationSchedulerEnabled) break;
    if (!presentationSchedulerEnabled) break;
    if (!await presentationDelay(move.holdMs)) break;
    presentationMoveIndex = (moveIndex + 1) % PRESENTATION_R1_1.moves.length;
  }
  presentationSchedulerRunning = false;
}

function sampleAuthoredPresentationAt(timeSec = 0) {
  const absoluteMs = Math.max(0, timeSec) * 1000;
  let remaining = absoluteMs;
  let moveIndex = 0;
  let completedMoves = 0;
  const base = new THREE.Quaternion();

  if (remaining < PRESENTATION_R1_1.initialDelayMs) {
    const quaternion = base.clone().multiply(driftQuaternion(remaining)).normalize();
    return {
      timeSec,
      phase: 'initial-delay',
      activeInspection: null,
      completedMoves,
      baseQuaternion: base.toArray(),
      quaternion: quaternion.toArray(),
      eulerDeg: presentationEulerDegrees(quaternion),
    };
  }
  remaining -= PRESENTATION_R1_1.initialDelayMs;

  for (let guard = 0; guard < 64; guard += 1) {
    const move = PRESENTATION_R1_1.moves[moveIndex];
    if (remaining <= move.durationMs) {
      const linear = THREE.MathUtils.clamp(remaining / move.durationMs, 0, 1);
      const eased = presentationBezierEase(linear, move.easing);
      const quaternion = base.clone()
        .multiply(inspectionDeltaQuaternion(move, eased))
        .multiply(driftQuaternion(absoluteMs))
        .normalize();
      return {
        timeSec,
        phase: 'inspection',
        activeInspection: {
          moveIndex,
          yawDeg: move.yawDeg,
          pitchAmpDeg: move.pitchAmpDeg,
          rollAmpDeg: move.rollAmpDeg,
          durationMs: move.durationMs,
          holdMs: move.holdMs,
          linear,
          eased,
        },
        completedMoves,
        baseQuaternion: base.toArray(),
        quaternion: quaternion.toArray(),
        eulerDeg: presentationEulerDegrees(quaternion),
      };
    }
    remaining -= move.durationMs;
    base.multiply(inspectionFinalYawQuaternion(move)).normalize();
    completedMoves += 1;
    if (remaining <= move.holdMs) {
      const quaternion = base.clone().multiply(driftQuaternion(absoluteMs)).normalize();
      return {
        timeSec,
        phase: 'hold',
        activeInspection: null,
        holdingAfterMoveIndex: moveIndex,
        completedMoves,
        baseQuaternion: base.toArray(),
        quaternion: quaternion.toArray(),
        eulerDeg: presentationEulerDegrees(quaternion),
      };
    }
    remaining -= move.holdMs;
    moveIndex = (moveIndex + 1) % PRESENTATION_R1_1.moves.length;
  }
  throw new Error('Presentation sample guard exhausted');
}

function getReviewPresentationSample(timeSec = 0) {
  return sampleAuthoredPresentationAt(timeSec);
}

"""
source = source[:start] + presentation_block + source[end:]

old_controls = """controls.addEventListener('start', () => {
  interactionActive = true;
  frozenPresentationQuaternion.copy(presentationRig.quaternion);
  presentationResumeFrom.copy(presentationRig.quaternion);
  manualResumeAt = Infinity;
  sliceResumeAt = Infinity;
  presentationResumeStart = 0;
});

controls.addEventListener('end', () => {
  interactionActive = false;
  const now = performance.now();
  manualResumeAt = now + MOTION.manualResumeDelayMs;
  sliceResumeAt = manualResumeAt + MOTION.sliceResumeStaggerMs;
  presentationResumeStart = manualResumeAt;
  presentationResumeFrom.copy(presentationRig.quaternion);
});"""
secondary_controls = old_controls + """

// Spatial-recovery interaction guard survives the frozen Homepage bootstrap adaptation.
function spatialPresentationInteractionStart() {
  interactionActive = true;
  frozenPresentationQuaternion.copy(presentationRig.quaternion);
  presentationResumeFrom.copy(presentationRig.quaternion);
  manualResumeAt = Infinity;
  sliceResumeAt = Infinity;
  presentationResumeStart = 0;
}

function spatialPresentationInteractionEnd() {
  interactionActive = false;
  const now = performance.now();
  manualResumeAt = now + MOTION.manualResumeDelayMs;
  sliceResumeAt = manualResumeAt + MOTION.sliceResumeStaggerMs;
  presentationResumeStart = manualResumeAt;
  presentationResumeFrom.copy(presentationRig.quaternion);
}

controls.addEventListener('start', spatialPresentationInteractionStart);
controls.addEventListener('end', spatialPresentationInteractionEnd);"""
replace_once(old_controls, secondary_controls, 'interaction recovery adapter')

review_start = source.index('function setReviewPresentation(timeSec = 0, resumeProgress = 1, renderFrame = true) {')
review_end = source.index('function renderReviewFrame() {', review_start)
review_fn = r"""function setReviewPresentation(timeSec = 0, resumeProgress = 1, renderFrame = true) {
  if (!captureMode || !api.ready) return false;
  const sample = getReviewPresentationSample(timeSec);
  const target = new THREE.Quaternion().fromArray(sample.quaternion).normalize();
  if (resumeProgress < 1) {
    const progress = smoothstep(resumeProgress);
    presentationRig.quaternion.slerpQuaternions(frozenPresentationQuaternion, target, progress).normalize();
  } else {
    presentationRig.quaternion.copy(target);
  }
  if (renderFrame) renderReviewFrame();
  return { ...sample, quaternion: presentationRig.quaternion.toArray(), eulerDeg: presentationEulerDegrees(presentationRig.quaternion) };
}

"""
source = source[:review_start] + review_fn + source[review_end:]

old_interaction_tail = """    cameraPosition: camera.position.toArray(),
    presentationQuaternion: presentationRig.quaternion.toArray(),
  };
}"""
new_interaction_tail = """    cameraPosition: camera.position.toArray(),
    presentationQuaternion: presentationRig.quaternion.toArray(),
    presentationBaseQuaternion: presentationBaseQuaternion.toArray(),
    activeInspection: activeInspection ? {
      serial: activeInspection.serial,
      moveIndex: activeInspection.moveIndex,
      yawDeg: activeInspection.move.yawDeg,
      pitchAmpDeg: activeInspection.move.pitchAmpDeg,
      rollAmpDeg: activeInspection.move.rollAmpDeg,
      linear: activeInspection.linear,
      eased: activeInspection.eased,
    } : null,
  };
}"""
replace_once(old_interaction_tail, new_interaction_tail, 'interaction diagnostics')

old_diag_presentation = """    presentation: {
      simTimeMs: presentationSimTimeMs,
      signedYawDeg: presentationSignedYawDeg,
      cumulativeYawDeg: presentationCumulativeYawDeg,
      yawVelocityDegPerSec: presentationYawVelocityDegPerSec,
      frameAngularDeltaRad: presentationFrameDeltaRad,
      quaternion: presentationRig.quaternion.toArray(),
    },"""
new_diag_presentation = """    presentation: {
      authority: 'PRESENTATION_R1_1_SPATIAL_INSPECTION',
      legacyContinuousYawAuthority: false,
      baseQuaternion: presentationBaseQuaternion.toArray(),
      activeInspection: activeInspection ? {
        serial: activeInspection.serial,
        moveIndex: activeInspection.moveIndex,
        yawDeg: activeInspection.move.yawDeg,
        pitchAmpDeg: activeInspection.move.pitchAmpDeg,
        rollAmpDeg: activeInspection.move.rollAmpDeg,
        durationMs: activeInspection.move.durationMs,
        holdMs: activeInspection.move.holdMs,
        linear: activeInspection.linear,
        eased: activeInspection.eased,
      } : null,
      moveIndex: presentationMoveIndex,
      completedMoves: presentationCompletedMoves,
      driftTimeMs: presentationDriftTimeMs,
      frameAngularDeltaRad: presentationFrameDeltaRad,
      quaternion: presentationRig.quaternion.toArray(),
      eulerDeg: presentationEulerDegrees(presentationRig.quaternion),
    },"""
replace_once(old_diag_presentation, new_diag_presentation, 'presentation diagnostics')

old_sched = """    scheduler: {
      enabled: sliceSchedulerEnabled,
      running: sliceSchedulerRunning,
      eventSerial: sliceEventSerial,
      eventsUntilBreath,
    },"""
new_sched = """    scheduler: {
      enabled: sliceSchedulerEnabled,
      running: sliceSchedulerRunning,
      eventSerial: sliceEventSerial,
      eventsUntilBreath,
      presentationEnabled: presentationSchedulerEnabled,
      presentationRunning: presentationSchedulerRunning,
    },"""
replace_once(old_sched, new_sched, 'scheduler diagnostics')

replace_once(
    "status.textContent = 'Three.js GLB loaded. Geometry R1 + Motion R1.2 frozen. Materials + Lighting R1 ready.';\n    if (sliceSchedulerEnabled) void sliceSchedulerLoop();",
    "status.textContent = 'Three.js GLB loaded. R1.1 spatial presentation + R1.2 slices + Materials + Lighting R1 ready.';\n    if (sliceSchedulerEnabled) void sliceSchedulerLoop();\n    if (presentationSchedulerEnabled) void presentationSchedulerLoop();",
    'runtime startup',
)

for token in [
    'function presentationVelocityAt(',
    'function presentationPitchRollAt(',
    'function integratePresentationYawDeg(',
    'presentationYawRad +=',
    'presentationYawVelocityDegPerSec =',
]:
    if token in source:
        raise SystemExit(f'legacy continuous yaw authority remains: {token}')

for token in [
    'const PRESENTATION_R1_1 = Object.freeze({',
    'yawDeg: 150, pitchAmpDeg: 6.2, rollAmpDeg: -1.05, durationMs: 6400, holdMs: 1450',
    'yawDeg: -225, pitchAmpDeg: -7.6, rollAmpDeg: 1.45, durationMs: 7600, holdMs: 1720',
    'yawDeg: 360, pitchAmpDeg: 7.5, rollAmpDeg: -1.35, durationMs: 8800, holdMs: 2180',
    'yawDeg: 175, pitchAmpDeg: -5.8, rollAmpDeg: 0.95, durationMs: 6900, holdMs: 1580',
    'presentationBaseQuaternion.multiply(inspectionFinalYawQuaternion(finished.move)).normalize();',
    "authority: 'PRESENTATION_R1_1_SPATIAL_INSPECTION'",
    'void presentationSchedulerLoop();',
    'void sliceSchedulerLoop();',
]:
    if token not in source:
        raise SystemExit(f'required recovery token missing: {token[:80]}')

after = {
    name: hashlib.sha256(region(source, *markers).encode()).hexdigest()
    for name, markers in protected_specs.items()
}
if before != after:
    raise SystemExit(f'protected slice regions changed: before={before} after={after}')

proof_dir.mkdir(exist_ok=True)
(proof_dir / 'protected-slice-hashes.json').write_text(
    json.dumps({'before': before, 'after': after, 'pass': before == after}, indent=2)
)
path.write_text(source)
print(json.dumps({'protected': after, 'sourceBytes': len(source.encode())}, indent=2))
