(function () {
  'use strict';

  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-home-tech-flagship-r1]'));
  if (!sections.length) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var fine = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)');
  var FAMILY_LABELS = {
    en: {
      models: 'MODELS / selected',
      automation: 'AUTOMATION / selected',
      communication: 'COMMUNICATION / selected',
      delivery: 'BUILD / DELIVERY / selected',
      rest: 'SYSTEM → ROLES → TOOLS'
    },
    ru: {
      models: 'МОДЕЛИ / выбрано',
      automation: 'АВТОМАТИЗАЦИЯ / выбрано',
      communication: 'КОММУНИКАЦИИ / выбрано',
      delivery: 'РАЗРАБОТКА / ДОСТАВКА / выбрано',
      rest: 'СИСТЕМА → РОЛИ → ИНСТРУМЕНТЫ'
    }
  };

  function languageOf(section) {
    var pageLang = (document.documentElement.lang || 'en').toLowerCase();
    var own = section.getAttribute('data-lang');
    return (own || pageLang).indexOf('ru') === 0 ? 'ru' : 'en';
  }

  function controlsOf(section) {
    return Array.prototype.slice.call(section.querySelectorAll('[data-tech-family]'));
  }

  function renderState(section, family, pressed) {
    var lang = languageOf(section);
    var labels = FAMILY_LABELS[lang];
    var valid = family && labels[family] ? family : 'rest';
    section.setAttribute('data-active', valid);
    controlsOf(section).forEach(function (control) {
      control.setAttribute('aria-pressed', String(!!pressed && control.getAttribute('data-tech-family') === valid));
    });
    var coreState = section.querySelector('[data-tech-core-state]');
    if (coreState) coreState.textContent = labels[valid] || labels.rest;
  }

  function rest(section) {
    section.__techF1Locked = null;
    renderState(section, 'rest', false);
  }

  function lock(section, family) {
    if (section.__techF1Locked === family) {
      rest(section);
      return;
    }
    section.__techF1Locked = family;
    renderState(section, family, true);
  }

  function installInteraction(section) {
    if (section.dataset.techF1Interaction === 'true') return;
    var controls = controlsOf(section);

    controls.forEach(function (control) {
      var family = control.getAttribute('data-tech-family');

      control.addEventListener('pointerenter', function () {
        if (!fine || !fine.matches || section.__techF1Locked) return;
        renderState(section, family, false);
      }, { passive: true });

      control.addEventListener('pointerleave', function () {
        if (!fine || !fine.matches || section.__techF1Locked) return;
        if (!control.matches(':focus-visible')) renderState(section, 'rest', false);
      }, { passive: true });

      control.addEventListener('focus', function () {
        if (section.__techF1Locked) return;
        renderState(section, family, false);
      });

      control.addEventListener('blur', function () {
        if (section.__techF1Locked) return;
        window.setTimeout(function () {
          if (!section.contains(document.activeElement)) renderState(section, 'rest', false);
        }, 0);
      });

      control.addEventListener('click', function () {
        lock(section, family);
      });
    });

    section.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        rest(section);
        var active = document.activeElement;
        if (active && active.blur) active.blur();
      }
    });

    section.addEventListener('pointerleave', function () {
      if (!fine || !fine.matches || section.__techF1Locked) return;
      if (!section.contains(document.activeElement)) renderState(section, 'rest', false);
    }, { passive: true });

    section.dataset.techF1Interaction = 'true';
  }

  function settle(section) {
    section.classList.remove('is-animated');
    section.classList.add('is-ready', 'is-settled');
    section.dataset.techF1Motion = 'settled';
  }

  function reveal(section) {
    if (section.dataset.techF1Motion) return;

    if (reduced && reduced.matches) {
      settle(section);
      return;
    }

    section.dataset.techF1Motion = 'running';
    section.classList.add('is-animated');
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        section.classList.add('is-ready');
      });
    });

    window.setTimeout(function () {
      section.classList.add('is-settled');
      section.dataset.techF1Motion = 'settled';
    }, 1780);
  }

  sections.forEach(function (section) {
    installInteraction(section);
    renderState(section, 'rest', false);
  });

  if (reduced && reduced.matches) {
    sections.forEach(settle);
  } else if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.22) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: [0.22] });

    sections.forEach(function (section) { observer.observe(section); });
  } else {
    sections.forEach(reveal);
  }

  window.addEventListener('pageshow', function () {
    sections.forEach(function (section) {
      if (!section.dataset.techF1Motion) reveal(section);
    });
  }, { passive: true });

  window.__PROAI_TECH_FLAGSHIP_R1__ = {
    version: 'R1-resolved-system-field',
    rest: function (section) { rest(section || sections[0]); },
    select: function (family, section) { lock(section || sections[0], family); },
    settle: function (section) { settle(section || sections[0]); },
    sections: sections
  };
}());
