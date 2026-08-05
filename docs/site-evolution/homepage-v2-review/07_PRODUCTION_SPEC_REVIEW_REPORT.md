# Homepage V2 Production Specification — Independent Review Report

**Status:** Complete  
**Verdict:** `TARGETED CORRECTION`  
**Branch:** `agent/homepage-v2-strategy-review`  
**Review date:** 2026-08-04  
**Role:** Control / Independent Technical Reviewer  
**Scope:** Source architecture, Jekyll/deployment, Contact integration, section contracts, EN/RU, accessibility, performance, QA and rollback  
**Production implementation:** Not authorized

---

## 1. Executive verdict

`TARGETED CORRECTION`

The Homepage V2 Production Specification has the correct technical direction and does not require rejection or replacement with a different architecture.

The proposed model—two minimal route wrappers, one shared Jekyll layout, separate EN/RU data, section-level includes, one scoped Homepage stylesheet, progressive JavaScript, current Header/Footer reuse, and preserved legacy snapshots for rollback—is materially safer than extending the current `replace_first` and snapshot-patching architecture.

The ten-block implementation contracts are generally specific enough for prototype and Builder planning. The connected-journey mobile transformation is appropriately reduced to two groups and four steps. EN/RU ownership is structurally sound. The accessibility, performance, Tier 3 workflow, browser matrix and rollback principles are directionally correct.

The specification is **not yet implementation-ready** because several current-repository contracts are still ambiguous or internally inconsistent:

1. The exact Homepage Footer integration is not named. The current Homepage uses `_includes/footer-commercial-v1.html`, while the generic Footer router has no `homepage` Commercial variant. Choosing the wrong include would change or blank locked Footer content.
2. The current Contact form already uses the hidden field `intent` for selected direction, while the specification redefines `intent` as `private_review`. This is a real data-contract collision.
3. The Homepage CTA URLs send one combined `source` value, but the required submission model defines separate `source_page` and `source_cta` fields.
4. The repository has no `_config.yml`; therefore the layout must not assume that `site.url`, `site.baseurl` or `absolute_url` will generate production-safe canonical, hreflang and Open Graph URLs.
5. The expected implementation scope does not include a Homepage V2 generated-output deployment gate, even though the current workflow already enforces exact Footer output on both Homepage routes.
6. The runtime asset transition is not explicit enough. The current snapshots load legacy Homepage CSS/JS and Chatbase; V2 must state exactly what is retained, removed from runtime, or preserved only for rollback.
7. Files under `assets/` are copied as static assets by the current Jekyll build unless given front matter. The specification does not explicitly prohibit Liquid dependencies inside the proposed raw CSS and JavaScript assets.

These defects are narrow and correctable. They do not undermine the approved strategy, ten-block narrative, clean Jekyll architecture or implementation sequence.

**Implementation must remain blocked until all P0 corrections in Section 10 are incorporated into the Production Specification or an equally authoritative implementation contract.**

---

## 2. Sources inspected

### 2.1 Repository and branch state

- Repository: `proaiexpert/proaiexpert.github.io`
- Current default branch: `main`
- Current `main` SHA checked: `0b2fca54fba614e8a3098d00991cec6103b604e8`
- Working branch: `agent/homepage-v2-strategy-review`
- At review time the working branch had diverged from current `main`:
  - ahead by 12 commits;
  - behind by 1 commit;
  - merge base: `af9b7288a9a5fc36de57afd816302e80e17e0d8a`.
- The branch delta inspected was documentation-only and did not contain Homepage, Contact, Header, Footer, asset or deployment implementation changes.

The future production branch must be created from the then-current `main`, not from the strategy-review branch.

### 2.2 Governance and current-state documents

Reviewed from current `main`:

- `AI_START_HERE.md`;
- `AGENTS.md`;
- `AI_CURRENT_HANDOFF.md`;
- `README.md`.

Reviewed from the working branch:

- `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_STRATEGY.md`;
- `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_PRODUCTION_SPEC.md`;
- `docs/site-evolution/homepage-v2-review/03_INDEPENDENT_REVIEW_REPORT.md`;
- `docs/site-evolution/homepage-v2-review/06_PRODUCTION_SPEC_REVIEW_TASK.md`;
- existing template at `docs/site-evolution/homepage-v2-review/07_PRODUCTION_SPEC_REVIEW_REPORT.md`.

### 2.3 Current Homepage sources

Reviewed from current `main`:

- `index.html`;
- `ru/index.html`;
- `_includes/homepage-current-en.html`;
- `_includes/homepage-current-ru.html`;
- `assets/css/homepage-core-hardening-v1.css`;
- `assets/css/homepage-materials-editorial-v2.css`;
- `assets/js/homepage-core-hardening-v1.js`;
- current Homepage-injected asset references and legacy inline behavior.

Current rollback source identifiers:

| Source | Current blob SHA |
|---|---|
| `index.html` | `3d44bd2f6f0f09bf9c45ba661ccffd2ac6183aa4` |
| `ru/index.html` | `4d703c149b626dab3a3db13b3566c9d0cb28d374` |
| `_includes/homepage-current-en.html` | `a781a6a108091ff8caac3a07f104979cdf1493e8` |
| `_includes/homepage-current-ru.html` | `d12c559fa4a6173aceb52617530a984dfd52a644` |

### 2.4 Current Contact sources

