# Financial Stream LLC — Portfolio Case Pack

**Continuation of the internal source-of-truth document.**

# 7. Website Architecture

## 7.1 Архитектурная матрица

| Группа | EN | RU | Коммерческая функция |
|---|---|---|---|
| Homepage | `/` | `/ru/` | trust, positioning, service overview, first CTA |
| Services Hub | `/services/` | `/ru/services/` | self-selection и понимание scope |
| Start Here | `/start-here/` | `/ru/start-here/` | triage по ситуации |
| Contact | `/contact/` | `/ru/contact/` | structured intake и contact hierarchy |
| Blog Hub | `/blog/` | `/ru/blog/` | SEO discovery, trust, preparation |
| Privacy | `/privacy-policy.html` | `/ru/privacy-policy.html` | legal/compliance |
| Terms | `/terms-and-conditions.html` | `/ru/terms-and-conditions.html` | legal/compliance |
| SMS Consent | `/sms-consent.html` | `/ru/sms-consent.html` | SMS compliance |
| Language pair | EN URL | RU URL | bilingual routing, canonical/hreflang |

## 7.2 Service pages

Portfolio-safe направления:

- company formation / setup / closure;
- QuickBooks bookkeeping;
- Sales Tax / DOR reporting;
- tax return preparation;
- financial consulting / document review.

### Legacy conflict

Payroll pages и payroll service links присутствуют в текущей public architecture, но являются устаревшими относительно канонического business scope.

Их нельзя показывать как выполненную услугу в портфолио.

## 7.3 Blog and materials

Сайт имеет substantial content layer, а не 3–5 marketing pages.

Темы:

- bookkeeping;
- QuickBooks;
- cleanup;
- tax preparation;
- Washington;
- Seattle / Federal Way;
- Sales Tax;
- IRS updates;
- document checklists;
- business setup.

## 7.4 Recent bilingual article evidence

### IRS notice / missed deadline pair

- EN: `/blog/irs-notice-missed-tax-deadline-2026.html`
- RU: `/ru/blog/irs-notice-propushchen-tax-deadline-2026.html`

### Seattle B&O pair

- EN: `/blog/seattle-bo-tax-changes-2026.html`
- RU: `/ru/blog/seattle-bo-tax-changes-2026.html`

Эти пары доказывают:

- scalable bilingual publishing;
- paired URLs;
- language switch;
- canonical/hreflang;
- article schema;
- local/informational SEO depth;
- reusable article system.

## 7.5 Local pages

Особенно важны для case:

- Seattle;
- Federal Way;
- Washington;
- Russian-speaking accountant / bookkeeper context.

## 7.6 Language mapping

Требование:

- EN и RU не должны вести на общий homepage, если существует парная страница;
- shell, footer, sidebar, CTA и metadata должны быть локализованы;
- English official terms допустимы в RU content, но UI должен быть русским;
- публикационные QA должны проверять весь page shell, а не только hero/head.

## 7.7 Current scale

- sitemap содержит приблизительно 60 public URLs;
- Search Console обработал 63 страницы в предоставленном screenshot snapshot;
- 41 страница была отмечена как indexed;
- 22 — not indexed по четырём категориям.

---

# 8. Conversion and Intake Architecture

## 8.1 Главный принцип

**Structured request first. Calendar second.**

Это одна из главных отличительных черт кейса.

## 8.2 Два уровня формы

### A. Deep structured intake — Google Form

Назначение:

- собрать service area;
- business context;
- year/period;
- documents;
- deadlines;
- QuickBooks status;
- notices;
- что именно непонятно.

Роль:

- основной путь для новых сложных обращений;
- снижает количество пустых звонков;
- помогает Tetiana заранее понять ситуацию;
- подготавливает handoff.

Статус:

- live site содержит Google Form link;
- automated audit не смог открыть форму и получил 401;
- перед public portfolio claim нужен ручной test submission и screenshot.

### B. Short website form — Formspree

Назначение:

- короткий вопрос;
- первый контакт;
- ситуация без готовых документов.

Подтверждённый endpoint:

`https://formspree.io/f/xwvqekla`

Поля:

- name;
- email;
- optional phone;
- preferred contact method;
- topic;
- message;
- optional SMS consent;
- privacy/terms/SMS acknowledgement;
- honeypot/anti-spam field.

Статус:

- configured;
- fresh end-to-end delivery test нужно сохранить как evidence.

## 8.3 Calendar

Google appointment schedule доступен после контекста.

Назначение:

- secondary CTA;
- не заменяет structured intake;
- используется, когда call действительно полезен.

Статус:

- live link ведёт на Google Calendar appointment schedule;
- свежий booking flow screenshot обязателен.

