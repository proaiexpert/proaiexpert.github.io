# Production Pipeline

| Phase | Deliverable | Acceptance Criteria | Stop Conditions |
|---|---|---|---|
| Intake | Fact sheet | Business facts and missing facts documented | License/review/history proof unclear |
| Niche / Competitor Research | Competitor and SERP notes | Offer, service set, and trust model are clear | Claims require fake proof |
| Sitemap | Page map | Every page has a conversion role | Thin pages duplicate each other |
| Conversion Strategy | CTA and trust plan | Primary CTA, secondary CTA, proof limits, and mobile path are clear | CTA requires unsupported availability or pricing |
| Copy Strategy | Page copy plan | Safe, clear, local-service focused | Fake reviews, guarantees, or unsupported claims appear |
| Visual Direction | Style brief | Hero, imagery, colors, CTA hierarchy defined | Images imply fake completed work |
| Homepage Prototype | Working homepage | First screen is usable and conversion-focused | Mobile first screen fails |
| Inner Pages | Services, work examples, area, pricing, guides, about, request, FAQ | Shared chrome, consistent layout | Navigation or CTA differs by page |
| QA | QA report | Desktop/mobile/live/source checks pass | Blank mobile content, broken links, forbidden claims |
| Deployment | Live URL | Source HEAD and live pages match | Cache stale or noindex state wrong |
| Launch Readiness | Final launch checklist | CTA, claims, service areas, forms, mobile, and deployment checks pass | Client facts or approval missing |
| Reusable Template Extraction | Factory update | Lessons captured for next niche | Patterns remain one-off |

## Production Discipline

- One task block at a time.
- Stop visual polishing after acceptance criteria are met.
- Do not commit if there are no changes.
- Do not force push.

## Quality Gates

- Claim safety: run `LOCAL_SERVICE_GUARDRAILS.md`.
- Rendered/browser QA: run `QA_CHECKLIST.md`.
- Mobile QA: run `MOBILE_QA.md`.
- Deployment/live-source QA: run `DEPLOYMENT_QA.md`.
- Codex execution discipline: run `CODEX_WORKFLOW.md` and `AGENT_PLAYBOOK.md`.
