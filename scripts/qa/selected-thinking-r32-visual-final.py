from playwright.sync_api import sync_playwright
from pathlib import Path
import json, time, urllib.request, base64
OUT=Path("qa-r32-fast");(OUT/"screenshots").mkdir(parents=True,exist_ok=True);(OUT/"frames").mkdir(exist_ok=True)
for port in (4177,4178):
 for i in range(60):
  try:urllib.request.urlopen(f"http://127.0.0.1:{port}/",timeout=1);break
  except:time.sleep(.2)
 else:raise SystemExit("server not ready")
SIZES=[("desktop-1280",1280,800,False),("desktop-1440",1440,900,False),("desktop-1600",1600,900,False),("desktop-1920",1920,1080,False),
("portrait-320",320,700,True),("portrait-360",360,780,True),("portrait-375",375,812,True),("portrait-390",390,844,True),("portrait-430",430,932,True),
("landscape-844",844,390,True),("landscape-932",932,430,True)]
errors=[];rows=[];shots=[];heights=[]
def visit(page,host,route):
 page.goto(host+route,wait_until="domcontentloaded",timeout=25000);page.wait_for_timeout(190)
def capture_cdp(page,path):
 # CDP screenshot is an actual Chromium compositor frame, with no Playwright
 # external web-font waiting or animation settlement side effects.
 result=page.context.new_cdp_session(page).send("Page.captureScreenshot",{"format":"png","fromSurface":True,"captureBeyondViewport":False})
 path.write_bytes(base64.b64decode(result["data"]))
 if path.stat().st_size < 1000: raise ValueError("empty PNG capture")
def image(page,name):
 path=OUT/"screenshots"/name
 capture_cdp(page,path)
 shots.append(name)
def state(page,who,engine,size,w):
 d=page.evaluate("""()=>{
 const s=document.querySelector('#selected-thinking-r2');
 const f=s?.querySelector('.st-r2__folio'), n=s?.querySelectorAll('.st-r2__number')||[];
 const hub=document.querySelector('.insights-v2--hub .insights-v2__record-index');
 const article=document.querySelector('.insight-v2-article__index');
 const cs=x=>x?getComputedStyle(x):null;
 const fs=x=>x?parseFloat(cs(x).fontSize):null;
 return {
 height:s?.getBoundingClientRect().height||null, overflow:document.documentElement.scrollWidth-innerWidth,
 records:s?.querySelectorAll('article').length||0,headings:s?[...s.querySelectorAll('article h3 a')].every(x=>x.offsetWidth>0&&x.offsetHeight>0):false,
 closing:!!s?.querySelector('.st-r2__close a[href]'), links:s?[...s.querySelectorAll('article h3 a')].map(x=>x.getAttribute('href')):[],
 folioValues:s?[f,...n].map(x=>x.textContent.trim()):[],
 folioFill:cs(f)?.color,folioStroke:cs(f)?.webkitTextStrokeWidth,
 supportStroke:cs(n[0])?.webkitTextStrokeWidth,supportFill:cs(n[0])?.color,
 leadTitleFont:fs(s?.querySelector('.st-r2__lead-title')),summaryFont:fs(s?.querySelector('.st-r2__summary')),
 metadataFont:fs(s?.querySelector('.st-r2__meta')),hubFill:cs(hub)?.color,hubStroke:cs(hub)?.webkitTextStrokeWidth,
 articleStroke:cs(article)?.webkitTextStrokeWidth,hubLedger:document.querySelectorAll('.insights-v2__ledger-row').length,
 footer:!!document.querySelector('[data-home-footer-golden-r3]'),
 rawLiquid:document.documentElement.outerHTML.includes('{%')||document.documentElement.outerHTML.includes('{{'),
 fontsLoaded:document.fonts.status==='loaded'
 };
 }""")
 rows.append({"route":who,"engine":engine,"size":size,**d})
 if d["overflow"]>1:errors.append(f"{engine}:{size}:{who}:overflow={d['overflow']}")
 if not d["footer"] or d["rawLiquid"]:errors.append(f"{engine}:{size}:{who}:footer-or-liquid")
 if who.startswith("home"):
  if d["records"]!=3 or not d["headings"] or not d["closing"] or d["folioValues"]!=["01","02","03"]:errors.append(f"{engine}:{size}:{who}:three-record-contract")
  if not d["folioStroke"] or float(d["folioStroke"].replace("px",""))<.5 or d["folioFill"] not in ("rgba(0, 0, 0, 0)","transparent"):errors.append(f"{engine}:{size}:{who}:lead-folio")
  if not d["supportStroke"] or float(d["supportStroke"].replace("px",""))<.5 or d["supportFill"] not in ("rgba(0, 0, 0, 0)","transparent"):errors.append(f"{engine}:{size}:{who}:support-folio")
  if d["leadTitleFont"]<27 or d["summaryFont"]<15 or d["metadataFont"]<11.5:errors.append(f"{engine}:{size}:{who}:legibility")
 elif who=="hub_ru":
  if d["hubLedger"]!=12 or not d["hubStroke"] or float(d["hubStroke"].replace("px",""))<.5 or d["hubFill"] not in ("rgba(0, 0, 0, 0)","transparent"):errors.append(f"{engine}:{size}:{who}:hub-folio")
 elif who=="article_ru":
  if not d["articleStroke"] or float(d["articleStroke"].replace("px",""))<.5:errors.append(f"{engine}:{size}:{who}:article-folio")
 return d
