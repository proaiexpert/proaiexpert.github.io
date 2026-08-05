# ProAI Expert Homepage V2 — Production Specification

**Status:** V1 — ready for independent technical review  
**Date:** 2026-08-04  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Strategy authority:** `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_STRATEGY.md`  
**Scope:** EN/RU Homepage V2 implementation planning  
**Implementation authorization:** not granted  
**Production PR authorization:** not granted

---

# 0. PURPOSE

This specification translates the approved Homepage V2 strategy into an implementation-ready technical contract.

It defines:

- target source architecture;
- exact Homepage section ownership;
- EN/RU content ownership;
- Header and Footer integration;
- CTA and Contact-context behavior;
- proof and claim contracts;
- responsive recomposition;
- accessibility;
- motion;
- performance;
- analytics event contracts;
- implementation sequence;
- QA matrix;
- rollback;
- acceptance gates.

This document does not authorize coding. The next required step is an independent technical review and owner approval of the final implementation scope.

---

# 1. CURRENT PRODUCTION ASSESSMENT

## 1.1 Current Homepage wrappers

Current entry routes:

- `index.html`;
- `ru/index.html`.

The wrappers currently:

- capture a complete legacy snapshot include;
- inject CSS and JavaScript;
- patch copy and markup through multiple Liquid `replace_first` operations;
- replace Header and Footer through string splitting;
- inject Founder and Insights sections by splitting around marker strings.

Current snapshot sources:

- `_includes/homepage-current-en.html`;
- `_includes/homepage-current-ru.html`.

This architecture is functional for current production but is not approved as the foundation of a broad Homepage V2 rebuild.

## 1.2 Current risk

Adding V2 through more string replacements would create:

- hidden dependency on exact legacy markup;
- fragile section markers;
- difficult EN/RU parity control;
- unclear asset ownership;
- increased regression risk;
- poor maintainability;
- unsafe block-level implementation.

## 1.3 Required migration principle

Homepage V2 must be a clean Jekyll-composed page.

The old snapshot includes remain unchanged during the initial V2 release window solely as rollback sources.

They must not remain the runtime owner of the new page.

---

# 2. TARGET SOURCE ARCHITECTURE

## 2.1 Recommended file map

```text
index.html
ru/index.html
_layouts/homepage-v2.html
_includes/homepage-v2/
  hero.html
  connected-journey.html
  directions.html
  flagship-proof.html
  ways-to-start.html
  process.html
  founder.html
  selected-work.html
  insights.html
  final-conversion.html
  proof-status.html
  responsive-image.html
_data/homepage_v2/
  en.yml
  ru.yml
assets/css/homepage-v2.css
assets/js/homepage-v2.js
assets/images/homepage-v2/
  hero/
  financial-stream/
  alina-horb/
  local-repair-pro/
  founder/
docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_STRATEGY.md
docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_PRODUCTION_SPEC.md
```

This is the default architecture. A Builder may propose a smaller equivalent only if it preserves the same ownership rules and avoids monolithic duplicate EN/RU markup.

## 2.2 Entry wrappers

### `index.html`

Required responsibility:

- front matter;
- `layout: homepage-v2`;
- `lang: en`;
- `permalink: /`;
- EN metadata identifiers.

No section HTML, inline CSS, large scripts, or string replacement logic.

### `ru/index.html`

Required responsibility:

- front matter;
- `layout: homepage-v2`;
- `lang: ru`;
- `permalink: /ru/`;
- RU metadata identifiers.

No duplicated full-page structure.

## 2.3 Homepage layout

### `_layouts/homepage-v2.html`

Owns:

- document shell;
- localized `<html lang>`;
- metadata and social tags;
- canonical and reciprocal hreflang;
- stylesheet loading;
- skip link;
- existing Header include;
- `<main id="main-content">`;
- ordered section includes;
- existing Footer include;
- progressive-enhancement JavaScript loading.

Must not:

- duplicate Header markup;
- duplicate Footer markup;
- contain large localized copy blocks;
- contain block-specific inline CSS;
- depend on JavaScript for content visibility.

## 2.4 Localized data

### `_data/homepage_v2/en.yml`

Owns EN:

- metadata;
- Hero copy;
- CTA labels and URLs;
- section labels;
- direction copy;
- journey labels;
- proof labels and disclosure;
- process copy;
- Founder copy;
- selected Insight references;
- final-conversion copy;
- accessible labels.

### `_data/homepage_v2/ru.yml`

Owns independently composed RU equivalents.

The RU file is not a line-by-line translation artifact. It must be reviewed as standalone Russian commercial copy.

