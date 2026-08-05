# Homepage V2 Concept A Selected Specification — Independent Review Report

**Status:** independent selected-specification review complete  
**Verdict:** `TARGETED CORRECTION`  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Branch:** `agent/homepage-v2-concept-a-spec`  
**Reviewed branch head:** `bc78963032c80148a0bbf4c933b7a5cb715ca219`  
**Current main SHA during review:** `7bcc09ae28388f8e4a5e6e5a715aa5ba7b3fbf50`  
**Reviewed selected-specification blob:** `c830148e2c685c42094870631c43f4d19ed21d33`  
**Review role:** Control / Independent Reviewer

---

# 1. Executive verdict

The selected specification is substantially faithful to **Concept A — Precision Grid** and correctly protects the accepted Homepage V2 architecture, proof hierarchy, EN/RU model, responsive requirements, accessibility intent, motion limits, and production boundary.

Both accepted Concept A SVGs were retrieved from their exact blobs, rendered as complete pages, and visually inspected at their native root dimensions. Enlarged checks covered:

- Hero;
- Connected Business Journey;
- Financial Stream;
- Ways to Start;
- Selected Work statuses and disclosures;
- final Private Review;
- full-page desktop/mobile rhythm.

The document succeeds in converting the concept from a visual comparison artifact into a serious future implementation contract. In particular, it correctly hardens several intentionally conceptual aspects of the SVGs:

- full accepted RU copy must remain intact;
- localized text must expand in normal flow;
- the 390 px and 320 px versions may rewrap rather than reproduce hard-coded SVG line breaks;
- proof statuses and disclosures must be materially larger than the small conceptual SVG typography;
- motion is optional rather than necessary;
- the Hero tableau is supplementary and cannot imply a real product dashboard.

No conflict was found with:

- the accepted ten-block order;
- Financial Stream flagship priority;
- Alina Horb and Local Repair Pro proof taxonomy;
- locked Header, Footer and Contact boundaries;
- the static/Jekyll production direction;
- the rule **Signal, not spectacle**;
- the prohibition on premature production work.

However, two deterministic defects remain before the specification can be accepted as the source for implementation planning:

1. the specification defines surface tokens but does not assign section-surface ownership across the ten blocks, leaving the full-page Concept A rhythm open to arbitrary implementation;
2. the single `#24313D` border/rule token is assigned both to subtle structural rules and interactive component boundaries, although its contrast against the three dark surfaces is only approximately `1.31:1–1.51:1`; the specification therefore does not yet guarantee adequate non-text contrast for secondary buttons, controls and focus-related boundaries.

A related accessibility hardening is also required: long proof statuses on mobile must have a mandatory `12px` minimum rather than a merely preferred `12px` value above an allowed `11px` minimum.

These are narrow specification defects. They do not require redesigning Concept A, changing content, modifying SVGs, reopening the visual-concept decision, or starting production.

**Final verdict: `TARGETED CORRECTION`.**

---

# 2. Reviewed branch, scope and artifacts

## 2.1 Branch verification

The supplied head and branch ref were confirmed identical before review:

```text
branch: agent/homepage-v2-concept-a-spec
supplied head: bc78963032c80148a0bbf4c933b7a5cb715ca219
status: identical
ahead: 0
behind: 0
```

The branch is three commits ahead of the accepted visual-review commit:

```text
base: 2fd5be4d3b5097cc2683424f88a185f7b76ec965
head: bc78963032c80148a0bbf4c933b7a5cb715ca219
ahead: 3
behind: 0
```

Before this report write, its changed-file scope consisted only of:

```text
docs/site-evolution/homepage-v2-concept-a-spec/00_READ_ME.md
docs/site-evolution/homepage-v2-concept-a-spec/01_CONCEPT_A_SELECTED_SPECIFICATION.md
docs/site-evolution/homepage-v2-concept-a-spec/02_CONCEPT_A_SPEC_REVIEW_TASK.md
```

No production file was present in the branch delta.

## 2.2 Reviewed selected specification

```text
path:
docs/site-evolution/homepage-v2-concept-a-spec/01_CONCEPT_A_SELECTED_SPECIFICATION.md

blob:
c830148e2c685c42094870631c43f4d19ed21d33
```

The supplied blob matches the actual file blob at the reviewed head.

## 2.3 Reviewed Concept A SVGs

