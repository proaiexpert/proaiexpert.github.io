# FINANCIAL_STREAM_FLAGSHIP_PHASE_A_IMPLEMENTATION_PREVIEW_TASK_V1

## Status

Owner-approved executable Codex task for **Phase A implementation preview**.

This task implements the complete EN/RU Financial Stream flagship case on the protected working branch for local visual review. It does not authorize V2 master promotion, PR creation, merge or publication.

---

## 1. Repository and branches

Repository:

`proaiexpert/proaiexpert.github.io`

Working branch:

`portfolio-rebrand-v1`

Protected production branch:

`main`

Public domain:

`https://proai-expert.com/`

GitHub Pages publishes from `main`, repository root.

Do not modify `main`.

Continue in the existing repository workspace when possible.

Before editing:

1. fetch remote refs;
2. fast-forward/synchronize `portfolio-rebrand-v1` safely;
3. confirm the branch includes:
   - selective recovery commit `f6b0a5abb464a8381e44bb5378f19a11ae43ac14`;
   - the current approved Production Spec;
   - the Phase A owner-approval record;
   - this task;
4. record the exact starting HEAD;
5. inspect `git status`;
6. preserve any unrelated user file or uncommitted work without staging or modifying it.

The known user file below must remain unchanged and unstaged if it still exists:

`assets/img/cases/financial-stream/review-tests/fs-ru-bookkeeping-mobile-review-v1.png`

---

## 2. Mandatory reading order

Read every file completely before implementation:

1. `AGENTS.md`
2. `docs/portfolio-case-packs/PORTFOLIO_REBRAND_CURRENT_HANDOFF.md`
3. `docs/portfolio-case-packs/financial-stream/FINANCIAL_STREAM_FLAGSHIP_CASE_OWNER_APPROVAL_PHASE_A_2026-07-18.md`
4. `docs/portfolio-case-packs/financial-stream/FINANCIAL_STREAM_FLAGSHIP_CASE_PRODUCTION_SPEC_V1.md`
5. `docs/portfolio-case-packs/PORTFOLIO_CASE_ART_DIRECTION_AND_MOTION_SYSTEM_V1.md`
6. `docs/portfolio-case-packs/financial-stream/SCREENSHOT_MANIFEST.md`
7. `docs/portfolio-case-packs/financial-stream/EVIDENCE_INDEX.md`
8. `docs/portfolio-case-packs/financial-stream/CASE_V2_MASTER_BRIEF.md`
9. `docs/portfolio-case-packs/source-live-parity/CASE_STUDIES_SELECTIVE_RECOVERY_MANIFEST_V2.md`
10. current restored pages:
    - `case-studies/financial-stream/index.html`
    - `ru/case-studies/financial-stream/index.html`
11. current shared shell assets referenced by those pages and the current EN/RU homepage/header/footer.

The approved Production Spec is the content and experience authority.

Older blueprints and build tasks cannot override it.

---

## 3. Explicit AGENTS.md scope authorization

`AGENTS.md` defines a normal edit limit of three files and requires a stop/report before broader work.

The owner has approved this complete Phase A implementation and explicitly authorizes a bounded exception of **up to 40 changed or newly generated tracked files**, only within the allowlist below.

This authorization does not permit general cleanup or unrelated refactoring.

If the exact required tracked scope exceeds 40 files, stop and report before editing beyond the limit.

---

## 4. Allowed tracked-file scope

### Existing public pages that may be replaced

- `case-studies/financial-stream/index.html`
- `ru/case-studies/financial-stream/index.html`

### New route-specific implementation assets

Prefer dedicated files so shared current pages are not destabilized:

- `assets/css/case-financial-stream-v2.css`
- `assets/js/case-financial-stream-v2.js`

Equivalent clearly named route-specific paths are allowed only when current repository conventions require them.

### Optimized delivery derivatives

Create only directly required derivatives under:

`assets/img/cases/financial-stream/delivery-v2/`

Allowed derivative sources:

- selected masters in `assets/img/cases/financial-stream/final-v1/`;
- four approved files in `assets/img/cases/financial-stream/review-candidates-v2/`.

Recommended derivative strategy:

- responsive WebP candidates for wide screenshots at approximately 640, 1120 and 1920 px widths where useful;
- one optimized WebP for each original-width Company Formation portrait;
- localized route-matched OG derivatives only when directly required for the two case pages.

Do not create another PNG-master directory.

### Internal implementation report

- `docs/portfolio-case-packs/financial-stream/FINANCIAL_STREAM_FLAGSHIP_PHASE_A_IMPLEMENTATION_REPORT_V1.md`

### Files that may be read but not modified

- `assets/css/main.css`
- `assets/js/nav.js`
- all files in `final-v1/`;
- all files in `review-candidates-v2/`;
- `sitemap.xml`;
- global homepage, About, Contact, service and Insights source files;
- archive and ProAI Expert case pages;
- all Alina Horb and Local Repair Pro materials.

If implementation appears to require modification of a shared CSS/JavaScript file outside the allowlist, stop and report the exact dependency. Do not silently widen scope.

---

## 5. Strict prohibitions

Do not:

- modify `main`;
- create a PR;
- merge;
- publish;
- trigger Pages or another production deployment;
- edit `sitemap.xml`;
- redesign the Case Studies archive;
- implement Alina Horb, Local Repair Pro or ProAI Expert pages;
- change unrelated navigation or footer source files;
- promote, rename, delete, overwrite or recapture V2 candidates;
- overwrite legacy Request/Reporting PNG masters in `final-v1`;
- change approved public EN/RU copy except for an obvious encoding or punctuation defect that blocks implementation;
- add a seventh motion class;
- add raw/redacted GSC, Gmail, Make, Twilio, Google Sheet or CRM screenshots;
- add fake browser chrome, MacBook, iPhone or generic hardware frames;
- add synthetic dashboards or generated project imagery;
- add unsupported business outcomes;
- perform broad repository cleanup;
- remove historical recovery files;
- commit local preview screenshots.

---

## 6. Pre-edit implementation manifest

Before writing code, create an internal working manifest, not necessarily committed, that lists:

- each planned tracked path;
- whether it is existing/new;
- why it is required;
- source master for every derivative;
- expected responsive sizes;
- whether the file affects EN, RU or both.

Proceed only when:

1. all paths are inside the allowlist;
2. tracked scope is no more than 40 files;
3. no shared current file must be overwritten;
4. both language routes can be implemented symmetrically;
5. the four V2 candidate originals remain untouched.

Record the final path list in the implementation report.

---

## 7. Public routes to implement

Implement exactly:

- `/case-studies/financial-stream/`
- `/ru/case-studies/financial-stream/`

Do not create alternative `/work/` or `/portfolio/` routes.

Do not edit the Case Studies archive in this phase.

Both pages must:

- return local HTTP 200;
- use exact paired language switching;
- contain self-canonical, reciprocal `en`/`ru` hreflang and `x-default`;
- use the current ProAI shell without changing shared site files;
- preserve valid global navigation destinations;
- contain one H1 and the complete twelve-chapter case.

---

## 8. Content implementation

Use the exact public EN/RU copy from:

`FINANCIAL_STREAM_FLAGSHIP_CASE_PRODUCTION_SPEC_V1.md`

Implement all twelve chapters in this locked order:

1. Hero.
2. Proof strip.
3. Business challenge.
4. Five-layer system architecture.
5. Bilingual experience.
6. Service architecture.
7. Intake before booking.
8. Content and search foundation.
9. AI and automation status.
10. Owner testimonial.
11. Verified outcomes.
12. Live project and ProAI CTA.

Rules:

