# QA Checklist (v2)

Full acceptance checklist. Each section states what to inspect, how to test, pass criteria, fail examples, and required evidence. A site/page is not "launch ready" until every applicable section passes with evidence attached. Use `MOBILE_QA.md` for the detailed 20-check mobile viewport protocol.

## 1. Repository QA

- Inspect: git status, branch, HEAD vs origin/main.
- How to test: `git status`, `git rev-parse HEAD`, `git rev-parse origin/main`.
- Pass: working tree clean, local HEAD equals origin/main HEAD (or explicitly ahead by the intended unpushed commit).
- Fail example: dirty worktree with unexplained changes; local HEAD diverges from origin/main with no plan to reconcile.
- Evidence: paste command output in the report.

## 2. Content Safety QA

- Inspect: all public-facing copy across every page.
- How to test: full-text search (grep/ripgrep) across the built HTML for the forbidden-terms list below.
- Pass: zero unapproved hits.
- Fail example: "licensed and insured" appears with no confirmed license/insurance fact backing it.
- Evidence: search command + output (or "0 matches") pasted into report.

### Forbidden Public Terms Search

Search for (case-insensitive) and flag any hit that is NOT covered by an allowed exception below:

- Demo site
- Demo website concept
- before launch
- Request Review
- Repair Review
- Start a Repair Request
- Send Photos for Review
- LOCAL REQUEST REVIEW
- Completed Projects
- Recent completed projects
- Our completed work
- Portfolio
- Lorem ipsum
- TODO
- FIXME
- coming soon
- Google reviews
- 5-star
- warranty
- insured
- Request a Free Estimate
- free estimate
- free consultation
- reviews
- ratings
- licensed and insured

### Allowed Exceptions

