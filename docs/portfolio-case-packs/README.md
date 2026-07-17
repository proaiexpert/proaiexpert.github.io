# ProAI Expert — Portfolio Case Packs

Internal source-of-truth materials for building the ProAI Expert Case Studies archive, individual EN/RU case pages, homepage/service-page proof modules, screenshot sets, and supporting promotional assets.

## Start here

1. `PORTFOLIO_REBRAND_CURRENT_HANDOFF.md` — current operational status, latest corrections, rejected work, exact next action, and session rules.
2. `PORTFOLIO_SITE_AUDIT_AND_MASTER_PLAN.md` — strategic architecture, integration matrix, safe rollout, QA and rollback.
3. `PORTFOLIO_EXPERIENCE_BLUEPRINT.md` — approved visual and interaction direction.
4. `VISUAL_ASSET_CORRECTION_2026-07-15.md` — binding real-visual rule and rejected synthetic work.
5. `REAL_SCREENSHOT_CAPTURE_TASK.md` — baseline screenshot capture requirements.
6. `PORTFOLIO_PREIMPLEMENTATION_REVIEW_TASK.md` — independent architecture/design/deployment review before implementation.
7. `PORTFOLIO_DESIGN_REVIEW_TASK.md` — focused visual and interaction critique.

The current handoff controls operational status when older planning documents contain stale completion statements. Strategic architecture remains controlled by the master plan.

## Projects

| Priority | Project | Folder / route role | Public status | Production state |
|---:|---|---|---|---|
| 1 | Financial Stream LLC | `financial-stream/` · primary flagship client case | Live client project · ongoing optimization | Research complete; screenshot package requires renewed visual audit before case production |
| 2 | Alina Horb Psychology Practice Website | `alina-horb/` · primary portfolio case | Live project · ongoing refinement | Case pack complete; current real screenshots not yet approved |
| 3 | Local Repair Pro | `local-repair-pro/` · primary concept/showcase case | Website concept · in development | Case pack complete; current real screenshots not yet approved |
| Secondary | ProAI Expert | existing `/case-studies/proai-expert/` studio case | Internal studio project · live | Preserve existing EN/RU URLs; show as secondary Studio Case rather than deleting it |

## Final portfolio architecture

```text
/case-studies/
/case-studies/financial-stream/
/case-studies/alina-horb/
/case-studies/local-repair-pro/
/case-studies/proai-expert/

/ru/case-studies/
/ru/case-studies/financial-stream/
/ru/case-studies/alina-horb/
/ru/case-studies/local-repair-pro/
/ru/case-studies/proai-expert/
```

Do not create a competing `/work/` or `/portfolio/` architecture.

## Working rules

1. These files are internal evidence and production documents, not final public copy.
2. Public claims must be limited to verified facts recorded in the relevant current master brief.
3. Demo/concept work must never be represented as a completed client engagement.
4. Unverified performance, conversion, traffic, revenue, lead or client-satisfaction claims are prohibited.
5. Personal images, credentials, documents, testimonials and identifying information require publication permission where applicable.
6. Final public case-study copy must be materially shorter than the source packs and preserve all claim, privacy and safety constraints.
7. Payroll is a confirmed active Financial Stream service and may appear in current portfolio copy and screenshots when accurately represented.
8. Existing public routes must not be deleted without preservation or deliberate redirects.
9. Do not modify public portfolio HTML/CSS/JS directly in `main`.
10. Resolve source/live parity and create a backup point before any implementation branch work.
11. Closed GitHub issues, image dimensions, checksums, and capture logs do not equal visual approval.
12. Do not batch-capture or replace a full screenshot package before one actual raw test image is visually approved.

## Current structure

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
│   ├── CASE_PACK.md
│   ├── CASE_PACK_PART_2_ARCHITECTURE.md
│   ├── CASE_PACK_PART_3_EVIDENCE_AND_FRAMING.md
│   ├── CASE_PACK_APPENDICES.md
│   ├── PAYROLL_STATUS_CORRECTION.md
│   ├── FLAGSHIP_CASE_BUILD_PLAN.md
│   ├── EVIDENCE_INDEX.md
│   ├── SCREENSHOT_MANIFEST.md
│   ├── SOURCE_PACKAGE_MANIFEST.md
│   ├── EVIDENCE_DERIVATIVES_MANIFEST.md
│   ├── evidence/
│   │   ├── README.md
│   │   └── six WebP review derivatives
│   └── source/
│       └── README.md
├── alina-horb/
│   └── CASE_PACK.md
└── local-repair-pro/
    └── CASE_PACK.md
```

## Financial Stream source-of-truth hierarchy

Use documents in this order:

1. `PORTFOLIO_REBRAND_CURRENT_HANDOFF.md` for current operational status.
2. `financial-stream/CASE_V2_MASTER_BRIEF.md` for case strategy and verified facts.
3. `financial-stream/CASE_V2_BUILD_TASK.md` for the intended case build.
4. `financial-stream/PACKAGE_STATUS.md` for source/evidence package tracking.
5. `financial-stream/SCREENSHOT_MANIFEST.md` after it has been updated with visually approved files.
6. `financial-stream/EVIDENCE_INDEX.md` for evidence framing.
7. legacy source-pack parts only for additional historical detail.

The V2 master brief supersedes older internal statements that treated Payroll as obsolete or required its removal.

## Current production order

1. Complete the Financial Stream screenshot visual audit and obtain one approved replacement test.
2. Finish the visually approved Financial Stream screenshot set and manifest.
3. Resolve or fully document the live/source deployment mismatch before public implementation.
4. Update the archive + Financial Stream prototype using only approved real captures.
5. Run the independent pre-implementation review and incorporate blocking corrections.
6. Build the complete Financial Stream EN/RU flagship case.
7. Build the scalable Case Studies archive while preserving the existing ProAI Expert studio case.
8. Capture and build the Alina Horb case after permission and evidence checks.
9. Clean, capture, and build the Local Repair Pro concept case.
10. Integrate homepage, Websites & Branding, optional AI Systems proof, navigation, footer, sitemap, metadata and redirects.
11. Run full no-regression QA and perform one controlled launch.

## P0 source/live mismatch

The live ProAI `/case-studies/` routes have displayed full EN/RU archive and case pages, while current `main` contains a redirect at `case-studies/index.html`, omits the RU archive source through the Contents API, and does not represent Case Studies in the sitemap. Git history includes commit `5fa342a64b464493a0935047c7c84d6c3884c4f0` labelled `Delete case-studies directory`.

Do not overwrite or rebuild the live case pages from an arbitrary historical file until the actual deployment source is identified and source/live parity is restored or fully documented.
