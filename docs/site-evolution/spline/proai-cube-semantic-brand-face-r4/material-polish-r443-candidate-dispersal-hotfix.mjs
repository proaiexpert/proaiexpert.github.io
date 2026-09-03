import fs from 'node:fs';

const file = new URL('./main.generated.js', import.meta.url);
let source = fs.readFileSync(file, 'utf8');

const replaceUnique = (find, replacement, label) => {
  const at = source.indexOf(find);
  const next = at >= 0 ? source.indexOf(find, at + find.length) : -1;
  if (at < 0 || next >= 0) throw new Error(`R4.4.3 candidate/dispersal hotfix ${label}: ${at}/${next}`);
  source = source.slice(0, at) + replacement + source.slice(at + find.length);
};

// Track the exact self-resolving scheduler backlog. A semantic face may be
// discovered while an unrelated active slice is moving, but it must never enter
// READABLE_LOCK until every previously scheduled inverse is mechanically resolved.
const stateAnchor = "const semanticR443State={phase:SEMANTIC_R443_PHASE.NORMAL";
const stateAt = source.indexOf(stateAnchor);
if (stateAt < 0 || source.indexOf(stateAnchor, stateAt + stateAnchor.length) >= 0) throw new Error(`R4.4.3 state insertion anchor invalid: ${stateAt}`);
source = source.slice(0, stateAt) + "let semanticR443PendingResolutionCount=0;\n" + source.slice(stateAt);

// Active-turn safety is face-local. Unrelated slices no longer suppress candidate
// discovery; any turn whose axis/layer intersects a face still makes it ineligible.
const activeFaceHelper = "function semanticR443FaceClearOfActiveTurns(face){if(!face)return false;for(const turn of activeTurns.values()){if(semanticR442MoveIntersection({axis:turn.axis,layer:turn.layer},face).count>0)return false}return true}\n";
const bestAnchor = 'function semanticR443BestEligibleFace(){';
const bestAt = source.indexOf(bestAnchor);
if (bestAt < 0 || source.indexOf(bestAnchor, bestAt + bestAnchor.length) >= 0) throw new Error(`R4.4.3 active-face helper anchor invalid: ${bestAt}`);
source = source.slice(0, bestAt) + activeFaceHelper + source.slice(bestAt);
replaceUnique(
  'const eligible=list.filter(q=>q.assembled&&q.r443Armed).sort((a,b)=>b.r443SelectionScore-a.r443SelectionScore);',
  'const eligible=list.filter(q=>q.assembled&&q.r443Armed&&semanticR443FaceClearOfActiveTurns(q.face)).sort((a,b)=>b.r443SelectionScore-a.r443SelectionScore);',
  'active-turn-safe best face filter',
);

// CANDIDATE is a brief local constraint, never a global motion mode. Only moves
// intersecting the naturally discovered face are excluded during the tiny dwell.
// DISPERSAL keeps the 350 ms optical-clearance floor before that released face
// can participate again; every other axis/layer remains autonomous.
replaceUnique(
  "function semanticR442SelectMove(){let candidates=semanticR442AllMoveCandidates();if(semanticR442State.protected)candidates=candidates.filter(m=>semanticR442MoveIntersection(m).count===0);if(!candidates.length){semanticR442MoveState.skipped++;return null}const weighted=candidates.map(move=>({move,weight:semanticR442RecentWeight(move)})),total=weighted.reduce((s,x)=>s+x.weight,0);let pick=seededUnit()*total;for(const item of weighted){pick-=item.weight;if(pick<=0)return item.move}return weighted.at(-1).move}",
  "function semanticR442SelectMove(){let candidates=semanticR442AllMoveCandidates();if(semanticR442State.protected)candidates=candidates.filter(m=>semanticR442MoveIntersection(m).count===0);else if(semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE&&semanticR443State.candidateFace)candidates=candidates.filter(m=>semanticR442MoveIntersection(m,semanticR443State.candidateFace).count===0);if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL&&semanticR443State.lastReleaseFace&&presentationSimTimeMs-semanticR443State.lastReleaseMs<SEMANTIC_R443_CONFIG.dispersalTargetMs[0])candidates=candidates.filter(m=>semanticR442MoveIntersection(m,semanticR443State.lastReleaseFace).count===0);if(!candidates.length){semanticR442MoveState.skipped++;return null}const weighted=candidates.map(move=>({move,weight:semanticR442RecentWeight(move)})),total=weighted.reduce((s,x)=>s+x.weight,0);let pick=seededUnit()*total;for(const item of weighted){pick-=item.weight;if(pick<=0)return item.move}return weighted.at(-1).move}",
  'candidate-local vocabulary + early dispersal guard',
);

