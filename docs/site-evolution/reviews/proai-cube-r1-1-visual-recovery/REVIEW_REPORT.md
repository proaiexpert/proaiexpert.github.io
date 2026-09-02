# PROAI CUBE R1.1 — Golden Visual Recovery

OWNER SUMMARY — RU

## Status

OWNER REVIEW READY — build-only recovery branch. Main не изменён, merge и deploy не выполнялись.

## Interrupted WIP preserved

YES.

Обнаружен dirty checkout на ветке `agent/proai-cube-r1-production-evidence-closeout`: HEAD `99bf8c865bc1f483a1169a5463cfb1f0748ba137`, `package-lock.json` modified и 185 untracked entries, включая предыдущие Cube evidence/screenshots и browser artifacts. Состояние сохранено вне репозитория:

`C:\Users\PCPROF~1\AppData\Local\Temp\proai-cube-r1-1-visual-recovery-interrupted-wip-20260902`

В snapshot записаны branch, HEAD, status, unstaged/staged diff, последние 10 commits, untracked paths и копии релевантных Cube/evidence файлов. Dirty WIP не очищался и не перезаписывался.

## Repository / history

- Remote main verified: `90d585ef98b17cae8e45619847a5f8cf59ce0d04` via both `origin/main` and `git ls-remote`.
- Recovery branch: `agent/proai-cube-r1-1-visual-recovery`.
- Golden visual authority: `7b0942a042ef23e10cd74592208eeae94479b45e`.
- Historical protected/rejected R1 branch preserved: `agent/proai-cube-ownership-fingerprint-r1`.
- Historical donor file preserved: `assets/models/proai-cube/rubik_39_s_cube_animation.glb`.
- Rejected protected R1 asset preserved: `assets/models/proai-cube/proai-cube-r1.glb`.

## R1.1 candidate

- New asset: `assets/models/proai-cube/proai-cube-r1-1.glb`.
- SHA256: `3907E5ECB4FC532FB3A443AB5E215BE5F10D9EF5A0AF552C957E985720B3FB66`.
- Old `PROAI_SIG_KINETIC_R1` node/mesh/material and its binary payload removed from the candidate.
- `PROAI_FORENSIC_WITNESS_R1` preserved and hidden during normal rendering.
- GLB metadata updated to asset `PAI-CUBE-0001`, public name `PROAI CUBE`, revision `r1.1`, build `PAI-CUBE-R1-1-7B0942A0`.

## Visible treatment

- One modular runtime micro-etch with exact text `PROAI`.
- Location: one center tile of the selected `+Y` external face.
- Typography source: existing ProAI `Instrument Sans Variable` brand font; no new font/runtime dependency.
- Implementation: attached neutral physical surface-response mesh using alpha mask, roughness delta and clearcoat delta; it follows the logical cubie parent during slice turns.
- Variants: A `WHISPER`, B `SIGNATURE` (default), C `REFERENCE`; only intensity changes.
- Emissive: NO.
- Cyan/blue: NO.
- Transparent overlay: NO.
- Double-sided text: NO; `FrontSide`, depth test/write enabled.
- Old cyan/emissive/depth-disabled kinetic signature: removed from normal presentation.

## Verification

- JS syntax checks: PASS for source materials, motion wrappers, bootstrap, header runtime and GLB builder.
- GLB structural parse: PASS; 250 nodes, 23 meshes, 91 accessors/bufferViews; old signature absent, forensic witness present.
- Runtime ready: PASS; asset `PAI-CUBE-0001`, revision `r1.1`.
- Geometry: PASS; 180 face meshes, 30 core meshes, 27 logical cubies.
- Mechanics QA: PASS; X/Y/Z forward/inverse, paired turns, zero member intersection, canonical restoration.
- Canonical transform error: max position `4.9227844771419234e-14`, quaternion `0`, scale `0`.
- Homepage EN/RU local assembly: PASS; canvas mounted, no horizontal overflow, browser errors `[]`.
- Header living Cube: PASS; asset `PAI-CUBE-0001`, `ready=true`, revision `r1.1`, browser errors `[]`.
- Mobile 390 / 320: PASS; runtime ready, screenshots captured, browser errors `[]`.
- Reduced motion: PASS; native `prefers-reduced-motion` true, ready true, scheduler disabled/not running, event serial `0`, errors `[]`.
- Opposite-side and active-slice frames: captured; no mirrored/through-geometry signature observed.
- Motion video: NOT CAPTURED. Available local browser surface provided deterministic screenshots and runtime metrics, but no deterministic video capture path was available; no video-based motion PASS is claimed.

## Evidence

Review harness:

`docs/site-evolution/reviews/proai-cube-ownership-fingerprint-r1/review.html`

It exposes Golden 7b reference, Micro-Etch OFF, A/B/C intensity variants, deterministic rest/glint/opposite poses, active slice 50%, mechanics QA and forensic inspection.

Frames:

`01-golden-reference-7b.png` through `13-reduced-motion.png`, plus `homepage-en-r1-1.png`, `homepage-ru-r1-1.png` and `header-living-r1-1.png`.

Machine-readable reports: `runtime-qa.json` and `13-reduced-motion.json`.

## Ledger note

Previous interrupted work found stale JS SHA256 records caused by LF/CRLF response normalization. That finding is preserved and not rewritten into a canonical production ledger before Owner selects A/B/C. Final selected R1.1 hashes remain pending Owner visual selection.

## Required final gate fields

- MAIN MODIFIED: NO
- MERGED: NO
- DEPLOYED: NO
- PERFORMANCE REGRESSION: none observed in runtime diagnostics; no broad performance benchmark claimed.
- FINAL VERDICT: Golden geometry/material/lighting/motion system is restored for the R1.1 candidate, invisible forensic protection remains intact, and three ultra-subtle optical micro-etch intensity options are ready for Owner visual selection.
