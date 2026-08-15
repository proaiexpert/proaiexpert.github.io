import fs from 'node:fs';

const file = new URL('./main.generated.js', import.meta.url);
let source = fs.readFileSync(file, 'utf8');

const replaceUnique = (find, replacement, label) => {
  const at = source.indexOf(find);
  const next = at >= 0 ? source.indexOf(find, at + find.length) : -1;
  if (at < 0 || next >= 0) throw new Error(`R4.4.3 candidate/dispersal hotfix ${label}: ${at}/${next}`);
  source = source.slice(0, at) + replacement + source.slice(at + find.length);
};

// CANDIDATE is a brief local constraint, never a motion mode. During the ~80 ms
// dwell, only moves intersecting that naturally discovered face are excluded;
// all other autonomous slice choreography stays alive. DISPERSAL keeps a 350 ms
// optical-clearance floor before the released face may participate again.
replaceUnique(
  "function semanticR442SelectMove(){let candidates=semanticR442AllMoveCandidates();if(semanticR442State.protected)candidates=candidates.filter(m=>semanticR442MoveIntersection(m).count===0);if(!candidates.length){semanticR442MoveState.skipped++;return null}const weighted=candidates.map(move=>({move,weight:semanticR442RecentWeight(move)})),total=weighted.reduce((s,x)=>s+x.weight,0);let pick=seededUnit()*total;for(const item of weighted){pick-=item.weight;if(pick<=0)return item.move}return weighted.at(-1).move}",
  "function semanticR442SelectMove(){let candidates=semanticR442AllMoveCandidates();if(semanticR442State.protected)candidates=candidates.filter(m=>semanticR442MoveIntersection(m).count===0);else if(semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE&&semanticR443State.candidateFace)candidates=candidates.filter(m=>semanticR442MoveIntersection(m,semanticR443State.candidateFace).count===0);if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL&&semanticR443State.lastReleaseFace&&presentationSimTimeMs-semanticR443State.lastReleaseMs<SEMANTIC_R443_CONFIG.dispersalTargetMs[0])candidates=candidates.filter(m=>semanticR442MoveIntersection(m,semanticR443State.lastReleaseFace).count===0);if(!candidates.length){semanticR442MoveState.skipped++;return null}const weighted=candidates.map(move=>({move,weight:semanticR442RecentWeight(move)})),total=weighted.reduce((s,x)=>s+x.weight,0);let pick=seededUnit()*total;for(const item of weighted){pick-=item.weight;if(pick<=0)return item.move}return weighted.at(-1).move}",
  'candidate-local vocabulary + early dispersal guard',
);

// A slice that was already active before discovery is allowed to finish. We do not
// cancel the candidate merely because any safe turn exists; exact assembly/optics
// are re-evaluated immediately after that turn.
replaceUnique(
  "if(activeTurns.size>0){if(semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE)semanticR443ResetCandidate('active-slice');return}",
  "if(activeTurns.size>0)return;",
  'active-turn candidate re-evaluation continuity',
);

