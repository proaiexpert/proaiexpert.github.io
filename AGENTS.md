# AGENTS.md

## Language
- Work only in Russian for planning, reports, and owner communication.
- Preserve the natural language of user-facing EN/RU content.

## Context Loading
Read this file, any applicable nested AGENTS.md, and the exact files needed for the task. Read AI_START_HERE.md for a fresh session and AI_CURRENT_HANDOFF.md when resuming earlier work; read README.md and other canonical documents when scope, risk or an unresolved conflict requires them. Do not impose a full onboarding chain on a clear, scoped task.

## Execution Routing
- ChatGPT direct GitHub work is the default execution path.
- Tier 1: one ChatGPT chat for small, scoped, reversible work with clear acceptance criteria.
- Tier 2: assess impact, reversibility, validation complexity and regression risk. Production-facing work, shared CSS/JS, EN/RU parity, homepage, portfolio, SEO and file count are risk signals; add independent review when warranted or required by owner/release controls.
- Tier 3: use Codex only when a local dev server, Playwright/browser automation, screenshots, complex build/test pipelines, broad debugging, large refactoring, or prolonged terminal work is materially required.
- Gemini and other third-party or weak substitute models are not default workflow tools.
- The owner-level canonical policy is `proaiexpert/ai-os/00_Operating_System/CHATGPT_FIRST_OPERATING_MODEL.md`; these local rules remain standalone when that private repository is unavailable.

## Remote Visual Review — Cloudflare Pages
- For meaningful visual website work, Cloudflare Pages is the default Owner review layer after implementation, regardless of whether implementation used ChatGPT Direct or Codex.
- Canonical workflow: `docs/operations/CLOUDFLARE_REMOTE_VISUAL_REVIEW.md`.
- Cloudflare project: `proaiexpert-github-io` connected to this GitHub repository with automatic branch deployments.
- GitHub branch/commit remains the source of truth. Cloudflare is review hosting only.
- The Owner often reviews from iPhone and may be away from the development machine. `localhost`, `127.0.0.1`, LAN URLs, Windows filesystem paths, and screenshots alone are not acceptable as the primary Owner deliverable when live visual behavior matters.
- Before requesting Owner visual approval, provide one direct phone-accessible `https://*.proaiexpert-github-io.pages.dev/...` URL.
- Do not make the Owner navigate the Cloudflare dashboard or construct the URL manually.
- Current stable AI Systems Hero review branch is `hero-preview`; it is a review/mirror branch only and is not product authority.
- Preview-only helpers such as 3D focus, R3/candidate switching, or explicit hover simulation are allowed only when isolated under `owner-preview/` and clearly labeled review-only.
- Do not modify product mobile behavior, camera, layout, materials, or interaction merely to improve the review UI.
- ChatGPT Sites is optional; do not spend Codex/Work capacity merely to obtain a hosted preview URL when Cloudflare Pages can provide it.

## Chat Lifecycle
Use a new chat when stale context materially affects correctness, a different repository or architecture needs separate working context, or independent review requires separation. Do not require a new chat solely because a task enters another phase.

Keep related work in the current chat while its goal, scope and context remain usable. Do not automatically retire a Builder chat merely because a branch was pushed or a phase ended. When independent review is warranted, use a separate context so the reviewer can inspect the actual result without inheriting implementation assumptions. Preserve any review required by the owner or applicable release controls.

Preserve continuity through current handoffs, exact branches/SHAs and task-relevant canonical documents; record a next action only when one is actually needed.

## Project Working Style
- Prefer minimal safe patches.
- Do not refactor unless explicitly requested.
- Do not touch unrelated files.
- Do not change copy, structure, layout, or styling unless explicitly requested.
- Do not start editing until exact target files are known.
- Keep the file scope minimal and explicit. File count is a signal to reassess scope and risk, not an automatic reason to add chats or executors. Do not silently widen the authorized scope.

## Website Rules
- Do not run broad site audits by default.
- Do not do open-ended cleanup or “improve the whole page” tasks.
- For visual/layout/shared UI fixes, apply changes symmetrically to EN and RU counterparts when both versions exist.
- For text, copy, and SEO, handle each language as localized content rather than mechanical translation.
- Preserve canonical, hreflang, x-default, internal links, mobile behavior, and existing case-specific art direction unless explicitly changing them.

## Builder / Reviewer Rule
When independent review is justified by risk, impact, reversibility or validation complexity, or required by the owner or applicable release controls:

- Builder works in a dedicated branch and reports base SHA, head SHA, exact files, checks, unverified items, and risks.
- Reviewer starts in a fresh ChatGPT chat and initially works read-only.
- Reviewer checks the actual GitHub diff, not only the Builder report.
- Reviewer returns `ACCEPT`, `TARGETED CORRECTION`, or `REJECT`.
- Reviewer must not redesign or broaden the task without owner approval.

## Project Safety
- Do not invent file names, selectors, IDs, env vars, APIs, or dependencies.
- Before changing code, read the current file.
- Keep changes scoped to the requested issue.
- If exact file scope is unknown, identify it without editing first.
- Stop after the requested change is done.
- Report browser, device, runtime, or visual behavior as unverified when it was not actually tested.

## Git and Production Safety
- Work in a dedicated branch unless explicitly instructed otherwise.
- Never modify `main`, merge, publish, roll back production, force-push, delete branches/files, or perform destructive operations without explicit owner authorization.
- Commit and push only when explicitly authorized or clearly included in the task.
- Before merge, verify base SHA, expected head SHA, changed files, mergeability, and scope.
- Prefer squash merge when intermediate implementation commits should not enter production history.

## Budget Safety
- Avoid repeated search/edit loops.
- Avoid broad agent exploration for small website fixes.
- Do not route ordinary code edits through Codex merely because Codex is available.
- Do not search for free substitute models when ChatGPT can complete the task directly.
- If the first pass does not create clear progress, narrow scope or escalate by risk tier.

## Handoff Maintenance
After meaningful merged work, update `AI_CURRENT_HANDOFF.md` with the new stable state, current priority, unresolved risks, canonical documents, and next approved action.

## Output Format
After changes, report concisely in Russian: what changed, exact files, checks actually run, and material risks or unverified behavior. Include base/head SHA for GitHub changes and the route when relevant; add a commit title only if a commit exists or it was requested. Provide expanded handoff/evidence when the task or risk requires it. Add a next action only when one is actually needed.
For meaningful visual website work, provide the direct phone-accessible Cloudflare Pages preview URL and explain what the Owner should inspect before requesting visual approval.