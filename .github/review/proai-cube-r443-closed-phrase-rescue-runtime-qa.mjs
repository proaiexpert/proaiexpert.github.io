import { chromium } from 'playwright';
import fs from 'node:fs';

const url=process.env.QA_URL||'http://127.0.0.1:4173/';
const productSha=process.env.PRODUCT_SHA||'UNKNOWN';
const sampleMs=Number(process.env.SAMPLE_MS||60000);
const out='review-evidence/r443-closed-phrase-rescue';
fs.mkdirSync(out,{recursive:true});
const fatal=[];
const exactInverse=(a,b)=>!!a&&!!b&&a.axis===b.axis&&a.layer===b.layer&&a.direction===-b.direction;
const delta=(a=0,b=0)=>Math.max(0,(b||0)-(a||0));
const arrDelta=(a=[],b=[])=>b.slice(a.length);

const browser=await chromium.launch({headless:true,args:['--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:720,height:720},deviceScaleFactor:1,reducedMotion:'no-preference'});
const page=await context.newPage();
page.on('pageerror',e=>fatal.push('pageerror:'+String(e)));
page.on('console',m=>{if(m.type()==='error')fatal.push('console:'+m.text())});
const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
if(!response||response.status()!==200)throw new Error('navigation '+response?.status());
for(let i=0;i<300;i++){
  if(await page.evaluate(()=>window.__PROAI_CUBE_R1_2?.ready===true))break;
  await page.waitForTimeout(100);
  if(i===299)throw new Error('cube readiness timeout');
}

const snap=()=>page.evaluate(()=>({s:window.__PROAI_CUBE_R1_2.getSemanticDiagnostics(),d:window.__PROAI_CUBE_R1_2.getDiagnostics()}));
const start=await snap();
const startSim=start.d?.presentation?.simTimeMs??0;
await page.evaluate(()=>{
  window.__R443_RESCUE_TRACE=[];
  window.__R443_RESCUE_TIMER=setInterval(()=>{
    const s=window.__PROAI_CUBE_R1_2.getSemanticDiagnostics();
    const d=window.__PROAI_CUBE_R1_2.getDiagnostics();
    const life=s.r443Lifecycle||{},closed=s.r443ClosedPhrase||{},dyn=s.r442DynamicFace||{},motion=s.r443Motion||{};
    const faces=[closed.messageBearingFace,dyn.activeMaterialFace,dyn.protectedFace].filter(Boolean);
    window.__R443_RESCUE_TRACE.push({
      presentationMs:d?.presentation?.simTimeMs??0,
      phase:life.phase||null,
      protected:dyn.protected===true,
      protectedFace:dyn.protectedFace||null,
      messageBearingFace:closed.messageBearingFace||null,
      simultaneousBearingFaces:new Set(faces).size,
      timeScale:s.timeScale??1,
      semanticVelocityMultiplier:motion.semanticVelocityMultiplier??null,
      yawVelocityDegPerSec:motion.yawVelocityDegPerSec??null,
      cumulativeYawDeg:motion.cumulativeYawDeg??null,
      nextMessageIndex:life.nextMessageIndex??null,
      stagedFace:closed.messageBearingFace||life.stagedFace||null,
    });
  },200);
});
await page.waitForTimeout(sampleMs);
const end=await page.evaluate(()=>{
  clearInterval(window.__R443_RESCUE_TIMER);
  return {s:window.__PROAI_CUBE_R1_2.getSemanticDiagnostics(),d:window.__PROAI_CUBE_R1_2.getDiagnostics(),trace:window.__R443_RESCUE_TRACE||[]};
});

const life0=start.s.r443Lifecycle||{},life=end.s.r443Lifecycle||{};
const dyn0=start.s.r442DynamicFace||{},dyn=end.s.r442DynamicFace||{};
const div=end.s.r442MoveDiversity||{};
const closed0=start.s.r443ClosedPhrase||{},closed=end.s.r443ClosedPhrase||{};
const closedMetrics0=closed0.metrics||{},closedMetrics=closed.metrics||{};
const moveLog=(div.moveLog||[]).filter(m=>(m.presentationMs??-Infinity)>=startSim&&['closed-phrase','semantic-safe'].includes(m.phase));
const axisCounts={X:0,Y:0,Z:0},layerCounts={'-1':0,'0':0,'1':0};
for(const m of moveLog){axisCounts[m.axis]=(axisCounts[m.axis]||0)+1;layerCounts[String(m.layer)]=(layerCounts[String(m.layer)]||0)+1}
const inverseDistance={1:0,2:0,3:0,'4-8':0};
for(let i=0;i<moveLog.length;i++){
  for(let d=1;d<=8&&i-d>=0;d++)if(exactInverse(moveLog[i-d],moveLog[i])){if(d<=3)inverseDistance[d]++;else inverseDistance['4-8']++;break}
}
let maxSameAxisStreak=0,sameAxisStreak=0,maxCenterStreak=0,centerStreak=0,center=0;
for(let i=0;i<moveLog.length;i++){
  sameAxisStreak=i&&moveLog[i].axis===moveLog[i-1].axis?sameAxisStreak+1:1;
  maxSameAxisStreak=Math.max(maxSameAxisStreak,sameAxisStreak);
  if(moveLog[i].layer===0){center++;centerStreak++}else centerStreak=0;
  maxCenterStreak=Math.max(maxCenterStreak,centerStreak);
}
const phraseStarts=[];
for(let i=0;i<moveLog.length;i++){
  const prev=moveLog[i-1];
  const gap=prev?Math.max(0,(moveLog[i].presentationMs??0)-(prev.presentationMs??0)):Infinity;
  if(!prev||moveLog[i].phraseId!==prev.phraseId||gap>500)phraseStarts.push(moveLog[i]);
}
let samePhraseFamilyAdjacency=0;
for(let i=1;i<phraseStarts.length;i++)if(phraseStarts[i].phraseId===phraseStarts[i-1].phraseId)samePhraseFamilyAdjacency++;
const runtimeResolveMoves=(div.moveLog||[]).filter(m=>(m.presentationMs??-Infinity)>=startSim&&m.phase==='resolve');

const events=arrDelta(life0.eventLog||[],life.eventLog||[]);
const candidates=arrDelta(life0.candidateLog||[],life.candidateLog||[]);
const readableMs=arrDelta(life0.readableDurationsMs||[],life.readableDurationsMs||[]);
const intervalsMs=arrDelta(life0.opportunityIntervalsMs||[],life.opportunityIntervalsMs||[]);
const first=events[0]||null;
const firstDiscoverySec=first?((first.startMs-startSim)/1000):null;
let firstCandidateDurationMs=null;
if(first){const related=candidates.filter(c=>c.face===first.face&&(c.presentationMs??0)<=first.startMs);const c=related.at(-1);if(c)firstCandidateDurationMs=Math.max(0,first.startMs-c.presentationMs)}
const tearingViolations=delta(dyn0.unsafeProtectedStarts,dyn.unsafeProtectedStarts)+delta(dyn0.assemblyViolations,dyn.assemblyViolations);
const semanticFlashes=Math.max(0,(closed.semanticFlashCount||0)-(closed0.semanticFlashCount||0),readableMs.filter(x=>x<450).length);
const maxSimultaneousBearingFaces=Math.max(0,...end.trace.map(t=>t.simultaneousBearingFaces||0));
const protectionFootprint=closedMetrics.protectionFootprint??null;
const releasedFaceForcedMoves=closedMetrics.releasedFaceForcedMoves??0;
const phraseCountDelta=delta(closedMetrics0.phraseCount,closedMetrics.phraseCount);

const trace=end.trace;
const yawPositive=trace.length>20&&trace.every(t=>Number.isFinite(t.yawVelocityDegPerSec)&&t.yawVelocityDegPerSec>0);
const yawContinuous=trace.every((t,i)=>i===0||!Number.isFinite(t.cumulativeYawDeg)||!Number.isFinite(trace[i-1].cumulativeYawDeg)||t.cumulativeYawDeg>=trace[i-1].cumulativeYawDeg-1e-6);
const scaleValues=trace.map(t=>t.timeScale).filter(Number.isFinite);
const scaleAllOne=scaleValues.length>20&&scaleValues.every(v=>Math.abs(v-1)<1e-9)&&trace.every(t=>t.semanticVelocityMultiplier===1);
let beforeScale=1,duringScale=1,afterScale=1;
const protectedIdx=trace.map((t,i)=>t.protected?i:-1).filter(i=>i>=0);
if(protectedIdx.length){const firstI=protectedIdx[0],lastI=protectedIdx.at(-1);const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:1;beforeScale=avg(trace.slice(0,firstI).map(t=>t.timeScale));duringScale=avg(trace.slice(firstI,lastI+1).filter(t=>t.protected).map(t=>t.timeScale));afterScale=avg(trace.slice(lastI+1).map(t=>t.timeScale))}

// Minimal pointer interaction sanity: real pointer events on the rendered canvas,
// followed by continued autonomous simulation. No internal semantic controls are called.
const interactionBefore=await snap();
const canvas=page.locator('canvas').first();
const box=await canvas.boundingBox();
let pointerPass=false,autonomyResume=false,homeSnap=false,queueReset=false;
if(box){
  const x=box.x+box.width*.52,y=box.y+box.height*.50;
  const simBefore=interactionBefore.d?.presentation?.simTimeMs??0;
  const queueBefore=interactionBefore.s?.r443Lifecycle?.nextMessageIndex??null;
  await page.mouse.move(x,y);
  await page.mouse.down();
  await page.mouse.move(x+75,y-42,{steps:10});
  await page.mouse.up();
  pointerPass=true;
  const immediate=await snap();
  await page.waitForTimeout(2200);
  const resumed=await snap();
  const simAfter=resumed.d?.presentation?.simTimeMs??0;
  autonomyResume=simAfter>simBefore+1000;
  const queueAfter=resumed.s?.r443Lifecycle?.nextMessageIndex??null;
  queueReset=queueBefore!==null&&queueAfter===0&&queueBefore!==0;
  const interactionText=JSON.stringify({before:interactionBefore.d?.interaction??interactionBefore.d?.presentation??null,immediate:immediate.d?.interaction??immediate.d?.presentation??null,resumed:resumed.d?.interaction??resumed.d?.presentation??null});
  homeSnap=/homeSnap[^a-zA-Z0-9]*true/i.test(interactionText);
  fs.writeFileSync(out+'/interaction.json',JSON.stringify({simBefore,simAfter,queueBefore,queueAfter,pointerPass,autonomyResume,homeSnap,queueReset,before:interactionBefore.d?.interaction??interactionBefore.d?.presentation??null,immediate:immediate.d?.interaction??immediate.d?.presentation??null,resumed:resumed.d?.interaction??resumed.d?.presentation??null},null,2));
}

await context.close();await browser.close();
const checks={
  runtimeInitialized:true,
  noFatal:fatal.length===0,
  immediateInverseZero:inverseDistance[1]===0,
  noRuntimeResolveDrain:runtimeResolveMoves.length===0,
  noTearing:tearingViolations===0,
  semanticFlashZero:semanticFlashes===0,
  messageBearingMaxOne:maxSimultaneousBearingFaces<=1,
  releasedFaceForcedZero:releasedFaceForcedMoves===0,
  yawPositive,
  yawContinuous,
  motionScaleOne:scaleAllOne,
  pointerPass,
  autonomyResume,
  noHomeSnap:!homeSnap,
  noQueueReset:!queueReset,
};
checks.structuralPass=Object.values(checks).every(Boolean);
const metrics={
  revision:'PROAI CUBE R4.4.3 CLOSED-PHRASE BUILD INTEGRATION RESCUE',
  productSha,
  runtimeSampleDurationSec:sampleMs/1000,
  startPresentationMs:startSim,
  endPresentationMs:end.d?.presentation?.simTimeMs??null,
  totalVisibleMoves:moveLog.length,
  phraseCount:phraseCountDelta||phraseStarts.length,
  axisCounts,layerCounts,inverseDistance,
  samePhraseFamilyAdjacency,
  maxSameAxisStreak,
  centerOccupancy:moveLog.length?center/moveLog.length:0,
  maxCenterStreak,
  runtimeResolveMoves:runtimeResolveMoves.length,
  semantic:{
    realEventObserved:events.length>0,
    firstDiscoverySec,
    firstCandidateDurationMs,
    message:first?.message??null,
    face:first?.face??null,
    readableDurationsSec:readableMs.map(x=>x/1000),
    eventIntervalsSec:intervalsMs.map(x=>x/1000),
    tearingViolations,
    semanticFlashes,
    simultaneousMessageBearingFaces:maxSimultaneousBearingFaces,
    protectionFootprint,
    releasedFaceForcedMoves,
    stageCountDelta:Math.max(0,(closed.stageCount||life.stageCount||0)-(closed0.stageCount||life0.stageCount||0)),
    candidateCount:candidates.length,
  },
  motion:{yawPositive,yawContinuous,scaleBefore:beforeScale,scaleDuring:duringScale,scaleAfter:afterScale,scaleAllOne},
  interaction:{pointerPass,autonomyResume,homeSnap,queueReset},
  checks,fatal,
  closedPhraseDiagnosticsPresent:!!end.s.r443ClosedPhrase,
  sampleMoveLog:moveLog,
  trace,
};
fs.writeFileSync(out+'/metrics.json',JSON.stringify(metrics,null,2));
fs.writeFileSync(out+'/summary.txt',[
  `productSha=${productSha}`,
  `runtimeSampleDurationSec=${sampleMs/1000}`,
  `totalVisibleMoves=${moveLog.length}`,
  `phraseCount=${metrics.phraseCount}`,
  `axisCounts=${JSON.stringify(axisCounts)}`,
  `layerCounts=${JSON.stringify(layerCounts)}`,
  `inverseDistance=${JSON.stringify(inverseDistance)}`,
  `samePhraseFamilyAdjacency=${samePhraseFamilyAdjacency}`,
  `maxSameAxisStreak=${maxSameAxisStreak}`,
  `centerOccupancy=${metrics.centerOccupancy}`,
  `maxCenterStreak=${maxCenterStreak}`,
  `semantic=${JSON.stringify(metrics.semantic)}`,
  `motion=${JSON.stringify(metrics.motion)}`,
  `interaction=${JSON.stringify(metrics.interaction)}`,
  `checks=${JSON.stringify(checks)}`,
  `fatal=${JSON.stringify(fatal)}`,
].join('\n')+'\n');
console.log(fs.readFileSync(out+'/summary.txt','utf8'));
if(!checks.structuralPass)throw new Error('closed phrase runtime structural gate failed: '+JSON.stringify(checks));
