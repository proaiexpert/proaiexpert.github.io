# ProAI Expert GSC Indexing URL Audit

## 1. Repo State
- HEAD: `86f269ebaf1bc1b11f0af9edd04ce490d1d42600`
- origin/main: `86f269ebaf1bc1b11f0af9edd04ce490d1d42600`
- working tree: clean before audit report creation
- latest commit: `86f269e docs: add website factory new site task pack`

## 2. Executive Summary
- Overall risk: Medium
- Is handyman/demo likely related? No for the listed GSC example URLs; low separate exposure risk exists because a live handyman demo is public but `noindex, nofollow`, and its mentions in this repo are docs-only.
- Main likely cause categories:
  - Several GSC "Crawled - currently not indexed" examples are valid, indexable article URLs with `200`, self-canonical, sitemap presence, and internal links. These need manual GSC URL Inspection rather than code fixes first.
  - Several examples are old or nonexistent URLs with `404`, no source file, no sitemap entry, and no public internal links. These are expected stale discovery URLs unless a redirect policy is desired.
  - Legacy EN insight and `/solutions/` URLs are HTML meta-refresh redirect stubs with `noindex,follow`, not HTTP 301 redirects. This is technically weaker than server-side redirects and can keep old URLs visible in GSC reports.
  - `404.html` is missing, so GitHub Pages serves the default 404 page.
  - `https://proai-expert.com/Discuss` is publicly accessible, large, duplicate historical snapshot content with no canonical/noindex. It is not one of the GSC examples, not in sitemap, and not internally linked, but it is a real separate indexability hygiene risk.
- Immediate recommended next task: redirect-stub cleanup and public-snapshot noindex/removal audit.

## 3. GSC Crawled - Currently Not Indexed URLs
| URL | Source file | Live status | In sitemap? | Canonical | Hreflang | Robots meta | Internal links? | Should index? | Risk | Recommended action |
|---|---|---:|---:|---|---|---|---:|---:|---|---|
| `https://proai-expert.com/insights/website-builder-or-custom-website-what-a-service-business-should-choose/` | `insights/website-builder-or-custom-website-what-a-service-business-should-choose/index.html` | 200 | Yes | Self | EN/RU pair with RU builder article | None | Yes | Low | Use GSC URL Inspection; request indexing if Google-selected canonical matches user-declared canonical. |
| `https://proai-expert.com/ru/insights/konstruktor-sayta-ili-sayt-na-zakaz-chto-vybrat-servisnomu-biznesu/` | `ru/insights/konstruktor-sayta-ili-sayt-na-zakaz-chto-vybrat-servisnomu-biznesu/index.html` | 200 | Yes | Self | RU/EN pair with EN builder article | None | Yes | Low | Use GSC URL Inspection; request indexing if crawl/indexing allowed. |
| `https://proai-expert.com/insights/how-much-does-a-business-website-cost-in-2026-a-strategic-budget-view/` | `insights/how-much-does-a-business-website-cost-in-2026-a-strategic-budget-view/index.html` | 200 | Yes | Self | EN/RU pair with RU economics article | None | Yes | Low | Use GSC URL Inspection; this is an indexable canonical article. |
| `https://proai-expert.com/ru/insights/arkhitektura-vkhodyashchego-potoka-poryadok-v-zayavkakh/` | `ru/insights/arkhitektura-vkhodyashchego-potoka-poryadok-v-zayavkakh/index.html` | 200 | Yes | Self | RU/EN pair with process clarity article | None | Yes | Low | Use GSC URL Inspection; this is an indexable canonical article. |
| `https://proai-expert.com/insights/process-clarity-comes-before-scalable-automation/` | `insights/process-clarity-comes-before-scalable-automation/index.html` | 200 | Yes | Self | EN/RU pair with RU intake architecture article | None | Yes | Low | Use GSC URL Inspection; article is indexable and internally linked. |
| `https://proai-expert.com/ru/insights/arkhitektura-konversii-gde-sayt-teryaet-klienta-eshche-do-pervogo-kontakta/` | `ru/insights/arkhitektura-konversii-gde-sayt-teryaet-klienta-eshche-do-pervogo-kontakta/index.html` | 200 | Yes | Self | RU/EN pair with conversion article | None | Yes | Low | Use GSC URL Inspection; article is indexable and internally linked. |
| `https://proai-expert.com/ru/insights/workflow-patterns-reduce-operational-work/` | none | 404 | No | None | None | None | No | No | Medium | Old/wrong-language stale URL. If GSC keeps surfacing it, add a deliberate RU redirect stub to `/ru/insights/arkhitektura-vkhodyashchego-potoka-poryadok-v-zayavkakh/` or let it remain 404 if intentionally removed. |
| `https://proai-expert.com/ru/insights/useful-ai-systems-real-business/` | none | 404 | No | None | None | None | No | No | Medium | Old/wrong-language stale URL. Consider a RU redirect stub to `/ru/insights/ai-agent-ili-avtomatizatsiya-chto-nuzhno-biznesu/` only if Google still discovers it. |
| `https://proai-expert.com/ru/case-studies/proai-expert/` | none | 404 | No | None | None | None | No | No | Medium | Old/missing case-study URL. There is no current `/case-studies/` section. Either leave 404 or create a redirect policy if historical traffic exists. |
| `https://proai-expert.com/ru/insights/skolko-stoit-sozdat-sait-v-2026/` | none | 404 | No | None | None | None | No | No | Medium | Old RU slug. Consider redirecting to `/ru/insights/ekonomika-proekta-pochemu-otsenka-po-stranitsam-oshibochna/` if this was a renamed article. |
| `https://proai-expert.com/ru/case-studies/financial-stream/` | none | 404 | No | None | None | None | No | No | Medium | Old/missing case-study URL. No source/sitemap/internal links found; redirect only if this URL had value. |
| `https://proai-expert.com/solutions/` | `solutions/index.html` | 200 | No | `https://proai-expert.com/` | None | `noindex,follow` | No | No | Low | Expected old redirect-stub. It should not be indexed; consider replacing meta refresh with a stronger redirect mechanism if possible. |
| `https://proai-expert.com/insights/small-business-website-structure-conversion.html` | none | 404 | No | None | None | None | No | No | Medium | Old `.html` URL with no current source. Leave 404 or map to the closest current article if historical impressions matter. |
| `https://proai-expert.com/case-studies/` | none | 404 | No | None | None | None | No | No | Medium | Old section URL. No source/sitemap/internal links found; redirect to homepage or proof section only if desired. |
| `https://proai-expert.com/solutions/website-systems/` | `solutions/website-systems/index.html` | 200 | No | `https://proai-expert.com/websites-branding/` | None | `noindex,follow` | No | No | Low | Expected old redirect-stub. Should not be indexed; target exists and is indexable. |

