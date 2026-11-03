# Multilingual Release Gate — Implementation Specification V1

**Status:** Approved product direction · Pre-implementation specification  
**Owner:** ProAI Expert  
**Working repository:** `proaiexpert/multilingual-release-gate`  
**Target first release:** `v0.1.0`

## 1. Product definition

Multilingual Release Gate is a framework-independent CLI and GitHub Action that validates an explicitly declared multilingual route contract against built static HTML or a deployment preview.

It is not a general SEO crawler. Its job is to prevent a pull request or release from shipping when localized route pairs, canonical URLs, `hreflang`, HTML language, sitemap membership, redirects, or indexing directives conflict.

### One-line promise

> Prevent broken multilingual releases by validating the route contract and search signals before merge.

### Primary users

- developers maintaining multilingual static or pre-rendered sites;
- agencies shipping localized service-business websites;
- SEO engineers who need deterministic CI enforcement;
- ProAI Expert projects before indexing, migration, or domain changes.

## 2. Approved technology and licensing

- **Language:** TypeScript
- **Runtime:** Node.js 24
- **Distribution:** npm CLI plus bundled JavaScript GitHub Action
- **License:** MIT for this standalone tool
- **Telemetry:** none
- **AI dependency:** none in `v0.1.0`

The MIT license applies only to the standalone public tool. It does not change the licensing position of the ProAI Expert website, brand assets, case studies, client content, or proprietary project materials.

## 3. Product boundaries

### In scope for `v0.1.0`

- validate built static files;
- validate a deployment-preview base URL;
- optionally validate a sitemap;
- read an explicit YAML route contract;
- reconcile canonical, `hreflang`, HTML `lang`, redirects, `noindex`, and sitemap signals;
- print deterministic findings;
- emit JSON and Markdown reports;
- create GitHub workflow annotations and a job summary;
- exit non-zero according to a configured severity threshold.

### Explicitly out of scope for `v0.1.0`

- general SEO scoring;
- rank tracking, keywords, backlinks, or Search Console integration;
- Core Web Vitals;
- security or accessibility scanning;
- browser-rendered JavaScript crawling;
- translation or localization quality scoring;
- automatic production fixes;
- AI-generated findings;
- unrestricted crawling of large sites;
- authenticated or private-area crawling;
- form submission.

## 4. User workflows

### 4.1 Local CLI against built output

```bash
npx multilingual-release-gate \
  --config multilingual-gate.yml \
  --source dist
```

Expected behavior:

1. load and validate configuration;
2. map declared routes to local HTML files;
3. parse page-level signals;
4. evaluate cluster-level and sitemap rules;
5. print a concise summary;
6. write requested reports;
7. exit with code `0`, `1`, or `2` according to result class.

### 4.2 CLI against a preview deployment

```bash
npx multilingual-release-gate \
  --config multilingual-gate.yml \
  --base-url https://preview.example.com
```

Expected behavior:

- fetch only routes explicitly declared by the configuration plus the sitemap when supplied;
- enforce request, redirect, response-size, and timeout limits;
- never discover arbitrary new site URLs in `v0.1.0`.

### 4.3 GitHub Action

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

The Action must:

- use the same core engine as the CLI;
- create `error`, `warning`, and `notice` annotations;
- write a compact GitHub job summary;
- fail the job only when findings meet or exceed the configured threshold.

## 5. Configuration contract

Default file name:

```text
multilingual-gate.yml
```

### 5.1 Initial schema

```yaml
version: 1

base_url: https://example.com
sitemap: https://example.com/sitemap.xml
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
  require_html_lang: true
  require_self_canonical: true
  require_self_hreflang: true
  require_reciprocal_hreflang: true
  require_x_default: true
  require_sitemap_membership: true
  allow_redirects: false
  fail_on: error

network:
  timeout_ms: 10000
  max_redirects: 3
  max_response_bytes: 2000000
  concurrency: 4

report:
  json: reports/multilingual-gate.json
  markdown: reports/multilingual-gate.md
  redact_query_strings: true
```

