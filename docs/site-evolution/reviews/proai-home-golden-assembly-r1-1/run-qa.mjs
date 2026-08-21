import { chromium } from 'playwright';
import fs from 'node:fs';

const PRODUCT_SHA = process.env.PRODUCT_SHA;
const OUT = 'docs/site-evolution/reviews/proai-home-golden-assembly-r1-1';
const MEDIA = `${OUT}/media`;
fs.mkdirSync(MEDIA, { recursive: true });

const viewports = [
  ['1440x900',1440,900],['1366x768',1366,768],['1024x768',1024,768],
  ['430x932',430,932],['393x852',393,852],['390x844',390,844],
  ['375x812',375,812],['320x568',320,568],['844x390',844,390],['932x430',932,430]
];

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']
});

const report = {
  productSha: PRODUCT_SHA,
  generatedAt: new Date().toISOString(),
  viewports: { en:{}, ru:{} },
  components: {},
  connected: {},
  financialStream: {},
  screenshots: [],
  failures: []
};

function fail(label, detail='') {
  const item = detail ? `${label}: ${detail}` : label;
  if (!report.failures.includes(item)) report.failures.push(item);
}

async function openPage(lang, width, height, options={}) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    hasTouch: !!options.hasTouch,
    isMobile: false,
    reducedMotion: 'no-preference'
  });
  const page = await context.newPage();
  const consoleMessages = [];
  const pageErrors = [];
  page.on('console', msg => {
    if (['warning','error'].includes(msg.type())) consoleMessages.push(`${msg.type()}: ${msg.text()}`);
  });
  page.on('pageerror', err => pageErrors.push(String(err)));
  await page.goto(`http://127.0.0.1:4173/${lang === 'ru' ? 'ru/' : ''}`, {
    waitUntil: 'domcontentloaded', timeout: 60000
  });
  await page.waitForTimeout(500);
  return { context, page, consoleMessages, pageErrors };
}

async function waitImages(page, selector) {
  try {
    await page.waitForFunction((sel) => [...document.querySelectorAll(sel)].every(img => img.complete && img.naturalWidth > 0), selector, { timeout: 8000 });
    return true;
  } catch {
    return false;
  }
}

async function structuralState(page) {
  return await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const overflow = Math.max(0, doc.scrollWidth - doc.clientWidth, body.scrollWidth - doc.clientWidth);
    const ids = [...document.querySelectorAll('[id]')].map(el => el.id).filter(Boolean);
    const dupIds = [...new Set(ids.filter((id,i) => ids.indexOf(id) !== i))];
    const major = [
      document.querySelector('#hero h1'),
      document.querySelector('[data-connected-system] h2'),
      document.querySelector('[data-tw-r2] h2'),
      document.querySelector('[data-home-tech-r2] h2'),
      document.querySelector('[data-fs-showcase-r11] h2')
    ].filter(Boolean);
    const clippedMajor = major.filter(el => {
      const r = el.getBoundingClientRect();
      return r.left < -2 || r.right > innerWidth + 2;
    }).map(el => el.textContent.trim().replace(/\s+/g,' ').slice(0,100));
    return {
      overflow,
      bodyOverflowX: getComputedStyle(body).overflowX,
      htmlOverflowX: getComputedStyle(doc).overflowX,
      siteHeader: document.querySelectorAll('header.site-header[data-site-header]').length,
      hero: document.querySelectorAll('#hero').length,
      connected: document.querySelectorAll('[data-connected-system]').length,
      twoWorlds: document.querySelectorAll('[data-tw-r2][data-tw-golden-r1]').length,
      embeddedTechnology: document.querySelectorAll('[data-tw-tech-r2], .tw-tech-r2').length,
      standaloneTechnology: document.querySelectorAll('[data-home-tech-r2]').length,
      techMarks: document.querySelectorAll('[data-home-tech-r2] .home-tech-r2__identity').length,
      financialStream: document.querySelectorAll('[data-fs-showcase-r11]').length,
      oldFinancial: document.querySelectorAll('#section-trigger').length,
      coreSplit: document.querySelectorAll('#core-split').length,
      footer: document.querySelectorAll('footer[data-footer-watermark-r2]').length,
      oldTwRuntime: [...document.scripts].filter(s => /homepage-two-worlds-r2(?:1|2)?\.js/.test(s.src)).map(s=>s.src),
      clippedMajor,
      dupIds
    };
  });
}

