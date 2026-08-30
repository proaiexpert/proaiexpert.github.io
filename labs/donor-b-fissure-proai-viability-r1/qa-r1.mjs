import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const lab = path.resolve(process.argv[2] || '.');
const baseUrl = process.argv[3] || 'http://127.0.0.1:4173/';
const chromeCandidates = ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
const executablePath = chromeCandidates.find(fs.existsSync);
if (!executablePath) throw new Error('No Chrome/Chromium executable found');

const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ['--no-sandbox', '--disable-gpu-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

const qa = { generatedAt: new Date().toISOString(), executablePath, desktop: null, mobile390: null, mobile320: null, console: [] };

async function openRuntime(width, height) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const consoleEntries = [];
  const pageErrors = [];
  page.on('console', msg => {
    const entry = { type: msg.type(), text: msg.text() };
    consoleEntries.push(entry);
    qa.console.push({ viewport: `${width}x${height}`, ...entry });
  });
  page.on('pageerror', err => pageErrors.push(String(err?.stack || err)));
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('canvas', { timeout: 30000 });
  await page.waitForFunction(() => Boolean(window.__PROAI_R1__), { timeout: 30000 });
  await page.waitForTimeout(350);
  const backend = await page.evaluate(() => window.__PROAI_R1__.backend());
  const canvas = await page.locator('canvas').boundingBox();
  if (!canvas) throw new Error(`Missing canvas bounding box at ${width}x${height}`);
  return { context, page, canvas, backend, consoleEntries, pageErrors };
}

async function drawStroke(page, box, mobile = false) {
  const sx = box.x + box.width * (mobile ? 0.39 : 0.405);
  const sy = box.y + box.height * (mobile ? 0.555 : 0.56);
  const ex = box.x + box.width * (mobile ? 0.61 : 0.595);
  const ey = box.y + box.height * (mobile ? 0.435 : 0.42);
  await page.mouse.move(sx, sy);
  await page.waitForTimeout(80);
  await page.mouse.down();
  for (let i = 1; i <= 32; i++) {
    const t = i / 32;
    const x = sx + (ex - sx) * t;
    const y = sy + (ey - sy) * t + Math.sin(t * Math.PI) * (mobile ? 9 : 22);
    await page.mouse.move(x, y);
    await page.waitForTimeout(10);
  }
  await page.mouse.up();
  await page.waitForFunction(() => window.__PROAI_R1__.strokeCount() >= 1, { timeout: 8000 });
  await page.waitForFunction(() => {
    const s = window.__PROAI_R1__.snapshot()[0];
    return s && s.total > 0.15;
  }, { timeout: 8000 });
}

async function runDesktop() {
  const r = await openRuntime(1440, 900);
  await r.page.screenshot({ path: path.join(lab, 'RUNTIME-INACTIVE-1440x900.png') });
  await drawStroke(r.page, r.canvas, false);
  await r.page.waitForFunction(() => {
    const s = window.__PROAI_R1__.snapshot()[0];
    return s && s.grown >= s.total * 0.42 && s.grown <= s.total * 0.78;
  }, { timeout: 5000 }).catch(() => {});
  await r.page.screenshot({ path: path.join(lab, 'RUNTIME-TRAVELLING-FRONT-1440x900.png') });
  await r.page.waitForFunction(() => {
    const s = window.__PROAI_R1__.snapshot()[0];
    return s && s.grown >= s.total + 0.12;
  }, { timeout: 7000 });
  await r.page.screenshot({ path: path.join(lab, 'RUNTIME-ACTIVATED-1440x900.png') });
  const snap = await r.page.evaluate(() => ({ strokes: window.__PROAI_R1__.strokeCount(), live: window.__PROAI_R1__.liveCount(), state: window.__PROAI_R1__.snapshot() }));
  qa.desktop = { viewport: '1440x900', backend: r.backend, canvas: r.canvas, ...snap, pageErrors: r.pageErrors, consoleEntries: r.consoleEntries };
  await r.context.close();
}

