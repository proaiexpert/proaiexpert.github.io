# ProAI Expert — Brand Color / UI Visual Lab R1

Status: isolated visual decision lab. No production integration.

## Repository state

- Repository: `proaiexpert/proaiexpert.github.io`
- Branch: `agent/proai-brand-color-ui-lab-r1`
- Base/control commit: `c37dab13663007b6307fdea74e53c3990131720c`
- Exact visual-evidence commit: `dea7e84e7119bf911e438837d46ede0cc5c6a4a0`
- Prototype path: `docs/site-evolution/brand/proai-brand-color-ui-lab-r1/`
- Cube evidence source: Materials + Lighting R1, commit `d17806da42275db617d8a46b231a2d877706a179`
- Static Cube evidence is copied only inside this isolated lab; original evidence is not edited.

## Scope and locks

This lab converts the owner-approved color research library into visible comparison boards. It does not modify `/index.html`, `/ru/index.html`, shared Header/Logo production files, Cube geometry, Cube mechanics, Presentation Motion R1.2, Materials + Lighting R1, or Semantic Display work.

Locked Cube anchors remain Graphite `#242A31`, Gunmetal `#2B323A`, Black chrome `#181D23`, Smoked core `#0C0F13`.

## Hero variants

All A/B/C/D variants use the same locked EN copy, composition, CTA positions, and Cube scale. Only art-direction variables change.

### A — Obsidian Spectrum Balanced

- Base: `#020304 → #050607 → #090B0E`
- H1: warm-neutral pearl to cool pearl, approximately `#F3F1EC → #E7E5DF → #D2D6DA`
- Eyebrow: `#C0C3C6`
- Body: `#A6ABB1`
- Primary CTA: warm pearl `#F3EEE4 → #E0D6C5`
- CTA edge: `#C7A768 / #D8BD84 / #9A6F38`
- Machine energy: `#676BFF / #5B50FF / #9BA8FF`
- Idle energy: low, localized and asymmetrical
- Event energy: stronger local spectral plane; UI remains neutral/warm

### B — Black Champagne / Warmer

- Structural black: neutral/warm carbon blend around `#030302 / #090705`
- H1: warmer pearl around `#F4F0E7 / #DED9D0`
- Primary CTA: warm pearl / champagne physical
- Atmospheric spectral presence: near zero
- Warm local reflection: restrained `#C7A768`

Purpose: test whether warmer editorial/executive character improves trust without drifting to hospitality/lifestyle luxury.

### C — Cold Spectral / More Machine

- Cool black family: `#020306 / #05070A / #090D12`
- H1: cooler pearl `#F3F5F7 → #D5DAE0`
- Primary CTA: black chrome
- Spectral local field: materially stronger `#5B50FF / #676BFF / #9BA8FF`
- Purple is not used for the H1 or primary button fill.

Purpose: test the upper credible machine-energy boundary before generic AI/gaming drift.

### D — Monochrome Control

- Neutral Obsidian only
- Silver/pearl typography
- Neutral pearl Primary CTA
- No meaningful chromatic energy

Purpose: control sample to determine whether color adds real value beyond the Cube/material system.

## Button recipes

### Primary A — Neutral Pearl

`linear-gradient(180deg,#F2F3F3,#D9DDE0)` with dark ink `#111315`, neutral specular, 10–12 px radius.

### Primary B — Warm Pearl / Champagne

`linear-gradient(180deg,#F3EEE4 0%,#ECE5D8 46%,#E0D6C5 100%)`

- text `#111315`
- border approximately `rgba(216,189,132,.38)`
- top inner specular `rgba(255,250,240,.72)`
- local lower/right edge using `#C7A768 → #D8BD84 → #9A6F38`
- no full perimeter glow

### Primary C — Black Chrome

`linear-gradient(180deg,#1A2027,#0D1116)` with pearl text and optional local neutral/spectral specular only.

### Secondary A — Smoked Hairline

`rgba(255,255,255,.052) → rgba(255,255,255,.016)` with low-alpha neutral border.

### Secondary B — Smoked + Champagne Edge

Same smoked surface; only a short local champagne edge is added on active/hover/focus.

### Secondary C — Smoked + Neutral Specular

Same component structure with a neutral silver specular edge.

### States

- Hover: `translateY(-1px)`, slight luminance/border increase
- Pressed: approximately `.985` scale, subtle inset depth
- Focus: visible two-stage ring; warm UI family is used instead of spectral machine color
- Disabled: reduced luminance, no local edge, no glow

No looping shimmer and no neon treatment.

## Partial-edge study

Compared visually: no edge; ~25% lower edge; ~40% lower edge; corner/specular intersection; separate spectral machine-state edge.

Working conclusion: 25–40% can feel materially intentional; full perimeter color becomes decorative. Champagne is more suitable for UI state; spectral is better reserved for machine/atmospheric context.

## Black hierarchy

Neutral Obsidian primary structure:

- Black 0 / void: `#020304`
- Black 1 / page: `#050607`
- Black 2 / surface: `#090B0E`
- Black 3 / panel: `#0E1217`
- Black 4 / card: `#171C22`

Alternative strips retained for comparison:

- Cool Graphite Black: `#020306 #05070A #090D12 #10161D #18212A`
- Mineral Black: `#020403 #050806 #09100C #101712 #18211B`
- Warm Carbon: `#040302 #070605 #0C0A08 #14110E #1D1814`

## Light / inverse capability

Primary inverse foundation: `#F2EFE8`; alternative bright inverse: `#F5F4F0`.

- Primary ink: `#111315`
- Secondary/body: `#62666B`
- Black-chrome contrast cards retained
- Dark-mode warm-pearl Primary CTA inverts to black chrome on light surfaces
- Champagne remains a small material/state detail
- Spectral energy remains mostly in imagery/special spatial context

