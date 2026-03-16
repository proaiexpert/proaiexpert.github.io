const { chromium } = require('playwright');
(async() => {
  const browser = await chromium.launch({headless:true});
  const page = await browser.newPage({ viewport: { width: 1920, height: 1400 }, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:8008/ru/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/mnt/data/proai_v5_check_100.png', fullPage: false });
  await page.setViewportSize({ width: 3500, height: 1800 });
  await page.goto('http://127.0.0.1:8008/ru/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/mnt/data/proai_v5_check_350.png', fullPage: false });
  await browser.close();
})();
