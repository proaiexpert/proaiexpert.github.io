# ProAI Expert — Portfolio Case Packs

Internal source-of-truth materials for building the ProAI Expert Case Studies archive, individual EN/RU case pages, homepage/service-page proof modules, screenshot sets, future refinements and supporting promotional assets.

## Current portfolio state

- **Financial Stream:** flagship V1 is live in EN/RU and technically closed; future ideas are stored as a selective post-launch backlog.
- **Alina Horb:** final production specification exists; implementation has not started.
- **Local Repair Pro / handyman:** case-pack and demo/factory knowledge exist; portfolio case remains to be produced.
- **Case Studies archive:** final multi-case archive remains to be completed after the primary cases.
- **Global site refinement:** homepage, service pages, About, Insights links, portfolio integration, motion, performance and schema should be refined after the primary case system is complete.

## Read first — current controlling knowledge

1. `PORTFOLIO_PREMIUMITY_MOTION_AND_EVIDENCE_SYSTEM_V2.md`  
   Shared premiumity, narrative, visual, motion, evidence, responsive and performance system for all future cases and the archive.

2. `financial-stream/FINANCIAL_STREAM_POST_LAUNCH_REVIEW_AND_IMPROVEMENT_BACKLOG_V1.md`  
   Consolidated seven-audit backlog for a later selective Financial Stream refinement. It is not an instruction to modify the current live V1 immediately.

3. Alina final production specification:  
   branch `docs/alina-horb-production-spec-v2-final`  
   file `docs/portfolio-case-packs/alina-horb/ALINA_HORB_FLAGSHIP_PORTFOLIO_CASE_PRODUCTION_SPEC_V2_FINAL.md`

4. `PORTFOLIO_SITE_AUDIT_AND_MASTER_PLAN.md`  
   Historical/current-state planning, integration and safe-rollout reference.

5. `PORTFOLIO_EXPERIENCE_BLUEPRINT.md`  
   Earlier approved prototyping direction. Use it as historical design reference where it does not conflict with project-specific final specs or the V2 premiumity system.

6. Project-specific case packs, production specs, screenshot manifests and evidence records.

## Authority rules

For a new implementation task, use this order:

1. Current owner instruction.
2. Project-specific final production specification.
3. Current `origin/main` and live production behavior.
4. `PORTFOLIO_PREMIUMITY_MOTION_AND_EVIDENCE_SYSTEM_V2.md`.
5. Current project evidence/claims documents.
6. Older portfolio blueprints only where not superseded.

Never use an old branch as the code base merely because it contains useful documentation. Read or selectively transfer approved docs, then implement from a fresh branch created from current `origin/main`.

## Projects

| Priority | Project | Role | Public status | Current production state |
|---:|---|---|---|---|
| 1 | Financial Stream LLC | Primary flagship real-client system case | Real Client Project · Live · Ongoing Optimization | EN/RU V1 published; CTA/transition corrections published; future backlog saved |
| 2 | Alina Horb Psychology Practice | Primary real-project editorial/personal-brand case | Real Website Project · Live · In Refinement | V2 Final Production Spec prepared; implementation pending owner approvals and fresh captures |
| 3 | Local Repair Pro | Primary factory/concept showcase case | Concept Project · In Development | Demo and case materials exist; portfolio case pending |
| Secondary | ProAI Expert | Internal studio case | Internal Studio Project · Live | Preserve routes; refine after primary cases and archive |

## Final portfolio architecture

```text
/case-studies/
/case-studies/financial-stream/
/case-studies/alina-horb/
/case-studies/local-repair-pro/
/case-studies/proai-expert/

/ru/case-studies/
/ru/case-studies/financial-stream/
/ru/case-studies/alina-horb/
/ru/case-studies/local-repair-pro/
/ru/case-studies/proai-expert/
```

Do not create competing `/work/` or `/portfolio/` architectures.

## Shared portfolio principles

