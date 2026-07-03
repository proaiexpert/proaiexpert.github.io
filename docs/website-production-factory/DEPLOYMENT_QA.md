# Deployment QA

Git checks:
- `git status --short`
- `git rev-parse HEAD`
- `git rev-parse origin/main`
- `git log --oneline -5`

Live checks:
- cache-busted HTML URL
- cache-busted CSS URL
- HTTP status
- Last-Modified
- ETag
- X-Cache
- live content markers

Cache rule:
- GitHub Pages/Fastly can serve stale CSS.
- If stale CSS persists, add a unique override filename and link it after the old CSS.

Final acceptance:
- source HEAD and remote HEAD match
- live page returns 200
- live CSS contains required fixes
- rendered desktop/mobile QA pass
