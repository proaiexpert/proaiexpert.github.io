(function () {
  'use strict';

  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-home-tech-r2]'));
  if (!sections.length) return;

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)');
  var desktopViewport = window.matchMedia && window.matchMedia('(min-width: 701px)');
  var shortLandscapeTouch = window.matchMedia && window.matchMedia('(min-width: 701px) and (max-width: 932px) and (max-height: 500px) and (orientation: landscape) and (pointer: coarse)');
  var localOffsets = ['-.44', '-.37', '-.30', '-.23', '-.16', '-.68', '-.73', '-.78', '-.83', '-.88'];
  var DESKTOP_SIGNAL_DURATION = 1900;
  var DESKTOP_HANDOFF_DELAY = 1680;
  var DESKTOP_SETTLE_DELAY = 2260;
  var LANDSCAPE_SIGNAL_DURATION = 1680;
  var LANDSCAPE_SETTLE_DELAY = 2040;
  var DEFAULT_SETTLE_DELAY = 1760;
  var LOCAL_RESPONSE_DURATION = 740;
  var LOCAL_LEAVE_DURATION = 220;
  var PORTRAIT_MOBILE_VIEWBOX = '0 0 400 520';
  var PORTRAIT_MOBILE_PATH = 'M200 0 V520';
  var LANDSCAPE_MOBILE_VIEWBOX = '0 0 560 300';
  var LANDSCAPE_MOBILE_PATH = 'M332 0 V18 Q332 34 314 34 H300 Q280 34 280 54 V244 Q280 262 298 262 H354 Q372 262 372 280 V300';

  function isShortLandscapeTouch() {
    return !!(shortLandscapeTouch && shortLandscapeTouch.matches);
  }

  function desktopSignal(section) {
    return section.querySelector('.home-tech-r2__relay--desktop .home-tech-r2__relay-signal');
  }

  function localCoreSignal(section) {
    return section.querySelector('.home-tech-r2__relay--desktop .home-tech-r2__relay-local-core');
  }

  function ensureLocalCoreSignal(section) {
    var core = localCoreSignal(section);
    if (core) return core;

    var signal = desktopSignal(section);
    if (!signal || !signal.parentNode) return null;

    core = signal.cloneNode(false);
    core.setAttribute('class', 'home-tech-r2__relay-local-core');
    core.setAttribute('fill', 'none');
    core.setAttribute('vector-effect', 'non-scaling-stroke');
    core.setAttribute('stroke-linecap', 'round');
    core.setAttribute('stroke-linejoin', 'round');
    core.style.animation = 'none';
    core.style.opacity = '0';
    signal.parentNode.insertBefore(core, signal.nextSibling);
    return core;
  }

  function mobileSignal(section) {
    return section.querySelector('.home-tech-r2__relay--mobile .home-tech-r2__relay-signal');
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

  function configureMobileRelayGeometry(section) {
    var relay = section.querySelector('.home-tech-r2__relay--mobile');
    if (!relay) return;

    var landscape = isShortLandscapeTouch();
    var viewBox = landscape ? LANDSCAPE_MOBILE_VIEWBOX : PORTRAIT_MOBILE_VIEWBOX;
    var pathData = landscape ? LANDSCAPE_MOBILE_PATH : PORTRAIT_MOBILE_PATH;
    var base = relay.querySelector('.home-tech-r2__relay-base');
    var active = relay.querySelector('.home-tech-r2__relay-active');
    var signal = relay.querySelector('.home-tech-r2__relay-signal');

    relay.setAttribute('viewBox', viewBox);
    if (base) base.setAttribute('d', pathData);
    if (active) active.setAttribute('d', pathData);
    if (signal) signal.setAttribute('d', pathData);
    section.dataset.techR2RelayMode = landscape ? 'landscape' : 'portrait';
  }

  function cancelLocalAnimations(section) {
    var animations = section.__techR2LocalAnimations || [];
    Array.prototype.forEach.call(animations, function (animation) {
      if (animation) animation.cancel();
    });
    section.__techR2LocalAnimations = [];
  }

  function resetLocalSignal(section) {
    var signal = desktopSignal(section);
    var core = localCoreSignal(section);

    if (signal) {
      signal.style.stroke = '';
      signal.style.strokeDasharray = '';
      signal.style.strokeDashoffset = '';
      signal.style.strokeWidth = '';
      signal.style.filter = '';
      signal.style.opacity = '';
      signal.style.animation = 'none';
    }

    if (core) {
      core.style.stroke = '';
      core.style.strokeDasharray = '';
      core.style.strokeDashoffset = '';
      core.style.strokeWidth = '';
      core.style.filter = '';
      core.style.opacity = '0';
      core.style.animation = 'none';
    }
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
    var core = localCoreSignal(section);

    cancelLocalAnimations(section);

    if (!smooth || !signal || !section.classList.contains('is-local-active') || (reducedMotion && reducedMotion.matches)) {
      finishLocalClear(section, token);
      return;
    }

    var targets = [signal, core].filter(function (target) { return !!target; });
    var fades = targets.map(function (target) {
      var computed = window.getComputedStyle(target);
      var currentOffset = parseFloat(computed.strokeDashoffset);
      if (!isFinite(currentOffset)) currentOffset = 0;

      return target.animate([
        {
          opacity: computed.opacity,
          strokeDashoffset: String(currentOffset),
          filter: computed.filter === 'none' ? 'drop-shadow(0 0 1.5px rgba(242,240,235,.08))' : computed.filter
        },
        {
          opacity: 0,
          strokeDashoffset: String(currentOffset - 0.018),
          filter: 'drop-shadow(0 0 0 rgba(242,240,235,0))'
        }
      ], {
        duration: LOCAL_LEAVE_DURATION,
        easing: 'cubic-bezier(.4,0,.2,1)',
        fill: 'forwards'
      });
    });

    section.__techR2LocalAnimations = fades;
    if (!fades.length) {
      finishLocalClear(section, token);
      return;
    }

    fades[0].onfinish = function () {
      if (token !== section.__techR2LocalToken) return;
      cancelLocalAnimations(section);
      finishLocalClear(section, token);
    };
  }

  function activateLocal(section, index) {
    if (section.dataset.techR2State !== 'settled') return;
    if (reducedMotion && reducedMotion.matches) return;

    var signal = desktopSignal(section);
    var core = ensureLocalCoreSignal(section);
    if (!signal || !core) return;

    section.__techR2LocalToken = (section.__techR2LocalToken || 0) + 1;
    var token = section.__techR2LocalToken;
    var offset = parseFloat(localOffsets[index] || '-.44');

    cancelLocalAnimations(section);

    section.style.setProperty('--tech-r2-local-offset', localOffsets[index] || '-.44');
    section.classList.add('is-local-active');

    signal.style.animation = 'none';
    signal.style.opacity = '0';
    signal.style.stroke = 'rgba(186,191,201,.72)';
    signal.style.strokeWidth = '2.45';
    signal.style.strokeDasharray = '.18 2';
    signal.style.strokeDashoffset = String(offset + 0.17);
    signal.style.filter = 'drop-shadow(0 0 2.8px rgba(207,210,218,.10)) drop-shadow(0 0 4.6px rgba(125,119,157,.045))';

    core.style.animation = 'none';
    core.style.opacity = '0';
    core.style.stroke = 'rgba(244,242,237,.98)';
    core.style.strokeWidth = '1.35';
    core.style.strokeDasharray = '.065 2';
    core.style.strokeDashoffset = String(offset + 0.055);
    core.style.filter = 'drop-shadow(0 0 1.8px rgba(244,242,237,.14))';

    var tailAnimation = signal.animate([
      {
        opacity: 0,
        strokeDashoffset: String(offset + 0.17),
        filter: 'drop-shadow(0 0 0 rgba(207,210,218,0))'
      },
      {
        offset: 0.22,
        opacity: 0.28,
        strokeDashoffset: String(offset + 0.135),
        filter: 'drop-shadow(0 0 2.4px rgba(207,210,218,.08)) drop-shadow(0 0 4px rgba(125,119,157,.035))'
      },
      {
        offset: 0.58,
        opacity: 0.34,
        strokeDashoffset: String(offset + 0.08),
        filter: 'drop-shadow(0 0 2.8px rgba(207,210,218,.10)) drop-shadow(0 0 4.6px rgba(125,119,157,.045))'
      },
      {
        opacity: 0,
        strokeDashoffset: String(offset + 0.043),
        filter: 'drop-shadow(0 0 0 rgba(207,210,218,0))'
      }
    ], {
      duration: LOCAL_RESPONSE_DURATION,
      easing: 'cubic-bezier(.24,.72,.26,1)',
      fill: 'forwards'
    });

    var coreAnimation = core.animate([
      {
        opacity: 0,
        strokeDashoffset: String(offset + 0.055),
        filter: 'drop-shadow(0 0 0 rgba(244,242,237,0))'
      },
      {
        offset: 0.22,
        opacity: 0.96,
        strokeDashoffset: String(offset + 0.02),
        filter: 'drop-shadow(0 0 1.8px rgba(244,242,237,.14))'
      },
      {
        offset: 0.58,
        opacity: 0.86,
        strokeDashoffset: String(offset - 0.035),
        filter: 'drop-shadow(0 0 2px rgba(235,233,231,.12))'
      },
      {
        opacity: 0,
        strokeDashoffset: String(offset - 0.072),
        filter: 'drop-shadow(0 0 0 rgba(244,242,237,0))'
      }
    ], {
      duration: LOCAL_RESPONSE_DURATION,
      easing: 'cubic-bezier(.24,.72,.26,1)',
      fill: 'forwards'
    });

    section.__techR2LocalAnimations = [tailAnimation, coreAnimation];
    tailAnimation.onfinish = function () {
      if (token !== section.__techR2LocalToken) return;
      cancelLocalAnimations(section);
      finishLocalClear(section, token);
    };
  }

  function installLocalResponses(section) {
    if (!finePointer || !finePointer.matches || section.dataset.techR2LocalReady === 'true') return;

    ensureLocalCoreSignal(section);

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
    if (!desktopViewport || !desktopViewport.matches || isShortLandscapeTouch()) return;

    var signal = desktopSignal(section);
    if (signal) signal.style.animationDuration = DESKTOP_SIGNAL_DURATION + 'ms';

    var handoff = section.querySelector('.home-tech-r2__handoff span');
    if (handoff) handoff.style.animationDelay = DESKTOP_HANDOFF_DELAY + 'ms';
  }

  function configureLandscapeAssembly(section) {
    if (!isShortLandscapeTouch()) return;
    configureMobileRelayGeometry(section);

    var signal = mobileSignal(section);
    if (signal) signal.style.animationDuration = LANDSCAPE_SIGNAL_DURATION + 'ms';
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

    configureMobileRelayGeometry(section);
    configureLandscapeAssembly(section);
    configureDesktopAssembly(section);
    section.dataset.techR2State = 'assembling';
    section.classList.add('is-assembling');

    var settleDelay = DEFAULT_SETTLE_DELAY;
    if (isShortLandscapeTouch()) settleDelay = LANDSCAPE_SETTLE_DELAY;
    else if (desktopViewport && desktopViewport.matches) settleDelay = DESKTOP_SETTLE_DELAY;

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
    configureMobileRelayGeometry(section);
  });

  if (shortLandscapeTouch && shortLandscapeTouch.addEventListener) {
    shortLandscapeTouch.addEventListener('change', function () {
      sections.forEach(function (section) {
        configureMobileRelayGeometry(section);
      });
    });
  }

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
      configureMobileRelayGeometry(section);
      if (!section.dataset.techR2State && materiallyVisible(section)) assemble(section);
    });
  }, { passive: true });
}());
