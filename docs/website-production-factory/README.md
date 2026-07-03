# ProAI Expert Website Production Factory

This folder is the source-of-truth operating system for producing premium local-service websites across niches.

The current v2 reference implementation is:
- Repo: `proaiexpert/handyman-vancouver-portland-demo`
- Live demo: `https://proai-expert.com/handyman-vancouver-portland-demo/`
- Demo business: `Local Repair Pro`

Handyman Website v2 is not just a one-off demo. It is the reference implementation and testbed for the broader Website Production Factory. Use it to understand structure, conversion flow, mobile behavior, QA discipline, and proof-safe local-service patterns before adapting the system to a new niche.

The handyman demo is reference material only. Do not treat its demo business, visuals, scenarios, service areas, or proof language as verified client facts for another site.

The factory is not only a website. It is a repeatable pipeline:

`Intake -> Niche/Competitor Research -> Sitemap -> Conversion Strategy -> Copy Strategy -> Visual Direction -> Homepage Prototype -> QA -> Deployment -> Launch Readiness -> Reusable Template Extraction`

## Reuse Boundaries

Reusable across future sites:
- structure logic
- QA checklists
- mobile behavior rules
- local-service CRO patterns
- intake-first strategy
- trust architecture
- deployment QA
- Codex workflow
- prompt/task patterns

Client-specific for every new site:
- business name, phone, email, and service area
- real photos, reviews, testimonials, proof, and before/after examples
- licenses, insurance, certifications, guarantees, warranties, and other claims
- pricing and availability
- language scope, URL structure, and deployment target

Use `LOCAL_SERVICE_GUARDRAILS.md` before converting any reusable pattern into public client copy.

## Read First

For a new Codex/agent session:
1. Read this `README.md`.
2. Identify the task mode: docs-only, implementation, QA, deployment, or recovery.
3. Read the relevant canonical docs before editing.
4. Respect docs-only vs implementation scope.
5. Report old HEAD, new HEAD, files changed, validation, and anything intentionally not changed.

## Canonical Docs

- Overall factory concept: `BLUEPRINT.md`
- Production pipeline: `PIPELINE.md`
- New-site startup: `QUICK_START.md` and `CHECKLIST_NEW_SITE.md`
- Local-service claim safety and proof rules: `LOCAL_SERVICE_GUARDRAILS.md`
- General rendered/browser QA: `QA_CHECKLIST.md`
- Mobile QA: `MOBILE_QA.md`
- Deployment/live-source/cache QA: `DEPLOYMENT_QA.md`
- Codex execution workflow: `CODEX_WORKFLOW.md`
- Agent scope, stop rules, and freeze policy: `AGENT_PLAYBOOK.md`
- Handyman v2 lessons: `HANDYMAN_CASE_STUDY.md`
- Reusable vs client-specific boundaries: this `README.md` and `BLUEPRINT.md`

## Core Docs

- `BLUEPRINT.md` - full operating model
- `QUICK_START.md` - start a new site in 30-60 minutes
- `PIPELINE.md` - phase-by-phase production workflow
- `TEMPLATES.md` - reusable page templates
- `PROMPT_LIBRARY.md` - v2: 18 copy-paste-ready prompts (role/context/inputs/output/constraints/acceptance criteria each)
- `QA_CHECKLIST.md` - v2: full acceptance checklist with pass/fail criteria and required evidence per section
- `AGENT_PLAYBOOK.md` - how to manage Codex/agent work safely
- `NICHE_ADAPTATION.md` - v2: page-by-page adaptation playbook for 6 niches (handyman, construction, accounting, dental, medical, professional services)
- `HANDYMAN_CASE_STUDY.md` - lessons from the current demo
- `FACTORY_STATUS.md` - current state and next recommended actions
- `CHECKLIST_NEW_SITE.md` - checklist for starting a new client/niche site
- `LOCAL_SERVICE_GUARDRAILS.md` - safe copy and proof rules
- `MOBILE_QA.md` - v2: full rendered mobile QA protocol, 20 checks across all required widths, pass/fail report template
- `DEPLOYMENT_QA.md` - GitHub Pages/cache/live QA checklist
- `CODEX_WORKFLOW.md` - v2: full Codex operating protocol (repo verification, wrong-repo prevention, commit/push rules, stop conditions, example commands/report)

## Related Docs

- Recovery audit: `../recovery/`
- Docs dedup/recovery audit: `../recovery/FACTORY_DOCS_DEDUP_AUDIT.md`

## Factory Rule

Every demo should become a reusable niche template. Do not build one-off pages that cannot be adapted.
