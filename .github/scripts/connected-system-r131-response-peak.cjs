const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const chrome = process.env.CHROME_BIN;
const url = process.env.QA_URL || 'http://127.0.0.1:4173/persistent-en.html';
const out = process.env.SCREENSHOT_DIR || 'docs/site-evolution/connected-system-r1/review-r131';
const viewports = [[1440,900,'1440x900'],[1366,768,'1366x768'],[1280,800,'1280x800'],[1200,800,'1200x800']];
const failures=[];
const fail=(m)=>failures.push(m);
function luminance(rgb){const m=String(rgb).match(/[\d.]+/g)||[];return((+m[0]||0)*.2126)+((+m[1]||0)*.7152)+((+m[2]||0)*.0722)}

async function capture(browser,w,h,key){
  const context=await browser.newContext({viewport:{width:w,height:h},reducedMotion:'no-preference'});
  const page=await context.newPage();
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForSelector('[data-connected-system]',{timeout:20000});
  await page.waitForTimeout(900);
  await page.evaluate(()=>{const e=document.querySelector('[data-connected-system]');scrollTo({top:Math.max(0,e.getBoundingClientRect().top+scrollY-34),behavior:'instant'})});
  await page.waitForTimeout(120);
  const responseActive=page.evaluate(()=>new Promise((resolve,reject)=>{
    const s=[...document.querySelectorAll('[data-system-stage]')];let done=false;
    const inspect=()=>{if(done)return;const active=s.filter(n=>n.classList.contains('is-active'));if(active.length===1&&s[2].classList.contains('is-active')){done=true;obs.disconnect();clearTimeout(timer);resolve(true)}};
    const obs=new MutationObserver(inspect);s.forEach(n=>obs.observe(n,{attributes:true,attributeFilter:['class']}));
    const timer=setTimeout(()=>{done=true;obs.disconnect();reject(new Error(`${key}: RESPONSE active not observed`))},5200);inspect();
  }));
  await page.locator('[data-replay-system]').evaluate(el=>el.click());
  await responseActive;
  // 340ms title interpolation + 350ms one-shot specular. Around 190ms is the material reflection peak while RESPONSE remains sole active stage.
  await page.waitForTimeout(190);
  const visual=await page.evaluate(()=>{
    const s=[...document.querySelectorAll('[data-system-stage]')];
    return{classes:s.map(n=>[...n.classList]),activeCount:s.filter(n=>n.classList.contains('is-active')).length,titleColors:s.map(n=>getComputedStyle(n.querySelector('.cs-stage-name')).color),spec:parseFloat(getComputedStyle(s[2].querySelector('.cs-type-specular')).opacity),overflow:document.documentElement.scrollWidth>innerWidth+1};
  });
  if(visual.activeCount!==1)fail(`${key}: activeCount=${visual.activeCount}`);
  if(!visual.classes[0].includes('is-settled'))fail(`${key}: TRUST not settled`);
  if(!visual.classes[1].includes('is-settled'))fail(`${key}: INQUIRY not settled`);
  if(!visual.classes[2].includes('is-active'))fail(`${key}: RESPONSE not active`);
  if(!visual.classes[3].includes('is-future'))fail(`${key}: RESULT not future`);
  if(visual.overflow)fail(`${key}: horizontal overflow`);
  if(!(visual.spec>.18))fail(`${key}: type specular below visible peak (${visual.spec})`);
  const lum=visual.titleColors.map(luminance);
  console.log(`${key} visual peak`,JSON.stringify({classes:visual.classes,colors:visual.titleColors,baseLuminance:lum,spec:visual.spec}));
  await page.screenshot({path:path.join(out,`en-${key}-response-active.png`),fullPage:false});
  await context.close();
}

(async()=>{
  if(!chrome)throw new Error('CHROME_BIN required');fs.mkdirSync(out,{recursive:true});
  const browser=await chromium.launch({executablePath:chrome,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  try{for(const[w,h,key]of viewports)await capture(browser,w,h,key)}finally{await browser.close()}
  if(failures.length){console.error(failures.join('\n'));process.exit(1)}
  console.log('R1.3.1 RESPONSE VISUAL PEAK CAPTURE PASS');
})().catch(e=>{console.error(e);process.exit(1)});
