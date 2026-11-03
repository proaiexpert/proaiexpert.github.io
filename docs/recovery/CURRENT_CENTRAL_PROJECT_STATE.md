# Current Central Project State

Date: 2026-07-02

## Central repo identity

- Repo: `proaiexpert/proaiexpert.github.io`
- Local path: `C:\Users\PC Profile\Documents\New project\proaiexpert.github.io`
- Branch: `main`
- Baseline HEAD before docs import: `939b0de1929f9b4503d12aa0b103251f72daefce`
- Working tree before docs import: clean
- Target output: central documentation only

## Existing central project

The central repo is the ProAI Expert public website. It includes:

- English and Russian home pages
- About
- AI Systems
- Websites & Branding
- Contact
- Insights and bilingual insight articles
- Sitemap and robots files
- Mobile behavior scripts and site assets

The repo did not have a central `docs/` folder before this recovery pass.

## Factory materials imported

The following documentation areas were consolidated under `docs/website-production-factory/`:

- System overview
- Blueprint
- Quick start
- Production pipeline
- Page templates
- Prompt library
- QA checklist
- Agent playbook
- Niche adaptation guide
- Handyman case study
- Factory status
- New-site checklist
- Local-service guardrails
- Mobile QA
- Deployment QA
- Codex workflow

Recovery documentation was consolidated under `docs/recovery/`.

## Related projects

- Handyman Vancouver-Portland demo:
  - Repo: `proaiexpert/handyman-vancouver-portland-demo`
  - Role: testbed/case study only.
  - Important lessons: reveal fail-open behavior, mobile QA widths, header/footer completeness, service-area structure, pricing/about/guides structure, and deployment/cache checks.

- Financial Stream:
  - Role: separate client/business site work.
  - Not a source of truth for ProAI Expert factory docs.

- ProAI Expert feature-branch copy:
  - Path: `C:\Users\PC Profile\Documents\New project 5`
  - Role: local working copy of the central site on a feature branch.
  - Not selected for this recovery write because the clean `main` clone exists.

## Current factory status

The Website Production Factory is now documented as a reusable system for producing premium local-service websites across:

- construction
- handyman
- accounting/bookkeeping
- dental/medical clinics
- local services
- professional services

The operating pipeline is:

Research -> Intake -> Sitemap -> Copy -> Visual Direction -> Homepage Prototype -> QA -> Launch -> Reusable Template

## Guardrails

The factory documentation keeps these public-copy guardrails:

- no fake reviews
- no fake ratings
- no fake licenses
- no fake insured/warranty claims
- no fake completed projects
- no fake prices
- no guaranteed outcomes
- no "free estimate" or "free consultation" unless explicitly true and approved

## Remaining issues

- Local `gh` authentication is not completed; connector-based GitHub write access is available as `proaiexpert`.
- Some imported docs preserve both underscore and hyphenated historical file names. This is intentional for recovery; a later cleanup pass can choose canonical names after review.
- Rendered visual QA is not part of this central docs import.

## Recommended next step

Manual review of the factory docs, then decide whether to split the Website Production Factory into a standalone repo or keep it under the central ProAI Expert website repo.
