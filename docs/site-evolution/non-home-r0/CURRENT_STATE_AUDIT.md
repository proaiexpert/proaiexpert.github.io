# ProAI Expert — Non-Home Current-State Audit R0

Status: **FORENSIC / PLANNING ONLY**  
Base: `c945084e1952c05c686494091f7dbca0f7acdf08`  
Date: 2026-08-21

## Executive current-state verdict

The non-home site is **not at the same experiential level as the new homepage direction**.

The constraint is not mainly content. The strongest pages already contain useful operating logic, practical AI boundaries, credible service framing, a low-friction contact model, honest case-status labeling, and several premium editorial bodies.

The main gap is the presentation/implementation generation:

- commercial standalone pages are large self-contained HTML files with substantial inline CSS;
- legacy page-local headers and logo behavior remain embedded even though a canonical Header System now exists;
- old cyan-heavy glow, background grid/thread treatment and generic reveal blur remain dominant;
- repeated rounded dark panels, matrices and card groups create visual sameness;
- responsive behavior contains accumulated normalization/recovery patches rather than a clean page-family system;
- motion is frequently generic reveal behavior rather than meaning-bearing choreography;
- proof is uneven: Websites has real project evidence, while AI Systems currently describes plausible structural effects more strongly than it proves them with a client artifact;
- late-page CTA and footer CTA can duplicate one another.

**R0 decision:** preserve content authority selectively; rebuild the commercial-page shell, visual grammar, responsive composition and motion architecture. Do not migrate frameworks merely to make the code look modern.

## Infrastructure authority

### Header

Canonical authority for new work:

- `_includes/header-system/header.html`
- `_data/navigation.yml`
- `_data/header.yml`
- `assets/css/header-system-v1.css`
- `assets/js/header-system-v1.js`
- `assets/css/header-footer-logo-r1.css`
- `assets/js/header-footer-logo-r1.js`

The repository's existing Header Legacy Cleanup Map already states that commercial standalone pages are the first recommended physical migration target. Page-local `logoSpin`, button metrics and font defaults are explicitly non-authoritative.

### Footer

The current shared commercial footer is useful as a structural baseline, while Homepage Footer R2 is a separate signature treatment. R0 recommends an inner-page derivative rather than repeating the full Homepage Footer R2 interaction on every long inner page.

### Fonts

Local variable Inter files for Latin and Cyrillic already exist. Later work should use those local assets and remove page-level Google Fonts dependencies where the page family is rebuilt.

## Live-web audit limitation

Live pages and current semantic content were successfully opened through the live web research channel. Direct pixel-accurate browser rendering at the requested viewport set could not be truthfully completed in this execution environment because local browser navigation to the public site is administratively blocked. Therefore:

- live content/route audit: **PASS**;
- repository responsive-source audit: **PASS**;
- claimed pixel-level 1440/1366/1024/390/320/landscape visual PASS: **NOT CLAIMED**.

The later builder must execute the full viewport matrix in a real browser and commit screenshots before Owner review.

## Family-level matrix

