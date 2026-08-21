import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.TW_GOLDEN_URL || 'http://127.0.0.1:8765/docs/site-evolution/two-worlds-golden-synthesis-r1/review/index.html';
const outDir = 'docs/site-evolution/two-worlds-golden-synthesis-r1/review';
const mediaDir = path.join(outDir, 'media');
await fs.mkdir(mediaDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const report = {
  generatedAt: new Date().toISOString(),
  runtime: baseUrl,
  donorPolicy: {
    geometry: 'R2.1',
    motionMaterial: 'R2.2',
    chroma: 'R2.3/R2.4 restrained response only',
    inscription: 'R2.4 face-bound',
    r23ViewportOverlay: 'REJECTED',
    r25: 'NOT USED'
  },
  overflow: {},
  desktop: {},
  mobile: {},
  technology: {},
  failures: []
};

async function pageFor(width, height) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  page.on('console', msg => { if (msg.type() === 'error') errors.push('console: ' + msg.text()); });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(250);
  return { page, errors };
}

async function overflowAt(width, height) {
  const { page, errors } = await pageFor(width, height);
  const value = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    delta: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    bodyDelta: document.body.scrollWidth - document.documentElement.clientWidth,
    coreSplit: Boolean(document.querySelector('#core-split')),
    r23Overlay: Boolean(document.querySelector('.tw-r23-mobile-inscription'))
  }));
  if (value.delta !== 0 || value.bodyDelta > 0) report.failures.push(`overflow ${width}x${height}: ${JSON.stringify(value)}`);
  if (value.coreSplit) report.failures.push(`legacy #core-split present at ${width}x${height}`);
  if (value.r23Overlay) report.failures.push(`R2.3 viewport inscription overlay present at ${width}x${height}`);
  if (errors.length) report.failures.push(`runtime errors ${width}x${height}: ${errors.join(' | ')}`);
  await page.close();
  return value;
}

for (const [width, height] of [[1440,900],[1280,800],[390,844],[393,852],[844,390]]) {
  report.overflow[`${width}x${height}`] = await overflowAt(width, height);
}

{
  const { page, errors } = await pageFor(1440, 900);
  await page.evaluate(() => window.scrollTo(0, 50));
  await page.waitForTimeout(100);
  const section = page.locator('[data-tw-r2]');

  async function desktopState(focus, file) {
    await section.evaluate((node, state) => node.setAttribute('data-focus', state), focus);
    await page.waitForTimeout(focus === 'neutral' ? 700 : 950);
    const metrics = await page.evaluate(() => {
      const s = document.querySelector('[data-tw-r2]');
      const v = s.querySelector('[data-tw-viewport]').getBoundingClientRect();
      const f = s.querySelector('[data-tw-fold]').getBoundingClientRect();
      const ai = s.querySelector('.tw-r2__inscription--ai').getBoundingClientRect();
      const web = s.querySelector('.tw-r2__inscription--web').getBoundingClientRect();
      const active = s.getAttribute('data-focus');
      return {
        focus: active,
        foldCenterPct: ((f.left + f.width / 2 - v.left) / v.width) * 100,
        aiInscription: { left: ai.left, right: ai.right, top: ai.top, bottom: ai.bottom, width: ai.width },
        webInscription: { left: web.left, right: web.right, top: web.top, bottom: web.bottom, width: web.width }
      };
    });
    await page.screenshot({ path: path.join(mediaDir, file), type: 'jpeg', quality: 92, fullPage: false });
    return metrics;
  }

  report.desktop.neutral = await desktopState('neutral', '01-neutral-50-50-1440x900.jpg');
  report.desktop.ai = await desktopState('ai', '02-ai-active-fold-right-1440x900.jpg');
  report.desktop.web = await desktopState('web', '03-web-active-fold-left-1440x900.jpg');

  const n = report.desktop.neutral.foldCenterPct;
  const a = report.desktop.ai.foldCenterPct;
  const w = report.desktop.web.foldCenterPct;
  if (Math.abs(n - 50) > 2.0) report.failures.push(`neutral Fold not ~50%: ${n}`);
  if (Math.abs(a - 71.6) > 3.0) report.failures.push(`AI Fold not ~71.6%: ${a}`);
  if (Math.abs(w - 28.4) > 3.0) report.failures.push(`Web Fold not ~28.4%: ${w}`);
  if (errors.length) report.failures.push(`desktop capture errors: ${errors.join(' | ')}`);
  await page.close();
}