## 2.5 Stable machine identifiers

Localized labels may differ. Internal identifiers remain identical across EN/RU.

Required canonical values:

```text
private_review
view_client_work
ai_systems_automation
websites_branding
financial_stream
alina_horb
local_repair_pro
homepage_hero
homepage_directions
homepage_flagship_proof
homepage_ways_to_start
homepage_final
```

Use lowercase snake_case for form context and analytics values.

## 2.6 Section includes

Each section include:

- renders one strategic block;
- receives `lang` and the relevant data object;
- owns semantic HTML for that block;
- does not redefine global Header or Footer behavior;
- uses stable section IDs;
- has a usable no-JS baseline;
- keeps decorative markup clearly marked or hidden from assistive technology.

## 2.7 CSS ownership

### `assets/css/homepage-v2.css`

Owns all new Homepage body styling.

It must:

- be scoped to a body or main Homepage V2 namespace;
- avoid redefining Header and Footer owner selectors;
- use existing design tokens where appropriate;
- define section rhythm, typography, proof fields, responsive recomposition, focus, and reduced motion;
- avoid inline hotfixes;
- avoid page-level `!important` except for documented accessibility or third-party containment needs;
- declare component ownership in comments.

Suggested namespace:

```css
.homepage-v2
.homepage-v2__hero
.homepage-v2__journey
.homepage-v2__directions
```

BEM is optional, but selector ownership must be explicit and collision-resistant.

## 2.8 JavaScript ownership

### `assets/js/homepage-v2.js`

JavaScript is optional and progressive only.

Allowed responsibilities:

- run-once reveal enhancement;
- connected-journey state emphasis;
- safe CTA context preservation;
- analytics event dispatch;
- enhancement of nonessential interactions.

Not allowed:

- basic content rendering;
- navigation dependence;
- hidden primary proof until intersection;
- scroll-jacking;
- autoplay narrative;
- continuous parallax;
- cursor effects;
- fake dashboards;
- animation-dependent understanding;
- layout measurement loops that create instability.

The file must fail safely. Core content and links remain usable if it does not load.

---

# 3. HEADER AND FOOTER CONTRACT

## 3.1 Header

Use the current canonical Header System include and assets without redesign.

Required integration:

- current page = Home;
- mapped EN/RU locale URL;
- existing mobile-menu behavior;
- existing logo, navigation, language control, and CTA component contract;
- no Homepage-specific duplicate Header markup.

The Homepage implementation must not modify Header source files unless a separately reviewed critical compatibility defect is proven.

## 3.2 Header CTA copy

The Homepage strategy uses `Request a Private Review` / `Запросить первичный разбор` as the primary body CTA.

The existing Header CTA may remain under its current global wording during the initial V2 implementation if changing it would expand scope across the full site.

Production review must choose one of two bounded options:

1. preserve the global Header CTA unchanged and use Homepage body CTA independently; or
2. change Header CTA through a separate Header System task affecting all mapped routes.

Default for Homepage V2: **preserve the Header CTA unchanged**.

## 3.3 Footer

Use the current canonical Commercial Footer include and shared Footer motion/style ownership.

Homepage V2 must not:

- copy Footer markup;
- override Footer layout;
- redefine Footer title animation;
- add Homepage-specific Footer contact links;
- change Footer social policy.

The final-conversion section must create an intentional visual handoff into the existing Footer.

---

# 4. METADATA AND ROUTE CONTRACT

## 4.1 Routes

Preserve:

- `/`;
- `/ru/`.

No new public Homepage route is required.

## 4.2 Canonical and hreflang

EN:

- self-canonical `/`;
- alternate `en` `/`;
- alternate `ru` `/ru/`;
- `x-default` `/`.

RU:

- self-canonical `/ru/`;
- reciprocal `en` `/`;
- reciprocal `ru` `/ru/`;
- `x-default` `/`.

## 4.3 Metadata

Final EN/RU metadata must be written during the copy phase.

Working EN title direction:

`ProAI Expert | AI Systems, Automation & Premium Websites`

Working EN description direction:

`Practical AI systems, automation, premium websites, and branding for U.S. service businesses that need stronger trust, clearer inquiries, and less manual work.`

RU metadata must be naturally composed, not mechanically translated.

## 4.4 Social image

Do not keep a stale Homepage social image after the V2 design materially changes.

Required before publication:

- updated EN OG image;
- updated RU OG image if localized text is present;
- 1200 × 630 output;
- readable mobile crop;
- truthful representation of the V2 visual system;
- optimized file size.

