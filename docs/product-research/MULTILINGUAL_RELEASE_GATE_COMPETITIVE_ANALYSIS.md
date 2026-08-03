# Multilingual Release Gate — Competitive Analysis and MVP Decision

**Status:** Product research complete · Implementation not started  
**Reviewed:** 2026-08-03  
**Owner:** ProAI Expert

## Executive decision

Build the product only as a **narrow multilingual release gate**, not as another general SEO crawler.

The defensible position is:

> A framework-agnostic CLI and GitHub Action that validates an explicitly expected multilingual route map against built HTML or a deployment preview, then fails a pull request when canonical, `hreflang`, language-pair, sitemap, or indexing signals conflict.

This is materially different from a generic “enter a URL and receive an SEO score” product.

## Market reviewed

### 1. `navasnseo/hreflang-auditor`

Repository: https://github.com/navasnseo/hreflang-auditor

Current strengths:

- focused hreflang CLI;
- self-reference, `x-default`, code-format, duplicate-target, return-link, and reachability checks;
- optional sitemap mode;
- Markdown and JSON output;
- Python test suite and MIT license.

Current gap relevant to ProAI Expert:

- canonical/hreflang conflict detection is still listed as roadmap work;
- sitemap support is described as experimental;
- it audits discovered markup but does not define an explicit expected locale/route contract for a repository;
- no first-class GitHub pull-request annotation and release-gate product position is documented.

### 2. `soamee/astro-i18n-audit`

Repository: https://github.com/soamee/astro-i18n-audit

Current strengths:

- fast route-parity audit;
- strict exit code for CI;
- zero dependencies;
- simple GitHub Actions example.

Current gap relevant to ProAI Expert:

- limited to Astro directory conventions;
- checks source-route coverage rather than deployed canonical, hreflang, sitemap, redirect, and `noindex` agreement;
- does not validate live alternate targets or cross-page reciprocity.

### 3. `seo-skills/seo-audit-skill` / SEOmator

Repository: https://github.com/seo-skills/seo-audit-skill

Current strengths:

- broad website audit product;
- hundreds of rules across SEO, performance, security, accessibility, and AI/GEO categories;
- crawl mode, multiple report formats, configuration, persistent history, and CI/CD support;
- internationalization rules include return links, noindex targets, non-canonical targets, broken targets, redirects, duplicate codes, and language mismatch.

Current gap relevant to ProAI Expert:

- deliberately broad and comparatively heavy;
- not optimized around a small multilingual release contract;
- the product value is full-site auditing rather than fast pre-merge enforcement of expected localized route clusters.

### 4. `janreges/siteone-crawler`

Repository: https://github.com/janreges/siteone-crawler

Current strengths:

- mature cross-platform crawler;
- native binary, rich reports, sitemap input, quality scoring, and configurable CI failure thresholds;
- broad SEO, security, accessibility, performance, export, cloning, and DevOps capabilities.

Current gap relevant to ProAI Expert:

- broad crawler rather than multilingual-route contract validator;
- no product emphasis on repository-owned expected language clusters and pull-request-specific remediation.

### 5. Lighthouse CI

Repository: https://github.com/GoogleChrome/lighthouse-ci

Current strengths:

- established regression gate for Lighthouse categories and budgets;
- designed for commit and pull-request workflows.

Current gap relevant to ProAI Expert:

- not a multilingual architecture validator;
- does not replace route-pair, reciprocal hreflang, canonical-cluster, sitemap/noindex, or alternate-target validation.

## Confirmed opportunity

The reviewed market already covers:

- general SEO crawling;
- individual hreflang audits;
- framework-specific translation coverage;
- broad CI quality gates.

The remaining useful gap is the combination of all four characteristics below:

1. **Expected-route contract** — the repository declares which URLs belong to each locale cluster.
2. **Framework independence** — validation runs against built HTML or a deployment preview, not a single framework’s source layout.
3. **Signal reconciliation** — canonical, hreflang, HTML language, redirects, `noindex`, and sitemap membership are checked together.
4. **Pull-request enforcement** — deterministic annotations and exit codes make the result usable as a required status check.

This gap is narrow enough to avoid competing with full crawlers and useful enough to demonstrate ProAI Expert’s multilingual architecture and automation capabilities.

## Recommended product definition

### Working name

**Multilingual Release Gate**

Recommended repository slug:

`multilingual-release-gate`

A GitHub repository search performed on 2026-08-03 found no exact repository-name match for this phrase. The final npm package name must still be checked immediately before publication.

### One-line promise

> Prevent broken multilingual releases by validating the route contract and search signals before merge.

### Primary users

- developers maintaining multilingual static or pre-rendered sites;
- agencies shipping localized service-business websites;
- SEO engineers who need deterministic CI checks rather than another dashboard;
- ProAI Expert projects before indexing, migration, or domain changes.

## v0.1.0 scope

Ship the CLI and GitHub Action together because the release-gate workflow is the differentiator.

### Supported inputs

1. built static directory;
2. deployment-preview base URL;
3. optional sitemap URL;
4. repository configuration file containing expected locale clusters.

### Proposed configuration

