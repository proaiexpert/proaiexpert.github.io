(() => {
  'use strict';

  const header = document.querySelector('[data-site-header]');
  if (!header) return;

  const toggle = header.querySelector('.site-header__menu-toggle');
  const nav = header.querySelector('.site-header__nav');
  if (!toggle || !nav) return;

  const openLabel = toggle.dataset.openLabel || 'Open menu';
  const closeLabel = toggle.dataset.closeLabel || 'Close menu';

  const installTypographyGuard = () => {
    if (document.getElementById('site-header-typography-guard-v2')) return;
    const style = document.createElement('style');
    style.id = 'site-header-typography-guard-v2';
    style.textContent = `
      .site-header__wordmark,
      .site-header__nav a,
      .site-header__locale,
      .site-header__cta {
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
        font-synthesis: none !important;
        font-kerning: normal !important;
        box-sizing: border-box !important;
      }
      .site-header__locale {
        width: 52px !important;
        min-width: 52px !important;
        max-width: 52px !important;
        height: 44px !important;
        min-height: 44px !important;
        padding: 0 !important;
        font-size: 13px !important;
        font-weight: 900 !important;
        line-height: 1 !important;
        letter-spacing: .5px !important;
        text-align: center !important;
      }
      .site-header__cta {
        width: 184px !important;
        min-width: 184px !important;
        max-width: 184px !important;
        height: 44px !important;
        min-height: 44px !important;
        padding: 0 20px !important;
        font-size: 11px !important;
        font-weight: 800 !important;
        line-height: 1 !important;
        letter-spacing: 1px !important;
        text-transform: uppercase !important;
      }
      @media (max-width: 1200px) {
        .site-header__nav a {
          font-size: clamp(17px, 4.2vw, 23px) !important;
          font-weight: 760 !important;
          line-height: 1.15 !important;
          letter-spacing: .02em !important;
          text-transform: none !important;
        }
      }
      @media (max-width: 620px) {
        .site-header__locale {
          width: 46px !important;
          min-width: 46px !important;
          max-width: 46px !important;
        }
        .site-header__nav a {
          font-size: clamp(17px, 5.5vw, 21px) !important;
        }
      }
      @media (max-height: 540px) and (orientation: landscape) {
        .site-header__nav a {
          font-size: clamp(14px, 2.4vw, 17px) !important;
          min-height: 47px !important;
          padding: 10px 0 !important;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? closeLabel : openLabel);
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  };

  installTypographyGuard();

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (toggle.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) {
      setOpen(false);
    }
  });

  const syncScrollState = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  syncScrollState();
  window.addEventListener('scroll', syncScrollState, { passive: true });

  window.addEventListener('resize', () => {
    const mobile = window.matchMedia('(max-width: 1200px)').matches;
    if (!mobile) setOpen(false);
  });
})();