Reviewed from current `main`:

- `contact/index.html`;
- `ru/contact/index.html`;
- current Formspree endpoint;
- current hidden fields;
- direction-selection pills;
- honeypot behavior;
- client-side validation;
- asynchronous submission;
- success and failure states;
- current query-parameter handling.

### 2.5 Current Header sources

Reviewed from current `main`:

- `_includes/header-system/header.html`;
- `_data/header.yml`;
- `_data/navigation.yml`;
- `assets/css/header-system-v1.css`;
- `assets/js/header-system-v1.js`.

### 2.6 Current Footer sources

Reviewed from current `main`:

- `_includes/footer-commercial-v1.html`;
- `_includes/footer-system/footer.html`;
- `_includes/footer-system/commercial.html`;
- `_data/footer.yml`;
- `assets/css/footer-commercial-v1.css`;
- current Footer stylesheet ownership and deployment assertions.

### 2.7 Jekyll and deployment

Reviewed from current `main`:

- `.github/workflows/deploy-pages.yml`;
- current Jekyll command and version;
- generated-output Footer validation;
- current include/data conventions;
- existence checks for `_config.yml` and a current default layout.

Current deployment facts:

- Jekyll `4.3.4` is installed in the workflow;
- build command is `jekyll build --source . --destination _site`;
- the generated `_site` directory is deployed through GitHub Pages actions;
- the workflow currently verifies unified Footer output across 44 routes, including `/` and `/ru/`;
- no `_config.yml` exists on current `main`;
- no current `_layouts/default.html` exists on current `main`.

### 2.8 Review limitation

This was an independent source and contract review through the GitHub repository.

The following were **not** executed in this review:

- local Jekyll build;
- GitHub Actions run;
- browser automation;
- rendered screenshot comparison;
- Lighthouse measurement;
- keyboard or screen-reader interaction test;
- physical-device testing.

Therefore this report evaluates whether the specification can support those checks. It does not claim that the future implementation already passes them.

---

## 3. Architecture assessment

### 3.1 Overall assessment

The proposed architecture is appropriate for this repository:

```text
index.html / ru/index.html
        ↓
_layouts/homepage-v2.html
        ↓
_includes/homepage-v2/*.html
        ↓
_data/homepage_v2/en.yml + ru.yml
        ↓
scoped CSS + progressive JavaScript
```

It resolves the primary current risk: broad Homepage behavior is no longer coupled to exact strings inside two complete HTML snapshots.

### 3.2 Route wrappers

The proposed minimal wrappers are correct:

```yaml
---
layout: homepage-v2
lang: en
permalink: /
---
```

and:

```yaml
---
layout: homepage-v2
lang: ru
permalink: /ru/
---
```

The wrappers should contain no section markup, replacement chains, inline CSS, inline application scripts, duplicated metadata or Header/Footer markup.

### 3.3 Shared layout

A new `_layouts/homepage-v2.html` is valid under the current Jekyll 4.3.4 build even though the repository currently relies heavily on `layout: null` documents and snapshot wrappers.

The layout must have one explicit source object:

```liquid
{% assign homepage = site.data.homepage_v2[page.lang] %}
```

Section includes should receive explicit objects, for example:

```liquid
{% include homepage-v2/hero.html data=homepage.hero lang=page.lang %}
```

Do not make each section independently rediscover global data, language, metadata and routes. That would weaken ownership clarity.

### 3.4 Section includes and fragmentation

Ten strategic section includes are proportionate for a full-page bilingual rebuild.

The two proposed helpers are acceptable only when they provide real reuse:

- `proof-status.html` should centralize status/disclosure rendering across multiple proof items;
- `responsive-image.html` should centralize a tested `<picture>`/`srcset` contract across multiple image roles.

If either helper is used once, it should be folded into its owning section rather than retained as abstraction for its own sake.

This is not a reason to collapse all ten sections into one monolithic include.

### 3.5 Localized data

`_data/homepage_v2/en.yml` and `_data/homepage_v2/ru.yml` are appropriate.

Jekyll will expose the nested directory as:

```liquid
site.data.homepage_v2.en
site.data.homepage_v2.ru
```

or dynamically through `site.data.homepage_v2[page.lang]`.

The data model should own content and machine identifiers. It should not own arbitrary HTML fragments, inline style strings, JavaScript expressions or unreviewed markup.

### 3.6 Raw assets

The proposed files:

- `assets/css/homepage-v2.css`;
- `assets/js/homepage-v2.js`;
- image files under `assets/**`;

will be copied as static assets by the current build unless front matter is deliberately added.

Therefore:

- CSS and JavaScript must not contain `{{ ... }}` or `{% ... %}` Liquid expressions;
- localized labels, routes and context values must be rendered into HTML attributes or elements by the layout/includes;
- JavaScript may read bounded `data-*` attributes, but must not construct localized content from duplicated hard-coded dictionaries;
- the deployment gate must reject unrendered Liquid tokens in generated Homepage HTML and must also verify that raw CSS/JS do not contain accidental Liquid dependencies.

### 3.7 Exact runtime shell contract

The Production Specification currently describes Header and Footer conceptually but does not provide the exact initial V2 integration contract.

That contract must be added before Builder work begins.

#### Header

Use exactly one canonical include:

```liquid
{% include header-system/header.html
   lang=page.lang
   current_page="home"
   locale_url=homepage.meta.locale_url
   variant="standard" %}
```

Load exactly once:

```html
<link rel="stylesheet" href="/assets/css/header-system-v1.css?v=20260804.1">
<script src="/assets/js/header-system-v1.js?v=20260804.1" defer></script>
```

Do not load the legacy `.global-header`, `.site-nav`, `.mobile-menu-toggle` compatibility layers on Homepage V2.

#### Footer

The initial V2 must preserve the exact current Homepage Footer include:

```liquid
{% include footer-commercial-v1.html lang=page.lang %}
```

The layout must continue to load the current Homepage Footer base stylesheet once:

```html
<link rel="stylesheet" href="/assets/css/footer-commercial-v1.css?v=20260803.1">
```

`footer-commercial-v1.html` already loads its current polish, shared foundation and title-pulse styles. The layout must not duplicate those links.

Do **not** replace the Homepage Footer with:

```liquid
{% include footer-system/footer.html family="commercial" variant="homepage" ... %}
```

because current `_data/footer.yml` has no Commercial `homepage` variant. A nil `variant_copy` can produce missing Footer copy. Using `service` would change the locked Homepage Footer contract.

A future migration of the Homepage Footer into the generic router requires a separate Footer System task and is not part of Homepage V2.

### 3.8 Runtime asset transition

The implementation specification must provide an explicit runtime manifest.

Homepage V2 should load:

- current Header CSS/JS;
- `assets/css/homepage-v2.css`;
- optional `assets/js/homepage-v2.js`;
- current Homepage Footer base CSS;
- styles loaded by the unchanged Homepage Footer include;
- approved font resources;
- explicitly approved current third-party behavior.

Homepage V2 should not load at runtime merely because the old snapshot did:

- legacy inline Homepage CSS;
- `homepage-materials-editorial-v2.css`;
- `homepage-core-hardening-v1.css`;
- `homepage-commercial-refinement-v1.css`;
- `global-header-parity-v2.css`;
- legacy mobile Homepage styles;
- `mobile-behavior-v123.js`;
- legacy Homepage scene/process scripts;
- `homepage-core-hardening-v1.js`;
- `global-case-studies-navigation-v1.js` for legacy Header selectors.

Those files remain in the repository during the rollback window but cease to be V2 runtime owners.

### 3.9 Architecture conclusion

**Architecture direction: ACCEPTED, subject to P0 runtime-contract corrections.**

No alternative framework, JavaScript application shell, CMS or duplicated EN/RU page architecture is justified.

---

## 4. Jekyll and deployment assessment

### 4.1 Nested data and includes

The proposed nested data and include pattern is compatible with the current Jekyll 4.3.4 workflow.

Valid access pattern:

```liquid
{% assign homepage = site.data.homepage_v2[page.lang] %}
```

Valid include pattern:

```liquid
{% include homepage-v2/directions.html data=homepage.directions lang=page.lang %}
```

The implementation must not use unsupported dynamic include filenames derived from untrusted content. Section include paths should remain static in the layout.

### 4.2 Missing `_config.yml`

The repository has no current `_config.yml`.

Consequences:

- do not assume `site.url` is configured;
- do not assume `site.baseurl` contains the production domain or path;
- do not rely on `absolute_url` to create correct production canonical, hreflang or OG URLs;
- do not add `_config.yml` incidentally as part of Homepage implementation unless separately reviewed.

The narrow safe solution is to place explicit absolute production metadata URLs in the EN/RU Homepage data or define one explicit origin constant inside the Homepage layout contract:

```text
https://proai-expert.com
```

The generated output must contain absolute URLs for:

- canonical;
- reciprocal hreflang;
- x-default;
- `og:url`;
- `og:image`;
- Twitter image where used;
- structured-data URLs where used.

### 4.3 New layout introduction

The repository does not currently have a default layout file. Introducing `_layouts/homepage-v2.html` is still valid, but it must be treated as an explicit new production owner rather than assumed to inherit shared document-shell behavior.

The layout must itself own:

- doctype;
- `<html lang>`;
- complete `<head>`;
- favicon links;
- metadata;
- font loading;
- skip link;
- Header include;
- one `<main>`;
- Footer include;
- script load order.

### 4.4 Generated-output checks

The current workflow already verifies Footer output for both Homepage routes. That check must remain unchanged and continue to pass.

Homepage V2 requires an additional generated-output gate in `.github/workflows/deploy-pages.yml` or in a checked script invoked by that workflow.

At minimum verify both `_site/index.html` and `_site/ru/index.html` for:

1. one `<html lang>` with the correct language;
2. one H1;
3. one skip link and one `main#main-content`;
4. exactly one canonical Header output;
5. exactly one Homepage Commercial Footer output;
6. exact ten section IDs in the approved order:
   - `hero`;
   - `connected-journey`;
   - `directions`;
   - `client-work`;
   - `ways-to-start`;
   - `process`;
   - `founder`;
   - `selected-work`;
   - `insights`;
   - `private-review`;
7. one self-canonical;
8. reciprocal EN/RU hreflang;
9. one x-default to `/`;
10. required proof classes and disclosures;
11. correct Private Review query parameters;
12. one Homepage V2 stylesheet;
13. no duplicate Homepage V2 script;
14. no unrendered Liquid tokens;
15. no legacy Homepage wrapper markers or `replace_first` output dependency;
16. no duplicate Footer pulse stylesheet;
17. existing Footer System assertions still passing.