| Page family | Content authority | Visual system | Header state | Footer state | Mobile state | R0 verdict |
|---|---|---|---|---|---|---|
| AI Systems EN/RU | Strong operating logic; RU especially direct about process-first and what not to automate | Legacy dark/cyan, matrices/panels, generic reveal | Legacy copied/page-local + compatibility layer | Shared commercial footer | Patched/responsive but not mobile-authored | **KEEP CONTENT / REBUILD EXPERIENCE** |
| Websites & Branding EN/RU | Strong trust/architecture framing; some unsupported causal language needs tightening | Legacy dark/blue/cyan, repeated panels/tables | Legacy copied/page-local + compatibility layer | Shared commercial footer | Responsive but desktop architecture remains dominant | **KEEP CORE / REBUILD EXPERIENCE / TIGHTEN CLAIMS** |
| About EN/RU | Strong system-thinking and standards; useful founder accountability | Same legacy visual grammar; founder card arrives too early as a primary device | Legacy copied/page-local + compatibility layer | Shared commercial footer | Responsive patches present | **EVOLVE** |
| Contact EN/RU | Strongest conversion logic: low friction, routing by need, clear next step, direct alternatives | Visual shell is older than logic | Legacy/shared parity bridge | Shared commercial footer | Functional; needs cleaner native mobile composition/form rhythm | **PRESERVE LOGIC / REBUILD SHELL** |
| Case archive EN/RU | Strong truthful status taxonomy and cross-case logic | Older atlas/panel system | Legacy/shared parity bridge | Shared commercial footer | Needs new archive hierarchy | **EVOLVE** |
| Financial Stream EN/RU | Strongest real external proof; dated GSC evidence and limitations | Case-specific system stronger than old service pages | Existing system should migrate carefully | Existing case footer | Responsive evidence contract exists | **PRESERVE EVIDENCE / EVOLVE SHELL** |
| Alina Horb EN/RU | Real-project proof | Case-specific | Existing | Existing | Needs family parity | **EVOLVE** |
| Local Repair Pro EN/RU | Useful demonstration / in-development proof if status remains explicit | Case-specific | Existing | Existing | Needs family parity | **EVOLVE; NEVER PRESENT AS EQUIVALENT LIVE CLIENT RESULT** |
| Insights hub EN/RU | Strong article inventory | Hub reads partly as archive and duplicates discovery layers | Existing | Existing | Needs editorial mobile model | **REPLACE HUB ARCHITECTURE, KEEP CONTENT** |
| Premium article bodies EN/RU | High authority; several frozen methodology/source systems | Newer article work is materially stronger than legacy pages | Mixed depending generation | Existing | Tables/source blocks need shell review | **PRESERVE BODIES / EVOLVE SHELL** |
| 404 | Minimal functional content | Bare utility page, no shared system | None | None | Simple but unbranded | **REBUILD IN WAVE 5** |
| Privacy / Terms | No public route verified | N/A | N/A | N/A | N/A | **CONTENT/LEGAL GAP — DO NOT INVENT** |

## AI Systems — element forensic table

| Element | Current value | Keep | Evolve | Remove | Why |
|---|---|---:|---:|---:|---|
| Hero | Clear category and audience; useful anti-hype positioning | Copy intent | Composition, art direction, CTA hierarchy | Generic orchestration visual if it reads as decoration | Current service clarity is useful, but opening is visually interchangeable with many AI agencies |
| Page intro / starting point | Strong audit-first framing | Yes | Compress and make first commercial decision clearer | Repetitive setup language | Good differentiator: process before software |
| Problem framing | Missed leads, fragmented tools, weak visibility are relevant | Yes | Convert from generic problem blocks into one operational narrative | Repeated dark cards | Problems should cause the visual system, not fill a grid |
| Capabilities | Content coverage is strong | Capability families | Replace wide matrix with authored decision architecture | Dashboard/table styling as default | Current matrix is information-rich but visually product/SaaS-like |
| Methodology / protocol | Audit → architecture → build → launch → refine is credible | Logic | Give each step evidence/decision boundaries | Repeated step-card stack | Keep discipline, remove template feel |
| AI vs automation judgment | RU page is particularly strong | Yes | Promote to major chapter in both locales | None | This is one of ProAI's best non-hype differentiators |
| Proof | Structural effects are plausible but not sufficiently evidenced as client outcome | Claim limits | Relabel as reference scenarios / design patterns unless real artifacts exist | “Operational Proof” language that implies verified outcome | No invented dashboards or outcomes |
| Governance | Privacy, rollout, boundaries, scalability are strategically strong | Yes | Make more concrete and less card-based | None | Human control is core brand authority |
| Examples | Two scenarios are useful | Yes, explicitly bounded | Use artifacts/process traces if available | Any implication they are completed client outcomes without evidence | Honest status improves authority |
| Technology / integrations | Useful only as implementation context | Quiet text-level support | Organize by function, not logo theater | Logo marquee / tool catalog | ProAI sells system judgment, not logos |
| CTA | “Discuss the system” is relevant | Intent | One page-level primary CTA cadence + clear expectation | Duplicate final CTA + footer CTA rhythm | Reduce repeated conversion pressure |
| Footer | Shared utility/content useful | Utility logic | Inner derivative | Full Homepage signature interaction by default | Avoid competing signature effects |
| Mobile | Content survives, but architecture remains desktop-derived | Meaning | New mobile sequence | Shrunk matrices / hover assumptions | Mobile must become its own narrative |

