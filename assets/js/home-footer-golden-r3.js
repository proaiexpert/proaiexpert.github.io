/* ProAI Expert — Homepage Footer Canonical Golden R3
   Fine-pointer material response only. No touch hover simulation. */
(function () {
  'use strict';

  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)');
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!finePointer || !finePointer.matches || (reducedMotion && reducedMotion.matches)) return;

  var zones = document.querySelectorAll('[data-home-footer-golden-r3] [data-footer-material-zone]');
  if (!zones.length) return;

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
}());
