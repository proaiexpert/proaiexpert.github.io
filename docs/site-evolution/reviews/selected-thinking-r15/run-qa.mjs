import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://127.0.0.1:4173';
const OUT = 'docs/site-evolution/reviews/selected-thinking-r15/evidence';
fs.mkdirSync(OUT, { recursive: true });

const report = {
  productSha: process.env.PRODUCT_SHA,
  generatedAt: new Date().toISOString(),
  pass: false,
  checks: [], failures: [], consoleErrors: [], selectedAssetFailures: [],
  matrix: { desktop: true, mobile: true, landscape: true },
  entry: {}, pointer: {}, reducedMotion: {}, screenshots: {}
};
const resultPath = path.join(OUT, 'qa-results.json');
const persist = () => fs.writeFileSync(resultPath, JSON.stringify(report, null, 2));
const check = (ok, label, details = null, category = 'runtime') => {
  const row = { label, details, category };
  (ok ? report.checks : report.failures).push(row); persist(); return Boolean(ok);
};
persist();

const expected = {
  en: { route: '/', topHref: '/insights/', topText: 'EXPLORE ALL INSIGHTS →', bottomHref: '/insights/', lead: 'What Happens After a Lead Arrives? Building a Response System for Service Businesses', supports: ['Does Your U.S. Service Business Need a Multilingual Website?','How to Evaluate a Website Proposal Before You Sign'] },
  ru: { route: '/ru/', topHref: '/ru/insights/', topText: 'СМОТРЕТЬ ВСЕ МАТЕРИАЛЫ →', bottomHref: '/ru/insights/', lead: 'Что происходит после заявки: как сервисному бизнесу не терять обращения', supports: ['Сайт для русскоязычного бизнеса в США: только английский, отдельный русский раздел или две версии?','Как проверить подрядчика и предложение на разработку сайта'] }
};
const viewports = [
  { name:'1440x900', width:1440, height:900, kind:'desktop' },
  { name:'1280x800', width:1280, height:800, kind:'desktop' },
  { name:'1024x768', width:1024, height:768, kind:'desktop' },
  { name:'430x932', width:430, height:932, kind:'mobile' },
  { name:'390x844', width:390, height:844, kind:'mobile' },
  { name:'375x812', width:375, height:812, kind:'mobile' },
  { name:'360x800', width:360, height:800, kind:'mobile' },
  { name:'320x700', width:320, height:700, kind:'mobile' },
  { name:'852x393', width:852, height:393, kind:'landscape' }
];

const browser = await chromium.launch({ headless:true, args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] });

function hook(page, lang, viewport) {
  page.on('pageerror', e => { report.consoleErrors.push({lang,viewport,type:'pageerror',text:String(e)}); persist(); });
  page.on('console', m => { if (m.type()==='error') { report.consoleErrors.push({lang,viewport,type:'console',text:m.text()}); persist(); } });
  page.on('requestfailed', r => { if (r.url().includes('home-selected-thinking-r1-5')) { report.selectedAssetFailures.push({lang,viewport,url:r.url(),error:r.failure()?.errorText||'requestfailed'}); persist(); } });
  page.on('response', r => { if (r.status()>=400 && r.url().includes('home-selected-thinking-r1-5')) { report.selectedAssetFailures.push({lang,viewport,url:r.url(),error:`HTTP ${r.status()}`}); persist(); } });
}

async function contextFor(vp, reducedMotion='no-preference') {
  const touch = vp.kind==='mobile' || vp.kind==='landscape';
  return browser.newContext({ viewport:{width:vp.width,height:vp.height}, reducedMotion, isMobile:touch, hasTouch:touch });
}

async function waitFonts(page) {
  return page.evaluate(async () => {
    if (!document.fonts?.ready) return {supported:false,timedOut:false};
    let timedOut=false;
    await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(()=>{timedOut=true;r();},3500))]);
    return {supported:true,timedOut,status:document.fonts.status};
  });
}

async function basePage(lang, vp, reducedMotion='no-preference') {
  const context = await contextFor(vp,reducedMotion); const page = await context.newPage(); hook(page,lang,vp.name);
  await page.goto(BASE+expected[lang].route,{waitUntil:'load',timeout:60000});
  await page.locator('#selected-thinking-r1').waitFor({state:'attached',timeout:15000});
  await page.waitForFunction(() => document.documentElement.classList.contains('st-r15-js'),null,{timeout:5000});
  const fonts = await waitFonts(page);
  return {context,page,fonts};
}

