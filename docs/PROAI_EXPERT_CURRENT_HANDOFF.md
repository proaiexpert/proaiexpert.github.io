# PROAI Expert — Current Handoff

**Status:** Canonical project handoff after completion of Portfolio Core and Phase A global integration.

## 1. Authority and Source of Truth

- **Repository:** `proaiexpert/proaiexpert.github.io`
- **Production branch:** `main`
- **Portfolio Core merge:** PR #17
- **Superseded integration attempt:** PR #18 — closed, never merged
- **Phase A integration:** PR #19 — merged
- **Phase A implementation merge SHA:** `fa4f8f4a2bc2c50b9de1dbee69213b3f1029a418`
- **Phase A reviewed head SHA:** `b03e94d2e5f0962cb45588f1756e3ed92fbccb51`
- **Canonical handoff path:** `docs/PROAI_EXPERT_CURRENT_HANDOFF.md`

This file is the primary source of truth for the next main website workstream. Older tasks, audit documents, and PR reports remain historical references and must not override the status recorded here.

## 2. Completed Portfolio Core

The following portfolio system is implemented and published in EN and RU:

- Portfolio Archive.
- Financial Stream flagship case.
- Alina Horb bilingual psychologist case.
- Local Repair Pro concept case.

Protected portfolio principles:

- each case keeps a distinct art direction;
- evidence must remain truthful and screenshot-led;
- Local Repair Pro remains explicitly framed as a concept/in-development project;
- no unsupported traffic, ranking, lead, revenue, or business-outcome claims;
- Financial Stream remains the strongest currently published quantitative proof;
- Alina Horb may receive additional outcome evidence only after a separate Evidence Pack is approved.

## 3. Completed Phase A Scope

Phase A was merged through PR #19 and includes:

- fixed global-header parity across EN/RU core pages, Insights, Archive, and case studies;
- responsive navigation with EN breakpoint at 1100px and RU breakpoint at 1200px;
- no dead range between desktop navigation and the hamburger panel;
- unique `site-navigation`, localized labels, `aria-controls`, and `aria-current`;
- EN/RU homepage Financial Stream CTA hierarchy:
  - case study;
  - live site;
  - all case studies;
- one `<main>` landmark on the EN and RU homepages;
- portfolio-only compact footer with a contained `PROAI EXPERT` backmark;
- final case-page sequence:
  `Evidence/content → Cross-case navigation → Final CTA → Footer`;
- Alina Horb progress rail:
  - hidden through 1450px;
  - visible above 1450px;
  - dark/ivory state adaptation;
  - reserved right-side content corridor to prevent overlap;
- public name correction:
  - RU `Татьяна Горб`;
  - EN `Tetiana Horb`.

## 4. QA and Review Record

Phase A passed the following controls before merge:

- UTF-8 and BOM checks on targeted HTML;
- Alina rail CSS normalized without NUL bytes;
- valid doctype/html/head/body structure;
- no duplicated primary Case Studies/Кейсы navigation items;
- one cross-case navigation block per individual case;
- no orphan navigation or section fragments;
- responsive menu verification across desktop, laptop, tablet, and mobile widths;
- direct visual review of corrected Playwright captures;
- EN/RU Financial Stream CTA verification;
- all three RU case-ending sequences reviewed;
- desktop and 390px portfolio footer reviewed;
- Alina rail reviewed on real dark and ivory sections at 1600px without text overlap;
- Alina rail confirmed hidden at 1366px;
- Lighthouse homepage Accessibility improved from 99 to 100;
- tested Best Practices and SEO remained 100.

Temporary visual-review PR #20 was closed without merge. Its branch and artifacts were review-only and are not part of production architecture.

## 5. Deferred and Separate Workstreams

These workstreams are intentionally separate from the completed Phase A merge:

### Website Acquisition Article Cluster

- two strategic topics;
- four independently localized RU/EN articles;
- separate SERP, Google, SEO, localization, cannibalization, schema, and internal-link review;
- article production remains in its dedicated chat/workstream.

### Verified Business Outcomes

- do not publish new inquiry, paid-continuation, ranking, traffic, or conversion claims without an approved evidence package;
- Alina Horb outcome evidence remains pending a separate approval process.

### Chatbase / Chatbot

- separate future task;
- preferred direction is a first-party, click-only launcher;
- must not be introduced as part of unrelated site work.

### Homepage and Core Performance

- homepage LCP remains slow in the Lighthouse test environment;
- performance work is deferred to a dedicated optimization task;
- Phase A did not establish a material performance regression relative to its tested baseline.

## 6. Do-Not-Touch Rules

Do not change without a separate approved task:

- approved portfolio concepts and case identities;
- Local Repair Pro truth framing;
- current public case-study URLs;
- canonical, hreflang, schema, sitemap, or robots configuration unless a concrete defect is first verified;
- screenshot-first evidence discipline;
- article bodies while working on unrelated shell or portfolio tasks;
- contact-form fields;
- Chatbase integration;
- unverified business claims.

Do not modify `main` directly. Use a dedicated branch and Pull Request for every implementation task.

## 7. Current Published Technical Baseline

The functional website baseline is the `main` branch at or after the Phase A merge commit:

`fa4f8f4a2bc2c50b9de1dbee69213b3f1029a418`

Any future task must first:

1. read this handoff completely;
2. inspect the current `main` SHA and current open PRs;
3. confirm that no newer canonical handoff supersedes this file;
4. separate website implementation from article production;
5. avoid carrying forward obsolete statuses from PR #18 or intermediate PR #19 reports.

## 8. Exact Next Step

Open a new main ProAI Expert website chat/workstream and begin from this canonical handoff.

The next website task must be selected as a discrete workstream rather than continuing unfinished Phase A work. The Website Acquisition Article Cluster remains in its separate article chat until the four articles are ready for independent final review.
