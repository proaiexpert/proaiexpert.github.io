# Website Production Factory Rules Extraction Matrix

Audit date: 2026-07-02

## 1. Repo State

- HEAD: `776c127ff9f45a1c52eddf699d99935c63021f74`
- origin/main: `776c127ff9f45a1c52eddf699d99935c63021f74`
- working tree: clean at audit start
- latest commit: `776c127 docs: audit website factory docs for duplicates`

## 2. Sources Reviewed

| Source | Exists now? | Reviewed? | Notes |
|---|---:|---:|---|
| `docs/recovery/FACTORY_DOCS_DEDUP_AUDIT.md` | Yes | Yes | Starting index of useful older materials and migration targets. |
| `AGENTS.md` | Yes | Yes | Strong small-scope, no-broad-audit, no-invention agent rules. |
| `.ai/project-context.md` | Yes | Yes | Captures ChatGPT/Codex/Cursor workflow split and P0/P1 principle. |
| `.ai/site-baseline-and-freeze.md` | Yes | Yes | Baseline/freeze policy and required smoke test. |
| `.ai/social-preview-policy.md` | Yes | Yes | OG/Twitter image and alt policy for EN/RU pages. |
| `README.md` | Yes | Yes | Central site structure, bilingual rules, deployment checks, versioning notes. |
| deleted `screenshots/SCREENSHOT_MANIFEST.md` | No | Yes, via `git show bbea6a3^:screenshots/SCREENSHOT_MANIFEST.md` | Screenshot capture method, viewport/export notes, image-use recommendations. |
| historical `RELEASE_NOTES*.md` | No | Yes, via `git log` and selected `git show` | Useful pattern history, mostly not source-of-truth. |
| deleted `TODO.md` | No | Yes, via `git show f20fc1f^:TODO.md` | Visual review and next-step discipline. |

## 3. Extraction Matrix

