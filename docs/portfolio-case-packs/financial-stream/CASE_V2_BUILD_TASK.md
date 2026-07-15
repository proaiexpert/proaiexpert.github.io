# TASK — BUILD FINANCIAL STREAM LLC CASE STUDY V2

## Role

Act as the implementation agent for the ProAI Expert website repository.

## Goal

Rebuild the existing Financial Stream LLC portfolio case as the strongest real-client case on ProAI Expert, using the verified materials in:

`docs/portfolio-case-packs/financial-stream/CASE_V2_MASTER_BRIEF.md`

Do not restart research. Do not redesign the entire ProAI website. Do not create a separate `/work/` system.

Use the existing Case Studies architecture:

- `/case-studies/`
- `/ru/case-studies/`
- `/case-studies/financial-stream/`
- `/ru/case-studies/financial-stream/`

---

## Critical facts

1. **Payroll is an active Financial Stream service.**
   - Do not remove it.
   - Do not label it legacy.
   - Include it naturally in service architecture and relevant screenshots.

2. Financial Stream is a real live client project.

3. Tetiana Horb is the owner of Financial Stream LLC.

4. Use only verified claims. Do not invent traffic, lead, conversion or revenue outcomes.

5. Automation status must be separated into:
   - live / implemented;
   - tested / partial;
   - planned.

6. The existing live Financial Stream case must not be overwritten from an old historical HTML file without first resolving source/live parity.

---

## Phase 0 — Resolve source/live parity

### Problem

The live ProAI URLs currently show full case-study pages, but the current `main` branch contains a redirect at `case-studies/index.html`, and the Financial Stream case HTML is not available through the current GitHub Contents API.

### Required investigation

Determine the actual source used by the live deployment:

- inspect GitHub Pages settings and deployment workflow;
- inspect recent Pages deployments and artifacts;
- inspect branches and workflow outputs;
- determine whether Cloudflare or another cache/deployment layer serves historical files;
- compare live HTML with historical refs.

Useful historical refs:

- `a3108b66b3601ce04542492c7328689d3e7c50eb`
- `2a1d6095a93415c7528fa67be7472d78c33b1aa9`
- `90e1da831ba48a17542f2ba4759c1b456c978025`

### Gate

Before changing public pages, document:

- current real source branch or artifact;
- exact source file paths;
- whether the live pages are stale cached files;
- safest method to restore the pages into the current source of truth.

Do not proceed with blind replacement.

---

## Phase 1 — Preserve and inventory existing assets

### Confirmed current-main assets

- `assets/img/cases/financial-stream/fs-home-desktop-en-1600w.webp`
- `assets/img/cases/financial-stream/fs-home-mobile-en-640w.webp`

These are currently used in the ProAI homepage Financial Stream testimonial/device composition.

### Historical assets to recover only if still useful

From commit `2a1d6095a93415c7528fa67be7472d78c33b1aa9`:

- `assets/images/case-fs/fs-home-en.webp`
- `assets/images/case-fs/fs-home-ru.webp`
- `assets/images/case-fs/fs-services-en.webp`
- `assets/images/case-fs/fs-services-ru.webp`

Prefer fresh live captures when the old screenshots no longer match the current Financial Stream site.

### Evidence assets

Use the internal files under:

`docs/portfolio-case-packs/financial-stream/evidence/`

Do not publish raw evidence without redaction and contextual captions.

---

## Phase 2 — Capture current Financial Stream screens

Capture from the current live production website, not old ZIPs or local legacy previews.

### Required captures

1. EN homepage hero — desktop 1440×900.
2. RU homepage hero — same viewport and crop.
3. Homepage mobile — 390×844.
4. Services architecture including Payroll / L&I.
5. Start Here decision path.
6. Contact overview showing structured request first.
7. Deep Google Form with sanitized test information.
8. Short Formspree form.
9. Calendar after context with private details hidden.
10. Chatbase open state with empty or sanitized conversation.
11. EN and RU Materials hubs.
12. One matched EN/RU article pair.
13. Full homepage desktop.
14. Full homepage mobile.

### Automation captures

1. Sanitized Gmail generated draft.
2. Sanitized Make scenario overview.
3. Twilio/Make flow only with `Tested / partial` label.
4. Google Sheet logging only if current working proof exists.

### Asset output

For each public visual retain:

- lossless PNG master;
- cropped portfolio PNG;
- optimized WebP;
- source URL;
- viewport;
- capture date;
- caption;
- privacy/redaction note.

Store final case assets under a clean dedicated directory, for example:

`assets/images/case-fs-v2/`

Use consistent descriptive filenames.

---

## Phase 3 — Build the EN case page

### Required page structure

1. Hero.
2. Proof strip.
3. Business challenge.
4. Five-layer system architecture.
5. Bilingual experience.
6. Service architecture.
7. Intake before booking.
8. Content and SEO foundation.
9. AI and automation status.
10. Owner testimonial.
11. Verified outcomes.
12. Live project and ProAI CTA.

### Hero direction

