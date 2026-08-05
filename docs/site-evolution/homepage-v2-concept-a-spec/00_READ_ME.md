# ProAI Expert Homepage V2 — Concept A Selected-Specification Workspace

**Status:** selected-concept specification prepared for independent review  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Branch:** `agent/homepage-v2-concept-a-spec`  
**Branch base:** accepted visual-review commit `2fd5be4d3b5097cc2683424f88a185f7b76ec965`  
**Owner selection:** Concept A — Precision Grid  
**Production authorization:** none

---

## Purpose

This workspace converts the accepted full-page visual direction **Concept A — Precision Grid** into a deterministic selected-concept specification and future implementation contract.

It does not implement the Homepage.

The specification must preserve:

- the accepted Homepage V2 Strategy;
- the accepted Content Architecture;
- the accepted four-map low-fidelity structure;
- the accepted ten-block commercial order;
- the locked Header and Footer systems;
- the existing Contact contract;
- truthful project status and evidence boundaries;
- EN/RU localization and responsive requirements;
- the review rule: **signal, not spectacle**.

---

## Workspace

```text
docs/site-evolution/homepage-v2-concept-a-spec/
├── 00_READ_ME.md
├── 01_CONCEPT_A_SELECTED_SPECIFICATION.md
└── 02_CONCEPT_A_SPEC_REVIEW_TASK.md
```

The independent reviewer will create and fill:

```text
docs/site-evolution/homepage-v2-concept-a-spec/03_CONCEPT_A_SPEC_REVIEW_REPORT.md
```

---

## Source authority

Use the following order when resolving conflicts:

1. accepted Homepage V2 Strategy;
2. accepted Content Architecture V1.1;
3. accepted low-fidelity maps and final review;
4. accepted visual-concept comparison and final review;
5. this selected-concept specification;
6. future implementation task and production diff.

Concept SVGs express visual direction. They do not override accepted content, accessibility, localization, Contact, Header, Footer, or proof contracts.

---

## Current gate

An independent Reviewer must inspect the complete specification against:

- Concept A desktop and mobile SVGs;
- the accepted Content Architecture;
- the accepted low-fidelity maps;
- the accepted visual-concept review;
- current production architecture boundaries.

The reviewer may change only the final review report.

Allowed review verdicts:

- `ACCEPT`;
- `TARGETED CORRECTION`;
- `REJECT`.

---

## Not authorized

Until an independent review returns `ACCEPT`, do not begin:

- Homepage YAML or content-data files;
- Homepage HTML or include replacement;
- Homepage CSS or JavaScript;
- image derivatives or final crops;
- Header, Footer, Contact, route, or workflow changes;
- production branch or production PR;
- deployment.

This branch is documentation-only.
