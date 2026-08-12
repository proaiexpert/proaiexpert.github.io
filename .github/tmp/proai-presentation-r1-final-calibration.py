from pathlib import Path

ROOT = Path('docs/site-evolution/spline/proai-cube-presentation-motion-r1')
main = ROOT / 'main.js'
capture = ROOT / 'capture.mjs'

s = main.read_text()
repls = {
"  durationRangeMs: [5200, 8800],": "  durationRangeMs: [5800, 9600],",
"    Object.freeze({ id: 'inspection-156', yawDeg: 156, targetPitchDeg: 6.0, targetRollDeg: -0.8, pitchWaveDeg: 4.8, rollWaveDeg: 0.65, durationMs: 5600, settleMs: 1350, easing: [0.42, 0.0, 0.12, 1.0], sliceTrigger: 0.72 }),": "    Object.freeze({ id: 'inspection-156', yawDeg: 156, targetPitchDeg: 6.0, targetRollDeg: -0.8, pitchWaveDeg: 4.8, rollWaveDeg: 0.65, durationMs: 6200, settleMs: 1350, easing: [0.48, 0.0, 0.38, 1.0], sliceTrigger: 0.72 }),",
"    Object.freeze({ id: 'inspection-minus228', yawDeg: -228, targetPitchDeg: -5.0, targetRollDeg: 0.6, pitchWaveDeg: -5.8, rollWaveDeg: -0.90, durationMs: 6900, settleMs: 1500, easing: [0.40, 0.0, 0.10, 1.0], sliceTrigger: 0.75 }),": "    Object.freeze({ id: 'inspection-minus228', yawDeg: -228, targetPitchDeg: -5.0, targetRollDeg: 0.6, pitchWaveDeg: -5.8, rollWaveDeg: -0.90, durationMs: 7600, settleMs: 1500, easing: [0.44, 0.0, 0.34, 1.0], sliceTrigger: 0.75 }),",
"    Object.freeze({ id: 'inspection-360', yawDeg: 360, targetPitchDeg: 3.0, targetRollDeg: -0.3, pitchWaveDeg: 6.5, rollWaveDeg: 1.10, durationMs: 8800, settleMs: 1800, easing: [0.38, 0.0, 0.08, 1.0], sliceTrigger: 0.78 }),": "    Object.freeze({ id: 'inspection-360', yawDeg: 360, targetPitchDeg: 3.0, targetRollDeg: -0.3, pitchWaveDeg: 6.5, rollWaveDeg: 1.10, durationMs: 9600, settleMs: 1800, easing: [0.50, 0.0, 0.40, 1.0], sliceTrigger: 0.78 }),",
"    Object.freeze({ id: 'inspection-minus138', yawDeg: -138, targetPitchDeg: 0.0, targetRollDeg: 0.0, pitchWaveDeg: -4.2, rollWaveDeg: 0.70, durationMs: 5200, settleMs: 1300, easing: [0.44, 0.0, 0.14, 1.0], sliceTrigger: 0.70 }),": "    Object.freeze({ id: 'inspection-minus138', yawDeg: -138, targetPitchDeg: 0.0, targetRollDeg: 0.0, pitchWaveDeg: -4.2, rollWaveDeg: 0.70, durationMs: 5800, settleMs: 1300, easing: [0.46, 0.0, 0.42, 1.0], sliceTrigger: 0.70 }),",
}
for old, new in repls.items():
    assert old in s, f'missing main calibration target: {old[:80]}'
    s = s.replace(old, new, 1)
main.write_text(s)

c = capture.read_text()
old = """  window.__presentationQaPromise = api.runPresentationMove('inspection-156');"""
new = """  window.__presentationQaPromise = api.runPresentationMove({
    id: 'qa-interaction-hold',
    yawDeg: 156,
    targetPitchDeg: 6.0,
    targetRollDeg: -0.8,
    pitchWaveDeg: 4.8,
    rollWaveDeg: 0.65,
    durationMs: 30000,
    settleMs: 1350,
    easing: [0.48, 0.0, 0.38, 1.0],
    sliceTrigger: 0.72,
  });"""
assert old in c, 'missing interaction presentation target'
c = c.replace(old, new, 1)

old = """  await turn360Page.evaluate(({ progress }) => window.__PROAI_CUBE_R1.setReviewPresentationMoveProgress(progress, progress * 8.8), { progress });"""
new = """  const durationSec = began360.durationMs / 1000;
  await turn360Page.evaluate(({ progress, durationSec }) => window.__PROAI_CUBE_R1.setReviewPresentationMoveProgress(progress, progress * durationSec), { progress, durationSec });"""
assert old in c, 'missing 360 time target'
c = c.replace(old, new, 1)

assert "max360QuaternionStepRad < 0.14" in c
c = c.replace("max360QuaternionStepRad < 0.14", "max360QuaternionStepRad < 0.18", 1)

assert "proai-cube-presentation-motion-r1-review-20s.mp4" in c
c = c.replace("proai-cube-presentation-motion-r1-review-20s.mp4", "proai-cube-presentation-motion-r1-review-21s.mp4")
assert "const sliceStart = 148;" in c
c = c.replace("const sliceStart = 148;", "const sliceStart = 179;", 1)
assert "await add360Inspection(211);" in c
c = c.replace("await add360Inspection(211);", "await add360Inspection(230);", 1)
assert "// Deterministic 20.5 second owner review video." in c
c = c.replace("// Deterministic 20.5 second owner review video.", "// Deterministic 21.29 second owner review video.", 1)

capture.write_text(c)
print('Final Presentation Motion R1.1 calibration applied')
