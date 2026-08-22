import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT='docs/site-evolution/reviews/proai-home-golden-assembly-r1-2';
const MEDIA=`${OUT}/media`;
const BASE=process.env.REVIEW_BASE||`http://127.0.0.1:4174/${OUT}/`;
const verifyOnly=process.argv.includes('--verify-only');
fs.mkdirSync(MEDIA,{recursive:true});

const critical=['bootstrap-golden-r1-2.js','source-final-motion-r2-touch-auto-45-r1.js','source-final-motion-r2.js','source-materials-r1.js','rubik_39_s_cube_animation.glb','three.module.min.js','GLTFLoader.js'];
const result={base:BASE,generatedAt:new Date().toISOString(),enMobile:{},ruMobile:{},enDesktop:{},ruDesktop:{},screenshots:[],pass:false};

async function open(browser,lang,w,h){
  const context=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,hasTouch:w<=600,reducedMotion:'no-preference'});
  const page=await context.newPage();
  page.setDefaultTimeout(10000);
  const pageErrors=[],consoleErrors=[],failed=[],bad=[];
  page.on('pageerror',e=>pageErrors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
  page.on('requestfailed',r=>{if(critical.some(n=>r.url().includes(n))||r.url().includes('raw.githack.com'))failed.push({url:r.url(),error:r.failure()?.errorText||'failed'})});
  page.on('response',r=>{if(r.status()>=400&&(critical.some(n=>r.url().includes(n))||r.url().includes('raw.githack.com')))bad.push({url:r.url(),status:r.status()})});
  await page.goto(`${BASE}index.html?lang=${lang}`,{waitUntil:'domcontentloaded',timeout:30000});
  await page.evaluate(()=>document.fonts?.ready).catch(()=>{});
  await page.waitForTimeout(220);
  return{context,page,pageErrors,consoleErrors,failed,bad};
}

async function waitCube(page){
  try{
    await page.waitForFunction(()=>document.querySelector('.proai-hero-object-slot')?.dataset.cubeMounted==='true'&&!!document.querySelector('#cube-canvas')&&window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime?.ready===true,null,{timeout:22000});
    return true;
  }catch{return false}
}

async function activateFinancial(page){
  await page.evaluate(()=>document.querySelector('.home-fs-showcase-r14')?.scrollIntoView({block:'center'}));
  try{await page.waitForFunction(()=>document.querySelector('.home-fs-showcase-r14')?.classList.contains('is-live'),null,{timeout:4000})}catch{}
  await page.waitForTimeout(1100);
}

async function scrollAll(page){
  for(const s of['#hero','[data-connected-system]','[data-tw-r2]','[data-home-tech-r2]','.home-fs-showcase-r14','.homepage-founder-proof','#insights','footer[data-footer-watermark-r2]']){
    await page.evaluate(sel=>document.querySelector(sel)?.scrollIntoView({block:'center'}),s);
    await page.waitForTimeout(150);
  }
}

