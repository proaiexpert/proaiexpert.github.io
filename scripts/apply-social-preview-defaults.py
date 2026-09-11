#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import re
import subprocess
import sys
from pathlib import Path

EN_IMAGE = "https://proai-expert.com/assets/social/proai-home-og-en-r1-1.png"
RU_IMAGE = "https://proai-expert.com/assets/social/proai-home-og-ru-r1-1.png"
EN_ALT = "ProAI Expert — From first impression to result — one system."
RU_ALT = "ProAI Expert — От первого впечатления до результата — одна система."

ASSETS = {
    "en": {
        "filename": "proai-home-og-en-r1-1.png",
        "sha256": "f4ae67fca98808dc130ed2f1f9831a34b9e07a414a0028b2a5028523ea4438b1",
    },
    "ru": {
        "filename": "proai-home-og-ru-r1-1.png",
        "sha256": "d119b3bb919adf539c9cb5b8664b8a4fdeeac739a8ad5747f689410a98d56b5b",
    },
}

FORBIDDEN_SOCIAL_REFS = (
    "proai-home-en-desktop.png",
    "proai-home-ru-desktop.png",
    "/screenshots/",
    "/assets/insights/og/",
)

SOURCE_PUBLIC_TOP_LEVEL = {
    "about",
    "ai-systems",
    "case-studies",
    "contact",
    "insights",
    "solutions",
    "websites-branding",
    "ru",
}

GENERATED_SKIP_TOP_LEVEL = {
    ".ai",
    ".git",
    "_includes",
    "_layouts",
    "assets",
    "docs",
    "node_modules",
    "scripts",
    "tests",
    "vendor",
}

META_PATTERNS = {
    "og_image": re.compile(r'<meta\b[^>]*\bproperty\s*=\s*["\']og:image["\'][^>]*>\s*', re.I),
    "og_alt": re.compile(r'<meta\b[^>]*\bproperty\s*=\s*["\']og:image:alt["\'][^>]*>\s*', re.I),
    "og_width": re.compile(r'<meta\b[^>]*\bproperty\s*=\s*["\']og:image:width["\'][^>]*>\s*', re.I),
    "og_height": re.compile(r'<meta\b[^>]*\bproperty\s*=\s*["\']og:image:height["\'][^>]*>\s*', re.I),
    "twitter_card": re.compile(r'<meta\b[^>]*\bname\s*=\s*["\']twitter:card["\'][^>]*>\s*', re.I),
    "twitter_image": re.compile(r'<meta\b[^>]*\bname\s*=\s*["\']twitter:image["\'][^>]*>\s*', re.I),
    "twitter_alt": re.compile(r'<meta\b[^>]*\bname\s*=\s*["\']twitter:image:alt["\'][^>]*>\s*', re.I),
}


def run_favicon_r2(mode: str, root: Path) -> None:
    script = Path(__file__).with_name("apply-favicon-r2.py")
    subprocess.run(
        [sys.executable, str(script), "--mode", mode, "--root", str(root)],
        check=True,
    )


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def validate_assets(root: Path) -> None:
    for spec in ASSETS.values():
        check_png(root / "assets" / "social" / spec["filename"], spec["sha256"])


def is_ru_page(rel: Path, text: str) -> bool:
    if rel.parts and rel.parts[0].lower() == "ru":
        return True
    name = rel.name.lower()
    if "-ru" in name or "_ru" in name:
        return True
    if re.search(r'<html\b[^>]*\blang\s*=\s*["\']ru(?:-[^"\']*)?["\']', text, re.I):
        return True
    canonical = re.search(
        r'<link\b[^>]*\brel\s*=\s*["\']canonical["\'][^>]*\bhref\s*=\s*["\']([^"\']+)["\'][^>]*>',
        text,
        re.I,
    )
    if canonical and re.match(r'https://proai-expert\.com/ru(?:/|$)', canonical.group(1), re.I):
        return True
    return False


def social_block(is_ru: bool) -> str:
    image = RU_IMAGE if is_ru else EN_IMAGE
    alt = RU_ALT if is_ru else EN_ALT
    return (
        f'<meta property="og:image" content="{image}">\n'
        f'<meta property="og:image:alt" content="{alt}">\n'
        '<meta property="og:image:width" content="1200">\n'
        '<meta property="og:image:height" content="630">\n'
        '<meta name="twitter:card" content="summary_large_image">\n'
        f'<meta name="twitter:image" content="{image}">\n'
        f'<meta name="twitter:image:alt" content="{alt}">\n'
    )


def normalize_head(text: str, is_ru: bool) -> tuple[str, bool]:
    if not re.search(r'</head\s*>', text, re.I):
        return text, False
    original = text
    for pattern in META_PATTERNS.values():
        text = pattern.sub("", text)
    text = re.sub(r'</head\s*>', social_block(is_ru) + "</head>", text, count=1, flags=re.I)
    return text, text != original


def source_candidate(root: Path, path: Path) -> bool:
    rel = path.relative_to(root)
    if rel == Path("index.html"):
        return True
    return bool(rel.parts and rel.parts[0] in SOURCE_PUBLIC_TOP_LEVEL)


def generated_candidate(root: Path, path: Path) -> bool:
    rel = path.relative_to(root)
    return bool(rel.parts and rel.parts[0] not in GENERATED_SKIP_TOP_LEVEL)


