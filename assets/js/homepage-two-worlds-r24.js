(function () {
  'use strict';

  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-tw-r2]'));
  if (!sections.length) return;

  var mobileQuery = window.matchMedia('(max-width: 980px), ((hover: none) and (pointer: coarse))');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var scheduled = 0;
  var scrollTimer = 0;

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function landscape() { return window.innerWidth > window.innerHeight && window.innerHeight <= 540; }

  function fitWorld(section, world, targetRatio) {
    var viewport = section.querySelector('[data-tw-viewport]');
    var face = section.querySelector('[data-tw-world="' + world + '"]');
    var inscription = section.querySelector('.tw-r2__inscription--' + world);
    if (!viewport || !face || !inscription || !face.offsetWidth) return;

    var vr = viewport.getBoundingClientRect();
    if (!vr.width) return;
    var targetWidth = vr.width * targetRatio;
    var limits = landscape() ? [30,132] : [32,132];

    /* Measure at a canonical 100px inside the ACTUAL settled face transform.
       This preserves glyph proportions and absorbs EN/RU font metrics without
       language offsets or scaleX. */
    var localCenter = face.offsetWidth / 2;
    inscription.style.setProperty('--tw-r24-inscription-center',localCenter.toFixed(2) + 'px');
    inscription.style.setProperty('--tw-r24-inscription-size','100px');
    var probe = inscription.getBoundingClientRect();
    if (probe.width < 1) return;

    var size = clamp(100 * targetWidth / probe.width,limits[0],limits[1]);
    inscription.style.setProperty('--tw-r24-inscription-size',size.toFixed(2) + 'px');
    var ir = inscription.getBoundingClientRect();
    if (ir.width > 1) {
      size = clamp(size * targetWidth / ir.width,limits[0],limits[1]);
      inscription.style.setProperty('--tw-r24-inscription-size',size.toFixed(2) + 'px');
      ir = inscription.getBoundingClientRect();
    }

    if (ir.width > 1) {
      var faceScale = clamp(face.getBoundingClientRect().width / face.offsetWidth,.72,1.12);
      var targetCenter = vr.left + vr.width / 2;
      var delta = clamp((targetCenter - (ir.left + ir.width / 2)) / faceScale,-28,28);
      localCenter += delta;
      inscription.style.setProperty('--tw-r24-inscription-center',localCenter.toFixed(2) + 'px');
      ir = inscription.getBoundingClientRect();
    }

    inscription.setAttribute('data-r24-width',Math.round(ir.width) + 'px');
    inscription.setAttribute('data-r24-center-error',((ir.left + ir.width/2) - (vr.left + vr.width/2)).toFixed(2) + 'px');
  }

  function fitSection(section) {
    if (!mobileQuery.matches || reducedMotion.matches) {
      section.removeAttribute('data-r24-mobile-inscription');
      return;
    }
    var focus = section.getAttribute('data-focus') || 'neutral';
    var ratio = landscape() ? .60 : .66;
    if (focus === 'ai' || focus === 'web') fitWorld(section,focus,ratio);
    section.setAttribute('data-r24-mobile-inscription','ready');
  }

  function run() { scheduled = 0; sections.forEach(fitSection); }
  function schedule() {
    if (scheduled) return;
    scheduled = window.requestAnimationFrame(function () { window.requestAnimationFrame(run); });
  }

  sections.forEach(function (section) {
    var viewport = section.querySelector('[data-tw-viewport]');
    if (!viewport) return;
    var observer = new MutationObserver(function (records) {
      if (records.some(function (r) { return r.attributeName === 'data-focus'; })) schedule();
    });
    observer.observe(section,{attributes:true,attributeFilter:['data-focus']});
    if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(viewport);
  });

  window.addEventListener('scroll',function () {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(schedule,80);
  },{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  if (window.visualViewport) window.visualViewport.addEventListener('resize',schedule,{passive:true});
  [mobileQuery,reducedMotion].forEach(function (query) {
    if (typeof query.addEventListener === 'function') query.addEventListener('change',schedule);
    else if (typeof query.addListener === 'function') query.addListener(schedule);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  schedule();
}());
