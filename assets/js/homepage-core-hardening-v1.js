(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var main = document.getElementById('main-content');
  var header = document.querySelector('header');
  var footer = document.querySelector('footer');
  var skipLink = document.querySelector('.skip-link');
  var nav = document.querySelector('.site-nav');
  var toggle = document.querySelector('.mobile-menu-toggle');
  var isRussian = body && body.classList.contains('lang-ru');
  var openLabel = isRussian ? 'Открыть меню' : 'Open menu';
  var closeLabel = isRussian ? 'Закрыть меню' : 'Close menu';
  var wasOpen = false;
  var previousFocus = null;

  root.classList.add('homepage-ready');

  function loadWorkflowEnvironment() {
    if (!document.getElementById('tech-section-en')) return;
    if (document.querySelector('script[data-homepage-workflow-environment]')) return;

    var script = document.createElement('script');
    script.src = '/assets/js/homepage-workflow-environment-v1.js?v=20260803.4';
    script.async = false;
    script.setAttribute('data-homepage-workflow-environment', 'v1');
    document.head.appendChild(script);
  }

  loadWorkflowEnvironment();

  function focusMain(event) {
    if (!main) return;
    if (event) event.preventDefault();
    main.focus({ preventScroll: true });
    main.scrollIntoView({ block: 'start' });
  }

  if (skipLink && main) {
    skipLink.addEventListener('click', focusMain);
  }

  function setBackgroundInert(value) {
    [main, footer].forEach(function (element) {
      if (!element) return;
      if ('inert' in element) {
        element.inert = value;
      } else if (value) {
        element.setAttribute('aria-hidden', 'true');
      } else {
        element.removeAttribute('aria-hidden');
      }
    });
  }

  function getFocusableItems() {
    if (!header) return [];
    return Array.prototype.slice.call(header.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      .filter(function (element) {
        return !element.hasAttribute('disabled') && element.offsetParent !== null;
      });
  }

  function syncMenuState() {
    if (!nav || !toggle) return;

    var isOpen = nav.classList.contains('is-open') || toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-label', isOpen ? closeLabel : openLabel);

    if (isOpen && !wasOpen) {
      previousFocus = document.activeElement;
      setBackgroundInert(true);
      window.requestAnimationFrame(function () {
        var firstLink = nav.querySelector('a[href]');
        if (firstLink) firstLink.focus();
      });
    }

    if (!isOpen && wasOpen) {
      setBackgroundInert(false);
      var focusTarget = previousFocus && typeof previousFocus.focus === 'function' ? previousFocus : toggle;
      window.requestAnimationFrame(function () {
        focusTarget.focus();
      });
      previousFocus = null;
    }

    wasOpen = isOpen;
  }

  if (nav && toggle) {
    var observer = new MutationObserver(syncMenuState);
    observer.observe(nav, { attributes: true, attributeFilter: ['class'] });
    observer.observe(toggle, { attributes: true, attributeFilter: ['aria-expanded'] });

    document.addEventListener('keydown', function (event) {
      var isOpen = nav.classList.contains('is-open') || toggle.getAttribute('aria-expanded') === 'true';
      if (!isOpen || event.key !== 'Tab') return;

      var items = getFocusableItems();
      if (!items.length) return;

      var first = items[0];
      var last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }, true);

    toggle.addEventListener('click', function () {
      window.requestAnimationFrame(syncMenuState);
    });

    nav.addEventListener('click', function () {
      window.requestAnimationFrame(syncMenuState);
    });

    window.addEventListener('resize', function () {
      window.requestAnimationFrame(syncMenuState);
    });

    syncMenuState();
  }

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function syncMotionPreference() {
    if (!motionQuery.matches) return;

    document.querySelectorAll('svg').forEach(function (svg) {
      if (typeof svg.pauseAnimations === 'function') svg.pauseAnimations();
    });

    document.querySelectorAll('.scene, .side-bg-text, .step-card, .device-monitor, .device-phone').forEach(function (element) {
      element.style.removeProperty('transform');
    });
  }

  syncMotionPreference();
  if (typeof motionQuery.addEventListener === 'function') {
    motionQuery.addEventListener('change', syncMotionPreference);
  } else if (typeof motionQuery.addListener === 'function') {
    motionQuery.addListener(syncMotionPreference);
  }
}());
