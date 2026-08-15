const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const chrome = process.env.CHROME_BIN;
const reviewUrl = process.env.QA_URL || 'http://127.0.0.1:4173/en.html';
const outDir = process.env.SCREENSHOT_DIR || 'docs/site-evolution/connected-system-r1/review-r131';
const productSha = process.env.PRODUCT_SHA || '2183da3471eeedeea9500ba721294a7f590248ff';

const desktopViewports = [
  { width: 1440, height: 900, key: '1440x900' },
  { width: 1366, height: 768, key: '1366x768' },
  { width: 1280, height: 800, key: '1280x800' },
  { width: 1200, height: 800, key: '1200x800' }
];

const failures = [];
const report = {
  productSha,
  reviewUrl,
  generatedAt: new Date().toISOString(),
  desktop: {},
  mobile: {},
  failures
};

fs.mkdirSync(outDir, { recursive: true });

function assert(cond, label, detail = '') {
  if (!cond) failures.push(detail ? `${label}: ${detail}` : label);
}

async function gotoReview(page) {
  await page.goto(reviewUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('[data-connected-system]', { timeout: 20000 });
  await page.waitForFunction(() => document.querySelectorAll('[data-system-stage]').length === 4, null, { timeout: 10000 });
  await page.waitForTimeout(1000);
}

async function frameConnectedSystem(page) {
  await page.evaluate(() => {
    const section = document.querySelector('[data-connected-system]');
    if (!section) return;
    const top = section.getBoundingClientRect().top + scrollY;
    scrollTo({ top: Math.max(0, top - 34), behavior: 'instant' });
  });
  await page.waitForTimeout(140);
}

async function installStageRecorder(page) {
  await page.evaluate(() => {
    window.__r131Seen = [];
    window.__r131Observer?.disconnect?.();
    const stages = [...document.querySelectorAll('[data-system-stage]')];
    const record = () => stages.forEach((stage, index) => {
      if (stage.classList.contains('is-active') && !window.__r131Seen.includes(index)) window.__r131Seen.push(index);
    });
    window.__r131Observer = new MutationObserver(record);
    stages.forEach(stage => window.__r131Observer.observe(stage, { attributes: true, attributeFilter: ['class'] }));
    record();
  });
}

async function replay(page) {
  await installStageRecorder(page);
  await page.locator('[data-replay-system]').evaluate(el => el.click());
}

async function waitResponseComposite(page, timeout = 5000) {
  await page.waitForFunction(() => {
    const s = [...document.querySelectorAll('[data-system-stage]')];
    if (s.length !== 4) return false;
    const active = s.filter(n => n.classList.contains('is-active'));
    return active.length === 1 &&
      s[0].classList.contains('is-settled') &&
      s[1].classList.contains('is-settled') &&
      s[2].classList.contains('is-active') &&
      s[3].classList.contains('is-future');
  }, null, { timeout });
  // Place the capture near the specular peak while preserving the RESPONSE state.
  await page.waitForTimeout(105);
}

async function waitBalanced(page, timeout = 6500) {
  await page.waitForFunction(() => {
    const s = [...document.querySelectorAll('[data-system-stage]')];
    return s.length === 4 && s.every(n => n.classList.contains('is-balanced'));
  }, null, { timeout });
}

async function geometry(page) {
  return page.evaluate(() => {
    const q = sel => document.querySelector(sel);
    const rect = el => {
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
    };
    const section = q('[data-connected-system]');
    const shell = q('.cs-shell');
    const field = q('.cs-system-field');
    const rail = q('.cs-spine');
    const carriage = q('.cs-light-carriage');
    const stages = [...document.querySelectorAll('[data-system-stage]')];
    const stageData = stages.map(stage => ({
      stage: rect(stage),
      joint: rect(stage.querySelector('.cs-transfer-joint')),
      name: rect(stage.querySelector('.cs-stage-name')),
      copy: rect(stage.querySelector('.cs-stage-copy')),
      components: rect(stage.querySelector('.cs-components')),
      classes: [...stage.classList]
    }));
    return {
      viewport: { width: innerWidth, height: innerHeight },
      scrollWidth: document.documentElement.scrollWidth,
      section: rect(section),
      shell: rect(shell),
      field: rect(field),
      rail: rect(rail),
      carriage: rect(carriage),
      stageData,
      activeCount: stages.filter(s => s.classList.contains('is-active')).length,
      heroBottom: q('#hero') ? rect(q('#hero')).bottom : null,
      sectionTop: rect(section).top,
      heroBg: q('#hero') ? getComputedStyle(q('#hero')).backgroundColor : null,
      sectionBg: getComputedStyle(section).backgroundColor
    };
  });
}

function validateGeometry(data, key, expectCoreInViewport = true) {
  const { viewport, scrollWidth, shell, field, rail, carriage, stageData } = data;
  assert(scrollWidth <= viewport.width + 1, `${key}-horizontal-overflow`, `${scrollWidth} > ${viewport.width + 1}`);
  assert(shell.left >= -1 && shell.right <= viewport.width + 1, `${key}-shell-horizontal-bounds`);
  assert(rail.left >= field.left - 2 && rail.right <= field.right + 2, `${key}-rail-field-bounds`);
  assert(carriage.left >= field.left - 110 && carriage.right <= field.right + 110, `${key}-carriage-horizontal-field`);
  assert(carriage.top >= field.top - 120 && carriage.bottom <= field.bottom + 120, `${key}-carriage-vertical-field`);

  stageData.forEach((s, i) => {
    const label = `${key}-stage-${i + 1}`;
    [s.name, s.copy, s.components].forEach((r, j) => {
      assert(r.left >= -1 && r.right <= viewport.width + 1, `${label}-content-${j}-horizontal-clipping`);
      if (expectCoreInViewport) assert(r.bottom <= viewport.height + 3, `${label}-content-${j}-viewport-bottom`, `${r.bottom.toFixed(1)} > ${viewport.height}`);
    });
    const jointCenterY = (s.joint.top + s.joint.bottom) / 2;
    const railCenterY = (rail.top + rail.bottom) / 2;
    assert(Math.abs(jointCenterY - railCenterY) <= 7, `${label}-joint-rail-y`, `${jointCenterY.toFixed(1)} vs ${railCenterY.toFixed(1)}`);
  });
}

async function hoverSequence(page, key) {
  const order = [0, 2, 1, 3];
  for (const index of order) {
    const stage = page.locator('[data-system-stage]').nth(index);
    await stage.hover({ position: { x: 50, y: Math.max(120, Math.min(170, (await stage.boundingBox())?.height / 2 || 140)) } });
    try {
      await page.waitForFunction(expected => {
        const s = [...document.querySelectorAll('[data-system-stage]')];
        return s.filter(n => n.classList.contains('is-active')).length === 1 && s[expected].classList.contains('is-active');
      }, index, { timeout: 1800 });
    } catch (_) {
      failures.push(`${key}-hover-${index + 1}-active`);
    }
    const activeCount = await page.locator('[data-system-stage].is-active').count();
    assert(activeCount === 1, `${key}-hover-${index + 1}-single-active`, String(activeCount));
    const g = await geometry(page);
    assert(g.carriage.left >= g.field.left - 110 && g.carriage.right <= g.field.right + 110, `${key}-hover-${index + 1}-carriage-bounds`);
  }
  await page.mouse.move(6, 6);
  await page.waitForTimeout(450);
}

async function desktopCase(browser, vp) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();
  await gotoReview(page);
  await frameConnectedSystem(page);

  const caseReport = { response: {}, balanced: {}, sequenceSeen: [], hover: 'PASS' };
  await replay(page);
  await waitResponseComposite(page);

  const responseData = await geometry(page);
  validateGeometry(responseData, `${vp.key}-response`, true);
  assert(responseData.activeCount === 1, `${vp.key}-response-single-active`, String(responseData.activeCount));
  assert(responseData.stageData[0].classes.includes('is-settled'), `${vp.key}-trust-settled`);
  assert(responseData.stageData[1].classes.includes('is-settled'), `${vp.key}-inquiry-settled`);
  assert(responseData.stageData[2].classes.includes('is-active'), `${vp.key}-response-active`);
  assert(responseData.stageData[3].classes.includes('is-future'), `${vp.key}-result-future`);
  caseReport.response = responseData;

  const responsePath = path.join(outDir, `en-${vp.key}-response-active.png`);
  await page.screenshot({ path: responsePath, fullPage: false });

  await waitBalanced(page);
  caseReport.sequenceSeen = await page.evaluate(() => window.__r131Seen || []);
  assert([0, 1, 2, 3].every((n, i) => caseReport.sequenceSeen[i] === n), `${vp.key}-sequence-order`, JSON.stringify(caseReport.sequenceSeen));

  const balancedData = await geometry(page);
  validateGeometry(balancedData, `${vp.key}-balanced`, true);
  assert(balancedData.stageData.every(s => s.classes.includes('is-balanced')), `${vp.key}-all-balanced`);
  caseReport.balanced = balancedData;

  if (vp.key === '1440x900' || vp.key === '1200x800') {
    const balancedPath = path.join(outDir, `en-${vp.key}-final-balanced.png`);
    await page.screenshot({ path: balancedPath, fullPage: false });
}

  await hoverSequence(page, vp.key);

  if (vp.key === '1440x900' || vp.key === '1366x768') {
    // Functional continuity supplement: adjacent sections stay in the same Obsidian world, with no DOM gap.
    const continuity = await page.evaluate(() => {
      const hero = document.querySelector('#hero');
      const cs = document.querySelector('[data-connected-system]');
      const hr = hero.getBoundingClientRect();
      const cr = cs.getBoundingClientRect();
      return {
        domGap: Math.round((cr.top -hr.bottom) * 100) / 100,
        heroBg: getComputedStyle(hero).backgroundColor,
        csBg: getComputedStyle(cs).backgroundColor
      };
    });
    caseReport.continuity = continuity;
    assert(Math.abs(continuity.domGap) <= 1, `${vp.key}-hero-connected-gap`, String(continuity.domGap));
    assert(continuity.heroBg === continuity.csBg, `${vp.key}-hero-connected-background`, `${continuity.heroBg} vs ${continuity.csBg}`);
  }

  report.desktop[vp.key] = caseReport;
  await context.close();
}

