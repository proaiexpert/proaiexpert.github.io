from __future__ import annotations

from pathlib import Path
import json
import re

ROOT = Path.cwd()

TARGETS = {
    "case-studies/index.html": {
        "lang": "en",
        "variant": "archive",
        "locale_href": "/ru/case-studies/",
    },
    "ru/case-studies/index.html": {
        "lang": "ru",
        "variant": "archive",
        "locale_href": "/case-studies/",
    },
    "case-studies/financial-stream/index.html": {
        "lang": "en",
        "variant": "case",
        "locale_href": "/ru/case-studies/financial-stream/",
    },
    "ru/case-studies/financial-stream/index.html": {
        "lang": "ru",
        "variant": "case",
        "locale_href": "/case-studies/financial-stream/",
    },
    "case-studies/alina-horb/index.html": {
        "lang": "en",
        "variant": "case",
        "locale_href": "/ru/case-studies/alina-horb/",
    },
    "ru/case-studies/alina-horb/index.html": {
        "lang": "ru",
        "variant": "case",
        "locale_href": "/case-studies/alina-horb/",
    },
    "case-studies/local-repair-pro/index.html": {
        "lang": "en",
        "variant": "case",
        "locale_href": "/ru/case-studies/local-repair-pro/",
    },
    "ru/case-studies/local-repair-pro/index.html": {
        "lang": "ru",
        "variant": "case",
        "locale_href": "/case-studies/local-repair-pro/",
    },
}

LEGACY_STYLESHEET_RE = re.compile(
    r"^[ \t]*<link\b[^>]*href=[\"'][^\"']*(?:portfolio-footer-compact-v1|footer-commercial-v1(?:-polish)?)\.css[^\"']*[\"'][^>]*>\s*\n?",
    re.IGNORECASE | re.MULTILINE,
)
FOOTER_RE = re.compile(r"<footer\b[^>]*>.*?</footer>", re.IGNORECASE | re.DOTALL)


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def write(path: str, content: str) -> None:
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")


def ensure_front_matter(text: str) -> str:
    if text.startswith("---\n"):
        return text
    return "---\n---\n" + text


def migrate_page(path: str, config: dict[str, str]) -> dict[str, object]:
    source = read(path)
    original = source

    source = LEGACY_STYLESHEET_RE.sub("", source)

    footer_matches = [
        match
        for match in FOOTER_RE.finditer(source)
        if "global-footer" in source[match.start() : source.find(">", match.start()) + 1]
    ]
    if len(footer_matches) != 1:
        raise RuntimeError(f"{path}: expected exactly one visible global footer, found {len(footer_matches)}")

    include = (
        "{% include footer-system/footer.html "
        + f"family=\"portfolio\" variant=\"{config['variant']}\" "
        + f"lang=\"{config['lang']}\" locale_href=\"{config['locale_href']}\""
        + " %}"
    )
    match = footer_matches[0]
    source = source[: match.start()] + include + source[match.end() :]

    stylesheet = '<link rel="stylesheet" href="/assets/css/footer-system-v1.css?v=20260804.2">'
    if "footer-system-v1.css" not in source:
        if "</head>" not in source:
            raise RuntimeError(f"{path}: missing </head>")
        source = source.replace("</head>", f"  {stylesheet}\n</head>", 1)

    source = ensure_front_matter(source)

    if source.count("{% include footer-system/footer.html") != 1:
        raise RuntimeError(f"{path}: Footer System include count is not one")
    if "portfolio-footer-compact-v1.css" in source:
        raise RuntimeError(f"{path}: legacy Portfolio stylesheet remains")
    if FOOTER_RE.search(source):
        raise RuntimeError(f"{path}: legacy footer markup remains")

    write(path, source)
    return {
        "path": path,
        "lang": config["lang"],
        "variant": config["variant"],
        "locale_href": config["locale_href"],
        "changed": source != original,
    }


def update_dispatcher() -> None:
    write(
        "_includes/footer-system/footer.html",
        """{% assign footer_family = include.family | default: 'commercial' %}\n{% case footer_family %}\n  {% when 'portfolio' %}\n    {% include footer-system/portfolio.html lang=include.lang variant=include.variant locale_href=include.locale_href %}\n  {% else %}\n    {% include footer-system/commercial.html lang=include.lang variant=include.variant locale_href=include.locale_href %}\n{% endcase %}\n""",
    )


