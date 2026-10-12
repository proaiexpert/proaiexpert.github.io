import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium, webkit } from 'playwright';

const OUT='connected-system-r2-evidence';
fs.mkdirSync(OUT,{recursive:true});
const base='http://127.0.0.1:8787/owner-preview/connected-system-r2/';
const errors=[];
const cases=[];
const delay=(ms)=>new Promise(r=>setTimeout(r,ms));
const viewports=[
  {name:'laptop',width:1366,height:768,desktop:true},
  {name:'owner-laptop',width:1837,height:800,desktop:true},
  {name:'portrait',width:390,height:844,desktop:false},
  {name:'landscape',width:844,height:390,desktop:false}
];
const states=[1,2,3,4,3,2,1];
const progress=[.08,.35,.6,.88,.6,.35,.08];

async function atProgress(page,mode,p) {
  await page.evaluate(({mode,p})=>{
    const ex=document.querySelector('[data-experience]');
    const stage=document.querySelector('.connected-next__sticky-stage');
    const top=ex.getBoundingClientRect().top + window.scrollY;
    let y;
    if(mode==='desktop'){
      const s=parseFloat(getComputedStyle(stage).top);
      const h=stage.getBoundingClientRect().height;
      const pad=parseFloat(getComputedStyle(ex).paddingTop)||0;
      const entry=s-pad;
      const runway=ex.getBoundingClientRect().height-h-pad;
      y=top-entry+p*runway;
    }else{
      const viewport=window.visualViewport?.height||window.innerHeight;
      y=top+p*Math.max(1,ex.offsetHeight-viewport);
    }
    window.scrollTo({top:y,behavior:'instant'});
  },{mode,p});
  await delay(135);
}
async function testBrowser(engine,engineName){
  const browser=await engine.launch({headless:true});
  try{
    for(const locale of ['en','ru']){
      for(const v of viewports){
        const context=await browser.newContext({viewport:{width:v.width,height:v.height},deviceScaleFactor:1,hasTouch:!v.desktop,isMobile:!v.desktop});
        const page=await context.newPage();
        page.on('pageerror',e=>errors.push(engineName+'/'+locale+'/'+v.name+': '+e.message));
        const url=base+(locale==='ru'?'ru/':'');
        const res=await page.goto(url,{waitUntil:'domcontentloaded'});
        assert.equal(res?.status(),200,url);
        const root=page.locator('[data-connected-next]');
        assert.equal(await root.count(),1,'one Connected System');
        const next=page.locator('[data-tw-r2]');
        assert.equal(await next.count(),1,'one Two Worlds section');
        const got=[];
        for(let i=0;i<progress.length;i++){
          await atProgress(page,v.desktop?'desktop':'mobile',progress[i]);
          const state=Number(await root.getAttribute('data-active-stage'));
          got.push(state);
          if(i===0||i===3){
            await page.screenshot({path:path.join(OUT,engineName+'-'+locale+'-'+v.name+'-0'+(i===0?1:4)+'.png'),fullPage:false});
          }
          const width=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
          assert.ok(width<=3,'horizontal overflow '+width+' '+engineName+' '+locale+' '+v.name);
        }
        assert.deepEqual(got,states,engineName+' '+locale+' '+v.name+' progression');
        if(v.desktop){
          const bounds=await page.evaluate(()=>{
            const stage=document.querySelector('.connected-next__sticky-stage').getBoundingClientRect();
            return {top:stage.top,bottom:stage.bottom,viewport:innerHeight};
          });
          assert.ok(bounds.top>=96,'header collision: '+JSON.stringify(bounds));
          assert.ok(bounds.bottom<=bounds.viewport+2,'bottom cutoff '+JSON.stringify(bounds));
        }
        const detail=await root.locator('.ledger-plate.is-active .ledger-detail').count();
        assert.equal(detail,1,'one active reading panel');
        cases.push({engine:engineName,locale,viewport:v.name,states:got,status:'PASS'});
        await context.close();
      }
      const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
      const page=await context.newPage();
      await page.goto(base+(locale==='ru'?'ru/':''),{waitUntil:'domcontentloaded'});
      assert.equal(await page.locator('[data-connected-next]').getAttribute('data-active-stage'),'4','reduced motion result');
      await context.close();
    }
  }finally{await browser.close()}
}
try{
  await testBrowser(chromium,'chromium');
  await testBrowser(webkit,'webkit');
  const c=await chromium.launch();
  const noJs=await c.newContext({javaScriptEnabled:false});
  const page=await noJs.newPage();
  await page.goto(base,{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('[data-connected-next]').getAttribute('data-active-stage'),'4');
  assert.equal(await page.locator('.ledger-plate').count(),4);
  await c.close();
  assert.deepEqual(errors,[],errors.join('\n'));
  fs.writeFileSync(path.join(OUT,'results.json'),JSON.stringify({status:'PASS',cases,errors},null,2));
  console.log('CONNECTED SYSTEM R2 QA PASS',cases.length,'browser/locale/viewport suites');
}catch(e){
  fs.writeFileSync(path.join(OUT,'results.json'),JSON.stringify({status:'FAIL',error:String(e),cases,errors},null,2));
  console.error('CONNECTED SYSTEM R2 QA FAILED',e);
  process.exitCode=1;
}
