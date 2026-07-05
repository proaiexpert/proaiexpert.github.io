# ProAI Expert GSC Indexing Master Action Plan

## 1. Repo State
- HEAD: `4d69e0179d23bba7d6dd81f992b4c37e9df7d437`
- origin/main: `4d69e0179d23bba7d6dd81f992b4c37e9df7d437`
- working tree: clean before this report was created
- latest commit: `4d69e01 docs: validate proai live seo indexing targets`

## 2. Executive Summary
- Overall risk: Medium
- Is handyman/demo related? No
- Are important canonical pages technically indexable? Yes
- Are legacy URLs handled coherently? Yes, with static GitHub Pages constraints
- Main likely cause of indexed-page decline: a mix of Google recrawl/reporting of old URL restructuring, intentional noindex redirect stubs, expected stale 404s, and Google choosing not to index several technically valid insight pages. Current evidence does not show a live robots, sitemap, canonical, hreflang, or handyman/demo cause.
- Immediate recommendation: no random code fix. First run GSC URL Inspection / Request Indexing on the known important canonical pages and export the full URL-level lists for each GSC bucket. If those pages remain crawled but not indexed after inspection, the next code task should be a focused content-quality/internal-link improvement pass for important insights.

## 3. GSC Coverage Summary
| Bucket | Count | Source | Expected vs problem | Action |
|---|---:|---|---|---|
| Indexed | 22 | GSC export summary | Lower than the April/May baseline; business concern is valid. | Use as baseline for monitoring after manual inspection/indexing requests. |
| Not found (404) | 8 | Site | Mixed. Known examples are mostly old URLs that now either have stubs or should remain removed. A 404 is acceptable for removed junk or noncanonical old URLs not in sitemap/internal links. | Do not force into index. Export full URL-level list and confirm no current canonical page is included. |
| Page with redirect | 3 | Site | Usually expected if these are legacy routes. Static GitHub Pages uses HTML meta-refresh stubs rather than server-side 301/308. | Keep out of sitemap. Confirm targets are indexable. Consider stronger redirects only if hosting changes. |
| Excluded by `noindex` | 2 | Site | Likely expected if they are legacy redirect stubs or demo/testbed pages. | Export URL-level list and confirm no current canonical page is accidentally noindexed. |
| Crawled - currently not indexed | 15 | Google systems | Mixed. Several known examples are important current canonical pages that are technically indexable; several others are legacy/noindex/old URL examples that should not index. | Inspect current canonical URLs first; request indexing where Google-selected canonical matches user-declared canonical. |
| Discovered - currently not indexed | 3 | Google systems | Unknown without URL-level export. Could be low-priority discovered URLs or weak internal-link/content signals. | Export exact URLs before any code change. |

## 4. June 1-12 Deterioration Window
| Date or commit | Files touched | SEO relevance | Possible impact | Verdict |
|---|---|---|---|---|
| 2026-05-28 `f8c2917 Replace Financial Stream case screenshots` | `index.html`, `ru/index.html`, `websites-branding/index.html`, `ru/websites-branding/index.html`, Financial Stream case images | Public page content/images, but not sitemap, robots, insight slugs, canonical, noindex, or redirect structure. | Low direct likelihood. Could affect homepage/service content signals, but does not explain old URL 404/noindex buckets. | Not a clear technical cause. |
| 2026-06-01 through 2026-06-12 | No matching repo commits found in local history. | GSC deterioration occurred without same-window source changes. | Suggests delayed Google recrawl/reporting of earlier April restructuring or GSC recalculation, not a same-day deploy break. | Treat as delayed reporting until GSC URL inspection proves otherwise. |
| 2026-06-16 `e299114 Add RU/EN AI-ready website articles` | Added EN/RU AI-ready articles, updated `insights/`, `ru/insights/`, `sitemap.xml` | Added current indexable pages after the deterioration window. | Cannot be the June 12 drop cause. May add new pages now needing indexing. | Not cause of decline; include in indexing requests. |
| 2026-06-16 legacy redirect commits `d91daf9`, `8565366`, `126b90e`, `e1d751e`, `72856bf`, `5855ea9` | Added EN legacy insight redirect stubs | Added noindex/follow stubs after deterioration window. | Explains why some old URLs now return 200 noindex stubs while GSC still reports old 404 states. | Cleanup response, not original cause. |
| 2026-07-04 `7e6e552 Fix legacy SEO URL hygiene` | Added `404.html`, removed `Discuss`, added RU/case-study/html legacy stubs | SEO hygiene cleanup after GSC issue discovery. | Reduces public junk and stale 404 exposure. | Fix pass, not original cause. |
| Earlier April restructuring commits | Many HTML/sitemap/insight architecture changes | Likely source of old `/solutions/`, `/case-studies/`, and renamed insight URLs. | Google may have recrawled/reclassified those old URLs during June. | Most plausible technical-history source for legacy buckets. |