```text
docs/site-evolution/homepage-v2-visual-concepts/concepts/concept-a-precision-grid-1440.svg
blob: ede0c12db438e3985a36f8f447383dfd0e4eadcc
root: 1440 × 6532

docs/site-evolution/homepage-v2-visual-concepts/concepts/concept-a-precision-grid-390.svg
blob: c8f5a69944c44046d6684b0a685f4a7b61d33407
root: 390 × 8068
```

## 2.4 Visual inspection method

The exact SVG blob contents were:

1. retrieved through the GitHub connector;
2. written locally without changing repository files;
3. rendered to PNG at native SVG dimensions;
4. inspected as complete full-page documents;
5. inspected again through enlarged crops for Hero, Financial Stream, Selected Work and final conversion areas.

The visual source was treated as direction rather than production geometry, as required by the task.

---

# 3. Authority and scope findings

**Result: PASS.**

The specification records the correct authority chain:

1. Homepage V2 Strategy;
2. accepted Content Architecture V1.1;
3. accepted low-fidelity system;
4. accepted visual-concept review;
5. owner selection of Concept A.

It correctly preserves the exact ten-block order:

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

The document does not authorize:

- a third service direction;
- pricing tiers;
- an extra Homepage block;
- a competing local Header or Footer;
- Contact-contract changes;
- route or metadata changes;
- new proof claims;
- production code.

The current wrapper/snapshot Homepage architecture is correctly identified as a later implementation-planning concern rather than decided inside this specification.

---

# 4. Concept A fidelity findings

**Result: PASS, subject to the section-surface correction in Section 12.**

## 4.1 Core identity

The specification faithfully retains the selected Concept A identity:

- graphite page field;
- strong white typography;
- restrained cyan signal;
- deep blue only as secondary support;
- precise section numbering and rules;
- moderate radii;
- evidence-first composition;
- technical grid used atmospherically;
- linear full-page reading rhythm;
- limited depth rather than glassmorphism.

## 4.2 Signal, not spectacle

**PASS.**

The rule is consistently enforced through explicit prohibitions on:

- continuous animation;
- oversized neon glow;
- glass layers on every card;
- rotating rings and particles;
- cursor-following effects;
- default parallax;
- floating 3D AI objects;
- decorative stock AI imagery;
- Concept C mint/violet saturation;
- full-page pill-card styling.

The specification correctly states that no motion is required for Concept A to succeed.

## 4.3 Generic-template protection

**PASS.**

The document provides effective boundaries against:

- generic SaaS dashboards;
- developer-tool component repetition;
- generic premium consulting minimalism;
- crypto/startup gradients;
- product-plan semantics;
- spectacle-driven sci-fi.

It permits only Concept B principles that strengthen Concept A without merging identities: calm spacing, proof clarity and editorial restraint.

---

# 5. Design-token findings

**Result: PARTIAL PASS — TARGETED CORRECTION REQUIRED.**

## 5.1 Color and surface tokens

The selected palette is correctly and consistently defined:

```text
page background              #06080B
primary section surface      #0E1319
raised/card surface          #131B23
strong inner field           #06080B
border/rule                   #24313D
primary text                  #F5F8FB
muted text                    #91A2B3
primary cyan signal           #66E3FF
deep blue support             #0A8DFF
```

The major text combinations are robust:

- primary text remains highly legible on all three dark surfaces;
- muted text remains above normal body-text contrast expectations on all three surfaces;
- cyan remains highly legible as status/action text;
- dark text on the cyan primary button remains strongly legible.

## 5.2 Missing section-surface ownership

**FAIL — blocking deterministic defect.**

The specification defines the surface palette and limits the number of depth levels, but it does not assign the base surface rhythm to each of the ten Homepage blocks.

The rendered Concept A source has a deliberate alternating full-page rhythm:

```text
Hero                         page background + restrained Hero atmosphere
Connected Business Journey   primary section surface
Two Core Directions           page background
Financial Stream              primary section surface
Ways to Start                 page background
Controlled Delivery           primary section surface
Founder accountability        page background
Selected Work                 primary section surface
Insights                      page background
Final Private Review          primary section surface
Footer                        locked external Footer system
```

Without this map, a later Builder could legitimately interpret the current document as allowing:

- every section on one continuous dark surface;
- arbitrary surface alternation;
- raised-card treatment across every section;
- insufficient distinction between Financial Stream and ordinary sections;
- a generic component-library rhythm rather than the accepted full-page Concept A rhythm.

This is not a request to freeze SVG coordinates. It is a requirement to lock semantic section-surface ownership while allowing responsive layout recomposition.

## 5.3 Border and rule token

