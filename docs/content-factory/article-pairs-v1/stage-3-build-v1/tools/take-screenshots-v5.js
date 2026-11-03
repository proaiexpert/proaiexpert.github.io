const crypto = require('crypto');
const { chromium } = require('playwright');
const { fs, path, repoRoot, startServer, gitSha, normalizeText } = require('./stage3-utils');
const { routeById } = require('./stage3-config');

const outputDir = process.env.STAGE3_REVIEW_DIR || path.join(repoRoot, 'owner-review/article-stage-3-v5');
fs.mkdirSync(outputDir, { recursive: true });
const testedSha = gitSha();

function pngInfo(filePath) {
  const buffer = fs.readFileSync(filePath);
  const signature = buffer.subarray(0, 8).toString('hex');
  const valid = signature === '89504e470d0a1a0a' && buffer.subarray(12, 16).toString('ascii') === 'IHDR';
  return { width: valid ? buffer.readUInt32BE(16) : null, height: valid ? buffer.readUInt32BE(20) : null,
    byteSize: buffer.length, sha256: crypto.createHash('sha256').update(buffer).digest('hex'), pngValidation: valid ? 'PASS' : 'FAIL' };
}

async function pageFor(browser, baseUrl, routeId, viewport, reducedMotion = 'no-preference') {
  const page = await browser.newPage({ viewport, reducedMotion });
  await page.route('https://fonts.googleapis.com/**', (request) => request.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  const route = routeById(routeId);
  const response = await page.goto(`${baseUrl}${route.route}`, { waitUntil: 'domcontentloaded' });
  if (!response || response.status() !== 200) throw new Error(`${routeId}: HTTP ${response && response.status()}`);
  await page.evaluate(() => document.fonts && document.fonts.ready);
  return { page, route };
}

async function boxes(page, selectorMap) {
  return page.evaluate((map) => {
    const viewport = { width: innerWidth, height: innerHeight };
    return map.map((item) => {
      const node = document.querySelector(item.actualSelector || item.selector);
      if (!node) return { selector: item.selector, headingText: item.headingText || null, found: false, box: null, intersectionRatio: 0 };
      const rect = node.getBoundingClientRect();
      const intersectionWidth = Math.max(0, Math.min(rect.right, viewport.width) - Math.max(rect.left, 0));
      const intersectionHeight = Math.max(0, Math.min(rect.bottom, viewport.height) - Math.max(rect.top, 0));
      const area = Math.max(1, rect.width * rect.height);
      return { selector: item.selector, headingText: item.headingText || null, found: true,
        box: { x: rect.x, y: rect.y, left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height },
        intersectionWidth, intersectionHeight, intersectionRatio: Number(((intersectionWidth * intersectionHeight) / area).toFixed(4)),
        actualText: String(node.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 240) };
    });
  }, selectorMap);
}

async function compose(page, selectorMap) {
  await page.evaluate((map) => {
    const sourceNodes = map.map((item) => document.querySelector(item.selector));
    if (sourceNodes.some((node) => !node)) throw new Error('Composition source selector missing');
    const stage = document.createElement('main'); stage.id = 'stage3-capture-composition';
    stage.style.cssText = 'width:min(1200px,calc(100% - 48px));margin:0 auto;padding:48px 0 64px;display:grid;gap:40px;';
    sourceNodes.forEach((node, index) => {
      const clone = node.cloneNode(true); clone.dataset.captureSource = String(index);
      clone.style.cssText += ';margin:0;width:100%;max-width:none;'; stage.appendChild(clone);
    });
    document.body.innerHTML = ''; document.body.appendChild(stage); document.body.className = 'page-article';
  }, selectorMap);
  const height = await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
  const current = page.viewportSize();
  await page.setViewportSize({ width: current.width, height: Math.min(Math.max(height, current.height), 12000) });
  return selectorMap.map((item, index) => ({ ...item, actualSelector: `[data-capture-source="${index}"]` }));
}

const captures = [];
const assertions = [];
async function save(page, definition, selectorMap, fullPage = false, locatorSelector = null) {
  const filePath = path.join(outputDir, definition.filename);
  const measurement = await boxes(page, selectorMap);
  const scrollY = await page.evaluate(() => window.scrollY);
  if (locatorSelector) await page.locator(locatorSelector).screenshot({ path: filePath, animations: 'disabled' });
  else await page.screenshot({ path: filePath, fullPage, animations: 'disabled' });
  const info = pngInfo(filePath);
  const targetVisible = measurement.every((item) => item.found && item.intersectionRatio >= (definition.minIntersection || 0.2));
  captures.push({ filename: definition.filename, route: routeById(definition.routeId).route, testedSha,
    viewport: page.viewportSize(), fullPage, purpose: definition.purpose,
    selectors: selectorMap.map((item) => item.selector), headings: selectorMap.map((item) => item.headingText).filter(Boolean),
    scrollY, boundingBoxes: measurement, intersectionRatio: measurement.map((item) => item.intersectionRatio), targetVisible,
    captureStrategy: definition.captureStrategy, actualPngWidth: info.width, actualPngHeight: info.height,
    byteSize: info.byteSize, sha256: info.sha256, pngValidation: info.pngValidation,
    duplicateResult: 'UNCHECKED', captureResult: targetVisible && info.pngValidation === 'PASS' ? 'PASS' : 'FAIL',
    visualInspectionStatus: 'PENDING_OWNER_REVIEW' });
  if (/^(09|10|11|12|13|14)-/.test(definition.filename)) {
    assertions.push({ filename: definition.filename, route: routeById(definition.routeId).route,
      requiredModules: definition.requiredModules, selectors: selectorMap.map((item) => item.selector),
      headingText: selectorMap.map((item) => item.headingText).filter(Boolean), scrollY,
      boundingBoxes: measurement, intersectionRatios: measurement.map((item) => item.intersectionRatio),
      targetVisibility: targetVisible, captureStrategy: definition.captureStrategy,
      status: targetVisible ? 'PASS' : 'FAIL' });
  }
}

(async () => {
  const { server, baseUrl } = await startServer();
  const browser = await chromium.launch({ headless: true });
  try {
    const full = [
      ['01-a1-ru-full-desktop-1440.png','A1-RU',1440,900], ['02-a1-en-full-desktop-1440.png','A1-EN',1440,900],
      ['03-a2-ru-full-desktop-1440.png','A2-RU',1440,900], ['04-a2-en-full-desktop-1440.png','A2-EN',1440,900],
      ['05-a1-ru-full-mobile-390.png','A1-RU',390,844], ['06-a1-en-full-mobile-390.png','A1-EN',390,844],
      ['07-a2-ru-full-mobile-390.png','A2-RU',390,844], ['08-a2-en-full-mobile-390.png','A2-EN',390,844]
    ];
    for (const [filename, routeId, width, height] of full) {
      const { page } = await pageFor(browser, baseUrl, routeId, { width, height });
      await save(page, { filename, routeId, purpose: 'Final full-page route review', captureStrategy: 'Natural full-page capture', minIntersection: 0.01 },
        [{ selector: '#main-content', headingText: routeById(routeId).h1 }], true); await page.close();
    }

    const compositions = [
      { filename:'09-a1-ru-hero-and-language-models.png', routeId:'A1-RU', width:1440, height:1200,
        purpose:'Hero and language-model relationship', requiredModules:['hero','three-model'],
        items:[{selector:'.premium-article-header',headingText:routeById('A1-RU').h1},{selector:'[data-module~="three-model"]',headingText:'Три модели сайта'}] },
      { filename:'10-a1-en-coverage-ladder-and-continuity.png', routeId:'A1-EN', width:1440, height:1200,
        purpose:'Coverage ladder and continuity relationship', requiredModules:['three-model','continuity-flow'],
        items:[{selector:'[data-module~="three-model"]',headingText:'The Language Coverage Ladder'},{selector:'[data-module~="continuity-flow"]',headingText:'Translate the customer journey before the content archive'}] },
      { filename:'13-a2-ru-control-map-and-definition-of-done.png', routeId:'A2-RU', width:1440, height:1200,
        purpose:'Business control map and Definition of Done relationship', requiredModules:['business-control-map','definition-of-done'],
        items:[{selector:'[data-module~="business-control-map"]',headingText:'Карта прав и практического контроля'},{selector:'[data-module~="definition-of-done"]',headingText:'6. Когда проект считается завершённым'}] }
    ];
    for (const item of compositions) {
      const { page } = await pageFor(browser, baseUrl, item.routeId, { width:item.width,height:item.height });
      const mapped = await compose(page, item.items);
      await save(page, { ...item, captureStrategy:'Deliberate vertical composition of cloned real rendered sections; no content redrawn or altered', minIntersection:0.9 }, mapped, false);
      await page.close();
    }

    const natural = [
      { filename:'11-a2-ru-risk-ledger-mobile.png',routeId:'A2-RU',width:390,height:1600,purpose:'Risk Ledger mobile proof',requiredModules:['proposal-risk-ledger'],
        module:'[data-module~="proposal-risk-ledger"]', items:[{selector:'[data-module~="proposal-risk-ledger"] h2',headingText:'Реестр рисков предложения'},{selector:'[data-module~="proposal-risk-ledger"] table',headingText:'Risk Ledger table'}] },
      { filename:'12-a2-en-risk-ledger-desktop.png',routeId:'A2-EN',width:1440,height:1200,purpose:'Risk Ledger desktop proof',requiredModules:['proposal-risk-ledger'],
        module:'[data-module~="proposal-risk-ledger"]', items:[{selector:'[data-module~="proposal-risk-ledger"] h2',headingText:'Build a Proposal Risk Ledger'},{selector:'[data-module~="proposal-risk-ledger"] table',headingText:'Risk Ledger table'}] },
      { filename:'14-a2-en-abc-comparison-mobile.png',routeId:'A2-EN',width:390,height:1600,purpose:'A/B/C normalized comparison mobile proof',requiredModules:['abc-comparison'],
        module:'[data-module~="abc-comparison"]', items:[{selector:'[data-module~="abc-comparison"] h2',headingText:'Compare normalized proposals'},{selector:'[data-module~="abc-comparison"] table',headingText:'A/B/C comparison table'}] }
    ];
    for (const item of natural) {
      const { page } = await pageFor(browser, baseUrl, item.routeId, { width:item.width,height:item.height });
      await page.locator(item.items[0].selector).scrollIntoViewIfNeeded();
      await page.evaluate((selector) => { const node=document.querySelector(selector); window.scrollTo(0, node.getBoundingClientRect().top+scrollY-110); }, item.items[0].selector);
      await save(page, { ...item, captureStrategy:'Natural page position aligned to the intended heading and first proof table', minIntersection:0.18 }, item.items, false);
      await page.close();
    }

    {
      const { page } = await pageFor(browser, baseUrl, 'A1-EN', { width:390,height:1000 });
      await page.locator('footer#contact').scrollIntoViewIfNeeded();
      await save(page,{filename:'15-shared-footer-and-cta-mobile.png',routeId:'A1-EN',purpose:'Shared footer and contact CTA on mobile',captureStrategy:'Natural footer element capture',minIntersection:0.01},[{selector:'footer#contact',headingText:'If you need the right next step'}],false,'footer#contact'); await page.close();
    }
    for (const menu of [
      {filename:'16-ru-menu-open-1180.png',routeId:'A1-RU',width:1180,height:800},
      {filename:'17-en-menu-open-1024.png',routeId:'A1-EN',width:1024,height:800}
    ]) {
      const { page } = await pageFor(browser, baseUrl, menu.routeId, {width:menu.width,height:menu.height});
      await page.locator('.mobile-menu-toggle').click(); await page.waitForTimeout(100);
      await save(page,{...menu,purpose:'Open production mobile navigation',captureStrategy:'Natural viewport after activating the real menu control',minIntersection:0.2},[{selector:'#site-navigation',headingText:'Open navigation'}],false); await page.close();
    }
    {
      const { page } = await pageFor(browser, baseUrl, 'A1-EN', {width:390,height:1200}, 'reduce');
      await page.locator('[data-module~="continuity-flow"]').scrollIntoViewIfNeeded();
      await page.evaluate(() => { const node=document.querySelector('[data-module~="continuity-flow"]');window.scrollTo(0,node.getBoundingClientRect().top+scrollY-100); });
      await save(page,{filename:'18-reduced-motion-no-hidden-content.png',routeId:'A1-EN',purpose:'Reduced-motion content preservation',captureStrategy:'Natural viewport with prefers-reduced-motion: reduce',minIntersection:0.15},[{selector:'[data-module~="continuity-flow"] h2',headingText:'Translate the customer journey before the content archive'}],false); await page.close();
    }
  } finally { await browser.close(); server.close(); }

  const hashes = captures.reduce((map, item) => { (map[item.sha256] ||= []).push(item.filename); return map; }, {});
  for (const item of captures) item.duplicateResult = hashes[item.sha256].length === 1 ? 'UNIQUE' : `DUPLICATE: ${hashes[item.sha256].join(', ')}`;
  const duplicateStatus = captures.every((item) => item.duplicateResult === 'UNIQUE') ? 'PASS' : 'FAIL';
  const manifest = { testedSha, generatedAt: new Date().toISOString(), screenshotCount: captures.length,
    duplicateHashResult: duplicateStatus, screenshots: captures,
    status: captures.length === 18 && duplicateStatus === 'PASS' && captures.every((item) => item.captureResult === 'PASS') ? 'PASS' : 'FAIL' };
  fs.writeFileSync(path.join(outputDir,'manifest.json'),`${JSON.stringify(manifest,null,2)}\n`);
  fs.writeFileSync(path.join(outputDir,'module-capture-assertions.json'),`${JSON.stringify({testedSha,generatedAt:new Date().toISOString(),assertions,status:assertions.length===6&&assertions.every((item)=>item.status==='PASS')?'PASS':'FAIL'},null,2)}\n`);
  const reduced = require(path.join(repoRoot,'docs/content-factory/article-pairs-v1/stage-3-build-v1/reduced-motion-report.json'));
  fs.writeFileSync(path.join(outputDir,'reduced-motion-computed-style.json'),`${JSON.stringify(reduced,null,2)}\n`);
  if (manifest.status !== 'PASS' || assertions.some((item)=>item.status!=='PASS')) {
    console.error(`Screenshot FAIL: count=${captures.length}, manifest=${manifest.status}, assertions=${assertions.filter((item)=>item.status!=='PASS').length}`); process.exit(1);
  }
  console.log(`Screenshots PASS: ${captures.length} PNGs, all unique, six module assertions PASS`);
})().catch((error) => { console.error(error); process.exit(1); });