async function mobileSmoke(browser, width, height, key) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  await gotoReview(page);
  const stage = page.locator('[data-system-stage]').nth(2);
  await stage.evaluate(el => {
    const r = el.getBoundingClientRect();
    scrollTo({ top: scrollY + r.top + r.height / 2 - innerHeight * .565, behavior: 'instant' });
  });
  await page.waitForTimeout(750);
  const active = await stage.evaluate(el => el.classList.contains('is-active'));
  assert(active, `${key}-mobile-response-active`);

  // Explicit downward delta after position selection: validates header auto-hide without relying on the geometry jump itself.
  await page.evaluate(() => scrollBy(0, 90));
  await page.waitForTimeout(180);
  const hiddenDown = await page.locator('[data-site-header]').evaluate(el => el.classList.contains('header-hidden'));
  assert(hiddenDown, `${key}-header-hide-down`);

  await page.evaluate(() => scrollBy(0, -100));
  await page.waitForTimeout(180);
  const visibleUp = !(await page.locator('[data-site-header]').evaluate(el => el.classList.contains('header-hidden')));
  assert(visibleUp, `${key}-header-show-up`);

  const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  assert(noOverflow, `${key}-mobile-no-overflow`);
  report.mobile[key] = { active, hiddenDown, visibleUp, noOverflow };
  await context.close();
}

(async () => {
  if (!chrome) throw new Error('CHROME_BIN is required');
  const browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  try {
    for (const vp of desktopViewports) await desktopCase(browser, vp);
    await mobileSmoke(browser, 390, 844, '390x844');
    await mobileSmoke(browser, 844, 390, '844x390');
  } finally {
    await browser.close();
  }

  fs.writeFileSync(path.join(outDir, 'qa-report.json'), JSON.stringify(report, null, 2));
  if (failures.length) {
    console.error('R1.3.1 desktop QA failures:\n' + failures.map(f => `- ${f}`).join('\n'));
    process.exit(1);
  }
  console.log('R1.3.1 desktop QA PASS');
})().catch(err => {
  try { fs.writeFileSync(path.join(outDir, 'qa-report.json'), JSON.stringify(report, null, 2)); } catch (_) {}
  console.error(err);
  process.exit(1);
});