async function entryDiagnostics(page) {
  return page.evaluate(() => {
    const s=document.querySelector('#selected-thinking-r1'); const r=s.getBoundingClientRect();
    return {
      viewport:{w:innerWidth,h:innerHeight}, rect:{top:r.top,bottom:r.bottom,height:r.height,width:r.width},
      ratio:Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(r.top,0))/Math.max(1,r.height),
      js:document.documentElement.classList.contains('st-r15-js'), entered:s.dataset.stR15Entered||'', calm:s.classList.contains('st-r15-calm'),
      opacity:getComputedStyle(s).opacity, display:getComputedStyle(s).display
    };
  });
}

async function triggerEntry(page, {timeout=5000}={}) {
  const before = await entryDiagnostics(page);
  if (before.entered==='true') return {before,after:before,already:true};
  await page.evaluate(() => {
    const s=document.querySelector('#selected-thinking-r1'); const r=s.getBoundingClientRect();
    const target=Math.max(0,scrollY+r.top-Math.max(24,innerHeight*.08));
    window.scrollTo({top:target,behavior:'instant'});
  });
  try {
    await page.waitForFunction(() => document.querySelector('#selected-thinking-r1')?.dataset.stR15Entered==='true',null,{timeout});
  } catch (e) {
    const after = await entryDiagnostics(page);
    const detail={before,after,error:String(e)};
    check(false,'entry observer failed to activate R1.5 at meaningful viewport exposure',detail,'product-entry');
    throw new Error('R1.5 entry did not activate: '+JSON.stringify(detail));
  }
  return {before,after:await entryDiagnostics(page),already:false};
}

async function waitCalm(page) {
  try {
    await page.waitForFunction(() => document.querySelector('#selected-thinking-r1')?.classList.contains('st-r15-calm'),null,{timeout:2100});
  } catch (e) {
    const d=await page.evaluate(() => ({ classes:document.querySelector('#selected-thinking-r1')?.className, running:document.getAnimations().filter(a=>a.playState==='running'&&String(a.animationName||'').startsWith('st-r15-')).map(a=>({name:a.animationName,currentTime:a.currentTime,playState:a.playState})) }));
    check(false,'R1.5 did not reach calm within 2000ms window',d,'product-motion');
    throw e;
  }
  const running=await page.evaluate(() => document.getAnimations().filter(a=>a.playState==='running'&&String(a.animationName||'').startsWith('st-r15-')).map(a=>a.animationName));
  check(running.length===0,'R1.5 absolute calm has zero running authored animations',running,'product-motion');
}

function alphaFromCssColor(color) {
  const m=String(color||'').match(/rgba?\(([^)]+)\)/i); if(!m) return null;
  const parts=m[1].split(/[ ,/]+/).filter(Boolean); return parts.length>=4 ? Number(parts[3]) : 1;
}

