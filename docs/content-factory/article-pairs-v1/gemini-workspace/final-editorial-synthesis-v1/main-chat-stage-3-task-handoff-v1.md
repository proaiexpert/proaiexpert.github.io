# MAIN CHAT HANDOFF — CREATE THE GEMINI STAGE 3 IMPLEMENTATION TASK

**Status:** READY FOR STAGE 3 TASK AUTHORING ONLY  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Editorial branch:** `article-pairs-gemini-stage-v1`  
**Current production snapshot:** `main` at `f2aa1770b2c2ff5ac3918f18e5cdc1e69e2c3c2c`  
**Open PRs at handoff creation:** none  
**Article page build:** not started  
**Publication:** not authorized

## Assignment for the main ChatGPT website chat

Create one complete, implementation-ready technical task for Gemini to physically build the four approved premium article pages.

Do not implement the pages in the main chat. Do not modify `main`. Do not start Gemini until the technical task has been saved in GitHub and reviewed by the owner.

Before writing the task, independently re-check:

1. the current `main` SHA;
2. current open Pull Requests;
3. the current canonical handoff;
4. existing Insights/article page templates, shared styles, header, footer, navigation, responsive conventions, metadata, schema, sitemap and internal-link patterns;
5. the Financial Stream architecture gate described below.

## Current production status

- PR #19 is merged.
- Phase A merge SHA: `fa4f8f4a2bc2c50b9de1dbee69213b3f1029a418`.
- The canonical handoff was published afterward.
- Current production snapshot when this handoff was created: `f2aa1770b2c2ff5ac3918f18e5cdc1e69e2c3c2c`.
- No open Pull Requests were found at this snapshot.

The future Gemini implementation branch must be created from the actual current `main` resolved at build start, not automatically from either SHA above.

## Mandatory source order

Read completely in this order.

### 1. Current website authority

- [Canonical ProAI Expert handoff](https://github.com/proaiexpert/proaiexpert.github.io/blob/main/docs/PROAI_EXPERT_CURRENT_HANDOFF.md)

### 2. Final editorial authority

- [Final main-author approval](https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/final-main-author-approval-v1.md)
- [Final approved article bodies manifest](https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/final-approved-article-bodies-manifest-v1.md)

### 3. Four approved article bodies — exact source of truth

- [Article 1 RU V7](https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-01-ru-final-candidate-v7.md)
- [Article 1 EN V5](https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-01-en-final-candidate-v5.md)
- [Article 2 RU V6](https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-02-ru-final-candidate-v6.md)
- [Article 2 EN V6](https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-02-en-final-candidate-v6.md)

### 4. Final QA and proof of approval

- [Final editorial readiness report V2](https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/final-editorial-readiness-report-v2.md)
- [Final factual and source QA V2](https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/final-factual-and-source-qa-v2.md)
- [Article 1 RU/EN Pair QA V3](https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-01-ru-en-final-pair-qa-v3.md)
- [Article 2 RU/EN Pair QA V3](https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-02-ru-en-final-pair-qa-v3.md)
- [Final section coverage matrix](https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/final-section-coverage-matrix-v1.md)
- [Final editorial change register](https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/final-editorial-change-register-v1.md)
- [Final RU language-polish register](https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/final-ru-language-polish-register-v1.md)

### 5. Page-system and metadata sources

- [Final page module map V1](https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/final-page-module-map-v1.md)
- [Final routes and metadata manifest](https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/checkpoint-before-gemini/governance/final-routes-and-metadata-manifest-v1.md)

Earlier Gemini reports, Stage 2 V1/V2, Hybrid V2, baseline candidates and old Stage 3 drafts are historical only. They must not override the approved files above.

## Approved routes

1. `/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/`
2. `/insights/does-your-service-business-need-a-multilingual-website/`
3. `/ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/`
4. `/insights/how-to-evaluate-a-website-proposal/`

## Non-negotiable content rules for the future Gemini task

The technical task must require Gemini to:

- use the four approved bodies exactly as the editorial source of truth;
- preserve every section, table, decision framework, disclaimer and adjacent primary-source link;
- never replace the final bodies with baseline, Gemini V1/V2 or shortened Hybrid content;
- preserve independent RU and EN structure rather than forcing mechanical translation;
- keep routes, H1, SEO title, meta description, query ownership, self-canonical and reciprocal `hreflang` locked;
- add no unsupported statistics, testimonials, business outcomes, rankings, traffic, leads, conversion, revenue, ROI or legal guarantees;
- keep the Article 2 legal boundary and source language intact;
- preserve table field relationships when adapting tables for mobile;
- keep all core content available without JavaScript.

## Implementation qualities the new Gemini task must specify

The task should require:

- a dedicated implementation branch created from the verified current `main`;
- no direct changes to `main`;
- integration with the actual post-PR-19 site shell rather than a parallel template;
- four complete routes using shared components and styles without flattening language-specific hierarchy;
- premium editorial art direction based on the final page module map;
- semantic HTML and accessible heading structure;
- responsive tables or labelled mobile transformations that preserve data relationships;
- correct `lang`, one H1, title, description, canonical, reciprocal `hreflang`, schema and existing sitemap conventions;
- visible focus states, keyboard usability and sufficient contrast;
- no-JS readability;
- restrained motion with `prefers-reduced-motion` support;
- correct source-link treatment;
- confirmed CTA destinations and non-cannibalizing related-content links;
- desktop and mobile visual evidence for all four pages;
- technical QA for metadata, canonical, `hreflang`, schema, accessibility, no-JS, responsive tables, reduced motion, broken links and route integrity;
- an implementation manifest, source-link manifest, metadata manifest and diff summary;
- no PR, merge or publication until owner review.

## Financial Stream implementation gate

Before the Gemini task permits rendering the named Financial Stream example in Article 1 RU, require verification that these architecture facts remain observable:

- separate EN/RU routes;
- corresponding service structures;
- consistent brand system;
- multiple contact paths.

If verification fails, the complete named example module must be removed while preserving the general methodology. It must not be replaced by performance claims or an unsupported weaker statement. Do not add a public portfolio-case link without a separately approved evidence gate.

## Required output from the main ChatGPT chat

The main chat should now create and save one new canonical Stage 3 implementation task in GitHub.

That task must be self-contained enough for Gemini to execute without relying on chat memory. It must define:

- repository and verified base SHA;
- implementation branch name;
- exact source hierarchy;
- four routes;
- permitted and forbidden changes;
- art direction and module behavior;
- responsive and accessibility requirements;
- metadata, canonical, `hreflang`, schema and sitemap requirements;
- Financial Stream gate;
- required screenshots and QA artifacts;
- commit/reporting protocol;
- explicit stop before PR, merge or publication.

After saving the task, the main chat should return only:

1. task status;
2. commit SHA;
3. direct GitHub link to the task;
4. a short statement that Gemini has not yet been started.
