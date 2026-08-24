# AI Systems R1 — Engineering Proof / Code Motion / Dark Dev Benchmark R1

Date: 2026-08-23  
Mode: docs/research only  
Repository: `proaiexpert/proaiexpert.github.io`  
Base audit commit: `26da90bd1effaaa600283f36d0d8573add2748c5`  
Frozen PRODUCT: `12d39a2b86c30d87bda84ea69f511cc7f8ca96f7`  
Frozen REVIEW: `951898df718d595e56f7e12767fb88ea37af263c`  
Production main lock: `c945084e1952c05c686494091f7dbca0f7acdf08`

> This document does not modify or reopen the frozen AI Systems product. It defines the engineering-proof decision package only.

---

# A. EXECUTIVE VERDICT

## Decision

**YES — AI Systems should add a code / engineering proof system.**

But the proof should **not** be a terminal, generic IDE screenshot, large syntax panel, invented API flow, or synthetic observability trace.

The strongest credible object is:

> **VERIFIED ENGINEERING HANDOFF — REAL PROAI CODE + IMMUTABLE PRODUCT/REVIEW METADATA + CONTROLLED HUMAN AUTHORITY.**

This solves three different questions without conflating them:

1. **Can ProAI write custom code?**  
   Yes. The frozen AI Systems product contains inspectable custom HTML/CSS/JS. The core JS includes real responsive state logic, reduced-motion handling, observation/reveal state, and mobile header lifecycle behavior.

2. **Does ProAI use a serious engineering process?**  
   Yes. The site repository contains explicit branch/base/head/check/reviewer rules, and the frozen AI Systems R1 itself has a real immutable implementation base, product SHA, review SHA, branch, and responsive QA package.

3. **Does ProAI use controlled AI/coding-agent methods internally?**  
   Yes, partly inspectable. `proaiexpert/ai-os` contains the canonical routing and review methods plus a sanitized summary of the local Telegram → OpenCode runtime. The local runtime source itself is intentionally not present in the connected GitHub repositories, so it must not be visually represented as if public source code had been inspected.

The winning visual model is therefore **Engineering Handoff**, with code as one evidence layer rather than the whole visual idea.

## Core conclusion

The page should make the buyer infer:

`OFF-THE-SHELF WHEN SUFFICIENT → CUSTOM CODE WHEN REQUIRED → BOUNDED EXECUTION → CHECKS → DIFF REVIEW → HUMAN RELEASE AUTHORITY`

The page should **not** say or imply:

`WE CAN BUILD ANYTHING`.

The technical ceiling is better proven through constrained evidence than through maximal claims.

---

# B. 15-SITE PREMIUM DEVELOPER / ENGINEERING BENCHMARK

## Benchmark method and limits

Current official marketing pages and official documentation were inspected on 2026-08-23. The benchmark is about how technical artifacts become commercial proof, not about copying visual themes.

**Important limit:** exact CSS token counts and device-rendered mobile QA were not instrumented for every benchmark site. Color counts below are **visual/functional estimates**, not extracted design-token inventories. Mobile notes are structural implications from the current artifact architecture unless an official source explicitly discusses mobile behavior.

