# ProAI Expert Homepage V2 — Execution Status

Date: 2026-08-07
Repository: `proaiexpert/proaiexpert.github.io`
Production branch: `agent/homepage-v2-concept-a-build`
Production base: `7bcc09ae28388f8e4a5e6e5a715aa5ba7b3fbf50`
Current production head: `2eef87720d17ee30abc6cd4ac215c158940b2de0`
Technical status: **ACCEPT**
Owner visual status: **PENDING OWNER REVIEW**
PR / merge / deployment: **NOT PERFORMED**

## Scope integrity

The production diff from base to current head remains exactly the five approved Homepage V2 files:

- `index.html`
- `ru/index.html`
- `_includes/homepage-v2-en.html`
- `_includes/homepage-v2-ru.html`
- `assets/css/homepage-v2.css`

Current blobs at technical ACCEPT:

- `index.html` — `2200651ba29ea8eb8a5c9575cb59762b6c5a51ab`
- `ru/index.html` — `6abdb992970f1785a1599b4f20c53214e027b793`
- `_includes/homepage-v2-en.html` — `5dc8d46fa7fd5ac3c90a420f54ca24e77fba7ea1`
- `_includes/homepage-v2-ru.html` — `1c9b8dcbef8d9dc41d5d62b67deab8f0eae0e81e`
- `assets/css/homepage-v2.css` — `470d37b4c188241e4331707f16c05685d98dd868`

Documentation, QA workflows, and QA results remain isolated from the production branch.

## Verified production-equivalent build

Production-equivalent command and dependency contract were taken from the repository deployment workflow:

- Jekyll `4.3.4`
- `webrick`
- `jekyll build --source . --destination _site`

The final technical run against production head `2eef87720d17ee30abc6cd4ac215c158940b2de0` completed with:

- provenance — PASS
- Jekyll build — PASS
- generated EN/RU smoke validation — PASS
- Chromium installation — PASS
- generated site server — PASS
- browser targeted recheck — PASS

Final QA artifact ID: `9008952062`
Final QA run: `31217046101`

The preceding full technical run also verified the complete Contact runtime matrix, reciprocal metadata/route contracts, reduced motion, forced colors, live external targets, menu behavior, skip-link behavior, images, console/network state, and eight required viewports.

## Browser matrix at technical ACCEPT

The final recheck returned no issues for all required routes and viewports:

- EN — 1440 desktop — PASS
- RU — 1440 desktop — PASS
- EN — 390 portrait — PASS
- RU — 390 portrait — PASS
- EN — 320 portrait — PASS
- RU — 320 portrait — PASS
- EN — 844×390 landscape — PASS
- RU — 844×390 landscape — PASS

For every row in the final recheck:

- `scrollWidth == clientWidth`
- no visible element crossed the viewport
- no broken images were detected
- exactly ten Homepage V2 sections were present in the locked order
- no visible anchor/button was below the required 44×44 CSS-pixel hit area
- mobile menu smoke passed where applicable
- console/page/request failure arrays were empty

EN and RU Contact final-CTA smoke also passed with `private_review`, `homepage`, `homepage_final`, visible Private Review context, and `#project-intake`.

Reduced-motion and forced-colors smoke checks passed.

## Reproducible defects corrected

### HPV2-001 — RU Financial Stream proof clipping at 390/320

Observed on generated Chromium output from the initial production head `58b68a060de341b9b34727ae17325ba5abaa07b4`.

Actual behavior:
- RU Financial Stream proof content exceeded the viewport at 390 and 320.
- `overflow: clip` hid the excess rather than exposing horizontal scroll.
- the grid track retained intrinsic min-content pressure from the long RU proof heading.

Correction:
- remove intrinsic width pressure from the proof copy;
- use a bounded RU proof-heading mobile clamp.

Production correction commit:
`c791a6e5e4c1e15bd0328cd890a7f055fe589019`

Recheck:
PASS — RU 390 and RU 320 no longer crossed the viewport.

### HPV2-002 — Homepage shared Footer base stylesheet was not loaded

Observed in real generated-browser QA.

Actual behavior:
- Homepage included the shared Footer markup plus polish/foundation styles, but the wrapper did not load `assets/css/footer-system-v1.css`.
- footer controls consequently lost base geometry and several mobile hit areas rendered around 20px high.
- two Homepage Insights title links at 844×390 also had a 33px high hit area.

Correction:
- load the existing shared Footer base stylesheet from both Homepage wrappers;
- provide a 44px minimum hit area for Homepage Insights title links.

Production correction commits:
- EN: `e80275cbbb5893f2d0147b8027c4ccfeeff8e72c`
- RU/current at that stage: `8b1de793b82832a0595a17bee85f901911633979`

Recheck:
PASS for footer base geometry and Insights hit-area issue. A final short-link-width issue remained and was logged separately.

### HPV2-003 — short link hit areas narrower than 44px

Observed in the corrected full browser run at desktop and mobile/landscape sizes.

Examples:
- Header `HOME`, `ABOUT`, `КЕЙСЫ`, `О НАС`
- Footer `Кейсы`
- Footer social `X`

Actual height was 44px but width was below 44px for the shortest labels.

Correction:
- Homepage-scoped minimum width of 44px for shared Header nav anchors, Footer detail-group anchors, and Footer social anchors.
- no shared Header/Footer file was changed.

Production correction commits:
- EN: `3cc143c759e432957a23f4ae1af3a3c84b027b11`
- RU/current head: `2eef87720d17ee30abc6cd4ac215c158940b2de0`

Final recheck:
PASS — touch-target failure arrays are empty for all eight required viewport/locale rows.

## Full technical evidence accumulated before the final targeted recheck

The full corrected QA run before HPV2-003 proved:

- production provenance — PASS
- production-equivalent Jekyll build — PASS
- generated validation — PASS
- live targets — HTTP 200:
  - `https://financialstreamllc.com/`
  - `https://alinahorb.com/`
  - `https://proai-expert.com/handyman-vancouver-portland-demo/`
- exact ten-section order in EN and RU — PASS
- zero horizontal overflow after HPV2-001 — PASS
- images — PASS
- mobile menu open / Escape / outside-event / nav-link close — PASS
- Escape focus return — PASS
- skip-link focus, visibility, and focus transfer to `#main-content` — PASS
- all ten Homepage-to-Contact runtime mappings — PASS
- reduced motion — PASS
- forced colors — PASS

The only remaining failure in that full run was the narrow short-link hit area corrected by HPV2-003. The final run repeated the affected touch/overflow/image/menu checks and EN/RU smoke against the new production head and passed.

## Technical verdict

**Homepage V2 technical ACCEPT at `2eef87720d17ee30abc6cd4ac215c158940b2de0`.**

No additional reproducible technical defect is open from the approved P0 checklist.

This does not constitute owner visual approval, PR approval, merge approval, or deployment approval.

## Next gate

1. Owner visual review using the current EN/RU screenshots from the final technical run.
2. If the owner identifies specific premium-polish changes, implement only those changes without reopening accepted architecture or Concept A.
3. Re-run affected technical checks after any visual correction.
4. Obtain final owner visual approval.
5. Only with separate owner permission: create PR, merge, and deploy.
6. After Homepage release, proceed to the deferred Financial Stream showcase upgrade backlog and later whole-site audit.
