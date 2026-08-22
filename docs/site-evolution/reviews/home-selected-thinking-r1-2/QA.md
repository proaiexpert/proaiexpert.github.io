# Selected Thinking / Insights — Editorial Decision Desk R1.2 QA

Base R1.1 product: `762303ee5459190dd1451ab2850c34d6390e6d1e`

R1.1 review: `b3875aca8d9290484ed6b805659dce3ed0b2f27a`

R1.2 product: `8a4e8a99fb2f74238c933dab5573cc563e5295fc`

## Scope gates

- Additive finish only: `assets/css/home-selected-thinking-r1-2.css`
- R1 / R1.1 product files modified: NO
- Component markup changed: NO
- Article content changed: NO
- Desktop architecture changed: NO
- Mobile architecture changed: NO
- Main changed: NO
- Merge: NO
- Deploy: NO

## Signature / motion gates

- Signature Decision Signal: PASS
- Entry choreography: PASS
- First animation sample: 0ms
- Last running-animation sample: 875ms
- Settled by: 900ms
- Running animations after 1.9s: 0
- Re-entry replay: 0
- Reduced motion running animations: 0
- Reduced motion title/rail complete immediately: PASS
- Lead hover signal width: 79.19px → 108px
- Lead hover title: white
- Support hover metadata / separator: strengthened
- Keyboard focus outline: solid / visible
- No looping motion / canvas / WebGL / runtime library: PASS

## Readability floors

- Smallest meaningful visible microtype: 8.25px
- Smallest body / summary: 10.75px
- No meaningful visible 5–7px product text remains in R1.2 mobile treatment.

## Required viewport matrix

| Viewport | EN | RU | EN section | RU section | Overflow | Broken assets |
|---|---|---|---:|---:|---:|---:|
| 1440×900 | PASS | PASS | 876px / 0.974 | 868px / 0.964 | 0px | 0 |
| 1366×768 | PASS | PASS | 865px / 1.126 | 888px / 1.157 | 0px | 0 |
| 1024×768 | PASS | PASS | 901px / 1.173 | 946px / 1.231 | 0px | 0 |
| 430×932 | PASS | PASS | 1125px / 1.207 | 1117px / 1.199 | 0px | 0 |
| 393×852 | PASS | PASS | 1116px / 1.309 | 1119px / 1.313 | 0px | 0 |
| 390×844 | PASS | PASS | 1114px / 1.320 | 1117px / 1.324 | 0px | 0 |
| 375×812 | PASS | PASS | 1105px / 1.360 | 1109px / 1.366 | 0px | 0 |
| 320×568 | PASS | PASS | 1018px / 1.792 | 1013px / 1.784 | 0px | 0 |
| 844×390 | PASS | PASS | 580px / 1.488 | 584px / 1.498 | 0px | 0 |
| 932×430 | PASS | PASS | 573px / 1.332 | 591px / 1.374 | 0px | 0 |

## Context gates

Founder → Thinking → Selected Work desktop: PASS.

Founder → Thinking → Selected Work mobile: PASS.

Context captures report horizontal overflow `0px`, broken assets `0`, and running animations `0` after settle.

## A/B verdict

TAKE R1.2.

1. Decision Signal and authored entry give the section a ProAI-specific signature while ending in full stillness.
2. R1.1 microtype weakness is corrected without losing the mobile density win.
3. Desktop geometry and content remain locked while hover/focus and contextual transitions gain finish.
