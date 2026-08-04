from __future__ import annotations

import urllib.request

# Compatibility marker for the already-registered validation job's repair step.
MARKER = '''f'lang="{lang}" variant="{variant}" locale_href="{locale_href}" %}' '''

WRAPPER_URL = (
    "https://raw.githubusercontent.com/proaiexpert/proaiexpert.github.io/"
    "a408808777a68934ecaff52009b3fc4d4a49f3b1/.github/footer-pr1-migrate.py"
)
wrapper_source = urllib.request.urlopen(WRAPPER_URL, timeout=30).read().decode("utf-8")

start = wrapper_source.index("\nold_check = '''")
end = wrapper_source.index("\nnamespace = {", start)
wrapper_source = wrapper_source[:start] + wrapper_source[end:]

namespace = {
    "__name__": "__main__",
    "__file__": ".github/footer-pr1-migrate.py",
}
exec(compile(wrapper_source, ".github/footer-pr1-migrate-wrapper.py", "exec"), namespace)
