/* Technology R1.6.1 real-homepage mobile header + viewport + carrier QA.
 * Full EN/RU Jekyll-compiled homepage with Header System, Two Worlds, Financial Stream.
 * Safari chrome is simulated by viewport resizing, not called physical Safari verification. */
import {chromium} from 'playwright';
import fs from 'node:fs';import path from 'node:path';
const ORIGIN='http://127.0.0.1:8787';
const OUT='r161-mobile-repair-evidence';fs.mkdirSync(OUT,{recursive:true});
const sizes=[['desktop1920',1920,1080],['laptop1440',1440,900],['laptop1366',1366,768],['laptop1280',1280,720],['portrait430',430,932],['portrait390',390,844],['portrait375',375,812],['landscape844',844,390],['landscape896',896,414],['landscape932',932,430]];
const starts=[.105,.32,.515,.70],ends=[.32,.515,.70,.865],names=['understand','orchestrate','communicate','deliver'];
const errors=[],report=[];
const GROUP=process.env.R161_QA_GROUP||'all';
const sizeGroup=n=>n.startsWith('portrait')?'portrait':n.startsWith('landscape')?'landscape':'desktop';
const includedSizes=sizes.filter(x=>GROUP==='all'||sizeGroup(x[0])===GROUP);
async function setScroll(page,p){await page.evaluate(p=>{document.documentElement.style.scrollBehavior='auto';document.body.style.scrollBehavior='auto';const s=document.querySelector('[data-ff-story]'),r=s.getBoundingClientRect(),h=s.querySelector('.home-tech-ff__sticky').getBoundingClientRect().height;scrollTo({top:scrollY+r.top+Math.max(1,r.height-h)*p,behavior:'instant'});},p);await page.waitForTimeout(310)}
async function directCapture(page,name){const c=await page.context().newCDPSession(page);try{let r=await c.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});fs.writeFileSync(path.join(OUT,name+'.png'),Buffer.from(r.data,'base64'));}finally{await c.detach()}}
async function headerInfo(page){return page.evaluate(()=>{
 const root=document.querySelector('.home-tech-r161'),story=root.querySelector('[data-ff-story]'),sticky=root.querySelector('.home-tech-ff__sticky'),header=document.querySelector('[data-site-header]');
 const heading=root.querySelector('.home-tech-ff__heading h2'),eyebrow=root.querySelector('.home-tech-ff__eyebrow');
 const active=root.querySelector('.home-tech-ff__stage[aria-hidden="false"]'),final=root.querySelector('.home-tech-ff__resolution');
 const essential=[heading,eyebrow,...(active?[active.querySelector('h3'),active.querySelector('.home-tech-ff__family'),active.querySelector('.home-tech-ff__support'),active.querySelector('.home-tech-r161__outcome'),...active.querySelectorAll('.home-tech-ff__vendor')]:root.dataset.ffStage==='resolved'?[final.querySelector('h3'),root.querySelector('.home-tech-ff__maker')]:[])].filter(Boolean);
 const hr=header.getBoundingClientRect(),vh=visualViewport?.height||innerHeight;
 const overlaps=essential.filter(e=>{let r=e.getBoundingClientRect();let visible=getComputedStyle(e).visibility!=='hidden'&&+getComputedStyle(e).opacity>.4;return visible&&hr.bottom>r.top+2&&hr.top<r.bottom-2&&hr.right>r.left&&hr.left<r.right}).map(e=>(e.textContent||'').trim().slice(0,45));
 const rr=story.getBoundingClientRect(),sr=sticky.getBoundingClientRect(),tr=heading.getBoundingClientRect();
 const guard=story.hasAttribute('data-header-autohide-guard');
 return {stage:root.dataset.ffStage,p:Number(root.style.getPropertyValue('--ff-progress')),guard,headerClass:header.className,headerBottom:hr.bottom,headerVisible:hr.bottom>2,overlaps,stickyH:sr.height,innerH:innerHeight,visualH:vh,visualOffset:visualViewport?.offsetTop||0,storyTop:rr.top,storyBottom:rr.bottom,thesisTop:tr.top,thesisBottom:tr.bottom,thesisClearance:tr.top-hr.bottom,scrollWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth,hasPrevious:!!document.querySelector('[data-tw-r5]'),hasNext:!!document.querySelector('[data-fs-showcase-r11]')};
});}
async function inspect(page){
return page.evaluate(()=>{
 const section=document.querySelector('.home-tech-r161'),stage=section.dataset.ffStage;
 const sticky=section.querySelector('.home-tech-ff__sticky');
 const carrier=section.querySelector('.home-tech-ff__carrier [data-ff-path]');const svg=section.querySelector('.home-tech-ff__carrier');
 const W=innerWidth,H=innerHeight,scene=section.querySelector('.home-tech-ff__scene');
 const css=(x)=>getComputedStyle(x);
 const rect=(e)=>{const r=e.getBoundingClientRect();return {l:r.left,t:r.top,r:r.right,b:r.bottom,w:r.width,h:r.height}};
 const visible=(e)=>{const c=css(e),r=rect(e);return c.display!=='none'&&c.visibility!=='hidden'&&Number(c.opacity)>.1&&r.w>.01&&r.h>.01};
 const active=section.querySelector('.home-tech-ff__stage[aria-hidden="false"]');
 const protectedNodes=[...section.querySelectorAll('.home-tech-ff__heading h2,.home-tech-ff__heading .home-tech-ff__eyebrow,.home-tech-ff__foot p')];
 if(active)protectedNodes.push(...active.querySelectorAll('.home-tech-ff__family,h3,.home-tech-ff__support,.home-tech-r161__outcome,.home-tech-ff__vendor img,.home-tech-ff__vendor b,.home-tech-ff__vendor-copy small,.home-tech-ff__capability-line'));
 else if(stage==='resolved')protectedNodes.push(...section.querySelectorAll('.home-tech-ff__resolution h3,.home-tech-ff__maker,.home-tech-ff__maker img,.home-tech-ff__implementation'));
 const history=section.querySelector('.home-tech-ff__history-rail');if(history)protectedNodes.push(history);
 const clipping=[],collisions=[],engraving=[];
 const wr=rect(sticky),sr=rect(scene);
 /* Precise painted glyph rectangles, not empty column width from block-level boxes. */
 const nodes=protectedNodes.filter(visible).flatMap(e=>{
  const out=[],label=(e.textContent||e.getAttribute('src')||e.tagName).trim().slice(0,65);
  if(e.tagName==='IMG'){out.push({name:label,rect:rect(e),el:e});return out}
  const walk=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n;
  while(n=walk.nextNode()){if(!n.textContent.trim())continue;
   const range=document.createRange();range.selectNodeContents(n);
   for(const rr of range.getClientRects()){
    if(rr.width>.3&&rr.height>.3)out.push({name:label,rect:{l:rr.left,t:rr.top,r:rr.right,b:rr.bottom,w:rr.width,h:rr.height},el:e});
   }
  }
  return out;
 });
 for(const n of nodes){
  const r=n.rect;
  const ancestors=[];let p=n.el.parentElement;while(p&&p!==document.body){const c=css(p);if(['clip','hidden','auto','scroll'].includes(c.overflow)||['clip','hidden','auto','scroll'].includes(c.overflowX)||['clip','hidden','auto','scroll'].includes(c.overflowY)){const pr=rect(p);if(r.l<pr.l-2||r.r>pr.r+2||r.t<pr.t-2||r.b>pr.b+2)ancestors.push(p.className||p.tagName);}p=p.parentElement;}
  if(r.l<-3||r.r>W+3||r.t<-3||r.b>H+3||ancestors.length)clipping.push({name:n.name,rect:r,ancestors});
 }
 const details=[...document.querySelectorAll('.r16-review-details')].filter(visible);
 for(const d of details)for(const n of nodes){const a=rect(d),b=n.rect;if(a.l<b.r&&a.r>b.l&&a.t<b.b&&a.b>b.t)collisions.push({type:'preview-overlay',name:n.name})}
 if(details.length)collisions.push({type:'preview-visible',count:details.length});
 const et=section.querySelector('.home-tech-r161__engraving');
 if(et&&visible(et)){let a=rect(et);for(const n of nodes){const b=n.rect;if(a.l<b.r+3&&a.r+3>b.l&&a.t<b.b+3&&a.b+3>b.t)engraving.push(n.name)}}
 // Transformed centerline from path.getPointAtLength and path.getScreenCTM.
 // Expand stroke by anisotropic scale and extra shadow/filter margin, do not
 // accept carrier behind text as non-overlap.
 const matrix=carrier.getScreenCTM(),total=carrier.getTotalLength(),stroke=parseFloat(css(carrier).strokeWidth)||19;
 /* preserveAspectRatio="none": one SVG unit has different pixel width and height.
  * Model graphite shadow stroke (27 units), blur (9 units) and bevel/drop-shadow;
  * pad separately in screen-space X and Y. */
 const sx=Math.hypot(matrix.a,matrix.b),sy=Math.hypot(matrix.c,matrix.d);
 const rx=Math.max(5,(Math.max(27,stroke)*.5+9)*sx+Math.max(2,3*sx));
 const ry=Math.max(6,(Math.max(27,stroke)*.5+9)*sy+Math.max(2,3*sy));
 const points=[];
 for(let i=0;i<=440;i++){const p=carrier.getPointAtLength(total*i/440),q=svg.createSVGPoint();q.x=p.x;q.y=p.y;const z=q.matrixTransform(matrix);if(z.x>=-rx&&z.x<=W+rx&&z.y>=-ry&&z.y<=H+ry&&z.y>=wr.t-ry&&z.y<=wr.b+ry)points.push({x:z.x,y:z.y,index:i})}
 for(const n of nodes){
  const r=n.rect;let first=null;
  for(const p of points){if(p.x>r.l-rx&&p.x<r.r+rx&&p.y>r.t-ry&&p.y<r.b+ry){first={x:Math.round(p.x),y:Math.round(p.y),index:p.index};break}}
  if(first)collisions.push({type:'carrier-protected',name:n.name,at:first,rect:r,rx:Math.round(rx),ry:Math.round(ry)});
 }
 // Verify brand/engraving geometric relationship even if CSS reserves no gap.
 const marks=[...(active?.querySelectorAll('.home-tech-ff__vendor img,.home-tech-ff__vendor b')||[])].filter(visible).map(rect);
 const integrity=section.querySelector('.home-tech-ff__foot p');
 const controls=[...document.querySelectorAll('details,button,[role="button"]')].filter(e=>{const c=css(e);return (c.position==='fixed'||c.position==='sticky')&&visible(e)});
 for(const ctl of controls){if(integrity&&visible(integrity)){const a=rect(ctl),b=rect(integrity);if(a.l<b.r&&a.r>b.l&&a.t<b.b&&a.b>b.t)collisions.push({type:'fixed-control-integrity',tag:ctl.tagName})}}
 return {stage,carrier:{rx,ry,pointCount:points.length,sx,sy},collisions:collisions.slice(0,28),clipping:clipping.slice(0,28),engraving,marks:marks.length,reviewControls:details.length,storyHeight:section.querySelector('[data-ff-story]').getBoundingClientRect().height,scrollWidth:document.documentElement.scrollWidth};
});
}

