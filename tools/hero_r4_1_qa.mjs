import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const base = process.env.R41_BASE_URL || 'http://127.0.0.1:4173';
const out = process.env.R41_OUT || 'r4-1-owner-review';
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ headless: true });
const report = { generated_at: new Date().toISOString(), viewports: {}, header: {}, motion: {}, failures: [] };
const routes = { en: '/hero-a-plus-c-shape-preview/', ru: '/ru/hero-a-plus-c-shape-preview/' };
const matrix = [[1728,1117],[1440,900],[1280,800],[1024,768],[768,1024],[430,932],[390,844],[375,812],[320,568],[844,390]];

async function open(context, route, query='') {
  const page = await context.newPage();
  await page.goto(`${base}${route}${query}`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
  await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
  return page;
}

async function shot({name, route=routes.en, viewport, query='?mode=static', fullPage=false, reducedMotion='no-preference', javaScriptEnabled=true, wait=180}) {
  const context = await browser.newContext({ viewport, reducedMotion, javaScriptEnabled });
  const page = await open(context, route, query);
  if (wait) await page.waitForTimeout(wait);
  await page.screenshot({ path:path.join(out,name), fullPage });
  const data = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight,
    r41Motion: document.documentElement.classList.contains('hero-r41-motion'),
    r41Static: document.documentElement.classList.contains('hero-r41-static'),
    debug: document.documentElement.classList.contains('hero-r41-debug-scene-edges'),
    railCount: document.querySelectorAll('.hero-cshape__rail-item').length,
    cubeFaces: document.querySelectorAll('.site-header__cube-face').length,
    wordmark: document.querySelector('.site-header__wordmark')?.textContent?.replace(/\s+/g,' ').trim() || '',
    sceneLoaded: !!document.querySelector('.hero-cshape__scene-picture img')?.naturalWidth,
    primaryCTA: !!document.querySelector('.hero-cshape__button--primary'),
  }));
  await context.close();
  return data;
}

// Owner-review stills.
await shot({name:'R41_EN_1440_STATIC.png',viewport:{width:1440,height:900}});
await shot({name:'R41_EN_1440_HEADER_FULL.png',viewport:{width:1440,height:900}});
await shot({name:'R41_RU_1440_STATIC.png',route:routes.ru,viewport:{width:1440,height:900}});
await shot({name:'R41_EN_390.png',viewport:{width:390,height:844}});
await shot({name:'R41_EN_390_FULL.png',viewport:{width:390,height:844},fullPage:true});
await shot({name:'R41_RU_390.png',route:routes.ru,viewport:{width:390,height:844}});
await shot({name:'R41_RU_390_FULL.png',route:routes.ru,viewport:{width:390,height:844},fullPage:true});
await shot({name:'R41_EN_768x1024.png',viewport:{width:768,height:1024}});
await shot({name:'R41_EN_844x390.png',viewport:{width:844,height:390}});
await shot({name:'R41_EN_320x568.png',viewport:{width:320,height:568}});
await shot({name:'R41_EN_1728x1117.png',viewport:{width:1728,height:1117}});
await shot({name:'R41_EN_1280x800.png',viewport:{width:1280,height:800}});
await shot({name:'R41_EN_1024x768.png',viewport:{width:1024,height:768}});
await shot({name:'R41_EN_430x932.png',viewport:{width:430,height:932}});
await shot({name:'R41_EN_375x812.png',viewport:{width:375,height:812}});

// Representative motion frame during output distribution.
{
  const context = await browser.newContext({viewport:{width:1440,height:900}});
  const page = await open(context,routes.en,'');
  await page.waitForTimeout(4250);
  await page.screenshot({path:path.join(out,'R41_EN_1440_MOTION_FRAME.png')});
  report.motion.frame = await page.evaluate(() => ({
    motionClass: document.documentElement.classList.contains('hero-r41-motion'),
    activeRail: document.querySelectorAll('.hero-cshape__rail-item.is-active').length,
    routeGuide: document.querySelectorAll('[data-r41-route]').length,
    haloLayers: document.querySelectorAll('[data-r41-halo]').length,
    coreLayers: document.querySelectorAll('[data-r41-core]').length,
    headGroups: document.querySelectorAll('[data-r41-head]').length,
    branches: document.querySelectorAll('[data-r41-branch]').length,
    nodes: document.querySelectorAll('[data-r41-node]').length,
    occluder: document.querySelectorAll('.hero-r41__occluder').length,
  }));
  await context.close();
}

// Debug-only edge inspection views.
await shot({name:'R41_DEBUG_SCENE_EDGES_390.png',viewport:{width:390,height:844},query:'?mode=static&debug=scene-edges'});
await shot({name:'R41_DEBUG_SCENE_EDGES_844x390.png',viewport:{width:844,height:390},query:'?mode=static&debug=scene-edges'});

const reduced = await shot({name:'R41_EN_1440_REDUCED.png',viewport:{width:1440,height:900},query:'',reducedMotion:'reduce'});
report.motion.reduced = reduced;
const nojs = await shot({name:'R41_EN_1440_NOJS.png',viewport:{width:1440,height:900},query:'',javaScriptEnabled:false});
report.motion.nojs = nojs;

