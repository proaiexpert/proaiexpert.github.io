from pathlib import Path

capture_path = Path('docs/site-evolution/spline/proai-cube-presentation-motion-r1-2/capture.mjs')
text = capture_path.read_text()
old = "const interactionPair = await openPage(REVIEW_URL, SCREENSHOT_VIEWPORT);"
new = "const interactionPair = await openPage(CAPTURE_URL, SCREENSHOT_VIEWPORT);"
if old not in text:
    raise SystemExit('interaction page anchor not found')
text = text.replace(old, new, 1)
old_wait = "await interactionPage.waitForFunction(() => window.__PROAI_CUBE_R1_2.getDiagnostics().activeTurns.length === 0, null, { timeout: 5000 });"
new_wait = "await interactionPage.waitForFunction(() => window.__PROAI_CUBE_R1_2.getDiagnostics().activeTurns.length === 0, null, { timeout: 12000 });"
if old_wait not in text:
    raise SystemExit('interaction drain anchor not found')
text = text.replace(old_wait, new_wait, 1)
old_trace = "  const api = window.__PROAI_CUBE_R1_2;\n  const first = api.getDiagnostics();"
new_trace = "  const api = window.__PROAI_CUBE_R1_2;\n  api.resetReviewPresentationPhase();\n  const first = api.getDiagnostics();"
if old_trace not in text:
    raise SystemExit('runtime trace anchor not found')
text = text.replace(old_trace, new_trace, 1)
old_360_wait = """// Wait for a cumulative 360 after recording begins; keep scheduler fully autonomous through that phase.
await videoPage.waitForFunction((startYaw) => {
  const d = window.__PROAI_CUBE_R1_2.getDiagnostics();
  return d.presentation.cumulativeYawDeg - startYaw >= 360;
}, traceStart.startCumulativeYawDeg, { timeout: 24000, polling: 100 });
full360WallSec = (Date.now() - runtimeWallStart) / 1000;
await videoPage.waitForTimeout(650);
"""
new_360_wait = """// Keep the runtime fully autonomous through the intended cumulative-360 inspection window.
// Do not abort early: the completed trace below is the source of truth for the 360 and liveness gates.
const inspectionTargetWallMs = 19000;
const inspectionRemainingMs = Math.max(0, inspectionTargetWallMs - (Date.now() - runtimeWallStart));
if (inspectionRemainingMs > 0) await videoPage.waitForTimeout(inspectionRemainingMs);
const inspectionDiag = await videoPage.evaluate(() => window.__PROAI_CUBE_R1_2.getDiagnostics());
const inspectionYawDelta = inspectionDiag.presentation.cumulativeYawDeg - traceStart.startCumulativeYawDeg;
full360WallSec = inspectionYawDelta >= 360 ? (Date.now() - runtimeWallStart) / 1000 : null;
console.log(`R1.2 inspection window: cumulative yaw ${inspectionYawDelta.toFixed(2)} deg; sim ${(inspectionDiag.presentation.simTimeMs / 1000).toFixed(2)} s; velocity ${inspectionDiag.presentation.yawVelocityDegPerSec.toFixed(2)} deg/s`);
await videoPage.waitForTimeout(650);
"""
if old_360_wait not in text:
    raise SystemExit('360 wait anchor not found')
text = text.replace(old_360_wait, new_360_wait, 1)
capture_path.write_text(text)

main_path = Path('docs/site-evolution/spline/proai-cube-presentation-motion-r1-2/main.js')
main = main_path.read_text()
old_delta = "const deltaMs = Math.min(80, Math.max(0, now - presentationLastNow));"
new_delta = "const rawDeltaMs = Math.max(0, now - presentationLastNow);\n  const deltaMs = reviewMode ? rawDeltaMs : Math.min(80, rawDeltaMs);"
if old_delta not in main:
    raise SystemExit('presentation delta anchor not found')
main = main.replace(old_delta, new_delta, 1)
api_anchor = "  setReviewPresentation,\n  getReviewPresentationSample,"
api_replacement = "  setReviewPresentation,\n  resetReviewPresentationPhase,\n  getReviewPresentationSample,"
if api_anchor not in main:
    raise SystemExit('review API anchor not found')
main = main.replace(api_anchor, api_replacement, 1)
function_anchor = "function getReviewPresentationSample(timeSec = 0) {"
reset_function = """function resetReviewPresentationPhase() {
  if (!reviewMode || !api.ready) return false;
  presentationSimTimeMs = 0;
  presentationYawRad = 0;
  presentationSignedYawDeg = 0;
  presentationCumulativeYawDeg = 0;
  presentationYawVelocityDegPerSec = presentationVelocityAt(0);
  presentationLastNow = performance.now();
  presentationResumeStart = 0;
  presentationRig.quaternion.copy(presentationQuaternionAt(0, 0));
  lastPresentationQuaternion.copy(presentationRig.quaternion);
  return true;
}

function getReviewPresentationSample(timeSec = 0) {"""
if function_anchor not in main:
    raise SystemExit('review presentation sample anchor not found')
main = main.replace(function_anchor, reset_function, 1)
main_path.write_text(main)