The expected implementation scope must therefore include:

```text
.github/workflows/deploy-pages.yml
```

or an explicit validation script plus the workflow change that executes it.

### 4.5 Cache-busting

The repository currently uses query-string versions for shared CSS and JavaScript.

The Production Specification should require:

- an initial explicit version for `homepage-v2.css` and `homepage-v2.js`;
- a version increment whenever an existing URL is modified after review;
- generated-output validation against accidental duplicate old/new versions;
- no cache-busting changes to locked Header/Footer assets unless those files actually change under separate authorization.

### 4.6 Jekyll/deployment conclusion

**Jekyll composition: technically valid.**  
**Deployment contract: not complete until the P0 metadata-origin and generated-output corrections are added.**

---

## 5. Contact integration assessment

### 5.1 Current Contact behavior that must be preserved

Both current Contact routes use:

- endpoint: `https://formspree.io/f/xbdakqoz`;
- asynchronous `fetch` submission with `Accept: application/json`;
- required email validation;
- minimum project-context validation;
- honeypot field `company_website`;
- timestamp field `form_started_at`;
- localized `page_lang`;
- current `page_path`;
- localized subject;
- processing, success and error states;
- reset behavior after successful submission.

Only `submitted=1` is currently recognized from the URL. The current pages do not recognize `private_review`, source context or selected-direction query parameters.

### 5.2 Current `intent` collision

The current form already has:

```html
<input id="intent" name="intent" ...>
```

Its value is currently the selected direction, for example:

- `AI Systems & Automation`;
- `Website & Digital Presence`;
- `Both`;
- `Help define the first step`;
- localized Russian equivalents.

The Production Specification also defines:

```text
intent=private_review
```

Both meanings cannot share the same submitted field.

### 5.3 Required canonical field model

Use one stable machine schema across EN/RU:

```text
intent=private_review | project_inquiry
source_page=homepage | contact | other_allowlisted_source
source_cta=homepage_hero | homepage_ways_to_start | homepage_final | direct_contact
selected_direction=ai_systems_automation | websites_branding | both | not_sure
source_context=<bounded allowlisted identifier or empty>
referring_url=<bounded URL value>
language=en | ru
```

Required migration:

1. `intent` becomes request type:
   - `private_review` when the allowlisted URL intent is present;
   - otherwise `project_inquiry`.
2. The current direction-selector hidden field becomes `selected_direction`.
3. Pill labels remain localized, but their `data-value` attributes use stable canonical values.
4. Optional human-readable localized labels may be submitted in a separate field only if operationally useful; they must not replace canonical values.
5. Existing `page_lang` and `page_path` may remain for compatibility, but they must not conflict with the canonical `language`, `source_page` and `source_cta` model.

### 5.4 Correct CTA URL contract

The current specification uses one `source` parameter but requires separate source fields.

Replace that contract with explicit no-JS-safe links.

#### Hero EN

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_hero#project-intake
```

#### Hero RU

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_hero#project-intake
```

#### Final EN

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_final#project-intake
```

#### Final RU

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_final#project-intake
```

A Ways-to-Start CTA may additionally pass one allowlisted `selected_direction` value.

The links must work as normal navigation without Homepage JavaScript. Contact enhancement may read and apply the context when JavaScript is available; without JavaScript, the user must still land on a usable form.

### 5.5 Query safety

Contact must not inject arbitrary query strings into HTML.

Required handling:

- allowlist `intent`;
- allowlist `source_page`;
- allowlist `source_cta`;
- allowlist `selected_direction`;
- cap `source_context` and `referring_url` length;
- use `.textContent`, `.value` and attributes rather than `innerHTML`;
- ignore unsupported values;
- do not place names, email addresses, phone numbers or free-form project text into analytics events;
- preserve the current Formspree endpoint and error handling.

### 5.6 Contact UX behavior

When `intent=private_review` is recognized:

- display a localized bounded explanation;
- identify that the review is no-cost and limited to fit, priority and the recommended next step;
- do not imply a full audit;
- preserve the existing short form;
- expose AI Systems, Websites & Branding, Both and Not sure as direction options;
- preserve the same success and failure behavior in EN/RU;
- do not promise a response time that is not operationally guaranteed.

### 5.7 PR sequencing decision

Contact support should be implemented as a **separate prerequisite EN/RU Contact PR** before the Homepage V2 production PR.

Reasoning:

- the existing Homepage remains functional if Contact gains backward-compatible context support first;
- Homepage V2 can then link to a verified destination;
- Formspree, anti-spam and form-state changes receive isolated review;
- Contact rollback is independent from Homepage rollback;
- the Homepage PR remains focused on the full-page system;
- there is no temporary public mixed V1/V2 Homepage narrative.

The Contact prerequisite must remain narrow. It is not authorization for a Contact redesign, Header/Footer change or endpoint replacement.

### 5.8 Contact conclusion

**Contact integration is required and cannot be achieved safely through Homepage JavaScript alone.**

The current specification must resolve the field collision, URL contract and PR sequence before implementation approval.

---

## 6. Section-contract assessment

### 6.1 Overall assessment

The ten section contracts are sufficiently specific for low-fidelity mapping, copy production and prototype work.