// Responsive/header/overflow measurements.
for (const [width,height] of matrix) {
  const context = await browser.newContext({viewport:{width,height}});
  const page = await open(context,routes.en,'?mode=static');
  const data = await page.evaluate(() => {
    const rect = (selector) => document.querySelector(selector)?.getBoundingClientRect();
    const nav = document.querySelector('.site-header__nav');
    const menu = document.querySelector('.site-header__menu-toggle');
    const locale = document.querySelector('.site-header__locale');
    const headerCta = document.querySelector('.site-header__cta');
    const railItem = document.querySelector('.hero-cshape__rail-item');
    const navRect = nav.getBoundingClientRect();
    const visualRect = rect('.hero-cshape__visual');
    const titleRect = rect('.hero-cshape__title');
    const ctaRect = rect('.hero-cshape__button--primary');
    const railRect = rect('.hero-cshape__rail');
    const localeStyle = getComputedStyle(locale);
    const headerCtaStyle = getComputedStyle(headerCta);
    return {
      scrollWidth:document.documentElement.scrollWidth,
      clientWidth:document.documentElement.clientWidth,
      overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      navDisplay:getComputedStyle(nav).display,
      navVisibility:getComputedStyle(nav).visibility,
      menuDisplay:getComputedStyle(menu).display,
      navCenterOffset:Math.round(((navRect.left+navRect.width/2)-innerWidth/2)*100)/100,
      visualWidth:Math.round(visualRect?.width||0),
      visualLeft:Math.round(visualRect?.left||0),
      visualRight:Math.round(visualRect?.right||0),
      titleRight:Math.round(titleRect?.right||0),
      ctaBottom:Math.round(ctaRect?.bottom||0),
      railWidth:Math.round(railRect?.width||0),
      railFont:parseFloat(getComputedStyle(railItem).fontSize),
      cubeFaces:document.querySelectorAll('.site-header__cube-face').length,
      wordmark:document.querySelector('.site-header__wordmark')?.textContent?.replace(/\s+/g,' ').trim()||'',
      localeColor:localeStyle.color,
      localeShadow:localeStyle.textShadow,
      headerCtaBg:headerCtaStyle.backgroundColor,
      headerCtaShadow:headerCtaStyle.boxShadow,
      scenePictureCount:document.querySelectorAll('.hero-cshape__scene-picture').length,
    };
  });
  report.viewports[`${width}x${height}`]=data;
  if (data.overflowX!==0) report.failures.push(`overflow ${width}x${height}: ${data.overflowX}px`);
  if (data.cubeFaces!==6 || data.wordmark!=='PROAI EXPERT') report.failures.push(`header identity ${width}x${height}`);
  if (width>=1201 && data.menuDisplay!=='none') report.failures.push(`desktop hamburger visible ${width}x${height}`);
  if (width>=1201 && Math.abs(data.navCenterOffset)>3) report.failures.push(`nav off-center ${width}x${height}: ${data.navCenterOffset}px`);
  if (width<1201 && data.menuDisplay==='none') report.failures.push(`mobile/tablet hamburger missing ${width}x${height}`);
  if (width<=430 && height>540 && data.railFont<11.4) report.failures.push(`portrait rail too small ${width}x${height}: ${data.railFont}px`);
  if (width===390 && data.visualWidth < width*.82) report.failures.push(`390 scene too small: ${data.visualWidth}px`);
}

report.header.center_1440=report.viewports['1440x900']?.navCenterOffset;
report.header.center_1728=report.viewports['1728x1117']?.navCenterOffset;
report.header.full_nav_1440=report.viewports['1440x900']?.menuDisplay==='none' && report.viewports['1440x900']?.navVisibility!=='hidden';
report.header.canonical_identity=report.viewports['1440x900']?.cubeFaces===6 && report.viewports['1440x900']?.wordmark==='PROAI EXPERT';

if (reduced.r41Motion) report.failures.push('reduced motion still has R4.1 motion class');
if (nojs.railCount!==4 || nojs.cubeFaces!==6 || !nojs.sceneLoaded || !nojs.primaryCTA) report.failures.push('no-JS baseline incomplete');
const mf=report.motion.frame;
if (!mf.motionClass || mf.routeGuide!==1 || mf.haloLayers!==1 || mf.coreLayers!==1 || mf.headGroups!==1 || mf.branches!==4 || mf.nodes!==4 || mf.occluder!==1) report.failures.push('cinematic signal architecture incomplete');

// One full cinematic sequence.
{
  const videoDir=path.join(out,'video-temp'); fs.mkdirSync(videoDir,{recursive:true});
  const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:videoDir,size:{width:1440,height:900}}});
  const page=await open(context,routes.en,'');
  const video=page.video();
  await page.waitForTimeout(12050);
  await context.close();
  const webm=await video.path();
  const mp4=path.join(out,'R41_CINEMATIC_SIGNAL_SEQUENCE.mp4');
  const ff=spawnSync('ffmpeg',['-y','-i',webm,'-c:v','libx264','-preset','medium','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',mp4],{stdio:'inherit'});
  if (ff.status!==0) report.failures.push('ffmpeg mp4 conversion failed');
}

fs.writeFileSync(path.join(out,'R41_QA_REPORT.json'),JSON.stringify(report,null,2));
await browser.close();
console.log(JSON.stringify(report,null,2));
if (report.failures.length) process.exitCode=1;
