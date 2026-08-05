# Homepage V2 Content Architecture — Focused Correction Review Task

**Status:** Ready for independent focused review  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Branch:** `agent/homepage-v2-content-architecture`  
**Corrected document:** `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_CONTENT_ARCHITECTURE_V1.md`  
**Original review:** `docs/site-evolution/homepage-v2-content-review/02_CONTENT_ARCHITECTURE_REVIEW_REPORT.md`  
**Required output:** `docs/site-evolution/homepage-v2-content-review/04_CONTENT_ARCHITECTURE_FINAL_REVIEW_REPORT.md`

---

## 1. Role

Act as **Control / Independent Reviewer** for one focused correction review.

Do not create a competing content architecture. Do not reopen approved strategy, ten-block order, service hierarchy, proof hierarchy, pricing decision, Header/Footer scope or Contact contract unless a correction demonstrably violates an existing authority.

---

## 2. Read order

Read in this order:

1. repository root `AI_START_HERE.md`;
2. repository root `AGENTS.md`;
3. repository root `AI_CURRENT_HANDOFF.md`;
4. `docs/site-evolution/homepage-v2-content-review/02_CONTENT_ARCHITECTURE_REVIEW_REPORT.md`;
5. corrected `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_CONTENT_ARCHITECTURE_V1.md`;
6. governing authorities only where needed:
   - `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_STRATEGY.md`;
   - `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_PRODUCTION_SPEC.md`;
   - `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_IMPLEMENTATION_CONTRACT.md`.

---

## 3. Review scope

Verify only whether Corrections 1–7 from Section 13 of the original independent report were applied completely and without collateral strategy changes.

### Correction 1 — EN/RU metadata contract

Confirm that the corrected document now defines:

- every required `meta` key;
- explicit absolute EN/RU canonical and alternate URLs;
- `x-default`;
- reviewed EN/RU title and description candidates;
- Open Graph and Twitter copy/image fields;
- a clear boundary for replacing current social-preview assets.

Check that RU metadata avoids unsupported claims about lead quality, conversion, revenue or ROI.

### Correction 2 — CTA/link identifier map

Confirm that the document defines and separates:

- `action_id`;
- `origin_id`;
- project/article item IDs;
- Contact query values.

Confirm the presence and correct use of:

```text
view_client_work
homepage_directions
homepage_flagship_proof
homepage_ways_to_start
homepage_final
```

Confirm that unsupported internal IDs are not authorized as Contact query parameters.

### Correction 3 — Ways-to-Start service-link schema

Confirm that:

- the singular `service_link` ambiguity is removed;
- every situation uses a deterministic `service_links` collection;
- Situation 1 has one Website link;
- Situation 2 has one AI link;
- Situation 3 has both links;
- every link owns stable `id`, localized `label` and explicit localized `href`;
- arbitrary HTML and inferred localized routes remain prohibited.

### Correction 4 — Financial Stream first-call statement

Confirm the EN statement is bounded to reducing reliance on long first calls and the RU statement uses the approved equivalent.

Confirm no other Financial Stream claim was broadened.

### Correction 5 — RU proof-status terminology

Confirm exact public statuses:

```text
Financial Stream: Действующий клиентский проект · EN/RU
Alina Horb: Действующий проект, связанный с основателем · UA/RU
Local Repair Pro: Концепция сайта · Рабочее демо · В разработке
```

Confirm adjacent Alina disclosure and Local Repair Pro evidence boundary retain their approved intent.

### Correction 6 — Listed RU language fixes only

Confirm the exact targeted fixes were applied for:

- Alina route grammar;
- Local Repair Pro `адаптивную реализацию`;
- operational-friction subject structure;
- Process introduction;
- Ways-to-Start heading without an unsupported `потерь` claim;
- Insights heading;
- Final-review heading.

Flag any broad unrelated RU rewrite.

### Correction 7 — RU Hero provisional gate

Confirm the document explicitly states that RU Hero shortening may occur only after authorized low-fidelity maps demonstrate the need at:

- 390 px;
- 320 px;
- approximately 844 × 390.

Confirm the correction does not authorize starting the low-fidelity map now.

---

## 4. Locked boundaries

Do not modify or authorize changes to:

- the ten-block Homepage architecture;
- approved Homepage V2 strategy;
- Homepage or Contact production files;
- Header or Footer;
- routes, metadata output, CSS, JavaScript, YAML, assets or workflows;
- the original review report;
- production PRs;
- low-fidelity maps or visual concepts.

No browser implementation, screenshot production, image generation or code work is part of this review.

---

## 5. Required validation

Compare the corrected document against the original review and report:

1. whether each Correction 1–7 is fully resolved;
2. whether the ten-block order is unchanged;
3. whether the corrected document introduces any new commercial, proof, localization, schema or Contact-contract defect;
4. whether the document is now deterministic enough to become the future low-fidelity-map input after acceptance.

Review the actual branch state and record:

- reviewed branch head;
- reviewed content-document blob;
- files changed during your review.

---

## 6. Required verdict

Use exactly one:

- `ACCEPT` — Corrections 1–7 are complete and no new material defect blocks the next gate;
- `TARGETED CORRECTION` — one or more bounded defects remain;
- `REJECT` — the corrections materially damaged or contradicted the approved architecture.

Do not use `ACCEPT WITH NOTES`. Non-blocking observations may be recorded under a separate heading, but the verdict must remain one of the three values above.

---

## 7. Required report structure

Write the final report to:

`docs/site-evolution/homepage-v2-content-review/04_CONTENT_ARCHITECTURE_FINAL_REVIEW_REPORT.md`

Use these sections:

1. Executive verdict;
2. Reviewed branch, head and document blob;
3. Correction 1 result;
4. Correction 2 result;
5. Correction 3 result;
6. Correction 4 result;
7. Correction 5 result;
8. Correction 6 result;
9. Correction 7 result;
10. Collateral-change and boundary check;
11. Remaining blocking defects, if any;
12. Readiness for low-fidelity mapping;
13. Files changed during review.

End with exactly:

```text
Focused Homepage V2 Content Architecture correction review complete. No production files were changed.
```

---

## 8. Write scope

During this review, change only:

`docs/site-evolution/homepage-v2-content-review/04_CONTENT_ARCHITECTURE_FINAL_REVIEW_REPORT.md`

Do not modify the corrected content architecture, the original report, any production file or any other documentation.

After saving the report, stop.