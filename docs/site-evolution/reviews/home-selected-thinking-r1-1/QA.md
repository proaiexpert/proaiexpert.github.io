# Selected Thinking / Insights — Editorial Decision Desk R1.1 QA

Base R1 product: `aaab87b4218c287678b5204260693a3449c0bb22`

R1 reference review: `8feb661bc5711e1d824fea956e614731a03b7aad`

R1.1 product: `762303ee5459190dd1451ab2850c34d6390e6d1e`

## Scope gates

- Additive correction only: `assets/css/home-selected-thinking-r1-1.css`
- R1 component markup changed: NO
- R1 content changed: NO
- Desktop R1 CSS changed: NO
- Main changed: NO
- Merge: NO
- Deploy: NO

## Premium hierarchy gates

- 01 flagship dominance: PASS
- 02/03 secondary decision index: PASS
- Three equal mobile blocks: NO
- Signature decision rail: PASS
- Generic card treatment: NONE
- Cyan / neon / glow / glass: NONE added
- Landscape-specific treatment: PASS
- RU parity: PASS
- Horizontal overflow: 0px throughout required matrix
- Clipped title / framework / CTA nodes: NONE in browser scan
- Touch target: archive CTA 44px; lead/support title zones remain broad linked targets
- One-shot motion ownership: retained from R1; R1.1 only adjusts mobile reveal timing
- Post-entry stillness: PASS; no looping or ambient animation added
- Reduced motion: PASS; R1 reduced-motion contract remains authoritative and R1.1 adds no continuous motion

## Required viewport matrix

| Viewport | EN | RU | EN section height | RU section height | EN overflow | RU overflow |
|---|---|---|---:|---:|---:|---:|
| 1440×900 | PASS | PASS | 876px / 0.974vh | 868px / 0.964vh | 0px | 0px |
| 1366×768 | PASS | PASS | 865px / 1.126vh | 888px / 1.157vh | 0px | 0px |
| 1024×768 | PASS | PASS | 901px / 1.173vh | 946px / 1.231vh | 0px | 0px |
| 430×932 | PASS | PASS | 1154px / 1.238vh | 1145px / 1.228vh | 0px | 0px |
| 393×852 | PASS | PASS | 1145px / 1.344vh | 1131px / 1.328vh | 0px | 0px |
| 390×844 | PASS | PASS | 1143px / 1.354vh | 1144px / 1.356vh | 0px | 0px |
| 375×812 | PASS | PASS | 1134px / 1.396vh | 1136px / 1.399vh | 0px | 0px |
| 320×568 | PASS | PASS | 1022px / 1.798vh | 1029px / 1.812vh | 0px | 0px |
| 844×390 | PASS | PASS | 537px / 1.378vh | 537px / 1.378vh | 0px | 0px |
| 932×430 | PASS | PASS | 554px / 1.287vh | 532px / 1.237vh | 0px | 0px |

`vh` means viewport-height multiples, not CSS `vh` units.

## R1 → R1.1 density comparison

| Viewport | EN R1 | EN R1.1 | RU R1 | RU R1.1 |
|---|---:|---:|---:|---:|
| 390×844 | 1.440 | 1.354 | 1.450 | 1.356 |
| 320×568 | 2.162 | 1.798 | 2.210 | 1.812 |
| 844×390 | 3.204 | 1.378 | 3.356 | 1.378 |
| 932×430 | 2.147 | 1.287 | 2.263 | 1.237 |

Desktop measurements are unchanged from R1 at 1440×900, 1366×768 and 1024×768.

## A/B verdict

TAKE R1.1.

1. Mobile now reads as one flagship feature followed by a compact decision index.
2. 320px and landscape density improve materially without clipping, hiding article content, or horizontal scroll.
3. Desktop and article content remain locked to R1.
