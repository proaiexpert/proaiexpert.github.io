(function () {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('#site-navigation');
  const body = document.body;
  const main = document.querySelector('#main-content');
  const skip = document.querySelector('.skip-link');
  const mobile = window.matchMedia('(max-width: 1200px), ((max-height: 540px) and (orientation: landscape))');
  if (!toggle || !nav || toggle.dataset.premiumHotfixBound === 'true') return;
  toggle.dataset.premiumHotfixBound = 'true';

  let lockedY = 0;
  const items = () => [...nav.querySelectorAll('a[href]')];

  function lock() {
    lockedY = window.scrollY || 0;
    body.style.position = 'fixed';
    body.style.top = `-${lockedY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
  }

  function unlock() {
    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.right = '';
    body.style.width = '';
    window.scrollTo(0, lockedY);
  }

  function setOpen(open, focusFirst) {
    nav.classList.toggle('is-open', open);
    nav.classList.toggle('premium-hotfix-open', open);
    body.classList.toggle('menu-open', open);
    body.classList.toggle('mobile-nav-open', open);
    body.classList.toggle('premium-hotfix-menu-open', open);
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      lock();
      if (focusFirst) requestAnimationFrame(() => items()[0]?.focus({preventScroll: true}));
    } else {
      unlock();
    }
  }

  toggle.addEventListener('click', (event) => {
    if (!mobile.matches) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    setOpen(open, event.detail === 0);
  }, true);

  nav.addEventListener('click', (event) => {
    if (mobile.matches && event.target.closest('a[href]')) setOpen(false, false);
  }, true);

  document.addEventListener('keydown', (event) => {
    if (!mobile.matches || toggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false, false);
      toggle.focus();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = items();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      toggle.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      toggle.focus();
    } else if (event.shiftKey && document.activeElement === toggle) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === toggle) {
      event.preventDefault();
      first.focus();
    }
  }, true);

  mobile.addEventListener('change', (event) => {
    if (!event.matches && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, false);
  });
  window.addEventListener('pagehide', () => {
    if (toggle.getAttribute('aria-expanded') === 'true') setOpen(false, false);
  });

  if (skip && main) {
    skip.addEventListener('click', () => {
      window.setTimeout(() => main.focus({preventScroll: true}), 0);
    });
  }
  document.documentElement.classList.add('premium-article-hotfix-ready');
})();
