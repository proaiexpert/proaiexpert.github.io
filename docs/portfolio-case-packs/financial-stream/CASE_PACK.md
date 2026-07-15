# Financial Stream LLC — Portfolio Case Pack / Source of Truth

**Проект:** Financial Stream LLC  
**Исполнитель:** ProAI Expert  
**Статус документа:** внутренний source-of-truth для портфолио  
**Дата среза:** 15 июля 2026  
**Production:** https://financialstreamllc.com/  
**ProAI case page:** https://proai-expert.com/case-studies/financial-stream/  
**RU case page:** https://proai-expert.com/ru/case-studies/financial-stream/

---

## Правило актуальности и приоритет источников

Этот документ **не основан на старом ZIP-файле** и не должен обновляться из архивных сборок без отдельной проверки.

Приоритет источников:

1. текущий production-сайт `financialstreamllc.com`;
2. текущий `main` production-репозитория;
3. подтверждённые решения и результаты из проектного чата;
4. пользовательские скриншоты Google Search Console и Google SERP;
5. старые ZIP-сборки — только как исторический контекст, не как источник текущего состояния.

Если live-сайт конфликтует с прямым подтверждённым решением владельца бизнеса, например по payroll, источником истины для публичного портфолио является **подтверждённое бизнес-решение**, а конфликт live-сайта фиксируется как технический долг.

### Классы доказательств

| Код | Источник | Допустимое использование |
|---|---|---|
| `LIVE` | текущая production-страница | подтверждение публичной структуры и доступных путей |
| `REPO` | текущий production `main` | подтверждение технической реализации |
| `CHAT` | подтверждённая проектная история | роли, решения, автоматизации, ограничения |
| `SEO` | пользовательские скриншоты GSC/SERP | датированные SEO-показатели и ручная видимость |
| `NEEDS-PROOF` | информация без достаточного подтверждения | не использовать публично до проверки |

---

# 1. Executive Project Summary

## Точное название проекта

**Financial Stream LLC — Bilingual Digital Trust, SEO & Client Intake System**

Русская рабочая формулировка:

**Financial Stream LLC — двуязычная система доверия, SEO и приёма обращений для бухгалтерского бизнеса**

## Бизнес

**Financial Stream LLC** — бухгалтерский и налоговый сервисный бизнес в США.

## Владелец бизнеса

**Tetiana Horb** — владелец Financial Stream LLC и практикующий специалист, который работает с клиентами.

На публичных страницах также встречается написание **Tatiana**. Для портфолио необходимо выбрать одно написание и использовать его последовательно. Канонический вариант по проектной истории: **Tetiana Horb**.

## Роль ProAI Expert / Ihor

Ihor выступал как:

- стратег проекта;
- архитектор сайта и клиентского пути;
- автор структуры, UX-логики и автоматизационной архитектуры;
- координатор разработки, bilingual-архитектуры, SEO и QA.

Ihor **не позиционируется как практикующий бухгалтер** и не должен быть представлен как лицо, оказывающее бухгалтерские или налоговые услуги.

## Production URL

- EN: https://financialstreamllc.com/
- RU: https://financialstreamllc.com/ru/

## Языки

- English
- Russian

Архитектура построена как отдельные парные EN/RU страницы, а не как автоматический перевод одного шаблона.

## География

- база и локальный контекст: Washington State;
- основные локальные направления: Seattle, Federal Way и Washington;
- удалённая работа с клиентами по США.

## Целевая аудитория

- малый бизнес;
- self-employed и contractors;
- владельцы LLC и других бизнес-структур;
- частные лица, которым нужна подготовка налоговой декларации;
- русскоязычные и англоязычные клиенты в США;
- компании, которым нужно привести в порядок QuickBooks, документы, отчётность и налоговую подготовку.

## Публичный статус

- сайт опубликован и активен;
- EN/RU архитектура работает;
- существует сервисный слой, contact/intake, Start Here, blog/materials и legal pages;
- опубликованы новые bilingual article pairs;
- сайт используется как реальный клиентский проект и уже представлен на ProAI Expert.

## Текущая стадия

### Website
Рабочий production-проект с ongoing support и активным развитием контента.

