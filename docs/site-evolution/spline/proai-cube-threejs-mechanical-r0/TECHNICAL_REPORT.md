# ProAI Cube — Three.js Mechanical Parity R0 — Technical Report

## Scope

Isolated Three.js proof using the exact clean GLB geometry. No Hero integration, production route changes, Spline runtime, .splinecode runtime dependency, or prod.spline.design request.

## Geometry / hierarchy

- Named hierarchy: **PASS**.
- Axis: **X**; X clusters: `[-204.99999999999994,-0.06497066745719593,204.99999999999994]`.
- Right layer objects: **10**; unique spatial cubies: **9**.
- Source hierarchy is restored exactly after reset.

## Motion

- Turn **1650 ms**; reset **1750 ms**; easing **0.42, 0, 0.16, 1**; hold **1600 ms**.
- Orbit damping **0.068**; rotate speed **0.55**.
- Endpoint error **0 rad**; telemetry {"sampleCount":30,"monotonic":true,"overshoot":false,"maxAbsStepRad":0.8246576025403395,"firstStepRad":0.00017583354302986461,"lastStepRad":0.19835368612852644}.
- Motion gate: monotonic/no-overshoot easing, exact terminal quaternion, soft first-step acceleration.
- Repeatability 6 cycles: position 0; quaternion 0; scale 0; **PASS**.

## Reference calibration

Resend was used for motion character only. R0 does not copy its proprietary implementation. Motion is slow/weighted with long acceleration/deceleration, zero overshoot, visible hold, restrained orbit damping.

## Browser / dependency QA

- Runtime **PASS**; Spline dependency **NONE**; forbidden requests 0; browser errors 0; console errors 0.
- Review video 11.59 s; inferred source media 20.36 s; first-pass 7.86 s; SwiftShader wall clock 31.09 s; final timestamp factor 0.5893.

## Review evidence

- `review/proai-cube-r0-natural-3q.png`
- `review/proai-cube-r0-slice-turn.png`
- `review/proai-cube-r0-review-12s.webm`
- `review/qa-report.json`

## Gate

Owner visual review remains the gate. No Hero/final-art pass started.
