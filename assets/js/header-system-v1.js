(() => {
  'use strict';
  const header = document.querySelector('[data-site-header]');
  if (!header) return;
  const toggle = header.querySelector('.site-header__menu-toggle');
  const nav = header.querySelector('.site-header__nav');
  if (!toggle || !nav) return;
  const openLabel = toggle.dataset.openLabel || 'Open menu';
  const closeLabel = toggle.dataset.closeLabel || 'Close menu';
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? closeLabel : openLabel);
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
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
  const syncScrollState = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  syncScrollState();
  window.addEventListener('scroll', syncScrollState, { passive: true });
  window.addEventListener('resize', () => {
    if (!window.matchMedia('(max-width: 1260px)').matches) setOpen(false);
  }, { passive: true });
})();