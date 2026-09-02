/* ProAI Expert — Selected Thinking R1.5 / Editorial Light Desk */
(function () {
  'use strict';

  var sections = document.querySelectorAll('[data-selected-thinking-r1]');
  if (!sections.length) return;

  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  root.classList.add('st-r15-js');

  function settle(section) {
    if (section.classList.contains('st-r15-calm')) return;
    section.classList.add('st-r15-calm');
    section.dispatchEvent(new CustomEvent('st:r15-calm', { bubbles: false }));
  }

  function enter(section) {
    if (section.dataset.stR15Entered === 'true') return;
    section.dataset.stR15Entered = 'true';
    section.classList.add('st-r15-entered');
    section.dispatchEvent(new CustomEvent('st:r15-start', { bubbles: false }));

    if (reduce) {
      settle(section);
      return;
    }

    window.setTimeout(function () {
      settle(section);
    }, 1480);
  }

  if (reduce || !('IntersectionObserver' in window)) {
    sections.forEach(enter);
  } else {
    var observer = new IntersectionObserver(function (entries, io) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        enter(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  if (!fine || reduce) return;

  sections.forEach(function (section) {
    var lead = section.querySelector('.selected-thinking-r1__lead');
    if (!lead) return;

    var armed = true;
    var intentTimer = 0;

    function setLight(event) {
      var rect = lead.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
      var y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
      lead.style.setProperty('--st-light-x', x.toFixed(2) + '%');
      lead.style.setProperty('--st-light-y', y.toFixed(2) + '%');
    }

    function fireIntent() {
      if (!armed) return;
      armed = false;
      window.clearTimeout(intentTimer);
      lead.classList.remove('st-r15-intent');
      void lead.offsetWidth;
      lead.classList.add('st-r15-intent');
      intentTimer = window.setTimeout(function () {
        lead.classList.remove('st-r15-intent');
      }, 660);
    }

    lead.addEventListener('pointerenter', function (event) {
      if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      lead.classList.add('st-r15-pointer');
      setLight(event);
      fireIntent();
    }, { passive: true });

    lead.addEventListener('pointermove', function (event) {
      if (!lead.classList.contains('st-r15-pointer')) return;
      setLight(event);
    }, { passive: true });

    lead.addEventListener('pointerleave', function () {
      lead.classList.remove('st-r15-pointer', 'st-r15-intent');
      lead.style.removeProperty('--st-light-x');
      lead.style.removeProperty('--st-light-y');
      window.clearTimeout(intentTimer);
      armed = true;
    }, { passive: true });

    lead.addEventListener('focusin', function () {
      fireIntent();
    });

    lead.addEventListener('focusout', function () {
      window.clearTimeout(intentTimer);
      lead.classList.remove('st-r15-intent');
      armed = true;
    });
  });
})();
