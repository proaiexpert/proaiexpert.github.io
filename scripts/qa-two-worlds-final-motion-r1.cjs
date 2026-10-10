/* Local browser evidence only. Does not modify the candidate runtime. */
const { chromium } = require(process.env.TW_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('fs');
const path = require('path');

const base = 'http://preview.local/owner-preview/two-worlds-final-motion-r1';
const root = path.resolve(__dirname, '..');
const out = path.resolve(__dirname, '../../qa-artifacts');
fs.mkdirSync(out, { recursive: true });

async function serve(context) {
  await context.route('http://preview.local/**', async route => {
    const url = new URL(route.request().url());
    const pathname = decodeURIComponent(url.pathname);
    let file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep)) return route.abort();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: 'Not found' });
    const extension = path.extname(file).toLowerCase();
    const contentType = ({ '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' })[extension] || 'application/octet-stream';
    return route.fulfill({ status: 200, contentType, body: fs.readFileSync(file) });
  });
}

async function frame(page) {
  return page.evaluate(() => {
    const section = document.querySelector('[data-tw-r5]');
    const viewport = section.querySelector('[data-tw-viewport]');
    const fold = section.querySelector('[data-tw-fold]');
    const ai = section.querySelector('[data-tw-world="ai"]');
    const web = section.querySelector('[data-tw-world="web"]');
    const experience = section.querySelector('[data-tw-experience]');
    const rect = node => {
      const r = node.getBoundingClientRect();
      return { left: +r.left.toFixed(2), right: +r.right.toFixed(2), width: +r.width.toFixed(2) };
    };
    const style = node => {
      const s = getComputedStyle(node);
      return { clip: s.clipPath, transform: s.transform, duration: s.transitionDuration, delay: s.transitionDelay, visibility: s.visibility };
    };
    return {
      focus: section.dataset.focus, state: section.dataset.r5State,
      scrollY: +scrollY.toFixed(2), viewport: rect(viewport), experienceHeight: +experience.getBoundingClientRect().height.toFixed(2),
      fold: { rect: rect(fold), style: style(fold), inlineTransform: fold.style.transform },
      ai: { rect: rect(ai), style: style(ai) }, web: { rect: rect(web), style: style(web) },
      snapshot: window.__twR5Snapshot?.()[0],
    };
  });
}

async function desktop(browser, variant, width, height, records) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  await serve(context);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`${base}/${variant}/en/`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.__twR5Snapshot === 'function');
  await page.evaluate(() => document.querySelector('[data-tw-experience]').scrollIntoView());
  await page.waitForTimeout(1000);
  const box = await page.locator('[data-tw-viewport]').boundingBox();
  const y = Math.max(2, Math.min(height - 2, box.y + Math.min(box.height, height) * .54));
  const targets = { neutral: .50, ai: .30, web: .70 };
  const paths = [
    ['neutral', 'ai'], ['ai', 'neutral'], ['neutral', 'web'],
    ['web', 'neutral'], ['ai', 'web'], ['web', 'ai'],
  ];
  for (const [start, end] of paths) {
    await page.mouse.move(box.x + box.width * targets[start], y);
    await page.waitForTimeout(800);
    await page.mouse.move(box.x + box.width * targets[end], y);
    const samples = [];
    for (const [i, t] of [0, 110, 260, 430, 660, 790].entries()) {
      if (i) await page.waitForTimeout(t - [0, 110, 260, 430, 660, 790][i - 1]);
      samples.push({ t, ...await frame(page) });
      if (width === 1440 && ['neutral>ai', 'ai>web', 'web>ai'].includes(`${start}>${end}`) && [110, 260, 430, 660].includes(t)) {
        await page.screenshot({ path: path.join(out, `${variant}-${width}-${start}-${end}-${t}.png`) });
      }
    }
    records.push({ kind: 'desktop', variant, width, height, path: `${start}>${end}`, samples });
  }
  records.push({ kind: 'desktop-errors', variant, width, errors });
  await context.close();
}