async function viewportCheck(lang, name, width, height) {
  const {context,page,consoleMessages,pageErrors} = await openPage(lang,width,height);
  const fsRoot = page.locator('[data-fs-showcase-r11]');
  if (await fsRoot.count()) {
    await fsRoot.scrollIntoViewIfNeeded();
    try { await page.waitForFunction(() => document.querySelector('[data-fs-showcase-r11]')?.classList.contains('is-live'), { timeout: 3500 }); } catch {}
    await waitImages(page, '[data-fs-showcase-r11] img');
  }
  const state = await structuralState(page);
  const fsImages = await page.evaluate(() => {
    const root=document.querySelector('[data-fs-showcase-r11]');
    if(!root)return {primary:false,secondary:false};
    const p=root.querySelector('.home-fs-showcase-r11__primary img');
    const s=root.querySelector('.home-fs-showcase-r11__secondary img');
    return {
      live:root.classList.contains('is-live'),
      primary:!!(p&&p.complete&&p.naturalWidth>0),
      secondary:!!(s&&s.complete&&s.naturalWidth>0)
    };
  });
  state.fsImages = fsImages;
  state.pageErrors = pageErrors;
  state.consoleWarnings = consoleMessages.filter(x => /ProAI|Financial|Cube|Technology|Two Worlds|Connected/i.test(x));
  state.pass = state.overflow===0 && state.siteHeader===1 && state.hero===1 && state.connected===1 &&
    state.twoWorlds===1 && state.embeddedTechnology===0 && state.standaloneTechnology===1 && state.techMarks===10 &&
    state.financialStream===1 && state.oldFinancial===0 && state.coreSplit===0 && state.footer===1 &&
    state.oldTwRuntime.length===0 && state.clippedMajor.length===0 && state.dupIds.length===0 &&
    fsImages.live && fsImages.primary && fsImages.secondary && pageErrors.length===0;
  report.viewports[lang][name]=state;
  if(!state.pass) fail(`viewport:${lang}:${name}`, JSON.stringify(state));
  await context.close();
}

for (const lang of ['en','ru']) {
  for (const [name,w,h] of viewports) await viewportCheck(lang,name,w,h);
}

// Header: real mobile open/close cycle.
{
  const {context,page,pageErrors}=await openPage('en',390,844,{hasTouch:true});
  const toggle=page.locator('.site-header__menu-toggle');
  let open=false, closed=false;
  if(await toggle.count()){
    await toggle.click();
    await page.waitForTimeout(120);
    open=await page.evaluate(()=>{
      const t=document.querySelector('.site-header__menu-toggle');
      const n=document.querySelector('.site-header__nav');
      return t?.getAttribute('aria-expanded')==='true'&&n?.classList.contains('is-open')&&document.body.classList.contains('menu-open');
    });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);
    closed=await page.evaluate(()=>{
      const t=document.querySelector('.site-header__menu-toggle');
      const n=document.querySelector('.site-header__nav');
      return t?.getAttribute('aria-expanded')==='false'&&!n?.classList.contains('is-open')&&!document.body.classList.contains('menu-open');
    });
  }
  report.components.header={open,closed,pageErrors,pass:open&&closed&&pageErrors.length===0};
  if(!report.components.header.pass)fail('header:mobile-menu',JSON.stringify(report.components.header));
  await context.close();
}