with sync_playwright() as p:
 for engine,typ in (("chromium",p.chromium),("webkit",p.webkit)):
  browser=typ.launch()
  for name,w,h,touch in SIZES:
   ctx=browser.new_context(viewport={"width":w,"height":h},is_mobile=touch,has_touch=touch,reduced_motion="reduce")
   for lang,route in (("ru","/ru/"),("en","/")):
    page=ctx.new_page()
    try:
     visit(page,"http://127.0.0.1:4177",route)
     d=state(page,"home_"+lang,engine,name,w)
     if engine=="chromium" and ((lang=="ru" and name in ("desktop-1440","desktop-1600","portrait-390","landscape-844")) or (lang=="en" and name=="desktop-1440")):
      page.evaluate("()=>document.querySelector('#selected-thinking-r2').scrollIntoView({block:'start',behavior:'instant'})")
      image(page,f"r32-home_{lang}-{name}.png")
    except Exception as e:errors.append(f"{engine}:{name}:{lang}:{type(e).__name__}:{str(e)[:130]}")
    finally:page.close()
   ctx.close()
  # Hub and Article V2 at representative desktop/mobile/landscape viewport.
  for name,w,h,touch in (("desktop-1440",1440,900,False),("portrait-390",390,844,True),("landscape-844",844,390,True)):
   ctx=browser.new_context(viewport={"width":w,"height":h},is_mobile=touch,has_touch=touch,reduced_motion="reduce")
   for kind,route in (("hub_ru","/ru/insights/"),("article_ru","/ru/insights/chto-proiskhodit-posle-zayavki/")):
    page=ctx.new_page()
    try:
     visit(page,"http://127.0.0.1:4177",route);state(page,kind,engine,name,w)
     if engine=="chromium" and name=="desktop-1440":
      selector=".insights-v2__lead-record" if kind=="hub_ru" else ".insight-v2-article__masthead"
      page.locator(selector).scroll_into_view_if_needed()
      image(page,f"r32-{kind}-desktop-1440.png")
    except Exception as e:errors.append(f"{engine}:{name}:{kind}:{type(e).__name__}:{str(e)[:130]}")
    finally:page.close()
   ctx.close()
  browser.close()
 # A/B actual browser screenshot, same 1440 RU/EN and 1600 RU coordinates.
 browser=p.chromium.launch()
 for name,w,h,lang,route in [("desktop-1440",1440,900,"ru","/ru/"),("desktop-1440",1440,900,"en","/"),("desktop-1600",1600,900,"ru","/ru/")]:
  pairs={}
  for label,port in (("r31",4178),("r32",4177)):
   ctx=browser.new_context(viewport={"width":w,"height":h},reduced_motion="reduce")
   page=ctx.new_page()
   try:
    visit(page,f"http://127.0.0.1:{port}",route)
    sec=page.locator("#selected-thinking-r2")
    pairs[label]=round(sec.bounding_box()["height"],1)
    page.evaluate("()=>document.querySelector('#selected-thinking-r2').scrollIntoView({block:'start',behavior:'instant'})")
    image(page,f"{label}-home_{lang}-{name}.png")
   except Exception as e:errors.append(f"AB:{label}:{name}:{lang}:{str(e)[:120]}")
   finally:ctx.close()
  if len(pairs)==2:
   heights.append({"width":w,"lang":lang,"baseline":pairs["r31"],"candidate":pairs["r32"],
       "reductionPct":round((pairs["r31"]-pairs["r32"])/pairs["r31"]*100,1)})
 # Motion frames: capture viewport at known 0,200,600,1300ms intervals.
 ctx=browser.new_context(viewport={"width":1440,"height":900},reduced_motion="no-preference")
 page=ctx.new_page();visit(page,"http://127.0.0.1:4177","/ru/")
 page.evaluate("()=>document.querySelector('#selected-thinking-r2').scrollIntoView({block:'start',behavior:'instant'})")
 page.evaluate("()=>{document.querySelector('#selected-thinking-r2').classList.remove('st-r31-entered')}")
 for time_ms in (0,200,600,1300):
  if time_ms==0:page.evaluate("()=>{document.querySelector('#selected-thinking-r2').classList.add('st-r31-entered')}")
  else:page.wait_for_timeout(time_ms-(0 if time_ms==200 else 200 if time_ms==600 else 600))
  capture_cdp(page,OUT/"frames"/f"r32-motion-{time_ms:04d}.png")
 if page.evaluate("()=>parseFloat(getComputedStyle(document.querySelector('#selected-thinking-r2 .st-r2__lead-title')).opacity)")<.99:errors.append("motion-did-not-settle")
 ctx.close();browser.close()
 # Zoom as CSS browser layout approximation (125% / 150%), both engines.
 for engine,typ in (("chromium",p.chromium),("webkit",p.webkit)):
  b=typ.launch()
  for zoom in (1.25,1.5):
   for lang,route in (("ru","/ru/"),("en","/")):
    c=b.new_context(viewport={"width":1440,"height":900},reduced_motion="reduce")
    page=c.new_page()
    try:
     visit(page,"http://127.0.0.1:4177",route)
     page.evaluate("(z)=>{document.documentElement.style.zoom=z}",zoom)
     d=page.evaluate("()=>({overflow:document.documentElement.scrollWidth-innerWidth,count:document.querySelectorAll('#selected-thinking-r2 article').length})")
     if d["overflow"]>1 or d["count"]!=3:errors.append(f"zoom:{engine}:{lang}:{zoom}:{d}")
    except Exception as e:errors.append(f"zoom:{engine}:{lang}:{zoom}:{e}")
    finally:c.close()
  b.close()
 # No-JS, reduced motion requires full static content.
 b=p.chromium.launch()
 for lang,route in (("ru","/ru/"),("en","/")):
  c=b.new_context(viewport={"width":390,"height":844},java_script_enabled=False,is_mobile=True,has_touch=True,reduced_motion="reduce")
  page=c.new_page();visit(page,"http://127.0.0.1:4177",route)
  if page.locator("#selected-thinking-r2 article").count()!=3 or page.locator(".st-r2__close a").count()!=1:errors.append(f"noJS:{lang}")
  c.close()
 b.close()
(OUT/"qa.json").write_text(json.dumps({"states":len(rows),"failures":errors,"heights":heights,"screenshots":shots,"rows":rows},ensure_ascii=False,indent=2))
print("R32_FINAL_HEIGHTS:",json.dumps(heights,ensure_ascii=False))
print("R32_FINAL_QA:",json.dumps({"states":len(rows),"failures":errors,"screenshots":len(shots)},ensure_ascii=False))
if errors:raise SystemExit(1)
