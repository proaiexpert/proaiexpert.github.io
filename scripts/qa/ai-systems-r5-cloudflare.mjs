import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const BASE='https://ai-systems-r5-preview.proaiexpert-github-io.pages.dev';
const cases=[
  {locale:'en',name:'desktop-1440',width:1440,height:900,url:'/owner-preview/ai-systems-r5-release-candidate-r1/'},
  {locale:'en',name:'portrait-390',width:390,height:844,url:'/owner-preview/ai-systems-r5-release-candidate-r1/'},
  {locale:'ru',name:'desktop-1440',width:1440,height:900,url:'/owner-preview/ai-systems-r5-release-candidate-r1/ru/'},
  {locale:'ru',name:'portrait-390',width:390,height:844,url:'/owner-preview/ai-systems-r5-release-candidate-r1/ru/'}
];
const output='ai-systems-r5-cloudflare-evidence';
fs.mkdirSync(output,{recursive:true});
const report={githubSha:process.env.GITHUB_SHA||null,base:BASE,environment:'headless Chromium on GitHub Actions; not a physical iPhone',cases:[],errors:[]};
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
for(const item of cases){
  const id=item.locale+'-'+item.name;
  const context=await browser.newContext({viewport:{width:item.width,height:item.height},javaScriptEnabled:true,reducedMotion:'no-preference'});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  try{
    const response=await page.goto(BASE+item.url,{waitUntil:'domcontentloaded',timeout:30000});
    assert.equal(response.status(),200,'Cloudflare HTTP status');
    await page.waitForFunction(()=>document.querySelector('[data-r4-runtime]')?.dataset.runtimeValid==='true',null,{timeout:15000});
    await page.evaluate(async()=>{await document.fonts.ready;});
    const info=await page.evaluate(()=>{
      const styles=[...document.styleSheets].filter(s=>s.href&&s.href.includes('ai-systems')).map(s=>s.href);
      const iframe=document.querySelector('.ai-r4-hero__visual iframe');
      const runtime=document.querySelector('[data-r4-runtime]');
      return {
        title:document.title,
        h1:document.querySelector('h1')?.innerText,
        robots:document.querySelector('meta[name="robots"]')?.content,
        rtl:document.documentElement.lang,
        viewport:innerWidth,
        scrollWidth:document.documentElement.scrollWidth,
        heroRect:document.querySelector('.ai-r4-hero__visual')?.getBoundingClientRect().toJSON(),
        iframeSrc:iframe?.getAttribute('src'),
        iframeReady:iframe?.contentDocument?.readyState,
        sheetCount:styles.length,
        runtimeValid:runtime?.dataset.runtimeValid,
        runtimeLedger:document.querySelectorAll('[data-runtime-event-index]').length,
        proofLinks:document.querySelectorAll('.ai-r5-proof-links a').length,
        cta:document.querySelector('.ai-r4-hero__actions a')?.getAttribute('href')
      };
    });
    assert.equal(info.robots,'noindex,nofollow');
    assert.equal(info.rtl,item.locale);
    assert.ok(info.h1?.length>20,'Hero H1 visible');
    assert.ok(info.heroRect?.width>100&&info.heroRect?.height>100,'Hero composition geometry');
    assert.ok(info.iframeSrc?.includes('ai-hero-'+item.locale+'.html'),'correct existing Hero asset');
    assert.ok(info.sheetCount>=3,'all CSS stylesheets present');
    assert.equal(info.runtimeLedger,17);
    assert.equal(info.proofLinks,3);
    assert.ok(info.scrollWidth<=info.viewport+2,'horizontal overflow');
    assert.equal(errors.length,0,'JavaScript exceptions '+errors.join('; '));
    await page.screenshot({path:path.join(output,id+'.png'),animations:'disabled',timeout:25000});
    report.cases.push({id,status:'PASS',info,errors});
    console.log('CLOUDFLARE_BROWSER_PASS',id,JSON.stringify({runtime:info.runtimeValid,ledger:info.runtimeLedger,sheets:info.sheetCount,iframe:info.iframeSrc,viewport:info.viewport,overflow:info.scrollWidth-info.viewport}));
  }catch(e){
    report.cases.push({id,status:'FAIL',reason:String(e)});
    report.errors.push({id,reason:String(e)});
    console.error('CLOUDFLARE_BROWSER_FAIL',id,String(e));
    try{await page.screenshot({path:path.join(output,id+'-fail.png'),timeout:7000})}catch{}
  }finally{await context.close();}
}
await browser.close();
fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));
console.log('CLOUDFLARE_BROWSER_RESULT',JSON.stringify({sha:report.githubSha,passed:report.cases.filter(c=>c.status==='PASS').length,failed:report.errors.length}));
if(report.errors.length)process.exitCode=1;