def create_portfolio_include() -> None:
    write(
        "_includes/footer-system/portfolio.html",
        """{% assign footer_lang = include.lang | default: 'en' %}\n{% assign footer_variant = include.variant | default: 'case' %}\n{% assign footer_copy = site.data.footer[footer_lang] %}\n{% assign portfolio_copy = footer_copy.portfolio[footer_variant] %}\n\n<footer class=\"site-footer site-footer--portfolio site-footer--portfolio-{{ footer_variant }}\" data-footer-family=\"portfolio\" data-footer-variant=\"{{ footer_variant }}\">\n  <div class=\"site-footer__shell\">\n    <div class=\"site-footer__main\">\n      <div class=\"site-footer__cta site-footer__portfolio-closing\" role=\"group\" aria-labelledby=\"site-footer-title-{{ footer_lang }}-portfolio-{{ footer_variant }}\">\n        <p class=\"site-footer__eyebrow\">{{ portfolio_copy.eyebrow }}</p>\n        <h2 id=\"site-footer-title-{{ footer_lang }}-portfolio-{{ footer_variant }}\">{{ portfolio_copy.title }}</h2>\n        <p class=\"site-footer__summary\">{{ portfolio_copy.summary }}</p>\n        <a class=\"site-footer__primary-action\" href=\"{{ portfolio_copy.action_href }}\">{{ portfolio_copy.action_label }} <span aria-hidden=\"true\">→</span></a>\n      </div>\n\n      <div class=\"site-footer__details\">\n        <nav class=\"site-footer__detail-group site-footer__services\" aria-label=\"{{ portfolio_copy.navigation_title }}\">\n          <h3>{{ portfolio_copy.navigation_title }}</h3>\n          {% if portfolio_copy.show_back %}\n          <a href=\"{{ portfolio_copy.back_href }}\">{{ portfolio_copy.back_label }}</a>\n          {% endif %}\n          {% for service in footer_copy.services limit: 2 %}\n          <a href=\"{{ service.href }}\">{{ service.label }}</a>\n          {% endfor %}\n        </nav>\n\n        <div class=\"site-footer__detail-group\" role=\"group\" aria-labelledby=\"site-footer-contact-{{ footer_lang }}-portfolio-{{ footer_variant }}\">\n          <h3 id=\"site-footer-contact-{{ footer_lang }}-portfolio-{{ footer_variant }}\">{{ footer_copy.contact_title }}</h3>\n          <a href=\"mailto:hello@proai-expert.com\">hello@proai-expert.com</a>\n          {% if footer_lang == 'ru' %}\n          <a href=\"https://t.me/proAiexpert\" target=\"_blank\" rel=\"noopener noreferrer\">Telegram <span aria-hidden=\"true\">↗</span></a>\n          {% endif %}\n        </div>\n      </div>\n    </div>\n\n    {% include footer-system/brand-zone.html %}\n    {% include footer-system/bottom.html lang=footer_lang locale_href=include.locale_href %}\n  </div>\n</footer>\n""",
    )


def update_footer_data() -> None:
    path = "_data/footer.yml"
    text = read(path)
    if "\nru:\n" not in text:
        raise RuntimeError("_data/footer.yml: missing ru language block")

    en_part, ru_part = text.split("\nru:\n", 1)

    en_block = """  portfolio:\n    archive:\n      eyebrow: SELECTED WORK\n      title: Continue from evidence to the next system.\n      summary: Explore the capabilities behind the work or begin with a concise description of the business problem.\n      action_label: Discuss your project\n      action_href: /contact/#project-intake\n      navigation_title: Explore related paths\n      show_back: false\n      back_label: All case studies\n      back_href: /case-studies/\n    case:\n      eyebrow: NEXT PROJECT\n      title: Apply the same discipline to the next business priority.\n      summary: Return to the case-study archive, explore the relevant capability, or start with a concise project brief.\n      action_label: Discuss your project\n      action_href: /contact/#project-intake\n      navigation_title: Continue\n      show_back: true\n      back_label: All case studies\n      back_href: /case-studies/\n"""

    ru_block = """  portfolio:\n    archive:\n      eyebrow: ИЗБРАННЫЕ РАБОТЫ\n      title: От доказательств — к следующей рабочей системе.\n      summary: Изучите направления, которые стоят за проектами, или начните с краткого описания бизнес-задачи.\n      action_label: Обсудить проект\n      action_href: /ru/contact/#project-intake\n      navigation_title: Связанные направления\n      show_back: false\n      back_label: Все кейсы\n      back_href: /ru/case-studies/\n    case:\n      eyebrow: СЛЕДУЮЩИЙ ПРОЕКТ\n      title: Применим ту же дисциплину к следующему приоритету бизнеса.\n      summary: Вернитесь к архиву кейсов, изучите подходящее направление или начните с краткого описания проекта.\n      action_label: Обсудить проект\n      action_href: /ru/contact/#project-intake\n      navigation_title: Продолжить\n      show_back: true\n      back_label: Все кейсы\n      back_href: /ru/case-studies/\n"""

    if "\n  portfolio:\n" not in en_part:
        en_part = en_part.rstrip() + "\n" + en_block.rstrip() + "\n"
    if "\n  portfolio:\n" not in ("\n" + ru_part):
        ru_part = ru_part.rstrip() + "\n" + ru_block.rstrip() + "\n"

    write(path, en_part + "\nru:\n" + ru_part.lstrip("\n"))


