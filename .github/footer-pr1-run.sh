#!/usr/bin/env bash
set -euo pipefail

python - <<'PY'
from pathlib import Path
from urllib.request import urlopen

url = (
    'https://raw.githubusercontent.com/proaiexpert/proaiexpert.github.io/'
    'a16685e04474a7200de00458993556029c2d7cd0/.github/footer-pr1-run.sh'
)
source = urlopen(url, timeout=30).read().decode('utf-8')
anchor = 'git fetch origin main "${TARGET_BRANCH}"'
replacement = 'git reset --hard HEAD\n' + anchor
if anchor not in source:
    raise RuntimeError('Harness checkout anchor not found')
source = source.replace(anchor, replacement, 1)
path = Path('/tmp/footer-pr1-run-pr90.sh')
path.write_text(source, encoding='utf-8')
path.chmod(0o755)
PY

exec bash /tmp/footer-pr1-run-pr90.sh
