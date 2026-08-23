import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import fs from 'node:fs';

const OUT='docs/site-evolution/reviews/proai-home-golden-assembly-r1-2';
const MEDIA=`${OUT}/media`;
const BASE=process.env.REVIEW_BASE||`http://127.0.0.1:4176/${OUT}/`;
const PRODUCT_SHA='d5f562ac4c0c84b4ec06e913ec7e0f82d133beab';
const viewports=[
  [1920,1080],[1536,864],[1440,900],[1366,768],[1280,800],[1024,768],
  [430,932],[393,852],[390,844],[375,812],[320,568],
  [844,390],[932,430],[812,375],[852,393]
];
fs.mkdirSync(MEDIA,{recursive:true});
const report={productSha:PRODUCT_SHA,base:BASE,generatedAt:new Date().toISOString(),matrix:[],details:{},screenshots:[],pass:false};
const isTouch=(w,h)=>w<=600||(w<=980&&h<=540);
const critical=u=>u.includes('/assets/');

async function open(browser,lang,w,h,{touch=isTouch(w,h),reduced='no-preference'}={}){
  const context=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,hasTouch:touch,reducedMotion:reduced});
  const page=await context.newPage();
  page.setDefaultTimeout(45000);
  const errors=[],failed=[],bad=[],responses=new Map();
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('requestfailed',r=>{if(critical(r.url()))failed.push({url:r.url(),error:r.failure()?.errorText||'failed'});});
  page.on('response',r=>{responses.set(r.url(),r.status());if(critical(r.url())&&r.status()>=400)bad.push({url:r.url(),status:r.status()});});
  const response=await page.goto(`${BASE}owner-review-${lang}.html`,{waitUntil:'domcontentloaded',timeout:45000});
  await page.evaluate(()=>document.fonts?.ready).catch(()=>{});
  return{context,page,errors,failed,bad,responses,navigationStatus:response?.status()??null};
}

async function triggerAll(page){
  const sels=['#hero','[data-connected-system]','[data-tw-r2]','[data-home-tech-r2]','.home-fs-showcase-r14','[data-selected-thinking-r1]','#selected-work','[data-home-footer-golden-r3]'];
  for(const s of sels){
    await page.evaluate(sel=>document.querySelector(sel)?.scrollIntoView({block:'center'}),s).catch(()=>{});
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(500);
  await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.complete?Promise.resolve():i.decode?.().catch(()=>{})||Promise.resolve()));}).catch(()=>{});
  await page.evaluate(()=>scrollTo(0,0));
  await page.waitForTimeout(120);
}

async function state(page){
  return page.evaluate(()=>{
    const d=document.documentElement,b=document.body;
    const broken=[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.currentSrc||i.src);
    return{
      productSha:d.dataset.productSha||null,
      header:document.querySelectorAll('.site-header').length,
      hero:document.querySelectorAll('#hero').length,
      connected:document.querySelectorAll('[data-connected-system]').length,
      twoWorlds:document.querySelectorAll('[data-tw-r2]').length,
      technology:document.querySelectorAll('[data-home-tech-r2]').length,
      embeddedTechnology:document.querySelectorAll('.tw-tech-r2,[data-tw-tech-r2]').length,
      financial:document.querySelectorAll('.home-fs-showcase-r14').length,
      thinking:document.querySelectorAll('[data-selected-thinking-r1]').length,
      selectedWork:document.querySelectorAll('#selected-work').length,
      footerR3:document.querySelectorAll('[data-home-footer-golden-r3]').length,
      footerR2:document.querySelectorAll('footer[data-footer-watermark-r2]').length,
      founder:document.querySelectorAll('.homepage-founder-proof').length,
      oldMaterials:document.querySelectorAll('.materials-editorial').length,
      howWeWork:document.querySelectorAll('#how-we-work,[data-how-we-work]').length,
      delivery:document.querySelectorAll('#delivery-process,[data-delivery-process]').length,
      overflow:Math.max(0,d.scrollWidth-d.clientWidth,b.scrollWidth-d.clientWidth),
      brokenImages:broken
    };
  });
}

