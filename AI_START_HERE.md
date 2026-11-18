# AI Start Here — ProAI Expert Website

## Purpose
This is the deterministic entrypoint for a fresh ChatGPT or Codex session working on `proaiexpert/proaiexpert.github.io`.

## Task-Scoped First Actions
Read root AGENTS.md, any applicable nested AGENTS.md, and the exact task-relevant files. Consult AI_CURRENT_HANDOFF.md when resuming work and README.md or other canonical documents when scope, risk or an unresolved conflict requires them. Verify the current repository ref/SHA and relevant branch/PR before modifying GitHub.
For meaningful visual website work, read docs/operations/CLOUDFLARE_REMOTE_VISUAL_REVIEW.md before choosing the Owner review path. Do not impose a full onboarding chain on a small, clearly scoped task. Do not treat old drafts, closed issues, screenshots or chat exports as current truth when current source documents exist.

## Role Selection
- Strategy, architecture, prioritization, article or page planning → `Control`.
- Code, content, SEO, branch, commit, or push implementation → `Builder`.
- Audit, verification, diff/PR review, readiness check → `Reviewer`.
- Merge/publication → `Publisher`, only when explicitly authorized.
- Ambiguous task → `Control`, read-only.

## Risk Routing
- Tier 1: one ChatGPT chat for small, scoped, reversible work with clear acceptance criteria.
- Tier 2: assess impact, reversibility, validation complexity and regression risk. Production-facing work, shared CSS/JS, EN/RU parity, homepage, portfolio, SEO and file count are risk signals, not automatic two-chat triggers. Add independent review when warranted or required by owner/release controls.
- Tier 3: Codex only when a local dev server, Playwright/browser automation, screenshots, complex build/test pipelines, broad debugging, large refactor, or prolonged terminal execution is materially required.
- Do not use Codex merely to obtain a hosted preview. Cloudflare Pages is the default remote visual-review layer.

## Remote Visual Review
For meaningful visual website work:
- GitHub branch/commit remains the source authority.
- Use Cloudflare Pages to provide the Owner with a live HTTPS preview accessible from iPhone on any network.
- Do not use localhost, LAN URLs, Windows paths, or screenshots alone as the primary Owner review surface when motion/interactivity/responsive behavior matters.
- Current Cloudflare project: `proaiexpert-github-io`.
- Current stable AI Systems Hero preview branch: `hero-preview`.
- Preview-only controls must be clearly isolated and must not silently alter product behavior.
- Follow `docs/operations/CLOUDFLARE_REMOTE_VISUAL_REVIEW.md`.

## Project Invariants
- English lives at root; Russian lives under `/ru/`.
- EN/RU pages are localized counterparts, not mechanical translations.
- Preserve canonical, reciprocal hreflang, x-default, internal links, sitemap, and mobile behavior unless explicitly changing them.
- Preserve distinct portfolio case concepts and truthful evidence boundaries.
- Do not modify `main`, merge, publish, roll back, force-push, delete, or perform destructive operations without explicit owner authorization.

## First Response Contract
For a clear, small task, respond concisely and execute authorized work. Before editing GitHub, verify the repository, exact file scope, current ref/SHA, and applicable permissions. For high-risk changes or explicit handoffs, include the role, relevant context read, risks and checks. Include a next action only when one is actually needed. Do not impose a long preflight report for every task.
For meaningful visual work, explain how the Owner will receive a phone-accessible Cloudflare preview URL before requesting visual approval.

## Handoff Rule
After meaningful merged work, update `AI_CURRENT_HANDOFF.md` so the next fresh chat can recover the current state without reading prior chats.