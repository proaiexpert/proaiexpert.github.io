# ProAI Expert Homepage V2 — Implementation Plan

**Status:** implementation plan candidate for independent review  
**Version:** V1  
**Date:** 2026-08-05  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Planning branch:** `agent/homepage-v2-implementation-plan`  
**Planning branch base:** `3041db8ea7e8e6f225e72e0e945685099e411e79`  
**Current `main` inspected:** `7bcc09ae28388f8e4a5e6e5a715aa5ba7b3fbf50`  
**Selected direction:** Concept A — Precision Grid  
**Production authorization:** none

---

# 1. Purpose

This document defines the minimum safe production architecture, file scope, content ownership, asset reuse, Contact integration, responsive QA, accessibility checks, rollback strategy, and Builder/Reviewer workflow for Homepage V2.

It converts the accepted design chain into a future implementation contract:

1. accepted Homepage V2 Strategy;
2. accepted Content Architecture V1.1;
3. accepted four-viewport low-fidelity system;
4. accepted Concept A — Precision Grid;
5. accepted corrected Concept A selected specification;
6. actual current production repository state.

This document does not authorize code. A future Builder may begin only after:

1. this plan receives independent `ACCEPT`;
2. the owner explicitly authorizes the production Builder stage;
3. the Builder fetches the then-current `main` and confirms it has not drifted materially from the baseline analyzed here.

---

# 2. Accepted authority chain

## 2.1 Accepted specification gate

```text
Accepted Concept A final-review commit:
3041db8ea7e8e6f225e72e0e945685099e411e79

Accepted corrected selected-specification blob:
18b707b61ed9290ade4f3faca5162477e2772f05

Accepted Concept A desktop SVG blob:
ede0c12db438e3985a36f8f447383dfd0e4eadcc

Accepted Concept A mobile SVG blob:
c8f5a69944c44046d6684b0a685f4a7b61d33407
```

## 2.2 Locked ten-block order

The future Homepage must preserve exactly:

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

No implementation-planning decision authorizes insertion, deletion, merging, or reordering of top-level Homepage blocks.

## 2.3 Locked visual principle

> **Signal, not spectacle.**

The future implementation must communicate technical authority through precision, typography, surface rhythm, proof, and connected-system logic rather than through constant animation, 3D scenes, glassmorphism, neon spectacle, or dashboard imitation.

---

# 3. Current production snapshot

## 3.1 Current `main`

The exact current production baseline inspected for this plan is:

```text
main SHA:
7bcc09ae28388f8e4a5e6e5a715aa5ba7b3fbf50

commit:
Prepare EN/RU Contact for Homepage V2 private review (#98)
```

This baseline already contains the accepted EN/RU Contact prerequisite and shared Footer System changes.

A future Builder must not assume this SHA remains current. Before creating the production branch, fetch `main` again and compare the relevant files against the baseline table below.

## 3.2 Current Homepage source files

```text
index.html
blob: 3d44bd2f6f0f09bf9c45ba661ccffd2ac6183aa4

ru/index.html
blob: 4d703c149b626dab3a3db13b3566c9d0cb28d374

_includes/homepage-current-en.html
blob: a781a6a108091ff8caac3a07f104979cdf1493e8

_includes/homepage-current-ru.html
blob: d12c559fa4a6173aceb52617530a984dfd52a644
```

## 3.3 Current shared systems

```text
_includes/header-system/header.html
blob: 79f5d0ea74b01b2f1df716aa9e642ceb4d3d58f7

_data/header.yml
blob: aa6e9106a0b6efa0d280b4644283681445954d4c

_data/navigation.yml
blob: cd484c732271208c25d61c497a25d98e0a479b14

assets/js/header-system-v1.js
blob: bb0ce32d70023d3fe0ee0493e6fa96fb4db1b70b

_includes/footer-commercial-v1.html
blob: cf3e776dd79d94975ac0307d5a89fb9b0f8844f4
```

The Header and Footer are separate shared systems. Homepage V2 must include them; it must not recreate, restyle, or fork them.

