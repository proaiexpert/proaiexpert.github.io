# Homepage V2 Technical QA Result

Tested commit: 6def5f64effea507cef31f5a515960b581a8e6df
Production parent: 58b68a060de341b9b34727ae17325ba5abaa07b4
Build command: production-equivalent Jekyll 4.3.4 + webrick
Build outcome: success
Generated validation outcome: failure
Playwright install outcome: success
Local server outcome: success
Browser QA outcome: failure
Artifact ID: 9007324272
Artifact URL: https://github.com/proaiexpert/proaiexpert.github.io/actions/runs/31212663250/artifacts/9007324272

## Jekyll build log tail
```
Successfully installed safe_yaml-1.0.5
Successfully installed forwardable-extended-2.6.0
Successfully installed pathutil-0.16.2
Successfully installed mercenary-0.4.0
Successfully installed liquid-4.0.4
Successfully installed kramdown-2.5.2
Successfully installed kramdown-parser-gfm-1.1.0
Successfully installed ffi-1.17.4-x86_64-linux-gnu
Successfully installed rb-inotify-0.11.1
Successfully installed rb-fsevent-0.11.2
Successfully installed listen-3.10.0
Successfully installed jekyll-watch-2.2.1
Successfully installed rake-13.4.2
Successfully installed google-protobuf-4.35.1-x86_64-linux-gnu
Successfully installed sass-embedded-1.102.0-x86_64-linux-gnu
Successfully installed jekyll-sass-converter-3.1.0
Successfully installed concurrent-ruby-1.3.8
Successfully installed i18n-1.15.2
Building native extensions. This could take a while...
Successfully installed http_parser.rb-0.8.1
Building native extensions. This could take a while...
Successfully installed eventmachine-1.2.7
Successfully installed em-websocket-0.5.3
Successfully installed colorator-1.1.0
Successfully installed jekyll-4.3.4
23 gems installed
Successfully installed webrick-1.9.2
1 gem installed
[33mConfiguration file: none[0m
            Source: /home/runner/work/proaiexpert.github.io/proaiexpert.github.io
       Destination: /home/runner/work/proaiexpert.github.io/proaiexpert.github.io/_site
 Incremental build: disabled. Enable with --incremental
      Generating... 
                    done in 0.166 seconds.
 Auto-regeneration: disabled. Use --watch to enable.
```

## Generated validation log
```
GENERATED VALIDATION: FAIL
 - en: missing internal routes: ['/handyman-vancouver-portland-demo/']
 - ru: missing internal routes: ['/handyman-vancouver-portland-demo/']
```

