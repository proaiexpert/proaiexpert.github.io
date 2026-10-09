// R1B independent browser smoke / forensics. No source mutation, no production deploy.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { once } from 'node:events';
const port=8767;
const root='http://127.0.0.1:'+port+'/owner-preview/ai-systems-reactive-orb-runtime-r1b/index.html';
const output='artifacts/orb-r1b';
await mkdir(output,{recursive:true});
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
await new Promise(resolve=>setTimeout(resolve,900));
let browser;
const report={status:'UNVERIFIED',checks:{},errors:[],screenshotPaths:[],pageErrors:[],networkErrors:[],started:new Date().toISOString()};
try{
  browser=await chromium.launch({headless:true,args:['--enable-unsafe-webgpu','--enable-features=WebGPU','--use-angle=swiftshader']});
  const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
  const page=await context.newPage();
  page.on('pageerror',e=>report.pageErrors.push(String(e).slice(0,500)));
  page.on('requestfailed',req=>report.networkErrors.push({url:req.url(),failure:req.failure()?.errorText}));
  const checkMode=async mode=>{
    await page.goto(root+'?view='+mode,{waitUntil:'domcontentloaded',timeout:30000});
    await page.screenshot({path:output+'/'+mode+'.png',animations:'disabled'});
    report.screenshotPaths.push(output+'/'+mode+'.png');
    report.checks[mode]={url:page.url(),h1:await page.locator('h1').count(),originalIframe:await page.locator('#original-panel').isVisible(),adaptedCanvas:await page.locator('#adapted-panel').isVisible()};
  };
  await checkMode('original');
  await checkMode('adapted');
  try{
    await page.waitForFunction(()=>['PASS','FAIL'].includes(window.__proaiOrbR1B?.load),null,{timeout:70000});
  }catch(e){report.errors.push('Donor load did not resolve in 70s: '+String(e).slice(0,300));}
  report.proof=await page.evaluate(()=>window.__proaiOrbR1B||null);
  await page.screenshot({path:output+'/adapted-after-load.png',animations:'disabled'});
  report.screenshotPaths.push(output+'/adapted-after-load.png');
  await checkMode('compare');
  await checkMode('clean');
  await context.close();
  const p=report.proof;
  report.status=p?.load==='PASS'&&p?.objectAccess==='PASS'&&p?.materials==='PARTIAL'?'TECHNICAL_PARTIAL':'HOLD';
  // A successful material setter readback is NOT a visual fidelity or motion acceptance.
  if(report.status!=='TECHNICAL_PARTIAL')report.errors.push('Real donor runtime loading and material access were not both proven.');
}catch(e){report.status='HOLD';report.errors.push('Harness: '+String(e));}
finally{
  report.finished=new Date().toISOString();
  await writeFile(output+'/report.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify({status:report.status,checks:report.checks,proof:report.proof,errors:report.errors,networkErrors:report.networkErrors.slice(0,12)},null,2));
  await browser?.close().catch(()=>{});
  server.kill('SIGTERM');
}
if(report.status!=='TECHNICAL_PARTIAL')process.exitCode=1;