## 3.4 Current Homepage enhancement assets

```text
assets/css/homepage-materials-editorial-v2.css
blob: d109bba56820a56d153298937a8c987bbab992ba

assets/css/homepage-core-hardening-v1.css
blob: d1295ec39ab66d8baf09a06a042d49ba0143cf49

assets/css/homepage-commercial-refinement-v1.css
blob: 70835c015ce50c97adf13f21010ed489cde5e931

assets/js/homepage-core-hardening-v1.js
blob: 039afed75dca94487b5913bbacb6d56d64bd5ed1
```

These files belong to the current snapshot-wrapper Homepage. They are not the selected Concept A implementation foundation.

They must remain untouched during the first Homepage V2 Builder pass so they can support rollback and avoid unrelated regressions. Homepage V2 should stop loading them rather than editing or deleting them.

---

# 4. Current architecture findings

## 4.1 Current wrapper/snapshot model

The current EN/RU homepages are not direct semantic page sources.

Each wrapper:

1. captures a full-document production snapshot include;
2. injects additional CSS and JavaScript by replacing `</head>`;
3. uses exact-string Liquid `replace`, `replace_first`, and `split` operations to alter Hero copy, process copy, case semantics, selected work, Header, Footer, founder content, and Insights;
4. replaces a legacy local Header with the shared Header include;
5. replaces a legacy local Footer with the shared Footer include;
6. replaces the old Insights region through marker-string splitting;
7. outputs the mutated full-document string.

This system was useful for controlled incremental corrections, but it is not appropriate for a full Homepage V2 rebuild.

## 4.2 Deterministic risks in the current model

The future implementation must remove the following Homepage-specific risks:

### Exact-string coupling

A copy, whitespace, class, or marker change inside a snapshot can silently prevent a Liquid replacement from matching.

### Multiple ownership layers

The visible page is jointly owned by:

- large inline snapshot CSS;
- large inline snapshot JavaScript;
- wrapper string transformations;
- three Homepage-specific external stylesheets;
- Homepage hardening JavaScript;
- shared Header CSS/JS;
- shared Footer includes and styles;
- older mobile recovery styles embedded in the snapshot.

This makes visual cause and rollback difficult to reason about.

### Legacy code remains present before replacement

The snapshot contains its own Header, Footer, old section system, old motion, old mobile menu code, and old styling. The wrapper later replaces or overrides only parts of it.

### Selector mismatch

`homepage-core-hardening-v1.js` still queries legacy selectors such as `.site-nav` and `.mobile-menu-toggle`, while the shared Header uses `.site-header__nav` and `.site-header__menu-toggle`. The Header now owns its own behavior through `header-system-v1.js`.

### Excess motion and obsolete concept identity

The snapshot contains rotating Hero geometry, pointer-following transforms, moving technology rows, scroll-sticky process behavior, device movement, button shine, and reveal gating. These conflict with the accepted Concept A rule that no motion is required and that technical identity must not depend on spectacle.

### Hidden content dependencies

Some current content becomes visible through JavaScript classes. Homepage V2 must remain complete and readable without page-specific JavaScript.

## 4.3 Planning conclusion

Homepage V2 must deliberately replace the wrapper/snapshot mutation architecture for `/` and `/ru/`.

It must not modify or delete the old snapshots during the initial production pass.

The old snapshot files remain an exact rollback source until the new Homepage is independently accepted, merged, deployed, and owner-verified.

---

# 5. Selected future production architecture

## 5.1 Core decision

Use explicit localized Homepage sources rather than string-transforming full-document snapshots.

The future production implementation should use:

```text
index.html
ru/index.html
_includes/homepage-v2-en.html
_includes/homepage-v2-ru.html
assets/css/homepage-v2.css
```

## 5.2 Wrapper ownership

`index.html` and `ru/index.html` will remain small Jekyll-capable full-document wrappers.

Each wrapper will own:

- front matter and permalink;
- `<html lang>`;
- `<head>` metadata;
- favicon links;
- title and localized meta description;
- canonical;
- reciprocal `hreflang`;
- `x-default`;
- Open Graph and Twitter metadata;
- stylesheet links;
- skip link;
- shared Header include;
- localized Homepage body include;
- shared commercial Footer include;
- shared Header JavaScript.

The wrappers must not use `capture` plus `replace`, `replace_first`, or marker-string `split` to construct Homepage content.

## 5.3 Localized body-include ownership

`_includes/homepage-v2-en.html` and `_includes/homepage-v2-ru.html` will each contain only the localized Homepage `<main>` content.

They must not contain:

- `<!DOCTYPE html>`;
- `<html>`;
- `<head>`;
- Header markup;
- Footer markup;
- global navigation data;
- shared Header or Footer CSS;
- inline production JavaScript;
- duplicate metadata.

The EN and RU includes are localized counterparts, not mechanical line-for-line translations.

The exact accepted content and proof taxonomy remain authoritative.

## 5.4 Styling ownership

`assets/css/homepage-v2.css` will be the only new Homepage V2 stylesheet.

It will own:

- Concept A tokens;
- page background and section-surface ownership;
- all ten blocks;
- Homepage-specific typography;
- buttons and contextual action layout inside Homepage content;
- proof/status/disclosure presentation;
- responsive recomposition;
- skip-link and `main` focus treatment;
- forced-colors and reduced-motion-safe Homepage behavior;
- print-safe basic readability when practical.

All new selectors should use a Homepage V2 namespace such as:

```text
.hpv2-*
```

or an equally deterministic page-root scope:

```text
.page-home-v2 .*
```

The stylesheet must not override shared Header or Footer component selectors.

## 5.5 JavaScript decision

The initial Homepage V2 production implementation must add no page-specific JavaScript file.

Required behavior is available through:

- semantic HTML;
- normal navigation;
- URL query parameters;
- CSS responsive layout;
- the existing shared `header-system-v1.js` for Header interaction.

Do not carry forward:

- pointer-following Hero transforms;
- scroll-sticky process choreography;
- reveal gating;
- draggable device mockups;
- animated technology marquees;
- dynamically loaded Homepage workflow scripts;
- Homepage-specific mobile menu code.

A later optional-motion task may be considered only after the static Homepage is accepted and deployed. It is not part of the initial Builder scope.

---

# 6. Exact future Builder file scope

## 6.1 Required modified files

```text
index.html
ru/index.html
```

## 6.2 Required new files

```text
_includes/homepage-v2-en.html
_includes/homepage-v2-ru.html
assets/css/homepage-v2.css
```

## 6.3 Maximum normal initial production scope

The first Builder pass should contain exactly these five files.

If browser/build verification proves that another file is required, the Builder must stop and report the dependency rather than silently widen scope.

## 6.4 Explicitly forbidden files in the first Builder pass

Do not modify or delete:

```text
_includes/homepage-current-en.html
_includes/homepage-current-ru.html

_includes/header-system/header.html
_data/header.yml
_data/navigation.yml
assets/css/header-system-v1.css
assets/js/header-system-v1.js

_includes/footer-commercial-v1.html
_includes/footer-system/*
assets/css/footer-*

contact/index.html
ru/contact/index.html

assets/css/homepage-materials-editorial-v2.css
assets/css/homepage-core-hardening-v1.css
assets/css/homepage-commercial-refinement-v1.css
assets/js/homepage-core-hardening-v1.js
assets/js/homepage-workflow-environment-v1.js

sitemap files
robots files
workflows
deployment files
case-study pages
service pages
Insights pages
shared data files
```

Do not create a new framework, package, dependency, build system, or component library.

---

# 7. Document shell and metadata plan

## 7.1 EN wrapper

`index.html` must preserve:

- route `/`;
- `lang="en"`;
- current canonical `https://proai-expert.com/`;
- alternate EN `/`;
- alternate RU `/ru/`;
- `x-default` `/`;
- current favicon set;
- current production title and description unless a separately accepted copy source requires exact replacements;
- current Open Graph and Twitter URL relationships;
- existing social-preview image URL during the initial implementation;
- shared Header include with:
  - `lang="en"`;
  - `current_page="home"`;
  - `locale_url="/ru/"`;
  - `variant="standard"`;
