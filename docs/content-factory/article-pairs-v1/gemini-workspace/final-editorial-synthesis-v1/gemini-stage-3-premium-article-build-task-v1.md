# GEMINI STAGE 3 — PREMIUM ARTICLE PAGES PHYSICAL BUILD TASK V1

**Status:** APPROVED FOR GEMINI IMPLEMENTATION ONLY AFTER OWNER START COMMAND  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Task-authoring branch:** `article-pairs-gemini-stage-v1`  
**Verified production `main` at task authoring:** `f2aa1770b2c2ff5ac3918f18e5cdc1e69e2c3c2c`  
**Open Pull Requests at task authoring:** none  
**Implementation branch to create:** `article-pairs-premium-build-v1`  
**PR / merge / publication:** FORBIDDEN IN THIS STAGE

---

## 0. Mission

Physically build four complete premium ProAI Expert article pages from the frozen editorial package.

The result must be substantially more mature than the current legacy article template while remaining recognizably part of the post-PR-19 ProAI Expert website.

Gemini has meaningful creative freedom over:

- page composition;
- editorial hierarchy;
- hero composition;
- typography and spacing;
- lightweight CSS/SVG information graphics;
- article-specific modules;
- responsive transformations;
- restrained progressive motion;
- visual pacing and art direction.

Gemini has no editorial freedom over the approved article bodies, routes, search intent, metadata, factual boundaries, source relationships, legal qualifiers, CTA meaning, canonical relationships, or query ownership.

This is a page-system build, not a new writing cycle.

---

# 1. Mandatory preflight before any file is changed

## 1.1 Repository state

Run:

```bash
git fetch --all --prune
git status --short
git rev-parse origin/main
```

Then check current open Pull Requests.

Record:

- actual current `origin/main` SHA;
- all open PR numbers, branches, titles and changed-file overlap;
- local worktree status;
- whether the implementation branch already exists locally or remotely.

The task-authoring snapshot is:

```text
f2aa1770b2c2ff5ac3918f18e5cdc1e69e2c3c2c
```

Do not assume it remains current.

### If `main` changed after task authoring

Inspect every commit between the task-authoring SHA and current `origin/main`.

- If changes are documentation-only and do not affect the global shell, Insights, article templates, service pages, metadata, sitemap, redirects or the four target routes, use the actual newer `main` and record the new base SHA.
- If changes touch overlapping site files or architecture, stop before branch creation and return a conflict report.
- Never silently build from the older SHA.

### Pull Request conflict rule

If an open PR modifies any target route, Insights hub, `/websites-branding/`, `/ru/websites-branding/`, shared article CSS/JS, global header, sitemap or redirect behavior, stop and report the conflict.

## 1.2 Read current authority completely

Before implementation, read:

1. `docs/PROAI_EXPERT_CURRENT_HANDOFF.md` from the actual current `main`;
2. the actual current EN/RU Insights hubs;
3. at least one current paired article implementation;
4. `assets/css/global-header-parity-v2.css`;
5. current mobile-menu JavaScript behavior;
6. current global footer structure;
7. `sitemap.xml`;
8. current redirect mechanism, if one exists.

Do not reintroduce superseded PR #18 or intermediate PR #19 code.

## 1.3 Create the build branch

Only after preflight passes:

```bash
git switch main
git pull --ff-only origin main
git switch -c article-pairs-premium-build-v1
```

The branch must start from the verified actual current `main`.

Do not merge the editorial branch into the build branch.

Read approved source files with `git show`, a second worktree, or another read-only method. Copy only the approved public article content into the four new pages.

If `article-pairs-premium-build-v1` already exists, stop and report rather than resetting or force-updating it.

---

# 2. Source hierarchy — binding order

When any source appears to conflict, use this order.

## 2.1 Current website authority

1. Current `main`:
   `docs/PROAI_EXPERT_CURRENT_HANDOFF.md`
2. Current post-PR-19 shell, header, footer, navigation and responsive behavior.

## 2.2 Final editorial authority

On branch `article-pairs-gemini-stage-v1`:

1. `docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/final-main-author-approval-v1.md`
2. `docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/final-approved-article-bodies-manifest-v1.md`

## 2.3 Exact approved article bodies

Use only:

| Article | Approved source | Expected blob SHA |
|---|---|---|
| Article 1 RU | `article-01-ru-final-candidate-v7.md` | `57cb79bd2d8fd8ba614e7370defad8546fda116e` |
| Article 1 EN | `article-01-en-final-candidate-v5.md` | `2dac3dcb70385808afd76843dc60c529d85a78e5` |
| Article 2 RU | `article-02-ru-final-candidate-v6.md` | `17cbfee69421e6e11101a0ef3770ec8dabf8e5e0` |
| Article 2 EN | `article-02-en-final-candidate-v6.md` | `f02b55ff8552e6eb067d09663a35afa29b130b55` |