- do not summarize or shorten approved chapter copy without a blocking layout reason;
- do not mechanically equalize EN/RU line counts;
- do not expose internal labels such as `V2 candidate`, `portfolio master`, DPR or missing capture metadata in public source rails;
- keep Payroll active;
- keep performance and indexing as separate evidence records;
- do not add historical `3.88K` or `41 indexed pages` as current values;
- do not add traffic-growth, leads, conversion, revenue, ROI or guaranteed-ranking claims;
- use the approved RU testimonial exactly;
- use semantic `blockquote` and attribution markup.

---

## 9. Visual system

Implement:

- `Structured Trust / Доверие по системе`;
- ProAI near-black shell;
- Financial Stream midnight navy;
- ice-white documentary surfaces;
- neutral proof surfaces;
- restrained cyan for alignment/verified relation;
- restrained green only for confirmed `LIVE` operational state;
- editorial typography and measured line lengths;
- local Evidence Reconciliation Register;
- 12-column large-desktop grid and 4-column mobile grid.

Do not implement:

- permanent visible technical grid;
- continuous cyan line through the full page;
- generic card wall;
- glassmorphism;
- dashboard metric tiles;
- excessive pills;
- large glow;
- fake devices;
- browser chrome;
- repeated identical section composition.

The Register appears only where specified. It is not a second navigation system.

---

## 10. Hero and first viewport

Large desktop target:

- text columns 1–4;
- route-matched homepage proof columns 5–12;
- screenshot may extend toward the right viewport edge;
- hero remains content-height, not forced to 100vh;
- screenshot visible at first paint;
- no sticky hero.

First viewport must include:

- truth label;
- status;
- H1;
- thesis;
- two CTAs;
- real route-matched homepage proof;
- caption/source rail or their immediate continuation;
- beginning of the proof strip.

Do not add search metrics, the full service taxonomy, automation ledger or second-language screenshot to the first viewport.

Implement `Evidence Lock` exactly within the Production Spec limits.

---

## 11. Screenshot placement

### Chapter 1 — route-matched homepage

EN source:

`assets/img/cases/financial-stream/final-v1/en/desktop/fs-en-01-home-hero-desktop.png`

RU source:

`assets/img/cases/financial-stream/final-v1/ru/desktop/fs-ru-01-home-hero-desktop.png`

### Chapter 5 — only explicit bilingual pair

EN portrait:

`assets/img/cases/financial-stream/final-v1/en/mobile/fs-en-04-company-formation-mobile-portrait.png`

RU portrait:

`assets/img/cases/financial-stream/final-v1/ru/mobile/fs-ru-04-company-formation-mobile-portrait.png`

Show the current route language first. Use complete portrait frames and no phone hardware.

### Chapter 7 — route-matched Request V2 candidates

EN candidate:

`assets/img/cases/financial-stream/review-candidates-v2/en/desktop/fs-en-02-request-desktop-v2-candidate.png`

RU candidate:

`assets/img/cases/financial-stream/review-candidates-v2/ru/desktop/fs-ru-02-request-desktop-v2-candidate.png`

Use either direct candidate references or temporary WebP derivatives sourced from them.

Do not promote them into `final-v1`.

The proof must preserve:

- short-message hierarchy;
- safety guidance;
- route back to structured request.

It must not claim that the structured-request form itself is visible.

### Chapter 8 — route-matched Materials

EN source:

`assets/img/cases/financial-stream/final-v1/en/desktop/fs-en-04-materials-desktop.png`

RU source:

`assets/img/cases/financial-stream/final-v1/ru/desktop/fs-ru-04-materials-desktop.png`

Use one route-matched screen per route. Do not create an EN/RU desktop pair.

### Chapter 9 — route-matched Reporting V2 candidates

EN candidate:

`assets/img/cases/financial-stream/review-candidates-v2/en/desktop/fs-en-03-reporting-chat-desktop-v2-candidate.png`

RU candidate:

`assets/img/cases/financial-stream/review-candidates-v2/ru/desktop/fs-ru-03-reporting-chat-desktop-v2-candidate.png`

Preserve both the Reporting context and complete localized answer.

Do not imply autonomous accounting or communication.

