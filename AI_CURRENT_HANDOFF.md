# AI Current Handoff — ProAI Expert Website

**Статус:** единственный актуальный operational handoff репозитория  
**Обновлено:** 2026-08-04  
**Репозиторий:** `proaiexpert/proaiexpert.github.io`  
**Production branch:** `main`

## 1. Назначение

Этот файл фиксирует только текущее рабочее состояние, действующие authority-документы, актуальные ограничения и следующий одобренный этап.

Он не заменяет коммерческую стратегию, component specs, portfolio evidence records или будущую Site V2 implementation specification.

Всегда сначала получай актуальный SHA `main` и список открытых PR. SHA и PR, указанные в handoff, являются снимком состояния, а не постоянной константой.

## 2. Текущее стабильное состояние

На production опубликованы:

- двуязычный EN/RU сайт ProAI Expert;
- основные commercial routes;
- EN/RU Insights hubs и локализованные статьи;
- EN/RU Case Studies archive;
- Financial Stream case pair;
- Alina Horb case pair;
- Local Repair Pro case pair;
- централизованные Header System и Footer System;
- Jekyll build/deploy workflow;
- structured contact paths;
- canonical, reciprocal `hreflang`, `x-default`, sitemap и robots rules;
- responsive, keyboard, reduced-motion и no-JS safeguards в пределах реализованных page families.

Portfolio Master Polish V1 завершён. Три действующих case systems опубликованы и не требуют повторного проектирования без нового доказанного дефекта.

Financial Stream остаётся strongest live quantitative proof. Утверждённые GSC значения и ограничения хранятся в portfolio evidence records и текущем production source.

## 3. Последние крупные завершённые работы

К reconciliation baseline завершены:

- Portfolio Core и EN/RU Case Studies system;
- Financial Stream evidence refresh и live/browser verification;
- Commercial, Portfolio и Editorial migration на централизованный Footer System;
- cross-case navigation и service/contact transitions;
- premium editorial materials на homepage;
- текущая EN/RU Insights architecture и article integration.

Контрольный baseline на момент начала reconciliation:

`7e990536c41faa21b182d1db6e5100be13c75188`

Всегда проверяй более новый `main` перед работой.

## 4. Homepage source architecture

Текущие homepages используют Jekyll wrappers:

- `index.html`;
- `ru/index.html`.

Они подключают production snapshots:

- `_includes/homepage-current-en.html`;
- `_includes/homepage-current-ru.html`.

Правила:

- не удалять и не регенерировать snapshot includes случайно;
- broad homepage work должен либо учитывать эту архитектуру, либо заменять её только через отдельный проверенный migration plan;
- не возвращать obsolete homepage branches как источник production;
- homepage redesign требует отдельного Site V2 spec, prototype и независимого review.

## 5. Действующая authority chain

### 5.1 Repository operation

1. `AGENTS.md` — роли, безопасность, Git workflow, Builder/Reviewer rules.
2. `AI_START_HERE.md` — deterministic entrypoint для нового чата.
3. `AI_CURRENT_HANDOFF.md` — единственный current operational handoff.

### 5.2 Commercial authority

`docs/CLIENT_ACQUISITION_SOCIAL_AND_SALES_PLAN.md`

Это единственный commercial master plan. Он определяет:

- positioning;
- ICP и geography;
- commercial problems;
- offer ladder;
- entry-offer names, scope, exclusions и pricing;
- qualification, sales, proof и acquisition rules.

Не создавать параллельный commercial master plan.

### 5.3 Site program authority

`docs/site-evolution/PROAI_EXPERT_SITE_EVOLUTION_ROADMAP_V1.md`

Roadmap определяет порядок Site V2 workstreams, dependencies, gates и stop rules. Он не является разрешением на production implementation.

Будущий файл:

`docs/site-evolution/PROAI_EXPERT_SITE_V2_COMMERCIAL_ALIGNMENT_SPEC.md`

После отдельного owner-approved docs task он должен стать Site V2 implementation authority для IA, page structure, Hero, services, entry offers, CTA, contact routing, portfolio integration, measurement и route-level acceptance criteria.

На момент этого handoff файл ещё не создан.

### 5.4 Shared component authorities

- `docs/HEADER_SYSTEM_SPEC.md` — Header scope;
- `docs/FOOTER_SYSTEM_SPEC.md` — Footer scope.

Site V2 work не должно менять shared component architecture без отдельного component task и проверки активных PR.

### 5.5 Portfolio evidence authority

`docs/portfolio-case-packs/README.md`

