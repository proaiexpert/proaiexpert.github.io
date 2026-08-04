#!/usr/bin/env bash
set -euo pipefail

TARGET_BRANCH="agent/footer-system-pr1-commercial-secondary-v2"
EXPECTED_HEAD="$(git ls-remote origin "refs/heads/${TARGET_BRANCH}" | awk '{print $1}')"

git fetch origin main "${TARGET_BRANCH}"
git switch --detach "origin/${TARGET_BRANCH}"
ACTUAL_HEAD="$(git rev-parse HEAD)"
if [[ "$ACTUAL_HEAD" != "$EXPECTED_HEAD" ]]; then
  echo "Target branch moved during checkout: expected $EXPECTED_HEAD, got $ACTUAL_HEAD" >&2
  exit 1
fi

echo "Validating PR90 head: $ACTUAL_HEAD"

python - <<'PY'
import re
import subprocess
from pathlib import Path

expected = {
    '.github/workflows/deploy-pages.yml',
    '_data/footer.yml',
    '_data/social-links.yml',
    '_includes/footer-system/bottom.html',
    '_includes/footer-system/brand-zone.html',
    '_includes/footer-system/commercial.html',
    '_includes/footer-system/footer.html',
    'about/index.html',
    'ai-systems/index.html',
    'assets/css/footer-system-v1.css',
    'contact/index.html',
    'ru/about/index.html',
    'ru/ai-systems/index.html',
    'ru/contact/index.html',
    'ru/websites-branding/index.html',
    'websites-branding/index.html',
}
actual = set(subprocess.check_output(
    ['git', 'diff', '--name-only', 'origin/main...HEAD'],
    text=True,
).splitlines())
actual.discard('.github/workflows/footer-pr1-v2-build-validation.yml')
assert actual == expected, {
    'unexpected': sorted(actual - expected),
    'missing': sorted(expected - actual),
}

pages = [
    'about/index.html', 'ru/about/index.html',
    'contact/index.html', 'ru/contact/index.html',
    'ai-systems/index.html', 'ru/ai-systems/index.html',
    'websites-branding/index.html', 'ru/websites-branding/index.html',
]
for path in pages:
    base = subprocess.check_output(['git', 'show', f'origin/main:{path}'], text=True)
    head = Path(path).read_text(encoding='utf-8')
    base_header = re.search(r'<header\b.*?</header>', base, flags=re.I | re.S)
    head_header = re.search(r'<header\b.*?</header>', head, flags=re.I | re.S)
    assert base_header and head_header, path
    assert base_header.group(0) == head_header.group(0), path
    assert head.startswith('---\nlayout: null\n---\n'), path
    assert head.count('{% include footer-system/footer.html') == 1, path
    assert '<footer' not in head.lower(), path
    assert '.f-' not in head, path

css = Path('assets/css/footer-system-v1.css').read_text(encoding='utf-8')
assert '.f-' not in css
assert '@media (prefers-reduced-motion:reduce)' in css
assert '@media (forced-colors:active)' in css
assert '.site-footer__brand-zone' in css

workflow = Path('.github/workflows/deploy-pages.yml').read_text(encoding='utf-8')
assert 'jekyll build --source . --destination _site' in workflow
assert 'path: _site' in workflow
assert 'Verify Footer System generated output' in workflow
assert 'path: .' not in workflow
print('Source scope, Header markup parity, CSS ownership and deploy contract passed.')
PY

rm -rf /tmp/footer-pr1-base /tmp/footer-pr1-qa _site
mkdir -p /tmp/footer-pr1-base /tmp/footer-pr1-qa
git archive origin/main | tar -x -C /tmp/footer-pr1-base

export GEM_HOME="$(ruby -e 'puts Gem.user_dir')"
export PATH="$GEM_HOME/bin:$PATH"
gem install --user-install jekyll -v 4.3.4 --no-document
gem install --user-install webrick --no-document
jekyll build --source . --destination _site

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
    assert '{% include footer-system/' not in text, output
    assert '{{ footer_' not in text and '{{ variant_copy' not in text, output
    footer_match = re.search(r'<footer\b.*?</footer>', text, flags=re.I | re.S)
    assert footer_match, output
    footer = footer_match.group(0)
    assert f'href="{locale_href}"' in footer, output
    assert 'Privacy' not in footer and 'Terms' not in footer, output
    hrefs = set(re.findall(r'href="([^"]+)"', footer))
    actual_socials = {href for href in hrefs if href.startswith('https://')}
    assert actual_socials == expected_socials, (output, actual_socials)
    if lang == 'en':
        assert 't.me/' not in footer, output
    else:
        assert footer.count('https://t.me/proAiexpert') == 2, output