### Figure count

Each route renders six figures:

1. route-matched homepage;
2. EN Company Formation portrait;
3. RU Company Formation portrait;
4. route-matched Request V2;
5. route-matched Materials;
6. route-matched Reporting V2.

No route displays all ten unique assets.

---

## 12. Proof-surface treatment

Use:

- semantic `figure` and adjacent `figcaption`;
- exact approved caption;
- concise public source rail;
- exact alt-text foundation;
- one thin border;
- 8–12 px radius;
- one restrained mat or shadow;
- controlled crop only where permitted;
- full portrait frames for Company Formation.

Do not combine glow, glass, heavy shadow, thick border and large radius.

On mobile, wide screenshots may use controlled focal windows only when:

- the captioned proof remains visible;
- no required safety/limitation context is removed;
- a descriptive link exposes an optimized complete capture;
- horizontal swipe is not required to understand the claim.

Do not link directly to a multi-megabyte PNG when an optimized complete derivative can be provided.

---

## 13. Chapter 4 sticky behavior

Chapter 4 is the only allowed sticky storytelling section.

Enable only when:

- viewport width is at least 1200 px;
- viewport height is at least 760 px;
- reduced motion is not requested;
- zoom/reflow or focus behavior does not make it unsafe.

Rules:

- all five layers remain visible and readable;
- active layer receives a local register alignment state;
- no accordion or hidden adjacent content;
- sticky content occupies no more than approximately 62% of viewport height;
- top offset accounts for global header and chapter bar;
- final layer releases before Chapter 5;
- tablet, mobile, short-height, reduced-motion and no-JS use a static ordered stack.

No other screenshot or chapter becomes sticky.

---

## 14. Chapter orientation

After the proof strip:

- eligible desktop may use one compact labelled 44–48 px chapter bar;
- ordinary anchor links remain available;
- do not use dot navigation or an icons-only control;
- at 768–1099 px keep orientation in normal flow;
- below 768 px use a compact in-flow contents disclosure/list;
- no horizontal chapter carousel;
- no swipe dependency.

Without JavaScript, render a complete static table of contents.

Sticky orientation must never obscure keyboard focus.

---

## 15. Motion implementation

Implement no more than these six effect classes:

1. Evidence Lock.
2. Layer Reconciliation.
3. Proof Surface Settle.
4. Surface Handoff.
5. Source Lock.
6. Register Closure.

Use the exact movement, timing and fallback limits in the Production Spec.

Rules:

- essential content is visible initially;
- opacity never begins at zero for essential content;
- only one large raster moves at a time;
- no blur, scale, parallax, scanline, animated number, cursor effect, continuous line drawing, 3D or autoplay media;
- no generic fade-up applied to every heading/card;
- `prefers-reduced-motion` suppresses non-essential translation rather than only shortening duration;
- no-JS renders final states.

---

## 16. Responsive implementation

Meet the complete Production Spec matrix at:

- 1440+;
- 1100–1439;
- 1024 landscape tablet;
- 768 portrait tablet;
- 430;
- 390;
- 375;
- 320;
- short landscape under 720 px height;
- 400% zoom / 320 CSS px equivalent.

Required:

- no page-level horizontal overflow;
- natural RU wrapping;
- no forced EN/RU height parity;
- no fixed minimum width on evidence records;
- full-width stacked CTAs when needed;
- source rails remain attached and readable;
- all sticky behavior disabled on short/zoom/reduced-motion states;
- no primary content dependent on horizontal scrolling.

---

## 17. Accessibility

Target WCAG 2.2 AA.

Implement and verify:

- skip link;
- header, nav, main and footer landmarks;
- one H1;
- sequential H2 chapter hierarchy;
- keyboard-operable chapter navigation;
- visible focus;
- no focus obscuration by sticky elements;
- text plus color for status;
- semantic figures/captions;
- useful concise alt text;
- screenshot evidence repeated in real text;
- accessible full-capture links;
- semantic testimonial;
- no hover-only information;
- approximately 44×44 CSS px actionable targets where feasible;
- correct `lang` per route;
- language annotations for material foreign-language fragments when needed;
- complete reduced-motion and no-JS experience;
- 320 CSS px reflow without information loss.

