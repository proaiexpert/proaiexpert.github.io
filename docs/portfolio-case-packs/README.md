# ProAI Expert — Portfolio Case Packs

Internal source-of-truth materials for planning and implementing the ProAI Expert Case Studies system.

These documents control strategy, verified facts, claims, content structure, asset selection and implementation order. Production HTML/CSS/JavaScript is executed separately by Codex on the working branch.

---

## 1. Start here

Read in this order:

1. `PORTFOLIO_REBRAND_CURRENT_HANDOFF.md` — current operational state and exact next action.
2. `PORTFOLIO_SITE_AUDIT_AND_MASTER_PLAN.md` — final architecture, rollout, QA and safety plan.
3. `PORTFOLIO_EXPERIENCE_BLUEPRINT.md` — visual/interaction direction.
4. Project master brief — verified content and evidence.
5. Project build task — executable Codex instruction.
6. Project screenshot/evidence manifests.

Older dated transfer, correction and research files are historical reference only. They do not override the current handoff or current project master brief.

---

## 2. Work division

### Managed in ChatGPT

- strategy;
- case architecture;
- public copy;
- evidence and claim review;
- screenshot selection;
- documentation cleanup;
- task design;
- implementation sequencing.

### Executed in Codex

- deployment/source investigation;
- HTML/CSS/JavaScript;
- responsive implementation;
- local/browser preview;
- asset optimization;
- metadata/link/console QA;
- production-code commits.

Do not spend Codex limits repeating planning already locked in these documents.

---

## 3. Final route architecture

English:

```text
/case-studies/
/case-studies/financial-stream/
/case-studies/alina-horb/
/case-studies/local-repair-pro/
/case-studies/proai-expert/
```

Russian:

```text
/ru/case-studies/
/ru/case-studies/financial-stream/
/ru/case-studies/alina-horb/
/ru/case-studies/local-repair-pro/
/ru/case-studies/proai-expert/
```

Do not create a competing `/work/` or `/portfolio/` architecture.

---

## 4. Project status

| Priority | Project | Truth label | Current production state |
|---:|---|---|---|
| 1 | Financial Stream LLC | Real Client Project · Live · Ongoing Optimization | Core website visual package assembled; metrics and canonical documents synchronized; source/live parity and EN/RU case implementation next |
| 2 | Alina Horb | Real Website Project · Live / In Refinement | Case facts available; real current screenshot package and publication permissions still required |
| 3 | Local Repair Pro | Concept Project · Website Production Factory Showcase | Demo/concept exists; public cleanup, truthful labeling and current screenshot package still required |
| Secondary | ProAI Expert | Internal Studio Project · Live | Preserve existing EN/RU URLs as a secondary Studio Case |

---

## 5. Locked production order

1. Resolve Case Studies source/live deployment parity.
2. Build the complete Financial Stream EN/RU flagship detail pages.
3. Build the Case Studies archive foundation around the approved Financial Stream system.
4. Capture and build the Alina Horb detail pages.
5. Clean, capture and build the Local Repair Pro concept pages.
6. Finalize archive hierarchy, transitions and all three project stages.
7. Integrate homepage/service links, navigation and footer.
8. Add final metadata, canonical/hreflang, sitemap and OG assets.
9. Run accessibility, responsive, performance and no-regression QA.
10. Perform one controlled owner-approved launch.

Do not complete the archive visually before the Financial Stream detail-page system establishes the reusable case components.

---

## 6. Financial Stream source hierarchy

Use in this order:

1. `PORTFOLIO_REBRAND_CURRENT_HANDOFF.md`
2. `financial-stream/CASE_V2_MASTER_BRIEF.md`
3. `financial-stream/CASE_V2_BUILD_TASK.md`
4. `financial-stream/SCREENSHOT_MANIFEST.md`
5. `financial-stream/EVIDENCE_INDEX.md`
6. `financial-stream/PACKAGE_STATUS.md`
7. legacy source-pack files only for historical detail.

The current master brief supersedes older wording that:

- removed Payroll;
- used older GSC values as current;
- treated rejected landscape mobile files as selected;
- required recapturing the completed ten-image core package.

---

## 7. Current Financial Stream metrics

### Performance

Owner-supplied GSC screenshot reviewed 2026-07-17:

- 3-month period;
- 19 clicks;
- approximately 4.17K impressions.

### Indexing

Separate owner-supplied snapshot:

- 51 indexed pages;
- last updated 2026-07-09.

Older evidence showing approximately 3.88K impressions and 41 indexed pages is historical only.

---

## 8. Current Financial Stream visual package

Canonical root:

`assets/img/cases/financial-stream/final-v1/`

Selected package:

- four RU desktop PNGs;
- one RU Company Formation portrait-mobile PNG;
- four EN desktop PNGs;
- one EN Company Formation portrait-mobile PNG.

Decisions:

- rejected RU/EN Materials mobile-landscape files removed;
- matching RU/EN Materials desktop files selected;
- matching RU/EN Company Formation portrait-mobile files selected;
- six superseded review-test PNGs removed;
- selected PNG masters must not be recaptured or renamed without owner instruction;
- optimized WebP derivatives are created only during implementation;
- final owner visual lock occurs in the actual page preview.

---

## 9. Working rules

1. Public claims must be supported by current project documents.
2. Demo/concept work must never be presented as a completed client engagement.
3. Do not claim unverified traffic, ranking, leads, conversion, revenue or ROI outcomes.
4. Personal images, credentials, testimonials and identifying information require permission where applicable.
5. Full public case copy must be materially shorter than research/source packs.
6. Existing public routes must be preserved or deliberately redirected.
7. Do not edit public portfolio code directly in `main`.
8. Resolve source/live parity before replacing existing case routes.
9. Closed issues, dimensions, hashes and logs do not equal visual approval.
10. Use real captures only; no synthetic UI or placeholder project imagery.
11. Keep evidence captures separate from presentation masters.
12. Keep strategy/content work here and implementation work in Codex.

---

## 10. Current structure

```text
docs/portfolio-case-packs/
├── README.md
├── PORTFOLIO_REBRAND_CURRENT_HANDOFF.md
├── PORTFOLIO_SITE_AUDIT_AND_MASTER_PLAN.md
├── PORTFOLIO_EXPERIENCE_BLUEPRINT.md
├── VISUAL_ASSET_CORRECTION_2026-07-15.md
├── REAL_SCREENSHOT_CAPTURE_TASK.md
├── PORTFOLIO_PREIMPLEMENTATION_REVIEW_TASK.md
├── PORTFOLIO_DESIGN_REVIEW_TASK.md
├── financial-stream/
│   ├── CASE_V2_MASTER_BRIEF.md
│   ├── CASE_V2_BUILD_TASK.md
│   ├── PACKAGE_STATUS.md
│   ├── SCREENSHOT_MANIFEST.md
│   ├── EVIDENCE_INDEX.md
│   ├── SOURCE_PACKAGE_MANIFEST.md
│   ├── evidence/
│   └── historical source-pack documents
├── alina-horb/
│   └── CASE_PACK.md
└── local-repair-pro/
    └── CASE_PACK.md
```

---

## 11. P0 source/live mismatch

Live ProAI Case Studies pages and current `main` source are not fully aligned.

Codex must identify the actual deployment source, preserve current live HTML/assets and selectively restore required source into `portfolio-rebrand-v1` before V2 implementation.

Do not roll the repository back wholesale and do not overwrite the live pages from an arbitrary historical commit.
