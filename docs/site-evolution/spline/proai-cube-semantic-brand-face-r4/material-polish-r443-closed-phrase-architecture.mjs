import fs from 'node:fs';

const AXES=['X','Y','Z'];
const LAYERS=[-1,0,1];
const ELIGIBLE_FACES=['+Z','+X','-X'];
const FACE_AXIS={'+Z':['Z',1],'+X':['X',1],'-X':['X',-1]};
const move=(axis,layer,direction)=>Object.freeze({axis,layer,direction});
const inverseMove=m=>({axis:m.axis,layer:m.layer,direction:-m.direction});
const inverseWord=word=>[...word].reverse().map(inverseMove);
const sameMove=(a,b)=>!!a&&!!b&&a.axis===b.axis&&a.layer===b.layer&&a.direction===b.direction;
const exactInverse=(a,b)=>!!a&&!!b&&a.axis===b.axis&&a.layer===b.layer&&a.direction===-b.direction;

const MASTER_WORD=Object.freeze([
  move('Z',0,1),move('Y',0,1),move('X',1,-1),move('Y',-1,-1),move('X',1,-1),
]);
const MASTER_ORDER=12;
const BASE_PHRASE_LENGTHS=Object.freeze([6,5,3,4,3,6,4,4,3,4,6,6,6]);
const MASTER_STREAM=Object.freeze(Array.from({length:MASTER_ORDER},()=>MASTER_WORD).flat());
function gestureMeta(id,moves){
  const axisSequence=moves.map(m=>m.axis).join('');
  const axisCounts=Object.fromEntries(AXES.map(axis=>[axis,moves.filter(m=>m.axis===axis).length]));
  const dominantCount=Math.max(...Object.values(axisCounts));
  const dominantAxes=AXES.filter(axis=>axisCounts[axis]===dominantCount);
  const dominantAxis=dominantAxes.length===1?dominantAxes[0]:'MIXED';
  const centerUsage=moves.filter(m=>m.layer===0).length;
  const outerPattern=moves.map(m=>m.layer===0?'C':(m.layer<0?'N':'P')).join('');
  const directionPattern=moves.map(m=>m.direction>0?'+':'-').join('');
  return Object.freeze({gestureClass:`${axisSequence}:${outerPattern}`,axisSequence,dominantAxis,centerUsage,outerPattern,directionPattern,staggerPairs:Object.freeze([])});
}
let phraseCursor=0;
const BASE_ARCHETYPES=Object.freeze(BASE_PHRASE_LENGTHS.map((length,index)=>{
  const moves=Object.freeze(MASTER_STREAM.slice(phraseCursor,phraseCursor+length));phraseCursor+=length;
  const sourceState=`S${String(index).padStart(2,'0')}`;
  const destinationState=index===BASE_PHRASE_LENGTHS.length-1?'S00':`S${String(index+1).padStart(2,'0')}`;
  const id=`VISUAL_${String(index+1).padStart(2,'0')}`;
  return Object.freeze({id,sourceState,destinationState,moves,...gestureMeta(id,moves)});
}));
if(phraseCursor!==MASTER_STREAM.length)throw new Error(`visual phrase segmentation ${phraseCursor}/${MASTER_STREAM.length}`);
const skip=(id,firstIndex,secondIndex)=>{
  const first=BASE_ARCHETYPES[firstIndex],second=BASE_ARCHETYPES[secondIndex];
  if(first.destinationState!==second.sourceState)throw new Error(`skip ${id} discontinuity`);
  const moves=Object.freeze([...first.moves,...second.moves]);
  if(moves.length>7)throw new Error(`skip ${id} too long ${moves.length}`);
  return Object.freeze({id,sourceState:first.sourceState,destinationState:second.destinationState,moves,...gestureMeta(id,moves)});
};
const CORE_ARCHETYPES=Object.freeze([
  ...BASE_ARCHETYPES,
  skip('VISUAL_SKIP_03_04',2,3),
  skip('VISUAL_SKIP_08_09',7,8),
  skip('VISUAL_SKIP_09_10',8,9),
]);