async function staticCheck(lang,vp) {
  const {context,page,fonts}=await basePage(lang,vp); let local=true;
  try { await triggerEntry(page); await waitCalm(page); }
  catch(e) { report.matrix[vp.kind]=false; await context.close(); return; }
  const d=await page.evaluate(() => {
    const root=document.querySelector('#selected-thinking-r1'), top=root.querySelector('.selected-thinking-r1__archive-top'), bottom=root.querySelector('.selected-thinking-r1__archive a'), lead=root.querySelector('.selected-thinking-r1__lead'), idx=root.querySelector('.selected-thinking-r15__index'), head=root.querySelector('.selected-thinking-r1__lead .selected-thinking-r1__record-head'), fw=root.querySelector('.selected-thinking-r1__framework--lead');
    const supports=[...root.querySelectorAll('.selected-thinking-r1__support-record h3 a')].map(a=>a.textContent.replace(/\s+/g,' ').trim());
    return {
      sections:document.querySelectorAll('#selected-thinking-r1').length,
      taxonomy:root.querySelectorAll('.selected-thinking-r1__taxonomy').length,
      taxonomyText:/AI SYSTEMS \/ AUTOMATION \/ DIGITAL STRATEGY \/ OPERATIONS|AI-СИСТЕМЫ \/ АВТОМАТИЗАЦИЯ \/ ЦИФРОВАЯ СТРАТЕГИЯ \/ ОПЕРАЦИИ/.test(root.innerText),
      topTag:top?.tagName||'', topHref:top?new URL(top.href).pathname:'', topText:top?.textContent.replace(/\s+/g,' ').trim()||'', topHeight:top?.getBoundingClientRect().height||0,
      bottomHref:bottom?new URL(bottom.href).pathname:'',
      lead:root.querySelector('.selected-thinking-r1__lead h3 a')?.textContent.replace(/\s+/g,' ').trim()||'', supports,
      css:[...document.styleSheets].some(s=>s.href?.includes('home-selected-thinking-r1-5.css')), js:[...document.scripts].some(s=>s.src?.includes('home-selected-thinking-r1-5.js')),
      material:!!root.querySelector('.selected-thinking-r15__material') && getComputedStyle(lead).backgroundImage,
      indexText:idx?.textContent||'', indexColor:idx?getComputedStyle(idx).color:'', indexFontSize:idx?getComputedStyle(idx).fontSize:'',
      spineWidth:getComputedStyle(head,'::before').width, spineBg:getComputedStyle(head,'::before').backgroundImage,
      signalBg:getComputedStyle(fw,'::before').backgroundImage, pulseOpacity:getComputedStyle(fw,'::after').opacity,
      overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth,
      fine:matchMedia('(hover: hover) and (pointer: fine)').matches,
      calm:root.classList.contains('st-r15-calm'), running:document.getAnimations().filter(a=>a.playState==='running'&&String(a.animationName||'').startsWith('st-r15-')).map(a=>a.animationName)
    };
  });
  const idxAlpha=alphaFromCssColor(d.indexColor); const label=`${lang} ${vp.name}`;
  local &= check(d.sections===1,`${label}: one integrated section`,d.sections);
  local &= check(d.taxonomy===0&&!d.taxonomyText,`${label}: taxonomy omitted`,d);
  local &= check(d.topTag==='A'&&d.topHref===expected[lang].topHref&&d.topText===expected[lang].topText,`${label}: top CTA exact`,d);
  local &= check(d.topHeight>=43.5,`${label}: top CTA >=44px`,d.topHeight);
  local &= check(d.bottomHref===expected[lang].bottomHref,`${label}: bottom CTA preserved`,d.bottomHref);
  local &= check(d.lead===expected[lang].lead,`${label}: lead unchanged`,d.lead);
  local &= check(JSON.stringify(d.supports)===JSON.stringify(expected[lang].supports),`${label}: supports unchanged`,d.supports);
  local &= check(d.css&&d.js,`${label}: R1.5 CSS/JS loaded`,{css:d.css,js:d.js});
  local &= check(Boolean(d.material)&&String(d.material).includes('radial-gradient'),`${label}: material feature plate rendered`,d.material);
  local &= check(d.indexText==='01'&&idxAlpha!==null&&idxAlpha>=.035&&idxAlpha<=.07,`${label}: oversized 01 has restrained 4–6% class opacity`,{color:d.indexColor,alpha:idxAlpha,fontSize:d.indexFontSize});
  local &= check(d.spineWidth==='1px'&&d.spineBg.includes('linear-gradient'),`${label}: editorial spine rendered`,d);
  local &= check(d.signalBg.includes('linear-gradient')&&Number(d.pulseOpacity)===0,`${label}: Decision Signal settled`,d);
  local &= check(d.overflow<=1,`${label}: no horizontal overflow`,d.overflow);
  local &= check(d.calm&&d.running.length===0,`${label}: idle running animation NONE`,d.running);
  local &= check(!fonts.timedOut,`${label}: fonts ready bounded`,fonts,'harness');
  if(vp.kind!=='desktop') local &= check(!d.fine,`${label}: no fine-pointer behavior on touch`,d.fine);
  report.matrix[vp.kind]=report.matrix[vp.kind]&&Boolean(local); persist(); await context.close();
}

