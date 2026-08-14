import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const R43_SHA = 'f4f4bfa34f38eb99b2e99cff941a7f7895e82d9a';
const PRODUCT_PATH = 'docs/site-evolution/spline/proai-cube-semantic-brand-face-r4/material-polish-r4.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../../..');
const baselineTemp = path.join(here, '.material-polish-r43-baseline.tmp.mjs');
const generatedFile = path.join(here, 'main.generated.js');

// R4.4 is deliberately a narrow descendant calibration over the exact frozen
// R4.3 product. The rollback commit remains byte-addressable and executable while
// this pass is forbidden from changing semantic speed, orientation, or overlays.
let baseline;
try {
  baseline = execFileSync('git', ['show', `${R43_SHA}:${PRODUCT_PATH}`], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  });
} catch (error) {
  throw new Error(`R4.4 requires reachable frozen R4.3 ${R43_SHA}: ${error.message}`);
}

fs.writeFileSync(baselineTemp, baseline);
try {
  execFileSync(process.execPath, [baselineTemp], { cwd: here, stdio: 'inherit' });
} finally {
  fs.rmSync(baselineTemp, { force: true });
}

let source = fs.readFileSync(generatedFile, 'utf8');

const replaceOne = (find, replacement, label) => {
  const first = source.indexOf(find);
  const second = first >= 0 ? source.indexOf(find, first + find.length) : -1;
  if (first < 0 || second >= 0) throw new Error(`R4.4 calibration anchor ${label}: first=${first} second=${second}`);
  source = source.slice(0, first) + replacement + source.slice(first + find.length);
};

// Final R4.4 material calibration. The physical +Z face receives material UVs
// projected from the actual scene-local outward face plane, a softened micro-bevel
// height profile, stronger BRDF roughness separation, and a restrained persistent
// recess tone. There is no temporal driver: readability still comes only from
// face/light/view geometry.
replaceOne(
  'bumpScale:-0.060,roughnessMapInk:0.855,metalnessDelta:0.0',
  'bumpScale:-0.130,roughnessMapInk:0.550,metalnessDelta:0.0,tonalInk:0.820',
  'micro-normal roughness and tonal calibration',
);
replaceOne(
  "driver:'actual outward +Z cubie MeshPhysicalMaterial BRDF + persistent bump micro-normal + static roughness/clearcoat-roughness micro-treatment; diagnostics observe face normal + camera view + stable key RectAreaLight half-vector only'",
  "driver:'R4.4 calibrated actual outward +Z cubie MeshPhysicalMaterial BRDF + scene-projected physical face coordinates + persistent softened machined-edge bump (-0.130) + roughness/clearcoat-roughness ink (0.550) + restrained recess tonal multiplier (0.820); stable studio lighting only; front-facing signed optical diagnostics; zero timeline driver'",
  'physical driver metadata',
);

