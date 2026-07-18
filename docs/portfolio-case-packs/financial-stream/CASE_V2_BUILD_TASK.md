# TASK — BUILD FINANCIAL STREAM LLC CASE STUDY V2

## Role

Act as the technical implementation agent for the ProAI Expert website repository.

Strategy, final structure, claims, metrics and selected visuals are already locked. Do not restart research or redesign the portfolio architecture.

---

## Repository and branch

Repository:

`proaiexpert/proaiexpert.github.io`

Work only on:

`portfolio-rebrand-v1`

Do not:

- modify `main`;
- publish;
- create a PR;
- change the production custom domain;
- rewrite unrelated homepage, service or Insights code;
- create a competing `/work/` or `/portfolio/` route system.

---

## Required source documents

Read in this order:

1. `docs/portfolio-case-packs/PORTFOLIO_REBRAND_CURRENT_HANDOFF.md`
2. `docs/portfolio-case-packs/PORTFOLIO_SITE_AUDIT_AND_MASTER_PLAN.md`
3. `docs/portfolio-case-packs/financial-stream/CASE_V2_MASTER_BRIEF.md`
4. `docs/portfolio-case-packs/financial-stream/SCREENSHOT_MANIFEST.md`
5. `docs/portfolio-case-packs/financial-stream/EVIDENCE_INDEX.md`

Do not use older dated notes to override these files.

---

## Final goal

Implement the Financial Stream flagship case in English and Russian:

- `/case-studies/financial-stream/`
- `/ru/case-studies/financial-stream/`

The pages must present a real bilingual accounting, Payroll and tax-support website system built around trust, structured intake, content/search depth and practical AI-assisted operations.

This task does **not** build the full Alina or Local Repair cases and does not perform final site-wide integration.

---

## Phase 0 — Resolve source/live parity

### Problem

The live ProAI Case Studies URLs have displayed full pages, while current `main` does not cleanly contain the matching source tree.

### Required investigation

1. Record current branch and `main` HEAD values.
2. Inspect GitHub Pages settings and deployment source.
3. Inspect relevant workflow files, recent Pages runs and available artifacts.
4. Inspect relevant branches and historical Case Studies commits.
5. Save current live EN/RU Financial Stream HTML and asset references for comparison.
6. Determine whether live pages are served from:
   - a historical Pages deployment;
   - another branch;
   - a workflow artifact;
   - a cache/proxy layer;
   - another verified source.
7. Identify the latest complete source that matches the current live narrative and shell.
8. Restore only required source files into `portfolio-rebrand-v1`.
9. Reproduce the existing routes locally before V2 changes.
10. Confirm that homepage, service pages, Insights and language routes are not reverted.

Useful historical references remain documented in the master plan and prior Git history. Restoration must be selective, not a repository rollback.

### Gate

Continue to implementation only if:

- the active source can be explained;
- a safe recovery method is documented;
- relevant routes work locally on the working branch;
- no unrelated current work is reverted.

If the source cannot be resolved safely, stop and report the blocker. Do not guess and do not overwrite the live case.

---

## Phase 1 — Preserve and prepare selected assets

### Canonical PNG masters

Use the ten selected files under:

`assets/img/cases/financial-stream/final-v1/`

Do not recapture, rename or replace them without explicit owner instruction.

Do not restore rejected Materials mobile-landscape files.

Do not create a second PNG-master directory such as `assets/images/case-fs-v2/`.

### Delivery derivatives

Create optimized WebP derivatives only where needed for the implemented pages.

Requirements:

- preserve all PNG masters;
- use descriptive filenames;
- maintain sufficient resolution for retina displays;
- avoid visible compression artifacts;
- record dimensions and output sizes in the final report;
- use `loading="lazy"` for non-hero visuals;
- use explicit width/height or aspect-ratio to reduce layout shift.

### Evidence assets

Search performance and indexing evidence is separate from the ten-image website package.

Use only redacted, contextual evidence that is suitable for public display.

Do not expose:

- account identities;
- private properties;
- unrelated search history;
- email addresses;
- client names/messages;
- tokens, webhook URLs or credentials.

---

## Phase 2 — Build the shared case-page foundation

Create or restore only the reusable components required by the Financial Stream case.

The implementation may include:

- case hero;
- status/meta strip;
- chapter navigation;
- proof strip;
- system-layer cards;
- screenshot panels;
- bilingual comparison module;
- evidence block;
- status-labelled automation block;
- testimonial module;
- verified outcomes;
- next-case transition shell;
- responsive typography and spacing tokens.

Requirements:

- scope styles to the portfolio/case system;
- avoid generic global selectors that can break existing pages;
- avoid introducing an unnecessary framework or build system;
- support `prefers-reduced-motion`;
- keep motion purposeful and restrained;
- make content readable without animation.

Do not build the full archive in this task. A minimal route/back-link shell is acceptable only when needed for local navigation.

---

## Phase 3 — Build the EN Financial Stream page

Route:

`/case-studies/financial-stream/`

Use this chapter order:

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

### Positioning direction

Present Financial Stream as a bilingual accounting, Payroll and tax-support website system designed for trust, structured inquiries, search depth and practical AI-assisted operations.

Do not paste that entire sentence into the H1 if a tighter editorial headline works better.

### Required proof points

- Live EN/RU architecture
- Structured + short inquiry paths
- Calendar after context
- AI-assisted navigation
- Dated search evidence

### Five layers

1. Trust and presentation.
2. Services and client self-selection.
3. Structured intake.
4. Content and search.
5. AI and automation.

