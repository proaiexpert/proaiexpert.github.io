# PROAI EXPERT — CONTACT PRIVATE REVIEW PREREQUISITE SPEC

**Status:** Production-scope candidate  
**Version:** 1.0  
**Date:** 2026-08-04  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Depends on:** `PROAI_EXPERT_HOMEPAGE_V2_IMPLEMENTATION_CONTRACT.md`  
**Implementation authorization:** none until owner approval

---

# 1. PURPOSE

Prepare the existing EN/RU Contact experience to receive Homepage V2 `Request a Private Review` traffic safely and consistently.

This is a narrow prerequisite, not a Contact redesign.

The implementation must:

- preserve the existing Contact visual system;
- preserve the current Formspree endpoint;
- preserve the existing form validation and anti-spam behavior;
- resolve the current `intent` field collision;
- add allowlisted URL context handling;
- submit stable machine values across EN/RU;
- show bounded Private Review explanation when requested;
- remain fully usable from direct Contact visits;
- remain backward-compatible with the current Homepage.

---

# 2. EXPECTED PRODUCTION BRANCH

Create from freshly fetched current `main`:

```text
agent/contact-private-review-prerequisite
```

Record:

- current `main` SHA;
- exact blob SHA for `contact/index.html`;
- exact blob SHA for `ru/contact/index.html`;
- open PRs touching Contact, Header or Footer.

Do not create this production branch from the strategy-review branch.

---

# 3. ALLOWED FILES

Expected modified files:

```text
contact/index.html
ru/contact/index.html
```

Additional shared files are prohibited unless the Builder demonstrates that one narrow shared file materially reduces duplicated EN/RU logic without changing other routes.

Forbidden:

- Homepage files;
- Header files;
- Footer files;
- Formspree endpoint changes;
- service pages;
- Case Studies;
- Insights;
- deployment workflow unless separately approved;
- routes;
- sitemap;
- `_config.yml`;
- unrelated metadata;
- global CSS/JS refactor.

---

# 4. CURRENT FUNCTIONALITY TO PRESERVE

Both EN and RU Contact pages currently use:

- endpoint `https://formspree.io/f/xbdakqoz`;
- asynchronous `fetch` submission;
- `Accept: application/json`;
- required email validation;
- minimum project-context validation;
- honeypot `company_website`;
- timestamp `form_started_at`;
- localized subject;
- localized processing state;
- localized success state;
- localized error state;
- reset behavior after successful submission;
- current direct-contact experience;
- current Header and Footer.

All must remain operational.

---

# 5. CANONICAL FORM FIELDS

Both languages submit the same machine schema:

```text
intent=private_review | project_inquiry
source_page=homepage | contact | other_allowlisted_source
source_cta=homepage_hero | homepage_ways_to_start | homepage_final | direct_contact
selected_direction=ai_systems_automation | websites_branding | both | not_sure
source_context=<bounded identifier or empty>
referring_url=<bounded URL or empty>
language=en | ru
```

Compatibility fields may remain:

```text
page_lang
page_path
form_started_at
company_website
```

They must not replace or conflict with canonical fields.

---

# 6. `intent` MIGRATION

The existing form uses `intent` for selected direction. That contract must change.

Required behavior:

## Direct Contact visit

```text
intent=project_inquiry
source_page=contact
source_cta=direct_contact
selected_direction=<chosen canonical direction>
```

## Homepage Private Review visit

```text
intent=private_review
source_page=homepage
source_cta=<recognized Homepage CTA>
selected_direction=<recognized value or not_sure>
```

The current direction hidden field becomes:

```html
<input type="hidden" id="selected_direction" name="selected_direction">
```

Pill labels remain localized. Their values must use canonical identifiers.

Example:

```html
<button type="button" data-value="ai_systems_automation">AI Systems &amp; Automation</button>
```

RU visible label may differ naturally while keeping the same `data-value`.

---

# 7. ACCEPTED QUERY PARAMETERS

## `intent`

- `private_review`;
- `project_inquiry`.

## `source_page`

- `homepage`;
- `contact`.

## `source_cta`

- `homepage_hero`;
- `homepage_ways_to_start`;
- `homepage_final`;
- `direct_contact`.

## `selected_direction`

- `ai_systems_automation`;
- `websites_branding`;
- `both`;
- `not_sure`.

## Optional bounded parameters

- `source_context`;
- `referring_url`.

Set explicit maximum lengths in implementation.

Unsupported values are ignored.

Safe defaults:

```text
intent=project_inquiry
source_page=contact
source_cta=direct_contact
selected_direction=not_sure
```

---

# 8. SAFE DOM REQUIREMENTS

Query context may be applied only with:

- `.value`;
- `.textContent`;
- safe attribute assignment.

Prohibited:

- injecting query data with `innerHTML`;
- executing query data;
- building selectors directly from arbitrary query values;
- submitting arbitrary query-string fields;
- including personal or free-form values in analytics events.

Do not send to analytics:

- name;
- email;
- phone;
- project description;
- arbitrary referrer query strings.

---

# 9. PRIVATE REVIEW CONTEXT UI

When `intent=private_review` is valid, show a localized context panel or lead-in within the existing Contact design.

## EN intent

Title direction:

```text
Request a Private Review
```

Explanation direction:

```text
Share a short description of the business, current website or process, and the main issue. ProAI Expert will review fit, identify the highest-priority starting area, and recommend the next useful step.
```

Boundary direction:

```text
This is a no-cost, limited first review—not a complete audit, implementation plan, or free consulting engagement.
```

## RU intent

Title direction:

```text
Запросить первичный разбор
```

Explanation direction:

