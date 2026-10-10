/* Read-only quick audit against actual proai-expert.com EN/RU production.
 * Exhaustive component geometry+temporal matrix already passed in Run 38075477480. */
import {chromium} from 'playwright';
import fs from 'node:fs';import path from 'node:path';
const OUT='r161-live-production-evidence';fs.mkdirSync(OUT,{recursive:true});
const urls=[['en','https://proai-expert.com/'],['ru','https://proai-expert.com/ru/']];
const views=[['portrait390',390,844],['laptop1440',1440,900]];
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const cases=[],issues=[];
function flag(ok,type,obj){if(!ok)issues.push({type,...obj})}
async function capture(page,file){
 const cdp=await page.context().newCDPSession(page);
 try {
  const shot=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});
  fs.writeFileSync(file,Buffer.from(shot.data,'base64'));
 }finally{await cdp.detach()}
}

async function go(page,p){await page.evaluate(p=>{document.documentElement.style.scrollBehavior='auto';document.body.style.scrollBehavior='auto';const root=document.querySelector('.home-tech-r161'),el=root?.querySelector('[data-ff-story]');if(!el)return;const a=el.getBoundingClientRect(),h=root.querySelector('.home-tech-ff__sticky').getBoundingClientRect().height;scrollTo({top:scrollY+a.top+(a.height-h)*p,behavior:'instant'});},p);await page.waitForTimeout(320)}
async function inspect(page){return page.evaluate(()=>{
 const s=document.querySelector('.home-tech-r161'),panel=s?.querySelector('.home-tech-ff__stage[aria-hidden="false"]'),outcome=panel?.querySelector('.home-tech-r161__outcome');
 const imgs=[...s.querySelectorAll('.home-tech-ff__vendor img')];
 const nav=document.querySelector('[data-site-header]'),heading=s.querySelector('.home-tech-ff__heading h2');
 const navr=nav?.getBoundingClientRect(),headr=heading?.getBoundingClientRect();
 const headerOverlap=!!(navr&&headr&&navr.bottom>headr.top&&navr.top<headr.bottom&&navr.width>0&&navr.height>0);

 return {headerOverlap,headerClass:nav?.className,headerTop:navr?.top,headingTop:headr?.top,stage:s?.dataset.ffStage,phase:s?.dataset.ffPhase,outcome:s?.dataset.ffOutcome,progress:parseFloat(s?.style.getPropertyValue('--ff-progress')),techCount:document.querySelectorAll('[data-home-tech-fold-flow]').length,oldHooks:[...document.querySelectorAll('link[href],script[src]')].filter(n=>/home-technology-fold-flow-r1-5-1/.test(n.outerHTML)).length,brands:imgs.length,brokenImages:imgs.filter(n=>n.complete&&!n.naturalWidth).map(n=>n.src),vendorVisible:panel?getComputedStyle(panel).opacity:null,outcomeOpacity:outcome?+getComputedStyle(outcome).opacity:null,hasBefore:!!document.querySelector('[data-tw-r5]'),hasAfter:!!document.querySelector('[data-fs-showcase-r11]'),documentWidth:document.documentElement.scrollWidth,viewport:innerWidth,finalTitle:!!s.querySelector('.home-tech-ff__resolution h3'),results:document.querySelectorAll('.home-tech-r161__outcome').length};
});}
try{
 for(const [lang,url] of urls)for(const [name,width,height] of views){
  const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'no-preference'});
  const page=await ctx.newPage();page.setDefaultTimeout(10000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  console.log('START '+lang+' '+name+' '+url);
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:40000});
  await page.locator('.home-tech-r161.is-enhanced').waitFor({timeout:15000});
  await go(page,.27);const read=await inspect(page);
  flag(read.stage==='understand'&&read.outcome==='established'&&read.outcomeOpacity>.75,'unreadable-understand',{lang,name,read});
  flag(read.techCount===1&&read.oldHooks===0&&read.brands===10&&read.results===4,'duplication-or-missing-content',{lang,name,read});
  flag(read.hasBefore&&read.hasAfter,'neighbor-seam',{lang,name,read});
  flag(read.brokenImages.length===0,'broken-technology-assets',{lang,name,read});
  flag(read.documentWidth<=width+3,'global-horizontal-overflow',{lang,name,read});
  await capture(page,path.join(OUT,lang+'-'+name+'-understand.png'));
  await go(page,.972);const final=await inspect(page);
  flag(final.stage==='resolved'&&final.finalTitle,'missing-final',{lang,name,final});
  await capture(page,path.join(OUT,lang+'-'+name+'-final.png'));
  flag(!errors.length,'javascript-exception',{lang,name,errors});
  cases.push({lang,name,width,height,read,final,errors});
  console.log('LIVE_VIEWPORT '+JSON.stringify({lang,name,understand:read.stage,result:read.outcome,final:final.stage,brands:read.brands,overflow:read.documentWidth-width,errors:errors.length}));
  await ctx.close();
 }
}finally{await browser.close()}
fs.writeFileSync(path.join(OUT,'results.json'),JSON.stringify({issues,cases},null,2));
console.log('R161_LIVE_SMOKE_RESULT '+JSON.stringify({pass:issues.length===0,viewports:cases.length,issues:issues.slice(0,20)}));
if(issues.length)process.exitCode=1;