- These terms may appear in internal docs (this factory's own documentation) as guardrail references — the search above applies to PUBLIC page content only, not to docs/website-production-factory/*.
- "demo" is allowed in URLs, internal notes, or sample-context copy that is clearly labeled as such (e.g. a footer note on an actual demo site stating it is a demonstration).
- "licensed trade specialist or contractor" is allowed only inside a scope-disclaimer sentence (e.g. "some work may require a licensed trade specialist or contractor") — never as a direct claim about the business itself.
- "guaranteed" is allowed only in a no-guarantee context (e.g. "pricing is not guaranteed until scope is confirmed").
- No fake completed projects, no fake reviews/ratings, no fake license/insured/warranty claims, no guaranteed outcomes — these remain hard fails regardless of exact wording used.
- For full compliance policy on demo/testbed wording, pricing, service-area, and regulated-niche content, also see `LOCAL_SERVICE_GUARDRAILS.md`.

## 3. Navigation QA

- Inspect: header nav, footer nav, mobile hamburger nav.
- How to test: click every nav link on desktop and mobile; verify destination matches label.
- Pass: every nav item resolves to the correct page, no dead ends, hamburger opens/closes cleanly.
- Fail example: nav link labeled "Pricing" routes to "Services".
- Evidence: list of nav links tested with resolved destination.

## 4. Link QA

- Inspect: header links, footer links, CTA links, city links, form/request links.
- How to test: crawl or manually click every link; check HTTP status.
- Pass: 0 broken links (no 404s, no dead anchors).
- Fail example: a city page link 404s because the page was renamed.
- Evidence: link-check tool output or manual list with statuses.

## 5. Form / CTA QA

- Inspect: every CTA button and form on every page.
- How to test: submit a test form entry (in staging), verify all required fields validate, verify the destination/handler is correct.
- Pass: form submits successfully, validation works, confirmation shown, data reaches intended destination.
- Fail example: form submits with no confirmation, or errors silently.
- Evidence: screenshot of confirmation state + submission log if available.

## 6. Desktop Visual QA

- Inspect: header/nav, hero, cards, footer at common desktop widths (1440/1280/1024).
- How to test: rendered screenshot at each width.
- Pass: header complete and visible, hero clear and conversion-focused, cards aligned without clipping, footer compact and complete.
- Fail example: cards overlap or hero text is clipped at 1024px.
- Evidence: screenshot per width.

## 7. Tablet QA

- Inspect: grid collapse, nav usability, CTA readability at ~768px.
- How to test: rendered screenshot at 768px (portrait) and 1024px (landscape).
- Pass: grids collapse cleanly, nav remains usable, CTA buttons remain readable and tappable.
- Fail example: a 3-column grid overflows horizontally at 768px.
- Evidence: screenshot per width.

## 8. Mobile QA Cross-Reference

- Inspect: all 20 checks in `MOBILE_QA.md` at all required widths.
- How to test: follow `MOBILE_QA.md` protocol exactly (rendered QA, not curl-only).
- Pass: all 20 checks pass at all required portrait and landscape widths.
- Fail example: any single check fails at any single required width — this blocks launch.
- Evidence: `MOBILE_QA.md` pass/fail report template, fully filled out.

## 9. Accessibility Basics

- Inspect: viewport meta tag, landmark elements (header/nav/main/footer), button labels, focus states, FAQ controls.
- How to test: manual keyboard tab-through; inspect DOM for landmarks and aria attributes.
- Pass: viewport meta present, landmarks present, all interactive elements have visible focus states and accessible labels, FAQ accordions operable via keyboard.
- Fail example: hamburger button has no aria-label and no visible focus ring.
- Evidence: list of elements checked with pass/fail per item.

## 10. SEO / Noindex / Sitemap / Robots QA

- Inspect: `robots.txt`, `sitemap.xml`, per-page meta robots tags, title/meta description uniqueness.
- How to test: fetch robots.txt and sitemap.xml directly; view-source each page's `<head>`.
- Pass: demo/pre-launch sites carry `noindex, nofollow` as intended; launched sites have correct indexable state, unique titles/descriptions, and an accurate sitemap.
- Fail example: a demo site is missing noindex and is publicly indexable before intended launch.
- Evidence: robots.txt content, sitemap.xml content, per-page meta robots snippet.

## 11. Performance Basics

- Inspect: image sizes, blocking scripts, unnecessary large files.
- How to test: check network payload sizes in rendered QA pass; flag any single image over ~500KB or unnecessary render-blocking script.
- Pass: images reasonably sized/compressed, no unnecessary blocking scripts.
- Fail example: a 4MB unoptimized hero image on the homepage.
- Evidence: list of oversized assets found (or "none found").

## 12. Deployment / Cache QA

- Inspect: local source HEAD vs origin/main vs live cache-busted content.
- How to test: follow `DEPLOYMENT_QA.md` git + live-check commands.
- Pass: source HEAD equals origin/main equals live cache-busted content markers.
- Fail example: live CSS still shows the pre-fix rule because of Fastly/GitHub Pages caching.
- Evidence: git rev-parse outputs + cache-busted curl/browser output.

## 13. GitHub Pages / Fastly Live Verification

- Inspect: actual rendered live page, not just curl'd HTML.
- How to test: rendered screenshot of the live URL (with cache-busting query param) at both desktop and mobile widths.
- Pass: rendered live page visually matches the intended fix/build; no stale cached asset artifacts.
- Fail example: curl shows the new HTML but the rendered page still shows old CSS due to a cached stylesheet.
- Evidence: rendered screenshot of the live cache-busted URL.

## 14. Reveal / Animation QA

- Inspect: any element using `.reveal` or scroll-triggered animation classes.
- How to test: load the page with JavaScript disabled (or throttled/blocked) and confirm content is visible; then re-enable JS and confirm the animation is additive, not gating.
- Pass: `.reveal` is visible by default; only the descendant selector `html.js .reveal` (never the compound `html.js.reveal`, a common typo) may hide content pre-animation; reduced-motion fallback resolves to visible content; no-IntersectionObserver fallback resolves to visible content; a timeout fallback force-reveals content if the observer never fires; animation enhances content but is never required to reveal it; no content ships hidden-until-JS-succeeds.
- Fail example: `.reveal` content stays invisible when JavaScript fails to load or the IntersectionObserver never fires.
- Evidence: screenshot with JS disabled/blocked showing content still visible, plus confirmation of the exact CSS selector used (`html.js .reveal`, not `html.js.reveal`).

## 15. Final Acceptance Report

A site/page is launch-ready only when all of the following are true and documented:

- All sections above pass with evidence attached.
- Content Safety QA returns zero unapproved forbidden-term hits.
- Mobile QA Cross-Reference passes all 20 checks at all required widths.
- Reveal / Animation QA confirms fail-open behavior with no gated content.
- Deployment QA confirms source, origin/main, and live cache-busted content all match.
- No known risk is left undocumented — anything not fully resolved is listed explicitly as a remaining risk, not silently omitted.

### Quick Reference Report Checklist

For a fast pre-push sanity pass (in addition to, not instead of, the full sections above), confirm:

- Files checked.
- Viewports tested (desktop / tablet / mobile).
- Screenshots captured or not captured (state why if not).
- Interactions tested (nav, hamburger, forms, CTAs, accordions).
- Issues found.
- Issues fixed.
- Issues intentionally not fixed.
- Remaining risks.
