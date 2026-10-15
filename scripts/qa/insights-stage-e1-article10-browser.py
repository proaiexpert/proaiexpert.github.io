#!/usr/bin/env python3
"""Stage E.1 Article 10 / Chromium-WebKit bilingual, Jekyll-rendered QA."""
import base64,json,re,time
from pathlib import Path
from urllib.request import urlopen
from playwright.sync_api import sync_playwright
OUT=Path("qa-stage-e1");(OUT/"screenshots").mkdir(parents=True,exist_ok=True)
HOST="http://127.0.0.1:4185"
for _ in range(80):
 try:urlopen(HOST,timeout=1);break
 except Exception:time.sleep(.25)
else:raise RuntimeError("Jekyll HTTP server not available")
routes={
 "en":"/insights/why-service-business-websites-fail-to-convert-high-intent-visitors/",
 "ru":"/ru/insights/arkhitektura-konversii-gde-sayt-teryaet-klienta-eshche-do-pervogo-kontakta/"
}
sizes=[("desktop-1280",1280,900,False),("desktop-1440",1440,900,False),("desktop-1600",1600,900,False),
("zoom-125-equivalent",1024,750,False),("zoom-150-equivalent",853,650,False),
("portrait-320",320,700,True),("portrait-375",375,812,True),
("portrait-390",390,844,True),("portrait-430",430,932,True),
("landscape-844",844,390,True),("landscape-932",932,430,True)]
expected=["diagnosis","decision-path","diagnostic-ledger","ten-minute-triage","offer-and-fit","sequence-and-proof","contact-and-handoff","measurement","worked-example","decide-next","sources"]
failures=[];rows=[];shots=[]
def capture(page,path):
 session=page.context.new_cdp_session(page)
 try:
  s=session.send("Page.captureScreenshot",{"format":"png","fromSurface":True,"captureBeyondViewport":False})
  data=base64.b64decode(s["data"])
  if data[:8]!=b"\x89PNG\r\n\x1a\n" or len(data)<4000:raise ValueError("invalid screenshot")
  Path(path).write_bytes(data)
 finally:session.detach()
def load(page,url):
 page.goto(url,wait_until="domcontentloaded",timeout=25000)
 page.wait_for_function("""() => {
 let a=document.querySelector('.insight-v2-article__heading h1');
 let x=document.querySelector('.insight-v2-decision-table');
 return a&&x&&getComputedStyle(a).fontSize!=="0px" &&
      getComputedStyle(x).borderCollapse==="collapse";
 }""",timeout=15000)
 page.wait_for_timeout(150)
