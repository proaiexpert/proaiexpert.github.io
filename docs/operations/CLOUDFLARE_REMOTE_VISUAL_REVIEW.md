# Cloudflare Remote Visual Review — ProAI Expert

## Purpose
This is the canonical remote visual-review workflow for `proaiexpert/proaiexpert.github.io`.

The Owner frequently reviews work from an iPhone and may be away from the development machine. Localhost, LAN URLs, Windows filesystem paths, and machine-local screenshots are not acceptable as the primary Owner review surface.

## Core routing rule
1. Use ChatGPT Direct first for all work that can be completed safely through GitHub and normal reasoning.
2. Escalate to Codex only when local shell, npm, browser/CDP, WebGPU diagnostics, Spline binary serialization, broad debugging, or other local execution is materially required.
3. For meaningful visual website work, use Cloudflare Pages as the default hosted Owner review layer regardless of whether implementation was done by ChatGPT Direct or Codex.
4. ChatGPT Sites is optional and should be used only when its in-Work visual editing environment materially helps. It is not required merely to obtain a hosted preview URL.

## Cloudflare project
- Cloudflare Pages project: `proaiexpert-github-io`
- Connected repository: `proaiexpert/proaiexpert.github.io`
- Git integration: automatic branch deployments enabled
- Framework preset: `None`
- Build command: empty
- Build output directory: repository root
- Production branch in Cloudflare: `main`
- Important: Cloudflare production deployment is NOT a substitute for the actual production site and is not an authority. The repository root includes Jekyll/Liquid source that is not rendered by this no-build Pages project. Use branch preview pages for review.

## Source of truth
- GitHub branch/commit is always the implementation authority.
- Cloudflare Pages is only a hosted rendering/review surface.
- A preview must load the exact candidate files/assets from the intended branch/commit.
- Preview-only code must never silently become product authority.

## Owner-facing preview rule
For any meaningful visual task, the Builder must provide a phone-accessible HTTPS Cloudflare Pages URL before asking the Owner for visual approval.

Invalid primary Owner deliverables:
- `127.0.0.1`
- `localhost`
- `10.x.x.x` / LAN-only URLs
- `C:\...` paths
- screenshots alone when motion/interactivity/responsive behavior matters

Valid primary Owner deliverable:
- a live `https://*.proaiexpert-github-io.pages.dev/...` URL that opens from an iPhone on any network.

## Preview branch strategy
Use a short, stable review branch for an active visual workstream when the implementation branch name is long or changes frequently.

Current AI Systems Hero stable preview branch:
- `hero-preview`
- stable host alias: `https://hero-preview.proaiexpert-github-io.pages.dev/`

`hero-preview` is a review/mirror branch only. It must not become product authority and must not be merged into `main` merely because it renders correctly.

For other workstreams, prefer a short explicit preview branch such as `<workstream>-preview` only when needed. Do not create preview branches unnecessarily for non-visual tasks.

## Updating a preview
Normal flow:

`implementation branch/commit -> verify scope -> update or mirror the stable preview branch -> GitHub push -> Cloudflare automatic deploy -> Owner HTTPS URL`

No manual Cloudflare dashboard action should be required after initial setup.

If only a ref move or no-op trigger is needed to force a new deployment, this may be done without changing product files.

## Static review pages
Because the Cloudflare Pages project intentionally uses no build step, Owner review pages should be plain browser-ready HTML/CSS/JS and assets.

Preferred location:
- `owner-preview/`

For a visual candidate that depends on Jekyll/Liquid templates, create an isolated browser-ready preview entrypoint rather than asking the Owner to open the raw root page.

## Preview-only adapters
A review-only adapter is allowed when necessary to make the current candidate inspectable on iPhone, for example:
- R3 / candidate switcher
- 3D focus mode
- explicit hover simulation/control for a hover-only desktop state
- diagnostics/status indicator

Rules:
- clearly label review-only controls;
- do not change product design merely to make review easier;
- keep preview adapters under `owner-preview/` or another clearly isolated review path;
- never treat review-only layout/camera/interaction changes as product acceptance evidence unless explicitly stated.

## WebGPU / Spline rule
For WebGPU/Spline work:
- HTTPS Cloudflare Pages provides the secure context required by WebGPU-capable browsers;
- verify runtime load and exact payload/asset identity when practical;
- do not claim desktop hover parity from an iPhone touch interaction;
- use explicit review-only hover controls when the Owner must inspect a hover state remotely;
- separate product mobile behavior from review-only zoom/focus behavior.

## Current AI Systems Hero preview
Canonical stable review host:
- `https://hero-preview.proaiexpert-github-io.pages.dev/`

The exact review path may change by phase. The active Builder/Coordinator must provide the full current path in the final response rather than making the Owner construct URLs manually.

## Builder final-response contract for visual work
Every meaningful visual Builder response must include:
1. implementation branch;
2. base SHA and head SHA;
3. exact files changed;
4. local/runtime checks performed;
5. Cloudflare preview branch used;
6. one direct phone-accessible HTTPS preview URL;
7. what the Owner should look at in that URL;
8. any known fidelity limitation on iPhone vs desktop;
9. explicit confirmation that `main`/production were not changed unless authorized.

Do not make the Owner navigate Cloudflare dashboard to find the preview.

## Reviewer rule
The Reviewer must inspect the GitHub diff independently. Cloudflare preview is visual evidence, not code authority.

Reviewer result remains one of:
- `ACCEPT`
- `TARGETED CORRECTION`
- `REJECT`

## Safety
- Never modify `main`, merge, deploy production, or change DNS/custom domains merely to make a preview work unless explicitly authorized.
- Do not connect a custom domain for R&D preview by default; `*.pages.dev` is sufficient.
- Keep preview-specific code isolated.
- If Cloudflare preview diverges from the implementation candidate, stop and fix the preview rather than reviewing the wrong artifact.
