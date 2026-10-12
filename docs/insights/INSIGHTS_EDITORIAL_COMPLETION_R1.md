# ProAI Expert — Insights Editorial Completion R1
Status: PLAN ONLY / READ-ONLY RESEARCH COMPLETE / NO PRODUCTION CHANGES
Created: 2026-10-11
Repository: proaiexpert/proaiexpert.github.io
Audit base (verify fresh main before every implementation): f1c3bda0b37374c6e0797e5ac34c61fb1bc9968f

## Mission
Complete the existing bilingual Insights library to a consistent premium Article V2 Decision Document standard, increase original factual utility, strengthen commercial pathways to Websites & Branding and case studies, then publish at least one original high-intent SEO article to attract qualified U.S. service-business website clients. Do not conflate visual polish with content depth. No SEO ranking promises.

## Audited inventory
The _data/insights.yml authority defines 12 bilingual publications (24 language pages).
Article V2: 01 lead-response, 02 multilingual, 03 proposal-evaluation, 04 ai-ready-website, 05 ai-search.
Legacy full HTML / layout:null EN/RU: 06 builder-vs-custom, 07 first-automation-roi, 08 ai-agent-vs-automation, 09 process-clarity, 10 conversion-architecture, 11 website-cost, 12 premium-website.
Article 05 is only approximately 1,000 words per locale, with 7 H2, no citations to authoritative external sources, no tables/structured decision matrix, and Russian copy containing avoidable anglicisms (mindset, framework, AI visibility, discovery). Its theme overlaps Article 04 unless clear page-level search intent and complementary frameworks are authored.
The Insights Hub in _layouts/insights-hub-v2.html hardcodes '12 materials' and '12 active articles'. Change to data-driven count before publishing Article 13, while checking proper RU singular/plural or using a numerically neutral construction.
Article 07 metadata has EN published 2026-04-12 vs RU published 2026-04-05; verify actual history, do not silently rewrite historical publication dates.
Commercial authority: /websites-branding/ and /ru/websites-branding/. Preserve these as principal service conversion endpoints; Insights articles are educational support, not alternate SEO landing pages with competing identical intent.

## Execution order and boundaries
### D — Article 05 AI Search EN/RU: FIRST. One complete writer + implementation + reviewer task.
Rewrite comprehensively from research with unique service-business guidance and accurately attributed original models. Distinguish Google Search AI Overviews / AI Mode, ChatGPT search/discovery, classic SEO and human decision process; do not suggest uniform crawling/indexing mechanics or guarantee citation. Base factual platform claims on primary documentation, including:
- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/appearance/structured-data/article
- relevant OpenAI publisher/crawler official documentation, checked live before publication.
Deliver 2–3 genuinely useful diagrams or semantic HTML tables: (i) four-channel visibility boundary; (ii) claim-to-evidence matrix, (iii) prioritized 30/60/90-day plan with no invented ranking uplift, plus practical audit example. Connect to 04 (website readiness), 02 (multilingual), commercial service page, case study and contact. Natural RU/EN parity, distinct writing, no transliterated editorial jargon. Rewrite TOC/Chapter Rail. Keep canonical slugs and actual datePublished. dateModified only on real substantive update. No fake experiments, rankings, customer testimonials or numbers.

### Commercial-priority migration — articles 10, 11, 06, 12.
10 Conversion Architecture: original lost-lead diagnostic with proof and service/geo/CTA architecture, clear differentiation from future Article 13.
11 Website Cost: scope-based costing logic, pricing uncertainty, annual/yearly references maintained, decision framework, no unsupported price ranges.
06 Builder vs Custom: neutral total-cost/ownership/limits matrix; when builder genuinely wins; avoid hard sell.
12 Premium Website: differentiate conversion systems, brand trust, proof design and site engineering without aesthetic platitudes.
Each paired EN/RU migration must preserve route, existing factual thesis, canonical and hreflang, proper author, truthful dates, original metadata, internal links and full footer. Remove old standalone wrappers only when Article V2/Jekyll renders correctly. One owner-preview and independent gate per wave; work in isolated branches.

### Operations-priority migration — articles 08, 07, 09.
08 Agent vs Automation: autonomy boundary / human approval / exception ownership, execution risk.
07 First Automation ROI: quantitative worksheet with hypothetical examples CLEARLY labeled, not claimed client results; reconcile EN/RU publication history separately.
09 Process Clarity: owner/router/exception operating framework. Pair with 01 lead response.
Evaluate whether 01/02/03 need targeted citation, terminology and metadata polish AFTER migrations, not a wholesale redesign.

### Cross-library SEO & product wiring
- Compare publication metadata to real content and file history; no fabricated freshness.
- Dynamic Hub item count and RU grammar.
- Validate bidirectional related_ids / inbound/outbound link integrity as new articles appear.
- Every article: unique decision intent, answer-first intro, original method or examples, source-supported claims, substantive takeaway, accessible semantic figures/tables, contextual links and relevant commercial CTA. No forced uniform word count.
- Jekyll, validators, Site Shell, Golden Footer, no-JS, keyboard, reduced-motion, touch table scroll, 320–1920 responsive, Chromium/WebKit, EN/RU parity.
- Inspect actual live canonicals, hreflang, Article schema, author Organization vs Person according to true editorial authorship.
- Preserve existing premium Article V2 visual authority. No sitewide redesign or new CSS stacks.
- Each release only after independent Controller PASS and explicit Owner permission. Do not merge multiple unrelated experiments.

### Original SEO acquisition article — Article 13
Provisional topic hypothesis, validate search intent and cannibalization against existing 03/06/10/11 before final manuscript:
RU: «Нужен ли вашему бизнесу редизайн сайта? Практический аудит перед заказом нового сайта»
EN: «Does Your Service Business Need a Website Redesign? A Decision Audit Before You Hire»
Purpose: capture business owners actively considering a new site / redesign (mid-to-bottom funnel) without replacing /websites-branding/ service page. Audience: U.S. small/service-business owners, incl. qualified bilingual operators.
Unique original asset: a 15-minute decision audit with evidence tiers, website problem vs offer/process problem, redesign vs targeted repair matrix, SEO migration risk checklist, scope brief, decision outputs.
Soft CTA: request a project-fit review; primary conversion destination Websites & Branding or project intake; link to case studies and proposals/cost/conversion/AI-ready supporting articles.
Build Article V2 EN/RU with unique titles/descriptions, original examples, real source evidence, schema, indexed canonical pages, reviewed published/modified dates. No mass keyword stuffing, AI-citation guarantees, generic FAQ padding, fabricated testimonials or stock metrics.
IMPORTANT: Publish Article 13 soon after Stage D and initial commercial priorities where feasible; do NOT block release until every legacy article is migrated.

## Measurement & acceptance
Evaluate search demand and cannibalization from actual Search Console/GSC/GA4 query-to-page observations when data access is available, plus verified current SERP intent. Do not invent keyword volume/positions/leads.
No functional or editorial PASS unless live Jekyll Cloudflare owner preview and true Article V2 content reviewed on desktop and iPhone portrait+landscape.
Measure inquiry flow, project-fit submissions, organic search traffic, relevant queries and qualified conversations after publication; no causal SEO claims without evidence.
Owner approves each production merge independently.

## Immediate next task for executor
ARTICLE 05 / STAGE D — RESEARCH → COMPLETE EN/RU REBUILD → EDITORIAL QA → JEKYLL OWNER PREVIEW, in an isolated implementation branch from fresh main, no merge.
Deliver article manuscript plus working page and accurate bibliography, proof of no broken navigation, QA summary and direct owner-preview URLs. Stop at Controller review.
