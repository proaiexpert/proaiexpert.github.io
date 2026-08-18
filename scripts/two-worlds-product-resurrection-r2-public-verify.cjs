const puppeteer=require('puppeteer-core');
const fs=require('fs');
const CHROME=process.env.CHROME||'/usr/bin/google-chrome';
const URL=process.env.PUBLIC_GALLERY_URL;
if(!URL) throw new Error('PUBLIC_GALLERY_URL missing');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const browser=await puppeteer.launch({headless:true,executablePath:CHROME,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
 const results={url:URL,desktop:{},iphone:{},fullSizeStills:[]};
 async function verify(viewport,userAgent,key){
   const page=await browser.newPage(); await page.setViewport(viewport); if(userAgent) await page.setUserAgent(userAgent);
   const failed=[]; page.on('requestfailed',r=>failed.push({url:r.url(),reason:r.failure()?.errorText||'unknown'})); page.on('response',r=>{if(r.status()>=400) failed.push({url:r.url(),status:r.status()})});
   await page.goto(URL,{waitUntil:'domcontentloaded',timeout:120000});
   await page.waitForSelector('#candidate-a video',{timeout:30000});
   await page.evaluate(async()=>{if(document.fonts) await document.fonts.ready});
   const images=await page.$$eval('img',xs=>xs.map(x=>({src:x.src,complete:x.complete,naturalWidth:x.naturalWidth,naturalHeight:x.naturalHeight})));
   if(images.length!==40) throw new Error(`expected 40 stills, got ${images.length}`);
   if(images.some(x=>!x.complete||x.naturalWidth<1)) throw new Error('one or more public stills failed');
   const videos=await page.$$('video'); if(videos.length!==8) throw new Error(`expected 8 videos, got ${videos.length}`);
   const played=[];
   for(let i=0;i<videos.length;i++){
     const v=videos[i];
     await page.evaluate(async el=>{el.muted=true;el.currentTime=0;await el.play();},v);
     await sleep(1800);
     const state=await page.evaluate(el=>({src:el.currentSrc,readyState:el.readyState,currentTime:el.currentTime,videoWidth:el.videoWidth,videoHeight:el.videoHeight,paused:el.paused,error:el.error?el.error.message:null}),v);
     if(state.error||state.readyState<3||state.currentTime<0.5||state.videoWidth<1) throw new Error(`video ${i+1} did not play: ${JSON.stringify(state)}`);
     played.push(state); await page.evaluate(el=>el.pause(),v);
   }
   results[key]={imagesVerified:images.length,videosPlayed:played.length,played,requestFailures:failed};
   if(failed.some(x=>/media\/(a|b|c|d)\//.test(x.url))) throw new Error(`public media request failure ${JSON.stringify(failed)}`);
   if(key==='desktop'){
     const hrefs=await page.$$eval('.candidate figure a',as=>as.map(a=>a.href));
     for(const idx of [0,10,20,30]){
       const full=await browser.newPage();
       await full.goto(hrefs[idx],{waitUntil:'load',timeout:60000});
       const state=await full.evaluate(()=>{const i=document.images[0];return {url:location.href,complete:!!i?.complete,naturalWidth:i?.naturalWidth||0,naturalHeight:i?.naturalHeight||0};});
       if(!state.complete||state.naturalWidth<1) throw new Error(`full-size still failed: ${JSON.stringify(state)}`);
       results.fullSizeStills.push(state);
       await full.close();
     }
   }
   await page.close();
 }
 await verify({width:1440,height:900,deviceScaleFactor:1},null,'desktop');
 await verify({width:390,height:844,deviceScaleFactor:3,isMobile:true,hasTouch:true},'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1','iphone');
 await browser.close();
 fs.writeFileSync('docs/site-evolution/two-worlds-product-resurrection-r2/review/public-verification.json',JSON.stringify(results,null,2));
 console.log('PUBLIC_GALLERY_BROWSER_VERIFY=PASS');
})().catch(e=>{console.error(e);process.exit(1)});
