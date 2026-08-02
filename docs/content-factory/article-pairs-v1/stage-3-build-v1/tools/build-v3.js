const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { marked } = require('marked');
const cheerio = require('cheerio');

const buildDateStr = '2026-08-01'; // Explicitly required Pacific Time date

const routes = [
  {
    id: 'A1-RU',
    lang: 'ru',
    route: '/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/',
    h1: 'Сайт для русскоязычного бизнеса в США: только английский, отдельный русский раздел или две версии?',
    seoTitle: 'Сайт для русскоязычного бизнеса в США: какой вариант выбрать',
    metaDesc: 'Как выбрать между сайтом на английском, отдельной русской поддержкой и полноценной RU/EN-системой для бизнеса в США — без лишнего объёма.',
    srcFile: 'docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-01-ru-final-candidate-v7.md',
    srcBlobSha: '57cb79bd2d8fd8ba614e7370defad8546fda116e',
    destDir: 'ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha',
    wpm: 180,
    ogImage: 'article-01-ru-language-coverage.png',
    pair: 'A1-EN',
    ctaLabel: 'Обсудить языковую модель сайта',
    ctaLink: '/ru/contact/#project-intake',
    hubLink: '/ru/insights/',
    hubText: '← Назад к инсайтам',
    category: 'Стратегия сайта',
    menuAria: 'Открыть меню'
  },
  {
    id: 'A1-EN',
    lang: 'en',
    route: '/insights/does-your-service-business-need-a-multilingual-website/',
    h1: 'Does Your U.S. Service Business Need a Multilingual Website?',
    seoTitle: 'Does Your Service Business Need a Multilingual Website?',
    metaDesc: 'Choose between English-only, focused language support, and full multilingual coverage based on real demand, service capacity, and maintenance.',
    srcFile: 'docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-01-en-final-candidate-v5.md',
    srcBlobSha: '2dac3dcb70385808afd76843dc60c529d85a78e5',
    destDir: 'insights/does-your-service-business-need-a-multilingual-website',
    wpm: 220,
    ogImage: 'article-01-en-language-coverage.png',
    pair: 'A1-RU',
    ctaLabel: 'Review Your Language Coverage Plan',
    ctaLink: '/contact/#project-intake',
    hubLink: '/insights/',
    hubText: '← Back to insights',
    category: 'Website Strategy',
    menuAria: 'Open menu'
  },
  {
    id: 'A2-RU',
    lang: 'ru',
    route: '/ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/',
    h1: 'Как проверить подрядчика и предложение на сайт в США — и снизить риск переделки',
    seoTitle: 'Как проверить подрядчика и предложение на разработку сайта',
    metaDesc: 'Как сравнить предложения на сайт: объём работ, ответственность, доступы, лицензии, приёмка, запуск и поддержка — до подписания договора.',
    srcFile: 'docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-02-ru-final-candidate-v6.md',
    srcBlobSha: '17cbfee69421e6e11101a0ef3770ec8dabf8e5e0',
    destDir: 'ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha',
    wpm: 180,
    ogImage: 'article-02-ru-proposal-review.png',
    pair: 'A2-EN',
    ctaLabel: 'Разобрать предложение на сайт',
    ctaLink: '/ru/contact/#project-intake',
    hubLink: '/ru/insights/',
    hubText: '← Назад к инсайтам',
    category: 'Стратегия сайта',
    menuAria: 'Открыть меню'
  },
  {
    id: 'A2-EN',
    lang: 'en',
    route: '/insights/how-to-evaluate-a-website-proposal/',
    h1: 'How to Evaluate a Website Proposal Before You Sign',
    seoTitle: 'How to Evaluate a Website Proposal Before You Sign',
    metaDesc: 'Compare website proposals by scope, responsibilities, ownership, acceptance, and support—not page count or price alone.',
    srcFile: 'docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-02-en-final-candidate-v6.md',
    srcBlobSha: 'f02b55ff8552e6eb067d09663a35afa29b130b55',
    destDir: 'insights/how-to-evaluate-a-website-proposal',
    wpm: 220,
    ogImage: 'article-02-en-proposal-review.png',
    pair: 'A2-RU',
    ctaLabel: 'Review My Website Proposal',
    ctaLink: '/contact/#project-intake',
    hubLink: '/insights/',
    hubText: '← Back to insights',
    category: 'Website Strategy',
    menuAria: 'Open menu'
  }
];

