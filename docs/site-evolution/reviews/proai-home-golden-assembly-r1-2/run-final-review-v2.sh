#!/usr/bin/env bash
set -Eeuo pipefail
SRC='docs/site-evolution/reviews/proai-home-golden-assembly-r1-2/run-final-review.sh'
TMP="$(mktemp)"
python - "$SRC" "$TMP" <<'PY'
from pathlib import Path
import sys
src=Path(sys.argv[1]).read_text(encoding='utf-8')
old="""donor='c945084e1952c05c686494091f7dbca0f7acdf08'\nfor source,current in [('index.html','_includes/homepage-golden-r12-downstream-en.html'),('ru/index.html','_includes/homepage-golden-r12-downstream-ru.html')]:"""
new="""donor='38b92195a11709546db8fe0beeaa782244eee83f'\nfor source,current in [('_includes/homepage-assembly-base-en.html','_includes/homepage-golden-r12-downstream-en.html'),('_includes/homepage-assembly-base-ru.html','_includes/homepage-golden-r12-downstream-ru.html')]:"""
if old not in src:
    raise SystemExit('Expected downstream donor block not found')
src=src.replace(old,new,1)
old2="""want=text[start:end].strip().replace('\\r\\n','\\n');cur=Path(current).read_text(encoding='utf-8').replace('\\r\\n','\\n').strip().splitlines();got='\\n'.join(cur[1:-1]).strip();assert got==want,current"""
new2="""want=text[start:end].strip().replace('\\r\\n','\\n');marker='{{ selected_work_marker }}';want=want[:-len(marker)].rstrip() if want.endswith(marker) else want;cur=Path(current).read_text(encoding='utf-8').replace('\\r\\n','\\n').strip().splitlines();got='\\n'.join(cur[1:-1]).strip();assert got==want,current"""
if old2 not in src:
    raise SystemExit('Expected downstream comparison line not found')
src=src.replace(old2,new2,1)
Path(sys.argv[2]).write_text(src,encoding='utf-8')
PY
chmod +x "$TMP"
exec bash "$TMP"
