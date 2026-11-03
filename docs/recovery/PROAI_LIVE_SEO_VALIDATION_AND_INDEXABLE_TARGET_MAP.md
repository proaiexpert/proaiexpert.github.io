# ProAI Expert Live SEO Validation and Indexable Target Map

## 1. Repo State
- HEAD: `7e6e552dddbc182770df093132a4a44fc6bcc635`
- origin/main: `7e6e552dddbc182770df093132a4a44fc6bcc635`
- working tree: clean before report creation
- latest commit: `7e6e552 Fix legacy SEO URL hygiene`

## 2. Executive Summary
- Overall risk: Medium
- Is handyman/demo related? No. The listed GSC URL issues belong to the central ProAI Expert site, old insight slugs, old solutions URLs, old case-study URLs, or current insight pages. The handyman demo is not in the sitemap or public main-site navigation.
- Are important canonical pages technically indexable? Yes. Core pages and checked current insight pages return live `200`, have self-canonicals, have no robots `noindex`, and are present in `sitemap.xml`.
- Are legacy URLs handled coherently? Mostly yes. Legacy URLs now return crawlable `200` HTML redirect stubs with `noindex,follow`, canonical targets, and zero-second meta refresh. This is coherent for GitHub Pages, though server-side `301/308` redirects would be stronger if hosting later supports them.
- Immediate next task: no code fix; GSC URL Inspection and Request Indexing for current canonical pages, plus follow-up monitoring of legacy URL disappearance from GSC reports.

## 3. Indexable Target Map
| URL | Type | Should index? | Live status | In sitemap? | Canonical | Robots meta | Internal links | Verdict | Action |
|---|---|---:|---:|---:|---|---|---:|---|---|
| `https://proai-expert.com/` | Core | Yes | 200 | Yes | Self | None | Yes | Indexable | Request indexing only if GSC shows not indexed. |
| `https://proai-expert.com/ru/` | Core | Yes | 200 | Yes | Self | None | Yes | Indexable | Request indexing only if GSC shows not indexed. |
| `https://proai-expert.com/about/` | Core | Yes | 200 | Yes | Self | None | Yes | Indexable | No code fix. |
| `https://proai-expert.com/ru/about/` | Core | Yes | 200 | Yes | Self | None | Yes | Indexable | No code fix. |
| `https://proai-expert.com/contact/` | Core | Yes | 200 | Yes | Self | None | Yes | Indexable | No code fix. |
| `https://proai-expert.com/ru/contact/` | Core | Yes | 200 | Yes | Self | None | Yes | Indexable | No code fix. |
| `https://proai-expert.com/ai-systems/` | Service | Yes | 200 | Yes | Self | None | Yes | Indexable | No code fix. |
| `https://proai-expert.com/ru/ai-systems/` | Service | Yes | 200 | Yes | Self | None | Yes | Indexable | No code fix. |
| `https://proai-expert.com/websites-branding/` | Service | Yes | 200 | Yes | Self | None | Yes | Indexable | No code fix. |
| `https://proai-expert.com/ru/websites-branding/` | Service | Yes | 200 | Yes | Self | None | Yes | Indexable | No code fix. |
| `https://proai-expert.com/insights/` | Hub | Yes | 200 | Yes | Self | None | Yes | Indexable | No code fix. |
| `https://proai-expert.com/ru/insights/` | Hub | Yes | 200 | Yes | Self | None | Yes | Indexable | No code fix. |
| `https://proai-expert.com/solutions/` | Legacy stub | No | 200 | No | `/` | `noindex,follow` | No public link risk found | Expected noindex legacy URL | Monitor only. |
| `https://proai-expert.com/case-studies/` | Legacy stub | No | 200 | No | `/` | `noindex,follow` | No public link risk found | Expected noindex legacy URL | Monitor only. |
| `https://proai-expert.com/Discuss` | Removed public snapshot | No | 404 | No | None | None | No public link risk found | Hygiene fix live | No action. |
| `https://proai-expert.com/handyman-vancouver-portland-demo/` | Separate demo | No | Not part of this live URL batch | No | Controlled by separate demo | Demo should remain noindexed | Not linked from main nav/sitemap | Not related | Keep separate. |

