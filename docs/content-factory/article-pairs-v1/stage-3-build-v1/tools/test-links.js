const { normalizeText, publicRenderedDom, sourceOrganization, writeJson, gitSha } = require('./stage3-utils');
const { ROUTES } = require('./stage3-config');

const timeoutMs = 15000;
async function check(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const timestamp = new Date().toISOString();
  try {
    const response = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal,
      headers: { 'user-agent': 'Mozilla/5.0 Stage3Evidence/1.0' } });
    const automationBlocked = response.status === 401 || response.status === 403;
    return { httpStatus: response.status, redirectDestination: response.url, error: null, timeout: false,
      timestamp, status: response.ok ? 'PASS' : automationBlocked ? 'AUTOMATION_BLOCKED' : 'FAIL' };
  } catch (error) {
    const timeout = error.name === 'AbortError';
    return { httpStatus: null, redirectDestination: null, error: error.message, timeout, timestamp, status: 'FAIL' };
  } finally { clearTimeout(timer); }
}

(async () => {
  const links = [];
  for (const route of ROUTES) {
    const $ = publicRenderedDom(route);
    $('.premium-source-block a[href^="http"]').each((index, anchor) => {
      const node = $(anchor); const url = node.attr('href');
      const heading = node.closest('.premium-module').find('h2,h3').first().text() || node.prevAll('h2,h3').first().text();
      links.push({ routeId: route.id, route: route.route, sourceIndex: index,
        organization: sourceOrganization(url), anchorText: normalizeText(node.text()), url,
        section: normalizeText(heading), claimSummary: normalizeText(node.closest('p,li').text()) });
    });
  }
  const checked = [];
  for (const link of links) checked.push({ ...link, ...(await check(link.url)) });
  const countsByRoute = Object.fromEntries(ROUTES.map((route) => [route.id, checked.filter((link) => link.routeId === route.id).length]));
  const countsByStatus = checked.reduce((acc, link) => { acc[link.status] = (acc[link.status] || 0) + 1; return acc; }, {});
  const unresolved = checked.filter((link) => !['PASS', 'AUTOMATION_BLOCKED'].includes(link.status));
  const report = { testedSha: gitSha(), testedAt: new Date().toISOString(), timeoutMs,
    total: checked.length, countsByRoute, countsByStatus, links: checked,
    status: checked.length === 19 && unresolved.length === 0 ? 'PASS' : 'FAIL' };
  writeJson('source-link-manifest.json', report);
  if (report.status !== 'PASS') {
    console.error(`Source links FAIL: total=${checked.length}, unresolved=${unresolved.length}`);
    process.exit(1);
  }
  console.log(`Source links PASS: ${checked.length} total; ${JSON.stringify(countsByStatus)}`);
})().catch((error) => { console.error(error); process.exit(1); });
