import fs from 'node:fs';
import {chromium} from 'playwright-core';

const chrome=process.env.CHROME_BIN;
if(!chrome)throw new Error('CHROME_BIN missing');
const out=process.env.QA_OUT||'review-evidence/startup-capability';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:chrome,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=swiftshader','--enable-webgl']});
const page=await browser.newPage({viewport:{width:420,height:420}});
await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
await page.waitForFunction(()=>window.__R443_STARTUP_CAPABILITY__?.get,{timeout:20000});
const initial=await page.evaluate(()=>window.__R443_STARTUP_CAPABILITY__.get());
const targets=[1000,1500,2000,2500,3000,3200,3500,4000,4500,5000,5500,6000,6500,7000,8000,9000,10000];
const samples=[];
for(const target of targets){
  await page.waitForFunction(t=>window.__R443_STARTUP_CAPABILITY__.get().relativeMs>=t,target,{timeout:12000,polling:16});
  samples.push(await page.evaluate(()=>window.__R443_STARTUP_CAPABILITY__.get()));
}
const result={initial,targets,samples};
fs.writeFileSync(`${out}/startup-capability.json`,JSON.stringify(result,null,2));
for(const s of samples){
  console.log(`REL=${s.relativeMs.toFixed(1)} ELIG=${s.relativeEligibilityMs.toFixed(1)} STATE=${s.safeStateId} PHRASE=${s.currentPhraseId||'NONE'} ACTIVE=${s.phraseActive}`);
  for(const f of s.faces)console.log(`${f.face} assembled=${f.assembled} clear=${f.activeTurnClear} raw=${f.rawQuality} view=${f.viewAlignment} area=${f.projectedAreaQuality} brdf=${f.brdfQuality} stagePass=${f.stagePass}`);
}
await browser.close();
