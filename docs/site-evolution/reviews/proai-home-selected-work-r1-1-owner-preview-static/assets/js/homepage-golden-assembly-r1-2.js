/* ProAI Homepage Golden Assembly R1.2 — clean-shell coordination + final Owner preview overlay. */
(function () {
  'use strict';

  const PREVIEW_PRODUCT = '9e986a8dfc2fda3f8d59d5b06ecea4cfd7106c9f';

  function addPreviewStyles() {
    [
      'assets/css/home-selected-work-r1-2-polish.css?v=20260823.1',
      'assets/css/home-footer-golden-r3-2-polish.css?v=20260823.1'
    ].forEach((href) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    });
  }

  function setText(root, selector, value) {
    const node = root && root.querySelector(selector);
    if (node) node.textContent = value;
  }

  function applySelectedWorkCopy(isRu) {
    const section = document.querySelector('.selected-work-r11');
    if (!section) return;

    const register = section.querySelectorAll('.selected-work-r11__register-line span');
    if (register[0]) register[0].textContent = isRu ? 'ИЗБРАННАЯ ПОДБОРКА' : 'CURATED SELECTION';
    if (register[1]) register[1].textContent = isRu ? 'РЕАЛИЗОВАННЫЕ РАБОТЫ + КОНЦЕПТЫ' : 'LIVE WORK + WORKING CONCEPTS';

    setText(section, '.selected-work-r11__eyebrow', isRu ? 'ИЗБРАННЫЕ ПРОЕКТЫ' : 'SELECTED WORK');
    setText(section, '.selected-work-r11__intro h2', isRu ? 'Несколько примеров нашей работы.' : 'A few examples of our work.');
    setText(section, '.selected-work-r11__lede', isRu
      ? 'Действующие клиентские сайты и рабочие концепты — избранные примеры того, как ProAI превращает стратегию, контент и технологии в понятные цифровые продукты.'
      : 'Live client websites and working concepts — a selected view of how ProAI turns strategy, content and technology into clear, usable digital products.');

    const records = Array.from(section.querySelectorAll('.selected-work-r11__record'));
    const copy = isRu ? [
      {
        kind: 'КЛИЕНТСКИЙ ПРОЕКТ',
        descriptor: 'Двуязычный сайт финансовой компании — с понятной подачей услуг, удобным путём к заявке и поддержкой поисковой видимости.',
        type: 'Двуязычный сайт финансовой компании',
        built: 'Стратегия · EN/RU-контент · Структура сайта · Production'
      },
      {
        kind: 'КЛИЕНТСКИЙ ПРОЕКТ',
        descriptor: 'Двуязычный сайт эксперта, где услуги, подход и следующий шаг понятны с первых экранов.',
        type: 'Двуязычный сайт эксперта',
        built: 'Структура сайта · UA/RU-контент · Редакционная подача'
      },
      {
        kind: 'РАБОЧИЙ КОНЦЕПТ / ДЕМО',
        descriptor: 'Рабочий концепт сайта локального сервиса: структура услуг, путь клиента, заявка и мобильный сценарий — демонстрация, а не клиентский кейс.',
        type: 'Концепт сайта локального сервиса',
        built: 'Путь клиента · Структура услуг · Сценарий заявки · Рабочее демо'
      }
    ] : [
      {
        kind: 'CLIENT PROJECT',
        descriptor: 'A bilingual website for a financial-services business — built to explain services clearly, guide inquiries and support search visibility.',
        type: 'Bilingual financial-services website',
        built: 'Strategy · EN/RU content · Site architecture · Production'
      },
      {
        kind: 'CLIENT PROJECT',
        descriptor: 'A bilingual expert website that makes services, perspective and next steps easy to understand.',
        type: 'Bilingual expert website',
        built: 'Site structure · UA/RU content · Editorial system'
      },
      {
        kind: 'WORKING CONCEPT / DEMO',
        descriptor: 'A working local-service website concept demonstrating the service journey, request flow and mobile experience — shown as a concept, not a client claim.',
        type: 'Local-service website concept',
        built: 'Customer journey · Service structure · Request flow · Working demo'
      }
    ];

    records.forEach((record, i) => {
      const item = copy[i];
      if (!item) return;
      setText(record, '.selected-work-r11__kind', item.kind);
      setText(record, '.selected-work-r11__descriptor', item.descriptor);
      const values = record.querySelectorAll('.selected-work-r11__facts dd');
      if (values[0]) values[0].textContent = item.type;
      if (values[1]) values[1].textContent = item.built;
    });

    const close = section.querySelector('.selected-work-r11__close');
    if (close) {
      close.innerHTML = isRu
        ? '<a class="selected-work-r11__close-link" href="/ru/case-studies/">Смотреть кейсы <span aria-hidden="true">→</span></a><span>РЕАЛИЗОВАННЫЕ РАБОТЫ + КОНЦЕПТЫ</span><span>СТАТУС УКАЗАН ЯСНО</span>'
        : '<a class="selected-work-r11__close-link" href="/case-studies/">Explore case studies <span aria-hidden="true">→</span></a><span>LIVE WORK + WORKING CONCEPTS</span><span>STATUS SHOWN CLEARLY</span>';
    }
  }

  function applyFinancialStreamCopy(isRu) {
    const section = document.querySelector('[data-fs-showcase-r11]');
    if (!section) return;
    setText(section, '.home-fs-showcase-r11__thesis', isRu
      ? 'Двуязычный сайт для финансовой компании — с понятной подачей услуг, удобным путём к заявке, поисковой видимостью и поддержкой после запуска.'
      : 'A bilingual website for a financial-services business — designed to explain services clearly, guide inquiries, support search visibility and stay useful after launch.');

    const depth = section.querySelector('.home-fs-showcase-r11__depth');
    if (depth) {
      depth.innerHTML = isRu
        ? 'ГЛУБЖЕ ИНТЕРФЕЙСА <span>EN/RU · ПОДАЧА ЗАЯВКИ · КОНТЕНТ / ПОИСК · ПОДДЕРЖКА ПОСЛЕ ЗАПУСКА</span>'
        : 'BEYOND THE INTERFACE <span>EN/RU · STRUCTURED INQUIRY · CONTENT / SEARCH · ONGOING SUPPORT</span>';
    }

    const proof = section.querySelector('.home-fs-showcase-r11__proof');
    if (proof) {
      proof.setAttribute('aria-label', isRu ? 'Подтверждение реализации и поисковой видимости Financial Stream' : 'Financial Stream delivery and search proof');
      const metrics = proof.querySelectorAll('.home-fs-showcase-r11__metric');
      if (metrics[0]) {
        setText(metrics[0], 'strong', '2');
        setText(metrics[0], 'span', isRu ? 'ВЕРСИИ EN / RU' : 'EN / RU EXPERIENCES');
      }
      const provenance = proof.querySelector('.home-fs-showcase-r11__provenance');
      if (provenance) {
        provenance.innerHTML = isRu
          ? 'ДВУЯЗЫЧНАЯ РЕАЛИЗАЦИЯ · GOOGLE SEARCH CONSOLE · СРЕЗ ЗА 6 МЕСЯЦЕВ · АВГУСТ 2026 <span>ИНДЕКСАЦИЯ ОБНОВЛЕНА 16 АВГУСТА 2026</span>'
          : 'BILINGUAL DELIVERY · GOOGLE SEARCH CONSOLE · 6-MONTH PERFORMANCE SNAPSHOT · AUG 2026 <span>INDEXING UPDATED AUG 16, 2026</span>';
      }
    }
  }

  function applyFooterCopy(isRu) {
    setText(document, '.home-footer-golden-r3__summary', isRu
      ? 'Если хотите сократить ручную работу, усилить сайт и связать обращения с дальнейшими действиями — обсудим, что стоит сделать в первую очередь.'
      : 'If you want less manual work, a stronger website, and a clearer path from inquiry to action, let’s discuss what should be built first.');
  }

  function applyFinalOwnerPreview() {
    const isRu = (document.documentElement.lang || '').toLowerCase().startsWith('ru') || document.body.classList.contains('lang-ru');
    document.documentElement.dataset.productSha = PREVIEW_PRODUCT;
    document.body.dataset.productSha = PREVIEW_PRODUCT;
    addPreviewStyles();
    applyFinancialStreamCopy(isRu);
    applySelectedWorkCopy(isRu);
    applyFooterCopy(isRu);
  }

  const revealNodes = Array.from(document.querySelectorAll('.homepage-founder-proof .reveal, .materials-editorial .reveal'));
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    revealNodes.forEach((node) => revealObserver.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add('active'));
  }

  const insights = document.getElementById('insights');
  if (insights && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    observer.observe(insights);
  } else if (insights) {
    insights.classList.add('is-visible');
  }

  applyFinalOwnerPreview();

  window.__PROAI_HOME_GOLDEN_R12 = Object.freeze({
    cleanShell: true,
    productSha: PREVIEW_PRODUCT,
    connectedCount: document.querySelectorAll('[data-connected-system]').length,
    twoWorldsCount: document.querySelectorAll('[data-tw-r2][data-tw-golden-r1]').length,
    embeddedTechnologyCount: document.querySelectorAll('[data-tw-tech-r2], .tw-tech-r2').length,
    technologyCount: document.querySelectorAll('[data-home-tech-r2]').length,
    financialStreamCount: document.querySelectorAll('[data-fs-showcase-r11]').length,
    legacyCoreSplitCount: document.querySelectorAll('#core-split').length,
    legacyFinancialCount: document.querySelectorAll('#section-trigger').length,
    footerCount: document.querySelectorAll('footer[data-footer-watermark-r2]').length
  });
}());