Base folder:

```text
docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/
```

Verify the four blobs before building. If any source blob differs, stop and report the mismatch.

## 2.4 QA and preservation authority

Read completely:

- `final-editorial-readiness-report-v2.md`
- `final-factual-and-source-qa-v2.md`
- `article-01-ru-en-final-pair-qa-v3.md`
- `article-02-ru-en-final-pair-qa-v3.md`
- `final-section-coverage-matrix-v1.md`
- `final-editorial-change-register-v1.md`
- `final-ru-language-polish-register-v1.md`

## 2.5 Page-system and metadata authority

Read completely:

- `final-page-module-map-v1.md`
- `docs/content-factory/article-pairs-v1/checkpoint-before-gemini/governance/final-routes-and-metadata-manifest-v1.md`

Earlier Gemini drafts, Hybrid V2, Stage 1/2 reports, baseline candidates and old Stage 3 drafts are historical only. They must not override the files above.

---

# 3. Public routes and immutable metadata

Create exactly these four routes.

## 3.1 Article 1 RU

```text
Route: /ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/
HTML lang: ru
H1: Сайт для русскоязычного бизнеса в США: только английский, отдельный русский раздел или две версии?
SEO title: Сайт для русскоязычного бизнеса в США: какой вариант выбрать
Meta description: Как выбрать между сайтом на английском, отдельной русской поддержкой и полноценной RU/EN-системой для бизнеса в США — без лишнего объёма.
Counterpart: /insights/does-your-service-business-need-a-multilingual-website/
```

## 3.2 Article 1 EN

```text
Route: /insights/does-your-service-business-need-a-multilingual-website/
HTML lang: en
H1: Does Your U.S. Service Business Need a Multilingual Website?
SEO title: Does Your Service Business Need a Multilingual Website?
Meta description: Choose between English-only, focused language support, and full multilingual coverage based on real demand, service capacity, and maintenance.
Counterpart: /ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/
```

## 3.3 Article 2 RU

```text
Route: /ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/
HTML lang: ru
H1: Как проверить подрядчика и предложение на сайт в США — и снизить риск переделки
SEO title: Как проверить подрядчика и предложение на разработку сайта
Meta description: Как сравнить предложения на сайт: объём работ, ответственность, доступы, лицензии, приёмка, запуск и поддержка — до подписания договора.
Counterpart: /insights/how-to-evaluate-a-website-proposal/
```

## 3.4 Article 2 EN

```text
Route: /insights/how-to-evaluate-a-website-proposal/
HTML lang: en
H1: How to Evaluate a Website Proposal Before You Sign
SEO title: How to Evaluate a Website Proposal Before You Sign
Meta description: Compare website proposals by scope, responsibilities, ownership, acceptance, and support—not page count or price alone.
Counterpart: /ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/
```

Do not change these values.

Do not create alternate slugs, aliases, city pages or thin variants.

## 3.5 Superseded Article 2 RU route

Search the current repository, sitemap, generated output and production references for:

```text
/ru/insights/kak-vybrat-podryadchika-dlya-sayta-v-ssha/
```

At task authoring, no repository reference was found.

- If it remains unpublished and unreferenced, do not create it and do not add a redirect.
- If implementation-time inspection proves it was published, linked or included in a sitemap, use the existing project redirect mechanism to create one permanent redirect to the authoritative route.
- Do not invent a JavaScript-only redirect.

Record the evidence and decision in the route manifest.

---

# 4. Content freeze and public-render rules

## 4.1 What must be preserved

For each approved body, preserve:

- every public section;
- every paragraph;
- every list item;
- every table field and relationship;
- every hypothetical label;
- every decision framework;
- every disclaimer and limitation;
- every primary-source link and its adjacency to the supported claim;
- every legal and technical qualification;
- every no-guarantee boundary;
- the approved CTA meaning;
- independent RU and EN structure.

Do not shorten the articles for design convenience.

Do not convert RU and EN into mirrored translations.

Do not revive wording from superseded Gemini, Hybrid or baseline files.

## 4.2 Internal candidate headers must not appear publicly

The approved Markdown files include internal workflow lines such as:

- `Status` / `Статус`;
- canonical route;
- source hierarchy;
- publication state;
- `FINAL CANDIDATE`;
- `PENDING MAIN-AUTHOR REVIEW`.

These are internal controls, not article content.

Do not render them in public HTML, metadata, visible copy, schema, screenshots or social images.

The public body begins with the approved H1 and continues through the approved final CTA section.

## 4.3 Permitted implementation transformations

Permitted:

- semantic HTML wrappers;
- section IDs for navigation;
- responsive table markup that preserves field relationships;
- accessible duplicate labels required for stacked mobile rows;
- visually hidden text needed for accessibility;
- source-link icons with accessible names;
- non-substantive punctuation/HTML-entity normalization;
- approved internal links placed in separate related-reading modules;
- editorial modules described in the final page module map;
- lightweight decorative SVG/CSS visuals that contain no new claim.

Forbidden:

- rewriting or summarizing approved paragraphs;
- deleting methodology;
- moving caveats into fine print;
- replacing tables with simplified cards that omit fields;
- hiding material content behind JavaScript;
- adding statistics, testimonials or outcomes;
- adding rankings, traffic, lead, conversion, revenue or ROI claims;
- adding legal conclusions or guarantees;
- changing CTA service boundaries;
- adding a Financial Stream portfolio-case link without a separately approved evidence gate.

## 4.4 Body-integrity control

Create a machine-readable body integrity manifest with one entry per article:

```json
{
  "approved_source_path": "...",
  "approved_blob_sha": "...",
  "public_route": "...",
  "rendered_sections": [],
  "tables": [],
  "source_links": [],
  "intentional_non-public_lines_removed": [],
  "implementation_only_text_added": [],
  "unapproved_substantive_edits": 0
}
```

Generate a normalized text comparison by section.

The final count of unapproved substantive edits must be zero.

Any unavoidable implementation-only label must be listed and must not alter article meaning.

---

# 5. Query ownership and non-cannibalization

## Article 1 RU owns

- whether a Russian-speaking U.S. business needs English-only, focused RU support or full RU/EN;
- owner/team/customer language distinction;
- language continuity and governance.

## Article 1 EN owns

- whether a U.S. service business needs multilingual coverage;
- English-only versus focused versus full language coverage;
- demand, operational capacity and maintenance.

## Article 2 RU owns

- how a Russian-speaking U.S. business owner evaluates a website contractor and proposal before signing;
- scope, responsibility, control, acceptance and rework risk.

## Article 2 EN owns

- how to evaluate a website proposal before signing;
- normalized scope, responsibilities, ownership/control, acceptance and support.

Do not broaden Article 1 into generic bilingual website design, translation services or local SEO.

Do not broaden Article 2 into generic website pricing, legal advice, contractor rankings or a vendor blacklist.

Related links must support the article without competing for its primary query.

---

# 6. Post-PR-19 shell integration

Use the actual current global shell rather than copying a legacy standalone header/footer into a parallel design system.

Required:

- `header.global-header`;
- unique `id="site-navigation"`;
- EN and RU localized primary navigation;
- `aria-current="page"` on Insights;
- matching `aria-controls` and `aria-expanded`;
- EN menu breakpoint behavior at 1100px;
- RU menu breakpoint behavior at 1200px;
- corresponding-language switch to the paired article route;
- existing project-intake CTA path;
- one `<main>`;
- one H1;
- current global footer structure and contact links;
- `/assets/css/global-header-parity-v2.css` loaded after page-local legacy rules where required by the current architecture.

Do not duplicate primary navigation items.

Do not reintroduce the old header dead zone.

Do not make the article pages a visually isolated microsite.

The new editorial system may be visually richer than current articles, but the global shell must remain consistent.

---

# 7. Premium editorial art direction

## 7.1 Quality target

Create a new premium article system that can plausibly become the future standard for ProAI Expert Insights.

It should feel materially stronger than the current article pages through:

- stronger editorial hierarchy;
- more intentional visual rhythm;
- better use of width and whitespace;
- signature information modules;
- clearer long-form navigation;
- more useful table behavior;
- disciplined typography;
- better mobile reading;
- restrained motion and state changes.

Do not achieve “premium” by adding visual noise.

## 7.2 Shared system, distinct article families

All four pages must share:

- typography tokens;
- spacing logic;
- source-link treatment;
- table accessibility system;
- CTA system;
- shell integration;
- focus states;
- responsive rules;
- reduced-motion behavior.

The two topic families may have distinct visual identities.

### Article family 1 — Language Coverage / Continuity

Suggested direction, not a literal layout mandate:

- language-path / continuity motif;
- coverage spectrum rather than country flags;
- customer-journey sequence;
- three-model comparison;
- calm cyan/violet signal system;
- governance and maintenance rhythm.

Avoid decorative flags, stereotypical cultural imagery and fake multilingual chat screenshots.

### Article family 2 — Proposal / Control / Traceability

Suggested direction, not a literal layout mandate:

- document layers;
- scope-to-source traceability;
- ledger and control-map visual logic;
- defined/unresolved risk states with text labels;
- restrained amber/red only where semantically justified;
- evidence and acceptance pathways.