// Cube: boot + pointer drag/release on laptop; touch pointer cycle on mobile.
{
  const {context,page,consoleMessages,pageErrors}=await openPage('en',1366,768);
  let ready=false;
  try{
    await page.waitForFunction(()=>window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime?.ready===true&&document.querySelector('.proai-hero-object-slot')?.dataset.cubeMounted==='true',{timeout:22000});
    ready=true;
  }catch{}
  let dragRelease=false;
  if(ready){
    const canvas=page.locator('#cube-canvas');
    const box=await canvas.boundingBox();
    if(box){
      await page.mouse.move(box.x+box.width*.48,box.y+box.height*.48);
      await page.mouse.down();
      await page.mouse.move(box.x+box.width*.62,box.y+box.height*.39,{steps:8});
      await page.mouse.up();
      await page.waitForTimeout(700);
      dragRelease=await page.evaluate(()=>!!(window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime?.ready&&document.querySelector('#cube-canvas')&&document.querySelector('.proai-hero-object-slot')?.dataset.cubeMounted==='true'));
    }
  }
  report.components.cube={ready,dragRelease,pageErrors,consoleWarnings:consoleMessages,pass:ready&&dragRelease&&pageErrors.length===0};
  if(!report.components.cube.pass)fail('cube:boot-drag-release',JSON.stringify(report.components.cube));
  await context.close();

  const touch=await openPage('en',390,844,{hasTouch:true});
  let touchReady=false,touchRelease=false;
  try{
    await touch.page.waitForFunction(()=>window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime?.ready===true&&document.querySelector('.proai-hero-object-slot')?.dataset.cubeMounted==='true',{timeout:22000});
    touchReady=true;
  }catch{}
  if(touchReady){
    const canvas=touch.page.locator('#cube-canvas');
    const box=await canvas.boundingBox();
    if(box){
      const x=box.x+box.width*.5,y=box.y+box.height*.5;
      await canvas.dispatchEvent('pointerdown',{pointerId:21,pointerType:'touch',clientX:x,clientY:y,isPrimary:true,buttons:1});
      await canvas.dispatchEvent('pointermove',{pointerId:21,pointerType:'touch',clientX:x+42,clientY:y-28,isPrimary:true,buttons:1});
      await canvas.dispatchEvent('pointerup',{pointerId:21,pointerType:'touch',clientX:x+42,clientY:y-28,isPrimary:true,buttons:0});
      await touch.page.waitForTimeout(500);
      touchRelease=await touch.page.evaluate(()=>!!(window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime?.ready&&document.querySelector('#cube-canvas')));
    }
  }
  report.components.cube.touch={ready:touchReady,release:touchRelease,pass:touchReady&&touchRelease};
  if(!report.components.cube.touch.pass)fail('cube:touch-release',JSON.stringify(report.components.cube.touch));
  await touch.context.close();
}

// Connected autonomous cadence: observer exists before page scripts execute.
{
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
  const page=await context.newPage();
  await page.addInitScript(()=>{
    window.__csActiveEvents=[];
    window.__csSeenAuto=new Set();
    const observer=new MutationObserver(records=>{
      for(const record of records){
        const el=record.target;
        if(!el?.matches?.('[data-system-stage]')||!el.classList.contains('is-active'))continue;
        const section=el.closest('[data-connected-system]');
        if(!section)continue;
        const index=[...section.querySelectorAll('[data-system-stage]')].indexOf(el);
        if(index<0||window.__csSeenAuto.has(index))continue;
        window.__csSeenAuto.add(index);
        window.__csActiveEvents.push({index,at:performance.now()});
      }
    });
    observer.observe(document,{subtree:true,attributes:true,attributeFilter:['class']});
  });
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded',timeout:60000});
  await page.locator('[data-connected-system]').scrollIntoViewIfNeeded();
  try{await page.waitForFunction(()=>window.__csActiveEvents?.length>=4,{timeout:9500});}catch{}
  const events=await page.evaluate(()=>window.__csActiveEvents||[]);
  const cadence=events.slice(1).map((e,i)=>+(e.at-events[i].at).toFixed(1));
  const pass=events.length===4&&cadence.length===3&&cadence.every(v=>v>=1840&&v<=1960);
  report.connected.autonomous={events,cadence,pass};
  if(!pass)fail('connected:autonomous-cadence',JSON.stringify(report.connected.autonomous));
  await context.close();
}