## 4.5 Structured data

Preserve or correctly rebuild existing Organization/WebSite structured data where currently valid.

Do not add:

- fabricated ratings;
- reviews not approved for publication;
- Service schema with unsupported prices or geography;
- FAQ schema unless visible FAQ content exists on the page.

---

# 5. SECTION IMPLEMENTATION CONTRACT

# 5.1 Block 01 — Hero

## Required section ID

`hero`

## Required content

- localized eyebrow;
- localized H1;
- localized supporting statement;
- primary CTA;
- expectation microcopy;
- secondary CTA;
- one meaningful visual or proof relationship.

## Working EN direction

Eyebrow:

`AI SYSTEMS, AUTOMATION & PREMIUM WEBSITES FOR SERVICE BUSINESSES`

H1:

`Build trust. Handle inquiries. Reduce manual work.`

Primary CTA:

`Request a Private Review`

Secondary CTA:

`View Client Work`

## Working RU direction

Eyebrow:

`AI-СИСТЕМЫ, АВТОМАТИЗАЦИЯ И ПРЕМИАЛЬНЫЕ САЙТЫ ДЛЯ СЕРВИСНОГО БИЗНЕСА`

H1:

`Выстраиваем доверие. Наводим порядок в обращениях. Сокращаем ручную работу.`

Primary CTA:

`Запросить первичный разбор`

Secondary CTA:

`Смотреть клиентские проекты`

## Hero responsibility limit

The Hero answers only:

1. who ProAI serves;
2. the two connected directions;
3. the primary business change;
4. the next step.

Detailed differentiation belongs below.

## Visual contract

Allowed:

- controlled system relationship;
- real interface fragments;
- static-first journey preview;
- restrained depth;
- one LCP asset.

Not allowed:

- current large continuously rotating 3D cube as the core message;
- particles;
- a fake CRM dashboard;
- iframe-only Hero;
- autoplay video;
- decorative visual pushing both CTAs below the first meaningful viewport.

## CTA destinations

Primary:

- EN: `/contact/?intent=private_review&source=homepage_hero`;
- RU: `/ru/contact/?intent=private_review&source=homepage_hero`.

Secondary:

- `#client-work`.

Final URL construction may use a small helper, but links must remain valid without JavaScript.

---

# 5.2 Block 02 — Connected Business Journey

## Required section ID

`connected-journey`

## Strategic content

Three breakdown signals:

- trust friction;
- inquiry friction;
- operational friction.

Connected logic:

### Before inquiry

- understand and trust;
- submit a clear request.

### After inquiry

- route and respond;
- follow up and improve.

## Desktop composition

Use either:

- two connected lanes; or
- four sequential grouped stages.

The composition must remain readable at laptop width without browser zoom.

## Mobile composition

Use a vertical four-step system grouped under:

- `Before inquiry` / `До обращения`;
- `After inquiry` / `После обращения`.

No horizontal scrolling. No miniature eight-stage diagram. No tiny connector labels.

## Motion

Optional run-once emphasis may reveal sequence.

Static state must communicate the full meaning.

---

# 5.3 Block 03 — Two Core Directions

## Required section ID

`directions`

## Direction A

Internal ID:

`ai_systems_automation`

Public title:

- EN: `AI Systems & Automation`;
- RU: `AI-системы и автоматизация`.

Required content pattern:

- recognizable problem;
- plain-language intervention;
- designed practical effect;
- up to five supporting capabilities;
- contextual service-page link.

EN destination:

`/ai-systems/`

RU destination:

`/ru/ai-systems/`

## Direction B

Internal ID:

`websites_branding`

Public title:

- EN: `Premium Websites & Branding`;
- RU: `Премиальные сайты и брендинг`.

EN destination:

`/websites-branding/`

RU destination:

`/ru/websites-branding/`.

## Layout

Two large editorial territories, not ten small equal cards.

At tablet and mobile, stack in the approved narrative order while preserving equal strategic status.

## Claims

Do not claim increased leads, better lead quality, higher conversion, or revenue improvement without dated evidence.

---

# 5.4 Block 04 — Financial Stream Flagship Proof

## Required section ID

`client-work`

## Canonical status

`Live client project · EN/RU`

## Required evidence story

Show a controlled combination of:

- live bilingual website;
- clearer service context before contact;
- structured inquiry before calendar;
- content and service architecture;
- bounded human-reviewed automation;
- one restrained dated evidence line if used.

## Required links

- full case study;
- live website.

## Metrics rule

If current Search Console metrics are used:

- state reporting period/date;
- explain only what they demonstrate;
- add a limitation that they do not establish lead, revenue, conversion, or ROI impact.

Maximum Homepage metrics treatment:

- one concise evidence line or compact evidence field;
- no dashboard;
- no animated counters.

## Screenshot plan

Use one primary large proof field plus at most two supporting details.

Do not repeat the same capture later in Selected Work.

---

# 5.5 Block 05 — Ways to Start

## Required section ID

`ways-to-start`

## Required model

Three visitor situations, not pricing packages.

### Situation 1

Website and trust path are the main problem.

### Situation 2

Inquiry handling or repetitive process is the main problem.

### Situation 3

Website and operations need to work as one system.

## Each item requires

- `Best when...`;
- bounded first objective;
- what the first step does not imply;
- contextual service link or Private Review CTA.

## Ongoing support

Present as a short continuation note after the three situations.

Do not create a fourth equal card.

## Pricing

No Homepage prices.

---

# 5.6 Block 06 — How the Work Is Controlled

## Required section ID

`process`

## Five phases

1. Review context.
2. Define priorities and boundaries.
3. Build the focused system.
4. Launch and verify.
5. Improve where evidence supports it.

## Layout

Use a concise editorial progression.

Do not create another large process diagram that competes with the connected journey.

Mobile must not produce a long seven-step card stack.

---

# 5.7 Block 07 — Founder Accountability

## Required section ID

`founder`

## Required content

- Ihor Horb;
- Founder · Strategy & Systems Architecture;
- Washington, USA;
- accountable role across strategy, AI systems, automation, and website architecture;
- English, Russian, and Ukrainian working capability;
- About link;
- LinkedIn link.

## Visual

Use the approved real portrait or an optimized successor.

Portrait remains secondary to role and accountability copy.

Avoid large empty minimum heights.

---

# 5.8 Block 08 — Selected Work

## Required section ID

`selected-work`

## Alina Horb

Canonical status:

`Live related-party project · UA/RU`

Required visible disclosure intent:

`Connected to the founder; shown as proof of strategy, production, and localization quality, not independent client validation.`

The Russian version must communicate the same disclosure naturally.

## Local Repair Pro

Canonical status:

`Website concept · Live demo · In development`

Never imply a paid client, operating repair business, real customers, reviews, service area, or business outcomes.

## Financial Stream duplication

Use either:

- no additional Financial Stream card; or
- one compact text callback to the flagship section.

Do not repeat flagship proof imagery and CTA.

## Required links

- relevant case page;
- live website or demo where appropriate;
- Case Studies archive.

---

# 5.9 Block 09 — Selected Insights

## Required section ID

`insights`

## Maximum items

Three.

## Selection roles

1. website buying or trust decision;
2. practical AI / inquiry operations;
3. multilingual website strategy.

## Rules

- use current live article routes;
- preserve EN/RU mapped destinations;
- do not show an item without a valid localized counterpart unless the content strategy explicitly approves an asymmetry;
- keep summaries concise;
- avoid turning the Homepage into the archive.

---

# 5.10 Block 10 — Final Conversion

## Required section ID

`private-review`

## Required message

The visitor may not yet know whether the first step is:

- a website;
- automation;
- both.

The Private Review identifies fit and the strongest first step.

## Required CTA

- EN: `Request a Private Review`;
- RU: `Запросить первичный разбор`.

## Destination

- EN: `/contact/?intent=private_review&source=homepage_final`;
- RU: `/ru/contact/?intent=private_review&source=homepage_final`.

## Closing rule

No new service category, proof claim, or pricing argument after this section.

The visual treatment must hand off naturally into the existing Footer.

---

# 6. PRIVATE REVIEW AND CONTACT INTEGRATION

## 6.1 Service definition

Private Review is a no-cost, bounded fit-and-priority review.

The user submits short context. ProAI Expert reviews:

- fit;
- likely priority;
- the most useful next step.

It is not a complete audit, implementation plan, free consulting engagement, or guarantee.

## 6.2 Required Contact behavior

When `intent=private_review` is present:

- show localized contextual lead-in;
- preserve existing Contact page identity and route;
- do not create a separate hidden service page;
- preselect or clearly indicate the review intent;
- keep the form short;
- allow the visitor to choose AI Systems, Websites & Branding, Both / Not sure.

## 6.3 Required context fields

Preserve in the submission or equivalent lead record:

```text
intent
source_page
source_cta
selected_direction
source_context
referring_url
language
```

Recommended example values:

```text
intent=private_review
source_page=homepage
source_cta=homepage_hero
selected_direction=not_sure
language=en
```

