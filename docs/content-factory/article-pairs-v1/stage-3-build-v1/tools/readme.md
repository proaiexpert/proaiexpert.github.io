# Stage 3 Build and Verification Tools

These scripts provide reproducible, deterministic builds and testing for the Stage 3 article pages.

## Contents
- `build-v3.js`: Extracts content from the approved frozen git blobs, calculates word count, applies premium module wrappers, fetches current header/footer from `main` components, and outputs the HTML files. Generates JSON manifests for content integrity and metadata.
- `take-screenshots-v3.js`: Spins up a local Playwright instance to capture full-page and module-level screenshots across various viewports. Generates a duplicate-hash-checked `manifest.json`.

## Usage
```bash
npm install cheerio marked playwright
node docs/content-factory/article-pairs-v1/stage-3-build-v1/tools/build-v3.js
node docs/content-factory/article-pairs-v1/stage-3-build-v1/tools/take-screenshots-v3.js
```