async function runMatrix(browser){
  for(const [w,h] of viewports){
    for(const lang of ['en','ru']){
      const x=await open(browser,lang,w,h);
      await triggerAll(x.page);
      const s=await state(x.page);
      const pass=x.navigationStatus===200&&s.productSha===PRODUCT_SHA&&s.header===1&&s.hero===1&&s.connected===1&&s.twoWorlds===1&&s.technology===1&&s.embeddedTechnology===0&&s.financial===1&&s.thinking===1&&s.selectedWork===1&&s.footerR3===1&&s.footerR2===0&&s.founder===0&&s.oldMaterials===0&&s.howWeWork===0&&s.delivery===0&&s.overflow===0&&s.brokenImages.length===0&&x.errors.length===0&&x.failed.length===0&&x.bad.length===0;
      report.matrix.push({lang,w,h,navigationStatus:x.navigationStatus,...s,pageErrors:x.errors,failedCritical:x.failed,badCritical:x.bad,pass});
      await x.context.close();
    }
  }
}

async function waitHeader(page){
  await page.waitForFunction(()=>document.querySelector('[data-proai-live-logo]')?.dataset.logoState==='live',null,{timeout:30000}).catch(()=>{});
  const rootState=await page.evaluate(()=>document.querySelector('[data-proai-live-logo]')?.dataset.logoState||null);
  const frame=page.frames().find(f=>f.url().includes('header-live-logo.html'));
  let ready=false,moving=false,framesA=null,framesB=null;
  if(frame){
    await frame.waitForFunction(()=>window.__PROAI_LOGO_R341_STATE?.ready===true,null,{timeout:20000}).catch(()=>{});
    ({ready,framesA}=await frame.evaluate(()=>({ready:window.__PROAI_LOGO_R341_STATE?.ready===true,framesA:window.__PROAI_LOGO_R341_STATE?.frames??null})).catch(()=>({ready:false,framesA:null})));
    await page.waitForTimeout(650);
    framesB=await frame.evaluate(()=>window.__PROAI_LOGO_R341_STATE?.frames??null).catch(()=>null);
    moving=ready&&Number.isFinite(framesA)&&Number.isFinite(framesB)&&framesB>framesA;
  }
  return{rootState,frameUrl:frame?.url()||null,ready,moving,framesA,framesB,pass:rootState==='live'&&ready&&moving};
}

async function cube(page){
  await page.waitForFunction(()=>document.querySelector('.proai-hero-object-slot')?.dataset.cubeMounted==='true'&&window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime?.ready===true&&!!document.querySelector('#cube-canvas'),null,{timeout:35000}).catch(()=>{});
  const s=await page.evaluate(()=>{const c=document.querySelector('#cube-canvas'),r=c?.getBoundingClientRect();return{mounted:document.querySelector('.proai-hero-object-slot')?.dataset.cubeMounted||null,ready:window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime?.ready===true,cssWidth:r?.width||0,cssHeight:r?.height||0,backingWidth:c?.width||0,backingHeight:c?.height||0};});
  let visual={width:0,height:0,uniqueBuckets:0,nonTransparent:0};
  if(s.ready&&s.backingWidth>0){
    const dataUrl=await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>resolve(document.querySelector('#cube-canvas')?.toDataURL('image/png')||''))));
    const raw=dataUrl.split(',')[1]||'';
    if(raw){
      const png=PNG.sync.read(Buffer.from(raw,'base64'));const buckets=new Set();let non=0;
      const sx=Math.max(1,Math.floor(png.width/24)),sy=Math.max(1,Math.floor(png.height/24));
      for(let y=0;y<png.height;y+=sy)for(let x=0;x<png.width;x+=sx){const i=(y*png.width+x)*4,a=png.data[i+3];if(a>8)non++;buckets.add(`${png.data[i]>>4},${png.data[i+1]>>4},${png.data[i+2]>>4},${a>>4}`);}
      visual={width:png.width,height:png.height,uniqueBuckets:buckets.size,nonTransparent:non};
    }
  }
  return{...s,visual,pass:s.mounted==='true'&&s.ready&&s.cssWidth>20&&s.cssHeight>20&&visual.uniqueBuckets>3&&visual.nonTransparent>3};
}

