#!/usr/bin/env python3
"""Deterministic PROAI Hero R4.6 corrective static V2 postprocessor.

Inputs:
- browser-raw.png: recovered R4.6 compositor rendered at the V1 95.5% Core scale
  with source-registered foreground/back/glass planes intact.
- recovery.png: exact GitHub Actions recovered 1440x900 source frame.
- v1.png: exact V1 candidate for comparison only.

The postprocess deliberately does NOT alpha-key, isolate, rescale or reconstruct the Core.
It only removes legacy thin free-space cyan output remnants, subdues the external input,
and adds a short physically edge-gated 01-04 output/rail system ending in 04 RESULT.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


def find_inter_font() -> str:
    try:
        p = subprocess.check_output(["fc-match", "-f", "%{file}", "Inter"], text=True).strip()
        if p and Path(p).exists():
            return p
    except Exception:
        pass
    for p in (
        "/usr/share/fonts/opentype/inter/Inter-Regular.otf",
        "/usr/share/fonts/truetype/inter/Inter-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ):
        if Path(p).exists():
            return p
    raise RuntimeError("No usable Inter-compatible font found")


def load_rgb(path: Path) -> np.ndarray:
    a = np.array(Image.open(path).convert("RGB"))
    if a.shape != (900, 1440, 3):
        raise SystemExit(f"Unexpected image shape for {path}: {a.shape}")
    return a


def cyan_mask(rgb: np.ndarray, s_min=50, v_min=38) -> np.ndarray:
    hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
    return (
        (hsv[:, :, 0] >= 78)
        & (hsv[:, :, 0] <= 108)
        & (hsv[:, :, 1] >= s_min)
        & (hsv[:, :, 2] >= v_min)
    )


def add_rail_and_outputs(rgb: np.ndarray, font_path: str):
    rgba = Image.fromarray(rgb).convert("RGBA")
    rows = [400, 470, 540, 610]
    node_x = 1320
    # Preserve source-faithful collector segments inside the open aperture, then reveal only a
    # short external trace after each physical exit. Upper row exits after the projecting metal.
    exit_x = [1312, 1232, 1240, 1262]

    glow = Image.new("RGBA", (1440, 900), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow, "RGBA")
    for x0, y in zip(exit_x, rows):
        gd.line((x0, y, node_x - 3, y), fill=(94, 211, 226, 18), width=3)
        gd.ellipse((x0 - 2, y - 2, x0 + 2, y + 2), fill=(108, 222, 235, 25))
    glow = glow.filter(ImageFilter.GaussianBlur(2.1))
    rgba = Image.alpha_composite(rgba, glow)

    core = Image.new("RGBA", (1440, 900), (0, 0, 0, 0))
    cd = ImageDraw.Draw(core, "RGBA")
    for x0, y in zip(exit_x, rows):
        cd.line((x0, y, node_x - 3, y), fill=(120, 224, 237, 66), width=1)
        cd.ellipse((x0 - 1.5, y - 1.5, x0 + 1.5, y + 1.5), fill=(143, 237, 246, 84))
    rgba = Image.alpha_composite(rgba, core)

    rail = Image.new("RGBA", (1440, 900), (0, 0, 0, 0))
    rd = ImageDraw.Draw(rail, "RGBA")
    font_num = ImageFont.truetype(font_path, 15)
    font_label = ImageFont.truetype(font_path, 12)
    num_x, label_x = 1339, 1376
    labels = ["TRUST", "INQUIRY", "RESPONSE", "RESULT"]
    for idx, (y, label) in enumerate(zip(rows, labels), 1):
        rd.ellipse((node_x - 2.5, y - 2.5, node_x + 2.5, y + 2.5), fill=(118, 224, 239, 112))
        rd.line((node_x + 5, y, num_x - 8, y), fill=(112, 216, 230, 38), width=1)
        rd.text((num_x, y - 8), f"{idx:02d}", font=font_num, fill=(120, 223, 237, 194))
        rd.text((label_x, y - 7), label, font=font_label, fill=(226, 233, 235, 150))
    rgba = Image.alpha_composite(rgba, rail)
    return np.array(rgba.convert("RGB")), rows, node_x, exit_x, labels


def make_compare(recovery: np.ndarray, v1: np.ndarray, v2: np.ndarray, out: Path) -> None:
    titles = ["RECOVERED R4.6", "V1 TARGETED CORRECTION", "V2 DRAFT"]
    ims = [Image.fromarray(x) for x in (recovery, v1, v2)]
    canvas = Image.new("RGB", (1080, 1030), (10, 11, 12))
    d = ImageDraw.Draw(canvas)
    font_path = find_inter_font()
    title_font = ImageFont.truetype(font_path, 16)
    small_font = ImageFont.truetype(font_path, 12)
    for i, (im, title) in enumerate(zip(ims, titles)):
        thumb = im.resize((360, 225), Image.Resampling.LANCZOS)
        canvas.paste(thumb, (i * 360, 34))
        d.text((i * 360 + 12, 10), title, font=small_font, fill=(220, 228, 230))
    for i, im in enumerate(ims):
        crop = im.crop((700, 160, 1400, 835)).resize((350, 338), Image.Resampling.LANCZOS)
        canvas.paste(crop, (5 + i * 360, 295))
    d.text((12, 270), "CORE / MATERIAL / OUTPUT DETAIL", font=title_font, fill=(230, 236, 238))
    for i, im in enumerate(ims):
        crop = im.crop((1080, 330, 1440, 665)).resize((350, 326), Image.Resampling.LANCZOS)
        canvas.paste(crop, (5 + i * 360, 686))
    d.text((12, 655), "COLLECTOR / OUTPUT / RAIL DETAIL", font=title_font, fill=(230, 236, 238))
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out, quality=92)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("browser_raw", type=Path)
    ap.add_argument("recovery", type=Path)
    ap.add_argument("v1", type=Path)
    ap.add_argument("output", type=Path)
    ap.add_argument("--qa-json", type=Path, required=True)
    ap.add_argument("--qa-compare", type=Path, required=True)
    ap.add_argument("--qa-mask", type=Path, required=True)
    args = ap.parse_args()

    raw = load_rgb(args.browser_raw)
    recovery = load_rgb(args.recovery)
    v1 = load_rgb(args.v1)
    work = raw.copy()

    # Subdue only the old free-space incoming cyan filament; no metal alpha or geometry changes.
    hsv = cv2.cvtColor(work, cv2.COLOR_RGB2HSV)
    cm = cyan_mask(work, 52, 40)
    yy, xx = np.indices((900, 1440))
    incoming = cm & (xx >= 695) & (xx < 855) & (yy >= 515) & (yy < 620)
    v = hsv[:, :, 2].astype(np.float32)
    s = hsv[:, :, 1].astype(np.float32)
    v[incoming] *= 0.68
    s[incoming] *= 0.86
    hsv[:, :, 2] = np.clip(v, 0, 255).astype(np.uint8)
    hsv[:, :, 1] = np.clip(s, 0, 255).astype(np.uint8)
    work = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)

    # Remove legacy external curls only after their source-faithful collector segments have
    # cleared the internal glass/aperture. Upper-right metal is never touched by cleanup.
    cm = cyan_mask(work, 50, 38)
    gate = np.zeros((900, 1440), np.uint8)
    gate[435:505, 1228:1390] = 1
    gate[505:575, 1236:1390] = 1
    gate[575:645, 1258:1390] = 1
    gate[645:700, 1274:1390] = 1
    cleanup = (cm & (gate > 0)).astype(np.uint8) * 255
    cleanup = cv2.dilate(cleanup, np.ones((3, 3), np.uint8), iterations=1)
    n, labels, stats, _ = cv2.connectedComponentsWithStats((cleanup > 0).astype(np.uint8), 8)
    filtered = np.zeros_like(cleanup)
    for i in range(1, n):
        area = int(stats[i, cv2.CC_STAT_AREA])
        ww = int(stats[i, cv2.CC_STAT_WIDTH])
        hh = int(stats[i, cv2.CC_STAT_HEIGHT])
        if 2 <= area <= 1200 and (ww >= 2 or hh >= 2):
            filtered[labels == i] = 255
    cleanup = filtered
    work = cv2.cvtColor(
        cv2.inpaint(cv2.cvtColor(work, cv2.COLOR_RGB2BGR), cleanup, 2.0, cv2.INPAINT_TELEA),
        cv2.COLOR_BGR2RGB,
    )

    font_path = find_inter_font()
    work, rows, node_x, exit_x, labels_text = add_rail_and_outputs(work, font_path)

    # Hard pixel locks for all owner-locked UI/left content.
    work[:87, :, :] = recovery[:87, :, :]
    work[87:, :695, :] = recovery[87:, :695, :]

    args.output.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(work).save(args.output, optimize=True)
    Image.fromarray(cleanup).save(args.qa_mask)
    make_compare(recovery, v1, work, args.qa_compare)

    result = load_rgb(args.output)
    if not np.array_equal(result[:87], recovery[:87]):
        raise SystemExit("Header pixel lock failed")
    if not np.array_equal(result[87:, :695], recovery[87:, :695]):
        raise SystemExit("Left/copy/CTA pixel lock failed")
    if rows != [400, 470, 540, 610] or any((b - a) != 70 for a, b in zip(rows, rows[1:])):
        raise SystemExit("Rail pitch drift")
    if labels_text != ["TRUST", "INQUIRY", "RESPONSE", "RESULT"]:
        raise SystemExit("Rail wording drift")
    if exit_x[0] < 1312:
        raise SystemExit("Top output moved back onto upper-right metal")
    if not all(x < node_x for x in exit_x):
        raise SystemExit("Invalid output geometry")

    sha256 = hashlib.sha256(args.output.read_bytes()).hexdigest()
    qa = {
        "source_dimensions": [1440, 900],
        "output_dimensions": [1440, 900],
        "core_linear_scale": 0.955,
        "core_linear_scale_reduction_percent": 4.5,
        "material_method": "browser compositor registered planes; no luminance/content alpha object extraction",
        "cleanup_method": "thin colour-selective legacy-curl inpaint after preserved collector segments; upper-right metal excluded",
        "rail_rows_y": rows,
        "rail_pitch_px": 70,
        "rail_node_x": node_x,
        "output_exit_x": exit_x,
        "rail_labels": [f"{i:02d} {label}" for i, label in enumerate(labels_text, 1)],
        "header_pixel_lock": True,
        "left_copy_cta_pixel_lock": True,
        "motion_started": False,
        "sha256": sha256,
        "font": font_path,
    }
    args.qa_json.parent.mkdir(parents=True, exist_ok=True)
    args.qa_json.write_text(json.dumps(qa, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(qa, indent=2))


if __name__ == "__main__":
    main()
