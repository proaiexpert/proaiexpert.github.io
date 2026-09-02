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

## Evidence hash audit

Audit date: 2026-09-02. Production authority commit: `90d585ef98b17cae8e45619847a5f8cf59ce0d04`.

The source ledger records exact Windows working-tree bytes. GitHub Pages serves the JavaScript files with CRLF normalized to LF. For every audited JavaScript file, the normalized source text and deployed text are byte-for-byte equal; this is the complete reason the raw SHA256 values differ. The binary GLB is byte-for-byte identical between source and deployment.

| File | Source / working tree SHA256 | Deployed GitHub Pages SHA256 |
| --- | --- | --- |
| `assets/models/proai-cube/proai-cube-r1.glb` | `2A97D4671F5AED2E23E5688081C53E1E234A525CF145C6A89BA4C9909FB2B480` | `2A97D4671F5AED2E23E5688081C53E1E234A525CF145C6A89BA4C9909FB2B480` |
| `assets/brand/proai-logo-r341/live-runtime.js` | `B378FA39FD6BCD34DA86F159099695A42D6D5E3C3083DED859E57A518C8EE197` | `8DDFA49B836114B76DA7C89AFE23FFB2F90515AF0DCE1560A462E4728E6C0A55` |
| `assets/js/proai-hero-cube-r1/bootstrap.js` | `0FFC3103D0180A607EEECAE3C65E930B31CC10859BCE00F095A1F9A046F28F90` | `8DC0BF0DF9E2AB17B4158DB0B49A0EC0E278B271F8737AD1F675AFA46A0D5523` |
| `assets/js/proai-hero-cube-r1/source-materials-r1.js` | `2DD344A3547813DF5573904EC8A3D2F4FB6B663DB2F20C7E3C9E792A2C7C67B9` | `3252A33EECC55E2EA37EE8B8BBFCDE888A8438BE722F83D6F8FF638AF5622525` |
| `assets/js/proai-hero-cube-r1/source-final-motion-r2.js` | `730A3919EC9002C20816342262A94FF91085EF2E39CD915113B2B5E6AE79342C` | `94F4E7F1E1FA4CC4A62DC7FC41E383EAA37104D710C9509DC4257A392BA1B543` |
| `assets/js/proai-hero-cube-r1/source-final-motion-r2-touch-auto-45-r1.js` | `09E57831A6A260A097573524B854A33A3C60723A2CC56EB269786F409C064DDF` | `9C2B06CBA65AD828E278E820B742747135F917E6CB2701B3C050118D0612DBEA` |

## Live production QA

Test date: 2026-09-02. Browser: independent system Chrome with WebGL enabled, explicit viewport control, media emulation, console capture, request capture, and screenshots.

- EN desktop 1440: PASS; HTTP 200, homepage rendered, Cube canvas rendered, PROAI engraving visible, header/navigation and hero remained coherent, no horizontal overflow.
- RU desktop 1440: PASS; HTTP 200, Russian hero/navigation rendered, Cube canvas and PROAI engraving visible, no horizontal overflow.
- EN mobile 390: PASS; HTTP 200, canvas rendered, responsive header/menu remained usable, no horizontal overflow or runtime errors.
- RU mobile 390: PASS; HTTP 200, canvas rendered, Russian layout remained coherent, `scrollWidth === clientWidth`, no runtime errors.
- EN mobile 320: PASS; HTTP 200, canvas rendered, responsive layout remained coherent, `scrollWidth === clientWidth`, no runtime errors.
- RU mobile 320: PASS; HTTP 200, canvas rendered, Russian layout remained coherent, `scrollWidth === clientWidth`, no runtime errors.
- Reduced motion: PASS; `matchMedia('(prefers-reduced-motion: reduce)').matches === true`, Cube loaded, runtime identity remained `PAI-CUBE-0001`, scheduler was disabled/stopped with `eventSerial=0`, and two screenshots 1.5 seconds apart were identical.
- Production network: PASS; active resource timing included `/assets/models/proai-cube/proai-cube-r1.glb?sha=2A97D4671F5A`, direct response was HTTP 200, length `295344` bytes, and SHA256 matched the GLB invariant. No active historical donor request was observed.
- Production console: PASS in independent system Chrome; no source-mismatch errors and no hard JavaScript errors. The known non-breaking Three.js clipping-sample warning remains separately documented from the local baseline.

The live production page exposes `data-proai-asset-id="PAI-CUBE-0001"`; the PROAI engraving is visible in the captured desktop and mobile frames. EN/RU differences are localized copy/navigation only; no additional RU-only screenshot was required.

## Owner harness

The static harness is `review.html`. It exposes identity, GLB URL, mechanics, geometry, scheduler, pointer state, controlled PROAI reveal, forensic inspection, and canonical restoration diagnostics. The final screenshot set is listed in `OWNERSHIP_MANIFEST.json`.
