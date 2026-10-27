# Local Repair Pro — production image log

## Источник

- Ветка: `review/local-repair-pro-screenshot-intake-v1`
- Проверенный commit: `d8b5782955fe463103d6eac292d072f757d985d8`
- Исходный каталог: `docs/portfolio-case-packs/local-repair-pro/screenshot-intake-v1/screenshots/`
- Использованы только шесть ранее утверждённых WebP-источников из пакета на 13 файлов.

## Решение владельца по mobile captures

- **M01/M02 removed by explicit owner decision.**
- Новые screenshots не снимались.
- Апскейл, искусственные замены, phone frames и synthetic imagery не использовались.
- Chapter 07 проверяется live viewport QA готовой portfolio page.

## Операции

Координаты указаны в пикселях оригинального источника в формате `(left, top, right, bottom)`. Все изменения ограничены crop, пропорциональным Lanczos resize и WebP-кодированием без визуальных фильтров.

| Источник | Crop | Результаты |
|---|---:|---|
| `01-homepage-hero.webp` | `(0, 186, 3597, 1743)` | `lrp-01-homepage-hero-{1920,1120,640}.webp` |
| `13-repair-value-process.webp` | `(0, 172, 3414, 1608)` | `lrp-02-photo-to-scope-{1400,960,640}.webp` |
| `03-services-list.webp` | `(0, 184, 3111, 1743)` | `lrp-03-services-list-{720,480}.webp` |
| `02-homepage-scenarios-overview.webp` | `(0, 151, 3321, 1746)` | `lrp-04-scenarios-overview-{1920,1120,640}.webp` |
| `05-service-area-map-hero.webp` | `(0, 180, 3441, 1743)` | `lrp-05-service-area-map-{1600,1120,640}.webp` |
| `10-request-form-full.webp` | upper `(0, 90, 1389, 864)` | `lrp-06-request-form-upper-{960,640}.webp` |
| `10-request-form-full.webp` | lower `(0, 788, 1389, 1718)` | `lrp-07-request-form-lower-{960,640}.webp` |
| `01-homepage-hero.webp` | neutral OG `(1500, 470, 3500, 1520)` | `lrp-case-og-1200x630.webp` |

Upper/lower form crops use a controlled overlap of 76 source pixels. Captured Local Repair headers and reserved phone details are outside the exported crops.

## Проверенные размеры

| Файл | Размер |
|---|---:|
| `lrp-01-homepage-hero-1920.webp` | 1920 × 831 |
| `lrp-01-homepage-hero-1120.webp` | 1120 × 485 |
| `lrp-01-homepage-hero-640.webp` | 640 × 277 |
| `lrp-02-photo-to-scope-1400.webp` | 1400 × 589 |
| `lrp-02-photo-to-scope-960.webp` | 960 × 404 |
| `lrp-02-photo-to-scope-640.webp` | 640 × 269 |
| `lrp-03-services-list-720.webp` | 720 × 361 |
| `lrp-03-services-list-480.webp` | 480 × 241 |
| `lrp-04-scenarios-overview-1920.webp` | 1920 × 922 |
| `lrp-04-scenarios-overview-1120.webp` | 1120 × 538 |
| `lrp-04-scenarios-overview-640.webp` | 640 × 307 |
| `lrp-05-service-area-map-1600.webp` | 1600 × 727 |
| `lrp-05-service-area-map-1120.webp` | 1120 × 509 |
| `lrp-05-service-area-map-640.webp` | 640 × 291 |
| `lrp-06-request-form-upper-960.webp` | 960 × 535 |
| `lrp-06-request-form-upper-640.webp` | 640 × 357 |
| `lrp-07-request-form-lower-960.webp` | 960 × 643 |
| `lrp-07-request-form-lower-640.webp` | 640 × 429 |
| `lrp-case-og-1200x630.webp` | 1200 × 630 |