## 5. Current Indexable Canonical Pages
| URL | Source file | Live status | In sitemap? | Canonical | Hreflang | Noindex? | Internal link strength | Should request indexing? | Action |
|---|---|---:|---:|---|---|---:|---|---:|---|
| `https://proai-expert.com/` | `index.html` | 200 | Yes | Self | EN/RU/x-default | No | Strongly linked | If not indexed | Inspect only if GSC shows issue. |
| `https://proai-expert.com/ru/` | `ru/index.html` | 200 | Yes | Self | EN/RU/x-default | No | Strongly linked | If not indexed | Inspect only if GSC shows issue. |
| `https://proai-expert.com/insights/` | `insights/index.html` | 200 | Yes | Self | EN/RU/x-default | No | Strongly linked | If not indexed | Inspect and request if needed. |
| `https://proai-expert.com/ru/insights/` | `ru/insights/index.html` | 200 | Yes | Self | EN/RU/x-default | No | Strongly linked | If not indexed | Inspect and request if needed. |
| `https://proai-expert.com/insights/ai-ready-website-for-business/` | `insights/ai-ready-website-for-business/index.html` | 200 | Yes | Self | EN/RU/x-default | No | Strong from EN archive; adequate related links | Yes | Inspect and request indexing. |
| `https://proai-expert.com/ru/insights/ai-ready-sayt-dlya-biznesa/` | `ru/insights/ai-ready-sayt-dlya-biznesa/index.html` | 200 | Yes | Self | EN/RU/x-default | No | Strong from RU archive; adequate related links | Yes | Inspect and request indexing. |
| `https://proai-expert.com/insights/website-builder-or-custom-website-what-a-service-business-should-choose/` | `insights/website-builder-or-custom-website-what-a-service-business-should-choose/index.html` | 200 | Yes | Self | EN/RU/x-default | No | Adequate from archive and related article links | Yes | Inspect and request indexing. |
| `https://proai-expert.com/ru/insights/konstruktor-sayta-ili-sayt-na-zakaz-chto-vybrat-servisnomu-biznesu/` | `ru/insights/konstruktor-sayta-ili-sayt-na-zakaz-chto-vybrat-servisnomu-biznesu/index.html` | 200 | Yes | Self | EN/RU/x-default | No | Adequate from archive and related article links | Yes | Inspect and request indexing. |
| `https://proai-expert.com/insights/how-much-does-a-business-website-cost-in-2026-a-strategic-budget-view/` | `insights/how-much-does-a-business-website-cost-in-2026-a-strategic-budget-view/index.html` | 200 | Yes | Self | EN/RU/x-default | No | Stronger related-link coverage; archive link | Yes | Inspect and request indexing. |
| `https://proai-expert.com/ru/insights/arkhitektura-vkhodyashchego-potoka-poryadok-v-zayavkakh/` | `ru/insights/arkhitektura-vkhodyashchego-potoka-poryadok-v-zayavkakh/index.html` | 200 | Yes | Self | EN/RU/x-default | No | Adequate from archive and related article links | Yes | Inspect and request indexing. |
| `https://proai-expert.com/insights/process-clarity-comes-before-scalable-automation/` | `insights/process-clarity-comes-before-scalable-automation/index.html` | 200 | Yes | Self | EN/RU/x-default | No | Adequate from archive and related article links | Yes | Inspect and request indexing. |
| `https://proai-expert.com/ru/insights/arkhitektura-konversii-gde-sayt-teryaet-klienta-eshche-do-pervogo-kontakta/` | `ru/insights/arkhitektura-konversii-gde-sayt-teryaet-klienta-eshche-do-pervogo-kontakta/index.html` | 200 | Yes | Self | EN/RU/x-default | No | Adequate from archive and related article links | Yes | Inspect and request indexing. |

