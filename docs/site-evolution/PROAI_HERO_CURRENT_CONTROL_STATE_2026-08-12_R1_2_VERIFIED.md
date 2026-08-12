# PROAI EXPERT HERO — CURRENT CONTROL STATE — R1.2 VERIFIED

Repository: `proaiexpert/proaiexpert.github.io`

Date: 2026-08-12

This document is the newest control-state delta for the ProAI Expert Hero workstream.

It preserves all earlier handoff/control documents as historical context and supersedes only their stale statements about R1.2 being pending.

Historical sources remain valid unless contradicted here:
- `docs/site-evolution/PROAI_HERO_NEXT_CHAT_MASTER_HANDOFF_2026-08-12.md`
- `docs/site-evolution/PROAI_HERO_CURRENT_CONTROL_STATE_2026-08-12_R1_2.md`

If any earlier document still says Presentation Motion R1.2 has not been completed, THIS DOCUMENT WINS.

## 0. OPERATING CONTRACT — STILL LOCKED

- Active scope remains HERO ONLY.
- Do not redesign Homepage sections below Hero.
- Do not touch production `/index.html` or `/ru/index.html` without explicit owner authorization.
- No merge, deploy, publish, rollback, destructive cleanup or force-push without explicit owner authorization.
- Technical PASS does not equal owner visual approval.
- Builder implements. Control chat verifies and decides whether a pass becomes the accepted baseline.
- Any Builder assignment must be one complete copy-paste block, never split into bootstrap + task messages.

## 1. LAST OWNER-APPROVED STABLE GEOMETRY BASELINE

Geometry R1

Branch:
`agent/proai-cube-geometry-r1`

Commit:
`73082717909b6f4225841401fe4962d6ff4bbcca`

Prototype:
`docs/site-evolution/spline/proai-cube-geometry-r1/`

Geometry remains locked unless a concrete later defect is proven.

## 2. PRESENTATION MOTION R1.1 — HISTORICAL ENGINEERING BASE

Branch:
`agent/proai-cube-presentation-motion-r1`

Commit:
`d176101a818a9f7b00963a4ece13cd90d222a21c`

R1.1 was technically valid but OWNER VISUALLY REJECTED because the choreography read as sequential/start-stop:

`slice → pause → body turn → pause → slice`

That rejection led to the R1.2 continuous dual-motion architecture.

## 3. PRESENTATION MOTION R1.2 — VERIFIED TECHNICAL RESULT

Branch:
`agent/proai-cube-presentation-motion-r1-2`

Exact final commit:
`89965750e4456a6e2d54d8309809471f8dbfcc75`

Prototype:
`docs/site-evolution/spline/proai-cube-presentation-motion-r1-2/`

Implementation base:
`d176101a818a9f7b00963a4ece13cd90d222a21c`

Verified lineage:
- R1.2 merge-base with R1.1 is exactly `d176101a818a9f7b00963a4ece13cd90d222a21c`;
- R1.2 is ahead of R1.1 and not behind;
- net diff is limited to isolated R1.2 prototype/evidence/workflow files;
- production root `/index.html` and `/ru/index.html` are untouched.

## 4. R1.2 DUAL-MOTION RESULT

Engine A — whole-cube presentation:
- normal yaw: 7–12°/s;
- inspection yaw: 18–30°/s;
- pitch envelope: ±10.2°;
- roll envelope: ±2.45°;
- cumulative 360° reached at ~18 s;
- cumulative yaw continues beyond 360° without stopping.

Engine B — Rubik mechanics:
- runtime turn duration range: 1080–1420 ms;
- owner-review turns observed: 1120–1340 ms;
- typical gaps: 180–420 ms;
- breathing gaps: 620–820 ms;
- paired stagger: 100–220 ms;
- dense phrase gap observed: ~160 ms.

Paired same-axis / distinct-layer turns are implemented and technically safe.