const oldMaterialFactory = "function createPhysicalEngravedMaterial(baseMaterial,maskTexture,roughnessTexture){const m=baseMaterial.clone();m.name=`R4_3_PHYSICAL_MICRO_ENGRAVED_${baseMaterial.name||'FACE'}`;m.bumpMap=maskTexture;m.bumpScale=SEMANTIC_R4_3_ENGRAVING.bumpScale;m.roughnessMap=roughnessTexture;if('clearcoatRoughnessMap' in m)m.clearcoatRoughnessMap=roughnessTexture;m.userData.semanticMaterial='SEMANTIC_R4_3_PERSISTENT_PHYSICAL_MICRO_ENGRAVING';m.userData.semanticTileMask=maskTexture;m.userData.semanticRoughnessMap=roughnessTexture;m.needsUpdate=true;return m}";
const calibratedMaterialFactory = `function createSemanticR44PlanarFaceGeometry(mesh,sourceGeometry){const geometry=sourceGeometry.clone(),position=geometry.getAttribute('position');if(!position)throw new Error('R4.4 engraved face missing positions');sceneOne.updateMatrixWorld(true);mesh.updateMatrixWorld(true);const xy=new Float32Array(position.count*2),p=new THREE.Vector3();let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;for(let i=0;i<position.count;i++){p.fromBufferAttribute(position,i);mesh.localToWorld(p);sceneOne.worldToLocal(p);xy[i*2]=p.x;xy[i*2+1]=p.y;minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y)}const spanX=Math.max(1e-6,maxX-minX),spanY=Math.max(1e-6,maxY-minY),uv=new Float32Array(position.count*2);for(let i=0;i<position.count;i++){uv[i*2]=THREE.MathUtils.clamp((xy[i*2]-minX)/spanX,0,1);uv[i*2+1]=THREE.MathUtils.clamp((xy[i*2+1]-minY)/spanY,0,1)}geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));geometry.userData.semanticR44PlanarUv={axis:'sceneOne XY projected from actual outward +Z physical face',spanX,spanY};return geometry}
function createSemanticR44BevelTile(maskTexture){const src=maskTexture.image,size=src.width,canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d',{alpha:false});ctx.fillStyle='#000000';ctx.fillRect(0,0,size,size);ctx.save();ctx.filter='blur(5px)';ctx.globalAlpha=.74;ctx.drawImage(src,0,0);ctx.restore();ctx.globalAlpha=.26;ctx.drawImage(src,0,0);ctx.globalAlpha=1;const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.NoColorSpace;t.minFilter=THREE.LinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.needsUpdate=true;t.userData.semanticR44BeveledBump=true;return t}
function createSemanticR44ToneTile(maskTexture){const src=maskTexture.image,size=src.width,canvas=document.createElement('canvas'),ink=document.createElement('canvas');canvas.width=size;canvas.height=size;ink.width=size;ink.height=size;const ctx=canvas.getContext('2d',{alpha:false}),ic=ink.getContext('2d',{alpha:true});ctx.fillStyle='#ffffff';ctx.fillRect(0,0,size,size);ic.clearRect(0,0,size,size);ic.drawImage(src,0,0);ic.globalCompositeOperation='source-in';const v=Math.round(255*SEMANTIC_R4_3_ENGRAVING.tonalInk);ic.fillStyle=\`rgb(\${v},\${v},\${v})\`;ic.fillRect(0,0,size,size);ctx.drawImage(ink,0,0);const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.minFilter=THREE.LinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.needsUpdate=true;return t}
function createPhysicalEngravedMaterial(mesh,baseMaterial,maskTexture,roughnessTexture){mesh.geometry=createSemanticR44PlanarFaceGeometry(mesh,mesh.geometry);const bevelTexture=createSemanticR44BevelTile(maskTexture),toneTexture=createSemanticR44ToneTile(maskTexture),m=baseMaterial.clone();m.name=\`R4_4_PHYSICAL_MICRO_ENGRAVED_\${baseMaterial.name||'FACE'}\`;m.bumpMap=bevelTexture;m.bumpScale=SEMANTIC_R4_3_ENGRAVING.bumpScale;m.roughnessMap=roughnessTexture;if('clearcoatRoughnessMap' in m)m.clearcoatRoughnessMap=roughnessTexture;if(!baseMaterial.map)m.map=toneTexture;else toneTexture.dispose();m.userData.semanticMaterial='SEMANTIC_R4_4_PERSISTENT_PHYSICAL_MICRO_ENGRAVING';m.userData.semanticTileMask=maskTexture;m.userData.semanticBeveledBump=bevelTexture;m.userData.semanticRoughnessMap=roughnessTexture;m.userData.semanticTonalMap=!baseMaterial.map;m.userData.semanticPlanarUv=true;m.userData.semanticR44BeveledBump=true;m.userData.semanticR44SceneProjectedUv=true;m.needsUpdate=true;return m}`;
replaceOne(oldMaterialFactory, calibratedMaterialFactory, 'physical engraved material factory');
replaceOne(
  'const material=createPhysicalEngravedMaterial(mesh.material,mask,rough);mesh.material=material;',
  'const material=createPhysicalEngravedMaterial(mesh,mesh.material,mask,rough);mesh.material=material;',
  'physical material installation call',
);

