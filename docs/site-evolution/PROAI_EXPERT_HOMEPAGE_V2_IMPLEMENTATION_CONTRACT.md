# PROAI EXPERT HOMEPAGE V2 — IMPLEMENTATION CONTRACT

**Status:** Final implementation-scope candidate after independent technical review  
**Version:** 1.0  
**Date:** 2026-08-04  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Working branch:** `agent/homepage-v2-strategy-review`  
**Production implementation authorization:** none until owner approval  
**Production PR authorization:** none until owner approval

---

# 0. AUTHORITY

This file is the authoritative correction and implementation contract for:

- `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_STRATEGY.md`;
- `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_PRODUCTION_SPEC.md`;
- the independent technical review in `docs/site-evolution/homepage-v2-review/07_PRODUCTION_SPEC_REVIEW_REPORT.md`.

The approved strategy remains authoritative for commercial intent, narrative, proof hierarchy, visual direction and EN/RU principles.

The Production Specification remains authoritative except where this contract provides a more exact repository-level rule. When the two documents conflict, this implementation contract controls.

This document resolves all accepted P0 and P1 technical corrections from the independent review.

It does not authorize code changes by itself.

---

# 1. LOCKED PROJECT BOUNDARIES

## 1.1 In scope after owner approval

The approved implementation program consists of two production changes, reviewed and merged separately:

1. narrow EN/RU Contact prerequisite;
2. complete EN/RU Homepage V2 implementation.

## 1.2 Out of scope

- Header redesign;
- Footer redesign or router migration;
- replacement of Formspree;
- Contact-page redesign;
- new CRM implementation;
- new analytics vendor;
- new chatbot provider;
- service-page redesign;
- Case Studies redesign;
- Insights redesign;
- removal of rollback sources;
- broad repository cleanup;
- `_config.yml` introduction;
- framework or CMS migration;
- partial Homepage publication;
- EN-only publication.

## 1.3 Risk route

Implementation is Tier 3:

- ChatGPT Control owns scope and acceptance;
- Codex/local tooling performs build, browser automation and screenshots;
- an independent Reviewer inspects the actual GitHub diff and rendered output;
- merge/publication requires explicit owner authorization.

---

# 2. REQUIRED PR SEQUENCE

## PR A — Contact Private Review Prerequisite

Must be implemented, reviewed and verified before Homepage V2 production PR.

Purpose:

- add bounded Private Review context support to EN/RU Contact;
- resolve the current `intent` field collision;
- preserve existing Formspree, validation, anti-spam and result states;
- establish the canonical EN/RU machine-value contract.

This PR must remain backward-compatible with the current Homepage.

## PR B — Homepage V2

Created only after PR A is merged and verified.

Purpose:

- replace current Homepage runtime composition with clean Jekyll V2 architecture;
- publish all ten sections together in EN/RU;
- preserve locked Header, Homepage Footer and Chatbase behavior;
- add generated-output validation;
- retain the current snapshot architecture for rollback only.

## Prohibited sequence

- do not merge a V2 Hero separately;
- do not publish V2 EN before RU;
- do not switch wrappers before all includes, data and assets exist;
- do not load V1 and V2 Homepage CSS/JS together;
- do not create the production branch from the strategy-review branch.

---

# 3. PRODUCTION BRANCH BASE RULE

For every production PR:

1. fetch current `main` immediately before branch creation;
2. record the current `main` SHA;
3. verify open PRs that may touch the same files;
4. create the implementation branch from that current `main`;
5. do not reuse `agent/homepage-v2-strategy-review` as production base;
6. do not cherry-pick unrelated workspace commits into production branches.

Suggested branches:

```text
agent/contact-private-review-prerequisite
agent/homepage-v2-production
```

The current strategy-review branch may remain diverged because its purpose is documentation and review history.

---

# 4. HOMEPAGE V2 SOURCE ARCHITECTURE

## 4.1 Route wrappers

`index.html`:

```yaml
---
layout: homepage-v2
lang: en
permalink: /
---
```

`ru/index.html`:

```yaml
---
layout: homepage-v2
lang: ru
permalink: /ru/
---
```

