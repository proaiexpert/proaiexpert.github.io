# PROAI EXPERT HOMEPAGE V2 — CONTENT ARCHITECTURE V1

**Status:** Corrected content architecture candidate for focused correction review  
**Version:** V1.1  
**Date:** 2026-08-05  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Branch:** `agent/homepage-v2-content-architecture`  
**Branch base:** `main` at `7bcc09ae28388f8e4a5e6e5a715aa5ba7b3fbf50`  
**Scope:** Complete EN/RU Homepage V2 content architecture, metadata contract, CTA/link identifiers, proof map, responsive order and future Jekyll data ownership  
**Production code authorization:** none  
**Homepage production PR authorization:** none

---

# 0. AUTHORITY AND PURPOSE

This document converts the approved Homepage V2 strategy and implementation contract into a complete full-page content system.

It is authoritative for the current content-review phase only.

It does not authorize:

- Homepage source changes;
- Contact source changes;
- Header or Footer changes;
- CSS, YAML or JavaScript production;
- image generation or publication;
- partial Hero publication;
- EN-only publication;
- a Homepage production PR;
- low-fidelity page-map production before focused correction review acceptance.

The independent Content Architecture V1 review returned `TARGETED CORRECTION`. Corrections 1–7 are incorporated in this V1.1 document. The next gate is one focused correction review. Only after an `ACCEPT` verdict may this document become the input for a low-fidelity full-page map and visual concept comparison.

Canonical strategic authorities:

- `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_STRATEGY.md`;
- `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_PRODUCTION_SPEC.md`;
- `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_IMPLEMENTATION_CONTRACT.md`.

The Contact prerequisite is already merged and verified in production through PR #98.

---

# 1. LOCKED PAGE JOB

The Homepage must help a U.S. service-business owner understand, in one controlled journey:

1. what ProAI Expert improves;
2. why websites and automation belong together;
3. which of the two main directions is relevant;
4. what real evidence supports the work;
5. what bounded next step is available.

The Homepage must not become:

- a full service catalogue;
- a pricing page;
- a technical architecture manual;
- a generic AI agency page;
- a conventional web-design portfolio;
- a founder biography;
- a collection of equal glass cards;
- a sequence of unsupported outcome claims.

---

# 2. CENTRAL MESSAGE

## EN

> ProAI Expert builds the digital systems that help service businesses earn trust, handle inquiries, and operate with less manual work.

## RU

> ProAI Expert создаёт цифровые системы, которые помогают сервисному бизнесу выстраивать доверие, обрабатывать обращения и сокращать ручную работу.

## Narrative principle

**Before the inquiry:** positioning, website clarity, proof, trust and the first action.

**After the inquiry:** structured context, notification, routing, response support, follow-up and operational control.

The Homepage demonstrates that these are not separate problems. They are one customer-and-operations journey.

---

# 3. PAGE-LEVEL CONVERSION MODEL

## Primary conversion

### EN

`Request a Private Review`

### RU

`Запросить первичный разбор`

The Private Review is a no-cost, bounded fit-and-priority review. It is not a complete audit, implementation plan or free consulting engagement.

## Secondary conversion

### EN

`View Client Work`

### RU

`Смотреть клиентские проекты`

The Hero secondary CTA scrolls to the Financial Stream flagship proof on the same page.

## Deep-navigation conversions

- AI Systems & Automation service page;
- Websites & Branding service page;
- Financial Stream case;
- Alina Horb case;
- Local Repair Pro case;
- selected Insights articles;
- About;
- LinkedIn.

No price appears on the Homepage.

---

# 4. EXACT CONTACT URL CONTRACTS

These URLs work without Homepage JavaScript and are already compatible with the merged Contact prerequisite.

## Hero

EN:

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_hero#project-intake
```

RU:

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_hero#project-intake
```

## Ways to Start — Websites & Branding

EN:

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=websites_branding#project-intake
```

RU:

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=websites_branding#project-intake
```

## Ways to Start — AI Systems & Automation

EN:

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=ai_systems_automation#project-intake
```

RU:

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=ai_systems_automation#project-intake
```

## Ways to Start — Combined System

EN:

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=both#project-intake
```

RU:

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=both#project-intake
```

## Final conversion

EN:

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_final#project-intake
```

RU:

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_final#project-intake
```

## Contact query allowlist boundary

Only these production Contact machine values may appear in Contact query parameters:

```text
intent=private_review | project_inquiry
source_page=homepage | contact
source_cta=homepage_hero | homepage_ways_to_start | homepage_final | direct_contact
selected_direction=ai_systems_automation | websites_branding | both | not_sure
```

Internal Homepage action IDs, section-origin IDs, project IDs and article IDs defined below must never be passed as unsupported Contact query parameters.

---

# 4A. COMPLETE EN/RU META CONTRACT

The future localized `meta` object is not optional. EN and RU must contain the same keys, explicit absolute URLs and independently reviewed localized copy.

## Required keys

```text
title
description
canonical
locale_url
alternate_en
alternate_ru
x_default
og_title
og_description
og_url
og_image
og_image_alt
twitter_title
twitter_description
twitter_image
twitter_image_alt
```

The implementation may additionally expose stable presentational fields such as `og_locale`, `og_type`, `og_site_name` and `twitter_card`, but the required keys above must remain present in both locale files.

## EN metadata candidate

```yaml
title: "ProAI Expert | AI Systems, Automation & Premium Websites"
description: "AI systems, automation, websites, and branding for service businesses that need less manual work, stronger trust, and better control over how work and inquiries move."
canonical: "https://proai-expert.com/"
locale_url: "https://proai-expert.com/ru/"
alternate_en: "https://proai-expert.com/"
alternate_ru: "https://proai-expert.com/ru/"
x_default: "https://proai-expert.com/"
og_title: "ProAI Expert | AI Systems, Automation & Premium Websites"
og_description: "AI systems, automation, websites, and branding for service businesses that need less manual work, stronger trust, and better control over how work and inquiries move."
og_url: "https://proai-expert.com/"
og_image: "https://proai-expert.com/screenshots/proai-home-en-desktop.png"
og_image_alt: "ProAI Expert homepage preview"
twitter_title: "ProAI Expert | AI Systems, Automation & Premium Websites"
twitter_description: "AI systems, automation, websites, and branding for service businesses that need less manual work, stronger trust, and better control over how work and inquiries move."
twitter_image: "https://proai-expert.com/screenshots/proai-home-en-desktop.png"
twitter_image_alt: "ProAI Expert homepage preview"
```

## RU metadata candidate

