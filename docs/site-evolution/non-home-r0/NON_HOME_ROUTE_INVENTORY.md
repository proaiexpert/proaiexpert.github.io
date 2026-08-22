# ProAI Expert — Non-Home Route Inventory R0

Status: **PLANNING ONLY — NO PRODUCTION PAGE CHANGES**  
Base: `c945084e1952c05c686494091f7dbca0f7acdf08`  
Branch: `agent/proai-inner-site-master-r0`  
Date: 2026-08-21

## Scope rule

The homepage routes `/` and `/ru/` are explicitly excluded. This inventory is derived from the repository sitemap at the locked base plus the repository-level `404.html` utility page.

At the locked base the sitemap contains 44 routes total, including the two homepage routes. Therefore the R0 non-home scope contains **42 sitemap routes + 1 public 404 utility = 43 public non-home routes**.

No canonical `/privacy/` or `/terms/` public route was found at this base. Repository searches also did not recover a public redirect registry. Legal/privacy support is therefore a real Wave 5 gap, not a route that should be invented during R0.

## Commercial — 4 routes

| Route | Locale | Current role | R0 disposition |
|---|---|---|---|
| `/ai-systems/` | EN | Primary AI systems / automation service page | Phase 1A pilot — rebuild shell and interaction, preserve strong content logic |
| `/ru/ai-systems/` | RU | Native RU AI systems / automation service page | Phase 1A paired locale — editorially preserve native strengths |
| `/websites-branding/` | EN | Primary websites / branding service page | Phase 1B sibling — rebuild as distinct authored system |
| `/ru/websites-branding/` | RU | Native RU websites / branding service page | Phase 1B paired locale — separate editorial QA |

## Trust / company — 2 routes

| Route | Locale | Current role | R0 disposition |
|---|---|---|---|
| `/about/` | EN | Founder/studio trust, operating logic, standards | Phase 2B — evolve to judgment / principles page, avoid personality-brand inflation |
| `/ru/about/` | RU | RU trust / operating logic | Phase 2B — native editorial pass, same factual authority |

## Conversion — 2 routes

| Route | Locale | Current role | R0 disposition |
|---|---|---|---|
| `/contact/` | EN | Low-friction inquiry routing | Phase 2A — preserve routing logic, rebuild visual/form shell |
| `/ru/contact/` | RU | RU inquiry routing | Phase 2A — preserve low-friction model and native instructions |

## Proof — 8 routes

| Route | Locale | Current role | R0 disposition |
|---|---|---|---|
| `/case-studies/` | EN | Case archive / Trust Systems Atlas | Phase 3 — preserve truthful status taxonomy, rebuild archive system |
| `/ru/case-studies/` | RU | RU case archive | Phase 3 |
| `/case-studies/financial-stream/` | EN | Flagship real live client case | Phase 3 — strongest proof authority; preserve evidence and limitations |
| `/ru/case-studies/financial-stream/` | RU | RU flagship client case | Phase 3 — preserve evidence parity |
| `/case-studies/alina-horb/` | EN | Real project case | Phase 3 — preserve factual project status and source material |
| `/ru/case-studies/alina-horb/` | RU | RU real project case | Phase 3 |
| `/case-studies/local-repair-pro/` | EN | Demo / in-development case | Phase 3 — keep status visibly non-equivalent to live client work |
| `/ru/case-studies/local-repair-pro/` | RU | RU demo / in-development case | Phase 3 |

## Editorial — 26 routes

### Hubs

- `/insights/`
- `/ru/insights/`

### EN articles — 12

- `/insights/what-happens-after-a-lead-arrives/`
- `/insights/ai-ready-website-for-business/`
- `/insights/website-builder-or-custom-website-what-a-service-business-should-choose/`
- `/insights/ai-search-optimization-for-service-businesses/`
- `/insights/ai-agent-or-automation-what-your-business-actually-needs/`
- `/insights/where-automation-delivers-its-first-real-roi/`
- `/insights/what-a-premium-website-really-means-for-a-service-business/`
- `/insights/why-service-business-websites-fail-to-convert-high-intent-visitors/`
- `/insights/how-much-does-a-business-website-cost-in-2026-a-strategic-budget-view/`
- `/insights/process-clarity-comes-before-scalable-automation/`
- `/insights/does-your-service-business-need-a-multilingual-website/`
- `/insights/how-to-evaluate-a-website-proposal/`

### RU articles — 12

- `/ru/insights/chto-proiskhodit-posle-zayavki/`
- `/ru/insights/ai-ready-sayt-dlya-biznesa/`
- `/ru/insights/konstruktor-sayta-ili-sayt-na-zakaz-chto-vybrat-servisnomu-biznesu/`
- `/ru/insights/ai-search-optimization-dlya-servisnogo-biznesa/`
- `/ru/insights/ai-agent-ili-avtomatizatsiya-chto-nuzhno-biznesu/`
- `/ru/insights/gde-avtomatizatsiya-daet-pervuyu-realnuyu-polzu-biznesu/`
- `/ru/insights/chto-znachit-premialnyy-sayt-dlya-servisnogo-biznesa/`
- `/ru/insights/arkhitektura-konversii-gde-sayt-teryaet-klienta-eshche-do-pervogo-kontakta/`
- `/ru/insights/ekonomika-proekta-pochemu-otsenka-po-stranitsam-oshibochna/`
- `/ru/insights/arkhitektura-vkhodyashchego-potoka-poryadok-v-zayavkakh/`
- `/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/`
- `/ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/`

### Editorial treatment

- Preserve frozen premium article bodies, methodology, tables, source links and decision frameworks.
- Rebuild the hub as an editorial intelligence surface; the current `Archive of articles` + `Selected Materials` + `Article Archive` repetition is not the target architecture.
- Modernize article shell, source treatment, reading orientation, table responsiveness, related content and end CTA without silently rewriting frozen methodology.
- The premium lead-response article is already assembled from seven includes rather than one monolithic page file; this modular precedent should be preserved rather than flattened.

## Utility / support — 1 confirmed public route

| Route | Locale | Current role | R0 disposition |
|---|---|---|---|
| `/404.html` | EN with EN/RU recovery links | Not-found recovery | Phase 5 — rebuild visual parity, keep `noindex,follow`, improve shared navigation / locale recovery |

## Legal / privacy gap

At the locked base:

- no public `/privacy/` route was found;
- no public `/terms/` route was found;
- no canonical legal-route pair was found in the sitemap;
- legal/privacy references in project material are not evidence of current public ProAI legal pages.

**Decision:** Wave 5 must include a separate factual/legal-content gate before creating public legal pages. R0 does not invent legal language.

## Route safety contract

During all later redesign waves:

1. No slug changes without explicit Owner approval.
2. Preserve existing canonical URLs.
3. Preserve EN/RU `hreflang` relationships.
4. Preserve title/meta intent unless a documented SEO improvement is approved.
5. Preserve structured data that is currently valid.
6. Preserve internal-link equity and article/case URLs.
7. Homepage `/` and `/ru/` remain outside this workstream.
