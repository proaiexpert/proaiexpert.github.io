import fs from 'node:fs';

const file = new URL('./main.generated.js', import.meta.url);
let source = fs.readFileSync(file, 'utf8');

const replaceUnique = (find, replacement, label) => {
  const at = source.indexOf(find);
  const next = at >= 0 ? source.indexOf(find, at + find.length) : -1;
  if (at < 0 || next >= 0) throw new Error(`R4.4.3 candidate/dispersal hotfix ${label}: ${at}/${next}`);
  source = source.slice(0, at) + replacement + source.slice(at + find.length);
};

// CANDIDATE is a brief local constraint, never a global motion mode. Only moves
// intersecting the naturally discovered face are excluded during the tiny dwell.
// DISPERSAL keeps the 350 ms optical-clearance floor before that released face
// can participate again; every other axis/layer remains autonomous.
replaceUnique(
  "function semanticR442SelectMove(){let candidates=semanticR442AllMoveCandidates();if(semanticR442State.protected)candidates=candidates.filter(m=>semanticR442MoveIntersection(m).count===0);if(!candidates.length){semanticR442MoveState.skipped++;return null}const weighted=candidates.map(move=>({move,weight:semanticR442RecentWeight(move)})),total=weighted.reduce((s,x)=>s+x.weight,0);let pick=seededUnit()*total;for(const item of weighted){pick-=item.weight;if(pick<=0)return item.move}return weighted.at(-1).move}",
  "function semanticR442SelectMove(){let candidates=semanticR442AllMoveCandidates();if(semanticR442State.protected)candidates=candidates.filter(m=>semanticR442MoveIntersection(m).count===0);else if(semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE&&semanticR443State.candidateFace)candidates=candidates.filter(m=>semanticR442MoveIntersection(m,semanticR443State.candidateFace).count===0);if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL&&semanticR443State.lastReleaseFace&&presentationSimTimeMs-semanticR443State.lastReleaseMs<SEMANTIC_R443_CONFIG.dispersalTargetMs[0])candidates=candidates.filter(m=>semanticR442MoveIntersection(m,semanticR443State.lastReleaseFace).count===0);if(!candidates.length){semanticR442MoveState.skipped++;return null}const weighted=candidates.map(move=>({move,weight:semanticR442RecentWeight(move)})),total=weighted.reduce((s,x)=>s+x.weight,0);let pick=seededUnit()*total;for(const item of weighted){pick-=item.weight;if(pick<=0)return item.move}return weighted.at(-1).move}",
  'candidate-local vocabulary + early dispersal guard',
);

// A turn already active before discovery is allowed to finish. Candidate quality
// and exact assembly are re-evaluated immediately afterward.
replaceUnique(
  "if(activeTurns.size>0){if(semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE)semanticR443ResetCandidate('active-slice');return}",
  "if(activeTurns.size>0)return;",
  'active-turn candidate continuity',
);

// Preserve the scheduler helpers inserted by the scheduler-scope repair.
const recordStart = source.indexOf("function semanticR442RecordMove(move,phase='forward'){");
const helperStart = source.indexOf('\nasync function waitForSliceAutonomy(){', recordStart);
const schedulerStart = source.indexOf('\nasync function sliceSchedulerLoop(){', recordStart);
if (recordStart < 0 || helperStart < 0 || schedulerStart < 0 || helperStart >= schedulerStart || source.indexOf("function semanticR442RecordMove(move,phase='forward'){", recordStart + 1) >= 0) {
  throw new Error(`R4.4.3 candidate/dispersal record boundary invalid: record=${recordStart} helper=${helperStart} scheduler=${schedulerStart}`);
}
const recordReplacement = `function semanticR442RecordMove(move,phase='forward'){const intersection=semanticR442State.protected?semanticR442MoveIntersection(move):{count:0,ids:[]};if(semanticR442State.protected&&intersection.count>0)semanticR442State.unsafeProtectedStarts++;if(phase==='forward'){semanticR442MoveState.recentMoves.push({axis:move.axis,layer:move.layer,direction:move.direction,presentationMs:presentationSimTimeMs});if(semanticR442MoveState.recentMoves.length>5)semanticR442MoveState.recentMoves.shift();semanticR442MoveState.axisCounts[move.axis]=(semanticR442MoveState.axisCounts[move.axis]||0)+1;semanticR442MoveState.layerCounts[String(move.layer)]=(semanticR442MoveState.layerCounts[String(move.layer)]||0)+1;semanticR442MoveState.selectionCount++}const released=semanticR443State.lastReleaseFace,rejoin=released?semanticR442MoveIntersection(move,released):{count:0,ids:[]};if(released&&presentationSimTimeMs-semanticR443State.lastReleaseMs<12000&&rejoin.count>0){semanticR442State.postReleaseParticipationCount++;semanticR442State.lastPostReleaseParticipation={face:released,presentationMs:presentationSimTimeMs,phase,move:{axis:move.axis,layer:move.layer,direction:move.direction}}}if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL&&released&&rejoin.count>0){const latency=Math.max(0,presentationSimTimeMs-semanticR443State.lastReleaseMs);semanticR443State.dispersalDone=true;semanticR443State.dispersalLatencyMs=latency;semanticR443State.dispersalLatenciesMs.push(latency);if(semanticR443State.dispersalLatenciesMs.length>32)semanticR443State.dispersalLatenciesMs.shift();semanticR443State.phase=SEMANTIC_R443_PHASE.COOLDOWN;semanticR443Log('dispersal-slice',{face:released,latencyMs:latency,phase,axis:move.axis,layer:move.layer,direction:move.direction})}semanticR442MoveState.moveLog.push({presentationMs:presentationSimTimeMs,phase,axis:move.axis,layer:move.layer,direction:move.direction,protected:semanticR442State.protected,protectedFace:semanticR442State.protectedFace,semanticIntersection:intersection.count,r443Phase:semanticR443State.phase});if(semanticR442MoveState.moveLog.length>160)semanticR442MoveState.moveLog.shift();return intersection}`;
source = source.slice(0, recordStart) + recordReplacement + source.slice(helperStart);

