# ProAI Expert Homepage — Hero Shell R2 Cube-Ready Report

## Repository state

- R1 base SHA: `6f329216c275c06bcb3966dd56fda50f299cb9b7`
- R2 branch: `agent/proai-home-hero-shell-r2-cube-ready`
- Final R2 SHA: authoritative immutable branch HEAD is returned in the Builder handoff. A Git commit cannot contain its own resulting SHA without changing that SHA.
- Production `main` baseline verified before implementation: `c945084e1952c05c686494091f7dbca0f7acdf08`
- Production deployment: **NO**
- `main` touched: **NO**

## Changed files

Relative to R1 base `6f329216c275c06bcb3966dd56fda50f299cb9b7`:

- `index.html`
- `ru/index.html`
- `assets/css/homepage-hero-shell-r2.css`
- `docs/site-evolution/PROAI_HOME_HERO_SHELL_R2_CUBE_READY_REPORT.md`

The R1 stylesheet remains historical repository content but is no longer referenced by the R2 EN/RU Homepage wrappers. R2 uses one Hero authority stylesheet: `assets/css/homepage-hero-shell-r2.css`.

## AI-first support copy

EN — exact owner-approved copy:

> We build AI systems, automation, and premium websites as one connected business system. AI and automation reduce routine work and improve how inquiries and follow-up move through the business; the website builds trust, explains your services, and brings clients into that system with the right information. Key decisions stay with you.

RU — exact owner-approved copy:

> Создаём AI-системы, автоматизацию и премиальные сайты как одну связанную систему для бизнеса. AI и автоматизация сокращают рутину и упрощают работу с обращениями и последующими действиями; сайт формирует доверие, объясняет услуги и приводит клиента в эту систему с нужной информацией. Ключевые решения — за вами.

H1 is unchanged from R1:

- EN: `From first impression to result — one system.`
- RU: `От первого впечатления до результата — одна система.`

The R1 CTA system is unchanged: labels, destinations, geometry, materials, hover, pressed and `focus-visible` behavior are preserved.

## Legacy Hero visual removal

R2 no longer wraps the production Hero scene as a fallback.

The EN/RU Liquid wrappers split the captured legacy Homepage at the base `.hero-visual` marker and the start of `#manifest`, discard the complete legacy Hero visual block, and insert only the Cube-ready object region. Therefore the rendered R2 Hero does not contain:

- `#scene`;
- the rotating legacy core;
- orbit SVG / SMIL animation;
- legacy Hero nodes/cards;
- legacy cyan ambient Hero composition;
- `.proai-hero-object-fallback`.

No fake Cube, placeholder graphic, loading UI, skeleton or replacement object was added.

### Legacy JavaScript safety

JavaScript files were not changed.

The existing base Homepage inline logic was audited before removal. Hero-specific behavior is already guarded:

- scene mouse movement executes only when `scene` exists;
- node interaction is armed only when the Hero node collection is non-empty;
- the hardening script operates only on nodes returned by its queries.

With `#scene` and Hero nodes absent, those legacy Hero paths are no-ops while unrelated below-Hero interactions remain intact. Because the animated SVG/core/nodes are physically absent from rendered Hero DOM, the old visual is not running invisibly.

## Neutral Obsidian spatial treatment

R2 keeps the owner-approved Neutral Obsidian hierarchy scoped to `#hero`:

- `#020304` deep void;
- `#050607` primary page field;
- `#090B0E` raised structural surface;
- `#0E1217` panel level;
- `#171C22` elevated graphite level.

The right object territory uses only restrained neutral graphite/silver environmental luminance and soft falloff. It has no visible card, border, placeholder box, cyan field, purple halo or warm-gold flood.

Spectral hooks remain available:

- `#676BFF`;
- `#5B50FF`;
- `#9BA8FF`.

Visible machine-energy intensity remains `0`.

## Cube slot contract

Each language wrapper produces exactly one:

`#proai-hero-cube-mount`

inside:

`.proai-hero-object-slot[data-proai-hero-object][data-cube-mounted="false"]`

Default unmounted state:

- no object visible;
- mount `opacity: 0` / `visibility: hidden`;
- `pointer-events: none`;
- no runtime dependency.

Prepared mounted state:

- `data-cube-mounted="true"` exposes the mount;
- `pointer-events: auto`;
- desktop object territory remains substantial;
- mobile state restores the full square runtime geometry.

Canvas behavior is scoped only to the future mount:

```css
#hero .proai-hero-cube-mount canvas {
  width: 100%;
  height: 100%;
  display: block;
}
```

No Three.js, GLB, Cube JavaScript or motion runtime was added.

## Mounted / unmounted responsive behavior

Desktop keeps the final two-column geometry and reserves the full right-side object territory even while unmounted.

At tablet/mobile widths the copy remains first. The unmounted object slot reduces to a shallow neutral spatial continuation rather than forcing a large meaningless square. Switching to `data-cube-mounted="true"` restores square Cube geometry without reconstructing the Hero layout.

## QA

Browser harness matrix, EN and RU:

- `1440×900`
- `1280×800`
- `1024×768`
- `820×1180`
- `768×1024`
- `430×932`
- `390×844`
- `360×800`
- `844×390` mobile landscape

Result: **18 / 18 PASS**.

Verified across the matrix:

- horizontal overflow: **0**;
- Cube mount count: **1**;
- default `data-cube-mounted`: **false**;
- unmounted pointer events: **none**;
- mounted pointer events: **auto**;
- mounted mobile slot returns to square geometry;
- legacy `#scene`: **0**;
- legacy orbit SVG: **0**;
- legacy Hero nodes: **0**;
- legacy fallback wrapper: **0**;
- browser console/page errors: **0**.

Exact review screenshots produced as external Builder evidence, not committed to the repository:

1. EN desktop `1440×900`.
2. RU mobile `390×844`.

## Copy / visual absence QA

- New EN AI-first support copy: **PASS**
- New RU AI-first support copy: **PASS**
- H1 unchanged: **PASS**
- CTA system unchanged: **PASS**
- Old rotating core visible: **NO**
- Old orbit system visible: **NO**
- Old Hero nodes visible: **NO**
- Old cyan ambient Hero composition visible: **NO**
- Fake Cube: **NO**
- Placeholder graphic: **NO**
- Legacy visual running invisibly: **NO**

## Performance

R2 removes the legacy Hero visual DOM instead of hiding it. This eliminates its rotating core CSS animation, orbit SVG/SMIL animation, Hero node interactions and scene pointer-transform work because those nodes no longer exist. No replacement animation or runtime was added.

## Build note

The available runner does not have Jekyll installed (`jekyll` command unavailable; Jekyll gem absent). External DNS access is blocked in this environment, so reproducing the workflow-pinned Jekyll installation/build is environment-blocked and was not repeatedly retried.

Strongest available validation was used instead: Liquid marker/contract review against the exact R1 source, GitHub diff inspection, DOM contract checks, mounted/unmounted state checks, responsive browser rendering, visual inspection, overflow checks and console/page-error checks.

Build status: **ENVIRONMENT BLOCKED**.

## Scope confirmation

- Header files/data/styles intentionally changed: **NO**
- Header redesign/recolor/logo work started: **NO**
- Below-Hero content/design intentionally changed relative to R1: **NO**
- Section 2 or later redesign started: **NO**
- Three.js / GLB / current Cube integrated: **NO**
- Production/main updated or deployed: **NO**
