/* ProAI Homepage Golden Assembly R1 — downstream wiring only.
   Preserves existing master reveal behavior without loading the legacy monolithic homepage runtime. */
(function () {
  'use strict';

  const revealNodes = Array.from(document.querySelectorAll('.homepage-founder-proof .reveal, .materials-editorial .reveal, #selected-work .reveal'));
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
    const insightsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        insightsObserver.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    insightsObserver.observe(insights);
  } else if (insights) {
    insights.classList.add('is-visible');
  }

  window.__PROAI_HOME_GOLDEN_R1 = Object.freeze({
    financialStreamMounted: Boolean(document.getElementById('section-trigger') || document.querySelector('[data-fs-showcase-r11]')),
    legacyCoreSplitMounted: Boolean(document.getElementById('core-split')),
    embeddedTechnologyMounted: Boolean(document.querySelector('[data-tw-tech-r2]')),
    standaloneTechnologyCount: document.querySelectorAll('[data-home-tech-r2]').length,
    footerCount: document.querySelectorAll('footer').length
  });
}());
