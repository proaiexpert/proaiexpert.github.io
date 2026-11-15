(function () {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('#site-navigation');
  if (!toggle || !nav) return;

  const mobile = window.matchMedia(
    '(max-width: 1200px), ((max-height: 540px) and (orientation: landscape))'
  );
  const focusable = () =>
    [...nav.querySelectorAll('a[href]')].filter(
      (item) => !item.hasAttribute('hidden')
    );

  const navParent = nav.parentNode;
  const navNextSibling = nav.nextSibling;
  let lockedScrollY = 0;
  let isLocked = false;

  function mountOverlay() {
    if (nav.parentNode !== document.body) {
      document.body.appendChild(nav);
    }
  }

  function restoreNav() {
    if (nav.parentNode === navParent) return;
    if (navNextSibling && navNextSibling.parentNode === navParent) {
      navParent.insertBefore(nav, navNextSibling);
    } else {
      navParent.appendChild(nav);
    }
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

  toggle.addEventListener(
    'click',
    (event) => {
      event.stopImmediatePropagation();
      setOpen(toggle.getAttribute('aria-expanded') !== 'true', false);
    },
    true
  );

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a[href]') && mobile.matches) {
      setOpen(false, false);
    }
  });

  document.addEventListener(
    'keydown',
    (event) => {
      if (
        !mobile.matches ||
        toggle.getAttribute('aria-expanded') !== 'true'
      ) {
        return;
      }

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
    },
    true
  );

  new MutationObserver(() => {
    const open =
      nav.classList.contains('is-open') ||
      nav.classList.contains('mobile-nav-open');

    if (!open && isLocked) {
      toggle.setAttribute('aria-expanded', 'false');
      unlockPage();
    }
  }).observe(nav, {
    attributes: true,
    attributeFilter: ['class'],
  });

  mobile.addEventListener('change', (event) => {
    if (!event.matches) setOpen(false, false);
  });

  window.addEventListener('pagehide', () => {
    unlockPage();
    restoreNav();
  });
})();

