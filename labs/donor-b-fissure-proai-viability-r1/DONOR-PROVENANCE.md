# DONOR PROVENANCE — FISSURE PROPAGATION PROAI VIABILITY R1

DONOR: Geometry Painter — Chiro Visuals

SOURCE: https://github.com/achrefelouafi/GeometryPainterThreeJS

DONOR SHA: 79c7556ab8c5d7bcf92fa92d7fc8063db298b5e1

LICENSE: MIT

PROAI BASE: 07e4441be9abf237e11531d084488d287f244df9

PRIMARY SUBSYSTEM: Molten Fissures / Propagation

CORE PROPAGATION ARCHITECTURE: PRESERVED

CENTRELINE: PRESERVED — donor `buildPath()` and `PATH_STEP` unchanged

DISTANCE-ALONG-PATH: PRESERVED — donor `dist` and `aDist` unchanged

TRAVELLING FRONT: PRESERVED — donor `uGrown` growth coordinate and `update(dt)` timing path unchanged

RIBBON: PRESERVED — donor `buildRibbonGeometry()` topology and attributes unchanged

SURFACE PAINTER: PRESERVED — `src/surfacePainter.ts` unchanged

BRANCHES: DISABLED — donor branch generation retained; `branchDensity = 0` collapses branches through donor shader culling

ROCKS: DISABLED — donor layer retained but visually hidden; `rockDensity = 0`

EMBERS: DISABLED — donor layer retained but visually hidden; `emberRate = 0`

POINT-LIGHT SPILL: DISABLED — donor lights retained but hidden; `lightSpill = 0`

BLOOM: RESTRAINED — donor post-processing architecture retained at strength `0.06`, threshold `1.15`

LAVA COLOR LANGUAGE: REMOVED

NEW PROPAGATION SYSTEM: NO

NEW GEOMETRY ARCHITECTURE: NO

SPHERE ROLE: NEUTRAL TEST CARRIER ONLY

SPHERE GEOMETRY CHANGED: NO — donor `SphereGeometry(1, 96, 64)` unchanged

HUMAN AUTHORITY: NOT IMPLEMENTED

PEARL AUTHORITY: NOT IMPLEMENTED

## Modified donor source files

- `src/modes/fissures.ts` — visual/material semantics only; propagation/resampling/ribbon/growth code preserved
- `src/app.ts` — default fissure mode, neutral carrier material, ProAI studio lighting/background, restrained bloom, QA read-only instrumentation
- `index.html` — presentation-only hiding of donor UI/copy for isolated visual review

## Donor source files explicitly preserved

- `src/surfacePainter.ts`
- `src/modes/mode.ts`
- `src/bvh.ts`

DEPENDENCIES UPGRADED: NO

DONOR INSTALL: `npm ci`

DONOR BUILD: `npm run build`

IMMUTABLE TRANSPORT BUILD: `npm run build -- --base=./`
