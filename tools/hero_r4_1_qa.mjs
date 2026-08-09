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
const matrix = [
  [1728,1117],[1440,900],[1280,800],[1024,768],[768,1024],
  [430,932],[390,844],[375,812],[320,568],[844,390]
];

async function loadPage(context, route, query='') {
  const page = await context.newPage();
  await page.goto(`${base}${route}${query}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts?.ready);
  return page;
}

async function screenshot({name, route=routes.en, viewport, query='?mode=static', fullPage=false, reducedMotion='no-preference', javaScriptEnabled=true, wait=160}) {
  const context = await browser.newContext({ viewport, reducedMotion, javaScriptEnabled });
  const page = await loadPage(context, route, query);
  if (wait) await page.waitForTimeout(wait);
  await page.screenshot({ path: path.join(out, name), fullPage });
  const data = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight,
    motion: document.documentElement.classList.contains('hero-r41-motion'),
    debug: document.documentElement.classList.contains('hero-r41-debug-scene-edges'),
    rail: document.querySelectorAll('.hero-cshape__rail-item').length,
    cubeFaces: document.querySelectorAll('.site-header__cube-face').length,
    wordmark: document.querySelector('.site-header__wordmark')?.textContent?.replace(/\s+/g,' ').trim() || '',
    navDisplay: getComputedStyle(document.querySelector('.site-header__nav')).display,
    menuDisplay: getComputedStyle(document.querySelector('.site-header__menu-toggle')).display,
  }));
  await context.close();
  return data;
}

await screenshot({ name:'R41_EN_1440_STATIC.png', viewport:{width:1440,height:900} });
await screenshot({ name:'R41_EN_1440_HEADER_FULL.png', viewport:{width:1440,height:900} });
await screenshot({ name:'R41_RU_1440_STATIC.png', route:routes.ru, viewport:{width:1440,height:900} });
await screenshot({ name:'R41_EN_390.png', viewport:{width:390,height:844} });
await screenshot({ name:'R41_EN_390_FULL.png', viewport:{width:390,height:844}, fullPage:true });
await screenshot({ name:'R41_RU_390.png', route:routes.ru, viewport:{width:390,height:844} });
await screenshot({ name:'R41_RU_390_FULL.png', route:routes.ru, viewport:{width:390,height:844}, fullPage:true });
await screenshot({ name:'R41_EN_768x1024.png', viewport:{width:768,height:1024} });
await screenshot({ name:'R41_EN_844x390.png', viewport:{width:844,height:390} });
await screenshot({ name:'R41_EN_320x568.png', viewport:{width:320,height:568} });
await screenshot({ name:'R41_EN_1728x1117.png', viewport:{width:1728,height:1117} });
await screenshot({ name:'R41_EN_1280x800.png', viewport:{width:1280,height:800} });
await screenshot({ name:'R41_EN_1024x768.png', viewport:{width:1024,height:768} });
await screenshot({ name:'R41_EN_430x932.png', viewport:{width:430,height:932} });
await screenshot({ name:'R41_EN_375x812.png', viewport:{width:375,height:812} });

{
  const context = await browser.newContext({ viewport:{width:1440,height:900} });
  const page = await loadPage(context, routes.en, '');
  await page.waitForTimeout(2700);
  await page.screenshot({ path:path.join(out,'R41_EN_1440_MOTION_FRAME.png') });
  report.motion.frame = await page.evaluate(() => ({
    running: document.documentElement.classList.contains('is-signal-running'),
    processing: document.documentElement.classList.contains('is-processing'),
    activeRail: document.querySelectorAll('.hero-cshape__rail-item.is-active').length,
    animateMotionCount: document.querySelectorAll('animateMotion[data-r41-motion]').length,
    branchCount: document.querySelectorAll('.hero-cshape__branch').length,
  }));
  await context.close();
}

await screenshot({ name:'R41_DEBUG_SCENE_EDGES_390.png', viewport:{width:390,height:844}, query:'?mode=static&debug=scene-edges' });
await screenshot({ name:'R41_DEBUG_SCENE_EDGES_844x390.png', viewport:{width:844,height:390}, query:'?mode=static&debug=scene-edges' });

const reduced = await screenshot({ name:'R41_EN_1440_REDUCED.png', viewport:{width:1440,height:900}, query:'', reducedMotion:'reduce' });
report.motion.reduced = reduced;
const nojs = await screenshot({ name:'R41_EN_1440_NOJS.png', viewport:{width:1440,height:900}, query:'', javaScriptEnabled:false });
report.motion.nojs = nojs;

for (const [width,height] of matrix) {
  const context = await browser.newContext({ viewport:{width,height} });
  const page = await loadPage(context, routes.en, '?mode=static');
  const data = await page.evaluate(() => {
    const nav = document.querySelector('.site-header__nav');
    const menu = document.querySelector('.site-header__menu-toggle');
    const visual = document.querySelector('.hero-cshape__visual');
    const title = document.querySelector('.hero-cshape__title');
    const cta = document.querySelector('.hero-cshape__button--primary');
    const rail = document.querySelector('.hero-cshape__rail');
    const navRect = nav.getBoundingClientRect();
    const visualRect = visual.getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();
    const ctaRect = cta.getBoundingClientRect();
    const railRect = rail.getBoundingClientRect();
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      navDisplay: getComputedStyle(nav).display,
      navVisible: navRect.width > 0 && getComputedStyle(nav).visibility !== 'hidden',
      menuDisplay: getComputedStyle(menu).display,
      navCenterOffset: Math.round(((navRect.left + navRect.width/2) - innerWidth/2) * 100) / 100,
      visualWidth: Math.round(visualRect.width),
      visualLeft: Math.round(visualRect.left),
      visualRight: Math.round(visualRect.right),
      titleRight: Math.round(titleRect.right),
      ctaBottom: Math.round(ctaRect.bottom),
      railWidth: Math.round(railRect.width),
      railVisible: railRect.width > 0,
      cubeFaces: document.querySelectorAll('.site-header__cube-face').length,
      wordmark: document.querySelector('.site-header__wordmark')?.textContent?.replace(/\s+/g,' ').trim() || '',
    };
  });
  report.viewports[`${width}x${height}`] = data;
  if (data.overflowX !== 0) report.failures.push(`overflow ${width}x${height}: ${data.overflowX}px`);
  if (data.cubeFaces !== 6 || data.wordmark !== 'PROAI EXPERT') report.failures.push(`header identity ${width}x${height}`);
  if (width >= 1201 && data.menuDisplay !== 'none') report.failures.push(`desktop menu visible ${width}x${height}`);
  if (width >= 1201 && Math.abs(data.navCenterOffset) > 4) report.failures.push(`nav off-center ${width}x${height}: ${data.navCenterOffset}px`);
}

report.header.center_1440 = report.viewports['1440x900']?.navCenterOffset;
report.header.center_1728 = report.viewports['1728x1117']?.navCenterOffset;
report.header.full_nav_1440 = report.viewports['1440x900']?.menuDisplay === 'none' && report.viewports['1440x900']?.navVisible;
report.header.canonical_identity = report.viewports['1440x900']?.cubeFaces === 6 && report.viewports['1440x900']?.wordmark === 'PROAI EXPERT';

if (reduced.motion) report.failures.push('reduced-motion still enabled R4.1 motion class');
if (nojs.rail !== 4 || nojs.cubeFaces !== 6) report.failures.push('no-JS baseline incomplete');
if (report.motion.frame.animateMotionCount !== 4 || report.motion.frame.branchCount !== 4) report.failures.push('cinematic signal layers incomplete');

{
  const videoDir = path.join(out,'video-temp');
  fs.mkdirSync(videoDir,{recursive:true});
  const context = await browser.newContext({
    viewport:{width:1440,height:900},
    recordVideo:{ dir:videoDir, size:{width:1440,height:900} }
  });
  const page = await loadPage(context, routes.en, '');
  const video = page.video();
  await page.waitForTimeout(12150);
  await context.close();
  const webm = await video.path();
  const mp4 = path.join(out,'R41_CINEMATIC_SIGNAL_SEQUENCE.mp4');
  const ff = spawnSync('ffmpeg',['-y','-i',webm,'-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',mp4],{stdio:'inherit'});
  if (ff.status !== 0) report.failures.push('ffmpeg mp4 conversion failed');
}

fs.writeFileSync(path.join(out,'R41_QA_REPORT.json'), JSON.stringify(report,null,2));
await browser.close();

console.log(JSON.stringify(report,null,2));
if (report.failures.length) process.exitCode = 1;