## 6.4 Existing endpoint safety

Do not change the current form endpoint, delivery integration, anti-spam behavior, or success/error handling until the Builder reads and documents the current implementation.

The first implementation should add context safely around the existing submission mechanism rather than replace it incidentally.

## 6.5 User expectations

Near the CTA and Contact form, explain:

- submit short context;
- ProAI reviews fit and priority;
- the response recommends a next step.

Do not promise a response time unless operationally guaranteed.

---

# 7. CONTENT AND COPY WORKFLOW

## 7.1 Copy is a prerequisite

Production markup must not begin with temporary generic copy that later changes section dimensions unpredictably.

Before visual implementation, prepare:

- final EN Homepage copy;
- final RU independent localization;
- CTA microcopy;
- proof status and disclosure copy;
- Financial Stream evidence line and limitation;
- alt text;
- Contact contextual lead-in;
- metadata;
- social image text if any.

## 7.2 Copy review order

1. EN commercial clarity.
2. RU natural composition.
3. proof and claims review.
4. layout-length review.
5. owner approval.

## 7.3 Copy length constraints

Hero:

- one short eyebrow;
- H1 no more than three short clauses;
- supporting statement approximately two sentences maximum;
- one expectation microcopy sentence.

Direction sections:

- one concise thesis;
- no more than five supporting capabilities;
- one contextual CTA.

Proof disclosure:

- visible and concise;
- not hidden in tooltip or inaccessible footnote.

---

# 8. VISUAL SYSTEM CONTRACT

## 8.1 Preserve

- dark ProAI environment;
- restrained cyan identity signal;
- Inter or current approved primary type system;
- strong editorial hierarchy;
- technical precision;
- existing Header and Footer.

## 8.2 Change

- replace decorative AI spectacle with meaningful system visualization;
- reduce equal glass-card repetition;
- create narrative surface chapters;
- enlarge real proof;
- use project-specific colors intentionally;
- use more visual pauses and controlled density.

## 8.3 Surface plan

Recommended chapters:

1. dark opening;
2. dark/graphite connected journey;
3. two differentiated direction territories;
4. Financial Stream proof surface using project colors;
5. quieter engagement/process surfaces;
6. human Founder surface;
7. project-specific Selected Work;
8. editorial Insights;
9. dark final close.

Do not alternate colors mechanically for every block.

## 8.4 Typography

- one primary font family;
- no additional decorative font without material value;
- body text readable at controlled measure;
- strong but not oversized section titles;
- Russian line expansion explicitly accommodated;
- no forced no-wrap H1 spans;
- no tiny monospace text as primary information.

## 8.5 Images

Priority:

1. real project screenshots;
2. useful interface details;
3. process or journey diagrams;
4. founder portrait;
5. abstract graphics with functional meaning.

Avoid:

- generic AI robots;
- humanoid heads;
- stock handshakes;
- decorative laptop/phone mockups that hide proof;
- repeated near-identical screenshots.

---

# 9. RESPONSIVE CONTRACT

## 9.1 Breakpoint philosophy

Do not design around only framework breakpoints.

Specify content order and recomposition for:

- large desktop;
- laptop;
- tablet landscape;
- tablet portrait;
- phone portrait;
- short phone landscape;
- 320 px narrow mobile.

## 9.2 Required viewport matrix

Minimum browser review:

```text
1600 × 1000
1440 × 900
1366 × 768
1280 × 800
1024 × 1366
1024 × 768
820 × 1180
768 × 1024
430 × 932
390 × 844
375 × 812
360 × 800
320 × 568
844 × 390
740 × 360
667 × 375
```

The exact physical-device matrix may add viewports.

## 9.3 Hero mobile rules

- message first;
- primary CTA next;
- expectation microcopy visible;
- secondary CTA available;
- visual after core action;
- no `min-height: 100vh` dependency in short landscape;
- no decorative scene pushing content below the useful viewport.

## 9.4 Connected journey mobile rules

- two labelled groups;
- four vertical steps;
- short labels;
- no horizontal track;
- no fixed-width chips;
- no connector overflow;
- accessible text preserves full meaning.

## 9.5 Directions mobile rules

- stack deliberately;
- maintain equal strategic status;
- do not hide one direction behind tabs by default;
- contextual links remain visible;
- avoid long card walls.

## 9.6 Proof mobile rules

- use responsive image variants;
- preserve readable status and disclosure;
- crop around the proof purpose;
- captions remain readable;
- no microscopic full-page screenshot.

## 9.7 Phone landscape rules

