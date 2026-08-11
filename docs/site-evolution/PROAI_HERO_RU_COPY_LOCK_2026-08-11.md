# ProAI Expert Hero — Russian Copy Lock

Date: 2026-08-11  
Status: **CURRENT RU HERO COPY LOCK / DISCUSSION BASELINE**  
Scope: **HERO ONLY**  
Branch: `agent/hero-layered-25d-static-r1`

This document fixes the current Russian Hero communication so it is not silently changed in later design or implementation passes.

It does **not** authorize production changes, deployment, merge, motion work, or redesign of the rest of the homepage.

---

# 1. Russian Hero — current locked copy

## Eyebrow

`AI-СИСТЕМЫ · АВТОМАТИЗАЦИЯ · ПРЕМИАЛЬНЫЕ САЙТЫ`

## H1

`От первого впечатления до результата — одна система.`

**H1 rule:** this is one continuous sentence/string. Do not insert an editorial hard line break into the copy. Responsive layout may wrap naturally when required by viewport width, but the text itself is not a two-line slogan.

## Supporting copy

`Создаём премиальные сайты для компаний в сфере услуг и соединяем их с AI-системами и автоматизацией. Клиенту проще понять ваши услуги и обратиться с нужной информацией, а вам — быстрее отвечать и меньше тратить времени на рутину. Важные решения остаются за человеком.`

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

# 2. What changed in the supporting copy

Previous version:

`Создаём премиальные сайты для компаний в сфере услуг и соединяем их с AI-системами и автоматизацией. Клиенту проще понять ваши услуги и обратиться, а вам — получать нужную информацию, быстрее отвечать и тратить меньше времени на повторяющиеся задачи. Важные решения остаются за человеком.`

Current locked version:

`Создаём премиальные сайты для компаний в сфере услуг и соединяем их с AI-системами и автоматизацией. Клиенту проще понять ваши услуги и обратиться с нужной информацией, а вам — быстрее отвечать и меньше тратить времени на рутину. Важные решения остаются за человеком.`

Reason for change:

- preserves the same commercial meaning;
- removes duplicated explanation of information capture;
- makes the inquiry stage more concrete: the client reaches out **with the needed information**;
- shortens `повторяющиеся задачи` to the more natural Hero-level `рутину`;
- keeps human control as the closing trust statement;
- improves scan speed without weakening the integrated website + AI + automation positioning.

---

# 3. Independent semantic comparison — РЕЗУЛЬТАТ vs FOLLOW-THROUGH

`FOLLOW-THROUGH` is **not** the same as `follow-up`.

Its closest practical meaning in this context is:

`доведение начатого до конца / последовательное выполнение следующих шагов`.

## FOLLOW-THROUGH — strengths

- operationally precise;
- describes continuation after the first response;
- avoids sounding like a guarantee of a commercial business outcome;
- closes the English phrase `From first impression to follow-through` naturally.

## FOLLOW-THROUGH — weaknesses for Russian localization

A literal Russian equivalent becomes long and weak for a premium Hero:

- `доведение до конца`;
- `последующие действия`;
- `сопровождение следующих шагов`;
- `доведение следующих шагов до конца`.

These are less immediate, less memorable, and visually heavier than one strong noun.

## РЕЗУЛЬТАТ — strengths

- one short, strong business word;
- immediately understandable in Russian;
- gives the four-stage journey a clear endpoint;
- creates a clean semantic loop with the H1: `От первого впечатления до результата — одна система.`;
- reads more confidently and more naturally in a premium Russian Hero.

## РЕЗУЛЬТАТ — risk

The word can theoretically sound broader than the system can guarantee. That risk is controlled by the surrounding copy, which makes no revenue, conversion, lead, or business-success guarantee and explains the actual operational value: better inquiry context, faster response, less routine work, human control.

## Decision

For the **Russian Hero**, keep:

`04 РЕЗУЛЬТАТ`

Do not replace it with a literal translation of `FOLLOW-THROUGH`.

English and Russian may remain localized counterparts rather than mechanical translations.

---

# 4. Scope lock

This document concerns only the Russian Hero communication.

Do not use it as authorization to:

- modify production `/index.html` or `/ru/index.html`;
- change the Hero visual concept;
- change the rest of the homepage;
- merge or deploy;
- begin motion implementation.