## 4. GSC Not Found 404 URLs
| URL | Source file | Live status | Stub/404? | Target URL | Target status | In sitemap? | Internal links? | Risk | Recommended action |
|---|---|---:|---|---|---:|---:|---:|---|---|
| `https://proai-expert.com/insights/useful-ai-systems-real-business/` | `insights/useful-ai-systems-real-business/index.html` | 200 | Redirect-stub, `noindex,follow` | `/insights/ai-agent-or-automation-what-your-business-actually-needs/` | 200 | No | No | Low | GSC 404 is stale; current live URL is a noindex meta-refresh stub. Prefer HTTP 301 if hosting allows. |
| `https://proai-expert.com/insights/why-service-business-websites-fail-to-generate-inquiries/` | `insights/why-service-business-websites-fail-to-generate-inquiries/index.html` | 200 | Redirect-stub, `noindex,follow` | `/insights/why-service-business-websites-fail-to-convert-high-intent-visitors/` | 200 | No | No | Low | GSC 404 is stale; current stub target is indexable. |
| `https://proai-expert.com/insights/service-business-websites-build-trust-before-first-call/` | `insights/service-business-websites-build-trust-before-first-call/index.html` | 200 | Redirect-stub, `noindex,follow` | `/insights/what-a-premium-website-really-means-for-a-service-business/` | 200 | No | No | Low | GSC 404 is stale; current stub target is indexable. |
| `https://proai-expert.com/insights/ai-agents-vs-workflow-automation-service-businesses/` | `insights/ai-agents-vs-workflow-automation-service-businesses/index.html` | 200 | Redirect-stub, `noindex,follow` | `/insights/ai-agent-or-automation-what-your-business-actually-needs/` | 200 | No | No | Low | GSC 404 is stale; current stub target is indexable. |
| `https://proai-expert.com/insights/sample-article/` | `insights/sample-article/index.html` | 200 | Redirect-stub, `noindex,follow` | `/insights/` | 200 | No | No | Low | Expected cleanup stub. Keep out of sitemap/internal links. |
| `https://proai-expert.com/insights/workflow-patterns-reduce-operational-work/` | `insights/workflow-patterns-reduce-operational-work/index.html` | 200 | Redirect-stub, `noindex,follow` | `/insights/process-clarity-comes-before-scalable-automation/` | 200 | No | No | Low | GSC 404 is stale; current stub target is indexable. |
| `https://proai-expert.com/ru/solutions/ai-systems/` | `ru/solutions/ai-systems/index.html` | 200 | Redirect-stub, `noindex,follow` | `/ru/ai-systems/` | 200 | No | No | Low | Expected old URL; target is indexable. Prefer HTTP 301 if possible. |
| `https://proai-expert.com/ru/solutions/` | `ru/solutions/index.html` | 200 | Redirect-stub, `noindex,follow` | `/ru/` | 200 | No | No | Low | Expected old URL; target is indexable. Prefer HTTP 301 if possible. |

