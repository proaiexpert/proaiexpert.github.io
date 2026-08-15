const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const chrome = process.env.CHROME_BIN;
const url = process.env.QA_URL || 'http://127.0.0.1:4173/en.html';
const out = process.env.SCREENSHOT_DIR || 'docs/site-evolution/connected-system-r1/review-r131';
const productSha = process.env.PRODUCT_SHA || '2183da3471eeedeea9500ba721294a7f590248ff';
const viewports = [
  [1440,900,'1440x900'],
  [1366,768,'1366x768'],
  [1280,800,'1280x800'],
  [1200,800,'1200x800']
];
const failures = [];
const report = { productSha, generatedAt:new Date().toISOString(), desktop:{}, mobile:{}, failures };
fs.mkdirSync(out,{recursive:true});
const check=(v,label,detail='')=>{ if(!v) failures.push(detail?`${label}: ${detail}`:label); };

async function openPage(browser,w,h){
  const context=await browser.newContext({viewport:{width:w,height:h}});
  const page=await context.newPage();
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForSelector('[data-connected-system]',{timeout:20000});
  await page.waitForFunction(()=>document.querySelectorAll('[data-system-stage]').length===4,null,{timeout:10000});
  await page.waitForTimeout(900);
  await page.evaluate(()=>{
    const el=document.querySelector('[data-connected-system]');
    const y=el.getBoundingClientRect().top+scrollY;
    scrollTo({top:Math.max(0,y-34),behavior:'instant'});
  });
  await page.waitForTimeout(120);
  return {context,page};
}

async function armSequence(page){
  await page.evaluate(()=>{
    window.__r131Seen=[];
    window.__r131Obs?.disconnect?.();
    const stages=[...document.querySelectorAll('[data-system-stage]')];
    const record=()=>stages.forEach((s,i)=>{if(s.classList.contains('is-active')&&!window.__r131Seen.includes(i))window.__r131Seen.push(i)});
    window.__r131Obs=new MutationObserver(record);
    stages.forEach(s=>window.__r131Obs.observe(s,{attributes:true,attributeFilter:['class']}));
    record();
  });
}

async function replayToResponse(page){
  await armSequence(page);
  const responseSeen=page.evaluate(()=>new Promise((resolve,reject)=>{
    const started=performance.now();
    const poll=()=>{
      const stages=[...document.querySelectorAll('[data-system-stage]')];
      if(stages.length===4&&stages.filter(s=>s.classList.contains('is-active')).length===1&&stages[2].classList.contains('is-active')){
        resolve(stages.map(s=>[...s.classList])); return;
      }
      if(performance.now()-started>5200){reject(new Error('RESPONSE active not observed'));return;}
      requestAnimationFrame(poll);
    };
    poll();
  }));
  await page.locator('[data-replay-system]').evaluate(el=>el.click());
  return responseSeen;
}

async function waitBalanced(page){
  await page.waitForFunction(()=>{
    const s=[...document.querySelectorAll('[data-system-stage]')];
    return s.length===4&&s.every(n=>n.classList.contains('is-balanced'));
  },null,{timeout:6500});
}

async function metrics(page){
  return page.evaluate(()=>{
    const r=el=>{const b=el.getBoundingClientRect();return{left:b.left,right:b.right,top:b.top,bottom:b.bottom,width:b.width,height:b.height}};
    const q=s=>document.querySelector(s);
    const section=q('[data-connected-system]'), shell=q('.cs-shell'), field=q('.cs-system-field'), rail=q('.cs-spine'), carriage=q('.cs-light-carriage');
    const stages=[...document.querySelectorAll('[data-system-stage]')];
    return {
      viewport:{width:innerWidth,height:innerHeight}, scrollWidth:document.documentElement.scrollWidth,
      section:r(section), shell:r(shell), field:r(field), rail:r(rail), carriage:r(carriage),
      hero:r(q('#hero')), heroBg:getComputedStyle(q('#hero')).backgroundColor, sectionBg:getComputedStyle(section).backgroundColor,
      stages:stages.map(s=>({
        box:r(s), joint:r(s.querySelector('.cs-transfer-joint')), name:r(s.querySelector('.cs-stage-name')),
        copy:r(s.querySelector('.cs-stage-copy')), components:r(s.querySelector('.cs-components')), classes:[...s.classList]
      })),
      activeCount:stages.filter(s=>s.classList.contains('is-active')).length
    };
  });
}

function validate(m,key){
  const {viewport,scrollWidth,shell,field,rail,carriage,stages}=m;
  check(scrollWidth<=viewport.width+1,`${key}-overflow`,`${scrollWidth}>${viewport.width}`);
  check(shell.left>=-1&&shell.right<=viewport.width+1,`${key}-shell-bounds`);
  check(rail.left>=field.left-2&&rail.right<=field.right+2,`${key}-rail-bounds`);
  check(carriage.left>=field.left-110&&carriage.right<=field.right+110,`${key}-carriage-x`);
  check(carriage.top>=field.top-120&&carriage.bottom<=field.bottom+120,`${key}-carriage-y`);
  stages.forEach((s,i)=>{
    for(const [name,b] of [['name',s.name],['copy',s.copy],['components',s.components]]){
      check(b.left>=-1&&b.right<=viewport.width+1,`${key}-stage${i+1}-${name}-x`);
      check(b.bottom<=viewport.height+3,`${key}-stage${i+1}-${name}-bottom`,`${b.bottom.toFixed(1)}>${viewport.height}`);
    }
    const jc=(s.joint.top+s.joint.bottom)/2, rc=(rail.top+rail.bottom)/2;
    check(Math.abs(jc-rc)<=7,`${key}-stage${i+1}-joint-rail`,`${jc.toFixed(1)} vs ${rc.toFixed(1)}`);
  });
}

