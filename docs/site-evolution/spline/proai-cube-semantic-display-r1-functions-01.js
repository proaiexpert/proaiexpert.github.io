  const safeWidth = SEMANTIC_R1.text.textureWidth * SEMANTIC_R1.text.safeWidthRatio;
  const safeHeight = SEMANTIC_R1.text.textureHeight * SEMANTIC_R1.text.safeHeightRatio;
  let low = SEMANTIC_R1.text.minFontPx;
  let high = SEMANTIC_R1.text.maxFontPx;
  let best = low;
  for (let i = 0; i < 14; i += 1) {
    const size = (low + high) * 0.5;
    setSemanticCanvasFont(size);
    const metrics = semanticTextContext.measureText(word);
    const height = (metrics.actualBoundingBoxAscent || size * 0.72) + (metrics.actualBoundingBoxDescent || size * 0.18);
    if (metrics.width <= safeWidth && height <= safeHeight) {
      best = size;
      low = size;
    } else {
      high = size;
    }
  }
  const finalSize = Math.floor(best * 10) / 10;
  setSemanticCanvasFont(finalSize);
  const metrics = semanticTextContext.measureText(word);
  const measuredHeight = (metrics.actualBoundingBoxAscent || finalSize * 0.72) + (metrics.actualBoundingBoxDescent || finalSize * 0.18);
  const clipping = metrics.width > safeWidth + 0.5 || measuredHeight > safeHeight + 0.5;
  const glyphCoverage = [...word].every((char) => char === ' ' || semanticTextContext.measureText(char).width > 0)
    && (!document.fonts?.check || document.fonts.check(`${SEMANTIC_R1.text.fontWeight} ${Math.round(finalSize)}px ${semanticFontStack}`, word));
  return {
    word,
    requestedFontStack: SEMANTIC_R1.text.requestedFontStack,
    resolvedFont: semanticResolvedFont,
    fontSizePx: finalSize,
    measuredWidthPx: metrics.width,
    measuredHeightPx: measuredHeight,
    safeWidthPx: safeWidth,
    safeHeightPx: safeHeight,
    clipping,
    glyphCoverage: Boolean(glyphCoverage),
  };
}

function drawSemanticText(word) {
  const fit = fitSemanticText(word);
  semanticTextContext.clearRect(0, 0, SEMANTIC_R1.text.textureWidth, SEMANTIC_R1.text.textureHeight);
  setSemanticCanvasFont(fit.fontSizePx);
  semanticTextContext.fillStyle = SEMANTIC_R1.text.color;
  semanticTextContext.globalAlpha = 1;
  semanticTextContext.fillText(word, SEMANTIC_R1.text.textureWidth * 0.5, SEMANTIC_R1.text.textureHeight * 0.5 + fit.fontSizePx * 0.018);
  semanticTextTexture.needsUpdate = true;
  semanticCurrentFit = fit;
  return fit;
}

function runSemanticStringFitQA() {
  const result = { en: [], ru: [], textClipCount: 0, missingGlyphCount: 0, pass: true };
  for (const lang of ['en', 'ru']) {
    for (const word of SEMANTIC_R1.sequences[lang]) {
      const fit = fitSemanticText(word);
      result[lang].push(fit);
      if (fit.clipping) result.textClipCount += 1;
      if (!fit.glyphCoverage) result.missingGlyphCount += 1;
    }
  }
  result.pass = result.textClipCount === 0 && result.missingGlyphCount === 0;
  if (semanticState.word) drawSemanticText(semanticState.word);
  return result;
}

function semanticFaceProjection(faceKey, quarterTurns = 0) {
  const metric = semanticFaceMetrics?.[faceKey];
  if (!metric) return null;
  sceneOne.updateMatrixWorld(true);
  camera.updateMatrixWorld(true);
  const basis = semanticBasis(faceKey, quarterTurns);
  const centerLocal = metric.position.clone().addScaledVector(basis.normal, SEMANTIC_R1.faceOffset);
  const localMatrix = new THREE.Matrix4().compose(centerLocal, basis.quaternion, new THREE.Vector3(1, 1, 1));
  const worldMatrix = new THREE.Matrix4().multiplyMatrices(sceneOne.matrixWorld, localMatrix);
  const centerWorld = new THREE.Vector3(0, 0, 0).applyMatrix4(worldMatrix);
  const rightWorld = new THREE.Vector3(1, 0, 0).transformDirection(worldMatrix);
  const upWorld = new THREE.Vector3(0, 1, 0).transformDirection(worldMatrix);
  const normalWorld = new THREE.Vector3(0, 0, 1).applyMatrix3(new THREE.Matrix3().getNormalMatrix(worldMatrix)).normalize();
  const toCamera = camera.position.clone().sub(centerWorld).normalize();
  const visibilityDot = normalWorld.dot(toCamera);
  const halfW = metric.displayWidth * 0.5;
  const halfH = metric.displayHeight * 0.5;
  const points = [
    new THREE.Vector3(-halfW, -halfH, 0),
    new THREE.Vector3(halfW, -halfH, 0),
    new THREE.Vector3(halfW, halfH, 0),
    new THREE.Vector3(-halfW, halfH, 0),
  ].map((p) => p.applyMatrix4(worldMatrix).project(camera));
  let projectedArea = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    projectedArea += a.x * b.y - b.x * a.y;
  }
  projectedArea = Math.abs(projectedArea) * 0.5;
  const c = centerWorld.clone().project(camera);
  const sampleDistance = Math.min(metric.displayWidth, metric.displayHeight) * 0.24;
  const u = new THREE.Vector3(0, sampleDistance, 0).applyMatrix4(worldMatrix).project(camera);
  const r = new THREE.Vector3(sampleDistance, 0, 0).applyMatrix4(worldMatrix).project(camera);
  const up2 = new THREE.Vector2(u.x - c.x, u.y - c.y);
  const right2 = new THREE.Vector2(r.x - c.x, r.y - c.y);