async function entryCheck(lang) {
  const vp={name:'1440x900-entry',width:1440,height:900,kind:'desktop'}; const {context,page}=await basePage(lang,vp);
  const initial=await entryDiagnostics(page);
  check(initial.entered!=='true',`${lang}: fresh page starts before R1.5 entry`,initial,'product-entry');
  await page.evaluate(() => {
    const s=document.querySelector('#selected-thinking-r1'); window.__r15={starts:0,calms:0,startAt:null,calmAt:null,animations:[]};
    s.addEventListener('st:r15-start',()=>{window.__r15.starts++;window.__r15.startAt=performance.now();});
    s.addEventListener('st:r15-calm',()=>{window.__r15.calms++;window.__r15.calmAt=performance.now();});
    s.addEventListener('animationstart',e=>{if(String(e.animationName||'').startsWith('st-r15-')) window.__r15.animations.push({name:e.animationName,pseudo:e.pseudoElement||'',at:performance.now()});},true);
  });
  await triggerEntry(page); await waitCalm(page);
  const a=await page.evaluate(() => ({...window.__r15,delta:window.__r15.calmAt-window.__r15.startAt,running:document.getAnimations().filter(x=>x.playState==='running'&&String(x.animationName||'').startsWith('st-r15-')).map(x=>x.animationName)}));
  const signal=a.animations.filter(x=>x.name==='st-r15-signal').length, nodes=a.animations.filter(x=>x.name==='st-r15-node').length, sweep=a.animations.filter(x=>x.name==='st-r15-plate-sweep').length;
  check(a.starts===1,`${lang}: entry starts exactly once`,a,'product-entry');
  check(a.calms===1&&a.delta>=900&&a.delta<=2000,`${lang}: entry ends once within bounded authored window`,a,'product-motion');
  check(a.running.length===0,`${lang}: no authored animation after calm`,a.running,'product-motion');
  check(signal===1,`${lang}: Decision Signal travels exactly once`,a.animations,'product-motion');
  check(nodes===4,`${lang}: four Decision Signal nodes respond once`,a.animations,'product-motion');
  check(sweep===1,`${lang}: material entry reflection travels once`,a.animations,'product-motion');
  await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'})); await page.waitForTimeout(180);
  await page.evaluate(() => { const s=document.querySelector('#selected-thinking-r1'),r=s.getBoundingClientRect(); window.scrollTo({top:scrollY+r.top-innerHeight*.08,behavior:'instant'}); }); await page.waitForTimeout(300);
  const starts=await page.evaluate(()=>window.__r15.starts); check(starts===1,`${lang}: scroll re-entry does not replay`,starts,'product-entry');
  report.entry[lang]={...a,signal,nodes,sweep,startsAfterReentry:starts}; persist(); await context.close();
}

async function pointerCheck() {
  const vp={name:'1440x900-pointer',width:1440,height:900,kind:'desktop'}; const {context,page}=await basePage('en',vp); await triggerEntry(page); await waitCalm(page);
  const lead=page.locator('#selected-thinking-r1 .selected-thinking-r1__lead'), box=await lead.boundingBox();
  if(!check(!!box,'pointer: lead bounding box available',box,'harness')) { await context.close(); return; }
  await page.evaluate(() => { window.__spec=0; document.querySelector('#selected-thinking-r1 .selected-thinking-r1__lead h3').addEventListener('animationstart',e=>{if(e.animationName==='st-r15-specular')window.__spec++;},true); });
  await page.mouse.move(box.x+box.width*.28,box.y+box.height*.36); await page.waitForTimeout(260);
  const active=await page.evaluate(() => { const lead=document.querySelector('#selected-thinking-r1 .selected-thinking-r1__lead'),mat=document.querySelector('.selected-thinking-r15__material'); return {fine:matchMedia('(hover: hover) and (pointer: fine)').matches,pointerClass:lead.classList.contains('st-r15-pointer'),x:lead.style.getPropertyValue('--st-light-x'),y:lead.style.getPropertyValue('--st-light-y'),materialOpacity:getComputedStyle(mat,'::before').opacity,specStarts:window.__spec}; });
  check(active.fine&&active.pointerClass&&active.x&&active.y&&Number(active.materialOpacity)>.5,'pointer: bounded material light follows fine pointer',active,'product-pointer');
  check(active.specStarts===1,'pointer: headline specular starts once',active,'product-pointer');
  await page.mouse.move(box.x+box.width*.64,box.y+box.height*.48); await page.waitForTimeout(720);
  const held=await page.evaluate(()=>({starts:window.__spec,running:document.getAnimations().filter(a=>a.playState==='running'&&a.animationName==='st-r15-specular').length})); check(held.starts===1&&held.running===0,'pointer: no repeat while pointer remains',held,'product-pointer');
  await page.mouse.move(1,1); await page.waitForTimeout(260);
  const left=await page.evaluate(() => { const lead=document.querySelector('#selected-thinking-r1 .selected-thinking-r1__lead'); return {pointer:lead.classList.contains('st-r15-pointer'),intent:lead.classList.contains('st-r15-intent'),x:lead.style.getPropertyValue('--st-light-x'),y:lead.style.getPropertyValue('--st-light-y'),running:document.getAnimations().filter(a=>a.playState==='running'&&a.animationName==='st-r15-specular').length}; }); check(!left.pointer&&!left.intent&&!left.x&&!left.y&&left.running===0,'pointer: clean leave reset',left,'product-pointer');
  report.pointer={active,held,left}; persist(); await context.close();
}

