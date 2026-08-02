# PROAI EXPERT — GEMINI STAGE 3 PREMIUM ARTICLE PAGES BUILD TASK V1

**Status:** IMPLEMENTATION TASK APPROVED FOR EXECUTION ONLY AFTER OWNER SENDS THIS FILE TO GEMINI  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Task-authoring production snapshot:** `main` at `f2aa1770b2c2ff5ac3918f18e5cdc1e69e2c3c2c`  
**Open Pull Requests at task authoring:** none  
**Editorial source branch:** `article-pairs-gemini-stage-v1`  
**Page build:** not started  
**Pull Request / merge / publication:** not authorized

---

## 0. EXECUTION CONTRACT

Build four complete premium article pages for ProAI Expert from the four frozen, approved article bodies.

This is a physical website implementation task, not a research task and not a writing task.

You must:

- create a dedicated implementation branch from the actual current `origin/main`;
- implement the four approved routes;
- preserve the approved article bodies and metadata exactly;
- integrate with the current post-PR-19 site shell;
- create a shared premium editorial page system rather than four unrelated templates;
- update the EN/RU Insights hubs and sitemap only as specified;
- complete technical and visual QA;
- push the implementation branch;
- place owner-review screenshots in a separate temporary GitHub review branch;
- stop before creating a Pull Request, merging, deploying, or publishing.

You must not:

- modify `main` directly;
- use this task-authoring branch as the build base;
- start a new content strategy or SERP research cycle;
- rewrite, shorten, expand, simplify, translate, reorder, or “improve” the approved article text;
- revive superseded Gemini, Hybrid V2, baseline, or earlier-candidate wording;
- create a PR;
- merge;
- publish;
- add or reconfigure Chatbase;
- add unverified claims, statistics, testimonials, results, rankings, leads, conversion, revenue, ROI, or legal guarantees.

Final execution must stop with the build branch and review-assets branch pushed for owner review.

---

# 1. PRE-FLIGHT: REPOSITORY AND BASELINE

Before changing any file:

1. Run:

   ```bash
   git fetch origin --prune
   git switch main
   git pull --ff-only origin main
   git rev-parse HEAD
   git status --short
   ```

2. Check current open Pull Requests.

3. Read the current canonical site handoff from the actual current `main`:

   `docs/PROAI_EXPERT_CURRENT_HANDOFF.md`

4. Confirm:

   - PR #19 remains merged;
   - the current global header/navigation system is the post-PR-19 implementation;
   - there is no newer canonical handoff that supersedes the file above;
   - no open PR already implements these four routes;
   - none of the four target routes already exists.

5. Record the resolved current `main` SHA.

6. Create the implementation branch from that exact SHA:

   ```bash
   git switch -c article-premium-pages-build-v1
   ```

If `main` differs from the task-authoring snapshot `f2aa1770b2c2ff5ac3918f18e5cdc1e69e2c3c2c`, use the newer verified `main`, record the difference, and continue only when the source package and target routes remain compatible.

If any target route already exists, do not create a duplicate. Stop and report the conflict.

---

# 2. MANDATORY SOURCE HIERARCHY

Read every source completely before implementation.

When sources conflict, the earlier item in this hierarchy wins.

## 2.1 Current website authority

1. Current canonical site handoff:

   https://github.com/proaiexpert/proaiexpert.github.io/blob/main/docs/PROAI_EXPERT_CURRENT_HANDOFF.md

## 2.2 Final editorial authority

2. Final main-author approval:

   https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/final-main-author-approval-v1.md

3. Final approved article bodies manifest:

   https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/final-approved-article-bodies-manifest-v1.md

## 2.3 Four frozen article bodies

4. Article 1 RU V7 — blob SHA `57cb79bd2d8fd8ba614e7370defad8546fda116e`:

   https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-01-ru-final-candidate-v7.md

5. Article 1 EN V5 — blob SHA `2dac3dcb70385808afd76843dc60c529d85a78e5`:

   https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-01-en-final-candidate-v5.md

6. Article 2 RU V6 — blob SHA `17cbfee69421e6e11101a0ef3770ec8dabf8e5e0`:

   https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-02-ru-final-candidate-v6.md

7. Article 2 EN V6 — blob SHA `f02b55ff8552e6eb067d09663a35afa29b130b55`:

   https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-02-en-final-candidate-v6.md

## 2.4 Final QA and approval evidence

8. Final editorial readiness report V2:

   https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/final-editorial-readiness-report-v2.md

9. Final factual and source QA V2:

   https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/final-factual-and-source-qa-v2.md

