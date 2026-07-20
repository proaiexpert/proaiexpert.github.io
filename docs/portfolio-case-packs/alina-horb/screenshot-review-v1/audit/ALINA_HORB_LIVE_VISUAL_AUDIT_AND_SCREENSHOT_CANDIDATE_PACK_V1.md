# Alina Horb Live Visual Audit and Screenshot Candidate Pack V1

Audit date: 2026-07-20 11:50 PDT (UTC-07:00)

## 1. Audit environment

- Browser: Google Chrome controlled through the Codex in-app browser extension.
- Browser version: 150.0.7871.125.
- Operating system: Windows host.
- Primary requested viewports: 1440x1000 and 390x844 CSS px at 100% zoom.
- Additional tested viewports: 1280x800, 1024x768, 768x1024, 844x390, 360x800 and 320x700.
- Effective screenshot DPR: 1.00000003 (DPR 1). The browser surface did not expose a DPR 2 override.
- Zoom limitation: the browser surface did not apply the attempted 200% zoom. The resulting file is rejected and no 200% pass is claimed.
- Network: live HTTPS access was available. All 18 routes and all 39 referenced assets returned HTTP 200 in the supporting HTTP audit.
- Stabilization: captures were taken after navigation, font/image loading and progressive scrolling through reveal sections.
- Form safety: fields remained empty; no live form was submitted.

Consequence: the pack is complete for owner review and composition selection. Any public portfolio screenshot must be freshly recaptured at DPR 2.

## 2. Live route matrix

Common result for all rows: real Chrome render completed; one visible H1; expected language; visible main content; self-canonical; UA, RU and x-default hreflang; counterpart switch preserved route context; console errors 0; broken rendered images 0; direct HTTP status 200.

| ID | Route | Role | Lang | Render | Robots | Matching counterpart | Visual condition | Screenshot suitability |
|---|---|---|---|---|---|---|---|---|
| R01 | `/` | Homepage | UA | PASS | index, follow | `/ru/` | Strong hero/portrait; +1 px top-sweep measurement | Primary candidate; recapture DPR 2 |
| R02 | `/about/` | About | UA | PASS | index, follow | `/ru/about/` | Strong human/professional identity | Primary candidate; recapture DPR 2 |
| R03 | `/consultations/` | Consultations | UA | PASS | index, follow | `/ru/consultations/` | Journey, conditions, FAQ and intake render | Primary candidate; recapture DPR 2 |
| R04 | `/notes/` | Notes hub | UA | PASS | index, follow | `/ru/notes/` | Four real article entries | Primary candidate; recapture DPR 2 |
| R05 | `/notes/first-consultation/` | Article | UA | PASS | index, follow | RU matching article | Strong article hero and hierarchy | Primary candidate; recapture DPR 2 |
| R06 | `/notes/how-to-start-the-conversation/` | Article | UA | PASS | index, follow | RU matching article | Complete editorial article | Supporting candidate |
| R07 | `/notes/when-coping-stops-helping/` | Article | UA | PASS | index, follow | RU matching article | Complete editorial article | Supporting candidate |
| R08 | `/notes/stress-relocation-and-lost-support/` | Article | UA | PASS | index, follow | RU matching article | Strong long-form practical module | Primary candidate; recapture DPR 2 |
| R09 | `/privacy/` | Privacy | UA | PASS | noindex, follow | `/ru/privacy/` | Complete legal text | QA only |
| R10 | `/ru/` | Homepage | RU | PASS | index, follow | `/` | Strong matched hero; +3 px top-sweep measurement | Primary pair; recapture DPR 2 |
| R11 | `/ru/about/` | About | RU | PASS | index, follow | `/about/` | Role and hierarchy preserved | Supporting parity evidence |
| R12 | `/ru/consultations/` | Consultations | RU | PASS | index, follow | `/consultations/` | Journey, conditions and FAQ localized | Primary pair; recapture DPR 2 |
| R13 | `/ru/notes/` | Notes hub | RU | PASS | index, follow | `/notes/` | Four localized article entries | Primary pair; recapture DPR 2 |
| R14 | `/ru/notes/first-consultation/` | Article | RU | PASS | index, follow | UA matching article | Complete localized article | Supporting parity evidence |
| R15 | `/ru/notes/how-to-start-the-conversation/` | Article | RU | PASS | index, follow | UA matching article | Strong 390 px reading state | Primary mobile candidate; recapture DPR 2 |
| R16 | `/ru/notes/when-coping-stops-helping/` | Article | RU | PASS | index, follow | UA matching article | Complete localized article | Supporting parity evidence |
| R17 | `/ru/notes/stress-relocation-and-lost-support/` | Article | RU | PASS | index, follow | UA matching article | Complete localized article | Supporting parity evidence |
| R18 | `/ru/privacy/` | Privacy | RU | PASS | noindex, follow | `/privacy/` | Complete legal text | QA only |

