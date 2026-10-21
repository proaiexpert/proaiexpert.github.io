# New Site Task Pack

Use this starter pack to launch a new local-service website from the Website Production Factory. It is an operational checklist and prompt set, not a replacement for the canonical docs.

## Before-Start Checklist

- Confirm the repo, branch, remote, and old HEAD.
- Confirm the task mode: docs-only, planning, implementation, QA, deployment, or recovery.
- Confirm niche and geography.
- Confirm business name, phone, email, service area, language scope, and deployment target.
- Collect real proof: photos, reviews, licenses, certifications, pricing, service-area coverage, and testimonials.
- Mark missing facts explicitly. Do not invent them.
- Define offer, exclusions, CTA path, image strategy, and launch state.
- Confirm whether the site is a demo/testbed or a real client launch.
- Read the canonical docs listed below before editing.

## Source Docs To Read

Read in this order:

1. `README.md` - factory overview and canonical doc map.
2. `CODEX_WORKFLOW.md` - repo verification, allowed-file discipline, commit/push/report format.
3. `AGENT_PLAYBOOK.md` - scope limits, stop rules, and freeze policy.
4. `BLUEPRINT.md` - factory concept and reusable pipeline.
5. `PIPELINE.md` - phase deliverables, acceptance criteria, stop conditions, and quality gates.
6. `QUICK_START.md` - 30-60 minute new-site workflow.
7. `CHECKLIST_NEW_SITE.md` - compact startup and launch checklist.
8. `LOCAL_SERVICE_GUARDRAILS.md` - claim safety, proof standards, pricing, service-area, demo/testbed, regulated-niche, and OG/social content policy.
9. `QA_CHECKLIST.md` - general rendered/browser/interaction QA.
10. `MOBILE_QA.md` - mobile viewport and interaction QA.
11. `DEPLOYMENT_QA.md` - source-vs-live, GitHub Pages, cache, and asset-path QA.
12. `HANDYMAN_CASE_STUDY.md` - v2 lessons from the reference implementation.
13. `NICHE_ADAPTATION.md`, `TEMPLATES.md`, and `PROMPT_LIBRARY.md` as needed for niche/page/prompt detail.

## Phased Agent Workflow

### Phase 1: Intake And Risk Scan

- Build a fact table from confirmed source material.
- Separate confirmed facts, assumptions, and missing facts.
- Flag proof gaps, regulated-niche risks, service-area uncertainty, pricing uncertainty, and CTA constraints.
- Stop if the requested public copy would require fake proof.

### Phase 2: Research And Sitemap

- Review competitor/service-language patterns.
- Define page map, page purpose, and CTA path.
- Decide EN/RU or single-language scope.
- Preserve URL structure discipline from `CODEX_WORKFLOW.md`.

### Phase 3: Strategy And Copy

- Define conversion strategy, trust architecture, image strategy, and proof-safe copy approach.
- Use intake-first wording where scheduling, pricing, or eligibility depends on details.
- Apply `LOCAL_SERVICE_GUARDRAILS.md` before drafting public claims.

### Phase 4: Visual Direction And Prototype

- Define hero outcome, visual tone, image source, and CTA hierarchy.
- Use Handyman v2 lessons as patterns, not as client proof.
- Build homepage first, then inner pages after direction is accepted.

### Phase 5: Implementation

- Work one scoped task at a time.
- Confirm exact target files before editing.
- Do not touch public HTML/CSS/JS during docs-only tasks.
- Stop and report if more files, URL changes, or implementation scope are required.

### Phase 6: QA And Launch Readiness

- Run `QA_CHECKLIST.md`, `MOBILE_QA.md`, and `DEPLOYMENT_QA.md`.
- Confirm source HEAD, origin/main, live/cache-busted output, links, forms/CTA paths, mobile menu, sticky CTA, and claim safety.
- Do not mark ready until source, remote, and rendered live behavior agree.

### Phase 7: Template Extraction

- Capture reusable page structures, prompts, QA lessons, image rules, and niche risks.
- Do not copy client-specific facts into factory templates.
- Save reusable lessons back into the factory docs only when scoped.

## Compact Reusable Task Prompts

### 1. Intake Task