async function state(page,mode){
  return page.evaluate(mode=>{
    const d=document.documentElement,b=document.body;
    const root=document.querySelector('.home-fs-showcase-r14');
    const stage=root?.querySelector('.home-fs-showcase-r11__stage');
    const primary=root?.querySelector('.home-fs-showcase-r11__primary');
    const secondary=root?.querySelector('.home-fs-showcase-r11__secondary');
    const pimg=primary?.querySelector('img');
    const simg=secondary?.querySelector('img');
    const ledger=root?.querySelector('.home-fs-showcase-r14__ledger');
    const validation=root?.querySelector('.home-fs-showcase-r11__validation');
    const quote=validation?.querySelector('blockquote');
    const actions=validation?.querySelector('.home-fs-showcase-r11__actions');
    const tw=document.querySelector('[data-tw-r2] .tw-r2__intro-title')?.getBoundingClientRect();
    const fh=root?.querySelector('h2')?.getBoundingClientRect();
    const rect=e=>e?.getBoundingClientRect?.()||null;
    const overlap=(a,b)=>!!a&&!!b&&Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top))>4;
    const fullImage=(fig,img)=>{
      if(!fig||!img||!img.naturalWidth||!img.naturalHeight)return false;
      const fr=rect(fig),ir=rect(img),natural=img.naturalWidth/img.naturalHeight,rendered=ir.height?ir.width/ir.height:0;
      return Math.abs(rendered-natural)/natural<.025&&ir.left>=fr.left-3&&ir.right<=fr.right+3&&ir.top>=fr.top-3&&ir.bottom<=fr.bottom+3;
    };
    const textRects=[root?.querySelector('.home-fs-showcase-r11__intro'),ledger,root?.querySelector('.home-fs-showcase-r11__proof'),validation].map(rect).filter(Boolean);
    const imageRects=[rect(primary),rect(secondary)].filter(Boolean);
    const textOverScreenshots=textRects.some(t=>imageRects.some(i=>overlap(t,i)));
    const stageR=rect(stage),ledgerR=rect(ledger),validationR=rect(validation),quoteR=rect(quote),actionsR=rect(actions);
    const tech=document.querySelector('[data-home-tech-r2]'),founder=document.querySelector('.homepage-founder-proof');
    const docRect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return{top:r.top+scrollY,bottom:r.bottom+scrollY,left:r.left,right:r.right,width:r.width,height:r.height}};
    const tr=docRect(tech),rr=docRect(root),fr=docRect(founder);
    const techGap=tr&&rr?rr.top-tr.bottom:null,founderGap=rr&&fr?fr.top-rr.bottom:null;
    const broken=[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.currentSrc||i.src);
    const html=document.documentElement.outerHTML;
    const financial={
      sectionCount:document.querySelectorAll('[data-fs-showcase-r11]').length,
      r14Count:document.querySelectorAll('.home-fs-showcase-r14').length,
      ledgerCount:document.querySelectorAll('.home-fs-showcase-r14__ledger').length,
      primaryFull:fullImage(primary,pimg),
      primaryObjectFit:pimg?getComputedStyle(pimg).objectFit:null,
      secondaryFull:fullImage(secondary,simg),
      textOverClientScreenshots:textOverScreenshots,
      ledgerOutsideScreenshots:!!stageR&&!!ledgerR&&ledgerR.top>=stageR.bottom-3,
      testimonialImageOverlap:!!validationR&&imageRects.some(i=>overlap(validationR,i)),
      testimonialInternalOverlap:overlap(quoteR,actionsR),
      context:{technologyGap:techGap,founderGap,technologyOverlap:techGap!==null&&techGap<-3,founderOverlap:founderGap!==null&&founderGap<-3,badBlankGap:[techGap,founderGap].some(g=>g!==null&&g>160),founderInFlow:!!fr&&getComputedStyle(founder).position!=='fixed'&&fr.left>=-3&&fr.right<=innerWidth+3}
    };
    financial.pass=financial.sectionCount===1&&financial.r14Count===1&&financial.ledgerCount===1&&!financial.textOverClientScreenshots&&financial.ledgerOutsideScreenshots&&!financial.testimonialImageOverlap&&!financial.testimonialInternalOverlap&&!financial.context.technologyOverlap&&!financial.context.founderOverlap&&!financial.context.badBlankGap&&financial.context.founderInFlow&&(mode==='desktop'?(financial.primaryFull&&financial.primaryObjectFit==='contain'):financial.secondaryFull);
    return{
      cubeMounted:document.querySelector('.proai-hero-object-slot')?.dataset.cubeMounted||null,
      cubeCanvas:!!document.querySelector('#cube-canvas'),
      runtimeReady:window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime?.ready===true,
      overflow:Math.max(0,d.scrollWidth-d.clientWidth,b.scrollWidth-d.clientWidth),
      embeddedTechnology:document.querySelectorAll('[data-tw-tech-r2],.tw-tech-r2').length,
      standaloneTechnology:document.querySelectorAll('[data-home-tech-r2]').length,
      oldCoreSplit:document.querySelectorAll('#core-split').length,
      oldFinancial:document.querySelectorAll('#section-trigger').length,
      twoWorldsHeadingInside:!!tw&&tw.left>=-2&&tw.right<=innerWidth+2,
      financialHeadingInside:!!fh&&fh.left>=-2&&fh.right<=innerWidth+2,
      brokenImages:broken,
      malformedDataUrl:/raw\.githack[^"' ]*["']data:/i.test(html)||/raw\.githack[^"' ]*\/data:image/i.test(html),
      financial
    };
  },mode);
}

async function inspect(browser,lang,w,h,mode,key){
  const x=await open(browser,lang,w,h);
  const cube=await waitCube(x.page);
  await scrollAll(x.page);
  await activateFinancial(x.page);
  const s=await state(x.page,mode);
  const out={...s,cubeVisible:cube,pageErrors:x.pageErrors,consoleErrors:x.consoleErrors,failed:x.failed,badResponses:x.bad};
  out.pass=cube&&s.cubeMounted==='true'&&s.cubeCanvas&&s.runtimeReady&&s.overflow===0&&s.embeddedTechnology===0&&s.standaloneTechnology===1&&s.oldCoreSplit===0&&s.oldFinancial===0&&s.twoWorldsHeadingInside&&s.financialHeadingInside&&s.brokenImages.length===0&&!s.malformedDataUrl&&s.financial.pass&&x.pageErrors.length===0&&x.failed.length===0&&x.bad.length===0;
  result[key]=out;
  await x.context.close();
  return out.pass;
}

