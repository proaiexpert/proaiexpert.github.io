# PROAI EXPERT HERO — RECOVERY LOCK

Date: 2026-08-09
Status: ACTIVE RECOVERY BASELINE

## Purpose

This file restores a single canonical working process after the non-canonical R5 WebGL experiment diverged from the approved Hero composition.

The active goal is NOT to redesign the Hero. The goal is to improve the already-approved C-shape Hero while preserving its composition and information architecture.

## Canonical source checkpoint

Visual source branch:
`agent/hero-r4-6-clean-plate-compositor-owner-look`

Exact source SHA:
`8bab1bbddbaadf70d88fd72c77e08d2d0ac77429`

Recovery working branch:
`agent/hero-recovery-approved-composition`

Recovery owner-look branch:
`agent/hero-recovery-approved-composition-owner-look`

A branch comparison performed during recovery confirmed that the recovered Hero content is identical to the R4.6 owner checkpoint. The only additions on the recovery working branch before this lock were the recovery owner-review workflow and deterministic run-id marker.

## Canonical Hero composition — LOCKED

The following must be preserved unless the owner explicitly changes them:

- two-column desktop Hero architecture;
- real ProAI header system;
- left copy block and its hierarchy;
- approved one-positioning-statement H1 architecture;
- primary CTA and secondary CTA placement;
- C-shaped integration core as the dominant right-side visual;
- signal journey: input -> processing inside the Core -> output;
- semantic rail: 01 TRUST / 02 INQUIRY / 03 RESPONSE / 04 OUTCOME;
- premium dark graphite / cyan visual language;
- physical relationship between Core outlet and semantic rail;
- EN/RU architecture alignment;
- mobile remains a derived responsive state, not a separate redesign.

## Current preview route

EN:
`/hero-a-plus-c-shape-preview/`

RU:
`/ru/hero-a-plus-c-shape-preview/`

## Production safety — LOCKED

Do not modify or deploy production homepage routes during owner-review work:

- `/index.html`
- `/ru/index.html`

No production merge, deploy, or production PR without explicit owner approval.

## R5 WebGL experiment status

`agent/hero-r5-webgl-proof` and its related branches are NON-CANONICAL TECHNICAL EXPERIMENTS.

They must not be used as visual or compositional references for the active Hero unless the owner explicitly requests a specific technical element from them.

The R5 experiment changed the approved Core silhouette and spatial composition; those changes are rejected.

## Restored owner-review process

Every meaningful visual iteration returns to the following gate:

1. Desktop static — 1440 x 900.
2. Desktop motion — same composition, motion only.
3. Mobile static — 390 x 844.
4. Owner review.

A motion pass is not allowed to silently redesign the static composition.

The current recovery workflow is:
`.github/workflows/hero-recovery-owner-review.yml`

Owner artifact package:
`PROAI_HERO_RECOVERY_OWNER_REVIEW`

## Next-pass rule

The next pass must be an improvement of the recovered C-shape Hero, not a new Hero concept.

Priority order:

1. make the static desktop scene visually premium;
2. improve physical integration of the approved Core with the environment;
3. preserve the Core silhouette and composition;
4. remove obvious compositing / cut-out / overlay artifacts;
5. only after static quality improves, refine motion;
6. use WebGL/3D/hybrid techniques only when they reproduce the approved composition rather than replacing it.

## Failure conditions

A pass is rejected before owner review if it:

- replaces the approved C-shape with a different geometry;
- changes the two-column composition without instruction;
- changes copy architecture without instruction;
- changes the semantic rail concept;
- introduces a new Hero concept under the name of a technical improvement;
- relies on effects to compensate for a weak static frame;
- changes production homepage files during owner-review work.

## Current decision

RECOVERY COMPLETE.

The active project resumes from the approved R4.6 composition and restored owner-review pipeline. Future work must improve that baseline incrementally and visibly rather than restarting the Hero concept.
