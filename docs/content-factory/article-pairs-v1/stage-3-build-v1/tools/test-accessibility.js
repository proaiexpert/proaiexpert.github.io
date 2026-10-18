const { chromium } = require('playwright');
const { startServer, writeJson, gitSha } = require('./stage3-utils');
const { ROUTES } = require('./stage3-config');

(async () => {
  const { server, baseUrl } = await startServer();
  const browser = await chromium.launch({ headless: true });
  const routes = [];
  try {
    for (const route of ROUTES) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
      await page.goto(`${baseUrl}${route.route}`, { waitUntil: 'domcontentloaded' });
      const toggle = page.locator('.mobile-menu-toggle');
      await toggle.click();
      const expandedAfterOpen = await toggle.getAttribute('aria-expanded');
      const menuOpen = await page.locator('#site-navigation').evaluate((node) => node.classList.contains('is-open'));
      await page.keyboard.press('Escape');
      const expandedAfterEscape = await toggle.getAttribute('aria-expanded');
      const focusReturned = await toggle.evaluate((node) => document.activeElement === node);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.keyboard.press('Tab');
      const skipFocused = await page.locator('.skip-link').evaluate((node) => document.activeElement === node);
      const staticValues = await page.evaluate(() => ({
        h1Count: document.querySelectorAll('h1').length,
        mainCount: document.querySelectorAll('main').length,
        navLabelsComplete: [...document.querySelectorAll('nav')].every((node) => node.getAttribute('aria-label')),
        tables: document.querySelectorAll('.premium-content table').length,
        focusableTableWrappers: document.querySelectorAll('.table-scroll[tabindex="0"]').length,
        activeNavCount: document.querySelectorAll('#site-navigation a[aria-current="page"]').length,
        languageHref: document.querySelector('.lang-link')?.getAttribute('href'),
        touchTarget: (() => { const box = document.querySelector('.mobile-menu-toggle').getBoundingClientRect(); return { width: box.width, height: box.height }; })()
      }));
      await page.close();

      const noJs = await browser.newPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
      await noJs.goto(`${baseUrl}${route.route}`, { waitUntil: 'domcontentloaded' });
      const noJsValues = await noJs.evaluate(() => {
        const visible = (selector) => { const node = document.querySelector(selector); if (!node) return false; const box = node.getBoundingClientRect(); const style = getComputedStyle(node); return box.width > 0 && box.height > 0 && style.display !== 'none' && style.visibility !== 'hidden'; };
        return { articleVisible: visible('.premium-content'), mobileTocVisible: visible('.premium-toc-mobile'), moduleCount: document.querySelectorAll('[data-module]').length };
      });
      await noJs.close();
      const checks = {
        menuOpens: expandedAfterOpen === 'true' && menuOpen,
        escapeCloses: expandedAfterEscape === 'false', focusReturn: focusReturned,
        skipLinkFocus: skipFocused, oneH1: staticValues.h1Count === 1, oneMain: staticValues.mainCount === 1,
        navLabels: staticValues.navLabelsComplete, activeNav: staticValues.activeNavCount === 1,
        tableWrappersFocusable: staticValues.tables === staticValues.focusableTableWrappers,
        practicalTouchTarget: staticValues.touchTarget.width >= 42 && staticValues.touchTarget.height >= 42,
        noJsArticle: noJsValues.articleVisible, noJsMobileToc: noJsValues.mobileTocVisible, noJsModules: noJsValues.moduleCount > 0
      };
      routes.push({ id: route.id, expandedAfterOpen, expandedAfterEscape, focusReturned, skipFocused,
        staticValues, noJsValues, checks, status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL' });
    }
  } finally { await browser.close(); server.close(); }
  const report = { testedSha: gitSha(), testedAt: new Date().toISOString(), routes,
    status: routes.every((route) => route.status === 'PASS') ? 'PASS' : 'FAIL' };
  writeJson('accessibility-report.json', report);
  if (report.status !== 'PASS') {
    for (const route of routes.filter((item) => item.status === 'FAIL')) console.error(route.id, Object.entries(route.checks).filter(([, value]) => !value).map(([key]) => key).join(', '));
    process.exit(1);
  }
  console.log('Accessibility/keyboard/no-JS PASS: 4/4 routes');
})().catch((error) => { console.error(error); process.exit(1); });
