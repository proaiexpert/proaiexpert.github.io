#!/usr/bin/env bash
set -euo pipefail

python .github/footer-pr1-migrate.py

python - <<'PY'
import json
from pathlib import Path

root = Path('.')
manifest = json.loads((root / '.footer-pr1-manifest.json').read_text(encoding='utf-8'))
expected = {
    'about/index.html', 'ru/about/index.html',
    'contact/index.html', 'ru/contact/index.html',
    'ai-systems/index.html', 'ru/ai-systems/index.html',
    'websites-branding/index.html', 'ru/websites-branding/index.html',
}
assert {item['path'] for item in manifest} == expected

for item in manifest:
    text = (root / item['path']).read_text(encoding='utf-8')
    assert text.startswith('---\nlayout: null\n---\n')
    assert text.count('{% include footer-system/footer.html') == 1
    assert '<footer' not in text.lower()
    assert '.f-' not in text
    assert '/assets/css/footer-system-v1.css?v=20260804.1' in text
    assert f'locale_href="{item["locale_href"]}"' in text
    assert text.count('<header') == 1 and text.count('</header>') == 1

include = (root / '_includes/footer-system/commercial.html').read_text(encoding='utf-8')
assert 'footer-system/brand-zone.html' in include
assert 'footer-system/bottom.html' in include
assert 'javascript' not in include.lower()

css = (root / 'assets/css/footer-system-v1.css').read_text(encoding='utf-8')
assert '.f-' not in css
assert '@media (prefers-reduced-motion:reduce)' in css
assert '@media (forced-colors:active)' in css
assert 'site-footer__brand-zone' in css

socials = (root / '_data/social-links.yml').read_text(encoding='utf-8')
assert 'https://github.com/proaiexpert' in socials
assert 'https://t.me/proAiexpert' in socials
assert 'proai_expert' not in socials
print('Source contract passed for 8 pages.')
PY

gem install jekyll -v 4.3.4 --no-document
gem install webrick --no-document
jekyll build --destination _site

python - <<'PY'
import re
from pathlib import Path

routes = {
    'about/index.html': ('en', '/ru/about/', {'https://www.linkedin.com/in/ihorhorb/', 'https://github.com/proaiexpert', 'https://x.com/proaiexpert'}),
    'ru/about/index.html': ('ru', '/about/', {'https://www.linkedin.com/in/ihorhorb/', 'https://github.com/proaiexpert', 'https://x.com/proaiexpert', 'https://t.me/proAiexpert'}),
    'contact/index.html': ('en', '/ru/contact/', {'https://www.linkedin.com/in/ihorhorb/', 'https://github.com/proaiexpert', 'https://x.com/proaiexpert'}),
    'ru/contact/index.html': ('ru', '/contact/', {'https://www.linkedin.com/in/ihorhorb/', 'https://github.com/proaiexpert', 'https://x.com/proaiexpert', 'https://t.me/proAiexpert'}),
    'ai-systems/index.html': ('en', '/ru/ai-systems/', {'https://www.linkedin.com/in/ihorhorb/', 'https://github.com/proaiexpert', 'https://x.com/proaiexpert'}),
    'ru/ai-systems/index.html': ('ru', '/ai-systems/', {'https://www.linkedin.com/in/ihorhorb/', 'https://github.com/proaiexpert', 'https://x.com/proaiexpert', 'https://t.me/proAiexpert'}),
    'websites-branding/index.html': ('en', '/ru/websites-branding/', {'https://www.linkedin.com/in/ihorhorb/', 'https://github.com/proaiexpert', 'https://x.com/proaiexpert'}),
    'ru/websites-branding/index.html': ('ru', '/websites-branding/', {'https://www.linkedin.com/in/ihorhorb/', 'https://github.com/proaiexpert', 'https://x.com/proaiexpert', 'https://t.me/proAiexpert'}),
}

for output, (lang, locale_href, expected_socials) in routes.items():
    text = (Path('_site') / output).read_text(encoding='utf-8')
    assert text.count('data-footer-family="commercial"') == 1, output
    assert text.count('site-footer__brand-zone') == 1, output
    assert text.count('site-footer__watermark') == 1, output
    assert '{%' not in text and '{{' not in text, output
    assert f'href="{locale_href}"' in text, output
    assert 'Privacy' not in text and 'Terms' not in text, output
    footer = re.search(r'<footer\b.*?</footer>', text, flags=re.I | re.S)
    assert footer, output
    hrefs = set(re.findall(r'href="([^"]+)"', footer.group(0)))
    actual_socials = {href for href in hrefs if href.startswith('https://')}
    assert actual_socials == expected_socials, (output, actual_socials)
    if lang == 'en':
        assert 't.me/' not in footer.group(0), output
    else:
        assert footer.group(0).count('https://t.me/proAiexpert') == 2, output
print('Generated output contract passed for EN/RU routes.')
PY

npm_config_package_lock=false npm install --no-save playwright@1.54.2
npx playwright install --with-deps chromium
mkdir -p /tmp/footer-pr1-qa
python -m http.server 4173 --directory _site >/tmp/footer-pr1-server.log 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null || true' EXIT
sleep 2

