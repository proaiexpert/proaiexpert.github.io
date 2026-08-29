(function () {
  'use strict';

  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-home-tech-r1]'));
  if (!sections.length) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function establish(section) {
    if (section.classList.contains('is-ready')) return;
    section.classList.add('is-ready');
  }

  if (reduced || !('IntersectionObserver' in window)) {
    sections.forEach(establish);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      establish(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.28, rootMargin: '0px 0px -8% 0px' });

  sections.forEach(function (section) { observer.observe(section); });
}());