## Websites & Branding — element forensic table

| Element | Current value | Keep | Evolve | Remove | Why |
|---|---|---:|---:|---:|---|
| Hero | Clear service category; “business system” territory is strong | Positioning intent | More ownable editorial composition; claim discipline | Generic blue/cyan premium-agency opening | Service must demonstrate judgment through composition |
| Starting point | Useful baseline around trust, structure and bilingual needs | Yes | Tighten | Repetition | Good commercial intake logic |
| Problem framing | Trust/perception issues are relevant | Core | Reduce causal overclaiming | Unsupported “better-quality inquiries” certainty | Trust can be framed without inventing conversion evidence |
| Presentation Architecture | Good content taxonomy | Concepts | Replace spreadsheet-like matrix | Generic table/panel shell | The page should embody hierarchy rather than describe it in a matrix |
| Method / narrative build | Sequence is credible | Yes | Make decisions and validation explicit | Repeated step cards | Stronger if it shows actual design judgment |
| Multilingual logic | Important business-specific strength | Yes | Promote from feature to operating capability | None | Relevant to ProAI market and existing EN/RU authority |
| Proof | Financial Stream is meaningful real external proof | Financial Stream, factual artifacts | Add status/provenance and use Alina appropriately | Treating ProAI self-site as equivalent external client proof | External evidence must outrank self-congratulation |
| Production craft | Performance/responsive/typography claims are relevant | Yes | Connect to real QA artifacts | Decorative “surface quality” rhetoric | Proof craft with behavior, not adjectives |
| Technology | Necessary but secondary | Performance/accessibility implementation | Quiet implementation chapter | Tool-stack display | Website value is architecture/trust, not stack |
| CTA | Low-friction discussion fits | Intent | Context-specific expectation | Repeated final CTA cadence | Keep calm commercial behavior |
| Footer | Shared utility useful | Utility | Inner derivative | Repeated Homepage Footer R2 interaction | Preserve site rhythm |
| Mobile | Needs real editorial recomposition | Meaning | Dedicated mobile authority-frame treatment | Desktop matrix stacking | Mobile should strengthen proof and hierarchy |

## About

### Keep

- ProAI as one practice spanning internal systems and external digital presence.
- Working standards and judgment.
- Human accountability and founder credibility where relevant.
- Location/language/working context if factual and useful.

### Evolve

- Move from founder-card-led visual emphasis toward operating principles and accountability.
- Use founder identity as evidence of responsibility, not a heroic centerpiece.
- Replace old panel/reveal grammar.

### Remove

- Any résumé-wall expansion, motivational biography or oversized founder portrait direction.

## Contact

### Keep

- “You do not need a polished brief” logic.
- AI Systems / Websites & Branding / Both / Not sure routing.
- Short contextual inquiry rather than a huge qualification form.
- Clear explanation of what happens next.
- Direct email/Telegram alternatives where still current.

### Evolve

- Form semantics, visible labels, errors/success, honeypot implementation, mobile spacing and confirmation state.
- One calm conversion composition rather than card/funnel aesthetics.

### Do not add by default

- AI chat widget.
- Public calendar as primary CTA.
- Forced account.
- Fake scarcity.
- Long multi-step intake.

