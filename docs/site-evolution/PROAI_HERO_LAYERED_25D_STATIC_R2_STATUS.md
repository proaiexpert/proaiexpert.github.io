# ProAI Expert Hero — Layered 2.5D Static R2 — Status

Date: 2026-08-10  
Working branch: `agent/hero-layered-25d-static-r1`  
Status: **PENDING OWNER REVIEW**

## Exact R1 source used

- R1 candidate: `docs/site-evolution/review-artifacts/PROAI_HERO_LAYERED_25D_STATIC_R1.png`
- R1 candidate commit: `e3dd5f36b61a5f9fb90a0842a9a7c0f15efa3c4e`
- R1 SHA-256: `28d1885ff2350562434e5a4bf50cbc787a7ffee5e29635780cf2ce96560ff622`
- R1 registered masks/depth: `assets/hero-layered-25d-r1/`
- Recovery source retained through R1: run `31351101048`, `PROAI_HERO_RECOVERY_OWNER_REVIEW / R46_DESKTOP_STATIC.png`, recovery SHA-256 `98529b39fb4e951638379431f1a746b1a3d89e6b6d69e10ff2f1b53e8e80f315`.

## R2 owner-review result

- Candidate: `docs/site-evolution/review-artifacts/PROAI_HERO_LAYERED_25D_STATIC_R2.png`
- Candidate commit: `b2e94c33965e12e0085153fb48ebc6a6e5d0f91e`
- Dimensions: `1440 × 900`
- PNG SHA-256: `fd049642b4b27b373f441621164ef3d1e7d2adf59f07bfe6061ca7b2e2a33ea2`
- Core scale: preserved from R1 at approximately `95.5%` of recovered registration (`-4.5%`).

## Corrective method

R2 is a corrective pass on the exact R1 candidate and its registered layered 2.5D masks/depth. No luminance/content-alpha material extraction, C-shape regeneration, new geometry, or raster-retouch fallback was used.

- **Seam/right-panel removal:** replaced the R1 hard right-field cutoff with one analytic low-frequency atmospheric field spanning the old column boundary. Existing Core/chamber/collector/output/rail alpha layers protect physical scene content; the old `x≈695` cutoff is neutralized only on background pixels. This removes the rectangular right-panel reading without a blur-smear patch.
- **Floating artifact removal:** the non-structural dark wedge/triangle left of the Core is removed with one explicit feathered geometric exclusion mask and filled by the same registered atmosphere. Approved Core geometry is otherwise untouched.
- **Scene integration:** atmosphere now transitions continuously across the Hero while object/background separation is maintained through R1 depth masks rather than a rectangular field.
- **Chamber:** existing R1 chamber depth is strengthened with darker recess-edge response, three restrained cyan spatial depth volumes and low-opacity internal reflection planes. The correction adds depth hierarchy rather than simply increasing glow.
- **Material/light:** existing rear/front R1 material masks receive restrained graphite contrast, subtle blue-steel highlight nuance, deeper inter-plane black separation and a microscopic warm counter-reflection; no chrome/gold/cyberpunk treatment.
- **Micro-UI polish:** RU receives a subtle chevron to read as a language control; the two important microcopy lines receive a controlled contrast lift; `View Work →` receives a continuous intentional underline treatment.

## Preserved

- same approved Hero concept and C-shape;
- same layered 2.5D foundation and two-column architecture;
- same Header/H1/main copy/CTA architecture;
- same approximately `-4.5%` Core scale;
- same calm rail: `01 TRUST / 02 INQUIRY / 03 RESPONSE / 04 RESULT`;
- same output-to-row geometry and rail pixels;
- no motion and no alternate owner candidate.

## Safety / QA

- Exact R1 SHA validation: PASS.
- Candidate dimensions `1440 × 900`: PASS.
- H1/main copy/primary CTA locked regions: PASS.
- Rail/output geometry preserved from R1: PASS.
- Hard seam/right-panel correction: APPLIED.
- Floating fragment correction: APPLIED.
- Production `/index.html` modified: **NO**.
- Production `/ru/index.html` modified: **NO**.
- Merge performed: **NO**.
- Deploy performed: **NO**.
- Production PR opened: **NO**.
- Motion started: **NO**.

**PENDING OWNER REVIEW**