```yaml
title: "ProAI Expert | AI-системы, автоматизация бизнеса, сайты и брендинг"
description: "AI-системы, автоматизация бизнеса, сайты и брендинг для сервисных компаний в США — чтобы сократить ручную работу, усилить доверие и лучше контролировать путь обращения."
canonical: "https://proai-expert.com/ru/"
locale_url: "https://proai-expert.com/"
alternate_en: "https://proai-expert.com/"
alternate_ru: "https://proai-expert.com/ru/"
x_default: "https://proai-expert.com/"
og_title: "ProAI Expert | AI-системы, автоматизация бизнеса, сайты и брендинг"
og_description: "AI-системы, автоматизация бизнеса, сайты и брендинг для сервисных компаний в США — чтобы сократить ручную работу, усилить доверие и лучше контролировать путь обращения."
og_url: "https://proai-expert.com/ru/"
og_image: "https://proai-expert.com/screenshots/proai-home-ru-desktop.png"
og_image_alt: "Превью главной страницы ProAI Expert"
twitter_title: "ProAI Expert | AI-системы, автоматизация бизнеса, сайты и брендинг"
twitter_description: "AI-системы, автоматизация бизнеса, сайты и брендинг для сервисных компаний в США — чтобы сократить ручную работу, усилить доверие и лучше контролировать путь обращения."
twitter_image: "https://proai-expert.com/screenshots/proai-home-ru-desktop.png"
twitter_image_alt: "Превью главной страницы ProAI Expert"
```

## Metadata image boundary

The current absolute screenshot URLs are verified fallback assets already referenced by the existing Homepage metadata. They may remain until a V2-specific social preview is separately designed, reviewed and approved. Replacing either image requires an explicit asset path, dimensions, crop role, localized alt text and generated-output verification. No new social image is authorized by this content correction.

---

# 4B. CTA AND LINK IDENTIFIER MAP

Three identifier layers must remain separate:

1. `action_id` — what the visitor is doing;
2. `origin_id` — which Homepage block generated the action;
3. Contact query values — only the production allowlist defined in Section 4.

## Stable section-origin IDs

```text
homepage_hero
homepage_directions
homepage_flagship_proof
homepage_ways_to_start
homepage_founder
homepage_selected_work
homepage_insights
homepage_final
```

## Stable action and item IDs

```text
request_private_review
view_client_work
explore_ai_systems
explore_websites_branding
view_financial_stream_case
visit_financial_stream_site
view_about
view_linkedin
view_all_case_studies
view_all_insights
financial_stream
alina_horb
local_repair_pro
multilingual_website
website_proposal
lead_arrival
```

## Exact action map

| Location | `action_id` / item ID | `origin_id` | Destination | Contact query behavior |
|---|---|---|---|---|
| Hero primary | `request_private_review` | `homepage_hero` | localized Contact URL | uses `source_cta=homepage_hero`; no selected direction |
| Hero secondary | `view_client_work` | `homepage_hero` | `#client-work` | no Contact query |
| AI direction | `explore_ai_systems` | `homepage_directions` | localized AI Systems route | no Contact query |
| Website direction | `explore_websites_branding` | `homepage_directions` | localized Websites & Branding route | no Contact query |
| Financial Stream case | `view_financial_stream_case` + item `financial_stream` | `homepage_flagship_proof` | localized case route | no Contact query |
| Financial Stream live site | `visit_financial_stream_site` + item `financial_stream` | `homepage_flagship_proof` | external live site | no Contact query |
| Ways review CTA | `request_private_review` | `homepage_ways_to_start` | localized Contact URL | uses `source_cta=homepage_ways_to_start` plus approved `selected_direction` |
| Ways service links | `explore_ai_systems` and/or `explore_websites_branding` | `homepage_ways_to_start` | localized service routes | no Contact query |
| Founder About | `view_about` | `homepage_founder` | localized About route | no Contact query |
| Founder LinkedIn | `view_linkedin` | `homepage_founder` | external LinkedIn URL | no Contact query |
| Selected Work case/demo links | project item ID plus explicit link action | `homepage_selected_work` | localized case/live route | no Contact query |
| Insight article | article item ID | `homepage_insights` | explicit localized article route | no Contact query |
| Final primary | `request_private_review` | `homepage_final` | localized Contact URL | uses `source_cta=homepage_final`; no selected direction |

Project and article item IDs identify content objects. They are not substitutions for `action_id`, `origin_id` or Contact `source_cta`.

---

# 5. TEN-BLOCK PAGE MAP

The DOM and reading order are fixed:

1. `hero`;
2. `connected-journey`;
3. `directions`;
4. `client-work`;
5. `ways-to-start`;
6. `process`;
7. `founder`;
8. `selected-work`;
9. `insights`;
10. `private-review`.

The same ten-block order applies to EN and RU.

---

# 6. BLOCK 01 — HERO

## Business function

- identify the audience;
- state the main business result;
- name the connected capabilities without turning them into a catalogue;
- establish a controlled first action;
- create immediate confidence that this is a serious U.S.-based studio, not an AI novelty page.

## EN production-copy candidate

**Eyebrow**

```text
AI SYSTEMS, AUTOMATION & PREMIUM WEBSITES FOR SERVICE BUSINESSES
```

**H1**

```text
Build trust. Handle inquiries. Reduce manual work.
```

**Supporting copy**

```text
ProAI Expert connects premium websites, practical automation, and human-reviewed AI so service businesses can explain their value clearly, capture useful context, and move each inquiry toward a controlled next step.
```

**Primary CTA**

```text
Request a Private Review
```

**Primary CTA expectation copy**

```text
Share a short description of the business and the main friction. We will review fit, identify the priority, and recommend the next useful step.
```

**Secondary CTA**

```text
View Client Work
```

**Accountability line**

```text
Washington-based · Working across the U.S. · EN / RU / UA
```

## RU production-copy candidate

**Eyebrow**

```text
AI-СИСТЕМЫ, АВТОМАТИЗАЦИЯ И ПРЕМИАЛЬНЫЕ САЙТЫ ДЛЯ СЕРВИСНОГО БИЗНЕСА
```

**H1**

```text
Выстраиваем доверие. Наводим порядок в обращениях. Сокращаем ручную работу.
```

**Supporting copy**

```text
ProAI Expert объединяет премиальный сайт, практическую автоматизацию и AI с проверкой человеком, чтобы клиент быстрее понимал ценность бизнеса, оставлял полезный контекст, а каждое обращение переходило к понятному следующему шагу.
```

**Primary CTA**

```text
Запросить первичный разбор
```

**Primary CTA expectation copy**

```text
Коротко опишите бизнес и основную проблему. Мы оценим соответствие, определим приоритет и предложим следующий полезный шаг.
```

**Secondary CTA**

```text
Смотреть клиентские проекты
```

**Accountability line**

```text
Штат Вашингтон · Работаем по всей территории США · EN / RU / UA
```

