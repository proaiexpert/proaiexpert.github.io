/* R1.6.1 temporal QA: actual scroll positions, wheel, touch, pauses,
   reverse and orientation; 20 EN/RU viewport tests plus filmstrip evidence. */
import {chromium} from 'playwright';
import fs from 'node:fs';import path from 'node:path';
const ROOT='http://127.0.0.1:8787/owner-preview/technology-fold-flow-r1-6-1/';
const OUT='r161-temporal-evidence';fs.mkdirSync(OUT,{recursive:true});
const sizes=[['desktop1920',1920,1080],['laptop1440',1440,900],['laptop1366',1366,768],['laptop1280',1280,720],['portrait430',430,932],['portrait390',390,844],['portrait375',375,812],['landscape844',844,390],['landscape896',896,414],['landscape932',932,430]];
const stages=['understand','orchestrate','communicate','deliver'],starts=[.105,.32,.515,.70],ends=[.32,.515,.70,.865];
const problems=[],frames=[],reports=[],checks=[];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
async function move(page,p,ms=230){
 await page.evaluate(p=>{document.documentElement.style.scrollBehavior='auto';document.body.style.scrollBehavior='auto';const s=document.querySelector('[data-ff-story]'),r=s.getBoundingClientRect(),k=document.querySelector('.home-tech-ff__sticky').getBoundingClientRect();scrollTo({top:scrollY+r.top+Math.max(1,r.height-k.height)*p,behavior:'instant'});},p);
 await page.waitForTimeout(ms);
}
async function sample(page){return page.evaluate(()=>{
 const root=document.querySelector('.home-tech-r161'),active=root.querySelector('.home-tech-ff__stage[aria-hidden="false"]');
 const get=e=>{if(!e)return null;const c=getComputedStyle(e);return {opacity:Number(c.opacity),font:parseFloat(c.fontSize),visibility:c.visibility,text:e.textContent?.trim().slice(0,70)}};
 const story=root.querySelector('[data-ff-story]').getBoundingClientRect(),sticky=root.querySelector('.home-tech-ff__sticky').getBoundingClientRect();
 return {stage:root.dataset.ffStage,phase:root.dataset.ffPhase,outcome:root.dataset.ffOutcome,intro:root.dataset.ffHandoffPhase,final:root.dataset.ffFinalPhase,progress:Number(root.style.getPropertyValue('--ff-progress')),travel:Math.max(1,story.height-sticky.height),scrollY,heading:get(active?.querySelector('h3')),family:get(active?.querySelector('.home-tech-ff__family')),result:get(active?.querySelector('.home-tech-r161__outcome')),payload:get(root.querySelector('.home-tech-ff__payload')),history:get(root.querySelector('.home-tech-ff__history')),finalTitle:get(root.querySelector('.home-tech-ff__resolution h3')),maker:get(root.querySelector('.home-tech-ff__maker')),implementation:get(root.querySelector('.home-tech-ff__implementation'))};
 });}
