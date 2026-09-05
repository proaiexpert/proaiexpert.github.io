(function () {
  'use strict';

  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-tsi]'));
  if (!sections.length) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)');

  function clearActive(instrument) {
    instrument.removeAttribute('data-active');
    Array.prototype.forEach.call(instrument.querySelectorAll('[data-family]'), function (control) {
      control.setAttribute('aria-pressed', 'false');
    });
  }

  function setActive(instrument, family) {
    instrument.setAttribute('data-active', family);
    Array.prototype.forEach.call(instrument.querySelectorAll('[data-family]'), function (control) {
      control.setAttribute('aria-pressed', control.getAttribute('data-family') === family ? 'true' : 'false');
    });
  }

  function installInteraction(section) {
    var instrument = section.querySelector('[data-tsi-instrument]');
    if (!instrument) return;

    var controls = Array.prototype.slice.call(instrument.querySelectorAll('[data-family]'));
    controls.forEach(function (control) {
      var family = control.getAttribute('data-family');

      control.addEventListener('pointerenter', function () {
        if (finePointer && finePointer.matches) setActive(instrument, family);
      }, { passive: true });

      control.addEventListener('pointerleave', function () {
        if (!control.matches(':focus-visible')) clearActive(instrument);
      }, { passive: true });

      control.addEventListener('focus', function () {
        if ((finePointer && finePointer.matches) || control.matches(':focus-visible')) {
          setActive(instrument, family);
        }
      });

      control.addEventListener('blur', function () {
        if (finePointer && finePointer.matches) clearActive(instrument);
      });

      control.addEventListener('click', function () {
        if (finePointer && finePointer.matches) return;
        if (control.getAttribute('aria-pressed') === 'true') clearActive(instrument);
        else setActive(instrument, family);
      });
    });
  }

  function calibrate(section) {
    if (section.dataset.tsiCalibrated === 'true') return;
    section.dataset.tsiCalibrated = 'true';

    if (reduced && reduced.matches) return;

    section.classList.add('is-calibrating');
    window.setTimeout(function () {
      section.classList.remove('is-calibrating');
    }, 1540);
  }

  sections.forEach(installInteraction);

  if (reduced && reduced.matches) {
    sections.forEach(function (section) { section.dataset.tsiCalibrated = 'true'; });
    return;
  }

  if (!('IntersectionObserver' in window)) {
    sections.forEach(calibrate);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
        calibrate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: [0.3, 0.5] });

  sections.forEach(function (section) { observer.observe(section); });
})();
