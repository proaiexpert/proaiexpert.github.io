# ProAI Expert - Website v2

Premium bilingual website for ProAI Expert: AI systems, automation, and premium web presence for service businesses.

## Stack

- Pure HTML, CSS, and JavaScript
- Static deployment on GitHub Pages with custom domain
- Bilingual structure: English by default, Russian under `/ru/`

## Structure

```text
/                          Homepage EN
/ru/                       Homepage RU
/ai-systems/               AI Systems EN
/ru/ai-systems/            AI Systems RU
/websites-branding/        Websites & Branding EN
/ru/websites-branding/     Websites & Branding RU
/case-studies/             Case Studies index EN
/ru/case-studies/          Case Studies index RU
/case-studies/[slug]/      Individual case study EN
/ru/case-studies/[slug]/   Individual case study RU
/about/                    About EN
/ru/about/                 About RU
/contact/                  Contact EN
/ru/contact/               Contact RU
/insights/                 Insights EN
/ru/insights/              Insights RU
/privacy/                  Privacy policy
/ru/privacy/               Privacy policy RU
/terms/                    Terms
/ru/terms/                 Terms RU
```

## Assets

```text
assets/css/       Design system, layout, components, sections
assets/js/        Navigation, contact form, motion
assets/images/    Current visual system and page visuals
assets/brand/     Brand logo assets
```

## Deployment

- Primary production domain: `https://proai-expert.com/`
- Custom domain is configured through `CNAME`
- Deploy by pushing to `main`
- GitHub Pages rebuilds automatically

## SEO

- `sitemap.xml` covers the current indexable EN and RU pages
- `robots.txt` references the sitemap
- Canonical tags point to `proai-expert.com`
- Hreflang pairs are used on bilingual page variants
- Google Search Console verification file: `google85a9034747b7c192.html`

## Contact

- `proai.expert2026@gmail.com`