Language-switch interaction was verified by real clicks on the homepage and on the RU conversation article. Both retained exact route context.

Responsive QA findings:

- No broken images at any tested viewport.
- No measurable page overflow at 1280, 1024, 768 or 360 in the tested pages.
- UA homepage at 844x390 produced 34 px horizontal overflow; the consultations route did not.
- At 320x700: UA and RU homepages produced 14 px overflow; UA consultations and the RU article produced 9 px.
- A heuristic flagged a small number of visible links below 44 px height at desktop and 320/360 states. This is not a keyboard failure, but it limits any blanket touch-target claim.
- The 390 px homepage, drawer and RU article candidate frames were visually usable and did not expose broken imagery.

## 3. Metadata and indexability findings

Live rendered metadata:

- Sixteen content routes emit `index, follow, max-image-preview:large`.
- The two privacy routes emit `noindex, follow`.
- Every route has a self-referencing canonical URL.
- Every route has UA, RU and x-default hreflang links with matching route context.
- `robots.txt` allows crawling and points to `https://alinahorb.com/sitemap.xml`.
- `sitemap.xml` contains exactly the 16 content routes and excludes the two noindex privacy routes.

Conclusion: there is no current robots/sitemap conflict. The earlier observation that public routes were `noindex, nofollow` is stale relative to current production and current `origin/main`. The planned statement “16 indexable routes” is technically correct as a statement about current directives, but it must not be presented as proof that a search engine has indexed or ranked them.

Safe future wording:

> As verified on 20 July 2026, 16 public content routes emit `index, follow`; two privacy routes emit `noindex, follow`. This describes technical directives and does not claim search-engine inclusion or ranking.

## 4. Prioritized visual strengths

| Rank | Strength | Live route / screenshot | Verified fact | Claim limitation | Recommended chapter |
|---|---|---|---|---|---|
| 1 | Human-centred personal identity | `/`, `/about/`; S01, S05A | Alina is the dominant real human subject; portrait and authorship lead the experience | Portrait/publication rights still require owner confirmation | Opening / Personal identity |
| 2 | Premium Editorial Sanctuary | `/`; S01 | Arches, serif display type, ivory/stone/sage/terracotta and asymmetric composition are coherent | Describe observed visual direction, not subjective market superiority | Visual system |
| 3 | Context before contact | `/consultations/`; S06B, S08A, S10 | Four-step journey and conditions appear before the compact form | Do not imply conversion performance | Trust before contact |
| 4 | Professional boundaries | `/consultations/`; S08A, S10 | Conditions, privacy guidance and consent are explicit | Clinical/legal adequacy was not independently certified | Trust and responsibility |
| 5 | UA/RU architecture | all 18 routes; S01/S02, S06B/S07B, S13/S14 | Nine exact UA/RU route pairs preserve role, hierarchy and switch context | Translation quality was visually/structurally reviewed, not linguistically certified | Bilingual product architecture |
| 6 | Four-step consultation path | `/consultations/`; S06B | All four steps are visible in one legible desktop frame | No claim about real-world completion rates | Consultation journey |
| 7 | Notes publishing system | `/notes/` and eight article routes; S13, S15, S16 | Four topics exist in both languages with distinct article pages | Do not claim publishing cadence or audience | Expert publishing |
| 8 | Mobile editorial experience | `/`, RU article; S03, S04, S17 | Portrait, drawer and long-form reading recompose at 390 px | 320 px overflow prevents an “all small widths perfect” claim | Responsive editorial design |
| 9 | Compact intake | `/consultations/#contact`; S10 | Guidance, localized fields, consent and verification fit a compact two-column state | No submission or success-state claim | First-contact UX |
| 10 | Metadata and structured production | all routes; route/HTTP JSON | Self-canonicals, paired hreflang, sitemap and robots align | Directive presence is not search-engine inclusion | Quiet production engineering |
| 11 | QA depth | 18-route matrix and viewport JSON | 18 routes, 39 assets and seven viewport classes were checked | DPR 2 and true 200% zoom were not available | Production evidence |
| 12 | Localized success states | S11/S12 | No verified live evidence in this audit | BLOCKED; owner-approved form test required | Do not publish yet |

