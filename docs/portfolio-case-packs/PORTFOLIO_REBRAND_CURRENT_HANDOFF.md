# ProAI Expert — Portfolio Rebrand Current Handoff

**Last updated:** 2026-07-17  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Working branch:** `portfolio-rebrand-v1`  
**Branch state before this document update:** `e9d6b3b528e02268bba0d0699d073ea2a2fb9f37`  
**Public status:** no portfolio-rebrand work from this branch has been merged into `main` or intentionally published.

---

## 1. Purpose and authority

This file is the current operational source of truth for the ProAI Expert portfolio rebrand.

Read it first in every new ChatGPT or Codex session.

Authority order:

1. `PORTFOLIO_REBRAND_CURRENT_HANDOFF.md` — current operational state and exact next action.
2. `PORTFOLIO_SITE_AUDIT_AND_MASTER_PLAN.md` — final architecture, rollout order, QA and safety rules.
3. Project master briefs — verified facts, content and evidence.
4. Project build tasks — executable instructions for Codex.
5. Older dated transfer, correction and research documents — historical reference only.

When an older file conflicts with this handoff, this handoff controls current status.

---

## 2. Work division

### ChatGPT / management chat

Use this chat for:

- strategy;
- information architecture;
- public copy and case narrative;
- evidence and claim review;
- screenshot selection and visual QA with the owner;
- repository documentation cleanup;
- implementation sequencing;
- final technical task specifications for Codex.

### Codex

Use Codex only for:

- source/deployment investigation requiring repository or browser execution;
- HTML, CSS and JavaScript implementation;
- responsive behavior;
- local preview and browser QA;
- asset conversion and optimization;
- link, metadata and regression testing;
- commits containing production code.

Do not spend Codex limits on repeated strategy, research summaries, copy planning or documentation that can be completed here.

---

## 3. Locked portfolio architecture

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

1. **Financial Stream LLC** — real flagship client project; live; ongoing optimization.
2. **Alina Horb** — real live website project; client site is UA/RU.
3. **Local Repair Pro** — concept/showcase; in development; not a completed client engagement.
4. **ProAI Expert** — internal studio case; preserve existing EN/RU routes as a secondary Studio Case.

---

## 4. Safety state

- `main` is the public baseline and must not be edited directly.
- `portfolio-rebrand-v1` is the only active working branch for this stage.
- Existing backup/reference branches must be retained.
- Do not create a PR or publish until the owner approves the completed preview.
- The source/live Case Studies mismatch remains a P0 implementation risk.
- Restoration must be selective; never roll the whole repository back to an old commit.

---

## 5. Financial Stream — verified case facts

Financial Stream is a real, live client project.

Verified scope includes:

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
- Chatbase website assistant;
- Gmail + Make + OpenAI draft workflow with human review;
- Twilio/Make only as tested or partial unless stronger current proof is added.

Payroll is an active service. Any older instruction that removes or labels Payroll as obsolete is superseded.

---

## 6. Financial Stream — current search evidence

Keep performance and indexing evidence as separate dated snapshots.

### Current performance snapshot

Owner-supplied Google Search Console screenshot reviewed on **2026-07-17**:

- period: **3 months**;
- total clicks: **19**;
- total impressions: **approximately 4.17K**.

Safe public framing:

> In a three-month Google Search Console snapshot reviewed in July 2026, Financial Stream recorded 19 clicks and approximately 4.17K search impressions.

Russian:

> По трёхмесячному срезу Google Search Console, просмотренному в июле 2026 года, сайт Financial Stream получил 19 кликов и около 4,17 тыс. показов в поиске.

### Current indexing snapshot

Separate indexing evidence supplied by the owner:

- **51 indexed pages**;
- indexing screenshot last updated **2026-07-09**.

Do not merge the two dates into one claim.

Historical evidence files showing approximately 3.88K impressions and 41 indexed pages remain valid only as older dated snapshots. They are not the current headline metrics.

Never claim:

- guaranteed ranking positions;
- permanent top results;
- traffic growth without a comparable baseline;
- lead, conversion or revenue growth;
- SEO ROI;
- future performance.

---

## 7. Financial Stream — selected core visual package

Location:

`assets/img/cases/financial-stream/final-v1/`

The current core package contains exactly ten selected PNG masters.

### RU desktop

1. `ru/desktop/fs-ru-01-home-hero-desktop.png`
2. `ru/desktop/fs-ru-02-request-desktop.png`
3. `ru/desktop/fs-ru-03-reporting-chat-desktop.png`
4. `ru/desktop/fs-ru-04-materials-desktop.png`

### RU mobile

5. `ru/mobile/fs-ru-04-company-formation-mobile-portrait.png`

### EN desktop

