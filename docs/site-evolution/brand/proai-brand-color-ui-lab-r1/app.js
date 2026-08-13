(() => {
  const body = document.body;
  const tabs = [...document.querySelectorAll('.variant-tab')];
  const eventToggle = document.querySelector('.event-toggle');
  const label = document.querySelector('.hero-variant-label');
  const menu = document.querySelector('.lab-menu');
  const nav = document.querySelector('.lab-nav');

  const variants = {
    A: 'OBSIDIAN SPECTRUM / BALANCED',
    B: 'BLACK CHAMPAGNE / WARMER',
    C: 'COLD SPECTRAL / MORE MACHINE',
    D: 'MONOCHROME / CONTROL'
  };

  function setVariant(key) {
    if (!variants[key]) key = 'A';
    body.dataset.heroVariant = key;
    tabs.forEach(tab => tab.classList.toggle('is-active', tab.dataset.variant === key));
    if (label) label.innerHTML = `<b>${key}</b><span>${variants[key]}</span>`;
    const url = new URL(location.href);
    url.searchParams.set('variant', key);
    history.replaceState({}, '', url);
  }

  const initial = new URL(location.href).searchParams.get('variant');
  setVariant(initial || 'A');

  tabs.forEach(tab => tab.addEventListener('click', () => setVariant(tab.dataset.variant)));

  eventToggle?.addEventListener('click', () => {
    const active = eventToggle.getAttribute('aria-pressed') === 'true';
    eventToggle.setAttribute('aria-pressed', String(!active));
    body.classList.toggle('machine-event', !active);
  });

  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!open));
    nav?.classList.toggle('is-open', !open);
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menu?.setAttribute('aria-expanded', 'false');
  }));

  function parseHex(hex) {
    const value = hex.replace('#', '').trim();
    const full = value.length === 3 ? value.split('').map(x => x + x).join('') : value;
    return [0,2,4].map(i => parseInt(full.slice(i, i + 2), 16));
  }
  function channel(c) {
    c /= 255;
    return c <= .04045 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4);
  }
  function luminance(hex) {
    const [r,g,b] = parseHex(hex).map(channel);
    return .2126*r + .7152*g + .0722*b;
  }
  function ratio(a,b) {
    const l1 = luminance(a), l2 = luminance(b);
    return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);
  }
  const checks = [
    ['H1 warm pearl', '#F3F1EC', '#050607', 4.5],
    ['Hero body', '#A6ABB1', '#050607', 4.5],
    ['Hero eyebrow', '#C0C3C6', '#050607', 4.5],
    ['Hero microcopy', '#858A90', '#050607', 4.5],
    ['Warm CTA label', '#111315', '#E8E0D2', 4.5],
    ['Dark CTA label', '#F2EFE8', '#111315', 4.5],
    ['Inverse primary text', '#111315', '#F2EFE8', 4.5],
    ['Inverse body', '#62666B', '#F2EFE8', 4.5],
    ['Champagne focus vs black', '#C7A768', '#050607', 3],
    ['Pearl semantic text', '#ECEAE5', '#181D23', 4.5]
  ];
  const grid = document.getElementById('contrast-grid');
  if (grid) {
    grid.innerHTML = checks.map(([name,fg,bg,min]) => {
      const r = ratio(fg,bg);
      const pass = r >= min;
      return `<article class="contrast-card ${pass ? 'pass' : ''}"><span>${name}</span><b>${r.toFixed(2)}:1</b><small>${fg} on ${bg} · target ${min}:1</small></article>`;
    }).join('');
  }
})();