- shared Footer include with `lang="en"`;
- shared Header stylesheet and JavaScript;
- new `homepage-v2.css` with a cache-busting version.

## 7.2 RU wrapper

`ru/index.html` must preserve:

- route `/ru/`;
- `lang="ru"`;
- RU canonical `https://proai-expert.com/ru/`;
- alternate EN `/`;
- alternate RU `/ru/`;
- `x-default` `/`;
- localized title and description;
- localized Open Graph and Twitter metadata;
- existing RU social-preview image URL during the initial implementation;
- shared Header include with:
  - `lang="ru"`;
  - `current_page="home"`;
  - `locale_url="/"`;
  - `variant="standard"`;
- shared Footer include with `lang="ru"`;
- shared Header stylesheet and JavaScript;
- new `homepage-v2.css` with the same cache-busting version.

## 7.3 Social-preview boundary

Do not create or change social-preview images in the initial Homepage V2 Builder pass.

Preserve the current OG/Twitter image URLs. A new screenshot/social-preview task may be authorized after the new Homepage is deployed and visually accepted.

## 7.4 Sitemap boundary

No sitemap change is expected because `/` and `/ru/` routes remain unchanged.

The Builder must verify generated output rather than edit sitemap files.

---

# 8. Main-content structure and anchors

## 8.1 Required root

Each localized body include must output:

```html
<main id="main-content" class="hpv2" tabindex="-1">
  ...ten blocks...
</main>
```

The skip link in each wrapper must target `#main-content`.

## 8.2 Canonical Homepage V2 section IDs

Use:

```text
hero
connected-journey
directions
financial-stream
ways-to-start
delivery
founder
selected-work
insights
private-review
```

## 8.3 Legacy anchor compatibility

The following existing public anchors should remain reachable through non-visual alias anchors or equivalent safe placement:

```text
#section-trigger  → Financial Stream
#core-split       → Two Core Directions
#methodology      → Controlled Delivery
#selected-work    → Selected Work
#insights         → Insights
```

Alias anchors must not create duplicate IDs, layout gaps, keyboard traps, or extra top-level sections.

The obsolete `#web` anchor is not required because current shared navigation and Footer use real `/websites-branding/` routes.

---

# 9. Contact and CTA contract

## 9.1 Current accepted Contact allowlist

The current EN/RU Contact pages accept:

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

The Contact pages sanitize bounded identifiers and safe absolute HTTP/HTTPS referring URLs. Homepage V2 must not expand or alter this contract.

## 9.2 Required Homepage CTA mapping

### Hero Private Review

EN:

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_hero#project-intake
```

RU:

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_hero#project-intake
```

Hero must not send `selected_direction` or `source_context`.

### Ways to Start — Website & trust

EN:

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=websites_branding#project-intake
```

RU:

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=websites_branding#project-intake
```

### Ways to Start — Inquiry handling

EN:

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=ai_systems_automation#project-intake
```

RU:

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=ai_systems_automation#project-intake
```

### Ways to Start — Connected system

EN:

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=both#project-intake
```

RU:

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=both#project-intake
```

### Final Private Review

EN:

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_final#project-intake
```

RU:

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_final#project-intake
```

Final Private Review must not send `selected_direction` or `source_context`.

Every Homepage-to-Contact URL must end with `#project-intake`. Approved `selected_direction` values are used only for the three Ways-to-Start situations. Homepage V2 must not send any `source_context` parameter.

Do not add unaccepted values. Do not send arbitrary free text in query parameters.

## 9.3 Service links

Preserve exact route families:

```text
EN
/ai-systems/
/websites-branding/

RU
/ru/ai-systems/
/ru/websites-branding/
```

Ways to Start must preserve service-link counts:

```text
Situation 1: 1
Situation 2: 1
Situation 3: 2
```

## 9.4 Proof and project links

Preserve localized case routes and external targets:

```text
Financial Stream case
/case-studies/financial-stream/
/ru/case-studies/financial-stream/

Financial Stream live site
https://financialstreamllc.com/

Alina Horb case
/case-studies/alina-horb/
/ru/case-studies/alina-horb/

Alina Horb live site
https://alinahorb.com/

Local Repair Pro case
/case-studies/local-repair-pro/
/ru/case-studies/local-repair-pro/

Local Repair Pro live demo
/handyman-vancouver-portland-demo/
```

External links opened in a new tab require `rel="noopener noreferrer"` and accessible external-context wording where appropriate.

---

# 10. Ten-block implementation map

## 10.1 Hero

Required structure:

- eyebrow;
- accepted full H1;
- accepted supporting copy;
- primary Private Review CTA;
- expectation copy;
- secondary proof action;
- accountability/location/language line;
- supplementary static system tableau.

Rules:

- text remains commercially dominant;
- tableau uses lightweight semantic/decorative HTML or inline SVG;
- no canvas, WebGL, 3D rotation, pointer tracking, or continuous animation;
- purely decorative graphics use `aria-hidden="true"`;
- primary CTA remains early on mobile;
- full RU H1 remains authoritative and naturally wraps.

Base surface:

```text
#06080B plus restrained Hero atmosphere
```

## 10.2 Connected Business Journey

Required structure:

- three friction fields;
- four steps;
- one visible conclusion;
- no animation-dependent meaning.

Base surface:

```text
#0E1319
```

Mobile:

- stacked normal flow;
- conclusion remains visible;
- no horizontal poster layout.

## 10.3 Two Core Directions

Required structure:

- exactly two directions;
- one service link per direction;
- problem/intervention/intended-effect logic;
- no pricing semantics.

Base surface:

```text
#06080B
```

## 10.4 Financial Stream flagship proof

This is the strongest proof section.

Required structure:

- section identity;
- large real screenshot proof;
- exact real-client status;
- heading and bounded evidence copy;
- visible evidence/claim boundary;
- case-study and live-site actions.

Base surface:

```text
#0E1319
```

The proof field remains visually larger than the evidence panel on desktop.

No testimonial, metric, result, ranking, revenue, conversion, or lead-growth claim may be added unless separately accepted and evidenced.

## 10.5 Ways to Start

Required structure:

- exactly three situations;
- “best when”;
- first objective;
- what it does not imply;
- contextual Private Review CTA;
- service links `1 / 1 / 2`.

Base surface:

```text
#06080B
```

Rows are editorial, not product plans or price cards.

## 10.6 Controlled Delivery

Required stages:

1. Review;
2. Define;
3. Build;
4. Verify;
5. Improve.

Base surface:

```text
#0E1319
```

Desktop may use five columns only when readable. Intermediate layouts may recompose. Mobile uses normal-flow stacking.

## 10.7 Founder accountability

Required structure:

- approved portrait;
- accountability heading;
- concise founder-led explanation;
- About and LinkedIn actions.

Base surface:

```text
#06080B
```

Founder scale remains subordinate to Financial Stream and process proof.

## 10.8 Selected Work

Projects:

- Alina Horb;
- Local Repair Pro.

Each requires separate zones for:

1. image;
2. project name;
3. exact status;
4. disclosure;
5. action.

Base surface:

```text
#0E1319
```

The project categories must not depend on color alone.

## 10.9 Insights

Required structure:

- three accepted selected materials;
- type label;
- article title;
- article action;
- archive action.

Base surface:

```text
#06080B
```

Insights remains subordinate to proof and conversion.

## 10.10 Final Private Review

Required structure:

- section number/label;
- accepted heading;
- primary Private Review CTA;
- bounded expectation copy;
- shared Footer immediately follows.

Base surface:

```text
#0E1319
```

No urgency, fake scarcity, new service argument, or calendar-first replacement.

---

# 11. Design-token implementation plan

The new stylesheet must implement the accepted token roles:

```text
page background                    #06080B
primary section surface            #0E1319
raised/card surface                #131B23
strong inner field                 #06080B
structural border/rule             #24313D
interactive control boundary       #66788C
primary focus signal               #66E3FF
primary text                        #F5F8FB
muted text                          #91A2B3
primary cyan signal                 #66E3FF
deep blue support                   #0A8DFF
```

## 11.1 Structural rule

`#24313D` is decorative/structural only. It may not be the sole boundary for an interactive control or focus state.

## 11.2 Interactive boundary

`#66788C`, or a separately verified replacement, must reach at least `3:1` non-text contrast against the actual adjacent surface.

## 11.3 Focus visible

- minimum `2px` visible focus outline;
- cyan on dark surfaces;
- light outline plus dark separation on cyan-filled controls, or an equivalently verified treatment;
- no focus state based only on low-contrast color shift;
- forced-colors native focus remains enabled.

## 11.4 Radius

```text
normal cards       10–12px
small inner field  6–8px
buttons            10–12px
image frame         8–12px
```

Do not use full-page pill-card language.

## 11.5 Typography minimums

```text
mobile essential proof status     12px mandatory
mobile disclosure                 14px mandatory
short section numbers/metadata    11px permitted
body                              15–17px mobile
```

Long RU statuses may rewrap, use title case, or reduce tracking. They may not shrink below the mandatory minimum, clip, break inside words, or hide behind interaction.

---

# 12. Asset reuse plan

The initial Builder pass must reuse existing approved production assets. No new image files are required.

## 12.1 Financial Stream

EN:

```text
/assets/img/cases/financial-stream/fs-home-desktop-en-1600w.webp
/assets/img/cases/financial-stream/fs-home-mobile-en-640w.webp
```

RU:

```text
/assets/img/cases/financial-stream/fs-home-desktop-ru-1600w.webp
/assets/img/cases/financial-stream/fs-home-mobile-ru-640w.webp
```

Use `<picture>` or responsive composition where useful. The desktop proof should not require a decorative monitor frame. A restrained browser/screenshot field is sufficient.

## 12.2 Founder portrait

```text
/ru/about/ProAI_Founder_Portrait_2x3.webp
```

Use the existing approved portrait. Do not create a dramatic new founder Hero crop.

## 12.3 Alina Horb

Primary existing source:

```text
/assets/img/cases/alina-horb/final-assets-v1/delivery/alina-horb-home-ua-desktop.webp
```

The Homepage card must disclose founder connection and must not imply independent client validation.

## 12.4 Local Repair Pro

Responsive existing sources:

```text
/assets/img/cases/local-repair-pro/production-v1/lrp-01-homepage-hero-640.webp
/assets/img/cases/local-repair-pro/production-v1/lrp-01-homepage-hero-1120.webp
/assets/img/cases/local-repair-pro/production-v1/lrp-01-homepage-hero-1920.webp
```

The Homepage card must state that this is a concept/demo in development and not a paid client or operating repair company.

## 12.5 Loading and dimensions

- Hero decorative tableau: no raster asset required.
- Financial Stream primary proof: may receive eager/high-priority loading only when browser testing confirms it is near enough to the initial viewport; otherwise lazy load.
- Founder, Selected Work, and Insights imagery: lazy load.
- All meaningful images require width, height, and localized alt text.
- Decorative image fields use empty alt or `aria-hidden` only when they carry no evidence.
- No image may contain essential status or disclosure text.

## 12.6 Asset boundary

Do not create AVIF, WebP, JPEG, PNG, SVG, or social-preview derivatives in the initial Builder pass.

If an existing asset proves unsuitable during browser QA, stop and request a separate asset subtask rather than adding unreviewed files.

---

# 13. Localization and proof taxonomy

## 13.1 EN/RU model

- EN and RU share hierarchy and function.
- They do not need matching line counts.
- RU may use more vertical space.
- Text containers remain normal-flow.
- No fixed-height localized copy regions.
- No micro-text used to preserve a desktop composition.

## 13.2 Financial Stream

Classification:

```text
real client flagship proof
```

Status must be explicit and visible before detailed copy.

## 13.3 Alina Horb

Exact RU status:

```text
Действующий проект, связанный с основателем · UA/RU
```

Adjacent disclosure must state that it is founder-connected and is not independent client validation.

## 13.4 Local Repair Pro

Exact RU status:

```text
Концепция сайта · Рабочее демо · В разработке
```

Adjacent disclosure must state that it is not a paid client or operating repair company and is not evidence of real customer outcomes.

## 13.5 No unsupported claims

Do not add:

- guaranteed rankings;
- conversion or revenue improvement;
- lead-growth claims;
- unverified ROI;
- project counts as social proof;
- invented testimonials;
- unsupported client outcome language.

---

# 14. Accessibility implementation plan

The future Builder must implement and verify:

- one visible skip link;
- one `<main>` landmark;
- semantic heading hierarchy;
- unique IDs;
- keyboard access to every link and control;
- visible focus on all interactive elements;
- touch targets of at least `44 × 44 CSS px` where applicable;
- text contrast;
- `3:1` interactive boundary contrast where the boundary identifies the control;
- no color-only status classification;
- no hover-dependent content;
- no page-specific JavaScript dependency for reading or navigation;
- image alt ownership;
- decorative graphic exclusion from assistive reading order;
- `prefers-reduced-motion` resilience;
- forced-colors resilience;
- text selection;
- 200% zoom and text reflow;
- no horizontal overflow;
- no clipped localized text;
- Header menu focus and escape behavior preserved through the shared Header system.

The Builder must not suppress browser/system focus in forced-colors mode.

---

# 15. Responsive test matrix

## 15.1 Required viewports

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

## 15.2 Required assertions

At every relevant viewport:

- no horizontal page overflow;
- Header usable;
- language switch correct;
- primary Hero CTA visible and reachable;
- full RU Hero present;
- section-surface order correct;
- Connected Journey complete;
- Financial Stream remains strongest proof;
- Ways to Start CTA and service links remain distinct;
- process stages readable;
- founder section subordinate;
- project statuses and disclosures visible;
- 12px mobile status minimum preserved;
- 14px mobile disclosure minimum preserved;
- final CTA visible;
- shared Footer complete;
- no section overlap;
- no fixed-height clipping;
- no essential horizontal carousel.

## 15.3 Short landscape

At approximately `844 × 390`:

- Header menu must not consume unusable height;
- primary Hero CTA must remain reachable;
- Hero must not force `100vh`;
- normal vertical scrolling must work;
- no decorative obstruction;
- no overlapping journey steps;
- no horizontal poster composition.

---

# 16. Build and verification plan

## 16.1 Builder checks

The production Builder must report:

1. actual production branch base SHA;
2. actual five-file diff;
3. changed-file confirmation;
4. Jekyll/GitHub Pages-compatible build result;
5. generated `/index.html` and `/ru/index.html` inspection;
6. canonical/hreflang/x-default verification;
7. all CTA query strings;
8. all service, case, article, About, LinkedIn, and live-site links;
9. no console errors in tested browsers;
10. no missing assets;
11. no horizontal overflow in the required matrix;
12. keyboard and focus checks;
13. reduced-motion and forced-colors checks;
14. rollback instructions.

## 16.2 Independent Reviewer checks

The production Reviewer must inspect:

- actual GitHub diff;
- generated output;
- rendered EN/RU full pages;
- all ten blocks;
- accepted surface ownership;
- proof hierarchy;
- Contact query contract;
- Header/Footer isolation;
- responsive and accessibility evidence;
- absence of unrelated changes.

## 16.3 Codex/browser escalation

Because full browser automation, screenshots, multiple viewport checks, and broad generated-output verification are Tier 3 activities, the final pre-merge QA may use Codex after the owner authorizes that stage and limits are available.

Codex should receive the already implemented, reviewable branch. It should not be asked to redesign the Homepage or reinterpret the accepted specification.

---

# 17. Branch and commit plan

## 17.1 Planning branch

Current docs-only branch:

```text
agent/homepage-v2-implementation-plan
```

This branch is not a production branch and must not be merged into `main` as a Homepage implementation.

