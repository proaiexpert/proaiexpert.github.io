# FINANCIAL_STREAM_POST_LAUNCH_REVIEW_AND_IMPROVEMENT_BACKLOG_V1

> **Назначение:** единый source of truth для будущего refinement-pass опубликованного flagship case Financial Stream.  
> **Статус страницы:** V1 опубликована и технически завершена.  
> **Текущий production baseline:** `81954dc42afdbdd77d6b9212a84e3e233b8c536c`.  
> **Текущий маршрут:** `/case-studies/financial-stream/` и `/ru/case-studies/financial-stream/`.  
> **Последний опубликованный fix:** CTA grid и переход к первому screenshot; commit `81954dc42afdbdd77d6b9212a84e3e233b8c536c`.  
> **Основание:** семь независимых AI-аудитов, предыдущие art-direction и motion решения, production QA и решения владельца.  
> **Режим:** backlog only. Этот документ не разрешает немедленную реализацию, PR или публикацию.

---

## 0. Инструкция будущему агенту

Перед любой новой работой над Financial Stream:

1. Полностью прочитать этот файл.
2. Проверить актуальный `origin/main` и текущий live-render EN/RU.
3. Считать опубликованную страницу **закрытой V1**, а не незавершённым прототипом.
4. Не переписывать сильную public copy и не менять доказательства без новой проверки.
5. Не реализовывать все советы подряд. Использовать решения и приоритеты из этого документа.
6. Не копировать рекомендации, которые противоречат claims governance, performance, accessibility или утверждённой арт-дирекции.
7. Начинать будущий refinement только после завершения Alina Horb, Local Repair Pro и базовой Case Studies page, если владелец не изменит приоритет.
8. Создавать отдельную branch от свежего `origin/main`; не изменять `main` напрямую.
9. Сначала готовить visual prototype/review, затем implementation task, затем owner review, и только после этого publication task.

---

# 1. Executive verdict

## 1.1 Что подтвердили все семь аудитов

Financial Stream — сильнейшая текущая страница ProAI Expert по:

- смысловой глубине;
- честности;
- доказательности;
- структуре;
- системному мышлению;
- bilingual architecture;
- демонстрации реального production depth.

Общий консенсус:

> Контент уже соответствует flagship-уровню. Основной резерв роста находится не в переписывании текста, а в визуальной режиссуре, evidence hierarchy, navigation/progress, мобильной читаемости и согласовании всей остальной системы ProAI с уровнем этого кейса.

## 1.2 Главные сильные стороны, которые нельзя потерять

1. **Anti-hype copy.**  
   Human review, tested/partial/planned statuses, ограничения и отсутствие обещаний «магического AI» создают зрелое B2B-доверие.

2. **Structured Trust.**  
   Кейс показывает сайт, intake, content, bilingual routing и AI/workflow layers как одну систему, а не перечень услуг.

3. **Context before calendar.**  
   Это один из сильнейших собственных принципов ProAI Expert. Его следует сохранять и развивать как методологию.

4. **Доказательства вместо заявлений.**  
   Реальные screenshots, capture dates, GSC snapshot и индексированные страницы сильнее общих маркетинговых формулировок.

5. **Bilingual architecture как продукт.**  
   EN/RU показаны как парные маршруты и равноправные experiences, а не как перевод одной homepage.

6. **12-главная editorial architecture.**  
   Длина работает в плюс, потому что создаёт whitepaper/dossier depth. Укорачивать кейс ради краткости не требуется.

7. **Claims discipline.**  
   Никаких выдуманных lead, conversion, revenue, SEO ROI или autonomous-AI claims.

---

# 2. Принцип будущего refinement

Будущая V2-полировка должна действовать по формуле:

`сохранить смысл → улучшить ориентацию → усилить доказательства → добавить одну signature-систему → упростить mobile → проверить performance`

Не применять формулу:

`добавить как можно больше эффектов → превратить доказательства в dashboard → переписать copy → увеличить количество CTA`

Цель — не сделать страницу «эффектнее», а сделать её:

- легче читаемой;
- лучше режиссированной;
- быстрее воспринимаемой;
- более цельной с остальным сайтом;
- более убедительной без усиления claims.

