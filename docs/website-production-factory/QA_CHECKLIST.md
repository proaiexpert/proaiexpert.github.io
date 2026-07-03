# QA Checklist

Use this as the general production QA checklist. Use `MOBILE_QA.md` for detailed mobile viewport checks.

## Rendered QA Discipline
- Visual/layout changes require rendered browser verification.
- Reading source code is not enough for visual issues.
- Use screenshots for layout-sensitive changes.
- Prefer before/after screenshots when fixing visual regressions.
- Do not claim visual success without rendered evidence.

## Screenshot QA
- Capture screenshots for header, footer, sticky CTA, cards, image crops, overflow fixes, and mobile layout changes.
- Record the page URL, viewport, and what the screenshot proves.
- Use clean browser screenshots without browser chrome.
- Screenshots should support the final report, not replace written findings.
- If screenshots are not captured, state why and identify the remaining risk.

## Desktop
- Header/nav visible and complete.
- Hero clear and conversion-focused.
- Cards align and do not clip.
- Footer compact and complete.

## Tablet
- Grids collapse cleanly.
- Nav remains usable.
- CTA buttons remain readable.

## Mobile
- Check 430, 390, 375, 360, 320.
- Run detailed checks in `MOBILE_QA.md`.
- Hamburger opens/closes.
- Sticky CTA does not cover content.
- Cards stack cleanly.
- Footer stacks cleanly.
- No horizontal overflow.
- Content visible without JS.

## Browser / Interaction QA
- Header links.
- Footer links.
- CTA links.
- City links.
- Form/request links.
- Forms or request flows submit or fail safely when present.
- Hamburger opens and closes.
- Menu state is clear and `aria-expanded` is correct where applicable.
- Accordions, FAQs, reveal sections, and sticky CTAs behave as expected.
- Click-test important controls instead of relying only on DOM/source review.

## Smoke Test Before Push
- Page loads.
- No obvious console-breaking issue if checked.
- Key CTA works.
- Header/navigation works.
- Mobile layout is not broken.
- No horizontal overflow.
- No blank strip or unwanted right-side whitespace.

## Content Safety
- No fake reviews or ratings.
- No fake license/insured/warranty claims.
- No fake completed projects.
- No guaranteed outcomes.
- No "free estimate" or "free consultation" unless explicitly approved and true.

## Accessibility Basics
- Viewport meta.
- Landmarks.
- Button labels.
- Focus states.
- FAQ controls usable.

## Performance Basics
- Images sized reasonably.
- No unnecessary large files.
- No blocking scripts unless needed.

## Reveal/Animation
- `.reveal` visible by default.
- Hiding only under `html.js .reveal`.
- No `html.js.reveal`.
- Reduced-motion fallback.
- No-IntersectionObserver fallback.
- Timeout fallback.
- Core content remains visible if JavaScript fails.
- Animation enhances content; it must not be required to reveal core content.
- Do not ship hidden content that appears only if JavaScript succeeds.

## Deployment
- For source-vs-live, GitHub Pages, cache, CDN, asset-path, and deployment acceptance checks, run `DEPLOYMENT_QA.md`.

## Final QA Report
- Files checked.
- Viewports tested.
- Screenshots captured or not captured.
- Interactions tested.
- Issues found.
- Issues fixed.
- Issues intentionally not fixed.
- Remaining risks.
