import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.env.PROAI_SEMANTIC_PROTOTYPE_DIR || path.dirname(fileURLToPath(import.meta.url));
const REVIEW = path.join(ROOT, 'review');
const INTERNAL = path.join(ROOT, 'review-internal');
const OUT = path.join(ROOT, 'STATIC_QA.json');
const GLB = path.join(ROOT, 'rubik_39_s_cube_animation.glb');
const BASE_URL = process.env.PROAI_SEMANTIC_DISPLAY_R1_URL || 'http://127.0.0.1:4173/';
const VIEWPORT = { width: 1440, height: 1440 };
fs.rmSync(REVIEW, { recursive: true, force: true });
fs.rmSync(INTERNAL, { recursive: true, force: true });
fs.mkdirSync(REVIEW, { recursive: true });
fs.mkdirSync(INTERNAL, { recursive: true });

const paths = {
  mechanical: path.join(REVIEW, '01-mechanical-baseline.png'),
  aiExpert: path.join(REVIEW, '02-ai-expert-unified-face.png'),
  trust: path.join(REVIEW, '03-trust-unified-face.png'),
  response: path.join(REVIEW, '04-response-unified-face.png'),
  ruObrashenie: path.join(REVIEW, '05-ru-obrashenie.png'),
  ruResult: path.join(REVIEW, '06-ru-rezultat.png'),
  largeAngle: path.join(REVIEW, '07-large-angle-semantic.png'),
  transition: path.join(REVIEW, '08-segmentation-return-transition.png'),
  darkSide: path.join(REVIEW, '09-dark-side-semantic.png'),
  recovered: path.join(REVIEW, '10-interaction-recovered.png'),
  enContact: path.join(REVIEW, 'semantic-contact-sheet-en.png'),
  ruContact: path.join(REVIEW, 'semantic-contact-sheet-ru.png'),
};

