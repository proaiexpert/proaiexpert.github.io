(function () {
  'use strict';

  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-tw-r2]'));
  if (!sections.length) return;

  var mobileQuery = window.matchMedia('(max-width: 980px), ((hover: none) and (pointer: coarse))');
  var raf = 0;
  var meters = new Map();

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

  function territoryFor(state, world, mobile) {
    if (mobile) return { start:0, end:1, target:.73 };
    if (state === 'ai') {
      return world === 'ai' ? { start:0, end:.72, target:.73 } : { start:.692, end:1, target:.72 };
    }
    if (state === 'web') {
      return world === 'web' ? { start:.28, end:1, target:.73 } : { start:0, end:.308, target:.72 };
    }
    return world === 'ai' ? { start:0, end:.515, target:.73 } : { start:.485, end:1, target:.73 };
  }

  function meterFor(inscription) {
    var style = window.getComputedStyle(inscription);
    var key = inscription.textContent + '|' + style.fontFamily + '|' + style.fontWeight + '|' + style.letterSpacing;
    if (meters.has(key)) return meters.get(key);
    var meter = document.createElement('span');
    meter.textContent = inscription.textContent;
    meter.setAttribute('aria-hidden', 'true');
    meter.style.cssText = [
      'position:fixed','left:-10000px','top:-10000px','visibility:hidden','white-space:nowrap',
      'font-family:' + style.fontFamily,
      'font-weight:' + style.fontWeight,
      'font-style:' + style.fontStyle,
      'font-stretch:' + style.fontStretch,
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

  function fitSection(section) {
    var viewport = section.querySelector('[data-tw-viewport]');
    if (!viewport) return;
    var vr = viewport.getBoundingClientRect();
    if (!vr.width) return;
    var mobile = mobileQuery.matches;
    var state = section.getAttribute('data-focus') || 'neutral';

    ['ai','web'].forEach(function (world) {
      var face = section.querySelector('[data-tw-world="' + world + '"]');
      var inscription = section.querySelector('.tw-r2__inscription--' + world);
      if (!face || !inscription || !face.offsetWidth) return;

      var territory = territoryFor(state, world, mobile);
      var targetCenter = vr.left + vr.width * ((territory.start + territory.end) / 2);
      var usableWidth = vr.width * (territory.end - territory.start);
      var targetWidth = usableWidth * territory.target;
      var measuredAt100 = meterFor(inscription);
      var limits = mobile ? [38,160] : [48,220];

      /* Work in the face's pre-transform coordinate system, then optically correct
         against the rendered result. This avoids transformed getBoundingClientRect
         becoming the positioning model for recessed faces. */
      var localCenter = (targetCenter - vr.left) - face.offsetLeft;
      inscription.style.setProperty('--tw-r21-inscription-center', localCenter.toFixed(2) + 'px');

      var faceRect = face.getBoundingClientRect();
      var visualScale = clamp(faceRect.width / face.offsetWidth, .58, 1.18);
      var desired = clamp((100 * targetWidth / measuredAt100) / visualScale, limits[0], limits[1]);
      inscription.style.setProperty('--tw-r21-inscription-size', desired.toFixed(2) + 'px');

      /* One measured refinement keeps actual rendered width at the optical target
         without scaleX or altered letter proportions. */
      var ir = inscription.getBoundingClientRect();
      if (ir.width > 1) {
        desired = clamp(desired * (targetWidth / ir.width), limits[0], limits[1]);
        inscription.style.setProperty('--tw-r21-inscription-size', desired.toFixed(2) + 'px');
        ir = inscription.getBoundingClientRect();
      }

      if (ir.width > 1) {
        var scaleX = clamp(face.getBoundingClientRect().width / face.offsetWidth, .58, 1.18);
        localCenter += (targetCenter - (ir.left + ir.width / 2)) / scaleX;
        inscription.style.setProperty('--tw-r21-inscription-center', localCenter.toFixed(2) + 'px');
        ir = inscription.getBoundingClientRect();
      }

      inscription.setAttribute('data-r21-fit', Math.round(targetWidth) + 'px');
      inscription.setAttribute('data-r21-rendered', Math.round(ir.width) + 'px');
    });
  }

  function fitAll() {
    raf = 0;
    sections.forEach(fitSection);
  }

  function scheduleFit() {
    if (raf) return;
    raf = window.requestAnimationFrame(fitAll);
  }

  sections.forEach(function (section) {
    var observer = new MutationObserver(function (records) {
      if (records.some(function (r) { return r.attributeName === 'data-focus'; })) scheduleFit();
    });
    observer.observe(section, { attributes:true, attributeFilter:['data-focus'] });
    if ('ResizeObserver' in window) new ResizeObserver(scheduleFit).observe(section);
  });

  window.addEventListener('resize', scheduleFit, { passive:true });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', scheduleFit, { passive:true });
  if (typeof mobileQuery.addEventListener === 'function') mobileQuery.addEventListener('change', scheduleFit);
  else if (typeof mobileQuery.addListener === 'function') mobileQuery.addListener(scheduleFit);

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleFit);
  scheduleFit();
}());