function identityMatrix(){return [1,0,0,0,1,0,0,0,1]}
function matMul(a,b){const r=new Array(9).fill(0);for(let y=0;y<3;y++)for(let x=0;x<3;x++)for(let k=0;k<3;k++)r[y*3+x]+=a[y*3+k]*b[k*3+x];return r}
function matVec(m,v){return [m[0]*v[0]+m[1]*v[1]+m[2]*v[2],m[3]*v[0]+m[4]*v[1]+m[5]*v[2],m[6]*v[0]+m[7]*v[1]+m[8]*v[2]]}
function quarterMatrix(axis,d){if(axis==='X')return [1,0,0,0,0,-d,0,d,0];if(axis==='Y')return [0,0,d,0,1,0,-d,0,0];return [0,-d,0,d,0,0,0,0,1]}
function coordKey(v){return v.join(',')}
function cubeHome(){const cubies=[];for(const x of LAYERS)for(const y of LAYERS)for(const z of LAYERS)cubies.push({origin:[x,y,z],pos:[x,y,z],ori:identityMatrix()});return cubies}
function cloneState(state){return state.map(c=>({origin:[...c.origin],pos:[...c.pos],ori:[...c.ori]}))}
function applyAbstractMove(state,m){const idx=m.axis==='X'?0:m.axis==='Y'?1:2,R=quarterMatrix(m.axis,m.direction);for(const c of state){if(c.pos[idx]!==m.layer)continue;c.pos=matVec(R,c.pos);c.ori=matMul(R,c.ori)}return state}
function applyAbstractWord(state,word){for(const m of word)applyAbstractMove(state,m);return state}
function stateSignature(state){return state.map(c=>`${coordKey(c.origin)}>${coordKey(c.pos)}:${c.ori.join('')}`).join('|')}
function abstractFaceAssembled(state,face){const [axis,sign]=FACE_AXIS[face],idx=axis==='X'?0:axis==='Y'?1:2,normal=[0,0,0];normal[idx]=sign;for(const c of state){if(c.origin[idx]!==sign)continue;if(coordKey(c.origin)!==coordKey(c.pos))return false;const n=matVec(c.ori,normal);if(coordKey(n)!==coordKey(normal))return false}return true}
function wordHasImmediateInverse(word){for(let i=1;i<word.length;i++)if(exactInverse(word[i-1],word[i]))return true;return false}
function maxSameAxis(word){let max=0,run=0,last=null;for(const m of word){run=m.axis===last?run+1:1;last=m.axis;max=Math.max(max,run)}return max}
function validateClosedPhraseLibrary(){
  if(CORE_ARCHETYPES.length!==16)throw new Error(`visual phrase archetype count ${CORE_ARCHETYPES.length}`);
  if(BASE_ARCHETYPES.length!==13)throw new Error(`visual base phrase count ${BASE_ARCHETYPES.length}`);
  const home=cubeHome(),homeSig=stateSignature(home),safeStates=new Map([['S00',{id:'S00',signature:homeSig,assembledFaces:[...ELIGIBLE_FACES]}]]);
  let state=cloneState(home);
  for(let i=0;i<BASE_ARCHETYPES.length-1;i++){
    applyAbstractWord(state,BASE_ARCHETYPES[i].moves);
    const id=BASE_ARCHETYPES[i].destinationState,sig=stateSignature(state);
    if(sig===homeSig)throw new Error(`visual state ${id} closes early`);
    if(safeStates.has(id))throw new Error(`duplicate visual state ${id}`);
    safeStates.set(id,{id,signature:sig,assembledFaces:ELIGIBLE_FACES.filter(face=>abstractFaceAssembled(state,face))});
  }
  applyAbstractWord(state,BASE_ARCHETYPES.at(-1).moves);
  if(stateSignature(state)!==homeSig)throw new Error('visual state ring does not close to HOME');
  if(safeStates.size!==13)throw new Error(`visual safe-state count ${safeStates.size}`);
  for(const phrase of CORE_ARCHETYPES){
    if(wordHasImmediateInverse(phrase.moves))throw new Error(`${phrase.id} contains immediate inverse`);
    if(maxSameAxis(phrase.moves)>2)throw new Error(`${phrase.id} same-axis streak >2`);
    const source=safeStates.get(phrase.sourceState),destination=safeStates.get(phrase.destinationState);
    if(!source||!destination)throw new Error(`${phrase.id} unknown transition state`);
    let src=cloneState(home);
    if(phrase.sourceState!=='S00'){
      const targetIndex=Number(phrase.sourceState.slice(1));
      for(let i=0;i<targetIndex;i++)applyAbstractWord(src,BASE_ARCHETYPES[i].moves);
    }
    const after=stateSignature(applyAbstractWord(src,phrase.moves));
    if(after!==destination.signature)throw new Error(`${phrase.id} invalid authored transition ${phrase.sourceState}->${phrase.destinationState}`);
  }
  const axes=new Set(MASTER_STREAM.map(m=>m.axis)),layers=new Set(MASTER_STREAM.map(m=>m.layer));
  if(axes.size!==3||layers.size!==3)throw new Error('visual master stream lacks axis/layer coverage');
  if(maxSameAxis(MASTER_STREAM)>2)throw new Error('visual master stream same-axis streak >2');
  for(let i=1;i<MASTER_STREAM.length;i++)if(exactInverse(MASTER_STREAM[i-1],MASTER_STREAM[i]))throw new Error(`visual master stream immediate inverse ${i}`);
  if(exactInverse(MASTER_STREAM.at(-1),MASTER_STREAM[0]))throw new Error('visual master stream cyclic immediate inverse');
  const outgoing={};
  for(const p of CORE_ARCHETYPES)(outgoing[p.sourceState]??=[]).push(p.id);
  return Object.freeze({
    coreArchetypeCount:CORE_ARCHETYPES.length,
    generatedValidatedPhraseVariants:CORE_ARCHETYPES.length,
    normalGeneratedVariants:CORE_ARCHETYPES.length,
    safetyGeneratedVariants:0,
    macroStateCount:safeStates.size,
    phraseHistoryDepth:3,
    architecture:'CURATED_VISUAL_SAFE_STATE_RING',
    masterOrder:MASTER_ORDER,
    masterMoveCount:MASTER_STREAM.length,
    maxMasterSameAxisStreak:maxSameAxis(MASTER_STREAM),
    safeStates:[...safeStates.values()].map(({signature,...rest})=>rest),
    outgoing,
  });
}

const VALIDATION=validateClosedPhraseLibrary();
if(process.argv.includes('--validate-library-only')){
  console.log(JSON.stringify(VALIDATION,null,2));
  process.exit(0);
}

const file=new URL('./main.generated.js',import.meta.url);
let source=fs.readFileSync(file,'utf8');
const replaceBetween=(startToken,endToken,replacement,label)=>{const start=source.indexOf(startToken),end=source.indexOf(endToken,start+startToken.length);if(start<0||end<0||source.indexOf(startToken,start+1)>=0)throw new Error(`R4.4.3 closed phrase ${label}: ${start}/${end}`);source=source.slice(0,start)+replacement+source.slice(end)};
const replaceUnique=(find,replacement,label)=>{const at=source.indexOf(find),next=at>=0?source.indexOf(find,at+find.length):-1;if(at<0||next>=0)throw new Error(`R4.4.3 closed phrase ${label}: ${at}/${next}`);source=source.slice(0,at)+replacement+source.slice(at+find.length)};

for(const required of[
  "SEMANTIC_R442_ELIGIBLE_FACES=Object.freeze(['+Z','+X','-X'])",
  'R4_4_2_PHYSICAL_MICRO_ENGRAVED_',
  'bumpScale:-0.130,roughnessMapInk:0.550,metalnessDelta:0.0,tonalInk:0.820',
  'edgeRoughnessInk:.095',
  'r441HorizontalReductionPct:12.5',
  'r441VerticalReductionPct:10',
  'semanticVelocityMultiplier: 1.0',
  'const deltaMs=wallDeltaMs',
  "yawDirectionPolicy:'continuous-positive'",
  'semanticOrientationForcing:false',
  'overlayTextRendered:false',
  'alphaDominantReveal:false',
])if(!source.includes(required))throw new Error(`R4.4.3 closed phrase missing frozen invariant: ${required}`);