## 5. Sitemap Findings
| Finding | Evidence | Risk | Recommended action |
|---|---|---|---|
| Sitemap contains 30 URLs. | Parsed `sitemap.xml`: 30 `<loc>` entries. | Low | Keep sitemap focused on canonical indexable pages. |
| All sitemap URLs returned live `200`. | Live fetch audit of all sitemap URLs. | Low | No immediate sitemap fix needed for status codes. |
| All sitemap URLs have source files and self-canonical. | Source/live metadata audit found no sitemap URL with missing source, non-self canonical, or `noindex`. | Low | No immediate sitemap/canonical patch needed. |
| Sitemap excludes old redirect stubs and 404 examples. | GSC old URLs such as `/solutions/`, `/insights/useful-ai-systems-real-business/`, `/case-studies/`, and old RU slugs are absent from `sitemap.xml`. | Low | Keep excluded. |
| `404.html` is missing. | `Get-Content 404.html` failed; file does not exist. | Medium | Add a custom 404 only in a later fix task if desired; do not mix with sitemap changes. |
| Public `Discuss` snapshot is not in sitemap but is live. | `https://proai-expert.com/Discuss` returns 200, no canonical, no robots meta. | Medium | Consider noindex/delete/rename in a separate cleanup task. |

## 6. Robots / Noindex Findings
| Location | Type | Intentional? | Risk | Recommended action |
|---|---|---:|---|---|
| `robots.txt` | Allows all; points to sitemap. | Yes | Low | No change needed. |
| `insights/useful-ai-systems-real-business/index.html` | `noindex,follow` redirect-stub | Yes | Low | Keep out of sitemap/internal links; consider stronger redirect. |
| `insights/why-service-business-websites-fail-to-generate-inquiries/index.html` | `noindex,follow` redirect-stub | Yes | Low | Keep out of sitemap/internal links; consider stronger redirect. |
| `insights/service-business-websites-build-trust-before-first-call/index.html` | `noindex,follow` redirect-stub | Yes | Low | Keep out of sitemap/internal links; consider stronger redirect. |
| `insights/ai-agents-vs-workflow-automation-service-businesses/index.html` | `noindex,follow` redirect-stub | Yes | Low | Keep out of sitemap/internal links; consider stronger redirect. |
| `insights/sample-article/index.html` | `noindex,follow` redirect-stub | Yes | Low | Keep out of sitemap/internal links. |
| `insights/workflow-patterns-reduce-operational-work/index.html` | `noindex,follow` redirect-stub | Yes | Low | Keep out of sitemap/internal links; consider stronger redirect. |
| `solutions/index.html` | `noindex,follow` redirect-stub | Yes | Low | Keep out of sitemap/internal links; consider stronger redirect. |
| `solutions/ai-systems/index.html` | `noindex,follow` redirect-stub | Yes | Low | Keep out of sitemap/internal links; consider stronger redirect. |
| `solutions/website-systems/index.html` | `noindex,follow` redirect-stub | Yes | Low | Keep out of sitemap/internal links; consider stronger redirect. |
| `ru/solutions/index.html` | `noindex,follow` redirect-stub | Yes | Low | Keep out of sitemap/internal links; consider stronger redirect. |
| `ru/solutions/ai-systems/index.html` | `noindex,follow` redirect-stub | Yes | Low | Keep out of sitemap/internal links; consider stronger redirect. |
| `ru/solutions/website-systems/index.html` | `noindex,follow` redirect-stub | Yes | Low | Keep out of sitemap/internal links; consider stronger redirect. |
| `https://proai-expert.com/handyman-vancouver-portland-demo/` | Live demo has `noindex, nofollow`. | Yes | Low | Not related to GSC example URLs; keep demo noindexed. |
| `https://proai-expert.com/Discuss` | No robots meta. | No | Medium | Add noindex or remove from deploy in a separate cleanup. |

