# Deployment QA

Use this checklist to verify that source, remote, GitHub Pages output, cached assets, and the rendered live page agree.

## Git Checks

- `git status --short`
- `git rev-parse HEAD`
- `git rev-parse origin/main`
- `git log --oneline -5`
- Confirm the working tree is clean.
- Confirm `HEAD == origin/main`.
- Confirm the expected commit is pushed.

## Source vs Live Verification

Source files and live pages can disagree. Do not assume a pushed commit is already visible live.

Check:
- local source file
- committed source
- `origin/main`
- GitHub Pages deployed output
- cache-busted live URL
- actual browser-rendered page

## GitHub Pages Deployment Checks

- Check GitHub Pages build/deploy status if available.
- Test the live URL after deployment.
- Use cache-busted URLs when needed.
- Compare visible live behavior with source expectations.
- If source and live disagree, document the exact mismatch before changing files.

## Live Checks

- cache-busted HTML URL
- cache-busted CSS URL
- cache-busted JS URL when JavaScript changed
- HTTP status
- Last-Modified
- ETag
- X-Cache
- live content markers
- rendered browser behavior for the changed area

## Cache / CDN Caution

- Browser cache can hide successful deploys.
- GitHub Pages can lag behind `origin/main`.
- GitHub Pages/Fastly can serve stale CSS.
- CSS and JS can be stale even when HTML is fresh.
- Social preview cards can remain stale after page updates.
- Use query-string cache busting for sanity checks.
- Use hard refresh or a private window when browser cache is suspect.
- If stale CSS persists, add a unique override filename and link it after the old CSS.

## Asset and Path Checks

- CSS file path loads.
- JS file path loads.
- image paths load.
- favicon loads.
- OG/social image path loads when relevant to deployment verification.
- No 404s caused by wrong relative paths.
- Case-sensitive filenames match the deployed filesystem.

OG/social checks here are only deployment path/cache checks: verify that assets are reachable, cache-busted when needed, and not stale after deployment. This document does not define OG/social content policy; handle that in the future social-preview/OG policy migration task.

## Live Acceptance Criteria

- Expected commit is live.
- Key page loads.
- Key CSS/JS assets load.
- Primary CTA/link works.
- Mobile page is not obviously broken.
- Cache-busted live URL reflects expected changes.
- No obvious 404s for required assets.
- Rendered desktop/mobile QA passes when visual behavior changed.

## Final Deployment QA Report

- old HEAD
- new HEAD
- deployed commit
- live URL checked
- cache-busted URL checked
- assets checked
- interactions checked
- issues found
- issues fixed
- remaining risks