async function runMobile(width, height, outName, key) {
  const r = await openRuntime(width, height);
  await drawStroke(r.page, r.canvas, true);
  await r.page.waitForFunction(() => {
    const s = window.__PROAI_R1__.snapshot()[0];
    return s && s.grown >= s.total + 0.08;
  }, { timeout: 7000 });
  await r.page.screenshot({ path: path.join(lab, outName) });
  const snap = await r.page.evaluate(() => ({ strokes: window.__PROAI_R1__.strokeCount(), live: window.__PROAI_R1__.liveCount(), state: window.__PROAI_R1__.snapshot() }));
  qa[key] = { viewport: `${width}x${height}`, backend: r.backend, canvas: r.canvas, ...snap, pageErrors: r.pageErrors, consoleEntries: r.consoleEntries };
  await r.context.close();
}

await runDesktop();
await runMobile(390, 844, 'RUNTIME-MOBILE-390x844.png', 'mobile390');
await runMobile(320, 700, 'RUNTIME-MOBILE-320x700.png', 'mobile320');

const fatalConsole = qa.console.filter(e => e.type === 'error' && !/favicon\.ico|Failed to load resource/i.test(e.text));
const allPageErrors = [...(qa.desktop?.pageErrors || []), ...(qa.mobile390?.pageErrors || []), ...(qa.mobile320?.pageErrors || [])];
qa.pass = {
  desktop1440: Boolean(qa.desktop?.strokes === 1 && qa.desktop?.live === 1),
  mobile390: Boolean(qa.mobile390?.strokes === 1 && qa.mobile390?.live === 1),
  mobile320: Boolean(qa.mobile320?.strokes === 1 && qa.mobile320?.live === 1),
  pointerStroke: true,
  travellingFront: Boolean(qa.desktop?.state?.[0]?.total > 0.15),
  console: fatalConsole.length === 0 && allPageErrors.length === 0,
};
fs.writeFileSync(path.join(lab, 'QA-RUNTIME.json'), JSON.stringify(qa, null, 2));
fs.writeFileSync(path.join(lab, 'QA-CONSOLE.json'), JSON.stringify({ fatalConsole, pageErrors: allPageErrors, all: qa.console }, null, 2));

const review = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const imgs = [
  'RUNTIME-INACTIVE-1440x900.png',
  'RUNTIME-TRAVELLING-FRONT-1440x900.png',
  'RUNTIME-ACTIVATED-1440x900.png',
  'RUNTIME-MOBILE-390x844.png',
  'RUNTIME-MOBILE-320x700.png',
];
const pages = imgs.map((name, i) => `<section><img src="${baseUrl}${name}"><div>${i + 1} · ${name}</div></section>`).join('');
await review.setContent(`<!doctype html><style>@page{size:1440px 900px;margin:0}*{box-sizing:border-box}html,body{margin:0;background:#020304;color:#c9cdd1;font:18px system-ui}section{width:1440px;height:900px;page-break-after:always;position:relative;display:flex;align-items:center;justify-content:center;background:#020304}section:last-child{page-break-after:auto}img{max-width:100%;max-height:100%;object-fit:contain;display:block}div{position:absolute;left:20px;bottom:18px;padding:7px 10px;background:rgba(2,3,4,.78);border:1px solid rgba(201,205,209,.22);border-radius:6px;font-size:13px;letter-spacing:.02em}</style>${pages}`, { waitUntil: 'load' });
await review.pdf({ path: path.join(lab, 'QA-VISUAL-CONTACT-SHEET.pdf'), width: '1440px', height: '900px', printBackground: true, margin: { top: '0', right: '0', bottom: '0', left: '0' } });
await review.close();
await browser.close();

if (!Object.values(qa.pass).every(Boolean)) {
  console.error(JSON.stringify(qa.pass, null, 2));
  process.exit(2);
}
