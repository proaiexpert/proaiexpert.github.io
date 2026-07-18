# ProAI Expert — Portfolio Rebrand Current Handoff

**Last updated:** 2026-07-18  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Working branch:** `portfolio-rebrand-v1`  
**Verified branch state before this update:** `f6b0a5abb464a8381e44bb5378f19a11ae43ac14`  
**Public status:** no portfolio-rebrand work from this branch has been merged into `main` or intentionally published.

---

## 1. Authority

This is the current operational source of truth.

Read in this order:

1. `PORTFOLIO_REBRAND_CURRENT_HANDOFF.md`
2. `PORTFOLIO_CASE_ART_DIRECTION_AND_MOTION_SYSTEM_V1.md`
3. approved project Production Spec when present
4. `PORTFOLIO_SITE_AUDIT_AND_MASTER_PLAN.md`
5. project master brief
6. screenshot and evidence manifests
7. final Codex implementation task
8. older dated documents as historical reference only

`PORTFOLIO_EXPERIENCE_BLUEPRINT.md` is a historical design-prototyping reference. It cannot override this handoff, the reusable V1 system or an approved project Production Spec.

---

## 2. Work division

### Managed in ChatGPT

- strategy and information architecture;
- public EN/RU copy;
- evidence and claim control;
- screenshot selection and presentation rules;
- art direction and motion specification;
- repository documentation;
- implementation sequence;
- final Codex task design.

### Executed in Codex when technically necessary

- source/deployment investigation;
- selective source recovery;
- HTML/CSS/JavaScript;
- responsive implementation;
- browser preview and capture;
- asset optimization;
- accessibility, metadata, performance and regression QA;
- production-code commits.

Do not use Codex to repeat completed strategy or documentation work.

---

## 3. Locked route architecture

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

Do not create competing `/work/` or `/portfolio/` routes.

Project truth labels:

1. **Financial Stream LLC** — Real Client Project · Live · Ongoing Optimization.
2. **Alina Horb** — Real Website Project · Live / In Refinement; client site is UA/RU.
3. **Local Repair Pro** — Concept Project · Website Production Factory Showcase · In Development.
4. **ProAI Expert** — Internal Studio Project · Live.

---

## 4. Source/live parity — closed

The former P0 Case Studies source/live mismatch was investigated and resolved on `portfolio-rebrand-v1`.

### Established deployment facts

- GitHub Pages publishes from `main`, repository root, through legacy Pages/Jekyll deployment.
- Current protected public `main` baseline remains `cebd235bf11be5216a4b1c7ffd7cf8c86c8e44f2`.
- Last verified complete historical Case Studies source was commit `f3133337d1287c3ed8020bca5d3223ce35728d31`.
- The historical generated artifact had expired, but the exact source commit and successful deployment chain were verified.
- Alina Horb and Local Repair Pro did not exist in that historical source and were correctly excluded from recovery.

### Selective recovery result

Commit:

`f6b0a5abb464a8381e44bb5378f19a11ae43ac14`

Title:

`fix: restore reproducible Case Studies source baseline`

Recovered:

- six historical EN/RU Case Studies HTML pages;
- 23 directly referenced CSS, JavaScript, brand and case-image dependencies;
- one exact recovery manifest.

Manifest:

`docs/portfolio-case-packs/source-live-parity/CASE_STUDIES_SELECTIVE_RECOVERY_MANIFEST_V2.md`

Locally verified routes:

- `/case-studies/`
- `/case-studies/financial-stream/`
- `/case-studies/proai-expert/`
- `/ru/case-studies/`
- `/ru/case-studies/financial-stream/`
- `/ru/case-studies/proai-expert/`

Verification confirmed:

- HTTP 200 locally;
- correct historical titles;
- self-canonical;
- reciprocal EN/RU hreflang;
- `x-default`;
- required assets resolved;
- no broken links among restored pages;
- no browser console errors;
- current homepage, About, Contact, Websites & Branding, AI Systems and Insights remained intact in EN/RU.

Safety:

- `main` unchanged;
- no PR;
- no production deployment;
- no whole-repository rollback;
- no new Financial Stream design implemented;
- no V2 screenshot promoted, deleted or modified;
- `sitemap.xml` intentionally unchanged until final route integration.

**Conclusion:** source/live parity is no longer an implementation blocker.

