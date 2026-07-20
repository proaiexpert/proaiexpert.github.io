(function () {
  const mobileQuery = window.matchMedia('(max-width: 1100px), ((max-height: 540px) and (orientation: landscape))');
  const header = document.querySelector('header');
  const siteNav = document.querySelector('.site-nav');
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const root = document.documentElement;
  const body = document.body;
  const hasInlineHeaderController = !!document.querySelector('#mobile-header-global-fix-script');

  function installRuntimeFixes() {
    if (document.getElementById('mobile-behavior-runtime-fixes-v124')) return;
    const style = document.createElement('style');
    style.id = 'mobile-behavior-runtime-fixes-v124';
    style.textContent = `
      @media (max-width: 1100px), ((max-height: 540px) and (orientation: landscape)) {
        header.header-hidden {
          transform: translateY(calc(-100% - 2px)) !important;
        }
        body.mobile-nav-open header,
        body.mobile-nav-open header.header-hidden,
        body.menu-open header,
        body.menu-open header.header-hidden {
          transform: translateY(0) !important;
        }
      }
      body.lang-ru .f-socials {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function resetMenuState() {
    body.classList.remove('mobile-nav-open', 'menu-open');
    if (siteNav) siteNav.classList.remove('is-open');
    if (menuToggle) {
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  }

  function syncSharedFlagsFromNav() {
    if (!siteNav) return;
    const open = mobileQuery.matches && siteNav.classList.contains('is-open');
    body.classList.toggle('mobile-nav-open', open);
    if (open && header) header.classList.remove('header-hidden');
  }

  function syncFallbackMenuState() {
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

  let lastScrollY = window.scrollY || 0;
  let scrollTicking = false;

  function syncHeaderVisibility() {
    scrollTicking = false;
    if (!header) return;

    if (!mobileQuery.matches) {
      header.classList.remove('header-hidden');
      lastScrollY = window.scrollY || 0;
      return;
    }

    const navOpen = body.classList.contains('mobile-nav-open') || body.classList.contains('menu-open') || (siteNav && siteNav.classList.contains('is-open'));
    const currentY = Math.max(0, window.scrollY || 0);
    const delta = currentY - lastScrollY;

    if (navOpen || currentY < 24 || delta < -6) {
      header.classList.remove('header-hidden');
    } else if (delta > 8 && currentY > 120) {
      header.classList.add('header-hidden');
    }

    lastScrollY = currentY;
  }

  function requestHeaderVisibilitySync() {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(syncHeaderVisibility);
  }

  function syncViewportFlags() {
    const mobile = mobileQuery.matches;
    body.classList.toggle('mobile-optimized', mobile);

    if (!mobile) {
      resetMenuState();
      if (header) header.classList.remove('header-hidden');
      root.style.removeProperty('scroll-padding-top');
      return;
    }

    const headerHeight = (getComputedStyle(root).getPropertyValue('--header-h') || '78px').trim();
    root.style.setProperty('scroll-padding-top', `calc(${headerHeight} + 20px)`);

    if (hasInlineHeaderController) {
      syncSharedFlagsFromNav();
    } else {
      syncFallbackMenuState();
    }
    requestHeaderVisibilitySync();
  }

  installRuntimeFixes();

  if (siteNav) {
    const observer = new MutationObserver(() => {
      if (hasInlineHeaderController) {
        syncSharedFlagsFromNav();
      } else {
        syncFallbackMenuState();
      }
      requestHeaderVisibilitySync();
    });
    observer.observe(siteNav, { attributes: true, attributeFilter: ['class'] });
  }

  window.addEventListener('scroll', requestHeaderVisibilitySync, { passive: true });

  window.addEventListener('hashchange', () => {
    if (header) header.classList.remove('header-hidden');
    if (hasInlineHeaderController) {
      syncSharedFlagsFromNav();
    } else {
      syncFallbackMenuState();
    }
    requestHeaderVisibilitySync();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !siteNav || !siteNav.classList.contains('is-open')) return;
    resetMenuState();
    if (menuToggle) menuToggle.focus();
  });

  window.addEventListener('pageshow', syncViewportFlags);

  window.addEventListener('orientationchange', () => {
    window.setTimeout(syncViewportFlags, 120);
  });

  window.addEventListener('resize', syncViewportFlags);
  syncViewportFlags();
})();
