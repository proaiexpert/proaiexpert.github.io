#!/usr/bin/env bash
set -Eeuo pipefail
SRC='docs/site-evolution/reviews/proai-home-golden-assembly-r1-2/run-final-review.sh'
QA_SRC='docs/site-evolution/reviews/proai-home-golden-assembly-r1-2/run-qa.mjs'
TMP="$(mktemp)"
QA_TMP='/tmp/proai-golden-r12-run-qa-fixed.mjs'
python - "$SRC" "$TMP" "$QA_SRC" "$QA_TMP" <<'PY'
from pathlib import Path
import sys
src=Path(sys.argv[1]).read_text(encoding='utf-8')
old_product='a45b1c31ded37909849fc7cccd6d553672c9583a'
new_product='a876dfb178fd3f020c8392b336eae62253f89ae7'
old_parent='667998c81618c27f8efd99f0eacd9f5ff94a3ac0'
new_parent='0eca7b093c9566161a0ae5053284a3201f57bf33'
if old_product not in src or old_parent not in src:
    raise SystemExit('Expected pre-R1.4 product authority not found')
src=src.replace(old_product,new_product).replace(old_parent,new_parent)

old="""donor='c945084e1952c05c686494091f7dbca0f7acdf08'\nfor source,current in [('index.html','_includes/homepage-golden-r12-downstream-en.html'),('ru/index.html','_includes/homepage-golden-r12-downstream-ru.html')]:"""
new="""donor='38b92195a11709546db8fe0beeaa782244eee83f'\nfor source,current in [('_includes/homepage-assembly-base-en.html','_includes/homepage-golden-r12-downstream-en.html'),('_includes/homepage-assembly-base-ru.html','_includes/homepage-golden-r12-downstream-ru.html')]:"""
if old not in src: raise SystemExit('Expected downstream donor block not found')
src=src.replace(old,new,1)

old2="""want=text[start:end].strip().replace('\\r\\n','\\n');cur=Path(current).read_text(encoding='utf-8').replace('\\r\\n','\\n').strip().splitlines();got='\\n'.join(cur[1:-1]).strip();assert got==want,current"""
new2="""want=text[start:end].strip().replace('\\r\\n','\\n');marker='{{ selected_work_marker }}';want=want[:-len(marker)].rstrip() if want.endswith(marker) else want;cur=Path(current).read_text(encoding='utf-8').replace('\\r\\n','\\n').strip().splitlines();got='\\n'.join(cur[1:-1]).strip();assert got==want,current"""
if old2 not in src: raise SystemExit('Expected downstream comparison line not found')
src=src.replace(old2,new2,1)

hash_anchor="'assets/css/home-work-proof-financial-stream-r1-3-1.css':'2bda2f705a878526c70f7054ee669374916832db','_includes/home-footer-watermark-r2.html'"
hash_new="'assets/css/home-work-proof-financial-stream-r1-3-1.css':'2bda2f705a878526c70f7054ee669374916832db','_includes/home-work-proof-financial-stream-r1-4-en.html':'7f272fd438ca97a37dd86f30da9244bcfaf56923','_includes/home-work-proof-financial-stream-r1-4-ru.html':'2261484cf094bbb52d44f9bdb7f2b49096191ad8','assets/css/home-work-proof-financial-stream-r1-4.css':'8b2928f6315c3c44824dd18c2359bca738d9841e','_includes/home-footer-watermark-r2.html'"
if hash_anchor not in src: raise SystemExit('Expected R1.3.1 hash anchor not found')
src=src.replace(hash_anchor,hash_new,1)

diff_anchor="assets/css/home-work-proof-financial-stream-r1-3-1.css _includes/home-footer-watermark-r2.html"
diff_new="assets/css/home-work-proof-financial-stream-r1-3-1.css _includes/home-work-proof-financial-stream-r1-4-en.html _includes/home-work-proof-financial-stream-r1-4-ru.html assets/css/home-work-proof-financial-stream-r1-4.css index.html ru/index.html _includes/home-footer-watermark-r2.html"
if diff_anchor not in src: raise SystemExit('Expected Financial diff anchor not found')
src=src.replace(diff_anchor,diff_new,1)

