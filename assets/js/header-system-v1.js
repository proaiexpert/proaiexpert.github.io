(() => {
  'use strict';
  const header = document.querySelector('[data-site-header]');
  if (!header) return;
  const toggle = header.querySelector('.site-header__menu-toggle');
  const nav = header.querySelector('.site-header__nav');
  if (!toggle || !nav) return;

  const openLabel = toggle.dataset.openLabel || 'Open menu';
  const closeLabel = toggle.dataset.closeLabel || 'Close menu';
  const mobileQuery = window.matchMedia('(max-width: 1080px)');

  const styleId = 'proai-header-autohide-r1';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
@media (max-width:1080px){
  .site-header{transform:translate3d(0,0,0);will-change:transform;transition:transform 260ms cubic-bezier(.22,1,.36,1),background-color 180ms var(--proai-ease),border-color 180ms var(--proai-ease),box-shadow 180ms var(--proai-ease),backdrop-filter 180ms var(--proai-ease)}
  .site-header.header-hidden{transform:translate3d(0,calc(-100% - 2px),0)}
  body.menu-open .site-header,body.menu-open .site-header.header-hidden{transform:translate3d(0,0,0)!important}
}`;
    document.head.appendChild(style);
  }

  let lastScrollY = Math.max(0, window.scrollY || 0);
  let directionStartY = lastScrollY;
  let lastDirection = 0;
  let scrollTick = false;

  const isMenuOpen = () => toggle.getAttribute('aria-expanded') === 'true' || nav.classList.contains('is-open');
  const revealHeader = () => header.classList.remove('header-hidden');

  const resetAutoHide = ({ reveal = true } = {}) => {
    lastScrollY = Math.max(0, window.scrollY || 0);
    directionStartY = lastScrollY;
    lastDirection = 0;
    if (reveal) revealHeader();
  };

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? closeLabel : openLabel);
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (open) revealHeader();
    resetAutoHide({ reveal: open });
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (toggle.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) setOpen(false);
  });

  const syncScrollState = () => {
    scrollTick = false;
    const currentY = Math.max(0, window.scrollY || 0);
    header.classList.toggle('is-scrolled', currentY > 12);

    if (!mobileQuery.matches) {
      revealHeader();
      lastScrollY = currentY;
      directionStartY = currentY;
      lastDirection = 0;
      return;
    }

    const rawDelta = currentY - lastScrollY;
    const direction = Math.abs(rawDelta) < 1 ? 0 : rawDelta > 0 ? 1 : -1;

    if (direction && direction !== lastDirection) {
      directionStartY = lastScrollY;
      lastDirection = direction;
    }

    const directionalTravel = currentY - directionStartY;
    const shortLandscape = window.innerHeight <= 540 && window.innerWidth > window.innerHeight;
    const hideAfter = shortLandscape ? 90 : 120;

    if (isMenuOpen() || currentY < 24) {
      revealHeader();
      directionStartY = currentY;
      lastDirection = 0;
    } else if (direction < 0 && directionalTravel <= -8) {
      revealHeader();
      directionStartY = currentY;
    } else if (direction > 0 && currentY > hideAfter && directionalTravel >= 14) {
      header.classList.add('header-hidden');
    }

    lastScrollY = currentY;
  };

  const requestScrollSync = () => {
    if (scrollTick) return;
    scrollTick = true;
    window.requestAnimationFrame(syncScrollState);
  };

  const resetVisibleLifecycle = () => {
    resetAutoHide({ reveal: true });
    requestScrollSync();
  };

  header.addEventListener('focusin', () => {
    revealHeader();
    resetAutoHide({ reveal: false });
  });

  resetVisibleLifecycle();
  window.addEventListener('scroll', requestScrollSync, { passive: true });
  window.addEventListener('pageshow', resetVisibleLifecycle);
  window.addEventListener('orientationchange', () => {
    window.setTimeout(resetVisibleLifecycle, 120);
  });
  window.addEventListener('resize', () => {
    if (!mobileQuery.matches) setOpen(false);
    resetVisibleLifecycle();
  }, { passive: true });
  mobileQuery.addEventListener?.('change', () => {
    if (!mobileQuery.matches) setOpen(false);
    resetVisibleLifecycle();
  });
})();