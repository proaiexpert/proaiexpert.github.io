#!/usr/bin/env python3
"""Live HTTP smoke gate for the Cloudflare static Owner Preview, not just Jekyll CI.

This verifies the actual response from the branch Pages host. It never mutates
Cloudflare, main, or production. The host is the observed Cloudflare branch alias.
"""
from __future__ import annotations
import hashlib
import time
import urllib.error
import urllib.request
from pathlib import Path

HOST = "https://fix-connected-system-css-bun.proaiexpert-github-io.pages.dev"
PREFIX = "/owner-preview/connected-system-css-bundle/"
ROUTES = (
    ("EN", PREFIX, Path("owner-preview/connected-system-css-bundle/index.html")),
    ("RU", PREFIX + "ru/", Path("owner-preview/connected-system-css-bundle/ru/index.html")),
)
CSS = "/assets/css/homepage-connected-system-r142-bundled-preview.css"

def fetch(url: str) -> tuple[int, bytes]:
    request = urllib.request.Request(url, headers={
        "User-Agent": "ProAI-Expert-Owner-Preview-QA/1.0",
        "Accept-Encoding": "identity",
    })
    with urllib.request.urlopen(request, timeout=18) as response:
        return response.status, response.read()

def check():
    for language, route, local in ROUTES:
        url = HOST + route
        data = local.read_bytes()
        expected = hashlib.sha256(data).hexdigest()
        last_error = "not started"
        for attempt in range(1, 21):
            try:
                status, body = fetch(url)
                text = body.decode("utf-8")
                checks = {
                    "http200": status == 200,
                    "compiled_mark": 'name="proai-preview-artifact"' in text,
                    "noindex": 'name="robots" content="noindex, nofollow, noarchive"' in text,
                    "no_liquid": "{%" not in text and "{{" not in text,
                    "connected": 'data-connected-next' in text,
                    "all_stages": all(f'data-stage-button="{i}"' in text for i in range(1, 5)),
                    "header": 'site-header__nav' in text,
                    "footer": 'data-home-footer-golden-r3' in text,
                    "correct_css": CSS in text,
                    "byte_identity": hashlib.sha256(body).hexdigest() == expected,
                }
                if all(checks.values()):
                    print(f"LIVE_PREVIEW_OK {language} url={url} bytes={len(body)} sha256={expected}")
                    break
                last_error = f"HTTP {status} checks={checks} remote_bytes={len(body)}"
            except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, UnicodeError) as e:
                last_error = f"{type(e).__name__}: {e}"
            print(f"LIVE_PREVIEW_RETRY {language} attempt={attempt} error={last_error}")
            if attempt == 20:
                raise RuntimeError(f"Cloudflare live preview not verified for {language}: {last_error}")
            time.sleep(5)
    url = HOST + CSS
    code, data = fetch(url)
    css = data.decode("utf-8")
    assert code == 200 and len(data) > 80000, (code, len(data))
    assert "@import url(" not in css, "Nested CSS imports survived in Cloudflare"
    assert ".state-ledger" in css and ".connected-next__sticky-stage" in css
    print(f"LIVE_CSS_OK url={url} bytes={len(data)}")
    print("LIVE_CLOUDFLARE_OWNER_PREVIEW_PASS EN+RU+CSS")

if __name__ == "__main__":
    check()
