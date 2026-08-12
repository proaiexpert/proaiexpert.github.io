from pathlib import Path
import hashlib, json, re

ROOT = Path(__file__).resolve().parent
BASE = ROOT / 'proai-cube-materials-lighting-r1' / 'main.js'
CUR = ROOT / 'proai-cube-semantic-display-r1' / 'main.js'
OUT = ROOT / 'proai-cube-semantic-display-r1' / 'BASELINE_FREEZE.json'
base = BASE.read_text()
cur = CUR.read_text()

patterns = {
    'MOTION': r"const MOTION = Object\.freeze\(\{.*?\n\}\);",
    'PRESENTATION_R1_2': r"const PRESENTATION_R1_2 = Object\.freeze\(\{.*?\n\}\);",
    'SLICE_R1_2': r"const SLICE_R1_2 = Object\.freeze\(\{.*?\n\}\);",
    'GEOMETRY_R1': r"const GEOMETRY_R1 = Object\.freeze\(\{.*?\n\}\);",
    'LOOKDEV_R1': r"const LOOKDEV_R1 = Object\.freeze\(\{.*?\n\}\);",
    'studio_environment': r"function createStudioCard\(.*?\nconst pmrem = new THREE\.PMREMGenerator\(renderer\);\nscene\.environment = createPremiumStudioEnvironment\(pmrem\);\npmrem\.dispose\(\);",
    'studio_lighting': r"const hemisphereFill = .*?\nfunction configureStudioLighting\(.*?\n\}",
    'material_classifier': r"function classifyReviewMaterial\(.*?\n\}",
    'turn_math': r"function cubicBezierEase\(.*?\nfunction hierarchyCheck\(",
    'turn_engine': r"function beginTurn\(.*?\nfunction presentationAutonomyBlocked\(",
    'presentation_engine': r"function presentationVelocityAt\(.*?\nfunction seededUnit\(",
    'scheduler_core': r"function seededUnit\(.*?\nfunction getInteractionState\(",
}
result = {}
for name, pattern in patterns.items():
    a = re.search(pattern, base, re.S)
    b = re.search(pattern, cur, re.S)
    if not a or not b:
        raise SystemExit(f'Freeze block missing: {name}')
    same = a.group(0) == b.group(0)
    result[name] = {
        'same': same,
        'baselineSha256': hashlib.sha256(a.group(0).encode()).hexdigest(),
        'semanticSha256': hashlib.sha256(b.group(0).encode()).hexdigest(),
    }
    if not same:
        raise SystemExit(f'Frozen baseline block changed: {name}')

old_gate = "function sliceAutonomyBlocked() {\n  return interactionActive || performance.now() < sliceResumeAt;\n}"
new_gate = "function sliceAutonomyBlocked() {\n  return semanticBaseSliceBlocked() || semanticBlocksNewSlices();\n}"
if old_gate not in base or new_gate not in cur:
    raise SystemExit('Expected semantic slice gating delta not found')

interaction_preserved = all(snippet in cur for snippet in [
    "frozenPresentationQuaternion.copy(presentationRig.quaternion);",
    "manualResumeAt = Infinity;",
    "sliceResumeAt = Infinity;",
    "manualResumeAt = now + MOTION.manualResumeDelayMs;",
    "sliceResumeAt = manualResumeAt + MOTION.sliceResumeStaggerMs;",
    "presentationResumeStart = manualResumeAt;",
    "presentationResumeFrom.copy(presentationRig.quaternion);",
])
if not interaction_preserved:
    raise SystemExit('Existing interaction semantics were not preserved')

result['intentionalSchedulerDelta'] = {
    'location': 'sliceAutonomyBlocked()',
    'baseline': 'interactionActive || performance.now() < sliceResumeAt',
    'semanticR1': 'semanticBaseSliceBlocked() || semanticBlocksNewSlices()',
    'reason': 'block initiation of NEW Rubik slice events while a semantic face is active/recovering; active turns and scheduler event distribution/timings remain unchanged',
    'schedulerCoreHashUnchanged': result['scheduler_core']['same'],
}
result['interactionAdditions'] = {
    'onOrbitStart': "requestSemanticExit('interaction', performance.now(), true); semanticResumeAt = Infinity",
    'onOrbitEnd': 'semanticResumeAt = now + manualResumeDelayMs + manualResumeBlendMs + 420ms',
    'existingInteractionSemanticsPreserved': interaction_preserved,
}
result['materialsLightingFrozen'] = all(result[k]['same'] for k in ['LOOKDEV_R1','studio_environment','studio_lighting','material_classifier'])
result['geometryFrozen'] = result['GEOMETRY_R1']['same']
result['motionCoreFrozen'] = all(result[k]['same'] for k in ['MOTION','PRESENTATION_R1_2','SLICE_R1_2','turn_math','presentation_engine','scheduler_core'])
result['pass'] = all([result['materialsLightingFrozen'], result['geometryFrozen'], result['motionCoreFrozen'], interaction_preserved])
OUT.write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result, indent=2))
