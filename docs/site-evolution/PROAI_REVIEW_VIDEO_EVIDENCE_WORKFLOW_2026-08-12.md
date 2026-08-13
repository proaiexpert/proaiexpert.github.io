# PROAI EXPERT — REVIEW VIDEO EVIDENCE WORKFLOW — 2026-08-12

Status: **PERMANENT PROCESS RULE / OWNER REQUESTED**

Purpose: stop wasting Builder time on review-video capture, encoding, resolution, and GitHub binary upload problems. Review video is evidence, not the product.

## 1. PRIORITY

Builder priorities are:

1. implementation quality;
2. technical QA;
3. one useful owner-review video;
4. minimal screenshots.

Video production must never consume more time than the implementation itself unless a specific defect requires it.

## 2. DEFAULT VIDEO FORMAT

Preferred first attempt:

- 1080×1080
- H.264
- yuv420p
- 24 fps CFR
- one continuous take

1080 is a preference, not a blocker.

## 3. HARD 1080 FALLBACK RULE

Attempt 1080 only once as the normal path.

If 1080 capture, frame generation, encoding, playback validation, or upload does not complete cleanly within approximately **8–10 minutes**, or fails twice for the same technical reason:

**STOP DEBUGGING 1080 IMMEDIATELY.**

Switch directly to:

- 720×720
- H.264
- yuv420p
- 24 fps CFR

720 is an officially acceptable owner-review resolution.

Do not spend 30–60+ minutes trying to rescue 1080 evidence.

Do not ask the owner whether 720 is allowed. It is already allowed by this rule.

## 4. 720 IS NOT A FAILURE

A clean 720p review video with correct motion and readable detail is preferable to:

- a broken 1080 capture;
- a delayed task;
- a stitched/repaired video;
- hours of capture debugging.

For motion/art-direction proof, continuity and faithful runtime behavior matter more than resolution once 720 is sufficient to judge the effect.

## 5. ENCODING RULE

Use a simple single-pass review encode.

Do not use multi-pass encoding.

Do not chase tiny file-size optimizations.

Do not repeatedly re-encode visually equivalent versions.

Prefer a practical review file size and fast turnaround.

## 6. VIDEO LENGTH

Capture only the amount of runtime necessary to judge the requested behavior.

For Cube/visual iterations, the normal target remains approximately 15–30 seconds unless the task specifically requires preserving a longer full timeline.

Do not create multiple owner videos unless a separate defect genuinely requires one.

## 7. STORAGE — TEMPORARY EVIDENCE SHOULD NOT DEFAULT TO GITHUB

Review MP4 files are temporary evidence.

Preferred storage order:

### A. Google Drive — preferred temporary evidence transport

If the Builder/runtime has working Google Drive upload access, upload the final review MP4 there and provide the Drive link/file reference for owner review.

Use a predictable filename containing the phase/branch and, when available, final SHA.

GitHub should still contain:

- source code;
- REPORT/QA text;
- small permanent screenshots only when useful.

The temporary MP4 does not need to become repository history.

### B. GitHub — fallback only

If Google Drive upload is unavailable or fails quickly, GitHub is an acceptable fallback.

Do not spend extended time debugging GitHub binary upload.

If GitHub upload is used, keep only the one final review MP4 required by the task.

## 8. UPLOAD TIME BUDGET

For either Drive or GitHub:

If the preferred upload path fails repeatedly or consumes more than approximately **5–8 minutes**, switch to the fallback transport.

Do not spend an hour on evidence transport.

The Builder must report the transport used, not silently keep retrying.

## 9. SCREENSHOTS

Default visual evidence:

- one primary MP4 when motion matters;
- maximum 1–2 key PNG screenshots.

For static UI/Hero-shell tasks where motion is not being reviewed:

**no video is required** unless explicitly requested.

Use screenshots instead.

## 10. NO VIDEO REPAIR

Review evidence must represent the real implementation.

Forbidden:

- timeline splicing;
- replacement tails;
- montage;
- deleting bad frames to hide runtime defects;
- stitching separate semantic/runtime captures;
- creative ffmpeg repair.

ffmpeg may encode/resize/transcode a continuous capture only.

## 11. BUILDER STOP-LOSS LANGUAGE FOR FUTURE TASKS

Future technical assignments that require video should include language equivalent to:

> Try the preferred 1080×1080 H.264/yuv420p/24fps capture once. If 1080 does not complete cleanly within 8–10 minutes or fails twice for the same technical reason, immediately switch to 720×720. 720 is pre-approved and does not require owner confirmation. Do not spend additional time debugging 1080. If temporary review-video upload to Google Drive is available, prefer Drive; use GitHub only as a quick fallback. Do not spend more than 5–8 minutes debugging one upload transport.

## 12. PERMANENT PRINCIPLE

**Evidence must not become the bottleneck.**

A Builder should spend its time improving the implementation, not fighting screenshot/video infrastructure.

When quality of evidence is already sufficient for owner judgment, stop optimizing the evidence package and submit the work.