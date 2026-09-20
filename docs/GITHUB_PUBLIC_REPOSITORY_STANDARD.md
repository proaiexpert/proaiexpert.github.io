# ProAI Expert Public GitHub Repository Standard

## Purpose

This standard defines how ProAI Expert presents public repositories so the GitHub account functions as a professional discovery, trust, portfolio, and future product channel.

The objective is not to make every repository look identical. The objective is to make every public repository immediately understandable, accurately classified, professionally documented, and clearly connected to the ProAI Expert brand.

## Core principles

1. **English-first public presentation**  
   Repository descriptions and primary README navigation should be understandable to an international GitHub audience. Russian- or Ukrainian-language destinations must be labeled explicitly.

2. **Truthful project status**  
   Live client work, internal tools, public products, concepts, previews, archived duplicates, and planned work must never be presented as equivalent.

3. **Canonical source clarity**  
   Every project must identify its canonical repository, live domain, case study, and current status where applicable.

4. **Evidence discipline**  
   Metrics, outcomes, rankings, inquiries, revenue, credentials, and client results may be stated only when verified, dated, and properly scoped.

5. **Useful first screen**  
   A visitor should understand what the project is, whether it is live, who it serves, and where to go next without reading the entire README.

6. **Public value over internal history**  
   Public READMEs should prioritize project purpose, capabilities, evidence, and access. Long implementation history, obsolete ZIP notes, and temporary workflow details belong in `docs/` or internal handoffs.

7. **No artificial credibility signals**  
   Do not add fake badges, unsupported test percentages, fabricated downloads, fake reviews, guaranteed results, or decorative counters that imply unverified adoption.

---

## Repository classes

Every public repository must belong to one class.

### A. Profile repository

Example: `proaiexpert/proaiexpert`

Purpose:

- present ProAI Expert and Ihor Horb;
- direct visitors to the website, selected work, LinkedIn, X, and contact paths;
- explain current areas of work;
- provide a stable public entry point for future tools and applications.

Required status wording:

- `Public GitHub profile`

Primary destination:

- `https://proai-expert.com/`

### B. Company production repository

Example: `proaiexpert/proaiexpert.github.io`

Purpose:

- serve as the canonical source for the ProAI Expert website;
- present the company, services, selected work, evidence, and technical approach;
- document production guardrails and repository status.

Required status wording:

- `Production source`
- `Live website`

### C. Live client project

Example: `proaiexpert/alina-horb-website`

Purpose:

- document a real implemented client project;
- identify the live site and language system;
- explain the business, editorial, technical, and UX scope;
- distinguish verified implementation from planned work.

Required status wording:

- `Live client project`

Prohibited:

- implying rankings, inquiries, revenue, or business outcomes without evidence;
- presenting private client information;
- describing planned features as implemented.

### D. Concept or demonstration project

Example: `proaiexpert/handyman-vancouver-portland-demo`

Purpose:

- demonstrate product thinking, website architecture, automation concepts, or vertical expertise;
- show production-like quality without claiming a real operating business or client engagement.

Required status wording:

- `Concept`
- `Demonstration`
- `Not a verified operating business` where relevant.

Prohibited:

- fictional testimonials, ratings, addresses, staff, credentials, guarantees, availability, or project history;
- presenting demo contact details as real business contact data;
- omitting the concept classification from the first screen.

### E. Public product or open-source tool

Future class for reusable applications, libraries, templates, automations, agents, or developer tools.

Required status wording must identify one of:

- `Public release`
- `Beta`
- `Experimental`
- `Prototype`
- `Archived`

Additional requirements:

- installation or usage instructions;
- supported environment;
- license;
- security and privacy notes;
- versioning and release history;
- contribution policy when external contributions are accepted.

### F. Archived or deprecated repository

Examples:

- obsolete previews;
- duplicate production repositories;
- superseded experiments.

Required About description:

- begin with `ARCHIVED —`;
- identify the canonical replacement when one exists.

Required README first screen:

- archived notice;
- replacement repository or live site;
- reason for archival in one concise sentence.

Archived repositories must not be pinned or presented as active work.

### G. Private or internal repository

Examples:

- internal operating systems;
- client-sensitive automation;
- private research;
- credentials, infrastructure, or unreleased product work.

Private repositories are outside the public presentation system and must never expose secrets, client data, tokens, or internal access details.

---

## Required GitHub About fields