### 5.2 Validation requirements

Configuration loading must fail before any network or file work when:

- `version` is unsupported;
- no clusters exist;
- a cluster contains fewer than two locale routes;
- a route is duplicated in incompatible locale roles;
- locale identifiers are empty or malformed;
- relative routes do not begin with `/`;
- absolute route URLs conflict with `base_url`;
- `x_default` names a locale not present in the relevant cluster;
- numeric limits are zero, negative, or above documented safety ceilings;
- report paths escape the working directory.

### 5.3 Contract philosophy

The route map is explicit by design. The tool must validate declared product intent rather than guess whether `/services/` corresponds to `/ru/uslugi/` or another localized slug.

Automatic route inference may be explored later, but it must not replace the explicit contract in the first release.

## 6. Core domain model

### 6.1 Route contract

```ts
interface RouteContract {
  clusterId: string;
  locale: string;
  route: string;
  expectedUrl: string;
}
```

### 6.2 Observed page

```ts
interface ObservedPage {
  requestedUrl: string;
  finalUrl: string;
  status: number;
  redirected: boolean;
  htmlLang: string | null;
  canonical: string | null;
  robots: string[];
  hreflang: Map<string, string[]>;
  contentType: string | null;
  sourceKind: "file" | "http";
  sourcePath?: string;
}
```

### 6.3 Finding

```ts
type Severity = "notice" | "warning" | "error";

interface Finding {
  ruleId: string;
  severity: Severity;
  clusterId?: string;
  locale?: string;
  route?: string;
  url?: string;
  message: string;
  observed?: unknown;
  expected?: unknown;
  remediation: string;
  sourcePath?: string;
  sourceLine?: number;
}
```

### 6.4 Audit result

```ts
interface AuditResult {
  toolVersion: string;
  startedAt: string;
  completedAt: string;
  configurationDigest: string;
  summary: {
    clusters: number;
    routes: number;
    notices: number;
    warnings: number;
    errors: number;
  };
  findings: Finding[];
}
```

Stable JSON output must preserve field names and rule identifiers within the `v0.x` compatibility policy documented before release.

## 7. Rule catalogue for `v0.1.0`

### `MRG001` — Expected locale route missing

Trigger when a declared route cannot be resolved from local output or returns an unusable HTTP response.

Default severity: `error`.

Examples:

- expected `dist/ru/contact/index.html` is missing;
- preview route returns `404` or `410`;
- response is not HTML where HTML is required.

### `MRG002` — HTML language mismatch

Trigger when `<html lang>` is missing or does not match the declared locale according to normalized BCP 47 comparison.

Default severity:

- missing: `warning` by default, configurable to `error`;
- conflicting value: `error`.

### `MRG003` — Canonical missing or conflicting

Trigger when:

- canonical is missing and required;
- more than one canonical exists;
- canonical is malformed;
- canonical does not resolve to the expected self URL when self-canonical is required.

Default severity: `error`.

### `MRG004` — Self hreflang missing

Trigger when a page does not contain an alternate entry for its own declared locale and URL.

Default severity: `error`.

### `MRG005` — Expected alternate missing or wrong

Trigger when a page lacks the expected locale alternate or points that locale to a URL other than the declared route.

Default severity: `error`.

### `MRG006` — Reciprocal alternate missing

Trigger when page A points to page B for a locale but page B does not point back to page A using the expected locale relationship.

Default severity: `error`.

### `MRG007` — Duplicate or conflicting hreflang values

Trigger when:

- the same locale code points to multiple distinct URLs on one page;
- duplicate entries create conflicting normalized targets;
- one URL is assigned incompatible locale roles within a cluster.

Default severity: `error`.

### `MRG008` — Alternate target unusable

Trigger when an expected alternate target:

- is broken;
- redirects when redirects are disallowed;
- is marked `noindex`;
- canonicalizes to another URL;
- returns a non-HTML response;
- resolves outside the approved host when external alternates are not allowed.

Default severity: `error`.

### `MRG009` — `x-default` missing or inconsistent

