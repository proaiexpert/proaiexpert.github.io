# Homepage V2 Concept A Selected Specification — Final Correction Review Report

**Status:** focused independent correction review complete  
**Verdict:** `ACCEPT`  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Branch:** `agent/homepage-v2-concept-a-spec`  
**Reviewed branch head:** `070580b734293ec7891be5af30e57dd0291eacb8`  
**Corrected specification blob:** `18b707b61ed9290ade4f3faca5162477e2772f05`  
**Original review report blob:** `0c1080521b561db8d6be6e508183b2c301421b2d`  
**Correction-review task blob:** `e96c7564603b78b4f4b9e65b2d9ca1e1fcb95283`  
**Review role:** Control / Independent Reviewer

---

# 1. Executive verdict

The three blocking defects from the original `TARGETED CORRECTION` report were reviewed against the exact corrected specification blob and are fully resolved.

Final results:

1. every one of the ten Homepage blocks now has an explicit, mandatory base-surface owner and permitted internal depth;
2. the subtle structural rule, interactive control boundary, and focus-visible roles are separated deterministically, with a minimum `3:1` non-text contrast requirement for control-identifying boundaries;
3. essential mobile proof statuses now have a mandatory `12px` minimum, while `11px` is restricted to short section numbers and non-essential compact metadata; disclosures remain minimum `14px` on mobile.

The corrections preserve Concept A — Precision Grid, the accepted ten-block order, proof taxonomy, EN/RU resilience, accessibility intent, Header/Footer/Contact boundaries, motion limits, and the rule **Signal, not spectacle**.

No remaining blocking defect was found.

**Final verdict: `ACCEPT`.**

This acceptance authorizes the corrected selected specification to become the authority for a separate implementation-planning task. It does not authorize Homepage YAML, HTML, CSS, JavaScript, images, assets, a production branch, a production PR, deployment, or changes to Header, Footer, Contact, Content Architecture, low-fidelity maps, or Concept SVGs.

---

# 2. Reviewed scope and artifacts

## Branch verification

The supplied branch head and branch ref were confirmed identical before this review:

```text
branch: agent/homepage-v2-concept-a-spec
supplied head: 070580b734293ec7891be5af30e57dd0291eacb8
status: identical
ahead: 0
behind: 0
```

## Corrected specification

```text
path:
docs/site-evolution/homepage-v2-concept-a-spec/01_CONCEPT_A_SELECTED_SPECIFICATION.md

blob:
18b707b61ed9290ade4f3faca5162477e2772f05
```

The supplied blob matches the actual file blob at the reviewed head.

## Original review source

```text
path:
docs/site-evolution/homepage-v2-concept-a-spec/03_CONCEPT_A_SPEC_REVIEW_REPORT.md

blob:
0c1080521b561db8d6be6e508183b2c301421b2d
```

## Focused correction task

```text
path:
docs/site-evolution/homepage-v2-concept-a-spec/04_CONCEPT_A_SPEC_CORRECTION_REVIEW_TASK.md

blob:
e96c7564603b78b4f4b9e65b2d9ca1e1fcb95283
```

## Correction-cycle scope

Compared with the original review commit `78abab43e2667d9ad4aa063f66cb5c19dc5cd462`, the pre-review branch head contains only:

```text
docs/site-evolution/homepage-v2-concept-a-spec/01_CONCEPT_A_SELECTED_SPECIFICATION.md
docs/site-evolution/homepage-v2-concept-a-spec/04_CONCEPT_A_SPEC_CORRECTION_REVIEW_TASK.md
docs/site-evolution/homepage-v2-concept-a-spec/05_CONCEPT_A_SPEC_FINAL_REVIEW_REPORT.md
```

No production file is present in the correction-cycle delta.

---

# 3. Section-surface ownership finding

**Result: PASS.**

The corrected specification now assigns a mandatory base surface to every Homepage block:

