# Homepage V2 Full-Page Visual Concepts — Independent Comparison Task

**Status:** ready for independent review  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Branch:** `agent/homepage-v2-visual-concepts`  
**Required output:** `docs/site-evolution/homepage-v2-visual-concepts/03_VISUAL_CONCEPT_REVIEW_REPORT.md`

---

# 1. ROLE

Act as **Control / Independent Visual Reviewer**.

You are reviewing three visual directions, not implementing a Homepage and not redesigning the accepted content architecture.

---

# 2. REQUIRED READ ORDER

1. `docs/site-evolution/homepage-v2-content-review/04_CONTENT_ARCHITECTURE_FINAL_REVIEW_REPORT.md`
2. `docs/site-evolution/homepage-v2-low-fidelity/05_LOW_FIDELITY_FINAL_REVIEW_REPORT.md`
3. `docs/site-evolution/homepage-v2-visual-concepts/00_READ_ME.md`
4. `docs/site-evolution/homepage-v2-visual-concepts/01_VISUAL_CONCEPT_COMPARISON.md`
5. all six SVG concept files.

---

# 3. REQUIRED VISUAL INSPECTION

Inspect each SVG as an actual rendered full-page document, not only as source text.

## Concept A

- `concepts/concept-a-precision-grid-1440.svg`
- `concepts/concept-a-precision-grid-390.svg`

## Concept B

- `concepts/concept-b-executive-signal-1440.svg`
- `concepts/concept-b-executive-signal-390.svg`

## Concept C

- `concepts/concept-c-luminous-systems-1440.svg`
- `concepts/concept-c-luminous-systems-390.svg`

Review full pages and enlarged fragments for:

- Hero;
- Connected Journey;
- Financial Stream;
- Ways to Start;
- Selected Work;
- final CTA;
- mobile RU Hero and proof disclosures.

---

# 4. REVIEW QUESTIONS

For every concept, determine:

1. Does it preserve all ten blocks and the accepted commercial hierarchy?
2. Does Financial Stream remain the strongest visible proof?
3. Does the visual language feel like a premium accountable studio rather than a generic template?
4. Does it communicate AI and automation capability without undermining service-business trust?
5. Are status and disclosure fields visually distinct?
6. Does Ways to Start avoid pricing-card semantics?
7. Is the Hero powerful without overwhelming the first action?
8. Does the mobile version remain the same design system?
9. Is EN/RU expansion viable?
10. Is the concept realistically maintainable in static production code?

---

# 5. COMPARATIVE DECISION

Rank all three concepts.

State:

- strongest overall concept;
- strongest trust and credibility concept;
- strongest AI/technology differentiation concept;
- highest-risk concept;
- whether the provisional recommendation of Concept A is supported;
- whether a limited hybrid is justified.

Do not select a hybrid merely to avoid making a decision. A hybrid is valid only when its elements can be described precisely and do not destroy the selected concept's coherence.

---

# 6. ALLOWED VERDICTS

Use exactly one:

- `ACCEPT — CONCEPT A`
- `ACCEPT — CONCEPT B`
- `ACCEPT — CONCEPT C`
- `TARGETED CORRECTION`
- `REJECT`

`ACCEPT — CONCEPT X` means the concept is strong enough to proceed to owner selection and a selected-concept specification. It does not authorize production.

`TARGETED CORRECTION` requires exact defects and exact file scope.

---

# 7. WRITE BOUNDARY

Change only:

`docs/site-evolution/homepage-v2-visual-concepts/03_VISUAL_CONCEPT_REVIEW_REPORT.md`

Do not change:

- any SVG;
- Content Architecture;
- low-fidelity maps;
- Strategy;
- Header or Footer;
- Homepage or Contact;
- YAML, HTML, CSS, or JavaScript;
- images or routes;
- production files.

Do not create a production PR.

---

# 8. REPORT REQUIREMENTS

The report must include:

1. reviewed branch head;
2. all six reviewed SVG blob SHAs;
3. verdict;
4. ranking;
5. concept-by-concept findings;
6. desktop/mobile coherence findings;
7. proof and disclosure findings;
8. visual-excess and generic-template risks;
9. owner-selection recommendation;
10. exact next authorized step;
11. changed-file confirmation.

After writing the report, provide the new commit SHA and stop.