## 17.2 Future production Builder branch

After plan acceptance and explicit owner authorization, create a new branch from the then-current `main`:

```text
agent/homepage-v2-concept-a-build
```

Do not branch production work from the docs-only planning branch.

## 17.3 Recommended Builder commits

Use a small, intelligible sequence:

1. `Add explicit EN/RU Homepage V2 structure`
2. `Implement Concept A Homepage V2 styling`
3. `Harden Homepage V2 responsive and accessibility behavior`

A final squash may be used for merge if the owner and Publisher choose it.

## 17.4 Reviewer write boundary

The production Reviewer should initially work read-only. Any review report must be separate from production source changes.

A `TARGETED CORRECTION` returns to the same Builder branch with exact file and defect scope.

---

# 18. Rollback plan

## 18.1 Source rollback

The old snapshot includes remain unchanged:

```text
_includes/homepage-current-en.html
blob: a781a6a108091ff8caac3a07f104979cdf1493e8

_includes/homepage-current-ru.html
blob: d12c559fa4a6173aceb52617530a984dfd52a644
```

Current wrapper baseline blobs:

```text
index.html
3d44bd2f6f0f09bf9c45ba661ccffd2ac6183aa4

ru/index.html
4d703c149b626dab3a3db13b3566c9d0cb28d374
```

Rollback consists of:

1. restoring the two wrapper blobs from the production branch base;
2. removing the two new Homepage V2 body includes;
3. removing `assets/css/homepage-v2.css`;
4. rebuilding and rechecking `/` and `/ru/`.

No Header, Footer, Contact, case-study, service, or Insights rollback should be required because they remain outside the Builder scope.

## 18.2 Deployment rollback boundary

Rollback, merge, publication, or production branch deletion requires explicit owner authorization.

---

# 19. Drift handling before production begins

The current main SHA in this plan is a planning baseline, not a permanent production base.

Before Builder edits:

1. fetch current `main`;
2. compare current `index.html`, `ru/index.html`, Header include/data/JS, Footer include, and Contact pages against this plan's baseline;
3. determine whether new commits changed the Homepage or shared contracts;
4. if only unrelated docs/content changed, proceed from the new main and record the new SHA;
5. if Homepage, Header, Footer, Contact, routes, or shared assets changed materially, stop and update this plan or obtain a narrow planning correction before coding.

Never copy an obsolete branch or snapshot over the new `main`.

---

# 20. Owner authorization gates

## Gate A — Plan review

Current required next step:

```text
independent review of this implementation plan
```

No code.

## Gate B — Builder authorization

After plan `ACCEPT`, the owner must explicitly authorize:

- production branch creation from current `main`;
- five-file Builder scope;
- commits and push;
- no PR or merge yet unless separately stated.

## Gate C — Production review

After Builder completion:

- independent review;
- targeted corrections when necessary;
- no merge before `ACCEPT`.

## Gate D — Final QA and publication

Before merge/deployment:

- final current-main comparison;
- generated build;
- browser/device QA;
- owner visual review;
- explicit merge/publication authorization.

---

# 21. Implementation-plan acceptance criteria

This plan may receive `ACCEPT` only if the Reviewer confirms:

- it is grounded in actual current `main`;
- it correctly identifies the wrapper/snapshot architecture;
- it provides a safer explicit EN/RU source architecture;
- the proposed five-file scope is sufficient and minimal;
- Header, Footer, Contact, routes, metadata, and old snapshots are protected;
- no page-specific JavaScript is required for initial implementation;
- exact CTA query mapping is compatible with the accepted Contact allowlist;
- asset reuse is exact and truthful;
- all ten blocks and section surfaces are preserved;
- proof taxonomy is protected;
- EN/RU and required responsive modes are covered;
- accessibility and rollback requirements are deterministic;
- production starts only from the then-current `main` after explicit owner authorization.

Allowed verdicts:

- `ACCEPT`;
- `TARGETED CORRECTION`;
- `REJECT`.

Until `ACCEPT` and explicit owner authorization, do not begin production implementation.