/* ─── Navigation — ProAI Expert v2 ─── */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ── Mobile toggle ── */
    var toggle = document.querySelector('.nav-toggle');
    var menu   = document.querySelector('.nav-menu');
    var mobileQuery = window.matchMedia('(max-width: 900px)');
    var siteHeader = document.querySelector('.site-header');

    if (menu) {
      var headerPrimaryCta = document.querySelector('.header-actions .btn--primary');
      if (headerPrimaryCta && !menu.querySelector('.nav-menu-cta')) {
        var mobileCtaWrap = document.createElement('div');
        mobileCtaWrap.className = 'nav-menu-cta';
        mobileCtaWrap.appendChild(headerPrimaryCta.cloneNode(true));
        menu.appendChild(mobileCtaWrap);
      }
    }

    function openMenu() {
      menu.classList.add('is-open');
      toggle.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-open');
      if (siteHeader) {
        siteHeader.classList.remove('is-hidden');
      }
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }

    if (toggle && menu) {

      toggle.addEventListener('click', function () {
        if (menu.classList.contains('is-open')) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      document.addEventListener('keydown', function (e) {
        if ((e.key === 'Escape' || e.keyCode === 27) && menu.classList.contains('is-open')) {
          closeMenu();
          toggle.focus();
        }
      });

      document.addEventListener('click', function (e) {
        if (
          menu.classList.contains('is-open') &&
          !toggle.contains(e.target) &&
          !menu.contains(e.target)
        ) {
          closeMenu();
        }
      });

      menu.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
          closeMenu();
        });
      });
    }

    /* ── Header scroll shadow ── */
    if (siteHeader) {
      var lastScrollY = window.scrollY;
      var onScroll = function () {
        siteHeader.classList.toggle('scrolled', window.scrollY > 12);

        if (!mobileQuery.matches) {
          siteHeader.classList.remove('is-hidden');
          lastScrollY = window.scrollY;
          return;
        }

        if (document.body.classList.contains('nav-open') || window.scrollY <= 12) {
          siteHeader.classList.remove('is-hidden');
          lastScrollY = window.scrollY;
          return;
        }

        if (window.scrollY > lastScrollY + 8) {
          siteHeader.classList.add('is-hidden');
        } else if (window.scrollY < lastScrollY - 8) {
          siteHeader.classList.remove('is-hidden');
        }

        lastScrollY = window.scrollY;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', function () {
        if (!mobileQuery.matches && menu && menu.classList.contains('is-open')) {
          closeMenu();
        }
        onScroll();
      });
      onScroll();
    }

    /* ── Active nav link (fallback — skip links that already have aria-current) ── */
    var links = document.querySelectorAll('.nav-link');
    var path  = window.location.pathname.replace(/\/+$/, '') || '/';

    links.forEach(function (link) {
      var href = (link.getAttribute('href') || '').replace(/\/+$/, '');
      if (href && href === path && !link.hasAttribute('aria-current')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });

  });
})();
