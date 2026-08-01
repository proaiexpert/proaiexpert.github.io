# GEMINI STAGE 3 — ARTICLE PAGE BUILD

**Status:** GATED — DO NOT START YET

Stage 3 begins only after:

1. Stage 1 research is adjudicated;
2. Stage 2 creative candidates are reviewed;
3. final article bodies are explicitly approved;
4. final page blueprints are explicitly approved.

## Goal

Build two premium article-page systems serving four localized routes:

### Page system 1 — Multilingual website decision

- RU route;
- EN route.

### Page system 2 — Website proposal evaluation

- RU route;
- EN route.

The RU and EN pages may share a design system but must preserve independent content hierarchy and localized layout behavior.

## GitHub safety

Repository:

`proaiexpert/proaiexpert.github.io`

Create a new branch from the approved current base:

`article-pages-gemini-build-v1`

Do not work directly on:

- `main`;
- production;
- `portfolio-rebrand-v1`;
- `article-pairs-gemini-stage-v1`.

The pre-Gemini checkpoint must remain unchanged.

## Before building

Read:

- the current site handoff;
- existing article templates and shared components;
- approved final article bodies;
- approved pair QA;
- approved implementation handoffs;
- approved Stage 2 page blueprints;
- site typography, header, footer, language switcher, and responsive conventions.

## Art direction

Target:

- premium editorial authority;
- strong information hierarchy;
- distinctive decision tools;
- restrained motion;
- high mobile usability;
- clear evidence/source treatment;
- no dashboard imitation;
- no generic AI visual language.

## Required implementation qualities

- one H1 per page;
- localized title and description;
- self-canonical;
- reciprocal `hreflang`;
- explicit language switch;
- correct `lang` values;
- Article/BlogPosting schema following the existing site convention;
- responsive decision tools and tables;
- accessible table/card reading order;
- keyboard usability;
- visible focus states;
- reduced-motion support;
- no-JS content access;
- appropriate source-link treatment;
- approved CTA destination;
- related-content module without cannibalization.

## Table transformation

Do not rely on unreadable wide tables on mobile.

Choose per tool:

- semantic scrollable table;
- stacked comparison cards;
- expandable decision rows;
- step-based decision rail;
- downloadable checklist;
- print-friendly version.

Preserve the factual relationship among fields.

## Motion

Allowed:

- restrained section reveal;
- subtle progress or reading context;
- controlled framework emphasis;
- lightweight hover/focus feedback.

Not allowed:

- motion that delays reading;
- parallax-heavy presentation;
- continuous decorative animation;
- counters without real data;
- autoplay media;
- inaccessible interaction.

## Evidence and claims

Do not add:

- unsupported metrics;
- invented testimonials;
- implied legal review;
- guaranteed performance;
- Financial Stream performance evidence;
- unapproved case links.

## Required deliverables

1. Four implemented routes on the new branch.
2. Shared components and styles with minimal duplication.
3. Implementation manifest.
4. Source-link manifest.
5. Metadata/hreflang/canonical manifest.
6. Desktop and mobile screenshots for all four routes.
7. Accessibility and reduced-motion check.
8. No-JS check.
9. Diff summary.
10. Stop before merge or publication.

## Final gate

Do not merge, publish, or open a ready-for-review PR without explicit owner approval.
