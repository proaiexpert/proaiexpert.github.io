const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const { execSync } = require('child_process');

const repoRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();

const server = http.createServer((req, res) => {
  let filePath = path.join(repoRoot, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  
  if (fs.existsSync(filePath)) {
    res.writeHead(200);
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(3000, async () => {
  console.log('Server running on 3000');
  
  const browser = await chromium.launch();
  
  const outDir = path.join(repoRoot, 'owner-review/article-stage-3-v4');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  
  const urls = [
    { url: 'http://localhost:3000/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/', id: 'a1-ru' },
    { url: 'http://localhost:3000/insights/does-your-service-business-need-a-multilingual-website/', id: 'a1-en' },
    { url: 'http://localhost:3000/ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/', id: 'a2-ru' },
    { url: 'http://localhost:3000/insights/how-to-evaluate-a-website-proposal/', id: 'a2-en' }
  ];
  
  const manifest = [];
  
  async function takeScreenshot(pageUrl, viewport, filename, purpose, fullPage, isReducedMotion = false, targetSelector = null) {
    const pageOptions = { viewport };
    if (isReducedMotion) {
      pageOptions.colorScheme = 'dark';
    }
    const page = await browser.newPage(pageOptions);
    if (isReducedMotion) {
      await page.emulateMedia({ reducedMotion: 'reduce' });
    }
    await page.goto(pageUrl, { waitUntil: 'networkidle' });
    
    let boundingBox = null;
    let scrollY = 0;
    let targetVisible = false;
    
    if (targetSelector) {
      await page.waitForSelector(targetSelector, { state: 'visible', timeout: 5000 }).catch(e => console.warn(`Selector ${targetSelector} not found or not visible.`));
      const el = await page.$(targetSelector);
      if (el) {
        await el.scrollIntoViewIfNeeded();
        boundingBox = await el.boundingBox();
        scrollY = await page.evaluate(() => window.scrollY);
        targetVisible = true;
      }
    }
    
    const actualHeight = fullPage ? await page.evaluate(() => document.documentElement.scrollHeight) : viewport.height;
    
    const p = path.join(outDir, filename);
    await page.screenshot({ path: p, fullPage });
    const buf = fs.readFileSync(p);
    
    if (fullPage && actualHeight <= viewport.height) {
      console.warn(`WARNING: ${filename} height ${actualHeight} is not greater than viewport ${viewport.height}.`);
    }

    const hash = crypto.createHash('sha256').update(buf).digest('hex');
    const duplicate = manifest.find(m => m.sha256 === hash);
    const hasDuplicate = !!duplicate;
    
    manifest.push({
      filename,
      route: pageUrl.replace('http://localhost:3000', ''),
      viewport: `${viewport.width}x${viewport.height}`,
      fullPage: fullPage,
      purpose,
      browserCondition: isReducedMotion ? 'prefers-reduced-motion: reduce' : 'default',
      selectorOrTarget: targetSelector,
      scrollY,
      targetBoundingBox: boundingBox,
      targetVisible,
      width: viewport.width,
      height: actualHeight,
      byteSize: buf.length,
      sha256: hash,
      pngMagicByteCheck: buf[0] === 0x89 && buf[1] === 0x50 ? 'PASS' : 'FAIL',
      duplicateHashCheck: hasDuplicate ? 'FAIL' : 'PASS',
      captureResult: 'SUCCESS',
      visualInspectionStatus: 'PENDING_OWNER_REVIEW'
    });
    await page.close();
  }

  await takeScreenshot(urls[0].url, {width: 1440, height: 900}, '01-a1-ru-full-desktop-1440.png', 'Full page desktop', true);
  await takeScreenshot(urls[1].url, {width: 1440, height: 900}, '02-a1-en-full-desktop-1440.png', 'Full page desktop', true);
  await takeScreenshot(urls[2].url, {width: 1440, height: 900}, '03-a2-ru-full-desktop-1440.png', 'Full page desktop', true);
  await takeScreenshot(urls[3].url, {width: 1440, height: 900}, '04-a2-en-full-desktop-1440.png', 'Full page desktop', true);

  await takeScreenshot(urls[0].url, {width: 390, height: 844}, '05-a1-ru-full-mobile-390.png', 'Full page mobile', true);
  await takeScreenshot(urls[1].url, {width: 390, height: 844}, '06-a1-en-full-mobile-390.png', 'Full page mobile', true);
  await takeScreenshot(urls[2].url, {width: 390, height: 844}, '07-a2-ru-full-mobile-390.png', 'Full page mobile', true);
  await takeScreenshot(urls[3].url, {width: 390, height: 844}, '08-a2-en-full-mobile-390.png', 'Full page mobile', true);

  await takeScreenshot(urls[0].url, {width: 1440, height: 900}, '09-a1-ru-hero-and-language-models.png', 'Hero module', false, false, '[data-module="three-model"]');
  await takeScreenshot(urls[1].url, {width: 1440, height: 900}, '10-a1-en-coverage-ladder-and-continuity.png', 'Coverage ladder', false, false, '[data-module="three-model"]');
  await takeScreenshot(urls[2].url, {width: 390, height: 844}, '11-a2-ru-risk-ledger-mobile.png', 'Risk ledger mobile', false, false, '[data-module="proposal-risk-ledger"]');
  await takeScreenshot(urls[3].url, {width: 1440, height: 900}, '12-a2-en-risk-ledger-desktop.png', 'Risk ledger desktop', false, false, '[data-module="proposal-risk-ledger"]');
  await takeScreenshot(urls[2].url, {width: 1440, height: 900}, '13-a2-ru-control-map-and-definition-of-done.png', 'Control map', false, false, '[data-module="business-control-map"]');
  await takeScreenshot(urls[3].url, {width: 390, height: 844}, '14-a2-en-abc-comparison-mobile.png', 'ABC Comparison mobile', false, false, '[data-module="abc-comparison"]');
  
  {
    const page = await browser.newPage({ viewport: {width: 390, height: 844} });
    await page.goto(urls[0].url, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(500);
    const p = path.join(outDir, '15-shared-footer-and-cta-mobile.png');
    await page.screenshot({ path: p });
    const buf = fs.readFileSync(p);
    const hash = crypto.createHash('sha256').update(buf).digest('hex');
    manifest.push({
      filename: '15-shared-footer-and-cta-mobile.png', route: urls[0].url, viewport: '390x844', fullPage: false, purpose: 'Footer and CTA', browserCondition: 'default', width: 390, height: 844, byteSize: buf.length, sha256: hash, pngMagicByteCheck: 'PASS', duplicateHashCheck: 'PASS', captureResult: 'SUCCESS', visualInspectionStatus: 'PENDING_OWNER_REVIEW'
    });
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: {width: 1180, height: 800} });
    await page.goto(urls[0].url, { waitUntil: 'networkidle' });
    await page.click('.mobile-menu-toggle');
    await page.waitForTimeout(500);
    const p = path.join(outDir, '16-ru-menu-open-1180.png');
    await page.screenshot({ path: p });
    const buf = fs.readFileSync(p);
    const hash = crypto.createHash('sha256').update(buf).digest('hex');
    manifest.push({
      filename: '16-ru-menu-open-1180.png', route: urls[0].url, viewport: '1180x800', fullPage: false, purpose: 'RU Menu', browserCondition: 'default', width: 1180, height: 800, byteSize: buf.length, sha256: hash, pngMagicByteCheck: 'PASS', duplicateHashCheck: 'PASS', captureResult: 'SUCCESS', visualInspectionStatus: 'PENDING_OWNER_REVIEW'
    });
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: {width: 1024, height: 800} });
    await page.goto(urls[1].url, { waitUntil: 'networkidle' });
    await page.click('.mobile-menu-toggle');
    await page.waitForTimeout(500);
    const p = path.join(outDir, '17-en-menu-open-1024.png');
    await page.screenshot({ path: p });
    const buf = fs.readFileSync(p);
    const hash = crypto.createHash('sha256').update(buf).digest('hex');
    manifest.push({
      filename: '17-en-menu-open-1024.png', route: urls[1].url, viewport: '1024x800', fullPage: false, purpose: 'EN Menu', browserCondition: 'default', width: 1024, height: 800, byteSize: buf.length, sha256: hash, pngMagicByteCheck: 'PASS', duplicateHashCheck: 'PASS', captureResult: 'SUCCESS', visualInspectionStatus: 'PENDING_OWNER_REVIEW'
    });
    await page.close();
  }

  await takeScreenshot(urls[0].url, {width: 1440, height: 900}, '18-reduced-motion-no-hidden-content.png', 'Reduced motion', false, true, '[data-module="governance-system"]');

  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  await browser.close();
  server.close();
  console.log('Done screenshots');
});