import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.R3_QA_BASE || 'http://127.0.0.1:4173';
const outDir = process.env.R3_QA_OUT || 'artifacts/r3-qa';
await fs.mkdir(outDir, { recursive: true });

const viewports = [
  { name: '1440', width: 1440, height: 1000 },
  { name: '1366', width: 1366, height: 900 },
  { name: '1024', width: 1024, height: 900 },
  { name: '430', width: 430, height: 932 },
  { name: '390', width: 390, height: 844 },
  { name: '375', width: 375, height: 812 },
  { name: '320', width: 320, height: 720 },
  { name: '844x390', width: 844, height: 390 },
];

const locales = [
  { key: 'en', route: '/ai-systems/', expectedLocaleHref: '/ru/ai-systems/' },
  { key: 'ru', route: '/ru/ai-systems/', expectedLocaleHref: '/ai-systems/' },
];

const requiredSelectors = [
  ['HEADER', '.site-header'],
  ['HERO', '.ai-r3-hero'],
  ['ENGINEERING_DEPTH', '.ai-r3-depth'],
  ['REAL_CODE', '.ai-r3-code'],
  ['CONTROLLED_AGENT_EXECUTION', '.ai-r3-execution'],
  ['PEARL', '.ai-r3-pearl'],
  ['HUMAN_CONTROL', '.ai-r3-human'],
  ['EVIDENCE', '.ai-r3-evidence-grid'],
  ['INTEGRATIONS', '.ai-r3-topology'],
  ['FULL_FOOTER', '.ai-r3-footer'],
];

const results = [];
let hardFailures = 0;
const browser = await chromium.launch({ headless: true });

async function checkPage(locale, viewport) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  const errors = [];
  const failedRequests = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText || 'failed'}`));

  const url = `${BASE}${locale.route}`;
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  const status = response?.status() ?? 0;
  await page.waitForTimeout(900);

  const missing = [];
  for (const [label, selector] of requiredSelectors) {
    if ((await page.locator(selector).count()) !== 1) missing.push(label);
  }

  const metrics = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
    htmlLang: document.documentElement.lang,
  }));
  const overflow = Math.max(metrics.scrollWidth, metrics.bodyScrollWidth) > metrics.innerWidth + 1;

  const localeLink = page.locator('.site-header__locale').first();
  const localeHref = await localeLink.getAttribute('href');
  const localeOk = localeHref === locale.expectedLocaleHref;

  let mobileMenuOk = true;
  if (viewport.width <= 1024) {
    const toggle = page.locator('.site-header__menu-toggle');
    if ((await toggle.count()) === 1) {
      await toggle.click();
      const expanded = await toggle.getAttribute('aria-expanded');
      const nav = page.locator('.site-header__nav');
      const navVisible = await nav.isVisible();
      mobileMenuOk = expanded === 'true' && navVisible;
      await toggle.click();
    } else {
      mobileMenuOk = false;
    }
  }

  const focusable = page.locator('a,button').filter({ visible: true }).first();
  let focusOk = true;
  if (await focusable.count()) {
    await focusable.focus();
    focusOk = await focusable.evaluate(el => document.activeElement === el);
  }

  const execution = page.locator('.ai-r3-execution');
  await execution.scrollIntoViewIfNeeded();
  await page.waitForTimeout(5600);
  const executionState = await execution.getAttribute('data-current');
  const actionCurrent = await page.locator('.ai-r3-event[data-event="action"]').getAttribute('aria-current');
  const executionOk = executionState === 'action' && actionCurrent === 'step';

  const screenshotPath = path.join(outDir, `${locale.key}-${viewport.name}-full.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });

  if (viewport.name === '1440' || viewport.name === '390' || viewport.name === '320') {
    await page.locator('.ai-r3-hero').screenshot({ path: path.join(outDir, `${locale.key}-${viewport.name}-hero.png`) });
    await page.locator('.ai-r3-execution').screenshot({ path: path.join(outDir, `${locale.key}-${viewport.name}-execution.png`) });
    await page.locator('.ai-r3-human-stage').screenshot({ path: path.join(outDir, `${locale.key}-${viewport.name}-human.png`) });
    await page.locator('.ai-r3-footer').screenshot({ path: path.join(outDir, `${locale.key}-${viewport.name}-footer.png`) });
  }

  const ok = status === 200 && missing.length === 0 && !overflow && localeOk && mobileMenuOk && focusOk && executionOk && errors.length === 0 && failedRequests.length === 0;
  if (!ok) hardFailures += 1;
  results.push({ locale: locale.key, viewport: viewport.name, url, status, missing, overflow, localeHref, localeOk, mobileMenuOk, focusOk, executionState, executionOk, consoleErrors: errors, failedRequests, metrics, ok });
  await context.close();
}

for (const locale of locales) {
  for (const viewport of viewports) await checkPage(locale, viewport);
}

for (const locale of locales) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${BASE}${locale.route}`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(500);
  const reduced = await page.evaluate(() => ({
    media: matchMedia('(prefers-reduced-motion: reduce)').matches,
    rootClass: document.documentElement.className,
    heroRegistered: document.querySelector('[data-r3-hero]')?.classList.contains('is-registered') || false,
    allRevealed: [...document.querySelectorAll('[data-r3-reveal],[data-r3-sequence]')].every(el => el.classList.contains('is-r3-live')),
    executionState: document.querySelector('[data-r3-execution]')?.getAttribute('data-current'),
  }));
  const ok = reduced.media && reduced.rootClass.includes('ai-r3-reduce') && reduced.heroRegistered && reduced.allRevealed && reduced.executionState === 'action' && errors.length === 0;
  if (!ok) hardFailures += 1;
  results.push({ locale: locale.key, viewport: '390-reduced-motion', ...reduced, consoleErrors: errors, ok });
  await context.close();
}

await browser.close();
await fs.writeFile(path.join(outDir, 'qa-results.json'), JSON.stringify({ generatedAt: new Date().toISOString(), hardFailures, results }, null, 2));

const summary = [
  '# AI Systems R3 Browser QA',
  '',
  `Hard failures: ${hardFailures}`,
  '',
  '| Locale | Viewport | Result | Overflow | Menu | Locale | Execution | Console/assets |',
  '|---|---:|---|---|---|---|---|---|',
  ...results.map(r => `| ${r.locale} | ${r.viewport} | ${r.ok ? 'PASS' : 'FAIL'} | ${r.overflow === undefined ? 'n/a' : (r.overflow ? 'FAIL' : 'PASS')} | ${r.mobileMenuOk === undefined ? 'n/a' : (r.mobileMenuOk ? 'PASS' : 'FAIL')} | ${r.localeOk === undefined ? 'n/a' : (r.localeOk ? 'PASS' : 'FAIL')} | ${(r.executionOk ?? (r.executionState === 'action')) ? 'PASS' : 'FAIL'} | ${(r.consoleErrors?.length || r.failedRequests?.length) ? 'FAIL' : 'PASS'} |`),
  '',
];
await fs.writeFile(path.join(outDir, 'QA.md'), summary.join('\n'));
console.log(summary.join('\n'));
if (hardFailures) process.exitCode = 1;