They are not yet permission to code before the remaining pre-implementation gates are complete.

### 6.2 Section IDs and link coherence

The section ID system is coherent:

| Block | ID | Primary relationship |
|---|---|---|
| Hero | `hero` | primary Contact CTA; secondary `#client-work` |
| Connected Business Journey | `connected-journey` | differentiation/signature system |
| Two Core Directions | `directions` | service-page links |
| Financial Stream | `client-work` | Hero secondary target |
| Ways to Start | `ways-to-start` | contextual service/Private Review links |
| Process | `process` | controlled methodology |
| Founder | `founder` | About and LinkedIn |
| Selected Work | `selected-work` | cases, live site/demo, archive |
| Insights | `insights` | three mapped articles |
| Final Conversion | `private-review` | final Contact CTA |

No new top-level service route or public Homepage route is needed.

### 6.3 Hero

The contract is appropriately bounded.

Required implementation details still to lock in the prototype/spec handoff:

- one meaningful visual role;
- exact first meaningful viewport behavior with the fixed Header;
- primary CTA and microcopy before the visual on mobile;
- no forced H1 no-wrap spans;
- one true LCP asset;
- secondary CTA to `#client-work`;
- no iframe in the initial viewport.

### 6.4 Connected Business Journey

The mobile transformation is exact enough:

- two labeled phases;
- four vertical steps;
- no horizontal poster;
- no tiny connector labels;
- full static meaning.

Required DOM rule:

- one semantic ordered list or four ordered article/step elements in the correct reading order;
- decorative connectors must be `aria-hidden`;
- desktop visual ordering must not conflict with mobile DOM ordering;
- JavaScript may emphasize current state but must not create or reorder core content.

### 6.5 Two Core Directions

The two editorial territories preserve equal strategic status while allowing AI to lead the narrative order.

Do not implement the section as:

- a technical matrix;
- tabbed content hiding one direction by default;
- ten equal cards;
- a tool or vendor logo wall.

### 6.6 Financial Stream proof

The contract is proportionate:

- one large proof field;
- at most two supporting details;
- exact live-client status;
- one evidence story;
- no dashboard;
- no causal business-outcome claim.

Before coding, the proof-source pack must identify exact source files and alt text. Do not duplicate case-study assets into `assets/img/homepage-v2/` when an existing approved optimized derivative already matches the Homepage role. Reuse by reference where safe.

### 6.7 Ways to Start

The section is protected against becoming a pricing table, but the data schema should make that protection operational.

Each situation object should require:

```text
id
best_when
first_objective
not_implied
service_link
review_cta
selected_direction
```

Do not add:

- price fields;
- tier names such as Basic, Pro or Premium;
- feature-check matrices;
- “most popular” badges;
- artificial package comparison emphasis.

The three situations may be cards visually only if they read as diagnostic starting situations rather than products.

### 6.8 Process

Five phases are proportionate.

The process must remain a concise editorial progression and must not recreate:

- sticky multi-screen storytelling;
- another large system diagram;
- a five-card animation dependency;
- a long mobile stack with oversized empty space.

### 6.9 Founder

The scope remains proportionate.

Use one approved portrait and concise accountability copy. Do not duplicate the full About narrative or create a second founder Hero.

### 6.10 Selected Work

The contract correctly prevents duplication of Financial Stream.

Required public status strings must remain visible, not tooltip-only:

- Alina Horb: `Live related-party project · UA/RU` plus adjacent disclosure;
- Local Repair Pro: `Website concept · Live demo · In development`.

### 6.11 Insights

Three items are proportionate.

The final source pack must confirm that every selected EN route has the intended RU counterpart. The layout must not infer RU slugs by string transformation.

### 6.12 Final Conversion

The closing contract is correct.

It must contain:

- one bounded explanation;
- one primary CTA;
- no new service category;
- no new proof claim;
- no pricing;
- a visual transition into the unchanged Homepage Footer.

### 6.13 Section-contract conclusion

**Section contracts: ACCEPTED with targeted data-schema and DOM-order clarifications.**

---

## 7. EN/RU assessment

### 7.1 Shared structure and separate copy

One shared layout plus independently composed EN/RU YAML is the correct architecture.

It provides:

- one structural source of truth;
- equal section order;
- equal semantic hierarchy;
- stable internal IDs;
- independent copy length;
- natural Russian composition;
- lower parity-regression risk than duplicated full-page markup.

### 7.2 Required parity schema

Both data files must have the same required keys and item counts for structural collections.

At minimum validate parity for:

- metadata fields;
- ten sections;
- CTA identifiers;
- two directions;
- four connected-journey steps;
- three Ways to Start situations;
- five process phases;
- proof status and disclosure fields;
- two Selected Work items plus optional Financial Stream callback;
- three Insights items;
- accessible labels.

Jekyll will not fail automatically when a YAML key is absent. Generated-output assertions must detect blank or missing required content.

### 7.3 Stable values

Machine identifiers should remain English snake_case in both language files.

Examples:

```text
private_review
project_inquiry
homepage_hero
homepage_ways_to_start
homepage_final
ai_systems_automation
websites_branding
both
not_sure
financial_stream
alina_horb
local_repair_pro
```

Do not submit localized Russian phrases as canonical analytics or form-routing values.

### 7.4 Russian expansion

