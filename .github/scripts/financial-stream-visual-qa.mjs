import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const outputDirectory = process.env.QA_OUT || 'financial-stream-visual-qa';
const qaSha = process.env.QA_SHA || 'unknown';
await fs.mkdir(outputDirectory, { recursive: true });

const languages = [
  {
    code: 'en',
    url: 'https://proai-expert.com/case-studies/financial-stream/',
    markers: ['57 clicks', '7.24K impressions', '50 indexed pages', '13 not indexed'],
  },
  {
    code: 'ru',
    url: 'https://proai-expert.com/ru/case-studies/financial-stream/',
    markers: ['57 кликов', '7,24 тыс. показов', '50 проиндексированных', '13 не проиндексированы'],
  },
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
  liveOrigin: 'https://proai-expert.com',
  visualCases: [],
  noJavaScriptCases: [],
  failures: [],
};

const browser = await chromium.launch({ headless: true });

function buildUrl(baseUrl, mode, viewportName) {
  return `${baseUrl}?${mode}=${encodeURIComponent(qaSha)}-${viewportName}-${Date.now()}`;
}

async function disableMotion(page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        scroll-behavior: auto !important;
        caret-color: transparent !important;
      }
    `,
  });
}

async function waitForEvidenceImages(page) {
  const images = page.locator('#verified-outcomes .gsc-evidence img');
  await images.evaluateAll(async (nodes) => {
    await Promise.all(nodes.map(async (node) => {
      if (!node.complete) {
        await new Promise((resolve) => {
          node.addEventListener('load', resolve, { once: true });
          node.addEventListener('error', resolve, { once: true });
        });
      }
      try {
        await node.decode();
      } catch {
        // Captured by the natural-size assertions below.
      }
    }));
  });
}

async function inspectVisualCase(language, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.dpr,
    ignoreHTTPSErrors: true,
    locale: language.code === 'ru' ? 'ru-RU' : 'en-US',
  });
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', (error) => pageErrors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  try {
    const response = await page.goto(buildUrl(language.url, 'visual-qa', viewport.name), {
      waitUntil: 'domcontentloaded',
      timeout: 90000,
    });
    await disableMotion(page);

    const section = page.locator('#verified-outcomes');
    await section.waitFor({ state: 'visible', timeout: 30000 });
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    await waitForEvidenceImages(page);

    const diagnostics = await page.evaluate((markers) => {
      const root = document.documentElement;
      const bodyText = document.body.innerText;
      const figures = [...document.querySelectorAll('#verified-outcomes .gsc-evidence')];
      const images = [...document.querySelectorAll('#verified-outcomes .gsc-evidence img')];
      const links = [...document.querySelectorAll('#verified-outcomes .gsc-evidence figcaption a')];
      const overflowSelectors = [
        '#verified-outcomes',
        '#verified-outcomes .outcomes-grid',
        '#verified-outcomes .evidence-records',
        '#verified-outcomes .gsc-evidence',
        '#verified-outcomes .gsc-evidence figcaption',
        '#verified-outcomes .gsc-evidence .record-value',
        '#verified-outcomes .gsc-evidence .eyebrow',
        '#verified-outcomes .limitation',
      ];

      const overflowElements = overflowSelectors.flatMap((selector) =>
        [...document.querySelectorAll(selector)].map((element) => ({
          selector,
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
          overflow: element.scrollWidth > element.clientWidth + 2,
          sample: (element.textContent || '').trim().slice(0, 100),
        })),
      ).filter((item) => item.overflow);

      const imageDetails = images.map((image) => {
        const rectangle = image.getBoundingClientRect();
        const naturalRatio = image.naturalWidth / image.naturalHeight;
        const renderedRatio = rectangle.width / rectangle.height;
        const style = getComputedStyle(image);
        return {
          currentSrc: image.currentSrc,
          complete: image.complete,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          rectangle: {
            left: rectangle.left,
            right: rectangle.right,
            top: rectangle.top,
            bottom: rectangle.bottom,
            width: rectangle.width,
            height: rectangle.height,
          },
          objectFit: style.objectFit,
          aspectDelta: Number.isFinite(naturalRatio) && Number.isFinite(renderedRatio)
            ? Math.abs(naturalRatio - renderedRatio)
            : null,
          horizontalWithinViewport: rectangle.left >= -1 && rectangle.right <= window.innerWidth + 1,
        };
      });

      const linkDetails = links.map((link) => {
        const rectangle = link.getBoundingClientRect();
        const style = getComputedStyle(link);
        link.focus();
        return {
          href: link.href,
          visible: rectangle.width > 0 && rectangle.height > 0 && style.visibility !== 'hidden' && style.display !== 'none',
          focusable: document.activeElement === link,
          pointerEvents: style.pointerEvents,
          rectangle: { width: rectangle.width, height: rectangle.height },
        };
      });

      return {
        title: document.title,
        documentLanguage: document.documentElement.lang,
        markerResults: markers.map((marker) => ({ marker, found: bodyText.includes(marker) })),
        innerWidth: window.innerWidth,
        documentScrollWidth: root.scrollWidth,
        horizontalOverflow: root.scrollWidth > window.innerWidth + 1,
        figureCount: figures.length,
        imageDetails,
        linkDetails,
        overflowElements,
      };
    }, language.markers);

    const issues = [];
    if (!response || response.status() !== 200) issues.push(`HTTP status ${response?.status() ?? 'no response'}`);
    if (diagnostics.horizontalOverflow) issues.push(`document horizontal overflow ${diagnostics.documentScrollWidth} > ${diagnostics.innerWidth}`);
    if (diagnostics.figureCount !== 2) issues.push(`expected two evidence figures, found ${diagnostics.figureCount}`);
    for (const marker of diagnostics.markerResults) {
      if (!marker.found) issues.push(`missing marker: ${marker.marker}`);
    }
    diagnostics.imageDetails.forEach((image, index) => {
      if (!image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0) issues.push(`image ${index + 1} did not decode`);
      if (!image.horizontalWithinViewport) issues.push(`image ${index + 1} extends outside viewport`);
      if (image.aspectDelta === null || image.aspectDelta > 0.03) issues.push(`image ${index + 1} aspect ratio changed`);
      if (image.objectFit === 'cover') issues.push(`image ${index + 1} uses object-fit: cover`);
    });
    diagnostics.linkDetails.forEach((link, index) => {
      if (!link.visible) issues.push(`full-size link ${index + 1} is not visible`);
      if (!link.focusable) issues.push(`full-size link ${index + 1} is not keyboard focusable`);
      if (link.pointerEvents === 'none') issues.push(`full-size link ${index + 1} blocks pointer interaction`);
    });
    if (diagnostics.overflowElements.length > 0) issues.push(`${diagnostics.overflowElements.length} evidence elements overflow horizontally`);
    if (pageErrors.length > 0) issues.push(`${pageErrors.length} uncaught page errors`);

    const evidenceScreenshot = `${language.code}-${viewport.name}-evidence.png`;
    await section.screenshot({
      path: path.join(outputDirectory, evidenceScreenshot),
      animations: 'disabled',
    });

    let viewportScreenshot = null;
    if (viewport.name === 'desktop-1440x900' || viewport.name === 'mobile-390x844') {
      viewportScreenshot = `${language.code}-${viewport.name}-viewport.png`;
      await page.screenshot({
        path: path.join(outputDirectory, viewportScreenshot),
        fullPage: false,
        animations: 'disabled',
      });
    }

    return {
      language: language.code,
      viewport,
      url: page.url(),
      httpStatus: response?.status() ?? null,
      diagnostics,
      pageErrors,
      consoleErrors,
      issues,
      evidenceScreenshot,
      viewportScreenshot,
      passed: issues.length === 0,
    };
  } finally {
    await context.close();
  }
}

async function inspectNoJavaScriptCase(language, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.dpr,
    javaScriptEnabled: false,
    ignoreHTTPSErrors: true,
    locale: language.code === 'ru' ? 'ru-RU' : 'en-US',
  });
  const page = await context.newPage();

  try {
    const response = await page.goto(buildUrl(language.url, 'visual-qa-nojs', viewport.name), {
      waitUntil: 'domcontentloaded',
      timeout: 90000,
    });
    const section = page.locator('#verified-outcomes');
    await section.waitFor({ state: 'visible', timeout: 30000 });
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const diagnostics = await page.evaluate((markers) => {
      const bodyText = document.body.innerText;
      return {
        markersPresent: markers.every((marker) => bodyText.includes(marker)),
        figureCount: document.querySelectorAll('#verified-outcomes .gsc-evidence').length,
        imageCount: document.querySelectorAll('#verified-outcomes .gsc-evidence img').length,
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      };
    }, language.markers);

    const issues = [];
    if (!response || response.status() !== 200) issues.push(`HTTP status ${response?.status() ?? 'no response'}`);
    if (!diagnostics.markersPresent) issues.push('current evidence markers missing with JavaScript disabled');
    if (diagnostics.figureCount !== 2 || diagnostics.imageCount !== 2) issues.push('evidence figures missing with JavaScript disabled');
    if (diagnostics.horizontalOverflow) issues.push('horizontal overflow with JavaScript disabled');

    const screenshot = `${language.code}-${viewport.name}-nojs-evidence.png`;
    await section.screenshot({
      path: path.join(outputDirectory, screenshot),
      animations: 'disabled',
    });

    return {
      language: language.code,
      viewport,
      url: page.url(),
      httpStatus: response?.status() ?? null,
      diagnostics,
      issues,
      screenshot,
      passed: issues.length === 0,
    };
  } finally {
    await context.close();
  }
}

try {
  for (const language of languages) {
    for (const viewport of viewports) {
      try {
        const visualCase = await inspectVisualCase(language, viewport);
        report.visualCases.push(visualCase);
        if (!visualCase.passed) {
          report.failures.push({
            type: 'visual',
            language: language.code,
            viewport: viewport.name,
            issues: visualCase.issues,
          });
        }
      } catch (error) {
        const failure = {
          type: 'visual-exception',
          language: language.code,
          viewport: viewport.name,
          issues: [String(error?.stack || error)],
        };
        report.failures.push(failure);
        report.visualCases.push({ language: language.code, viewport, passed: false, issues: failure.issues });
      }

      if (noJavaScriptViewports.has(viewport.name)) {
        try {
          const noJavaScriptCase = await inspectNoJavaScriptCase(language, viewport);
          report.noJavaScriptCases.push(noJavaScriptCase);
          if (!noJavaScriptCase.passed) {
            report.failures.push({
              type: 'no-javascript',
              language: language.code,
              viewport: viewport.name,
              issues: noJavaScriptCase.issues,
            });
          }
        } catch (error) {
          const failure = {
            type: 'no-javascript-exception',
            language: language.code,
            viewport: viewport.name,
            issues: [String(error?.stack || error)],
          };
          report.failures.push(failure);
          report.noJavaScriptCases.push({ language: language.code, viewport, passed: false, issues: failure.issues });
        }
      }
    }
  }
} finally {
  await browser.close();
}

report.summary = {
  totalVisualCases: report.visualCases.length,
  passedVisualCases: report.visualCases.filter((item) => item.passed).length,
  totalNoJavaScriptCases: report.noJavaScriptCases.length,
  passedNoJavaScriptCases: report.noJavaScriptCases.filter((item) => item.passed).length,
  failureCount: report.failures.length,
};

await fs.writeFile(path.join(outputDirectory, 'report.json'), JSON.stringify(report, null, 2));

const markdown = [
  '# Financial Stream live visual QA',
  '',
  `- Generated: ${report.generatedAt}`,
  `- QA SHA: ${qaSha}`,
  `- Visual cases: ${report.summary.passedVisualCases}/${report.summary.totalVisualCases} passed`,
  `- JavaScript-disabled cases: ${report.summary.passedNoJavaScriptCases}/${report.summary.totalNoJavaScriptCases} passed`,
  `- Failures: ${report.summary.failureCount}`,
  '',
];

if (report.failures.length > 0) {
  markdown.push('## Failures', '');
  for (const failure of report.failures) {
    markdown.push(`- ${failure.language} · ${failure.viewport} · ${failure.type}: ${failure.issues.join('; ')}`);
  }
} else {
  markdown.push('All automated live visual checks passed. Screenshots still require human review before release sign-off.');
}

await fs.writeFile(path.join(outputDirectory, 'REPORT.md'), markdown.join('\n'));
console.log(JSON.stringify(report.summary, null, 2));

if (report.failures.length > 0) {
  process.exitCode = 1;
}
