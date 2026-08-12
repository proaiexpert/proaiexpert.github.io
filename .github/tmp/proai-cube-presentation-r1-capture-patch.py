from pathlib import Path
p=Path('docs/site-evolution/spline/proai-cube-presentation-motion-r1/capture.mjs')
s=p.read_text()
old="""const livePage = await openPage(LIVE_URL, SCREENSHOT_VIEWPORT);
await livePage.waitForFunction(() => {
  const d = window.__PROAI_CUBE_R1.getDiagnostics();
  return d.activeTurn && d.activeTurn.linear > 0.08 && d.activeTurn.linear < 0.88;
}, null, { timeout: 9000 });"""
new="""const livePage = await openPage(LIVE_URL, SCREENSHOT_VIEWPORT);
await livePage.evaluate(() => window.__PROAI_CUBE_R1.stopChoreography());
await livePage.waitForFunction(() => {
  const d = window.__PROAI_CUBE_R1.getDiagnostics();
  return d.activeTurn === null && d.motionState === 'rest';
}, null, { timeout: 5000 });
await livePage.waitForTimeout(120);
const manualSliceStarted = await livePage.evaluate(() => {
  void window.__PROAI_CUBE_R1.turnSlice({ axis: 'X', layer: 1, direction: 1, durationMs: 1380, ignoreInteraction: false });
  return window.__PROAI_CUBE_R1.getDiagnostics().activeTurn !== null;
});
if (!manualSliceStarted) throw new Error('Could not start deterministic interaction slice');
await livePage.waitForTimeout(100);"""
assert old in s
s=s.replace(old,new,1)
old_box="""const liveBox = await livePage.locator('#cube-canvas').boundingBox();
if (!liveBox) throw new Error('Live canvas box unavailable');"""
new_box="""const liveBox = await livePage.evaluate(() => {
  const el = document.getElementById('cube-canvas');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height };
});
if (!liveBox || liveBox.width <= 0 || liveBox.height <= 0) throw new Error('Live canvas rect unavailable');"""
assert old_box in s
s=s.replace(old_box,new_box,1)
old2="""const sliceFinishedWhileDrag = await livePage.evaluate(() => window.__PROAI_CUBE_R1.getDiagnostics());
await livePage.waitForTimeout(1200);"""
new2="""const sliceFinishedWhileDrag = await livePage.evaluate(() => window.__PROAI_CUBE_R1.getDiagnostics());
const blockedNewSliceAttempt = await livePage.evaluate(async () => window.__PROAI_CUBE_R1.turnSlice({ axis: 'Y', layer: 0, direction: -1, durationMs: 1320, ignoreInteraction: false }));
await livePage.waitForTimeout(1200);"""
assert old2 in s
s=s.replace(old2,new2,1)
old3="const nextSliceBlocked = blockedAfterSlice.activeTurn === null && blockedAfterSlice.interaction.interactionActive;"
new3="const nextSliceBlocked = blockedNewSliceAttempt === false && blockedAfterSlice.activeTurn === null && blockedAfterSlice.interaction.interactionActive;"
assert old3 in s
s=s.replace(old3,new3,1)
old4="""    activeSliceCompleted,
    nextSliceBlocked,
    cameraNoSnap,"""
new4="""    activeSliceCompleted,
    blockedNewSliceAttempt,
    nextSliceBlocked,
    cameraNoSnap,"""
assert old4 in s
s=s.replace(old4,new4,1)
old_video="""  const box = await videoPage.locator('#cube-canvas').boundingBox();
  if (!box) throw new Error('Video canvas box unavailable');"""
new_video="""  const box = await videoPage.evaluate(() => {
    const el = document.getElementById('cube-canvas');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  if (!box || box.width <= 0 || box.height <= 0) throw new Error('Video canvas rect unavailable');"""
assert old_video in s
s=s.replace(old_video,new_video,1)
p.write_text(s)
print('Deterministic interaction QA patch applied with direct DOM canvas rects')
