# Agent Playbook

## Required Before Work

- Verify repo path.
- Verify remote URL.
- Verify branch.
- Verify `git status`.
- Record old HEAD and `origin/main`.

## During Work

- One task at a time.
- Keep file changes scoped.
- Do not expose tokens, credentials, `.env`, or personal files.
- Do not force push.
- Do not invent claims.
- Do not use fake proof.
- Preserve local uncommitted work as a patch before syncing.

## Reporting Standard

Every report must include:
- old HEAD
- new HEAD
- files changed
- QA commands/results
- push status
- remaining risks

## QA Discipline

- Curl proves HTML exists, not rendered visibility.
- Rendering bugs require screenshot/browser QA.
- Mobile blank-content bugs require rendered mobile QA.
- Live/source mismatches require cache-busted checks.

## Stop Conditions

- Destructive operation required.
- Unclear repo.
- Dirty worktree with unknown changes.
- Missing client proof would force fake claim.
- Visual polishing exceeds acceptance criteria.
