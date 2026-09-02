import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://127.0.0.1:4173';
const OUT = 'docs/site-evolution/reviews/selected-thinking-r14/evidence';
fs.mkdirSync(OUT, { recursive: true });

const report = {
  productSha: process.env.PRODUCT_SHA,
  generatedAt: new Date().toISOString(),
  pass: false,
  checks: [],
  failures: [],
  consoleErrors: [],
  selectedAssetFailures: []
};

const reportPath = path.join(OUT, 'qa-results.json');
const persist = () => fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
persist();

const expected = {
  en: {
    route: '/',
    taxonomy: 'AI SYSTEMS / AUTOMATION / DIGITAL STRATEGY / OPERATIONS',
    archiveHref: '/insights/',
    topText: 'EXPLORE ALL INSIGHTS →',
    lead: 'What Happens After a Lead Arrives? Building a Response System for Service Businesses',
    supports: [
      'Does Your U.S. Service Business Need a Multilingual Website?',
      'How to Evaluate a Website Proposal Before You Sign'
    ]
  },
  ru: {
    route: '/ru/',
    taxonomy: 'AI-СИСТЕМЫ / АВТОМАТИЗАЦИЯ / ЦИФРОВАЯ СТРАТЕГИЯ / ОПЕРАЦИИ',
    archiveHref: '/ru/insights/',
    topText: 'СМОТРЕТЬ ВСЕ МАТЕРИАЛЫ →',
    lead: 'Что происходит после заявки: как сервисному бизнесу не терять обращения',
    supports: [
      'Сайт для русскоязычного бизнеса в США: только английский, отдельный русский раздел или две версии?',
      'Как проверить подрядчика и предложение на разработку сайта'
    ]
  }
};

const viewports = [
  { name: '1440x900', width: 1440, height: 900, mobile: false },
  { name: '1280x800', width: 1280, height: 800, mobile: false },
  { name: '1024x768', width: 1024, height: 768, mobile: false },
  { name: '430x932', width: 430, height: 932, mobile: true },
  { name: '390x844', width: 390, height: 844, mobile: true },
  { name: '375x812', width: 375, height: 812, mobile: true },
  { name: '360x800', width: 360, height: 800, mobile: true },
  { name: '320x700', width: 320, height: 700, mobile: true },
  { name: '852x393', width: 852, height: 393, mobile: true }
];

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist']
});

function check(ok, label, details = null) {
  if (ok) report.checks.push({ label, details });
  else report.failures.push({ label, details });
  persist();
}

async function openPage(lang, vp, reducedMotion = 'no-preference') {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    reducedMotion,
    isMobile: vp.mobile,
    hasTouch: vp.mobile
  });
  const page = await context.newPage();
  page.on('pageerror', error => {
    report.consoleErrors.push({ lang, viewport: vp.name, type: 'pageerror', text: String(error) });
    persist();
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      report.consoleErrors.push({ lang, viewport: vp.name, type: 'console', text: msg.text() });
      persist();
    }
  });
  page.on('requestfailed', request => {
    if (request.url().includes('home-selected-thinking')) {
      report.selectedAssetFailures.push({ lang, viewport: vp.name, url: request.url(), error: request.failure()?.errorText || 'requestfailed' });
      persist();
    }
  });
  page.on('response', response => {
    if (response.status() >= 400 && response.url().includes('home-selected-thinking')) {
      report.selectedAssetFailures.push({ lang, viewport: vp.name, url: response.url(), error: `HTTP ${response.status()}` });
      persist();
    }
  });

  await page.goto(`${BASE}${expected[lang].route}`, { waitUntil: 'load', timeout: 60000 });
  const section = page.locator('#selected-thinking-r1');
  await section.waitFor({ state: 'visible', timeout: 20000 });
  await section.evaluate(el => el.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(1250);
  return { context, page, section };
}

