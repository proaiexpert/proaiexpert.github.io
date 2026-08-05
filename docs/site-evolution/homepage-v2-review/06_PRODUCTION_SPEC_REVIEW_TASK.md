# TASK — Independent Technical Review of Homepage V2 Production Specification

## Role

Control / Independent Technical Reviewer

## Mode

Read-only until the report is written.

## Repository

`proaiexpert/proaiexpert.github.io`

## Working branch

`agent/homepage-v2-strategy-review`

## Purpose

Independently verify whether the approved Homepage V2 strategy has been translated into a safe, maintainable, implementation-ready production specification.

Do not redesign the Homepage strategy. Do not create an alternative architecture unless the proposed architecture has a material defect that cannot be corrected narrowly.

## Required read order

1. `AI_START_HERE.md`
2. `AGENTS.md`
3. current `AI_CURRENT_HANDOFF.md`
4. `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_STRATEGY.md`
5. `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_PRODUCTION_SPEC.md`
6. `docs/site-evolution/homepage-v2-review/03_INDEPENDENT_REVIEW_REPORT.md`
7. actual current Homepage EN/RU sources
8. actual current Contact EN/RU sources
9. current Header and Footer integration sources
10. current deployment/Jekyll workflow where relevant

## Required source inspection

At minimum inspect:

- `index.html`;
- `ru/index.html`;
- `_includes/homepage-current-en.html`;
- `_includes/homepage-current-ru.html`;
- current Homepage CSS and JavaScript assets;
- `contact/index.html`;
- `ru/contact/index.html`;
- current Header include/data/assets;
- current Footer include/data/assets;
- `_config.yml`;
- `.github/workflows/deploy-pages.yml`;
- relevant Jekyll layout/include/data conventions already used by the repository.

## Locked decisions

Do not reopen without evidence:

- U.S. service-business audience;
- Washington as credibility/acquisition advantage, not service boundary;
- two top-level directions;
- AI Systems & Automation;
- Premium Websites & Branding;
- studio-first, founder-supported model;
- no Homepage pricing;
- `Request a Private Review` / `Запросить первичный разбор`;
- no-cost bounded fit-and-priority definition;
- `View Client Work` / `Смотреть клиентские проекты`;
- ten-block final narrative;
- Financial Stream as flagship live client proof;
- Alina as visible related-party proof;
- Local Repair Pro as `Website concept · Live demo · In development`;
- natural EN/RU localization;
- locked Header and Footer;
- no new broad `replace_first` Homepage architecture.

## Review questions

### A. Source architecture

1. Is `_layouts/homepage-v2.html` plus section includes and localized data appropriate for this repository?
2. Does the proposed file map create unnecessary fragmentation?
3. Is there a safer smaller equivalent that preserves clean ownership?
4. Can current Header and Footer includes be used without modification?
5. Is rollback from the new wrappers operationally sound?

### B. Jekyll and deployment

1. Will the proposed nested data structure and include pattern render correctly in the current Jekyll build?
2. Are any filenames, Liquid access patterns, or layout assumptions invalid?
3. Does the deployment workflow impose additional generated-output checks?
4. Are any source files copied raw rather than rendered?

### C. Contact integration

1. Can `intent`, `source`, direction, language, and referring context be added safely to the current Contact flow?
2. What current endpoint, JavaScript, anti-spam, or form state must be preserved?
3. Can the existing Contact pages recognize `private_review` without an unrelated redesign?
4. Should Contact changes be included in the Homepage implementation PR or a separate prerequisite PR?

### D. Section implementation

1. Are the ten section contracts specific enough for Builder implementation?
2. Is the connected-journey mobile transformation exact enough?
3. Does `Ways to Start` risk becoming a hidden package table?
4. Does the Founder, proof, and Insights scope remain proportionate?
5. Are the section IDs and links coherent?

### E. EN/RU architecture

1. Does one shared layout plus separate EN/RU YAML preserve natural localization?
2. Are stable internal values sufficiently defined?
3. Are there risks from Russian text expansion or data-driven markup?
4. Are canonical, hreflang, x-default, and mapped routes adequately protected?

### F. CSS, JavaScript, accessibility, performance

1. Are the CSS and JavaScript ownership rules realistic?
2. Are the proposed budgets reasonable for this repository?
3. Is the no-JS baseline achievable?
4. Is reduced-motion behavior explicit enough?
5. Is the image plan sufficient for LCP and mobile proof readability?
6. Are accessibility requirements testable rather than aspirational?

### G. QA and workflow

1. Is Tier 3 / Codex escalation appropriate?
2. Is the viewport and browser matrix sufficient?
3. Are the acceptance gates operationally testable?
4. Is the expected production file scope too broad or missing files?
5. Does the implementation sequence prevent a mixed V1/V2 production state?

## Required verdict

Return exactly one:

- `ACCEPT`;
- `TARGETED CORRECTION`;
- `REJECT`.

`REJECT` requires a fundamental defect that cannot be corrected narrowly.

## Required report structure

1. Executive verdict.
2. Sources inspected.
3. Architecture assessment.
4. Jekyll/deployment assessment.
5. Contact integration assessment.
6. Section-contract assessment.
7. EN/RU assessment.
8. Accessibility/performance assessment.
9. QA/rollback assessment.
10. Exact required corrections, prioritized P0/P1/P2.
11. Final implementation-readiness status.

## Output path

Replace the template at:

`docs/site-evolution/homepage-v2-review/07_PRODUCTION_SPEC_REVIEW_REPORT.md`

Use the same branch:

`agent/homepage-v2-strategy-review`

## Restrictions

Do not modify:

- production HTML;
- production CSS;
- production JavaScript;
- Header;
- Footer;
- Contact;
- routes;
- metadata;
- assets;
- deployment;
- canonical strategy;
- production specification.

Only replace the review-report template.

After saving the report, stop.

Final line:

`Independent Homepage V2 production-spec review complete. No production files were changed.`
