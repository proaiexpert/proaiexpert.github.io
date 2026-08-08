# TASK — ProAI Expert Hero A+ — Production Integration

Date: 2026-08-08

## Role

Work as Senior Front-End Engineer + Creative Developer + Motion Designer + Production QA Engineer.

Repository:

`proaiexpert/proaiexpert.github.io`

## Goal

Integrate the **accepted C-SHAPE FLOW HERO A+** into the real production-context EN `/` and RU `/ru/` Homepage while preserving all downstream Homepage sections, shared systems, SEO invariants, accessibility and production behavior.

This is **Hero-only production integration**.

This is NOT a new Hero design.
This is NOT a Homepage redesign.
This is NOT permission to alter lower sections for taste or consistency.

The browser prototype has already passed:

`C-SHAPE HERO PROTOTYPE — ACCEPT`

## Start — read canonical sources first

Before editing, fetch latest refs and read:

1. `AI_START_HERE.md`
2. `AI_CURRENT_HANDOFF.md`
3. `docs/site-evolution/PROAI_EXPERT_HERO_TWO_DIRECTION_LOCK_2026-08-07.md`
4. `docs/site-evolution/PROAI_EXPERT_HERO_C_SHAPE_CANONICAL_REFERENCE_2026-08-07.md`
5. `docs/site-evolution/PROAI_EXPERT_HERO_C_SHAPE_BROWSER_PROTOTYPE_TASK_2026-08-08.md`
6. `docs/site-evolution/PROAI_EXPERT_HERO_C_SHAPE_PROTOTYPE_ACCEPT_2026-08-08.md`
7. `docs/HEADER_SYSTEM_SPEC.md`
8. `_includes/header-system/header.html`
9. `_data/header.yml`
10. `_data/navigation.yml`
11. `assets/css/header-system-v1.css`

Also inspect current production Homepage implementation at minimum:

- `index.html`
- `ru/index.html`
- `_includes/homepage-current-en.html`
- `_includes/homepage-current-ru.html`
- existing Homepage CSS/JS injected by EN/RU root wrappers
- current scroll-state Hero behavior
- current mobile Hero CTA hotfix
- current Header and footer integration

## Verified accepted prototype

Accepted branch:

`agent/hero-c-shape-a-plus-browser-prototype`

Accepted HEAD:

`7b2e7de26b5fc43fe5db68cd3ea51b4429edaeb5`

At acceptance verification the branch contained exactly eight isolated files:

- `assets/css/hero-c-shape-a-plus-qa-fixes.css`
- `assets/css/hero-c-shape-a-plus.css`
- `assets/img/hero-c-shape/ASSET_MANIFEST.md`
- `assets/img/hero-c-shape/core-static-master-isolated.avif`
- `assets/img/hero-c-shape/core-static-master-isolated.webp`
- `assets/js/hero-c-shape-a-plus.js`
- `hero-a-plus-c-shape-preview/index.html`
- `ru/hero-a-plus-c-shape-preview/index.html`

Use the accepted prototype as implementation source of truth.

Do **not** merge that branch blindly into production.
Port the accepted Hero deliberately into the latest current main so production context is preserved.

## Branching

1. Fetch latest `main` first. Do not assume a historical SHA.
2. Create a new dedicated branch from latest current main, suggested:

`agent/hero-c-shape-production-integration`

3. Bring in only the accepted assets/CSS/JS/markup required for the production Hero.
4. Do not modify `main` directly.
5. No merge, deploy or PR in this gate.

## Locked Hero content — EN

Eyebrow:

`AI SYSTEMS, AUTOMATION & PREMIUM WEBSITES FOR SERVICE BUSINESSES`

H1:

`Build trust.`
`Handle inquiries.`
`Reduce manual work.`

Supporting copy:

`ProAI Expert connects premium websites, practical automation, and human-reviewed AI so service businesses can explain their value clearly, capture useful context, and move each inquiry toward a controlled next step.`

Primary CTA:

`Request a Private Review`

Expectation:

`A private, bounded review. No pressure.`

Secondary CTA:

`View Client Work`

Accountability:

`Washington-based · Working across the U.S. · EN / RU / UA`

Semantic rail:

- `01 TRUST / PRESENCE`
- `02 INQUIRY`
- `03 RESPONSE`
- `04 FOLLOW-UP`

## RU

Use the **approved natural RU localization from the accepted prototype branch**. Do not mechanically translate EN and do not shorten copy for visual symmetry.

## Accepted Core assets — immutable

Use the accepted browser files from the prototype branch:

### WebP

`assets/img/hero-c-shape/core-static-master-isolated.webp`

- `900 × 760`
- `64,940 bytes`
- SHA-256 `cd97f2e0107ddb577ae1cdded84cfbcc91c66b4f42374d1f2f510b3c807ad2f2`

### AVIF

`assets/img/hero-c-shape/core-static-master-isolated.avif`

- `900 × 760`
- `48,100 bytes`
- SHA-256 `c6cc0ba89b7145bdbd796b7fd778e6c788133d3e278265947b7ce90793e458d8`

Do not regenerate, repaint, remask, substitute or approximate the Core unless production-context QA proves a deterministic technical defect. Any correction must remain non-generative and use the exact approved source.

## Real Header System

Production Homepage must continue to use the real shared Header System.

Do not recreate Header/logo/navigation inside Hero.
Do not hardcode screenshot navigation.
Do not change Header IA as part of this task.