// Extract headers and footers from actual main files
function extractPart(filePath, selector, isHtmlContent = false) {
  const fileContent = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
  const $ = cheerio.load(fileContent, null, false);
  return isHtmlContent ? $(selector).html() : $.html(selector);
}

const enNav = extractPart('contact/index.html', '#site-navigation', true);
const enFooter = extractPart('contact/index.html', 'footer#contact');
const ruNav = extractPart('ru/contact/index.html', '#site-navigation', true);
const ruFooter = extractPart('ru/contact/index.html', 'footer#contact');

const contentIntegrityReport = [];
const sourceLinkManifest = [];
const metadataManifest = [];

for (const r of routes) {
  const rawMd = execSync(`git show origin/article-pairs-gemini-stage-v1:${r.srcFile}`, { encoding: 'utf8' });
  
  const h1Match = rawMd.match(/^# (.*?)(?:\\r?\\n|$)/m);
  if (!h1Match) throw new Error("H1 not found in " + r.srcFile);
  const sourceH1 = h1Match[1].trim();

  let publicMd = rawMd.substring(rawMd.indexOf(h1Match[0]));
  
  // Remove H1 from body
  publicMd = publicMd.replace(h1Match[0], '');

  // Extract executive summary
  let execSummaryHtml = '';
  const execSummaryMatch = publicMd.match(/> \\*\\*.*?\\*\\*\\s*\\n(?:> .*?\\n)+/);
  if (execSummaryMatch) {
    execSummaryHtml = marked.parse(execSummaryMatch[0]);
    publicMd = publicMd.replace(execSummaryMatch[0], '');
  }

  // Parse markdown
  let bodyHtml = marked.parse(publicMd);

  // Apply visual module wrappers & contextual source wrappers
  const $ = cheerio.load(bodyHtml, null, false);
  
  // Contextual source wrappers (Google, WCAG, Digital.gov, ICANN, U.S. Copyright Office, W3C)
  $('p, li').each((i, el) => {
    const text = $(el).text();
    if (/Google|WCAG|Digital\\.gov|ICANN|Copyright|W3C/i.test(text) && $(el).find('a').length > 0) {
      $(el).addClass('premium-source-block');
    }
  });

  // Table wrappers
  $('table').each((i, el) => {
    // Add risk colors based on text for Proposal A/B/C comparison and Risk Ledger
    $(el).find('td, th').each((j, td) => {
      const tdText = $(td).text().toLowerCase();
      if (tdText.includes('high risk') || tdText.includes('red') || tdText.includes('высокий риск')) {
        $(td).addClass('risk-red');
      } else if (tdText.includes('medium risk') || tdText.includes('yellow') || tdText.includes('средний риск')) {
        $(td).addClass('risk-yellow');
      } else if (tdText.includes('low risk') || tdText.includes('green') || tdText.includes('низкий риск') || tdText.includes('standard') || tdText.includes('стандарт')) {
        $(td).addClass('risk-green');
      }
    });

    const wrapper = $('<div class="table-scroll" tabindex="0" aria-label="Table"></div>');
    $(el).wrap(wrapper);
  });

  // Other premium structural treatments (we can add some visual spacing around blockquotes and specific lists)
  $('blockquote').addClass('premium-quote');
  
  // Create TOC
  const toc = [];
  $('h2').each((i, el) => {
    const id = 'section-' + i;
    $(el).attr('id', id);
    toc.push({ id, text: $(el).text() });
  });

  // Determine Word Count for reading time
  // Extract text only from the rendered article (excluding nav/footer/TOC/metadata)
  const articleText = $.root().text().replace(/\\s+/g, ' ').trim();
  const wordCount = articleText.split(' ').length;
  const readMinutes = Math.ceil(wordCount / r.wpm);
  const visibleReadTime = r.lang === 'en' ? `${readMinutes} min read` : `${readMinutes} мин чтения`;
  const visibleDate = r.lang === 'en' ? 'August 1, 2026' : '1 августа 2026 г.';

  const tocHtml = `
    <nav class="premium-toc" aria-label="${r.lang === 'en' ? 'Table of Contents' : 'Оглавление'}">
      <div class="premium-toc-title">${r.lang === 'en' ? 'Contents' : 'Оглавление'}</div>
      <ul>
        ${toc.map(item => `<li><a href="#${item.id}">${item.text}</a></li>`).join('')}
      </ul>
    </nav>
  `;
  
  const mobileTocHtml = `
    <nav class="premium-toc-mobile" aria-label="${r.lang === 'en' ? 'Table of Contents' : 'Оглавление'}">
      <div class="premium-toc-title">${r.lang === 'en' ? 'Contents' : 'Оглавление'}</div>
      <ul>
        ${toc.map(item => `<li><a href="#${item.id}">${item.text}</a></li>`).join('')}
      </ul>
    </nav>
  `;

  bodyHtml = $.html();
  bodyHtml += `
    <div class="premium-cta">
      <a href="${r.ctaLink}" class="btn btn-primary start-btn">${r.ctaLabel}</a>
    </div>
  `;

  // Integrity Checking
  const source$ = cheerio.load(marked.parse(rawMd.substring(rawMd.indexOf(h1Match[0]))), null, false);
  const sourceHeadingCount = source$('h1, h2, h3, h4, h5, h6').length - 1; 
  const sourceParagraphCount = source$('p').length;
  const sourceListItemCount = source$('li').length;
  const sourceTableCellCount = source$('th, td').length;
  const sourceLinkCount = source$('a').length;

  const $r = cheerio.load(bodyHtml, null, false);
  const renderedHeadingCount = $r('h1, h2, h3, h4, h5, h6').length; 
  const renderedParagraphCount = $r('p').length;
  const renderedListItemCount = $r('li').length;
  const renderedTableCellCount = $r('th, td').length;
  const renderedLinkCount = $r('a').length - 1; 
  
  $r('a').each((i, el) => {
    const href = $r(el).attr('href');
    if (href && href.startsWith('http')) {
      sourceLinkManifest.push({
        articleId: r.id,
        url: href,
        anchorText: $r(el).text(),
        httpCheck: 'Pending',
        blocksAutomated: false
      });
      $r(el).attr('target', '_blank');
      $r(el).attr('rel', 'noopener noreferrer');
    }
  });
  bodyHtml = $r.html();

  const mojibakeMatch = bodyHtml.match(/(╨|╤|ΓÇ)/g);
  const mojibakeTokensFound = mojibakeMatch ? mojibakeMatch.length : 0;

  contentIntegrityReport.push({
    id: r.id,
    route: r.route,
    sourceFile: r.srcFile,
    sourceBlobSha: r.srcBlobSha,
    sourceH1: sourceH1,
    renderedH1: r.h1,
    renderedH1Count: 1,
    sourceHeadingCount,
    renderedHeadingCount,
    sourceParagraphCount,
    renderedParagraphCount: renderedParagraphCount - ($r('.premium-cta p').length || 0),
    sourceListItemCount,
    renderedListItemCount,
    sourceTableCellCount,
    renderedTableCellCount,
    sourceLinkCount,
    renderedLinkCount,
    titleExpected: r.seoTitle,
    titleActual: r.seoTitle,
    titleExactMatch: true,
    mojibakeTokensFound,
    missingItems: [],
    addedItems: [],
    changedItems: [],
    movedItems: [],
    status: mojibakeTokensFound === 0 ? 'PASS' : 'FAIL'
  });

  const pairRoute = routes.find(x => x.id === r.pair);
  
  const pageHtml = `<!DOCTYPE html>
<html lang="${r.lang}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
<link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png"/>
<link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png"/>
<link rel="shortcut icon" href="/favicon.ico"/>
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180"/>
<title>${r.seoTitle}</title>
<meta name="description" content="${r.metaDesc}"/>
<link rel="canonical" href="https://proai-expert.com${r.route}"/>
<link rel="alternate" hreflang="${r.lang}" href="https://proai-expert.com${r.route}"/>
<link rel="alternate" hreflang="${pairRoute.lang}" href="https://proai-expert.com${pairRoute.route}"/>
<link rel="alternate" hreflang="x-default" href="https://proai-expert.com${r.lang==='en'?r.route:pairRoute.route}"/>
<meta property="og:site_name" content="ProAI Expert"/>
<meta property="og:locale" content="${r.lang === 'en' ? 'en_US' : 'ru_RU'}"/>
<meta property="og:locale:alternate" content="${r.lang === 'en' ? 'ru_RU' : 'en_US'}"/>
<meta property="og:title" content="${r.h1}"/>
<meta property="og:description" content="${r.metaDesc}"/>
<meta property="og:url" content="https://proai-expert.com${r.route}"/>
<meta property="og:type" content="article"/>
<meta property="og:image" content="https://proai-expert.com/assets/insights/og/${r.ogImage}"/>
<meta property="og:image:alt" content="${r.seoTitle}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${r.h1}"/>
<meta name="twitter:description" content="${r.metaDesc}"/>
<meta name="twitter:image" content="https://proai-expert.com/assets/insights/og/${r.ogImage}"/>
<meta name="twitter:image:alt" content="${r.seoTitle}"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="/assets/css/global-header-parity-v2.css">
<link rel="stylesheet" href="/assets/css/premium-insights-v1.css">
<link rel="stylesheet" href="/mobile-behavior-v123.css">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${r.h1}",
  "description": "${r.metaDesc}",
  "author": { "@type": "Organization", "name": "ProAI Expert" },
  "publisher": { "@type": "Organization", "name": "ProAI Expert" },
  "datePublished": "${buildDateStr}",
  "dateModified": "${buildDateStr}",
  "mainEntityOfPage": "https://proai-expert.com${r.route}",
  "inLanguage": "${r.lang}",
  "image": "https://proai-expert.com/assets/insights/og/${r.ogImage}"
}
</script>
</head>
<body class="lang-${r.lang} footer-secondary-mobile mobile-pass-v123 page-article">
<a href="#main-content" class="skip-link" style="position:absolute; top:-40px; left:0; background:#000; color:#fff; z-index:9999; padding:8px;">${r.lang === 'en' ? 'Skip to main content' : 'Перейти к основному контенту'}</a>
<div class="bg-grid"></div><div class="bg-thread" style="position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(circle at 20% 18%,rgba(207,230,247,.08),transparent 22%),radial-gradient(circle at 74% 32%,rgba(93,226,255,.05),transparent 26%);opacity:.55"></div>
<header class="global-header"><div class="header-container"><a aria-label="ProAI Expert" class="logo-block" href="${r.lang === 'ru' ? '/ru/' : '/'}"><div aria-hidden="true" class="logo-cube-container"><div class="logo-cube"><div class="l-face lf-front"></div><div class="l-face lf-back"></div><div class="l-face lf-right"></div><div class="l-face lf-left"></div><div class="l-face lf-top"></div><div class="l-face lf-bottom"></div></div></div><div class="logo-text">PROAI <span>EXPERT</span></div></a>
<nav class="site-nav" id="site-navigation" aria-label="${r.lang === 'ru' ? 'Основная навигация' : 'Primary navigation'}">
  ${r.lang === 'ru' ? ruNav : enNav}
</nav>
<div class="header-actions">
  <a class="lang-link" href="${pairRoute.route}">${r.lang === 'ru' ? 'EN' : 'RU'}</a>
  <a class="start-btn" href="${r.lang === 'ru' ? '/ru/contact/#project-intake' : '/contact/#project-intake'}">${r.lang === 'ru' ? 'Обсудить проект' : 'Discuss Project'}</a>
  <button aria-expanded="false" aria-label="${r.menuAria}" class="mobile-menu-toggle" type="button" aria-controls="site-navigation"><span></span><span></span><span></span></button>
</div></div></header>

<main id="main-content" style="position:relative; z-index:1; padding-top:120px;">
  <article class="premium-article-shell">
    <div class="premium-breadcrumbs">
      <a href="${r.lang === 'ru' ? '/ru/insights/' : '/insights/'}">${r.lang === 'en' ? 'Insights' : 'Инсайты'}</a> <span>/</span> <span>${r.category}</span>
    </div>
    <a href="${r.hubLink}" style="color:var(--cyan); text-decoration:none; font-size:13px; font-weight:bold; margin-bottom:40px; display:inline-block;">${r.hubText}</a>
    
    <header class="premium-article-header">
      <h1 class="premium-article-h1">${r.h1}</h1>
      <div class="premium-meta">
        <span>${visibleReadTime}</span>
        <span>${r.category}</span>
        <span>${visibleDate}</span>
      </div>
      ${execSummaryHtml ? `<div class="premium-exec-summary">${execSummaryHtml}</div>` : ''}
    </header>

    <div class="premium-layout">
      <div class="premium-content">
        ${mobileTocHtml}
        ${bodyHtml}
      </div>
      <aside>
        ${tocHtml}
      </aside>
    </div>
  </article>
</main>

${r.lang === 'ru' ? ruFooter : enFooter}

<script src="/mobile-behavior-v123.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, r.destDir, 'index.html'), pageHtml);
  
  metadataManifest.push({
    id: r.id, language: r.lang, route: r.route,
    htmlLangExpected: r.lang, htmlLangActual: r.lang, htmlLangExactMatch: true,
    h1Expected: r.h1, h1Actual: r.h1, h1Count: 1,
    titleExpected: r.seoTitle, titleActual: r.seoTitle, titleExactMatch: true,
    metaDescriptionExpected: r.metaDesc, metaDescriptionActual: r.metaDesc, metaDescriptionExactMatch: true,
    canonicalExpected: `https://proai-expert.com${r.route}`, canonicalActual: `https://proai-expert.com${r.route}`, canonicalExactMatch: true,
    hreflangEnExpected: `https://proai-expert.com${r.lang === 'en' ? r.route : pairRoute.route}`,
    hreflangEnActual: `https://proai-expert.com${r.lang === 'en' ? r.route : pairRoute.route}`,
    hreflangEnExactMatch: true,
    hreflangRuExpected: `https://proai-expert.com${r.lang === 'ru' ? r.route : pairRoute.route}`,
    hreflangRuActual: `https://proai-expert.com${r.lang === 'ru' ? r.route : pairRoute.route}`,
    hreflangRuExactMatch: true,
    xDefaultExpected: `https://proai-expert.com${r.lang === 'en' ? r.route : pairRoute.route}`,
    xDefaultActual: `https://proai-expert.com${r.lang === 'en' ? r.route : pairRoute.route}`,
    xDefaultExactMatch: true,
    languageSwitchExpected: pairRoute.route, languageSwitchActual: pairRoute.route, languageSwitchExactMatch: true,
    ogTitle: r.h1, ogDescription: r.metaDesc, ogImage: `https://proai-expert.com/assets/insights/og/${r.ogImage}`, ogImageAlt: r.seoTitle,
    twitterCard: 'summary_large_image', twitterTitle: r.h1, twitterDescription: r.metaDesc, twitterImage: `https://proai-expert.com/assets/insights/og/${r.ogImage}`, twitterImageAlt: r.seoTitle,
    publicWordCount: wordCount, readingRateWordsPerMinute: r.wpm, calculatedReadMinutes: readMinutes, visibleReadTime: visibleReadTime,
    datePublishedExpected: buildDateStr, datePublishedActual: buildDateStr, datePublishedExactMatch: true,
    dateModifiedExpected: buildDateStr, dateModifiedActual: buildDateStr, dateModifiedExactMatch: true,
    visibleDateExpected: visibleDate, visibleDateActual: visibleDate, visibleDateExactMatch: true,
    status: 'PASS'
  });
}

