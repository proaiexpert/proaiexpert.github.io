# ProAI Expert — Website v2

Premium bilingual website for ProAI Expert — AI automation and web studio.

## Stack

- Pure HTML / CSS / JavaScript — no framework, no build step
- GitHub Pages with custom domain via CNAME
- Bilingual: English (default) + Russian (`/ru/` prefix)

## Structure

```
/                          Homepage EN
/ru/                       Homepage RU
/ai-systems/               AI Systems & Automation EN
/ru/ai-systems/            AI Systems & Automation RU
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
/insights/                 Insights / Blog EN
/ru/insights/              Insights / Blog RU
/privacy/                  Privacy Policy
/terms/                    Terms of Use
```

## Assets

```
assets/css/       Design system: tokens, layout, components, sections
assets/js/        hero-motion.js — ambient particle + parallax animation
assets/images/    v2-* visual system (6 premium AI-generated visuals)
assets/brand/     Logo (transparent PNG)
```

## Deployment

Hosted on GitHub Pages.  
Custom domain: **proai-expert.com** (configured via `CNAME`).  
Old `proaiexpert.github.io` also resolves to the same site via CNAME — no duplicate indexing risk since canonical tags and hreflang point exclusively to `proai-expert.com`.

To deploy updates: push changes to the `main` branch.  
GitHub Pages rebuilds automatically (static files, no CI required).

## SEO

- `sitemap.xml` — covers all EN + RU indexable pages
- `robots.txt` — open crawl, references sitemap
- Canonical tags — all pages use `proai-expert.com` as the canonical domain
- Hreflang — EN/RU alternates on all bilingual page pairs
- Google Search Console — verification file: `google85a9034747b7c192.html`

## Contact

proai.expert2026@gmail.com
