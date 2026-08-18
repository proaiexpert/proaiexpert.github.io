const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const ROOT = process.env.OWNER_ROOT || '_owner_root';
const BASE = process.env.REVIEW_BASE || 'http://127.0.0.1:8080';
const CHROME = process.env.CHROME || '/usr/bin/google-chrome';
const candidates = JSON.parse(fs.readFileSync('docs/site-evolution/two-worlds-candidate-recovery-r1/candidates.json','utf8')).candidates;
const sleep = ms => new Promise(r => setTimeout(r, ms));

function mkdir(p){ fs.mkdirSync(p,{recursive:true}); }
function out(v,n){ const d=path.join(ROOT,'media',`v${v}`); mkdir(d); return path.join(d,n); }
function ffmpeg(frames, dest, fps=10){
  cp.execFileSync('ffmpeg',['-y','-loglevel','error','-framerate',String(fps),'-i',path.join(frames,'frame-%04d.jpg'),'-c:v','libx264','-profile:v','high','-level','4.0','-pix_fmt','yuv420p','-movflags','+faststart','-crf','22',dest]);
}
async function pageSetup(browser,w,h,mobile=false){
  const page=await browser.newPage();
  await page.setViewport({width:w,height:h,deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
  page.on('pageerror',e=>console.error('PAGEERROR',e.message));
  return page;
}
async function gotoCandidate(page,v,lang='en'){
  const suffix=lang==='ru'?'ru/':'';
  await page.goto(`${BASE}/variants/v${v}/${suffix}`,{waitUntil:'networkidle2',timeout:120000});
  await page.evaluate(async()=>{ if(document.fonts) await document.fonts.ready; document.documentElement.style.scrollBehavior='auto'; });
  await page.waitForSelector('[data-tw-r2],[data-tw-r1]',{timeout:30000});
}
async function sectionInfo(page){
  return page.evaluate(()=>{
    const s=document.querySelector('[data-tw-r2],[data-tw-r1]');
    const exp=s.querySelector('.tw-r2__experience,[data-tw-field]')||s;
    const sr=s.getBoundingClientRect(), er=exp.getBoundingClientRect();
    return {top:sr.top+scrollY,height:sr.height,expTop:er.top+scrollY,expHeight:er.height,viewport:innerHeight};
  });
}
async function scrollToSection(page){
  await page.evaluate(()=>{ const s=document.querySelector('[data-tw-r2],[data-tw-r1]'); s.scrollIntoView({block:'start'}); });
  await sleep(700);
}
async function hoverWorld(page,world){
  const sel=`[data-tw-world="${world}"]`;
  const el=await page.$(sel); if(!el) throw new Error(`Missing ${sel}`);
  const b=await el.boundingBox(); if(!b) throw new Error(`No bounds ${sel}`);
  await page.mouse.move(Math.round(b.x+b.width*.5),Math.round(b.y+b.height*.52),{steps:10});
}
async function neutral(page){ await page.mouse.move(5,5,{steps:8}); await sleep(650); }
async function shot(page,file){ await page.screenshot({path:file,type:'jpeg',quality:91,fullPage:false}); }
async function overflow(page){ return page.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth)); }
async function desktopEvidence(browser,c){
  const v=c.variant, page=await pageSetup(browser,1440,900,false); await gotoCandidate(page,v,'en'); await scrollToSection(page); await neutral(page);
  await shot(page,out(v,'desktop-neutral.jpg'));
  await hoverWorld(page,'ai'); await sleep(950); await shot(page,out(v,'desktop-ai.jpg'));
  await neutral(page); await hoverWorld(page,'web'); await sleep(950); await shot(page,out(v,'desktop-web.jpg')); await neutral(page);
  const frameDir=out(v,'desktop-frames'); mkdir(frameDir);
  await scrollToSection(page); await neutral(page);
  let next=Date.now();
  for(let i=0;i<100;i++){
    if(i===20) await hoverWorld(page,'ai');
    if(i===43) await neutral(page);
    if(i===60) await hoverWorld(page,'web');
    if(i===83) await neutral(page);
    await shot(page,path.join(frameDir,`frame-${String(i).padStart(4,'0')}.jpg`));
    next+=100; const d=next-Date.now(); if(d>0) await sleep(d);
  }
  ffmpeg(frameDir,out(v,'desktop.mp4')); fs.rmSync(frameDir,{recursive:true,force:true});
  const ov=await overflow(page); await page.close(); return {desktopOverflowPx:ov};
}
async function mobileBounds(page){
  const i=await sectionInfo(page);
  const start=Math.max(0,i.expTop-8);
  const end=Math.max(start,Math.min(i.top+i.height-i.viewport,i.expTop+i.expHeight-i.viewport+8));
  return {start,end};
}
async function mobileEvidence(browser,c){
  const v=c.variant, page=await pageSetup(browser,390,844,true); await gotoCandidate(page,v,'ru');
  const b=await mobileBounds(page); await page.evaluate(y=>scrollTo(0,y),b.start); await sleep(800); await shot(page,out(v,'mobile-ai.jpg'));
  const mid=Math.round((b.start+b.end)/2); await page.evaluate(y=>scrollTo(0,y),mid); await sleep(700); await shot(page,out(v,'mobile-turn.jpg'));
  await page.evaluate(y=>scrollTo(0,y),b.end); await sleep(800); await shot(page,out(v,'mobile-web.jpg'));
  const frameDir=out(v,'mobile-frames'); mkdir(frameDir); let next=Date.now();
  for(let i=0;i<80;i++){
    const t=i/79, ease=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2, y=Math.round(b.start+(b.end-b.start)*ease);
    await page.evaluate(y=>scrollTo(0,y),y);
    await shot(page,path.join(frameDir,`frame-${String(i).padStart(4,'0')}.jpg`));
    next+=100; const d=next-Date.now(); if(d>0) await sleep(d);
  }
  ffmpeg(frameDir,out(v,'mobile.mp4')); fs.rmSync(frameDir,{recursive:true,force:true});
  const ov=await overflow(page); await page.close(); return {portraitOverflowPx:ov};
}
async function landscapeEvidence(browser,c){
  const v=c.variant, page=await pageSetup(browser,844,390,true); await gotoCandidate(page,v,'ru'); const b=await mobileBounds(page);
  await page.evaluate(y=>scrollTo(0,y),b.start); await sleep(750); await shot(page,out(v,'landscape-ai.jpg'));
  await page.evaluate(y=>scrollTo(0,y),b.end); await sleep(750); await shot(page,out(v,'landscape-web.jpg'));
  const ov=await overflow(page); await page.close(); return {landscapeOverflowPx:ov};
}
async function technologyEvidence(browser,c){
  const v=c.variant, page=await pageSetup(browser,1440,900,false); await gotoCandidate(page,v,'en');
  const tech='[data-tw-tech-r2],[data-tw-tech],.tw-tech-r1';
  const el=await page.$(tech); if(!el) throw new Error(`Variant ${v}: Technology missing`);
  await page.evaluate(sel=>document.querySelector(sel).scrollIntoView({block:'center'}),tech); await sleep(600); await shot(page,out(v,'technology.jpg'));
  const q=await page.evaluate(sel=>{
    const e=document.querySelector(sel),imgs=[...e.querySelectorAll('img')],boxes=imgs.map(x=>x.getBoundingClientRect());
    return {images:imgs.length,widths:boxes.map(b=>Math.round(b.width)),overflow:Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth)};
  },tech);
  if(q.images<10) throw new Error(`Variant ${v}: Technology has ${q.images} marks, expected >=10`);
  if(q.widths.some(w=>w<14||w>180)) throw new Error(`Variant ${v}: Technology sizing suspect ${q.widths.join(',')}`);
  await page.close(); return {technology:q};
}
(async()=>{
  mkdir(path.join(ROOT,'media'));
  const browser=await puppeteer.launch({headless:true,executablePath:CHROME,args:['--no-sandbox','--disable-dev-shm-usage','--font-render-hinting=none']});
  const summary={browser:'system Google Chrome',zoom:'100%',deviceScaleFactor:1,candidates:{}};
  for(const c of candidates){
    console.log(`CAPTURE variant ${c.variant} ${c.version}`);
    const d=await desktopEvidence(browser,c), m=await mobileEvidence(browser,c), l=await landscapeEvidence(browser,c), t=await technologyEvidence(browser,c);
    const qa={...d,...m,...l,...t,status:(d.desktopOverflowPx||m.portraitOverflowPx||l.landscapeOverflowPx||t.technology.overflow)?'FAIL':'PASS'};
    fs.writeFileSync(out(c.variant,'qa.json'),JSON.stringify(qa,null,2));
    if(qa.status!=='PASS') throw new Error(`Variant ${c.variant} overflow QA failed: ${JSON.stringify(qa)}`);
    summary.candidates[`v${c.variant}`]=qa;
  }
  await browser.close(); fs.writeFileSync(path.join(ROOT,'capture-summary.json'),JSON.stringify(summary,null,2));
  console.log('CAPTURE_MATRIX=PASS');
})().catch(e=>{console.error(e);process.exit(1)});