async function mobile(browser, variant, width, height, records) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await serve(context);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`${base}/${variant}/en/`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.__twR5Snapshot === 'function');
  const pos = await page.evaluate(() => {
    const e = document.querySelector('[data-tw-experience]');
    const v = document.querySelector('[data-tw-viewport]');
    return { top: e.getBoundingClientRect().top + scrollY, travel: e.getBoundingClientRect().height - v.getBoundingClientRect().height };
  });
  const samples = [];
  const qs = [0, .20, .24, .27, .35, .44, .50, .58, .64, .72, .80, 1, 1.1, .72, .5, .26, 0];
  for (const [i, q] of qs.entries()) {
    await page.evaluate(y => scrollTo(0, y), pos.top + q * pos.travel);
    await page.waitForTimeout(100);
    const snap = await frame(page);
    samples.push({ q, ...snap });
    if ([.24, .44, .58, .72, 1, 1.1].includes(q)) {
      await page.screenshot({ path: path.join(out, `${variant}-${width}x${height}-${i}-${String(q).replace('.', 'p')}.png`) });
    }
  }
  records.push({ kind: 'mobile', variant, width, height, pos, samples, errors });
  await context.close();
}

async function smoke(browser, variant, lang, width, height, mobileMode) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: mobileMode, hasTouch: mobileMode });
  await serve(context);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`${base}/${variant}/${lang}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.__twR5Snapshot === 'function');
  const start = await page.evaluate(() => {
    const section = document.querySelector('[data-tw-r5]');
    const e = section.querySelector('[data-tw-experience]');
    const v = section.querySelector('[data-tw-viewport]');
    return { top: e.getBoundingClientRect().top + scrollY, travel: e.getBoundingClientRect().height - v.getBoundingClientRect().height };
  });
  let result = { variant, lang, width, height, mobileMode, start, errors };
  if (mobileMode) {
    for (const q of [0, .24, .5, .72, 1, 1.1, .5, 0]) {
      await page.evaluate(y => scrollTo(0, y), start.top + q * start.travel);
      await page.waitForTimeout(90);
      const f = await frame(page);
      (result.states ||= []).push({ q, state: f.state, focus: f.focus, snapshot: f.snapshot, foldVisibility: f.fold.style.visibility, aiVisibility: f.ai.style.visibility, webVisibility: f.web.style.visibility });
    }
    await page.evaluate(y => scrollTo(0, y), start.top + .5 * start.travel);
    await page.waitForTimeout(120);
    const before = await frame(page);
    await page.setViewportSize({ width: height > width ? 852 : 393, height: height > width ? 390 : 750 });
    await page.waitForTimeout(350);
    const after = await frame(page);
    result.orientation = { before: before.snapshot, after: after.snapshot };
    result.technologyExists = await page.locator('[data-home-tech-fold-flow]').count();
  } else {
    await page.evaluate(() => document.querySelector('[data-tw-experience]').scrollIntoView());
    await page.locator('[data-tw-world="ai"] .tw-r2__cta').focus();
    result.aiKeyboardFocus = await page.locator('[data-tw-r5]').getAttribute('data-focus');
    await page.locator('[data-tw-world="web"] .tw-r2__cta').focus();
    result.webKeyboardFocus = await page.locator('[data-tw-r5]').getAttribute('data-focus');
  }
  await context.close();
  return result;
}

async function reducedSmoke(browser, lang) {
  const context = await browser.newContext({ viewport: { width: 393, height: 750 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  await serve(context);
  const page = await context.newPage();
  await page.goto(`${base}/m1/${lang}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.__twR5Snapshot === 'function');
  const result = await page.evaluate(() => {
    const section = document.querySelector('[data-tw-r5]');
    const ai = section.querySelector('[data-tw-world="ai"]');
    const web = section.querySelector('[data-tw-world="web"]');
    return { lang: document.documentElement.lang, state: section.dataset.r5State, viewportPosition: getComputedStyle(section.querySelector('[data-tw-viewport]')).position, aiHidden: ai.getAttribute('aria-hidden'), webHidden: web.getAttribute('aria-hidden') };
  });
  await context.close();
  return result;
}

