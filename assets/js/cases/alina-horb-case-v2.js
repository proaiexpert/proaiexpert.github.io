(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var header = document.querySelector('[data-global-header]');
  var toggle = document.querySelector('.mobile-menu-toggle');
  var siteNav = document.querySelector('.site-nav');
  var threshold = document.querySelector('[data-threshold]');
  var evidenceLock = document.querySelector('[data-evidence-lock]');
  var languageAlign = document.querySelector('[data-language-align]');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileHeader = window.matchMedia('(max-width: 1100px), ((max-height: 540px) and (orientation: landscape))');
  var lastScrollY = window.scrollY;
  var scrollTicking = false;

  function menuLabel(open) {
    var russian = body.classList.contains('ahv2-case--ru');
    if (russian) return open ? 'Закрыть меню' : 'Открыть меню';
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

  function setPortalWidth() {
    if (!threshold) return;
    var portal = threshold.querySelector('.ahv2-portal-shell');
    if (portal) threshold.style.setProperty('--portal-width', portal.offsetWidth + 'px');
  }

  function revealAll() {
    [threshold, evidenceLock, languageAlign].forEach(function (target) {
      if (target) target.classList.add('is-active');
    });
  }

  function observeOnce(target) {
    if (!target) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-active');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });
    observer.observe(target);
  }

  setPortalWidth();
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    root.classList.add('motion-ready');
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        if (threshold) threshold.classList.add('is-active');
      });
    });
    observeOnce(evidenceLock);
    observeOnce(languageAlign);
  } else {
    revealAll();
  }

  function handleViewportChange() {
    if (!mobileHeader.matches) closeMenu(false);
    setPortalWidth();
    updatePageState();
  }

  window.addEventListener('resize', handleViewportChange);
  window.addEventListener('orientationchange', function () {
    window.setTimeout(handleViewportChange, 120);
  });
  if (mobileHeader.addEventListener) mobileHeader.addEventListener('change', handleViewportChange);
  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener('change', function () {
      if (reducedMotion.matches) revealAll();
    });
  }

  updatePageState();
}());
