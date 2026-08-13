# PROAI EXPERT — WEBSITE CONTROL HANDOFF — 2026-08-12

Repository: `proaiexpert/proaiexpert.github.io`

Status: **AUTHORITATIVE WEBSITE / HOMEPAGE CONTROL HANDOFF**

Purpose: create a clean persistent control point for the ProAI website redesign stream while Cube development continues independently.

This document is for the persistent Website Control Chat. It is not a Builder implementation task.

---

## 1. OPERATING MODEL

Use two permanent control streams:

1. **Website Control** — Homepage, Hero shell, below-Hero sections, site-wide visual system, later Logo/Header/Footer and broader website redesign.
2. **Cube Control** — Three.js signature Cube only until the Cube is complete and ready for final Hero integration.

Heavy implementation work must be delegated to a fresh Builder chat for each serious stage.

Do not use one long Builder chat for multiple unrelated stages.

Control reviews branches, exact SHAs, diffs, QA, visual evidence and owner decisions. Builder executes one scoped assignment and stops.

Production/main must not be touched without explicit owner authorization.

---

## 2. CHAT NAMING CONVENTION

Persistent control chat:

`PROAI — WEBSITE CONTROL — Homepage & Brand System`

Future clean Builder chats should use names such as:

`PROAI BUILDER — WEBSITE — Section 2 R1`

`PROAI BUILDER — WEBSITE — Section 3 R1`

`PROAI BUILDER — WEBSITE — Header R1`

Do not keep the same Builder forever. Each serious stage should start in a clean Builder chat.

The separate persistent Cube control chat should be named:

`PROAI — CUBE CONTROL — Three.js Signature Cube`

Its execution chats should use names such as:

`PROAI BUILDER — CUBE — Semantic Brand Moment R2`

`PROAI BUILDER — CUBE — Spatial Integration R1`

---

## 3. CURRENT PRODUCTION BASE

Production/default branch:

`main`

Verified production HEAD before Hero Shell R1 review:

`c945084e1952c05c686494091f7dbca0f7acdf08`

Do not silently change production lineage assumptions. Re-check `main` before every production authorization.

---

## 4. HERO SHELL R1 — CURRENT WEBSITE CANDIDATE

Review branch:

`agent/proai-home-hero-shell-r1`

Base:

`c945084e1952c05c686494091f7dbca0f7acdf08`

Exact review SHA:

`6f329216c275c06bcb3966dd56fda50f299cb9b7`

Independent Control verification:

- branch is exactly **1 commit ahead** of the specified production base;
- **0 commits behind**;
- changed files are exactly:
  - `index.html`
  - `ru/index.html`
  - `assets/css/homepage-hero-shell-r1.css`
  - `docs/site-evolution/PROAI_HOME_HERO_SHELL_R1_REPORT.md`
- Hero CSS is scoped to `#hero` / Hero-specific selectors;
- EN locked copy is present;
- RU locked copy is present;
- Primary/Secondary CTA routes are correct;
- future Cube mount contract exists;
- no Three.js or GLB runtime is loaded;
- Header files were not changed;
- no intentional below-Hero redesign is included;
- production/main remains untouched.

Technical status:

**CONTROL TECHNICAL PASS WITH ONE ENVIRONMENT-LIMITED BUILD NOTE.**

The Builder could not reproduce the repository Jekyll 4.3.4 build because the execution environment could not resolve external DNS to install the pinned gem. This is not currently evidence of a code defect. Static Liquid-contract checks and browser/render QA passed. Before or during any production release, normal production build/deploy status must still be verified.

Visual status:

**OWNER LIVE-SITE VISUAL REVIEW STILL REQUIRED AFTER EXPLICIT PRODUCTION AUTHORIZATION.**

Do not confuse technical PASS with final visual approval.

---

## 5. HERO SHELL R1 — APPROVED/LOCKED CONTENT

### EN

Eyebrow:

`AI SYSTEMS · AUTOMATION · PREMIUM WEBSITES`

H1:

`From first impression to result — one system.`

Support:

`We build premium websites for service businesses and connect them with AI and automation. Customers understand your services and reach out with the right information; you respond faster and spend less time on routine work. Key decisions stay with you.`

Primary CTA:

`Request a Review`

Microcopy:

`Briefly describe the challenge. We’ll recommend where to start.`

Secondary CTA:

`View Work`

Accountability:

`Washington-based · Working across the U.S. · EN / RU / UA`

Stages:

`TRUST → INQUIRY → RESPONSE → RESULT`

### RU

Eyebrow:

`AI-СИСТЕМЫ · АВТОМАТИЗАЦИЯ · ПРЕМИАЛЬНЫЕ САЙТЫ`

H1:

`От первого впечатления до результата — одна система.`

Support:

`Создаём премиальные сайты для компаний сферы услуг и соединяем их с AI и автоматизацией. Клиенту проще понять ваши услуги и обратиться с нужной информацией, вам — быстрее ответить и меньше заниматься рутиной. Ключевые решения — за вами.`

Primary CTA:

`Запросить разбор`

Microcopy:

`Коротко опишите задачу. Мы предложим, с чего разумнее начать.`

Secondary CTA:

`Смотреть проекты`

Accountability:

`Штат Вашингтон · Работаем по всей США · EN / RU / UA`

Stages:

`ДОВЕРИЕ → ОБРАЩЕНИЕ → ОТВЕТ → РЕЗУЛЬТАТ`

Do not rewrite these without an explicit owner copy decision.

---

## 6. OWNER-APPROVED CORE COLOR

Owner-approved structural direction:

**Neutral Obsidian / Obsidian Spectrum structural black**

Primary field:

`#050607`

Supporting hierarchy:

- `#020304` — deep void
- `#050607` — page
- `#090B0E` — raised surface
- `#0E1217` — panel
- `#171C22` — elevated surface

Mandatory color documents:

`docs/site-evolution/PROAI_BRAND_COLOR_OWNER_DECISION_2026-08-12_CORE_OBSIDIAN_LOCK.md`

`docs/site-evolution/PROAI_BRAND_COLOR_ARCHITECTURE_LIBRARY_R2_2026-08-12.md`

The full library is durable research, not an automatic lock of every accent.

---

## 7. CURRENT HERO UI DIRECTION

Current recommended working system implemented in Hero Shell R1:

- Obsidian structural foundation;
- soft pearl H1;
- warm-pearl / champagne physical Primary CTA;
- smoked neutral Secondary CTA;
- restrained neutral text hierarchy;
- machine/spectral variables prepared but visible energy effectively off for now.

Primary CTA direction:

- radius about `10px`;
- 50–52px class height;
- warm pearl surface `#F3EEE4 → #ECE5D8 → #E0D6C5`;
- dark ink `#111315`;
- localized champagne edge using `#C7A768 / #D8BD84 / #9A6F38`;
- subtle hover `translateY(-1px)`;
- pressed scale `.985`;
- accessible warm focus state.

Secondary CTA direction:

- same geometry family;
- smoked neutral surface;
- neutral hairline;
- subordinate pearl text;
- no persistent spectral accent.

Owner may adjust these after live desktop/iPhone review. That does not invalidate the architecture.

---

## 8. FUTURE CUBE MOUNT CONTRACT

Hero Shell R1 prepares exactly one future runtime target per rendered language page:

`#proai-hero-cube-mount`

inside:

`.proai-hero-object-slot[data-cube-mounted="false"]`

Default:

- current production Hero visual remains fallback;
- future mount is present but hidden/inactive;
- no Three.js;
- no GLB;
- no fake runtime.

Future integration:

- mount approved Three.js runtime into `#proai-hero-cube-mount`;
- switch to `data-cube-mounted="true"`;
- fallback fades/disables;
- Cube mount becomes active and can accept pointer interaction.