The specification correctly recognizes Russian expansion but needs explicit implementation acceptance rules:

- no fixed-height text containers for headings, CTA microcopy, proof labels or disclosures;
- buttons may expand or wrap where necessary;
- no `white-space: nowrap` on primary RU copy;
- disclosure remains visible at 320 px;
- Journey labels remain short but complete;
- H1 line breaks are controlled by layout width, not hard-coded spans;
- status labels may wrap without becoming unreadable uppercase strips.

### 7.5 Metadata and social parity

EN and RU must independently own:

- title;
- meta description;
- OG title;
- OG description;
- OG image and alt;
- Twitter title/description/image where retained;
- canonical;
- reciprocal hreflang;
- x-default.

Do not derive the RU metadata by runtime translation or English-string substitution.

### 7.6 Language switching

Header language switching must map:

- `/` → `/ru/`;
- `/ru/` → `/`.

Footer language switching must preserve its current Homepage behavior through the unchanged Homepage Footer include.

### 7.7 EN/RU conclusion

**EN/RU architecture: ACCEPTED.**

Implementation readiness depends on schema parity checks and the corrected Contact machine-value contract.

---

## 8. Accessibility and performance assessment

### 8.1 Accessibility contract

The specification contains testable accessibility requirements rather than generic aspirations.

Strong requirements already present:

- skip link;
- semantic landmarks;
- one H1;
- logical heading hierarchy;
- meaningful link text;
- visible focus;
- keyboard operation;
- contrast;
- alt text;
- decorative-image suppression;
- touch targets;
- no color-only or motion-only meaning;
- reduced motion;
- sensible DOM order;
- no-JS visibility;
- accessible status disclosures;
- forced-colors review.

### 8.2 No-JS baseline

The no-JS baseline is achievable, but implementation must use a safe enhancement pattern.

Required default:

- content visible in base CSS;
- links and anchors functional;
- Journey fully understandable;
- proof and disclosures visible;
- Header navigation still available as rendered links even if menu enhancement is limited;
- Contact destination functional.

If a `.js` or `.homepage-v2-js` class is added, it may enhance only after JavaScript starts successfully. It must not create a hidden-content default requiring a recovery timer.

### 8.3 Reduced motion

The motion limits are realistic.

Acceptance should verify:

- no transform-based content disappearance;
- no continuous Homepage animation;
- connected-journey static state remains complete;
- Header and Footer retain their current reduced-motion behavior;
- focus feedback remains visible;
- layout does not jump when motion is removed.

### 8.4 Fixed Header offset

The canonical Header owns a scoped CSS variable that is not automatically inherited by Homepage main content:

- 85 px desktop;
- 84 px at narrow portrait widths;
- 68 px in short landscape.

Homepage V2 must define a matching page-level offset contract without modifying Header source files.

Acceptable solutions:

- explicit Homepage variables matching the canonical Header breakpoints; or
- a tested layout technique that positions the first section after the fixed Header without selector coupling.

Do not rely on a Header-scoped custom property being visible to sibling content.

### 8.5 Image contract

The current image plan is directionally correct but should be more exact.

Every meaningful image object should define:

```text
src
srcset candidates
sizes
width
height
alt
loading
fetchpriority
decoding
crop role
```

Rules:

- only the true Hero LCP image gets `fetchpriority="high"`;
- below-fold proof uses `loading="lazy"`;
- all images declare intrinsic dimensions;
- mobile proof uses purpose-specific crops rather than microscopic full-page screenshots;
- decorative images use empty alt and appropriate hiding;
- existing optimized derivatives should be reused where they fit;
- new assets should follow the repository convention `assets/img/homepage-v2/**`, not create a parallel `assets/images/**` taxonomy without reason.

### 8.6 CSS and JavaScript budgets

The proposed Homepage-specific targets are reasonable:

- CSS below 50 KB gzip;
- JavaScript below 20 KB gzip;
- one primary font family;
- no framework;
- no initial-viewport iframe.

The acceptance report must distinguish:

1. Homepage-specific CSS/JS sizes;
2. total page transfer;
3. global Header/Footer assets;
4. font transfer;
5. existing third-party transfer.

A page can meet component budgets and still fail total-page performance.

### 8.7 Current Chatbase dependency

The current EN/RU Homepage snapshots load the existing Chatbase embed after window load.

The V2 specification must make an explicit owner decision:

- preserve the current Chatbase behavior unchanged during initial V2; or
- remove it through separately authorized scope.

Default safe assumption: **preserve it unchanged**, because accidental removal is a functional production change unrelated to the Homepage body redesign.

If preserved:

- load it non-blocking after `load` as currently;
- keep the existing assistant ID/domain unless separately changed;
- document failure behavior;
- include it in the network allowlist and total-page performance report;
- do not count it as new Homepage-specific JavaScript;
- verify that it does not collide with mobile CTA, Header, Footer or safe-area behavior.

### 8.8 Third-party policy

The specification correctly prohibits adding a new third-party script.

Existing third-party behavior must be explicitly inventoried; “not new” does not mean “not measured.”

### 8.9 Accessibility/performance conclusion

**Accessibility and performance direction: ACCEPTED.**

Implementation readiness requires exact Header-offset, image-object, total-page budget and Chatbase decisions.

---

## 9. QA and rollback assessment

### 9.1 Risk tier and tooling

