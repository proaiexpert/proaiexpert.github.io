# ProAI Expert — Inner-Site Design System R0

Status: **DESIGN / IMPLEMENTATION CONTRACT — NOT PRODUCTION CODE**  
Base: `c945084e1952c05c686494091f7dbca0f7acdf08`  
Date: 2026-08-21

## 1. System thesis

The inner site should read as **restrained editorial engineering**.

Shared brand authority comes from:

- canonical Header System;
- local Inter variable typography;
- precise grid and spacing;
- material-first surfaces;
- proof/status/source discipline;
- semantic motion;
- low-friction CTA behavior;
- a calmer inner Footer derivative;
- EN/RU editorial parity;
- mobile-native composition.

The system does **not** require all pages to share the same hero geometry, background, signature interaction or chapter order.

## 2. Typography

Use existing local assets:

- `assets/fonts/inter-variable-latin.woff2`
- `assets/fonts/inter-variable-cyrillic.woff2`

Do not add a new display font in R1 unless browser prototypes prove Inter cannot carry the required distinction.

### Weight roles

- Display: 760–860 variable range.
- Section headings: 700–820.
- Lead: 450–550.
- Body: 400–500.
- Labels / controls: 600–720.

### Fluid scale targets

| Role | Desktop target | Mobile target | Notes |
|---|---|---|---|
| Hero H1 | `clamp(3rem, 5.4vw, 5.75rem)` | ~38–52px rendered | Never crop essential words |
| H2 | `clamp(2.25rem, 4vw, 4.25rem)` | ~30–40px | Use chapter contrast, not every section |
| H3 | `clamp(1.5rem, 2vw, 2rem)` | ~23–30px | Avoid heading inflation |
| Lead | 18–22px / 1.5–1.6 | 18–20px | Max ~60ch |
| Body | 16–18px / 1.6–1.7 | 16–18px | Max ~62–72ch |
| Micro / source | 11–13px / 1.4–1.55 | 12–13px where essential | Never use tiny type to solve layout |

### Typography rules

- Negative tracking only on large display sizes.
- Use tabular numerals for data/metrics.
- Do not default to monospace for “technology.”
- EN/RU line breaks may differ intentionally.
- Do not force RU to fit an EN measure by shrinking type.
- Maintain semantic heading order independent of visual size.

## 3. Grid and widths

### Grid

- Desktop ≥1200: 12 columns.
- Tablet 768–1199: 8 columns.
- Mobile <768: 4 columns.

### Shells

- Core inner shell max: ~1440px.
- Wide media / proof can extend intentionally toward ~1600px where the composition needs it.
- Longform text measure: generally 680–780px depending language and role.

### Gutters

- Desktop: 40–56px.
- Tablet: 28–36px.
- Mobile: 20px.
- 320px small mobile: 16px where required.

## 4. Section rhythm

Target vertical rhythm ranges:

- Desktop major chapter: 120–176px.
- Tablet: 88–120px.
- Mobile: 72–96px.

Not every section gets the same top/bottom padding. Chapter importance should be visible in space.

A page should alternate:

`dense explanation → open proof/material moment → structured decision chapter → calm conclusion`

rather than:

`card grid → card grid → card grid → CTA card`.

## 5. Surface / material rules

### Shared base

- Obsidian: `#020304`, `#050607`, `#090B0E`, `#0E1217`, `#171C22`
- Graphite: `#242A31`
- Gunmetal: `#2B323A`
- Black Chrome: `#181D23`
- Pearl: `#F2F0EB`
- Silver: `#C9CDD1`
- Machine accent family: `#676BFF`, `#5B50FF`, `#9BA8FF`

### AI Systems material role

- Darker/cooler.
- Graphite + gunmetal + blued-steel optical behavior.
- Indigo/violet machine accent is a **state signal**, not a background gradient.
- Pearl reserved for high-priority text/proof surfaces.

### Websites & Branding material role

- More light editorial space than AI Systems.
- Pearl/silver editorial planes + obsidian/black-chrome framing.
- Restrained bronze/champagne optical edge can be explored only as material interference, not a warm gradient theme.
- Shared indigo may appear only where a common control/state language is needed.

### Material restrictions

No:

- rainbow gradients;
- purple AI glow;
- cyan fog as atmosphere everywhere;
- glassmorphism walls;
- crypto color behavior;
- particle fields;
- fake brushed metal textures applied indiscriminately.

