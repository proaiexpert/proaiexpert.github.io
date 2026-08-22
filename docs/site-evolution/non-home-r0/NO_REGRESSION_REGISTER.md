# ProAI Expert — Non-Home Global No-Regression Register R0

Status: binding planning guardrails for later implementation  
Base: `c945084e1952c05c686494091f7dbca0f7acdf08`

## A. Scope / release

1. Homepage `/` and `/ru/` are out of scope.
2. Golden Homepage branches/components must not be modified by inner-site work.
3. No R0 production HTML/CSS/JS changes.
4. No merge or deploy without explicit Owner authorization.
5. Every later page needs separate product and review commits.

## B. Brand authorities

6. Canonical Header authority remains the system based on `20a36a5246ac2fb4507c69858289fc55d0f4a977`; do not redesign it during service-page work.
7. New/rebuilt commercial pages use the canonical Header rather than copying legacy page-local header markup.
8. Homepage Footer R2 authority `f6103920a4a47b51d1cff06d75ce62992d33d4ee` remains untouched.
9. Inner Footer needs a derivative; do not mutate Homepage Footer files to support it.
10. Existing local Inter Latin/Cyrillic variable assets are preferred over new external font dependencies.

## C. Routes / SEO

11. No slug changes by default.
12. Preserve canonical URLs.
13. Preserve EN/RU `hreflang` pairs and `x-default` where currently valid.
14. Preserve title/meta intent unless a documented editorial/SEO improvement is approved.
15. Preserve valid structured data.
16. Preserve internal-link equity.
17. Preserve article URLs and case-study URLs.
18. Do not introduce redirect behavior without an explicit route decision.

## D. Content authority

19. Do not discard strong current service-page operating logic simply because the visual shell is old.
20. AI Systems must preserve process-first thinking, human review, governance and the judgment that some problems should not use AI.
21. Websites & Branding must preserve website-as-business-system, structure/positioning, multilingual logic, production quality and real proof.
22. About remains a trust/judgment page, not a founder vanity surface.
23. Contact remains low friction and human.
24. Insights premium article bodies/methodology are not silently rewritten during shell redesign.
25. EN and RU are separate editorial versions; no forced literal translation.

## E. Proof / claims

26. Do not invent client outcomes, ROI, conversion uplift, lead results, revenue, rankings, testimonials, logos or awards.
27. Real live client work must be visually distinguished from demo/concept/in-development work.
28. Financial Stream remains the flagship real external proof.
29. Current redesign authority is Financial Stream R1.4 product `d6e33b1c428d3478072c3fdf728c50a27ae0461b`: `63 organic clicks / 8.36K search impressions / 52 indexed pages`, with Google Search Console 6-month performance provenance in Aug 2026 and indexing updated Aug 16, 2026. The older `57 / 7.24K / 50` evidence remains a valid historical earlier snapshot, not current authority. Do not merge the older `0.8% CTR`, `35.2 average position`, or `13 not indexed` fields into the newer snapshot without separate current verification.
30. Financial Stream metrics remain dated search/indexing evidence, not proof of lead growth, conversion improvement, revenue, SEO ROI or guaranteed rankings.
31. AI Systems reference scenarios must be labeled as scenarios/patterns unless actual client evidence exists.
32. ProAI self-site work cannot be presented as external-client proof equivalent to Financial Stream.

## F. Experience / design

33. No Hero Cube duplication.
34. No Connected System rail duplication.
35. No Two Worlds split duplication.
36. No Homepage Financial Stream evidence-stage clone.
37. No Homepage Selected Thinking / Decision Desk clone.
38. No generic dark rounded-card wall as the new inner-site architecture.
39. No dashboard/terminal/node-map AI cliché.
40. No stock robots/brains/holograms/people.
41. No mandatory drag.
42. No scroll-jacking.
43. No constant looping decorative motion.
44. No giant unreadable cropped typography.
45. No essential content dependent on hover.
46. Motion must communicate state/sequence/material behavior and then settle.
47. Websites & Branding must not become a color-swapped copy of AI Systems.

