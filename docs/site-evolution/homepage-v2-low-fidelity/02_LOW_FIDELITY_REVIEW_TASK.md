# Homepage V2 Low-Fidelity Full-Page Map - Independent Review Task

**Status:** Ready for independent review  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Branch:** `agent/homepage-v2-low-fidelity-map`  
**Required output:** `docs/site-evolution/homepage-v2-low-fidelity/03_LOW_FIDELITY_REVIEW_REPORT.md`

---

## 1. Role

Act as **Control / Independent Reviewer** for the Homepage V2 low-fidelity full-page map.

Review the complete page journey and responsive composition. Do not create a competing strategy, rewrite the accepted Content Architecture, or begin visual design or production implementation.

---

## 2. Read order

1. `AI_START_HERE.md`
2. `AGENTS.md`
3. `AI_CURRENT_HANDOFF.md`
4. `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_CONTENT_ARCHITECTURE_V1.md`
5. `docs/site-evolution/homepage-v2-content-review/04_CONTENT_ARCHITECTURE_FINAL_REVIEW_REPORT.md`
6. `docs/site-evolution/homepage-v2-low-fidelity/00_READ_ME.md`
7. `docs/site-evolution/homepage-v2-low-fidelity/01_LOW_FIDELITY_FULL_PAGE_MAP.md`
8. all four SVG maps in `docs/site-evolution/homepage-v2-low-fidelity/maps/`

---

## 3. Maps to review

```text
maps/homepage-v2-low-fi-1440.svg
maps/homepage-v2-low-fi-390.svg
maps/homepage-v2-low-fi-320.svg
maps/homepage-v2-low-fi-844x390.svg
```

Review the SVGs as complete visual documents, not only their source text.

---

## 4. Required checks

### A. Ten-block architecture

Confirm that all ten blocks are present in the accepted order and no extra service block, pricing block, technology wall, or duplicate proof block was introduced.

### B. Commercial hierarchy

Confirm:

- Hero creates orientation and exposes the first action;
- Connected Journey carries the differentiating thesis;
- Financial Stream receives the strongest proof treatment;
- Ways to Start follows proof;
- Process and Founder reduce risk without interrupting the initial argument;
- Insights remain secondary;
- final conversion adds no new service pitch.

### C. Hero and RU expansion

Inspect the 390, 320, and 844 x 390 maps.

Determine whether the accepted RU eyebrow, H1, supporting copy, and CTA sequence is viable.

A shortening recommendation is valid only when the map demonstrates:

- excessive opening length;
- the eyebrow dominating the first screen;
- primary CTA arriving too late;
- or short-landscape failure.

Do not rewrite the Hero unless returning `TARGETED CORRECTION`; describe the exact content problem and the maximum correction scope.

### D. Responsive behavior

Confirm:

- no horizontal poster or scrolling dependency;
- four stacked journey steps on mobile;
- readable proof/status/disclosure at 320 px;
- no fixed-height copy containers;
- no viewport-filling or sticky requirement in short landscape;
- CTA controls remain practical;
- Header/Footer boundaries remain clear.

### E. Proof truthfulness

Confirm that map hierarchy does not visually imply:

- Alina as independent client validation;
- Local Repair Pro as a paid client or operating company;
- Financial Stream metrics or outcomes not present in the accepted content.

### F. Low-fidelity discipline

Confirm the maps do not prematurely approve:

- final typography;
- final colors;
- exact spacing;
- final photography;
- motion;
- components;
- production behavior.

---

## 5. Scope boundaries

You may change only:

```text
docs/site-evolution/homepage-v2-low-fidelity/03_LOW_FIDELITY_REVIEW_REPORT.md
```

Do not change:

- the four SVG maps;
- the map specification;
- the accepted Content Architecture;
- Strategy;
- Production Specification;
- Implementation Contract;
- Homepage;
- Contact;
- Header;
- Footer;
- CSS;
- JavaScript;
- YAML;
- routes;
- assets;
- workflows.

Do not create a production PR or begin visual concept work.

---

## 6. Required report structure

1. Executive verdict.
2. Reviewed branch head and map file blobs.
3. Ten-block architecture result.
4. Commercial hierarchy result.
5. 1440 px result.
6. 390 px result.
7. 320 px result.
8. 844 x 390 result.
9. RU Hero decision.
10. Proof/status/disclosure result.
11. Low-fidelity discipline result.
12. Blocking defects, if any.
13. Readiness for visual concept comparison.
14. Files changed during review.

Verdict must be exactly one of:

- `ACCEPT`;
- `TARGETED CORRECTION`;
- `REJECT`.

End with:

`Independent Homepage V2 low-fidelity full-page map review complete. No production files were changed.`
