# ProAI Expert Homepage V2 — Independent Review Report

**Status:** Complete  
**Verdict:** `TARGETED CORRECTION`  
**Branch:** `agent/homepage-v2-strategy-review`  
**Review date:** 2026-08-04  
**Scope:** Independent strategy review only; no production implementation

---

## 1. Executive verdict

`TARGETED CORRECTION`

Homepage V2 Strategy V1 is strategically sound and should not be rejected or replaced with a competing homepage concept. Its central commercial argument is materially stronger than a conventional agency homepage: ProAI Expert connects what happens **before an inquiry**—positioning, trust, website clarity and first-step design—with what happens **after an inquiry**—intake, routing, follow-up and practical automation.

The strategy also correctly preserves the approved business constraints:

- U.S. service businesses as the target audience;
- Washington as an acquisition advantage rather than a service boundary;
- two top-level directions only;
- AI-first strategic emphasis without publicly publishing a 60/40 split;
- studio-first, founder-supported positioning;
- Financial Stream as flagship live proof;
- no prices and no unsupported business-outcome claims;
- natural EN/RU localization;
- locked Header and Footer.

The strategy is not yet ready to move directly into implementation. Six material issues must be corrected first:

1. `Request a Private Review` is not yet defined tightly enough and does not currently map cleanly to the existing Contact experience.
2. The proposed 11-block narrative contains avoidable repetition and creates a long-page/service-catalogue risk.
3. Proof taxonomy is directionally correct but still needs exact public disclosure rules for Alina Horb, Local Repair Pro and any Financial Stream metrics.
4. The eight-stage connected-journey system, four Ways to Start and seven-step process are not sufficiently resolved for phone portrait, phone landscape and 320 px.
5. EN/RU parity is well recognized, but several important Russian terms and CTA formulations require independent composition rather than literal translation.
6. The production-planning handoff must explicitly replace the current homepage wrapper/`replace_first` accumulation rather than extending it into a broad V2 rebuild.

These are limited, repairable defects. The core positioning, audience, service architecture and proof hierarchy should remain locked.

---

## 2. Repository and source state checked

### Repository state

- Repository: `proaiexpert/proaiexpert.github.io`
- Working branch: `agent/homepage-v2-strategy-review`
- Main baseline checked during review: `af9b7288a9a5fc36de57afd816302e80e17e0d8a`
- Before this report update, the working branch was four commits ahead of that baseline and zero commits behind.
- The branch delta contained only the four files in `docs/site-evolution/homepage-v2-review/`.
- No production HTML, CSS, JavaScript, Header, Footer, route, metadata, sitemap, form, analytics or asset file was changed during this review.

### Governing documents reviewed

- `AI_START_HERE.md`
- `AGENTS.md`
- `AI_CURRENT_HANDOFF.md`
- `README.md`
- `docs/site-evolution/homepage-v2-review/00_READ_ME.md`
- `docs/site-evolution/homepage-v2-review/01_HOMEPAGE_V2_STRATEGY_V1.md`
- `docs/site-evolution/homepage-v2-review/02_INDEPENDENT_REVIEW_TASK.md`
- `docs/CLIENT_ACQUISITION_SOCIAL_AND_SALES_PLAN.md`
- `docs/website-production-factory/PREMIUM_SITE_EXPERIENCE_STANDARD.md`

### Current EN/RU production sources and related routes inspected

- Homepage: `index.html`, `ru/index.html`, and the current homepage include/wrapper architecture.
- AI Systems: `ai-systems/index.html`, `ru/ai-systems/index.html`.
- Websites & Branding: `websites-branding/index.html`, `ru/websites-branding/index.html`.
- About: `about/index.html`, `ru/about/index.html`.
- Contact: `contact/index.html`, `ru/contact/index.html`.
- Case Studies archive: `case-studies/index.html`, `ru/case-studies/index.html`.
- Financial Stream case: EN/RU routes.
- Alina Horb case: EN/RU routes.
- Local Repair Pro case: EN/RU routes.
- Insights hubs: EN/RU route wrappers and hub includes.

### Important current-state findings

