# Quick Start

Use this when starting a new niche/client site in 30-60 minutes.

## 0. Create the Work Context

- Confirm repo or create one.
- Confirm branch and remote.
- Record old HEAD.
- Create `AGENT-STATUS.md` if missing.

## 1. Collect Inputs

Minimum facts:
- niche
- business name
- location/service area
- phone/email
- services
- proof available
- proof missing
- form destination
- noindex/launch state
- language scope: EN/RU or single-language
- deployment target

## 2. Choose the Template

Start from the handyman testbed if the site is local-service oriented:
- homepage
- services
- work examples/scenarios
- service area
- pricing approach
- guides
- about
- request/contact
- FAQ

Reuse the structure, QA gates, intake-first strategy, trust architecture, and mobile behavior rules. Replace all client-specific facts: name, phone/email, service area, pricing, proof, photos, reviews, licenses, testimonials, and before/after examples.

## 3. Build the First Pass

- Start with sitemap and copy plan.
- Build homepage first.
- Add inner pages only after homepage direction is accepted.
- Keep public copy proof-safe.

## 3a. Define Site Decisions Before Build

- Confirm niche and geography.
- Define offer and exclusions.
- Choose URL structure.
- Define homepage sections.
- Define CTA path.
- Define proof/trust limits.
- Define image strategy.
- Define QA gates.

## 4. QA Before Commit

- Search forbidden terms.
- Check links.
- Check mobile at 430, 390, 375, 360, 320.
- Verify content is visible without JS.
- Verify no fake claims using `LOCAL_SERVICE_GUARDRAILS.md`.
- Verify deployment expectations using `DEPLOYMENT_QA.md`.

## 5. Commit Report

Every handoff must include:
- old HEAD
- new HEAD
- files changed
- QA results
- live/source status
- known risks
