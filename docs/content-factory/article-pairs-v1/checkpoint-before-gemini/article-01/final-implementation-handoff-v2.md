# Article 1 RU/EN — Final Implementation Handoff V2

**Authoritative metadata:**  
`FINAL_ARTICLE_ROUTES_AND_METADATA_MANIFEST_V1.md`

## Canonical public files

- RU: `ARTICLE_01_RU_FINAL_CANDIDATE_V5_PUBLIC.md`
- EN: `ARTICLE_01_EN_FINAL_CANDIDATE_V4_PUBLIC.md`

## Routes

- RU: `/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/`
- EN: `/insights/does-your-service-business-need-a-multilingual-website/`

## Canonical and hreflang

Each route must:

- be self-canonical;
- include self-referencing `hreflang`;
- include the corresponding `ru` and `en` annotation;
- use fully qualified URLs;
- use the same reciprocal annotation set on both pages.

## x-default

Add `x-default` only if the approved site-wide internationalization strategy defines a fallback route.

If EN is the intended fallback experience, the EN article URL may be used. `x-default` is not mandatory merely because the pair exists.

## Financial Stream evidence gate

The RU public article may retain the unlinked Financial Stream architecture module because the live site currently verifies:

- separate EN and RU routes;
- corresponding service/navigation structures;
- multiple contact paths;
- a unified brand system.

Do not add a public Financial Stream case-study link until the case passes separate service-scope and outcome-claim correction.

Do not infer traffic, rankings, leads, conversion, revenue, or ROI.

If implementation-time verification shows that the named architecture facts are no longer observable, remove the Financial Stream module rather than weakening the evidence standard.

## Required implementation checks

- render only canonical public files;
- use one H1;
- set `lang="ru"` / `lang="en"`;
- use manifest metadata exactly;
- preserve contextual Google and W3C sources;
- language switch must open the corresponding article;
- do not force a locale redirect that blocks direct access;
- add both routes to sitemap;
- keep tables semantically marked and responsive;
- route CTA to the approved project-intake destination;
- do not add general Local SEO, AI Search, GBP, or broad website-strategy content.