The wrappers contain no section markup, Liquid replacement chains, duplicated metadata, inline application CSS, inline application JavaScript, Header markup or Footer markup.

## 4.2 Shared layout

Create:

```text
_layouts/homepage-v2.html
```

The layout owns:

- doctype;
- `<html lang>`;
- complete `<head>`;
- favicon links;
- metadata and absolute URLs;
- font resources;
- skip link;
- canonical Header include;
- one `<main id="main-content">`;
- the ten static section includes in approved order;
- exact Homepage Footer include;
- script load order;
- Chatbase preservation contract.

The layout uses one explicit data owner:

```liquid
{% assign homepage = site.data.homepage_v2[page.lang] %}
```

Each static section include receives only the needed object and language, for example:

```liquid
{% include homepage-v2/hero.html data=homepage.hero lang=page.lang %}
```

Dynamic include filenames derived from data are prohibited.

## 4.3 Localized data

Create:

```text
_data/homepage_v2/en.yml
_data/homepage_v2/ru.yml
```

Data owns:

- localized copy;
- stable IDs;
- links;
- metadata;
- status and disclosure strings;
- accessible labels;
- image objects;
- CTA context values.

Data must not contain:

- arbitrary HTML fragments;
- inline style strings;
- JavaScript expressions;
- unreviewed markup;
- localized machine identifiers.

## 4.4 Section includes

Create the following static includes:

```text
_includes/homepage-v2/hero.html
_includes/homepage-v2/connected-journey.html
_includes/homepage-v2/directions.html
_includes/homepage-v2/client-work.html
_includes/homepage-v2/ways-to-start.html
_includes/homepage-v2/process.html
_includes/homepage-v2/founder.html
_includes/homepage-v2/selected-work.html
_includes/homepage-v2/insights.html
_includes/homepage-v2/private-review.html
```

Optional helpers:

```text
_includes/homepage-v2/proof-status.html
_includes/homepage-v2/responsive-image.html
```

A helper is retained only when reused by more than one section. Otherwise it is folded into the owning section.

## 4.5 Section order and IDs

Generated EN/RU output must contain exactly one of each ID in this order:

1. `hero`;
2. `connected-journey`;
3. `directions`;
4. `client-work`;
5. `ways-to-start`;
6. `process`;
7. `founder`;
8. `selected-work`;
9. `insights`;
10. `private-review`.

---

# 5. EXACT HEADER CONTRACT

Homepage V2 uses exactly:

```liquid
{% include header-system/header.html
   lang=page.lang
   current_page="home"
   locale_url=homepage.meta.locale_url
   variant="standard" %}
```

Load exactly once:

```html
<link rel="stylesheet" href="/assets/css/header-system-v1.css?v=20260804.1">
<script src="/assets/js/header-system-v1.js?v=20260804.1" defer></script>
```

Do not load on Homepage V2:

- legacy `.global-header` compatibility CSS;
- legacy `.site-nav` compatibility CSS;
- legacy `.mobile-menu-toggle` compatibility layers;
- `global-case-studies-navigation-v1.js` for legacy Homepage Header selectors;
- any second Header stylesheet or script.

Header source files are not modified in this program.

---

# 6. EXACT HOMEPAGE FOOTER CONTRACT

Homepage V2 preserves the current Homepage Footer include exactly:

```liquid
{% include footer-commercial-v1.html lang=page.lang %}
```

The layout loads exactly once:

```html
<link rel="stylesheet" href="/assets/css/footer-commercial-v1.css?v=20260803.1">
```

`footer-commercial-v1.html` remains responsible for its current polish, shared foundation and title-pulse stylesheet references.

The Homepage layout must not duplicate those links.

Do not use:

```liquid
{% include footer-system/footer.html family="commercial" variant="homepage" %}
```

The current generic Footer router has no Commercial `homepage` variant. A Homepage Footer router migration is a separate Footer System task.

Footer source files are not modified in this program.

Existing generated-output Footer assertions must continue to pass unchanged.

---

# 7. HOMEPAGE V2 RUNTIME ASSET MANIFEST

## 7.1 V2 runtime owners

Homepage V2 loads:

- Header System CSS once;
- Header System JS once;
- `assets/css/homepage-v2.css` once;
- optional `assets/js/homepage-v2.js` once;
- Homepage Footer base CSS once;
- styles loaded by the unchanged Homepage Footer include;
- approved font resources;
- preserved Chatbase embed after `window.load`;
- approved responsive images.

## 7.2 V1 files retained for rollback but removed from V2 runtime

The following may remain in the repository during the rollback window but must not be loaded by Homepage V2:

- inline CSS inside legacy Homepage snapshots;
- `assets/css/homepage-materials-editorial-v2.css`;
- `assets/css/homepage-core-hardening-v1.css`;
- `assets/css/homepage-commercial-refinement-v1.css`;
- legacy Homepage `global-header-parity-v2.css` dependencies;
- legacy mobile Homepage styles;
- `mobile-behavior-v123.js`;
- legacy scene/process scripts;
- `assets/js/homepage-core-hardening-v1.js`;
- legacy Header-selector scripts.

## 7.3 No mixed runtime

Generated output must prove:

- exactly one V2 stylesheet;
- at most one V2 JavaScript file;
- no V1 Homepage stylesheet references;
- no V1 Homepage application-script references;
- Header/Footer owners load exactly once;
- no duplicate Footer pulse stylesheet.

## 7.4 Raw asset rule

Files under `assets/` are copied by Jekyll as static assets.

Therefore `homepage-v2.css` and `homepage-v2.js`:

- contain no `{{ ... }}` Liquid expressions;
- contain no `{% ... %}` Liquid expressions;
- contain no localized dictionaries;
- contain no generated routes;
- read only bounded HTML `data-*` attributes where needed;
- remain valid when copied byte-for-byte.

Localized labels, links and machine values are rendered by Jekyll into HTML.

## 7.5 Cache busting

Initial versions must be explicit, for example:

```text
/assets/css/homepage-v2.css?v=20260804.1
/assets/js/homepage-v2.js?v=20260804.1
```

Whenever the content behind an existing URL changes after review, increment the version.

Do not change locked Header/Footer asset versions unless those files actually change in a separately authorized task.

---

# 8. CHATBASE DECISION

Initial Homepage V2 preserves the current Chatbase behavior unchanged.

Requirements:

- same current assistant ID and domain;
- non-blocking load after `window.load`;
- failure does not block Homepage content, navigation or forms;
- included in network inventory and total-page performance report;
- not counted as new Homepage-specific JavaScript;
- tested for collision with:
  - mobile CTA;
  - Header;
  - Homepage Footer;
  - safe-area insets;
  - phone landscape;
- no provider or configuration change without separate owner authorization.

Accidental Chatbase removal is prohibited.

---

# 9. METADATA AND ABSOLUTE URL CONTRACT

The repository currently has no `_config.yml`.

Homepage V2 must not rely on:

- `site.url`;
- `site.baseurl`;
- `absolute_url`;
- a newly introduced `_config.yml`.

Use the explicit production origin:

```text
https://proai-expert.com
```

Each language data file owns explicit metadata values required to generate:

- title;
- meta description;
- absolute self-canonical;
- absolute EN alternate;
- absolute RU alternate;
- absolute x-default to `/`;
- OG title;
- OG description;
- absolute `og:url`;
- absolute `og:image`;
- OG image alt;
- Twitter title;
- Twitter description;
- absolute Twitter image;
- any structured-data URL if structured data is approved.

Expected routes:

```text
EN canonical: https://proai-expert.com/
RU canonical: https://proai-expert.com/ru/
EN hreflang: https://proai-expert.com/
RU hreflang: https://proai-expert.com/ru/
x-default: https://proai-expert.com/
```

Generated-output validation must confirm exact absolute URLs.

No new Homepage JSON-LD is assumed. Any Organization or WebSite graph requires separate validation and must not include unsupported claims.

---

# 10. CONTACT PREREQUISITE MACHINE CONTRACT

## 10.1 Existing functionality to preserve

Both Contact routes must preserve:

- Formspree endpoint `https://formspree.io/f/xbdakqoz`;
- asynchronous `fetch` submission;
- `Accept: application/json`;
- required email validation;
- minimum project-context validation;
- honeypot `company_website`;
- timestamp `form_started_at`;
- localized subject;
- current processing state;
- current success state;
- current error state;
- reset behavior after successful submission;
- Header and Footer unchanged.

## 10.2 Canonical fields

Use the same machine schema in EN/RU:

```text
intent=private_review | project_inquiry
source_page=homepage | contact | other_allowlisted_source
source_cta=homepage_hero | homepage_ways_to_start | homepage_final | direct_contact
selected_direction=ai_systems_automation | websites_branding | both | not_sure
source_context=<bounded allowlisted identifier or empty>
referring_url=<bounded URL or empty>
language=en | ru
```

## 10.3 Resolve `intent` collision

The current direction selector must no longer submit under `intent`.

Required migration:

- `intent` becomes request type;
- default direct Contact visit submits `project_inquiry`;
- recognized Homepage review intent submits `private_review`;
- current direction hidden field becomes `selected_direction`;
- localized pills use canonical `data-value` machine values;
- visible labels remain independently localized;
- optional human-readable direction label may use a separate field only if operationally useful.

Existing `page_lang` and `page_path` may remain for compatibility but must not replace the canonical fields.

## 10.4 No-JS-safe CTA URLs

Hero EN:

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_hero#project-intake
```

Hero RU:

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_hero#project-intake
```

Ways to Start EN example:

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=ai_systems_automation#project-intake
```

Ways to Start RU example:

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=ai_systems_automation#project-intake
```

Final EN:

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_final#project-intake
```

Final RU:

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_final#project-intake
```

Homepage JavaScript is not required for these links.

## 10.5 Query allowlists

Allow only:

### `intent`

- `private_review`;
- `project_inquiry`.

### `source_page`

- `homepage`;
- `contact`;
- explicitly documented future sources.

### `source_cta`

- `homepage_hero`;
- `homepage_ways_to_start`;
- `homepage_final`;
- `direct_contact`.

### `selected_direction`

- `ai_systems_automation`;
- `websites_branding`;
- `both`;
- `not_sure`.

Unsupported values are ignored and safe defaults are used.

`source_context` and `referring_url` must have documented maximum lengths.

## 10.6 Safe DOM handling

Use only:

- `.value`;
- `.textContent`;
- safe attribute assignment.

Do not use arbitrary query values with `innerHTML`.

Do not place names, email addresses, phone numbers or free-form project text into analytics events.

## 10.7 Private Review UX

When `intent=private_review` is recognized:

- show a localized bounded explanation;
- state that the review is no-cost;
- state that it identifies fit, priority and the recommended next step;
- state that it is not a complete audit, implementation plan or free consulting engagement;
- preserve the short form;
- show four direction options:
  - AI Systems & Automation;
  - Websites & Branding;
  - Both;
  - Not sure;
- do not promise response time unless operationally guaranteed.

## 10.8 Contact PR expected file scope

Initial expected production files:

```text
contact/index.html
ru/contact/index.html
```

Additional shared file inclusion requires evidence that it reduces duplication without broadening scope.

The Contact PR must not modify:

- Homepage;
- Header;
- Footer;
- Formspree endpoint;
- deployment workflow unless a narrow form contract gate is separately justified;
- routes;
- metadata unrelated to Private Review context.

---

# 11. EN/RU DATA PARITY CONTRACT

Both YAML files must contain matching structural keys and collection counts.

Validate at minimum:

- all metadata fields;
- all ten section objects;
- primary and secondary CTA identifiers;
- two directions;
- four connected-journey steps;
- three Ways to Start situations;
- five process phases;
- proof status and disclosure fields;
- Selected Work items;
- three Insights items;
- image objects;
- accessible labels;
- Contact machine values.

Machine identifiers remain English snake_case in both languages.

Examples:

```text
private_review
project_inquiry
homepage_hero
homepage_ways_to_start
homepage_final
ai_systems_automation
websites_branding
both
not_sure
financial_stream
alina_horb
local_repair_pro
```

Missing required content must fail validation rather than silently rendering blank output.

Russian acceptance rules:

- no fixed-height text containers;
- no `white-space: nowrap` on primary copy;
- CTA may expand or wrap;
- proof disclosures stay visible at 320 px;
- headings do not rely on English hard-coded line breaks;
- status labels may wrap;
- mixed unexplained English process terms are prohibited.

---

# 12. SECTION DATA AND DOM CONTRACTS

## 12.1 Connected Journey

DOM contains four semantic steps in reading order.

Desktop may style them as two lanes, but DOM order remains:

1. clarify and build trust;
2. make inquiry easier;
3. capture and route context;
4. support response and follow-up.

Decorative connectors are `aria-hidden`.

JavaScript may emphasize state but must not create, hide or reorder core steps.

## 12.2 Ways to Start schema

Each situation object requires:

```text
id
best_when
first_objective
not_implied
service_link
review_cta
selected_direction
```

Prohibited fields or treatments:

- price;
- Basic/Pro/Premium package names;
- feature matrices;
- “most popular” badges;
- artificial tier ranking.

## 12.3 Proof statuses

Visible public status strings:

- Financial Stream: `Live client project · EN/RU`;
- Alina Horb: `Live related-party project · UA/RU` plus adjacent disclosure;
- Local Repair Pro: `Website concept · Live demo · In development`.

Status and disclosure cannot be tooltip-only or hidden from mobile.

## 12.4 Insights routes

Each EN article route and RU article route is explicitly stored in localized data.

Do not infer RU slugs through string transformation.

---

# 13. RESPONSIVE IMAGE CONTRACT

New Homepage-specific assets use:

```text
assets/img/homepage-v2/**
```

Reuse existing approved optimized derivatives when they already satisfy the Homepage role.

Every meaningful image object defines:

```text
src
srcset candidates
sizes
width
height
alt
loading
fetchpriority
decoding
crop_role
```

Rules:

- only the true Hero LCP image receives `fetchpriority="high"`;
- below-fold proof receives `loading="lazy"`;
- all images declare intrinsic dimensions;
- mobile proof uses purpose-specific crops;
- decorative images use empty alt and are hidden where appropriate;
- do not duplicate identical screenshots without a distinct evidence role.

A proof-source pack must record:

- source project;
- source file;
- derivative file;
- capture date where material;
- evidence role;
- alt text;
- public claim boundary.

---

# 14. FIXED HEADER OFFSET CONTRACT

Homepage content must clear the locked fixed Header without changing Header files.

Homepage V2 defines page-level variables matching canonical Header breakpoints:

```text
85 px desktop
84 px narrow portrait
68 px short landscape
```

The layout/CSS must not assume a Header-scoped custom property is inherited by sibling content.

Acceptance:

- Hero content never sits under Header;
- anchors account for fixed Header;
- phone landscape does not create excessive top padding;
- no JS measurement is required for initial layout.

---

# 15. ACCESSIBILITY AND PROGRESSIVE ENHANCEMENT

Default CSS keeps content visible.

No core content may depend on:

- JavaScript;
- animation;
- hover;
- 3D transforms;
- iframe;
- scroll observers.

Required:

- one skip link;
- one `main#main-content`;
- one H1;
- logical headings;
- semantic lists/steps;
- visible focus;
- keyboard access;
- meaningful alt text;
- decorative hiding;
- touch targets;
- reduced motion;
- forced-colors review;
- no color-only meaning;
- no motion-only meaning.

If a JS class is applied, it may enhance only after successful startup. Do not hide content by default and rely on recovery timers.

---

# 16. PERFORMANCE AND MEASUREMENT CONTRACT

## 16.1 Homepage-specific targets

- Homepage V2 CSS below 50 KB gzip;
- Homepage V2 JavaScript below 20 KB gzip;
- one primary font family;
- no framework;
- no initial-viewport iframe;
- one true LCP asset;
- CLS near zero;
- minimal main-thread work.

## 16.2 Total-page report

QA must separately record:

1. Homepage-specific CSS gzip size;
2. Homepage-specific JS gzip size;
3. total page transfer;
4. Header/Footer transfer;
5. font transfer;
6. image transfer by viewport;
7. Chatbase/third-party transfer;
8. LCP owner and timing;
9. CLS sources;
10. TBT or equivalent blocking measure.

