#!/usr/bin/env bash
set -Eeuo pipefail
CORE='docs/site-evolution/reviews/proai-home-golden-assembly-r1-2/run-final-review-v2-core.sh'
TMP="$(mktemp)"
python - "$CORE" "$TMP" <<'PY'
from pathlib import Path
import sys
core=Path(sys.argv[1]).read_text(encoding='utf-8')
old="assert t.count('home-fs-showcase-r14')==1"
new="assert t.count('home-fs-showcase-r14\\\" data-fs-showcase-r11')==1"
if old not in core:
    raise SystemExit('Expected broad Financial R1.4 Jekyll identity assertion not found')
core=core.replace(old,new,1)
needle='''oldcmd='PRODUCT_SHA="$PRODUCT_SHA" node "$REVIEW_DIR/run-qa.mjs"'
newcmd='PRODUCT_SHA="$PRODUCT_SHA" node /tmp/proai-golden-r12-run-qa-fixed.mjs' '''.rstrip()
injection=r'''preview_anchor="CURRENT_STAGE='mobile-390'\nnode \"$REVIEW_DIR/run-mobile-gate.mjs\""
preview_block="""CURRENT_STAGE='owner-preview-generate'
PRODUCT_SHA="$PRODUCT_SHA" python "$REVIEW_DIR/generate-owner-preview.py"
python3 -m http.server 4174 --directory . >/tmp/owner-preview.log 2>&1 & PREVIEW_PID=$!
preview_ok=0
for i in {1..30}; do if curl -fsS "http://127.0.0.1:4174/$REVIEW_DIR/index.html?lang=en" >/dev/null; then preview_ok=1; break; fi; sleep 1; done
test "$preview_ok" = 1
CURRENT_STAGE='owner-preview-smoke'
WRITE_SCREENSHOTS=0 REVIEW_BASE="http://127.0.0.1:4174/$REVIEW_DIR/" node "$REVIEW_DIR/smoke-owner-preview.mjs"
kill "$PREVIEW_PID" 2>/dev/null || true
PREVIEW_PID=
CURRENT_STAGE='owner-preview-commit'
git config user.name 'proai-golden-preview-bot'
git config user.email 'actions@users.noreply.github.com'
git add -- "$REVIEW_DIR/index.html" "$REVIEW_DIR/owner-review-en.html" "$REVIEW_DIR/owner-review-ru.html" "$REVIEW_DIR/owner-preview-smoke.json"
git commit -m 'review-preview: Golden R1.2 immutable Owner preview — QA pending'
git push origin HEAD:agent/proai-home-golden-assembly-r1-2-recovery
PREVIEW_REVIEW_SHA="$(git rev-parse HEAD)"
echo "OWNER_PREVIEW_SHA=$PREVIEW_REVIEW_SHA"
CURRENT_STAGE='mobile-390'
node "$REVIEW_DIR/run-mobile-gate.mjs"""
if preview_anchor not in src: raise SystemExit('Expected generated mobile gate anchor not found')
src=src.replace(preview_anchor,preview_block,1)

'''
if needle not in core:
    raise SystemExit('Expected QA command generator block not found')
core=core.replace(needle,injection+needle,1)
Path(sys.argv[2]).write_text(core,encoding='utf-8')
PY
chmod +x "$TMP"
exec bash "$TMP"