10. Article 1 RU/EN Pair QA V3:

    https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-01-ru-en-final-pair-qa-v3.md

11. Article 2 RU/EN Pair QA V3:

    https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-02-ru-en-final-pair-qa-v3.md

12. Final section coverage matrix:

    https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/final-section-coverage-matrix-v1.md

13. Final editorial change register:

    https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/final-editorial-change-register-v1.md

14. Final RU language-polish register:

    https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/final-ru-language-polish-register-v1.md

## 2.5 Page-system and metadata authority

15. Final page module map V1:

    https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/final-page-module-map-v1.md

16. Final routes and metadata manifest V1:

    https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/checkpoint-before-gemini/governance/final-routes-and-metadata-manifest-v1.md

The older status lines inside some candidate and module-map files are historical workflow labels. The final main-author approval and final approved bodies manifest supersede those labels.

Earlier Gemini reports, Stage 2 V1/V2, Hybrid V2, baseline candidates, old Stage 3 drafts, chat summaries, and historical implementation notes must not override the sources above.

---

# 3. CONTENT FREEZE AND PUBLIC-RENDER RULE

The four approved Markdown files are the only article-body source of truth.

## 3.1 What must be preserved exactly

From the first public H1 through the final CTA section, preserve:

- section order;
- every heading;
- every paragraph;
- every list item;
- every table;
- every table field and empty worksheet cell;
- every scenario and its hypothetical label;
- every disclaimer;
- every decision framework;
- every warning boundary;
- every source link, anchor text, and adjacent claim relationship;
- every CTA heading, explanatory paragraph, and service boundary;
- RU and EN structural differences.

Do not:

- paraphrase;
- polish;
- condense;
- summarize;
- combine sections;
- split one sentence into rewritten copy;
- alter punctuation for style;
- replace Russian terminology with English;
- force RU and EN into identical module order;
- convert either language into a mechanical translation of the other.

## 3.2 Internal control header must not be public

Each approved Markdown candidate begins with internal workflow lines such as:

- status;
- canonical route;
- canonical H1;
- source hierarchy;
- publication status.

These internal control lines are not public article content.

Public rendering begins at the Markdown H1 and ends at the final CTA content.

Markdown `---` separators may become visual section transitions and do not have to render as literal horizontal rules, but they must not be used to reorder or remove content.

## 3.3 Only authorized content exception

Article 1 RU contains the named Financial Stream architecture module.

It may be removed only if the Financial Stream implementation gate in Section 14 fails.

No other approved content may be removed.

## 3.4 Machine content-integrity check

Create a deterministic content-integrity script or audit that:

1. extracts the approved public body from each Markdown source;
2. extracts the rendered visible article content in DOM order;
3. normalizes only HTML entities, whitespace, and typographic rendering differences;
4. compares headings, paragraphs, list items, table cells, link text, and URLs;
5. reports any missing, added, moved, or changed material text.

The final result must show `PASS` for all four pages, except an explicitly authorized Financial Stream module removal if the gate fails.

---

# 4. LOCKED ROUTES AND METADATA

Use these values literally.

| ID | Language | Route | H1 | SEO title | Meta description |
|---|---|---|---|---|---|
| A1-RU | `ru` | `/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/` | `Сайт для русскоязычного бизнеса в США: только английский, отдельный русский раздел или две версии?` | `Сайт для русскоязычного бизнеса в США: какой вариант выбрать` | `Как выбрать между сайтом на английском, отдельной русской поддержкой и полноценной RU/EN-системой для бизнеса в США — без лишнего объёма.` |
| A1-EN | `en` | `/insights/does-your-service-business-need-a-multilingual-website/` | `Does Your U.S. Service Business Need a Multilingual Website?` | `Does Your Service Business Need a Multilingual Website?` | `Choose between English-only, focused language support, and full multilingual coverage based on real demand, service capacity, and maintenance.` |
| A2-RU | `ru` | `/ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/` | `Как проверить подрядчика и предложение на сайт в США — и снизить риск переделки` | `Как проверить подрядчика и предложение на разработку сайта` | `Как сравнить предложения на сайт: объём работ, ответственность, доступы, лицензии, приёмка, запуск и поддержка — до подписания договора.` |
| A2-EN | `en` | `/insights/how-to-evaluate-a-website-proposal/` | `How to Evaluate a Website Proposal Before You Sign` | `How to Evaluate a Website Proposal Before You Sign` | `Compare website proposals by scope, responsibilities, ownership, acceptance, and support—not page count or price alone.` |

