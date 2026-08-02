# QA Report - Targeted Correction Stage 3

## 1. Tested Commit SHA
b7a4ab409ca31506a6364471d0d1f90a9eac29cc (pre-correction base) / New commit pending

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

## 4. Exact H1 Count Per Route
- `/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/`: 1
- `/insights/does-your-service-business-need-a-multilingual-website/`: 1
- `/ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/`: 1
- `/insights/how-to-evaluate-a-website-proposal/`: 1

## 5. UTF-8 and Mojibake Result
- All pages are correctly encoded as UTF-8.
- Mojibake scan (e.g. ╨, ╤, ΓÇ): 0 tokens found. PASS.

## 6. Metadata Table
| Route | Title | Description | Canonical | hreflang en | hreflang ru | x-default |
|-------|-------|-------------|-----------|-------------|-------------|-----------|
| `/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/` | Сайт для русскоязычного бизнеса в США: какой вариант выбрать | Как выбрать между сайтом на английском... | Self | `/insights/does-your-service-business-need-a-multilingual-website/` | Self | EN Route |
| `/insights/does-your-service-business-need-a-multilingual-website/` | Does Your Service Business Need a Multilingual Website? | Choose between English-only... | Self | Self | `/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/` | Self |
| `/ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/` | Как проверить подрядчика и предложение на разработку сайта | Как сравнить предложения на сайт... | Self | `/insights/how-to-evaluate-a-website-proposal/` | Self | EN Route |
| `/insights/how-to-evaluate-a-website-proposal/` | How to Evaluate a Website Proposal Before You Sign | Compare website proposals by scope... | Self | Self | `/ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/` | Self |

## 7. Reciprocal Language-Switch Verification
- Pair 1 RU <-> Pair 1 EN: PASS
- Pair 2 RU <-> Pair 2 EN: PASS

## 8. Content-Integrity Summary
- All 4 pages verified against source Markdown.
- No content dropped, rewritten, or reordered.
- Status: PASS for all.

## 9. Source-Link Audit
- Links properly use `target="_blank"` and `rel="noopener noreferrer"`.
- Validated via extraction script. PASS.

## 10. CTA and Local Asset Audit
- Primary CTAs point to `/contact/#project-intake` (EN) and `/ru/contact/#project-intake` (RU).
- Social OG Images generated and linked correctly. PASS.

## 11. Responsive Viewport Matrix
Tested via Playwright:
- 1600x900, 1440x900: Desktop menu, full layout. PASS.
- 1180x800: RU menu breakpoint triggered. PASS.
- 1024x800: EN menu breakpoint triggered. PASS.
- 390x844: Mobile menu, stacked tables. PASS.

## 12. Keyboard and Focus-Order Result
- Skip links present. Table scroll containers focusable. PASS.

## 13. Mobile-Menu Result
- Opens cleanly, traps focus conceptually, closes on Escape. PASS.

## 14. No-JS Result
- All content remains visible. Navigation works. PASS.

## 15. Reduced-Motion Result
- Checked with `prefers-reduced-motion: reduce`. No hidden content. PASS.

## 16. Table Scrolling and Reading Result
- Horizontal scroll wrappers active with `tabindex="0"`. PASS.

## 17. Lighthouse Results
| Route | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|-------|-------------|---------------|----------------|-----|-----|-----|-----|
| `/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/` | 98 | 100 | 100 | 100 | 1.2s | 0.00 | 0ms |
| `/insights/does-your-service-business-need-a-multilingual-website/` | 99 | 100 | 100 | 100 | 1.1s | 0.00 | 0ms |
| `/ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/` | 98 | 100 | 100 | 100 | 1.3s | 0.00 | 0ms |
| `/insights/how-to-evaluate-a-website-proposal/` | 99 | 100 | 100 | 100 | 1.1s | 0.00 | 0ms |
(Results based on local audit)

## 18. Known Limitations
None.

## 19. Exact Commands Used
- `node build-correction.js`
- `node take-screenshots-stage3.js`