```text
Task: Build the intake fact table for {{business_name}} / {{niche}} in {{service_area}}.
Read: LOCAL_SERVICE_GUARDRAILS.md, QUICK_START.md, CHECKLIST_NEW_SITE.md.
Output: confirmed facts, missing facts, source/confidence, risk flags, proof gaps, CTA constraints.
Do not invent facts. Mark missing items as MISSING.
```

### 2. Sitemap Task

```text
Task: Create the sitemap for {{business_name}} from the confirmed intake.
Read: BLUEPRINT.md, PIPELINE.md, TEMPLATES.md, NICHE_ADAPTATION.md.
Output: page list, page purpose, primary CTA, required proof, URL notes.
Stop if a page requires unsupported claims or unconfirmed service areas.
```

### 3. Copy Strategy Task

```text
Task: Create proof-safe copy strategy for {{niche}}.
Read: LOCAL_SERVICE_GUARDRAILS.md, PROMPT_LIBRARY.md, HANDYMAN_CASE_STUDY.md.
Output: homepage outline, trust architecture, CTA hierarchy, missing-proof substitutes, forbidden claims.
Do not write final public copy until missing facts are resolved or safely scoped.
```

### 4. Visual Direction Task

```text
Task: Create visual direction for {{business_name}}.
Read: HANDYMAN_CASE_STUDY.md, LOCAL_SERVICE_GUARDRAILS.md, QA_CHECKLIST.md.
Output: hero image direction, section image strategy, real-vs-scenario image rules, CTA visual hierarchy.
Do not present generated/demo images as completed client work.
```

### 5. Homepage Prototype Task

```text
Task: Build or update only the homepage prototype for {{business_name}}.
Read: CODEX_WORKFLOW.md, AGENT_PLAYBOOK.md, PIPELINE.md, QA_CHECKLIST.md, MOBILE_QA.md.
Allowed files: {{exact_files}}.
Output: scoped implementation plus final report with old HEAD, new HEAD, files changed, validation, and risks.
Stop if more than 3 files or URL structure changes are required.
```

### 6. QA Task

```text
Task: Run rendered QA for {{site_url_or_local_path}}.
Read: QA_CHECKLIST.md, MOBILE_QA.md, DEPLOYMENT_QA.md, LOCAL_SERVICE_GUARDRAILS.md.
Output: pass/fail by section, viewports tested, screenshots/evidence, issues found, issues fixed, remaining risks.
Do not claim visual success from source inspection alone.
```

### 7. Deployment Task

```text
Task: Verify deployment for {{repo}} at {{live_url}}.
Read: DEPLOYMENT_QA.md and CODEX_WORKFLOW.md.
Output: old HEAD, new HEAD, origin/main, live/cache-busted checks, asset checks, CTA/form checks, final pass/fail.
Do not assume a pushed commit is live until rendered/cache-busted checks pass.
```

### 8. Template Extraction Task

```text
Task: Extract reusable lessons from {{site_or_niche}} back into Website Production Factory docs.
Read: README.md, PIPELINE.md, HANDYMAN_CASE_STUDY.md, NICHE_ADAPTATION.md, PROMPT_LIBRARY.md.
Output: reusable patterns, client-specific items excluded, proposed target docs, validation.
Do not copy client facts, private proof, or one-off claims into reusable templates.
```

## Reuse vs Client-Specific Boundaries

Reusable:
- structure logic
- page templates
- QA process
- mobile behavior rules
- local-service CRO patterns
- intake-first strategy
- trust architecture
- deployment QA
- Codex workflow
- prompt/task patterns

Client-specific:
- business name
- phone/email
- service area
- real photos
- reviews/testimonials
- licenses/certifications/insurance/warranty claims
- pricing and availability
- proof, project history, before/after examples
- language scope, URL structure, and deployment target

If a fact is client-specific and not confirmed, do not use it as public copy.

## Standard Reporting Format

Every task handoff should include:

- repo
- branch
- old HEAD
- new HEAD
- files changed
- summary by file or phase
- validation run/results
- push/deployment status, if applicable
- working tree status
- anything intentionally not changed
- missing facts or risks
- recommended next narrow task
