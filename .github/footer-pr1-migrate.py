from __future__ import annotations

import hashlib
import json
import re
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PAGES = {
    "about/index.html": ("en", "about", "/ru/about/"),
    "ru/about/index.html": ("ru", "about", "/about/"),
    "contact/index.html": ("en", "contact", "/ru/contact/"),
    "ru/contact/index.html": ("ru", "contact", "/contact/"),
    "ai-systems/index.html": ("en", "service", "/ru/ai-systems/"),
    "ru/ai-systems/index.html": ("ru", "service", "/ai-systems/"),
    "websites-branding/index.html": ("en", "service", "/ru/websites-branding/"),
    "ru/websites-branding/index.html": ("ru", "service", "/websites-branding/"),
}

NEW_FILES = {
    "_includes/footer-system/footer.html": r'''{% include footer-system/commercial.html lang=include.lang variant=include.variant locale_href=include.locale_href %}
''',
    "_includes/footer-system/commercial.html": r'''{% assign footer_lang = include.lang | default: 'en' %}
{% assign footer_variant = include.variant | default: 'service' %}
{% assign footer_copy = site.data.footer[footer_lang] %}
{% assign variant_copy = footer_copy.variants[footer_variant] %}

<footer class="site-footer site-footer--commercial site-footer--{{ footer_variant }}" data-footer-family="commercial" data-footer-variant="{{ footer_variant }}">
  <div class="site-footer__shell">
    <div class="site-footer__main">
      <div class="site-footer__cta" role="group" aria-labelledby="site-footer-title-{{ footer_lang }}-{{ footer_variant }}">
        <p class="site-footer__eyebrow">{{ variant_copy.eyebrow }}</p>
        <h2 id="site-footer-title-{{ footer_lang }}-{{ footer_variant }}">{{ variant_copy.title }}</h2>
        <p class="site-footer__summary">{{ variant_copy.summary }}</p>
        {% if variant_copy.show_action %}
        <a class="site-footer__primary-action" href="{{ footer_copy.action_href }}">{{ variant_copy.action_label }} <span aria-hidden="true">→</span></a>
        {% endif %}
      </div>

      <div class="site-footer__details">
        <div class="site-footer__detail-group" role="group" aria-labelledby="site-footer-contact-{{ footer_lang }}-{{ footer_variant }}">
          <h3 id="site-footer-contact-{{ footer_lang }}-{{ footer_variant }}">{{ footer_copy.contact_title }}</h3>
          <a href="mailto:hello@proai-expert.com">hello@proai-expert.com</a>
          {% if footer_lang == 'ru' %}
          <a href="https://t.me/proAiexpert" target="_blank" rel="noopener noreferrer">Telegram <span aria-hidden="true">↗</span></a>
          {% endif %}
        </div>

        <nav class="site-footer__detail-group site-footer__services" aria-label="{{ footer_copy.services_title }}">
          <h3>{{ footer_copy.services_title }}</h3>
          {% for service in footer_copy.services %}
          <a href="{{ service.href }}">{{ service.label }}</a>
          {% endfor %}
        </nav>
      </div>
    </div>

    {% include footer-system/brand-zone.html %}
    {% include footer-system/bottom.html lang=footer_lang locale_href=include.locale_href %}
  </div>
</footer>
''',
    "_includes/footer-system/brand-zone.html": r'''<div class="site-footer__brand-zone" aria-hidden="true">
  <span class="site-footer__watermark">PROAI EXPERT</span>
</div>
''',
    "_includes/footer-system/bottom.html": r'''{% assign footer_lang = include.lang | default: 'en' %}
{% assign footer_copy = site.data.footer[footer_lang] %}
{% assign social_data = site.data['social-links'] %}
{% assign social_keys = social_data.by_language[footer_lang] %}
<div class="site-footer__bottom">
  <a class="site-footer__logo" href="{{ footer_copy.home_href }}" aria-label="{{ footer_copy.home_label }}">
    <span>PROAI</span><strong>EXPERT</strong>
  </a>

  <nav class="site-footer__socials" aria-label="{{ footer_copy.social_label }}">
    {% for social_key in social_keys %}
      {% assign social = social_data.profiles[social_key] %}
      <a href="{{ social.href }}" target="_blank" rel="noopener noreferrer" aria-label="{{ social.labels[footer_lang] }}">{{ social.name }}</a>
    {% endfor %}
  </nav>

  <nav class="site-footer__locale" aria-label="{{ footer_copy.locale_label }}">
    <a href="{{ include.locale_href }}" lang="{{ footer_copy.locale_lang }}" hreflang="{{ footer_copy.locale_lang }}">{{ footer_copy.locale_text }}</a>
  </nav>

  <p class="site-footer__copyright">{{ footer_copy.copyright }}</p>
</div>
''',
    "_data/footer.yml": r'''en:
  home_href: /
  home_label: ProAI Expert homepage
  action_href: /contact/#project-intake
  contact_title: Start a conversation
  services_title: Explore
  social_label: ProAI Expert professional profiles
  locale_label: Site language
  locale_text: RU
  locale_lang: ru
  copyright: © 2026 PROAI EXPERT. ALL RIGHTS RESERVED.
  services:
    - label: AI systems and automation
      href: /ai-systems/
    - label: Websites and branding
      href: /websites-branding/
    - label: Case studies
      href: /case-studies/
  variants:
    about:
      eyebrow: STUDIO
      title: Build the next layer with more clarity.
      summary: When operations and presentation need to work as one system, we can define the right next move and keep implementation focused.
      action_label: Discuss your project
      show_action: true
    contact:
      eyebrow: CONTACT
      title: A clear brief is enough to begin.
      summary: Share the business context, the current bottleneck, and the outcome you want. We will identify the most useful next step.
      action_label: Discuss your project
      show_action: false
    service:
      eyebrow: NEXT STEP
      title: Turn the priority into a working system.
      summary: We can scope the first practical phase, connect it to the wider business, and build without unnecessary complexity.
      action_label: Discuss your project
      show_action: true
ru:
  home_href: /ru/
  home_label: Главная страница ProAI Expert
  action_href: /ru/contact/#project-intake
  contact_title: Начать разговор
  services_title: Перейти
  social_label: Профессиональные профили ProAI Expert
  locale_label: Язык сайта
  locale_text: EN
  locale_lang: en
  copyright: © 2026 PROAI EXPERT. ВСЕ ПРАВА ЗАЩИЩЕНЫ.
  services:
    - label: AI-системы и автоматизация
      href: /ru/ai-systems/
    - label: Сайты и брендинг
      href: /ru/websites-branding/
    - label: Кейсы
      href: /ru/case-studies/
  variants:
    about:
      eyebrow: СТУДИЯ
      title: Соберём следующий уровень с большей ясностью.
      summary: Когда процессы и подача бизнеса должны работать как одна система, мы поможем определить правильный следующий шаг и сохранить фокус реализации.
      action_label: Обсудить проект
      show_action: true
    contact:
      eyebrow: КОНТАКТ
      title: Чтобы начать, достаточно ясного описания задачи.
      summary: Опишите контекст бизнеса, текущую проблему и желаемый результат. Мы определим наиболее полезный следующий шаг.
      action_label: Обсудить проект
      show_action: false
    service:
      eyebrow: СЛЕДУЮЩИЙ ШАГ
      title: Превратим приоритет в работающую систему.
      summary: Определим первый практический этап, свяжем его с задачами бизнеса и реализуем без лишней сложности.
      action_label: Обсудить проект
      show_action: true
''',
    "_data/social-links.yml": r'''profiles:
  linkedin:
    name: LinkedIn
    href: https://www.linkedin.com/in/ihorhorb/
    labels:
      en: Ihor Horb on LinkedIn
      ru: Ihor Horb в LinkedIn
  github:
    name: GitHub
    href: https://github.com/proaiexpert
    labels:
      en: ProAI Expert on GitHub
      ru: ProAI Expert на GitHub
  x:
    name: X
    href: https://x.com/proaiexpert
    labels:
      en: ProAI Expert on X
      ru: ProAI Expert в X
  telegram:
    name: Telegram
    href: https://t.me/proAiexpert
    labels:
      en: ProAI Expert on Telegram
      ru: ProAI Expert в Telegram
by_language:
  en:
    - linkedin
    - github
    - x
  ru:
    - linkedin
    - github
    - x
    - telegram
''',
    "assets/css/footer-system-v1.css": r'''/* Footer System V1 — Commercial secondary pages.
   Build-time component ownership. No runtime injection and no legacy .f-* selectors. */
.site-footer {
  --footer-accent: #5de2ff;
  --footer-border: rgba(255,255,255,.09);
  --footer-muted: rgba(255,255,255,.58);
  position: relative !important;
  z-index: 1;
  overflow: hidden !important;
  padding: 0 !important;
  border-top: 1px solid var(--footer-border) !important;
  background:
    radial-gradient(circle at 50% 0%,rgba(93,226,255,.055),transparent 30%),
    linear-gradient(180deg,rgba(255,255,255,.012),rgba(255,255,255,.004));
}
.site-footer::before,
.site-footer::after { content: none !important; }
.site-footer__shell {
  width: min(100%,1600px);
  margin: 0 auto;
  padding: clamp(72px,8vw,118px) 40px 38px;
}
.site-footer__main {
  display: grid;
  grid-template-columns: minmax(0,1.16fr) minmax(360px,.84fr);
  gap: clamp(62px,7vw,112px);
  align-items: start;
}
.site-footer__eyebrow,
.site-footer__detail-group h3 {
  margin: 0 0 16px;
  color: rgba(173,238,255,.9);
  font-family: monospace;
  font-size: 10px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: .17em;
  text-transform: uppercase;
}
.site-footer__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.site-footer__eyebrow::before {
  content: "";
  width: 38px;
  height: 1px;
  background: linear-gradient(90deg,rgba(93,226,255,.96),rgba(93,226,255,.12));
  box-shadow: 0 0 14px rgba(93,226,255,.24);
}
.site-footer__cta { min-width: 0; }
.site-footer__cta h2 {
  max-width: 12ch;
  margin: 0;
  color: #fff;
  font-size: clamp(42px,5vw,78px);
  font-weight: 900;
  line-height: .98;
  letter-spacing: -.055em;
  text-wrap: balance;
}
.site-footer__summary {
  max-width: 660px;
  margin: 24px 0 30px;
  color: var(--footer-muted);
  font-size: 16px;
  line-height: 1.72;
}
.site-footer__primary-action {
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
  border: 1px solid rgba(93,226,255,.46);
  border-radius: 6px;
  color: #fff;
  background: rgba(93,226,255,.06);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
  text-decoration: none;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
  transition: background .28s ease,border-color .28s ease,box-shadow .28s ease,transform .28s ease;
}
.site-footer__primary-action:hover,
.site-footer__primary-action:focus-visible {
  border-color: rgba(93,226,255,.76);
  background: rgba(93,226,255,.12);
  box-shadow: 0 0 30px rgba(93,226,255,.12),inset 0 1px 0 rgba(255,255,255,.08);
  transform: translateY(-1px);
}
.site-footer__details {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 44px;
  padding-top: 8px;
}
.site-footer__detail-group {
  display: grid;
  min-width: 0;
  align-content: start;
  justify-items: start;
  gap: 12px;
}
.site-footer__detail-group a,
.site-footer__socials a,
.site-footer__locale a {
  color: rgba(255,255,255,.72);
  text-decoration: none;
  transition: color .24s ease,text-shadow .24s ease;
}
.site-footer__detail-group a {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  font-size: 14px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}
.site-footer__detail-group a:hover,
.site-footer__detail-group a:focus-visible,
.site-footer__socials a:hover,
.site-footer__socials a:focus-visible,
.site-footer__locale a:hover,
.site-footer__locale a:focus-visible {
  color: #fff;
  text-shadow: 0 0 16px rgba(93,226,255,.2);
}
.site-footer a:focus-visible {
  outline: 2px solid var(--footer-accent);
  outline-offset: 5px;
  border-radius: 3px;
}
.site-footer__brand-zone {
  display: grid;
  min-block-size: clamp(142px,13vw,220px);
  place-items: center;
  overflow: clip;
  isolation: isolate;
  margin: clamp(50px,6vw,84px) 0 18px;
  border-top: 1px solid rgba(255,255,255,.045);
  border-bottom: 1px solid rgba(255,255,255,.045);
}
.site-footer__watermark {
  position: static;
  display: block;
  max-inline-size: none;
  color: rgba(255,255,255,.042);
  text-shadow: 0 0 42px rgba(93,226,255,.075);
  font-size: clamp(92px,13.5vw,226px);
  font-weight: 900;
  letter-spacing: -.075em;
  line-height: .82;
  text-align: center;
  text-transform: uppercase;
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
}
.site-footer__bottom {
  display: grid;
  grid-template-columns: auto minmax(0,1fr) auto;
  grid-template-areas: "logo socials locale" "copyright copyright copyright";
  gap: 20px 32px;
  align-items: center;
  padding-top: 20px;
}
.site-footer__logo {
  grid-area: logo;
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 4px;
  color: rgba(255,255,255,.72);
  text-decoration: none;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: -.04em;
}
.site-footer__logo strong { color: var(--footer-accent); font-weight: 900; }
.site-footer__socials {
  grid-area: socials;
  display: flex;
  min-width: 0;
  justify-content: center;
  gap: clamp(20px,2.6vw,38px);
}
.site-footer__socials a,
.site-footer__locale a {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .14em;
  text-transform: uppercase;
}
.site-footer__locale { grid-area: locale; }
.site-footer__locale a {
  min-width: 44px;
  justify-content: center;
  color: var(--footer-accent);
}
.site-footer__copyright {
  grid-area: copyright;
  margin: 0;
  color: rgba(255,255,255,.24);
  font-size: 10px;
  line-height: 1.5;
  letter-spacing: .12em;
  text-align: center;
  text-transform: uppercase;
}
.site-footer--contact .site-footer__main {
  grid-template-columns: minmax(0,1fr) minmax(420px,.82fr);
  gap: clamp(54px,6vw,96px);
}
.site-footer--contact .site-footer__cta h2 {
  max-width: 14ch;
  font-size: clamp(38px,4.4vw,66px);
}
.site-footer--contact .site-footer__brand-zone {
  min-block-size: clamp(112px,10vw,172px);
  margin-top: clamp(40px,5vw,68px);
}
.site-footer--about .site-footer__cta h2 { max-width: 13ch; }
@media (max-width:980px) {
  .site-footer__shell { padding-left: 24px; padding-right: 24px; }
  .site-footer__main,
  .site-footer--contact .site-footer__main { grid-template-columns: 1fr; gap: 50px; }
  .site-footer__cta h2 { max-width: 13ch; }
  .site-footer__details { max-width: 720px; }
}
@media (max-width:700px) {
  .site-footer__shell { padding: 70px 22px calc(30px + env(safe-area-inset-bottom)); }
  .site-footer__main { gap: 42px; }
  .site-footer__eyebrow { gap: 10px; }
  .site-footer__eyebrow::before { width: 30px; }
  .site-footer__cta h2,
  .site-footer--contact .site-footer__cta h2 {
    max-width: 12ch;
    font-size: clamp(38px,11.6vw,56px);
    line-height: 1;
  }
  .site-footer__summary { margin-top: 20px; font-size: 15px; }
  .site-footer__primary-action { width: 100%; }
  .site-footer__details { grid-template-columns: 1fr; gap: 28px; }
  .site-footer__detail-group { padding-top: 22px; border-top: 1px solid rgba(255,255,255,.07); }
  .site-footer__brand-zone,
  .site-footer--contact .site-footer__brand-zone {
    min-block-size: 80px;
    margin: 38px 0 12px;
    overflow: hidden;
  }
  .site-footer__watermark {
    width: 100%;
    max-width: 100%;
    font-size: clamp(40px,11.8vw,54px);
    line-height: .88;
  }
  .site-footer__bottom {
    grid-template-columns: 1fr auto;
    grid-template-areas: "logo locale" "socials socials" "copyright copyright";
    gap: 14px 20px;
  }
  .site-footer__socials { justify-content: flex-start; flex-wrap: wrap; gap: 2px 22px; }
  .site-footer__copyright { text-align: left; }
}
@media (max-height:540px) and (orientation:landscape) {
  .site-footer__shell { padding: 46px 24px 24px; }
  .site-footer__main,
  .site-footer--contact .site-footer__main {
    grid-template-columns: minmax(0,1.08fr) minmax(320px,.92fr);
    gap: 32px;
  }
  .site-footer__cta h2,
  .site-footer--contact .site-footer__cta h2 { max-width: 15ch; font-size: clamp(34px,6.4vw,48px); }
  .site-footer__summary { margin: 16px 0 20px; font-size: 14px; line-height: 1.55; }
  .site-footer__details { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 22px; }
  .site-footer__detail-group a { min-height: 40px; font-size: 13px; }
  .site-footer__brand-zone,
  .site-footer--contact .site-footer__brand-zone { min-block-size: 68px; margin: 28px 0 8px; }
  .site-footer__watermark { width: auto; max-width: none; font-size: clamp(50px,10vw,76px); }
  .site-footer__bottom { gap: 10px 22px; padding-top: 14px; }
}
@media (prefers-reduced-motion:reduce) {
  .site-footer *,
  .site-footer *::before,
  .site-footer *::after {
    scroll-behavior: auto;
    transition-duration: .01ms;
    animation: none;
  }
}
@media (forced-colors:active) {
  .site-footer__watermark { display: none; }
  .site-footer__primary-action,
  .site-footer a:focus-visible {
    border: 1px solid CanvasText;
    outline-color: Highlight;
  }
}
''',
}


