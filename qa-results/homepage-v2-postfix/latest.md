# Homepage V2 Post-Fix Technical QA

Tested QA commit: 18fef01c3a62be9f51391c962efa942e98104cc4
Production parent: c791a6e5e4c1e15bd0328cd890a7f055fe589019
Jekyll build: success
Generated validation: success
External/live targets: success
Playwright install: success
Local server: success
Browser matrix: failure
Artifact ID: 9008308790
Artifact URL: https://github.com/proaiexpert/proaiexpert.github.io/actions/runs/31215106730/artifacts/9008308790

## Generated validation
```
GENERATED VALIDATION: PASS
```

## External links
```
200 https://financialstreamllc.com/
200 https://alinahorb.com/
200 https://proai-expert.com/handyman-vancouver-portland-demo/
```

## Browser result
```json
[
  {
    "name": "EN-1440",
    "issues": [
      "skip fail"
    ],
    "state": {
      "scrollWidth": 1440,
      "clientWidth": 1440,
      "overflow": [],
      "broken": [],
      "sections": [
        "hero",
        "connected-journey",
        "directions",
        "financial-stream",
        "ways-to-start",
        "delivery",
        "founder",
        "selected-work",
        "insights",
        "private-review"
      ]
    },
    "touch": [],
    "menu": "n/a",
    "skip": "fail"
  },
  {
    "name": "RU-1440",
    "issues": [
      "skip fail"
    ],
    "state": {
      "scrollWidth": 1440,
      "clientWidth": 1440,
      "overflow": [],
      "broken": [],
      "sections": [
        "hero",
        "connected-journey",
        "directions",
        "financial-stream",
        "ways-to-start",
        "delivery",
        "founder",
        "selected-work",
        "insights",
        "private-review"
      ]
    },
    "touch": [],
    "menu": "n/a",
    "skip": "fail"
  },
  {
    "name": "EN-390",
    "issues": [
      "touch targets [{\"text\":\"Discuss your project →\",\"w\":178,\"h\":20,\"cls\":\"site-footer__primary-action\"},{\"text\":\"PROAIEXPERT\",\"w\":114,\"h\":20,\"cls\":\"site-footer__logo\"},{\"text\":\"LinkedIn\",\"w\":64,\"h\":20,\"cls\":\"\"},{\"text\":\"GitHub\",\"w\":53,\"h\":20,\"cls\":\"\"},{\"text\":\"X\",\"w\":11,\"h\":20,\"cls\":\"\"},{\"text\":\"Telegram\",\"w\":71,\"h\":20,\"cls\":\"\"},{\"text\":\"RU\",\"w\":24,\"h\":20,\"cls\":\"\"}]",
      "menu fail:locator.click: Timeout 30000ms exceeded.\nCall log:\n  - waiting for locator('main')\n    - locator resolved to <main class=\"hpv2\" tabindex=\"-1\" id=\"main-content\">…</main>\n  - attempting click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting 20ms\n    2 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 100ms\n    3 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"en\">…</html> intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"en\">…</html> intercepts pointer events\n  11 × retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n",
      "skip fail"
    ],
    "state": {
      "scrollWidth": 390,
      "clientWidth": 390,
      "overflow": [],
      "broken": [],
      "sections": [
        "hero",
        "connected-journey",
        "directions",
        "financial-stream",
        "ways-to-start",
        "delivery",
        "founder",
        "selected-work",
        "insights",
        "private-review"
      ]
    },
    "touch": [
      {
        "text": "Discuss your project →",
        "w": 178,
        "h": 20,
        "cls": "site-footer__primary-action"
      },
      {
        "text": "PROAIEXPERT",
        "w": 114,
        "h": 20,
        "cls": "site-footer__logo"
      },
      {
        "text": "LinkedIn",
        "w": 64,
        "h": 20,
        "cls": ""
      },
      {
        "text": "GitHub",
        "w": 53,
        "h": 20,
        "cls": ""
      },
      {
        "text": "X",
        "w": 11,
        "h": 20,
        "cls": ""
      },
      {
        "text": "Telegram",
        "w": 71,
        "h": 20,
        "cls": ""
      },
      {
        "text": "RU",
        "w": 24,
        "h": 20,
        "cls": ""
      }
    ],
    "menu": "fail:locator.click: Timeout 30000ms exceeded.\nCall log:\n  - waiting for locator('main')\n    - locator resolved to <main class=\"hpv2\" tabindex=\"-1\" id=\"main-content\">…</main>\n  - attempting click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting 20ms\n    2 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 100ms\n    3 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"en\">…</html> intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"en\">…</html> intercepts pointer events\n  11 × retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n",
    "skip": "fail"
  },
  {
    "name": "RU-390",
    "issues": [
      "touch targets [{\"text\":\"Обсудить проект →\",\"w\":146.7,\"h\":20,\"cls\":\"site-footer__primary-action\"},{\"text\":\"PROAIEXPERT\",\"w\":114,\"h\":20,\"cls\":\"site-footer__logo\"},{\"text\":\"LinkedIn\",\"w\":64,\"h\":20,\"cls\":\"\"},{\"text\":\"GitHub\",\"w\":53,\"h\":20,\"cls\":\"\"},{\"text\":\"X\",\"w\":11,\"h\":20,\"cls\":\"\"},{\"text\":\"Telegram\",\"w\":71,\"h\":20,\"cls\":\"\"},{\"text\":\"EN\",\"w\":23,\"h\":20,\"cls\":\"\"}]",
      "menu fail:locator.click: Timeout 30000ms exceeded.\nCall log:\n  - waiting for locator('main')\n    - locator resolved to <main class=\"hpv2\" tabindex=\"-1\" id=\"main-content\">…</main>\n  - attempting click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting 20ms\n    2 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 100ms\n    3 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"ru\">…</html> intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"ru\">…</html> intercepts pointer events\n  11 × retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n",
      "skip fail"
    ],
    "state": {
      "scrollWidth": 390,
      "clientWidth": 390,
      "overflow": [],
      "broken": [],
      "sections": [
        "hero",
        "connected-journey",
        "directions",
        "financial-stream",
        "ways-to-start",
        "delivery",
        "founder",
        "selected-work",
        "insights",
        "private-review"
      ]
    },
    "touch": [
      {
        "text": "Обсудить проект →",
        "w": 146.7,
        "h": 20,
        "cls": "site-footer__primary-action"
      },
      {
        "text": "PROAIEXPERT",
        "w": 114,
        "h": 20,
        "cls": "site-footer__logo"
      },
      {
        "text": "LinkedIn",
        "w": 64,
        "h": 20,
        "cls": ""
      },
      {
        "text": "GitHub",
        "w": 53,
        "h": 20,
        "cls": ""
      },
      {
        "text": "X",
        "w": 11,
        "h": 20,
        "cls": ""
      },
      {
        "text": "Telegram",
        "w": 71,
        "h": 20,
        "cls": ""
      },
      {
        "text": "EN",
        "w": 23,
        "h": 20,
        "cls": ""
      }
    ],
    "menu": "fail:locator.click: Timeout 30000ms exceeded.\nCall log:\n  - waiting for locator('main')\n    - locator resolved to <main class=\"hpv2\" tabindex=\"-1\" id=\"main-content\">…</main>\n  - attempting click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting 20ms\n    2 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 100ms\n    3 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"ru\">…</html> intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"ru\">…</html> intercepts pointer events\n  11 × retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n",
    "skip": "fail"
  },
  {
    "name": "EN-320",
    "issues": [
      "touch targets [{\"text\":\"Discuss your project →\",\"w\":178,\"h\":20,\"cls\":\"site-footer__primary-action\"},{\"text\":\"PROAIEXPERT\",\"w\":114,\"h\":20,\"cls\":\"site-footer__logo\"},{\"text\":\"LinkedIn\",\"w\":64,\"h\":20,\"cls\":\"\"},{\"text\":\"GitHub\",\"w\":53,\"h\":20,\"cls\":\"\"},{\"text\":\"X\",\"w\":11,\"h\":20,\"cls\":\"\"},{\"text\":\"Telegram\",\"w\":71,\"h\":20,\"cls\":\"\"},{\"text\":\"RU\",\"w\":24,\"h\":20,\"cls\":\"\"}]",
      "menu fail:locator.click: Timeout 30000ms exceeded.\nCall log:\n  - waiting for locator('main')\n    - locator resolved to <main class=\"hpv2\" tabindex=\"-1\" id=\"main-content\">…</main>\n  - attempting click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting 20ms\n    2 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 100ms\n    3 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"en\">…</html> intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"en\">…</html> intercepts pointer events\n  11 × retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n",
      "skip fail"
    ],
    "state": {
      "scrollWidth": 320,
      "clientWidth": 320,
      "overflow": [],
      "broken": [],
      "sections": [
        "hero",
        "connected-journey",
        "directions",
        "financial-stream",
        "ways-to-start",
        "delivery",
        "founder",
        "selected-work",
        "insights",
        "private-review"
      ]
    },
    "touch": [
      {
        "text": "Discuss your project →",
        "w": 178,
        "h": 20,
        "cls": "site-footer__primary-action"
      },
      {
        "text": "PROAIEXPERT",
        "w": 114,
        "h": 20,
        "cls": "site-footer__logo"
      },
      {
        "text": "LinkedIn",
        "w": 64,
        "h": 20,
        "cls": ""
      },
      {
        "text": "GitHub",
        "w": 53,
        "h": 20,
        "cls": ""
      },
      {
        "text": "X",
        "w": 11,
        "h": 20,
        "cls": ""
      },
      {
        "text": "Telegram",
        "w": 71,
        "h": 20,
        "cls": ""
      },
      {
        "text": "RU",
        "w": 24,
        "h": 20,
        "cls": ""
      }
    ],
    "menu": "fail:locator.click: Timeout 30000ms exceeded.\nCall log:\n  - waiting for locator('main')\n    - locator resolved to <main class=\"hpv2\" tabindex=\"-1\" id=\"main-content\">…</main>\n  - attempting click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting 20ms\n    2 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 100ms\n    3 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"en\">…</html> intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"en\">…</html> intercepts pointer events\n  11 × retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n",
    "skip": "fail"
  },
  {
    "name": "RU-320",
    "issues": [
      "touch targets [{\"text\":\"Обсудить проект →\",\"w\":146.7,\"h\":20,\"cls\":\"site-footer__primary-action\"},{\"text\":\"PROAIEXPERT\",\"w\":114,\"h\":20,\"cls\":\"site-footer__logo\"},{\"text\":\"LinkedIn\",\"w\":64,\"h\":20,\"cls\":\"\"},{\"text\":\"GitHub\",\"w\":53,\"h\":20,\"cls\":\"\"},{\"text\":\"X\",\"w\":11,\"h\":20,\"cls\":\"\"},{\"text\":\"Telegram\",\"w\":71,\"h\":20,\"cls\":\"\"},{\"text\":\"EN\",\"w\":23,\"h\":20,\"cls\":\"\"}]",
      "menu fail:locator.click: Timeout 30000ms exceeded.\nCall log:\n  - waiting for locator('main')\n    - locator resolved to <main class=\"hpv2\" tabindex=\"-1\" id=\"main-content\">…</main>\n  - attempting click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting 20ms\n    2 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 100ms\n    3 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"ru\">…</html> intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"ru\">…</html> intercepts pointer events\n  11 × retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n",
      "skip fail"
    ],
    "state": {
      "scrollWidth": 320,
      "clientWidth": 320,
      "overflow": [],
      "broken": [],
      "sections": [
        "hero",
        "connected-journey",
        "directions",
        "financial-stream",
        "ways-to-start",
        "delivery",
        "founder",
        "selected-work",
        "insights",
        "private-review"
      ]
    },
    "touch": [
      {
        "text": "Обсудить проект →",
        "w": 146.7,
        "h": 20,
        "cls": "site-footer__primary-action"
      },
      {
        "text": "PROAIEXPERT",
        "w": 114,
        "h": 20,
        "cls": "site-footer__logo"
      },
      {
        "text": "LinkedIn",
        "w": 64,
        "h": 20,
        "cls": ""
      },
      {
        "text": "GitHub",
        "w": 53,
        "h": 20,
        "cls": ""
      },
      {
        "text": "X",
        "w": 11,
        "h": 20,
        "cls": ""
      },
      {
        "text": "Telegram",
        "w": 71,
        "h": 20,
        "cls": ""
      },
      {
        "text": "EN",
        "w": 23,
        "h": 20,
        "cls": ""
      }
    ],
    "menu": "fail:locator.click: Timeout 30000ms exceeded.\nCall log:\n  - waiting for locator('main')\n    - locator resolved to <main class=\"hpv2\" tabindex=\"-1\" id=\"main-content\">…</main>\n  - attempting click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting 20ms\n    2 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 100ms\n    3 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"ru\">…</html> intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"ru\">…</html> intercepts pointer events\n  11 × retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n",
    "skip": "fail"
  },
  {
    "name": "EN-844x390",
    "issues": [
      "touch targets [{\"text\":\"How to Evaluate a Website Proposal Before You Sign\",\"w\":626.3,\"h\":33,\"cls\":\"\"},{\"text\":\"What Happens After a Lead Arrives?\",\"w\":438.7,\"h\":33,\"cls\":\"\"},{\"text\":\"Discuss your project →\",\"w\":178,\"h\":20,\"cls\":\"site-footer__primary-action\"},{\"text\":\"PROAIEXPERT\",\"w\":114,\"h\":20,\"cls\":\"site-footer__logo\"},{\"text\":\"LinkedIn\",\"w\":64,\"h\":20,\"cls\":\"\"},{\"text\":\"GitHub\",\"w\":53,\"h\":20,\"cls\":\"\"},{\"text\":\"X\",\"w\":11,\"h\":20,\"cls\":\"\"},{\"text\":\"Telegram\",\"w\":71,\"h\":20,\"cls\":\"\"},{\"text\":\"RU\",\"w\":24,\"h\":20,\"cls\":\"\"}]",
      "menu fail:locator.click: Timeout 30000ms exceeded.\nCall log:\n  - waiting for locator('main')\n    - locator resolved to <main class=\"hpv2\" tabindex=\"-1\" id=\"main-content\">…</main>\n  - attempting click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting 20ms\n    2 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 100ms\n    3 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"en\">…</html> intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"en\">…</html> intercepts pointer events\n  11 × retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n",
      "skip fail"
    ],
    "state": {
      "scrollWidth": 844,
      "clientWidth": 844,
      "overflow": [],
      "broken": [],
      "sections": [
        "hero",
        "connected-journey",
        "directions",
        "financial-stream",
        "ways-to-start",
        "delivery",
        "founder",
        "selected-work",
        "insights",
        "private-review"
      ]
    },
    "touch": [
      {
        "text": "How to Evaluate a Website Proposal Before You Sign",
        "w": 626.3,
        "h": 33,
        "cls": ""
      },
      {
        "text": "What Happens After a Lead Arrives?",
        "w": 438.7,
        "h": 33,
        "cls": ""
      },
      {
        "text": "Discuss your project →",
        "w": 178,
        "h": 20,
        "cls": "site-footer__primary-action"
      },
      {
        "text": "PROAIEXPERT",
        "w": 114,
        "h": 20,
        "cls": "site-footer__logo"
      },
      {
        "text": "LinkedIn",
        "w": 64,
        "h": 20,
        "cls": ""
      },
      {
        "text": "GitHub",
        "w": 53,
        "h": 20,
        "cls": ""
      },
      {
        "text": "X",
        "w": 11,
        "h": 20,
        "cls": ""
      },
      {
        "text": "Telegram",
        "w": 71,
        "h": 20,
        "cls": ""
      },
      {
        "text": "RU",
        "w": 24,
        "h": 20,
        "cls": ""
      }
    ],
    "menu": "fail:locator.click: Timeout 30000ms exceeded.\nCall log:\n  - waiting for locator('main')\n    - locator resolved to <main class=\"hpv2\" tabindex=\"-1\" id=\"main-content\">…</main>\n  - attempting click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting 20ms\n    2 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 100ms\n    3 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"en\">…</html> intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"en\">…</html> intercepts pointer events\n  11 × retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n",
    "skip": "fail"
  },
  {
    "name": "RU-844x390",
    "issues": [
      "touch targets [{\"text\":\"Как проверить подрядчика и предложение на сайт в США\",\"w\":703.5,\"h\":33,\"cls\":\"\"},{\"text\":\"Обсудить проект →\",\"w\":146.7,\"h\":20,\"cls\":\"site-footer__primary-action\"},{\"text\":\"PROAIEXPERT\",\"w\":114,\"h\":20,\"cls\":\"site-footer__logo\"},{\"text\":\"LinkedIn\",\"w\":64,\"h\":20,\"cls\":\"\"},{\"text\":\"GitHub\",\"w\":53,\"h\":20,\"cls\":\"\"},{\"text\":\"X\",\"w\":11,\"h\":20,\"cls\":\"\"},{\"text\":\"Telegram\",\"w\":71,\"h\":20,\"cls\":\"\"},{\"text\":\"EN\",\"w\":23,\"h\":20,\"cls\":\"\"}]",
      "menu fail:locator.click: Timeout 30000ms exceeded.\nCall log:\n  - waiting for locator('main')\n    - locator resolved to <main class=\"hpv2\" tabindex=\"-1\" id=\"main-content\">…</main>\n  - attempting click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting 20ms\n    2 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 100ms\n    3 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"ru\">…</html> intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"ru\">…</html> intercepts pointer events\n  11 × retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n",
      "skip fail"
    ],
    "state": {
      "scrollWidth": 844,
      "clientWidth": 844,
      "overflow": [],
      "broken": [],
      "sections": [
        "hero",
        "connected-journey",
        "directions",
        "financial-stream",
        "ways-to-start",
        "delivery",
        "founder",
        "selected-work",
        "insights",
        "private-review"
      ]
    },
    "touch": [
      {
        "text": "Как проверить подрядчика и предложение на сайт в США",
        "w": 703.5,
        "h": 33,
        "cls": ""
      },
      {
        "text": "Обсудить проект →",
        "w": 146.7,
        "h": 20,
        "cls": "site-footer__primary-action"
      },
      {
        "text": "PROAIEXPERT",
        "w": 114,
        "h": 20,
        "cls": "site-footer__logo"
      },
      {
        "text": "LinkedIn",
        "w": 64,
        "h": 20,
        "cls": ""
      },
      {
        "text": "GitHub",
        "w": 53,
        "h": 20,
        "cls": ""
      },
      {
        "text": "X",
        "w": 11,
        "h": 20,
        "cls": ""
      },
      {
        "text": "Telegram",
        "w": 71,
        "h": 20,
        "cls": ""
      },
      {
        "text": "EN",
        "w": 23,
        "h": 20,
        "cls": ""
      }
    ],
    "menu": "fail:locator.click: Timeout 30000ms exceeded.\nCall log:\n  - waiting for locator('main')\n    - locator resolved to <main class=\"hpv2\" tabindex=\"-1\" id=\"main-content\">…</main>\n  - attempting click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  - retrying click action\n    - waiting 20ms\n    2 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 100ms\n    3 × waiting for element to be visible, enabled and stable\n      - element is not stable\n    - retrying click action\n      - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"ru\">…</html> intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n    - waiting for element to be visible, enabled and stable\n    - element is visible, enabled and stable\n    - scrolling into view if needed\n    - done scrolling\n    - <html lang=\"ru\">…</html> intercepts pointer events\n  11 × retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is not stable\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard is-scrolled\">…</header> subtree intercepts pointer events\n     - retrying click action\n       - waiting 500ms\n       - waiting for element to be visible, enabled and stable\n       - element is visible, enabled and stable\n       - scrolling into view if needed\n       - done scrolling\n       - <div class=\"site-header__shell\">…</div> from <header data-site-header=\"\" class=\"site-header site-header--standard\">…</header> subtree intercepts pointer events\n  2 × retrying click action\n      - waiting 500ms\n      - waiting for element to be visible, enabled and stable\n      - element is not stable\n  - retrying click action\n    - waiting 500ms\n",
    "skip": "fail"
  },
  {
    "name": "reduced-motion",
    "issues": []
  },
  {
    "name": "forced-colors",
    "issues": []
  }
]```
