import json, html, pathlib

ROOT=pathlib.Path('docs/site-evolution/two-worlds-product-resurrection-r2')
REVIEW=ROOT/'review'
manifest=json.loads((ROOT/'resurrection-manifest.json').read_text())
summary=json.loads((REVIEW/'capture-summary.json').read_text())

cards=[]
for c in manifest['ownerGalleryCandidates']:
    cid=c['id']; r=summary['candidates'][cid]; p=f'media/{cid.lower()}'
    ov={
        'desktop': r['desktopOverflow']['delta'],
        'portrait': r['portraitOverflow']['delta'],
        'landscape': r['landscapeOverflow']['delta'],
        'technology desktop': r['techDesktop']['overflow']['delta'],
        'technology mobile': r['techMobile']['overflow']['delta'],
    }
    ov_text=' / '.join(f'{k}: {v:+d}px' for k,v in ov.items())
    failures=[]
    for key in ('desktopRequiredAssetFailures','portraitRequiredAssetFailures','landscapeRequiredAssetFailures','techDesktopRequiredAssetFailures','techMobileRequiredAssetFailures'):
        failures.extend(r.get(key,[]))
    failures_text='NONE' if not failures else html.escape(json.dumps(failures))
    ident=r['desktopIdentity']
    css=[x for x in ident.get('css',[]) if 'homepage-two-worlds-' in x]
    js=[x for x in ident.get('js',[]) if 'homepage-two-worlds-' in x]
    css_html='<br>'.join(html.escape(x) for x in css) or 'NONE'
    js_html='<br>'.join(html.escape(x) for x in js) or 'NONE'
    overflow_class='historical-overflow' if any(v != 0 for v in ov.values()) else 'zero-overflow'
    cards.append(f'''
<section class="candidate" id="candidate-{cid.lower()}">
  <div class="label">CANDIDATE {cid} — {html.escape(c['version'])}</div>
  <h2>{html.escape(c['version'])}</h2>
  <div class="meta">
    <div><b>PRODUCT SHA</b><code>{c['productSha']}</code></div>
    <div><b>EXACT-SHA RUNTIME</b><span>VERIFIED</span></div>
    <div class="{overflow_class}"><b>BODY OVERFLOW DELTA</b><span>{ov_text}</span></div>
    <div><b>REQUIRED ASSET FAILURES</b><span>{failures_text}</span></div>
    <div><b>LOADED TWO WORLDS CSS</b><span class="mono">{css_html}</span></div>
    <div><b>LOADED TWO WORLDS JS</b><span class="mono">{js_html}</span></div>
  </div>
  <h3>Fresh desktop motion — 1440 × 900</h3>
  <video controls playsinline preload="metadata" src="{p}/desktop-1440x900.mp4"></video>
  <div class="grid desktop">
    <figure><a href="{p}/01-neutral-1440x900.jpg"><img src="{p}/01-neutral-1440x900.jpg"></a><figcaption>01 Neutral</figcaption></figure>
    <figure><a href="{p}/02-ai-active-1440x900.jpg"><img src="{p}/02-ai-active-1440x900.jpg"></a><figcaption>02 AI Active</figcaption></figure>
    <figure><a href="{p}/03-web-active-1440x900.jpg"><img src="{p}/03-web-active-1440x900.jpg"></a><figcaption>03 Web Active</figcaption></figure>
  </div>
  <h3>Fresh mobile portrait motion — 390 × 844</h3>
  <video controls playsinline preload="metadata" src="{p}/mobile-390x844.mp4"></video>
  <div class="grid portrait">
    <figure><a href="{p}/04-ai-390x844.jpg"><img src="{p}/04-ai-390x844.jpg"></a><figcaption>04 AI</figcaption></figure>
    <figure><a href="{p}/05-turn-390x844.jpg"><img src="{p}/05-turn-390x844.jpg"></a><figcaption>05 THE TURN</figcaption></figure>
    <figure><a href="{p}/06-web-390x844.jpg"><img src="{p}/06-web-390x844.jpg"></a><figcaption>06 Web</figcaption></figure>
  </div>
  <h3>Fresh mobile landscape — 844 × 390</h3>
  <div class="grid landscape">
    <figure><a href="{p}/07-ai-844x390.jpg"><img src="{p}/07-ai-844x390.jpg"></a><figcaption>07 AI</figcaption></figure>
    <figure><a href="{p}/08-web-844x390.jpg"><img src="{p}/08-web-844x390.jpg"></a><figcaption>08 Web</figcaption></figure>
  </div>
  <h3>Technology subsystem</h3>
  <div class="grid tech">
    <figure><a href="{p}/09-tech-desktop.jpg"><img src="{p}/09-tech-desktop.jpg"></a><figcaption>09 Technology desktop</figcaption></figure>
    <figure><a href="{p}/10-tech-mobile.jpg"><img src="{p}/10-tech-mobile.jpg"></a><figcaption>10 Technology mobile</figcaption></figure>
  </div>
  <p class="json"><a href="{p}/runtime-report.json">Runtime identity / network / overflow report</a></p>
</section>''')

