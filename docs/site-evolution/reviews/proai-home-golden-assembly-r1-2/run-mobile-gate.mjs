import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT='docs/site-evolution/reviews/proai-home-golden-assembly-r1-2';
const MEDIA=`${OUT}/media`;
const BASE=process.env.PRODUCT_BASE_URL||'http://127.0.0.1:4173/';
fs.mkdirSync(MEDIA,{recursive:true});

const browser=await chromium.launch({headless:true,args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,reducedMotion:'no-preference'});
const page=await context.newPage();
page.setDefaultTimeout(9000);
const consoleEntries=[],pageErrors=[],requests=[],requestFailures=[];
page.on('console',m=>consoleEntries.push({type:m.type(),text:m.text()}));
page.on('pageerror',e=>pageErrors.push(String(e)));
page.on('response',r=>{const u=r.url();if(/cube|three|GLTF|RoomEnvironment|RoundedBox|RectArea|rubik/i.test(u))requests.push({url:u,status:r.status()})});
page.on('requestfailed',r=>{const u=r.url();if(/cube|three|GLTF|RoomEnvironment|RoundedBox|RectArea|rubik/i.test(u))requestFailures.push({url:u,error:r.failure()?.errorText||'failed'})});

await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:30000});
await page.evaluate(()=>document.fonts?.ready).catch(()=>{});
let cubeReady=false;
try{await page.waitForFunction(()=>document.querySelector('.proai-hero-object-slot')?.dataset.cubeMounted==='true'&&!!document.querySelector('#cube-canvas')&&window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime?.ready===true,null,{timeout:20000});cubeReady=true}catch{}

for(const s of['#hero','[data-connected-system]','[data-tw-r2]','[data-home-tech-r2]','[data-fs-showcase-r11]','footer[data-footer-watermark-r2]']){
  await page.evaluate(sel=>document.querySelector(sel)?.scrollIntoView({block:'center'}),s);
  if(s==='[data-fs-showcase-r11]'){
    try{await page.waitForFunction(()=>document.querySelector('[data-fs-showcase-r11]')?.classList.contains('is-live'),null,{timeout:3500})}catch{}
    await page.waitForTimeout(900);
  }else await page.waitForTimeout(180);
}

const measured=await page.evaluate(()=>{
  const d=document.documentElement,b=document.body;
  const slot=document.querySelector('.proai-hero-object-slot');
  const mount=document.querySelector('#proai-hero-cube-mount');
  const canvas=document.querySelector('#cube-canvas');
  const tw=document.querySelector('[data-tw-r2] .tw-r2__intro-title')?.getBoundingClientRect();
  const fsRoot=document.querySelector('[data-fs-showcase-r11]');
  const stage=fsRoot?.querySelector('.home-fs-showcase-r11__stage');
  const primary=fsRoot?.querySelector('.home-fs-showcase-r11__primary');
  const secondary=fsRoot?.querySelector('.home-fs-showcase-r11__secondary');
  const h2=fsRoot?.querySelector('h2');
  const img=secondary?.querySelector('img');
  const stageW=stage?.getBoundingClientRect().width||1;
  const pct=v=>parseFloat(v)/stageW*100;
  const pc=primary?getComputedStyle(primary):null,sc=secondary?getComputedStyle(secondary):null;
  const hr=h2?.getBoundingClientRect();
  const ir=img?.getBoundingClientRect();
  const natural=img?.naturalHeight?img.naturalWidth/img.naturalHeight:0,rendered=ir?.height?ir.width/ir.height:0;
  return {
    cube:{mounted:slot?.dataset.cubeMounted||null,canvas:!!canvas,runtimeGlobal:!!window.__PROAI_HERO_CUBE_GOLDEN_R1,runtimeReady:window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime?.ready===true,api45:!!window.__PROAI_CUBE_TOUCH_AUTO_45_R1,mountBox:mount?.getBoundingClientRect().toJSON?.()||null,slotBox:slot?.getBoundingClientRect().toJSON?.()||null,mountStyle:mount?{opacity:getComputedStyle(mount).opacity,visibility:getComputedStyle(mount).visibility,display:getComputedStyle(mount).display}:null},
    overflow:Math.max(0,d.scrollWidth-d.clientWidth,b.scrollWidth-d.clientWidth),
    twoWorlds:{titleInside:!!tw&&tw.left>=-2&&tw.right<=innerWidth+2,box:tw?.toJSON?.()||null,embeddedTechnology:document.querySelectorAll('[data-tw-tech-r2],.tw-tech-r2').length},
    financial:fsRoot&&primary&&secondary&&h2?{primaryPct:+pct(pc.width).toFixed(2),secondaryPct:+pct(sc.width).toFixed(2),rightPct:+pct(sc.right).toFixed(2),sectionViewportHeights:+(fsRoot.getBoundingClientRect().height/innerHeight).toFixed(3),titleInside:!!hr&&hr.left>=-2&&hr.right<=innerWidth+2,fullMobileAsset:!!natural&&Math.abs(rendered-natural)/natural<.04}:null,
    brokenImages:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.currentSrc||i.src),
    legacy:{coreSplit:document.querySelectorAll('#core-split').length,oldFinancial:document.querySelectorAll('#section-trigger').length,oldTwScripts:[...document.scripts].filter(s=>/homepage-two-worlds-r2(?:1|2)?\.js/.test(s.src)).length}
  };
});

const result={cubeReady,measured,consoleEntries,pageErrors,requests,requestFailures};
result.pass=cubeReady&&measured.cube.mounted==='true'&&measured.cube.canvas&&measured.cube.runtimeReady&&measured.overflow===0&&measured.twoWorlds.titleInside&&measured.twoWorlds.embeddedTechnology===0&&measured.financial?.primaryPct>=103.5&&measured.financial?.primaryPct<=104.5&&measured.financial?.secondaryPct>=25.5&&measured.financial?.secondaryPct<=26.5&&measured.financial?.rightPct>=-5&&measured.financial?.rightPct<=-4&&measured.financial?.titleInside&&measured.financial?.fullMobileAsset&&measured.brokenImages.length===0&&pageErrors.length===0&&requestFailures.length===0;
await page.screenshot({path:`${MEDIA}/00-mobile-gate-en-390x844.png`,fullPage:true});
fs.writeFileSync(`${OUT}/mobile-gate.json`,JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
await context.close();await browser.close();
if(!result.pass)process.exit(1);
