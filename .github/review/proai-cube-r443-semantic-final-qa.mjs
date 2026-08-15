import { chromium } from 'playwright-core';
import fs from 'node:fs';

const url=process.env.QA_URL||'http://127.0.0.1:4173/';
const chrome=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const out=process.env.QA_OUT||'review-evidence/r443-semantic-final';
const targetPresentationMs=Number(process.env.TARGET_PRESENTATION_MS||90000);
const maxWallMs=Number(process.env.MAX_WALL_MS||95000);
fs.mkdirSync(out,{recursive:true});
const fatal=[];
const browser=await chromium.launch({headless:true,executablePath:chrome,args:['--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:420,height:420},deviceScaleFactor:1,reducedMotion:'no-preference'});
const page=await context.newPage();
page.on('pageerror',e=>fatal.push('pageerror:'+String(e)));
page.on('console',m=>{if(m.type()==='error'&&!/404/.test(m.text()))fatal.push('console:'+m.text())});
const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
if(!response||response.status()!==200)throw new Error('navigation '+response?.status());
for(let i=0;i<400;i++){
  if(await page.evaluate(()=>window.__PROAI_CUBE_R1_2?.ready===true&&!!window.__R443_FINAL_ACCEPTANCE__))break;
  await page.waitForTimeout(100);
  if(i===399)throw new Error('final acceptance readiness timeout');
}
const get=()=>page.evaluate(()=>window.__R443_FINAL_ACCEPTANCE__.get());
const start=await get();
const wallStart=Date.now();
const trace=[];
let readableScreenshot=false;
let firstReadableObservedAt=null;
let releaseAfterFirst=false;
while(Date.now()-wallStart<maxWallMs){
  await page.waitForTimeout(100);
  const x=await get();
  const f=x.forensic,sem=x.semanticDiagnostics||{},i=x.internal||{};
  const life=sem.r443Lifecycle||{},dyn=sem.r442DynamicFace||{},motion=sem.r443Motion||{},closed=sem.r443ClosedPhrase||{};
  const bearing=[f.stagedFace,i.activeMaterialFace,i.stateActiveMaterialFace,dyn.protectedFace,closed.messageBearingFace].filter(Boolean);
  trace.push({
    presentationMs:i.presentationSimTimeMs,
    phase:f.phase,stagedFace:f.stagedFace,candidateFace:f.candidateFace,protected:i.protected,protectedFace:i.protectedFace,
    activeMaterialFace:i.activeMaterialFace,messageBearingFaces:[...new Set(bearing)],
    timeScale:i.timeScale,semanticVelocityMultiplier:motion.semanticVelocityMultiplier??1,
    yawVelocityDegPerSec:motion.yawVelocityDegPerSec??null,cumulativeYawDeg:motion.cumulativeYawDeg??null,
    eventCount:i.eventLog?.length||0,releaseCount:i.releaseCount||0,
  });
  if(trace.length>1500)trace.shift();
  if(!readableScreenshot&&(i.eventLog?.length||0)>0&&f.phase==='READABLE'){
    firstReadableObservedAt=i.presentationSimTimeMs;
    await page.evaluate(()=>window.__R443_FINAL_ACCEPTANCE__.renderOnce());
    await page.screenshot({path:out+'/first-readable-real-render.png'});
    readableScreenshot=true;
  }
  if(readableScreenshot&&(i.releaseCount||0)>(start.internal?.releaseCount||0))releaseAfterFirst=true;
  if(i.presentationSimTimeMs>=targetPresentationMs&&readableScreenshot&&releaseAfterFirst)break;
}
const end=await get();

// Real pointer sequence against actual canvas after semantic sample. No semantic internals are invoked.
const canvas=page.locator('canvas').first();
const box=await canvas.boundingBox();
let pointerPass=false,autonomyResume=false,homeSnap=false,queueReset=false;
const beforeInteraction=await get();
if(box){
  const x=box.x+box.width*.52,y=box.y+box.height*.50;
  const simBefore=beforeInteraction.internal.presentationSimTimeMs;
  const queueBefore=beforeInteraction.internal.nextMessageIndex;
  await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+70,y-38,{steps:10});await page.mouse.up();pointerPass=true;
  await page.waitForTimeout(1600);
  const afterInteraction=await get();
  autonomyResume=afterInteraction.internal.presentationSimTimeMs>simBefore+900;
  queueReset=queueBefore!==0&&afterInteraction.internal.nextMessageIndex===0;
  const interactionText=JSON.stringify({before:beforeInteraction.diagnostics?.interaction??beforeInteraction.diagnostics?.presentation??null,after:afterInteraction.diagnostics?.interaction??afterInteraction.diagnostics?.presentation??null});
  homeSnap=/homeSnap[^a-zA-Z0-9]*true/i.test(interactionText);
  fs.writeFileSync(out+'/interaction.json',JSON.stringify({simBefore,simAfter:afterInteraction.internal.presentationSimTimeMs,queueBefore,queueAfter:afterInteraction.internal.nextMessageIndex,pointerPass,autonomyResume,homeSnap,queueReset},null,2));
}
await context.close();await browser.close();

const wallSec=(Date.now()-wallStart)/1000;
const presentationStartMs=start.internal.presentationSimTimeMs,presentationEndMs=end.internal.presentationSimTimeMs;
const presentationAdvanceSec=(presentationEndMs-presentationStartMs)/1000;
const presentationClockRatio=presentationAdvanceSec/wallSec;
const stages=(end.forensic.stageEvents||[]).filter(e=>e.ok);
const candidates=(end.forensic.candidateEvents||[]).filter(e=>e.kind==='enter');
const readables=end.forensic.readableEvents||[];
const releases=end.forensic.releaseEvents||[];
const events=end.internal.eventLog||[];
const readableDurationsMs=end.internal.readableDurationsMs||[];
const intervalsMs=end.internal.opportunityIntervalsMs||[];
const firstStage=stages[0]||null,firstCandidate=candidates[0]||null,firstReadable=readables[0]||null;
const physical=firstStage?.physical||end.forensic.physicalChecks?.[0]||null;
const stageBeforeCandidate=!!firstStage&&!!firstCandidate&&firstStage.presentationMs<firstCandidate.presentationMs;
const candidateBeforeReadable=!!firstCandidate&&!!firstReadable&&firstCandidate.presentationMs<firstReadable.presentationMs;
const physicalBeforeCandidate=stageBeforeCandidate&&!!physical?.registry&&physical.tileCount===9&&physical.uniqueCubieCount===9&&physical.active&&physical.messageIndexStored&&physical.bumpAssigned&&physical.roughAssigned&&physical.toneAssigned&&physical.allActive;
const assemblyDelta=Math.max(0,(end.internal.assemblyViolations||0)-(start.internal.assemblyViolations||0));
const unsafeDelta=Math.max(0,(end.internal.unsafeProtectedStarts||0)-(start.internal.unsafeProtectedStarts||0));
const tearingViolations=assemblyDelta+unsafeDelta;
const flashDelta=Math.max(0,(end.internal.semanticFlashCount||0)-(start.internal.semanticFlashCount||0));
const forcedDelta=Math.max(0,(end.internal.releasedFaceForcedMoves||0)-(start.internal.releasedFaceForcedMoves||0));
const maxBearing=Math.max(0,...trace.map(t=>t.messageBearingFaces.length));
const yawSamples=trace.map(t=>t.yawVelocityDegPerSec).filter(Number.isFinite);
const yawPositive=yawSamples.length>0&&yawSamples.every(v=>v>0);
const yawContinuous=trace.every((t,idx)=>idx===0||!Number.isFinite(t.cumulativeYawDeg)||!Number.isFinite(trace[idx-1].cumulativeYawDeg)||t.cumulativeYawDeg>=trace[idx-1].cumulativeYawDeg-1e-6);
const scaleSamples=trace.map(t=>t.timeScale).filter(Number.isFinite);
const scaleAllOne=scaleSamples.length>0&&scaleSamples.every(v=>Math.abs(v-1)<1e-9)&&trace.every(t=>Math.abs((t.semanticVelocityMultiplier??1)-1)<1e-9);
const protectedIdx=trace.map((t,idx)=>t.protected?idx:-1).filter(idx=>idx>=0);
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:1;
let scaleBefore=1,scaleDuring=1,scaleAfter=1;
if(protectedIdx.length){const a=protectedIdx[0],b=protectedIdx.at(-1);scaleBefore=avg(trace.slice(0,a).map(t=>t.timeScale));scaleDuring=avg(trace.slice(a,b+1).filter(t=>t.protected).map(t=>t.timeScale));scaleAfter=avg(trace.slice(b+1).map(t=>t.timeScale))}
const moveLog=(end.semanticDiagnostics?.r442MoveDiversity?.moveLog||[]).filter(m=>(m.presentationMs??-Infinity)>=presentationStartMs&&['closed-phrase','semantic-safe'].includes(m.phase));
const exactInverse=(a,b)=>!!a&&!!b&&a.axis===b.axis&&a.layer===b.layer&&a.direction===-b.direction;
let immediateInverse=0;for(let j=1;j<moveLog.length;j++)if(exactInverse(moveLog[j-1],moveLog[j]))immediateInverse++;
const runtimeResolve=(end.semanticDiagnostics?.r442MoveDiversity?.moveLog||[]).filter(m=>(m.presentationMs??-Infinity)>=presentationStartMs&&m.phase==='resolve').length;
const closedDiag=end.semanticDiagnostics?.r443ClosedPhrase||{};
const protectionFootprint=closedDiag.metrics?.protectionFootprint??end.internal.protectionAlterations??null;
const firstMessage=events[0]?.message??firstReadable?.message??null;
const secondMessage=events[1]?.message??null;
const checks={
  eventObserved:events.length>=1,
  firstMessageCorrect:firstMessage==='ProAI Expert',
  physicalBeforeCandidate,
  stageBeforeCandidate,
  candidateBeforeReadable,
  zeroTearing:tearingViolations===0,
  zeroFlash:flashDelta===0,
  maxOneBearing:maxBearing<=1,
  zeroReleasedForced:forcedDelta===0,
  yawPositive,yawContinuous,scaleAllOne,
  immediateInverseZero:immediateInverse===0,
  runtimeResolveZero:runtimeResolve===0,
  pointerPass,autonomyResume,noHomeSnap:!homeSnap,noQueueReset:!queueReset,
  realRenderCaptured:readableScreenshot,
  noFatal:fatal.length===0,
};
checks.pass=Object.values(checks).every(Boolean);
const result={
  productSha:process.env.PRODUCT_SHA||'UNKNOWN',wallSec,presentationStartMs,presentationEndMs,presentationAdvanceSec,presentationClockRatio,
  stagedEvents:stages.length,candidateEvents:candidates.length,readableEvents:events.length,releaseEvents:releases.length,
  firstStageTimeMs:firstStage?.presentationMs??null,firstCandidateTimeMs:firstCandidate?.presentationMs??null,firstReadableTimeMs:firstReadable?.presentationMs??events[0]?.startMs??null,
  firstMessage,firstFace:events[0]?.face??firstReadable?.face??null,secondMessage,eventIntervalsSec:intervalsMs.map(x=>x/1000),readableDurationsSec:readableDurationsMs.map(x=>x/1000),
  maximumSimultaneousMessageBearingFaces:maxBearing,tearingViolations,semanticFlashes:flashDelta,protectionFootprint,releasedFaceForcedMoves:forcedDelta,
  physical:{physicalBeforeCandidate,stageBeforeCandidate,candidateBeforeReadable,firstStagePhysical:physical,realRenderCaptured:readableScreenshot,firstReadableObservedAt},
  motion:{yawPositive,yawContinuous,scaleBefore,scaleDuring,scaleAfter,scaleAllOne,immediateInverse,runtimeResolve},
  interaction:{pointerPass,autonomyResume,homeSnap,queueReset},
  counts:end.forensic?{bestStageCalls:end.forensic.bestStageCalls,stageCalls:end.forensic.stageCalls,stageSuccesses:end.forensic.stageSuccesses,applyMessageCalls:end.forensic.applyMessageCalls,applyMessageSuccesses:end.forensic.applyMessageSuccesses,setActiveCalls:end.forensic.setActiveCalls,unstageCalls:end.forensic.unstageCalls,stageCancelCount:end.forensic.stageCancelCount}:null,
  fatal,checks,events,stages,candidates,readables,releases,trace
};
fs.writeFileSync(out+'/final-metrics.json',JSON.stringify(result,null,2));
const summary=[
  `productSha=${result.productSha}`,
  `wallSec=${wallSec.toFixed(3)}`,
  `presentationAdvanceSec=${presentationAdvanceSec.toFixed(3)}`,
  `presentationClockRatio=${presentationClockRatio.toFixed(4)}`,
  `stagedEvents=${result.stagedEvents}`,
  `candidateEvents=${result.candidateEvents}`,
  `readableEvents=${result.readableEvents}`,
  `firstStageTimeMs=${result.firstStageTimeMs}`,
  `firstCandidateTimeMs=${result.firstCandidateTimeMs}`,
  `firstReadableTimeMs=${result.firstReadableTimeMs}`,
  `firstMessage=${firstMessage}`,
  `firstFace=${result.firstFace}`,
  `secondMessage=${secondMessage}`,
  `readableDurationsSec=${JSON.stringify(result.readableDurationsSec)}`,
  `eventIntervalsSec=${JSON.stringify(result.eventIntervalsSec)}`,
  `maximumSimultaneousMessageBearingFaces=${maxBearing}`,
  `tearingViolations=${tearingViolations}`,
  `semanticFlashes=${flashDelta}`,
  `protectionFootprint=${protectionFootprint}`,
  `releasedFaceForcedMoves=${forcedDelta}`,
  `physical=${JSON.stringify(result.physical)}`,
  `motion=${JSON.stringify(result.motion)}`,
  `interaction=${JSON.stringify(result.interaction)}`,
  `counts=${JSON.stringify(result.counts)}`,
  `checks=${JSON.stringify(checks)}`,
  `fatal=${JSON.stringify(fatal)}`,
].join('\n')+'\n';
fs.writeFileSync(out+'/summary.txt',summary);console.log(summary);
if(!checks.pass)throw new Error('final semantic acceptance failed: '+JSON.stringify(checks));
