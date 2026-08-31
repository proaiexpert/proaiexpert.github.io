import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const out = 'docs/social-media/financial-stream-2026-08-07/screenshots';
await fs.mkdir(out, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });

async function settle(url) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
}

async function captureElement(file, selector) {
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await el.screenshot({ path: path.join(out, file), type: 'jpeg', quality: 88 });
}

async function captureAround(file, selector, topPad = 100, height = 1000) {
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  const box = await el.boundingBox();
  if (!box) throw new Error(`No box for ${selector}`);
  const fullHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const y = Math.max(0, box.y - topPad);
  const h = Math.min(height, fullHeight - y);
  await page.screenshot({
    path: path.join(out, file),
    type: 'jpeg',
    quality: 88,
    clip: { x: 0, y, width: 1440, height: h }
  });
}

const targets = [
  {
    locale: 'ru',
    about: 'https://financialstreamllc.com/ru/about/',
    article: 'https://financialstreamllc.com/ru/blog/buhgalteriya-ssha-malogo-biznesa.html',
    articleModel: 'h2[id*="контур-надежного-учета"]'
  },
  {
    locale: 'en',
    about: 'https://financialstreamllc.com/about/',
    article: 'https://financialstreamllc.com/blog/us-bookkeeping-small-business.html',
    articleModel: '#the-reliable-books-chain-six-control-points'
  }
];

for (const t of targets) {
  await settle(t.about);
  await captureElement(`01-about-hero-${t.locale}.jpg`, '.about-hero');
  await captureElement(`02-about-how-we-work-${t.locale}.jpg`, '#how-we-work');
  await captureElement(`03-about-proof-${t.locale}.jpg`, '[data-proof-strip]');

  await settle(t.article);
  await captureElement(`04-article-hero-${t.locale}.jpg`, '.flagship-hero');
  await captureAround(`05-article-author-toc-${t.locale}.jpg`, '.flagship-author', 80, 1150);
  await captureAround(`06-article-control-model-${t.locale}.jpg`, t.articleModel, 120, 1050);
}

await browser.close();
console.log('Captured Financial Stream social proof screenshots.');
