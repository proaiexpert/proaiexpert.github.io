from pathlib import Path
p = Path('src/app.ts')
s = p.read_text()
old = """    renderer.domElement.addEventListener('pointermove', updatePointer);\n    renderer.domElement.addEventListener('pointerleave', () => {\n      this.pointerTarget.set(0, 0);\n      this.engagedTarget = 0;\n    });"""
new = """    window.addEventListener('pointermove', updatePointer, { passive: true });\n    window.addEventListener('pointerout', (e) => {\n      if (e.relatedTarget) return;\n      this.pointerTarget.set(0, 0);\n      this.engagedTarget = 0;\n    });"""
if old not in s:
    raise SystemExit('pointer attachment marker not found')
s = s.replace(old, new)
old_tick = """    const dt = Math.min((time - this.lastTime) / 1000, 0.05);\n    this.lastTime = time;\n\n    const damping = 1 - Math.exp(-dt * 3.2);\n    this.pointerCurrent.lerp(this.pointerTarget, damping);\n    const desiredEngaged = this.forcedEngaged ? 1 : this.engagedTarget;\n    this.engaged = THREE.MathUtils.lerp(this.engaged, desiredEngaged, 1 - Math.exp(-dt * 2.7));"""
new_tick = """    const elapsed = Math.min((time - this.lastTime) / 1000, 0.5);\n    const dt = Math.min(elapsed, 0.05);\n    this.lastTime = time;\n\n    const damping = 1 - Math.exp(-elapsed * 3.2);\n    this.pointerCurrent.lerp(this.pointerTarget, damping);\n    const desiredEngaged = this.forcedEngaged ? 1 : this.engagedTarget;\n    this.engaged = THREE.MathUtils.lerp(this.engaged, desiredEngaged, 1 - Math.exp(-elapsed * 2.7));"""
if old_tick not in s:
    raise SystemExit('damping marker not found')
s = s.replace(old_tick, new_tick)
p.write_text(s)
print('pointer event attachment + frame-rate-independent damping hardened')
