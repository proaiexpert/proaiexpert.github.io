(() => {
  'use strict';

  const lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';
  const asset = (relativePath) => new URL(relativePath, import.meta.url).href;

  const ensureStylesheet = (href) => {
    if ([...document.styleSheets].some((sheet) => sheet.href === href) || document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };

  [
    '../css/header-footer-logo-r1.css',
    '../css/home-footer-golden-r3.css',
    '../css/home-footer-golden-r3-1.css',
    '../css/home-footer-golden-r3-2-polish.css',
    '../css/home-footer-golden-r3-3-micro-polish.css',
    '../css/home-footer-signature-r4.css',
  ].map(asset).forEach(ensureStylesheet);

  const headerCube = asset('../brand/proai-logo-r341/proai-header-r111-static-cube-320.png');
  const footerCube = asset('../brand/proai-logo-r341/proai-logo-r341-static-cube-320.png');

  const brand = document.querySelector('.site-header__brand');
  if (brand) {
    brand.innerHTML = `
      <span class="proai-logo-r341 proai-logo-r341--header" style="--logo-cube:40px;--logo-word:20px;--logo-gap:9px">
        <span class="proai-logo-r341__cube" aria-hidden="true">
          <img class="proai-logo-r341__static" src="${headerCube}" alt="" width="320" height="320" decoding="async">
        </span>
        <span class="proai-logo-r341__wordmark" aria-hidden="true"><span class="proai-logo-r341__proai">ProAI</span><span class="proai-logo-r341__expert">Expert</span></span>
      </span>`;
  }

  const metricCards = [...document.querySelectorAll('.ai-r3-evidence-card')];
  const financial = metricCards.find((card) => card.querySelector('h3')?.textContent.trim() === 'Financial Stream');
  if (financial) {
    const metrics = financial.querySelectorAll('.ai-r3-metric');
    if (metrics[0]) {
      const strong = metrics[0].querySelector('strong');
      const label = metrics[0].querySelector('span');
      if (strong) strong.textContent = 'EN + RU';
      if (label) label.textContent = lang === 'ru' ? 'Двуязычная версия' : 'Bilingual production';
    }
    const provenance = financial.querySelector('.ai-r3-provenance');
    if (provenance) {
      provenance.textContent = lang === 'ru'
        ? 'EN + RU — факт production-доставки. 8,36K показов и 52 страницы в индексе — Google Search Console · 6 месяцев · август 2026 · индексирование обновлено 16 августа 2026.'
        : 'EN + RU is a production-delivery fact. 8.36K impressions and 52 indexed pages are from Google Search Console · 6-month window · August 2026 · indexing updated August 16, 2026.';
    }
  }

  const oldFooter = document.querySelector('.ai-r3-footer');
  if (!oldFooter) return;

  const copy = lang === 'ru'
    ? {
        eyebrow: 'СЛЕДУЮЩИЙ ШАГ',
        title: 'Покажите, где работа теряет время, контекст или контроль.',
        summary: 'Начнём с процесса. Разберём, что исправить обычным правилом, где нужен AI, где оправдан агент, а где действительно нужен собственный код или интеграционный слой.',
        action: 'Обсудить задачу',
        actionHref: '/ru/contact/#project-intake',
        homeHref: '/ru/', homeLabel: 'Главная страница ProAI Expert',
        contactTitle: 'СВЯЗАТЬСЯ', capabilitiesTitle: 'НАПРАВЛЕНИЯ',
        services: [['AI-системы и автоматизация','/ru/ai-systems/'],['Сайты и брендинг','/ru/websites-branding/'],['Кейсы','/ru/case-studies/']],
        localeHref: '/ai-systems/', localeText: 'EN', localeLang: 'en',
        socialLabel: 'Профессиональные профили ProAI Expert',
        copyright: '© 2026 PROAI EXPERT. ВСЕ ПРАВА ЗАЩИЩЕНЫ.',
      }
    : {
        eyebrow: 'NEXT MOVE',
        title: 'Show us where work loses time, context or control.',
        summary: 'We will start with the operating problem, decide what should remain deterministic, where AI is justified, where an agent needs tools, and where custom engineering is the right layer.',
        action: 'Discuss the system',
        actionHref: '/contact/#project-intake',
        homeHref: '/', homeLabel: 'ProAI Expert homepage',
        contactTitle: 'CONTACT', capabilitiesTitle: 'CAPABILITIES',
        services: [['AI systems and automation','/ai-systems/'],['Websites and branding','/websites-branding/'],['Case studies','/case-studies/']],
        localeHref: '/ru/ai-systems/', localeText: 'RU', localeLang: 'ru',
        socialLabel: 'ProAI Expert professional profiles',
        copyright: '© 2026 PROAI EXPERT. ALL RIGHTS RESERVED.',
      };

  const services = copy.services.map(([label, href]) => `<a href="${href}">${label}</a>`).join('');
  oldFooter.outerHTML = `
    <footer class="home-footer-golden-r3" data-home-footer-golden-r3 data-lang="${lang}">
      <div class="home-footer-golden-r3__shell">
        <div class="home-footer-golden-r3__main">
          <section class="home-footer-golden-r3__cta" aria-labelledby="ai-systems-footer-title-${lang}">
            <p class="home-footer-golden-r3__eyebrow">${copy.eyebrow}</p>
            <h2 id="ai-systems-footer-title-${lang}">${copy.title}</h2>
            <p class="home-footer-golden-r3__summary">${copy.summary}</p>
            <a class="home-footer-golden-r3__action" href="${copy.actionHref}">${copy.action} <span aria-hidden="true">→</span></a>
          </section>
          <div class="home-footer-golden-r3__utility">
            <section class="home-footer-golden-r3__group home-footer-golden-r3__contact" aria-labelledby="ai-systems-footer-contact-${lang}">
              <h3 id="ai-systems-footer-contact-${lang}">${copy.contactTitle}</h3>
              <a href="mailto:hello@proai-expert.com">hello@proai-expert.com</a>
              <a href="https://t.me/proAiexpert" target="_blank" rel="noopener noreferrer">Telegram <span aria-hidden="true">↗</span></a>
            </section>
            <nav class="home-footer-golden-r3__group home-footer-golden-r3__capabilities" aria-label="${copy.capabilitiesTitle}"><h3>${copy.capabilitiesTitle}</h3>${services}</nav>
          </div>
        </div>
        <a class="home-footer-golden-r3__signature" href="${copy.homeHref}" aria-label="${copy.homeLabel}" data-footer-material-zone>
          <span class="home-footer-golden-r3__signature-light" aria-hidden="true"></span>
          <span class="home-footer-golden-r3__signature-text" aria-hidden="true">PROAI EXPERT</span>
        </a>
        <div class="home-footer-golden-r3__bottom">
          <a class="home-footer-golden-r3__logo" href="${copy.homeHref}" aria-label="${copy.homeLabel}">
            <span class="proai-logo-r341 proai-logo-r341--footer">
              <span class="proai-logo-r341__cube" aria-hidden="true"><img class="proai-logo-r341__static" src="${footerCube}" alt="" width="320" height="320" loading="lazy" decoding="async"></span>
              <span class="proai-logo-r341__wordmark" aria-hidden="true"><span class="proai-logo-r341__proai">ProAI</span><span class="proai-logo-r341__expert">Expert</span></span>
            </span>
          </a>
          <nav class="home-footer-golden-r3__social-rail" aria-label="${copy.socialLabel}">
            <a href="https://www.linkedin.com/in/ihorhorb/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/proaiexpert" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://x.com/proaiexpert" target="_blank" rel="noopener noreferrer">X</a>
          </nav>
          <nav class="home-footer-golden-r3__locale" aria-label="${lang === 'ru' ? 'Язык сайта' : 'Site language'}"><a href="${copy.localeHref}" lang="${copy.localeLang}" hreflang="${copy.localeLang}">${copy.localeText}</a></nav>
          <p class="home-footer-golden-r3__copyright">${copy.copyright}</p>
        </div>
      </div>
    </footer>`;

  [asset('./home-footer-golden-r3.js'), asset('./home-footer-signature-r4.js')].forEach((src) => {
    if (document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    document.body.appendChild(script);
  });
})();
