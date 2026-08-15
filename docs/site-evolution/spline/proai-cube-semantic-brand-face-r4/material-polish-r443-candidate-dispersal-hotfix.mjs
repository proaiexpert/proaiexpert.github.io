import fs from 'node:fs';

const file = new URL('./main.generated.js', import.meta.url);
let source = fs.readFileSync(file, 'utf8');

const replaceUnique = (find, replacement, label) => {
  const at = source.indexOf(find);
  const next = at >= 0 ? source.indexOf(find, at + find.length) : -1;
  if (at < 0 || next >= 0) throw new Error(`R4.4.3 candidate/dispersal hotfix ${label}: ${at}/${next}`);
  source = source.slice(0, at) + replacement + source.slice(at + find.length);
};

// CANDIDATE is a local semantic constraint, not a global slice stop.
// Safe autonomous slices may continue; only moves intersecting the candidate face
// are removed from the scheduler vocabulary during the short candidate dwell.
replaceUnique(
  "function semanticR442SelectMove(){let candidates=semanticR442AllMoveCandidates();if(semanticR442State.protected)candidates=candidates.filter(m=>semanticR442MoveIntersection(m).count===0);if(!candidates.length){semanticR442MoveState.skipped++;return null}const weighted=candidates.map(move=>({move,weight:semanticR442RecentWeight(move)})),total=weighted.reduce((s,x)=>s+x.weight,0);let pick=seededUnit()*total;for(const item of weighted){pick-=item.weight;if(pick<=0)return item.move}return weighted.at(-1).move}",
  "function semanticR442SelectMove(){let candidates=semanticR442AllMoveCandidates();if(semanticR442State.protected)candidates=candidates.filter(m=>semanticR442MoveIntersection(m).count===0);else if(semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE&&semanticR443State.candidateFace)candidates=candidates.filter(m=>semanticR442MoveIntersection(m,semanticR443State.candidateFace).count===0);if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL&&semanticR443State.lastReleaseFace&&presentationSimTimeMs-semanticR443State.lastReleaseMs<SEMANTIC_R443_CONFIG.dispersalTargetMs[0])candidates=candidates.filter(m=>semanticR442MoveIntersection(m,semanticR443State.lastReleaseFace).count===0);if(!candidates.length){semanticR442MoveState.skipped++;return null}const weighted=candidates.map(move=>({move,weight:semanticR442RecentWeight(move)})),total=weighted.reduce((s,x)=>s+x.weight,0);let pick=seededUnit()*total;for(const item of weighted){pick-=item.weight;if(pick<=0)return item.move}return weighted.at(-1).move}",
  'candidate-local move vocabulary + early dispersal guard',
);

// Do not throw away a naturally developing candidate merely because another
// non-intersecting slice is active. Once the active turn ends we re-evaluate the
// exact face assembly/optics; an intersecting manual turn naturally fails that test.
replaceUnique(
  "if(activeTurns.size>0){if(semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE)semanticR443ResetCandidate('active-slice');return}",
  "if(activeTurns.size>0)return",
  'safe active slice candidate continuity',
);

// A resolve turn is physically visible choreography too. Count the first actual
// released-face participation regardless of forward/resolve phase. Keep diversity
// counters forward-only so QA vocabulary statistics remain comparable.
const recordStart = source.indexOf("function semanticR442RecordMove(move,phase='forward'){");
const schedulerStart = source.indexOf('\nasync function sliceSchedulerLoop(){', recordStart);
if (recordStart < 0 || schedulerStart < 0 || source.indexOf("function semanticR442RecordMove(move,phase='forward'){", recordStart + 1) >= 0) {
  throw new Error(`R4.4.3 candidate/dispersal record boundary invalid: ${recordStart}/${schedulerStart}`);
}
const recordReplacement = `function semanticR442RecordMove(move,phase='forward'){const intersection=semanticR442State.protected?semanticR442MoveIntersection(move):{count:0,ids:[]};if(semanticR442State.protected&&intersection.count>0)semanticR442State.unsafeProtectedStarts++;if(phase==='forward'){semanticR442MoveState.recentMoves.push({axis:move.axis,layer:move.layer,direction:move.direction,presentationMs:presentationSimTimeMs});if(semanticR442MoveState.recentMoves.length>5)semanticR442MoveState.recentMoves.shift();semanticR442MoveState.axisCounts[move.axis]=(semanticR442MoveState.axisCounts[move.axis]||0)+1;semanticR442MoveState.layerCounts[String(move.layer)]=(semanticR442MoveState.layerCounts[String(move.layer)]||0)+1;semanticR442MoveState.selectionCount++}const released=semanticR443State.lastReleaseFace,rejoin=released?semanticR442MoveIntersection(move,released):{count:0,ids:[]};if(released&&presentationSimTimeMs-semanticR443State.lastReleaseMs<12000&&rejoin.count>0){semanticR442State.postReleaseParticipationCount++;semanticR442State.lastPostReleaseParticipation={face:released,presentationMs:presentationSimTimeMs,phase,move:{axis:move.axis,layer:move.layer,direction:move.direction}}}if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL&&released&&rejoin.count>0){const latency=Math.max(0,presentationSimTimeMs-semanticR443State.lastReleaseMs);semanticR443State.dispersalDone=true;semanticR443State.dispersalLatencyMs=latency;semanticR443State.dispersalLatenciesMs.push(latency);if(semanticR443State.dispersalLatenciesMs.length>32)semanticR443State.dispersalLatenciesMs.shift();semanticR443State.phase=SEMANTIC_R443_PHASE.COOLDOWN;semanticR443Log('dispersal-slice',{face:released,latencyMs:latency,phase,axis:move.axis,layer:move.layer,direction:move.direction})}semanticR442MoveState.moveLog.push({presentationMs:presentationSimTimeMs,phase,axis:move.axis,layer:move.layer,direction:move.direction,protected:semanticR442State.protected,protectedFace:semanticR442State.protectedFace,semanticIntersection:intersection.count,r443Phase:semanticR443State.phase});if(semanticR442MoveState.moveLog.length>160)semanticR442MoveState.moveLog.shift();return intersection}`;
source = source.slice(0, recordStart) + recordReplacement + source.slice(schedulerStart + 1);

// If a pre-existing phrase is resolving across the released face, honor the same
// 350 ms optical-clearance floor before that visible participation starts.
replaceUnique(
  "semanticR442RecordMove(inverse,'resolve');await turnSlice(inverse);",
  "if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL&&semanticR443State.lastReleaseFace&&semanticR442MoveIntersection(inverse,semanticR443State.lastReleaseFace).count>0){const remain=SEMANTIC_R443_CONFIG.dispersalTargetMs[0]-(presentationSimTimeMs-semanticR443State.lastReleaseMs);if(remain>0)await schedulerDelay(remain)}semanticR442RecordMove(inverse,'resolve');await turnSlice(inverse);",
  'resolve optical-clearance floor',
);

for (const required of [
  "SEMANTIC_R443_PHASE.CANDIDATE&&semanticR443State.candidateFace",
  "semanticR442MoveIntersection(m,semanticR443State.candidateFace).count===0",
  "if(activeTurns.size>0)return",
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
console.log('R4.4.3 safe-candidate continuity + resolve-aware bounded dispersal applied');
