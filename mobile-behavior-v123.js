(function () {
  const mobileQuery = window.matchMedia('(max-width: 1100px), ((max-height: 540px) and (orientation: landscape))');
  const header = document.querySelector('header');
  const siteNav = document.querySelector('.site-nav');
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const root = document.documentElement;
  const body = document.body;

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
  }

  if (siteNav) {
    const observer = new MutationObserver(syncMenuState);
    observer.observe(siteNav, { attributes: true, attributeFilter: ['class'] });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        window.requestAnimationFrame(() => {
          if (header) header.classList.remove('header-hidden');
          syncMenuState();
        });
      });
    });
  }

  window.addEventListener('hashchange', () => {
    if (header) header.classList.remove('header-hidden');
    syncMenuState();
  });

  window.addEventListener('pageshow', () => {
    syncViewportFlags();
  });

  window.addEventListener('orientationchange', () => {
    window.setTimeout(syncViewportFlags, 120);
  });

  window.addEventListener('resize', syncViewportFlags);
  syncViewportFlags();
})();
