import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';
const root=process.cwd(),host='http://127.0.0.1:8787',out=path.join(root,'r16-qa-artifacts');
fs.mkdirSync(out,{recursive:true});
const sizes=[['desktop1920',1920,1080],['laptop1440',1440,900],['laptop1366',1366,768],['laptop1280',1280,720],['portrait430',430,932],['portrait390',390,844],['portrait375',375,812],['landscape844',844,390],['landscape896',896,414],['landscape932',932,430]];
const points=[['understand',.13],['orchestrate',.36],['communicate',.56],['deliver',.74],['resolved',.94]];
const errors=[],results=[];
function render(template,locale){
 const block=locale==='ru'?template.match(/\{% if ff_lang == 'ru' %\}([\s\S]*?)\{% else %\}/):template.match(/\{% else %\}([\s\S]*?)\{% endif %\}/);
 const values={ff_lang:locale};
 for(const m of block[1].matchAll(/\{% assign ([a-z0-9_]+) = '([^']*)' %\}/g))values[m[1]]=m[2];
 return template.slice(template.indexOf('<section')).replace(/\{\{\s*(\w+)\s*\}\}/g,(_,key)=>values[key]??'');
}
const base=path.join(root,'.r16-qa-baseline');fs.mkdirSync(base,{recursive:true});
const donor=fs.readFileSync(path.join(root,'_includes/home-technology-fold-flow-r1-5-1.html'),'utf8');
for(const locale of ['en','ru']){
 const html='<!DOCTYPE html><html lang="'+locale+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/assets/css/home-technology-fold-flow-r1-5-1.css"></head><body style="margin:0;background:#020304">'+render(donor,locale)+'<script src="/assets/js/home-technology-fold-flow-r1-5-1.js"></script></body></html>';
 fs.writeFileSync(path.join(base,locale+'.html'),html);
}
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const locale of ['en','ru']){
  for(const [label,width,height] of sizes){
   const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
   const page=await context.newPage(),issues=[];
   page.on('pageerror',e=>issues.push(e.message));
   page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(host))issues.push('HTTP '+r.status()+' '+r.url())});
   await page.goto(host+'/owner-preview/technology-fold-flow-r1-6/'+(locale==='en'?'index':'ru')+'.html',{waitUntil:'domcontentloaded'});
   const section=page.locator('[data-home-tech-fold-flow]');await section.waitFor({state:'attached'});await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.body.style.scrollBehavior='auto'});
   const broken=await page.locator('[data-ff-panel] img,.home-tech-ff__maker img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.getAttribute('src')));
   if(broken.length)errors.push({locale,label,type:'broken-marks',broken});
   for(const [stage,p] of points){
    await page.evaluate(p=>{const story=document.querySelector('[data-ff-story]');const start=scrollY+story.getBoundingClientRect().top;scrollTo({top:start+(story.getBoundingClientRect().height-innerHeight)*p,behavior:'instant'})},p);
    await page.waitForTimeout(150);
    const actual=await section.getAttribute('data-ff-stage');
    if(actual!==stage)errors.push({locale,label,type:'wrong-stage',stage,actual});
   }
   await page.evaluate(p=>{const story=document.querySelector('[data-ff-story]');const start=scrollY+story.getBoundingClientRect().top;scrollTo({top:start+(story.getBoundingClientRect().height-innerHeight)*p,behavior:'instant'})},.13);
   await page.waitForTimeout(150);
   if(await section.getAttribute('data-ff-stage')!=='understand')errors.push({locale,label,type:'reverse-scroll'});
   const check=await page.evaluate(()=>({documentWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth,stage:document.querySelector('[data-home-tech-fold-flow]').dataset.ffStage}));
   if(check.documentWidth>check.viewportWidth+2)errors.push({locale,label,type:'overflow',check});
   if(issues.length)errors.push({locale,label,type:'browser-errors',issues});
   results.push({locale,label,width,height,overflow:check.documentWidth-check.viewportWidth,issues});
   console.log('VIEWPORT '+JSON.stringify(results.at(-1)));
   const shots=(label==='laptop1440'||label==='portrait390'||label==='landscape844')?[points[0],points[2],points[4]]:[points[0],points[4]];
   for(const [stage,p] of shots){
    await page.evaluate(p=>window.__PROAI_FOLD_FLOW_R16__.setProgress(document.querySelector('[data-home-tech-fold-flow]'),p),p);
    await page.waitForTimeout(530);
    await page.screenshot({path:path.join(out,'r16-'+locale+'-'+label+'-'+stage+'.png')});
    if(label==='laptop1440'){
     const old=await context.newPage();
     await old.goto(host+'/.r16-qa-baseline/'+locale+'.html',{waitUntil:'domcontentloaded'});
     await old.evaluate(p=>window.__PROAI_FOLD_FLOW_R151__.setProgress(document.querySelector('[data-home-tech-fold-flow]'),p),p);
     await old.waitForTimeout(530);
     await old.screenshot({path:path.join(out,'r151-'+locale+'-'+label+'-'+stage+'.png')});
     await old.close();
    }
   }
   await context.close();
  }
 }
 const reducedCtx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const reducedPage=await reducedCtx.newPage();
 await reducedPage.goto(host+'/owner-preview/technology-fold-flow-r1-6/index.html',{waitUntil:'domcontentloaded'});
 const reduced=await reducedPage.locator('[data-home-tech-fold-flow]').getAttribute('data-ff-stage');
 if(reduced!=='resolved')errors.push({type:'reduced-motion',actual:reduced});
 await reducedCtx.close();
 const ctx=await browser.newContext({viewport:{width:390,height:844}});
 const pg=await ctx.newPage();await pg.goto(host+'/owner-preview/technology-fold-flow-r1-6/ru.html',{waitUntil:'domcontentloaded'});
 await pg.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';const story=document.querySelector('[data-ff-story]');scrollTo({top:scrollY+story.getBoundingClientRect().top+(story.offsetHeight-innerHeight)*.55,behavior:'instant'})});
 await pg.waitForTimeout(350);
 const rotationBefore=await pg.locator('[data-home-tech-fold-flow]').getAttribute('data-ff-stage');
 await pg.setViewportSize({width:844,height:390});await pg.waitForTimeout(500);
 const rotationMid=await pg.locator('[data-home-tech-fold-flow]').getAttribute('data-ff-stage');
 await pg.setViewportSize({width:390,height:844});await pg.waitForTimeout(500);
 const rotate=await pg.locator('[data-home-tech-fold-flow]').getAttribute('data-ff-stage');
 results.push({test:'chromium-viewport-rotation',before:rotationBefore,landscape:rotationMid,portrait:rotate});
 if(rotationBefore!=='communicate'||rotationMid!=='communicate'||rotate!=='communicate')errors.push({type:'orientation-progress-preservation',before:rotationBefore,landscape:rotationMid,portrait:rotate});
 await ctx.close();
}finally{await browser.close()}
fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({errors,results},null,2));
console.log('R16_QA_RESULT '+JSON.stringify({pass:errors.length===0,errorCount:errors.length,errors:errors.slice(0,50),viewportRuns:results.length}));
if(errors.length)process.exitCode=1;
