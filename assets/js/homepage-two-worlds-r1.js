(function () {
  'use strict';

  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-tw-r1]'));
  var techSections = Array.prototype.slice.call(document.querySelectorAll('[data-tw-tech]'));
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function establish(element) {
    if (!element) return;
    element.classList.add('is-established');
  }

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        establish(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    sections.concat(techSections).forEach(function (element) {
      observer.observe(element);
    });
  } else {
    sections.concat(techSections).forEach(establish);
  }

  sections.forEach(function (section) {
    var field = section.querySelector('[data-tw-field]');
    var seam = section.querySelector('[data-tw-seam]');
    var aiWorld = section.querySelector('[data-tw-world="ai"]');
    var webWorld = section.querySelector('[data-tw-world="web"]');
    if (!field || !aiWorld || !webWorld) return;

    var targetSplit = 50;
    var currentSplit = 50;
    var targetLightShift = 0;
    var currentLightShift = 0;
    var targetLightAngle = 112;
    var currentLightAngle = 112;
    var rafId = 0;
    var leaveTimer = 0;
    var semanticState = 'neutral';
    var lastActiveWorld = null;
    var focusRatio = 60;
    var corridorHalf = 4;

    function setState(next, allowCatch) {
      next = next || 'neutral';
      if (semanticState === next) return;
      semanticState = next;
      section.setAttribute('data-focus', next);

      if (allowCatch && seam && next !== 'neutral' && !reducedMotion.matches) {
        seam.classList.remove('is-handoff');
        void seam.offsetWidth;
        seam.classList.add('is-handoff');
        window.setTimeout(function () {
          seam.classList.remove('is-handoff');
        }, 320);
      }
    }

    function updateTargetsFromPercent(percent) {
      var leftEdge = 50 - corridorHalf;
      var rightEdge = 50 + corridorHalf;

      if (percent < leftEdge) {
        targetSplit = focusRatio;
        setState('ai', lastActiveWorld === 'web');
        lastActiveWorld = 'ai';
      } else if (percent > rightEdge) {
        targetSplit = 100 - focusRatio;
        setState('web', lastActiveWorld === 'ai');
        lastActiveWorld = 'web';
      } else if (percent <= 50) {
        var aiProgress = (50 - percent) / corridorHalf;
        targetSplit = 50 + (focusRatio - 50) * aiProgress;
        setState(aiProgress > 0.45 ? 'ai' : 'neutral', false);
      } else {
        var webProgress = (percent - 50) / corridorHalf;
        targetSplit = 50 - (focusRatio - 50) * webProgress;
        setState(webProgress > 0.45 ? 'web' : 'neutral', false);
      }
    }

    function scheduleFrame() {
      if (rafId) return;
      rafId = window.requestAnimationFrame(step);
    }

    function step() {
      rafId = 0;
      var splitDelta = targetSplit - currentSplit;
      var shiftDelta = targetLightShift - currentLightShift;
      var angleDelta = targetLightAngle - currentLightAngle;
      var splitEase = reducedMotion.matches ? 1 : 0.095;
      var lightEase = reducedMotion.matches ? 1 : 0.06;

      currentSplit += splitDelta * splitEase;
      currentLightShift += shiftDelta * lightEase;
      currentLightAngle += angleDelta * lightEase;

      if (Math.abs(splitDelta) < 0.025) currentSplit = targetSplit;
      if (Math.abs(shiftDelta) < 0.02) currentLightShift = targetLightShift;
      if (Math.abs(angleDelta) < 0.02) currentLightAngle = targetLightAngle;

      section.style.setProperty('--tw-split', currentSplit.toFixed(3) + '%');
      section.style.setProperty('--tw-light-shift', currentLightShift.toFixed(3) + '%');
      section.style.setProperty('--tw-light-angle', currentLightAngle.toFixed(2) + 'deg');

      if (currentSplit !== targetSplit || currentLightShift !== targetLightShift || currentLightAngle !== targetLightAngle) {
        scheduleFrame();
      }
    }

    function clearLeaveTimer() {
      if (!leaveTimer) return;
      window.clearTimeout(leaveTimer);
      leaveTimer = 0;
    }

    function returnNeutral() {
      targetSplit = 50;
      targetLightShift = 0;
      targetLightAngle = 112;
      lastActiveWorld = null;
      setState('neutral', false);
      scheduleFrame();
    }

    field.addEventListener('pointermove', function (event) {
      if (!finePointer.matches) return;
      clearLeaveTimer();
      var rect = field.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
      var y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
      var percent = x / rect.width * 100;
      updateTargetsFromPercent(percent);
      targetLightShift = Math.max(-3.2, Math.min(3.2, (percent - 50) * 0.085));
      targetLightAngle = 109 + (y / rect.height) * 6;
      scheduleFrame();
    }, { passive: true });

    field.addEventListener('pointerenter', function () {
      if (!finePointer.matches) return;
      clearLeaveTimer();
    });

    field.addEventListener('pointerleave', function () {
      if (!finePointer.matches) return;
      clearLeaveTimer();
      leaveTimer = window.setTimeout(returnNeutral, 220);
    });

    section.addEventListener('focusin', function (event) {
      clearLeaveTimer();
      if (aiWorld.contains(event.target)) {
        targetSplit = focusRatio;
        setState('ai', lastActiveWorld === 'web');
        lastActiveWorld = 'ai';
      } else if (webWorld.contains(event.target)) {
        targetSplit = 100 - focusRatio;
        setState('web', lastActiveWorld === 'ai');
        lastActiveWorld = 'web';
      }
      scheduleFrame();
    });

    section.addEventListener('focusout', function () {
      window.requestAnimationFrame(function () {
        if (!section.contains(document.activeElement)) returnNeutral();
      });
    });

    function syncInputMode() {
      if (!finePointer.matches) returnNeutral();
    }

    if (typeof finePointer.addEventListener === 'function') {
      finePointer.addEventListener('change', syncInputMode);
    } else if (typeof finePointer.addListener === 'function') {
      finePointer.addListener(syncInputMode);
    }

    if (typeof reducedMotion.addEventListener === 'function') {
      reducedMotion.addEventListener('change', function () {
        returnNeutral();
        establish(section);
      });
    }

    returnNeutral();
  });
}());