async function inspectStatic(lang, vp, reducedMotion = 'no-preference') {
  const { context, page } = await openPage(lang, vp, reducedMotion);
  const data = await page.evaluate(() => {
    const root = document.querySelector('#selected-thinking-r1');
    const taxonomy = root?.querySelector('.selected-thinking-r1__taxonomy');
    const top = root?.querySelector('.selected-thinking-r1__archive-top');
    const bottom = root?.querySelector('.selected-thinking-r1__archive a');
    const lead = root?.querySelector('.selected-thinking-r1__lead');
    const leadLink = root?.querySelector('.selected-thinking-r1__lead h3 a');
    const supports = [...(root?.querySelectorAll('.selected-thinking-r1__support-record h3 a') || [])];
    const head = root?.querySelector('.selected-thinking-r1__lead .selected-thinking-r1__record-head');
    const framework = root?.querySelector('.selected-thinking-r1__framework--lead');
    const topRect = top?.getBoundingClientRect();
    return {
      sectionCount: document.querySelectorAll('#selected-thinking-r1').length,
      taxonomyCount: root?.querySelectorAll('.selected-thinking-r1__taxonomy').length || 0,
      taxonomy: taxonomy?.textContent?.replace(/\s+/g, ' ').trim() || '',
      topCount: root?.querySelectorAll('.selected-thinking-r1__archive-top').length || 0,
      topTag: top?.tagName || '',
      topHref: top ? new URL(top.href).pathname : '',
      topText: top?.textContent?.replace(/\s+/g, ' ').trim() || '',
      topHeight: topRect?.height || 0,
      bottomHref: bottom ? new URL(bottom.href).pathname : '',
      inlineStyles: root?.querySelectorAll('style').length || 0,
      lead: leadLink?.textContent?.replace(/\s+/g, ' ').trim() || '',
      supports: supports.map(a => a.textContent.replace(/\s+/g, ' ').trim()),
      cssLoaded: [...document.styleSheets].some(sheet => sheet.href?.includes('home-selected-thinking-r1-4.css')),
      material: lead ? getComputedStyle(lead).backgroundImage : '',
      indexContent: lead ? getComputedStyle(lead, '::after').content : '',
      indexFontSize: lead ? getComputedStyle(lead, '::after').fontSize : '',
      indexColor: lead ? getComputedStyle(lead, '::after').color : '',
      spineWidth: head ? getComputedStyle(head, '::before').width : '',
      spineBackground: head ? getComputedStyle(head, '::before').backgroundImage : '',
      signalBackground: framework ? getComputedStyle(framework, '::before').backgroundImage : '',
      overflowPx: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
      finePointer: matchMedia('(hover: hover) and (pointer: fine)').matches,
      reduced: matchMedia('(prefers-reduced-motion: reduce)').matches
    };
  });

  const label = `${lang} ${vp.name}${reducedMotion === 'reduce' ? ' reduced' : ''}`;
  check(data.sectionCount === 1, `${label}: one integrated section`, data);
  check(data.taxonomyCount === 1 && data.taxonomy === expected[lang].taxonomy, `${label}: taxonomy exact`, data.taxonomy);
  check(data.topCount === 1 && data.topTag === 'A', `${label}: one real top archive anchor`, data);
  check(data.topHref === expected[lang].archiveHref, `${label}: top href correct`, data.topHref);
  check(data.topText === expected[lang].topText, `${label}: top CTA text exact`, data.topText);
  check(data.topHeight >= 43.5, `${label}: top CTA practical 44px hit area`, data.topHeight);
  check(data.bottomHref === expected[lang].archiveHref, `${label}: bottom archive CTA preserved`, data.bottomHref);
  check(data.inlineStyles === 0, `${label}: zero inline style blocks`, data.inlineStyles);
  check(data.lead === expected[lang].lead, `${label}: lead article unchanged`, data.lead);
  check(JSON.stringify(data.supports) === JSON.stringify(expected[lang].supports), `${label}: support articles unchanged`, data.supports);
  check(data.cssLoaded, `${label}: additive R1.4 CSS loaded`);
  check(data.material.includes('radial-gradient'), `${label}: graphite/pearl/indigo material field rendered`, data.material);
  check(data.indexContent.includes('01'), `${label}: oversized 01 rendered`, { fontSize: data.indexFontSize, color: data.indexColor });
  check(data.spineWidth === '1px' && data.spineBackground.includes('linear-gradient'), `${label}: editorial spine rendered`, data);
  check(data.signalBackground.includes('linear-gradient'), `${label}: Decision Signal rendered`, data.signalBackground);
  check(data.overflowPx <= 1, `${label}: no horizontal overflow`, data.overflowPx);
  check(data.reduced === (reducedMotion === 'reduce'), `${label}: reduced-motion media state correct`, data.reduced);
  if (vp.mobile) check(!data.finePointer, `${label}: no fake fine-pointer hover mode`, data.finePointer);

  if (reducedMotion === 'reduce') {
    const leadLink = page.locator('#selected-thinking-r1 .selected-thinking-r1__lead h3 a');
    await leadLink.focus();
    await page.waitForTimeout(80);
    const motion = await page.evaluate(() => {
      const f = document.querySelector('#selected-thinking-r1 .selected-thinking-r1__framework--lead');
      const n2 = document.querySelector('#selected-thinking-r1 .selected-thinking-r1__framework--lead > span:nth-of-type(2)');
      const root = document.querySelector('#selected-thinking-r1');
      return {
        sweep: getComputedStyle(f, '::before').animationName,
        node: getComputedStyle(n2, '::before').animationName,
        contentVisible: root.innerText.length > 100 && getComputedStyle(root).visibility !== 'hidden'
      };
    });
    check(motion.sweep === 'none', `${label}: travelling sweep disabled`, motion);
    check(motion.node === 'none', `${label}: node sequence disabled`, motion);
    check(motion.contentVisible, `${label}: authority content remains visible`, motion);
  }

  await context.close();
}

