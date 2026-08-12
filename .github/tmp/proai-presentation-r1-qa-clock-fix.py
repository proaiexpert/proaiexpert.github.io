from pathlib import Path
p = Path('docs/site-evolution/spline/proai-cube-presentation-motion-r1/capture.mjs')
s = p.read_text()
old = "    durationMs: 30000,\n"
new = "    // Deliberately huge only for headless interaction QA: SwiftShader rAF virtual time can advance ~30x wall time.\n    durationMs: 600000,\n"
assert s.count(old) == 1, f'expected one QA duration target, got {s.count(old)}'
s = s.replace(old, new, 1)
p.write_text(s)
print('Presentation R1.1 interaction QA clock guard applied')