Meeting component budgets does not automatically mean the total page passes.

## 16.3 Third parties

No new third-party script is authorized.

Existing Chatbase is inventoried and measured.

---

# 17. ANALYTICS FALLBACK CONTRACT

Vendor-neutral events may be dispatched only through:

- an existing approved adapter; or
- a safe no-op when no adapter is present.

Do not add an analytics vendor in Homepage V2.

Navigation and form submission must never wait for analytics.

Event payloads may contain only bounded identifiers such as:

```text
language
source_page
source_cta
selected_direction
project_id
article_id
```

Do not send:

- name;
- email;
- phone;
- free-form project details;
- arbitrary query strings.

---

# 18. GENERATED-OUTPUT DEPLOYMENT GATE

Homepage V2 implementation scope must include:

```text
.github/workflows/deploy-pages.yml
```

or a checked validation script plus the workflow change that executes it.

Existing Footer assertions remain intact.

Validate `_site/index.html` and `_site/ru/index.html` for:

1. correct `<html lang>`;
2. exactly one H1;
3. exactly one skip link;
4. exactly one `main#main-content`;
5. exactly one canonical Header output;
6. exactly one Homepage Commercial Footer output;
7. exact ten IDs in approved order;
8. one self-canonical;
9. reciprocal EN/RU hreflang;
10. one x-default to `/`;
11. absolute OG/social URLs;
12. required proof statuses and disclosure text;
13. correct Private Review query parameters;
14. one V2 stylesheet;
15. no duplicate V2 script;
16. no legacy Homepage V1 runtime references;
17. no unrendered Liquid tokens in generated HTML;
18. no Liquid tokens in raw Homepage V2 CSS/JS;
19. no `replace_first` Homepage dependency;
20. no duplicate Footer pulse stylesheet;
21. EN/RU data parity for required structures;
22. nonblank required localized content;
23. existing Footer System assertions still passing.

The workflow must build generated `_site` and validate generated output, not source assumptions.

---

# 19. HOMEPAGE PRODUCTION FILE SCOPE

Expected new files:

```text
_layouts/homepage-v2.html
_data/homepage_v2/en.yml
_data/homepage_v2/ru.yml
_includes/homepage-v2/hero.html
_includes/homepage-v2/connected-journey.html
_includes/homepage-v2/directions.html
_includes/homepage-v2/client-work.html
_includes/homepage-v2/ways-to-start.html
_includes/homepage-v2/process.html
_includes/homepage-v2/founder.html
_includes/homepage-v2/selected-work.html
_includes/homepage-v2/insights.html
_includes/homepage-v2/private-review.html
assets/css/homepage-v2.css
assets/js/homepage-v2.js
assets/img/homepage-v2/** as approved
```

Expected modified files:

```text
index.html
ru/index.html
.github/workflows/deploy-pages.yml
```

Optional files only when reused and justified:

```text
_includes/homepage-v2/proof-status.html
_includes/homepage-v2/responsive-image.html
```

Prohibited incidental modifications:

- Header files;
- Footer files;
- service pages;
- case pages;
- Insights pages;
- Contact pages in Homepage PR;
- `_config.yml`;
- sitemap unless route behavior actually changes;
- robots;
- unrelated metadata;
- legacy snapshot deletion.

---

# 20. ROLLBACK CONTRACT

Before Homepage publication record:

- current pre-V2 `index.html` blob SHA;
- current pre-V2 `ru/index.html` blob SHA;
- current EN snapshot blob SHA;
- current RU snapshot blob SHA;
- old runtime asset references;
- exact two-wrapper restore patch;
- whether Contact prerequisite remains deployed during Homepage rollback.

The independent review recorded the then-current rollback identifiers:

```text
index.html: 3d44bd2f6f0f09bf9c45ba661ccffd2ac6183aa4
ru/index.html: 4d703c149b626dab3a3db13b3566c9d0cb28d374
homepage-current-en.html: a781a6a108091ff8caac3a07f104979cdf1493e8
homepage-current-ru.html: d12c559fa4a6173aceb52617530a984dfd52a644
```

