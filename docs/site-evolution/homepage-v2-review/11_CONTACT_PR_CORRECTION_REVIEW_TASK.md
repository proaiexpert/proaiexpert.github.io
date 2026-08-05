# CONTACT PR #98 — TARGETED CORRECTION RE-REVIEW TASK

## Operating mode

Independent read-only Reviewer pass.

Do not edit Contact, Homepage, Header, Footer, shared assets, routes, metadata, sitemap, deployment, or PR branch files.

Do not merge PR #98.

## Repository and PR

- Repository: `proaiexpert/proaiexpert.github.io`
- Pull request: `#98`
- PR branch: `agent/contact-private-review-prerequisite`
- Base branch: `main`
- Base SHA: `0b2fca54fba614e8a3098d00991cec6103b604e8`
- Corrected expected head SHA: `732208b6825a5c8208aa2cd553722da4ad7b418f`
- Prior reviewed head: `4b8ad355039b056ab9daa2277cd8ed52ef9ca824`
- Prior verdict: `TARGETED CORRECTION`
- Prior report: `docs/site-evolution/homepage-v2-review/10_CONTACT_PR_REVIEW_REPORT.md`

## Exact correction to verify

Reviewer previously found that `boundedUrl()` resolved arbitrary relative strings and encoded markup against `window.location.origin`.

The corrected EN/RU implementation must now:

1. accept only explicitly absolute `http://` or `https://` values;
2. parse with `new URL(value)` without a base URL;
3. reject relative paths;
4. reject `javascript:` and `data:` protocols;
5. reject URL credentials (`username` or `password`);
6. reject raw markup;
7. reject once-encoded markup;
8. reject double-encoded markup;
9. reject C0/C1 control characters;
10. enforce the 500-character limit before and after URL normalization;
11. remain byte-for-byte symmetric in EN/RU sanitizer logic;
12. preserve all previously accepted Contact behavior.

## Required inspection

Verify the actual current PR, not the Builder summary.

Confirm:

- actual head equals `732208b6825a5c8208aa2cd553722da4ad7b418f`;
- final PR diff contains exactly:
  - `contact/index.html`
  - `ru/contact/index.html`;
- no temporary workflow, trigger, QA report, shared file, Header, Footer, Homepage, endpoint, route, metadata, sitemap or deployment file remains in the PR;
- EN corrected blob is `22c76e578e291daa341c9c7308d4bcbd853373c9`;
- RU corrected blob is `d1c83dcf96a2edeb554a8d504ad03a8721c67a3c`;
- the old `new URL(value,window.location.origin)` logic is absent;
- `containsUnsafeUrlSyntax()` and corrected `boundedUrl()` are identical in both languages;
- the prior blocking examples now produce an empty `referring_url`;
- valid absolute HTTP(S) URLs remain accepted;
- direct Contact defaults, Private Review context, canonical fields, Formspree endpoint, validation, honeypot, timestamp, success/error/reset, no-JS baseline, Header, Footer and Chatbase remain preserved.

## Required safety matrix

Recheck at minimum:

- valid absolute HTTPS URL;
- valid absolute HTTP URL;
- harmless percent-encoded URL;
- relative path;
- `javascript:` URL;
- `data:` URL;
- URL with username/password;
- raw markup;
- once-encoded markup;
- double-encoded markup;
- C0/C1 control characters;
- raw input over 500 characters;
- normalized URL over 500 characters.

## Builder evidence to independently assess

The Builder reports PASS for:

- Jekyll 4.3.4 build;
- generated EN/RU output;
- symmetric sanitizer;
- required URL-safety matrix;
- direct EN/RU defaults;
- Private Review context;
- direction interaction and `aria-pressed`;
- 320/360/375/390/430 px widths;
- short-phone landscape 844x390;
- horizontal overflow assertion;
- fixed-header anchor clearance;
- browser back/forward context restoration.

No live Formspree submission was performed.

Do not accept these statements without checking the actual corrected source and PR state. Reproduce the safety logic independently where possible.

## Verdict

Return exactly one:

- `ACCEPT`
- `TARGETED CORRECTION`
- `REJECT`

Use `ACCEPT` only if the prior blocking defect is fully resolved and no new blocking regression or scope drift exists.

## Output

Replace the template at:

`docs/site-evolution/homepage-v2-review/12_CONTACT_PR_FINAL_REVIEW_REPORT.md`

Include:

1. verdict;
2. actual base/head and file scope;
3. correction verification;
4. safety-matrix results;
5. EN/RU parity;
6. preserved functionality;
7. tests actually run;
8. remaining risks or unverified items;
9. explicit merge recommendation.

After writing the report, stop. Do not edit PR #98 and do not merge it.
