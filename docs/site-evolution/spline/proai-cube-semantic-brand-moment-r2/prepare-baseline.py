from pathlib import Path
import shutil

root = Path(__file__).resolve().parent
base = root.parent / 'proai-cube-materials-lighting-r1'
out = root / 'baseline-fixture'
if out.exists():
    shutil.rmtree(out)
shutil.copytree(base, out)
for name in ('review', 'review-internal', 'dist', 'node_modules'):
    p = out / name
    if p.exists():
        shutil.rmtree(p)

p = out / 'main.js'
s = p.read_text()
s = s.replace('  getDiagnostics,\n  getInteractionState,\n', '  getDiagnostics,\n  getBaselineComparableState,\n  getInteractionState,\n', 1)
anchor = 'function getDiagnostics() {\n'
fn = '''function getBaselineComparableState() {\n  scene.updateMatrixWorld(true);\n  return {\n    presentationRig: { position: presentationRig.position.toArray(), quaternion: presentationRig.quaternion.toArray(), scale: presentationRig.scale.toArray() },\n    cubeRoot: { position: cubeRoot.position.toArray(), quaternion: cubeRoot.quaternion.toArray(), scale: cubeRoot.scale.toArray() },\n    logical: snapshotLogicalState(),\n    activeTurns: activeTurnList().map((turn) => ({ axis: turn.axis, layer: turn.layer, direction: turn.direction, linear: turn.linear, eased: turn.eased })),\n    completedTurns: lastTurnResults.map((turn) => ({ axis: turn.axis, layer: turn.layer, direction: turn.direction })),\n    scheduler: { enabled: sliceSchedulerEnabled, running: sliceSchedulerRunning, eventSerial: sliceEventSerial, eventsUntilBreath, seed: sliceSeed },\n    camera: { position: camera.position.toArray(), quaternion: camera.quaternion.toArray(), target: controls.target.toArray() },\n  };\n}\n\n'''
if anchor not in s:
    raise SystemExit('baseline diagnostics anchor missing')
p.write_text(s.replace(anchor, fn + anchor, 1))
print(out)
