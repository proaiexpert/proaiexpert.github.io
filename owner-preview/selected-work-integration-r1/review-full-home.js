/* Review-only full Homepage assembler for Cloudflare Pages no-build hosting.
   Product authority remains the integration branch production files. */
(() => {
  'use strict';

  const lang = document.documentElement.dataset.reviewLang === 'ru' ? 'ru' : 'en';

  const fragmentPaths = {
    en: {
      connected: '/_includes/homepage-connected-system-en.html',
      'two-worlds': '/_includes/homepage-two-worlds-golden-r1-en-assembly.html',
      financial: '/_includes/home-work-proof-financial-stream-r1-4-en.html',
      'live-system': '/_includes/home-system-execution-r2-en.html',
      thinking: '/_includes/home-selected-thinking-r1-en.html',
      work: '/_includes/home-selected-work-r1-en.html'
    },
    ru: {
      connected: '/_includes/homepage-connected-system-ru.html',
      'two-worlds': '/_includes/homepage-two-worlds-golden-r1-ru-assembly.html',
      financial: '/_includes/home-work-proof-financial-stream-r1-4-ru.html',
      'live-system': '/_includes/home-system-execution-r2-ru.html',
      thinking: '/_includes/home-selected-thinking-r1-ru.html',
      work: '/_includes/home-selected-work-r1-ru.html'
    }
  };

  const nav = {
    en: {
      aria: 'Primary navigation',
      locale: { label: 'RU', lang: 'ru', href: '/owner-preview/selected-work-integration-r1/ru.html' },
      cta: { label: 'Discuss Project', href: '/contact/#project-intake' },
      items: [
        ['AI Systems', '/ai-systems/'], ['Websites & Branding', '/websites-branding/'],
        ['Case Studies', '/case-studies/'], ['About', '/about/'], ['Insights', '/insights/']
      ],
      mobile: ['Contact', '/contact/'], home: '/', brand: 'ProAI Expert homepage',
      open: 'Open menu', close: 'Close menu'
    },
    ru: {
      aria: 'Основная навигация',
      locale: { label: 'EN', lang: 'en', href: '/owner-preview/selected-work-integration-r1/' },
      cta: { label: 'Обсудить проект', href: '/ru/contact/#project-intake' },
      items: [
        ['AI-системы', '/ru/ai-systems/'], ['Сайты и брендинг', '/ru/websites-branding/'],
        ['Кейсы', '/ru/case-studies/'], ['О нас', '/ru/about/'], ['Материалы', '/ru/insights/']
      ],
      mobile: ['Контакты', '/ru/contact/'], home: '/ru/', brand: 'Главная страница ProAI Expert',
      open: 'Открыть меню', close: 'Закрыть меню'
    }
  };

  const footer = {
    en: {
      eyebrow: 'NEXT STEP', title: 'Ready to build a stronger system?',
      summary: 'If you want less manual work, a stronger website, and a clearer path from inquiry to action, let’s discuss what should be built first.',
      action: 'Discuss Your Project', actionHref: '/contact/#project-intake', contact: 'CONTACT', capabilities: 'CAPABILITIES',
      services: [['AI systems and automation','/ai-systems/'],['Websites and branding','/websites-branding/'],['Case studies','/case-studies/']],
      home: '/', homeLabel: 'ProAI Expert homepage', socialLabel: 'ProAI Expert professional profiles', localeLabel: 'Site language',
      localeText: 'RU', localeLang: 'ru', localeHref: '/owner-preview/selected-work-integration-r1/ru.html',
      copyright: '© 2026 PROAI EXPERT. ALL RIGHTS RESERVED.', telegramLabel: 'ProAI Expert on Telegram'
    },
    ru: {
      eyebrow: 'СЛЕДУЮЩИЙ ШАГ', title: 'Готовы построить более сильную систему?',
      summary: 'Если хотите сократить ручную работу, усилить сайт и связать обращения с дальнейшими действиями — обсудим, что стоит сделать в первую очередь.',
      action: 'Обсудить проект', actionHref: '/ru/contact/#project-intake', contact: 'СВЯЗАТЬСЯ', capabilities: 'НАПРАВЛЕНИЯ',
      services: [['AI-системы и автоматизация','/ru/ai-systems/'],['Сайты и брендинг','/ru/websites-branding/'],['Кейсы','/ru/case-studies/']],
      home: '/ru/', homeLabel: 'Главная страница ProAI Expert', socialLabel: 'Профессиональные профили ProAI Expert', localeLabel: 'Язык сайта',
      localeText: 'EN', localeLang: 'en', localeHref: '/owner-preview/selected-work-integration-r1/',
      copyright: '© 2026 PROAI EXPERT. ВСЕ ПРАВА ЗАЩИЩЕНЫ.', telegramLabel: 'ProAI Expert в Telegram'
    }
  };

  function renderHeader() {
    const d = nav[lang];
    const links = d.items.map(([label, href]) => `<a class="site-header__nav-link" href="${href}">${label}</a>`).join('');
    document.querySelector('[data-review-header]').innerHTML = `
<header class="site-header site-header--standard" data-site-header>
  <div class="site-header__shell">
    <a class="site-header__brand" href="${d.home}" aria-label="${d.brand}">
      <span class="proai-logo-r341 proai-logo-r341--header" data-proai-live-logo style="--logo-cube:40px;--logo-word:20px;--logo-gap:9px">
        <span class="proai-logo-r341__cube" aria-hidden="true">
          <iframe class="proai-logo-r341__live" title="" tabindex="-1" data-logo-live-src="/assets/brand/proai-logo-r341/live.html?mode=living&startup=controlled&rev=20260903-r2"></iframe>
          <img class="proai-logo-r341__static" src="/assets/brand/proai-logo-r341/proai-header-r111-static-cube-320.png" alt="" width="320" height="320" decoding="async">
        </span>
        <span class="proai-logo-r341__wordmark" aria-hidden="true"><span class="proai-logo-r341__proai">ProAI</span><span class="proai-logo-r341__expert">Expert</span></span>
      </span>
    </a>
    <nav class="site-header__nav" aria-label="${d.aria}" id="site-header-navigation-${lang}">
      ${links}
      <a class="site-header__nav-link site-header__nav-link--mobile-only" href="${d.mobile[1]}">${d.mobile[0]}</a>
      <a class="site-header__mobile-cta" href="${d.cta.href}">${d.cta.label}</a>
    </nav>
    <div class="site-header__actions">
      <a class="site-header__locale" href="${d.locale.href}" lang="${d.locale.lang}" hreflang="${d.locale.lang}">${d.locale.label}</a>
      <a class="site-header__cta" href="${d.cta.href}">${d.cta.label}</a>
      <button class="site-header__menu-toggle" type="button" aria-expanded="false" aria-controls="site-header-navigation-${lang}" aria-label="${d.open}" data-open-label="${d.open}" data-close-label="${d.close}"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>`;
  }

  function renderTechnology() {
    const ru = lang === 'ru';
    const eyebrow = ru ? '04 / ТЕХНОЛОГИЧЕСКАЯ ЭКОСИСТЕМА' : '04 / TECHNOLOGY ECOSYSTEM';
    const title = ru ? 'ИЗБРАННЫЕ ПЛАТФОРМЫ И ИНТЕГРАЦИИ' : 'SELECTED PLATFORMS & INTEGRATIONS';
    const aria = ru ? 'Избранные платформы и интеграции ProAI Expert' : 'Selected ProAI Expert platforms and integrations';
    const brands = [
      ['openai','OpenAI',0],['claude','Claude',1],['gemini','Gemini',2],['n8n','n8n',3],['make','Make',4],
      ['twilio','Twilio',0],['vercel','Vercel',1],['gmail','Gmail',2],['zapier','Zapier',3],['github','GitHub',4]
    ];
    const items = brands.map(([brand,name,phase]) => `<li class="home-tech-r2__identity" data-brand="${brand}" style="--tech-phase:${phase}"><span class="home-tech-r2__mark"><img src="/assets/brand/platforms/${brand}-mark.svg" alt="" loading="lazy" decoding="async" draggable="false"></span><span class="home-tech-r2__name" translate="no">${name}</span></li>`).join('');
    document.querySelector('[data-review-technology]').innerHTML = `
<section class="home-tech-r2" data-home-tech-r2 aria-labelledby="home-tech-r2-title-${lang}">
  <div class="home-tech-r2__material" aria-hidden="true"></div>
  <svg class="home-tech-r2__relay home-tech-r2__relay--desktop" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="home-tech-r2-relay-${lang}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c9cdd1"/><stop offset=".46" stop-color="#a9a7b8"/><stop offset=".62" stop-color="#8f88ad"/><stop offset="1" stop-color="#c9cdd1"/></linearGradient></defs><path class="home-tech-r2__relay-base" pathLength="1" d="M770 0 V36 Q770 54 748 54 H356 Q330 54 330 80 V214 Q330 238 354 238 H640 Q664 238 664 262 V300"/><path class="home-tech-r2__relay-active" pathLength="1" stroke="url(#home-tech-r2-relay-${lang})" d="M770 0 V36 Q770 54 748 54 H356 Q330 54 330 80 V214 Q330 238 354 238 H640 Q664 238 664 262 V300"/></svg>
  <svg class="home-tech-r2__relay home-tech-r2__relay--mobile" viewBox="0 0 400 520" preserveAspectRatio="none" aria-hidden="true"><path class="home-tech-r2__relay-base" pathLength="1" d="M200 0 V520"/><path class="home-tech-r2__relay-active" pathLength="1" d="M200 0 V520"/><g class="home-tech-r2__relay-branches"><path d="M200 168 H52 M200 168 H348"/><path d="M200 236 H52 M200 236 H348"/><path d="M200 304 H52 M200 304 H348"/><path d="M200 372 H52 M200 372 H348"/><path d="M200 440 H52 M200 440 H348"/></g></svg>
  <div class="home-tech-r2__shell"><header class="home-tech-r2__heading"><p class="home-tech-r2__eyebrow">${eyebrow}</p><h2 id="home-tech-r2-title-${lang}">${title}</h2></header><ul class="home-tech-r2__register" aria-label="${aria}">${items}</ul></div>
  <div class="home-tech-r2__handoff" aria-hidden="true"><span></span></div>
</section>`;
  }

  function renderFooter() {
    const d = footer[lang];
    const services = d.services.map(([label,href]) => `<a href="${href}">${label}</a>`).join('');
    document.querySelector('[data-review-footer]').innerHTML = `
<footer class="home-footer-golden-r3" data-home-footer-golden-r3 data-lang="${lang}">
  <div class="home-footer-golden-r3__shell">
    <div class="home-footer-golden-r3__main">
      <section class="home-footer-golden-r3__cta" aria-labelledby="home-footer-golden-r3-title-${lang}"><p class="home-footer-golden-r3__eyebrow">${d.eyebrow}</p><h2 id="home-footer-golden-r3-title-${lang}">${d.title}</h2><p class="home-footer-golden-r3__summary">${d.summary}</p><a class="home-footer-golden-r3__action" href="${d.actionHref}">${d.action} <span aria-hidden="true">→</span></a></section>
      <div class="home-footer-golden-r3__utility">
        <section class="home-footer-golden-r3__group home-footer-golden-r3__contact" aria-labelledby="home-footer-golden-r3-contact-${lang}"><h3 id="home-footer-golden-r3-contact-${lang}">${d.contact}</h3><a href="mailto:hello@proai-expert.com">hello@proai-expert.com</a><a href="https://t.me/proAiexpert" target="_blank" rel="noopener noreferrer" aria-label="${d.telegramLabel}">Telegram <span aria-hidden="true">↗</span></a></section>
        <nav class="home-footer-golden-r3__group home-footer-golden-r3__capabilities" aria-label="${d.capabilities}"><h3>${d.capabilities}</h3>${services}</nav>
      </div>
    </div>
    <a class="home-footer-golden-r3__signature" href="${d.home}" aria-label="${d.homeLabel}" data-footer-material-zone><span class="home-footer-golden-r3__signature-light" aria-hidden="true"></span><span class="home-footer-golden-r3__signature-text" aria-hidden="true">PROAI EXPERT</span></a>
    <div class="home-footer-golden-r3__bottom">
      <a class="home-footer-golden-r3__logo" href="${d.home}" aria-label="${d.homeLabel}"><span class="proai-logo-r341 proai-logo-r341--footer"><span class="proai-logo-r341__cube" aria-hidden="true"><img class="proai-logo-r341__static" src="/assets/brand/proai-logo-r341/proai-logo-r341-static-cube-320.png" alt="" width="320" height="320" loading="lazy" decoding="async"></span><span class="proai-logo-r341__wordmark" aria-hidden="true"><span class="proai-logo-r341__proai">ProAI</span><span class="proai-logo-r341__expert">Expert</span></span></span></a>
      <nav class="home-footer-golden-r3__social-rail" aria-label="${d.socialLabel}"><a href="https://www.linkedin.com/in/ihorhorb/" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://github.com/proaiexpert" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://x.com/proaiexpert" target="_blank" rel="noopener noreferrer">X</a></nav>
      <nav class="home-footer-golden-r3__locale" aria-label="${d.localeLabel}"><a href="${d.localeHref}" lang="${d.localeLang}" hreflang="${d.localeLang}">${d.localeText}</a></nav>
      <p class="home-footer-golden-r3__copyright">${d.copyright}</p>
    </div>
  </div>
</footer>`;
  }

  async function injectFragment(key, path) {
    const target = document.querySelector(`[data-review-fragment="${key}"]`);
    if (!target) return;
    try {
      const response = await fetch(path, { cache: 'no-store' });
      if (!response.ok) throw new Error(`${response.status} ${path}`);
      target.innerHTML = await response.text();
    } catch (error) {
      target.innerHTML = `<section style="padding:64px 24px;background:#08090b;color:#f2f0eb;font:14px/1.5 Inter,sans-serif"><strong>Review assembly error:</strong> ${String(error.message || error)}</section>`;
      throw error;
    }
  }

  function loadScript(src, type) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      if (type) script.type = type;
      script.onload = resolve;
      script.onerror = resolve;
      document.body.appendChild(script);
    });
  }

  async function init() {
    renderHeader();
    renderTechnology();
    renderFooter();

    const entries = Object.entries(fragmentPaths[lang]);
    try {
      await Promise.all(entries.map(([key,path]) => injectFragment(key,path)));
    } catch (_error) {
      return;
    }

    await loadScript('/assets/js/header-system-v1.js?v=20260804.1');
    await loadScript('/assets/js/header-footer-logo-r1.js?v=20260814.1');
    await loadScript('/assets/js/homepage-connected-system-r13.js?v=golden-r1-2');
    await loadScript('/assets/js/homepage-two-worlds-golden-r1.js?v=20260828.4');
    await loadScript('/assets/js/homepage-two-worlds-golden-r1-landscape-fix.js?v=golden-r1-2-final-reconciliation');
    await loadScript('/assets/js/home-technology-transition-r2.js?v=golden-r1-2');
    await loadScript('/assets/js/home-work-proof-financial-stream-r1-1.js?v=golden-r1-2');
    await loadScript('/assets/js/home-system-execution-r2.js?v=20260903.1');
    await loadScript('/assets/js/home-selected-thinking-r1.js?v=golden-r1-2');
    await loadScript('/assets/js/home-selected-thinking-r1-5.js?v=20260902.1');
    await loadScript('/assets/js/home-selected-work-curated-evidence-r1.js?v=20260905.1');
    await loadScript('/assets/js/home-footer-golden-r3.js?v=20260828.4');
    await loadScript('/assets/js/home-footer-signature-r4.js?v=20260829.2');
    await loadScript('/assets/js/homepage-golden-assembly-r1-2.js?v=golden-r1-2-final-reconciliation');
    import('/assets/js/proai-hero-cube-r1/bootstrap-golden-r1-2.js?v=golden-r1-2-exact').catch(() => {});
  }

  init();
})();