## 6. Legacy / Old URL Handling
| URL | Source file | Live status | Stub/404/redirect | Target URL | Target indexable? | In sitemap? | Public internal links? | Verdict | Action |
|---|---|---:|---|---|---:|---:|---:|---|---|
| `https://proai-expert.com/insights/useful-ai-systems-real-business/` | `insights/useful-ai-systems-real-business/index.html` | 200 | Stub, `noindex,follow` | `/insights/ai-agent-or-automation-what-your-business-actually-needs/` | Yes | No | No | Expected legacy noindex | Do not request indexing. |
| `https://proai-expert.com/insights/why-service-business-websites-fail-to-generate-inquiries/` | `insights/why-service-business-websites-fail-to-generate-inquiries/index.html` | 200 | Stub, `noindex,follow` | `/insights/why-service-business-websites-fail-to-convert-high-intent-visitors/` | Yes | No | No | Expected legacy noindex | Do not request indexing. |
| `https://proai-expert.com/insights/service-business-websites-build-trust-before-first-call/` | `insights/service-business-websites-build-trust-before-first-call/index.html` | 200 | Stub, `noindex,follow` | `/insights/what-a-premium-website-really-means-for-a-service-business/` | Yes | No | No | Expected legacy noindex | Do not request indexing. |
| `https://proai-expert.com/insights/ai-agents-vs-workflow-automation-service-businesses/` | `insights/ai-agents-vs-workflow-automation-service-businesses/index.html` | 200 | Stub, `noindex,follow` | `/insights/ai-agent-or-automation-what-your-business-actually-needs/` | Yes | No | No | Expected legacy noindex | Do not request indexing. |
| `https://proai-expert.com/insights/sample-article/` | `insights/sample-article/index.html` | 200 | Stub, `noindex,follow` | `/insights/` | Yes | No | No | Expected cleanup noindex | Do not request indexing. |
| `https://proai-expert.com/insights/workflow-patterns-reduce-operational-work/` | `insights/workflow-patterns-reduce-operational-work/index.html` | 200 | Stub, `noindex,follow` | `/insights/process-clarity-comes-before-scalable-automation/` | Yes | No | No | Expected legacy noindex | Do not request indexing. |
| `https://proai-expert.com/ru/insights/workflow-patterns-reduce-operational-work/` | `ru/insights/workflow-patterns-reduce-operational-work/index.html` | 200 | Stub, `noindex,follow` | `/ru/insights/arkhitektura-vkhodyashchego-potoka-poryadok-v-zayavkakh/` | Yes | No | No | Expected legacy noindex | Do not request indexing. |
| `https://proai-expert.com/ru/insights/useful-ai-systems-real-business/` | `ru/insights/useful-ai-systems-real-business/index.html` | 200 | Stub, `noindex,follow` | `/ru/insights/ai-agent-ili-avtomatizatsiya-chto-nuzhno-biznesu/` | Yes | No | No | Expected legacy noindex | Do not request indexing. |
| `https://proai-expert.com/ru/insights/skolko-stoit-sozdat-sait-v-2026/` | `ru/insights/skolko-stoit-sozdat-sait-v-2026/index.html` | 200 | Stub, `noindex,follow` | `/ru/insights/ekonomika-proekta-pochemu-otsenka-po-stranitsam-oshibochna/` | Yes | No | No | Expected legacy noindex | Do not request indexing. |
| `https://proai-expert.com/solutions/` | `solutions/index.html` | 200 | Stub, `noindex,follow` | `/` | Yes | No | No | Expected old section noindex | Do not request indexing. |
| `https://proai-expert.com/solutions/website-systems/` | `solutions/website-systems/index.html` | 200 | Stub, `noindex,follow` | `/websites-branding/` | Yes | No | No | Expected old section noindex | Do not request indexing. |
| `https://proai-expert.com/ru/solutions/` | `ru/solutions/index.html` | 200 | Stub, `noindex,follow` | `/ru/` | Yes | No | No | Expected old section noindex | Do not request indexing. |
| `https://proai-expert.com/ru/solutions/ai-systems/` | `ru/solutions/ai-systems/index.html` | 200 | Stub, `noindex,follow` | `/ru/ai-systems/` | Yes | No | No | Expected old section noindex | Do not request indexing. |
| `https://proai-expert.com/case-studies/` | `case-studies/index.html` | 200 | Stub, `noindex,follow` | `/` | Yes | No | No | Expected old section noindex | Do not request indexing. |
| `https://proai-expert.com/ru/case-studies/proai-expert/` | `ru/case-studies/proai-expert/index.html` | 200 | Stub, `noindex,follow` | `/ru/` | Yes | No | No | Expected old section noindex | Do not request indexing. |
| `https://proai-expert.com/ru/case-studies/financial-stream/` | `ru/case-studies/financial-stream/index.html` | 200 | Stub, `noindex,follow` | `/ru/` | Yes | No | No | Expected old section noindex | Do not request indexing. |
| `https://proai-expert.com/insights/small-business-website-structure-conversion.html` | `insights/small-business-website-structure-conversion.html` | 200 | Stub, `noindex,follow` | `/insights/why-service-business-websites-fail-to-convert-high-intent-visitors/` | Yes | No | No | Expected legacy noindex | Do not request indexing. |

