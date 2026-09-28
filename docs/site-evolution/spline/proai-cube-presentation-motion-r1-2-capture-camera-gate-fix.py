from pathlib import Path

p = Path('docs/site-evolution/spline/proai-cube-presentation-motion-r1-2/capture.mjs')
text = p.read_text()

old = """let manualVideoTurnFinishedWhileHeld = false;
let manualCameraAtRelease = null;
let previousQuaternion = null;"""
new = """let manualVideoTurnFinishedWhileHeld = false;
let manualCameraAtRelease = null;
let manualCameraBeforeRelease = null;
let manualCameraAfterRelease = null;
let manualReleaseNoSnap = false;
let previousQuaternion = null;"""
if old not in text:
    raise SystemExit('camera state anchor not found')
text = text.replace(old, new, 1)

old = """  if (manualDown && !manualReleasedVideo && t >= MANUAL_END) {
    await videoPage.mouse.up();
    manualReleasedVideo = true;
  }"""
new = """  if (manualDown && !manualReleasedVideo && t >= MANUAL_END) {
    manualCameraBeforeRelease = (await videoPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics())).interaction.cameraPosition;
    await videoPage.mouse.up();
    manualCameraAfterRelease = (await videoPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics())).interaction.cameraPosition;
    manualReleaseNoSnap = vectorDistance(manualCameraBeforeRelease, manualCameraAfterRelease) < 1.0;
    manualReleasedVideo = true;
  }"""
if old not in text:
    raise SystemExit('release anchor not found')
text = text.replace(old, new, 1)

old = """const finalVideoDiag = await videoPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const videoCameraPreserved = Boolean(manualCameraAtRelease) && vectorDistance(manualCameraAtRelease, finalVideoDiag.interaction.cameraPosition) < 1.0;"""
new = """const finalVideoDiag = await videoPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const videoCameraEndDrift = manualCameraAtRelease ? vectorDistance(manualCameraAtRelease, finalVideoDiag.interaction.cameraPosition) : null;
// OrbitControls damping may settle the user's own momentum after mouse-up. Preservation means:
// (1) no immediate canned snap/reset at release; (2) the settled camera stays selected; and
// (3) the separate deterministic interaction test also proves no snap-back after recovery.
const videoCameraPreserved = manualReleaseNoSnap
  && Boolean(manualCameraAtRelease)
  && videoCameraEndDrift < 1.0
  && cameraNoSnap;"""
if old not in text:
    raise SystemExit('camera preservation anchor not found')
text = text.replace(old, new, 1)

old = """    ownerVideo: { manualStartSec: MANUAL_START, manualMoveEndSec: MANUAL_MOVE_END, manualEndSec: MANUAL_END, cameraSettledSampleSec: CAMERA_SETTLED_SAMPLE, calmEndSec: CALM_END, softResumeEndSec: SOFT_RESUME_END, manualVideoTurnFinishedWhileHeld, videoCameraPreserved, pass: videoInteractionPass },"""
new = """    ownerVideo: { manualStartSec: MANUAL_START, manualMoveEndSec: MANUAL_MOVE_END, manualEndSec: MANUAL_END, cameraSettledSampleSec: CAMERA_SETTLED_SAMPLE, calmEndSec: CALM_END, softResumeEndSec: SOFT_RESUME_END, manualVideoTurnFinishedWhileHeld, manualReleaseNoSnap, videoCameraEndDrift, deterministicCameraNoSnap: cameraNoSnap, videoCameraPreserved, pass: videoInteractionPass },"""
if old not in text:
    raise SystemExit('QA ownerVideo anchor not found')
text = text.replace(old, new, 1)

p.write_text(text)
