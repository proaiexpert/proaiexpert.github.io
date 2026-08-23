#!/usr/bin/env bash
set -Eeuo pipefail
RUNNER='docs/site-evolution/reviews/proai-home-golden-assembly-r1-2/run-final-review-v2.sh'
WRAPPER='docs/site-evolution/reviews/proai-home-golden-assembly-r1-2/final-authority-reconciliation-qa.mjs'
# Golden assembly intentionally strips the canonical donor's embedded .tw-tech-r2 block.
sed -i 's/ee48db8f844f61e3abb10f603bf8dabb3987dbc3/166eb49ffb4517f05d3ae2cfce4188eb9e6132ab/' "$RUNNER"
# R1.4 root class is also a prefix of ledger classes; use the unique section data marker for the static build gate.
sed -i "s/assert t.count('home-fs-showcase-r14')==1/assert t.count('data-fs-showcase-r11')==1 and 'home-fs-showcase-r14' in t/" "$RUNNER"
# The compact QA wrapper originally imported the decompressed suite from a data: URL.
# Bare imports (playwright/pngjs) cannot resolve from data: URLs. Materialize the suite temporarily at repo root instead.
python - <<'PY'
from pathlib import Path
p=Path('docs/site-evolution/reviews/proai-home-golden-assembly-r1-2/final-authority-reconciliation-qa.mjs')
t=p.read_text(encoding='utf-8')
t=t.replace("import{gunzipSync}from'node:zlib';", "import{gunzipSync}from'node:zlib';import{writeFileSync,unlinkSync}from'node:fs';import{pathToFileURL}from'node:url';")
t=t.replace("await import('data:text/javascript;base64,'+Buffer.from(s).toString('base64'));", "const p='.golden-final-authority-qa-runtime.mjs';writeFileSync(p,s);try{await import(pathToFileURL(process.cwd()+'/'+p).href)}finally{try{unlinkSync(p)}catch{}}")
if "data:text/javascript" in t or "writeFileSync(p,s)" not in t:
    raise SystemExit('wrapper rewrite failed')
p.write_text(t,encoding='utf-8')
PY
exec bash "$RUNNER"
