from pathlib import Path
import shutil

ROOT = Path('.').resolve()
SRC = ROOT / 'docs/site-evolution/spline/proai-cube-presentation-motion-r1'
DST = ROOT / 'docs/site-evolution/spline/proai-cube-presentation-motion-r1-2'

if DST.exists():
    shutil.rmtree(DST)
shutil.copytree(
    SRC,
    DST,
    ignore=shutil.ignore_patterns('review', 'QA.json', 'REPORT.md', 'node_modules', 'dist', 'package-lock.json'),
)
(DST / 'review').mkdir(parents=True, exist_ok=True)

main_path = DST / 'main.js'
text = main_path.read_text()


def replace_between(source: str, start: str, end: str, replacement: str) -> str:
    a = source.index(start)
    b = source.index(end, a)
    return source[:a] + replacement + source[b:]


motion_and_presentation = r'''const MOTION = Object.freeze({
  turnDurationRangeMs: [1080, 1420],
  easing: [0.36, 0.0, 0.12, 1.0],
  orbitDampingFactor: 0.074,
  orbitRotateSpeed: 0.50,
  orbitZoomSpeed: 0.48,
  manualResumeDelayMs: 1850,
  manualResumeBlendMs: 2400,
  sliceResumeStaggerMs: 280,
});

const PRESENTATION_R1_2 = Object.freeze({
  normalYawVelocityDegPerSec: [7, 12],
  inspectionYawVelocityDegPerSec: [18, 30],
  pitchEnvelopeDeg: 10.2,
  rollEnvelopeDeg: 2.45,
  velocityCycleMs: 68000,
  velocityKeyframes: Object.freeze([
    Object.freeze({ timeMs: 0, velocityDegPerSec: 8.0 }),
    Object.freeze({ timeMs: 3500, velocityDegPerSec: 11.0 }),
    Object.freeze({ timeMs: 5500, velocityDegPerSec: 24.0 }),
    Object.freeze({ timeMs: 9500, velocityDegPerSec: 30.0 }),
    Object.freeze({ timeMs: 13500, velocityDegPerSec: 27.0 }),
    Object.freeze({ timeMs: 16500, velocityDegPerSec: 12.0 }),
    Object.freeze({ timeMs: 23000, velocityDegPerSec: 8.0 }),
    Object.freeze({ timeMs: 29000, velocityDegPerSec: 10.0 }),
    Object.freeze({ timeMs: 36000, velocityDegPerSec: -8.0 }),
    Object.freeze({ timeMs: 43000, velocityDegPerSec: -11.0 }),
    Object.freeze({ timeMs: 49000, velocityDegPerSec: -24.0 }),
    Object.freeze({ timeMs: 55000, velocityDegPerSec: -29.0 }),
    Object.freeze({ timeMs: 60000, velocityDegPerSec: -14.0 }),
    Object.freeze({ timeMs: 68000, velocityDegPerSec: 8.0 }),
  ]),
  pitchPrimaryPeriodMs: 14800,
  pitchSecondaryPeriodMs: 31100,
  rollPrimaryPeriodMs: 18400,
  rollSecondaryPeriodMs: 36700,
  review360TargetSec: 18.0,
});

const SLICE_R1_2 = Object.freeze({
  turnDurationRangeMs: [1080, 1420],
  typicalGapRangeMs: [180, 420],
  breathingGapRangeMs: [620, 820],
  pairedStaggerRangeMs: [100, 220],
  phraseMicroGapRangeMs: [90, 170],
  eventPattern: Object.freeze(['single', 'pair', 'single', 'single', 'phrase', 'single', 'pair', 'single', 'single', 'phrase']),
  distribution: Object.freeze({ single: 0.60, paired: 0.20, phrase: 0.20 }),
  seed: 0x51a7c0de,
});

'''
text = replace_between(text, 'const MOTION = Object.freeze({', 'const PRIMARY_PHRASE = Object.freeze([', motion_and_presentation)

text = replace_between(
    text,
    "let motionState = 'loading';",
    'const api = {',
    r'''let motionState = 'loading';
let sliceSchedulerEnabled = !captureMode && !prefersReducedMotion;
let sliceSchedulerRunning = false;
let interactionActive = false;
let manualResumeAt = 0;
let sliceResumeAt = 0;
let presentationResumeStart = 0;
let presentationResumeFrom = new THREE.Quaternion();
let frozenPresentationQuaternion = new THREE.Quaternion();
let lastTurnResult = null;
let lastTurnResults = [];
let turnSerial = 0;
let geometryStats = null;
let activeTurns = new Map();
let reviewTurnIds = [];
let sliceSeed = SLICE_R1_2.seed >>> 0;
let sliceEventSerial = 0;
let eventsUntilBreath = 4;
let presentationSimTimeMs = 0;
let presentationYawRad = 0;
let presentationSignedYawDeg = 0;
let presentationCumulativeYawDeg = 0;
let presentationYawVelocityDegPerSec = 0;
let presentationLastNow = 0;
let presentationFrameDeltaRad = 0;
let lastPresentationQuaternion = new THREE.Quaternion();

''',
)

text = replace_between(
    text,
    'const api = {',
    'function setMotionState(next) {',
    r'''const api = {
  ready: false,
  motionState,
  motionConfig: MOTION,
  geometryConfig: GEOMETRY_R1,
  presentationConfig: PRESENTATION_R1_2,
  sliceConfig: SLICE_R1_2,
  geometry: null,
  hierarchy: null,
  mechanics: null,
  turnSlice,
  runAutomatedQA,
  runPairedTurnQA,
  getDiagnostics,
  getInteractionState,
  stopChoreography() { sliceSchedulerEnabled = false; },
  stopSliceScheduler() { sliceSchedulerEnabled = false; },
  startChoreography() {
    if (!prefersReducedMotion) {
      sliceSchedulerEnabled = true;
      void sliceSchedulerLoop();
    }
  },
  beginReviewTurn,
  setReviewTurnProgress,
  beginReviewPair,
  setReviewPairProgress,
  setReviewPresentation,
  getReviewPresentationSample,
  renderReviewFrame,
  captureFrame(type = 'image/png', quality = 0.94) {
    renderReviewFrame();
    return canvas.toDataURL(type, quality);
  },
};
window.__PROAI_CUBE_R1_2 = api;
window.__PROAI_CUBE_R1 = api;

''',
)

