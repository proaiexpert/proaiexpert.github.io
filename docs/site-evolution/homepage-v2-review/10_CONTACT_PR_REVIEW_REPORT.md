# Independent Contact PR #98 Review Report

**Status:** Independent review complete  
**Verdict:** `TARGETED CORRECTION`  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Pull request:** `#98`  
**PR branch:** `agent/contact-private-review-prerequisite`  
**Base:** `main` at `0b2fca54fba614e8a3098d00991cec6103b604e8`  
**Reviewed head:** `4b8ad355039b056ab9daa2277cd8ed52ef9ca824`  
**Review mode:** Read-only inspection of the production PR; only this documentation report was written

---

## 1. Executive verdict

PR #98 is correctly scoped and implements the approved EN/RU Contact prerequisite without redesigning Contact or modifying Homepage, Header, Footer, routes, assets, metadata, sitemap or deployment.

The principal field migration, direct-contact defaults, Homepage Private Review context, EN/RU canonical machine values, localized context panel, direction controls, Formspree integration and no-JavaScript baseline are materially correct.

The review nevertheless found one reproducible query-safety defect in both language files:

- the current `boundedUrl()` accepts encoded or decoded markup supplied through `referring_url` by resolving it as a relative HTTP(S) URL;
- for example, a value shaped like `<svg onload=alert(1)>` is normalized to an HTTP(S) path instead of being rejected and replaced with an empty value.

This is not an active DOM-XSS path in the reviewed implementation because the normalized result is assigned only through `.value` to a hidden form field and is not inserted with `innerHTML`. However, it fails the explicit acceptance requirement for encoded-markup rejection and weakens the promised `bounded safe URL` contract.

Therefore the PR is not yet merge-ready. It requires one narrow, symmetric correction in `contact/index.html` and `ru/contact/index.html`, followed by rerunning the query-safety matrix and the existing build/browser checks.

**Verdict: `TARGETED CORRECTION`.**

---

## 2. Base/head and exact files reviewed

### Pull request state

- PR: `#98`
- State: open
- Draft: yes
- Merged: no
- GitHub mergeability at review time: mergeable
- Base branch: `main`
- Base SHA: `0b2fca54fba614e8a3098d00991cec6103b604e8`
- Head branch: `agent/contact-private-review-prerequisite`
- Expected head SHA: `4b8ad355039b056ab9daa2277cd8ed52ef9ca824`
- Actual head SHA: `4b8ad355039b056ab9daa2277cd8ed52ef9ca824`
- Base comparison: head is 20 commits ahead and 0 commits behind the specified base
- Merge base: exactly `0b2fca54fba614e8a3098d00991cec6103b604e8`

### Actual PR file scope

The actual diff contains exactly the two authorized files:

```text
contact/index.html
ru/contact/index.html
```

No scope drift was found.

The PR does not modify:

- Homepage;
- Header source files;
- Footer source files;
- shared CSS or JavaScript assets;
- the Formspree endpoint;
- routes;
- metadata;
- sitemap;
- `_config.yml`;
- deployment workflow;
- unrelated pages.

### Baseline and reviewed blobs

| File | Base blob | Reviewed head blob |
|---|---|---|
| `contact/index.html` | `b38d8d397a30ff47c12b96d8404e0deb3b62f919` | `c3a534caafb9ec24180fe2a1427668517b0bd809` |
| `ru/contact/index.html` | `4c19811ae5f5046ec13d991737df4e042a6e1c59` | `9a287f018620633757afc9012a661da6c4ba3e66` |

### Canonical material reviewed

- `AI_START_HERE.md`
- `AGENTS.md`
- `AI_CURRENT_HANDOFF.md`
- `README.md`
- `docs/site-evolution/PROAI_EXPERT_CONTACT_PRIVATE_REVIEW_PREREQUISITE_SPEC.md`
- `docs/site-evolution/PROAI_EXPERT_HOMEPAGE_V2_IMPLEMENTATION_CONTRACT.md`
- actual PR #98 metadata
- actual complete PR diff and per-file patches
- base and head versions of both Contact pages
- current Footer include only as needed to verify preservation

---

## 3. Field-contract review

### Canonical fields

Both EN and RU forms contain the required canonical hidden fields:

```text
intent
selected_direction
source_page
source_cta
source_context
referring_url
language
```

Compatibility fields remain present without replacing the canonical schema:

```text
page_lang
page_path
form_started_at
company_website
```

