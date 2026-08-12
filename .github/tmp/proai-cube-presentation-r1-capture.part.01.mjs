const duringCalmDelay = await livePage.evaluate(() => window.__PROAI_CUBE_R1.getDiagnostics());
await livePage.waitForTimeout(1050);
const earlyResume = await livePage.evaluate(() => window.__PROAI_CUBE_R1.getDiagnostics());
await livePage.waitForTimeout(700);
const blendedResume = await livePage.evaluate(() => window.__PROAI_CUBE_R1.getDiagnostics());
const cameraNoSnap = vectorDistance(cameraAtHeldAngle, blendedResume.interaction.cameraPosition) < 1.0;
const activeSliceCompleted = sliceFinishedWhileDrag.activeTurn === null
  && sliceFinishedWhileDrag.lastTurnResult?.axis === dragTurn.axis
  && sliceFinishedWhileDrag.lastTurnResult?.layer === dragTurn.layer
  && sliceFinishedWhileDrag.lastTurnResult?.endpointErrorRad === 0;
const nextSliceBlocked = blockedAfterSlice.activeTurn === null && blockedAfterSlice.interaction.interactionActive;
const interactionPass = duringDrag.interaction.interactionActive
  && duringDrag.interaction.autonomyBlocked
  && activeSliceCompleted
  && nextSliceBlocked
  && !afterRelease.interaction.interactionActive
  && afterRelease.interaction.resumeDelayRemainingMs > 1500
  && duringCalmDelay.interaction.autonomyBlocked
  && earlyResume.interaction.presentationResumeActive
  && blendedResume.interaction.presentationResumeActive
  && cameraNoSnap;
await livePage.close();

const naturalPage = await openPage(CAPTURE_URL, SCREENSHOT_VIEWPORT);
await naturalPage.evaluate(() => window.__PROAI_CUBE_R1.setReviewPresentation(1.4, 1));
await naturalPage.screenshot({ path: NATURAL_PATH, fullPage: true });
await naturalPage.close();

const largePage = await openPage(CAPTURE_URL, SCREENSHOT_VIEWPORT);
await largePage.evaluate(() => {
  window.__PROAI_CUBE_R1.beginReviewInspection(1);
  window.__PROAI_CUBE_R1.setReviewInspectionProgress(0.52, 4.0);
});
await largePage.screenshot({ path: LARGE_PATH, fullPage: true });
await largePage.close();

const slicePage = await openPage(CAPTURE_URL, SCREENSHOT_VIEWPORT);
await slicePage.evaluate(() => {
  const api = window.__PROAI_CUBE_R1;
  api.beginReviewInspection(0);
  api.setReviewInspectionProgress(0.64, 4.3);
  api.beginReviewTurn('Z', 1, 1);
  api.setReviewTurnProgress(0.54);
});
await slicePage.screenshot({ path: SLICE_PATH, fullPage: true });
await slicePage.close();