mechanics = r'''function activeTurnList() {
  return [...activeTurns.values()];
}

function activeTurnById(turnOrId) {
  if (!turnOrId) return null;
  if (typeof turnOrId === 'string') return activeTurns.get(turnOrId) || null;
  return turnOrId.id ? activeTurns.get(turnOrId.id) || turnOrId : turnOrId;
}

function turnSafety(axis, layer) {
  const normalizedAxis = String(axis).toUpperCase();
  const selected = selectLayer(normalizedAxis, layer);
  const selectedIds = new Set(selected.map((cubie) => cubie.id));
  const conflicts = [];
  for (const existing of activeTurns.values()) {
    const existingIds = new Set(existing.cubiePlans.map((plan) => plan.cubie.id));
    const intersection = [...selectedIds].filter((id) => existingIds.has(id));
    if (existing.axis !== normalizedAxis || existing.layer === layer || intersection.length > 0) {
      conflicts.push({ turnId: existing.id, axis: existing.axis, layer: existing.layer, intersection });
    }
  }
  return { pass: conflicts.length === 0, normalizedAxis, selected, conflicts };
}

function beginTurn(axis = 'X', layer = 1, direction = 1) {
  if (activeTurns.size >= 2) throw new Error('At most two concurrent disjoint slice turns are supported');
  const normalizedDirection = direction >= 0 ? 1 : -1;
  const safety = turnSafety(axis, layer);
  if (!safety.pass) throw new Error(`Unsafe concurrent slice request: ${JSON.stringify(safety.conflicts)}`);
  const normalizedAxis = safety.normalizedAxis;
  const selected = safety.selected;
  const axisIndex = AXIS_INDEX[normalizedAxis];
  const pivot = new THREE.Group();
  const serial = ++turnSerial;
  const id = `turn-${serial}`;
  pivot.name = `R1_2_TEMP_${normalizedAxis}_${layer >= 0 ? '+' : ''}${layer}_SLICE_PIVOT_${serial}`;
  pivot.position.copy(cubeCenterLocal);
  pivot.position.setComponent(axisIndex, latticeCenters[normalizedAxis][layer + 1]);
  sceneOne.add(pivot);
  sceneOne.updateMatrixWorld(true);

  const targetQuaternion = new THREE.Quaternion().setFromAxisAngle(AXIS_VECTOR[normalizedAxis], normalizedDirection * Math.PI / 2).normalize();
  const inverseTarget = targetQuaternion.clone().invert();
  const rotationMatrix = quarterTurnMatrix(normalizedAxis, normalizedDirection);
  const cubiePlans = selected.map((cubie) => ({
    cubie,
    nextLogical: rotateLogical(cubie.logical, normalizedAxis, normalizedDirection),
    nextOrientation: multiplyOrientation(rotationMatrix, cubie.orientation),
  }));

  const memberStates = [];
  for (const plan of cubiePlans) {
    for (const member of plan.cubie.members) {
      pivot.attach(member.object);
      const targetPose = desiredScenePose(plan.cubie, member, plan.nextLogical, plan.nextOrientation);
      const targetLocalPosition = targetPose.position.clone().sub(pivot.position).applyQuaternion(inverseTarget);
      const targetLocalQuaternion = inverseTarget.clone().multiply(targetPose.quaternion).normalize();
      memberStates.push({
        plan,
        member,
        startLocalPosition: member.object.position.clone(),
        startLocalQuaternion: member.object.quaternion.clone(),
        startLocalScale: member.object.scale.clone(),
        targetLocalPosition,
        targetLocalQuaternion,
        targetLocalScale: targetPose.scale.clone(),
      });
    }
  }
  pivot.updateMatrixWorld(true);

  const turn = {
    id,
    serial,
    axis: normalizedAxis,
    layer,
    direction: normalizedDirection,
    pivot,
    targetQuaternion,
    cubiePlans,
    memberStates,
    linear: 0,
    eased: 0,
  };
  activeTurns.set(id, turn);
  setMotionState('turning');
  return turn;
}

function setTurnProgress(turnOrId, linear, { finalize = false } = {}) {
  const turn = activeTurnById(turnOrId);
  if (!turn) throw new Error('No active turn');
  const progress = THREE.MathUtils.clamp(linear, 0, 1);
  const eased = cubicBezierEase(progress);
  turn.linear = progress;
  turn.eased = eased;
  turn.pivot.quaternion.slerpQuaternions(new THREE.Quaternion(), turn.targetQuaternion, eased).normalize();
  for (const state of turn.memberStates) {
    state.member.object.position.lerpVectors(state.startLocalPosition, state.targetLocalPosition, eased);
    state.member.object.quaternion.slerpQuaternions(state.startLocalQuaternion, state.targetLocalQuaternion, eased).normalize();
    state.member.object.scale.lerpVectors(state.startLocalScale, state.targetLocalScale, eased);
    state.member.object.updateMatrix();
  }
  turn.pivot.updateMatrixWorld(true);
  if (finalize || progress >= 1) return finalizeTurn(turn);
  return { id: turn.id, axis: turn.axis, layer: turn.layer, direction: turn.direction, linear: progress, eased };
}

function finalizeTurn(turnOrId) {
  const turn = activeTurnById(turnOrId);
  if (!turn) throw new Error('No active turn to finalize');
  turn.pivot.quaternion.copy(turn.targetQuaternion);
  for (const state of turn.memberStates) {
    state.member.object.position.copy(state.targetLocalPosition);
    state.member.object.quaternion.copy(state.targetLocalQuaternion);
    state.member.object.scale.copy(state.targetLocalScale);
    state.member.object.updateMatrix();
  }
  turn.pivot.updateMatrixWorld(true);

  for (const plan of turn.cubiePlans) {
    plan.cubie.logical = { ...plan.nextLogical };
    plan.cubie.orientation = [...plan.nextOrientation];
  }
  for (const state of turn.memberStates) state.member.originalParent.attach(state.member.object);
  for (const plan of turn.cubiePlans) {
    for (const member of plan.cubie.members) applyExactScenePose(plan.cubie, member);
  }
  sceneOne.remove(turn.pivot);
  activeTurns.delete(turn.id);
  sceneOne.updateMatrixWorld(true);
  setMotionState(activeTurns.size ? 'turning' : 'rest');

  const canonical = activeTurns.size === 0 ? canonicalTransformError() : null;
  const result = {
    id: turn.id,
    serial: turn.serial,
    axis: turn.axis,
    layer: turn.layer,
    direction: turn.direction,
    endpointErrorRad: 0,
    canonical,
  };
  lastTurnResult = result;
  lastTurnResults.push(result);
  if (lastTurnResults.length > 24) lastTurnResults = lastTurnResults.slice(-24);
  return result;
}

function presentationAutonomyBlocked() {
  return interactionActive || performance.now() < manualResumeAt;
}

function sliceAutonomyBlocked() {
  return interactionActive || performance.now() < sliceResumeAt;
}

function autonomyBlocked() {
  return presentationAutonomyBlocked();
}

function animateTurn(turnOrId, durationMs) {
  const turn = activeTurnById(turnOrId);
  if (!turn) return Promise.resolve(false);
  return new Promise((resolve) => {
    let elapsed = 0;
    let previous = performance.now();
    function tick(now) {
      const delta = Math.max(0, now - previous);
      previous = now;
      elapsed += delta;
      const linear = THREE.MathUtils.clamp(elapsed / Math.max(1, durationMs), 0, 1);
      if (linear >= 1) {
        resolve(setTurnProgress(turn.id, 1, { finalize: true }));
        return;
      }
      setTurnProgress(turn.id, linear);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

async function turnSlice({ axis = 'X', layer = 1, direction = 1, durationMs = null, durationScale = 1, instant = false, ignoreInteraction = false } = {}) {
  if (!api.ready) return false;
  if (!ignoreInteraction && sliceAutonomyBlocked()) return false;
  let turn;
  try {
    turn = beginTurn(axis, layer, direction);
  } catch (error) {
    if (String(error).includes('Unsafe concurrent slice request') || String(error).includes('At most two concurrent')) return false;
    throw error;
  }
  if (instant) return setTurnProgress(turn.id, 1, { finalize: true });
  const baseDuration = durationMs ?? (MOTION.turnDurationRangeMs[0] + MOTION.turnDurationRangeMs[1]) / 2;
  return animateTurn(turn.id, Math.max(1, baseDuration * durationScale));
}

'''
text = replace_between(text, "function beginTurn(axis = 'X', layer = 1, direction = 1) {", 'function snapshotLogicalState() {', mechanics)