## Composition contract

Desktop:

- left: text hierarchy and CTAs;
- right: restrained connected-system tableau using semantic HTML and CSS, not a fake dashboard;
- visual states: `Trust`, `Inquiry`, `Response`, `Follow-up`;
- no decorative 3D model;
- no rotating object;
- no technology-logo wall.

Mobile:

- copy first;
- primary CTA immediately after supporting copy;
- expectation copy immediately below primary CTA;
- secondary CTA after expectation copy;
- accountability line remains visible;
- system tableau reduces to a compact four-state strip or may move below the CTA group;
- no minimum-height requirement that creates a tall empty Hero.

## RU Hero provisional acceptance gate

The current RU eyebrow, H1 and supporting-copy combination remains provisional until the low-fidelity stage is authorized and demonstrates the real first-screen hierarchy at:

- 390 px portrait;
- 320 px portrait;
- approximately 844 × 390 short landscape.

The RU Hero may be shortened only if those maps demonstrate that the current composition delays the primary CTA, lets the eyebrow dominate the opening or creates an excessively long first-screen sequence. This gate does not authorize shortening now, changing the EN Hero, reordering Hero elements or beginning the low-fidelity map before focused correction review acceptance.

## Interaction and accessibility

- one H1 only;
- Hero content visible without JavaScript;
- system tableau is supplementary and does not contain unique essential copy;
- secondary CTA targets `#client-work`;
- reduced-motion version contains no motion dependency.

---

# 7. BLOCK 02 — CONNECTED BUSINESS JOURNEY

## Business function

Explain the central differentiator: the website shapes what happens before contact, while automation protects what happens after contact.

## EN production-copy candidate

**Eyebrow**

```text
ONE CONNECTED BUSINESS JOURNEY
```

**Heading**

```text
The customer journey does not end when the form is submitted.
```

**Introduction**

```text
A service business can lose momentum before an inquiry, during the handoff, or after the request arrives. The useful solution is not another disconnected tool. It is a clearer journey from first understanding to the next responsible action.
```

### Friction signal 1

**Label:** `Trust friction`

```text
The visitor cannot quickly understand the offer, the proof, or whether the business is the right fit.
```

### Friction signal 2

**Label:** `Inquiry friction`

```text
The request arrives without enough context, through the wrong channel, or without a clear next step.
```

### Friction signal 3

**Label:** `Operational friction`

```text
Ownership, response, and follow-up depend too heavily on memory, manual copying, and disconnected tools.
```

### Four-step connected journey

1. **Understand and trust**  
   `Clear positioning, useful proof, and a credible website help the customer decide whether to continue.`

2. **Submit a clear request**  
   `The inquiry path captures the context needed for a useful first response.`

3. **Route and respond**  
   `Notifications, ownership, and response support create a more controlled handoff.`

4. **Follow up and improve**  
   `The business can continue the conversation, retain context, and improve the process where evidence supports it.`

**Conclusion**

```text
The website shapes the decision before contact. Automation protects the handoff after contact. They work best as one system.
```

## RU production-copy candidate

**Eyebrow**

```text
ЕДИНЫЙ ПУТЬ КЛИЕНТА И БИЗНЕСА
```

**Heading**

```text
Путь клиента не заканчивается после отправки формы.
```

**Introduction**

```text
Сервисный бизнес может терять клиента до обращения, во время передачи информации или уже после получения запроса. Полезное решение — не ещё один отдельный инструмент, а понятный путь от первого знакомства до следующего ответственного действия.
```

### Friction signal 1

**Label:** `Недостаток доверия`

```text
Посетитель не может быстро понять предложение, увидеть доказательства и определить, подходит ли ему этот бизнес.
```

### Friction signal 2

**Label:** `Неясное обращение`

```text
Запрос приходит без нужного контекста, через неудобный канал или без понятного следующего шага.
```

### Friction signal 3

**Label:** `Сбои в работе`

```text
Назначение ответственного, первый ответ и дальнейшая связь слишком сильно зависят от памяти, ручного копирования и разрозненных инструментов.
```

### Four-step connected journey

1. **Понять и доверять**  
   `Чёткое позиционирование, полезные доказательства и убедительный сайт помогают клиенту принять решение.`

2. **Оставить понятный запрос**  
   `Форма обращения собирает контекст, необходимый для полезного первого ответа.`

3. **Направить и ответить**  
   `Уведомления, ответственность и поддержка ответа создают более контролируемую передачу запроса.`

4. **Продолжить и улучшить**  
   `Бизнес сохраняет контекст, продолжает диалог и улучшает процесс там, где это подтверждается данными.`

**Conclusion**

```text
Сайт формирует решение до обращения. Автоматизация защищает процесс после обращения. Лучше всего они работают как единая система.
```

## Composition contract

Desktop:

- three concise friction signals above or beside the system;
- four semantic journey steps in reading order;
- optional two-lane visual treatment: `Before the inquiry` and `After the inquiry`;
- conclusion visually connects both lanes.

Mobile:

- friction signals become a compact list;
- journey remains exactly four stacked steps;
- no eight-column diagram;
- no tiny labels or horizontal scrolling.

---

# 8. BLOCK 03 — TWO CORE DIRECTIONS

## Business function

Help the visitor choose the most relevant direction without exposing a technical service matrix.

## Section EN

**Eyebrow:** `TWO CORE DIRECTIONS`

**Heading:**

```text
Two directions. One business system.
```

**Introduction:**

```text
Some businesses need a stronger trust and website foundation. Others need a better way to capture, route, and continue inquiries. Many eventually need both, but the first project should remain focused.
```

### Direction A — AI Systems & Automation

**Problem**

```text
Inquiries, notifications, handoffs, and repetitive work move through disconnected tools and individual memory.
```

**Intervention**

```text
We map the process, define human responsibility, and connect the useful parts of intake, routing, follow-up, AI assistance, and internal workflow.
```

**Intended practical effect**

```text
A clearer handoff, fewer avoidable manual steps, and better visibility into what should happen next.
```

**Capability signals**

- Inquiry and intake automation;
- notifications, routing and follow-up;
- AI assistants and knowledge support;
- internal workflow automation;
- practical integrations.

**Link:** `Explore AI Systems`  
**Route:** `/ai-systems/`

### Direction B — Premium Websites & Branding

**Problem**

```text
The business is credible, but the website does not explain the offer, organize proof, or guide the visitor toward a useful first action.
```

**Intervention**

```text
We clarify positioning, structure the message, design the visual system, and build a premium website around services, proof, language needs, and inquiry flow.
```

**Intended practical effect**

```text
Clearer understanding, stronger digital trust, and a more useful path from first visit to inquiry.
```

**Capability signals**

