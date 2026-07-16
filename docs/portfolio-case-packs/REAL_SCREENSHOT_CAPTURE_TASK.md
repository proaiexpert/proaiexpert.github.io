# Real Website Screenshot Capture Task

**Purpose:** produce the only approved visual source set for the ProAI Expert portfolio rebuild.

## Global rules

- Capture the actual current website or exact current production source.
- Do not generate, recreate, redraw or approximate any page.
- Do not use synthetic UI, placeholder portraits, invented dashboard panels or ratio-matched stand-ins.
- Hide browser chrome unless a browser-context image is intentionally required.
- Disable extensions, password managers, cookie overlays and unrelated browser UI.
- Use a clean session and allow fonts/images to finish loading.
- Capture before applying portfolio mockup frames.
- Keep an uncropped original for every selected image.
- Record URL, language, viewport, capture date and source commit where available.
- Review each image at 100% before approval.

## Standard viewports

Desktop:
- 1600 × 1000 primary
- 1440 × 1000 secondary

Mobile:
- 390 × 844 primary
- 430 × 932 secondary when layout differs materially

Full-page:
- desktop 1440 px width
- mobile 390 px width

## Project 1 — Alina Horb

Canonical source:
- `https://alinahorb.com/`
- `https://alinahorb.com/ru/`
- repository: `proaiexpert/alina-horb-website`

Current hero assets confirmed in production source:
- `assets/images/portrait/alina-horb-hero-v3-1-desktop.webp`
- `assets/images/portrait/alina-horb-hero-v3-1-mobile.webp`

Required captures:

1. UA desktop hero with Alina’s real portrait fully visible.
2. UA mobile hero with real mobile portrait crop.
3. RU desktop hero.
4. Trust strip.
5. Support / needs index.
6. Work topics section.
7. About Alina and education/credentials area.
8. Consultation process.
9. Professional boundaries / safety information.
10. Notes section using the current published Notes images.
11. Contact / intake area.
12. UA full-page desktop.
13. RU full-page desktop.
14. UA full-page mobile.
15. One paired UA/RU comparison composition prepared only after the raw captures are approved.

Verification:

- portrait must be Alina’s actual current site image;
- headline must match the current page;
- current Notes images must load;
- no obsolete hero or earlier homepage version;
- no synthetic portrait or arch canvas;
- no old no-longer-current section order.

## Project 2 — Financial Stream

Canonical source:
- `https://financialstreamllc.com/`
- `https://financialstreamllc.com/ru/`

Required captures:

1. EN desktop hero/current homepage opening.
2. EN mobile hero.
3. RU desktop hero.
4. Services overview including active Payroll.
5. Service-path / decision section.
6. Structured request entry point.
7. Current contact page and short form.
8. Calendar-after-context step, if publicly reachable and safe to capture.
9. Materials / articles area.
10. Current real testimonial/proof section.
11. Chatbase widget in a clean non-obstructive state.
12. EN full-page desktop.
13. RU full-page desktop.
14. EN full-page mobile.
15. Separate evidence captures for GSC and automation; never mix them into raw website screenshots.

Verification:

- current live homepage only;
- Payroll remains visible where present;
- no earlier Financial Stream design version;
- no generic laptop/phone stand-in used as the source image;
- testimonial text and business facts must match the current site;
- sensitive data must be removed only in derived evidence copies, never by recreating the UI.

## Project 3 — Local Repair Pro

Canonical source:
- `https://proai-expert.com/handyman-vancouver-portland-demo/`
- repository: `proaiexpert/handyman-vancouver-portland-demo`

Current language decision:
- English-only for this portfolio pass.
- Russian localization is deferred.

Required captures:

1. Desktop homepage hero.
2. Mobile homepage hero.
3. Visual scenarios / work examples.
4. Services section/page.
5. Photo-based request explanation.
6. Request/intake page.
7. Scope and safety section.
8. Service-area hub.
9. One representative city page.
10. FAQ.
11. Full-page desktop.
12. Full-page mobile.

Verification:

- label the project `Website concept — in development`;
- do not present it as a real client;
- remove or avoid placeholder phone/email in selected frames;
- do not capture unfinished or broken responsive states;
- current long demo URL is acceptable for development and does not need a custom domain before portfolio capture;
- internal route names should be evaluated separately from the visible portfolio presentation.

## File structure

Store approved captures under:

```text
assets/img/cases/alina-horb/raw/
assets/img/cases/financial-stream/raw/
assets/img/cases/local-repair-pro/raw/
```

Store portfolio-ready derivatives under:

```text
assets/img/cases/alina-horb/portfolio/
assets/img/cases/financial-stream/portfolio/
assets/img/cases/local-repair-pro/portfolio/
```

Never overwrite raw captures.

## Naming pattern

```text
<project>-<language>-<page-or-section>-<viewport>-<date>.<ext>
```

Examples:

```text
alina-horb-ua-home-hero-1600x1000-2026-07-15.webp
financial-stream-en-services-1600x1000-2026-07-15.webp
local-repair-pro-en-request-390x844-2026-07-15.webp
```

## Completion gate

A project screenshot package is complete only when:

- all required raw captures exist;
- currentness is verified;
- no synthetic visual remains;
- desktop/mobile are checked;
- selected crops are approved;
- the screenshot manifest is updated;
- the case prototype uses only approved files.