## 5. Visual weaknesses and unsuitable evidence

- The production homepage has measurable horizontal overflow at 844x390 and 320x700; several 320 px route samples show 9–14 px overflow.
- The route-top sweep measured tiny +1/+3 px homepage differences. They are not visually dominant but should prevent an absolute “zero overflow everywhere” claim.
- DPR 1 source captures are insufficient as final premium portfolio assets; they are review proofs only.
- True 200% browser zoom could not be exercised by the browser controller and remains unverified.
- Diploma close-ups are unsuitable as primary proof: they over-emphasize credentials and create unnecessary sensitivity risk.
- S05B, S08/S09 FAQ frames and privacy routes are text-dense; use them only at a large rendered size or for QA.
- S06/S07 hero-only consultation frames repeat the visual system without proving the four steps; S06B/S07B are stronger.
- S11/S12 are sensitive form states and remain blocked. No synthetic success UI should be presented as a completed submission.
- Full-page screenshots and 320 px captures are unsuitable for public use because detail becomes unreadable or overflow is visible.
- The attempted `viewport-home-200-percent-zoom.png` is rejected because it is not an actual 200% state.

Additional-candidate decisions:

- Homepage support-needs indexed list: useful supporting UX evidence, but repetitive; do not add to initial public shortlist.
- About timeline: S05B is a good secondary source, but weaker than portrait-led S05A for the flagship sequence.
- About approach quote: no separate capture recommended; it repeats the personal-positioning chapter.
- Professional boundaries: strong evidence, but best shown adjacent to the journey/conditions rather than as a standalone text frame.
- Consultation formats: QA/supporting evidence only; not visually distinct enough for another public asset.
- Article direct-answer pattern: strong editorial module, but S16 is the more distinctive long-form proof.
- Article table of contents: retain within article frames; do not isolate it.
- Related-content block: useful production evidence, not a standalone public asset.
- Language switch: interaction was verified; matched screenshots communicate it more clearly than a control close-up.
- 320 px portrait: QA only because the page has 14 px horizontal overflow at that width.

## 6. S01-S18 manifest

The authoritative capture manifest is:

`C:\Users\PC Profile\Documents\New project\alina-horb-capture-review-v1\manifest\S01-S18_MANIFEST.md`

Summary: S01-S10 and S13-S18 are visually evaluated and require DPR 2 recapture; S11 and S12 are blocked. S05A, S06B and S18A are the selected variants.

## 7. Final public shortlist

Exactly eight recommended compositions, based on 12 current source frames. None is publication-ready until DPR 2 recapture and owner rights confirmation.

### 1. Hero portrait and UA homepage proof

- Sources: S01.
- Route/language/viewport: `/`, UA, 1440x1000.
- Boundary: header, hero portrait, H1, primary CTA, opening trust facts.
- Purpose: establish person, identity and Premium Editorial Sanctuary immediately.
- Desktop: full-width single frame. Tablet: full-width. Mobile: use S03 instead of shrinking S01.
- Minimum rendered width: 720 px.
- Owner approval: portrait/publication rights required.
- Publication-ready: no. Fresh DPR 2 recapture required.

