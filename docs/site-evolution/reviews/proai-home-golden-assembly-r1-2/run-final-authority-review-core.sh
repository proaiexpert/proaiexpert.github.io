#!/usr/bin/env bash
set -euo pipefail
PRODUCT_SHA='d5f562ac4c0c84b4ec06e913ec7e0f82d133beab'
TARGET_BRANCH='agent/proai-home-golden-assembly-r1-2-recovery'
OUT='docs/site-evolution/reviews/proai-home-golden-assembly-r1-2'

printf 'PRODUCT_SHA=%s\n' "$PRODUCT_SHA"
test "$(git rev-parse HEAD^)" = "$PRODUCT_SHA" || { echo 'QA head must be one harness commit above exact product' >&2; exit 20; }
check_hash(){ local path="$1" expected="$2" actual; actual=$(git hash-object "$path"); printf '%s %s\n' "$actual" "$path"; test "$actual" = "$expected"; }
check_hash _includes/header-system/header.html 6edc924df1df630a69379dfd746d161bab2fbe98
check_hash assets/css/header-system-v1.css 1e7651d5014b4b7b2e6f3d6a662b5431a7692f71
check_hash assets/js/header-system-v1.js bb107dd6054ba5210b4f77568e04014cdb239c55
check_hash assets/css/homepage-hero-signature-r3.css 5dde833560aac0958875842a598f622942597b74
check_hash assets/js/proai-hero-cube-r1/source-final-motion-r2-touch-auto-45-r1.js fc2c0ba13692c94f5838008d09f05dda9859e9d2
check_hash assets/js/proai-hero-cube-r1/source-materials-r1.js f9298b0b00feaae4123eb5a7161f24f669ae0eca
check_hash _includes/homepage-connected-system-en.html 6bf4b0c236ab9063b7588faf5c59f660f64b71aa
check_hash _includes/homepage-connected-system-ru.html 92081f9f98f43a9f794d2c5a49b7bce19aafae16
check_hash assets/css/homepage-connected-system-r13.css b99dfc19739070fee88d47c94c202d60feab7619
check_hash assets/js/homepage-connected-system-r13.js 8fba38d49366bb69b7e06f9527dd4d07d8d05279
check_hash _includes/homepage-two-worlds-golden-r1-en-assembly.html ee48db8f844f61e3abb10f603bf8dabb3987dbc3
check_hash _includes/homepage-two-worlds-golden-r1-ru-assembly.html 0c119addfee214d1c32cf31385c7f9f37048829d
check_hash assets/css/homepage-two-worlds-golden-r1.css 671813c61cf63e941ecf993f46cd385100c7ed2a
check_hash assets/js/homepage-two-worlds-golden-r1.js e2927f804003882f2218aa4b86741c6aae32d5a9
check_hash _includes/home-technology-transition-r2.html a05749f9a7f96a42b7f4b84eb2fb822fae13d310
check_hash assets/css/home-technology-transition-r2.css f76f8b931c3ad0667c50a5b474b09c793af7e08d
check_hash assets/js/home-technology-transition-r2.js 230b4b6ded23fe66509f774641fa50eadfbdfa4e
check_hash assets/css/home-technology-transition-r2-golden-mobile.css d52ecb0942ec9641353e7c1b4057406ef2c2ac4c
check_hash _includes/home-work-proof-financial-stream-r1-4-en.html 7f272fd438ca97a37dd86f30da9244bcfaf56923
check_hash _includes/home-work-proof-financial-stream-r1-4-ru.html 2261484cf094bbb52d44f9bdb7f2b49096191ad8
check_hash assets/css/home-work-proof-financial-stream-r1-4.css 8b2928f6315c3c44824dd18c2359bca738d9841e
check_hash assets/js/home-work-proof-financial-stream-r1-1.js 925221226fdb2f94b117a10dfd0fdb75b2151cee
check_hash _includes/home-selected-thinking-r1-en.html bbe1d55dcc454dc156a6084c4c17613130f38bd3
check_hash _includes/home-selected-thinking-r1-ru.html 51cb7b82a069335b21f401eab8ed5d5f0bd4ead7
check_hash assets/css/home-selected-thinking-r1.css 1551761f4e81da26fcaaf2d4d65e221f20149ae7
check_hash assets/css/home-selected-thinking-r1-1.css 444e56140bbdf091e422c5046c34ba248ed33a2b
check_hash assets/css/home-selected-thinking-r1-2.css 9f40b2f077de24cfbb281311e7c128efdc3e0559
check_hash assets/js/home-selected-thinking-r1.js a85b0070014eb99c83a906ce5c97ba706a9b46cd
check_hash _includes/home-selected-work-golden-r1-2-en.html 94996786b82e419bc1af93af6aefa2c06d9561e4
check_hash _includes/home-selected-work-golden-r1-2-ru.html bdb606ff8f7d8b10ee94a3ff7a2a5d624da4dba0
check_hash assets/css/portfolio-entry-bridge-v1.css 01d254b9a03fa1673078d635f4b9948ce88119d8
check_hash assets/css/home-selected-work-golden-r1-2.css bfc0eac3a30732df10f00ce65d98774fb3863c10
check_hash _includes/home-footer-golden-r3.html b6b75943011a0fab1cec3b59d4f3a018fb53af74
check_hash assets/css/home-footer-golden-r3.css 5563a0ec5223664934e0b55afa8626519cfff058
check_hash assets/css/home-footer-golden-r3-1.css cc1c307d2548422879a443c7597c936fb365b5b2
check_hash assets/js/home-footer-golden-r3.js 3c2bad4aa8e3930243a2e3912679bdd936d9ea5a
check_hash assets/css/homepage-two-worlds-golden-r1-landscape-fix.css 8b812d4080cc060f27d1b8137f2f1b66baa1bd53
check_hash assets/js/homepage-two-worlds-golden-r1-landscape-fix.js 430647162bf0fc0bd32c3ae3eddcb9ca43415c5a