## 7. Canonical / Hreflang Findings
| Page | Canonical | Hreflang | Risk | Recommended action |
|---|---|---|---|---|
| All 30 sitemap URLs | Self-canonical | EN/RU/x-default present and consistent for current page pairs | Low | No patch needed. |
| EN old insight stubs | Canonical points to current target article/hub | No alternate links | Low | Acceptable for stubs, but HTTP 301 would be cleaner. |
| `/solutions/` and `/solutions/*` stubs | Canonical points to `/`, `/ai-systems/`, or `/websites-branding/` | No alternate links | Low | Acceptable for stubs, but HTTP 301 would be cleaner. |
| RU `/solutions/` stubs | Canonical points to `/ru/`, `/ru/ai-systems/`, or `/ru/websites-branding/` | No alternate links | Low | Acceptable for stubs, but HTTP 301 would be cleaner. |
| True 404 GSC examples | No canonical/hreflang because source does not exist | None | Medium | Decide whether to leave as 404 or create mapped stubs. |
| `https://proai-expert.com/Discuss` | None | None | Medium | Add noindex/canonical or remove from public deploy. |

## 8. Internal Link Findings
| Source | Link | Risk | Recommended action |
|---|---|---|---|
| `insights/index.html`, article pages, RU paired article pages | Current indexable article URLs in sitemap | Low | Good; keep current internal links. |
| Old EN insight stubs | No public internal links found; only source paths exist. | Low | No internal-link fix needed for these. |
| Old `/solutions/` stubs | No public internal links found; only source paths exist. | Low | No internal-link fix needed. |
| True 404 GSC examples | No public internal links found. | Medium | GSC likely discovered from old crawl history or external/referring URLs; inspect in GSC for discovery source. |
| `docs/**` | Handyman/demo/testbed references | Low | Docs-only, not public navigation/sitemap. Keep docs if needed. |
| `insights/ai-ready-website-for-business/index.html` | Contains generic word "demo" in visible article copy, not handyman URL. | Low | Harmless; no action. |

## 9. Handyman / Demo Exposure
| Location | Occurrence | Classification | Indexing risk | Recommended action |
|---|---|---|---|---|
| `docs/website-production-factory/**` | Handyman/testbed/demo references | Docs-only | Low | Not in sitemap/nav; unrelated to GSC example URLs. |
| `docs/recovery/**` | Handyman repo/status references | Docs-only | Low | Harmless for GSC examples. |
| `https://proai-expert.com/handyman-vancouver-portland-demo/` | Live demo URL returns 200 with `robots: noindex, nofollow` | Separate live demo | Low | Keep noindex/nofollow; verify the demo repo controls its own deploy. |
| `sitemap.xml` | No handyman/demo URL found | Sitemap | None | No action. |
| `robots.txt` | No handyman/demo rule found | Robots | Low | Main robots allows all, but page-level noindex controls demo. |
| public homepage/nav/footer | No handyman/demo URL found | Public link graph | None | No action. |
| public insight/service pages | Generic "demo" word only, no handyman demo URL | Public content | Low | No action. |

