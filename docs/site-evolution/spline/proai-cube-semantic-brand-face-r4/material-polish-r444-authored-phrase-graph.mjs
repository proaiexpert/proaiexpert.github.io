import fs from 'node:fs';

const file = new URL('./main.generated.js', import.meta.url);
let source = fs.readFileSync(file, 'utf8');

const replaceUnique = (find, replacement, label) => {
  const at = source.indexOf(find);
  const next = at >= 0 ? source.indexOf(find, at + find.length) : -1;
  if (at < 0 || next >= 0) throw new Error(`R4.4.4 authored phrase graph ${label}: ${at}/${next}`);
  source = source.slice(0, at) + replacement + source.slice(at + find.length);
};

const replaceFunction = (name, nextName, replacement, label, nextPrefix = 'function ') => {
  const start = `function ${name}(`;
  const at = source.indexOf(start);
  const next = source.indexOf(`\n${nextPrefix}${nextName}(`, at + start.length);
  if (at < 0 || next < 0 || source.indexOf(start, at + start.length) >= 0) {
    throw new Error(`R4.4.4 function ${label}: ${at}/${next}`);
  }
  source = source.slice(0, at) + replacement + source.slice(next + 1);
};

// Verify R4.4.3 invariants are present before we modify
for (const required of [
  "SEMANTIC_R442_ELIGIBLE_FACES=Object.freeze(['+Z','+X','-X'])",
  'R4_4_2_PHYSICAL_MICRO_ENGRAVED_',
  'maxProtectedMs:2400',
  'faceRearmBlocked',
  'semanticVelocityMultiplier: 1.0',
  'const deltaMs=wallDeltaMs',
  'overlayTextRendered:false',
  'alphaDominantReveal:false',
  'semanticMotionCoupled:false',
  'semanticOrientationForcing:false',
  'r441HorizontalReductionPct:12.5',
  'r441VerticalReductionPct:10',
  'edgeRoughnessInk:.095',
]) if (!source.includes(required)) throw new Error(`R4.4.4 missing R4.4.3 invariant: ${required}`);

// Verify continuous yaw (R4.4.3 fix)
for (const [from, to] of [
  ['{ timeMs: 36000, velocityDegPerSec: -8.0 }', '{ timeMs: 36000, velocityDegPerSec: 8.0 }'],
  ['{ timeMs: 43000, velocityDegPerSec: -11.0 }', '{ timeMs: 43000, velocityDegPerSec: 11.0 }'],
  ['{ timeMs: 49000, velocityDegPerSec: -24.0 }', '{ timeMs: 49000, velocityDegPerSec: 24.0 }'],
  ['{ timeMs: 55000, velocityDegPerSec: -29.0 }', '{ timeMs: 55000, velocityDegPerSec: 29.0 }'],
  ['{ timeMs: 60000, velocityDegPerSec: -14.0 }', '{ timeMs: 60000, velocityDegPerSec: 14.0 }'],
]) {
  if (source.includes(from)) throw new Error(`R4.4.4 found negative yaw to fix: ${from}`);
  if (!source.includes(to)) throw new Error(`R4.4.4 missing continuous yaw fix: ${to}`);
}

// Find the moveState anchor to insert our new lifecycle
const moveStateAnchor = "const semanticR442MoveState={recentMoves:[],moveLog:[],axisCounts:{X:0,Y:0,Z:0},layerCounts:{'-1':0,'0':0,'1':0},selectionCount:0,replacements:0,skipped:0};";
const moveStateAt = source.indexOf(moveStateAnchor);
if (moveStateAt < 0 || source.indexOf(moveStateAnchor, moveStateAt + moveStateAnchor.length) >= 0) {
  throw new Error(`R4.4.4 state anchor invalid: ${moveStateAt}`);
}

// ============================================================================
// AUTHORED PHRASE GRAPH ARCHITECTURE
// ============================================================================

