# Homepage V2 Implementation Plan — Independent Review Report

**Status:** independent implementation-plan review complete  
**Verdict:** `TARGETED CORRECTION`  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Branch:** `agent/homepage-v2-implementation-plan`  
**Reviewed branch head:** `e20a6023b1a4bddc2c39a4b95d4563e404057933`  
**Implementation-plan blob:** `b775dc2d7c24dfd4b6e22da15f3d9c513f9aecd8`  
**Current-main SHA verified:** `7bcc09ae28388f8e4a5e6e5a715aa5ba7b3fbf50`  
**Review role:** Control / Independent Technical Reviewer

---

# 1. Executive verdict

The implementation plan is technically strong and is grounded in the actual production repository state.

The supplied branch head was confirmed identical to the branch ref. The production baseline used by the plan was also confirmed to remain the actual current `main` during review:

```text
main: 7bcc09ae28388f8e4a5e6e5a715aa5ba7b3fbf50
status against reviewed baseline: identical
```

The plan correctly identifies the current full-document snapshot-wrapper architecture, its Liquid string-transformation risks, the existing shared Header and Footer ownership, the current Contact sanitization behavior, the current Homepage CSS/JavaScript layers, the accepted Concept A system, and the exact rollback sources.

The proposed replacement architecture is appropriate:

```text
index.html
ru/index.html
_includes/homepage-v2-en.html
_includes/homepage-v2-ru.html
assets/css/homepage-v2.css
```

It is sufficient, minimal, reversible, Jekyll/GitHub Pages-compatible, and does not require Homepage-specific JavaScript.

The plan also correctly protects:

- `/` and `/ru/`;
- localized document shells and metadata;
- canonical, reciprocal `hreflang`, and `x-default`;
- shared Header and Footer systems;
- ten-block order and Concept A section-surface ownership;
- Financial Stream flagship priority;
- proof taxonomy and visible disclosures;
- existing proof assets;
- responsive, accessibility, build, independent-review, and rollback gates;
- creation of any future production branch from the then-current `main`, not from the docs-only planning branch.

One blocking defect remains in Section 9.2, **Required Homepage CTA mapping**.

The plan changes the already accepted Contact URL contract by:

1. adding `source_context` query parameters that the accepted Homepage Content Architecture does not authorize for these CTAs;
2. adding `selected_direction=not_sure` to Hero and Final Private Review links, although the accepted action map explicitly assigns no selected direction to those actions;
3. omitting the required `#project-intake` fragment from the Contact destinations.

The production Contact pages can sanitize a bounded `source_context`, but runtime tolerance does not override the accepted Homepage query contract. The implementation plan must preserve the exact accepted mappings rather than introduce a broader tracking contract during planning.

This is a narrow documentation defect. It does not invalidate the replacement architecture, five-file scope, asset plan, visual system, accessibility model, or rollback feasibility.

**Final verdict: `TARGETED CORRECTION`.**

---

# 2. Reviewed scope and artifacts

## Branch verification

```text
branch: agent/homepage-v2-implementation-plan
supplied head: e20a6023b1a4bddc2c39a4b95d4563e404057933
branch ref status: identical
ahead: 0
behind: 0
```

## Implementation plan

```text
path:
docs/site-evolution/homepage-v2-implementation-plan/01_HOMEPAGE_V2_IMPLEMENTATION_PLAN.md

blob:
b775dc2d7c24dfd4b6e22da15f3d9c513f9aecd8
```

The supplied blob matches the actual plan blob at the reviewed head.

## Current production baseline

```text
main SHA:
7bcc09ae28388f8e4a5e6e5a715aa5ba7b3fbf50

status during review:
identical to current main
```

## Planning-branch file scope

Relative to accepted Concept A final-review commit `3041db8ea7e8e6f225e72e0e945685099e411e79`, the reviewed planning branch contains only:

```text
docs/site-evolution/homepage-v2-implementation-plan/00_READ_ME.md
docs/site-evolution/homepage-v2-implementation-plan/01_HOMEPAGE_V2_IMPLEMENTATION_PLAN.md
docs/site-evolution/homepage-v2-implementation-plan/02_HOMEPAGE_V2_IMPLEMENTATION_PLAN_REVIEW_TASK.md
docs/site-evolution/homepage-v2-implementation-plan/03_HOMEPAGE_V2_IMPLEMENTATION_PLAN_REVIEW_REPORT.md
```

No Homepage, Header, Footer, Contact, CSS, JavaScript, asset, route, metadata, sitemap, workflow, or production file is present in the planning-branch delta.

## Production materials inspected

The review inspected the actual baseline versions of:

```text
index.html
ru/index.html
_includes/homepage-current-en.html
_includes/homepage-current-ru.html

_includes/header-system/header.html
_data/header.yml
_data/navigation.yml
assets/js/header-system-v1.js

_includes/footer-commercial-v1.html

contact/index.html
ru/contact/index.html

assets/css/homepage-materials-editorial-v2.css
assets/css/homepage-core-hardening-v1.css
assets/css/homepage-commercial-refinement-v1.css
assets/js/homepage-core-hardening-v1.js
```

The accepted Content Architecture and corrected Concept A selected specification were also checked as authority sources.

---

# 3. Current production architecture findings

**Result: PASS.**

The plan accurately describes the current Homepage architecture.

## Full-document snapshots

Both snapshot includes own complete HTML documents rather than only page-body content:

```text
_includes/homepage-current-en.html
blob: a781a6a108091ff8caac3a07f104979cdf1493e8

_includes/homepage-current-ru.html
blob: d12c559fa4a6173aceb52617530a984dfd52a644
```

They contain:

- `<!DOCTYPE html>`;
- localized `<html>`;
- complete `<head>` metadata;
- favicon and social-preview tags;
- large inline CSS;
- local Header and Footer markup;
- Homepage sections;
- legacy inline JavaScript and motion behavior.

## Wrapper mutation ownership

The actual `index.html` and `ru/index.html` wrappers confirm the plan's analysis. They use:

- Liquid `capture` around the full snapshot;
- `replace` and `replace_first` for metadata, copy, semantics, CSS/JS injection, and body changes;
- marker-string `split` for Header, Footer, Insights, and surrounding content;
- appending of shared Header and Footer includes after string splitting;
- loading of three external Homepage stylesheets and Homepage hardening JavaScript.

The plan correctly identifies exact-string and marker coupling as unsuitable for a complete Homepage V2 rebuild.

## Existing ownership layers

The plan accurately records that the current page is jointly controlled by:

- snapshot inline CSS;
- snapshot inline JavaScript;
- Liquid wrapper transformations;
- `homepage-materials-editorial-v2.css`;
- `homepage-core-hardening-v1.css`;
- `homepage-commercial-refinement-v1.css`;
- `homepage-core-hardening-v1.js`;
- shared Header CSS/JS;
- shared Footer includes and styles.

## Legacy JavaScript mismatch

The actual Homepage hardening script still looks for legacy selectors such as:

```text
.site-nav
.mobile-menu-toggle
```

The shared Header uses:

```text
.site-header__nav
.site-header__menu-toggle
```

The Header already owns its menu behavior through `header-system-v1.js`. The plan is correct to stop loading the old Homepage hardening script rather than adapt or carry it into Homepage V2.

## Architecture conclusion

Replacing the full-document mutation system with explicit wrappers and localized `<main>` includes is safer and more deterministic than extending the current Liquid `replace` / `split` chain.

---

# 4. Proposed five-file architecture findings

**Result: PASS.**

The proposed initial Builder scope is sufficient and minimal:

```text
Modified:
index.html
ru/index.html

New:
_includes/homepage-v2-en.html
_includes/homepage-v2-ru.html
assets/css/homepage-v2.css
```

