import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = path.join(ROOT, 'base-runtime.js');
const OUTPUT = path.join(ROOT, 'runtime-r2.js');
let source = fs.readFileSync(SOURCE, 'utf8');

function replaceOnce(needle, replacement, label) {
  const first = source.indexOf(needle);
  if (first < 0) throw new Error('R2 patch anchor missing: ' + label);
  if (source.indexOf(needle, first + needle.length) >= 0) throw new Error('R2 patch anchor not unique: ' + label);
  source = source.slice(0, first) + replacement + source.slice(first + needle.length);
}

const semanticBlock = `let lastPresentationQuaternion = new THREE.Quaternion();

// Semantic Brand Moment R2 — temporal gate only. All R1.2 numeric motion configuration above remains frozen.
const R2_TIME = { timeScale: 1, blockNewSlices: false };
let r2SchedulerDelayRemainingMs = 0;
let r2Semantic = null;

function r2Smootherstep(value) {
  const x = THREE.MathUtils.clamp(value, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

function r2SetTimeControl({ timeScale = 1, blockNewSlices = false } = {}) {
  R2_TIME.timeScale = THREE.MathUtils.clamp(Number(timeScale) || 0, 0, 1);
  R2_TIME.blockNewSlices = Boolean(blockNewSlices);
  return { ...R2_TIME };
}

function r2TrackedWidth(ctx, text, trackingPx) {
  const glyphs = [...text];
  return glyphs.reduce((sum, glyph) => sum + ctx.measureText(glyph).width, 0) + Math.max(0, glyphs.length - 1) * trackingPx;
}

function r2DrawTrackedText(ctx, text, centerX, baselineY, trackingPx) {
  const glyphs = [...text];
  const width = r2TrackedWidth(ctx, text, trackingPx);
  let x = centerX - width * 0.5;
  for (const glyph of glyphs) {
    ctx.fillText(glyph, x, baselineY);
    x += ctx.measureText(glyph).width + trackingPx;
  }
}

function r2RoundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width * 0.5, height * 0.5);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function r2FitFont(ctx, text, targetWidth, family, weight, trackingEm, scale = 1) {
  let low = 64;
  let high = 520;
  for (let i = 0; i < 18; i += 1) {
    const mid = (low + high) * 0.5;
    ctx.font = weight + ' ' + (mid * scale) + 'px "' + family + '"';
    const width = r2TrackedWidth(ctx, text, mid * scale * trackingEm);
    if (width < targetWidth) low = mid; else high = mid;
  }
  return low * scale;
}

function r2TextGeometry(ctx, width, height) {
  const family = 'Instrument Sans';
  const weight = 600;
  const targetWidth = width * 0.72;
  const expertPx = r2FitFont(ctx, 'Expert', targetWidth, family, weight, 0.0, 1);
  const proPx = expertPx * 1.035;
  ctx.font = weight + ' ' + expertPx + 'px "' + family + '"';
  const expertMetrics = ctx.measureText('Expert');
  ctx.font = weight + ' ' + proPx + 'px "' + family + '"';
  const proMetrics = ctx.measureText('ProAI');
  const expertCap = expertMetrics.actualBoundingBoxAscent || expertPx * 0.72;
  const proCap = proMetrics.actualBoundingBoxAscent || proPx * 0.72;
  const averageCap = (expertCap + proCap) * 0.5;
  const lineGap = averageCap * 0.105;
  const blockHeight = proCap + lineGap + expertCap;
  const centerX = width * (0.5 + 0.006);
  const centerY = height * (0.5 - 0.004);
  const proBaseline = centerY - blockHeight * 0.5 + proCap;
  const expertBaseline = proBaseline + lineGap + expertCap;
  return { family, weight, targetWidth, expertPx, proPx, expertCap, proCap, lineGap, blockHeight, centerX, centerY, proBaseline, expertBaseline };
}

function r2DrawSemanticTexture() {
  if (!r2Semantic) return;
  const { canvas, ctx, maskCanvas, maskCtx, texture, state } = r2Semantic;
  const width = canvas.width;
  const height = canvas.height;
  const surface = THREE.MathUtils.clamp(state.surface, 0, 1);
  const text = THREE.MathUtils.clamp(state.text, 0, 1);
  const specular = THREE.MathUtils.clamp(state.specular, 0, 1);
  ctx.clearRect(0, 0, width, height);
  maskCtx.clearRect(0, 0, width, height);

  if (surface > 0.0001) {
    const pad = width * 0.008;
    const grad = ctx.createLinearGradient(width * 0.16, height * 0.10, width * 0.84, height * 0.90);
    grad.addColorStop(0, 'rgba(29,36,44,0.96)');
    grad.addColorStop(0.48, 'rgba(19,25,32,0.98)');
    grad.addColorStop(1, 'rgba(17,22,28,0.96)');
    ctx.save();
    ctx.globalAlpha = 0.80 * r2Smootherstep(surface);
    r2RoundRect(ctx, pad, pad, width - pad * 2, height - pad * 2, width * 0.038);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.globalCompositeOperation = 'destination-in';
    const feather = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.39, width * 0.5, height * 0.5, width * 0.72);
    feather.addColorStop(0, 'rgba(255,255,255,1)');
    feather.addColorStop(0.86, 'rgba(255,255,255,0.995)');
    feather.addColorStop(1, 'rgba(255,255,255,0.80)');
    ctx.fillStyle = feather;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  if (text > 0.0001) {
    const geometry = r2TextGeometry(maskCtx, width, height);
    r2Semantic.layout = { family: geometry.family, weight: geometry.weight, lockupWidthPct: 72, lockupHeightPct: geometry.blockHeight / height * 100, lineGapPctCap: 10.5, proAIScale: 1.035, expertScale: 1, proAITrackingEm: 0.012, expertTrackingEm: 0, opticalXPct: 0.6, opticalYPct: -0.4 };
    const formation = r2Smootherstep(text);
    const early = Math.pow(text, 0.58);
    maskCtx.save();
    maskCtx.textBaseline = 'alphabetic';
    maskCtx.fillStyle = '#fff';
    maskCtx.font = geometry.weight + ' ' + geometry.proPx + 'px "' + geometry.family + '"';
    r2DrawTrackedText(maskCtx, 'ProAI', geometry.centerX, geometry.proBaseline, geometry.proPx * 0.012);
    maskCtx.font = geometry.weight + ' ' + geometry.expertPx + 'px "' + geometry.family + '"';
    r2DrawTrackedText(maskCtx, 'Expert', geometry.centerX, geometry.expertBaseline, 0);
    maskCtx.restore();

    ctx.save();
    ctx.globalAlpha = 0.22 * early;
    ctx.filter = 'blur(' + ((1 - formation) * 9.5 + 1.2) + 'px)';
    ctx.drawImage(maskCanvas, 0, 0);
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = '#87909a';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.18 + 0.82 * formation;
    ctx.drawImage(maskCanvas, 0, 0);
    ctx.globalCompositeOperation = 'source-in';
    const pearl = ctx.createLinearGradient(0, geometry.centerY - geometry.blockHeight * 0.62, 0, geometry.centerY + geometry.blockHeight * 0.68);
    pearl.addColorStop(0, '#F5F7F8');
    pearl.addColorStop(0.24, '#E2E6EA');
    pearl.addColorStop(0.57, '#CBD1D7');
    pearl.addColorStop(1, '#AAB1BA');
    ctx.fillStyle = pearl;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.33 * formation;
    ctx.filter = 'blur(0.45px)';
    ctx.drawImage(maskCanvas, 0, -2.2);
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    if (specular > 0.0001) {
      const sweep = specular;
      const center = width * (-0.08 + 1.16 * sweep);
      ctx.save();
      ctx.globalAlpha = 0.62 * Math.sin(Math.PI * sweep);
      ctx.drawImage(maskCanvas, 0, 0);
      ctx.globalCompositeOperation = 'source-in';
      const shine = ctx.createLinearGradient(center - width * 0.14, 0, center + width * 0.14, height);
      shine.addColorStop(0, 'rgba(245,247,248,0)');
      shine.addColorStop(0.42, 'rgba(245,247,248,0.04)');
      shine.addColorStop(0.50, 'rgba(255,255,255,0.98)');
      shine.addColorStop(0.58, 'rgba(245,247,248,0.08)');
      shine.addColorStop(1, 'rgba(245,247,248,0)');
      ctx.fillStyle = shine;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }

  texture.needsUpdate = true;
}

function r2InitSemanticSurface(face = '-X') {
  if (!api.ready) return false;
  if (r2Semantic?.mesh) return true;
  if (face !== '-X') throw new Error('Semantic Brand Moment R2 is locked to the selected -X face');
  const width = (latticeCenters.Z[2] - latticeCenters.Z[0]) + GEOMETRY_R1.faceOuterSize;
  const height = (latticeCenters.Y[2] - latticeCenters.Y[0]) + GEOMETRY_R1.faceOuterSize;
  const canvas2d = document.createElement('canvas');
  canvas2d.width = 1536;
  canvas2d.height = 1536;
  const ctx2d = canvas2d.getContext('2d', { alpha: true });
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = canvas2d.width;
  maskCanvas.height = canvas2d.height;
  const maskCtx = maskCanvas.getContext('2d', { alpha: true });
  const texture = new THREE.CanvasTexture(canvas2d);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const material = new THREE.MeshPhysicalMaterial({
    map: texture,
    color: 0xffffff,
    transparent: true,
    opacity: 1,
    metalness: 0.86,
    roughness: 0.24,
    clearcoat: 0.18,
    clearcoatRoughness: 0.16,
    envMapIntensity: 1.24,
    side: THREE.FrontSide,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -2,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  mesh.name = 'R2_SEMANTIC_BRAND_FACE_-X';
  mesh.position.set(latticeCenters.X[0] - GEOMETRY_R1.faceOuterSize * 0.5 - 0.42, cubeCenterLocal.y, cubeCenterLocal.z);
  mesh.rotation.y = -Math.PI * 0.5;
  mesh.renderOrder = 12;
  mesh.frustumCulled = false;
  sceneOne.add(mesh);
  r2Semantic = {
    face, width, height, canvas: canvas2d, ctx: ctx2d, maskCanvas, maskCtx, texture, material, mesh,
    state: { surface: 0, text: 0, specular: 0 },
  };
  r2DrawSemanticTexture();
  return true;
}

function r2SetSemanticState({ surface = 0, text = 0, specular = 0 } = {}) {
  if (!r2Semantic) return false;
  r2Semantic.state.surface = THREE.MathUtils.clamp(surface, 0, 1);
  r2Semantic.state.text = THREE.MathUtils.clamp(text, 0, 1);
  r2Semantic.state.specular = THREE.MathUtils.clamp(specular, 0, 1);
  r2DrawSemanticTexture();
  return { ...r2Semantic.state };
}

function r2SemanticInfo() {
  if (!r2Semantic?.mesh || !api.ready) return null;
  sceneOne.updateMatrixWorld(true);
  r2Semantic.mesh.updateMatrixWorld(true);
  camera.updateMatrixWorld(true);
  const center = new THREE.Vector3();
  r2Semantic.mesh.getWorldPosition(center);
  const normal = new THREE.Vector3(0, 0, 1).transformDirection(r2Semantic.mesh.matrixWorld).normalize();
  const toCamera = camera.position.clone().sub(center).normalize();
  const visibilityDot = normal.dot(toCamera);
  return {
    face: r2Semantic.face,
    visibilityDot,
    state: { ...r2Semantic.state },
    layout: r2Semantic.layout || null,
    size: [r2Semantic.width, r2Semantic.height],
    centerWorld: center.toArray(),
    normalWorld: normal.toArray(),
  };
}

function r2StateSnapshot() {
  return {
    presentationRig: { position: presentationRig.position.toArray(), quaternion: presentationRig.quaternion.toArray(), scale: presentationRig.scale.toArray() },
    cubies: snapshotLogicalState(),
    activeTurns: activeTurnList().map((turn) => ({ id: turn.id, serial: turn.serial, axis: turn.axis, layer: turn.layer, direction: turn.direction, linear: turn.linear, eased: turn.eased })),
    completedTurns: lastTurnResults.map((turn) => ({ id: turn.id, serial: turn.serial, axis: turn.axis, layer: turn.layer, direction: turn.direction, endpointErrorRad: turn.endpointErrorRad })),
    scheduler: { enabled: sliceSchedulerEnabled, running: sliceSchedulerRunning, eventSerial: sliceEventSerial, eventsUntilBreath, seed: sliceSeed, delayRemainingMs: r2SchedulerDelayRemainingMs },
    camera: { position: camera.position.toArray(), quaternion: camera.quaternion.toArray(), target: controls.target.toArray() },
    time: { ...R2_TIME },
    semantic: r2SemanticInfo(),
  };
}
`;