| Site | Artifact provenance | How code/state enters the commercial narrative | Execution / interaction pattern | Why it feels premium | Functional color estimate | Motion meaning | Mobile implication | Real artifact as proof? | Borrow for ProAI | Explicitly do not copy |
|---|---|---|---|---|---|---|---|---|---|---|
| **Resend** | Real SDK/example code on commercial pages; actual text, not screenshot-only | “Simple interface” is demonstrated by code immediately | SDK/language tabs, line numbers, error/result path, response state | Large negative space, crisp mono, restrained syntax, code aligned with explanation | ≈ 3–5 syntax tones inside neutral field | Primarily state/result, not decorative terminal theater | Code must remain readable/copyable; Resend explicitly improved code-block mobile readability | **Yes** | Real text code, short excerpt, clear result, high restraint | Do not clone its composition, typography, or black/white brand treatment |
| **Trigger.dev** | Real TypeScript examples + real product execution concepts/UI | Code proves durable tasks, retries, queues, HITL, observability | Checkpoint, pause/resume, retry, live run/trace concepts | Engineering semantics carry the visual; code is tied to durable execution | ≈ 4–6 functional tones + product state accents | Motion/state explains pause, resume, retry, execution | Collapse to the critical task/approval state, not a full run dashboard | **Yes / product examples** | Show one controlled transition and a human gate | Do not import dense dashboard UI or pretend ProAI has Trigger-like telemetry |
| **Inngest** | Official SDK/docs code; standard TS/Python/Go functions | `step.run`, waits, events and retries turn code into reliability language | Checkpoints, independent retries, memoized state, resume from failure | Simple primitives explain complex operational behavior | ≈ 4–6 syntax tones; neutral dominant | Execution semantics are the story | A 5–8 line primitive can survive mobile better than a workflow canvas | **Yes** | Use one small state/retry primitive when real | Do not copy queue/workflow product vocabulary as if ProAI built an execution engine |
| **Vercel AI SDK** | Real SDK code + preview/output examples | Small code fragment demonstrates provider abstraction, streaming, tools, fallbacks | Code/Preview tabs, model selection, output state | Minimal API surface, precise spacing, output paired with source | ≈ 4–6 functional code tones, brand accent restrained | State changes explain result/provider choice | Code + preview can stack vertically | **Yes** | Pair code with consequence/result, not code alone | Do not use model-logo theater or imply a proprietary AI SDK/platform |
| **LangGraph** | Real framework/docs; commercial page is more conceptual than code-heavy | State, control, memory, HITL and workflow architecture are the proof | Interrupt, checkpoint, resume, graph/control patterns | Technical seriousness comes from control semantics, not huge syntax panels | Mostly neutral + restrained brand/state accents | Motion should explain control/interrupt if used | Prefer state cards / short control chain over graph spaghetti | **Yes, framework/docs** | Make human authority and explicit state visible | Do not copy complex node graphs or suggest multi-agent runtime without evidence |
| **Supabase** | Real React/JS examples and real platform primitives | Short code sits next to DB/Auth/API/Edge Functions/Realtime capabilities | SDK snippet → query/function result | Working code is compact and directly maps to platform value | ≈ 4–6 code tones; neutral plus green brand accent | Mostly product-state explanation | Short snippets and product cards stack naturally | **Yes** | Short real code next to a specific capability | Do not mimic green-accent developer-platform aesthetics or product-tab density |
| **Clerk** | Real docs/API/permission artifacts; homepage proof often product-state rather than code | Sessions, roles, scopes and keys demonstrate authorization boundaries | API key creation/verification/revocation, sessions, permission state | Security semantics create seriousness without fake complexity | Neutral + limited product/security state accents | State/permission change matters more than animation | Permission rows/cards can stack better than code | **Yes** | Borrow explicit authority/scopes as a proof principle | Do not show fictional auth/security UI or expose actual secrets/keys |
| **Liveblocks** | Real interactive tutorials and working examples | Edit code → see live collaborative result | Live editor + two previews; realtime state | Source and visible consequence are adjacent | ≈ 4–6 syntax tones plus small collaborator accents | Motion is actual synchronized state | On mobile, source and preview should become sequential, not squeezed side-by-side | **Yes** | Show artifact → observable result relationship | Do not copy collaborative cursors/editors; unrelated to ProAI claim |
| **Warp** | Real product UI/terminal/agent/code-review surfaces | Branches, worktrees, PRs, approvals and review are part of the product story | Multi-session state, command approval, plan/review, diff feedback | Dense engineering information is structured by strong hierarchy | Neutral dark field + restrained semantic/brand accents | Motion indicates agent attention, review, session state | Reduce to one task/review state; full terminal is too dense | **Yes** | Borrow branch/diff/review/human-control grammar | **Do not copy terminal chrome**; ProAI does not sell a terminal and it would become theater |
| **Raycast** | Real extension API and product UI | Developer credibility comes from typed API, React/TS/Node and native UI outcomes | Extension code → native component behavior | Product craft is shown through polished native artifacts, not a giant code window | Neutral field + controlled product accents | Product transitions, not hacker animation | Product card/state fragments adapt better than IDE panels | **Yes** | Engineering can be proven through polished behavior, not only syntax | Do not use glossy app-card language to stand in for systems engineering |
| **Neon** | Real CLI/API/database branching primitives | One command (`npx neon init`) plus branching/autoscale/state is enough to signal a deep platform | CLI command → branch/environment/resource state | Minimal commands carry real infrastructure consequence | Mostly neutral + one brand accent + data-state accents | Motion should explain branch/resource changes | One-line command works well on mobile, but only if genuine | **Yes** | A genuine primitive can be stronger than 30 lines of code | Do not add a fake “one magic command” for ProAI |
| **Convex** | Real install/code/docs around Workpool/Workflow/Agents | Retries, backoff, checkpoint/resume are sold through concrete primitives | Workflow state persists; individual steps retry/resume | Reliability is expressed in simple language and small code surfaces | Neutral + restrained brand accents; code ≈ 4–6 tones | Motion/state can show checkpoint → retry → resume | Short workflow/state sequence is mobile-friendly | **Yes** | Reliability/failure semantics are premium proof | Do not claim durable runtime guarantees ProAI has not directly verified |
| **Sentry** | Real product monitoring/tracing UI; AI monitoring is an actual product feature | Model calls, tool calls, failures, spans and releases become inspectable evidence | Trace waterfall, tool duration/failure, issue/diff/release context | Operational truth is the visual object | Neutral UI + semantic status accents | Motion is unnecessary unless revealing trace progression | Mobile should reduce to selected spans/events, not full observability screen | **Yes** | A real trace is powerful **only when it is real** | Do not fabricate a ProAI trace/monitoring dashboard; that would be worse than no proof |
| **E2B** | Real JavaScript/Python SDK examples and output; real sandbox product | “Few lines” of code visibly create a sandbox and execute code | Code → sandbox/tool execution → output | Technical depth is self-evident because source and result are explicit | ≈ 4–6 code tones; dark neutral field | Execution/result is the motion/state | Keep one language and one output on mobile | **Yes** | Tool execution + result is a strong pattern when source is verifiable | Do not show many model/provider logos or sandbox code ProAI did not implement |
| **Upstash** | Real TypeScript/Python code, CLI/MCP/skill artifacts | SDK calls, resources, workflow retries and agent tooling are concrete developer proof | Code tabs, resource state, retry/debug actions | Multiple technical surfaces share a consistent restrained system | ≈ 4–6 syntax tones + brand accent | State/result matters more than decoration | One language + one state per viewport | **Yes** | Real code + actual resource/result metadata | Do not reproduce a multi-product developer console or imply owned infrastructure |