- website strategy and production;
- positioning and message hierarchy;
- branding and visual identity;
- multilingual website systems;
- content and conversion architecture.

**Link:** `Explore Websites & Branding`  
**Route:** `/websites-branding/`

## Section RU

**Eyebrow:** `ДВА ОСНОВНЫХ НАПРАВЛЕНИЯ`

**Heading:**

```text
Два направления. Одна бизнес-система.
```

**Introduction:**

```text
Одному бизнесу прежде всего нужен более сильный сайт и доверие до обращения. Другому — более понятный способ принимать, направлять и продолжать запросы. Со временем могут понадобиться оба направления, но первый проект должен оставаться сфокусированным.
```

### Direction A — AI-системы и автоматизация

**Problem**

```text
Обращения, уведомления, передача информации и повторяющиеся задачи зависят от разрозненных инструментов и памяти отдельных людей.
```

**Intervention**

```text
Мы разбираем процесс, фиксируем ответственность человека и соединяем полезные элементы приёма запросов, распределения, дальнейшей связи, AI-поддержки и внутренних рабочих процессов.
```

**Intended practical effect**

```text
Более понятная передача запроса, меньше лишних ручных действий и ясность в том, что должно произойти дальше.
```

**Capability signals**

- автоматизация обращений и первичного сбора данных;
- уведомления, распределение и дальнейшая связь;
- AI-помощники и работа со знаниями;
- автоматизация внутренних процессов;
- практические интеграции.

**Link:** `Подробнее об AI-системах`  
**Route:** `/ru/ai-systems/`

### Direction B — Премиальные сайты и брендинг

**Problem**

```text
Бизнес заслуживает доверия, но сайт не объясняет предложение, не организует доказательства и не ведёт посетителя к полезному первому действию.
```

**Intervention**

```text
Мы уточняем позиционирование, выстраиваем структуру сообщения, создаём визуальную систему и премиальный сайт вокруг услуг, доказательств, языков и пути обращения.
```

**Intended practical effect**

```text
Более ясное понимание, более сильное цифровое доверие и полезный путь от первого посещения до обращения.
```

**Capability signals**

- стратегия и создание сайта;
- позиционирование и иерархия сообщения;
- брендинг и визуальная айдентика;
- многоязычные сайты;
- архитектура контента и конверсии.

**Link:** `Подробнее о сайтах и брендинге`  
**Route:** `/ru/websites-branding/`

## Composition contract

- two materially different pathways, not identical template cards;
- AI direction appears first in reading order;
- Websites direction may carry stronger visible project imagery because current proof is stronger;
- each pathway has one service link;
- no Homepage pricing;
- no package ranking.

---

# 9. BLOCK 04 — FINANCIAL STREAM FLAGSHIP PROOF

## Business function

Provide the earliest and strongest real-world proof of the combined thesis.

## Public status

EN:

```text
Live client project · EN/RU
```

RU:

```text
Действующий клиентский проект · EN/RU
```

## EN production-copy candidate

**Eyebrow:** `FLAGSHIP CLIENT WORK`

**Heading:**

```text
A clearer path from service discovery to structured inquiry.
```

**Body:**

```text
Financial Stream needed to explain accounting and tax support in two languages while reducing reliance on long first calls. ProAI Expert rebuilt the information hierarchy, created an EN/RU service and content system, and placed a structured request before calendar booking.
```

**Evidence points**

- Live EN/RU website with mapped language paths;
- service-first positioning and clearer information hierarchy;
- structured request before calendar booking;
- service, proof, article and contact architecture designed as one system;
- selected human-reviewed automation and content workflows.

**Boundary line**

```text
The case demonstrates live implementation and system capability. It does not claim a measured increase in leads, revenue, conversion rate, or ROI.
```

**Primary case link:** `View the Financial Stream case`  
**Route:** `/case-studies/financial-stream/`

**External link:** `Visit the live website`  
**URL:** `https://financialstreamllc.com/`

## RU production-copy candidate

**Eyebrow:** `КЛЮЧЕВОЙ КЛИЕНТСКИЙ ПРОЕКТ`

**Heading:**

```text
Более понятный путь от выбора услуги до структурированного обращения.
```

**Body:**

```text
Financial Stream требовалось объяснить бухгалтерские и налоговые услуги на двух языках и снизить зависимость от долгих первичных звонков. ProAI Expert перестроил информационную иерархию, создал EN/RU-систему услуг и контента и поставил структурированный запрос перед бронированием консультации.
```

**Evidence points**

- действующий EN/RU-сайт с согласованными языковыми маршрутами;
- позиционирование от услуг и более понятная информационная иерархия;
- структурированный запрос перед бронированием;
- единая архитектура услуг, доказательств, статей и контакта;
- отдельные процессы автоматизации и контента с проверкой человеком.

**Boundary line**

```text
Кейс показывает действующую реализацию и возможности системы. Он не заявляет измеренный рост обращений, выручки, конверсии или окупаемости.
```

**Primary case link:** `Смотреть кейс Financial Stream`  
**Route:** `/ru/case-studies/financial-stream/`

**External link:** `Открыть действующий сайт`  
**URL:** `https://financialstreamllc.com/`

## Proof visual contract

Use one large flagship evidence field, not a metrics dashboard.

Preferred evidence roles:

1. desktop service/homepage context;
2. structured request/contact context;
3. compact EN/RU language-path evidence.

Source authority:

- `docs/portfolio-case-packs/financial-stream/SCREENSHOT_MANIFEST.md`;
- `docs/portfolio-case-packs/financial-stream/EVIDENCE_DERIVATIVES_MANIFEST.md`;
- live Financial Stream case pages;
- current approved public WebP derivatives.

No new image is approved until its exact source, derivative, crop role, alt text and claim boundary are recorded.

Mobile:

- one primary screenshot first;
- optional secondary detail below;
- status and boundary remain visible;
- no illegible desktop screenshot reduced into a tiny card.

---

# 10. BLOCK 05 — WAYS TO START

## Business function

Allow the visitor to self-identify the first controlled project without showing packages or prices.

## EN section copy

**Eyebrow:** `WAYS TO START`

**Heading:**

```text
Start with the part creating the most friction.
```

**Introduction:**

```text
The first project does not need to solve everything. It needs to establish the right priority, a clear boundary, and a useful result that can be verified.
```

### Situation 1 — Website and trust path

**Best when**

```text
The offer is difficult to understand, the site feels generic or outdated, proof is scattered, or the next step is unclear.
```

**First objective**

```text
Clarify positioning, organize services and proof, and create a stronger path from first visit to inquiry.
```

**Not implied**

```text
This does not automatically require a full rebrand, a large website, or every possible feature.
```

**Service links:**

- `websites_branding` — `Explore Websites & Branding` → `/websites-branding/`

