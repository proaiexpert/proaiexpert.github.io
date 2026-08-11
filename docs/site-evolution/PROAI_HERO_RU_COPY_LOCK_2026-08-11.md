# ProAI Expert Hero — Russian Copy Lock

Date: 2026-08-11  
Status: **FINAL RU HERO COPY LOCK**  
Scope: **HERO ONLY**  
Branch: `agent/hero-layered-25d-static-r1`

This document fixes the final agreed Russian Hero communication so it is not silently changed in later design or implementation passes.

It does **not** authorize production changes, deployment, merge, motion work, or redesign of the rest of the homepage.

---

# 1. Final Russian Hero copy

## Eyebrow

`AI-СИСТЕМЫ · АВТОМАТИЗАЦИЯ · ПРЕМИАЛЬНЫЕ САЙТЫ`

## H1

`От первого впечатления до результата — одна система.`

**H1 rule:** this is one continuous sentence/string. Do not insert an editorial hard line break into the copy. Responsive layout may wrap naturally when required by viewport width, but the text itself is not a two-line slogan.

## Supporting copy

`Создаём премиальные сайты для компаний сферы услуг и соединяем их с AI и автоматизацией. Клиенту проще понять ваши услуги и обратиться с нужной информацией, вам — быстрее ответить и меньше заниматься рутиной. Ключевые решения — за вами.`

## Primary CTA

`Запросить разбор`

## CTA microcopy

`Коротко опишите задачу. Мы предложим, с чего разумнее начать.`

## Secondary CTA

`Смотреть проекты`

## Accountability

`Штат Вашингтон · Работаем по всей США · EN / RU / UA`

## Four-stage journey

1. `ДОВЕРИЕ`
2. `ОБРАЩЕНИЕ`
3. `ОТВЕТ`
4. `РЕЗУЛЬТАТ`

Canonical semantic chain:

`ДОВЕРИЕ → ОБРАЩЕНИЕ → ОТВЕТ → РЕЗУЛЬТАТ`

---

# 2. Final H1 decision

Selected:

`От первого впечатления до результата — одна система.`

Why it stays:

- `система` is the strongest semantic anchor for a studio connecting premium websites, AI and automation;
- `одна` is shorter and more direct than `единая`;
- the em dash preserves one continuous idea: the full span from first impression to result is handled as one connected system;
- it maps cleanly to the visual four-stage journey and the System Core concept;
- alternatives such as `весь путь клиента`, `единый путь`, `всё работает вместе`, `всё связано` and `через одну систему` either weaken the technology/system anchor, become more generic, or become more explanatory.

The punctuation remains an em dash, not a forced split into `От первого впечатления до результата. Одна система.` The split version is punchier but makes `Одна система.` more product-like and more semantically detached from the first clause.

---

# 3. Final supporting-copy decision

Previous longer version:

`Создаём премиальные сайты для компаний в сфере услуг и соединяем их с AI-системами и автоматизацией. Клиенту проще понять ваши услуги и обратиться с нужной информацией, а вам — быстрее отвечать и меньше тратить времени на рутину. Важные решения остаются за человеком.`

Final version:

`Создаём премиальные сайты для компаний сферы услуг и соединяем их с AI и автоматизацией. Клиенту проще понять ваши услуги и обратиться с нужной информацией, вам — быстрее ответить и меньше заниматься рутиной. Ключевые решения — за вами.`

Why this version:

- keeps the bespoke-studio verb `Создаём` instead of turning the support copy into a product fragment;
- keeps the audience qualifier `компании сферы услуг`;
- simplifies `AI-системы и автоматизация` to `AI и автоматизация` because the H1 already carries the system concept;
- preserves the important inquiry-quality idea `обратиться с нужной информацией`;
- compresses the business benefit to `быстрее ответить и меньше заниматься рутиной`;
- changes the passive/general `важные решения остаются за человеком` into the more direct owner-facing `Ключевые решения — за вами.`;
- reduces density without reducing the Hero to vague brand language.

No fixed rule such as “support copy must be 1–1.5 lines” is treated as authoritative; line count depends on viewport, type size and measure. The acceptance criterion is fast scanning, clean hierarchy and preservation of the core meaning.

---

# 4. Stage lock

For Russian Hero:

`ДОВЕРИЕ → ОБРАЩЕНИЕ → ОТВЕТ → РЕЗУЛЬТАТ`

`РЕЗУЛЬТАТ` remains the final Russian fourth stage. Do not replace it with a literal localization of `FOLLOW-THROUGH`.

---

# 5. Scope lock

This document concerns only the Russian Hero communication.

Do not use it as authorization to:

- modify production `/index.html` or `/ru/index.html`;
- change the Hero visual concept;
- change the rest of the homepage;
- merge or deploy;
- begin motion implementation.