Requirements:

- `<html lang>` must match the locked language.
- Exactly one visible H1 per page.
- `<title>` must equal the locked SEO title exactly; do not append or prepend another phrase.
- Meta description must equal the locked value exactly.
- Each page must use a self-canonical fully qualified URL.
- Language pairs must use reciprocal and identical annotation sets:
  - self `hreflang`;
  - corresponding `en`;
  - corresponding `ru`.
- Current production uses English as `x-default` for paired EN/RU pages. Confirm that this remains the current site-wide strategy at build start. If confirmed, use the EN URL as `x-default` on both pages in each pair.
- Language switcher must link directly to the corresponding paired article, never to an Insights homepage.
- Do not create the superseded route:
  `/ru/insights/kak-vybrat-podryadchika-dlya-sayta-v-ssha/`
- Inspect repository history, sitemap, links, and production references for the superseded route. If it was never published or linked, do not create a redirect. If evidence shows it was public, stop and report before implementing a redirect.

---

# 5. QUERY OWNERSHIP AND CANNIBALIZATION CONTROL

## Article 1 owns

- whether a U.S. service business needs multilingual website coverage;
- English-only versus focused language support versus full multilingual coverage;
- demand verification;
- customer-language continuity;
- localization versus translation;
- multilingual content governance.

It must not be reframed as:

- general AI-ready website strategy;
- general website cost;
- website builder versus custom website;
- broad local SEO;
- a promise of Russian-language rankings;
- a Financial Stream performance case.

## Article 2 owns

- evaluating a website proposal before signing;
- normalizing scope;
- proposal/SOW/agreement traceability;
- responsibilities and client inputs;
- dependencies;
- rights and practical control;
- acceptance evidence;
- support and change boundaries.

It must not be reframed as:

- a general website cost article;
- a legal due-diligence service;
- a universal contractor-ranking system;
- a guarantee against disputes;
- a broad “how to choose the best agency” page.

Do not alter headings, metadata, hero language, side labels, internal links, or related-content labels in a way that shifts this ownership.

---

# 6. CURRENT SITE INTEGRATION BASELINE

Before building, inspect the then-current versions of:

- `insights/ai-ready-website-for-business/index.html`
- `ru/insights/ai-ready-sayt-dlya-biznesa/index.html`
- `insights/index.html`
- `ru/insights/index.html`
- `assets/css/global-header-parity-v2.css`
- `mobile-behavior-v123.css`
- `mobile-behavior-v123.js`
- `websites-branding/index.html`
- `ru/websites-branding/index.html`
- `contact/index.html`
- `ru/contact/index.html`
- `sitemap.xml`
- `robots.txt`

Use current post-PR-19 shell conventions:

- fixed `.global-header`;
- unique `id="site-navigation"`;
- localized `aria-label`;
- correct `aria-current`;
- `aria-controls="site-navigation"`;
- EN menu breakpoint at 1100px;
- RU menu breakpoint at 1200px;
- one `<main>`;
- current non-portfolio global footer;
- current mobile behavior and Escape/focus handling;
- current EN/RU navigation labels and contact paths.

Do not copy a stale pre-PR-19 header.

Do not edit shared global header or mobile files unless a concrete page-integration defect is first demonstrated. If a shared-shell defect is discovered, stop and report it rather than broadening this task.

Existing article pages contain large inline style blocks and legacy inline integrations. Do not reproduce that architecture blindly.

The four new pages should use a shared external premium article system.

---

# 7. REQUIRED IMPLEMENTATION FILES

Create:

## 7.1 Four pages

- `ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/index.html`
- `insights/does-your-service-business-need-a-multilingual-website/index.html`
- `ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/index.html`
- `insights/how-to-evaluate-a-website-proposal/index.html`

## 7.2 Shared article system

Create one shared stylesheet:

- `assets/css/premium-insights-v1.css`

Optional progressive-enhancement JavaScript:

- `assets/js/premium-insights-v1.js`

Create the JavaScript file only when it provides real value. Core content, tables, navigation, sources, and CTA must work without it.

Do not add a framework, package runtime, bundler, React, Vue, MDX, animation library, icon library, or third-party UI dependency.

## 7.3 Visual assets

Create four page-specific 1200×630 social images from the approved page visual system, without stock photography or unverified imagery:

- `assets/insights/og/article-01-ru-language-coverage.png`
- `assets/insights/og/article-01-en-language-coverage.png`
- `assets/insights/og/article-02-ru-proposal-review.png`
- `assets/insights/og/article-02-en-proposal-review.png`