const browser = await chromium.launch({ headless: true, args: ['--enable-webgl','--ignore-gpu-blocklist','--use-angle=swiftshader'] });
const context = await browser.newContext();
const requests=[]; const pageErrors=[]; const consoleErrors=[];
context.on('request', r => requests.push(r.url()));
function wire(page){ page.on('pageerror',e=>pageErrors.push(String(e))); page.on('console',m=>{if(m.type()==='error') consoleErrors.push(m.text());}); }
function quatAngle(a,b){const dot=Math.min(1,Math.abs(a.reduce((s,v,i)=>s+v*b[i],0)));return 2*Math.acos(dot);}
function url(lang='en', mode='capture'){ const u=new URL(BASE_URL); u.searchParams.set(mode,'1'); u.searchParams.set('lang',lang); return u.toString(); }
async function open(lang='en', mode='capture'){
  const page=await context.newPage(); await page.setViewportSize(VIEWPORT); wire(page);
  await page.goto(url(lang,mode),{waitUntil:'networkidle',timeout:120000});
  await page.waitForFunction(()=>window.__PROAI_CUBE_SEMANTIC_R1?.ready && window.__PROAI_CUBE_SEMANTIC_R1?.semanticReady,null,{timeout:120000});
  await page.evaluate(()=>{ const api=window.__PROAI_CUBE_SEMANTIC_R1; api.stopSliceScheduler(); const e=document.querySelector('.status'); if(e)e.style.display='none'; });
  await page.waitForFunction(()=>window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics().activeTurns.length===0,null,{timeout:15000});
  return page;
}
async function findReadablePose(page,target,preferred=null){
  const offsets=[0,.2,-.2,.4,-.4,.6,-.6,.8,-.8,1,-1,1.25,-1.25,1.5,-1.5,2,-2,2.5,-2.5,3,-3,4,-4,5,-5,6,-6,8,-8,10,-10];
  for(const off of offsets){
    const t=Math.max(0,target+off);
    const c=await page.evaluate(({t,f})=>{ const api=window.__PROAI_CUBE_SEMANTIC_R1; api.clearReviewSemantic(false); api.setReviewPresentation(t,1,false); const face=api.selectSemanticFace(f,false); return face?{time:t,face}:null; },{t,f:preferred});
    if(c) return c;
  }
  throw new Error(`No gated readable semantic face near ${target}`);
}
async function mechanicalShot(page,file,time){ await page.evaluate(t=>{const a=window.__PROAI_CUBE_SEMANTIC_R1;a.clearReviewSemantic(false);a.setReviewPresentation(t,1,false);a.renderReviewFrame();},time); await page.screenshot({path:file}); }
async function semanticShot(page,file,{target,word,surface=1,text=1,preferred=null}){
  const pose=await findReadablePose(page,target,preferred);
  const result=await page.evaluate(({t,w,s,tx,f})=>{ const a=window.__PROAI_CUBE_SEMANTIC_R1; a.setReviewPresentation(t,1,false); const prep=a.prepareReviewSemantic(w,f); if(!prep) return null; a.setReviewSemanticVisual(s,tx,false); a.renderReviewFrame(); return {prep,diag:a.getDiagnostics()}; },{t:pose.time,w:word,s:surface,tx:text,f:pose.face.faceKey});
  if(!result) throw new Error(`Could not prepare ${word} at safe pose ${pose.time}`);
  await page.screenshot({path:file});
  return {word,requestedTime:target,resolvedTime:pose.time,faceKey:pose.face.faceKey,visibilityDot:pose.face.visibilityDot,projectedArea:pose.face.projectedArea,orientationDeg:result.prep.orientation.orientationDeg,fit:result.prep.fit};
}
function contact(inputs,out,width=540){ const td=path.join(INTERNAL,`tile-${path.basename(out,'.png')}`); fs.rmSync(td,{recursive:true,force:true});fs.mkdirSync(td,{recursive:true});inputs.forEach((s,i)=>fs.copyFileSync(s,path.join(td,`${i+1}.png`))); const p=spawnSync('ffmpeg',['-y','-v','error','-framerate','1','-i',path.join(td,'%d.png'),'-vf',`scale=${width}:${width},tile=${inputs.length}x1`,'-frames:v','1',out],{encoding:'utf8'}); if(p.status!==0)throw new Error(p.stderr||'contact failed'); }

const en=await open('en');
const initial=await en.evaluate(()=>window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics());
const mechanicalQA=await en.evaluate(()=>window.__PROAI_CUBE_SEMANTIC_R1.runAutomatedQA());
const stringFitQA=await en.evaluate(()=>window.__PROAI_CUBE_SEMANTIC_R1.runSemanticStringFitQA());
const anchorQA=await en.evaluate(()=>window.__PROAI_CUBE_SEMANTIC_R1.runSemanticFaceAnchorQA());
await en.waitForFunction(()=>window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics().activeTurns.length===0,null,{timeout:20000});
await mechanicalShot(en,paths.mechanical,2.8);
const screenshotQA=[];
screenshotQA.push(await semanticShot(en,paths.aiExpert,{target:2,word:'AI EXPERT'}));
screenshotQA.push(await semanticShot(en,paths.trust,{target:17.2,word:'TRUST'}));
screenshotQA.push(await semanticShot(en,paths.response,{target:29.1,word:'RESPONSE'}));
screenshotQA.push(await semanticShot(en,paths.largeAngle,{target:18.25,word:'INQUIRY'}));
screenshotQA.push(await semanticShot(en,paths.transition,{target:24.2,word:'INQUIRY',surface:.34,text:0}));
screenshotQA.push(await semanticShot(en,paths.darkSide,{target:14.9,word:'RESULT'}));
await mechanicalShot(en,paths.recovered,35.7);
const contactEn=[];
for(const [i,w] of ['AI EXPERT','TRUST','INQUIRY','RESPONSE','RESULT'].entries()){ const f=path.join(INTERNAL,`contact-en-${i+1}.png`); screenshotQA.push(await semanticShot(en,f,{target:[2,17.2,23.2,29,36][i],word:w})); contactEn.push(f); }
contact(contactEn,paths.enContact);