// R4.3 used absolute dot products for review diagnostics, so a back-facing +Z
// face could score as a false optical peak. R4.4 records only genuinely visible,
// front-facing opportunities. This changes observation only, never orientation.
replaceOne(
  'const faceView=THREE.MathUtils.clamp(Math.abs(normal.dot(view)),0,1),halfDot=THREE.MathUtils.clamp(Math.abs(normal.dot(half)),0,1),spec=smootherstep',
  'const signedFaceView=normal.dot(view),signedHalfDot=normal.dot(half),faceView=THREE.MathUtils.clamp(signedFaceView,0,1),halfDot=THREE.MathUtils.clamp(signedHalfDot,0,1),spec=smootherstep',
  'front-facing signed optical metric',
);
replaceOne(
  'semanticR43OpticalDiagnostics={alignment,faceView,halfDot,fieldCenter:s.fieldCenter.toArray(),fieldAxis:s.axis.toArray(),opportunity:alignment,persistent:true,',
  'semanticR43OpticalDiagnostics={alignment,faceView,halfDot,signedFaceView,signedHalfDot,frontFacing:signedFaceView>0,fieldCenter:s.fieldCenter.toArray(),fieldAxis:s.axis.toArray(),opportunity:alignment,persistent:true,',
  'signed optical diagnostics payload',
);

// Start the already-approved Presentation Motion from a later phase so the same
// natural +Z face/light/view relationship arrives within the owner's first 2–5 s.
// Velocity curves, presentation integration, and semantic independence are unchanged.
replaceOne(
  'let presentationSimTimeMs = 0;\nlet presentationYawRad = 0;\nlet presentationSignedYawDeg = 0;\nlet presentationCumulativeYawDeg = 0;',
  `const R44_INITIAL_PRESENTATION_PHASE_MS = 7200;
const R44_INITIAL_PRESENTATION_YAW_DEG = 110.50086114843751;
let presentationSimTimeMs = R44_INITIAL_PRESENTATION_PHASE_MS;
let presentationYawRad = THREE.MathUtils.degToRad(R44_INITIAL_PRESENTATION_YAW_DEG);
let presentationSignedYawDeg = R44_INITIAL_PRESENTATION_YAW_DEG;
let presentationCumulativeYawDeg = Math.abs(R44_INITIAL_PRESENTATION_YAW_DEG);`,
  'early natural presentation phase',
);
replaceOne(
  '    setupSemanticSurface();\n    if (captureMode) renderReviewFrame();',
  `    setupSemanticSurface();
    if (!captureMode && !prefersReducedMotion) {
      presentationRig.quaternion.copy(presentationQuaternionAt(presentationSimTimeMs, presentationYawRad));
      presentationRig.updateMatrixWorld(true);
      lastPresentationQuaternion.copy(presentationRig.quaternion);
    }
    if (captureMode) renderReviewFrame();`,
  'initialize living cube at selected presentation phase before first visible frame',
);