- no sticky narrative panels;
- no full-screen animation scenes;
- no oversized section minimum heights;
- CTA and navigation remain reachable;
- reduced decorative density;
- static composition preferred.

---

# 10. ACCESSIBILITY CONTRACT

Required:

- skip link;
- semantic landmarks;
- one H1;
- logical H2/H3 hierarchy;
- meaningful link text;
- visible focus;
- full keyboard operation;
- sufficient contrast;
- meaningful alt text;
- decorative image suppression;
- touch targets appropriate for mobile;
- no information encoded only by color;
- no information encoded only by motion;
- `prefers-reduced-motion` support;
- sensible DOM reading order matching mobile order;
- no content hidden permanently when JavaScript fails;
- status disclosures available to assistive technology;
- forced-colors review where relevant.

The connected journey must have an accessible text representation even when the visual uses lines or relationships.

---

# 11. MOTION CONTRACT

## 11.1 Allowed

- 8–16 px reveal distance;
- approximately 240–650 ms duration;
- run-once section reveals;
- restrained state emphasis;
- hover/focus feedback;
- optional connected-journey sequence enhancement.

## 11.2 Prohibited

- scroll-jacking;
- continuous parallax;
- cursor trails;
- particles;
- typing effects;
- long intro sequences;
- continuous large 3D rotation;
- animated metrics;
- motion that changes reading order;
- content hidden until scroll observer succeeds.

## 11.3 Reduced motion

`prefers-reduced-motion: reduce` must:

- remove nonessential transforms and animation;
- preserve state and hierarchy;
- keep focus feedback;
- show all content immediately;
- avoid abrupt layout changes.

---

# 12. PERFORMANCE CONTRACT

## 12.1 Core objectives

Representative mobile production objectives:

- LCP below 2.5 seconds;
- CLS near zero;
- TBT near zero for the static experience;
- no duplicate asset requests;
- no render-blocking third-party script added by Homepage V2.

## 12.2 Homepage-specific budgets

Targets before final measurement:

- one true Hero LCP image only;
- mobile LCP image target at or below approximately 250 KB;
- Homepage-specific JavaScript target below 20 KB gzip;
- Homepage-specific CSS target below 50 KB gzip;
- no additional font family;
- below-fold images lazy-loaded;
- declared image dimensions;
- responsive `srcset`/`sizes`;
- modern image formats;
- no iframe in initial viewport.

A justified exception requires documented evidence and review.

## 12.3 Images

Prepare sizes appropriate to use, not just one large master file.

Recommended width families where relevant:

```text
480
768
1200
1600
```

Not every image needs every width. Select based on rendered role.

## 12.4 JavaScript

- defer the Homepage script;
- no framework dependency for basic interactions;
- avoid duplicate scroll observers;
- remove listeners when no longer needed;
- use CSS for simple states;
- dispatch analytics without blocking navigation.

## 12.5 Third parties

Do not add new third-party scripts in the Homepage implementation task.

Any later third-party addition requires separate privacy, failure, and performance review.

---

# 13. ANALYTICS EVENT CONTRACT

This specification defines vendor-neutral events. It does not authorize a new analytics vendor.

## 13.1 Events

### `homepage_cta_click`

Parameters:

```text
cta_id
section_id
language
destination
selected_direction
```

### `homepage_direction_open`

Parameters:

```text
direction_id
language
destination
```

### `homepage_case_open`

Parameters:

```text
case_id
case_status
language
destination_type
```

### `homepage_insight_open`

Parameters:

```text
article_id
language
destination
```

### `private_review_start`

Dispatch when the visitor enters the matching Contact flow.

### `private_review_submit`

Dispatch only after confirmed successful submission.

## 13.2 Privacy and reliability

- no sensitive message content in analytics;
- no email, phone, name, or free-text project description in event payloads;
- do not block navigation or form submission;
- events must fail silently if analytics is unavailable;
- EN/RU use stable internal identifiers.

---

# 14. CONTENT AND PROOF SOURCE PACK

Before implementation, prepare a source pack containing:

## 14.1 Financial Stream

- approved status;
- selected screenshot files;
- screenshot dates where material;
- approved case links;
- exact evidence line;
- exact limitation;
- testimonial permission and exact wording if used.

## 14.2 Alina Horb

- approved representative screenshot;
- exact related-party disclosure;
- correct UA/RU status;
- case and live-site links;
- no independent-validation implication.

## 14.3 Local Repair Pro

- approved representative screenshot;
- exact `Website concept · Live demo · In development` label;
- case and demo links;
- no client or operating-business implication.

## 14.4 Founder

