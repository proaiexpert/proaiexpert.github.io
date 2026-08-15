import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const url=process.env.REVIEW_URL;
if(!url) throw new Error('REVIEW_URL missing');
const out=path.resolve('review-evidence/r443');
fs.mkdirSync(out,{recursive:true});
const fatal=[];
const median=a=>{if(!a.length)return null;const s=[...a].sort((x,y)=>x-y),m=Math.floor(s.length/2);return s.length%2?s[m]:(s[m-1]+s[m])/2};
const delta=(a,b,keys)=>Object.fromEntries(keys.map(k=>[k,(b?.[k]||0)-(a?.[k]||0)]));
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
const ready=async page=>{page.on('pageerror',e=>fatal.push('pageerror:'+String(e)));page.on('console',m=>{if(m.type()==='error')fatal.push('console:'+m.text())});const r=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});if(!r||r.status()!==200)throw new Error('navigation status '+r?.status());await page.waitForFunction(()=>window.__PROAI_CUBE_R1_2?.ready===true,null,{timeout:60000})};
const read=page=>page.evaluate(()=>({s:window.__PROAI_CUBE_R1_2.getSemanticDiagnostics(),d:window.__PROAI_CUBE_R1_2.getDiagnostics(),interaction:window.__PROAI_CUBE_R1_2.getInteractionState()}));
const copyVideo=async(video,name)=>{const p=await video.path();const dest=path.join(out,name);fs.copyFileSync(p,dest);return dest};