def update_footer_css() -> None:
    path = "assets/css/footer-system-v1.css"
    text = read(path)
    text = text.replace(
        "/* Footer System V1 — Commercial secondary pages.\n   Build-time component ownership. No runtime injection and no legacy footer selectors. */",
        "/* Footer System V1 — shared Commercial and Portfolio families.\n   Build-time component ownership. No runtime injection and no legacy footer selectors. */",
        1,
    )

    marker = "/* Footer System V1 — Portfolio family. */"
    if marker not in text:
        text = text.rstrip() + "\n\n" + """/* Footer System V1 — Portfolio family. */\n.site-footer--portfolio {\n  background:\n    radial-gradient(circle at 72% 0%,rgba(93,226,255,.045),transparent 28%),\n    linear-gradient(180deg,rgba(255,255,255,.01),rgba(255,255,255,.003));\n}\n.site-footer--portfolio .site-footer__summary { max-width: 620px; }\n.site-footer--portfolio .site-footer__brand-zone {\n  min-block-size: clamp(104px,9vw,156px);\n  margin-top: clamp(42px,5vw,68px);\n}\n.site-footer--portfolio .site-footer__watermark {\n  font-size: clamp(72px,10.4vw,174px);\n  color: rgba(255,255,255,.038);\n}\n@media (min-width:981px) {\n  .site-footer--portfolio .site-footer__shell { padding-top: clamp(58px,6vw,88px); }\n  .site-footer--portfolio .site-footer__main {\n    grid-template-columns: minmax(0,1.08fr) minmax(360px,.92fr);\n    gap: clamp(54px,6vw,92px);\n  }\n  .site-footer--portfolio .site-footer__cta h2 {\n    max-width: 15ch;\n    font-size: clamp(38px,4.4vw,64px);\n    line-height: 1;\n  }\n}\n@media (max-width:700px) {\n  .site-footer--portfolio .site-footer__cta h2 {\n    max-width: 13ch;\n    font-size: clamp(36px,10.6vw,50px);\n  }\n  .site-footer--portfolio .site-footer__brand-zone {\n    min-block-size: 76px;\n    margin-top: 34px;\n  }\n  .site-footer--portfolio .site-footer__watermark {\n    width: 100%;\n    max-width: 100%;\n    font-size: clamp(38px,11.2vw,52px);\n  }\n}\n@media (max-height:540px) and (orientation:landscape) {\n  .site-footer--portfolio .site-footer__cta h2 {\n    max-width: 16ch;\n    font-size: clamp(31px,5.7vw,43px);\n  }\n  .site-footer--portfolio .site-footer__brand-zone {\n    min-block-size: 62px;\n    margin-top: 24px;\n  }\n  .site-footer--portfolio .site-footer__watermark {\n    width: auto;\n    max-width: none;\n    font-size: clamp(46px,8.8vw,68px);\n  }\n}\n"""
    write(path, text)