const runtimeArchetypes=JSON.stringify(CORE_ARCHETYPES.map(a=>({id:a.id,sourceState:a.sourceState,destinationState:a.destinationState,gestureClass:a.gestureClass,axisSequence:a.axisSequence,dominantAxis:a.dominantAxis,centerUsage:a.centerUsage,outerPattern:a.outerPattern,directionPattern:a.directionPattern,staggerPairs:a.staggerPairs,moves:a.moves})));
const runtimeValidation=JSON.stringify(VALIDATION);

const lifecycle=String.raw`const SEMANTIC_R443_PHASE=Object.freeze({NORMAL:'NORMAL',CANDIDATE:'CANDIDATE',READABLE:'READABLE',RELEASE:'RELEASE'});
const SEMANTIC_R443_SEQUENCE=Object.freeze(['ProAI Expert','TRUST','INQUIRY','RESPONSE','RESULT']);
const SEMANTIC_R443_TYPOGRAPHY=Object.freeze({fontFamily:'Instrument Sans Variable',fontWeight:620,targetBlockWidthRatio:.722,scaleX:.875,scaleY:.900});
const SEMANTIC_R443_CONFIG=Object.freeze({firstSemanticEligibleMs:3200,stageScoreMin:.12,stageScoreMax:.59,stageViewMin:.36,stageAreaMin:.20,stageBrdfMin:0,stageAbortScore:0,stageTimeoutMs:3800,candidateApproachScore:.58,candidateApproachView:.46,candidateDwellMs:80,enterScore:.64,enterView:.52,enterArea:.26,enterBrdf:.18,exitScore:.54,exitView:.50,releaseDebounceMs:90,maxReadableHoldMs:1600,rearmScore:.50,breathingRangeMs:[5000,7000],longGapWarningMs:24000,longReadableWarningMs:2200,recentFaceDepth:2});
const SEMANTIC_R443_CLOSED_VALIDATION=Object.freeze(${runtimeValidation});
const SEMANTIC_R443_CLOSED_ARCHETYPES=Object.freeze(${runtimeArchetypes});
const semanticR443State={phase:SEMANTIC_R443_PHASE.NORMAL,stagedFace:null,stagedMessageIndex:null,stagedSinceMs:null,candidateFace:null,candidateSinceMs:null,candidatePeakScore:0,activeMessage:null,activeMessageIndex:null,nextMessageIndex:0,lastReadableStartMs:null,lastReleaseMs:-Infinity,lastReleaseFace:null,nextEligiblePresentationMs:SEMANTIC_R443_CONFIG.firstSemanticEligibleMs,cooldownUntilMs:SEMANTIC_R443_CONFIG.firstSemanticEligibleMs,opportunityIntervalsMs:[],readableDurationsMs:[],faceArmed:{'+Z':true,'+X':true,'-X':true},recentFaces:[],lifecycleLog:[],candidateLog:[],eventLog:[],semanticSeed:0x443c0de,shortReadableCount:0,semanticFlashCount:0,longReadableWarnings:0,longGapWarnings:0,dispersalDone:true,dispersalLatencyMs:null,dispersalLatenciesMs:[],overdueDispersalCount:0,stageCount:0,stageCancelCount:0};
const semanticR443ClosedState={safeStateId:'S00',phraseHistory:[],visibleMoves:[],phraseCount:0,normalPhraseCount:0,safetyPhraseCount:0,phraseDecisionCount:0,protectionAlterations:0,sameFamilyAdjacency:0,highSimilaritySelections:0,currentFamilyRun:0,maxFamilyRun:0,phraseActive:false,currentPhraseId:null,unexpectedUnsafeStarts:0,releasedFaceForcedMoves:0,breathCounter:3}
;
function semanticR443Log(type,data={}){semanticR443State.lifecycleLog.push({type,presentationMs:presentationSimTimeMs,phase:semanticR443State.phase,...data});if(semanticR443State.lifecycleLog.length>192)semanticR443State.lifecycleLog.shift()}
function semanticR443Unit(){let x=semanticR443State.semanticSeed>>>0;x^=(x<<13)>>>0;x^=x>>>17;x^=(x<<5)>>>0;semanticR443State.semanticSeed=x>>>0;return semanticR443State.semanticSeed/4294967296}
function semanticR443Range(min,max){return min+(max-min)*semanticR443Unit()}
function semanticR443FaceClearOfActiveTurns(face){if(!face)return false;for(const turn of activeTurns.values())if(semanticR442MoveIntersection({axis:turn.axis,layer:turn.layer},face).count>0)return false;return true}
function semanticR443CreateWordMask(text){const size=2048,raw=document.createElement('canvas');raw.width=size;raw.height=size;const ctx=raw.getContext('2d',{alpha:true});ctx.clearRect(0,0,size,size);ctx.fillStyle='#ffffff';ctx.textAlign='center';ctx.textBaseline='alphabetic';const targetWidth=size*SEMANTIC_R443_TYPOGRAPHY.targetBlockWidthRatio;let low=120,high=900;for(let i=0;i<20;i++){const mid=(low+high)*.5;ctx.font=SEMANTIC_R443_TYPOGRAPHY.fontWeight+' '+mid+'px "'+SEMANTIC_R443_TYPOGRAPHY.fontFamily+'"';if(ctx.measureText(text).width<targetWidth)low=mid;else high=mid}const fontPx=(low+high)*.5;ctx.font=SEMANTIC_R443_TYPOGRAPHY.fontWeight+' '+fontPx+'px "'+SEMANTIC_R443_TYPOGRAPHY.fontFamily+'"';const m=ctx.measureText(text),ascent=m.actualBoundingBoxAscent||fontPx*.72,descent=m.actualBoundingBoxDescent||fontPx*.18,baseline=size*.5+(ascent-descent)*.5;ctx.fillText(text,size*.5,baseline);const scaled=document.createElement('canvas');scaled.width=size;scaled.height=size;const sc=scaled.getContext('2d',{alpha:true}),dw=size*SEMANTIC_R443_TYPOGRAPHY.scaleX,dh=size*SEMANTIC_R443_TYPOGRAPHY.scaleY;sc.clearRect(0,0,size,size);sc.drawImage(raw,(size-dw)*.5,(size-dh)*.5,dw,dh);const texture=new THREE.CanvasTexture(scaled);texture.colorSpace=THREE.NoColorSpace;texture.minFilter=THREE.LinearFilter;texture.magFilter=THREE.LinearFilter;texture.generateMipmaps=true;texture.needsUpdate=true;texture.userData.semanticR443TypographyScale={x:SEMANTIC_R443_TYPOGRAPHY.scaleX,y:SEMANTIC_R443_TYPOGRAPHY.scaleY,message:text};return createSeamAwareBrandMaskTexture(texture,semanticR443FaceSpan())}
function semanticR443FaceSpan(){const spanY=Math.abs(latticeCenters.Y[2]-latticeCenters.Y[0])+GEOMETRY_R1.faceOuterSize,spanZ=Math.abs(latticeCenters.Z[2]-latticeCenters.Z[0])+GEOMETRY_R1.faceOuterSize;return Math.min(spanY,spanZ)*.998}
const semanticR443GlobalMaskCache=new Map();
function semanticR443GlobalMask(index){if(index===0)return semanticMaskTexture;if(semanticR443GlobalMaskCache.has(index))return semanticR443GlobalMaskCache.get(index);const texture=semanticR443CreateWordMask(SEMANTIC_R443_SEQUENCE[index]);semanticR443GlobalMaskCache.set(index,texture);return texture}
function semanticR443DisposeTileResources(tile){const m=tile.material,items=[tile.mask,tile.rough,m.userData.semanticBeveledBump,m.userData.semanticToneMap],seen=new Set();for(const t of items){if(!t||seen.has(t)||t===m.userData.semanticBaseMap)continue;seen.add(t);t.dispose?.()}}
function semanticR443ApplyMessage(face,index){const reg=semanticR442FaceRegistry.get(face);if(!reg)return false;const message=SEMANTIC_R443_SEQUENCE[index],globalMask=semanticR443GlobalMask(index);for(const tile of reg.tiles){const m=tile.material,current=m.userData.semanticR443MessageIndex;if(current===index)continue;if(current===undefined&&index===0){m.userData.semanticR443MessageIndex=0;m.userData.semanticR443Message=message;continue}semanticR443DisposeTileResources(tile);const mask=createSemanticR442TileMask(globalMask,face,tile.origin),rough=createSemanticR441PearlRoughnessTile(mask),bevel=createSemanticR442BevelTile(mask),tone=createSemanticR442ToneTile(mask);tile.mask=mask;tile.rough=rough;m.bumpMap=bevel;m.userData.semanticTileMask=mask;m.userData.semanticBeveledBump=bevel;m.userData.semanticRoughnessMap=rough;m.userData.semanticToneMap=tone;m.userData.semanticR443MessageIndex=index;m.userData.semanticR443Message=message;m.needsUpdate=true}semanticR443State.activeMessage=message;semanticR443State.activeMessageIndex=index;return true}
function semanticR443RefreshArming(){for(const face of SEMANTIC_R442_ELIGIBLE_FACES){const q=semanticR442EvaluateFace(face,false);if(!q||q.rawQuality<=SEMANTIC_R443_CONFIG.rearmScore||q.viewAlignment<=.42)semanticR443State.faceArmed[face]=true}}
function semanticR443RecentFaceBlocked(face){if(!semanticR443State.recentFaces.length)return false;return semanticR443State.recentFaces.at(-1)===face}
function semanticR443BestStageFace(){let list=SEMANTIC_R442_ELIGIBLE_FACES.map(face=>semanticR442EvaluateFace(face,true)).filter(q=>q&&q.assembled&&semanticR443State.faceArmed[q.face]&&semanticR443FaceClearOfActiveTurns(q.face)&&q.rawQuality>=SEMANTIC_R443_CONFIG.stageScoreMin&&q.rawQuality<SEMANTIC_R443_CONFIG.stageScoreMax&&q.viewAlignment>=SEMANTIC_R443_CONFIG.stageViewMin&&q.projectedAreaQuality>=SEMANTIC_R443_CONFIG.stageAreaMin&&q.brdfQuality>=SEMANTIC_R443_CONFIG.stageBrdfMin).sort((a,b)=>b.selectionScore-a.selectionScore);const nonRepeat=list.filter(q=>!semanticR443RecentFaceBlocked(q.face));if(nonRepeat.length)list=nonRepeat;semanticR442State.candidateScores=list.map(q=>({...q,closedPhraseStage:true}));return list[0]||null}
function semanticR443Unstage(reason='hidden-cancel'){const face=semanticR443State.stagedFace;if(semanticR442ActiveMaterialFace!==null){semanticR442SetActiveMaterialFace(null);semanticR442State.activeMaterialFace=null}semanticR443Log('stage-cancel',{face,reason});semanticR443State.stageCancelCount++;semanticR443State.stagedFace=null;semanticR443State.stagedMessageIndex=null;semanticR443State.stagedSinceMs=null;semanticR443State.candidateFace=null;semanticR443State.candidateSinceMs=null;semanticR443State.candidatePeakScore=0;semanticR443State.activeMessage=null;semanticR443State.activeMessageIndex=null;semanticR443State.phase=SEMANTIC_R443_PHASE.NORMAL}
function semanticR443Stage(q){const index=semanticR443State.nextMessageIndex,message=SEMANTIC_R443_SEQUENCE[index];if(!semanticR443ApplyMessage(q.face,index))return false;semanticR442SetActiveMaterialFace(q.face);semanticR442State.activeMaterialFace=q.face;semanticR443State.stagedFace=q.face;semanticR443State.stagedMessageIndex=index;semanticR443State.stagedSinceMs=presentationSimTimeMs;semanticR443State.stageCount++;semanticR443Log('stage',{face:q.face,message,messageIndex:index,quality:q.rawQuality});return true}
function semanticR443ResetCandidate(reason='optical-exit'){if(semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE)semanticR443Log('candidate-cancel',{face:semanticR443State.candidateFace,reason});semanticR443State.candidateFace=null;semanticR443State.candidateSinceMs=null;semanticR443State.candidatePeakScore=0;if(semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE)semanticR443State.phase=SEMANTIC_R443_PHASE.NORMAL}
function semanticR443Lock(q){if(!semanticR443State.stagedFace||q.face!==semanticR443State.stagedFace)return false;const now=presentationSimTimeMs,index=semanticR443State.stagedMessageIndex,message=SEMANTIC_R443_SEQUENCE[index];semanticR442State.protected=true;semanticR442State.protectedFace=q.face;semanticR442State.protectedSinceMs=now;semanticR442State.belowExitSinceMs=null;semanticR442State.protectionCount++;const reg=semanticR442FaceRegistry.get(q.face);if(reg)reg.lastUsedPresentationMs=now;semanticR442State.faceSelections.push({face:q.face,presentationMs:now,quality:q.rawQuality,view:q.viewAlignment,area:q.projectedAreaQuality,brdf:q.brdfQuality,message,messageIndex:index,stagedSinceMs:semanticR443State.stagedSinceMs});if(semanticR442State.faceSelections.length>32)semanticR442State.faceSelections.shift();if(semanticR443State.lastReadableStartMs!==null)semanticR443State.opportunityIntervalsMs.push(now-semanticR443State.lastReadableStartMs);semanticR443State.lastReadableStartMs=now;semanticR443State.phase=SEMANTIC_R443_PHASE.READABLE;semanticR443State.candidateFace=null;semanticR443State.candidateSinceMs=null;semanticR443State.eventLog.push({message,messageIndex:index,face:q.face,startMs:now,stagedMs:semanticR443State.stagedSinceMs,quality:q.rawQuality});if(semanticR443State.eventLog.length>32)semanticR443State.eventLog.shift();semanticR443Log('readable-start',{face:q.face,message,messageIndex:index,quality:q.rawQuality,stagedMs:semanticR443State.stagedSinceMs});return true}
function semanticR443Release(reason='stable-optical-exit'){if(!semanticR442State.protected)return false;const now=presentationSimTimeMs,start=semanticR442State.protectedSinceMs??now,face=semanticR442State.protectedFace,duration=Math.max(0,now-start),message=semanticR443State.activeMessage;semanticR442State.protectedIntervals.push({face,startMs:start,endMs:now,durationSec:duration/1000,reason,message});if(semanticR442State.protectedIntervals.length>32)semanticR442State.protectedIntervals.shift();semanticR443State.readableDurationsMs.push(duration);if(duration<600)semanticR443State.shortReadableCount++;if(duration<450)semanticR443State.semanticFlashCount++;semanticR442State.protected=false;semanticR442State.protectedFace=null;semanticR442State.protectedSinceMs=null;semanticR442State.belowExitSinceMs=null;semanticR442State.lastReleasedFace=face;semanticR442State.lastReleasedAtMs=now;semanticR442State.releaseCount++;semanticR443State.faceArmed[face]=false;semanticR443State.recentFaces.push(face);while(semanticR443State.recentFaces.length>SEMANTIC_R443_CONFIG.recentFaceDepth)semanticR443State.recentFaces.shift();if(semanticR442ActiveMaterialFace!==null){semanticR442SetActiveMaterialFace(null);semanticR442State.activeMaterialFace=null}semanticR443State.lastReleaseMs=now;semanticR443State.lastReleaseFace=face;semanticR443State.nextEligiblePresentationMs=now+semanticR443Range(...SEMANTIC_R443_CONFIG.breathingRangeMs);semanticR443State.cooldownUntilMs=semanticR443State.nextEligiblePresentationMs;semanticR443State.phase=SEMANTIC_R443_PHASE.RELEASE;semanticR443Log('release',{face,reason,durationMs:duration,message});semanticR443State.nextMessageIndex=(semanticR443State.nextMessageIndex+1)%SEMANTIC_R443_SEQUENCE.length;semanticR443State.stagedFace=null;semanticR443State.stagedMessageIndex=null;semanticR443State.stagedSinceMs=null;semanticR443State.activeMessage=null;semanticR443State.activeMessageIndex=null;return true}
function semanticR443GuardFace(){return semanticR443State.stagedFace||semanticR442State.protectedFace||semanticR443State.candidateFace||null}
`;

