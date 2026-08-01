# Article 2 RU/EN — Implementation Handoff V1

## Canonical public files

### RU

`ARTICLE_02_RU_FINAL_CANDIDATE_V4_PUBLIC.md`

Route:

`/ru/insights/kak-vybrat-podryadchika-dlya-sayta-v-ssha/`

### EN

`ARTICLE_02_EN_FINAL_CANDIDATE_V4_PUBLIC.md`

Route:

`/insights/how-to-evaluate-a-website-proposal/`

## Canonical relationship

Each page must have:

- a self-canonical;
- reciprocal `hreflang`;
- an explicit language switch to the corresponding article;
- `x-default` pointing to EN unless the site-wide implementation standard selects another route.

Suggested annotations:

```html
<link rel="alternate" hreflang="en" href="https://proai-expert.com/insights/how-to-evaluate-a-website-proposal/">
<link rel="alternate" hreflang="ru" href="https://proai-expert.com/ru/insights/kak-vybrat-podryadchika-dlya-sayta-v-ssha/">
<link rel="alternate" hreflang="x-default" href="https://proai-expert.com/insights/how-to-evaluate-a-website-proposal/">
```

## Required implementation checks

- Render only the canonical public files.
- Never render implementation notes, decision logs, or review tasks.
- Use one H1 per page.
- Set `lang="ru"` and `lang="en"` correctly.
- Use localized title and meta description.
- Preserve the article-specific tables.
- Make wide Ledger/comparison tables horizontally usable or responsively transformed on mobile.
- Preserve semantic table headers and accessible reading order.
- Ensure source links remain attached to the relevant legal or technical claim.
- Use the site's existing external-link conventions.
- Point the CTA to the approved project-intake or proposal-review route.
- Do not imply legal review or guaranteed contractor quality.
- Do not add Financial Stream or Local Repair Pro modules unless separately approved.
- Do not add rankings, leads, conversion, revenue, or ROI claims.
- Add both URLs to the sitemap.
- Ensure internal links use the matching language route.

## Tables requiring special mobile QA

### RU

- scope/responsibility/acceptance table;
- Responsibility Matrix;
- rights/access/transfer table;
- Definition of Done evidence table;
- proposal comparison table with Source A/B/C.

### EN

- Proposal Risk Ledger;
- scope table;
- Responsibility Matrix;
- Business Control Map;
- Definition of Done evidence table;
- proposal comparison table with Source A/B/C.

## Schema

Use the site's existing `Article` or `BlogPosting` implementation.

Do not invent:

- ratings;
- review data;
- legal-review credentials;
- verified outcomes;
- performance results.

## Publication gate

Do not implement until:

1. consolidated Gemini review is complete;
2. the main author adjudicates all Gemini findings;
3. metadata and source links are finalized;
4. the implementation branch is created from the approved current base;
5. unrelated portfolio work is protected from overwrite.
