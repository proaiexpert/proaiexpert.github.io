import { chromium } from 'playwright';
import fs from 'node:fs';

const PRODUCT_SHA='a876dfb178fd3f020c8392b336eae62253f89ae7';
const OUT='docs/site-evolution/reviews/proai-home-golden-assembly-r1-2';
const BASE=process.env.REVIEW_BASE||`http://127.0.0.1:4174/${OUT}/`;
const WRITE=process.env.WRITE_REPORT!=='0';
const SHOTS=process.env.WRITE_SCREENSHOTS!=='0';
const criticalNames=[
  'bootstrap-golden-r1-2.js','source-final-motion-r2-touch-auto-45-r1.js','source-final-motion-r2.js','source-materials-r1.js',
  'rubik_39_s_cube_animation.glb','three.module.min.js','GLTFLoader.js','fs-en-01-home-hero','fs-ru-01-home-hero','fs-home-mobile-en','fs-home-mobile-ru'
];
const result={label:'OWNER PREVIEW — QA PENDING',productSha:PRODUCT_SHA,base:BASE,generatedAt:new Date().toISOString(),en:{},ru:{},pass:false};
const isCritical=url=>criticalNames.some(n=>url.includes(n));

async function inspect(browser,lang){
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,reducedMotion:'no-preference'});
  const page=await context.newPage();
  page.setDefaultTimeout(12000);
  const failed=[],bad=[],pageErrors=[];
  page.on('requestfailed',r=>{if(isCritical(r.url()))failed.push({url:r.url(),error:r.failure()?.errorText||'failed'})});
  page.on('response',r=>{if(isCritical(r.url())&&r.status()>=400)bad.push({url:r.url(),status:r.status()})});
  page.on('pageerror',e=>pageErrors.push(String(e)));
  await page.goto(`${BASE}index.html?lang=${lang}`,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForURL(new RegExp(`owner-review-${lang}\\.html`),{timeout:10000});
  await page.waitForFunction(sha=>document.documentElement.dataset.productSha===sha,PRODUCT_SHA,{timeout:5000});
  let cubeReady=false;
  try{
    await page.waitForFunction(()=>document.querySelector('.proai-hero-object-slot')?.dataset.cubeMounted==='true'&&!!document.querySelector('#cube-canvas')&&window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime?.ready===true,null,{timeout:25000});
    cubeReady=true;
  }catch{}
  await page.evaluate(()=>document.querySelector('.home-fs-showcase-r14')?.scrollIntoView({block:'center'}));
  try{
    await page.waitForFunction(()=>{
      const root=document.querySelector('.home-fs-showcase-r14');
      if(!root)return false;
      return [...root.querySelectorAll('img')].every(i=>i.complete&&i.naturalWidth>0&&i.naturalHeight>0);
    },null,{timeout:15000});
  }catch{}
  await page.waitForTimeout(700);
  const state=await page.evaluate(()=>{
    const d=document.documentElement,b=document.body;
    const root=document.querySelector('.home-fs-showcase-r14');
    const fsImages=[...(root?.querySelectorAll('img')||[])];
    return{
      label:document.querySelector('#owner-preview-qa-pending')?.textContent?.trim()||null,
      cubeCanvas:!!document.querySelector('#cube-canvas'),
      cubeMounted:document.querySelector('.proai-hero-object-slot')?.dataset.cubeMounted||null,
      runtimeReady:window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime?.ready===true,
      fsR14Count:document.querySelectorAll('.home-fs-showcase-r14').length,
      fsSectionCount:document.querySelectorAll('[data-fs-showcase-r11]').length,
      overflow:Math.max(0,d.scrollWidth-d.clientWidth,b.scrollWidth-d.clientWidth),
      brokenFinancialImages:fsImages.filter(i=>!i.complete||i.naturalWidth===0||i.naturalHeight===0).map(i=>i.currentSrc||i.src),
      previewStatus:document.querySelector('#owner-preview-qa-pending')?.dataset.previewStatus||null
    };
  });
  const out={...state,cubeReady,failedCriticalRequests:failed,badCriticalResponses:bad,pageErrors};
  out.brokenCriticalAssets=failed.length+bad.length+state.brokenFinancialImages.length;
  out.pass=state.label==='OWNER PREVIEW — QA PENDING'&&state.previewStatus==='qa-pending'&&cubeReady&&state.cubeCanvas&&state.cubeMounted==='true'&&state.runtimeReady&&state.fsR14Count===1&&state.fsSectionCount===1&&state.overflow===0&&out.brokenCriticalAssets===0&&pageErrors.length===0;
  if(SHOTS)await page.screenshot({path:`${OUT}/media/owner-preview-smoke-${lang}-390x844.png`,fullPage:false,animations:'disabled'});
  await context.close();
  return out;
}

const browser=await chromium.launch({headless:true,args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
result.en=await inspect(browser,'en');
result.ru=await inspect(browser,'ru');
await browser.close();
result.pass=result.en.pass&&result.ru.pass;
if(WRITE)fs.writeFileSync(`${OUT}/owner-preview-smoke.json`,JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
if(!result.pass)process.exit(1);