## Sufficiency

The five files can own all required Homepage V2 responsibilities:

- localized full-document shells and metadata through the two wrappers;
- exact EN/RU Homepage content through the two body includes;
- complete Concept A presentation and responsive behavior through one scoped stylesheet;
- shared Header and Footer inclusion without modifying shared systems;
- static Contact links without Contact-page changes;
- no route changes and no new data architecture.

## Minimality

No additional file is required for the initial implementation because:

- Header interaction already has shared JavaScript;
- Footer styles are loaded by the Footer include itself;
- Contact accepts static query strings;
- all required proof images already exist;
- accepted content can live directly in the localized includes;
- no framework, package, plugin, YAML data file, component library, or new build step is required.

## Isolation and reversibility

The plan correctly leaves the existing snapshot includes and legacy Homepage enhancement files unchanged. This provides an exact source rollback while preventing unrelated modifications to:

- Header;
- Footer;
- Contact;
- services;
- case studies;
- Insights;
- shared data;
- workflows;
- deployment.

The instruction to stop and report if a sixth file becomes genuinely necessary is appropriate.

## Jekyll/GitHub Pages compatibility

The proposed architecture uses existing repository capabilities:

- front matter;
- Liquid includes;
- static HTML;
- one normal CSS asset;
- existing GitHub Pages/Jekyll behavior.

No custom plugin or unsupported build feature is introduced.

---

# 5. JavaScript-boundary findings

**Result: PASS.**

The initial Homepage V2 does not require a page-specific JavaScript file.

All accepted content and actions can work through:

- semantic static HTML;
- normal anchors and routes;
- static Contact query strings;
- responsive CSS;
- the existing shared Header JavaScript.

No accepted Concept A requirement depends on:

- reveal gating;
- pointer-following transforms;
- sticky scroll choreography;
- draggable mockups;
- dynamic workflow environments;
- marquees;
- canvas or WebGL;
- continuous motion.

The accepted rule **Signal, not spectacle** explicitly permits a fully static implementation.

The plan correctly prevents the legacy Homepage scripts from being carried forward and leaves any optional motion for a separate post-acceptance task.

---

# 6. Contact-contract findings

**Result: FAIL — TARGETED CORRECTION REQUIRED.**

## Actual production sanitization

The EN and RU Contact pages currently use the same finite allowlists:

```text
intent:
private_review | project_inquiry

source_page:
homepage | contact

source_cta:
homepage_hero | homepage_ways_to_start | homepage_final | direct_contact

selected_direction:
ai_systems_automation | websites_branding | both | not_sure
```

They also accept `source_context` only through a generic bounded-identifier sanitizer. This runtime field is not a separately accepted finite Homepage value map.

## Accepted Homepage Content Architecture contract

The accepted Content Architecture defines exact Contact destinations for Homepage V2.

### Hero

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_hero#project-intake
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_hero#project-intake
```

No `selected_direction` is assigned. No `source_context` is assigned.

### Ways to Start — Website & trust

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=websites_branding#project-intake
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=websites_branding#project-intake
```

### Ways to Start — Inquiry handling

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=ai_systems_automation#project-intake
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=ai_systems_automation#project-intake
```

### Ways to Start — Connected system

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=both#project-intake
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=both#project-intake
```

### Final Private Review

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_final#project-intake
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_final#project-intake
```

No `selected_direction` is assigned. No `source_context` is assigned.

## Defect in the implementation plan

Section 9.2 currently:

- adds `selected_direction=not_sure` to Hero and Final links;
- adds `source_context=hero`, `website_trust`, `inquiry_handling`, `connected_system`, and `final_private_review`;
- omits the `#project-intake` fragment.

These changes broaden and alter the accepted Homepage tracking/navigation contract without a separately reviewed Contact-contract change.

The fact that current Contact JavaScript can sanitize a bounded `source_context` does not authorize Homepage V2 to introduce those values. The implementation plan must follow the accepted exact URL contract.

