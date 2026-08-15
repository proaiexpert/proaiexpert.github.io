import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const R44_SHA = '428e4c7d4c5fcc7a9fb6d4f75e484b80f623f76c';
const PRODUCT_PATH = 'docs/site-evolution/spline/proai-cube-semantic-brand-face-r4/material-polish-r4.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../../..');
const baselineTemp = path.join(here, '.material-polish-r44-base.tmp.mjs');
const generatedFile = path.join(here, 'main.generated.js');

let baseline;
try {
  baseline = execFileSync('git', ['show', `${R44_SHA}:${PRODUCT_PATH}`], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  });
} catch (error) {
  throw new Error(`R4.4.1 requires reachable frozen R4.4 ${R44_SHA}: ${error.message}`);
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
  if (first < 0 || second >= 0) throw new Error(`R4.4.1 anchor ${label}: first=${first} second=${second}`);
  source = source.slice(0, first) + replacement + source.slice(first + find.length);
};

for (const required of [
  'bumpScale:-0.130,roughnessMapInk:0.550,metalnessDelta:0.0,tonalInk:0.820',
  'R4_4_PHYSICAL_MICRO_ENGRAVED_',
  'semanticVelocityMultiplier: 1.0',
  'const deltaMs=wallDeltaMs',
  'overlayTextRendered:false',
  'alphaDominantReveal:false',
  'semanticMotionCoupled:false',
  'semanticOrientationForcing:false',
  'R44_INITIAL_PRESENTATION_PHASE_MS = 16000',
  'R44_INITIAL_PRESENTATION_YAW_DEG = 342.55902777777777',
  'const phrasePattern = [1, 2, 1, 3, 2]',
]) if (!source.includes(required)) throw new Error(`R4.4.1 missing frozen R4.4 base invariant: ${required}`);

const typographyScaleHelper = `function createSemanticR441ScaledBrandMaskTexture(texture){const src=texture.image,w=src.width,h=src.height,scaleX=.875,scaleY=.900,canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d',{alpha:true});ctx.clearRect(0,0,w,h);const dw=w*scaleX,dh=h*scaleY;ctx.drawImage(src,(w-dw)*.5,(h-dh)*.5,dw,dh);const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.NoColorSpace;t.minFilter=THREE.LinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.needsUpdate=true;t.userData.semanticR441TypographyScale={r44:{x:1,y:1},r441:{x:scaleX,y:scaleY},horizontalReductionPct:12.5,verticalReductionPct:10};if(semanticTypographyMetrics){const cx=.5+(semanticTypographyMetrics.opticalOffsetXRatio||0),cy=.5+(semanticTypographyMetrics.opticalOffsetYRatio||0),bw=semanticTypographyMetrics.blockWidthRatio*scaleX,bh=semanticTypographyMetrics.blockHeightRatio*scaleY;semanticTypographyMetrics={...semanticTypographyMetrics,expertFontPx:semanticTypographyMetrics.expertFontPx*scaleY,proAIFontPx:semanticTypographyMetrics.proAIFontPx*scaleY,blockWidthPx:semanticTypographyMetrics.blockWidthPx*scaleX,blockHeightPx:semanticTypographyMetrics.blockHeightPx*scaleY,blockWidthRatio:bw,blockHeightRatio:bh,safeLeftRatio:cx-bw*.5,safeRightRatio:1-(cx+bw*.5),safeTopRatio:cy-bh*.5,safeBottomRatio:1-(cy+bh*.5),r44OpticalScale:{x:1,y:1},r441OpticalScale:{x:scaleX,y:scaleY},r441HorizontalReductionPct:12.5,r441VerticalReductionPct:10}}texture.dispose?.();return t}\n`;
replaceOne(
  'function createSeamAwareBrandMaskTexture(texture,faceSpan){',
  `${typographyScaleHelper}function createSeamAwareBrandMaskTexture(texture,faceSpan){`,
  'scaled persistent brand mask helper',
);
replaceOne(
  'semanticMaskTexture = createSeamAwareBrandMaskTexture(createBrandMaskTexture(), faceSpan);',
  'semanticMaskTexture = createSeamAwareBrandMaskTexture(createSemanticR441ScaledBrandMaskTexture(createBrandMaskTexture()), faceSpan);',
  'apply selected R4.4.1 optical typography scale',
);