---

# 3. Сводная карта рекомендаций

| Тема | Консенсус аудитов | Решение | Приоритет |
|---|---|---|---|
| Sticky TOC / progress | Часто рекомендован для 12 глав | Прототипировать как slim chapter rail на desktop и compact progress на mobile; не считать обязательным до UX-test | P1 |
| Before → after | Несколько аудитов отметили недостаточно явную трансформацию | Добавить один компактный transformation frame в Challenge/Brief без выдуманных «старых проблем» | P1 |
| Five-layer system diagram | Почти единогласная рекомендация | Сделать одну минималистичную архитектурную схему как главный visual system proof | P1 |
| Evidence hierarchy | Все аудиты хотят более быстрое считывание | Собрать 3–5 доказательств в restrained evidence composition, не dashboard | P1 |
| Signature motion | Все видят недостаток режиссуры | Выбрать одну signature-систему и максимум 2–3 supporting effects | P1 |
| Screenshot breakout | Рекомендован editorial breakout | Использовать на 2–3 ключевых proof surfaces, не на каждом screenshot | P1 |
| Quote treatment | Рекомендовано усилить owner perspective | Допустимо только с реальной утверждённой цитатой; большой serif block, без декоративного театра | P2 |
| Final CTA | Часть аудитов считает финал слабым | Сохранить один primary + один subordinate live link; усилить композицию, не добавлять fake form | P1 |
| GSC context | Предложено назвать 19 clicks «нормальным стартом» | Не использовать: это оценочный и неподтверждённый claim | Reject |
| New business outcomes | Предлагались enquiries, time saved, conversion | Не публиковать без доказательств | Reject until evidence |
| Permanent grid / cyan line | Часто предложено как signature | Только локально и статично/редко; запретить постоянную animated grid и continuous line | Evaluate |
| Sticky evidence panel | Предложено несколькими аудитами | Тестировать только в system chapter; не закреплять 4–6 badges на всей странице | P2 experiment |
| Dark ↔ light transitions | Аудиты видят жёсткость переходов | Использовать локальные controlled transitions; не перекрашивать страницу случайно | P1 |
| Progressive one-field form | Один аудит предложил встроить в final CTA | Не добавлять рабочую форму внутрь case; вести в canonical project intake | Reject |
| More screenshots | Предлагались mobile bilingual pairs | Добавлять только при новой доказательной функции; не увеличивать длину ради количества | P2 |
| Schema | Рекомендовано | Решать portfolio-wide, не отдельным несогласованным patch | P1 global |
| Filters | Предлагались для archive | Не использовать при 3–4 cases; рассмотреть после 6 materially different cases | Later |
| A/B testing | Предложено | Только при достаточном трафике, analytics и одной измеримой гипотезе | Later |
| Downloadable PDF case | Предложено | Возможный sales asset после завершения portfolio system | Later |

---

# 4. Future Financial Stream refinement backlog

## P0 — отсутствует

У опубликованной V1 нет подтверждённого критического дефекта после последнего CTA/transition fix.

Новые P0 появляются только если обнаружены:

- broken route;
- broken CTA;
- unreadable content;
- horizontal overflow;
- inaccessible menu/focus;
- missing evidence asset;
- production regression.

## P1 — следующий осмысленный refinement pass

### P1.1. Chapter orientation system

**Проблема:** 12 глав создают depth, но читатель может потерять положение.

**Вариант для прототипа:**

- desktop: slim left or right chapter rail;
- active chapter label;
- clickable anchors with accessible focus;
- mobile: compact current-chapter indicator or progress line;
- no sticky dependency for reading;
- page remains complete without JavaScript.

**Не делать:**

- крупное навигационное меню поверх кейса;
- permanent rail, закрывающий screenshots;
- scroll-jacking;
- обязательную smooth-scroll animation under reduced motion.

### P1.2. One transformation frame

Добавить один компактный `Before / System after` frame near Challenge/Brief.

Допустимое содержание:

**Before / initial condition**

- fragmented service explanation;
- uncertainty before first conversation;
- disconnected intake and scheduling;
- bilingual/content/automation layers not operating as one visible system.