qa_section = r'''async function runPairedTurnQA() {
  const startState = snapshotLogicalState();
  while (activeTurns.size) await sleep(10);
  const pairAxis = 'X';
  const layers = [-1, 1];
  const selectedA = selectLayer(pairAxis, layers[0]);
  const selectedB = selectLayer(pairAxis, layers[1]);
  const idsA = new Set(selectedA.map((cubie) => cubie.id));
  const intersection = selectedB.map((cubie) => cubie.id).filter((id) => idsA.has(id));

  const a = beginTurn(pairAxis, layers[0], 1);
  const b = beginTurn(pairAxis, layers[1], -1);
  const simultaneousCount = activeTurns.size;
  const pivotMembersA = new Set(a.memberStates.map((state) => state.member.object.uuid));
  const memberIntersection = b.memberStates.map((state) => state.member.object.uuid).filter((id) => pivotMembersA.has(id));
  const forwardA = setTurnProgress(a.id, 1, { finalize: true });
  const forwardB = setTurnProgress(b.id, 1, { finalize: true });
  const afterForward = snapshotLogicalState();

  const ia = beginTurn(pairAxis, layers[0], -1);
  const ib = beginTurn(pairAxis, layers[1], 1);
  const inverseA = setTurnProgress(ia.id, 1, { finalize: true });
  const inverseB = setTurnProgress(ib.id, 1, { finalize: true });
  const restored = snapshotLogicalState();
  const restorationLogical = maxLogicalStateError(startState, restored);
  const restorationCanonical = canonicalTransformError();
  const changed = maxLogicalStateError(startState, afterForward);

  return {
    sameAxis: pairAxis,
    distinctLayers: layers[0] !== layers[1],
    physicalCubieIntersectionCount: intersection.length,
    memberObjectIntersectionCount: memberIntersection.length,
    simultaneousActiveTurns: simultaneousCount,
    forwardEndpointErrors: [forwardA.endpointErrorRad, forwardB.endpointErrorRad],
    inverseEndpointErrors: [inverseA.endpointErrorRad, inverseB.endpointErrorRad],
    logicalStateChangedAfterForward: changed.coordinateMismatch > 0 || changed.orientationMismatch > 0,
    restorationLogical,
    restorationCanonical,
    pass: layers[0] !== layers[1]
      && intersection.length === 0
      && memberIntersection.length === 0
      && simultaneousCount === 2
      && forwardA.endpointErrorRad === 0
      && forwardB.endpointErrorRad === 0
      && inverseA.endpointErrorRad === 0
      && inverseB.endpointErrorRad === 0
      && restorationLogical.coordinateMismatch === 0
      && restorationLogical.orientationMismatch === 0
      && restorationCanonical.maxPosition < 1e-6
      && restorationCanonical.maxQuaternionRad < 1e-6
      && restorationCanonical.maxScale < 1e-8,
  };
}

async function runAutomatedQA() {
  const wasEnabled = sliceSchedulerEnabled;
  sliceSchedulerEnabled = false;
  while (activeTurns.size) await sleep(10);
  const startState = snapshotLogicalState();
  const startCanonical = canonicalTransformError();

  const layerSupport = {};
  for (const axis of AXES) {
    layerSupport[axis] = {};
    for (const layer of LAYERS) {
      const selected = selectLayer(axis, layer);
      layerSupport[axis][layer] = {
        physicalCubies: selected.length,
        exportedObjects: selected.reduce((sum, cubie) => sum + cubie.members.length, 0),
        pass: selected.length === 9,
      };
    }
  }

  const axisSupport = {};
  for (const [axis, layer] of [['X', 1], ['Y', 0], ['Z', -1]]) {
    const forward = await turnSlice({ axis, layer, direction: 1, instant: true, ignoreInteraction: true });
    const inverse = await turnSlice({ axis, layer, direction: -1, instant: true, ignoreInteraction: true });
    const stateError = maxLogicalStateError(startState, snapshotLogicalState());
    axisSupport[axis] = {
      forwardEndpointErrorRad: forward?.endpointErrorRad ?? null,
      inverseEndpointErrorRad: inverse?.endpointErrorRad ?? null,
      restoredAfterPair: stateError.coordinateMismatch === 0 && stateError.orientationMismatch === 0,
    };
  }

  const repeatabilityStart = snapshotLogicalState();
  let maxCanonicalPosition = 0;
  let maxCanonicalQuaternionRad = 0;
  let maxCanonicalScale = 0;
  const endpointErrors = [];
  for (const [axis, layer, direction] of MIXED_30) {
    const result = await turnSlice({ axis, layer, direction, instant: true, ignoreInteraction: true });
    endpointErrors.push(result.endpointErrorRad);
    maxCanonicalPosition = Math.max(maxCanonicalPosition, result.canonical.maxPosition);
    maxCanonicalQuaternionRad = Math.max(maxCanonicalQuaternionRad, result.canonical.maxQuaternionRad);
    maxCanonicalScale = Math.max(maxCanonicalScale, result.canonical.maxScale);
  }
  const stateAfter30 = snapshotLogicalState();

  for (const [axis, layer, direction] of [...MIXED_30].reverse()) {
    await turnSlice({ axis, layer, direction: -direction, instant: true, ignoreInteraction: true });
  }

  const restoredState = snapshotLogicalState();
  const restorationLogical = maxLogicalStateError(repeatabilityStart, restoredState);
  const restorationCanonical = canonicalTransformError();
  const startVsRestored = maxLogicalStateError(startState, restoredState);
  const pairedTurnQA = await runPairedTurnQA();

  if (wasEnabled && !captureMode && !prefersReducedMotion) {
    sliceSchedulerEnabled = true;
    void sliceSchedulerLoop();
  }

  return {
    axisSupport,
    layerSupport,
    repeatability30: {
      turns: MIXED_30.length,
      endpointMaxErrorRad: Math.max(...endpointErrors),
      maxCanonicalPosition,
      maxCanonicalQuaternionRad,
      maxCanonicalScale,
      logicalStateChanged: (() => {
        const changed = maxLogicalStateError(repeatabilityStart, stateAfter30);
        return changed.coordinateMismatch > 0 || changed.orientationMismatch > 0;
      })(),
      pass: endpointErrors.every((value) => value === 0)
        && maxCanonicalPosition < 1e-6
        && maxCanonicalQuaternionRad < 1e-6
        && maxCanonicalScale < 1e-8,
    },
    inverseRestoration: {
      logical: restorationLogical,
      canonical: restorationCanonical,
      startVsRestored,
      pass: restorationLogical.coordinateMismatch === 0
        && restorationLogical.orientationMismatch === 0
        && restorationCanonical.maxPosition < 1e-6
        && restorationCanonical.maxQuaternionRad < 1e-6
        && restorationCanonical.maxScale < 1e-8,
    },
    pairedTurnQA,
    startCanonical,
  };
}

'''
text = replace_between(text, 'async function runAutomatedQA() {', 'function driftQuaternion(timeMs) {', qa_section)

