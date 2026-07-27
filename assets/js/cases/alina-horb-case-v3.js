(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('[data-global-header]');
  const menuButton = document.querySelector('.mobile-menu-toggle');
  const navigation = document.querySelector('#site-navigation');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isRussian = () => document.documentElement.lang === 'ru';

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    menuButton.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', isRussian() ? 'Открыть меню' : 'Open menu');
    navigation.classList.remove('is-open');
    body.classList.remove('menu-open');
  };

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.classList.toggle('is-open', willOpen);
      menuButton.setAttribute('aria-expanded', String(willOpen));
      menuButton.setAttribute('aria-label', willOpen
        ? (isRussian() ? 'Закрыть меню' : 'Close menu')
        : (isRussian() ? 'Открыть меню' : 'Open menu'));
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

  const animated = [...document.querySelectorAll('[data-threshold], [data-lock], [data-pair], .ahv3-section h2')];
  if (!('IntersectionObserver' in window)) {
    animated.forEach((element) => element.classList.add('is-active'));
    // fallback for no IO
  } else {
    if (reduceMotion) {
      animated.forEach((element) => element.classList.add('is-active'));
    } else {
      root.classList.add('motion-ready');
      let activeGroups = 0;
      const motionQueue = [];
      const maxConcurrentEffects = () => window.matchMedia('(max-width: 767px)').matches ? 1 : 2;

      const runNext = () => {
        while (activeGroups < maxConcurrentEffects() && motionQueue.length) {
          const element = motionQueue.shift();
          if (element.classList.contains('is-active')) continue;
          activeGroups += 1;
          element.classList.add('is-active');
          window.setTimeout(() => {
            activeGroups = Math.max(0, activeGroups - 1);
            runNext();
          }, 640);
        }
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          motionQueue.push(entry.target);
        });
        runNext();
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.14 });

      animated.forEach((element) => observer.observe(element));
    }

    // Progress Orientation & Theme Sync
    const sections = document.querySelectorAll('.ahv3-section, .ahv3-hero');
    const progressLinks = document.querySelectorAll('.ahv3-progress-link');
    const rail = document.getElementById('progress-rail');
    const mobileBar = document.getElementById('mobile-progress-bar');
    const footerNav = document.querySelector('.case-cross-nav');

    if (sections.length) {
      const sectionObserver = new IntersectionObserver((entries) => {
        let activeSectionId = null;
        let activeTheme = null;

        entries.forEach(entry => {
          if (entry.isIntersecting) {
            activeSectionId = entry.target.id;
            activeTheme = entry.target.getAttribute('data-theme') || null;
          }
        });

        if (activeSectionId) {
          progressLinks.forEach(link => {
            const isActive = link.getAttribute('data-section') === activeSectionId;
            link.classList.toggle('is-active', isActive);
            if (isActive) {
              link.setAttribute('aria-current', 'location');
            } else {
              link.removeAttribute('aria-current');
            }
          });

          body.classList.toggle('ivory-active', activeTheme === 'ivory');

          if (mobileBar) {
            const total = sections.length - 1;
            const index = Array.from(sections).findIndex(s => s.id === activeSectionId);
            const percent = total > 0 ? Math.max(0, index) / total : 0;
            mobileBar.style.transform = `scaleX(${percent})`;
          }
        }
      }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

      sections.forEach(s => sectionObserver.observe(s));
    }

    if (rail && footerNav) {
      const endObserver = new IntersectionObserver((entries) => {
        const isEndVisible = entries[0].isIntersecting;
        if (isEndVisible) {
          rail.classList.remove('is-visible');
        } else {
          // Check if we are past hero to show rail
          const hero = document.getElementById('hero');
          if (hero) {
            const heroRect = hero.getBoundingClientRect();
            if (heroRect.bottom < window.innerHeight / 2) {
              rail.classList.add('is-visible');
            }
          } else {
            rail.classList.add('is-visible');
          }
        }
      }, { rootMargin: '0px', threshold: 0 });
      endObserver.observe(footerNav);
    }
  }
})();