async function keyboardCheck() {
  const vp={name:'1440x900-keyboard',width:1440,height:900,kind:'desktop'}; const {context,page}=await basePage('en',vp); await triggerEntry(page); await waitCalm(page);
  const top=page.locator('#selected-thinking-r1 .selected-thinking-r1__archive-top'); await top.focus();
  const tf=await page.evaluate(()=>{const e=document.querySelector('.selected-thinking-r1__archive-top'),c=getComputedStyle(e);return{active:document.activeElement===e,width:parseFloat(c.outlineWidth||'0'),style:c.outlineStyle};}); check(tf.active&&tf.width>=1&&tf.style!=='none','keyboard: top CTA focus visible',tf,'a11y');
  const lead=page.locator('#selected-thinking-r1 .selected-thinking-r1__lead h3 a'); await lead.focus(); await page.waitForTimeout(80);
  const lf=await page.evaluate(()=>{const e=document.querySelector('.selected-thinking-r1__lead h3 a'),c=getComputedStyle(e);return{active:document.activeElement===e,width:parseFloat(c.outlineWidth||'0'),style:c.outlineStyle};}); check(lf.active&&lf.width>=1&&lf.style!=='none','keyboard: lead focus visible',lf,'a11y'); await context.close();
}

async function reducedCheck(lang) {
  const vp={name:'1440x900-reduced',width:1440,height:900,kind:'desktop'}; const {context,page}=await basePage(lang,vp,'reduce'); await triggerEntry(page); await page.waitForTimeout(80);
  const d=await page.evaluate(() => { const root=document.querySelector('#selected-thinking-r1'),fw=root.querySelector('.selected-thinking-r1__framework--lead'),mat=root.querySelector('.selected-thinking-r15__material'),idx=root.querySelector('.selected-thinking-r15__index'); return {reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,visible:root.innerText.length>100&&getComputedStyle(root).visibility!=='hidden',running:document.getAnimations().filter(a=>a.playState==='running'&&String(a.animationName||'').startsWith('st-r15-')).map(a=>a.animationName),signal:getComputedStyle(fw,'::after').animationName,material:getComputedStyle(mat,'::after').animationName,indexColor:getComputedStyle(idx).color,topHeight:root.querySelector('.selected-thinking-r1__archive-top').getBoundingClientRect().height}; });
  check(d.reduced&&d.visible&&alphaFromCssColor(d.indexColor)>=.035&&d.topHeight>=43.5,`${lang}: reduced motion keeps static authority`,d,'reduced-motion');
  check(d.running.length===0&&d.signal==='none'&&d.material==='none',`${lang}: reduced motion has zero travelling motion`,d,'reduced-motion'); report.reducedMotion[lang]=d; persist(); await context.close();
}

async function stabilize(page) {
  await waitFonts(page);
  await page.evaluate(() => { const s=document.querySelector('#selected-thinking-r1'); document.getAnimations().forEach(a=>{const t=a.effect?.target;if(t&&s&&!s.contains(t)){try{a.pause();}catch{}}}); document.querySelectorAll('canvas').forEach(c=>{if(!s?.contains(c))c.style.visibility='hidden';}); });
}