async function connected(page){
  await page.evaluate(()=>{const sec=document.querySelector('[data-connected-system]');window.__qaConn=[];if(!sec)return;const stages=[...sec.querySelectorAll('[data-system-stage]')];const last=new Set();new MutationObserver(()=>stages.forEach((s,i)=>{if(s.classList.contains('is-active')&&!last.has(i)){last.add(i);window.__qaConn.push({i,t:performance.now()});}})).observe(sec,{subtree:true,attributes:true,attributeFilter:['class']});});
  await page.evaluate(()=>document.querySelector('[data-connected-system]')?.scrollIntoView({block:'center'}));
  await page.waitForFunction(()=>window.__qaConn?.length>=3,null,{timeout:8500}).catch(()=>{});
  const events=await page.evaluate(()=>window.__qaConn||[]);const intervals=events.slice(1).map((e,i)=>Math.round((e.t-events[i].t)*10)/10);
  return{events,intervals,pass:events.length>=3&&intervals.every(v=>v>1500&&v<2300)};
}

async function twoDesktop(page){
  await page.evaluate(()=>document.querySelector('[data-tw-r2]')?.scrollIntoView({block:'center'}));
  const box=await page.locator('[data-tw-r2] [data-tw-viewport]').boundingBox();if(!box)return{pass:false};
  const sample=async p=>{await page.mouse.move(box.x+box.width*p,box.y+box.height*.5);await page.waitForTimeout(170);return page.evaluate(()=>document.querySelector('[data-tw-r2]')?.dataset.focus);};
  const ai=await sample(.2),neutral=await sample(.5),web=await sample(.8);return{ai,neutral,web,pass:ai==='ai'&&neutral==='neutral'&&web==='web'};
}

async function scrollRaw(page,raw){
  await page.evaluate(raw=>{const e=document.querySelector('[data-tw-experience]');if(!e)return;const r=e.getBoundingClientRect(),top=r.top+scrollY,travel=Math.max(1,r.height-innerHeight);scrollTo(0,top+travel*raw);},raw);
  await page.waitForTimeout(220);
  return page.evaluate(raw=>{
    const root=document.querySelector('[data-tw-r2]'),e=document.querySelector('[data-tw-experience]'),web=root?.querySelector('.tw-r2__content--web'),ai=root?.querySelector('.tw-r2__content--ai');
    const rr=e?.getBoundingClientRect(),travel=Math.max(1,(rr?.height||0)-innerHeight);
    const fit=node=>{if(!node)return false;const list=[node.querySelector('.tw-r2__world-title'),node.querySelector('.tw-r2__thesis'),node.querySelector('.tw-r2__registers'),node.querySelector('.tw-r2__cta')].filter(Boolean);return list.every(n=>{const r=n.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1&&r.top>=-1&&r.bottom<=innerHeight+1&&r.width>0&&r.height>0;});};
    const face=root?.querySelector('.tw-r2__face--web'),fr=face?.getBoundingClientRect();const overlap=fr?Math.max(0,Math.min(fr.right,innerWidth)-Math.max(fr.left,0))/innerWidth:0;
    return{raw,focus:root?.dataset.focus||null,progress:parseFloat(root?.style.getPropertyValue('--tw-mobile-progress')||'NaN'),bridgeRaw:parseFloat(root?.style.getPropertyValue('--tw-golden-landscape-raw')||'NaN'),travel,webFit:fit(web),aiFit:fit(ai),webTerritory:overlap,coarse:matchMedia('(hover:none) and (pointer:coarse)').matches};
  },raw);
}

