# PROAI EXPERT — BRAND COLOR ARCHITECTURE LIBRARY R2 — 2026-08-12

Repository: `proaiexpert/proaiexpert.github.io`

Status: **DURABLE COLOR / ART-DIRECTION LIBRARY — OWNER REQUESTED PRESERVATION**

Purpose: preserve the full ProAI color architecture, researched shades, visual-lab conclusions, independent art-direction review, future-use alternatives and retrieval rules so future agents do not restart this work or lose useful colors.

This document is **not a final production token lock**. It is the current authoritative durable library for color/art-direction research and the strongest working direction after Visual Lab R1. Exact production tokens still require owner visual approval in the relevant implementation phase.

Where this document conflicts with the older research library about the status of the Color/UI Visual Lab, this R2 document wins. The older document remains preserved as historical research:

`docs/site-evolution/PROAI_BRAND_COLOR_ARCHITECTURE_RESEARCH_LIBRARY_2026-08-12.md`

---

## 0. SOURCE / PROVENANCE

### Earlier durable research library

Control commit containing original library:

`c37dab13663007b6307fdea74e53c3990131720c`

### Brand Color / UI Visual Lab R1

Branch:

`agent/proai-brand-color-ui-lab-r1`

Final branch HEAD:

`85ea9b76af515bfbcba5bdbbc087a5191a8bf273`

Exact visual-evidence commit:

`dea7e84e7119bf911e438837d46ede0cc5c6a4a0`

Prototype:

`docs/site-evolution/brand/proai-brand-color-ui-lab-r1/`

Report:

`docs/site-evolution/brand/proai-brand-color-ui-lab-r1/REPORT.md`

The lab contains 16 owner-review PNGs covering Hero A/B/C/D desktop/mobile, buttons, black hierarchy, light inverse, page-family concepts, contextual tints, spectral/warm energy and typography.

### Cube reference used in the lab

Approved Materials + Lighting R1:

`d17806da42275db617d8a46b231a2d877706a179`

Copied static Cube evidence blob:

`4f462472177bf8c9423019a0ee2a50603ae34542`

This blob matches the approved source image:

`proai-cube-materials-lighting-r1-natural.png`

Important limitation: the lab displays the exact Cube image but applies presentation effects such as `mix-blend-mode: screen`, masking, drop-shadow and surrounding energy planes. Therefore the lab is valid for **relative art-direction comparison**, but exact visual calibration must later happen with the live Three.js/PBR Cube.

---

## 1. OWNER-APPROVED CUBE MATERIAL ANCHORS — PROTECTED

These remain the approved physical/object colors and are not replaced by this library:

- Graphite: `#242A31`
- Gunmetal: `#2B323A`
- Black chrome: `#181D23`
- Smoked core: `#0C0F13`

These define the Cube's engineered material language. They are not the whole website palette.

---

## 2. STRONGEST CURRENT BRAND DIRECTION

Current strongest system:

# OBSIDIAN SPECTRUM

Recommended interpretation after independent review:

> **Obsidian / graphite / black chrome remain permanent.**  
> **Warm Pearl + Champagne belong to Human/UI/tactile interaction.**  
> **Spectral Indigo / Ice belongs primarily to Machine/AI events and localized atmosphere.**  
> **Contextual tints may vary by case/article/project while core brand physics stay stable.**

The critical refinement from Visual Lab R1 is:

## A, but event-driven

Do **not** interpret Obsidian Spectrum as a permanently purple Hero.

Preferred behavior:

- normal / idle state: mostly neutral Obsidian, graphite, pearl and subtle material light;
- Human/UI action: warm pearl/champagne;
- Machine/AI activation: localized spectral indigo/ice appears or strengthens;
- after the machine event: spectral energy largely recedes back into the neutral scene.

This turns color into **system behavior**, not generic AI decoration.

---

## 3. HERO VISUAL LAB RANKING — INDEPENDENT REVIEW

Builder self-ranking was:

`A → B → D → C`

Independent art-direction ranking is:

### 1. A — Obsidian Spectrum Balanced

Best overall ProAI direction.

Strengths:

- clear separation of structural, UI and machine-energy roles;
- strong compatibility with owner-approved Cube materials;
- premium without being sterile;
- more ownable than pure monochrome;
- supports future dynamic/event-driven color behavior.

Use as the main working direction, but reduce persistent spectral presence relative to event state.

### 2. D — Monochrome Control

