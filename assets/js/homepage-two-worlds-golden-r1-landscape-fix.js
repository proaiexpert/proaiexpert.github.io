/* ProAI Expert — Two Worlds Premium Stability R1.1
   Short phone landscape state authority.
   The faces and seam are CSS-synchronized; runtime only chooses one stable
   world state with hysteresis. No independent scroll-driven 3D transforms. */
(function () {
  'use strict';

  var query = window.matchMedia('(orientation: landscape) and (max-height: 540px) and (max-width: 980px) and (hover: none) and (pointer: coarse)');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-tw-r2]'));
  if (!sections.length) return;

  var raf = 0;
  var SWITCH_TO_WEB = 0.56;
  var SWITCH_TO_AI = 0.44;

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

  function focusFor(section, raw) {
    var current = section.getAttribute('data-focus') || 'ai';
    if (current === 'web') return raw <= SWITCH_TO_AI ? 'ai' : 'web';
    return raw >= SWITCH_TO_WEB ? 'web' : 'ai';
  }

  function clearLegacyGeometry(section) {
    [
      '--tw-mobile-ai-x','--tw-mobile-ai-ry','--tw-mobile-ai-z',
      '--tw-mobile-web-x','--tw-mobile-web-ry','--tw-mobile-web-z',
      '--tw-mobile-fold-x','--tw-mobile-progress','--tw-golden-landscape-raw'
    ].forEach(function (name) { section.style.removeProperty(name); });
  }

  function apply(section) {
    if (!query.matches || reducedMotion.matches) return;
    var experience = section.querySelector('[data-tw-experience]');
    var viewport = section.querySelector('[data-tw-viewport]');
    if (!experience || !viewport) return;

    var viewportHeight = Math.max(1, viewport.getBoundingClientRect().height || viewport.offsetHeight || window.innerHeight);
    var travel = Math.max(1, experience.offsetHeight - viewportHeight);
    var rect = experience.getBoundingClientRect();
    var absoluteTop = rect.top + window.scrollY;
    var raw = clamp((window.scrollY - absoluteTop) / travel, 0, 1);
    var focus = focusFor(section, raw);

    clearLegacyGeometry(section);
    section.style.setProperty('--tw-landscape-progress', raw.toFixed(3));
    if (section.getAttribute('data-focus') !== focus) section.setAttribute('data-focus', focus);
    section.setAttribute('data-tw-landscape-settled', focus);
  }

  function run() {
    raf = 0;
    if (!query.matches || reducedMotion.matches) return;
    sections.forEach(apply);
  }

  function schedule() {
    if (!query.matches || reducedMotion.matches || raf) return;
    raf = window.requestAnimationFrame(run);
  }

  function sync() {
    sections.forEach(function (section) {
      clearLegacyGeometry(section);
      if (query.matches && !reducedMotion.matches) {
        apply(section);
      } else {
        section.style.removeProperty('--tw-landscape-progress');
        section.removeAttribute('data-tw-landscape-settled');
      }
    });
  }

  window.addEventListener('scroll', schedule, { passive:true });
  window.addEventListener('resize', sync, { passive:true });
  window.addEventListener('orientationchange', function () { window.setTimeout(sync, 100); }, { passive:true });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', sync, { passive:true });
  [query,reducedMotion].forEach(function (mq) {
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', sync);
    else if (typeof mq.addListener === 'function') mq.addListener(sync);
  });
  window.addEventListener('pageshow', sync, { passive:true });

  sync();
}());
