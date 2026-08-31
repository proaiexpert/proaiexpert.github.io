(function () {
  'use strict';

  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-home-tech-r2]'));
  if (!sections.length) return;

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)');
  var desktopViewport = window.matchMedia && window.matchMedia('(min-width: 701px)');
  var localOffsets = ['-.44', '-.37', '-.30', '-.23', '-.16', '-.68', '-.73', '-.78', '-.83', '-.88'];
  var DESKTOP_SIGNAL_DURATION = 1900;
  var DESKTOP_HANDOFF_DELAY = 1680;
  var DESKTOP_SETTLE_DELAY = 2260;
  var DEFAULT_SETTLE_DELAY = 1760;
  var LOCAL_RESPONSE_DURATION = 680;
  var LOCAL_LEAVE_DURATION = 220;

  function desktopSignal(section) {
    return section.querySelector('.home-tech-r2__relay--desktop .home-tech-r2__relay-signal');
  }

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

  function resetLocalSignal(section) {
    var signal = desktopSignal(section);
    if (!signal) return;

    signal.style.stroke = '';
    signal.style.strokeDasharray = '';
    signal.style.strokeDashoffset = '';
    signal.style.strokeWidth = '';
    signal.style.filter = '';
    signal.style.opacity = '';
    signal.style.animation = 'none';
  }

  function finishLocalClear(section, token) {
    if (token !== section.__techR2LocalToken) return;
    section.classList.remove('is-local-active');
    section.style.removeProperty('--tech-r2-local-offset');
    resetLocalSignal(section);
  }

  function clearLocalActivation(section, smooth) {
    section.__techR2LocalToken = (section.__techR2LocalToken || 0) + 1;
    var token = section.__techR2LocalToken;
    var signal = desktopSignal(section);

    if (section.__techR2LocalAnimation) {
      section.__techR2LocalAnimation.cancel();
      section.__techR2LocalAnimation = null;
    }

    if (!smooth || !signal || !section.classList.contains('is-local-active') || (reducedMotion && reducedMotion.matches)) {
      finishLocalClear(section, token);
      return;
    }

    var computed = window.getComputedStyle(signal);
    var currentOffset = parseFloat(computed.strokeDashoffset);
    if (!isFinite(currentOffset)) currentOffset = parseFloat(section.style.getPropertyValue('--tech-r2-local-offset')) || 0;

    var fade = signal.animate([
      {
        opacity: computed.opacity,
        strokeDashoffset: String(currentOffset),
        filter: computed.filter === 'none' ? 'drop-shadow(0 0 2px rgba(242,240,235,.10))' : computed.filter
      },
      {
        opacity: 0,
        strokeDashoffset: String(currentOffset - 0.025),
        filter: 'drop-shadow(0 0 0 rgba(242,240,235,0))'
      }
    ], {
      duration: LOCAL_LEAVE_DURATION,
      easing: 'cubic-bezier(.4,0,.2,1)',
      fill: 'forwards'
    });

    section.__techR2LocalAnimation = fade;
    fade.onfinish = function () {
      if (section.__techR2LocalAnimation === fade) section.__techR2LocalAnimation = null;
      finishLocalClear(section, token);
    };
  }

  function activateLocal(section, index) {
    if (section.dataset.techR2State !== 'settled') return;
    if (reducedMotion && reducedMotion.matches) return;

    var signal = desktopSignal(section);
    if (!signal) return;

    section.__techR2LocalToken = (section.__techR2LocalToken || 0) + 1;
    var offset = parseFloat(localOffsets[index] || '-.44');

    if (section.__techR2LocalAnimation) {
      section.__techR2LocalAnimation.cancel();
      section.__techR2LocalAnimation = null;
    }

    section.style.setProperty('--tech-r2-local-offset', localOffsets[index] || '-.44');
    section.classList.add('is-local-active');

    signal.style.animation = 'none';
    signal.style.stroke = 'rgba(238,237,232,.92)';
    signal.style.strokeWidth = '1.6';
    signal.style.strokeDasharray = '.14 .86';
    signal.style.strokeDashoffset = String(offset);
    signal.style.filter = 'drop-shadow(0 0 2.6px rgba(242,240,235,.13)) drop-shadow(0 0 5px rgba(145,137,173,.065))';

    var local = signal.animate([
      {
        opacity: 0,
        stroke: 'rgba(242,240,235,.82)',
        strokeWidth: '1.35',
        strokeDashoffset: String(offset + 0.045),
        filter: 'drop-shadow(0 0 0 rgba(242,240,235,0))'
      },
      {
        offset: 0.28,
        opacity: 0.72,
        stroke: 'rgba(242,240,235,.97)',
        strokeWidth: '1.65',
        strokeDashoffset: String(offset + 0.014),
        filter: 'drop-shadow(0 0 2.8px rgba(242,240,235,.16)) drop-shadow(0 0 5px rgba(145,137,173,.075))'
      },
      {
        offset: 0.70,
        opacity: 0.52,
        stroke: 'rgba(207,209,216,.90)',
        strokeWidth: '1.5',
        strokeDashoffset: String(offset - 0.034),
        filter: 'drop-shadow(0 0 2.4px rgba(217,219,224,.12)) drop-shadow(0 0 4px rgba(140,160,173,.055))'
      },
      {
        opacity: 0.18,
        stroke: 'rgba(186,190,201,.76)',
        strokeWidth: '1.35',
        strokeDashoffset: String(offset - 0.060),
        filter: 'drop-shadow(0 0 1.5px rgba(217,219,224,.07))'
      }
    ], {
      duration: LOCAL_RESPONSE_DURATION,
      easing: 'cubic-bezier(.22,.76,.28,1)',
      fill: 'forwards'
    });

    section.__techR2LocalAnimation = local;
    local.onfinish = function () {
      if (section.__techR2LocalAnimation === local) section.__techR2LocalAnimation = null;
    };
  }

  function installLocalResponses(section) {
    if (!finePointer || !finePointer.matches || section.dataset.techR2LocalReady === 'true') return;

    var identities = section.querySelectorAll('.home-tech-r2__identity');
    Array.prototype.forEach.call(identities, function (identity, index) {
      identity.addEventListener('pointerenter', function () {
        activateLocal(section, index);
      }, { passive: true });

      identity.addEventListener('pointerleave', function () {
        clearLocalActivation(section, true);
      }, { passive: true });
    });

    section.addEventListener('pointerleave', function () {
      clearLocalActivation(section, true);
    }, { passive: true });

    section.dataset.techR2LocalReady = 'true';
  }

  function configureDesktopAssembly(section) {
    if (!desktopViewport || !desktopViewport.matches) return;

    var signal = desktopSignal(section);
    if (signal) signal.style.animationDuration = DESKTOP_SIGNAL_DURATION + 'ms';

    var handoff = section.querySelector('.home-tech-r2__handoff span');
    if (handoff) handoff.style.animationDelay = DESKTOP_HANDOFF_DELAY + 'ms';
  }

  function settle(section) {
    if (section.dataset.techR2State === 'settled') return;

    section.classList.add('is-settled');
    section.classList.remove('is-assembling');
    clearLocalActivation(section, false);
    section.dataset.techR2State = 'settled';

    var signal = desktopSignal(section);
    if (signal) signal.style.animation = 'none';
  }

  function assemble(section) {
    if (section.dataset.techR2State) return;

    if (reducedMotion && reducedMotion.matches) {
      settle(section);
      return;
    }

    configureDesktopAssembly(section);
    section.dataset.techR2State = 'assembling';
    section.classList.add('is-assembling');

    var settleDelay = desktopViewport && desktopViewport.matches ? DESKTOP_SETTLE_DELAY : DEFAULT_SETTLE_DELAY;
    window.setTimeout(function () {
      settle(section);
    }, settleDelay);
  }

  function materiallyVisible(section) {
    var rect = section.getBoundingClientRect();
    if (!rect.height || rect.bottom <= 0 || rect.top >= window.innerHeight) return false;

    var viewportBottom = window.innerHeight * 0.92;
    var visibleTop = Math.max(rect.top, 0);
    var visibleBottom = Math.min(rect.bottom, viewportBottom);
    var visibleHeight = Math.max(0, visibleBottom - visibleTop);
    return (visibleHeight / rect.height) >= 0.55;
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
    sections.forEach(function (section) {
      if (materiallyVisible(section)) assemble(section);
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.55) return;
      assemble(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: [0.55]
  });

  sections.forEach(function (section) {
    if (materiallyVisible(section)) assemble(section);
    else observer.observe(section);
  });

  window.addEventListener('pageshow', function () {
    sections.forEach(function (section) {
      if (!section.dataset.techR2State && materiallyVisible(section)) assemble(section);
    });
  }, { passive: true });
}());