### SEO
Индексируемый сайт с подтверждёнными показами, кликами и локальной русскоязычной видимостью. SEO ещё находится в ранней стадии роста, но уже даёт измеримые сигналы.

### Intake
Работает многоуровневая архитектура обращения:

1. глубокий structured intake через Google Form;
2. короткая форма на сайте;
3. календарь после получения контекста;
4. email/phone как fallback;
5. AI chat как дополнительная точка входа.

### Automation
Слой автоматизаций смешанный:

- Gmail draft assistant подтверждён проектной историей;
- Chatbase работает на сайте;
- Twilio/Make missed-call и SMS-логика проходили настройку и тестирование, но не должны публично описываться как полностью завершённая production-система без свежего evidence pack.

## Главный вывод для портфолио

Это не просто «бухгалтерский сайт». Самый сильный и точный framing:

> **Реальный двуязычный клиентский проект, где сайт, SEO-контент, формы, календарь, AI chat и коммуникационная архитектура собраны в одну систему доверия и приёма обращений.**

---

# 2. Verified Facts

## 2.1 Подтверждённые бизнес-факты

| Факт | Статус | Источник |
|---|---|---|
| Название бизнеса: Financial Stream LLC | подтверждено | `LIVE`, `CHAT` |
| Владелец: Tetiana Horb | подтверждено | `CHAT`, действующий ProAI case |
| Бизнес работает в США | подтверждено | `LIVE`, `CHAT` |
| Washington State — основной локальный контекст | подтверждено | `LIVE`, `CHAT` |
| Удалённая поддержка по США | подтверждено | `LIVE`, `CHAT` |
| Языки EN/RU | подтверждено | `LIVE`, `REPO` |
| Production URL | подтверждено | `LIVE` |
| Email: financialstreamllc@gmail.com | подтверждено | `LIVE` |
| Телефон: +1 (206) 430-3464 | подтверждено | `LIVE` |
| Название содержит LLC | подтверждено публично | `LIVE`; отдельная регистрационная выписка не приложена |

## 2.2 Канонический список услуг для публичного портфолио

**Payroll services не предоставляются.** Все старые payroll-упоминания считаются устаревшими или ошибочными и не должны попадать в portfolio case copy.

Допустимый список:

- регистрация, изменение и закрытие компании;
- EIN;
- business license / contractor license;
- бухгалтерский учёт в QuickBooks;
- ежемесячная категоризация и сверка;
- cleanup и catch-up bookkeeping;
- ежемесячные и квартальные отчёты;
- Sales Tax;
- Washington DOR;
- поддержка по документам и уведомлениям DOR / L&I, когда применимо;
- подготовка бизнес- и персональных налоговых деклараций;
- tax return preparation support;
- организация документов;
- financial consulting / document review;
- практический разбор следующего шага.

## 2.3 Payroll conflict register

На текущем live-сайте и на существующей ProAI case page всё ещё встречаются:

- `Payroll / L&I`;
- payroll как категория услуг;
- payroll в формах;
- payroll в статьях и сниппетах;
- payroll в текущем описании кейса ProAI Expert.

Это **не подтверждение услуги**, а текущий контентный конфликт.

### Portfolio rule

- не показывать payroll как услугу;
- не использовать скриншоты, где payroll является заметной сервисной карточкой;
- не писать, что ProAI Expert создал payroll service architecture;
- при необходимости описывать только **организацию payroll-related records** как часть бухгалтерского контекста, но не как отдельную услугу Financial Stream.

## 2.4 Подтверждённые способы обращения

- глубокий structured request через Google Form;
- короткая web-форма;
- Google Calendar appointment schedule после контекста;
- email;
- phone;
- optional SMS consent;
- Chatbase AI chat.

## 2.5 Публичные страницы и слои

- EN/RU home;
- EN/RU services hub;
- EN/RU service pages;
- EN/RU Start Here;
- EN/RU contact;
- EN/RU blog hubs;
- EN/RU article pages;
- privacy policy;
- terms;
- SMS consent;
- sitemap;
- robots.

## 2.6 Подтверждённые интеграции

