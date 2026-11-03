# Security Policy

## Scope

This policy applies to the current production source in `main` for the ProAI Expert website and to publicly accessible functionality maintained in this repository.

Historical branches, archived experiments, third-party services, client-owned systems, and repositories outside the `proaiexpert` account may have separate ownership and reporting paths.

## Reporting a vulnerability

Do not open a public GitHub Issue for a suspected security vulnerability, exposed credential, private client information, or exploitable configuration problem.

Report it privately through one of these channels:

- Email: `proai.expert2026@gmail.com`
- Website contact: https://proai-expert.com/contact/

Include only the information needed to understand and reproduce the issue:

- affected URL, route, file, or component;
- concise description of the risk;
- reproducible steps;
- browser, device, or environment when relevant;
- screenshots or proof of concept with sensitive information removed;
- whether the issue appears to expose personal, client, authentication, or integration data.

## Responsible handling

Please:

- avoid accessing, changing, downloading, or retaining data that does not belong to you;
- avoid disrupting the live website or third-party services;
- do not publish vulnerability details before the issue has been reviewed and addressed;
- remove tokens, credentials, personal information, and client data from screenshots and reports;
- stop testing if continued activity could affect users, data, availability, billing, or connected services.

## What happens after a report

Reports are reviewed based on reproducibility, impact, affected ownership, and whether the issue is within this repository’s control.

Possible outcomes include:

- confirmation that the report is in scope;
- a request for additional technical detail;
- referral to the owner of a third-party or client-controlled system;
- remediation through a controlled branch and pull request;
- closure when the behavior is expected, not reproducible, or outside the supported scope.

No response-time, bounty, payment, disclosure-credit, or remediation guarantee is implied by this policy.

## Sensitive information

Never commit or publish:

- API keys, access tokens, passwords, private keys, or authentication cookies;
- private client communications or intake data;
- personal information not already intentionally public;
- production secrets or integration credentials;
- unredacted analytics, form submissions, or account screenshots;
- third-party data obtained without authorization.

If sensitive information is discovered in Git history or a public artifact, report it privately and do not reproduce it in an Issue or Pull Request.
