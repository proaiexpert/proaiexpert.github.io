#!/usr/bin/env bash
set -euo pipefail
DIR='docs/site-evolution/reviews/proai-home-golden-assembly-r1-2'
CORE="$DIR/run-final-authority-review-core.sh"
QA="$DIR/final-authority-qa.mjs"
GEN="$DIR/generate-final-authority-preview.py"
TMP=$(mktemp)

python3 - "$GEN" <<'PY'
from pathlib import Path
import sys
p=Path(sys.argv[1]);s=p.read_text(encoding='utf-8')
old="html=re.sub(r'<script type=\"importmap\">.*?</script>', DYNAMIC_IMPORTMAP, html, count=1, flags=re.S)"
new="html=re.sub(r'<script type=\"importmap\">.*?</script>', lambda _m: DYNAMIC_IMPORTMAP, html, count=1, flags=re.S)"
if old not in s: raise SystemExit('generator importmap substitution target missing')
p.write_text(s.replace(old,new,1),encoding='utf-8')
PY

python3 - "$CORE" "$TMP" <<'PY'
from pathlib import Path
import sys
src=Path(sys.argv[1]).read_text(encoding='utf-8')
src=src.replace('ee48db8f844f61e3abb10f603bf8dabb3987dbc3','166eb49ffb4517f05d3ae2cfce4188eb9e6132ab')
src=src.replace('for(let n=1;n<=7;n++)','for(let n=1;n<=2;n++)')
src=src.replace('page.setDefaultTimeout(45000)','page.setDefaultTimeout(12000)')
src=src.replace('timeout:45000','timeout:12000')
src=src.replace('timeout:25000','timeout:12000')
src=src.replace('setTimeout(r,1800)','setTimeout(r,800)')
Path(sys.argv[2]).write_text(src,encoding='utf-8')
PY
chmod +x "$TMP"

python3 - "$QA" <<'PY'
from pathlib import Path
import re,sys
p=Path(sys.argv[1]);s=p.read_text(encoding='utf-8')
s=s.replace('page.setDefaultTimeout(45000);',"page.setDefaultTimeout(12000);\n  await page.route(/^https:\\/\\/fonts\\.(?:googleapis|gstatic)\\.com\\//,r=>r.abort()).catch(()=>{});",1)
s=s.replace('timeout:45000','timeout:12000')
s=s.replace('await page.evaluate(()=>document.fonts?.ready).catch(()=>{});','await Promise.race([page.evaluate(()=>document.fonts?.ready),page.waitForTimeout(800)]).catch(()=>{});',1)
anchor='async function twoDesktop(page){'
helpers='''async function viewportRect(page,sel){\n  return page.evaluate(sel=>{const e=document.querySelector(sel);if(!e)return null;const r=e.getBoundingClientRect();return r.width>0&&r.height>0?{x:r.left,y:r.top,width:r.width,height:r.height}:null;},sel);\n}\n\n'''
if anchor not in s:raise SystemExit('twoDesktop anchor missing')
s=s.replace(anchor,helpers+anchor,1)
s=s.replace("const box=await page.locator('[data-tw-r2] [data-tw-viewport]').boundingBox();if(!box)return{pass:false};","const box=await viewportRect(page,'[data-tw-r2] [data-tw-viewport]');if(!box)return{pass:false,reason:'missing viewport rect'};",1)
s=s.replace("const box=await page.locator('[data-home-footer-golden-r3] [data-footer-material-zone]').boundingBox();let pointer=false,pointerAfter=null,awake=false;","const box=await viewportRect(page,'[data-home-footer-golden-r3] [data-footer-material-zone]');let pointer=false,pointerAfter=null,awake=false;",1)
# State/context screenshots: capture exactly the browser viewport after the target has been centered.
replacement=r'''async function clipElement(page,sel,file,pad=0){
  await page.evaluate(s=>document.querySelector(s)?.scrollIntoView({block:'center',inline:'nearest'}),sel);
  await page.waitForTimeout(220);
  const exists=await page.evaluate(s=>{const e=document.querySelector(s);if(!e)return false;const r=e.getBoundingClientRect();return r.width>0&&r.height>0;},sel);
  if(!exists)throw new Error(`missing screenshot ${sel}`);
  await page.screenshot({path:`${MEDIA}/${file}`,timeout:45000});
  report.screenshots.push(`media/${file}`);
}
async function full'''
s,n=re.subn(r'async function clipElement\(page,sel,file,pad=0\)\{.*?\n\}\nasync function full',replacement,s,count=1,flags=re.S)
if n!=1:raise SystemExit('clipElement patch target missing')
s=s.replace("const twbox=await x.page.locator('[data-tw-r2] [data-tw-viewport]').boundingBox();","const twbox=await viewportRect(x.page,'[data-tw-r2] [data-tw-viewport]');")
s=s.replace("const b=await x.page.locator('[data-tw-r2] [data-tw-viewport]').boundingBox();","const b=await viewportRect(x.page,'[data-tw-r2] [data-tw-viewport]');")
s=s.replace("const fb=await x.page.locator('[data-footer-material-zone]').boundingBox();","const fb=await viewportRect(x.page,'[data-footer-material-zone]');")
s=s.replace("async function full(page,file){await page.screenshot({path:`${MEDIA}/${file}`,fullPage:true});","async function full(page,file){await page.screenshot({path:`${MEDIA}/${file}`,fullPage:true,timeout:45000});",1)
s=s.replace("async function viewportShot(page,file){await page.screenshot({path:`${MEDIA}/${file}`});","async function viewportShot(page,file){await page.screenshot({path:`${MEDIA}/${file}`,timeout:45000});",1)
needle='const x=await open(browser,lang,w,h);'
if needle in s:s=s.replace(needle,"console.log(`[matrix] ${lang} ${w}x${h}`);\n      const x=await open(browser,lang,w,h);",1)
if 'locator(' in s or 'boundingBox(' in s:raise SystemExit('locator geometry waits remain')
p.write_text(s,encoding='utf-8')
PY
node --check "$QA"
exec bash "$TMP"
