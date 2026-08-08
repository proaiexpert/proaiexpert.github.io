# ProAI Expert — Hero R3 Owner-Candidate Browser QA

Date: 2026-08-08

Status: **R3 BUILDER QA — BLOCKED**

Repository: `proaiexpert/proaiexpert.github.io`

This record covers the isolated R3 owner-candidate preview implementation only. It does not authorize production integration, owner approval, COPY LOCK, merge, deployment, or Homepage-wide work.

## Verified refs

- Canonical `main` SHA used: `c945084e1952c05c686494091f7dbca0f7acdf08`
- Canonical `main` was rechecked before this QA record and remained identical to that SHA.
- R2 base branch: `agent/hero-c-shape-grounding-polish-r2`
- Verified R2 base SHA: `edbfb860b577a74bdfd0515c3474ad3e66c060eb`
- R3 branch: `agent/hero-r3-owner-candidate-browser`
- R3 implementation candidate inspected before this QA record: `228399c0a4c6da6b8de55d880f63f7f1921da5c4`
- Required real-browser test of that commit: **NOT COMPLETED — runtime environment blocker described below**

## Changed files

Implementation:

1. `hero-a-plus-c-shape-preview/index.html`
2. `ru/hero-a-plus-c-shape-preview/index.html`
3. `assets/css/hero-c-shape-owner-candidate-r3.css`

QA record:

4. `docs/site-evolution/PROAI_EXPERT_HERO_R3_OWNER_CANDIDATE_BROWSER_QA_2026-08-08.md`

No R2 Core asset, R2 environment include, R2 grounding CSS, Hero JavaScript, shared Header System file, production Homepage route, sitemap, canonical/hreflang layer, or unrelated page was modified.

## Implementation verification

GitHub diff from verified R2 base to the implementation candidate contained exactly three implementation files:

- new R3 override CSS;
- EN preview copy/metadata/semantic rail update;
- RU preview copy/metadata/semantic rail update.

The R3 stylesheet is loaded after:

1. `assets/css/hero-c-shape-a-plus.css`
2. `assets/css/hero-c-shape-grounding-r2.css`

The shared Header System include remains the R2 implementation path and the preview locale links remain reciprocal:

- EN preview → `/ru/hero-a-plus-c-shape-preview/`
- RU preview → `/hero-a-plus-c-shape-preview/`

## EN copy verification

Source-level verification: **PASS**.

Implemented exactly:

- Eyebrow: `AI SYSTEMS · AUTOMATION · PREMIUM WEBSITES`
- H1: `From first impression to follow-through — one connected system.`
- Support: `We build premium websites for service businesses and connect them with AI systems and automation. Customers can understand your services and reach out with the right information; you can respond faster and spend less time on repetitive work. You stay in control where judgment matters.`
- Primary CTA: `Request a Private Review`
- Microcopy: `Briefly describe the challenge. We’ll recommend where to start.`
- Secondary CTA: `View Work`
- Accountability: `Washington-based · Working across the U.S. · EN / RU / UA`
- Rail: `TRUST / INQUIRY / RESPONSE / OUTCOME`

`follow-through` was preserved. Historical `No pressure`, three-benefit H1 text, `TRUST / PRESENCE`, and `FOLLOW-UP` were removed from the EN preview.

## RU copy verification

Source-level verification: **PASS**.

Implemented exactly:

- Eyebrow: `AI-СИСТЕМЫ · АВТОМАТИЗАЦИЯ · ПРЕМИАЛЬНЫЕ САЙТЫ`
- H1: `От первого впечатления до результата — одна система.`
- Support: `Создаём премиальные сайты для компаний в сфере услуг и соединяем их с AI-системами и автоматизацией. Клиенту проще понять ваши услуги и обратиться, а вам — получать нужную информацию, быстрее отвечать и тратить меньше времени на повторяющиеся задачи. Важные решения остаются за человеком.`
- Primary CTA: `Запросить разбор`
- Microcopy: `Коротко опишите задачу. Мы предложим, с чего разумнее начать.`
- Secondary CTA: `Смотреть проекты`
- Accountability: `Штат Вашингтон · Работаем по всей США · EN / RU / UA`
- Rail: `ДОВЕРИЕ / ОБРАЩЕНИЕ / ОТВЕТ / РЕЗУЛЬТАТ`