## 8.4 Direct contact

- email;
- phone;
- optional SMS;
- fallback for simple messages and follow-up.

## 8.5 AI chat

Chatbase:

- дополнительная точка входа;
- помогает с базовой навигацией;
- был отдельный mobile layering fix;
- не должен обещать бухгалтерское решение вместо Tetiana.

## 8.6 После отправки обращения

1. клиент передаёт базовый контекст;
2. Financial Stream рассматривает направление и документы;
3. уточняются missing details;
4. выбирается practical next step;
5. call/document review назначается после понимания scope.

## 8.7 Sensitive data guardrails

Публичные формы предупреждают не отправлять:

- полный SSN;
- passwords;
- banking logins;
- account credentials;
- passport scans;
- full tax documents;
- sensitive employee/owner data через unsecured message.

## 8.8 Conversion feature/status matrix

| Элемент | Роль | Технология | Текущий статус | Portfolio claim |
|---|---|---|---|---|
| Deep intake | primary lead qualification | Google Form | linked; manual test required | «structured intake path» |
| Short form | low-friction contact | Formspree | configured | «short inquiry form» |
| Calendar | secondary booking | Google Calendar | linked; manual test required | «booking after context» |
| Email | fallback | Gmail | live | safe |
| Phone | fallback | tel link | live | safe |
| SMS consent | compliant service messaging consent | web form + policy | live | safe |
| AI chat | navigation/support entry point | Chatbase | live | safe with human-in-loop framing |
| Gmail drafts | response preparation | Gmail + Make + OpenAI | confirmed by project history | use after screenshot |
| Missed-call SMS | call recovery | Twilio + Make | partial/test | do not call fully live |
| Sheet logging | status tracking | Google Sheets | not sufficiently verified | planned/partial only |

---

# 9. AI and Automation Layer

## 9.1 Подтверждённо реализовано

### Chatbase website assistant

- embedded on the site;
- preserved across updates;
- mobile z-index/pointer behavior was specifically fixed;
- role: navigation and first-line guidance;
- not an accountant replacement.

### Gmail draft assistant

Project history confirms a Make + OpenAI + Gmail pipeline that:

- watches inbound email;
- generates reply drafts;
- does not auto-send;
- routes EN/RU/UA language;
- skips own messages and unwanted patterns;
- includes a non-empty fallback;
- uses a controlled Tetiana persona;
- removes payroll from the intended service scope;
- keeps a human review step.

Portfolio-safe claim:

> **AI-assisted Gmail draft workflow with language routing and human review.**

Не писать:

> полностью автоматические ответы клиентам.

## 9.2 Частично реализовано / тестировалось

### Twilio / missed-call SMS

Подтверждённый проектный контекст:

- Twilio account and local U.S. number;
- test call/SMS activity;
- Make scenario/webhook setup;
- missed-call SMS logic обсуждалась и настраивалась;
- выбран ориентир около 15 секунд до SMS;
- service-related message;
- STOP/HELP and anti-spam considerations;
- A2P work and resubmission history.

Не подтверждено свежим evidence:

- стабильная production uptime;
- полный daily limit;
- безошибочная missed-call detection;
- complete inbound SMS routing;
- current A2P final status;
- current number routing.

### Google Sheet logging

Была задана логика:

- new;
- replied;
- scheduled;
- closed.

Но production screenshot и current working proof отсутствуют.

## 9.3 Запланировано

- AI-assisted SMS drafts после стабилизации base flow;
- расширенное lead status tracking;
- consolidated reporting;
- deeper CRM-style handoff;
- automation metrics;
- cost/ROI tracking.

## 9.4 Правило public case

Автоматизации нужно показывать по статусу:

- **live**;
- **tested/partial**;
- **planned**.

Нельзя визуально объединять их в один блок «полная автоматизация бизнеса».

---

# 10. Work Completed by ProAI Expert

## Выполнено

- business and project strategy;
- positioning;
- service architecture;
- information architecture;
- UX;
- conversion path;
- visual direction;
- branding system;
- responsive website development;
- bilingual EN/RU architecture;
- page pairing;
- canonical/hreflang foundation;
- SEO foundation;
- service/content architecture;
- blog/materials structure;
- article templates;
- local SEO content;
- structured data;
- forms and intake hierarchy;
- Formspree integration;
- Google Form routing;
- calendar routing;
- SMS consent/compliance pages;
- Chatbase integration;
- QA;
- GitHub Pages deployment;
- custom domain;
- ongoing support and content publication.

## Выполнено по проектной истории, но требует свежего screenshot proof

- Gmail draft assistant;
- Make scenario logic;
- language routing;
- email filtering;
- human-in-loop draft generation.

## Частично / testing

