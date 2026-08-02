const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { execSync } = require('child_process');

const repoRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
const buildDateStr = '2026-08-01'; 

const routes = [
  {
    id: 'A1-RU',
    lang: 'ru',
    route: '/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/',
    h1: 'Сайт для русскоязычного бизнеса в США: только английский, отдельный русский раздел или две версии?',
    seoTitle: 'Сайт для русскоязычного бизнеса в США: какой вариант выбрать',
    metaDesc: 'Как выбрать между сайтом на английском, отдельной русской поддержкой и полноценной RU/EN-системой для бизнеса в США — без лишнего объёма.',
    ogImage: 'article-01-ru-language-coverage.png',
    pairRouteRoute: '/insights/does-your-service-business-need-a-multilingual-website/',
    enRoute: '/insights/does-your-service-business-need-a-multilingual-website/'
  },
  {
    id: 'A1-EN',
    lang: 'en',
    route: '/insights/does-your-service-business-need-a-multilingual-website/',
    h1: 'Does Your U.S. Service Business Need a Multilingual Website?',
    seoTitle: 'Does Your Service Business Need a Multilingual Website?',
    metaDesc: 'Choose between English-only, focused language support, and full multilingual coverage based on real demand, service capacity, and maintenance.',
    ogImage: 'article-01-en-language-coverage.png',
    pairRouteRoute: '/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/',
    enRoute: '/insights/does-your-service-business-need-a-multilingual-website/'
  },
  {
    id: 'A2-RU',
    lang: 'ru',
    route: '/ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/',
    h1: 'Как проверить подрядчика и предложение на сайт в США — и снизить риск переделки',
    seoTitle: 'Как проверить подрядчика и предложение на разработку сайта',
    metaDesc: 'Как сравнить предложения на сайт: объём работ, ответственность, доступы, лицензии, приёмка, запуск и поддержка — до подписания договора.',
    ogImage: 'article-02-ru-proposal-review.png',
    pairRouteRoute: '/insights/how-to-evaluate-a-website-proposal/',
    enRoute: '/insights/how-to-evaluate-a-website-proposal/'
  },
  {
    id: 'A2-EN',
    lang: 'en',
    route: '/insights/how-to-evaluate-a-website-proposal/',
    h1: 'How to Evaluate a Website Proposal Before You Sign',
    seoTitle: 'How to Evaluate a Website Proposal Before You Sign',
    metaDesc: 'Compare website proposals by scope, responsibilities, ownership, acceptance, and support—not page count or price alone.',
    ogImage: 'article-02-en-proposal-review.png',
    pairRouteRoute: '/ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/',
    enRoute: '/insights/how-to-evaluate-a-website-proposal/'
  }
];

const metadataManifest = [];

for (const r of routes) {
  const destPath = path.join(repoRoot, r.route.substring(1), 'index.html');
  const html = fs.readFileSync(destPath, 'utf8');
  const $ = cheerio.load(html, null, false);
  
  const htmlLangActual = $('html').attr('lang');
  const h1Actual = $('h1').text().trim();
  const h1Count = $('h1').length;
  const titleActual = $('title').text().trim();
  const metaDescriptionActual = $('meta[name="description"]').attr('content');
  const canonicalActual = $('link[rel="canonical"]').attr('href');
  const hreflangEnActual = $('link[rel="alternate"][hreflang="en"]').attr('href');
  const hreflangRuActual = $('link[rel="alternate"][hreflang="ru"]').attr('href');
  const xDefaultActual = $('link[rel="alternate"][hreflang="x-default"]').attr('href');
  const languageSwitchActual = $('.header-actions .lang-link').attr('href');
  
  let jsonLd = {};
  try {
    jsonLd = JSON.parse($('script[type="application/ld+json"]').html());
  } catch(e) {}

  metadataManifest.push({
    id: r.id, language: r.lang, route: r.route,
    htmlLangExpected: r.lang, htmlLangActual, htmlLangExactMatch: r.lang === htmlLangActual,
    h1Expected: r.h1, h1Actual, h1Count,
    titleExpected: r.seoTitle, titleActual, titleExactMatch: r.seoTitle === titleActual,
    metaDescriptionExpected: r.metaDesc, metaDescriptionActual, metaDescriptionExactMatch: r.metaDesc === metaDescriptionActual,
    canonicalExpected: `https://proai-expert.com${r.route}`, canonicalActual, canonicalExactMatch: `https://proai-expert.com${r.route}` === canonicalActual,
    hreflangEnExpected: `https://proai-expert.com${r.enRoute}`, hreflangEnActual, hreflangEnExactMatch: `https://proai-expert.com${r.enRoute}` === hreflangEnActual,
    hreflangRuExpected: `https://proai-expert.com${r.lang === 'ru' ? r.route : r.pairRouteRoute}`, hreflangRuActual, hreflangRuExactMatch: `https://proai-expert.com${r.lang === 'ru' ? r.route : r.pairRouteRoute}` === hreflangRuActual,
    xDefaultExpected: `https://proai-expert.com${r.enRoute}`, xDefaultActual, xDefaultExactMatch: `https://proai-expert.com${r.enRoute}` === xDefaultActual,
    languageSwitchExpected: r.pairRouteRoute, languageSwitchActual, languageSwitchExactMatch: r.pairRouteRoute === languageSwitchActual,
    ogTitle: $('meta[property="og:title"]').attr('content'),
    ogDescription: $('meta[property="og:description"]').attr('content'),
    ogImage: $('meta[property="og:image"]').attr('content'),
    ogImageAlt: $('meta[property="og:image:alt"]').attr('content'),
    twitterCard: $('meta[name="twitter:card"]').attr('content'),
    twitterTitle: $('meta[name="twitter:title"]').attr('content'),
    twitterDescription: $('meta[name="twitter:description"]').attr('content'),
    twitterImage: $('meta[name="twitter:image"]').attr('content'),
    twitterImageAlt: $('meta[name="twitter:image:alt"]').attr('content'),
    datePublishedExpected: buildDateStr, datePublishedActual: jsonLd.datePublished, datePublishedExactMatch: buildDateStr === jsonLd.datePublished,
    dateModifiedExpected: buildDateStr, dateModifiedActual: jsonLd.dateModified, dateModifiedExactMatch: buildDateStr === jsonLd.dateModified,
    status: (r.lang === htmlLangActual && r.h1 === h1Actual && h1Count === 1 && r.seoTitle === titleActual && r.metaDesc === metaDescriptionActual) ? 'PASS' : 'FAIL'
  });
}

fs.writeFileSync(path.join(repoRoot, 'docs/content-factory/article-pairs-v1/stage-3-build-v1/metadata-manifest.json'), JSON.stringify(metadataManifest, null, 2));
console.log('Metadata verification complete.');