const lookdev={};
for(const variant of ['smokedGraphite','blackChrome','balancedSmokedChrome']){
  const pose=await findReadablePose(en,23.2);
  const d=await en.evaluate(({variant,t,f})=>{ const a=window.__PROAI_CUBE_SEMANTIC_R1;a.clearReviewSemantic(false);a.setReviewPresentation(t,1,false);a.prepareReviewSemantic('AI EXPERT',f);a.setSemanticLookVariant(variant);a.setReviewSemanticVisual(1,1,false);a.renderReviewFrame();return a.getDiagnostics();},{variant,t:pose.time,f:pose.face.faceKey});
  const f=path.join(INTERNAL,`look-${variant}.png`); await en.screenshot({path:f}); lookdev[variant]={file:f,faceKey:d.semantic.faceKey,time:pose.time};
}
await en.evaluate(()=>{const a=window.__PROAI_CUBE_SEMANTIC_R1;a.clearReviewSemantic(false);a.setSemanticLookVariant('balancedSmokedChrome');});
const perf=await en.evaluate(()=>{const a=window.__PROAI_CUBE_SEMANTIC_R1;const frames=24;const st=performance.now();for(let i=0;i<frames;i++){a.setReviewPresentation(23.2+i*.05,1,false);a.renderReviewFrame();}const totalMs=performance.now()-st;const d=a.getDiagnostics();return{frames,totalMs,avgRenderMs:totalMs/frames,renderer:d.renderer,textTexture:{width:a.semanticConfig.text.textureWidth,height:a.semanticConfig.text.textureHeight}};});
await en.close();

const ru=await open('ru');
screenshotQA.push(await semanticShot(ru,paths.ruObrashenie,{target:24.5,word:'ОБРАЩЕНИЕ'}));
screenshotQA.push(await semanticShot(ru,paths.ruResult,{target:32,word:'РЕЗУЛЬТАТ'}));
const contactRu=[];
for(const [i,w] of ['AI EXPERT','ДОВЕРИЕ','ОБРАЩЕНИЕ','ОТВЕТ','РЕЗУЛЬТАТ'].entries()){ const f=path.join(INTERNAL,`contact-ru-${i+1}.png`); screenshotQA.push(await semanticShot(ru,f,{target:[2,17.2,23.2,29,36][i],word:w})); contactRu.push(f); }
contact(contactRu,paths.ruContact);
await ru.close();

