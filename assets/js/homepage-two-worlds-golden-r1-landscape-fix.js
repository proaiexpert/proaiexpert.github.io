/* Golden Assembly R1.2 — Two Worlds short-landscape scroll stabilization.
   Runs after the canonical Golden R1 runtime and becomes the sole geometry
   authority inside coarse-pointer phone landscape. The 3D turn stays continuous,
   while visible content switches through a hysteresis band with no blank state. */
(function () {
  'use strict';

  var query = window.matchMedia('(orientation: landscape) and (max-height: 540px) and (max-width: 980px) and (hover: none) and (pointer: coarse)');
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-tw-r2]'));
  if (!sections.length) return;

  var raf = 0;
  var MOVE_START = 0.07;
  var MOVE_END = 0.69;
  var SWITCH_TO_WEB = 0.405;
  var SWITCH_TO_AI = 0.355;

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function smoothstep(value) { return value * value * (3 - (2 * value)); }

  /* Schmitt-trigger style focus switching. Between the two thresholds we keep
     the current world, so tiny scroll/viewport fluctuations cannot flip state. */
  function focusFor(section, raw) {
    var current = section.getAttribute('data-focus') || 'neutral';
    if (current === 'ai') return raw >= SWITCH_TO_WEB ? 'web' : 'ai';
    if (current === 'web') return raw <= SWITCH_TO_AI ? 'ai' : 'web';
    return raw >= ((SWITCH_TO_AI + SWITCH_TO_WEB) / 2) ? 'web' : 'ai';
  }

  function apply(section) {
    if (!query.matches) return;
    var experience = section.querySelector('[data-tw-experience]');
    var viewport = section.querySelector('[data-tw-viewport]');
    if (!experience || !viewport) return;

    /* Use the CSS-controlled sticky viewport height instead of window.innerHeight.
       Browser chrome can change innerHeight while the user is not actually moving,
       which must not perturb normalized progress. */
    var viewportHeight = Math.max(1, viewport.getBoundingClientRect().height || viewport.offsetHeight || window.innerHeight);
    var travel = Math.max(1, experience.offsetHeight - viewportHeight);
    var rect = experience.getBoundingClientRect();
    var absoluteTop = rect.top + window.scrollY;
    var raw = clamp((window.scrollY - absoluteTop) / travel, 0, 1);
    var t = clamp((raw - MOVE_START) / (MOVE_END - MOVE_START), 0, 1);
    var p = (0.70 * t) + (0.30 * smoothstep(t));
    var focus = focusFor(section, raw);

    section.style.setProperty('--tw-mobile-ai-x', (-82 * p).toFixed(2) + '%');
    section.style.setProperty('--tw-mobile-ai-ry', (-3 - (69 * p)).toFixed(2) + 'deg');
    section.style.setProperty('--tw-mobile-ai-z', (-110 * p).toFixed(2) + 'px');
    section.style.setProperty('--tw-mobile-web-x', (82 * (1 - p)).toFixed(2) + '%');
    section.style.setProperty('--tw-mobile-web-ry', (72 - (69 * p)).toFixed(2) + 'deg');
    section.style.setProperty('--tw-mobile-web-z', (-110 * (1 - p)).toFixed(2) + 'px');
    section.style.setProperty('--tw-mobile-fold-x', (105 - (110 * p)).toFixed(2) + '%');
    section.style.setProperty('--tw-mobile-progress', p.toFixed(3));
    section.style.setProperty('--tw-golden-landscape-raw', raw.toFixed(3));

    if (section.getAttribute('data-focus') !== focus) section.setAttribute('data-focus', focus);

    /* Settled means the physical plate is actually at an endpoint, not merely
       that one world's content currently owns the focus state. */
    if (p <= 0.001) section.setAttribute('data-tw-landscape-settled', 'ai');
    else if (p >= 0.999) section.setAttribute('data-tw-landscape-settled', 'web');
    else section.removeAttribute('data-tw-landscape-settled');
  }

  function run() {
    raf = 0;
    if (!query.matches) return;
    sections.forEach(apply);
  }

  function schedule() {
    if (!query.matches || raf) return;
    raf = window.requestAnimationFrame(run);
  }

  function sync() {
    if (query.matches) schedule();
    else sections.forEach(function (section) {
      section.style.removeProperty('--tw-golden-landscape-raw');
      section.removeAttribute('data-tw-landscape-settled');
    });
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('orientationchange', function () { window.setTimeout(sync, 80); }, { passive: true });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', sync, { passive: true });
  if (typeof query.addEventListener === 'function') query.addEventListener('change', sync);
  else if (typeof query.addListener === 'function') query.addListener(sync);

  sync();
}());