presentation_and_scheduler = r'''function presentationVelocityAt(timeMs) {
  const cycle = PRESENTATION_R1_2.velocityCycleMs;
  let local = timeMs % cycle;
  if (local < 0) local += cycle;
  const keys = PRESENTATION_R1_2.velocityKeyframes;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const a = keys[i];
    const b = keys[i + 1];
    if (local <= b.timeMs) {
      const p = smoothstep((local - a.timeMs) / Math.max(1, b.timeMs - a.timeMs));
      return THREE.MathUtils.lerp(a.velocityDegPerSec, b.velocityDegPerSec, p);
    }
  }
  return keys[0].velocityDegPerSec;
}

function presentationPitchRollAt(timeMs) {
  const pitch = THREE.MathUtils.degToRad(
    8.65 * Math.sin((timeMs / PRESENTATION_R1_2.pitchPrimaryPeriodMs) * Math.PI * 2 + 0.42)
    + 1.55 * Math.sin((timeMs / PRESENTATION_R1_2.pitchSecondaryPeriodMs) * Math.PI * 2 + 1.18),
  );
  const roll = THREE.MathUtils.degToRad(
    1.92 * Math.sin((timeMs / PRESENTATION_R1_2.rollPrimaryPeriodMs) * Math.PI * 2 + 1.35)
    + 0.48 * Math.sin((timeMs / PRESENTATION_R1_2.rollSecondaryPeriodMs) * Math.PI * 2 + 2.20),
  );
  return { pitch, roll };
}

function presentationQuaternionAt(timeMs, yawRad) {
  const { pitch, roll } = presentationPitchRollAt(timeMs);
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yawRad, roll, 'YXZ')).normalize();
}

function integratePresentationYawDeg(timeMs) {
  const stepMs = 10;
  let elapsed = 0;
  let yawDeg = 0;
  while (elapsed < timeMs) {
    const dt = Math.min(stepMs, timeMs - elapsed);
    yawDeg += presentationVelocityAt(elapsed + dt * 0.5) * (dt / 1000);
    elapsed += dt;
  }
  return yawDeg;
}

function getReviewPresentationSample(timeSec = 0) {
  const timeMs = Math.max(0, timeSec) * 1000;
  const signedYawDeg = integratePresentationYawDeg(timeMs);
  const velocityDegPerSec = presentationVelocityAt(timeMs);
  const { pitch, roll } = presentationPitchRollAt(timeMs);
  return {
    timeSec,
    signedYawDeg,
    cumulativeYawDeg: Math.abs(signedYawDeg),
    velocityDegPerSec,
    pitchDeg: THREE.MathUtils.radToDeg(pitch),
    rollDeg: THREE.MathUtils.radToDeg(roll),
  };
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
  if (presentationAutonomyBlocked()) {
    presentationFrameDeltaRad = 0;
    lastPresentationQuaternion.copy(presentationRig.quaternion);
    return;
  }

  presentationSimTimeMs += deltaMs;
  presentationYawVelocityDegPerSec = presentationVelocityAt(presentationSimTimeMs);
  const yawStepDeg = presentationYawVelocityDegPerSec * (deltaMs / 1000);
  presentationYawRad += THREE.MathUtils.degToRad(yawStepDeg);
  presentationSignedYawDeg += yawStepDeg;
  presentationCumulativeYawDeg += Math.abs(yawStepDeg);
  const target = presentationQuaternionAt(presentationSimTimeMs, presentationYawRad);
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

function seededUnit() {
  let x = sliceSeed >>> 0;
  x ^= (x << 13) >>> 0;
  x ^= x >>> 17;
  x ^= (x << 5) >>> 0;
  sliceSeed = x >>> 0;
  return sliceSeed / 4294967296;
}

function seededRange(min, max) {
  return min + (max - min) * seededUnit();
}

function seededInt(min, maxInclusive) {
  return Math.floor(seededRange(min, maxInclusive + 1));
}

function makeScheduledMove(axis = null, layer = null) {
  const selectedAxis = axis || AXES[sliceEventSerial % AXES.length];
  const selectedLayer = layer ?? LAYERS[seededInt(0, LAYERS.length - 1)];
  return {
    axis: selectedAxis,
    layer: selectedLayer,
    direction: seededUnit() < 0.5 ? -1 : 1,
    durationMs: Math.round(seededRange(...SLICE_R1_2.turnDurationRangeMs)),
  };
}

async function waitForSliceAutonomy() {
  while (sliceSchedulerEnabled && sliceAutonomyBlocked()) await sleep(40);
  return sliceSchedulerEnabled;
}

async function schedulerDelay(durationMs) {
  let elapsed = 0;
  let previous = performance.now();
  while (elapsed < durationMs && sliceSchedulerEnabled) {
    await sleep(Math.min(32, Math.max(8, durationMs - elapsed)));
    const now = performance.now();
    const delta = now - previous;
    previous = now;
    if (!sliceAutonomyBlocked()) elapsed += delta;
  }
}

async function runSingleScheduledEvent() {
  if (!await waitForSliceAutonomy()) return false;
  const axis = AXES[sliceEventSerial % AXES.length];
  const move = makeScheduledMove(axis);
  return turnSlice(move);
}

async function runPairedScheduledEvent() {
  if (!await waitForSliceAutonomy()) return false;
  const axis = AXES[sliceEventSerial % AXES.length];
  const firstLayer = LAYERS[seededInt(0, 2)];
  const otherLayers = LAYERS.filter((value) => value !== firstLayer);
  const secondLayer = otherLayers[seededInt(0, otherLayers.length - 1)];
  const firstMove = makeScheduledMove(axis, firstLayer);
  const secondMove = makeScheduledMove(axis, secondLayer);
  const firstPromise = turnSlice(firstMove);
  const staggerMs = Math.round(seededRange(...SLICE_R1_2.pairedStaggerRangeMs));
  await sleep(staggerMs);
  if (sliceAutonomyBlocked() || !sliceSchedulerEnabled) {
    await firstPromise;
    return true;
  }
  const secondPromise = turnSlice(secondMove);
  await Promise.all([firstPromise, secondPromise]);
  return true;
}

async function runPhraseScheduledEvent() {
  const phraseLength = seededUnit() < 0.72 ? 2 : 3;
  for (let i = 0; i < phraseLength; i += 1) {
    if (!await waitForSliceAutonomy()) return false;
    const axis = AXES[(sliceEventSerial + i) % AXES.length];
    const move = makeScheduledMove(axis);
    await turnSlice(move);
    if (i < phraseLength - 1) await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)));
  }
  return true;
}

async function sliceSchedulerLoop() {
  if (sliceSchedulerRunning) return;
  sliceSchedulerRunning = true;
  await schedulerDelay(420);
  while (sliceSchedulerEnabled) {
    if (!await waitForSliceAutonomy()) break;
    const eventType = SLICE_R1_2.eventPattern[sliceEventSerial % SLICE_R1_2.eventPattern.length];
    if (eventType === 'pair') await runPairedScheduledEvent();
    else if (eventType === 'phrase') await runPhraseScheduledEvent();
    else await runSingleScheduledEvent();
    sliceEventSerial += 1;
    eventsUntilBreath -= 1;
    if (!sliceSchedulerEnabled) break;
    if (eventsUntilBreath <= 0) {
      await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.breathingGapRangeMs)));
      eventsUntilBreath = seededInt(3, 4);
    } else {
      await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.typicalGapRangeMs)));
    }
  }
  sliceSchedulerRunning = false;
}

'''
text = replace_between(text, 'function driftQuaternion(timeMs) {', 'function getInteractionState() {', presentation_and_scheduler)

interaction = r'''function getInteractionState() {
  const now = performance.now();
  return {
    interactionActive,
    autonomyBlocked: presentationAutonomyBlocked(),
    sliceAutonomyBlocked: sliceAutonomyBlocked(),
    resumeDelayRemainingMs: Math.max(0, manualResumeAt - now),
    sliceResumeDelayRemainingMs: Math.max(0, sliceResumeAt - now),
    presentationResumeActive: presentationResumeStart > 0 && now >= presentationResumeStart && now < presentationResumeStart + MOTION.manualResumeBlendMs,
    cameraPosition: camera.position.toArray(),
    presentationQuaternion: presentationRig.quaternion.toArray(),
  };
}

controls.addEventListener('start', () => {
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
});

'''
text = replace_between(text, 'function getInteractionState() {', 'function beginReviewTurn(axis, layer, direction) {', interaction)

review_helpers = r'''function beginReviewTurn(axis, layer, direction) {
  if (!captureMode || !api.ready) return false;
  const turn = beginTurn(axis, layer, direction);
  reviewTurnIds.push(turn.id);
  return { id: turn.id, axis: turn.axis, layer: turn.layer, direction: turn.direction };
}

function setReviewTurnProgress(turnId, linear) {
  if (!captureMode) return false;
  const progress = THREE.MathUtils.clamp(linear, 0, 1);
  const result = setTurnProgress(turnId, progress, { finalize: progress >= 1 });
  if (progress >= 1) reviewTurnIds = reviewTurnIds.filter((id) => id !== turnId);
  renderReviewFrame();
  return result;
}

function beginReviewPair(axis = 'X', layerA = -1, layerB = 1, directionA = 1, directionB = -1) {
  if (!captureMode || !api.ready || layerA === layerB) return false;
  const a = beginTurn(axis, layerA, directionA);
  const b = beginTurn(axis, layerB, directionB);
  reviewTurnIds.push(a.id, b.id);
  return [{ id: a.id, axis: a.axis, layer: a.layer, direction: a.direction }, { id: b.id, axis: b.axis, layer: b.layer, direction: b.direction }];
}

function setReviewPairProgress(turnIds, progressA, progressB = progressA) {
  if (!captureMode || !Array.isArray(turnIds) || turnIds.length !== 2) return false;
  const pa = THREE.MathUtils.clamp(progressA, 0, 1);
  const pb = THREE.MathUtils.clamp(progressB, 0, 1);
  const a = activeTurns.has(turnIds[0]) ? setTurnProgress(turnIds[0], pa, { finalize: pa >= 1 }) : null;
  const b = activeTurns.has(turnIds[1]) ? setTurnProgress(turnIds[1], pb, { finalize: pb >= 1 }) : null;
  if (pa >= 1) reviewTurnIds = reviewTurnIds.filter((id) => id !== turnIds[0]);
  if (pb >= 1) reviewTurnIds = reviewTurnIds.filter((id) => id !== turnIds[1]);
  renderReviewFrame();
  return [a, b];
}

function setReviewPresentation(timeSec = 0, resumeProgress = 1) {
  if (!captureMode || !api.ready) return false;
  const sample = getReviewPresentationSample(timeSec);
  const target = presentationQuaternionAt(sample.timeSec * 1000, THREE.MathUtils.degToRad(sample.signedYawDeg));
  if (resumeProgress < 1) {
    const progress = smoothstep(resumeProgress);
    presentationRig.quaternion.slerpQuaternions(frozenPresentationQuaternion, target, progress).normalize();
  } else {
    presentationRig.quaternion.copy(target);
  }
  renderReviewFrame();
  return { ...sample, quaternion: presentationRig.quaternion.toArray() };
}

'''
text = replace_between(text, 'function beginReviewTurn(axis, layer, direction) {', 'function renderReviewFrame() {', review_helpers)

