import { chromium } from 'playwright';
import fs from 'node:fs';

const PRODUCT_SHA=process.env.PRODUCT_SHA||'38b92195a11709546db8fe0beeaa782244eee83f';
const OUT='docs/site-evolution/reviews/proai-home-golden-assembly-r1-1';
const MEDIA=`${OUT}/media`;
fs.mkdirSync(MEDIA,{recursive:true});
const sizes=[['1440x900',1440,900],['1366x768',1366,768],['1024x768',1024,768],['430x932',430,932],['393x852',393,852],['390x844',390,844],['375x812',375,812],['320x568',320,568],['844x390',844,390],['932x430',932,430]];
const browser=await chromium.launch({headless:true,args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const report={productSha:PRODUCT_SHA,generatedAt:new Date().toISOString(),viewports:{en:{},ru:{}},components:{},connected:{},financialStream:{},screenshots:[],failures:[]};
const fail=(k,v='')=>{const x=v?`${k}: ${v}`:k;if(!report.failures.includes(x))report.failures.push(x)};

async function open(lang,w,h,{touch=false,init=null}={}){
  const context=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,hasTouch:touch,isMobile:false,reducedMotion:'no-preference'});
  const page=await context.newPage(); const warnings=[],errors=[];
  page.on('console',m=>{if(['warning','error'].includes(m.type()))warnings.push(`${m.type()}: ${m.text()}`)});
  page.on('pageerror',e=>errors.push(String(e)));
  if(init)await page.addInitScript(init);
  await page.goto(`http://127.0.0.1:4173/${lang==='ru'?'ru/':''}`,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForTimeout(250);
  return {context,page,warnings,errors};
}
async function waitFs(page){
  const root=page.locator('[data-fs-showcase-r11]');
  if(!await root.count())return false;
  await root.scrollIntoViewIfNeeded({timeout:3000});
  try{await page.waitForFunction(()=>document.querySelector('[data-fs-showcase-r11]')?.classList.contains('is-live'),null,{timeout:3000});}catch{}
  try{await page.waitForFunction(()=>[...document.querySelectorAll('[data-fs-showcase-r11] img')].every(i=>i.complete&&i.naturalWidth>0),null,{timeout:3000});}catch{}
  return true;
}
async function snapshot(page){return page.evaluate(()=>{
  const d=document.documentElement,b=document.body;const overflow=Math.max(0,d.scrollWidth-d.clientWidth,b.scrollWidth-d.clientWidth);
  const ids=[...document.querySelectorAll('[id]')].map(e=>e.id).filter(Boolean);const dup=[...new Set(ids.filter((x,i)=>ids.indexOf(x)!==i))];
  const major=['#hero h1','[data-connected-system] h2','[data-tw-r2] h2','[data-home-tech-r2] h2','[data-fs-showcase-r11] h2'].map(s=>document.querySelector(s)).filter(Boolean);
  const clipped=major.filter(e=>{const r=e.getBoundingClientRect();return r.left<-2||r.right>innerWidth+2}).map(e=>e.textContent.trim().replace(/\s+/g,' ').slice(0,80));
  return {overflow,bodyOverflowX:getComputedStyle(b).overflowX,htmlOverflowX:getComputedStyle(d).overflowX,header:document.querySelectorAll('header.site-header[data-site-header]').length,hero:document.querySelectorAll('#hero').length,connected:document.querySelectorAll('[data-connected-system]').length,twoWorlds:document.querySelectorAll('[data-tw-r2][data-tw-golden-r1]').length,embeddedTech:document.querySelectorAll('[data-tw-tech-r2],.tw-tech-r2').length,tech:document.querySelectorAll('[data-home-tech-r2]').length,techMarks:document.querySelectorAll('[data-home-tech-r2] .home-tech-r2__identity').length,financial:document.querySelectorAll('[data-fs-showcase-r11]').length,oldFinancial:document.querySelectorAll('#section-trigger').length,coreSplit:document.querySelectorAll('#core-split').length,footer:document.querySelectorAll('footer[data-footer-watermark-r2]').length,oldTw:[...document.scripts].filter(s=>/homepage-two-worlds-r2(?:1|2)?\.js/.test(s.src)).length,dup,clipped,fsLive:document.querySelector('[data-fs-showcase-r11]')?.classList.contains('is-live')||false,fsImgs:[...document.querySelectorAll('[data-fs-showcase-r11] img')].every(i=>i.complete&&i.naturalWidth>0)};
})}

for(const lang of ['en','ru'])for(const [name,w,h] of sizes){
  const x=await open(lang,w,h,{touch:w<=600});await waitFs(x.page);const s=await snapshot(x.page);s.pageErrors=x.errors;s.pass=s.overflow===0&&s.header===1&&s.hero===1&&s.connected===1&&s.twoWorlds===1&&s.embeddedTech===0&&s.tech===1&&s.techMarks===10&&s.financial===1&&s.oldFinancial===0&&s.coreSplit===0&&s.footer===1&&s.oldTw===0&&s.dup.length===0&&s.clipped.length===0&&s.fsLive&&s.fsImgs&&x.errors.length===0;report.viewports[lang][name]=s;if(!s.pass)fail(`viewport:${lang}:${name}`,JSON.stringify(s));await x.context.close();
}

// Header mobile open/close.
{
 const x=await open('en',390,844,{touch:true});const t=x.page.locator('.site-header__menu-toggle');let opened=false,closed=false;
 if(await t.count()){await t.click({timeout:3000});await x.page.waitForTimeout(100);opened=await x.page.evaluate(()=>document.querySelector('.site-header__menu-toggle')?.getAttribute('aria-expanded')==='true'&&document.querySelector('.site-header__nav')?.classList.contains('is-open'));await x.page.keyboard.press('Escape');await x.page.waitForTimeout(100);closed=await x.page.evaluate(()=>document.querySelector('.site-header__menu-toggle')?.getAttribute('aria-expanded')==='false'&&!document.querySelector('.site-header__nav')?.classList.contains('is-open'))}
 report.components.header={opened,closed,pass:opened&&closed&&x.errors.length===0};if(!report.components.header.pass)fail('header',JSON.stringify(report.components.header));await x.context.close();
}

// Cube laptop + mobile.
for(const cfg of [{key:'laptop',w:1366,h:768,touch:false},{key:'mobile',w:390,h:844,touch:true}]){
 const x=await open('en',cfg.w,cfg.h,{touch:cfg.touch});let ready=false,release=false;
 try{await x.page.waitForFunction(()=>window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime?.ready===true&&document.querySelector('.proai-hero-object-slot')?.dataset.cubeMounted==='true',null,{timeout:12000});ready=true}catch{}
 if(ready){const c=x.page.locator('#cube-canvas');const box=await c.boundingBox();if(box){const sx=box.x+box.width*.5,sy=box.y+box.height*.5;if(cfg.touch){await c.dispatchEvent('pointerdown',{pointerId:31,pointerType:'touch',clientX:sx,clientY:sy,isPrimary:true,buttons:1});await c.dispatchEvent('pointermove',{pointerId:31,pointerType:'touch',clientX:sx+36,clientY:sy-24,isPrimary:true,buttons:1});await c.dispatchEvent('pointerup',{pointerId:31,pointerType:'touch',clientX:sx+36,clientY:sy-24,isPrimary:true,buttons:0})}else{await x.page.mouse.move(sx,sy);await x.page.mouse.down();await x.page.mouse.move(sx+70,sy-40,{steps:6});await x.page.mouse.up()}await x.page.waitForTimeout(500);release=await x.page.evaluate(()=>window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime?.ready===true&&document.querySelector('.proai-hero-object-slot')?.dataset.cubeMounted==='true')}}
 report.components.cube??={};report.components.cube[cfg.key]={ready,release,warnings:x.warnings,errors:x.errors,pass:ready&&release&&x.errors.length===0};if(!report.components.cube[cfg.key].pass)fail(`cube:${cfg.key}`,JSON.stringify(report.components.cube[cfg.key]));await x.context.close();
}
report.components.cube.pass=report.components.cube.laptop.pass&&report.components.cube.mobile.pass;

// Connected autonomous timestamps instrumented before component observer can fire.
{
 const init=()=>{window.__csEvents=[];window.__csSeen=[];new MutationObserver(rs=>{for(const r of rs){const e=r.target;if(!e?.matches?.('[data-system-stage]')||!e.classList.contains('is-active'))continue;const sec=e.closest('[data-connected-system]');if(!sec)continue;const i=[...sec.querySelectorAll('[data-system-stage]')].indexOf(e);if(i<0||window.__csSeen.includes(i))continue;window.__csSeen.push(i);window.__csEvents.push({index:i,at:performance.now()})}}).observe(document,{subtree:true,attributes:true,attributeFilter:['class']})};
 const x=await open('en',1440,900,{init});await x.page.locator('[data-connected-system]').scrollIntoViewIfNeeded({timeout:3000});try{await x.page.waitForFunction(()=>window.__csEvents?.length>=4,null,{timeout:9000})}catch{}const events=await x.page.evaluate(()=>window.__csEvents||[]);const cadence=events.slice(1).map((e,i)=>+(e.at-events[i].at).toFixed(1));const pass=events.length===4&&cadence.length===3&&cadence.every(v=>v>=1840&&v<=1960);report.connected.autonomous={events,cadence,pass};if(!pass)fail('connected:cadence',JSON.stringify(report.connected.autonomous));await x.context.close();
}
{
 const x=await open('en',1440,900);await x.page.locator('[data-connected-system]').scrollIntoViewIfNeeded({timeout:3000});await x.page.waitForTimeout(7600);const stage=x.page.locator('[data-system-stage]').nth(1);const start=Date.now();await stage.hover({timeout:3000});let latency=null;try{await x.page.waitForFunction(()=>document.querySelectorAll('[data-system-stage]')[1]?.classList.contains('is-active'),null,{timeout:700});latency=Date.now()-start}catch{}const durations=await x.page.evaluate(()=>{const s=document.querySelector('[data-connected-system]');return [s?.querySelector('.cs-spine-catch'),s?.querySelector('.cs-light-carriage')].filter(Boolean).flatMap(n=>n.getAnimations().map(a=>Number(a.effect?.getTiming?.().duration||0))).filter(Boolean)});const transfer=durations.find(v=>v>=430&&v<=500)??null;const pass=latency!==null&&latency<=220&&transfer!==null;report.connected.interaction={activeLatencyMs:latency,animationDurations:durations,transferDurationMs:transfer,pass};if(!pass)fail('connected:interaction',JSON.stringify(report.connected.interaction));await x.context.close();
}

// Two Worlds desktop + THE TURN.
{
 const x=await open('en',1440,900);const v=x.page.locator('[data-tw-viewport]');await v.scrollIntoViewIfNeeded({timeout:3000});const states=await x.page.evaluate(()=>{const v=document.querySelector('[data-tw-viewport]'),s=document.querySelector('[data-tw-r2]');if(!v||!s)return null;const r=v.getBoundingClientRect();const fire=p=>{v.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerType:'mouse',clientX:r.left+r.width*p,clientY:r.top+r.height*.5}));return s.getAttribute('data-focus')};return {fine:matchMedia('(hover: hover) and (pointer: fine)').matches,ai:fire(.2),neutral:fire(.5),web:fire(.8)}});await x.context.close();const m=await open('en',390,844,{touch:true});await m.page.evaluate(()=>{const e=document.querySelector('[data-tw-experience]');if(!e)return;const r=e.getBoundingClientRect(),abs=r.top+scrollY,travel=Math.max(1,r.height-innerHeight);scrollTo(0,abs+travel*.5)});await m.page.waitForTimeout(250);const turn=await m.page.evaluate(()=>({focus:document.querySelector('[data-tw-r2]')?.getAttribute('data-focus'),progress:parseFloat(getComputedStyle(document.querySelector('[data-tw-r2]')).getPropertyValue('--tw-mobile-progress'))||0}));await m.context.close();report.components.twoWorlds={desktop:states,mobile:turn,pass:states?.fine&&states.ai==='ai'&&states.neutral==='neutral'&&states.web==='web'&&turn.focus==='turn'&&turn.progress>=.43&&turn.progress<=.57};if(!report.components.twoWorlds.pass)fail('two-worlds',JSON.stringify(report.components.twoWorlds));
}

