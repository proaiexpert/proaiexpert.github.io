(function () {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('#site-navigation');
  if (!toggle || !nav) return;

  const mobile = window.matchMedia('(max-width: 1200px), ((max-height: 540px) and (orientation: landscape))');
  const focusable = () => [...nav.querySelectorAll('a[href]')].filter((item) => !item.hasAttribute('hidden'));
  const navParent = nav.parentNode;
  const navNextSibling = nav.nextSibling;
  let lockedScrollY = 0;
  let isLocked = false;

  function mountOverlay() {
    if (nav.parentNode !== document.body) document.body.appendChild(nav);
  }

  function restoreNav() {
    if (nav.parentNode === navParent) return;
    if (navNextSibling && navNextSibling.parentNode === navParent) navParent.insertBefore(nav, navNextSibling);
    else navParent.appendChild(nav);
  }

  function lockPage() {
    if (isLocked) return;
    lockedScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    isLocked = true;
  }

  function unlockPage() {
    if (!isLocked) return;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, lockedScrollY);
    isLocked = false;
  }

  function setOpen(open, returnFocus) {
    if (open) mountOverlay();
    nav.classList.toggle('is-open', open);
    nav.classList.toggle('mobile-nav-open', open);
    document.body.classList.toggle('mobile-nav-open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));

    if (open) {
      lockPage();
      focusable()[0]?.focus({ preventScroll: true });
    } else {
      unlockPage();
      restoreNav();
      if (returnFocus) toggle.focus();
    }
  }

  toggle.addEventListener('click', (event) => {
    event.stopImmediatePropagation();
    setOpen(toggle.getAttribute('aria-expanded') !== 'true', false);
  }, true);

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a[href]') && mobile.matches) setOpen(false, false);
  });

  document.addEventListener('keydown', (event) => {
    if (!mobile.matches || toggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(false, true);
      return;
    }
    if (event.key !== 'Tab') return;
    const items = focusable();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      event.stopImmediatePropagation();
      toggle.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      event.stopImmediatePropagation();
      toggle.focus();
    } else if (event.shiftKey && document.activeElement === toggle) {
      event.preventDefault();
      event.stopImmediatePropagation();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === toggle) {
      event.preventDefault();
      event.stopImmediatePropagation();
      first.focus();
    }
  }, true);

  new MutationObserver(() => {
    const open = nav.classList.contains('is-open') || nav.classList.contains('mobile-nav-open');
    if (!open && isLocked) {
      toggle.setAttribute('aria-expanded', 'false');
      unlockPage();
    }
  }).observe(nav, { attributes: true, attributeFilter: ['class'] });

  mobile.addEventListener('change', (event) => {
    if (!event.matches) setOpen(false, false);
  });

  window.addEventListener('pagehide', () => {
    unlockPage();
    restoreNav();
  });
})();