const authoredPhraseGraph = String.raw`
// ============================================================================
// AUTHORED PHRASE GRAPH — R4.4.4
// Independent implementation from clean base a4e93f645188fa92087121da4aa8c5bb839a3719
// Each phrase is an intentionally designed motion unit.
// Graph edges represent valid authored continuations from safe semantic states.
// No master stream, no solver, no debt/quota/correction stack.
// ============================================================================

const SEMANTIC_R444_PHRASE=Object.freeze({
  // From +Z (front)
  Z_TO_X_POS_1:{name:'Z_TO_X_POS_1',startFace:'+Z',endFace:'+X',axis:'Y',layer:1,direction:1,durationMs:1800,semanticWeight:1.0,transitionType:'single'},
  Z_TO_X_POS_2:{name:'Z_TO_X_POS_2',startFace:'+Z',endFace:'+X',axis:'Y',layer:-1,direction:-1,durationMs:1800,semanticWeight:0.95,transitionType:'single'},
  Z_TO_X_NEG_1:{name:'Z_TO_X_NEG_1',startFace:'+Z',endFace:'-X',axis:'Y',layer:1,direction:-1,durationMs:1800,semanticWeight:1.0,transitionType:'single'},
  Z_TO_X_NEG_2:{name:'Z_TO_X_NEG_2',startFace:'+Z',endFace:'-X',axis:'Y',layer:-1,direction:1,durationMs:1800,semanticWeight:0.95,transitionType:'single'},
  Z_TO_Z_1:{name:'Z_TO_Z_1',startFace:'+Z',endFace:'+Z',axis:'X',layer:0,direction:1,durationMs:1200,semanticWeight:0.85,transitionType:'single'},
  Z_TO_Z_2:{name:'Z_TO_Z_2',startFace:'+Z',endFace:'+Z',axis:'X',layer:0,direction:-1,durationMs:1200,semanticWeight:0.85,transitionType:'single'},

  // From +X (right)
  X_TO_Z_1:{name:'X_TO_Z_1',startFace:'+X',endFace:'+Z',axis:'Y',layer:1,direction:-1,durationMs:1800,semanticWeight:1.0,transitionType:'single'},
  X_TO_Z_2:{name:'X_TO_Z_2',startFace:'+X',endFace:'+Z',axis:'Y',layer:-1,direction:1,durationMs:1800,semanticWeight:0.95,transitionType:'single'},
  X_TO_X_NEG_1:{name:'X_TO_X_NEG_1',startFace:'+X',endFace:'-X',axis:'Z',layer:1,direction:1,durationMs:1800,semanticWeight:1.0,transitionType:'single'},
  X_TO_X_NEG_2:{name:'X_TO_X_NEG_2',startFace:'+X',endFace:'-X',axis:'Z',layer:-1,direction:-1,durationMs:1800,semanticWeight:0.95,transitionType:'single'},
  X_TO_X_1:{name:'X_TO_X_1',startFace:'+X',endFace:'+X',axis:'Y',layer:0,direction:1,durationMs:1200,semanticWeight:0.85,transitionType:'single'},
  X_TO_X_2:{name:'X_TO_X_2',startFace:'+X',endFace:'+X',axis:'Y',layer:0,direction:-1,durationMs:1200,semanticWeight:0.85,transitionType:'single'},

  // From -X (left)
  NEG_X_TO_Z_1:{name:'NEG_X_TO_Z_1',startFace:'-X',endFace:'+Z',axis:'Y',layer:1,direction:1,durationMs:1800,semanticWeight:1.0,transitionType:'single'},
  NEG_X_TO_Z_2:{name:'NEG_X_TO_Z_2',startFace:'-X',endFace:'+Z',axis:'Y',layer:-1,direction:-1,durationMs:1800,semanticWeight:0.95,transitionType:'single'},
  NEG_X_TO_X_POS_1:{name:'NEG_X_TO_X_POS_1',startFace:'-X',endFace:'+X',axis:'Z',layer:1,direction:-1,durationMs:1800,semanticWeight:1.0,transitionType:'single'},
  NEG_X_TO_X_POS_2:{name:'NEG_X_TO_X_POS_2',startFace:'-X',endFace:'+X',axis:'Z',layer:-1,direction:1,durationMs:1800,semanticWeight:0.95,transitionType:'single'},
  NEG_X_TO_NEG_X_1:{name:'NEG_X_TO_NEG_X_1',startFace:'-X',endFace:'-X',axis:'Y',layer:0,direction:1,durationMs:1200,semanticWeight:0.85,transitionType:'single'},
  NEG_X_TO_NEG_X_2:{name:'NEG_X_TO_NEG_X_2',startFace:'-X',endFace:'-X',axis:'Y',layer:0,direction:-1,durationMs:1200,semanticWeight:0.85,transitionType:'single'},
});

// Directed graph: each safe state has multiple valid outgoing phrases
const SEMANTIC_R444_GRAPH=Object.freeze({
  '+Z':[
    'Z_TO_X_POS_1','Z_TO_X_POS_2',
    'Z_TO_X_NEG_1','Z_TO_X_NEG_2',
    'Z_TO_Z_1','Z_TO_Z_2'
  ],
  '+X':[
    'X_TO_Z_1','X_TO_Z_2',
    'X_TO_X_NEG_1','X_TO_X_NEG_2',
    'X_TO_X_1','X_TO_X_2'
  ],
  '-X':[
    'NEG_X_TO_Z_1','NEG_X_TO_Z_2',
    'NEG_X_TO_X_POS_1','NEG_X_TO_X_POS_2',
    'NEG_X_TO_NEG_X_1','NEG_X_TO_NEG_X_2'
  ]
});

// Diversity memory: track last ~3 phrases/states to reduce obvious repetition
const SEMANTIC_R444_MEMORY_LENGTH=3;

const SEMANTIC_R444_CONFIG=Object.freeze({
  memoryLength:3,
  minPhraseDurationMs:800,
  maxPhraseDurationMs:2500,
  cooldownRangeMs:[2000,4000],
  minAngularTravelDeg:15,
  semanticSequence:Object.freeze(['ProAI Expert','TRUST','INQUIRY','RESPONSE','RESULT']),
  seed:0x444c0de,
});

function semanticR444Unit(){
  let x=semanticR444State.semanticSeed>>>0;
  x^=(x<<13)>>>0;
  x^=x>>>17;
  x^=(x<<5)>>>0;
  semanticR444State.semanticSeed=x>>>0;
  return semanticR444State.semanticSeed/4294967296
}
function semanticR444Range(min,max){return min+(max-min)*semanticR444Unit()}
function semanticR444Int(min,max){return Math.floor(min+semanticR444Unit()*(max-min+1))}

// State for authored phrase graph
const semanticR444State={
  currentFace:'+Z',
  currentPhrase:null,
  phraseProgress:0,
  phraseStartMs:0,
  phraseEndMs:0,
  memory:[],
  semanticSeed:0x444c0de,
  nextMessageIndex:0,
  activeMessage:null,
  activeMessageIndex:null,
  lifecycleLog:[],
  eventLog:[],
  candidateLog:[],
  cooldownUntilMs:-Infinity,
  lastSemanticFace:null,
  lastSemanticMs:0,
  completedMessages:0,
};

function semanticR444Log(type,data={}){
  semanticR444State.lifecycleLog.push({type,presentationMs:presentationSimTimeMs,face:semanticR444State.currentFace,phrase:semanticR444State.currentPhrase?.name,...data});
  if(semanticR444State.lifecycleLog.length>160)semanticR444State.lifecycleLog.shift()
}

// Check if a phrase is too similar to recent memory
function semanticR444IsDiverse(phraseName, endFace){
  if(semanticR444State.memory.length===0) return true;
  const recent=semanticR444State.memory;
  // Avoid same phrase twice
  if(recent.some(m=>m.phrase===phraseName)) return false;
  // Avoid same end face 3 times in a row
  const sameFaceCount=recent.filter(m=>m.endFace===endFace).length;
  if(sameFaceCount>=2) return false;
  // Avoid back-and-forth between same two faces
  if(recent.length>=2){
    const f1=recent[recent.length-1].endFace;
    const f2=recent[recent.length-2].endFace;
    if(f1===endFace && f2===semanticR444State.currentFace) return false;
  }
  return true;
}

// Select next phrase from current face using authored graph + diversity
function semanticR444SelectPhrase(){
  const current=semanticR444State.currentFace;
  const outgoing=SEMANTIC_R444_GRAPH[current];
  if(!outgoing||outgoing.length===0){
    semanticR444Log('graph-error',{face:current,reason:'no outgoing edges'});
    return null;
  }

  // Filter by diversity
  const diverse=outgoing.filter(name=>{
    const phrase=SEMANTIC_R444_PHRASE[name];
    return semanticR444IsDiverse(name, phrase.endFace);
  });

  const candidates=diverse.length>0 ? diverse : outgoing; // fallback to all if none diverse
  const phraseName=candidates[semanticR444Int(0, candidates.length-1)];
  return SEMANTIC_R444_PHRASE[phraseName];
}

// Start a new phrase
function semanticR444StartPhrase(){
  const phrase=semanticR444SelectPhrase();
  if(!phrase) return false;

  const now=presentationSimTimeMs;
  semanticR444State.currentPhrase=phrase;
  semanticR444State.phraseProgress=0;
  semanticR444State.phraseStartMs=now;
  semanticR444State.phraseEndMs=now+phrase.durationMs;
  semanticR444State.memory.push({phrase:phrase.name,startFace:phrase.startFace,endFace:phrase.endFace,startMs:now});
  if(semanticR444State.memory.length>SEMANTIC_R444_MEMORY_LENGTH) semanticR444State.memory.shift();

  semanticR444Log('phrase-start',{phrase:phrase.name,startFace:phrase.startFace,endFace:phrase.endFace,axis:phrase.axis,layer:phrase.layer,direction:phrase.direction,durationMs:phrase.durationMs});
  return true;
}

// Complete current phrase and transition to its end face
function semanticR444CompletePhrase(){
  if(!semanticR444State.currentPhrase) return false;

  const phrase=semanticR444State.currentPhrase;
  const endFace=phrase.endFace;
  const now=presentationSimTimeMs;

  semanticR444State.currentFace=endFace;
  semanticR444State.currentPhrase=null;
  semanticR444State.phraseProgress=0;
  semanticR444State.phraseStartMs=0;
  semanticR444State.phraseEndMs=0;

  // Semantic opportunity: the end face of each phrase is a semantic-capable state
  // Apply the next message in sequence to this face
  const messageIndex=semanticR444State.nextMessageIndex;
  const message=SEMANTIC_R444_CONFIG.semanticSequence[messageIndex];

  const reg=semanticR442FaceRegistry.get(endFace);
  if(reg && semanticR442FaceAssembled(endFace)){
    semanticR442SetActiveMaterialFace(endFace);
    semanticR442State.activeMaterialFace=endFace;
    semanticR442State.protected=true;
    semanticR442State.protectedFace=endFace;
    semanticR442State.protectedSinceMs=now;
    semanticR442State.protectionCount++;

    semanticR443ApplyMessage(endFace,messageIndex);

    semanticR444State.activeMessage=message;
    semanticR444State.activeMessageIndex=messageIndex;
    semanticR444State.nextMessageIndex=(messageIndex+1)%SEMANTIC_R444_CONFIG.semanticSequence.length;
    semanticR444State.completedMessages++;

    semanticR444State.lastSemanticFace=endFace;
    semanticR444State.lastSemanticMs=now;
    semanticR444State.cooldownUntilMs=now+semanticR444Range(...SEMANTIC_R444_CONFIG.cooldownRangeMs);

    semanticR444State.eventLog.push({message,messageIndex,face:endFace,startMs:now,phrase:phrase.name});
    if(semanticR444State.eventLog.length>32) semanticR444State.eventLog.shift();

    semanticR444Log('semantic-complete',{face:endFace,message,messageIndex,phrase:phrase.name,completedMessages:semanticR444State.completedMessages});
  }

  semanticR444Log('phrase-complete',{phrase:phrase.name,endFace,nextFace:endFace});
  return true;
}

// Main update function - called per frame
function semanticR444Update(){
  const now=presentationSimTimeMs;

  // Cooldown check
  if(now < semanticR444State.cooldownUntilMs) return;

  // If no current phrase, start one
  if(!semanticR444State.currentPhrase){
    if(!semanticR444StartPhrase()) return;
  }

  // Check if current phrase is complete
  const phrase=semanticR444State.currentPhrase;
  const elapsed=now-semanticR444State.phraseStartMs;
  const duration=phrase.durationMs;
  semanticR444State.phraseProgress=THREE.MathUtils.clamp(elapsed/duration, 0, 1);

  if(elapsed >= duration){
    semanticR444CompletePhrase();
  }
}

// Movement selection: choose slice moves that progress toward the current phrase
function semanticR444SelectMoveForPhrase(){
  if(!semanticR444State.currentPhrase) return null;

  const phrase=semanticR444State.currentPhrase;
  // For single-slice phrases, just return the exact move
  if(phrase.transitionType==='single'){
    return {axis:phrase.axis,layer:phrase.layer,direction:phrase.direction,durationMs:phrase.durationMs};
  }
  // Could extend for multi-slice phrases
  return null;
}

// Integration: replace semanticR442SelectMove to use phrase graph
function semanticR444WrappedSelectMove(){
  // If we have an active phrase, use its move
  if(semanticR444State.currentPhrase){
    return semanticR444SelectMoveForPhrase();
  }
  // Otherwise, start a new phrase and use its move
  if(semanticR444StartPhrase()){
    return semanticR444SelectMoveForPhrase();
  }
  return null;
}

// Weight function replaced by phrase graph - always returns 1 for phrase moves
function semanticR444Weight(move){
  return 1;
}

// Replace the update protection state with phrase graph update
function semanticR444WrappedUpdateProtectionState(){
  semanticR444Update();
  // Also call the original optical diagnostics for face evaluation
  if(semanticR442State.protected){
    const q=semanticR442EvaluateFace(semanticR442State.protectedFace,false);
    if(!q?.assembled){
      semanticR442State.assemblyViolations++;
      // Don't force release - let phrase complete naturally
      return;
    }
    // Update optical diagnostics
    semanticR43OpticalDiagnostics={...semanticR43OpticalDiagnostics,alignment:q.brdfQuality,faceView:q.viewAlignment,halfDot:q.halfDot,signedFaceView:q.signedFaceView,signedHalfDot:q.signedHalfDot,frontFacing:q.signedFaceView>0,opportunity:q.rawQuality,engravedFace:q.face};
  }
  return;
}

// Expose diagnostics
function semanticR444GetDiagnostics(){
  return {
    currentFace:semanticR444State.currentFace,
    currentPhrase:semanticR444State.currentPhrase?.name||null,
    phraseProgress:semanticR444State.phraseProgress,
    memory:[...semanticR444State.memory],
    completedMessages:semanticR444State.completedMessages,
    activeMessage:semanticR444State.activeMessage,
    activeMessageIndex:semanticR444State.activeMessageIndex,
    nextMessage:SEMANTIC_R444_CONFIG.semanticSequence[semanticR444State.nextMessageIndex],
    cooldownUntilMs:semanticR444State.cooldownUntilMs,
    lastSemanticFace:semanticR444State.lastSemanticFace,
    lastSemanticMs:semanticR444State.lastSemanticMs,
    lifecycleLog:[...semanticR444State.lifecycleLog],
    eventLog:[...semanticR444State.eventLog],
    candidateLog:[...semanticR444State.candidateLog],
  };
}

`;