// Technology one-shot.
{
 const x=await open('en',1366,768);const t=x.page.locator('[data-home-tech-r2]');await t.scrollIntoViewIfNeeded({timeout:3000});try{await x.page.waitForFunction(()=>document.querySelector('[data-home-tech-r2]')?.dataset.techR2State==='settled',null,{timeout:2600})}catch{}const state=await t.getAttribute('data-tech-r2-state');const marks=await x.page.locator('[data-home-tech-r2] .home-tech-r2__identity').count();report.components.technology={state,marks,pass:state==='settled'&&marks===10};if(!report.components.technology.pass)fail('technology',JSON.stringify(report.components.technology));await x.context.close();
}

// Financial Stream desktop/mobile geometry.
{
 const x=await open('en',1440,900);await waitFs(x.page);await x.page.waitForTimeout(850);const d=await x.page.evaluate(()=>{const root=document.querySelector('[data-fs-showcase-r11]'),p=root?.querySelector('.home-fs-showcase-r11__primary'),s=root?.querySelector('.home-fs-showcase-r11__secondary'),img=s?.querySelector('img');if(!root||!p||!s||!img)return null;const pr=p.getBoundingClientRect(),sr=s.getBoundingClientRect(),ir=img.getBoundingClientRect(),nr=img.naturalWidth/img.naturalHeight,rr=ir.width/ir.height,ow=Math.max(0,Math.min(pr.right,sr.right)-Math.max(pr.left,sr.left));return {live:root.classList.contains('is-live'),primaryToSecondary:+(pr.width/sr.width).toFixed(3),overlapFraction:+(ow/pr.width).toFixed(3),fullMobileAsset:Math.abs(rr-nr)/nr<.035,primaryWidth:pr.width,secondaryWidth:sr.width}});if(d){d.primaryDominant=d.primaryToSecondary>=3.5;d.mobileSecondary=d.primaryToSecondary>=3.5;d.criticalDesktopContentObscured=!(d.overlapFraction<=.22);d.tinyPhoneEffect=d.secondaryWidth<180;d.pass=d.live&&d.primaryDominant&&d.mobileSecondary&&d.fullMobileAsset&&!d.criticalDesktopContentObscured&&!d.tinyPhoneEffect}report.financialStream.desktop=d;if(!d?.pass)fail('financial:desktop',JSON.stringify(d));await x.context.close();
 const m=await open('en',390,844,{touch:true});await waitFs(m.page);await m.page.waitForTimeout(850);const z=await m.page.evaluate(()=>{const r=document.querySelector('[data-fs-showcase-r11]'),st=r?.querySelector('.home-fs-showcase-r11__stage'),p=r?.querySelector('.home-fs-showcase-r11__primary'),s=r?.querySelector('.home-fs-showcase-r11__secondary'),img=s?.querySelector('img');if(!r||!st||!p||!s||!img)return null;const rr=r.getBoundingClientRect(),sr=s.getBoundingClientRect(),pr=p.getBoundingClientRect(),ir=img.getBoundingClientRect(),nr=img.naturalWidth/img.naturalHeight,ri=ir.width/ir.height;return {live:r.classList.contains('is-live'),screenRatio:+(rr.height/innerHeight).toFixed(3),secondaryPct:+(sr.width/st.getBoundingClientRect().width*100).toFixed(2),primaryToSecondary:+(pr.width/sr.width).toFixed(3),secondaryHeight:+sr.height.toFixed(1),fullMobileAsset:Math.abs(ri-nr)/nr<.035}});if(z){z.geometryLocked=z.secondaryPct>=25.5&&z.secondaryPct<=26.5;z.mobileSecondary=z.primaryToSecondary>=3.4;z.tinyPhoneEffect=z.secondaryHeight<190;z.sectionLengthApprox135=z.screenRatio>=1.15&&z.screenRatio<=1.55;z.pass=z.live&&z.geometryLocked&&z.mobileSecondary&&z.fullMobileAsset&&!z.tinyPhoneEffect&&z.sectionLengthApprox135}report.financialStream.mobile390=z;if(!z?.pass)fail('financial:mobile390',JSON.stringify(z));await m.context.close();
}

