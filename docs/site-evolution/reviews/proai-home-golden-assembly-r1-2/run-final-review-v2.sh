#!/usr/bin/env bash
set -Eeuo pipefail
PRODUCT_SHA='d5f562ac4c0c84b4ec06e913ec7e0f82d133beab'
PRODUCTION_MAIN='c945084e1952c05c686494091f7dbca0f7acdf08'
REVIEW_ROOT='docs/site-evolution/reviews/proai-home-golden-assembly-r1-2'
OUT="$REVIEW_ROOT/final-authority"
QA="$REVIEW_ROOT/final-authority-reconciliation-qa.mjs"
mkdir -p "$OUT/media"
rm -f "$OUT/media"/*.png "$OUT"/*.json "$OUT"/*.md

cleanup(){
  for p in "${PRODUCT_PID:-}" "${ROOT_PID:-}" "${DONOR_PID:-}"; do [[ -n "$p" ]] && kill "$p" >/dev/null 2>&1 || true; done
}
trap cleanup EXIT

# Safety: review-only head over exact product; production main must remain pinned.
test "$(git rev-parse origin/main)" = "$PRODUCTION_MAIN"
git merge-base --is-ancestor "$PRODUCT_SHA" HEAD
python - <<'PY'
import subprocess,sys
product='d5f562ac4c0c84b4ec06e913ec7e0f82d133beab'
changed=subprocess.check_output(['git','diff','--name-only',product,'HEAD'],text=True).splitlines()
allowed=('docs/site-evolution/reviews/','docs/site-evolution/PROAI_HOME_GOLDEN_ASSEMBLY_R1_MANIFEST.md')
bad=[p for p in changed if not (p.startswith(allowed[0]) or p==allowed[1])]
print('REVIEW_ONLY_CHANGED',len(changed),changed)
if bad: raise SystemExit('non-review temp changes: '+', '.join(bad))
PY

# Exact authority hashes. Match components stay immutable; only the approved Golden landscape bridge is assembly-specific.
python - <<'PY'
from pathlib import Path
import subprocess,json,sys
product='d5f562ac4c0c84b4ec06e913ec7e0f82d133beab'
expected={
'_includes/header-system/header.html':'6edc924df1df630a69379dfd746d161bab2fbe98',
'assets/css/header-system-v1.css':'1e7651d5014b4b7b2e6f3d6a662b5431a7692f71',
'assets/js/header-system-v1.js':'bb107dd6054ba5210b4f77568e04014cdb239c55',
'assets/css/homepage-hero-signature-r3.css':'5dde833560aac0958875842a598f622942597b74',
'assets/js/proai-hero-cube-r1/source-final-motion-r2-touch-auto-45-r1.js':'fc2c0ba13692c94f5838008d09f05dda9859e9d2',
'assets/js/proai-hero-cube-r1/source-final-motion-r2.js':'67ca618cf10a47561d351715968187d2e4c50351',
'assets/js/proai-hero-cube-r1/source-materials-r1.js':'f9298b0b00feaae4123eb5a7161f24f669ae0eca',
'_includes/homepage-connected-system-en.html':'6bf4b0c236ab9063b7588faf5c59f660f64b71aa',
'_includes/homepage-connected-system-ru.html':'92081f9f98f43a9f794d2c5a49b7bce19aafae16',
'assets/css/homepage-connected-system-r13.css':'b99dfc19739070fee88d47c94c202d60feab7619',
'assets/js/homepage-connected-system-r13.js':'8fba38d49366bb69b7e06f9527dd4d07d8d05279',
'_includes/homepage-two-worlds-golden-r1-en-assembly.html':'ee48db8f844f61e3abb10f603bf8dabb3987dbc3',
'_includes/homepage-two-worlds-golden-r1-ru-assembly.html':'0c119addfee214d1c32cf31385c7f9f37048829d',
'assets/css/homepage-two-worlds-golden-r1.css':'671813c61cf63e941ecf993f46cd385100c7ed2a',
'assets/js/homepage-two-worlds-golden-r1.js':'e2927f804003882f2218aa4b86741c6aae32d5a9',
'_includes/home-technology-transition-r2.html':'a05749f9a7f96a42b7f4b84eb2fb822fae13d310',
'assets/css/home-technology-transition-r2.css':'f76f8b931c3ad0667c50a5b474b09c793af7e08d',
'assets/js/home-technology-transition-r2.js':'230b4b6ded23fe66509f774641fa50eadfbdfa4e',
'assets/css/home-technology-transition-r2-golden-mobile.css':'d52ecb0942ec9641353e7c1b4057406ef2c2ac4c',
'_includes/home-work-proof-financial-stream-r1-4-en.html':'7f272fd438ca97a37dd86f30da9244bcfaf56923',
'_includes/home-work-proof-financial-stream-r1-4-ru.html':'2261484cf094bbb52d44f9bdb7f2b49096191ad8',
'assets/css/home-work-proof-financial-stream-r1-4.css':'8b2928f6315c3c44824dd18c2359bca738d9841e',
'assets/js/home-work-proof-financial-stream-r1-1.js':'925221226fdb2f94b117a10dfd0fdb75b2151cee',
'_includes/home-selected-thinking-r1-en.html':'bbe1d55dcc454dc156a6084c4c17613130f38bd3',
'_includes/home-selected-thinking-r1-ru.html':'51cb7b82a069335b21f401eab8ed5d5f0bd4ead7',
'assets/css/home-selected-thinking-r1.css':'1551761f4e81da26fcaaf2d4d65e221f20149ae7',
'assets/css/home-selected-thinking-r1-1.css':'444e56140bbdf091e422c5046c34ba248ed33a2b',
'assets/css/home-selected-thinking-r1-2.css':'9f40b2f077de24cfbb281311e7c128efdc3e0559',
'assets/js/home-selected-thinking-r1.js':'a85b0070014eb99c83a906ce5c97ba706a9b46cd',
'_includes/home-selected-work-golden-r1-2-en.html':'94996786b82e419bc1af93af6aefa2c06d9561e4',
'_includes/home-selected-work-golden-r1-2-ru.html':'bdb606ff8f7d8b10ee94a3ff7a2a5d624da4dba0',
'assets/css/portfolio-entry-bridge-v1.css':'01d254b9a03fa1673078d635f4b9948ce88119d8',
'assets/css/home-selected-work-golden-r1-2.css':'bfc0eac3a30732df10f00ce65d98774fb3863c10',
'_includes/home-footer-golden-r3.html':'b6b75943011a0fab1cec3b59d4f3a018fb53af74',
'assets/css/home-footer-golden-r3.css':'5563a0ec5223664934e0b55afa8626519cfff058',
'assets/css/home-footer-golden-r3-1.css':'cc1c307d2548422879a443c7597c936fb365b5b2',
'assets/js/home-footer-golden-r3.js':'3c2bad4aa8e3930243a2e3912679bdd936d9ea5a',
}
rows=[]
for path,want in expected.items():
    got=subprocess.check_output(['git','hash-object',path],text=True).strip();rows.append({'path':path,'expected':want,'actual':got,'match':got==want})
for path in ['assets/css/homepage-two-worlds-golden-r1-landscape-fix.css','assets/js/homepage-two-worlds-golden-r1-landscape-fix.js']:
    got=subprocess.check_output(['git','hash-object',path],text=True).strip();rows.append({'path':path,'expected':'GOLDEN_SCOPED_BRIDGE','actual':got,'match':True})
out={'productSha':product,'rows':rows,'pass':all(r['match'] for r in rows)}
root=Path('docs/site-evolution/reviews/proai-home-golden-assembly-r1-2/final-authority');root.mkdir(parents=True,exist_ok=True);(root/'authority-hashes.json').write_text(json.dumps(out,indent=2),encoding='utf-8')
if not out['pass']:
    print([r for r in rows if not r['match']]);sys.exit(1)
PY

# Product wiring / no legacy reintroduction.
python - <<'PY'
from pathlib import Path
for p,lang in [('index.html','en'),('ru/index.html','ru')]:
 t=Path(p).read_text(encoding='utf-8')
 assert 'homepage-two-worlds-golden-r1-landscape-fix.css' in t and 'homepage-two-worlds-golden-r1-landscape-fix.js' in t
 assert 'home-footer-golden-r3.html' in t and 'home-footer-watermark-r2.html' not in t
 assert 'home-selected-thinking-r1-' + lang + '.html' in t
 assert 'home-selected-work-golden-r1-2-' + lang + '.html' in t
 assert 'homepage-founder-proof' not in t and 'homepage-materials-editorial-v2.css' not in t
PY

# Build exact Golden product.
export GEM_HOME="$(ruby -e 'puts Gem.user_dir')"; export PATH="$GEM_HOME/bin:$PATH"
gem install --user-install jekyll -v 4.3.4 --no-document
gem install --user-install webrick --no-document
jekyll build --source . --destination _site
python - <<'PY'
from pathlib import Path
for route in ('index.html','ru/index.html'):
 t=(Path('_site')/route).read_text(encoding='utf-8')
 assert t.count('data-connected-system')==1
 assert t.count('data-tw-golden-r1')==1
 assert t.count('data-home-tech-r2')==1 and 'tw-tech-r2' not in t
 assert t.count('home-fs-showcase-r14')==1
 assert t.count('data-selected-thinking-r1')==1
 assert t.count('id="selected-work"')==1
 assert t.count('data-home-footer-golden-r3')==1 and 'data-footer-watermark-r2' not in t
 assert 'homepage-founder-proof' not in t and 'materials-editorial' not in t
PY

npm install --no-save playwright@1.55.0 pngjs@7.0.0
npx playwright install --with-deps chromium
python3 -m http.server 4173 --directory _site >/tmp/golden-product.log 2>&1 & PRODUCT_PID=$!
python3 -m http.server 4174 --directory . >/tmp/golden-preview.log 2>&1 & ROOT_PID=$!
python3 -m http.server 4175 --directory . >/tmp/golden-donor.log 2>&1 & DONOR_PID=$!
for port in 4173 4174 4175; do ok=0; for i in {1..30}; do if curl -fsS "http://127.0.0.1:${port}/" >/dev/null; then ok=1; break; fi; sleep 1; done; test "$ok" = 1; done

PRODUCT_BASE='http://127.0.0.1:4173/' PREVIEW_BASE='http://127.0.0.1:4174/docs/site-evolution/reviews/proai-home-golden-r1-2-owner-preview-rescue/' node "$QA"
PRODUCT_BASE_URL='http://127.0.0.1:4173/' DONOR_BASE_URL='http://127.0.0.1:4175/docs/site-evolution/reviews/proai-cube-touch-auto-45-r1/review.html?variant=B' node "$REVIEW_ROOT/hero-donor-parity.mjs"
cp "$REVIEW_ROOT/hero-donor-parity.json" "$OUT/hero-donor-parity.json"
cp "$REVIEW_ROOT/media"/hero-donor-*.png "$OUT/media/" 2>/dev/null || true
cp "$REVIEW_ROOT/media"/hero-assembly-*.png "$OUT/media/" 2>/dev/null || true

python - <<'PY'
from pathlib import Path
import json
root=Path('docs/site-evolution/reviews/proai-home-golden-assembly-r1-2/final-authority')
qa=json.loads((root/'qa-report.json').read_text())
hashes=json.loads((root/'authority-hashes.json').read_text())
hero=json.loads((root/'hero-donor-parity.json').read_text())
rows=hashes['rows']
md=['# Golden Assembly R1.2 — Final Authority Matrix','','| Component file | Target | Actual | Result |','|---|---|---|---|']
for r in rows: md.append(f"| `{r['path']}` | `{r['expected']}` | `{r['actual']}` | {'MATCH' if r['match'] else 'FAIL'} |")
(root/'AUTHORITY_MATRIX.md').write_text('\n'.join(md)+'\n',encoding='utf-8')
land=qa['twoWorlds']['landscape'];fsd=qa['financial']['desktop'];
par=f'''# Golden Assembly R1.2 — Final Parity Report

- Product: `d5f562ac4c0c84b4ec06e913ec7e0f82d133beab`
- Full EN/RU viewport matrix: **{'PASS' if all(x['pass'] for x in qa['matrix']) else 'FAIL'}**
- Hero + Cube donor parity: **{'PASS' if hero.get('pass') else 'FAIL'}**
- Cube desktop visible/runtime: **{'PASS' if qa['cube']['desktop']['pass'] else 'FAIL'}**
- Connected autonomous cadence: `{qa['connected'].get('intervals')}` ms — **{'PASS' if qa['connected']['pass'] else 'FAIL'}**
- Two Worlds desktop: **{'PASS' if qa['twoWorlds']['desktop']['en1440']['pass'] else 'FAIL'}**
- Two Worlds portrait EN/RU: **{'PASS' if all(v['pass'] for v in qa['twoWorlds']['portrait'].values()) else 'FAIL'}**
- Two Worlds landscape 844/932/812/852 EN/RU: **{'PASS' if all(v['pass'] for v in land.values()) else 'FAIL'}**
- Technology mobile bridge: **{'PASS' if all(v['pass'] for v in qa['technology'].values()) else 'FAIL'}**
- Financial Stream R1.4 desktop delivery: **{'PASS' if all(v['pass'] for v in fsd.values()) else 'FAIL'}**
- Financial Stream R1.4 mobile delivery: **{'PASS' if all(v['pass'] for v in qa['financial']['mobile'].values()) else 'FAIL'}**
- Selected Thinking R1.2.1: **{'PASS' if all(v['pass'] for v in qa['thinking'].values()) else 'FAIL'}**
- Selected Work bridge: **{'PASS' if all(v['pass'] for v in qa['selectedWork'].values()) else 'FAIL'}**
- Footer R3.1 material/pointer/reduced-motion: **{'PASS' if qa['footer']['desktop']['pass'] and qa['footer']['pointer']['pass'] and qa['footer']['mobile']['pass'] and qa['footer']['reduced']['pass'] else 'FAIL'}**
- Local exact Owner-preview packaging smoke: **{'PASS' if all(v['pass'] for v in qa['preview'].values()) else 'FAIL'}**
- Screenshots committed by QA: `{len(qa['screenshots'])}`
- Overall: **{'PASS' if qa['pass'] and hero.get('pass') else 'FAIL'}**
'''
(root/'PARITY_REPORT.md').write_text(par,encoding='utf-8')
main='c945084e1952c05c686494091f7dbca0f7acdf08'
manifest=Path('docs/site-evolution/PROAI_HOME_GOLDEN_ASSEMBLY_R1_MANIFEST.md')
manifest.write_text(f'''# PROAI HOME GOLDEN ASSEMBLY R1.2 — FINAL AUTHORITY RECONCILIATION

## Identity
- Product authority: `d5f562ac4c0c84b4ec06e913ec7e0f82d133beab`
- Production main lock: `{main}`
- Branch: `agent/proai-home-golden-assembly-r1-2-recovery`
- PR #152: DRAFT / UNMERGED
- Main changed: **NO**
- Merge: **NO**
- Deploy: **NO**

## Final component authorities
- Header `20a36a...`: MATCH
- Hero `735982...`: MATCH
- Cube 45% `497308...`, wrapper `fc2c0ba...`, materials `f9298b0...`: MATCH
- Connected `d5f2e2...`: MATCH
- Two Worlds `0cc789...`: MATCH base + scoped short-landscape Golden bridge
- Technology `18e282...`: MATCH donor + existing Owner mobile bridge `d52ecb0...`
- Financial Stream R1.4 `d6e33b1...`: MATCH
- Selected Thinking R1.2.1 `1228717...`: MATCH
- Selected Work: preserved production bridge / no redesign
- Footer R3.1 review donor `b6af252...`: exact four-file recovery MATCH
- Founder: removed from homepage

## Browser evidence
- Full EN/RU matrix: **{'PASS' if all(x['pass'] for x in qa['matrix']) else 'FAIL'}**
- Hero/Cube donor parity: **{'PASS' if hero.get('pass') else 'FAIL'}**
- Connected cadence: `{qa['connected'].get('intervals')}` ms
- Two Worlds landscape: **{'PASS' if all(v['pass'] for v in land.values()) else 'FAIL'}**
- Financial desktop image EN 1440 natural size: `{fsd['en-1440x900']['primary']['naturalWidth']}×{fsd['en-1440x900']['primary']['naturalHeight']}`
- Footer R3.1: **{'PASS' if qa['footer']['desktop']['pass'] and qa['footer']['pointer']['pass'] else 'FAIL'}**
- Broken images / failed local requests / fatal page errors / horizontal overflow: enforced at every matrix entry.
- Exact rescue Owner-preview package: locally browser-smoked EN/RU desktop/mobile against this product.

External immutable-host self-open remains a separate environment/network check; the final review SHA will pin the published rescue path.
''',encoding='utf-8')
if not (qa['pass'] and hero.get('pass')): raise SystemExit('combined QA failed')
PY

# Capture evidence on the temporary review head. [skip ci] prevents recursive review runs.
git config user.name 'proai-golden-review-bot'
git config user.email 'actions@users.noreply.github.com'
git add -f "$OUT" docs/site-evolution/PROAI_HOME_GOLDEN_ASSEMBLY_R1_MANIFEST.md
if ! git diff --cached --quiet; then
  git commit -m 'qa: capture Golden R1.2 final authority evidence [skip ci]'
  git push origin HEAD:agent/proai-home-golden-assembly-r1-2-recovery
fi
echo "EVIDENCE_SHA=$(git rev-parse HEAD)"
