#!/usr/bin/env node
/**
 * ProAI Expert R6.5 — controlled production-vs-deferred-logo A/B benchmark.
 * No writes to production. Candidate JavaScript is fulfilled only inside isolated
 * Playwright contexts against the same current production URL.
 *
 * Usage:
 *   node tools/performance/r6-5-compare.cjs
 *   node tools/performance/r6-5-compare.cjs --home --ru --once
 *   node tools/performance/r6-5-compare.cjs --desktop --once
 *
 * Lab long-task excess is NOT Lighthouse TBT or INP. Source LCP is a synthetic
 * PerformanceObserver reading, NOT a CrUX field measurement.
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {chromium} = require('playwright');

const flags = new Set(process.argv.slice(2));
const base='https://proai-expert.com';
const scriptPath=path.resolve('assets/js/header-footer-logo-r1.js');
const candidate=fs.readFileSync(scriptPath,'utf8');
if(!candidate.includes('R6.5 preview experiment'))throw Error('Expected R6.5 candidate not found: '+scriptPath);
const candidateHash=crypto.createHash('sha256').update(candidate).digest('hex');
const targets=[
  {name:'web-en',url:base+'/websites-branding/'},
  {name:'ai-en',url:base+'/ai-systems/'}
];
if(flags.has('--ru'))targets.push(
  {name:'web-ru',url:base+'/ru/websites-branding/'},
  {name:'ai-ru',url:base+'/ru/ai-systems/'}
);
if(flags.has('--home'))targets.push({name:'home-en',url:base+'/'});
const profiles=[
  {name:'mobile',viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2,cpu:4,latency:150,down:1.6*1024*1024/8,up:750*1024/8}
];
if(flags.has('--desktop'))profiles.push(
  {name:'desktop',viewport:{width:1440,height:900},isMobile:false,hasTouch:false,deviceScaleFactor:1,cpu:1,latency:40,down:10*1024*1024/8,up:5*1024*1024/8}
);
const variants=['A-production','B-deferred'];
const rounds=flags.has('--once')?1:3;
const output=path.resolve(process.env.PROAI_R65_OUT||'r6-5-evidence');
fs.mkdirSync(output,{recursive:true});
const wait=t=>new Promise(resolve=>setTimeout(resolve,t));
const med=xs=>{const a=xs.filter(v=>typeof v==='number'&&Number.isFinite(v)).sort((a,b)=>a-b);return a.length?a[Math.floor(a.length/2)]:null;};

async function sample(browser,target,profile,variant,round){
 const stem=[target.name,profile.name,variant,String(round)].join('__');
 const context=await browser.newContext({viewport:profile.viewport,isMobile:profile.isMobile,
   hasTouch:profile.hasTouch,deviceScaleFactor:profile.deviceScaleFactor,
   serviceWorkers:'block',acceptDownloads:false});
 const errors=[],requests={all:0,success:0,failed:0,encodedBytes:0,headerScript:0,candidateFulfilled:0};
 const candidateMode=variant==='B-deferred';
 await context.route('**/assets/js/header-footer-logo-r1.js*',async route=>{
   requests.headerScript++;
   if(candidateMode){
     requests.candidateFulfilled++;
     await route.fulfill({status:200,contentType:'application/javascript; charset=utf-8',body:candidate});
   } else await route.continue();
 });
 const page=await context.newPage();
 page.on('pageerror',err=>errors.push(String(err).slice(0,300)));
 page.on('console',msg=>{if(msg.type()==='error')errors.push('console: '+msg.text().slice(0,300));});
 await page.addInitScript(()=>{
   const state={longtask:[],lcp:[],layoutShift:[]};
   Object.defineProperty(window,'__proaiR65',{value:state});
   for(const type of ['longtask','largest-contentful-paint','layout-shift']){
     try{
       new PerformanceObserver(entries=>{
         for(const item of entries.getEntries()){
           if(type==='longtask')state.longtask.push({at:item.startTime,ms:item.duration});
           else if(type==='largest-contentful-paint')state.lcp.push({ms:item.startTime,element:item.element?.tagName||null,id:item.element?.id||null});
           else if(!item.hadRecentInput)state.layoutShift.push({at:item.startTime,value:item.value});
         }
       }).observe({type,buffered:true});
     }catch{}
   }
 });
 const cdp=await context.newCDPSession(page);
 await cdp.send('Network.enable');
 cdp.on('Network.requestWillBeSent',()=>{requests.all++;});
 cdp.on('Network.loadingFinished',r=>{requests.success++;requests.encodedBytes+=r.encodedDataLength||0;});
 cdp.on('Network.loadingFailed',()=>{requests.failed++;});
 await cdp.send('Network.emulateNetworkConditions',{
   offline:false,latency:profile.latency,downloadThroughput:profile.down,uploadThroughput:profile.up
 });
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:profile.cpu});
 await cdp.send('Profiler.enable');
 await cdp.send('Profiler.start');

 let navError=null;
 let stage3=null,stage11=null,stage16=null,profileError=null;
 const snapshot=async label=>{
   const state=await page.evaluate(()=>{
     const l=document.querySelector('.site-header__brand [data-proai-live-logo]');
     const f=l?.querySelector('.proai-logo-r341__live')||null;
     const stat=l?.querySelector('.proai-logo-r341__static')||null;
     const s=window.__proaiR65||{lcp:[],longtask:[],layoutShift:[]};
     const lcp=s.lcp.at(-1)||null;
     return {
       readyState:document.readyState,logoState:l?.dataset.logoState||null,
       liveSrc:f?.getAttribute('src')||null,
       liveOpacity:f?getComputedStyle(f).opacity:null,
       staticOpacity:stat?getComputedStyle(stat).opacity:null,
       fcpMs:performance.getEntriesByType('paint').find(v=>v.name==='first-contentful-paint')?.startTime??null,
       lcpMs:lcp?.ms??null,lcpElement:lcp?.element??null,
       longTasks:s.longtask.length,
       maxLongTaskMs:Math.max(0,...s.longtask.map(v=>v.ms)),
       longTaskExcessMs:s.longtask.reduce((a,v)=>a+Math.max(0,v.ms-50),0),
       clsNaiveSum:s.layoutShift.reduce((a,v)=>a+v.value,0),
       screenWidth:innerWidth,docWidth:document.documentElement.scrollWidth
     };
   });
   try{await page.screenshot({path:path.join(output,stem+'-'+label+'.png'),timeout:15000});}
   catch(e){errors.push('screenshot '+label+': '+String(e).slice(0,180));}
   return state;
 };
 const started=Date.now();
 try{
   await page.goto(target.url,{waitUntil:'domcontentloaded',timeout:60000});
   await page.waitForTimeout(3000);stage3=await snapshot('3s');
   await page.waitForTimeout(8000);stage11=await snapshot('11s');
   await page.waitForTimeout(5000);stage16=await snapshot('16s');
 }catch(e){navError=String(e).slice(0,450);}
 try{
   const r=await cdp.send('Profiler.stop');
   fs.writeFileSync(path.join(output,stem+'.cpuprofile'),JSON.stringify(r.profile));
 }catch(e){profileError=String(e).slice(0,300);}
 const result={target:target.name,url:target.url,variant,round,profile:profile.name,
   viewport:profile.viewport,cpu:profile.cpu,latencyMs:profile.latency,
   scriptSha256:candidateHash,requests,elapsedMs:Date.now()-started,
   stage3,stage11,stage16,navError,profileError,errors:errors.slice(0,25)};
 fs.writeFileSync(path.join(output,stem+'.json'),JSON.stringify(result,null,2));
 await context.close().catch(()=>{});
 return result;
}

