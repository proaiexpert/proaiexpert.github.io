# ProAI Monolith Cube R0 — Owner Review Report

## Creative rationale

R0 deliberately moves away from Rubik segmentation toward one heavy, hero-dominant object. The silhouette stays unmistakably cubic, but the edges are softened enough to read as machined premium hardware rather than a default primitive. The object is intentionally restrained: no particles, no neon scaffold, no reactor language and no decorative HUD.

## Material logic

The core is a graphite / gunmetal physical material with high metalness, controlled roughness and a low-clearcoat finish. The lighting is built around broad studio reflections rather than point-source sparkle. One face carries a nearly flush smoked-glass coating: it reads as an integrated material zone rather than a separate plate. That gives the object a future display surface for one-word states without Rubik segmentation or a screen-like gadget silhouette.

## Motion logic

Autonomous motion is continuous and non-loop-looking: multiple very slow sine components create a weighted 3D drift with no snap points, and exponential follow smoothing prevents abrupt changes. OrbitControls uses damping, restrained rotate/zoom speeds, pan disabled and a tight zoom envelope. Manual interaction temporarily suppresses autonomous rotation so the object does not fight the user.

## Resend differentiation

Resend is used only as a quality benchmark for material/motion polish. This prototype differs through a single rounded monolith silhouette, darker machined graphite material, one nearly flush smoked active surface, no signature white light stripe and a quieter spatial environment with restrained silver/warm studio reflections.

## What can develop next

- tune the exact bevel radius after owner visual review;
- decide whether later display states should be shader-integrated or added as a separate smoked surface layer;
- test one-word surface states only after base object approval;
- calibrate motion amplitude/period against the final Hero crop;
- only after owner approval, evaluate production integration and responsive behavior.

## Guardrails verified

- no Spline runtime;
- no `.splinecode` or `prod.spline.design` dependency;
- no Rubik segmentation;
- no production Hero integration;
- `/index.html` and `/ru/index.html` are outside this prototype folder and were not modified by this pass.

## Review asset note

The checked-in PNG/MP4 owner-review assets are deterministic offline reference renders using the same intended camera angle, bevel scale, graphite palette, broad studio-reflection logic and slow weighted motion. `capture.mjs` is included for direct browser capture in an npm-enabled environment; the current execution environment had Chromium but no npm/network package installation, so browser-native Three.js capture could not be run here without introducing an unrelated dependency workaround.