## Contextual tint examples

The lab uses the same component structure with contextual art layers based on Spectral Indigo, Champagne/Amber, Mineral Green/Teal, Steel Blue, Copper and Neutral Monochrome. These are not new global brand colors; they are future case/article/page-context art directions.

The article demonstration separates a strong contextual cover from a stable neutral reading surface.

## Energy level study

Spectral machine-energy samples:

- 0%: monochrome
- Low: roughly alpha `.07–.10`
- Medium: roughly `.14–.20`
- High: localized peak `.28–.34`
- Too High: intentionally demonstrates the gaming/AI-template boundary

Warm-energy samples:

- none
- subtle metallic reflection
- CTA-only warm material
- local warm scene light
- too much warm wash

Working read: champagne is strongest as tactile UI/material first. Occasional warm scene reflection is possible, but broad warm wash quickly shifts toward lifestyle/luxury. Spectral energy can safely be stronger than early R1 research assumed if geography remains tight.

## Typography study

Compared: flat soft white; subtle warm→cool pearl; warmer pearl; cooler silver. No colored words and no obvious gradient text.

## Accessibility checks

Measured key contrast ratios against working backgrounds:

- H1 `#E7E5DF` on `#050607`: **16.10:1**
- Body `#A6ABB1` on `#050607`: **8.77:1**
- Eyebrow `#C0C3C6` on `#050607`: **11.46:1**
- Muted `#858A90` on `#050607`: **5.83:1**
- Inverse primary `#111315` on `#F2EFE8`: **16.21:1**
- Inverse body `#62666B` on `#F2EFE8`: **5.03:1**
- Warm CTA ink `#111315` on `#E0D6C5`: **12.94:1**
- Dark-control text `#E9EBED` on `#090B0E`: **16.49:1**
- Champagne `#C7A768` on `#050607`: **8.84:1**

## Responsive notes

- Main Hero comparison targets desktop 1440×900 and mobile 390×844.
- A/B/C/D use the same responsive composition rules.
- Mobile preserves the same CTA pairing and semantic hierarchy.
- The temporary top chrome is explicitly labeled as a color-lab placeholder, not a Header design.

## Review artifacts

Required owner-review PNGs are stored in `review/`:

1. `hero-a-desktop.png`
2. `hero-a-mobile.png`
3. `hero-b-desktop.png`
4. `hero-b-mobile.png`
5. `hero-c-desktop.png`
6. `hero-c-mobile.png`
7. `hero-d-desktop.png`
8. `hero-d-mobile.png`
9. `button-lab.png`
10. `black-hierarchy.png`
11. `light-inverse.png`
12. `page-family-board.png`
13. `contextual-tint-board.png`
14. `spectral-energy-study.png`
15. `warm-energy-study.png`
16. `typography-study.png`

The live browser prototype and the committed owner-review PNG set use the exact owner-approved Materials + Lighting R1 static image copied into this isolated lab. The copied image blob SHA is `4f462472177bf8c9423019a0ee2a50603ae34542`, identical to the approved evidence source blob. No active Cube/Semantic implementation was modified or duplicated.

## Builder self-assessment / ranking

1. **A — Obsidian Spectrum Balanced.** Strongest overall; warm tactile controls and medium localized spectral energy solve different jobs while Cube remains dominant.
2. **B — Black Champagne / Warmer.** Most executive and tactile; risk is reduced AI/system character if spectral energy disappears entirely.
3. **D — Monochrome Control.** Highly credible and premium, but less memorable/ownable than A.
4. **C — Cold Spectral / More Machine.** Useful as upper-bound evidence; at this intensity it starts to approach familiar contemporary AI language.

## Owner decision questions — direct answers

1. **Which Hero system looks most $100k+?** A — Obsidian Spectrum Balanced.
2. **Does champagne improve the UI or make it too luxury/lifestyle?** It improves UI when confined to warm-pearl controls, focus/selected detail and partial edges. Broad scene wash is where lifestyle drift begins.
3. **Does spectral energy improve brand memorability or become too AI-like?** Medium localized energy improves memorability. Strong overall cold bias becomes too category-generic.
4. **Is monochrome already strong enough?** Yes as a quality baseline, but it is less ownable than A.
5. **Should future ProAI support dark/light inversion?** Yes. Dark-first should not become dark-only.
6. **Does contextual tint look coherent enough for future cases/articles?** Yes, if component grammar, typography, borders and reading surfaces stay stable while tint is limited to cover/art/light context.
7. **Ready implementation candidates:** Neutral Obsidian five-level hierarchy; Warm Pearl Primary CTA + partial champagne edge; Smoked Secondary CTA; neutral pearl text hierarchy; Medium localized Spectral Indigo/Ice Cube event; inverse `#F2EFE8` + black chrome; contextual tint rule for later content.
8. **Keep only in research for now:** Copper/Amber as permanent UI; Mineral Black as global identity; full C cold-spectral Hero; High/Too-High spectral levels; broad warm atmospheric wash; service-specific color taxonomy; page-family bias hypotheses until those pages are in scope.

## Final lab recommendation

Do not production-lock a full brand system from this lab alone. The strongest Hero implementation candidate is **A — Obsidian Spectrum Balanced**, narrowly interpreted as neutral Obsidian structure + owner-approved Cube materials unchanged + warm-pearl/champagne primary controls + smoked neutral secondary controls + neutral typography + Medium localized Spectral Indigo/Ice near the Cube. Preserve light/inverse capability for future brand-system work.

Stop after owner review. No production integration is authorized by this lab.
