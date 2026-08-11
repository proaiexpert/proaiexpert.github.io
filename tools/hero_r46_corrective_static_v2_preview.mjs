import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const base = process.env.R46_V2_BASE_URL || 'http://127.0.0.1:4173';
const output = process.argv[2] || '/tmp/proai-r46-v2/browser-raw.png';
const route = '/hero-a-plus-c-shape-preview/';

fs.mkdirSync(path.dirname(output), { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce'
});
const page = await context.newPage();
const pageErrors = [];
page.on('pageerror', error => pageErrors.push(String(error)));

await page.goto(`${base}${route}?mode=static`, { waitUntil: 'networkidle' });
await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
await page.waitForTimeout(300);

const diagnostic = await page.evaluate(() => ({
  scene: !!document.querySelector('.hero-cshape__scene'),
  stack: !!document.querySelector('.hero-r45__desktop-stack'),
  front: !!document.querySelector('.hero-r45__scene-plane--front'),
  glass: !!document.querySelector('.hero-r45__scene-plane--glass'),
  collector: !!document.querySelector('.hero-r45__collector'),
  rail: !!document.querySelector('.hero-cshape__rail'),
  heroImages: [...document.querySelectorAll('.hero-cshape__scene img')].map(img => ({
    complete: img.complete,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight
  }))
}));
if (pageErrors.length) throw new Error(`Browser error(s): ${pageErrors.join(' | ')}`);
if (!diagnostic.scene || !diagnostic.stack || !diagnostic.front || !diagnostic.glass || !diagnostic.collector || !diagnostic.rail) {
  throw new Error(`Incomplete recovered compositor: ${JSON.stringify(diagnostic)}`);
}
if (diagnostic.heroImages.length < 5 || diagnostic.heroImages.some(img => !img.complete || img.naturalWidth < 1)) {
  throw new Error(`Recovered raster incomplete: ${JSON.stringify(diagnostic.heroImages)}`);
}

await page.addStyleTag({ content: `
/* R4.6 corrective static V2 capture-only overrides.
   The approved registered raster planes remain intact. No luminance key is introduced. */
@media (min-width: 901px) {
  .hero-r45__desktop-stack {
    left: 11.925% !important;
    top: 4.72% !important;
    width: 73.153% !important;
    opacity: 1 !important;
  }

  /* Rail and external output are rebuilt after capture so they can be physically edge-gated. */
  .hero-cshape__rail { visibility: hidden !important; }
  .hero-r45__output { display: none !important; }

  /* Do not restore travel graphics. Internal volume only. */
  .hero-r45__impulse,
  .hero-r45__depth-packet,
  .hero-r45__microstream { display: none !important; }

  /* Preserve solid graphite. Refine plane separation only through non-destructive grading. */
  .hero-r45__scene-plane--back {
    opacity: .70 !important;
    filter: brightness(.89) saturate(.86) contrast(1.035) !important;
  }
  .hero-r45__scene-plane--base .hero-r45__scene-picture > img {
    filter: saturate(.92) contrast(1.035) brightness(.985) !important;
  }
  .hero-r45__scene-plane--front {
    opacity: 1 !important;
    filter: contrast(1.035) saturate(.93) brightness(.995) !important;
  }

  /* Embedded intelligence volume sits behind the source-registered foreground plane. */
  .hero-r45__scene-plane--glass {
    opacity: .090 !important;
    filter: saturate(1.10) brightness(1.055) contrast(1.018) !important;
  }
  .hero-r43__material-response--cyan {
    opacity: .048 !important;
    filter: saturate(1.18) brightness(1.10) contrast(1.03) !important;
  }
  .hero-r43__material-response--warm {
    opacity: .014 !important;
    filter: sepia(.42) saturate(1.05) hue-rotate(348deg) brightness(1.07) contrast(1.02) !important;
  }

  html body .hero-r45__chamber {
    display: block !important;
    mix-blend-mode: screen !important;
    background: radial-gradient(ellipse at 50% 50%, rgba(134,235,245,.16), rgba(64,166,181,.052) 42%, transparent 75%) !important;
  }
  html body .hero-r45__chamber--top { opacity: .042 !important; filter: blur(14px) !important; }
  html body .hero-r45__chamber--mid { opacity: .070 !important; filter: blur(16px) !important; }
  html body .hero-r45__chamber--deep { opacity: .105 !important; filter: blur(19px) !important; }
  html body .hero-r45__chamber--lower { opacity: .058 !important; filter: blur(16px) !important; }
  html body .hero-r45__entry-volume { opacity: .022 !important; filter: blur(18px) !important; }
  html body .hero-r45__ingress { opacity: .026 !important; filter: blur(13px) !important; }
  html body .hero-r45__collector {
    opacity: .185 !important;
    filter: blur(3.5px) !important;
    background: radial-gradient(circle, rgba(178,246,252,.46) 0 7%, rgba(96,216,231,.16) 24%, rgba(55,143,157,.045) 50%, transparent 73%) !important;
  }
  html body .hero-r45__output-field {
    opacity: .025 !important;
    filter: blur(18px) !important;
  }

  /* Soft contact only; no stage spotlight or mirror floor. */
  .hero-r43__floor {
    opacity: .095 !important;
    filter: blur(24px) !important;
    background:
      radial-gradient(ellipse at 57% 52%, rgba(0,0,0,.42) 0 16%, rgba(0,0,0,.16) 34%, transparent 66%),
      radial-gradient(ellipse at 57% 44%, rgba(92,202,216,.13), rgba(46,101,111,.036) 43%, transparent 74%),
      radial-gradient(ellipse at 72% 46%, rgba(197,153,105,.012), transparent 40%) !important;
  }
  .hero-r43__reflection {
    opacity: .033 !important;
    filter: blur(13px) !important;
  }
  .hero-r43__volumetric {
    opacity: .028 !important;
    filter: blur(25px) !important;
  }

  /* Selected material response remains tiny and subordinate. */
  .hero-r45__specular-response { opacity: .78 !important; }
  html body .hero-r45__edge-light { opacity: .030 !important; filter: blur(9px) !important; }
  html body .hero-r45__edge-light--a { opacity: .040 !important; }
  html body .hero-r45__edge-light--b { opacity: .026 !important; }
  html body .hero-r45__edge-light--c { opacity: .020 !important; }
}
` });

await page.waitForTimeout(250);
await page.screenshot({ path: output, fullPage: false });
await context.close();
await browser.close();
console.log(`V2 browser-preserving raw capture saved: ${output}`);
