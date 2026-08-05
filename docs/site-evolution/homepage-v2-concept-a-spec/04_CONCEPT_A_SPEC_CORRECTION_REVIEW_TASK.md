# Homepage V2 Concept A Selected Specification — Focused Correction Review Task

**Status:** ready for focused independent correction review  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Branch:** `agent/homepage-v2-concept-a-spec`  
**Corrected specification:** `docs/site-evolution/homepage-v2-concept-a-spec/01_CONCEPT_A_SELECTED_SPECIFICATION.md`  
**Corrected specification blob:** `18b707b61ed9290ade4f3faca5162477e2772f05`  
**Required output:** `docs/site-evolution/homepage-v2-concept-a-spec/05_CONCEPT_A_SPEC_FINAL_REVIEW_REPORT.md`

---

# 1. Role

Act as **Control / Independent Reviewer**.

This is a narrow correction review, not a new visual-concept review, not implementation planning, and not production work.

The accepted direction remains **Concept A — Precision Grid**.

---

# 2. Required read order

Read in this order:

1. `docs/site-evolution/homepage-v2-concept-a-spec/03_CONCEPT_A_SPEC_REVIEW_REPORT.md`;
2. `docs/site-evolution/homepage-v2-concept-a-spec/01_CONCEPT_A_SELECTED_SPECIFICATION.md`;
3. this focused task.

Use the accepted Concept A SVGs only as visual direction references:

```text
docs/site-evolution/homepage-v2-visual-concepts/concepts/concept-a-precision-grid-1440.svg
docs/site-evolution/homepage-v2-visual-concepts/concepts/concept-a-precision-grid-390.svg
```

Do not reopen the accepted concept-selection decision.

---

# 3. Review scope

Verify only the three blocking corrections from the original `TARGETED CORRECTION` report.

## 3.1 Section-surface ownership

Confirm that the corrected specification:

- assigns a required base surface to every one of the ten Homepage blocks;
- preserves this alternating full-page rhythm:
  1. Hero — page background;
  2. Connected Business Journey — primary section surface;
  3. Two Core Directions — page background;
  4. Financial Stream — primary section surface;
  5. Ways to Start — page background;
  6. Controlled Delivery — primary section surface;
  7. Founder accountability — page background;
  8. Selected Work — primary section surface;
  9. Insights — page background;
  10. Final Private Review — primary section surface;
- keeps the locked Footer outside Homepage surface ownership;
- defines permitted internal depth without turning every block into a raised-card field;
- preserves Financial Stream as the strongest proof;
- prevents arbitrary or fully uniform production surface assignment;
- allows responsive recomposition without changing semantic surface ownership.

## 3.2 Structural rule versus interactive boundary

Confirm that the corrected specification:

- keeps `#24313D` as a subtle structural/decorative rule token;
- prohibits `#24313D` as the sole visible boundary of an interactive control or focus state;
- defines `#66788C` as the default interactive control-boundary token;
- requires at least `3:1` non-text contrast against the actual adjacent surface when a boundary identifies a control;
- defines a distinct focus-visible role;
- protects focus on both dark surfaces and cyan-filled controls;
- preserves forced-colors system focus behavior;
- does not introduce a conflicting brand palette or excessive visual noise.

## 3.3 Mobile proof-status minimum

Confirm that the corrected specification:

- makes `12px` the mandatory mobile minimum for essential proof statuses and evidence classifications;
- applies that minimum to Financial Stream, Alina Horb, and Local Repair Pro;
- restricts `11px` mobile type to short section numbers and non-essential compact metadata;
- preserves minimum `14px` mobile disclosure text;
- permits natural wrapping, title case, reduced tracking, and additional lines instead of smaller type;
- prohibits word breaking, clipping, hidden status text, or interaction-dependent proof classification.

---

# 4. Collateral-boundary check

Confirm that the correction did not:

- change accepted Homepage copy;
- change the ten-block order;
- change proof taxonomy or exact statuses;
- change either Concept A SVG;
- merge Concept A with Concept B or C;
- authorize implementation planning before this review;
- authorize YAML, HTML, CSS, JavaScript, images, assets, production branch, production PR, deployment, Header, Footer, or Contact changes.

Do not demand production selectors or browser implementation from this specification gate.

---

# 5. Allowed verdicts

Use exactly one:

- `ACCEPT`;
- `TARGETED CORRECTION`;
- `REJECT`.

`ACCEPT` means the corrected specification may become the authority for a separate implementation-planning task. It still does not authorize production code.

`TARGETED CORRECTION` must identify the exact remaining defect and permit changes only to:

```text
docs/site-evolution/homepage-v2-concept-a-spec/01_CONCEPT_A_SELECTED_SPECIFICATION.md
```

`REJECT` requires a material conflict with Concept A, accepted architecture, proof taxonomy, accessibility, or the production boundary.

---

# 6. Write boundary

Create and fill only:

```text
docs/site-evolution/homepage-v2-concept-a-spec/05_CONCEPT_A_SPEC_FINAL_REVIEW_REPORT.md
```

Do not change:

- `00_READ_ME.md`;
- `01_CONCEPT_A_SELECTED_SPECIFICATION.md`;
- `02_CONCEPT_A_SPEC_REVIEW_TASK.md`;
- `03_CONCEPT_A_SPEC_REVIEW_REPORT.md`;
- this correction-review task;
- Concept A SVGs;
- Content Architecture;
- low-fidelity maps;
- Homepage, Contact, Header, Footer;
- YAML, HTML, CSS, JavaScript;
- images, assets, routes, workflows, or production files.

Do not create a production branch or PR.

---

# 7. Required report contents

The final report must include:

1. reviewed branch head;
2. corrected specification blob SHA;
3. verdict;
4. section-surface ownership finding;
5. structural/control/focus boundary finding;
6. mobile proof-status finding;
7. collateral-boundary finding;
8. remaining defects, if any;
9. exact next authorized step;
10. confirmation that only the final report was changed.

After saving the report, provide the new commit SHA and stop.
