# PORTFOLIO_CASE_STUDIES_SELECTIVE_RECOVERY_TASK_V2

## Status

Owner-authorized bounded continuation of Stage 0.

This task starts after the completed investigation documented in the Codex report for:

`PORTFOLIO_CASE_STUDIES_SOURCE_LIVE_PARITY_TASK_V1.md`

Do not repeat the full investigation unless a required verification fails.

---

## Repository

- Repository: `proaiexpert/proaiexpert.github.io`
- Working branch: `portfolio-rebrand-v1`
- Protected production branch: `main`
- Public Pages source: `main`, repository root
- Public domain: `https://proai-expert.com/`

Continue in the existing Codex workspace/session when possible so the prior local evidence and repository state remain available.

---

## Accepted Stage 0 findings

Treat the following prior findings as established unless current Git history directly contradicts them:

- current Pages deployment source is `main`, root `/`, legacy Pages;
- current deployment commit is `cebd235bf11be5216a4b1c7ffd7cf8c86c8e44f2`;
- last verified complete historical Case Studies source is commit `f3133337d1287c3ed8020bca5d3223ce35728d31`;
- the relevant Case Studies HTML in that source matches the final historical case commit `c884755`;
- the exact historical Pages artifact has expired, but the source commit and successful deployment chain are verified;
- Alina Horb and Local Repair Pro pages did not exist in that historical baseline;
- current public Case Studies routes are redirects or 404s and must not be treated as a complete source baseline.

---

## Explicit scope authorization

`AGENTS.md` sets a normal maximum edit scope of three files and requires a stop/report before a larger change.

That stop/report has now been completed.

For this task only, the owner explicitly authorizes a bounded exception of **up to exactly 29 recovery files**, limited to the verified historical Case Studies baseline described below.

This authorization does not permit general cleanup, redesign, copy changes, repository rollback or edits outside the allowlist.

---

## Recovery objective

Restore a reproducible historical Case Studies source baseline into `portfolio-rebrand-v1` without changing `main`, publishing the site, or affecting current non-portfolio pages.

This recovery is infrastructure for the future flagship implementation. It is not the future design itself.

---

## Allowed recovery set

The expected verified recovery set contains 29 files total:

1. six EN/RU Case Studies HTML pages;
2. two Case Studies-specific legacy CSS/JavaScript files required by those pages;
3. two required brand assets;
4. one archive hero asset;
5. twelve Financial Stream case images;
6. six ProAI Expert case images.

### Required HTML routes

Restore only the historical source for:

- `case-studies/index.html`
- `case-studies/financial-stream/index.html`
- `case-studies/proai-expert/index.html`
- `ru/case-studies/index.html`
- `ru/case-studies/financial-stream/index.html`
- `ru/case-studies/proai-expert/index.html`

Do not create:

- `case-studies/alina-horb/`
- `ru/case-studies/alina-horb/`
- `case-studies/local-repair-pro/`
- `ru/case-studies/local-repair-pro/`

Those pages belong to later production stages and were not part of the verified historical source.

### Required dependency rule

Derive the remaining 23 exact paths only from:

- direct stylesheet/script/image references in the six approved historical HTML files;
- verified files at commit `f3133337d1287c3ed8020bca5d3223ce35728d31`;
- the prior Stage 0 dependency inventory.

Do not add nearby files merely because they exist in the historical commit.

---

## Pre-edit manifest gate

Before writing any file, generate an exact internal manifest containing for each of the expected 29 paths:

- repository path;
- source blob SHA at `f3133337d1287c3ed8020bca5d3223ce35728d31`;
- current working-branch state: `missing`, `identical`, or `conflict`;
- which restored HTML page references it;
- reason it is required.

Proceed only when:

1. the manifest contains no more than 29 files;
2. every path belongs to the approved HTML/dependency categories;
3. every file is directly necessary for the six historical pages;
4. no current unrelated page must be overwritten;
5. every existing same-path file is either byte-identical or safely proven to be the same Case Studies asset.

If any same-path file differs and could be current shared site work, stop and report the exact conflict instead of overwriting it.

Store the manifest at:

`docs/portfolio-case-packs/source-live-parity/CASE_STUDIES_SELECTIVE_RECOVERY_MANIFEST_V2.md`

The manifest is documentation and is additionally authorized beyond the 29 restored baseline files.

---

## Recovery method

- Restore each approved file from commit `f3133337d1287c3ed8020bca5d3223ce35728d31`.
- Preserve its relative path.
- Do not restore any whole directory blindly.
- Do not checkout or reset the repository to the historical commit.
- Do not overwrite current homepage, About, Contact, Websites & Branding, AI Systems, Insights, navigation, footer, shared current assets or language pages.
- Do not edit the restored historical public copy in this task.
- Do not implement the new Financial Stream Production Spec.
- Do not promote, delete, rename or recapture V2 Financial Stream screenshots.
- Leave the existing user file `assets/img/cases/financial-stream/review-tests/fs-ru-bookkeeping-mobile-review-v1.png` unchanged.

---

## Sitemap decision

Do not edit `sitemap.xml` in this recovery task.

Reason:

- the verified historical `f313333` baseline already lacked Case Studies sitemap entries;
- the future final route set includes new Alina and Local Repair Pro pages that do not belong in historical recovery;
- final sitemap, canonical and hreflang integration belongs to the approved production implementation stage.

The restored six pages must retain the verified historical self-canonical and reciprocal hreflang markup contained in their source.

---

## Local verification

After recovery, verify locally:

### Restored routes

- `/case-studies/`
- `/case-studies/financial-stream/`
- `/case-studies/proai-expert/`
- `/ru/case-studies/`
- `/ru/case-studies/financial-stream/`
- `/ru/case-studies/proai-expert/`

For every route verify:

- HTTP 200 from the local static server;
- correct title;
- self-canonical;
- reciprocal EN/RU hreflang;
- `x-default` where present in verified source;
- all stylesheet, script and image references resolve;
- no new console error;
- no broken internal link among the six restored pages.

### Protected current routes

Re-test at minimum:

- `/`
- `/about/`
- `/contact/`
- `/websites-branding/`
- `/ai-systems/`
- `/insights/`
- `/ru/`
- `/ru/about/`
- `/ru/contact/`
- `/ru/websites-branding/`
- `/ru/ai-systems/`
- `/ru/insights/`

Confirm that they still return their current pages and were not replaced by historical content.

### Repository checks

- no path outside the manifest changed;
- no V2 screenshot changed;
- no unexpected untracked file was created;
- no production deployment was triggered;
- `main` remains unchanged.

---

## Commit and push authorization

When and only when all verification passes:

1. commit the selective recovery and manifest on `portfolio-rebrand-v1`;
2. use commit title:

`fix: restore reproducible Case Studies source baseline`

3. push only to `portfolio-rebrand-v1`.

Do not:

- push to `main`;
- create a PR;
- merge;
- publish;
- trigger Pages manually.

Because Pages deploys from `main`, a push to `portfolio-rebrand-v1` must not change the public website.

---

## Stop conditions

Stop without committing if:

- the exact approved dependency set exceeds 29 restored files;
- a required dependency cannot be tied directly to the six historical pages;
- an existing current shared file conflicts with the historical version;
- protected current pages fail after recovery;
- any restored route has unresolved required assets;
- the working branch contains new user changes that cannot be isolated;
- the branch no longer descends safely from the reported Stage 0 HEAD.

Do not solve a conflict through broad refactoring or rollback.

---

## Required final report

Return:

### 1. Recovery manifest

- exact restored paths;
- source blob SHAs;
- total restored file count;
- manifest path.

### 2. Recovery result

- what was restored;
- why the source is reproducible;
- what was intentionally not restored.

### 3. Verification

- six restored routes;
- protected current routes;
- asset resolution;
- canonical/hreflang;
- console/build results.

### 4. Safety

Confirm:

- `main` unchanged;
- no PR;
- no deployment;
- no unrelated current page reverted;
- no new Financial Stream design implementation;
- no V2 promotion or screenshot change.

### 5. Commit

- commit SHA;
- pushed branch;
- exact files changed.

### 6. Remaining blockers

State only real blockers for beginning the later Financial Stream implementation.

Stop after this report.