Historical `Без давления`, three-benefit H1 text, `ДОВЕРИЕ / ПРИСУТСТВИЕ`, and `ДАЛЬНЕЙШАЯ СВЯЗЬ` were removed from the RU preview.

## Accessible semantic description

Updated in both locales so the screen-reader-only journey matches the current rail semantics:

- EN: `01 TRUST. 02 INQUIRY. 03 RESPONSE. 04 OUTCOME.`
- RU: `01 ДОВЕРИЕ. 02 ОБРАЩЕНИЕ. 03 ОТВЕТ. 04 РЕЗУЛЬТАТ.`

## Eyebrow readability implementation

Source-level assessment: **implemented as requested; browser confirmation blocked**.

R3 override targets approximately 13 px desktop and 11.7–12 px mobile, with medium/semibold-equivalent weight, restrained tracking, and wrapping allowed on narrow screens. It explicitly overrides the older R2 mobile microtype sizing rather than reducing the eyebrow further.

## H1 line-count / composition implementation

Source-level assessment: **implemented for controlled browser wrapping; visual confirmation blocked**.

- Desktop keeps the two semantic spans from the owner candidate and allows the longer first span to wrap naturally when required.
- Mobile changes the spans to inline flow and uses balanced wrapping so the statement is not forced into an artificial two-line lock.
- EN/RU receive separate responsive sizing to keep visual weight reasonably aligned without literal typographic mirroring.

Exact line counts at the required viewports remain **UNVERIFIED** until real-browser screenshots are available.

## Support measure implementation

Source-level assessment: **PASS for intended measure; visual confirmation blocked**.

- EN maximum measure: approximately `575px` desktop.
- RU maximum measure: approximately `565px` desktop.
- Mobile returns to the single-column copy width with controlled line-height and does not widen support copy merely to reduce line count.

## Core / environment grounding

Source-level preservation: **PASS**.

R3 does not modify:

- `assets/css/hero-c-shape-grounding-r2.css`
- `_includes/hero-c-shape-r2/environment-r2.html`
- `_includes/hero-c-shape-r2/env-*`
- `assets/img/hero-c-shape/core-static-master-isolated.avif`
- `assets/img/hero-c-shape/core-static-master-isolated.webp`
- `assets/js/hero-c-shape-a-plus.js`

No independent Core scale, rotation, pointer tilt, bobbing, parallax, or relative motion was introduced. The registered Layer A / Layer B physical-scene model remains intact in source.

Required browser confirmation of floor/contact grounding, hard environment boundaries, alpha halo, detached appearance, and sharp edge fidelity is **BLOCKED**.

## Rail hierarchy implementation

Source-level assessment: **PASS; browser confirmation blocked**.

The rail uses the current four short semantic anchors. Desktop label sizes were modestly increased/normalized for readability while remaining subordinate to the H1/Core. Mobile keeps the two-column rail model with short labels and slightly improved readable type sizing.

## Required browser viewport matrix

The task requires:

| Locale | Viewport | Result |
|---|---:|---|
| EN | 1440 × 900 | **NOT RUN — BLOCKED** |
| RU | 1440 × 900 | **NOT RUN — BLOCKED** |
| EN | 390 × 844 | **NOT RUN — BLOCKED** |
| RU | 390 × 844 | **NOT RUN — BLOCKED** |
| EN/RU | 1366 desktop/laptop | **NOT RUN — BLOCKED** |
| EN/RU | 1024 tablet landscape | **NOT RUN — BLOCKED** |
| EN/RU | 768 tablet | **NOT RUN — BLOCKED** |
| EN/RU | 430 mobile | **NOT RUN — BLOCKED** |