## 4. Current Important Pages
| URL | Source file | Live status | Canonical | Hreflang | Noindex? | Sitemap? | Internal links | Risk | Action |
|---|---|---:|---|---|---:|---:|---:|---|---|
| `https://proai-expert.com/insights/website-builder-or-custom-website-what-a-service-business-should-choose/` | `insights/website-builder-or-custom-website-what-a-service-business-should-choose/index.html` | 200 | Self | EN/RU/x-default present | No | Yes | Yes | Low | GSC URL Inspection and Request Indexing if not indexed. |
| `https://proai-expert.com/ru/insights/konstruktor-sayta-ili-sayt-na-zakaz-chto-vybrat-servisnomu-biznesu/` | `ru/insights/konstruktor-sayta-ili-sayt-na-zakaz-chto-vybrat-servisnomu-biznesu/index.html` | 200 | Self | EN/RU/x-default present | No | Yes | Yes | Low | GSC URL Inspection and Request Indexing if not indexed. |
| `https://proai-expert.com/insights/how-much-does-a-business-website-cost-in-2026-a-strategic-budget-view/` | `insights/how-much-does-a-business-website-cost-in-2026-a-strategic-budget-view/index.html` | 200 | Self | EN/RU/x-default present | No | Yes | Yes | Low | GSC URL Inspection and Request Indexing if not indexed. |
| `https://proai-expert.com/ru/insights/arkhitektura-vkhodyashchego-potoka-poryadok-v-zayavkakh/` | `ru/insights/arkhitektura-vkhodyashchego-potoka-poryadok-v-zayavkakh/index.html` | 200 | Self | EN/RU/x-default present | No | Yes | Yes | Low | GSC URL Inspection and Request Indexing if not indexed. |
| `https://proai-expert.com/insights/process-clarity-comes-before-scalable-automation/` | `insights/process-clarity-comes-before-scalable-automation/index.html` | 200 | Self | EN/RU/x-default present | No | Yes | Yes | Low | GSC URL Inspection and Request Indexing if not indexed. |
| `https://proai-expert.com/ru/insights/arkhitektura-konversii-gde-sayt-teryaet-klienta-eshche-do-pervogo-kontakta/` | `ru/insights/arkhitektura-konversii-gde-sayt-teryaet-klienta-eshche-do-pervogo-kontakta/index.html` | 200 | Self | EN/RU/x-default present | No | Yes | Yes | Low | GSC URL Inspection and Request Indexing if not indexed. |
| `https://proai-expert.com/insights/ai-ready-website-for-business/` | `insights/ai-ready-website-for-business/index.html` | 200 | Self | EN/RU/x-default present | No | Yes | Yes | Low | GSC URL Inspection and Request Indexing if not indexed. |
| `https://proai-expert.com/ru/insights/ai-ready-sayt-dlya-biznesa/` | `ru/insights/ai-ready-sayt-dlya-biznesa/index.html` | 200 | Self | EN/RU/x-default present | No | Yes | Yes | Low | GSC URL Inspection and Request Indexing if not indexed. |