def normalize_source(root: Path) -> int:
    validate_assets(root)
    changed_count = 0
    for path in sorted(root.rglob("*.html")):
        rel = path.relative_to(root)
        if any(part in {".git", "_site", "node_modules", "vendor"} for part in rel.parts):
            continue
        if not source_candidate(root, path):
            continue
        text = path.read_text(encoding="utf-8-sig")
        if not re.search(r'</head\s*>', text, re.I):
            continue
        new_text, changed = normalize_head(text, is_ru_page(rel, text))
        if changed:
            path.write_text(new_text, encoding="utf-8", newline="\n")
            changed_count += 1
    return changed_count


def normalize_generated(root: Path) -> int:
    validate_assets(root)
    changed_count = 0
    for path in sorted(root.rglob("*.html")):
        if not generated_candidate(root, path):
            continue
        text = path.read_text(encoding="utf-8-sig")
        if not re.search(r'</head\s*>', text, re.I):
            continue
        rel = path.relative_to(root)
        new_text, changed = normalize_head(text, is_ru_page(rel, text))
        if changed:
            path.write_text(new_text, encoding="utf-8", newline="\n")
            changed_count += 1
    return changed_count


def check_png(path: Path, expected_sha: str) -> None:
    if not path.exists():
        raise AssertionError(f"Missing social preview asset: {path}")
    data = path.read_bytes()
    actual = sha256_bytes(data)
    if actual != expected_sha:
        raise AssertionError(
            f"Unexpected bytes for social preview asset: {path}; expected {expected_sha}, got {actual}"
        )
    if len(data) < 24 or data[:8] != b"\x89PNG\r\n\x1a\n":
        raise AssertionError(f"Not a valid PNG: {path}")
    width = int.from_bytes(data[16:20], "big")
    height = int.from_bytes(data[20:24], "big")
    if (width, height) != (1200, 630):
        raise AssertionError(f"Wrong OG dimensions for {path}: {width}x{height}")


def metadata_errors(rel: Path, text: str) -> list[str]:
    errors: list[str] = []
    ru = is_ru_page(rel, text)
    image = RU_IMAGE if ru else EN_IMAGE
    alt = RU_ALT if ru else EN_ALT
    expectations = [
        (META_PATTERNS["og_image"], image, "og:image"),
        (META_PATTERNS["og_alt"], alt, "og:image:alt"),
        (META_PATTERNS["og_width"], "1200", "og:image:width"),
        (META_PATTERNS["og_height"], "630", "og:image:height"),
        (META_PATTERNS["twitter_card"], "summary_large_image", "twitter:card"),
        (META_PATTERNS["twitter_image"], image, "twitter:image"),
        (META_PATTERNS["twitter_alt"], alt, "twitter:image:alt"),
    ]
    for pattern, expected_value, label in expectations:
        matches = pattern.findall(text)
        if len(matches) != 1:
            errors.append(f"{rel}: expected exactly one {label}, found {len(matches)}")
            continue
        tag = pattern.search(text).group(0)
        if expected_value not in tag:
            errors.append(f"{rel}: {label} does not contain expected value {expected_value!r}")
    for forbidden in FORBIDDEN_SOCIAL_REFS:
        if forbidden in text:
            errors.append(f"{rel}: forbidden legacy social-preview reference {forbidden!r}")
    return errors


def check_source(root: Path) -> int:
    errors: list[str] = []
    checked = 0
    try:
        validate_assets(root)
    except AssertionError as exc:
        errors.append(str(exc))

    for path in sorted(root.rglob("*.html")):
        rel = path.relative_to(root)
        if any(part in {".git", "_site", "node_modules", "vendor"} for part in rel.parts):
            continue
        text = path.read_text(encoding="utf-8-sig")
        for forbidden in FORBIDDEN_SOCIAL_REFS:
            if forbidden in text:
                errors.append(f"{rel}: forbidden legacy social-preview reference {forbidden!r}")
        if not source_candidate(root, path) or not re.search(r'</head\s*>', text, re.I):
            continue
        errors.extend(metadata_errors(rel, text))
        checked += 1

    if errors:
        for error in sorted(set(errors)):
            print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(1)
    print(f"Social preview source verification passed for {checked} public source HTML pages.")
    return checked


def check_site(root: Path) -> int:
    errors: list[str] = []
    checked = 0
    try:
        validate_assets(root)
    except AssertionError as exc:
        errors.append(str(exc))

    for path in sorted(root.rglob("*.html")):
        if not generated_candidate(root, path):
            continue
        text = path.read_text(encoding="utf-8-sig")
        if not re.search(r'</head\s*>', text, re.I):
            continue
        rel = path.relative_to(root)
        errors.extend(metadata_errors(rel, text))
        checked += 1

    if errors:
        for error in sorted(set(errors)):
            print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(1)
    print(f"Social preview generated-site verification passed for {checked} public HTML pages.")
    return checked


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=("source", "check-source", "site", "check"), required=True)
    parser.add_argument("--root", type=Path, required=True)
    args = parser.parse_args()
    root = args.root.resolve()

    if args.mode == "source":
        changed = normalize_source(root)
        run_favicon_r2("source", root)
        print(f"Source social preview normalization complete: {changed} HTML files changed.")
    elif args.mode == "check-source":
        check_source(root)
        run_favicon_r2("check", root)
    elif args.mode == "site":
        changed = normalize_generated(root)
        run_favicon_r2("site", root)
        print(f"Generated-site social preview normalization complete: {changed} HTML files changed.")
    else:
        check_site(root)
        run_favicon_r2("check", root)


if __name__ == "__main__":
    main()
