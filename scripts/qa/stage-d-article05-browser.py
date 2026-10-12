from playwright.sync_api import sync_playwright
from pathlib import Path
import base64,json,urllib.request,time,re
BASE="http://127.0.0.1:4178"
OUT=Path("qa-stage-d");(OUT/"screenshots").mkdir(parents=True,exist_ok=True)
ROUTES={"en":"/insights/ai-search-optimization-for-service-businesses/","ru":"/ru/insights/ai-search-optimization-dlya-servisnogo-biznesa/"}
SIZES=[("desktop-1280",1280,800,False),("desktop-1440",1440,900,False),("desktop-1600",1600,900,False),("desktop-1920",1920,1080,False),
("portrait-320",320,700,True),("portrait-360",360,780,True),("portrait-375",375,812,True),("portrait-390",390,844,True),("portrait-430",430,932,True),
("landscape-844",844,390,True),("landscape-932",932,430,True)]
for _ in range(60):
 try:urllib.request.urlopen(BASE,timeout=1);break
 except Exception:time.sleep(.2)
else:raise RuntimeError("Jekyll HTTP server not available")
fail=[];rows=[];shots=[]
def screenshot_cdp(page,name):
 path=OUT/"screenshots"/name
 client=page.context.new_cdp_session(page)
 try:
  png=base64.b64decode(client.send("Page.captureScreenshot",{"format":"png","fromSurface":True,"captureBeyondViewport":False})["data"])
  path.write_bytes(png)
  if len(png)<1000:raise ValueError("empty compositor capture")
  shots.append(name)
 finally:client.detach()
