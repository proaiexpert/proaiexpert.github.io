#!/usr/bin/env python3
from pathlib import Path
import os, re

PRODUCT_SHA = os.environ.get('PRODUCT_SHA', 'eac0959950cb5e900296f811f1d92027ed2003e1')
OUT = Path('docs/site-evolution/reviews/proai-home-golden-assembly-r1-2')
RAW = f'https://raw.githack.com/proaiexpert/proaiexpert.github.io/{PRODUCT_SHA}/'

TAG_RE = re.compile(r'<(?:link|script|img|source)\b[^>]*>', re.I)
ATTR_RE = re.compile(r'\b(href|src|srcset)=("|\')(.*?)(\2)', re.I | re.S)


def rewrite_srcset(value: str) -> str:
    parts = []
    for item in value.split(','):
        piece = item.strip()
        if not piece:
            continue
        bits = piece.split()
        url = bits[0]
        if url.startswith('/') and not url.startswith('//'):
            url = RAW + url.lstrip('/')
        parts.append(' '.join([url] + bits[1:]))
    return ', '.join(parts)


def rewrite_tag(match: re.Match) -> str:
    tag = match.group(0)
    low = tag.lower()
    def attr(m: re.Match) -> str:
        name, quote, value = m.group(1), m.group(2), m.group(3)
        lname = name.lower()
        allowed = (
            (low.startswith('<link') and lname == 'href') or
            (low.startswith('<script') and lname == 'src') or
            (low.startswith('<img') and lname in ('src', 'srcset')) or
            (low.startswith('<source') and lname in ('src', 'srcset'))
        )
        if not allowed:
            return m.group(0)
        if lname == 'srcset':
            value = rewrite_srcset(value)
        elif value.startswith('/') and not value.startswith('//'):
            value = RAW + value.lstrip('/')
        return f'{name}={quote}{value}{quote}'
    return ATTR_RE.sub(attr, tag)


def build(lang: str, source: Path, target: Path) -> None:
    html = source.read_text(encoding='utf-8')
    html = TAG_RE.sub(rewrite_tag, html)
    html = html.replace('<html lang=', f'<html data-owner-review="golden-r1-2" data-product-sha="{PRODUCT_SHA}" lang=', 1)
    malformed = [
        r'raw\.githack\.com[^\s<]*["\']data:',
        r'raw\.githack\.com[^\s<]*/data:image',
        r'url\(["\']https?://[^)]*/["\']data:',
    ]
    for pattern in malformed:
        if re.search(pattern, html, re.I):
            raise SystemExit(f'Malformed immutable URL in {lang}: {pattern}')
    target.write_text(html, encoding='utf-8')


OUT.mkdir(parents=True, exist_ok=True)
build('en', Path('_site/index.html'), OUT / 'owner-review-en.html')
build('ru', Path('_site/ru/index.html'), OUT / 'owner-review-ru.html')

launcher = '''<!doctype html><meta charset="utf-8"><title>ProAI Golden R1.2 Owner Review</title><script>
const p=new URLSearchParams(location.search);const l=p.get('lang')==='ru'?'ru':'en';location.replace(`owner-review-${l}.html`+location.hash);
</script><noscript><a href="owner-review-en.html">EN</a> · <a href="owner-review-ru.html">RU</a></noscript>'''
(OUT / 'index.html').write_text(launcher, encoding='utf-8')
print(f'Golden R1.2 immutable review generated for product {PRODUCT_SHA}')