## Cross-benchmark synthesis

The premium pattern is consistent:

1. **Real artifacts beat decorative code.**
2. **Short code beats a full IDE screenshot.**
3. **State/result/review is what converts syntax into commercial proof.**
4. **Human approval, permissions and failure behavior signal seriousness.**
5. **The best motion has causality:** a line activates, a step resolves, a branch fails, a review closes, a gate remains locked.
6. **Darkness alone is not premium.** Premium comes from hierarchy, spacing, provenance, precision, and the absence of visual noise.

### Resend-like quality — underlying principles, not visual copying

Borrow:
- source code rendered as real text;
- selectable/copyable/readable syntax;
- restrained highlight palette;
- clear line measure;
- large breathing room;
- short explanation beside source;
- result or consequence near the code;
- mobile readability treated as part of the component, not an afterthought.

Do not copy:
- exact Resend layout;
- exact theme/syntax palette;
- exact component chrome;
- its category language or developer-brand persona.

---

# C. REAL PROAI ARTIFACT INVENTORY

## Classification table

| Candidate | Evidence located | Classification | Public use decision | Why |
|---|---|---|---|---|
| Frozen AI Systems R1 custom JS: `assets/js/ai-systems-r1-core.js` at PRODUCT `12d39a2…` | Real source in public repo | **SAFE REAL PUBLIC ARTIFACT** | **USE** | Direct proof that ProAI ships custom code. Includes reduced-motion fallback, IntersectionObserver state, reveal lifecycle, mobile header state logic. Do not present it as backend/agent runtime code. |
| Frozen AI Systems R1 product commit | `12d39a2…`, parent/base `c945084…`; commit message `build(ai-systems): final canonical-header R1 product freeze` | **SAFE REAL PUBLIC ARTIFACT** | **USE** | Immutable, inspectable production-facing engineering artifact. |
| Frozen AI Systems R1 review package | REVIEW `951898…`; branch `agent/proai-ai-systems-r1-final`; responsive proof matrix and narrow-screen QA | **SAFE REAL PUBLIC ARTIFACT** | **USE** | Strong evidence of implementation discipline, mobile QA and separation of product/review. |
| Public repo `AGENTS.md` at audit base | Explicit Tier 1/2/3 routing, Builder/Reviewer rules, branch/SHA/checks, no merge/publish without authority | **VERIFIED METHOD / SAFE PUBLIC ARTIFACT** | **USE AS METHOD EVIDENCE** | Proves governance. It is process evidence, not client delivery proof. |
| `proaiexpert/ai-os/00_Operating_System/Execution_Workflow.md` | Current private AI-OS main inspected; tiering, scope locks, review, Codex escalation, owner gate | **REAL BUT NEEDS SANITISATION** | **USE ONLY AS SANITISED METHOD** | Strong internal workflow but private control document. Do not expose internal operational detail unnecessarily. |
| `codex-patch-review/SKILL.md` | Real reusable internal skill | **REAL BUT NEEDS SANITISATION** | **USE PRINCIPLE / SHORT EXCERPT ONLY** | Explicitly requires actual diff, root cause, checks, regression risk and proof before acceptance. Excellent review-governance support. |
| `telegram-agent-task/SKILL.md` | Real reusable internal skill | **REAL BUT NEEDS SANITISATION** | **SUPPORTING ONLY** | Proves scope boundaries, allowed/forbidden actions, checks and stop conditions. Not itself code-runtime proof. |
| `OpenCode_Telegram_Bot_Runtime_Portable.md` | Sanitized AI-OS summary; local runtime described as separate software project with own repo/CI/docs/release flow | **VERIFIED INTERNAL IMPLEMENTATION — PARTIALLY INSPECTABLE / INTERNAL ONLY** | **USE STATUS, NOT SOURCE CODE** | Safe to state that an internal runtime exists and uses session/permission/recovery concepts. Exact local source is not present in connected GitHub; never fabricate it. |
| Local OpenCode runtime source | Not present in connected repositories inspected in this audit | **INSUFFICIENTLY VERIFIED HERE** | **DO NOT USE AS CODE** | Must be inspected locally before any source excerpt, trace, API call, watchdog logic or runtime screenshot is published. |
| `Stable_Baseline_OmniRoute_Node_Portable.md` | Sanitized summary of historic baseline and conceptual health-check/self-heal layer | **HISTORICAL / INTERNAL ONLY** | **DO NOT USE AS CURRENT PROOF** | It is explicitly a portable summary, not machine-specific source. Also OmniRoute is not a current public capability story. |
| `Twilio_Make_A2P_Automation_Preflight.md` | Real architecture/cost/compliance lessons and candidate flow | **REAL BUT WRONG PROOF CATEGORY** | **DO NOT USE IN ENGINEERING BLOCK** | Valuable method evidence, but not verified client deployment; would pull the page back toward simple automation and compliance detail. |
| `scripts/check-social-preview.ps1` | Real script in public site repo | **SAFE REAL PUBLIC ARTIFACT / WRONG PROOF CATEGORY** | **DO NOT FEATURE** | Real custom scripting, but too narrow/website-QA-specific to carry AI Systems technical ceiling. |
| Financial Stream production work | Prior audit proof class | **VERIFIED CLIENT DELIVERY** | **KEEP SEPARATE** | Proves real client production delivery, not engineering ceiling. Do not use it to imply agentic backend deployment. |
| Reference architectures from prior audit | Pattern library / architecture concepts | **REFERENCE ARCHITECTURE** | **USE ONLY WHEN LABELED** | Valuable for capability coverage; must never visually masquerade as shipped implementation. |