## 5. Legacy URL Handling
| Legacy URL | Live status | Stub/404 | Target URL | Target status | In sitemap? | Internal links? | Verdict | Action |
|---|---:|---|---|---:|---:|---:|---|---|
| `https://proai-expert.com/insights/useful-ai-systems-real-business/` | 200 | Stub, `noindex,follow` | `/insights/ai-agent-or-automation-what-your-business-actually-needs/` | 200 expected | No | No public link risk found | Coherent legacy handling | Monitor only. |
| `https://proai-expert.com/insights/why-service-business-websites-fail-to-generate-inquiries/` | 200 | Stub, `noindex,follow` | `/insights/why-service-business-websites-fail-to-convert-high-intent-visitors/` | 200 expected | No | No public link risk found | Coherent legacy handling | Monitor only. |
| `https://proai-expert.com/insights/service-business-websites-build-trust-before-first-call/` | 200 | Stub, `noindex,follow` | `/insights/what-a-premium-website-really-means-for-a-service-business/` | 200 expected | No | No public link risk found | Coherent legacy handling | Monitor only. |
| `https://proai-expert.com/insights/ai-agents-vs-workflow-automation-service-businesses/` | 200 | Stub, `noindex,follow` | `/insights/ai-agent-or-automation-what-your-business-actually-needs/` | 200 expected | No | No public link risk found | Coherent legacy handling | Monitor only. |
| `https://proai-expert.com/insights/sample-article/` | 200 | Stub, `noindex,follow` | `/insights/` | 200 | No | No public link risk found | Expected cleanup stub | Monitor only. |
| `https://proai-expert.com/insights/workflow-patterns-reduce-operational-work/` | 200 | Stub, `noindex,follow` | `/insights/process-clarity-comes-before-scalable-automation/` | 200 | No | No public link risk found | Coherent legacy handling | Monitor only. |
| `https://proai-expert.com/ru/solutions/ai-systems/` | 200 | Stub, `noindex,follow` | `/ru/ai-systems/` | 200 | No | No public link risk found | Coherent legacy handling | Monitor only. |
| `https://proai-expert.com/ru/solutions/` | 200 | Stub, `noindex,follow` | `/ru/` | 200 | No | No public link risk found | Expected old section stub | Monitor only. |
| `https://proai-expert.com/solutions/` | 200 | Stub, `noindex,follow` | `/` | 200 | No | No public link risk found | Expected old section stub | Monitor only. |
| `https://proai-expert.com/solutions/website-systems/` | 200 | Stub, `noindex,follow` | `/websites-branding/` | 200 | No | No public link risk found | Coherent legacy handling | Monitor only. |
| `https://proai-expert.com/case-studies/` | 200 | Stub, `noindex,follow` | `/` | 200 | No | No public link risk found | Expected old section stub | Monitor only. |
| `https://proai-expert.com/ru/case-studies/proai-expert/` | 200 | Stub, `noindex,follow` | `/ru/` | 200 | No | No public link risk found | Expected old section stub | Monitor only. |
| `https://proai-expert.com/ru/case-studies/financial-stream/` | 200 | Stub, `noindex,follow` | `/ru/` | 200 | No | No public link risk found | Expected old section stub | Monitor only. |
| `https://proai-expert.com/insights/small-business-website-structure-conversion.html` | 200 | Stub, `noindex,follow` | `/insights/why-service-business-websites-fail-to-convert-high-intent-visitors/` | 200 expected | No | No public link risk found | Coherent legacy handling | Monitor only. |

## 6. Sitemap Findings
| Finding | Risk | Evidence | Action |
|---|---|---|---|
| Source sitemap contains 30 URLs. | Low | Parsed local `sitemap.xml`: 30 URLs. | Keep. |
| Live sitemap returns 200 and contains 30 URLs. | Low | `https://proai-expert.com/sitemap.xml` returned 200 and 30 URLs. | Keep. |
| Important current pages are present. | Low | Core pages, EN/RU hubs, and checked current insights are present. | No code fix. |
| Legacy stubs are excluded. | Low | `/solutions/`, `/case-studies/`, old insight stubs, `/Discuss`, and handyman demo are not in sitemap. | Keep excluded. |
| Lastmod dates are not uniformly current. | Low | Most stable pages show April 2026; newer AI-ready articles show June 2026. | Acceptable unless making content changes. |

## 7. Robots / Noindex Findings
| URL or file | Finding | Intentional? | Risk | Action |
|---|---|---:|---|---|
| `robots.txt` | Allows all and references sitemap. | Yes | Low | Keep; noindex stubs must remain crawlable. |
| Current core/current insight pages | No robots `noindex` found in live checks. | Yes | Low | No code fix. |
| Legacy stubs | `noindex,follow` present and crawlable. | Yes | Low | Keep. |
| `https://proai-expert.com/404.html` | Live 200, self-canonical, `noindex,follow`. | Yes | Low | Keep. |
| `https://proai-expert.com/nonexistent-test-url-for-404-check/` | Live 404. | Yes | Low | Keep. |
| `https://proai-expert.com/Discuss` | Live 404 after cleanup. | Yes | Low | Keep removed. |

## 8. Canonical / Hreflang Findings
| URL | Finding | Risk | Action |
|---|---|---|---|
| Core EN/RU pages | Self-canonical and EN/RU/x-default alternates visible in live checks. | Low | No code fix. |
| Current insight pages | Self-canonical and EN/RU/x-default alternates visible in live checks. | Low | No code fix. |
| Legacy stubs | Canonical points to target page; no hreflang on stubs. | Low | Acceptable because stubs should not index. |
| `404.html` | Self-canonical with `noindex,follow`. | Low | Acceptable. |

