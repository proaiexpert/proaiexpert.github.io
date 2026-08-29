/* ProAI Expert — Two Worlds Golden Synthesis R1
   GEOMETRY: R2.1 | MOTION/MATERIAL: R2.2 | FACE-BOUND INSCRIPTION: R2.4
   No R2.3 viewport overlay. No R2.5 logic. */
(function () {
  'use strict';

  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-tw-r2]'));
  if (!sections.length) return;

  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var mobileQuery = window.matchMedia('(max-width: 980px), ((hover: none) and (pointer: coarse))');
  var shortLandscapeQuery = window.matchMedia('(orientation: landscape) and (max-height: 540px) and (max-width: 980px) and (hover: none) and (pointer: coarse)');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var meters = new Map();
  var states = new WeakMap();
  var scrollRaf = 0;

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function isLandscape() { return window.innerWidth > window.innerHeight && window.innerHeight <= 540; }

  function stateFor(section) {
    var state = states.get(section);
    if (state) return state;
    state = { targetX:0, targetY:0, currentX:0, currentY:0, lightRaf:0, fitRaf:0, leaveTimer:0 };
    states.set(section, state);
    return state;
  }

  function setLight(section, x, y) {
    section.style.setProperty('--tw-g-light-x', x.toFixed(3) + '%');
    section.style.setProperty('--tw-g-light-y', y.toFixed(3) + '%');
  }

  function runLight(section) {
    var s = stateFor(section);
    s.lightRaf = 0;
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
      s.lightRaf = window.requestAnimationFrame(function () { runLight(section); });
    }
  }

  function scheduleLight(section) {
    var s = stateFor(section);
    if (!s.lightRaf) s.lightRaf = window.requestAnimationFrame(function () { runLight(section); });
  }

  function neutralLight(section) {
    var s = stateFor(section);
    s.targetX = 0;
    s.targetY = 0;
    scheduleLight(section);
  }

  function meterWidth(inscription) {
    var style = window.getComputedStyle(inscription);
    var key = inscription.textContent + '|' + style.fontFamily + '|' + style.fontWeight + '|' + style.letterSpacing;
    if (meters.has(key)) return meters.get(key);
    var meter = document.createElement('span');
    meter.textContent = inscription.textContent;
    meter.setAttribute('aria-hidden', 'true');
    meter.style.cssText = [
      'position:fixed','left:-10000px','top:-10000px','visibility:hidden','white-space:nowrap',
      'font-family:' + style.fontFamily,'font-weight:' + style.fontWeight,'font-style:' + style.fontStyle,
      'font-size:100px','letter-spacing:' + style.letterSpacing,'line-height:1'
    ].join(';');
    document.body.appendChild(meter);
    var width = Math.max(1, meter.getBoundingClientRect().width);
    meter.remove();
    meters.set(key, width);
    return width;
  }

  function desktopTerritory(focus, world) {
    if (focus === 'ai') return world === 'ai' ? { start:0, end:.72, target:.73 } : { start:.692, end:1, target:.72 };
    if (focus === 'web') return world === 'web' ? { start:.28, end:1, target:.73 } : { start:0, end:.308, target:.72 };
    return world === 'ai' ? { start:0, end:.515, target:.73 } : { start:.485, end:1, target:.73 };
  }

  function fitInscription(section, world) {
    var viewport = section.querySelector('[data-tw-viewport]');
    var face = section.querySelector('[data-tw-world="' + world + '"]');
    var inscription = section.querySelector('.tw-r2__inscription--' + world);
    if (!viewport || !face || !inscription || !face.offsetWidth) return;
    var vr = viewport.getBoundingClientRect();
    if (!vr.width) return;

    var focus = section.getAttribute('data-focus') || 'neutral';
    var targetCenter;
    var targetWidth;
    var limits;

    if (mobileQuery.matches) {
      if (focus !== world) return;
      var ratio = isLandscape() ? .66 : .72;
      targetCenter = vr.left + vr.width / 2;
      targetWidth = vr.width * ratio;
      limits = [32,132];
    } else {
      var territory = desktopTerritory(focus, world);
      var territoryTarget = window.innerWidth <= 1200 ? Math.min(.79, territory.target + .06) : territory.target;
      targetCenter = vr.left + vr.width * ((territory.start + territory.end) / 2);
      targetWidth = vr.width * (territory.end - territory.start) * territoryTarget;
      limits = [48,220];
    }

    var measured = meterWidth(inscription);
    var visualScale = clamp(face.getBoundingClientRect().width / face.offsetWidth, .58, 1.18);
    var size = clamp((100 * targetWidth / measured) / visualScale, limits[0], limits[1]);
    var localCenter = (targetCenter - vr.left) - face.offsetLeft;

    inscription.style.setProperty('--tw-g-inscription-center', localCenter.toFixed(2) + 'px');
    inscription.style.setProperty('--tw-g-inscription-size', size.toFixed(2) + 'px');

    var ir = inscription.getBoundingClientRect();
    if (ir.width > 1) {
      size = clamp(size * targetWidth / ir.width, limits[0], limits[1]);
      inscription.style.setProperty('--tw-g-inscription-size', size.toFixed(2) + 'px');
      ir = inscription.getBoundingClientRect();
    }
    if (ir.width > 1) {
      visualScale = clamp(face.getBoundingClientRect().width / face.offsetWidth, .58, 1.18);
      localCenter += clamp((targetCenter - (ir.left + ir.width / 2)) / visualScale, -28, 28);
      inscription.style.setProperty('--tw-g-inscription-center', localCenter.toFixed(2) + 'px');
      ir = inscription.getBoundingClientRect();
    }

    inscription.setAttribute('data-golden-rendered-width', Math.round(ir.width) + 'px');
    inscription.setAttribute('data-golden-center-error', ((ir.left + ir.width / 2) - targetCenter).toFixed(2) + 'px');
  }

  function fitSection(section) {
    fitInscription(section, 'ai');
    fitInscription(section, 'web');
  }

  function scheduleFit(section) {
    var s = stateFor(section);
    if (s.fitRaf) return;
    s.fitRaf = window.requestAnimationFrame(function () {
      s.fitRaf = 0;
      window.requestAnimationFrame(function () { fitSection(section); });
    });
  }

  function setMobileGeometry(section, progress) {
    if (reducedMotion.matches) return;
    var p = clamp(progress, 0, 1);
    section.style.setProperty('--tw-mobile-ai-x', (-82 * p).toFixed(2) + '%');
    section.style.setProperty('--tw-mobile-ai-ry', (-3 - 69 * p).toFixed(2) + 'deg');
    section.style.setProperty('--tw-mobile-ai-z', (-110 * p).toFixed(2) + 'px');
    section.style.setProperty('--tw-mobile-web-x', (82 * (1 - p)).toFixed(2) + '%');
    section.style.setProperty('--tw-mobile-web-ry', (72 - 69 * p).toFixed(2) + 'deg');
    section.style.setProperty('--tw-mobile-web-z', (-110 * (1 - p)).toFixed(2) + 'px');
    section.style.setProperty('--tw-mobile-fold-x', (105 - 110 * p).toFixed(2) + '%');
    section.style.setProperty('--tw-mobile-progress', p.toFixed(3));

    /* Narrower deliberate THE TURN than the historical 0.34–0.66 band. */
    var next = p < .43 ? 'ai' : (p > .57 ? 'web' : 'turn');
    if (section.getAttribute('data-focus') !== next) section.setAttribute('data-focus', next);
    scheduleFit(section);
  }

  function updateMobileSection(section) {
    if (!mobileQuery.matches || reducedMotion.matches || shortLandscapeQuery.matches) return;
    var experience = section.querySelector('[data-tw-experience]');
    if (!experience) return;
    var rect = experience.getBoundingClientRect();
    var travel = Math.max(1, rect.height - window.innerHeight);
    setMobileGeometry(section, clamp(-rect.top / travel, 0, 1));
  }

  function applyMobileContentGeometry(section) {
    ['ai','web'].forEach(function (world) {
      var node = section.querySelector('.tw-r2__content--' + world);
      if (!node) return;
      if (mobileQuery.matches && !isLandscape()) {
        node.style.right = 'var(--tw-g-mobile-inset)';
        node.style.width = 'auto';
        node.style.maxWidth = 'none';
      } else {
        node.style.removeProperty('right');
        node.style.removeProperty('width');
        node.style.removeProperty('max-width');
      }
    });
  }

  sections.forEach(function (section) {
    var viewport = section.querySelector('[data-tw-viewport]');
    var aiWorld = section.querySelector('[data-tw-world="ai"]');
    var webWorld = section.querySelector('[data-tw-world="web"]');
    if (!viewport || !aiWorld || !webWorld) return;
    stateFor(section);

    viewport.addEventListener('pointermove', function (event) {
      if (!finePointer.matches || mobileQuery.matches) return;
      var rect = viewport.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var x = clamp(event.clientX - rect.left, 0, rect.width);
      var y = clamp(event.clientY - rect.top, 0, rect.height);
      var percent = x / rect.width * 100;
      var next = percent < 47 ? 'ai' : (percent > 53 ? 'web' : 'neutral');
      window.clearTimeout(stateFor(section).leaveTimer);
      if (section.getAttribute('data-focus') !== next) section.setAttribute('data-focus', next);
      section.style.setProperty('--tw-pointer-x', (x / rect.width * 100).toFixed(2) + '%');
      section.style.setProperty('--tw-pointer-y', (y / rect.height * 100).toFixed(2) + '%');

      if (next === 'ai' || next === 'web') {
        var s = stateFor(section);
        s.targetX = clamp(((x / rect.width) - .5) * 2, -1, 1) * 4.5;
        s.targetY = clamp(((y / rect.height) - .5) * 2, -1, 1) * 2.6;
        scheduleLight(section);
      } else neutralLight(section);
      scheduleFit(section);
    }, { passive:true });

    viewport.addEventListener('pointerleave', function () {
      if (!finePointer.matches || mobileQuery.matches) return;
      var s = stateFor(section);
      window.clearTimeout(s.leaveTimer);
      neutralLight(section);
      s.leaveTimer = window.setTimeout(function () {
        section.setAttribute('data-focus', 'neutral');
        scheduleFit(section);
      }, 170);
    }, { passive:true });

    section.addEventListener('focusin', function (event) {
      if (mobileQuery.matches) return;
      if (aiWorld.contains(event.target)) section.setAttribute('data-focus', 'ai');
      if (webWorld.contains(event.target)) section.setAttribute('data-focus', 'web');
      scheduleFit(section);
    });

    section.addEventListener('focusout', function () {
      if (mobileQuery.matches) return;
      window.requestAnimationFrame(function () {
        if (!section.contains(document.activeElement)) {
          section.setAttribute('data-focus', 'neutral');
          scheduleFit(section);
        }
      });
    });

    new MutationObserver(function (records) {
      if (records.some(function (record) { return record.attributeName === 'data-focus'; })) scheduleFit(section);
    }).observe(section, { attributes:true, attributeFilter:['data-focus'] });

    if ('ResizeObserver' in window) new ResizeObserver(function () { scheduleFit(section); }).observe(viewport);
  });

  function runScroll() {
    scrollRaf = 0;
    sections.forEach(updateMobileSection);
  }
  function scheduleScroll() {
    if (!scrollRaf) scrollRaf = window.requestAnimationFrame(runScroll);
  }

  function syncMode() {
    sections.forEach(function (section) {
      applyMobileContentGeometry(section);
      if (mobileQuery.matches) {
        neutralLight(section);
        if (reducedMotion.matches) {
          section.setAttribute('data-focus', 'neutral');
        } else updateMobileSection(section);
      } else {
        section.setAttribute('data-focus', 'neutral');
        section.style.removeProperty('--tw-mobile-progress');
      }
      scheduleFit(section);
    });
  }

  window.addEventListener('scroll', scheduleScroll, { passive:true });
  window.addEventListener('resize', function () { syncMode(); scheduleScroll(); }, { passive:true });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', syncMode, { passive:true });
  [finePointer,mobileQuery,shortLandscapeQuery,reducedMotion].forEach(function (query) {
    if (typeof query.addEventListener === 'function') query.addEventListener('change', syncMode);
    else if (typeof query.addListener === 'function') query.addListener(syncMode);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncMode);
  syncMode();
}());
