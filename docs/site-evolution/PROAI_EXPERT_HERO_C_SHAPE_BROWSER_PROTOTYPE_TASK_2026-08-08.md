# ProAI Expert — C-Shape Hero A+ Browser Prototype Task

**Status:** NEXT EXECUTION GATE / LOCKED  
**Date:** 2026-08-08  
**Scope:** Homepage Hero only  
**Repository:** `proaiexpert/proaiexpert.github.io`

## Goal

Build one high-fidelity browser Hero prototype that translates the approved C-shape static direction into a real, responsive, accessible, premium web Hero. This is the next gate after static art-direction approval.

Do not redesign the concept. Do not create another Hero visual family.

## Repository operating rules

1. Re-fetch current `main` before work; do not trust stale SHAs.
2. Create a dedicated branch from current `main`: `agent/hero-c-shape-a-plus-browser-prototype`.
3. Do not modify `main` directly beyond documentation maintenance already authorized.
4. No PR, merge, deployment, or production-root replacement in this gate.
5. Do not touch Financial Stream or unrelated Homepage sections.
6. Build an isolated preview route/files so current production remains untouched.

## Mandatory reading order

1. `AI_START_HERE.md`
2. `AI_CURRENT_HANDOFF.md`
3. `docs/site-evolution/PROAI_EXPERT_HERO_TWO_DIRECTION_LOCK_2026-08-07.md`
4. `docs/site-evolution/PROAI_EXPERT_HERO_C_SHAPE_CANONICAL_REFERENCE_2026-08-07.md`
5. `docs/HEADER_SYSTEM_SPEC.md`
6. `_includes/header-system/header.html`
7. `_data/header.yml`
8. `_data/navigation.yml`
9. `assets/css/header-system-v1.css`
10. approved V2 Hero source on `agent/homepage-v2-concept-a-build` for copy/content only.

## Visual references — two roles

### Immutable concept reference

File Library / original upload:

- filename: `C83206F2-E0BA-4F5D-B25E-560272E03FCD.jpeg`
- conversation file ID: `file_000000009c0081fbb265448f043495e2`
- dimensions: `1536 × 864`
- SHA-256: `8d2576338c54f49660bd6e15f9b1864013016367e4f0c438c4ae7e8389a5423a`

This protects the C-shape geometry and flow idea from concept drift.

### Current static master / composition target

File Library / latest approved candidate:

- filename: `FA5872D6-EA1E-4865-A94B-74CE5CFDB7F8.jpeg`
- conversation file ID: `file_00000000fc1081fb890127d2826fa1f8`
- dimensions: `1536 × 1024`
- file size: `334,949 bytes`
- SHA-256: `c2cecdc255eb3c0d68de142dcbddba6e8cedf1f3f036b9f9ec62c562ef66d9e4`

Use this latest candidate for final composition, material balance, scale and atmosphere. It is the STATIC MASTER for the browser prototype.

If the File Library lookup is required, search the exact filename and verify dimensions/hash before use. Do not substitute another generated image.

## Locked commercial content

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

Expectation microcopy:

`A private, bounded review. No pressure.`

Secondary CTA:

`View Client Work`

Accountability:

`Washington-based · Working across the U.S. · EN / RU / UA`

Hero semantic route:

1. `TRUST / PRESENCE`
2. `INQUIRY`
3. internal Intelligence / AI / automation inside the Core
4. `RESPONSE`
5. `FOLLOW-UP`

Do not use studio-delivery labels such as Strategy & Discovery / Custom Build / Production Systems / Scale & Evolve in the Hero.

## Real Header System — do not fake it

Use the existing shared Header System from `main`, not screenshot text or recreated markup.

Canonical implementation:

- `_includes/header-system/header.html`
- `_data/header.yml`
- `_data/navigation.yml`
- `assets/css/header-system-v1.css`

Important existing facts:

- fixed header height: `85px`
- max shell: `1600px`
- horizontal pad: `40px`
- canonical cyan: `#5de2ff`
- background: `rgba(5, 5, 6, .82)` plus backdrop blur
- EN header CTA: `Discuss Project`
- EN locale control: `RU`
- brand is NOT a raster logo: it is the canonical rotating cyan wireframe cube plus uppercase wordmark `PROAI EXPERT`
- `PROAI` white, `EXPERT` cyan with restrained glow
- reuse the existing include/data/CSS; do not redraw or approximate the brand.

Navigation must come from `_data/navigation.yml`; do not hardcode a mockup navigation list.

## C-shape implementation strategy

Priority is visual fidelity to the STATIC MASTER, not ideological purity about implementation technique.

Do not regenerate or redesign the object.

Preferred strategy:

1. Derive a production visual asset from the approved static master using non-generative image processing only (lossless/high-quality crop, masking and web optimization). Do not use AI to redraw the Core.
2. Preserve the C-shape pixels/material/light as faithfully as practical.
3. Use HTML/CSS for copy, CTAs, header, accountability and semantic labels.
4. Use inline SVG for the semantic rail and controlled cyan signal path.
5. Use CSS transforms / opacity / SVG stroke animation / minimal vanilla JS for motion.
6. If a layered Core asset is needed, create layers by deterministic masking/cropping from the approved master rather than inventing new geometry.
7. No Three.js / WebGL unless a later explicit approval changes this. The default implementation should remain lightweight 2.5D.

Do not sacrifice the expensive photorealistic Core by replacing it with crude CSS polygons or a wireframe approximation.

## Desktop 1440 composition target

Treat the latest static master as the composition target, with only controlled browser corrections.

Guidelines:

- content shell approximately 1320–1360px inside viewport
- left information zone roughly 43–46%
- right visual zone roughly 54–57%
- maintain generous negative space
- the Core remains the single dominant signature visual
- H1 remains the primary commercial statement
- do not let rail push composition wider than viewport
- keep the Core slightly less dominant than the static screenshot if necessary for real browser breathing room; perceived mass may be reduced ~3–5%, not redesigned
- primary CTA must be visibly stronger than secondary without a flat cyan fill
- preserve quiet graphite/near-black atmosphere and restrained cyan.

## Typography / CTA behavior

- Use real HTML text; no baked-in generated typography for final browser prototype.
- H1 is clean white editorial typography; no gradients/glows/gimmicks.
- Supporting copy uses controlled muted-white contrast and refined measure/line-height.
- Primary CTA: graphite/near-black body, precise cyan perimeter or signal accent, white label, refined arrow.
- Secondary CTA: quieter text-link/button treatment.
- Header CTA remains `Discuss Project`; Hero CTA remains `Request a Private Review`. They serve different roles.

## Motion choreography — locked

### 1. Entrance assembly

On first load only:

- 2–3 visual Core layers begin approximately 8–12px equivalent out of final alignment
- settle into final position over roughly 900–1200ms
- slow physical easing
- no bounce
- no spin spectacle

### 2. Main signal sequence

One coherent cyan signal travels:

`TRUST / PRESENCE → INQUIRY → through internal Intelligence Layer → RESPONSE → FOLLOW-UP`

Requirements:

- one meaningful path, not four independent random pulses
- internal seam/intelligence luminance activates as signal passes through Core
- after sequence completes, system becomes quiet

### 3. Idle

- very slow yaw/visual depth equivalent approximately ±1–1.5°
- 14–18 second cycle
- extremely subtle cyan luminance breathing
- optional 1–3px relative depth among deterministic Core layers
- no continuous 360° rotation
- no bobbing
- no particle field

### 4. Pointer — desktop only

- maximum approximately ±2–3° controlled response
- subtle depth only
- no cursor-follow glow ball
- no tilt-card gimmick

### 5. Reduced motion / no-JS

Static state must look complete and premium.

`prefers-reduced-motion: reduce` must disable decorative transforms/signal travel and show the fully assembled static route.

No meaning or CTA availability may depend on JS.

## Responsive requirements

### 390px

Order:

1. eyebrow
2. H1
3. supporting copy
4. primary CTA
5. expectation microcopy
6. secondary CTA
7. accountability
8. visual

- primary CTA before visual
- Core visual approximately 250–280px high target, recomposed/cropped rather than tiny full desktop screenshot
- essential semantic route only; no unreadable microtype
- no horizontal overflow

### 320px

- preserve full content meaning
- Core approximately 210–230px high target
- fewer visual microdetails if necessary
- no tiny labels
- zero horizontal overflow

### 844×390 short landscape

- compact two-column target, approximately 54/46 copy/visual if viable
- primary CTA reachable in first viewport
- no forced 100vh if it causes clipping
- no microtype

RU must use natural approved localization and may reflow; do not shorten meaning merely for symmetry.

## Performance rules

- no large animated blur/backdrop-filter layers in Hero visual
- no permanent high-cost JS animation loop if CSS/SVG can perform idle motion
- no huge SVG blur filters
- reserve visual aspect ratio to prevent CLS
- avoid excessive `will-change`
- optimize derived Core assets as WebP/AVIF while preserving a lossless/reference source
- target smooth 60fps on modern desktop and stable mobile rendering

## Accessibility

- real text remains selectable/readable
- visible focus states
- adequate text/CTA contrast
- rail decoration should not create redundant screen-reader noise
- semantic labels may be real text where meaningful, otherwise decorative graphic with concise accessible equivalent
- touch interaction must not depend on hover
- reduced-motion support is mandatory
- forced-colors should remain usable

## Prototype file scope

Build only isolated Hero preview files on the prototype branch. Suggested route:

`/hero-a-plus-c-shape-preview/`

Suggested files:

- `hero-a-plus-c-shape-preview/index.html`
- `assets/css/hero-c-shape-a-plus.css`
- `assets/js/hero-c-shape-a-plus.js`
- `assets/img/hero-c-shape/` for deterministic derived visual assets

Reuse shared Header System rather than copying it.

Do not replace `/` or `/ru/` in this gate.

## QA / acceptance gate

Capture and inspect screenshots at minimum:

- EN 1440 desktop
- EN 390 mobile
- EN 320 mobile
- EN 844×390 short landscape
- RU 1440 desktop
- RU 390 mobile
- reduced-motion desktop/mobile

Pass conditions:

1. Browser Hero is recognizably the approved C-shape master, not a new interpretation.
2. Real Header System is used.
3. All copy is exact / localized correctly; no generated-text artifacts.
4. Core retains premium massing, materiality and flow.
5. Hero has one clear WOW focal object.
6. H1 and CTA hierarchy remain commercially dominant.
7. Signal animation explains the business journey instead of decorating it.
8. No server/datacenter/dashboard/gaming drift.
9. No horizontal overflow or first-scroll layout jump.
10. Reduced-motion static state is intentional and complete.
11. No regressions outside preview route/shared reused assets.
12. Static 1440 screenshot and browser prototype must be compared side-by-side with current production Hero.

Decision:

- if C-shape prototype clearly beats production, mark `C-SHAPE HERO PROTOTYPE — ACCEPT` and prepare a separate integration plan;
- if it does not clearly beat production, stop; do not invent a third concept. Activate the documented Current Production Hero A+ Refresh fallback.

## Completion return

Return one concise report containing:

- branch name and exact head SHA
- files changed/created
- exact preview route
- Core asset derivation method
- screenshot/QA results by viewport
- reduced-motion result
- performance notes
- known deviations from static master, if any
- explicit verdict: `ACCEPT`, `TARGETED CORRECTION`, or `REJECT`

Do not merge or deploy.