#!/usr/bin/env python3
"""Deterministic PROAI Hero R4.6 corrective static V1 generator.

Input: exact GitHub Actions recovery artifact R46_DESKTOP_STATIC.png (1440x900).
Output: one 1440x900 owner-review candidate.

The pass intentionally preserves the Header and left/copy/CTA column pixel-identically.
Only the recovered right-side visual is corrected: old rail/output cleanup, 95.5% linear
scale, graphite/material refinement, restrained internal cyan volume, contact response,
and a deterministic 01-04 output rail ending in 04 RESULT.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


def bezier_points(p0, p1, p2, n=60):
    pts = []
    for k in range(n):
        t = k / (n - 1)
        pts.append(
            (
                (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0],
                (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1],
            )
        )
    return pts


def find_inter_font() -> str:
    try:
        path = subprocess.check_output(
            ["fc-match", "-f", "%{file}", "Inter"], text=True
        ).strip()
        if path and Path(path).exists():
            return path
    except Exception:
        pass
    fallbacks = [
        "/usr/share/fonts/opentype/inter/Inter-Regular.otf",
        "/usr/share/fonts/truetype/inter/Inter-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for path in fallbacks:
        if Path(path).exists():
            return path
    raise RuntimeError("No usable Inter-compatible font found")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("input", type=Path)
    ap.add_argument("output", type=Path)
    ap.add_argument("--qa-json", type=Path, default=None)
    args = ap.parse_args()

    source = np.array(Image.open(args.input).convert("RGB"))
    h, w, channels = source.shape
    if (w, h, channels) != (1440, 900, 3):
        raise SystemExit(f"Unexpected recovery image shape: {source.shape}")

    # ------------------------------------------------------------------
    # 1) Remove the old semantic rail at glyph/node level.
    #    This avoids broad black cleanup plates and preserves underlying metal.
    # ------------------------------------------------------------------
    rail_mask = np.zeros((h, w), np.uint8)
    label_boxes = [
        (1315, 382, 1365, 402),
        (1315, 453, 1378, 473),
        (1315, 524, 1393, 544),
        (1315, 595, 1392, 615),
    ]
    for x0, y0, x1, y1 in label_boxes:
        roi = source[y0:y1, x0:x1]
        gray = cv2.cvtColor(roi, cv2.COLOR_RGB2GRAY)
        hsv = cv2.cvtColor(roi, cv2.COLOR_RGB2HSV)
        raw = ((gray > 62) & (hsv[:, :, 1] < 75)).astype(np.uint8)
        n, labels, stats, _ = cv2.connectedComponentsWithStats(raw, 8)
        keep = np.zeros_like(raw)
        for i in range(1, n):
            area = int(stats[i, cv2.CC_STAT_AREA])
            ww = int(stats[i, cv2.CC_STAT_WIDTH])
            hh = int(stats[i, cv2.CC_STAT_HEIGHT])
            if 3 <= area <= 90 and 1 <= ww <= 12 and 4 <= hh <= 13:
                keep[labels == i] = 1
        keep = cv2.dilate(keep, np.ones((3, 3), np.uint8), iterations=1)
        rail_mask[y0:y1, x0:x1] = np.maximum(
            rail_mask[y0:y1, x0:x1], keep * 255
        )

    for cy in [394, 465, 536, 606]:
        for xa, xb in [(1242, 1264), (1268, 1295)]:
            y0, y1 = cy - 13, cy + 14
            roi = source[y0:y1, xa:xb]
            hsv = cv2.cvtColor(roi, cv2.COLOR_RGB2HSV)
            raw = (
                (hsv[:, :, 0] >= 78)
                & (hsv[:, :, 0] <= 108)
                & (hsv[:, :, 1] > 50)
                & (hsv[:, :, 2] > 35)
            ).astype(np.uint8)
            raw = cv2.dilate(raw, np.ones((3, 3), np.uint8), iterations=1)
            rail_mask[y0:y1, xa:xb] = np.maximum(
                rail_mask[y0:y1, xa:xb], raw * 255
            )

    work_bgr = cv2.cvtColor(source, cv2.COLOR_RGB2BGR)
    work = cv2.cvtColor(
        cv2.inpaint(work_bgr, rail_mask, 2.5, cv2.INPAINT_TELEA),
        cv2.COLOR_BGR2RGB,
    )

    # ------------------------------------------------------------------
    # 2) Remove only legacy free-space cyan curl/terminal fragments on right.
    #    Keep the physical internal chamber and collector intact.
    # ------------------------------------------------------------------
    route_mask = np.zeros((h, w), np.uint8)
    roi = work[340:700, 1205:1360]
    hsv = cv2.cvtColor(roi, cv2.COLOR_RGB2HSV)
    raw = (
        (hsv[:, :, 0] >= 78)
        & (hsv[:, :, 0] <= 108)
        & (hsv[:, :, 1] > 55)
        & (hsv[:, :, 2] > 42)
    ).astype(np.uint8)
    n, labels, stats, _ = cv2.connectedComponentsWithStats(raw, 8)
    keep = np.zeros_like(raw)
    for i in range(1, n):
        area = int(stats[i, cv2.CC_STAT_AREA])
        ww = int(stats[i, cv2.CC_STAT_WIDTH])
        hh = int(stats[i, cv2.CC_STAT_HEIGHT])
        if area < 500 and (ww > 2 or hh > 2):
            keep[labels == i] = 1
    keep = cv2.dilate(keep, np.ones((3, 3), np.uint8), iterations=1)
    route_mask[340:700, 1205:1360] = keep * 255
    work = cv2.cvtColor(
        cv2.inpaint(
            cv2.cvtColor(work, cv2.COLOR_RGB2BGR),
            route_mask,
            2.3,
            cv2.INPAINT_TELEA,
        ),
        cv2.COLOR_BGR2RGB,
    )

    # ------------------------------------------------------------------
    # 3) Recover the exact right-side visual as one registered plate and
    #    reduce its linear scale by 4.5% without altering the Hero layout.
    # ------------------------------------------------------------------
    sx0, sy0, sx1, sy1 = 694, 150, 1360, 850
    crop = work[sy0:sy1, sx0:sx1].copy()

    # Tone down only the free-space left input filament; internal cyan remains.
    hsv = cv2.cvtColor(crop, cv2.COLOR_RGB2HSV)
    yy, xx = np.indices(crop.shape[:2])
    gx, gy = xx + sx0, yy + sy0
    cyan = (
        (hsv[:, :, 0] >= 78)
        & (hsv[:, :, 0] <= 108)
        & (hsv[:, :, 1] >= 55)
        & (hsv[:, :, 2] >= 40)
    )
    left_external = cyan & (gx < 845) & (gy > 515) & (gy < 615)
    hsv[:, :, 2][left_external] = (
        hsv[:, :, 2][left_external].astype(np.float32) * 0.58
    ).astype(np.uint8)
    hsv[:, :, 1][left_external] = (
        hsv[:, :, 1][left_external].astype(np.float32) * 0.82
    ).astype(np.uint8)
    crop = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)

    # Graphite/steel material separation with transport-black protection.
    lab = cv2.cvtColor(crop, cv2.COLOR_RGB2LAB)
    l0 = lab[:, :, 0].astype(np.float32)
    l_grade = np.clip((l0 - 128) * 1.06 + 128 - 2, 0, 255)
    weight = np.clip((l0 - 8) / 45, 0, 1)
    lab[:, :, 0] = (l0 * (1 - weight) + l_grade * weight).astype(np.uint8)
    crop = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
    hsv = cv2.cvtColor(crop, cv2.COLOR_RGB2HSV)
    internal_cyan = (
        (hsv[:, :, 0] >= 78)
        & (hsv[:, :, 0] <= 108)
        & (hsv[:, :, 1] > 45)
    )
    sat = hsv[:, :, 1].astype(np.float32)
    sat[~internal_cyan] *= 0.94
    sat[internal_cyan] *= 1.04
    hsv[:, :, 1] = np.clip(sat, 0, 255).astype(np.uint8)
    crop = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)

    scale = 0.955
    ch, cw = crop.shape[:2]
    nw, nh = round(cw * scale), round(ch * scale)
    crop_scaled = cv2.resize(crop, (nw, nh), interpolation=cv2.INTER_LANCZOS4)
    cx, cy = (sx0 + sx1) / 2, (sy0 + sy1) / 2
    dx, dy = round(cx - nw / 2), round(cy - nh / 2)

    # Rebuild only the right visual field. Header and copy side remain source pixels.
    candidate = source.copy()
    ygrid, xgrid = np.mgrid[0:h, 0:w]
    bg = np.zeros_like(source, dtype=np.float32)
    bg[:] = [4.5, 6.0, 7.0]
    atmos = [
        (1015, 505, 360, 320, np.array([11, 37, 43]), 0.45),
        (1100, 735, 420, 165, np.array([9, 27, 30]), 0.32),
        (1160, 255, 300, 160, np.array([7, 17, 19]), 0.25),
    ]
    for cxg, cyg, sx, sy, color, amp in atmos:
        g = np.exp(
            -(((xgrid - cxg) / sx) ** 2 + ((ygrid - cyg) / sy) ** 2) * 2.2
        )[..., None]
        bg += g * color * amp
    bg = np.clip(bg, 0, 255).astype(np.uint8)
    candidate[87:, 695:] = bg[87:, 695:]

    dist = np.minimum.reduce(
        [
            np.tile(np.arange(nw), (nh, 1)),
            np.tile(np.arange(nw - 1, -1, -1), (nh, 1)),
            np.tile(np.arange(nh)[:, None], (1, nw)),
            np.tile(np.arange(nh - 1, -1, -1)[:, None], (1, nw)),
        ]
    ).astype(np.float32)
    edge_alpha = np.clip(dist / 28, 0, 1)
    edge_alpha = edge_alpha * edge_alpha * (3 - 2 * edge_alpha)
    lum = (
        0.2126 * crop_scaled[:, :, 0]
        + 0.7152 * crop_scaled[:, :, 1]
        + 0.0722 * crop_scaled[:, :, 2]
    ).astype(np.float32)
    content_alpha = np.clip((lum - 4.5) / 18.0, 0, 1)
    content_alpha = content_alpha * content_alpha * (3 - 2 * content_alpha)
    hsv_scaled = cv2.cvtColor(crop_scaled, cv2.COLOR_RGB2HSV)
    cyan_keep = (
        (hsv_scaled[:, :, 0] >= 78)
        & (hsv_scaled[:, :, 0] <= 108)
        & (hsv_scaled[:, :, 1] > 45)
        & (hsv_scaled[:, :, 2] > 25)
    )
    content_alpha[cyan_keep] = np.maximum(content_alpha[cyan_keep], 0.72)
    alpha = np.minimum(edge_alpha, content_alpha)[..., None]
    target = candidate[dy : dy + nh, dx : dx + nw].astype(np.float32)
    candidate[dy : dy + nh, dx : dx + nw] = np.clip(
        target * (1 - alpha) + crop_scaled.astype(np.float32) * alpha,
        0,
        255,
    ).astype(np.uint8)

    # Pixel-lock original vertical separator.
    candidate[:, 694:695] = source[:, 694:695]
    rgba = Image.fromarray(candidate).convert("RGBA")

    # ------------------------------------------------------------------
    # 4) Internal spatial consequence derived from actual cyan structure.
    # ------------------------------------------------------------------
    current = np.array(rgba.convert("RGB"))
    inner = current[315:700, 800:1225]
    hsv_inner = cv2.cvtColor(inner, cv2.COLOR_RGB2HSV)
    cyan_mask = (
        (hsv_inner[:, :, 0] >= 78)
        & (hsv_inner[:, :, 0] <= 108)
        & (hsv_inner[:, :, 1] > 40)
        & (hsv_inner[:, :, 2] > 35)
    ).astype(np.uint8) * 255
    cyan_mask = cv2.dilate(cyan_mask, np.ones((17, 17), np.uint8), iterations=1)
    cyan_mask = cv2.GaussianBlur(cyan_mask, (0, 0), 18)
    glow = np.zeros((h, w, 4), np.uint8)
    glow[315:700, 800:1225, :3] = [76, 205, 222]
    glow[315:700, 800:1225, 3] = (
        cyan_mask.astype(np.float32) * 0.05
    ).astype(np.uint8)
    rgba = Image.alpha_composite(rgba, Image.fromarray(glow, "RGBA"))

    # Contact shadow / restrained reflection.
    floor = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    fd = ImageDraw.Draw(floor, "RGBA")
    fd.ellipse((795, 747, 1315, 872), fill=(0, 0, 0, 98))
    fd.ellipse((875, 778, 1240, 847), fill=(69, 179, 191, 10))
    fd.ellipse((1050, 784, 1260, 844), fill=(202, 156, 108, 4))
    floor = floor.filter(ImageFilter.GaussianBlur(22))
    rgba = Image.alpha_composite(rgba, floor)

    # Selected material edge notes: cold steel dominant; champagne nearly subliminal.
    spec = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sd = ImageDraw.Draw(spec, "RGBA")
    sd.line([(1027, 222), (1094, 196)], fill=(218, 238, 242, 22), width=1)
    sd.line([(1094, 196), (1135, 212)], fill=(211, 169, 120, 8), width=1)
    sd.line([(1048, 783), (1110, 807)], fill=(185, 224, 230, 9), width=1)
    spec = spec.filter(ImageFilter.GaussianBlur(0.45))
    rgba = Image.alpha_composite(rgba, spec)

    # ------------------------------------------------------------------
    # 5) Exact 01-04 output architecture: 70px vertical pitch.
    # ------------------------------------------------------------------
    rows = [400, 470, 540, 610]
    node_x = 1252
    origins = [(1182, 432), (1182, 489), (1182, 548), (1182, 604)]

    output_glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(output_glow, "RGBA")
    for origin, row in zip(origins, rows):
        pts = bezier_points(origin, (1216, (origin[1] + row) / 2), (node_x - 6, row))
        gd.line(pts, fill=(94, 215, 231, 24), width=3)
    output_glow = output_glow.filter(ImageFilter.GaussianBlur(2.2))
    rgba = Image.alpha_composite(rgba, output_glow)

    outputs = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    od = ImageDraw.Draw(outputs, "RGBA")
    for origin, row in zip(origins, rows):
        pts = bezier_points(origin, (1216, (origin[1] + row) / 2), (node_x - 6, row))
        od.line(pts, fill=(118, 224, 238, 68), width=1)
    rgba = Image.alpha_composite(rgba, outputs)

    rail = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    rd = ImageDraw.Draw(rail, "RGBA")
    font_path = find_inter_font()
    font_num = ImageFont.truetype(font_path, 15)
    font_label = ImageFont.truetype(font_path, 12)
    num_x, label_x = 1271, 1314
    labels_text = ["TRUST", "INQUIRY", "RESPONSE", "RESULT"]
    for i, (row, label) in enumerate(zip(rows, labels_text), 1):
        rd.ellipse(
            (node_x - 2.5, row - 2.5, node_x + 2.5, row + 2.5),
            fill=(118, 224, 239, 124),
        )
        rd.line((node_x + 4, row, num_x - 8, row), fill=(114, 220, 234, 46), width=1)
        rd.text((num_x, row - 8), f"{i:02d}", font=font_num, fill=(120, 223, 237, 205))
        rd.text((label_x, row - 7), label, font=font_label, fill=(226, 233, 235, 158))
    rgba = Image.alpha_composite(rgba, rail)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    rgba.convert("RGB").save(args.output, optimize=True)

    # ------------------------------------------------------------------
    # 6) Independent deterministic QA gates.
    # ------------------------------------------------------------------
    result = np.array(Image.open(args.output).convert("RGB"))
    if result.shape != (900, 1440, 3):
        raise SystemExit(f"Wrong output shape: {result.shape}")
    if not np.array_equal(result[:, :694], source[:, :694]):
        raise SystemExit("Left/copy column pixel lock failed")
    if not np.array_equal(result[:87], source[:87]):
        raise SystemExit("Header pixel lock failed")
    if not np.array_equal(result[200:760, :620], source[200:760, :620]):
        raise SystemExit("H1/copy/CTA pixel lock failed")
    if rows != [400, 470, 540, 610]:
        raise SystemExit("Rail vertical pitch drift")
    if labels_text[-1] != "RESULT":
        raise SystemExit("04 RESULT wording drift")

    sha256 = hashlib.sha256(args.output.read_bytes()).hexdigest()
    qa = {
        "source_dimensions": [1440, 900],
        "output_dimensions": [1440, 900],
        "linear_scale": scale,
        "linear_scale_reduction_percent": round((1.0 - scale) * 100, 3),
        "rail_rows_y": rows,
        "rail_pitch_px": 70,
        "rail_node_x": node_x,
        "rail_labels": ["01 TRUST", "02 INQUIRY", "03 RESPONSE", "04 RESULT"],
        "header_pixel_lock": True,
        "left_copy_cta_pixel_lock": True,
        "sha256": sha256,
        "font": font_path,
    }
    print(json.dumps(qa, indent=2))
    if args.qa_json:
        args.qa_json.parent.mkdir(parents=True, exist_ok=True)
        args.qa_json.write_text(json.dumps(qa, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
