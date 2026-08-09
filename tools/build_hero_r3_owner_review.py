from __future__ import annotations

import base64
import hashlib
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "PROAI_HERO_R3_OWNER_REVIEW.html"
SOURCE_SHA = "60d5261cbdab32608a9aa8a7c78a2f369f02e713"
TRANSPARENT_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="


def b64_bytes(path: str) -> str:
    return base64.b64encode((ROOT / path).read_bytes()).decode("ascii")


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def env_avif_b64() -> str:
    chunks = []
    for name in ("env-avif-01.b64", "env-avif-02.b64", "env-avif-03.b64"):
        chunks.append("".join(read(f"_includes/hero-c-shape-r2/{name}").split()))
    value = "".join(chunks)
    raw = base64.b64decode(value, validate=True)
    assert len(raw) == 13594, len(raw)
    assert sha256(raw) == "d33c64906bb89551204fa6044d478da403fd2b58c76e2e4b2b695abda7fee608"
    return value


def core_avif_b64() -> str:
    raw = (ROOT / "assets/img/hero-c-shape/core-static-master-isolated.avif").read_bytes()
    assert len(raw) == 48100, len(raw)
    assert sha256(raw) == "c6cc0ba89b7145bdbd796b7fd778e6c788133d3e278265947b7ce90793e458d8"
    return base64.b64encode(raw).decode("ascii")


def combined_css(font_b64: str) -> str:
    parts = [
        read("assets/css/header-system-v1.css"),
        read("assets/css/hero-c-shape-a-plus.css"),
        read("assets/css/hero-c-shape-grounding-r2.css"),
        read("assets/css/hero-c-shape-owner-candidate-r3.css"),
    ]
    css = "\n\n".join(parts)
    css = css.replace(
        "/assets/fonts/inter-variable-latin.woff2",
        f"data:font/woff2;base64,{font_b64}",
    )
    css = css.replace("/assets/img/hero-c-shape/scene-grounded-static-master.avif", TRANSPARENT_GIF)
    css = css.replace("/assets/img/hero-c-shape/scene-grounded-static-master-mobile.avif", TRANSPARENT_GIF)
    return css


def header_markup(lang: str) -> str:
    if lang == "en":
        nav = ["AI Systems", "Websites & Branding", "Case Studies", "About", "Insights", "Contact"]
        locale = "RU"
        locale_target = "ru"
        cta = "Discuss Project"
        aria = "Primary navigation"
        home = "ProAI Expert home"
        menu_open = "Open menu"
        menu_close = "Close menu"
    else:
        nav = ["AI-системы", "Сайты и брендинг", "Кейсы", "О нас", "Материалы", "Контакты"]
        locale = "EN"
        locale_target = "en"
        cta = "Обсудить проект"
        aria = "Основная навигация"
        home = "Главная страница ProAI Expert"
        menu_open = "Открыть меню"
        menu_close = "Закрыть меню"
    nav_html = "".join(f'<a href="#">{html.escape(item)}</a>' for item in nav)
    return f'''<header class="site-header site-header--standard" data-site-header>
  <div class="site-header__shell">
    <a class="site-header__brand" href="#" aria-label="{html.escape(home)}">
      <span class="site-header__cube-wrap" aria-hidden="true"><span class="site-header__cube">
        <span class="site-header__cube-face site-header__cube-face--front"></span><span class="site-header__cube-face site-header__cube-face--back"></span><span class="site-header__cube-face site-header__cube-face--right"></span><span class="site-header__cube-face site-header__cube-face--left"></span><span class="site-header__cube-face site-header__cube-face--top"></span><span class="site-header__cube-face site-header__cube-face--bottom"></span>
      </span></span>
      <span class="site-header__wordmark">PROAI <strong>EXPERT</strong></span>
    </a>
    <nav class="site-header__nav" aria-label="{html.escape(aria)}" id="site-header-navigation-{lang}">{nav_html}</nav>
    <div class="site-header__actions">
      <a class="site-header__locale" href="#" data-review-locale="{locale_target}" lang="{locale_target}">{locale}</a>
      <a class="site-header__cta" href="#">{html.escape(cta)}</a>
      <button class="site-header__menu-toggle" type="button" aria-expanded="false" aria-controls="site-header-navigation-{lang}" aria-label="{html.escape(menu_open)}" data-open-label="{html.escape(menu_open)}" data-close-label="{html.escape(menu_close)}"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>'''