Avoid courtroom imagery, legal-audit aesthetics, fear marketing and “red flag” sensationalism.

## 7.3 Hero requirements

Each article needs a premium editorial hero containing:

- localized breadcrumbs;
- topic label;
- exact locked H1;
- a concise approved premise drawn from the body without rewriting it;
- article meta that does not fabricate a publication date;
- a useful signature visual or information motif;
- a direct path to the first substantive section;
- corresponding-language switch in the global header.

Do not use generic stock photos.

Prefer lightweight CSS/SVG/editorial diagrams.

All SVG text must remain accessible or be duplicated in normal HTML.

## 7.4 Card-fatigue control

Do not render every section as the same rounded card.

Use a varied editorial grammar:

- full-width thesis moments;
- restrained rails;
- semantic tables;
- timeline/sequence bands;
- definition rows;
- source blocks;
- numbered decision gates;
- occasional bordered panels;
- whitespace-led narrative sections.

The design must still read as one coherent system.

## 7.5 Motion

Motion is optional and must be progressive enhancement only.

Allowed:

- subtle section reveal;
- active TOC progress;
- line or node emphasis;
- restrained hover/focus transitions.

Forbidden:

- content that begins hidden without a no-JS fallback;
- parallax that harms reading;
- auto-playing complex animation;
- motion required to understand a table or decision tool;
- animation on every block.

Implement `prefers-reduced-motion: reduce` and verify it.

---

# 8. Required module behavior

The final page module map is binding. Preserve language-specific hierarchy.

## 8.1 Article 1 RU

Must visibly and completely support:

- executive summary;
- owner/team/customer language distinction;
- clearly hypothetical broken-language journey;
- three website models;
- language-model decision matrix;
- real-demand evidence table;
- five decision questions;
- journey-before-archive sequence;
- language-continuity check;
- translation-versus-localization table;
- Google technical source block;
- WCAG source block;
- content governance system;
- Financial Stream architecture module only if its gate passes;
- performance/no-guarantee boundary;
- eight-step decision sequence;
- approved CTA.

## 8.2 Article 1 EN

Must visibly and completely support:

- executive summary;
- multilingual-community versus verified-demand distinction;
- hypothetical broken journey;
- three-level Language Coverage Ladder;
- demand evidence table;
- five expansion questions;
- journey-before-archive sequence;
- continuity test;
- translation-versus-localization table;
- Google and WCAG source blocks;
- five-part maintenance governance;
- qualified Digital.gov reference;
- performance/no-guarantee boundary;
- seven-step decision sequence;
- approved CTA.

## 8.3 Article 2 RU

Must visibly and completely support:

- executive summary and non-legal boundary;
- same-page-count hypothetical scenario;
- proposal/SOW/agreement/estimate reconciliation;
- seven-area overview table;
- complete Proposal Risk Ledger with all fields;
- Ledger field definitions and `НЕ ПРИМЕНЯЕТСЯ` logic;
- business objective;
- five scope groups and scope table;
- responsibility/client-input matrix;
- ICANN source block;
- copyright source block;
- rights and practical-control map;
- technology/dependency check;
- integration specification;
- Definition of Done and acceptance matrix;
- W3C source block and automated-testing boundary;
- revision/change request/defect/maintenance taxonomy;
- evidence taxonomy;
- contextual warning signals;
- A/B/C comparison with Source A/B/C relationships;
- text-labelled risk states;
- red-risk decision gate;
- repeat-cost explanation;
- ten-step sequence;
- approved CTA and legal boundary.

## 8.4 Article 2 EN

Must visibly and completely support the corresponding independently authored systems, including:

- Sales-to-Signature reconciliation;
- seven-area map;
- full Proposal Risk Ledger;
- actual-scope and responsibility matrices;
- Business Control Map;
- Definition of Done;
- change and evidence taxonomies;
- contextual warning logic;
- normalized A/B/C comparison;
- risk labels and decision gate;
- ten-step sequence;
- approved CTA and legal boundary.

Do not merge the seven-area map into the Ledger.

Do not remove `Client input`, `Document source`, `Open question`, source A/B/C or acceptance-evidence fields.

---

# 9. Responsive tables and information models

Tables are functional tools, not decoration.

## Desktop

- use semantic `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<th scope>` where a true table is retained;
- keep source and field relationships visually obvious;
- use sticky first column/header only if it does not break keyboard or zoom behavior.

## Tablet

- controlled horizontal overflow is permitted for very wide matrices only when accompanied by a visible instruction and preserved keyboard access;
- do not clip columns;
- do not shrink text below a readable size.

## Mobile

For core decision tools, prefer labelled stacked rows or repeated field labels.

Every value must remain attached to its header.

Do not use swipe-only cards as the sole representation.

