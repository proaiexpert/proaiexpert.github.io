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
  var mobileHeader = window.matchMedia('(max-width: 1100px), ((max-height: 540px) and (orientation: landscape))');
  var lastScrollY = window.scrollY;
  var focusPause = false;
  var scrollTicking = false;

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

  function updatePageState() {
    var currentY = window.scrollY;
    var maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    root.style.setProperty('--scroll-progress', Math.min(1, Math.max(0, currentY / maxScroll)).toFixed(4));

    if (header) {
      header.classList.toggle('is-scrolled', currentY > 12);
      if (mobileHeader.matches && !body.classList.contains('menu-open') && currentY > 20) {
        if (currentY > lastScrollY + 10) header.classList.add('header-hidden');
        else if (currentY < lastScrollY - 10) header.classList.remove('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
    }
    lastScrollY = currentY;
  }

  window.addEventListener('scroll', function () {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(function () {
      updatePageState();
      scrollTicking = false;
    });
  }, { passive: true });
  window.addEventListener('touchmove', function () {
    if (!scrollTicking) updatePageState();
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
      focusPause = Boolean(document.activeElement && document.activeElement !== body);
      updateStickyEligibility();
    }, 0);
  });

  var motionGroups = [
    ['.hero-copy', 'from-left'],
    ['.proof-figure--hero', 'settle'],
    ['.evidence-lock, .proof-strip li', 'rise'],
    ['.editorial-grid > *, .system-intro', 'rise'],
    ['.layer-register li', 'line-in'],
    ['.chapter-heading, .automation-heading', 'rise'],
    ['.portrait-proof:nth-child(1)', 'from-left'],
    ['.portrait-proof:nth-child(2)', 'from-right'],
    ['.shared-caption, .service-ledger article, .not-sure', 'rise'],
    ['#intake-before-booking .proof-copy, #content-search .proof-figure', 'from-left'],
    ['#intake-before-booking .proof-figure, #content-search .proof-copy', 'from-right'],
    ['.automation-grid .proof-figure', 'settle'],
    ['.automation-grid .capability-ledger, .testimonial-inner > *, .outcomes-grid > *, .final-grid > *', 'rise']
  ];
  var motionTargets = [];

  motionGroups.forEach(function (group) {
    document.querySelectorAll(group[0]).forEach(function (target, index) {
      if (!target.hasAttribute('data-motion')) target.setAttribute('data-motion', group[1]);
      target.style.setProperty('--motion-delay', Math.min(index * 48, 144) + 'ms');
      motionTargets.push(target);
    });
  });

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    var motionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        motionObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });

    motionTargets.forEach(function (target) { motionObserver.observe(target); });
    window.requestAnimationFrame(function () { root.classList.add('motion-ready'); });
  } else {
    motionTargets.forEach(function (target) { target.classList.add('is-visible'); });
  }

  var layers = document.querySelectorAll('[data-layer]');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    var layerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        layers.forEach(function (layer) { layer.classList.remove('is-active'); });
        entry.target.classList.add('is-active');
      });
    }, { rootMargin: '-34% 0px -50% 0px', threshold: 0 });
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
    if (!mobileHeader.matches) closeMenu(false);
    updateStickyEligibility();
    updatePageState();
  }

  window.addEventListener('resize', handleViewportChange);
  window.addEventListener('orientationchange', function () {
    window.setTimeout(handleViewportChange, 120);
  });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', updateStickyEligibility);
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', function () {
    updateStickyEligibility();
    if (reducedMotion.matches) motionTargets.forEach(function (target) { target.classList.add('is-visible'); });
  });
  if (desktopSticky.addEventListener) desktopSticky.addEventListener('change', updateStickyEligibility);
  if (mobileHeader.addEventListener) mobileHeader.addEventListener('change', handleViewportChange);

  root.classList.add('enhanced');
  updateStickyEligibility();
  updatePageState();
}());
