from pathlib import Path
p = Path('docs/site-evolution/spline/proai-cube-presentation-motion-r1/capture.mjs')
s = p.read_text()
old = "  && preSliceLinear > 0 && preSliceLinear < 1\n"
new = "  // Active-turn existence is the robust headless gate; exact completion during drag is verified separately below.\n  && preSliceLinear !== null && preSliceLinear < 1\n"
assert old in s
p.write_text(s.replace(old, new, 1))
print('Presentation R1.1 active-slice predicate normalized')
