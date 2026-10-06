# PROAI CLEARANCE R1.1 — VOLUMETRIC OBJECT RECOVERY

STATUS

PARTIAL / OWNER REVIEW REQUIRED

Custom-web R1.1 implementation is complete in an isolated branch and the flat 4 × 8 matrix has been rebuilt as a genuine volumetric engineered shell. Static code and repository-scope QA pass. Real visual/browser/device QA is not claimed from this execution route; therefore R1.1 is not marked final PASS before Owner inspection.

FRESH MAIN SHA

`821cbabd3455fd920b9ca507e57f3a7e26e2e3f1`

BASE BRANCH

`agent/ai-systems-hero-clearance-feasibility-r1`

BASE SHA

`840e20b8cb138e50dcf802f47a8f770912eacabc`

IMPLEMENTATION BRANCH

`agent/ai-systems-hero-clearance-r1-1-volumetric-recovery`

IMPLEMENTATION HEAD SHA

Final branch HEAD is reported in the Owner response after this report commit.

EXACT FILES CHANGED

- `owner-preview/ai-systems-clearance-r1-1-volumetric/index.html`
- `owner-preview/ai-systems-clearance-r1-1-volumetric/clearance-r1-1.js`
- `docs/site-evolution/ai-systems/hero-clearance-r1-1-volumetric/IMPLEMENTATION_REPORT.md`

R1 ORIGINAL PREVIEW PRESERVED:
YES

The original R1 preview remains at:

`/owner-preview/ai-systems-clearance-feasibility-r1/`

No R1 preview file was overwritten.

R1.1 OWNER PREVIEW URL

`https://hero-preview.proaiexpert-github-io.pages.dev/owner-preview/ai-systems-clearance-r1-1-volumetric/`

R1.1 CLEAN VIEW URL

`https://hero-preview.proaiexpert-github-io.pages.dev/owner-preview/ai-systems-clearance-r1-1-volumetric/?clean=1`

PRIMARY OBJECT FORM

Asymmetric compressed ellipsoid / faceted architectural shell.

The object is approximately spherical/ovoid at distance but intentionally departs from a perfect sphere through:

- compressed left shoulder;
- subtle crown adjustment;
- rear taper;
- small deterministic positional irregularity;
- non-uniform module scale;
- offset focal seam;
- 3/4 camera.

MODULE GEOMETRY

Custom manufactured directional housing built with `THREE.ExtrudeGeometry` from a six-sided asymmetric profile.

Properties:

- front face is directional rather than square;
- body depth: 0.22;
- bevel thickness: 0.035;
- bevel size: 0.035;
- two bevel segments;
- separate readable front/body/bevel relationship;
- not a cube;
- not a sphere;
- not a pill/blob;
- not a UI card.

MODULE COUNT

30 primary machine modules.

VOLUMETRIC DISTRIBUTION METHOD

A deterministic Fibonacci-shell distribution is mapped onto an asymmetric ellipsoid:

- X radius approximately 1.90;
- Y radius approximately 1.52;
- Z radius approximately 1.58.

Each module receives:

- a unique 3D shell position;
- a true ellipsoid surface normal;
- tangent-space orientation;
- authored roll;
- individual scale;
- independent depth relation.

The distribution has front / side / rear modules and visible depth overlap. It is not generated as rows/columns and is not a curved grid.

SEAM OPTIONS TESTED

A. Diagonal axial plane

- normal approximately `(0.78, 0.24, 0.58)`;
- cleaner planar split;
- higher risk of reading as a decorative cut.

B. Offset faceted axial seam

- normal approximately `(0.70, -0.12, 0.70)`;
- includes a restrained Y/Z curvature term;
- offset front focal point;
- balanced 15 / 15 volumetric side split;
- better structural basis for a local focal joint.

Both seam models remain deterministic in the prototype code for internal comparison. Default Owner preview shows B only.

SELECTED SEAM

B — OFFSET FACETED AXIAL SEAM

WHY SELECTED

B better supports:

- 3D front/side depth;
- a focal joint rather than a full equatorial ring;
- two coherent volumetric masses;
- a balanced 15 / 15 module split;
- local registration without forcing a perfect centerline;
- reduced risk of a Saturn-ring / portal read.

CLEARANCE SIZE / METHOD

R1's numerical `0.18` grid gap is not retained.

R1.1 uses seam-normal separation as a local structural field:

REST:
`± 0.220 × focalWeight`

THRESHOLD target:
`± 0.070 × focalWeight`

The two sides therefore approach by an authored maximum of:

`0.150 × focalWeight` per seam side

while never reaching zero seam separation.

A restrained inward radial correction is also applied at threshold:

`-0.045 × focalWeight`

Static geometry analysis of the selected distribution shows:

- 15 modules on each side;
- 7 modules with meaningful focal participation (> 0.10);
- 4 modules with strong focal participation (> 0.30);
- maximum focal weight approximately 0.54;
- maximum authored module movement approximately 0.094 world units.

Perceptual clearance size still requires Owner/browser visual judgment.

AUTHORITY REGISTRATION DESIGN

The failed R1 "three champagne sticks" treatment is removed.

R1.1 uses one recessed internal datum assembly at the focal joint:

- thin warm-platinum / champagne titanium datum;
- darker bearing surface behind it;
- positioned inside the seam depth;
- aligned to the selected seam basis;
- visually subordinate to machine modules;
- structurally associated with the focal joint rather than distributed decoratively.

AUTHORITY REGISTRATION MOTION:
NONE

The datum group does not receive:

- pointer influence;
- target influence;
- machine interpolation;
- scale animation;
- pulse;
- glow;
- success state.

NEIGHBOR GRAPH METHOD

3D distance-based structural adjacency.

For every module, the prototype computes its four nearest module neighbors from authored 3D REST positions.

No row / column logic remains.

The resulting nearest-neighbor distance range in static geometry analysis is approximately:

- minimum: 0.86;
- mean across selected neighbor edges: 1.04;
- maximum among four-neighbor selections: 1.30.

TIGHTENING MECHANIC

Pointer/touch pressure is raycast onto an invisible volumetric interaction shell.

Response chain:

`pressure → local 3D proximity → structural weighting → 4-neighbor propagation → seam-oriented translation + local alignment → convergence`

Key behavior:

- machine modules move toward greater registration;
- no scatter;
- no flee response;
- no inflation;
- no wobble;
- movement magnitude is weighted by seam/focal role;
- global object remains stable;
- neighboring propagation coefficient: 0.34;
- attack damping: approximately 0.52 s;
- threshold attack: approximately 0.40 s;
- release damping: approximately 0.98 s;
- no spring integrator;
- no overshoot term.

CONTROLLED STILLNESS

PASS IN IMPLEMENTATION / VISUAL FEEL REQUIRES OWNER REVIEW

Each influence converges to target using exponential damping.

When difference to target is below `0.0010`, the transform snaps to its authored endpoint.

No:

- oscillation;
- bounce;
- pulse;
- light event;
- success animation.

RENDER STILLNESS

PASS IN IMPLEMENTATION

R1 behavior that continuously scheduled frames merely because `pointerActive` remained true has been removed.

R1.1 requests another RAF only while:

- module transforms are still moving;
- the initial performance sample is incomplete;
- intentional mobile one-shot choreography is active.

Stable pointer + converged transforms allow the renderer to enter `RAF state: IDLE`.

New input/state/resize/visibility events explicitly wake rendering again.

REST STATE QUALITY

IMPLEMENTED / OWNER VISUAL REVIEW REQUIRED

REST is a complete authored object state, not an animation-dependent pose.

There is no:

- rotation loop;
- breathing;
- ping-pong;
- random idle deformation;
- particle motion.

MATERIAL SYSTEM

Structurally assigned hierarchy:

PRIMARY:
honed graphite / obsidian ceramic

SECONDARY:
smoked gunmetal

HIGHLIGHT:
restrained cold silver on exactly two highest-priority seam shoulders

AUTHORITY:
recessed warm-platinum datum

Bright modules are selected by focal structural priority, not random/modulo assignment.

LIGHTING SYSTEM

Premium product-lighting prototype using:

- large soft RectArea key;
- cool restrained edge area;
- soft top area;
- low rear rim;
- PMREM room environment;
- ACES filmic tone mapping;
- deep near-black background.

No neon, emission, bloom or colored-tech lighting is used.

CAMERA

Selected product view:

- 28° perspective field of view;
- 3/4 angle;
- slightly elevated;
- front-side seam depth visible;
- approximately `(3.75, 2.20, 7.65)` on desktop;
- responsive camera distance/scale adjustments on portrait and phone landscape.

DESKTOP 1440 QA

IMPLEMENTATION RESPONSIVE PATH PRESENT.
REAL BROWSER VISUAL QA NOT CLAIMED.

DESKTOP 1280 QA

IMPLEMENTATION RESPONSIVE PATH PRESENT.
REAL BROWSER VISUAL QA NOT CLAIMED.

430 PORTRAIT QA

PORTRAIT CAMERA / SCALE PATH IMPLEMENTED.
ONE-SHOT CHOREOGRAPHY IMPLEMENTED.
REAL DEVICE VISUAL QA NOT CLAIMED.

393 / 390 PORTRAIT QA

PORTRAIT CAMERA / SCALE PATH IMPLEMENTED.
REAL DEVICE VISUAL QA NOT CLAIMED.

844 × 390 QA