Do not remove fields to make a table fit.

The Proposal Risk Ledger, Business Control Map, Definition of Done and A/B/C comparison require dedicated mobile verification.

Risk color must always be paired with explicit text.

---

# 10. Financial Stream architecture gate

Before rendering the named Financial Stream example in Article 1 RU, verify and document that all four facts remain observable:

1. separate EN/RU routes;
2. corresponding service structures;
3. consistent brand system;
4. multiple contact paths.

Use current observable repository/live-site evidence, not memory.

Create:

```text
financial-stream-architecture-gate.json
```

For each fact record:

- evidence URL or repository path;
- observation;
- timestamp;
- pass/fail;
- screenshot or source reference where useful.

### Gate result

- If all four pass, render the approved architecture-only module exactly within its existing evidence boundary.
- If any fact fails or cannot be verified, remove the entire named Financial Stream module from the public page.
- Preserve the surrounding general methodology.
- Do not replace the removed module with a weaker unsupported statement.
- Do not add a public portfolio-case link.
- Never add traffic, ranking, leads, conversion, revenue or ROI claims.

Record the decision in the implementation manifest.

---

# 11. Metadata, canonical, hreflang and schema

## 11.1 Required head metadata

Each page must include:

- UTF-8;
- viewport;
- current favicon set;
- exact locked meta description;
- self-canonical with fully qualified HTTPS URL;
- reciprocal self-referencing `hreflang="en"` and `hreflang="ru"`;
- matching annotation set on both pages of each pair;
- localized OG locale, title, description, URL and type `article`;
- Twitter summary-large-image metadata;
- unique relevant social preview image or approved shared pair asset;
- exact HTML `lang`;
- exact SEO title.

## 11.2 `x-default`

Do not add `x-default` automatically.

Inspect the current site-wide internationalization pattern and canonical handoff.

If EN is still the documented site-wide fallback and the current corresponding article pairs consistently use EN as `x-default`, use the EN article URL for both members of the pair and document the decision.

If the strategy is not supportable, omit `x-default` consistently from both pages and document why.

## 11.3 Structured data

Use valid JSON-LD reflecting visible content.

Minimum:

- `@type: Article`;
- exact headline;
- exact description;
- `mainEntityOfPage` exact canonical;
- author/publisher consistent with the current Insights convention;
- no invented Person author if current approved sources do not authorize one;
- image matching the social preview asset when used.

Do not fabricate `datePublished`.

Because publication is not authorized in this stage:

- omit public `datePublished` during owner-review build;
- record `release_date_status: PENDING_OWNER_PUBLICATION_AUTHORIZATION` in the metadata manifest;
- set the actual visible publication date and JSON-LD date only in a later owner-authorized release correction before merge/publication.

`dateModified` may be omitted during review rather than falsified.

Optional `BreadcrumbList` is permitted only when it exactly matches visible breadcrumbs.

Validate JSON parsing and schema field consistency.

---

# 12. Source-link treatment

Primary-source links must remain adjacent to the claims they support.

Required source families include:

- Google Search Central multilingual sites;
- localized versions;
- locale-adaptive pages;
- W3C Language of Page;
- W3C Language of Parts;
- Digital.gov multilingual guidance in EN Article 1;
- ICANN registrant information;
- U.S. Copyright Office ownership/transfer;
- U.S. Copyright Office work made for hire;
- W3C accessibility evaluation.

Do not move sources into one detached bibliography if that breaks adjacency.

A supplemental source index may be added only in addition to adjacent links.

External links:

- must be visibly identifiable;
- must have useful accessible names;
- if opened in a new tab, use `rel="noopener noreferrer"` and communicate that behavior accessibly;
- do not add `nofollow` without a real policy reason.

Create a source-link manifest containing URL, article, supported claim, DOM section and link-check result.

---

# 13. CTA and commercial path

Use the approved CTA labels and service boundaries.

## Primary CTA destinations

| Page | Primary CTA | Destination |
|---|---|---|
| Article 1 RU | `Обсудить языковую модель сайта` | `/ru/contact/#project-intake` |
| Article 1 EN | `Review Your Language Coverage Plan` | `/contact/#project-intake` |
| Article 2 RU | `Разобрать предложение на сайт` | `/ru/contact/#project-intake` |
| Article 2 EN | `Review My Website Proposal` | `/contact/#project-intake` |

Secondary service link:

- RU: `/ru/websites-branding/`
- EN: `/websites-branding/`

Do not promise:

- free audit;
- a 15-minute consultation;
- guaranteed rankings;
- guaranteed leads;
- legal review;
- contractor certification;
- guaranteed project success.

The commercial route is:

```text
Search or referral → article → useful decision system → Websites & Branding context → project intake
```

---