6. `en/desktop/fs-en-01-home-hero-desktop.png`
7. `en/desktop/fs-en-02-request-desktop.png`
8. `en/desktop/fs-en-03-reporting-chat-desktop.png`
9. `en/desktop/fs-en-04-materials-desktop.png`

### EN mobile

10. `en/mobile/fs-en-04-company-formation-mobile-portrait.png`

Current package decisions:

- the rejected RU/EN Materials mobile-landscape files were removed;
- the approved direction uses portrait Company Formation service captures for mobile proof;
- Materials is represented with matching RU/EN desktop captures;
- the open Chatbase state is allowed only in the two deliberate reporting/chat proof frames;
- all other selected frames must remain unobstructed;
- six superseded review-test PNGs were removed after matching final copies were verified.

`final-v1` is a package path, not automatic evidence of owner approval. The owner’s final visual lock is still required during page composition and preview review.

Do not recapture or rename these ten files without explicit owner instruction.

---

## 8. Visual rules

- Use only real current website captures or exact production assets.
- No generated UI, fake dashboards, synthetic portraits or placeholder canvases.
- No browser chrome in portfolio masters.
- Do not alter page CSS or `document.body.style.zoom` to force a composition.
- Open every selected image and inspect the actual PNG.
- Dimensions, hashes and capture logs prove technical integrity only.
- Avoid near-duplicate screenshots.
- Retain PNG masters; create optimized WebP derivatives only for final delivery.
- Evidence screenshots and portfolio presentation screenshots are separate asset classes.

---

## 9. Source/live parity — P0 implementation gate

The live ProAI Case Studies URLs have displayed full pages, while current `main` does not cleanly contain the matching source tree.

Before production page code is changed, Codex must:

1. identify the actual GitHub Pages deployment source;
2. inspect recent Pages workflows/artifacts and relevant branches;
3. capture the current live HTML and asset references;
4. compare them with the verified historical Case Studies source;
5. restore only required source files into `portfolio-rebrand-v1`;
6. reproduce the routes locally;
7. confirm that no current homepage, service, insight or language work is reverted.

Do not overwrite the live cases from an arbitrary historical commit.

---

## 10. Final implementation order

This order is locked to minimize redesign and duplicate work.

### Stage 1 — Financial Stream flagship detail page

Build the EN and RU Financial Stream case first.

It establishes the reusable system for:

- case hero;
- proof strip;
- chapter navigation;
- screenshot panels;
- verified evidence blocks;
- testimonial;
- status labels;
- next-case transition;
- EN/RU metadata and language pairing.

### Stage 2 — Case Studies archive foundation

After the Financial Stream page direction is stable, build the strong archive shell with:

- completed Financial Stream stage;
- structurally ready Alina stage;
- structurally ready Local Repair Pro stage;
- secondary ProAI Expert Studio Case.

Do not treat unfinished cases as completed.

### Stage 3 — Alina Horb detail page

- use real current UA/RU site captures;
- preserve the editorial sanctuary direction;
- obtain permission for portrait, diploma and testimonial use where required;
- describe actual client-site languages accurately;
- create natural EN/RU portfolio narratives without pretending the client site is English.

### Stage 4 — Local Repair Pro detail page

- retain `Concept Project` classification;
- remove internal/demo-only wording before public use;
- use real current demo captures;
- do not invent client proof, reviews, licensing, metrics, phone numbers or outcomes.

### Stage 5 — Final archive and site integration

Only after all three primary cases exist:

- finalize archive hierarchy and transitions;
- strengthen homepage Financial Stream teaser;
- connect Websites & Branding proof;
- add optional AI Systems teaser only when sanitized automation proof exists;
- normalize navigation and footer;
- update sitemap, metadata, canonical and hreflang;
- run full regression QA;
- prepare one controlled launch.

---

## 11. Financial Stream public case structure

Use this chapter order in both languages:

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

EN and RU must share verified facts and structure but use natural independent copy.

---

## 12. Current next action

The documentation and asset package are being synchronized in this chat.

After synchronization, the next Codex task is:

**perform the source/live parity investigation and then implement the Financial Stream EN/RU flagship case on `portfolio-rebrand-v1` using the final master brief, build task and selected ten-image package.**

Do not begin Alina, Local Repair Pro, global integration or publication in that same task.

---

## 13. Session rules

- Read this handoff first.
- Do not modify `main`.
- Do not publish without explicit owner approval.
- Do not recreate completed Financial Stream screenshots.
- Do not infer claims from filenames or old notes.
- Separate current metrics from historical snapshots.
- Separate selected assets from final owner approval.
- Keep strategic/content work here and implementation work in Codex.
- Use one controlled task at a time.
- Stop after the requested deliverable.
