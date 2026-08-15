import { chromium } from 'playwright';
import fs from 'node:fs';

const url=process.env.QA_URL||'http://127.0.0.1:4173/';
const out='review-evidence/r443-closed-phrase';
fs.mkdirSync(out,{recursive:true});
const fatal=[];
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
const ctx=await browser.newContext({viewport:{width:420,height:420},deviceScaleFactor:1,reducedMotion:'no-preference'});
const page=await ctx.newPage();
page.on('pageerror',e=>fatal.push('pageerror:'+String(e)));
page.on('console',m=>{if(m.type()==='error')fatal.push('console:'+m.text())});
await page.clock.install({time:new Date('2026-08-15T00:00:00Z')});
await page.addInitScript(()=>{window.requestAnimationFrame=cb=>setTimeout(()=>cb(performance.now()),80);window.cancelAnimationFrame=id=>clearTimeout(id)});
const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
if(!response||response.status()!==200)throw new Error('navigation '+response?.status());
for(let i=0;i<220;i++){
  const ready=await page.evaluate(()=>window.__PROAI_CUBE_R1_2?.ready===true);
  if(ready)break;
  await page.clock.runFor(80);
  if(i===219)throw new Error('cube readiness timeout');
}
const start=await page.evaluate(()=>({s:window.__PROAI_CUBE_R1_2.getSemanticDiagnostics(),d:window.__PROAI_CUBE_R1_2.getDiagnostics()}));
const startSim=start.d.presentation.simTimeMs;
await page.evaluate(()=>{window.__R443_CLOSED_TRACE=[];window.__R443_CLOSED_TIMER=setInterval(()=>{const s=window.__PROAI_CUBE_R1_2.getSemanticDiagnostics(),d=window.__PROAI_CUBE_R1_2.getDiagnostics(),m=s.r443Motion||{},l=s.r443Lifecycle||{},c=s.r443ClosedPhrase||{};window.__R443_CLOSED_TRACE.push({presentationMs:d.presentation.simTimeMs,yawVelocityDegPerSec:m.yawVelocityDegPerSec,cumulativeYawDeg:m.cumulativeYawDeg,timeScale:s.timeScale??1,phase:l.phase,messageBearingFace:c.messageBearingFace||null})},800)});
await page.clock.runFor(60000);
const end=await page.evaluate(()=>{clearInterval(window.__R443_CLOSED_TIMER);return{s:window.__PROAI_CUBE_R1_2.getSemanticDiagnostics(),d:window.__PROAI_CUBE_R1_2.getDiagnostics(),trace:window.__R443_CLOSED_TRACE||[]}});
await ctx.close();await browser.close();