## 5. VERIFIED LIVENESS METRICS

- presentationActiveFrameRatio: `0.9983`
- sliceActiveFrameRatio: `0.6799`
- overlapActiveFrameRatio: `0.6799`
- paired-active ratio: `0.1360`
- longestBothStaticAutonomousMs: `41.7 ms`

All R1.2 liveness targets PASS.

The architecture is no longer a primarily sequential `await slice → await body turn` choreography. Whole-cube presentation and Rubik mechanics now operate as concurrent motion systems.

## 6. VERIFIED MECHANICAL QA

- X / Y / Z: PASS / PASS / PASS
- layers -1 / 0 / +1: PASS
- forward/inverse endpoint error: 0
- 30 mixed turns: PASS
- max position drift: ~6.96e-14
- quaternion drift: 0
- scale drift: 0
- inverse restoration: PASS
- coordinate/orientation mismatch after inverse: 0
- paired-turn safety: PASS
- paired physical-cubie intersection: 0
- paired member intersection: 0
- simultaneous paired active turns: 2
- paired endpoints: exact
- Geometry R1 preserved: PASS
- clean GLB unchanged: YES
- GLB bytes: 279,412
- GLB SHA256: `dbb7fc4156f8c9ed2481dd76443dffb9a45ecb5493463f99bffb34dd3b59c79b`
- Spline dependency: NONE
- browser/runtime errors: 0

## 7. INTERACTION QA — PRESERVED

R1.2 preserves the R1.1 interaction contract:
- hover alone does nothing;
- manual Orbit drag blocks new autonomous slice starts;
- an already-active slice finishes cleanly to exact ±90° during held drag;
- user-selected camera angle is preserved;
- no snap-back;
- calm delay: 1850 ms;
- soft recovery: 2400 ms;
- autonomous engines re-enter with stagger rather than exact synchronous restart.

Interaction QA: PASS.

## 8. OWNER REVIEW ARTIFACTS

Primary MP4:
`docs/site-evolution/spline/proai-cube-presentation-motion-r1-2/review/proai-cube-presentation-motion-r1-2-review-27s.mp4`

Direct raw URL:
`https://raw.githubusercontent.com/proaiexpert/proaiexpert.github.io/89965750e4456a6e2d54d8309809471f8dbfcc75/docs/site-evolution/spline/proai-cube-presentation-motion-r1-2/review/proai-cube-presentation-motion-r1-2-review-27s.mp4`

Verified metadata:
- duration: 27.000 s
- fps: 24
- codec: H.264
- pixel format: yuv420p
- frames: 648
- resolution: 640×760

The codec/container requirements are satisfied. Resolution is below the preferred 1080p review quality and should be improved for later final visual passes if feasible.

Review screenshots:
- `review/proai-cube-presentation-motion-r1-2-natural.png`
- `review/proai-cube-presentation-motion-r1-2-simultaneous.png`
- `review/proai-cube-presentation-motion-r1-2-paired.png`
- `review/proai-cube-presentation-motion-r1-2-large-angle.png`

## 9. CONTROL VERDICT AT THIS CHECKPOINT

TECHNICAL VERDICT:

**R1.2 PASS.**

The specific engineering failure that caused R1.1 to look dead/start-stop has been corrected at the architecture and QA level.

OWNER VISUAL VERDICT:

**PENDING OWNER REVIEW.**

Do NOT call R1.2 the final owner-approved motion baseline until the owner has watched the actual MP4 and confirms that the visual motion now feels alive, continuous and premium.

Do NOT start Materials + Lighting until that explicit visual approval is given.

## 10. PHASE ORDER AFTER OWNER APPROVAL

If the owner visually approves R1.2, the intended next phase remains:

1. Materials + Lighting
2. Semantic Display States
3. Background / Spatial Integration
4. Hero Integration
5. Production only after explicit owner authorization
6. Homepage-wide work later

No later phase has been authorized by this document.
