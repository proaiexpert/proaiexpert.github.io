# Financial Stream LLC — Screenshot Manifest

**Purpose:** current source of truth for the selected Financial Stream website visuals and separate evidence assets used by the ProAI Expert portfolio case.

---

## 1. Asset classes

### Portfolio masters

Clean, browser-free website captures selected for visual presentation in the public case.

### Review candidates

New captures retained separately while page placement, captions, responsive treatment and final promotion are still under owner review.

### Evidence captures

Dated screenshots that preserve Google Search Console, SERP, automation or status context. Evidence captures require redaction and contextual captions before public use.

Do not mix these asset classes or treat raw evidence dashboards as decorative hero imagery.

---

## 2. Current selected website package

Root:

`assets/img/cases/financial-stream/final-v1/`

The package currently contains exactly ten selected PNG masters.

| # | File | Language | Format | Physical PNG | Purpose | Chat state | Current status |
|---:|---|---|---|---:|---|---|---|
| 1 | `ru/desktop/fs-ru-01-home-hero-desktop.png` | RU | desktop | 2880×2000 | Trust-first homepage hero and Russian-language proof | launcher closed | selected; RU hero previously owner-approved |
| 2 | `ru/desktop/fs-ru-02-request-desktop.png` | RU | desktop | 2880×2000 | Structured-request-first contact architecture | launcher closed | legacy master retained until approved V2 candidate is promoted after placement lock |
| 3 | `ru/desktop/fs-ru-03-reporting-chat-desktop.png` | RU | desktop | 2880×2000 | Deliberate Chatbase / reporting proof frame | chat open intentionally | legacy master retained until approved V2 candidate is promoted after placement lock |
| 4 | `ru/desktop/fs-ru-04-materials-desktop.png` | RU | desktop | 1440×1000 | Materials hub, content depth and SEO foundation | absent/closed | selected; clean Materials desktop proof |
| 5 | `ru/mobile/fs-ru-04-company-formation-mobile-portrait.png` | RU | portrait mobile | 430×932 | Responsive service-page proof: header, hero, CTA and image | absent | selected; clean replacement for rejected landscape mobile |
| 6 | `en/desktop/fs-en-01-home-hero-desktop.png` | EN | desktop | 2880×2000 | Trust-first homepage hero and English-language proof | launcher closed | selected for case composition |
| 7 | `en/desktop/fs-en-02-request-desktop.png` | EN | desktop | 2880×2000 | Structured-request-first contact architecture | launcher closed | legacy master retained until approved V2 candidate is promoted after placement lock |
| 8 | `en/desktop/fs-en-03-reporting-chat-desktop.png` | EN | desktop | 2880×2000 | Deliberate Chatbase / reporting proof frame | chat open intentionally | legacy master retained until approved V2 candidate is promoted after placement lock |
| 9 | `en/desktop/fs-en-04-materials-desktop.png` | EN | desktop | 1440×1000 | Materials hub, bilingual content depth and SEO foundation | absent/closed | selected; clean Materials desktop proof |
| 10 | `en/mobile/fs-en-04-company-formation-mobile-portrait.png` | EN | portrait mobile | 430×1000 | Responsive service-page proof: header, hero, CTA and image | absent | selected; clean replacement for rejected landscape mobile |

Final page-level visual lock remains an owner approval gate after the images are assigned exact roles in the EN/RU Production Spec and placed in the complete case previews.

---

## 3. Owner-approved V2 replacement candidates

Review root:

`assets/img/cases/financial-stream/review-candidates-v2/`

The owner visually approved all four captures on 2026-07-18:

| Candidate | Intended final master | Status |
|---|---|---|
| `ru/desktop/fs-ru-02-request-desktop-v2-candidate.png` | `final-v1/ru/desktop/fs-ru-02-request-desktop.png` | visually approved; promotion deferred until placement and caption lock |
| `ru/desktop/fs-ru-03-reporting-chat-desktop-v2-candidate.png` | `final-v1/ru/desktop/fs-ru-03-reporting-chat-desktop.png` | visually approved; promotion deferred until placement and caption lock |
| `en/desktop/fs-en-02-request-desktop-v2-candidate.png` | `final-v1/en/desktop/fs-en-02-request-desktop.png` | visually approved; promotion deferred until placement and caption lock |
| `en/desktop/fs-en-03-reporting-chat-desktop-v2-candidate.png` | `final-v1/en/desktop/fs-en-03-reporting-chat-desktop.png` | visually approved; promotion deferred until placement and caption lock |

Approval means the screenshot content and composition are accepted. It does not yet lock:

- exact section placement;
- page opening sequence;
- desktop/mobile presentation treatment;
- captions and verified claims;
- crop inside the final case layout;
- whether a paired comparison, single frame or alternating sequence is used.

Do not recapture these four files. Do not delete the review folder or overwrite `final-v1` until the Production Spec and complete-page visual review are approved.

