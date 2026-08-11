from pathlib import Path

js_path = Path('assets/js/hero-premium-core-2-r2.js')
tool_path = Path('tools/hero_premium_core_2_owner_review.mjs')
js = js_path.read_text(encoding='utf-8')
tool = tool_path.read_text(encoding='utf-8')
changed = False

if 'let captureFreeze = false;' not in js:
    old = '''  let visible = true;\n  let renderScale = 1;'''
    new = '''  let visible = true;\n  let captureFreeze = false;\n  let renderScale = 1;'''
    if old not in js: raise SystemExit('JS capture freeze state anchor missing')
    js = js.replace(old, new, 1)

    old = '''  const visibilityObserver = new IntersectionObserver((entries) => { visible = entries.some((entry) => entry.isIntersecting); }, { threshold: 0.02 });\n  visibilityObserver.observe(visual);'''
    new = '''  const visibilityObserver = new IntersectionObserver((entries) => { visible = entries.some((entry) => entry.isIntersecting); }, { threshold: 0.02 });\n  visibilityObserver.observe(visual);\n\n  window.addEventListener('hero-core2:capture-freeze', (event) => {\n    captureFreeze = Boolean(event.detail);\n  });'''
    if old not in js: raise SystemExit('JS visibility anchor missing')
    js = js.replace(old, new, 1)

    old = '''    requestAnimationFrame(render);\n    if (!visible || document.hidden) return;\n    const delta = now - lastFrame;'''
    new = '''    requestAnimationFrame(render);\n    if (!visible || document.hidden) return;\n    if (captureFreeze && !firstFrame) return;\n    const delta = now - lastFrame;'''
    if old not in js: raise SystemExit('JS render anchor missing')
    js = js.replace(old, new, 1)
    changed = True

if "hero-core2:capture-freeze" not in tool:
    old = '''  if (minVisualRatio && (diagnostics.visual?.viewportRatio || 0) < minVisualRatio) throw new Error(`${locale} ${width}x${height}: Core visibility ratio ${(diagnostics.visual?.viewportRatio || 0)} < ${minVisualRatio}`);\n  await page.screenshot({ path: path.join(out, file), fullPage: false, timeout: screenshotTimeout });'''
    new = '''  if (minVisualRatio && (diagnostics.visual?.viewportRatio || 0) < minVisualRatio) throw new Error(`${locale} ${width}x${height}: Core visibility ratio ${(diagnostics.visual?.viewportRatio || 0)} < ${minVisualRatio}`);\n  await page.evaluate(() => window.dispatchEvent(new CustomEvent('hero-core2:capture-freeze', { detail: true })));\n  await page.waitForTimeout(80);\n  await page.screenshot({ path: path.join(out, file), fullPage: false, timeout: screenshotTimeout });'''
    if old not in tool: raise SystemExit('captureStatic freeze anchor missing')
    tool = tool.replace(old, new, 1)

    old = '''  if (!reduced.ready || reduced.active !== 3) throw new Error(`Reduced-motion state invalid: ${JSON.stringify(reduced)}`);\n  await page.screenshot({ path: path.join(out, 'CORE2_EN_REDUCED_MOTION_390x844.png'), fullPage: false, timeout: screenshotTimeout });'''
    new = '''  if (!reduced.ready || reduced.active !== 3) throw new Error(`Reduced-motion state invalid: ${JSON.stringify(reduced)}`);\n  await page.evaluate(() => window.dispatchEvent(new CustomEvent('hero-core2:capture-freeze', { detail: true })));\n  await page.waitForTimeout(80);\n  await page.screenshot({ path: path.join(out, 'CORE2_EN_REDUCED_MOTION_390x844.png'), fullPage: false, timeout: screenshotTimeout });'''
    if old not in tool: raise SystemExit('reduced freeze anchor missing')
    tool = tool.replace(old, new, 1)

    old = '''  for (let i = 0; i < names.length; i += 1) {\n    await stages.nth(i).click();\n    await page.waitForTimeout(650);'''
    new = '''  for (let i = 0; i < names.length; i += 1) {\n    await page.evaluate(() => window.dispatchEvent(new CustomEvent('hero-core2:capture-freeze', { detail: false })));\n    await stages.nth(i).click();\n    await page.waitForTimeout(650);'''
    if old not in tool: raise SystemExit('stage unfreeze anchor missing')
    tool = tool.replace(old, new, 1)

    old = '''    if (active !== i) throw new Error(`Stage review capture mismatch for ${names[i]}: active ${active}`);\n    await page.screenshot({ path: path.join(out, `CORE2_EN_STAGE_0${i + 1}_${names[i]}.png`), fullPage: false, timeout: screenshotTimeout });'''
    new = '''    if (active !== i) throw new Error(`Stage review capture mismatch for ${names[i]}: active ${active}`);\n    await page.evaluate(() => window.dispatchEvent(new CustomEvent('hero-core2:capture-freeze', { detail: true })));\n    await page.waitForTimeout(80);\n    await page.screenshot({ path: path.join(out, `CORE2_EN_STAGE_0${i + 1}_${names[i]}.png`), fullPage: false, timeout: screenshotTimeout });'''
    if old not in tool: raise SystemExit('stage freeze anchor missing')
    tool = tool.replace(old, new, 1)
    changed = True

if changed:
    js_path.write_text(js, encoding='utf-8')
    tool_path.write_text(tool, encoding='utf-8')
    print('Capture freeze hook applied')
else:
    print('Capture freeze hook already applied')