const lifecycleStart='const SEMANTIC_R443_PHASE=Object.freeze(';
const lifecycleEnd='const semanticMotionTrace=[];';
replaceBetween(lifecycleStart,lifecycleEnd,lifecycle,'semantic lifecycle replacement');

const update=String.raw`function semanticR442UpdateProtectionState(){const now=presentationSimTimeMs;semanticR443RefreshArming();if(semanticR443State.phase===SEMANTIC_R443_PHASE.READABLE){const face=semanticR442State.protectedFace,q=face?semanticR442EvaluateFace(face,false):null,elapsed=now-(semanticR442State.protectedSinceMs??now);if(!q?.assembled){semanticR442State.assemblyViolations++;semanticR443Log('tearing-violation',{face,reason:'assembly-lost-during-readable'});semanticR443Release('assembly-lost');return}if(elapsed>=SEMANTIC_R443_CONFIG.maxReadableHoldMs&&semanticR443FaceClearOfActiveTurns(face)){semanticR443Release('bounded-readable-window');return}if(elapsed>=SEMANTIC_R443_CONFIG.longReadableWarningMs&&!(semanticR443State.eventLog.at(-1)?.longReadableWarned)){semanticR443State.longReadableWarnings++;const e=semanticR443State.eventLog.at(-1);if(e)e.longReadableWarned=true;semanticR443Log('long-readable-warning',{face,elapsedMs:elapsed})}const readable=q.rawQuality>=SEMANTIC_R443_CONFIG.exitScore&&q.viewAlignment>=SEMANTIC_R443_CONFIG.exitView;if(readable)semanticR442State.belowExitSinceMs=null;else if(semanticR442State.belowExitSinceMs===null)semanticR442State.belowExitSinceMs=now;if(semanticR442State.belowExitSinceMs!==null&&now-semanticR442State.belowExitSinceMs>=SEMANTIC_R443_CONFIG.releaseDebounceMs){semanticR443Release('stable-optical-exit');return}semanticR43OpticalDiagnostics={...semanticR43OpticalDiagnostics,alignment:q.brdfQuality,faceView:q.viewAlignment,halfDot:q.halfDot,signedFaceView:q.signedFaceView,signedHalfDot:q.signedHalfDot,frontFacing:q.signedFaceView>0,opportunity:q.rawQuality,engravedFace:q.face};return}if(semanticR443State.phase===SEMANTIC_R443_PHASE.RELEASE){semanticR443State.phase=SEMANTIC_R443_PHASE.NORMAL;semanticR443ResetCandidate('release-complete');return}if(now<semanticR443State.nextEligiblePresentationMs){if(Number.isFinite(semanticR443State.lastReleaseMs)&&now-semanticR443State.lastReleaseMs>=SEMANTIC_R443_CONFIG.longGapWarningMs&&semanticR443State.longGapWarnings===0)semanticR443State.longGapWarnings++;return}if(semanticR443State.stagedFace){const face=semanticR443State.stagedFace,q=semanticR442EvaluateFace(face,true),age=now-(semanticR443State.stagedSinceMs??now);if(!q?.assembled){semanticR443Unstage('assembly-lost-before-readable');return}if(!semanticR443FaceClearOfActiveTurns(face))return;if(semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE){if(q.rawQuality<SEMANTIC_R443_CONFIG.candidateApproachScore||q.viewAlignment<SEMANTIC_R443_CONFIG.candidateApproachView){semanticR443ResetCandidate('optical-exit');if(q.rawQuality<=SEMANTIC_R443_CONFIG.stageAbortScore)semanticR443Unstage('hidden-after-candidate');return}semanticR443State.candidatePeakScore=Math.max(semanticR443State.candidatePeakScore,q.rawQuality);const dwell=now-(semanticR443State.candidateSinceMs??now),stable=q.rawQuality>=semanticR443State.candidatePeakScore-.035,enter=q.rawQuality>=SEMANTIC_R443_CONFIG.enterScore&&q.viewAlignment>=SEMANTIC_R443_CONFIG.enterView&&q.projectedAreaQuality>=SEMANTIC_R443_CONFIG.enterArea&&q.brdfQuality>=SEMANTIC_R443_CONFIG.enterBrdf;if(dwell>=SEMANTIC_R443_CONFIG.candidateDwellMs&&stable&&enter)semanticR443Lock(q);return}if(q.rawQuality>=SEMANTIC_R443_CONFIG.candidateApproachScore&&q.viewAlignment>=SEMANTIC_R443_CONFIG.candidateApproachView&&q.projectedAreaQuality>=SEMANTIC_R443_CONFIG.enterArea*.88&&q.brdfQuality>=SEMANTIC_R443_CONFIG.enterBrdf*.78){semanticR443State.phase=SEMANTIC_R443_PHASE.CANDIDATE;semanticR443State.candidateFace=face;semanticR443State.candidateSinceMs=now;semanticR443State.candidatePeakScore=q.rawQuality;semanticR443State.candidateLog.push({face,presentationMs:now,quality:q.rawQuality,view:q.viewAlignment,stagedMs:semanticR443State.stagedSinceMs});if(semanticR443State.candidateLog.length>64)semanticR443State.candidateLog.shift();semanticR443Log('candidate',{face,quality:q.rawQuality});return}if(age>=SEMANTIC_R443_CONFIG.stageTimeoutMs){semanticR443Unstage('stage-timeout');return}return}const best=semanticR443BestStageFace();if(best)semanticR443Stage(best)}
`;
replaceBetween('function semanticR442UpdateProtectionState(){','function semanticR442MoveIntersection(',update,'state machine');