These values must be rechecked from current `main` before production branch creation.

Required rollback rehearsal before publication:

1. build V2 successfully;
2. restore prior EN/RU wrappers in a test branch/worktree;
3. run Jekyll build;
4. verify old EN/RU routes render;
5. verify Header/Footer generated-output checks pass;
6. verify retained legacy assets resolve;
7. document result and exact restore commands/patch.

Legacy snapshots and assets are not deleted in the Homepage V2 PR.

Legacy cleanup is a later independent task after stable publication.

---

# 21. QA MATRIX

Minimum generated and browser checks:

- large desktop;
- laptop;
- tablet portrait;
- tablet landscape;
- 430 px;
- 390 px;
- 375 px;
- 360 px;
- 320 px;
- short phone landscape around 540 px height;
- owner iPhone portrait;
- owner iPhone landscape;
- representative Safari/WebKit;
- representative Android/Chrome mobile;
- Chromium keyboard;
- Firefox keyboard;
- no-JS;
- reduced motion;
- forced colors;
- network failure for Chatbase;
- Contact success/error states;
- horizontal overflow;
- anchor offsets;
- Header/Footer collision;
- proof status visibility;
- EN/RU long-copy behavior.

---

# 22. IMPLEMENTATION GATES

## Gate A — Strategy

Passed through owner approval.

## Gate B — Implementation Contract

Passes only when owner approves this corrected scope.

## Gate C — Contact Prerequisite

Requires:

- narrow EN/RU implementation;
- field collision resolved;
- allowlisted query handling;
- Formspree behavior preserved;
- independent review;
- owner-authorized merge.

## Gate D — Content and Proof

Requires:

- final EN copy;
- final RU copy;
- proof-source pack;
- image inventory;
- exact alt text;
- exact disclosures;
- final article route mapping.

## Gate E — Full-Page Prototype

Requires approval of:

- desktop;
- phone portrait;
- phone landscape;
- representative RU layouts;
- Header/Footer handoffs;
- signature Journey;
- proof surfaces.

## Gate F — Homepage Build

Requires:

- current-main production branch;
- full EN/RU V2 system;
- Jekyll build;
- generated-output gate;
- browser matrix;
- no mixed V1/V2 runtime;
- performance report.

## Gate G — Independent Production Review

Fresh Reviewer inspects:

- actual diff;
- generated HTML;
- screenshots;
- browser results;
- performance;
- Contact dependency;
- rollback rehearsal.

## Gate H — Publication

Requires explicit owner merge/publication authorization.

---

# 23. ACCEPTED REVIEW CORRECTIONS REGISTER

All independent-review corrections are accepted as follows:

## P0 accepted

- exact Header contract;
- exact Homepage Footer contract;
- Contact `intent` collision resolution;
- canonical source context schema;
- separate Contact prerequisite PR;
- query allowlists and safe DOM handling;
- explicit production metadata origin;
- Homepage generated-output deployment gate;
- exact runtime asset manifest;
- Chatbase preserved unchanged;
- no Liquid in raw Homepage assets.

## P1 accepted

- explicit shared-layout data owner and include contract;
- required EN/RU schema parity;
- established `assets/img/homepage-v2/**` convention;
- fixed Header offset contract;
- responsive image object contract;
- component and total-page performance reporting;
- Ways-to-Start required schema;
- Journey DOM/accessibility order;
- fresh-current-main production branch rule;
- tested rollback rehearsal;
- cache-busting ownership;
- vendor-neutral analytics fallback.

## P2 adopted

- helper includes only when reused;
- existing-versus-new image reuse recorded;
- no assumed Homepage JSON-LD;
- Android/Chrome representative check;
- CSS section ownership comments without global leakage.

---

# 24. READINESS STATUS

After owner approval of this implementation contract:

1. the corrected production scope is approved;
2. implementation may begin only with the narrow Contact prerequisite;
3. Homepage production remains blocked until Contact is merged and verified, final content/proof packs are approved and prototypes pass;
4. no production PR may be merged without explicit owner authorization.

Current status:

> **READY FOR OWNER APPROVAL OF THE CORRECTED PRODUCTION SCOPE.**