LOW-HEIGHT LANDSCAPE LAB RECOMPOSITION IMPLEMENTED.
OBJECT CAMERA PRIORITIZED.
REAL DEVICE VISUAL QA NOT CLAIMED.

REDUCED MOTION QA

STATIC IMPLEMENTATION PASS.

`prefers-reduced-motion: reduce` disables autonomous choreography and interaction motion. Review states are applied spatially without accelerated animation.

MODULE / DRAW CALL STRATEGY

Recommended and implemented:

`THREE.InstancedMesh`

The 30 modules are divided into exactly three material instance groups:

1. graphite;
2. gunmetal;
3. silver.

Independent transforms remain supported via `setMatrixAt`.

The authority datum/bearing is separate because it is a different physical class and must remain immutable.

This is preferable to 30 independent module meshes for the current shared-geometry/material architecture.

DPR

Implemented cap:

- desktop: 1.60;
- compact/mobile: 1.35.

MEASURED FPS

NOT MEASURED IN A REAL BROWSER IN THIS EXECUTION ROUTE.

R1 owner-observed reference values must not be presented as R1.1 measurements.

FIRST RENDER

NOT MEASURED IN A REAL BROWSER IN THIS EXECUTION ROUTE.

Runtime telemetry remains built into the Owner preview.

INPUT → FRAME

NOT MEASURED IN A REAL BROWSER IN THIS EXECUTION ROUTE.

Runtime telemetry remains built into the Owner preview.

KNOWN PERFORMANCE LIMITATIONS

- `ExtrudeGeometry` is more complex than the R1 RoundedBox placeholder, although it is shared and instanced.
- PMREM + physical materials + three RectArea lights are intentionally richer than R1.
- Real iPhone GPU cost must be observed before production architecture is chosen.
- Current code updates instance matrices for all 30 modules during an active convergence frame; this is practical at current count but should be measured.
- Once settled, continuous rendering stops.

ORIGINAL R1 VS R1.1 DIFFERENCE

R1:
flat 4 × 8 engineered panel / grille.

R1.1:
30 directional manufactured housings distributed around a genuine asymmetric 3D ellipsoid, with front / side / rear surfaces, true normals, depth overlap, a single offset focal seam and recessed immutable datum.

R1 physics retained:

- local pressure;
- neighbor propagation;
- damped attack;
- slower release;
- no scatter;
- no spring;
- no bounce;
- authored minimum clearance;
- stillness;
- one-shot mobile;
- reduced motion;
- visibility pause;
- DPR caps;
- telemetry.

DOES IT STILL LOOK LIKE REACTIVE ORB:
PARTIAL / OWNER VISUAL REVIEW REQUIRED

The code architecture and primitive language no longer use spheres/beads or donor scatter behavior, but visual identity cannot be truthfully closed without rendered Owner review.

DOES IT READ AS ONE SIGNATURE OBJECT:
PARTIAL / OWNER VISUAL REVIEW REQUIRED

The geometry is now one coherent volumetric shell by construction. Premium signature quality remains a visual judgment.

DOES CLEARANCE READ AS AN ENGINEERED LIMIT:
PARTIAL / OWNER VISUAL REVIEW REQUIRED

The seam is mechanically authored and never closes. Perceptual reading must be reviewed at desktop and phone scale.

KNOWN LIMITATIONS

- No real browser screenshots captured in this GitHub execution route.
- No real-device iPhone QA.
- No measured R1.1 FPS / first render / latency yet.
- Material/light/camera values are a first authored volumetric pass, not final production lookdev.
- Seam B is selected structurally; final visual approval remains with Owner.
- Spline is intentionally untouched in this stage.

OWNER REVIEW PRIORITIES

1. OBJECTHOOD — does it finally read as one expensive physical artifact?
2. SILHOUETTE — does the ovoid/faceted volume feel authored rather than generic?
3. CLEARANCE — can the focal seam be understood immediately?
4. STILLNESS — does THRESHOLD feel powerful when movement ends?
5. AUTHORITY DATUM — structural and restrained, not decorative?
6. MATERIAL / LIGHT — premium in deep blacks without random bright tiles?
7. INTERACTION — local organization rather than spectacle?
8. MOBILE — does it preserve volume and focal seam?
9. PERFORMANCE — record the built-in runtime metrics on actual target devices.

NEXT RECOMMENDED STEP

Owner visual review of R1.1 LAB and CLEAN views.

If objecthood + seam + stillness pass, the next step should be a narrow browser/device QA and performance correction pass on this same R1.1 architecture.

Do not move to Spline or final R2 until the volumetric object itself is visually approved.

MAIN MODIFIED:
NO

PRODUCTION MODIFIED:
NO

MERGE AUTHORIZED:
NO

MERGE PERFORMED:
NO
