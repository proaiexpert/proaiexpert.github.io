# ProAI Expert Hero — Owner Workflow Lock

Date: 2026-08-10
Status: LOCKED PROCESS RULE
Repository: `proaiexpert/proaiexpert.github.io`

## Non-negotiable handoff rule

The owner is NEVER used as a context, file, screenshot, link, or asset transport layer between chats/agents.

For every delegated Hero task:

1. All canonical context must be saved in GitHub before handoff.
2. The next chat must receive ONE self-contained copy/paste block only.
3. That one block must point to ONE GitHub start-here document on an exact branch/ref.
4. The GitHub start-here document must contain all required repo refs, source paths, exact SHAs, routes, locked decisions, requested corrections, output locations, QA gates, and safety rules.
5. Local paths such as `/mnt/data/...` are NEVER valid cross-chat handoff sources.
6. The owner must never be asked to download, re-upload, attach, copy, move, or relay an asset manually.
7. If a visual screenshot is only local, the agent must first persist an authoritative reproducible GitHub source/ref or save the artifact in connected storage and record its exact immutable ID inside the GitHub handoff. The handoff remains GitHub-first.
8. A delegated task is invalid if it depends on information located outside the one GitHub start-here chain and not referenced from it.
9. Before telling the owner a handoff is ready, verify that a fresh chat with GitHub access can discover every required source without owner assistance.
10. After each owner-approved decision, immediately update the canonical GitHub handoff in the same session. Do not leave final owner decisions only in chat history.

## Current Hero recovery source

The current recoverable visual state is repository-backed and must be used instead of a local screenshot as the canonical cross-chat source.

Frozen recovered branch:
`agent/hero-recovery-approved-composition-owner-look`

Recovery handoff commit:
`3067fa02631de98d98d9b6bc8a1d0ea880ad5a41`

Underlying recovered visual checkpoint:
`8bab1bbddbaadf70d88fd72c77e08d2d0ac77429`

Active preview routes:
- EN: `/hero-a-plus-c-shape-preview/`
- RU: `/ru/hero-a-plus-c-shape-preview/`

Recovery lock:
`docs/site-evolution/PROAI_EXPERT_HERO_RECOVERY_LOCK_2026-08-09.md`

This repository-backed state is the canonical way for a new chat to reconstruct/review the current Hero. `RECOVERED_R46_DESKTOP_STATIC.png` is owner-review evidence, not the only source of truth.

## Current owner correction to carry forward

For the next static corrective pass only:

- do not redesign the Hero;
- do not change the C-shape concept;
- reduce the right-side object approximately 3–6% only if needed for balance;
- rebuild the 01–04 rail with strict optical/physical alignment;
- use `04 RESULT` in EN, not `04 OUTCOME`;
- RU remains `04 РЕЗУЛЬТАТ`;
- improve graphite/metal richness, internal depth, contact/reflection, and physically embedded signal behavior;
- do not start motion until the corrected static is owner-approved;
- do not modify production `/` or `/ru/`;
- no merge, deploy, or production PR.

## Required owner-facing handoff format

The owner should receive only a short block equivalent to:

`@GitHub Open <exact start-here path> on <exact branch> and execute it completely. Do not ask me to upload or move files manually.`

Everything else belongs in GitHub, not in the owner's clipboard workflow.