They may be generated from HTML/CSS/SVG and captured locally.

Requirements:

- correct language;
- no unsupported claims;
- no tiny body copy;
- no flags, ethnic stereotypes, fake dashboards, fake client logos, or fake metrics;
- compressed reasonably;
- correct `og:image`, Twitter image, and descriptive image alt.

## 7.4 Existing files allowed to change

Only when required:

- `insights/index.html`
- `ru/insights/index.html`
- `sitemap.xml`

Do not modify:

- homepage EN/RU;
- Websites & Branding EN/RU;
- AI Systems EN/RU;
- About EN/RU;
- Contact EN/RU;
- case-study pages;
- portfolio archive;
- canonical site handoff;
- robots.txt;
- contact-form fields;
- Chatbase configuration;
- unrelated Insights pages.

## 7.5 Build evidence

Create:

- `docs/content-factory/article-pairs-v1/stage-3-build-v1/implementation-manifest.md`
- `docs/content-factory/article-pairs-v1/stage-3-build-v1/content-integrity-report.json`
- `docs/content-factory/article-pairs-v1/stage-3-build-v1/metadata-manifest.json`
- `docs/content-factory/article-pairs-v1/stage-3-build-v1/source-link-manifest.json`
- `docs/content-factory/article-pairs-v1/stage-3-build-v1/qa-report.md`
- `docs/content-factory/article-pairs-v1/stage-3-build-v1/diff-summary.md`

Do not place screenshots or Lighthouse JSON in the implementation branch.

---

# 8. PREMIUM EDITORIAL ART DIRECTION

The new pages must be materially stronger than the existing standard article template while remaining recognizably ProAI Expert.

Target:

- premium editorial landing page;
- strategic decision instrument;
- calm, precise, technically credible;
- strong hierarchy and pacing;
- visual clarity without decorative noise;
- reusable as a possible future Insights standard.

Do not produce:

- a generic blog post;
- four identical pages with different text;
- a case-study clone;
- a fintech dashboard;
- glassmorphism overload;
- giant decorative numbers everywhere;
- stock-business imagery;
- neon cyberpunk;
- parallax;
- auto-playing animation;
- horizontal carousels;
- swipe-only information;
- accordion-only core content;
- decorative visuals that replace methodology.

## 8.1 Shared visual system

All four pages should share:

- current ProAI black/graphite shell;
- current cyan and restrained violet brand accents;
- consistent typography;
- one article width system;
- one source-block system;
- one table system;
- one CTA system;
- one breadcrumb and metadata system;
- one sticky desktop contents system;
- one responsive mobile contents treatment;
- one focus and reduced-motion system.

## 8.2 Pair 1 visual identity — Language Continuity

Use a distinct visual language based on:

- language coverage levels;
- continuity paths;
- paired routes;
- handoff points;
- coverage boundaries;
- governance and maintenance.

Suitable motifs:

- connected language nodes;
- route lines;
- a three-level coverage ladder;
- page → form → confirmation → routing → first-response sequence;
- paired EN/RU page structures;
- calm signal maps.

Do not use national flags, cultural stereotypes, demographic maps, or claims of market size.

## 8.3 Pair 2 visual identity — Proposal Control

Use a distinct visual language based on:

- document reconciliation;
- scope fields;
- responsibility;
- external dependencies;
- rights and access;
- acceptance evidence;
- risk visibility.

Suitable motifs:

- document layers;
- ledger grids;
- field relationships;
- source traceability;
- control maps;
- Definition of Done;
- decision gates.

Green/yellow/red may appear only for the approved risk labels and must always be paired with explicit text. Never communicate status through color alone.

## 8.4 RU/EN relationship

Within each pair:

- share visual DNA;
- use corresponding module types where the content systems correspond;
- retain language-specific pacing, section order, examples, headings, and editorial rhythm;
- do not force equal section counts or paragraph-by-paragraph symmetry.

---

# 9. PAGE ARCHITECTURE

Each page must include:

1. skip link to the main article content;
2. current global header;
3. breadcrumbs;
4. localized back-to-Insights link;
5. premium hero;
6. exact H1;
7. exact approved executive summary;
8. calculated read time, category, and publication date;
9. article body in approved order;
10. desktop table of contents derived only from actual H2 sections;
11. mobile table of contents that remains usable without JavaScript;
12. mapped premium editorial modules;
13. contextual source blocks beside supported claims;
14. final approved CTA;
15. current non-portfolio global footer.

The hero may use the approved executive summary and existing article metadata. Do not invent a second deck that restates or changes the thesis.

