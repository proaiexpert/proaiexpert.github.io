# Homepage V2 — Implementation Planning Workspace

**Status:** implementation plan candidate for independent review  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Branch:** `agent/homepage-v2-implementation-plan`  
**Planning branch base:** `3041db8ea7e8e6f225e72e0e945685099e411e79`  
**Selected specification:** Concept A — Precision Grid  
**Production authorization:** none

---

## Purpose

This workspace converts the accepted Homepage V2 Content Architecture, low-fidelity system, selected Concept A specification, and current production repository state into a deterministic implementation plan.

The plan analyzes the actual current `main` at:

```text
7bcc09ae28388f8e4a5e6e5a715aa5ba7b3fbf50
```

It does not create or modify Homepage production code.

---

## Files

```text
docs/site-evolution/homepage-v2-implementation-plan/
├── 00_READ_ME.md
├── 01_HOMEPAGE_V2_IMPLEMENTATION_PLAN.md
├── 02_HOMEPAGE_V2_IMPLEMENTATION_PLAN_REVIEW_TASK.md
└── 03_HOMEPAGE_V2_IMPLEMENTATION_PLAN_REVIEW_REPORT.md
```

---

## Locked boundaries

Until this implementation plan receives independent `ACCEPT` and the owner explicitly authorizes a Builder stage, do not change:

- `index.html`;
- `ru/index.html`;
- current Homepage snapshot includes;
- Header or Footer systems;
- Contact pages or query contract;
- Homepage CSS or JavaScript;
- images or production assets;
- routes, metadata, sitemap, workflows, or deployment;
- `main` or any production PR.

---

## Intended next gate

The independent Reviewer must evaluate the plan and write only:

```text
docs/site-evolution/homepage-v2-implementation-plan/03_HOMEPAGE_V2_IMPLEMENTATION_PLAN_REVIEW_REPORT.md
```

An `ACCEPT` authorizes only a separate owner-approved Builder task from the then-current `main`. It does not itself authorize production implementation, PR creation, merge, or deployment.
