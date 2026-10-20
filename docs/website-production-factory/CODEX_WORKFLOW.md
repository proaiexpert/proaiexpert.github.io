# Codex Workflow (v2)

This is the operating protocol for any Codex/agent session touching either factory repo. Follow it exactly. It supersedes ad-hoc habits from earlier sessions.

## Repo Identity — read this first

| Label | Repo | Purpose |
|---|---|---|
| **FACTORY** | `proaiexpert/proaiexpert.github.io` | Central docs, prompts, QA checklists, niche playbooks. Docs-only work happens here. |
| **SITE** | `proaiexpert/handyman-vancouver-portland-demo` | Live demo/testbed. HTML/CSS/JS implementation happens here. |

**Never mix them in one task.** A single task touches exactly one of the two repos. If a task seems to need both (e.g. "update the case study doc with a new site lesson"), split it into two explicit sub-tasks, one per repo, each with its own verification/report.

## 1. Repo Verification Protocol

Before any edit, every session must confirm, in order:

````
git status
git remote -v
git branch --show-current
git fetch origin main
git rev-parse HEAD
git rev-parse origin/main
git log --oneline -10
```

Record the output of `git rev-parse HEAD` as **old HEAD** before touching any file. If `HEAD` and `origin/main` differ, stop and reconcile before editing (fetch/rebase or ask the operator — do not blindly edit on a stale branch).

## 2. Wrong-Repo Prevention

- Confirm `git remote -v` matches the intended repo (FACTORY or SITE) character-for-character before any write.
- If a local clone's remote points somewhere unexpected, stop. Do not "fix it forward" by pushing anyway.
- If work was accidentally made in the wrong repo, preserve it (see Section 6) and do not push it to the wrong remote.

## 3. Branch/HEAD Checks

- Default branch for both FACTORY and SITE is `main`. Confirm via `git branch --show-current` before every commit.
- Do not create long-lived feature branches for docs-only FACTORY work unless explicitly instructed — this factory optimizes for small, direct main-branch commits with clear messages.

## 4. Local Auth / GitHub Connector Notes

- Prefer the authenticated GitHub connector/account access for all repo operations (clone, read, commit, push).
- **Never ask the operator for a personal access token.** If a token is pasted into chat by the operator, do not echo it, store it, or use it directly in shell commands — use the connector-based access path instead and tell the operator the token was not needed/used.
- If local `gh`/git-credential auth is incomplete and the connector is unavailable, stop and report the blocker rather than improvising with unmanaged credentials.

## 5. Dirty Worktree Handling

- If `git status` shows uncommitted changes on session start that are NOT yours, do not discard them.
- Preserve unknown local changes as a patch (`git diff > /tmp/preserve-$(date +%s).patch`) and note the patch path in your report before proceeding.
- Only reset/clean a worktree if the operator explicitly authorizes discarding those changes.

## 6. Patch/Backup Preservation

If work is discovered in the wrong repo or wrong branch:

````
git log --oneline -1                      # identify the commit
git branch backup/<descriptive-name>-<shortsha>
git format-patch -1 <sha> -o /tmp/
git diff --name-only <sha>^ <sha> > /tmp/<sha>-files.txt
```

Report the backup branch name, patch path, and file list. Never delete the original commit without an explicit backup path recorded.

## 7. Scope Control

- One task, one clearly bounded set of files. If a task lists specific target files (as this v2 task does), do not touch files outside that list without calling it out explicitly and justifying why.
- Do not "clean up while you're in there" — unrelated fixes go into a separate task/commit.

## 8. Commit Rules

- Do not commit if `git diff --stat` shows no changes.
- Write commit messages in the form `docs: <what changed>` or `fix: <what changed>` — imperative, specific, no vague "updates".
- One logical change per commit where practical; batched multi-file doc strengthening can be a single commit if it's one coherent pass (as with this v2 task).

## 9. Push Rules

- Push only to `origin main` for FACTORY docs work, never `--force`.
- Before pushing, run `git diff --check` (catches whitespace/conflict-marker errors) and `git push --dry-run origin main` to preview what would be pushed.
- After pushing, verify with `git rev-parse origin/main` that the remote HEAD now matches the local commit.

## 10. No-Token / No-Secret Rules

- Never print, log, commit, or transmit a token, password, or credential — including ones pasted into chat by the operator.
- Never commit `.env` files, credential JSON, or personal/local file paths that reveal machine-specific info.
- If a credential appears in a diff by accident, stop, do not commit, and report it.

## 11. Required Final Report Format

Every task ends with this exact structure:

````
Repo: proaiexpert/proaiexpert.github.io (FACTORY) | proaiexpert/handyman-vancouver-portland-demo (SITE)
Branch: main
Old HEAD: <sha>
New HEAD: <sha>
Files changed:
  - path/to/file.md — one-line summary of what changed
  - ...
QA / validation:
  - git diff --check: pass/fail
  - secrets scan: pass/fail
  - scope check (only listed files touched): pass/fail
Push status: pushed to origin/main | not pushed (reason)
Remaining risks / follow-ups: ...
```

## 12. Stop Conditions

Stop and ask the operator before proceeding if:

- The task requires touching both FACTORY and SITE repos in one pass.
- The worktree is dirty with changes you cannot attribute or explain.
- A destructive operation (force push, branch deletion, history rewrite) seems necessary.
- Client/business proof needed for a claim is missing and cannot be marked "MISSING" without breaking the task.
- The task as described would require faking reviews, licenses, completed projects, or guarantees.

## 13. Example Command Block

````
git status
git remote -v
git branch --show-current
git fetch origin main
git rev-parse HEAD
git rev-parse origin/main
git log --oneline -10
# ... make edits ...
git diff --stat
git diff --check
git add docs/website-production-factory/PROMPT_LIBRARY.md docs/website-production-factory/CODEX_WORKFLOW.md
git commit -m "docs: strengthen website factory v2 playbook"
git push --dry-run origin main
git push origin main
git rev-parse origin/main
```

## 14. Example Final Report

````
Repo: proaiexpert/proaiexpert.github.io (FACTORY)
Branch: main
Old HEAD: fef0a382900d8bda04f1da3ab87ecd29b420bf51
New HEAD: <new sha after commit>
Files changed:
  - docs/website-production-factory/PROMPT_LIBRARY.md — added 18 copy-paste prompts with role/context/inputs/output/constraints/acceptance criteria
  - docs/website-production-factory/CODEX_WORKFLOW.md — added full repo-verification, commit/push, and stop-condition protocol
QA / validation:
  - git diff --check: pass
  - secrets scan: pass (no tokens/credentials in diff)
  - scope check: pass (only listed files touched)
Push status: pushed to origin/main
Remaining risks / follow-ups: secondary docs (README, QUICK_START, AGENT_PLAYBOOK) still need light cross-links to the strengthened docs.
```

## Bilingual / Static-Site Structure Discipline

- Preserve existing EN/RU folder and URL structure.
- Do not create random new folders or URL patterns unless explicitly requested.
- Keep `/ru/` structure aligned with English pages where applicable.
- Do not change slugs, canonical paths, sitemap structure, or language relationships without explicit scope.
- Stop and report if the task appears to require URL structure changes.