function check(v,type,where){if(!v)problems.push({type,...where})}
async function frame(page,lang,size,label,p,ms,save){await move(page,p,ms);const x=await sample(page);frames.push({lang,size,label,p,...x});if(save)await page.screenshot({path:path.join(OUT,lang+'-'+size+'-'+label+'.png')});return x}
try{
 for(const lang of ['en','ru'])for(const [size,w,h] of sizes){
  const ctx=await browser.newContext({viewport:{width:w,height:h},reducedMotion:'no-preference',deviceScaleFactor:1}),page=await ctx.newPage(),runtime=[];
  page.on('pageerror',e=>runtime.push(e.message));
  await page.goto(ROOT+(lang==='en'?'index.html':'ru.html'),{waitUntil:'domcontentloaded'});await page.locator('.home-tech-r161.is-enhanced').waitFor();
  const film=['portrait390','landscape844','laptop1440'].includes(size);
  const handoff=await frame(page,lang,size,'handoff-read',.06,300,film);
  check(handoff.stage==='handoff'&&handoff.payload?.opacity>.75,'handoff-flash',{lang,size,opacity:handoff.payload?.opacity});
  const transfer=await frame(page,lang,size,'handoff-transfer',.096,300,film);
  check(transfer.stage==='handoff'&&transfer.payload?.opacity<.5&&transfer.payload?.opacity>.05,'handoff-transfer',{lang,size,opacity:transfer.payload?.opacity});
  const handoffPixels=handoff.travel*.105;
  check(handoffPixels>=(size.startsWith('landscape')?85:140),'handoff-pixels',{lang,size,handoffPixels});
  for(let i=0;i<4;i++){
   const delta=ends[i]-starts[i],p=t=>starts[i]+delta*t,stage=stages[i],info={lang,size,stage};
   const enter=await frame(page,lang,size,stage+'-enter',p(.08),180,film);
   const moving=await frame(page,lang,size,stage+'-moving',p(.32),180,film);
   const settling=await frame(page,lang,size,stage+'-settling',p(.49),180,film);
   const result=await frame(page,lang,size,stage+'-read',p(.68),360,film);
   const held=await frame(page,lang,size,stage+'-held',p(.92),270,film);
   check([enter,moving,settling,result,held].every(x=>x.stage===stage),'stage-changed-within-segment',info);
   check(moving.outcome==='pending'&&settling.outcome==='pending','premature-result',info);
   check(result.outcome==='established'&&held.outcome==='established','result-unstable',info);
   check(result.result?.opacity>.82&&held.result?.opacity>.82,'result-not-readable',{...info,opacity:[result.result?.opacity,held.result?.opacity]});
   check(result.family?.opacity>.8&&result.heading?.opacity>.8,'family-heading-not-paired',info);
   check(result.family?.font>=9.5&&result.result?.font>=10,'tiny-label',{...info,font:[result.family?.font,result.result?.font]});
   const stable=delta*.45*result.travel;check(stable>=(size.startsWith('landscape')?58:110),'result-too-short',{...info,pixels:stable});
   reports.push({...info,stagePixels:Math.round(delta*result.travel),resultPixels:Math.round(stable)});
   const reverse=await frame(page,lang,size,stage+'-reverse',p(.30),130,false);
   check(reverse.stage===stage&&reverse.outcome==='pending','reverse-causality',info);
  }
  const history=await frame(page,lang,size,'final-history',.865+.135*.12,280,film);
  const title=await frame(page,lang,size,'final-title',.865+.135*.35,300,film);
  const signature=await frame(page,lang,size,'final-signature',.865+.135*.58,300,film);
  const next=await frame(page,lang,size,'final-next',.865+.135*.84,300,film);
  check(history.stage==='resolved'&&history.final==='history'&&history.finalTitle?.opacity<.2,'final-history-flash',{lang,size,history});
  check(title.final==='system'&&title.finalTitle?.opacity>.8,'final-title-missing',{lang,size,title});
  check(signature.final==='signature'&&signature.maker?.opacity>.8,'final-signature-missing',{lang,size,signature});
  check(next.final==='next'&&next.implementation?.opacity>.8,'next-chapter-label-missing',{lang,size,next});
  check(!runtime.length,'browser-exception',{lang,size,runtime});
  const item={lang,size,handoffPixels:Math.round(handoffPixels),minResultPixels:Math.round(Math.min(...reports.filter(x=>x.lang===lang&&x.size===size).map(x=>x.resultPixels)))};
  checks.push(item);console.log('TEMPORAL_VIEWPORT '+JSON.stringify(item));await ctx.close();
 }
 for(const [lang,size,w,h] of [['en','laptop1440',1440,900],['ru','portrait390',390,844],['ru','landscape844',844,390]]){
  const ctx=await browser.newContext({viewport:{width:w,height:h},hasTouch:true,deviceScaleFactor:1,isMobile:size==='portrait390'}),page=await ctx.newPage();
  await page.goto(ROOT+(lang==='en'?'index.html':'ru.html'),{waitUntil:'domcontentloaded'});await move(page,.44);
  const a=await sample(page);await page.mouse.wheel(0,102);await page.waitForTimeout(170);const b=await sample(page);
  check(b.scrollY>a.scrollY,'wheel-not-working',{lang,size,from:a.scrollY,to:b.scrollY});
  await page.mouse.wheel(0,-76);await page.waitForTimeout(170);const c=await sample(page);
  check(c.scrollY<b.scrollY,'reverse-wheel-not-working',{lang,size});
  const cdp=await ctx.newCDPSession(page),x=Math.min(w*.7,w-45),y=Math.min(h*.75,h-35);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let n=1;n<=8;n++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-n*13}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(250);
  const d=await sample(page);check(d.scrollY>c.scrollY,'touch-not-working',{lang,size,from:c.scrollY,to:d.scrollY});
  await move(page,.515+.185*.57,140);const paused=await sample(page);await page.waitForTimeout(500);const resumed=await sample(page);
  check(paused.stage===resumed.stage&&paused.outcome===resumed.outcome,'pause-changes-semantic-state',{lang,size});
  await move(page,.703,100);const ahead=await sample(page);await move(page,.697,100);const jitter=await sample(page);
  check(ahead.stage===jitter.stage,'threshold-oscillation',{lang,size,ahead:ahead.stage,jitter:jitter.stage});
  if(size==='portrait390'){await move(page,.61,250);const before=await sample(page);await page.setViewportSize({width:844,height:390});await page.waitForTimeout(450);const middle=await sample(page);await page.setViewportSize({width:390,height:844});await page.waitForTimeout(450);const after=await sample(page);check(before.stage===middle.stage&&middle.stage===after.stage,'orientation-state-inconsistent',{before:before.stage,middle:middle.stage,after:after.stage});fs.writeFileSync(path.join(OUT,'orientation.json'),JSON.stringify({before,middle,after},null,2));}
  await ctx.close();
 }
}finally{await browser.close()}
fs.writeFileSync(path.join(OUT,'timeline.json'),JSON.stringify({checks,reports,frames,problems},null,2));
console.log('R161_TEMPORAL_RESULT '+JSON.stringify({pass:!problems.length,errors:problems.length,viewportLocales:checks.length,operations:reports.length,frames:frames.length,issues:problems.slice(0,18)}));
if(problems.length)process.exitCode=1;
