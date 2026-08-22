#!/usr/bin/env python3
from pathlib import Path
import os, runpy

PRODUCT_SHA = os.environ.get('PRODUCT_SHA', 'a876dfb178fd3f020c8392b336eae62253f89ae7')
os.environ['PRODUCT_SHA'] = PRODUCT_SHA
ROOT = Path('docs/site-evolution/reviews/proai-home-golden-assembly-r1-2')
runpy.run_path(str(ROOT / 'generate-owner-review.py'), run_name='__main__')

badge = f'''<style id="owner-preview-qa-pending-style">#owner-preview-qa-pending{{position:fixed;right:12px;bottom:12px;z-index:2147483647;padding:8px 11px;border:1px solid rgba(255,255,255,.22);border-radius:999px;background:rgba(6,11,18,.86);backdrop-filter:blur(10px);color:#f2f6f8;font:600 10px/1.2 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.08em;pointer-events:none;box-shadow:0 8px 30px rgba(0,0,0,.22)}}@media(max-width:600px){{#owner-preview-qa-pending{{right:8px;bottom:8px;font-size:8px;padding:7px 9px}}}}</style>'''
marker = f'<div id="owner-preview-qa-pending" data-preview-status="qa-pending" data-product-sha="{PRODUCT_SHA}">OWNER PREVIEW — QA PENDING</div>'
for lang in ('en','ru'):
    path = ROOT / f'owner-review-{lang}.html'
    html = path.read_text(encoding='utf-8')
    if f'data-product-sha="{PRODUCT_SHA}"' not in html:
        raise SystemExit(f'Product pin missing in {lang} preview')
    html = html.replace('</head>', badge + '</head>', 1)
    html = html.replace('</body>', marker + '</body>', 1)
    html = html.replace('<title>', '<title>OWNER PREVIEW — QA PENDING · ', 1)
    path.write_text(html, encoding='utf-8')
launcher = ROOT / 'index.html'
text = launcher.read_text(encoding='utf-8').replace('ProAI Golden R1.2 Owner Review','OWNER PREVIEW — QA PENDING · ProAI Golden R1.2')
launcher.write_text(text, encoding='utf-8')
print(f'Owner preview generated and labeled for product {PRODUCT_SHA}')