// Keep the established R4.4 recess/body calibration. Only the physically derived
// inner micro-edge becomes sharper so the stable studio BRDF can return a brief
// muted Pearl/Silver catch without brightening the full glyph.
const pearlRoughnessHelper = `function createSemanticR441PearlRoughnessTile(maskTexture){const src=maskTexture.image,size=src.width,canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d',{alpha:false}),srcCtx=src.getContext('2d',{willReadFrequently:true}),pixels=srcCtx.getImageData(0,0,size,size).data,out=ctx.createImageData(size,size),bodyV=Math.round(255*.550),edgeV=Math.round(255*.095),radius=2;for(let y=0;y<size;y++){for(let x=0;x<size;x++){const i=(y*size+x)*4,a=pixels[i+3]/255;let v=255;if(a>.015){let minA=a;for(const [dx,dy] of [[-radius,0],[radius,0],[0,-radius],[0,radius],[-1,-1],[1,-1],[-1,1],[1,1]]){const nx=Math.max(0,Math.min(size-1,x+dx)),ny=Math.max(0,Math.min(size-1,y+dy)),ni=(ny*size+nx)*4;minA=Math.min(minA,pixels[ni+3]/255)}const edge=THREE.MathUtils.clamp((a-minA)/.58,0,1),strokeV=bodyV+(edgeV-bodyV)*edge;v=Math.round(255+(strokeV-255)*a)}out.data[i]=v;out.data[i+1]=v;out.data[i+2]=v;out.data[i+3]=255}}ctx.putImageData(out,0,0);const t=makeSemanticDataTexture(canvas);t.userData.semanticR441PearlEdgeRoughness={bodyRoughnessInk:.550,edgeRoughnessInk:.095,innerEdgeRadiusPx:2,driver:'persistent mask micro-edge -> roughness/clearcoat-roughness -> stable studio BRDF only'};return t}\n`;
replaceOne(
  'function isSemanticFaceGeometry(object){',
  `${pearlRoughnessHelper}function isSemanticFaceGeometry(object){`,
  'Pearl Silver inner micro-edge roughness helper',
);
replaceOne(
  'rough=createSemanticRoughnessTile(mask),meshes=collectSemanticPhysicalMeshes(cubie);',
  'rough=createSemanticR441PearlRoughnessTile(mask),meshes=collectSemanticPhysicalMeshes(cubie);',
  'use physical Pearl edge roughness tile',
);
replaceOne(
  'm.name=`R4_4_PHYSICAL_MICRO_ENGRAVED_${baseMaterial.name||\'FACE\'}`;',
  'm.name=`R4_4_1_PHYSICAL_MICRO_ENGRAVED_${baseMaterial.name||\'FACE\'}`;',
  'R4.4.1 physical material name',
);
replaceOne(
  "m.userData.semanticMaterial='SEMANTIC_R4_4_PERSISTENT_PHYSICAL_MICRO_ENGRAVING';",
  "m.userData.semanticMaterial='SEMANTIC_R4_4_1_PERSISTENT_PHYSICAL_MICRO_ENGRAVING';",
  'R4.4.1 physical material metadata',
);
replaceOne(
  'm.userData.semanticR44SceneProjectedUv=true;m.needsUpdate=true;return m',
  "m.userData.semanticR44SceneProjectedUv=true;m.userData.semanticR441PearlEdgeRoughness=roughnessTexture.userData.semanticR441PearlEdgeRoughness||null;m.needsUpdate=true;return m",
  'Pearl edge material metadata',
);

// Static studio calibration only. No semantic light animation.
replaceOne(
  'position: [-4.3, 3.7, -5.8], width: 2.3, height: 6.8, color: 0xe9edf2, intensity: 1.20',
  'position: [-4.3, 3.7, -5.8], width: 2.3, height: 6.8, color: 0xe9edf2, intensity: 0.92',
  'static top-plane reflector restraint',
);

replaceOne(
  'let semanticEngravedLogicalTileCount=0;',
  `let semanticEngravedLogicalTileCount=0;\nlet semanticR441EngravedCubieIds=new Set();`,
  'semantic cubie identity registry',
);
replaceOne(
  'function installPhysicalSemanticEngraving(globalTexture){semanticEngravedTiles=[];const front=physicalCubies.filter(c=>c.logical.z===1),covered=new Set();',
  `function installPhysicalSemanticEngraving(globalTexture){semanticEngravedTiles=[];const front=physicalCubies.filter(c=>c.logical.z===1);semanticR441EngravedCubieIds=new Set(front.map(c=>c.id));const covered=new Set();`,
  'retain exact semantic face physical cubie IDs',
);

