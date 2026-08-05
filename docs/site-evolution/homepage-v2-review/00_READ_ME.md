# ProAI Expert Homepage V2 — Review Workspace

**Status:** Corrected production scope prepared after independent technical review  
**Branch:** `agent/homepage-v2-strategy-review`  
**Original baseline:** `af9b7288a9a5fc36de57afd816302e80e17e0d8a`  
**Latest main inspected by technical Reviewer:** `0b2fca54fba614e8a3098d00991cec6103b604e8`  
**Owner:** Ihor Horb  
**Primary Control:** main Homepage V2 strategy chat

## Purpose

This folder preserves the full strategy, independent-review and production-specification decision history for the ProAI Expert EN/RU Homepage V2 program.

Canonical and implementation documents now live directly under:

```text
docs/site-evolution/
```

No production implementation is authorized from this documentation branch without explicit owner approval.

## Current read order

1. Repository root `AI_START_HERE.md`.
2. Repository root `AGENTS.md`.
3. Current root `AI_CURRENT_HANDOFF.md`.
4. `../PROAI_EXPERT_HOMEPAGE_V2_STRATEGY.md` — owner-approved canonical strategy.
5. `../PROAI_EXPERT_HOMEPAGE_V2_PRODUCTION_SPEC.md` — broad Production Specification V1.
6. `07_PRODUCTION_SPEC_REVIEW_REPORT.md` — independent technical `TARGETED CORRECTION` report.
7. `../PROAI_EXPERT_HOMEPAGE_V2_IMPLEMENTATION_CONTRACT.md` — authoritative repository-level correction contract.
8. `../PROAI_EXPERT_CONTACT_PRIVATE_REVIEW_PREREQUISITE_SPEC.md` — first narrow production-stage specification.

Historical strategy/review files remain in this workspace:

- `01_HOMEPAGE_V2_STRATEGY_V1.md`;
- `02_INDEPENDENT_REVIEW_TASK.md`;
- `03_INDEPENDENT_REVIEW_REPORT.md`;
- `04_HOMEPAGE_V2_STRATEGY_FINAL.md`;
- `05_OWNER_APPROVAL.md`;
- `06_PRODUCTION_SPEC_REVIEW_TASK.md`;
- `07_PRODUCTION_SPEC_REVIEW_REPORT.md`.

## Current decisions

### Strategy

Owner-approved.

### Independent strategy review

Verdict: `TARGETED CORRECTION`.

Corrections accepted and consolidated into the canonical strategy.

### Independent production-spec review

Verdict: `TARGETED CORRECTION`.

The architecture was accepted. Exact repository contracts were required for:

- canonical Header include and assets;
- exact Homepage Footer include;
- Contact field migration;
- CTA source-context schema;
- metadata origin without `_config.yml`;
- generated-output deployment validation;
- V1/V2 runtime asset ownership;
- Chatbase preservation;
- raw asset Liquid prohibition;
- fresh-main production branches;
- rollback rehearsal.

All accepted corrections are now locked in:

```text
docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_IMPLEMENTATION_CONTRACT.md
```

## Required production sequence after owner approval

1. Create Contact prerequisite branch from freshly fetched current `main`.
2. Implement only EN/RU Contact context and field-contract changes.
3. Independently review and verify Contact.
4. Merge Contact only with explicit owner authorization.
5. Finalize EN/RU copy, proof-source pack and full-page prototype.
6. Create Homepage production branch from then-current `main`.
7. Implement the complete ten-block EN/RU Homepage V2 system.
8. Run generated-output, browser, accessibility, performance and rollback checks.
9. Obtain independent production review.
10. Merge/publish only with explicit owner authorization.

## Locked boundaries

- Header System remains locked.
- Homepage Footer remains locked and continues through `footer-commercial-v1.html`.
- No production branch may be based on this strategy-review branch.
- No production file may be edited in this workspace.
- No partial Homepage V2 publication.
- No EN-only publication.
- No new third-party script.
- Existing Chatbase is preserved unless separately authorized.
- No invented outcomes, clients, testimonials, rankings, leads, conversion, revenue or ROI.
- Financial Stream, Alina Horb and Local Repair Pro status boundaries remain truthful.
- EN/RU natural localization and machine-value parity are required.

## Current stage

```text
Corrected Production Scope → Owner Approval → Contact Prerequisite → Content/Proof → Prototype → Homepage Build
```

Current owner decision required:

> Approve the corrected Production Scope and authorize the narrow Contact prerequisite implementation branch.