- approved portrait;
- exact role wording;
- About and LinkedIn links;
- language and Washington wording.

## 14.5 Insights

- final three EN routes;
- mapped RU routes;
- labels, reading times if retained, and summaries;
- no stale article selection.

---

# 15. IMPLEMENTATION WORKFLOW

## 15.1 Risk tier

Homepage V2 is Tier 3 for implementation because it requires:

- broad production-page replacement;
- new source architecture;
- EN/RU parity;
- responsive recomposition;
- real screenshot and browser QA;
- performance verification;
- rollback planning.

Recommended route:

- main Control chat owns scope and decisions;
- dedicated Builder branch;
- Codex/local environment for Jekyll, browser automation, screenshots, and performance checks;
- fresh independent Reviewer chat checks actual diff and rendered artifacts;
- Publisher action only after explicit owner authorization.

## 15.2 Pre-implementation deliverables

Required before coding:

1. approved canonical strategy;
2. reviewed Production Specification;
3. final EN/RU copy pack;
4. proof source pack;
5. low-fidelity full-page map;
6. approved visual direction;
7. desktop, phone portrait, and phone landscape prototype;
8. exact file list and branch plan.

## 15.3 Builder branch

Recommended branch name:

`agent/homepage-v2-production`

Create only after owner authorizes implementation.

Do not build production code on the strategy-review branch.

## 15.4 Build sequence

1. create clean layout/data/include scaffold;
2. render static EN/RU content with existing Header/Footer;
3. implement section layout without motion;
4. integrate proof assets;
5. implement responsive recomposition;
6. add progressive motion;
7. add CTA context handling;
8. add vendor-neutral analytics dispatch where current analytics supports it;
9. run Jekyll and source checks;
10. run browser matrix;
11. capture screenshots;
12. independent review;
13. targeted corrections;
14. owner real-device review;
15. merge only after explicit authorization.

## 15.5 No block-by-block production merge

Do not merge only the Hero or another isolated block onto the old Homepage narrative.

Homepage V2 is reviewed and published as one coherent page system.

Small preparatory asset or documentation tasks may be separate, but production body sections must not create a mixed V1/V2 commercial narrative.

---

# 16. EXPECTED PRODUCTION FILE SCOPE

The exact list is finalized after prototype approval. Expected files:

```text
index.html
ru/index.html
_layouts/homepage-v2.html
_includes/homepage-v2/hero.html
_includes/homepage-v2/connected-journey.html
_includes/homepage-v2/directions.html
_includes/homepage-v2/flagship-proof.html
_includes/homepage-v2/ways-to-start.html
_includes/homepage-v2/process.html
_includes/homepage-v2/founder.html
_includes/homepage-v2/selected-work.html
_includes/homepage-v2/insights.html
_includes/homepage-v2/final-conversion.html
_includes/homepage-v2/proof-status.html
_includes/homepage-v2/responsive-image.html
_data/homepage_v2/en.yml
_data/homepage_v2/ru.yml
assets/css/homepage-v2.css
assets/js/homepage-v2.js
assets/images/homepage-v2/**
contact/index.html                 # only if approved Private Review context requires source change
ru/contact/index.html              # paired change
```

Header and Footer owner files remain forbidden by default.

If the implementation can preserve Contact behavior through existing generic context hooks, Contact files should remain unchanged. This must be verified, not assumed.

---

# 17. TESTING AND QA

## 17.1 Build

Required:

- Jekyll production build;
- no Liquid warnings affecting Homepage;
- no missing include/data errors;
- generated EN and RU routes present;
- existing Footer deployment contract still passes;
- no unrendered Liquid output.

## 17.2 Source contract

Verify:

- no Homepage runtime dependency on `replace_first` patch chains;
- no duplicate H1;
- correct section order;
- exact route links;
- correct language destinations;
- current Header include once;
- current Footer include once;
- one Homepage stylesheet owner;
- no duplicate Homepage script;
- canonical and hreflang correct;
- proof status strings present;
- Private Review URLs and internal values correct.

## 17.3 Browser matrix

Minimum:

- Chromium desktop and mobile emulation;
- WebKit desktop/mobile emulation;
- Firefox representative desktop;
- owner iPhone portrait;
- owner iPhone landscape.

## 17.4 Visual checks

Across EN/RU:

- Hero comprehension;
- CTA visibility;
- connected journey readability;
- direction hierarchy;
- Financial Stream proof readability;
- proof status visibility;
- Alina disclosure visibility;
- Local Repair taxonomy;
- process density;
- Founder scale;
- Insights length;
- final Footer handoff;
- no horizontal overflow;
- no clipping;
- no text collisions;
- no low-height landscape failure.

