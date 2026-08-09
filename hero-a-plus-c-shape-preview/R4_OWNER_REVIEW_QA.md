# ProAI Expert Hero R4 — Owner Review QA

Date: 2026-08-08
Branch: `agent/hero-r4-integrated-cinematic-scene`
Base: `agent/hero-r3-owner-review-fixed` @ `14d29f078abca613728399831fc772c464a7162e`

## Scope

R4 is isolated to the owner-review preview routes and R4-specific assets/includes. Production `/` and `/ru/` are not modified.

Preview routes:

- `/hero-a-plus-c-shape-preview/`
- `/ru/hero-a-plus-c-shape-preview/`

Static review toggle:

- `?motion=0`
- `?mode=static`

## Browser QA

The Hero stack was rendered in Chromium with the exact R4 Hero HTML/CSS/JS and final raster scene data. Direct localhost/file navigation was unavailable in the execution environment, so the screenshot harness used `page.set_content()` and a static reconstruction of the current header for local visual capture. The committed preview routes themselves retain the real repository `header-system/header.html` include and production header CSS/JS.

Target viewport overflow checks:

- 1440 × 900: `scrollWidth=1440`, `clientWidth=1440`
- 1728 × 1117: `scrollWidth=1728`, `clientWidth=1728`
- 768 × 1024: `scrollWidth=768`, `clientWidth=768`
- 390 × 844 EN: `scrollWidth=390`, `clientWidth=390`
- 390 × 844 RU: `scrollWidth=390`, `clientWidth=390`
- 320 × 568: `scrollWidth=320`, `clientWidth=320`
- 844 × 390: `scrollWidth=844`, `clientWidth=844`

Horizontal overflow: **0 at every required QA viewport**.

### Reduced motion

Verified with `prefers-reduced-motion: reduce`:

- `hero-r4-motion` class: absent
- active rail stages: `0`
- signal pulse animation: `none`
- complete static scene remains visible

### No JavaScript

Verified with R4 JS disabled:

- scene visible: yes
- H1 visible: yes
- CTA visible: yes
- rail items visible: 4/4
- 1440 viewport overflow: `scrollWidth=1440`, `clientWidth=1440`

### Small-mobile CTA

At 320 × 568, primary CTA bottom is approximately `548.7px`, so the primary action remains available in the initial viewport before the cinematic scene begins below it.

## Static premium gate

The static state is the primary art-direction state. Motion is not required to hide or complete the composition.

- wide source-derived environmental scene instead of isolated Core plate
- physical floor/contact retained in raster scene
- reflection and cyan spill retained in scene
- broad outer dissolve, no object-shaped alpha contour
- rail placed inside the same atmospheric field on desktop
- portrait art direction stacks copy/CTA before a large Core scene
- Core stays physically stable during all motion

## Motion foundation

- cycle: approximately 8.6s total
- primary signal active in the first portion of the cycle, followed by rest
- rail activation sequence: 01 → 02 → 03 → 04
- low-amplitude internal breathing: approximately 7.8s
- synchronized local floor/haze response
- restrained CTA hover/focus response
- no Core rotation, bobbing, pointer tilt, object parallax, or independent floor motion

## Visual QA gate

1. Can a rectangular image boundary be visually identified? **NO**
2. Does the Core read as a transparent PNG pasted onto the page? **NO**
3. Does it physically touch / inhabit the floor? **YES**
4. Is there believable contact shadow? **YES**
5. Is there believable reflection / cyan spill? **YES**
6. Does background illumination continue naturally beyond the raster scene? **YES**
7. Is the Core visually authoritative relative to H1? **YES**
8. Does the rail belong to the same scene? **YES**
9. On 390px portrait, is the Core still large and detailed? **YES**
10. Does the static version already look premium without animation? **YES**

Status: `R4 INTEGRATED SCENE — READY FOR OWNER REVIEW`
