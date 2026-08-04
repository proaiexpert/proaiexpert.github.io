(function () {
  const mobileQuery = window.matchMedia('(max-width: 1200px), ((max-height: 540px) and (orientation: landscape))');
  const header = document.querySelector('.global-header') || document.querySelector('header');
  const siteNav = header ? header.querySelector('.site-nav') : document.querySelector('.site-nav');
  const menuToggle = header ? header.querySelector('.mobile-menu-toggle') : document.querySelector('.mobile-menu-toggle');
  const root = document.documentElement;
  const body = document.body;

  function installRuntimeFixes() {
    if (document.getElementById('mobile-behavior-runtime-fixes-v125')) return;
    const style = document.createElement('style');
    style.id = 'mobile-behavior-runtime-fixes-v125';
    style.textContent = `
      @media (max-width: 1200px), ((max-height: 540px) and (orientation: landscape)) {
        header.header-hidden { transform: translateY(calc(-100% - 2px)) !important; }
        body.mobile-nav-open header,
        body.mobile-nav-open header.header-hidden,
        body.menu-open header,
        body.menu-open header.header-hidden { transform: translateY(0) !important; }
      }
      body.lang-ru .f-socials { display: none !important; }
    `;
    document.head.appendChild(style);
  }

  function syncFounderVoiceLinks() {
    if (!body.classList.contains('page-article')) return;
    const isRussian = (document.documentElement.lang || '').toLowerCase().startsWith('ru');
    const label = isRussian ? 'Мой подход' : 'My approach';
    const ariaLabel = isRussian ? 'Мой подход к работе ProAI Expert' : 'My approach at ProAI Expert';
    document.querySelectorAll('.premium-author-link, .lead-author-link').forEach((link) => {
      link.textContent = label;
      link.setAttribute('aria-label', ariaLabel);
    });
  }

  function isOpen() {
    return !!(siteNav && siteNav.classList.contains('is-open'));
  }

  function applyMenuState(open, returnFocus) {
    if (!siteNav || !menuToggle) return;
    siteNav.classList.toggle('is-open', open);
    menuToggle.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    body.classList.toggle('mobile-nav-open', open);
    body.classList.toggle('menu-open', open);
    if (open && header) header.classList.remove('header-hidden');
    if (!open && returnFocus) menuToggle.focus();
  }

  function closeMenu(returnFocus) {
    applyMenuState(false, returnFocus);
  }

  function toggleMenu() {
    if (!mobileQuery.matches) return;
    applyMenuState(!isOpen(), false);
  }

  function resetMenuState() {
    closeMenu(false);
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
    const currentY = Math.max(0, window.scrollY || 0);
    const delta = currentY - lastScrollY;
    if (isOpen() || currentY < 24 || delta < -6) {
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
    const headerHeight = header ? `${Math.round(header.getBoundingClientRect().height || 85)}px` : '85px';
    root.style.setProperty('scroll-padding-top', `calc(${headerHeight} + 20px)`);
    if (isOpen() && header) header.classList.remove('header-hidden');
    requestHeaderVisibilitySync();
  }

  function installCanonicalMenuOwner() {
    if (!siteNav || !menuToggle) return;

    /* Capture phase prevents older inline listeners from becoming a second owner. */
    menuToggle.addEventListener('click', (event) => {
      if (!mobileQuery.matches) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      toggleMenu();
    }, true);

    siteNav.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!link || !mobileQuery.matches) return;
      closeMenu(false);
    }, true);

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !isOpen()) return;
      event.preventDefault();
      closeMenu(true);
    });

    document.addEventListener('click', (event) => {
      if (!mobileQuery.matches || !isOpen() || !header) return;
      if (header.contains(event.target)) return;
      closeMenu(false);
    });
  }

  installRuntimeFixes();
  syncFounderVoiceLinks();
  installCanonicalMenuOwner();

  window.addEventListener('scroll', requestHeaderVisibilitySync, { passive: true });
  window.addEventListener('hashchange', () => {
    closeMenu(false);
    if (header) header.classList.remove('header-hidden');
    requestHeaderVisibilitySync();
  });
  window.addEventListener('pageshow', syncViewportFlags);
  window.addEventListener('orientationchange', () => window.setTimeout(syncViewportFlags, 120));
  window.addEventListener('resize', syncViewportFlags);
  syncViewportFlags();
})();