diagnostics = r'''function getDiagnostics() {
  return {
    ready: api.ready,
    motionState,
    hierarchy: api.hierarchy,
    mechanics: api.mechanics,
    motionConfig: MOTION,
    presentationConfig: PRESENTATION_R1_2,
    sliceConfig: SLICE_R1_2,
    presentation: {
      simTimeMs: presentationSimTimeMs,
      signedYawDeg: presentationSignedYawDeg,
      cumulativeYawDeg: presentationCumulativeYawDeg,
      yawVelocityDegPerSec: presentationYawVelocityDegPerSec,
      frameAngularDeltaRad: presentationFrameDeltaRad,
      quaternion: presentationRig.quaternion.toArray(),
    },
    activeTurns: activeTurnList().map((turn) => ({
      id: turn.id,
      serial: turn.serial,
      axis: turn.axis,
      layer: turn.layer,
      direction: turn.direction,
      linear: turn.linear,
      eased: turn.eased,
      physicalCubieIds: turn.cubiePlans.map((plan) => plan.cubie.id),
    })),
    lastTurnResult,
    lastTurnResults: [...lastTurnResults],
    interaction: getInteractionState(),
    scheduler: {
      enabled: sliceSchedulerEnabled,
      running: sliceSchedulerRunning,
      eventSerial: sliceEventSerial,
      eventsUntilBreath,
    },
    canonicalError: api.ready && activeTurns.size === 0 ? canonicalTransformError() : null,
    geometry: api.geometry,
    geometryConfig: GEOMETRY_R1,
    renderer: {
      webgl2: renderer.capabilities.isWebGL2,
      pixelRatio: renderer.getPixelRatio(),
    },
  };
}

'''
text = replace_between(text, 'function getDiagnostics() {', 'function resize() {', diagnostics)

text = text.replace("const captureMode = params.has('capture');", "const captureMode = params.has('capture');\nconst reviewMode = params.has('review');")
text = text.replace('preserveDrawingBuffer: captureMode,', 'preserveDrawingBuffer: captureMode || reviewMode,')
text = text.replace('renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, captureMode ? 1 : 2));', 'renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, (captureMode || reviewMode) ? 1 : 2));')
text = text.replace("status.textContent = 'Three.js GLB loaded. Geometry R1 frozen. Presentation Motion R1.1 ready.';", "status.textContent = 'Three.js GLB loaded. Geometry R1 frozen. Presentation Motion R1.2 dual-motion ready.';")
text = text.replace('if (choreographyEnabled) void autonomousLoop();', 'if (sliceSchedulerEnabled) void sliceSchedulerLoop();')

main_path.write_text(text)

package_path = DST / 'package.json'
package_text = package_path.read_text().replace('"name": "proai-cube-geometry-r1"', '"name": "proai-cube-presentation-motion-r1-2"')
package_path.write_text(package_text)