// The engraving is physically attached to the original nine +Z cubies. A random
// one-way slice stream permanently scatters those letter fragments, so subsequent
// optical peaks can no longer reveal the complete physical inscription. Preserve
// the living slice language, but make every phrase mechanically self-resolving.
// This choreography is global and autonomous: semantic state never starts it,
// slows it, aims it, or decides when it resolves.
const oldSliceSchedulerLoop = `async function sliceSchedulerLoop() {
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
}`;
const selfResolvingSliceSchedulerLoop = `async function sliceSchedulerLoop() {
  if (sliceSchedulerRunning) return;
  sliceSchedulerRunning = true;
  // Keep the initially engraved physical face assembled through the first natural
  // presentation alignment. Global presentation rotation continues unchanged.
  await schedulerDelay(5200);
  const phrasePattern = [1, 2, 1, 3, 2];
  while (sliceSchedulerEnabled) {
    if (!await waitForSliceAutonomy()) break;
    const phraseLength = phrasePattern[sliceEventSerial % phrasePattern.length];
    const executed = [];
    for (let i = 0; i < phraseLength && sliceSchedulerEnabled; i += 1) {
      if (!await waitForSliceAutonomy()) break;
      const axis = AXES[(sliceEventSerial + i) % AXES.length];
      const move = makeScheduledMove(axis);
      const result = await turnSlice(move);
      if (!result) break;
      executed.push(move);
      if (i < phraseLength - 1) await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)));
    }
    if (!executed.length) {
      await schedulerDelay(120);
      continue;
    }
    await schedulerDelay(Math.round(seededRange(260, 420)));
    for (let i = executed.length - 1; i >= 0; i -= 1) {
      if (!await waitForSliceAutonomy()) break;
      const move = executed[i];
      await turnSlice({ ...move, direction: -move.direction, durationMs: move.durationMs });
      if (i > 0) await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)));
    }
    sliceEventSerial += executed.length;
    eventsUntilBreath = seededInt(3, 4);
    if (!sliceSchedulerEnabled) break;
    await schedulerDelay(Math.round(seededRange(900, 1250)));
  }
  sliceSchedulerRunning = false;
}`;
replaceOne(oldSliceSchedulerLoop, selfResolvingSliceSchedulerLoop, 'self-resolving physical slice choreography');

// Guard every R4.3 architecture invariant that R4.4 is forbidden to alter.
const forbidden = [
  ['wallDeltaMs * semanticTimeScale', 'motion scale multiplication'],
  ['emissiveIntensity', 'emissive lettering'],
  ['SEMANTIC_R4_2_TEXT', 'R4.2 text-overlay material'],
];
for (const [needle, label] of forbidden) if (source.includes(needle)) throw new Error(`R4.4 forbidden regression: ${label}`);
for (const required of [
  'semanticVelocityMultiplier: 1.0',
  'const deltaMs=wallDeltaMs',
  'overlayTextRendered:false',
  'alphaDominantReveal:false',
  'semanticMotionCoupled:false',
  'semanticOrientationForcing:false',
  'physicalEngravedLogicalTileCount',
  'R4_4_PHYSICAL_MICRO_ENGRAVED_',
  'semanticPlanarUv=true',
  'semanticR44BeveledBump=true',
  'semanticR44SceneProjectedUv=true',
  'signedFaceView',
  'frontFacing:signedFaceView>0',
  'R44_INITIAL_PRESENTATION_PHASE_MS = 7200',
  'R44_INITIAL_PRESENTATION_YAW_DEG = 110.50086114843751',
  'await schedulerDelay(5200)',
  'const phrasePattern = [1, 2, 1, 3, 2]',
  'direction: -move.direction',
]) if (!source.includes(required)) throw new Error(`R4.4 missing invariant/calibration: ${required}`);

fs.writeFileSync(generatedFile, source);
console.log('R4.4 machined-edge engraving readability calibration applied');
console.log('R4.3 rollback:', R43_SHA);
console.log('bumpScale:', '-0.130');
console.log('roughnessMapInk:', '0.550');
console.log('clearcoat roughness map:', 'same persistent calibrated 0.550 ink field');
console.log('tonalInk:', '0.820');
console.log('micro-edge:', '5px softened bevel height + 26% hard core');
console.log('material coordinates:', 'sceneOne XY projection from actual outward +Z physical face');
console.log('optical metric:', 'signed front-facing face/view + half-vector only');
console.log('initial presentation phase:', '7200ms; same approved motion curve');
console.log('living slices:', 'independent self-resolving physical phrases; first slice after 5200ms');