- Twilio missed-call SMS;
- inbound SMS flow;
- A2P;
- Google Sheet logging;
- AI SMS draft layer.

## Не включать как completed

- CRM;
- full lead automation;
- production-grade reporting dashboard;
- guaranteed missed-call recovery;
- fully autonomous client communication.

---

# 11. Key Strategic Decisions

| № | Проблема | Решение | Логика | Коммерческая функция | Статус |
|---:|---|---|---|---|---|
| 1 | сайт мог остаться brochure | построить website system | trust + services + intake + content | больше ясности до контакта | complete |
| 2 | две языковые аудитории | парная EN/RU архитектура | не машинный перевод, а mirrored logic | доступ к разным сегментам | complete |
| 3 | календарь без контекста | structured request first | document-heavy запросы требуют данных | более качественный первый контакт | live |
| 4 | одна форма не подходит всем | deep form + short form | сложный и простой inquiry paths | меньше friction | live/configured |
| 5 | чувствительные данные | explicit safety guidance | tax/accounting data high-risk | снижает риск unsafe messages | live |
| 6 | широкий service scope | hubs + pages + Start Here | self-selection | меньше путаницы | complete |
| 7 | слабая search depth | bilingual content library | service + local + informational coverage | SEO discoverability | active |
| 8 | trust-sensitive niche | calm premium visual system | credibility before conversation | stronger presentation | complete |
| 9 | AI risk | human-in-the-loop drafts | AI prepares, Tetiana reviews | speed without loss of control | implemented |
| 10 | call recovery complexity | stable base before AI | first SMS logic, then AI | controlled rollout | partial |
| 11 | compliance | privacy/terms/SMS pages | form and SMS trust layer | safer intake | live |
| 12 | regression risk | canonical rules + QA scripts | preserve forms, Chatbase, language mapping | maintainability | active |

---

# 12. Technical Implementation

## Hosting

- GitHub Pages;
- static production website;
- custom domain `financialstreamllc.com`.

## Repository

`Financialstream/financialstream.github.io`

Current production `main` reviewed in this pack:

`2fb271f745eba7d9722b1613abc46342479f96d5`

Commit:

`Localize IRS notice RU article shell`

## Stack

- HTML;
- CSS;
- vanilla JavaScript;
- GitHub Pages;
- no confirmed CMS/framework dependency.

## Bilingual implementation

- separate EN/RU files;
- mirrored routes;
- language switch;
- canonical;
- hreflang EN/RU/x-default;
- localized metadata;
- paired article URLs.

## SEO foundation

- titles and descriptions;
- canonical URLs;
- hreflang;
- sitemap;
- robots;
- Open Graph;
- Twitter cards;
- Organization / AccountingService schema;
- Article schema;
- BreadcrumbList;
- FAQPage on relevant articles;
- local and informational content.

## Forms

- primary Google Form deep intake;
- secondary Formspree short form;
- honeypot;
- SMS consent;
- legal links;
- separate language values.

## Scheduling

- Google Calendar appointment schedule;
- secondary after context.

## Chat

- Chatbase;
- responsive/mobile launcher fix.

## Email automation

- Gmail;
- Make;
- OpenAI;
- draft creation;
- language routing;
- filters;
- human review.

## Telephony/SMS

- Twilio;
- Make webhook/scenario;
- partial/test status.

## Analytics/search

- Google Search Console confirmed;
- Google Analytics / GA4 not confirmed in this source pack.

## Mobile

- responsive layouts;
- dedicated mobile navigation;
- mobile Chatbase layering fix;
- current case should include fresh 320–430px screenshots.

## Accessibility

Подтверждено частично:

- semantic headings;
- labels;
- alt text;
- keyboard-oriented controls в ряде компонентов.

Не подтверждено:

- формальная WCAG conformance;
- полный accessibility audit;
- screen-reader validation across all pages.

## Deployment

- production from GitHub Pages;
- current `main`;
- custom domain;
- ongoing incremental commits.

## No-regression constraints

Не менять без отдельного scope:

- Formspree endpoint;
- Google Form;
- calendar;
- Chatbase;
- EN/RU mapping;
- canonical/hreflang;
- privacy/terms/SMS links;
- structured-request anchors.

---

---

## Source pack navigation

- [Part 1 — Executive summary through visual direction](CASE_PACK.md)
- [Part 2 — Website, intake, automation, implementation](CASE_PACK_PART_2_ARCHITECTURE.md)
- [Part 3 — Status, evidence, framing, claim restrictions](CASE_PACK_PART_3_EVIDENCE_AND_FRAMING.md)
- [Appendices — evidence register, claims matrix, definition of done](CASE_PACK_APPENDICES.md)