// Replace the old global active-turn suppression with exact face-local safety.
replaceUnique(
  "if(activeTurns.size>0){if(semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE)semanticR443ResetCandidate('active-slice');return}",
  "if(semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE&&!semanticR443FaceClearOfActiveTurns(semanticR443State.candidateFace)){semanticR443ResetCandidate('active-intersection');return}",
  'face-local active-turn candidate safety',
);

// A candidate may mature during unrelated slice motion, but zero-tearing requires
// the inherited phrase inverse stack to be completely empty before protection.
replaceUnique(
  'if(dwell>=SEMANTIC_R443_CONFIG.candidateDwellMs&&stableNearPeak&&enter)semanticR443Lock(q);return',
  'if(dwell>=SEMANTIC_R443_CONFIG.candidateDwellMs&&stableNearPeak&&enter&&semanticR443PendingResolutionCount===0&&semanticR443FaceClearOfActiveTurns(q.face))semanticR443Lock(q);return',
  'pending-resolution lock gate',
);

// Preserve the scheduler helpers inserted by the scheduler-scope repair.
const recordStart = source.indexOf("function semanticR442RecordMove(move,phase='forward'){");
const helperStart = source.indexOf('\nasync function waitForSliceAutonomy(){', recordStart);
const schedulerStart = source.indexOf('\nasync function sliceSchedulerLoop(){', recordStart);
if (recordStart < 0 || helperStart < 0 || schedulerStart < 0 || helperStart >= schedulerStart || source.indexOf("function semanticR442RecordMove(move,phase='forward'){", recordStart + 1) >= 0) {
  throw new Error(`R4.4.3 candidate/dispersal record boundary invalid: record=${recordStart} helper=${helperStart} scheduler=${schedulerStart}`);
}
const recordReplacement = `function semanticR442RecordMove(move,phase='forward'){const intersection=semanticR442State.protected?semanticR442MoveIntersection(move):{count:0,ids:[]};if(semanticR442State.protected&&intersection.count>0)semanticR442State.unsafeProtectedStarts++;if(phase==='forward'){semanticR442MoveState.recentMoves.push({axis:move.axis,layer:move.layer,direction:move.direction,presentationMs:presentationSimTimeMs});if(semanticR442MoveState.recentMoves.length>5)semanticR442MoveState.recentMoves.shift();semanticR442MoveState.axisCounts[move.axis]=(semanticR442MoveState.axisCounts[move.axis]||0)+1;semanticR442MoveState.layerCounts[String(move.layer)]=(semanticR442MoveState.layerCounts[String(move.layer)]||0)+1;semanticR442MoveState.selectionCount++}const released=semanticR443State.lastReleaseFace,rejoin=released?semanticR442MoveIntersection(move,released):{count:0,ids:[]};if(released&&presentationSimTimeMs-semanticR443State.lastReleaseMs<12000&&rejoin.count>0){semanticR442State.postReleaseParticipationCount++;semanticR442State.lastPostReleaseParticipation={face:released,presentationMs:presentationSimTimeMs,phase,move:{axis:move.axis,layer:move.layer,direction:move.direction}}}if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL&&released&&rejoin.count>0){const latency=Math.max(0,presentationSimTimeMs-semanticR443State.lastReleaseMs);semanticR443State.dispersalDone=true;semanticR443State.dispersalLatencyMs=latency;semanticR443State.dispersalLatenciesMs.push(latency);if(semanticR443State.dispersalLatenciesMs.length>32)semanticR443State.dispersalLatenciesMs.shift();semanticR443State.phase=SEMANTIC_R443_PHASE.COOLDOWN;semanticR443Log('dispersal-slice',{face:released,latencyMs:latency,phase,axis:move.axis,layer:move.layer,direction:move.direction})}semanticR442MoveState.moveLog.push({presentationMs:presentationSimTimeMs,phase,axis:move.axis,layer:move.layer,direction:move.direction,protected:semanticR442State.protected,protectedFace:semanticR442State.protectedFace,semanticIntersection:intersection.count,r443Phase:semanticR443State.phase,pendingResolutionCount:semanticR443PendingResolutionCount});if(semanticR442MoveState.moveLog.length>160)semanticR442MoveState.moveLog.shift();return intersection}`;
source = source.slice(0, recordStart) + recordReplacement + source.slice(helperStart);