Tier 3 / Codex escalation is appropriate for implementation because the work requires:

- a clean Jekyll architecture;
- EN/RU full-page rendering;
- browser automation;
- desktop, portrait and landscape screenshots;
- responsive overflow checks;
- performance measurement;
- no-JS and reduced-motion verification;
- generated-output inspection;
- broad but controlled production-page replacement.

ChatGPT Control should retain scope and acceptance ownership. Codex/local tooling should execute the build and browser matrix. A fresh Reviewer should inspect the actual diff and rendered outputs.

### 9.2 Browser and viewport matrix

The proposed viewport matrix is sufficient as a minimum.

Required real-world additions/interpretations:

- owner iPhone portrait;
- owner iPhone landscape;
- real or representative Safari/WebKit behavior;
- representative Chrome/Android mobile emulation or device check;
- keyboard review in Chromium and Firefox;
- reduced-motion and forced-colors checks;
- no-JS browser run.

### 9.3 Acceptance gates

The gate structure is operationally strong:

- Strategy;
- Production Specification;
- Content;
- Prototype;
- Build;
- Independent Review;
- Publication.

Gate B cannot pass until P0 corrections in this report are incorporated.

Gate E must use generated files in `_site`, not source-only assumptions.

### 9.4 Preventing a mixed V1/V2 state

The specification correctly prohibits isolated production merges such as a V2 Hero on top of the V1 narrative.

Additional required protection:

- Contact prerequisite may merge first because it is backward-compatible;
- all ten Homepage body sections, new layout, localized data and runtime asset transition ship together in one Homepage production PR;
- old snapshot includes and legacy assets remain in the repository but are not runtime dependencies;
- no partial EN-only publication;
- no V2 wrappers before required includes/data/assets exist;
- no old and new Homepage stylesheets loaded simultaneously.

### 9.5 Production branch base

Because the strategy-review branch is behind current `main`, it must not become the production branch base.

Required sequence:

1. review/approve documentation;
2. ensure canonical documents exist on current `main` through the approved documentation path;
3. fetch current `main` again;
4. record current base SHA;
5. create `agent/homepage-v2-production` from that current `main`;
6. apply only the authorized implementation scope.

### 9.6 Rollback

The rollback concept is operationally sound because the current wrappers and snapshots can be restored without reconstructing the page from screenshots.

Before publication, the Builder must record:

- exact pre-V2 wrapper SHAs;
- snapshot SHAs;
- old runtime asset references;
- exact two-file wrapper restore patch;
- whether the Contact prerequisite remains safely deployed during Homepage rollback.

Required rollback rehearsal:

1. build V2 successfully;
2. restore prior `index.html` and `ru/index.html` wrappers in a test branch/worktree;
3. run Jekyll build;
4. verify both old routes render;
5. verify Header/Footer generated-output checks still pass;
6. verify retained legacy assets resolve;
7. document the result before publication.

Legacy cleanup must remain a later task.

### 9.7 QA/rollback conclusion

**QA and rollback direction: ACCEPTED with targeted workflow and rehearsal corrections.**

---

## 10. Exact required corrections

### 10.1 P0 — required before Production Specification approval

| ID | Required correction | Exact acceptance test |
|---|---|---|
| P0-01 | Name the exact locked Header runtime contract. | Layout uses `_includes/header-system/header.html`; Header CSS and JS load exactly once; no legacy Header compatibility assets are loaded on V2. |
| P0-02 | Name the exact locked Homepage Footer contract. | Layout uses `_includes/footer-commercial-v1.html` and the current Homepage Footer base CSS; generic Footer router is not used with nonexistent `homepage` variant; existing Footer generated-output gate passes. |
| P0-03 | Resolve the Contact `intent` field collision. | `intent` stores `private_review` or `project_inquiry`; direction selector submits canonical `selected_direction`; EN/RU use identical machine values. |
| P0-04 | Replace ambiguous `source` URLs with the canonical context schema. | CTA links contain allowlisted `source_page` and `source_cta`, include `#project-intake`, and submit the same field names the specification requires. |
| P0-05 | Make Contact support a separate prerequisite EN/RU PR. | Current Formspree endpoint, honeypot, timestamp, validation, async submit, reset, success and error states remain verified; no Contact redesign or Header/Footer change. |
| P0-06 | Define query-parameter validation and safe DOM handling. | Unsupported values are ignored; canonical values are allowlisted; bounded context is applied with `.value`/`.textContent`; no arbitrary HTML or sensitive analytics payload. |
| P0-07 | Define metadata origin without `_config.yml`. | Generated EN/RU canonical, reciprocal hreflang, x-default, OG and social URLs are absolute and correct without relying on missing `site.url`/`site.baseurl`. |
| P0-08 | Add a Homepage V2 generated-output deployment gate and include it in file scope. | Current Footer gate remains; new assertions validate both Homepage outputs, ten-section order, metadata, proof statuses, CTA parameters, asset uniqueness and absence of unrendered Liquid. |
| P0-09 | Publish an exact V2 runtime asset manifest. | Old Homepage CSS/JS cease to load; files remain for rollback; Header/Footer owners load once; V2 CSS/JS load once; no mixed V1/V2 runtime. |
| P0-10 | Make an explicit Chatbase preservation/removal decision. | No accidental functional removal; if preserved, same non-blocking behavior is measured and checked for mobile collisions; if removed, separate owner authorization exists. |
| P0-11 | Prohibit Liquid dependencies in raw `assets/` CSS/JS. | `homepage-v2.css` and `homepage-v2.js` contain no Liquid tokens; localized data is rendered into HTML/data attributes; raw files are valid when copied unchanged by Jekyll. |

