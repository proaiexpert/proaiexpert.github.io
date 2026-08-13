}

function setReviewSemanticVisual(surfaceOpacity, textOpacity, renderFrame = true) {
  if (!captureMode || !semanticReviewActive) return false;
  applySemanticOpacity(surfaceOpacity, textOpacity);
  if (renderFrame) renderReviewFrame();
  return getSemanticDiagnostics();
}

function clearReviewSemantic(renderFrame = true) {
  if (!captureMode) return false;
  applySemanticOpacity(0, 0);
  semanticDisplayGroup.visible = false;
  semanticReviewActive = false;
  semanticState = { phase: 'idle', word: null, faceKey: null, earlyExit: false, readableAccumulatedMs: 0 };
  if (renderFrame) renderReviewFrame();
  return true;
}

function advanceReviewSemanticExit(elapsedMs, renderFrame = true) {
  if (!(captureMode || reviewMode) || semanticState.phase !== 'exitFast') return false;
  const p = smoothstep(elapsedMs / SEMANTIC_R1.timings.interactionExitMs);
  applySemanticOpacity(semanticState.exitSurfaceFrom * (1 - p), semanticState.exitTextFrom * (1 - p));
  if (p >= 1) completeSemanticEvent(performance.now());
  if (renderFrame) renderReviewFrame();
  return getSemanticDiagnostics();
}

function beginSemanticQA(word = 'TRUST') {
  if (!(reviewMode || captureMode) || !api.ready || !semanticReady) return false;
  return beginSemanticEvent({ word, source: 'qa', relaxedFaceGate: true });
}

function runSemanticFaceAnchorQA() {
  const faces = {};
  let mirroredTextCount = 0;
  for (const faceKey of Object.keys(SEMANTIC_FACE_DEFS)) {
    const base = semanticBasis(faceKey, 0);
    const orientation = chooseSemanticOrientation(faceKey);
    const selectedBasis = semanticBasis(faceKey, orientation.selected.quarterTurns);
    const expectedNormal = new THREE.Vector3(...SEMANTIC_FACE_DEFS[faceKey].normal).normalize();
    const normalError = selectedBasis.normal.angleTo(expectedNormal);
    const mirrored = selectedBasis.determinant < 0.999999;
    if (mirrored) mirroredTextCount += 1;
    faces[faceKey] = {
      normal: selectedBasis.normal.toArray(),
      expectedNormal: expectedNormal.toArray(),
      normalErrorRad: normalError,
      determinant: selectedBasis.determinant,
      mirrored,
      selectedOrientationDeg: orientation.selected.orientationDeg,
      uprightScore: orientation.selected.uprightScore,
      stableParent: semanticDisplayGroup.parent === sceneOne,
      backfaceTextDisabled: semanticTextMaterial.side === THREE.FrontSide,
      pass: normalError < 1e-9 && !mirrored && semanticDisplayGroup.parent === sceneOne && semanticTextMaterial.side === THREE.FrontSide,
    };
  }
  return { faces, mirroredTextCount, pass: mirroredTextCount === 0 && Object.values(faces).every((face) => face.pass) };
}

function getSemanticDiagnostics() {
  const currentFace = semanticCurrentFaceMetrics();
  const averageReadableHoldMs = semanticStats.readableEventCount ? semanticStats.totalReadableHoldMs / semanticStats.readableEventCount : 0;
  const semanticBodyActiveFrameRatio = semanticStats.semanticFrames ? semanticStats.bodyActiveFrames / semanticStats.semanticFrames : 1;
  return {
    ready: semanticReady,
    language: semanticLanguage,
    config: SEMANTIC_R1,
    phase: semanticState.phase,
    word: semanticState.word,
    faceKey: semanticState.faceKey,
    quarterTurns: semanticState.quarterTurns ?? null,
    orientationDeg: semanticState.quarterTurns != null ? semanticState.quarterTurns * 90 : null,
    surfaceOpacity: semanticSurfaceOpacity,
    textOpacity: semanticTextOpacity,
    currentFit: semanticCurrentFit,
    currentFace,
    activeLook: semanticActiveLook,
    bounds: semanticBounds,
    scheduler: {
      enabled: semanticSchedulerEnabled,
      sequenceIndex: semanticSequenceIndex,
      nextOpportunityAt: semanticNextOpportunityAt,
      resumeAt: semanticResumeAt,
      sliceResumeAt: semanticSliceResumeAt,
      reducedMotionAutomaticCycling: prefersReducedMotion ? false : semanticSchedulerEnabled,
    },
    stats: {
      ...semanticStats,
      minimumEntryFaceVisibilityDot: Number.isFinite(semanticStats.minimumEntryFaceVisibilityDot) ? semanticStats.minimumEntryFaceVisibilityDot : null,
      minimumActiveFaceVisibilityDot: Number.isFinite(semanticStats.minimumActiveFaceVisibilityDot) ? semanticStats.minimumActiveFaceVisibilityDot : null,
      semanticBodyActiveFrameRatio,
      averageReadableHoldMs,
    },
    eventLog: [...semanticEventLog],
  };
}
