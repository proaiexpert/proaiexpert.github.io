const puppeteer = require('puppeteer-core');
const fs = require('fs');

const base = process.env.PUBLIC_GALLERY_URL;
if (!base) throw new Error('PUBLIC_GALLERY_URL missing');
const CHROME = process.env.CHROME || '/usr/bin/google-chrome';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function waitVideo(page, src) {
  return page.evaluate(async (src) => {
    const old = document.querySelector('#__verify_video');
    if (old) old.remove();
    const v = document.createElement('video');
    v.id = '__verify_video';
    v.muted = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.style.cssText = 'position:fixed;left:0;top:0;width:320px;height:180px;z-index:999999;background:#000';
    document.body.appendChild(v);
    const result = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('video metadata timeout: ' + src)), 30000);
      v.addEventListener('loadedmetadata', async () => {
        try {
          clearTimeout(timer);
          const before = v.currentTime;
          await v.play();
          await new Promise(r => setTimeout(r, 1600));
          const after = v.currentTime;
          v.pause();
          resolve({src, duration:v.duration, videoWidth:v.videoWidth, videoHeight:v.videoHeight, before, after, readyState:v.readyState});
        } catch (e) { reject(e); }
      }, {once:true});
      v.addEventListener('error', () => reject(new Error('video element error: ' + src + ' code=' + (v.error && v.error.code))), {once:true});
      v.src = src;
      v.load();
    });
    if (!(result.duration > 1) || !(result.after > result.before) || !result.videoWidth || !result.videoHeight) {
      throw new Error('video did not play: ' + JSON.stringify(result));
    }
    v.removeAttribute('src');
    v.load();
    return result;
  }, src);
}

async function verifyVideoWithRetry(page, src) {
  let last;
  for (let attempt=1; attempt<=3; attempt++) {
    try { return {...await waitVideo(page, src), attempts:attempt}; }
    catch (e) { last=e; await sleep(900*attempt); }
  }
  throw last;
}

async function verifyStillWithRetry(browser, src) {
  let last='unknown';
  for (let attempt=1; attempt<=5; attempt++) {
    const p=await browser.newPage();
    try {
      await p.setCacheEnabled(false);
      const r=await p.goto(src,{waitUntil:'load',timeout:30000});
      if (!r || !r.ok()) throw new Error('HTTP '+(r ? r.status() : 'no-response'));
      const dims=await p.evaluate(()=>({w:document.images[0]?.naturalWidth||0,h:document.images[0]?.naturalHeight||0}));
      if(!dims.w || !dims.h) throw new Error('blank image');
      await p.close();
      return {src,...dims,attempts:attempt};
    } catch(e) {
      last=e.message || String(e);
      await p.close().catch(()=>{});
      await sleep(900*attempt);
    }
  }
  throw new Error('still failed after retries '+src+' — '+last);
}

(async()=>{
  const browser = await puppeteer.launch({headless:true, executablePath:CHROME, args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({width:1440,height:900,deviceScaleFactor:1});
  let resp;
  for(let attempt=1; attempt<=5; attempt++){
    try {
      resp=await page.goto(base,{waitUntil:'domcontentloaded',timeout:60000});
      if(resp && resp.ok()) break;
    } catch(_e){}
    await sleep(1200*attempt);
  }
  if (!resp || !resp.ok()) throw new Error('gallery HTTP failure');
  await page.waitForSelector('video', {timeout:30000});
  const title = await page.title();
  const text = await page.$eval('body', el=>el.innerText);
  if (!/Historical Owner Filmstrip/i.test(text)) throw new Error('gallery marker missing');
  const videos = await page.$$eval('video', vs=>vs.map(v=>new URL(v.currentSrc || v.querySelector('source')?.src || v.getAttribute('src'), location.href).href));
  const images = await page.$$eval('img', xs=>xs.map(x=>new URL(x.src, location.href).href));
  if (videos.length !== 8) throw new Error('expected 8 owner videos, got '+videos.length);
  if (images.length < 40) throw new Error('expected >=40 owner stills, got '+images.length);

  await page.$$eval('video', vs=>vs.forEach(v=>{ v.pause(); v.removeAttribute('src'); v.querySelectorAll('source').forEach(s=>s.removeAttribute('src')); v.load(); }));

  const played=[];
  for (const src of videos) played.push(await verifyVideoWithRetry(page, src));

  const checkedImages=[];
  const sample = images.filter((_,i)=>i%Math.max(1,Math.floor(images.length/12))===0).slice(0,12);
  for (const src of sample) checkedImages.push(await verifyStillWithRetry(browser, src));

  const report={
    verifiedAt:new Date().toISOString(),
    publicGalleryUrl:base,
    title,
    ownerCandidateCount:4,
    videoCount:videos.length,
    videosPlayed:played,
    sampledFullSizeStills:checkedImages,
    allVideosPlayed:true,
    galleryOpened:true,
    twoWorldsVisible:/TWO WORLDS/i.test(text)
  };
  fs.writeFileSync('docs/site-evolution/two-worlds-product-resurrection-r2/review/public-verification.json',JSON.stringify(report,null,2));
  await browser.close();
  console.log('PUBLIC_OWNER_GALLERY_PLAYBACK=PASS');
})().catch(e=>{console.error(e);process.exit(1)});