The Website stream must preserve this contract while Cube development continues.

Do not rebuild the Hero copy/layout merely because the Cube is unfinished.

---

## 9. CUBE STREAM BOUNDARY

Cube work is NOT owned by Website Control until the Cube Control stream returns an owner-approved integration candidate.

Website Control must not:

- redesign Cube geometry;
- retune Cube motion;
- retune Cube materials;
- rewrite semantic Cube behavior;
- restart Cube research.

Website Control owns the receiving Hero environment and mounting architecture.

Cube Control owns the actual Three.js object/runtime.

The streams join only at final Cube/Spatial Hero integration.

---

## 10. WEBSITE REDESIGN STRATEGY

Do not keep the Homepage blocked by Cube work.

Parallel execution is approved as a working strategy:

### Website stream

Hero Shell → Section 2 → Section 3 → remaining Homepage sections → later Logo/Header/Footer/site-wide refinement.

### Cube stream

Semantic Brand Moment → Cube visual approval → Spatial Integration → final runtime integration package.

The Website stream may proceed below Hero while Cube is still being completed.

Do not redesign the whole Homepage in one giant Builder task.

Use one section/stage at a time with review gates.

---

## 11. PRODUCTION GATE

Builder review branch is not production.

For every stage:

1. Builder creates isolated review branch from exact approved base.
2. Control verifies exact SHA, lineage, diff, scope, QA and visual evidence.
3. Owner decides whether to authorize production.
4. Only after explicit owner authorization may main/production be changed.
5. Owner visually inspects the real site on desktop/iPhone.
6. If needed, create a small corrective stage; do not restart the architecture by default.

Never tell a Builder to merge/deploy merely because its own report says PASS.

---

## 12. VIDEO / EVIDENCE WORKFLOW

For website static/layout stages, prefer screenshots. Do not generate video unless motion requires it.

For future motion/video tasks use:

`docs/site-evolution/PROAI_REVIEW_VIDEO_EVIDENCE_WORKFLOW_2026-08-12.md`

Key rule:

- one reasonable 1080 attempt;
- immediate 720 fallback if 1080 is problematic;
- do not waste long loops on capture infrastructure;
- temporary review MP4 may use Google Drive instead of GitHub;
- code/report/QA stay in GitHub.

---

## 13. IMMEDIATE NEXT WEBSITE CONTROL ACTION

When the new persistent Website Control Chat starts:

1. Read this handoff and the mandatory color/hero sources.
2. Verify current `main` HEAD.
3. Treat Hero Shell R1 SHA `6f329216...` as the current technically reviewed Hero candidate.
4. Do NOT automatically merge it.
5. Ask/confirm only the production decision if the owner has not already explicitly authorized it.
6. After production/live owner review, record any owner visual corrections.
7. Then prepare the next scoped Homepage section assignment in a NEW clean Builder chat.

The Website Control Chat should remain persistent. Builders should remain replaceable.

---

## 14. IMPORTANT HISTORICAL SOURCES

Also read when relevant:

`docs/site-evolution/PROAI_HERO_NEXT_CHAT_MASTER_HANDOFF_2026-08-12.md`

`docs/site-evolution/PROAI_HOME_HERO_SHELL_R1_REPORT.md` from review SHA `6f329216c275c06bcb3966dd56fda50f299cb9b7`

Brand Color / UI Visual Lab R1:

branch `agent/proai-brand-color-ui-lab-r1`

HEAD `85ea9b76af515bfbcba5bdbbc087a5191a8bf273`

Do not delete historical docs when newer control states are created. Add versioned deltas/handoffs.

---

## 15. CONTROL PRINCIPLE

The persistent Control Chat is the project's decision memory and reviewer.

A Builder is an execution worker.

Do not allow a Builder to become the long-term source of truth.

Do not allow the Control Chat to spend its context on hour-long capture/debug loops.

Keep architecture/decisions in control documents and use clean Builders for execution.