## 10. Recent SEO-Relevant Git History
| Commit | File(s) | Possible impact | Notes |
|---|---|---|---|
| `5855ea9` 2026-06-16 `Add legacy redirect for old workflow patterns article URL` | `insights/workflow-patterns-reduce-operational-work/index.html` | Redirect-stub addition | Explains current live 200/noindex for old EN URL that GSC labels 404. |
| `72856bf` 2026-06-16 `Add legacy redirect for sample article URL` | `insights/sample-article/index.html` | Redirect-stub addition | Expected noindex old sample URL. |
| `e1d751e` 2026-06-16 `Add legacy redirect for old AI agents article URL` | `insights/ai-agents-vs-workflow-automation-service-businesses/index.html` | Redirect-stub addition | Expected old EN slug. |
| `126b90e` 2026-06-16 `Add legacy redirect for old service business trust URL` | `insights/service-business-websites-build-trust-before-first-call/index.html` | Redirect-stub addition | Expected old EN slug. |
| `8565366` 2026-06-16 `Add legacy redirect for old inquiries article URL` | `insights/why-service-business-websites-fail-to-generate-inquiries/index.html` | Redirect-stub addition | Expected old EN slug. |
| `d91daf9` 2026-06-16 `Add legacy redirects for old EN insight URLs` | `insights/useful-ai-systems-real-business/index.html` | Redirect-stub addition | Expected old EN slug. |
| `e299114` 2026-06-16 `Add RU/EN AI-ready website articles` | `sitemap.xml`, EN/RU AI-ready articles, hubs | Sitemap expansion | Added current AI-ready pages; sitemap still validates cleanly. |
| `6a166ad` 2026-04-20 `Add files via upload` | EN/RU website-builder and AI-search articles, `sitemap.xml` | URL expansion | Added current indexable article pages now in GSC. |
| `e37696a` 2026-04-08 `Unify legacy pages and refine article system` | HTML pages | URL restructuring | Likely part of old/current article architecture transition. |
| `defd976` 2026-04-08 `Rebuild site architecture for AI and web systems` | HTML pages | URL restructuring | Likely source of `/solutions/` to `/ai-systems/` and `/websites-branding/` transition. |
| `eecf854` 2026-04-07 `Add premium control-room sections and EN pattern cluster` | HTML pages | Insight/pattern cluster | Older slug family may originate here. |
| `cc13fae` 2026-04-07 `Fix critical SEO routing gaps and alias redirect hygiene` | HTML pages | Redirect/canonical hygiene | SEO routing work predates current stubs. |

## 11. Manual GSC Checks Needed
Use URL Inspection for these indexable URLs first:
- `https://proai-expert.com/insights/website-builder-or-custom-website-what-a-service-business-should-choose/`
- `https://proai-expert.com/ru/insights/konstruktor-sayta-ili-sayt-na-zakaz-chto-vybrat-servisnomu-biznesu/`
- `https://proai-expert.com/insights/how-much-does-a-business-website-cost-in-2026-a-strategic-budget-view/`
- `https://proai-expert.com/ru/insights/arkhitektura-vkhodyashchego-potoka-poryadok-v-zayavkakh/`
- `https://proai-expert.com/insights/process-clarity-comes-before-scalable-automation/`
- `https://proai-expert.com/ru/insights/arkhitektura-konversii-gde-sayt-teryaet-klienta-eshche-do-pervogo-kontakta/`

Record for each:
- URL is on Google?
- Page fetch successful?
- Indexing allowed?
- User-declared canonical?
- Google-selected canonical?
- Crawled as Googlebot smartphone?
- Referring page / discovery source if shown.

Use URL Inspection for these stale/problem URLs only to confirm discovery source:
- `https://proai-expert.com/ru/insights/workflow-patterns-reduce-operational-work/`
- `https://proai-expert.com/ru/insights/useful-ai-systems-real-business/`
- `https://proai-expert.com/ru/case-studies/proai-expert/`
- `https://proai-expert.com/ru/insights/skolko-stoit-sozdat-sait-v-2026/`
- `https://proai-expert.com/ru/case-studies/financial-stream/`
- `https://proai-expert.com/insights/small-business-website-structure-conversion.html`
- `https://proai-expert.com/case-studies/`

Also inspect:
- `https://proai-expert.com/Discuss`
- `https://proai-expert.com/handyman-vancouver-portland-demo/`

## 12. Recommended Fix Task
Exactly one narrow next task:
- redirect-stub cleanup: replace or supplement HTML meta-refresh legacy stubs with a cleaner redirect/noindex strategy where GitHub Pages allows it, and include `Discuss` public snapshot cleanup/noindex in the same inventory only if scoped as legacy public URL hygiene. Do not change current sitemap canonical pages in that task unless GSC URL Inspection shows a specific canonical/indexing mismatch.
