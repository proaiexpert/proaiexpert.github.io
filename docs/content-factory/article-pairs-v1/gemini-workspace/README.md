# Gemini Workspace — Article Pairs V1

**Branch:** `article-pairs-gemini-stage-v1`  
**Status:** Experimental review and creative-upgrade workspace  
**Production impact:** None

## Purpose

Use Gemini in two deliberately separate roles:

1. **Google/Search intelligence reviewer** — research current search behavior, SERP patterns, query fit, metadata, technical claims, and information gaps.
2. **Creative editorial and page-experience director** — produce stronger alternative article candidates and premium page blueprints after Stage 1 recommendations are adjudicated.

## Source of truth

The immutable baseline is stored in:

`../checkpoint-before-gemini/`

Gemini output must never overwrite the checkpoint.

## Workflow

### Stage 1 — Research and recommendations only

Read:

- `stage-1-google-search-research-brief.md`
- all four checkpoint articles;
- both pair QA files;
- both implementation handoffs.

Output recommendations only. Do not produce full replacement articles.

### Adjudication gate

The main author classifies each recommendation:

- ACCEPT;
- PARTIALLY ACCEPT;
- REJECT;
- NEEDS EVIDENCE.

Stage 2 starts only after this gate.

### Stage 2 — Creative upgrade

Read:

- `stage-2-creative-editorial-page-experience-brief.md`;
- approved Stage 1 adjudication;
- immutable checkpoint files.

Gemini may create full alternative candidates and page-experience blueprints, but only in this workspace.

### Comparison gate

Use `evaluation-scorecard.md` to compare the checkpoint and Gemini candidates.

Possible outcomes:

- keep baseline;
- accept selected Gemini modules;
- accept a Gemini article candidate with corrections;
- reject the creative candidate;
- combine the strongest elements into a final author-controlled version.

## Future page build

If the creative candidates are approved, any Gemini implementation work must occur on a separate branch, for example:

`article-pages-gemini-build-v1`

It must not modify `main`, production, or the pre-Gemini checkpoint branch directly.

## Non-negotiable guardrails

- No unsupported rankings, traffic, lead, conversion, revenue, or ROI claims.
- No invented case outcomes, testimonials, credentials, ratings, or statistics.
- Financial Stream remains blocked as a public evidence link until its case scope and claims pass correction.
- RU and EN articles must remain independently written, not mechanically translated.
- Legal and accessibility statements must remain accurately sourced and non-advisory.
- Search optimization must not reduce usefulness, natural language, or factual precision.
