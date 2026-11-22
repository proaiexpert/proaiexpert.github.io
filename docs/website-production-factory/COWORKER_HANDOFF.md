# Website Production Factory - Coworker Handoff

## 1. Current Factory Status

The central Website Production Factory foundation is in place in `docs/website-production-factory/`.

Completed work includes:
- central factory docs and production pipeline;
- recovery and dedup audits;
- rules extraction matrix;
- agent and Codex workflow rules;
- rendered, screenshot, browser, mobile, deployment, and cache QA guidance;
- social preview / OG content policy;
- local-service and no-fake-claims guardrails;
- reusable new-site starter task pack;
- ProAI GSC indexing investigation and recovery reports.

The handyman Vancouver-Portland demo is a case study and testbed only. It is not the active build target for the next workstream.

## 2. Repo / Stream Boundaries

- Central repo: `proaiexpert/proaiexpert.github.io`
- Main site: `https://proai-expert.com/`
- Handyman demo repo/site: reference only unless a task explicitly targets it.
- Live ProAI pages should not be changed unless the task explicitly scopes public site edits.
- SEO files should not be changed unless a dedicated SEO task names exact files and URLs.
- Do not edit `sitemap.xml`, `robots.txt`, canonical tags, hreflang tags, redirect stubs, or public pages during factory strategy work.

## 3. Operating Rules for Coworker

- Work one task at a time.
- Identify exact target files before editing.
- Default scope should be 1-2 files.
- Stop and report if more than 3 files appear necessary.
- Do not perform unrelated cleanup, formatting, refactors, or broad rewrites.
- Do not invent business facts.
- Do not add fake reviews, testimonials, awards, licenses, insurance, warranties, guarantees, years in business, pricing, service areas, staff, or completed projects.
- Do not present generated images as real client work.
- Visual changes require rendered QA.
- Mobile changes require mobile QA at the documented widths.
- Final reports must include old HEAD, new HEAD, files changed, validation run, and anything intentionally not changed.

## 4. Factory Docs to Use First

Recommended reading order:

1. `README.md`
2. `BLUEPRINT.md`
3. `PIPELINE.md`
4. `LOCAL_SERVICE_GUARDRAILS.md`
5. `QA_CHECKLIST.md`
6. `MOBILE_QA.md`
7. `DEPLOYMENT_QA.md`
8. `NICHE_ADAPTATION.md`
9. `PROMPT_LIBRARY.md`
10. `AGENT_PLAYBOOK.md`
11. `CODEX_WORKFLOW.md`

Useful context files:
- `docs/recovery/FACTORY_DOCS_DEDUP_AUDIT.md`
- `docs/recovery/FACTORY_RULES_EXTRACTION_MATRIX.md`
- `docs/recovery/PROAI_GSC_INDEXING_MASTER_ACTION_PLAN.md`
- `docs/recovery/PROAI_LIVE_SEO_VALIDATION_AND_INDEXABLE_TARGET_MAP.md`

## 5. SEO / GSC Status

Current SEO conclusion:
- no current random code fix is recommended;
- important canonical pages are technically indexable;
- no obvious live robots, sitemap, canonical, or hreflang break was found;
- handyman/demo is not related to the main GSC URL examples;
- several priority pages should be handled through GSC URL Inspection / Request Indexing;
- the next SEO action is to wait, monitor GSC, and use URL-level exports before any further code change.

Do not change sitemap, robots, canonical, hreflang, redirect stubs, or noindex behavior unless a new GSC inspection shows a specific mismatch.

## 6. Next Production Direction

Working direction:

```text
Luxury Nail Studio / Beauty Studio
```

Treat this as a premium local-service demo and niche package, not a real client site unless real business facts are later provided.

## 7. Recommended Coworker Task 1

Create a strategy-first niche production brief for a Luxury Nail Studio / Beauty Studio website.

This task should be docs/strategy only, not a prototype build.

Target output should include:
- niche summary;
- positioning;
- target customer;
- service categories;
- CTA / booking logic;
- sitemap;
- homepage structure;
- visual direction;
- image / scenario system;
- local SEO and AI-search readiness;
- guardrails;
- automation upsells;
- required inputs before prototype.

## 8. What Coworker Must Not Do First

Do not:
- build the prototype immediately;
- edit live ProAI pages;
- touch the handyman demo repo;
- create fake business proof;
- invent reviews, staff, prices, licenses, awards, years in business, guarantees, or completed work;
- create SEO fixes;
- publish anything.

## 9. Recommended Sequence After Handoff

1. Luxury Nail Studio niche brief.
2. Competitor / visual research.
3. Homepage copy and conversion system.
4. Visual direction board.
5. Prototype build instructions.
6. Prototype implementation.
7. Mobile / rendered QA.
8. Reusable factory pattern extraction.

## 10. Final Notes

Coworker should preserve the Website Production Factory goal: every useful decision should become a reusable pattern for future service-business websites.
