# PROAI EXPERT — Websites & Branding R2 / Site Quality Opportunity Register

**Дата:** 2026-10-08  
**Статус:** `PLANNING ONLY / HOLD / NOT APPROVED FOR IMPLEMENTATION`  
**GitHub tracking:** [Issue #188](https://github.com/proaiexpert/proaiexpert.github.io/issues/188)  
**Репозиторий:** `proaiexpert/proaiexpert.github.io`  
**Baseline inspection:** `bd4b01ed73464615a794038982989b109bfb47db` (историческая контрольная точка; перед работой обязательно перечитать свежий `main`).  
**Предполагаемый будущий трек:** Websites & Branding R2, с отдельными задачами для cross-site QA.  
**Масштаб текущего действия:** сохранение планов без изменений сайта, copy, CSS, JS, изображений, SEO, production.

## 1. Решение / зачем сохраняем

Независимая внешняя рекомендация содержит полезные идеи: актуализация скриншотов, корректная атрибуция реального отзыва, три гипотетические продуктовые линии Signature / Business / Essential и самостоятельный UX/CRO-аудит. Анализ свежего кода и опубликованных страниц подтвердил релевантность **аудита**, но не доказал необходимость немедленного полного редизайна.

**Принцип:** новая работа должна улучшать коммерческую ясность, фактические доказательства и качество перехода к заявке, **не разрушая** уже утверждённые premium-системы главной. Это backlog, а не обязательства Builder.

## 2. Текущее состояние, проверенное по main и live

- Главная: Hero / Connected System / Two Worlds R5 R3.2 / Technology Fold→Flow R1.5.1 / Financial Stream proof / Home System Execution R2 / Selected Thinking R2.4 / Selected Work / Golden Footer. Не начинать старые R4.2 Two Worlds эксперименты заново.
- Technology уже организована как `UNDERSTAND → ORCHESTRATE → COMMUNICATE → DELIVER`; внешняя рекомендация о функциональной группировке технологий здесь **выполнена**.
- Websites & Branding: действующая отдельная EN/RU услуга. Страница подробно раскрывает trust, authority, composition, process, но коммерческие deliverables и различия между типами клиентов требуют отдельной UX/CRO-проверки.
- AI Systems: действующая EN/RU услуга с capability families, implementation protocol и сценариями. Не смешивать концептуальную демонстрацию с доказанными live-операциями.
- Мerged PR #187 уже усилил внутренние ссылки service→Insights. Не оформлять эту задачу повторно.
- Insights: `Selected Thinking R2.4` и `Insights Editorial V2 R2.1` — принятая архитектура; остальные статьи на старой системе мигрируют только по отдельному разрешению.
- Portfolio: Financial Stream — реальный клиентский кейс; Alina Horb — реальный live-проект; Local Repair Pro — независимый demo/build, не выдавать за оплаченный клиентский кейс.
- Старые документы (`docs/HOMEPAGE_PREMIUM_UPGRADE_BACKLOG.md`, `PRODUCTION-AUTHORITY.md`, отдельные case manifests) содержат полезную историю, но их даты/базовые версии не должны заменять проверку свежего `main`.

## 3. Register приоритетов

| ID | Приоритет | Решение сейчас | Будущий gate |
|---|---|---|---|
| WB-01 | P1 | Сохранить задачу аудита всех снимков и визуальных доказательств | Asset ledger + EN/RU QA + Owner approval |
| WB-02 | P1 | Проверить содержательную ясность Websites & Branding, не redesign автоматически | Independent UX/CRO report |
| WB-03 | P1 | Исследовать Signature / Business / Essential, без публикации оффера | Profitability + scope + positioning gate |
| PR-01 | P1 | Проверить даты и непротиворечивость proof-метрик | Verified evidence ledger |
| FS-01 | P2 | Сохранить полное имя в отзыве предварительно; проверить прозрачность | Relationship facts + consent + Owner-approved copy |
| AI-01 | P2 | Оценить один проверенный сквозной пример системы | Real sanitized implementation evidence |
| SEO-01 | P2 | Проверить отдельные service OG/social карточки | Before/after share-preview audit |
| HOME-01 | P2 | Сделать интеграционный QA по стыкам блоков; не общий редизайн | Reproducible defect/proof-based proposal |
| ED-01 | P2 | Проверить навигацию и статус маркировки кейсов/статей | EN/RU parity + evidence gate |
| DOC-01 | P3 | Позже актуализировать устаревшие authority/backlog документы | Documentation-only separate task |

## 4. WB-01 — устаревшие скриншоты и Showcase

В `websites-branding/index.html` сейчас явно используются:
- `/assets/img/cases/financial-stream/fs-home-desktop-en-1600w.webp`
- `/assets/img/cases/financial-stream/fs-home-mobile-en-640w.webp`
- `/assets/showcase/wbcs-hero-en.jpg`
- `/assets/showcase/wbcs-proai-en.jpg`

Проверить соответствующие RU assets, все EN/RU showcase размещения, Case Studies, Home Selected Work, Financial Stream, социальные/OG изображения и capture references. **Наличие старого файла не доказывает, что он визуально устарел:** сравнивать сам кадр с текущим опубликованным состоянием, проверять intended historical/evidence role.

Для каждого актива фиксировать: путь, URL источника, где используется, date/capture version, locale, desktop/mobile/orientation, viewport, what it proves, verified/current/historical/unknown, crop risk, proposed new file, Owner approval, provenance. Не заменять доказательные GSC снимки косметическими изображениями и не уничтожать исторические материалы.

## 5. WB-02 — Websites & Branding CRO R2

Гипотеза: с текущим акцентом на `authority`/`trust` посетителю может быть трудно быстро понять конкретные результаты, ограничения, пакет работ и входной шаг. Это **вопрос для исследования**, а не объявленный дефект.

Сценарный тест первых 5–10 секунд: (a) кого обслуживаем; (b) что именно делаем; (c) какие факты/кейсы подтверждают; (d) какой формат работы; (e) что делать дальше. Проверить структуру `hero → deliverables → proof → process → inquiry`, сквозную навигацию к кейсам, дублирующуюся абстрактную copy, форму/CTA, мобильную понятность, locale parity. Принести конкретные находки с URL, viewport, screen/context, impact, recommendation; без голых экспертных баллов.

## 6. WB-03 — три продуктовых направления: только гипотеза

- **Signature** — индивидуальные premium/flagship решения, точный scope по аудитории и глубине.
- **Business** — основной профессиональный сегмент с понятным результатом и стандартом поставки.
- **Essential** — упрощённые сайты для малого бизнеса только при реально ограниченном, экономически оправданном scope.

Проверить, соответствуют ли сегменты фактической производственной модели и спросу. Оценить deliverables, границы редизайна/брендинга/контента, языковые версии, CRM/intake, SEO, поддержку, доступы, ownership и post-launch. **Не придумывать и не публиковать** цены, SLA, результаты, inclusions/guarantees. Essential не должен выглядеть как «дешёвый flagship» или обесценивать premium позиционирование. Возможный исход исследования — сократить до двух направлений или отказаться от tiering.

## 7. FS-01 — Financial Stream testimonial

Публичный отзыв сейчас атрибутирован: **Tetiana Horb — CEO, Financial Stream LLC**. Временное решение: оставить правдивое имя и профессиональную роль. Совпадение фамилий само по себе не устанавливает семейную/деловую связь, но если материальная связь действительно существует, нужно проверить факты, релевантность прозрачной ненавязчивой формулировки и согласовать её с владельцем/автором отзыва.

Не скрывать потенциально существенную связь искусственным удалением фамилии; не заявлять независимость без проверки; не менять дословную цитату без согласования.

## 8. PR-01 — Financial Stream proof freshness

В опубликованной главной присутствует исторически датированный proof: `EN + RU`, `8.36K` impressions, `52` indexed pages, 6-month window, August 2026. При этом `docs/portfolio-case-packs/financial-stream/SCREENSHOT_MANIFEST.md` называет «current» более старые данные августа 4: `57 clicks / 7.24K impressions` и `50 indexed`. Это **документальная несогласованность дат/статуса «current»**, не доказательство неверной публичной метрики.

Создать журнал источников GSC с snapshot date, metric/window, verified screenshots, where reused (Home/Case/README/OG/Docs). Обновлять публичные значения только после подтверждения нового источника; не смешивать 3-, 6-месячные окна, не обещать трафик/лиды/ROI.

## 9. SEO-01 — service-specific social preview

Исходные EN страницы `websites-branding/index.html` и `ai-systems/index.html` ссылаются на `proai-home-og-en-r1-1.png`. Это может быть намеренный фирменный fallback. Исследовать, улучшит ли отдельный сервисный OG image восприятие LinkedIn/соцсетей и соответствие ожиданиям, с EN/RU parity, versioned assets, cache QA, canonical/hreflang. Не менять SEO/social metadata без отдельно принятого задания.

## 10. AI-01 — не повторять абстрактные capability diagrams

Вместо второй очереди общих обещаний изучить маленький **санитизированный и фактически подтверждённый** сценарий: intake → routing → AI-assisted preparation → human approval → next action. Чётко обозначить статус live/tested/partial/demo. Никаких фиктивных dashboards, партнёрств, вымышленных ROI, автономной отправки сообщений без фактов. AI Systems Boxes Hover/Spline — отдельное исторически изолированное R&D, здесь не трогать.

## 11. HOME-01 / ED-01 — проверка существующей главной без редизайна

Провести только интеграционный QA в EN/RU:
1. Hero: value proposition, single primary CTA, воспринимаемая скорость первого экрана; не добавлять второй декоративный motion engine.
2. Connected System: понятность причинно-следственного перехода от impression к next action.
3. Two Worlds R5: forward/reverse/re-entry, mobile portrait/landscape, без возврата к старому R4.2 эксперименту.
4. Technology R1.5.1: понятное группирование инструментов уже есть; проверить readability, disclaimer и переход к Financial Stream.
5. Financial Stream: актуальность screenshot+metrics+review и переход в полноценный кейс.
6. Home System Execution R2: ясность границ human authority, отсутствие воспринимаемого «фальшивого продакшн dashboard» и accessibility скрытых альтернативных состояний.
7. Selected Thinking R2.4: parity с Insights Editorial V2, читаемость/нет лишней дубликации.
8. Selected Work: реальные статусы Financial Stream, Alina Horb, Local Repair Pro и достаточность proof.
9. Header/Footer: утверждённый Site Shell; не возвращаться к legacy markup.

Все возможные дефекты отдельно ранжировать как `verified defect` или `opportunity`. Без внедрения по итогам этого документа.

## 12. Activation contract

Для будущей отдельной задачи:
1. новый live/main SHA и scope ownership;
2. inventory + UX/CRO baseline до изменения;
3. экономически обоснованный tiers verdict;
4. screenshot/evidence provenance and quote-consent review;
5. статические EN/RU композиции на desktop + 390×844 portrait + 844×390 landscape;
6. независимые Builder/Reviewer и owner preview;
7. никакого merge/deploy до одобрения владельца;
8. при отсутствии доказанного выигрыша — **ничего не менять**.

**Этот документ не является разрешением на редизайн и не изменяет текущую product authority.**
