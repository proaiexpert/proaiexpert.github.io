# AGENTS.md

## Language
- Work only in Russian.

## Project working style
- Prefer minimal safe patches.
- Do not refactor unless explicitly requested.
- Do not touch unrelated files.
- Do not change copy, structure, layout, or styling unless explicitly requested.
- Do not start editing until exact target files are known.
- Default edit scope is 1–2 files.
- Maximum normal edit scope is 3 files.

## Website rules
- Do not run broad site audits by default.
- Do not do open-ended cleanup or "improve the whole page" tasks.
- For visual/layout/shared UI fixes, apply changes symmetrically to EN and RU counterparts when both versions exist.
- For text/copy/SEO, handle each language separately.

## Project safety
- Do not invent file names, selectors, IDs, env vars, APIs, or dependencies.
- Before changing code, read the current file.
- Keep changes scoped to the requested issue.
- If exact file scope is unknown, first identify it without editing.
- If more than 3 files appear necessary, stop and report that before editing.
- Stop after the requested change is done.

## Budget safety
- Avoid repeated search/edit loops.
- Avoid broad Agent exploration for small website fixes.
- If the first pass does not create clear progress, narrow scope instead of widening it.

## Output format
After changes, report only:
1. What changed
2. Which exact files changed
3. How to verify
4. Risks / what was intentionally not touched
5. Commit title
