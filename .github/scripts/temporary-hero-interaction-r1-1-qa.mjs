import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist']
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const pageErrors = [];
const consoleErrors = [];
page.on('pageerror', error => pageErrors.push(String(error)));
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

const sample = () => page.evaluate(() => {
  const hero = window.__PROAI_HERO_CUBE_R1;
  const d = hero.runtime.getDiagnostics();
  return {
    sim: d.presentation.simTimeMs,
    q: d.presentation.quaternion,
    events: d.scheduler.eventSerial,
    active: d.activeTurns.map(t => ({ id: t.id, linear: t.linear })),
    interaction: d.interaction,
    camera: d.interaction.cameraPosition,
    contract: hero.runtime.getHeroInteractionContract()
  };
});
const qDelta = (a, b) => Math.max(...a.map((v, i) => Math.abs(v - b[i])));
const vecDistance = (a, b) => Math.hypot(...a.map((v, i) => v - b[i]));
const close = (a, b) => Math.abs(a - b) <= Math.max(1e-5, Math.abs(a) * 1e-7);
const canvasBox = async () => {
  const box = await page.locator('#cube-canvas').boundingBox();
  assert.ok(box && box.width > 300 && box.height > 300, 'Cube canvas missing or unexpectedly small');
  return box;
};
const edgeAlpha = () => page.evaluate(() => {
  const hero = window.__PROAI_HERO_CUBE_R1;
  const canvas = document.getElementById('cube-canvas');
  hero.runtime.renderReviewFrame();
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) throw new Error('WebGL context unavailable for edge check');
  const w = gl.drawingBufferWidth;
  const h = gl.drawingBufferHeight;
  const strips = [
    [0, 0, w, 1], [0, h - 1, w, 1], [0, 0, 1, h], [w - 1, 0, 1, h]
  ];
  let maxAlpha = 0;
  let occupied = 0;
  for (const [x, y, sw, sh] of strips) {
    const px = new Uint8Array(sw * sh * 4);
    gl.readPixels(x, y, sw, sh, gl.RGBA, gl.UNSIGNED_BYTE, px);
    for (let i = 3; i < px.length; i += 4) {
      maxAlpha = Math.max(maxAlpha, px[i]);
      if (px[i] > 8) occupied += 1;
    }
  }
  return { maxAlpha, occupied, width: w, height: h };
});

