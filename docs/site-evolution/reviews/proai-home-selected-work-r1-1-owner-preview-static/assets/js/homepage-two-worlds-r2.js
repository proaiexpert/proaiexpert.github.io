(function () {
  'use strict';

  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-tw-r2]'));
  if (!sections.length) return;

  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileQuery = window.matchMedia('(max-width: 980px), ((hover: none) and (pointer: coarse))');
  var rafId = 0;
  var pendingScrollSections = [];

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

  function setMobileGeometry(section, progress) {
    if (reducedMotion.matches) {
      section.style.removeProperty('--tw-mobile-ai-x');
      section.style.removeProperty('--tw-mobile-ai-ry');
      section.style.removeProperty('--tw-mobile-ai-z');
      section.style.removeProperty('--tw-mobile-web-x');
      section.style.removeProperty('--tw-mobile-web-ry');
      section.style.removeProperty('--tw-mobile-web-z');
      section.style.removeProperty('--tw-mobile-fold-x');
      return;
    }

    var p = clamp(progress, 0, 1);
    var aiX = -82 * p;
    var aiRy = -3 - (69 * p);
    var aiZ = -110 * p;
    var webX = 82 * (1 - p);
    var webRy = 72 - (69 * p);
    var webZ = -110 * (1 - p);
    var foldX = 105 - (110 * p);

    section.style.setProperty('--tw-mobile-ai-x', aiX.toFixed(2) + '%');
    section.style.setProperty('--tw-mobile-ai-ry', aiRy.toFixed(2) + 'deg');
    section.style.setProperty('--tw-mobile-ai-z', aiZ.toFixed(2) + 'px');
    section.style.setProperty('--tw-mobile-web-x', webX.toFixed(2) + '%');
    section.style.setProperty('--tw-mobile-web-ry', webRy.toFixed(2) + 'deg');
    section.style.setProperty('--tw-mobile-web-z', webZ.toFixed(2) + 'px');
    section.style.setProperty('--tw-mobile-fold-x', foldX.toFixed(2) + '%');
    section.style.setProperty('--tw-mobile-progress', p.toFixed(3));

    var next = p < 0.34 ? 'ai' : (p > 0.66 ? 'web' : 'turn');
    if (section.getAttribute('data-focus') !== next) section.setAttribute('data-focus', next);
  }

  function updateMobileSection(section) {
    if (!mobileQuery.matches || reducedMotion.matches) return;
    var experience = section.querySelector('[data-tw-experience]');
    if (!experience) return;
    var rect = experience.getBoundingClientRect();
    var travel = Math.max(1, rect.height - window.innerHeight);
    var progress = clamp(-rect.top / travel, 0, 1);
    setMobileGeometry(section, progress);
  }

  function runScrollFrame() {
    rafId = 0;
    pendingScrollSections.forEach(updateMobileSection);
  }

  function scheduleMobileUpdate() {
    if (rafId) return;
    rafId = window.requestAnimationFrame(runScrollFrame);
  }

  sections.forEach(function (section) {
    var viewport = section.querySelector('[data-tw-viewport]');
    var aiWorld = section.querySelector('[data-tw-world="ai"]');
    var webWorld = section.querySelector('[data-tw-world="web"]');
    var leaveTimer = 0;
    if (!viewport || !aiWorld || !webWorld) return;

    pendingScrollSections.push(section);

    function setDesktopState(next) {
      if (mobileQuery.matches) return;
      window.clearTimeout(leaveTimer);
      section.setAttribute('data-focus', next || 'neutral');
    }

    viewport.addEventListener('pointermove', function (event) {
      if (!finePointer.matches || mobileQuery.matches) return;
      var rect = viewport.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var x = clamp(event.clientX - rect.left, 0, rect.width);
      var y = clamp(event.clientY - rect.top, 0, rect.height);
      var percent = x / rect.width * 100;
      var next = percent < 47 ? 'ai' : (percent > 53 ? 'web' : 'neutral');
      setDesktopState(next);
      section.style.setProperty('--tw-pointer-x', (x / rect.width * 100).toFixed(2) + '%');
      section.style.setProperty('--tw-pointer-y', (y / rect.height * 100).toFixed(2) + '%');
    }, { passive: true });

    viewport.addEventListener('pointerleave', function () {
      if (!finePointer.matches || mobileQuery.matches) return;
      window.clearTimeout(leaveTimer);
      leaveTimer = window.setTimeout(function () { setDesktopState('neutral'); }, 170);
    });

    section.addEventListener('focusin', function (event) {
      if (mobileQuery.matches) return;
      if (aiWorld.contains(event.target)) setDesktopState('ai');
      if (webWorld.contains(event.target)) setDesktopState('web');
    });

    section.addEventListener('focusout', function () {
      if (mobileQuery.matches) return;
      window.requestAnimationFrame(function () {
        if (!section.contains(document.activeElement)) setDesktopState('neutral');
      });
    });
  });

  function syncMode() {
    sections.forEach(function (section) {
      if (mobileQuery.matches) {
        if (reducedMotion.matches) {
          section.setAttribute('data-focus', 'neutral');
          setMobileGeometry(section, 0);
        } else {
          updateMobileSection(section);
        }
      } else {
        section.setAttribute('data-focus', 'neutral');
        section.style.removeProperty('--tw-mobile-progress');
      }
    });
  }

  window.addEventListener('scroll', scheduleMobileUpdate, { passive: true });
  window.addEventListener('resize', scheduleMobileUpdate, { passive: true });

  [finePointer, reducedMotion, mobileQuery].forEach(function (query) {
    if (typeof query.addEventListener === 'function') query.addEventListener('change', syncMode);
    else if (typeof query.addListener === 'function') query.addListener(syncMode);
  });

  syncMode();
}());
