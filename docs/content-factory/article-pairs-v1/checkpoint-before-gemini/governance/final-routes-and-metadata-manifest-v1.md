# ProAI Expert — Final Article Routes and Metadata Manifest V1

**Status:** AUTHORITATIVE SOURCE OF TRUTH  
**Prepared:** 2026-08-01  
**Scope:** Four final website-acquisition article routes

Do not derive route or metadata values from older implementation notes, drafts, pair QA documents, chat messages, or archived files.

## Article 1 — Multilingual website decision

### RU

**Canonical public file:**  
`ARTICLE_01_RU_FINAL_CANDIDATE_V5_PUBLIC.md`

**Route:**  
`/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/`

**H1:**  
Сайт для русскоязычного бизнеса в США: только английский, отдельный русский раздел или две версии?

**SEO title:**  
Сайт для русскоязычного бизнеса в США: какой вариант выбрать

**Meta description:**  
Как выбрать между сайтом на английском, отдельной русской поддержкой и полноценной RU/EN-системой для бизнеса в США — без лишнего объёма.

**HTML lang:**  
`ru`

### EN

**Canonical public file:**  
`ARTICLE_01_EN_FINAL_CANDIDATE_V4_PUBLIC.md`

**Route:**  
`/insights/does-your-service-business-need-a-multilingual-website/`

**H1:**  
Does Your U.S. Service Business Need a Multilingual Website?

**SEO title:**  
Does Your Service Business Need a Multilingual Website?

**Meta description:**  
Choose between English-only, focused language support, and full multilingual coverage based on real demand, service capacity, and maintenance.

**HTML lang:**  
`en`

## Article 2 — Website proposal evaluation

### RU

**Canonical public file:**  
`ARTICLE_02_RU_FINAL_CANDIDATE_V4_PUBLIC.md`

**Route:**  
`/ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/`

**H1:**  
Как проверить подрядчика и предложение на сайт в США — и снизить риск переделки

**SEO title:**  
Как проверить подрядчика и предложение на разработку сайта

**Meta description:**  
Как сравнить предложения на сайт: объём работ, ответственность, доступы, лицензии, приёмка, запуск и поддержка — до подписания договора.

**HTML lang:**  
`ru`

**Route note:**  
The previous working route `/ru/insights/kak-vybrat-podryadchika-dlya-sayta-v-ssha/` is superseded.  
If the previous route was never published, do not create it.  
If repository or production inspection shows that it was published, linked, indexed, or included in a sitemap, add a permanent redirect to the authoritative route.

### EN

**Canonical public file:**  
`ARTICLE_02_EN_FINAL_CANDIDATE_V5_PUBLIC.md`

**Route:**  
`/insights/how-to-evaluate-a-website-proposal/`

**H1:**  
How to Evaluate a Website Proposal Before You Sign

**SEO title:**  
How to Evaluate a Website Proposal Before You Sign

**Meta description:**  
Compare website proposals by scope, responsibilities, ownership, acceptance, and support—not page count or price alone.

**HTML lang:**  
`en`

## hreflang rules

For each pair:

- use fully qualified URLs;
- include self-referencing `hreflang`;
- include the corresponding `ru` and `en` versions;
- use the same language-annotation set on both pages;
- keep annotations reciprocal;
- keep each page self-canonical.

## x-default rule

`x-default` is conditional, not mandatory.

Add `x-default` only if the approved site-wide internationalization strategy defines a fallback route. If EN is the intended fallback experience, the EN article URL may be used. Do not add `x-default` automatically merely because an RU/EN pair exists.

## Render rule

Publish only the four canonical public files listed above.

Never render:

- implementation notes;
- pair QA;
- review tasks;
- decision logs;
- editorial status;
- internal evidence gates;
- workflow instructions.

## Claim rules

Do not add unsupported claims about:

- rankings;
- traffic;
- leads;
- conversion lift;
- revenue;
- ROI;
- Google Maps placement;
- guaranteed contractor quality;
- guaranteed dispute avoidance.
