# Codex Workflow

Recovery workflow:
1. Verify working directory.
2. Find or clone the intended repo.
3. Verify remote, branch, status, local HEAD, and origin/main.
4. Preserve uncommitted work as a patch before syncing.
5. Inventory repo files.
6. Inventory local related files.
7. Document conflicts and duplicates.

Production workflow:
1. Read existing patterns.
2. Make scoped edits.
3. Run search QA.
4. Run static checks.
5. Run rendered QA when visual behavior matters.
6. Commit only real changes.
7. Push only from the correct branch.

Final report:
- repo
- branch
- old HEAD
- new HEAD
- files changed
- QA results
- push status
- remaining manual review