const videoPage = await openPage(CAPTURE_URL, VIDEO_VIEWPORT);
const frameBuffers = [];
const segments = [];
let videoTimeSec = 0;
let frameIndex = 0;
async function captureCurrentFrame() {
  const dataUrl = await videoPage.evaluate(() => {
    window.__PROAI_CUBE_R1.renderReviewFrame();
    return document.getElementById('cube-canvas').toDataURL('image/jpeg', 0.93);
  });
  frameBuffers.push(jpegBufferFromDataUrl(dataUrl));
  frameIndex += 1;
  if (frameIndex % 96 === 0) console.log(`Presentation R1.1 frame ${frameIndex}`);
}
async function addHold(label, seconds, { frozen = false, resume = false } = {}) {
  const count = Math.round(seconds * FPS);
  const start = videoTimeSec;
  for (let i = 0; i < count; i += 1) {
    if (!frozen) {
      const resumeProgress = resume ? (i + 1) / count : 1;
      await videoPage.evaluate(({ timeSec, resumeProgress }) => window.__PROAI_CUBE_R1.setReviewPresentation(timeSec, resumeProgress), { timeSec: videoTimeSec, resumeProgress });
    }
    await captureCurrentFrame();
    videoTimeSec += 1 / FPS;
  }
  segments.push({ label, startSec: start, endSec: videoTimeSec, frames: count });
}
async function addTurn(label, axis, layer, direction, seconds) {
  const count = Math.round(seconds * FPS);
  const start = videoTimeSec;
  const began = await videoPage.evaluate(({ axis, layer, direction }) => window.__PROAI_CUBE_R1.beginReviewTurn(axis, layer, direction), { axis, layer, direction });
  if (!began) throw new Error(`Could not begin review slice ${label}`);
  for (let i = 0; i < count; i += 1) {
    const progress = (i + 1) / count;
    await videoPage.evaluate(({ progress, timeSec }) => {
      const api = window.__PROAI_CUBE_R1;
      api.setReviewPresentation(timeSec, 1);
      api.setReviewTurnProgress(progress);
    }, { progress, timeSec: videoTimeSec });
    await captureCurrentFrame();
    videoTimeSec += 1 / FPS;
  }
  segments.push({ label, axis, layer, direction, startSec: start, endSec: videoTimeSec, frames: count });
}
async function addInspectionWithSlice(label, moveIndex, seconds, overlap) {
  const count = Math.round(seconds * FPS);
  const start = videoTimeSec;
  const move = await videoPage.evaluate(({ moveIndex }) => window.__PROAI_CUBE_R1.beginReviewInspection(moveIndex), { moveIndex });
  if (!move) throw new Error(`Could not begin inspection ${label}`);
  const sliceStartFrame = Math.round(count * overlap.startProgress);
  const sliceFrames = Math.round(overlap.seconds * FPS);
  let sliceBegan = false;
  for (let i = 0; i < count; i += 1) {
    const progress = (i + 1) / count;
    await videoPage.evaluate(({ progress, timeSec }) => window.__PROAI_CUBE_R1.setReviewInspectionProgress(progress, timeSec), { progress, timeSec: videoTimeSec });
    if (i >= sliceStartFrame && !sliceBegan) {
      sliceBegan = Boolean(await videoPage.evaluate(({ overlap }) => window.__PROAI_CUBE_R1.beginReviewTurn(overlap.axis, overlap.layer, overlap.direction), { overlap }));
      if (!sliceBegan) throw new Error('Could not begin overlapping slice during inspection');
    }
    if (sliceBegan && i >= sliceStartFrame) {
      const sliceProgress = Math.min(1, (i - sliceStartFrame + 1) / sliceFrames);
      await videoPage.evaluate(({ sliceProgress }) => window.__PROAI_CUBE_R1.setReviewTurnProgress(sliceProgress), { sliceProgress });
    }
    await captureCurrentFrame();
    videoTimeSec += 1 / FPS;
  }
  segments.push({ label, moveIndex, yawDeg: move.yawDeg, pitchAmpDeg: move.pitchAmpDeg, rollAmpDeg: move.rollAmpDeg, startSec: start, endSec: videoTimeSec, frames: count, overlapSlice: overlap });
}
async function addManualOrbit(label, seconds) {
  const count = Math.round(seconds * FPS);
  const start = videoTimeSec;
  const box = await videoPage.locator('#cube-canvas').boundingBox();
  if (!box) throw new Error('Video canvas box unavailable');
  const x = box.x + box.width * 0.51;
  const y = box.y + box.height * 0.49;
  await videoPage.mouse.move(x, y);
  await videoPage.mouse.down();
  for (let i = 0; i < count; i += 1) {
    const p = (i + 1) / count;
    const eased = p * p * (3 - 2 * p);
    await videoPage.mouse.move(x + 150 * eased, y - 20 * eased);
    await captureCurrentFrame();
    videoTimeSec += 1 / FPS;
  }
  await videoPage.mouse.up();
  segments.push({ label, startSec: start, endSec: videoTimeSec, frames: count, manualOrbit: true });
}

await addHold('normal-3q-hold', 1.40);
await addTurn('rubik-x1', 'X', 1, 1, 1.38);
await addHold('post-slice-breath', 0.60);