// Connected pointer interaction after autonomous sequence settles.
{
  const {context,page}=await openPage('en',1440,900);
  await page.locator('[data-connected-system]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(7600);
  const stage=page.locator('[data-system-stage]').nth(1);
  const start=Date.now();
  await stage.hover();
  await page.waitForTimeout(20);
  const animationDurations=await page.evaluate(()=>{
    const section=document.querySelector('[data-connected-system]');
    const nodes=[section?.querySelector('.cs-spine-catch'),section?.querySelector('.cs-light-carriage')].filter(Boolean);
    return nodes.flatMap(n=>n.getAnimations().map(a=>Number(a.effect?.getTiming?.().duration||0))).filter(Boolean);
  });
  let activeLatency=null;
  try{
    await page.waitForFunction(()=>document.querySelectorAll('[data-system-stage]')[1]?.classList.contains('is-active'),{timeout:700});
    activeLatency=Date.now()-start;
  }catch{}
  const transferDuration=animationDurations.find(v=>v>=430&&v<=500)??null;
  const pass=activeLatency!==null&&activeLatency<=220&&transferDuration!==null;
  report.connected.interaction={activeLatencyMs:activeLatency,animationDurations,transferDurationMs:transferDuration,pass};
  if(!pass)fail('connected:pointer-interaction',JSON.stringify(report.connected.interaction));
  await context.close();
}

// Two Worlds: desktop AI / neutral / Web and mobile THE TURN.
{
  const {context,page}=await openPage('en',1440,900);
  const viewport=page.locator('[data-tw-viewport]');
  await viewport.scrollIntoViewIfNeeded();
  const box=await viewport.boundingBox();
  let ai=null,neutral=null,web=null;
  if(box){
    await page.mouse.move(box.x+box.width*.20,box.y+box.height*.5);await page.waitForTimeout(220);ai=await page.locator('[data-tw-r2]').getAttribute('data-focus');
    await page.mouse.move(box.x+box.width*.50,box.y+box.height*.5);await page.waitForTimeout(220);neutral=await page.locator('[data-tw-r2]').getAttribute('data-focus');
    await page.mouse.move(box.x+box.width*.80,box.y+box.height*.5);await page.waitForTimeout(220);web=await page.locator('[data-tw-r2]').getAttribute('data-focus');
  }
  report.components.twoWorlds={desktop:{ai,neutral,web}};
  await context.close();

  const mobile=await openPage('en',390,844,{hasTouch:true});
  await mobile.page.evaluate(()=>{
    const exp=document.querySelector('[data-tw-experience]');
    if(!exp)return;
    const r=exp.getBoundingClientRect();
    const top=r.top+scrollY;
    const travel=Math.max(1,r.height-innerHeight);
    scrollTo(0,top+travel*.5);
  });
  await mobile.page.waitForTimeout(350);
  const mobileTurn=await mobile.page.locator('[data-tw-r2]').getAttribute('data-focus');
  report.components.twoWorlds.mobileTurn=mobileTurn;
  report.components.twoWorlds.pass=ai==='ai'&&neutral==='neutral'&&web==='web'&&mobileTurn==='turn';
  if(!report.components.twoWorlds.pass)fail('two-worlds:states',JSON.stringify(report.components.twoWorlds));
  await mobile.context.close();
}

// Technology one-shot assembly.
{
  const {context,page}=await openPage('en',1366,768);
  const tech=page.locator('[data-home-tech-r2]');
  await tech.scrollIntoViewIfNeeded();
  try{await page.waitForFunction(()=>document.querySelector('[data-home-tech-r2]')?.dataset.techR2State==='settled',{timeout:2600});}catch{}
  const state=await tech.getAttribute('data-tech-r2-state');
  const marks=await page.locator('[data-home-tech-r2] .home-tech-r2__identity').count();
  report.components.technology={state,marks,pass:state==='settled'&&marks===10};
  if(!report.components.technology.pass)fail('technology:settle',JSON.stringify(report.components.technology));
  await context.close();
}

// Financial Stream integration geometry + full mobile asset.
{
  const {context,page}=await openPage('en',1440,900);
  const fsRoot=page.locator('[data-fs-showcase-r11]');
  await fsRoot.scrollIntoViewIfNeeded();
  try{await page.waitForFunction(()=>document.querySelector('[data-fs-showcase-r11]')?.classList.contains('is-live'),{timeout:3500});}catch{}
  await waitImages(page,'[data-fs-showcase-r11] img');
  await page.waitForTimeout(950);
  const desktop=await page.evaluate(()=>{
    const root=document.querySelector('[data-fs-showcase-r11]');
    const p=root?.querySelector('.home-fs-showcase-r11__primary');
    const s=root?.querySelector('.home-fs-showcase-r11__secondary');
    const img=s?.querySelector('img');
    if(!root||!p||!s||!img)return null;
    const pr=p.getBoundingClientRect(),sr=s.getBoundingClientRect(),ir=img.getBoundingClientRect();
    const overlapW=Math.max(0,Math.min(pr.right,sr.right)-Math.max(pr.left,sr.left));
    const naturalRatio=img.naturalWidth/img.naturalHeight;
    const renderedRatio=ir.width/ir.height;
    return {
      primary:{x:pr.x,y:pr.y,width:pr.width,height:pr.height,right:pr.right,bottom:pr.bottom},
      secondary:{x:sr.x,y:sr.y,width:sr.width,height:sr.height,right:sr.right,bottom:sr.bottom},
      primaryToSecondaryWidth:+(pr.width/sr.width).toFixed(3),
      overlapFraction:+(overlapW/pr.width).toFixed(3),
      naturalRatio:+naturalRatio.toFixed(4),renderedRatio:+renderedRatio.toFixed(4),
      fullMobileAsset:Math.abs(renderedRatio-naturalRatio)/naturalRatio<.035,
      live:root.classList.contains('is-live')
    };
  });
  if(desktop){
    desktop.primaryDominant=desktop.primaryToSecondaryWidth>=3.5;
    desktop.criticalCenterClear=desktop.overlapFraction<=.22;
    desktop.pass=desktop.live&&desktop.primaryDominant&&desktop.fullMobileAsset&&desktop.criticalCenterClear;
  }
  report.financialStream.desktop=desktop;
  if(!desktop?.pass)fail('financial-stream:desktop',JSON.stringify(desktop));
  await context.close();

  const mobile=await openPage('en',390,844,{hasTouch:true});
  const mroot=mobile.page.locator('[data-fs-showcase-r11]');
  await mroot.scrollIntoViewIfNeeded();
  try{await mobile.page.waitForFunction(()=>document.querySelector('[data-fs-showcase-r11]')?.classList.contains('is-live'),{timeout:3500});}catch{}
  await waitImages(mobile.page,'[data-fs-showcase-r11] img');
  await mobile.page.waitForTimeout(950);
  const m=await mobile.page.evaluate(()=>{
    const root=document.querySelector('[data-fs-showcase-r11]');
    const stage=root?.querySelector('.home-fs-showcase-r11__stage');
    const p=root?.querySelector('.home-fs-showcase-r11__primary');
    const s=root?.querySelector('.home-fs-showcase-r11__secondary');
    const img=s?.querySelector('img');
    if(!root||!stage||!p||!s||!img)return null;
    const rr=root.getBoundingClientRect(),tr=stage.getBoundingClientRect(),pr=p.getBoundingClientRect(),sr=s.getBoundingClientRect(),ir=img.getBoundingClientRect();
    const naturalRatio=img.naturalWidth/img.naturalHeight,renderedRatio=ir.width/ir.height;
    return {
      sectionHeight:+rr.height.toFixed(2),screenRatio:+(rr.height/innerHeight).toFixed(3),
      stageWidth:+tr.width.toFixed(2),primaryWidth:+pr.width.toFixed(2),secondaryWidth:+sr.width.toFixed(2),
      secondaryStageWidthPct:+(sr.width/tr.width*100).toFixed(2),primaryToSecondaryWidth:+(pr.width/sr.width).toFixed(3),
      secondaryHeight:+sr.height.toFixed(2),naturalRatio:+naturalRatio.toFixed(4),renderedRatio:+renderedRatio.toFixed(4),
      fullMobileAsset:Math.abs(renderedRatio-naturalRatio)/naturalRatio<.035,
      live:root.classList.contains('is-live')
    };
  });
  if(m){
    m.secondary=true;
    m.geometryLocked=m.secondaryStageWidthPct>=24.5&&m.secondaryStageWidthPct<=27.5;
    m.tinyPhoneEffect=m.secondaryHeight<190;
    m.sectionLengthApprox135=m.screenRatio>=1.15&&m.screenRatio<=1.55;
    m.pass=m.live&&m.primaryToSecondaryWidth>=3.4&&m.fullMobileAsset&&m.geometryLocked&&!m.tinyPhoneEffect&&m.sectionLengthApprox135;
  }
  report.financialStream.mobile390=m;
  if(!m?.pass)fail('financial-stream:mobile-390',JSON.stringify(m));
  await mobile.context.close();
}

// Footer desktop response / mobile quiet state.
{
  const {context,page}=await openPage('en',1366,768);
  const footer=page.locator('footer[data-footer-watermark-r2]');
  await footer.scrollIntoViewIfNeeded();
  const box=await footer.boundingBox();
  if(box)await page.mouse.move(box.x+Math.min(box.width-30,box.width*.72),box.y+Math.min(box.height-30,box.height*.45));
  await page.waitForTimeout(250);
  const desktop=await page.evaluate(()=>({count:document.querySelectorAll('footer[data-footer-watermark-r2]').length,active:document.querySelector('footer[data-footer-watermark-r2]')?.dataset.footerActive||null}));
  report.components.footer={desktop,pass:desktop.count===1};
  if(!report.components.footer.pass)fail('footer:desktop',JSON.stringify(desktop));
  await context.close();
}

async function screenshotViewport(lang,width,height,name,scrollSelector=null){
  const {context,page}=await openPage(lang,width,height,{hasTouch:width<=600});
  if(scrollSelector){
    const loc=page.locator(scrollSelector);
    if(await loc.count()){
      await loc.scrollIntoViewIfNeeded();
      await page.waitForTimeout(900);
    }
  }
  const file=`${MEDIA}/${name}.png`;
  await page.screenshot({path:file,fullPage:false});
  report.screenshots.push(file);
  await context.close();
}

async function screenshotBoundary(lang,width,height,name,upperSel,lowerSel){
  const {context,page}=await openPage(lang,width,height);
  const lower=page.locator(lowerSel);
  await lower.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const data=await page.evaluate(([a,b])=>{
    const A=document.querySelector(a),B=document.querySelector(b);if(!A||!B)return null;
    const ar=A.getBoundingClientRect(),br=B.getBoundingClientRect();
    const boundary=(ar.bottom+br.top)/2+scrollY;
    return {y:Math.max(0,boundary-innerHeight*.5),height:innerHeight};
  },[upperSel,lowerSel]);
  const file=`${MEDIA}/${name}.png`;
  if(data) await page.screenshot({path:file,clip:{x:0,y:data.y,width,height:Math.min(data.height,900)}});
  else await page.screenshot({path:file,fullPage:false});
  report.screenshots.push(file);
  await context.close();
}

async function screenshotElement(lang,width,height,name,selector){
  const {context,page}=await openPage(lang,width,height,{hasTouch:width<=600});
  const el=page.locator(selector);
  await el.scrollIntoViewIfNeeded();
  try{if(selector.includes('fs-showcase'))await page.waitForFunction(()=>document.querySelector('[data-fs-showcase-r11]')?.classList.contains('is-live'),{timeout:3500});}catch{}
  await page.waitForTimeout(1100);
  const file=`${MEDIA}/${name}.png`;
  await el.screenshot({path:file});
  report.screenshots.push(file);
  await context.close();
}

await screenshotViewport('en',1440,900,'01-en-1440-hero-top');
await screenshotViewport('en',1366,768,'02-en-1366-laptop');
await screenshotBoundary('en',1440,900,'03-connected-to-two-worlds','[data-connected-system]','[data-tw-r2]');
await screenshotBoundary('en',1440,900,'04-two-worlds-to-technology','[data-tw-r2]','[data-home-tech-r2]');
await screenshotBoundary('en',1440,900,'05-technology-to-financial-stream','[data-home-tech-r2]','[data-fs-showcase-r11]');
await screenshotElement('en',1440,900,'06-financial-stream-desktop','[data-fs-showcase-r11]');
await screenshotViewport('en',390,844,'07-financial-stream-390x844','[data-fs-showcase-r11]');
await screenshotElement('en',1366,768,'08-footer','footer[data-footer-watermark-r2]');
await screenshotViewport('ru',1366,768,'09-ru-1366-representative');
await screenshotViewport('en',844,390,'10-en-844x390-landscape','[data-fs-showcase-r11]');

report.components.headerPass=report.components.header?.pass===true;
report.components.heroPass=Object.values(report.viewports.en).every(v=>v.hero===1)&&Object.values(report.viewports.ru).every(v=>v.hero===1);
report.components.connectedPass=report.connected.autonomous?.pass===true&&report.connected.interaction?.pass===true;
report.components.twoWorldsPass=report.components.twoWorlds?.pass===true;
report.components.technologyPass=report.components.technology?.pass===true;
report.components.financialStreamPass=report.financialStream.desktop?.pass===true&&report.financialStream.mobile390?.pass===true;
report.components.footerPass=report.components.footer?.pass===true;
report.allViewportsPass=['en','ru'].every(lang=>Object.values(report.viewports[lang]).every(v=>v.pass));
report.horizontalOverflowMax=Math.max(...['en','ru'].flatMap(lang=>Object.values(report.viewports[lang]).map(v=>v.overflow||0)));
report.pass=report.failures.length===0;

fs.writeFileSync(`${OUT}/qa-report.json`,JSON.stringify(report,null,2));
await browser.close();

if(!report.pass){
  console.error('Golden R1.1 QA failures:',report.failures.join(' | '));
  process.exit(1);
}
console.log('Golden R1.1 QA PASS');