const life=end.s.r443Lifecycle||{},closed=end.s.r443ClosedPhrase||{},cm=closed.metrics||{},dyn=end.s.r442DynamicFace||{},moves=end.s.r442MoveDiversity||{};
const axisCounts=Object.fromEntries(['X','Y','Z'].map(k=>[k,(moves.axisCounts?.[k]||0)-(start.s.r442MoveDiversity?.axisCounts?.[k]||0)]));
const layerCounts=Object.fromEntries(['-1','0','1'].map(k=>[k,(moves.layerCounts?.[k]||0)-(start.s.r442MoveDiversity?.layerCounts?.[k]||0)]));
const events=(life.eventLog||[]).filter(x=>x.startMs>=startSim).map(x=>({...x,timestampSec:+((x.startMs-startSim)/1000).toFixed(3)}));
const lifecycle=(life.lifecycleLog||[]).filter(x=>x.presentationMs>=startSim).map(x=>({...x,timestampSec:+((x.presentationMs-startSim)/1000).toFixed(3)}));
const readable=(life.readableDurationsMs||[]).map(x=>x/1000),intervals=(life.opportunityIntervalsMs||[]).map(x=>x/1000);
const validation=cm.validation||{};
const startUnsafe=start.s.r442DynamicFace?.unsafeProtectedStarts||0;
const unsafeDelta=(dyn.unsafeProtectedStarts||0)-startUnsafe;
const startAssembly=start.s.r442DynamicFace?.assemblyViolations||0;
const assemblyDelta=(dyn.assemblyViolations||0)-startAssembly;
const immediateInverse=cm.inverseDistance?.['1']??cm.inverseDistance?.[1]??null;
const stagedBeforeReadable=events.length>0&&events.every(e=>Number.isFinite(e.stagedMs)&&e.stagedMs<e.startMs);
const trace=end.trace||[];
const checks={
  architecture:closed.architecture==='CURATED_CLOSED_PHRASE'&&closed.lifoInverseStack===false&&closed.pendingResolutionGate===false&&closed.bridgeBeforeInverse===false&&closed.semanticDispersalWeighting===false&&closed.axisLayerDebt===false,
  library:validation.coreArchetypeCount===12&&validation.generatedValidatedPhraseVariants===30&&validation.macroStateCount===10&&validation.phraseHistoryDepth===3,
  immediateInverseZero:immediateInverse===0,
  axesRepresented:['X','Y','Z'].every(k=>axisCounts[k]>0),
  layersRepresented:['-1','0','1'].every(k=>layerCounts[k]>0),
  semanticEvent:events.length>=1,
  stagedBeforeReadable,
  noTearing:unsafeDelta===0&&assemblyDelta===0,
  noFlash:(closed.semanticFlashCount||0)===0,
  releasedFaceForcedMoves:(cm.releasedFaceForcedMoves||0)===0,
  yawPositive:trace.length>=40&&trace.every(x=>Number.isFinite(x.yawVelocityDegPerSec)&&x.yawVelocityDegPerSec>0),
  yawContinuous:trace.every((x,i)=>i===0||x.cumulativeYawDeg>=trace[i-1].cumulativeYawDeg-1e-6),
  motionIndependent:trace.length>=40&&trace.every(x=>Math.abs(x.timeScale-1)<1e-9)&&end.s.r443Motion?.semanticVelocityMultiplier===1,
  noFatal:fatal.length===0,
};
checks.pass=Object.values(checks).every(Boolean);
const metrics={revision:'PROAI CUBE R4.4.3 — CLOSED-PHRASE BOUNDED QA',productSha:process.env.PRODUCT_SHA||null,simElapsedSec:(end.d.presentation.simTimeMs-startSim)/1000,axisCounts,layerCounts,totalVisibleMoves:cm.totalVisibleMoves??null,phraseCount:cm.phraseCount??null,inverseDistance:cm.inverseDistance??null,samePhraseFamilyAdjacency:cm.samePhraseFamilyAdjacency??null,recentHighSimilarityPhrases:cm.recentHighSimilarityPhrases??null,maxSameAxisStreak:cm.maxSameAxisStreak??null,centerOccupancy:cm.centerOccupancy??null,maxCenterStreak:cm.maxCenterStreak??null,protectionFootprint:cm.protectionFootprint??null,releasedFaceForcedMoves:cm.releasedFaceForcedMoves??null,validation,events,readableDurationsSec:readable,eventIntervalsSec:intervals,unsafeProtectedStartsDelta:unsafeDelta,assemblyViolationsDelta:assemblyDelta,semanticFlashCount:closed.semanticFlashCount??null,lifecycle,checks,fatal};
fs.writeFileSync(out+'/metrics.json',JSON.stringify(metrics,null,2));
fs.writeFileSync(out+'/summary.txt',['productSha='+metrics.productSha,'axisCounts='+JSON.stringify(axisCounts),'layerCounts='+JSON.stringify(layerCounts),'totalVisibleMoves='+metrics.totalVisibleMoves,'phraseCount='+metrics.phraseCount,'inverseDistance='+JSON.stringify(metrics.inverseDistance),'samePhraseFamilyAdjacency='+metrics.samePhraseFamilyAdjacency,'recentHighSimilarityPhrases='+metrics.recentHighSimilarityPhrases,'maxSameAxisStreak='+metrics.maxSameAxisStreak,'centerOccupancy='+metrics.centerOccupancy,'maxCenterStreak='+metrics.maxCenterStreak,'protectionFootprint='+metrics.protectionFootprint,'events='+JSON.stringify(events.map(e=>({t:e.timestampSec,face:e.face,message:e.message,stagedMs:e.stagedMs,startMs:e.startMs}))), 'readableDurationsSec='+JSON.stringify(readable),'eventIntervalsSec='+JSON.stringify(intervals),'checks='+JSON.stringify(checks),'fatal='+JSON.stringify(fatal)].join('\n')+'\n');
console.log(JSON.stringify(metrics,null,2));
if(!checks.pass)throw new Error('closed phrase bounded QA failed: '+JSON.stringify(checks));