async function perf(browser, variant, width, height) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await serve(context);
  const page = await context.newPage();
  await page.goto(`${base}/${variant}/en/`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.__twR5Snapshot === 'function');
  const position = await page.evaluate(() => {
    const e = document.querySelector('[data-tw-experience]');
    const v = document.querySelector('[data-tw-viewport]');
    return { top: e.getBoundingClientRect().top + scrollY, travel: e.getBoundingClientRect().height - v.getBoundingClientRect().height };
  });
  await page.evaluate(y => scrollTo(0, y), position.top + position.travel * .37);
  await page.waitForTimeout(200);
  const data = await page.evaluate(async () => {
    const fold = document.querySelector('[data-tw-fold]');
    const raf = () => new Promise(resolve => requestAnimationFrame(resolve));
    const x = () => +(/translate3d\((-?[\d.]+)px/.exec(fold.style.transform)?.[1] || 0);
    await raf(); await raf();
    const frames = [];
    let lastTime = performance.now();
    let lastX = x();
    for (let i = 0; i < 65; i++) {
      scrollBy(0, 1);
      await raf(); await raf();
      const now = performance.now();
      const currentX = x();
      frames.push({ dt: now - lastTime, dx: currentX - lastX });
      lastTime = now;
      lastX = currentX;
    }
    return { frames, scrollY, snapshot: window.__twR5Snapshot()[0] };
  });
  const beforeFast = await page.evaluate(() => +(/translate3d\((-?[\d.]+)px/.exec(document.querySelector('[data-tw-fold]').style.transform)?.[1] || 0));
  await page.evaluate(() => scrollBy(0, 30));
  await page.waitForTimeout(100);
  const afterFast = await page.evaluate(() => +(/translate3d\((-?[\d.]+)px/.exec(document.querySelector('[data-tw-fold]').style.transform)?.[1] || 0));
  const movement = data.frames.map(f => Math.abs(f.dx)).filter(Boolean);
  const intervals = data.frames.map(f => f.dt);
  const result = {
    variant, width, height,
    visualUpdates: movement.length, frames: data.frames.length,
    maxVisualStep: Math.max(...movement), averageVisualStep: movement.reduce((a, b) => a + b, 0) / movement.length,
    meanFrameInterval: intervals.reduce((a, b) => a + b, 0) / intervals.length,
    maxFrameInterval: Math.max(...intervals), intervalsOver50ms: intervals.filter(dt => dt > 50).length,
    fast30pxDx: afterFast - beforeFast, scrollY: data.scrollY, snapshot: data.snapshot,
  };
  await context.close();
  return result;
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.TW_CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  if (process.argv.includes('--perf')) {
    const results = [];
    for (const variant of ['m0', 'm1']) for (const [width, height] of [[393, 750], [852, 390]]) results.push(await perf(browser, variant, width, height));
    fs.writeFileSync(path.join(out, 'perf-records.json'), JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results));
    await browser.close();
    return;
  }
  if (process.argv.includes('--smoke')) {
    const results = [];
    for (const variant of ['d0', 'd1']) for (const lang of ['en', 'ru']) results.push(await smoke(browser, variant, lang, 1440, 900, false));
    for (const variant of ['m0', 'm1']) for (const lang of ['en', 'ru']) results.push(await smoke(browser, variant, lang, 393, 750, true));
    for (const lang of ['en', 'ru']) results.push({ reduced: await reducedSmoke(browser, lang) });
    fs.writeFileSync(path.join(out, 'smoke-records.json'), JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results.map(r => ({ variant: r.variant, lang: r.lang, size: `${r.width}x${r.height}`, errors: r.errors?.length || 0, reduced: r.reduced?.state }))));
    await browser.close();
    return;
  }
  const records = [];
  for (const variant of ['d0', 'd1']) {
    for (const [width, height] of [[1280, 800], [1440, 900], [1920, 1080]]) await desktop(browser, variant, width, height, records);
  }
  for (const variant of ['m0', 'm1']) {
    for (const [width, height] of [[393, 750], [852, 390]]) await mobile(browser, variant, width, height, records);
  }
  fs.writeFileSync(path.join(out, 'qa-records.json'), JSON.stringify(records, null, 2));
  console.log(JSON.stringify(records.map(r => ({ kind: r.kind, variant: r.variant, size: `${r.width}x${r.height}`, path: r.path, errors: r.errors?.length || 0 }))));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
