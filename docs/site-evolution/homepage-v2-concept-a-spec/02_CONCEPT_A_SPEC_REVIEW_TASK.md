# Homepage V2 Concept A Selected Specification — Independent Review Task

**Status:** ready for independent review  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Branch:** `agent/homepage-v2-concept-a-spec`  
**Required output:** `docs/site-evolution/homepage-v2-concept-a-spec/03_CONCEPT_A_SPEC_REVIEW_REPORT.md`

---

# 1. Role

Act as **Control / Independent Reviewer**.

Review the selected visual-system specification and future implementation contract for **Concept A — Precision Grid**.

Do not implement the Homepage, redesign the concept, or broaden the accepted architecture.

---

# 2. Required read order

Read in this order:

1. `AI_START_HERE.md`;
2. `AGENTS.md`;
3. `AI_CURRENT_HANDOFF.md`;
4. `README.md`;
5. `docs/site-evolution/homepage-v2-content-review/04_CONTENT_ARCHITECTURE_FINAL_REVIEW_REPORT.md`;
6. `docs/site-evolution/homepage-v2-low-fidelity/05_LOW_FIDELITY_FINAL_REVIEW_REPORT.md`;
7. `docs/site-evolution/homepage-v2-visual-concepts/01_VISUAL_CONCEPT_COMPARISON.md`;
8. `docs/site-evolution/homepage-v2-visual-concepts/03_VISUAL_CONCEPT_REVIEW_REPORT.md`;
9. `docs/site-evolution/homepage-v2-concept-a-spec/00_READ_ME.md`;
10. `docs/site-evolution/homepage-v2-concept-a-spec/01_CONCEPT_A_SELECTED_SPECIFICATION.md`.

Also inspect the actual branch metadata and exact blobs.

---

# 3. Required visual source check

Use the accepted Concept A SVGs as the visual source of truth for direction, not as production geometry:

```text
docs/site-evolution/homepage-v2-visual-concepts/concepts/concept-a-precision-grid-1440.svg
docs/site-evolution/homepage-v2-visual-concepts/concepts/concept-a-precision-grid-390.svg
```

Review them as rendered full pages and compare the specification against:

- Hero;
- Connected Business Journey;
- Two Core Directions;
- Financial Stream;
- Ways to Start;
- Controlled Delivery;
- Founder accountability;
- Selected Work;
- Insights;
- final Private Review;
- desktop/mobile visual coherence.

The specification may harden accessibility and responsive rules beyond the small conceptual type shown in the SVGs. That is not concept drift when it protects readability and accepted content.

---

# 4. Review questions

## 4.1 Authority and scope

Determine whether the specification:

- correctly records Concept A owner selection;
- preserves Strategy and accepted Content Architecture;
- preserves the exact ten-block order;
- preserves the accepted proof hierarchy;
- respects locked Header, Footer, Contact, routes, and production boundaries;
- avoids authorizing production prematurely.

## 4.2 Visual-system fidelity

Determine whether the specification faithfully converts Concept A through:

- graphite surface hierarchy;
- strong white typography;
- restrained cyan signal;
- precise section numbering and rules;
- moderate radii;
- evidence-first composition;
- technical grid atmosphere;
- “signal, not spectacle” limits.

Identify any rule that would accidentally convert the system into:

- generic SaaS/dashboard styling;
- generic consulting-template styling;
- crypto/startup styling;
- excessive sci-fi spectacle;
- a hybrid that weakens Concept A.

## 4.3 Token determinism

Check whether the document gives sufficient implementation-planning guidance for:

- color tokens;
- surface levels;
- borders and rules;
- radii;
- shadows;
- grid/glow intensity;
- typography scales;
- label and disclosure minimums;
- container widths and gutters;
- spacing and responsive checkpoints;
- component grammar;
- focus states;
- motion boundaries.

Do not require production code or selectors.

## 4.4 EN/RU resilience

Check that:

- full RU Hero remains authoritative;
- EN/RU may wrap differently without changing meaning;
- localized fields expand in normal flow;
- 390, 320, and approximately 844 × 390 are explicitly protected;
- status and disclosure minimum sizes are adequate;
- no fixed-height localized text dependency is authorized.

## 4.5 Proof and disclosure

Check exact handling of:

- Financial Stream as real client flagship proof;
- Alina Horb as founder-connected proof;
- Local Repair Pro as concept/demo in development;
- exact RU statuses;
- adjacent visible disclosures;
- no color-only evidence classification;
- no hidden caveats;
- no invented metrics or implied outcomes.

## 4.6 Section-level fidelity

For every one of the ten blocks, determine whether the specification:

- preserves role and commercial hierarchy;
- gives enough layout guidance without freezing SVG coordinates;
- protects mobile behavior;
- avoids pricing-card or product-dashboard semantics;
- remains realistic for later static/Jekyll implementation.

## 4.7 Accessibility and motion

Check whether the specification adequately protects:

- contrast;
- keyboard use;
- visible focus;
- touch targets;
- semantic headings;
- image alternatives;
- reduced motion;
- forced colors;
- zoom/reflow;
- no hover-dependent meaning.

Check that motion remains optional and subordinate.

## 4.8 Production architecture boundary

Check whether the specification correctly identifies current Homepage wrapper/snapshot architecture as a future implementation-planning concern without deciding or modifying it now.

The selected specification must not authorize:

- YAML;
- HTML;
- CSS;
- JavaScript;
- images;
- Header/Footer/Contact changes;
- production branch or PR.

---

# 5. Required comparative decision

State clearly:

1. whether the specification is faithful to Concept A;
2. whether it is deterministic enough for implementation planning;
3. whether any rule is over-prescriptive or under-specified;
4. whether EN/RU and responsive protection is sufficient;
5. whether proof and disclosure rules are production-safe;
6. whether the anti-drift boundaries are sufficient;
7. whether the next stage may be implementation planning.

---

# 6. Allowed verdicts

Use exactly one:

- `ACCEPT`;
- `TARGETED CORRECTION`;
- `REJECT`.

`ACCEPT` means the specification may become the source for a separate implementation-planning task. It does not authorize production code.

`TARGETED CORRECTION` must name:

- exact defect;
- exact section;
- exact permitted file scope;
- what must remain unchanged.

`REJECT` requires a material conflict with the accepted concept, architecture, proof system, or production safety boundary.

---

# 7. Write boundary

Create and fill only:

```text
docs/site-evolution/homepage-v2-concept-a-spec/03_CONCEPT_A_SPEC_REVIEW_REPORT.md
```

Do not change:

- `00_READ_ME.md`;
- `01_CONCEPT_A_SELECTED_SPECIFICATION.md`;
- this review task;
- any Concept SVG;
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
- assets, routes, workflows, or production files.

Do not create a production PR.

---

# 8. Report requirements

The report must include:

1. reviewed branch head;
2. selected-specification blob SHA;
3. Concept A SVG blob SHAs;
4. verdict;
5. authority/scope findings;
6. token-system findings;
7. section-by-section findings;
8. EN/RU and responsive findings;
9. proof/status/disclosure findings;
10. accessibility and motion findings;
11. production-boundary findings;
12. remaining defects, if any;
13. exact next authorized step;
14. changed-file confirmation.

After saving the report, provide the new commit SHA and stop.
