# ProAI Expert Website

A bilingual studio website for ProAI Expert, built as a clean static site with parallel English and Russian content layers.

The project brings together practical AI systems, business automation, premium websites, branding, and digital business structure for modern service businesses.

## Positioning

ProAI Expert is a studio working across:

- practical AI systems
- business automation
- premium websites
- branding
- digital business structure

The site is designed to present these directions as one coherent studio offering rather than as disconnected services.

## Website Structure

The core website includes:

- Home
- About
- AI Systems
- Websites & Branding
- Contact
- Insights
- Insight article pages

The Insights layer includes editorial hub pages plus article pages in both languages.

## Bilingual Structure

The site uses a language-specific folder structure:

- English pages live at the root (`/`)
- Russian pages live under `/ru/`
- English Insights content lives under `/insights/`
- Russian Insights content lives under `/ru/insights/`

The Russian and English versions are language-specific adaptations. They are not intended to be crude mirror translations.

## Repository Structure

Key project paths:

- `/` — English root pages
- `/ru/` — Russian root pages
- `/insights/` — English Insights hub and article pages
- `/ru/insights/` — Russian Insights hub and article pages
- `sitemap.xml` — sitemap for search engines
- `robots.txt` — crawl and sitemap directives

## Current Content Layer

The current site already includes:

- all main pages in English and Russian
- Insights hub pages in English and Russian
- the first flagship article set in both languages
  - 6 Russian articles
  - 6 English articles

## Editing Guidance

Use the existing folder structure consistently.

- Edit root pages directly inside the corresponding folder
- Edit Russian pages inside `/ru/`
- Add English articles inside `/insights/<slug>/`
- Add Russian articles inside `/ru/insights/<slug>/`

When updating content:

- keep English and Russian parity thoughtful, not literal
- avoid random renaming of folders or files
- avoid structure drift between language layers
- preserve clean version progression across release archives

## Deployment Note

This is a static website suitable for GitHub Pages or comparable static hosting.

Before deployment, verify:

- internal links
- sitemap
- robots.txt
- canonical and hreflang logic
- contact form behavior

## Versioning Note

The project uses sequential ZIP / version naming to keep releases clean and traceable.

Recommended practice:

- keep one clear version line
- avoid parallel inconsistent copies
- treat the latest approved archive as the working source

## Current Status

The site is in a structured pre-launch state with routing, shared component, mobile behavior, and head-layer cleanup already completed.

Current work already covers:

- bilingual main pages
- bilingual Insights hubs
- first bilingual flagship article set
- launch-oriented cleanup of sitemap, robots, canonical / hreflang, internal links, component consistency, and mobile behavior

## Next Steps

Likely next steps include:

- final launch checks
- performance optimization
- additional Insights articles
- ongoing SEO refinement
- visual polish and selective front-end enhancements
