/* ProAI Homepage Golden Assembly R1.2 — clean-shell coordination only. */
(function () {
  'use strict';

  function addPsychologyPracticeStyles() {
    if (document.getElementById('proai-psychology-practice-title-style')) return;
    const style = document.createElement('style');
    style.id = 'proai-psychology-practice-title-style';
    style.textContent = `
      @media (max-width: 760px) {
        .selected-work-r11__record--client .selected-work-r11__identity h3 {
          max-width: 100%;
          font-size: clamp(30px, 8.8vw, 36px);
          line-height: .98;
          letter-spacing: -.045em;
        }
        .selected-work-r11__record--client .selected-work-r11__identity h3 a {
          max-width: 100%;
          overflow-wrap: normal;
          word-break: normal;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function applyPsychologyPracticePositioning() {
    const isRu = (document.documentElement.lang || '').toLowerCase().startsWith('ru') || document.body.classList.contains('lang-ru');
    const records = Array.from(document.querySelectorAll('.selected-work-r11__record'));
    const record = records.find((item) => item.querySelector('a[href="/case-studies/alina-horb/"], a[href="/ru/case-studies/alina-horb/"]'));
    if (!record) return;

    const domain = record.querySelector('.selected-work-r11__domain');
    const titleLink = record.querySelector('.selected-work-r11__identity h3 a');
    const descriptor = record.querySelector('.selected-work-r11__descriptor');
    const values = record.querySelectorAll('.selected-work-r11__facts dd');
    const actions = record.querySelector('.selected-work-r11__actions');

    if (domain) domain.textContent = isRu
      ? 'ПСИХОЛОГИЧЕСКАЯ ПРАКТИКА · АЛИНА ГОРБ'
      : 'PSYCHOLOGY PRACTICE · ALINA HORB';
    if (titleLink) titleLink.textContent = isRu ? 'Психологическая практика' : 'Psychology Practice';
    if (descriptor) descriptor.textContent = isRu
      ? 'Двуязычный сайт психологической практики — с акцентом на личное доверие, понятную подачу подхода и ясный первый шаг к консультации.'
      : 'A bilingual website for a psychology practice — built to establish personal trust, explain the approach and make the first consultation step clear.';
    if (values[0]) values[0].textContent = isRu ? 'Двуязычный сайт психологической практики' : 'Bilingual psychology-practice website';
    if (values[1]) values[1].textContent = isRu
      ? 'Структура сайта · UA/RU-контент · Редакционная система'
      : 'Site structure · UA/RU content · Editorial system';
    if (actions) actions.setAttribute('aria-label', isRu ? 'Ссылки сайта психологической практики Алины Горб' : 'Psychology Practice Website links for Alina Horb');
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

  addPsychologyPracticeStyles();
  applyPsychologyPracticePositioning();

  window.__PROAI_HOME_GOLDEN_R12 = Object.freeze({
    cleanShell: true,
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
