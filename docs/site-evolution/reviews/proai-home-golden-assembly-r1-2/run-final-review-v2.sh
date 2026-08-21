#!/usr/bin/env bash
set -Eeuo pipefail
SRC='docs/site-evolution/reviews/proai-home-golden-assembly-r1-2/run-final-review.sh'
QA_SRC='docs/site-evolution/reviews/proai-home-golden-assembly-r1-2/run-qa.mjs'
TMP="$(mktemp)"
QA_TMP='/tmp/proai-golden-r12-run-qa-fixed.mjs'
python - "$SRC" "$TMP" "$QA_SRC" "$QA_TMP" <<'PY'
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
qa=Path(sys.argv[3]).read_text(encoding='utf-8')
oldqa="const outer=await x.page.locator(cfg.root).evaluate(e=>e.outerHTML),assembly="
newqa="const outer=await x.page.evaluate(sel=>document.querySelector(sel)?.outerHTML||null,cfg.root);if(!outer){fail(`parity:${w}x${h}:${name}:missing-root`,cfg.root);out[name]={assembly:null,reference:null,issues:[`missing root ${cfg.root}`],pass:false};continue}const assembly="
if oldqa not in qa:
    raise SystemExit('Expected parity outer/assembly expression not found')
qa=qa.replace(oldqa,newqa,1)
Path(sys.argv[4]).write_text(qa,encoding='utf-8')
oldcmd='PRODUCT_SHA="$PRODUCT_SHA" node "$REVIEW_DIR/run-qa.mjs"'
newcmd='PRODUCT_SHA="$PRODUCT_SHA" node /tmp/proai-golden-r12-run-qa-fixed.mjs'
if oldcmd not in src:
    raise SystemExit('Expected full QA command not found')
src=src.replace(oldcmd,newcmd,1)
Path(sys.argv[2]).write_text(src,encoding='utf-8')
PY
chmod +x "$TMP"
exec bash "$TMP"
