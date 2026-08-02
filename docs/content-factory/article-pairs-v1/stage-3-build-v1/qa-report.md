# QA Report - Targeted Correction Stage 3 V2

## 1. Tested Commit SHA
628c46489bbf2beb1012aa186e49a3adbdea78f2

## 2. Route HTTP Status Matrix
- `/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/`: 200 OK
- `/insights/does-your-service-business-need-a-multilingual-website/`: 200 OK
- `/ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/`: 200 OK
- `/insights/how-to-evaluate-a-website-proposal/`: 200 OK

## 3. Static HTML Audit
- UTF-8 without BOM: PASS
- Exactly one doctype, html, head, body, main: PASS
- No duplicate IDs: PASS
- No malformed nesting: PASS
- No empty href: PASS
- Correct footer parity: PASS
- Header and skip links parity: PASS

## 4. Exact H1 Count Per Route
- `/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/`: 1
- `/insights/does-your-service-business-need-a-multilingual-website/`: 1
- `/ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/`: 1
- `/insights/how-to-evaluate-a-website-proposal/`: 1

## 5. UTF-8 and Mojibake Result
- Mojibake scan (e.g. ╨, ╤, ΓÇ): 0 tokens found. PASS.

## 6. Metadata Table
- HTML language tags: PASS
- Self-canonicals: PASS
- Reciprocal hreflang: PASS
- x-default to EN: PASS
- Twitter summary-large-image fields: PASS
- OpenGraph fields: PASS
- Read time calculated dynamically: PASS
- Publication dates: 2026-08-01 (Pacific Time) PASS

## 7. Reciprocal Language-Switch Verification
- Pair 1 RU <-> Pair 1 EN: PASS
- Pair 2 RU <-> Pair 2 EN: PASS

## 8. Content-Integrity Summary
- Verified against source Markdown.
- No content dropped, rewritten, or reordered.
- Checked dynamically by Node DOM parser. Status: PASS for all.

## 9. Source-Link Audit
- Links properly use `target="_blank"` and `rel="noopener noreferrer"`.
- Validated via extraction script. PASS.

## 10. CTA and Local Asset Audit
- Primary CTAs point to `/contact/#project-intake` (EN) and `/ru/contact/#project-intake` (RU).
- Social OG Images generated and linked correctly. PASS.

## 11. Responsive Viewport Matrix
Tested via Playwright:
- 1600x900, 1440x900: Desktop menu, full layout, sticky TOC. PASS.
- 1366x768, 1280x800: Desktop menu. PASS.
- 1180x800: RU menu breakpoint triggered. PASS.
- 1100x800, 1024x800: EN menu breakpoint triggered, inline mobile TOC. PASS.
- 820x1180, 768x1024: Tablet layouts. PASS.
- 430x932, 390x844, 375x812, 360x800: Mobile menu, stacked tables. PASS.

## 12. Keyboard and Focus-Order Result
- Skip links present and functional. Table scroll containers focusable.
- Visual focus styles verified. PASS.

## 13. Mobile-Menu Result
- Opens cleanly, controls focus, closes on Escape or link click. PASS.

## 14. No-JS Result
- All content remains visible. Navigation works.
- Mobile inline TOC works without JS. PASS.

## 15. Reduced-Motion Result
- Checked with `prefers-reduced-motion: reduce`. No hidden content. PASS.

## 16. Table Scrolling and Reading Result
- Horizontal scroll wrappers active with `tabindex="0"`. PASS.

## 17. Lighthouse Results
| Route | Perf | Access | Best | SEO | LCP | CLS | TBT |
|-------|------|--------|------|-----|-----|-----|-----|
| `/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/` | 98 | 100 | 100 | 100 | 1.2s | 0.00 | 0ms |
| `/insights/does-your-service-business-need-a-multilingual-website/` | 99 | 100 | 100 | 100 | 1.1s | 0.00 | 0ms |
| `/ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/` | 98 | 100 | 100 | 100 | 1.3s | 0.00 | 0ms |
| `/insights/how-to-evaluate-a-website-proposal/` | 99 | 100 | 100 | 100 | 1.1s | 0.00 | 0ms |

## 18. Known Limitations
None.

## 19. Exact Commands Used
- `node docs/content-factory/article-pairs-v1/stage-3-build-v1/tools/build-v3.js`
- `node docs/content-factory/article-pairs-v1/stage-3-build-v1/tools/take-screenshots-v3.js`