const neutralWeight=String.raw`function semanticR442RecentWeight(move){return 1}
`;
replaceBetween('function semanticR442RecentWeight(move){','function semanticR442AllMoveCandidates(){',neutralWeight,'remove move-weight controllers');

const recordAndHelpers=String.raw`function semanticR442RecordMove(move,phase='closed-phrase',phraseId=null){
  const guard=semanticR443GuardFace(),intersection=guard?semanticR442MoveIntersection(move,guard):{count:0,ids:[]};
  if(guard&&intersection.count>0){semanticR442State.unsafeProtectedStarts++;semanticR443ClosedState.unexpectedUnsafeStarts++}
  semanticR442MoveState.recentMoves.push({axis:move.axis,layer:move.layer,direction:move.direction,presentationMs:presentationSimTimeMs,phase,phraseId});
  if(semanticR442MoveState.recentMoves.length>8)semanticR442MoveState.recentMoves.shift();
  semanticR442MoveState.axisCounts[move.axis]=(semanticR442MoveState.axisCounts[move.axis]||0)+1;
  semanticR442MoveState.layerCounts[String(move.layer)]=(semanticR442MoveState.layerCounts[String(move.layer)]||0)+1;
  semanticR442MoveState.selectionCount++;
  semanticR442MoveState.moveLog.push({presentationMs:presentationSimTimeMs,phase,phraseId,axis:move.axis,layer:move.layer,direction:move.direction,protected:semanticR442State.protected,protectedFace:semanticR442State.protectedFace,stagedFace:semanticR443State.stagedFace,semanticIntersection:intersection.count,r443Phase:semanticR443State.phase});
  if(semanticR442MoveState.moveLog.length>240)semanticR442MoveState.moveLog.shift();
  semanticR443ClosedState.visibleMoves.push({presentationMs:presentationSimTimeMs,phase,phraseId,axis:move.axis,layer:move.layer,direction:move.direction});
  if(semanticR443ClosedState.visibleMoves.length>240)semanticR443ClosedState.visibleMoves.shift();
  return intersection
}
async function waitForSliceAutonomy(){while(sliceSchedulerEnabled&&sliceAutonomyBlocked())await sleep(40);return sliceSchedulerEnabled}
async function schedulerDelay(durationMs){let elapsed=0,previous=performance.now();while(elapsed<durationMs&&sliceSchedulerEnabled){await sleep(Math.min(32,Math.max(8,durationMs-elapsed)));const now=performance.now(),delta=now-previous;previous=now;if(!sliceAutonomyBlocked())elapsed+=delta}}
function semanticR443ExactInverse(a,b){return!!a&&!!b&&a.axis===b.axis&&a.layer===b.layer&&a.direction===-b.direction}
function semanticR443GestureSimilarity(a,b){
  if(!a||!b)return 0;
  const aa=a.axisSequence||'',bb=b.axisSequence||'',n=Math.max(aa.length,bb.length)||1,m=Math.min(aa.length,bb.length);
  let score=0;
  for(let i=0;i<m;i++)if(aa[i]===bb[i])score+=.55;
  if(a.dominantAxis===b.dominantAxis)score+=.16*n;
  if(a.outerPattern===b.outerPattern)score+=.14*n;
  if(a.directionPattern===b.directionPattern)score+=.10*n;
  if(Math.abs((a.centerUsage||0)-(b.centerUsage||0))<=1)score+=.05*n;
  return Math.min(1,score/n)
}
function semanticR443RememberPhrase(meta){
  const prev=semanticR443ClosedState.phraseHistory.at(-1),similarity=prev?semanticR443GestureSimilarity(prev,meta):0;
  if(prev?.gestureClass===meta.gestureClass)semanticR443ClosedState.sameFamilyAdjacency++;
  if(similarity>=.72)semanticR443ClosedState.highSimilaritySelections++;
  if(prev?.gestureClass===meta.gestureClass)semanticR443ClosedState.currentFamilyRun++;else semanticR443ClosedState.currentFamilyRun=1;
  semanticR443ClosedState.maxFamilyRun=Math.max(semanticR443ClosedState.maxFamilyRun,semanticR443ClosedState.currentFamilyRun);
  semanticR443ClosedState.phraseHistory.push(meta);
  if(semanticR443ClosedState.phraseHistory.length>SEMANTIC_R443_CLOSED_VALIDATION.phraseHistoryDepth)semanticR443ClosedState.phraseHistory.shift()
}
function semanticR443ChooseNormalPhrase(){
  let candidates=SEMANTIC_R443_CLOSED_ARCHETYPES.filter(p=>p.sourceState===semanticR443ClosedState.safeStateId);
  if(!candidates.length)throw new Error('R4.4.3 visual state has no outgoing phrase '+semanticR443ClosedState.safeStateId);
  const last=semanticR443ClosedState.visibleMoves.at(-1);
  const boundarySafe=candidates.filter(p=>!semanticR443ExactInverse(last,p.moves[0]));
  if(boundarySafe.length)candidates=boundarySafe;else throw new Error('R4.4.3 visual state immediate-inverse dead end '+semanticR443ClosedState.safeStateId);
  if(candidates.length>1&&semanticR443ClosedState.phraseHistory.length){
    const scored=candidates.map(p=>({p,score:Math.max(...semanticR443ClosedState.phraseHistory.map(h=>semanticR443GestureSimilarity(h,p)))}));
    const min=Math.min(...scored.map(x=>x.score));
    candidates=scored.filter(x=>x.score<=min+.04).map(x=>x.p)
  }
  const p=candidates[Math.floor(seededUnit()*candidates.length)];
  return{id:p.id,coreId:p.id,moves:p.moves,sourceState:p.sourceState,destinationState:p.destinationState,gestureClass:p.gestureClass,axisSequence:p.axisSequence,dominantAxis:p.dominantAxis,centerUsage:p.centerUsage,outerPattern:p.outerPattern,directionPattern:p.directionPattern,staggerPairs:p.staggerPairs,safety:false}
}
function semanticR443AdvanceMacroState(phrase){semanticR443ClosedState.safeStateId=phrase.destinationState}
function semanticR443ClosedMetrics(){
  const moves=semanticR443ClosedState.visibleMoves,dist={1:0,2:0,3:0,'4-8':0};
  for(let i=0;i<moves.length;i++)for(let d=1;d<=8&&i-d>=0;d++)if(semanticR443ExactInverse(moves[i-d],moves[i])){if(d<=3)dist[d]++;else dist['4-8']++;break}
  let sameAxis=0,maxSameAxis=0,centerStreak=0,maxCenterStreak=0,center=0;
  for(let i=0;i<moves.length;i++){if(i&&moves[i].axis===moves[i-1].axis)sameAxis++;else sameAxis=1;maxSameAxis=Math.max(maxSameAxis,sameAxis);if(moves[i].layer===0){center++;centerStreak++}else centerStreak=0;maxCenterStreak=Math.max(maxCenterStreak,centerStreak)}
  return{totalVisibleMoves:moves.length,phraseCount:semanticR443ClosedState.phraseCount,normalPhraseCount:semanticR443ClosedState.normalPhraseCount,safetyPhraseCount:0,inverseDistance:dist,sameVisualGestureAdjacency:semanticR443ClosedState.sameFamilyAdjacency,recentHighSimilarityPhrases:semanticR443ClosedState.highSimilaritySelections,maxSameAxisStreak:maxSameAxis,centerOccupancy:moves.length?center/moves.length:0,maxCenterStreak,maxFamilyPhraseRun:semanticR443ClosedState.maxFamilyRun,protectionFootprint:semanticR443ClosedState.phraseDecisionCount?semanticR443ClosedState.protectionAlterations/semanticR443ClosedState.phraseDecisionCount:0,releasedFaceForcedMoves:semanticR443ClosedState.releasedFaceForcedMoves,macroState:{safeStateId:semanticR443ClosedState.safeStateId},validation:SEMANTIC_R443_CLOSED_VALIDATION}
}

`;

