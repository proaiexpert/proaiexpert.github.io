import fs from 'node:fs';
const file=process.argv[2];
if(!file)throw new Error('usage: node proai-cube-r443-semantic-final-extension.mjs <main.generated.js>');
let s=fs.readFileSync(file,'utf8');
s+=String.raw`

;(()=>{
  const base=window.__R443_FORENSIC__;
  if(!base)throw new Error('R443 forensic base missing');
  window.__R443_FINAL_ACCEPTANCE__={
    get(){
      const f=base.get();
      const sem=window.__PROAI_CUBE_R1_2.getSemanticDiagnostics();
      const diag=window.__PROAI_CUBE_R1_2.getDiagnostics();
      return {
        forensic:f,
        semanticDiagnostics:sem,
        diagnostics:diag,
        internal:{
          presentationSimTimeMs,
          timeScale:sem.timeScale??1,
          assemblyViolations:semanticR442State.assemblyViolations??0,
          unsafeProtectedStarts:semanticR442State.unsafeProtectedStarts??0,
          protectionCount:semanticR442State.protectionCount??0,
          releaseCount:semanticR442State.releaseCount??0,
          protected:semanticR442State.protected===true,
          protectedFace:semanticR442State.protectedFace||null,
          semanticFlashCount:semanticR443State.semanticFlashCount??0,
          shortReadableCount:semanticR443State.shortReadableCount??0,
          releasedFaceForcedMoves:semanticR443ClosedState.releasedFaceForcedMoves??0,
          protectionAlterations:semanticR443ClosedState.protectionAlterations??0,
          unexpectedUnsafeStarts:semanticR443ClosedState.unexpectedUnsafeStarts??0,
          activeTurns:activeTurns.size,
          activeMaterialFace:semanticR442ActiveMaterialFace,
          stateActiveMaterialFace:semanticR442State.activeMaterialFace,
          nextMessageIndex:semanticR443State.nextMessageIndex,
          eventLog:[...semanticR443State.eventLog],
          readableDurationsMs:[...semanticR443State.readableDurationsMs],
          opportunityIntervalsMs:[...semanticR443State.opportunityIntervalsMs],
          recentFaces:[...semanticR443State.recentFaces],
          closedVisibleMoves:[...semanticR443ClosedState.visibleMoves],
        }
      };
    },
    renderOnce(){
      scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);renderer.render(scene,camera);return true;
    }
  };
})();
`;
fs.writeFileSync(file,s);
console.log('R4.4.3 final semantic acceptance extension appended');