## Forensic conclusion

**REAL CODE AVAILABLE: PARTLY.**

- Real public ProAI code: **YES**, including the frozen AI Systems product itself.
- Real public/local AI-agent runtime source: **NO in the connected repositories inspected here**.
- Real internal AI/coding governance artifacts: **YES**.
- Real sanitized internal runtime evidence: **YES, partly inspectable**.

This means ProAI can truthfully prove custom engineering **today**, but must not use fake backend code to inflate the claim.

---

# D. BEST CODE PROOF CANDIDATE

## Winner: C — AI CODING WORKFLOW, implemented as a VERIFIED ENGINEERING HANDOFF

The best object is not a hypothetical agent loop. It is a composite evidence object with **two rigorously separated provenance lanes**:

### Lane 1 — VERIFIED TECHNICAL ARTIFACT

Real AI Systems R1 implementation:

- Implementation base: `c945084e1952c05c686494091f7dbca0f7acdf08`
- Branch: `agent/proai-ai-systems-r1-final`
- Frozen PRODUCT: `12d39a2b86c30d87bda84ea69f511cc7f8ca96f7`
- Real source file: `assets/js/ai-systems-r1-core.js`
- Frozen REVIEW: `951898df718d595e56f7e12767fb88ea37af263c`
- Responsive proof matrix: EN/RU at 1440, 1366, 1024, 430, 390, 375, 320 and 844×390, plus 390 menu-open captures
- Narrow-screen QA recorded: no horizontal page overflow in the EN/RU matrix

### Lane 2 — VERIFIED METHOD / INTERNAL AI PROOF

Sanitized governance extracted from real ProAI control artifacts:

`scope lock → route by risk → implementation → checks → actual diff review → ACCEPT / TARGETED CORRECTION / REJECT → owner authority → merge/publish only when authorized`

This lane proves that AI-assisted/coding-agent work is governed. It does **not** claim that the displayed front-end code was authored by a specific model or by the local OpenCode runtime unless a future execution record proves that exact provenance.

## Why this wins over the other candidates

### A. Control Logic Excerpt
Useful, but too easy to become generic pseudo-code. It can prove thinking, not necessarily shipped engineering.

### B. Tool/API Execution Excerpt
Potentially strong, but the relevant local runtime source/trace is not currently in the inspected GitHub evidence. Using it now would require a reference architecture label and would be weaker than real proof.

### C. AI Coding Workflow / Engineering Handoff
**Strongest now.** It combines real shipped code, immutable repository metadata, actual QA, independent review semantics and explicit human authority.

### D. Retry/Fallback Excerpt
Strong technical signal if a real runtime excerpt is recovered locally. Not currently strong enough to publish because the machine-specific implementation is deliberately excluded from GitHub summaries.

---

# E. THREE VISUAL DIRECTIONS

## DIRECTION A — PRECISION CODE LEDGER

### Layout
A narrow evidence ledger on obsidian. Left: 6–8 lines of real source. Right: provenance rows (`FILE`, `PRODUCT`, `REVIEW`, `QA`). Thin rules align line numbers with evidence metadata.

### Artifact content
Use a formatted excerpt from the real frozen `ai-systems-r1-core.js`, for example the reduced-motion/fallback branch. Formatting may add whitespace for presentation but must not change semantics.

### Motion
- one active rule enters;
- one line receives a restrained indigo edge;
- metadata rows resolve once;
- final state becomes completely still.

### Color
90% neutral. Pearl source text, silver punctuation/comments, one controlled indigo emphasis, optional pale steel for keywords.

### Desktop
Strong 60/40 code-to-provenance split. No IDE chrome, no fake window controls.

### Mobile
5 critical lines only, then four provenance rows. No horizontal scroll. Semantic omission marker must be explicit if lines are omitted.

### Evidence label
`VERIFIED TECHNICAL ARTIFACT · FROZEN PRODUCT SOURCE`