### Request type migration

The prior collision is correctly resolved:

- `intent` now stores the request type;
- direction is stored separately in `selected_direction`;
- localized visible labels do not leak into machine values.

Accepted request types are identical in EN and RU:

```text
private_review
project_inquiry
```

### Direction contract

Both languages use the same four canonical direction values:

```text
ai_systems_automation
websites_branding
both
not_sure
```

Visible labels are naturally localized while `data-value` remains stable.

All four controls are native `<button type="button">` elements. `setDirection()`:

- validates the requested value against the direction allowlist;
- falls back to `not_sure`;
- updates the active CSS state;
- updates `aria-pressed` for every button;
- updates the hidden `selected_direction` value.

### Direct Contact defaults

The no-query HTML defaults are correct in both languages:

```text
intent=project_inquiry
source_page=contact
source_cta=direct_contact
selected_direction=not_sure
```

The language field is correctly fixed by route:

```text
language=en
language=ru
```

### Homepage inputs

The implementation recognizes the required Homepage CTA values:

```text
homepage_hero
homepage_ways_to_start
homepage_final
```

The expected Hero, Ways to Start and Final URL patterns produce the intended canonical values. A valid Ways to Start direction preselects the matching localized control while retaining the same machine value in EN and RU.

### Private Review context

The localized Private Review panel:

- exists in normal document order immediately before the form;
- is hidden by default;
- becomes visible only when the allowlisted request type is `private_review`;
- has localized title, explanation and boundary copy;
- states that the review is no-cost and limited;
- does not claim a complete audit, implementation plan or free consulting engagement;
- does not promise a fixed response time.

Field-contract result: **PASS**, subject to the `referring_url` safety correction described below.

---

## 4. Query-safety review

### Correct controls

The PR correctly uses explicit allowlists for:

- `intent`;
- `source_page`;
- `source_ctta` behavior through the `SOURCE_CTAS` set;
- `selected_direction`.

Unsupported values fall back to safe direct-contact defaults.

`source_context` is bounded to 120 characters and restricted to:

```text
[a-z0-9_-]+
```

This rejects spaces, markup, arbitrary text and oversized values.

No query value is inserted with `innerHTML`. Query-derived data is applied through:

- `.value`;
- `classList` operations based on allowlisted values;
- safe `setAttribute()` calls for boolean accessibility state.

No names, emails, phone numbers or free-form project descriptions are added to analytics events by this PR.

### Blocking defect: `referring_url` accepts markup as a relative URL

Both Contact pages currently use equivalent logic:

```js
function boundedUrl(value,maxLength){
  if(!value||value.length>maxLength){return '';}
  try{
    const parsed=new URL(value,window.location.origin);
    return parsed.protocol==='http:'||parsed.protocol==='https:'?parsed.href:'';
  }catch(error){
    return '';
  }
}
```

Because a base URL is supplied, arbitrary strings that are not absolute URLs are interpreted as relative paths. Consequently, decoded or encoded markup can be transformed into a valid-looking HTTP(S) URL instead of being rejected.

Reproduced examples include values equivalent to:

```text
<svg onload=alert(1)>
%3Csvg%20onload%3Dalert(1)%3E
```

These are normalized to paths under the current origin and retained in the hidden `referring_url` field.

Again, the reviewed code does not execute the markup and does not inject it into rendered HTML. The defect is nevertheless blocking because the task explicitly requires encoded-markup rejection and a bounded safe URL, not merely protocol normalization.

### Required correction

In both language files, harden `boundedUrl()` so that it:

1. accepts only valid absolute `http:` or `https:` URLs;
2. does not resolve arbitrary relative strings against `window.location.origin`;
3. rejects raw, decoded and encoded markup/control-character attempts;
4. rejects URL credentials (`username` or `password`), unless a separately documented requirement exists;
5. enforces the maximum length on the normalized final URL as well as the raw input;
6. returns an empty string for every rejected value.

A minimal safe direction is to parse with `new URL(value)` without a base, then validate protocol, credentials, normalized length and forbidden characters. The exact implementation remains the Builder’s responsibility, but it must remain identical in EN and RU.

### Required recheck matrix

After correction, verify at minimum:

- valid absolute `https://` URL;
- valid absolute `http://` URL if intentionally supported;
- relative path;
- `javascript:` URL;
- `data:` URL;
- URL with username/password credentials;
- raw markup;
- once-encoded markup;
- double-encoded markup;
- control characters;
- raw input over 500 characters;
- normalized URL over 500 characters.

