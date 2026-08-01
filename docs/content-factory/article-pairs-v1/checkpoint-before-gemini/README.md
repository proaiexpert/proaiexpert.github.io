# ProAI Expert Article Pairs — Pre-Gemini Checkpoint

**Branch:** `article-pairs-gemini-stage-v1`  
**Base:** `portfolio-rebrand-v1`  
**Status:** Immutable content checkpoint — no site implementation, no publication

## Purpose

This folder preserves the final approved article candidates and governance before Gemini Stage 1.

It is the rollback and comparison baseline. Gemini output must never overwrite these files.

## Canonical article files

### Pair 1 — Multilingual website decision

- `article-01/ru-final-candidate-v5.md`
- `article-01/en-final-candidate-v4.md`
- `article-01/pair-qa-v1.md`
- `article-01/final-implementation-handoff-v2.md`

### Pair 2 — Website proposal evaluation

- `article-02/ru-final-candidate-v4.md`
- `article-02/en-final-candidate-v5.md`
- `article-02/pair-qa-v1.md`
- `article-02/final-implementation-handoff-v2.md`

## Governance

Read before any implementation or creative rewrite:

- `governance/final-routes-and-metadata-manifest-v1.md`
- `governance/financial-stream-evidence-gate-v1.md`
- `governance/final-google-review-correction-log-v1.md`

The metadata manifest is the only authoritative source for routes, H1, SEO titles, descriptions, language values, canonical rules, and the Article 2 RU slug.

## Google Drive mirror

The same final editorial set is duplicated in:

`ProAI Expert — Content & Website Factory Hub/09 FINAL ARTICLE CHECKPOINT — DRIVE MIRROR`

Drive is the recovery/editorial mirror. GitHub is the working source for Gemini.

## Gemini workflow

1. Google/Search research and recommendations.
2. Main-author adjudication.
3. Creative editorial and premium page-experience candidates.
4. Comparison against this checkpoint.
5. Page build only after explicit approval.

## Guardrails

- Do not overwrite checkpoint files.
- Store Gemini output only under `../gemini-workspace/`.
- Do not publish from this branch.
- Do not modify website templates, routes, sitemap, CSS, or JavaScript during Stage 1.
- Do not add unsupported ranking, traffic, lead, conversion, revenue, or ROI claims.
- Do not use the superseded Article 2 RU route.
- Financial Stream remains unlinked and governed by its evidence gate.