```yaml
version: 1
base_url: https://example.com
x_default: en

clusters:
  home:
    en: /
    ru: /ru/
  services:
    en: /services/
    ru: /ru/services/
  contact:
    en: /contact/
    ru: /ru/contact/

policy:
  require_self_canonical: true
  require_self_hreflang: true
  require_reciprocal_hreflang: true
  require_x_default: true
  require_sitemap_membership: true
  fail_on: error
```

The explicit cluster map is intentional. The tool should validate declared product intent rather than guessing which translated slug corresponds to another page.

### Required v0.1.0 rules

| Rule ID | Rule |
|---|---|
| `MRG001` | Expected locale route is missing from built output or preview. |
| `MRG002` | HTML `lang` is missing or conflicts with the declared locale. |
| `MRG003` | Canonical is missing, malformed, or not self-referencing when required. |
| `MRG004` | Expected self-referencing hreflang is missing. |
| `MRG005` | Expected locale alternate is missing or points to the wrong route. |
| `MRG006` | Return link is missing from an alternate page. |
| `MRG007` | Duplicate hreflang value points to conflicting URLs. |
| `MRG008` | Alternate target is broken, redirected, noindexed, or canonicalizes elsewhere. |
| `MRG009` | `x-default` is missing or inconsistent across the cluster. |
| `MRG010` | Sitemap lists a redirect, error, noindex URL, or non-self-canonical URL. |
| `MRG011` | Required indexable canonical route is absent from the sitemap. |
| `MRG012` | The same URL is assigned to incompatible locale roles. |

### Outputs

- readable terminal summary;
- stable JSON report;
- Markdown report;
- GitHub workflow annotations;
- job summary;
- configurable non-zero exit code based on severity.

### GitHub Action interface

Proposed usage:

```yaml
name: Multilingual release gate

on:
  pull_request:

jobs:
  multilingual-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: proaiexpert/multilingual-release-gate@v1
        with:
          config: multilingual-gate.yml
          source: dist
          fail-on: error
```

## Technical recommendation

### Language and runtime

Use **TypeScript** compiled to a bundled JavaScript action.

Reasons:

- one core can power both `npx` CLI usage and the GitHub Action;
- GitHub Actions provides first-class JavaScript-action support and workflow annotations through `@actions/core`;
- no Docker startup penalty;
- simpler Marketplace distribution than a Python runtime wrapper;
- cross-platform local use after build.

Use `node24` in `action.yml`. GitHub documents Node 24 as a supported JavaScript-action runtime, and GitHub began moving Actions runners from Node 20 to Node 24 in June 2026.

### Minimal dependency direction

- `@actions/core` for inputs, annotations, summaries, and failure state;
- standards-based `fetch` for HTTP;
- one maintained HTML parser;
- one maintained XML parser;
- schema validation for configuration;
- a bundler such as `@vercel/ncc` or an equivalent maintained option;
- no browser automation in v0.1.0.

### Security boundaries

- read-only requests only;
- no form submission;
- no authentication bypass;
- bounded page count, concurrency, response size, redirects, and timeout;
- query-string redaction in reports by default;
- no telemetry;
- no page-content retention beyond the current run and requested artifacts;
- document that the tool is not a security scanner and does not guarantee indexing or rankings.

## Licensing recommendation

Use the **MIT License** for this standalone public tool.

This does not change the licensing position of the ProAI Expert website, client content, brand assets, case studies, or proprietary project materials.

MIT is appropriate here because the objective is adoption, reuse in CI, forks, integrations, and external contributions.

## Deliberate non-goals

Do not add these to v0.1.0:

- general SEO score;
- keyword, backlink, or ranking analysis;
- Core Web Vitals;
- accessibility or security scanning;
- browser-rendered JavaScript crawling;
- automatic translation;
- automatic production fixes;
- AI-generated findings;
- Search Console integration;
- large unrestricted site crawling.

The deterministic gate must work before any AI explanation layer is considered.

## Build/no-build conclusion

**Proceed to implementation specification.**

The product should be built only under the narrow definition in this document. It should be cancelled or re-scoped if implementation drifts into a general SEO crawler.

## Next required decisions

1. Approve `Multilingual Release Gate` as the working product direction.
2. Approve TypeScript + Node 24.
3. Approve MIT for the standalone tool.
4. Approve CLI + GitHub Action in the first public release.
5. Create the dedicated public repository only after these four decisions are confirmed.
6. Prepare the implementation specification, file tree, fixtures, and rule-level test matrix before writing production code.

## Primary sources reviewed

- Google Search Central — Localized versions: https://developers.google.com/search/docs/specialty/international/localized-versions
- Google Search Central — Canonicalization: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google Search Central — Sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- Google Search Central — `noindex`: https://developers.google.com/search/docs/crawling-indexing/block-indexing
- GitHub Docs — Managing custom actions: https://docs.github.com/en/actions/how-tos/create-and-publish-actions/manage-custom-actions
- GitHub Docs — Action metadata syntax: https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax
- GitHub Docs — Exit codes: https://docs.github.com/en/actions/how-tos/create-and-publish-actions/set-exit-codes
- GitHub Docs — Marketplace publishing: https://docs.github.com/en/actions/how-tos/create-and-publish-actions/publish-in-github-marketplace
- GitHub Changelog — Node 20 to Node 24 migration: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/