node <<'JS'
const { chromium } = require('playwright');
const fs = require('fs');

const routes = [
  '/about/', '/ru/about/', '/contact/', '/ru/contact/',
  '/ai-systems/', '/ru/ai-systems/',
  '/websites-branding/', '/ru/websites-branding/'
];
const viewports = [
  { name: 'laptop', width: 1440, height: 900 },
  { name: 'portrait', width: 390, height: 844 },
  { name: 'landscape', width: 844, height: 390 }
];
function intersects(a, b) {
  return !(a.bottom <= b.top || a.top >= b.bottom || a.right <= b.left || a.left >= b.right);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const failures = [];
  const results = [];

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    for (const route of routes) {
      const page = await context.newPage();
      const pageErrors = [];
      page.on('pageerror', error => pageErrors.push(String(error)));
      await page.goto(`http://127.0.0.1:4173${route}`, { waitUntil: 'networkidle' });
      await page.locator('.site-footer').scrollIntoViewIfNeeded();

      const state = await page.evaluate(() => {
        const footer = document.querySelector('.site-footer');
        const main = document.querySelector('.site-footer__main');
        const brand = document.querySelector('.site-footer__brand-zone');
        const watermark = document.querySelector('.site-footer__watermark');
        const bottom = document.querySelector('.site-footer__bottom');
        const header = document.querySelector('header');
        const title = document.querySelector('.site-footer__cta h2');
        const links = [...document.querySelectorAll('.site-footer a')];
        const rect = el => {
          const r = el.getBoundingClientRect();
          return { top: r.top, right: r.right, bottom: r.bottom, left: r.left, width: r.width, height: r.height };
        };
        return {
          footerCount: document.querySelectorAll('.site-footer').length,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          main: rect(main), brand: rect(brand), watermark: rect(watermark), bottom: rect(bottom),
          headerMarkup: header ? header.outerHTML : '',
          animationName: getComputedStyle(title).animationName,
          minTargetHeight: Math.min(...links.map(link => link.getBoundingClientRect().height)),
        };
      });

      await page.locator('.site-footer a').first().focus();
      const focus = await page.locator('.site-footer a').first().evaluate(el => {
        const style = getComputedStyle(el);
        return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
      });

      const routeSlug = route.replace(/^\/+|\/+$/g, '').replaceAll('/', '-') || 'home';
      const screenshot = `/tmp/footer-pr1-qa/${routeSlug}-${viewport.name}.png`;
      await page.screenshot({ path: screenshot, fullPage: true });

      const routeFailures = [];
      if (state.footerCount !== 1) routeFailures.push(`footerCount=${state.footerCount}`);
      if (state.overflow > 1) routeFailures.push(`horizontal overflow=${state.overflow}`);
      if (intersects(state.main, state.brand)) routeFailures.push('main intersects brand zone');
      if (intersects(state.brand, state.bottom)) routeFailures.push('brand zone intersects bottom');
      if (state.watermark.left < state.brand.left - 1 || state.watermark.right > state.brand.right + 1) routeFailures.push('watermark escapes brand zone');
      if (state.animationName !== 'none') routeFailures.push(`reduced motion animation=${state.animationName}`);
      if (focus.outlineStyle === 'none' || focus.outlineWidth === '0px') routeFailures.push('focus indicator missing');
      if (pageErrors.length) routeFailures.push(`page errors: ${pageErrors.join('; ')}`);
      if (!state.headerMarkup) routeFailures.push('header missing');
      if (viewport.name !== 'landscape' && state.minTargetHeight < 40) routeFailures.push(`target height=${state.minTargetHeight}`);

      const key = `${route} ${viewport.name}`;
      results.push({ key, ...state, focus, pageErrors, screenshot });
      if (routeFailures.length) failures.push({ key, failures: routeFailures });
      await page.close();
    }
    await context.close();
  }

  await browser.close();
  fs.writeFileSync('/tmp/footer-pr1-qa/results.json', JSON.stringify(results, null, 2));
  if (failures.length) {
    console.error(JSON.stringify(failures, null, 2));
    process.exit(1);
  }
  console.log(`Browser QA passed: ${results.length} route/viewport combinations.`);
})();
JS

rm -f .github/footer-pr1-migrate.py
rm -f .github/footer-pr1-run.sh
rm -f .github/workflows/footer-pr1-migrate.yml
rm -f .footer-pr1-manifest.json
rm -rf _site node_modules package.json package-lock.json

git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

git add \
  about/index.html ru/about/index.html \
  contact/index.html ru/contact/index.html \
  ai-systems/index.html ru/ai-systems/index.html \
  websites-branding/index.html ru/websites-branding/index.html \
  _includes/footer-system/footer.html \
  _includes/footer-system/commercial.html \
  _includes/footer-system/brand-zone.html \
  _includes/footer-system/bottom.html \
  _data/footer.yml _data/social-links.yml \
  assets/css/footer-system-v1.css \
  .github/footer-pr1-migrate.py \
  .github/footer-pr1-run.sh \
  .github/workflows/footer-pr1-migrate.yml

git diff --cached --check
git commit -m "Migrate Commercial secondary footers"
git push origin HEAD:agent/footer-system-pr1-commercial-secondary
