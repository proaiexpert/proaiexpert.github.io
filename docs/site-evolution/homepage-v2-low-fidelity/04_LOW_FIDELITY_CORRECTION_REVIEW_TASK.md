# Homepage V2 Low-Fidelity Map — Focused Correction Review Task

**Status:** Ready for independent focused review  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Branch:** `agent/homepage-v2-low-fidelity-map`  
**Corrected map specification:** `docs/site-evolution/homepage-v2-low-fidelity/01_LOW_FIDELITY_FULL_PAGE_MAP.md`  
**Original review:** `docs/site-evolution/homepage-v2-low-fidelity/03_LOW_FIDELITY_REVIEW_REPORT.md`  
**Required output:** `docs/site-evolution/homepage-v2-low-fidelity/05_LOW_FIDELITY_FINAL_REVIEW_REPORT.md`

---

## 1. Role

Act as **Control / Independent Reviewer** for one focused correction review.

Do not create a competing page architecture, rewrite approved content, start visual concepts, or broaden the task beyond the blocking findings in the original low-fidelity review.

---

## 2. Read order

1. `docs/site-evolution/homepage-v2-low-fidelity/03_LOW_FIDELITY_REVIEW_REPORT.md`;
2. `docs/site-evolution/homepage-v2-low-fidelity/01_LOW_FIDELITY_FULL_PAGE_MAP.md`;
3. all four corrected SVG maps;
4. `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_CONTENT_ARCHITECTURE_V1.md` only where exact accepted content must be verified.

Corrected maps:

```text
docs/site-evolution/homepage-v2-low-fidelity/maps/homepage-v2-low-fi-1440.svg
docs/site-evolution/homepage-v2-low-fidelity/maps/homepage-v2-low-fi-390.svg
docs/site-evolution/homepage-v2-low-fidelity/maps/homepage-v2-low-fi-320.svg
docs/site-evolution/homepage-v2-low-fidelity/maps/homepage-v2-low-fi-844x390.svg
```

---

## 3. Required focused checks

### Check 1 — Hero fidelity

Confirm that:

- `390`, `320`, and `844 × 390` show the full accepted RU eyebrow, H1, supporting copy, primary CTA, expectation copy, secondary CTA, accountability line, and system strip in the accepted order;
- `1440` reserves visible expectation-copy and accountability fields;
- no RU copy was shortened or rewritten.

### Check 2 — Short-landscape containment

Confirm that:

- the Hero strip stays inside the Hero;
- all four Connected Journey steps stay inside their section;
- the conclusion stays inside the section;
- Two Core Directions begins after Connected Journey;
- no collision, horizontal overflow, sticky rail, or viewport-filling dependency remains.

### Check 3 — Connected Journey conclusion

Confirm a visible conclusion after the four steps on all four maps and verify that it preserves the website-plus-automation meaning.

### Check 4 — Ways-to-Start actions

For each situation, confirm separate normal-flow placeholders for:

- contextual review CTA;
- service links.

Required service-link counts:

```text
Situation 1: one Website link
Situation 2: one AI Systems link
Situation 3: two links — AI Systems and Websites & Branding
```

### Check 5 — Selected Work proof zones

For Alina Horb and Local Repair Pro, confirm separate visible zones for:

- status;
- disclosure/boundary;
- project action.

At `320 px`, confirm realistic multi-line normal-flow space for status and disclosure/boundary.

### Check 6 — Collateral scope

Confirm that:

- the ten-block order is unchanged;
- Content Architecture and approved copy are unchanged;
- the correction remains low fidelity and grayscale;
- no visual concept or production decision was introduced;
- no Homepage, Contact, Header, Footer, YAML, HTML, CSS, JavaScript, route, workflow, or production file changed.

---

## 4. Review method

Visually inspect each SVG as a rendered full-page document and inspect enlarged Hero, Connected Journey, Ways to Start, and Selected Work regions.

Do not approve based only on source text or file existence.

---

## 5. Allowed changes

Change only:

```text
docs/site-evolution/homepage-v2-low-fidelity/05_LOW_FIDELITY_FINAL_REVIEW_REPORT.md
```

Do not modify the corrected maps, map specification, original report, Content Architecture, Strategy, or any production file.

---

## 6. Required verdict

Use exactly one:

- `ACCEPT`;
- `TARGETED CORRECTION`;
- `REJECT`.

`ACCEPT` means the corrected maps may advance to a separate full-page visual-concept comparison stage.

`TARGETED CORRECTION` must identify only remaining blocking map defects and exact permitted files.

`REJECT` requires evidence that the maps violate the accepted architecture rather than a subjective visual preference.

---

## 7. Required report structure

1. Executive verdict.
2. Reviewed branch head and map blobs.
3. Hero fidelity result.
4. Short-landscape containment result.
5. Connected Journey conclusion result.
6. Ways-to-Start action result.
7. Selected Work proof-zone result.
8. Ten-block and collateral-scope result.
9. Remaining blocking defects, if any.
10. Readiness for visual-concept comparison.
11. Files changed during review.

End with:

`Focused Homepage V2 low-fidelity correction review complete. No production files were changed.`
