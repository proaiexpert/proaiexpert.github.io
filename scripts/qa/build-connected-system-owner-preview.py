#!/usr/bin/env python3
"""Build static EN/RU Owner Preview pages from the Jekyll-compiled homepage.

Cloudflare Pages serves repository files as-is. These pages must never be
copied from the raw Liquid source. The preview is intentionally noindex.
Only two isolated files under owner-preview/ are generated.
"""
from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

SITE = Path("_site")
TARGET = Path("owner-preview/connected-system-css-bundle")
PREVIEW_EN = "/owner-preview/connected-system-css-bundle/"
PREVIEW_RU = "/owner-preview/connected-system-css-bundle/ru/"
BUNDLE = "/assets/css/homepage-connected-system-r142-bundled-preview.css"
REQUIRED = (
    'id="main-content"',
    'data-connected-next',
    'data-stage-button="1"',
    'data-stage-button="2"',
    'data-stage-button="3"',
    'data-stage-button="4"',
    'data-tw-r5',
    'data-home-tech-fold-flow',
    'data-home-footer-golden-r3',
    BUNDLE,
    '/assets/js/homepage-connected-system-r142.js',
)
MARKER = '<meta name="robots" content="noindex, nofollow, noarchive">\n'
BUILD_MARKER = '<meta name="proai-preview-artifact" content="connected-system-css-bundle-20261114">\n'

def render(lang: str) -> dict:
    source = SITE / ("ru/index.html" if lang == "ru" else "index.html")
    destination = TARGET / ("ru/index.html" if lang == "ru" else "index.html")
    html = source.read_text(encoding="utf-8")
    if len(html) < 25_000:
        raise RuntimeError(f"{source}: unexpectedly short compiled page: {len(html)}")
    if "{%" in html or "{{" in html:
        raise RuntimeError(f"{source}: UNPROCESSED LIQUID; refusing to publish")
    if html.count("<!DOCTYPE html>") + html.count("<!doctype html>") != 1:
        raise RuntimeError(f"{source}: HTML document declaration is not unique")
    for token in REQUIRED:
        if token not in html:
            raise RuntimeError(f"{source}: compiled section or asset missing: {token}")
    if lang == "ru" and 'lang="ru"' not in html:
        raise RuntimeError(f"{source}: missing RU language")
    if lang == "en" and 'lang="en"' not in html:
        raise RuntimeError(f"{source}: missing EN language")

    # Keep language switchers inside the compiled preview rather than taking
    # the owner to the raw / and /ru/ Cloudflare source routes.
    html = html.replace('href="/ru/"', f'href="{PREVIEW_RU}"')
    html = html.replace('href="/"', f'href="{PREVIEW_EN}"')
    if '<head>' not in html or '</head>' not in html:
        raise RuntimeError(f"{source}: head missing")
    html = html.replace('<head>', '<head>\n' + MARKER + BUILD_MARKER, 1)

    if re.search(r"\{%\s*(include|assign|if|for|render)\b", html):
        raise RuntimeError(f"{source}: unresolved Jekyll/Liquid token survived")
    if html.count(MARKER) != 1 or html.count(BUILD_MARKER) != 1:
        raise RuntimeError(f"{source}: preview markers not unique")
    if html.count(BUNDLE) != 1:
        raise RuntimeError(f"{source}: expected exactly one bundled CSS link")
    if 'href="/ru/"' in html or 'href="/"' in html:
        raise RuntimeError(f"{source}: owner language navigation still points at raw root")

    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(html, encoding="utf-8")
    copy = destination.read_text(encoding="utf-8")
    if copy != html or "{%" in copy or "{{" in copy:
        raise RuntimeError(f"{destination}: readback mismatch or unresolved Liquid")
    return {
        "lang": lang,
        "path": destination.as_posix(),
        "bytes": len(copy.encode("utf-8")),
        "sha256": hashlib.sha256(copy.encode("utf-8")).hexdigest(),
        "contains_liquid": False,
        "indexing": "noindex",
    }

def main():
    if not (SITE / "index.html").is_file() or not (SITE / "ru/index.html").is_file():
        raise RuntimeError("Jekyll compiled EN/RU homepages are missing")
    if not Path("assets/css/homepage-connected-system-r142-bundled-preview.css").is_file():
        raise RuntimeError("Bundled candidate CSS is missing")
    report = [render("en"), render("ru")]
    print("COMPILED_OWNER_PREVIEW " + json.dumps({"pass": True, "pages": report}, ensure_ascii=False))

if __name__ == "__main__":
    main()