**After / delivered system**

- trust architecture;
- service clarity;
- structured request before calendar;
- bilingual route system;
- content and controlled automation layers.

Это должно быть factual architecture comparison, а не fake visual of an old website and not a quantified business outcome.

### P1.3. Five-layer system visualization

Это главный кандидат на дополнительный visual proof.

Required layers:

1. Trust / positioning.
2. Service architecture.
3. Structured intake.
4. Content / search foundation.
5. Human-reviewed AI/workflow layer.

Preferred visual behavior:

- thin connected structure;
- one active layer at a time;
- supporting screenshot or caption changes in sequence;
- no animated counters;
- no complex funnel metaphor;
- no false CRM/automation dashboard;
- no WebGL;
- mobile becomes a vertical sequence.

### P1.4. Evidence composition

Собрать evidence не как dashboard, а как restrained editorial exhibit.

Recommended evidence groups:

- real live project status;
- EN/RU production architecture;
- dated GSC snapshot;
- dated indexed-pages snapshot;
- human-reviewed / tested / partial capability status;
- live-site link.

Rules:

- every metric includes date and scope;
- no count-up;
- no green «success» color unless it means a verified status;
- no claim that 19 clicks is strong, weak, normal or industry-leading;
- disclaimer remains visible but moves into concise source/footnote treatment where possible;
- maximum 3–5 facts in one composition.

### P1.5. Signature motion selection

Choose **one** signature family for Financial Stream V2:

#### Candidate A — Signal Path

- one restrained cyan path connecting five system layers;
- local node activation;
- not continuously moving;
- on mobile: static/short vertical guide.

#### Candidate B — Grid Assembly

- faint local grid appears during hero/system entry;
- modules align to it;
- grid does not remain permanently animated;
- no snap-to-scroll behavior.

#### Candidate C — Evidence Dossier

- exhibit label appears first;
- proof surface resolves second;
- source/date resolves third;
- best fit for GSC and route evidence.

**Preferred combination:** one signature candidate + screenshot reveal + restrained chapter progress. Not Signal Path + permanent Grid + sticky panels + multiple parallax systems simultaneously.

### P1.6. Screenshot editorial breakout

Use wider-than-copy proof surfaces selectively:

- hero/homepage proof;
- five-layer/system proof;
- one bilingual pair;
- one final live-system frame.

Rules:

- copy column remains readable;
- screenshot may break out into a wider visual grid;
- no perspective device mockup;
- no unreadable full-page thumbnail;
- no heavy blur;
- natural aspect ratio;
- responsive sources and explicit dimensions.

### P1.7. Final CTA composition

Target hierarchy:

1. Primary: `Discuss a similar system` / exact canonical RU equivalent.
2. Secondary: `View the live website ↗`.
3. Optional tertiary text link: back to all cases.

Rules:

- one clear primary action;
- no inline fake intake form;
- no three equal heavy buttons;
- bounded CTA wrapper;
- landscape/tablet/desktop can use two balanced columns;
- portrait stacked;
- external arrow is visible and may move subtly on hover/focus.

### P1.8. Local dark/light transitions

The case may use project-specific light proof surfaces, but:

- transitions happen at deliberate chapter/module boundaries;
- shell remains coherent;
- no arbitrary full-page color oscillation;
- no hard flash from black to white;
- use a short threshold, edge, mat or large evidence surface to mediate the change;
- reduced motion uses the final static state.

### P1.9. Accessibility, performance and schema

- validate 200% zoom;
- verify focus-not-obscured with any chapter rail;
- keep practical 44 px controls;
- test no-JS and reduced motion;
- preload only the actual LCP candidate;
- use responsive images and lazy loading below fold;
- avoid blur/filter-heavy screenshot entry on mobile;
- use transform/opacity only for motion;
- handle schema through the portfolio-wide schema system.

## P2 — optional experiments after portfolio completion

### P2.1. Owner quote treatment

Only if a real quote is supplied and publication-approved:

- large serif quotation;
- substantial whitespace;
- owner name/role;
- source status;
- no word-by-word animation;
- no invented testimonial language.