### Risk
Still risks reading as “look, colorful code.” It proves custom front-end code but does not by itself communicate agentic governance or failure handling.

---

## DIRECTION B — CONTROLLED EXECUTION TRACE

### Layout
A vertical sequence of 6–8 events: `TASK → PERMISSION → TOOL → RESULT → CHECK → REVIEW → HUMAN GATE`.

### Artifact content
**Do not use a runtime trace yet.** The connected GitHub evidence does not include the exact local OpenCode event log. Until a real sanitized trace is exported from the local runtime, this direction may only be labeled:

`REFERENCE ARCHITECTURE · ILLUSTRATIVE IMPLEMENTATION PATTERN`

### Motion
- step becomes active;
- tool result resolves;
- permission row interrupts;
- one failure can branch to retry/fallback;
- human gate stays locked until final state.

### Color
Neutral dominant; indigo for active path; no green success / red failure dashboard theater. Failure can use pearl/silver pattern + line style instead of alarm color.

### Desktop
Single controlled trace with one side explanation.

### Mobile
Two-state progressive excerpt: first `REQUEST / BOUNDARY`, then `RESULT / AUTHORITY`. 6 events maximum.

### Evidence label
For now: `REFERENCE ARCHITECTURE` only.

### Risk
**Highest truth risk.** A trace that merely looks real would be indistinguishable from fabricated telemetry. Hold this direction until real sanitized runtime events are available.

---

## DIRECTION C — ENGINEERING HANDOFF

### Layout
A dark, document-like engineering surface rather than an IDE:

**Left 7 columns:** real code/diff fragment.  
**Right 5 columns:** immutable handoff chain.

Right-side chain:

1. `SCOPE` — base / allowed area / forbidden release action
2. `CHANGE` — real file + PRODUCT SHA
3. `VERIFY` — real responsive matrix/check record
4. `REVIEW` — immutable REVIEW SHA + diff-review method
5. `AUTHORITY` — `MERGE / DEPLOY: HUMAN GATE`

### Artifact content
Use AI Systems R1 itself as the real technical artifact. Use the internal AI-OS workflow only as clearly labeled method evidence.

### Motion
One causal pass:
- scope becomes active;
- a real changed line registers;
- QA matrix resolves;
- review decision line appears;
- owner/release gate remains visually closed.

Then motion stops.

### Color
88–92% Obsidian / Graphite / Black Chrome / Pearl / Silver. Controlled Indigo only for the active path and immutable provenance markers. One optional pale steel syntax accent.

### Desktop
The block reads more like an engineering record than a developer toy. No tab bar unless needed for `CODE / HANDOFF` switching.

### Mobile
Stack:
1. provenance label;
2. 5-line code excerpt;
3. four compact rows: `PRODUCT`, `QA`, `REVIEW`, `AUTHORITY`.

No horizontal scrolling. No line over approximately 34–38 characters in the visible mobile excerpt.

### Evidence label
Top:

`VERIFIED TECHNICAL ARTIFACT`

Second line:

`PROAI AI SYSTEMS R1 · REAL SOURCE + IMMUTABLE REVIEW CHAIN`

Separate internal method note:

`VERIFIED METHOD · SANITISED FROM INTERNAL ENGINEERING WORKFLOW`

### Risk
Can become too self-referential if over-explained. The block must use the AI Systems page as one concrete artifact, not imply that a marketing page equals backend systems engineering.

---

# F. WINNER

## DIRECTION C — ENGINEERING HANDOFF

It is the only direction that simultaneously passes all of the following tests now:

- **real code:** yes;
- **real immutable repository provenance:** yes;
- **real review/QA chain:** yes;
- **human authority:** yes;
- **AI/coding governance evidence:** yes, as method;
- **no fake client deployment:** yes;
- **no fake runtime source:** yes;
- **mobile can be excellent:** yes;
- **visually differentiated from fake terminal culture:** yes.

Direction A is a valid fallback/subcomponent. Direction B should remain on hold until a real runtime trace is exported and sanitized.

---

# G. EXACT CONTENT OBJECT

## Recommended public object — EN source definition

This is a content/object specification, not a production copy patch.

### Evidence label
`VERIFIED TECHNICAL ARTIFACT`

### Provenance line
`PROAI AI SYSTEMS R1 · REAL SOURCE · IMMUTABLE PRODUCT / REVIEW`

### Title
`CUSTOM CODE. CONTROLLED AUTHORITY.`

### Support
`When off-the-shelf tools stop being enough, we can add custom code, APIs and service logic. Engineering work stays scoped, reviewable and under explicit human release authority.`

### Code excerpt
Use **real source only** from PRODUCT `12d39a2…`, formatted for readability without semantic changes. Preferred fragment: reduced-motion / observer fallback because it is concise, understandable and demonstrates engineered behavior rather than decorative syntax.

Presentation form:

```js
const reduce = matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (reduce || !('IntersectionObserver' in window)) {
  revealAll();
  return;
}
```

**Provenance note:** This is a readability-formatted excerpt of the frozen source, not a verbatim line-for-line formatting of the minified file. Semantics must remain identical; the UI should link or identify the exact source path/SHA.