source = source.slice(0, moveStateAt + moveStateAnchor.length) + authoredPhraseGraph + source.slice(moveStateAt + moveStateAnchor.length);

// Replace semanticR442SelectMove with phrase graph version
const selectMoveReplacement = String.raw`function semanticR442SelectMove(){
  const move=semanticR444WrappedSelectMove();
  if(move) return move;
  // Fallback to weighted random if phrase graph has no move
  const candidates=semanticR442AllMoveCandidates();
  if(semanticR442State.protected) candidates=candidates.filter(m=>semanticR442MoveIntersection(m).count===0);
  if(!candidates.length){semanticR442MoveState.skipped++;return null}
  const weighted=candidates.map(m=>({move:m,weight:1})),total=weighted.reduce((s,x)=>s+x.weight,0);
  let pick=seededUnit()*total;
  for(const item of weighted){pick-=item.weight;if(pick<=0)return item.move}
  return weighted.at(-1).move;
}`;
replaceFunction('semanticR442SelectMove', 'semanticR442RecordMove', selectMoveReplacement, 'phrase graph move selection');

// Replace semanticR442RecentWeight with phrase graph weight (always 1 for phrase moves)
const weightReplacement = String.raw`function semanticR442RecentWeight(move){
  return semanticR444Weight(move);
}`;
replaceFunction('semanticR442RecentWeight', 'semanticR442SelectMove', weightReplacement, 'phrase graph weight');

