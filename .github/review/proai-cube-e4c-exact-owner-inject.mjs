import fs from 'node:fs';
const file=process.argv[2];
if(!file)throw new Error('usage: node proai-cube-e4c-exact-owner-inject.mjs <main.generated.js>');
let source=fs.readFileSync(file,'utf8');
for(const token of[
  'function semanticR442UpdateProtectionState(){',
  'function semanticR443Stage(q){',
  'function semanticR443Lock(q){',
  'function semanticR443Release(',
  'function semanticR443ClosedMetrics(){',
  "architecture:'SEMANTIC_CAPABLE_AUTHORED_SAFE_STATE_GRAPH'",
  'firstSemanticDelayMs:1600',
]) if(!source.includes(token)) throw new Error('E4C exact QA missing token: '+token);
source+=String.raw`

;(()=>{
  const D={
    revision:'PROAI CUBE E4C EXACT OWNER LIVE VALIDATION — PASSIVE REVIEW INSTRUMENTATION',
    startupPresentationMs:presentationSimTimeMs,
    startupWallMs:performance.now(),
    initialNextEligiblePresentationMs:semanticR443State.nextEligiblePresentationMs,
    firstEligibilityPresentationMs:null,
    firstEligibilityWallMs:null,
    stageEvents:[],candidateEvents:[],readableEvents:[],releaseEvents:[],unstageEvents:[],physicalChecks:[],
    maxActiveMaterialFaces:0,maxProtectedFaces:0,
  };
  const finite=v=>Number.isFinite(v)?v:null;
  function physicalSnapshot(face,index){
    const reg=semanticR442FaceRegistry.get(face);if(!reg)return{face,index,registry:false};
    const tiles=reg.tiles||[],uniqueCubies=[...new Set(tiles.map(t=>t.cubieId))];
    const checks=tiles.map(t=>{const m=t.material;return{
      cubieId:t.cubieId,
      messageIndex:m.userData.semanticR443MessageIndex??null,
      message:m.userData.semanticR443Message??null,
      bumpMapAssigned:!!m.bumpMap&&m.bumpMap===m.userData.semanticBeveledBump,
      roughnessMapAssigned:!!m.roughnessMap&&m.roughnessMap===t.rough,
      clearcoatRoughnessAssigned:!('clearcoatRoughnessMap' in m)||m.clearcoatRoughnessMap===t.rough,
      toneMapAssigned:m.map===(m.userData.semanticToneMap||m.userData.semanticBaseMap||null),
      dormant:m.userData.semanticR442Dormant===true,
      bumpScale:finite(m.bumpScale),
      roughness:finite(m.roughness),
      emissiveIntensity:finite(m.emissiveIntensity),
      opacity:finite(m.opacity),
      transparent:m.transparent===true,
    }});
    return{
      face,index,registry:true,tileCount:tiles.length,uniqueCubieCount:uniqueCubies.length,
      active:semanticR442ActiveMaterialFace===face&&semanticR442State.activeMaterialFace===face,
      activeMaterialFace:semanticR442ActiveMaterialFace,stateActiveMaterialFace:semanticR442State.activeMaterialFace,
      messageIndexStored:checks.every(t=>t.messageIndex===index),
      bumpAssigned:checks.every(t=>t.bumpMapAssigned),roughAssigned:checks.every(t=>t.roughnessMapAssigned),
      clearcoatRoughAssigned:checks.every(t=>t.clearcoatRoughnessAssigned),toneAssigned:checks.every(t=>t.toneMapAssigned),
      allActive:checks.every(t=>!t.dormant),noOpacityReveal:checks.every(t=>t.opacity===1&&t.transparent===false),
      noEmissive:checks.every(t=>t.emissiveIntensity===null||t.emissiveIntensity===0),
      bumpScaleAll:checks.map(t=>t.bumpScale),tileChecks:checks,
    };
  }
  function faceCounts(){
    let active=0;
    for(const face of SEMANTIC_R442_ELIGIBLE_FACES){
      const reg=semanticR442FaceRegistry.get(face);if(!reg)continue;
      if((reg.tiles||[]).some(t=>t.material.userData.semanticR442Dormant!==true))active++;
    }
    D.maxActiveMaterialFaces=Math.max(D.maxActiveMaterialFaces,active);
    D.maxProtectedFaces=Math.max(D.maxProtectedFaces,semanticR442State.protected?1:0);
  }
  const oStage=semanticR443Stage;
  semanticR443Stage=function(q){
    const wallBefore=performance.now(),presentationBefore=presentationSimTimeMs,indexBefore=semanticR443State.nextMessageIndex;
    const ok=oStage(q);
    const physical=ok?physicalSnapshot(q.face,semanticR443State.stagedMessageIndex):null;
    const event={seq:D.stageEvents.length,presentationMs:presentationSimTimeMs,presentationBeforeMs:presentationBefore,wallMs:performance.now(),wallBeforeMs:wallBefore,face:q?.face||null,index:indexBefore,ok,message:ok?semanticR443State.activeMessage:null,stagedMs:semanticR443State.stagedSinceMs,physical};
    D.stageEvents.push(event);if(ok&&physical)D.physicalChecks.push({presentationMs:presentationSimTimeMs,wallMs:performance.now(),...physical});
    faceCounts();return ok;
  };
  const oLock=semanticR443Lock;
  semanticR443Lock=function(q){
    const wallBefore=performance.now(),presentationBefore=presentationSimTimeMs,stagedMs=semanticR443State.stagedSinceMs;
    const ok=oLock(q);
    if(ok)D.readableEvents.push({presentationMs:presentationSimTimeMs,presentationBeforeMs:presentationBefore,wallMs:performance.now(),wallBeforeMs:wallBefore,face:q?.face||null,stagedMs,readableMs:presentationSimTimeMs,message:semanticR443State.activeMessage,index:semanticR443State.activeMessageIndex,physical:physicalSnapshot(q.face,semanticR443State.activeMessageIndex)});
    faceCounts();return ok;
  };
  const oRelease=semanticR443Release;
  semanticR443Release=function(reason='stable-optical-exit'){
    const before={presentationMs:presentationSimTimeMs,wallMs:performance.now(),face:semanticR442State.protectedFace,startMs:semanticR442State.protectedSinceMs,message:semanticR443State.activeMessage};
    const ok=oRelease(reason);
    if(ok)D.releaseEvents.push({...before,endMs:presentationSimTimeMs,endWallMs:performance.now(),durationMs:before.startMs===null?null:presentationSimTimeMs-before.startMs,reason,nextEligiblePresentationMs:semanticR443State.nextEligiblePresentationMs,nextMessageIndex:semanticR443State.nextMessageIndex});
    faceCounts();return ok;
  };
  if(typeof semanticR443Unstage==='function'){
    const oUnstage=semanticR443Unstage;
    semanticR443Unstage=function(reason='hidden-cancel'){
      D.unstageEvents.push({presentationMs:presentationSimTimeMs,wallMs:performance.now(),face:semanticR443State.stagedFace,phase:semanticR443State.phase,reason});
      return oUnstage(reason);
    };
  }
  const oUpdate=semanticR442UpdateProtectionState;
  semanticR442UpdateProtectionState=function(){
    if(D.firstEligibilityPresentationMs===null&&presentationSimTimeMs>=semanticR443State.nextEligiblePresentationMs){D.firstEligibilityPresentationMs=presentationSimTimeMs;D.firstEligibilityWallMs=performance.now();}
    const before=semanticR443State.phase,beforeFace=semanticR443State.candidateFace;
    const ret=oUpdate();
    if(before!==SEMANTIC_R443_PHASE.CANDIDATE&&semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE){D.candidateEvents.push({presentationMs:presentationSimTimeMs,wallMs:performance.now(),kind:'enter',face:semanticR443State.candidateFace,previousFace:beforeFace,stagedMs:semanticR443State.stagedSinceMs});}
    faceCounts();return ret;
  };
  function snapshot(){
    faceCounts();
    const sem=window.__PROAI_CUBE_R1_2?.getSemanticDiagnostics?.()||{};
    const diag=window.__PROAI_CUBE_R1_2?.getDiagnostics?.()||{};
    return{
      revision:D.revision,startupPresentationMs:D.startupPresentationMs,startupWallMs:D.startupWallMs,currentPresentationMs:presentationSimTimeMs,currentWallMs:performance.now(),initialNextEligiblePresentationMs:D.initialNextEligiblePresentationMs,
      firstEligibilityPresentationMs:D.firstEligibilityPresentationMs,firstEligibilityWallMs:D.firstEligibilityWallMs,
      stageEvents:[...D.stageEvents],candidateEvents:[...D.candidateEvents],readableEvents:[...D.readableEvents],releaseEvents:[...D.releaseEvents],unstageEvents:[...D.unstageEvents],physicalChecks:[...D.physicalChecks],maxActiveMaterialFaces:D.maxActiveMaterialFaces,maxProtectedFaces:D.maxProtectedFaces,
      semanticDiagnostics:sem,diagnostics:diag,
      internal:{
        phase:semanticR443State.phase,stagedFace:semanticR443State.stagedFace,candidateFace:semanticR443State.candidateFace,nextEligiblePresentationMs:semanticR443State.nextEligiblePresentationMs,nextMessageIndex:semanticR443State.nextMessageIndex,activeMessage:semanticR443State.activeMessage,
        eventLog:[...semanticR443State.eventLog],readableDurationsMs:[...semanticR443State.readableDurationsMs],opportunityIntervalsMs:[...semanticR443State.opportunityIntervalsMs],semanticFlashCount:semanticR443State.semanticFlashCount??0,
        assemblyViolations:semanticR442State.assemblyViolations??0,unsafeProtectedStarts:semanticR442State.unsafeProtectedStarts??0,protectionCount:semanticR442State.protectionCount??0,releaseCount:semanticR442State.releaseCount??0,
        protected:semanticR442State.protected===true,protectedFace:semanticR442State.protectedFace||null,activeMaterialFace:semanticR442ActiveMaterialFace,stateActiveMaterialFace:semanticR442State.activeMaterialFace,
        releasedFaceForcedMoves:semanticR443ClosedState.releasedFaceForcedMoves??0,protectionAlterations:semanticR443ClosedState.protectionAlterations??0,unexpectedUnsafeStarts:semanticR443ClosedState.unexpectedUnsafeStarts??0,
        safeStateId:semanticR443ClosedState.safeStateId,visibleMoves:[...semanticR443ClosedState.visibleMoves],phraseHistory:[...semanticR443ClosedState.phraseHistory],phraseCount:semanticR443ClosedState.phraseCount,closedMetrics:semanticR443ClosedMetrics(),activeTurns:activeTurns.size,
      }
    };
  }
  window.__R443_E4C_EXACT_QA__={get:snapshot,physical:physicalSnapshot};
})();
`;
fs.writeFileSync(file,source);
console.log('E4C exact passive owner instrumentation appended — no runtime controls modified');
