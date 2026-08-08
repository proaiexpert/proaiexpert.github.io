# ProAI Expert — Hero Owner Candidate + Homepage Next Phase

Date: 2026-08-08

Status: **TEMP OWNER CANDIDATE — APPROVED FOR BROWSER IMPLEMENTATION / NOT PRODUCTION COPY LOCK**

Repository: `proaiexpert/proaiexpert.github.io`

This document preserves the current decision state after the 45-site premium benchmark synthesis and the final EN/RU validation pass. It also defines the next work sequence so a fresh Control/Builder/Reviewer chat can continue without reopening settled research.

---

## 1. Benchmark already completed — do not restart for Hero

A dedicated premium Hero benchmark was completed against **45 current sites**:

- 17 global premium digital / product / brand studios;
- 15 product / technology companies;
- 13 Russian-language digital / technology / B2B brands.

Three sites had render-limited Hero content and were not used as key evidence.

Strategically important references included Work & Co, Clay, Code and Theory, Instrument, BASIC/DEPT, Linear, Scale AI, K2 Cloud, Nimax, ONY and AGIMA.

Core synthesis:

1. Strong premium Heroes usually carry **one dominant proposition**, not three unrelated benefit statements.
2. A hybrid/not-yet-famous brand needs immediate category clarity.
3. Premium tone comes from editing, hierarchy, proof and art direction more than expensive vocabulary.
4. H1 should carry meaning; support should explain the mechanism.
5. H1 should not be forced to carry SEO, positioning and a service list simultaneously.
6. ProAI's strongest territory is the connection between what a prospect sees **before inquiry** and how the business handles the inquiry **afterward**.
7. The former three-line H1 pattern (`Build trust. / Handle inquiries. / Reduce manual work.`) was an architectural constraint and is rejected as the primary brand-level Hero model.
8. Russian premium B2B copy should remain direct and native rather than mechanically mimic English rhetoric.
9. Human control belongs in explanatory copy, not the headline.
10. The C-shape should communicate one connected journey, not compete with three disconnected benefit lines.

Hero benchmark conclusion:

`SHORT CATEGORY EYEBROW → ONE POSITIONING H1 → CONCRETE SUPPORT → C-SHAPE JOURNEY`

This architecture is now the working system.

---

## 2. Current owner-candidate Hero copy

### RU

**EYEBROW**

`AI-СИСТЕМЫ · АВТОМАТИЗАЦИЯ · ПРЕМИАЛЬНЫЕ САЙТЫ`

**H1**

`От первого впечатления до результата —`
`одна система.`

**SUPPORT**

`Создаём премиальные сайты для компаний в сфере услуг и соединяем их с AI-системами и автоматизацией. Клиенту проще понять ваши услуги и обратиться, а вам — получать нужную информацию, быстрее отвечать и тратить меньше времени на повторяющиеся задачи. Важные решения остаются за человеком.`

**PRIMARY CTA**

`Запросить разбор`

**MICROCOPY**

`Коротко опишите задачу. Мы предложим, с чего разумнее начать.`

**SECONDARY CTA**

`Смотреть проекты`

**ACCOUNTABILITY**

`Штат Вашингтон · Работаем по всей США · EN / RU / UA`

**RAIL**

1. `ДОВЕРИЕ`
2. `ОБРАЩЕНИЕ`
3. `ОТВЕТ`
4. `РЕЗУЛЬТАТ`

### EN

**EYEBROW**

`AI SYSTEMS · AUTOMATION · PREMIUM WEBSITES`

**H1 — current native-English owner candidate**

`From first impression to follow-through —`
`one connected system.`

Important semantic note: `follow-through` is not `follow-up`. It means carrying the work through rather than merely making another contact. The RU H1 is not a literal translation; both versions share the same strategic territory.

**SUPPORT**

`We build premium websites for service businesses and connect them with AI systems and automation. Customers can understand your services and reach out with the right information; you can respond faster and spend less time on repetitive work. You stay in control where judgment matters.`