print('Generated output contract passed for 8 EN/RU routes.')
PY

npm_config_package_lock=false npm install --no-save playwright@1.54.2
npx playwright install --with-deps chromium

python -m http.server 4173 --directory _site >/tmp/footer-pr1-head-server.log 2>&1 &
HEAD_SERVER_PID=$!
python -m http.server 4174 --directory /tmp/footer-pr1-base >/tmp/footer-pr1-base-server.log 2>&1 &
BASE_SERVER_PID=$!
trap 'kill $HEAD_SERVER_PID $BASE_SERVER_PID 2>/dev/null || true' EXIT
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
const headerSelectors = [
  'header',
  'header .header-container',
  'header .logo-block',
  'header .logo-cube-container',
  'header .logo-cube',
  'header .logo-text',
  'header .site-nav',
  'header .header-actions',
  'header .lang-link',
  'header .start-btn, header .btn',
  'header .mobile-menu-toggle'
];
const styleProps = [
  'display','position','top','right','bottom','left','width','height',
  'paddingTop','paddingRight','paddingBottom','paddingLeft',
  'marginTop','marginRight','marginBottom','marginLeft',
  'fontFamily','fontSize','fontWeight','lineHeight','letterSpacing',
  'color','backgroundColor','borderTopWidth','borderRightWidth',
  'borderBottomWidth','borderLeftWidth','borderRadius','opacity','visibility',
  'animationName','animationDuration','transformStyle'
];

function intersects(a, b) {
  return !(a.bottom <= b.top || a.top >= b.bottom || a.right <= b.left || a.left >= b.right);
}
function closeEnough(a, b, tolerance = 0.75) {
  return Math.abs(a - b) <= tolerance;
}

