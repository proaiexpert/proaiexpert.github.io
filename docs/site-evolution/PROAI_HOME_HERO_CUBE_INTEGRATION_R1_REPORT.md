# ProAI Expert Homepage — Hero Cube Integration R1 Report

## 1. Repository state

- Hero R2 base SHA: `227695bf3223d38d208e7de7c6436746e7fda3a3`
- Integration branch: `agent/proai-home-hero-cube-integration-r1`
- Stable Cube source SHA: `d17806da42275db617d8a46b231a2d877706a179`
- Stable Presentation Motion R1.2 base: `89965750e4456a6e2d54d8309809471f8dbfcc75`
- Production `main` baseline at task start: `c945084e1952c05c686494091f7dbca0f7acdf08`
- Production deployment: **NO**
- `main` intentionally touched: **NO**
- Final integration branch SHA: returned in the Builder handoff. A Git commit cannot contain its own resulting SHA without changing that SHA.

## 2. Scope implemented

Hero Shell R2 remains the visual/layout authority. The integration adds only the stable Cube production runtime, exact mechanical GLB, local Three.js r180 runtime dependencies, a narrowly scoped Homepage bootstrap hook, and this report.

No intentional changes were made to:

- EN/RU H1 or support copy;
- CTA labels, routes, materials, hover, pressed or focus-visible states;
- microcopy, accountability or stage rail;
- Hero R2 Obsidian spatial CSS;
- Header;
- Logo;
- favicon;
- below-Hero sections;
- production deployment configuration.

## 3. Files added / adapted

### Homepage integration

- `assets/js/homepage-core-hardening-v1.js`
  - R2 file preserved with only a guarded 13-line loader addition for the Hero Cube bootstrap.
  - The loader runs only when `#proai-hero-cube-mount` exists.

- `assets/js/proai-hero-cube-r1/bootstrap.js`
  - production entry/bootstrap;
  - mount discovery;
  - local Three import map;
  - exact stable source freeze guards;
  - integration-only source adaptation;
  - first-frame mounted-state gate;
  - ResizeObserver;
  - offscreen / document-visibility lifecycle;
  - mobile coarse-pointer safety;
  - DPR cap;
  - graceful error fallback.

### Frozen stable Cube source

- `assets/js/proai-hero-cube-r1/source-materials-r1.js`
  - exact Git blob copied from Materials + Lighting R1 `main.js`;
  - Git blob SHA remains `bab6b00e73b20fc2a51aeb00cb7fc08f16129e72`;
  - byte size `62685`;
  - mechanics, geometry, materials, lighting and Motion R1.2 source are not rewritten in the committed frozen source.

### Exact GLB

- `assets/models/proai-cube/rubik_39_s_cube_animation.glb`
  - Git blob SHA: `7992019d85304c16244d0ca55a8cf15c13c26190`;
  - byte size: `279412`;
  - SHA256 from authoritative Materials R1 QA: `DBB7FC4156F8C9ED2481DD76443DFFB9A45ECB5493463F99BFFB34DD3B59C79B`;
  - copied by Git blob identity, not exported/resaved/recompressed.

### Local Three.js r180 static runtime

Official Three.js r180 files are stored locally under `assets/vendor/three-r180/`:

- `build/three.module.min.js`
- `build/three.core.min.js`
- `examples/jsm/loaders/GLTFLoader.js`
- `examples/jsm/controls/OrbitControls.js`
- `examples/jsm/environments/RoomEnvironment.js`
- `examples/jsm/geometries/RoundedBoxGeometry.js`
- `examples/jsm/lights/RectAreaLightUniformsLib.js`
- `examples/jsm/lights/RectAreaLightTexturesLib.js`
- `examples/jsm/utils/BufferGeometryUtils.js`

Runtime imports resolve to root-relative local paths only. No Three.js CDN is used.

## 4. Production runtime architecture

The final static website does not require npm, Vite, Node or a dev server in the visitor browser.

The Homepage hardening script conditionally loads `bootstrap.js`. The bootstrap inserts an import map before the first module import:

- `three` -> `/assets/vendor/three-r180/build/three.module.min.js`
- `three/addons/` -> `/assets/vendor/three-r180/examples/jsm/`

It then fetches the exact local frozen Materials R1 source and performs strict integration-only substitutions in memory. If an expected source fragment is missing or duplicated, initialization aborts and the R2 unmounted Obsidian field remains visible.

This is a local static ESM production package rather than a runtime CDN or npm dependency tree. `node_modules` is not committed.

## 5. Freeze verification

The authoritative Materials R1 QA records:

- Geometry R1 freeze: **PASS**;
- Motion R1.2 freeze: **PASS**;
- Materials R1 look-dev: **PASS**;
- Lighting R1 look-dev: **PASS**;
- GLB bytes/hash: frozen.

