const { chromium } = require('playwright');
const { startServer, writeJson, gitSha } = require('./stage3-utils');
const { ROUTES } = require('./stage3-config');

async function measure(page, selector) {
  return page.locator(selector).first().evaluate((node, selectorValue) => {
    const style = getComputedStyle(node); const box = node.getBoundingClientRect();
    return { selector: selectorValue, animationName: style.animationName, animationDuration: style.animationDuration,
      transitionDuration: style.transitionDuration, transform: style.transform,
      visible: style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0 };
  }, selector);
}

(async () => {
  const { server, baseUrl } = await startServer();
  const browser = await chromium.launch({ headless: true });
  const routes = [];
  try {
    for (const route of ROUTES) {
      const normal = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' });
      await normal.goto(`${baseUrl}${route.route}`, { waitUntil: 'domcontentloaded' });
      const selector = '.premium-module';
      const defaultStyle = await measure(normal, selector);
      const defaultCounts = await normal.evaluate(() => ({ visible: [...document.querySelectorAll('[data-module]')].filter((node) => { const s=getComputedStyle(node),b=node.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&b.width>0&&b.height>0; }).length, total: document.querySelectorAll('[data-module]').length }));
      await normal.close();
      const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
      await reduced.goto(`${baseUrl}${route.route}`, { waitUntil: 'domcontentloaded' });
      const reducedStyle = await measure(reduced, selector);
      const reducedCounts = await reduced.evaluate(() => ({ visible: [...document.querySelectorAll('[data-module]')].filter((node) => { const s=getComputedStyle(node),b=node.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&b.width>0&&b.height>0; }).length, total: document.querySelectorAll('[data-module]').length }));
      await reduced.close();
      const checks = { reducedAnimationDisabled: reducedStyle.animationName === 'none' || /^0(?:s|ms)/.test(reducedStyle.animationDuration),
        reducedTransitionDisabled: reducedStyle.transitionDuration.split(',').every((value) => parseFloat(value) <= 0.01),
        reducedTransformDisabled: reducedStyle.transform === 'none', contentPreserved: reducedCounts.visible === reducedCounts.total && reducedCounts.total === defaultCounts.total };
      routes.push({ id: route.id, selector, defaultStyle, reducedStyle,
        visibleElementCount: reducedCounts.visible, hiddenElementCount: reducedCounts.total - reducedCounts.visible,
        contentPreservationResult: checks.contentPreserved ? 'PASS' : 'FAIL', checks,
        status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL' });
    }
  } finally { await browser.close(); server.close(); }
  const report = { testedSha: gitSha(), testedAt: new Date().toISOString(), routes,
    status: routes.every((route) => route.status === 'PASS') ? 'PASS' : 'FAIL' };
  writeJson('reduced-motion-report.json', report);
  if (report.status !== 'PASS') {
    for (const route of routes.filter((item) => item.status === 'FAIL')) console.error(route.id, Object.entries(route.checks).filter(([, value]) => !value).map(([key]) => key).join(', '));
    process.exit(1);
  }
  console.log('Reduced motion PASS: transforms/transitions disabled and content preserved on 4/4 routes');
})().catch((error) => { console.error(error); process.exit(1); });
