# Website Production Factory Docs Dedup / Recovery Audit

Audit date: 2026-07-02

## 1. Repo State

- HEAD: `9f50bd5d58c25332d4597d680bdc43b91fc5860e`
- origin/main: `9f50bd5d58c25332d4597d680bdc43b91fc5860e`
- working tree at audit start: clean
- latest commit: `9f50bd5 docs: consolidate website production factory system`

The audit was run in the central ProAI Expert repo, not in the handyman demo repo.

## 2. Current Factory Docs

| Path | Purpose |
|---|---|
| `docs/website-production-factory/README.md` | Central index for the factory documentation set. |
| `docs/website-production-factory/BLUEPRINT.md` | Operating model for the full production system. |
| `docs/website-production-factory/QUICK_START.md` | 30-60 minute start workflow for a new niche/client site. |
| `docs/website-production-factory/PIPELINE.md` | Phase-by-phase production pipeline. |
| `docs/website-production-factory/TEMPLATES.md` | Reusable local-service page templates. |
| `docs/website-production-factory/PROMPT_LIBRARY.md` | Reusable Codex/agent prompt categories. |
| `docs/website-production-factory/QA_CHECKLIST.md` | Desktop, mobile, content, link, reveal, and deployment QA checklist. |
| `docs/website-production-factory/AGENT_PLAYBOOK.md` | Agent operating rules and stop conditions. |
| `docs/website-production-factory/NICHE_ADAPTATION.md` | Niche-specific adaptation notes. |
| `docs/website-production-factory/HANDYMAN_CASE_STUDY.md` | Case study and lessons from the handyman demo. |
| `docs/website-production-factory/FACTORY_STATUS.md` | Current factory status and next actions. |
| `docs/website-production-factory/CHECKLIST_NEW_SITE.md` | New-site startup checklist. |
| `docs/website-production-factory/LOCAL_SERVICE_GUARDRAILS.md` | Safe-copy and proof guardrails. |
| `docs/website-production-factory/MOBILE_QA.md` | Mobile-specific QA requirements. |
| `docs/website-production-factory/DEPLOYMENT_QA.md` | GitHub Pages/live/cache QA requirements. |
| `docs/website-production-factory/CODEX_WORKFLOW.md` | Codex recovery and production workflow. |
| `docs/recovery/CENTRAL_REPO_DISCOVERY.md` | Central repo discovery and wrong-repo preservation notes. |
| `docs/recovery/CURRENT_CENTRAL_PROJECT_STATE.md` | Current central project state snapshot. |

## 3. Older / Duplicate / Orphaned Materials Found

| Path | Type | Status | Why it matters | Recommended action |
|---|---|---|---|---|
| `AGENTS.md` | Agent workflow rules | Partially covered but useful | Contains stricter scoped-edit rules, Russian-language instruction, max normal edit scope, smoke-test reporting format. | Migrate selected agent-control rules into `AGENT_PLAYBOOK.md` or `CODEX_WORKFLOW.md`; keep file as repo-specific instruction. |
| `.ai/project-context.md` | Project context note | Partially covered but useful | Captures the original operating model: ChatGPT/Codex creates manifests, Cursor implements narrow batches, localhost before push, GitHub rollback, P0/P1-only policy. | Migrate workflow model into `CODEX_WORKFLOW.md` as "central site stabilization workflow". |
| `.ai/site-baseline-and-freeze.md` | Freeze policy | Partially covered but useful | Strong freeze rule against endless site changes and broad audits after stabilization. | Migrate into `AGENT_PLAYBOOK.md` and `DEPLOYMENT_QA.md` as "freeze after acceptance". |
| `.ai/social-preview-policy.md` | Social preview policy | Specialist doc | Contains concrete OG/Twitter image policy for ProAI Expert pages. | Keep separate as specialist repo policy; link from deployment QA later. |
| `README.md` | Central site README | Already covered for site context | Describes bilingual site structure, insights, deployment checks, and versioning. | Keep separate; optionally link factory docs in a future README update. |
| `Discuss` | Miscellaneous file | Needs manual review | Tracked file with unclear purpose/name; may contain planning notes or old discussion. | Do not delete yet; inspect manually in a later cleanup pass. |
| `insights/*/index.html` and `ru/insights/*/index.html` | Public editorial content | Specialist source material | Contains service-business website strategy, AI systems, AI search, workflow, conversion, trust, and website-cost material that can feed factory copy/prompt docs. | Do not migrate wholesale; extract reusable strategy points later into `BLUEPRINT.md`, `PROMPT_LIBRARY.md`, and `NICHE_ADAPTATION.md`. |
| `websites-branding/index.html` and `ru/websites-branding/index.html` | Public service page | Specialist source material | Contains strong website-system positioning, review/process language, examples, and CTA patterns. | Use as source material for future factory copy and visual-direction sections. |
| `ai-systems/index.html` and `ru/ai-systems/index.html` | Public service page | Specialist source material | Contains workflow/intake/control-room language useful for automation-adjacent local-service sites. | Keep separate; optionally extract service-system vocabulary later. |
| Deleted `TODO.md` from `f20fc1f^` | Historical task list | Mostly superseded | Contains visual review notes for older two-direction visuals. | Safe to ignore for factory docs except as evidence of old visual QA workflow. |
| Deleted `RELEASE_NOTES*.md` history | Historical release notes | Mostly superseded, but useful pattern history | Shows repeated visual polish, footer, screenshot, case-study, and archive cleanup decisions. | Do not restore; mine selectively only if building a formal ProAI site case study. |
| Deleted `screenshots/SCREENSHOT_MANIFEST.md` from `bbea6a3^` | Screenshot manifest | Partially covered but useful | Captures screenshot method, live URL capture, viewport/export notes, and best-use recommendations. | Migrate screenshot capture discipline into `QA_CHECKLIST.md` or `DEPLOYMENT_QA.md`. |
| Deleted `proaiexpert.github.io-main/README.md` from `035dce1^` | Temporary nested README | Duplicate/confusing | Same general central site README content from reverted nested folder. | Safe to ignore; do not restore nested folder. |

