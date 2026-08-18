const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const manifest = JSON.parse(fs.readFileSync('docs/site-evolution/two-worlds-product-resurrection-r2/resurrection-manifest.json','utf8'));
const owner = manifest.ownerGalleryCandidates;
const internal = manifest.internalIntermediateTest;
const all = [...owner, internal];
const OUT = path.resolve('docs/site-evolution/two-worlds-product-resurrection-r2/review');
const INTERNAL = path.resolve('docs/site-evolution/two-worlds-product-resurrection-r2/_internal');
const CHROME = process.env.CHROME || '/usr/bin/google-chrome';
const sleep = ms => new Promise(r => setTimeout(r, ms));

function ensure(p){ fs.mkdirSync(p,{recursive:true}); }
function candidateDir(c){ return c.id === 'E_TEST' ? path.join(INTERNAL,'e-test') : path.join(OUT,'media',c.id.toLowerCase()); }
function f(c,name){ const d=candidateDir(c); ensure(d); return path.join(d,name); }
function portFor(c){ return 8200 + all.findIndex(x=>x.id===c.id) + 1; }
function baseFor(c){ return `http://127.0.0.1:${portFor(c)}`; }
function shellQuote(s){ return String(s).replace(/'/g,"'\\''"); }

function encodeTimeline(frames,dest,width,height,started,ended){
  if(frames.length < 2) throw new Error(`Screencast produced only ${frames.length} frames for ${dest}`);
  frames.sort((a,b)=>a.index-b.index);
  frames[0].time = Math.min(frames[0].time, started);
  const listPath = path.join(path.dirname(frames[0].file),'timeline.txt');
  const lines=[];
  for(let i=0;i<frames.length;i++){
    const cur=frames[i];
    const nextTime=i+1<frames.length ? frames[i+1].time : ended;
    const duration=Math.max(0.025,(nextTime-cur.time)/1000);
    lines.push(`file '${shellQuote(cur.file)}'`);
    lines.push(`duration ${duration.toFixed(6)}`);
  }
  lines.push(`file '${shellQuote(frames[frames.length-1].file)}'`);
  fs.writeFileSync(listPath,lines.join('\n')+'\n');
  cp.execFileSync('ffmpeg',[
    '-y','-loglevel','error','-f','concat','-safe','0','-i',listPath,
    '-vf',`fps=24,scale=${width}:${height}:flags=lanczos,setsar=1`,
    '-c:v','libx264','-profile:v','high','-level','4.0','-pix_fmt','yuv420p',
    '-movflags','+faststart','-crf','21',dest
  ]);
}

async function recordScreencast(page,dest,width,height,action){
  const dir=dest+'.frames'; ensure(dir);
  const client=await page.target().createCDPSession();
  await client.send('Page.enable');
  const frames=[]; let seq=0; let accepting=true;
  const started=Date.now();
  const handler=async ev=>{
    try{
      if(accepting){
        const file=path.join(dir,`frame-${String(seq).padStart(5,'0')}.jpg`);
        fs.writeFileSync(file,Buffer.from(ev.data,'base64'));
        frames.push({index:seq++,file,time:Date.now()});
      }
    } finally {
      try{ await client.send('Page.screencastFrameAck',{sessionId:ev.sessionId}); }catch(_e){}
    }
  };
  client.on('Page.screencastFrame',handler);
  await client.send('Page.startScreencast',{format:'jpeg',quality:78,maxWidth:width,maxHeight:height,everyNthFrame:3});
  await sleep(350);
  await action();
  await sleep(350);
  const ended=Date.now();
  accepting=false;
  await client.send('Page.stopScreencast');
  await sleep(150);
  client.off('Page.screencastFrame',handler);
  await client.detach();
  encodeTimeline(frames,dest,width,height,started,ended);
  fs.rmSync(dir,{recursive:true,force:true});
  return {frames:frames.length,durationSeconds:Number(((ended-started)/1000).toFixed(3))};
}

async function setupPage(browser,w,h,mobile=false){
  const page = await browser.newPage();
  await page.setViewport({width:w,height:h,deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
  const cdp = await page.target().createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  await cdp.detach();
  return page;
}

function installNetworkAudit(page){
  const failures=[];
  page.on('requestfailed',req=>failures.push({type:'requestfailed',url:req.url(),reason:req.failure()?.errorText||'unknown'}));
  page.on('response',res=>{ if(res.status()>=400) failures.push({type:'http',status:res.status(),url:res.url()}); });
  return failures;
}

async function gotoRuntime(page,c,lang='en'){
  const failures=installNetworkAudit(page);
  const suffix=lang==='ru'?'/ru/':'/';
  const url=`${baseFor(c)}${suffix}?resurrection=${c.productSha}`;
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForSelector('[data-tw-r2]',{timeout:45000});
  await page.evaluate(async()=>{ if(document.fonts) await document.fonts.ready; document.documentElement.style.scrollBehavior='auto'; });
  await sleep(600);
  const identity=await page.evaluate(()=>({
    title:document.title,
    css:[...document.styleSheets].map(s=>s.href).filter(Boolean),
    js:[...document.scripts].map(s=>s.src).filter(Boolean),
    resources:performance.getEntriesByType('resource').map(r=>r.name),
    fontInter:document.fonts?document.fonts.check('16px Inter'):true,
    twText:document.querySelector('[data-tw-r2]')?.innerText.slice(0,400)||'',
    technologyPresent:!!document.querySelector('[data-tw-tech-r2]')
  }));
  const loaded=[...identity.css,...identity.js,...identity.resources];
  const missingExpected=[...c.expectedCss,...c.expectedJs].filter(n=>!loaded.some(u=>u.includes(n)));
  if(missingExpected.length) throw new Error(`${c.id} exact runtime identity mismatch; missing ${missingExpected.join(', ')}`);
  if(!identity.technologyPresent) throw new Error(`${c.id} Technology missing`);
  if(!identity.fontInter) throw new Error(`${c.id} Inter font unavailable`);
  return {url,failures,identity};
}

function requiredAssetFailures(c,audit){
  const tokens=[...c.expectedCss,...c.expectedJs,'/assets/brand/platforms/','fonts.gstatic.com','fonts.googleapis.com'];
  return audit.failures.filter(x=>tokens.some(t=>x.url.includes(t)));
}

async function scrollToTwoWorlds(page){
  await page.evaluate(()=>document.querySelector('[data-tw-r2]').scrollIntoView({block:'start'}));
  await sleep(450);
}
async function neutral(page){ await page.mouse.move(8,8,{steps:6}); }
async function hover(page,world){
  const el=await page.$(`[data-tw-world="${world}"]`); if(!el) throw new Error(`missing ${world}`);
  const b=await el.boundingBox(); if(!b) throw new Error(`no bounds ${world}`);
  await page.mouse.move(Math.round(b.x+b.width*.52),Math.round(b.y+b.height*.52),{steps:12});
}
async function jpg(page,file,quality=88){ await page.screenshot({path:file,type:'jpeg',quality,fullPage:false}); }
async function overflow(page){ return page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,delta:document.documentElement.scrollWidth-document.documentElement.clientWidth})); }

async function primeTechnologyImages(page){
  await page.evaluate(()=>document.querySelector('[data-tw-tech-r2]').scrollIntoView({block:'center'}));
  await page.evaluate(async()=>{
    const imgs=[...document.querySelectorAll('[data-tw-tech-r2] img')];
    imgs.forEach(img=>{ img.loading='eager'; });
    await Promise.all(imgs.map(img=>new Promise(resolve=>{
      if(img.complete && img.naturalWidth>0){ resolve(); return; }
      let done=false;
      const finish=()=>{ if(done) return; done=true; resolve(); };
      img.addEventListener('load',finish,{once:true});
      img.addEventListener('error',finish,{once:true});
      setTimeout(finish,12000);
    })));
    await Promise.all(imgs.map(img=>img.decode ? img.decode().catch(()=>{}) : Promise.resolve()));
  });
  await sleep(350);
}

async function desktop(browser,c,report){
  console.log(`  ${c.id} desktop start`);
  const page=await setupPage(browser,1440,900,false); const audit=await gotoRuntime(page,c,'en');
  await scrollToTwoWorlds(page); await neutral(page); await sleep(700);
  await jpg(page,f(c,'01-neutral-1440x900.jpg'));
  await hover(page,'ai'); await sleep(1050); await jpg(page,f(c,'02-ai-active-1440x900.jpg'));
  await neutral(page); await sleep(700); await hover(page,'web'); await sleep(1050); await jpg(page,f(c,'03-web-active-1440x900.jpg'));
  await neutral(page); await sleep(700);
  await scrollToTwoWorlds(page); await neutral(page);
  report.desktopVideoCapture=await recordScreencast(page,f(c,'desktop-1440x900.mp4'),1440,900,async()=>{
    await sleep(1700);
    await hover(page,'ai'); await sleep(2600);
    await neutral(page); await sleep(1700);
    await hover(page,'web'); await sleep(2600);
    await neutral(page); await sleep(1700);
  });
  report.desktopOverflow=await overflow(page);
  report.desktopIdentity=audit.identity;
  report.desktopRequiredAssetFailures=requiredAssetFailures(c,audit);
  if(report.desktopRequiredAssetFailures.length) throw new Error(`${c.id} required desktop asset failure: ${JSON.stringify(report.desktopRequiredAssetFailures)}`);
  await page.close();
  console.log(`  ${c.id} desktop pass ${JSON.stringify(report.desktopVideoCapture)}`);
}

async function mobileBounds(page){
  return page.evaluate(()=>{
    const s=document.querySelector('[data-tw-r2]'), exp=s.querySelector('[data-tw-experience]')||s;
    const sr=s.getBoundingClientRect(), er=exp.getBoundingClientRect();
    const top=sr.top+scrollY, expTop=er.top+scrollY, expHeight=er.height;
    const start=Math.max(0,expTop-6);
    const end=Math.max(start,Math.min(top+sr.height-innerHeight,expTop+expHeight-innerHeight+6));
    return {start,end,mid:Math.round((start+end)/2)};
  });
}

async function portrait(browser,c,report){
  console.log(`  ${c.id} portrait start`);
  const page=await setupPage(browser,390,844,true); const audit=await gotoRuntime(page,c,'ru'); const b=await mobileBounds(page);
  await page.evaluate(y=>scrollTo(0,y),b.start); await sleep(900); await jpg(page,f(c,'04-ai-390x844.jpg'));
  await page.evaluate(y=>scrollTo(0,y),b.mid); await sleep(800); await jpg(page,f(c,'05-turn-390x844.jpg'));
  await page.evaluate(y=>scrollTo(0,y),b.end); await sleep(900); await jpg(page,f(c,'06-web-390x844.jpg'));
  await page.evaluate(y=>scrollTo(0,y),b.start); await sleep(700);
  report.mobileVideoCapture=await recordScreencast(page,f(c,'mobile-390x844.mp4'),390,844,async()=>{
    await sleep(1800);
    const steps=32;
    for(let i=1;i<=steps;i++){
      const t=i/steps; const e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
      const y=Math.round(b.start+(b.end-b.start)*e);
      await page.evaluate(v=>scrollTo(0,v),y);
      await sleep(200);
    }
    await sleep(1700);
    for(let i=1;i<=6;i++){
      const y=Math.round(b.end-(b.end-b.start)*.12*(i/6));
      await page.evaluate(v=>scrollTo(0,v),y);
      await sleep(180);
    }
  });
  report.portraitOverflow=await overflow(page);
  report.portraitIdentity=audit.identity;
  report.portraitRequiredAssetFailures=requiredAssetFailures(c,audit);
  if(report.portraitRequiredAssetFailures.length) throw new Error(`${c.id} required portrait asset failure: ${JSON.stringify(report.portraitRequiredAssetFailures)}`);
  await page.close();
  console.log(`  ${c.id} portrait pass ${JSON.stringify(report.mobileVideoCapture)}`);
}

async function landscape(browser,c,report){
  console.log(`  ${c.id} landscape start`);
  const page=await setupPage(browser,844,390,true); const audit=await gotoRuntime(page,c,'ru'); const b=await mobileBounds(page);
  await page.evaluate(y=>scrollTo(0,y),b.start); await sleep(850); await jpg(page,f(c,'07-ai-844x390.jpg'));
  await page.evaluate(y=>scrollTo(0,y),b.end); await sleep(850); await jpg(page,f(c,'08-web-844x390.jpg'));
  report.landscapeOverflow=await overflow(page);
  report.landscapeRequiredAssetFailures=requiredAssetFailures(c,audit);
  if(report.landscapeRequiredAssetFailures.length) throw new Error(`${c.id} required landscape asset failure: ${JSON.stringify(report.landscapeRequiredAssetFailures)}`);
  await page.close();
  console.log(`  ${c.id} landscape pass`);
}

async function technology(browser,c,report){
  console.log(`  ${c.id} technology start`);
  const desktop=await setupPage(browser,1440,900,false); let audit=await gotoRuntime(desktop,c,'en');
  await primeTechnologyImages(desktop);
  report.techDesktop=await desktop.evaluate(()=>({marks:[...document.querySelectorAll('[data-tw-tech-r2] img')].map(x=>({alt:x.alt,src:x.currentSrc||x.src,w:Math.round(x.getBoundingClientRect().width),h:Math.round(x.getBoundingClientRect().height),complete:x.complete,naturalWidth:x.naturalWidth,naturalHeight:x.naturalHeight})),overflow:{scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,delta:document.documentElement.scrollWidth-document.documentElement.clientWidth}}));
  report.techDesktopRequiredAssetFailures=requiredAssetFailures(c,audit);
  if(report.techDesktopRequiredAssetFailures.length) throw new Error(`${c.id} desktop Technology network failure: ${JSON.stringify(report.techDesktopRequiredAssetFailures)}`);
  if(report.techDesktop.marks.length<10 || report.techDesktop.marks.some(x=>!x.complete||x.naturalWidth<1)) throw new Error(`${c.id} desktop Technology decode failure: ${JSON.stringify(report.techDesktop.marks)}`);
  await jpg(desktop,f(c,'09-tech-desktop.jpg'));
  await desktop.close();

  const mobile=await setupPage(browser,390,844,true); audit=await gotoRuntime(mobile,c,'ru');
  await primeTechnologyImages(mobile);
  report.techMobile=await mobile.evaluate(()=>({marks:[...document.querySelectorAll('[data-tw-tech-r2] img')].map(x=>({alt:x.alt,src:x.currentSrc||x.src,w:Math.round(x.getBoundingClientRect().width),h:Math.round(x.getBoundingClientRect().height),complete:x.complete,naturalWidth:x.naturalWidth,naturalHeight:x.naturalHeight})),overflow:{scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,delta:document.documentElement.scrollWidth-document.documentElement.clientWidth}}));
  report.techMobileRequiredAssetFailures=requiredAssetFailures(c,audit);
  if(report.techMobileRequiredAssetFailures.length) throw new Error(`${c.id} mobile Technology network failure: ${JSON.stringify(report.techMobileRequiredAssetFailures)}`);
  if(report.techMobile.marks.length<10 || report.techMobile.marks.some(x=>!x.complete||x.naturalWidth<1)) throw new Error(`${c.id} mobile Technology decode failure: ${JSON.stringify(report.techMobile.marks)}`);
  await jpg(mobile,f(c,'10-tech-mobile.jpg'));
  await mobile.close();
  console.log(`  ${c.id} technology pass`);
}

(async()=>{
  ensure(OUT); ensure(path.join(OUT,'media')); ensure(INTERNAL);
  const browser=await puppeteer.launch({headless:true,executablePath:CHROME,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
  const summary={captureSpec:{desktop:'1440x900',portrait:'390x844',landscape:'844x390',zoom:'100%',deviceScaleFactor:1,video:'MP4 H.264 yuv420p / Chrome CDP screencast'},candidates:{}};
  for(const c of all){
    console.log(`RESURRECT ${c.id} ${c.version} ${c.productSha}`);
    const r={id:c.id,version:c.version,productSha:c.productSha,runtimeVerifiedFromExactSha:true};
    await desktop(browser,c,r); await portrait(browser,c,r); await landscape(browser,c,r); await technology(browser,c,r);
    r.bodyOverflow={desktop:r.desktopOverflow,portrait:r.portraitOverflow,landscape:r.landscapeOverflow,techDesktop:r.techDesktop.overflow,techMobile:r.techMobile.overflow};
    r.assetFailures=[...r.desktopRequiredAssetFailures,...r.portraitRequiredAssetFailures,...r.landscapeRequiredAssetFailures,...r.techDesktopRequiredAssetFailures,...r.techMobileRequiredAssetFailures];
    r.loadedCss=r.desktopIdentity.css.filter(u=>u.includes('homepage-two-worlds'));
    r.loadedJs=r.desktopIdentity.js.filter(u=>u.includes('homepage-two-worlds'));
    fs.writeFileSync(f(c,'runtime-report.json'),JSON.stringify(r,null,2));
    summary.candidates[c.id]=r;
    console.log(`RESURRECT ${c.id} COMPLETE`);
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT,'capture-summary.json'),JSON.stringify(summary,null,2));
  console.log('PRODUCT_RESURRECTION_CAPTURE=PASS');
})().catch(e=>{console.error(e);process.exit(1)});
