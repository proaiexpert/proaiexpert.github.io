# Prompt Library (v2)

Copy-paste-ready prompts for producing premium local-service websites. Each prompt is self-contained: paste it into Codex/an agent, fill the `{{placeholders}}`, and run it as its own task.

General rules for every prompt below:
- Written in English for technical efficiency, regardless of the site's public-facing language.
- Never invent facts, proof, reviews, licenses, or history. If an input is missing, the output must say "MISSING: <fact>" instead of fabricating it.
- Every prompt's Constraints section inherits `LOCAL_SERVICE_GUARDRAILS.md` — do not restate it in full, just reference it.

---

## 1. New Niche Intake

**Role:** You are an intake analyst for a local-service website factory.
**Context:** A new client/niche is being onboarded. Raw notes are provided by the operator, possibly incomplete.
**Inputs required:** raw client notes ({{raw_notes}}), niche ({{niche}}), business name ({{business_name}}), location/service area ({{service_area}}).
**Output format:** A fact table with columns: Fact | Value | Source | Confidence (confirmed / assumed / missing). Follow with a "Missing Facts" list and a "Risk Flags" list (anything that would require unverifiable claims).
**Constraints:** Do not fill missing facts with plausible-sounding defaults. Mark them MISSING.
**Acceptance criteria:** Every homepage/service claim in later phases can be traced to a row in this table.

---

## 2. Competitor Research Brief

**Role:** You are a local-market competitive analyst.
**Context:** Researching direct competitors for {{niche}} in {{service_area}} before writing copy.
**Inputs required:** niche, service area, 3-5 competitor URLs if known (else instruct to find them).
**Output format:** Table of Competitor | Offer | Proof shown (reviews/licenses/portfolio) | CTA language | Pricing transparency | Notable gap. End with a 5-bullet "Differentiation Opportunities" section.
**Constraints:** Do not copy competitor copy verbatim. Summarize patterns only, not verbatim text blocks longer than 5 words.
**Acceptance criteria:** Output identifies at least 3 concrete differentiation angles usable in copywriting.

---

## 3. Local-Service Homepage Strategy

**Role:** You are a CRO strategist for local-service websites.
**Context:** Defining the homepage strategy before any copy or layout work begins.
**Inputs required:** intake fact table (from Prompt 1), competitor brief (from Prompt 2), niche.
**Output format:** Sections: Primary Customer Intent, Trust Signals Available, Trust Signals Missing (and safe substitutes), Section-by-section Homepage Outline (with 1-line purpose per section), CTA Hierarchy (primary/secondary).
**Constraints:** Any "trust signal missing" must map to a safe substitute from `LOCAL_SERVICE_GUARDRAILS.md` (e.g. scenario examples instead of fake portfolio).
**Acceptance criteria:** Every homepage section in the outline has a stated conversion purpose.

---

## 4. Sitemap Generation

**Role:** You are an information architect for local-service sites.
**Context:** Producing the full sitemap from the homepage strategy.
**Inputs required:** homepage strategy (Prompt 3 output), niche, service area list.
**Output format:** A nested list: Page | Purpose | Primary CTA | Depends on (proof needed). Must include homepage, services, work-examples/scenarios, service-area hub + city pages, pricing approach, guides, about, request/contact, FAQ, plus any niche-specific pages.
**Constraints:** No page may exist without a stated conversion purpose. No duplicate-purpose pages.
**Acceptance criteria:** Every page in `TEMPLATES.md` is accounted for or a deviation is explicitly justified.

---

## 5. Homepage Copywriting

**Role:** You are a direct-response copywriter specializing in local-service businesses.
**Context:** Writing homepage copy strictly from confirmed facts.
**Inputs required:** intake fact table, homepage strategy outline, niche, tone (default: premium, direct, no hype).
**Output format:** Full homepage copy broken into the sections from Prompt 3's outline, each labeled with an HTML section comment (e.g. `<!-- HERO -->`).
**Constraints:** No fake reviews, ratings, license/insurance/warranty claims, guaranteed outcomes, or "free estimate/consultation" language unless the intake table marks it confirmed=true. Hero copy describes the finished/premium outcome, not a defect or problem-only framing.
**Acceptance criteria:** A guardrails term search (see `QA_CHECKLIST.md`) returns zero unapproved hits.

