#!/usr/bin/env python3
"""Deterministic source/rendered validation for ProAI Expert Site Shell R1."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


EXPECTED_INNER_ROUTES = (
    "/about/",
    "/ai-systems/",
    "/case-studies/",
    "/case-studies/alina-horb/",
    "/case-studies/financial-stream/",
    "/case-studies/local-repair-pro/",
    "/contact/",
    "/insights/",
    "/insights/ai-agent-or-automation-what-your-business-actually-needs/",
    "/insights/ai-ready-website-for-business/",
    "/insights/ai-search-optimization-for-service-businesses/",
    "/insights/does-your-service-business-need-a-multilingual-website/",
    "/insights/how-much-does-a-business-website-cost-in-2026-a-strategic-budget-view/",
    "/insights/how-to-evaluate-a-website-proposal/",
    "/insights/process-clarity-comes-before-scalable-automation/",
    "/insights/website-builder-or-custom-website-what-a-service-business-should-choose/",
    "/insights/what-a-premium-website-really-means-for-a-service-business/",
    "/insights/what-happens-after-a-lead-arrives/",
    "/insights/where-automation-delivers-its-first-real-roi/",
    "/insights/why-service-business-websites-fail-to-convert-high-intent-visitors/",
    "/ru/about/",
    "/ru/ai-systems/",
    "/ru/case-studies/",
    "/ru/case-studies/alina-horb/",
    "/ru/case-studies/financial-stream/",
    "/ru/case-studies/local-repair-pro/",
    "/ru/contact/",
    "/ru/insights/",
    "/ru/insights/ai-agent-ili-avtomatizatsiya-chto-nuzhno-biznesu/",
    "/ru/insights/ai-ready-sayt-dlya-biznesa/",
    "/ru/insights/ai-search-optimization-dlya-servisnogo-biznesa/",
    "/ru/insights/arkhitektura-konversii-gde-sayt-teryaet-klienta-eshche-do-pervogo-kontakta/",
    "/ru/insights/arkhitektura-vkhodyashchego-potoka-poryadok-v-zayavkakh/",
    "/ru/insights/chto-proiskhodit-posle-zayavki/",
    "/ru/insights/chto-znachit-premialnyy-sayt-dlya-servisnogo-biznesa/",
    "/ru/insights/ekonomika-proekta-pochemu-otsenka-po-stranitsam-oshibochna/",
    "/ru/insights/gde-avtomatizatsiya-daet-pervuyu-realnuyu-polzu-biznesu/",
    "/ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/",
    "/ru/insights/konstruktor-sayta-ili-sayt-na-zakaz-chto-vybrat-servisnomu-biznesu/",
    "/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/",
    "/ru/websites-branding/",
    "/websites-branding/",
)

GOLDEN_STYLES = (
    "/assets/css/home-footer-golden-r3.css",
    "/assets/css/home-footer-golden-r3-1.css",
    "/assets/css/home-footer-golden-r3-2-polish.css",
    "/assets/css/home-footer-golden-r3-3-micro-polish.css",
    "/assets/css/home-footer-signature-r4.css",
)

ALLOWED_SHELL_STYLE_FILES = {
    Path("assets/css/header-system-v1.css"),
    Path("assets/css/header-footer-logo-r1.css"),
    Path("assets/css/home-footer-golden-r3.css"),
    Path("assets/css/home-footer-golden-r3-1.css"),
    Path("assets/css/home-footer-golden-r3-2-polish.css"),
    Path("assets/css/home-footer-golden-r3-3-micro-polish.css"),
    Path("assets/css/home-footer-signature-r4.css"),
}


def route_file(site_root: Path, route: str) -> Path:
    relative = route.strip("/")
    return site_root / relative / "index.html" if relative else site_root / "index.html"


def validate_rendered_page(route: str, path: Path, site_root: Path) -> list[str]:
    errors: list[str] = []
    if not path.is_file():
        return [f"{route}: отсутствует rendered index.html"]

    html = path.read_text(encoding="utf-8")
    canonical_header_count = len(
        re.findall(r"<header\b[^>]*\bdata-site-header(?:\s|=|>)", html, re.IGNORECASE)
    )
    checks = {
        "канонический Header": canonical_header_count == 1,
        "канонический Golden Footer": html.count('data-site-footer-canonical="golden-r1"') == 1,
        "Header CSS": html.count("/assets/css/header-system-v1.css") == 1,
        "Header JS": html.count("/assets/js/header-system-v1.js") == 1,
        "Footer material JS": html.count("/assets/js/home-footer-golden-r3.js") == 1,
        "Footer signature JS": html.count("/assets/js/home-footer-signature-r4.js") == 1,
        "inner body hook": html.count("proai-inner-golden-r1") >= 1,
    }
    for asset in GOLDEN_STYLES:
        checks[f"Footer CSS {asset.rsplit('/', 1)[-1]}"] = html.count(asset) == 1

    for label, passed in checks.items():
        if not passed:
            errors.append(f"{route}: нарушение — {label}")

    if re.search(r'class="[^"]*\bsite-footer\b', html):
        errors.append(f"{route}: активна legacy .site-footer разметка")
    if "{%" in html or "{{" in html:
        errors.append(f"{route}: в rendered HTML остался Liquid")

    footer = re.search(
        r'<footer\b[^>]*data-site-footer-canonical="golden-r1"[\s\S]*?</footer>',
        html,
        re.IGNORECASE,
    )
    if not footer:
        return errors

    footer_html = footer.group(0)
    required_footer_parts = (
        "home-footer-golden-r3__eyebrow",
        "home-footer-golden-r3__cta",
        "home-footer-golden-r3__summary",
        "home-footer-golden-r3__signature",
        "home-footer-golden-r3__logo",
        "home-footer-golden-r3__social-rail",
        "home-footer-golden-r3__locale",
        "home-footer-golden-r3__copyright",
    )
    for part in required_footer_parts:
        if part not in footer_html:
            errors.append(f"{route}: Footer не содержит {part}")

    locale = re.search(
        r'class="home-footer-golden-r3__locale"[\s\S]*?<a\s+href="([^"]+)"[^>]*hreflang="(en|ru)"',
        footer_html,
        re.IGNORECASE,
    )
    if not locale:
        errors.append(f"{route}: отсутствует page-specific locale mapping в Footer")
    elif route.startswith("/ru/") and locale.group(2) != "en":
        errors.append(f"{route}: RU Footer должен вести на EN locale")
    elif not route.startswith("/ru/") and locale.group(2) != "ru":
        errors.append(f"{route}: EN Footer должен вести на RU locale")

    for href in re.findall(r'<a\s+[^>]*href="([^"]+)"', footer_html, re.IGNORECASE):
        target = urlsplit(href)
        if target.scheme or target.netloc or not target.path.startswith("/"):
            continue
        target_path = route_file(site_root, target.path)
        if not target_path.is_file():
            errors.append(f"{route}: Footer ведёт на отсутствующий локальный маршрут {target.path}")

    return errors


def source_audit(source_root: Path) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    header_include = source_root / "_includes/header-system/header.html"
    footer_entry = source_root / "_includes/footer-system/footer.html"
    footer_component = source_root / "_includes/footer-system/golden.html"
    for path in (header_include, footer_entry, footer_component):
        if not path.is_file():
            errors.append(f"source: отсутствует {path.relative_to(source_root)}")

    if footer_entry.is_file() and "footer-system/golden.html" not in footer_entry.read_text(encoding="utf-8"):
        errors.append("source: footer-system/footer.html не делегирует в canonical Golden component")

    excluded_roots = {"_site", "_site-shell-r1", ".git", ".worktrees", "owner-preview"}
    for path in source_root.rglob("*.html"):
        relative = path.relative_to(source_root)
        if any(part in excluded_roots or part.startswith("_site") for part in relative.parts):
            continue
        if relative in (Path("index.html"), Path("ru/index.html")):
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        if "proai-inner-golden-r1" not in text:
            continue
        if "document.querySelector('header');" in text or 'document.querySelector("header");' in text:
            errors.append(f"source: {relative} активно выбирает canonical Header через generic header selector")
        if re.search(r'<footer\b[^>]*class="[^"]*\bsite-footer\b', text, re.IGNORECASE):
            errors.append(f"source: {relative} содержит активную legacy .site-footer разметку")
        if re.search(r'(^|[,{\s])header\s*\{', text):
            warnings.append(f"source debt: {relative} содержит legacy generic header CSS; canonical cascade должен оставаться финальным")

    shell_selector = re.compile(r"\.(?:site-header(?:__|--|\b)|home-footer-golden-r3(?:__|--|\b))")
    for path in source_root.rglob("*.css"):
        relative = path.relative_to(source_root)
        if (
            relative in ALLOWED_SHELL_STYLE_FILES
            or any(part.startswith("_site") for part in relative.parts)
            or (relative.parts[:2] == ("assets", "css") and relative.name.startswith("homepage-"))
        ):
            continue
        if shell_selector.search(path.read_text(encoding="utf-8", errors="replace")):
            errors.append(f"source: {relative} пытается владеть canonical shell selector")

    return errors, warnings


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--site-root", type=Path, default=Path("_site"))
    args = parser.parse_args()

    source_root = args.source_root.resolve()
    site_root = args.site_root.resolve()
    errors, warnings = source_audit(source_root)

    for route in EXPECTED_INNER_ROUTES:
        errors.extend(validate_rendered_page(route, route_file(site_root, route), site_root))

    rendered_inner = 0
    if site_root.is_dir():
        for path in site_root.rglob("*.html"):
            try:
                if "proai-inner-golden-r1" in path.read_text(encoding="utf-8", errors="replace"):
                    rendered_inner += 1
            except OSError:
                continue

    if rendered_inner != len(EXPECTED_INNER_ROUTES):
        errors.append(
            f"rendered coverage: найдено {rendered_inner}, ожидалось {len(EXPECTED_INNER_ROUTES)} inner routes"
        )

    for warning in sorted(set(warnings)):
        print(f"WARN {warning}")
    for error in errors:
        print(f"FAIL {error}")

    if errors:
        print(f"SITE SHELL R1: FAIL ({len(errors)} ошибок, {len(set(warnings))} предупреждений)")
        return 1

    print(
        f"SITE SHELL R1: PASS — {rendered_inner}/{len(EXPECTED_INNER_ROUTES)} inner routes; "
        f"{len(set(warnings))} известных source-debt предупреждений"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