```text
Кратко опишите бизнес, текущий сайт или процесс и главную проблему. ProAI Expert оценит соответствие задачи, определит приоритетное направление и предложит полезный следующий шаг.
```

Boundary direction:

```text
Это бесплатный ограниченный первичный разбор, а не полный аудит, готовый план реализации или бесплатная консультационная работа.
```

Final production copy requires natural EN/RU review.

Do not promise a fixed response time unless owner operations support it.

---

# 10. DIRECTION OPTIONS

Both languages expose four options using stable values:

| Machine value | EN label direction | RU label direction |
|---|---|---|
| `ai_systems_automation` | AI Systems & Automation | AI-системы и автоматизация |
| `websites_branding` | Websites & Branding | Сайты и брендинг |
| `both` | Both | Оба направления |
| `not_sure` | Not sure yet | Пока не уверен |

The form must always submit one recognized value.

---

# 11. NO-JS BEHAVIOR

Without JavaScript:

- Contact page renders normally;
- user can complete and submit the existing form;
- Private Review link still lands at `#project-intake`;
- query context enhancement may be absent, but the form remains usable;
- no essential field depends on client-side query parsing to exist;
- server submission retains safe defaults present in HTML.

JavaScript enhances context; it does not create the form.

---

# 12. FORM SUBMISSION CONTRACT

Before submission:

- validate required email;
- validate minimum context;
- preserve honeypot behavior;
- preserve timing field;
- populate canonical hidden fields;
- preserve localized subject;
- preserve localized form status.

On response:

- retain existing success handling;
- retain existing error handling;
- retain reset behavior;
- reset visible direction state and canonical hidden values safely;
- do not lose the current user-facing error message.

The Formspree endpoint remains:

```text
https://formspree.io/f/xbdakqoz
```

---

# 13. CTA INPUTS TO SUPPORT

The Contact prerequisite must correctly recognize:

## EN Hero

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_hero#project-intake
```

## RU Hero

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_hero#project-intake
```

## EN Ways to Start

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=ai_systems_automation#project-intake
```

## RU Ways to Start

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=ai_systems_automation#project-intake
```

## EN Final

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_final#project-intake
```

## RU Final

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_final#project-intake
```

---

# 14. ACCESSIBILITY

Required:

- context panel announced in normal reading order;
- direction controls retain keyboard operation;
- active pill state is programmatically available;
- hidden fields are not focusable;
- labels remain associated with fields;
- focus remains visible;
- success/error state remains announced appropriately;
- no information is conveyed only by color;
- touch targets remain practical;
- RU labels may wrap;
- no focus jump caused by query parsing.

---

# 15. RESPONSIVE CHECKS

Verify EN/RU at:

- laptop;
- tablet portrait;
- 430 px;
- 390 px;
- 375 px;
- 360 px;
- 320 px;
- short phone landscape.

Check:

- no horizontal overflow;
- context copy does not collide with form;
- pill labels wrap correctly;
- CTA anchor lands below fixed Header;
- status text remains visible;
- keyboard does not obscure essential controls;
- Footer and Chatbase do not cover submission controls.

---

# 16. TEST MATRIX

## Direct visit tests

- EN direct Contact;
- RU direct Contact;
- default machine values;
- all four direction choices;
- normal submission;
- invalid email;
- too-short context;
- honeypot;
- Formspree error;
- success reset.

## Private Review tests

- EN Hero URL;
- RU Hero URL;
- EN Ways-to-Start URL with each direction;
- RU Ways-to-Start URL with each direction;
- EN final URL;
- RU final URL;
- invalid `intent`;
- invalid `source_page`;
- invalid `source_cta`;
- invalid `selected_direction`;
- oversized context values;
- encoded markup attempt;
- no-JS navigation;
- browser back/forward behavior.

## Submission payload verification

Confirm exact fields and canonical values in the submitted request.

No personal data may be copied to analytics payloads.

---

# 17. ACCEPTANCE CRITERIA

The prerequisite is accepted only when:

1. only approved Contact files are changed;
2. Header/Footer source and output remain unchanged;
3. Formspree endpoint remains unchanged;
4. direct Contact behavior remains functional;
5. `intent` stores request type;
6. `selected_direction` stores canonical direction;
7. EN/RU machine values match;
8. allowlisted query values are applied safely;
9. unsupported values are ignored;
10. Private Review explanation is bounded and localized;
11. no-JS form remains usable;
12. validation, honeypot, timestamp, success, error and reset pass;
13. mobile portrait and landscape pass;
14. no horizontal overflow;
15. independent Reviewer returns ACCEPT or only resolved targeted correction;
16. owner explicitly authorizes merge.

---

# 18. ROLLBACK

Before change record current blob SHAs for:

```text
contact/index.html
ru/contact/index.html
```

Rollback is a two-file restore.

Contact rollback must not require Homepage rollback.

Homepage rollback after later V2 publication may leave the verified Contact prerequisite in production because it remains backward-compatible with direct Contact and the current Homepage.

---

# 19. BUILDER REPORT

Builder must report:

1. route used;
2. current `main` base SHA;
3. branch;
4. head SHA;
5. exact files changed;
6. exact field migration;
7. query allowlists;
8. tests run;
9. submission payload verification;
10. EN/RU parity verification;
11. no-JS verification;
12. responsive verification;
13. rollback SHAs;
14. intentionally untouched areas;
15. risks and unverified items;
16. commit title.

---

# 20. CURRENT READINESS

This specification is ready for owner approval as the first production prerequisite.

It does not authorize implementation until the owner approves the corrected Homepage V2 production scope and this Contact prerequisite.