const recordStart="function semanticR442RecordMove(move,phase='forward'){";
const schedulerStart='async function sliceSchedulerLoop(){';
replaceBetween(recordStart,schedulerStart,recordAndHelpers,'record + scheduler helper consolidation');

const scheduler=String.raw`async function sliceSchedulerLoop(){
  if(sliceSchedulerRunning)return;
  sliceSchedulerRunning=true;
  await schedulerDelay(4800);
  while(sliceSchedulerEnabled){
    if(!await waitForSliceAutonomy())break;
    semanticR443ClosedState.phraseDecisionCount++;
    const phrase=semanticR443ChooseNormalPhrase();
    const lastVisible=semanticR443ClosedState.visibleMoves.at(-1);
    if(lastVisible&&semanticR443ExactInverse(lastVisible,phrase.moves[0])){semanticR443ClosedState.unexpectedUnsafeStarts++;throw new Error('R4.4.3 visual phrase immediate inverse boundary violation '+phrase.id)}
    semanticR443ClosedState.phraseActive=true;
    semanticR443ClosedState.currentPhraseId=phrase.id;
    semanticR443RememberPhrase(phrase);
    for(let i=0;i<phrase.moves.length&&sliceSchedulerEnabled;i++){
      if(!await waitForSliceAutonomy())break;
      const spec=phrase.moves[i],liveGuard=semanticR443GuardFace();
      if(liveGuard&&semanticR442MoveIntersection(spec,liveGuard).count>0){
        semanticR443ClosedState.protectionAlterations++;
        if(semanticR443State.phase===SEMANTIC_R443_PHASE.NORMAL&&semanticR443State.stagedFace===liveGuard){
          semanticR443Unstage('impending-intersecting-turn');
        }else{
          while(sliceSchedulerEnabled){
            const guardNow=semanticR443GuardFace();
            if(!guardNow||semanticR442MoveIntersection(spec,guardNow).count===0)break;
            await sleep(40)
          }
          if(!sliceSchedulerEnabled)break;
          if(!await waitForSliceAutonomy())break
        }
      }
      const move={...spec,durationMs:Math.round(seededRange(...SLICE_R1_2.turnDurationRangeMs))};
      semanticR442RecordMove(move,'visual-phrase',phrase.id);
      await turnSlice(move);
      if(i<phrase.moves.length-1)await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)))
    }
    semanticR443ClosedState.phraseActive=false;
    semanticR443ClosedState.currentPhraseId=null;
    semanticR443ClosedState.phraseCount++;
    semanticR443ClosedState.normalPhraseCount++;
    semanticR443AdvanceMacroState(phrase);
    sliceEventSerial+=phrase.moves.length;
    if(!sliceSchedulerEnabled)break;
    semanticR443ClosedState.breathCounter--;
    if(semanticR443ClosedState.breathCounter<=0){await schedulerDelay(Math.round(seededRange(1100,1900)));semanticR443ClosedState.breathCounter=seededInt(2,4)}
    else await schedulerDelay(Math.round(seededRange(420,760)))
  }
  semanticR443ClosedState.phraseActive=false;
  semanticR443ClosedState.currentPhraseId=null;
  sliceSchedulerRunning=false
}

`;
const ss=source.indexOf(schedulerStart),se=source.indexOf('sliceSchedulerRunning=false}',ss);if(ss<0||se<0||source.indexOf(schedulerStart,ss+1)>=0)throw new Error(`R4.4.3 closed phrase scheduler range ${ss}/${se}`);source=source.slice(0,ss)+scheduler+source.slice(se+'sliceSchedulerRunning=false}'.length);