let observationMetrics=null;
let desktopVideoPath=null;
{
  const ctx=await browser.newContext({viewport:{width:1280,height:720},deviceScaleFactor:1,reducedMotion:'no-preference',recordVideo:{dir:out,size:{width:1280,height:720}}});
  const page=await ctx.newPage();await ready(page);const video=page.video();
  const start=await read(page),startSim=start.d.presentation.simTimeMs;
  await page.evaluate(()=>{const t0=performance.now();window.__R443_QA_TRACE=[];window.__R443_QA_TIMER=setInterval(()=>{try{const s=window.__PROAI_CUBE_R1_2.getSemanticDiagnostics(),d=window.__PROAI_CUBE_R1_2.getDiagnostics(),r=s.r443Lifecycle||{},m=s.r443Motion||{};window.__R443_QA_TRACE.push({wallSec:(performance.now()-t0)/1000,presentationMs:d.presentation.simTimeMs,phase:r.phase,yawVelocityDegPerSec:m.yawVelocityDegPerSec,signedYawDeg:m.signedYawDeg,cumulativeYawDeg:m.cumulativeYawDeg,timeScale:s.timeScale??1,protected:s.r442DynamicFace?.protected===true,protectedFace:s.r442DynamicFace?.protectedFace||null})}catch{}},1000)});
  await page.waitForTimeout(60000);
  const end=await page.evaluate(()=>{clearInterval(window.__R443_QA_TIMER);return{s:window.__PROAI_CUBE_R1_2.getSemanticDiagnostics(),d:window.__PROAI_CUBE_R1_2.getDiagnostics(),interaction:window.__PROAI_CUBE_R1_2.getInteractionState(),trace:window.__R443_QA_TRACE||[]}});
  const trace=end.trace,life=end.s.r443Lifecycle||{},dyn=end.s.r442DynamicFace||{},moves=end.s.r442MoveDiversity||{};
  const axisCounts=delta(start.s.r442MoveDiversity?.axisCounts,moves.axisCounts,['X','Y','Z']);
  const layerCounts=delta(start.s.r442MoveDiversity?.layerCounts,moves.layerCounts,['-1','0','1']);
  const forwardSlices=(moves.moveLog||[]).filter(x=>x.phase==='forward'&&x.presentationMs>=startSim).map(x=>({timestampSec:+((x.presentationMs-startSim)/1000).toFixed(3),axis:x.axis,layer:x.layer,direction:x.direction,r443Phase:x.r443Phase}));
  const candidates=(life.candidateLog||[]).filter(x=>x.presentationMs>=startSim).map(x=>({...x,timestampSec:+((x.presentationMs-startSim)/1000).toFixed(3)}));
  const events=(life.eventLog||[]).filter(x=>x.startMs>=startSim).map(x=>({...x,timestampSec:+((x.startMs-startSim)/1000).toFixed(3)}));
  const lifecycle=(life.lifecycleLog||[]).filter(x=>x.presentationMs>=startSim).map(x=>({...x,timestampSec:+((x.presentationMs-startSim)/1000).toFixed(3)}));
  const releases=lifecycle.filter(x=>x.type==='release'),dispersals=lifecycle.filter(x=>x.type==='dispersal-slice');
  const latencies=(life.dispersalLatenciesMs||[]).map(x=>x/1000),intervals=(life.opportunityIntervalsMs||[]).map(x=>x/1000),readable=(life.readableDurationsMs||[]).map(x=>x/1000),faces=[...new Set(events.map(x=>x.face))];
  const seq=['ProAI Expert','TRUST','INQUIRY','RESPONSE','RESULT'];
  const totalMoves=Object.values(axisCounts).reduce((a,b)=>a+b,0),maxAxisShare=totalMoves?Math.max(...Object.values(axisCounts))/totalMoves:1,targetHits=latencies.filter(x=>x>=.35&&x<=1.25).length;
  const checks={
    sequencePass:events.length>=5&&events.every((e,i)=>e.message===seq[i%seq.length]),
    yawPositive:trace.length>=40&&trace.every(x=>Number.isFinite(x.yawVelocityDegPerSec)&&x.yawVelocityDegPerSec>0),
    yawContinuous:trace.every((x,i)=>i===0||x.cumulativeYawDeg>=trace[i-1].cumulativeYawDeg-1e-5),
    motionIndependent:trace.length>=40&&trace.every(x=>Math.abs(x.timeScale-1)<1e-9)&&end.s.r443Motion?.semanticVelocityMultiplier===1,
    noTearing:(dyn.unsafeProtectedStarts||0)===0&&(dyn.assemblyViolations||0)===0,
    noFlash:(life.shortReadableCount||0)===0&&readable.every(x=>x>=.6),
    dispersalPass:latencies.length>=Math.max(1,releases.length-1)&&latencies.every(x=>x>=.20&&x<=2.0)&&targetHits/Math.max(1,latencies.length)>=.60,
    cadencePass:intervals.length>=3&&Math.min(...intervals)>=3.2&&median(intervals)>=4&&median(intervals)<=9.5&&Math.max(...intervals)<=18,
    diversityPass:['X','Y','Z'].every(k=>axisCounts[k]>0)&&['-1','0','1'].every(k=>layerCounts[k]>0)&&maxAxisShare<=.62,
    facePass:faces.length>=2,
  };
  checks.observationPass=Object.values(checks).every(Boolean);
  observationMetrics={revision:'PROAI CUBE R4.4.3 — OWNER REVIEW CANDIDATE',productSha:'731f435c3ee895300d053a83153832cabe65f2ca',publicUrl:url,observationSec:60,axisCounts,layerCounts,maxAxisShare,forwardSlices,candidates,events,releases,dispersals,semanticFacesSelected:faces,readableDurationsSec:readable,opportunityIntervalsSec:intervals,dispersalLatenciesSec:latencies,dispersalLatencySummarySec:{min:latencies.length?Math.min(...latencies):null,median:median(latencies),max:latencies.length?Math.max(...latencies):null},orientationTrace:trace,checks,fatal:[...fatal]};
  fs.writeFileSync(path.join(out,'r443-observation-metrics.json'),JSON.stringify(observationMetrics,null,2));
  fs.writeFileSync(path.join(out,'r443-observation-summary.txt'),['axisCounts='+JSON.stringify(axisCounts),'layerCounts='+JSON.stringify(layerCounts),'faces='+JSON.stringify(faces),'readableDurationsSec='+JSON.stringify(readable),'opportunityIntervalsSec='+JSON.stringify(intervals),'dispersalLatenciesSec='+JSON.stringify(latencies),'checks='+JSON.stringify(checks)].join('\n')+'\n');
  await ctx.close();desktopVideoPath=await copyVideo(video,'desktop-observation-60s.webm');
}