async function shot(page,name) {
  await stabilize(page);
  const rect=await page.evaluate(()=>{const r=document.querySelector('#selected-thinking-r1').getBoundingClientRect();return{x:r.left+scrollX,y:r.top+scrollY,width:r.width,height:r.height};});
  const session=await page.context().newCDPSession(page); const res=await session.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:true,clip:{...rect,scale:1}}); await session.detach();
  const buf=Buffer.from(res.data,'base64'), file=path.join(OUT,name); fs.writeFileSync(file,buf); const png=PNG.sync.read(buf); let n=0,sum=0,sum2=0,min=255,max=0; const step=Math.max(1,Math.floor(Math.min(png.width,png.height)/180));
  for(let y=0;y<png.height;y+=step)for(let x=0;x<png.width;x+=step){const i=(png.width*y+x)<<2,a=png.data[i+3]/255,l=(.2126*png.data[i]+.7152*png.data[i+1]+.0722*png.data[i+2])*a;n++;sum+=l;sum2+=l*l;min=Math.min(min,l);max=Math.max(max,l);}
  const mean=sum/n,variance=sum2/n-mean*mean,stats={width:png.width,height:png.height,bytes:buf.length,min,max,spread:max-min,mean,variance}; const valid=png.width>=300&&png.height>=300&&buf.length>=15000&&stats.spread>=24&&stats.variance>=25; report.screenshots[name]={valid,...stats}; check(valid,`${name}: nonblank image gate`,stats,'evidence'); persist();
}

async function settledShot(lang,vp,name){const {context,page}=await basePage(lang,vp);await triggerEntry(page);await waitCalm(page);await shot(page,name);await context.close();}
async function midEntryShot(){const vp={name:'mid-entry',width:1440,height:900,kind:'desktop'};const {context,page}=await basePage('en',vp);await triggerEntry(page);await page.waitForFunction(()=>document.getAnimations().some(a=>a.playState==='running'&&a.animationName==='st-r15-signal'),null,{timeout:1800});await shot(page,'desktop-en-mid-entry.png');await context.close();}
async function pointerShot(){const vp={name:'pointer-shot',width:1440,height:900,kind:'desktop'};const {context,page}=await basePage('en',vp);await triggerEntry(page);await waitCalm(page);const lead=page.locator('#selected-thinking-r1 .selected-thinking-r1__lead'),box=await lead.boundingBox();if(!box)check(false,'desktop-en-pointer-material.png: no lead box',null,'evidence');else{await page.mouse.move(box.x+box.width*.34,box.y+box.height*.38);await page.waitForTimeout(260);await shot(page,'desktop-en-pointer-material.png');}await context.close();}

try {
  for(const lang of ['en','ru']) for(const vp of viewports) await staticCheck(lang,vp);
  await entryCheck('en'); await entryCheck('ru'); await pointerCheck(); await keyboardCheck(); await reducedCheck('en'); await reducedCheck('ru');
  await settledShot('en',{name:'1440-shot',width:1440,height:900,kind:'desktop'},'desktop-en-settled.png');
  await settledShot('ru',{name:'1440-shot',width:1440,height:900,kind:'desktop'},'desktop-ru-settled.png');
  await midEntryShot(); await pointerShot();
  await settledShot('en',{name:'390-shot',width:390,height:844,kind:'mobile'},'mobile-390-en.png');
  await settledShot('en',{name:'landscape-shot',width:852,height:393,kind:'landscape'},'landscape-852x393-en.png');
} catch(e) { check(false,'QA harness unhandled exception',{message:String(e),stack:e?.stack||null},'harness'); }

await browser.close();
check(report.consoleErrors.length===0,'browser console clean',report.consoleErrors,'console');
check(report.selectedAssetFailures.length===0,'R1.5 assets load cleanly',report.selectedAssetFailures,'asset');
const names=['desktop-en-settled.png','desktop-ru-settled.png','desktop-en-mid-entry.png','desktop-en-pointer-material.png','mobile-390-en.png','landscape-852x393-en.png'];
check(names.every(n=>report.screenshots[n]?.valid===true),'all six required screenshots pass nonblank gate',report.screenshots,'evidence');
report.pass=report.failures.length===0;persist();console.log(JSON.stringify({pass:report.pass,checks:report.checks.length,failures:report.failures.length,matrix:report.matrix},null,2));if(!report.pass)process.exit(1);
