const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { marked } = require('marked');
const cheerio = require('cheerio');

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
    menuAria: 'Открыть меню',
    footerCtaLink: '/ru/contact/#project-intake'
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
    menuAria: 'Open menu',
    footerCtaLink: '/contact/#project-intake'
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
    menuAria: 'Открыть меню',
    footerCtaLink: '/ru/contact/#project-intake'
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
    menuAria: 'Open menu',
    footerCtaLink: '/contact/#project-intake'
  }
];

function extractNavAndFooter(filePath, isRu) {
  const fileContent = fs.readFileSync(path.join(repoRoot, filePath), 'utf8');
  const $ = cheerio.load(fileContent, null, false);
  
  // Fix active nav
  $('#site-navigation a').removeClass('is-active').removeAttr('aria-current');
  const insightHref = isRu ? '/ru/insights/' : '/insights/';
  $(`#site-navigation a[href="${insightHref}"]`).addClass('is-active').attr('aria-current', 'page');
  
  // Fix footer CTA
  const ctaHref = isRu ? '/ru/contact/#project-intake' : '/contact/#project-intake';
  $('footer#contact .f-cta-btn').attr('href', ctaHref);

  return {
    nav: $('#site-navigation').html(),
    footer: $.html('footer#contact')
  };
}

const enParts = extractNavAndFooter('contact/index.html', false);
const ruParts = extractNavAndFooter('ru/contact/index.html', true);

function normalizeText(text) {
  return text.replace(/\\s+/g, ' ').trim();
}