async function twoPortrait(page){
  const a=await scrollRaw(page,.2),t=await scrollRaw(page,.5),w=await scrollRaw(page,.8);
  return{a,t,w,pass:a.focus==='ai'&&t.focus==='turn'&&w.focus==='web'&&a.progress<.43&&t.progress>=.43&&t.progress<=.57&&w.progress>.57};
}

async function twoLandscape(page){
  const a=await scrollRaw(page,.10),t=await scrollRaw(page,.38),w1=await scrollRaw(page,.62),w2=await scrollRaw(page,.88);
  await page.evaluate(()=>document.querySelector('[data-home-tech-r2]')?.scrollIntoView({block:'center'}));await page.waitForTimeout(120);
  const techReachable=await page.evaluate(()=>{const r=document.querySelector('[data-home-tech-r2]')?.getBoundingClientRect();return!!r&&r.top<innerHeight&&r.bottom>0;});
  const holdPx=(w1.travel||0)*(1-.56);
  return{a,t,w1,w2,holdPx,techReachable,pass:a.coarse&&a.focus==='ai'&&a.progress<=.01&&a.aiFit&&t.focus==='turn'&&w1.focus==='web'&&w2.focus==='web'&&w1.progress>=.99&&w2.progress>=.99&&w1.webFit&&w2.webFit&&w1.webTerritory>=.72&&w2.webTerritory>=.72&&holdPx>=150&&techReachable};
}

async function technology(page){
  await page.evaluate(()=>document.querySelector('[data-home-tech-r2]')?.scrollIntoView({block:'center'}));await page.waitForTimeout(400);
  return page.evaluate(()=>{const root=document.querySelector('[data-home-tech-r2]'),reg=root?.querySelector('.home-tech-r2__register'),ids=[...(root?.querySelectorAll('.home-tech-r2__identity')||[])],rr=reg?.getBoundingClientRect();const rows=ids.map(x=>{const r=x.getBoundingClientRect(),n=x.querySelector('.home-tech-r2__name')?.getBoundingClientRect(),cs=getComputedStyle(x);return{left:r.left,right:r.right,flexDirection:cs.flexDirection,nameLeft:n?.left,nameRight:n?.right,name:x.querySelector('.home-tech-r2__name')?.textContent?.trim()};});const centered=rr?Math.abs((rr.left+rr.right)/2-innerWidth/2)<5:false;const noEdge=rows.every(r=>r.left>=8&&r.right<=innerWidth-8&&(r.nameLeft??0)>=8&&(r.nameRight??innerWidth)<=innerWidth-8);return{count:ids.length,rows,centered,noEdge,pass:ids.length===10&&centered&&noEdge&&rows.every(r=>r.flexDirection==='row'&&!!r.name)};});
}

async function financial(x){
  const page=x.page;await page.evaluate(()=>document.querySelector('.home-fs-showcase-r14')?.scrollIntoView({block:'center'}));
  await page.waitForFunction(()=>document.querySelector('.home-fs-showcase-r14')?.classList.contains('is-live'),null,{timeout:8000}).catch(()=>{});
  await page.waitForFunction(()=>[...document.querySelectorAll('.home-fs-showcase-r14 img')].every(i=>i.complete&&i.naturalWidth>0&&i.naturalHeight>0),null,{timeout:12000}).catch(()=>{});await page.waitForTimeout(700);
  const s=await page.evaluate(()=>{const root=document.querySelector('.home-fs-showcase-r14'),fig=root?.querySelector('.home-fs-showcase-r11__primary'),img=fig?.querySelector('img'),stage=root?.querySelector('.home-fs-showcase-r11__stage'),field=root?.querySelector('.home-fs-showcase-r11__field'),ir=img?.getBoundingClientRect(),fr=fig?.getBoundingClientRect(),sr=stage?.getBoundingClientRect(),cs=img?getComputedStyle(img):null,fs=fig?getComputedStyle(fig):null;return{count:document.querySelectorAll('.home-fs-showcase-r14').length,isLive:root?.classList.contains('is-live')||false,currentSrc:img?.currentSrc||img?.src||null,naturalWidth:img?.naturalWidth||0,naturalHeight:img?.naturalHeight||0,imgBox:ir&&{left:ir.left,top:ir.top,width:ir.width,height:ir.height,right:ir.right,bottom:ir.bottom},figureBox:fr&&{width:fr.width,height:fr.height},stageBox:sr&&{width:sr.width,height:sr.height},opacity:cs?.opacity,visibility:cs?.visibility,display:cs?.display,objectFit:cs?.objectFit,zIndex:fs?.zIndex,figureOpacity:fs?.opacity,fieldZ:field?getComputedStyle(field).zIndex:null};});
  const status=s.currentSrc?x.responses.get(s.currentSrc)??null:null;const visible=s.naturalWidth>0&&s.naturalHeight>0&&(s.imgBox?.width||0)>100&&(s.imgBox?.height||0)>100&&parseFloat(s.opacity||'0')>.9&&parseFloat(s.figureOpacity||'0')>.9&&s.visibility!=='hidden'&&s.display!=='none';
  return{...s,httpStatus:status,pass:s.count===1&&s.isLive&&visible&&status!==null&&status<400&&s.objectFit==='contain'};
}

