#!/usr/bin/env python3
"""Validate ProAI Expert Insights Editorial V2 publication authority."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def front_matter(text: str) -> str:
    match = re.match(r"^---\n([\s\S]*?)\n---\n", text)
    return match.group(1) if match else ""


def field(block: str, name: str) -> str | None:
    match = re.search(rf"(?m)^\s*{re.escape(name)}:\s*[\"']?([^\n\"']+)", block)
    return match.group(1).strip() if match else None


def registry_records(text: str) -> dict[str, dict[str, object]]:
    result: dict[str, dict[str, object]] = {}
    for match in re.finditer(r"(?ms)^- id:\s*([^\n]+)\n(.*?)(?=^- id:|\Z)", text):
        insight_id = match.group(1).strip()
        block = match.group(2)
        author = field(block, "author_ref")
        publication_index = field(block, "publication_index")
        related_match = re.search(r"(?m)^\s{2}related_ids:\s*\[([^\]]*)\]", block)
        related_ids = []
        if related_match:
            related_ids = [item.strip() for item in related_match.group(1).split(",") if item.strip()]

        routes: dict[str, str] = {}
        for lang in ("en", "ru"):
            lang_match = re.search(rf"(?ms)^  {lang}:\n(.*?)(?=^  [a-z][a-z_]*:|\Z)", block)
            if lang_match:
                route = field(lang_match.group(1), "route")
                if route:
                    routes[lang] = route

        result[insight_id] = {
            "author_ref": author or "",
            "publication_index": publication_index or "",
            "related_ids": related_ids,
            "routes": routes,
        }
    return result


def author_registry(text: str) -> dict[str, dict[str, str]]:
    result: dict[str, dict[str, str]] = {}
    matches = list(re.finditer(r"(?m)^([A-Za-z0-9_-]+):\n", text))
    for index, match in enumerate(matches):
        key = match.group(1)
        start = match.end()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        block = text[start:end]
        schema_type = field(block, "schema_type")
        if not schema_type:
            continue
        localized: dict[str, str] = {"schema_type": schema_type}
        for lang in ("en", "ru"):
            lang_match = re.search(rf"(?ms)^  {lang}:\n(.*?)(?=^  [a-z][a-z_]*:|\Z)", block)
            if lang_match:
                name = field(lang_match.group(1), "name")
                if name:
                    localized[f"name_{lang}"] = name
        result[key] = localized
    return result


def output_path(site_root: Path, permalink: str) -> Path:
    relative = permalink.strip("/")
    return site_root / relative / "index.html"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-root", type=Path, default=Path("."))
    parser.add_argument("--site-root", type=Path, default=Path("_site"))
    args = parser.parse_args()

    source_root = args.source_root.resolve()
    site_root = args.site_root.resolve()
    errors: list[str] = []

    insights_path = source_root / "_data/insights.yml"
    authors_path = source_root / "_data/authors.yml"
    layout_path = source_root / "_layouts/insight-v2.html"
    css_path = source_root / "assets/css/insights-editorial-v2.css"

    for path in (insights_path, authors_path, layout_path, css_path):
        if not path.is_file():
            errors.append(f"missing canonical file: {path.relative_to(source_root)}")

    if errors:
        for error in errors:
            print(f"FAIL {error}")
        return 1

    registry = registry_records(read(insights_path))
    insight_authors = {key: str(value["author_ref"]) for key, value in registry.items()}
    authors = author_registry(read(authors_path))
    layout = read(layout_path)
    css = read(css_path)

    forbidden_fallbacks = (
        "What must happen between an inquiry and a controlled next action?",
        "Что должно произойти между входящим обращением и управляемым следующим действием?",
    )
    for phrase in forbidden_fallbacks:
        if phrase in layout:
            errors.append("Article V2 layout still contains Lead Response-specific signal fallback")

    if "--iv2-reading:74ch" not in css:
        errors.append("reading-measure authority is not 74ch")
    if "--iv2-prose:900px" not in css:
        errors.append("large-desktop Article field is not 900px")
    if ".insight-v2-related-decisions{" not in css:
        errors.append("Related Decisions publication-register styling is missing")

    seen_indexes: set[str] = set()
    for insight_id, record in registry.items():
        publication_index = str(record["publication_index"])
        if not publication_index.isdigit():
            errors.append(f"{insight_id}: missing numeric publication_index")
        elif publication_index in seen_indexes:
            errors.append(f"{insight_id}: duplicate publication_index {publication_index}")
        else:
            seen_indexes.add(publication_index)

        related_ids = list(record["related_ids"])
        if not 2 <= len(related_ids) <= 3:
            errors.append(f"{insight_id}: related_ids must contain 2-3 items")
        if len(related_ids) != len(set(related_ids)):
            errors.append(f"{insight_id}: duplicate related_ids")
        if insight_id in related_ids:
            errors.append(f"{insight_id}: related_ids cannot reference itself")
        for related_id in related_ids:
            target = registry.get(related_id)
            if not target:
                errors.append(f"{insight_id}: unknown related_id {related_id}")
                continue
            routes = dict(target["routes"])
            if not routes.get("en") or not routes.get("ru"):
                errors.append(f"{insight_id}: related_id {related_id} lacks EN/RU routes")

    article_sources: list[Path] = []
    for root in (source_root / "insights", source_root / "ru/insights"):
        if not root.is_dir():
            continue
        for path in root.rglob("index.html"):
            fm = front_matter(read(path))
            if re.search(r"(?m)^layout:\s*insight-v2\s*$", fm):
                article_sources.append(path)

    if not article_sources:
        errors.append("no Article V2 sources found")

    for path in sorted(article_sources):
        text = read(path)
        fm = front_matter(text)
        rel = path.relative_to(source_root).as_posix()
        lang = field(fm, "lang")
        insight_id = field(fm, "insight_id")
        permalink = field(fm, "permalink")

        if not insight_id:
            errors.append(f"{rel}: missing insight_id")
            continue
        if lang not in {"en", "ru"}:
            errors.append(f"{rel}: invalid or missing lang")
        if not permalink:
            errors.append(f"{rel}: missing permalink")

        signal_match = re.search(r"(?ms)^signal:\n(.*?)(?=^[A-Za-z_][\w-]*:|\Z)", fm)
        signal_count = len(re.findall(r"(?m)^\s{2}- label:", signal_match.group(1))) if signal_match else 0
        if signal_count == 0:
            errors.append(f"{rel}: explicit page.signal is required")

        author_ref = insight_authors.get(insight_id)
        if not author_ref:
            errors.append(f"{rel}: insight registry has no author_ref")
            continue
        author = authors.get(author_ref)
        if not author:
            errors.append(f"{rel}: unknown author_ref {author_ref}")
            continue

        related_include = text.find('{% include insights/related-decisions.html')
        cta = text.find('<div class="insight-v2-article-cta">')
        if related_include < 0 or cta < 0 or related_include > cta:
            errors.append(f"{rel}: Related Decisions include must precede article CTA")

        if site_root.is_dir() and permalink:
            rendered_path = output_path(site_root, permalink)
            if not rendered_path.is_file():
                errors.append(f"{rel}: rendered article missing at {permalink}")
                continue
            html = read(rendered_path)
            expected_type = author["schema_type"].lower()
            expected_name = author.get(f"name_{lang}", "")
            if f'data-signal-count="{signal_count}"' not in html:
                errors.append(f"{rel}: rendered signal count does not match source")
            if f'data-author-type="{expected_type}"' not in html:
                errors.append(f"{rel}: rendered author type does not match author_ref")

            related_ids = list(registry.get(insight_id, {}).get("related_ids", []))
            if f'data-related-count="{len(related_ids)}"' not in html:
                errors.append(f"{rel}: rendered Related Decisions count mismatch")
            for related_id in related_ids:
                if f'data-related-id="{related_id}"' not in html:
                    errors.append(f"{rel}: rendered Related Decisions missing {related_id}")
                target = registry.get(related_id, {})
                target_route = dict(target.get("routes", {})).get(lang, "")
                if target_route and f'href="{target_route}"' not in html:
                    errors.append(f"{rel}: rendered Related Decisions route mismatch for {related_id}")
            scripts = re.findall(
                r'<script\b[^>]*type=["\']application/ld\+json["\'][^>]*>([\s\S]*?)</script>',
                html,
                flags=re.I,
            )
            article_json = None
            for raw in scripts:
                try:
                    payload = json.loads(raw)
                except json.JSONDecodeError:
                    continue
                graph = payload.get("@graph", []) if isinstance(payload, dict) else []
                article_json = next((item for item in graph if item.get("@type") == "Article"), None)
                if article_json:
                    break
            if not article_json:
                errors.append(f"{rel}: valid Article JSON-LD not found")
            else:
                schema_author = article_json.get("author", {})
                if schema_author.get("@type", "").lower() != expected_type:
                    errors.append(f"{rel}: schema author type mismatch")
                if expected_name and schema_author.get("name") != expected_name:
                    errors.append(f"{rel}: schema author name mismatch")

    if errors:
        for error in errors:
            print(f"FAIL {error}")
        print(f"INSIGHTS EDITORIAL V2: FAIL ({len(errors)} errors)")
        return 1

    print(
        f"INSIGHTS EDITORIAL V2: PASS — {len(article_sources)} Article V2 sources; "
        "explicit signals; canonical authors; validated Related Decisions graph; "
        "900px field / 74ch reading measure."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
