# Selected Thinking / Insights — Editorial Decision Desk R1.2.1 QA

Base R1.2 product: `8a4e8a99fb2f74238c933dab5573cc563e5295fc`

R1.2 review: `02515559c293cd31e84c872bc248041d8cc8d9d0`

R1.2.1 product: `122871724870c307167bb977f505b414f03c94d1`

## Scope gates

- Product delta: `_includes/home-selected-thinking-r1-en.html` and `_includes/home-selected-thinking-r1-ru.html` only.
- CSS changed: NO.
- JS changed: NO.
- Article pages changed: NO.
- Main changed: NO.
- Merge: NO.
- Deploy: NO.

## Editorial curation gates

- 01 Lead Response: PASS / unchanged.
- 02 Multilingual Website: PASS / replaces AI Agent homepage curation only.
- 03 Website Proposal: PASS / unchanged.
- Order locked: 01 Lead Response → 02 Multilingual Website → 03 Website Proposal.
- Article 02 EN reading time: 12 min read.
- Article 02 RU reading time: 17 мин чтения.
- Article 03 EN reading time: 13 min read.
- Article 03 RU reading time: 15 мин чтения.
- Article bodies modified: NO.
- Canonical article integrity: PASS because article page blobs are not part of the R1.2 → R1.2.1 product delta.

## Route / locale QA

All six curated article routes exist in the exact base/product tree:

- EN 01 `/insights/what-happens-after-a-lead-arrives/`
- EN 02 `/insights/does-your-service-business-need-a-multilingual-website/`
- EN 03 `/insights/how-to-evaluate-a-website-proposal/`
- RU 01 `/ru/insights/chto-proiskhodit-posle-zayavki/`
- RU 02 `/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/`
- RU 03 `/ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/`

Locale pairing is present in the canonical article sources via reciprocal `hreflang` and language links for Lead Response, Multilingual Website, and Website Proposal.

## Required viewport matrix

| Viewport | EN | RU | EN section | RU section | Horizontal overflow |
|---|---|---|---:|---:|---:|
| 1440x900 | PASS | PASS | 866px / 0.962 | 858px / 0.954 | 0px |
| 1366x768 | PASS | PASS | 854px / 1.112 | 858px / 1.118 | 0px |
| 1024x768 | PASS | PASS | 890px / 1.159 | 960px / 1.250 | 0px |
| 430x932 | PASS | PASS | 1125px / 1.207 | 1117px / 1.198 | 0px |
| 393x852 | PASS | PASS | 1115px / 1.309 | 1103px / 1.295 | 0px |
| 390x844 | PASS | PASS | 1113px / 1.319 | 1117px / 1.323 | 0px |
| 375x812 | PASS | PASS | 1104px / 1.360 | 1109px / 1.365 | 0px |
| 320x568 | PASS | PASS | 1017px / 1.790 | 1012px / 1.782 | 0px |
| 844x390 | PASS | PASS | 575px / 1.474 | 579px / 1.483 | 0px |
| 932x430 | PASS | PASS | 567px / 1.319 | 585px / 1.361 | 0px |

## Readability / motion gates

- Smallest mobile microtype: 8.25px.
- Smallest mobile body / summary: 10.75px.
- No typography shrinking was introduced for R1.2.1.
- 390×844 EN: 1.319 viewport heights.
- 390×844 RU: 1.323 viewport heights.
- 320×568 EN: 1.790 viewport heights.
- 320×568 RU: 1.782 viewport heights.
- 844×390 EN: 1.474 viewport heights.
- 844×390 RU: 1.483 viewport heights.
- Running animations after 1.9s on required captured desktop/mobile/landscape gates: 0.
- Broken assets in local committed-content review captures: 0.
- Horizontal overflow in all measured viewport/lang combinations: 0px.

## Visual gates

- 01 remains dominant: PASS.
- 02 title clipped: NO.
- 02 framework collision: NO.
- 03 remains subordinate: PASS.
- 390×844 EN/RU: PASS.
- 320×568 EN/RU: PASS.
- 844×390 EN: PASS.
- 1440×900 EN/RU: PASS.
- Founder → Thinking → Selected Work desktop/mobile context: PASS.

## Verdict

TAKE R1.2.1 for owner review.

The change is editorial curation only; R1.2 design, motion, Decision Signal, CSS/JS, and architecture remain frozen.
