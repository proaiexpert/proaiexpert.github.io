# ProAI Expert — Portfolio Rebrand Current Handoff

**Last updated:** 2026-07-18  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Working branch:** `portfolio-rebrand-v1`  
**Branch state before this handoff update:** `ecc0708f699e389258bc4795824dc4e9cec8558a`  
**Public status:** no portfolio-rebrand work from this branch has been merged into `main` or intentionally published.

---

## 1. Authority

This is the current operational source of truth.

Read in this order:

1. `PORTFOLIO_REBRAND_CURRENT_HANDOFF.md`
2. `PORTFOLIO_SITE_AUDIT_AND_MASTER_PLAN.md`
3. project master brief
4. approved Production Spec when present
5. project build task
6. screenshot/evidence manifests
7. older dated documents as historical reference only

An older file cannot override this handoff.

---

## 2. Work division

### Managed here in ChatGPT

- strategy;
- information architecture;
- public copy and case narrative;
- evidence and claim control;
- screenshot selection and visual review;
- repository documentation;
- implementation sequence;
- ordinary GitHub documentation and asset-status updates that do not require browser or production-code execution;
- final Codex tasks.

### Executed in Codex only when technically necessary

- source/deployment investigation;
- selective source recovery;
- HTML/CSS/JavaScript;
- responsive implementation;
- controlled browser capture when a real browser context is required;
- local/browser preview;
- asset optimization;
- link, metadata, accessibility and regression QA;
- production-code commits.

Do not spend Codex limits repeating strategy, documentation, ordinary GitHub edits or other work that can be completed here.

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

Do not create a competing `/work/` or `/portfolio/` system.

Project truth labels:

1. **Financial Stream LLC** — real flagship client project; live; ongoing optimization.
2. **Alina Horb** — real live website project; actual client site is UA/RU.
3. **Local Repair Pro** — concept/showcase; in development; not a completed client engagement.
4. **ProAI Expert** — internal Studio Case; preserve existing EN/RU routes.

---

## 4. Safety and P0 gate

- `main` is the public baseline and must not be edited directly.
- `portfolio-rebrand-v1` is the active working branch.
- Do not create a PR or publish before owner approval.
- The live/source Case Studies mismatch remains a P0 implementation gate.
- Source recovery must be selective; never roll the whole repository back.

Before production page code changes, Codex must:

1. identify the active GitHub Pages/deployment source;
2. inspect relevant workflows, artifacts and branches;
3. preserve current live EN/RU case HTML and asset references;
4. compare with verified historical source;
5. restore only required files into `portfolio-rebrand-v1`;
6. reproduce routes locally;
7. confirm no current homepage, service, Insights or language work is reverted.

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
- shorter message form second;
- calendar after context;
- Chatbase assistant;
- Gmail + Make + OpenAI draft workflow with human review;
- Twilio/Make only as tested/partial unless stronger proof is added.

Payroll is active. Older instructions removing or downgrading Payroll are superseded.

---

## 6. Current search metrics

Performance and indexing are separate dated snapshots.

### Performance snapshot

Owner-supplied Google Search Console screenshot reviewed **2026-07-17**:

- period: **3 months**;
- clicks: **19**;
- impressions: **approximately 4.17K**.

Approved EN line:

> In a three-month Google Search Console snapshot reviewed in July 2026, Financial Stream recorded 19 clicks and approximately 4.17K search impressions.

Approved RU line:

> По трёхмесячному срезу Google Search Console, просмотренному в июле 2026 года, сайт Financial Stream получил 19 кликов и около 4,17 тыс. показов в поиске.

### Indexing snapshot

Separate owner-supplied evidence:

- **51 indexed pages**;
- last updated **2026-07-09**.

Do not merge the dates.

Older repository evidence showing approximately `3.88K` impressions and `41` indexed pages remains historical only.

Never claim guaranteed rankings, permanent top positions, traffic growth without a baseline, leads, conversion, revenue, SEO ROI or future performance.

---

## 7. Financial Stream — visual package status

### Current canonical masters

Canonical root:

`assets/img/cases/financial-stream/final-v1/`

It currently contains exactly ten PNG masters:

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

### Owner-approved V2 replacement candidates

Review root:

`assets/img/cases/financial-stream/review-candidates-v2/`

The owner visually approved all four V2 candidates on 2026-07-18:

- `ru/desktop/fs-ru-02-request-desktop-v2-candidate.png`;
- `ru/desktop/fs-ru-03-reporting-chat-desktop-v2-candidate.png`;
- `en/desktop/fs-en-02-request-desktop-v2-candidate.png`;
- `en/desktop/fs-en-03-reporting-chat-desktop-v2-candidate.png`.

They correct the earlier Request and Reporting frames:

- RU/EN Request: Chatbase closed and greeting cards absent;
- RU/EN Reporting: Chatbase intentionally open with a complete localized answer;
- matching CSS viewport `1440×1000`, DPR `2`, physical PNG `2880×2000`;
- captured from the live site without browser chrome or artificial upscale.

The four candidates are visually approved but are deliberately not yet promoted into `final-v1`. Promotion and deletion of the review folder occur only after the Production Spec locks:

- exact section placement;
- page opening sequence;
- captions and claim linkage;
- desktop/mobile presentation;
- crop and panel treatment;
- paired comparison versus individual placement.

Decisions already locked:

- rejected RU/EN Materials mobile-landscape files remain removed;
- Materials is represented by matching RU/EN desktop captures;
- mobile proof uses matching Company Formation portrait captures;
- open Chatbase is allowed only in the two deliberate reporting/chat frames;
- no additional recapture of the four approved V2 files is needed;
- WebP delivery derivatives are created only during implementation;
- final visual lock occurs in the complete page preview.

---

## 8. Visual rules

- Use real current captures only.
- No synthetic UI, fake dashboards, placeholder portraits or generated project imagery.
- No browser chrome in presentation masters.
- Do not manipulate site CSS/zoom to force a screenshot composition.
- Evidence captures and presentation masters are separate asset classes.
- Dimensions, hashes and logs are technical evidence—not visual approval.
- Avoid near-duplicate screens.
- Retain PNG masters.
- Screenshot approval does not by itself approve final placement, captions, crop or page choreography.

---

## 9. Final implementation order

This order is locked.

### Stage 0 — Source/live parity

Resolve and reproduce the current Case Studies source safely.

### Stage 1 — Financial Stream flagship detail pages

Build EN and RU Financial Stream first. It establishes:

- case hero;
- proof strip;
- chapter navigation;
- screenshot panels;
- evidence blocks;
- status labels;
- testimonial;
- next-case transition;
- EN/RU metadata and language pairing.

### Stage 2 — Case Studies archive foundation

After Financial Stream is stable, build the archive shell with:

- completed Financial Stream stage;
- truthful Alina stage;
- truthful Local Repair Pro concept stage;
- secondary ProAI Expert Studio Case.

### Stage 3 — Alina Horb detail pages

- use real current UA/RU site captures;
- preserve the editorial sanctuary direction;
- confirm portrait, diploma and testimonial permissions;
- create natural EN/RU portfolio narratives without pretending the client site is English.

### Stage 4 — Local Repair Pro detail pages

- retain `Concept Project` classification;
- remove internal/demo wording;
- use current real demo captures;
- never invent client proof, reviews, licensing, phone, metrics or outcomes.

### Stage 5 — Final archive and site integration

After all three primary cases exist:

- finalize archive hierarchy and transitions;
- strengthen homepage Financial Stream teaser;
- connect Websites & Branding proof;
- add optional AI Systems teaser only with sanitized evidence;
- normalize navigation and footer;
- update metadata, canonical, hreflang and sitemap;
- run full no-regression QA;
- perform one controlled launch.

---

## 10. Financial Stream page structure

Use in both languages:

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

EN and RU share verified facts and structure but use natural independent copy.

The twelve-part architecture is locked at chapter level. Exact copy, visual placement, captions, transitions, sticky states and responsive choreography are not yet locked and belong in the Production Spec.

---

## 11. Documentation status

Completed:

- current metrics updated;
- performance and indexing separated;
- ten-image canonical package recorded;
- rejected landscape files removed from current status;
- six superseded review-test duplicates deleted;
- original capture log synchronized;
- screenshot manifest established;
- Financial Stream master brief finalized;
- experience blueprint created;
- Codex build task retained for later technical execution;
- portfolio README and master rollout plan synchronized;
- old control-transfer file marked historical;
- unauthorized Alina prototype reverted and documented;
- four corrected Financial Stream V2 screenshots captured and visually approved;
- screenshot manifest updated to separate visual approval from final placement and promotion.

Still required before implementation:

- `FINANCIAL_STREAM_FLAGSHIP_CASE_PRODUCTION_SPEC_V1.md`;
- exact EN and RU copy;
- exact role and placement of each screenshot/evidence asset;
- captions and alt-text foundation;
- opening sequence and page choreography;
- responsive behavior;
- motion timings and reduced-motion/no-JS fallbacks;
- owner review of the complete production specification;
- controlled independent design review in ordinary Chat, followed by final integration here.

No production code was changed.

---

## 12. Exact next action

Do **not** send the current build task to Codex yet.

The next controlled deliverable is:

`docs/portfolio-case-packs/financial-stream/FINANCIAL_STREAM_FLAGSHIP_CASE_PRODUCTION_SPEC_V1.md`

It must lock one final implementation direction, including:

1. exact EN copy;
2. exact natural RU copy;
3. the twelve-section order;
4. exact screenshot/evidence placement;
5. captions, alt text and claim linkage;
6. page opening and hero choreography;
7. chapter-navigation and sticky behavior;
8. desktop, tablet and mobile treatment;
9. exact motion storyboard and timings;
10. reduced-motion and no-JS fallbacks;
11. light/dark transitions if retained;
12. CTA destinations;
13. acceptance criteria for the complete preview.

Workflow:

1. prepare the Production Spec here;
2. give the complete draft and source documents to one ordinary Chat for an independent design/experience review;
3. return that review here;
4. resolve findings into one final Production Spec;
5. obtain owner approval;
6. only then promote approved V2 screenshots, complete the P0 source/live parity gate and issue the final Codex implementation task.

Do not mix Alina, Local Repair Pro, archive integration or publication into this stage.

---

## 13. Session rules

- Read this handoff first.
- Keep strategy, copy, evidence, documentation and ordinary GitHub work here.
- Use Codex only for tasks that materially require repository execution, browser automation, source recovery, code implementation or technical QA.
- Do not modify `main`.
- Do not publish without owner approval.
- Do not recreate the approved Financial Stream screenshots.
- Do not promote or delete V2 candidates before the Production Spec and complete-page placement are approved.
- Separate current metrics from historical snapshots.
- Separate selected assets from final preview approval.
- Use one controlled task at a time.
- Stop after the requested deliverable.