# ProAI Expert — Portfolio Case Packs

Internal source-of-truth materials for building the ProAI Expert Case Studies archive, homepage project presentation, screenshot sets, and supporting promotional assets.

## Projects

| Priority | Project | Folder | Public status | Production state |
|---:|---|---|---|---|
| 1 | Financial Stream LLC | `financial-stream/` | Live client project · ongoing optimization | Research complete; V2 ready after source/live parity recovery |
| 2 | Alina Horb Psychology Practice Website | `alina-horb/` | Live project · ongoing refinement | Case pack complete; production follows Financial Stream |
| 3 | Local Repair Pro | `local-repair-pro/` | Website concept · in development | Case pack complete; showcase cleanup required before capture |

## Working rules

1. These files are internal evidence and production documents, not final public copy.
2. Public claims must be limited to verified facts recorded in the relevant current master brief.
3. Demo/concept work must never be represented as a completed client engagement.
4. Unverified performance, conversion, traffic, revenue, lead or client-satisfaction claims are prohibited.
5. Personal images, credentials, documents, testimonials and identifying information require publication permission where applicable.
6. Final public case-study copy must be materially shorter than the source packs and preserve all claim, privacy and safety constraints.
7. Payroll is a confirmed active Financial Stream service and may appear in current portfolio copy and screenshots when accurately represented.
8. Continue using the existing `/case-studies/` architecture. Do not create a competing `/work/` system.

## Current structure

```text
docs/portfolio-case-packs/
├── README.md
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

## Source-of-truth hierarchy

For Financial Stream, use documents in this order:

1. `CASE_V2_MASTER_BRIEF.md`
2. `CASE_V2_BUILD_TASK.md`
3. `PACKAGE_STATUS.md`
4. `SCREENSHOT_MANIFEST.md`
5. `EVIDENCE_INDEX.md`
6. legacy source-pack parts only for additional historical detail

The V2 master brief supersedes older internal statements that treated Payroll as obsolete or required its removal.

## Current build order

1. Resolve the Financial Stream live/source deployment mismatch.
2. Capture missing current Financial Stream screens.
3. Build and publish the Financial Stream EN/RU flagship case.
4. Build and publish the Alina Horb EN/RU case in the same system.
5. Clean Local Repair Pro, capture final visuals, and publish it as a clearly labelled concept case.
6. Update the Case Studies index and homepage presentation to show all three projects in this order.

## Financial Stream P0

The live ProAI `/case-studies/` URLs currently display full pages, while the current `main` source contains a redirect at `case-studies/index.html` and does not expose the Financial Stream case HTML through the GitHub Contents API. Do not overwrite the live case from an older historical file until the actual deployment source is identified and source/live parity is restored.