- Use the exact current canonical ProAI shell from production.
- Give every project a distinct internal visual world.
- Use real screenshots as evidence, not decoration.
- Keep public claims limited to verified facts.
- Treat demo/concept projects explicitly as demos/concepts.
- Use one signature motion system per case.
- Preserve reduced-motion and no-JS completeness.
- Design mobile as a recomposed experience.
- Do not use filters before the archive contains at least six materially different cases.
- Do not add schema, breadcrumbs or global navigation patterns inconsistently one case at a time.

## Working rules

1. These files are internal evidence and production documents, not automatic publication authorization.
2. Public claims must be limited to verified facts recorded in the relevant current evidence source.
3. Demo/concept work must never be represented as a completed client engagement.
4. Unverified performance, conversion, traffic, revenue, lead or client-satisfaction claims are prohibited.
5. Personal images, credentials, documents, testimonials and identifying information require publication permission where applicable.
6. Final public case copy must be materially shorter than raw source packs while preserving claim, privacy and safety boundaries.
7. Existing public routes must not be deleted without deliberate preservation or redirects.
8. Do not modify public portfolio HTML/CSS/JS directly in `main`.
9. Every implementation starts from a fresh current-main branch unless the owner explicitly defines another safe base.
10. Every publication step requires separate explicit authorization.

## Financial Stream source-of-truth hierarchy

For the current live V1 and later refinement:

1. Current live EN/RU routes and current `origin/main`.
2. Current approved production spec and evidence records.
3. `financial-stream/FINANCIAL_STREAM_POST_LAUNCH_REVIEW_AND_IMPROVEMENT_BACKLOG_V1.md` for later refinement candidates.
4. Current screenshot/evidence manifests.
5. Legacy case-pack parts only for historical detail.

The post-launch backlog contains accepted, experimental, deferred and rejected recommendations. Do not implement all audit suggestions indiscriminately.

## Alina Horb source-of-truth hierarchy

1. `ALINA_HORB_FLAGSHIP_PORTFOLIO_CASE_PRODUCTION_SPEC_V2_FINAL.md` on branch `docs/alina-horb-production-spec-v2-final`.
2. Current `origin/main` at implementation start.
3. Current client production source and fresh browser render.
4. V2 Review and RU case pack.
5. Cancelled prototype only as historical reference.

The cancelled prototype commit `d84a5f2c2c08da917645002310f6911faade6036` must not be restored automatically.

## Related factory knowledge

The portfolio work contributes reusable knowledge to:

`../website-production-factory/PREMIUM_WEBSITE_ART_DIRECTION_MOTION_AND_EVIDENCE_PLAYBOOK_V1.md`

That playbook generalizes premiumity, motion, evidence, CTA, mobile and performance lessons without transferring client-specific facts or visual identities.

## Current production order

Unless the owner changes the sequence:

1. Keep Financial Stream V1 stable.
2. Implement and complete Alina Horb case.
3. Implement and complete Local Repair Pro / handyman case.
4. Build the Case Studies archive and preserve the ProAI Expert studio case.
5. Integrate cases into homepage, service pages and Insights internal linking.
6. Run a portfolio-wide shell, motion, accessibility, performance and schema pass.
7. Return to Financial Stream post-launch backlog for selective V2 refinement.
8. Perform final site-wide refinement and controlled publication.

## Current documentation added in this branch

```text
docs/portfolio-case-packs/
├── PORTFOLIO_PREMIUMITY_MOTION_AND_EVIDENCE_SYSTEM_V2.md
└── financial-stream/
    └── FINANCIAL_STREAM_POST_LAUNCH_REVIEW_AND_IMPROVEMENT_BACKLOG_V1.md

docs/website-production-factory/
└── PREMIUM_WEBSITE_ART_DIRECTION_MOTION_AND_EVIDENCE_PLAYBOOK_V1.md
```

## Final rule

Build a recognizable ProAI portfolio system, not a set of cloned case pages. Shared quality comes from shell parity, evidence discipline, responsive rigor and controlled motion; each project’s internal art direction must remain specific to its actual subject.