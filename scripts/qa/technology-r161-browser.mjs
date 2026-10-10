/* Technology R1.6.1 — browser reality, not CSS-only assertions */
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';
const host='http://127.0.0.1:8787';
const root=process.cwd(),output=path.join(root,'r161-qa-artifacts');fs.mkdirSync(output,{recursive:true});
const viewports=[['desktop1920',1920,1080],['laptop1440',1440,900],['laptop1366',1366,768],['laptop1280',1280,720],['portrait430',430,932],['portrait390',390,844],['portrait375',375,812],['landscape844',844,390],['landscape896',896,414],['landscape932',932,430]];
const stages=['understand','orchestrate','communicate','deliver'],starts=[.04,.27,.46,.65],ends=[.27,.46,.65,.83];
const errors=[],warnings=[],records=[];
const snap=(label,lang,size,state)=>path.join(output,label+'-'+lang+'-'+size+'-'+state+'.png');
function url(locale,old=false){return host+'/owner-preview/technology-fold-flow-r1-6'+(old?'':'-1')+'/'+(locale==='en'?'index':'ru')+'.html'}
async function progress(page,p){
 await page.evaluate(p=>{
  document.documentElement.style.scrollBehavior='auto';document.body.style.scrollBehavior='auto';
  const story=document.querySelector('[data-ff-story]'),offset=scrollY+story.getBoundingClientRect().top;
  scrollTo({top:offset+(story.getBoundingClientRect().height-innerHeight)*p,behavior:'instant'});
 },p);
 await page.waitForTimeout(110);
}
async function state(page){return await page.locator('[data-home-tech-fold-flow]').evaluate(node=>({stage:node.dataset.ffStage,phase:node.dataset.ffPhase,outcome:node.dataset.ffOutcome,enhanced:node.classList.contains('is-enhanced')}))}
async function visibleRects(page){
 return await page.evaluate(()=>{
  const stage=document.querySelector('.home-tech-r161'),active=stage.querySelector('.home-tech-ff__stage[aria-hidden="false"]');
  const nodes=[...(active?.querySelectorAll('h3,.home-tech-ff__family,.home-tech-ff__support,.home-tech-ff__vendor img,.home-tech-ff__vendor b,.home-tech-r161__outcome')||[])];
  if(stage.dataset.ffStage==='resolved')nodes.push(...stage.querySelectorAll('.home-tech-ff__resolution h3,.home-tech-ff__maker,.home-tech-ff__implementation'));
  return nodes.filter(el=>getComputedStyle(el).display!=='none').map(el=>{
   const r=el.getBoundingClientRect();
   return {text:(el.textContent||el.getAttribute('src')||'').trim().slice(0,48),left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height,opacity:getComputedStyle(el).opacity};
  });
 });
}
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const lang of ['en','ru']){
  for(const [size,width,height] of viewports){
   const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'no-preference'});
   const page=await context.newPage();let runtime=[];
   page.on('pageerror',e=>runtime.push('pageerror '+e.message));
   page.on('console',m=>{if(m.type()==='error')runtime.push('console '+m.text())});
   page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(host))runtime.push('HTTP '+r.status()+' '+r.url())});
   await page.goto(url(lang),{waitUntil:'domcontentloaded',timeout:45000});
   await page.locator('.home-tech-r161.is-enhanced').waitFor();
   await page.waitForTimeout(60);
   const broken=await page.locator('.home-tech-r161 .home-tech-ff__vendor img,.home-tech-r161 .home-tech-ff__maker img').evaluateAll(els=>els.filter(e=>!e.complete||e.naturalWidth===0).map(e=>e.getAttribute('src')));
   if(broken.length)errors.push({lang,size,type:'broken-assets',broken});
   for(let i=0;i<4;i++){
    const begin=starts[i],span=ends[i]-begin;
    for(const [name,relative,expected] of [['entry',.08,'pending'],['active',.51,'pending'],['result',.87,'established']]){
     await progress(page,begin+span*relative);
     const s=await state(page);
     if(s.stage!==stages[i]||s.outcome!==expected)errors.push({lang,size,type:'causal-phase',operation:stages[i],name,expected,actual:s});
     if((name==='entry'&&s.phase!=='entry')||(name==='active'&&s.phase!=='active')||(name==='result'&&s.phase!=='complete'))errors.push({lang,size,type:'phase-mismatch',operation:stages[i],name,actual:s.phase});
     if(name==='result'){
      const rr=await visibleRects(page);
      const clips=rr.filter(x=>x.left<-2||x.right>width+2||x.top<-2||x.bottom>height+2);

      const collisions=await page.evaluate(()=>{
       const active=document.querySelector('.home-tech-r161 .home-tech-ff__stage[aria-hidden="false"]');
       if(!active)return [];
       const content=[...active.querySelectorAll('h3,.home-tech-ff__support,.home-tech-r161__outcome')];
       const brands=[...active.querySelectorAll('.home-tech-ff__vendor img,.home-tech-ff__vendor b')];
       const rect=e=>e.getBoundingClientRect();
       const result=[];
       for(const a of content)for(const b of brands){
        const A=rect(a),B=rect(b),x=Math.min(A.right,B.right)-Math.max(A.left,B.left),y=Math.min(A.bottom,B.bottom)-Math.max(A.top,B.top);
        if(x>5&&y>5)result.push({text:a.textContent.trim().slice(0,32),brand:b.textContent.trim()||b.getAttribute('src'),overlapX:Math.round(x),overlapY:Math.round(y)});
       }
       return result;
      });
      if(collisions.length)warnings.push({lang,size,type:'brand-text-collision',operation:stages[i],collisions});

      if(clips.length)warnings.push({lang,size,type:'element-viewport-intersection',operation:stages[i],rects:clips});
     }
     if(['laptop1440','portrait390','landscape844'].includes(size)&&(['understand','communicate'].includes(stages[i])||size==='laptop1440')){
      await page.waitForTimeout(390);
      await page.screenshot({path:snap('r161',lang,size,stages[i]+'-'+name)});
     }
    }
    await progress(page,begin+span*.10);
    if((await state(page)).outcome!=='pending')errors.push({lang,size,type:'reverse-phase',operation:stages[i]});
   }
   await progress(page,.96);
   const final=await state(page);
   if(final.stage!=='resolved')errors.push({lang,size,type:'missing-resolution',final});
   const finalRects=await visibleRects(page);
   const finalClips=finalRects.filter(x=>x.left<-2||x.right>width+2||x.top<-2||x.bottom>height+2);
   if(finalClips.length)warnings.push({lang,size,type:'final-viewport-intersection',rects:finalClips});
   const measure=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,storyHeight:document.querySelector('[data-ff-story]').getBoundingClientRect().height}));
   if(measure.scrollWidth>measure.viewport+2)errors.push({lang,size,type:'horizontal-overflow',measure});
   if(runtime.length)errors.push({lang,size,type:'console-or-http',runtime});
   if(['laptop1440','portrait390','landscape844'].includes(size)){
    await page.waitForTimeout(400);
    await page.screenshot({path:snap('r161',lang,size,'resolved')});
    const old=await context.newPage();
    await old.goto(url(lang,true),{waitUntil:'domcontentloaded'});
    const oldSection=old.locator('[data-home-tech-fold-flow]');
    for(const [stage,p] of [['understand',.23],['communicate',.61],['resolved',.96]]){
     await old.evaluate(p=>window.__PROAI_FOLD_FLOW_R16__.setProgress(document.querySelector('[data-home-tech-fold-flow]'),p),p);
     await old.waitForTimeout(410);
     await old.screenshot({path:snap('r16',lang,size,stage)});
    }
    await old.close();
   }
   records.push({lang,size,width,height,measure,final,runtimeErrors:runtime.length,visualWarnings:warnings.filter(w=>w.lang===lang&&w.size===size).length});
   console.log('VIEWPORT '+JSON.stringify(records.at(-1)));
   await context.close();
  }
 }
 for(const lang of ['en','ru']){
  for(const [size,width,height] of [['desktop',1440,900],['portrait',390,844]]){
   for(const [scenario,motion,javaScriptEnabled] of [['reduced','reduce',true],['no-js','no-preference',false]]){
    const ctx=await browser.newContext({viewport:{width,height},reducedMotion:motion,javaScriptEnabled});
    const page=await ctx.newPage();await page.goto(url(lang),{waitUntil:'domcontentloaded'});
    const evaluation=await page.evaluate(()=>{
      const section=document.querySelector('.home-tech-r161');
      const stages=[...section.querySelectorAll('.home-tech-ff__stage')];
      const visible=stages.map(x=>({name:x.dataset.ffPanel,aria:x.getAttribute('aria-hidden'),opacity:getComputedStyle(x).opacity,display:getComputedStyle(x).display,visibility:getComputedStyle(x).visibility,top:x.getBoundingClientRect().top}));
      const final=section.querySelector('.home-tech-ff__resolution');
      return {enhanced:section.classList.contains('is-enhanced'),visible,finalDisplay:getComputedStyle(final).display,finalOpacity:getComputedStyle(final).opacity,storyPosition:getComputedStyle(section.querySelector('.home-tech-ff__sticky')).position};
    });
    if(evaluation.enhanced||evaluation.visible.some(x=>x.aria!=='false'||x.opacity==='0'||x.visibility==='hidden'||x.display==='none')||evaluation.finalOpacity==='0'||evaluation.storyPosition==='sticky')errors.push({lang,size,type:scenario+'-story',evaluation});
    await page.screenshot({path:snap('r161',lang,size,scenario+'-all-stages'),fullPage:true});
    records.push({lang,size,scenario,evaluation});
    console.log('ACCESSIBILITY '+JSON.stringify({lang,size,scenario,evaluation}));
    await ctx.close();
   }
  }
 }
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const page=await context.newPage();await page.goto(url('ru'),{waitUntil:'domcontentloaded'});
 await progress(page,.59);const pre=await state(page);
 await page.setViewportSize({width:844,height:390});await page.waitForTimeout(500);const land=await state(page);
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);const post=await state(page);
 if(pre.stage!=='communicate'||land.stage!=='communicate'||post.stage!=='communicate')errors.push({type:'orientation-change-stage',pre,land,post});
 records.push({test:'simulated-orientation',pre,land,post});
 await context.close();
}finally{await browser.close()}
fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({errors,warnings,records},null,2));
console.log('R161_QA_RESULT '+JSON.stringify({pass:errors.length===0&&warnings.length===0,errors:errors.length,warnings:warnings.length,viewports:records.filter(x=>x.size&&!x.scenario).length,detail:errors.slice(0,35)}));
if(errors.length||warnings.length)process.exitCode=1;
