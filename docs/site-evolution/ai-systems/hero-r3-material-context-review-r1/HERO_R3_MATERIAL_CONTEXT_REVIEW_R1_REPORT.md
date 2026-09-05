# AI Systems Hero — R3 Material Context Review R1

OWNER SUMMARY — RU

Дата: 2026-09-04.

Статус: **R3 HERO CONTEXT LIMITED**.

Проверен утверждённый R3 Neutral Light Material внутри frozen ProAI AI Systems Hero. R3 не изменялся, Hero shell не изменялся, semantics не добавлялись.

## Authority and scope

- Hero base: `38ecb13e1a0d6b5814748d7741ba99ef58197e6b`
- R3 source: `19ba191b499c347a67987d93ebe0e3e29c4b88d6`
- R3 payload: `1269ea60eb7725e59822ba2b9e789a2d9dd8956f557ffbbedfbb39e97a12c4d0`, 46,418 bytes
- Runtime: `@splinetool/runtime@2.0.27`
- Golden comparison payload: `c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798`
- Review branch base: frozen Hero, not the material R&D branch
- Runtime method: official `Application`, fresh payload boot per mode

Imported into review wiring only:

`owner-preview/assets/3d/boxes-hover/neutral-light-material-r3-final.bin`

The review page also references the frozen Hero shell assets and the existing Golden payload. No forensic history was imported.

## Frozen Hero preservation

The following remained unchanged:

- approved EN/RU copy;
- typography, header and CTA structure;
- CTA radius and borderless secondary action;
- Hero layout architecture and height;
- framing `translate3d(7vw,-1.5vh,0) scale(1.04)`;
- camera, geometry, transforms, hierarchy and events;
- exact 11-mesh donor UI cleanup whitelist;
- Cube Material and R3 serialized payload values.

No `setMaterial()`, `createCustomMaterial()`, post-load material mutation, Three.js reconstruction, manual BoxGeometry, Indigo/Pearl semantics or intro sequence were used.

## Desktop review — 1440×900

Fresh Golden and R3 boots were captured with system Chrome. Runtime inventory passed for both modes: 143 Cube meshes, 143 material identities, 11 approved UI meshes hidden, payload SHA verified.

### EN

- Rest: **LIMITED** — the field remains very dark at rest and loses presence behind the dominant copy.
- Center hover: **PASS** — R3 resolves into a recognizable, physical silver/graphite Boxes Hover field.
- Edge hover: **PASS** — edge response remains coherent and does not collide with the copy.
- Pointer leave / settled: **PASS** — native settling completes back to the restrained rest state.
- Copy / 3D collision: **NONE**.

### RU

- Rest: **LIMITED** — same narrow limitation; the longer Russian copy leaves less immediate field presence.
- Center hover: **PASS** — neutral field remains dimensional and recognizable.
- Edge hover: **PASS** — no collision with the Russian copy.
- Pointer leave / settled: **PASS**.
- Copy / 3D collision: **NONE**.

### Art direction

R3 reads as black / graphite / silver / chrome rather than colored or gaming material. Pink, cyan, teal and blue cast are absent from the R3 field. The neutral donor supports the copy during interaction and does not introduce a card/plate artifact.

The remaining issue is context-only: in the frozen Hero rest state the field is too quiet to carry enough continuous right-side presence. This is intentionally not corrected in this task because material tuning and composition changes are out of scope.

## Runtime invariants and console

- 143 Cube meshes: **PASS**
- 143 material identities: **PASS**
- Camera: **UNCHANGED / MATCH**
- Geometry: **UNCHANGED / MATCH**
- Events: **UNCHANGED / MATCH**
- Native hover: **PASS**
- Native settling: **PASS**
- Duplicate scene load: **NONE** per page boot
- WebGPU in live CUA Chrome: **PASS**
- Review capture viewport: **1440×900**
- 390 sanity: **PASS** — no catastrophic overflow or boot failure
- 320 sanity: **PASS** — no catastrophic overflow or boot failure

Live Chrome retained the known non-fatal Spline/WebGPU `ShadowDepthTexture` validation warning. It did not prevent loading, interaction or settling and is not a new R3-specific failure. The separate 1440 capture process completed without fatal page errors; its isolated GPU adapter was unavailable, so live WebGPU status is attributed only to the real Chrome session that reported `navigator.gpu` and adapter success.

## Preview and evidence

Server: **RUNNING** on a minimal staging directory, bound to `0.0.0.0`, port `4179`.

- Localhost EN: http://127.0.0.1:4179/owner-preview/ai-systems-hero-r3-material-context-review-r1.html?mode=r3
- Localhost RU: http://127.0.0.1:4179/owner-preview/ai-systems-hero-r3-material-context-review-r1-ru.html?mode=r3
- LAN EN: http://10.0.0.204:4179/owner-preview/ai-systems-hero-r3-material-context-review-r1.html?mode=r3
- LAN RU: http://10.0.0.204:4179/owner-preview/ai-systems-hero-r3-material-context-review-r1-ru.html?mode=r3
- LAN HTTP route: **200**
- LAN WebGPU: **BLOCKED / NOT VERIFIED** because ordinary HTTP by IP is not a secure WebGPU context
- MP4: `owner-r3-hero-rest-hover-settle.mp4`, 12 seconds, 1440×900
- Composite: `runtime-qa/owner-composite.png`

The comparison page switches Golden/R3 by URL and performs a new page/Application boot for each mode; it does not mutate materials live.

## Verdict

The exact approved R3 material **works inside the frozen Hero during interaction** and preserves donor fidelity, neutral optical language, copy hierarchy and native behavior. It is not a full context pass because the frozen rest composition is too dark/quiet to maintain enough field presence without a future material or composition decision.

No production integration is recommended from this review alone. Owner should decide whether the rest-state weakness is acceptable before authorizing a separate, explicitly scoped next phase.