cat > "$OUT/AUTHORITY_MATRIX_FINAL.md" <<'MD'
# Golden Assembly R1.2 — Final Authority Matrix

Product authority under QA: `d5f562ac4c0c84b4ec06e913ec7e0f82d133beab`

| Component | Current / target | Verdict |
|---|---|---|
| Header | 6edc924 / 1e7651d / bb107dd | MATCH |
| Hero | 5dde833 | MATCH |
| Cube wrapper / materials | fc2c0ba / f9298b0 | MATCH |
| Connected EN/RU/CSS/JS | 6bf4b0c / 92081f9 / b99dfc1 / 8fba38d | MATCH |
| Two Worlds EN/RU/CSS/JS | ee48db8 / 0c119ad / 671813c / e2927f8 | MATCH BASE |
| Two Worlds landscape bridge | 8b812d4 / 4306471 | TARGETED GOLDEN CORRECTION |
| Technology include/CSS/JS/mobile | a05749f / f76f8b9 / 230b4b6 / d52ecb0 | MATCH |
| Financial Stream R1.4 EN/RU/CSS/JS | 7f272fd / 2261484 / 8b2928f / 9252212 | MATCH — browser delivery verified separately |
| Selected Thinking R1.2.1 | bbe1d55 / 51cb7b8 / 1551761 / 444e561 / 9f40b2f / a85b007 | MATCH |
| Selected Work bridge | 9499678 / bdb606f / 01d254b / bfc0eac | MATCH |
| Footer | R2 removed; R3.1 b6b7594 / 5563a0e / cc1c307 / 3c2bad4 | RECONCILED TO OWNER-SELECTED R3.1 |
MD

sudo gem install jekyll -v 4.3.4 --no-document
sudo gem install webrick --no-document
jekyll build --destination _site
python3 "$OUT/generate-final-authority-preview.py"
npm install --no-save playwright@1.54.2 pngjs@7.0.0
npx playwright install --with-deps chromium
python3 -m http.server 4176 --bind 127.0.0.1 >/tmp/proai-final-authority-http.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true' EXIT
for i in $(seq 1 40); do curl -fsS "http://127.0.0.1:4176/$OUT/owner-review-en.html" >/dev/null && break; sleep .25; done
REVIEW_BASE="http://127.0.0.1:4176/$OUT/" node "$OUT/final-authority-qa.mjs"

git fetch origin "$TARGET_BRANCH"
CURRENT_TARGET=$(git rev-parse "origin/$TARGET_BRANCH")
test "$CURRENT_TARGET" = "$PRODUCT_SHA" || { echo "Golden target moved unexpectedly: $CURRENT_TARGET" >&2; exit 21; }
REVIEW_WT=$(mktemp -d)
git worktree add --detach "$REVIEW_WT" "$PRODUCT_SHA"
rm -rf "$REVIEW_WT/$OUT"
mkdir -p "$REVIEW_WT/$(dirname "$OUT")"
cp -a "$OUT" "$REVIEW_WT/$OUT"
(
  cd "$REVIEW_WT"
  git config user.name 'proai-golden-review-bot'
  git config user.email 'actions@users.noreply.github.com'
  git add "$OUT"
  git commit -m 'review: Golden R1.2 final authority reconciliation evidence'
  git push origin HEAD:"$TARGET_BRANCH"
  git rev-parse HEAD > /tmp/proai-final-review-sha.txt
)
git worktree remove "$REVIEW_WT" --force
REVIEW_SHA=$(cat /tmp/proai-final-review-sha.txt)
printf 'NEW_GOLDEN_REVIEW=%s\n' "$REVIEW_SHA"

