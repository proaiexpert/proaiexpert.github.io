import fs from 'node:fs';

const file=process.argv[2];
if(!file)throw new Error('usage: node proai-cube-r443-semcap-startup-inject.mjs <main.generated.js>');
let source=fs.readFileSync(file,'utf8');
for(const token of [
  'function semanticR442EvaluateFace(',
  'function semanticR443FaceClearOfActiveTurns(',
  "SEMANTIC_R442_ELIGIBLE_FACES=Object.freeze(['+Z','+X','-X'])",
  "safeStateId:'S00'",
])if(!source.includes(token))throw new Error('startup diagnostic missing token: '+token);

source+=String.raw`
;(()=>{
  const installedPresentationMs=presentationSimTimeMs;
  const faces=[...SEMANTIC_R442_ELIGIBLE_FACES];
  const finite=v=>Number.isFinite(v)?v:null;
  function faceSnapshot(face){
    const q=semanticR442EvaluateFace(face,true);
    if(!q)return {face,exists:false};
    return {
      face,exists:true,assembled:q.assembled===true,
      rawQuality:finite(q.rawQuality),viewAlignment:finite(q.viewAlignment),
      projectedAreaQuality:finite(q.projectedAreaQuality),brdfQuality:finite(q.brdfQuality),
      selectionScore:finite(q.selectionScore),activeTurnClear:semanticR443FaceClearOfActiveTurns(face),
      stagePass:q.assembled===true&&semanticR443State.faceArmed[face]===true&&semanticR443FaceClearOfActiveTurns(face)&&q.rawQuality>=SEMANTIC_R443_CONFIG.stageScoreMin&&q.rawQuality<SEMANTIC_R443_CONFIG.stageScoreMax&&q.viewAlignment>=SEMANTIC_R443_CONFIG.stageViewMin&&q.projectedAreaQuality>=SEMANTIC_R443_CONFIG.stageAreaMin&&q.brdfQuality>=SEMANTIC_R443_CONFIG.stageBrdfMin,
    };
  }
  function get(){return {
    installedPresentationMs,
    presentationSimTimeMs,
    relativeMs:presentationSimTimeMs-installedPresentationMs,
    nextEligiblePresentationMs:semanticR443State.nextEligiblePresentationMs,
    relativeEligibilityMs:semanticR443State.nextEligiblePresentationMs-installedPresentationMs,
    safeStateId:semanticR443ClosedState.safeStateId,
    phraseActive:semanticR443ClosedState.phraseActive,
    currentPhraseId:semanticR443ClosedState.currentPhraseId,
    activeTurns:[...activeTurns.values()].map(t=>({axis:t.axis,layer:t.layer})),
    faces:faces.map(faceSnapshot),
  }}
  window.__R443_STARTUP_CAPABILITY__={get};
})();
`;
fs.writeFileSync(file,source);
console.log('R4.4.3 startup semantic capability diagnostic appended');
