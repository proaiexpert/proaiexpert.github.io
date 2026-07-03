# Handyman Case Study

## What Was Built

A premium Vancouver-Portland handyman demo for `Local Repair Pro`.

Pages:
- homepage
- services
- work examples
- service area hub
- city pages
- pricing
- guides
- about
- request
- FAQ

## Key Design Decisions

- Premium Pacific Northwest local-service style.
- Hero shows finished result / premium outcome, not defects.
- Scenario images below hero communicate possible work without fake portfolio claims.
- Pricing page explains estimate logic without fake fixed prices.
- Guides page adds value without pretending to be a large blog.
- About page explains the demo/business structure without inventing history.

## UX/CRO Lessons

- Finished-result hero imagery works better than defect/tools-first hero imagery for a premium local-service demo.
- Before/after or scenario blocks can sit below the hero; they do not need to carry the first screen.
- Header should include services, work examples, service area, pricing, guides, about, FAQ, phone, request CTA.
- Footer should be compact and structured.
- Local-service websites need clear request flow and mobile CTA.
- Scenario imagery is safer than fake completed-project proof.
- For handyman/home-service sites, a photo-based request flow is a strong default.
- Service scope should be reviewed before scheduling.
- Avoid fake portfolio, fake proof, and unsupported before/after claims.

## Mobile Lessons

- Mobile QA is mandatory.
- Test 430, 390, 375, 360, 320.
- Sticky CTA must not cover content.
- Mobile header and sticky CTA behavior need explicit click/visibility QA.
- Horizontal galleries are risky on mobile unless carefully tested.
- Mobile reliability beats animation.

## Reveal Bug Root Cause

The blank mobile content bug came from fail-closed reveal animation:
- `.reveal` defaulted to `opacity:0`.
- Some reveal-heavy pages did not load JS that added `is-visible`.
- Mobile pages showed header/hero/footer but blank middle content.

Correct approach:
- `.reveal` visible by default.
- Progressive enhancement selector: `html.js .reveal`.
- Wrong selector: `html.js.reveal`.
- Disable reveal hiding on mobile if needed.
- Add reduced-motion, no-IntersectionObserver, and timeout fallback.

## Deployment Lessons

- GitHub Pages/Fastly cache can mislead.
- Use cache-busted URLs.
- Compare source and live CSS.
- If CSS cache persists, use a unique override filename.

## Reusable Patterns Extracted

- proof-safe service cards
- sample scenario work examples
- service-area hub plus city pages
- pricing approach page
- guides hub
- request flow
- FAQ with safety disclaimers
- mobile reveal fail-open model