## Required correction

Change only Section 9.2 and any duplicated CTA examples or QA assertions in:

```text
docs/site-evolution/homepage-v2-implementation-plan/01_HOMEPAGE_V2_IMPLEMENTATION_PLAN.md
```

Required result:

1. remove all Homepage V2 `source_context` parameters;
2. remove `selected_direction=not_sure` from Hero and Final Private Review;
3. retain approved `selected_direction` only for the three Ways-to-Start situations;
4. append `#project-intake` to every Homepage-to-Contact URL;
5. keep EN at `/contact/` and RU at `/ru/contact/`;
6. do not change Contact files or sanitization logic.

---

# 7. Header, Footer, metadata, and route findings

**Result: PASS.**

## Header

The plan correctly preserves:

- `_includes/header-system/header.html`;
- `_data/header.yml`;
- `_data/navigation.yml`;
- `assets/css/header-system-v1.css`;
- `assets/js/header-system-v1.js`.

The proposed wrapper include parameters match the actual Header contract:

```text
lang
current_page="home"
locale_url
variant="standard"
```

The Header already owns menu toggle, Escape handling, outside-click closing, scroll state, language switch, and responsive behavior.

Homepage V2 must not create a local competing Header.

## Footer

The shared commercial Footer include owns its own required stylesheet links:

```text
footer-commercial-v1-polish.css
footer-system-foundation-v1.css
footer-title-pulse-v1.css
```

Therefore the wrappers can include the Footer without modifying Footer files or adding those files to the Builder scope.

The plan correctly keeps the shared Footer immediately after Final Private Review and outside Homepage surface ownership.

## Metadata and routes

The plan correctly protects:

- EN route `/`;
- RU route `/ru/`;
- `lang="en"` and `lang="ru"`;
- canonical URLs;
- reciprocal EN/RU `hreflang`;
- `x-default` to `/`;
- favicon set;
- existing OG/Twitter image URLs during the initial pass;
- localized titles, descriptions, OG URLs, and locale relationships.

No sitemap edit is required because routes remain unchanged. Generated output must still be verified.

---

# 8. Section and visual-system findings

**Result: PASS.**

The plan preserves the accepted ten-block order exactly:

1. Hero;
2. Connected Business Journey;
3. Two Core Directions;
4. Financial Stream flagship proof;
5. Ways to Start;
6. Controlled Delivery;
7. Founder accountability;
8. Selected Work;
9. Insights;
10. Final Private Review.

## Concept A section-surface ownership

The required base surfaces are correctly assigned:

```text
Hero                         #06080B + restrained atmosphere
Connected Business Journey   #0E1319
Two Core Directions          #06080B
Financial Stream             #0E1319
Ways to Start                #06080B
Controlled Delivery          #0E1319
Founder accountability       #06080B
Selected Work                #0E1319
Insights                     #06080B
Final Private Review         #0E1319
```

The Footer remains outside this ownership map.

## Commercial hierarchy

The plan correctly preserves:

- Financial Stream as the strongest and earliest proof;
- exactly two service directions;
- Ways to Start as situations rather than plans or pricing;
- service-link counts `1 / 1 / 2`;
- five Controlled Delivery stages;
- founder content subordinate to proof and process;
- Insights subordinate to proof and conversion;
- one bounded final Private Review action.

## IDs and legacy anchors

The proposed canonical section IDs are unique.

Legacy aliases are required to be non-visual or safely colocated. The plan explicitly prohibits duplicate IDs, extra top-level sections, layout gaps, and keyboard traps.

## Visual boundary

The implementation plan protects:

- graphite surfaces;
- controlled cyan signal;
- restrained grid and Hero atmosphere;
- moderate radii;
- no dashboard imitation;
- no glassmorphism system;
- no continuous animation;
- no crypto/startup or excessive sci-fi styling.

---

# 9. Asset findings

**Result: PASS.**

