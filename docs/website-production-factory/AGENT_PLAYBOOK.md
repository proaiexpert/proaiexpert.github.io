# Agent Playbook

## Required Before Work

- Verify repo path.
- Verify remote URL.
- Verify branch.
- Verify `git status`, local HEAD, and `origin/main`.
- Record old HEAD, `origin/main`, working tree status, and latest commit.
- Know the exact files allowed for editing before changing anything.
- If file scope is unclear, identify the files first without editing.

See `CODEX_WORKFLOW.md` for the command-level Codex procedure.

## Role Split

- ChatGPT: strategy, planning, task design, review, and decision logic.
- Codex: repo inspection, controlled edits, validation, commit, and push.
- Cursor: optional local implementation/review environment, not the source of truth unless explicitly assigned.

## During Work

- One task at a time.
- Default edit scope is 1-2 files.
- If more than 3 files appear necessary, stop and report why before expanding scope.
- Do not touch unrelated files.
- Do not perform opportunistic cleanup, formatting, refactors, or unrelated improvements.
- Do not run broad repo audits, global refactors, or sweeping docs rewrites unless explicitly requested.
- Do not expose tokens, credentials, `.env`, or personal files.
- Do not force push.
- Do not invent claims.
- Do not use fake proof.
- Do not invent file names, selectors, IDs, environment variables, APIs, or dependencies.
- Preserve local uncommitted work as a patch before syncing.

## Freeze Policy

- Treat stable main routes, demo pages, and live areas as frozen unless the task explicitly allows changes.
- P0/P1 fixes may justify touching stable or frozen areas by default.
- P2/P3 and polish changes require an explicit business reason and explicit target-file scope.
- Do not "improve" stable pages opportunistically.
- Do not opportunistically improve stable pages or demo baselines.
- Stop after the requested change is complete.

## Reporting Standard

Every report must include:
- old HEAD
- new HEAD
- files changed
- summary of changes by file
- QA commands/results
- push status
- working tree status
- anything intentionally not changed
- recommended next narrow task
- remaining risks

## QA Discipline

- Curl proves HTML exists, not rendered visibility.
- Rendering bugs require screenshot/browser QA.
- Mobile blank-content bugs require rendered mobile QA.
- Live/source mismatches require cache-busted checks.
- Use the dedicated QA docs for full checklists; this section is only an escalation reminder.

## Stop Conditions

- Destructive operation required.
- Unclear repo.
- Target files are unclear.
- Dirty worktree with unknown changes.
- Repo state is unexpected.
- More than 3 files are required.
- Live implementation files appear necessary in a docs-only task.
- Deleting or moving files would be required.
- Source and live behavior disagree and rendered QA is needed.
- There is risk of losing useful historical material.
- Missing client proof would force fake claim.
- Visual polishing exceeds acceptance criteria.
