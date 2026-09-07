(() => {
  'use strict';

  const BASE = '/owner-preview/ai-systems-golden-recovery-r1';
  const script = document.currentScript;
  const lang = script?.dataset.lang === 'ru' ? 'ru' : 'en';
  const sourceUrl = `${BASE}/${lang === 'ru' ? 'source-ru.html' : 'source-en.html'}`;

  const header = (locale) => {
    if (locale === 'ru') return `<header class="site-header site-header--standard" data-site-header>
  <div class="site-header__shell">
    <a class="site-header__brand" href="/ru/" aria-label="Главная страница ProAI Expert">
      <span class="proai-logo-r341 proai-logo-r341--header" data-proai-live-logo style="--logo-cube:40px;--logo-word:20px;--logo-gap:9px">
        <span class="proai-logo-r341__cube" aria-hidden="true"><iframe class="proai-logo-r341__live" title="" tabindex="-1" data-logo-live-src="/assets/brand/proai-logo-r341/live.html?mode=living&startup=controlled&rev=20260903-r2"></iframe><img class="proai-logo-r341__static" src="/assets/brand/proai-logo-r341/proai-header-r111-static-cube-320.png" alt="" width="320" height="320" decoding="async"></span>
        <span class="proai-logo-r341__wordmark" aria-hidden="true"><span class="proai-logo-r341__proai">ProAI</span><span class="proai-logo-r341__expert">Expert</span></span>
      </span>
    </a>
    <nav class="site-header__nav" aria-label="Основная навигация" id="site-header-navigation-ru">
      <a class="site-header__nav-link is-active" href="/ru/ai-systems/" aria-current="page">AI-системы</a><a class="site-header__nav-link" href="/ru/websites-branding/">Сайты и брендинг</a><a class="site-header__nav-link" href="/ru/case-studies/">Кейсы</a><a class="site-header__nav-link" href="/ru/about/">О нас</a><a class="site-header__nav-link" href="/ru/insights/">Материалы</a><a class="site-header__nav-link site-header__nav-link--mobile-only" href="/ru/contact/">Контакты</a><a class="site-header__mobile-cta" href="/ru/contact/#project-intake">Обсудить проект</a>
    </nav>
    <div class="site-header__actions"><a class="site-header__locale" href="${BASE}/" lang="en" hreflang="en">EN</a><a class="site-header__cta" href="/ru/contact/#project-intake">Обсудить проект</a><button class="site-header__menu-toggle" type="button" aria-expanded="false" aria-controls="site-header-navigation-ru" aria-label="Открыть меню" data-open-label="Открыть меню" data-close-label="Закрыть меню"><span></span><span></span><span></span></button></div>
  </div>
</header>`;

    return `<header class="site-header site-header--standard" data-site-header>
  <div class="site-header__shell">
    <a class="site-header__brand" href="/" aria-label="ProAI Expert homepage">
      <span class="proai-logo-r341 proai-logo-r341--header" data-proai-live-logo style="--logo-cube:40px;--logo-word:20px;--logo-gap:9px">
        <span class="proai-logo-r341__cube" aria-hidden="true"><iframe class="proai-logo-r341__live" title="" tabindex="-1" data-logo-live-src="/assets/brand/proai-logo-r341/live.html?mode=living&startup=controlled&rev=20260903-r2"></iframe><img class="proai-logo-r341__static" src="/assets/brand/proai-logo-r341/proai-header-r111-static-cube-320.png" alt="" width="320" height="320" decoding="async"></span>
        <span class="proai-logo-r341__wordmark" aria-hidden="true"><span class="proai-logo-r341__proai">ProAI</span><span class="proai-logo-r341__expert">Expert</span></span>
      </span>
    </a>
    <nav class="site-header__nav" aria-label="Primary navigation" id="site-header-navigation-en">
      <a class="site-header__nav-link is-active" href="/ai-systems/" aria-current="page">AI Systems</a><a class="site-header__nav-link" href="/websites-branding/">Websites &amp; Branding</a><a class="site-header__nav-link" href="/case-studies/">Case Studies</a><a class="site-header__nav-link" href="/about/">About</a><a class="site-header__nav-link" href="/insights/">Insights</a><a class="site-header__nav-link site-header__nav-link--mobile-only" href="/contact/">Contact</a><a class="site-header__mobile-cta" href="/contact/#project-intake">Discuss Project</a>
    </nav>
    <div class="site-header__actions"><a class="site-header__locale" href="${BASE}/ru/" lang="ru" hreflang="ru">RU</a><a class="site-header__cta" href="/contact/#project-intake">Discuss Project</a><button class="site-header__menu-toggle" type="button" aria-expanded="false" aria-controls="site-header-navigation-en" aria-label="Open menu" data-open-label="Open menu" data-close-label="Close menu"><span></span><span></span><span></span></button></div>
  </div>
</header>`;
  };

  const hero = (locale) => locale === 'ru' ? `<section class="ai-r3-hero" aria-labelledby="ai-r3-hero-title">
  <div class="ai-r3-shell ai-r3-hero__grid">
    <div class="ai-r3-hero__copy" data-r3-reveal>
      <p class="ai-r3-hero__category">AI-СИСТЕМЫ · АГЕНТЫ · СОБСТВЕННАЯ РАЗРАБОТКА</p>
      <h1 id="ai-r3-hero-title">AI-системы, которые выполняют работу.<br>Важные решения остаются за вами.</h1>
      <p class="ai-r3-hero__lead">Строим AI-агентов, автоматизацию и интеграции под реальные процессы бизнеса. Подключаем данные, сервисы и API, а когда готовых инструментов недостаточно — пишем собственный код. Система берёт на себя заданные действия и останавливается там, где решение должен принять человек.</p>
      <div class="ai-r3-actions"><a class="ai-r3-btn ai-r3-btn--primary" href="/ru/contact/#project-intake">Обсудить задачу</a><a class="ai-r3-btn" href="#reference-implementation">Как мы строим →</a></div>
      <p class="ai-r3-hero__capabilities">AI-АГЕНТЫ · АВТОМАТИЗАЦИЯ · API · СОБСТВЕННЫЙ КОД</p>
    </div>
    <div class="ai-golden-recovery-hero__neutral" aria-hidden="true"></div>
  </div>
</section>` : `<section class="ai-r3-hero" aria-labelledby="ai-r3-hero-title">
  <div class="ai-r3-shell ai-r3-hero__grid">
    <div class="ai-r3-hero__copy" data-r3-reveal>
      <p class="ai-r3-hero__category">AI SYSTEMS · AGENTS · CUSTOM ENGINEERING</p>
      <h1 id="ai-r3-hero-title">AI systems that do the work.<br>You keep the decisions that matter.</h1>
      <p class="ai-r3-hero__lead">We build AI agents, automation, and integrations around real business processes. We connect data, software, and APIs—and write custom code when off-the-shelf tools are not enough. The system handles defined actions and stops where a human decision is required.</p>
      <div class="ai-r3-actions"><a class="ai-r3-btn ai-r3-btn--primary" href="/contact/#project-intake">Discuss your challenge</a><a class="ai-r3-btn" href="#reference-implementation">How we build →</a></div>
      <p class="ai-r3-hero__capabilities">AI AGENTS · AUTOMATION · APIs · CUSTOM CODE</p>
    </div>
    <div class="ai-golden-recovery-hero__neutral" aria-hidden="true"></div>
  </div>
</section>`;

  const proof = (locale) => locale === 'ru' ? `<div class="ai-r3-metrics"><div class="ai-r3-metric ai-r3-metric--bilingual"><strong>EN + RU</strong><span>Двуязычная реализация</span></div><div class="ai-r3-metric"><strong>8,36K</strong><span>Показов в поиске</span></div><div class="ai-r3-metric"><strong>52</strong><span>Страницы в индексе</span></div></div><p class="ai-r3-provenance">EN + RU — факт двуязычной реализации · 8,36K показов и 52 страницы в индексе — данные Google Search Console · период 6 месяцев · август 2026 · индексирование обновлено 16 августа 2026</p>` : `<div class="ai-r3-metrics"><div class="ai-r3-metric ai-r3-metric--bilingual"><strong>EN + RU</strong><span>Bilingual delivery</span></div><div class="ai-r3-metric"><strong>8.36K</strong><span>Search impressions</span></div><div class="ai-r3-metric"><strong>52</strong><span>Indexed pages</span></div></div><p class="ai-r3-provenance">EN + RU is a delivery fact · 8.36K impressions and 52 indexed pages are from Google Search Console · 6-month window · August 2026 · Indexing updated August 16, 2026</p>`;

  const footer = (locale) => {
    const ru = locale === 'ru';
    const title = ru ? 'Строим системы, которые знают, когда действовать — и когда остановиться.' : 'Build the system that knows when to act — and when to stop.';
    const summary = ru ? 'Архитектура процессов, автоматизация, агенты, API и собственная разработка для бизнеса, которому уже мало ещё одного изолированного AI-инструмента.' : 'Process architecture, automation, agents, APIs and custom engineering for businesses that need more than another isolated AI tool.';
    const action = ru ? 'Обсудить проект' : 'Discuss a project';
    const actionHref = ru ? '/ru/contact/#project-intake' : '/contact/#project-intake';
    const homeHref = ru ? '/ru/' : '/';
    const homeLabel = ru ? 'Главная страница ProAI Expert' : 'ProAI Expert homepage';
    const contactTitle = ru ? 'СВЯЗАТЬСЯ' : 'CONTACT';
    const capabilitiesTitle = ru ? 'НАПРАВЛЕНИЯ' : 'CAPABILITIES';
    const telegramLabel = ru ? 'ProAI Expert в Telegram' : 'ProAI Expert on Telegram';
    const socialLabel = ru ? 'Профессиональные профили ProAI Expert' : 'ProAI Expert professional profiles';
    const localeLabel = ru ? 'Язык сайта' : 'Site language';
    const localeHref = ru ? `${BASE}/` : `${BASE}/ru/`;
    const localeText = ru ? 'EN' : 'RU';
    const localeLang = ru ? 'en' : 'ru';
    const copyright = ru ? '© 2026 PROAI EXPERT. ВСЕ ПРАВА ЗАЩИЩЕНЫ.' : '© 2026 PROAI EXPERT. ALL RIGHTS RESERVED.';
    const services = ru
      ? '<a href="/ru/ai-systems/">AI-системы и автоматизация</a><a href="/ru/websites-branding/">Сайты и брендинг</a><a href="/ru/case-studies/">Кейсы</a>'
      : '<a href="/ai-systems/">AI systems and automation</a><a href="/websites-branding/">Websites and branding</a><a href="/case-studies/">Case studies</a>';

    return `<footer class="home-footer-golden-r3" data-home-footer-golden-r3 data-lang="${locale}">
  <div class="home-footer-golden-r3__shell">
    <div class="home-footer-golden-r3__main">
      <section class="home-footer-golden-r3__cta" aria-labelledby="home-footer-golden-r3-title-${locale}">
        <p class="home-footer-golden-r3__eyebrow">PROAI EXPERT · AI SYSTEMS</p>
        <h2 id="home-footer-golden-r3-title-${locale}">${title}</h2>
        <p class="home-footer-golden-r3__summary">${summary}</p>
        <a class="home-footer-golden-r3__action" href="${actionHref}">${action} <span aria-hidden="true">→</span></a>
      </section>
      <div class="home-footer-golden-r3__utility">
        <section class="home-footer-golden-r3__group home-footer-golden-r3__contact" aria-labelledby="home-footer-golden-r3-contact-${locale}"><h3 id="home-footer-golden-r3-contact-${locale}">${contactTitle}</h3><a href="mailto:hello@proai-expert.com">hello@proai-expert.com</a><a href="https://t.me/proAiexpert" target="_blank" rel="noopener noreferrer" aria-label="${telegramLabel}">Telegram <span aria-hidden="true">↗</span></a></section>
        <nav class="home-footer-golden-r3__group home-footer-golden-r3__capabilities" aria-label="${capabilitiesTitle}"><h3>${capabilitiesTitle}</h3>${services}</nav>
      </div>
    </div>
    <a class="home-footer-golden-r3__signature" href="${homeHref}" aria-label="${homeLabel}" data-footer-material-zone><span class="home-footer-golden-r3__signature-light" aria-hidden="true"></span><span class="home-footer-golden-r3__signature-text" aria-hidden="true">PROAI EXPERT</span></a>
    <div class="home-footer-golden-r3__bottom">
      <a class="home-footer-golden-r3__logo" href="${homeHref}" aria-label="${homeLabel}"><span class="proai-logo-r341 proai-logo-r341--footer"><span class="proai-logo-r341__cube" aria-hidden="true"><img class="proai-logo-r341__static" src="/assets/brand/proai-logo-r341/proai-logo-r341-static-cube-320.png" alt="" width="320" height="320" loading="lazy" decoding="async"></span><span class="proai-logo-r341__wordmark" aria-hidden="true"><span class="proai-logo-r341__proai">ProAI</span><span class="proai-logo-r341__expert">Expert</span></span></span></a>
      <nav class="home-footer-golden-r3__social-rail" aria-label="${socialLabel}"><a href="https://www.linkedin.com/in/ihorhorb/" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://github.com/proaiexpert" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://x.com/proaiexpert" target="_blank" rel="noopener noreferrer">X</a></nav>
      <nav class="home-footer-golden-r3__locale" aria-label="${localeLabel}"><a href="${localeHref}" lang="${localeLang}" hreflang="${localeLang}">${localeText}</a></nav>
      <p class="home-footer-golden-r3__copyright">${copyright}</p>
    </div>
  </div>
</footer>`;
  };

  const footerStyles = `<link rel="stylesheet" href="/assets/css/home-footer-golden-r3.css?v=20260819.1"><link rel="stylesheet" href="/assets/css/home-footer-golden-r3-1.css?v=20260820.1"><link rel="stylesheet" href="/assets/css/home-footer-golden-r3-2-polish.css?v=20260828.2"><link rel="stylesheet" href="/assets/css/home-footer-golden-r3-3-micro-polish.css?v=20260828.3"><link rel="stylesheet" href="/assets/css/home-footer-signature-r4.css?v=20260829.2"><link rel="stylesheet" href="${BASE}/ai-systems-golden-recovery-r1.css?v=1">`;
  const footerScripts = `<script src="/assets/js/home-footer-golden-r3.js?v=20260828.4" defer><\/script><script src="/assets/js/home-footer-signature-r4.js?v=20260829.2" defer><\/script>`;

  fetch(sourceUrl, { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`source fetch ${response.status}`);
      return response.text();
    })
    .then((source) => {
      let html = source.replace(/^---\r?\nlayout: null\r?\n---\r?\n/, '');
      html = html.replace(/<link rel="stylesheet" href="\/assets\/css\/ai-systems-hero-clean-transplant-r1\.css">\s*/, '');
      html = html.replace('</head>', `${footerStyles}</head>`);
      html = html.replace(/\{\% include header-system\/header\.html[^%]*\%\}/, header(lang));
      html = html.replace(/<section class="ai-r3-hero ai-clean-donor-hero"[\s\S]*?<\/section>/, hero(lang));
      html = html.replace(lang === 'ru' ? '6 / 6 reference-тестов проходят' : '6 / 6 reference tests passing', lang === 'ru' ? '7 / 7 reference-тестов проходят' : '7 / 7 reference tests passing');
      html = html.replace(/<div class="ai-r3-metrics">[\s\S]*?<\/div><p class="ai-r3-provenance">[\s\S]*?<\/p>/, proof(lang));
      html = html.replace(/<footer class="ai-r3-footer"[\s\S]*?<\/footer>/, footer(lang));
      html = html.replace(/<script type="module" src="\/assets\/js\/ai-systems-hero-clean-transplant-r1\.js[^>]*><\/script>/, '');
      html = html.replace('</body>', `${footerScripts}</body>`);
      document.open();
      document.write(html);
      document.close();
    })
    .catch((error) => {
      document.documentElement.lang = lang;
      document.body.innerHTML = `<main style="font-family:system-ui;background:#090b10;color:#eef2f8;min-height:100vh;padding:32px"><h1>AI Systems review failed to render</h1><pre>${String(error).replace(/[<&]/g, '')}</pre></main>`;
      console.error('[AI Systems Golden Recovery R1]', error);
    });
})();
