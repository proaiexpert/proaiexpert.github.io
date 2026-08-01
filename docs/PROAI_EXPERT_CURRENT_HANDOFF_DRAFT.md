# DRAFT — becomes canonical only after PR #19 merge and SHA update.

## 1. Authority and Source of Truth
- **Repository:** proaiexpert/proaiexpert.github.io
- **Branch:** site-integration-owner-qa-phase-a-v2-clean
- **Baseline main SHA:** 0ced654687c840a304a0cc7ddab5eacf1e27dbec
- **PR #17 merged status:** Merged
- **PR #18 status:** Superseded/Closed
- **PR #19 status:** Draft
- **Current PR head SHA:** (Will be updated post-commit)

## 2. Completed Portfolio Core
- Archive
- Financial Stream
- Alina Horb
- Local Repair Pro
- Protected architecture/truth rules are strictly maintained.

## 3. Phase A Scope
- **Header:** Breakpoints repaired. Removed nested media queries and unused classes (`.is-mobile-state`, `.header-hidden`). Retained `.is-scrolled` and `.is-open`.
- **Navigation semantics:** Safe replacement of global parity CSS across all routes.
- **Homepage portfolio CTA:** Clean integration of Financial Stream CTA.
- **Main landmark:** Added `<main>` tags to EN and RU index.html.
- **Footer:** Correctly scoped to `.portfolio-page`. Restored exact text `PROAI EXPERT` for the centered `.f-backmark::after`, avoiding duplicate HTML strings.
- **Ending order:** Case study DOM cleanly resolved without regex; cross-case nav appears immediately before the final action chapter.
- **Alina rail:** Added missing newlines, preserved exact JS states (`.is-visible`, `.ivory-active`).
- **Name correction:** "Татьяна Горб" fixed in RU Financial Stream.

## 4. QA Evidence
- **Encoding:** Verified UTF-8 without BOM.
- **DOM:** All nested navigation loops and orphaned `</section>` fragments from PR 18 are eliminated.
- **Duplicate navigation:** Confirmed only 1 `.case-cross-nav` block exists per case file.
- **Responsive widths:** Checked at 1440, 1180, 1100, 1024, 980, 768, 390. No dead zones between desktop/mobile menus.
- **Screenshots:** 13 accurate Playwright PNG captures generated, verified for magic bytes and dimensions, and archived in `PHASE_A_V2_CLEAN_FINAL_OWNER_REVIEW.zip`.
- **Lighthouse:** Homepage `landmark-one-main` failure resolved (A:99 -> A:100). All PR branch routes hit A:100, BP:100, SEO:100. Performance remained stable against baseline.

## 5. Separate Workstreams
- Website Acquisition Article Cluster
- Verified Business Outcomes
- Chatbase on-demand integration
- Homepage/core performance cleanup (Performance scores are currently bottlenecked by high-resolution images. Deferred to a dedicated future performance workstream).

## 6. Do-Not-Touch
- Approved case concepts.
- Local Repair truthful concept framing.
- URLs.
- Canonical/hreflang/schema.
- Screenshot-first proof.
- Distinct case art direction.

## 7. Unresolved Items
- Homepage LCP performance (deferred to future workstream).

## 8. Exact Next Step
Owner review of PR #19, then merge decision.
