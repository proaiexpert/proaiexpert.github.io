(function () {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('#site-navigation');
  if (!toggle || !nav) return;

  const mobile = window.matchMedia('(max-width: 1100px), ((max-height: 540px) and (orientation: landscape))');
  const links = () => [...nav.querySelectorAll('a[href]')];

  function setOpen(open, returnFocus) {
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('mobile-nav-open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) links()[0]?.focus();
    else if (returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true', false));
  document.addEventListener('keydown', (event) => {
    if (!mobile.matches || toggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false, true); return; }
    if (event.key !== 'Tab') return;
    const items = links();
    if (!items.length) return;
    const first = items[0]; const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  mobile.addEventListener('change', (event) => { if (!event.matches) setOpen(false, false); });
})();