// While readable, keep safe choreography alive but do not build a long unresolved
// backlog behind the semantic face. One safe forward + its exact inverse remains
// a living slice phrase; global presentation rotation never changes speed.
replaceUnique(
  "const r=seededUnit(),requestedLength=r<.34?1:r<.82?2:3,executed=[]",
  "const r=seededUnit(),requestedLength=semanticR443State.phase===SEMANTIC_R443_PHASE.READABLE_LOCK?1:(r<.34?1:r<.82?2:3),executed=[]",
  'bounded readable safe phrase length',
);

// If release happens during a forward turn, finish that turn but add no further
// forward turns to the phrase. All already-executed moves MUST still resolve.
replaceUnique(
  "executed.push(move);if(i<requestedLength-1)await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)))",
  "executed.push(move);if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL)break;if(i<requestedLength-1)await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)))",
  'stop forward accumulation after release',
);

// During DISPERSAL, drain the exact inverse stack without cosmetic hold/micro-gaps.
// Never abandon an inverse: mechanical self-resolution is a hard invariant.
replaceUnique(
  "await schedulerDelay(Math.round(seededRange(240,410)));for(let i=executed.length-1;i>=0;i--)",
  "if(semanticR443State.phase!==SEMANTIC_R443_PHASE.DISPERSAL)await schedulerDelay(Math.round(seededRange(240,410)));for(let i=executed.length-1;i>=0;i--)",
  'skip pre-resolve hold during dispersal',
);

replaceUnique(
  "semanticR442RecordMove(inverse,'resolve');await turnSlice(inverse);if(i>0)await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)))",
  "if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL&&semanticR443State.lastReleaseFace&&semanticR442MoveIntersection(inverse,semanticR443State.lastReleaseFace).count>0){const remain=SEMANTIC_R443_CONFIG.dispersalTargetMs[0]-(presentationSimTimeMs-semanticR443State.lastReleaseMs);if(remain>0)await schedulerDelay(remain)}semanticR442RecordMove(inverse,'resolve');await turnSlice(inverse);if(i>0&&semanticR443State.phase!==SEMANTIC_R443_PHASE.DISPERSAL)await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)))",
  'full resolve with dispersal clearance and no backlog gaps',
);

// After full mechanical resolution, if the released face still has not
// participated, immediately start the next weighted scheduler event rather than
// entering a normal breathing gap. The weighting—not a forced turn—chooses it.
replaceUnique(
  "sliceEventSerial+=executed.length;eventsUntilBreath-=1;if(!sliceSchedulerEnabled)break;",
  "sliceEventSerial+=executed.length;if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL)continue;eventsUntilBreath-=1;if(!sliceSchedulerEnabled)break;",
  'immediate weighted post-resolution dispersal choice',
);

for (const required of [
  "SEMANTIC_R443_PHASE.CANDIDATE&&semanticR443State.candidateFace",
  "semanticR442MoveIntersection(m,semanticR443State.candidateFace).count===0",
  "requestedLength=semanticR443State.phase===SEMANTIC_R443_PHASE.READABLE_LOCK?1",
  "if(activeTurns.size>0)return;",
  'async function waitForSliceAutonomy(',
  'async function schedulerDelay(',
  "if(semanticR443State.phase!==SEMANTIC_R443_PHASE.DISPERSAL)await schedulerDelay(Math.round(seededRange(240,410)))",
  "if(i>0&&semanticR443State.phase!==SEMANTIC_R443_PHASE.DISPERSAL)",
  "sliceEventSerial+=executed.length;if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL)continue",
  "dispersalTargetMs[0]-(presentationSimTimeMs-semanticR443State.lastReleaseMs)",
  "yawDirectionPolicy:'continuous-positive'",
  'maxReadableMs:2400',
  'semanticVelocityMultiplier: 1.0',
]) if (!source.includes(required)) throw new Error(`R4.4.3 candidate/dispersal hotfix missing invariant: ${required}`);

for (const forbidden of [
  "semanticR443ResetCandidate('active-slice')",
  "await turnSlice(inverse);if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL)break",
  'wallDeltaMs * semanticTimeScale',
  'SEMANTIC_R4_2_TEXT',
  'emissiveIntensity',
]) if (source.includes(forbidden)) throw new Error(`R4.4.3 candidate/dispersal forbidden regression: ${forbidden}`);

fs.writeFileSync(file, source);
console.log('R4.4.3 full self-resolution + bounded readable backlog + immediate weighted dispersal applied');
