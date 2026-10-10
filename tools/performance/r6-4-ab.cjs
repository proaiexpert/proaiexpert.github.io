#!/usr/bin/env node
/**
 * ProAI Expert R6.4 — isolated Chrome A/B diagnostics, never a production patch.
 * Usage: node tools/performance/r6-4-ab.cjs [--desktop] [--home] [--ru] [--once]
 * Requires existing package.json Playwright 1.54.1 and installed Chromium/Chrome.
 * Lab observers are NOT PSI/Lighthouse scores, INP, or full Lighthouse TBT.
 */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const args=new Set(process.argv.slice(2));
const base='https://proai-expert.com';
const targets=[
  {id:'web-en',url:base+'/websites-branding/'},
  {id:'ai-en',url:base+'/ai-systems/'}
];
if(args.has('--home'))targets.push({id:'home-en',url:base+'/'});
if(args.has('--ru'))targets.push(
  {id:'web-ru',url:base+'/ru/websites-branding/'},
  {id:'ai-ru',url:base+'/ru/ai-systems/'}
);
const profiles=[
  {id:'mobile',viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2,cpu:4,latency:150,down:1.6*1024*1024/8,up:750*1024/8}
];
if(args.has('--desktop'))profiles.push(
  {id:'desktop',viewport:{width:1440,height:900},isMobile:false,hasTouch:false,deviceScaleFactor:1,cpu:1,latency:40,down:10*1024*1024/8,up:5*1024*1024/8}
);
const variants=['A-normal','B-no-logo','C-no-chatbase','D-no-logo-chatbase'];
const repeats=args.has('--once')?1:3;
const outDir=path.resolve(process.env.PROAI_PERF_OUT||'r6-4-evidence');
fs.mkdirSync(outDir,{recursive:true});
function median(xs){const n=xs.filter(Number.isFinite).sort((a,b)=>a-b);return n.length?n[Math.floor(n.length/2)]:null;}
function num(v){return Number.isFinite(v)?Number(v.toFixed(1)):null;}
async function one(browser,target,profile,variant,round){
 const stem=[target.id,profile.id,variant,round].join('__');
 const context=await browser.newContext({
  viewport:profile.viewport,isMobile:profile.isMobile,hasTouch:profile.hasTouch,
  deviceScaleFactor:profile.deviceScaleFactor,serviceWorkers:'block',acceptDownloads:false
 });
 context.setDefaultTimeout(20000);
 const blocked={logo:0,chatbase:0};
 const disableLogo=variant.includes('no-logo');
 const disableChat=variant==='C-no-chatbase'||variant==='D-no-logo-chatbase';
 await context.route('**/*',async route=>{
  const raw=route.request().url();
  let u;try{u=new URL(raw);}catch{await route.continue();return;}
  const logo=disableLogo&&u.hostname==='proai-expert.com'&&u.pathname==='/assets/brand/proai-logo-r341/live.html';
  const chat=disableChat&&(u.hostname==='chatbase.co'||u.hostname.endsWith('.chatbase.co'));
  if(logo){blocked.logo++;await route.abort('blockedbyclient');return;}
  if(chat){blocked.chatbase++;await route.abort('blockedbyclient');return;}
  await route.continue();
 });
 const page=await context.newPage();
 const errs=[],net={requests:0,completed:0,encodedBytes:0,failed:0};
 page.on('pageerror',e=>errs.push('pageerror: '+String(e).slice(0,240)));
 page.on('console',m=>{if(m.type()==='error'&&!/ERR_BLOCKED_BY_CLIENT/.test(m.text()))errs.push('console: '+m.text().slice(0,240));});
 await page.addInitScript(()=>{
  const state={lcp:[],longtask:[],shift:[]};
  Object.defineProperty(window,'__proaiR64',{value:state,configurable:false});
  for(const [type,key] of [['largest-contentful-paint','lcp'],['longtask','longtask'],['layout-shift','shift']]){
   try{
    new PerformanceObserver(list=>{
     for(const e of list.getEntries()){
      if(key==='lcp')state.lcp.push({at:e.startTime,render:e.renderTime||0,size:e.size||0,element:e.element?.tagName||null,id:e.element?.id||null});
      else if(key==='longtask')state.longtask.push({at:e.startTime,ms:e.duration});
      else if(!e.hadRecentInput)state.shift.push({at:e.startTime,value:e.value});
     }
    }).observe({type,buffered:true});
   }catch{}
  }
 });
 const cdp=await context.newCDPSession(page);
 await cdp.send('Network.enable');
 cdp.on('Network.requestWillBeSent',()=>{net.requests++;});
 cdp.on('Network.loadingFinished',e=>{net.completed++;net.encodedBytes+=e.encodedDataLength||0;});
 cdp.on('Network.loadingFailed',()=>{net.failed++;});
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:profile.cpu});
 await cdp.send('Network.emulateNetworkConditions',{
  offline:false,latency:profile.latency,downloadThroughput:profile.down,uploadThroughput:profile.up
 });
 let navError=null,metricError=null,metrics={};
 const started=Date.now();
 try{
  await page.goto(target.url,{waitUntil:'domcontentloaded',timeout:45000});
 }catch(e){navError=String(e).slice(0,500);}
 try{
  await page.waitForTimeout(3500);
  try{await page.screenshot({path:path.join(outDir,stem+'-3s.png'),animations:'allow',timeout:12000});}
  catch(e){errs.push('screenshot 3s: '+String(e).slice(0,180));}
  await page.waitForTimeout(7500);
  try{await page.screenshot({path:path.join(outDir,stem+'-11s.png'),animations:'allow',timeout:12000});}
  catch(e){errs.push('screenshot 11s: '+String(e).slice(0,180));}
  metrics=await Promise.race([
   page.evaluate(()=>{
    const s=window.__proaiR64||{lcp:[],longtask:[],shift:[]};
    const paint=performance.getEntriesByType('paint');
    const fcp=paint.find(e=>e.name==='first-contentful-paint')?.startTime??null;
    const last=s.lcp.at(-1)||null;
    return {
      fcpMs:fcp,lcpMs:last?.at??null,lcpElement:last?.element||null,lcpId:last?.id||null,
      longTasks:s.longtask.length,longTaskMaxMs:Math.max(0,...s.longtask.map(e=>e.ms)),
      longTaskExcessMs:s.longtask.reduce((sum,e)=>sum+Math.max(0,e.ms-50),0),
      cls:s.shift.reduce((sum,e)=>sum+e.value,0),
      loaded:document.readyState,scrollWidth:document.documentElement.scrollWidth,
      viewportWidth:innerWidth,chatbaseBubble:!!document.querySelector('#chatbase-message-bubbles')
    };
   }),
   new Promise((_,reject)=>setTimeout(()=>reject(Error('metric read timed out')),18000))
  ]);
 }catch(e){metricError=String(e).slice(0,400);}
 const result={
  target:target.id,url:target.url,profile:profile.id,variant,round,
  viewport:profile.viewport,cpuThrottle:profile.cpu,networkLatencyMs:profile.latency,
  navError,metricError,elapsedMs:Date.now()-started,
  blocked,network:net,metrics,errors:errs.slice(0,20)
 };
 fs.writeFileSync(path.join(outDir,stem+'.json'),JSON.stringify(result,null,2));
 await context.close().catch(()=>{});
 return result;
}
(async()=>{
 let browser;const all=[];
 try{
  const opts={headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']};
  if(process.env.CHROME_PATH)opts.executablePath=process.env.CHROME_PATH;
  browser=await chromium.launch(opts);
  for(const target of targets){
   for(const profile of profiles){
    for(let round=1;round<=repeats;round++){
     // Rotate order to reduce temporal/cache bias.
     const sequence=variants.slice(round%variants.length).concat(variants.slice(0,round%variants.length));
     for(const variant of sequence){
      const r=await one(browser,target,profile,variant,round);
      all.push(r);
      console.log([r.target,r.profile,r.variant,round,
       'LCP',num(r.metrics.lcpMs),'LongExcess',num(r.metrics.longTaskExcessMs),
       'Blocked',JSON.stringify(r.blocked),'Errors',r.navError||r.metricError||'none'].join(' | '));
     }
    }
   }
  }
 }catch(e){
  console.error('R6.4 HARNESS FAILED:',String(e));
  process.exitCode=1;
 }finally{
  if(browser)await browser.close().catch(()=>{});
  fs.writeFileSync(path.join(outDir,'all-results.json'),JSON.stringify(all,null,2));
  const groups={};
  for(const row of all){
   const key=[row.target,row.profile,row.variant].join('/');
   (groups[key]??=[]).push(row);
  }
  const summary=Object.entries(groups).map(([group,rows])=>({
   group,attempts:rows.length,valid:rows.filter(r=>!r.navError&&!r.metricError&&r.metrics.lcpMs!==null).length,
   lcpMedianMs:median(rows.filter(r=>!r.navError&&!r.metricError).map(r=>r.metrics.lcpMs)),
   excessLongtaskMedianMs:median(rows.filter(r=>!r.navError&&!r.metricError).map(r=>r.metrics.longTaskExcessMs)),
   requestMedian:median(rows.map(r=>r.network.requests)),
   encodedBytesMedian:median(rows.map(r=>r.network.encodedBytes)),
   blockingConfirmed:rows.some(r=>r.blocked.logo>0||r.blocked.chatbase>0)
  }));
  fs.writeFileSync(path.join(outDir,'summary.json'),JSON.stringify({warning:'Controlled lab proxy. NOT Lighthouse score, Lighthouse TBT, Core Web Vitals, or INP.',summary},null,2));
  console.log('Evidence directory: '+outDir);
 }
})().catch(e=>{console.error(e);process.exitCode=1;});