replaceOnce('let lastPresentationQuaternion = new THREE.Quaternion();\n', semanticBlock, 'R2 state / semantic layer');
replaceOnce('  renderReviewFrame,\n', '  renderReviewFrame,\n  r2SetTimeControl,\n  r2InitSemanticSurface,\n  r2SetSemanticState,\n  r2SemanticInfo,\n  r2StateSnapshot,\n', 'API exposure');
replaceOnce(
  'function sliceAutonomyBlocked() {\n  return interactionActive || performance.now() < sliceResumeAt;\n}',
  'function sliceAutonomyBlocked() {\n  return R2_TIME.blockNewSlices || interactionActive || performance.now() < sliceResumeAt;\n}',
  'slice semantic gate',
);
replaceOnce(
  '      elapsed += delta;\n      const linear = THREE.MathUtils.clamp(elapsed / Math.max(1, durationMs), 0, 1);',
  '      elapsed += delta * R2_TIME.timeScale;\n      const linear = THREE.MathUtils.clamp(elapsed / Math.max(1, durationMs), 0, 1);',
  'turn time progression',
);
replaceOnce(
  '  const deltaMs = Math.min(80, Math.max(0, now - presentationLastNow));\n  presentationLastNow = now;',
  '  const deltaMs = Math.min(80, Math.max(0, now - presentationLastNow));\n  const scaledDeltaMs = deltaMs * R2_TIME.timeScale;\n  presentationLastNow = now;',
  'presentation scaled delta',
);
replaceOnce(
  '  presentationSimTimeMs += deltaMs;\n  presentationYawVelocityDegPerSec = presentationVelocityAt(presentationSimTimeMs);\n  const yawStepDeg = presentationYawVelocityDegPerSec * (deltaMs / 1000);',
  '  presentationSimTimeMs += scaledDeltaMs;\n  presentationYawVelocityDegPerSec = presentationVelocityAt(presentationSimTimeMs);\n  const yawStepDeg = presentationYawVelocityDegPerSec * (scaledDeltaMs / 1000);',
  'presentation time application',
);
replaceOnce(
  `async function schedulerDelay(durationMs) {
  let elapsed = 0;
  let previous = performance.now();
  while (elapsed < durationMs && sliceSchedulerEnabled) {
    await sleep(Math.min(32, Math.max(8, durationMs - elapsed)));
    const now = performance.now();
    const delta = now - previous;
    previous = now;
    if (!sliceAutonomyBlocked()) elapsed += delta;
  }
}`,
  `async function schedulerDelay(durationMs) {
  let elapsed = 0;
  let previous = performance.now();
  r2SchedulerDelayRemainingMs = durationMs;
  while (elapsed < durationMs && sliceSchedulerEnabled) {
    await sleep(Math.min(32, Math.max(8, durationMs - elapsed)));
    const now = performance.now();
    const delta = now - previous;
    previous = now;
    const interactionBlocked = interactionActive || now < sliceResumeAt;
    if (!interactionBlocked) elapsed += delta * R2_TIME.timeScale;
    r2SchedulerDelayRemainingMs = Math.max(0, durationMs - elapsed);
  }
  r2SchedulerDelayRemainingMs = 0;
}`,
  'scheduler temporal progression',
);
replaceOnce(
  '      eventsUntilBreath,\n    },',
  '      eventsUntilBreath,\n      delayRemainingMs: r2SchedulerDelayRemainingMs,\n      semanticNewSliceGate: R2_TIME.blockNewSlices,\n      semanticTimeScale: R2_TIME.timeScale,\n    },',
  'scheduler diagnostics',
);
replaceOnce(
  '    renderer: {\n',
  '    semanticR2: r2SemanticInfo(),\n    semanticTime: { ...R2_TIME },\n    renderer: {\n',
  'semantic diagnostics',
);

fs.writeFileSync(OUTPUT, source);
console.log('Generated ' + path.basename(OUTPUT) + ' from frozen base-runtime.js (' + source.length + ' bytes)');
