# AI Current Handoff — ProAI Expert Website

## Repository Purpose
`proaiexpert/proaiexpert.github.io` is the bilingual ProAI Expert studio website and portfolio repository.

## Current Stable State
Production currently includes:

- bilingual EN/RU main website;
- premium EN/RU Insights hubs and localized article routes;
- published EN/RU lead-response article pair;
- visible founder author identity, portrait, `Person` author JSON-LD, and separate organization publisher on current flagship articles;
- repaired premium-article mobile menu, Executive Summary width, skip-link behavior, portrait flow, and low-height phone-landscape layouts;
- strengthened contextual internal linking between premium articles, services, case studies, and Financial Stream;
- premium editorial materials block on both homepages with three selected guides:
  1. multilingual website strategy;
  2. website proposal evaluation;
  3. lead-response operations.

Latest completed homepage feature commit at the time of this handoff:

`87a8f85f91c9b72b21bb0ead2543438c2658d0cb`

Always fetch current `main`; this SHA identifies the latest completed feature when this handoff was written, not a permanent pointer.

## Recently Completed
- Published the EN/RU lead-response system article pair and integrated it into Insights and sitemap.
- Added founder author identity and portrait to current flagship article pairs.
- Repaired article mobile navigation and phone-landscape flow.
- Added contextual internal links and stronger visual hierarchy to the August premium articles.
- Rebuilt and published the EN/RU homepage materials block from the then-current production homepage snapshot.
- Replaced the old homepage AI-agent card with the newer lead-response guide.
- Removed the former `display: contents` dependency from the homepage materials header.

## Homepage Source Architecture
The current homepages use small Jekyll wrappers:

- `index.html`
- `ru/index.html`

They include exact production snapshots:

- `_includes/homepage-current-en.html`
- `_includes/homepage-current-ru.html`

The wrappers preserve the full current homepage, inject `assets/css/homepage-materials-editorial-v2.css`, and replace only the `#insights` section before `#selected-work`.

Important:

- Do not delete or casually regenerate the snapshot includes.
- Do not copy the obsolete `homepage-materials-editorial-v1` branch over current `main`.
- Any broad homepage edit must account for the wrapper/snapshot architecture or deliberately replace it with a verified safer architecture.
- The old v1 branch is reference-only and is not a merge candidate.

## Current Priority
First complete owner real-device QA of the newly published EN/RU homepage materials block:

- desktop or large-screen hierarchy;
- iPhone portrait;
- iPhone landscape;
- all six article links;
- both archive links;
- position after Financial Stream and before Selected Work;
- no regression in header, mobile menu, case section, Selected Work, or footer.

After owner acceptance, the next product phase is an **independent read-only audit of the Case Studies system**.

## Next Product Phase — Case Studies Audit
Audit before editing:

1. EN/RU Case Studies index;
2. Financial Stream case pair;
3. Alina Horb case pair;
4. Local Repair Pro case pair;
5. navigation and cross-linking between homepage, case index, cases, services, and related materials;
6. real-device portrait and landscape behavior;
7. evidence discipline, visual differentiation, and truthful project status.

The audit must distinguish:

- real client evidence;
- concept-project evidence;
- verified technical facts;
- unsupported performance claims.

Do not add invented rankings, leads, conversion rates, revenue, testimonials, project counts, or outcome metrics.

## Planned Order After Case Studies Audit
1. targeted case-study corrections only where evidence and owner review support them;
2. improved Insights/Materials hub architecture;
3. selective refresh of older articles using actual search intent and available performance data;
4. one lead-magnet pilot based on a genuinely useful framework or checklist;
5. broader author-authority rollout only where article quality justifies it.

## Canonical Project Documents
- `AGENTS.md`
- `AI_START_HERE.md`
- `AI_CURRENT_HANDOFF.md`
- `README.md`
- portfolio work: `docs/portfolio-case-packs/PORTFOLIO_REBRAND_CURRENT_HANDOFF.md`
- task-specific source documents explicitly named by the owner or current handoff.

Do not treat older portfolio documents as current status when they conflict with `PORTFOLIO_REBRAND_CURRENT_HANDOFF.md` or the actual current `main`.

## Critical Invariants
- English lives at root; Russian lives under `/ru/`.
- EN/RU pages are localized counterparts, not mechanical translations.
- Preserve canonical, reciprocal hreflang, x-default, sitemap, internal links, and mobile behavior unless explicitly changing them.
- Financial Stream remains a real client benchmark.
- Alina Horb and Local Repair Pro retain their own case-specific art directions and evidence boundaries.
- Local Repair Pro project status must remain truthful.
- `main`, merge, publication, rollback, force-push, deletion, and destructive operations require explicit owner authorization.

## Known Follow-up Items
- Confirm the homepage materials block on the owner’s actual iPhone after GitHub Pages finishes deployment.
- The homepage snapshot-wrapper architecture is functional but should be handled consciously in future broad homepage work.
- The article generator/source may later need parity with current runtime article enhancements; do not change it incidentally.
- Cache-busting versions should be increased whenever an existing shared CSS or JS asset changes.
- Existing semantic or footer inconsistencies should be handled only as explicit targeted tasks.

## Next Approved Action
After owner homepage QA, start a fresh read-only Control/Reviewer pass with:

```text
Открой proaiexpert/proaiexpert.github.io, прочитай AI_START_HERE.md и актуальный AI_CURRENT_HANDOFF.md. Роль: Control/Reviewer. Проведи независимый аудит EN/RU Case Studies index и трёх кейсов. Сначала проверь актуальный main и текущий portfolio handoff. Файлы не изменяй.
```

## Mechanical State Rule
Always fetch current refs, branches, PRs, and SHAs. Never assume a branch or SHA from an old chat remains current.