## 9. Internal Link Findings
| Source | Link | Risk | Action |
|---|---|---|---|
| `/insights/` | Links to important EN current articles including AI-ready, builder/custom, cost, and process clarity. | Low | No code fix. |
| `/ru/insights/` | Links to important RU current articles including AI-ready, builder/custom, conversion, and intake architecture. | Low | No code fix. |
| Public core navigation | Links to `/`, `/ai-systems/`, `/websites-branding/`, `/about/`, `/insights/`, `/contact/` and RU equivalents. | Low | No code fix. |
| Legacy stub files | Contain fallback links to their target URLs. | Low | Expected. |
| Public source search | No sitemap/public nav risk found for `/Discuss` or handyman demo. | Low | No action. |
| Docs/history references | Handyman/demo and old URLs may appear in docs or recovery reports. | Low | Harmless for public indexing; do not delete docs for SEO. |

## 10. Hygiene Fix Validation
| Item | Live result | Verdict | Action |
|---|---|---|---|
| `https://proai-expert.com/Discuss` | 404 | Fixed; public snapshot no longer live. | No action. |
| `https://proai-expert.com/404.html` | 200 with `noindex,follow` | Fixed; custom 404 page exists. | No action. |
| `https://proai-expert.com/nonexistent-test-url-for-404-check/` | 404 | Correct 404 behavior. | No action. |
| Newly added old RU/case-study/html stubs | Live 200 with `noindex,follow`, canonical target, and zero-second meta refresh. | Fixed for static GitHub Pages constraints. | Monitor in GSC. |

## 11. Manual GSC Action List
Use URL Inspection and record: URL is on Google, page fetch successful, indexing allowed, user-declared canonical, Google-selected canonical, crawled as Googlebot smartphone, and referring page/discovery source.

Request indexing for these technically indexable current pages if GSC still shows them as not indexed:
- `https://proai-expert.com/insights/website-builder-or-custom-website-what-a-service-business-should-choose/`
- `https://proai-expert.com/ru/insights/konstruktor-sayta-ili-sayt-na-zakaz-chto-vybrat-servisnomu-biznesu/`
- `https://proai-expert.com/insights/how-much-does-a-business-website-cost-in-2026-a-strategic-budget-view/`
- `https://proai-expert.com/ru/insights/arkhitektura-vkhodyashchego-potoka-poryadok-v-zayavkakh/`
- `https://proai-expert.com/insights/process-clarity-comes-before-scalable-automation/`
- `https://proai-expert.com/ru/insights/arkhitektura-konversii-gde-sayt-teryaet-klienta-eshche-do-pervogo-kontakta/`
- `https://proai-expert.com/insights/ai-ready-website-for-business/`
- `https://proai-expert.com/ru/insights/ai-ready-sayt-dlya-biznesa/`

Validate but do not request indexing for these noindex legacy URLs:
- `https://proai-expert.com/insights/useful-ai-systems-real-business/`
- `https://proai-expert.com/insights/why-service-business-websites-fail-to-generate-inquiries/`
- `https://proai-expert.com/insights/service-business-websites-build-trust-before-first-call/`
- `https://proai-expert.com/insights/ai-agents-vs-workflow-automation-service-businesses/`
- `https://proai-expert.com/insights/sample-article/`
- `https://proai-expert.com/insights/workflow-patterns-reduce-operational-work/`
- `https://proai-expert.com/ru/solutions/ai-systems/`
- `https://proai-expert.com/ru/solutions/`
- `https://proai-expert.com/solutions/`
- `https://proai-expert.com/solutions/website-systems/`
- `https://proai-expert.com/case-studies/`
- `https://proai-expert.com/ru/case-studies/proai-expert/`
- `https://proai-expert.com/ru/case-studies/financial-stream/`
- `https://proai-expert.com/insights/small-business-website-structure-conversion.html`

## 12. Recommended Next Narrow Fix Task
No code fix; GSC request indexing only.

After GSC inspection, if Google-selected canonical differs from user-declared canonical on any current page, then create a separate sitemap/canonical/hreflang patch task for only those URLs. If current pages remain crawled but not indexed after inspection and indexing requests, the next code/content task should be a content-quality/internal-link improvement pass for important insights, not a redirect or sitemap task.