---

## 4. Rejected and removed captures

These files are rejected and must not be restored:

- `ru/mobile/fs-ru-04-materials-mobile-landscape.png`
- `en/mobile/fs-en-04-materials-mobile-landscape.png`

Reason:

- shallow forced landscape composition;
- cropped or incomplete narrative;
- weak mobile proof;
- chatbot obstruction in the rejected RU frame;
- excessive blank space when viewed from a phone.

The earlier portrait `how-we-work` candidates were also rejected for weak crop and narrative value.

Six superseded review-test PNGs were deleted after the corresponding final selected files were verified. Do not recreate a permanent review-test archive unless a new controlled test is explicitly requested.

---

## 5. Known capture metadata

### Original homepage hero frames

- requested CSS viewport: `1440×1000`;
- device pixel ratio: `2`;
- physical PNG: `2880×2000`;
- page zoom: `100%`;
- captured from the live Financial Stream website on 2026-07-17.

### Owner-approved V2 Request and Reporting candidates

All four were captured from the live website on 2026-07-18 using Google Chrome through Playwright in fresh isolated browser contexts:

- CSS viewport: `1440×1000`;
- device pixel ratio: `2`;
- physical PNG: `2880×2000`;
- browser zoom: `100%`;
- `visualViewport.scale`: `1`;
- no browser chrome;
- no artificial upscale.

Request frames:

- RU source: `https://financialstreamllc.com/ru/contact/`;
- EN source: `https://financialstreamllc.com/contact/`;
- Chatbase closed;
- greeting and notification cards absent.

Reporting frames:

- RU source: `https://financialstreamllc.com/ru/#reporting-filing`;
- EN source: `https://financialstreamllc.com/#reporting-filing`;
- Chatbase intentionally open;
- complete localized answer visible;
- no personal or client data.

Exact timestamps, scroll positions, safe questions and SHA-256 values remain recorded in:

`assets/img/cases/financial-stream/review-candidates-v2/capture-log.txt`

### Materials desktop frames

- physical PNG: `1440×1000`;
- RU source: `https://financialstreamllc.com/ru/blog/`;
- EN source: `https://financialstreamllc.com/blog/`;
- no cursor;
- no open chatbot;
- complete hero composition;
- CSS viewport, DPR and exact capture time were not independently retained and must not be guessed.

### Company Formation mobile frames

- RU physical PNG: `430×932`;
- EN physical PNG: `430×1000`;
- portrait mobile composition;
- header, headline/hero content, CTA and image are visible;
- chatbot absent;
- exact URL, requested CSS viewport, DPR and capture time were not retained in the current canonical log and must not be guessed.

---

## 6. Current search evidence

### Performance

Owner-supplied GSC screenshot reviewed 2026-07-17:

- 3-month period;
- 19 clicks;
- approximately 4.17K impressions.

### Indexing

Separate owner-supplied GSC indexing snapshot:

- 51 indexed pages;
- last updated 2026-07-09.

Historical repository derivatives showing approximately 3.88K impressions and 41 indexed pages remain dated historical evidence only.

See `EVIDENCE_INDEX.md` for safe framing and redaction requirements.

---

## 7. Automation evidence

| Capture | What it proves | Public status language | Current requirement |
|---|---|---|---|
| Sanitized Gmail generated draft | Human-in-the-loop multilingual draft workflow | Implemented; human review retained | hide names, addresses, message content and email |
| Make Gmail scenario | Workflow architecture | Implemented according to verified project history | hide connections, tokens, webhook IDs and private data |
| Twilio/Make flow | Missed-call/SMS architecture | Tested / partial | do not imply stable full production without a fresh working test |
| Google Sheet logging | Status tracking | Show only if current working proof exists | hide names, phones and message content |

Automation evidence is separate from the ten-image core website package.

---

## 8. Recommended public selection

Use approximately 8–12 visuals across the full Financial Stream case, not every available source file.

Recommended sequence must be resolved in the Production Spec rather than treated as a locked gallery order. It should cover:

1. flagship desktop/mobile composition;
2. bilingual EN/RU hero proof;
3. service and responsive Company Formation proof;
4. structured request flow;
5. deliberate Chatbase proof;
6. Materials/content layer;
7. dated GSC proof;
8. sanitized Gmail/Make proof;
9. owner testimonial;
10. optional next-step or full-page overview.

Avoid presenting matching RU/EN frames as repetitive consecutive screenshots. Pair or compare them deliberately.

---

## 9. Delivery rules

For each public visual:

1. retain the PNG master;
2. create one optimized WebP derivative for delivery;
3. record concise alt text;
4. add a caption tied to one verified claim;
5. lazy-load non-hero images;
6. do not create a duplicate PNG-master directory;
7. do not recapture owner-approved files without explicit owner instruction;
8. do not promote V2 candidates or delete their review copies before the Production Spec and complete-page preview are approved.