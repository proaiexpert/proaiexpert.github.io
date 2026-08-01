# Gemini Output Protocol

**Branch:** `article-pairs-gemini-stage-v1`

## Purpose

Long Gemini reports must not be pasted through Telegram in multiple messages. Telegram truncation and agent-busy responses can produce incomplete handoffs.

## Required workflow

For every Gemini stage:

1. Read the relevant task and checkpoint files.
2. Complete the full report before writing anything to GitHub.
3. Save the entire result as one UTF-8 Markdown file under:

   `docs/content-factory/article-pairs-v1/gemini-workspace/reports/`

4. Use the exact approved filename for the stage.
5. Do not modify any file outside `gemini-workspace/reports/`.
6. Do not overwrite checkpoint, governance, article, QA, handoff, or task files.
7. Create one commit containing only the report file.
8. Do not create a pull request.
9. In Telegram, return only:
   - status;
   - report filename;
   - commit SHA;
   - direct GitHub link;
   - one-sentence summary;
   - any blocker that prevented completion.

## Current Stage 1 report

Save the complete current report as:

`docs/content-factory/article-pairs-v1/gemini-workspace/reports/stage-1-google-search-and-creative-report-v1.md`

Direct link format:

`https://github.com/proaiexpert/proaiexpert.github.io/blob/article-pairs-gemini-stage-v1/docs/content-factory/article-pairs-v1/gemini-workspace/reports/stage-1-google-search-and-creative-report-v1.md`

## Completion check

Before returning the link, verify that the file contains every required top-level section from the task, beginning with `EXECUTIVE VERDICT` and ending with `FINAL RECOMMENDATION`.

If GitHub write access is unavailable, attach one complete `.md` or `.txt` file in Telegram instead. Do not split the report into multiple Telegram messages.
