import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT='docs/site-evolution/reviews/proai-home-golden-assembly-r1-2';
const MEDIA=`${OUT}/media`;
const PRODUCT=process.env.PRODUCT_BASE_URL||'http://127.0.0.1:4173/';
const DONOR=process.env.DONOR_BASE_URL||'http://127.0.0.1:4175/docs/site-evolution/reviews/proai-cube-touch-auto-45-r1/review.html?variant=B';
fs.mkdirSync(MEDIA,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});

async function open(url,w,h){
  const context=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,hasTouch:w<=600,reducedMotion:'no-preference'});
  const page=await context.newPage();
  page.setDefaultTimeout(12000);
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error') errors.push(m.text())});
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  await page.evaluate(()=>document.fonts?.ready).catch(()=>{});
  try{await page.waitForFunction(()=>document.querySelector('.proai-hero-object-slot')?.dataset.cubeMounted==='true'&&!!document.querySelector('#cube-canvas')&&((window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime?.ready===true)||(window.__PROAI_FULL_HERO_REVIEW?.runtime?.ready===true)),null,{timeout:24000})}catch{}
  await page.evaluate(()=>scrollTo(0,0));
  await page.waitForTimeout(250);
  return {context,page,errors};
}

async function measure(page){
  return page.evaluate(()=>{
    const box=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect(),c=getComputedStyle(e);return{left:+r.left.toFixed(2),top:+r.top.toFixed(2),right:+r.right.toFixed(2),bottom:+r.bottom.toFixed(2),width:+r.width.toFixed(2),height:+r.height.toFixed(2),fontSize:c.fontSize,lineHeight:c.lineHeight,display:c.display,position:c.position}};
    const title=document.querySelector('#hero .proai-hero-title');
    const tc=title?getComputedStyle(title):null;
    const lineHeight=tc?parseFloat(tc.lineHeight):0;
    const tr=title?.getBoundingClientRect();
    return {
      header:box('.site-header'),hero:box('#hero'),heroContent:box('#hero .hero-content'),label:box('#hero .hero-label'),title:box('#hero .proai-hero-title'),support:box('#hero .proai-hero-support'),actions:box('#hero .proai-hero-actions'),object:box('#hero .proai-hero-object-region'),slot:box('#hero .proai-hero-object-slot'),canvas:box('#cube-canvas'),
      titleLines:lineHeight&&tr?+(tr.height/lineHeight).toFixed(2):null,
      titleText:title?.textContent?.trim().replace(/\s+/g,' ')||'',
      cubeMounted:document.querySelector('.proai-hero-object-slot')?.dataset.cubeMounted||null,
      runtimeReady:(window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime?.ready===true)||(window.__PROAI_FULL_HERO_REVIEW?.runtime?.ready===true),
      overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth,document.body.scrollWidth-innerWidth)
    };
  });
}

const fields=['header','hero','heroContent','label','title','support','actions','object','slot','canvas'];
const tol={header:2,hero:10,heroContent:10,label:10,title:10,support:10,actions:10,object:12,slot:12,canvas:12};
function compare(a,b){
  const issues=[];
  for(const f of fields){
    if(!a[f]||!b[f]){issues.push(`${f}:missing`);continue}
    for(const p of ['left','top','width','height']) if(Math.abs(a[f][p]-b[f][p])>tol[f]) issues.push(`${f}.${p}:${a[f][p]}!=${b[f][p]}`);
    if(a[f].display!==b[f].display) issues.push(`${f}.display:${a[f].display}!=${b[f].display}`);
  }
  if(Math.abs((a.titleLines||0)-(b.titleLines||0))>.2) issues.push(`titleLines:${a.titleLines}!=${b.titleLines}`);
  if(a.titleText!==b.titleText) issues.push('titleText');
  if(a.cubeMounted!=='true'||!a.runtimeReady) issues.push('assemblyCubeNotReady');
  if(b.cubeMounted!=='true'||!b.runtimeReady) issues.push('donorCubeNotReady');
  if(a.overflow!==0||b.overflow!==0) issues.push(`overflow:${a.overflow}/${b.overflow}`);
  return issues;
}

const report={donor:'497308fd5e9add24d4fa4254287cbd17f9c0112c/docs/site-evolution/reviews/proai-cube-touch-auto-45-r1/review.html',viewports:{},ru:{},pass:false};
for(const [name,w,h] of [['1440x900',1440,900],['390x844',390,844]]){
  const d=await open(DONOR,w,h),a=await open(PRODUCT,w,h);
  const donor=await measure(d.page),assembly=await measure(a.page),issues=compare(assembly,donor);
  await d.page.screenshot({path:`${MEDIA}/hero-donor-${name}.png`,fullPage:false,animations:'disabled'});
  await a.page.screenshot({path:`${MEDIA}/hero-assembly-${name}.png`,fullPage:false,animations:'disabled'});
  report.viewports[name]={donor,assembly,issues,donorErrors:d.errors,assemblyErrors:a.errors,pass:issues.length===0&&d.errors.length===0&&a.errors.length===0};
  await d.context.close();await a.context.close();
}
const ru=await open(`${PRODUCT}ru/`,390,844);report.ru['390x844']=await measure(ru.page);report.ru['390x844'].pass=report.ru['390x844'].cubeMounted==='true'&&report.ru['390x844'].runtimeReady&&report.ru['390x844'].overflow===0&&report.ru['390x844'].titleLines>=3&&report.ru['390x844'].titleLines<=6&&ru.errors.length===0;report.ru['390x844'].errors=ru.errors;await ru.page.screenshot({path:`${MEDIA}/hero-assembly-ru-390x844.png`,fullPage:false,animations:'disabled'});await ru.context.close();
report.pass=Object.values(report.viewports).every(v=>v.pass)&&report.ru['390x844'].pass;
fs.writeFileSync(`${OUT}/hero-donor-parity.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();
if(!report.pass)process.exit(1);