## Case Studies

### Keep

- Real client work first.
- Explicit project status.
- Financial Stream as flagship proof.
- Existing evidence limitations.
- `LIVE CLIENT / LIVE WEBSITE / DEMO / IN DEVELOPMENT` distinctions where factually correct.

### Evolve

- Archive discovery by problem / intervention / proof rather than identical cards.
- Case shell: context → decision → system → evidence → limitations → next relevant path.
- Media captions/provenance.

## Insights

### Keep

- Frozen premium article bodies and methodology.
- Source links, tables, frameworks and risk systems.
- Native EN/RU editorial differences.

### Evolve

- Hub taxonomy and discovery.
- Reading progress / in-article navigation if useful.
- Source treatment, responsive tables, related insight logic and service-path relevance.
- End CTA should be contextual, not sales-heavy.

### Remove

- Hub duplication between selected materials and generic archive presentation.
- “Blog grid” logic as primary architecture.

## Claim-governance correction: Financial Stream

R0.1 reconciles Financial Stream evidence authority across repository history.

The newer committed product authority is Financial Stream R1.4:

- product commit: `d6e33b1c428d3478072c3fdf728c50a27ae0461b`;
- EN authority: `_includes/home-work-proof-financial-stream-r1-4-en.html`;
- exact blob: `7f272fd438ca97a37dd86f30da9244bcfaf56923`.

That authority explicitly establishes:

- **63 organic clicks**;
- **8.36K search impressions**;
- **52 indexed pages**;
- Google Search Console · **6-month performance snapshot · Aug 2026**;
- indexing updated **Aug 16, 2026**.

The older production-main evidence source remains a valid **historical earlier snapshot**:

- 57 organic clicks;
- 7.24K search impressions;
- 50 indexed pages.

Those older values are not the current redesign authority. The older source also contained `0.8% CTR`, `35.2 average position`, and `13 not indexed`; R0.1 does **not** merge those fields into the newer Aug-16 authority. Any future use of CTR, average position, or not-indexed counts requires separate verification against a current evidence source.

The current `63 / 8.36K / 52` evidence supports search visibility and indexing/content footprint only. It does **not** prove lead growth, sales, revenue, conversion uplift, SEO ROI, ranking guarantees, or future performance.

## Current level by evaluation dimension

| Dimension | Verdict | Main reason |
|---|---|---|
| First impression | Below target | Openings use familiar dark-tech/service-page grammar rather than an authored service-specific idea |
| Positioning | Strong | Core business logic is materially better than generic agency copy |
| Content hierarchy | Mixed | Strong content, but too much is given equal visual weight |
| Trust | Good | Human-review/process discipline and real client cases help |
| Proof | Uneven | Financial Stream is strong; AI service proof is largely structural/scenario-based |
| CTA | Good logic | Low pressure, but page/footer repetition can be tightened |
| Rhythm | Below target | Repeated panel/matrix/step structures reduce chapter contrast |
| Motion | Below target | Generic reveal behavior dominates; semantic motion is limited |
| Mobile | Not Owner-review ready | Responsive code exists, but mobile-specific art direction has not been proven in this R0 execution |
| EN quality | Generally strong | Some generic agency phrasing and causal claims need editing |
| RU quality | Often stronger/direct | Some mixed terminology and page-specific wording defects need editorial QA |
| Consistency with new homepage level | Low-to-medium | Brand logic aligns; craft/material/motion implementation generation does not |

## Core decision

The right move is **not** to make inner pages look like copied pieces of the homepage. It is to create a separate inner-site grammar with:

- the canonical Header;
- shared typography, spacing, proof and CTA rules;
- fewer containers and more editorial structure;
- material differentiation by service meaning;
- one service-specific signature idea per pilot page;
- an inner Footer derivative;
- page-family CSS/JS ownership;
- mobile-authored compositions;
- evidence adjacent to claims;
- no framework migration unless implementation evidence later requires it.