def hero_markup(lang: str, environment: str, core: str) -> str:
    if lang == "en":
        skip = "Skip to main content"
        eyebrow = "AI SYSTEMS · AUTOMATION · PREMIUM WEBSITES"
        h1a = "From first impression to follow-through —"
        h1b = "one connected system."
        lead = "We build premium websites for service businesses and connect them with AI systems and automation. Customers can understand your services and reach out with the right information; you can respond faster and spend less time on repetitive work. You stay in control where judgment matters."
        primary = "Request a Private Review"
        micro = "Briefly describe the challenge. We’ll recommend where to start."
        secondary = "View Work"
        accountability = 'Washington-based <span aria-hidden="true">·</span> Working across the U.S. <span aria-hidden="true">·</span> EN / RU / UA'
        sr = "Customer and business journey: 01 TRUST. 02 INQUIRY. 03 RESPONSE. 04 OUTCOME."
        rail = ["TRUST", "INQUIRY", "RESPONSE", "OUTCOME"]
        blocker = "APPROVED GROUNDED R2 ASSETS REQUIRED"
    else:
        skip = "Перейти к содержанию"
        eyebrow = "AI-СИСТЕМЫ · АВТОМАТИЗАЦИЯ · ПРЕМИАЛЬНЫЕ САЙТЫ"
        h1a = "От первого впечатления до результата —"
        h1b = "одна система."
        lead = "Создаём премиальные сайты для компаний в сфере услуг и соединяем их с AI-системами и автоматизацией. Клиенту проще понять ваши услуги и обратиться, а вам — получать нужную информацию, быстрее отвечать и тратить меньше времени на повторяющиеся задачи. Важные решения остаются за человеком."
        primary = "Запросить разбор"
        micro = "Коротко опишите задачу. Мы предложим, с чего разумнее начать."
        secondary = "Смотреть проекты"
        accountability = 'Штат Вашингтон <span aria-hidden="true">·</span> Работаем по всей США <span aria-hidden="true">·</span> EN / RU / UA'
        sr = "Путь клиента и бизнеса: 01 ДОВЕРИЕ. 02 ОБРАЩЕНИЕ. 03 ОТВЕТ. 04 РЕЗУЛЬТАТ."
        rail = ["ДОВЕРИЕ", "ОБРАЩЕНИЕ", "ОТВЕТ", "РЕЗУЛЬТАТ"]
        blocker = "ТРЕБУЮТСЯ УТВЕРЖДЁННЫЕ GROUNDED R2 ASSETS"
    rail_html = "".join(f'<li class="hero-cshape__rail-item"><span>{i:02d}</span><strong>{html.escape(label)}</strong></li>' for i, label in enumerate(rail, 1))
    return f'''<a class="hero-cshape-skip" href="#main-content-{lang}">{skip}</a>
{header_markup(lang)}
<main id="main-content-{lang}" tabindex="-1">
<section class="hero-cshape" aria-labelledby="hero-cshape-title-{lang}">
  <div class="hero-cshape__shell">
    <div class="hero-cshape__copy">
      <p class="hero-cshape__eyebrow">{eyebrow}</p>
      <h1 class="hero-cshape__title" id="hero-cshape-title-{lang}"><span>{h1a}</span><span>{h1b}</span></h1>
      <p class="hero-cshape__lead">{lead}</p>
      <div class="hero-cshape__actions">
        <div class="hero-cshape__primary-action">
          <a class="hero-cshape__button hero-cshape__button--primary" href="#"><span>{primary}</span><span class="hero-cshape__button-arrow" aria-hidden="true">↗</span></a>
          <p class="hero-cshape__expectation">{micro}</p>
        </div>
        <a class="hero-cshape__button hero-cshape__button--secondary" href="#"><span>{secondary}</span><span aria-hidden="true">→</span></a>
      </div>
      <p class="hero-cshape__accountability">{accountability}</p>
    </div>
    <div class="hero-cshape__visual" data-core-stage>
      <p class="hero-cshape__sr-only">{sr}</p>
      <div class="hero-cshape__scene"><div class="hero-cshape__registration" aria-hidden="true">
        <picture class="hero-cshape__layer hero-cshape__layer--environment"><img data-ground-layer-image data-ground-layer="environment" width="735" height="780" alt="" decoding="async" src="data:image/avif;base64,{environment}"></picture>
        <picture class="hero-cshape__layer hero-cshape__layer--core"><img data-ground-layer-image data-ground-layer="core" width="900" height="760" alt="" decoding="async" fetchpriority="high" src="data:image/avif;base64,{core}"></picture>
      </div></div>
      <ol class="hero-cshape__rail" aria-hidden="true">{rail_html}</ol>
      <div class="hero-cshape__asset-blocker" data-core-asset-blocker hidden><strong>{blocker}</strong></div>
    </div>
  </div>
</section>
</main>'''