## Screenshot names / locations

Mandatory owner-review screenshots were **not produced** because the required built branch could not be loaded in the available browser runtime.

Expected evidence names reserved for the next successful browser pass:

- `proai-hero-r3-en-desktop-1440x900.png`
- `proai-hero-r3-ru-desktop-1440x900.png`
- `proai-hero-r3-en-mobile-390x844.png`
- `proai-hero-r3-ru-mobile-390x844.png`

If the mobile Hero extends below one viewport, add full-Hero captures in addition to these four required viewport images.

## Runtime blocker

The available execution environment contains Chromium, but external browser/network access is administratively blocked. A direct Chromium navigation attempt returned `net::ERR_BLOCKED_BY_ADMINISTRATOR`.

The same environment cannot fetch/clone the public GitHub repository through local `git` because external DNS/network access is unavailable. GitHub source inspection and branch writes remain available only through the connected GitHub App. That connector can read the implementation and binary assets but does not provide a local checkout or a directly mountable built-site artifact for Chromium.

No PR was created because the task explicitly forbids creating a production PR at this gate. No deploy or Pages source change was attempted.

Because the required real browser could not load the actual R2 registered environment/Core asset stack, substituting placeholders or reconstructed screenshots would not be valid owner-review evidence. The Builder therefore stops at the browser-QA gate rather than misrepresenting incomplete evidence as a pass.

## No-JS sanity

Browser result: **NOT RUN — BLOCKED**.

Source-level sanity:

- Hero HTML content is present without dependence on Hero JavaScript.
- The `hero-cshape-has-js` class is added only by inline JavaScript; without JS the whole-scene reveal is therefore not activated.
- R2 Core/environment markup remains in the document independently of Hero JS.

Inherited Header System behavior: at mobile widths the shared navigation overlay is opened by shared Header System JavaScript. Any no-JS mobile-menu limitation is inherited and outside R3 scope, exactly as defined by the task.

## Reduced-motion sanity

Browser emulation result: **NOT RUN — BLOCKED**.

Source-level sanity:

- R2 already disables the whole-scene reveal under `prefers-reduced-motion: reduce`.
- R3 repeats that safeguard without adding any new animation.
- R3 introduces no Core movement.
- Shared Header System files were not modified; their canonical reduced-motion rules remain intact.

## Overflow / CLS / accessibility observations

Browser confirmation: **NOT RUN — BLOCKED**.

Source-level observations:

- Existing `overflow-x: clip`, `min-width: 0`, intrinsic Core dimensions, and R2 source registration remain unchanged.
- R3 does not add absolute-positioned copy or transforms that would intentionally create horizontal overflow.
- Existing focus-visible rules for Hero controls and Header System remain unchanged.
- Semantic H1 remains a single `h1` element.
- The visible rail remains `aria-hidden="true"` with a matching screen-reader-only semantic journey.
- Core/environment intrinsic dimensions remain present, so R3 does not remove the existing geometry reservation used to limit CLS.

These observations are not a substitute for the required browser checks.

## Remaining defects / unverified gates

No implementation defect is currently proven by source inspection.

The unresolved gate is evidence completeness:

1. mandatory real-browser desktop/mobile screenshots are missing;
2. line-count and visual balance at the required viewports are unverified;
3. Core/environment grounding cannot be visually re-certified after the copy/layout change;
4. horizontal overflow, clipping, CTA/Core/rail collisions and material CLS are not browser-certified;
5. no-JS and reduced-motion behavior are not runtime-certified.

## Scope deviations

Implementation scope: **none**.

QA scope: **required real-browser execution and screenshots could not be completed because of the runtime network/build-artifact limitation described above**.

No locked file was modified. No Core/environment asset bytes were changed.

## Gate

**R3 BUILDER QA — BLOCKED**

Do not treat this record as `OWNER APPROVED`, `COPY LOCK`, production readiness, or permission to integrate the Hero into production.