Header CTA and Hero CTA remain intentionally distinct:

- Header: `Discuss Project`
- Hero: `Request a Private Review`

## Integration requirements

### 1. Replace only the old Hero system

The current production Homepage contains the older orbit / rotating cube / node-card Hero system and scroll transformations.

The integrated production Hero must not have old visual/behavioral Hero logic running behind or alongside the new C-shape Hero.

Narrowly remove, disable or isolate old Hero-only dependencies such as:

- rotating central old Core;
- orbit graphics;
- old Hero node cards;
- old Hero hover scene behavior;
- old scroll-state transforms/fades that would move, blur or disable the new Hero incorrectly;
- obsolete Hero-only mobile CTA hotfix if no longer needed.

Do not remove shared styles/scripts that downstream sections still require.

### 2. Preserve downstream Homepage exactly

Everything after Hero is out of design scope.

Preserve:

- current section ordering;
- commercial refinement sections;
- Financial Stream case section;
- process/delivery sections;
- founder proof;
- selected work;
- insights;
- footer;
- all existing links/content outside Hero.

Only touch downstream code when strictly necessary to prevent a regression caused by removal of old Hero behavior.

### 3. Preserve SEO / route invariants

Keep current production behavior for:

- canonical URLs;
- EN/RU hreflang;
- x-default;
- title/meta description unless the accepted Hero integration explicitly requires no change — default is no change;
- OG/Twitter metadata;
- sitemap behavior;
- root `/` and `/ru/` routes;
- skip links;
- Header locale links.

### 4. Hero-to-section-2 transition

This is a production-specific acceptance point.

The new Hero must end cleanly and hand off naturally to the existing second section.

Check:

- no sudden background/color seam;
- no excessive dead space;
- no visual collision with the next section;
- no old scroll animation fading the Hero while section 2 enters;
- no forced `100vh` behavior that creates awkward mobile or short-landscape gaps;
- no first-scroll snap/jump.

### 5. Motion — preserve accepted values

Use the accepted prototype behavior:

- assembly entrance: ~900–1200ms;
- one coherent Trust → Inquiry → Intelligence → Response → Follow-up signal;
- quiet ~16s ±1° idle;
- bounded pointer response;
- no permanent JS render loop;
- reduced-motion static premium state;
- no-JS complete static state.

Do not increase spectacle during production integration.

## Performance

Preserve the accepted performance architecture:

- AVIF preferred, WebP fallback;
- width/height reserved `900 × 760`;
- `fetchpriority="high"` for Core image;
- no WebGL/Three.js;
- no particle system;
- no large permanent blur animation;
- no avoidable CLS;
- no permanent RAF loop.

Do not duplicate-load accepted Core assets.

## Accessibility

Preserve:

- real selectable text;
- focus states;
- contrast;
- keyboard operation;
- reduced motion;
- forced-colors fallback;
- semantic route description without duplicate screen-reader noise;
- touch-complete behavior;
- no hover-only information.

## Required production-context QA

Run actual rendered browser QA after integration.

### EN

- 1440 desktop
- 390 portrait
- 320 portrait
- 844 × 390 short landscape

### RU

- 1440 desktop
- 390 portrait

### States

- default motion
- prefers-reduced-motion
- no-JS static
- maximum bounded pointer tilt

### Verify

- no horizontal overflow;
- CLS / layout shifts;
- first-scroll stability;
- Header scroll state;
- CTA clickability before and after scroll;
- CTA routes;
- EN/RU locale switch;
- Core loading/fallback;
- no raster rectangle/halo/cut edge;
- Hero-to-second-section transition;
- downstream section layout remains unchanged;
- footer remains unchanged;
- canonical/hreflang/meta remain correct.

## Diff discipline

Before declaring PASS, inspect the branch diff against current main.

Any changed production file must have an explicit Hero-integration reason.

Unexpected changes to lower Homepage content/design are a failure.

## Acceptance bar

PASS only if:

1. `/` and `/ru/` use the accepted C-shape Hero in real Homepage context.
2. Browser composition remains visually consistent with the accepted prototype.
3. Real shared Header System remains intact.
4. Old orbit/cube/node Hero cannot conflict with the new Hero.
5. Downstream Homepage sections remain intact.
6. No overflow or first-scroll jumps.
7. CLS remains acceptable; target `0` for the Hero integration states already achieved by prototype.
8. Primary CTA remains visible/clickable in critical mobile/landscape viewports.
9. Reduced-motion/no-JS states remain complete.
10. EN/RU routes and SEO invariants remain correct.
11. Hero transition into existing section 2 feels intentional and stable.
12. No redesign drift.

## Final verdict

Return exactly one:

`HERO PRODUCTION INTEGRATION — ACCEPT`

or

`TARGETED CORRECTION`

or

`REJECT`

`REJECT` does not authorize a third Hero concept.

## Completion return

Return:

- latest main SHA used as branch base;
- branch name;
- final HEAD SHA;
- exact changed files;
- explicit explanation for each production file changed;
- QA screenshots/results for all required viewports/states;
- Core asset verification;
- overflow/CLS/first-scroll findings;
- CTA route and locale-switch verification;
- Header verification;
- Hero-to-section-2 transition findings;
- confirmation downstream sections and SEO invariants remain intact;
- final verdict.

No merge.
No deploy.
No PR unless explicitly authorized later.