## 4. Useful Missing Content to Preserve

| Source path | Useful content | Suggested target doc | Priority |
|---|---|---|---|
| `AGENTS.md` | "Default edit scope is 1-2 files", "maximum normal edit scope is 3 files", stop before broad edits, concise report format. | `AGENT_PLAYBOOK.md` | High |
| `.ai/project-context.md` | ChatGPT/Codex manifest role, Cursor narrow implementation role, localhost-before-push workflow, GitHub rollback role. | `CODEX_WORKFLOW.md` | High |
| `.ai/site-baseline-and-freeze.md` | Freeze policy, P0/P1-only stabilization rule, no broad cleanup after acceptance. | `AGENT_PLAYBOOK.md` and `FACTORY_STATUS.md` | High |
| Deleted `screenshots/SCREENSHOT_MANIFEST.md` | Screenshot capture method, viewport/export notes, best-use recommendations for case-card and internal case-study images. | `QA_CHECKLIST.md` and `DEPLOYMENT_QA.md` | Medium |
| `README.md` | Bilingual folder rules, language parity guidance, canonical/hreflang/sitemap/contact deployment checks. | `DEPLOYMENT_QA.md` and `CODEX_WORKFLOW.md` | Medium |
| `websites-branding/index.html` | Website-system positioning, trust-first copy, examples/request CTA language. | `BLUEPRINT.md`, `TEMPLATES.md`, `PROMPT_LIBRARY.md` | Medium |
| `insights/ai-search-optimization-for-service-businesses/index.html` | AI search positioning for service businesses. | `NICHE_ADAPTATION.md` or future `AI_SEARCH_QA.md` | Low |
| Historical `RELEASE_NOTES*.md` | Sequence of design, footer, screenshot, and case-study lessons. | Future `PROAI_SITE_CASE_STUDY.md` | Low |

## 5. Duplicate or Conflicting Guidance

| Source A | Source B | Conflict / overlap | Recommended resolution |
|---|---|---|---|
| `AGENTS.md` | `docs/website-production-factory/AGENT_PLAYBOOK.md` | Both define agent safety rules, but `AGENTS.md` is stricter for small live-site edits and says work only in Russian. | Keep `AGENTS.md` as repo-level instruction; migrate non-language, reusable scope limits into factory playbook. |
| `.ai/site-baseline-and-freeze.md` | `docs/website-production-factory/PIPELINE.md` | Pipeline encourages reusable extraction; freeze file warns against endless changes after stabilization. | Add an explicit "stop polishing after acceptance" gate to pipeline/playbook later. |
| `README.md` | `docs/website-production-factory/README.md` | Both describe central project purpose, but one is public site README and one is factory docs index. | Keep separate; add cross-link later only if approved. |
| Historical `RELEASE_NOTES*.md` | Current factory docs | Release notes are chronological and noisy; factory docs are clean source-of-truth. | Do not restore release notes; mine only specific lessons when needed. |
| Deleted nested `proaiexpert.github.io-main/README.md` | Current root `README.md` | Nested copy appears from a reverted upload and duplicates central README. | Treat nested path as superseded. |
| Public insight HTML | Factory docs | Public copy contains polished thought leadership, not operating instructions. | Extract reusable principles later; do not copy public pages into docs wholesale. |

## 6. Recommended Consolidation Plan

1. Strengthen `AGENT_PLAYBOOK.md` and `CODEX_WORKFLOW.md` with the high-value rules from `AGENTS.md`, `.ai/project-context.md`, and `.ai/site-baseline-and-freeze.md`.
2. Add screenshot/rendered-QA capture rules from deleted `screenshots/SCREENSHOT_MANIFEST.md` into `QA_CHECKLIST.md` and `DEPLOYMENT_QA.md`.
3. Create a later specialist doc, possibly `PROAI_SITE_CASE_STUDY.md`, only if the release-note history is worth preserving as a ProAI site evolution case study.
4. Review `Discuss` manually before any cleanup decision.
5. Decide whether root `README.md` should link to `docs/website-production-factory/` in a separate approved task.

## 7. Do Not Delete Yet

- `AGENTS.md`
- `.ai/project-context.md`
- `.ai/site-baseline-and-freeze.md`
- `.ai/social-preview-policy.md`
- `Discuss`
- `README.md`
- current `docs/website-production-factory/`
- current `docs/recovery/`
- public insight/service pages that contain strategy source material
- screenshot assets and historical screenshot references

## 8. Clear Safe-to-Ignore Items

- Deleted nested `proaiexpert.github.io-main/README.md` from reverted upload history.
- Deleted old `TODO.md` visual-review notes, except as historical evidence.
- Deleted `RELEASE_NOTES_v*` files as source-of-truth docs. They are too noisy to restore and should only be mined selectively.
- Old public release-note artifacts removed by prior cleanup commits.

## 9. Final Recommendation

The current factory docs are safe to strengthen further, but several older workflow controls should be migrated before any broad rewrite.

Highest priority is not content volume; it is operational discipline:

- preserve strict small-scope edit rules from `AGENTS.md`;
- preserve freeze/P0/P1 policy from `.ai/site-baseline-and-freeze.md`;
- preserve the ChatGPT/Codex/Cursor role split from `.ai/project-context.md`;
- preserve screenshot/rendered QA discipline from the deleted screenshot manifest.

Do not delete or archive older materials yet. The next task should be a narrow migration of the high-priority workflow rules into the existing factory docs.
