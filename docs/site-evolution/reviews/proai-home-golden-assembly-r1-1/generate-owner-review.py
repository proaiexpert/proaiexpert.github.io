from pathlib import Path
from urllib.parse import urljoin
import os,re

PRODUCT_SHA=os.environ['PRODUCT_SHA']
ROOT=f'https://raw.githack.com/proaiexpert/proaiexpert.github.io/{PRODUCT_SHA}/'
OUT=Path('docs/site-evolution/reviews/proai-home-golden-assembly-r1-1')
SITE=Path('_site')
PROXY=OUT/'proxy'
OUT.mkdir(parents=True,exist_ok=True)
PROXY.mkdir(parents=True,exist_ok=True)


def css_proxy(path):
    clean=path.split('?',1)[0].lstrip('/')
    src=SITE/clean
    css=src.read_text(encoding='utf-8')
    base=urljoin(ROOT,clean)
    def repl(m):
        token=m.group(1).strip()
        raw=token
        if len(raw)>=2 and raw[0] in "'\"" and raw[-1]==raw[0]:
            raw=raw[1:-1]
        if raw.startswith(('data:','http://','https://','#','var(')):
            target=raw
        elif raw.startswith('/'):
            target=ROOT+raw.lstrip('/')
        else:
            target=urljoin(base,raw)
        return f'url("{target}")'
    css=re.sub(r'url\(([^)]+)\)',repl,css)
    dst=PROXY/clean
    dst.parent.mkdir(parents=True,exist_ok=True)
    dst.write_text(css,encoding='utf-8')
    return 'proxy/'+clean


def js_proxy(path):
    clean=path.split('?',1)[0].lstrip('/')
    src=SITE/clean
    js=src.read_text(encoding='utf-8')
    for prefix in ('/assets/','/mobile-','/ru/about/'):
        replacement=ROOT+prefix.lstrip('/')
        for q in ("'",'"','`'):
            js=js.replace(q+prefix,q+replacement)
    dst=PROXY/clean
    dst.parent.mkdir(parents=True,exist_ok=True)
    dst.write_text(js,encoding='utf-8')
    return 'proxy/'+clean


def build(route,outname):
    html=(SITE/route).read_text(encoding='utf-8')

    def link_repl(m):
        before,href,after=m.group(1),m.group(2),m.group(3)
        if not href.startswith('/'):
            return m.group(0)
        prox=css_proxy(href)
        return before+prox+after
    html=re.sub(r'(<link\b[^>]*\brel=["\']stylesheet["\'][^>]*\bhref=["\'])(/[^"\']+)(["\'][^>]*>)',link_repl,html,flags=re.I)
    html=re.sub(r'(<link\b[^>]*\bhref=["\'])(/[^"\']+\.css(?:\?[^"\']*)?)(["\'][^>]*>)',link_repl,html,flags=re.I)

    def script_repl(m):
        before,src,after=m.group(1),m.group(2),m.group(3)
        if not src.startswith('/'):
            return m.group(0)
        prox=js_proxy(src)
        return before+prox+after
    html=re.sub(r'(<script\b[^>]*\bsrc=["\'])(/[^"\']+\.js(?:\?[^"\']*)?)(["\'][^>]*>)',script_repl,html,flags=re.I)

    for attr in ('src','poster','data-logo-live-src'):
        html=re.sub(rf'({attr}=["\'])/(assets/[^"\']+)',lambda m:m.group(1)+ROOT+m.group(2),html,flags=re.I)
    html=html.replace('srcset="/assets/',f'srcset="{ROOT}assets/')
    html=html.replace(", /assets/",f", {ROOT}assets/")
    html=html.replace("srcset='/assets/",f"srcset='{ROOT}assets/")

    html=re.sub(r'(href=["\'])/(?!/)(?!assets/)([^"\']*)',lambda m:m.group(1)+'https://proai-expert.com/'+m.group(2),html,flags=re.I)
    (OUT/outname).write_text(html,encoding='utf-8')


build('index.html','owner-review-en.html')
build('ru/index.html','owner-review-ru.html')

index='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ProAI Golden Assembly R1.1 Owner Review</title></head><body><script>(function(){const p=new URLSearchParams(location.search);const lang=p.get('lang')==='ru'?'ru':'en';location.replace('owner-review-'+lang+'.html');})();</script><noscript><a href="owner-review-en.html">EN</a> · <a href="owner-review-ru.html">RU</a></noscript></body></html>'''
(OUT/'index.html').write_text(index,encoding='utf-8')
print('Golden R1.1 Owner review generated')