| ID | Source | Extracted rule / lesson | Category | Priority | Suggested target doc | Keep / migrate / ignore | Notes |
|---|---|---|---|---|---|---|---|
| R001 | `AGENTS.md` | Prefer minimal safe patches. | agent-rules | High | `docs/website-production-factory/AGENT_PLAYBOOK.md` | migrate | Prevents broad accidental changes. |
| R002 | `AGENTS.md` | Do not refactor unless explicitly requested. | small-scope-policy | High | `AGENT_PLAYBOOK.md` | migrate | Protects static site stability. |
| R003 | `AGENTS.md` | Do not touch unrelated files. | small-scope-policy | High | `AGENT_PLAYBOOK.md` | migrate | Core production-safety rule. |
| R004 | `AGENTS.md` | Do not change copy, structure, layout, or styling unless explicitly requested. | small-scope-policy | High | `AGENT_PLAYBOOK.md` | migrate | Important for live-site and client-site tasks. |
| R005 | `AGENTS.md` | Do not start editing until exact target files are known. | agent-rules | High | `CODEX_WORKFLOW.md` | migrate | Should become a pre-edit gate. |
| R006 | `AGENTS.md` | Default edit scope is 1-2 files. | small-scope-policy | High | `AGENT_PLAYBOOK.md` | migrate | More concrete than current playbook. |
| R007 | `AGENTS.md` | Maximum normal edit scope is 3 files; stop and report if more appears necessary. | small-scope-policy | High | `AGENT_PLAYBOOK.md` | migrate | Strong guardrail against runaway changes. |
| R008 | `AGENTS.md` | Do not run broad site audits by default. | agent-rules | High | `AGENT_PLAYBOOK.md` | migrate | Factory audits should be explicit tasks only. |
| R009 | `AGENTS.md` | Do not do open-ended cleanup or "improve the whole page" tasks. | small-scope-policy | High | `AGENT_PLAYBOOK.md` | migrate | Stops endless polish loops. |
| R010 | `AGENTS.md` | For visual/layout/shared UI fixes, apply changes symmetrically to EN and RU counterparts when both versions exist. | handoff-discipline | Medium | `CODEX_WORKFLOW.md` | migrate | Useful for bilingual sites. |
| R011 | `AGENTS.md` | For text/copy/SEO, handle each language separately. | handoff-discipline | Medium | `CODEX_WORKFLOW.md` | migrate | Prevents crude mirror translation. |
| R012 | `AGENTS.md` | Do not invent file names, selectors, IDs, env vars, APIs, or dependencies. | no-fake-claims | High | `AGENT_PLAYBOOK.md` | migrate | Technical equivalent of no fake claims. |
| R013 | `AGENTS.md` | Before changing code, read the current file. | codex-workflow | High | `CODEX_WORKFLOW.md` | migrate | Basic but high-value for reliability. |
| R014 | `AGENTS.md` | If exact file scope is unknown, identify it without editing first. | codex-workflow | High | `CODEX_WORKFLOW.md` | migrate | Should be a discovery gate. |
| R015 | `AGENTS.md` | Stop after the requested change is done. | freeze-policy | High | `AGENT_PLAYBOOK.md` | migrate | Avoids overrun after acceptance. |
| R016 | `AGENTS.md` | Avoid repeated search/edit loops; narrow scope if the first pass does not create clear progress. | handoff-discipline | Medium | `AGENT_PLAYBOOK.md` | migrate | Useful for budget/time discipline. |
| R017 | `AGENTS.md` | Final report should include what changed, exact files, verification, risks/not touched, and commit title. | handoff-discipline | High | `CODEX_WORKFLOW.md` | migrate | Clear final-report standard. |
| R018 | `.ai/project-context.md` | ChatGPT/Codex analyzes and creates manifests. | chatgpt-workflow | High | `CODEX_WORKFLOW.md` | migrate | Defines planning/recovery role. |
| R019 | `.ai/project-context.md` | Cursor implements only narrow batches. | cursor-workflow | High | `CODEX_WORKFLOW.md` | migrate | Keeps implementation constrained. |
| R020 | `.ai/project-context.md` | Use localhost before push. | deployment-qa | High | `DEPLOYMENT_QA.md` | migrate | Prevents pushing untested frontend changes. |
| R021 | `.ai/project-context.md` | GitHub stores history and rollback. | codex-workflow | Medium | `CODEX_WORKFLOW.md` | migrate | Useful for recovery model. |
| R022 | `.ai/project-context.md` | Broad audits and broad refactors are forbidden unless explicitly requested. | small-scope-policy | High | `AGENT_PLAYBOOK.md` | migrate | Duplicates and reinforces AGENTS.md. |
| R023 | `.ai/project-context.md` | Fix only P0/P1 issues; ignore P2 until business reason appears. | p0-p1-policy | High | `PIPELINE.md` | migrate | Important acceptance/prioritization rule. |
| R024 | `.ai/site-baseline-and-freeze.md` | If main routes and mobile menu/header are stable, treat the current version as the working baseline. | freeze-policy | High | `AGENT_PLAYBOOK.md` | migrate | Prevents destabilizing working sites. |
| R025 | `.ai/site-baseline-and-freeze.md` | After final stabilization: no general cleanup. | freeze-policy | High | `AGENT_PLAYBOOK.md` | migrate | Concrete post-acceptance rule. |
| R026 | `.ai/site-baseline-and-freeze.md` | After final stabilization: no full-site audits. | freeze-policy | High | `AGENT_PLAYBOOK.md` | migrate | Avoids unnecessary churn. |
| R027 | `.ai/site-baseline-and-freeze.md` | After final stabilization: no architecture polishing or broad refactors. | freeze-policy | High | `AGENT_PLAYBOOK.md` | migrate | Protects production system. |
| R028 | `.ai/site-baseline-and-freeze.md` | After final stabilization: only real business changes later. | freeze-policy | High | `PIPELINE.md` | migrate | Should become an exit condition. |
| R029 | `.ai/site-baseline-and-freeze.md` | Required smoke test before push: `/`, `/ru/`, `/contact/`, `/ru/contact/`, mobile menu, desktop header, one CTA/form path. | deployment-qa | High | `DEPLOYMENT_QA.md` | migrate | Very practical pre-push gate. |
| R030 | `.ai/social-preview-policy.md` | English pages use `https://proai-expert.com/screenshots/proai-home-en-desktop.png` for `og:image` and `twitter:image`. | social-preview-og | Medium | `DEPLOYMENT_QA.md` | migrate | Specialist ProAI policy; not general to all clients. |
| R031 | `.ai/social-preview-policy.md` | English `og:image:alt` should be `ProAI Expert homepage preview`. | social-preview-og | Medium | `DEPLOYMENT_QA.md` | migrate | Useful for central repo only. |
| R032 | `.ai/social-preview-policy.md` | Russian pages use `https://proai-expert.com/screenshots/proai-home-ru-desktop.png` for `og:image` and `twitter:image`. | social-preview-og | Medium | `DEPLOYMENT_QA.md` | migrate | Specialist ProAI policy. |
| R033 | `.ai/social-preview-policy.md` | Do not use client or case images as default social preview for studio pages. | social-preview-og | High | `DEPLOYMENT_QA.md` | migrate | Avoids wrong brand/client imagery in previews. |
| R034 | `README.md` | Preserve EN/RU folder structure: root for EN, `/ru/` for Russian, `/insights/` and `/ru/insights/` for articles. | codex-workflow | Medium | `CODEX_WORKFLOW.md` | migrate | Central-site-specific rule. |
| R035 | `README.md` | English and Russian versions are adaptations, not crude mirror translations. | handoff-discipline | Medium | `PROMPT_LIBRARY.md` | migrate | Good bilingual copy rule. |
| R036 | `README.md` | Avoid random folder/file renaming and structure drift between language layers. | codex-workflow | High | `CODEX_WORKFLOW.md` | migrate | Protects URLs and sitemap stability. |
| R037 | `README.md` | Before deployment verify internal links, sitemap, robots.txt, canonical/hreflang logic, and contact form behavior. | deployment-qa | High | `DEPLOYMENT_QA.md` | migrate | Good static-site launch gate. |
| R038 | `README.md` | Keep one clear version line and avoid parallel inconsistent copies. | handoff-discipline | Medium | `CODEX_WORKFLOW.md` | migrate | Reduces duplicate workspace confusion. |
| R039 | deleted `screenshots/SCREENSHOT_MANIFEST.md` | Use live public site capture with clean headless browser screenshots and no browser chrome. | screenshot-qa | High | `QA_CHECKLIST.md` | migrate | Strong rendered QA rule. |
| R040 | deleted `screenshots/SCREENSHOT_MANIFEST.md` | Fast-forward repo to latest `origin/main` before finalizing screenshot package. | screenshot-qa | High | `DEPLOYMENT_QA.md` | migrate | Ensures screenshots match source. |
| R041 | deleted `screenshots/SCREENSHOT_MANIFEST.md` | Rebuild homepage section crops from taller master captures for better framing. | screenshot-qa | Medium | `QA_CHECKLIST.md` | migrate | Useful image-production discipline. |
| R042 | deleted `screenshots/SCREENSHOT_MANIFEST.md` | Maintain separate screenshot output groups for EN, RU, and card sources. | screenshot-qa | Medium | `QA_CHECKLIST.md` | migrate | Useful repeatable screenshot packaging pattern. |
| R043 | deleted `screenshots/SCREENSHOT_MANIFEST.md` | Record exact page URLs used for screenshot captures. | screenshot-qa | High | `DEPLOYMENT_QA.md` | migrate | Prevents ambiguous visual evidence. |
| R044 | deleted `screenshots/SCREENSHOT_MANIFEST.md` | Record viewport/export notes for desktop, mobile, hero crops, service/case pages, and card sources. | screenshot-qa | High | `QA_CHECKLIST.md` | migrate | Makes visual QA reproducible. |
| R045 | deleted `screenshots/SCREENSHOT_MANIFEST.md` | Define best-use recommendations for homepage cards, internal case-study hero, and gallery/portfolio use. | case-study-lessons | Medium | `HANDYMAN_CASE_STUDY.md` | migrate | Useful for future case-study assets. |
| R046 | historical `RELEASE_NOTES*.md` | Keep layout logic and temporary structure intact when improving panel presentation. | reusable-factory-patterns | Medium | `PIPELINE.md` | migrate | Avoids breaking proven structure during visual upgrades. |
| R047 | historical `RELEASE_NOTES*.md` | Review new visuals live on desktop/mobile before further refinement. | rendered-qa | High | `QA_CHECKLIST.md` | migrate | Strong visual acceptance rule. |
| R048 | historical `RELEASE_NOTES*.md` | When changing visuals, note intentionally untouched areas such as hero, header/footer, lower blocks, and internal pages. | handoff-discipline | Medium | `CODEX_WORKFLOW.md` | migrate | Good diff/handoff discipline. |
| R049 | historical `RELEASE_NOTES*.md` | Footer consistency can require canonical full-footer standardization across EN/RU pages. | reusable-factory-patterns | Medium | `TEMPLATES.md` | migrate | Useful template pattern. |
| R050 | historical `RELEASE_NOTES*.md` | Screenshot presentation should avoid heavy frames/tinted shells and maximize visible screen area. | screenshot-qa | Medium | `QA_CHECKLIST.md` | migrate | Useful visual proof rule. |
| R051 | historical `RELEASE_NOTES*.md` | Case-study pages need language-matched screenshots and refined gallery narrative. | case-study-lessons | Medium | `HANDYMAN_CASE_STUDY.md` | migrate | Useful for future case studies. |
| R052 | historical `TODO.md` | After visual changes, explicitly decide whether to keep, soften, or revise the direction. | rendered-qa | Medium | `PIPELINE.md` | migrate | Useful review decision gate. |
| R053 | historical `TODO.md` | Fine-tune scale/padding only if live desktop/mobile review shows need. | freeze-policy | Medium | `AGENT_PLAYBOOK.md` | migrate | Prevents speculative polish. |
| R054 | `FACTORY_DOCS_DEDUP_AUDIT.md` | Do not delete or archive older materials until high-value workflow controls are migrated. | archive-candidate | High | `CODEX_WORKFLOW.md` | migrate | Protects old useful docs. |

