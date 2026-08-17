import fs from 'node:fs';

const file = new URL('./main.generated.js', import.meta.url);
let source = fs.readFileSync(file, 'utf8');

const replaceUnique = (find, replacement, label) => {
  const at = source.indexOf(find);
  const next = at >= 0 ? source.indexOf(find, at + find.length) : -1;
  if (at < 0 || next >= 0) throw new Error(`R4.4.3 final correction ${label}: ${at}/${next}`);
  source = source.slice(0, at) + replacement + source.slice(at + find.length);
};

for (const required of [
  "architecture:'SEMANTIC_CAPABLE_AUTHORED_SAFE_STATE_GRAPH'",
  "SEMANTIC_R442_ELIGIBLE_FACES=Object.freeze(['+Z','+X','-X'])",
  'bumpScale:-0.130,roughnessMapInk:0.550,metalnessDelta:0.0,tonalInk:0.820',
  'edgeRoughnessInk:.095',
  'r441HorizontalReductionPct:12.5',
  'r441VerticalReductionPct:10',
  'semanticVelocityMultiplier: 1.0',
  'const deltaMs=wallDeltaMs',
  'overlayTextRendered:false',
  'alphaDominantReveal:false',
  'semanticMotionCoupled:false',
  'semanticOrientationForcing:false',
  "yawDirectionPolicy:'continuous-positive'",
  'await schedulerDelay(4800);',
  "function semanticR443GuardFace(){return semanticR443State.stagedFace||semanticR442State.protectedFace||semanticR443State.candidateFace||null}",
  'bodyV=Math.round(255*.550),edgeV=Math.round(255*.095),radius=2;',
  'innerEdgeRadiusPx:2',
]) if (!source.includes(required)) throw new Error(`R4.4.3 final correction missing frozen/source invariant: ${required}`);

replaceUnique(
  "const SEMANTIC_R443_CONFIG=Object.freeze({firstSemanticDelayMs:1600,stageScoreMin:.12,stageScoreMax:.59,stageViewMin:.36,stageAreaMin:.20,stageBrdfMin:0,stageAbortScore:0,stageTimeoutMs:3800,candidateApproachScore:.58,candidateApproachView:.46,candidateDwellMs:80,enterScore:.64,enterView:.52,enterArea:.26,enterBrdf:.18,exitScore:.54,exitView:.50,releaseDebounceMs:90,maxReadableHoldMs:1600,rearmScore:.50,breathingRangeMs:[5000,7000],longGapWarningMs:24000,longReadableWarningMs:2200,recentFaceDepth:2});",
  "const SEMANTIC_R443_CONFIG=Object.freeze({firstSemanticDelayMs:1600,stageScoreMin:.12,stageScoreMax:.72,stageViewMin:.36,stageAreaMin:.20,stageBrdfMin:0,stageAbortScore:0,stageTimeoutMs:3800,candidateApproachScore:.54,candidateApproachView:.44,candidateDwellMs:80,enterScore:.60,enterView:.48,enterArea:.24,enterBrdf:.10,exitScore:.50,exitView:.46,releaseDebounceMs:90,maxReadableHoldMs:1600,rearmScore:.50,breathingRangeMs:[5000,7000],longGapWarningMs:24000,longReadableWarningMs:2200,recentFaceDepth:2});",
  'broader dark-state semantic optical window',
);

replaceUnique(
  "function semanticR443GuardFace(){return semanticR443State.stagedFace||semanticR442State.protectedFace||semanticR443State.candidateFace||null}",
  "function semanticR443GuardFace(){return semanticR442State.protectedFace||semanticR443State.candidateFace||null}",
  'Candidate/Readable-only local motion guard',
);

replaceUnique(
  "  let candidates=SEMANTIC_R443_CLOSED_ARCHETYPES.filter(p=>p.sourceState===semanticR443ClosedState.safeStateId);",
  "  let candidates=SEMANTIC_R443_CLOSED_ARCHETYPES.filter(p=>p.sourceState===semanticR443ClosedState.safeStateId);\n  if(semanticR443ClosedState.phraseCount===0&&semanticR443ClosedState.safeStateId==='S00'){const opening=candidates.find(p=>p.id==='AUTH_B01');if(!opening)throw new Error('R4.4.3 final opening phrase AUTH_B01 unavailable');candidates=[opening]}",
  'premium authored B01 opening selection',
);

replaceUnique(
  '  await schedulerDelay(4800);',
  '  await schedulerDelay(1200);',
  'remove opening scheduler stall',
);