All exact proof-source paths named in the plan exist at the verified production baseline.

## Financial Stream

```text
/assets/img/cases/financial-stream/fs-home-desktop-en-1600w.webp
/assets/img/cases/financial-stream/fs-home-mobile-en-640w.webp
/assets/img/cases/financial-stream/fs-home-desktop-ru-1600w.webp
/assets/img/cases/financial-stream/fs-home-mobile-ru-640w.webp
```

## Founder portrait

```text
/ru/about/ProAI_Founder_Portrait_2x3.webp
```

## Alina Horb

```text
/assets/img/cases/alina-horb/final-assets-v1/delivery/alina-horb-home-ua-desktop.webp
```

## Local Repair Pro

```text
/assets/img/cases/local-repair-pro/production-v1/lrp-01-homepage-hero-640.webp
/assets/img/cases/local-repair-pro/production-v1/lrp-01-homepage-hero-1120.webp
/assets/img/cases/local-repair-pro/production-v1/lrp-01-homepage-hero-1920.webp
```

The Financial Stream and Alina sources are also referenced by existing production/case materials, supporting their role as established proof sources.

No new asset file is required for the initial five-file Builder pass.

Final crop, responsive selection, dimensions, loading priority, and localized alt text remain Builder/browser QA responsibilities. If a source proves unsuitable in rendered implementation, the plan correctly requires stopping for a separate asset task rather than silently adding files.

---

# 10. EN/RU, proof, accessibility, and responsive findings

**Result: PASS.**

## EN/RU resilience

The plan adequately protects:

- full accepted RU Hero copy;
- natural differences in EN/RU line wrapping;
- normal-flow expansion;
- no fixed-height localized text containers;
- no shrinking to micro-text for visual symmetry;
- localized routes and links;
- matching hierarchy without requiring matching line counts.

## Proof taxonomy

The three evidence classes remain distinct:

```text
Financial Stream   real client flagship proof
Alina Horb         founder-connected project
Local Repair Pro   concept/demo in development
```

The plan preserves the exact RU statuses for Alina Horb and Local Repair Pro and requires adjacent visible disclosures.

It prohibits unsupported rankings, leads, conversion, revenue, ROI, project-count, testimonial, and customer-outcome claims.

## Typography and disclosure minimums

The plan carries the accepted requirements:

```text
mobile essential proof status   12px mandatory
mobile disclosure               14px mandatory
short non-essential metadata    11px permitted
```

Long RU statuses may wrap, use title case, or reduce tracking, but may not clip, break inside words, shrink below minimum, or hide behind interaction.

## Accessibility

The plan sufficiently requires:

- one skip link and one `<main>` landmark;
- semantic heading hierarchy;
- unique IDs;
- keyboard access;
- visible focus;
- minimum `44 × 44 CSS px` interactive targets where applicable;
- `3:1` non-text contrast when a boundary identifies a control;
- forced-colors resilience;
- reduced-motion resilience;
- image alternatives;
- no color-only proof classification;
- no hover-dependent content;
- 200% zoom and text reflow;
- no horizontal overflow;
- no page-specific JavaScript dependency for reading.

## Responsive matrix

The proposed viewport matrix is appropriate and materially exceeds the minimum required modes:

```text
1440 × 900
1280 × 800
1024 × 768
900 × 900
844 × 390
768 × 1024
430 × 932
390 × 844
375 × 812
360 × 800
320 × 640
```

The short-landscape assertions correctly prohibit `100vh` Hero lock, decorative obstruction, overlap, horizontal poster layouts, and unusable Header height.

---

# 11. Build, QA, branch, and rollback findings

**Result: PASS.**

## Build and generated output

The plan requires a realistic Jekyll/GitHub Pages-compatible verification path:

- build result;
- generated `/index.html` and `/ru/index.html` inspection;
- canonical, `hreflang`, and `x-default` verification;
- CTA, service, case, article, founder, and external-link checks;
- missing-asset and console checks;
- responsive matrix;
- keyboard/focus checks;
- reduced-motion and forced-colors checks.