def main() -> None:
    env = env_avif_b64()
    core = core_avif_b64()
    font = b64_bytes("assets/fonts/inter-variable-latin.woff2")
    css = combined_css(font)
    hero_js = read("assets/js/hero-c-shape-a-plus.js")
    header_js = read("assets/js/header-system-v1.js")

    standalone_css = '''
.review-locale[hidden] { display: none !important; }
html, body { width: 100%; min-width: 0; }
body { min-height: 100vh; }
@media (max-width: 900px) { .review-locale { min-height: 100vh; } }
'''

    locale_js = r'''
(() => {
  'use strict';
  const views = [...document.querySelectorAll('[data-review-view]')];
  const show = (lang) => {
    views.forEach(v => v.hidden = v.dataset.reviewView !== lang);
    document.documentElement.lang = lang;
    document.body.classList.toggle('hero-cshape-page--en', lang === 'en');
    document.body.classList.toggle('hero-cshape-page--ru', lang === 'ru');
    document.title = `ProAI Expert — Hero R3 Owner Review — ${lang.toUpperCase()}`;
    document.querySelectorAll('.site-header__nav.is-open').forEach(n => n.classList.remove('is-open'));
    document.querySelectorAll('.site-header__menu-toggle[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
    document.body.classList.remove('menu-open');
    window.scrollTo({top: 0, left: 0, behavior: 'instant'});
  };
  document.addEventListener('click', (event) => {
    const switcher = event.target.closest('[data-review-locale]');
    if (switcher) { event.preventDefault(); show(switcher.dataset.reviewLocale); return; }
    const deadLink = event.target.closest('a[href="#"]');
    if (deadLink) event.preventDefault();
  });
  show('en');
})();
'''

    doc = f'''<!doctype html>
<html lang="en" class="hero-cshape-has-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<meta name="generator" content="ProAI Expert Hero R3 standalone owner review from {SOURCE_SHA}">
<title>ProAI Expert — Hero R3 Owner Review — EN</title>
<style>{css}\n{standalone_css}</style>
</head>
<body class="hero-cshape-page hero-cshape-page--en">
<div class="review-locale" data-review-view="en">{hero_markup('en', env, core)}</div>
<div class="review-locale" data-review-view="ru" hidden>{hero_markup('ru', env, core)}</div>
<script>{header_js}</script>
<script>{hero_js}</script>
<script>{locale_js}</script>
</body>
</html>'''

    # Standalone hard gates: no file://-breaking site asset references and exact embedded raster payloads.
    for forbidden in ('src="/assets/', 'srcset="/assets/', 'href="/assets/', 'url("/assets/', "url('/assets/"):
        assert forbidden not in doc, forbidden
    data_images = re.findall(r'data:image/avif;base64,([A-Za-z0-9+/=]+)', doc)
    assert len(data_images) == 4, len(data_images)
    decoded = [base64.b64decode(x, validate=True) for x in data_images]
    assert [len(x) for x in decoded] == [13594, 48100, 13594, 48100]
    assert sha256(decoded[0]) == "d33c64906bb89551204fa6044d478da403fd2b58c76e2e4b2b695abda7fee608"
    assert sha256(decoded[1]) == "c6cc0ba89b7145bdbd796b7fd778e6c788133d3e278265947b7ce90793e458d8"
    assert "From first impression to follow-through —" in doc
    assert "От первого впечатления до результата —" in doc
    OUT.write_text(doc, encoding="utf-8")
    print(f"Wrote {OUT.name}: {OUT.stat().st_size} bytes")
    print("Embedded Core: 48,100 bytes / SHA-256 verified")
    print("Embedded environment: 13,594 bytes / SHA-256 verified")


if __name__ == "__main__":
    main()
