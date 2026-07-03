# Local-Service Guardrails

## Claim Safety Standard

Factory-generated local-service websites must not invent, imply, or visually suggest proof that has not been supplied and verified. If proof is missing, document it as missing and use safer wording.

## Banned Claims Unless Verified

Do not use or imply:
- fake reviews or testimonials
- fake awards or certifications
- fake licenses, insurance, bonding, or warranty status
- fake years in business
- fake project history, completed projects, client results, or before/after results
- fake guarantees or guaranteed outcomes
- fake service areas
- fake emergency, same-day, or 24/7 availability
- fake prices, lowest-price claims, or fixed-pricing promises
- fake "#1" or "top-rated" claims
- "free estimate" or "free consultation" unless explicitly true and approved

## Controlled Claims

Use these only when supplied and verified by the business owner or reliable source material:
- licensed, insured, bonded, or certified
- locally owned, family owned, veteran owned, woman owned, or minority owned
- years in business
- number of customers served or projects completed
- review rating or testimonial text
- response time, same-day availability, emergency service, or 24/7 service
- warranty, guarantee, or satisfaction promise
- exact city, regional, statewide, or nationwide service-area coverage

If uncertain, use safer wording.

## Safe Alternatives

- Instead of "licensed and insured": "Share your project details and we'll confirm scope, scheduling, and requirements."
- Instead of "top-rated handyman": "Reliable help for common home repair and improvement requests."
- Instead of "same-day service guaranteed": "Scheduling depends on scope, location, and availability."
- Instead of "serving all of Washington": "Serving [confirmed city/service area]. Nearby requests can be reviewed by scope."
- Instead of "our completed client work" for demo visuals: "example scenario," "concept preview," "demo case study," or "testbed example."

## Demo / Testbed Wording

- Demo sites must not imply real client work.
- Generated images must not be presented as completed work.
- Case-study lessons may be reused, but not as proof of client results.
- Avoid "our work," "client result," "before/after result," and similar wording unless verified.
- Use neutral labels such as sample scenario, concept preview, demo case study, or testbed example.

## Pricing Language

- Do not invent prices.
- Do not promise the lowest price.
- Do not imply fixed estimates unless the business confirms them.
- "From $X" requires business approval.
- "Free estimate" or "free consultation" requires business approval.
- Safer wording: "request an estimate," "pricing depends on scope," or "send photos/details for review."

## Service Area Language

- Do not invent cities.
- Do not overstate coverage.
- Do not imply statewide or nationwide service unless confirmed.
- For nearby locations, use cautious wording such as "nearby requests reviewed by scope."
- City and service-area pages require factual support.

## Regulated Niche Cautions

Use extra caution for accounting/bookkeeping, tax, legal, medical/dental, financial services, insurance, and construction/trades requiring license claims.

- Do not make legal, medical, tax, or financial advice claims unless properly scoped.
- Do not make compliance claims without proof.
- Do not guarantee outcomes.
- Use intake/review language where advice, eligibility, licensing, or compliance may depend on facts.

## Intake-First Guardrail

For many local-service businesses, intake-first wording is safer than aggressive booking claims:

Send details/photos -> scope review -> scheduling/estimate

This avoids unsupported immediate booking, availability, and pricing claims.

## Final Claim-Safety Checklist

Before publishing, confirm:
- Are all trust claims verified?
- Are all service areas confirmed?
- Are all pricing statements approved?
- Are all demo visuals labeled safely?
- Are reviews and testimonials real and attributable?
- Are licenses and certifications verified?
- Are guarantees and warranties confirmed?
- Does the CTA match the real business workflow?

## Social Preview / OG Content Policy

Studio-level ProAI Expert social previews should default to:
- clean branded studio cards
- abstract or strategic visuals
- service/category-relevant imagery that is not client-specific

For the central ProAI Expert site, the current default studio preview assets are:
- EN pages: `https://proai-expert.com/screenshots/proai-home-en-desktop.png`
- RU pages: `https://proai-expert.com/screenshots/proai-home-ru-desktop.png`

Do not use client, case-study, demo-site, or project-specific images as default ProAI studio OG/social previews unless the task explicitly approves that usage.

Reason:
- avoids implying client proof
- avoids confusing demo/testbed work with real client work
- avoids unsupported public claims

For demo/testbed previews:
- never imply demo work is real completed client work
- avoid "our client result" framing unless verified
- use neutral labels such as demo, concept, case study, or testbed when needed
- avoid fake before/after claims

Social preview titles, descriptions, and images must not imply:
- fake reviews
- fake awards
- fake certifications
- fake client results
- fake years in business
- fake guarantees
- fake service areas
- fake pricing promises
- fake "#1" or "top-rated" claims

For bilingual EN/RU previews:
- preserve the intended language of the page
- do not mix RU and EN text inside the same preview unless explicitly intended
- do not use one language's claim structure to exaggerate the other
- keep translated/adapted preview claims strategically aligned, not mechanically duplicated

`DEPLOYMENT_QA.md` checks whether OG/social preview assets are reachable, fresh, and not stale after deployment. This file defines what those previews are allowed to claim or imply.