async function mobileSmoke(width, height) {
  const { page, errors } = await pageFor(width, height);
  async function atProgress(progress) {
    await page.evaluate(p => {
      const exp = document.querySelector('[data-tw-experience]');
      const rect = exp.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;
      const travel = Math.max(1, rect.height - window.innerHeight);
      window.scrollTo(0, absoluteTop + p * travel);
    }, progress);
    await page.waitForTimeout(220);
    return page.evaluate(() => {
      const s = document.querySelector('[data-tw-r2]');
      const viewport = s.querySelector('[data-tw-viewport]').getBoundingClientRect();
      const fold = s.querySelector('[data-tw-fold]').getBoundingClientRect();
      const focus = s.getAttribute('data-focus');
      const active = focus === 'ai' ? s.querySelector('.tw-r2__inscription--ai') : focus === 'web' ? s.querySelector('.tw-r2__inscription--web') : null;
      const ir = active ? active.getBoundingClientRect() : null;
      const visibleContent = Array.from(s.querySelectorAll('.tw-r2__content')).filter(node => Number(getComputedStyle(node).opacity) > .5).length;
      return {
        focus,
        viewport: { left:viewport.left, right:viewport.right, top:viewport.top, bottom:viewport.bottom },
        foldVisible: fold.right > 0 && fold.left < innerWidth && fold.bottom > 0 && fold.top < innerHeight,
        inscription: ir ? { left:ir.left, right:ir.right, top:ir.top, bottom:ir.bottom, width:ir.width } : null,
        visibleContent
      };
    });
  }
  const ai = await atProgress(.18);
  const turn = await atProgress(.50);
  const web = await atProgress(.82);
  const result = { ai, turn, web, turnBand: .14, errors };

  if (ai.focus !== 'ai') report.failures.push(`${width}x${height} AI settled focus=${ai.focus}`);
  if (turn.focus !== 'turn') report.failures.push(`${width}x${height} turn focus=${turn.focus}`);
  if (web.focus !== 'web') report.failures.push(`${width}x${height} Web settled focus=${web.focus}`);
  if (!turn.foldVisible) report.failures.push(`${width}x${height} Fold invisible during THE TURN`);
  if (turn.visibleContent !== 0) report.failures.push(`${width}x${height} THE TURN should physically occlude content; visible=${turn.visibleContent}`);
  for (const [label, state] of [['ai',ai],['web',web]]) {
    if (!state.inscription) report.failures.push(`${width}x${height} ${label} inscription missing`);
    else {
      if (state.inscription.top < -1) report.failures.push(`${width}x${height} ${label} inscription escapes top: ${state.inscription.top}`);
      if (state.inscription.left < -1 || state.inscription.right > width + 1) report.failures.push(`${width}x${height} ${label} inscription half-visible: ${JSON.stringify(state.inscription)}`);
    }
  }
  if (errors.length) report.failures.push(`mobile runtime errors ${width}x${height}: ${errors.join(' | ')}`);
  await page.close();
  return result;
}

report.mobile['390x844'] = await mobileSmoke(390,844);
report.mobile['393x852'] = await mobileSmoke(393,852);
report.mobile['844x390'] = await mobileSmoke(844,390);

{
  const { page, errors } = await pageFor(390,844);
  report.technology = await page.evaluate(() => {
    const tech = document.querySelector('[data-tw-tech-r2]');
    const marks = Array.from(tech.querySelectorAll('img')).map(img => {
      const r = img.getBoundingClientRect();
      return { alt:img.alt, width:r.width, height:r.height, complete:img.complete, naturalWidth:img.naturalWidth };
    });
    return {
      count: marks.length,
      maxWidth: Math.max(...marks.map(m => m.width)),
      maxHeight: Math.max(...marks.map(m => m.height)),
      failedAssets: marks.filter(m => !m.complete || !m.naturalWidth).map(m => m.alt),
      marks
    };
  });
  if (report.technology.count !== 10) report.failures.push(`Technology mark count=${report.technology.count}`);
  if (report.technology.maxWidth > 110 || report.technology.maxHeight > 60) report.failures.push(`Technology giant mark regression: ${report.technology.maxWidth}x${report.technology.maxHeight}`);
  if (report.technology.failedAssets.length) report.failures.push(`Technology failed assets: ${report.technology.failedAssets.join(', ')}`);
  if (errors.length) report.failures.push(`Technology runtime errors: ${errors.join(' | ')}`);
  await page.close();
}

report.pass = report.failures.length === 0;
await fs.writeFile(path.join(outDir, 'qa-report.json'), JSON.stringify(report, null, 2) + '\n');
await browser.close();

console.log(JSON.stringify(report, null, 2));
if (!report.pass) process.exitCode = 1;
