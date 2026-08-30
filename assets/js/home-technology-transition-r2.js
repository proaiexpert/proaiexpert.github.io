(function () {
  'use strict';

  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-home-tech-r2]'));
  if (!sections.length) return;

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)');
  var localOffsets = ['-.44', '-.37', '-.30', '-.23', '-.16', '-.68', '-.73', '-.78', '-.83', '-.88'];

  function installRelaySignal(section) {
    if (section.dataset.techR2SignalReady === 'true') return;

    var relays = section.querySelectorAll('.home-tech-r2__relay');
    Array.prototype.forEach.call(relays, function (relay) {
      var active = relay.querySelector('.home-tech-r2__relay-active');
      if (!active || relay.querySelector('.home-tech-r2__relay-signal')) return;

      var signal = active.cloneNode(false);
      signal.setAttribute('class', 'home-tech-r2__relay-signal');
      signal.removeAttribute('style');
      active.parentNode.insertBefore(signal, active.nextSibling);
    });

    section.dataset.techR2SignalReady = 'true';
  }

  function clearLocalActivation(section) {
    section.classList.remove('is-local-active');
    section.style.removeProperty('--tech-r2-local-offset');
  }

  function installLocalResponses(section) {
    if (!finePointer || !finePointer.matches || section.dataset.techR2LocalReady === 'true') return;

    var identities = section.querySelectorAll('.home-tech-r2__identity');
    Array.prototype.forEach.call(identities, function (identity, index) {
      identity.addEventListener('pointerenter', function () {
        if (section.dataset.techR2State !== 'settled') return;
        if (reducedMotion && reducedMotion.matches) return;

        section.style.setProperty('--tech-r2-local-offset', localOffsets[index] || '-.44');
        section.classList.add('is-local-active');
      }, { passive: true });

      identity.addEventListener('pointerleave', function () {
        clearLocalActivation(section);
      }, { passive: true });
    });

    section.addEventListener('pointerleave', function () {
      clearLocalActivation(section);
    }, { passive: true });

    section.dataset.techR2LocalReady = 'true';
  }

  function settle(section) {
    if (section.dataset.techR2State === 'settled') return;

    section.classList.add('is-settled');
    section.classList.remove('is-assembling');
    clearLocalActivation(section);
    section.dataset.techR2State = 'settled';
  }

  function assemble(section) {
    if (section.dataset.techR2State) return;

    if (reducedMotion && reducedMotion.matches) {
      settle(section);
      return;
    }

    section.dataset.techR2State = 'assembling';
    section.classList.add('is-assembling');

    window.setTimeout(function () {
      section.classList.add('is-settled');
      section.classList.remove('is-assembling');
      section.dataset.techR2State = 'settled';
    }, 1760);
  }

  function inViewport(section) {
    var rect = section.getBoundingClientRect();
    var margin = window.innerHeight * 0.2;
    return rect.bottom > -margin && rect.top < window.innerHeight + margin;
  }

  sections.forEach(function (section) {
    installRelaySignal(section);
  });

  if (reducedMotion && reducedMotion.matches) {
    sections.forEach(function (section) { settle(section); });
    return;
  }

  sections.forEach(function (section) {
    installLocalResponses(section);
  });

  if (!('IntersectionObserver' in window)) {
    sections.forEach(assemble);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      assemble(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    root: null,
    rootMargin: '20% 0px 20% 0px',
    threshold: 0.01
  });

  sections.forEach(function (section) {
    if (inViewport(section)) assemble(section);
    else observer.observe(section);
  });

  window.addEventListener('pageshow', function () {
    sections.forEach(function (section) {
      if (!section.dataset.techR2State && inViewport(section)) assemble(section);
    });
  }, { passive: true });
}());