Trigger when:

- `x-default` is required but missing;
- pages within the same cluster point `x-default` to different targets;
- the target is not one of the approved cluster routes unless configuration explicitly permits another URL.

Default severity: `warning` or `error` according to policy. Default configuration should use `error` when `require_x_default: true`.

### `MRG010` — Invalid sitemap member

Trigger when a sitemap entry associated with the declared contract:

- returns an error;
- redirects;
- is marked `noindex`;
- is non-self-canonical;
- has an unsupported scheme or malformed URL.

Default severity: `error`.

### `MRG011` — Required canonical route absent from sitemap

Trigger when a declared, indexable, self-canonical route is missing from the configured sitemap and membership is required.

Default severity: `error`.

### `MRG012` — Incompatible locale assignment

Trigger when the same normalized URL appears as multiple incompatible locales or in conflicting cluster roles.

Default severity: `error`.

## 8. URL normalization policy

Normalization must be deterministic and documented.

Required behavior:

- resolve relative URLs against the page URL or configured `base_url`;
- lowercase scheme and host;
- remove default ports;
- preserve path case;
- normalize empty path to `/`;
- preserve or normalize trailing slash only according to explicit comparison rules;
- strip fragments;
- redact query strings from human-readable reports by default;
- preserve full internal values in memory only for the current run;
- compare percent-encoding consistently without decoding reserved characters incorrectly.

The first release must not silently treat `/page` and `/page/` as equivalent unless configuration enables a documented trailing-slash policy.

## 9. Static-file resolution

For local built output, route resolution should support common static conventions:

| Declared route | Candidate file |
|---|---|
| `/` | `index.html` |
| `/about/` | `about/index.html` |
| `/about` | `about.html`, then `about/index.html` according to policy |
| `/404.html` | `404.html` |

Resolution order must be deterministic and reported when ambiguous.

The tool must not execute JavaScript or start an application server in `v0.1.0`.

## 10. HTTP behavior

### Allowed operations

- `GET` requests only;
- optional `HEAD` only when a later optimization proves reliable;
- standard redirects up to configured limit;
- bounded concurrent requests.

### Safety defaults

- timeout: `10 seconds` per request;
- redirects: maximum `3`;
- concurrency: maximum default `4`;
- response body: maximum default `2 MB`;
- declared routes only;
- no cookies, authentication, credentials, or form submission;
- user-agent identifying the tool and version;
- no retry storm; at most one documented retry for eligible transient failures.

### SSRF and local-network protection

Preview mode must reject or require explicit opt-in for:

- loopback addresses;
- link-local addresses;
- private IPv4 ranges;
- private or local IPv6 ranges;
- non-HTTP schemes;
- redirects from a public host into a protected network range.

Local file mode is the supported path for testing localhost builds in `v0.1.0`.

## 11. Sitemap support

### Supported in `v0.1.0`

- standard URL set XML;
- one level of sitemap index expansion, with a documented bounded maximum;
- HTTPS and HTTP URLs;
- gzip support only if implementation complexity remains low and tests are complete.

### Required validation

- XML parse errors;
- duplicate URLs;
- malformed URLs;
- redirects, errors, `noindex`, and non-self-canonical members;
- declared indexable routes missing from the sitemap.

The tool must not treat sitemap presence as proof of indexability. It only reconciles sitemap membership with observed page signals.

## 12. CLI contract

### Command

```text
multilingual-release-gate [options]
```

### Required option

```text
--config <path>
```

### Source selection

Exactly one primary source must be supplied:

```text
--source <directory>
--base-url <url>
```

### Output options

```text
--format console|json|markdown
--output <path>
--json-output <path>
--markdown-output <path>
--fail-on notice|warning|error|never
--quiet
--verbose
```

Configuration values may provide defaults. Explicit CLI flags override configuration and must be recorded in the report metadata.

### Exit codes

| Code | Meaning |
|---|---|
| `0` | Audit completed and no finding met the failure threshold. |
| `1` | Audit completed and findings met the configured failure threshold. |
| `2` | Configuration, parsing, internal, or operational failure prevented a valid audit. |

