import fs from 'node:fs';
const file=process.argv[2];
if(!file)throw new Error('usage: node proai-cube-r443-owner-qa-inject.mjs <main.generated.js>');
let source=fs.readFileSync(file,'utf8');
for(const token of[
  'function semanticR442UpdateProtectionState(){','function semanticR443Stage(q){','function semanticR443Lock(q){','function semanticR443Release(',
  'function semanticR443ClosedMetrics(){',"safeStateId:'S00'","architecture:'CURATED_VISUAL_SAFE_STATE_RING'",'let sliceSeed = SLICE_R1_2.seed >>> 0;',
])if(!source.includes(token))throw new Error('owner QA injection missing token: '+token);
source+=String.raw`

;(()=>{
  const querySeedRaw=new URLSearchParams(location.search).get('seed');
  const parsedSeed=querySeedRaw?(querySeedRaw.startsWith('0x')?Number.parseInt(querySeedRaw.slice(2),16):Number.parseInt(querySeedRaw,10)):SLICE_R1_2.seed;
  const qaSeed=(Number.isFinite(parsedSeed)&&parsedSeed!==0?parsedSeed:SLICE_R1_2.seed)>>>0;
  sliceSeed=qaSeed;
  semanticR443State.semanticSeed=(qaSeed^0x443c0de)>>>0;
  const startupPresentationMs=presentationSimTimeMs;
  const initialNextEligiblePresentationMs=semanticR443State.nextEligiblePresentationMs;
  const D={
    revision:'R4.4.3 OWNER MOTION+SEMANTIC QA REVIEW-ONLY',seed:qaSeed,startupPresentationMs,initialNextEligiblePresentationMs,
    firstEligibilityPresentationMs:null,stageEvents:[],candidateEvents:[],readableEvents:[],releaseEvents:[],unstageEvents:[],physicalChecks:[],
  };
  const finite=v=>Number.isFinite(v)?v:null;
  function physicalSnapshot(face,index){
    const reg=semanticR442FaceRegistry.get(face);if(!reg)return{face,index,registry:false};
    const tiles=reg.tiles||[],uniqueCubies=[...new Set(tiles.map(t=>t.cubieId))];
    const active=semanticR442ActiveMaterialFace===face&&semanticR442State.activeMaterialFace===face;
    const checks=tiles.map(t=>{const m=t.material;return{
      cubieId:t.cubieId,messageIndex:m.userData.semanticR443MessageIndex??null,message:m.userData.semanticR443Message??null,
      bumpMapAssigned:!!m.bumpMap&&m.bumpMap===m.userData.semanticBeveledBump,
      roughnessMapAssigned:!!m.roughnessMap&&m.roughnessMap===t.rough,
      clearcoatRoughnessAssigned:!('clearcoatRoughnessMap' in m)||m.clearcoatRoughnessMap===t.rough,
      toneMapAssigned:m.map===(m.userData.semanticToneMap||m.userData.semanticBaseMap||null),
      dormant:m.userData.semanticR442Dormant===true,bumpScale:finite(m.bumpScale),
    }});
    return{face,index,registry:true,tileCount:tiles.length,uniqueCubieCount:uniqueCubies.length,active,
      activeMaterialFace:semanticR442ActiveMaterialFace,stateActiveMaterialFace:semanticR442State.activeMaterialFace,
      messageIndexStored:checks.every(t=>t.messageIndex===index),bumpAssigned:checks.every(t=>t.bumpMapAssigned),
      roughAssigned:checks.every(t=>t.roughnessMapAssigned),clearcoatRoughAssigned:checks.every(t=>t.clearcoatRoughnessAssigned),
      toneAssigned:checks.every(t=>t.toneMapAssigned),allActive:checks.every(t=>!t.dormant),bumpScaleAll:checks.map(t=>t.bumpScale),tileChecks:checks};
  }
  const oStage=semanticR443Stage;
  semanticR443Stage=function(q){const before={presentationMs:presentationSimTimeMs,face:q?.face||null,index:semanticR443State.nextMessageIndex};const ok=oStage(q);const physical=ok?physicalSnapshot(q.face,semanticR443State.stagedMessageIndex):null;if(ok&&physical)D.physicalChecks.push({presentationMs:presentationSimTimeMs,...physical});D.stageEvents.push({...before,ok,message:ok?semanticR443State.activeMessage:null,stagedMs:semanticR443State.stagedSinceMs,physical});return ok};
  const oLock=semanticR443Lock;
  semanticR443Lock=function(q){const before={presentationMs:presentationSimTimeMs,face:q?.face||null,stagedMs:semanticR443State.stagedSinceMs};const ok=oLock(q);if(ok)D.readableEvents.push({...before,readableMs:presentationSimTimeMs,message:semanticR443State.activeMessage,index:semanticR443State.activeMessageIndex,physical:physicalSnapshot(q.face,semanticR443State.activeMessageIndex)});return ok};
  const oRelease=semanticR443Release;
  semanticR443Release=function(reason='stable-optical-exit'){const before={presentationMs:presentationSimTimeMs,face:semanticR442State.protectedFace,startMs:semanticR442State.protectedSinceMs,message:semanticR443State.activeMessage};const ok=oRelease(reason);if(ok)D.releaseEvents.push({...before,endMs:presentationSimTimeMs,durationMs:before.startMs===null?null:presentationSimTimeMs-before.startMs,reason,nextEligiblePresentationMs:semanticR443State.nextEligiblePresentationMs,nextMessageIndex:semanticR443State.nextMessageIndex});return ok};
  const oUnstage=semanticR443Unstage;
  semanticR443Unstage=function(reason='hidden-cancel'){D.unstageEvents.push({presentationMs:presentationSimTimeMs,face:semanticR443State.stagedFace,phase:semanticR443State.phase,reason});return oUnstage(reason)};
  const oUpdate=semanticR442UpdateProtectionState;
  semanticR442UpdateProtectionState=function(){
    if(D.firstEligibilityPresentationMs===null&&presentationSimTimeMs>=semanticR443State.nextEligiblePresentationMs)D.firstEligibilityPresentationMs=presentationSimTimeMs;
    const before=semanticR443State.phase;const ret=oUpdate();
    if(before!==SEMANTIC_R443_PHASE.CANDIDATE&&semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE)D.candidateEvents.push({presentationMs:presentationSimTimeMs,kind:'enter',face:semanticR443State.candidateFace,stagedMs:semanticR443State.stagedSinceMs});
    return ret;
  };
  function snapshot(){
    const sem=window.__PROAI_CUBE_R1_2?.getSemanticDiagnostics?.()||{};
    const diag=window.__PROAI_CUBE_R1_2?.getDiagnostics?.()||{};
    return{
      seed:D.seed,startupPresentationMs:D.startupPresentationMs,initialNextEligiblePresentationMs:D.initialNextEligiblePresentationMs,firstEligibilityPresentationMs:D.firstEligibilityPresentationMs,
      stageEvents:[...D.stageEvents],candidateEvents:[...D.candidateEvents],readableEvents:[...D.readableEvents],releaseEvents:[...D.releaseEvents],unstageEvents:[...D.unstageEvents],physicalChecks:[...D.physicalChecks],
      semanticDiagnostics:sem,diagnostics:diag,
      internal:{presentationSimTimeMs,timeScale:sem.timeScale??1,phase:semanticR443State.phase,stagedFace:semanticR443State.stagedFace,candidateFace:semanticR443State.candidateFace,
        nextEligiblePresentationMs:semanticR443State.nextEligiblePresentationMs,nextMessageIndex:semanticR443State.nextMessageIndex,activeMessage:semanticR443State.activeMessage,
        eventLog:[...semanticR443State.eventLog],readableDurationsMs:[...semanticR443State.readableDurationsMs],opportunityIntervalsMs:[...semanticR443State.opportunityIntervalsMs],semanticFlashCount:semanticR443State.semanticFlashCount??0,
        assemblyViolations:semanticR442State.assemblyViolations??0,unsafeProtectedStarts:semanticR442State.unsafeProtectedStarts??0,protectionCount:semanticR442State.protectionCount??0,releaseCount:semanticR442State.releaseCount??0,
        protected:semanticR442State.protected===true,protectedFace:semanticR442State.protectedFace||null,activeMaterialFace:semanticR442ActiveMaterialFace,stateActiveMaterialFace:semanticR442State.activeMaterialFace,
        releasedFaceForcedMoves:semanticR443ClosedState.releasedFaceForcedMoves??0,protectionAlterations:semanticR443ClosedState.protectionAlterations??0,unexpectedUnsafeStarts:semanticR443ClosedState.unexpectedUnsafeStarts??0,
        safeStateId:semanticR443ClosedState.safeStateId,visibleMoves:[...semanticR443ClosedState.visibleMoves],phraseHistory:[...semanticR443ClosedState.phraseHistory],phraseCount:semanticR443ClosedState.phraseCount,
        closedMetrics:semanticR443ClosedMetrics(),activeTurns:activeTurns.size,
      }
    };
  }
  window.__R443_OWNER_QA__={get:snapshot,physical:physicalSnapshot,renderOnce(){scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);renderer.render(scene,camera);return true}};
})();
`;
fs.writeFileSync(file,source);
console.log('R4.4.3 OWNER QA instrumentation appended');
