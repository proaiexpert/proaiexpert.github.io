# ProAI Expert — Portfolio Rebrand Control Transfer

**Date:** 2026-07-17  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Working branch:** `portfolio-rebrand-v1`  
**Primary operational source:** `docs/portfolio-case-packs/PORTFOLIO_REBRAND_CURRENT_HANDOFF.md`

## Decision

A new clean ChatGPT project chat becomes the primary coordinator for the portfolio rebrand from this point.

The previous chat is historical context only. When conversational memory conflicts with the repository handoff, the repository handoff controls.

The new primary chat must:

- maintain the current status in the canonical handoff;
- issue only one controlled next task at a time;
- prevent changes to `main` and production until explicit approval;
- require visual inspection of actual PNG content before approving screenshots;
- keep Codex/OpenCode execution separate from human visual approval.

## Latest browser diagnostic

A browser-enabled Codex session checked the current browser state without changing files or creating screenshots.

Verified facts:

- `window.visualViewport.scale = 1`; this is consistent with 100% page zoom.
- `window.devicePixelRatio = 3` is attributable to the Windows display scaling / pixel-density environment, not to Chrome page zoom.
- Do not interpret DPR 3 as Chrome zoom 300%.
- Alina Horb and ProAI Expert loaded with first-screen fonts and images ready.
- The currently open Financial Stream tab was on an internal page with a narrow viewport near 430 CSS px; desktop capture requires an explicitly created 1440 px browser viewport and the correct live route.
- Canonical capture work should use a clean browser context with explicitly measured viewport, DPR and visual scale rather than relying on an existing user tab.

## Current project stop point

Financial Stream remains the active project.

The folder:

`assets/img/cases/financial-stream/final-v1/`

contains eight technically valid PNG files, but it is not a visually approved final package.

Current approval state:

- RU desktop homepage hero: visually approved.
- Remaining seven PNG files: not approved until individually opened and reviewed.
- RU Materials mobile landscape: explicitly rejected.
- EN Materials mobile landscape: requires visual review and must not be approved by symmetry or metadata.

Closed Issues, commit success, image dimensions, hashes and `capture-log.txt` are technical evidence only. They are not visual approval.

## Exact next action

Do not recapture a batch and do not modify GitHub first.

1. Open the actual eight PNG files from `assets/img/cases/financial-stream/final-v1/` as images at 100% display.
2. Produce an `ACCEPT` / `REJECT` table with one concrete visual reason per file.
3. Do not change `final-v1`, `main`, production or GitHub during this audit.
4. After the audit, create exactly one RU Materials portrait-mobile review test outside `final-v1`.
5. Use a clean browser context with:
   - CSS viewport `390 × 844`;
   - page zoom / `visualViewport.scale` equal to `1`;
   - explicit logging of `innerWidth`, `innerHeight`, DPR and physical PNG size;
   - chatbot launcher closed and no open messages.
6. Stop for owner review of the actual raw PNG.

Only after human approval may the matching language version or further replacement captures be produced.

## Safety

- Do not modify `main`.
- Do not publish.
- Do not promote `previews/portfolio-v1/`.
- Do not replace any `final-v1` file before the replacement image is visually approved.
- Do not use synthetic UI, stand-ins or old screenshots.
- Do not let an execution agent declare a screenshot package final without owner inspection.