const cadenceAndSafetyState = `const SEMANTIC_R441_CADENCE=Object.freeze({driver:'five distinct persistent physical semantic faces; no opacity/text sequencer timer',moments:Object.freeze([{id:'ProAI Expert',intervalSec:3.4,breathingSec:.8},{id:'TRUST',intervalSec:4.0,breathingSec:1.0},{id:'INQUIRY',intervalSec:3.7,breathingSec:.9},{id:'RESPONSE',intervalSec:4.3,breathingSec:1.2},{id:'RESULT',intervalSec:3.6,breathingSec:.9}]),totalLoopSec:19.0,targetLoopSec:[18,24],hardMaxLoopSec:30,protectedWindowTargetSec:[1.6,2.6],clearReadableTargetSec:[.55,1.0],metronomic:false});\nconst SEMANTIC_R441_SAFETY=Object.freeze({meaningfulScore:.900,meaningfulFaceView:.840,enterScore:.918,exitScore:.910,enterFaceView:.860,exitFaceView:.850,comfortableScore:.9315,comfortableFaceView:.885,unsafeReturnGuardMs:3000,angularReserveDeg:16});\nconst semanticR441Safety={protected:false,protectedSinceMs:null,protectedIntervals:[],transitionCount:0,replacements:0,skippedEvents:0,safeMoveStarts:0,unsafeMoveStarts:0,unsafeProtectedStarts:0,assemblyViolations:0,assemblyViolationLatched:false,lastSelection:null,lastScore:0,lastFaceView:0,lastSignedFaceView:0,lastAssembly:true,lastUnsafeClearance:false,lastRequiredBackAngleDeg:null,lastMoveLog:[]};\n`;
replaceOne(
  'const semanticMotionTrace=[];',
  `${cadenceAndSafetyState}const semanticMotionTrace=[];`,
  'R4.4.1 cadence and semantic safety state',
);

