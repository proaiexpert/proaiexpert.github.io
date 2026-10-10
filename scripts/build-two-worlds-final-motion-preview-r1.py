"""Build standalone, source-derived owner previews without a Jekyll runtime."""

from html import escape
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "owner-preview" / "two-worlds-final-motion-r1"

NAV = {
    "en": [
        ("AI Systems", "/ai-systems/"),
        ("Websites & Branding", "/websites-branding/"),
        ("Case Studies", "/case-studies/"),
        ("About", "/about/"),
        ("Insights", "/insights/"),
        ("Contact", "/contact/"),
    ],
    "ru": [
        ("AI-системы", "/ru/ai-systems/"),
        ("Сайты и брендинг", "/ru/websites-branding/"),
        ("Кейсы", "/ru/case-studies/"),
        ("О нас", "/ru/about/"),
        ("Материалы", "/ru/insights/"),
        ("Контакты", "/ru/contact/"),
    ],
}


def include(name: str) -> str:
    return (ROOT / "_includes" / name).read_text(encoding="utf-8")


def header(lang: str) -> str:
    source = include("header-system/header.html")
    source = source[source.index("<header ") :]
    nav = "\n".join(
        f'<a class="site-header__nav-link{(" site-header__nav-link--mobile-only" if index == 5 else "")}" href="{url}">{escape(label)}</a>'
        for index, (label, url) in enumerate(NAV[lang])
    )
    source = re.sub(r"{% for item in header_nav.items %}.*?{% endfor %}", nav, source, flags=re.S)
    words = {
        "header_variant": "standard",
        "header_home": "/ru/" if lang == "ru" else "/",
        "header_brand_label": "Главная страница ProAI Expert" if lang == "ru" else "ProAI Expert homepage",
        "header_nav.aria_label": "Основная навигация" if lang == "ru" else "Primary navigation",
        "header_lang": lang,
        "header_cta.url": "/ru/contact/#project-intake" if lang == "ru" else "/contact/#project-intake",
        "header_cta.label": "Обсудить проект" if lang == "ru" else "Discuss Project",
        "header_locale_url": "/" if lang == "ru" else "/ru/",
        "header_locale.lang": "en" if lang == "ru" else "ru",
        "header_locale.label": "EN" if lang == "ru" else "RU",
        "header_menu_label": "Открыть меню" if lang == "ru" else "Open menu",
        "header_close_label": "Закрыть меню" if lang == "ru" else "Close menu",
    }
    for key, value in words.items():
        source = source.replace("{{ " + key + " }}", escape(value, quote=True))
    return source


def technology(lang: str) -> str:
    source = include("home-technology-fold-flow-r1-5-1.html")
    before, body = source.split("{% endif %}", 1)
    ru, en = before.split("{% else %}", 1)
    selected = ru if lang == "ru" else en
    values = dict(re.findall(r"{% assign (ff_\w+) = '([^']*)' %}", selected))
    values["ff_lang"] = lang
    for key, value in values.items():
        body = body.replace("{{ " + key + " }}", escape(value))
    return body


def page(lang: str, variant: str) -> str:
    source = (ROOT / ("ru/index.html" if lang == "ru" else "index.html")).read_text(encoding="utf-8")
    source = re.sub(r"\A---\s*.*?\s*---\s*", "", source, count=1, flags=re.S)
    head = source[: source.index("</head>") + len("</head>")]
    head = head.replace("</head>", '<meta name="robots" content="noindex,nofollow">\n</head>')
    head = head.replace("<title>", f"<title>{variant.upper()} preview · ", 1)
    if variant == "d1":
        head = head.replace(
            "</head>",
            '<link rel="stylesheet" href="/assets/css/homepage-two-worlds-final-motion-d1.css?v=1">\n</head>',
        )

    body_tag = re.search(r"<body[^>]*>", source).group(0)
    skip = re.search(r"<a class=\"skip-link\"[^>]*>.*?</a>", source).group(0)
    hero = re.search(r'<section id="hero">.*?</section>', source, flags=re.S).group(0)
    connected = include(f"homepage-connected-system-r142-{lang}.html")
    worlds = include(f"homepage-two-worlds-r5-{lang}.html")
    next_section = include(f"home-work-proof-financial-stream-r1-4-{lang}.html")
    scripts = "\n".join(re.findall(r"<script\b[^>]*src=[^>]*></script>", source))
    if variant == "m1":
        scripts = scripts.replace(
            "/assets/js/homepage-two-worlds-r5.js?v=r5-r32-production-r1",
            "/assets/js/homepage-two-worlds-final-motion-m1.js?v=1",
        )
    document = "\n".join(
        [
            head,
            body_tag,
            skip,
            header(lang),
            '<main id="main-content" tabindex="-1">',
            hero,
            connected,
            worlds,
            technology(lang),
            next_section,
            "</main>",
            scripts,
            "</body>",
            "</html>",
        ]
    )
    if re.search(r"{%|{{", document):
        raise ValueError(f"Unrendered Liquid in {variant}/{lang}")
    return document


def main() -> None:
    for variant in ("d0", "d1", "m0", "m1"):
        for lang in ("en", "ru"):
            target = OUT / variant / lang / "index.html"
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(page(lang, variant), encoding="utf-8")

    links = "\n".join(
        f'<tr><th>{name}</th><td><a href="./{name}/en/">EN</a></td><td><a href="./{name}/ru/">RU</a></td></tr>'
        for name in ("d0", "d1", "m0", "m1")
    )
    index = f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Two Worlds R1 owner comparison</title><style>body{{font:16px/1.5 Inter,system-ui,sans-serif;max-width:700px;margin:8vh auto;padding:0 24px;background:#090d12;color:#f3f1eb}}table{{border-collapse:collapse;width:100%;margin-top:30px}}td,th{{border-bottom:1px solid #414851;padding:14px;text-align:left}}a{{color:#c9d9ff}}small{{color:#a7adb7}}</style></head><body><h1>Two Worlds · Final Motion R1</h1><p>D0/M0: production R3.2 controls. D1: desktop fold timing. M1: mobile turn density. EN/RU pages contain the same homepage chapter context.</p><table><tr><th>Version</th><th>English</th><th>Русский</th></tr>{links}</table><p><small>Owner review preview · no production release</small></p></body></html>"""
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "index.html").write_text(index, encoding="utf-8")


if __name__ == "__main__":
    main()
