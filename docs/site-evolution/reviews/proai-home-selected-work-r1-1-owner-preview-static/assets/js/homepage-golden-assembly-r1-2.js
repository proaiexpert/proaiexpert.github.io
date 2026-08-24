/* ProAI Homepage Golden Assembly R1.2 — clean-shell coordination only. */
(function () {
  'use strict';

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
