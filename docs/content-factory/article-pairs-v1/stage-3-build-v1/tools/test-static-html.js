const { fs, path, repoRoot, loadDocument, normalizeText, writeJson } = require('./stage3-utils');
const { ROUTES } = require('./stage3-config');

const forbidden = [/\$\{/g, /\{\{/g, /\bPENDING\b/g, /\bTODO\b/g, /(?:Ã.|Ð.|Ñ.){2,}/g];
const records = ROUTES.map((route) => {
  const html = fs.readFileSync(path.join(repoRoot, route.file), 'utf8');
  const $ = loadDocument(html);
  const unresolvedTokens = forbidden.flatMap((pattern) => html.match(pattern) || []);
  const ids = $('[id]').map((_, element) => $(element).attr('id')).get();
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  const approvedRiskLabels = new Set(['High risk', 'Medium risk', 'Low risk', 'Высокий риск', 'Средний риск', 'Низкий риск']);
  const riskClassTexts = $('.risk-red,.risk-yellow,.risk-green').map((_, element) => normalizeText($(element).text())).get();
  const checks = {
    doctype: /^<!doctype html>/i.test(html.trimStart()),
    htmlLang: $('html').attr('lang') === route.lang,
    oneH1: $('h1').length === 1,
    exactH1: normalizeText($('h1').text()) === route.h1,
    mainExists: $('main#main-content').length === 1,
    articleExists: $('article').length === 1,
    noDuplicateIds: duplicateIds.length === 0,
    noUnresolvedTokens: unresolvedTokens.length === 0,
    premiumCss: $('link[href="/assets/css/premium-insights-v1.css"]').length === 1,
    oneArticleCta: $('.premium-cta a').length === 1,
    exactRiskLabelsOnly: riskClassTexts.every((text) => approvedRiskLabels.has(text))
  };
  return { id: route.id, file: route.file, checks, duplicateIds, unresolvedTokens,
    riskClassTexts, falseRiskRegression: checks.exactRiskLabelsOnly ? 'PASS' : 'FAIL',
    status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL' };
});

const report = { testedAt: new Date().toISOString(), records,
  status: records.every((record) => record.status === 'PASS') ? 'PASS' : 'FAIL' };
writeJson('static-html-report.json', report);
if (report.status !== 'PASS') {
  console.error('Static HTML FAIL:', records.filter((record) => record.status === 'FAIL').map((record) => record.id).join(', '));
  process.exit(1);
}
console.log('Static HTML PASS: 4/4 routes');
