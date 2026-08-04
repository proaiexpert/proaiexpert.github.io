import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const outputDirectory = process.env.QA_OUT || 'financial-stream-clean-captures';
const qaSha = process.env.QA_SHA || 'unknown';
await fs.mkdir(outputDirectory, { recursive: true });

const languages = [
  { code: 'en', url: 'https://proai-expert.com/case-studies/financial-stream/' },
  { code: 'ru', url: 'https://proai-expert.com/ru/case-studies/financial-stream/' },
];

const viewports = [
  { name: 'desktop-1920x1080', width: 1920, height: 1080, dpr: 1 },
  { name: 'desktop-1600x900', width: 1600, height: 900, dpr: 1 },
  { name: 'desktop-1440x900', width: 1440, height: 900, dpr: 1 },
  { name: 'desktop-1366x768', width: 1366, height: 768, dpr: 1 },
  { name: 'tablet-1024x768', width: 1024, height: 768, dpr: 2 },
  { name: 'tablet-768x1024', width: 768, height: 1024, dpr: 2 },
  { name: 'mobile-430x932', width: 430, height: 932, dpr: 2 },
  { name: 'mobile-390x844', width: 390, height: 844, dpr: 2 },
  { name: 'mobile-375x812', width: 375, height: 812, dpr: 2 },
  { name: 'mobile-320x568', width: 320, height: 568, dpr: 2 },
  { name: 'landscape-932x430', width: 932, height: 430, dpr: 2 },
  { name: 'landscape-844x390', width: 844, height: 390, dpr: 2 },
  { name: 'landscape-740x360', width: 740, height: 360, dpr: 2 },
];

const noJavaScriptViewports = new Set([
  'desktop-1440x900',
  'tablet-768x1024',
  'mobile-390x844',
  'landscape-740x360',
]);

const report = {
  generatedAt: new Date().toISOString(),
  qaSha,
  captures: [],
  anchorChecks: [],
  failures: [],
};

const browser = await chromium.launch({ headless: true });

async function capture(language, viewport, javaScriptEnabled) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.dpr,
    javaScriptEnabled,
    ignoreHTTPSErrors: true,
    locale: language.code === 'ru' ? 'ru-RU' : 'en-US',
  });
  const page = await context.newPage();

  try {
    const mode = javaScriptEnabled ? 'clean-visual-qa' : 'clean-visual-qa-nojs';
    const url = `${language.url}?${mode}=${encodeURIComponent(qaSha)}-${viewport.name}-${Date.now()}#verified-outcomes`;
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    const section = page.locator('#verified-outcomes');
    await section.waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForTimeout(javaScriptEnabled ? 1200 : 700);

    const anchor = await page.evaluate(() => {
      const sectionElement = document.getElementById('verified-outcomes');
      const sectionRectangle = sectionElement.getBoundingClientRect();
      const fixedLayers = [...document.querySelectorAll('.global-header, .chapter-nav')]
        .map((element) => {
          const style = getComputedStyle(element);
          const rectangle = element.getBoundingClientRect();
          return {
            className: element.className,
            position: style.position,
            visible: style.display !== 'none' && style.visibility !== 'hidden' && rectangle.width > 0 && rectangle.height > 0,
            top: rectangle.top,
            bottom: rectangle.bottom,
            height: rectangle.height,
          };
        })
        .filter((item) => item.visible && (item.position === 'fixed' || item.position === 'sticky'));
      const requiredTop = fixedLayers.reduce((maximum, item) => Math.max(maximum, item.bottom), 0);
      return {
        sectionTop: sectionRectangle.top,
        requiredTop,
        fixedLayers,
        clear: sectionRectangle.top >= requiredTop - 2,
      };
    });

    report.anchorChecks.push({
      language: language.code,
      viewport: viewport.name,
      javaScriptEnabled,
      ...anchor,
    });

    if (!anchor.clear) {
      report.failures.push({
        type: 'anchor-overlap',
        language: language.code,
        viewport: viewport.name,
        javaScriptEnabled,
        sectionTop: anchor.sectionTop,
        requiredTop: anchor.requiredTop,
      });
    }

    await page.addStyleTag({
      content: `
        html { scroll-padding-top: 0 !important; }
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          scroll-behavior: auto !important;
        }
        .global-header,
        .chapter-nav,
        .skip-link,
        .continuum-rail,
        #chatbase-bubble-button,
        #chatbase-bubble-window {
          display: none !important;
        }
      `,
    });

    await section.scrollIntoViewIfNeeded();
    await page.evaluate(() => document.getElementById('verified-outcomes').scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(300);

    const images = page.locator('#verified-outcomes .gsc-evidence img');
    await images.evaluateAll(async (nodes) => {
      await Promise.all(nodes.map(async (node) => {
        try { await node.decode(); } catch {}
      }));
    });

    const suffix = javaScriptEnabled ? 'clean' : 'clean-nojs';
    const screenshot = `${language.code}-${viewport.name}-${suffix}.png`;
    await section.screenshot({
      path: path.join(outputDirectory, screenshot),
      animations: 'disabled',
    });

    report.captures.push({
      language: language.code,
      viewport,
      javaScriptEnabled,
      httpStatus: response?.status() ?? null,
      screenshot,
    });

    if (!response || response.status() !== 200) {
      report.failures.push({
        type: 'http',
        language: language.code,
        viewport: viewport.name,
        javaScriptEnabled,
        status: response?.status() ?? null,
      });
    }
  } finally {
    await context.close();
  }
}

try {
  for (const language of languages) {
    for (const viewport of viewports) {
      await capture(language, viewport, true);
      if (noJavaScriptViewports.has(viewport.name)) {
        await capture(language, viewport, false);
      }
    }
  }
} finally {
  await browser.close();
}

report.summary = {
  captures: report.captures.length,
  anchorChecks: report.anchorChecks.length,
  anchorPasses: report.anchorChecks.filter((item) => item.clear).length,
  failures: report.failures.length,
};

await fs.writeFile(path.join(outputDirectory, 'report.json'), JSON.stringify(report, null, 2));
await fs.writeFile(
  path.join(outputDirectory, 'REPORT.md'),
  [
    '# Financial Stream clean visual captures',
    '',
    `- Captures: ${report.summary.captures}`,
    `- Anchor checks: ${report.summary.anchorPasses}/${report.summary.anchorChecks} passed`,
    `- Failures: ${report.summary.failures}`,
  ].join('\n'),
);

console.log(JSON.stringify(report.summary, null, 2));
if (report.failures.length > 0) process.exitCode = 1;
