#!/usr/bin/env python3
"""Selected Thinking R3.2 isolated GitHub QA evidence; never used by production."""
from pathlib import Path
import json, os, re, time, urllib.request
from playwright.sync_api import sync_playwright

OUT=Path("qa-r32"); OUT.mkdir(exist_ok=True)
for name in ["screenshots","frames"]:(OUT/name).mkdir(exist_ok=True)
FINAL="http://127.0.0.1:4177"
BEFORE="http://127.0.0.1:4178"
for server in [FINAL,BEFORE]:
    for _ in range(70):
        try:urllib.request.urlopen(server,timeout=1);break
        except Exception:time.sleep(.25)
    else:raise SystemExit(f"HTTP server unreachable: {server}")

paths={"home_ru":"/ru/","home_en":"/","hub_ru":"/ru/insights/","article_ru":"/ru/insights/what-happens-after-a-lead-arrives/"}
sizes=[("desktop-1280",1280,800,False),("desktop-1440",1440,900,False),("desktop-1600",1600,900,False),("desktop-1920",1920,1080,False),
 ("portrait-320",320,700,True),("portrait-360",360,780,True),("portrait-375",375,812,True),("portrait-390",390,844,True),("portrait-430",430,932,True),
 ("landscape-844",844,390,True),("landscape-932",932,430,True)]
fail=[];results=[];comparisons=[]
def settle(page):
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(120)
def check_page(page,route,language,engine,size):
    ret=page.evaluate("""() => {
      const root=document.querySelector('#selected-thinking-r2');
      const folio=root?.querySelector('.st-r2__folio');
      const title=root?.querySelector('.st-r2__lead-title');
      const hub=document.querySelector('.insights-v2--hub .insights-v2__record-index');
      const article=document.querySelector('.insight-v2-article__index');
      const box=x=>{const r=x?.getBoundingClientRect();return r?{w:r.width,h:r.height,x:r.x,y:r.y}:null};
      const css=x=>x?getComputedStyle(x):null;
      const num=x=>x?parseFloat(x):null;
      return {
        overflow:document.documentElement.scrollWidth-innerWidth,
        sectionHeight:box(root)?.h||null,sectionWidth:box(root)?.w||null,
        leadFontSize:num(css(title)?.fontSize),leadTitleHeight:box(title)?.h||null,
        leadTitleAboveFolio:!!title&&!!folio&&(num(css(title).fontSize)>num(css(folio).fontSize)*.28),
        folioStroke:css(folio)?.webkitTextStrokeWidth||null,
        folioFill:css(folio)?.color||null,
        folioSize:num(css(folio)?.fontSize),
        hubStroke:css(hub)?.webkitTextStrokeWidth||null,
        hubFill:css(hub)?.color||null,
        articleStroke:css(article)?.webkitTextStrokeWidth||null,
        articleFill:css(article)?.color||null,
        articleTitle:document.querySelector('.insight-v2-article__heading h1')?.textContent?.trim().slice(0,80)||null,
        homeRecords:root?.querySelectorAll('article').length||0,
        homeLinks:root?.querySelectorAll('article a[href]').length||0,
        closingCTA:!!root?.querySelector('.st-r2__close a[href="/insights/"], .st-r2__close a[href="/ru/insights/"]'),
        footer:!!document.querySelector('[data-home-footer-golden-r3]'),
        hrefs:root?[...root.querySelectorAll('article h3 a')].map(a=>a.getAttribute('href')):[],
        visibleTitles:root?[...root.querySelectorAll('article h3 a')].every(a=>{let r=a.getBoundingClientRect();return r.width>0&&r.height>0}):null,
        realFolioValues:root?[...root.querySelectorAll('.st-r2__folio,.st-r2__number')].map(n=>n.textContent.trim()):[],
        hubLedger:document.querySelectorAll('.insights-v2__ledger-row').length,
        siteHeader:!!document.querySelector('header'),
        htmlTitle:document.title,
        fontsReady:document.fonts.status==='loaded',
        noLiquid:!document.documentElement.outerHTML.includes('{%')&&!document.documentElement.outerHTML.includes('{{'),
        coverExists:!!article
      };
    }""")
    r={"engine":engine,"size":size,"route":route,"lang":language,**ret};results.append(r)
    if ret["overflow"]>1:fail.append(f"{engine}:{size}:{route}:page-overflow={ret['overflow']}")
    if not ret["footer"]:fail.append(f"{engine}:{size}:{route}:golden-footer")
    if not ret["noLiquid"]:fail.append(f"{engine}:{size}:{route}:raw-liquid")
    if route.startswith("home"):
        if ret["homeRecords"]!=3 or ret["homeLinks"]<4 or not ret["closingCTA"] or not ret["visibleTitles"] or ret["realFolioValues"]!=["01","02","03"]:
            fail.append(f"{engine}:{size}:{route}:editorial-contract")
        if not ret["folioStroke"] or float(ret["folioStroke"].removesuffix("px"))<.5 or ret["folioFill"] not in ["rgba(0, 0, 0, 0)","transparent"]:
            fail.append(f"{engine}:{size}:{route}:outline-folio:{ret['folioStroke']}:{ret['folioFill']}")
        if ret["leadFontSize"]<27:fail.append(f"{engine}:{size}:{route}:lead-font-too-small")
    elif route=="hub_ru":
        if ret["hubLedger"]!=12 or ret["hubStroke"] is None or float(ret["hubStroke"].removesuffix("px"))<.5 or ret["hubFill"] not in ["rgba(0, 0, 0, 0)","transparent"]:
            fail.append(f"{engine}:{size}:{route}:hub-material")
    elif route=="article_ru":
        if not ret["coverExists"] or not ret["articleStroke"] or float(ret["articleStroke"].removesuffix("px"))<.5:
            fail.append(f"{engine}:{size}:{route}:article-folio")
    return r