### 2. Matched UA/RU homepage comparison

- Sources: S01 + S02.
- Routes: `/` and `/ru/`; UA/RU; 1440x1000 at identical position.
- Boundary: exact matching hero state.
- Purpose: prove bilingual architecture without diagrams.
- Desktop: 50/50 pair. Tablet: two-row stack. Mobile: vertical stack with full-width labels outside the screenshots.
- Minimum rendered width: 520 px per frame in a pair.
- Owner approval: portrait/publication rights required.
- Publication-ready: no. Fresh matched DPR 2 recapture required.

### 3. About and personal identity

- Source: S05A.
- Route/language/viewport: `/about/`, UA, 1440x1000.
- Boundary: hero, portrait and opening professional context.
- Purpose: connect identity to a responsible professional stance.
- Desktop/tablet/mobile: full-width frame; use a deliberate crop rather than a fake device mockup.
- Minimum rendered width: 640 px.
- Owner approval: portrait/publication rights required.
- Publication-ready: no. Fresh DPR 2 recapture required.

### 4. Consultation journey and conditions

- Sources: S06B + S08A.
- Route/language/viewports: `/consultations/`, UA, 1440x1000 and 1440x900.
- Boundary: complete four-step path plus the core conditions statement.
- Purpose: prove informed choice and context before contact.
- Desktop: 60/40 editorial pair. Tablet/mobile: stacked in narrative order.
- Minimum rendered width: 560 px for S06B; 480 px for S08A.
- Owner approval: not normally required beyond client-site publication rights.
- Publication-ready: no. Fresh DPR 2 recapture required.

### 5. Compact intake and localized success evidence

- Current source: S10. Future conditional sources: S11 + S12.
- Route/language/viewport: `/consultations/#contact`, UA, 1024x1000; RU success counterpart at 1024x760 if approved.
- Boundary: guidance, compact form, privacy note, consent and verification; success panel only after approved testing.
- Purpose: show calm first-contact UX and localized completion states.
- Desktop: intake frame plus compact UA/RU success insets. Tablet/mobile: intake first, success states below.
- Minimum rendered width: 600 px for the form frame.
- Owner approval: required for form-area publication and any success-state test.
- Publication-ready: no. S11/S12 are BLOCKED — OWNER-APPROVED FORM TEST REQUIRED.

### 6. Notes hub and representative article

- Sources: S13 + S15.
- Routes/language/viewports: `/notes/` at 1440x1000 and `/notes/first-consultation/` at 1440x900, UA.
- Boundary: four-entry hub plus article title, metadata, lead image and opening hierarchy.
- Purpose: prove a real expert-publishing system rather than placeholder cards.
- Desktop: 58/42 editorial pair. Tablet/mobile: stacked.
- Minimum rendered width: 520 px per frame in a pair.
- Owner approval: standard client-site publication rights.
- Publication-ready: no. Fresh DPR 2 recapture required.

### 7. Mobile homepage, drawer and article reading

- Sources: S03 + S04 + S17.
- Routes/languages/viewport: `/` UA, `/ru/notes/how-to-start-the-conversation/` RU, 390x844.
- Boundary: mobile hero; open drawer; readable article opening.
- Purpose: prove responsive portrait handling, navigation and long-form reading.
- Desktop: three-column strip. Tablet: two frames above one. Mobile: vertical stack at natural 390 px proportions.
- Minimum rendered width: 260 px per phone frame.
- Owner approval: portrait/publication rights required for S03.
- Publication-ready: no. Fresh DPR 2 recapture required.

### 8. Final production state

- Source: S18A.
- Route/language/viewport: `/`, UA, 1440x900.
- Boundary: final CTA, footer transition, route continuity and natural ProAI Expert credit.
- Purpose: close the case on a real production state, not a dashboard or metric.
- Desktop/tablet/mobile: single wide frame; avoid over-cropping the credit.
- Minimum rendered width: 720 px.
- Owner approval: standard client-site publication rights.
- Publication-ready: no. Fresh DPR 2 recapture required.

