# AGENTS.md

## Language
- Work only in Russian.

## Project working style
- Prefer minimal safe patches.
- Do not refactor unless explicitly requested.
- Do not touch unrelated files.
- Do not change copy, structure, layout, or styling unless explicitly requested.
- For website fixes, solve one issue per pass by default.
- It is acceptable to fix 2–3 tightly related issues in one pass when this reduces extra iterations and does not significantly increase regression risk.

## Project safety
- Do not invent file names, selectors, IDs, env vars, APIs, or dependencies.
- Before changing code, read the current file.
- Keep changes scoped to the requested issue.
- Stop after the requested change is done.

## Output format
After changes, report only:
1. What changed
2. Which files changed
3. How to verify
4. Risks / what was intentionally not touched
## Commit message output
After changes, also provide:
5. Commit title

Provide commit description only if explicitly requested.