1. The current homepage already uses a commercial positioning layer for U.S. service businesses, but it is assembled through a legacy include plus multiple Liquid string replacements and injected sections. That architecture is acceptable as current production history, but it is a poor foundation for a broad V2 rebuild.
2. The Contact forms currently support direction selection and basic project context, but they do not explicitly implement a `Private Review` service promise or preserve all proposed source context.
3. Financial Stream has the strongest evidence discipline in the repository: real-client status, live EN/RU system, dated screenshots, capability limitations and dated search evidence.
4. Alina Horb is shown as a live UA/RU project, but the inspected public case/archive/homepage source does not currently make the related-party context explicit enough for the new homepage proof standard.
5. Local Repair Pro is generally framed truthfully as a website case/concept in development, but status wording varies between `website case`, `website concept`, `live demo` and `in development`.
6. Current AI service pages contain substantial technical and matrix-style detail. That depth can remain on service pages, but importing it into the homepage would undermine the strategy’s nontechnical commercial clarity.

### Review limitation

This was a source-based independent strategy review. It did not include a rendered browser audit, device-lab review, Lighthouse run or interaction test. Responsive and visual findings below are production-planning risks and acceptance requirements, not claims that rendered pages were tested in this review.

---

## 3. What is strategically strong

### 3.1 The before/after inquiry thesis is a real differentiator

The strongest strategic choice is the connection between:

- trust, positioning, service clarity and the first request before contact; and
- intake, routing, response, follow-up and operational control after contact.

This is more defensible than presenting ProAI Expert as either a generic web studio or a generic AI automation agency. It gives the two approved directions a shared business logic instead of treating them as unrelated services.

### 3.2 Two top-level directions are sufficient

`AI Systems & Automation` and `Premium Websites & Branding` are sufficient top-level categories. Adding a third top-level consulting, strategy, SEO, content or lead-generation direction would weaken comprehension. Strategy, architecture, content, localization and implementation should remain supporting capabilities nested under the two approved directions.

### 3.3 The internal 60/40 emphasis is handled correctly

The strategy correctly avoids showing public percentages. AI can lead the positioning while websites lead the visible proof. This is commercially rational because:

- AI and automation represent the intended strategic growth direction;
- websites currently provide clearer, more immediate and more visual proof;
- the homepage does not need to pretend the proof portfolio is already weighted the same way as the future business mix.

### 3.4 Financial Stream is correctly placed as flagship proof

Using Financial Stream early is justified. It is the strongest current proof because it combines:

- a real client relationship;
- a live EN/RU website;
- service and content architecture;
- structured inquiry paths;
- documented human-review boundaries;
- dated implementation and search evidence.

It supports both top-level directions without requiring inflated outcome claims.

### 3.5 Studio-first, founder-supported is the correct trust model

The strategy correctly avoids turning the homepage into a founder biography. The current About pages already provide substantial founder context. A compact homepage founder block can add accountability and local credibility without displacing the studio, systems or client proof.

### 3.6 The visual direction is disciplined

The proposed shift away from generic AI spectacle, excessive glow, decorative 3D and repeated equal cards is correct. The intended direction—dark ProAI identity, restrained cyan, stronger typography, proof-led editorial surfaces and one meaningful signature system—aligns with the canonical Premium Site Experience Standard.

### 3.7 Truth and localization are treated as architecture

The strategy correctly treats status, evidence and language parity as structural requirements rather than copy-polish tasks. This is especially important because the proof portfolio contains three different evidence classes:

- live independent client work;
- live related-party work;
- concept/in-development work.

---

## 4. Material commercial risks