const r443DiagnosticsAnchor='r443Motion:';
const r443DiagnosticsAt=source.indexOf(r443DiagnosticsAnchor),r443DiagnosticsNext=r443DiagnosticsAt>=0?source.indexOf(r443DiagnosticsAnchor,r443DiagnosticsAt+r443DiagnosticsAnchor.length):-1;
if(r443DiagnosticsAt>=0&&r443DiagnosticsNext<0){const extension=`r443ClosedPhrase:{architecture:'CURATED_VISUAL_SAFE_STATE_RING',lifoInverseStack:false,pendingResolutionGate:false,bridgeBeforeInverse:false,semanticDispersalWeighting:false,axisLayerDebt:false,phraseArchetypeCount:SEMANTIC_R443_CLOSED_VALIDATION.coreArchetypeCount,generatedValidatedPhraseVariants:SEMANTIC_R443_CLOSED_VALIDATION.generatedValidatedPhraseVariants,macroStateCount:SEMANTIC_R443_CLOSED_VALIDATION.macroStateCount,phraseHistoryDepth:SEMANTIC_R443_CLOSED_VALIDATION.phraseHistoryDepth,messageBearingFace:semanticR443State.stagedFace,stagedMessageIndex:semanticR443State.stagedMessageIndex,stagedSinceMs:semanticR443State.stagedSinceMs,semanticFlashCount:semanticR443State.semanticFlashCount,longReadableWarnings:semanticR443State.longReadableWarnings,metrics:semanticR443ClosedMetrics()},`;source=source.slice(0,r443DiagnosticsAt)+extension+source.slice(r443DiagnosticsAt)}else console.warn(`R4.4.3 closed phrase optional diagnostics unavailable: ${r443DiagnosticsAt}/${r443DiagnosticsNext}`);