let focused={pass:false,readableStart:null,releaseAt:null,dispersalAt:null,error:null};
try{
  const ctx=await browser.newContext({viewport:{width:1000,height:650},deviceScaleFactor:1,reducedMotion:'no-preference',recordVideo:{dir:out,size:{width:1000,height:650}}});
  const page=await ctx.newPage();await ready(page);const video=page.video(),s=await read(page),t0=s.d.presentation.simTimeMs;await page.waitForTimeout(15000);const e=await read(page),log=(e.s.r443Lifecycle?.lifecycleLog||[]).filter(x=>x.presentationMs>=t0);focused.readableStart=log.find(x=>x.type==='readable-start')?.presentationMs??null;focused.releaseAt=focused.readableStart===null?null:(log.find(x=>x.type==='release'&&x.presentationMs>=focused.readableStart)?.presentationMs??null);focused.dispersalAt=focused.releaseAt===null?null:(log.find(x=>x.type==='dispersal-slice'&&x.presentationMs>=focused.releaseAt)?.presentationMs??null);focused.pass=focused.readableStart!==null&&focused.releaseAt!==null&&focused.dispersalAt!==null;await ctx.close();await copyVideo(video,'focused-semantic-release-dispersal.webm');
}catch(e){focused.error=String(e)}

let mobile={pass:false,canvasBox:null,error:null};
try{
  const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:'no-preference',recordVideo:{dir:out,size:{width:390,height:844}}});
  const page=await ctx.newPage();await ready(page);const video=page.video(),s=await read(page);await page.waitForTimeout(12000);const e=await read(page),box=await page.locator('#cube-canvas').boundingBox();mobile.canvasBox=box;mobile.pass=e.d.presentation.simTimeMs>s.d.presentation.simTimeMs&&box&&box.width>0&&box.x+box.width<=390.5;await ctx.close();await copyVideo(video,'mobile-12s.webm');
}catch(e){mobile.error=String(e)}

let interaction={pass:false,cameraDelta:null,error:null};
try{
  const ctx=await browser.newContext({viewport:{width:900,height:600},deviceScaleFactor:1,reducedMotion:'no-preference'}),page=await ctx.newPage();await ready(page);const box=await page.locator('#cube-canvas').boundingBox(),s=await read(page);if(box){const x=box.x+box.width*.5,y=box.y+box.height*.5;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+105,y-55,{steps:10});await page.mouse.up()}await page.waitForTimeout(3200);const e=await read(page),a=s.interaction.cameraPosition,b=e.interaction.cameraPosition;interaction.cameraDelta=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);interaction.pass=interaction.cameraDelta>1e-4&&e.d.presentation.simTimeMs>s.d.presentation.simTimeMs&&Boolean(e.s.r443Lifecycle);await ctx.close();
}catch(e){interaction.error=String(e)}

await browser.close();
const checks={...observationMetrics.checks,focusedPass:focused.pass,mobilePass:mobile.pass,interactionPass:interaction.pass};checks.behaviorPass=checks.observationPass&&checks.focusedPass&&checks.mobilePass&&checks.interactionPass&&fatal.length===0;
const metrics={...observationMetrics,desktopVideoPath,focused,mobile,interaction,checks,fatal};
fs.writeFileSync(path.join(out,'r443-metrics.json'),JSON.stringify(metrics,null,2));
fs.writeFileSync(path.join(out,'r443-summary.txt'),['PROAI CUBE R4.4.3 — OWNER REVIEW CANDIDATE','product=731f435c3ee895300d053a83153832cabe65f2ca','axisCounts='+JSON.stringify(metrics.axisCounts),'layerCounts='+JSON.stringify(metrics.layerCounts),'faces='+JSON.stringify(metrics.semanticFacesSelected),'readableDurationsSec='+JSON.stringify(metrics.readableDurationsSec),'opportunityIntervalsSec='+JSON.stringify(metrics.opportunityIntervalsSec),'dispersalLatenciesSec='+JSON.stringify(metrics.dispersalLatenciesSec),'checks='+JSON.stringify(checks),'fatal='+JSON.stringify(fatal),'focused='+JSON.stringify(focused),'mobile='+JSON.stringify(mobile),'interaction='+JSON.stringify(interaction)].join('\n')+'\n');
if(!checks.behaviorPass) throw new Error('R4.4.3 behavioral gate failed: '+JSON.stringify(checks));