## 17.5 Interaction checks

- Header menu;
- language switch;
- skip link;
- primary CTA;
- secondary anchor CTA;
- service links;
- case links;
- external live-site links;
- Insights links;
- Contact context;
- keyboard navigation;
- focus visibility;
- reduced motion;
- no-JS baseline.

## 17.6 Performance checks

- Lighthouse or equivalent representative mobile run;
- LCP owner identified;
- CLS sources inspected;
- image transfer reviewed;
- CSS and JS gzip sizes recorded;
- no duplicate fonts/assets;
- no unexpected third-party request;
- no render-blocking Homepage JavaScript.

## 17.7 Accessibility checks

- headings and landmarks;
- keyboard;
- visible focus;
- contrast;
- alt text;
- accessible status/disclosure;
- touch targets;
- reduced motion;
- forced colors where relevant;
- screen-reader order spot check;
- form context and labels if Contact is modified.

## 17.8 EN/RU parity checks

Verify equal:

- block order;
- CTA intent;
- service links;
- proof class;
- disclosure;
- form context;
- mobile priority;
- success/error behavior;
- canonical/hreflang;
- analytics identifiers.

---

# 18. ROLLBACK PLAN

## 18.1 Preserve old sources

During initial Homepage V2 release:

- keep `_includes/homepage-current-en.html`;
- keep `_includes/homepage-current-ru.html`;
- preserve the pre-V2 wrappers in Git history;
- do not delete legacy Homepage CSS/JS in the same production PR unless proven completely unreferenced and rollback-safe.

## 18.2 Rollback action

Rollback must be possible by restoring the prior `index.html` and `ru/index.html` wrappers and their known asset references.

Do not require reconstruction from screenshots or chat history.

## 18.3 Cleanup

Legacy Homepage cleanup, asset deletion, or snapshot archival occurs only:

- after stable production verification;
- in a separate scoped cleanup task;
- with a fresh reference audit;
- with explicit owner authorization.

---

# 19. IMPLEMENTATION ACCEPTANCE GATES

## Gate A — Strategy

- canonical strategy approved;
- two directions locked;
- CTA definition locked;
- proof taxonomy locked.

## Gate B — Production specification

- independent technical review complete;
- source architecture approved;
- exact file scope approved;
- Contact integration decision approved;
- QA and rollback approved.

## Gate C — Content

- EN copy approved;
- RU copy approved independently;
- proof source pack complete;
- claims review passed;
- metadata and OG content approved.

## Gate D — Prototype

- full desktop page approved;
- phone portrait approved;
- phone landscape approved;
- representative RU composition approved;
- Header/Footer integration approved.

## Gate E — Build

- Jekyll passes;
- source contract passes;
- responsive matrix passes;
- accessibility passes;
- performance objectives pass or documented exceptions are approved;
- no-JS and reduced-motion pass.

## Gate F — Review

- fresh Reviewer checks actual GitHub diff;
- rendered screenshots/artifacts reviewed;
- verdict = `ACCEPT`;
- no unresolved P0/P1 defects.

## Gate G — Publication

- current main SHA rechecked;
- branch head rechecked;
- changed files rechecked;
- mergeability and checks rechecked;
- rollback confirmed;
- owner explicitly authorizes merge/publication.

---

# 20. INDEPENDENT TECHNICAL REVIEW TASK

The next Reviewer must inspect this specification and return:

- `ACCEPT`;
- `TARGETED CORRECTION`;
- `REJECT`.

The review must focus on:

1. whether the clean Jekyll architecture is appropriate;
2. whether any proposed file ownership conflicts with current Header/Footer/Jekyll systems;
3. whether the Contact-context plan is safe with the current form implementation;
4. whether the ten sections can be implemented without excessive file or component complexity;
5. whether mobile transformation is exact enough;
6. whether EN/RU data ownership preserves natural localization;
7. whether performance budgets are realistic;
8. whether the QA matrix is sufficient;
9. whether rollback is operationally sound;
10. whether any requirement would accidentally expand scope into service pages, cases, Header, Footer, or full-site redesign.

The Reviewer must read actual current source files and not review only this document.

No production changes are permitted during the review.

---

# 21. CURRENT READINESS

The strategic phase is owner-approved.

The Production Specification V1 is complete and ready for independent technical review.

Homepage implementation remains blocked until:

- this specification receives independent review;
- required targeted corrections are incorporated;
- the owner approves the final production scope;
- EN/RU copy, proof assets, and full-page prototype are approved.
