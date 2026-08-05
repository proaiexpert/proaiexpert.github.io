# HOMEPAGE V2 CONTENT ARCHITECTURE — INDEPENDENT REVIEW TASK

## Role

Act as **Control / Independent Reviewer**.

This is a read-only content, commercial-clarity, proof and responsive-architecture review.

Do not act as a second creative director. Do not replace the approved strategy with a new strategy unless a blocking conflict is demonstrated with exact evidence.

## Repository

`proaiexpert/proaiexpert.github.io`

## Content branch

`agent/homepage-v2-content-architecture`

## Expected branch base

`main` at `7bcc09ae28388f8e4a5e6e5a715aa5ba7b3fbf50`

## Primary document

Read fully:

`docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_CONTENT_ARCHITECTURE_V1.md`

## Strategic authorities

From branch `agent/homepage-v2-strategy-review`, read as needed:

- `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_STRATEGY.md`;
- `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_PRODUCTION_SPEC.md`;
- `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_IMPLEMENTATION_CONTRACT.md`.

## Current production references

Inspect current `main`, including:

- `index.html`;
- `ru/index.html`;
- `contact/index.html`;
- `ru/contact/index.html`;
- current AI Systems pages;
- current Websites & Branding pages;
- current case routes;
- current Insights routes;
- locked Header and Homepage Footer integration only as needed.

PR #98 is merged. Verify that all proposed Homepage Private Review URLs match the actual production Contact allowlists and field semantics.

## Locked decisions that must not be reopened without blocking evidence

- audience: U.S. service businesses;
- Washington is accountability and acquisition priority, not a service boundary;
- only two top-level directions: AI Systems & Automation, Premium Websites & Branding;
- internal emphasis approximately 60/40 toward AI;
- AI first in positioning, Websites first in visible proof;
- ten-block page order;
- no Homepage pricing;
- primary CTA: `Request a Private Review` / `Запросить первичный разбор`;
- Financial Stream is flagship live proof;
- Alina Horb requires related-party disclosure;
- Local Repair Pro is a concept/live demo/in development;
- Header and Footer remain locked;
- no Homepage production code at this stage.

## Review questions

### A. Commercial clarity

1. Can a service-business owner understand the company, audience and business result within the Hero?
2. Is the H1 specific enough without becoming a service list?
3. Does the copy explain why websites and automation belong together?
4. Does AI remain the strategic direction without making unsupported claims?
5. Does the page avoid generic agency language?

### B. Narrative and block order

1. Does each block have a distinct job?
2. Is Financial Stream early enough?
3. Does Ways to Start follow proof at the right moment?
4. Are Process and Founder placed where they reduce risk rather than interrupt conversion?
5. Is the final CTA a true conclusion rather than another service pitch?

### C. CTA and Contact contract

Verify every EN/RU URL exactly.

Required machine values:

```text
intent=private_review
source_page=homepage
source_cta=homepage_hero | homepage_ways_to_start | homepage_final
selected_direction=websites_branding | ai_systems_automation | both
```

Confirm:

- correct EN/RU Contact route;
- correct anchor;
- no unsupported query parameter;
- no source-value mismatch;
- no JavaScript dependency.

### D. Proof and claims

1. Are all Financial Stream statements supported and bounded?
2. Is any outcome written as measured when it is only intended?
3. Is the Alina Horb disclosure sufficient and adjacent?
4. Is the Local Repair Pro boundary unmistakable?
5. Are status labels consistent with the approved taxonomy?
6. Does any copy imply leads, conversion, revenue, ROI, rankings or autonomous operation without evidence?

### E. Ways to Start

1. Do the three situations help self-identification?
2. Do they avoid hidden packages and pricing tiers?
3. Are boundaries clear?
4. Do the selected directions match each situation?
5. Is ongoing support properly presented as continuation rather than a fourth package?

### F. EN/RU quality

1. Is business meaning equivalent?
2. Is RU natural, professional and understandable?
3. Does RU avoid unexplained imported process jargon?
4. Are any RU lines too long or structurally risky for mobile?
5. Are service and CTA terms consistent?

### G. Responsive content architecture

Evaluate at minimum:

- 430 px;
- 390 px;
- 375 px;
- 360 px;
- 320 px;
- short landscape around 844 × 390.

Review the content architecture, not final CSS.

Confirm:

- mobile order is coherent;
- no required wide diagram exists;
- disclosures and statuses stay visible;
- Hero CTA remains early;
- Financial Stream proof remains interpretable;
- Russian text can wrap naturally;
- no section requires viewport-filling height.

### H. Future Jekyll ownership

1. Can the content be represented by matching EN/RU YAML structures?
2. Are machine identifiers stable?
3. Are collection counts explicit?
4. Is arbitrary HTML unnecessary?
5. Are routes explicitly localized?

## Required verdict

Choose exactly one:

- `ACCEPT`;
- `TARGETED CORRECTION`;
- `REJECT`.

Use `TARGETED CORRECTION` only for specific fixable issues that do not invalidate the central architecture.

Use `REJECT` only if the architecture cannot support the approved strategy without substantial reconstruction.

## Required report structure

1. Executive verdict.
2. Exact documents, branch and production references inspected.
3. Commercial clarity review.
4. Ten-block narrative review.
5. Hero review.
6. CTA/Contact contract review.
7. Proof and claims review.
8. Ways to Start review.
9. EN/RU parity and language review.
10. Responsive content review.
11. Jekyll data-readiness review.
12. Material risks.
13. Required targeted corrections, numbered and exact.
14. Readiness for low-fidelity full-page mapping.

## Output file

Replace only:

`docs/site-evolution/homepage-v2-content-review/02_CONTENT_ARCHITECTURE_REVIEW_REPORT.md`

## Prohibited actions

Do not:

- edit the Content Architecture document;
- edit Homepage, Contact, Header or Footer;
- create CSS, JavaScript, YAML or includes;
- create wireframes or visual concepts;
- change routes or assets;
- create or merge a production PR;
- modify any file except the report.

## Final line

End the report with:

```text
Independent Homepage V2 Content Architecture review complete. No production files were changed.
```