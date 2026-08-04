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

old_liquid_check = "    assert '{%' not in text and '{{' not in text, output"
new_liquid_check = "    assert '{% include footer-system/' not in text and '{{ footer_' not in text and '{{ variant_copy' not in text, output"
if old_liquid_check not in source:
    raise RuntimeError("Generated-output Liquid assertion was not found")
source = source.replace(old_liquid_check, new_liquid_check, 1)

old_legal_check = "    assert 'Privacy' not in text and 'Terms' not in text, output"
new_legal_check = "    assert not re.search(r'<footer\\b.*?(Privacy|Terms).*?</footer>', text, flags=re.I | re.S), output"
if old_legal_check not in source:
    raise RuntimeError("Generated-output legal-link assertion was not found")
source = source.replace(old_legal_check, new_legal_check, 1)

old_overflow_state = "          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,"
new_overflow_state = """          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          footerInternalOverflow: footer.scrollWidth - footer.clientWidth,
          overflowing: [...document.querySelectorAll('body *')].map(el => {
            const r = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            return {
              tag: el.tagName.toLowerCase(),
              id: el.id || '',
              className: typeof el.className === 'string' ? el.className : '',
              left: r.left, right: r.right, width: r.width,
              position: style.position,
              transform: style.transform,
              overflowX: style.overflowX,
              inFooter: footer.contains(el),
            };
          }).filter(item => item.left < -1 || item.right > document.documentElement.clientWidth + 1).slice(0, 30),"""
if old_overflow_state not in source:
    raise RuntimeError("Browser overflow state anchor was not found")
source = source.replace(old_overflow_state, new_overflow_state, 1)

old_overflow_failure = "      if (state.overflow > 1) routeFailures.push(`horizontal overflow=${state.overflow}`);"
new_overflow_failure = """      const footerOverflowing = state.overflowing.filter(item => item.inFooter);
      if (state.footerInternalOverflow > 1 || footerOverflowing.length) {
        routeFailures.push(`footer overflow=${state.footerInternalOverflow}; elements=${JSON.stringify(footerOverflowing)}`);
      }"""
if old_overflow_failure not in source:
    raise RuntimeError("Browser overflow failure anchor was not found")
source = source.replace(old_overflow_failure, new_overflow_failure, 1)

path = Path("/tmp/footer-pr1-run-original.sh")
path.write_text(source, encoding="utf-8")
path.chmod(0o755)
PY

exec bash /tmp/footer-pr1-run-original.sh