**Review CTA:** `Review this starting point`  
**Machine direction:** `websites_branding`

### Situation 2 — Inquiry handling and repetitive process

**Best when**

```text
Requests arrive through several channels, context is missing, response depends on memory, or repetitive administrative work consumes attention.
```

**First objective**

```text
Map the handoff, define responsibility, and improve the focused intake, notification, routing, follow-up, or AI-support layer.
```

**Not implied**

```text
This does not mean replacing every tool, removing human review, or automating decisions that require judgment.
```

**Service links:**

- `ai_systems_automation` — `Explore AI Systems` → `/ai-systems/`

**Review CTA:** `Review this starting point`  
**Machine direction:** `ai_systems_automation`

### Situation 3 — Website and operations need to connect

**Best when**

```text
The website, inquiry path, and internal response process are being improved together or currently break at the handoff.
```

**First objective**

```text
Define one connected path from positioning and proof to structured inquiry and responsible response.
```

**Not implied**

```text
This does not require a large transformation program. The first release can remain deliberately bounded.
```

**Service links:**

- `ai_systems_automation` — `Explore AI Systems` → `/ai-systems/`
- `websites_branding` — `Explore Websites & Branding` → `/websites-branding/`

**Review CTA:** `Review the connected system`  
**Machine direction:** `both`

**Continuation note**

```text
Ongoing support begins after a controlled first project, when there is a real system to maintain, measure, or improve.
```

## RU section copy

**Eyebrow:** `С ЧЕГО МОЖНО НАЧАТЬ`

**Heading:**

```text
Начните с участка, который создаёт больше всего препятствий и лишней ручной работы.
```

**Introduction:**

```text
Первый проект не обязан решать всё сразу. Он должен определить правильный приоритет, чёткие границы и полезный результат, который можно проверить.
```

### Situation 1 — Сайт и доверие до обращения

**Лучше всего подходит, когда**

```text
Предложение трудно понять, сайт выглядит типовым или устаревшим, доказательства разбросаны, а следующий шаг неясен.
```

**Первая цель**

```text
Уточнить позиционирование, организовать услуги и доказательства и создать более сильный путь от первого посещения до обращения.
```

**Что это не означает**

```text
Это не обязательно требует полного ребрендинга, большого сайта или всех возможных функций.
```

**Service links:**

- `websites_branding` — `Сайты и брендинг` → `/ru/websites-branding/`

**Review CTA:** `Разобрать эту точку старта`  
**Machine direction:** `websites_branding`

### Situation 2 — Обработка обращений и повторяющиеся процессы

**Лучше всего подходит, когда**

```text
Запросы приходят через разные каналы, контекста не хватает, ответ зависит от памяти, а повторяющаяся административная работа забирает внимание.
```

**Первая цель**

```text
Разобрать передачу запроса, определить ответственность и улучшить конкретный участок: приём данных, уведомления, распределение, дальнейшую связь или AI-поддержку.
```

**Что это не означает**

```text
Это не означает замену всех инструментов, отказ от проверки человеком или автоматизацию решений, где требуется профессиональное суждение.
```

**Service links:**

- `ai_systems_automation` — `AI-системы и автоматизация` → `/ru/ai-systems/`

**Review CTA:** `Разобрать эту точку старта`  
**Machine direction:** `ai_systems_automation`

### Situation 3 — Сайт и внутренний процесс должны работать вместе

**Лучше всего подходит, когда**

```text
Сайт, путь обращения и внутренний ответ улучшаются одновременно или сейчас разрываются в момент передачи информации.
```

**Первая цель**

```text
Определить единый путь от позиционирования и доказательств до структурированного запроса и ответственного ответа.
```

**Что это не означает**

```text
Для этого не обязательно запускать большую программу преобразований. Первый этап может оставаться намеренно ограниченным.
```

**Service links:**

- `ai_systems_automation` — `AI-системы и автоматизация` → `/ru/ai-systems/`
- `websites_branding` — `Сайты и брендинг` → `/ru/websites-branding/`

**Review CTA:** `Разобрать единую систему`  
**Machine direction:** `both`

**Continuation note**

```text
Постоянная поддержка начинается после контролируемого первого проекта, когда уже существует реальная система, которую нужно поддерживать, измерять или улучшать.
```

## Deterministic `service_links` data contract

Every Ways-to-Start situation owns a `service_links` collection. A singular `service_link` field is prohibited.

Required item shape:

```yaml
service_links:
  - id: ai_systems_automation | websites_branding
    label: "localized public label"
    href: "/explicit-localized-route/"
```

Required collection counts:

```text
Situation 1: 1 item — websites_branding
Situation 2: 1 item — ai_systems_automation
Situation 3: 2 items — ai_systems_automation and websites_branding
```

EN and RU use the same item IDs and collection order. Labels and `href` values are localized explicitly. No route is inferred from a localized label, and no arbitrary HTML is stored inside the collection.

## Composition contract

- three situations, not three pricing tiers;
- no `Basic`, `Pro`, `Premium` labels;
- no “most popular” badge;
- no feature matrix;
- each situation has `Best when`, first objective, boundary and CTA;
- CTA context is preserved through the merged Contact contract.

---

# 11. BLOCK 06 — HOW THE WORK IS CONTROLLED

## EN production-copy candidate

**Eyebrow:** `CONTROLLED DELIVERY`

**Heading:**

```text
Clear boundaries before production. Verification before expansion.
```

**Introduction:**

```text
The work stays connected from business context to acceptance. Each phase produces a decision, an artifact, or a verified result before the next layer expands.
```

### Phase 1 — Review context

```text
Understand the business, the customer journey, the current tools, the constraints, and the main point of friction.
```

### Phase 2 — Define priorities and boundaries

```text
Choose the first useful objective, document what is in scope, and make exclusions explicit.
```

### Phase 3 — Build the focused system

```text
Connect strategy, copy, design, automation, and implementation around the approved objective.
```

### Phase 4 — Launch and verify

```text
Test the critical journeys, language parity, responsive behavior, ownership, and expected system states before publication.
```

### Phase 5 — Improve where evidence supports it

```text
Use real usage, operational feedback, and measured constraints to decide what should be refined next.
```

**Accountability note**

```text
No black-box handoff: strategy, architecture, implementation, and acceptance remain connected.
```

## RU production-copy candidate

**Eyebrow:** `КОНТРОЛИРУЕМАЯ РЕАЛИЗАЦИЯ`

**Heading:**

```text
Сначала чёткие границы. Затем реализация. Расширение — только после проверки.
```

**Introduction:**

```text
Работа остаётся связанной от бизнес-контекста до приёмки. Каждый этап должен завершаться решением, материалом или проверенным результатом до перехода к следующему этапу.
```