async function thinking(page,lang){
  await page.evaluate(()=>document.querySelector('[data-selected-thinking-r1]')?.scrollIntoView({block:'center'}));await page.waitForTimeout(1500);
  return page.evaluate(lang=>{const root=document.querySelector('[data-selected-thinking-r1]'),arts=[...root?.querySelectorAll('article')||[]],nums=arts.map(a=>a.querySelector('.selected-thinking-r1__number')?.textContent?.trim()),titles=arts.map(a=>a.querySelector('h3 a')?.textContent?.replace(/\s+/g,' ')?.trim()),signal=!!root?.querySelector('.selected-thinking-r1__framework--lead'),infinite=root?.getAnimations({subtree:true}).filter(a=>a.playState==='running'&&a.effect?.getComputedTiming?.().iterations===Infinity).length||0;const expected=lang==='en'?['What Happens After a Lead Arrives?','Does Your U.S. Service Business Need a Multilingual Website?','How to Evaluate a Website Proposal Before You Sign']:[];const enOK=lang!=='en'||expected.every((t,i)=>titles[i]?.includes(t));return{count:document.querySelectorAll('[data-selected-thinking-r1]').length,nums,titles,signal,infinite,oldMaterials:document.querySelectorAll('.materials-editorial').length,pass:arts.length===3&&nums.join(',')==='01,02,03'&&signal&&infinite===0&&document.querySelectorAll('.materials-editorial').length===0&&enOK};},lang);
}

async function work(page,lang){
  await page.evaluate(()=>document.querySelector('#selected-work')?.scrollIntoView({block:'center'}));await page.waitForTimeout(150);
  return page.evaluate(lang=>{const root=document.querySelector('#selected-work'),rows=[...root?.querySelectorAll('.homepage-project-row')||[]],rr=root?.getBoundingClientRect(),names=rows.map(r=>r.querySelector('.homepage-project-case span')?.textContent?.trim()),links=rows.map(r=>({caseHref:r.querySelector('.homepage-project-case')?.getAttribute('href'),liveHref:r.querySelector('.homepage-project-live')?.getAttribute('href'),status:r.querySelector('small')?.textContent?.trim()}));const visible=!!rr&&rr.width>100&&rr.height>120;const expected=lang==='en'?['Financial Stream','Alina Horb','Local Repair Pro']:['Financial Stream','Алина Горб','Local Repair Pro'];return{count:document.querySelectorAll('#selected-work').length,names,links,visible,pass:rows.length===3&&visible&&expected.every((v,i)=>names[i]===v)&&links.every(x=>!!x.caseHref&&!!x.liveHref&&!!x.status)};},lang);
}

