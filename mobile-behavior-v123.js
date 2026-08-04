(function () {
  const mobileQuery = window.matchMedia('(max-width: 1200px), ((max-height: 540px) and (orientation: landscape))');
  const header = document.querySelector('.global-header') || document.querySelector('header');
  const siteNav = header ? header.querySelector('.site-nav') : document.querySelector('.site-nav');
  const menuToggle = header ? header.querySelector('.mobile-menu-toggle') : document.querySelector('.mobile-menu-toggle');
  const root = document.documentElement;
  const body = document.body;

  function installRuntimeFixes() {
    if (document.getElementById('mobile-behavior-runtime-fixes-v126')) return;
    const style = document.createElement('style');
    style.id = 'mobile-behavior-runtime-fixes-v126';
    style.textContent = `
      @keyframes proaiLegacyHeaderCubeSpin {
        from { transform: rotateX(0deg) rotateY(0deg); }
        to { transform: rotateX(360deg) rotateY(360deg); }
      }
      .global-header .logo-cube {
        animation-name: proaiLegacyHeaderCubeSpin !important;
        animation-duration: 10s !important;
        animation-timing-function: linear !important;
        animation-iteration-count: infinite !important;
        animation-play-state: running !important;
        transform-style: preserve-3d !important;
      }
      .global-header .logo-text,
      .global-header .site-nav a,
      .global-header .lang-link,
      .global-header .start-btn {
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
        font-synthesis: none !important;
        font-kerning: normal !important;
      }
      .global-header .start-btn {
        width: 184px !important;
        min-width: 184px !important;
        max-width: 184px !important;
        height: 44px !important;
        min-height: 44px !important;
        padding: 0 20px !important;
        line-height: 1 !important;
      }
      .global-header .lang-link {
        width: 52px !important;
        min-width: 52px !important;
        line-height: 1 !important;
        text-align: center !important;
      }
      @media (max-width: 1200px), ((max-height: 540px) and (orientation: landscape)) {
        header.header-hidden { transform: translateY(calc(-100% - 2px)) !important; }
        body.mobile-nav-open header,
        body.mobile-nav-open header.header-hidden,
        body.menu-open header,
        body.menu-open header.header-hidden { transform: translateY(0) !important; }
        .global-header .start-btn { display: none !important; }
      }
      @media (prefers-reduced-motion: reduce) {
        .global-header .logo-cube {
          animation: none !important;
          transform: rotateX(-18deg) rotateY(28deg) !important;
        }
      }
      body.lang-ru .f-socials { display: none !important; }
    `;
    document.head.appendChild(style);
  }

  function normalizeHeaderContent() {
    if (!header) return;
    const isRussian = (document.documentElement.lang || '').toLowerCase().startsWith('ru');
    const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
    const cta = header.querySelector('.start-btn');
    const locale = header.querySelector('.lang-link');

    if (cta) {
      cta.textContent = isRussian ? 'Обсудить проект' : 'Discuss Project';
      cta.setAttribute('href', isRussian ? '/ru/contact/#project-intake' : '/contact/#project-intake');
      cta.setAttribute('aria-label', isRussian ? 'Обсудить проект с ProAI Expert' : 'Discuss a project with ProAI Expert');
    }

    if (locale) {
      locale.textContent = isRussian ? 'EN' : 'RU';
    }

    if (siteNav) {
      siteNav.querySelectorAll('a').forEach((link) => {
        const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/+$/, '') || '/';
        const exact = currentPath === linkPath;
        const familyMatch = linkPath !== '/' && currentPath.startsWith(`${linkPath}/`);
        const active = exact || familyMatch;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    }
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
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
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
  normalizeHeaderContent();
  syncFounderVoiceLinks();
  installCanonicalMenuOwner();

  window.addEventListener('scroll', requestHeaderVisibilitySync, { passive: true });
  window.addEventListener('hashchange', () => {
    closeMenu(false);
    normalizeHeaderContent();
    if (header) header.classList.remove('header-hidden');
    requestHeaderVisibilitySync();
  });
  window.addEventListener('pageshow', () => {
    normalizeHeaderContent();
    syncViewportFlags();
  });
  window.addEventListener('orientationchange', () => window.setTimeout(syncViewportFlags, 120));
  window.addEventListener('resize', syncViewportFlags);
  syncViewportFlags();
})();
