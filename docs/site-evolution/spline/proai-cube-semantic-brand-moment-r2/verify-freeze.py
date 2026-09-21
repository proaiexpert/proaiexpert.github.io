from pathlib import Path
import hashlib
import json
import re

root = Path(__file__).resolve().parent
base = root.parent / 'proai-cube-materials-lighting-r1' / 'main.js'
cur = root / 'main.js'
a = base.read_text()
b = cur.read_text()
blocks = {
    'MOTION': r"const MOTION = Object\.freeze\(\{.*?\n\}\);",
    'PRESENTATION_R1_2': r"const PRESENTATION_R1_2 = Object\.freeze\(\{.*?\n\}\);",
    'SLICE_R1_2': r"const SLICE_R1_2 = Object\.freeze\(\{.*?\n\}\);",
    'GEOMETRY_R1': r"const GEOMETRY_R1 = Object\.freeze\(\{.*?\n\}\);",
    'LOOKDEV_R1': r"const LOOKDEV_R1 = Object\.freeze\(\{.*?\n\}\);",
    'studio_environment': r"function createPremiumStudioEnvironment\(pmrem\) \{.*?\n\}",
    'studio_lighting': r"function configureStudioLighting\(centerWorld, radius\) \{.*?\n\}",
    'material_classifier': r"function classifyReviewMaterial\(mesh\) \{.*?\n\}",
    'geometry_builders': r"function buildPrecisionFaceGeometry\(sourceGeometry\) \{.*?\nfunction enhanceRenderGeometry\(\)",
    'turn_math': r"function beginTurn\(axis = 'X'.*?\nfunction presentationAutonomyBlocked\(\)",
}
out = {'baseSha': 'd17806da42275db617d8a46b231a2d877706a179', 'blocks': {}}
for name, pattern in blocks.items():
    ma = re.search(pattern, a, re.S)
    mb = re.search(pattern, b, re.S)
    if not ma or not mb:
        raise SystemExit(f'freeze block missing: {name}')
    same = ma.group(0) == mb.group(0)
    out['blocks'][name] = {
        'same': same,
        'baselineSha256': hashlib.sha256(ma.group(0).encode()).hexdigest(),
        'currentSha256': hashlib.sha256(mb.group(0).encode()).hexdigest(),
    }
    if not same:
        raise SystemExit(f'frozen block changed: {name}')
out['pass'] = True
(root / 'BASELINE_FREEZE.json').write_text(json.dumps(out, indent=2) + '\n')
print(json.dumps(out, indent=2))