with sync_playwright() as p:
  for engine,t in [("chromium",p.chromium),("webkit",p.webkit)]:
    browser=t.launch()
    for name,w,h,touch in sizes:
      context=browser.new_context(viewport={"width":w,"height":h},is_mobile=touch,has_touch=touch,reduced_motion="reduce")
      for route,url in paths.items():
        page=context.new_page()
        try:
          page.goto(FINAL+url,wait_until="domcontentloaded",timeout=30000);settle(page)
          r=check_page(page,route,"ru" if "_ru" in route else "en",engine,name)
          if engine=="chromium" and route=="home_ru" and name in ("desktop-1440","desktop-1600","portrait-390","landscape-844"):
            page.add_style_tag(content="*,*::before,*::after{animation:none!important;transition:none!important}")
            shot=OUT/"screenshots"/f"r32-{route}-{name}.png"
            page.locator("#selected-thinking-r2").screenshot(path=str(shot),timeout=30000,animations="disabled")
          if engine=="chromium" and route=="home_en" and name=="desktop-1440":
            page.locator("#selected-thinking-r2").screenshot(path=str(OUT/"screenshots/r32-home_en-desktop-1440.png"),timeout=30000,animations="disabled")
          if engine=="chromium" and route=="hub_ru" and name=="desktop-1440":
            page.locator(".insights-v2__lead-record").screenshot(path=str(OUT/"screenshots/r32-hub_folio-1440.png"),timeout=30000,animations="disabled")
          if engine=="chromium" and route=="article_ru" and name=="desktop-1440":
            page.locator(".insight-v2-article__masthead").screenshot(path=str(OUT/"screenshots/r32-article_folio-1440.png"),timeout=30000,animations="disabled")
        except Exception as e:fail.append(f"{engine}:{name}:{route}:{type(e).__name__}:{str(e)[:180]}")
        finally:page.close()
      context.close()
    browser.close()
  # Controlled like-for-like A/B benchmark: production R3.1 from original main vs R3.2 from candidate.
  browser=p.chromium.launch()
  for width,height in [(1280,800),(1440,900),(1600,900),(1920,1080)]:
    for lang,url in [("ru","/ru/"),("en","/")]:
      pair={}
      for label,host in [("r31",BEFORE),("r32",FINAL)]:
        ctx=browser.new_context(viewport={"width":width,"height":height},reduced_motion="reduce")
        page=ctx.new_page()
        try:
          page.goto(host+url,wait_until="domcontentloaded",timeout=30000);settle(page)
          s=page.locator("#selected-thinking-r2")
          pair[label]=round(s.bounding_box()["height"],1)
          if width in (1440,1600) and (lang=="ru" or width==1440):
            page.add_style_tag(content="*,*::before,*::after{animation:none!important;transition:none!important}")
            s.screenshot(path=str(OUT/"screenshots"/f"{label}-home_{lang}-desktop-{width}.png"),timeout=35000,animations="disabled")
        except Exception as e:fail.append(f"AB:{label}:{width}:{lang}:{str(e)[:160]}")
        finally:ctx.close()
      if len(pair)==2:
        v=round(100*(pair["r31"]-pair["r32"])/pair["r31"],1)
        comparisons.append({"width":width,"lang":lang,"baseline":pair["r31"],"candidate":pair["r32"],"reductionPct":v})
        if pair["r32"]>=pair["r31"]-120:fail.append(f"HEIGHT:width={width}:lang={lang}:reduction-only-{pair['r31']-pair['r32']}")
  # Browser zoom via CSS zoom, supported by both target render engines.
  for engine,t in [("chromium",p.chromium),("webkit",p.webkit)]:
    browser=t.launch()
    for zoom in (1.25,1.5):
      for lang,url in [("ru","/ru/"),("en","/")]:
        ctx=browser.new_context(viewport={"width":1440,"height":900},reduced_motion="reduce")
        page=ctx.new_page()
        try:
          page.goto(FINAL+url,wait_until="domcontentloaded",timeout=30000);settle(page)
          page.evaluate("(z)=>{document.documentElement.style.zoom=z}",zoom)
          page.wait_for_timeout(150)
          v=page.evaluate("() => ({overflow:document.documentElement.scrollWidth-innerWidth, count:document.querySelectorAll('#selected-thinking-r2 article').length, lead:parseFloat(getComputedStyle(document.querySelector('#selected-thinking-r2 .st-r2__lead-title')).fontSize)})")
          results.append({"engine":engine,"zoom":zoom,"lang":lang,"route":"zoom","size":"desktop-1440",**v})
          if v["overflow"]>1 or v["count"]!=3 or v["lead"]<27:fail.append(f"ZOOM:{engine}:{zoom}:{lang}:{v}")
        except Exception as e:fail.append(f"ZOOM:{engine}:{zoom}:{lang}:{e}")
        finally:ctx.close()
    browser.close()
  # Explicit no-JS content checks.
  browser=p.chromium.launch()
  for lang,url in [("ru","/ru/"),("en","/")]:
    ctx=browser.new_context(viewport={"width":390,"height":844},is_mobile=True,has_touch=True,java_script_enabled=False)
    page=ctx.new_page();page.goto(FINAL+url,wait_until="domcontentloaded");settle(page)
    if page.locator("#selected-thinking-r2 article").count()!=3 or not page.locator(".st-r2__close a").is_visible():
      fail.append(f"NOJS:{lang}:unreadable")
    ctx.close()
  browser.close()
  # One-shot temporal frames (no infinite loop, no permanent hiding).
  browser=p.chromium.launch()
  ctx=browser.new_context(viewport={"width":1440,"height":900},reduced_motion="no-preference")
  page=ctx.new_page();page.goto(FINAL+"/ru/",wait_until="domcontentloaded");settle(page)
  page.locator("#selected-thinking-r2").scroll_into_view_if_needed()
  page.evaluate("() => document.querySelector('#selected-thinking-r2').classList.remove('st-r31-entered')")
  for t_ms in (0,200,600,1300):
    if t_ms==0:page.evaluate("() => document.querySelector('#selected-thinking-r2').classList.add('st-r31-entered')")
    else:page.wait_for_timeout(t_ms-(0 if t_ms==200 else {600:200,1300:600}[t_ms]))
    try:page.locator("#selected-thinking-r2").screenshot(path=str(OUT/"frames"/f"r32-motion-{t_ms:04d}.png"),timeout=30000)
    except Exception as e:fail.append(f"MOTION_SCREEN:{t_ms}:{str(e)[:160]}")
  finalVis=page.evaluate("()=>({opacity:getComputedStyle(document.querySelector('.st-r2__lead-title')).opacity, animation:getComputedStyle(document.querySelector('.st-r2__folio')).animationIterationCount})")
  if finalVis["opacity"]=="0" or finalVis["animation"] not in ("1","1.0"):fail.append(f"MOTION_STABLE:{finalVis}")
  ctx.close();browser.close()
  
(OUT/"report.json").write_text(json.dumps({"states":len(results),"failures":fail,"comparisons":comparisons,"rows":results},ensure_ascii=False,indent=2))
print("R32_BENCHMARK:",json.dumps(comparisons,ensure_ascii=False))
print("R32_BROWSER_QA:",json.dumps({"states":len(results),"failures":fail},ensure_ascii=False))
if fail:raise SystemExit(1)
