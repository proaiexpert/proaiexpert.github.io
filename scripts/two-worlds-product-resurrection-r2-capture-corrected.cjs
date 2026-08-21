const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const manifest = JSON.parse(fs.readFileSync('docs/site-evolution/two-worlds-product-resurrection-r2/resurrection-manifest.json','utf8'));
const all = [...manifest.ownerGalleryCandidates, manifest.internalIntermediateTest];
const OUT = path.resolve('docs/site-evolution/two-worlds-product-resurrection-r2/review');
const INTERNAL = path.resolve('docs/site-evolution/two-worlds-product-resurrection-r2/_internal');
const CHROME = process.env.CHROME || '/usr/bin/google-chrome';
const sleep = ms => new Promise(r => setTimeout(r, ms));

function ensure(p){ fs.mkdirSync(p,{recursive:true}); }
function candidateDir(c){ return c.id === 'E_TEST' ? path.join(INTERNAL,'e-test') : path.join(OUT,'media',c.id.toLowerCase()); }
function f(c,name){ const d=candidateDir(c); ensure(d); return path.join(d,name); }
function portFor(c){ return 8500 + all.findIndex(x=>x.id===c.id) + 1; }
function baseFor(c){ return `http://127.0.0.1:${portFor(c)}`; }
function hostFor(c,lang){ return `${baseFor(c)}/__resurrection__/${lang==='ru'?'ru':'en'}/`; }
function shellQuote(s){ return String(s).replace(/'/g,"'\\''"); }

function probeDuration(file){
  return Number(cp.execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',file],{encoding:'utf8'}).trim());
}

function encodeTimeline(frames,dest,width,height,targetSeconds){
  if(frames.length < 4) throw new Error(`Too few screencast frames (${frames.length}) for ${dest}`);
  frames.sort((a,b)=>a.index-b.index);
  const listPath = path.join(path.dirname(frames[0].file),'timeline.txt');
  let durations=[];
  for(let i=0;i<frames.length;i++){
    let d=i+1<frames.length ? (frames[i+1].time-frames[i].time)/1000 : 0.8;
    if(!Number.isFinite(d)) d=.08;
    durations.push(Math.max(.035,Math.min(1.8,d)));
  }
  const raw=durations.reduce((a,b)=>a+b,0);
  let scale=1;
  if(raw<8 || raw>15) scale=targetSeconds/raw;
  durations=durations.map(d=>Math.max(.03,d*scale));
  const lines=[];
  for(let i=0;i<frames.length;i++){
    lines.push(`file '${shellQuote(frames[i].file)}'`);
    lines.push(`duration ${durations[i].toFixed(6)}`);
  }
  lines.push(`file '${shellQuote(frames[frames.length-1].file)}'`);
  fs.writeFileSync(listPath,lines.join('\n')+'\n');
  cp.execFileSync('ffmpeg',['-y','-loglevel','error','-f','concat','-safe','0','-i',listPath,'-vf',`fps=24,scale=${width}:${height}:flags=lanczos,setsar=1`,'-c:v','libx264','-profile:v','high','-level','4.0','-pix_fmt','yuv420p','-movflags','+faststart','-crf','20',dest]);
  const duration=probeDuration(dest);
  if(duration<7.5 || duration>15.5) throw new Error(`Unexpected review video duration ${duration}s for ${dest}`);
  return {frames:frames.length,durationSeconds:Number(duration.toFixed(3)),rawTimelineSeconds:Number(raw.toFixed(3)),scaled:scale!==1};
}

async function recordScreencast(page,dest,width,height,targetSeconds,action){
  const dir=dest+'.frames'; fs.rmSync(dir,{recursive:true,force:true}); ensure(dir);
  const client=await page.target().createCDPSession();
  await client.send('Page.enable');
  const frames=[]; let seq=0; let accepting=true;
  const handler=async ev=>{
    try{
      if(accepting){
        const file=path.join(dir,`frame-${String(seq).padStart(5,'0')}.jpg`);
        fs.writeFileSync(file,Buffer.from(ev.data,'base64'));
        const ts=(ev.metadata && Number.isFinite(ev.metadata.timestamp)) ? ev.metadata.timestamp*1000 : Date.now();
        frames.push({index:seq++,file,time:ts});
      }
    } finally { try{ await client.send('Page.screencastFrameAck',{sessionId:ev.sessionId}); }catch(_e){} }
  };
  client.on('Page.screencastFrame',handler);
  await client.send('Page.startScreencast',{format:'jpeg',quality:82,maxWidth:width,maxHeight:height,everyNthFrame:1});
  await sleep(250);
  await action();
  await sleep(450);
  accepting=false;
  await client.send('Page.stopScreencast');
  await sleep(120);
  client.off('Page.screencastFrame',handler);
  await client.detach();
  const result=encodeTimeline(frames,dest,width,height,targetSeconds);
  fs.rmSync(dir,{recursive:true,force:true});
  return result;
}

async function setupPage(browser,w,h,mobile=false){
  const page=await browser.newPage();
  await page.setViewport({width:w,height:h,deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
  const cdp=await page.target().createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled',{cacheDisabled:true}); await cdp.detach();
  return page;
}
function installNetworkAudit(page){
  const failures=[];
  page.on('requestfailed',req=>failures.push({type:'requestfailed',url:req.url(),reason:req.failure()?.errorText||'unknown'}));
  page.on('response',res=>{if(res.status()>=400) failures.push({type:'http',status:res.status(),url:res.url()});});
  return failures;
}
async function gotoRuntime(page,c,lang='en'){
  const failures=installNetworkAudit(page);
  const url=hostFor(c,lang)+`?sha=${c.productSha}`;
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForSelector('[data-tw-r2]',{timeout:45000});
  await page.evaluate(async()=>{if(document.fonts) await document.fonts.ready;document.documentElement.style.scrollBehavior='auto';});
  await sleep(500);
  const identity=await page.evaluate(()=>({
    title:document.title,
    css:[...document.styleSheets].map(s=>s.href).filter(Boolean),
    js:[...document.scripts].map(s=>s.src).filter(Boolean),
    resources:performance.getEntriesByType('resource').map(r=>r.name),
    fontInter:document.fonts?document.fonts.check('16px Inter'):true,
    twText:document.querySelector('[data-tw-r2]')?.innerText.slice(0,500)||'',
    technologyPresent:!!document.querySelector('[data-tw-tech-r2]')
  }));
  const loaded=[...identity.css,...identity.js,...identity.resources];
  const missingExpected=[...c.expectedCss,...c.expectedJs].filter(n=>!loaded.some(u=>u.includes(n)));
  if(missingExpected.length) throw new Error(`${c.id} exact runtime identity mismatch: ${missingExpected.join(', ')}`);
  if(!identity.technologyPresent) throw new Error(`${c.id} Technology missing`);
  if(!identity.twText.includes('WORLD 01') && !identity.twText.includes('МИР 01')) throw new Error(`${c.id} Two Worlds text missing`);
  return {url,failures,identity};
}
function requiredAssetFailures(c,audit){
  const tokens=[...c.expectedCss,...c.expectedJs,'/assets/brand/platforms/','fonts.gstatic.com','fonts.googleapis.com'];
  return audit.failures.filter(x=>tokens.some(t=>x.url.includes(t)));
}
async function jpg(page,file,q=90){await page.screenshot({path:file,type:'jpeg',quality:q,fullPage:false});}
async function overflow(page){return page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,delta:document.documentElement.scrollWidth-document.documentElement.clientWidth}));}

async function geometry(page){return page.evaluate(()=>{
  const s=document.querySelector('[data-tw-r2]'),e=s.querySelector('[data-tw-experience]'),v=s.querySelector('[data-tw-viewport]');
  const box=x=>{const r=x.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height};};
  const title=(world)=>{const x=s.querySelector(`[data-tw-world="${world}"] .tw-r2__world-title`);const b=box(x),cs=getComputedStyle(x);return {...b,opacity:Number(cs.opacity),visibility:cs.visibility};};
  return {focus:s.getAttribute('data-focus'),experience:box(e),viewport:box(v),aiTitle:title('ai'),webTitle:title('web'),scrollY,innerWidth,innerHeight};
});}
function intersects(g){return g.bottom>0&&g.top<900&&g.right>0&&g.left<1440&&g.width>80&&g.height>20;}
async function assertDesktopScene(page,label){
  const g=await geometry(page);
  if(g.viewport.width<1300 || g.viewport.height<500 || g.viewport.left< -20 || g.viewport.right>1460) throw new Error(`${label} desktop viewport invalid ${JSON.stringify(g)}`);
  if(g.focus==='ai' && !intersects(g.aiTitle)) throw new Error(`${label} AI title not visible ${JSON.stringify(g.aiTitle)}`);
  if(g.focus==='web' && !intersects(g.webTitle)) throw new Error(`${label} Web title not visible ${JSON.stringify(g.webTitle)}`);
  return g;
}
async function positionDesktop(page){
  await page.evaluate(()=>document.querySelector('[data-tw-experience]').scrollIntoView({block:'center'}));
  await sleep(450);
}
async function neutral(page){await page.mouse.move(4,4,{steps:4});await sleep(260);}
async function focusWorld(page,world){
  const b=await page.$eval('[data-tw-viewport]',el=>{const r=el.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height};});
  const ratio=world==='ai'?.25:.75;
  await page.mouse.move(Math.round(b.x+b.w*ratio),Math.round(b.y+b.h*.52),{steps:8});
  await sleep(850);
  const focus=await page.$eval('[data-tw-r2]',el=>el.getAttribute('data-focus'));
  if(focus!==world) throw new Error(`Pointer focus failed: expected ${world}, got ${focus}`);
}
async function mobileState(page,p,expected){
  await page.evaluate(p=>{
    const e=document.querySelector('[data-tw-experience]');const r=e.getBoundingClientRect();const abs=r.top+scrollY;const travel=Math.max(1,r.height-innerHeight);scrollTo(0,abs+travel*p);
  },p);
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  await sleep(500);
  const g=await geometry(page);
  if(g.viewport.width<Math.max(370,g.innerWidth-20) || g.viewport.height<Math.min(560,g.innerHeight*.9)) throw new Error(`Mobile viewport invalid ${JSON.stringify(g)}`);
  if(expected && g.focus!==expected) throw new Error(`Mobile state expected ${expected}, got ${g.focus}`);
  const active=expected==='ai'?g.aiTitle:expected==='web'?g.webTitle:null;
  if(active && !(active.bottom>0&&active.top<g.innerHeight&&active.right>0&&active.left<g.innerWidth&&active.width>120)) throw new Error(`Mobile active title not visible ${JSON.stringify(active)}`);
  return g;
}