REMOTE_SMOKE="$OUT/remote-owner-smoke.mjs"
cat > "$REMOTE_SMOKE" <<'JS'
import { chromium } from 'playwright';
import fs from 'node:fs';
const sha=process.env.REVIEW_SHA, product=process.env.PRODUCT_SHA, out=process.env.OUT_JSON;
const hosts=['https://rawcdn.githack.com','https://raw.githack.com'];
const browser=await chromium.launch({headless:true,args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
const attempts=[];let selected=null;
for(const host of hosts){
  const hostResult={host,locales:[],pass:false};
  for(const lang of ['en','ru']){
    const url=`${host}/proaiexpert/proaiexpert.github.io/${sha}/docs/site-evolution/reviews/proai-home-golden-assembly-r1-2/owner-review-${lang}.html`;
    let result=null;
    for(let n=1;n<=7;n++){
      const context=await browser.newContext({viewport:{width:lang==='en'?1440:390,height:lang==='en'?900:844},deviceScaleFactor:1,hasTouch:lang==='ru',reducedMotion:'no-preference'});
      const page=await context.newPage();page.setDefaultTimeout(45000);const errors=[],failed=[],bad=[];
      page.on('pageerror',e=>errors.push(String(e)));page.on('requestfailed',r=>{if(r.url().includes('/assets/'))failed.push({url:r.url(),error:r.failure()?.errorText||'failed'});});page.on('response',r=>{if(r.url().includes('/assets/')&&r.status()>=400)bad.push({url:r.url(),status:r.status()});});
      let status=null,navError=null;try{const r=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});status=r?.status()??null;}catch(e){navError=String(e);}
      for(const s of ['#hero','[data-tw-r2]','[data-home-tech-r2]','.home-fs-showcase-r14','[data-selected-thinking-r1]','#selected-work','[data-home-footer-golden-r3]']){await page.evaluate(s=>document.querySelector(s)?.scrollIntoView({block:'center'}),s).catch(()=>{});await page.waitForTimeout(100);}
      await page.waitForFunction(p=>document.documentElement.dataset.productSha===p,product,{timeout:10000}).catch(()=>{});
      await page.waitForFunction(()=>document.querySelector('.proai-hero-object-slot')?.dataset.cubeMounted==='true'&&window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime?.ready===true,null,{timeout:25000}).catch(()=>{});
      await page.waitForFunction(()=>document.querySelector('.home-fs-showcase-r14')?.classList.contains('is-live'),null,{timeout:8000}).catch(()=>{});
      await page.waitForTimeout(600);
      const st=await page.evaluate(p=>{const d=document.documentElement,b=document.body,fi=document.querySelector('.home-fs-showcase-r14 .home-fs-showcase-r11__primary img'),fr=fi?.getBoundingClientRect();return{productSha:d.dataset.productSha||null,header:document.querySelectorAll('.site-header').length,hero:document.querySelectorAll('#hero').length,cube:document.querySelectorAll('#cube-canvas').length,cubeReady:window.__PROAI_HERO_CUBE_GOLDEN_R1?.runtime?.ready===true,financial:document.querySelectorAll('.home-fs-showcase-r14').length,financialNatural:[fi?.naturalWidth||0,fi?.naturalHeight||0],financialBox:[fr?.width||0,fr?.height||0],thinking:document.querySelectorAll('[data-selected-thinking-r1]').length,selectedWork:document.querySelectorAll('#selected-work').length,footer:document.querySelectorAll('[data-home-footer-golden-r3]').length,footerR2:document.querySelectorAll('footer[data-footer-watermark-r2]').length,overflow:Math.max(0,d.scrollWidth-d.clientWidth,b.scrollWidth-d.clientWidth),broken:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.currentSrc||i.src),productMatches:d.dataset.productSha===p};},product);
      const pass=status===200&&st.productMatches&&st.header===1&&st.hero===1&&st.cube===1&&st.cubeReady&&st.financial===1&&st.financialNatural[0]>0&&st.financialNatural[1]>0&&st.financialBox[0]>0&&st.financialBox[1]>0&&st.thinking===1&&st.selectedWork===1&&st.footer===1&&st.footerR2===0&&st.overflow===0&&st.broken.length===0&&errors.length===0&&failed.length===0&&bad.length===0;
      result={lang,url,attempt:n,status,navError,state:st,pageErrors:errors,failedCritical:failed,badCritical:bad,pass};
      await context.close();
      if(pass)break;
      await new Promise(r=>setTimeout(r,1800));
    }
    hostResult.locales.push(result);
  }
  hostResult.pass=hostResult.locales.every(x=>x?.pass);attempts.push(hostResult);if(hostResult.pass){selected=hostResult;break;}
}
await browser.close();
const report={reviewSha:sha,productSha:product,generatedAt:new Date().toISOString(),attempts,selectedHost:selected?.host||null,liveEn:selected?.locales.find(x=>x.lang==='en')?.url||null,liveRu:selected?.locales.find(x=>x.lang==='ru')?.url||null,pass:!!selected};
fs.writeFileSync(out,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.pass)process.exit(3);
JS
REVIEW_SHA="$REVIEW_SHA" PRODUCT_SHA="$PRODUCT_SHA" OUT_JSON="$OUT/remote-owner-smoke.json" node "$REMOTE_SMOKE"