# 14. Internal linking and site integration

## 14.1 Insights hubs — mandatory

Update:

- `/insights/index.html`
- `/ru/insights/index.html`

Add all four articles to their correct language hub.

Use one intentional editorial grouping such as `Website Decision Guides` / `Руководства по решениям о сайте` rather than blindly placing four identical cards at the top.

Requirements:

- both new articles are discoverable from each language hub;
- titles and routes are exact;
- summaries do not introduce unsupported claims;
- archive/feed order is deliberate;
- no duplicate card or link;
- hub H1 and existing query ownership remain unchanged.

## 14.2 Websites & Branding pages — mandatory minimal bridge

Update only:

- `/websites-branding/index.html`
- `/ru/websites-branding/index.html`

Add a restrained `Decision Guides` / `Материалы для принятия решения` bridge to the two corresponding articles.

Do not rewrite the service page, hero, offer, pricing, contact path or core CTA.

This bridge must support commercial continuity without turning the service page into a blog archive.

## 14.3 New-page related reading

Use a restrained related-reading module near the end, outside the frozen body copy.

Approved link pool:

### Article 1 EN

- `/insights/ai-ready-website-for-business/`
- `/insights/website-builder-or-custom-website-what-a-service-business-should-choose/`
- `/insights/what-a-premium-website-really-means-for-a-service-business/`

### Article 1 RU

- `/ru/insights/ai-ready-sayt-dlya-biznesa/`
- `/ru/insights/konstruktor-sayta-ili-sayt-na-zakaz-chto-vybrat-servisnomu-biznesu/`
- `/ru/insights/chto-znachit-premialnyy-sayt-dlya-servisnogo-biznesa/`

### Article 2 EN

- `/insights/how-much-does-a-business-website-cost-in-2026-a-strategic-budget-view/`
- `/insights/website-builder-or-custom-website-what-a-service-business-should-choose/`
- `/insights/why-service-business-websites-fail-to-convert-high-intent-visitors/`

### Article 2 RU

- `/ru/insights/ekonomika-proekta-pochemu-otsenka-po-stranitsam-oshibochna/`
- `/ru/insights/konstruktor-sayta-ili-sayt-na-zakaz-chto-vybrat-servisnomu-biznesu/`
- `/ru/insights/arkhitektura-konversii-gde-sayt-teryaet-klienta-eshche-do-pervogo-kontakta/`

Use two or three per page based on genuine relevance.

## 14.4 Controlled inbound links from existing articles

Add only these minimal contextual bridges when the surrounding section genuinely supports them:

- EN AI-ready article → Article 1 EN;
- RU AI-ready article → Article 1 RU;
- EN website-cost article → Article 2 EN;
- RU project-economics article → Article 2 RU.

Do not rewrite existing article sections.

Add at most one contextual sentence or related-reading row per source article.

Record every added internal link and anchor in the internal-link manifest.

## 14.5 Sitemap

Add exactly the four authoritative URLs to `sitemap.xml` using the current format.

Do not add editorial source files, review assets, manifests or superseded routes.

Use a review-stage `lastmod` matching the build date only if the project’s sitemap convention treats it as content modification. Confirm consistency first.

Do not change `robots.txt` unless a concrete verified defect exists. No robots change is expected.

---

# 15. CSS, JavaScript and asset architecture

Prefer shared reusable assets rather than four giant duplicated inline style blocks.

Recommended scope:

```text
/assets/css/insights-premium-article-system-v1.css
/assets/js/insights-premium-article-system-v1.js
/assets/images/insights/article-pairs-v1/...
```

The exact names may change if the current repository convention requires it, but document them.

Requirements:

- CSS is scoped to the new premium article pages;
- no leakage into unrelated pages;
- no framework migration;
- no build-system introduction;
- no React/Vue/MDX requirement;
- no third-party runtime dependency for core reading;
- core page content is present in HTML;
- JavaScript only enhances navigation, progress, optional states or motion;
- the page remains complete with JavaScript disabled;
- source assets are optimized;
- SVG is sanitized and accessible;
- no unlicensed imagery or font files are introduced.

Do not copy the entire current article inline CSS into each page and then override it repeatedly.

The new shared system should be maintainable enough for future Insights migration.

---

# 16. Accessibility and semantic requirements

For every page:

- one doctype;
- one `<html>` with correct `lang`;
- one `<head>` and `<body>`;
- one `<main>`;
- one H1;
- logical H2/H3 order;
- landmarks with useful labels;
- unique IDs;
- skip-link if consistent with current site or add one without breaking shell;
- visible `:focus-visible` treatment;
- keyboard-operable menu, TOC and links;
- minimum 44px practical target for primary controls;
- sufficient contrast;
- no color-only meaning;
- tables with programmatic relationships;
- foreign-language phrases marked with `lang` only where WCAG requires and exceptions do not apply;
- decorative SVG/images hidden appropriately;
- informative images with meaningful alt text;
- no inaccessible tooltip-only information;
- no heading used only for visual sizing.