| Risk | Severity | Why it matters |
|---|---:|---|
| Hero comprehension overload | High | The proposed 5–10 second test currently expects the Hero to communicate audience, three problems, two disciplines, the connecting thesis, differentiation and the next step. That is too much for one opening view. |
| Undefined `Private Review` promise | High | The phrase can imply a large free audit, confidential consulting engagement or formal diagnostic. The current Contact page does not resolve that ambiguity. |
| Long-page and catalogue drift | High | Eleven blocks, four engagement levels and seven process steps can make the homepage feel like an exhaustive service catalogue rather than a decisive commercial narrative. |
| Proof-status ambiguity | High | Alina’s related-party context and Local Repair Pro’s exact status need visible, consistent wording. Without it, proof can appear stronger or more independent than it is. |
| Unsupported outcome language | High | References to revenue, better leads, faster response or improved business outcomes can become causal claims unless explicitly framed as intended system effects rather than measured results. |
| Mobile signature-system density | High | Eight connected stages, arrows, labels and two operating halves can become an unreadable desktop diagram compressed onto mobile. |
| Contact-context loss | Medium–High | A homepage CTA can land on the existing form without preserving source page, source CTA, proof context or selected direction. This weakens both user continuity and later lead analysis. |
| Technical language leakage | Medium | Existing AI service pages use terms such as core logic, deployment form, routing conditions, knowledge indexing and operator dashboards. Similar language on the homepage would reduce owner-level comprehension. |
| Washington relevance dilution | Medium | The approved U.S.-wide audience is correct, but removing visible Washington context entirely would conflict with the acquisition plan’s immediate local-market priority. |
| Implementation fragility | Medium | Extending the existing include-plus-string-replacement homepage architecture for V2 would increase coupling and regression risk. |

One specific correction is required in the problem framing: `revenue friction` should not be used as a homepage problem category unless the page is only describing a general business concern and not implying measured revenue impact. `Trust friction`, `inquiry friction` and `operational friction` are safer and more directly supported by the repository.

---

## 5. Narrative and block-order review

### 5.1 Overall assessment

The proposed order is coherent, but it is one section too long at the top and too detailed in the middle. The core argument should remain, with one consolidation rather than a new strategy.

### 5.2 Recommended corrected order

1. **Hero** — audience, two connected directions, concise outcome and first step.
2. **Connected business journey** — merge the proposed problem block and signature-system block into one section: show where the journey breaks and how ProAI connects it.
3. **Two directions** — explain what each direction changes in plain business language.
4. **Financial Stream flagship proof** — live proof early, with one primary evidence story.
5. **Ways to Start** — entry logic based on the visitor’s situation, not package size.
6. **How the work is controlled** — a compressed four- or five-phase process.
7. **Founder accountability** — compact, local and role-specific.
8. **Selected Work** — Alina and Local Repair Pro, plus only a brief callback to Financial Stream.
9. **Selected Insights** — three decision-support articles.
10. **Final conversion** — one primary CTA with a clear expectation.

This is a targeted consolidation of Blocks 02 and 03, not a replacement strategy.

### 5.3 Block-level findings

#### Hero

Keep the proposed strategic direction, but reduce the amount the opening must prove. The Hero should answer only:

- who the company serves;
- what the two connected directions are;
- the primary business change;
- what the visitor can do next.

Detailed differentiation belongs in the connected-journey block immediately below.

#### Problem framing and connected system

The proposed problem block and eight-stage signature system currently repeat the same argument. Combining them will create a stronger signature section:

- top: three concise breakdown signals;
- middle: one connected before/after journey;
- bottom: one conclusion explaining why website and automation belong together.

The signature system must remain useful and understandable without animation.

#### Two directions

Keep this early. Each direction should use:

- one recognizable problem;
- one plain-language intervention;
- one practical result the system is designed to support;
- one contextual link to the deeper service page.

Do not reproduce the current service-page matrices on the homepage.

#### Financial Stream

Its early position is correct. The section should tell one evidence story, not summarize the entire 12-chapter case. Recommended emphasis:

- clearer service context before contact;
- structured inquiry before calendar;
- live EN/RU implementation;
- human-reviewed automation boundaries;
- one restrained dated evidence line where useful.

#### Ways to Start

The four proposed levels can remain only if each is framed by a recognizable starting condition. They must not read as hidden packages without prices.

Each item needs:

- `Best when...`
- the bounded first objective;
- what the item does not imply;
- the same primary review CTA or a contextual service link.

Avoid a card wall with four equally weighted offers.

#### How We Work

Seven homepage steps are excessive, particularly after a connected eight-stage journey. Compress to four or five phases, for example:

1. Review context.
2. Define priorities and boundaries.
3. Build the focused system.
4. Launch and verify.
5. Improve where evidence supports it.

Detailed methodology can remain on service and case pages.

#### Founder

Keep compact. It should establish:

- accountable founder leadership;
- Washington base;
- scope across strategy, AI systems, automation and website architecture;
- EN/RU/UA working capability where relevant.