(function () {
  const englishRoute =
    /^\/insights\/how-to-evaluate-a-website-proposal\/(?:index\.html)?$/;
  const russianRoute =
    /^\/ru\/insights\/kak-proverit-predlozhenie-na-sayt-v-ssha\/(?:index\.html)?$/;

  const isEnglish = englishRoute.test(window.location.pathname);
  const isRussian = russianRoute.test(window.location.pathname);

  if (!isEnglish && !isRussian) return;

  const language = isRussian ? 'ru' : 'en';
  const dataUrl =
    language === 'ru'
      ? '/assets/data/proposal-tables-ru-v1.json'
      : '/assets/data/proposal-tables-en-v1.json';

  const captions = {
    ru: {
      default:
        'Иллюстративный пример для условного сайта сервисного бизнеса. Замените значения условиями из вашего proposal, SOW и договора.',
      comparison:
        'Иллюстративное сравнение трёх условных предложений. Это не рейтинг подрядчиков.',
    },
    en: {
      default:
        'Illustrative example for a hypothetical service-business website. Replace these values with the terms from your proposal, SOW, and agreement.',
      comparison:
        'Illustrative comparison of three hypothetical proposals. This is not a provider ranking.',
    },
  };

  const moduleOrder = [
    'proposal-risk-ledger',
    'scope-matrix',
    'responsibility-matrix',
    'business-control-map',
    'definition-of-done',
    'abc-comparison',
  ];

  function addStyles() {
    if (document.querySelector('#proposal-example-table-styles')) return;

    const style = document.createElement('style');
    style.id = 'proposal-example-table-styles';
    style.textContent = `
      .proposal-example-table-wrap {
        width: 100%;
        max-width: 100%;
      }

      .proposal-example-table {
        width: 100%;
        font-size: 14px;
        line-height: 1.5;
      }

      .proposal-example-table th,
      .proposal-example-table td {
        vertical-align: top;
        overflow-wrap: anywhere;
      }

      .proposal-example-caption {
        caption-side: top;
        padding: 0 0 14px;
        color: rgba(255, 255, 255, 0.68);
        font-size: 13px;
        line-height: 1.55;
        text-align: left;
      }

      @media (max-width: 820px),
             ((max-height: 540px) and (orientation: landscape)) {
        .page-article .proposal-example-table-wrap {
          width: 100%;
          max-width: 100%;
          margin: 32px 0;
          overflow: visible !important;
        }

        .page-article .proposal-example-table {
          display: block;
          width: 100%;
          min-width: 0 !important;
          max-width: 100%;
          margin: 0;
          border-collapse: separate;
        }

        .page-article .proposal-example-table caption {
          display: block;
          width: 100%;
        }

        .page-article .proposal-example-table thead {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0 0 0 0) !important;
          white-space: nowrap !important;
          border: 0 !important;
        }

        .page-article .proposal-example-table tbody,
        .page-article .proposal-example-table tr,
        .page-article .proposal-example-table td {
          display: block;
          width: 100%;
          min-width: 0;
          max-width: 100%;
        }

        .page-article .proposal-example-table tr {
          margin: 0 0 18px;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.025);
        }

        .page-article .proposal-example-table td {
          padding: 13px 0;
          border: 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          overflow-wrap: anywhere;
        }

        .page-article .proposal-example-table td:first-child {
          padding-top: 0;
          padding-bottom: 15px;
          border-top: 0;
          color: #fff;
          font-size: 1rem;
          font-weight: 800;
          line-height: 1.35;
        }

        .page-article .proposal-example-table td:not(:first-child)::before {
          content: attr(data-label);
          display: block;
          margin-bottom: 5px;
          color: var(--cyan, #5de2ff);
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.09em;
          line-height: 1.35;
          text-transform: uppercase;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function statusClass(value) {
    if (/^(ОПРЕДЕЛЕНО|DEFINED)/.test(value)) return 'risk-green';
    if (/^(НУЖНО УТОЧНИТЬ|NEEDS CLARIFICATION)/.test(value)) {
      return 'risk-yellow';
    }
    if (/^(СУЩЕСТВЕННЫЙ РИСК|MATERIAL RISK)/.test(value)) {
      return 'risk-red';
    }
    return '';
  }

  function fillTables(examples) {
    addStyles();

    let allComplete = true;

    moduleOrder.forEach((moduleName, moduleIndex) => {
      const table = document.querySelector(
        `[data-module~="${moduleName}"] table`
      );
      const rows = table ? [...table.tBodies[0].rows] : [];
      const values = examples[moduleName];
      const headers =
        table && table.tHead
          ? [...table.tHead.rows[0].cells].map((cell) =>
              cell.textContent.trim()
            )
          : [];

      if (!table || !values || rows.length !== values.length) {
        allComplete = false;
        console.warn(
          `[proposal tables] ${moduleName} structure mismatch.`
        );
        return;
      }

      table.classList.add('proposal-example-table');
      table
        .closest('.table-scroll')
        ?.classList.add('proposal-example-table-wrap');

      let caption = table.querySelector('caption');
      if (!caption) {
        caption = document.createElement('caption');
        table.prepend(caption);
      }

      caption.className = 'proposal-example-caption';
      caption.id = `proposal-example-caption-${moduleIndex + 1}`;
      caption.textContent =
        moduleName === 'abc-comparison'
          ? captions[language].comparison
          : captions[language].default;

      table.setAttribute('aria-describedby', caption.id);

      rows.forEach((row, rowIndex) => {
        const rowValues = values[rowIndex];

        if (row.cells.length - 1 !== rowValues.length) {
          allComplete = false;
          console.warn(
            `[proposal tables] ${moduleName} row ${rowIndex + 1} mismatch.`
          );
          return;
        }

        rowValues.forEach((value, valueIndex) => {
          const cell = row.cells[valueIndex + 1];

          cell.textContent = value;
          cell.dataset.label = headers[valueIndex + 1] || '';
          cell.classList.remove(
            'risk-green',
            'risk-yellow',
            'risk-red'
          );

          const className = statusClass(value);
          if (className) cell.classList.add(className);
        });
      });
    });

    if (allComplete) {
      document.documentElement.classList.add(
        'proposal-example-tables-ready'
      );
    }
  }

  fetch(dataUrl, {
    credentials: 'same-origin',
    cache: 'no-cache',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .then(fillTables)
    .catch((error) => {
      console.error(
        '[proposal tables] Failed to load exact examples.',
        error
      );
    });
})();