### P2.2. Additional mobile bilingual proof

Add only when it proves a new point, such as:

- route parity;
- contextual language switch;
- mobile intake behavior.

Do not add another screenshot merely because there is empty space.

### P2.3. Sticky system proof

A limited sticky panel may be tested only in the five-layer chapter if:

- it improves understanding;
- it does not duplicate the current sticky chapter behavior;
- mobile uses normal flow;
- no content becomes inaccessible without JS.

### P2.4. PDF / mini-report

After all primary cases are finalized, produce a separate sales PDF based on the web case. It must not become the source of truth and must inherit the same claims limits.

---

# 5. Recommendations explicitly rejected or qualified

## 5.1 “19 clicks is a normal organic start”

Reject. There is no approved benchmark establishing that interpretation for this site, niche and time window.

Approved pattern:

> In a three-month Google Search Console snapshot reviewed in July 2026, the site recorded 19 clicks and approximately 4.17K impressions.

No evaluative adjective is added.

## 5.2 Business outcomes without evidence

Do not add:

- increased enquiries;
- reduced manual correspondence;
- higher call conversion;
- time saved;
- stronger revenue;
- improved customer satisfaction;
- SEO growth.

These may be added only from dated owner evidence with scope and methodology.

## 5.3 Permanent cyan grid and continuous signal animation

Do not create:

- permanent animated technical grid;
- continuous cyan line following the reader for the entire page;
- motion that competes with screenshots and copy;
- a visual system that makes every future case look like Financial Stream.

Grid/line may be local and case-specific.

## 5.4 Embedded progressive form inside the case

Reject for V2. The case CTA should lead to the canonical structured ProAI intake. A second form creates duplicated logic, accessibility burden, analytics fragmentation and maintenance risk.

## 5.5 Filters for the archive with three cases

Reject until at least six materially different cases exist. With three or four cases, editorial staging is stronger than filtering.

## 5.6 Testimonials everywhere

Only real, approved testimonials belong on the site. Do not invent trust signals to fill layouts.

---

# 6. Implications for the rest of ProAI Expert

The audits consistently found a quality gap: Financial Stream is more concrete and mature than the surrounding homepage/service pages.

Future site-wide work should:

1. Move homepage language from broad capability claims toward proof-backed clarity.
2. Feature Financial Stream as one flagship proof module without duplicating the full case.
3. Connect Insights articles to relevant cases through contextual internal links.
4. Present founder/studio context clearly on About without turning it into self-promotion.
5. Standardize service pages around:
   - problem;
   - system;
   - process;
   - evidence;
   - limits;
   - next step.
6. Make the ProAI project intake an exemplar of `context before calendar`.
7. Apply one coherent shell, motion language, CTA hierarchy and evidence discipline across all cases.
8. Preserve distinct project-specific art directions.

---

# 7. Correct production sequence

Unless the owner changes priority:

1. Keep Financial Stream V1 live and stable.
2. Build Alina Horb case from its final spec.
3. Build Local Repair Pro / handyman case.
4. Build the Case Studies archive page.
5. Complete shared homepage/service/archive integration.
6. Run portfolio-wide shell, motion, accessibility, performance and schema pass.
7. Return to this Financial Stream backlog.
8. Select only approved P1 improvements.
9. Prototype and review before code integration.
10. Publish through a separate explicit task.

---

# 8. Future refinement task boundary

A future implementation task must:

- start from current `origin/main`;
- use a new feature branch;
- preserve EN/RU content and 12 chapters unless owner approves copy changes;
- preserve current header, cube, menu and footer;
- identify exact P1 items being implemented;
- avoid unrelated site changes;
- include before/after screenshots of the case page itself;
- run mobile, landscape, tablet, desktop, no-JS, reduced-motion, keyboard and performance QA;
- return for owner review;
- not create PR or publish without separate authorization.

---

# 9. Final control statement

Financial Stream is not waiting for urgent repair. It is a successful published V1 and a reference case for the next portfolio stage.

This backlog exists to prevent useful audit insights from being lost and to ensure that a later refinement is selective, evidence-safe and consistent with the full ProAI portfolio system.