const { fs, path, repoRoot, loadDocument, normalizeText, writeJson, gitSha } = require('./stage3-utils');
const { ROUTES, BUILD_DATE, routeById } = require('./stage3-config');

function attr($, selector, name = 'content') { return $(selector).first().attr(name) || ''; }
function expectedReadTime($, lang) {
  const text = normalizeText($('.premium-meta span').first().text());
  return lang === 'ru' ? /^\d+ мин чтения$/.test(text) : /^\d+ min read$/.test(text);
}

const records = ROUTES.map((route) => {
  const html = fs.readFileSync(path.join(repoRoot, route.file), 'utf8');
  const $ = loadDocument(html);
  const pair = routeById(route.pairId);
  let jsonLd;
  try { jsonLd = JSON.parse($('script[type="application/ld+json"]').first().html()); } catch (error) { jsonLd = { parseError: error.message }; }
  const canonical = `https://proai-expert.com${route.route}`;
  const pairCanonical = `https://proai-expert.com${pair.route}`;
  const english = route.lang === 'en' ? route : pair;
  const active = $(`#site-navigation a[href="${route.activeNavHref}"]`).filter('[aria-current="page"]');
  const checks = {
    htmlLangExactMatch: $('html').attr('lang') === route.lang,
    oneH1: $('h1').length === 1,
    h1ExactMatch: normalizeText($('h1').text()) === route.h1,
    titleExactMatch: normalizeText($('title').text()) === route.title,
    descriptionExactMatch: attr($, 'meta[name="description"]') === route.description,
    canonicalExactMatch: attr($, 'link[rel="canonical"]', 'href') === canonical,
    hreflangEn: attr($, 'link[rel="alternate"][hreflang="en"]', 'href') === `https://proai-expert.com${english.route}`,
    hreflangRu: attr($, 'link[rel="alternate"][hreflang="ru"]', 'href') === `https://proai-expert.com${route.lang === 'ru' ? route.route : pair.route}`,
    xDefault: attr($, 'link[rel="alternate"][hreflang="x-default"]', 'href') === `https://proai-expert.com${english.route}`,
    languageSwitch: $('.lang-link').attr('href') === pair.route,
    ogTitle: attr($, 'meta[property="og:title"]') === route.h1,
    ogDescription: attr($, 'meta[property="og:description"]') === route.description,
    ogUrl: attr($, 'meta[property="og:url"]') === canonical,
    ogImage: attr($, 'meta[property="og:image"]') === `https://proai-expert.com/assets/insights/og/${route.ogImage}`,
    twitterTitle: attr($, 'meta[name="twitter:title"]') === route.h1,
    twitterDescription: attr($, 'meta[name="twitter:description"]') === route.description,
    twitterImage: attr($, 'meta[name="twitter:image"]') === `https://proai-expert.com/assets/insights/og/${route.ogImage}`,
    jsonLdParsed: !jsonLd.parseError,
    jsonLdDates: jsonLd.datePublished === BUILD_DATE && jsonLd.dateModified === BUILD_DATE,
    jsonLdImage: jsonLd.image === `https://proai-expert.com/assets/insights/og/${route.ogImage}`,
    visibleDate: $('.premium-meta').text().includes(route.visibleDate),
    visibleReadTime: expectedReadTime($, route.lang),
    activeNavigation: active.length === 1 && normalizeText(active.text()) === route.activeNavLabel,
    headerCta: $('.header-actions .start-btn').attr('href') === route.contactHref && normalizeText($('.header-actions .start-btn').text()) === route.headerCta,
    articleCta: $('.premium-cta a').attr('href') === route.contactHref && normalizeText($('.premium-cta a').text()) === route.ctaLabel,
    footerCta: $('footer#contact .f-cta-btn').attr('href') === route.contactHref
  };
  return { id: route.id, file: route.file, values: { lang: $('html').attr('lang'), title: normalizeText($('title').text()),
    description: attr($, 'meta[name="description"]'), canonical, languageSwitch: $('.lang-link').attr('href'),
    visibleReadTime: normalizeText($('.premium-meta span').first().text()) }, checks,
    status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL' };
});

const report = { testedSha: gitSha(), testedAt: new Date().toISOString(), records,
  status: records.every((record) => record.status === 'PASS') ? 'PASS' : 'FAIL' };
writeJson('metadata-manifest.json', report);
if (report.status !== 'PASS') {
  for (const record of records.filter((item) => item.status === 'FAIL')) {
    console.error(record.id, Object.entries(record.checks).filter(([, value]) => !value).map(([key]) => key).join(', '));
  }
  process.exit(1);
}
console.log('Metadata PASS: 4/4 routes');