const schedulerSafetyHelpers = `function semanticR441ReadabilityScore(){const o=semanticR43OpticalDiagnostics||{};return o.frontFacing===true?THREE.MathUtils.clamp(.64*(o.faceView||0)+.36*(o.alignment||0),0,1):0}\nfunction semanticR441ExactAssembly(){if(semanticR441EngravedCubieIds.size!==9)return false;const identity=[1,0,0,0,1,0,0,0,1];for(const cubie of physicalCubies){if(!semanticR441EngravedCubieIds.has(cubie.id))continue;const origin=cubie.id.split('|').map(Number);if(cubie.logical.x!==origin[0]||cubie.logical.y!==origin[1]||cubie.logical.z!==origin[2]||cubie.orientation.some((v,i)=>v!==identity[i]))return false}return true}\nfunction updateSemanticR441ProtectionState(){const o=semanticR43OpticalDiagnostics||{},score=semanticR441ReadabilityScore(),faceView=o.faceView||0,front=o.frontFacing===true,now=presentationSimTimeMs,assembled=semanticR441ExactAssembly(),enter=front&&faceView>=SEMANTIC_R441_SAFETY.enterFaceView&&score>=SEMANTIC_R441_SAFETY.enterScore,exit=!front||faceView<=SEMANTIC_R441_SAFETY.exitFaceView||score<=SEMANTIC_R441_SAFETY.exitScore;semanticR441Safety.lastScore=score;semanticR441Safety.lastFaceView=faceView;semanticR441Safety.lastSignedFaceView=Number.isFinite(o.signedFaceView)?o.signedFaceView:0;semanticR441Safety.lastAssembly=assembled;if(!semanticR441Safety.protected&&enter){semanticR441Safety.protected=true;semanticR441Safety.protectedSinceMs=now;semanticR441Safety.transitionCount++}else if(semanticR441Safety.protected&&exit){const start=semanticR441Safety.protectedSinceMs??now;semanticR441Safety.protectedIntervals.push({startMs:start,endMs:now,durationSec:Math.max(0,now-start)/1000});if(semanticR441Safety.protectedIntervals.length>20)semanticR441Safety.protectedIntervals.shift();semanticR441Safety.protected=false;semanticR441Safety.protectedSinceMs=null;semanticR441Safety.transitionCount++}if(semanticR441Safety.protected&&!assembled){if(!semanticR441Safety.assemblyViolationLatched)semanticR441Safety.assemblyViolations++;semanticR441Safety.assemblyViolationLatched=true}else if(assembled)semanticR441Safety.assemblyViolationLatched=false}\nfunction semanticR441MoveIntersection(move){const selected=selectLayer(move.axis,move.layer),ids=selected.filter(c=>semanticR441EngravedCubieIds.has(c.id)).map(c=>c.id);return{count:ids.length,ids}}\nfunction semanticR441UnsafePhraseWindowOpen(){if(semanticR441Safety.protected||!semanticR441ExactAssembly())return false;const o=semanticR43OpticalDiagnostics||{},signed=Number.isFinite(o.signedFaceView)?o.signedFaceView:(o.frontFacing===true?(o.faceView||0):-(o.faceView||0)),yaw=Math.max(7,Math.abs(presentationYawVelocityDegPerSec||30)),returnSec=SEMANTIC_R441_SAFETY.unsafeReturnGuardMs/1000,requiredAngle=Math.min(176,68+yaw*returnSec+SEMANTIC_R441_SAFETY.angularReserveDeg),threshold=Math.cos(THREE.MathUtils.degToRad(requiredAngle)),open=signed<=threshold;semanticR441Safety.lastUnsafeClearance=open;semanticR441Safety.lastRequiredBackAngleDeg=requiredAngle;return open}\nfunction semanticR441SafeCandidates(){const out=[];for(const axis of AXES)for(const layer of LAYERS){const probe={axis,layer};if(semanticR441MoveIntersection(probe).count===0)out.push({axis,layer})}return out}\nfunction semanticR441SelectScheduledMove(preferredAxis){const preferred=makeScheduledMove(preferredAxis),intersection=semanticR441MoveIntersection(preferred),unsafeWindow=semanticR441UnsafePhraseWindowOpen(),mustPreserve=semanticR441Safety.protected||!unsafeWindow;if(!mustPreserve||intersection.count===0){semanticR441Safety.lastSelection={preferred:{axis:preferred.axis,layer:preferred.layer},selected:{axis:preferred.axis,layer:preferred.layer},replaced:false,reason:intersection.count===0?'non-intersecting':unsafeWindow?'full-vocabulary-back-face-clearance':'normal'};return preferred}const safe=semanticR441SafeCandidates();if(!safe.length){semanticR441Safety.skippedEvents++;semanticR441Safety.lastSelection={preferred:{axis:preferred.axis,layer:preferred.layer},selected:null,replaced:false,reason:'no-safe-candidate'};return null}const candidate=safe[seededInt(0,safe.length-1)],move=makeScheduledMove(candidate.axis,candidate.layer);semanticR441Safety.replacements++;semanticR441Safety.lastSelection={preferred:{axis:preferred.axis,layer:preferred.layer},selected:{axis:move.axis,layer:move.layer},replaced:true,reason:semanticR441Safety.protected?'protected-optical-envelope':'pre-readability-return-horizon'};return move}\nfunction semanticR441RecordMoveStart(move,phase){const intersection=semanticR441MoveIntersection(move),protectedNow=semanticR441Safety.protected;if(intersection.count===0)semanticR441Safety.safeMoveStarts++;else semanticR441Safety.unsafeMoveStarts++;if(protectedNow&&intersection.count>0)semanticR441Safety.unsafeProtectedStarts++;semanticR441Safety.lastMoveLog.push({presentationMs:presentationSimTimeMs,axis:move.axis,layer:move.layer,direction:move.direction,phase,semanticIntersection:intersection.count,protected:protectedNow,assembled:semanticR441ExactAssembly()});if(semanticR441Safety.lastMoveLog.length>50)semanticR441Safety.lastMoveLog.shift();return intersection}\n`;
replaceOne(
  'async function waitForSliceAutonomy() {',
  `${schedulerSafetyHelpers}async function waitForSliceAutonomy() {`,
  'semantic-safe candidate scheduler helpers',
);