It should not repeat the full About-page narrative.

#### Selected Work

Financial Stream has already received flagship treatment. In Selected Work it should appear only as a compact status row or not at all. Repeating the same screenshot, thesis and CTA would weaken the page.

#### Insights

Three articles are sufficient. Select articles that help a business owner make a buying or prioritization decision. Avoid turning the homepage into a content archive.

#### Final conversion

Keep one primary next step. Do not introduce a new service argument after the conclusion.

---

## 6. Service-architecture review

### Verdict

The two approved directions are sufficient and should remain locked.

### AI Systems & Automation

On the homepage this direction must remain understandable to a nontechnical owner. It should be framed around business situations such as:

- inquiries arrive through disconnected channels;
- context is lost between people and tools;
- follow-up depends on memory;
- repetitive admin consumes owner or team time;
- important exceptions need human review.

Homepage copy should avoid leading with:

- agents;
- orchestration;
- knowledge indexing;
- operator dashboards;
- deployment forms;
- scoring models;
- tool-stack diagrams;
- autonomous AI language.

Those terms may be appropriate deeper in the service page when explained in context.

Any result language should distinguish system capability from measured outcome. Prefer:

- `designed to support faster, more consistent response`;
- `creates a clearer handoff`;
- `reduces avoidable manual steps`;

rather than unqualified claims that the system `increases leads`, `improves conversion` or `raises revenue`.

### Premium Websites & Branding

This direction should remain centered on:

- clearer positioning;
- stronger trust before contact;
- useful service architecture;
- proof and content structure;
- multilingual experiences where justified;
- a better-prepared first inquiry.

Branding should remain nested within website and digital-presentation work. It should not become a third independent homepage direction.

The phrase `attracts better-quality inquiries`, which appears in current service-page positioning, is risky on the homepage unless framed as an intended design objective rather than an evidenced outcome.

### Supporting capabilities

The following should remain supporting capabilities, not top-level offers:

- strategy and architecture;
- multilingual planning;
- content structure;
- intake design;
- search-ready information architecture;
- human-review boundaries;
- integration and implementation;
- ongoing refinement.

`Ways to Start` is an engagement-entry model, not a third service taxonomy.

---

## 7. CTA review

### 7.1 Primary CTA: `Request a Private Review`

The CTA is strategically appropriate but currently underspecified.

Before production planning is approved, the strategy must define it as a bounded first-step service. Recommended default definition:

> A short, no-pressure review of the submitted business context to determine fit, identify the most important starting area and recommend the next useful step. It is not a complete audit, implementation plan, free consulting engagement or guaranteed proposal.

The owner must make one explicit internal decision before copy approval:

- **Recommended default:** a no-cost, bounded fit-and-priority review used for qualification;
- alternative: a paid diagnostic, which would require different public wording and a different Contact flow.

The homepage must not leave this unresolved.

### 7.2 Required expectation microcopy

Near the first primary CTA, state what happens next in one sentence. Example intent:

- submit a short context;
- ProAI reviews fit and priority;
- the response recommends the next step.

Do not promise a comprehensive analysis or fixed response time unless operationally guaranteed.

### 7.3 Contact-path consistency

The current Contact page says `Discuss Project` and asks for a short inquiry. That is compatible with a review process, but it is not the same product promise. Production planning must choose one coherent solution:

1. update the Contact-page entry context so `Private Review` is explicitly recognized; or
2. pass CTA context to the form and display a matching contextual lead-in.

At minimum preserve:

- language;
- source page;
- source CTA;
- selected direction, when known;
- source case or article, when relevant;
- referring URL or equivalent source context.

Use stable internal values across EN/RU even when public labels differ.

### 7.4 Secondary CTA: `View Client Work`

This is the correct secondary action. In the Hero it should preferably move the visitor to the homepage flagship proof rather than immediately sending them into a broad archive. The flagship section can then link to the complete Case Studies archive.

### 7.5 Section CTA discipline

Use the primary CTA only at meaningful qualification points:

- Hero;
- after proof or Ways to Start;
- final conversion.

Other sections should use contextual links such as:

- explore AI Systems;
- explore Websites & Branding;
- view the Financial Stream case;
- read the related guide.

