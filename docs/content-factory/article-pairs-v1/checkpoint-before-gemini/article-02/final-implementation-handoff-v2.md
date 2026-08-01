# Article 2 RU/EN — Final Implementation Handoff V2

**Authoritative metadata:**  
`FINAL_ARTICLE_ROUTES_AND_METADATA_MANIFEST_V1.md`

## Canonical public files

- RU: `ARTICLE_02_RU_FINAL_CANDIDATE_V4_PUBLIC.md`
- EN: `ARTICLE_02_EN_FINAL_CANDIDATE_V5_PUBLIC.md`

## Routes

- RU: `/ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/`
- EN: `/insights/how-to-evaluate-a-website-proposal/`

## Superseded RU working route

`/ru/insights/kak-vybrat-podryadchika-dlya-sayta-v-ssha/`

Before implementation:

- search the repository, sitemap, generated pages, and current production site for this route;
- if it was never published, do not create it;
- if it was published or indexed, add a permanent redirect to the authoritative RU route;
- update stale internal links, canonical, hreflang, and sitemap references.

## Canonical and hreflang

Each route must:

- be self-canonical;
- include self-referencing `hreflang`;
- include the corresponding `ru` and `en` annotation;
- use fully qualified URLs;
- use the same reciprocal annotation set on both pages.

## x-default

Add `x-default` only if the approved site-wide internationalization strategy defines a fallback route.

If EN is the intended fallback, use the EN route. Do not treat `x-default` as universally required.

## Content boundaries

Keep Article 2 limited to:

- proposal completeness;
- proposal / SOW / contract reconciliation;
- scope;
- responsibility and client input;
- external dependencies;
- document traceability;
- acceptance evidence;
- rights, access, and transfer;
- revisions, changes, defects, and maintenance.

Do not expand into:

- warranties;
- remedies;
- termination;
- indemnification;
- governing law;
- dispute resolution;
- contract templates;
- full vendor-fit or reference-check methodology.

## Required implementation checks

- render only canonical public files;
- use manifest metadata exactly;
- set correct `lang`;
- preserve Copyright Office, ICANN, and W3C sources beside relevant claims;
- preserve `Acceptance evidence` terminology across EN tables;
- preserve separate source fields for compared proposals;
- make wide tables responsive without losing header associations;
- add both routes to sitemap;
- use language-specific internal links;
- route CTA to the approved proposal-review/project-intake destination;
- do not imply legal review or guaranteed contractor quality.