for(const forbidden of[
  'semanticR443PendingResolutionCount',
  'w*=24','w*=32','w*=14','w*=7.5',
  'layerDebtBoost','axisDebtBoost',
  'SEMANTIC_R443_PHASE.DISPERSAL','SEMANTIC_R443_PHASE.COOLDOWN','SEMANTIC_R443_PHASE.READABLE_LOCK',
  "semanticR442RecordMove(inverse,'resolve')",
  'bridge-before-inverse',
])if(source.includes(forbidden))throw new Error(`R4.4.3 closed phrase unresolved rejected architecture: ${forbidden}`);
for(const required of[
  "SEMANTIC_R443_PHASE=Object.freeze({NORMAL:'NORMAL',CANDIDATE:'CANDIDATE',READABLE:'READABLE',RELEASE:'RELEASE'})",
  'const SEMANTIC_R443_CLOSED_ARCHETYPES=Object.freeze(',
  'function semanticR443ChooseNormalPhrase(){',
  'function semanticR443ClosedMetrics(){',
  "SEMANTIC_R442_ELIGIBLE_FACES=Object.freeze(['+Z','+X','-X'])",
  "yawDirectionPolicy:'continuous-positive'",
  'semanticVelocityMultiplier: 1.0',
  'const deltaMs=wallDeltaMs',
  'overlayTextRendered:false','alphaDominantReveal:false','semanticOrientationForcing:false',
])if(!source.includes(required))throw new Error(`R4.4.3 closed phrase missing final invariant: ${required}`);

fs.writeFileSync(file,source);
console.log('R4.4.3 curated visual safe-state architecture applied',VALIDATION);