---

## 6. Services Page Copywriting

**Role:** Local-service copywriter.
**Context:** Writing the services listing page.
**Inputs required:** confirmed service list, intake table, niche.
**Output format:** One card block per service: Name, 2-3 sentence description, "what's included" bullets, scope disclaimer line, CTA.
**Constraints:** Every service must exist in the intake table. No pricing unless explicitly confirmed. Always include a scope-review disclaimer per `LOCAL_SERVICE_GUARDRAILS.md`.
**Acceptance criteria:** Every service card traces to a confirmed intake fact.

---

## 7. Service-Area Hub

**Role:** Local-service copywriter + local SEO writer.
**Context:** Writing the service-area hub page that routes to city pages.
**Inputs required:** confirmed city/region list, niche.
**Output format:** Intro paragraph (2-3 sentences, no exact-radius claims unless confirmed), then a city grid: City name | 1-line local hook | link placeholder.
**Constraints:** Do not state an exact service radius unless the intake table confirms it. Do not imply presence in a city with no confirmed coverage.
**Acceptance criteria:** Every listed city exists in the confirmed service-area list.

---

## 8. City Page Template

**Role:** Local-service copywriter + local SEO writer.
**Context:** Writing an individual city landing page.
**Inputs required:** city name, niche, confirmed nearby-service examples (scenario-based, not fake completed projects), any local permit/scope notes.
**Output format:** City-specific intro (mentions the city naturally, not keyword-stuffed), 2-3 relevant scenario examples, scope/permit disclaimer if applicable, CTA block.
**Constraints:** "Scenario examples" language only — never "completed projects" or "recent work" unless the intake table confirms real, permissioned project data.
**Acceptance criteria:** No fabricated project history; city name appears naturally at least twice.

---

## 9. Pricing Page Without Fake Prices