Do not add a second top-of-page commercial CTA. The approved commercial CTA remains at the end.

Calculate read time from the actual public body:

- EN: 220 words per minute, rounded up;
- RU: 180 words per minute, rounded up.

Use the actual build-date calendar date in Pacific Time for the initial visible publication date and `datePublished`. Set `dateModified` equal on first build. Record the exact values in the metadata manifest. A later publication review may update these dates if needed.

---

# 10. REQUIRED MODULE MAPPING

Use the final page module map as the editorial mapping authority. The list below is an implementation checklist, not permission to change order or copy.

## 10.1 Article 1 RU

Required treatments:

- executive-summary rail;
- owner/team/customer language distinction with three restrained submodules;
- clearly labeled hypothetical broken-language-journey module;
- linear continuity flow;
- three website model comparison;
- full language-model decision matrix;
- demand-evidence field table;
- five decision questions;
- journey-before-archive seven-step sequence;
- language-continuity checklist;
- translation-versus-localization table;
- Google technical source block;
- WCAG source block;
- post-launch governance sections;
- first-contact continuity boundary;
- Financial Stream architecture module only after gate pass;
- visible performance/no-guarantee boundary;
- eight-step final decision sequence;
- approved final CTA.

## 10.2 Article 1 EN

Required treatments:

- executive-summary rail;
- clearly labeled hypothetical broken-language-journey module;
- three-level Language Coverage Ladder;
- demand-evidence field table;
- five expansion questions;
- journey-before-archive sequence;
- continuity test;
- translation-versus-localization table;
- tax example;
- Google technical source block;
- WCAG source block;
- five governance rules;
- qualified Digital.gov source note;
- visible performance/no-guarantee boundary;
- seven-step final decision sequence;
- approved final CTA.

Do not add Financial Stream to the EN article.

## 10.3 Article 2 RU

Required treatments:

- executive-summary rail;
- clearly labeled same-page-count hypothetical scenario;
- proposal/SOW/agreement/estimate relationship module;
- seven-area overview;
- complete Proposal Risk Ledger with all fields and blank worksheet cells;
- Ledger field definitions;
- business-objective diagnostic;
- five scope groups;
- scope table;
- responsibility and client-input matrix;
- ICANN source block;
- U.S. Copyright Office source block;
- rights and practical-control map;
- technology/dependency diagnostic;
- integration specification;
- Definition of Done and acceptance-evidence table;
- W3C accessibility-evaluation source block;
- revision/change request/defect/maintenance taxonomy;
- evidence taxonomy;
- contextual warning signals;
- A/B/C proposal comparison with Source A/B/C columns;
- green/yellow/red text labels;
- red-risk three-option decision gate;
- repeat-cost explanation;
- ten-step final sequence;
- approved final CTA and legal boundary.

## 10.4 Article 2 EN

Required treatments:

- executive-summary rail;
- clearly labeled same-page-count hypothetical scenario;
- Sales-to-Signature document relationship module;
- seven-area overview;
- complete Proposal Risk Ledger;
- Ledger field definitions;
- business-objective diagnostic;
- five scope groups;
- scope matrix;
- responsibility matrix;
- ICANN source block;
- U.S. Copyright Office source block;
- Business Control Map;
- technology/dependency diagnostic;
- integration specification;
- Definition of Done and acceptance-evidence table;
- W3C source block;
- change taxonomy;
- evidence taxonomy;
- contextual warning signals;
- normalized A/B/C proposal comparison with Source A/B/C columns;
- green/yellow/red text labels;
- red-item decision gate;
- repeat-cost explanation;
- ten-step sequence;
- approved final CTA and legal boundary.

---

# 11. TABLE AND WORKSHEET BEHAVIOR

Tables are core methodology, not decoration.

Requirements:

- use semantic `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<th scope>`, and valid relationships;
- preserve every approved column, row, field, blank cell, and source relationship;
- do not fill blank worksheet cells with invented examples;
- do not replace a complete matrix with simplified cards that drop fields;
- do not make a swipe carousel the only representation;
- do not hide columns behind tabs or accordions;
- provide a visible mobile scroll cue for horizontally scrollable tables;
- give the scroll container a keyboard-accessible label;
- ensure keyboard users can reach and operate the table region;
- prevent page-level horizontal overflow;
- keep first column/row legible when practical;
- pair all risk colors with text labels.

For smaller Article 1 comparison tables, a labelled stacked-row mobile transformation is permitted only when every original header/value relationship remains explicit.