| Block | Required base surface |
|---|---|
| 1. Hero | `page background #06080B` plus restrained Hero atmosphere |
| 2. Connected Business Journey | `primary section surface #0E1319` |
| 3. Two Core Directions | `page background #06080B` |
| 4. Financial Stream | `primary section surface #0E1319` |
| 5. Ways to Start | `page background #06080B` |
| 6. Controlled Delivery | `primary section surface #0E1319` |
| 7. Founder accountability | `page background #06080B` |
| 8. Selected Work | `primary section surface #0E1319` |
| 9. Insights | `page background #06080B` |
| 10. Final Private Review | `primary section surface #0E1319` |
| Locked Footer | owned by the existing global Footer system |

The map is complete and unambiguous.

It also defines permitted internal depth for every block, including:

- `raised/card surface #131B23` for semantic cards and proof fields;
- `strong inner field #06080B` for screenshot/image inner fields where appropriate;
- no additional full-width surface band inside Final Private Review;
- no replacement of ordinary block backgrounds with raised-card surfaces.

The specification explicitly prevents:

- placing all ten blocks on one uninterrupted surface;
- inventing a different alternation order;
- turning every block into a raised-card field;
- allowing responsive layout changes to erase semantic surface ownership.

Financial Stream remains the strongest proof through scale, composition, screenshot prominence, and evidence density rather than surface color alone.

Responsive recomposition remains permitted, but the section-surface ownership is locked on desktop and mobile.

Correction 1 is fully resolved.

---

# 4. Structural rule, interactive boundary, and focus finding

**Result: PASS.**

The corrected token system separates three roles:

```text
structural border/rule             #24313D
interactive control boundary       #66788C
primary focus signal               #66E3FF
```

## Structural role

`#24313D` is now restricted to subtle structural and decorative use:

- section dividers;
- atmospheric grid geometry;
- non-essential card outlines;
- low-contrast separation where the component remains identifiable without the border.

The specification explicitly prohibits `#24313D` from being:

- the sole visible boundary of an interactive control;
- the sole focus indicator;
- the only carrier of selection, status, or control meaning.

## Interactive control-boundary role

`#66788C` is defined as the default control-boundary token on the selected dark surfaces.

The contract requires:

- minimum `3:1` non-text contrast against the actual adjacent surface when an outline identifies a control;
- visible boundaries for secondary buttons and other outlined controls;
- distinguishable default, hover, active, and disabled states where applicable;
- no substitution of the low-contrast structural token merely for visual quietness;
- no conflicting Concept B or Concept C palette.

The existing primary cyan button may use its fill silhouette as its boundary only when that fill has sufficient non-text contrast against its adjacent surface.

## Focus-visible role

Focus is defined separately from default control borders:

- minimum `2px` cyan outline on dark surfaces, with separation or offset;
- light outer outline plus dark separation, or an equivalently verified treatment, on cyan-filled controls;
- visibility against both the component and surrounding surface;
- preservation at `200%` zoom;
- native system focus colors and outlines retained in forced-colors mode;
- no suppression of system focus behavior.

The secondary-button component grammar now explicitly requires the interactive control boundary rather than the structural token. The `44 × 44 CSS px` minimum touch target remains intact.

Correction 2 is fully resolved.

---

# 5. Mobile proof-status minimum finding

**Result: PASS.**

The typography contract now separates non-essential compact metadata from essential proof classifications.

## Non-essential compact metadata

```text
minimum mobile: 11px
```

This value is permitted only for:

- short section numbers;
- non-essential compact metadata labels.

It is explicitly prohibited for:

- proof classification;
- project status;
- disclosures;
- control labels;
- essential action text.

## Essential proof statuses

```text
minimum mobile: 12px mandatory
line height: 1.4–1.55
```

The contract explicitly applies the mandatory `12px` mobile minimum to:

- Financial Stream;
- Alina Horb;
- Local Repair Pro.

It applies at:

- `390px`;
- `360px`;
- `320px`;
- short-landscape compact modes.