// Footer.
{
 const x=await open('en',1366,768);const f=x.page.locator('footer[data-footer-watermark-r2]');await f.scrollIntoViewIfNeeded({timeout:3000});const count=await f.count();report.components.footer={count,pass:count===1};if(count!==1)fail('footer',String(count));await x.context.close();
}

async function shot(lang,w,h,name,selector=null,boundary=null){const x=await open(lang,w,h,{touch:w<=600});if(boundary){await x.page.evaluate(([a,b])=>{const A=document.querySelector(a),B=document.querySelector(b);if(!A||!B)return;const ar=A.getBoundingClientRect(),br=B.getBoundingClientRect();const y=(ar.bottom+scrollY+br.top+scrollY)/2-innerHeight*.5;scrollTo(0,Math.max(0,y))},boundary)}else if(selector){const l=x.page.locator(selector);if(await l.count())await l.scrollIntoViewIfNeeded({timeout:3000})}if(selector?.includes('fs-showcase'))await waitFs(x.page);await x.page.waitForTimeout(650);const file=`${MEDIA}/${name}.png`;await x.page.screenshot({path:file,fullPage:false,timeout:5000});report.screenshots.push(file);await x.context.close()}
await shot('en',1440,900,'01-en-1440-hero-top');
await shot('en',1366,768,'02-en-1366-laptop');
await shot('en',1440,900,'03-connected-to-two-worlds',null,['[data-connected-system]','[data-tw-r2]']);
await shot('en',1440,900,'04-two-worlds-to-technology',null,['[data-tw-r2]','[data-home-tech-r2]']);
await shot('en',1440,900,'05-technology-to-financial-stream',null,['[data-home-tech-r2]','[data-fs-showcase-r11]']);
await shot('en',1440,900,'06-financial-stream-desktop','[data-fs-showcase-r11]');
await shot('en',390,844,'07-financial-stream-390x844','[data-fs-showcase-r11]');
await shot('en',1366,768,'08-footer','footer[data-footer-watermark-r2]');
await shot('ru',1366,768,'09-ru-1366-representative');
await shot('en',844,390,'10-en-844x390-landscape','[data-fs-showcase-r11]');

report.components.heroPass=['en','ru'].every(l=>Object.values(report.viewports[l]).every(v=>v.hero===1));
report.components.connectedPass=report.connected.autonomous?.pass&&report.connected.interaction?.pass;
report.components.financialStreamPass=report.financialStream.desktop?.pass&&report.financialStream.mobile390?.pass;
report.allViewportsPass=['en','ru'].every(l=>Object.values(report.viewports[l]).every(v=>v.pass));
report.horizontalOverflowMax=Math.max(...['en','ru'].flatMap(l=>Object.values(report.viewports[l]).map(v=>v.overflow||0)));
report.pass=report.failures.length===0;
fs.writeFileSync(`${OUT}/qa-report.json`,JSON.stringify(report,null,2));
await browser.close();
if(!report.pass){console.error('Golden R1.1 FAST QA failures:',report.failures.join(' | '));process.exit(1)}
console.log('Golden R1.1 FAST QA PASS');