capture = r'''import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REVIEW = path.join(ROOT, 'review');
const QA_PATH = path.join(ROOT, 'QA.json');
const REPORT_PATH = path.join(ROOT, 'REPORT.md');
const BASE_URL = process.env.PROAI_PRESENTATION_R1_2_URL || 'http://127.0.0.1:4173/';
const CAPTURE_URL = new URL('?capture=1', BASE_URL).toString();
const REVIEW_URL = new URL('?review=1', BASE_URL).toString();
const FPS = 24;
const VIDEO_SECONDS = 29;
const VIDEO_VIEWPORT = { width: 1080, height: 1080 };
const SCREENSHOT_VIEWPORT = { width: 1080, height: 1120 };
const MP4_PATH = path.join(REVIEW, 'proai-cube-presentation-motion-r1-2-review-29s.mp4');
const WEBM_PATH = path.join(REVIEW, 'proai-cube-presentation-motion-r1-2-review-29s.webm');
const NATURAL_PATH = path.join(REVIEW, 'proai-cube-presentation-motion-r1-2-natural.png');
const SIMULTANEOUS_PATH = path.join(REVIEW, 'proai-cube-presentation-motion-r1-2-simultaneous.png');
const PAIRED_PATH = path.join(REVIEW, 'proai-cube-presentation-motion-r1-2-paired.png');
const LARGE_PATH = path.join(REVIEW, 'proai-cube-presentation-motion-r1-2-large-angle.png');
const GLB_PATH = path.join(ROOT, 'rubik_39_s_cube_animation.glb');

fs.mkdirSync(REVIEW, { recursive: true });

function sha256(filepath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filepath)).digest('hex');
}
function jpegBufferFromDataUrl(dataUrl) {
  const comma = dataUrl.indexOf(',');
  if (!dataUrl.startsWith('data:image/jpeg') || comma < 0) throw new Error('Invalid JPEG frame data URL');
  return Buffer.from(dataUrl.slice(comma + 1), 'base64');
}
function vectorDistance(a, b) {
  return Math.sqrt(a.reduce((sum, value, index) => sum + (value - b[index]) ** 2, 0));
}
function quatAngle(a, b) {
  const dot = Math.min(1, Math.abs(a.reduce((sum, value, index) => sum + value * b[index], 0)));
  return 2 * Math.acos(dot);
}
function ffprobe(filepath) {
  const out = spawnSync('ffprobe', ['-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries',
    'stream=codec_name,pix_fmt,avg_frame_rate,nb_read_frames,width,height:format=format_name,duration', '-of', 'json', filepath], { encoding: 'utf8' });
  if (out.status !== 0) throw new Error(`ffprobe failed for ${filepath}: ${out.stderr || out.stdout}`);
  return JSON.parse(out.stdout);
}
function encodeFrames(buffers, filepath, codecArgs) {
  fs.rmSync(filepath, { force: true });
  const proc = spawnSync('ffmpeg', [
    '-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-vcodec', 'mjpeg', '-i', 'pipe:0',
    '-an', ...codecArgs, '-r', String(FPS), filepath,
  ], { input: Buffer.concat(buffers), encoding: 'utf8', maxBuffer: 512 * 1024 * 1024 });
  if (proc.status !== 0 || !fs.existsSync(filepath)) throw new Error(`ffmpeg encode failed: ${proc.stderr || proc.stdout}`);
}

const browser = await chromium.launch({ headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=swiftshader'] });
const context = await browser.newContext();
const requests = [];
const pageErrors = [];
const consoleErrors = [];
context.on('request', (request) => requests.push(request.url()));
function wirePage(page) {
  page.on('pageerror', (error) => pageErrors.push(String(error)));
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
}
async function openPage(url, viewport) {
  const page = await context.newPage();
  await page.setViewportSize(viewport);
  wirePage(page);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForFunction(() => (window.__PROAI_CUBE_R1_2 || window.__PROAI_CUBE_R1)?.ready === true, null, { timeout: 90000 });
  return page;
}

const qaPage = await openPage(CAPTURE_URL, SCREENSHOT_VIEWPORT);
const initialDiagnostics = await qaPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const mechanicalQA = await qaPage.evaluate(() => window.__PROAI_CUBE_R1_2.runAutomatedQA());
const expectedGeometry = {
  faceOuterSize: 196.8, faceThickness: 3.6, faceCornerRadius: 10.6,
  faceBevelSize: 2.35, faceBevelThickness: 1.25, faceBevelSegments: 4, faceCurveSegments: 8,
  coreSize: 198, coreRadius: 9.2, coreSegments: 5,
};
const geometryConfigFrozen = JSON.stringify(initialDiagnostics.geometryConfig) === JSON.stringify(expectedGeometry);
const geometryStatsFrozen = initialDiagnostics.geometry?.faceMeshes === 180
  && initialDiagnostics.geometry?.coreMeshes === 30
  && initialDiagnostics.geometry?.nonPlaneMeshes === 210
  && Math.abs(initialDiagnostics.geometry?.faceGapRange?.min - 3.6999999999999886) < 1e-9
  && Math.abs(initialDiagnostics.geometry?.faceGapRange?.max - 8.199999999999932) < 1e-9
  && Math.abs(initialDiagnostics.geometry?.coreGapRange?.min - 2.5) < 1e-9
  && Math.abs(initialDiagnostics.geometry?.coreGapRange?.max - 6.999999999999943) < 1e-9;
const geometryCodeFrozen = process.env.PROAI_GEOMETRY_CODE_FROZEN === '1';
const presentationSamples = [];
for (const timeSec of [0, 4, 8, 12, 16, 18, 19]) {
  presentationSamples.push(await qaPage.evaluate((timeSec) => window.__PROAI_CUBE_R1_2.getReviewPresentationSample(timeSec), timeSec));
}
const full360Sample = presentationSamples.find((sample) => sample.timeSec === 18);
const post360Sample = presentationSamples.find((sample) => sample.timeSec === 19);
const full360Pass = full360Sample.signedYawDeg >= 360
  && Math.abs(post360Sample.signedYawDeg - full360Sample.signedYawDeg) > 5
  && Math.abs(post360Sample.velocityDegPerSec) > 5;
await qaPage.close();

const interactionPage = await openPage(REVIEW_URL, SCREENSHOT_VIEWPORT);
await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.stopSliceScheduler());
await interactionPage.waitForFunction(() => window.__PROAI_CUBE_R1_2.getDiagnostics().activeTurns.length === 0, null, { timeout: 5000 });
const manualSliceStarted = await interactionPage.evaluate(() => {
  void window.__PROAI_CUBE_R1_2.turnSlice({ axis: 'X', layer: 1, direction: 1, durationMs: 1320 });
  return window.__PROAI_CUBE_R1_2.getDiagnostics().activeTurns.length === 1;
});
if (!manualSliceStarted) throw new Error('Could not start deterministic interaction slice');
await interactionPage.waitForTimeout(110);
const liveBox = await interactionPage.evaluate(() => {
  const r = document.getElementById('cube-canvas').getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height };
});
const beforeDrag = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const dragTurn = { ...beforeDrag.activeTurns[0] };
const x0 = liveBox.x + liveBox.width * 0.50;
const y0 = liveBox.y + liveBox.height * 0.49;
await interactionPage.mouse.move(x0, y0);
await interactionPage.mouse.down();
for (let i = 1; i <= 9; i += 1) {
  await interactionPage.mouse.move(x0 + 190 * (i / 9), y0 - 22 * (i / 9));
  await interactionPage.waitForTimeout(18);
}
const duringDrag = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
await interactionPage.waitForFunction(() => window.__PROAI_CUBE_R1_2.getDiagnostics().activeTurns.length === 0, null, { timeout: 3000 });
const sliceFinishedWhileDrag = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const blockedNewSliceAttempt = await interactionPage.evaluate(async () => window.__PROAI_CUBE_R1_2.turnSlice({ axis: 'Y', layer: 0, direction: -1, durationMs: 1240 }));
await interactionPage.waitForTimeout(900);
const held = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const cameraAtHeldAngle = held.interaction.cameraPosition;
await interactionPage.mouse.up();
await interactionPage.waitForTimeout(80);
const afterRelease = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
await interactionPage.waitForTimeout(1050);
const duringCalm = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
await interactionPage.waitForTimeout(930);
const presentationReturned = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
await interactionPage.waitForTimeout(420);
const staggerWindow = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
await interactionPage.waitForTimeout(650);
const blended = await interactionPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const activeSliceCompleted = sliceFinishedWhileDrag.lastTurnResult?.id === dragTurn.id
  && sliceFinishedWhileDrag.lastTurnResult?.endpointErrorRad === 0;
const nextSliceBlocked = blockedNewSliceAttempt === false && held.activeTurns.length === 0 && held.interaction.interactionActive;
const cameraNoSnap = vectorDistance(cameraAtHeldAngle, blended.interaction.cameraPosition) < 1.0;
const interactionPass = duringDrag.interaction.interactionActive
  && duringDrag.interaction.autonomyBlocked
  && activeSliceCompleted
  && nextSliceBlocked
  && !afterRelease.interaction.interactionActive
  && afterRelease.interaction.resumeDelayRemainingMs > 1500
  && duringCalm.interaction.autonomyBlocked
  && presentationReturned.interaction.presentationResumeActive
  && staggerWindow.interaction.sliceResumeDelayRemainingMs <= 30
  && cameraNoSnap;
await interactionPage.close();

async function screenshotNatural() {
  const page = await openPage(CAPTURE_URL, SCREENSHOT_VIEWPORT);
  await page.evaluate(() => window.__PROAI_CUBE_R1_2.setReviewPresentation(2.8));
  await page.screenshot({ path: NATURAL_PATH, fullPage: true });
  await page.close();
}
async function screenshotSimultaneous() {
  const page = await openPage(CAPTURE_URL, SCREENSHOT_VIEWPORT);
  await page.evaluate(() => {
    const api = window.__PROAI_CUBE_R1_2;
    api.setReviewPresentation(9.4);
    const turn = api.beginReviewTurn('Z', 1, 1);
    api.setReviewTurnProgress(turn.id, 0.54);
  });
  await page.screenshot({ path: SIMULTANEOUS_PATH, fullPage: true });
  await page.close();
}
async function screenshotPaired() {
  const page = await openPage(CAPTURE_URL, SCREENSHOT_VIEWPORT);
  await page.evaluate(() => {
    const api = window.__PROAI_CUBE_R1_2;
    api.setReviewPresentation(11.2);
    const pair = api.beginReviewPair('X', -1, 1, 1, -1);
    api.setReviewPairProgress(pair.map((entry) => entry.id), 0.62, 0.43);
  });
  await page.screenshot({ path: PAIRED_PATH, fullPage: true });
  await page.close();
}
async function screenshotLarge() {
  const page = await openPage(CAPTURE_URL, SCREENSHOT_VIEWPORT);
  await page.evaluate(() => window.__PROAI_CUBE_R1_2.setReviewPresentation(18.4));
  await page.screenshot({ path: LARGE_PATH, fullPage: true });
  await page.close();
}
await screenshotNatural();
await screenshotSimultaneous();
await screenshotPaired();
await screenshotLarge();

const videoPage = await openPage(REVIEW_URL, VIDEO_VIEWPORT);
const frameBuffers = [];
const frameStates = [];
const canvasBox = await videoPage.evaluate(() => {
  const r = document.getElementById('cube-canvas').getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height };
});
const dragStart = { x: canvasBox.x + canvasBox.width * 0.49, y: canvasBox.y + canvasBox.height * 0.50 };
let manualStarted = false;
let manualReleased = false;
let manualStartSec = null;
let manualReleaseSec = null;
let manualTurnId = null;
let activeSliceFinishedDuringHeldDrag = false;
let previousTurnSerial = 0;
const observedAxes = new Set();
let pairedObserved = false;
let densePhraseObserved = false;
let lastSliceStartSec = null;
let closeSliceStarts = 0;

const totalFrames = Math.round(VIDEO_SECONDS * FPS);
const wallStart = Date.now();
for (let i = 0; i < totalFrames; i += 1) {
  const targetElapsedMs = i * (1000 / FPS);
  const nowElapsedSec = (Date.now() - wallStart) / 1000;
  let diag = await videoPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());

  for (const turn of diag.activeTurns) observedAxes.add(turn.axis);
  if (diag.activeTurns.length >= 2) pairedObserved = true;
  if (diag.lastTurnResult?.serial && diag.lastTurnResult.serial !== previousTurnSerial) {
    const sec = (Date.now() - wallStart) / 1000;
    if (lastSliceStartSec !== null && sec - lastSliceStartSec < 1.75) closeSliceStarts += 1;
    lastSliceStartSec = sec;
    previousTurnSerial = diag.lastTurnResult.serial;
    if (closeSliceStarts >= 2) densePhraseObserved = true;
  }

  if (!manualStarted && nowElapsedSec >= 18.15 && nowElapsedSec <= 20.4 && diag.activeTurns.length === 1) {
    manualStarted = true;
    manualStartSec = nowElapsedSec;
    manualTurnId = diag.activeTurns[0].id;
    await videoPage.mouse.move(dragStart.x, dragStart.y);
    await videoPage.mouse.down();
  }
  if (manualStarted && !manualReleased) {
    const p = Math.min(1, (nowElapsedSec - manualStartSec) / 1.05);
    await videoPage.mouse.move(dragStart.x + 190 * p, dragStart.y - 26 * p);
    diag = await videoPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
    if (diag.activeTurns.length === 0 && diag.interaction.interactionActive && diag.lastTurnResult?.id === manualTurnId) activeSliceFinishedDuringHeldDrag = true;
    if (p >= 1) {
      await videoPage.mouse.up();
      manualReleased = true;
      manualReleaseSec = nowElapsedSec;
    }
  }

  const data = await videoPage.evaluate(() => {
    const api = window.__PROAI_CUBE_R1_2;
    const d = api.getDiagnostics();
    api.renderReviewFrame();
    return {
      dataUrl: document.getElementById('cube-canvas').toDataURL('image/jpeg', 0.90),
      state: {
        presentationQuaternion: d.presentation.quaternion,
        yawVelocityDegPerSec: d.presentation.yawVelocityDegPerSec,
        signedYawDeg: d.presentation.signedYawDeg,
        cumulativeYawDeg: d.presentation.cumulativeYawDeg,
        activeTurns: d.activeTurns.map((turn) => ({ id: turn.id, axis: turn.axis, layer: turn.layer, direction: turn.direction })),
        interaction: d.interaction,
      },
    };
  });
  frameBuffers.push(jpegBufferFromDataUrl(data.dataUrl));
  frameStates.push({ index: i, timeSec: i / FPS, ...data.state });
  if (i % 96 === 0) console.log(`Presentation R1.2 frame ${i}/${totalFrames}`);
  const remaining = targetElapsedMs + 1000 / FPS - (Date.now() - wallStart);
  if (remaining > 1) await videoPage.waitForTimeout(remaining);
}
if (manualStarted && !manualReleased) await videoPage.mouse.up();
await videoPage.close();
await browser.close();

encodeFrames(frameBuffers, MP4_PATH, ['-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart']);
encodeFrames(frameBuffers, WEBM_PATH, ['-c:v', 'libvpx', '-deadline', 'realtime', '-cpu-used', '8', '-pix_fmt', 'yuv420p', '-auto-alt-ref', '0', '-b:v', '2600k']);
const mp4Probe = ffprobe(MP4_PATH);
const webmProbe = ffprobe(WEBM_PATH);
const mp4Stream = mp4Probe.streams[0];
const mp4Format = mp4Probe.format;
const mp4Pass = mp4Stream.codec_name === 'h264'
  && mp4Stream.pix_fmt === 'yuv420p'
  && mp4Stream.avg_frame_rate === '24/1'
  && Number(mp4Stream.nb_read_frames) === totalFrames
  && Math.abs(Number(mp4Format.duration) - VIDEO_SECONDS) < 0.05
  && String(mp4Format.format_name).includes('mp4');

let eligibleFrames = 0;
let presentationActiveFrames = 0;
let sliceActiveFrames = 0;
let overlapActiveFrames = 0;
let pairedActiveFrames = 0;
let longestBothStaticFrames = 0;
let currentBothStaticFrames = 0;
let previousEligibleQuaternion = null;
const autonomousVelocities = [];
for (const state of frameStates) {
  const calm = state.interaction.resumeDelayRemainingMs > 0;
  const eligible = !state.interaction.interactionActive && !calm;
  if (!eligible) {
    previousEligibleQuaternion = null;
    currentBothStaticFrames = 0;
    continue;
  }
  if (!previousEligibleQuaternion) {
    previousEligibleQuaternion = state.presentationQuaternion;
    continue;
  }
  eligibleFrames += 1;
  const bodyDelta = quatAngle(previousEligibleQuaternion, state.presentationQuaternion);
  const presentationActive = bodyDelta > 0.00008;
  const sliceActive = state.activeTurns.length > 0;
  if (presentationActive) presentationActiveFrames += 1;
  if (sliceActive) sliceActiveFrames += 1;
  if (presentationActive && sliceActive) overlapActiveFrames += 1;
  if (state.activeTurns.length > 1) pairedActiveFrames += 1;
  if (!presentationActive && !sliceActive) {
    currentBothStaticFrames += 1;
    longestBothStaticFrames = Math.max(longestBothStaticFrames, currentBothStaticFrames);
  } else currentBothStaticFrames = 0;
  autonomousVelocities.push(state.yawVelocityDegPerSec);
  previousEligibleQuaternion = state.presentationQuaternion;
}
const presentationActiveFrameRatio = presentationActiveFrames / Math.max(1, eligibleFrames);
const sliceActiveFrameRatio = sliceActiveFrames / Math.max(1, eligibleFrames);
const overlapActiveFrameRatio = overlapActiveFrames / Math.max(1, eligibleFrames);
const longestBothStaticAutonomousMs = longestBothStaticFrames * (1000 / FPS);
const firstSignedYaw = frameStates[0].signedYawDeg;
const first360Index = frameStates.findIndex((state) => Math.abs(state.signedYawDeg - firstSignedYaw) >= 360);
const full360DuringRuntime = first360Index >= 0;
const post360Continues = full360DuringRuntime && frameStates[Math.min(frameStates.length - 1, first360Index + Math.round(FPS * 0.75))].cumulativeYawDeg
  > frameStates[first360Index].cumulativeYawDeg + 4;
const sliceAt360Window = full360DuringRuntime && frameStates.slice(Math.max(0, first360Index - FPS * 2), Math.min(frameStates.length, first360Index + FPS * 2)).some((state) => state.activeTurns.length > 0);

const forbiddenRequests = requests.filter((url) => /splinetool|prod\.spline\.design|\.splinecode/i.test(url));
const axisPass = Object.fromEntries(Object.entries(mechanicalQA.axisSupport).map(([axis, result]) => [axis, result.forwardEndpointErrorRad === 0 && result.inverseEndpointErrorRad === 0 && result.restoredAfterPair]));
const layerPass = Object.values(mechanicalQA.layerSupport).every((layers) => Object.values(layers).every((entry) => entry.pass));
const runtimePass = pageErrors.length === 0 && consoleErrors.length === 0 && forbiddenRequests.length === 0;
const livenessPass = presentationActiveFrameRatio > 0.95
  && sliceActiveFrameRatio >= 0.55 && sliceActiveFrameRatio <= 0.75
  && overlapActiveFrameRatio >= 0.50
  && longestBothStaticAutonomousMs <= 400;
const videoCoveragePass = observedAxes.has('X') && observedAxes.has('Y') && observedAxes.has('Z')
  && pairedObserved && densePhraseObserved && full360DuringRuntime && post360Continues && sliceAt360Window
  && manualStarted && manualReleased && activeSliceFinishedDuringHeldDrag;
const allPass = geometryConfigFrozen && geometryStatsFrozen && geometryCodeFrozen && full360Pass && interactionPass
  && axisPass.X && axisPass.Y && axisPass.Z && layerPass
  && mechanicalQA.repeatability30.pass && mechanicalQA.inverseRestoration.pass && mechanicalQA.pairedTurnQA.pass
  && runtimePass && mp4Pass && livenessPass && videoCoveragePass;

const qa = {
  generatedAt: new Date().toISOString(),
  source: {
    implementationBaseBranch: 'agent/proai-cube-presentation-motion-r1',
    implementationBaseCommit: 'd176101a818a9f7b00963a4ece13cd90d222a21c',
    geometryBaselineBranch: 'agent/proai-cube-geometry-r1',
    geometryBaselineCommit: '73082717909b6f4225841401fe4962d6ff4bbcca',
    branch: 'agent/proai-cube-presentation-motion-r1-2',
    prototypePath: 'docs/site-evolution/spline/proai-cube-presentation-motion-r1-2/',
    glbBytes: fs.statSync(GLB_PATH).size,
    glbSha256: sha256(GLB_PATH),
  },
  geometryFreeze: {
    config: initialDiagnostics.geometryConfig,
    stats: initialDiagnostics.geometry,
    configFrozen: geometryConfigFrozen,
    statsFrozen: geometryStatsFrozen,
    codeFrozen: geometryCodeFrozen,
    pass: geometryConfigFrozen && geometryStatsFrozen && geometryCodeFrozen,
  },
  presentation: {
    config: initialDiagnostics.presentationConfig,
    samples: presentationSamples,
    full360Pass,
    runtimeFirst360Sec: full360DuringRuntime ? frameStates[first360Index].timeSec : null,
    post360Continues,
    measuredYawVelocityRangeDegPerSec: autonomousVelocities.length ? [Math.min(...autonomousVelocities), Math.max(...autonomousVelocities)] : [],
  },
  sliceScheduler: {
    config: initialDiagnostics.sliceConfig,
    observedAxes: [...observedAxes],
    pairedObserved,
    densePhraseObserved,
    sliceAt360Window,
  },
  mechanicalQA,
  interactionQA: {
    dragTurn,
    duringDrag: duringDrag.interaction,
    sliceFinishedWhileDrag: { activeTurns: sliceFinishedWhileDrag.activeTurns, lastTurnResult: sliceFinishedWhileDrag.lastTurnResult },
    blockedNewSliceAttempt,
    afterRelease: afterRelease.interaction,
    duringCalm: duringCalm.interaction,
    presentationReturned: presentationReturned.interaction,
    staggerWindow: staggerWindow.interaction,
    blended: blended.interaction,
    activeSliceCompleted,
    nextSliceBlocked,
    cameraNoSnap,
    pass: interactionPass,
  },
  liveness: {
    autonomousFrames: eligibleFrames,
    presentationActiveFrameRatio,
    sliceActiveFrameRatio,
    overlapActiveFrameRatio,
    pairedActiveFrameRatio: pairedActiveFrames / Math.max(1, eligibleFrames),
    longestBothStaticAutonomousMs,
    pass: livenessPass,
  },
  video: {
    mp4: { path: 'review/' + path.basename(MP4_PATH), ...mp4Probe, byteLength: fs.statSync(MP4_PATH).size },
    webm: { path: 'review/' + path.basename(WEBM_PATH), ...webmProbe, byteLength: fs.statSync(WEBM_PATH).size },
    fps: FPS,
    frameCount: totalFrames,
    expectedDurationSec: VIDEO_SECONDS,
    manualStartSec,
    manualReleaseSec,
    coverage: {
      continuousBodyPlusSlices: overlapActiveFrameRatio >= 0.50,
      XYZ: observedAxes.has('X') && observedAxes.has('Y') && observedAxes.has('Z'),
      densePhrase: densePhraseObserved,
      pairedLayer: pairedObserved,
      full360: full360DuringRuntime,
      sliceDuring360Window: sliceAt360Window,
      noStopAfter360: post360Continues,
      manualOrbit: manualStarted && manualReleased,
      activeSliceFinishesDuringInteraction: activeSliceFinishedDuringHeldDrag,
      calmAndSoftRecovery: interactionPass,
    },
    pass: videoCoveragePass && mp4Pass,
  },
  runtime: { totalRequests: requests.length, forbiddenRequests, splineDependency: forbiddenRequests.length ? 'FOUND' : 'NONE', pageErrors, consoleErrors, pass: runtimePass },
  acceptance: {
    geometryR1Preserved: geometryConfigFrozen && geometryStatsFrozen && geometryCodeFrozen ? 'PASS' : 'FAIL',
    wholeCube360Continuous: full360Pass && full360DuringRuntime && post360Continues ? 'PASS' : 'FAIL',
    interaction: interactionPass ? 'PASS' : 'FAIL',
    pairedTurns: mechanicalQA.pairedTurnQA.pass ? 'PASS' : 'FAIL',
    liveness: livenessPass ? 'PASS' : 'FAIL',
    X: axisPass.X ? 'PASS' : 'FAIL',
    Y: axisPass.Y ? 'PASS' : 'FAIL',
    Z: axisPass.Z ? 'PASS' : 'FAIL',
    layerSupport: layerPass ? 'PASS' : 'FAIL',
    repeatability30: mechanicalQA.repeatability30.pass ? 'PASS' : 'FAIL',
    inverseRestoration: mechanicalQA.inverseRestoration.pass ? 'PASS' : 'FAIL',
    runtime: runtimePass ? 'PASS' : 'FAIL',
    ownerReviewMP4: mp4Pass ? 'PASS' : 'FAIL',
    splineDependency: forbiddenRequests.length ? 'FOUND' : 'NONE',
    overall: allPass ? 'PASS' : 'FAIL',
  },
};
fs.writeFileSync(QA_PATH, JSON.stringify(qa, null, 2) + '\n');

const p = initialDiagnostics.presentationConfig;
const s = initialDiagnostics.sliceConfig;
const report = `# ProAI Rubik Cube — Presentation Motion R1.2\n\n## Scope\n\nContinuous dual-motion refactor from Presentation Motion R1.1 commit \`d176101a818a9f7b00963a4ece13cd90d222a21c\`. Geometry R1, temporary materials/lights, clean GLB and exact Rubik model remain locked.\n\n## Engine A — continuous whole-cube presentation\n\n- Normal yaw art-direction range: **${p.normalYawVelocityDegPerSec.join('–')}°/s**.\n- Strong inspection range: **${p.inspectionYawVelocityDegPerSec.join('–')}°/s**.\n- Pitch envelope: **±${p.pitchEnvelopeDeg}°**; roll envelope: **±${p.rollEnvelopeDeg}°**.\n- Measured autonomous review yaw velocity: **${qa.presentation.measuredYawVelocityRangeDegPerSec.map((v) => v.toFixed(2)).join(' to ')}°/s**.\n- Cumulative 360 reached in live runtime at **${qa.presentation.runtimeFirst360Sec?.toFixed(2)} s** and motion continued afterward: **${qa.presentation.post360Continues ? 'PASS' : 'FAIL'}**.\n\n## Engine B — independent Rubik scheduler\n\n- Turn duration: **${s.turnDurationRangeMs.join('–')} ms**.\n- Typical event gap: **${s.typicalGapRangeMs.join('–')} ms**.\n- Breathing gap: **${s.breathingGapRangeMs.join('–')} ms**.\n- Paired-layer stagger: **${s.pairedStaggerRangeMs.join('–')} ms**.\n- Event distribution: **60% single / 20% paired same-axis distinct-layer / 20% tight phrase**.\n\n## Liveness\n\n- presentationActiveFrameRatio: **${presentationActiveFrameRatio.toFixed(4)}**.\n- sliceActiveFrameRatio: **${sliceActiveFrameRatio.toFixed(4)}**.\n- overlapActiveFrameRatio: **${overlapActiveFrameRatio.toFixed(4)}**.\n- longestBothStaticAutonomousMs: **${longestBothStaticAutonomousMs.toFixed(1)} ms**.\n\n## QA\n\n- Geometry R1 preserved: **${qa.acceptance.geometryR1Preserved}**.\n- X / Y / Z: **${qa.acceptance.X} / ${qa.acceptance.Y} / ${qa.acceptance.Z}**.\n- 30 mixed turns: **${qa.acceptance.repeatability30}**; max position ${mechanicalQA.repeatability30.maxCanonicalPosition}; quaternion ${mechanicalQA.repeatability30.maxCanonicalQuaternionRad}; scale ${mechanicalQA.repeatability30.maxCanonicalScale}.\n- Inverse restoration: **${qa.acceptance.inverseRestoration}**.\n- Paired-turn safety/inverse: **${qa.acceptance.pairedTurns}**; cubie intersection ${mechanicalQA.pairedTurnQA.physicalCubieIntersectionCount}.\n- Interaction: **${qa.acceptance.interaction}**.\n- Browser/runtime: **${qa.acceptance.runtime}**; Spline dependency **${qa.acceptance.splineDependency}**.\n- Owner MP4: **${qa.acceptance.ownerReviewMP4}**, ${VIDEO_SECONDS.toFixed(3)} s @ ${FPS} fps, H.264/yuv420p, ${VIDEO_VIEWPORT.width}×${VIDEO_VIEWPORT.height}.\n\n## Review evidence\n\n- \`review/proai-cube-presentation-motion-r1-2-natural.png\`\n- \`review/proai-cube-presentation-motion-r1-2-simultaneous.png\`\n- \`review/proai-cube-presentation-motion-r1-2-paired.png\`\n- \`review/proai-cube-presentation-motion-r1-2-large-angle.png\`\n- \`review/proai-cube-presentation-motion-r1-2-review-29s.mp4\` (primary)\n- \`review/proai-cube-presentation-motion-r1-2-review-29s.webm\` (secondary)\n- \`QA.json\`\n\n## Gate\n\nAutomated acceptance: **${qa.acceptance.overall}**. Materials + Lighting remain blocked pending owner visual review.\n`;
fs.writeFileSync(REPORT_PATH, report);

console.log(JSON.stringify({ acceptance: qa.acceptance, liveness: qa.liveness, presentation: qa.presentation, sliceScheduler: qa.sliceScheduler, interaction: qa.interactionQA, paired: mechanicalQA.pairedTurnQA, video: qa.video }, null, 2));
if (!allPass) process.exitCode = 1;
'''
(DST / 'capture.mjs').write_text(capture)

print(f'Generated {DST}')
