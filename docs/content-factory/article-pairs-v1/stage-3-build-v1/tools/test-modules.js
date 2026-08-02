const { normalizeText, publicRenderedDom, writeJson, gitSha } = require('./stage3-utils');
const { ROUTES, MODULES } = require('./stage3-config');

function level(element) { return /^h([1-6])$/i.test(element.tagName) ? Number(element.tagName.slice(1)) : null; }

const routes = ROUTES.map((route) => {
  const $ = publicRenderedDom(route);
  const expected = ['executive-summary', ...MODULES[route.id].flatMap(([tokens]) => tokens)];
  const modules = expected.map((token) => {
    const selector = `[data-module~="${token}"]`;
    const nodes = $(selector);
    const node = nodes.first();
    const heading = node.find('h2,h3,h4,h5,h6').first();
    const config = (MODULES[route.id] || []).find(([tokens]) => tokens.includes(token));
    const expectedHeading = token === 'executive-summary' ? null : config[1];
    const parentModules = node.parents('[data-module]').map((_, parent) => $(parent).attr('data-module')).get();
    const checks = {
      exists: nodes.length > 0,
      unique: nodes.length === 1,
      intendedHeading: token === 'executive-summary' ? node.hasClass('premium-exec-summary') : normalizeText(heading.text()) === expectedHeading,
      startsAtHeading: token === 'executive-summary' || node.children().first().is('h2,h3,h4,h5,h6'),
      noNestedCorruption: !parentModules.some((tokens) => tokens.split(/\s+/).includes(token)),
      containsContent: normalizeText(node.text()).length > 20
    };
    return { token, selector, expectedHeading, actualHeading: normalizeText(heading.text()),
      headingLevel: heading.length ? level(heading[0]) : null, parentModules, checks,
      status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL' };
  });
  const wrappers = $('.premium-module').toArray();
  const boundaryChecks = wrappers.map((wrapper) => {
    const node = $(wrapper); const firstHeading = node.children('h2,h3,h4,h5,h6').first();
    const startLevel = firstHeading.length ? level(firstHeading[0]) : null;
    const swallowed = startLevel ? node.children('h1,h2,h3,h4,h5,h6').filter((_, headingNode) => level(headingNode) <= startLevel && headingNode !== firstHeading[0]).length : 0;
    return { modules: node.attr('data-module'), startHeading: normalizeText(firstHeading.text()), startLevel,
      swallowedSameOrHigherHeadings: swallowed, status: startLevel && swallowed === 0 ? 'PASS' : 'FAIL' };
  });
  return { id: route.id, expectedCount: expected.length, modules, boundaryChecks,
    status: modules.every((item) => item.status === 'PASS') && boundaryChecks.every((item) => item.status === 'PASS') ? 'PASS' : 'FAIL' };
});

const report = { testedSha: gitSha(), testedAt: new Date().toISOString(), routes,
  status: routes.every((route) => route.status === 'PASS') ? 'PASS' : 'FAIL' };
writeJson('module-map-report.json', report);
if (report.status !== 'PASS') {
  for (const route of routes.filter((item) => item.status === 'FAIL')) {
    console.error(route.id, route.modules.filter((item) => item.status === 'FAIL').map((item) => item.token).join(', '),
      route.boundaryChecks.filter((item) => item.status === 'FAIL').map((item) => item.modules).join(', '));
  }
  process.exit(1);
}
console.log('Module mapping PASS: required selectors, headings, boundaries, and uniqueness verified');