Query-safety result: **FAIL — one targeted blocking correction required.**

---

## 5. EN/RU parity review

EN and RU implementations are structurally symmetric for the new prerequisite.

Verified parity includes:

- identical canonical field names;
- identical request-type values;
- identical source-page values;
- identical source-CTA values;
- identical direction machine values;
- identical allowlist and fallback logic;
- identical 120-character `source_context` boundary;
- identical 500-character `referring_url` boundary;
- identical direction-state behavior;
- identical `aria-pressed` handling;
- route-correct `language`, `page_lang` and `page_path` values;
- localized Private Review copy;
- localized processing, validation, success and error messages.

Russian labels are not mechanical copies of the English UI and remain understandable in context. The direction group can wrap because it uses a flex container with wrapping enabled; no new fixed-height or `white-space: nowrap` constraint was introduced for the Russian pills or Private Review copy.

The same `boundedUrl()` defect exists in both languages, so the correction must remain symmetric.

EN/RU parity result: **PASS with the same shared targeted correction required in both files.**

---

## 6. Existing-functionality preservation

Source and diff inspection confirm preservation of the following:

- Formspree endpoint remains exactly `https://formspree.io/f/xbdakqoz`;
- submission remains asynchronous through `fetch`;
- the request retains `Accept: application/json`;
- required email validation remains;
- minimum project-context validation remains 20 characters;
- honeypot field remains `company_website`;
- timestamp field remains `form_started_at` and is refreshed;
- localized `_subject` fields remain;
- processing states remain localized;
- success states remain localized;
- error states remain localized;
- success and error regions retain live-region behavior;
- direct email links remain `mailto:hello@proai-expert.com`;
- Telegram links remain unchanged;
- Header source/markup outside the required Contact patch is unchanged;
- Footer include call remains unchanged for each route;
- Chatbase embed, assistant ID and load-after-window-load behavior remain unchanged;
- no live Formspree inquiry was sent during review.

The successful-submit path still resets the visible form, restores the canonical request context, resets direction to `not_sure`, refreshes the timing field and displays the existing success state.

Existing-functionality preservation result: **PASS by source and diff inspection.**

---

## 7. Accessibility, responsive and no-JS review

### Accessibility

Verified from source:

- the Private Review panel appears before the form in reading order;
- the panel has a programmatic label relationship through `aria-labelledby`;
- hidden state is reflected with `aria-hidden`;
- four direction choices remain keyboard-operable native buttons;
- active direction is programmatically exposed through `aria-pressed`;
- hidden canonical fields are not focusable;
- existing labels remain associated with form controls;
- feedback and success regions retain live-region semantics;
- direction state is not conveyed only through color;
- no query parsing forces focus or causes a scripted focus jump.

### Responsive source review

The new panel and controls fit the existing responsive model:

- intake switches to one column at the existing breakpoint;
- field rows collapse to one column;
- direction controls use wrapping;
- Private Review text has no fixed height or forced single-line behavior;
- `#project-intake` now has `scroll-margin-top` based on the Header-height variable;
- no new absolute positioning, fixed width or viewport-width rule was added that obviously creates horizontal overflow;
- existing mobile overflow containment remains present.

No source-level collision with Footer or Chatbase was introduced by the patch.

### No-JavaScript behavior

Without JavaScript:

- both Contact pages still render the complete form;
- the form action and POST method remain present;
- required inputs, honeypot, timestamp field and compatibility fields remain in HTML;
- all canonical hidden fields have safe direct-contact defaults in HTML;
- the user can select no direction and still submit `not_sure` safely;
- Private Review query enhancement may be absent, as allowed by the specification;
- `#project-intake` remains a valid landing anchor.

### Limits of this review environment

The Reviewer did not independently reproduce the Builder’s full Jekyll 4.3.4 build, headless-browser suite or physical-device viewport checks in this environment. Therefore the following remain to be rerun after the correction:

- generated EN/RU output checks;
- 320/360/375/390/430 px browser checks;
- short-phone landscape;
- actual anchor landing below the fixed Header;
- measured horizontal-overflow assertions;
- Footer and Chatbase collision checks;
- browser back/forward behavior.

Accessibility/responsive/no-JS result: **source review passes; full browser/device evidence remains an explicit post-correction verification requirement.**

---

## 8. Checks actually run

The independent review performed the following checks:

1. Read the canonical repository governance documents.
2. Read the Contact prerequisite specification and relevant Homepage implementation contract.
3. Retrieved actual PR #98 metadata rather than relying on the Builder summary.
4. Verified actual base SHA and actual head SHA.
5. Compared the specified base and head refs.
6. Verified the branch is 20 commits ahead and 0 behind the specified base.
7. Verified the merge base is the specified base commit.
8. Listed all changed filenames across the PR.
9. Retrieved and inspected both complete per-file patches.
10. Confirmed the diff contains exactly two authorized Contact files.
11. Inspected base and head Contact sources.
12. Verified baseline and reviewed blob SHAs.
13. Inspected the current Footer include needed to confirm preservation.
14. Checked PR review threads and submitted reviews; none were present.
15. Checked commit-associated workflow runs; none were available for independent CI evidence.
16. Compared EN/RU canonical fields, values and interaction logic.
17. Checked direct defaults and required Homepage CTA scenarios against the implemented allowlists.
18. Checked invalid request-type, source and direction fallback behavior.
19. Checked `source_context` character and length boundaries.
20. Checked absence of query-derived `innerHTML` injection.
21. Ran an isolated logic matrix against the exact query helper behavior, including valid URLs, invalid schemes, oversized values and encoded-markup inputs.
22. Reproduced the `referring_url` encoded-markup acceptance defect.
23. Verified Formspree, validation, honeypot, timing, status, reset, direct-contact and Chatbase contracts by source/diff inspection.
24. Confirmed no live Formspree submission was performed.

Not independently run:

- full Jekyll build;
- generated-site browser automation;
- physical-device QA;
- live Formspree submission.

---

## 9. Risks and unverified items

### Blocking risk

The `referring_url` sanitizer accepts arbitrary encoded or decoded markup as a relative HTTP(S) path. This violates the explicit query-safety acceptance criterion and must be corrected before merge.

### Non-blocking but required verification after correction

- Builder-reported Jekyll 4.3.4 PASS could not be independently rerun here.
- Builder-reported headless responsive checks could not be independently reproduced here.
- No GitHub workflow run was associated with the reviewed head, so there is no connector-visible CI record to substitute for local execution.
- No live Formspree payload was sent, correctly avoiding a production inquiry; exact outbound payload should continue to be verified through controlled interception or form-data inspection rather than a real production message.
- Real-device owner QA remains necessary for iPhone portrait and landscape, especially RU wrapping, Header anchor position and Chatbase overlap.

No broader architectural, content or scope risk was found that justifies rejecting the PR.

---

## 10. Exact corrections required

### Blocking targeted correction — both Contact files

Modify only:

```text
contact/index.html
ru/contact/index.html
```

Required change:

- harden `boundedUrl()` so `referring_url` accepts only bounded, normalized, absolute HTTP(S) URLs and rejects relative strings, markup, encoded markup, unsafe schemes, credentials and overlength normalized output.

The correction must remain byte-for-byte equivalent in logic across EN and RU except for unrelated localized content.

### Required correction evidence

The Builder should provide a new head SHA and report:

1. exact two-file diff;
2. exact revised URL-validation rule;
3. PASS for valid absolute HTTP(S) URLs;
4. PASS for raw, once-encoded and double-encoded markup rejection;
5. PASS for `javascript:` and `data:` rejection;
6. PASS for credential-bearing URL rejection;
7. PASS for raw and normalized overlength rejection;
8. unchanged direct defaults and Homepage CTA scenarios;
9. unchanged EN/RU canonical machine values;
10. Jekyll 4.3.4 build PASS;
11. generated EN/RU output checks PASS;
12. responsive browser matrix PASS;
13. final diff still limited to the same two Contact files.

No Contact redesign, copy rewrite, shared-file refactor or PR-scope expansion is authorized by this report.

---

## 11. Merge-readiness status

**Current status: NOT READY TO MERGE.**

PR #98 may proceed through the existing Builder correction loop only after the narrow `referring_url` sanitizer correction is applied symmetrically to both Contact files.

After the correction:

1. verify the new actual head SHA;
2. inspect the exact new diff;
3. rerun the query-safety matrix;
4. rerun Jekyll/generated-output checks;
5. rerun the responsive browser matrix;
6. obtain independent Reviewer acceptance;
7. obtain explicit owner authorization before merge.

The PR should remain draft and unmerged until those conditions are satisfied.

**Independent Contact PR #98 review complete. No production files were changed.**
