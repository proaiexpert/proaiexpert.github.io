/* Targeted EN/RU cross-engine QA for the Connected System CSS Preview Bundle.
 * Runs against Jekyll-compiled _site and records exact layout/state evidence.
 * No production mutation. */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium, webkit } from 'playwright';

const root=path.resolve('_site');
const evidenceDir='connected-system-css-preview-evidence';
fs.mkdirSync(evidenceDir,{recursive:true});
const failures=[],results=[];
const bundleRel='/assets/css/homepage-connected-system-r142-bundled-preview.css';
const bundleFile=path.join(root,bundleRel);
const bundle=fs.readFileSync(bundleFile,'utf8');
const assert=(condition,message)=>{if(!condition)failures.push(message);};
assert(!/@import\s+url\s*\(/.test(bundle),'Bundled CSS contains a nested @import');
for(const layer of ['cs142-base','cs142-r13','cs142-r132','cs142-r141'])assert(bundle.includes('@layer '+layer+' {'),'Missing cascade layer '+layer);
for(const lang of ['en','ru']){
 const doc=fs.readFileSync(path.join(root,lang==='ru'?'ru/index.html':'index.html'),'utf8');
 assert(doc.includes(bundleRel),'Missing preview CSS link: '+lang);
 assert(!doc.includes('/assets/css/homepage-connected-system-r142.css?v='),'Legacy nested CSS still linked: '+lang);
}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.mjs':'application/javascript; charset=utf-8','.svg':'image/svg+xml','.json':'application/json','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 let pathname;
 try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
 if(pathname.endsWith('/'))pathname+='index.html';
 const filename=path.resolve(root,'.'+pathname);
 if(!filename.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 if(!fs.existsSync(filename)||!fs.statSync(filename).isFile()){res.writeHead(404).end();return;}
 res.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream'});
 fs.createReadStream(filename).pipe(res);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const port=server.address().port;
const viewports=[{width:320,height:740},{width:375,height:812},{width:390,height:844},{width:430,height:932},{width:768,height:1024},{width:1440,height:900}];
try{
 for(const [engine,kind] of [['chromium',chromium],['webkit',webkit]]){
  const browser=await kind.launch({headless:true});
  try{
   for(const lang of ['en','ru']){
    for(const vp of viewports){
     const page=await browser.newPage({viewport:vp,deviceScaleFactor:2,reducedMotion:'no-preference'});
     const row={engine,lang,viewport:vp,failures:[],states:[]};
     try{
      await page.goto(`http://127.0.0.1:${port}/${lang==='ru'?'ru/':''}`,{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForFunction(()=>{const root=document.querySelector('[data-connected-next]');return root && !root.classList.contains('connected-next--nojs');},{timeout:20000});
      await page.waitForTimeout(250);
      const metrics=await page.evaluate(()=>{
       const root=document.querySelector('[data-connected-next]'),ol=root.querySelector('.state-ledger'),artifact=root.querySelector('.context-artifact'),ledger=root.querySelector('.ledger-zone'),button=root.querySelector('.ledger-plate');
       const rect=ledger.getBoundingClientRect();
       const css=[...document.styleSheets].find(s=>s.href?.includes('homepage-connected-system-r142-bundled-preview.css'));
       return {bundleLoaded:!!css,cssRules:css?.cssRules.length||0,orderedList:getComputedStyle(ol).listStyleType,buttonDisplay:getComputedStyle(button).display,artifactPosition:getComputedStyle(artifact).position,ledgerLeft:rect.left,ledgerRight:rect.right,viewportWidth:innerWidth,rootWidth:root.getBoundingClientRect().width,pageScrollWidth:document.documentElement.scrollWidth};
      });
      row.metrics=metrics;
      for(const [ok,msg] of [
       [metrics.bundleLoaded&&metrics.cssRules>0,'CSS did not load'],
       [metrics.orderedList==='none','Ordered-list markers are visible'],
       [metrics.buttonDisplay==='grid','Ledger grid layout missing'],
       [metrics.artifactPosition==='relative','Artifact base positioning missing'],
       [metrics.ledgerLeft>=-2&&metrics.ledgerRight<=vp.width+2,'Ledger crosses viewport horizontally']
      ])if(!ok)row.failures.push(msg);
      if(vp.width===390){
       for(const [target,expected] of [[.10,1],[.35,2],[.60,3],[.89,4],[.60,3],[.35,2],[.10,1]]){
        await page.evaluate(p=>{
         const e=document.querySelector('[data-experience]'),absoluteTop=scrollY+e.getBoundingClientRect().top;
         const travel=Math.max(1,e.offsetHeight-(visualViewport?.height||innerHeight));
         window.scrollTo(0,absoluteTop+p*travel);
        },target);
        await page.waitForTimeout(180);
        const state=await page.locator('[data-connected-next]').getAttribute('data-active-stage');
        row.states.push({target,expected,actual:Number(state)});
        if(Number(state)!==expected)row.failures.push(`Stage scroll ${target}: expected ${expected}, got ${state}`);
       }
       await page.screenshot({path:`${evidenceDir}/${engine}-${lang}-390.png`,fullPage:false});
      }
     }catch(err){row.failures.push(String(err?.message||err).slice(0,400));}
     finally{await page.close();}
     results.push(row);
     for(const x of row.failures)failures.push(`${engine}/${lang}/${vp.width}: ${x}`);
    }
   }
  }finally{await browser.close();}
 }
}finally{await new Promise(resolve=>server.close(resolve));}
const summary={passed:failures.length===0,tests:results.length,engines:['chromium','webkit'],languages:['en','ru'],widths:viewports.map(x=>x.width),failures,results};
fs.writeFileSync(path.join(evidenceDir,'results.json'),JSON.stringify(summary,null,2));
console.log('CONNECTED_SYSTEM_CSS_PREVIEW_QA '+JSON.stringify({passed:summary.passed,tests:summary.tests,failures:summary.failures.slice(0,30)}));
if(failures.length)process.exitCode=1;
