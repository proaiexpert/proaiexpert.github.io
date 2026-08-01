# Article 1 RU/EN — Implementation Handoff V1

## Canonical public files

### RU

`ARTICLE_01_RU_FINAL_CANDIDATE_V5_PUBLIC.md`

Route:

`/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/`

### EN

`ARTICLE_01_EN_FINAL_CANDIDATE_V4_PUBLIC.md`

Route:

`/insights/does-your-service-business-need-a-multilingual-website/`

## Canonical relationship

Each route:

- self-canonical;
- reciprocal `hreflang`;
- `x-default` should point to the EN route unless implementation strategy explicitly selects another default.

Suggested annotations:

```html
<link rel="alternate" hreflang="en" href="https://proai-expert.com/insights/does-your-service-business-need-a-multilingual-website/">
<link rel="alternate" hreflang="ru" href="https://proai-expert.com/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/">
<link rel="alternate" hreflang="x-default" href="https://proai-expert.com/insights/does-your-service-business-need-a-multilingual-website/">
```

## Required implementation checks

- public article only; never render implementation notes;
- one H1 per page;
- correct `lang` value: `ru` and `en`;
- localized title and description;
- corresponding language switch;
- reciprocal hreflang on both routes;
- sitemap includes both URLs;
- internal links point to the correct language route;
- external source links use safe attributes according to site convention;
- table markup is responsive and accessible;
- CTA goes to the approved project-intake route;
- Financial Stream case link remains blocked;
- no unsupported performance claims;
- verify mobile layout for long RU H1 and tables.

## Schema

Use the site’s existing Article/BlogPosting convention only.

Do not invent unsupported author, review, rating, or result data.

## Publication gate

Do not implement until:

1. Gemini review is complete;
2. metadata is finalized;
3. GitHub branch is created from the current approved base;
4. unrelated portfolio work is not overwritten.
