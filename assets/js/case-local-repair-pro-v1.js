(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var header = document.querySelector('[data-global-header]');
  var toggle = document.querySelector('.mobile-menu-toggle');
  var navigation = document.querySelector('#site-navigation');
  var chapterNav = document.querySelector('[data-chapter-nav]');
  var chapters = document.querySelectorAll('[data-chapter]');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var stickyViewport = window.matchMedia('(min-width: 1200px) and (min-height: 760px)');
  var wideNavigation = window.matchMedia('(min-width: 1101px)');
  var activeEffects = 0;
  var motionQueue = [];

  function maxConcurrentEffects() {
    return window.matchMedia('(max-width: 767px)').matches ? 1 : 2;
  }

  function isRussian() {
    return body.lang === 'ru';
  }

  function closeMenu(restoreFocus) {
    if (!toggle || !navigation) return;
    navigation.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', isRussian() ? 'Открыть меню' : 'Open menu');
    body.classList.remove('menu-open');
    if (restoreFocus) toggle.focus();
  }

  function openMenu() {
    if (!toggle || !navigation) return;
    navigation.classList.add('is-open');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', isRussian() ? 'Закрыть меню' : 'Close menu');
    body.classList.add('menu-open');
    var firstLink = navigation.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  if (toggle && navigation) {
    toggle.addEventListener('click', function () {
      if (navigation.classList.contains('is-open')) closeMenu(false);
      else openMenu();
    });
    navigation.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu(false);
    });
    document.addEventListener('keydown', function (event) {
      if (!navigation.classList.contains('is-open')) return;
      if (event.key === 'Escape') {
        closeMenu(true);
        return;
      }
      if (event.key !== 'Tab') return;

      var menuFocusables = [toggle].concat(Array.prototype.slice.call(navigation.querySelectorAll('a[href]')));
      var currentIndex = menuFocusables.indexOf(document.activeElement);
      var direction = event.shiftKey ? -1 : 1;
      var nextIndex = currentIndex < 0 ? 1 : (currentIndex + direction + menuFocusables.length) % menuFocusables.length;

      event.preventDefault();
      menuFocusables[nextIndex].focus();
    });
  }

  function updateHeader() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 16);
  }

  function zoomIsSafe() {
    return !window.visualViewport || window.visualViewport.scale <= 1.1;
  }

  function updateStickyState() {
    var active = document.activeElement;
    var focusInsideNav = chapterNav && chapterNav.contains(document.activeElement);
    var hasInteractiveFocus = active && active !== body && active !== document.documentElement;
    var paused = !stickyViewport.matches || !zoomIsSafe() || (hasInteractiveFocus && !focusInsideNav);
    body.classList.toggle('lrp-sticky-paused', paused);
  }

  document.addEventListener('focusin', updateStickyState);
  document.addEventListener('focusout', function () { window.setTimeout(updateStickyState, 0); });
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', function () {
    if (wideNavigation.matches) closeMenu(false);
    updateStickyState();
  }, { passive: true });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', updateStickyState);
  if (stickyViewport.addEventListener) stickyViewport.addEventListener('change', updateStickyState);

  if (chapterNav && 'IntersectionObserver' in window) {
    var chapterLinks = chapterNav.querySelectorAll('a[href^="#"]');
    var chapterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var target = '#' + entry.target.id;
        chapterLinks.forEach(function (link) {
          if (link.getAttribute('href') === target) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-25% 0px -66% 0px', threshold: 0 });
    chapters.forEach(function (chapter) { chapterObserver.observe(chapter); });
  }

  var effectSelector = '.lrp-proof-settle,.lrp-field-lock,.lrp-scope-align,.lrp-surface-handoff,.lrp-cta-closure';
  var effectTargets = Array.prototype.slice.call(document.querySelectorAll(effectSelector));

  function effectDuration(target) {
    if (target.classList.contains('lrp-scope-align')) return 620;
    if (target.classList.contains('lrp-proof-settle')) return 560;
    if (target.classList.contains('lrp-cta-closure')) return 560;
    if (target.classList.contains('lrp-surface-handoff')) return 420;
    return 460;
  }

  function runNextEffect() {
    while (activeEffects < maxConcurrentEffects() && motionQueue.length) {
      var target = motionQueue.shift();
      if (target.classList.contains('is-visible')) continue;
      activeEffects += 1;
      target.classList.add('is-visible');
      window.setTimeout(function () {
        activeEffects = Math.max(0, activeEffects - 1);
        runNextEffect();
      }, effectDuration(target));
    }
  }

  function revealAll() {
    effectTargets.forEach(function (target) { target.classList.add('is-visible'); });
  }

  if (!effectTargets.length || reducedMotion.matches || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    var motionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        motionObserver.unobserve(entry.target);
        motionQueue.push(entry.target);
      });
      runNextEffect();
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });
    effectTargets.forEach(function (target) { motionObserver.observe(target); });
    window.requestAnimationFrame(function () { root.classList.add('lrp-motion-ready'); });
  }

  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener('change', function () {
      if (reducedMotion.matches) revealAll();
    });
  }

  updateHeader();
  updateStickyState();
}());
