# ProAI Expert — Portfolio Rebrand Current Handoff

**Last updated:** 2026-07-17  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Working branch:** `portfolio-rebrand-v1`  
**Latest known branch commit before this handoff:** `8ce7582bb9f28e4a08e1218bc8b99ef3158f16ba`  
**Public status:** no portfolio rebrand changes have been merged into `main` or published from this work.

## 1. Purpose and authority

This is the current operational handoff for the ProAI Expert portfolio rebrand.

Use it first when opening a new ChatGPT, Codex, or implementation session.

It does not replace the strategic architecture documents. It records the latest verified state, corrections, rejected work, current risks, and exact next action. Where an older document describes an outdated production status, this handoff controls the current status.

Strategic source documents:

1. `docs/portfolio-case-packs/PORTFOLIO_SITE_AUDIT_AND_MASTER_PLAN.md`
2. `docs/portfolio-case-packs/PORTFOLIO_EXPERIENCE_BLUEPRINT.md`
3. `docs/portfolio-case-packs/VISUAL_ASSET_CORRECTION_2026-07-15.md`
4. `docs/portfolio-case-packs/REAL_SCREENSHOT_CAPTURE_TASK.md`
5. project-specific case packs under `docs/portfolio-case-packs/`

## 2. Locked portfolio architecture

English:

- `/case-studies/`
- `/case-studies/financial-stream/`
- `/case-studies/alina-horb/`
- `/case-studies/local-repair-pro/`
- `/case-studies/proai-expert/`

Russian:

- `/ru/case-studies/`
- `/ru/case-studies/financial-stream/`
- `/ru/case-studies/alina-horb/`
- `/ru/case-studies/local-repair-pro/`
- `/ru/case-studies/proai-expert/`

Do not introduce a competing `/work/` or `/portfolio/` route system.

Project order and truth labels:

1. Financial Stream — real flagship client, live, ongoing optimization.
2. Alina Horb — real live website project; current client site is UA/RU.
3. Local Repair Pro — concept/showcase, in development, not a client project.
4. ProAI Expert — existing internal studio case; preserve EN/RU routes.

## 3. Branch and safety state

Relevant branches:

- `main` — public baseline; do not modify directly.
- `backup/pre-portfolio-rebrand-2026-07-15` — safety point.
- `portfolio-rebrand-v1` — current working branch.
- `archive/live-case-studies-snapshot-2026-03` — historical/reference snapshot.

Known original baseline:

- `16789fae5309cf8558700af4229494abf28b6e78`

The repository and live Case Studies source remain a P0 parity risk: current `main` does not fully represent the Case Studies pages that have been publicly accessible. Do not restore or overwrite public case pages from an arbitrary historical commit. Any restoration must remain selective and on a non-main branch until locally reproduced and reviewed.

## 4. Non-negotiable visual rules

- Use only current live website screenshots or exact current production source/assets.
- No generated interface imagery, synthetic canvases, placeholder portraits, invented dashboards, or ratio-matched stand-ins.
- Never approve a screenshot package from filenames, dimensions, hashes, or a capture log alone.
- Every selected PNG must be opened and visually inspected at 100% before approval.
- A technically correct screenshot can still be rejected for crop, hierarchy, whitespace, obstruction, responsive breakpoint, or lack of narrative value.
- Browser chrome must not appear in the source PNG.
- Closed chatbot launchers may remain when they are a real part of the product and do not obstruct content.
- Open chatbot panels are acceptable only in a deliberately selected chatbot proof frame.
- Full-page captures may be retained as QA references, but must not be used as tiny portfolio strips.
- No screenshot is canonical until the owner visually approves the actual image.

## 5. Prototype status

A portfolio prototype exists only under:

- `previews/portfolio-v1/`

It is not public and must not be promoted to production.

Earlier synthetic Alina and Local Repair visuals are rejected and must not appear in the portfolio. The current prototype may be used only as layout/reference code after all synthetic or obsolete project visuals are replaced with approved real captures.

## 6. Financial Stream — current status

### Content and evidence that are valid

- Real live client project.
- English and Russian live site.
- Payroll is an active service and must remain accurately represented.
- Structured request/intake, short contact form, calendar after context.
- Chatbase widget.
- Gmail + Make + OpenAI human-reviewed draft workflow.
- Twilio remains partial/testing unless stronger current proof is attached.
- Owner testimonial: Tetiana Horb.
- Current GSC evidence supplied by the owner:
  - 4.13K impressions over the shown three-month period;
  - 19 clicks;
  - 51 indexed pages;
  - indexing screenshot last updated 2026-07-09.
- GSC belongs in a separate restrained proof block, not as a main gallery hero.

### Screenshot package location

- `assets/img/cases/financial-stream/final-v1/`

### Relevant commits

- `92ecd25f1e2ed5041e6ad6bfce6b5b914adf5a48` — first raw package.
- `aa801d9479da618f9733efd429eda3c4e2dc979a` — review PDF; rejected as a useful review format.
- `05f7021765729b57e3a4e5782a788451dc76f03e` — approved RU homepage hero test.
- `eedd737c72bab603c4e2f0d10c283486fe71209a` — first eight-file package.
- `8ce7582bb9f28e4a08e1218bc8b99ef3158f16ba` — replaced two portrait how-we-work mobile files with Materials landscape files.

### Critical correction: the package is not visually approved

The mechanical GitHub upload and hash checks succeeded, but the screenshot set must not be called final or canonical.

At least this file is visually rejected:

- `assets/img/cases/financial-stream/final-v1/ru/mobile/fs-ru-04-materials-mobile-landscape.png`

Observed defects:

- hero/top content is cut off;
- the left headline begins outside the visible frame;
- the responsive state behaves like a desktop/tablet composition forced into a shallow landscape viewport;
- the right-side content is clipped and has no complete narrative;
- chatbot messages are open despite the intended closed-launcher state;
- the screenshot does not demonstrate a strong mobile experience.

The matching EN landscape file must also be visually reviewed and is not automatically approved.

The earlier portrait `how-we-work` mobile file was also rejected because of excessive top whitespace, incomplete lower crop, weak narrative value, and mismatch between RU/EN layouts.

### Current Financial Stream approval state

- RU desktop homepage hero: previously visually approved.
- All other seven current files: require fresh visual audit before use.
- Current `capture-log.txt`: useful technical metadata only; not proof of visual approval.
- Current package folder name `final-v1` is historical naming, not approval status.

## 7. Screenshot zoom and browser clarification

The owner verified that the interactive Google Chrome tabs were already at 100% zoom. A prior automation report that claimed 80% must not be treated as reliable without direct measurement.

Important distinctions:

- Browser page zoom and `deviceScaleFactor` are different settings.
- `deviceScaleFactor: 2` or `3` increases physical pixel density; it does not mean the webpage is zoomed to 200% or 300%.
- A clean Playwright/Codex browser context normally starts at default 100% page zoom, but this must still be logged and visually verified.
- Reusing an existing user Chrome profile can inherit zoom, extensions, overlays, and state; avoid it for canonical captures.

For every test capture, log:

- requested CSS viewport;
- `window.innerWidth` and `window.innerHeight`;
- `window.devicePixelRatio`;
- `window.visualViewport.scale` when available;
- physical PNG dimensions;
- actual URL and language;
- chatbot state.

Do not alter `document.body.style.zoom`, page CSS, or DevTools layout to make a screenshot fit.

## 8. Required screenshot workflow from this point

1. Do not batch-recapture all pages immediately.
2. First audit the actual eight current Financial Stream PNGs visually.
3. Produce an accept/reject table with one specific reason per file.
4. Do not modify GitHub during the audit.
5. Then create exactly one replacement test for the highest-priority rejected frame.
6. Save the test outside `final-v1`, under a review/test folder.
7. Open the actual raw PNG and obtain human visual approval.
8. Only after approval, capture the matching language version and remaining approved set.
9. Replace files in `final-v1` only after both visual and technical approval.
10. Update `capture-log.txt` after approval, not before.

Preferred immediate test:

- RU Materials in normal portrait mobile at `390 × 844` CSS px, `deviceScaleFactor: 3`, clean browser context, page zoom 100%, chatbot launcher closed, no open messages, and a complete meaningful composition.

Landscape `844 × 390` is currently rejected for this page unless a new raw test clearly proves that the live responsive composition works.

## 9. Alina Horb — current status

Canonical sources:

- `https://alinahorb.com/`
- `https://alinahorb.com/ru/`
- repository: `proaiexpert/alina-horb-website`

Current production truths:

- UA primary and RU secondary.
- Current editorial homepage.
- Real portrait assets:
  - `assets/images/portrait/alina-horb-hero-v3-1-desktop.webp`
  - `assets/images/portrait/alina-horb-hero-v3-1-mobile.webp`
- Current hero headline: `Психологічна підтримка, коли особливо важко`.
- Current Notes section and production images.

Status:

- no current approved screenshot package yet;
- old synthetic portrait/arch studies are rejected;
- capture only after Financial Stream visual workflow is proven.

## 10. Local Repair Pro — current status

Canonical source:

- repository: `proaiexpert/handyman-vancouver-portland-demo`
- current live/demo route documented in the master plan.

Truth label:

- `Website concept — in development`;
- English-only for the current portfolio pass;
- not a verified client project.

Status:

- no approved final screenshot package yet;
- synthetic handyman canvases are rejected;
- do not invent reviews, licensing, phone numbers, years, metrics, or client outcomes.

## 11. What is done

- Strategic portfolio architecture documented.
- EN/RU route model locked.
- Project classifications locked.
- Safety/reference branches created.
- Historical Case Studies source identified for reference.
- Non-public prototype created under `previews/portfolio-v1/`.
- Synthetic visual correction recorded.
- Financial Stream content/evidence direction substantially documented.
- Financial Stream screenshot capture infrastructure and naming demonstrated.
- One RU Financial Stream desktop hero visually approved.
- No public production rollout performed.

## 12. What is not done

- Financial Stream eight-image package is not visually approved.
- Financial Stream mobile replacement is unresolved.
- Remaining Financial Stream images have not been independently inspected and approved.
- Current source/live parity is not fully resolved for safe public Case Studies deployment.
- Full Financial Stream EN/RU case pages are not production-ready.
- Archive V2 is not production-ready.
- Alina current screenshot package is not captured/approved.
- Local Repair Pro current screenshot package is not captured/approved.
- Homepage, service pages, global navigation, footer, sitemap, metadata, and redirects have not been integrated.
- No public merge or launch has occurred.

## 13. Immediate next action

Perform a controlled visual audit and one-test recapture for Financial Stream.

Do not begin Alina, Local Repair Pro, archive production, or public integration until the Financial Stream screenshot workflow produces one visually approved replacement and the remaining set is audited.

## 14. Session rules for any new agent

- Read this file first.
- Then read the master plan and visual correction files.
- Do not infer approval from closed GitHub issues.
- Do not call `final-v1` final merely because of the folder name.
- Do not change `main`.
- Do not publish.
- Do not create new synthetic visuals.
- Do not perform a large batch before one test is visually approved.
- When reporting, separate technical verification from visual approval.
- Stop after the requested deliverable; do not create extra issues, PDFs, contact sheets, or variants.
