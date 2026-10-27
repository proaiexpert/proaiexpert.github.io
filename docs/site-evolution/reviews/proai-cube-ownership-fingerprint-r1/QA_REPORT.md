# PROAI CUBE R1 owner review QA

## Baseline preflight

- Cube load: PASS.
- Runtime readiness: `true`; diagnostics available.
- Logo source mismatch: not reproduced after normalizing fetched source with `source.replace(/\r\n?/g, '\n')` at the patch boundary.
- Exact `replaceOnce()` uniqueness checks remain active; no regex replacement was introduced.
- Historical donor GLB SHA256 remains `DBB7FC4156F8C9ED2481DD76443DFFB9A45ECB5493463F99BFFB34DD3B59C79B`.
- Production `proai-cube-r1.glb` SHA256 is `2A97D4671F5AED2E23E5688081C53E1E234A525CF145C6A89BA4C9909FB2B480`.
- Console: no source-mismatch error. The only observed console message is the pre-existing Three.js clipping-sample warning.

## Runtime regression

- Slice mechanics: PASS on X/Y/Z; endpoint errors are zero.
- Paired turns: PASS; two distinct layers run simultaneously with zero member intersection and zero restoration mismatch.
- Canonical restoration: PASS; max position error `9.85e-14`, quaternion error `0`, scale error `0`.
- Autoplay: PASS; scheduler observed `enabled=true`, `running=true`, `eventSerial=1`, and an active turn.
- Pointer: PASS; drag interaction changed the runtime presentation-resume state.
- Materials and lighting: PASS; renderer diagnostics report WebGL2, 210 baseline draw calls, and 172440 baseline triangles.
- Presentation motion: PASS; `proai-final-motion-r2` remains the active engine.
- Desktop: PASS at 1440px owner-review viewport.
- Mobile 390px: VERIFIED PASS; actual in-app viewport `390x844`, no horizontal overflow, ready state and diagnostics available, manual PROAI reveal/rest interaction passed, and no console errors.
- Mobile 320px: VERIFIED PASS; actual in-app viewport `320x844`, no horizontal overflow, ready state and diagnostics available, manual PROAI reveal/rest interaction passed, and no console errors.
- Mobile landscape resize: VERIFIED PASS at `844x390`; ready state remained available with no horizontal overflow or console errors.
- Reduced motion: VERIFIED PASS in system Chrome with actual `prefers-reduced-motion: reduce` emulation; `matchMedia` matched, scheduler remained disabled/stopped with `eventSerial=0` after 4.5 seconds, identity remained available, and no console errors occurred.
- Not applicable: none.
- Not verified: none.

## Owner harness

The static harness is `review.html`. It exposes identity, GLB URL, mechanics, geometry, scheduler, pointer state, controlled PROAI reveal, forensic inspection, and canonical restoration diagnostics. The final screenshot set is listed in `OWNERSHIP_MANIFEST.json`.
