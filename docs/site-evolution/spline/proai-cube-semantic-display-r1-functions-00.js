function semanticSeededUnit() {
  let x = semanticSeed >>> 0;
  x ^= (x << 13) >>> 0;
  x ^= x >>> 17;
  x ^= (x << 5) >>> 0;
  semanticSeed = x >>> 0;
  return semanticSeed / 4294967296;
}

function semanticSeededRange(min, max) {
  return min + (max - min) * semanticSeededUnit();
}

function semanticBaseSliceBlocked() {
  return interactionActive || performance.now() < sliceResumeAt;
}

function semanticBlocksNewSlices() {
  return semanticState.phase !== 'idle' || semanticReviewActive || performance.now() < semanticSliceResumeAt;
}

function semanticBasis(faceKey, quarterTurns = 0) {
  const def = SEMANTIC_FACE_DEFS[faceKey];
  if (!def) throw new Error(`Unsupported semantic face ${faceKey}`);
  const normal = new THREE.Vector3(...def.normal).normalize();
  const up = new THREE.Vector3(...def.up).normalize();
  let right = up.clone().cross(normal).normalize();
  let correctedUp = normal.clone().cross(right).normalize();
  const angle = quarterTurns * Math.PI * 0.5;
  if (quarterTurns) {
    right = right.applyAxisAngle(normal, angle).normalize();
    correctedUp = correctedUp.applyAxisAngle(normal, angle).normalize();
  }
  const matrix = new THREE.Matrix4().makeBasis(right, correctedUp, normal);
  const quaternion = new THREE.Quaternion().setFromRotationMatrix(matrix).normalize();
  return { normal, right, up: correctedUp, quaternion, determinant: right.clone().cross(correctedUp).dot(normal) };
}

function mechanicalBoundsInSceneOne() {
  sceneOne.updateMatrixWorld(true);
  const inverse = sceneOne.matrixWorld.clone().invert();
  const bounds = new THREE.Box3().makeEmpty();
  cubeRoot.traverse((object) => {
    if (!object.isMesh || object.name === 'Plane' || !object.visible || !object.geometry) return;
    object.geometry.computeBoundingBox();
    const box = object.geometry.boundingBox;
    if (!box) return;
    object.updateMatrixWorld(true);
    for (const x of [box.min.x, box.max.x]) {
      for (const y of [box.min.y, box.max.y]) {
        for (const z of [box.min.z, box.max.z]) {
          const p = new THREE.Vector3(x, y, z).applyMatrix4(object.matrixWorld).applyMatrix4(inverse);
          bounds.expandByPoint(p);
        }
      }
    }
  });
  return bounds;
}

function buildSemanticFaceMetrics() {
  const bounds = mechanicalBoundsInSceneOne();
  const min = bounds.min.clone();
  const max = bounds.max.clone();
  const center = bounds.getCenter(new THREE.Vector3());
  const span = bounds.getSize(new THREE.Vector3());
  const make = (faceKey, position, width, height) => ({
    faceKey,
    position,
    width,
    height,
    displayWidth: width * SEMANTIC_R1.displayInsetRatio,
    displayHeight: height * SEMANTIC_R1.displayInsetRatio,
  });
  semanticFaceMetrics = {
    '+X': make('+X', new THREE.Vector3(max.x, center.y, center.z), span.z, span.y),
    '-X': make('-X', new THREE.Vector3(min.x, center.y, center.z), span.z, span.y),
    '+Y': make('+Y', new THREE.Vector3(center.x, max.y, center.z), span.x, span.z),
    '-Y': make('-Y', new THREE.Vector3(center.x, min.y, center.z), span.x, span.z),
    '+Z': make('+Z', new THREE.Vector3(center.x, center.y, max.z), span.x, span.y),
    '-Z': make('-Z', new THREE.Vector3(center.x, center.y, min.z), span.x, span.y),
  };
  return { min: min.toArray(), max: max.toArray(), span: span.toArray(), faces: Object.fromEntries(Object.entries(semanticFaceMetrics).map(([k, v]) => [k, { width: v.width, height: v.height, displayWidth: v.displayWidth, displayHeight: v.displayHeight, position: v.position.toArray() }])) };
}

function resolveSemanticFont() {
  const interAvailable = Boolean(document.fonts?.check?.('700 64px Inter', 'AI EXPERT ДОВЕРИЕ'));
  semanticResolvedFont = interAvailable ? 'Inter' : 'system-ui';
  semanticFontStack = SEMANTIC_R1.text.requestedFontStack;
  return semanticResolvedFont;
}

function setSemanticCanvasFont(sizePx) {
  semanticTextContext.font = `${SEMANTIC_R1.text.fontWeight} ${sizePx}px ${semanticFontStack}`;
  semanticTextContext.textAlign = 'center';
  semanticTextContext.textBaseline = 'middle';
}

function fitSemanticText(word) {
  if (!semanticTextContext) throw new Error('Semantic text context not initialized');
