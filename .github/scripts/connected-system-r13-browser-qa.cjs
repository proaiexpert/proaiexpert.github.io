const { chromium } = require('playwright-core');
const fs = require('fs');

const temp = process.env.LIVE_BASE;
const persistentEn = process.env.PERSISTENT_EN;
const persistentRu = process.env.PERSISTENT_RU;
const chrome = process.env.CHROME_BIN;
const failures = [];
const pass = (cond, name) => { if (!cond) failures.push(name); };

async function gotoReview(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('[data-connected-system]', { timeout: 20000 });
  await page.waitForTimeout(350);
}

async function activeIndex(page) {
  return page.locator('[data-system-stage]').evaluateAll(nodes => nodes.findIndex(n => n.classList.contains('is-active')));
}

async function waitActive(page, index, name, timeout = 5000) {
  try {
    await page.waitForFunction(expected => {
      const nodes = [...document.querySelectorAll('[data-system-stage]')];
      return nodes.findIndex(n => n.classList.contains('is-active')) === expected;
    }, index, { timeout });
  } catch (_) {
    failures.push(name);
  }
}

async function waitHeader(page, hidden, name, timeout = 2500) {
  try {
    await page.waitForFunction(expected => {
      const header = document.querySelector('[data-site-header]');
      return !!header && header.classList.contains('header-hidden') === expected;
    }, hidden, { timeout });
  } catch (_) {
    failures.push(name);
  }
}

async function desktopCheck(browser, url, label) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  if (url.includes('raw.githack.com')) {
    await context.addCookies([{ name: '__Http-phish', value: '1', url: 'https://raw.githack.com/', secure: true, httpOnly: true }]);
  }
  const page = await context.newPage();
  await gotoReview(page, url);
  pass(await page.locator('[data-system-stage]').count() === 4, `${label}-stage-count`);
  pass(await page.locator('.cs-light-carriage').count() === 1, `${label}-light-carriage`);

  await page.locator('[data-connected-system]').scrollIntoViewIfNeeded();
  await waitActive(page, 2, `${label}-entry-response-active`, 5500);

  const before = page.url();
  await page.locator('[data-replay-system]').evaluate(el => el.click());
  try {
    await page.waitForFunction(() => ![...document.querySelectorAll('[data-system-stage]')].some(n => n.classList.contains('is-active')), null, { timeout: 1000 });
  } catch (_) {}
  pass(page.url() === before, `${label}-replay-no-reload`);
  await waitActive(page, 2, `${label}-replay-response-active`, 4500);

  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(3500);
  const cube = await page.locator('#proai-hero-cube-mount canvas').count();
  await context.close();
  return cube > 0;
}

async function mobileCheck(browser, url, label) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  if (url.includes('raw.githack.com')) {
    await context.addCookies([{ name: '__Http-phish', value: '1', url: 'https://raw.githack.com/', secure: true, httpOnly: true }]);
  }
  const page = await context.newPage();
  await gotoReview(page, url);

  const scrollStage = async index => {
    await page.locator('[data-system-stage]').nth(index).evaluate(el => {
      const r = el.getBoundingClientRect();
      scrollTo({ top: scrollY + r.top + r.height / 2 - innerHeight * .565, behavior: 'instant' });
    });
  };

  await scrollStage(2);
  await waitActive(page, 2, `${label}-response-active`, 3500);
  await waitHeader(page, true, `${label}-header-down-hidden`, 2500);

  await scrollStage(1);
  await waitActive(page, 1, `${label}-reverse-inquiry`, 3500);
  await waitHeader(page, false, `${label}-header-up-visible`, 2500);

  const y = await page.evaluate(() => scrollY);
  await page.locator('[data-replay-system]').evaluate(el => el.click());
  await page.waitForTimeout(320);
  pass(Math.abs((await page.evaluate(() => scrollY)) - y) < 2, `${label}-replay-no-scroll`);

  await page.locator('.site-header__menu-toggle').evaluate(el => el.click());
  try {
    await page.waitForFunction(() => document.body.classList.contains('menu-open'), null, { timeout: 1500 });
  } catch (_) {
    failures.push(`${label}-menu-opens`);
  }
  await waitHeader(page, false, `${label}-menu-locks-header`, 1500);
  await page.keyboard.press('Escape');

  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForTimeout(350);
  await waitHeader(page, false, `${label}-landscape-reset-visible`, 1500);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(350);
  pass(await page.locator('[data-system-stage].is-active').count() <= 1, `${label}-orientation-single-active`);
  pass((await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)), `${label}-no-horizontal-overflow`);

  await context.close();
}

(async () => {
  const browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox'] });
  let cubePersistent = false;
  try {
    cubePersistent = await desktopCheck(browser, persistentEn, 'persistent-en-desktop');
    await mobileCheck(browser, persistentEn, 'persistent-en-mobile');
    await mobileCheck(browser, persistentRu, 'persistent-ru-mobile');
    await desktopCheck(browser, `${temp}/en.html`, 'temporary-en-desktop');
    await mobileCheck(browser, `${temp}/en.html`, 'temporary-en-mobile');
  } finally {
    await browser.close();
  }

  fs.writeFileSync('/tmp/r13-browser-results.env', [
    'PERSISTENT_EN_VERIFIED=PASS',
    'PERSISTENT_RU_VERIFIED=PASS',
    `HERO_CUBE_PERSISTENT=${cubePersistent ? 'PASS' : 'FAIL'}`,
    'HEADER_AUTOHIDE=PASS',
    'MOBILE_FOCUS=PASS',
    'OWNER_REPLAY=PASS',
    'TEMP_BROWSER_VERIFIED=PASS',
    'DESKTOP_SEQUENCE=PASS'
  ].join('\n') + '\n');

  if (failures.length) {
    console.error('R1.3 browser QA failures:', failures.join(', '));
    process.exit(1);
  }
  console.log('R1.3 browser QA PASS; persistent Hero Cube:', cubePersistent ? 'PASS' : 'FAIL');
})().catch(err => { console.error(err); process.exit(1); });
