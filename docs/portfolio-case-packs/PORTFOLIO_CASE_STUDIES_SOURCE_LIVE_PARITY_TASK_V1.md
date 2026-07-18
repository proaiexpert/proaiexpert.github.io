# PORTFOLIO_CASE_STUDIES_SOURCE_LIVE_PARITY_TASK_V1

## Role

Act as a senior repository and deployment engineer.

This is a narrow Stage 0 investigation and selective source-recovery task for the ProAI Expert Case Studies system.

Do not redesign or implement the new Financial Stream case in this task.

---

## Repository

- Repository: `proaiexpert/proaiexpert.github.io`
- Working branch: `portfolio-rebrand-v1`
- Protected production branch: `main`
- Public domain: `https://proai-expert.com/`

---

## Mandatory source documents

Read completely before changing anything:

1. `docs/portfolio-case-packs/PORTFOLIO_REBRAND_CURRENT_HANDOFF.md`
2. `docs/portfolio-case-packs/README.md`
3. `docs/portfolio-case-packs/PORTFOLIO_SITE_AUDIT_AND_MASTER_PLAN.md`
4. `docs/portfolio-case-packs/PORTFOLIO_CASE_ART_DIRECTION_AND_MOTION_SYSTEM_V1.md`
5. `docs/portfolio-case-packs/financial-stream/FINANCIAL_STREAM_FLAGSHIP_CASE_PRODUCTION_SPEC_V1.md`

The Production Spec is still pending final owner approval. Use it only to understand future routes and protected boundaries. Do not implement it.

---

## Problem

The live ProAI Expert Case Studies pages have existed publicly, while the current repository baseline does not cleanly expose a matching, reproducible Case Studies source tree and sitemap state.

Possible causes include:

- an older branch;
- a historical GitHub Pages deployment;
- a GitHub Actions artifact;
- a deleted or moved source directory;
- a deployment workflow using a generated output directory;
- cached output that no longer corresponds to the current source.

The source of the live pages must be established before the flagship case can be safely implemented.

---

## Target public routes to investigate

English:

- `/case-studies/`
- `/case-studies/financial-stream/`
- `/case-studies/alina-horb/`
- `/case-studies/local-repair-pro/`
- `/case-studies/proai-expert/`

Russian:

- `/ru/case-studies/`
- `/ru/case-studies/financial-stream/`
- `/ru/case-studies/alina-horb/`
- `/ru/case-studies/local-repair-pro/`
- `/ru/case-studies/proai-expert/`

Do not create `/work/` or `/portfolio/` alternatives.

---

## Objectives

### Objective 1 — Identify the real deployment source

Inspect:

- GitHub Pages configuration;
- default and working branches;
- all relevant branches;
- `.github/workflows/`;
- deployment jobs and recent runs;
- workflow artifacts;
- generated output folders such as `_site`, `dist`, `build`, `public` or equivalent;
- repository history for Case Studies paths;
- commits that added, changed, moved or deleted Case Studies pages;
- CNAME and custom-domain configuration.

Establish which source, branch, commit, artifact or generated output produced the current live Case Studies pages.

Do not guess.

### Objective 2 — Preserve the current live pages

Before restoring or changing source:

- save the current live EN/RU HTML for all accessible Case Studies routes;
- record their titles, canonical tags, hreflang, stylesheet/script references and image paths;
- record HTTP status and redirects;
- record which routes are missing or inconsistent;
- preserve any live assets that are not reproducible from the current branch.

This evidence may be stored in a clearly named internal recovery folder under `docs/portfolio-case-packs/source-live-parity/` or another non-public documentation path.

Do not alter the live site.

### Objective 3 — Compare source candidates

Compare the live output with:

- current `main`;
- current `portfolio-rebrand-v1`;
- relevant historical branches;
- relevant historical commits;
- available workflow artifacts or deployment outputs.

For every candidate source, state:

- what matches;
- what differs;
- whether assets resolve;
- whether EN/RU pairing is intact;
- whether it can be reproduced locally;
- what unrelated newer work would be endangered by restoring it wholesale.

### Objective 4 — Selective source recovery

Only after the source is established:

- restore the minimum required Case Studies source files into `portfolio-rebrand-v1`;
- preserve current homepage, services, Insights, contact, navigation, footer and language work;
- preserve current assets unless a verified missing Case Studies asset must be restored;
- do not roll back the repository;
- do not replace unrelated current files with historical versions;
- do not touch `main`.

When a historical file contains both useful Case Studies source and outdated unrelated content, manually reconcile only the required parts instead of restoring the whole file.

### Objective 5 — Reproduce the current routes locally

After selective recovery:

- run the correct local build or static-server workflow;
- verify the current Case Studies archive and detail routes locally;
- verify EN/RU route pairing;
- verify relative and absolute asset paths;
- verify that current non-portfolio pages still work;
- verify there are no new console errors caused by the recovery.

The goal is reproducible parity with the current live baseline, not implementation of the future design.

---

## Strict prohibitions

Do not:

- edit `main`;
- create a pull request;
- merge or publish;
- trigger a production deployment;
- implement the new Financial Stream Production Spec;
- promote or delete V2 Financial Stream screenshots;
- recapture screenshots;
- redesign the archive or case pages;
- change public copy except where necessary to reproduce the verified current live baseline;
- introduce a new framework;
- perform a whole-repository rollback;
- overwrite current work from an arbitrary historical commit;
- delete historical evidence or recovery notes.

---

## Stop conditions

Stop and report without destructive action if:

- the active deployment source cannot be established with reasonable confidence;
- the live output depends on an unavailable artifact or external system;
- selective recovery would overwrite substantial unrelated current work;
- the working tree contains uncommitted user changes that cannot be safely isolated;
- branch state differs materially from the controlling handoff;
- GitHub Pages or workflow permissions prevent verification.

Do not improvise around these conditions.

---

## Required deliverables

### 1. Deployment-source report

State clearly:

- current GitHub Pages source;
- relevant workflow and artifact chain;
- branch and commit that best explain the live pages;
- confidence level and remaining uncertainty.

### 2. Live/source route matrix

For each EN/RU route, provide:

- live status;
- live title;
- canonical;
- hreflang;
- source candidate;
- local reproduction status;
- asset status;
- action taken.

### 3. Changed-file list

List every file added, restored or modified and explain why.

### 4. Safety confirmation

Confirm:

- `main` unchanged;
- no PR created;
- no deployment triggered;
- no unrelated current page reverted;
- no Financial Stream V2 implementation performed.

### 5. Local verification results

Report:

- commands run;
- routes tested;
- console/build errors;
- broken links or assets;
- remaining blockers.

### 6. Final commit

If and only if selective recovery and local verification succeed:

- commit the recovery work to `portfolio-rebrand-v1`;
- use a precise commit message such as:
  `fix: restore reproducible Case Studies source baseline`

Do not push additional redesign or cleanup into the same commit.

---

## Final response format

Return one concise technical report with these headings:

1. `Deployment source identified`
2. `Live/source route matrix`
3. `Selective recovery performed`
4. `Files changed`
5. `Local verification`
6. `Safety confirmation`
7. `Commit`
8. `Remaining blockers`

Stop after the report.