When a status is long, the specification requires:

- natural wrapping;
- additional lines;
- reduced tracking where necessary;
- title case when uppercase harms Cyrillic readability.

It prohibits:

- reducing essential proof text below `12px`;
- breaking words;
- clipping;
- fixed-height concealment;
- interaction-dependent classification;
- hiding the status behind hover, disclosure controls, or other interaction.

## Disclosures

The disclosure contract remains:

```text
minimum mobile: 14px
minimum desktop: 13px
line height: minimum 1.5
```

Correction 3 is fully resolved.

---

# 6. Collateral-boundary finding

**Result: PASS.**

The corrections do not reopen or alter:

- Concept A selection;
- the accepted ten-block order;
- accepted Homepage copy;
- proof taxonomy or exact project statuses;
- Financial Stream flagship priority;
- Alina Horb founder-connected boundary;
- Local Repair Pro concept/demo boundary;
- EN/RU localization model;
- Header, Footer, and Contact ownership;
- Content Architecture;
- low-fidelity maps;
- Concept A SVGs;
- motion limits;
- **Signal, not spectacle**;
- generic SaaS, consulting-template, crypto/startup, and excessive sci-fi protections;
- the prohibition on premature production work.

The new `#66788C` role remains inside the selected white/cyan/graphite identity and does not merge Concept A with Concept B or Concept C.

The correction does not demand production selectors or browser implementation at this specification gate.

No implementation planning, YAML, HTML, CSS, JavaScript, image, asset, production-branch, production-PR, or deployment authorization was introduced.

---

# 7. Remaining defects

**None.**

All three blocking findings from the original report are closed:

```text
section-surface ownership: PASS
structural/control/focus role separation and 3:1 requirement: PASS
mandatory 12px mobile proof-status minimum: PASS
```

No further selected-specification correction is required before implementation planning.

---

# 8. Exact next authorized step

The corrected Concept A selected specification is accepted.

The next permitted stage is a separate **Homepage V2 implementation-planning task**.

That task may analyze and document:

1. the actual current `main` SHA;
2. the current Homepage wrapper/snapshot architecture;
3. the minimum safe proposed implementation file scope;
4. EN/RU content and data ownership;
5. Header, Footer, Contact, metadata, canonical, and hreflang preservation;
6. image derivative and crop requirements;
7. the responsive test matrix, including `1440`, `390`, `320`, and approximately `844 × 390`;
8. accessibility, focus, non-text contrast, touch-target, reduced-motion, and forced-colors checks;
9. build, browser, rollback, Builder, and independent Reviewer gates;
10. the explicit owner authorization required before production code begins.

Still not authorized by this `ACCEPT` report:

- Homepage YAML;
- Homepage HTML;
- CSS;
- JavaScript;
- images or production assets;
- Header, Footer, Contact, route, or workflow changes;
- a production implementation branch;
- a production PR;
- deployment.

---

# 9. Changed-file confirmation

Only this file was changed during the focused independent correction review:

```text
docs/site-evolution/homepage-v2-concept-a-spec/05_CONCEPT_A_SPEC_FINAL_REVIEW_REPORT.md
```

Not changed during this review:

- `00_READ_ME.md`;
- `01_CONCEPT_A_SELECTED_SPECIFICATION.md`;
- `02_CONCEPT_A_SPEC_REVIEW_TASK.md`;
- `03_CONCEPT_A_SPEC_REVIEW_REPORT.md`;
- `04_CONCEPT_A_SPEC_CORRECTION_REVIEW_TASK.md`;
- either Concept A SVG;
- Content Architecture;
- low-fidelity maps;
- Homepage;
- Contact;
- Header;
- Footer;
- YAML;
- HTML;
- CSS;
- JavaScript;
- images;
- assets;
- routes;
- workflows;
- production files.

Focused Homepage V2 Concept A selected-specification correction review complete. No production files were changed.
