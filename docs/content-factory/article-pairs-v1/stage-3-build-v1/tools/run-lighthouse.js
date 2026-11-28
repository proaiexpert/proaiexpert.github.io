const { launch } = require('chrome-launcher');
const { chromium } = require('playwright');
const { startServer, writeJson, gitSha } = require('./stage3-utils');
const { ROUTES } = require('./stage3-config');

(async () => {
  const lighthouse = (await import('lighthouse')).default;
  const version = require('lighthouse/package.json').version;
  const { server, baseUrl } = await startServer();
  const chrome = await launch({ chromePath: chromium.executablePath(), chromeFlags: [
    '--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage', '--disable-extensions'
  ] });
  const routes = [];
  try {
    for (const route of ROUTES) {
      const url = `${baseUrl}${route.route}`;
      await fetch(url);
      const result = await lighthouse(url, {
        port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        formFactor: 'mobile', screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 1, disabled: false },
        throttlingMethod: 'simulate', disableStorageReset: true
      });
      const lhr = result.lhr;
      const scores = Object.fromEntries(Object.entries(lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)]));
      const metrics = { lcpMs: Math.round(lhr.audits['largest-contentful-paint'].numericValue),
        cls: Number(lhr.audits['cumulative-layout-shift'].numericValue.toFixed(4)),
        tbtMs: Math.round(lhr.audits['total-blocking-time'].numericValue) };
      const failedAccessibilityAudits = Object.values(lhr.audits).filter((audit) =>
        audit.scoreDisplayMode !== 'notApplicable' && audit.score !== null && audit.score < 1 &&
        lhr.categories.accessibility.auditRefs.some((reference) => reference.id === audit.id)
      ).map((audit) => ({ id: audit.id, title: audit.title, score: audit.score,
        items: audit.details && Array.isArray(audit.details.items) ? audit.details.items.slice(0, 20) : [] }));
      const checks = { performance: scores.performance >= 95, accessibility: scores.accessibility === 100,
        bestPractices: scores['best-practices'] === 100, seo: scores.seo === 100,
        lcp: metrics.lcpMs <= 2500, cls: metrics.cls < 0.05, tbt: metrics.tbtMs < 150 };
      routes.push({ id: route.id, testedUrl: url, finalUrl: lhr.finalDisplayedUrl, scores, metrics, failedAccessibilityAudits,
        checks, status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL' });
      console.log(`${route.id}: P${scores.performance} A${scores.accessibility} BP${scores['best-practices']} SEO${scores.seo} LCP${metrics.lcpMs} CLS${metrics.cls} TBT${metrics.tbtMs}`);
    }
  } finally { await chrome.kill(); server.close(); }
  const report = { testedSha: gitSha(), testedAt: new Date().toISOString(), lighthouseVersion: version,
    environment: { platform: process.platform, node: process.version, chrome: chromium.executablePath(),
      note: 'Local static server; Lighthouse mobile simulated throttling after route warm-up.' }, routes,
    status: routes.every((route) => route.status === 'PASS') ? 'PASS' : 'FAIL' };
  writeJson('lighthouse-summary.json', report);
  if (report.status !== 'PASS') {
    for (const route of routes.filter((item) => item.status === 'FAIL')) console.error(route.id, Object.entries(route.checks).filter(([, value]) => !value).map(([key]) => key).join(', '));
    process.exit(1);
  }
  console.log('Lighthouse PASS: 4/4 routes');
})().catch((error) => { console.error(error); process.exit(1); });
