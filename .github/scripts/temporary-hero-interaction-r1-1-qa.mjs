import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({
  headless: false,
  args: [
    '--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist',
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows', '--disable-features=CalculateNativeWinOcclusion'
  ]
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', e => errors.push(String(e)));

const snap = () => page.evaluate(() => {
  const h = window.__PROAI_HERO_CUBE_R1;
  const d = h.runtime.getDiagnostics();
  return {
    sim: d.presentation.simTimeMs, q: d.presentation.quaternion,
    events: d.scheduler.eventSerial,
    turns: d.activeTurns.map(t => ({ id: t.id, linear: t.linear })),
    i: d.interaction, camera: d.interaction.cameraPosition,
    c: h.runtime.getHeroInteractionContract()
  };
});
const qd = (a,b) => Math.max(...a.map((v,i) => Math.abs(v-b[i])));
const vd = (a,b) => Math.hypot(...a.map((v,i) => v-b[i]));
const close = (a,b) => Math.abs(a-b) < 1e-5;
const box = async () => {
  const b = await page.locator('#cube-canvas').boundingBox();
  assert.ok(b && b.width > 300 && b.height > 300); return b;
};
const edge = () => page.evaluate(() => {
  const h = window.__PROAI_HERO_CUBE_R1, c = document.getElementById('cube-canvas');
  h.runtime.renderReviewFrame();
  const gl = c.getContext('webgl2') || c.getContext('webgl');
  if (!gl) throw new Error('WebGL unavailable');
  const w=gl.drawingBufferWidth,hg=gl.drawingBufferHeight, strips=[[0,0,w,1],[0,hg-1,w,1],[0,0,1,hg],[w-1,0,1,hg]];
  let occupied=0;
  for (const [x,y,sw,sh] of strips) {
    const p=new Uint8Array(sw*sh*4); gl.readPixels(x,y,sw,sh,gl.RGBA,gl.UNSIGNED_BYTE,p);
    for(let i=3;i<p.length;i+=4) if(p[i]>8) occupied++;
  }
  return {occupied,w,h:hg};
});

await page.goto('http://127.0.0.1:8080/', { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => document.querySelector('.proai-hero-object-slot')?.dataset.cubeMounted === 'true' && window.__PROAI_HERO_CUBE_R1?.runtime?.ready, { timeout: 30000 });
assert.equal(await page.evaluate(() => window.__PROAI_HERO_CUBE_R1.coarsePointer), false);

// A — autonomous baseline.
const a0=await snap(); await page.waitForTimeout(6500); const a1=await snap();
console.log('A', JSON.stringify({a0,a1}));
assert.ok(a1.sim>a0.sim, 'baseline presentation frozen');
assert.ok(qd(a1.q,a0.q)>1e-5, 'baseline quaternion frozen');
assert.ok(a1.events>a0.events || a1.turns.length>0, 'baseline slice scheduler inactive');
assert.equal(a1.c.zoomEnabled,false); assert.equal(a1.c.panEnabled,false);

// B — hold/drag ~9s; presentation + slices stay live.
let b=await box(), x=b.x+b.width/2, y=b.y+b.height/2;
const d0=await snap(); await page.mouse.move(x,y); await page.mouse.down();
const progress=new Map(); let sliceProgress=false;
for(let n=0;n<75;n++){
  const t=n*.2; await page.mouse.move(x+Math.sin(t)*105,y+Math.cos(t*.8)*70); await page.waitForTimeout(120);
  if(n%3===0){ const s=await snap(); for(const tr of s.turns){ const p=progress.get(tr.id); if(p!==undefined&&tr.linear>p+.01)sliceProgress=true; progress.set(tr.id,tr.linear); } }
}
const d1=await snap();
console.log('B', JSON.stringify({d0,d1,sliceProgress}));
assert.equal(d1.i.interactionActive,true); assert.equal(d1.i.autonomyBlocked,false); assert.equal(d1.i.sliceAutonomyBlocked,false);
assert.ok(d1.sim>d0.sim,'presentation froze during drag'); assert.ok(qd(d1.q,d0.q)>1e-5,'quaternion froze during drag');
assert.ok(d1.events>d0.events || sliceProgress,'slice choreography froze during drag');

// C — release; no outside click, delay, restart, or snap.
await page.mouse.up(); const r0=await snap(); await page.waitForTimeout(5200); const r1=await snap();
console.log('C', JSON.stringify({r0,r1}));
assert.ok(r1.sim>r0.sim,'presentation stuck after release'); assert.equal(r1.i.resumeDelayRemainingMs,0); assert.equal(r1.i.sliceResumeDelayRemainingMs,0); assert.equal(r1.i.presentationResumeActive,false);
assert.ok(vd(r1.camera,a1.camera)>1,'camera snapped to baseline'); assert.ok(close(r1.c.cameraDistance,a0.c.cameraDistance),'camera distance changed');

// D — release outside canvas; no second click.
b=await box(); x=b.x+b.width*.55; y=b.y+b.height*.48; await page.mouse.move(x,y); await page.mouse.down();
const o0=await snap(); await page.mouse.move(20,20,{steps:16}); await page.waitForTimeout(2500); const oh=await snap(); await page.mouse.up(); const o1=await snap(); await page.waitForTimeout(5200); const o2=await snap();
console.log('D', JSON.stringify({o0,oh,o1,o2}));
assert.ok(oh.sim>o0.sim,'drag-out froze autonomy'); assert.ok(o2.sim>o1.sim,'release outside left Cube stuck'); assert.equal(o2.i.resumeDelayRemainingMs,0); assert.equal(o2.i.sliceResumeDelayRemainingMs,0);

// Zoom disabled; wheel remains normal page scroll.
await page.evaluate(() => scrollTo(0,0)); await page.waitForTimeout(250); b=await box(); await page.mouse.move(b.x+b.width/2,b.y+b.height/2);
const z0=await snap(); await page.mouse.wheel(0,900); await page.waitForTimeout(450); const z1=await snap(); const sy=await page.evaluate(()=>scrollY);
assert.ok(sy>50,'wheel over Cube did not scroll page'); assert.ok(close(z0.c.cameraDistance,z1.c.cameraDistance),'wheel zoom changed camera distance');
await page.evaluate(() => scrollTo(0,0)); await page.waitForTimeout(250); b=await box(); await page.mouse.move(b.x+b.width/2,b.y+b.height/2); const z2=await snap(); await page.mouse.wheel(0,-900); await page.waitForTimeout(350); const z3=await snap(); assert.ok(close(z2.c.cameraDistance,z3.c.cameraDistance),'reverse wheel zoom changed camera distance');

// Default-distance orbit must not touch canvas boundary.
const edges=[await edge()]; b=await box();
for(const [dx,dy] of [[130,-75],[-145,45],[95,105],[-115,-90]]){ x=b.x+b.width/2; y=b.y+b.height/2; await page.mouse.move(x,y); await page.mouse.down(); await page.mouse.move(x+dx,y+dy,{steps:12}); await page.mouse.up(); await page.waitForTimeout(450); edges.push(await edge()); }
console.log('EDGE',JSON.stringify(edges)); for(const e of edges) assert.equal(e.occupied,0,`default-distance clipping: ${JSON.stringify(e)}`);
assert.deepEqual(errors,[]);
console.log('HERO_INTERACTION_R1_1_QA_PASS');
await browser.close();
