from pathlib import Path

main_path = Path('docs/site-evolution/spline/proai-cube-presentation-motion-r1-2/main.js')
main = main_path.read_text()

replacements = [
    ("function setReviewTurnProgress(turnId, linear) {", "function setReviewTurnProgress(turnId, linear, renderFrame = true) {"),
    ("  renderReviewFrame();\n  return result;\n}\n\nfunction beginReviewPair", "  if (renderFrame) renderReviewFrame();\n  return result;\n}\n\nfunction beginReviewPair"),
    ("function setReviewPresentation(timeSec = 0, resumeProgress = 1) {", "function setReviewPresentation(timeSec = 0, resumeProgress = 1, renderFrame = true) {"),
    ("  renderReviewFrame();\n  return { ...sample, quaternion: presentationRig.quaternion.toArray() };", "  if (renderFrame) renderReviewFrame();\n  return { ...sample, quaternion: presentationRig.quaternion.toArray() };"),
]
for old, new in replacements:
    if old not in main:
        raise SystemExit('main.js optimization anchor not found: ' + old[:100])
    main = main.replace(old, new, 1)
main_path.write_text(main)

capture_path = Path('docs/site-evolution/spline/proai-cube-presentation-motion-r1-2/capture.mjs')
capture = capture_path.read_text()
old_presentation = "await videoPage.evaluate(({ t, resumeProgress }) => window.__PROAI_CUBE_R1_2.setReviewPresentation(t, resumeProgress), { t, resumeProgress });"
new_presentation = "await videoPage.evaluate(({ t, resumeProgress }) => window.__PROAI_CUBE_R1_2.setReviewPresentation(t, resumeProgress, false), { t, resumeProgress });"
if old_presentation not in capture:
    raise SystemExit('capture presentation optimization anchor not found')
capture = capture.replace(old_presentation, new_presentation, 1)
old_turn = "await videoPage.evaluate(({ turnId, progress }) => window.__PROAI_CUBE_R1_2.setReviewTurnProgress(turnId, progress), { turnId: state.turnId, progress });"
new_turn = "await videoPage.evaluate(({ turnId, progress }) => window.__PROAI_CUBE_R1_2.setReviewTurnProgress(turnId, progress, false), { turnId: state.turnId, progress });"
if old_turn not in capture:
    raise SystemExit('capture turn optimization anchor not found')
capture = capture.replace(old_turn, new_turn, 1)
capture_path.write_text(capture)
