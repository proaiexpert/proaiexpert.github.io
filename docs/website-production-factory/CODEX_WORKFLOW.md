# Codex Workflow

Use this file for the command-level Codex procedure. General agent behavior, scope limits, freeze rules, and stop conditions live in `AGENT_PLAYBOOK.md`.

## Pre-Edit Repo Verification

Run before edits:

```bash
git fetch origin main
git status
git rev-parse HEAD
git rev-parse origin/main
git log --oneline -10
```

Record:
- old HEAD
- `origin/main` HEAD
- working tree status
- latest commit

If the repo is dirty, behind unexpectedly, on the wrong branch, or not the intended remote, stop and report before editing.

## Recovery Workflow

1. Verify working directory.
2. Find or clone the intended repo.
3. Verify remote, branch, status, local HEAD, and origin/main.
4. Preserve uncommitted work as a patch before syncing.
5. Inventory repo files.
6. Inventory local related files.
7. Document conflicts and duplicates.

## Production Workflow

1. Confirm exact target files before editing.
2. Read the current target files and existing patterns.
3. Make scoped edits only.
4. Keep default scope to 1-2 files.
5. Stop and report if more than 3 files are needed.
6. Do not touch unrelated files.
7. Do not perform cleanup, formatting, refactors, or broad rewrites unless explicitly requested.
8. Run the validation requested by the task.
9. Commit only real changes.
10. Push only from the correct branch/repo.

## Docs-Only Discipline

- If live HTML/CSS/JS implementation files appear necessary in a docs-only task, stop and report.
- If deleting, moving, or renaming files appears necessary, stop and report.
- If useful historical material might be lost, preserve it in a recovery note instead of removing it.

## Bilingual / Static-Site Structure Discipline

- Preserve existing EN/RU folder and URL structure.
- Do not create random new folders or URL patterns unless explicitly requested.
- Keep `/ru/` structure aligned with English pages where applicable.
- Do not change slugs, canonical paths, sitemap structure, or language relationships without explicit scope.
- Stop and report if the task appears to require URL structure changes.

## Final Report

- repo
- branch
- old HEAD
- new HEAD
- files changed
- summary of changes by file
- validation run/results
- push status
- whether the working tree is clean
- anything intentionally not changed
- recommended next narrow task
- remaining manual review