await page.goto('http://127.0.0.1:8080/', { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() =>
  document.querySelector('.proai-hero-object-slot')?.dataset.cubeMounted === 'true' &&
  window.__PROAI_HERO_CUBE_R1?.runtime?.ready,
  { timeout: 30000 }
);

const initial = await sample();
assert.equal(await page.evaluate(() => window.__PROAI_HERO_CUBE_R1.coarsePointer), false, 'desktop QA resolved as coarse pointer');
assert.equal(initial.contract.controlsEnabled, true, 'desktop OrbitControls disabled');
assert.equal(initial.contract.zoomEnabled, false, 'OrbitControls zoom must be disabled');
assert.equal(initial.contract.panEnabled, false, 'OrbitControls pan must remain disabled');

// A — autonomous baseline.
await page.waitForTimeout(6500);
const baseline = await sample();
assert.ok(baseline.sim - initial.sim > 4000, 'presentation timeline did not advance at baseline');
assert.ok(qDelta(baseline.q, initial.q) > 1e-3, 'presentation quaternion did not change at baseline');
assert.ok(baseline.events > initial.events, 'slice scheduler did not advance at baseline');

// B — hold and drag for ~9 seconds while autonomy and slices continue.
let box = await canvasBox();
const cx = box.x + box.width * 0.5;
const cy = box.y + box.height * 0.5;
const beforeDrag = await sample();
await page.mouse.move(cx, cy);
await page.mouse.down();
const turnProgress = new Map();
let observedActiveTurn = false;
let observedTurnProgress = false;
for (let i = 0; i < 90; i += 1) {
  const a = i * 0.16;
  await page.mouse.move(cx + Math.sin(a) * 105, cy + Math.cos(a * 0.83) * 68);
  await page.waitForTimeout(100);
  if (i % 2 === 0) {
    const s = await sample();
    for (const turn of s.active) {
      observedActiveTurn = true;
      const prev = turnProgress.get(turn.id);
      if (prev !== undefined && turn.linear > prev + 0.015) observedTurnProgress = true;
      turnProgress.set(turn.id, turn.linear);
    }
  }
}
const held = await sample();
assert.equal(held.interaction.interactionActive, true, 'Orbit interaction did not become active during hold');
assert.ok(held.sim - beforeDrag.sim > 6500, 'presentation timeline froze during mouse drag');
assert.ok(qDelta(held.q, beforeDrag.q) > 1e-3, 'presentation quaternion froze during mouse drag');
assert.ok(held.events > beforeDrag.events, 'slice event serial did not advance during mouse drag');
assert.ok(observedActiveTurn && observedTurnProgress, 'active slice did not visibly progress during mouse drag');

// C — release, no outside click, no delayed restart, no camera snap.
await page.mouse.up();
const released = await sample();
await page.waitForTimeout(5200);
const afterRelease = await sample();
assert.ok(afterRelease.sim - released.sim > 3500, 'presentation did not continue immediately after release');
assert.ok(qDelta(afterRelease.q, released.q) > 1e-3, 'presentation quaternion stalled after release');
assert.equal(afterRelease.interaction.resumeDelayRemainingMs, 0, 'manual resume delay remains');
assert.equal(afterRelease.interaction.sliceResumeDelayRemainingMs, 0, 'slice resume stagger remains');
assert.equal(afterRelease.interaction.presentationResumeActive, false, 'presentation resume blend remains active');
assert.ok(vecDistance(afterRelease.camera, baseline.camera) > 1, 'camera snapped back to baseline viewing angle');
assert.ok(close(released.contract.cameraDistance, initial.contract.cameraDistance), 'orbit changed default camera distance');
assert.ok(close(afterRelease.contract.cameraDistance, initial.contract.cameraDistance), 'camera distance drifted after release');

// D — release pointer outside canvas; autonomy must continue without another click.
box = await canvasBox();
const ox = box.x + box.width * 0.56;
const oy = box.y + box.height * 0.48;
await page.mouse.move(ox, oy);
await page.mouse.down();
const outsideStart = await sample();
await page.mouse.move(20, 20, { steps: 16 });
await page.waitForTimeout(2500);
const outsideHeld = await sample();
assert.ok(outsideHeld.sim - outsideStart.sim > 1500, 'autonomy froze while pointer was held outside canvas');
await page.mouse.up();
const outsideRelease = await sample();
await page.waitForTimeout(5200);
const outsideAfter = await sample();
assert.ok(outsideAfter.sim - outsideRelease.sim > 3500, 'Cube stuck after release outside canvas');
assert.equal(outsideAfter.interaction.resumeDelayRemainingMs, 0, 'outside release reintroduced resume delay');
assert.equal(outsideAfter.interaction.sliceResumeDelayRemainingMs, 0, 'outside release reintroduced slice delay');

// Zoom — camera distance fixed; wheel must remain page scroll.
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(250);
box = await canvasBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
const zoomBefore = await sample();
await page.mouse.wheel(0, 900);
await page.waitForTimeout(450);
const zoomAfterDown = await sample();
const scrollAfterDown = await page.evaluate(() => window.scrollY);
assert.ok(scrollAfterDown > 50, 'wheel over Cube did not scroll page');
assert.ok(close(zoomBefore.contract.cameraDistance, zoomAfterDown.contract.cameraDistance), 'wheel changed camera distance');
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
box = await canvasBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
const zoomBeforeUp = await sample();
await page.mouse.wheel(0, -900);
await page.waitForTimeout(450);
const zoomAfterUp = await sample();
assert.ok(close(zoomBeforeUp.contract.cameraDistance, zoomAfterUp.contract.cameraDistance), 'reverse wheel changed camera distance');

// Default-distance crop guard — orbit only, no zoom; no rendered alpha may touch canvas border.
const edges = [await edgeAlpha()];
box = await canvasBox();
for (const [dx, dy] of [[130, -75], [-145, 45], [95, 105], [-115, -90]]) {
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + dy, { steps: 14 });
  await page.mouse.up();
  await page.waitForTimeout(500);
  edges.push(await edgeAlpha());
}
for (const edge of edges) {
  assert.equal(edge.occupied, 0, `Cube reached canvas boundary: ${JSON.stringify(edge)}`);
}

assert.deepEqual(pageErrors, [], `page errors: ${pageErrors.join(' | ')}`);
assert.deepEqual(consoleErrors, [], `console errors: ${consoleErrors.join(' | ')}`);
console.log('HERO_INTERACTION_R1_1_QA_PASS', JSON.stringify({
  baselineMotion: true,
  dragMotion: true,
  dragSlices: true,
  release: true,
  releaseOutside: true,
  zoomDisabled: true,
  pageScroll: true,
  edgeChecks: edges,
  cameraDistance: initial.contract.cameraDistance
}));
await browser.close();