(async()=>{
 let browser;
 const all=[];
 try{
   const launch={headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']};
   if(process.env.CHROME_PATH)launch.executablePath=process.env.CHROME_PATH;
   browser=await chromium.launch(launch);
   for(const target of targets)for(const profile of profiles)for(let round=1;round<=rounds;round++){
     const order=round%2===0?variants.slice().reverse():variants;
     for(const variant of order){
       const r=await sample(browser,target,profile,variant,round);
       all.push(r);
       console.log([r.target,r.profile,r.variant,round,'LCP',r.stage16?.lcpMs??'N/A',
         'long-excess',r.stage16?.longTaskExcessMs??'N/A',
         'scriptIntercepts',r.requests.candidateFulfilled,'logo',r.stage16?.logoState??'N/A',
         r.navError||''].join(' | '));
     }
   }
 }catch(e){console.error('R6.5 runner failure:',String(e));process.exitCode=1;}
 finally{
   if(browser)await browser.close().catch(()=>{});
   fs.writeFileSync(path.join(output,'all-results.json'),JSON.stringify(all,null,2));
   const summary=[];
   const groups=new Map();
   for(const r of all){
     const id=[r.target,r.profile,r.variant].join('/');
     if(!groups.has(id))groups.set(id,[]);
     groups.get(id).push(r);
   }
   for(const [group,rows]of groups){
     const valid=rows.filter(r=>!r.navError&&r.stage16&&r.requests.headerScript===1&&
       (r.variant==='A-production'||r.requests.candidateFulfilled===1));
     summary.push({group,runs:rows.length,valid:valid.length,
       lcpMedianMs:med(valid.map(r=>r.stage16.lcpMs)),
       fcpMedianMs:med(valid.map(r=>r.stage16.fcpMs)),
       excessLongtaskMedianMs:med(valid.map(r=>r.stage16.longTaskExcessMs)),
       maxLongtaskMedianMs:med(valid.map(r=>r.stage16.maxLongTaskMs)),
       bytesMedian:med(valid.map(r=>r.requests.encodedBytes)),
       logo11s:valid.map(r=>r.stage11?.logoState||null),
       logo16s:valid.map(r=>r.stage16?.logoState||null),
       errors:valid.reduce((a,r)=>a+r.errors.length,0)});
   }
   fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify({
     note:'Synthetic metrics, NOT official Lighthouse TBT, INP, CrUX field data, or PSI scores.',
     scriptSha256:candidateHash,summary
   },null,2));
   console.log('Evidence: '+output);
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
