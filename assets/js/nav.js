/* ─── Navigation — ProAI Expert v2 ─── */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ── Mobile toggle ── */
    var toggle = document.querySelector('.nav-toggle');
    var menu   = document.querySelector('.nav-menu');

    function openMenu() {
      menu.classList.add('is-open');
      toggle.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-open');
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
    var siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
      var onScroll = function () {
        siteHeader.classList.toggle('scrolled', window.scrollY > 12);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* ── Active nav link (fallback — skip links that already have aria-current) ── */
    var links = document.querySelectorAll('.nav-link');
    var path  = window.location.pathname.replace(/\/+$/, '') || '/v2';

    links.forEach(function (link) {
      var href = (link.getAttribute('href') || '').replace(/\/+$/, '');
      if (href && href === path && !link.hasAttribute('aria-current')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });

  });
})();