## Browser QA log tail
```
    +     "right": 344.6,
    +     "tag": "H2",
    +     "width": 326.6,
    +   },
    +   Object {
    +     "cls": "",
    +     "id": "",
    +     "left": 18,
    +     "right": 344.6,
    +     "tag": "P",
    +     "width": 326.6,
    +   },
    +   Object {
    +     "cls": "hpv2-evidence-list",
    +     "id": "",
    +     "left": 18,
    +     "right": 344.6,
    +     "tag": "UL",
    +     "width": 326.6,
    +   },
    +   Object {
    +     "cls": "",
    +     "id": "",
    +     "left": 18,
    +     "right": 344.6,
    +     "tag": "LI",
    +     "width": 326.6,
    +   },
    +   Object {
    +     "cls": "",
    +     "id": "",
    +     "left": 18,
    +     "right": 344.6,
    +     "tag": "LI",
    +     "width": 326.6,
    +   },
    +   Object {
    +     "cls": "",
    +     "id": "",
    +     "left": 18,
    +     "right": 344.6,
    +     "tag": "LI",
    +     "width": 326.6,
    +   },
    +   Object {
    +     "cls": "",
    +     "id": "",
    +     "left": 18,
    +     "right": 344.6,
    +     "tag": "LI",
    +     "width": 326.6,
    +   },
    +   Object {
    +     "cls": "",
    +     "id": "",
    +     "left": 18,
    +     "right": 344.6,
    +     "tag": "LI",
    +     "width": 326.6,
    +   },
    +   Object {
    +     "cls": "hpv2-disclosure",
    +     "id": "",
    +     "left": 18,
    +     "right": 344.6,
    +     "tag": "P",
    +     "width": 326.6,
    +   },
    +   Object {
    +     "cls": "hpv2-actions",
    +     "id": "",
    +     "left": 18,
    +     "right": 344.6,
    +     "tag": "DIV",
    +     "width": 326.6,
    +   },
    +   Object {
    +     "cls": "hpv2-button hpv2-button--primary",
    +     "id": "",
    +     "left": 18,
    +     "right": 344.6,
    +     "tag": "A",
    +     "width": 326.6,
    +   },
    +   Object {
    +     "cls": "hpv2-button hpv2-button--secondary",
    +     "id": "",
    +     "left": 18,
    +     "right": 344.6,
    +     "tag": "A",
    +     "width": 326.6,
    +   },
    + ]

      79 |     });
      80 |     expect(metrics.scrollWidth, JSON.stringify(metrics.overflowers, null, 2)).toBeLessThanOrEqual(metrics.clientWidth);
    > 81 |     expect(metrics.overflowers, 'Visible elements crossing viewport').toEqual([]);
         |                                                                       ^
      82 |     expect(metrics.brokenImages, 'Images with naturalWidth=0').toEqual([]);
      83 |
      84 |     if (item.width <= 844) {
        at /home/runner/work/proaiexpert.github.io/proaiexpert.github.io/homepage-v2-qa.spec.js:81:71

    Error Context: test-results/homepage-v2-qa-RU-320-chromium/error-context.md


[7/10] [chromium] › homepage-v2-qa.spec.js:21:3 › EN-844x390
  7) [chromium] › homepage-v2-qa.spec.js:21:3 › EN-844x390 ─────────────────────────────────────────

    Error: Images with naturalWidth=0

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 7

    - Array []
    + Array [
    +   "/assets/img/cases/financial-stream/fs-home-desktop-en-1600w.webp",
    +   "/assets/img/cases/financial-stream/fs-home-mobile-en-640w.webp",
    +   "/ru/about/ProAI_Founder_Portrait_2x3.webp",
    +   "/assets/img/cases/alina-horb/final-assets-v1/delivery/alina-horb-home-ua-desktop.webp",
    +   "/assets/img/cases/local-repair-pro/production-v1/lrp-01-homepage-hero-1920.webp",
    + ]

      80 |     expect(metrics.scrollWidth, JSON.stringify(metrics.overflowers, null, 2)).toBeLessThanOrEqual(metrics.clientWidth);
      81 |     expect(metrics.overflowers, 'Visible elements crossing viewport').toEqual([]);
    > 82 |     expect(metrics.brokenImages, 'Images with naturalWidth=0').toEqual([]);
         |                                                                ^
      83 |
      84 |     if (item.width <= 844) {
      85 |       const smallTargets = await page.evaluate(() => {
        at /home/runner/work/proaiexpert.github.io/proaiexpert.github.io/homepage-v2-qa.spec.js:82:64

    Error Context: test-results/homepage-v2-qa-EN-844x390-chromium/error-context.md


[8/10] [chromium] › homepage-v2-qa.spec.js:21:3 › RU-844x390
  8) [chromium] › homepage-v2-qa.spec.js:21:3 › RU-844x390 ─────────────────────────────────────────

    Error: Images with naturalWidth=0

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 7

    - Array []
    + Array [
    +   "/assets/img/cases/financial-stream/fs-home-desktop-ru-1600w.webp",
    +   "/assets/img/cases/financial-stream/fs-home-mobile-ru-640w.webp",
    +   "/ru/about/ProAI_Founder_Portrait_2x3.webp",
    +   "/assets/img/cases/alina-horb/final-assets-v1/delivery/alina-horb-home-ua-desktop.webp",
    +   "/assets/img/cases/local-repair-pro/production-v1/lrp-01-homepage-hero-1920.webp",
    + ]

      80 |     expect(metrics.scrollWidth, JSON.stringify(metrics.overflowers, null, 2)).toBeLessThanOrEqual(metrics.clientWidth);
      81 |     expect(metrics.overflowers, 'Visible elements crossing viewport').toEqual([]);
    > 82 |     expect(metrics.brokenImages, 'Images with naturalWidth=0').toEqual([]);
         |                                                                ^
      83 |
      84 |     if (item.width <= 844) {
      85 |       const smallTargets = await page.evaluate(() => {
        at /home/runner/work/proaiexpert.github.io/proaiexpert.github.io/homepage-v2-qa.spec.js:82:64

    Error Context: test-results/homepage-v2-qa-RU-844x390-chromium/error-context.md


[9/10] [chromium] › homepage-v2-qa.spec.js:132:1 › EN reduced-motion contract
[10/10] [chromium] › homepage-v2-qa.spec.js:147:1 › EN forced-colors smoke
  8 failed
    [chromium] › homepage-v2-qa.spec.js:21:3 › EN-1440 ─────────────────────────────────────────────
    [chromium] › homepage-v2-qa.spec.js:21:3 › RU-1440 ─────────────────────────────────────────────
    [chromium] › homepage-v2-qa.spec.js:21:3 › EN-390 ──────────────────────────────────────────────
    [chromium] › homepage-v2-qa.spec.js:21:3 › RU-390 ──────────────────────────────────────────────
    [chromium] › homepage-v2-qa.spec.js:21:3 › EN-320 ──────────────────────────────────────────────
    [chromium] › homepage-v2-qa.spec.js:21:3 › RU-320 ──────────────────────────────────────────────
    [chromium] › homepage-v2-qa.spec.js:21:3 › EN-844x390 ──────────────────────────────────────────
    [chromium] › homepage-v2-qa.spec.js:21:3 › RU-844x390 ──────────────────────────────────────────
  2 passed (33.7s)
```
