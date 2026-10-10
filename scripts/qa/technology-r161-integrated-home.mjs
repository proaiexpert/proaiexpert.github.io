/* Full-site R1.6.1 release gate: test built Jekyll homepage, not the
   standalone Technology owner preview. Validated against EN/RU siblings. */
import {chromium} from 'playwright';
import fs from 'node:fs';
const OUT='r161-production-integration-evidence';
fs.mkdirSync(OUT,{recursive:true});
const sizes=[['desktop1920',1920,1080],['laptop1440',1440,900],['laptop1366',1366,768],['laptop1280',1280,720],['portrait430',430,932],['portrait390',390,844],['portrait375',375,812],['landscape844',844,390],['landscape896',896,414],['landscape932',932,430]];
const errors=[],results=[];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
function guard(ok,type,info){if(!ok)errors.push({type,...info})}
async function move(page,p){
 await page.evaluate(p=>{
  const root=document.querySelector('.home-tech-r161'),s=root.querySelector('[data-ff-story]'),sticky=root.querySelector('.home-tech-ff__sticky');
  const r=s.getBoundingClientRect();document.documentElement.style.scrollBehavior='auto';
  scrollTo({top:scrollY+r.top+Math.max(1,r.height-sticky.getBoundingClientRect().height)*p,behavior:'instant'});
 },p);await page.waitForTimeout(320);
}
async function state(page){return page.evaluate(()=>{
 const el=document.querySelector('.home-tech-r161'),panel=el.querySelector('.home-tech-ff__stage[aria-hidden="false"]'),outcome=panel?.querySelector('.home-tech-r161__outcome');
 return {stage:el.dataset.ffStage,outcome:el.dataset.ffOutcome,progress:Number(el.style.getPropertyValue('--ff-progress')),phase:el.dataset.ffPhase,final:el.dataset.ffFinalPhase,visibleResult:outcome?Number(getComputedStyle(outcome).opacity):null,material:!!el.querySelector('.home-tech-ff__carrier path[data-ff-path]')};
});}
try{
 for(const lang of ['en','ru'])for(const [label,width,height] of sizes){
  const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'no-preference'}),page=await ctx.newPage();
  const exceptions=[],errors404=[];
  page.on('pageerror',e=>exceptions.push(e.message));
  page.on('response',r=>{if(r.status()===404&&/home-technology-fold-flow-r1-6-1/.test(r.url()))errors404.push(r.url());});
  await page.goto('http://127.0.0.1:8799/'+(lang==='ru'?'ru/':''),{waitUntil:'domcontentloaded'});
  await page.locator('.home-tech-r161.is-enhanced').waitFor({timeout:12000});
  const meta=await page.evaluate(()=>{
   const css=[...document.querySelectorAll('link[rel="stylesheet"]')].map(x=>x.href),scripts=[...document.querySelectorAll('script[src]')].map(x=>x.src);
   const previous=document.querySelector('#two-worlds-clean-golden-r4, [data-tw-r5]'),technology=document.querySelector('.home-tech-r161'),next=document.querySelector('.home-fs-showcase-r14, [data-fs-showcase-r11]');
   return {counts:document.querySelectorAll('[data-home-tech-fold-flow]').length,oldReferences:[...css,...scripts].filter(x=>x.includes('home-technology-fold-flow-r1-5-1')),newCSS:css.filter(x=>x.includes('/home-technology-fold-flow-r1-6-1.css')).length,newJS:scripts.filter(x=>x.includes('/home-technology-fold-flow-r1-6-1.js')).length,hasPrevious:!!previous,hasNext:!!next,ordered:!!previous&&!!technology&&!!next&&!!(previous.compareDocumentPosition(technology)&Node.DOCUMENT_POSITION_FOLLOWING)&&!!(technology.compareDocumentPosition(next)&Node.DOCUMENT_POSITION_FOLLOWING)};
  });
  guard(meta.counts===1&&meta.newCSS===1&&meta.newJS===1&&meta.oldReferences.length===0,'source-integration',{lang,label,meta});
  guard(meta.hasPrevious&&meta.hasNext&&meta.ordered,'section-seams',{lang,label,meta});
  for(const [stage,p] of [['handoff',.055],['understand',.27],['orchestrate',.47],['communicate',.65],['deliver',.825],['resolved',.97]]){
   await move(page,p);const s=await state(page);guard(s.stage===stage,'phase',{lang,label,stage,p,s});
   guard(s.material,'material-missing',{lang,label,stage});
   if(stage!=='handoff'&&stage!=='resolved')guard(s.outcome==='established'&&s.visibleResult>.8,'not-readable-after-settle',{lang,label,stage,s});
  }
  await move(page,.61);const s=await state(page);await move(page,.57);const back=await state(page);
  guard(back.progress<s.progress&&back.stage==='communicate','reverse-scroll',{lang,label,s,back});
  guard(!exceptions.length,'page-exception',{lang,label,exceptions:exceptions.slice(0,4)});
  guard(!errors404.length,'assets-404',{lang,label,errors404});
  if(['portrait390','landscape844','laptop1440'].includes(label)){
   await move(page,.62);await page.screenshot({path:OUT+'/'+lang+'-'+label+'-communicate.png'});
   await move(page,.971);await page.screenshot({path:OUT+'/'+lang+'-'+label+'-resolved.png'});
  }
  results.push({lang,label,viewport:width+'x'+height,passed:!errors.some(e=>e.lang===lang&&e.label===label)});
  await ctx.close();
 }
}finally{await browser.close()}
fs.writeFileSync(OUT+'/results.json',JSON.stringify({results,errors},null,2));
console.log('TECH_R161_REAL_HOMEPAGE '+JSON.stringify({passed:errors.length===0,viewports:results.length,errors:errors.slice(0,20)}));
if(errors.length)process.exitCode=1;