Every active public repository must have:

### Description

- one sentence;
- preferably under 160 characters;
- identify the project type and primary value;
- include `concept`, `live client project`, or another status qualifier when ambiguity is possible.

### Website

Use the strongest canonical public destination:

1. live production domain;
2. published case study;
3. verified public demo;
4. company website when no project-specific page exists.

Do not use a broken preview URL, temporary branch URL, localhost address, or obsolete GitHub Pages deployment.

### Topics

Use five to eight useful topics that improve classification and discovery.

Topics should represent:

- project type;
- industry or audience;
- core capability;
- platform or architecture where relevant;
- language system where relevant.

Avoid:

- keyword stuffing;
- near-duplicate topics;
- broad hype terms with no repository relevance;
- unsupported technologies.

---

## README first-screen standard

The first screen should contain, in this order:

1. project or company name;
2. one-line positioning statement;
3. explicit status classification;
4. primary links;
5. concise explanation of what was built or what the repository provides.

A visitor should not need to infer whether the repository is:

- live;
- a client project;
- a concept;
- a preview;
- archived;
- internal documentation.

---

## Standard README structure — live client project

Use only the sections that materially improve understanding.

1. `# Project name`
2. positioning line;
3. `Status`;
4. `Live website` and case-study links;
5. `Project overview`;
6. `Business and user goals`;
7. `What was delivered`;
8. `Language and search architecture` when multilingual;
9. `Technical approach`;
10. `Contact or inquiry architecture` where relevant;
11. `Evidence and limitations`;
12. `Accessibility, privacy, and safety boundaries`;
13. `Current repository status`;
14. `Role of ProAI Expert`.

### Live-client first-screen example

```md
# Project Name

Short positioning statement.

**Status:** Live client project · EN/RU  
**Live website:** https://example.com/  
**Case study:** https://proai-expert.com/case-studies/example/

One concise paragraph explaining the business problem, implemented system, and main user journey.
```

---

## Standard README structure — concept or demonstration

1. `# Project name`;
2. positioning line;
3. explicit concept classification;
4. public case-study or demo link;
5. `Concept purpose`;
6. `Demonstrated capabilities`;
7. `Architecture`;
8. `Interaction and responsive behavior`;
9. `Truthful demo boundaries`;
10. `Current state`;
11. `What would be required for real deployment`;
12. `Role of ProAI Expert`.

### Concept first-screen example

```md
# Project Name

Short positioning statement.

**Status:** Website concept · Client-facing demonstration  
**Operating-business status:** Not a verified operating business  
**Case study:** https://proai-expert.com/case-studies/example/

One concise paragraph explaining what the concept demonstrates and which assumptions remain unverified.
```

---

## Standard README structure — public product or tool

1. `# Product name`;
2. value statement;
3. release status and version;
4. screenshot or concise demo when useful;
5. installation;
6. configuration;
7. usage examples;
8. architecture;
9. supported environments;
10. security and privacy;
11. limitations;
12. roadmap;
13. contributing;
14. license;
15. support and contact.

This class is the primary future path for earning GitHub stars, followers, forks, issue participation, and external references.

---

## Visual asset policy

Use visuals only when they help a visitor understand the project.

Recommended:

- one optimized cover or hero preview;
- two to four meaningful interface screenshots;
- one architecture diagram when the system cannot be understood from text;
- WebP or optimized PNG assets already used by the project when possible.

Avoid:

- large autoplay GIFs;
- repeated full-page screenshots;
- decorative screenshots with no caption or explanation;
- heavy image galleries;
- client data, private forms, personal messages, or unredacted analytics;
- screenshots used as proof without date, source, and limitation notes.

Every evidence screenshot should identify:

- source;
- date or measurement period;
- what it proves;
- what it does not prove.

---

## Language policy

The GitHub account is English-first.

Rules:

- primary README copy should normally be English;
- links to Russian or Ukrainian content must be labeled `Russian`, `Ukrainian`, `RU`, or `UA`;
- language-specific channels must not be presented as generic English professional channels;
- multilingual projects should state their supported languages in the first screen;
- translated READMEs may be added later only when they provide real value and remain maintainable.

---

## Evidence and claims policy

Allowed claims:

- implemented features verified in the repository;
- live routes verified on the production domain;
- dated analytics or Search Console data with proper scope;
- owner-approved testimonials with permission and attribution rules;
- explicitly labeled observations and limitations.