Very strong premium baseline and permanent quality benchmark.

Role:

- proves the design still works without chroma;
- fallback/reference for restraint;
- benchmark against which any added color must create real value.

Rule:

> If a colored treatment does not look better than the Monochrome Control, remove or reduce the color.

### 3. B — Black Champagne / Warmer

Strong executive/editorial/tactile temperature.

Best future roles:

- Premium Websites page;
- editorial sections;
- light/inverse transitions;
- selected premium-service contexts;
- warm material moments.

Risk if used as the sole Homepage identity:

- can drift toward luxury consulting, architecture, hospitality or high-end financial services;
- can reduce perceived advanced-technology character.

### 4. C — Cold Spectral / More Machine

Useful as an upper-bound study, not preferred main identity.

Risk:

- generic contemporary AI/startup language;
- developer-tools/GPU/Web3/gaming-adjacent feel;
- less ownable despite visual attractiveness.

Preserve as a boundary reference: **this is approximately how far cold spectral intensity should not be pushed by default.**

---

## 4. CORE STRUCTURAL BLACK LIBRARY

### Neutral Obsidian — preferred structural family

- Black 0 / void: `#020304`
- Black 1 / page: `#050607`
- Black 2 / surface: `#090B0E`
- Black 3 / panel: `#0E1217`
- Black 4 / card: `#171C22`

This is the strongest current structural hierarchy.

Use value, border luminance, material response and content hierarchy to create depth before introducing hue.

Practical rule:

Do not force all five levels into every screen. Typical layouts may use only:

`Page → Surface → Card`

with Black 0 and Black 4 reserved for special depth extremes.

### Cool Graphite Black — retained alternative

- `#020306`
- `#05070A`
- `#090D12`
- `#10161D`
- `#18212A`

Potential use:

- AI/system contexts;
- cooler section art direction;
- localized machine-oriented surfaces.

Risk: generic blue-black AI feel when overused.

### Mineral Black — retained alternative

- `#020403`
- `#050806`
- `#09100C`
- `#101712`
- `#18211B`

Potential use:

- special contextual/project art direction;
- environmental/mineral undertones.

Not current global identity.

### Warm Carbon — retained alternative

- `#040302`
- `#070605`
- `#0C0A08`
- `#14110E`
- `#1D1814`

Potential use:

- editorial/tactile sections;
- champagne-heavy contexts;
- Premium Websites;
- warm inverse transitions.

Can make the neutral/cool Cube feel more engineered by contrast.

---

## 5. LIGHT / OFF-WHITE / PEARL LIBRARY

Avoid pure `#FFFFFF` as the universal light material.

- Frost: `#F5F4F0`
- Warm Pearl: `#F2EFE8`
- Pearl: `#E8E5DE`
- Silver Pearl: `#D8DBDE`
- Cool Paper: `#EEF1F3`
- Light muted: `#B8B8B4`
- Dark ink: `#111315`
- Dark muted: `#62666B`

Preferred future inverse/light foundation:

**Warm Pearl `#F2EFE8`**

Alternative brighter inverse:

**Frost `#F5F4F0`**

This lets ProAI move between dark and light surfaces without becoming sterile white.

---

## 6. WARM / HUMAN / UI COLOR LIBRARY

### Champagne — primary warm candidate

- Base: `#C7A768`
- Highlight: `#D8BD84`
- Deep / bronze edge: `#9A6F38`

Intended role:

- Human/UI/tactile interaction;
- partial CTA edge;
- focus/selected state;
- tiny premium material detail;
- restrained local warm reflection.

Do not use as a global gold fill.

### Pale Gold

- `#D8BD84`

Best as highlight/specular rather than a standalone main accent.

### Bronze

- `#9A6F38`

Useful for deep edge/shadow material response.

### Copper — retained contextual option

- `#B96F50`

Potentially useful for:

- crafted/human case art;
- editorial contextual tint.

Risk: hospitality/architecture/lifestyle drift.

### Amber — retained contextual option

- `#E1A24A`

Strong on black, but not a preferred permanent ProAI identity because of common orange-tech/Resend associations.

---

## 7. COOL / MACHINE / AI COLOR LIBRARY

### Spectral Indigo — strongest machine-energy candidate

- Spectral Indigo: `#676BFF`
- Deep Spectral: `#5B50FF`
- Ice companion: `#9BA8FF`

Preferred role:

- event-driven machine activation;
- Cube-local environmental response;
- semantic/spatial special event;
- local atmospheric plane;
- rare machine-state edge.

Do not use by default for:

- primary buttons;
- H1 words;
- ordinary navigation;
- normal card fills;
- every AI-related component.

### Steel Blue

- `#6F86A0`

Potential use:

- infrastructure/analytical/contextual art;
- Automation-page hypothesis;
- technical material undertone.

Safe but less ownable.

### Ice Blue

- `#9DB3CA`

Useful mainly as reflection/specular/supporting cool light.

### Muted Teal

- `#5D8C8C`

Potential contextual/mineral tint.

Important risk:

Do not let this revive the old cyan/teal ProAI identity by accident.

### Mineral Violet

- `#716AFF`

Retained as research alternative only. Modern but common in current AI design.

---

## 8. HUMAN VS MACHINE COLOR PHYSICS

The strongest functional split is:

### Human / business / interaction

- Warm Pearl
- Champagne
- Ivory/off-white
- tactile metallic edge

### Machine / intelligence / semantic event

- Spectral Indigo
- Deep Spectral
- Ice/Periwinkle reflection
- localized environmental response

### Permanent physical structure

- Obsidian
- Graphite
- Gunmetal
- Black Chrome
- Smoked Core
- Pearl/Silver typography

The metaphor should be **felt through behavior and material**, not explained in copy.

---

## 9. HERO WORKING COLOR MAP

Current strongest Hero map for later spatial integration:

- deep void: `#020304`
- page/base: `#050607`
- surface: `#090B0E`
- panel: `#0E1217`
- card/elevated: `#171C22`
- Cube: owner-approved `#242A31 / #2B323A / #181D23 / #0C0F13`
- H1: restrained pearl treatment, approximately `#F3F1EC → #D2D6DA`
- body: approximately `#A6ABB1`
- eyebrow: approximately `#C0C3C6`
- micro/muted: approximately `#858A90`
- Primary CTA: Warm Pearl physical control + partial Champagne detail
- Secondary CTA: Smoked neutral / hairline
- idle spatial energy: near-neutral, spectral very low
- machine/semantic event: localized spectral `#676BFF / #5B50FF / #9BA8FF`
- semantic typography: neutral pearl/silver, not purple

Important:

The semantic `ProAI / Expert` lettering should first prove itself as premium **pearl/silver material**. Do not color the words purple just because Spectral Indigo is the machine family.

Later Background/Spatial Integration may let the **environment around the Cube** respond subtly to a semantic/machine event.

---

## 10. BUTTON LIBRARY / CURRENT RECOMMENDATION

### Primary A — Neutral Pearl

Reference:

`linear-gradient(180deg,#F2F3F3,#D9DDE0)`

Dark ink:

`#111315`

Use as neutral premium baseline.

### Primary B — Warm Pearl / Champagne — strongest current Hero candidate

Reference body:

`linear-gradient(180deg,#F3EEE4 0%,#ECE5D8 46%,#E0D6C5 100%)`

Text:

`#111315`

Border:

approximately `rgba(216,189,132,.38)`

Top inner specular:

approximately `rgba(255,250,240,.72)`

Local edge:

`#C7A768 → #D8BD84 → #9A6F38`

Independent recommendation:

The button should read primarily as **expensive warm pearl**, not a gold button.

Champagne should be a small material signal.

Preferred partial accent-edge range:

approximately **25–30%**.

40% remains useful research but begins to read more like an intentionally drawn stripe.

### Primary C — Black Chrome

Reference:

`linear-gradient(180deg,#1A2027,#0D1116)`

Use with pearl text and restrained neutral/spectral specular.

Strong candidate for inverse/light surfaces.

### Secondary — preferred rule

Default:

Smoked neutral / neutral hairline.

On hover/focus/selected state:

allow a small Champagne material response.

Do not keep Champagne strongly visible on the secondary control in all states.

### Press behavior correction

Visual Lab REPORT described pressed scale around `.985`, while lab CSS used `.975`.

For future premium production behavior, prefer approximately:

`scale(.985)`

rather than `.975`, unless later visual testing proves otherwise.

Reason: 2.5% shrink is more visibly app-like; approximately 1.5% is calmer and more premium.

---

## 11. BLACK-ON-BLACK UI RULE

Use simultaneous cues:

- surface value;
- border luminance;
- elevation/shadow;
- material response;
- content luminance.