**FAIL — blocking accessibility/token defect.**

The same token, `#24313D`, is currently used for:

- decorative section rules;
- card outlines;
- secondary-button boundaries;
- potential interactive component boundaries.

Measured contrast of `#24313D` against the selected surfaces is approximately:

```text
against #06080B   1.51:1
against #0E1319   1.40:1
against #131B23   1.31:1
```

This is appropriate for restrained atmospheric or decorative rules, but it is not sufficient as a universal token when a border is required to identify an interactive control or visible focus-related boundary.

The specification must separate:

1. a subtle structural `rule/border` role;
2. a control-boundary role that satisfies non-text contrast requirements on its actual surface;
3. a focus-visible role that remains distinguishable from both the component and adjacent background.

The correction does not need to introduce a new brand color. It may use the existing white/cyan/graphite family, but the role and minimum contrast requirement must become deterministic.

## 5.4 Radius, grid and depth

**PASS.**

The defined radii preserve Concept A and explicitly reject the 24px+ product-card language associated with Concept C.

The grid opacity target is consistent with the effective subtle grid visible in the rendered source. Grid removal or simplification on mobile is permitted without losing identity.

## 5.5 Typography

**PARTIAL PASS.**

The document gives sufficient planning ranges for:

- Hero display type;
- section headings;
- card headings;
- body text;
- disclosures;
- line height;
- Cyrillic-aware letter spacing;
- natural EN/RU line differences.

The specification correctly treats the SVG's tiny labels as conceptual rather than production-ready.

One adjustment is required:

```text
proof-status minimum on mobile: 12px mandatory
```

The current contract allows `11px` and only prefers `12px` for long Cyrillic status labels. The exact Alina Horb and Local Repair Pro statuses are long, essential evidence classifications. Their `12px` minimum should be mandatory. The `11px` minimum may remain available for short section numbers or non-critical compact metadata.

Disclosures at `14px` mobile and `13px` desktop with line height at least `1.5` are acceptable.

---

# 6. Section-by-section findings

The role, commercial hierarchy and responsive intent of all ten blocks are correctly preserved.

| Block | Result | Finding |
|---|---|---|
| Hero | PASS | Correct two-column desktop model, full RU mobile order, early CTA, supplementary tableau and anti-spectacle limits |
| Connected Business Journey | PASS | Exactly three friction fields, four steps and one conclusion; no motion-dependent meaning |
| Two Core Directions | PASS | Only the two accepted directions; no pricing or feature-plan semantics |
| Financial Stream | PASS | Correct flagship scale, screenshot dominance, live-client status, evidence panel and bounded claims |
| Ways to Start | PASS | Exactly three situations, deterministic `1 / 1 / 2` service-link counts and non-pricing presentation |
| Controlled Delivery | PASS | Correct five stages, responsive recomposition and no essential carousel |
| Founder accountability | PASS | Founder remains accountable but subordinate to proof and process |
| Selected Work | PASS | Distinct image, name, status, disclosure and action zones for both projects |
| Insights | PASS | Remains useful but subordinate to proof and conversion |
| Final Private Review | PASS | One bounded next step, no new offer, locked Footer follows |

The only full-page system deficiency is the missing section-surface ownership map described in Section 5.2.

---

# 7. Desktop and mobile visual-source findings

## 7.1 Desktop 1440

**PASS as visual direction.**

The rendered desktop page confirms:

- strong Hero typography and immediate primary CTA;
- restrained system tableau rather than a product screenshot;
- clear Connected Journey geometry;
- Financial Stream as the largest proof object;
- editorial Ways-to-Start rows;
- readable five-column delivery sequence;
- founder section subordinate to commercial proof;
- clear Selected Work proof classes;
- Insights subordinate to conversion;
- decisive final CTA.

The specification preserves these relationships without freezing exact SVG coordinates.

## 7.2 Mobile 390

**PASS as visual direction; production hardening correctly required.**

The rendered mobile source remains recognisably Concept A through:

- graphite surfaces;
- cyan signal;
- section numbering;
- restrained cards;
- full-page alternating rhythm;
- proof-first stacking.

The rendered source also demonstrates why it must not be copied literally:

- its 44px hard-coded RU H1 line breaks are extremely tight and can visually reach or cross the right boundary under fallback rendering;
- source status type is only `8.5px`;
- source disclosure type is only `10px`;
- several action labels remain conceptual rather than final localized controls.

The specification correctly overrides these source limitations through natural wrapping, normal-flow expansion, larger typography, early CTA requirements and exact localized content authority.