Not allowed without proof:

- guaranteed rankings;
- guaranteed leads or revenue;
- conversion improvement percentages;
- client counts;
- years of experience;
- certifications;
- response-time promises;
- operational availability;
- ratings or reviews;
- savings or productivity figures.

Use this distinction consistently:

- **Implemented** — present in production or source;
- **Verified** — checked with evidence;
- **Observed** — seen in a specific period or test;
- **Planned** — approved but not built;
- **Concept** — demonstrative and not verified in operations;
- **Not claimed** — deliberately excluded due to missing evidence.

---

## Repository hygiene

### Active public repositories

Should have:

- current README;
- professional About fields;
- correct canonical links;
- useful topics;
- clear status;
- no obsolete deployment instructions;
- no credentials or secrets;
- no broken primary links.

### Archived repositories

Should have:

- `ARCHIVED —` description;
- replacement link;
- Pages disabled unless intentionally preserved;
- no pinned placement;
- no permanent deletion until the review period is complete.

### Internal documentation

Move internal operational material out of the first-screen README when it includes:

- temporary branch names;
- obsolete ZIP versions;
- detailed handoff history;
- internal approval logs;
- implementation scratch notes;
- browser capture instructions;
- credentials or private integrations.

Use `docs/` and a current handoff instead.

---

## Community and contribution policy

Not every repository should accept public contributions.

### Client and company website repositories

Default position:

- public for transparency and portfolio value;
- external contributions not actively solicited;
- Issues may be disabled or limited if they create noise or expose client context;
- security reports should use a private contact path.

### Public products and open-source tools

Before inviting contributions, add:

- `LICENSE`;
- `CONTRIBUTING.md`;
- `SECURITY.md`;
- issue templates;
- pull-request template;
- versioning and release policy;
- support boundaries.

Do not add open-source community files merely for appearance. Add them when the repository is genuinely ready for external users and contributors.

---

## Release and growth standard for future products

GitHub growth should come from useful public assets, not cosmetic activity.

Priority future release types:

1. reusable AI-agent templates;
2. practical automation starter kits;
3. multilingual website components;
4. intake and lead-response workflow examples;
5. evaluation and QA checklists;
6. small business AI implementation tools;
7. narrowly scoped open-source utilities.

Each public release should have:

- a clear problem statement;
- immediate usage value;
- complete installation or access instructions;
- screenshots or demo when useful;
- versioned releases;
- a focused roadmap;
- honest limitations;
- links back to ProAI Expert.

Stars, followers, forks, and external citations should be treated as outcomes of useful work, not as claims of authority.

---

## Review checklist

Before publishing or materially updating a public repository, confirm:

- [ ] The repository class is explicit.
- [ ] The first screen explains the project without ambiguity.
- [ ] Description, Website, and Topics are complete.
- [ ] The canonical repository and live destination are correct.
- [ ] Language-specific links are labeled.
- [ ] Live, concept, planned, partial, and archived states are distinct.
- [ ] Claims are verified or clearly limited.
- [ ] No client-sensitive information is exposed.
- [ ] No broken primary links remain.
- [ ] Visuals improve understanding and are optimized.
- [ ] Internal history does not dominate the public README.
- [ ] The repository is pinned only if it is one of the strongest current public projects.
- [ ] Archived duplicates are not presented as active.
- [ ] Future products include license, security, versioning, and contribution rules before public adoption is encouraged.

---

## Current ProAI Expert classification

| Repository | Class | Current public status |
|---|---|---|
| `proaiexpert/proaiexpert` | Profile repository | Active |
| `proaiexpert/proaiexpert.github.io` | Company production repository | Active · Live |
| `Financialstream/financialstream.github.io` | Live client project | Active · External owner account |
| `proaiexpert/alina-horb-website` | Live client project | Active · Live |
| `proaiexpert/handyman-vancouver-portland-demo` | Concept / demonstration | Active · Concept |
| `proaiexpert/nail-studio` | Unclassified early starter | Unpinned · Review later |
| `proaiexpert/alina-horb-preview` | Archived / deprecated | Archived |
| `proaiexpert/financialstream.github.io` | Archived / deprecated | Archived |
| `proaiexpert/ai-os` | Private / internal | Private |

## Ownership

This standard is maintained by ProAI Expert.

Major deviations should be intentional, documented, and justified by the repository’s audience or product model rather than by temporary implementation convenience.