Do not use one black everywhere.

Do not solve depth by adding random hue.

Reference grammar:

`PAGE → SURFACE → PANEL → CARD → NESTED OBJECT`

Use only the number of levels needed by the actual composition.

---

## 12. LIGHT / DARK INVERSION — PRESERVE

ProAI is:

**dark-first, not dark-only.**

### Dark system

Obsidian + pearl typography + graphite/black-chrome objects + warm UI + rare/event-driven cool machine energy.

### Light inverse

Preferred foundation:

`#F2EFE8`

Primary ink:

`#111315`

Secondary/body:

`#62666B`

Use black-chrome cards/controls as structural counterweight.

Champagne stays a small material/state detail.

Spectral color remains primarily imagery/illustration/special spatial context.

Potential future rhythm:

`dark → warm pearl → black → light → black`

This avoids one endless dark page while preserving one brand identity.

---

## 13. CONTEXTUAL TINT LIBRARY

Contextual tint = temporary art-direction color belonging to a specific case/article/project/page context, not a permanent core brand token.

Retained examples:

- Spectral Indigo: `#676BFF`
- Champagne/Amber: `#E1A24A` / warm family
- Mineral Teal: `#5D8C8C`
- Steel Blue: `#6F86A0`
- Copper: `#B96F50`
- Neutral Monochrome: silver/pearl family

Allowed locations:

- cover artwork;
- imagery;
- illustration;
- local light;
- one border region;
- small gradient;
- card preview art;
- page-specific atmosphere.

Do not casually recolor:

- core navigation;
- article body typography;
- permanent brand neutrals;
- all CTAs;
- global logo.

Critical rule:

Do **not** create a simplistic service taxonomy such as:

`AI = purple / Automation = blue / Websites = gold / Cases = orange`.

Color should be earned by the specific content/project/art direction, not assigned like a school category system.

---

## 14. PAGE-FAMILY HYPOTHESES — NOT LOCKS

These remain useful future hypotheses only.

### Homepage

Broadest brand DNA:

Obsidian + approved Cube + warm UI + event-driven spectral machine energy + future dark/light rhythm.

### AI Systems

Potentially colder bias:

- more spectral/ice atmosphere;
- same Obsidian/material foundation;
- Champagne remains mostly UI.

Do not make a generic purple AI page.

### Premium Websites

Potentially warmer/editorial:

- Warm Pearl;
- Champagne;
- Black Chrome;
- more frequent inverse/light surfaces.

### Automation

Possible Steel/Mineral undertone later.

Do not permanently lock a third brand accent now.

### Cases

ProAI shell remains stable.

Case art may use project-derived contextual tint.

### Articles / Insights

Stable neutral reading body.

Flexible contextual cover/art tint.

---

## 15. TYPOGRAPHY COLOR DIRECTION

Visual Lab compared:

- flat soft white;
- balanced warm→cool pearl;
- warm pearl;
- cool silver.

Current preference:

**balanced pearl**, but so subtle that it reads as a sophisticated soft white rather than obvious gradient text.

Reference Hero H1 family:

approximately:

`#F3F1EC → #E7E5DF → #D2D6DA`

Rule:

If the viewer consciously notices “gradient text” as an effect, reduce the gradient.

Do not color ordinary H1 words Spectral Indigo merely to advertise AI.

---

## 16. SPECTRAL ENERGY LEVELS — PRESERVE AS RESEARCH

Visual Lab levels:

- 0%: monochrome
- Low: alpha approximately `.07–.10`
- Medium: approximately `.14–.20`
- High: localized peak approximately `.28–.34`
- Too High: intentionally demonstrates AI-template/gaming boundary

Independent recommendation:

For idle Hero, stay closer to **very low / low** spectral visibility.

For a real machine/semantic event, local spectral energy may temporarily move toward **medium**.

Do not permanently sit at High.

Color intensity should be controlled by **location and event state**, not a simplistic universal percentage budget.

---

## 17. WARM ENERGY LEVELS — PRESERVE AS RESEARCH

Visual Lab studied:

- none;
- subtle metallic reflection;
- CTA-only warm material;
- local warm scene light;
- too much warm wash.

Preferred interpretation:

- Champagne is strongest as tactile UI/material first;
- occasional restrained warm scene reflection is acceptable;
- broad warm wash quickly changes category toward lifestyle/luxury.

---

## 18. ACCESSIBILITY / CONTRAST REFERENCE

