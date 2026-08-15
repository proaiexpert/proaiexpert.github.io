import { chromium } from 'playwright-core';
import fs from 'node:fs';

const url=process.env.QA_URL||'http://127.0.0.1:4173/';
const chrome=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const wallLimitMs=Number(process.env.WALL_LIMIT_MS||150000);
const targetPresentationMs=Number(process.env.TARGET_PRESENTATION_MS||36000);
const out=process.env.QA_OUT||'review-evidence/r443-semantic-forensic';
fs.mkdirSync(out,{recursive:true});
const fatal=[];
const browser=await chromium.launch({headless:true,executablePath:chrome,args:['--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:96,height:96},deviceScaleFactor:1,reducedMotion:'no-preference'});
const page=await context.newPage();
page.on('pageerror',e=>fatal.push('pageerror:'+String(e)));
page.on('console',m=>{if(m.type()==='error')fatal.push('console:'+m.text())});
const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
if(!response||response.status()!==200)throw new Error('navigation '+response?.status());
for(let i=0;i<400;i++){
  const ready=await page.evaluate(()=>window.__PROAI_CUBE_R1_2?.ready===true&&!!window.__R443_FORENSIC__);
  if(ready)break;
  await page.waitForTimeout(100);
  if(i===399)throw new Error('forensic readiness timeout');
}
const initial=await page.evaluate(()=>window.__R443_FORENSIC__.get());
const wallStart=Date.now();
await page.evaluate(()=>{
  window.__R443_FORENSIC_TRACE=[];
  window.__R443_FORENSIC_TIMER=setInterval(()=>{
    const s=window.__R443_FORENSIC__.probe();
    window.__R443_FORENSIC_TRACE.push({
      presentationMs:s.presentationSimTimeMs,
      nextEligiblePresentationMs:s.nextEligiblePresentationMs,
      phase:s.phase,
      stagedFace:s.stagedFace,
      phraseActive:s.closed?.phraseActive===true,
      cycle:s.closed?.cycle||null,
      step:s.closed?.step??null,
      faces:(s.faces||[]).map(f=>({
        face:f.face,exists:f.exists,assembled:f.assembled,faceArmed:f.faceArmed,activeTurnClear:f.activeTurnClear,
        rawQuality:f.rawQuality,viewAlignment:f.viewAlignment,projectedAreaQuality:f.projectedAreaQuality,brdfQuality:f.brdfQuality,
        stageScoreMinPass:f.stageScoreMinPass,stageScoreMaxPass:f.stageScoreMaxPass,stageViewMinPass:f.stageViewMinPass,stageAreaMinPass:f.stageAreaMinPass,stageBrdfMinPass:f.stageBrdfMinPass,
      })),
    });
    if(window.__R443_FORENSIC_TRACE.length>512)window.__R443_FORENSIC_TRACE.shift();
  },200);
});
let firstReadableCaptured=false;
let last=initial;
while(Date.now()-wallStart<wallLimitMs){
  await page.waitForTimeout(1000);
  last=await page.evaluate(()=>window.__R443_FORENSIC__.get());
  if(!firstReadableCaptured&&last.eventLog?.length){
    firstReadableCaptured=true;
    try{
      await page.setViewportSize({width:420,height:420});
      await page.waitForTimeout(120);
      await page.screenshot({path:out+'/first-readable.png'});
      await page.setViewportSize({width:96,height:96});
    }catch(e){fatal.push('screenshot:'+String(e))}
  }
  if(last.presentationSimTimeMs>=targetPresentationMs&&last.eventLog?.length>=1)break;
}
const trace=await page.evaluate(()=>{clearInterval(window.__R443_FORENSIC_TIMER);return window.__R443_FORENSIC_TRACE||[]});
const end=await page.evaluate(()=>window.__R443_FORENSIC__.get());
await context.close();await browser.close();
const wallSec=(Date.now()-wallStart)/1000;
const presentationAdvanceMs=Math.max(0,(end.presentationSimTimeMs||0)-(initial.presentationSimTimeMs||0));
const ratio=wallSec?presentationAdvanceMs/1000/wallSec:0;
const firstStage=end.stageEvents?.find(e=>e.ok)||null;
const candidateEnter=end.candidateEvents?.find(e=>e.kind==='enter')||null;
const firstReadable=end.readableEvents?.[0]||null;
const actualGate=end.actualBestGateCounts||{};
const observationalGate=end.observationalGateCounts||{};
const aggregate=b=>Object.values(b).reduce((a,c)=>{for(const [k,v] of Object.entries(c))a[k]=(a[k]||0)+(Number(v)||0);return a},{});
const actualAgg=aggregate(actualGate),obsAgg=aggregate(observationalGate);
const physical=firstStage?.physical||end.physicalChecks?.[0]||null;
const callPath={
  semanticUpdateLoopCalled:(end.updateCalls||0)>0,
  bestStageFaceCalled:(end.bestStageCalls||0)>0,
  stageCalled:(end.stageCalls||0)>0,
  applyMessageCalled:(end.applyMessageCalls||0)>0,
  setActiveMaterialFaceCalled:(end.setActiveCalls||0)>0,
  candidateEntered:(end.candidateTransitions||0)>0,
  readableEntered:(end.readableTransitions||0)>0,
};
const result={
  productSha:process.env.PRODUCT_SHA||'UNKNOWN',
  wallSec,presentationStartMs:initial.presentationSimTimeMs,presentationEndMs:end.presentationSimTimeMs,presentationAdvanceSec:presentationAdvanceMs/1000,presentationClockRatio:ratio,
  initialNextEligiblePresentationMs:initial.initialNextEligiblePresentationMs,inheritedNextEligiblePresentationMs:initial.inheritedNextEligiblePresentationMs,currentNextEligiblePresentationMs:end.nextEligiblePresentationMs,
  reachedInitialEligibility:(end.presentationSimTimeMs||0)>=(initial.initialNextEligiblePresentationMs||Infinity),eligibleUpdateCalls:end.eligibleUpdateCalls,
  callPath,
  counts:{updateCalls:end.updateCalls,bestStageCalls:end.bestStageCalls,bestStageSelected:end.bestStageSelected,stageCalls:end.stageCalls,stageSuccesses:end.stageSuccesses,applyMessageCalls:end.applyMessageCalls,applyMessageSuccesses:end.applyMessageSuccesses,setActiveCalls:end.setActiveCalls,unstageCalls:end.unstageCalls,lockCalls:end.lockCalls,lockSuccesses:end.lockSuccesses,candidateTransitions:end.candidateTransitions,readableTransitions:end.readableTransitions,releaseTransitions:end.releaseTransitions},
  actualGateCounts:actualGate,actualGateAggregate:actualAgg,observationalGateCounts:observationalGate,observationalGateAggregate:obsAgg,
  macroChecks:end.macroChecks,macroMismatchCount:end.macroMismatches?.length||0,macroMismatches:end.macroMismatches,
  firstStage,firstCandidate:candidateEnter,firstReadable,
  stageEvents:end.stageEvents,unstageEvents:end.unstageEvents,candidateEvents:end.candidateEvents,readableEvents:end.readableEvents,releaseEvents:end.releaseEvents,
  applyEvents:end.applyEvents,activeMaterialEvents:end.activeMaterialEvents,physicalChecks:end.physicalChecks,
  finalState:{phase:end.phase,stagedFace:end.stagedFace,stagedMessageIndex:end.stagedMessageIndex,activeMaterialFace:end.activeMaterialFace,stateActiveMaterialFace:end.stateActiveMaterialFace,nextMessageIndex:end.nextMessageIndex,stageCount:end.stageCount,stageCancelCount:end.stageCancelCount,closed:end.closed},
  physicalFirstStage:physical,
  lifecycleLog:end.lifecycleLog,candidateLog:end.candidateLog,eventLog:end.eventLog,readableDurationsMs:end.readableDurationsMs,nextEligibleHistory:end.nextEligibleHistory,phaseHistory:end.phaseHistory,
  trace,
  fatal,
};
fs.writeFileSync(out+'/forensic.json',JSON.stringify(result,null,2));
const summary=[
  `productSha=${result.productSha}`,
  `wallSec=${wallSec.toFixed(3)}`,
  `presentationStartMs=${result.presentationStartMs}`,
  `presentationEndMs=${result.presentationEndMs}`,
  `presentationAdvanceSec=${result.presentationAdvanceSec.toFixed(3)}`,
  `presentationClockRatio=${ratio.toFixed(4)}`,
  `initialNextEligiblePresentationMs=${result.initialNextEligiblePresentationMs}`,
  `inheritedNextEligiblePresentationMs=${result.inheritedNextEligiblePresentationMs}`,
  `reachedInitialEligibility=${result.reachedInitialEligibility}`,
  `eligibleUpdateCalls=${result.eligibleUpdateCalls}`,
  `traceSamples=${trace.length}`,
  `callPath=${JSON.stringify(callPath)}`,
  `counts=${JSON.stringify(result.counts)}`,
  `actualGateAggregate=${JSON.stringify(actualAgg)}`,
  `observationalGateAggregate=${JSON.stringify(obsAgg)}`,
  `macroMismatchCount=${result.macroMismatchCount}`,
  `firstStage=${JSON.stringify(firstStage)}`,
  `firstCandidate=${JSON.stringify(candidateEnter)}`,
  `firstReadable=${JSON.stringify(firstReadable)}`,
  `unstageEvents=${JSON.stringify(end.unstageEvents||[])}`,
  `physicalFirstStage=${JSON.stringify(physical)}`,
  `finalState=${JSON.stringify(result.finalState)}`,
  `fatal=${JSON.stringify(fatal)}`,
].join('\n')+'\n';
fs.writeFileSync(out+'/summary.txt',summary);
console.log(summary);
if(fatal.some(x=>x.startsWith('pageerror:')))process.exitCode=2;