jekyll_anchor="assert t.count('data-fs-showcase-r11')==1;assert 'id=\"core-split\"' not in t"
jekyll_new="assert t.count('data-fs-showcase-r11')==1;assert t.count('home-fs-showcase-r14')==1;assert 'home-work-proof-financial-stream-r1-4.css' in t;assert 'id=\"core-split\"' not in t"
if jekyll_anchor not in src: raise SystemExit('Expected Jekyll Financial assertion not found')
src=src.replace(jekyll_anchor,jekyll_new,1)

media_anchor='mkdir -p "$REVIEW_DIR/media"\n'
if media_anchor not in src: raise SystemExit('Expected review media mkdir not found')
src=src.replace(media_anchor,media_anchor+'rm -f "$REVIEW_DIR"/media/*.png\n',1)

qa=Path(sys.argv[3]).read_text(encoding='utf-8')
oldv="const V=[['1440x900',1440,900],['1366x768',1366,768],['1024x768',1024,768],['430x932',430,932],['393x852',393,852],['390x844',390,844],['375x812',375,812],['320x568',320,568],['844x390',844,390],['932x430',932,430]];"
newv="const V=[['1920x1080',1920,1080],['1536x864',1536,864],['1440x900',1440,900],['1366x768',1366,768],['1024x768',1024,768],['430x932',430,932],['393x852',393,852],['390x844',390,844],['375x812',375,812],['320x568',320,568],['844x390',844,390],['932x430',932,430]];"
if oldv not in qa: raise SystemExit('Expected viewport matrix not found')
qa=qa.replace(oldv,newv,1)

oldcss="'assets/css/home-work-proof-financial-stream-r1-3-1.css'],entries:"
newcss="'assets/css/home-work-proof-financial-stream-r1-3-1.css','assets/css/home-work-proof-financial-stream-r1-4.css'],entries:"
if oldcss not in qa: raise SystemExit('Expected Financial parity CSS stack not found')
qa=qa.replace(oldcss,newcss,1)

oldcount="financial:document.querySelectorAll('[data-fs-showcase-r11]').length,oldFinancial:"
newcount="financial:document.querySelectorAll('[data-fs-showcase-r11]').length,financialR14:document.querySelectorAll('.home-fs-showcase-r14').length,oldFinancial:"
if oldcount not in qa: raise SystemExit('Expected Financial count expression not found')
qa=qa.replace(oldcount,newcount,1)

oldstruct="s.counts.financial===1&&s.counts.oldFinancial===0"
newstruct="s.counts.financial===1&&s.counts.financialR14===1&&s.counts.oldFinancial===0"
if oldstruct not in qa: raise SystemExit('Expected viewport structural Financial gate not found')
qa=qa.replace(oldstruct,newstruct,1)

oldpass="s.brokenImages.length===0&&x.pageErrors.length===0;R.viewports[lang][name]={...s,pageErrors:x.pageErrors,pass};"
newpass="s.brokenImages.length===0&&x.pageErrors.length===0&&x.failed.length===0&&x.badResponses.length===0;R.viewports[lang][name]={...s,pageErrors:x.pageErrors,consoleErrors:x.consoleErrors,failed:x.failed,badResponses:x.badResponses,pass};"
if oldpass not in qa: raise SystemExit('Expected viewport technical gate not found')
qa=qa.replace(oldpass,newpass,1)

oldqa="const outer=await x.page.locator(cfg.root).evaluate(e=>e.outerHTML),assembly="
newqa="const outer=await x.page.evaluate(sel=>document.querySelector(sel)?.outerHTML||null,cfg.root);if(!outer){fail(`parity:${w}x${h}:${name}:missing-root`,cfg.root);out[name]={assembly:null,reference:null,issues:[`missing root ${cfg.root}`],pass:false};continue}const assembly="
if oldqa not in qa: raise SystemExit('Expected parity outer/assembly expression not found')
qa=qa.replace(oldqa,newqa,1)
Path(sys.argv[4]).write_text(qa,encoding='utf-8')