| Интеграция | Что подтверждено | Ограничение |
|---|---|---|
| Formspree | endpoint настроен в short form | фактическую доставку свежей заявки нужно показать отдельным тестом |
| Google Form | ссылка встроена как основной deep intake | автоматический audit получил 401; нужен ручной end-to-end test |
| Google Calendar | ссылка ведёт на Google appointment schedule | нужен ручной тест бронирования |
| Chatbase | embed присутствует; был отдельный mobile layering fix | нужно снять актуальный live screenshot |
| Google Search Console | есть реальные Performance и Indexing данные | использовать только датированные показатели |
| Gmail + Make + OpenAI | draft assistant подтверждён проектной историей | нужен свежий sanitized screenshot |
| Twilio + Make | инфраструктура и сценарии настраивались и тестировались | не заявлять полную production-готовность без свежей проверки |

---

# 3. Client and Audience

## Клиент

Financial Stream LLC и её владелец Tetiana.

## Роли

### Tetiana
- владелец бизнеса;
- профессиональная бухгалтерская и налоговая сторона проекта;
- общается с клиентами;
- определяет фактический scope услуг;
- финально подтверждает публичные claims.

### Ihor / ProAI Expert
- стратегия;
- позиционирование;
- структура сайта;
- UX и conversion path;
- visual direction;
- bilingual architecture;
- SEO foundation;
- content architecture;
- forms и integrations;
- email automation;
- telephony/SMS architecture;
- QA и deployment coordination.

## Основная аудитория

1. **Русскоязычный малый бизнес в Washington**
   - Seattle;
   - Federal Way;
   - другие города Washington State.

2. **Англоязычный малый бизнес**
   - Washington;
   - remote U.S.

3. **Self-employed / contractors**
   - QuickBooks;
   - business records;
   - tax preparation;
   - notices и document readiness.

4. **Частные клиенты**
   - персональные налоговые декларации;
   - IRS letters/notices;
   - подготовка документов.

## Поведенческая особенность аудитории

Это trust-sensitive и document-heavy ниша. Клиент часто:

- не знает точное название услуги;
- приходит с несколькими связанными проблемами;
- имеет неструктурированные документы;
- не понимает, какие данные подготовить;
- хочет сразу позвонить, хотя без контекста звонок малоэффективен;
- может пытаться отправить чувствительные данные небезопасным способом.

Поэтому сайт должен не только продавать, но и:

- успокаивать;
- объяснять;
- маршрутизировать;
- собирать базовый контекст;
- снижать хаотичность входящего обращения.

---

# 4. Initial Business Challenge

## 4.1 Не просто презентация, а доверие

Бухгалтерский бизнес не может опираться только на красивую обложку. До первого контакта клиент должен увидеть:

- реальный бизнес;
- понятный scope;
- последовательность работы;
- документы и контекст, которые понадобятся;
- безопасный способ начать;
- язык, на котором ему удобно общаться.

## 4.2 Сложное предложение

Услуги связаны между собой:

- QuickBooks;
- cleanup;
- Sales Tax;
- DOR;
- tax return preparation;
- business setup;
- notices;
- document review.

Один общий блок «бухгалтерские услуги» не объясняет, куда идти пользователю.

## 4.3 Двуязычная аудитория

Простого language toggle недостаточно. Нужны:

- парные страницы;
- отдельные title/description;
- корректные canonical/hreflang;
- отдельные CTA;
- локализованный shell;
- отдельные EN/RU материалы;
- парная внутренняя перелинковка.

## 4.4 Неорганизованные обращения

До structured intake возможны:

- короткие сообщения без года и периода;
- звонки без описания задачи;
- отсутствие информации о типе бизнеса;
- попытки отправить чувствительные документы;
- лишняя переписка до понимания scope.

## 4.5 Календарь не должен быть первым шагом

Для бухгалтерских и налоговых запросов календарь без контекста создаёт неэффективные звонки.

Стратегическое решение:

> сначала structured request, затем call/calendar, когда базовый контекст понятен.

## 4.6 SEO-нужда

Тонкий brochure site недостаточен для:

- русскоязычных локальных запросов;
- Seattle / Federal Way;
- QuickBooks;
- tax preparation;
- IRS notices;
- Washington DOR;
- informational discovery.

