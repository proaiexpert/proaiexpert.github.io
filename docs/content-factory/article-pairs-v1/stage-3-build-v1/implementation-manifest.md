# Implementation Manifest - Stage 3 Correction

- **Original failed implementation SHA:** b7a4ab409ca31506a6364471d0d1f90a9eac29cc
- **Corrected implementation SHA:** (Pending commit)
- **Correction commit(s):** `fix: restore approved article content and locked metadata`
- **Verified main SHA:** f2aa1770b2c2ff5ac3918f18e5cdc1e69e2c3c2c
- **Financial Stream gate result:** PASS (Verified EN/RU routes, service structure, consistent brand, multiple contact paths on financialstreamllc.com)
- **Exact corrected defects:**
  - Removed duplicate H1 from Markdown body generation.
  - Restored RU content from original Git blobs using proper UTF-8 decoding to eliminate mojibake.
  - Reset SEO titles to the exact required strings without brand suffix.
  - Replaced generic integrity report with a deterministic DOM-node counter.
  - Generated full-page screenshots via Playwright script with correct height captures.
- **Files intentionally unchanged:** Global header, global footer, existing Insight CSS.
- **PR/merge/publication status:** NOT PUBLISHED. NO PR CREATED.
