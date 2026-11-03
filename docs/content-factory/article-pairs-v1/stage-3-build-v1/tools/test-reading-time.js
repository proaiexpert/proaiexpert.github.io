const { normalizeText, publicRenderedDom, writeJson, gitSha } = require('./stage3-utils');
const { ROUTES } = require('./stage3-config');

function articleText($) {
  const content = $('.premium-content').clone();
  content.find('.premium-toc-mobile,.premium-cta').remove();
  return normalizeText([
    $('.premium-article-h1').text(),
    $('.premium-exec-summary').text(),
    content.text(),
    $('.premium-cta a').first().text()
  ].join(' '));
}

const routes = ROUTES.map((route) => {
  const $ = publicRenderedDom(route);
  const includedText = articleText($);
  const wordCount = includedText.split(/\s+/).filter(Boolean).length;
  const calculatedMinutes = Math.ceil(wordCount / route.wpm);
  const visibleText = normalizeText($('.premium-meta span').first().text());
  const visibleMatch = visibleText.match(/^(\d+)\s+(?:min read|мин чтения)$/);
  const visibleMinutes = visibleMatch ? Number(visibleMatch[1]) : null;
  const checks = { visibleFormat: Boolean(visibleMatch), minutesMatch: visibleMinutes === calculatedMinutes };
  return { id: route.id, language: route.lang, wpm: route.wpm, wordCount, calculatedMinutes,
    visibleText, visibleMinutes, included: ['visible H1', 'executive summary', 'article headings', 'paragraphs', 'lists', 'table text', 'approved CTA copy once'],
    excluded: ['header/navigation', 'breadcrumbs', 'desktop/mobile TOC', 'metadata/schema', 'global footer', 'duplicate CTA button label'],
    checks, status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL' };
});

const report = { testedSha: gitSha(), testedAt: new Date().toISOString(), routes,
  status: routes.every((route) => route.status === 'PASS') ? 'PASS' : 'FAIL' };
writeJson('reading-time-report.json', report);
if (report.status !== 'PASS') {
  for (const route of routes.filter((item) => item.status === 'FAIL')) console.error(`${route.id}: ${route.wordCount} words => ${route.calculatedMinutes}, visible ${route.visibleMinutes}`);
  process.exit(1);
}
console.log(routes.map((route) => `${route.id}: ${route.wordCount}/${route.calculatedMinutes}`).join(' | '));