Use automated accessibility tooling when available, but also perform keyboard and visual focus checks.

---

## 18. Performance

Targets for lab verification, separately on mobile and desktop where tooling permits:

- LCP ≤ 2.5 s;
- INP ≤ 200 ms;
- CLS ≤ 0.1.

Do not claim field Core Web Vitals from local tests.

Implementation rules:

- only route-matched hero is eager/high-priority;
- all other screenshots lazy-load;
- preserve intrinsic dimensions/aspect ratios;
- use responsive WebP candidates;
- preserve all PNG masters;
- avoid 2880 px delivery to 320 px windows;
- no filter/blur/scale animation;
- no multiple large-raster animation;
- no new framework;
- no motion library;
- no canvas, WebGL, video or autoplay;
- JavaScript small, deferred and non-blocking;
- page works if enhancement script fails.

Run Lighthouse or equivalent when available and report exact test conditions and values. Treat results as lab measurements.

---

## 19. Metadata and SEO

Implement exact localized metadata from the Production Spec.

Required:

- EN/RU localized title and description;
- self-canonical;
- self-inclusive and reciprocal `en`/`ru` hreflang;
- `x-default` to EN;
- exact paired language switch;
- correct document `lang`;
- localized Open Graph title/description;
- route-matched OG image derivative when created within allowed scope;
- breadcrumb path `Home → Case Studies → Financial Stream`;
- truthful `WebPage` and `BreadcrumbList` only if structured data is used;
- no `Review`, `AggregateRating` or invented performance schema;
- no temporary preview route;
- no sitemap change in Phase A.

---

## 20. CTA destinations

Use the exact labels and destinations in the Production Spec.

Verify at minimum:

- hero system anchor;
- route-matched live Financial Stream homepage;
- route-matched structured-request/contact page;
- route-matched Materials page;
- route-matched ProAI contact page;
- route-matched Case Studies archive link.

External Financial Stream links must be visually identifiable. New-tab behavior is optional; when used, communicate it accessibly.

---

## 21. No-JavaScript and reduced-motion verification

### No JavaScript

Verify both routes with JavaScript disabled:

- all twelve chapters visible;
- figures and captions visible;
- all CTAs work;
- static table of contents visible;
- no inert chapter-only control;
- no content stuck in an initial animation state;
- no hidden Five-layer content.

### Reduced motion

Emulate `prefers-reduced-motion: reduce`:

- non-essential translations disabled;
- final states rendered;
- no sticky storytelling when it risks motion or focus issues;
- page remains visually coherent.

---

## 22. Protected-route regression check

After implementation, locally retest at minimum:

- `/`
- `/about/`
- `/contact/`
- `/websites-branding/`
- `/ai-systems/`
- `/insights/`
- `/case-studies/`
- `/case-studies/proai-expert/`
- `/ru/`
- `/ru/about/`
- `/ru/contact/`
- `/ru/websites-branding/`
- `/ru/ai-systems/`
- `/ru/insights/`
- `/ru/case-studies/`
- `/ru/case-studies/proai-expert/`

Confirm:

- current pages still return HTTP 200 locally;
- no protected file was replaced;
- no new console error was introduced;
- shared navigation and assets still resolve.

Alina Horb and Local Repair Pro portfolio routes may remain 404 in this phase.

---

## 23. Preview capture package

Do not commit preview screenshot binaries.

Save the preview package outside tracked repository paths, for example:

`<workspace-temp>/financial-stream-phase-a-previews/`

Capture complete full-page screenshots for both EN and RU at:

- 1440 desktop;
- 1100 standard desktop;
- 1024 tablet landscape;
- 768 tablet portrait;
- 430 mobile;
- 390 mobile;
- 375 mobile;
- 320 mobile;
- short landscape.

