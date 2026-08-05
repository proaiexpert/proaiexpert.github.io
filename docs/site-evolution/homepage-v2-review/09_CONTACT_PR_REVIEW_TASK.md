# TASK — INDEPENDENT REVIEW OF CONTACT PRIVATE REVIEW PR #98

**Role:** Independent Reviewer  
**Mode:** Read-only until report output  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Pull request:** `#98`  
**PR branch:** `agent/contact-private-review-prerequisite`  
**Expected head SHA:** `4b8ad355039b056ab9daa2277cd8ed52ef9ca824`  
**Base:** `main` at `0b2fca54fba614e8a3098d00991cec6103b604e8`

## Purpose

Independently verify the narrow EN/RU Contact prerequisite required by Homepage V2.

Do not redesign Contact. Do not broaden the task. Do not modify production files during the initial review.

## Required reading

1. Root `AI_START_HERE.md`.
2. Root `AGENTS.md`.
3. Current root `AI_CURRENT_HANDOFF.md`.
4. `docs/site-evolution/PROAI_EXPERT_CONTACT_PRIVATE_REVIEW_PREREQUISITE_SPEC.md` from branch `agent/homepage-v2-strategy-review`.
5. `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_IMPLEMENTATION_CONTRACT.md` from the same docs branch.
6. Actual PR #98 metadata and actual diff.
7. Current base versions of `contact/index.html` and `ru/contact/index.html`.
8. Current Header/Footer includes and the Formspree submission contract only where necessary to verify preservation.

## Exact scope expected in PR

Only:

```text
contact/index.html
ru/contact/index.html
```

Reject scope drift into Homepage, Header, Footer, endpoint, routes, assets, metadata, sitemap or deployment.

## Required review areas

### 1. Field migration

Verify:

```text
intent=private_review | project_inquiry
selected_direction=ai_systems_automation | websites_branding | both | not_sure
source_page=homepage | contact
source_cta=homepage_hero | homepage_ways_to_start | homepage_final | direct_contact
source_context=<bounded identifier or empty>
referring_url=<bounded safe URL or empty>
language=en | ru
```

Confirm EN/RU use identical machine values.

### 2. Direct Contact behavior

Verify safe defaults:

```text
intent=project_inquiry
source_page=contact
source_cta=direct_contact
selected_direction=not_sure
```

Confirm all four localized direction controls update the canonical hidden value and expose `aria-pressed`.

### 3. Homepage URL inputs

Verify EN/RU behavior for:

- `homepage_hero`;
- `homepage_ways_to_start` with selected direction;
- `homepage_final`.

Confirm the localized Private Review explanation appears only for valid `intent=private_review`.

### 4. Query safety

Verify allowlists, maximum lengths, invalid-value fallback, encoded markup rejection, safe `.value`/`.textContent` handling and absence of `innerHTML` query injection.

### 5. Existing functionality preservation

Confirm unchanged:

- Formspree endpoint `https://formspree.io/f/xbdakqoz`;
- async `fetch` with JSON response handling;
- email and minimum-context validation;
- honeypot `company_website`;
- timestamp `form_started_at`;
- localized processing/success/error states;
- reset behavior;
- Header;
- Footer;
- Chatbase behavior;
- direct email and Telegram links.

### 6. Accessibility and responsive behavior

Review:

- context panel reading order;
- keyboard operation;
- active-state semantics;
- focus visibility;
- 320/360/375/390/430 px;
- short phone landscape;
- RU wrapping;
- anchor position below fixed Header;
- no horizontal overflow;
- no collision with Footer or Chatbase.

### 7. No-JS and submission boundaries

Confirm safe hidden defaults and usable form without JavaScript.

Do not perform a live Formspree submission unless the owner separately authorizes sending a test inquiry. Source/form-data inspection and controlled browser tests are sufficient for this review.

## Builder evidence to verify, not merely trust

The Builder reports:

- Jekyll 4.3.4 build PASS;
- generated EN/RU output checks PASS;
- direct defaults PASS;
- direction interaction PASS;
- Hero/Ways/Final URL context PASS;
- invalid query fallback PASS;
- final diff contains exactly two Contact files.

Reviewer must check the actual diff and rerun material checks where possible.

## Required verdict

Return exactly one:

- `ACCEPT`
- `TARGETED CORRECTION`
- `REJECT`

## Required output

Save the report in branch:

`agent/homepage-v2-strategy-review`

Replace:

`docs/site-evolution/homepage-v2-review/10_CONTACT_PR_REVIEW_REPORT.md`

Report structure:

1. Executive verdict.
2. Base/head and exact files reviewed.
3. Field-contract review.
4. Query-safety review.
5. EN/RU parity review.
6. Existing-functionality preservation.
7. Accessibility/responsive/no-JS review.
8. Checks actually run.
9. Risks and unverified items.
10. Exact corrections, if any.
11. Merge-readiness status.

## Stop rule

Do not merge PR #98. Do not edit Contact during the initial review. After saving the report, stop.

Final line:

**“Independent Contact PR #98 review complete. No production files were changed.”**
