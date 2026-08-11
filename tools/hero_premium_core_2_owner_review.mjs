import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const base = process.env.CORE2_BASE_URL || 'http://127.0.0.1:4173';
const out = process.env.CORE2_OUT || 'premium-core-2-owner-review';
const routes = {
  en: '/hero-premium-core-2-preview/',
  ru: '/ru/hero-premium-core-2-preview/'
};

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: [
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader'
  ]
});

async function ready(page, route, reducedMotion = 'no-preference') {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
  });
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  await page.emulateMedia({ reducedMotion });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
  await page.waitForFunction(() => document.documentElement.classList.contains('hero-core2--ready'), null, { timeout: 20000 });
  await page.waitForTimeout(550);
  if (errors.length) throw new Error(errors.join('\n'));
}

async function captureStatic({ locale, width, height, mobile, file, minVisualRatio = 0 }) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    isMobile: mobile,
    hasTouch: mobile
  });
  const page = await context.newPage();
  await ready(page, routes[locale]);
  const diagnostics = await page.evaluate(() => {
    const visual = document.querySelector('[data-hero-core2-visual]');
    const rect = visual?.getBoundingClientRect();
    const viewportVisible = rect ? Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0)) : 0;
    return {
      ready: document.documentElement.classList.contains('hero-core2--ready'),
      fallback: document.documentElement.classList.contains('hero-core2--fallback'),
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      title: document.querySelector('.hero-core2__title')?.textContent?.trim(),
      lead: document.querySelector('.hero-core2__lead')?.textContent?.trim(),
      primary: document.querySelector('.hero-core2__button--primary span')?.textContent?.trim(),
      stageLabels: [...document.querySelectorAll('.hero-core2__stage-label')].map(el => el.textContent.trim()),
      visual: rect ? {
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        height: Math.round(rect.height),
        viewportRatio: Number((viewportVisible / Math.max(rect.height, 1)).toFixed(3))
      } : null,
      canvas: (() => {
        const c = document.querySelector('[data-hero-core2-canvas]');
        const gl = c?.getContext('webgl2');
        return { width: c?.width || 0, height: c?.height || 0, webgl2: !!gl };
      })()
    };
  });
  if (!diagnostics.ready || diagnostics.fallback || !diagnostics.canvas.webgl2) throw new Error(`${locale} ${width}x${height}: WebGL2 did not reach ready state`);
  if (diagnostics.scrollWidth > diagnostics.innerWidth + 1) throw new Error(`${locale} ${width}x${height}: horizontal overflow ${diagnostics.scrollWidth} > ${diagnostics.innerWidth}`);
  if (minVisualRatio && (diagnostics.visual?.viewportRatio || 0) < minVisualRatio) throw new Error(`${locale} ${width}x${height}: Core visibility ratio ${(diagnostics.visual?.viewportRatio || 0)} < ${minVisualRatio}`);
  await page.screenshot({ path: path.join(out, file), fullPage: false });
  await context.close();
  return diagnostics;
}

const diagnostics = {
  enDesktop: await captureStatic({ locale: 'en', width: 1440, height: 900, mobile: false, file: 'CORE2_EN_DESKTOP_1440x900.png' }),
  ruDesktop: await captureStatic({ locale: 'ru', width: 1440, height: 900, mobile: false, file: 'CORE2_RU_DESKTOP_1440x900.png' }),
  enMobile: await captureStatic({ locale: 'en', width: 390, height: 844, mobile: true, file: 'CORE2_EN_MOBILE_390x844.png', minVisualRatio: 0.54 }),
  ruMobile: await captureStatic({ locale: 'ru', width: 390, height: 844, mobile: true, file: 'CORE2_RU_MOBILE_390x844.png', minVisualRatio: 0.50 }),
  enNarrow: await captureStatic({ locale: 'en', width: 320, height: 780, mobile: true, file: 'CORE2_EN_MOBILE_320x780.png', minVisualRatio: 0.72 }),
  enLandscape: await captureStatic({ locale: 'en', width: 844, height: 390, mobile: true, file: 'CORE2_EN_LANDSCAPE_844x390.png', minVisualRatio: 0.78 })
};

// Reduced-motion runtime gate: WebGL remains available but the final/result state is static.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await ready(page, routes.en, 'reduce');
  const reduced = await page.evaluate(() => ({
    active: [...document.querySelectorAll('[data-hero-core2-stage]')].findIndex(el => el.classList.contains('is-active')),
    ready: document.documentElement.classList.contains('hero-core2--ready')
  }));
  if (!reduced.ready || reduced.active !== 3) throw new Error(`Reduced-motion state invalid: ${JSON.stringify(reduced)}`);
  await page.screenshot({ path: path.join(out, 'CORE2_EN_REDUCED_MOTION_390x844.png'), fullPage: false });
  await context.close();
}

// Browser-native desktop motion capture. Playwright starts video recording before navigation,
// so the final MP4 trims the deterministic browser pre-roll and keeps the complete 4-stage story.
const videoDir = path.join(out, '.video-tmp');
fs.mkdirSync(videoDir, { recursive: true });
let webmPath;
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    recordVideo: { dir: videoDir, size: { width: 1440, height: 900 } }
  });
  const page = await context.newPage();
  await ready(page, routes.en);
  const video = page.video();
  await page.waitForTimeout(11800);
  await page.close();
  webmPath = await video.path();
  await context.close();
}

await browser.close();

const mp4 = path.join(out, 'CORE2_EN_DESKTOP_MOTION.mp4');
const ff = spawnSync('ffmpeg', [
  '-y', '-ss', '2.8', '-i', webmPath,
  '-t', '9.6',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
  mp4
], { stdio: 'inherit' });
if (ff.status !== 0) process.exit(ff.status ?? 1);
fs.rmSync(videoDir, { recursive: true, force: true });

fs.writeFileSync(path.join(out, 'diagnostics.json'), JSON.stringify(diagnostics, null, 2) + '\n');

for (const file of [
  'CORE2_EN_DESKTOP_1440x900.png',
  'CORE2_RU_DESKTOP_1440x900.png',
  'CORE2_EN_MOBILE_390x844.png',
  'CORE2_RU_MOBILE_390x844.png',
  'CORE2_EN_MOBILE_320x780.png',
  'CORE2_EN_LANDSCAPE_844x390.png',
  'CORE2_EN_REDUCED_MOTION_390x844.png',
  'CORE2_EN_DESKTOP_MOTION.mp4',
  'diagnostics.json'
]) {
  const p = path.join(out, file);
  if (!fs.existsSync(p) || fs.statSync(p).size < (file.endsWith('.json') ? 100 : 1000)) throw new Error(`Missing/empty owner-review output: ${p}`);
}

console.log('Premium Core 2.0 owner-review package complete:', fs.readdirSync(out));
