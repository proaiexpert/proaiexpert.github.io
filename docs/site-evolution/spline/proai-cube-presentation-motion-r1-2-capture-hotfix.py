from pathlib import Path

p = Path('docs/site-evolution/spline/proai-cube-presentation-motion-r1-2/capture.mjs')
text = p.read_text()
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
p.write_text(text)