Visual Lab representative checks:

- H1 `#E7E5DF` on `#050607`: about `16.10:1`
- Body `#A6ABB1` on `#050607`: about `8.77:1`
- Eyebrow `#C0C3C6` on `#050607`: about `11.46:1`
- Muted `#858A90` on `#050607`: about `5.83:1`
- Inverse primary `#111315` on `#F2EFE8`: about `16.21:1`
- Inverse body `#62666B` on `#F2EFE8`: about `5.03:1`
- Warm CTA ink `#111315` on `#E0D6C5`: about `12.94:1`
- Dark-control text `#E9EBED` on `#090B0E`: about `16.49:1`
- Champagne `#C7A768` on `#050607`: about `8.84:1`

Treat these as sanity/reference checks, not final accessibility certification, because production backgrounds may include gradients, live PBR reflections and spatial lighting.

---

## 19. HISTORICAL CYAN STATUS

Old ProAI cyan such as:

- `#5DE2FF`
- `#8EE7FF`

is **not a protected current brand lock**.

Retained principle:

> color as controlled signal, not decoration.

Do not casually restore bright cyan-heavy Hero/UI language.

Muted teal/ice/steel remain available only when they serve the new functional architecture.

---

## 20. WHAT IS DURABLE VS WHAT IS NOT YET LOCKED

### Durable foundations

- owner-approved Cube material anchors;
- Neutral Obsidian structural hierarchy;
- black-on-black value/material grammar;
- Warm Pearl/Frost inverse capability;
- Human/UI warm vs Machine/AI cool functional separation;
- contextual tint concept;
- restrained partial-edge/specular language;
- dark-first, not dark-only;
- Monochrome Control as permanent quality benchmark.

### Strong current working candidates

- A / Obsidian Spectrum as main direction;
- event-driven Spectral Indigo/Ice;
- Warm Pearl Primary CTA;
- Champagne partial edge around 25–30%;
- Smoked neutral Secondary CTA;
- balanced pearl H1;
- Warm Pearl `#F2EFE8` inverse foundation.

### Keep in research, not production-lock yet

- exact Hero background gradients;
- exact permanent spectral idle intensity;
- Copper/Amber as permanent UI;
- Mineral Black as global identity;
- C / Cold Spectral as main Hero;
- broad warm atmospheric wash;
- service-specific color taxonomy;
- Automation permanently assigned to Steel Blue;
- contextual page-family colors before each actual page is designed.

---

## 21. FUTURE AGENT RETRIEVAL RULE

If the owner says any version of:

- “посмотри нашу библиотеку цветов”;
- “какие цвета мы сохраняли?”;
- “какие у нас были оттенки?”;
- “что можно использовать для кейса/статьи/страницы?”;
- “what is the ProAI color library?”;
- “what colors did we research?”;

then future agents should read **this document first**.

Then, if deeper visual provenance is needed, inspect:

1. `docs/site-evolution/PROAI_BRAND_COLOR_ARCHITECTURE_RESEARCH_LIBRARY_2026-08-12.md`
2. `docs/site-evolution/brand/proai-brand-color-ui-lab-r1/REPORT.md`
3. the 16 PNGs in `docs/site-evolution/brand/proai-brand-color-ui-lab-r1/review/`

Do not restart broad color benchmark research from zero unless a genuinely new problem lacks evidence.

---

## 22. NEXT USE OF THIS LIBRARY

Do not create another color research task now.

Current useful sequence is:

1. finish and owner-approve the current Cube Semantic Brand Moment independently;
2. retain pearl/silver semantic typography first;
3. later use this library during Background / Spatial Integration;
4. test Obsidian Spectrum against the **live Three.js Cube**;
5. calibrate spectral energy as localized/event-driven environment response;
6. only after owner approval create a separate final production Brand System/token specification.

Do not let this library modify active Cube Geometry/Motion/Materials without a separate explicit task.

---

## 23. PERMANENT PRESERVATION RULE

Do NOT delete this document when final production colors are later chosen.

Do NOT erase unused alternatives.

Future exact production tokens should be stored in a separate owner-approved Brand System document.

This library intentionally preserves:

- accepted direction;
- alternatives;
- rejected/upper-bound studies;
- page/context possibilities;
- exact useful HEX values;
- functional color logic.

That allows future ProAI pages, cases, articles, campaigns and redesigns to reuse prior research without losing the brand's explored color vocabulary.