The mobile menu must close by:

- toggle;
- link activation;
- Escape;

and return focus to the toggle when closed by Escape, if current shared behavior supports this without broad unrelated changes.

Do not declare legal or WCAG compliance from automated scores alone.

---

# 17. No-JS and reduced-motion acceptance

## No JavaScript

Run all four pages with JavaScript disabled.

PASS requires:

- complete article text visible;
- all tables and labels visible;
- source links usable;
- CTA links usable;
- language counterpart link usable;
- no blank hero or hidden sections;
- no core content trapped in tabs/accordions;
- no horizontal page overflow.

## Reduced motion

Emulate `prefers-reduced-motion: reduce`.

PASS requires:

- optional reveals disabled;
- smooth/animated progress does not interfere;
- no essential meaning lost;
- no long transition delay;
- no continuously moving decorative element.

---

# 18. Responsive verification matrix

Test every article at:

```text
1600 × 900
1440 × 900
1280 × 800
1024 × 900
768 × 1024
390 × 844
```

Additional shell-specific checks:

- EN at 1100 and 1024;
- RU at 1200 and 1180.

At every width verify:

- header/menu state;
- no dead breakpoint;
- H1 wrapping;
- readable line length;
- hero visual containment;
- TOC behavior;
- table behavior;
- source blocks;
- CTA hierarchy;
- footer;
- no horizontal page overflow;
- no clipped text;
- no overlap with fixed header.

At 200% browser zoom, content and controls must remain usable.

---

# 19. Technical QA

Create repeatable scripts where practical.

## 19.1 Static HTML audit

For all changed HTML:

- UTF-8 without BOM;
- no NUL bytes or mojibake;
- one doctype/html/head/body;
- one main where required;
- one H1;
- no duplicate IDs;
- valid local links;
- no malformed nesting;
- no internal editorial status text;
- no missing closing tags;
- no orphan table labels.

## 19.2 Route and link audit

Verify locally:

- all four canonical routes return 200;
- both counterpart links are exact;
- hub links are exact;
- service-page bridges are exact;
- CTA anchors resolve;
- all approved primary sources return a valid response or are recorded if temporarily unavailable;
- no link points to the superseded RU route;
- no accidental link to internal Markdown.

## 19.3 Metadata matrix

For all four pages verify:

- exact H1;
- exact title;
- exact description;
- exact canonical;
- exact EN/RU reciprocal `hreflang`;
- consistent `x-default` decision;
- correct OG/Twitter URL/title/description/image;
- valid JSON-LD;
- no duplicate canonical;
- no draft `noindex` unless owner specifically requested it for a hosted preview.

Because this stage is local/branch review, do not add production `noindex` to pages intended for eventual publication.

## 19.4 Accessibility audit

Run:

- keyboard review;
- Playwright/axe or equivalent automated scan;
- manual heading/landmark/table review;
- focus-state review;
- no-JS review;
- reduced-motion review.

No critical or serious automated accessibility violations are acceptable.

Target Accessibility 100 in Lighthouse, but do not treat that score as the complete evaluation.

## 19.5 Lighthouse

Use the same local server and environment for baseline and branch.

Baseline:

- current EN AI-ready article mobile;
- current RU AI-ready article mobile.

Branch:

- all four new pages mobile;
- at least one page from each article family desktop.

Return:

- Performance;
- Accessibility;
- Best Practices;
- SEO;
- LCP;
- CLS;
- TBT.

Targets:

- Accessibility 100;
- Best Practices 100;
- SEO 100;
- no material unexplained performance regression versus the representative current article baseline.

Do not hide performance problems or attribute them without identifying the actual LCP/resource evidence.

## 19.6 Diff audit

Run:

```bash
git diff --check origin/main...HEAD
git diff --stat origin/main...HEAD
git diff --name-status origin/main...HEAD
```

Confirm no unrelated formatting churn or parser reserialization.

---

# 20. Review evidence and screenshots

The owner must not be used as a file-transfer intermediary.

## 20.1 Local review folder

Create:

```text
C:\AI_WORK\proaiexpert-vertex\owner-review\article-pairs-stage-3-v1\
```

or the equivalent current project workspace path.

Do not commit screenshots to the build branch.

## 20.2 Required PNG captures

For each of four pages create:

1. desktop hero at 1440 × 900;
2. desktop signature module at 1440 × 1000;
3. mobile hero at 390 × 844;
4. mobile signature table/module at 390 × 844.

Minimum: 16 real PNG files.

