# TASK — STAGE 3 PREMIUM ARTICLE PAGE BUILD V2

## Status

**AUTHORIZED FOR CONTROLLED IMPLEMENTATION**

This task authorizes implementation on a separate branch only. It does not authorize merge, publication, or production changes.

## Repository

`proaiexpert/proaiexpert.github.io`

## Required build branch

`article-pages-gemini-build-v1`

Do not modify:

- `main` directly;
- `site-integration-owner-qa-phase-a-v2-clean` directly;
- `article-pairs-gemini-stage-v1` directly;
- production;
- existing PR #19;
- the immutable article checkpoint.

## Base selection

PR #19 is currently open and contains the approved global-shell work.

Before creating the build branch:

1. inspect PR #19;
2. record its current head SHA and state;
3. if PR #19 remains open, create `article-pages-gemini-build-v1` from its current head;
4. if PR #19 has merged, create the branch from the resulting current `main` merge state;
5. do not use an older `portfolio-rebrand-v1` snapshot;
6. report the exact base SHA.

At task creation, PR #19 head was:

`b03e94d2e5f0962cb45588f1756e3ed92fbccb51`

This SHA is a reference only. Re-check before branching.

## Read first

1. PR #19 description and changed-file context.
2. Current repository handoff and existing article implementation conventions.
3. Existing EN/RU Insights index pages and at least two current EN/RU article pairs.
4. `docs/content-factory/article-pairs-v1/gemini-workspace/stage-3-approved-source-manifest-v1.md`
5. `docs/content-factory/article-pairs-v1/gemini-workspace/reports/stage-2-v2-main-author-adjudication-v1.md`
6. `docs/content-factory/article-pairs-v1/checkpoint-before-gemini/governance/final-routes-and-metadata-manifest-v1.md`
7. all four immutable baseline article files.
8. both final implementation handoff V2 files.
9. `creative-candidates/stage-2-v2/premium-article-system-blueprint-v2.md`
10. Financial Stream evidence-gate document.

## Content authority

The four immutable baseline articles are the complete body-copy authority.

Do not render the shortened Stage 2 V1 or Hybrid V2 files as complete article bodies.

Hybrid V2 may provide only the supplemental modules explicitly approved by `stage-3-approved-source-manifest-v1.md`.

Every material baseline decision dimension must remain present in the rendered page.

## Required routes

### Pair 1 — Multilingual website decision

RU:

`/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/`

EN:

`/insights/does-your-service-business-need-a-multilingual-website/`

### Pair 2 — Website proposal evaluation

RU:

`/ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/`

EN:

`/insights/how-to-evaluate-a-website-proposal/`

Use only the approved metadata manifest for titles, descriptions, H1s, canonical URLs, and language relationships.

## Integration scope

Implement:

1. all four localized article routes;
2. matching cards or entries on EN and RU Insights index pages following current conventions;
3. reciprocal language switching between each article pair;
4. approved related-content modules without cannibalization;
5. sitemap entries if required by the current repository architecture;
6. internal links to the correct localized routes;
7. approved CTA destinations already present on the site.

Do not invent new service routes or CTA destinations.

## Design objective

Create two related premium article systems, not four unrelated pages.

### Shared character

- premium editorial authority;
- analytical, calm, evidence-based tone;
- strong scanning and long-form readability;
- proprietary ProAI Expert visual language;
- restrained surfaces and borders;
- no generic AI imagery;
- no dashboard imitation;
- no excessive glassmorphism;
- no decorative metrics;
- no copied fintech or portfolio-case geometry.

### Pair 1 signature

- language-continuity visual logic;
- three-level Language Coverage Ladder;
- demand-verification module;
- Broken Journey scenario;
- translation-versus-localization comparison;
- customer-journey / CRM continuity path;
- governance and English-only boundary module.

### Pair 2 signature

- same-page-count / different-project comparison;
- Sales-to-Signature reconciliation;
- seven proposal areas;
- Proposal Risk Ledger;
- responsibility matrix;
- Business Control Map;
- acceptance-evidence module;
- revisions / defects / maintenance taxonomy;
- evidence-discipline module;
- normalized A/B/C comparison;
- Decision Gate.

## Site-shell requirements

Preserve the current approved shell from the selected PR #19 base:

- fixed header behavior;
- localized navigation;
- one primary navigation landmark;
- one `<main>` landmark;
- current footer system;
- current language-switch conventions;
- current responsive breakpoints unless a scoped article requirement justifies an additive rule.

Do not regress or duplicate shared navigation and footer markup.

## Content and semantic requirements

