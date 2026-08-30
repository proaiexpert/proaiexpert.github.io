# Donor provenance

DONOR: Geometry Painter — Chiro Visuals
SOURCE: https://github.com/achrefelouafi/GeometryPainterThreeJS
DONOR SHA: 79c7556ab8c5d7bcf92fa92d7fc8063db298b5e1
LICENSE: MIT
ORIGINAL LIVE: https://tympanus.net/Tutorials/GeometryPainterThreeJS/
INSTALL COMMAND: npm ci
DEV COMMAND: npm run dev
BUILD COMMAND: npm run build
RENDERER: Three.js WebGPURenderer; CI browser uses the donor renderer's WebGL fallback through trusted SwiftShader when native WebGPU is unavailable.
MAJOR MODES:
1. Crystals
2. Molten fissures
3. Aurora silk
4. Bioluminescent reef
VISUAL MODIFICATIONS: NONE
GEOMETRY MODIFICATIONS: NONE
MATERIAL MODIFICATIONS: NONE
CAMERA MODIFICATIONS: NONE
MOTION MODIFICATIONS: NONE
BEHAVIORAL MODIFICATIONS: NONE
INFRASTRUCTURE-ONLY MODIFICATIONS: Donor source NONE. Immutable review transport is a second Vite build invocation `npm run build -- --base=./` after the original production build passes, solely to make emitted asset URLs relative under a nested RawCDN path.
