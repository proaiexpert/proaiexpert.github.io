import fs from 'node:fs';
import {chromium} from 'playwright-core';
const chrome=process.env.CHROME_BIN;if(!chrome)throw new Error('CHROME_BIN missing');
const out=process.env.QA_OUT||'review-evidence/feasibility';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:chrome,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=swiftshader','--enable-webgl']});
const page=await browser.newPage({viewport:{width:420,height:420}});
await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
await page.waitForFunction(()=>window.__R443_STARTUP_CAPABILITY__?.get,null,{timeout:20000});
const samples=[];
while(true){const s=await page.evaluate(()=>window.__R443_STARTUP_CAPABILITY__.get());samples.push(s);if(s.relativeMs>=8000)break;await page.waitForTimeout(25)}
const faces=['+Z','+X','-X'];
const stagePass=f=>f.assembled&&f.activeTurnClear&&f.rawQuality>=.12&&f.rawQuality<.59&&f.viewAlignment>=.36&&f.projectedAreaQuality>=.20&&f.brdfQuality>=0;
const candidatePass=f=>f.assembled&&f.activeTurnClear&&f.rawQuality>=.58&&f.viewAlignment>=.46&&f.projectedAreaQuality>=.26*.88&&f.brdfQuality>=.18*.78;
const enterPass=f=>f.assembled&&f.activeTurnClear&&f.rawQuality>=.64&&f.viewAlignment>=.52&&f.projectedAreaQuality>=.26&&f.brdfQuality>=.18;
const result={};
for(const face of faces){const rows=samples.map(s=>({t:s.relativeMs,f:s.faces.find(x=>x.face===face)}));const stageRows=rows.filter(x=>stagePass(x.f));const candRows=rows.filter(x=>candidatePass(x.f));const enterRows=rows.filter(x=>enterPass(x.f));const startupStageRows=stageRows.filter(x=>x.t>=1500&&x.t<=3000);const futureOwnerEnter=startupStageRows.map(st=>enterRows.find(en=>en.t>st.t&&en.t>=3500&&en.t<=6000)).filter(Boolean);result[face]={firstStagePassMs:stageRows[0]?.t??null,lastStagePassMs:stageRows.at(-1)?.t??null,firstCandidatePassMs:candRows[0]?.t??null,firstEnterPassMs:enterRows[0]?.t??null,startupStageSamples:startupStageRows.length,ownerWindowEnterSamples:enterRows.filter(x=>x.t>=3500&&x.t<=6000).length,hasHiddenStageThenOwnerEnter:futureOwnerEnter.length>0,min:{raw:Math.min(...rows.map(x=>x.f.rawQuality)),view:Math.min(...rows.map(x=>x.f.viewAlignment)),brdf:Math.min(...rows.map(x=>x.f.brdfQuality))},max:{raw:Math.max(...rows.map(x=>x.f.rawQuality)),view:Math.max(...rows.map(x=>x.f.viewAlignment)),brdf:Math.max(...rows.map(x=>x.f.brdfQuality))}}}
const report={sampleCount:samples.length,firstMs:samples[0].relativeMs,lastMs:samples.at(-1).relativeMs,ownerTarget:{stage:[1500,3000],readable:[3500,6000]},faces:result,anyFeasible:faces.some(f=>result[f].hasHiddenStageThenOwnerEnter)};
fs.writeFileSync(`${out}/feasibility.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
await browser.close();