Понадобился:

- service layer;
- local pages;
- blog/materials;
- article schema;
- bilingual keyword coverage;
- sitemap и indexable architecture.

---

# 5. Positioning Strategy

## Основное позиционирование

**Structured accounting and tax support for small businesses and individuals in the U.S.**

RU:

**Структурированная бухгалтерская и налоговая поддержка для малого бизнеса и частных клиентов в США.**

## Практическая ценность

Financial Stream помогает:

- собрать контекст;
- организовать документы;
- привести записи в порядок;
- понять следующий шаг;
- подготовить информацию к бухгалтерской или налоговой работе.

## Приоритетные услуги

1. QuickBooks bookkeeping;
2. cleanup / catch-up;
3. tax return preparation;
4. Sales Tax / DOR;
5. business setup / closure / documents;
6. financial consulting / document review.

## Дифференциация

- реальная EN/RU архитектура;
- Washington context + remote U.S.;
- structured intake;
- «context before calendar»;
- document-readiness guidance;
- глубокая content/SEO структура;
- несколько путей обращения;
- human-in-the-loop automation;
- спокойная, trust-first визуальная подача.

## Исключённые формулировки

- free consultation;
- 15-minute consultation;
- guaranteed tax result;
- guaranteed compliance;
- guaranteed refund;
- audit defense;
- penalty removal guarantee;
- legal representation;
- AI replaces accountant;
- fully automated accounting;
- любой неподтверждённый рост лидов, конверсии или revenue.

## Распределение ролей

Portfolio copy должна ясно показывать:

- Tetiana — владелец и специалист Financial Stream;
- ProAI Expert — стратегический и технический партнёр;
- Ihor не оказывал бухгалтерские услуги.

---

# 6. Visual Direction

## Концепция

Визуальный подход должен передавать:

- спокойствие;
- доверие;
- структуру;
- премиальность без показной роскоши;
- технологичность без AI-hype;
- финансовую аккуратность.

## Brand system

Подтверждённые логотипные варианты:

1. primary horizontal;
2. square;
3. round.

Канонический master business card: CLEAN Final v2.

## Цветовая система

Основной характер:

- deep navy / dark blue;
- blue-green financial accents;
- light neutral surfaces;
- glass / translucent cards;
- controlled gradients;
- high-contrast CTA.

## Typography

- современная sans-serif система;
- спокойная иерархия;
- хорошая читаемость длинных article pages;
- отдельная адаптация RU text length.

## Hero

Сильная сторона:

- визуализация сервисной системы;
- центральный hub;
- карточки направлений;
- ощущение организованного процесса.

### Ограничение

Существующий live hero и некоторые visual references содержат payroll. До public case refresh:

- не использовать payroll-labelled screenshot как главный proof;
- либо снять hero после исправления;
- либо выбрать clean crop без payroll;
- не переносить payroll в portfolio captions.

## Карточки услуг

Функция:

- превратить сложный scope в понятные направления;
- помочь посетителю определить ближайшую задачу;
- дать быстрый переход к service page или structured request.

## Trust elements

- спокойная подача;
- process steps;
- document readiness;
- bilingual access;
- contact options;
- legal pages;
- real business contact details;
- published materials.

## Desktop / mobile

Для портфолио нужно показать обе среды:

- desktop — architecture и visual depth;
- mobile — реальное использование, language switch, CTA, Chatbase, forms.

## Почему финальный подход сильнее шаблонного accounting site

Потому что он показывает не только:

- «кто мы»;
- «какие услуги».

Он показывает:

- как выбрать путь;
- какие документы нужны;
- как безопасно начать;
- что произойдёт после обращения;
- где читать материалы;
- как перейти к консультации после контекста.

---

---

## Source pack navigation

- [Part 1 — Executive summary through visual direction](CASE_PACK.md)
- [Part 2 — Website, intake, automation, implementation](CASE_PACK_PART_2_ARCHITECTURE.md)
- [Part 3 — Status, evidence, framing, claim restrictions](CASE_PACK_PART_3_EVIDENCE_AND_FRAMING.md)
- [Appendices — evidence register, claims matrix, definition of done](CASE_PACK_APPENDICES.md)