## 7.3 Mobile 320

**PASS at specification level, subject to the mandatory 12px proof-status correction.**

The document explicitly protects:

- natural H1 wrapping;
- no word breaks inside statuses;
- no clipped CTA labels;
- minimum gutters;
- no fixed-height localized copy;
- no micro-text used to preserve desktop composition.

## 7.4 Short landscape approximately 844 × 390

**PASS.**

The specification protects:

- Header usability;
- primary CTA visibility and reachability;
- normal vertical scrolling;
- no viewport-filling Hero requirement;
- no section overlap;
- no horizontal poster layout;
- Header-system ownership of compact navigation.

---

# 8. EN/RU resilience findings

**Result: PASS, subject to the proof-status minimum correction.**

The specification correctly states that:

- the full accepted RU Hero is authoritative;
- RU copy may consume more vertical space;
- EN and RU need matching hierarchy, not matching line counts;
- CTA widths must accommodate localized labels;
- text regions expand in normal flow;
- fixed-height localized text fields are prohibited;
- statuses may use title case or reduced tracking where uppercase harms readability;
- 390, 320 and short-landscape modes are mandatory validation points.

No mechanical translation requirement or line-for-line parity rule was introduced.

The exact status wording remains protected.

---

# 9. Proof, status and disclosure findings

**Result: PASS, subject to the 12px mobile proof-status minimum.**

## 9.1 Financial Stream

Correctly classified as the real-client flagship proof.

The specification preserves:

- exact live-client status role;
- screenshot-first evidence;
- visible claim boundaries;
- case and live-site actions;
- no invented rankings, leads, revenue, conversion or ROI implication;
- greater visual weight than Selected Work.

## 9.2 Alina Horb

The exact RU status is preserved:

```text
Действующий проект, связанный с основателем · UA/RU
```

The required adjacent disclosure correctly states that the project is founder-connected and is not independent client validation.

## 9.3 Local Repair Pro

The exact RU status is preserved:

```text
Концепция сайта · Рабочее демо · В разработке
```

The required adjacent disclosure correctly states that it is not a paid client, not an operating repair company and not evidence of real customer outcomes.

## 9.4 Evidence classification

The specification correctly prohibits:

- color-only evidence classes;
- hidden caveats;
- hover-only disclosure;
- tooltip-only disclosure;
- modal-only disclosure;
- equal client-logo-wall treatment.

---

# 10. Accessibility, focus, touch and motion findings

**Result: PARTIAL PASS — TARGETED CORRECTION REQUIRED FOR CONTROL CONTRAST.**

## Passed protections

The specification adequately protects:

- semantic heading order;
- keyboard access;
- visible focus intent;
- `44 × 44 CSS px` minimum interactive targets;
- no essential color-only meaning;
- image alternatives;
- decorative-graphic exclusion from assistive reading order;
- text selection;
- zoom and reflow;
- skip-link and Header preservation;
- no hover-dependent meaning;
- `prefers-reduced-motion` support;
- forced-colors resilience as a required check.

## Motion

**PASS.**

Motion is explicitly optional and subordinate. Durations are bounded, and continuous animation, parallax and cursor-following effects are prohibited by default.

## Required correction

The control-state contract must distinguish subtle structural rules from interactive boundaries and define, at minimum:

- primary default;
- primary hover;
- primary active;
- primary focus-visible;
- secondary default;
- secondary hover;
- secondary active;
- secondary focus-visible;
- disabled only when a genuine disabled state exists.

The specification must state numeric acceptance thresholds for implementation planning:

```text
normal text contrast: minimum 4.5:1
large text contrast: minimum 3:1
essential UI/control boundary contrast: minimum 3:1
focus indicator contrast against adjacent colors: minimum 3:1
```

Focus must remain visible when a component or parent uses rounded corners or overflow clipping.

This correction strengthens accessibility without changing Concept A's visual identity.

---

# 11. Production-boundary findings

**Result: PASS.**

The document strongly and repeatedly prevents premature implementation.

It correctly states that acceptance would authorize only a separate implementation-planning task, which must first determine:

- current-main SHA;
- actual Homepage wrapper/snapshot architecture;
- exact future file scope;
- content/data ownership;
- Header/Footer/Contact preservation;
- image-derivative plan;
- responsive and accessibility test matrix;
- rollback strategy;
- Builder/Reviewer branch plan;
- explicit owner authorization gate for code.

The specification does not authorize:

- YAML;
- HTML;
- CSS;
- JavaScript;
- image publication;
- new dependencies;
- WebGL or canvas;
- Header/Footer redesign;
- production branch;
- production PR;
- deployment.

The warning not to copy an obsolete Homepage branch over current `main` is appropriate and should remain unchanged.

---

# 12. Exact required correction scope

Only the following file may be corrected:

```text
docs/site-evolution/homepage-v2-concept-a-spec/01_CONCEPT_A_SELECTED_SPECIFICATION.md
```

## Correction 1 — Add deterministic section-surface ownership

Add a section-to-surface table that preserves the accepted Concept A full-page rhythm:

```text
Hero                         page background + restrained Hero atmosphere
Connected Business Journey   primary section surface
Two Core Directions           page background
Financial Stream              primary section surface
Ways to Start                 page background
Controlled Delivery           primary section surface
Founder accountability        page background
Selected Work                 primary section surface
Insights                      page background
Final Private Review          primary section surface
Footer                        locked external Footer system
```

Also state:

- normal cards use the raised/card surface;
- screenshot and evidence inner fields may use the strong inner-field token;
- responsive recomposition may change layout but not erase the semantic surface rhythm;
- any deviation requires a separately reviewed accessibility or browser-test reason.

## Correction 2 — Separate structural rules from interactive control boundaries

Retain `#24313D` for subtle structural rules and non-essential card separation where appropriate.

Add a separate deterministic control/focus role that:

- meets required non-text contrast on its actual surrounding surface;
- does not rely on glow;
- remains within the selected white/cyan/graphite identity;
- defines primary and secondary default, hover, active and focus-visible behavior;
- preserves `44 × 44 CSS px` touch targets;
- remains visible in forced-colors and high-contrast modes.

Do not choose a Concept B or Concept C palette.

## Correction 3 — Make proof-status mobile typography mandatory

Change the contract so that:

```text
mobile proof-status minimum: 12px
```

The `11px` minimum may remain only for short section numbers or non-critical compact metadata.

Keep:

- disclosures at minimum `14px` on mobile;
- normal-flow wrapping;
- exact proof-status text;
- title-case permission when uppercase harms Cyrillic readability.

## What must remain unchanged

Do not change:

- selected Concept A direction;
- color palette except for adding a role that satisfies control contrast;
- accepted ten-block order;
- Content Architecture;
- accepted copy;
- proof taxonomy;
- Financial Stream priority;
- EN/RU routes or localization model;
- Header, Footer or Contact boundaries;
- motion limits;
- production prohibition;
- either Concept A SVG;
- low-fidelity maps;
- any production file.

---

# 13. Remaining defects

The only blocking defects are the three bounded items in Section 12:

1. missing section-surface ownership map;
2. insufficient separation of decorative rule and interactive control-boundary tokens/states;
3. non-mandatory `12px` mobile minimum for essential proof statuses.

No further strategy, architecture, copy, proof, visual-concept, responsive-mode or production-boundary correction is required.

---

# 14. Exact next authorized step

The next authorized step is a narrow Builder correction on the same branch:

```text
agent/homepage-v2-concept-a-spec
```

The Builder may change only:

```text
docs/site-evolution/homepage-v2-concept-a-spec/01_CONCEPT_A_SELECTED_SPECIFICATION.md
```

After that correction, conduct a focused independent correction review that checks only:

1. section-surface ownership across all ten blocks;
2. structural-rule versus interactive-control contrast roles;
3. primary/secondary interaction-state contract;
4. mandatory `12px` mobile proof-status minimum;
5. unchanged authority, content, proof and production boundaries;
6. exact changed-file scope.

Until a focused review returns `ACCEPT`, do not begin implementation planning, production code, image production, a production branch or a production PR.

---

# 15. Files changed during this review

Only this report was created during the independent review:

```text
docs/site-evolution/homepage-v2-concept-a-spec/03_CONCEPT_A_SPEC_REVIEW_REPORT.md
```

Not changed:

- `00_READ_ME.md`;
- `01_CONCEPT_A_SELECTED_SPECIFICATION.md`;
- `02_CONCEPT_A_SPEC_REVIEW_TASK.md`;
- either Concept A SVG;
- Content Architecture;
- low-fidelity maps;
- Strategy;
- Homepage;
- Contact;
- Header;
- Footer;
- YAML;
- HTML;
- CSS;
- JavaScript;
- assets;
- routes;
- workflows;
- production files.

Independent Homepage V2 Concept A selected-specification review complete. No production files were changed.