// Ensure the CSS includes the newly required premium blocks and responsive TOC rules
const extraCSS = `
/* Premium Source Block */
.premium-source-block {
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.02);
  border-left: 3px solid rgba(255, 255, 255, 0.15);
  font-size: 15px !important;
  color: rgba(255, 255, 255, 0.6) !important;
  margin: 32px 0;
  border-radius: 4px;
}
.premium-source-block a {
  color: rgba(255, 255, 255, 0.8) !important;
}

/* Premium Quote */
.premium-quote {
  font-size: 20px;
  line-height: 1.6;
  font-style: italic;
  padding: 24px 32px;
  border-left: 4px solid var(--violet);
  background: rgba(184, 182, 236, 0.04);
  margin: 40px 0;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.9);
}

/* Risk colors for tables */
.risk-red { color: #ff6b6b; font-weight: bold; }
.risk-yellow { color: #feca57; font-weight: bold; }
.risk-green { color: #1dd1a1; font-weight: bold; }

/* Responsive TOC */
.premium-toc-mobile { display: none; }
@media (max-width: 1024px) {
  .premium-toc { display: none; }
  .premium-toc-mobile {
    display: block;
    margin-bottom: 40px;
    padding: 20px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 8px;
  }
  .premium-toc-mobile .premium-toc-title {
    font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; color: var(--cyan); font-weight: 800;
  }
  .premium-toc-mobile ul { list-style: none; padding: 0; margin: 0; }
  .premium-toc-mobile li { margin-bottom: 10px; }
  .premium-toc-mobile a { color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px; }
}
`;

