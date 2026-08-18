const puppeteer=require('puppeteer-core');
const fs=require('fs');
const path=require('path');
const CHROME=process.env.CHROME||'/usr/bin/google-chrome';
const BASE='http://127.0.0.1:8302';
const OUT='docs/site-evolution/two-worlds-product-resurrection-r2/_probe';
fs.mkdirSync(OUT,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function prep(page,url){
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForSelector('[data-tw-r2]',{timeout:45000});
  await page.evaluate(async()=>{
    if(document.fonts) await document.fonts.ready;
    document.documentElement.style.scrollBehavior='auto';
    const sp=document.createElement('div');sp.id='__tw_capture_spacer';sp.style.height='180vh';sp.style.pointerEvents='none';document.body.appendChild(sp);
    const st=document.createElement('style');st.textContent='[id*="chatbase"],[class*="chatbase"],iframe[src*="chatbase"]{display:none!important}';document.head.appendChild(st);
  });
  await sleep(500);
}
async function geom(page){return page.evaluate(()=>{const s=document.querySelector('[data-tw-r2]'),e=s.querySelector('[data-tw-experience]'),v=s.querySelector('[data-tw-viewport]'),a=s.querySelector('[data-tw-world="ai"] .tw-r2__world-title'),w=s.querySelector('[data-tw-world="web"] .tw-r2__world-title');const r=x=>{const b=x.getBoundingClientRect();return {top:b.top,bottom:b.bottom,left:b.left,right:b.right,width:b.width,height:b.height}};return {scrollY,focus:s.dataset.focus,section:r(s),experience:r(e),viewport:r(v),aiTitle:r(a),webTitle:r(w),innerHeight,scrollHeight:document.documentElement.scrollHeight};});}
async function scrollDesktop(page){await page.evaluate(()=>{const e=document.querySelector('[data-tw-experience]');const y=e.getBoundingClientRect().top+scrollY-Math.max(40,(innerHeight-e.getBoundingClientRect().height)/2);scrollTo(0,y);});await sleep(650);}
async function hover(page,world){const el=await page.$(`[data-tw-world="${world}"]`);const b=await el.boundingBox();await page.mouse.move(b.x+b.width*(world==='ai'?.30:.75),b.y+b.height*.52,{steps:8});await sleep(850);}
async function mobileState(page,p){await page.evaluate(p=>{const e=document.querySelector('[data-tw-experience]');const abs=e.getBoundingClientRect().top+scrollY;const travel=Math.max(1,e.getBoundingClientRect().height-innerHeight);scrollTo(0,abs+travel*p);},p);await sleep(800);}
(async()=>{const browser=await puppeteer.launch({headless:true,executablePath:CHROME,args:['--no-sandbox','--disable-dev-shm-usage']});const report={};
let p=await browser.newPage();await p.setViewport({width:1440,height:900,deviceScaleFactor:1});await prep(p,BASE+'/');await scrollDesktop(p);report.desktopNeutral=await geom(p);await p.screenshot({path:path.join(OUT,'desktop-neutral.jpg'),type:'jpeg',quality:90});await hover(p,'ai');report.desktopAi=await geom(p);await p.screenshot({path:path.join(OUT,'desktop-ai.jpg'),type:'jpeg',quality:90});await hover(p,'web');report.desktopWeb=await geom(p);await p.screenshot({path:path.join(OUT,'desktop-web.jpg'),type:'jpeg',quality:90});await p.close();
p=await browser.newPage();await p.setViewport({width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true});await prep(p,BASE+'/ru/');await mobileState(p,0);report.mobileAi=await geom(p);await p.screenshot({path:path.join(OUT,'mobile-ai.jpg'),type:'jpeg',quality:90});await mobileState(p,.5);report.mobileTurn=await geom(p);await p.screenshot({path:path.join(OUT,'mobile-turn.jpg'),type:'jpeg',quality:90});await mobileState(p,1);report.mobileWeb=await geom(p);await p.screenshot({path:path.join(OUT,'mobile-web.jpg'),type:'jpeg',quality:90});await p.close();
fs.writeFileSync(path.join(OUT,'geometry.json'),JSON.stringify(report,null,2));await browser.close();console.log('GEOMETRY_PROBE=PASS');})().catch(e=>{console.error(e);process.exit(1)});
