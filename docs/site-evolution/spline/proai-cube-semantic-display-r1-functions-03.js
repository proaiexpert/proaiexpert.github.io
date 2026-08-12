  semanticTextTexture.magFilter = THREE.LinearFilter;
  semanticTextTexture.generateMipmaps = true;
  semanticTextTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  semanticTextMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: semanticTextTexture,
    transparent: true,
    opacity: 0,
    depthTest: true,
    depthWrite: false,
    side: THREE.FrontSide,
    toneMapped: true,
  });
  semanticTextMesh = new THREE.Mesh(new THREE.PlaneGeometry(4, 1), semanticTextMaterial);
  semanticTextMesh.name = 'SEMANTIC_UNIFIED_TEXT';
  semanticTextMesh.renderOrder = 13;

  semanticDisplayGroup = new THREE.Group();
  semanticDisplayGroup.name = 'SEMANTIC_DISPLAY_GROUP';
  semanticDisplayGroup.visible = false;
  semanticDisplayGroup.add(semanticSurface, semanticTextMesh);
  semanticBounds = buildSemanticFaceMetrics();
  sceneOne.add(semanticDisplayGroup);
  applySemanticLookVariant(SEMANTIC_R1.selectedLook);
  resolveSemanticFont();
  drawSemanticText(SEMANTIC_R1.sequences[semanticLanguage][0]);
  semanticNextOpportunityAt = performance.now() + SEMANTIC_R1.cadence.initialDelayMs;
  Promise.resolve(document.fonts?.ready).then(() => {
    resolveSemanticFont();
    drawSemanticText(SEMANTIC_R1.sequences[semanticLanguage][semanticSequenceIndex]);
    semanticReady = true;
    api.semanticReady = true;
  });
}

function applySemanticOpacity(surfaceOpacity, textOpacity) {
  semanticSurfaceOpacity = THREE.MathUtils.clamp(surfaceOpacity, 0, 1);
  semanticTextOpacity = THREE.MathUtils.clamp(textOpacity, 0, 1);
  semanticSurfaceMaterial.opacity = semanticSurfaceOpacity;
  semanticTextMaterial.opacity = semanticTextOpacity;
  semanticSurfaceMaterial.roughness = THREE.MathUtils.lerp(0.31, SEMANTIC_LOOK_VARIANTS[semanticActiveLook].roughness, smoothstep(semanticSurfaceOpacity));
  semanticDisplayGroup.visible = semanticSurfaceOpacity > 0.001 || semanticTextOpacity > 0.001;
}

function semanticTransitionAt(elapsedMs) {
  const t = SEMANTIC_R1.timings;
  const surfaceIn = smoothstep(elapsedMs / t.surfaceInMs);
  const textIn = smoothstep((elapsedMs - t.textDelayMs) / t.textInMs);
  const readableStart = Math.max(t.surfaceInMs, t.textDelayMs + t.textInMs);
  const holdEnd = readableStart + t.readableHoldMs;
  const textOutEnd = holdEnd + t.textOutMs;
  const surfaceOutStart = holdEnd + t.surfaceOutDelayMs;
  const surfaceOutEnd = surfaceOutStart + t.surfaceOutMs;
  let surfaceOpacity = surfaceIn;
  let textOpacity = textIn;
  if (elapsedMs >= holdEnd) textOpacity = 1 - smoothstep((elapsedMs - holdEnd) / t.textOutMs);
  if (elapsedMs >= surfaceOutStart) surfaceOpacity = 1 - smoothstep((elapsedMs - surfaceOutStart) / t.surfaceOutMs);
  return {
    surfaceOpacity: THREE.MathUtils.clamp(surfaceOpacity, 0, 1),
    textOpacity: THREE.MathUtils.clamp(textOpacity, 0, 1),
    readableStartMs: readableStart,
    holdEndMs: holdEnd,
    completeMs: Math.max(textOutEnd, surfaceOutEnd),
    fullyReadable: elapsedMs >= readableStart && elapsedMs < holdEnd,
  };
}

function beginSemanticEvent({ word = null, faceKey = null, now = performance.now(), source = 'runtime', relaxedFaceGate = false } = {}) {
  if (!api.ready || !semanticReady || activeTurns.size > 0 || interactionActive || semanticState.phase !== 'idle' || semanticReviewActive) return false;
  if (source === 'runtime') {
    if (prefersReducedMotion || !semanticSchedulerEnabled || now < semanticResumeAt || semanticBaseSliceBlocked()) return false;
    if (Math.abs(presentationYawVelocityDegPerSec) > SEMANTIC_R1.gates.entryMaxAbsYawDegPerSec) return false;
  }
  const selectedWord = word || SEMANTIC_R1.sequences[semanticLanguage][semanticSequenceIndex % SEMANTIC_R1.sequences[semanticLanguage].length];
  const face = selectSemanticFace(faceKey, relaxedFaceGate || source !== 'runtime');
  if (!face) return false;
  if (source === 'runtime' && (face.visibilityDot < SEMANTIC_R1.gates.entryVisibilityDot || face.projectedArea < SEMANTIC_R1.gates.minProjectedArea)) return false;
  const orientation = chooseSemanticOrientation(face.faceKey);
  placeSemanticGroup(face.faceKey, orientation.selected.quarterTurns);
  const fit = drawSemanticText(selectedWord);
  applySemanticOpacity(0, 0);
  semanticDisplayGroup.visible = true;
  semanticState = {
    phase: 'enter', source, word: selectedWord, faceKey: face.faceKey, quarterTurns: orientation.selected.quarterTurns,
    startAt: now, entryVisibilityDot: face.visibilityDot, entryProjectedArea: face.projectedArea,
    earlyExit: false, exitReason: null, readableStartedAt: null, readableAccumulatedMs: 0,
    fit,
  };
  semanticStats.semanticActivationCount += 1;
  semanticStats.minimumEntryFaceVisibilityDot = Math.min(semanticStats.minimumEntryFaceVisibilityDot, face.visibilityDot);
  semanticLastFaceKey = face.faceKey;
  if (!word) semanticSequenceIndex = (semanticSequenceIndex + 1) % SEMANTIC_R1.sequences[semanticLanguage].length;
  semanticNextOpportunityAt = now + semanticSeededRange(SEMANTIC_R1.cadence.opportunityMinMs, SEMANTIC_R1.cadence.opportunityMaxMs);
  semanticEventLog.push({ type: 'activate', time: now, word: selectedWord, faceKey: face.faceKey, entryVisibilityDot: face.visibilityDot, orientationDeg: orientation.selected.orientationDeg });
  return { word: selectedWord, faceKey: face.faceKey, entryVisibilityDot: face.visibilityDot, projectedArea: face.projectedArea, orientation: orientation.selected, fit };
}

function requestSemanticExit(reason = 'visibility', now = performance.now(), fast = false) {
  if (semanticState.phase === 'idle' && !semanticReviewActive) return false;
  if (semanticState.phase === 'exitFast') return true;
