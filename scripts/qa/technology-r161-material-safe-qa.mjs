/* P0 material collision acceptance: transformed SVG centerline, stroke, bevel,
 * shadow, preview controls, text, identity geometry; NEVER only SVG <svg> bounds. */
import {chromium} from 'playwright';
import fs from 'node:fs';import path from 'node:path';
const BASE='http://127.0.0.1:8787/owner-preview/technology-fold-flow-r1-6-1/';
const OUT='r161-p0-visual-artifacts';fs.mkdirSync(OUT,{recursive:true});
const sizes=[['desktop1920',1920,1080],['laptop1440',1440,900],['laptop1366',1366,768],['laptop1280',1280,720],['portrait430',430,932],['portrait390',390,844],['portrait375',375,812],['landscape844',844,390],['landscape896',896,414],['landscape932',932,430]];
const names=['understand','orchestrate','communicate','deliver'],starts=[.04,.27,.46,.65],ends=[.27,.46,.65,.83];
const errors=[],results=[];
async function setScroll(page,p){await page.evaluate(p=>{document.documentElement.style.scrollBehavior='auto';document.body.style.scrollBehavior='auto';const s=document.querySelector('[data-ff-story]');const r=s.getBoundingClientRect();scrollTo({top:scrollY+r.top+Math.max(1,r.height-document.querySelector('.home-tech-ff__sticky').getBoundingClientRect().height)*p,behavior:'instant'});},p);await page.waitForTimeout(340)}
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
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const lang of ['en','ru']){
  for(const [name,w,h] of sizes){
   const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
   const page=await ctx.newPage(),runtime=[];
   page.on('pageerror',e=>runtime.push(e.message));page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:8787/')&&r.status()>=400)runtime.push(r.url()+' '+r.status())});
   await page.goto(BASE+(lang==='en'?'index.html':'ru.html'),{waitUntil:'domcontentloaded'});
   await page.locator('.home-tech-r161.is-enhanced').waitFor();
   for(let i=0;i<4;i++){
    for(const [phase,fraction] of [['entry',.08],['active',.51],['result',.87]]){
     await setScroll(page,starts[i]+(ends[i]-starts[i])*fraction);
     const geom=await inspect(page),file='p0-'+lang+'-'+name+'-'+names[i]+'-'+phase+'.png';
     await page.screenshot({path:path.join(OUT,file)});
     if(geom.stage!==names[i]||geom.collisions.length||geom.clipping.length||geom.engraving.length||geom.reviewControls||geom.scrollWidth>w+2||runtime.length){errors.push({lang,name,phase,operation:names[i],geom,runtime});}
     results.push({lang,name,phase,operation:names[i],collisions:geom.collisions.length,clipping:geom.clipping.length,pathRadius:[Math.round(geom.carrier.rx),Math.round(geom.carrier.ry)]});
    }
   }
   await setScroll(page,.955);
   const geom=await inspect(page);
   await page.screenshot({path:path.join(OUT,'p0-'+lang+'-'+name+'-resolved.png')});
   if(geom.stage!=='resolved'||geom.collisions.length||geom.clipping.length||geom.reviewControls||geom.scrollWidth>w+2)errors.push({lang,name,phase:'resolved',geom});
   results.push({lang,name,phase:'resolved',collisions:geom.collisions.length,clipping:geom.clipping.length});
   console.log('P0_VIEWPORT '+JSON.stringify({lang,name,size:[w,h],errors:errors.filter(e=>e.lang===lang&&e.name===name).length}));
   await ctx.close();
  }
 }
}finally{await browser.close()}
fs.writeFileSync(path.join(OUT,'p0-results.json'),JSON.stringify({errors,results},null,2));
console.log('R161_P0_QA_RESULT '+JSON.stringify({pass:!errors.length,errors:errors.length,viewportLocales:20,frames:results.length,details:errors.slice(0,20)}));
if(errors.length)process.exitCode=1;