### Phase 1 — Разобрать контекст

```text
Понять бизнес, путь клиента, текущие инструменты, ограничения и основную точку потерь.
```

### Phase 2 — Определить приоритеты и границы

```text
Выбрать первую полезную цель, зафиксировать объём работы и прямо указать, что не входит в проект.
```

### Phase 3 — Создать сфокусированную систему

```text
Соединить стратегию, тексты, дизайн, автоматизацию и реализацию вокруг утверждённой цели.
```

### Phase 4 — Запустить и проверить

```text
До публикации проверить ключевые пути, языковое соответствие, адаптивность, ответственность и ожидаемые состояния системы.
```

### Phase 5 — Улучшать там, где это подтверждается

```text
Использовать реальное поведение, рабочую обратную связь и измеримые ограничения, чтобы определить следующий полезный шаг.
```

**Accountability note**

```text
Без передачи в «чёрный ящик»: стратегия, архитектура, реализация и приёмка остаются связанными.
```

## Composition contract

- five semantic phases;
- no horizontal-only desktop timeline dependency;
- mobile uses stacked numbered phases;
- detailed methodology stays on deeper pages.

---

# 12. BLOCK 07 — FOUNDER ACCOUNTABILITY

## EN production-copy candidate

**Eyebrow:** `FOUNDER ACCOUNTABILITY`

**Heading:**

```text
One accountable lead across strategy, systems, and delivery.
```

**Body:**

```text
Ihor Horb leads strategy and systems architecture for ProAI Expert, connecting business priorities with website structure, automation, AI support, implementation, and acceptance. Based in Washington, he works with service businesses across the United States in English, Russian, and Ukrainian.
```

**Scope line:**

```text
Strategy · AI Systems · Automation · Website Architecture
```

**Links:**

- `About Ihor and the studio` → `/about/`;
- `LinkedIn` → `https://www.linkedin.com/in/ihorhorb`.

## RU production-copy candidate

**Eyebrow:** `ОТВЕТСТВЕННОСТЬ ОСНОВАТЕЛЯ`

**Heading:**

```text
Один ответственный руководитель связывает стратегию, системы и реализацию.
```

**Body:**

```text
Игорь Горб отвечает в ProAI Expert за стратегию и архитектуру систем, соединяя бизнес-приоритеты со структурой сайта, автоматизацией, AI-поддержкой, реализацией и приёмкой. Он работает из штата Вашингтон с сервисным бизнесом по всей территории США на английском, русском и украинском языках.
```

**Scope line:**

```text
Стратегия · AI-системы · Автоматизация · Архитектура сайтов
```

**Links:**

- `Об Игоре и студии` → `/ru/about/`;
- `LinkedIn` → `https://www.linkedin.com/in/ihorhorb`.

## Visual contract

- use the existing approved founder portrait if its crop and resolution remain suitable;
- compact editorial treatment;
- not a full biography;
- photo does not dominate the page;
- alt text is localized.

---

# 13. BLOCK 08 — SELECTED WORK

## Business function

Show range and production quality while preserving exact project status and disclosure.

## EN section copy

**Eyebrow:** `SELECTED WORK`

**Heading:**

```text
Live projects and controlled concepts, presented with their real status.
```

**Introduction:**

```text
The work below demonstrates strategy, production, localization, and visual-system capability. Each item is labeled so a live client project, a related-party project, and a concept are not presented as the same kind of proof.
```

### Alina Horb

**Status:**

```text
Live related-party project · UA/RU
```

**Description:**

```text
A live multilingual personal-brand and service website focused on positioning, visual identity, content hierarchy, and mapped Ukrainian/Russian journeys.
```

**Required disclosure:**

```text
Connected to the founder; presented as proof of strategy, production, and localization quality, not as independent client validation.
```

**Case route:** `/case-studies/alina-horb/`  
**Live site:** `https://alinahorb.com/`

### Local Repair Pro

**Status:**

```text
Website concept · Live demo · In development
```

**Description:**

```text
A premium local-service website concept demonstrating positioning, repair-scenario architecture, photo-based inquiry, service-area framing, and responsive production direction.
```

**Required boundary:**

```text
This is a concept and live demo in development. It is not presented as a paid client, an operating repair company, or evidence of real customer outcomes.
```

**Case route:** `/case-studies/local-repair-pro/`  
**Live demo:** `/handyman-vancouver-portland-demo/`

**Archive link:** `View all case studies` → `/case-studies/`

## RU section copy

**Eyebrow:** `ИЗБРАННЫЕ ПРОЕКТЫ`

**Heading:**

```text
Действующие проекты и контролируемые концепции — с точным указанием их статуса.
```

**Introduction:**

```text
Эти работы показывают стратегию, производство, локализацию и качество визуальной системы. Статусы указаны прямо, чтобы реальный клиентский проект, связанный с основателем проект и концепция не выглядели одинаковым доказательством.
```

### Alina Horb

**Status:**

```text
Действующий проект, связанный с основателем · UA/RU
```

**Description:**

```text
Действующий многоязычный сайт личного бренда и услуг с фокусом на позиционировании, визуальной айдентике, иерархии контента и согласованных маршрутах на украинском и русском языках.
```

**Required disclosure:**

```text
Проект связан с основателем и показан как доказательство качества стратегии, реализации и локализации, а не как независимое клиентское подтверждение.
```

**Case route:** `/ru/case-studies/alina-horb/`  
**Live site:** `https://alinahorb.com/`

### Local Repair Pro

**Status:**

```text
Концепция сайта · Рабочее демо · В разработке
```

**Description:**

```text
Концепция премиального сайта локального сервиса, показывающая позиционирование, архитектуру ремонтных сценариев, обращение по фотографиям, подачу зоны обслуживания и адаптивную реализацию.
```

**Required boundary:**

```text
Это концепция и действующее демо в разработке. Проект не представлен как оплаченный клиент, работающая ремонтная компания или доказательство реальных клиентских результатов.
```

**Case route:** `/ru/case-studies/local-repair-pro/`  
**Live demo:** `/handyman-vancouver-portland-demo/`

**Archive link:** `Все кейсы` → `/ru/case-studies/`

## Composition contract

- two primary work items;
- no repeated Financial Stream flagship screenshot;
- status and disclosure visible without hover;
- disclosure remains readable at 320 px;
- no testimonial or metric is invented.

---

# 14. BLOCK 09 — SELECTED INSIGHTS

## Business function

Support authority and help a serious buyer make better decisions before contacting the studio.

## EN section copy

**Eyebrow:** `SELECTED INSIGHTS`

**Heading:**

```text
Useful decisions before you invest.
```

**Introduction:**

```text
Practical guides for service-business owners evaluating website scope, multilingual strategy, inquiry handling, and the right level of digital investment.
```

