# Golden Assembly R1.2 — Cube donor authority correction

This is forensic evidence only. It does not alter Cube motion, geometry, materials values, or interaction constants.

## Product authority

- Cube 45 product commit: `497308fd5e9add24d4fa4254287cbd17f9c0112c`
- 45 source blob: `fc2c0ba13692c94f5838008d09f05dda9859e9d2`
- base R2 blob: `67ca618cf10a47561d351715968187d2e4c50351`
- **materials dependency actually present at the product authority commit:** `f9298b0b00feaae4123eb5a7161f24f669ae0eca`

The previously recorded `bab6b00e73b20fc2a51aeb00cb7fc08f16129e72` materials identity is stale for the 45% product stack. It does not contain the `motionAuthority: 'quaternion-editorial-spatial-r1.2-premium'` marker required by the frozen base R2 guard.

## Known-good donor

`agent/proai-cube-touch-auto-45-r1/docs/site-evolution/reviews/proai-cube-touch-auto-45-r1/review.html`

The known-good branch also resolves `assets/js/proai-hero-cube-r1/source-materials-r1.js` to blob `f9298b0b00feaae4123eb5a7161f24f669ae0eca`.

## Observed broken recovery

The first R1.2 mobile browser gate loaded every critical Cube URL with HTTP 200, but stopped before runtime creation with:

`FINAL MOTION R2 refused unexpected frozen base: motionAuthority: 'quaternion-editorial-spatial-r1.2-premium'`

This proves the blank Cube was not caused by a missing GLB/Three/addon request. The clean-shell recovery had paired the exact 45 source/base with the stale materials dependency, producing an internally incompatible frozen stack.

## Recovery rule

Restore the materials file byte-for-byte from product authority commit `497308...`; recover the donor static importmap and mount lifecycle at assembly level; do not edit the frozen 45 source or motion constants.