// While readable, keep safe choreography alive but do not build a long unresolved
// backlog behind the semantic face. One safe forward + its exact inverse remains
// a living slice phrase; global presentation rotation never changes speed.
replaceUnique(
  "const r=seededUnit(),requestedLength=r<.34?1:r<.82?2:3,executed=[]",
  "const r=seededUnit(),requestedLength=semanticR443State.phase===SEMANTIC_R443_PHASE.READABLE_LOCK?1:(r<.34?1:r<.82?2:3),executed=[]",
  'bounded readable safe phrase length',
);

// Exact pending-resolution accounting begins as each forward move is accepted.
replaceUnique(
  "executed.push(move);if(i<requestedLength-1)await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)))",
  "executed.push(move);semanticR443PendingResolutionCount=executed.length;if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL)break;if(i<requestedLength-1)await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)))",
  'pending-resolution forward accounting',
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
  "if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL&&semanticR443State.lastReleaseFace&&semanticR442MoveIntersection(inverse,semanticR443State.lastReleaseFace).count>0){const remain=SEMANTIC_R443_CONFIG.dispersalTargetMs[0]-(presentationSimTimeMs-semanticR443State.lastReleaseMs);if(remain>0)await schedulerDelay(remain)}semanticR442RecordMove(inverse,'resolve');await turnSlice(inverse);semanticR443PendingResolutionCount=Math.max(0,semanticR443PendingResolutionCount-1);if(i>0&&semanticR443State.phase!==SEMANTIC_R443_PHASE.DISPERSAL)await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)))",
  'full resolve accounting + dispersal clearance',
);

// After complete self-resolution, if released-face participation is still pending,
// immediately start the next weighted event instead of entering a breathing gap.
replaceUnique(
  "sliceEventSerial+=executed.length;eventsUntilBreath-=1;if(!sliceSchedulerEnabled)break;",
  "semanticR443PendingResolutionCount=0;sliceEventSerial+=executed.length;if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL)continue;eventsUntilBreath-=1;if(!sliceSchedulerEnabled)break;",
  'resolved-stack completion + immediate weighted dispersal',
);

for (const required of [
  'let semanticR443PendingResolutionCount=0;',
  'function semanticR443FaceClearOfActiveTurns(face)',
  'activeTurns.values()',
  'q.r443Armed&&semanticR443FaceClearOfActiveTurns(q.face)',
  'semanticR443PendingResolutionCount===0&&semanticR443FaceClearOfActiveTurns(q.face)',
  "SEMANTIC_R443_PHASE.CANDIDATE&&semanticR443State.candidateFace",
  "requestedLength=semanticR443State.phase===SEMANTIC_R443_PHASE.READABLE_LOCK?1",
  'async function schedulerDelay(',
  'semanticR443PendingResolutionCount=executed.length',
  'semanticR443PendingResolutionCount=Math.max(0,semanticR443PendingResolutionCount-1)',
  'semanticR443PendingResolutionCount=0;sliceEventSerial+=executed.length',
  "yawDirectionPolicy:'continuous-positive'",
  'maxReadableMs:2400',
  'semanticVelocityMultiplier: 1.0',
]) if (!source.includes(required)) throw new Error(`R4.4.3 candidate/dispersal hotfix missing invariant: ${required}`);

for (const forbidden of [
  "semanticR443ResetCandidate('active-slice')",
  "if(activeTurns.size>0)return;",
  "await turnSlice(inverse);if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL)break",
  'wallDeltaMs * semanticTimeScale',
  'SEMANTIC_R4_2_TEXT',
  'emissiveIntensity',
]) if (source.includes(forbidden)) throw new Error(`R4.4.3 candidate/dispersal forbidden regression: ${forbidden}`);

fs.writeFileSync(file, source);
console.log('R4.4.3 active-turn-safe discovery + pending-resolution zero-tearing gate + bounded dispersal applied');
