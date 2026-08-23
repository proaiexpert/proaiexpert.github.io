from pathlib import Path
import re, shutil

PRODUCT_SHA='d5f562ac4c0c84b4ec06e913ec7e0f82d133beab'
OUT=Path('docs/site-evolution/reviews/proai-home-golden-assembly-r1-2')
OUT.mkdir(parents=True, exist_ok=True)

DYNAMIC_IMPORTMAP = '''<script data-owner-review-importmap-bootstrap>\n(function(){\n  var marker='/docs/site-evolution/reviews/';\n  var root=location.href.split(marker)[0]+'/';\n  var map={imports:{three:root+'assets/vendor/three-r180/build/three.module.min.js','three/addons/':root+'assets/vendor/three-r180/examples/jsm/'}};\n  document.write('<script type="importmap">'+JSON.stringify(map).replace(/</g,'\\u003c')+'<\/script>');\n})();\n</script>'''

def package_page(src, lang):
    html=Path(src).read_text(encoding='utf-8')
    html=re.sub(r'<script type="importmap">.*?</script>', DYNAMIC_IMPORTMAP, html, count=1, flags=re.S)
    html=html.replace('"/assets/', '"../../../../assets/')
    html=html.replace("'/assets/", "'../../../../assets/")
    html=html.replace('data-logo-live-src="../../../../assets/brand/proai-logo-r341/live.html?mode=living&amp;startup=controlled"',
                      'data-logo-live-src="header-live-logo.html?mode=living&amp;startup=controlled"')
    html=html.replace('data-logo-live-src="../../../../assets/brand/proai-logo-r341/live.html?mode=living&startup=controlled"',
                      'data-logo-live-src="header-live-logo.html?mode=living&amp;startup=controlled"')
    html=re.sub(r'<html\s+lang="'+lang+r'"', f'<html data-owner-review="golden-r1-2-final-authority" data-product-sha="{PRODUCT_SHA}" lang="{lang}"', html, count=1)
    (OUT/f'owner-review-{lang}.html').write_text(html,encoding='utf-8')

package_page('_site/index.html','en')
package_page('_site/ru/index.html','ru')

live_runtime=Path('assets/brand/proai-logo-r341/live-runtime.js').read_text(encoding='utf-8')
live_runtime=live_runtime.replace("const SOURCE_URL='/assets/js/proai-hero-cube-r1/source-materials-r1.js';", "const SOURCE_URL='../../../../assets/js/proai-hero-cube-r1/source-materials-r1.js';")
live_runtime=live_runtime.replace("const GLB_URL='/assets/models/proai-cube/rubik_39_s_cube_animation.glb';", "const GLB_URL='../../../../assets/models/proai-cube/rubik_39_s_cube_animation.glb';")
(OUT/'header-live-runtime.js').write_text(live_runtime,encoding='utf-8')

header_live='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent}body{display:grid;place-items:center}#cube-canvas{display:block;width:100%;height:100%;background:transparent;transform:none;filter:none!important}#runtime-status{display:none!important}</style>'''+DYNAMIC_IMPORTMAP+'''</head><body><canvas id="cube-canvas" aria-hidden="true"></canvas><span id="runtime-status" aria-hidden="true"></span><script type="module" src="./header-live-runtime.js"></script></body></html>'''
(OUT/'header-live-logo.html').write_text(header_live,encoding='utf-8')

router='''<!doctype html><meta charset="utf-8"><title>ProAI Golden R1.2 Final Authority Owner Review</title><script>const p=new URLSearchParams(location.search);location.replace((p.get('lang')==='ru'?'owner-review-ru.html':'owner-review-en.html')+location.hash);</script>'''
(OUT/'index.html').write_text(router,encoding='utf-8')
print(f'Generated final-authority immutable review package for {PRODUCT_SHA}')
