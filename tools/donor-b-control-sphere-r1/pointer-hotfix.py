from pathlib import Path
p = Path('src/app.ts')
s = p.read_text()
old = """    renderer.domElement.addEventListener('pointermove', updatePointer);\n    renderer.domElement.addEventListener('pointerleave', () => {\n      this.pointerTarget.set(0, 0);\n      this.engagedTarget = 0;\n    });"""
new = """    window.addEventListener('pointermove', updatePointer, { passive: true });\n    window.addEventListener('pointerout', (e) => {\n      if (e.relatedTarget) return;\n      this.pointerTarget.set(0, 0);\n      this.engagedTarget = 0;\n    });"""
if old not in s:
    raise SystemExit('pointer attachment marker not found')
p.write_text(s.replace(old, new))
print('pointer event attachment hardened')
