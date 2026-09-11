from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

base = Path('owner-review')
W, H = 1600, 1180
bg = (7, 10, 16)
panel = (13, 17, 23)
border = (62, 70, 80)
text = (236, 239, 243)
muted = (174, 182, 192)
canvas = Image.new('RGB', (W, H), bg)
d = ImageDraw.Draw(canvas)

f32 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 32)
f24 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 24)
f18 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 18)


def box(x, y, w, h, title):
    d.rounded_rectangle((x, y, x + w, y + h), 18, fill=panel, outline=border, width=2)
    d.text((x + 22, y + 18), title, font=f24, fill=text)


def fit(img, maxw, maxh):
    r = min(maxw / img.width, maxh / img.height)
    return img.resize((max(1, int(img.width * r)), max(1, int(img.height * r))), Image.Resampling.LANCZOS)


def paste_rgba(target, img, xy):
    rgba = img.convert('RGBA')
    target.paste(rgba.convert('RGB'), xy, rgba.getchannel('A'))


high = Image.open(base / 'favicon-master-r2-2048.png').convert('RGBA')
micro = Image.open(base / 'favicon-micro-r2-64.png').convert('RGBA')
p16 = Image.open(base / 'favicon-test-r2-16.png').convert('RGBA')
p32 = Image.open(base / 'favicon-test-r2-32.png').convert('RGBA')
p180 = Image.open(base / 'favicon-test-r2-180.png').convert('RGBA')

box(24, 24, 750, 500, 'HIGH-RES MASTER — 2048×2048')
box(794, 24, 782, 500, 'MICRO MASTER — 64×64')
hi = fit(high, 650, 410)
paste_rgba(canvas, hi, (24 + (750 - hi.width) // 2, 78 + (420 - hi.height) // 2))
mi = micro.resize((320, 320), Image.Resampling.NEAREST)
paste_rgba(canvas, mi, (794 + (782 - 320) // 2, 118))

box(24, 548, 250, 250, '16×16 PREVIEW')
box(294, 548, 250, 250, '32×32 PREVIEW')
i16 = p16.resize((96, 96), Image.Resampling.NEAREST)
paste_rgba(canvas, i16, (101, 650))
i32 = p32.resize((128, 128), Image.Resampling.NEAREST)
paste_rgba(canvas, i32, (355, 632))

box(564, 548, 490, 250, 'BROWSER TAB — DARK')
d.rounded_rectangle((594, 640, 1024, 728), 18, fill=(30, 34, 40), outline=(74, 82, 92), width=2)
icon32 = p32.resize((32, 32), Image.Resampling.NEAREST)
paste_rgba(canvas, icon32, (626, 668))
d.text((678, 666), 'ProAI Expert', font=f24, fill=text)

box(1074, 548, 502, 250, 'BROWSER TAB — LIGHT')
d.rounded_rectangle((1104, 640, 1546, 728), 18, fill=(244, 246, 248), outline=(198, 203, 210), width=2)
paste_rgba(canvas, icon32, (1136, 668))
d.text((1188, 666), 'ProAI Expert', font=f24, fill=(20, 23, 27))

box(24, 824, 1552, 330, 'HIGH-RES MASTER AT 180×180')
icon180 = p180.resize((180, 180), Image.Resampling.LANCZOS)
paste_rgba(canvas, icon180, (210, 910))
d.text((440, 926), 'R2 OWNER QA', font=f32, fill=text)
d.text((440, 982), 'Source: production GLB + production header camera/lookdev runtime', font=f18, fill=muted)
d.text((440, 1018), 'No raster upscale from the old 320px static source', font=f18, fill=muted)
d.text((440, 1054), 'No deploy · no manifest · no favicon.ico · no HTML changes', font=f18, fill=muted)

canvas.save(base / 'ProAI_Favicon_R2_QA_Preview.png', quality=95)
