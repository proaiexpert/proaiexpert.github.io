(function () {
  'use strict';

  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-tw-r2]'));
  if (!sections.length) return;

  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileQuery = window.matchMedia('(max-width: 980px), ((hover: none) and (pointer: coarse))');
  var states = new WeakMap();

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

  function stateFor(section) {
    var state = states.get(section);
    if (state) return state;
    state = {
      targetX:0,targetY:0,currentX:0,currentY:0,raf:0,
      generation:0,refitDone:-1,refitFallback:0
    };
    states.set(section, state);
    return state;
  }

  function setLight(section, x, y) {
    section.style.setProperty('--tw-r22-light-x', x.toFixed(3) + '%');
    section.style.setProperty('--tw-r22-light-y', y.toFixed(3) + '%');
  }

  function runLight(section) {
    var s = stateFor(section);
    s.raf = 0;
    if (reducedMotion.matches || mobileQuery.matches || !finePointer.matches) {
      s.currentX = s.currentY = s.targetX = s.targetY = 0;
      setLight(section, 0, 0);
      return;
    }

    s.currentX += (s.targetX - s.currentX) * 0.075;
    s.currentY += (s.targetY - s.currentY) * 0.075;
    if (Math.abs(s.targetX - s.currentX) < 0.006) s.currentX = s.targetX;
    if (Math.abs(s.targetY - s.currentY) < 0.006) s.currentY = s.targetY;
    setLight(section, s.currentX, s.currentY);

    if (s.currentX !== s.targetX || s.currentY !== s.targetY) {
      s.raf = window.requestAnimationFrame(function () { runLight(section); });
    }
  }

  function scheduleLight(section) {
    var s = stateFor(section);
    if (!s.raf) s.raf = window.requestAnimationFrame(function () { runLight(section); });
  }

  function targetNeutral(section) {
    var s = stateFor(section);
    s.targetX = 0;
    s.targetY = 0;
    scheduleLight(section);
  }

  function territoryFor(state, world) {
    if (state === 'ai') return world === 'ai' ? { start:0, end:.72, target:.73 } : { start:.692, end:1, target:.72 };
    if (state === 'web') return world === 'web' ? { start:.28, end:1, target:.73 } : { start:0, end:.308, target:.72 };
    return world === 'ai' ? { start:0, end:.515, target:.73 } : { start:.485, end:1, target:.73 };
  }

  function finalOpticalRefit(section) {
    if (mobileQuery.matches) return;
    var viewport = section.querySelector('[data-tw-viewport]');
    if (!viewport) return;
    var vr = viewport.getBoundingClientRect();
    if (!vr.width) return;
    var focus = section.getAttribute('data-focus') || 'neutral';

    ['ai','web'].forEach(function (world) {
      var face = section.querySelector('[data-tw-world="' + world + '"]');
      var inscription = section.querySelector('.tw-r2__inscription--' + world);
      if (!face || !inscription || !face.offsetWidth) return;
      var territory = territoryFor(focus, world);
      var targetCenter = vr.left + vr.width * ((territory.start + territory.end) / 2);
      var targetWidth = vr.width * (territory.end - territory.start) * territory.target;
      var ir = inscription.getBoundingClientRect();
      if (ir.width < 1) return;

      var style = window.getComputedStyle(inscription);
      var fontSize = parseFloat(style.fontSize) || 100;
      var ratio = clamp(targetWidth / ir.width, .965, 1.035);
      var correctedSize = fontSize * ratio;
      inscription.style.setProperty('--tw-r21-inscription-size', correctedSize.toFixed(2) + 'px');

      ir = inscription.getBoundingClientRect();
      var currentLeft = parseFloat(window.getComputedStyle(inscription).left) || 0;
      var visualScale = clamp(face.getBoundingClientRect().width / face.offsetWidth, .58, 1.18);
      var centerDelta = clamp((targetCenter - (ir.left + ir.width / 2)) / visualScale, -12, 12);
      inscription.style.setProperty('--tw-r21-inscription-center', (currentLeft + centerDelta).toFixed(2) + 'px');
      inscription.setAttribute('data-r22-final-refit', 'size=' + ((ratio - 1) * 100).toFixed(2) + '%;center=' + centerDelta.toFixed(2) + 'px');
    });
  }

  function refitOnce(section, generation) {
    var s = stateFor(section);
    if (s.refitDone === generation) return;
    s.refitDone = generation;
    window.clearTimeout(s.refitFallback);
    finalOpticalRefit(section);
  }

  sections.forEach(function (section) {
    var viewport = section.querySelector('[data-tw-viewport]');
    var aiFace = section.querySelector('[data-tw-world="ai"]');
    var webFace = section.querySelector('[data-tw-world="web"]');
    if (!viewport || !aiFace || !webFace) return;

    stateFor(section);

    viewport.addEventListener('pointermove', function (event) {
      if (!finePointer.matches || mobileQuery.matches || reducedMotion.matches) return;
      var focus = section.getAttribute('data-focus');
      if (focus !== 'ai' && focus !== 'web') {
        targetNeutral(section);
        return;
      }
      var rect = viewport.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var nx = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
      var ny = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
      var s = stateFor(section);
      s.targetX = nx * 4.5;
      s.targetY = ny * 2.6;
      scheduleLight(section);
    }, { passive:true });

    viewport.addEventListener('pointerleave', function () { targetNeutral(section); }, { passive:true });

    var observer = new MutationObserver(function (records) {
      if (!records.some(function (record) { return record.attributeName === 'data-focus'; })) return;
      var s = stateFor(section);
      s.generation += 1;
      var generation = s.generation;
      var focus = section.getAttribute('data-focus') || 'neutral';
      if (focus === 'neutral' || focus === 'turn' || mobileQuery.matches) targetNeutral(section);

      window.clearTimeout(s.refitFallback);
      if (!mobileQuery.matches && !reducedMotion.matches) {
        s.refitFallback = window.setTimeout(function () { refitOnce(section, generation); }, focus === 'neutral' ? 650 : 820);
      }
    });
    observer.observe(section, { attributes:true, attributeFilter:['data-focus'] });

    [aiFace, webFace].forEach(function (face) {
      face.addEventListener('transitionend', function (event) {
        if (event.target !== face || event.propertyName !== 'transform') return;
        var s = stateFor(section);
        var focus = section.getAttribute('data-focus') || 'neutral';
        var world = face.getAttribute('data-tw-world');
        if (focus === 'neutral' || focus === world) refitOnce(section, s.generation);
      });
    });
  });

  function syncMode() {
    sections.forEach(function (section) {
      if (mobileQuery.matches || reducedMotion.matches || !finePointer.matches) targetNeutral(section);
    });
  }

  [finePointer, reducedMotion, mobileQuery].forEach(function (query) {
    if (typeof query.addEventListener === 'function') query.addEventListener('change', syncMode);
    else if (typeof query.addListener === 'function') query.addListener(syncMode);
  });

  syncMode();
}());
