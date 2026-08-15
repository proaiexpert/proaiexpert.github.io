import fs from 'node:fs';

const file=process.argv[2];
if(!file)throw new Error('usage: node proai-cube-r443-semantic-forensic-inject.mjs <main.generated.js>');
let source=fs.readFileSync(file,'utf8');
const required=[
  'function semanticR442UpdateProtectionState(){',
  'function semanticR443BestStageFace(){',
  'function semanticR443Stage(q){',
  'function semanticR443ApplyMessage(face,index){',
  'function semanticR442SetActiveMaterialFace(face){',
  'function semanticR443Unstage(',
  'function semanticR443Lock(q){',
  "SEMANTIC_R442_ELIGIBLE_FACES=Object.freeze(['+Z','+X','-X'])",
];
for(const token of required)if(!source.includes(token))throw new Error('forensic injection missing token: '+token);

source+=String.raw`

;(()=>{
const FACES=[...SEMANTIC_R442_ELIGIBLE_FACES];
const makeCounts=()=>({probes:0,evalNull:0,assembled:0,faceArmed:0,activeTurn:0,rawLow:0,rawHigh:0,view:0,area:0,brdf:0,recentFace:0,valid:0});
const D={
  revision:'R4.4.3 SEMANTIC STAGING FORENSIC REVIEW-ONLY',
  installedPresentationMs:presentationSimTimeMs,
  initialNextEligiblePresentationMs:semanticR443State.nextEligiblePresentationMs,
  inheritedNextEligiblePresentationMs:semanticR442State.nextEligiblePresentationMs,
  updateCalls:0,eligibleUpdateCalls:0,bestStageCalls:0,bestStageSelected:0,stageCalls:0,stageSuccesses:0,
  applyMessageCalls:0,applyMessageSuccesses:0,setActiveCalls:0,unstageCalls:0,lockCalls:0,lockSuccesses:0,
  candidateTransitions:0,readableTransitions:0,releaseTransitions:0,
  actualBestGateCounts:Object.fromEntries(FACES.map(f=>[f,makeCounts()])),
  observationalGateCounts:Object.fromEntries(FACES.map(f=>[f,makeCounts()])),
  bestSelections:[],stageEvents:[],applyEvents:[],activeMaterialEvents:[],unstageEvents:[],candidateEvents:[],readableEvents:[],releaseEvents:[],
  macroChecks:0,macroMismatches:[],physicalChecks:[],nextEligibleHistory:[],phaseHistory:[],
};
const finite=v=>Number.isFinite(v)?v:null;
function faceSnapshot(face){
  const q=semanticR442EvaluateFace(face,true);
  const clear=q?semanticR443FaceClearOfActiveTurns(face):false;
  const recent=semanticR443RecentFaceBlocked(face);
  return q?{
    face,exists:true,assembled:q.assembled===true,faceArmed:semanticR443State.faceArmed[face]===true,activeTurnClear:clear,
    rawQuality:finite(q.rawQuality),viewAlignment:finite(q.viewAlignment),projectedAreaQuality:finite(q.projectedAreaQuality),brdfQuality:finite(q.brdfQuality),
    selectionScore:finite(q.selectionScore),recentFaceBlocked:recent,
    stageScoreMinPass:q.rawQuality>=SEMANTIC_R443_CONFIG.stageScoreMin,
    stageScoreMaxPass:q.rawQuality<SEMANTIC_R443_CONFIG.stageScoreMax,
    stageViewMinPass:q.viewAlignment>=SEMANTIC_R443_CONFIG.stageViewMin,
    stageAreaMinPass:q.projectedAreaQuality>=SEMANTIC_R443_CONFIG.stageAreaMin,
    stageBrdfMinPass:q.brdfQuality>=SEMANTIC_R443_CONFIG.stageBrdfMin,
  }:{face,exists:false,assembled:false,faceArmed:semanticR443State.faceArmed[face]===true,activeTurnClear:false,recentFaceBlocked:recent};
}
function countSnapshot(s,c){
  c.probes++;
  if(!s.exists){c.evalNull++;return false}
  if(!s.assembled)c.assembled++;
  if(!s.faceArmed)c.faceArmed++;
  if(!s.activeTurnClear)c.activeTurn++;
  if(!s.stageScoreMinPass)c.rawLow++;
  if(!s.stageScoreMaxPass)c.rawHigh++;
  if(!s.stageViewMinPass)c.view++;
  if(!s.stageAreaMinPass)c.area++;
  if(!s.stageBrdfMinPass)c.brdf++;
  if(s.recentFaceBlocked)c.recentFace++;
  const valid=s.assembled&&s.faceArmed&&s.activeTurnClear&&s.stageScoreMinPass&&s.stageScoreMaxPass&&s.stageViewMinPass&&s.stageAreaMinPass&&s.stageBrdfMinPass;
  if(valid)c.valid++;
  return valid;
}
function probe(kind='observational'){
  const bucket=kind==='actual'?D.actualBestGateCounts:D.observationalGateCounts;
  const faces=FACES.map(face=>faceSnapshot(face));
  for(const s of faces)countSnapshot(s,bucket[s.face]);
  macroCheck(faces);
  return faces;
}
function macroCheck(faceSnapshots=null){
  D.macroChecks++;
  const cycle=semanticR443ClosedState.cycle,step=semanticR443ClosedState.step;
  const id=!cycle||step===0?'HOME':cycle+':'+step;
  const meta=SEMANTIC_R443_CLOSED_VALIDATION.macroStates.find(m=>m.id===id)||null;
  const snaps=faceSnapshots||FACES.map(face=>faceSnapshot(face));
  const actual=snaps.filter(s=>s.assembled).map(s=>s.face).sort();
  const expected=[...(meta?.assembledFaces||[])].sort();
  if(JSON.stringify(actual)!==JSON.stringify(expected)&&D.macroMismatches.length<80)D.macroMismatches.push({presentationMs:presentationSimTimeMs,id,phraseActive:semanticR443ClosedState.phraseActive,expected,actual});
}
function physicalSnapshot(face,index){
  const reg=semanticR442FaceRegistry.get(face);
  if(!reg)return{face,index,registry:false};
  const tiles=reg.tiles||[],uniqueCubies=[...new Set(tiles.map(t=>t.cubieId))];
  const active=semanticR442ActiveMaterialFace===face&&semanticR442State.activeMaterialFace===face;
  const tileChecks=tiles.map(t=>{
    const m=t.material;
    return{
      cubieId:t.cubieId,
      messageIndex:m.userData.semanticR443MessageIndex??null,
      message:m.userData.semanticR443Message??null,
      bumpMapAssigned:!!m.bumpMap&&m.bumpMap===m.userData.semanticBeveledBump,
      roughnessMapAssigned:!!m.roughnessMap&&m.roughnessMap===t.rough,
      clearcoatRoughnessAssigned:!('clearcoatRoughnessMap' in m)||m.clearcoatRoughnessMap===t.rough,
      toneMapAssigned:m.map===(m.userData.semanticToneMap||m.userData.semanticBaseMap||null),
      dormant:m.userData.semanticR442Dormant===true,
      bumpScale:finite(m.bumpScale),
      materialVersion:finite(m.version),
    };
  });
  return{
    face,index,registry:true,tileCount:tiles.length,uniqueCubieCount:uniqueCubies.length,activeMaterialFace:semanticR442ActiveMaterialFace,stateActiveMaterialFace:semanticR442State.activeMaterialFace,active,
    messageIndexStored:tileChecks.every(t=>t.messageIndex===index),
    bumpAssigned:tileChecks.every(t=>t.bumpMapAssigned),roughAssigned:tileChecks.every(t=>t.roughnessMapAssigned),clearcoatRoughAssigned:tileChecks.every(t=>t.clearcoatRoughnessAssigned),toneAssigned:tileChecks.every(t=>t.toneMapAssigned),
    allActive:tileChecks.every(t=>!t.dormant),bumpScaleAll:tileChecks.map(t=>t.bumpScale),tileChecks,
  };
}
const oBest=semanticR443BestStageFace;
semanticR443BestStageFace=function(){
  D.bestStageCalls++;
  const faces=probe('actual');
  const result=oBest();
  if(result){D.bestStageSelected++;if(D.bestSelections.length<96)D.bestSelections.push({presentationMs:presentationSimTimeMs,face:result.face,quality:result.rawQuality,view:result.viewAlignment,area:result.projectedAreaQuality,brdf:result.brdfQuality,macro:{cycle:semanticR443ClosedState.cycle,step:semanticR443ClosedState.step},faces})}
  return result;
};
const oApply=semanticR443ApplyMessage;
semanticR443ApplyMessage=function(face,index){
  D.applyMessageCalls++;
  const reg=semanticR442FaceRegistry.get(face),before=(reg?.tiles||[]).map(t=>t.material.version||0);
  const ok=oApply(face,index);
  if(ok)D.applyMessageSuccesses++;
  if(D.applyEvents.length<64)D.applyEvents.push({presentationMs:presentationSimTimeMs,face,index,ok,registry:!!reg,uniqueCubies:reg?[...new Set(reg.tiles.map(t=>t.cubieId))].length:0,versionsAdvanced:reg?reg.tiles.filter((t,i)=>(t.material.version||0)>before[i]).length:0,messageStored:reg?reg.tiles.every(t=>t.material.userData.semanticR443MessageIndex===index):false});
  return ok;
};
const oSet=semanticR442SetActiveMaterialFace;
semanticR442SetActiveMaterialFace=function(face){
  D.setActiveCalls++;
  const ret=oSet(face);
  if(D.activeMaterialEvents.length<96)D.activeMaterialEvents.push({presentationMs:presentationSimTimeMs,requested:face,returned:ret,activeMaterialFace:semanticR442ActiveMaterialFace,stateActiveMaterialFace:semanticR442State.activeMaterialFace});
  return ret;
};
const oStage=semanticR443Stage;
semanticR443Stage=function(q){
  D.stageCalls++;
  const before={presentationMs:presentationSimTimeMs,face:q?.face||null,index:semanticR443State.nextMessageIndex};
  const ok=oStage(q);
  if(ok)D.stageSuccesses++;
  const physical=ok?physicalSnapshot(q.face,semanticR443State.stagedMessageIndex):null;
  if(physical&&D.physicalChecks.length<64)D.physicalChecks.push({presentationMs:presentationSimTimeMs,stage:true,...physical});
  if(D.stageEvents.length<64)D.stageEvents.push({...before,ok,stagedFace:semanticR443State.stagedFace,stagedSinceMs:semanticR443State.stagedSinceMs,physical});
  return ok;
};
const oUnstage=semanticR443Unstage;
semanticR443Unstage=function(reason='hidden-cancel'){
  D.unstageCalls++;
  if(D.unstageEvents.length<96)D.unstageEvents.push({presentationMs:presentationSimTimeMs,face:semanticR443State.stagedFace,phase:semanticR443State.phase,reason});
  return oUnstage(reason);
};
const oLock=semanticR443Lock;
semanticR443Lock=function(q){
  D.lockCalls++;
  const before={presentationMs:presentationSimTimeMs,face:q?.face||null,stagedMs:semanticR443State.stagedSinceMs};
  const ok=oLock(q);if(ok)D.lockSuccesses++;
  if(ok&&D.readableEvents.length<64)D.readableEvents.push({...before,readableMs:presentationSimTimeMs,message:semanticR443State.activeMessage,index:semanticR443State.activeMessageIndex,physical:physicalSnapshot(q.face,semanticR443State.activeMessageIndex)});
  return ok;
};
const oReset=semanticR443ResetCandidate;
semanticR443ResetCandidate=function(reason='optical-exit'){
  if(semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE&&D.candidateEvents.length<96)D.candidateEvents.push({presentationMs:presentationSimTimeMs,kind:'cancel',face:semanticR443State.candidateFace,reason});
  return oReset(reason);
};
const oRelease=semanticR443Release;
semanticR443Release=function(reason='stable-optical-exit'){
  const face=semanticR442State.protectedFace,start=semanticR442State.protectedSinceMs;
  const ok=oRelease(reason);
  if(ok&&D.releaseEvents.length<64)D.releaseEvents.push({presentationMs:presentationSimTimeMs,face,startMs:start,reason,nextEligiblePresentationMs:semanticR443State.nextEligiblePresentationMs,nextMessageIndex:semanticR443State.nextMessageIndex});
  return ok;
};
const oUpdate=semanticR442UpdateProtectionState;
semanticR442UpdateProtectionState=function(){
  D.updateCalls++;
  if(presentationSimTimeMs>=semanticR443State.nextEligiblePresentationMs)D.eligibleUpdateCalls++;
  const beforePhase=semanticR443State.phase,beforeStaged=semanticR443State.stagedFace,beforeNext=semanticR443State.nextEligiblePresentationMs;
  const ret=oUpdate();
  if(beforePhase!==semanticR443State.phase){
    if(semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE){D.candidateTransitions++;if(D.candidateEvents.length<96)D.candidateEvents.push({presentationMs:presentationSimTimeMs,kind:'enter',face:semanticR443State.candidateFace,stagedMs:semanticR443State.stagedSinceMs})}
    if(semanticR443State.phase===SEMANTIC_R443_PHASE.READABLE)D.readableTransitions++;
    if(semanticR443State.phase===SEMANTIC_R443_PHASE.RELEASE)D.releaseTransitions++;
    if(D.phaseHistory.length<128)D.phaseHistory.push({presentationMs:presentationSimTimeMs,from:beforePhase,to:semanticR443State.phase,stagedBefore:beforeStaged,stagedAfter:semanticR443State.stagedFace});
  }
  if(beforeNext!==semanticR443State.nextEligiblePresentationMs&&D.nextEligibleHistory.length<64)D.nextEligibleHistory.push({presentationMs:presentationSimTimeMs,before:beforeNext,after:semanticR443State.nextEligiblePresentationMs});
  return ret;
};
function snapshot(){
  const faces=FACES.map(face=>faceSnapshot(face));
  return{
    ...D,
    presentationSimTimeMs,
    nextEligiblePresentationMs:semanticR443State.nextEligiblePresentationMs,
    inheritedNextEligibleCurrent:semanticR442State.nextEligiblePresentationMs,
    phase:semanticR443State.phase,stagedFace:semanticR443State.stagedFace,stagedMessageIndex:semanticR443State.stagedMessageIndex,stagedSinceMs:semanticR443State.stagedSinceMs,
    candidateFace:semanticR443State.candidateFace,candidateSinceMs:semanticR443State.candidateSinceMs,nextMessageIndex:semanticR443State.nextMessageIndex,
    activeMessage:semanticR443State.activeMessage,activeMessageIndex:semanticR443State.activeMessageIndex,
    activeMaterialFace:semanticR442ActiveMaterialFace,stateActiveMaterialFace:semanticR442State.activeMaterialFace,
    stageCount:semanticR443State.stageCount,stageCancelCount:semanticR443State.stageCancelCount,
    lifecycleLog:[...semanticR443State.lifecycleLog],candidateLog:[...semanticR443State.candidateLog],eventLog:[...semanticR443State.eventLog],readableDurationsMs:[...semanticR443State.readableDurationsMs],
    closed:{cycle:semanticR443ClosedState.cycle,step:semanticR443ClosedState.step,direction:semanticR443ClosedState.direction,phraseActive:semanticR443ClosedState.phraseActive,currentPhraseId:semanticR443ClosedState.currentPhraseId,phraseCount:semanticR443ClosedState.phraseCount},
    faces,
  };
}
window.__R443_FORENSIC__={get:snapshot,probe:()=>{probe('observational');return snapshot()},physical:(face,index=semanticR443State.stagedMessageIndex)=>physicalSnapshot(face,index)};
})();
`;
fs.writeFileSync(file,source);
console.log('R4.4.3 semantic forensic review-only instrumentation appended');