The integration bootstrap additionally checks source sentinels before initialization for:

- slice duration `1080–1420ms`;
- normal yaw `7–12°/sec`;
- inspection yaw `18–30°/sec`;
- pitch `10.2°` envelope;
- roll `2.45°` envelope;
- graphite material `#242A31` family values;
- gunmetal material `#2B323A` family values;
- black chrome material `#181D23` family values;
- smoked core `#0C0F13` family values;
- hemisphere / key / fill / rim intensities;
- ACESFilmic tone mapping;
- exposure `1.0`.

No semantic source/branch is imported. No ProAI/Expert face, semantic plaque, semantic pause or face text is added.

## 6. Integration-only runtime adaptations

The frozen source is adapted in memory only for Homepage embedding:

1. GLB URL points to the local production asset.
2. WebGL renderer uses alpha so the R2 spatial field remains the visible background.
3. Renderer clear color becomes transparent.
4. Three scene background becomes transparent.
5. Pixel ratio is capped by device class.
6. Existing source `resize()` and review-frame render are exposed to the wrapper.
7. Desktop OrbitControls can remain enabled; coarse-pointer controls are disabled.
8. The perpetual render loop is wrapped with an active/inactive lifecycle gate.
9. A valid first frame is rendered before `data-cube-mounted="true"`.
10. After mounted-state activates the full square mobile geometry, the runtime immediately resizes and renders again.

No geometry, material, lighting, slice mechanics or choreography constants are changed.

## 7. Hero calibration

### Camera / Cube scale

No stable-Cube camera or top-level presentation scale constant was changed in R1 integration.

The Materials R1 `frameCamera()` contract remains:

- camera fit derived from the frozen Cube bounding sphere;
- distance factor `1.075`;
- view direction based on `[1.18, 0.86, 1.33]`.

Reason: without modifying Cube geometry or motion, the first integration should judge the already-approved framing inside the substantial R2 mount before introducing any art-direction correction.

### Hero spatial field

No R2 Hero background CSS was changed. Spectral machine-energy remains effectively off. No purple/cyan halo, platform, particles, fog, HUD, floor grid or new backdrop was introduced.

## 8. Mounted-state contract

Initial HTML remains:

`data-cube-mounted="false"`

Successful runtime order:

1. find existing mount;
2. create one canvas inside it;
3. initialize local Three runtime;
4. load exact GLB;
5. construct frozen geometry/material/light state;
6. resize;
7. render a valid first frame;
8. only then set `data-cube-mounted="true"`;
9. resize/render once more against mounted square geometry;
10. start normal lifecycle-controlled presentation.

Failure behavior:

- mounted state stays `false`;
- no visible error UI/spinner is created;
- the R2 Obsidian spatial field remains the graceful fallback;
- a concise console warning is allowed.

## 9. Responsive / interaction behavior

### Desktop

- OrbitControls remain available on fine-pointer devices.
- No overlay is added above the mount.
- Existing R2 mount sizing remains authoritative.

### Mobile / coarse pointer

- OrbitControls are disabled.
- canvas pointer events are disabled;
- canvas touch action is set to `pan-y`;
- autonomous presentation remains the visual behavior;
- normal vertical page scrolling is not intentionally captured by the Cube.

### Mounted layout matrix

A local R2 mounted-state browser harness was executed for EN and RU at:

- `1440×900`
- `1280×800`
- `1024×768`
- `820×1180`
- `768×1024`
- `430×932`
- `390×844`
- `360×800`
- `844×390` landscape

Result: **18 / 18 structural PASS**.

Across the matrix:

- mounted slot returned square geometry;
- exactly one canvas was present in the mount;
- horizontal overflow was `0`;
- browser page errors in the structural harness were `0`.

Examples of measured mounted slot sizes:

- EN/RU 1440×900: about `662.4 × 662.4px`;
- EN/RU 390×844: `354 × 354px`;
- EN/RU 360×800: `328 × 328px`.

This structural QA does **not** substitute for the required real-Cube visual WebGL screenshots described below.

## 10. Resize / lifecycle / reduced motion

### Resize

- `ResizeObserver` watches the actual Cube mount.
- Stable source `resize()` updates renderer size, camera aspect and projection matrix without rebuilding the Cube.
- A resize/render is forced immediately after mounted-state expands mobile to square geometry.

### Offscreen lifecycle

`IntersectionObserver` tracks meaningful Hero visibility.

When the Hero is offscreen:

- the continuous presentation render loop is suspended;
- future choreography scheduling is stopped;
- Cube logical state is preserved;
- no reset/reload occurs.

A slice already in flight may finish its bounded turn, but continuous render/update work is not intentionally kept running offscreen.

### Document visibility

`visibilitychange` uses the same lifecycle gate. Hidden documents suspend the continuous render loop and choreography scheduling; returning visible resumes from the existing Cube state.