async function headerSnapshot(page) {
  return page.evaluate(({ selectors, props }) => {
    const output = {};
    for (const selector of selectors) {
      const elements = [...document.querySelectorAll(selector)];
      output[selector] = elements.map((el) => {
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const styles = {};
        for (const prop of props) styles[prop] = cs[prop];
        return {
          html: el.outerHTML,
          styles,
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
        };
      });
    }
    return output;
  }, { selectors: headerSelectors, props: styleProps });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const failures = [];
  const results = [];

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    for (const route of routes) {
      const basePage = await context.newPage();
      const headPage = await context.newPage();
      const pageErrors = [];
      headPage.on('pageerror', error => pageErrors.push(String(error)));

      await Promise.all([
        basePage.goto(`http://127.0.0.1:4174${route}`, { waitUntil: 'networkidle' }),
        headPage.goto(`http://127.0.0.1:4173${route}`, { waitUntil: 'networkidle' })
      ]);
      await Promise.all([basePage.evaluate(() => scrollTo(0, 0)), headPage.evaluate(() => scrollTo(0, 0))]);

      const [baseHeader, headHeader] = await Promise.all([headerSnapshot(basePage), headerSnapshot(headPage)]);
      const routeFailures = [];
      for (const selector of headerSelectors) {
        const baseItems = baseHeader[selector];
        const headItems = headHeader[selector];
        if (baseItems.length !== headItems.length) {
          routeFailures.push(`header count mismatch ${selector}: ${baseItems.length}/${headItems.length}`);
          continue;
        }
        for (let i = 0; i < baseItems.length; i++) {
          if (baseItems[i].html !== headItems[i].html) {
            routeFailures.push(`header markup mismatch ${selector}[${i}]`);
          }
          for (const prop of styleProps) {
            if (baseItems[i].styles[prop] !== headItems[i].styles[prop]) {
              routeFailures.push(`header style mismatch ${selector}[${i}] ${prop}: ${baseItems[i].styles[prop]} / ${headItems[i].styles[prop]}`);
            }
          }
          if (selector !== 'header .logo-cube') {
            for (const prop of ['x','y','width','height']) {
              if (!closeEnough(baseItems[i].rect[prop], headItems[i].rect[prop])) {
                routeFailures.push(`header rect mismatch ${selector}[${i}] ${prop}: ${baseItems[i].rect[prop]} / ${headItems[i].rect[prop]}`);
              }
            }
          }
        }
      }

      const baseOverflow = await basePage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      await headPage.locator('.site-footer').scrollIntoViewIfNeeded();
      const state = await headPage.evaluate(() => {
        const footer = document.querySelector('.site-footer');
        const main = document.querySelector('.site-footer__main');
        const brand = document.querySelector('.site-footer__brand-zone');
        const watermark = document.querySelector('.site-footer__watermark');
        const bottom = document.querySelector('.site-footer__bottom');
        const title = document.querySelector('.site-footer__cta h2');
        const links = [...document.querySelectorAll('.site-footer a')];
        const rect = el => {
          const r = el.getBoundingClientRect();
          return { top: r.top, right: r.right, bottom: r.bottom, left: r.left, width: r.width, height: r.height };
        };
        const hrefs = links.map(link => link.getAttribute('href'));
        const footerOverflowing = [...footer.querySelectorAll('*')].map(el => {
          const r = el.getBoundingClientRect();
          return { tag: el.tagName.toLowerCase(), className: typeof el.className === 'string' ? el.className : '', left: r.left, right: r.right };
        }).filter(item => item.left < -1 || item.right > document.documentElement.clientWidth + 1);
        return {
          footerCount: document.querySelectorAll('.site-footer').length,
          pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          footerInternalOverflow: footer.scrollWidth - footer.clientWidth,
          footerOverflowing,
          main: rect(main), brand: rect(brand), watermark: rect(watermark), bottom: rect(bottom),
          animationName: getComputedStyle(title).animationName,
          transitionDuration: getComputedStyle(title).transitionDuration,
          minTargetHeight: Math.min(...links.map(link => link.getBoundingClientRect().height)),
          hrefs,
          hasHeader: Boolean(document.querySelector('header')),
        };
      });

      await headPage.locator('.site-footer a').first().focus();
      const focus = await headPage.locator('.site-footer a').first().evaluate(el => {
        const style = getComputedStyle(el);
        return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
      });

      if (state.footerCount !== 1) routeFailures.push(`footerCount=${state.footerCount}`);
      if (state.pageOverflow > baseOverflow + 1) routeFailures.push(`page overflow regression base=${baseOverflow} head=${state.pageOverflow}`);
      if (state.footerInternalOverflow > 1 || state.footerOverflowing.length) routeFailures.push(`footer overflow=${state.footerInternalOverflow} ${JSON.stringify(state.footerOverflowing)}`);
      if (intersects(state.main, state.brand)) routeFailures.push('main intersects brand zone');
      if (intersects(state.brand, state.bottom)) routeFailures.push('brand zone intersects bottom');
      if (state.watermark.left < state.brand.left - 1 || state.watermark.right > state.brand.right + 1) routeFailures.push('watermark escapes brand zone');
      if (state.animationName !== 'none') routeFailures.push(`reduced-motion animation=${state.animationName}`);
      if (focus.outlineStyle === 'none' || focus.outlineWidth === '0px') routeFailures.push('focus indicator missing');
      if (!state.hasHeader) routeFailures.push('header missing');
      if (pageErrors.length) routeFailures.push(`page errors: ${pageErrors.join('; ')}`);
      if (viewport.name !== 'landscape' && state.minTargetHeight < 40) routeFailures.push(`target height=${state.minTargetHeight}`);

      const isRu = route.startsWith('/ru/');
      const socialUrls = state.hrefs.filter(href => href && href.startsWith('https://'));
      const expectedSocials = isRu
        ? ['https://www.linkedin.com/in/ihorhorb/','https://github.com/proaiexpert','https://x.com/proaiexpert','https://t.me/proAiexpert','https://t.me/proAiexpert']
        : ['https://www.linkedin.com/in/ihorhorb/','https://github.com/proaiexpert','https://x.com/proaiexpert'];
      if (JSON.stringify(socialUrls.sort()) !== JSON.stringify(expectedSocials.sort())) {
        routeFailures.push(`social matrix mismatch ${JSON.stringify(socialUrls)}`);
      }

      const slug = route.replace(/^\/+|\/+$/g, '').replaceAll('/', '-') || 'home';
      const screenshot = `/tmp/footer-pr1-qa/${slug}-${viewport.name}.png`;
      await headPage.screenshot({ path: screenshot, fullPage: true });
      const key = `${route} ${viewport.name}`;
      results.push({ key, baseOverflow, ...state, focus, pageErrors, screenshot });
      if (routeFailures.length) failures.push({ key, failures: routeFailures });

      await basePage.close();
      await headPage.close();
    }
    await context.close();
  }

  await browser.close();
  fs.writeFileSync('/tmp/footer-pr1-qa/results.json', JSON.stringify(results, null, 2));
  fs.writeFileSync('/tmp/footer-pr1-qa/summary.json', JSON.stringify({ failures, count: results.length }, null, 2));
  if (failures.length) {
    console.error(JSON.stringify(failures, null, 2));
    process.exit(1);
  }
  console.log(`PR90 browser and Header parity QA passed: ${results.length} route/viewport combinations.`);
})();
JS
