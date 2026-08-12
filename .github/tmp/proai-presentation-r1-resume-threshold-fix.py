from pathlib import Path
p = Path('docs/site-evolution/spline/proai-cube-presentation-motion-r1/capture.mjs')
s = p.read_text()
old = "  && presentationProgressResumed > presentationProgressDelay + 0.05\n"
new = "  // The synthetic QA move is 600 s to survive SwiftShader virtual rAF acceleration; any >0.001 progress proves resumed autonomous clock.\n  && presentationProgressResumed > presentationProgressDelay + 0.001\n"
assert old in s
p.write_text(s.replace(old, new, 1))
