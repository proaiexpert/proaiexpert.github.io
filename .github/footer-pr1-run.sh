#!/usr/bin/env bash
set -euo pipefail

python - <<'PY'
from pathlib import Path
from urllib.request import urlopen

url = (
    "https://raw.githubusercontent.com/proaiexpert/proaiexpert.github.io/"
    "1b6c0fdbc74acd2ebc2cdfba294d8fce0287d75d/.github/footer-pr1-run.sh"
)
source = urlopen(url, timeout=30).read().decode("utf-8")

old_gems = """gem install jekyll -v 4.3.4 --no-document
gem install webrick --no-document
jekyll build --destination _site"""
new_gems = """export GEM_HOME=\"$(ruby -e 'puts Gem.user_dir')\"
export PATH=\"$GEM_HOME/bin:$PATH\"
gem install --user-install jekyll -v 4.3.4 --no-document
gem install --user-install webrick --no-document
jekyll build --destination _site"""
if old_gems not in source:
    raise RuntimeError("Jekyll install block was not found")
source = source.replace(old_gems, new_gems, 1)

path = Path("/tmp/footer-pr1-run-original.sh")
path.write_text(source, encoding="utf-8")
path.chmod(0o755)
PY

exec bash /tmp/footer-pr1-run-original.sh
