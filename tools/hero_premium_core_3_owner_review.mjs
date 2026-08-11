import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const base = process.env.CORE3_BASE_URL || 'http://127.0.0.1:4173';
const out = process.env.CORE3_OUT || 'premium-core-3-owner-review';
const routes = { en:'/hero-premium-core-3-preview/', ru:'/ru/hero-premium-core-3-preview/', r2en:'/hero-premium-core-2-preview/', production:'/' };
const screenshotTimeout = 120000;
fs.rmSync(out,{recursive:true,force:true}); fs.mkdirSync(out,{recursive:true});

const browser = await chromium.launch({ headless:true, args:['--enable-webgl','--ignore-gpu-blocklist','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });

async function ready(page, route, reducedMotion='no-preference', expectCore3=true) {
  const errors=[];
  page.on('console',msg=>{if(msg.type()==='error')errors.push(`console: ${msg.text()}`);});
  page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
  await page.emulateMedia({reducedMotion});
  await page.goto(`${base}${route}`,{waitUntil:'networkidle',timeout:90000});
  await page.evaluate(async()=>{if(document.fonts?.ready)await document.fonts.ready;});
  if(expectCore3){
    await page.waitForFunction(()=>document.documentElement.classList.contains('hero-core2--ready'),null,{timeout:45000});
    await page.waitForTimeout(500);
    if(errors.length)throw new Error(errors.join('\n'));
  } else await page.waitForTimeout(900);
}

async function captureStatic({locale='en',route,width,height,mobile=false,file,minVisualRatio=0,query='',reducedMotion='no-preference',expectCore3=true}){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
  const page=await context.newPage();
  const target=`${route||routes[locale]}${query?(query.startsWith('?')?query:`?${query}`):''}`;
  await ready(page,target,reducedMotion,expectCore3);
  const diagnostics=await page.evaluate(()=>{
    const visual=document.querySelector('[data-hero-core2-visual]'); const rect=visual?.getBoundingClientRect();
    const viewportVisible=rect?Math.max(0,Math.min(rect.bottom,innerHeight)-Math.max(rect.top,0)):0;
    const plates=[...document.querySelectorAll('.hero-core2__stage-button')].map(el=>{const r=el.getBoundingClientRect();return{width:Math.round(r.width),height:Math.round(r.height)};});
    const c=document.querySelector('[data-hero-core2-canvas]'); const gl=c?.getContext('webgl2');
    return {ready:document.documentElement.classList.contains('hero-core2--ready'),fallback:document.documentElement.classList.contains('hero-core2--fallback'),engine:document.documentElement.dataset.heroCore3||'',review:document.documentElement.dataset.heroCore2Review||'',scrollWidth:document.documentElement.scrollWidth,innerWidth,innerHeight,title:document.querySelector('.hero-core2__title')?.textContent?.trim()||'',stageLabels:[...document.querySelectorAll('.hero-core2__stage-label')].map(el=>el.textContent.trim()),activeStage:[...document.querySelectorAll('[data-hero-core2-stage]')].findIndex(el=>el.classList.contains('is-active')),plates,visual:rect?{top:Math.round(rect.top),bottom:Math.round(rect.bottom),height:Math.round(rect.height),viewportRatio:Number((viewportVisible/Math.max(rect.height,1)).toFixed(3))}:null,canvas:{width:c?.width||0,height:c?.height||0,webgl2:!!gl},debug:window.__heroCore3Debug?.getState?.()||null};
  });
  if(expectCore3){
    if(!diagnostics.ready||diagnostics.fallback||!diagnostics.canvas.webgl2)throw new Error(`${file}: WebGL2 R3 did not reach ready state`);
    if(diagnostics.engine!=='breakthrough-r1')throw new Error(`${file}: R3 engine marker missing`);
  }
  if(diagnostics.scrollWidth>diagnostics.innerWidth+1)throw new Error(`${file}: horizontal overflow ${diagnostics.scrollWidth} > ${diagnostics.innerWidth}`);
  if(minVisualRatio&&(diagnostics.visual?.viewportRatio||0)<minVisualRatio)throw new Error(`${file}: visual ratio ${(diagnostics.visual?.viewportRatio||0)} < ${minVisualRatio}`);
  await page.screenshot({path:path.join(out,file),fullPage:false,timeout:screenshotTimeout}); await context.close(); return diagnostics;
}

const diagnostics={};
diagnostics.r2Baseline=await captureStatic({route:routes.r2en,width:1440,height:900,file:'CORE2_BASELINE_EN_DESKTOP_1440x900.png',expectCore3:false});
diagnostics.productionBaseline=await captureStatic({route:routes.production,width:1440,height:900,file:'PRODUCTION_HERO_REFERENCE_1440x900.png',expectCore3:false});
diagnostics.gate1CoreOnly=await captureStatic({width:1440,height:900,file:'CORE3_GATE1_CORE_ONLY_1440x900.png',query:'review=core&stage=3&time=16'});
diagnostics.gate2Materials=await captureStatic({width:1440,height:900,file:'CORE3_GATE2_MATERIALS_1440x900.png',query:'review=materials&stage=3&time=16'});
diagnostics.enDesktop=await captureStatic({width:1440,height:900,file:'CORE3_EN_DESKTOP_1440x900.png',query:'stage=3&time=16'});
diagnostics.ruDesktop=await captureStatic({locale:'ru',width:1440,height:900,file:'CORE3_RU_DESKTOP_1440x900.png',query:'stage=3&time=16'});
diagnostics.enMobile=await captureStatic({width:390,height:844,mobile:true,file:'CORE3_EN_MOBILE_390x844.png',query:'stage=3&time=16',minVisualRatio:.50});
diagnostics.ruMobile=await captureStatic({locale:'ru',width:390,height:844,mobile:true,file:'CORE3_RU_MOBILE_390x844.png',query:'stage=3&time=16',minVisualRatio:.46});
diagnostics.enNarrow=await captureStatic({width:320,height:780,mobile:true,file:'CORE3_EN_MOBILE_320x780.png',query:'stage=3&time=16',minVisualRatio:.62});
diagnostics.enLandscape=await captureStatic({width:844,height:390,mobile:true,file:'CORE3_EN_LANDSCAPE_844x390.png',query:'stage=3&time=16',minVisualRatio:.70});
diagnostics.reducedMotion=await captureStatic({width:390,height:844,mobile:true,file:'CORE3_EN_REDUCED_MOTION_390x844.png',reducedMotion:'reduce',minVisualRatio:.48});
if(diagnostics.reducedMotion.activeStage!==3)throw new Error(`Reduced motion did not settle on RESULT: ${diagnostics.reducedMotion.activeStage}`);

const stageNames=['TRUST','INQUIRY','RESPONSE','RESULT']; diagnostics.stageStates=[];
for(let i=0;i<4;i++){
  const d=await captureStatic({width:1440,height:900,file:`CORE3_EN_STAGE_0${i+1}_${stageNames[i]}.png`,query:`stage=${i}&time=16`});
  if(d.activeStage!==i)throw new Error(`Stage ${i} mismatch: ${d.activeStage}`); diagnostics.stageStates.push(d);
}

await captureStatic({width:1440,height:900,file:'CORE3_MOTION_PROBE_T02.png',query:'review=core&stage=3&time=2'});
await captureStatic({width:1440,height:900,file:'CORE3_MOTION_PROBE_T16.png',query:'review=core&stage=3&time=16'});
const ssim=spawnSync('ffmpeg',['-i',path.join(out,'CORE3_MOTION_PROBE_T02.png'),'-i',path.join(out,'CORE3_MOTION_PROBE_T16.png'),'-lavfi','ssim','-f','null','-'],{encoding:'utf8'});
const ssimText=`${ssim.stdout||''}\n${ssim.stderr||''}`; const sm=ssimText.match(/All:([0-9.]+)/); diagnostics.coreOnlyMotionSSIM=sm?Number(sm[1]):null;
if(ssim.status!==0||diagnostics.coreOnlyMotionSSIM===null)throw new Error('Could not calculate Core motion SSIM');
if(diagnostics.coreOnlyMotionSSIM>0.985)throw new Error(`Core-only physical change too small: SSIM ${diagnostics.coreOnlyMotionSSIM}`);

const compare=spawnSync('ffmpeg',['-y','-i',path.join(out,'CORE2_BASELINE_EN_DESKTOP_1440x900.png'),'-i',path.join(out,'CORE3_EN_DESKTOP_1440x900.png'),'-filter_complex','hstack=inputs=2','-frames:v','1',path.join(out,'CORE2_VS_CORE3_SIDE_BY_SIDE_2880x900.png')],{stdio:'inherit'});
if(compare.status!==0)process.exit(compare.status??1);

const videoDir=path.join(out,'.video-tmp'); fs.mkdirSync(videoDir,{recursive:true}); let webmPath;
{
  const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,recordVideo:{dir:videoDir,size:{width:1440,height:900}}});
  const page=await context.newPage(); await ready(page,routes.en); const video=page.video();
  await page.evaluate(()=>{const m=document.createElement('div');m.id='core3-marker';Object.assign(m.style,{position:'fixed',inset:'0',background:'#fff',zIndex:'2147483647'});document.body.appendChild(m);});
  await page.waitForTimeout(220); await page.evaluate(()=>document.getElementById('core3-marker')?.remove()); await page.waitForTimeout(120);
  const stages=page.locator('[data-hero-core2-stage-button]');
  await stages.nth(0).click(); await page.waitForTimeout(5700);
  await stages.nth(1).click(); await page.waitForTimeout(6500);
  await stages.nth(2).click(); await page.waitForTimeout(6900);
  await stages.nth(3).click(); await page.waitForTimeout(10900);
  await page.close(); webmPath=await video.path(); await context.close();
}
await browser.close();

const statsPath=path.join(videoDir,'signalstats.txt');
const scan=spawnSync('ffmpeg',['-y','-i',webmPath,'-vf',`signalstats,metadata=print:file=${statsPath}`,'-an','-f','null','-'],{stdio:['ignore','ignore','inherit']}); if(scan.status!==0)process.exit(scan.status??1);
let currentPts=0,lastWhitePts=0;
for(const line of fs.readFileSync(statsPath,'utf8').split(/\r?\n/)){const tm=line.match(/pts_time:([0-9.]+)/);if(tm)currentPts=Number(tm[1]);const ym=line.match(/lavfi\.signalstats\.YAVG=([0-9.]+)/);if(ym&&Number(ym[1])>220)lastWhitePts=currentPts;}
const trimStart=Math.max(0,lastWhitePts+.08); diagnostics.motionTrimStartSeconds=Number(trimStart.toFixed(3));
const mp4=path.join(out,'CORE3_EN_DESKTOP_MOTION_30S.mp4');
const ff=spawnSync('ffmpeg',['-y','-ss',String(trimStart),'-i',webmPath,'-t','30','-c:v','libx264','-preset','medium','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',mp4],{stdio:'inherit'}); if(ff.status!==0)process.exit(ff.status??1); fs.rmSync(videoDir,{recursive:true,force:true});

fs.writeFileSync(path.join(out,'diagnostics.json'),JSON.stringify(diagnostics,null,2)+'\n');
const required=['CORE3_GATE1_CORE_ONLY_1440x900.png','CORE3_GATE2_MATERIALS_1440x900.png','CORE3_EN_DESKTOP_1440x900.png','CORE3_RU_DESKTOP_1440x900.png','CORE2_VS_CORE3_SIDE_BY_SIDE_2880x900.png','PRODUCTION_HERO_REFERENCE_1440x900.png','CORE3_EN_MOBILE_390x844.png','CORE3_RU_MOBILE_390x844.png','CORE3_EN_MOBILE_320x780.png','CORE3_EN_LANDSCAPE_844x390.png','CORE3_EN_REDUCED_MOTION_390x844.png',...stageNames.map((n,i)=>`CORE3_EN_STAGE_0${i+1}_${n}.png`),'CORE3_MOTION_PROBE_T02.png','CORE3_MOTION_PROBE_T16.png','CORE3_EN_DESKTOP_MOTION_30S.mp4','diagnostics.json'];
for(const file of required){const p=path.join(out,file);if(!fs.existsSync(p)||fs.statSync(p).size<(file.endsWith('.json')?100:1000))throw new Error(`Missing/empty output: ${p}`);}
console.log('Premium Core 3.0 owner-review package complete:',fs.readdirSync(out)); console.log('Core-only motion SSIM:',diagnostics.coreOnlyMotionSSIM);