### Handoff metadata

`BASE`  
`c945084e1952c05c686494091f7dbca0f7acdf08`

`PRODUCT`  
`12d39a2b86c30d87bda84ea69f511cc7f8ca96f7`

`SOURCE`  
`assets/js/ai-systems-r1-core.js`

`REVIEW`  
`951898df718d595e56f7e12767fb88ea37af263c`

`QA`  
`EN/RU · 1440 → 320 · short landscape · menu-open`

`RELEASE AUTHORITY`  
`MERGE / DEPLOY REQUIRES HUMAN APPROVAL`

### Internal method companion — distinct proof class

Label:

`VERIFIED METHOD · SANITISED INTERNAL WORKFLOW`

Sequence:

`SCOPE LOCK → IMPLEMENT → CHECK → REVIEW ACTUAL DIFF → HUMAN RELEASE GATE`

Micro-note:

`The local Telegram → OpenCode runtime is verified internally but its machine-specific source is not represented here as public application code.`

### What not to put inside this object

- no invented terminal command;
- no fake API response;
- no fake agent name/model name;
- no fictional token/latency metric;
- no “self-healing” label unless current local implementation is directly re-inspected;
- no generic green “PASS” lights;
- no claim that this front-end snippet proves backend runtime engineering.

---

# H. MOTION SPEC

## Principle

Motion must communicate **causality and authority**, not activity.

## One-shot sequence

Recommended total duration: approximately **2.6–3.4 seconds**, then static.

1. **0.00–0.45 s — SCOPE**  
   Provenance label and BASE register. No typing.

2. **0.45–1.15 s — CHANGE**  
   One real code line becomes active; adjacent `SOURCE` / `PRODUCT` metadata resolves.

3. **1.15–1.85 s — VERIFY**  
   QA row resolves from `1440` through `320` as a restrained sequence of viewport tokens, not an animated device carousel.

4. **1.85–2.55 s — REVIEW**  
   REVIEW SHA and `ACTUAL DIFF REVIEW` register. No fake reviewer chat.

5. **2.55–3.20 s — AUTHORITY**  
   Release line appears: `MERGE / DEPLOY — HUMAN GATE`. It remains intentionally closed/static.

## Interaction

- Optional hover/tap on metadata may reveal full SHA/path.
- Copy action may exist for source path/SHA/code, but is not mandatory.
- No auto-loop.
- No cursor.
- No character scrambling.
- No continuous scrolling.

## Reduced motion

`prefers-reduced-motion: reduce` must render the complete final state immediately with no loss of information.

This is especially appropriate because the real proof snippet itself demonstrates reduced-motion handling.

---

# I. COLOR SPEC

## Ratio

Target **88–92% neutral / 8–12% semantic accent**.

### Base roles
- **Obsidian** — page field
- **Graphite** — artifact surface
- **Black Chrome** — inner border / depth / rail
- **Pearl** — primary text and active source
- **Silver** — metadata, punctuation, secondary labels
- **Controlled Indigo** — active execution/provenance path only

### Optional syntax accent
One desaturated cool steel/ice tone may be introduced for keywords/types **only if it materially improves scanning**.

### Code palette cap
Maximum **4 functional source roles** in the visible excerpt:

1. default/Pearl;
2. secondary/Silver;
3. keyword/steel;
4. active/provenance/Indigo.

No rainbow tokenization.

### State color rule
Do not default to red/green telemetry language. Use hierarchy, icon/line form, opacity and texture before adding additional status colors.

---

# J. INTEGRATION LOCATION

## Recommendation: OPTION 4 — modified to preserve proof classes

**Small real code object in Engineering Depth + expanded Engineering Handoff in Evidence.**

This is one evidence system with two exposures, not two unrelated decorative modules.

### In Engineering Depth
Show the compact 5–8 line real source excerpt with one sentence:

`Custom code enters when connectors and off-the-shelf workflow logic are no longer enough.`

Label it:

`VERIFIED TECHNICAL ARTIFACT`

Purpose: answer **“Can ProAI actually write custom code?”** early.

### In Evidence
Show the expanded immutable handoff:

`BASE → PRODUCT → QA → REVIEW → HUMAN RELEASE GATE`

Then show the internal method separately:

`VERIFIED METHOD · SANITISED INTERNAL WORKFLOW`

Purpose: answer **“Is the engineering controlled and reviewable?”**

### Explicit change from the original Option 4 wording
Do **not** place a fabricated “execution trace” in Evidence yet. Replace that part with the real Engineering Handoff until a sanitized runtime trace is recovered from the local OpenCode project.

This preserves the architecture of early code cue + later proof without violating provenance.

---

# K. CLAIM GOVERNANCE

## Allowed now

### VERIFIED TECHNICAL ARTIFACT
- `This AI Systems R1 experience includes custom front-end code.`
- `The artifact is tied to immutable product and review commits.`
- `Responsive QA was recorded across EN/RU viewport variants in the frozen review package.`

### VERIFIED METHOD
- `Engineering work is scoped, versioned, checked and reviewed against the actual diff.`
- `Higher-risk work uses independent review and explicit release authority.`
- `Coding agents may be used when local/runtime complexity justifies them.`

