import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const base = process.env.R45_BASE_URL || 'http://127.0.0.1:4173';
const out = 'r45-internal-parallax-ab';
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
const browser = await chromium.launch({headless:true});
for (const mode of ['safe','medium','aggressive']) {
  const context = await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
  const page = await context.newPage();
  await page.goto(`${base}/hero-a-plus-c-shape-preview/?previewT=4800&parallax=${mode}`,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{if(document.fonts?.ready) await document.fonts.ready;});
  await page.waitForTimeout(400);
  if (await page.evaluate(()=>typeof window.__r45SetFrame) !== 'function') throw new Error('R4.5 compositor did not boot');
  await page.screenshot({path:path.join(out,`R45_PARALLAX_${mode.toUpperCase()}.png`),fullPage:false});
  await context.close();
}
await browser.close();
console.log('Internal parallax A/B complete');