async function hoverQA(page,key){
  for(const i of [0,2,1,3]){
    const stage=page.locator('[data-system-stage]').nth(i);
    await stage.hover({position:{x:50,y:130}});
    try{
      await page.waitForFunction(index=>{
        const s=[...document.querySelectorAll('[data-system-stage]')];
        return s.filter(n=>n.classList.contains('is-active')).length===1&&s[index].classList.contains('is-active');
      },i,{timeout:1800});
    }catch(_){failures.push(`${key}-hover-${i+1}`)}
    check(await page.locator('[data-system-stage].is-active').count()===1,`${key}-hover-${i+1}-single-active`);
    const m=await metrics(page);
    check(m.carriage.left>=m.field.left-110&&m.carriage.right<=m.field.right+110,`${key}-hover-${i+1}-carriage`);
  }
  await page.mouse.move(5,5); await page.waitForTimeout(400);
}

async function desktop(browser,w,h,key){
  console.log(`render ${key}`);
  const {context,page}=await openPage(browser,w,h);
  const caseReport={};
  const classesAtActivation=await replayToResponse(page);
  await page.waitForTimeout(45);
  const response=await metrics(page);
  validate(response,`${key}-response`);
  check(response.activeCount===1,`${key}-one-active`,String(response.activeCount));
  check(response.stages[0].classes.includes('is-settled'),`${key}-trust-settled`,JSON.stringify(response.stages[0].classes));
  check(response.stages[1].classes.includes('is-settled'),`${key}-inquiry-settled`,JSON.stringify(response.stages[1].classes));
  check(response.stages[2].classes.includes('is-active'),`${key}-response-active`,JSON.stringify(response.stages[2].classes));
  check(response.stages[3].classes.includes('is-future'),`${key}-result-future`,JSON.stringify(response.stages[3].classes));
  caseReport.response={classesAtActivation,metrics:response};
  await page.screenshot({path:path.join(out,`en-${key}-response-active.png`),fullPage:false});

  await waitBalanced(page);
  const seen=await page.evaluate(()=>window.__r131Seen||[]);
  check([0,1,2,3].every((n,i)=>seen[i]===n),`${key}-sequence-order`,JSON.stringify(seen));
  const balanced=await metrics(page); validate(balanced,`${key}-balanced`);
  check(balanced.stages.every(s=>s.classes.includes('is-balanced')),`${key}-all-balanced`);
  caseReport.sequenceSeen=seen; caseReport.balanced=balanced;
  if(key==='1440x900'||key==='1200x800') await page.screenshot({path:path.join(out,`en-${key}-final-balanced.png`),fullPage:false});

  await hoverQA(page,key);
  if(key==='1440x900'||key==='1366x768'){
    const gap=Math.round((response.section.top-response.hero.bottom)*100)/100;
    check(Math.abs(gap)<=1,`${key}-hero-gap`,String(gap));
    check(response.heroBg===response.sectionBg,`${key}-hero-bg`,`${response.heroBg} vs ${response.sectionBg}`);
    caseReport.continuity={gap,heroBg:response.heroBg,sectionBg:response.sectionBg};
  }
  report.desktop[key]=caseReport;
  await context.close();
}

async function mobile(browser,w,h,key){
  const {context,page}=await openPage(browser,w,h);
  const stage=page.locator('[data-system-stage]').nth(2);
  await stage.evaluate(el=>{const r=el.getBoundingClientRect();scrollTo({top:scrollY+r.top+r.height/2-innerHeight*.565,behavior:'instant'})});
  await page.waitForTimeout(750);
  const active=await stage.evaluate(el=>el.classList.contains('is-active'));
  await page.evaluate(()=>scrollBy(0,90)); await page.waitForTimeout(180);
  const hidden=await page.locator('[data-site-header]').evaluate(el=>el.classList.contains('header-hidden'));
  await page.evaluate(()=>scrollBy(0,-100)); await page.waitForTimeout(180);
  const shown=!(await page.locator('[data-site-header]').evaluate(el=>el.classList.contains('header-hidden')));
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
  check(active,`${key}-active`); check(hidden,`${key}-header-hide`); check(shown,`${key}-header-show`); check(!overflow,`${key}-overflow`);
  report.mobile[key]={active,hidden,shown,overflow};
  await context.close();
}

(async()=>{
  if(!chrome)throw new Error('CHROME_BIN required');
  const browser=await chromium.launch({executablePath:chrome,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  try{
    for(const [w,h,key] of viewports)await desktop(browser,w,h,key);
    await mobile(browser,390,844,'390x844');
    await mobile(browser,844,390,'844x390');
  }finally{await browser.close()}
  fs.writeFileSync(path.join(out,'qa-report.json'),JSON.stringify(report,null,2));
  if(failures.length){console.error(failures.join('\n'));process.exit(1)}
  console.log('R1.3.1 REAL DESKTOP QA PASS');
})().catch(err=>{try{fs.writeFileSync(path.join(out,'qa-report.json'),JSON.stringify(report,null,2))}catch(_){};console.error(err);process.exit(1)});