async function inspectInteraction(lang) {
  const vp = { name: '1440x900', width: 1440, height: 900, mobile: false };
  const { context, page } = await openPage(lang, vp);

  const top = page.locator('#selected-thinking-r1 .selected-thinking-r1__archive-top');
  await top.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  const keyboard = await page.evaluate(() => {
    const top = document.querySelector('#selected-thinking-r1 .selected-thinking-r1__archive-top');
    const cs = getComputedStyle(top);
    return { active: document.activeElement === top, outlineWidth: parseFloat(cs.outlineWidth || '0'), outlineStyle: cs.outlineStyle };
  });
  check(keyboard.active && keyboard.outlineWidth >= 1, `${lang}: keyboard focus visible on top CTA`, keyboard);

  const leadLink = page.locator('#selected-thinking-r1 .selected-thinking-r1__lead h3 a');
  await leadLink.focus();
  await page.waitForTimeout(70);
  const active = await page.evaluate(() => {
    const f = document.querySelector('#selected-thinking-r1 .selected-thinking-r1__framework--lead');
    const n2 = document.querySelector('#selected-thinking-r1 .selected-thinking-r1__framework--lead > span:nth-of-type(2)');
    const n3 = document.querySelector('#selected-thinking-r1 .selected-thinking-r1__framework--lead > span:nth-of-type(3)');
    const n4 = document.querySelector('#selected-thinking-r1 .selected-thinking-r1__framework--lead > span:nth-of-type(4)');
    return {
      sweepName: getComputedStyle(f, '::before').animationName,
      sweepDuration: getComputedStyle(f, '::before').animationDuration,
      sweepIterations: getComputedStyle(f, '::before').animationIterationCount,
      nodes: [n2, n3, n4].map(n => ({
        name: getComputedStyle(n, '::before').animationName,
        delay: getComputedStyle(n, '::before').animationDelay,
        iterations: getComputedStyle(n, '::before').animationIterationCount
      }))
    };
  });
  check(active.sweepName === 'st-r14-sweep', `${lang}: Decision Signal activates`, active);
  check(active.sweepDuration === '0.78s', `${lang}: signal duration 780ms`, active.sweepDuration);
  check(active.sweepIterations === '1', `${lang}: signal exactly one iteration`, active.sweepIterations);
  check(active.nodes.every(n => n.name === 'st-r14-node' && n.iterations === '1'), `${lang}: nodes 2–4 one-shot response`, active.nodes);
  check(active.nodes.map(n => n.delay).join(',') === '0.28s,0.41s,0.54s', `${lang}: node order 2→3→4`, active.nodes);

  if (lang === 'en') {
    await page.waitForTimeout(230);
    try {
      await page.screenshot({ path: path.join(OUT, 'desktop-en-active.png'), fullPage: false, timeout: 15000 });
      check(true, 'desktop EN active screenshot captured');
    } catch (error) {
      check(false, 'desktop EN active screenshot captured', String(error));
    }
  }

  await page.waitForTimeout(900);
  const running = await page.evaluate(() => document.getAnimations().filter(a =>
    a.playState === 'running' && (a.animationName === 'st-r14-sweep' || a.animationName === 'st-r14-node')
  ).length);
  check(running === 0, `${lang}: absolute calm after completion`, running);

  await leadLink.blur();
  await page.waitForTimeout(120);
  const fragments = await page.evaluate(() => document.getAnimations().filter(a =>
    a.playState === 'running' && (a.animationName === 'st-r14-sweep' || a.animationName === 'st-r14-node')
  ).length);
  check(fragments === 0, `${lang}: clean reset after blur`, fragments);
  await context.close();
}

async function captureSettled(lang, vp, filename) {
  const { context, page } = await openPage(lang, vp);
  try {
    await page.screenshot({ path: path.join(OUT, filename), fullPage: false, timeout: 15000 });
    check(true, `${filename}: captured from integrated homepage`);
  } catch (error) {
    check(false, `${filename}: captured from integrated homepage`, String(error));
  }
  await context.close();
}

for (const lang of ['en', 'ru']) {
  for (const vp of viewports) await inspectStatic(lang, vp);
  await inspectInteraction(lang);
  await inspectStatic(lang, { name: '1440x900', width: 1440, height: 900, mobile: false }, 'reduce');
}

await captureSettled('en', { name: '1440x900', width: 1440, height: 900, mobile: false }, 'desktop-en-settled.png');
await captureSettled('ru', { name: '1440x900', width: 1440, height: 900, mobile: false }, 'desktop-ru-settled.png');
await captureSettled('en', { name: '390x844', width: 390, height: 844, mobile: true }, 'mobile-390-en.png');
await captureSettled('en', { name: '852x393', width: 852, height: 393, mobile: true }, 'landscape-852x393-en.png');

await browser.close();

check(report.consoleErrors.length === 0, 'browser console clean', report.consoleErrors);
check(report.selectedAssetFailures.length === 0, 'Selected Thinking assets load cleanly', report.selectedAssetFailures);

report.pass = report.failures.length === 0;
persist();
console.log(JSON.stringify({ pass: report.pass, checks: report.checks.length, failures: report.failures.length }, null, 2));
if (!report.pass) {
  console.error(JSON.stringify(report.failures.slice(0, 30), null, 2));
  process.exit(1);
}