**PRIMARY CTA**

`Request a Private Review`

**MICROCOPY**

`Briefly describe the challenge. We’ll recommend where to start.`

**SECONDARY CTA**

`View Work`

**ACCOUNTABILITY**

`Washington-based · Working across the U.S. · EN / RU / UA`

**RAIL — current candidate**

1. `TRUST`
2. `INQUIRY`
3. `RESPONSE`
4. `OUTCOME`

### Copy status

- Architecture: accepted working direction.
- RU candidate: owner has approved it to move into browser implementation for visual review.
- EN candidate: same strategic system, native English; still subject to final browser-context review.
- This is **not** a production `COPY LOCK` yet.
- No future agent should reopen the old three-line H1 without concrete evidence of a real failure.

---

## 3. Typography / hierarchy intent

The shortened eyebrow is intentionally **more readable**, not smaller.

Working visual hierarchy:

1. cyan category marker — readable information, not micro-decoration;
2. strong H1, approximately two visual lines desktop;
3. restrained explanatory support;
4. CTA + microcopy;
5. accountability;
6. C-shape + semantic rail.

Guidance:

- desktop eyebrow: roughly 12–14px equivalent at actual browser scale, medium/semibold, restrained tracking;
- allow mobile eyebrow to wrap rather than shrinking into illegibility;
- H1 should retain editorial air and avoid six-line benefit stacking;
- support should use controlled measure rather than artificially wide lines;
- cyan remains signal/category color, not decorative glow.

---

## 4. C-shape semantic model

The C-shape is now interpreted as a **complete customer/business journey**, not an internal CRM workflow.

RU:

`ДОВЕРИЕ → ОБРАЩЕНИЕ → ОТВЕТ → РЕЗУЛЬТАТ`

EN:

`TRUST → INQUIRY → RESPONSE → OUTCOME`

The final word is a conceptual endpoint, not a guarantee of revenue, conversion or a particular KPI.

`СОПРОВОЖДЕНИЕ` / `FOLLOW-UP` are no longer preferred for the Hero rail because they end the brand-level journey on another operational task rather than a destination.

---

## 5. Visual source / current browser checkpoint

C-shape remains the selected visual direction.

Authoritative STATIC MASTER:

- `FA5872D6-EA1E-4865-A94B-74CE5CFDB7F8.jpeg`
- 1536×1024
- SHA-256 `c2cecdc255eb3c0d68de142dcbddba6e8cedf1f3f036b9f9ec62c562ef66d9e4`

Drive folder:

- `ProAI Expert - Hero A+ Review - 2026-08-07`
- folder ID `1wqHjUAfk2vOJcY013V0EX2LtK0aszPZS`

Grounding R2 browser checkpoint:

- branch `agent/hero-c-shape-grounding-polish-r2`
- HEAD `edbfb860b577a74bdfd0515c3474ad3e66c060eb`

R2 solved the major floating/cutout defect through the registered environment + sharp Core stack and removed independent Core motion that could break grounding.

R2 is the correct base for the next Hero browser pass.

---

## 6. Next Hero implementation gate

Do **not** jump directly to production root `/` and `/ru/` merely because the copy is now coherent.

Next safe step:

### R3 — browser-context owner-candidate implementation

Start from the verified R2 checkpoint on a new narrow branch.

Goals:

1. replace old Hero copy with the current EN/RU owner candidate;
2. implement the shortened, more readable cyan eyebrow;
3. update the external rail to RU `ДОВЕРИЕ / ОБРАЩЕНИЕ / ОТВЕТ / РЕЗУЛЬТАТ` and EN `TRUST / INQUIRY / RESPONSE / OUTCOME`;
4. preserve R2 Core geometry, environment registration and no-detachment motion rules;
5. apply only small visual micro-polish if needed for text/Core spacing, rail hierarchy, floor/contact richness and browser balance;
6. produce real EN/RU desktop + mobile browser screenshots for owner review;
7. do not merge/deploy production Homepage during this pass.

Owner gate after R3:

- `OWNER HERO APPROVE` → unlock Hero-only production integration;
- or `TARGETED CORRECTION` → correct only the identified defect.

Technical ACCEPT is not owner visual approval.

---

## 7. After Hero — mandatory Homepage-wide premium synthesis

Once Hero is owner-approved in browser, do **not** immediately polish the current Homepage section-by-section from habit.

First run a dedicated **Homepage-wide premium benchmark synthesis**.

Reuse the 45-site Hero benchmark as the seed corpus; do not waste time repeating the same Hero research. Re-inspect roughly 35–50 strong sites specifically at **full-page architecture level** and expand the corpus only when a missing pattern needs evidence.

The Homepage-wide audit must evaluate:

- section order / narrative progression;
- number of sections and total page length;
- information density and whitespace;
- capability/service presentation;
- case-study/proof placement;
- visual storytelling and section-to-section contrast;
- motion / 3D / interaction value versus spectacle;
- CTA cadence;
- founder/personality proof;
- insights/editorial block value;
- trust/accountability placement;
- mobile sequencing;
- performance/accessibility implications;
- SEO/entity coverage without visible keyword stuffing;
- EN/RU architecture parity without literal translation.

Each existing Homepage block must receive one verdict:

`KEEP / REFINE / MERGE / MOVE / REPLACE / REMOVE`

No block survives merely because it already exists.

### Founder block — explicit open question

Current production contains a dedicated `homepage-founder-proof` section with founder portrait, founder copy, About and LinkedIn links.

Initial strategic hypothesis for the future audit:

- a large founder-centered/quote-style block is **not automatically justified** for ProAI;
- ProAI should feel like an institutional premium studio/system partner, not a personality brand;
- founder accountability can still be useful, but may be stronger as a compact human-proof/accountability element or on the About page rather than a full Homepage section;
- final verdict must come from the Homepage-wide benchmark, not from ego or reluctance to show the founder.

### SEO / visible copy principle

Do not preserve a visible Homepage section merely because someone once called it “SEO content.”

Search relevance should be carried by the total semantic architecture — title/meta, H1/H2 hierarchy, concise section copy, service pages, internal linking, schema/entities, proof/case studies and useful editorial content.

The Homepage should not contain a visibly weak or repetitive block solely to stuff keywords.

---

## 8. Recommended fresh-chat operating model

After this document is saved, use a **fresh Control/Reviewer chat as the brain** and a **separate Builder chat for implementation**.

Reason:

- the current long thread contains too many superseded Hero hypotheses;
- the repository now contains the current decision state, so a fresh chat can start from canonical context rather than conversation anchoring;
- separating Control/Reviewer from Builder reduces the chance that the coding agent starts redesigning strategy while implementing.

Roles:

### Fresh Control / Reviewer chat

Owns:

- decision quality;
- owner-candidate consistency;
- browser screenshot review;
- benchmark synthesis;
- Homepage-wide architecture decisions after Hero;
- scope control and handoff quality.

### Builder chat

Owns:

- branch implementation;
- HTML/CSS/JS/assets;
- EN/RU parity;
- browser QA;
- screenshots/artifacts;
- commits to the dedicated branch only.

Builder must not independently reopen strategy or publish production.

---

## 9. Larger Homepage sequence — provisional only

Historical working sequence exists, but it is **not locked** pending the Homepage-wide premium benchmark:

1. Hero
2. Connected Business Journey
3. Two Core Directions
4. Financial Stream proof
5. Ways to Start
6. Controlled Delivery
7. Founder accountability
8. Selected Work
9. Insights
10. Final Private Review

The future full-page audit is explicitly allowed to remove, merge, reorder or replace these blocks. In particular, Founder accountability and Insights must earn their place rather than being preserved automatically.

---

## 10. Non-negotiable process rule

Do not confuse:

`TECHNICAL ACCEPT`

with

`OWNER VISUAL APPROVAL`.

No production merge/deploy until the owner has reviewed the actual browser result and explicitly authorizes it.