def update_deploy_workflow() -> None:
    path = ".github/workflows/deploy-pages.yml"
    text = read(path)
    marker = "      - name: Verify Portfolio Footer generated output\n"
    if marker in text:
        return

    insertion_point = "      - name: Upload generated site artifact\n"
    if insertion_point not in text:
        raise RuntimeError("deploy-pages.yml: upload step marker not found")

    step = """      - name: Verify Portfolio Footer generated output\n        shell: bash\n        run: |\n          python - <<'PY'\n          from pathlib import Path\n\n          routes = {\n              'case-studies/index.html': ('en', '/ru/case-studies/'),\n              'ru/case-studies/index.html': ('ru', '/case-studies/'),\n              'case-studies/financial-stream/index.html': ('en', '/ru/case-studies/financial-stream/'),\n              'ru/case-studies/financial-stream/index.html': ('ru', '/case-studies/financial-stream/'),\n              'case-studies/alina-horb/index.html': ('en', '/ru/case-studies/alina-horb/'),\n              'ru/case-studies/alina-horb/index.html': ('ru', '/case-studies/alina-horb/'),\n              'case-studies/local-repair-pro/index.html': ('en', '/ru/case-studies/local-repair-pro/'),\n              'ru/case-studies/local-repair-pro/index.html': ('ru', '/case-studies/local-repair-pro/'),\n          }\n\n          for route, (lang, locale_href) in routes.items():\n              output = Path('_site') / route\n              text = output.read_text(encoding='utf-8')\n              assert text.count('data-footer-family=\"portfolio\"') == 1, route\n              assert text.count('site-footer__brand-zone') == 1, route\n              assert text.count('site-footer__watermark') == 1, route\n              assert '{% include footer-system/' not in text, route\n              assert '{{ footer_' not in text, route\n              assert 'portfolio-footer-compact-v1.css' not in text, route\n              assert 'https://github.com/proaiexpert' in text, route\n              assert f'href=\"{locale_href}\"' in text, route\n              if lang == 'en':\n                  assert 'https://t.me/proAiexpert' not in text, route\n              else:\n                  assert 'https://t.me/proAiexpert' in text, route\n          print('Portfolio Footer generated output verified for 8 routes.')\n          PY\n\n"""
    write(path, text.replace(insertion_point, step + insertion_point, 1))


def remove_redirect_legacy_reference() -> None:
    redirect = ROOT / "ru/case-studies/proai-expert/index.html"
    if redirect.exists():
        text = redirect.read_text(encoding="utf-8")
        cleaned = LEGACY_STYLESHEET_RE.sub("", text)
        if cleaned != text:
            redirect.write_text(cleaned, encoding="utf-8")


def remove_legacy_stylesheet_if_unreferenced() -> None:
    references: list[str] = []
    for candidate in ROOT.rglob("*.html"):
        if ".git" in candidate.parts or "_site" in candidate.parts:
            continue
        try:
            text = candidate.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        if "portfolio-footer-compact-v1.css" in text:
            references.append(str(candidate.relative_to(ROOT)))

    if references:
        raise RuntimeError("Legacy Portfolio stylesheet is still referenced by: " + ", ".join(references))

    legacy = ROOT / "assets/css/portfolio-footer-compact-v1.css"
    if legacy.exists():
        legacy.unlink()


def verify_source_contract() -> None:
    dispatcher = read("_includes/footer-system/footer.html")
    portfolio = read("_includes/footer-system/portfolio.html")
    social = read("_data/social-links.yml")

    assert "when 'portfolio'" in dispatcher
    assert 'data-footer-family="portfolio"' in portfolio
    assert "footer-system/brand-zone.html" in portfolio
    assert "footer-system/bottom.html" in portfolio
    assert "github:" in social
    assert "telegram:" in social

    for path, config in TARGETS.items():
        text = read(path)
        assert text.startswith("---\n---\n"), path
        assert text.count("{% include footer-system/footer.html") == 1, path
        assert f'lang="{config["lang"]}"' in text, path
        assert f'variant="{config["variant"]}"' in text, path
        assert f'locale_href="{config["locale_href"]}"' in text, path
        assert "footer-system-v1.css" in text, path
        assert "portfolio-footer-compact-v1.css" not in text, path
        assert not FOOTER_RE.search(text), path


def remove_temporary_harness() -> None:
    for path in (
        ROOT / ".github/scripts/migrate_portfolio_footer.py",
        ROOT / ".github/workflows/migrate-portfolio-footer-pr4.yml",
    ):
        if path.exists():
            path.unlink()


def main() -> None:
    report: list[dict[str, object]] = []
    for path, config in TARGETS.items():
        report.append(migrate_page(path, config))

    update_dispatcher()
    create_portfolio_include()
    update_footer_data()
    update_footer_css()
    update_deploy_workflow()
    remove_redirect_legacy_reference()
    remove_legacy_stylesheet_if_unreferenced()
    verify_source_contract()

    write("portfolio-footer-migration-report.json", json.dumps(report, indent=2, ensure_ascii=False) + "\n")
    remove_temporary_harness()

    print("Portfolio Footer migration prepared for 8 routes.")
    for item in report:
        print(f"- {item['path']}: {item['lang']} / {item['variant']}")


if __name__ == "__main__":
    main()