async function desktop(browser,c,report){
  console.log(`${c.id} corrected desktop`);
  const page=await setupPage(browser,1440,900,false),audit=await gotoRuntime(page,c,'en');
  await positionDesktop(page);await neutral(page);report.desktopNeutralGeometry=await assertDesktopScene(page,`${c.id} neutral`);await jpg(page,f(c,'01-neutral-1440x900.jpg'));
  await focusWorld(page,'ai');report.desktopAiGeometry=await assertDesktopScene(page,`${c.id} ai`);await jpg(page,f(c,'02-ai-active-1440x900.jpg'));
  await neutral(page);await focusWorld(page,'web');report.desktopWebGeometry=await assertDesktopScene(page,`${c.id} web`);await jpg(page,f(c,'03-web-active-1440x900.jpg'));
  await neutral(page);await positionDesktop(page);
  report.desktopVideoCapture=await recordScreencast(page,f(c,'desktop-1440x900.mp4'),1440,900,11,async()=>{
    await neutral(page);await sleep(1100);await focusWorld(page,'ai');await sleep(900);await neutral(page);await sleep(1100);await focusWorld(page,'web');await sleep(900);await neutral(page);await sleep(1100);
  });
  report.desktopOverflow=await overflow(page);report.desktopIdentity=audit.identity;report.desktopRequiredAssetFailures=requiredAssetFailures(c,audit);
  if(report.desktopOverflow.delta!==0) throw new Error(`${c.id} desktop overflow ${report.desktopOverflow.delta}`);
  if(report.desktopRequiredAssetFailures.length) throw new Error(`${c.id} required desktop assets failed ${JSON.stringify(report.desktopRequiredAssetFailures)}`);
  await page.close();
}
async function portrait(browser,c,report){
  console.log(`${c.id} corrected portrait`);
  const page=await setupPage(browser,390,844,true),audit=await gotoRuntime(page,c,'ru');
  report.portraitAiGeometry=await mobileState(page,0,'ai');await jpg(page,f(c,'04-ai-390x844.jpg'));
  report.portraitTurnGeometry=await mobileState(page,.50,'turn');await jpg(page,f(c,'05-turn-390x844.jpg'));
  report.portraitWebGeometry=await mobileState(page,1,'web');await jpg(page,f(c,'06-web-390x844.jpg'));
  await mobileState(page,0,'ai');
  report.mobileVideoCapture=await recordScreencast(page,f(c,'mobile-390x844.mp4'),390,844,10.5,async()=>{
    await sleep(1200);
    const steps=30;for(let i=1;i<=steps;i++){const t=i/steps;const e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;await page.evaluate(e=>{const x=document.querySelector('[data-tw-experience]');const r=x.getBoundingClientRect();const abs=r.top+scrollY;const travel=Math.max(1,r.height-innerHeight);scrollTo(0,abs+travel*e);},e);await sleep(105);}
    await sleep(1200);
    for(let i=1;i<=7;i++){const p=1-.12*(i/7);await page.evaluate(p=>{const x=document.querySelector('[data-tw-experience]');const r=x.getBoundingClientRect();const abs=r.top+scrollY;const travel=Math.max(1,r.height-innerHeight);scrollTo(0,abs+travel*p);},p);await sleep(115);}
    await sleep(900);
  });
  report.portraitOverflow=await overflow(page);report.portraitIdentity=audit.identity;report.portraitRequiredAssetFailures=requiredAssetFailures(c,audit);
  if(report.portraitOverflow.delta!==0) throw new Error(`${c.id} portrait overflow ${report.portraitOverflow.delta}`);
  if(report.portraitRequiredAssetFailures.length) throw new Error(`${c.id} required portrait assets failed ${JSON.stringify(report.portraitRequiredAssetFailures)}`);
  await page.close();
}
async function landscape(browser,c,report){
  console.log(`${c.id} corrected landscape`);
  const page=await setupPage(browser,844,390,true),audit=await gotoRuntime(page,c,'ru');
  report.landscapeAiGeometry=await mobileState(page,0,'ai');await jpg(page,f(c,'07-ai-844x390.jpg'));
  report.landscapeWebGeometry=await mobileState(page,1,'web');await jpg(page,f(c,'08-web-844x390.jpg'));
  report.landscapeOverflow=await overflow(page);report.landscapeRequiredAssetFailures=requiredAssetFailures(c,audit);
  if(report.landscapeOverflow.delta!==0) throw new Error(`${c.id} landscape overflow ${report.landscapeOverflow.delta}`);
  if(report.landscapeRequiredAssetFailures.length) throw new Error(`${c.id} required landscape assets failed ${JSON.stringify(report.landscapeRequiredAssetFailures)}`);
  await page.close();
}
async function primeTech(page){
  await page.evaluate(()=>document.querySelector('[data-tw-tech-r2]').scrollIntoView({block:'center'}));
  await page.evaluate(async()=>{const imgs=[...document.querySelectorAll('[data-tw-tech-r2] img')];imgs.forEach(x=>x.loading='eager');await Promise.all(imgs.map(img=>img.decode?img.decode().catch(()=>{}):Promise.resolve()));});await sleep(350);
}
async function technology(browser,c,report){
  for(const spec of [{mobile:false,w:1440,h:900,lang:'en',name:'09-tech-desktop.jpg',key:'techDesktop'},{mobile:true,w:390,h:844,lang:'ru',name:'10-tech-mobile.jpg',key:'techMobile'}]){
    const page=await setupPage(browser,spec.w,spec.h,spec.mobile),audit=await gotoRuntime(page,c,spec.lang);await primeTech(page);
    const data=await page.evaluate(()=>({marks:[...document.querySelectorAll('[data-tw-tech-r2] img')].map(x=>({alt:x.alt,w:Math.round(x.getBoundingClientRect().width),h:Math.round(x.getBoundingClientRect().height),complete:x.complete,naturalWidth:x.naturalWidth,naturalHeight:x.naturalHeight})),overflow:{scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,delta:document.documentElement.scrollWidth-document.documentElement.clientWidth}}));
    if(data.marks.length<10||data.marks.some(x=>!x.complete||x.naturalWidth<1||x.w<8||x.w>180)) throw new Error(`${c.id} Technology invalid ${JSON.stringify(data)}`);
    if(data.overflow.delta!==0) throw new Error(`${c.id} Technology overflow ${data.overflow.delta}`);
    const fails=requiredAssetFailures(c,audit);if(fails.length)throw new Error(`${c.id} Technology required assets failed ${JSON.stringify(fails)}`);
    report[spec.key]=data;report[spec.key+'RequiredAssetFailures']=fails;await jpg(page,f(c,spec.name));await page.close();
  }
}

(async()=>{
  fs.rmSync(path.join(OUT,'media'),{recursive:true,force:true});ensure(path.join(OUT,'media'));fs.rmSync(path.join(INTERNAL,'e-test'),{recursive:true,force:true});
  const browser=await puppeteer.launch({headless:true,executablePath:CHROME,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
  const summary={generatedAt:new Date().toISOString(),captureGeneration:'corrected-isolated-exact-sha-host-r2',candidates:{}};
  for(const c of all){
    const report={id:c.id,version:c.version,productSha:c.productSha,runtimeVerifiedFromExactSha:true,hostMode:'fresh isolated resurrection host generated from exact worktree include/CSS/JS; historical files unmodified'};
    await desktop(browser,c,report);await portrait(browser,c,report);await landscape(browser,c,report);await technology(browser,c,report);
    fs.writeFileSync(f(c,'runtime-report.json'),JSON.stringify(report,null,2));summary.candidates[c.id]=report;
  }
  await browser.close();fs.writeFileSync(path.join(OUT,'capture-summary.json'),JSON.stringify(summary,null,2));console.log('CORRECTED_PRODUCT_RESURRECTION_CAPTURE=PASS');
})().catch(e=>{console.error(e);process.exit(1)});