oldcmd='PRODUCT_SHA="$PRODUCT_SHA" node "$REVIEW_DIR/run-qa.mjs"'
newcmd='PRODUCT_SHA="$PRODUCT_SHA" node /tmp/proai-golden-r12-run-qa-fixed.mjs'
if oldcmd not in src: raise SystemExit('Expected full QA command not found')
src=src.replace(oldcmd,newcmd,1)

finalizer=r"""CURRENT_STAGE='r14-report-finalize'
python - <<'PY2'
from pathlib import Path
import json
root=Path('docs/site-evolution/reviews/proai-home-golden-assembly-r1-2')
qa=json.loads((root/'qa-report.json').read_text(encoding='utf-8'))
owner=json.loads((root/'owner-review-check.json').read_text(encoding='utf-8'))
intervals=qa.get('connected',{}).get('autonomous',{}).get('intervals',[])
dep=root/'DEPENDENCY_MATRIX.md'
dep.write_text(dep.read_text(encoding='utf-8')+'''\n\n## Financial Stream R1.4 — Owner-approved Golden promotion\n\n| Dependency | Authority | Golden treatment |\n|---|---|---|\n| R1.4 EN include | `d6e33b1c...` / blob `7f272fd438ca97a37dd86f30da9244bcfaf56923` | exact donor, MATCH |\n| R1.4 RU include | `d6e33b1c...` / blob `2261484cf094bbb52d44f9bdb7f2b49096191ad8` | exact donor, MATCH |\n| R1.4 CSS | `d6e33b1c...` / blob `8b2928f6315c3c44824dd18c2359bca738d9841e` | appended after R1.3.1, MATCH |\n| R1.1 JS runtime | `925221226fdb2f94b117a10dfd0fdb75b2151cee` | retained unchanged |\n''',encoding='utf-8')
par=root/'PARITY_REPORT.md'
par.write_text(par.read_text(encoding='utf-8')+f'''\n\n## Financial Stream R1.4 final acceptance\n\n- R1.4 class EN mobile: **{'PASS' if owner['enMobile']['financial']['r14Count']==1 else 'FAIL'}**\n- R1.4 class RU mobile: **{'PASS' if owner['ruMobile']['financial']['r14Count']==1 else 'FAIL'}**\n- Primary desktop screenshot full / uncropped: **{'PASS' if owner['enDesktop']['financial']['primaryFull'] else 'FAIL'}**\n- Mobile proof full EN: **{'PASS' if owner['enMobile']['financial']['secondaryFull'] else 'FAIL'}**\n- Mobile proof full RU: **{'PASS' if owner['ruMobile']['financial']['secondaryFull'] else 'FAIL'}**\n- Text over client screenshots: **{'NO / PASS' if not owner['enDesktop']['financial']['textOverClientScreenshots'] and not owner['enMobile']['financial']['textOverClientScreenshots'] else 'FAIL'}**\n- Evidence ledger outside screenshots: **{'PASS' if owner['enDesktop']['financial']['ledgerOutsideScreenshots'] and owner['enMobile']['financial']['ledgerOutsideScreenshots'] else 'FAIL'}**\n- Testimonial overlap: **{'NO / PASS' if not owner['enDesktop']['financial']['testimonialImageOverlap'] and not owner['enDesktop']['financial']['testimonialInternalOverlap'] else 'FAIL'}**\n- Technology → Financial → Founder context: **{'PASS' if owner['enDesktop']['financial']['context']['technologyOverlap'] is False and owner['enDesktop']['financial']['context']['founderOverlap'] is False and owner['enDesktop']['financial']['context']['badBlankGap'] is False else 'FAIL'}**\n- Connected autonomous cadence ms: `{intervals}`\n- Owner-review aggregate: **{'PASS' if owner.get('pass') else 'FAIL'}**\n''',encoding='utf-8')
viewports=['1920x1080','1536x864','1440x900','1366x768','1024x768','430x932','393x852','390x844','375x812','320x568','844x390','932x430']
manifest=Path('docs/site-evolution/PROAI_HOME_GOLDEN_ASSEMBLY_R1_MANIFEST.md')
manifest.write_text(f'''# PROAI HOME GOLDEN ASSEMBLY R1.2 MANIFEST\n\n## Assembly identity\n- Golden Assembly: **R1.2 — Full-page Owner Candidate with Financial Stream R1.4**\n- Golden product commit: `a876dfb178fd3f020c8392b336eae62253f89ae7`\n- Pre-promotion recovered authority: `a45b1c31ded37909849fc7cccd6d553672c9583a`\n- Production main lock: `c945084e1952c05c686494091f7dbca0f7acdf08`\n- Branch: `agent/proai-home-golden-assembly-r1-2-recovery`\n- PR: `#152` — DRAFT / UNMERGED\n- Main modified: **NO**\n- Merge: **NO**\n- Deploy: **NO**\n- Selected Thinking R1.2: **NOT INTEGRATED**\n\n## Financial Stream R1.4 — OWNER APPROVED\n- Product authority: `d6e33b1c428d3478072c3fdf728c50a27ae0461b`\n- Review authority: `cc199f061523504e4332fcd4a4800bc0bdc6f949`\n- EN include blob: `7f272fd438ca97a37dd86f30da9244bcfaf56923` — MATCH YES\n- RU include blob: `2261484cf094bbb52d44f9bdb7f2b49096191ad8` — MATCH YES\n- R1.4 CSS blob: `8b2928f6315c3c44824dd18c2359bca738d9841e` — MATCH YES\n- CSS order: R1.1 → R1.2 → R1.3 → R1.3.1 → R1.4\n- Runtime: `assets/js/home-work-proof-financial-stream-r1-1.js` retained unchanged\n- Render identity: `.home-fs-showcase-r14` exactly once per locale\n- R1.3.1: **HISTORICAL ONLY**\n\n## Other Golden authorities — HARD LOCK\n- Header: OWNER FROZEN — `20a36a5246ac2fb4507c69858289fc55d0f4a977`\n- Hero: OWNER FROZEN — `735982473854c29a6f1eeeb4d87773abbc573b4d`\n- Cube 45%: `497308fd5e9add24d4fa4254287cbd17f9c0112c` / blob `fc2c0ba13692c94f5838008d09f05dda9859e9d2`\n- Connected System: OWNER FROZEN — `d5f2e2fd85218b2a98e774b0b19df1536240d4fb`\n- Two Worlds Golden product: `0cc789f665dfcc1f056d474295fd3bccad9709f2`\n- Standalone Technology: `18e28280893c6bee9634c707892b80f9d3213ad6`\n- Footer R2: OWNER FROZEN — `f6103920a4a47b51d1cff06d75ce62992d33d4ee`\n\n## Final browser QA\n- EN/RU viewport matrix: `{', '.join(viewports)}`\n- Viewport matrix: **PASS**\n- Cube runtime.ready: **PASS**\n- Connected autonomous cadence: `{intervals}` ms — **PASS**\n- Embedded old Technology: **ABSENT**\n- Standalone Technology: **PASS**\n- Financial Stream R1.4: **PASS**\n- Founder/downstream: **PASS**\n- Footer: **PASS**\n- Broken images: **0**\n- Critical failed requests: **0**\n- Fatal page errors: **0**\n- Horizontal overflow: **0px**\n\nFinal review commit is the `[review-final]` commit containing this manifest and the immutable Owner-review package.\n''',encoding='utf-8')
PY2
"""
needle='write_status PASS 0\n'
if needle not in src: raise SystemExit('Expected final PASS marker not found')
src=src.replace(needle,finalizer+needle,1)
Path(sys.argv[2]).write_text(src,encoding='utf-8')
PY
# Patched ESM lives in /tmp; expose repo-local packages via normal parent lookup.
ln -sfn "$PWD/node_modules" /tmp/node_modules
chmod +x "$TMP"
exec bash "$TMP"
