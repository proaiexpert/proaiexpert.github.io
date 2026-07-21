(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('[data-global-header]');
  const menuButton = document.querySelector('.mobile-menu-toggle');
  const navigation = document.querySelector('#site-navigation');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    menuButton.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', body.lang === 'ru' ? 'Открыть меню' : 'Open menu');
    navigation.classList.remove('is-open');
    body.classList.remove('menu-open');
  };

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.classList.toggle('is-open', willOpen);
      menuButton.setAttribute('aria-expanded', String(willOpen));
      menuButton.setAttribute('aria-label', willOpen
        ? (body.lang === 'ru' ? 'Закрыть меню' : 'Close menu')
        : (body.lang === 'ru' ? 'Открыть меню' : 'Open menu'));
      navigation.classList.toggle('is-open', willOpen);
      body.classList.toggle('menu-open', willOpen);
    });

    navigation.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuButton.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    }, { passive: true });
  }

  const updateHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const animated = [...document.querySelectorAll('[data-threshold], [data-accent], [data-lock], [data-pair], [data-handoff]')];
  if (!animated.length || reduceMotion || !('IntersectionObserver' in window)) {
    animated.forEach((element) => element.classList.add('is-active'));
    return;
  }

  root.classList.add('motion-ready');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-active');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.14 });

  animated.forEach((element) => observer.observe(element));
})();
