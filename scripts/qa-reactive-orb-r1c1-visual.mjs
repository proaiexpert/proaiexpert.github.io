// R1C.1 — browser-render proof, NOT a property-setter-only test.
// Fixed target: owner-preview/ai-systems-reactive-orb-r1c1-visual-qa/index.html
// Source payload remains https://prod.spline.design/sH5GiugwHqy0gA4X/scene.splinecode.
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
const PORT=8771,OUT='artifacts/orb-r1c1';
const PAGE='http://127.0.0.1:'+PORT+'/owner-preview/ai-systems-reactive-orb-r1c1-visual-qa/index.html?view=adapted&qa=1';
const report={task:'R1C.1',target:PAGE,method:'CDP Page.captureScreenshot + Playwright fallback (never toDataURL as sole proof)',
  started:new Date().toISOString(),capture:null,variants:[],errors:[],motion:{rest:'UNVERIFIED',pointer:'UNVERIFIED',return:'UNVERIFIED'},
  status:'HOLD',validOriginalPixels:false,visualRecolor:'UNVERIFIED',tealReduction:'UNVERIFIED'};
await mkdir(OUT,{recursive:true});
let browser;
const server=spawn('python3',['-m','http.server',String(PORT),'--bind','127.0.0.1'],{stdio:'ignore'});
const pause=ms=>new Promise(ok=>setTimeout(ok,ms));
function within(p,ms,label){return Promise.race([p,new Promise((_,reject)=>setTimeout(()=>reject(Error(label+' timeout '+ms+'ms')),ms))])}
async function metrics(page,bytes){
  return page.evaluate(async base64=>{
    const imageBytes=Uint8Array.from(atob(base64),x=>x.charCodeAt(0));
    const bitmap=await createImageBitmap(new Blob([imageBytes],{type:'image/png'}));
    const c=document.createElement('canvas');c.width=bitmap.width;c.height=bitmap.height;
    const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(bitmap,0,0);bitmap.close();
    const data=ctx.getImageData(0,0,c.width,c.height).data;
    let lit=0,teal=0,neutral=0,red=0,luma=0,nonTransparent=0;
    for(let i=0;i<data.length;i+=4){
      const r=data[i],g=data[i+1],b=data[i+2],a=data[i+3];
      if(a<80)continue;
      nonTransparent++;
      const total=r+g+b;luma+=total;
      if(total>95){
        lit++;
        if(g>r*1.32&&b>r*1.18&&g>48)teal++;
        if(Math.max(r,g,b)-Math.min(r,g,b)<25)neutral++;
        if(r>g*1.4&&r>b*1.35)red++;
      }
    }
    return {width:c.width,height:c.height,lit,teal,neutral,red,nonTransparent,
      tealFraction:lit?teal/lit:null,neutralFraction:lit?neutral/lit:null,
      meanRGB:nonTransparent?luma/(3*nonTransparent):null};
  },bytes.toString('base64'));
}
try{
  await pause(1000);
  browser=await chromium.launch({headless:true,args:['--enable-unsafe-webgpu','--enable-features=WebGPU','--use-angle=swiftshader']});
  const page=await browser.newPage({viewport:{width:1280,height:900},deviceScaleFactor:1});
  const cdps=await page.context().newCDPSession(page);
  page.on('pageerror',e=>report.errors.push('page:'+String(e).slice(0,250)));
  await page.goto(PAGE,{waitUntil:'domcontentloaded',timeout:30000});
  try{
    await page.waitForFunction(()=>window.__orbR1C1?.cloneCount===250&&window.__orbR1C1Controls||window.__orbR1C1?.status==='HOLD',null,{timeout:42000});
  }catch(e){
    report.errors.push('Initialization timeout: '+String(e));
  }
  report.initialization=await page.evaluate(()=>({ready:!!window.__orbR1C1Controls,
    state:window.__orbR1C1?.status, errors:window.__orbR1C1?.errors,
    cloneCount:window.__orbR1C1?.cloneCount,objectCount:window.__orbR1C1?.objectCount,
    bodyMessage:document.querySelector('#status')?.textContent}));
  if(!report.initialization.ready||report.initialization.cloneCount!==250)
    throw Error('Native R1C.1 init unavailable: '+JSON.stringify(report.initialization));
  report.topology=await page.evaluate(()=>({count:window.__orbR1C1.objectCount,clones:window.__orbR1C1.cloneCount,
    actualURL:window.location.pathname,scene:window.__orbR1C1.scene}));
  if(!report.topology.actualURL.includes('r1c1-visual-qa'))throw Error('QA regression: wrong page target');
  if(report.topology.count!==769||report.topology.clones!==250)throw Error('Source topology mismatch');
  const bbox=await page.locator('#orb-canvas').boundingBox();
  if(!bbox||bbox.width<200||bbox.height<200)throw Error('Canvas not visible');
  const clip={x:Math.floor(bbox.x),y:Math.floor(bbox.y),width:Math.floor(bbox.width)-2,height:Math.floor(bbox.height)-2};
  let seq=0;
  async function capture(label){
    // Capture the composited rendered browser surface, never the canvas serialization.
    const filename=OUT+'/'+String(++seq).padStart(2,'0')+'-'+label+'.png';
    let buf,method='CDP Page.captureScreenshot';
    try{
      const shot=await within(cdps.send('Page.captureScreenshot',{
        format:'png',fromSurface:true,captureBeyondViewport:false,
        clip:{x:clip.x,y:clip.y,width:clip.width,height:clip.height,scale:1}
      }),12000,'CDP screenshot');
      buf=Buffer.from(shot.data,'base64');
    }catch(e){
      report.errors.push('CDP capture: '+String(e));
      method='Playwright screenshot';
      buf=await within(page.screenshot({clip,timeout:16000,animations:'disabled'}),19000,'Playwright screenshot');
    }
    await writeFile(filename,buf);
    let pixel=await metrics(page,buf);
    report.capture={method,clip};
    return {filename,pixel,method};
  }
  const ctl=async method=>page.evaluate(m=>window.__orbR1C1Controls[m](),method);
  const apply=async variant=>page.evaluate(v=>window.__orbR1C1Controls.apply(v),variant);
  // Explicit playback to produce a complete GPU frame, followed by stop() to bound animation phase.
  await ctl('play');await pause(900);await ctl('freeze');await pause(180);
  const original=await capture('original-frozen');
  report.baseline=original;
  if(original.pixel.lit<300){
    // Bounded second attempt with scene running (headless WebGPU may discard paused framebuffer).
    await ctl('play');await pause(1100);
    const second=await capture('original-running-retry');
    report.originalRetry=second;
    if(second.pixel.lit<300)throw Error('BLACK_FRAME: CDP/Playwright screenshot captures no original Spline pixels; visual evidence unavailable');
    report.captureMode='RUNNING_WITH_INTERLEAVED_BASELINE';
  }else{
    report.captureMode='STOPPED_SCENE_SAME_INSTANCE';
  }
  report.validOriginalPixels=true;
  const variants=['fresnel','depth','lighting','combined'];
  const counts={};
  for(const variant of variants){
    // A-B-A control: capture baseline before, variant, baseline after with no scene reload.
    const baseBefore=await apply('original');
    if(report.captureMode==='STOPPED_SCENE_SAME_INSTANCE')await ctl('requestRender');
    await pause(140);
    const a=await capture(variant+'-control-before');
    const edit=await apply(variant);
    if(report.captureMode==='STOPPED_SCENE_SAME_INSTANCE')await ctl('requestRender');
    await pause(200);
    const b=await capture(variant+'-changed');
    await apply('original');await pause(140);
    const after=await capture(variant+'-control-after');
    const vals=[a.pixel.tealFraction,b.pixel.tealFraction,after.pixel.tealFraction];
    const controlJitter=Math.abs((vals[0]??0)-(vals[2]??0));
    const effect=(vals[0]??0)-(vals[1]??0);
    const valid=[a.pixel.lit,b.pixel.lit,after.pixel.lit].every(v=>v>=300);
    // Require measured impact beyond A/A scene animation drift + tolerance.
    const tealPass=valid&&controlJitter<0.03&&effect>Math.max(0.08,controlJitter*3);
    report.variants.push({name:variant,baseBefore,edit,controls:[a,after],changed:b,
      controlJitter,effect,validPixels:valid,tealPass,
      judgment:!valid?'BLACK_FRAME':tealPass?'VISIBLE_TEAL_REDUCTION_PASS':'NOT_PROVEN'});
    counts[variant]=edit.counts;
  }
  report.materialAPICounts=counts;
  report.tealReduction=report.variants.some(v=>v.tealPass)?'PARTIAL':'UNVERIFIED';
  report.visualRecolor=report.variants.find(v=>v.name==='combined')?.tealPass?'PASS':'UNVERIFIED';
  // Separate real pointer movement probe using native runtime object positions, not invented motion.
  try{
    await apply('combined');
    await ctl('play');await pause(650);
    const rest=await ctl('snapshot');
    const rect=await page.locator('#orb-canvas').boundingBox();
    await page.mouse.move(rect.x+rect.width/2,rect.y+rect.height/2);
    await pause(450);
    const during=await ctl('snapshot');
    await page.mouse.move(12,12);await pause(1400);
    const returned=await ctl('snapshot');
    const deviation=(a,b)=>{
      const va=a.positions.flatMap(o=>[o.position.x,o.position.y,o.position.z]);
      const vb=b.positions.flatMap(o=>[o.position.x,o.position.y,o.position.z]);
      return Math.max(...va.map((v,i)=>Math.abs(v-vb[i])));
    };
    report.motion={rest:'CAPTURED',pointer:'CAPTURED',return:'CAPTURED',
      displacement:deviation(rest,during),returnDifference:deviation(rest,returned),
      verdict:'UNVERIFIED: object position samples alone do not prove pointer-specific interaction and return visually'};
  }catch(e){report.errors.push('Motion diagnostic: '+String(e))}
  // Source structure preservation checked post material and motion operations.
  report.finalTopology=await page.evaluate(()=>({count:window.__orbR1C1Controls.snapshot().objectCount,clones:window.__orbR1C1Controls.snapshot().clones}));
  report.status=(report.visualRecolor==='PASS'&&report.finalTopology.count===769)?'VISUAL_PARTIAL_PASS':'VISUAL_HOLD';
}catch(e){report.errors.push('Test blocker: '+String(e?.stack||e));report.status='VISUAL_HOLD'}
finally{
  report.finished=new Date().toISOString();
  await writeFile(OUT+'/report.json',JSON.stringify(report,null,2));
  console.log('R1C1_EVIDENCE_START\n'+JSON.stringify({
    status:report.status,target:report.target,capture:report.capture,topology:report.topology,
    initialization:report.initialization,baseline:report.baseline?.pixel,originalRetry:report.originalRetry?.pixel,
    variants:report.variants.map(v=>({name:v.name,edit:v.edit,basePixels:v.controls[0].pixel,
      changedPixels:v.changed.pixel,afterPixels:v.controls[1].pixel,
      jitter:v.controlJitter,effect:v.effect,judgment:v.judgment})),
    motion:report.motion,errors:report.errors},null,2)+'\nR1C1_EVIDENCE_END');
  await browser?.close().catch(()=>{});
  server.kill('SIGTERM');
}
if(report.status==='VISUAL_HOLD')process.exitCode=1;