const interaction=await open('en','capture');
const box=await interaction.evaluate(()=>{const r=document.getElementById('cube-canvas').getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};});
const semanticStarted=await interaction.evaluate(()=>window.__PROAI_CUBE_SEMANTIC_R1.beginSemanticQA('RESPONSE'));
if(!semanticStarted) throw new Error('Could not begin semantic interaction QA');
await interaction.waitForTimeout(650);
const before=await interaction.evaluate(()=>window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics());
const cameraBefore=await interaction.evaluate(()=>window.__PROAI_CUBE_SEMANTIC_R1.getCameraSnapshot());
const x0=box.x+box.width*.5,y0=box.y+box.height*.5;
await interaction.mouse.move(x0,y0);await interaction.mouse.down();await interaction.mouse.move(x0+140,y0-24,{steps:8});
const during=await interaction.evaluate(()=>window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics());
const cameraAfterDrag=await interaction.evaluate(()=>window.__PROAI_CUBE_SEMANTIC_R1.getCameraSnapshot());
await interaction.evaluate(()=>window.__PROAI_CUBE_SEMANTIC_R1.advanceReviewSemanticExit(400,false));
const cleared=await interaction.evaluate(()=>window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics());
await interaction.mouse.up();
const after=await interaction.evaluate(()=>window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics());
const cameraAfterRelease=await interaction.evaluate(()=>window.__PROAI_CUBE_SEMANTIC_R1.getCameraSnapshot());
await interaction.waitForTimeout(600);
const cameraAfterSettled=await interaction.evaluate(()=>window.__PROAI_CUBE_SEMANTIC_R1.getCameraSnapshot());
const cameraMoved=quatAngle(cameraBefore.quaternion,cameraAfterDrag.quaternion)>1e-5;
const cameraNoSnap=quatAngle(cameraAfterRelease.quaternion,cameraAfterSettled.quaternion)<1e-6;
const semanticInteractionPass=before.semantic.phase!=='idle'&&during.interaction.interactionActive&&during.semantic.phase==='exitFast'&&cleared.semantic.phase==='idle'&&cleared.semantic.surfaceOpacity===0&&cleared.semantic.textOpacity===0&&!after.interaction.interactionActive&&cameraMoved&&cameraNoSnap;
await interaction.waitForTimeout(2250);
const manualSlice=await interaction.evaluate(()=>window.__PROAI_CUBE_SEMANTIC_R1.turnSlice({axis:'X',layer:1,direction:1,durationMs:1320}));
if(!manualSlice) throw new Error('Could not start interaction slice');
await interaction.waitForTimeout(100);await interaction.mouse.move(x0,y0);await interaction.mouse.down();await interaction.mouse.move(x0-120,y0+16,{steps:8});
const mechanicalDuring=await interaction.evaluate(()=>window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics());
await interaction.waitForFunction(()=>window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics().activeTurns.length===0,null,{timeout:12000});
const finished=await interaction.evaluate(()=>window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics());
const blocked=await interaction.evaluate(()=>window.__PROAI_CUBE_SEMANTIC_R1.turnSlice({axis:'Y',layer:0,direction:-1,durationMs:1200}));
await interaction.mouse.up();
const mechanicalInteractionPass=mechanicalDuring.interaction.interactionActive&&finished.lastTurnResult?.endpointErrorRad===0&&blocked===false;
await interaction.close();

const reducedContext=await browser.newContext({reducedMotion:'reduce'}); const reducedPage=await reducedContext.newPage(); await reducedPage.goto(url('en','capture'),{waitUntil:'networkidle',timeout:120000}); await reducedPage.waitForFunction(()=>window.__PROAI_CUBE_SEMANTIC_R1?.semanticReady,null,{timeout:120000}); const reduced=await reducedPage.evaluate(()=>window.__PROAI_CUBE_SEMANTIC_R1.getDiagnostics().semantic.scheduler); await reducedContext.close();

const glbSha=crypto.createHash('sha256').update(fs.readFileSync(GLB)).digest('hex');
const out={generatedAt:new Date().toISOString(),initial,mechanicalQA,stringFitQA,anchorQA,screenshotQA,lookdev,performanceDiagnostic:perf,interaction:{semanticInteractionPass,mechanicalInteractionPass,cameraMoved,cameraNoSnap,cameraBefore,cameraAfterDrag,cameraAfterRelease,cameraAfterSettled,before,during,cleared,after},reducedMotion:{schedulerEnabled:reduced.enabled,automaticCyclingDisabled:reduced.reducedMotionAutomaticCycling===false,pass:reduced.enabled===false},runtime:{pageErrors,consoleErrors,forbiddenSplineRequests:requests.filter(u=>/@splinetool|prod\.spline\.design|\.splinecode/i.test(u))},glb:{sha256:glbSha,bytes:fs.statSync(GLB).size}};
fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
await browser.close();
if(!stringFitQA.pass||!anchorQA.pass||!semanticInteractionPass||!mechanicalInteractionPass||!out.reducedMotion.pass||pageErrors.length||consoleErrors.length||out.runtime.forbiddenSplineRequests.length) throw new Error(`Static semantic QA failed ${JSON.stringify({stringFit:stringFitQA.pass,anchor:anchorQA.pass,semanticInteractionPass,mechanicalInteractionPass,reduced:out.reducedMotion.pass,pageErrors,consoleErrors})}`);
console.log(JSON.stringify({staticQA:'PASS',screenshots:screenshotQA.length,avgRenderMs:perf.avgRenderMs,cameraMoved,cameraNoSnap},null,2));