Additional required captures:

- EN Insights hub integration desktop;
- RU Insights hub integration desktop;
- EN Websites & Branding decision-guide bridge;
- RU Websites & Branding decision-guide bridge.

Minimum total: 20 PNG files.

Verify PNG magic bytes, dimensions and byte sizes.

Create a contact sheet.

## 20.3 Direct review access

After the build branch is pushed, create a separate temporary review-only branch:

```text
owner-review-article-pairs-stage3-v1
```

Base it on the build head only for review convenience.

Place under:

```text
owner-review/article-pairs-stage3-v1/
```

only:

- the 20 PNGs;
- contact sheet;
- screenshot manifest;
- body-integrity manifest;
- metadata manifest;
- source-link manifest;
- internal-link manifest;
- Financial Stream gate report;
- QA summary.

Do not open a PR from the review branch.

Do not merge the review branch.

Do not place ZIP files in `main` or the build branch.

This temporary branch exists so ChatGPT can inspect evidence directly without asking the owner to relay files.

---

# 21. Required manifests

Generate:

1. `implementation-manifest.json`
2. `body-integrity-manifest.json`
3. `metadata-manifest.json`
4. `source-link-manifest.json`
5. `internal-link-manifest.json`
6. `financial-stream-architecture-gate.json`
7. `screenshot-manifest.json`
8. `qa-summary.md`
9. `diff-summary.md`

The implementation manifest must include:

- verified base SHA;
- build branch;
- final head SHA;
- exact changed files;
- routes;
- source blob SHAs;
- shared CSS/JS/assets;
- Financial Stream gate result;
- x-default decision;
- redirect decision;
- release-date status;
- known limitations;
- explicit exclusions.

---

# 22. Allowed and forbidden file scope

## Allowed

- four new article route directories;
- one shared premium article CSS system;
- one progressive-enhancement JS file if needed;
- lightweight article visual/social assets;
- EN/RU Insights hubs;
- EN/RU Websites & Branding pages for the small decision-guide bridge;
- four controlled existing-article inbound-link edits listed above;
- `sitemap.xml`;
- redirect configuration only if the superseded route test proves it is necessary;
- local/temp review evidence outside the build branch.

## Forbidden

- homepage changes;
- AI Systems changes;
- About changes;
- contact form field changes;
- portfolio archive or case-page changes;
- approved portfolio concepts;
- Chatbase;
- robots changes without a verified defect;
- broad metadata rewrites;
- unrelated article rewrites;
- framework migration;
- package files committed only for temporary QA;
- node_modules;
- Lighthouse JSON committed to the production build branch;
- screenshots committed to the production build branch;
- direct changes to `main`.

---

# 23. Git and commit protocol

Use normal commits only.

Suggested commits:

```text
feat: build premium multilingual decision article pair
feat: build premium website proposal article pair
feat: integrate acquisition articles into site paths
fix: complete Stage 3 responsive and accessibility QA
```

Fewer commits are acceptable if each is coherent.

Do not:

- amend published commits;
- force-push;
- rebase after sharing the branch;
- merge `main` into the branch without first reporting why;
- create a PR;
- merge;
- publish.

Push only:

```text
article-pairs-premium-build-v1
```

and the separate review-only evidence branch.

The tracked build worktree must be clean at final report.

---

# 24. Stop condition

Stop after:

- all four pages are physically built;
- integration files are complete;
- build branch is pushed;
- review evidence branch is pushed;
- QA is complete;
- manifests are complete;
- final report is prepared.

Do not create a Pull Request.

Do not merge.

Do not publish.

Do not trigger GitHub Pages intentionally.

Do not modify `main`.

Wait for owner and ChatGPT review.

---

# 25. Final Gemini report

Return exactly:

1. preflight current `main` SHA;
2. open PR status at build start;
3. build branch name;
4. build branch final SHA;
5. matching remote SHA;
6. review-only branch name and SHA;
7. exact changed-file list;
8. four route status results;
9. approved source blob verification;
10. body-integrity result per article;
11. Financial Stream gate result and evidence summary;
12. metadata/canonical/hreflang/x-default matrix;
13. schema result;
14. sitemap and redirect result;
15. internal-link integration result;
16. no-JS result;
17. reduced-motion result;
18. responsive matrix result;
19. accessibility result;
20. Lighthouse baseline-versus-branch table;
21. screenshot count and direct GitHub review path;
22. manifest paths;
23. `git diff --check` result;
24. clean worktree status;
25. known limitations;
26. confirmation that no PR, merge or publication occurred.

Final line:

```text
STAGE 3 PREMIUM ARTICLE BUILD IS READY FOR OWNER REVIEW — NO PR, MERGE OR PUBLICATION PERFORMED
```
