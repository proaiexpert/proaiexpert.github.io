from __future__ import annotations

import urllib.request

# Compatibility marker for the already-registered validation job's repair step.
MARKER = '''f'lang="{lang}" variant="{variant}" locale_href="{locale_href}" %}' '''

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

helper = r'''
def _css_find_open_brace(css: str, start: int) -> int:
    quote = None
    escaped = False
    in_comment = False
    i = start
    while i < len(css):
        ch = css[i]
        nxt = css[i + 1] if i + 1 < len(css) else ""
        if in_comment:
            if ch == "*" and nxt == "/":
                in_comment = False
                i += 2
                continue
            i += 1
            continue
        if quote:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == quote:
                quote = None
            i += 1
            continue
        if ch == "/" and nxt == "*":
            in_comment = True
            i += 2
            continue
        if ch in ("'", '"'):
            quote = ch
            i += 1
            continue
        if ch == "{":
            return i
        i += 1
    return -1


def _css_find_matching_brace(css: str, opening: int) -> int:
    depth = 1
    quote = None
    escaped = False
    in_comment = False
    i = opening + 1
    while i < len(css):
        ch = css[i]
        nxt = css[i + 1] if i + 1 < len(css) else ""
        if in_comment:
            if ch == "*" and nxt == "/":
                in_comment = False
                i += 2
                continue
            i += 1
            continue
        if quote:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == quote:
                quote = None
            i += 1
            continue
        if ch == "/" and nxt == "*":
            in_comment = True
            i += 2
            continue
        if ch in ("'", '"'):
            quote = ch
            i += 1
            continue
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return -1


def _css_split_selectors(selector_text: str) -> list[str]:
    selectors = []
    start = 0
    paren = 0
    bracket = 0
    quote = None
    escaped = False
    in_comment = False
    i = 0
    while i < len(selector_text):
        ch = selector_text[i]
        nxt = selector_text[i + 1] if i + 1 < len(selector_text) else ""
        if in_comment:
            if ch == "*" and nxt == "/":
                in_comment = False
                i += 2
                continue
            i += 1
            continue
        if quote:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == quote:
                quote = None
            i += 1
            continue
        if ch == "/" and nxt == "*":
            in_comment = True
            i += 2
            continue
        if ch in ("'", '"'):
            quote = ch
        elif ch == "(":
            paren += 1
        elif ch == ")" and paren:
            paren -= 1
        elif ch == "[":
            bracket += 1
        elif ch == "]" and bracket:
            bracket -= 1
        elif ch == "," and paren == 0 and bracket == 0:
            selectors.append(selector_text[start:i])
            start = i + 1
        i += 1
    selectors.append(selector_text[start:])
    return selectors


def _is_legacy_footer_selector(selector: str) -> bool:
    return bool(re.search(
        r"(?<![-\w])footer(?=(?:[\s.:#\[\]>+~]|$))|\.footer-container\b|\.f-[A-Za-z0-9_-]+\b",
        selector,
        flags=re.I,
    ))


def _strip_legacy_footer_rules(css: str) -> str:
    result = []
    cursor = 0
    while cursor < len(css):
        opening = _css_find_open_brace(css, cursor)
        if opening < 0:
            result.append(css[cursor:])
            break
        closing = _css_find_matching_brace(css, opening)
        if closing < 0:
            result.append(css[cursor:])
            break

        prelude = css[cursor:opening]
        body = css[opening + 1:closing]
        stripped = prelude.strip()

        if stripped.startswith("@"):
            at_name = stripped.split(None, 1)[0].lower()
            if at_name in {"@media", "@supports", "@container", "@layer", "@scope", "@document"}:
                cleaned_body = _strip_legacy_footer_rules(body)
                if cleaned_body.strip():
                    result.append(prelude + "{" + cleaned_body + "}")
            else:
                result.append(prelude + "{" + body + "}")
        else:
            selectors = _css_split_selectors(prelude)
            kept = [selector for selector in selectors if not _is_legacy_footer_selector(selector)]
            if kept:
                result.append(",".join(kept) + "{" + body + "}")

        cursor = closing + 1
    return "".join(result)


def strip_embedded_legacy_footer_css(value: str) -> str:
    def clean_style(match: re.Match[str]) -> str:
        return match.group(1) + _strip_legacy_footer_rules(match.group(2)) + match.group(3)

    return re.sub(
        r"(<style\b[^>]*>)(.*?)(</style>)",
        clean_style,
        value,
        flags=re.I | re.S,
    )
'''

anchor = "\ndef migrate_page(relative_path: str, lang: str, variant: str, locale_href: str) -> dict[str, str]:"
if anchor not in source:
    raise RuntimeError("Migration function anchor was not found")
source = source.replace(anchor, "\n" + helper + anchor, 1)

old_call = "    value = remove_footer_owned_css(value)"
new_call = "    value = remove_footer_owned_css(value)\n    value = strip_embedded_legacy_footer_css(value)"
if old_call not in source:
    raise RuntimeError("Footer CSS cleanup call was not found")
source = source.replace(old_call, new_call, 1)

old_check = '''    if ".f-" in value:
        raise RuntimeError(f"{relative_path}: legacy .f-* selector remains")'''
new_check = '''    if ".f-" in value:
        contexts = []
        for match in re.finditer(r".{0,120}\.f-[A-Za-z0-9_-]+.{0,120}", value, flags=re.S):
            contexts.append(match.group(0).replace("\n", " "))
        print(json.dumps({"path": relative_path, "legacy_contexts": contexts[:20]}, ensure_ascii=False, indent=2))
        raise RuntimeError(f"{relative_path}: legacy .f-* selector remains")'''
if old_check not in source:
    raise RuntimeError("Legacy assertion anchor was not found")
source = source.replace(old_check, new_check, 1)

namespace = {
    "__name__": "__main__",
    "__file__": ".github/footer-pr1-migrate.py",
}
exec(compile(source, ".github/footer-pr1-migrate-original.py", "exec"), namespace)