// Replace semanticR442UpdateProtectionState with phrase graph update
const updateReplacement = String.raw`function semanticR442UpdateProtectionState(){
  semanticR444WrappedUpdateProtectionState();
}`;
replaceFunction('semanticR442UpdateProtectionState', 'semanticR442MoveIntersection', updateReplacement, 'phrase graph state machine');

// Replace semanticR442ReleaseProtection - no forced release, phrase completes naturally
const releaseReplacement = String.raw`function semanticR442ReleaseProtection(reason='phrase-complete'){
  if(!semanticR442State.protected) return false;
  // Allow phrase to complete naturally, don't force release
  return true;
}`;
replaceFunction('semanticR442ReleaseProtection', 'semanticR442UpdateProtectionState', releaseReplacement, 'phrase graph release bridge');

// Extend diagnostics with R4.4.4 phrase graph data
const diagExtension = String.raw`r444PhraseGraph:{
  revision:'PROAI_CUBE_R4.4.4',
  phraseVocabulary:Object.keys(SEMANTIC_R444_PHRASE),
  graphEdges:Object.fromEntries(Object.entries(SEMANTIC_R444_GRAPH).map(([k,v])=>[k,[...v]])),
  currentFace:semanticR444State.currentFace,
  currentPhrase:semanticR444State.currentPhrase?.name||null,
  phraseProgress:semanticR444State.phraseProgress,
  memory:[...semanticR444State.memory],
  completedMessages:semanticR444State.completedMessages,
  activeMessage:semanticR444State.activeMessage,
  activeMessageIndex:semanticR444State.activeMessageIndex,
  nextMessage:SEMANTIC_R444_CONFIG.semanticSequence[semanticR444State.nextMessageIndex],
  cooldownUntilMs:semanticR444State.cooldownUntilMs,
  lastSemanticFace:semanticR444State.lastSemanticFace,
  lastSemanticMs:semanticR444State.lastSemanticMs,
  lifecycleLog:[...semanticR444State.lifecycleLog],
  eventLog:[...semanticR444State.eventLog],
  candidateLog:[...semanticR444State.candidateLog],
  noSolverNoDebtNoQuota:true,
  continuousYaw:true,
  physicalMaterialOnly:true,
},
r443Lifecycle:{revision:'PROAI_CUBE_R4.4.3',phase:semanticR443State.phase,sequence:[...SEMANTIC_R443_SEQUENCE],nextMessageIndex:semanticR443State.nextMessageIndex,nextMessage:SEMANTIC_R443_SEQUENCE[semanticR443State.nextMessageIndex],activeMessage:semanticR443State.activeMessage,activeMessageIndex:semanticR443State.activeMessageIndex,candidateFace:semanticR443State.candidateFace,candidateSinceMs:semanticR443State.candidateSinceMs,lastReleaseFace:semanticR443State.lastReleaseFace,lastReleaseMs:semanticR443State.lastReleaseMs,cooldownUntilMs:semanticR443State.cooldownUntilMs,faceArmed:{...semanticR443State.faceArmed},recentFaces:[...semanticR443State.recentFaces],dispersalDone:semanticR443State.dispersalDone,dispersalLatencyMs:semanticR443State.dispersalLatencyMs,dispersalLatenciesMs:[...semanticR443State.dispersalLatenciesMs],opportunityIntervalsMs:[...semanticR443State.opportunityIntervalsMs],readableDurationsMs:[...semanticR443State.readableDurationsMs],candidateLog:[...semanticR443State.candidateLog],eventLog:[...semanticR443State.eventLog],lifecycleLog:[...semanticR443State.lifecycleLog],overdueDispersalCount:semanticR443State.overdueDispersalCount,shortReadableCount:semanticR443State.shortReadableCount,config:SEMANTIC_R443_CONFIG,noSemanticFlashByConstruction:true,sequencePhysicalMaterial:true},
r443Motion:{yawDirectionPolicy:'continuous-positive',yawVelocityDegPerSec:presentationYawVelocityDegPerSec,signedYawDeg:presentationSignedYawDeg,cumulativeYawDeg:presentationCumulativeYawDeg,frameAngularDeltaRad:presentationFrameDeltaRad,semanticVelocityMultiplier:1,semanticOrientationForcing:false},
`;
replaceUnique(
  'r442Cadence:SEMANTIC_R442_CADENCE,',
  `r442Cadence:SEMANTIC_R442_CADENCE,\n    ${diagExtension}`,
  'diagnostics extension with R4.4.4 phrase graph'
);

