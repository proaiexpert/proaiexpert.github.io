# ProAI Cube — Next Phases Roadmap — 2026-08-12

## Stable mechanical baseline

Branch: `agent/proai-cube-threejs-mechanical-r0`
Baseline commit: `32cf6e497b3c4402169ab8b677d3372cca439da3`

Mechanical Parity R0 is complete and should be treated as the stable fallback baseline:
- clean GLB + Three.js;
- no Spline runtime / watermark / prod.spline.design dependency;
- hierarchy preserved;
- exact 90° slice mechanics;
- 6-cycle repeatability with zero measurable transform drift;
- OrbitControls working;
- current motion parameters are technically valid but not yet visually strong enough for final Hero.

Do not rebuild the cube from scratch and do not break the R0 mechanics without evidence.

## Current visual decision

Primary direction: **Rubik-style ProAI cube**.

The Monolith experiment is parked as a fallback/comparison branch. The Rubik object has more identity, stronger mechanics, and better potential for a branded semantic narrative.

## Required sequence of work

### Phase 1 — Motion R1
Primary next task.

Goal: turn the technically correct R0 movement into a high-end autonomous choreography.

- Extend slice mechanics from the current single X/right-layer proof to safe X / Y / Z slice turns.
- Preserve exact 90° endpoints and zero-drift repeatability.
- Add slow autonomous body drift / inspection motion.
- Remove repetitive `turn -> reset -> turn -> reset` feel.
- Use varied but restrained sequences: isolated turns, occasional 2-turn phrases, calm holds.
- Motion must feel weighted, soft, deliberate, and physically coherent.
- Keep OrbitControls damping and avoid conflict between manual orbit and autonomous motion.
- No material/art-direction expansion yet beyond what is needed to review motion clearly.

### Phase 2 — Geometry / edges
After Motion R1 is owner-approved.

- refine bevel / corner treatment;
- refine gaps and dark internal seams;
- avoid sharp cheap square edges;
- avoid cartoon rounding;
- target a precision-machined premium object.

### Phase 3 — Materials + lighting
After geometry approval.

- graphite / black chrome / gunmetal / smoked graphite family;
- subtle tonal variation across surfaces, not colorful Rubik stickers;
- controlled reflections;
- large soft key reflection;
- restrained rim and fill;
- reflections should travel across bevels during motion.

### Phase 4 — Semantic display states
After the object itself looks premium.

Primary concept:
- Rubik segmentation remains visible during movement;
- after settle, the active face can temporarily read as a unified display surface;
- one strong stage word appears on that face;
- planned states: `AI EXPERT`, `ДОВЕРИЕ`, `ОБРАЩЕНИЕ`, `ОТВЕТ`, `РЕЗУЛЬТАТ` (EN equivalents later under copy lock);
- after the display state, segmentation returns and the next mechanical move begins.

This is the main differentiation from Resend and should not be attempted until motion/material quality is strong.

### Phase 5 — Background / spatial integration
Only after cube + semantic states are strong.

- dark spatial backdrop;
- subtle volumetric halo / reflection planes / depth;
- no white Resend-style light strip copy;
- no cyan/neon/HUD/particles unless later proven necessary;
- background must support the object, not compete with it.

### Phase 6 — Hero integration
Only after isolated owner approval.

- integrate into Hero composition;
- preserve locked RU/EN Hero copy;
- responsive framing;
- production routes remain untouched until explicit owner authorization.

## Guardrails

- Visual quality first.
- Resend is a quality benchmark, not a template.
- No Spline runtime in production.
- No production `/index.html` or `/ru/index.html` changes without explicit authorization.
- No merge/deploy during isolated visual passes.
- Keep each pass narrow enough to identify what improved or regressed.