## G. Mobile / accessibility

48. Mobile is a separately composed experience.
49. No horizontal overflow at 320px.
50. Minimum touch targets ~44px.
51. Visible keyboard focus is mandatory.
52. `prefers-reduced-motion` is mandatory.
53. Semantic heading order is mandatory.
54. Form labels cannot be placeholders only.
55. Tables must remain accessible and readable on mobile.
56. Informative images require meaningful alt text; decorative media is hidden from assistive technology.
57. Core content cannot require JavaScript to exist.
58. Landscape mobile must be tested explicitly.

## H. Performance / implementation

59. No unnecessary third-party visual runtime.
60. No framework migration unless evidence proves it necessary.
61. Avoid giant inline CSS and uncontrolled global selectors on rebuilt pages.
62. Keep page-family CSS and explicit signature JS ownership.
63. Lazy-load noncritical media.
64. Do not use fixed-height crops for evidence screenshots.
65. Preserve asset integrity and route-relative paths.
66. No permanent idle `requestAnimationFrame` loop for decorative interaction.

## I. Contact hard guardrails

67. No AI chat widget by default.
68. No public calendar booking as the primary CTA by default.
69. No huge intake questionnaire.
70. No fake scarcity.
71. No forced account creation.
72. Preserve `Not sure` / equivalent low-friction routing.

## J. Owner-review guardrails

73. Technical PASS is not visual approval.
74. Later builds require real browser-visible EN/RU review.
75. Later builds require desktop + mobile screenshots committed to the review tree.
76. Review URLs must be commit-pinned/immutable where the review harness supports it.
77. Do not declare a page canonical until Owner approval.

# Top 15 implementation risks and mitigations

| # | Risk | Consequence | Mitigation |
|---:|---|---|---|
| 1 | Homepage scope bleed | Golden homepage regression | File-path allowlist; compare branch against base before every product commit |
| 2 | Legacy header CSS remains authoritative | Header drift/collision | Mount canonical Header; remove page-local ownership only inside rebuilt family; keep compatibility bridge until migration complete |
| 3 | New giant shared CSS file | Cross-page fragility | Small token layer + page-family CSS + signature-specific CSS |
| 4 | Inner Footer changes Homepage Footer | Signature regression | New derivative include/classes/files; no edits to Homepage R2 files |
| 5 | Strong content lost during visual rewrite | Commercial authority drops | Build content preservation matrix before markup replacement; line-by-line EN/RU acceptance |
| 6 | Claim inflation | Trust/legal/reputation risk | Evidence source/date/status adjacent to claims; explicit forbidden claims register |
| 7 | Mobile treated as stacked desktop | Owner visual failure | Mobile composition specified before implementation; viewport QA mandatory |
| 8 | RU treated as translated EN | Editorial regression | Native RU review, independent line breaks/length and terminology cleanup |
| 9 | Sibling pages become template twins | Bespoke-system failure | Different hero geometry, signature interaction, material balance and chapter emphasis |
| 10 | Signature motion becomes spectacle | Performance/brand regression | One finite semantic sequence; reduced-motion final state; no idle loops |
| 11 | Lack of AI client proof leads to fake UI/results | Credibility failure | Label reference scenarios; use real architecture artifacts only when verified |
| 12 | Complex tables fail accessibility/mobile | Usability failure | Semantic tables; mobile labeled rows or explicit horizontal-scroll treatment |
| 13 | Canonical/hreflang/schema regression | SEO loss | Pre/post source diff + route metadata checklist per locale |
| 14 | Heavy media damages LCP/INP | Premium experience feels slow | Enforce service-page performance budget; no autoplay hero video; responsive images |
| 15 | Review artifacts contaminate product commit | Handoff/release ambiguity | Immutable product commit first; screenshots/harness only in separate review commit |

## Release stop condition

If a later page build cannot prove the no-regression items above, it remains an Owner-review candidate and cannot be promoted as canonical.
