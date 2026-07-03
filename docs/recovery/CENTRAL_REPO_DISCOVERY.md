# Central Repo Discovery

Date: 2026-07-02

## Target selected

Source of truth for Website Production Factory documentation:

- Local path: `C:\Users\PC Profile\Documents\New project\proaiexpert.github.io`
- GitHub repo: `proaiexpert/proaiexpert.github.io`
- Remote: `https://proaiexpert@github.com/proaiexpert/proaiexpert.github.io.git`
- Branch: `main`
- Baseline HEAD before central docs import: `939b0de1929f9b4503d12aa0b103251f72daefce`

This repo is the central ProAI Expert website/workspace. It contains the public ProAI Expert site, bilingual insights, AI systems, websites/branding, and service-positioning structure. It is the best current central location for the reusable Website Production Factory documentation.

## GitHub auth state

The ChatGPT/Codex GitHub connector is authenticated as `proaiexpert` and reports admin/push access to `proaiexpert/proaiexpert.github.io`.

Local GitHub CLI/Git Credential Manager is not authenticated. Local `git push --dry-run` waits for interactive browser authentication. The previous `Financialstream` credential issue was bypassed by making the remote username explicit as `proaiexpert@github.com`.

Because local Git auth was not completed, publication should use either a completed local browser login or the already authenticated GitHub connector.

No token was requested, printed, stored, or committed.

## Candidate folders reviewed

- `C:\Users\PC Profile\Documents\New project\proaiexpert.github.io`
  - Remote: `proaiexpert/proaiexpert.github.io`
  - Branch: `main`
  - Status: selected central repo.

- `C:\Users\PC Profile\Documents\New project 5`
  - Remote: `proaiexpert/proaiexpert.github.io`
  - Branch: `fix/ai-ready-article-visual-parity`
  - Status: central-site working copy on a feature branch; not selected as the clean source of truth.

- `C:\Users\PC Profile\Documents\Proai-expert github\proaiexpert.github.io`
  - Remote: `proaiexpert/proaiexpert.github.io`
  - Branch: `main`
  - Status: older local clone, behind remote; not selected.

- `C:\Users\PC Profile\Documents\New project\proai-expert-v2`
  - Remote: `proaiexpert/proai-expert-v2`
  - Status: older/minimal repo; not selected for factory documentation.

- `C:\Users\PC Profile\Documents\New project\handyman-vancouver-portland-demo`
  - Remote: `proaiexpert/handyman-vancouver-portland-demo`
  - Status: reference/testbed only, not the target repo.

- Desktop exports:
  - `Website-Production-Factory_Handyman-V2_81eaf7d`
  - `Handyman-Website-v2_Demo-Ready_25fe9b9`
  - Status: useful historical/reference exports, not selected as a git source of truth.

## Wrong-repo preservation

The previous local commit in the handyman demo repo was preserved safely:

- Commit: `a751ac6`
- Backup branch: `backup/factory-docs-wrong-repo-a751ac6`
- Patch: `%TEMP%\factory-docs-a751ac6.patch`
- File list: `%TEMP%\factory-docs-a751ac6-files.txt`
- Recovered docs folder: `%TEMP%\website-production-factory-recovered\`

The active handyman demo `main` branch was returned to match `origin/main`; no push was made to the handyman demo repo.

## Source of truth recommendation

Use `docs/website-production-factory/` inside `proaiexpert/proaiexpert.github.io` as the central factory documentation source of truth.

Use `docs/recovery/` for audit, discovery, migration notes, and state snapshots.

Keep the handyman demo repo as a case study and implementation testbed only.