---

## 5. Financial Stream — verified scope

Financial Stream is a real live client project.

Verified scope:

- English and Russian website architecture;
- business formation and company setup;
- QuickBooks bookkeeping;
- cleanup and catch-up bookkeeping;
- Payroll and L&I reporting;
- tax return preparation;
- Sales Tax and Washington DOR reporting;
- document review and financial consulting;
- Start Here decision paths;
- structured request first;
- short-message fallback second;
- calendar after context;
- live Chatbase assistant;
- Gmail + Make + OpenAI draft workflow with human review;
- Twilio/Make only as tested/partial unless stronger evidence is added.

Payroll is active. Older instructions removing Payroll are superseded.

Never claim:

- autonomous accounting or communication;
- guaranteed missed-call recovery;
- production CRM without new proof;
- guaranteed rankings;
- traffic growth without a baseline;
- leads, conversion, revenue or SEO ROI;
- future performance.

---

## 6. Current search evidence

Performance and indexing remain separate dated snapshots.

### Performance

Owner-supplied Google Search Console screenshot reviewed 2026-07-17:

- period: 3 months;
- clicks: 19;
- impressions: approximately 4.17K.

Approved EN:

> In a three-month Google Search Console snapshot reviewed in July 2026, Financial Stream recorded 19 clicks and approximately 4.17K search impressions.

Approved RU:

> По трёхмесячному срезу Google Search Console, просмотренному в июле 2026 года, сайт Financial Stream получил 19 кликов и около 4,17 тыс. показов в поиске.

### Indexing

Separate owner-supplied evidence:

- 51 indexed pages;
- last updated 2026-07-09.

Do not combine the dates or turn these values into claims of growth, leads, conversion, revenue or ROI.

---

## 7. Financial Stream visual package

### Current canonical masters

Root:

`assets/img/cases/financial-stream/final-v1/`

Exactly ten PNG masters remain:

#### RU

1. `ru/desktop/fs-ru-01-home-hero-desktop.png`
2. `ru/desktop/fs-ru-02-request-desktop.png`
3. `ru/desktop/fs-ru-03-reporting-chat-desktop.png`
4. `ru/desktop/fs-ru-04-materials-desktop.png`
5. `ru/mobile/fs-ru-04-company-formation-mobile-portrait.png`

#### EN

6. `en/desktop/fs-en-01-home-hero-desktop.png`
7. `en/desktop/fs-en-02-request-desktop.png`
8. `en/desktop/fs-en-03-reporting-chat-desktop.png`
9. `en/desktop/fs-en-04-materials-desktop.png`
10. `en/mobile/fs-en-04-company-formation-mobile-portrait.png`

### Owner-approved V2 candidates

Root:

`assets/img/cases/financial-stream/review-candidates-v2/`

Approved captures:

- `ru/desktop/fs-ru-02-request-desktop-v2-candidate.png`
- `ru/desktop/fs-ru-03-reporting-chat-desktop-v2-candidate.png`
- `en/desktop/fs-en-02-request-desktop-v2-candidate.png`
- `en/desktop/fs-en-03-reporting-chat-desktop-v2-candidate.png`

Locked interpretation:

- Request V2 proves the short-message fallback, safety guidance and route back to the structured request; it does not display the external structured-request form itself.
- Reporting V2 proves a complete localized Chatbase answer in the real Reporting context; it does not prove autonomous accounting or autonomous communication.
- each language route uses its matching Request and Reporting capture;
- no additional recapture is needed.

Do not promote or delete V2 candidates before owner approval of the final Production Spec and complete-page placement direction.

---

## 8. Controlling visual direction

Reusable system:

`docs/portfolio-case-packs/PORTFOLIO_CASE_ART_DIRECTION_AND_MOTION_SYSTEM_V1.md`

Financial Stream Production Spec draft:

`docs/portfolio-case-packs/financial-stream/FINANCIAL_STREAM_FLAGSHIP_CASE_PRODUCTION_SPEC_V1.md`

Locked direction:

- `Structured Trust / Доверие по системе`;
- twelve chapters;
- Evidence Reconciliation Register as the single signature system;
- real screenshots as proof surfaces;
- no MacBook, iPhone, fake browser or generic device mockups;
- controlled crop, near-full-bleed and editorial proof-panel presentation;
- hero uses a 4/8 large-desktop composition;
- one sticky chapter only: Five-layer system;
- maximum six functional motion effect classes;
- no continuous animated line, permanent technical grid, decorative glow, blur-to-sharp, animated numbers, large screenshot parallax or 3D page turns;
- reduced-motion and no-JavaScript final states are mandatory.

---

## 9. Financial Stream chapter order

Use in EN and RU:

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

The order is locked. EN and RU share verified facts and structure but use natural independent copy.

---

## 10. Final implementation sequence

### Stage 0 — Source/live parity

**Complete.** Reproducible historical Case Studies source is restored and locally verified.

### Stage 1A — Complete and approve the Financial Stream Production Spec

Still required:

- exact final EN public copy for all twelve chapters;
- exact natural RU public copy;
- final screenshot claims, captions, source rails and alt text;
- final CTA destinations;
- natural RU testimonial rendering;
- internal consistency check against the master brief, manifest and evidence index;
- owner approval.

### Stage 1B — Financial Stream implementation

After owner approval:

1. prepare one final Codex task;
2. promote the four approved V2 candidates atomically under the approved procedure;
3. implement EN and RU Financial Stream pages on `portfolio-rebrand-v1`;
4. generate optimized delivery derivatives while preserving PNG masters;
5. run desktop, tablet, mobile, accessibility, reduced-motion, no-JavaScript, performance, metadata and regression QA;
6. return complete-page previews;
7. do not create a PR, merge or publish without a separate owner instruction.

### Stage 2 — Case Studies archive foundation

After the flagship is visually stable, build the archive around:

- completed Financial Stream;
- truthful Alina Horb stage;
- truthful Local Repair Pro concept stage;
- secondary ProAI Expert Studio Case.

### Stage 3 — Alina Horb

- preserve Premium Editorial Sanctuary;
- use real current UA/RU site captures;
- confirm portrait, diploma and testimonial permissions;
- create natural EN/RU portfolio narratives without pretending the client site is English;
- share the ProAI shell without copying the Financial Stream Register.

### Stage 4 — Local Repair Pro

- retain Concept Project classification;
- use current real demo captures;
- never invent client proof, reviews, licensing, phone, metrics or outcomes;
- use its Pacific Northwest field-note and scope-clarity direction.

### Stage 5 — Final integration

- finalize archive hierarchy and transitions;
- integrate homepage and service proof links;
- normalize navigation/footer;
- update canonical, hreflang, sitemap and OG assets;
- perform full no-regression QA;
- launch only after owner approval.

---

## 11. Documentation status

Completed:

- current metrics and evidence boundaries;
- ten-image canonical package;
- four corrected V2 captures visually approved;
- screenshot manifest and evidence index;
- Financial Stream master brief;
- twelve-chapter experience blueprint;
- independent production review;
- premiumity and motion audit synthesis;
- reusable portfolio art-direction and motion system;
- Financial Stream Production Spec draft;
- Stage 0 deployment investigation;
- exact 29-file selective recovery manifest;
- reproducible Case Studies source recovery and local verification.

Still required before implementation:

- exact EN/RU public copy;
- final captions, source rails and alt text;
- final CTA destinations;
- natural RU testimonial;
- final Production Spec consistency check;
- owner approval;
- final Codex implementation task.

---

## 12. Exact next action

Do not send the older Financial Stream build task to Codex.

The next controlled deliverable is the completed:

`docs/portfolio-case-packs/financial-stream/FINANCIAL_STREAM_FLAGSHIP_CASE_PRODUCTION_SPEC_V1.md`

It must move from:

`Draft for owner review — not approved for implementation`

to:

`Ready for owner approval — not approved for implementation`

Only after the owner approves the final EN/RU copy, testimonial, captions, CTA destinations and remaining visual gates may the final implementation task be issued.

No additional independent design audit is required.

---

## 13. Session rules

- Read this handoff first.
- Keep strategy, copy, evidence and documentation in ChatGPT.
- Use Codex for technical implementation and browser QA.
- Do not modify `main`.
- Do not publish without owner approval.
- Do not recreate approved Financial Stream screenshots.
- Do not promote or delete V2 candidates before final approval.
- Keep current and historical metrics separate.
- Use one controlled task at a time.
