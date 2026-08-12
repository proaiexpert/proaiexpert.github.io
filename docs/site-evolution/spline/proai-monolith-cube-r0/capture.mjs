import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const review = path.join(root, 'review-browser');
fs.mkdirSync(review, { recursive: true });

const vite = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['vite', '--host', '127.0.0.1', '--port', '4178'], { cwd: root, stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
await sleep(1700);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 1120 }, deviceScaleFactor: 1 });
const pageErrors = [];
page.on('pageerror', e => pageErrors.push(String(e)));
await page.goto('http://127.0.0.1:4178', { waitUntil: 'networkidle' });
await page.waitForFunction(() => Boolean(window.__PROAI_MONOLITH_R0));
await page.waitForTimeout(1700);
await page.screenshot({ path: path.join(review, '01-hero-angle-browser.png') });
await page.evaluate(() => window.__PROAI_MONOLITH_R0.setReviewAngle('motion'));
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(review, '02-motion-angle-browser.png') });
fs.writeFileSync(path.join(review, 'qa.json'), JSON.stringify({ pageErrors, pass: pageErrors.length === 0 }, null, 2));
await browser.close();
vite.kill('SIGTERM');
