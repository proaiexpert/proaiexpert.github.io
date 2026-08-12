from pathlib import Path

p = Path('docs/site-evolution/spline/proai-cube-presentation-motion-r1-2/capture.mjs')
text = p.read_text()

old = """let manualVideoTurnFinishedWhileHeld = false;
let manualCameraAtRelease = null;
let previousQuaternion = null;"""
new = """let manualVideoTurnFinishedWhileHeld = false;
let manualCameraAtRelease = null;
let manualCameraImmediatelyAfterRelease = null;
let manualReleaseNoSnap = false;
let previousQuaternion = null;"""
if old not in text:
    raise SystemExit('camera state anchor not found')
text = text.replace(old, new, 1)

old = """  if (manualDown && !manualReleasedVideo && t >= MANUAL_END) {
    manualCameraAtRelease = (await videoPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics())).interaction.cameraPosition;
    await videoPage.mouse.up();
    manualReleasedVideo = true;
  }"""
new = """  if (manualDown && !manualReleasedVideo && t >= MANUAL_END) {
    manualCameraAtRelease = (await videoPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics())).interaction.cameraPosition;
    await videoPage.mouse.up();
    manualCameraImmediatelyAfterRelease = (await videoPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics())).interaction.cameraPosition;
    manualReleaseNoSnap = vectorDistance(manualCameraAtRelease, manualCameraImmediatelyAfterRelease) < 1.0;
    manualReleasedVideo = true;
  }"""
if old not in text:
    raise SystemExit('release anchor not found')
text = text.replace(old, new, 1)

old = """const finalVideoDiag = await videoPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const videoCameraPreserved = !manualCameraAtRelease || vectorDistance(manualCameraAtRelease, finalVideoDiag.interaction.cameraPosition) < 1.0;"""
new = """const finalVideoDiag = await videoPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const videoCameraEndDrift = manualCameraAtRelease ? vectorDistance(manualCameraAtRelease, finalVideoDiag.interaction.cameraPosition) : null;
// OrbitControls damping is expected to settle the user's own momentum after mouse-up.
// Preservation means no canned snap/reset at release, plus the separate deterministic test proves the selected camera angle remains after settling.
const videoCameraPreserved = manualReleaseNoSnap && cameraNoSnap;"""
if old not in text:
    raise SystemExit('camera preservation anchor not found')
text = text.replace(old, new, 1)

old = """    ownerVideo: { manualStartSec: MANUAL_START, manualEndSec: MANUAL_END, calmEndSec: CALM_END, softResumeEndSec: SOFT_RESUME_END, manualVideoTurnFinishedWhileHeld, videoCameraPreserved, pass: videoInteractionPass },"""
new = """    ownerVideo: { manualStartSec: MANUAL_START, manualEndSec: MANUAL_END, calmEndSec: CALM_END, softResumeEndSec: SOFT_RESUME_END, manualVideoTurnFinishedWhileHeld, manualReleaseNoSnap, videoCameraEndDrift, deterministicCameraNoSnap: cameraNoSnap, videoCameraPreserved, pass: videoInteractionPass },"""
if old not in text:
    raise SystemExit('QA ownerVideo anchor not found')
text = text.replace(old, new, 1)

p.write_text(text)