with sync_playwright() as p:
 for engine,browser_type in (("chromium",p.chromium),("webkit",p.webkit)):
  browser=browser_type.launch()
  for name,w,h,touch in SIZES:
   context=browser.new_context(viewport={"width":w,"height":h},is_mobile=touch,has_touch=touch,reduced_motion="reduce")
   for lang,route in ROUTES.items():
    page=context.new_page()
    try:
     page.goto(BASE+route,wait_until="domcontentloaded",timeout=30000)
     page.wait_for_function("document.querySelector('article.insight-v2-article') && document.querySelectorAll('.insight-v2-decision-table').length === 3",timeout=12000)
     page.wait_for_timeout(160)
     d=page.evaluate("""()=>{
       let main=document.querySelector('.insight-v2-article'),tables=[...document.querySelectorAll('.insight-v2-table-wrap')];
       let by=document.querySelector('.insight-v2-author');
       let l=main.querySelector('.insights-v2__prose');
       let h2=[...l.querySelectorAll('h2[id]')];
       let toc=[...document.querySelectorAll('.insight-v2-contents a[href^="#"]')];
       let rail=[...document.querySelectorAll('.insight-v2-rail a[href^="#"]')];
       let urls=Object.fromEntries([...document.querySelectorAll('script[type="application/ld+json"]')].map((s,i)=>[i,s.textContent]));
       return {
         overflow:document.documentElement.scrollWidth-innerWidth,
         headings:toc.filter(a=>h2.some(h=>h.id===a.hash.slice(1))).length,nav:toc.length,rail:rail.length,
         navTargets:toc.every(x=>!!document.getElementById(x.hash.slice(1))),
         railTargets:rail.every(x=>!!document.getElementById(x.hash.slice(1))),
         tableCount:tables.length,tableRows:tables.map(x=>x.querySelectorAll('tbody tr').length),
         tableHeaders:tables.every(x=>x.querySelectorAll('th[scope="col"]').length>=4&&x.querySelectorAll('th[scope="row"]').length>=3),
         scrollable:tables.map(x=>x.scrollWidth>x.clientWidth+5),
         focusable:tables.every(x=>x.tabIndex===0&&x.getAttribute('role')==='region'),
         minBodyFont:parseFloat(getComputedStyle(l.querySelector('p')).fontSize),
         author:by?.getAttribute('data-author-type'),logo:!!by?.querySelector('.insight-v2-author__logo')?.naturalWidth,
         noLiquid:!document.documentElement.outerHTML.includes('{%')&&!document.documentElement.outerHTML.includes('{{'),
         footer:!!document.querySelector('[data-home-footer-golden-r3]'),
         related:!!document.querySelector('[data-related-decisions]'),
         cssLoaded:parseFloat(getComputedStyle(main.querySelector('h1')).fontSize)>24,
         enRuLinks:[...document.querySelectorAll('link[hreflang]')].map(x=>x.getAttribute('hreflang')),
         allLinks:[...l.querySelectorAll('a[href^="/"]')].map(x=>x.getAttribute('href'))
       };
     }""")
     rows.append({"engine":engine,"size":name,"lang":lang,**d})
     if d["overflow"]>1:fail.append(f"{engine}:{name}:{lang}:document-overflow={d['overflow']}")
     if d["headings"]!=10 or d["nav"]!=10 or d["rail"]!=10 or not d["navTargets"] or not d["railTargets"]:fail.append(f"{engine}:{name}:{lang}:TOC/rail")
     if d["tableCount"]!=3 or d["tableRows"]!=[4,5,3] or not d["tableHeaders"] or not d["focusable"]:fail.append(f"{engine}:{name}:{lang}:accessible-tables")
     if w<900 and not all(d["scrollable"]):fail.append(f"{engine}:{name}:{lang}:tables-must-scroll")
     if d["minBodyFont"]<14 or d["author"]!="organization" or not d["logo"] or not d["related"] or not d["footer"] or not d["cssLoaded"] or not d["noLiquid"]:fail.append(f"{engine}:{name}:{lang}:content-or-style")
     if sorted(d["enRuLinks"])!=["en","ru","x-default"]:fail.append(f"{engine}:{name}:{lang}:hreflang")
     if engine=="chromium" and (name in ("desktop-1440","portrait-390","landscape-844")):
      page.evaluate("()=>document.querySelector('.insight-v2-article__masthead').scrollIntoView({block:'start',behavior:'instant'})")
      screenshot_cdp(page,f"{lang}-{name}-cover.png")
      page.evaluate("()=>document.querySelector('.insight-v2-decision-table').scrollIntoView({block:'start',behavior:'instant'})")
      screenshot_cdp(page,f"{lang}-{name}-channel-matrix.png")
    except Exception as e:fail.append(f"{engine}:{name}:{lang}:{type(e).__name__}:{str(e)[:160]}")
    finally:page.close()
   context.close()
  browser.close()
 # No-JS and actual keyboard horizontal scrolling.
 for engine,browser_type in (("chromium",p.chromium),("webkit",p.webkit)):
  browser=browser_type.launch()
  for lang,route in ROUTES.items():
   c=browser.new_context(viewport={"width":390,"height":844},is_mobile=True,has_touch=True,java_script_enabled=False,reduced_motion="reduce")
   page=c.new_page()
   try:
    page.goto(BASE+route,wait_until="domcontentloaded",timeout=30000)
    if page.locator(".insight-v2-article h1").count()!=1 or page.locator(".insight-v2-decision-table").count()!=3:fail.append(f"{engine}:{lang}:no-JS-content")
    table=page.locator(".insight-v2-table-wrap").first
    table.focus()
    page.keyboard.press("ArrowRight")
    page.wait_for_timeout(100)
    left=table.evaluate("(el)=>el.scrollLeft")
    if left<=0:fail.append(f"{engine}:{lang}:keyboard-scroll")
   except Exception as e:fail.append(f"{engine}:{lang}:noJS:{str(e)[:150]}")
   finally:c.close()
  browser.close()
(OUT/"report.json").write_text(json.dumps({"states":len(rows),"errors":fail,"screenshots":shots,"rows":rows},ensure_ascii=False,indent=2))
print("STAGE_D_BROWSER_QA="+json.dumps({"states":len(rows),"errors":fail,"screenshots":len(shots)},ensure_ascii=False))
if fail:raise SystemExit(1)
