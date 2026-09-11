#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
from pathlib import Path

ICON_HREF = "/favicon.ico?v=20260910-r2"
APPLE_HREF = "/apple-touch-icon.png?v=20260910-r2"
NEW_TAGS = (
    f'<link rel="icon" href="{ICON_HREF}">\n'
    f'<link rel="apple-touch-icon" href="{APPLE_HREF}">'
)

LINK_RE = re.compile(r"<link\b[^>]*>", re.IGNORECASE)
REL_RE = re.compile(r"\brel\s*=\s*([\"'])(.*?)\1", re.IGNORECASE | re.DOTALL)
VIEWPORT_RE = re.compile(r"<meta\b[^>]*\bname\s*=\s*([\"'])viewport\1[^>]*>", re.IGNORECASE | re.DOTALL)
CHARSET_RE = re.compile(r"<meta\b[^>]*\bcharset\s*=\s*([\"'])?[^>\s\"']+\1?[^>]*>", re.IGNORECASE | re.DOTALL)
HEAD_RE = re.compile(r"<head\b[^>]*>", re.IGNORECASE)

SKIP_DIRS = {".git", "node_modules", "vendor", "_site"}


def is_icon_link(tag: str) -> bool:
    match = REL_RE.search(tag)
    if not match:
        return False
    rel_tokens = {token.strip().lower() for token in re.split(r"\s+", match.group(2)) if token.strip()}
    return "icon" in rel_tokens or "apple-touch-icon" in rel_tokens


def iter_html(root: Path):
    for path in root.rglob("*.html"):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        yield path


def rewrite_text(text: str) -> str:
    had_head = bool(HEAD_RE.search(text))
    had_icon = any(is_icon_link(tag) for tag in LINK_RE.findall(text))
    if not had_head and not had_icon:
        return text

    cleaned = LINK_RE.sub(lambda m: "" if is_icon_link(m.group(0)) else m.group(0), text)

    anchor = VIEWPORT_RE.search(cleaned)
    if not anchor:
        anchor = CHARSET_RE.search(cleaned)
    if not anchor:
        anchor = HEAD_RE.search(cleaned)
    if not anchor:
        return cleaned

    pos = anchor.end()
    return cleaned[:pos] + "\n" + NEW_TAGS + cleaned[pos:]


def normalize(root: Path) -> tuple[int, int]:
    seen = changed = 0
    for path in iter_html(root):
        text = path.read_text(encoding="utf-8")
        if not HEAD_RE.search(text) and not any(is_icon_link(tag) for tag in LINK_RE.findall(text)):
            continue
        seen += 1
        new_text = rewrite_text(text)
        if new_text != text:
            path.write_text(new_text, encoding="utf-8")
            changed += 1
    return seen, changed


def check(root: Path) -> None:
    failures = []
    checked = 0
    for path in iter_html(root):
        text = path.read_text(encoding="utf-8")
        if not HEAD_RE.search(text):
            continue
        checked += 1
        icon_count = text.count(ICON_HREF)
        apple_count = text.count(APPLE_HREF)
        icon_links = [tag for tag in LINK_RE.findall(text) if is_icon_link(tag)]
        if icon_count != 1 or apple_count != 1 or len(icon_links) != 2:
            failures.append(f"{path}: icon={icon_count} apple={apple_count} total-icon-links={len(icon_links)}")
    if failures:
        raise SystemExit("Favicon R2 verification failed:\n" + "\n".join(failures[:100]))
    print(f"Favicon R2 verified for {checked} HTML documents under {root}.")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=["source", "site", "check"], required=True)
    parser.add_argument("--root", required=True)
    args = parser.parse_args()
    root = Path(args.root)
    if args.mode in {"source", "site"}:
        seen, changed = normalize(root)
        print(f"Favicon R2 normalized: {changed}/{seen} HTML documents changed under {root}.")
    else:
        check(root)


if __name__ == "__main__":
    main()