## Independent production review

The planned Reviewer scope correctly includes:

- actual GitHub diff;
- generated output;
- full rendered EN/RU pages;
- all ten blocks;
- surface ownership;
- proof hierarchy;
- Contact mappings;
- Header/Footer isolation;
- responsive/accessibility evidence;
- unrelated-change detection.

Optional Codex/browser escalation is correctly reserved for the later authorized Tier 3 QA stage and is not used to reinterpret the design.

## Future production branch

The plan correctly requires:

```text
agent/homepage-v2-concept-a-build
```

to be created from the **then-current `main`**, after:

1. plan acceptance;
2. explicit owner Builder authorization;
3. fresh `main` fetch;
4. relevant-file drift comparison.

The plan explicitly prohibits starting production from the docs-only planning branch.

## Rollback

Rollback is deterministic:

1. restore `index.html` and `ru/index.html` from the production branch base;
2. remove the two new localized Homepage V2 includes;
3. remove `assets/css/homepage-v2.css`;
4. rebuild and verify `/` and `/ru/`.

The old snapshot includes remain unchanged and available as exact rollback sources.

No Header, Footer, Contact, service, case-study, or Insights rollback should be necessary because those systems remain outside the initial scope.

---

# 12. Remaining defects

One blocking planning defect remains.

## Contact URL mapping defect

**Location:** Section 9.2, `Required Homepage CTA mapping`, plus any duplicated examples or QA expectations derived from it.

**Required correction:**

- remove Homepage `source_context` query parameters;
- remove `selected_direction=not_sure` from Hero and Final Private Review;
- preserve `selected_direction` only for the three accepted Ways-to-Start mappings;
- add `#project-intake` to every Homepage-to-Contact destination;
- preserve EN `/contact/` and RU `/ru/contact/`;
- do not modify Contact pages or broaden the Contact contract.

**Permitted correction file:**

```text
docs/site-evolution/homepage-v2-implementation-plan/01_HOMEPAGE_V2_IMPLEMENTATION_PLAN.md
```

Everything else must remain unchanged.

No additional architecture, file-scope, JavaScript, metadata, asset, proof, responsive, accessibility, build, branch, or rollback defect was found.

---

# 13. Exact next authorized step

The next authorized step is a narrow documentation correction on the same planning branch.

The Builder may modify only:

```text
docs/site-evolution/homepage-v2-implementation-plan/01_HOMEPAGE_V2_IMPLEMENTATION_PLAN.md
```

The correction must restore the exact accepted Homepage Contact URLs described in Section 6 of this report.

After that correction, conduct a focused independent correction review that verifies only:

1. exact Hero Contact mapping;
2. exact three Ways-to-Start mappings;
3. exact Final Private Review mapping;
4. absence of unapproved `source_context` values;
5. `#project-intake` on every Contact CTA;
6. unchanged five-file architecture and all other accepted planning boundaries;
7. exact changed-file scope.

Until that focused review returns `ACCEPT`, do not:

- create the production Builder branch;
- modify Homepage files;
- create Homepage CSS or includes;
- create or alter images/assets;
- create a production PR;
- merge or deploy.

---

# 14. Changed-file confirmation

Only this file was changed during the independent implementation-plan review:

```text
docs/site-evolution/homepage-v2-implementation-plan/03_HOMEPAGE_V2_IMPLEMENTATION_PLAN_REVIEW_REPORT.md
```

Not changed:

- implementation plan;
- workspace README;
- review task;
- Homepage wrappers;
- Homepage snapshots;
- Header;
- Footer;
- Contact;
- CSS;
- JavaScript;
- images or assets;
- routes;
- metadata;
- sitemap;
- workflows;
- production files;
- `main`.

No production branch or production PR was created.

Independent Homepage V2 implementation-plan review complete. No production files were changed.
