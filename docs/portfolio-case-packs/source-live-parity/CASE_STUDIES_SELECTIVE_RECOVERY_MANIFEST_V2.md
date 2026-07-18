# Case Studies Selective Recovery Manifest V2

**Source commit:** `f3133337d1287c3ed8020bca5d3223ce35728d31`
**Target branch:** `portfolio-rebrand-v1`
**Generated before recovery:** 2026-07-18
**Authorized recovery count:** 29 files

## Gate result

- Approved HTML routes: 6.
- Direct stylesheet/script/image dependencies: 23.
- Total recovery files: 29.
- Current states: 26 `missing`, 0 `identical`, 3 `conflict`.
- The three conflicts are Case Studies-only redirect HTML files. They are safe to replace with the verified historical Case Studies source.
- No current shared homepage, About, Contact, Websites & Branding, AI Systems, Insights, navigation, footer, sitemap or V2 screenshot path is included.
- Every dependency below is directly referenced by at least one of the six approved historical HTML files.

## Exact recovery allowlist

| # | Repository path | Source blob SHA | Current state | Referenced by restored HTML | Reason required |
|---:|---|---|---|---|---|
| 1 | `case-studies/index.html` | `d692eee03b300209aae110765ea959c3af4f26d3` | conflict (`b1e35b17520aba566623be0ad12f443e337ced9f`) | Self: `case-studies/index.html` | Approved historical EN archive route; replaces Case Studies-only redirect. |
| 2 | `case-studies/financial-stream/index.html` | `b715aa4f1cb654e947a3335fcb95314709153244` | missing | Self: `case-studies/financial-stream/index.html` | Approved historical EN Financial Stream route. |
| 3 | `case-studies/proai-expert/index.html` | `9a5457d1f4a40cd592c78cc08ab3a5482fcddd65` | missing | Self: `case-studies/proai-expert/index.html` | Approved historical EN ProAI Expert route. |
| 4 | `ru/case-studies/index.html` | `5254092d3f4ad813aa563c485b27c57f838d4358` | missing | Self: `ru/case-studies/index.html` | Approved historical RU archive route. |
| 5 | `ru/case-studies/financial-stream/index.html` | `b085754d8ad9f34ab56fa52b52738b499c67fca5` | conflict (`f8d1da1ab0eca75b56eecb0cc417d68afec4ae32`) | Self: `ru/case-studies/financial-stream/index.html` | Approved historical RU Financial Stream route; replaces Case Studies-only redirect. |
| 6 | `ru/case-studies/proai-expert/index.html` | `36724cd6120f7e201d77983464276a0283d4ede1` | conflict (`f8d1da1ab0eca75b56eecb0cc417d68afec4ae32`) | Self: `ru/case-studies/proai-expert/index.html` | Approved historical RU ProAI Expert route; replaces Case Studies-only redirect. |
| 7 | `assets/brand/logo-proai-expert-dark-footer.png` | `7a4687e1ed7b312c2ef6fb1c7b56958d22fdea7e` | missing | All six restored HTML pages | Direct footer brand image dependency. |
| 8 | `assets/brand/logo-proai-expert-premium-horizontal.png` | `7a4687e1ed7b312c2ef6fb1c7b56958d22fdea7e` | missing | All six restored HTML pages | Direct header brand image dependency. |
| 9 | `assets/css/main.css` | `31babe16758728a4d9d0f3486453fc541b0432a6` | missing | All six restored HTML pages | Direct stylesheet dependency. |
| 10 | `assets/images/case-fs/fs_calendar_booking.webp` | `3097ec4326a0f4f6302f99f8bdba252eab79c5ee` | missing | EN/RU Financial Stream | Direct Financial Stream image dependency. |
| 11 | `assets/images/case-fs/fs_inquiry_email.webp` | `2df05d52823ad449dd48ed04ecbbe9374ea8d137` | missing | EN/RU Financial Stream | Direct Financial Stream image dependency. |
| 12 | `assets/images/case-fs/fs_intake_form.webp` | `7380c6a8be9d92582315b145fd1b5f88f73a24ef` | missing | EN/RU Financial Stream | Direct Financial Stream image dependency. |
| 13 | `assets/images/case-fs/fs-chatbot-en.webp` | `9fd1f6f4c4423165927eec168d2e79fb6d29ce14` | missing | EN Financial Stream | Direct Financial Stream image dependency. |
| 14 | `assets/images/case-fs/fs-chatbot-ru.webp` | `e034c0a7f2d389060d77439bca3c7c6fdf07fcbc` | missing | RU Financial Stream | Direct Financial Stream image dependency. |
| 15 | `assets/images/case-fs/fs-home-en.webp` | `d3912faa8827c62c1bfc2e9c9c222c83825e38c5` | missing | EN archive; EN Financial Stream | Direct Financial Stream image dependency. |
| 16 | `assets/images/case-fs/fs-home-mobile-en.webp` | `3326d62fd27aa4d56bdda9316992089175a79762` | missing | EN Financial Stream | Direct Financial Stream image dependency. |
| 17 | `assets/images/case-fs/fs-home-mobile-ru.webp` | `6a7964b94ea2d2d3fc31ee2cd043949f09543d05` | missing | RU Financial Stream | Direct Financial Stream image dependency. |
| 18 | `assets/images/case-fs/fs-home-ru.webp` | `e0bf40e9ceba977494e40cb44921621f970dc27e` | missing | RU archive; RU Financial Stream | Direct Financial Stream image dependency. |
| 19 | `assets/images/case-fs/fs-make-flow-clean.webp` | `dded2779bb5b03b95904d006305d293acb9f52eb` | missing | EN/RU Financial Stream | Direct Financial Stream image dependency. |
| 20 | `assets/images/case-fs/fs-services-en.webp` | `d710a028aad2fcd08230a4d238cf9e9644590f23` | missing | EN Financial Stream | Direct Financial Stream image dependency. |
| 21 | `assets/images/case-fs/fs-services-ru.webp` | `ae5f591ab6587d0815668241956550094fa09ce8` | missing | RU Financial Stream | Direct Financial Stream image dependency. |
| 22 | `assets/images/case-proai/proai-cases-en.webp` | `728147ee7e59ac638206f21353b2dd2742e57eed` | missing | EN ProAI Expert | Direct ProAI Expert image dependency. |
| 23 | `assets/images/case-proai/proai-cases-ru.webp` | `a5a9eedf41bc1d90e7111b5e51d03dd44c0f64b4` | missing | RU ProAI Expert | Direct ProAI Expert image dependency. |
| 24 | `assets/images/case-proai/proai-directions-en.webp` | `a4d7901f91a8ace4071fdbc70b1556a960b74278` | missing | EN ProAI Expert | Direct ProAI Expert image dependency. |
| 25 | `assets/images/case-proai/proai-directions-ru.webp` | `044aac239b0f79f04e41091e3fd67da1a733f3b4` | missing | RU ProAI Expert | Direct ProAI Expert image dependency. |
| 26 | `assets/images/case-proai/proai-home-en.webp` | `bbf5dbc97c20028762f365c3454de73f59b25cad` | missing | EN archive; EN ProAI Expert | Direct ProAI Expert image dependency. |
| 27 | `assets/images/case-proai/proai-home-ru.webp` | `494777442e187441b0531411041b72193aa00e7c` | missing | RU archive; RU ProAI Expert | Direct ProAI Expert image dependency. |
| 28 | `assets/images/cases-hero-neutral-left.webp` | `0414175f8064c4e00466504afdcf02bcf36d777f` | missing | EN/RU archive | Direct archive hero image dependency. |
| 29 | `assets/js/nav.js` | `77671f37fefa355a6dfe8988e5d88d9339db92b8` | missing | All six restored HTML pages | Direct navigation script dependency used by the historical pages. |

## Exclusions

- `sitemap.xml` is not in the recovery set and must not be edited.
- Alina Horb and Local Repair Pro routes are not in the verified historical baseline.
- Current `assets/img/cases/financial-stream/final-v1/`, `review-candidates-v2/` and `review-tests/` files are outside this recovery set.
- No whole historical directory, shared current page or unrelated asset is authorized for restoration.
