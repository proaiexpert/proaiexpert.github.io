# ProAI Expert Homepage — Hero Shell R1 Report

## Repository state

- Base: `c945084e1952c05c686494091f7dbca0f7acdf08`
- Branch: `agent/proai-home-hero-shell-r1`
- Final review SHA: authoritative branch HEAD is returned in the Builder handoff. A Git commit cannot contain its own resulting SHA without changing that SHA.
- Production deployment: **NO**
- `main` touched: **NO**

## Changed files

- `index.html`
- `ru/index.html`
- `assets/css/homepage-hero-shell-r1.css`
- `docs/site-evolution/PROAI_HOME_HERO_SHELL_R1_REPORT.md`

## Hero system

Scoped structural tokens:

- void `#020304`
- page `#050607`
- surface `#090B0E`
- panel `#0E1217`
- pearl `#E7E5DF`
- body `#A6ABB1`
- muted `#858A90`
- champagne `#C7A768`
- champagne highlight `#D8BD84`
- champagne deep `#9A6F38`
- spectral hooks `#676BFF / #5B50FF / #9BA8FF`
- machine-energy hook: visible intensity `0`

H1 uses existing Inter/system infrastructure at weight `500`, responsive `clamp()` sizing, tight modern tracking, and a restrained `#F3F1EC → #E7E5DF → #D2D6DA` pearl material gradient. RU tracking is less aggressive.

Primary CTA: 10px radius, 50–52px target height, warm-pearl `#F3EEE4 → #ECE5D8 → #E0D6C5`, dark ink `#111315`, restrained champagne border/specular, localized 28% lower-right champagne edge, `-1px` hover, `.985` press, warm two-stage `focus-visible` ring.

Secondary CTA: same geometry, smoked neutral surface, neutral hairline, subordinate pearl text, restrained hover, `.985` press, same accessible warm focus family.

## Cube-slot contract

Each rendered language page receives exactly one:

`#proai-hero-cube-mount`

inside `.proai-hero-object-slot[data-cube-mounted="false"]`.

Default state keeps the existing production Hero visual visible as `.proai-hero-object-fallback`; the empty Cube mount is present, hidden and `pointer-events:none`. Future `data-cube-mounted="true"` fades/disables the fallback and activates the mount with `pointer-events:auto`. Canvas styling is scoped to the mount. No Three.js, GLB, runtime or switching JavaScript is added.

The existing fallback visual DOM/content is unchanged; only the outer integration wrapper and uniform desktop fallback scale/placement are applied so the old wide scene does not collide with the new copy. The future Cube slot itself remains full-size and unscaled.

## QA

- EN locked copy: **PASS**
- RU locked copy: **PASS**
- Proper em dash: **PASS**
- CTA routes: **PASS**
- Cube mount count/state: **PASS**
- Three.js request/dependency: **NONE**
- GLB request/dependency: **NONE**
- Current fallback visible: **PASS**
- Stable square mount geometry: **PASS**
- Horizontal overflow: **PASS**
- Header clearance: **PASS**
- CTA clipping: **PASS**
- Stage-rail overflow: **PASS**
- Browser harness console/page errors: **PASS**
- Responsive matrix: **18/18 PASS** across EN/RU at `1440×900`, `1280×800`, `1024×768`, `820×1180`, `768×1024`, `430×932`, `390×844`, `360×800`, plus `844×390` landscape.

The two review screenshots are exactly EN `1440×900` and RU `390×844`. They are supplied as external Builder review artifacts rather than repository files, keeping the review-branch diff limited to production-target source + report.

### Build note

Repository production deploy uses Jekyll 4.3.4 installed dynamically by GitHub Actions on pushes to `main`. This review branch does not trigger that deployment workflow. The available runner had no Jekyll installation and its attempt to install the workflow-pinned gem was blocked by external DNS resolution, so an Actions-equivalent `jekyll build` could not be reproduced locally. Static Liquid replacement-contract checks plus browser rendering of the production Header/Hero DOM with the R1 authority stylesheet passed. No production workflow was dispatched.

## Scope confirmation

- Below-Hero content/design intentionally changed: **NO**
- New CSS selectors outside `#hero`: **NO**
- Header files/data/styles changed: **NO**
- Global `--ai-cyan` replaced: **NO**
- Legacy Hero-only behavior neutralized: copy fade/slide and scene zoom/blur on `body.scrolled` only; global Homepage scrolling remains untouched.
- Section 2 or later redesign started: **NO**
