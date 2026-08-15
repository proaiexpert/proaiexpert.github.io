import { chromium } from 'playwright';
import fs from 'node:fs';

const url=process.env.QA_URL||'http://127.0.0.1:4173/';
const out='review-evidence/r443-deterministic';
fs.mkdirSync(out,{recursive:true});
const fatal=[];
const median=a=>{if(!a.length)return null;const s=[...a].sort((x,y)=>x-y),m=Math.floor(s.length/2);return s.length%2?s[m]:(s[m-1]+s[m])/2};
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
const ctx=await browser.newContext({viewport:{width:360,height:360},deviceScaleFactor:1,reducedMotion:'no-preference'});
const page=await ctx.newPage();
page.on('pageerror',e=>fatal.push('pageerror:'+String(e)));
page.on('console',m=>{if(m.type()==='error')fatal.push('console:'+m.text())});
await page.clock.install({time:new Date('2026-08-15T00:00:00Z')});
await page.addInitScript(()=>{window.requestAnimationFrame=cb=>setTimeout(()=>cb(performance.now()),80);window.cancelAnimationFrame=id=>clearTimeout(id)});
const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
if(!response||response.status()!==200)throw new Error('navigation '+response?.status());
for(let i=0;i<200;i++){
  const ready=await page.evaluate(()=>window.__PROAI_CUBE_R1_2?.ready===true);
  if(ready)break;
  await page.clock.runFor(80);
  if(i===199)throw new Error('cube readiness timeout under deterministic clock');
}
const start=await page.evaluate(()=>({s:window.__PROAI_CUBE_R1_2.getSemanticDiagnostics(),d:window.__PROAI_CUBE_R1_2.getDiagnostics()}));
const startSim=start.d.presentation.simTimeMs;
await page.evaluate(()=>{window.__R443_DET_TRACE=[];window.__R443_DET_TIMER=setInterval(()=>{const s=window.__PROAI_CUBE_R1_2.getSemanticDiagnostics(),d=window.__PROAI_CUBE_R1_2.getDiagnostics(),m=s.r443Motion||{},r=s.r443Lifecycle||{};window.__R443_DET_TRACE.push({presentationMs:d.presentation.simTimeMs,yawVelocityDegPerSec:m.yawVelocityDegPerSec,cumulativeYawDeg:m.cumulativeYawDeg,timeScale:s.timeScale??1,phase:r.phase,protected:s.r442DynamicFace?.protected===true,protectedFace:s.r442DynamicFace?.protectedFace||null})},1000)});
await page.clock.runFor(60000);
const end=await page.evaluate(()=>{clearInterval(window.__R443_DET_TIMER);return{s:window.__PROAI_CUBE_R1_2.getSemanticDiagnostics(),d:window.__PROAI_CUBE_R1_2.getDiagnostics(),trace:window.__R443_DET_TRACE||[]}});
await ctx.close();await browser.close();
const life=end.s.r443Lifecycle||{},dyn=end.s.r442DynamicFace||{},moves=end.s.r442MoveDiversity||{};
const axisCounts=Object.fromEntries(['X','Y','Z'].map(k=>[k,(moves.axisCounts?.[k]||0)-(start.s.r442MoveDiversity?.axisCounts?.[k]||0)]));
const layerCounts=Object.fromEntries(['-1','0','1'].map(k=>[k,(moves.layerCounts?.[k]||0)-(start.s.r442MoveDiversity?.layerCounts?.[k]||0)]));
const events=(life.eventLog||[]).filter(x=>x.startMs>=startSim).map(x=>({...x,timestampSec:+((x.startMs-startSim)/1000).toFixed(3)}));
const lifecycle=(life.lifecycleLog||[]).filter(x=>x.presentationMs>=startSim).map(x=>({...x,timestampSec:+((x.presentationMs-startSim)/1000).toFixed(3)}));
const forwardSlices=(moves.moveLog||[]).filter(x=>x.phase==='forward'&&x.presentationMs>=startSim).map(x=>({...x,timestampSec:+((x.presentationMs-startSim)/1000).toFixed(3)}));
const latencies=(life.dispersalLatenciesMs||[]).map(x=>x/1000),intervals=(life.opportunityIntervalsMs||[]).map(x=>x/1000),readable=(life.readableDurationsMs||[]).map(x=>x/1000),faces=[...new Set(events.map(x=>x.face))];
const releases=lifecycle.filter(x=>x.type==='release'),dispersals=lifecycle.filter(x=>x.type==='dispersal-slice');
const seq=['ProAI Expert','TRUST','INQUIRY','RESPONSE','RESULT'];
const totalMoves=Object.values(axisCounts).reduce((a,b)=>a+b,0),maxAxisShare=totalMoves?Math.max(...Object.values(axisCounts))/totalMoves:1,targetHits=latencies.filter(x=>x>=.35&&x<=1.25).length;
const simElapsed=(end.d.presentation.simTimeMs-startSim)/1000;
const trace=end.trace;
const checks={
  sim60:simElapsed>=59.5,
  sequencePass:events.length>=5&&events.every((e,i)=>e.message===seq[i%seq.length]),
  yawPositive:trace.length>=50&&trace.every(x=>Number.isFinite(x.yawVelocityDegPerSec)&&x.yawVelocityDegPerSec>0),
  yawContinuous:trace.every((x,i)=>i===0||x.cumulativeYawDeg>=trace[i-1].cumulativeYawDeg-1e-6),
  motionIndependent:trace.length>=50&&trace.every(x=>Math.abs(x.timeScale-1)<1e-9)&&end.s.r443Motion?.semanticVelocityMultiplier===1,
  noTearing:(dyn.unsafeProtectedStarts||0)===0&&(dyn.assemblyViolations||0)===0,
  noFlash:(life.shortReadableCount||0)===0&&readable.every(x=>x>=.6),
  dispersalPass:latencies.length>=Math.max(1,releases.length-1)&&latencies.every(x=>x>=.20&&x<=2.0)&&targetHits/Math.max(1,latencies.length)>=.60,
  cadencePass:intervals.length>=3&&Math.min(...intervals)>=4.0&&Math.max(...intervals)<=15.0,
  firstDiscoveryPass:events.length>0&&events[0].timestampSec>=3.0&&events[0].timestampSec<=6.0,
  diversityPass:['X','Y','Z'].every(k=>axisCounts[k]>0)&&['-1','0','1'].every(k=>layerCounts[k]>0)&&maxAxisShare<=.62,
  facePass:faces.length>=2,
};
checks.pass=Object.values(checks).every(Boolean)&&fatal.length===0;
const metrics={revision:'PROAI CUBE R4.4.3 — DETERMINISTIC 60S QA',productSha:'b5fdd9b53389c734ea85051fbd9fa16cd547e11b',simElapsedSec:simElapsed,axisCounts,layerCounts,maxAxisShare,semanticFacesSelected:faces,events,releases,dispersals,readableDurationsSec:readable,opportunityIntervalsSec:intervals,dispersalLatenciesSec:latencies,dispersalLatencySummarySec:{min:latencies.length?Math.min(...latencies):null,median:median(latencies),max:latencies.length?Math.max(...latencies):null},forwardSlices,orientationTrace:trace,checks,fatal};
fs.writeFileSync(out+'/metrics.json',JSON.stringify(metrics,null,2));
fs.writeFileSync(out+'/summary.txt',['simElapsedSec='+simElapsed,'axisCounts='+JSON.stringify(axisCounts),'layerCounts='+JSON.stringify(layerCounts),'faces='+JSON.stringify(faces),'events='+JSON.stringify(events.map(x=>({t:x.timestampSec,face:x.face,message:x.message}))), 'readableDurationsSec='+JSON.stringify(readable),'opportunityIntervalsSec='+JSON.stringify(intervals),'dispersalLatenciesSec='+JSON.stringify(latencies),'checks='+JSON.stringify(checks),'fatal='+JSON.stringify(fatal)].join('\n')+'\n');
if(!checks.pass)throw new Error('R4.4.3 deterministic QA failed: '+JSON.stringify(checks));
