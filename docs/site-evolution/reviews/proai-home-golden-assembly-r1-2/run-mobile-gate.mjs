import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT='docs/site-evolution/reviews/proai-home-golden-assembly-r1-2';
const MEDIA=`${OUT}/media`;
const BASE=process.env.PRODUCT_BASE_URL||'http://127.0.0.1:4173/';
fs.mkdirSync(MEDIA,{recursive:true});

const browser=await chromium.launch({headless:true,args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,reducedMotion:'no-preference'});
const page=await context.newPage();
page.setDefaultTimeout(12000);
const consoleEntries=[],pageErrors=[],requests=[],requestFailures=[];
page.on('console',m=>consoleEntries.push({type:m.type(),text:m.text()}));
page.on('pageerror',e=>pageErrors.push(String(e)));
page.on('response',r=>{const u=r.url();if(/cube|three|GLTF|RoomEnvironment|RoundedBox|RectArea|rubik/i.test(u))requests.push({url:u,status:r.status()})});
page.on('requestfailed',r=>{const u=r.url();if(/cube|three|GLTF|RoomEnvironment|RoundedBox|RectArea|rubik/i.test(u))requestFailures.push({url:u,error:r.failure()?.errorText||'failed'})});

await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:30000});
await page.evaluate(()=>document.fonts?.ready).catch(()=>{});
const browserSourceProbe=await page.evaluate(async()=>{
  const files=[
    'assets/js/proai-hero-cube-r1/source-final-motion-r2-touch-auto-45-r1.js',
    'assets/js/proai-hero-cube-r1/source-final-motion-r2.js',
    'assets/js/proai-hero-cube-r1/source-materials-r1.js'
  ];
  const hex=buffer=>[...new Uint8Array(buffer)].map(b=>b.toString(16).padStart(2,'0')).join('');
  const out={};
  for(const file of files){
    const response=await fetch('/'+file,{cache:'no-store'});
    const text=await response.text();
    const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
    out[file]={
      status:response.status,
      length:text.length,
      sha256:hex(digest),
      motionAuthorityMarker:text.includes("motionAuthority: 'quaternion-editorial-spatial-r1.2-premium'"),
      sliceMarker:text.includes('const SLICE_R1_2 = Object.freeze({'),
      presetMarker:text.includes("selectedPreset: 'premiumHybrid'"),
      glbMarker:text.includes("const GLB_URL = new URL('./rubik_39_s_cube_animation.glb', import.meta.url).href;")
    };
  }
  return out;
});

let cubeReady=false;
try{
  await page.waitForFunction(()=>{
    const slot=document.querySelector('.proai-hero-object-slot');
    return slot?.dataset.cubeMounted==='true'
      && !!document.querySelector('#cube-canvas')
      && !!window.__PROAI_CUBE_TOUCH_AUTO_45_R1
      && !!window.__PROAI_HERO_CUBE_GOLDEN_R1
      && window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime?.ready===true;
  },null,{timeout:24000});
  cubeReady=true;
}catch{}

await page.evaluate(()=>window.scrollTo(0,0));
await page.waitForTimeout(500);
const measured=await page.evaluate(()=>{
  const slot=document.querySelector('.proai-hero-object-slot');
  const mount=document.querySelector('#proai-hero-cube-mount');
  const canvas=document.querySelector('#cube-canvas');
  const hero=document.querySelector('#hero');
  const title=document.querySelector('#hero .proai-hero-title');
  const r=e=>e?.getBoundingClientRect();
  const rb=e=>{const x=r(e);return x?{left:x.left,top:x.top,right:x.right,bottom:x.bottom,width:x.width,height:x.height}:null};
  const sr=r(slot),mr=r(mount),cr=r(canvas),hr=r(hero),tr=r(title);
  return {
    viewport:{width:innerWidth,height:innerHeight},
    cube:{
      mounted:slot?.dataset.cubeMounted||null,
      canvas:!!canvas,
      runtime45:!!window.__PROAI_CUBE_TOUCH_AUTO_45_R1,
      runtimeGlobal:!!window.__PROAI_HERO_CUBE_GOLDEN_R1,
      runtimeReady:window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime?.ready===true,
      slotBox:rb(slot),mountBox:rb(mount),canvasBox:rb(canvas),
      backing:canvas?{width:canvas.width,height:canvas.height}:null,
      visible:!!(sr&&mr&&cr&&sr.width>40&&sr.height>40&&mr.width>40&&mr.height>40&&cr.width>40&&cr.height>40&&getComputedStyle(mount).display!=='none'&&getComputedStyle(mount).visibility!=='hidden'&&parseFloat(getComputedStyle(mount).opacity)>0)
    },
    hero:{box:rb(hero),titleBox:rb(title),titleInside:!!tr&&tr.left>=-2&&tr.right<=innerWidth+2&&tr.top>=-2&&tr.bottom<=innerHeight+2},
    overflow:Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth,document.body.scrollWidth-document.documentElement.clientWidth),
    brokenImages:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.currentSrc||i.src)
  };
});

const fatalConsole=consoleEntries.filter(x=>x.type==='error'&&(/Cube initialization failed|Touch living-auto full Hero review boot failed/i.test(x.text)));
const criticalBad=requests.filter(x=>x.status>=400);
const result={cubeReady,browserSourceProbe,measured,consoleEntries,pageErrors,requests,requestFailures,fatalConsole,criticalBad};
result.pass=cubeReady
  && measured.cube.mounted==='true'
  && measured.cube.canvas
  && measured.cube.runtime45
  && measured.cube.runtimeGlobal
  && measured.cube.runtimeReady
  && measured.cube.visible
  && measured.hero.titleInside
  && measured.overflow===0
  && measured.brokenImages.length===0
  && pageErrors.length===0
  && requestFailures.length===0
  && criticalBad.length===0
  && fatalConsole.length===0;

fs.writeFileSync(`${OUT}/mobile-gate.json`,JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
try{
  await page.screenshot({path:`${MEDIA}/00-mobile-gate-en-390x844.png`,fullPage:false,timeout:30000,animations:'disabled'});
}catch(error){
  fs.appendFileSync(`${OUT}/mobile-gate.json`,'\n');
  console.error('Mobile gate screenshot failed after measurements:',String(error));
  result.pass=false;
}
await context.close();await browser.close();
if(!result.pass)process.exit(1);