Unexpected internal errors must not be reported as ordinary multilingual findings.

## 13. GitHub Action contract

### `action.yml` inputs

```yaml
inputs:
  config:
    description: Path to the route-contract YAML file
    required: true

  source:
    description: Built static directory
    required: false

  base-url:
    description: Deployment-preview base URL
    required: false

  fail-on:
    description: notice, warning, error, or never
    required: false
    default: error

  json-output:
    description: Optional JSON report path
    required: false

  markdown-output:
    description: Optional Markdown report path
    required: false
```

### Action behavior

- validate mutually exclusive source inputs;
- call the shared core engine;
- use `@actions/core` annotations;
- write a job summary grouped by rule and cluster;
- call `setFailed` only according to the audit result or operational failure;
- expose summary counts as outputs.

### Proposed outputs

```yaml
outputs:
  errors:
  warnings:
  notices:
  routes-checked:
  report-json:
  report-markdown:
```

## 14. Proposed repository structure

```text
multilingual-release-gate/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml
│   │   └── feature_request.yml
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── release.yml
│   │   └── action-smoke.yml
│   └── pull_request_template.md
├── docs/
│   ├── configuration.md
│   ├── rules.md
│   ├── security-model.md
│   ├── limitations.md
│   └── examples.md
├── examples/
│   ├── en-ru-static/
│   ├── en-ua-preview/
│   └── github-action/
├── fixtures/
│   ├── valid-en-ru/
│   ├── missing-route/
│   ├── lang-mismatch/
│   ├── canonical-conflict/
│   ├── missing-self-hreflang/
│   ├── missing-return-link/
│   ├── duplicate-hreflang/
│   ├── noindex-alternate/
│   ├── redirect-alternate/
│   ├── inconsistent-x-default/
│   ├── invalid-sitemap-member/
│   └── sitemap-missing-route/
├── src/
│   ├── action/
│   │   └── main.ts
│   ├── cli/
│   │   ├── main.ts
│   │   └── arguments.ts
│   ├── config/
│   │   ├── load.ts
│   │   ├── schema.ts
│   │   └── normalize.ts
│   ├── engine/
│   │   ├── audit.ts
│   │   ├── context.ts
│   │   └── result.ts
│   ├── fetch/
│   │   ├── http.ts
│   │   ├── local.ts
│   │   └── network-policy.ts
│   ├── parse/
│   │   ├── html.ts
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── rules/
│   │   ├── MRG001.ts
│   │   ├── MRG002.ts
│   │   ├── MRG003.ts
│   │   ├── MRG004.ts
│   │   ├── MRG005.ts
│   │   ├── MRG006.ts
│   │   ├── MRG007.ts
│   │   ├── MRG008.ts
│   │   ├── MRG009.ts
│   │   ├── MRG010.ts
│   │   ├── MRG011.ts
│   │   └── MRG012.ts
│   ├── report/
│   │   ├── console.ts
│   │   ├── json.ts
│   │   ├── markdown.ts
│   │   └── github.ts
│   ├── url/
│   │   └── normalize.ts
│   └── types.ts
├── test/
│   ├── unit/
│   ├── integration/
│   ├── action/
│   └── snapshots/
├── action.yml
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── SECURITY.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── vitest.config.ts
└── multilingual-gate.example.yml
```

## 15. Dependency policy

Use the smallest maintained dependency set that meets the specification.

Expected categories:

- `@actions/core` for Action integration;
- one maintained HTML parser;
- one maintained XML parser;
- one YAML/schema-validation path;
- one test runner;
- one formatter/linter toolchain;
- one bundler for the committed Action distribution.

Requirements:

- no runtime browser dependency;
- no telemetry package;
- no dependency that executes arbitrary project code;
- lockfile committed;
- dependency review enabled in CI;
- bundled Action output reproducible from source;
- automated check that committed bundle matches source.

## 16. Test strategy

### 16.1 Unit tests

Required for:

- configuration normalization and rejection;
- locale and URL normalization;
- canonical extraction;
- robots parsing;
- `hreflang` extraction and duplicate handling;
- sitemap parsing;
- severity and exit-code calculation;
- query-string redaction;
- protected-network rejection;
- every rule evaluator.

### 16.2 Fixture integration tests

Each published rule must have:

- one fixture that triggers it;
- one close negative case that must not trigger it;
- stable expected JSON output;
- stable expected Markdown summary.

### 16.3 Action tests

- valid fixture returns success;
- error fixture fails the workflow;
- `fail-on: warning` behaves correctly;
- annotations contain rule ID and affected route;
- summary outputs expose correct counts;
- bundled action runs on Linux;
- CLI smoke tests run on Linux, Windows, and macOS.

### 16.4 Network tests

Use a controlled local HTTP test server in CI. Do not rely on arbitrary third-party websites for deterministic tests.

Required scenarios:

- `200` HTML;
- `301` and `302` redirect;
- redirect loop;
- `404`;
- oversized response;
- timeout;
- wrong content type;
- redirect to protected network;
- alternate that canonicalizes elsewhere.

## 17. Rule-level test matrix

| Rule | Positive trigger fixture | Required negative control |
|---|---|---|
| `MRG001` | declared RU page absent | all declared files present |
| `MRG002` | RU route contains `lang="en"` | normalized `ru` or approved regional tag |
| `MRG003` | canonical points to EN page | correct self-canonical |
| `MRG004` | page lacks own locale alternate | self alternate present once |
| `MRG005` | EN page RU alternate points to wrong slug | declared RU target |
| `MRG006` | RU page omits EN return link | complete reciprocal pair |
| `MRG007` | two RU alternates with different targets | duplicate identical normalized target handled predictably |
| `MRG008` | alternate redirects or is `noindex` | direct indexable self-canonical alternate |
| `MRG009` | cluster pages disagree on `x-default` | one consistent approved target |
| `MRG010` | sitemap contains `noindex` URL | sitemap contains valid canonical pages |
| `MRG011` | declared canonical page omitted from sitemap | all required routes included |
| `MRG012` | one URL assigned as EN and RU | each locale owns a distinct route |

## 18. Reporting requirements

### Console

The default console report should be concise:

```text
Multilingual Release Gate v0.1.0
Checked: 8 routes in 4 clusters

ERROR MRG006 services:ru
/ru/services/ does not link back to /services/ as hreflang="en".
Fix: add the expected reciprocal alternate link.

Result: 1 error, 0 warnings, 0 notices
```

### JSON

JSON must include:

- tool and schema versions;
- run metadata;
- normalized configuration digest;
- summary counts;
- ordered findings;
- no raw page body;
- redacted query strings by default.

### Markdown

Markdown should be suitable for:

- a CI artifact;
- PR comment copy;
- human review;
- issue attachment.

### GitHub annotations

Annotations should point to a local source file and approximate line only when reliable. Preview-only findings should annotate the workflow without fabricating a source path.

## 19. Ordering and determinism

Findings must use stable ordering:

1. severity: error, warning, notice;
2. rule ID;
3. cluster ID;
4. locale;
5. normalized route.

The same fixture and configuration must generate byte-stable JSON apart from explicitly documented timestamp fields. Snapshot tests should normalize timestamps.

## 20. Performance targets

For a contract containing 100 routes on a normal GitHub-hosted runner:

- local static mode target: under `5 seconds` excluding package installation;
- preview mode target: under `30 seconds` under normal network conditions;
- default memory target: under `256 MB`;
- no unbounded queue or response buffering.

These are engineering targets, not public guarantees, until measured in release candidates.

## 21. Security and privacy requirements

- no telemetry;
- no retained page content;
- no credentials accepted in `v0.1.0`;
- no cookie persistence;
- no form submission;
- no arbitrary crawl discovery;
- no shell execution based on configuration values;
- reject path traversal in report destinations and local source resolution;
- reject protected network targets in preview mode;
- redact query strings in logs and reports by default;
- document responsible disclosure in `SECURITY.md`;
- document that the tool is not a security scanner and cannot guarantee search-engine indexing or rankings.

