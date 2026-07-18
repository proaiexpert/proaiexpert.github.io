# ProAI Expert — Portfolio Case Packs

Internal source-of-truth materials for planning and implementing the ProAI Expert Case Studies system.

These documents control strategy, verified facts, claims, content structure, asset selection and implementation order. Production HTML/CSS/JavaScript is executed separately by Codex on the working branch.

---

## 1. Start here

Read in this order:

1. `PORTFOLIO_REBRAND_CURRENT_HANDOFF.md` — current operational state and exact next action.
2. `PORTFOLIO_CASE_ART_DIRECTION_AND_MOTION_SYSTEM_V1.md` — reusable portfolio art-direction, screenshot and motion rules.
3. `PORTFOLIO_SITE_AUDIT_AND_MASTER_PLAN.md` — final architecture, rollout, QA and safety plan.
4. Approved project Production Spec when present.
5. Project master brief — verified content and evidence.
6. Project screenshot/evidence manifests.
7. Updated project build task — executable Codex instruction after owner approval.

`PORTFOLIO_EXPERIENCE_BLUEPRINT.md` remains a historical design-prototyping reference. It cannot override the current handoff, the reusable V1 system or an approved project Production Spec.

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
| 1 | Financial Stream LLC | Real Client Project · Live · Ongoing Optimization | Production Spec draft created; owner review, V2 placement approval, source/live parity and implementation remain |
| 2 | Alina Horb | Real Website Project · Live / In Refinement | Case facts available; real current screenshot package, final portfolio narrative and publication permissions still required |
| 3 | Local Repair Pro | Concept Project · Website Production Factory Showcase | Demo/concept exists; public cleanup, truthful labeling and current screenshot package still required |
| Secondary | ProAI Expert | Internal Studio Project · Live | Preserve existing EN/RU URLs as a secondary Studio Case |

---

## 5. Locked production order

1. Complete and owner-approve the Financial Stream Production Spec.
2. Resolve Case Studies source/live deployment parity.
3. Promote approved Financial Stream V2 assets only under the approved placement procedure.
4. Build the complete Financial Stream EN/RU flagship detail pages.
5. Build the Case Studies archive foundation around the approved Financial Stream system.
6. Capture and build the Alina Horb detail pages.
7. Clean, capture and build the Local Repair Pro concept pages.
8. Finalize archive hierarchy, transitions and all three project stages.
9. Integrate homepage/service links, navigation and footer.
10. Add final metadata, canonical/hreflang, sitemap and OG assets.
11. Run accessibility, responsive, performance and no-regression QA.
12. Perform one controlled owner-approved launch.

Do not complete the archive visually before the Financial Stream detail-page system establishes the reusable case components.

---

## 6. Financial Stream source hierarchy

Use in this order:

1. `PORTFOLIO_REBRAND_CURRENT_HANDOFF.md`
2. `PORTFOLIO_CASE_ART_DIRECTION_AND_MOTION_SYSTEM_V1.md`
3. `financial-stream/FINANCIAL_STREAM_FLAGSHIP_CASE_PRODUCTION_SPEC_V1.md` after owner approval
4. `financial-stream/CASE_V2_MASTER_BRIEF.md`
5. `financial-stream/SCREENSHOT_MANIFEST.md`
6. `financial-stream/EVIDENCE_INDEX.md`
7. `financial-stream/PACKAGE_STATUS.md`
8. an updated final Codex build task after the Production Spec is approved
9. legacy source-pack files only for historical detail.

The current handoff, reusable system and approved Production Spec supersede older wording that:

- removed Payroll;
- used older GSC values as current;
- treated rejected landscape mobile files as selected;
- required recapturing the completed screenshot package;
- used fake device frames, browser chrome, blur-to-sharp or generic device choreography;
- treated legacy Request/Reporting frames as the final public placement.

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

Current canonical package:

- four RU desktop PNGs;
- one RU Company Formation portrait-mobile PNG;
- four EN desktop PNGs;
- one EN Company Formation portrait-mobile PNG.

Owner-approved V2 review root:

`assets/img/cases/financial-stream/review-candidates-v2/`

It contains four visually approved Request/Reporting replacement candidates:

- RU Request V2;
- RU Reporting/Chatbase V2;
- EN Request V2;
- EN Reporting/Chatbase V2.

Decisions:

- rejected RU/EN Materials mobile-landscape files remain removed;
- matching RU/EN Materials desktop files remain selected;
- matching RU/EN Company Formation portrait-mobile files remain selected;
- V2 Request/Reporting candidates are visually approved but not yet promoted;
- approved V2 files must not be recaptured;
- optimized WebP derivatives are created only during implementation;
- final owner visual lock occurs in the complete EN/RU page preview;
- real screenshots are presented as proof surfaces, not inside Apple, laptop, phone or browser mockups.

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
12. Do not use Apple device frames, generic hardware mockups or fake browser chrome as the default screenshot treatment.
13. Keep strategy/content work here and implementation work in Codex.
14. Do not issue the final Codex implementation task before the project Production Spec is owner-approved.

---

## 10. Current structure

```text
docs/portfolio-case-packs/
├── README.md
├── PORTFOLIO_REBRAND_CURRENT_HANDOFF.md
├── PORTFOLIO_CASE_ART_DIRECTION_AND_MOTION_SYSTEM_V1.md
├── PORTFOLIO_SITE_AUDIT_AND_MASTER_PLAN.md
├── PORTFOLIO_EXPERIENCE_BLUEPRINT.md                  # historical prototyping reference
├── VISUAL_ASSET_CORRECTION_2026-07-15.md
├── REAL_SCREENSHOT_CAPTURE_TASK.md
├── PORTFOLIO_PREIMPLEMENTATION_REVIEW_TASK.md
├── PORTFOLIO_DESIGN_REVIEW_TASK.md
├── financial-stream/
│   ├── CASE_V2_MASTER_BRIEF.md
│   ├── CASE_V2_BUILD_TASK.md                          # not final for implementation
│   ├── FINANCIAL_STREAM_FLAGSHIP_CASE_EXPERIENCE_BLUEPRINT_V1.md
│   ├── FINANCIAL_STREAM_FLAGSHIP_CASE_PRODUCTION_REVIEW_TASK_V1.md
│   ├── FINANCIAL_STREAM_FLAGSHIP_CASE_PRODUCTION_SPEC_V1.md
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
