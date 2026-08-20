(function () {
  'use strict';

  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-home-tech-r2]'));
  if (!sections.length) return;

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

  function settle(section, reduced) {
    if (section.dataset.techR2State === 'settled') return;
    if (!reduced) section.classList.add('is-assembling');
    section.classList.add('is-settled');
    section.dataset.techR2State = 'settled';
  }

  function assemble(section) {
    if (section.dataset.techR2State) return;

    if (reducedMotion && reducedMotion.matches) {
      settle(section, true);
      return;
    }

    section.dataset.techR2State = 'assembling';
    section.classList.add('is-assembling');

    window.setTimeout(function () {
      section.classList.add('is-settled');
      section.dataset.techR2State = 'settled';
    }, 1480);
  }

  function inViewport(section) {
    var rect = section.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }

  if (reducedMotion && reducedMotion.matches) {
    sections.forEach(function (section) { settle(section, true); });
    return;
  }

  if (!('IntersectionObserver' in window)) {
    sections.forEach(assemble);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      assemble(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    root: null,
    rootMargin: '5% 0px -8% 0px',
    threshold: 0.14
  });

  sections.forEach(function (section) {
    if (inViewport(section)) assemble(section);
    else observer.observe(section);
  });

  window.addEventListener('pageshow', function () {
    sections.forEach(function (section) {
      if (!section.dataset.techR2State && inViewport(section)) assemble(section);
    });
  }, { passive: true });
}());
