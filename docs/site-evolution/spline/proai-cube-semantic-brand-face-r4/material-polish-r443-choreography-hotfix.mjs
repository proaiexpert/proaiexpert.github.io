import fs from 'node:fs';

const file = new URL('./main.generated.js', import.meta.url);
let source = fs.readFileSync(file, 'utf8');

const replaceUnique = (find, replacement, label) => {
  const at = source.indexOf(find);
  const next = at >= 0 ? source.indexOf(find, at + find.length) : -1;
  if (at < 0 || next >= 0) throw new Error(`R4.4.3 choreography hotfix ${label}: ${at}/${next}`);
  source = source.slice(0, at) + replacement + source.slice(at + find.length);
};

replaceUnique(
  'candidateApproachScore:.66,candidateApproachView:.52,candidateDwellMs:320,enterScore:.76,enterView:.58,enterArea:.34,enterBrdf:.26,exitScore:.54,exitView:.50,releaseDebounceMs:90,maxReadableMs:2400,rearmScore:.50,cooldownRangeMs:[2600,5600],minAngularTravelDeg:28,minPostReleaseSlices:1,dispersalTargetMs:[350,1250]',
  'candidateApproachScore:.58,candidateApproachView:.46,candidateDwellMs:80,enterScore:.64,enterView:.52,enterArea:.26,enterBrdf:.18,exitScore:.54,exitView:.50,releaseDebounceMs:90,maxReadableMs:2400,rearmScore:.56,cooldownRangeMs:[2200,4200],minAngularTravelDeg:18,minPostReleaseSlices:1,dispersalTargetMs:[350,1250]',
  'natural candidate capture + event breathing',
);

replaceUnique(
  "async function schedulerDelay(durationMs){let elapsed=0;let previous=performance.now();while(elapsed<durationMs&&sliceSchedulerEnabled){await sleep(Math.min(32,Math.max(8,durationMs-elapsed)));const now=performance.now();const delta=now-previous;previous=now;if(!sliceAutonomyBlocked())elapsed+=delta}}",
  "async function schedulerDelay(durationMs){let elapsed=0;let previous=performance.now();while(elapsed<durationMs&&sliceSchedulerEnabled){await sleep(Math.min(32,Math.max(8,durationMs-elapsed)));const now=performance.now();const delta=now-previous;previous=now;if(!sliceAutonomyBlocked())elapsed+=delta;if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL){const age=presentationSimTimeMs-semanticR443State.lastReleaseMs;if(age>=SEMANTIC_R443_CONFIG.dispersalTargetMs[0])return}}}",
  'interruptible post-release scheduler gap',
);

replaceUnique(
  'if(intersects){if(age<SEMANTIC_R443_CONFIG.dispersalTargetMs[0])w*=.12;else if(age<=SEMANTIC_R443_CONFIG.dispersalTargetMs[1])w*=7.5;else w*=14}else if(age>=SEMANTIC_R443_CONFIG.dispersalTargetMs[0])w*=.78',
  'if(intersects){if(age<SEMANTIC_R443_CONFIG.dispersalTargetMs[0])return 0;else if(age<=SEMANTIC_R443_CONFIG.dispersalTargetMs[1])w*=24;else w*=32}else if(age>=SEMANTIC_R443_CONFIG.dispersalTargetMs[0])w*=.42',
  'post-release no-early-tear + strong priority weighting',
);

for (const required of [
  'candidateDwellMs:80',
  'enterScore:.64',
  'rearmScore:.56',
  'cooldownRangeMs:[2200,4200]',
  'minAngularTravelDeg:18',
  'dispersalTargetMs:[350,1250]',
  'if(age<SEMANTIC_R443_CONFIG.dispersalTargetMs[0])return 0',
  'w*=24',
  'w*=32',
  'semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL',
  'age>=SEMANTIC_R443_CONFIG.dispersalTargetMs[0]',
  "yawDirectionPolicy:'continuous-positive'",
  'maxReadableMs:2400',
  'semanticVelocityMultiplier: 1.0',
]) if (!source.includes(required)) throw new Error(`R4.4.3 choreography hotfix missing invariant: ${required}`);

fs.writeFileSync(file, source);
console.log('R4.4.3 no-early-tear dispersal + natural semantic breathing applied');
