const { fs, path, repoRoot, normalizeText, publicSourceDom, publicRenderedDom, writeJson, gitSha } = require('./stage3-utils');
const { ROUTES } = require('./stage3-config');

function recordsFrom($, rootSelector, indexName) {
  const selector = 'h1,h2,h3,h4,h5,h6,p,li,th,td';
  const elements = rootSelector ? $(rootSelector).find(selector).add($(rootSelector).filter(selector)) : $(selector);
  return elements.filter((_, element) => {
    const node = $(element);
    if (node.is('p') && node.parents('li').length) return false;
    if (node.is('li') && node.children('ul,ol').length) return false;
    return !node.parents('.premium-toc,.premium-toc-mobile,.premium-cta').length;
  }).map((index, element) => {
    const node = $(element);
    const type = element.tagName.toLowerCase();
    const cell = node.is('th,td');
    const row = cell ? node.closest('tr').index() : null;
    const column = cell ? node.index() : null;
    return {
      type,
      headingLevel: /^h[1-6]$/.test(type) ? Number(type.slice(1)) : null,
      text: normalizeText(node.clone().find('ul,ol').remove().end().text()),
      links: node.find('a').add(node.filter('a')).map((_, link) => ({
        text: normalizeText($(link).text()), href: $(link).attr('href') || ''
      })).get(),
      tableContext: cell ? { row, column } : null,
      [indexName]: index
    };
  }).get();
}

function comparable(record) {
  return JSON.stringify({ type: record.type, headingLevel: record.headingLevel, text: record.text,
    links: record.links, tableContext: record.tableContext });
}

const reports = ROUTES.map((route) => {
  const source$ = publicSourceDom(route);
  const rendered$ = publicRenderedDom(route);
  const source = recordsFrom(source$, null, 'sourceIndex');
  const rendered = [
    ...recordsFrom(rendered$, '.premium-article-header', 'renderedIndex'),
    ...recordsFrom(rendered$, '.premium-content', 'renderedIndex')
  ].map((record, index) => ({ ...record, renderedIndex: index }));
  const changed = [], missing = [], added = [], moved = [], typeChanged = [], linkChanged = [];
  const max = Math.max(source.length, rendered.length);
  for (let index = 0; index < max; index += 1) {
    const s = source[index], d = rendered[index];
    if (!s) { added.push(d); continue; }
    if (!d) { missing.push(s); continue; }
    if (comparable(s) === comparable(d)) continue;
    const sourceExactElsewhere = rendered.findIndex((record) => comparable(record) === comparable(s));
    if (sourceExactElsewhere >= 0) moved.push({ sourceIndex: index, renderedIndex: sourceExactElsewhere, text: s.text });
    else if (s.text === d.text && s.type !== d.type) typeChanged.push({ source: s, rendered: d });
    else if (s.text === d.text && JSON.stringify(s.links) !== JSON.stringify(d.links)) linkChanged.push({ source: s, rendered: d });
    else changed.push({ source: s, rendered: d });
  }
  const status = [changed, missing, added, moved, typeChanged, linkChanged].every((items) => items.length === 0) ? 'PASS' : 'FAIL';
  return { id: route.id, sourceFile: route.sourceFile, renderedFile: route.file,
    sourceRecordCount: source.length, renderedRecordCount: rendered.length,
    changed, missing, added, moved, typeChanged, linkChanged, status };
});

const report = { testedSha: gitSha(), testedAt: new Date().toISOString(), routes: reports,
  status: reports.every((item) => item.status === 'PASS') ? 'PASS' : 'FAIL' };
writeJson('content-integrity-report.json', report);
if (report.status !== 'PASS') {
  for (const item of reports.filter((route) => route.status === 'FAIL')) {
    console.error(`${item.id}: changed=${item.changed.length} missing=${item.missing.length} added=${item.added.length} moved=${item.moved.length} typeChanged=${item.typeChanged.length} linkChanged=${item.linkChanged.length}`);
  }
  process.exit(1);
}
console.log('Content integrity PASS: type, text, links, tables, and order match 4/4 frozen sources');