Position the project as:

**Financial Stream LLC — a bilingual accounting, payroll and tax-support website system built for trust, structured inquiries and long-term search depth.**

Do not overpack the H1. Use the above as direction, not necessarily verbatim.

### Proof strip

Use concise proof points:

- Live EN/RU architecture
- Structured + short inquiry paths
- Calendar after context
- AI-assisted navigation
- Dated GSC evidence

### Five layers

Present:

1. Trust and presentation.
2. Services and client self-selection.
3. Structured intake.
4. Content and search.
5. AI and automation.

### Metrics

Use only the dated line:

> In a three-month Google Search Console snapshot reviewed in late June 2026, Financial Stream recorded approximately 3.88K search impressions and 19 clicks, with 41 pages indexed.

Do not imply growth without a baseline.

### Owner testimonial

Use one canonical quote:

> ProAI Expert helped us create a stronger business website — one that looks professional, builds more trust, and presents our services more clearly. At the same time, we gained a more practical structure for both our clients and our team.

**Tetiana Horb**  
**CEO, Financial Stream LLC**

Use the existing desktop/mobile device composition or a refined version of it.

---

## Phase 4 — Build the RU case page

The Russian page must be an independent natural edition, not a mechanical translation.

Requirements:

- same verified facts;
- same section order;
- same screenshot logic;
- same metric context;
- same automation statuses;
- natural Russian business language;
- use English regulatory/product terms where appropriate: QuickBooks, Payroll, L&I, Sales Tax, DOR, Chatbase, Make, Google Search Console.

Avoid dense mixed-language headings.

---

## Phase 5 — Update the Case Studies index

The archive should present three projects in this order:

1. Financial Stream LLC — flagship real client project.
2. Alina Horb — live personal-brand website.
3. Local Repair Pro — concept in development.

For this task, implement or preserve the Financial Stream card and create structurally ready slots for the following two projects only when their public cases are not yet built.

Do not present Local Repair Pro as a real client.

---

## Phase 6 — Homepage integration

Preserve the current Financial Stream testimonial section on the ProAI homepage.

Required behavior:

- keep the owner quote;
- keep or improve desktop/mobile device visuals;
- add a clear route to the full Financial Stream case study when source parity is restored;
- keep the live Financial Stream site link available;
- do not duplicate long case copy on the homepage.

---

## Claim guardrails

### Allowed

- real live client project;
- bilingual EN/RU website;
- Payroll is an active service;
- structured request and short form;
- consultation booking after context;
- Chatbase as AI-assisted navigation;
- Gmail drafts with human review;
- Twilio/Make as partial or tested when shown;
- dated GSC figures;
- contextual manual SERP examples.

### Prohibited without new evidence

- specific lead increase;
- conversion-rate increase;
- revenue increase;
- exact number of customers generated by the website;
- measured time savings;
- universal Google ranking;
- guaranteed SEO performance;
- fully automated accounting;
- autonomous client communication;
- fully production-ready Twilio missed-call recovery;
- production CRM;
- guaranteed outcomes.

---

## Technical requirements

- semantic HTML;
- preserve the existing ProAI design system unless a case-specific extension is needed;
- no unnecessary framework or build-system introduction;
- responsive from 320px to wide desktop;
- no horizontal overflow;
- accessible headings and landmarks;
- meaningful alt text;
- visible keyboard focus;
- reduced-motion support for any new motion;
- optimized WebP delivery;
- lazy-load non-hero images;
- retain PNG masters outside the web delivery path or in the documented asset archive;
- correct canonical and reciprocal hreflang;
- Open Graph and Twitter image;
- update sitemap only after final routes are confirmed;
- no broken EN/RU switch.

---

## QA matrix

### Content

- Payroll represented correctly.
- Tetiana / Tатьяна naming is consistent per language.
- No unsupported performance claims.
- GSC numbers include period/date context.
- Automation statuses are explicit.

### Visual

- hero is not overloaded;
- testimonial/device composition is prominent;
- screenshots are readable on desktop and mobile;
- no tiny text inside decorative device frames;
- no repeated near-identical screens;
- evidence screens are redacted.

### Functional

- all case links work;
- Financial Stream live-site CTA works;
- ProAI contact CTA works;
- EN/RU routes pair correctly;
- mobile menu works;
- no console errors caused by the case page;
- no missing assets.

### SEO

- unique EN/RU titles and descriptions;
- self canonical;
- reciprocal hreflang;
- x-default points to EN;
- one H1;
- descriptive headings;
- valid OG image URL;
- case pages appear in sitemap only after source parity and deployment are stable.

---

## Required final report

After implementation provide:

1. source/live parity finding;
2. exact files created and changed;
3. screenshot inventory with paths and dimensions;
4. EN/RU content summary;
5. metrics and claims used;
6. automation status labels used;
7. QA results by viewport;
8. commit SHA;
9. live URLs after deployment;
10. remaining limitations, if any.

Do not create a ZIP unless specifically requested. Save all production files directly in the repository.