### Article 1

**Item ID:** `multilingual_website`

**Category:** `Language strategy`

**Title:**

```text
Does Your U.S. Service Business Need a Multilingual Website?
```

**Summary:**

```text
Choose between English-only, focused language support, and full multilingual coverage based on real demand, service capacity, and what the business can maintain.
```

**Route:** `/insights/does-your-service-business-need-a-multilingual-website/`

### Article 2

**Item ID:** `website_proposal`

**Category:** `Website buying decision`

**Title:**

```text
How to Evaluate a Website Proposal Before You Sign
```

**Summary:**

```text
Compare scope, responsibilities, ownership, acceptance, and support before page count or price leads to the wrong decision.
```

**Route:** `/insights/how-to-evaluate-a-website-proposal/`

### Article 3

**Item ID:** `lead_arrival`

**Category:** `Inquiry operations`

**Title:**

```text
What Happens After a Lead Arrives?
```

**Summary:**

```text
See how service businesses capture context, assign ownership, respond, follow up, and prevent inquiries from disappearing between disconnected tools.
```

**Route:** `/insights/what-happens-after-a-lead-arrives/`

**Archive link:** `Explore all insights` → `/insights/`

## RU section copy

**Eyebrow:** `ИЗБРАННЫЕ МАТЕРИАЛЫ`

**Heading:**

```text
Полезные ориентиры до инвестиций и начала реализации.
```

**Introduction:**

```text
Практические руководства для владельцев сервисного бизнеса, которые оценивают объём сайта, языковую стратегию, обработку обращений и подходящий уровень цифровых вложений.
```

### Article 1

**Item ID:** `multilingual_website`

**Category:** `Языковая стратегия`

**Title:**

```text
Сайт для русскоязычного бизнеса в США: какой вариант выбрать
```

**Summary:**

```text
Как выбрать между английским сайтом, отдельной русской поддержкой и полноценной RU/EN-системой с учётом спроса, возможностей команды и клиентского пути.
```

**Route:** `/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/`

### Article 2

**Item ID:** `website_proposal`

**Category:** `Выбор сайта и подрядчика`

**Title:**

```text
Как проверить подрядчика и предложение на сайт в США
```

**Summary:**

```text
Как сравнить объём работ, ответственность, доступы, приёмку и поддержку до подписания договора.
```

**Route:** `/ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/`

### Article 3

**Item ID:** `lead_arrival`

**Category:** `Работа с обращениями`

**Title:**

```text
Что происходит после заявки: как сервисному бизнесу не терять обращения
```

**Summary:**

```text
Как фиксировать контекст, назначать ответственного, отвечать и продолжать связь, чтобы обращения не терялись между формами, почтой и другими инструментами.
```

**Route:** `/ru/insights/chto-proiskhodit-posle-zayavki/`

**Archive link:** `Все материалы` → `/ru/insights/`

## Composition contract

- maximum three articles;
- article routes are explicit in localized data;
- no inferred RU slug transformation;
- Insights remain below proof and founder accountability;
- no article card requires hover to reveal its link.

---

# 15. BLOCK 10 — FINAL PRIVATE REVIEW

## Business function

End with one bounded next step and no new service argument.

## EN production-copy candidate

**Eyebrow:** `PRIVATE REVIEW`

**Heading:**

```text
Start with the highest-value problem, not the largest possible project.
```

**Body:**

```text
Share what feels unclear, manual, or disconnected. We will review fit, identify the priority, and recommend the next useful step.
```

**Primary CTA:**

```text
Request a Private Review
```

**Boundary copy:**

```text
No-cost and bounded. This is not a complete audit, detailed implementation plan, or free consulting engagement.
```

## RU production-copy candidate

**Eyebrow:** `ПЕРВИЧНЫЙ РАЗБОР`

**Heading:**

```text
Начните с проблемы, которая сильнее всего влияет на бизнес, а не с максимально большого проекта.
```

**Body:**

```text
Опишите, что сейчас непонятно, выполняется вручную или разрывается между отдельными инструментами. Мы оценим соответствие, определим приоритет и предложим следующий полезный шаг.
```

**Primary CTA:**

```text
Запросить первичный разбор
```

**Boundary copy:**

```text
Без оплаты и с чёткими границами. Это не полный аудит, не подробный план реализации и не бесплатный консалтинг без ограничений.
```

## Composition contract

- one primary CTA;
- no second service pitch;
- boundary copy adjacent to CTA;
- Footer follows directly after this section;
- no sticky CTA required for initial release.

---

# 16. EN/RU TERMINOLOGY LOCK

Preferred public terminology:

| Concept | EN | RU |
|---|---|---|
| Primary direction | AI Systems & Automation | AI-системы и автоматизация |
| Website direction | Premium Websites & Branding | Премиальные сайты и брендинг |
| Primary CTA | Request a Private Review | Запросить первичный разбор |
| Before inquiry | Before the inquiry | До обращения |
| After inquiry | After the inquiry | После обращения |
| Human review | Human-reviewed AI | AI с проверкой человеком |
| Routing | Routing | Распределение / направление запроса |
| Follow-up | Follow-up | Дальнейшая связь / продолжение диалога |
| Intake | Structured intake | Структурированный сбор данных |
| Proof | Proof | Доказательства / подтверждение |

Unexplained imported English process terms are prohibited in visible RU copy.

Machine values remain English snake_case.

---

# 17. RESPONSIVE CONTENT PRIORITY

## Desktop

- Hero creates orientation and first action;
- Connected Journey provides the differentiating system;
- Directions provide choice;
- Financial Stream provides early proof;
- Ways to Start converts self-identification into contextual review CTAs;
- Process and Founder reduce perceived delivery risk;
- Selected Work and Insights deepen confidence;
- Final Review closes the journey.

## Mobile portrait

Required priority:

1. H1 and supporting copy;
2. primary CTA and expectation copy;
3. secondary CTA;
4. four-step connected journey;
5. two directions;
6. one readable Financial Stream screenshot and evidence copy;
7. three Ways to Start situations;
8. five process phases;
9. founder accountability;
10. project statuses and disclosures;
11. three insights;
12. final CTA and boundary.

## Short phone landscape

- no section uses viewport-filling minimum height;
- no sticky narrative rail;
- no large decorative system that pushes CTA below the fold;
- Header offset uses the approved short-landscape value;
- primary CTA remains reachable without horizontal overflow.

## Russian layout

- no forced English line breaks;
- headings may wrap naturally;
- CTA buttons may expand or wrap;
- status and disclosure remain visible;
- no fixed-height copy containers;
- RU Hero remains provisional until the authorized map demonstrates 390 px, 320 px and approximately 844 × 390 hierarchy.

---