Repeating the same primary CTA after every block would make the page feel promotional rather than controlled.

---

## 8. Proof and claims review

### 8.1 Financial Stream

Financial Stream is sufficient as flagship proof if the homepage stays within verified boundaries.

Safe proof categories include:

- real client project;
- live EN/RU website;
- verified service and content architecture;
- structured and short inquiry paths;
- calendar after context;
- human-reviewed capability boundaries;
- dated search evidence with an explicit limitation.

Dated search metrics may be used sparingly, but they must state:

- the reporting date or period;
- what the data demonstrates;
- that it does not establish lead, revenue, ROI or conversion impact.

Do not turn the homepage into a metrics dashboard. One restrained evidence line is sufficient.

Any owner testimonial requires confirmed permission, exact source wording and clear attribution. It should not be rewritten into a stronger outcome claim.

### 8.2 Alina Horb

The strategy correctly classifies Alina as a live related-party project, but the required public treatment must be made exact.

Recommended homepage disclosure intent:

> Live UA/RU project connected to the founder; presented as proof of strategy, production and localization quality, not as independent client validation.

Recommended Russian intent:

> Действующий UA/RU-проект, связанный с основателем; используется как подтверждение качества стратегии, реализации и локализации, а не как независимая клиентская рекомендация.

The disclosure must be visible in the Selected Work item or directly adjacent status text. It must not exist only in internal documentation or an inaccessible footnote.

### 8.3 Local Repair Pro

Select one canonical public taxonomy and use it across homepage, archive and case:

- `Website concept · live demo · in development`; or
- `Website case · in development`, with a separate `Live demo` action.

The first option is more explicit for the homepage because the demonstration is accessible while the business operation is not being claimed.

Never imply:

- an active client engagement;
- an operating local repair company;
- real customers, service coverage, reviews or outcomes.

### 8.4 Duplication control

- Financial Stream: full flagship proof once; compact callback only in Selected Work.
- Alina: one representative proof image and clear related-party status.
- Local Repair Pro: one representative proof image and concept/demo status.
- Do not reuse the same screenshot multiple times without a new evidentiary purpose.

### 8.5 Claim-language rules

Use four explicit public classes where applicable:

1. **Live client project**.
2. **Live related-party project**.
3. **Concept / live demo / in development**.
4. **Designed capability or intended effect**, not measured business outcome.

Remove or qualify any unverified statement involving:

- rankings;
- lead volume or lead quality;
- conversion improvement;
- response-speed improvement;
- revenue;
- ROI;
- autonomous AI operation.

---

## 9. Visual-direction review

### Verdict

The visual strategy is strong and compatible with the locked Header and Footer, subject to production constraints below.

### Preserve

- recognizable dark ProAI environment;
- restrained cyan as an identity and navigation signal;
- strong editorial typography;
- controlled surface transitions;
- real project screenshots;
- one meaningful signature system;
- compact founder photography;
- clear separation between evidence and decoration.

### Correct or constrain

1. The connected-journey signature system must work as a static composition first. Animation may reveal sequence, but it must not be necessary to understand the system.
2. Do not use an iframe-dependent hero or signature system as the only way the page communicates value.
3. Avoid a fake CRM, fake dashboard, invented counters, animated metrics or autonomous-agent theatre.
4. Reduce the number of major surface changes. The proposed surface map should create narrative chapters, not alternate colour treatments mechanically.
5. Prefer one large proof field over multiple equal screenshot cards.
6. Do not repeat the current site-wide pattern of large matrices and equal glass cards on the homepage.
7. Keep motion bounded, run once and removable through `prefers-reduced-motion`.
8. Set a performance budget before visual production. The Hero should preload only its true LCP asset; below-fold proof must use responsive images and declared dimensions.
9. Core positioning, proof, navigation and CTA must remain available without JavaScript.

### Locked Header and Footer integration

The V2 page must plan intentional handoffs into the existing Header and Footer. It should not require either component to be redesigned. Any visual concept that depends on changing their information architecture is out of scope.

---

## 10. Responsive review

### 10.1 Primary responsive risk

The eight-stage journey is the highest-risk component. A desktop flow such as:

`Positioning → Website → Inquiry → Intake → Routing → Response → Follow-up → Improvement`