Also capture or document:

- Chapter 4 eligible sticky state on desktop;
- mobile chapter contents control;
- reduced-motion state;
- no-JavaScript state;
- 400% zoom/reflow equivalent;
- open keyboard focus state for primary navigation and one chapter link.

Return direct local links/paths to the preview files in the final response.

At minimum, surface these six priority previews prominently:

1. EN 1440 full page;
2. RU 1440 full page;
3. EN 390 full page;
4. RU 390 full page;
5. EN Chapter 4 sticky state;
6. RU mobile chapter/content state.

Do not claim visual QA for any viewport that was not actually rendered.

---

## 24. QA commands and evidence

Use the repository's available tooling. At minimum perform:

- local static-server/build reproduction;
- HTTP route checks;
- asset-resolution checks;
- internal-link checks;
- browser console checks;
- keyboard navigation;
- reduced-motion emulation;
- JavaScript-disabled browser test;
- responsive overflow checks;
- HTML/metadata inspection;
- `git diff --check`;
- final tracked-path scope verification.

When available, also perform:

- HTML validation;
- accessibility scan such as axe;
- Lighthouse desktop/mobile lab run;
- image-size and `srcset` verification.

Record exact commands, browser/tool versions where readily available, results and limitations in the implementation report.

---

## 25. Implementation report

Create:

`docs/portfolio-case-packs/financial-stream/FINANCIAL_STREAM_FLAGSHIP_PHASE_A_IMPLEMENTATION_REPORT_V1.md`

Include:

1. starting branch HEAD;
2. final commit SHA;
3. exact changed/generated tracked files;
4. source-to-derivative image mapping;
5. EN/RU route implementation summary;
6. screenshot placement confirmation;
7. motion implementation confirmation;
8. responsive test matrix;
9. accessibility results;
10. no-JS and reduced-motion results;
11. metadata/SEO results;
12. performance lab results and conditions;
13. protected-route regression results;
14. preview screenshot paths;
15. known limitations;
16. explicit confirmation that V2 candidates and `final-v1` masters were not modified;
17. explicit confirmation that `main`, PR, deployment and sitemap were untouched.

Do not include private data or access tokens.

---

## 26. Commit and push

When and only when implementation and required QA pass:

1. stage only allowed tracked paths;
2. confirm preview screenshot binaries are not staged;
3. commit with title:

`feat: build Financial Stream Phase A case previews`

4. push only to:

`portfolio-rebrand-v1`

Do not:

- push to `main`;
- create a PR;
- merge;
- publish;
- trigger Pages manually.

If QA does not pass, do not create a misleading success commit. Report blockers and preserve a safe working state.

---

## 27. Stop conditions

Stop before destructive or out-of-scope action when:

- required tracked scope exceeds 40 files;
- a shared file outside the allowlist must be modified;
- branch state no longer safely contains the recovered baseline;
- an approved V2 candidate is missing or differs unexpectedly;
- an existing `final-v1` master would need to be overwritten;
- protected current pages regress;
- exact approved copy cannot be implemented without material change;
- a required proof becomes unreadable at the specified viewport;
- the working tree contains unrelated changes that cannot be isolated;
- preview or browser tooling cannot produce reliable visual evidence.

Report the exact blocker. Do not improvise through broad refactoring, rollback or publication.

---

## 28. Final response format

Return one technical report with these headings:

1. `Implementation result`
2. `Starting and final repository state`
3. `Files changed`
4. `EN/RU route summary`
5. `Screenshot and V2 safety`
6. `Responsive and visual QA`
7. `Accessibility, reduced-motion and no-JS QA`
8. `Performance and metadata QA`
9. `Protected-route regression`
10. `Preview package`
11. `Remaining issues`
12. `Commit and safety confirmation`

End with exactly one status:

- `READY FOR OWNER VISUAL REVIEW`
- `NOT READY — BLOCKERS REMAIN`

Stop after the report.
