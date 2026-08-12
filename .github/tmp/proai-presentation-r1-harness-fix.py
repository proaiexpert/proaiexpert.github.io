from pathlib import Path
p = Path('docs/site-evolution/spline/proai-cube-presentation-motion-r1/capture.mjs')
s = p.read_text()
old1 = "const interactionBox = await qaPage.locator('#cube-canvas').boundingBox();\nif (!interactionBox) throw new Error('Cube canvas unavailable for interaction QA');"
new1 = "const interactionBox = await qaPage.evaluate(() => {\n  const rect = document.getElementById('cube-canvas')?.getBoundingClientRect();\n  return rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null;\n});\nif (!interactionBox) throw new Error('Cube canvas unavailable for interaction QA');"
old2 = "const box = await videoPage.locator('#cube-canvas').boundingBox();\n  if (!box) throw new Error('Video canvas unavailable for manual segment');"
new2 = "const box = await videoPage.evaluate(() => {\n    const rect = document.getElementById('cube-canvas')?.getBoundingClientRect();\n    return rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null;\n  });\n  if (!box) throw new Error('Video canvas unavailable for manual segment');"
assert old1 in s, 'interaction locator block not found'
assert old2 in s, 'video locator block not found'
s = s.replace(old1, new1, 1).replace(old2, new2, 1)
p.write_text(s)
print('capture harness DOM rect fix applied')
