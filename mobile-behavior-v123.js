(function () {
  const mobileQuery = window.matchMedia('(max-width: 1100px), ((max-height: 540px) and (orientation: landscape))');
  const header = document.querySelector('header');
  const siteNav = document.querySelector('.site-nav');
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const root = document.documentElement;
  const body = document.body;
  let lastY = window.scrollY || 0;
  let ticking = false;
  const threshold = 10;

  function openMobileMenu() {
    if (!siteNav || !menuToggle || !mobileQuery.matches) return;
    siteNav.classList.add('is-open');
    menuToggle.classList.add('is-open');
    syncMenuState();
  }

  function closeMobileMenu() {
    if (!siteNav || !menuToggle) return;
    siteNav.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    syncMenuState();
  }

  function syncHeaderVisibility(force) {
    if (!header) return;
    if (!mobileQuery.matches) {
      header.classList.remove('header-hidden');
      lastY = window.scrollY || 0;
      return;
    }

    const currentY = window.scrollY || 0;
    const delta = currentY - lastY;
    const menuOpen = !!(siteNav && siteNav.classList.contains('is-open'));

    if (force || menuOpen || currentY < 20) {
      header.classList.remove('header-hidden');
      lastY = currentY;
      return;
    }

    if (delta > threshold) {
      header.classList.add('header-hidden');
    } else if (delta < -threshold) {
      header.classList.remove('header-hidden');
    }

    lastY = currentY;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      syncHeaderVisibility(false);
      ticking = false;
    });
  }

  function syncViewportFlags() {
    const mobile = mobileQuery.matches;
    body.classList.toggle('mobile-optimized', mobile);
    if (!mobile) {
      body.classList.remove('mobile-nav-open', 'menu-open');
      if (siteNav) siteNav.classList.remove('is-open');
      if (menuToggle) {
        menuToggle.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
      if (header) header.classList.remove('header-hidden');
      root.style.removeProperty('scroll-padding-top');
      return;
    }

    const headerHeight = (getComputedStyle(root).getPropertyValue('--header-h') || '78px').trim();
    root.style.setProperty('scroll-padding-top', `calc(${headerHeight} + 20px)`);
    syncMenuState();
    syncHeaderVisibility(true);
  }

  function syncMenuState() {
    if (!siteNav) return;
    const open = mobileQuery.matches && siteNav.classList.contains('is-open');
    body.classList.toggle('mobile-nav-open', open);
    body.classList.toggle('menu-open', open);
    if (menuToggle) {
      menuToggle.classList.toggle('is-open', open);
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    if (open && header) header.classList.remove('header-hidden');
    syncHeaderVisibility(true);
  }

  if (siteNav) {
    const observer = new MutationObserver(syncMenuState);
    observer.observe(siteNav, { attributes: true, attributeFilter: ['class'] });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      if (siteNav.classList.contains('is-open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Escape' || e.keyCode === 27) && siteNav && siteNav.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  window.addEventListener('hashchange', () => {
    closeMobileMenu();
    syncHeaderVisibility(true);
  });

  window.addEventListener('pageshow', () => {
    syncViewportFlags();
  });

  window.addEventListener('orientationchange', () => {
    window.setTimeout(syncViewportFlags, 120);
  });

  window.addEventListener('resize', syncViewportFlags);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('touchmove', onScroll, { passive: true });
  syncViewportFlags();
})();
