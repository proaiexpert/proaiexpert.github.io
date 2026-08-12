  const upLen = Math.max(1e-9, up2.length());
  const rightLen = Math.max(1e-9, right2.length());
  const uprightScore = (up2.y / upLen) * 1.45 + (right2.x / rightLen) * 0.75 - Math.abs(up2.x / upLen) * 0.20;
  return {
    faceKey,
    quarterTurns,
    orientationDeg: quarterTurns * 90,
    visibilityDot,
    projectedArea,
    uprightScore,
    determinant: basis.determinant,
    centerWorld: centerWorld.toArray(),
    normalWorld: normalWorld.toArray(),
  };
}

function chooseSemanticOrientation(faceKey) {
  const candidates = [0, 1, 2, 3].map((quarter) => semanticFaceProjection(faceKey, quarter));
  candidates.sort((a, b) => b.uprightScore - a.uprightScore);
  return { selected: candidates[0], candidates };
}

function selectSemanticFace(preferredFaceKey = null, relaxed = false) {
  if (!semanticFaceMetrics) return null;
  const threshold = relaxed ? -1 : SEMANTIC_R1.gates.entryVisibilityDot;
  const minArea = relaxed ? 0 : SEMANTIC_R1.gates.minProjectedArea;
  const candidates = Object.keys(SEMANTIC_FACE_DEFS).map((faceKey) => {
    const projection = semanticFaceProjection(faceKey, 0);
    const repeatPenalty = faceKey === semanticLastFaceKey ? 0.23 : 0;
    return { ...projection, score: projection.visibilityDot * 2.15 + Math.min(0.8, projection.projectedArea) - repeatPenalty };
  }).filter((item) => item.visibilityDot >= threshold && item.projectedArea >= minArea);
  if (!candidates.length) return null;
  candidates.sort((a, b) => b.score - a.score);
  if (preferredFaceKey) {
    const preferred = candidates.find((item) => item.faceKey === preferredFaceKey);
    if (preferred) return preferred;
  }
  if (candidates[0].faceKey === semanticLastFaceKey && candidates[1] && candidates[1].score >= candidates[0].score * 0.84) return candidates[1];
  return candidates[0];
}

function placeSemanticGroup(faceKey, quarterTurns) {
  const metric = semanticFaceMetrics[faceKey];
  const basis = semanticBasis(faceKey, quarterTurns);
  semanticDisplayGroup.position.copy(metric.position).addScaledVector(basis.normal, SEMANTIC_R1.faceOffset);
  semanticDisplayGroup.quaternion.copy(basis.quaternion);
  semanticDisplayGroup.scale.set(1, 1, 1);
  semanticSurface.scale.set(metric.displayWidth * 0.5, metric.displayHeight * 0.5, 1);
  const safeTextWidth = Math.min(metric.displayWidth * 0.91, metric.displayHeight * 3.65);
  semanticTextMesh.scale.set(safeTextWidth / 4, safeTextWidth / 4, 1);
  semanticTextMesh.position.set(0, 0, SEMANTIC_R1.textOffset);
  semanticDisplayGroup.updateMatrixWorld(true);
  return metric;
}

function applySemanticLookVariant(name = SEMANTIC_R1.selectedLook) {
  if (!Object.hasOwn(SEMANTIC_LOOK_VARIANTS, name)) return false;
  if (!captureMode && !reviewMode && name !== SEMANTIC_R1.selectedLook) return false;
  const spec = SEMANTIC_LOOK_VARIANTS[name];
  semanticSurfaceMaterial.color.set(spec.color);
  semanticSurfaceMaterial.metalness = spec.metalness;
  semanticSurfaceMaterial.roughness = spec.roughness;
  semanticSurfaceMaterial.clearcoat = spec.clearcoat;
  semanticSurfaceMaterial.clearcoatRoughness = spec.clearcoatRoughness;
  semanticSurfaceMaterial.envMapIntensity = spec.envMapIntensity;
  semanticSurfaceMaterial.needsUpdate = true;
  semanticActiveLook = name;
  return true;
}

function initializeSemanticDisplay() {
  const shape = roundedRectShape(2, 2, 0.035);
  const surfaceGeometry = new THREE.ShapeGeometry(shape, 16);
  semanticSurfaceMaterial = new THREE.MeshPhysicalMaterial({
    color: SEMANTIC_R1.displayMaterial.color,
    metalness: SEMANTIC_R1.displayMaterial.metalness,
    roughness: SEMANTIC_R1.displayMaterial.roughness,
    clearcoat: SEMANTIC_R1.displayMaterial.clearcoat,
    clearcoatRoughness: SEMANTIC_R1.displayMaterial.clearcoatRoughness,
    envMapIntensity: SEMANTIC_R1.displayMaterial.envMapIntensity,
    transparent: true,
    opacity: 0,
    depthTest: true,
    depthWrite: false,
    side: THREE.FrontSide,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
  semanticSurface = new THREE.Mesh(surfaceGeometry, semanticSurfaceMaterial);
  semanticSurface.name = 'SEMANTIC_UNIFIED_SURFACE';
  semanticSurface.renderOrder = 12;

  semanticTextCanvas = document.createElement('canvas');
  semanticTextCanvas.width = SEMANTIC_R1.text.textureWidth;
  semanticTextCanvas.height = SEMANTIC_R1.text.textureHeight;
  semanticTextContext = semanticTextCanvas.getContext('2d', { alpha: true, desynchronized: false });
  semanticTextTexture = new THREE.CanvasTexture(semanticTextCanvas);
  semanticTextTexture.colorSpace = THREE.SRGBColorSpace;
  semanticTextTexture.minFilter = THREE.LinearMipmapLinearFilter;
