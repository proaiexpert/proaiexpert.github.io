  semanticState = {
    ...semanticState,
    phase: fast ? 'exitFast' : 'exitEarly',
    earlyExit: true,
    exitReason: reason,
    exitStartedAt: now,
    exitSurfaceFrom: semanticSurfaceOpacity,
    exitTextFrom: semanticTextOpacity,
  };
  semanticEventLog.push({ type: 'early-exit', time: now, reason, word: semanticState.word, faceKey: semanticState.faceKey });
  return true;
}

function completeSemanticEvent(now = performance.now()) {
  const wasEarly = Boolean(semanticState.earlyExit);
  const readableMs = semanticState.readableAccumulatedMs || 0;
  if (wasEarly) semanticStats.semanticEarlyExitCount += 1;
  else semanticStats.semanticCompletedCount += 1;
  semanticStats.totalReadableHoldMs += readableMs;
  semanticStats.readableEventCount += readableMs > 0 ? 1 : 0;
  semanticEventLog.push({ type: 'complete', time: now, word: semanticState.word, faceKey: semanticState.faceKey, earlyExit: wasEarly, readableMs });
  applySemanticOpacity(0, 0);
  semanticDisplayGroup.visible = false;
  semanticReviewActive = false;
  semanticState = { phase: 'idle', word: null, faceKey: null, earlyExit: false, readableAccumulatedMs: 0 };
  semanticSliceResumeAt = now + SEMANTIC_R1.timings.sliceResumeOffsetMs;
  return true;
}

function semanticCurrentFaceMetrics() {
  if (!semanticState.faceKey) return null;
  return semanticFaceProjection(semanticState.faceKey, semanticState.quarterTurns || 0);
}

function updateSemanticRuntime(now) {
  if (!api.ready || !semanticReady) return;
  if (semanticState.phase !== 'idle') {
    const current = semanticCurrentFaceMetrics();
    if (current) {
      semanticStats.minimumActiveFaceVisibilityDot = Math.min(semanticStats.minimumActiveFaceVisibilityDot, current.visibilityDot);
      if (!interactionActive && semanticState.source === 'runtime'
        && (current.visibilityDot < SEMANTIC_R1.gates.activeExitVisibilityDot
          || current.projectedArea < SEMANTIC_R1.gates.minActiveProjectedArea
          || Math.abs(presentationYawVelocityDegPerSec) > SEMANTIC_R1.gates.earlyExitMaxAbsYawDegPerSec)) {
        requestSemanticExit('readability-gate', now, false);
      }
    }
    semanticStats.semanticFrames += 1;
    if (!interactionActive) {
      const delta = semanticLastBodyQuaternion.angleTo(presentationRig.quaternion);
      if (delta > 1e-7) semanticStats.bodyActiveFrames += 1;
    }
    semanticLastBodyQuaternion.copy(presentationRig.quaternion);

    if (semanticState.phase === 'exitFast' || semanticState.phase === 'exitEarly') {
      const duration = semanticState.phase === 'exitFast' ? SEMANTIC_R1.timings.interactionExitMs : Math.max(SEMANTIC_R1.timings.textOutMs, SEMANTIC_R1.timings.surfaceOutMs);
      const p = smoothstep((now - semanticState.exitStartedAt) / duration);
      applySemanticOpacity(semanticState.exitSurfaceFrom * (1 - p), semanticState.exitTextFrom * (1 - p));
      if (p >= 1) completeSemanticEvent(now);
      return;
    }

    const elapsed = now - semanticState.startAt;
    const transition = semanticTransitionAt(elapsed);
    applySemanticOpacity(transition.surfaceOpacity, transition.textOpacity);
    if (transition.fullyReadable) {
      if (!semanticState.readableStartedAt) semanticState.readableStartedAt = now;
      semanticState.readableAccumulatedMs = Math.min(SEMANTIC_R1.timings.readableHoldMs, Math.max(0, now - semanticState.readableStartedAt));
      semanticState.phase = 'hold';
    } else if (elapsed >= transition.holdEndMs) {
      semanticState.phase = 'exit';
      semanticState.readableAccumulatedMs = Math.max(semanticState.readableAccumulatedMs || 0, SEMANTIC_R1.timings.readableHoldMs);
    }
    if (elapsed >= transition.completeMs) completeSemanticEvent(now);
    return;
  }

  if (captureMode || reviewMode || prefersReducedMotion || !semanticSchedulerEnabled) return;
  if (interactionActive || now < semanticResumeAt || now < semanticNextOpportunityAt || activeTurns.size > 0 || semanticBaseSliceBlocked()) return;
  if (Math.abs(presentationYawVelocityDegPerSec) > SEMANTIC_R1.gates.entryMaxAbsYawDegPerSec) return;
  beginSemanticEvent({ now, source: 'runtime' });
}

function prepareReviewSemantic(word, preferredFaceKey = null) {
  if (!captureMode || !api.ready || !semanticReady || activeTurns.size > 0) return false;
  const face = selectSemanticFace(preferredFaceKey, true);
  if (!face) return false;
  const orientation = chooseSemanticOrientation(face.faceKey);
  placeSemanticGroup(face.faceKey, orientation.selected.quarterTurns);
  const fit = drawSemanticText(word);
  semanticReviewActive = true;
  semanticLastFaceKey = face.faceKey;
  semanticState = {
    phase: 'review', source: 'review', word, faceKey: face.faceKey, quarterTurns: orientation.selected.quarterTurns,
    startAt: performance.now(), entryVisibilityDot: face.visibilityDot, entryProjectedArea: face.projectedArea,
    earlyExit: false, exitReason: null, readableAccumulatedMs: 0, fit,
  };
  semanticDisplayGroup.visible = true;
  applySemanticOpacity(0, 0);
  return { word, faceKey: face.faceKey, entryVisibilityDot: face.visibilityDot, projectedArea: face.projectedArea, orientation: orientation.selected, fit };