### 10.2 P1 — required before Builder coding or before Gate C/D completion

| ID | Required correction | Exact acceptance test |
|---|---|---|
| P1-01 | Add an exact shared-layout data access and include example. | One `homepage` object is assigned from `site.data.homepage_v2[page.lang]`; each static include receives only its relevant data and language. |
| P1-02 | Define required EN/RU YAML schema parity. | Missing metadata, sections, collection items, status/disclosure or accessible labels fail generated-output validation instead of rendering blank content. |
| P1-03 | Use the established asset path convention. | New Homepage image assets use `assets/img/homepage-v2/**`, or the spec documents a justified repository-wide convention change outside this task. |
| P1-04 | Lock the fixed-Header offset contract. | Hero clears 85 px desktop, 84 px narrow portrait and 68 px short landscape without modifying Header files or relying on a sibling-inaccessible scoped variable. |
| P1-05 | Define the responsive-image data contract. | Every proof image has intrinsic dimensions, role-appropriate `srcset`/`sizes`, correct loading/fetch priority, alt treatment and mobile crop. |
| P1-06 | Separate Homepage-specific budgets from total-page measurement. | QA records component CSS/JS gzip sizes and total transfer, fonts, global assets, existing third parties, LCP owner, CLS sources and TBT. |
| P1-07 | Add the Ways-to-Start required object schema. | Each situation contains `best_when`, bounded objective, `not_implied`, link/CTA and canonical direction; no pricing/package fields or “most popular” treatment. |
| P1-08 | Lock the Journey DOM and accessibility representation. | Four steps exist in semantic reading order; decorative connectors are hidden; desktop styling does not change mobile/screen-reader sequence. |
| P1-09 | Define the exact production branch base rule. | Production branch is created from freshly fetched current `main`, not from the diverged strategy-review branch. |
| P1-10 | Add a tested rollback rehearsal to Gate G. | Prior wrapper/snapshot SHAs and asset references are recorded; restoring wrappers passes a Jekyll build and existing Footer verification before publication. |
| P1-11 | Add cache-busting ownership. | New Homepage CSS/JS have explicit versions; changed assets increment versions; unchanged Header/Footer versions are not modified incidentally. |
| P1-12 | Clarify analytics fallback. | Vendor-neutral events are dispatched only through an existing approved adapter or safe no-op; no new analytics vendor is introduced; navigation/submission never waits for analytics. |

### 10.3 P2 — quality improvements that may be resolved during prototype/spec finalization

| ID | Recommended correction | Acceptance test |
|---|---|---|
| P2-01 | Retain helper includes only when reused. | `proof-status.html` and `responsive-image.html` each serve multiple sections or are folded into their owner. |
| P2-02 | Record existing-versus-new image reuse in the proof source pack. | No unnecessary duplicate screenshot derivatives; every copied/new file has a clear Homepage role. |
| P2-03 | Clarify structured-data scope. | The implementation does not claim to preserve nonexistent Homepage JSON-LD; any new Organization/WebSite graph is separately validated and contains no unsupported claims. |
| P2-04 | Add one representative Android/Chrome mobile check. | Core layout, CTA, images and touch behavior receive one non-WebKit mobile verification in addition to iPhone review. |
| P2-05 | Document source comments for CSS component ownership. | Homepage stylesheet identifies section ownership without becoming an oversized internal specification or using global Header/Footer selectors. |

---

## 11. Final implementation-readiness status

### Current status

**Approved for targeted Production Specification correction. Not approved for implementation yet.**

The following are accepted and should not be reopened:

- approved commercial strategy;
- ten-block narrative;
- two top-level directions;
- Private Review business definition;
- clean Jekyll layout/include/data direction;
- shared structure with independent EN/RU copy;
- section-level ownership;
- progressive JavaScript;
- responsive four-step Journey;
- proof taxonomy;
- locked Header and Footer;
- Tier 3 implementation and independent review sequence;
- retained snapshot rollback model.

### Implementation may proceed only after

1. every P0 correction is incorporated into the authoritative Production Specification or exact implementation contract;
2. the owner approves the corrected production scope;
3. the narrow EN/RU Contact prerequisite is implemented and independently verified;
4. the final EN/RU copy and proof-source packs are approved;
5. the full-page desktop, phone portrait and phone landscape prototypes are approved;
6. the implementation branch is created from the then-current `main`;
7. the expected file list includes generated-output deployment validation;
8. the runtime asset manifest proves that V1 and V2 do not load together;
9. rollback inputs and rehearsal requirements are recorded.

### Final technical conclusion

The Production Specification is close to implementation-ready. Its fundamental architecture is correct. The remaining work is not a redesign; it is the completion of exact repository contracts that prevent silent Footer regression, ambiguous Contact submissions, invalid absolute metadata, mixed V1/V2 runtime ownership and insufficient deployment verification.

After those targeted corrections, the specification can advance to owner approval, content/proof locking, prototype review and a dedicated Homepage V2 production branch.

Independent Homepage V2 production-spec review complete. No production files were changed.