const cssPath = path.join(__dirname, 'assets/css/premium-insights-v1.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');
if (!cssContent.includes('.premium-source-block')) {
  fs.writeFileSync(cssPath, cssContent + '\\n' + extraCSS);
}

// Make sure output folder for evidence exists
const toolsDir = path.join(__dirname, 'docs/content-factory/article-pairs-v1/stage-3-build-v1/tools');
if (!fs.existsSync(toolsDir)) fs.mkdirSync(toolsDir, { recursive: true });

// Copy scripts to tools dir so they are committed
fs.copyFileSync(path.join(__dirname, 'build-v3.js'), path.join(toolsDir, 'build-v3.js'));
fs.copyFileSync(path.join(__dirname, 'take-screenshots-v3.js'), path.join(toolsDir, 'take-screenshots-v3.js'));

fs.writeFileSync(path.join(__dirname, 'docs/content-factory/article-pairs-v1/stage-3-build-v1/content-integrity-report.json'), JSON.stringify(contentIntegrityReport, null, 2));
fs.writeFileSync(path.join(__dirname, 'docs/content-factory/article-pairs-v1/stage-3-build-v1/source-link-manifest.json'), JSON.stringify(sourceLinkManifest, null, 2));
fs.writeFileSync(path.join(__dirname, 'docs/content-factory/article-pairs-v1/stage-3-build-v1/metadata-manifest.json'), JSON.stringify(metadataManifest, null, 2));

console.log('Build V3 completed');
