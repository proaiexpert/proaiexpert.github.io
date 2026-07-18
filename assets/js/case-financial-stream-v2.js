(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var header = document.querySelector('[data-global-header]');
  var toggle = document.querySelector('.mobile-menu-toggle');
  var siteNav = document.querySelector('.site-nav');
  var chapterNav = document.querySelector('[data-chapter-nav]');
  var systemChapter = document.querySelector('.system-chapter');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var desktopSticky = window.matchMedia('(min-width: 1200px) and (min-height: 760px)');
  var lastScrollY = window.scrollY;
  var focusPause = false;

  function closeMenu(restoreFocus) {
    if (!toggle || !siteNav) return;
    siteNav.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', body.classList.contains('fs-case--ru') ? 'Открыть меню' : 'Open menu');
    body.classList.remove('menu-open');
    if (restoreFocus) toggle.focus();
  }

  function openMenu() {
    if (!toggle || !siteNav) return;
    siteNav.classList.add('is-open');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', body.classList.contains('fs-case--ru') ? 'Закрыть меню' : 'Close menu');
    body.classList.add('menu-open');
    var firstLink = siteNav.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  if (toggle && siteNav) {
    toggle.addEventListener('click', function () {
      if (siteNav.classList.contains('is-open')) closeMenu(false);
      else openMenu();
    });
    siteNav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && siteNav.classList.contains('is-open')) closeMenu(true);
    });
  }

  function updateHeader() {
    if (!header) return;
    var currentY = window.scrollY;
    header.classList.toggle('is-scrolled', currentY > 12);
    if (window.innerWidth < 768 && !body.classList.contains('menu-open') && currentY > 120) {
      header.classList.toggle('is-hidden', currentY > lastScrollY + 8);
    } else {
      header.classList.remove('is-hidden');
    }
    lastScrollY = currentY;
  }

  var scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(function () {
      updateHeader();
      scrollTicking = false;
    });
  }, { passive: true });

  function zoomIsSafe() {
    return !window.visualViewport || window.visualViewport.scale <= 1.1;
  }

  function updateStickyEligibility() {
    if (!systemChapter) return;
    var eligible = desktopSticky.matches && !reducedMotion.matches && !focusPause && zoomIsSafe();
    systemChapter.classList.toggle('is-sticky-eligible', eligible);
  }

  document.addEventListener('focusin', function () {
    focusPause = true;
    updateStickyEligibility();
  });
  document.addEventListener('focusout', function () {
    window.setTimeout(function () {
      focusPause = document.activeElement && document.activeElement !== body;
      updateStickyEligibility();
    }, 0);
  });

  var effectTargets = document.querySelectorAll('.effect-evidence-lock, .effect-proof-settle, .effect-source-lock, .effect-register-closure');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    var effectObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          effectObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    effectTargets.forEach(function (target) { effectObserver.observe(target); });
  } else {
    effectTargets.forEach(function (target) { target.classList.add('is-visible'); });
  }

  var layers = document.querySelectorAll('[data-layer]');
  if ('IntersectionObserver' in window && desktopSticky.matches && !reducedMotion.matches) {
    var layerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        layers.forEach(function (layer) { layer.classList.remove('is-active'); });
        entry.target.classList.add('is-active');
      });
    }, { rootMargin: '-38% 0px -48% 0px', threshold: 0 });
    layers.forEach(function (layer) { layerObserver.observe(layer); });
  } else if (layers[0]) {
    layers[0].classList.add('is-active');
  }

  var chapters = document.querySelectorAll('[data-chapter]');
  var chapterLinks = chapterNav ? chapterNav.querySelectorAll('a[href^="#"]') : [];
  if ('IntersectionObserver' in window && chapterNav) {
    var chapterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        chapterLinks.forEach(function (link) {
          if (link.getAttribute('href') === id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-24% 0px -68% 0px', threshold: 0 });
    chapters.forEach(function (chapter) { chapterObserver.observe(chapter); });
  }

  function handleViewportChange() {
    if (window.innerWidth >= 1100) closeMenu(false);
    updateStickyEligibility();
    updateHeader();
  }

  window.addEventListener('resize', handleViewportChange);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', updateStickyEligibility);
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', updateStickyEligibility);
  if (desktopSticky.addEventListener) desktopSticky.addEventListener('change', updateStickyEligibility);

  root.classList.add('enhanced');
  updateStickyEligibility();
  updateHeader();
}());