## 22. CI quality gates for the product repository

Every pull request should run:

- dependency installation from lockfile;
- TypeScript type check;
- lint and formatting check;
- unit tests;
- fixture integration tests;
- Action smoke test;
- build and bundle;
- verification that committed distribution matches source;
- dependency review for external pull requests where supported;
- secret scanning and CodeQL according to repository settings.

No release should be cut from a dirty or unreproducible bundle.

## 23. Release strategy

### `v0.0.x` development milestones

1. repository foundation and configuration parser;
2. local static-page loader and HTML parser;
3. route and cluster engine;
4. `MRG001`–`MRG009`;
5. sitemap parser and `MRG010`–`MRG011`;
6. CLI reports and exit codes;
7. GitHub Action wrapper and annotations;
8. cross-platform tests, documentation, and security review.

### `v0.1.0` release gate

Release only when:

- all 12 rules are implemented and tested;
- valid fixture has no false critical findings;
- every rule has positive and negative controls;
- CLI works on Windows, macOS, and Linux;
- GitHub Action works in a clean sample repository;
- bundle reproducibility check passes;
- README contains a five-minute quick start;
- configuration, rules, limitations, privacy, security, and contribution docs are complete;
- release notes identify known limitations;
- version tag and Marketplace metadata refer to the same immutable commit.

## 24. Marketplace and versioning plan

- repository remains public;
- publish immutable semantic-version tags;
- maintain moving major tag `v1` only after stable `1.0.0` policy is defined;
- do not publish to GitHub Marketplace before the Action has passed independent sample-repository validation;
- do not advertise adoption, accuracy, or performance without measured evidence;
- use release notes for every public version.

## 25. Documentation requirements

README first screen must show:

- product name and one-line promise;
- status and current release;
- CLI quick start;
- GitHub Action quick start;
- one failing example;
- supported inputs;
- explicit non-goals;
- MIT license;
- ProAI Expert attribution without turning the README into a services advertisement.

Required supporting documentation:

- configuration reference;
- rule catalogue;
- examples;
- limitations;
- security model;
- privacy statement;
- contribution guide;
- changelog.

## 26. Initial implementation issues

Create these issues in the dedicated repository after repository creation:

1. `Foundation: repository, TypeScript, CI, license, and action metadata`
2. `Configuration: YAML schema, normalization, and validation`
3. `Sources: static directory loader and protected HTTP preview loader`
4. `Parsing: HTML, canonical, hreflang, robots, and sitemap`
5. `Rules: MRG001–MRG006 route and reciprocity checks`
6. `Rules: MRG007–MRG012 conflict and sitemap checks`
7. `Reports: console, JSON, Markdown, and deterministic ordering`
8. `GitHub Action: inputs, annotations, summary, outputs, and failure state`
9. `Fixtures: positive and negative controls for every public rule`
10. `Release: docs, sample repository, bundle verification, and v0.1.0`

## 27. Immediate next action

The product direction, technology, runtime, first-release format, and MIT license are approved.

Next operational sequence:

1. create public repository `proaiexpert/multilingual-release-gate`;
2. apply professional Description, Topics, and repository settings;
3. add only the foundation files and issue backlog;
4. implement through small reviewable pull requests;
5. test first against controlled fixtures, then against read-only copies or deployment previews of ProAI Expert multilingual projects;
6. publish nothing to npm or GitHub Marketplace until the `v0.1.0` release gate is satisfied.

## 28. Acceptance of this specification

This specification is approved when all statements below are accepted:

- the product remains a narrow release gate, not a general SEO crawler;
- the first release includes both CLI and GitHub Action;
- TypeScript and Node.js 24 are the implementation baseline;
- MIT is used for the standalone tool;
- the 12 published rules define the minimum `v0.1.0` behavior;
- deterministic tests and security boundaries are release requirements;
- no public release occurs until the complete `v0.1.0` gate passes.