def audit(page,engine,lang,size):
 d=page.evaluate("""()=> {
 const q=s=>document.querySelector(s);
 const a=s=>[...document.querySelectorAll(s)];
 const css=x=>x?getComputedStyle(x):null;
 const h1=q('.insight-v2-article__heading h1');
 const tables=a('.insight-v2-decision-table');
 const wrappers=a('.insight-v2-table-wrap');
 const links=a('.insight-v2__prose a[href]');
 const titleIds=a('.insight-v2__prose h2[id]:not(#related-decisions-heading)').map(n=>n.id);
 const tocIds=a('.insight-v2-contents a[href^="#"]').map(n=>n.getAttribute('href').slice(1));
 const railIds=a('.insight-v2-rail a[href^="#"]').map(n=>n.getAttribute('href').slice(1));
 const meta=q('meta[name="description"]')?.content||'';
 const ld=a('script[type="application/ld+json"]').map(x=>{try{return JSON.parse(x.textContent)}catch(e){return null}});
 const jsonArticle=ld.flatMap(x=>x?.["@graph"]||[]).find(x=>x["@type"]==="Article");
 const img=q('.insight-v2-author__logo');
 const maxW=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth);
 return {
  route:location.pathname,overflow:maxW-innerWidth, 
  outerOverflowElements:a('body *').filter(el=>{
    let r=el.getBoundingClientRect(),c=getComputedStyle(el);
    return c.display!=='none'&&c.visibility!=='hidden'&&r.width>0&&r.right>innerWidth+1&&r.left<innerWidth;
  }).slice(0,18).map(el=>({
    tag:el.tagName, cls:String(el.className).slice(0,90),
    right:Math.round(el.getBoundingClientRect().right),
    left:Math.round(el.getBoundingClientRect().left),
    sw:el.scrollWidth,cw:el.clientWidth
  })),
  h1:h1?.textContent.trim(),font:parseFloat(css(h1)?.fontSize),
  titleIds,tocIds,railIds, tables:tables.length, captions:tables.map(t=>t.querySelector('caption')?.textContent.trim()||""),
  tableA11y:wrappers.map(w=>({tab:w.getAttribute('tabindex'),role:w.getAttribute('role'),
      label:w.getAttribute('aria-label'),scrollWidth:w.scrollWidth,clientWidth:w.clientWidth})),
  missingHeaders:tables.filter(t=>!t.querySelector('thead th[scope="col"]')||!t.querySelector('tbody th[scope="row"]')).length,
  invalidInternalLinks:links.filter(x=>x.pathname.startsWith("/")&&x.host===location.host&&!x.getAttribute('href')).length,
  requiredExternalRefs:links.filter(x=>x.href.startsWith("https://developers.google.com")||x.href.startsWith("https://developers.openai.com")||x.href.startsWith("https://support.google.com")).length,
  localeService:!!q('.insight-v2__prose a[href$="/websites-branding/"]'),
  localeAiReady:!!q('.insight-v2__prose a[href*="ai-ready-"]'),
  localeArticle01:!!q('.insight-v2__prose a[href*="what-happens-after-a-lead-arrives"],.insight-v2__prose a[href*="chto-proiskhodit-posle-zayavki"]'),
  localeArticle03:!!q('.insight-v2__prose a[href*="how-to-evaluate-a-website-proposal"],.insight-v2__prose a[href*="kak-proverit-predlozhenie-na-sayt"]'),
  localeArticle11:!!q('.insight-v2__prose a[href*="how-much-does-a-business-website-cost"],.insight-v2__prose a[href*="ekonomika-proekta-pochemu"]'),
  localeCase:!!q('.insight-v2__prose a[href*="/case-studies/local-repair-pro/"]'),
  cta:!!q('.insight-v2-article-cta a[href*="project-intake"]'),
  author:q('.insight-v2-author')?.getAttribute('data-author-type'),logoOK:!!img&&img.naturalWidth>0,
  canonical:q('link[rel="canonical"]')?.href,alternates:a('link[rel="alternate"][hreflang]').map(x=>[x.hreflang,x.href]),
  published:q('meta[property="article:published_time"]')?.content,modified:q('meta[property="article:modified_time"]')?.content,
  schemaType:jsonArticle?.["@type"],schemaAuthor:jsonArticle?.author?.["@type"],
  schemaDates:[jsonArticle?.datePublished,jsonArticle?.dateModified],
  primarySources:['https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
     'https://developers.google.com/search/docs/monitor-debug/search-console-start',
     'https://support.google.com/analytics/answer/9267735',
     'https://support.google.com/analytics/answer/12944921',
     'https://web.dev/articles/optimize-inp'].map(url=>links.some(x=>x.href.split("?")[0]===url)),
  frameworkPresent:!!q('#decision-path')?.parentElement?.textContent.includes('Conversion Evidence Chain') ||
                   !!q('#decision-path')?.parentElement?.textContent.includes('Цепочку доказательств конверсии'),
  triagePresent:!!q('#ten-minute-triage') && q('#ten-minute-triage').nextElementSibling?.textContent.length>50,
  fictionalBoundary:!!q('#worked-example') && q('#worked-example').nextElementSibling?.textContent.length>60,
  bookendLinks:!!q('.insight-v2__prose a[href*="project-intake"]'),
  description:meta,footer:!!q('[data-home-footer-golden-r3]'),
  rawLiquid:document.documentElement.outerHTML.includes('{%')||document.documentElement.outerHTML.includes('{{'),
  hasHorizontalTable:wrappers.some(x=>x.scrollWidth>x.clientWidth+2)
 };
 }""")
 rows.append({"engine":engine,"lang":lang,"viewport":size,**d})
 tag=f"{engine}:{lang}:{size}"
 if d["overflow"]>1:failures.append(f"{tag}:document overflow {d['overflow']} sources: {d['outerOverflowElements'][:6]}")
 if not d["h1"] or d["font"]<26 or d["titleIds"]!=expected or d["tocIds"]!=expected or d["railIds"]!=expected:
  failures.append(f"{tag}:title/TOC/rail invalid")
 if d["tables"]!=2 or d["missingHeaders"] or any(not c for c in d["captions"]):
  failures.append(f"{tag}:table semantic failure")
 if any(w["role"]!="region" or w["tab"]!="0" or not w["label"] for w in d["tableA11y"]):
  failures.append(f"{tag}:table scroll accessibility failure")
 if d["author"]!="organization" or not d["logoOK"]:failures.append(f"{tag}:Organization author/logo")
 if not all([d["localeService"],d["localeAiReady"],d["localeArticle01"],d["localeArticle03"],d["localeArticle11"],d["localeCase"],d["cta"]]):
  failures.append(f"{tag}:internal editorial/commercial links")
 if d["requiredExternalRefs"]<5:failures.append(f"{tag}:primary-source citations")
 if not all(d["primarySources"]):failures.append(f"{tag}:missing official primary-source links")
 if not all([d["frameworkPresent"],d["triagePresent"],d["fictionalBoundary"],d["bookendLinks"]]):
  failures.append(f"{tag}:missing expert framework or CTA")
 if not d["canonical"].endswith(routes[lang]) or len(d["alternates"])!=3:
  failures.append(f"{tag}:canonical/hreflang")
 if d["published"]!="2026-04-05" or d["modified"]!="2026-10-15" or d["schemaType"]!="Article" or d["schemaAuthor"]!="Organization" or d["schemaDates"]!=["2026-04-05","2026-10-15"]:
  failures.append(f"{tag}:metadata/schema")
 if not d["description"] or not d["footer"] or d["rawLiquid"]:failures.append(f"{tag}:shell/liquid/meta")
 return d

