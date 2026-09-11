# ProAI Expert Social Preview / OG Authority

Status: production authority.

## Approved default assets

- EN: `https://proai-expert.com/assets/social/proai-home-og-en-r1-1.png`
- RU: `https://proai-expert.com/assets/social/proai-home-og-ru-r1-1.png`
- Required dimensions: `1200 x 630`
- `twitter:card`: `summary_large_image`

These PNG files are committed production assets under `assets/social/`. Deployment must not reconstruct them from `.ai` bootstrap fragments. Their SHA-256 and PNG dimensions are enforced by `scripts/apply-social-preview-defaults.py`.

## Source authority

Current public source HTML must already contain the approved locale-specific OG/Twitter image metadata. Known legacy screenshot URLs and retired article-OG paths must not be left in source for deployment to repair.

Before Jekyll, the deploy workflow invokes `--mode source`. That mode is retained for workflow compatibility but is deliberately fail-closed and non-mutating: it performs the same strict source verification as `--mode check-source`, including Favicon R2 verification. A bad source tree fails deployment instead of being repaired in CI.

## Generated-site guardrail

After Jekyll build, `--mode site` deterministically normalizes generated public HTML to the same approved locale defaults. `--mode check` then verifies exact cardinality and expected values. This is a guardrail for generated/future pages, not a repair mechanism for known legacy source.

## Page-specific OG exceptions

There are currently no approved page-specific OG image exceptions. A new exception requires explicit Owner approval before it becomes production authority.

## Favicon relationship

Social-preview tooling delegates favicon verification to `scripts/apply-favicon-r2.py`. Approved Favicon R2 bytes and the versioned favicon/apple-touch metadata are independently enforced.