**Role:** Local-service copywriter.
**Context:** Writing a pricing/estimate-approach page with no invented numbers.
**Inputs required:** confirmed pricing factors (materials, access, project size, location, timing), niche.
**Output format:** "What affects your estimate" bullet list, "What we need to give you an accurate number" list, explicit "we do not guess prices without X" statement, CTA to request an estimate (only using "free" language if intake confirms it's actually free).
**Constraints:** Zero fixed dollar figures unless the intake table marks confirmed pricing. No "guaranteed lowest price" or similar guarantee language.
**Acceptance criteria:** No dollar amount appears anywhere unless sourced from a confirmed fact.

---

## 10. Work Examples / Scenario Examples

**Role:** Local-service copywriter + visual director.
**Context:** Building a work-examples page without fake portfolio claims.
**Inputs required:** niche, confirmed real project photos (if any) vs. scenario/stock imagery to be used instead.
**Output format:** Grid of scenario cards: Scenario title (e.g. "Deck repair and refinishing") | 1-2 sentence description of a *type* of project | image direction note (real vs. scenario stock).
**Constraints:** If no real, permissioned project photos exist, the page must be scenario-based and must not use language implying "our completed work" — use "example of the type of work we handle" framing instead.
**Acceptance criteria:** Zero instances of "completed project(s)", "our work", "portfolio" unless real proof is confirmed.

---

## 11. About Page Without Invented History

**Role:** Local-service copywriter.
**Context:** Writing the About page using only confirmed facts.
**Inputs required:** confirmed founding facts, mission/approach notes, team size if confirmed, niche.
**Output format:** 3-4 short paragraphs: what the business does, who it serves, how the process works, why the model exists (demo/model context noted honestly if applicable).
**Constraints:** No invented years-in-business, no invented team bios, no invented awards/certifications.
**Acceptance criteria:** Every claim in the About copy traces to a confirmed intake fact or is explicitly framed as a general statement about the business model (not history).

---

## 12. FAQ Generation

**Role:** Local-service copywriter + objection-handling specialist.
**Context:** Generating FAQ content that resolves real objections and states limitations honestly.
**Inputs required:** niche, confirmed process facts, known risk/compliance boundaries (from `NICHE_ADAPTATION.md`).
**Output format:** 8-12 Q&A pairs covering: process, timing, pricing approach, service area, proof/credentials (answered honestly, including "not applicable" if unverified), cancellation/scope-change handling.
**Constraints:** Any question about licensing/insurance/guarantees must be answered using only confirmed facts or an honest "ask us directly" deflection — never a fabricated yes.
**Acceptance criteria:** No FAQ answer contradicts the intake fact table.

---

## 13. Visual Direction Brief

**Role:** You are an art director for premium local-service brands.
**Context:** Defining the visual system before any page is built.
**Inputs required:** niche, target audience, competitor brief, brand adjectives (e.g. "premium, reliable, Pacific Northwest").
**Output format:** Color palette (with hex codes), typography pairing, imagery style (real vs. scenario/stock and where each is used), spacing/density guidance, CTA button hierarchy (primary/secondary styles).
**Constraints:** Imagery style must specify which pages use real proof vs. scenario stock, matching what the intake table confirms is available.
**Acceptance criteria:** A builder can implement the homepage prototype from this brief without further visual questions.

---

## 14. Hero Image Direction

**Role:** Art director.
**Context:** Selecting/directing the single most important image on the site.
**Inputs required:** niche, visual direction brief, confirmed real photos (if any).
**Output format:** A short spec: subject (finished/premium result, never a defect or problem shot), composition notes, lighting/mood, whether real or scenario/stock, and 2-3 backup image directions.
**Constraints:** Hero must show the *outcome* of the service (e.g. a finished repaired deck, a clean organized space) — never damage, mess, or a "before" shot as the hero.
**Acceptance criteria:** Hero spec is explicit enough that a stock-photo search or real-photo selection can be done without further clarification.

---

## 15. Mobile QA Request

**Role:** QA engineer.
**Context:** Requesting a full mobile QA pass on a built page or site.
**Inputs required:** page URL(s) or local path, list of interactive elements (hamburger, sticky CTA, reveal sections).
**Output format:** Follow the full protocol and report template in `MOBILE_QA.md` verbatim — do not shortcut to curl-only checks.
**Constraints:** Must use rendered/screenshot-based QA, not source-only inspection, for any visual or interaction claim.
**Acceptance criteria:** Report includes all required widths and all 20 checks from `MOBILE_QA.md` with pass/fail + evidence.

---

## 16. Deployment QA Request

**Role:** Release engineer.
**Context:** Verifying a deployment actually reflects the intended commit.
**Inputs required:** repo, branch, intended commit SHA, live URL.
**Output format:** Follow `DEPLOYMENT_QA.md` verbatim: git checks, cache-busted live checks, final acceptance statement.
**Constraints:** A live check that only confirms HTTP 200 is not sufficient — must confirm the live CSS/HTML content markers match the intended commit.
**Acceptance criteria:** Source HEAD, origin/main HEAD, and live cache-busted content all match.

---

## 17. Codex Implementation Task

**Role:** You are an implementation agent operating under `CODEX_WORKFLOW.md`.
**Context:** A single, scoped implementation task on a named repo.
**Inputs required:** repo (FACTORY or SITE, never both), branch, exact task description, list of files expected to change.
**Output format:** Follow `CODEX_WORKFLOW.md`'s repo verification protocol, then implement, then produce the Final Report format from that doc exactly.
**Constraints:** One task at a time. No repo-mixing. No force push. No token/secret exposure. Stop and ask if the worktree is dirty with unexplained changes.
**Acceptance criteria:** Final report includes old HEAD, new HEAD, exact files changed, QA results, push status.

---

## 18. Post-Build Critique / CRO Review

**Role:** You are a conversion-rate-optimization reviewer auditing a finished page or site.
**Context:** A homepage or full site has been built and needs a critique pass before QA/launch.
**Inputs required:** built page(s) or URL, niche, intended primary CTA.
**Output format:** Sections: What's Working, Friction Points (ranked by severity), Guardrail Violations (if any, cross-referenced to `LOCAL_SERVICE_GUARDRAILS.md`), Concrete Fix Recommendations (one line each, actionable).
**Constraints:** Every friction point must include a specific fix, not just a diagnosis. Guardrail violations are called out even if they improve conversion — safety over CRO.
**Acceptance criteria:** Recommendations are specific enough to hand directly to Prompt 17 (Codex Implementation Task) as a task description.
