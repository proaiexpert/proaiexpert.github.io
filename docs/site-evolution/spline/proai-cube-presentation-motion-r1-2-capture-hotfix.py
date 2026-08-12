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
capture_path.write_text(text)

main_path = Path('docs/site-evolution/spline/proai-cube-presentation-motion-r1-2/main.js')
main = main_path.read_text()
old_delta = "const deltaMs = Math.min(80, Math.max(0, now - presentationLastNow));"
new_delta = "const deltaMs = Math.min(250, Math.max(0, now - presentationLastNow));"
if old_delta not in main:
    raise SystemExit('presentation delta anchor not found')
main = main.replace(old_delta, new_delta, 1)
main_path.write_text(main)
