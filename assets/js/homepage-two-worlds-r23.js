(function () {
  'use strict';

  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-tw-r2]'));
  if (!sections.length) return;

  var mobileQuery = window.matchMedia('(max-width: 980px), ((hover: none) and (pointer: coarse))');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var raf = 0;
  var meters = new Map();

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function isLandscape() {
    return window.innerWidth > window.innerHeight && window.innerHeight <= 540;
  }

  function makeOverlay(section, viewport, world) {
    var source = section.querySelector('.tw-r2__inscription--' + world);
    if (!source) return null;

    var node = document.createElement('div');
    node.className = 'tw-r23-mobile-inscription';
    node.setAttribute('data-world', world);
    node.setAttribute('aria-hidden', 'true');
    node.textContent = source.textContent.trim();
    viewport.appendChild(node);
    return node;
  }

  function meterWidth(node) {
    var style = window.getComputedStyle(node);
    var key = node.textContent + '|' + style.fontFamily + '|' + style.fontWeight + '|' + style.letterSpacing;
    if (meters.has(key)) return meters.get(key);

    var meter = document.createElement('span');
    meter.textContent = node.textContent;
    meter.setAttribute('aria-hidden', 'true');
    meter.style.cssText = [
      'position:fixed',
      'left:-10000px',
      'top:-10000px',
      'visibility:hidden',
      'white-space:nowrap',
      'font-family:' + style.fontFamily,
      'font-weight:' + style.fontWeight,
      'font-size:100px',
      'letter-spacing:' + style.letterSpacing,
      'line-height:1'
    ].join(';');
    document.body.appendChild(meter);
    var width = Math.max(1, meter.getBoundingClientRect().width);
    meter.remove();
    meters.set(key, width);
    return width;
  }

  function fitOverlay(section) {
    if (!mobileQuery.matches || reducedMotion.matches) {
      section.removeAttribute('data-r23-mobile-macro');
      return;
    }

    var viewport = section.querySelector('[data-tw-viewport]');
    if (!viewport) return;
    var width = viewport.clientWidth;
    if (!width) return;

    var landscape = isLandscape();
    var targetRatio = landscape ? 0.70 : 0.74;
    var targetWidth = width * targetRatio;
    var limits = landscape ? [34, 160] : [40, 150];

    ['ai', 'web'].forEach(function (world) {
      var node = viewport.querySelector('.tw-r23-mobile-inscription[data-world="' + world + '"]');
      if (!node) node = makeOverlay(section, viewport, world);
      if (!node) return;

      var measured = meterWidth(node);
      var size = clamp((100 * targetWidth) / measured, limits[0], limits[1]);
      node.style.setProperty('--tw-r23-mobile-macro-size', size.toFixed(2) + 'px');

      /* Final optical-width refinement uses the actual rendered glyph geometry.
         This absorbs font-load and EN/RU glyph differences without language offsets. */
      var rendered = node.getBoundingClientRect().width;
      if (rendered > 1) {
        size = clamp(size * (targetWidth / rendered), limits[0], limits[1]);
        node.style.setProperty('--tw-r23-mobile-macro-size', size.toFixed(2) + 'px');
        rendered = node.getBoundingClientRect().width;
      }

      node.setAttribute('data-r23-target', Math.round(targetWidth) + 'px');
      node.setAttribute('data-r23-rendered', Math.round(rendered) + 'px');
    });

    section.setAttribute('data-r23-mobile-macro', 'ready');
  }

  function fitAll() {
    raf = 0;
    sections.forEach(fitOverlay);
  }

  function scheduleFit() {
    if (!raf) raf = window.requestAnimationFrame(fitAll);
  }

  sections.forEach(function (section) {
    var viewport = section.querySelector('[data-tw-viewport]');
    if (!viewport) return;

    if ('ResizeObserver' in window) {
      new ResizeObserver(scheduleFit).observe(viewport);
    }

    var observer = new MutationObserver(function (records) {
      if (records.some(function (record) { return record.attributeName === 'data-focus'; })) {
        scheduleFit();
      }
    });
    observer.observe(section, { attributes:true, attributeFilter:['data-focus'] });
  });

  window.addEventListener('resize', scheduleFit, { passive:true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', scheduleFit, { passive:true });
  }

  [mobileQuery, reducedMotion].forEach(function (query) {
    if (typeof query.addEventListener === 'function') query.addEventListener('change', scheduleFit);
    else if (typeof query.addListener === 'function') query.addListener(scheduleFit);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleFit);
  }

  scheduleFit();
}());
