import fs from 'node:fs';

const file = new URL('./main.generated.js', import.meta.url);
let source = fs.readFileSync(file, 'utf8');

const schedulerAnchor = 'async function sliceSchedulerLoop(){';
const anchorAt = source.indexOf(schedulerAnchor);
if (anchorAt < 0 || source.indexOf(schedulerAnchor, anchorAt + schedulerAnchor.length) >= 0) {
  throw new Error(`R4.4.3 scheduler hotfix anchor invalid: ${anchorAt}`);
}

const waitHelper = 'async function waitForSliceAutonomy(){while(sliceSchedulerEnabled&&sliceAutonomyBlocked())await sleep(40);return sliceSchedulerEnabled}';
const delayHelper = 'async function schedulerDelay(durationMs){let elapsed=0;let previous=performance.now();while(elapsed<durationMs&&sliceSchedulerEnabled){await sleep(Math.min(32,Math.max(8,durationMs-elapsed)));const now=performance.now();const delta=now-previous;previous=now;if(!sliceAutonomyBlocked())elapsed+=delta}}';

if (source.includes('async function waitForSliceAutonomy(') || source.includes('async function schedulerDelay(')) {
  throw new Error('R4.4.3 scheduler hotfix expected helpers to be absent before repair');
}

source = source.slice(0, anchorAt) + waitHelper + '\n' + delayHelper + '\n' + source.slice(anchorAt);

for (const required of [
  'async function waitForSliceAutonomy(',
  'async function schedulerDelay(',
  'async function sliceSchedulerLoop(){',
  'SEMANTIC_R443_PHASE',
  "yawDirectionPolicy:'continuous-positive'",
  'semanticVelocityMultiplier: 1.0',
  'const deltaMs=wallDeltaMs',
]) if (!source.includes(required)) throw new Error(`R4.4.3 scheduler hotfix missing invariant: ${required}`);

fs.writeFileSync(file, source);
console.log('R4.4.3 scheduler helper scope restored');