# 18. PROOF-SOURCE MAP

## Financial Stream

**Proof class:** Live client project · EN/RU

Approved source families:

- live Financial Stream website;
- EN/RU Financial Stream case pages;
- `docs/portfolio-case-packs/financial-stream/SCREENSHOT_MANIFEST.md`;
- `docs/portfolio-case-packs/financial-stream/EVIDENCE_DERIVATIVES_MANIFEST.md`;
- approved public WebP derivatives already used by the case system.

Permitted claims:

- live EN/RU implementation;
- structured request path;
- service and content architecture;
- mapped language experience;
- bounded human-reviewed capabilities.

Prohibited without separately reviewed evidence:

- lead growth;
- conversion increase;
- revenue growth;
- ROI;
- response-time improvement;
- ranking guarantees.

## Alina Horb

**Proof class:** Live related-party project · UA/RU

Approved source families:

- live `alinahorb.com`;
- EN/RU ProAI case pages;
- existing case screenshots and approved derivatives.

Mandatory adjacent disclosure:

- connected to the founder;
- not independent client validation.

## Local Repair Pro

**Proof class:** Website concept · Live demo · In development

Approved source families:

- `/handyman-vancouver-portland-demo/`;
- existing case page;
- approved scenario and hero images from the demo repository/public route.

Mandatory boundary:

- concept, not paid client;
- not an operating service business;
- no customers, reviews, leads or business outcomes claimed.

## Founder

Approved source:

```text
/ru/about/ProAI_Founder_Portrait_2x3.webp
```

Use only if the derivative remains sharp and compositionally suitable. Otherwise create a new derivative from the same approved source under the future Homepage asset folder; do not invent a new founder image.

---

# 19. FUTURE JEKYLL DATA OWNERSHIP

The future localized files remain:

```text
_data/homepage_v2/en.yml
_data/homepage_v2/ru.yml
```

Required top-level structure:

```yaml
meta:
hero:
connected_journey:
directions:
client_work:
ways_to_start:
process:
founder:
selected_work:
insights:
private_review:
```

The `meta` object must implement every key and absolute URL defined in Section 4A.

Required stable collection counts:

- 4 connected-journey steps;
- 2 directions;
- 3 Ways to Start situations;
- Ways `service_links` counts of 1, 1 and 2 respectively;
- 5 process phases;
- 2 Selected Work items;
- 3 Insights items.

Required Contact machine values:

```text
private_review
homepage_hero
homepage_ways_to_start
homepage_final
ai_systems_automation
websites_branding
both
not_sure
```

Required non-Contact action/origin identifiers are defined in Section 4B and remain separate from Contact query values.

Required project IDs:

```text
financial_stream
alina_horb
local_repair_pro
```

Required article IDs:

```text
multilingual_website
website_proposal
lead_arrival
```

Data owns localized copy, explicit localized links, status text, disclosures, alt text, CTA context, identifier fields and image objects.

Data does not own arbitrary HTML, inline styles, JavaScript or dynamic include names.

---

# 20. LOW-FIDELITY PAGE-MAP INPUT

This section defines a future gate only. It does not authorize beginning the map before the focused correction review returns `ACCEPT`.

After content acceptance, the next artifact must show the complete page at minimum in:

- desktop 1440 px;
- mobile 390 px;
- mobile 320 px;
- short landscape approximately 844 × 390.

The low-fidelity map must demonstrate:

- relative section scale;
- proof placement;
- copy hierarchy;
- CTA locations;
- actual RU Hero expansion and first-action position;
- screenshot roles;
- absence of horizontal poster layouts on mobile;
- Header and Footer boundaries;
- no hidden section dependencies.

It is not a visual-design approval and must remain grayscale or minimally styled.

---

# 21. VISUAL CONCEPT INPUT

After the low-fidelity map is accepted, compare three full-page visual directions:

### Concept A — Current dark identity evolved

- strongest continuity;
- restrained cyan;
- simplified system graphics;
- lower visual risk.

### Concept B — Dark technical shell with editorial proof surfaces

- recommended baseline;
- dark ProAI frame;
- brighter or more tactile proof chapters;
- Financial Stream becomes the visual centerpiece;
- strongest balance of technology and premium credibility.

### Concept C — Premium editorial transformation

- most radical;
- larger typography and stronger surface changes;
- reduced visible technology styling;
- highest brand-change risk.

The comparison must be full-page, not Hero-only.

---

# 22. ACCEPTANCE GATE FOR THIS DOCUMENT

The corrected Content Architecture may advance only when a focused independent Reviewer confirms:

1. the ten-block order still matches approved strategy;
2. the complete EN/RU `meta` contract is deterministic and uses explicit absolute URLs;
3. CTA `action_id`, `origin_id` and Contact query values are correctly separated;
4. the `service_links` collection represents one, one and two service links without arbitrary HTML;
5. the Financial Stream first-call statement is bounded;
6. RU proof statuses use the exact approved taxonomy;
7. only the listed RU language corrections were applied;
8. the RU Hero remains provisional behind the 390 px, 320 px and approximately 844 × 390 map gate;
9. CTA URLs exactly match the merged Contact contract;
10. Financial Stream claims remain factual and bounded;
11. Alina disclosure is visible and sufficient;
12. Local Repair Pro status is exact;
13. no unsupported lead, revenue, conversion or ROI claim appears;
14. Ways to Start does not become a hidden pricing table;
15. EN/RU business meaning remains equivalent;
16. responsive content priority remains viable at 320 px and short landscape;
17. future YAML can represent all content without arbitrary HTML;
18. the document is ready to drive a low-fidelity full-page map only after an `ACCEPT` verdict.

Reviewer verdict must be one of:

- `ACCEPT`;
- `TARGETED CORRECTION`;
- `REJECT`.

---

# 23. CURRENT STATUS

Completed:

- Homepage V2 strategy approved;
- technical implementation contract approved;
- Contact prerequisite merged and verified;
- content-architecture branch created from the reviewed `main` baseline;
- complete EN/RU ten-block copy candidate defined;
- independent Content Architecture V1 review completed with `TARGETED CORRECTION`;
- Corrections 1–7 applied;
- complete EN/RU metadata contract defined;
- CTA/action/origin identifier separation defined;
- deterministic Ways-to-Start `service_links` schema defined;
- exact proof-status and RU language corrections applied;
- RU Hero provisional map gate recorded;
- exact Contact CTA contracts retained;
- proof status and claim boundaries retained;
- responsive content priority retained;
- future Jekyll data ownership completed.

Not started:

- focused correction review verdict;
- Homepage source implementation;
- low-fidelity page map;
- visual concept production;
- Homepage CSS/JavaScript/YAML;
- Homepage production PR.

**Current gate:** focused Content Architecture correction review.