### VERIFIED INTERNAL IMPLEMENTATION — PARTIALLY INSPECTABLE
- `ProAI operates an internal Telegram-to-local OpenCode runtime for remote task execution, session monitoring and recovery workflows.`
- `Only sanitized architecture/method evidence should be public until the local source is re-inspected.`

### CAPABILITY
- `Custom code, APIs, scripts, tool calling, routing, state/failure handling and retrieval systems can be introduced where the problem requires them.`

This is a capability statement, not a claim that every category has already been deployed for an enterprise client.

## Not allowed without more evidence

- `production multi-agent platform`;
- `enterprise agent deployments`;
- `self-healing runtime` as a current operational guarantee;
- `full observability stack`;
- named model-router production claims;
- fake traces/logs/tool calls;
- runtime uptime/latency/success-rate metrics;
- backend/microservice production claims inferred from front-end code;
- “we can build anything.”

## Proof-class separation

| Proof class | What it should prove | What it must not imply |
|---|---|---|
| **Financial Stream** | Real client production delivery | Deep agent/runtime engineering |
| **Real code / engineering artifact** | ProAI can implement custom software behavior | Enterprise backend deployment unless specifically verified |
| **Internal AI proof** | ProAI uses controlled AI/coding workflows itself | Client deployment, public runtime source or production metrics |
| **Reference architecture** | Technical reasoning and capability ceiling | Completed implementation |

---

# L. NEXT STEP

## Recommended next production-preparation gate

**Do not edit the product yet.**

Create one narrow **Engineering Proof Content + Visual Lock** package before production implementation:

1. Freeze the exact real source excerpt and verify semantic equivalence to PRODUCT `12d39a2…`.
2. Freeze the provenance fields and links/SHAs.
3. Produce three non-production concept frames:
   - `A-code-ledger`
   - `B-execution-trace` — clearly REFERENCE/HOLD unless a real runtime trace is recovered
   - `C-engineering-handoff` — expected winner
4. Render winner at:
   - desktop 1440;
   - mobile 390;
   - mobile 320.
5. Run a truth review specifically checking that every visible status/trace/code line has an evidence class.
6. Only after Owner visual approval open a separate production implementation task.

## Optional stronger evidence upgrade before implementation

If local runtime access is available, inspect the separate OpenCode Telegram Bot runtime and export a **sanitized 6–8 event real trace** containing only non-sensitive metadata:

`task received → scope/permission → session → tool/action category → result → check → review/human gate`

Required sanitation:
- no tokens/keys;
- no local absolute paths unless safe;
- no private message content;
- no provider secret values;
- no invented timestamps/results;
- no “self-heal” claim unless the exact live implementation is verified.

If this trace passes review, Direction B can become a legitimate secondary proof later. Until then, it stays reference-only.

---

# SCHEMATIC CONCEPT FRAMES — NON-PRODUCTION

These are layout schematics only; they are not production UI.

## A — CODE LEDGER

```text
┌──────────────────────────────────────────────────────────────┐
│ VERIFIED TECHNICAL ARTIFACT                                 │
│                                                              │
│ 01  const reduce = matchMedia(…                  PRODUCT     │
│ 02  ).matches;                                   12d39a2…    │
│ 03                                                          │
│ 04  if (reduce || !IntersectionObserver) {       REVIEW      │
│ 05    revealAll();                                951898d…    │
│ 06    return;                                                 │
│ 07  }                                              QA 1440→320 │
└──────────────────────────────────────────────────────────────┘
```

## B — EXECUTION TRACE — HOLD / REFERENCE ONLY

```text
TASK ──→ PERMISSION ──→ TOOL ──→ RESULT ──→ CHECK ──→ HUMAN
          │                         │
          └── deny / scope          └── retry / fallback

REFERENCE ARCHITECTURE ONLY UNTIL REAL RUNTIME TRACE EXISTS
```

## C — ENGINEERING HANDOFF — WINNER

```text
┌───────────────────────────────┬──────────────────────────────┐
│ VERIFIED REAL SOURCE          │ ENGINEERING HANDOFF          │
│                               │                              │
│ const reduce = …              │ BASE      c945084…           │
│                               │ PRODUCT   12d39a2…           │
│ if (reduce || …) {            │ SOURCE    ai-systems-r1…js  │
│   revealAll();                │ QA        EN/RU · 1440→320  │
│   return;                     │ REVIEW    951898d…           │
│ }                             │ RELEASE   HUMAN GATE         │
└───────────────────────────────┴──────────────────────────────┘

VERIFIED METHOD · SANITISED INTERNAL WORKFLOW
SCOPE → IMPLEMENT → CHECK → REVIEW ACTUAL DIFF → HUMAN AUTHORITY
```

---

# SERIOUSNESS TEST

