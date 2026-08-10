import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const base=process.env.R5_BASE_URL||'http://127.0.0.1:4173';
const out=process.env.R5_OUT||'r5-owner-review';
const route='/hero-r5-webgl-proof/';
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
async function ready(page,url){const errs=[];page.on('pageerror',e=>errs.push(String(e)));await page.goto(url,{waitUntil:'networkidle'});await page.evaluate(async()=>{if(document.fonts?.ready)await document.fonts.ready;});await page.waitForFunction(()=>window.__r5Ready===true&&document.documentElement.classList.contains('hero-r5-ready'),null,{timeout:15000});await page.waitForTimeout(350);if(errs.length)throw new Error(errs.join(' | '));const d=await page.evaluate(()=>({gl:!!document.querySelector('[data-r5-canvas]')?.getContext('webgl2'),w:document.querySelector('[data-r5-canvas]')?.width,h:document.querySelector('[data-r5-canvas]')?.height,error:document.querySelector('[data-r5-canvas-wrap]')?.dataset.error||''}));if(!d.gl||d.w<100||d.h<100||d.error)throw new Error('R5 WebGL boot failed '+JSON.stringify(d));}
{
 const c=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});const p=await c.newPage();await ready(p,`${base}${route}?frame=5.35`);await p.screenshot({path:path.join(out,'R5_DESKTOP_STATIC.png')});await c.close();
}
{
 const c=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});const p=await c.newPage();await ready(p,`${base}${route}?frame=5.35`);await p.screenshot({path:path.join(out,'R5_MOBILE_STATIC.png')});await c.close();
}
const tmp=path.join(out,'.video');fs.mkdirSync(tmp,{recursive:true});let webm;
{
 const c=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,recordVideo:{dir:tmp,size:{width:1440,height:900}}});const p=await c.newPage();await ready(p,`${base}${route}`);const v=p.video();await p.waitForTimeout(13200);await p.close();webm=await v.path();await c.close();
}
await browser.close();
const mp4=path.join(out,'R5_DESKTOP_MOTION.mp4');const ff=spawnSync('ffmpeg',['-y','-i',webm,'-c:v','libx264','-preset','medium','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',mp4],{stdio:'inherit'});if(ff.status!==0)process.exit(ff.status??1);fs.rmSync(tmp,{recursive:true,force:true});
for(const f of ['R5_DESKTOP_STATIC.png','R5_DESKTOP_MOTION.mp4','R5_MOBILE_STATIC.png']){const p=path.join(out,f);if(!fs.existsSync(p)||fs.statSync(p).size<1000)throw new Error('Missing '+p);}console.log('R5 owner review complete');