feedback='''CANDIDATE A:\nLIKE:\nDISLIKE:\n\nCANDIDATE B:\nLIKE:\nDISLIKE:\n\nCANDIDATE C:\nLIKE:\nDISLIKE:\n\nCANDIDATE D:\nLIKE:\nDISLIKE:\n\nBEST OVERALL:\nBEST COLOR:\nBEST MOTION:\nBEST MOBILE:\nBEST DESKTOP:\nBEST INSCRIPTION:'''

doc=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>ProAI Two Worlds — Historical Product Resurrection R2</title><style>
*{{box-sizing:border-box}}:root{{color-scheme:dark}}html,body{{margin:0;background:#030405;color:#f2f0eb;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}}main{{width:min(calc(100% - 24px),1500px);margin:auto;padding:30px 0 90px}}.kicker,.label{{color:#7d858d;font:700 10px/1.4 ui-monospace,SFMono-Regular,monospace;letter-spacing:.16em}}h1{{max-width:1050px;margin:10px 0 18px;font-size:clamp(38px,6vw,76px);line-height:.94;letter-spacing:-.055em}}.lede{{max-width:920px;color:#969da3;line-height:1.6}}.instruction{{margin:28px 0 50px;padding:20px;border:1px solid #252b31;background:#07090b;color:#bbc2c8;white-space:pre-wrap;font:600 12px/1.65 ui-monospace,SFMono-Regular,monospace}}.candidate{{padding:52px 0 70px;border-top:1px solid #252b31}}h2{{margin:8px 0 22px;font-size:clamp(32px,5vw,58px);letter-spacing:-.045em}}h3{{margin:38px 0 13px;font-size:15px}}.meta{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;max-width:1180px}}.meta>div{{padding:13px;border:1px solid #20262b;background:#06080a;overflow-wrap:anywhere}}.meta b{{display:block;margin-bottom:5px;color:#707983;font:700 9px/1.3 ui-monospace,monospace;letter-spacing:.1em}}.meta code,.mono{{font:600 10px/1.55 ui-monospace,monospace;color:#aab2b9}}.historical-overflow{{border-color:#6a4b22!important}}video{{display:block;width:min(100%,1100px);max-height:76vh;background:#000;border:1px solid #232a30}}.grid{{display:grid;gap:10px;margin-top:10px}}.grid.desktop,.grid.portrait{{grid-template-columns:repeat(3,minmax(0,1fr))}}.grid.landscape,.grid.tech{{grid-template-columns:repeat(2,minmax(0,1fr))}}figure{{margin:0;border:1px solid #20262b;background:#07090b}}figure img{{display:block;width:100%;height:auto}}figcaption{{padding:9px 11px;color:#879099;font:700 9px/1.3 ui-monospace,monospace;letter-spacing:.08em}}.portrait figure img{{max-height:600px;object-fit:contain;background:#000}}.json a{{color:#bec6cc}}.note{{margin-top:48px;padding-top:25px;border-top:1px solid #22282e;color:#7e8790;line-height:1.6}}@media(max-width:760px){{.meta{{grid-template-columns:1fr}}.grid.desktop,.grid.portrait,.grid.landscape,.grid.tech{{grid-template-columns:1fr}}main{{width:calc(100% - 18px)}}}}
</style></head><body><main><p class="kicker">PROAI EXPERT / TWO WORLDS / PRODUCT RESURRECTION R2</p><h1>Historical Owner Filmstrip</h1><p class="lede">Fresh evidence only. Every candidate below was built from its exact historical PRODUCT SHA in an isolated worktree and recorded again in a real browser. The host carries the candidate's exact historical Two Worlds include/CSS/JS plus only its exact historical global base prerequisites; legacy page-ID rules that made the historical assembled homepage unreviewable are excluded as recovery packaging contamination. Historical candidate defects, including non-zero overflow, are measured and shown rather than repaired.</p><pre class="instruction">{html.escape(feedback)}</pre>{''.join(cards)}<p class="note">R1/R1.1/R1.2 are excluded from Owner candidates. R2.5 is rejected and was not used. Optional 1a646589 intermediate is inspected internally only unless separately promoted after visual review. Connected System, main and production are not modified by this review package.</p></main></body></html>'''
(REVIEW/'index.html').write_text(doc,encoding='utf-8')
print('OWNER_GALLERY_BUILD=PASS')
