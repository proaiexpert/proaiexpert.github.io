# AI Current Handoff — ProAI Expert Website

## Repository Purpose
`proaiexpert/proaiexpert.github.io` is the bilingual ProAI Expert studio website and portfolio repository.

## Current Stable State
Production currently includes:

- bilingual EN/RU main website;
- Insights hubs and localized article routes;
- four Stage 3 premium articles;
- repaired premium article mobile flow and navigation;
- exact responsive RU/EN worked examples in the website-proposal articles;
- current production article-table feature commit: `d043f5ecc83d98bfa5b81d131f65e477fb2c6a1e`.

Always fetch current `main`; the SHA above identifies the latest completed feature, not a permanent main pointer.

## Recently Completed
- Stage 3 premium articles were repaired, integrated, and published.
- Empty proposal-evaluation tables were replaced with exact localized examples.
- Mobile portrait and phone-landscape table presentation now uses readable cards.
- ChatGPT-first workflow and role-specific onboarding were adopted.

## Current Priority
The next product phase is the **premium editorial materials block on the EN/RU homepage**.

Recommended route:

1. fresh `Control` chat to finalize architecture, article selection, hierarchy, and EN/RU adaptation;
2. fresh `Builder` chat to implement in a dedicated branch;
3. fresh `Reviewer` chat to inspect actual GitHub diff and cross-device/cross-language risks;
4. merge only after explicit owner approval.

## Planned Order After Homepage Materials Block
1. independent audit of Case Studies index and three portfolio cases in EN/RU;
2. targeted corrections only where evidence supports them;
3. improved Insights/Materials hub architecture;
4. selective updates to older articles and remaining site pages.

## Canonical Project Documents
- `AGENTS.md`
- `AI_START_HERE.md`
- `AI_CURRENT_HANDOFF.md`
- `README.md`
- portfolio work: `docs/portfolio-case-packs/PORTFOLIO_REBRAND_CURRENT_HANDOFF.md`
- task-specific source docs explicitly named by the owner or current handoff.

Do not treat older portfolio documents as current status when they conflict with `PORTFOLIO_REBRAND_CURRENT_HANDOFF.md`.

## Critical Invariants
- English root and Russian `/ru/` architecture.
- Localized EN/RU content, not mechanical translation.
- Canonical/hreflang/x-default integrity.
- No invented rankings, leads, metrics, clients, or evidence.
- Financial Stream remains a real client benchmark; Alina Horb and Local Repair Pro retain their own case-specific art directions and evidence boundaries.
- `main`, merge, publication, rollback, force-push, deletion, and destructive operations require explicit owner authorization.

## Known Follow-up Items
- Owner should continue real-device review of published premium articles where useful.
- The article generator/source may later need parity with the runtime proposal-table data; do not change it incidentally.
- Existing semantic or footer inconsistencies should be handled only as explicit targeted tasks.

## Next Approved Action
Start a fresh `Control` chat for the homepage materials block using:

```text
Открой proaiexpert/proaiexpert.github.io, прочитай AI_START_HERE.md. Роль: Control. Спроектируй premium editorial materials block для EN/RU homepage. Файлы не изменяй.
```

## Mechanical State Rule
Always fetch current refs, branches, PRs, and SHAs. Never assume a branch or SHA from an old chat remains current.