with sync_playwright() as p:
 for engine,typ in [("chromium",p.chromium),("webkit",p.webkit)]:
  browser=typ.launch()
  for size,w,h,touch in sizes:
   context=browser.new_context(viewport={"width":w,"height":h},is_mobile=touch,has_touch=touch,reduced_motion="reduce")
   for lang,route in routes.items():
    page=context.new_page()
    try:
     load(page,HOST+route)
     audit(page,engine,lang,size)
     if engine=="chromium" and ((size in ("desktop-1440","zoom-125-equivalent","portrait-390","landscape-844") and lang in ("en","ru")) or (size=="portrait-320" and lang=="ru")):
      page.evaluate("()=>window.scrollTo(0,0)")
      path=OUT/"screenshots"/f"article10-{lang}-{size}.png"
      capture(page,path);shots.append(path.name)
     if engine=="chromium" and size in ("desktop-1440","portrait-390"):
      for section in ("diagnostic-ledger","ten-minute-triage","measurement"):
       page.locator("#"+section).scroll_into_view_if_needed()
       page.wait_for_timeout(100)
       shot=OUT/"screenshots"/f"article10-d1-{lang}-{size}-{section}.png"
       capture(page,shot);shots.append(shot.name)
     if engine=="webkit" and size in ("portrait-390","landscape-844") and lang in ("en","ru"):
      # Ensure keyboard focus can move the semantic table horizontally.
      q=page.locator('.insight-v2-table-wrap').first
      q.focus()
      before=q.evaluate("(x)=>x.scrollLeft")
      q.press("ArrowRight")
      page.wait_for_timeout(80)
      after=q.evaluate("(x)=>x.scrollLeft")
      if q.evaluate("(x)=>x.scrollWidth>x.clientWidth") and after<=before:
       failures.append(f"webkit:{lang}:{size}:table keyboard horizontal scroll fails")
    except Exception as e:
     failures.append(f"{engine}:{lang}:{size}:{type(e).__name__}: {str(e)[:240]}")
    finally:page.close()
   context.close()
  browser.close()
 # no-JS: article source text, contents, links, and tables must remain available
 browser=p.chromium.launch()
 for lang,route in routes.items():
  c=browser.new_context(viewport={"width":390,"height":844},java_script_enabled=False,is_mobile=True,has_touch=True,reduced_motion="reduce")
  page=c.new_page()
  try:
   load(page,HOST+route)
   if page.locator(".insight-v2__prose h2[id]:not(#related-decisions-heading)").count()!=11 or page.locator("table").count()!=2 or not page.locator(".insight-v2-article-cta a[href*='project-intake']").count():
    failures.append(f"nojs:{lang}:missing semantic content")
  except Exception as e:failures.append(f"nojs:{lang}:{str(e)[:160]}")
  finally:c.close()
 browser.close()
result={"states":len(rows),"errors":failures,"screenshots":shots,"rows":rows}
(OUT/"results.json").write_text(json.dumps(result,ensure_ascii=False,indent=2))
print("ARTICLE_10_BROWSER_QA="+json.dumps({"states":len(rows),"errors":failures,"screenshots":shots},ensure_ascii=False))
if failures:raise SystemExit(1)