replaceOne(
  'function render(now) {\n  updateSemanticRuntime(now);',
  `function render(now) {\n  updateSemanticR441ProtectionState();\n  updateSemanticRuntime(now);`,
  'per-frame physical protection hysteresis observation',
);

const oldR44Scheduler = `async function sliceSchedulerLoop() {\n  if (sliceSchedulerRunning) return;\n  sliceSchedulerRunning = true;\n  // Keep the initially engraved physical face assembled through the first natural\n  // presentation alignment. Global presentation rotation continues unchanged.\n  await schedulerDelay(5200);\n  const phrasePattern = [1, 2, 1, 3, 2];\n  while (sliceSchedulerEnabled) {\n    if (!await waitForSliceAutonomy()) break;\n    const phraseLength = phrasePattern[sliceEventSerial % phrasePattern.length];\n    const executed = [];\n    for (let i = 0; i < phraseLength && sliceSchedulerEnabled; i += 1) {\n      if (!await waitForSliceAutonomy()) break;\n      const axis = AXES[(sliceEventSerial + i) % AXES.length];\n      const move = makeScheduledMove(axis);\n      const result = await turnSlice(move);\n      if (!result) break;\n      executed.push(move);\n      if (i < phraseLength - 1) await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)));\n    }\n    if (!executed.length) {\n      await schedulerDelay(120);\n      continue;\n    }\n    await schedulerDelay(Math.round(seededRange(260, 420)));\n    for (let i = executed.length - 1; i >= 0; i -= 1) {\n      if (!await waitForSliceAutonomy()) break;\n      const move = executed[i];\n      await turnSlice({ ...move, direction: -move.direction, durationMs: move.durationMs });\n      if (i > 0) await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)));\n    }\n    sliceEventSerial += executed.length;\n    eventsUntilBreath = seededInt(3, 4);\n    if (!sliceSchedulerEnabled) break;\n    await schedulerDelay(Math.round(seededRange(900, 1250)));\n  }\n  sliceSchedulerRunning = false;\n}`;
const semanticSafeScheduler = `async function sliceSchedulerLoop() {\n  if (sliceSchedulerRunning) return;\n  sliceSchedulerRunning = true;\n  // Scheduler stays alive. Semantic safety changes candidate selection only.\n  await schedulerDelay(680);\n  const phrasePattern = [1, 2, 1, 3, 2];\n  while (sliceSchedulerEnabled) {\n    if (!await waitForSliceAutonomy()) break;\n    const requestedLength = phrasePattern[sliceEventSerial % phrasePattern.length];\n    const executed = [];\n    for (let i = 0; i < requestedLength && sliceSchedulerEnabled; i += 1) {\n      if (!await waitForSliceAutonomy()) break;\n      const axis = AXES[(sliceEventSerial + i) % AXES.length];\n      const move = semanticR441SelectScheduledMove(axis);\n      if (!move) break;\n      const intersection = semanticR441RecordMoveStart(move,'forward');\n      const result = await turnSlice(move);\n      if (!result) break;\n      executed.push(move);\n      // A fragmenting full-vocabulary move is an atomic self-resolving excursion\n      // permitted only with conservative back-face return clearance.\n      if (intersection.count > 0) break;\n      if (i < requestedLength - 1) await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)));\n    }\n    if (!executed.length) {\n      semanticR441Safety.skippedEvents++;\n      await schedulerDelay(120);\n      continue;\n    }\n    await schedulerDelay(Math.round(seededRange(260, 420)));\n    for (let i = executed.length - 1; i >= 0; i -= 1) {\n      if (!await waitForSliceAutonomy()) break;\n      const move = executed[i];\n      const inverse={...move,direction:-move.direction,durationMs:move.durationMs};\n      semanticR441RecordMoveStart(inverse,'resolve');\n      await turnSlice(inverse);\n      if (i > 0) await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)));\n    }\n    sliceEventSerial += executed.length;\n    eventsUntilBreath = seededInt(3, 4);\n    if (!sliceSchedulerEnabled) break;\n    await schedulerDelay(Math.round(seededRange(720, 1040)));\n  }\n  sliceSchedulerRunning = false;\n}`;
replaceOne(oldR44Scheduler, semanticSafeScheduler, 'R4.4.1 semantic-safe self-resolving slice choreography');