Он определяет current project/evidence ownership и status classification. Текущий production source и датированные evidence records имеют приоритет над historical planning docs.

### 5.6 Reusable quality authority

`docs/website-production-factory/PREMIUM_SITE_EXPERIENCE_STANDARD.md`

Он определяет reusable premium quality rules: strategy before surface, proof discipline, responsive recomposition, natural localization, accessibility, performance, no-JS и reduced motion.

Site V2 spec должен ссылаться на этот standard, а не копировать его полностью.

## 6. Superseded documents

Следующие документы не являются current operational authority:

- `docs/PROAI_EXPERT_CURRENT_HANDOFF.md`;
- `docs/portfolio-case-packs/PORTFOLIO_SITE_AUDIT_AND_MASTER_PLAN.md`;
- `docs/portfolio-case-packs/PORTFOLIO_MASTER_POLISH_SYNTHESIS_V1.md`;
- `docs/portfolio-case-packs/PORTFOLIO_EXPERIENCE_BLUEPRINT.md`;
- `docs/portfolio-case-packs/local-repair-pro/LOCAL_REPAIR_PRO_CURRENT_HANDOFF.md`;
- `docs/portfolio-case-packs/alina-horb/ALINA_HORB_PSYCHOLOGIST_WEBSITE_PORTFOLIO_CASE_PACK_RU.md`.

Они сохраняются как historical/tombstone records. Их первоначальное содержание доступно в Git history.

Branch-only файлы, включая `PORTFOLIO_REBRAND_CURRENT_HANDOFF.md` и `PORTFOLIO_CASE_ART_DIRECTION_AND_MOTION_SYSTEM_V1.md`, не являются authority для `main` и не должны восстанавливаться как current документы.

## 7. Locked decisions

Без новых доказательств и owner approval не открывать заново:

- service-business positioning;
- Washington-first initial market;
- три capability pillars: Websites, Branding & Offer Clarity, AI & Automation;
- entry offers:
  - Website Trust & Conversion Sprint;
  - Lead Response Automation Sprint;
  - Brand & Offer Clarity Sprint;
- deprecated `Lead Fix Sprint`;
- technology is the implementation method, not the opening message;
- context before calendar;
- proof hierarchy и запрет unsupported rankings, leads, conversion, revenue и ROI;
- Financial Stream как real live benchmark;
- Alina Horb как real live related-party project с truthful evidence boundaries;
- Local Repair Pro как concept/in-development project, не client outcome;
- EN/RU intent parity и natural localization;
- отсутствие полного дублирования case narrative на homepage/service/archive;
- current Header/ Footer component ownership;
- Premium Site Experience Standard;
- отдельные branch/PR/review gates для production work.

## 8. Site V2 gaps, которые должен закрыть будущий spec

- final route and information architecture;
- Hero acceptance criteria;
- связь Websites, Branding & Offer Clarity и AI & Automation;
- canonical entry-offer pages/surfaces;
- homepage sequence;
- CTA taxonomy и contact routing;
- source/offer/language attribution;
- service → proof → case → contact paths;
- related-party disclosure rules;
- measurement event taxonomy;
- route-level responsive, accessibility, performance, SEO и no-JS acceptance matrix;
- controlled prototype and launch sequence.

## 9. Known unresolved decisions

До production implementation необходимо отдельно решить:

1. сохранить ли `/websites-branding/` как umbrella hub и какие отдельные offer routes добавить;
2. восстанавливать, заменять или окончательно не использовать historical ProAI Expert Studio Case routes;
3. final CTA/contact intent matrix;
4. analytics implementation inventory и privacy boundaries;
5. любые новые outcome claims — только через approved evidence process.

## 10. Следующий одобренный этап

После merge documentation reconciliation открыть отдельный docs-only task:

`TASK — PROAI EXPERT SITE V2 COMMERCIAL ALIGNMENT SPEC`

Цель:

- создать один implementation authority;
- не менять production HTML/CSS/JS;
- не проводить новый commercial strategy cycle;
- не переименовывать approved offers;
- зафиксировать IA, page requirements, CTA/contact matrix, proof integration, measurement и acceptance gates;
- остановиться до prototype/implementation.

## 11. Mechanical state rule

Перед каждой новой задачей:

1. fetch current `main` SHA;
2. inspect open PRs and changed-file scope;
3. read `AGENTS.md`, `AI_START_HERE.md`, этот handoff и task-specific authorities;
4. не использовать старые branch, SHA, PR descriptions или chat reports как current truth;
5. не редактировать `main` напрямую;
6. production-facing work проводить через dedicated branch, PR и independent review.