function processArticle(r) {
  // We use git show to get exact bytes, but specifying utf8
  const rawMd = execSync(`git show origin/article-pairs-gemini-stage-v1:${r.srcFile}`, { encoding: 'utf8', cwd: repoRoot });
  
  const h1Match = rawMd.match(/^# (.*?)(?:\\r?\\n|$)/m);
  if (!h1Match) throw new Error("H1 not found in " + r.srcFile);
  const sourceH1 = h1Match[1].trim();

  let publicMd = rawMd.substring(rawMd.indexOf(h1Match[0]));
  publicMd = publicMd.replace(h1Match[0], ''); // Remove duplicated H1

  let execSummaryHtml = '';
  const execSummaryMatch = publicMd.match(/> \\*\\*.*?\\*\\*\\s*\\n(?:> .*?\\n)+/);
  if (execSummaryMatch) {
    execSummaryHtml = marked.parse(execSummaryMatch[0]);
    publicMd = publicMd.replace(execSummaryMatch[0], '');
  }

  let bodyHtml = marked.parse(publicMd);

  const $ = cheerio.load(bodyHtml, null, false);
  
  // Add premium source blocks
  $('p, li').each((i, el) => {
    const text = $(el).text();
    if (/Google|WCAG|Digital\\.gov|ICANN|Copyright|W3C/i.test(text) && $(el).find('a').length > 0) {
      $(el).addClass('premium-source-block');
    }
  });

  // Table Risk colors (exact match)
  const riskLabels = {
    'High risk': 'risk-red',
    'Medium risk': 'risk-yellow',
    'Low risk': 'risk-green',
    'Высокий риск': 'risk-red',
    'Средний риск': 'risk-yellow',
    'Низкий риск': 'risk-green'
  };

  $('table').each((i, el) => {
    const wrapper = $('<div class="table-scroll" tabindex="0" aria-label="Table"></div>');
    $(el).wrap(wrapper);
  });

  $('blockquote').addClass('premium-quote');
  
  // Premium Module semantic wrappers
  const moduleMap = {
    'Гипотетический сценарий: разорванный языковой путь': 'broken-language-journey',
    'Hypothetical scenario: The broken language journey': 'broken-language-journey',
    'Три модели сайта': 'three-model',
    'Three website models': 'three-model',
    'Матрица выбора языковой модели': 'decision-matrix',
    'Матрица проверки спроса': 'demand-evidence-tool',
    'Demand verification table': 'demand-evidence-tool',
    '5 вопросов перед расширением сайта': 'five-decision-questions',
    'Five expansion questions': 'five-decision-questions',
    'Реальный путь до архива: где прерывается контакт': 'continuity-flow',
    'The journey before the archive': 'continuity-flow',
    'Перевод против локализации': 'translation-vs-localization',
    'Translation vs. localization': 'translation-vs-localization',
    'Поддержка сайта и управление изменениями': 'governance-system',
    'Website governance and maintenance': 'governance-system',
    'Проверка непрерывности': 'continuity-check',
    'Continuity test': 'continuity-check',
    'Пример структуры: Financial Stream': 'financial-stream-evidence',
    'Ограничение ответственности': 'performance-boundary',
    'Performance boundaries': 'performance-boundary',
    'Итоговый алгоритм решения': 'decision-sequence',
    'Final decision sequence': 'decision-sequence',
    'Гипотетический сценарий: предложения с одинаковым объёмом страниц': 'same-page-count-scenario',
    'Hypothetical scenario: Proposals with the same page count': 'same-page-count-scenario',
    'От коммерческого предложения до договора': 'document-reconciliation',
    'From proposal to agreement': 'document-reconciliation',
    'Семь областей оценки': 'seven-area-map',
    'Seven evaluation areas': 'seven-area-map',
    'Реестр рисков предложения (Proposal Risk Ledger)': 'proposal-risk-ledger',
    'Proposal Risk Ledger': 'proposal-risk-ledger',
    'Определения полей': 'ledger-definitions',
    'Field definitions': 'ledger-definitions',
    'Пять групп объёма работ (Scope)': 'scope-matrix',
    'Five scope groups': 'scope-matrix',
    'Матрица ответственности и клиентских материалов': 'responsibility-matrix',
    'Responsibility and client-input matrix': 'responsibility-matrix',
    'Карта контроля и доступов': 'business-control-map',
    'Business Control Map': 'business-control-map',
    'Технологии и зависимости': 'technology-diagnostic',
    'Technology and dependencies': 'technology-diagnostic',
    'Спецификация интеграций': 'integration-specification',
    'Integration specification': 'integration-specification',
    'Приёмка работы и Definition of Done': 'definition-of-done',
    'Acceptance and Definition of Done': 'definition-of-done',
    'Изменения, доработки и поддержка': 'change-taxonomy',
    'Changes, revisions, and support': 'change-taxonomy',
    'Таксономия доказательств агентства': 'evidence-taxonomy',
    'Agency evidence taxonomy': 'evidence-taxonomy',
    'Тревожные сигналы в процессе': 'contextual-warning-signals',
    'Warning signals': 'contextual-warning-signals',
    'Сравнение предложений A/B/C': 'abc-comparison',
    'Proposal A/B/C comparison': 'abc-comparison',
    'Явное резюме рисков': 'explicit-risk-summary',
    'Решение: Красный риск': 'red-risk-decision-gate',
    'Red-item decision gate': 'red-risk-decision-gate',
    'Объяснение регулярных затрат': 'repeat-cost-explanation',
    'Repeat costs': 'repeat-cost-explanation',
    '10 шагов до подписания договора': 'ten-step-decision-sequence',
    'Ten steps before you sign': 'ten-step-decision-sequence'
  };

  $('h2, h3').each((i, el) => {
    const text = $(el).text().trim();
    if (moduleMap[text]) {
      // Find all subsequent siblings until next heading of same or higher level
      const tag = el.tagName.toLowerCase();
      let nextSelector = tag === 'h2' ? 'h1, h2' : 'h1, h2, h3';
      let nextSiblings = $(el).nextUntil(nextSelector);
      // Wrap them
      const wrapper = $(`<div class="premium-module" data-module="${moduleMap[text]}"></div>`);
      $(el).before(wrapper);
      wrapper.append(el);
      wrapper.append(nextSiblings);
      
      // If it's a risk module, color its table cells
      if (moduleMap[text] === 'abc-comparison' || moduleMap[text] === 'proposal-risk-ledger' || moduleMap[text] === 'explicit-risk-summary') {
        wrapper.find('td, th').each((j, td) => {
          const tdText = $(td).text().trim();
          if (riskLabels[tdText]) {
            $(td).addClass(riskLabels[tdText]);
          }
        });
      }
    }
  });

  const toc = [];
  $('h2').each((i, el) => {
    const id = 'section-' + i;
    $(el).attr('id', id);
    toc.push({ id, text: $(el).text() });
  });

  // Word count: extract text from our main DOM body
  const rawBodyText = normalizeText($.root().text());
  const execSumText = execSummaryHtml ? normalizeText(cheerio.load(execSummaryHtml).root().text()) : '';
  const totalText = `${sourceH1} ${execSumText} ${rawBodyText} ${r.ctaLabel}`;
  const wordCount = totalText.split(' ').filter(x => x.length > 0).length;
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
<link rel="alternate" hreflang="${r.pairRouteLang}" href="https://proai-expert.com${r.pairRouteRoute}"/>
<link rel="alternate" hreflang="x-default" href="https://proai-expert.com${r.enRoute}"/>
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
<nav class="site-nav" id="site-navigation" aria-label="${r.menuAria}">
  ${r.lang === 'ru' ? ruParts.nav : enParts.nav}
</nav>
<div class="header-actions">
  <a class="lang-link" href="${r.pairRouteRoute}">${r.lang === 'ru' ? 'EN' : 'RU'}</a>
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
      ${execSummaryHtml ? `<div class="premium-exec-summary" data-module="executive-summary">${execSummaryHtml}</div>` : ''}
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

${r.lang === 'ru' ? ruParts.footer : enParts.footer}

<script src="/mobile-behavior-v123.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(repoRoot, r.destDir, 'index.html'), pageHtml);

  return {
    rawMd,
    bodyHtml,
    sourceH1,
    execSummaryHtml,
    wordCount,
    readMinutes,
    visibleReadTime,
    visibleDate
  };
}

for (const r of routes) {
  const pairRoute = routes.find(x => x.id === r.pair);
  r.pairRouteLang = pairRoute.lang;
  r.pairRouteRoute = pairRoute.route;
  r.enRoute = r.lang === 'en' ? r.route : pairRoute.route;
  processArticle(r);
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

/* Premium Modules */
.premium-module {
  margin: 40px 0;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.01);
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

const cssPath = path.join(repoRoot, 'assets/css/premium-insights-v1.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');
if (!cssContent.includes('.premium-source-block')) {
  fs.writeFileSync(cssPath, cssContent + '\\n' + extraCSS);
}

console.log('Build V4 completed');