const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 for(const [lang,url] of [['en','/'],['ru','/ru/']]){
  for(const [size,w,h] of includedSizes){
   const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
   const page=await ctx.newPage(),runtime=[];
   page.on('pageerror',e=>runtime.push(e.message));
   await page.goto(ORIGIN+url,{waitUntil:'domcontentloaded',timeout:50000});
   await page.locator('.home-tech-r161.is-enhanced').waitFor({timeout:20000});
   for(let i=0;i<4;i++)for(const [phase,fraction] of [['entry',.08],['active',.51],['result',.87]]){
     await setScroll(page,starts[i]+(ends[i]-starts[i])*fraction);
     const geom=await inspect(page),hdr=await headerInfo(page);
     if(geom.stage!==names[i]||geom.collisions.length||geom.clipping.length||geom.engraving.length||geom.scrollWidth>w+2)errors.push({lang,size,stage:names[i],phase,type:'geometry',geom});
     if(w<=700||w<=960&&h<=540){
       if(!hdr.guard||hdr.headerVisible||hdr.overlaps.length||Math.abs(hdr.stickyH-hdr.visualH)>3)errors.push({lang,size,stage:names[i],phase,type:'header-viewport',hdr});
     }
     if((size==='portrait390'||size==='landscape844')&&phase==='result')await directCapture(page,lang+'-'+size+'-'+names[i]+'-paused');
     report.push({lang,size,stage:names[i],phase,carrierCollisions:geom.collisions.length,headerOverlap:hdr.overlaps.length,stickyH:hdr.stickyH,visualH:hdr.visualH,headerVisible:hdr.headerVisible,progress:hdr.p});
   }
   await setScroll(page,.955);
   const final=await inspect(page),hdr=await headerInfo(page);
   if(final.stage!=='resolved'||final.collisions.length||final.clipping.length||hdr.overlaps.length)errors.push({lang,size,type:'final',final,hdr});
   if((size==='portrait390'||size==='landscape844'||size==='laptop1440'))await directCapture(page,lang+'-'+size+'-final');
   if((size==='portrait390'||size==='landscape844')){
      await setScroll(page,.62);const held=await headerInfo(page);
      await page.waitForTimeout(650);const paused=await headerInfo(page);
      await setScroll(page,.59);const reversed=await headerInfo(page);
      if(held.headerVisible||paused.headerVisible||reversed.headerVisible||!paused.guard)errors.push({lang,size,type:'pause-reverse-header',held,paused,reversed});
   }
   if(size==='portrait390'){
      await setScroll(page,.62);const before=await headerInfo(page);
      await page.setViewportSize({width:390,height:744});await page.waitForTimeout(280);
      const expanded=await headerInfo(page);
      await page.setViewportSize({width:390,height:844});await page.waitForTimeout(280);
      const restored=await headerInfo(page);
      if([expanded,restored].some(x=>x.overlaps.length||x.headerVisible||Math.abs(x.stickyH-x.visualH)>3))errors.push({lang,size,type:'chrome-resize',before,expanded,restored});
      if(restored.stage!==before.stage)errors.push({lang,size,type:'stage-reset',before,expanded,restored});
      await page.setViewportSize({width:844,height:390});await page.waitForTimeout(300);
      const rotated=await headerInfo(page);
      await page.setViewportSize({width:390,height:844});await page.waitForTimeout(300);
      const returned=await headerInfo(page);
      if(rotated.overlaps.length||returned.overlaps.length||!returned.guard)errors.push({lang,size,type:'rotate',rotated,returned});
      report.push({lang,size,type:'viewport-cycle',before,expanded,restored,rotated,returned});
   }
   if(runtime.length)errors.push({lang,size,type:'javascript',runtime});
   console.log('R161_MOBILE_VIEWPORT '+JSON.stringify({lang,size,issues:errors.filter(e=>e.lang===lang&&e.size===size).length}));
   await ctx.close();
  }
  /* Accessible no-motion and no-JavaScript fallback on the complete homepage. */
  for(const mode of ['reduce','nojs']){
   const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:mode==='reduce'?'reduce':'no-preference',javaScriptEnabled:mode!=='nojs'});
   const page=await ctx.newPage();await page.goto(ORIGIN+url,{waitUntil:'domcontentloaded'});
   const fallback=await page.locator('.home-tech-r161 .home-tech-ff__stage h3').count();
   const story=await page.locator('.home-tech-r161 .home-tech-ff__story').evaluate(el=>getComputedStyle(el).height);
   if(fallback!==4||story==='0px')errors.push({lang,mode,type:'fallback',fallback,story});
   await ctx.close();
  }
 }
}finally{await browser.close()}
fs.writeFileSync(path.join(OUT,'metrics.json'),JSON.stringify({errors,report},null,2));
console.log('R161_MOBILE_INTEGRATION_RESULT '+JSON.stringify({pass:errors.length===0,viewports:includedSizes.length*2,geometryFrames:includedSizes.length*26,group:GROUP,errors:errors.slice(0,18)}));
if(errors.length)process.exitCode=1;