### Reduced motion

The frozen Materials R1 source already disables autonomous presentation/slice scheduling for `prefers-reduced-motion: reduce`. The integration lifecycle also keeps the continuous loop inactive after the required complete first frame, leaving the Cube visually present without sustained autonomous motion.

## 11. DPR / payload diagnostics

Selected device-pixel-ratio caps:

- fine pointer / desktop: `2`;
- coarse pointer / mobile: `1.5`;
- existing source capture/review mode remains capped at `1`.

Static production Cube asset payload, before HTTP compression and excluding shared Homepage files, is approximately `1,588,051 bytes` (`~1.51 MiB`) comprising:

- bootstrap: `9,782` bytes;
- frozen Materials R1 source: `62,685` bytes;
- local Three r180/module/addon graph: `1,236,172` bytes;
- GLB: `279,412` bytes.

No external textures are required by the approved procedural PMREM environment.

## 12. Build / runtime QA status

### Jekyll

The Builder runner does not have Jekyll installed. Both `jekyll` CLI and Ruby `require 'jekyll'` are unavailable. External network access from the runner is blocked, so installing the pinned Jekyll dependency was not repeatedly attempted.

Build status: **ENVIRONMENT BLOCKED**.

### Browser capability checks

Available system Chromium under Xvfb/SwiftShader successfully created a WebGL 2 context:

`WebGL 2.0 (OpenGL ES 3.0 Chromium)`

A browser contract test also confirmed that an import map dynamically inserted before the first Blob-module import resolves a mapped bare module specifier correctly (`PASS:42`).

### Integrated branch WebGL E2E limitation

The execution environment exposes GitHub repository files through the GitHub connector, but does not expose those connector binary/text assets as local filesystem files to the browser runner. The runner itself also blocks outbound GitHub/raw HTTP access (`ERR_BLOCKED_BY_ADMINISTRATOR` / direct network failure).

Therefore the exact branch-local Three vendor graph + exact GLB could not be materialized into the local Xvfb browser in this Builder session.

Consequences:

- real integrated Cube WebGL page load: **ENVIRONMENT BLOCKED**;
- integrated-runtime console fatal-error check: **ENVIRONMENT BLOCKED**;
- visual Cube crop/material/composition review: **ENVIRONMENT BLOCKED**;
- the three mandated real-WebGL screenshots: **NOT PRODUCED**.

No mocked, composited, generated, pasted or legacy-Cube screenshot was substituted, because that would violate the assignment evidence requirement.

## 13. Screenshot evidence

Required evidence state:

1. EN desktop 1440×900, natural Cube orientation — **NOT PRODUCED / ENVIRONMENT BLOCKED**.
2. EN desktop 1440×900, materially different orientation — **NOT PRODUCED / ENVIRONMENT BLOCKED**.
3. RU mobile 390×844, real mounted Cube — **NOT PRODUCED / ENVIRONMENT BLOCKED**.

The earlier R2 empty-Hero screenshots are intentionally not reused as Cube evidence.

## 14. Diff discipline / scope confirmation

Relative to Hero R2 base `227695bf3223d38d208e7de7c6436746e7fda3a3`:

- `index.html`: unchanged;
- `ru/index.html`: unchanged;
- Hero R2 CSS: unchanged;
- Header files/styles/data: unchanged;
- Logo/favicon: unchanged;
- below-Hero content/design files: unchanged;
- deploy-pages workflow: unchanged;
- Semantic Cube source: not imported;
- production/main: not intentionally touched.

The only existing R2 file modified is the Homepage hardening script, with the guarded Hero Cube bootstrap loader addition.

## 15. Builder verdict

### Implementation / freeze contracts

- Exact stable source lineage: **PASS**
- Exact GLB identity: **PASS**
- Three.js production runtime local: **PASS**
- External Three.js CDN dependency: **NONE**
- Geometry freeze: **PASS**
- Motion R1.2 freeze: **PASS**
- Materials R1 freeze: **PASS**
- Lighting R1 freeze: **PASS**
- Semantic Display included: **NO**
- Mounted responsive geometry contract: **PASS**
- Mobile touch-safety architecture: **PASS**
- Resize architecture: **PASS**
- Offscreen/document-hidden lifecycle architecture: **PASS**
- H1/copy/CTA unchanged by branch diff: **PASS**
- Header/Logo/below-Hero unchanged by branch diff: **PASS**

### Evidence gate

**INCOMPLETE — ENVIRONMENT BLOCKED.**

The branch implementation is ready for Control inspection, but this Builder cannot honestly claim the assignment's final visual acceptance gate because the required real integrated WebGL browser screenshots and combined-runtime console pass could not be produced in the current runner.

No merge or deployment is authorized by this report.