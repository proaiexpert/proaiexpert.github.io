/* ProAI Expert — Homepage Footer Canonical Golden R3
   Fine-pointer material response plus bounded coarse-pointer viewport reveal. */
(function () {
  'use strict';

  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)');
  var coarsePointer = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)');
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var zones = document.querySelectorAll('[data-home-footer-golden-r3] [data-footer-material-zone]');
  if (!zones.length) return;

  if (finePointer && finePointer.matches && !(reducedMotion && reducedMotion.matches)) {
    zones.forEach(function (zone) {
      function move(event) {
        var rect = zone.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        var x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
        var y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
        zone.style.setProperty('--pointer-x', x.toFixed(2) + '%');
        zone.style.setProperty('--pointer-y', y.toFixed(2) + '%');
      }

      zone.addEventListener('pointerenter', function (event) {
        zone.classList.add('is-awake');
        move(event);
      }, { passive: true });

      zone.addEventListener('pointermove', move, { passive: true });

      zone.addEventListener('pointerleave', function () {
        zone.classList.remove('is-awake');
        zone.style.setProperty('--pointer-x', '50%');
        zone.style.setProperty('--pointer-y', '50%');
      }, { passive: true });
    });
    return;
  }

  if (!coarsePointer || !coarsePointer.matches || (reducedMotion && reducedMotion.matches) || !('IntersectionObserver' in window)) return;

  zones.forEach(function (zone) {
    var armed = true;
    var settleTimer = 0;

    function settle() {
      window.clearTimeout(settleTimer);
      settleTimer = 0;
      zone.classList.remove('is-awake');
      zone.style.setProperty('--pointer-x', '50%');
      zone.style.setProperty('--pointer-y', '50%');
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.target !== zone) return;

        if (!entry.isIntersecting || entry.intersectionRatio <= 0.12) {
          settle();
          armed = true;
          return;
        }

        if (!armed || entry.intersectionRatio < 0.45) return;
        armed = false;
        zone.style.setProperty('--pointer-x', '56%');
        zone.style.setProperty('--pointer-y', '46%');
        zone.classList.add('is-awake');
        settleTimer = window.setTimeout(settle, 1050);
      });
    }, { threshold: [0, 0.12, 0.45, 0.72] });

    observer.observe(zone);
  });
}());
