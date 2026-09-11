# One-shot closeout patcher. Remove before final merge.
from pathlib import Path
import re

ROOT = Path('.')
EN = 'https://proai-expert.com/assets/social/proai-home-og-en-r1-1.png'
RU = 'https://proai-expert.com/assets/social/proai-home-og-ru-r1-1.png'
EN_ALT = 'ProAI Expert — From first impression to result — one system.'
RU_ALT = 'ProAI Expert — От первого впечатления до результата — одна система.'

# Deployment must fail on bad source; it must not repair current source before build.
workflow = ROOT / '.github/workflows/deploy-pages.yml'
text = workflow.read_text(encoding='utf-8')
old = '''      - name: Materialize social preview assets and normalize source
        shell: bash
        run: python scripts/apply-social-preview-defaults.py --mode source --root .
'''
new = '''      - name: Verify committed social preview and Favicon R2 source authority
        shell: bash
        run: python scripts/apply-social-preview-defaults.py --mode check-source --root .
'''
if old not in text:
    raise SystemExit('Expected legacy source-normalization deployment step not found')
workflow.write_text(text.replace(old, new), encoding='utf-8')

# Keep one source-of-truth checker rather than duplicated PowerShell logic.
(ROOT / 'scripts/check-social-preview.ps1').write_text('''$ErrorActionPreference = "Stop"\npython scripts/apply-social-preview-defaults.py --mode check-source --root .\nif ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }\nWrite-Output "Social preview + Favicon R2 source authority check passed."\n''', encoding='utf-8')

# Current policy: committed approved assets, no bootstrap reconstruction, no unapproved page-specific OG.
(ROOT / '.ai/social-preview-policy.md').write_text(f'''# ProAI Expert Social Preview / OG Authority\n\nStatus: production authority.\n\n## Approved default assets\n\n- EN: `{EN}`\n- RU: `{RU}`\n- Required dimensions: `1200 x 630`\n- `twitter:card`: `summary_large_image`\n\nThese PNG files are committed production assets under `assets/social/`. Deployment must not reconstruct them from `.ai` bootstrap fragments. Their SHA-256 and PNG dimensions are enforced by `scripts/apply-social-preview-defaults.py`.\n\n## Source authority\n\nCurrent public source HTML must already contain the approved locale-specific OG/Twitter image metadata. Known legacy screenshot URLs must not be left in source for deployment to repair.\n\nThe deploy workflow runs `--mode check-source` before Jekyll. A bad source tree fails deployment.\n\n## Generated-site guardrail\n\nAfter Jekyll build, `--mode site` deterministically normalizes generated public HTML to the same approved locale defaults. `--mode check` then verifies exact cardinality and expected values. This is a guardrail for generated/future pages, not a repair mechanism for known legacy source.\n\n## Page-specific OG exceptions\n\nThere are currently no approved page-specific OG image exceptions. A new exception requires explicit Owner approval before it becomes production authority.\n\n## Favicon relationship\n\nSocial-preview tooling delegates favicon verification to `scripts/apply-favicon-r2.py`. Approved Favicon R2 bytes and the versioned favicon/apple-touch metadata are independently enforced.\n''', encoding='utf-8')

factory_dir = ROOT / 'docs/content-factory/article-pairs-v1/stage-3-build-v1/tools'
for name in ('build-v3.js', 'build-v4.js'):
    p = factory_dir / name
    s = p.read_text(encoding='utf-8')
    s = re.sub(r'^\s*ogImage:\s*[\'\"][^\'\"]+[\'\"],\s*\n', '', s, flags=re.M)
    s = s.replace('https://proai-expert.com/assets/insights/og/${r.ogImage}', "${r.lang === 'ru' ? '" + RU + "' : '" + EN + "'}")
    s = s.replace('<meta property="og:image:alt" content="${r.seoTitle}"/>', '<meta property="og:image:alt" content="${r.lang === \'ru\' ? \'%s\' : \'%s\'}"/>' % (RU_ALT, EN_ALT))
    s = s.replace('<meta name="twitter:image:alt" content="${r.seoTitle}"/>', '<meta name="twitter:image:alt" content="${r.lang === \'ru\' ? \'%s\' : \'%s\'}"/>' % (RU_ALT, EN_ALT))
    out = []
    for line in s.splitlines(True):
        if 'href="/favicon.svg"' in line:
            indent = line[:len(line)-len(line.lstrip())]
            out.append(indent + '<link rel="icon" href="/favicon.ico?v=20260910-r2">\n')
        elif 'href="/favicon-32x32.png"' in line or 'href="/favicon-16x16.png"' in line:
            continue
        elif 'href="/apple-touch-icon.png"' in line:
            indent = line[:len(line)-len(line.lstrip())]
            out.append(indent + '<link rel="apple-touch-icon" href="/apple-touch-icon.png?v=20260910-r2">\n')
        else:
            out.append(line)
    p.write_text(''.join(out), encoding='utf-8')

# Remove obsolete article-specific OG configuration from the factory config.
config = factory_dir / 'stage3-config.js'
s = config.read_text(encoding='utf-8')
s = re.sub(r'^\s*ogImage:\s*[\'\"][^\'\"]+[\'\"],\s*\n', '', s, flags=re.M)
config.write_text(s, encoding='utf-8')

# Update factory metadata test to the approved locale default.
test = factory_dir / 'test-metadata.js'
s = test.read_text(encoding='utf-8')
s = re.sub(r'^\s*ogImage:\s*[\'\"][^\'\"]+[\'\"],\s*\n', '', s, flags=re.M)
approved_expr = "`${route.lang === 'ru' ? '" + RU + "' : '" + EN + "'}`"
s = s.replace('`https://proai-expert.com/assets/insights/og/${route.ogImage}`', approved_expr)
test.write_text(s, encoding='utf-8')

# Historical implementation records are retained, but explicitly cannot act as current authority.
for rel in (
    'docs/content-factory/article-pairs-v1/stage-3-build-v1/implementation-manifest.md',
):
    p = ROOT / rel
    if p.exists():
        s = p.read_text(encoding='utf-8')
        banner = '> HISTORICAL RECORD — social-preview asset paths listed below are retired and are not current production authority. Current authority: `.ai/social-preview-policy.md`.\n\n'
        if not s.startswith('> HISTORICAL RECORD'):
            p.write_text(banner + s, encoding='utf-8')

print('Targeted OG/favicon closeout patches applied.')
