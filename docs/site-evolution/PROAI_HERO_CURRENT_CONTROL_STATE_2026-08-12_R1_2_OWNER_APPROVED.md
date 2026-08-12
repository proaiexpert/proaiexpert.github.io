# PROAI EXPERT HERO — CURRENT CONTROL STATE — R1.2 OWNER APPROVED

Repository: `proaiexpert/proaiexpert.github.io`

Date: 2026-08-12

This document is the newest control-state delta for the ProAI Expert Hero workstream.

It supersedes only the previous statement that Presentation Motion R1.2 was technical-PASS / owner-visual-approval-pending. All earlier project history and locked decisions remain preserved in the Master Handoff and prior control-state documents.

## 0. OWNER VISUAL VERDICT — PRESENTATION MOTION R1.2

Presentation Motion R1.2 is OWNER APPROVED.

Branch:
`agent/proai-cube-presentation-motion-r1-2`

Exact commit:
`89965750e4456a6e2d54d8309809471f8dbfcc75`

Prototype:
`docs/site-evolution/spline/proai-cube-presentation-motion-r1-2/`

Owner visual assessment:
- result is much better than R1.1;
- continuous dual-motion behavior is accepted;
- whole-cube presentation + Rubik slice mechanics now feel alive together;
- motion is intentionally somewhat calmer / more premium than the Resend benchmark;
- this slower premium character is currently acceptable;
- speed/cadence may be micro-tuned later if needed after materials/lighting are visible;
- do NOT reopen motion architecture now.

Status:

**PRESENTATION MOTION R1.2 = OWNER-APPROVED MOTION BASELINE.**

## 1. MOTION BASELINE — LOCK

Preserve the R1.2 architecture:
- continuous whole-cube presentation motion;
- independent Rubik scheduler;
- frequent overlap;
- safe paired same-axis / distinct-layer motion;
- continuous cumulative 360 behavior;
- no dead start-stop choreography;
- existing Orbit interaction semantics;
- exact Rubik mechanics.

Do not rewrite the motion system during the next art pass.

If later material reflections reveal that motion should be slightly faster/slower, allow only a narrow motion micro-tuning pass after visual review. Do not destabilize mechanics or return to sequential choreography.

## 2. CURRENT NEXT PHASE

The next active phase is:

**MATERIALS + LIGHTING**

This is now authorized as the next isolated art pass.

Goal:
make the approved R1.2 object feel materially expensive, physically present and premium without changing geometry or motion architecture.

Direction remains:
- graphite;
- gunmetal;
- black chrome;
- smoked graphite;
- restrained tonal differentiation;
- controlled PBR reflections;
- large soft key reflection;
- restrained rim;
- subtle fill so dark faces do not disappear;
- highlights moving across bevels during existing R1.2 motion;
- premium studio / technology-object presence;
- no colorful toy Rubik treatment;
- no flat generic grey;
- no cyan neon / HUD / gaming treatment.

## 3. NEXT-PHASE LOCKS

During Materials + Lighting:

PRESERVE:
- Geometry R1 exactly;
- R1.2 motion architecture and interaction;
- clean GLB;
- X/Y/Z mechanics;
- layers -1/0/+1;
- exact ±90° endpoints;
- safe paired-turn mechanics;
- inverse restoration;
- OrbitControls;
- no Spline runtime.

DO NOT START:
- Semantic Display States;
- Background / Spatial Integration;
- Hero Integration;
- Homepage redesign;
- production deployment.

Production remains locked:
- do not modify `/index.html`;
- do not modify `/ru/index.html`;
- no merge/deploy/publish/force-push/rollback/destructive cleanup.

## 4. CURRENT PHASE ORDER

1. Presentation Motion R1.2 — COMPLETE / OWNER APPROVED.
2. Materials + Lighting — NEXT.
3. Semantic Display States.
4. Background / Spatial Integration.
5. Hero Integration.
6. Production only after explicit owner authorization.
7. Homepage-wide work later.

## 5. REVIEW FORMAT RULE

Every future owner-facing visual pass must provide:
- primary MP4;
- H.264;
- yuv420p;
- 24 or 30 fps;
- preferably 1080p;
- direct GitHub/raw link suitable for iPhone.

Technical PASS never substitutes for owner visual review.
