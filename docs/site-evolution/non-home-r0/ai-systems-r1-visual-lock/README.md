# AI Systems R1 — Visual Lock Workspace

**Purpose:** shared cross-chat visual review workspace for AI Systems R1.  
**Branch:** `agent/proai-ai-systems-r1-visual-lock`  
**Workspace base:** `536091991d05e8259ffdf9b5b7d1708bd36b3993`  
**Golden Blueprint:** `docs/site-evolution/non-home-r0/AI_SYSTEMS_R1_GOLDEN_BLUEPRINT.md` at commit `536091991d05e8259ffdf9b5b7d1708bd36b3993`.

This branch is for **review artifacts only**. No production HTML/CSS/JS, no homepage changes, no merge, no deploy.

## Shared workflow

Every independent visual agent MUST work in its own subfolder under `incoming/` and MUST NOT overwrite or delete another agent's files.

Required candidate package:

- `A-hero.png` or `.jpg/.webp`
- `B-register.png` or `.jpg/.webp`
- `C-pearl-decision.png` or `.jpg/.webp`
- `D-human-check-gate.png` or `.jpg/.webp`
- `E-mobile-390.png` or `.jpg/.webp`
- optional `board.png` / `board.jpg`
- `REVIEW.md` — concise visual verdict and corrections
- `MANIFEST.md` — source prompt/agent, date, image dimensions, and exact commit SHA

Recommended folder names:

`incoming/visual-a/`
`incoming/visual-b/`
`incoming/visual-c/`
`incoming/visual-d/`

Agents must commit their own generated visual files to this branch and return only:

1. exact commit SHA;
2. GitHub folder link;
3. short `OWNER SUMMARY — RU`;
4. `READY TO FREEZE / TARGETED VISUAL CORRECTION / NOT READY`.

The Owner should not have to relay images manually between chats.

## Review states

- `incoming/` — raw independent candidates; never treated as authority.
- `shortlisted/` — candidates selected by Master Coordinator for direct comparison.
- `approved/` — only Owner-approved Visual Lock assets/specification.

Moving a candidate into `shortlisted/` or `approved/` requires a Master/Owner decision and a separate commit. Do not silently promote your own work.

## Hard visual rules

The frozen concept remains `THE OPERATIONAL REGISTER — SIGNAL → CONTROL`.

`HUMAN CHECK` is a control gate, not a peer fifth-column workflow step.

Do not turn the page into a dashboard, node graph, terminal, SaaS UI, five equal columns, glass-card wall, cyan/purple AI glow, Cube/Connected-System clone, or WebGL spectacle.

## Preservation rule

Rejected work is not deleted during the review round. Mark it `REJECTED` in `INDEX.md` with a reason so later agents can understand what failed without repeating it.
