/* ProAI Expert — Selected Thinking / Editorial Decision Desk R1 */
(function () {
  'use strict';

  var sections = document.querySelectorAll('[data-selected-thinking-r1]');
  if (!sections.length) return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    sections.forEach(function (section) { section.classList.add('st-r1-visible'); });
    return;
  }

  document.documentElement.classList.add('st-r1-js');

  var observer = new IntersectionObserver(function (entries, io) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('st-r1-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -7% 0px' });

  sections.forEach(function (section) { observer.observe(section); });
})();