## 7. Sitemap / Robots / Hygiene Findings
| Item | Finding | Risk | Action |
|---|---|---|---|
| Source sitemap | 30 URLs; current canonical pages only. | Low | Keep unchanged. |
| Live sitemap | `https://proai-expert.com/sitemap.xml` returns 200 and 30 URLs. | Low | Keep unchanged. |
| Sitemap exclusions | Old stubs, `/Discuss`, handyman/demo, and known 404/legacy examples are absent. | Low | Keep excluded. |
| `robots.txt` | Allows all and includes `Sitemap: https://proai-expert.com/sitemap.xml`. | Low | Keep unchanged; noindex stubs must remain crawlable. |
| `404.html` | Live 200 with `noindex,follow`; nonexistent test URL returns real 404. | Low | Keep. |
| `Discuss` | Live 404 after cleanup. | Low | Keep removed. |
| Handyman/demo | Not in main sitemap or public main-site navigation. | Low | Keep separate; do not mix with this site. |
| Missing report | `docs/recovery/PROAI_INDEXING_SIGNAL_IMPROVEMENT_AUDIT.md` is not present. | Low | Do not assume its contents. |

## 8. Internal Linking / Indexing Signal Findings
| Target URL | Link strength | Weakness | Priority | Recommended action |
|---|---|---|---|---|
| `/insights/ai-ready-website-for-business/` | Strongly linked | Strong from archive; not directly featured on homepage/service pages. | High | Request indexing; later consider service-page contextual link only if GSC remains not indexed. |
| `/ru/insights/ai-ready-sayt-dlya-biznesa/` | Strongly linked | Strong from RU archive; not directly featured on RU homepage/service pages. | High | Request indexing; later consider service-page contextual link only if GSC remains not indexed. |
| `/insights/website-builder-or-custom-website-what-a-service-business-should-choose/` | Adequately linked | Archive and related links exist; homepage does not link directly. | High | Request indexing; later consider contextual link from `websites-branding/` if still not indexed. |
| `/ru/insights/konstruktor-sayta-ili-sayt-na-zakaz-chto-vybrat-servisnomu-biznesu/` | Adequately linked | Archive and related links exist; RU service pages do not strongly promote it. | High | Request indexing; later consider contextual link from `ru/websites-branding/` if still not indexed. |
| `/insights/how-much-does-a-business-website-cost-in-2026-a-strategic-budget-view/` | Strongly linked | Good related-link coverage; not homepage featured. | High | Request indexing. |
| `/ru/insights/arkhitektura-vkhodyashchego-potoka-poryadok-v-zayavkakh/` | Adequately linked | Archive and related links exist; not homepage featured. | High | Request indexing. |
| `/insights/process-clarity-comes-before-scalable-automation/` | Adequately linked | Archive and related links exist; not homepage featured. | High | Request indexing. |
| `/ru/insights/arkhitektura-konversii-gde-sayt-teryaet-klienta-eshche-do-pervogo-kontakta/` | Adequately linked | Archive and related links exist; not service-page featured. | High | Request indexing. |
| Current article hubs | Strongly linked | No issue found. | Medium | Keep. |
| Old slugs/stubs | Not publicly linked except fallback links inside stubs. | None | Low | Keep out of public links and sitemap. |

## 9. Manual GSC Actions