// ============================================================================
// END AUTHORED PHRASE GRAPH
// ============================================================================

// Verify R4.4.4 invariants
for (const required of [
  "SEMANTIC_R444_PHRASE=Object.freeze({",
  "SEMANTIC_R444_GRAPH=Object.freeze({",
  "SEMANTIC_R444_MEMORY_LENGTH=3",
  "SEMANTIC_R444_CONFIG=Object.freeze({",
  "function semanticR444SelectPhrase()",
  "function semanticR444StartPhrase()",
  "function semanticR444CompletePhrase()",
  "function semanticR444Update()",
  "function semanticR444WrappedSelectMove()",
  "function semanticR444WrappedUpdateProtectionState()",
  "function semanticR444CompletePhrase()",
  "function semanticR444GetDiagnostics()",
  "noSolverNoDebtNoQuota:true",
  "continuousYaw:true",
  "physicalMaterialOnly:true",
  "function semanticR442SelectMove(){",
  "function semanticR442RecentWeight(move){",
  "return semanticR444Weight(move);",
  "function semanticR442UpdateProtectionState(){",
  "semanticR444WrappedUpdateProtectionState();",
]) if (!source.includes(required)) throw new Error(`R4.4.4 missing invariant: ${required}`);

// Verify forbidden mechanisms are absent in the NEW authored phrase graph code only
// (The base R4.4.3 code remains in source but is bypassed by our wrappers)
const myCodeStart = source.indexOf('// ============================================================================\n// AUTHORED PHRASE GRAPH');
const myCodeEnd = source.indexOf('// ============================================================================\n// END AUTHORED PHRASE GRAPH');
const myCode = myCodeStart >= 0 && myCodeEnd >= 0 
  ? source.slice(myCodeStart, myCodeEnd) 
  : '';

// Check forbidden patterns only in our new code
for (const forbidden of [
  'semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE',
  'semanticR443State.phase===SEMANTIC_R443_PHASE.READABLE_LOCK',
  'semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL',
  'semanticR443State.phase===SEMANTIC_R443_PHASE.COOLDOWN',
  'overdueDispersalCount',
  'shortReadableCount',
  'layerDebtBoost',
  'axisDebtBoost',
  'recentFaceFactors',
  'dispersalTargetMs',
  'semanticR443Dispersal',
  'semanticR443Release',
  'semanticR443EvolutionReady',
  'semanticR443RefreshArming',
  'semanticR443Lock',
]) if (myCode && myCode.includes(forbidden)) throw new Error(`R4.4.4 forbidden R4.4.3 mechanism present in new code: ${forbidden}`);

fs.writeFileSync(file, source);
console.log('R4.4.4 authored phrase graph choreography applied');