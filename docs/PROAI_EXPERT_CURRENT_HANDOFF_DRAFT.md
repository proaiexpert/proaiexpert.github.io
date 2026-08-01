# DRAFT — becomes canonical only after PR #19 merge and SHA update.

## 1. Authority and Source of Truth
- **Repository:** `proaiexpert/proaiexpert.github.io`
- **Implementation branch:** `site-integration-owner-qa-phase-a-v2-clean`
- **Baseline main SHA:** `0ced654687c840a304a0cc7ddab5eacf1e27dbec`
- **PR #17:** Merged — portfolio core refinements.
- **PR #18:** Superseded and closed.
- **PR #19:** Phase A replacement; use PR metadata as the authoritative current head.
- **Last visually reviewed implementation SHA before this documentation update:** `1bc5dedb46d2c9eb7d50705a0fb4bc9fd8b6197e`.

## 2. Completed Portfolio Core
- Portfolio Archive in EN and RU.
- Financial Stream flagship case in EN and RU.
- Alina Horb case in EN and RU.
- Local Repair Pro concept case in EN and RU.
- Distinct case art direction and truthful evidence framing remain protected.

## 3. Phase A Scope
- **Global header:** fixed shell parity across EN/RU core pages, Insights, Archive, and case studies.
- **Responsive navigation:** EN breakpoint at 1100px and RU breakpoint at 1200px, with no dead range between desktop navigation and the hamburger panel.
- **Navigation semantics:** unique `site-navigation`, localized labels, `aria-controls`, and `aria-current`.
- **Homepage portfolio path:** Financial Stream primary case-study CTA, secondary live-site CTA, and tertiary all-cases link.
- **Homepage landmarks:** one `<main>` on EN and RU homepages.
- **Portfolio footer:** portfolio-only compact variant with a contained `PROAI EXPERT` backmark.
- **Case endings:** `Evidence/content → Cross-case navigation → Final CTA → Footer` on all six individual case pages.
- **Alina progress rail:** hidden through 1450px; visible above that threshold with a reserved content corridor and dark/ivory state adaptation.
- **Public name correction:** RU `Татьяна Горб`; EN `Tetiana Horb`.

## 4. QA Evidence
- UTF-8 without BOM on targeted HTML; Alina rail CSS normalized without NUL bytes.
- One doctype/html/head/body structure and no duplicated primary navigation items.
- One cross-case navigation block per individual case; no orphan navigation or section fragments.
- Responsive menu behavior verified across desktop, laptop, tablet, and mobile widths.
- Thirteen corrected Playwright captures generated directly from the PR branch.
- Corrected visual review confirmed:
  - EN/RU menu states;
  - EN/RU Financial Stream CTA hierarchy;
  - all three RU case-ending sequences;
  - desktop and mobile portfolio footer;
  - Alina rail on real dark and ivory sections at 1600px without content overlap;
  - Alina rail hidden at 1366px.
- Temporary evidence location: branch `owner-review-pr19-final`, Draft PR #20, and GitHub Actions artifact `pr19-corrected-owner-review`. These are review-only and must never be merged.
- Lighthouse comparison resolved homepage Accessibility from 99 to 100. Best Practices and SEO remained 100 on tested routes. Homepage performance remains broadly consistent with the baseline in the same test environment.

## 5. Separate Workstreams
- Website Acquisition Article Cluster.
- Verified Business Outcomes.
- Chatbase on-demand integration.
- Homepage/core performance cleanup.

## 6. Do-Not-Touch
- Approved case concepts and distinct case identities.
- Local Repair Pro truthful concept/in-development framing.
- Existing public URLs.
- Canonical, hreflang, schema, sitemap, and robots unless a separately verified defect requires a dedicated task.
- Screenshot-first evidence discipline.
- No unverified traffic, inquiry, ranking, revenue, or business-outcome claims.

## 7. Deferred Item
- Homepage/core LCP optimization belongs to a separate performance workstream and is not a Phase A merge blocker.

## 8. Exact Next Step
- Merge decision for PR #19.
- After merge, create one small documentation PR that converts this draft into the canonical current handoff and records the final merge SHA.
- Then move the main website workstream to a new project chat; keep article production in its separate chat.
