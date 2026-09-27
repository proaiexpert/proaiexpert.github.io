/* ProAI Expert — Selected Thinking / Decision Aperture + Trace R2.1
   Attention-timed one-shot signature: ARRIVE → ORIENT → RESOLVE → ABSOLUTE CALM. */
(function () {
  'use strict';

  var sections = document.querySelectorAll('[data-selected-thinking-r2]');
  if (!sections.length) return;

  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasObserver = 'IntersectionObserver' in window;
  root.classList.add('st-r2-js', 'st-r21-js');

  function isPortrait() {
    return window.matchMedia && window.matchMedia('(max-width: 759px) and (orientation: portrait)').matches;
  }

  function isPhoneLandscape() {
    return window.matchMedia && window.matchMedia('(orientation: landscape) and (min-width: 760px) and (max-width: 1100px) and (max-height: 600px)').matches;
  }

  function orientationDelay() {
    if (isPhoneLandscape()) return 260;
    if (isPortrait()) return 360;
    return 320;
  }

  function calmDelay() {
    if (isPhoneLandscape()) return 1860;
    if (isPortrait()) return 2200;
    return 2120;
  }

  function settle(section) {
    if (section.classList.contains('st-r2-calm')) return;
    section.classList.add('st-r2-calm');
    section.classList.remove('st-r21-eligible');
    section.dataset.stR21Calm = 'true';
    section.dispatchEvent(new CustomEvent('st:r21-calm', { bubbles: false }));
  }

  function settleImmediately(section, reason) {
    if (section.dataset.stR2Entered === 'true') {
      settle(section);
      return;
    }
    section.dataset.stR2Entered = 'true';
    section.dataset.stR21Immediate = reason || 'fallback';
    section.classList.add('st-r2-entered', 'st-r2-calm');
    section.classList.remove('st-r21-eligible');
  }

  function start(section) {
    if (section.dataset.stR2Entered === 'true') return;

    section.dataset.stR2Entered = 'true';
    section.dataset.stR21Started = 'true';
    section.classList.remove('st-r21-eligible');
    section.classList.add('st-r2-entered');
    section.dispatchEvent(new CustomEvent('st:r21-start', { bubbles: false }));

    window.setTimeout(function () {
      settle(section);
    }, calmDelay());
  }

  if (reduce) {
    sections.forEach(function (section) {
      settleImmediately(section, 'reduced-motion');
    });
    return;
  }

  if (!hasObserver) {
    sections.forEach(function (section) {
      settleImmediately(section, 'no-intersection-observer');
    });
    return;
  }

  sections.forEach(function (section) {
    var target = section.querySelector('.st-r2__trace-zone');
    if (!target) {
      settleImmediately(section, 'missing-trace-target');
      return;
    }

    var pendingTimer = 0;

    function cancelPending() {
      if (!pendingTimer) return;
      window.clearTimeout(pendingTimer);
      pendingTimer = 0;
      section.classList.remove('st-r21-eligible');
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (section.dataset.stR2Entered === 'true') {
          observer.disconnect();
          cancelPending();
          return;
        }

        if (entry.isIntersecting) {
          if (pendingTimer) return;

          section.classList.add('st-r21-eligible');
          section.dataset.stR21Eligible = 'true';
          section.dispatchEvent(new CustomEvent('st:r21-eligible', { bubbles: false }));

          pendingTimer = window.setTimeout(function () {
            pendingTimer = 0;
            if (section.dataset.stR2Entered === 'true') return;

            var rect = target.getBoundingClientRect();
            var viewportH = window.innerHeight || document.documentElement.clientHeight;
            var attentionTop = viewportH * 0.18;
            var attentionBottom = viewportH * 0.70;
            var stillInAttentionWindow = rect.bottom > attentionTop && rect.top < attentionBottom;

            if (stillInAttentionWindow) {
              start(section);
              observer.disconnect();
            } else {
              section.classList.remove('st-r21-eligible');
            }
          }, orientationDelay());

          return;
        }

        cancelPending();

        /* Scroll restoration / deep entry below the authored moment:
           never leave the section in a half-resolved pre-motion state. */
        var rect = entry.boundingClientRect;
        var viewportH = window.innerHeight || document.documentElement.clientHeight;
        if (rect.bottom < viewportH * 0.18) {
          settleImmediately(section, 'trace-already-passed');
          observer.disconnect();
        }
      });
    }, {
      threshold: [0, 0.22, 0.5],
      rootMargin: '-18% 0px -30% 0px'
    });

    observer.observe(target);
  });
})();