def sha256(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def extract_header(value: str, path: str) -> str:
    match = re.search(r"<header\b.*?</header>", value, flags=re.I | re.S)
    if not match:
        raise RuntimeError(f"{path}: header not found")
    return match.group(0)


def remove_footer_owned_css(value: str) -> str:
    value = re.sub(
        r"\n?/\*\s*footer normalization override: secondary pages\s*\*/.*?(?=/\*\s*HEADER_NORMALIZATION)",
        "\n",
        value,
        flags=re.I | re.S,
    )
    value = re.sub(
        r"\n?/\*\s*FOOTER CANONICAL OVERRIDE[^*]*\*/.*?(?=</style>)",
        "\n",
        value,
        flags=re.I | re.S,
    )
    value = re.sub(
        r"(<style\s+id=[\"']footer-final-sync-v80[\"']>).*?(?=/\*\s*MOBILE HEADER RECOVERY)",
        r"\1\n",
        value,
        flags=re.I | re.S,
    )

    def style_filter(match: re.Match[str]) -> str:
        opening = match.group(1)
        style_id = match.group(2).lower()
        if style_id == "footer-final-sync-v80":
            return match.group(0)
        return "" if "footer" in style_id else match.group(0)

    value = re.sub(
        r"(<style\b[^>]*\bid=[\"']([^\"']+)[\"'][^>]*>).*?</style>",
        style_filter,
        value,
        flags=re.I | re.S,
    )

    replacements = {
        ",.footer-container": "",
        ", .footer-container": "",
        ",.f-btn,.f-cta-btn": "",
        ", .f-btn, .f-cta-btn": "",
        ",.f-btn": "",
        ",.f-cta-btn": "",
        ", .f-btn": "",
        ", .f-cta-btn": "",
    }
    for old, new in replacements.items():
        value = value.replace(old, new)
    return value


def migrate_page(relative_path: str, lang: str, variant: str, locale_href: str) -> dict[str, str]:
    path = ROOT / relative_path
    original = path.read_text(encoding="utf-8")
    original_header = extract_header(original, relative_path)

    value = original
    if not value.startswith("---\n"):
        value = "---\nlayout: null\n---\n" + value

    value = remove_footer_owned_css(value)
    value = re.sub(r"\s+footer-secondary-mobile\b", "", value)

    css_link = '<link rel="stylesheet" href="/assets/css/footer-system-v1.css?v=20260804.1">'
    if css_link not in value:
        if "</head>" not in value:
            raise RuntimeError(f"{relative_path}: closing head not found")
        value = value.replace("</head>", css_link + "\n</head>", 1)

    include_tag = (
        "{% include footer-system/footer.html "
        f'lang="{lang}" variant="{variant}" locale_href="{locale_href}" %}'
    )
    value, footer_count = re.subn(
        r"<footer\b.*?</footer>",
        include_tag,
        value,
        count=1,
        flags=re.I | re.S,
    )
    if footer_count != 1:
        raise RuntimeError(f"{relative_path}: expected one legacy footer, found {footer_count}")

    final_header = extract_header(value, relative_path)
    if sha256(original_header) != sha256(final_header):
        raise RuntimeError(f"{relative_path}: header markup changed")

    if re.search(r"<footer\b", value, flags=re.I):
        raise RuntimeError(f"{relative_path}: legacy footer markup remains")
    if ".f-" in value:
        raise RuntimeError(f"{relative_path}: legacy .f-* selector remains")
    if value.count(include_tag) != 1:
        raise RuntimeError(f"{relative_path}: include count is not one")

    path.write_text(value, encoding="utf-8")
    return {
        "path": relative_path,
        "lang": lang,
        "variant": variant,
        "locale_href": locale_href,
        "header_sha256": sha256(final_header),
    }


def main() -> None:
    for relative_path, content in NEW_FILES.items():
        destination = ROOT / relative_path
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(textwrap.dedent(content).lstrip("\n"), encoding="utf-8")

    manifest = []
    for relative_path, (lang, variant, locale_href) in PAGES.items():
        manifest.append(migrate_page(relative_path, lang, variant, locale_href))

    expected_new = set(NEW_FILES)
    for relative_path in expected_new:
        if not (ROOT / relative_path).is_file():
            raise RuntimeError(f"missing generated source file: {relative_path}")

    (ROOT / ".footer-pr1-manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(manifest, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
