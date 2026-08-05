# ProAI Expert Site Evolution Roadmap V1

**Статус:** current program-level roadmap  
**Первоначально подготовлен:** 2026-07-24  
**Обновлено:** 2026-08-04  
**Завершённая программа:** `PORTFOLIO MASTER POLISH V1`  
**Следующая программа:** `PROAI EXPERT SITE EXPERIENCE V2`

---

## 1. Назначение и authority

Этот roadmap определяет порядок крупных website workstreams, dependencies, acceptance gates и stop rules.

Он не является:

- commercial master plan;
- page-level implementation specification;
- разрешением менять production;
- заменой Header/Footer specs;
- заменой portfolio evidence records.

Authority order для Site V2:

1. current `main`, live verification и active PR scope;
2. `AI_CURRENT_HANDOFF.md` — operational state;
3. `docs/CLIENT_ACQUISITION_SOCIAL_AND_SALES_PLAN.md` — commercial intent, ICP, offers и pricing;
4. будущий `PROAI_EXPERT_SITE_V2_COMMERCIAL_ALIGNMENT_SPEC.md` — page-level implementation authority;
5. этот roadmap — sequence, dependencies и gates;
6. component/evidence/quality authorities в своих scopes.

При конфликте этот roadmap не может переопределять commercial plan, current production facts или approved evidence boundaries.

---

## 2. Завершённая программа — Portfolio Master Polish V1

Portfolio Master Polish V1 завершён.

В production опубликованы:

- EN/RU Case Studies archive;
- Financial Stream case pair;
- Alina Horb case pair;
- Local Repair Pro case pair;
- cross-case navigation;
- service/contact transitions;
- distinct case art directions;
- truthful live/related-party/concept evidence boundaries;
- centralized Header/Footer integration;
- responsive, reduced-motion, accessibility и no-JS safeguards в реализованном scope.

Завершённые pre-implementation master plans, synthesis и blueprints сохраняются как historical records и не управляют новой программой.

Не открывать Portfolio Master Polish заново без конкретного production defect, нового evidence package или owner-approved case-specific task.

---

## 3. Текущая переходная фаза — Documentation Reconciliation

Перед созданием Site V2 implementation authority необходимо:

1. оставить `AI_CURRENT_HANDOFF.md` единственным current operational handoff;
2. удалить current-authority статус у завершённых Phase A и portfolio planning docs;
3. исправить branch-only и отсутствующие references;
4. обновить portfolio route/evidence ownership;
5. связать Site V2 с canonical commercial plan;
6. не затрагивать production HTML/CSS/JS;
7. не конфликтовать с активными Header/Footer PR.

Gate:

- один current operational handoff;
- нет current ссылок на отсутствующие branch-only документы;
- historical documents имеют явный tombstone status;
- current authority chain понятна свежему AI-чату без чтения старых разговоров.

---

## 4. Следующий обязательный документ — Site V2 Commercial Alignment Spec

До wireframes, design или implementation должен быть отдельно создан и одобрен:

`docs/site-evolution/PROAI_EXPERT_SITE_V2_COMMERCIAL_ALIGNMENT_SPEC.md`

Он должен стать единственным Site V2 implementation authority для:

- information architecture и routes;
- homepage commercial sequence;
- Hero acceptance criteria;
- Websites, Branding & Offer Clarity, AI & Automation;
- entry-offer pages/surfaces;
- navigation click depth;
- CTA taxonomy;
- contact routing и source attribution;
- portfolio/service/offer integration;
- commercial copy acceptance;
- conversion measurement;
- route-level EN/RU, responsive, accessibility, performance, SEO и no-JS requirements;
- prototype, review и controlled-launch gates.

Spec не должен создавать новый commercial strategy или переименовывать approved offers без отдельного revision canonical commercial plan.

---

## 5. Site V2 commercial model

### 5.1 One umbrella thesis

ProAI Expert улучшает trust, clarity, inquiry flow и lead response для service businesses.

Technology, AI, automation и design являются methods of implementation, а не самостоятельным opening promise.

### 5.2 Three capability pillars

Site V2 должен объяснить три связанных, но различимых направления:

1. **Websites** — trust, information architecture, bilingual content, responsive production и conversion paths.
2. **Branding & Offer Clarity** — audience, differentiation, message hierarchy, identity и sales-use clarity.
3. **AI & Automation** — acknowledgement, structured intake, routing, logging, reminders и human-reviewed assistance.

Связь:

`Branding clarifies the message → Website turns it into trust and action → Automation improves what happens after inquiry.`