| Test | Result | Evidence basis |
|---|---|---|
| Understands software | **PASS** | Real code + versioned implementation/review chain |
| Can write custom code | **PASS** | Frozen AI Systems source is directly inspectable |
| Can work with APIs/tools | **PASS AS CAPABILITY / METHOD** | Internal skills/platform strategy and runtime summaries support capability; no fake client proof |
| Understands state/failure | **PASS AS METHOD / CAPABILITY** | Runtime summaries + platform strategy + prior audit patterns; do not convert into invented runtime trace |
| Does not confuse agents with chatbots | **PASS** | Internal workflow distinguishes control, tools, permissions, session/recovery, human authority |
| Understands human authority | **STRONG PASS** | Repo policy + review workflow + no merge/publish without authorization |
| Can combine off-the-shelf and custom | **PASS** | AI-OS platform strategy explicitly uses Make/n8n where appropriate and coding agents/custom components at the edge |
| Uses AI coding in a controlled process | **PASS AS VERIFIED METHOD** | `Execution_Workflow`, `codex-patch-review`, public `AGENTS.md`; exact model authorship of any displayed code is not claimed |

---

# FINAL OWNER DECISION

**CODE / ENGINEERING VISUAL:** YES

**BEST PROOF OBJECT:**  
Verified Engineering Handoff — real AI Systems R1 code + immutable PRODUCT/REVIEW/QA metadata + separate sanitized internal control method.

**REAL CODE AVAILABLE:** PARTLY  
Real public ProAI code exists. Relevant local AI-agent runtime source is not present in the inspected GitHub evidence.

**INTERNAL AI PROOF AVAILABLE:** PARTLY  
Internal runtime and governance are verified through sanitized AI-OS artifacts; exact runtime source/trace remains local-only.

**WINNING VISUAL DIRECTION:**  
Direction C — Engineering Handoff.

**RECOMMENDED LOCATION:**  
Option 4, modified: compact real code in Engineering Depth; expanded same evidence system in Evidence. No synthetic execution trace.

**MOBILE CONFIDENCE:** HIGH  
Because the winner can reduce to a 5-line source excerpt plus four stacked provenance rows at 390/320 without horizontal scrolling.

**DOES IT INCREASE $100K PERCEPTION:** YES  
If provenance, restraint and proof-class separation are preserved. A fake terminal or fake telemetry would decrease the perception.

**NEXT STEP:**  
Freeze a non-production Engineering Proof Visual Lock (A/B/C frames, 1440/390/320) and, optionally, recover one real sanitized local runtime trace before any production build.

---

# SOURCE INDEX

## ProAI immutable/internal sources inspected

- `proaiexpert/proaiexpert.github.io` — prior audit at `26da90bd1effaaa600283f36d0d8573add2748c5`
- Frozen PRODUCT `12d39a2b86c30d87bda84ea69f511cc7f8ca96f7`
- Frozen REVIEW `951898df718d595e56f7e12767fb88ea37af263c`
- `assets/js/ai-systems-r1-core.js` at PRODUCT
- `docs/site-evolution/reviews/ai-systems-r1/REVIEW.md` at REVIEW
- `AGENTS.md` at audit base
- private `proaiexpert/ai-os` main inspected at `f8c83cd253174c4daa6634ef83dc68f3d95ec1ee`
- `00_Operating_System/Execution_Workflow.md`
- `05_AI_Automation_Lab/03_Reusable_Skills/codex-patch-review/SKILL.md`
- `05_AI_Automation_Lab/03_Reusable_Skills/telegram-agent-task/SKILL.md`
- `05_AI_Automation_Lab/02_Working_Docs/OpenCode_Telegram_Bot_Runtime_Portable.md`
- `05_AI_Automation_Lab/02_Working_Docs/Stable_Baseline_OmniRoute_Node_Portable.md`
- `05_AI_Automation_Lab/02_Working_Docs/Platforms_Make_n8n_Coding_Agents_Notes.md`
- `05_AI_Automation_Lab/02_Working_Docs/Twilio_Make_A2P_Automation_Preflight.md`

## Current official benchmark sources inspected 2026-08-23

- Resend — https://resend.com/
- Resend Code Block — https://resend.com/changelog/new-code-block-component
- Trigger.dev — https://trigger.dev/
- Trigger.dev Product / AI Agents — https://trigger.dev/product and https://trigger.dev/product/ai-agents
- Inngest — https://www.inngest.com/ and https://www.inngest.com/docs/learn/inngest-steps
- Vercel AI SDK — https://vercel.com/ai-sdk
- LangGraph — https://www.langchain.com/langgraph
- Supabase — https://supabase.com/
- Clerk — https://clerk.com/docs/
- Liveblocks — https://liveblocks.io/docs/ and https://liveblocks.io/examples/
- Warp — https://www.warp.dev/agents and https://www.warp.dev/code
- Raycast Developers — https://www.raycast.com/developers
- Neon — https://neon.com/
- Convex — https://www.convex.dev/ and https://docs.convex.dev/agents/workflows
- Sentry AI Agent Monitoring — https://sentry.io/changelog/ai-agent-monitoring--open-beta/
- E2B — https://e2b.dev/
- Upstash — https://upstash.com/

---

**NO PRODUCT CHANGES. NO REVIEW CHANGES. NO MAIN CHANGES. NO MERGE. NO DEPLOY.**