async function shotSection(page,sel,file){
  await page.evaluate(s=>document.querySelector(s)?.scrollIntoView({block:'center'}),sel);
  await page.waitForTimeout(300);
  await page.locator(sel).screenshot({path:`${MEDIA}/${file}`,animations:'disabled'});
  result.screenshots.push(`media/${file}`);
}

async function shotContext(page,startSel,endSel,file){
  const clip=await page.evaluate(([a,b])=>{
    const x=document.querySelector(a),y=document.querySelector(b);if(!x||!y)return null;
    const xr=x.getBoundingClientRect(),yr=y.getBoundingClientRect(),top=Math.max(0,xr.top+scrollY-70),bottom=Math.min(document.documentElement.scrollHeight,yr.bottom+scrollY+70),height=Math.min(1500,Math.max(280,bottom-top));
    return{x:0,y:top,width:innerWidth,height};
  },[startSel,endSel]);
  if(!clip)throw new Error(`context selectors missing: ${startSel} -> ${endSel}`);
  await page.screenshot({path:`${MEDIA}/${file}`,clip,animations:'disabled'});
  result.screenshots.push(`media/${file}`);
}

async function screenshots(browser){
  let x=await open(browser,'en',1440,900);await waitCube(x.page);await scrollAll(x.page);await activateFinancial(x.page);await x.page.screenshot({path:`${MEDIA}/01-golden-desktop-en-1440x900.png`,fullPage:true,animations:'disabled'});result.screenshots.push('media/01-golden-desktop-en-1440x900.png');await shotSection(x.page,'.home-fs-showcase-r14','05-financial-stream-r14-desktop-en-1440x900.png');await shotContext(x.page,'[data-home-tech-r2]','.home-fs-showcase-r14','08-technology-to-financial-r14-1440x900.png');await shotContext(x.page,'.home-fs-showcase-r14','.homepage-founder-proof','09-financial-r14-to-founder-1440x900.png');await shotSection(x.page,'footer[data-footer-watermark-r2]','10-footer-lower-page-1440x900.png');await x.context.close();
  x=await open(browser,'ru',1440,900);await waitCube(x.page);await scrollAll(x.page);await activateFinancial(x.page);await x.page.screenshot({path:`${MEDIA}/02-golden-desktop-ru-1440x900.png`,fullPage:true,animations:'disabled'});result.screenshots.push('media/02-golden-desktop-ru-1440x900.png');await x.context.close();
  x=await open(browser,'en',390,844);await waitCube(x.page);await scrollAll(x.page);await activateFinancial(x.page);await x.page.screenshot({path:`${MEDIA}/03-golden-mobile-en-390x844.png`,fullPage:true,animations:'disabled'});result.screenshots.push('media/03-golden-mobile-en-390x844.png');await shotSection(x.page,'.home-fs-showcase-r14','06-financial-stream-r14-mobile-en-390x844.png');await x.context.close();
  x=await open(browser,'ru',390,844);await waitCube(x.page);await scrollAll(x.page);await activateFinancial(x.page);await x.page.screenshot({path:`${MEDIA}/04-golden-mobile-ru-390x844.png`,fullPage:true,animations:'disabled'});result.screenshots.push('media/04-golden-mobile-ru-390x844.png');await shotSection(x.page,'.home-fs-showcase-r14','07-financial-stream-r14-mobile-ru-390x844.png');await x.context.close();
}

const browser=await chromium.launch({headless:true,args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const checks=[];
checks.push(await inspect(browser,'en',390,844,'mobile','enMobile'));
checks.push(await inspect(browser,'ru',390,844,'mobile','ruMobile'));
checks.push(await inspect(browser,'en',1440,900,'desktop','enDesktop'));
checks.push(await inspect(browser,'ru',1440,900,'desktop','ruDesktop'));
if(!verifyOnly)await screenshots(browser);
await browser.close();
result.pass=checks.every(Boolean);
if(!verifyOnly)fs.writeFileSync(`${OUT}/owner-review-check.json`,JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
if(!result.pass)process.exit(1);