### Service scope

Represent accurately:

- business formation;
- QuickBooks bookkeeping;
- cleanup/catch-up;
- Payroll and L&I;
- Sales Tax and DOR;
- tax preparation;
- document review and consulting.

Payroll is active. Do not remove or downgrade it.

---

## Phase 4 — Build the RU Financial Stream page

Route:

`/ru/case-studies/financial-stream/`

The Russian page must be an independent natural edition, not a mechanical translation.

Requirements:

- same verified facts;
- same chapter order;
- same metric context;
- same automation status labels;
- equivalent visual hierarchy;
- natural Russian business language;
- concise use of English product/regulatory terms where natural.

Terms such as QuickBooks, Payroll, L&I, Sales Tax, DOR, Chatbase, Make and Google Search Console may remain in English.

Do not create dense mixed-language headings.

---

## Current metrics — use exactly this framing

### Performance

EN:

> In a three-month Google Search Console snapshot reviewed in July 2026, Financial Stream recorded 19 clicks and approximately 4.17K search impressions.

RU:

> По трёхмесячному срезу Google Search Console, просмотренному в июле 2026 года, сайт Financial Stream получил 19 кликов и около 4,17 тыс. показов в поиске.

### Indexing

EN:

> A separate Google Search Console indexing snapshot, last updated July 9, 2026, showed 51 indexed pages.

RU:

> Отдельный срез индексирования Google Search Console, обновлённый 9 июля 2026 года, показывал 51 проиндексированную страницу.

Keep these as separate snapshots.

Do not use `3.88K` or `41 indexed pages` as current headline values. Those figures belong to older historical evidence.

---

## Canonical owner testimonial

Use one main testimonial:

> ProAI Expert helped us create a stronger business website — one that looks professional, builds more trust, and presents our services more clearly. At the same time, we gained a more practical structure for both our clients and our team.

**Tetiana Horb**  
**CEO, Financial Stream LLC**

Create one natural approved Russian rendering for the RU page.

Do not introduce multiple materially different owner quotes.

---

## Automation status labels

### Live / implemented

- Chatbase website assistant;
- Gmail + Make + OpenAI draft workflow with human review.

### Tested / partial

- Twilio missed-call and service-SMS architecture;
- routing/webhook work;
- status logging where current proof exists.

### Planned

- stable end-to-end missed-call recovery if not freshly proven;
- full CRM;
- automation reporting/ROI;
- autonomous communication.

The UI must make these statuses unambiguous.

---

## Claims guardrails

Allowed:

- real live client project;
- bilingual EN/RU website;
- active Payroll service;
- structured request and short form;
- booking after context;
- Chatbase as AI-assisted navigation;
- human-reviewed Gmail draft workflow;
- Twilio/Make as tested/partial;
- dated GSC values;
- contextual manual SERP examples;
- responsive desktop/mobile implementation.

Prohibited without new evidence:

- lead growth;
- conversion-rate growth;
- revenue growth;
- customers generated by the website;
- measured time savings;
- SEO ROI;
- traffic growth without a baseline;
- universal or guaranteed ranking;
- fully production-ready Twilio recovery;
- production CRM;
- autonomous client communication;
- guaranteed outcomes.

---

## SEO and language requirements

Each page must have:

- one H1;
- unique title and meta description;
- self-referencing canonical;
- reciprocal `hreflang="en"` and `hreflang="ru"`;
- `x-default` pointing to EN;
- correct language attribute;
- meaningful Open Graph/Twitter image;
- descriptive alt text;
- internal links to the live project, ProAI contact and archive route;
- breadcrumb/schema only if implemented accurately.

Do not add routes to the production sitemap until source parity and final launch are approved.

---

## Accessibility and responsive requirements

- semantic landmarks;
- logical heading hierarchy;
- keyboard-operable navigation and controls;
- visible focus styles;
- sufficient contrast;
- reduced-motion support;
- no content available only through hover;
- no horizontal overflow;
- readable screenshots and captions;
- no tiny text inside decorative device frames.

Test at minimum:

- 320px;
- 375px;
- 390px;
- 430px;
- 768px;
- 1024px;
- 1440px;
- short-height landscape mobile.

---

## Functional QA

Confirm:

- both case routes load locally;
- EN/RU switch maps exact case pairs;
- archive/back links do not lead to unrelated pages;
- live Financial Stream CTA works;
- ProAI contact CTA works;
- chapter navigation works with keyboard and reduced motion;
- images exist and do not cause layout shift;
- no console errors are introduced;
- no missing assets;
- no global style collision;
- existing homepage, service, Insights and contact behavior remains intact.

---

## Commit plan

Keep commits atomic and reviewable:

1. source/live parity recovery;
2. shared case foundation;
3. EN Financial Stream page;
4. RU Financial Stream page;
5. WebP/asset optimization;
6. metadata/accessibility/responsive QA fixes.

Do not squash unrelated work into these commits.

Do not merge to `main`.

---

## Required final report

Return:

1. source/live parity finding;
2. active deployment source or remaining blocker;
3. exact files restored, created and changed;
4. routes implemented;
5. asset inventory and WebP dimensions/sizes;
6. EN/RU content summary;
7. metrics used;
8. automation labels used;
9. QA results by viewport;
10. console/link test results;
11. commit SHAs;
12. remaining limitations;
13. local preview instructions.

Then stop.

Do not build Alina, Local Repair Pro, final archive integration, global navigation, sitemap publication or production deployment in this task.
