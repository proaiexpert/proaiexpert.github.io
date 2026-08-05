# Homepage V2 Production Specification — Correction Decision

**Status:** Complete  
**Date:** 2026-08-04  
**Branch:** `agent/homepage-v2-strategy-review`  
**Independent verdict:** `TARGETED CORRECTION`

## Decision

The independent technical review accepted the fundamental Homepage V2 architecture and required narrow repository-contract corrections before implementation.

All P0 corrections were accepted.

All P1 corrections were accepted.

The useful P2 quality recommendations were adopted.

No approved commercial strategy, ten-block narrative, service architecture, proof hierarchy or visual direction was reopened.

## Authoritative correction document

The accepted technical corrections are locked in:

```text
docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_IMPLEMENTATION_CONTRACT.md
```

When a repository-level implementation rule in the original Production Specification conflicts with this file, the Implementation Contract controls.

## First production prerequisite

The narrow first production stage is specified in:

```text
docs/site-evolution/PROAI_EXPERT_CONTACT_PRIVATE_REVIEW_PREREQUISITE_SPEC.md
```

It must be implemented in a dedicated branch from freshly fetched current `main`.

## Key corrections accepted

- exact canonical Header include and one-time asset ownership;
- exact locked Homepage Footer include through `footer-commercial-v1.html`;
- no generic Footer router `homepage` variant;
- Contact `intent` migration to request type;
- direction migration to canonical `selected_direction`;
- explicit `source_page` and `source_cta` schema;
- no-JS-safe Homepage CTA URLs;
- allowlisted query values and safe DOM handling;
- Contact prerequisite as a separate EN/RU PR;
- explicit production origin without `_config.yml` assumptions;
- generated-output Homepage V2 deployment gate;
- exact V2 runtime asset manifest;
- V1 assets retained only for rollback;
- Chatbase preserved unchanged for initial V2;
- no Liquid expressions in raw Homepage CSS/JS;
- EN/RU YAML parity validation;
- `assets/img/homepage-v2/**` image convention;
- exact fixed-Header offset contract;
- responsive-image object contract;
- total-page performance reporting;
- semantic Journey DOM order;
- fresh-current-main production branch rule;
- rollback rehearsal;
- cache-busting ownership;
- vendor-neutral analytics no-op fallback.

## Current readiness

The corrected production scope is ready for owner approval.

No production implementation has been performed.

No production PR has been created.

Header, Footer, Homepage, Contact, routes, assets and deployment files remain unchanged in this documentation branch.