- exactly one H1 per page;
- correct document `lang`;
- correct title and meta description;
- self-canonical;
- reciprocal `hreflang`;
- conditional `x-default` only if the current site-wide policy explicitly uses it;
- Article or BlogPosting structured data following the current site convention;
- correct publication and modification dates only when supported by repository data;
- primary-source links adjacent to the relevant claims;
- no unsupported author, review, rating, outcome, or performance data;
- explicit non-legal boundary for proposal articles;
- Financial Stream architecture example remains unlinked unless the evidence gate is separately satisfied.

## Tables, matrices, and mobile behavior

Preserve data relationships.

Desktop options:

- semantic tables;
- comparison grids;
- structured ledgers;
- labeled decision rails.

Mobile options:

- semantic scrollable tables with a visible scroll affordance;
- labeled stacked rows;
- `<dl>` transformations;
- compact card groups where every data key remains adjacent to its value.

Do not:

- use swipe-only cards as the only way to access data;
- hide core content behind JavaScript;
- remove source columns or acceptance fields merely to fit the screen;
- convert tables into visually attractive but semantically ambiguous cards.

## Accessibility

Target WCAG 2.2 AA.

Required:

- semantic headings and landmarks;
- table captions and correct `<th scope>` relationships;
- keyboard-operable controls;
- visible focus states;
- links distinguishable without color alone;
- risk labels include text or icons, not color only;
- correct language-of-page and language-of-parts handling;
- reduced-motion support;
- no-JS readable content;
- sensible reading order at all breakpoints.

Do not claim certification or universal compliance based only on automated testing.

## Motion

Allowed:

- subtle initial reveal that does not delay reading;
- restrained hover and focus feedback;
- lightweight section emphasis;
- optional reading-progress treatment if it is accessible and unobtrusive.

Not allowed:

- scroll-jacking;
- continuous decorative animation;
- autoplay media;
- parallax-heavy scenes;
- counters without real data;
- motion that changes the reading order;
- essential information visible only after animation.

Respect `prefers-reduced-motion`.

## Performance

- prefer semantic HTML and CSS;
- reuse existing assets and styles where appropriate;
- avoid heavy frameworks or libraries;
- use minimal JavaScript only for optional enhancement;
- prevent layout shifts;
- optimize any added assets;
- do not add background video or oversized decorative media.

## Required validation

### Content retention

For each route, compare the rendered page with its canonical baseline article and produce a section-retention checklist.

A material baseline section must be:

- rendered directly;
- visually transformed without content loss;
- intentionally merged with all decision dimensions preserved.

### Technical validation

Check:

- route opens directly;
- no broken internal links;
- correct language switch;
- canonical and `hreflang` reciprocity;
- sitemap relation;
- one H1;
- one main landmark;
- schema validity against the existing convention;
- UTF-8 integrity;
- no malformed HTML;
- no duplicate IDs;
- no console errors caused by the new pages.

### Responsive visual QA

Capture all four routes at minimum:

- desktop approximately 1440px;
- tablet approximately 1024px;
- mobile 390px portrait.

Inspect:

- hero rhythm;
- long RU headings;
- table and matrix transformations;
- source blocks;
- CTA placement;
- header/footer integration;
- language switch;
- focus and hover states where practical.

Store review screenshots in a GitHub Actions artifact or another temporary review-only location. Do not add large permanent screenshot binaries to production paths.

### Accessibility and fallback QA

- keyboard pass;
- visible-focus pass;
- reduced-motion pass;
- no-JS content pass;
- automated accessibility scan as a supporting check only;
- manual semantic review of tables and headings.

## Required repository deliverables

Create under:

`docs/content-factory/article-pairs-v1/gemini-workspace/stage-3-build/`

1. `implementation-manifest-v1.md`
2. `content-retention-checklist-v1.md`
3. `metadata-hreflang-canonical-check-v1.md`
4. `source-link-manifest-v1.md`
5. `accessibility-responsive-nojs-qa-v1.md`
6. `diff-and-test-summary-v1.md`
7. `review-evidence-manifest-v1.md`

The implementation files themselves should follow the current repository’s article structure and shared-style conventions.

## Git workflow

1. Re-check PR #19 state and base SHA.
2. Create or use only `article-pages-gemini-build-v1`.
3. Implement the complete scope.
4. Run validation and capture visual evidence.
5. Commit and push only to the build branch.
6. Do not create a PR.
7. Do not merge.
8. Do not publish.
9. Stop and report for owner review.

## Completion response

Return only:

- status;
- selected base branch and exact base SHA;
- build branch;
- final commit SHA;
- changed-file count;
- links to the four branch routes or file paths;
- link to `implementation-manifest-v1.md`;
- link to `content-retention-checklist-v1.md`;
- link to QA summary;
- link to review-evidence manifest or artifact;
- blockers or known limitations.

Do not paste the complete articles into Telegram.