replaceOne(
  'letterWordStagger:false,\n',
  `letterWordStagger:false,\n    r441TypographyScale:semanticMaskTexture?.userData?.semanticR441TypographyScale||null,\n    r441Material:{bumpScale:-.130,roughnessMapInk:.550,tonalInk:.820,pearlEdgeRoughnessInk:.095,microEdge:'R4.4 5px softened bevel + 26% hard core plus 2px sharp physical BRDF edge',uniformSilverFill:false,topReflectorIntensity:.92,topReflectorAnimated:false},\n    r441SemanticSafeSlice:{...semanticR441Safety,protectedIntervals:[...semanticR441Safety.protectedIntervals],lastMoveLog:[...semanticR441Safety.lastMoveLog],faceAssembledExact:semanticR441ExactAssembly(),schedulerPausesGlobally:false,fullVocabularyAvailableWhenOpticallyClear:true,meaningfulNow:semanticR441Safety.lastScore>=SEMANTIC_R441_SAFETY.meaningfulScore&&semanticR441Safety.lastFaceView>=SEMANTIC_R441_SAFETY.meaningfulFaceView,comfortableNow:semanticR441Safety.lastScore>=SEMANTIC_R441_SAFETY.comfortableScore&&semanticR441Safety.lastFaceView>=SEMANTIC_R441_SAFETY.comfortableFaceView,safetyThresholds:SEMANTIC_R441_SAFETY},\n    r441Cadence:SEMANTIC_R441_CADENCE,\n`,
  'R4.4.1 semantic/material/cadence diagnostics',
);

const forbidden = [
  ['wallDeltaMs * semanticTimeScale', 'semantic speed multiplication'],
  ['emissiveIntensity', 'emissive lettering'],
  ['SEMANTIC_R4_2_TEXT', 'overlay text material'],
  ['await schedulerDelay(5200)', 'R4.4 first-slice dead wait'],
];
for (const [needle, label] of forbidden) if (source.includes(needle)) throw new Error(`R4.4.1 forbidden regression: ${label}`);
for (const required of [
  'semanticVelocityMultiplier: 1.0',
  'const deltaMs=wallDeltaMs',
  'overlayTextRendered:false',
  'alphaDominantReveal:false',
  'semanticMotionCoupled:false',
  'semanticOrientationForcing:false',
  'R4_4_1_PHYSICAL_MICRO_ENGRAVED_',
  'semanticR44SceneProjectedUv=true',
  'semanticR441PearlEdgeRoughness',
  'edgeRoughnessInk:.095',
  'r441HorizontalReductionPct:12.5',
  'r441VerticalReductionPct:10',
  'SEMANTIC_R441_CADENCE',
  'totalLoopSec:19.0',
  'enterScore:.918',
  'exitScore:.910',
  'updateSemanticR441ProtectionState();',
  'semanticR441SelectScheduledMove',
  'unsafeProtectedStarts',
  'assemblyViolations',
  'schedulerPausesGlobally:false',
  'await schedulerDelay(680)',
  'const phrasePattern = [1, 2, 1, 3, 2]',
  'direction:-move.direction',
  'R44_INITIAL_PRESENTATION_PHASE_MS = 16000',
  'R44_INITIAL_PRESENTATION_YAW_DEG = 342.55902777777777',
]) if (!source.includes(required)) throw new Error(`R4.4.1 missing invariant: ${required}`);

fs.writeFileSync(generatedFile, source);
console.log('R4.4.1 zero-tearing premium semantic polish applied');
console.log('R4.4 rollback:', R44_SHA);
console.log('typography scale:', '0.875x / 0.900y');
console.log('material:', 'bump -0.130 / body roughness 0.550 / tonal 0.820 / Pearl edge roughness 0.095');
console.log('micro-edge:', 'R4.4 5px softened bevel + 26% hard core + 2px sharp BRDF edge');
console.log('top reflector:', 'static intensity 0.92; no semantic light animation');
console.log('semantic safety:', 'narrow optical hysteresis + conservative pre/post return horizon + safe candidate replacement');
console.log('scheduler:', 'alive after 680ms; no global semantic pause; fragmenting moves self-resolve only with back-face clearance');
console.log('five-moment cadence architecture:', '3.4 + 4.0 + 3.7 + 4.3 + 3.6 = 19.0 sec; no text sequencer');