async function footer(page,lang){
  await page.evaluate(()=>document.querySelector('[data-home-footer-golden-r3]')?.scrollIntoView({block:'center'}));await page.waitForTimeout(400);
  const base=await page.evaluate(lang=>{const root=document.querySelector('[data-home-footer-golden-r3]'),sig=root?.querySelector('[data-footer-material-zone]'),text=root?.querySelector('.home-footer-golden-r3__signature-text'),light=root?.querySelector('.home-footer-golden-r3__signature-light'),title=root?.querySelector('.home-footer-golden-r3__cta h2'),ey=root?.querySelector('.home-footer-golden-r3__eyebrow'),img=root?.querySelector('.home-footer-golden-r3__logo img.proai-logo-r341__static'),r=text?.getBoundingClientRect(),cs=text?getComputedStyle(text):null,ls=light?getComputedStyle(light):null,ts=title?getComputedStyle(title):null;return{count:document.querySelectorAll('[data-home-footer-golden-r3]').length,r2:document.querySelectorAll('footer[data-footer-watermark-r2]').length,eyebrow:ey?.textContent?.trim(),title:title?.textContent?.trim(),signature:text?.textContent?.trim(),signatureBox:r&&{width:r.width,height:r.height},fontSize:parseFloat(cs?.fontSize||'0'),metalAnimation:cs?.animationName,ambientAnimation:ls?.animationName,titleAnimation:ts?.animationName,bottomStatic:!!img&&img.naturalWidth>0,footerIframe:root?.querySelectorAll('iframe').length||0,pointerX:sig?getComputedStyle(sig).getPropertyValue('--pointer-x').trim():null};},lang);
  const box=await page.locator('[data-home-footer-golden-r3] [data-footer-material-zone]').boundingBox();let pointer=false,pointerAfter=null,awake=false;
  if(box){await page.mouse.move(box.x+box.width*.22,box.y+box.height*.5);await page.waitForTimeout(100);await page.mouse.move(box.x+box.width*.73,box.y+box.height*.47);await page.waitForTimeout(160);({pointerAfter,awake}=await page.evaluate(()=>{const z=document.querySelector('[data-footer-material-zone]');return{pointerAfter:getComputedStyle(z).getPropertyValue('--pointer-x').trim(),awake:z.classList.contains('is-awake')}}));pointer=awake&&pointerAfter&&pointerAfter!==base.pointerX;}
  const expectedEy=lang==='en'?'NEXT STEP':'СЛЕДУЮЩИЙ ШАГ',expectedTitle=lang==='en'?'Ready to build a stronger system?':'Готовы построить более сильную систему?';
  return{...base,pointer,pointerAfter,awake,pass:base.count===1&&base.r2===0&&base.eyebrow===expectedEy&&base.title===expectedTitle&&base.signature==='PROAI EXPERT'&&(base.signatureBox?.width||0)>500&&base.fontSize>60&&base.metalAnimation?.includes('homeFooterGoldenMetalDrift')&&base.ambientAnimation?.includes('homeFooterGoldenAmbient')&&base.titleAnimation?.includes('homeFooterGoldenTitleBreath')&&base.bottomStatic&&base.footerIframe===0&&pointer};
}

async function footerReduced(browser){
  const x=await open(browser,'en',1440,900,{touch:false,reduced:'reduce'});await x.page.evaluate(()=>document.querySelector('[data-home-footer-golden-r3]')?.scrollIntoView({block:'center'}));await x.page.waitForTimeout(250);const s=await x.page.evaluate(()=>{const r=document.querySelector('[data-home-footer-golden-r3]'),t=r?.querySelector('.home-footer-golden-r3__signature-text'),l=r?.querySelector('.home-footer-golden-r3__signature-light'),h=r?.querySelector('.home-footer-golden-r3__cta h2');return{text:getComputedStyle(t).animationName,light:getComputedStyle(l).animationName,title:getComputedStyle(h).animationName,signature:t?.textContent?.trim(),visible:(t?.getBoundingClientRect().width||0)>0};});await x.context.close();return{...s,pass:s.signature==='PROAI EXPERT'&&s.visible&&s.text==='none'&&s.light==='none'&&s.title==='none'};
}

