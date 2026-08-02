# AI Start Here — ProAI Expert Website

## Purpose
This is the deterministic entrypoint for a fresh ChatGPT or Codex session working on `proaiexpert/proaiexpert.github.io`.

## Required First Actions
1. Fetch current `main` and record its SHA.
2. Read root `AGENTS.md`.
3. Read root `AI_CURRENT_HANDOFF.md`.
4. Read root `README.md`.
5. Read only the canonical task-specific documents named in the handoff or user instruction.
6. Inspect relevant branch/PR metadata when the task references active work.

Do not begin broad repository exploration and do not treat old drafts, closed issues, screenshots, or chat exports as current truth unless the handoff explicitly points to them.

## Role Selection
- Strategy, architecture, prioritization, article or page planning → `Control`.
- Code, content, SEO, branch, commit, or push implementation → `Builder`.
- Audit, verification, diff/PR review, readiness check → `Reviewer`.
- Merge/publication → `Publisher`, only when explicitly authorized.
- Ambiguous task → `Control`, read-only.

## Risk Routing
- Tier 1: one ChatGPT chat for small scoped work, normally 1–3 files.
- Tier 2: separate ChatGPT Builder and Reviewer chats for production-facing, shared CSS/JS, EN/RU parity, homepage, portfolio, SEO architecture, or medium-risk work.
- Tier 3: Codex only when a local dev server, Playwright/browser automation, screenshots, complex build/test pipelines, broad debugging, large refactor, or prolonged terminal execution is materially required.

## Project Invariants
- English lives at root; Russian lives under `/ru/`.
- EN/RU pages are localized counterparts, not mechanical translations.
- Preserve canonical, reciprocal hreflang, x-default, internal links, sitemap, and mobile behavior unless explicitly changing them.
- Preserve distinct portfolio case concepts and truthful evidence boundaries.
- Do not modify `main`, merge, publish, roll back, force-push, delete, or perform destructive operations without explicit owner authorization.

## First Response Contract
Before editing, report:

- repository;
- role;
- risk tier;
- current main SHA;
- canonical files read;
- current project state;
- task interpretation;
- expected branch;
- allowed files and forbidden areas;
- write/commit/push/merge permissions;
- blockers or unverified dependencies;
- next action.

For a clear Builder instruction that already authorizes branch, commit, and push, proceed after this brief preamble without asking for redundant confirmation.

## Handoff Rule
After meaningful merged work, update `AI_CURRENT_HANDOFF.md` so the next fresh chat can recover the current state without reading prior chats.
