# ChatGPT Sites Visual Review Workflow R1

Status: PROPOSED WORKFLOW / NON-PRODUCTION
Date: 2026-09-04
Repository: `proaiexpert/proaiexpert.github.io`

## Purpose

Use ChatGPT Sites as a remote visual-review layer for ProAI Expert website R&D when the Owner needs to inspect a real responsive browser build from iPhone or another remote device and local preview URLs, localhost, screenshots, or machine-bound dev servers are insufficient.

Sites is a review/hosting layer. It is **not** production authority and does not replace GitHub source control, branch review, production QA, merge approval, or the production deployment pipeline.

## Trigger

Prefer a ChatGPT Sites review candidate when ALL are true:

1. the task is visual, responsive, interactive, motion, layout, Hero, homepage-section, or other browser-experience work;
2. the Owner materially benefits from inspecting the real implementation rather than screenshots;
3. the current local/dev preview is not reliably accessible from the Owner's phone or remote location;
4. a separate hosted review candidate can be created without changing production authority.

Typical examples:

- Hero compositions;
- Selected Work / Selected Thinking alternatives;
- homepage block replacement or redesign R&D;
- motion / WebGL / Three.js / Spline integration candidates when supported by the Sites runtime;
- responsive mobile/desktop geometry review;
- isolated landing-page or component prototypes.

## Do not use Sites as the authority for

- production `main`;
- merge decisions without GitHub diff review;
- canonical source history;
- rollback authority;
- unsupported private-network/background-service/runtime requirements;
- any build that would expose secrets or sensitive data.

## Core rule

`GitHub branch + exact commit SHA = source authority.`

`ChatGPT Site = hosted visual review artifact for that candidate.`

Every Site review report must identify the exact branch and commit SHA represented by the hosted candidate whenever the Site originated from repository/local source.

## Workflow A — ChatGPT / Work visual prototype

Use when the current Builder chat already owns the visual task and does not require a local Codex environment.

1. Keep the existing task, branch, acceptance criteria, and production restrictions unchanged.
2. In the same eligible ChatGPT Work chat, explicitly invoke the Sites workflow with `@Sites` or request a `website` review build.
3. Build only the current approved candidate. Do not broaden the redesign.
4. Ask Sites to create a private preview first.
5. Refine only against the existing task criteria.
6. Save a version before deployment.
7. Deploy only the approved review version to a ChatGPT Site URL.
8. Use the narrowest access level that still lets the Owner open the Site from iPhone.
9. Do not publish or deploy anything to `proaiexpert.com`, GitHub Pages production, or `main`.
10. Report the Site URL, source branch/SHA, what was verified in-browser, and what remains unverified.

A new chat is not mandatory. If the current eligible Work chat already has the correct task context, keep that chat. A Site remains available in the Sites list after the creating chat ends.

## Workflow B — Codex / existing local project

Use when Codex already owns a local branch/worktree or when the candidate requires a local dev server, complex frontend tooling, browser automation, Three.js/WebGL/WebGPU, or other local execution.

1. Keep Codex on the exact current task branch/worktree.
2. Verify the exact branch and HEAD SHA before creating a Site candidate.
3. From ChatGPT desktop Codex/Work, ask Sites to check whether the current project is compatible with the Sites runtime.
4. If compatible, create a Sites project from the current local source.
5. If compatibility changes are required, do **not** silently alter the production-facing candidate branch. Prefer a dedicated preview branch/worktree or keep tooling-only metadata uncommitted until explicitly approved.
6. Treat `.openai/hosting.json` as Sites linkage/tooling metadata, not product authority.
7. Save a version first. For local-source Sites, the saved version should remain associated with the Git commit used for the build.
8. Review the saved candidate.
9. Deploy the selected version to a ChatGPT Site URL for Owner inspection.
10. Do not merge, push production changes, deploy to ProAI production, or modify `main` without explicit Owner authorization.

## Owner remote-review requirement

For any task where the Owner is remote/mobile and the worker would otherwise provide only:

- `localhost`;
- LAN-only URLs;
- machine-bound preview URLs;
- screenshots as the sole visual evidence;

first determine whether a ChatGPT Sites review candidate can provide a real phone-accessible browser URL.

If Sites is compatible, prefer it over repeated screenshot-only review.

If Sites is not compatible, report the exact incompatibility and use the existing safe preview/deployment fallback. Do not rewrite the implementation merely to force Sites compatibility unless the Owner explicitly approves that tradeoff.

## Version and deployment safety

ChatGPT Sites separates:

1. **Save version** — build a reviewable candidate;
2. **Deploy version** — make that saved version accessible through a Site URL.

Every Sites deployment URL is a live hosted Site deployment. Therefore:

- save first;
- review before deploy;
- use narrow access by default;
- never confuse a ChatGPT Site deployment with ProAI production deployment.

## Required worker report

Every Sites-enabled review pass must report:

- `SITES USED: YES / NO`
- `SOURCE BRANCH:`
- `SOURCE HEAD SHA:`
- `SAVED VERSION:` identifier if available
- `SITE URL:`
- `ACCESS:` owner-only / selected viewers / public
- `MOBILE IPHONE REVIEW READY: YES / NO`
- `SITES COMPATIBILITY CHANGES:` exact files or NONE
- `PRODUCTION MAIN MODIFIED: NO`
- `PROAI PRODUCTION DEPLOYED: NO`
- `UNVERIFIED:` remaining visual/runtime items

## Escalation rule

If the candidate works locally but cannot be represented faithfully in Sites because of runtime/framework/network limitations:

1. preserve the local candidate unchanged;
2. do not downgrade fidelity just to fit Sites;
3. report `SITES PREVIEW BLOCKED` with the concrete reason;
4. fall back to the existing branch-preview/browser-capture pipeline.

## Official reference

- https://help.openai.com/en/articles/20001339
- https://learn.chatgpt.com/docs/sites
