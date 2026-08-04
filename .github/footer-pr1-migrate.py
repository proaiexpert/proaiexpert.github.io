from __future__ import annotations

import json
import re
import urllib.request

# Compatibility marker for the already-registered validation job's repair step.
MARKER = "f'lang=\"{lang}\" variant=\"{variant}\" locale_href=\"{locale_href}\" %}'"

SOURCE_URL = (
    "https://raw.githubusercontent.com/proaiexpert/proaiexpert.github.io/"
    "36300fbe65a722d0a58db2dbce4363ad2b6f74f8/.github/footer-pr1-migrate.py"
)
source = urllib.request.urlopen(SOURCE_URL, timeout=30).read().decode("utf-8")

old_delimiter = "f'lang=\"{lang}\" variant=\"{variant}\" locale_href=\"{locale_href}\" " + "%}'"
new_delimiter = "f'lang=\"{lang}\" variant=\"{variant}\" locale_href=\"{locale_href}\" ' + '%}'"
if old_delimiter not in source:
    raise RuntimeError("Original migration delimiter was not found")
source = source.replace(old_delimiter, new_delimiter, 1)

old_check = '''    if ".f-" in value:
        raise RuntimeError(f"{relative_path}: legacy .f-* selector remains")'''
new_check = '''    if ".f-" in value:
        contexts = []
        for match in re.finditer(r".{0,140}\\.f-[A-Za-z0-9_-]+.{0,140}", value, flags=re.S):
            contexts.append(match.group(0).replace("\\n", " "))
        print(json.dumps({"path": relative_path, "legacy_contexts": contexts[:30]}, ensure_ascii=False, indent=2))
        raise RuntimeError(f"{relative_path}: legacy .f-* selector remains")'''
if old_check not in source:
    raise RuntimeError("Original legacy assertion was not found")
source = source.replace(old_check, new_check, 1)

namespace = {
    "__name__": "__main__",
    "__file__": ".github/footer-pr1-migrate.py",
}
exec(compile(source, ".github/footer-pr1-migrate-original.py", "exec"), namespace)
