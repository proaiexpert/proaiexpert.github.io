/* Golden Assembly R1.2 — Two Worlds short-landscape scroll stabilization.
   Runs after the canonical Golden R1 runtime and only overrides its mobile
   geometry variables inside coarse-pointer phone landscape. */
(function () {
  'use strict';

  var query = window.matchMedia('(orientation: landscape) and (max-height: 540px) and (max-width: 980px) and (hover: none) and (pointer: coarse)');
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-tw-r2]'));
  if (!sections.length) return;

  var raf = 0;
  var START_TURN = 0.20;
  var END_TURN = 0.56;

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function smoothstep(value) { return value * value * (3 - (2 * value)); }

  function apply(section) {
    if (!query.matches) return;
    var experience = section.querySelector('[data-tw-experience]');
    if (!experience) return;

    var rect = experience.getBoundingClientRect();
    var travel = Math.max(1, rect.height - window.innerHeight);
    var raw = clamp(-rect.top / travel, 0, 1);
    var t = clamp((raw - START_TURN) / (END_TURN - START_TURN), 0, 1);
    var p = smoothstep(t);

    section.style.setProperty('--tw-mobile-ai-x', (-82 * p).toFixed(2) + '%');
    section.style.setProperty('--tw-mobile-ai-ry', (-3 - (69 * p)).toFixed(2) + 'deg');
    section.style.setProperty('--tw-mobile-ai-z', (-110 * p).toFixed(2) + 'px');
    section.style.setProperty('--tw-mobile-web-x', (82 * (1 - p)).toFixed(2) + '%');
    section.style.setProperty('--tw-mobile-web-ry', (72 - (69 * p)).toFixed(2) + 'deg');
    section.style.setProperty('--tw-mobile-web-z', (-110 * (1 - p)).toFixed(2) + 'px');
    section.style.setProperty('--tw-mobile-fold-x', (105 - (110 * p)).toFixed(2) + '%');
    section.style.setProperty('--tw-mobile-progress', p.toFixed(3));
    section.style.setProperty('--tw-golden-landscape-raw', raw.toFixed(3));

    var focus = raw < START_TURN ? 'ai' : (raw < END_TURN ? 'turn' : 'web');
    if (section.getAttribute('data-focus') !== focus) section.setAttribute('data-focus', focus);
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