Это не обязательная линейная покупка. Каждый capability и entry offer может быть самостоятельным controlled project.

### 5.3 Locked entry offers

- Website Trust & Conversion Sprint;
- Lead Response Automation Sprint;
- Brand & Offer Clarity Sprint.

`Lead Fix Sprint` остаётся deprecated.

---

## 6. Program sequence

### Phase 1 — Documentation reconciliation

Docs-only authority cleanup. No production changes.

### Phase 2 — Commercial Alignment Spec

Создание final page-level requirements и acceptance matrix. No production changes.

### Phase 3 — Information architecture

Утвердить:

- EN/RU route map;
- preserved routes;
- proposed offer routes;
- Websites/Branding hub decision;
- click-depth matrix;
- canonical/hreflang/x-default/sitemap ownership;
- ProAI Expert Studio Case route decision.

### Phase 4 — Homepage wireframe and content architecture

Обязательная sequence:

1. Hero;
2. recognizable business problems;
3. connected capability architecture;
4. entry offers;
5. selected proof;
6. process;
7. trust and boundaries;
8. relevant Insights;
9. final CTA.

Insights не должны прерывать путь между problem, offer, proof и main action.

### Phase 5 — Service and entry-offer architecture

Для каждого capability/offer определить:

- audience;
- problem;
- outcome;
- scope;
- exclusions;
- timeline;
- pricing/qualification guidance;
- client responsibilities;
- relevant proof;
- CTA;
- next offer-ladder step.

### Phase 6 — Contact and CTA architecture

Утвердить:

- Request Website Review;
- Request Automation Review;
- Request Brand & Offer Review;
- Discuss a Project;
- General Contact fallback;
- calendar rules;
- context collection;
- source page, language, selected service и selected offer attribution;
- success/failure states;
- friction limits.

`Context before calendar` остаётся обязательным принципом.

### Phase 7 — Visual direction

Определить coherent premium ProAI system без стилистической унификации всех page worlds.

Design должен усиливать:

- clarity;
- hierarchy;
- trust;
- proof;
- perceived expertise;
- mobile usability;
- conversion.

Не использовать visual effects ради эффекта.

### Phase 8 — Prototype

Минимальный controlled prototype:

- homepage;
- one capability page;
- one entry-offer page;
- contact/CTA flow;
- EN/RU content behavior where material;
- desktop, tablet, portrait, landscape, reduced-motion и no-JS states.

### Phase 9 — Independent review

Свежий Reviewer проверяет actual rendered prototype и diff.

Verdict:

- `ACCEPT`;
- `TARGETED CORRECTION`;
- `REJECT`.

### Phase 10 — EN/RU production

Только после prototype approval.

- natural localization;
- exact intent parity;
- isolated branch/file scope;
- no unrelated refactor;
- protected Header/Footer/component ownership.

### Phase 11 — Accessibility, performance, SEO and reliability QA

Проверить:

- keyboard and visible focus;
- headings/landmarks;
- contrast, zoom и touch targets;
- reduced motion, forced colors и no-JS;
- narrow portrait и low-height landscape;
- no overflow;
- LCP, CLS и interaction performance;
- responsive images, fonts, CSS/JS и third-party budgets;
- form normal/failure states;
- canonical, hreflang, x-default, metadata, sitemap и structured data;
- analytics event validation;
- live-source/cache verification.

### Phase 12 — Controlled launch

- final approved PR;
- recorded base/head SHAs;
- production deployment verification;
- route/form/event smoke tests;
- rollback point;
- post-launch review without immediate feature expansion.

---

## 7. Homepage and Hero requirements

### Homepage objectives

- lead with a recognizable business problem and concrete improvement;
- present one coherent studio thesis;
- make the three capability pillars understandable without catalogue overload;
- make entry offers buyable and linkable;
- move truthful proof earlier;
- connect proof to relevant service/offer;
- preserve concise production/process explanation;
- end with one structured next step.

Do not turn the homepage into:

- a duplicate Case Studies archive;
- a technology-logo showcase;
- a catalogue of unrelated services;
- an internal methodology manual;
- a long AI-first narrative.

### Hero acceptance baseline

Hero must communicate within one first-screen experience:

1. service-business audience;
2. one recognizable commercial friction;
3. one dominant outcome;
4. one truthful proof or trust signal near the fold;
5. one primary CTA;
6. technology as method, not value proposition;
7. natural EN/RU intent parity;
8. mobile order: message → proof/trust → CTA.

Final copy and layout remain subject to the future spec and prototype review.

---

## 8. Proof network

Required relationships:

- homepage positioning → selected proof/archive;
- capability → relevant case chapter;
- entry offer → relevant proof;
- case → relevant capability/offer/contact;
- article thesis → relevant case or offer only when genuinely related;
- live implementation fact → dated source/evidence;
- AI capability → human-review and failure boundary.

Rules:

- no duplicated full narratives;
- canonical ownership for each proof item;
- concise contextual teasers outside the case;
- clear live/implemented/tested/partial/planned/concept labels;
- related-party context where commercially material;
- no unsupported outcome language;
- no raw sensitive operational data.

---

## 9. Contact and measurement

### Contact

- context before calendar;
- concise required fields;
- optional depth only when operationally useful;
- accessible single-page or progressive flow;
- preserved service/offer/source/language context;
- privacy and response-time expectations;
- direct fallback contact;
- no hidden required fields;
- no animation that blocks submission;
- no Typeform-like pattern without accessible fallback.

### Measurement

Future spec must define events and dimensions for:

- primary CTA;
- offer CTA;
- case-to-service/contact;
- form start/success/error;
- selected service/offer;
- source page/campaign;
- language;
- calendar click/confirmed booking where verifiable;
- CRM-qualified inquiry and downstream commercial states.

Do not publish conversion claims merely because events are implemented.

---

## 10. Insights evolution

Objectives:

- organize methodology clusters;
- connect articles to services, offers and cases contextually;
- preserve EN/RU editorial quality;
- avoid mechanical translation;
- improve discovery without empty taxonomies;
- keep commercial path primary on homepage and service pages.

Potential clusters:

- AI systems and automation;
- website strategy;
- trust and conversion;
- bilingual search architecture;
- local-service websites;
- operational design;
- responsible AI implementation.

---

## 11. Global Studio Shell

Current Header and Footer systems remain separately governed.

Site V2 may specify route and CTA behavior but must not casually replace:

- primary navigation contracts;
- mobile-menu behavior;
- context-preserving language switch;
- shared focus states;
- Footer family ownership;
- shared reduced-motion/no-JS behavior.

Any component architecture change requires its own scoped task and conflict check against active PR.

---

## 12. Bilingual system consistency

Every Site V2 route requires:

- exact intent mapping;
- natural EN/RU localization;
- truthful UA/RU statements for client projects;
- localized navigation and CTA;
- canonical, reciprocal hreflang и x-default;
- sitemap inclusion where indexable;
- form/validation/success parity;
- screenshot and proof-language accuracy;
- mobile parity;
- no redirect from missing translation to unrelated homepage.

---

## 13. Motion, responsive, accessibility and performance

Reusable quality authority:

`docs/website-production-factory/PREMIUM_SITE_EXPERIENCE_STANDARD.md`

Site V2-specific requirements:

- one meaningful signature system per page family where justified;
- deliberate responsive recomposition;
- bounded sticky behavior;
- no scroll-jacking, particle fields, cursor trails or continuous parallax;
- complete reduced-motion and no-JS states;
- defined route-level LCP element and asset budget;
- no horizontal overflow;
- real rendered QA, not source-only validation.

---

## 14. Future ProAI Expert Studio Case

Historical ProAI Expert Studio Case routes are not part of the currently confirmed three-case production architecture.

Before any restoration, replacement, redirect or publication decision, determine:

- distinct commercial purpose;
- truthful scope;
- whether it adds proof beyond the public website itself;
- route and EN/RU policy;
- relationship to external/client proof;
- whether the effort is higher priority than obtaining independent client evidence.

Do not restore old routes solely because historical documents listed them.

---

## 15. Dependencies before production

1. documentation reconciliation merged;
2. current main/open PR verification;
3. Commercial Alignment Spec approved;
4. route/IA decisions approved;
5. content and claims verified;
6. assets and permissions approved;
7. prototype approved;
8. responsive/accessibility/performance plans defined;
9. measurement and privacy contracts defined;
10. branch/file scope isolated;
11. independent review complete.

Do not combine all phases into one giant implementation task.

---

## 16. Stop rules

Do not start or merge Site V2 production work without:

- explicit owner approval;
- current baseline verification;
- approved Commercial Alignment Spec;
- approved phase-specific scope;
- exact EN/RU routes;
- verified content and claims;
- asset approval;
- CTA/contact matrix;
- measurement contract;
- responsive plan;
- accessibility plan;
- performance budget;
- rendered visual review;
- final QA;
- confirmation that unrelated refactors and active-PR conflicts are absent.

Этот roadmap хранит порядок программы. Он не разрешает implementation сам по себе.