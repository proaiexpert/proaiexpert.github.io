#!/usr/bin/env bash
set -Eeuo pipefail
CORE='docs/site-evolution/reviews/proai-home-golden-assembly-r1-2/run-final-review-v2-core.sh'
TMP="$(mktemp)"
python - "$CORE" "$TMP" <<'PY'
from pathlib import Path
import sys
src=Path(sys.argv[1]).read_text(encoding='utf-8')
old="assert t.count('home-fs-showcase-r14')==1"
new="assert t.count('home-fs-showcase-r14\\\" data-fs-showcase-r11')==1"
if old not in src:
    raise SystemExit('Expected broad Financial R1.4 Jekyll identity assertion not found')
src=src.replace(old,new,1)
Path(sys.argv[2]).write_text(src,encoding='utf-8')
PY
chmod +x "$TMP"
exec bash "$TMP"
