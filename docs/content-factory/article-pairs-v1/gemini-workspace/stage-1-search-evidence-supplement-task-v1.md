# TASK — STAGE 1 SEARCH EVIDENCE SUPPLEMENT V1

## Purpose

The first Gemini report produced a useful creative direction but did not provide enough verifiable Google/Search evidence.

Complete only this focused supplement.

Do not repeat the full creative report.
Do not rewrite articles.
Do not change metadata.
Do not begin Stage 2 or Stage 3.

## Read first

Repository:

`proaiexpert/proaiexpert.github.io`

Branch:

`article-pairs-gemini-stage-v1`

Read:

1. `docs/content-factory/article-pairs-v1/gemini-workspace/reports/stage-1-google-search-and-creative-report-v1.md`
2. `docs/content-factory/article-pairs-v1/gemini-workspace/reports/stage-1-main-author-adjudication-v1.md`
3. the four canonical checkpoint articles;
4. `checkpoint-before-gemini/governance/final-routes-and-metadata-manifest-v1.md`;
5. the current public ProAI Expert Insights indexes.

## Research date and market

State the exact research date.

For every tested query record:

- country/market;
- language;
- device assumption or interface;
- location setting if available;
- whether results were personalized or not known;
- whether the result came from live Google Search, another search product, or a model inference.

Never label model inference as an observed Google result.

## Queries to test

### Article 1 RU

Test at minimum:

- `сайт для русскоязычного бизнеса в сша`
- `нужен ли русский язык на сайте в сша`
- `двуязычный сайт для бизнеса в сша`
- `сайт на русском и английском для бизнеса`

### Article 1 EN

Test at minimum:

- `does my business need a multilingual website`
- `does a local business need a bilingual website`
- `multilingual website for service business`
- `bilingual website customer journey`

### Article 2 RU

Test at minimum:

- `как проверить предложение на сайт`
- `что должно быть в предложении на разработку сайта`
- `как проверить подрядчика по разработке сайта в сша`
- `договор на создание сайта в сша что проверить`

### Article 2 EN

Test at minimum:

- `how to evaluate a website proposal`
- `how to compare web design proposals`
- `what should be included in a website proposal`
- `website proposal evaluation checklist`
- `website RFP evaluation matrix`

### Geographic probes

Test selectively:

- `multilingual website Seattle service business`
- `bilingual website design Seattle`
- `website proposal review Seattle`
- Russian-language equivalents that produce meaningful results.

Do not force a geographic recommendation if the results do not support one.

## Required evidence table

For every query provide:

| Query | Market/language | Search intent | Top relevant results | Result type | PAA observed | AI Overview observed | Notes |

For `Top relevant results`, include up to five directly relevant URLs with publisher and page title.

Do not list irrelevant results merely to fill the table.

## Competitive evidence

For each article route identify:

1. at least five relevant competing pages when available;
2. publisher type;
3. content format;
4. major headings or decision framework;
5. actual strength;
6. actual gap;
7. whether ProAI Expert already covers the gap;
8. whether a proposed addition would cannibalize another ProAI Expert topic.

## PAA and SERP features

Record only features actually observed.

Include:

- exact PAA question wording;
- featured snippets;
- videos;
- forums;
- local packs;
- AI Overviews;
- shopping/software results;
- other meaningful modules.

If a feature was not observed or access was unavailable, say so.

## Official technical verification

Provide current official links and a one-sentence supported conclusion for:

- multilingual and multi-regional sites;
- hreflang self-reference and reciprocity;
- fully qualified URLs;
- x-default;
- canonicalization across language variants;
- locale-adaptive pages;
- visible language versus HTML lang;
- sitemap inclusion;
- Article/BlogPosting structured data;
- W3C language-of-page and language-of-parts guidance;
- accessibility evaluation limitations;
- U.S. copyright initial ownership and transfer;
- work made for hire;
- ICANN registrant/registrar relationship.

Use primary sources only for these technical conclusions.

## Current-site crawl and cannibalization

Inspect the current public routes:

- `https://proai-expert.com/insights/`
- `https://proai-expert.com/ru/insights/`

List relevant existing articles and their apparent query ownership.

Do not rely solely on a stored handoff if the public route has changed.

## Metadata evidence gate

For each proposed H1/title/meta/slug change from the first report, choose:

- KEEP CURRENT;
- CHANGE — EVIDENCE SUPPORTED;
- TEST ONLY;
- WITHDRAW RECOMMENDATION.

Support every `CHANGE` with:

- observed query language;
- SERP-title pattern;
- intent benefit;
- cannibalization effect;
- exact replacement.

## Required output

Save the complete supplement as:

`docs/content-factory/article-pairs-v1/gemini-workspace/reports/stage-1-search-evidence-supplement-v1.md`

Required sections:

# EVIDENCE VERDICT

# RESEARCH DATE AND METHOD

# QUERY EVIDENCE TABLES

# ARTICLE 1 RU — COMPETITIVE EVIDENCE

# ARTICLE 1 EN — COMPETITIVE EVIDENCE

# ARTICLE 2 RU — COMPETITIVE EVIDENCE

# ARTICLE 2 EN — COMPETITIVE EVIDENCE

# PAA AND SERP FEATURES

# OFFICIAL TECHNICAL SOURCES

# CURRENT PROAI EXPERT CANNIBALIZATION CHECK

# METADATA EVIDENCE GATE

# CORRECTIONS TO THE FIRST REPORT

# FINAL EVIDENCE-BACKED RECOMMENDATIONS

## GitHub write rules

- create only the one supplement report file;
- do not modify the first report;
- do not modify the adjudication;
- do not modify checkpoint articles or governance;
- do not create a PR;
- return only status, commit SHA, direct link, and one-sentence summary in Telegram.

## Honesty rule

If live Google Search access, localization, PAA, or AI Overview visibility is unavailable, state the limitation explicitly.

A transparent incomplete observation is preferable to a fabricated SERP claim.