#!/usr/bin/env python3
"""R5 page-level published-output invariants (never mutates pages)."""
import json
import re
from pathlib import Path

root = Path("_site")
paths = ["ai-systems/index.html","ru/ai-systems/index.html",
         "owner-preview/ai-systems-r5-release-candidate-r1/index.html",
         "owner-preview/ai-systems-r5-release-candidate-r1/ru/index.html"]
for path in paths:
    doc = (root / path).read_text(encoding="utf-8")
    is_ru = "/ru/" in ("/" + path) or path.startswith("ru/")
    is_preview = path.startswith("owner-preview/")
    expected = "AI-системы и автоматизация бизнеса | ProAI Expert" if is_ru else "AI Systems & Business Automation | ProAI Expert"
    assert "<title>" + expected + "</title>" in doc, (path, "title")
    assert ('name="robots" content="noindex,nofollow"' in doc) == is_preview, (path, "robots")
    assert "TEMPORARY VISUAL AUTHORITY" not in doc, (path, "temporary label")
    assert "data-temporary-visual-authority" not in doc, (path, "temporary attribute")
    assert "\\n<link" not in doc, (path, "literal backslash n")
    assert len(re.findall(r"<h1\\b", doc)) == 1, (path, "H1")
    for token in ("operational-register", "reference-implementation", "ai-r4-evidence-section",
                  "ai-r4-spine-section", "ai-r4-endpoint", "ai-r5-proof-links",
                  "ai-r5-use-case", "ai-r5-insights"):
        assert token in doc, (path, token)
    assert "8.36K" not in doc and "8,36K" not in doc, (path, "unverified metrics")
    assert "/ru/contact/#project-intake" in doc if is_ru else "/contact/#project-intake" in doc
    assert re.search(r'<link rel="canonical" href="https://proai-expert.com/(?:ru/)?ai-systems/"', doc), (path, "canonical")
    for language in ("en","ru","x-default"):
        assert re.search(r'<link rel="alternate" hreflang="'+language+'"',doc), (path, language)
    scripts = re.findall(r'<script type="application/ld\\+json">([\\s\\S]*?)</script>', doc)
    assert len(scripts) == 1, (path, "single JSONLD")
    graph = json.loads(scripts[0])
    nodes = graph["@graph"]
    assert [x["@type"] for x in nodes].count("Service") == 1, (path, "Service duplicates")
    assert [x["@type"] for x in nodes].count("WebPage") == 1, (path, "WebPage")
    assert nodes[0]["mainEntity"]["@id"] == nodes[1]["@id"], (path, "graph relationship")
    prefix = "/ru/" if is_ru else "/"
    link = prefix + "case-studies/financial-stream/"
    assert link in doc, (path, "case study")
    assert doc.count('href="'+prefix+"insights/") >= 3, (path, "Insights")
    assert 'href="#operational-register"' in doc, (path, "secondary CTA")
    assert "AI Systems architecture visualization" in doc or "Визуализация архитектуры AI Systems" in doc
    assert "class=\"site-header" in doc, (path, "built Jekyll header")
    assert "data-home-footer-golden-r3" in doc, (path, "built shared footer")
    assert "{% include" not in doc, (path, "uncompiled Liquid")
    print("PASS", path, "graph",len(nodes),"noindex",is_preview)
for path in ("contact/index.html","ru/contact/index.html"):
    doc = (root / path).read_text(encoding="utf-8")
    assert 'id="project-intake"' in doc or "id='project-intake'" in doc, (path,"target missing")
print("PASS: contact intake anchors EN/RU; all four built AI Systems pages")
