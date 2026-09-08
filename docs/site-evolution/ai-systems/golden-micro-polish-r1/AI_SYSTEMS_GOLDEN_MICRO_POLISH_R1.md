# AI Systems — Golden Micro Polish R1

## Status

MICRO UI POLISH COMPLETE — product implementation unchanged after QA.

## Authority / heads

- Source recovery HEAD: `cd12f083acc90bfb746a3d430dcc1342b61d995e`
- Implementation candidate HEAD: `bae5e290d11bec7ebf18e6963e769265e1abc2f6`
- Final product / visual implementation HEAD: `bae5e290d11bec7ebf18e6963e769265e1abc2f6`
- Product review branch: `review/ai-systems-golden-micro-polish-r1`
- The commit that adds this report is documentation-only. The exact resulting review-branch HEAD is recorded in the Owner handoff after commit creation; the visual implementation remains exactly `bae5e290...`.

Comparison `cd12f083... → bae5e290...` contains exactly one product file change:

`owner-preview/ai-systems-golden-recovery-r1/ai-systems-golden-recovery-r1.css`

No Header, Footer, copy, page structure, Hero visual, Financial Stream, reference implementation, or production/main files changed.

## White-on-white forensic root cause

The original R3 button layer defines:

- `.ai-r3-btn { border-radius: 999px; color: var(--r3-pearl); ... }`
- `.ai-r3-btn--primary { background: var(--r3-pearl); color: #07090b; }`

The recovered R1 core also defines the more specific page-wide anchor rule:

- `.ai-r1-page a { color: inherit; }`

On the recovered page, the inherited page text color is pearl. Because `.ai-r1-page a` has greater specificity than `.ai-r3-btn--primary`, Section 08 could compute to pearl text on the pearl primary background. Real Chrome reproduced the defect as `rgb(242,240,235)` text on `rgb(242,240,235)` background.

### Exact correction

The micro-polish adds only page-scoped CTA selectors in the recovery adapter:

- `body.ai-r1-page.ai-r3-page .ai-r3-hero .ai-r3-btn.ai-r3-btn--primary`
- the same Hero primary selector for `:link` and `:visited`
- `body.ai-r1-page.ai-r3-page .ai-r3-hero .ai-r3-btn:not(.ai-r3-btn--primary)`
- the same Hero secondary selector for `:link` and `:visited`
- `body.ai-r1-page.ai-r3-page .ai-r3-cta .ai-r3-btn.ai-r3-btn--primary`
- the same Section 08 primary selector for `:link` and `:visited`

These selectors explicitly restore the accepted clean-transplant CTA interaction grammar without importing Boxes Hover/donor geometry.

## CTA geometry and behavior

### Hero primary

- `border-radius: 9px`
- minimum / computed height: `50px`
- dark graphite/gunmetal vertical gradient
- pearl text in default/visited
- white text with lighter graphite gradient on hover/focus-visible/active
- focus-visible outline: `2px solid #A8B0FF`, offset `5px`
- pointer cursor

### Hero secondary

- text action, not a pseudo-button
- `border: 0`
- `border-radius: 0`
- transparent background
- silver text default/visited
- pearl + underline on hover/active
- focus-visible outline retained
- pointer cursor

### Section 08 CTA

- `border-radius: 9px`
- computed height: `50px`
- dark graphite gradient, intentionally quieter than Hero primary
- pearl/white text through default, visited, hover, focus-visible and active states
- focus-visible outline: `2px solid #A8B0FF`, offset `5px`
- pointer cursor

### Mobile secondary correction

Historical responsive R3 applies `width:100%` to every `.ai-r3-btn` below 520px. Golden Micro Polish R1 preserves the primary as the full-width touch target while restoring the Hero secondary to content width:

- Hero primary: `width:100%`
- Hero secondary: `width:auto; justify-self:start`
- Section 08 CTA: `width:fit-content`

Measured at 390px:

- EN Hero secondary width: about `101.5px`
- RU Hero secondary width: about `115.4px`

## Exhaustive interaction-state QA

Real Google Chrome, forced pseudo-state inspection using Chrome DevTools Protocol.

For every visible interactive control, the QA captured computed:

- color
- background / background-image
- border / border-radius
- opacity
- text-decoration
- outline
- width / height
- overflow
- pointer-events / cursor

States:

- DEFAULT
- HOVER
- FOCUS-VISIBLE
- ACTIVE
- VISITED for anchors

Controls covered:

- Header CTA
- Header locale
- Hero primary
- Hero secondary
- Section 08 CTA
- Footer CTA
- Footer email
- Footer navigation links
- Footer social links
- Footer locale
- mobile menu button where visible

### EN desktop — 1440×1100

- Result: PASS
- Exhaustive states: `70`
- HTTP: `200`
- horizontal overflow: `0`
- missing CSS: `0`
- missing JS: `0`
- fatal console errors: `0`
- request failures: `0`
- visible 999px `.ai-r3-btn` pills: `0`
- QA run evidence: GitHub Actions run `34203902881` / completed EN desktop case before the later serial timeout

### RU desktop — 1440×1100

- Result: PASS
- Exhaustive states: `70`
- HTTP: `200`
- horizontal overflow: `0`
- missing CSS: `0`
- missing JS: `0`
- fatal console errors: `0`
- page errors: `0`
- request failures: `0`
- visible 999px CTA pills: `0`

### EN mobile — 390×844

- Result: PASS
- Exhaustive states: `69`
- HTTP: `200`
- horizontal overflow: `0`
- missing CSS: `0`
- missing JS: `0`
- fatal console errors: `0`
- page errors: `0`
- request failures: `0`
- visible 999px CTA pills: `0`
- mobile menu button included in state matrix

### RU mobile — 390×844

- Result: PASS
- Exhaustive states: `69`
- HTTP: `200`
- horizontal overflow: `0`
- missing CSS: `0`
- missing JS: `0`
- fatal console errors: `0`
- page errors: `0`
- request failures: `0`
- visible 999px CTA pills: `0`
- mobile menu button included in state matrix

### EN landscape — 844×390

- Result: PASS
- Exhaustive states: `69`
- HTTP: `200`
- horizontal overflow: `0`
- missing CSS: `0`
- missing JS: `0`
- fatal console errors: `0`
- page errors: `0`
- request failures: `0`
- visible 999px CTA pills: `0`
- mobile menu button included in state matrix

### RU landscape — 844×390

- Result: PASS
- Exhaustive states: `69`
- HTTP: `200`
- horizontal overflow: `0`
- missing CSS: `0`
- missing JS: `0`
- fatal console errors: `0`
- page errors: `0`
- request failures: `0`
- visible 999px CTA pills: `0`
- mobile menu button included in state matrix

The five remaining viewports were executed as independent parallel jobs in GitHub Actions run `34266744278` on QA branch `qa/ai-systems-golden-micro-polish-matrix-r1`. All five jobs completed successfully.

## Preserved authority checks

### Header

UNCHANGED. No Header file or Header architecture change exists in the product diff.

### Footer

UNCHANGED. No Footer file or Footer architecture change exists in the product diff.

### Financial Stream

UNCHANGED and confirmed in every viewport:

- `EN + RU`
- `8.36K` EN / `8,36K` RU
- `52`

No old click figures or superseded indexed-page figures were reintroduced.

### Reference implementation

UNCHANGED and confirmed in every viewport:

- EN: `7 / 7 reference tests passing`
- RU: `7 / 7 reference-тестов проходят`

## Hosted candidate verification

Reliable Cloudflare mirror:

- EN: `https://ai-golden-recovery-preview.proaiexpert-github-io.pages.dev/owner-preview/ai-systems-golden-recovery-r1/`
- RU: `https://ai-golden-recovery-preview.proaiexpert-github-io.pages.dev/owner-preview/ai-systems-golden-recovery-r1/ru/`

Before the final matrix, the hosted micro-polish CSS was compared byte-for-byte against the candidate file.

SHA-256 both local candidate CSS and hosted CSS:

`56ebbd28e024e55de8deaa3926cd05e1d51d2b805cdbb4fc25ed7163f2997d0f`

The hosted file contains the `Golden Micro Polish R1` marker.

## Final conclusion

The CTA micro-polish is complete. The white-on-white cascade defect is fixed, the accepted 9px physical CTA geometry is restored, Hero secondary remains a text action, mobile secondary width is corrected, no 999px CTA pills remain, and all six required viewport/state gates pass in real Chrome. No product CSS change was required after `bae5e290d11bec7ebf18e6963e769265e1abc2f6`.
