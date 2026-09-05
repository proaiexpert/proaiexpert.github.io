# Selected Work — Curated Evidence Table R1

Isolated review prototype for the ProAI Expert Homepage `Selected Work` block.

## Safety

- Review branch only: `review/homepage-selected-work-curated-evidence-r1`
- Base: production `main` at `e700a83f9565f1dbbe90be04cdf6aa0613465ec5`
- No production Homepage include/CSS/JS is modified.
- No merge or deploy is authorized by this prototype.
- Pages use `noindex,nofollow`.

## Routes

- EN: `/prototypes/homepage-selected-work-curated-evidence-r1/`
- RU: `/prototypes/homepage-selected-work-curated-evidence-r1/ru.html`

## Central composition

One proof environment, three evidence objects with deliberately different material roles:

1. **Financial Stream** — compact live intake/contact receipt using `assets/img/cases/financial-stream/delivery-v2/en/fs-en-02-request-v2-1120.webp`.
2. **Psychology Practice / Alina Horb** — portrait-led editorial proof using `assets/img/cases/alina-horb/final-assets-v1/delivery/alina-horb-about-approach-ua-desktop.webp`.
3. **Local Repair Pro** — broad Photo-to-Scope proof using `assets/img/cases/local-repair-pro/production-v1/lrp-02-photo-to-scope-1400.webp`, with `CONCEPT / DEMO` visible before the artifact.

The objects are unified by typography, spacing, status language and quiet interaction, not by identical card geometry.

## Responsive intent

- `>= 1180px`: one wide asymmetric proof field with independent object positions and aspect ratios.
- `760–1179px`: asymmetric 12-column recomposition; no carousel/tabs.
- `< 760px` portrait: project-specific proof moments with different widths, alignment and evidence proportions; no generic equal-card stack.
- phone landscape (`<= 960px`, height `<= 520px`): dedicated two-column low-height composition with reduced artifact heights.

## Interaction and accessibility

- Core content and status are always visible.
- Hover/focus only adds shallow optical image emphasis.
- Semantic `section` / `article` / headings / figures.
- Visible `:focus-visible` state.
- Status is textual, not color-only.
- Descriptive image alt text.
- No JS dependency.
- `prefers-reduced-motion: reduce` removes image transforms and transitions.
- `overflow-x: clip`, min-width safeguards and responsive layout rules are included to prevent horizontal overflow.

## Truth boundaries

- Financial Stream is labeled as a real live client and uses a compact operational interface fragment; no metrics or business outcomes are claimed here.
- Alina Horb is labeled as a live UA/RU project; the proof concerns personal/editorial trust and verified website structure, not treatment outcomes or commercial performance.
- Local Repair Pro is labeled primarily as `CONCEPT / DEMO`; the page explicitly disclaims client, job, lead and performance claims.