## 6. Border / rule / radius system

Use borders as architecture, not decoration.

- Primary structural rule: 1px low-alpha silver/white.
- Strong state rule: 1px controlled accent.
- Suggested radii: 0 / 8 / 16px; occasional 24px only for a materially justified object.
- Do not default every group to 24–30px rounded panels.
- Large editorial planes may be square or minimally softened.

## 7. Microtype

Use microtype for:

- chapter index;
- source;
- status;
- date;
- system state;
- locale/context.

Do not use microtype to hide important explanatory content.

Default style should favor readable sans labels over “technical” monospace decoration.

## 8. CTA hierarchy

### Primary

- One dominant page action.
- 44–52px minimum control height.
- Strong contrast: pearl-on-dark or obsidian-on-pearl depending surface.
- Contextual labels are preferred over generic `Get Started`.

Examples:

- AI Systems: `Discuss the system`.
- Websites & Branding: `Discuss your website`.
- Contact: submit inquiry / continue conversation.

### Secondary

- Proof/deeper-understanding route.
- Lower visual weight; text link or restrained outline.

### Tertiary

- Contextual inline links.

### CTA cadence

Do not place a full CTA module after every chapter. The service page should generally have:

1. opening action;
2. contextually relevant proof/deeper link;
3. one final action before the inner Footer.

The Footer must not create an almost-identical second “final CTA” immediately after a page CTA.

## 9. Link behavior

- Text links must be visibly identifiable without relying only on color.
- Hover can change rule/opacity/position by 1–2px; no aggressive magnetic behavior by default.
- Focus style must be visible and not removed.
- External links get clear context when relevant.

## 10. Motion durations / easing

### Timing

- Micro UI: 180–320ms.
- Content reveal: 500–800ms.
- Major service-page signature assembly: 900–1200ms.
- No indefinite presentation loop required.

### Easing family

Default expressive easing:

`cubic-bezier(0.16, 1, 0.3, 1)`

Default interface easing:

`cubic-bezier(0.2, 0, 0, 1)` or browser-native equivalent.

Do not introduce five unrelated easing families.

## 11. Scroll reveal rules

Default chapter reveal:

- opacity from ~0.001 to 1;
- translate Y 6–12px maximum;
- no heavy blur as the default;
- stagger only when content sequence matters;
- reveal once unless state interaction requires replay.

No section should be inaccessible if IntersectionObserver or JS fails.

## 12. Hover / pointer

- Fine-pointer enhancements only under `(hover: hover) and (pointer: fine)`.
- Pointer parallax maximum should normally stay ~2–3px / ~1–2deg and only where meaningfully connected to material/state.
- Essential content cannot depend on hover.
- No magnetic CTA as a global gimmick.

## 13. Reduced motion

`prefers-reduced-motion: reduce` must:

- remove long transforms/interpolation;
- stop decorative/idle animations;
- preserve final semantic states;
- retain accessible focus/state feedback;
- never hide content.

## 14. Image / media treatment

- Prefer real project artifacts, screenshots, documents and purpose-built diagrams.
- No stock people, AI brains, robots, holograms or laptop-wallpaper mockups.
- Avoid generic device frames when the screen itself is the evidence.
- Responsive `<picture>` where appropriate.
- Preserve natural aspect ratio for proof screenshots.
- Lazy-load noncritical media.
- Captions/source/status remain attached to evidence.

## 15. Case-study media

Each evidence object may carry:

- project/status label;
- artifact title;
- capture/source date when meaningful;
- explanatory caption;
- limitation or context where needed;
- full-size link for evidence screenshots.

Do not crop metric/report screenshots in ways that remove selected periods, dates, labels or graphs.

## 16. Tables

Desktop:

- semantic `<table>` where comparison is genuinely two-dimensional;
- proper `<th scope>` and captions where useful;
- high row legibility.

Mobile:

- use labeled row groups if matrix comparison does not require horizontal relationship;
- otherwise allow deliberate horizontal scroll with clear affordance;
- never shrink text below usable size to keep the desktop table shape.

## 17. Data / metrics

Metrics must include:

- label;
- value;
- source;
- period/date;
- limitation when interpretation can be overstated.

Use tabular numerals. Do not animate numbers merely for spectacle.

## 18. Testimonials

Only use verified testimonial wording with confirmed attribution.

Required context when available:

- name;
- role;
- organization;
- relationship/project context.

Do not create anonymous “client love” quote theater.

## 19. Source / citation treatment

### Case studies

Use compact evidence/source bands adjacent to proof.

### Insights

Use readable inline source markers/links and a source/reference section appropriate to the article methodology.

Sources should feel editorial, not like legal fine print.

## 20. Forms

- Visible labels; placeholders are not labels.
- Clear required/optional indication.
- Inline error and success states.
- Honeypot/anti-spam fields must be truly non-confusing to users and assistive tech.
- Keyboard-complete.
- No forced account.
- No giant intake questionnaire by default.
- No public calendar as the default primary action.

## 21. Mobile spacing

- Minimum horizontal page gutter: 20px, with 16px allowed at 320px.
- Minimum control target: 44×44px.
- Avoid full-height sections whose content clips on short devices.
- Copy should appear in editorial chunks separated by headings/proof, not one long wall.

## 22. Landscape mobile

Explicit QA at short-height widths such as 740×360, 844×390 and 932×430.

Rules:

- Header must not consume excessive vertical space.
- No viewport-locked hero that traps content below the fold.
- Avoid sticky/pinned chapters on short heights unless the interaction is fully bypassed.
- Media can move below copy or simplify.

## 23. Accessibility

Minimum release requirements:

- semantic heading sequence;
- keyboard access;
- visible focus;
- AA contrast for text/controls;
- meaningful alt text for informative images;
- decorative media hidden from accessibility tree;
- accessible tables/forms;
- no color-only state;
- reduced-motion support;
- 44px touch targets;
- no horizontal overflow at 320px;
- no content available only through hover;
- core content usable without JavaScript.

## 24. Performance budget — service page targets

These are **forward targets**, not claims about the measured current production baseline.

- HTML + critical/primary page CSS: target ≤160KB gzip.
- Initial JS: target ≤80KB gzip; preferred <50KB where signature interaction allows.
- Above-fold compressed image/media payload: target ≤350KB.
- No required above-fold autoplay video.
- Initial transferred route before lazy content: target ≤1.2MB desktop and ≤900KB mobile.
- LCP: target ≤2.5s at p75 field conditions.
- CLS: target <0.10.
- INP: target <200ms.
- No third-party visual runtime unless a later prototype proves essential value.

## 25. Header integration

Use the canonical Header System on rebuilt commercial pages. Do not copy page-local header markup into new R1 prototypes.

Preserve:

- nav content/order;
- locale behavior;
- active state;
- live logo with static fallback;
- reduced motion;
- responsive geometry.

Header redesign is out of scope.

## 26. Footer strategy — decision

**Choose B: restrained inner-page derivative using the same brand and utility logic.**

Reason:

- Homepage Footer R2 is a signature composition with a damped material interaction.
- Exact repetition on every service/case/article page would overuse one homepage signature and compete with page-specific choreography.
- Inner pages still need the same contact/capability/social/locale/legal utility structure and premium brand resolution.

### Inner derivative target

- Same brand family / utility logic.
- Reduced large-wordmark scale compared with Homepage Footer where page length already creates substantial visual weight.
- Silver/pearl material can appear as a static or one-time settled state.
- No pointer ripple/material chase by default.
- One clear final CTA, coordinated with the page's own final action to avoid duplication.
- Homepage Footer R2 files remain untouched.

## 27. Implementation ownership for later waves

Prefer:

- `assets/css/inner-site-tokens-r1.css` or equivalent small shared token layer;
- page-family CSS such as service/case/insights rather than one global monolith;
- explicit JS per signature interaction;
- canonical shared Header;
- shared locale/data includes where they remove factual duplication;
- existing Jekyll architecture unless evidence proves a framework migration is necessary.

Avoid:

- giant inline page CSS;
- global `section` selectors with cross-family effects;
- copied service-page files;
- uncontrolled third-party animation/runtime dependencies;
- Liquid string replacement hacks.

## 28. Quality gate

A page fails the inner-site system if any of the following is true:

- it could be reproduced from a generic agency template in a day;
- its signature idea is unrelated to the service meaning;
- the mobile version is just desktop stacked;
- proof is weaker than self-description;
- motion continues after it has communicated its state;
- EN/RU quality diverges materially;
- the page reintroduces legacy header decisions;
- it makes the homepage less unique by copying its signature mechanics.