// Replace only the record helper. Preserve waitForSliceAutonomy/schedulerDelay,
// which are inserted immediately after this helper by the scheduler-scope repair.
const recordStart = source.indexOf("function semanticR442RecordMove(move,phase='forward'){");
const helperStart = source.indexOf('\nasync function waitForSliceAutonomy(){', recordStart);
const schedulerStart = source.indexOf('\nasync function sliceSchedulerLoop(){', recordStart);
if (recordStart < 0 || helperStart < 0 || schedulerStart < 0 || helperStart >= schedulerStart || source.indexOf("function semanticR442RecordMove(move,phase='forward'){", recordStart + 1) >= 0) {
  throw new Error(`R4.4.3 candidate/dispersal record boundary invalid: record=${recordStart} helper=${helperStart} scheduler=${schedulerStart}`);
}
const recordReplacement = `function semanticR442RecordMove(move,phase='forward'){const intersection=semanticR442State.protected?semanticR442MoveIntersection(move):{count:0,ids:[]};if(semanticR442State.protected&&intersection.count>0)semanticR442State.unsafeProtectedStarts++;if(phase==='forward'){semanticR442MoveState.recentMoves.push({axis:move.axis,layer:move.layer,direction:move.direction,presentationMs:presentationSimTimeMs});if(semanticR442MoveState.recentMoves.length>5)semanticR442MoveState.recentMoves.shift();semanticR442MoveState.axisCounts[move.axis]=(semanticR442MoveState.axisCounts[move.axis]||0)+1;semanticR442MoveState.layerCounts[String(move.layer)]=(semanticR442MoveState.layerCounts[String(move.layer)]||0)+1;semanticR442MoveState.selectionCount++}const released=semanticR443State.lastReleaseFace,rejoin=released?semanticR442MoveIntersection(move,released):{count:0,ids:[]};if(released&&presentationSimTimeMs-semanticR443State.lastReleaseMs<12000&&rejoin.count>0){semanticR442State.postReleaseParticipationCount++;semanticR442State.lastPostReleaseParticipation={face:released,presentationMs:presentationSimTimeMs,phase,move:{axis:move.axis,layer:move.layer,direction:move.direction}}}if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL&&released&&rejoin.count>0){const latency=Math.max(0,presentationSimTimeMs-semanticR443State.lastReleaseMs);semanticR443State.dispersalDone=true;semanticR443State.dispersalLatencyMs=latency;semanticR443State.dispersalLatenciesMs.push(latency);if(semanticR443State.dispersalLatenciesMs.length>32)semanticR443State.dispersalLatenciesMs.shift();semanticR443State.phase=SEMANTIC_R443_PHASE.COOLDOWN;semanticR443Log('dispersal-slice',{face:released,latencyMs:latency,phase,axis:move.axis,layer:move.layer,direction:move.direction})}semanticR442MoveState.moveLog.push({presentationMs:presentationSimTimeMs,phase,axis:move.axis,layer:move.layer,direction:move.direction,protected:semanticR442State.protected,protectedFace:semanticR442State.protectedFace,semanticIntersection:intersection.count,r443Phase:semanticR443State.phase});if(semanticR442MoveState.moveLog.length>160)semanticR442MoveState.moveLog.shift();return intersection}`;
source = source.slice(0, recordStart) + recordReplacement + source.slice(helperStart);

// A release may occur while a long self-resolving phrase is already underway.
// Finish the currently running turn, then stop adding more forward/resolve turns
// while DISPERSAL is pending so the next scheduler choice can use the strong
// released-face weighting instead of waiting behind the rest of that phrase.
replaceUnique(
  "executed.push(move);if(i<requestedLength-1)await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)))",
  "executed.push(move);if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL)break;if(i<requestedLength-1)await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)))",
  'interrupt forward phrase after release',
);

replaceUnique(
  "semanticR442RecordMove(inverse,'resolve');await turnSlice(inverse);if(i>0)await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)))",
  "if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL&&semanticR443State.lastReleaseFace&&semanticR442MoveIntersection(inverse,semanticR443State.lastReleaseFace).count>0){const remain=SEMANTIC_R443_CONFIG.dispersalTargetMs[0]-(presentationSimTimeMs-semanticR443State.lastReleaseMs);if(remain>0)await schedulerDelay(remain)}semanticR442RecordMove(inverse,'resolve');await turnSlice(inverse);if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL)break;if(i>0)await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)))",
  'resolve clearance + interrupt remaining phrase',
);

for (const required of [
  "SEMANTIC_R443_PHASE.CANDIDATE&&semanticR443State.candidateFace",
  "semanticR442MoveIntersection(m,semanticR443State.candidateFace).count===0",
  "SEMANTIC_R443_PHASE.DISPERSAL&&semanticR443State.lastReleaseFace",
  "if(activeTurns.size>0)return;",
  'async function waitForSliceAutonomy(',
  'async function schedulerDelay(',
  "executed.push(move);if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL)break",
  "phase,axis:move.axis,layer:move.layer,direction:move.direction",
  "dispersalTargetMs[0]-(presentationSimTimeMs-semanticR443State.lastReleaseMs)",
  "yawDirectionPolicy:'continuous-positive'",
  'maxReadableMs:2400',
  'semanticVelocityMultiplier: 1.0',
]) if (!source.includes(required)) throw new Error(`R4.4.3 candidate/dispersal hotfix missing invariant: ${required}`);

for (const forbidden of [
  "semanticR443ResetCandidate('active-slice')",
  'wallDeltaMs * semanticTimeScale',
  'SEMANTIC_R4_2_TEXT',
  'emissiveIntensity',
]) if (source.includes(forbidden)) throw new Error(`R4.4.3 candidate/dispersal forbidden regression: ${forbidden}`);

fs.writeFileSync(file, source);
console.log('R4.4.3 local candidate protection + phrase-interruptible resolve-aware dispersal applied');