async function clipElement(page,sel,file,pad=0){
  await page.evaluate(s=>document.querySelector(s)?.scrollIntoView({block:'center'}),sel);await page.waitForTimeout(240);
  const clip=await page.evaluate(([s,p])=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect(),x=Math.max(0,r.left+scrollX-p),y=Math.max(0,r.top+scrollY-p),maxW=Math.max(1,document.documentElement.scrollWidth-x),maxH=Math.max(1,document.documentElement.scrollHeight-y);return{x,y,width:Math.min(r.width+2*p,maxW),height:Math.min(r.height+2*p,maxH)};},[sel,pad]);
  if(!clip||clip.width<2||clip.height<2)throw new Error(`missing screenshot ${sel}`);await page.screenshot({path:`${MEDIA}/${file}`,clip});report.screenshots.push(`media/${file}`);
}
async function full(page,file){await page.screenshot({path:`${MEDIA}/${file}`,fullPage:true});report.screenshots.push(`media/${file}`);}
async function viewportShot(page,file){await page.screenshot({path:`${MEDIA}/${file}`});report.screenshots.push(`media/${file}`);}

async function screenshotsAndDetails(browser){
  let x=await open(browser,'en',1536,864,{touch:false});
  report.details.header=await waitHeader(x.page);report.details.cube=await cube(x.page);report.details.connected=await connected(x.page);report.details.twoDesktop=await twoDesktop(x.page);report.details.footer=await footer(x.page,'en');
  await triggerAll(x.page);await full(x.page,'01-desktop-en-1536x864-full-page.png');
  await x.page.evaluate(()=>scrollTo(0,0));await viewportShot(x.page,'05-hero-cube-desktop.png');
  await x.page.evaluate(()=>document.querySelector('[data-tw-r2]')?.scrollIntoView({block:'center'}));await x.page.waitForTimeout(120);
  const twbox=await x.page.locator('[data-tw-r2] [data-tw-viewport]').boundingBox();if(twbox){await x.page.mouse.move(twbox.x+twbox.width*.2,twbox.y+twbox.height*.5);await x.page.waitForTimeout(160);}await clipElement(x.page,'[data-tw-r2]','06-two-worlds-desktop-ai.png');
  if(twbox){const b=await x.page.locator('[data-tw-r2] [data-tw-viewport]').boundingBox();if(b){await x.page.mouse.move(b.x+b.width*.8,b.y+b.height*.5);await x.page.waitForTimeout(160);}}await clipElement(x.page,'[data-tw-r2]','07-two-worlds-desktop-web.png');
  await clipElement(x.page,'[data-home-footer-golden-r3]','18-footer-r3-1-desktop.png');
  const fb=await x.page.locator('[data-footer-material-zone]').boundingBox();if(fb){await x.page.mouse.move(fb.x+fb.width*.78,fb.y+fb.height*.44);await x.page.waitForTimeout(180);}await clipElement(x.page,'[data-footer-material-zone]','19-footer-r3-1-pointer-response.png',20);
  await x.context.close();

  x=await open(browser,'ru',1536,864,{touch:false});await triggerAll(x.page);await full(x.page,'02-desktop-ru-1536x864-full-page.png');await x.context.close();

  x=await open(browser,'en',390,844,{touch:true});report.details.twoPortraitEn=await twoPortrait(x.page);report.details.technology390=await technology(x.page);report.details.thinking390=await thinking(x.page,'en');report.details.work390=await work(x.page,'en');await triggerAll(x.page);await full(x.page,'03-mobile-en-390x844-full-page.png');await clipElement(x.page,'[data-home-tech-r2]','11-technology-mobile-390x844.png');await x.page.evaluate(()=>document.querySelector('.home-fs-showcase-r14')?.scrollIntoView({block:'center'}));await x.page.waitForFunction(()=>document.querySelector('.home-fs-showcase-r14')?.classList.contains('is-live'),null,{timeout:8000}).catch(()=>{});await x.page.waitForTimeout(750);await clipElement(x.page,'.home-fs-showcase-r14','13-financial-stream-mobile-390x844.png');await clipElement(x.page,'[data-selected-thinking-r1]','15-selected-thinking-mobile-390x844.png');await clipElement(x.page,'#selected-work','17-selected-work-mobile-390x844.png');await clipElement(x.page,'[data-home-footer-golden-r3]','20-footer-r3-1-mobile-390x844.png');await x.context.close();

  x=await open(browser,'ru',390,844,{touch:true});report.details.thinkingRu390=await thinking(x.page,'ru');report.details.workRu390=await work(x.page,'ru');await triggerAll(x.page);await full(x.page,'04-mobile-ru-390x844-full-page.png');await x.context.close();

  x=await open(browser,'en',1440,900,{touch:false});report.details.financial1440=await financial(x);report.details.thinking1440=await thinking(x.page,'en');report.details.work1440=await work(x.page,'en');await clipElement(x.page,'.home-fs-showcase-r14','12-financial-stream-desktop-1440x900.png');await clipElement(x.page,'[data-selected-thinking-r1]','14-selected-thinking-desktop.png');await clipElement(x.page,'#selected-work','16-selected-work-desktop.png');await x.context.close();

  x=await open(browser,'ru',1440,900,{touch:false});report.details.financialRu1440=await financial(x);await x.context.close();

  x=await open(browser,'en',844,390,{touch:true});report.details.twoLandscape844=await twoLandscape(x.page);await scrollRaw(x.page,.10);await viewportShot(x.page,'08-two-worlds-landscape-844x390-ai.png');await scrollRaw(x.page,.75);await viewportShot(x.page,'09-two-worlds-landscape-844x390-web.png');await x.context.close();

  x=await open(browser,'en',932,430,{touch:true});report.details.twoLandscape932=await twoLandscape(x.page);await scrollRaw(x.page,.75);await viewportShot(x.page,'10-two-worlds-landscape-932x430-web.png');report.details.technology932=await technology(x.page);await x.context.close();

  for(const [w,h] of [[812,375],[852,393]]){x=await open(browser,'en',w,h,{touch:true});report.details[`twoLandscape${w}`]=await twoLandscape(x.page);await x.context.close();}
  for(const [w,h] of [[393,852],[430,932]]){x=await open(browser,'en',w,h,{touch:true});report.details[`twoPortrait${w}`]=await twoPortrait(x.page);await x.context.close();}
  for(const [w,h] of [[430,932],[393,852],[375,812],[320,568],[844,390]]){x=await open(browser,'en',w,h,{touch:isTouch(w,h)});report.details[`technology${w}x${h}`]=await technology(x.page);await x.context.close();}
  report.details.footerReduced=await footerReduced(browser);
}

const browser=await chromium.launch({headless:true,args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
await screenshotsAndDetails(browser);
await runMatrix(browser);
await browser.close();

const detailKeys=['header','cube','connected','twoDesktop','footer','twoPortraitEn','technology390','thinking390','work390','thinkingRu390','workRu390','financial1440','thinking1440','work1440','financialRu1440','twoLandscape844','twoLandscape932','twoLandscape812','twoLandscape852','twoPortrait393','twoPortrait430','technology932','technology430x932','technology393x852','technology375x812','technology320x568','technology844x390','footerReduced'];
const detailPass=detailKeys.every(k=>report.details[k]?.pass===true);
report.pass=detailPass&&report.matrix.every(x=>x.pass)&&report.screenshots.length===20;
fs.writeFileSync(`${OUT}/final-authority-qa.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify({pass:report.pass,screenshots:report.screenshots.length,matrixFailed:report.matrix.filter(x=>!x.pass).map(x=>`${x.lang}-${x.w}x${x.h}`),detailFailed:detailKeys.filter(k=>report.details[k]?.pass!==true),financial:report.details.financial1440,twoLandscape844:report.details.twoLandscape844,footer:report.details.footer},null,2));
if(!report.pass)process.exit(1);