must not become a horizontally scrollable miniature diagram on mobile.

Required mobile transformation:

- group the stages into two clearly labelled phases—`Before inquiry` and `After inquiry`;
- reduce the visible system to four grouped steps or two stacked lanes;
- use short labels and one-line explanations;
- remove decorative connectors that create overflow;
- preserve the full meaning in accessible text;
- keep the sequence understandable without animation.

### 10.2 Viewport-specific requirements

| Viewport | Required treatment |
|---|---|
| Large desktop | Editorial asymmetry is acceptable, but cap line length and prevent the flow from becoming a wide systems poster. |
| Laptop | Reduce side-by-side density; screenshots and copy must remain readable without browser zoom. |
| Tablet | Recompose major two-column blocks into ordered stacks. Do not simply shrink desktop cards. |
| Phone portrait | Copy and primary CTA first; visual proof next; signature system transformed into grouped vertical logic. |
| Phone landscape / low height | No sticky narrative panels, oversized hero minimum heights or essential scroll-triggered states. Use a compact static composition. |
| 320 px | No horizontal chips, fixed-width cards, `white-space: nowrap`, clipped Russian headings or miniature screenshots. All primary controls remain at least practical touch size. |

### 10.3 Section-specific risks

#### Hero

- Do not let a decorative visual push both CTAs below the first meaningful viewport.
- Russian copy will likely require more vertical space than English.
- Avoid forced one-line title spans.

#### Ways to Start

- Four equal desktop cards would create an overly long mobile stack.
- Prefer a numbered editorial list, controlled comparison row or progressive disclosure with all content still accessible.

#### Process

- Seven steps plus an eight-stage signature system is redundant and mobile-heavy.
- Compress to four or five phases.

#### Proof

- Use real responsive screenshot variants.
- Captions must remain readable and status must not disappear on narrow mobile.

#### Founder

- Keep the portrait secondary to the role and accountability copy.
- Avoid large empty minimum heights.

### 10.4 Mandatory production checks

Before implementation approval, the production specification must include explicit checks at:

- 430 px;
- 390 px;
- 375 px;
- 360 px;
- 320 px;
- representative tablet portrait and landscape;
- short phone landscape around 540 px height.

Acceptance requires no horizontal overflow, no inaccessible content, no CTA collision, no status loss and no content dependency on motion or JavaScript.

---

## 11. EN/RU review

### 11.1 Parity principle

EN/RU parity should mean equal business intent, proof quality, decision path and next-step clarity—not matching sentence length or literal syntax.

The two versions should share:

- block order;
- service hierarchy;
- evidence class and project status;
- CTA function;
- destination and context preservation;
- form and success-state behavior;
- responsive priority.

### 11.2 Recommended Russian terminology

| EN intent | Recommended RU direction |
|---|---|
| AI Systems & Automation | `AI-системы и автоматизация` |
| Premium Websites & Branding | `Премиальные сайты и брендинг` |
| Before inquiry | `До обращения` |
| After inquiry | `После обращения` |
| Request a Private Review | `Запросить первичный разбор` |
| View Client Work | `Смотреть клиентские проекты` |
| Ways to Start | `Форматы первого шага` or `С чего можно начать` |
| Human review | `Проверка человеком` or `Решение остаётся за человеком`, depending on context |

Do not translate `Private Review` literally as `приватный обзор`, `закрытый обзор` or another unnatural phrase. Confidential handling can be explained in nearby microcopy; the CTA itself should remain clear and natural.

### 11.3 Russian composition risks

Avoid importing mixed-language terminology already visible on some current service pages, including:

- `intake-слой`;
- `follow-up`;
- `digital подача`;
- `Headline`;
- unexplained `routing` or `deployment` language.

Use natural Russian equivalents based on the business situation.

### 11.4 Hero localization

The English H1 direction can remain:

`Build trust. Handle inquiries. Reduce manual work.`

A natural Russian composition can preserve the intent without copying English rhythm mechanically:

`Выстраиваем доверие. Наводим порядок в обращениях. Сокращаем ручную работу.`

This is a copy direction, not final approved production copy. It must be tested in the real layout without forced no-wrap spans.

### 11.5 Line expansion and layout