replaceUnique(
  "      const spec=phrase.moves[i],liveGuard=semanticR443GuardFace();\n      if(liveGuard&&semanticR442MoveIntersection(spec,liveGuard).count>0){\n        semanticR443ClosedState.protectionAlterations++;\n        if(semanticR443State.phase===SEMANTIC_R443_PHASE.NORMAL&&semanticR443State.stagedFace===liveGuard){\n          semanticR443Unstage('impending-intersecting-turn');\n        }else{\n          while(sliceSchedulerEnabled){\n            const guardNow=semanticR443GuardFace();\n            if(!guardNow||semanticR442MoveIntersection(spec,guardNow).count===0)break;\n            await sleep(40)\n          }\n          if(!sliceSchedulerEnabled)break;\n          if(!await waitForSliceAutonomy())break\n        }\n      }",
  "      const spec=phrase.moves[i],stagedGuard=semanticR443State.phase===SEMANTIC_R443_PHASE.NORMAL?semanticR443State.stagedFace:null,liveGuard=semanticR443GuardFace();\n      if(stagedGuard&&semanticR442MoveIntersection(spec,stagedGuard).count>0){semanticR443ClosedState.protectionAlterations++;semanticR443Unstage('impending-intersecting-turn')}\n      if(liveGuard&&semanticR442MoveIntersection(spec,liveGuard).count>0){\n        semanticR443ClosedState.protectionAlterations++;\n        while(sliceSchedulerEnabled){\n          const guardNow=semanticR443GuardFace();\n          if(!guardNow||semanticR442MoveIntersection(spec,guardNow).count===0)break;\n          await sleep(40)\n        }\n        if(!sliceSchedulerEnabled)break;\n        if(!await waitForSliceAutonomy())break\n      }",
  'non-stalling Stage plus local Candidate/Readable protection',
);

// Preserve the exact approved roughness values while widening only the physical
// inner micro-edge that can catch the existing Pearl/Silver studio response.
replaceUnique(
  'bodyV=Math.round(255*.550),edgeV=Math.round(255*.095),radius=2;',
  'bodyV=Math.round(255*.550),edgeV=Math.round(255*.095),radius=3;',
  'Pearl micro-catch radius',
);
replaceUnique('innerEdgeRadiusPx:2', 'innerEdgeRadiusPx:3', 'Pearl micro-catch metadata');

for (const required of [
  'firstSemanticDelayMs:1600',
  'stageScoreMax:.72',
  'candidateApproachScore:.54',
  'enterScore:.60',
  'enterBrdf:.10',
  'maxReadableHoldMs:1600',
  'await schedulerDelay(1200);',
  "candidates.find(p=>p.id==='AUTH_B01')",
  "function semanticR443GuardFace(){return semanticR442State.protectedFace||semanticR443State.candidateFace||null}",
  'bodyV=Math.round(255*.550),edgeV=Math.round(255*.095),radius=3;',
  'innerEdgeRadiusPx:3',
  'bumpScale:-0.130,roughnessMapInk:0.550,metalnessDelta:0.0,tonalInk:0.820',
  'edgeRoughnessInk:.095',
  'semanticVelocityMultiplier: 1.0',
  'const deltaMs=wallDeltaMs',
  'overlayTextRendered:false',
  'alphaDominantReveal:false',
  'semanticMotionCoupled:false',
  'semanticOrientationForcing:false',
]) if (!source.includes(required)) throw new Error(`R4.4.3 final correction missing final invariant: ${required}`);

for (const forbidden of [
  'MASTER_WORD',
  'emissiveIntensity',
  'SEMANTIC_R443_PHASE.DISPERSAL',
  'bridge-before-inverse',
]) if (source.includes(forbidden)) throw new Error(`R4.4.3 final correction forbidden regression: ${forbidden}`);

fs.writeFileSync(file, source);
console.log('R4.4.3 final premium semantic correction applied', {
  openingPhrase: 'AUTH_B01',
  openingSliceDelayMs: 1200,
  firstSemanticDelayMs: 1600,
  stageScoreMax: .72,
  candidateApproachScore: .54,
  enterScore: .60,
  enterBrdf: .10,
  maxReadableHoldMs: 1600,
  innerEdgeRadiusPx: 3,
  materialConstantsChanged: false,
  globalBrightnessChanged: false,
  candidateReadableProtection: 'message-face-intersection-only',
});
