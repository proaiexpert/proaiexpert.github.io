(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var header = document.querySelector('[data-global-header]');
  var toggle = document.querySelector('.mobile-menu-toggle');
  var siteNav = document.querySelector('.site-nav');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileHeader = window.matchMedia('(max-width: 1100px), ((max-height: 540px) and (orientation: landscape))');
  var lastScrollY = window.scrollY;
  var scrollTicking = false;

  function menuLabel(open) {
    var isRussian = body.classList.contains('case-alina-horb--ru');
    if (isRussian) return open ? 'Закрыть меню' : 'Открыть меню';
    return open ? 'Close menu' : 'Open menu';
  }

  function closeMenu(restoreFocus) {
    if (!toggle || !siteNav) return;
    siteNav.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', menuLabel(false));
    body.classList.remove('menu-open');
    if (restoreFocus) toggle.focus();
  }

  function openMenu() {
    if (!toggle || !siteNav) return;
    siteNav.classList.add('is-open');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', menuLabel(true));
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
    if (mobileHeader.matches && !body.classList.contains('menu-open') && currentY > 20) {
      if (currentY > lastScrollY + 10) header.classList.add('header-hidden');
      else if (currentY < lastScrollY - 10) header.classList.remove('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }
    lastScrollY = currentY;
  }

  window.addEventListener('scroll', function () {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(function () {
      updateHeader();
      scrollTicking = false;
    });
  }, { passive: true });

  var headlineTargets = Array.prototype.slice.call(document.querySelectorAll('[data-headline]'));
  var portraitTargets = Array.prototype.slice.call(document.querySelectorAll('[data-portrait]'));
  var maskTargets = Array.prototype.slice.call(document.querySelectorAll('[data-mask]'));
  var stepGroups = Array.prototype.slice.call(document.querySelectorAll('[data-steps]'));
  var motionTargets = headlineTargets.concat(portraitTargets, maskTargets, stepGroups);

  stepGroups.forEach(function (group) {
    group.querySelectorAll(':scope > li').forEach(function (step, index) {
      step.style.setProperty('--step-delay', Math.min(index * 90, 270) + 'ms');
    });
  });

  function showAllMotion() {
    motionTargets.forEach(function (target) { target.classList.add('is-visible'); });
  }

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.06 });

    motionTargets.forEach(function (target) { observer.observe(target); });
    window.requestAnimationFrame(function () { root.classList.add('motion-ready'); });
  } else {
    showAllMotion();
  }

  function handleViewportChange() {
    if (!mobileHeader.matches) closeMenu(false);
    updateHeader();
  }

  window.addEventListener('resize', handleViewportChange);
  window.addEventListener('orientationchange', function () {
    window.setTimeout(handleViewportChange, 120);
  });

  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener('change', function () {
      if (reducedMotion.matches) showAllMotion();
    });
  }
  if (mobileHeader.addEventListener) mobileHeader.addEventListener('change', handleViewportChange);

  root.classList.add('enhanced');
  updateHeader();
}());