## 4. High-Priority Rules to Migrate Later

1. Do not edit until exact target files are known.
2. Default edit scope is 1-2 files; more than 3 files requires stopping and reporting.
3. Do not touch unrelated files, copy, structure, layout, or styling unless requested.
4. Broad audits, open-ended cleanup, and broad refactors are forbidden unless explicitly requested.
5. Fix only P0/P1 issues; ignore P2 until there is a business reason.
6. Treat stable main routes and stable mobile menu/header as the working baseline.
7. After final stabilization, only real business changes should reopen the site.
8. Required pre-push smoke test: `/`, `/ru/`, `/contact/`, `/ru/contact/`, mobile menu, desktop header, one CTA/form path.
9. Use rendered screenshots/browser QA for visual changes; live desktop/mobile review is required before further refinement.
10. Record screenshot capture URLs, viewport/export notes, and image-use recommendations.
11. Do not use client/case images as default studio social previews.
12. Preserve EN/RU structure and do not randomly rename folders or create structure drift.

## 5. Possible Duplicates or Conflicts

| Item | Source A | Source B | Issue | Recommended resolution |
|---|---|---|---|---|
| Agent scope rules | `AGENTS.md` | `AGENT_PLAYBOOK.md` | Current factory playbook is less concrete than repo-level agent rules. | Migrate concrete file-count and stop/report thresholds into `AGENT_PLAYBOOK.md`. |
| Freeze vs pipeline iteration | `.ai/site-baseline-and-freeze.md` | `PIPELINE.md` | Pipeline describes ongoing phases; freeze policy defines when to stop. | Add freeze gates to `PIPELINE.md` and `AGENT_PLAYBOOK.md`. |
| ChatGPT/Codex/Cursor split | `.ai/project-context.md` | `CODEX_WORKFLOW.md` | Current Codex workflow does not capture the multi-agent role split. | Migrate role model into `CODEX_WORKFLOW.md`. |
| Social preview policy | `.ai/social-preview-policy.md` | `DEPLOYMENT_QA.md` | Current deployment QA has no OG/Twitter image policy. | Add a ProAI-specific section or link to `.ai/social-preview-policy.md`. |
| Screenshot discipline | deleted `screenshots/SCREENSHOT_MANIFEST.md` | `QA_CHECKLIST.md` | Current QA says rendered QA but lacks reproducible capture rules. | Migrate capture URLs, viewport notes, and output naming rules. |
| Bilingual editing | `README.md` and `AGENTS.md` | `CODEX_WORKFLOW.md` | Current workflow lacks central EN/RU structure drift rules. | Add bilingual structure rules to `CODEX_WORKFLOW.md`. |
| Release-note history | historical `RELEASE_NOTES*.md` | current factory docs | Release notes are noisy and chronological, not source-of-truth. | Keep as history only; mine specific lessons selectively. |

## 6. Source Files Not Safe to Delete Yet

- `AGENTS.md`
- `.ai/project-context.md`
- `.ai/site-baseline-and-freeze.md`
- `.ai/social-preview-policy.md`
- `README.md`
- `docs/recovery/FACTORY_DOCS_DEDUP_AUDIT.md`
- deleted `screenshots/SCREENSHOT_MANIFEST.md` in git history
- historical `RELEASE_NOTES*.md` in git history
- deleted `TODO.md` in git history
- `Discuss` until manually inspected
- public service/insight pages until reusable strategy language is reviewed

## 7. Recommended Next Task

Create a narrow migration task that updates only `AGENT_PLAYBOOK.md` and `CODEX_WORKFLOW.md` with the high-priority scope, freeze, P0/P1, and role-split rules extracted here. Do not touch QA docs in that same task.