Current 12-frame shortlist: S01, S02, S05A, S06B, S08A, S10, S13, S15, S03, S04, S17 and S18A. S11/S12 are explicitly outside the current 12 until approved testing.

## 8. Recommended narrative mapping

| Future portfolio chapter | Evidence |
|---|---|
| Editorial Threshold opening | S01, then S03 as responsive echo |
| Personal identity translated into a product | S05A |
| Bilingual architecture | S01/S02 plus verified route-preserving switch |
| Trust before contact | S06B and S08A |
| First-contact UX | S10; S11/S12 only after approved test |
| Expert publishing | S13, S15; S16 as optional long-form support |
| Responsive editorial design | S03, S04, S17 |
| Quiet production engineering | 18-route matrix, 39-asset audit, canonical/hreflang/sitemap findings |
| Final production state | S18A |

The case should sell human identity, responsible context and bilingual editorial architecture before it discusses implementation details. Metadata and QA belong later as quiet proof, not as large proof numbers or a dashboard.

## 9. Owner decisions required

1. Confirm rights to publish Alina's portrait in the ProAI portfolio and derivative screenshot crops.
2. Approve or reject a controlled form test for S11/S12. Without approval, success-state evidence stays blocked.
3. Confirm whether historical WebP/source captures may be retained privately for comparison; do not publish them by default.
4. Approve final crops after fresh DPR 2 recapture.
5. Confirm publication rights for client-site screens, article imagery and the intake/verification area.
6. Decide whether the small-width overflow should be fixed before any public “responsive across all widths” claim.

## 10. Exact file paths

Review root:

`C:\Users\PC Profile\Documents\New project\alina-horb-capture-review-v1`

Source directories:

- `C:\Users\PC Profile\Documents\New project\alina-horb-capture-review-v1\source-captures\desktop`
- `C:\Users\PC Profile\Documents\New project\alina-horb-capture-review-v1\source-captures\mobile`
- `C:\Users\PC Profile\Documents\New project\alina-horb-capture-review-v1\source-captures\language-pairs`
- `C:\Users\PC Profile\Documents\New project\alina-horb-capture-review-v1\source-captures\qa-only`

Contact sheets:

- `contact-sheets\01-desktop-primary-candidates.jpg`
- `contact-sheets\02-ua-ru-matching-pairs.jpg`
- `contact-sheets\03-mobile-candidates.jpg`
- `contact-sheets\04-consultation-intake-candidates.jpg`
- `contact-sheets\05-notes-article-candidates.jpg`
- `contact-sheets\06-qa-route-matrix.jpg`

Evidence and manifests:

- `audit\live-route-browser-audit.json`
- `audit\additional-viewport-qa.json`
- `audit\live-http-and-assets.json`
- `audit\ALINA_HORB_LIVE_VISUAL_AUDIT_AND_SCREENSHOT_CANDIDATE_PACK_V1.md`
- `manifest\S01-S18_MANIFEST.md`
- `manifest\FILE_INVENTORY.txt` (absolute paths for all 44 screenshots and 6 contact sheets)
- `manifest\s01-s18-browser-capture-manifest.json` (raw browser capture data)

Counts: 44 screenshot files, 6 contact sheets, 18 routes and 39 referenced assets checked.

## 11. Repository status

- Client repository: no files changed; no commit, branch, PR or deployment created. Current live/source comparison used `origin/main` at `d1dae822aab374d5e0d2b27e3d7480495c9053b4` read-only.
- ProAI repository: no files changed by this task; no commit, branch, PR or deployment created. `origin/main` was read at `81954dc42afdbdd77d6b9212a84e3e233b8c536c`.
- The ProAI local checkout already contained an unrelated untracked `assets/img/cases/financial-stream/review-tests/` directory. It was not opened, modified or included in this pack.
- Screenshots and reports exist only in the external review directory above.
- No screenshots were published.
- No live form was submitted.

## Completion

ALINA HORB LIVE VISUAL AUDIT AND SCREENSHOT CANDIDATE PACK READY FOR OWNER REVIEW
