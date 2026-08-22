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
anchor="""CURRENT_STAGE='mobile-390'\nnode \"$REVIEW_DIR/run-mobile-gate.mjs\""" 
preview="""CURRENT_STAGE='owner-preview-generate'\nPRODUCT_SHA=\"$PRODUCT_SHA\" python \"$REVIEW_DIR/generate-owner-preview.py\"\npython3 -m http.server 4174 --directory . >/tmp/owner-preview.log 2>&1 & PREVIEW_PID=$!\npreview_ok=0\nfor i in {1..30}; do if curl -fsS \"http://127.0.0.1:4174/$REVIEW_DIR/index.html?lang=en\" >/dev/null; then preview_ok=1; break; fi; sleep 1; done\ntest \"$preview_ok\" = 1\nCURRENT_STAGE='owner-preview-smoke'\nREVIEW_BASE=\"http://127.0.0.1:4174/$REVIEW_DIR/\" node \"$REVIEW_DIR/smoke-owner-preview.mjs\"\nkill \"$PREVIEW_PID\" 2>/dev/null || true\nPREVIEW_PID=\nCURRENT_STAGE='owner-preview-commit'\ngit config user.name 'proai-golden-preview-bot'\ngit config user.email 'actions@users.noreply.github.com'\ngit add -- \"$REVIEW_DIR/index.html\" \"$REVIEW_DIR/owner-review-en.html\" \"$REVIEW_DIR/owner-review-ru.html\" \"$REVIEW_DIR/owner-preview-smoke.json\" \"$REVIEW_DIR/media/owner-preview-smoke-en-390x844.png\" \"$REVIEW_DIR/media/owner-preview-smoke-ru-390x844.png\"\ngit commit -m 'review-preview: Golden R1.2 immutable Owner preview — QA pending'\ngit push origin HEAD:agent/proai-home-golden-assembly-r1-2-recovery\nPREVIEW_REVIEW_SHA=\"$(git rev-parse HEAD)\"\necho \"OWNER_PREVIEW_SHA=$PREVIEW_REVIEW_SHA\"\nCURRENT_STAGE='mobile-390'\nnode \"$REVIEW_DIR/run-mobile-gate.mjs\""" 
if anchor not in src:
    raise SystemExit('Expected mobile gate anchor not found for preview insertion')
src=src.replace(anchor,preview,1)
Path(sys.argv[2]).write_text(src,encoding='utf-8')
PY
chmod +x "$TMP"
exec bash "$TMP"