For the Proposal Risk Ledger, responsibility matrices, Business Control Map, Definition of Done, and A/B/C comparison, prefer a complete semantic table within a controlled overflow region rather than flattening away relationships.

---

# 12. SOURCES AND LINKS

Preserve all approved primary-source URLs and keep them adjacent to the claims they support.

Create `source-link-manifest.json` containing for every external source:

- article ID;
- source organization;
- final URL;
- visible anchor text;
- section ID;
- adjacent supported claim summary;
- HTTP check result;
- whether the source blocks automated requests.

Do not:

- replace primary sources with secondary summaries;
- move all sources to a detached bibliography;
- hide source links in tooltips;
- claim a source proves more than it does;
- add an “E-E-A-T boost” claim;
- use `nofollow` on normal editorial primary-source citations.

External links may open in the same tab. When using a new tab, include `rel="noopener noreferrer"`.

Internal commercial destinations are locked:

| Page | Primary CTA label | Destination |
|---|---|---|
| A1-RU | `Обсудить языковую модель сайта` | `/ru/contact/#project-intake` |
| A1-EN | `Review Your Language Coverage Plan` | `/contact/#project-intake` |
| A2-RU | `Разобрать предложение на сайт` | `/ru/contact/#project-intake` |
| A2-EN | `Review My Website Proposal` | `/contact/#project-intake` |

Do not add:

- free audit language;
- free consultation language;
- guaranteed-result language;
- extra commercial CTA blocks;
- a public Financial Stream case link;
- invented “related” links.

The language switch, breadcrumbs, Insights hub link, primary CTA, and current global footer links are sufficient internal paths for this Stage.

---

# 13. INSIGHTS HUBS AND SITEMAP

## 13.1 EN Insights hub

Update `insights/index.html` narrowly:

- add both new EN articles to the top of the curated feed;
- add both new EN articles to the archive list;
- retain all existing articles;
- do not remove or rewrite existing cards;
- do not redesign the hub;
- use accurate title, category, calculated read time, publication date, premise derived directly from the approved executive summary, and route.

Do not replace the existing featured article automatically.

## 13.2 RU Insights hub

Update `ru/insights/index.html` with the corresponding two RU articles using the same narrow rules.

## 13.3 Sitemap

Add exactly the four canonical routes to `sitemap.xml`.

Use the actual build date as `lastmod`.

Do not modify existing URL entries except to maintain valid XML formatting.

Do not change `robots.txt`.

---

# 14. FINANCIAL STREAM IMPLEMENTATION GATE

Before rendering the named Financial Stream module in Article 1 RU:

1. Resolve the current live-site URL from the current ProAI Expert Financial Stream case/homepage link.
2. Inspect the live site directly.
3. Verify all four observable architecture facts:

   - separate EN and RU routes;
   - corresponding service structures;
   - consistent brand system;
   - multiple contact paths.

4. Record evidence in `implementation-manifest.md`:

   - URLs checked;
   - date/time checked;
   - what was observed for each fact;
   - screenshots or DOM evidence location;
   - pass/fail result.

## Gate result

### PASS

Render the approved Financial Stream section exactly as written.

Do not add:

- a public case-study link;
- a live-site link inside the article module;
- traffic, ranking, lead, conversion, revenue, or ROI claims.

### FAIL

Remove the entire named Financial Stream section from the public Article 1 RU page.

Preserve all surrounding general methodology.

Record the authorized removal in the content-integrity report.

Do not replace it with:

- a weaker unsupported statement;
- a generic client claim;
- a performance claim;
- another case.

---

# 15. METADATA, SOCIAL, AND SCHEMA

Each page requires:

- UTF-8;
- viewport;
- favicon set consistent with current pages;
- exact meta description;
- exact title;
- self canonical;
- reciprocal `hreflang`;
- confirmed `x-default` behavior;
- `og:site_name`;
- correct `og:locale`;
- corresponding `og:locale:alternate`;
- exact `og:title`;
- exact `og:description`;
- canonical `og:url`;
- `og:type="article"`;
- page-specific `og:image`;
- useful `og:image:alt`;
- Twitter summary-large-image fields.

Use valid `Article` JSON-LD consistent with the current Insights architecture.

Required fields:

- `@context`;
- `@type: Article`;
- exact `headline`;
- exact `description`;
- `author` as the current approved `Organization` identity `ProAI Expert`, following the existing article convention;
- `publisher` as `ProAI Expert`;
- `datePublished`;
- `dateModified`;
- `mainEntityOfPage`;
- `inLanguage`;
- social image URL.

Do not add:

- FAQ schema;
- HowTo schema;
- Review schema;
- AggregateRating;
- fake Person credentials;
- unsupported service or result claims.

Schema must reflect visible page content.

---

# 16. NO-JS, ACCESSIBILITY, AND MOTION

## 16.1 No-JS

With JavaScript disabled:

- all article text remains visible;
- every heading remains visible;
- every source link works;
- every table remains readable;
- table-of-contents links work;
- language switch works;
- breadcrumbs work;
- primary CTA works;
- no content is hidden behind reveal classes;
- no visual module is the only copy of essential information.

Progressive enhancement may add:

- restrained reading progress;
- active table-of-contents state;
- subtle module entrance;
- non-essential visual state.

## 16.2 Accessibility

Requirements:

- one H1;
- logical H2/H3 structure;
- one `<main>`;
- semantic `<article>`;
- unique IDs;
- visible skip link;
- visible focus styles;
- 44px target size where practical;
- keyboard-operable navigation;
- Escape closes mobile menu and returns focus;
- sufficient contrast;
- links distinguishable without color alone;
- risk states use text plus color;
- decorative SVGs use `aria-hidden="true"`;
- meaningful visuals have accessible text equivalents;
- table captions and header scopes;
- no inaccessible custom scroll behavior;
- no duplicate `site-navigation`;
- no ARIA used to repair invalid HTML.

Run automated accessibility checks, then perform manual keyboard and reading-order review.

## 16.3 Reduced motion

Under `prefers-reduced-motion: reduce`:

- disable non-essential transitions and animations;
- disable smooth scrolling;
- show all content immediately;
- keep the logo/header usable;
- avoid motion-dependent state.

No parallax, autoplay, infinite decorative animation, or scroll-jacking.

---

# 17. RESPONSIVE REQUIREMENTS

Test every route at:

- 1600×900;
- 1440×900;
- 1280×800;
- 1180×820;
- 1100×800;
- 1024×768;
- 980×768;
- 768×1024;
- 390×844;
- 360×800.

Header-specific expectations:

- EN changes to mobile navigation at 1100px;
- RU changes to mobile navigation at 1200px;
- no dead breakpoint;
- no hidden navigation without a visible toggle;
- open menu is a complete vertical panel;
- no horizontal desktop row in mobile state.

Article expectations:

- hero remains legible;
- H1 does not collide with visual modules;
- sticky contents never covers content;
- contents becomes non-sticky/inline on smaller screens;
- tables do not produce page-level overflow;
- CTA does not collide with footer;
- source links wrap cleanly;
- long RU words and English technical terms do not break layout;
- social/visual modules do not obscure text;
- no orphaned single-word heading lines where avoidable through layout rather than copy edits.

---

# 18. TECHNICAL QA

Run a local static server and test the final branch.

## 18.1 Route checks

Confirm HTTP 200 for:

- all four new routes;
- EN/RU Insights hubs;
- all CTA destinations;
- all language-switch destinations;
- all new local assets.

Confirm no target route redirects unexpectedly.

## 18.2 Static HTML audit

For every new page:

- UTF-8 without BOM;
- exactly one doctype;
- exactly one `<html>`, `<head>`, `<body>`, `<main>`;
- exactly one H1;
- no duplicate IDs;
- no malformed nesting;
- no mojibake;
- no empty `href`;
- no placeholder text;
- no internal editorial status text;
- no broken relative asset URLs;
- no accidental Chatbase embed;
- no duplicated menu controller.

## 18.3 Metadata audit

Verify exact values for:

- HTML language;
- title;
- meta description;
- canonical;
- `hreflang en`;
- `hreflang ru`;
- `x-default`;
- OG;
- Twitter;
- Article schema;
- language-switch route.

Verify reciprocity pair by pair.

## 18.4 Link audit

Check:

- internal links;
- source links;
- CTA anchors;
- hub links;
- sitemap URLs.

For official sources that block automated checks, record the block rather than replacing or deleting the source.

## 18.5 Content audit

Report:

- approved body source file and blob SHA;
- rendered heading count;
- rendered paragraph count;
- rendered list-item count;
- rendered table count;
- rendered link count;
- content-integrity PASS/FAIL;
- Financial Stream gate exception, if used.

## 18.6 Lighthouse

Run Lighthouse mobile after a warm-up for all four routes.

Return:

- Performance;
- Accessibility;
- Best Practices;
- SEO;
- LCP;
- CLS;
- TBT.

Target:

- Accessibility: 100;
- Best Practices: 100;
- SEO: 100;
- no material performance regression against the current EN/RU AI-ready article templates under the same local conditions.

