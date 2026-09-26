/* ProAI Expert — Selected Thinking / Decision Aperture + Trace R2 */
(function () {
  'use strict';

  var sections = document.querySelectorAll('[data-selected-thinking-r2]');
  if (!sections.length) return;

  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('st-r2-js');

  function settle(section) {
    if (section.classList.contains('st-r2-calm')) return;
    section.classList.add('st-r2-calm');
    section.dispatchEvent(new CustomEvent('st:r2-calm', { bubbles: false }));
  }

  function enter(section) {
    if (section.dataset.stR2Entered === 'true') return;
    section.dataset.stR2Entered = 'true';
    section.classList.add('st-r2-entered');
    section.dispatchEvent(new CustomEvent('st:r2-start', { bubbles: false }));

    if (reduce) {
      settle(section);
      return;
    }

    window.setTimeout(function () {
      settle(section);
    }, 1260);
  }

  if (reduce || !('IntersectionObserver' in window)) {
    sections.forEach(enter);
    return;
  }

  var observer = new IntersectionObserver(function (entries, io) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      enter(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -7% 0px' });

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();