Plan for materially longer Russian labels and paragraphs. In particular:

- CTA buttons must allow wrapping or sufficient width;
- signature-system labels must stay short;
- proof disclosures must remain visible;
- headings must not rely on English-specific line breaks;
- mobile layouts must be tested separately rather than assumed from EN.

### 11.6 Machine-value parity

Public form labels should be localized, but internal direction/source values should use stable canonical identifiers. This prevents EN/RU analytics and lead routing from fragmenting into separate unnormalized values.

---

## 12. Exact targeted corrections

The following corrections are required before Homepage V2 can move into detailed production specification.

| Priority | Required correction | Acceptance test |
|---|---|---|
| P0 | Define `Private Review` as a bounded service and decide whether it is no-cost qualification or a paid diagnostic. | A visitor can state what they submit, what ProAI does next and what is not included. |
| P0 | Align the Homepage CTA with the Contact experience. | CTA source, language and selected direction survive the transition; Contact copy recognizes the review request. |
| P0 | Merge proposed Blocks 02 and 03 into one connected-journey/signature section. | The page does not explain the same before/after problem twice. |
| P0 | Reduce Hero responsibility. | In 5–10 seconds the visitor can identify audience, two connected directions, primary outcome and first step without reading a dense paragraph. |
| P0 | Remove or qualify revenue, leads, conversion, response-speed and ROI language. | Every business-effect statement is either sourced, dated and limited or clearly framed as design/system intent. |
| P0 | Publish exact proof-status labels. | Financial Stream = live client; Alina = live related-party with visible disclosure; Local Repair Pro = concept/demo/in development. |
| P0 | Resolve the eight-stage mobile transformation in the strategy/spec. | At 320 px the full concept is understandable without horizontal scrolling, tiny text or animation dependency. |
| P0 | Produce independent EN and RU copy sets for Hero, CTA, signature system, proof statuses and final close. | RU reads naturally and preserves the same business intent without mixed terminology or forced English line breaks. |
| P0 | Define the V2 implementation architecture before coding. | Broad V2 sections are not added through another layer of fragile `replace_first` string replacements; the current snapshot remains recoverable. |
| P1 | Reframe Ways to Start around visitor situations rather than package size. | Each entry has a clear `best when`, bounded objective and no hidden-price/package implication. |
| P1 | Compress How We Work from seven steps to four or five homepage phases. | Method remains credible without duplicating the signature journey or creating an excessive mobile stack. |
| P1 | Prevent Financial Stream duplication. | One flagship treatment; Selected Work uses only a compact callback or omits the duplicate item. |
| P1 | Surface Washington credibility without limiting the U.S. audience. | The page communicates Washington-based accountability/local relevance while remaining available to U.S. service businesses. |
| P1 | Lock one Local Repair Pro status taxonomy across homepage, archive and case. | No route alternates ambiguously among client case, concept, live business and demo. |
| P1 | Add visual and performance budgets to the production specification. | Static-first signature system, responsive image plan, no-JS baseline, reduced motion and LCP/CLS constraints are explicit. |

### Required pre-production deliverable

The next strategy revision should be a focused V1.1 correction or production-spec handoff that resolves the table above. It should not reopen the locked audience, top-level directions, 60/40 internal emphasis, studio/founder model, CTA names, no-price decision, Header/Footer scope or proof priority.

---

## 13. Final readiness status

### Current status

**Approved for targeted strategy correction. Not approved for homepage implementation yet.**

The strategy has a credible commercial foundation, differentiated positioning and an appropriate proof model. No fundamental strategic defect justifies rejection. Implementation should remain blocked until all P0 corrections are resolved and documented.

### Ready after correction when

- the Hero is reduced to a clear first-decision layer;
- the connected journey is one non-duplicative signature system;
- `Private Review` has a bounded operational definition and matching Contact path;
- proof statuses and claim boundaries are exact;
- mobile recomposition is specified through 320 px and phone landscape;
- EN/RU copy is independently composed and parity-checked;
- the production architecture avoids extending the current string-replacement wrapper pattern into V2.

After those corrections, the strategy can proceed to a detailed production specification and a separate implementation task. No additional top-level strategy or full-site redesign is required.

Independent Homepage V2 strategy review complete. No production files were changed.