Do not hide failures. Report exact audit IDs and nodes for any score below 100.

## 18.7 Manual QA

Verify manually:

- keyboard-only operation;
- focus order;
- mobile menu;
- table reading and scrolling;
- no-JS;
- reduced motion;
- source adjacency;
- CTA/footer spacing;
- RU/EN language-switch correspondence;
- visual distinction between Pair 1 and Pair 2;
- shared-system consistency across all four pages.

---

# 19. OWNER-REVIEW SCREENSHOTS — DIRECT GITHUB ACCESS

Do not ask the owner to download or forward ZIP files.

After the implementation branch is complete:

1. Create a temporary review branch from the final build SHA:

   `owner-review-article-stage-3-v1`

2. Add screenshots only to:

   `owner-review/article-stage-3-v1/`

3. Add `manifest.json`.

4. Do not create a PR from the review branch.

5. Do not place screenshots in the implementation branch.

Use headless Playwright Chromium.

Required PNGs:

## Full-page desktop

1. `01-a1-ru-full-desktop-1440.png`
2. `02-a1-en-full-desktop-1440.png`
3. `03-a2-ru-full-desktop-1440.png`
4. `04-a2-en-full-desktop-1440.png`

## Full-page mobile

5. `05-a1-ru-full-mobile-390.png`
6. `06-a1-en-full-mobile-390.png`
7. `07-a2-ru-full-mobile-390.png`
8. `08-a2-en-full-mobile-390.png`

## Critical module captures

9. `09-a1-ru-hero-and-language-models.png`
10. `10-a1-en-coverage-ladder-and-continuity.png`
11. `11-a2-ru-risk-ledger-mobile.png`
12. `12-a2-en-risk-ledger-desktop.png`
13. `13-a2-ru-control-map-and-definition-of-done.png`
14. `14-a2-en-abc-comparison-mobile.png`
15. `15-shared-footer-and-cta-mobile.png`
16. `16-ru-menu-open-1180.png`
17. `17-en-menu-open-1024.png`
18. `18-reduced-motion-no-hidden-content.png`

`manifest.json` must contain for every image:

- filename;
- route;
- viewport;
- capture purpose;
- width;
- height;
- byte size;
- SHA-256;
- PNG magic-byte check;
- visual inspection result.

Push the review branch and return its exact SHA.

---

# 20. GIT AND COMMIT PROTOCOL

Implementation branch:

`article-premium-pages-build-v1`

Permitted normal commits:

1. `feat: add premium Insights article system`
2. `feat: build approved website acquisition article pages`
3. `docs: add Stage 3 article build evidence`

Use fewer commits when appropriate, but keep them logical.

Do not:

- amend;
- force-push;
- rewrite published history;
- merge;
- create a PR;
- modify `main`.

Before final report:

```bash
git status --short
git diff --check origin/main...HEAD
git diff --stat origin/main...HEAD
git diff --name-only origin/main...HEAD
git log --oneline origin/main..HEAD
```

Tracked worktree must be clean.

Temporary QA dependencies, `node_modules`, Lighthouse JSON, browser caches, and local servers must not be committed.

---

# 21. REQUIRED FINAL REPORT

Return:

1. verified base `main` SHA;
2. open-PR status at build start;
3. implementation branch;
4. final implementation SHA;
5. matching remote SHA;
6. exact changed-file list;
7. four route results;
8. approved source file and blob SHA used for each route;
9. content-integrity result for each route;
10. Financial Stream gate evidence and result;
11. exact metadata table;
12. canonical/`hreflang` reciprocity result;
13. source-link manifest summary;
14. sitemap and Insights hub changes;
15. responsive-width matrix;
16. accessibility/no-JS/reduced-motion result;
17. Lighthouse table;
18. screenshot review branch and SHA;
19. exact count of PNG files;
20. known limitations;
21. confirmation that no PR was created;
22. confirmation that `main` was not changed;
23. confirmation that nothing was published.

Final line:

`STAGE 3 PREMIUM ARTICLE BUILD IS READY FOR OWNER REVIEW`

---

# 22. ABSOLUTE STOP CONDITION

After pushing:

- `article-premium-pages-build-v1`;
- `owner-review-article-stage-3-v1`;

stop.

Do not:

- open a Pull Request;
- mark anything ready for merge;
- merge;
- publish;
- modify `main`;
- start redesigning older Insights pages;
- propagate the new system to existing articles.

The four new pages and the reusable visual system must first receive owner and ChatGPT review.