### URL Inspection / Request Indexing Priority List
1. `https://proai-expert.com/insights/ai-ready-website-for-business/`
2. `https://proai-expert.com/ru/insights/ai-ready-sayt-dlya-biznesa/`
3. `https://proai-expert.com/insights/website-builder-or-custom-website-what-a-service-business-should-choose/`
4. `https://proai-expert.com/ru/insights/konstruktor-sayta-ili-sayt-na-zakaz-chto-vybrat-servisnomu-biznesu/`
5. `https://proai-expert.com/insights/how-much-does-a-business-website-cost-in-2026-a-strategic-budget-view/`
6. `https://proai-expert.com/ru/insights/arkhitektura-vkhodyashchego-potoka-poryadok-v-zayavkakh/`
7. `https://proai-expert.com/insights/process-clarity-comes-before-scalable-automation/`
8. `https://proai-expert.com/ru/insights/arkhitektura-konversii-gde-sayt-teryaet-klienta-eshche-do-pervogo-kontakta/`
9. `https://proai-expert.com/insights/`
10. `https://proai-expert.com/ru/insights/`

For each URL, record:
- URL is on Google?
- Page fetch successful?
- Indexing allowed?
- User-declared canonical?
- Google-selected canonical?
- Crawled as Googlebot smartphone?
- Referring page / discovery source if shown.

If indexing is allowed and Google-selected canonical matches the user-declared canonical, request indexing.

### GSC Exports Still Needed
Export full URL-level details for:
- Not found (404)
- Page with redirect
- Excluded by noindex
- Crawled - currently not indexed
- Discovered - currently not indexed

The current GSC export summary is aggregated. It does not prove that every URL in each bucket is expected or harmless.

## 10. What Not To Fix
- Do not force legacy redirect stubs into the index.
- Do not add old `/solutions/` URLs to the sitemap.
- Do not add old `/case-studies/` URLs to the sitemap.
- Do not request indexing for `/insights/sample-article/`.
- Do not request indexing for old EN/RU slug stubs.
- Do not restore or index `Discuss`.
- Do not treat the handyman demo as a main-site indexing target.
- Do not change `robots.txt` to block noindex stubs; Google must be able to crawl noindex URLs to see the noindex.
- Do not change sitemap/canonical/hreflang without a specific GSC URL Inspection mismatch.

## 11. Recommended Next Narrow Task
No code fix; GSC inspection/request indexing only.

If GSC inspection shows current canonical pages are crawlable, indexable, and canonicalized correctly, request indexing. If they remain unindexed after that, the next Codex task should be a content-quality/internal-link improvement pass for important insights. If GSC inspection shows canonical mismatch or accidental noindex on a current page, create a separate targeted technical patch for only those URLs.

## 12. Proposed Codex Fix Prompt
No code fix is recommended yet. Use this manual GSC action checklist first:

```text
Manual GSC Task — ProAI Expert priority URL inspection

Inspect these URLs in Google Search Console:

1. https://proai-expert.com/insights/ai-ready-website-for-business/
2. https://proai-expert.com/ru/insights/ai-ready-sayt-dlya-biznesa/
3. https://proai-expert.com/insights/website-builder-or-custom-website-what-a-service-business-should-choose/
4. https://proai-expert.com/ru/insights/konstruktor-sayta-ili-sayt-na-zakaz-chto-vybrat-servisnomu-biznesu/
5. https://proai-expert.com/insights/how-much-does-a-business-website-cost-in-2026-a-strategic-budget-view/
6. https://proai-expert.com/ru/insights/arkhitektura-vkhodyashchego-potoka-poryadok-v-zayavkakh/
7. https://proai-expert.com/insights/process-clarity-comes-before-scalable-automation/
8. https://proai-expert.com/ru/insights/arkhitektura-konversii-gde-sayt-teryaet-klienta-eshche-do-pervogo-kontakta/
9. https://proai-expert.com/insights/
10. https://proai-expert.com/ru/insights/

For each URL record:
- URL is on Google?
- Page fetch successful?
- Indexing allowed?
- User-declared canonical?
- Google-selected canonical?
- Crawled as Googlebot smartphone?
- Referring page / discovery source if shown.

If indexing is allowed and Google-selected canonical matches the user-declared canonical, click Request Indexing.

Also export URL-level details for:
- Not found (404)
- Page with redirect
- Excluded by noindex
- Crawled - currently not indexed
- Discovered - currently not indexed
```
