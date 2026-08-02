# AGENTS.md

## Language
- Work only in Russian for planning, reports, and owner communication.
- Preserve the natural language of user-facing EN/RU content.

## Execution Routing
- ChatGPT direct GitHub work is the default execution path.
- Tier 1: one ChatGPT chat for small, scoped, reversible work, normally 1–3 files.
- Tier 2: separate ChatGPT Builder and Reviewer chats for production-facing, shared CSS/JS, EN/RU parity, homepage, portfolio, SEO, or medium-risk work.
- Tier 3: use Codex only when a local dev server, Playwright/browser automation, screenshots, complex build/test pipelines, broad debugging, large refactoring, or prolonged terminal work is materially required.
- Gemini and other third-party or weak substitute models are not default workflow tools.
- The owner-level canonical policy is `proaiexpert/ai-os/00_Operating_System/CHATGPT_FIRST_OPERATING_MODEL.md`; these local rules remain standalone when that private repository is unavailable.

## Project Working Style
- Prefer minimal safe patches.
- Do not refactor unless explicitly requested.
- Do not touch unrelated files.
- Do not change copy, structure, layout, or styling unless explicitly requested.
- Do not start editing until exact target files are known.
- Default edit scope is 1–2 files.
- Maximum normal Tier 1 edit scope is 3 files.
- If more than 3 files are necessary, classify as Tier 2 instead of silently widening scope.

## Website Rules
- Do not run broad site audits by default.
- Do not do open-ended cleanup or “improve the whole page” tasks.
- For visual/layout/shared UI fixes, apply changes symmetrically to EN and RU counterparts when both versions exist.
- For text, copy, and SEO, handle each language as localized content rather than mechanical translation.
- Preserve canonical, hreflang, x-default, internal links, mobile behavior, and existing case-specific art direction unless explicitly changing them.

## Builder / Reviewer Rule
For Tier 2 and Tier 3 work:

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

## Output Format
After changes, report:

1. Route used: ChatGPT Direct / Builder + Reviewer / Codex escalation.
2. Base SHA and head SHA.
3. What changed.
4. Exact files changed.
5. Checks run.
6. What was verified.
7. What remains unverified.
8. Risks and intentionally untouched areas.
9. Commit title and next action.
