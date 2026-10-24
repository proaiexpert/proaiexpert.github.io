const { chromium } = require('playwright');
const { startServer, writeJson, gitSha } = require('./stage3-utils');
const { ROUTES, VIEWPORTS } = require('./stage3-config');

(async () => {
  const { server, baseUrl } = await startServer();
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    const page = await browser.newPage();
    await page.route('https://fonts.googleapis.com/**', (request) => request.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    for (const route of ROUTES) {
      for (const [width, height] of VIEWPORTS) {
        await page.setViewportSize({ width, height });
        const consoleErrors = []; const internalFailures = [];
        const onConsole = (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); };
        const onResponse = (response) => { if (response.url().startsWith(baseUrl) && response.status() >= 400) internalFailures.push(`${response.status()} ${response.url()}`); };
        page.on('console', onConsole); page.on('response', onResponse);
        const response = await page.goto(`${baseUrl}${route.route}`, { waitUntil: 'domcontentloaded' });
        await page.evaluate(() => document.fonts && document.fonts.ready);
        const values = await page.evaluate(() => {
          const rect = (selector) => { const node = document.querySelector(selector); if (!node) return null; const box = node.getBoundingClientRect(); return { left: box.left, right: box.right, width: box.width, height: box.height }; };
          const visible = (selector) => { const node = document.querySelector(selector); if (!node) return false; const style = getComputedStyle(node); const box = node.getBoundingClientRect(); return style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0; };
          return {
            clientWidth: document.documentElement.clientWidth,
            scrollWidth: document.documentElement.scrollWidth,
            overflowDelta: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            mainVisible: visible('#main-content'), articleVisible: visible('.premium-content'),
            mobileTocVisible: visible('.premium-toc-mobile'), desktopTocVisible: visible('.premium-toc'),
            h1Box: rect('h1'), moduleCount: document.querySelectorAll('[data-module]').length,
            tableCount: document.querySelectorAll('.table-scroll[tabindex="0"] table').length,
            rawTableCount: document.querySelectorAll('.premium-content table').length
          };
        });
        page.off('console', onConsole); page.off('response', onResponse);
        const checks = {
          http200: response && response.status() === 200,
          noHorizontalOverflow: values.overflowDelta <= 1,
          mainVisible: values.mainVisible,
          articleVisible: values.articleVisible,
          tocMode: width <= 1024 ? values.mobileTocVisible && !values.desktopTocVisible : !values.mobileTocVisible && values.desktopTocVisible,
          h1WithinViewport: values.h1Box && values.h1Box.left >= -1 && values.h1Box.right <= values.clientWidth + 1,
          modulesPresent: values.moduleCount > 0,
          tablesWrapped: values.tableCount === values.rawTableCount,
          noConsoleErrors: consoleErrors.length === 0,
          noInternalFailures: internalFailures.length === 0
        };
        results.push({ routeId: route.id, viewport: `${width}x${height}`, values, consoleErrors, internalFailures, checks,
          status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL' });
      }
    }
  } finally { await browser.close(); server.close(); }
  const report = { testedSha: gitSha(), testedAt: new Date().toISOString(), matrixCount: results.length, results,
    status: results.every((result) => result.status === 'PASS') ? 'PASS' : 'FAIL' };
  writeJson('responsive-report.json', report);
  if (report.status !== 'PASS') {
    for (const result of results.filter((item) => item.status === 'FAIL')) console.error(result.routeId, result.viewport, Object.entries(result.checks).filter(([, value]) => !value).map(([key]) => key).join(', '));
    process.exit(1);
  }
  console.log(`Responsive PASS: ${results.length}/${results.length} route/viewport checks`);
})().catch((error) => { console.error(error); process.exit(1); });
