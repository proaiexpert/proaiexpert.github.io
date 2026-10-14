import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
const base = 'http://127.0.0.1:8765';
const dir = 'ai-systems-r5-qa';
fs.mkdirSync(dir,{recursive:true});
const cases = [
  {key:'desktop-1440',width:1440,height:900},
  {key:'desktop-1280',width:1280,height:800},
  {key:'portrait-430',width:430,height:932},
  {key:'portrait-393',width:393,height:852},
  {key:'portrait-390',width:390,height:844},
  {key:'portrait-375',width:375,height:812},
  {key:'landscape-844',width:844,height:390},
  {key:'landscape-780',width:780,height:360}
];
const report = {head:process.env.GITHUB_SHA||null,started:new Date().toISOString(),cases:[],failures:[],environment:'headless Chromium; mobile browser emulation, not a physical iPhone'};
const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
const eventNames=['INCOMING_REQUEST','STATE_VALIDATED','CONTEXT_RECOVERED','POLICY_CHECK','TOOL_CALL','TOOL_FAILURE','RETRY','FALLBACK','MACHINE_STOPPED','AUTHORITY_APPROVED','ACTION'];
function fail(label,e){report.failures.push({label,message:String(e.stack||e)});console.error('FAIL',label,e.message||e);}
async function auditOne(locale,view) {
  const label=locale+'-'+view.key;
  const context=await browser.newContext({viewport:{width:view.width,height:view.height},reducedMotion:'no-preference',javaScriptEnabled:true});
  const page=await context.newPage();
  page.setDefaultTimeout(12000);
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e.message)));
  try {
    const url=base+(locale==='ru'?'/ru/ai-systems/':'/ai-systems/');
    const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
    assert.equal(response.status(),200,'HTTP');
    await page.waitForFunction(()=>{const el=document.querySelector('[data-r4-runtime]');return !!el && el.dataset.runtimeValid!=='pending';},null,{timeout:10000});
    const valid=await page.locator('[data-r4-runtime]').getAttribute('data-runtime-valid');
    assert.equal(valid,'true','reference runtime source binding');
    assert.equal(await page.locator('h1').count(),1,'H1');
    assert.equal(await page.locator('[data-runtime-ledger] [data-runtime-event-index]').count(),17,'immutable trace length');
    const links=await page.locator('.ai-r5-proof-links a').count();
    assert.equal(links,3,'direct proof links');
    assert.equal(await page.locator('.ai-r5-insights a').count(),3,'Insights');
    assert.equal(await page.locator('.ai-r4-evidence-metrics').count(),0,'unverified metrics removed');
    const topInfo=await page.evaluate(()=>({
       title:document.title, width:document.documentElement.scrollWidth, inner:window.innerWidth,
       sections:document.querySelectorAll('main>section').length,
       hero:document.querySelector('.ai-r4-hero__visual')?.getBoundingClientRect().toJSON(),
       header:document.querySelector('[data-site-header]')?.getBoundingClientRect().toJSON(),
       sheets:[...document.styleSheets].filter(x=>x.href&&x.href.includes('ai-systems-')).length,
       schema:[...document.querySelectorAll('script[type="application/ld+json"]')].map(x=>JSON.parse(x.textContent)["@graph"]?.map(y=>y["@type"]))
    }));
    assert.ok(topInfo.inner+2>=topInfo.width,'horizontal overflow '+topInfo.width+'/'+topInfo.inner);
    assert.ok(topInfo.sheets>=3,'stylesheets parsed in DOM');
    assert.equal(topInfo.schema.length,1,'one JSON-LD graph');
    assert.deepEqual(topInfo.schema[0],['WebPage','Service'],'main graph maintained');
    if(view.width>=1280||view.width===390||view.width===844) {
      await page.screenshot({path:path.join(dir,label+'-hero.png'),animations:'disabled',timeout:7000});
    }
    // The fixture executes inside the Chromium document; Node is not the document.
    const trace=await page.evaluate(async()=>{
      const m=await import('/assets/js/controlled-agent-reference.mjs');
      const x=await m.runControlledAgent({id:'QA',subject:'Controlled CRM change',action:'change_record',route:'operations'},
        {registry:m.createReferenceRegistry({failPreviewAttempts:2}),approval:true,retryLimit:1});
      return x.trace.map(e=>e.type);
    });
    assert.equal(trace.length,17,'fixture 17-event trace');
    for(const name of eventNames) assert.ok(trace.includes(name),'trace missing '+name);
    assert.ok(trace.indexOf('MACHINE_STOPPED')<trace.indexOf('AUTHORITY_APPROVED'),'approval ordering');
    assert.ok(trace.indexOf('AUTHORITY_APPROVED')<trace.indexOf('ACTION'),'action ordering');
    const weights=trace.map(name=>name==='MACHINE_STOPPED'?4.6:name==='HUMAN_AUTHORITY_REQUIRED'?1.45:name==='AUTHORITY_APPROVED'?1.35:1);
    const total=weights.reduce((a,b)=>a+b,0);
    for(const name of eventNames) {
      const idx=trace.indexOf(name);
      const center=(weights.slice(0,idx).reduce((a,b)=>a+b,0)+weights[idx]*0.54)/total;
      await page.evaluate((p)=>{
        const el=document.querySelector('[data-r4-runtime-story]');
        const top=el.getBoundingClientRect().top+window.scrollY;
        const travel=Math.max(1,el.getBoundingClientRect().height-(window.visualViewport?.height||window.innerHeight));
        window.scrollTo({top:top+travel*p,behavior:'instant'});
      },center);
      const expectedState=name.toLowerCase().replaceAll('_','-');
      await page.waitForFunction(expected => document.querySelector('[data-r4-runtime]')?.dataset.runtimeState===expected, expectedState, {timeout:2500});
      const state=await page.locator('[data-r4-runtime]').getAttribute('data-runtime-state');
      const active=await page.locator('[data-runtime-ledger] [aria-current="step"]').count();
      assert.equal(state,name.toLowerCase().replaceAll('_','-'),label+' visual runtime event '+name+' observed '+state);
      assert.equal(active,1,name+' ledger active state');
      assert.ok(await page.locator('[data-runtime-active-title]').isVisible(),name+' active visual title visible');
      assert.ok(await page.locator('[data-runtime-ledger] [aria-current="step"]').isVisible(),name+' active ledger row visible');
    }
    // Reverse after ACTION, then fast scroll back to the end: no invalid or stuck state.
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.waitForFunction(()=>document.querySelector('[data-r4-runtime]')?.dataset.runtimeState==='incoming-request',null,{timeout:2500});
    assert.equal(await page.locator('[data-r4-runtime]').getAttribute('data-runtime-state'),'incoming-request','reverse scroll state');
    await page.evaluate(()=>window.scrollTo({top:document.body.scrollHeight,behavior:'instant'}));
    await page.waitForFunction(()=>document.querySelector('[data-r4-runtime]')?.dataset.runtimeState==='action',null,{timeout:2500});
    assert.equal(await page.locator('[data-r4-runtime]').getAttribute('data-runtime-valid'),'true','fast scroll still valid');
    assert.equal(await page.locator('[data-r4-runtime]').getAttribute('data-runtime-state'),'action','fast scroll final state');
    assert.equal(errors.length,0,'JS errors: '+errors.join(' | '));
    if(view.width===390) {
       await page.locator('[data-r4-runtime]').screenshot({path:path.join(dir,label+'-runtime.png'),animations:'disabled',timeout:7000,timeout:20000});
    }
    report.cases.push({label,status:'PASS',width:view.width,height:view.height,traceEvents:trace.length,checkedEvents:eventNames,topInfo});
    console.log('PASS',label);
  }catch(e){fail(label,e);report.cases.push({label,status:'FAIL',error:String(e.message||e)});try{await page.screenshot({path:path.join(dir,label+'-failure.png'),animations:'disabled',timeout:7000})}catch{}}
  finally{await context.close();}
}
for(const locale of ['en','ru']) for(const view of cases) await auditOne(locale,view);
for(const locale of ['en','ru']) {
  const label=locale+'-reduced-motion';
  const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const p=await ctx.newPage();
  try{
    await p.goto(base+(locale==='ru'?'/ru/ai-systems/':'/ai-systems/'),{waitUntil:'domcontentloaded'});
    await p.waitForFunction(()=>document.querySelector('[data-r4-runtime]')?.dataset.runtimeValid==='true',null,{timeout:10000});
    assert.equal(await p.locator('[data-ai-r4-page]').getAttribute('data-motion'),'reduced');
    assert.equal(await p.locator('[data-r4-runtime]').getAttribute('data-runtime-state'),'action');
    report.cases.push({label,status:'PASS'});
  }catch(e){fail(label,e);}finally{await ctx.close();}
  const nojsLabel=locale+'-no-javascript';
  const c=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});
  const q=await c.newPage();
  try{
    await q.goto(base+(locale==='ru'?'/ru/ai-systems/':'/ai-systems/'),{waitUntil:'domcontentloaded'});
    assert.ok(await q.locator('h1').isVisible(),'H1 visible without JS');
    assert.ok(await q.locator('.ai-r5-nojs').isVisible(),'technical fallback visible without JS');
    assert.ok(await q.locator('.ai-r5-proof-links a').count()===3);
    assert.ok(await q.locator('.ai-r4-evidence-section').isVisible());
    report.cases.push({label:nojsLabel,status:'PASS'});
  }catch(e){fail(nojsLabel,e);}finally{await c.close();}
}
for(const locale of ['en','ru']){
  const preview=locale==='ru'?'/owner-preview/ai-systems-r5-release-candidate-r1/ru/':'/owner-preview/ai-systems-r5-release-candidate-r1/';
  const ctx=await browser.newContext();
  const p=await ctx.newPage();
  try{
    const r=await p.goto(base+preview,{waitUntil:'domcontentloaded'});
    assert.equal(r.status(),200);
    assert.equal(await p.locator('meta[name="robots"]').getAttribute('content'),'noindex,nofollow');
    assert.equal(await p.locator('script[type="application/ld+json"]').count(),1);
    assert.ok(await p.locator('h1').isVisible());
    report.cases.push({label:'preview-'+locale,status:'PASS'});
  }catch(e){fail('preview-'+locale,e);}finally{await ctx.close();}
}
report.finished=new Date().toISOString();
fs.writeFileSync(path.join(dir,'report.json'),JSON.stringify(report,null,2));
await browser.close();
console.log(JSON.stringify({passed:report.cases.filter(x=>x.status==='PASS').length,failed:report.failures.length,report:path.join(dir,'report.json')}));
if(report.failures.length)process.exitCode=1;