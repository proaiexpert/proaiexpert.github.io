import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const outputDirectory = process.env.QA_OUT || 'financial-stream-clean-captures-fast';
const qaSha = process.env.QA_SHA || 'unknown';
await fs.mkdir(outputDirectory, { recursive: true });

const languages = [
  { code: 'en', url: 'https://proai-expert.com/case-studies/financial-stream/' },
  { code: 'ru', url: 'https://proai-expert.com/ru/case-studies/financial-stream/' },
];

const viewports = [
  ['desktop-1920x1080', 1920, 1080],
  ['desktop-1600x900', 1600, 900],
  ['desktop-1440x900', 1440, 900],
  ['desktop-1366x768', 1366, 768],
  ['tablet-1024x768', 1024, 768],
  ['tablet-768x1024', 768, 1024],
  ['mobile-430x932', 430, 932],
  ['mobile-390x844', 390, 844],
  ['mobile-375x812', 375, 812],
  ['mobile-320x568', 320, 568],
  ['landscape-932x430', 932, 430],
  ['landscape-844x390', 844, 390],
  ['landscape-740x360', 740, 360],
];

const report = { generatedAt: new Date().toISOString(), qaSha, captures: [], failures: [] };
const browser = await chromium.launch({ headless: true });

try {
  for (const language of languages) {
    for (const [name, width, height] of viewports) {
      const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: 1,
        ignoreHTTPSErrors: true,
        locale: language.code === 'ru' ? 'ru-RU' : 'en-US',
      });
      const page = await context.newPage();

      try {
        const url = `${language.url}?clean-fast=${encodeURIComponent(qaSha)}-${name}-${Date.now()}#verified-outcomes`;
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        const section = page.locator('#verified-outcomes');
        await section.waitFor({ state: 'visible', timeout: 20000 });

        const anchor = await page.evaluate(() => {
          const sectionElement = document.getElementById('verified-outcomes');
          const sectionTop = sectionElement.getBoundingClientRect().top;
          const fixedLayers = [...document.querySelectorAll('.global-header, .chapter-nav')]
            .map((element) => {
              const style = getComputedStyle(element);
              const rectangle = element.getBoundingClientRect();
              return {
                position: style.position,
                display: style.display,
                visibility: style.visibility,
                width: rectangle.width,
                height: rectangle.height,
                bottom: rectangle.bottom,
              };
            })
            .filter((item) => item.display !== 'none' && item.visibility !== 'hidden' && item.width > 0 && item.height > 0 && (item.position === 'fixed' || item.position === 'sticky'));
          const requiredTop = fixedLayers.reduce((maximum, item) => Math.max(maximum, item.bottom), 0);
          return { sectionTop, requiredTop, clear: sectionTop >= requiredTop - 2 };
        });

        await page.addStyleTag({
          content: `
            html { scroll-padding-top: 0 !important; }
            *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
            .global-header, .chapter-nav, .skip-link, .continuum-rail, #chatbase-bubble-button, #chatbase-bubble-window { display: none !important; }
          `,
        });
        await page.evaluate(() => document.getElementById('verified-outcomes').scrollIntoView({ block: 'start' }));
        await page.waitForFunction(() => {
          const images = [...document.querySelectorAll('#verified-outcomes .gsc-evidence img')];
          return images.length === 2 && images.every((image) => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0);
        }, null, { timeout: 12000 }).catch(() => {});
        await page.waitForTimeout(250);

        const screenshot = `${language.code}-${name}-clean.png`;
        await section.screenshot({ path: path.join(outputDirectory, screenshot), animations: 'disabled' });

        const capture = {
          language: language.code,
          viewport: name,
          httpStatus: response?.status() ?? null,
          anchor,
          screenshot,
        };
        report.captures.push(capture);

        if (!response || response.status() !== 200 || !anchor.clear) {
          report.failures.push(capture);
        }
      } catch (error) {
        report.failures.push({ language: language.code, viewport: name, error: String(error?.stack || error) });
      } finally {
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
}

report.summary = {
  captures: report.captures.length,
  anchorPasses: report.captures.filter((item) => item.anchor?.clear).length,
  failures: report.failures.length,
};

await fs.writeFile(path.join(outputDirectory, 'report.json'), JSON.stringify(report, null, 2));
await fs.writeFile(path.join(outputDirectory, 'REPORT.md'), [
  '# Financial Stream clean captures — fast pass',
  '',
  `- Captures: ${report.summary.captures}/26`,
  `- Anchor checks: ${report.summary.anchorPasses}/${report.summary.captures}`,
  `- Failures: ${report.summary.failures}`,
].join('\n'));

console.log(JSON.stringify(report.summary, null, 2));
if (report.failures.length > 0) process.exitCode = 1;
