#!/usr/bin/env python3
from pathlib import Path
import hashlib
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFilter

W,H=1440,900
ROOT=Path('.')
R1=ROOT/'docs/site-evolution/review-artifacts/PROAI_HERO_LAYERED_25D_STATIC_R1.png'
OUT=ROOT/'docs/site-evolution/review-artifacts/PROAI_HERO_LAYERED_25D_STATIC_R2.png'
AS=ROOT/'assets/hero-layered-25d-r1'
EXPECTED_R1='28d1885ff2350562434e5a4bf50cbc787a7ffee5e29635780cf2ce96560ff622'

def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def alpha(path): return np.array(Image.open(path).convert('RGBA'))[:,:,3].astype(np.float32)/255.0

if sha(R1)!=EXPECTED_R1: raise SystemExit('R1 SHA drift')
r1=Image.open(R1).convert('RGB')
if r1.size!=(W,H): raise SystemExit('R1 dimensions drift')
src=np.array(r1).astype(np.float32); r1_arr=np.array(r1); yy,xx=np.mgrid[0:H,0:W]
rear=alpha(AS/'rear_body_graphite.png'); chamber=alpha(AS/'internal_chamber_depth.png')
front=alpha(AS/'front_metal_shell.png'); collector=alpha(AS/'collector_emitter_zone.png')
outputs=alpha(AS/'external_output_impulses.png'); rail=alpha(AS/'rail_ui.png')
object_mask=np.maximum.reduce([rear,chamber,front,collector]); protected=np.maximum.reduce([object_mask,outputs,rail])

# P0: one analytic atmosphere across both columns, protected by existing R1 depth/alpha layers.
left_base=np.array([3.7,4.7,5.35],np.float32); field=np.zeros((H,W,3),np.float32)+left_base
def radial(cx,cy,sx,sy,color,amp):
    g=np.exp(-(((xx-cx)/sx)**2+((yy-cy)/sy)**2)*2.0)[...,None]
    return g*np.array(color,np.float32)*amp
field+=radial(1015,500,520,390,[7,21,25],0.41)
field+=radial(1140,735,540,225,[5,14,17],0.27)
field+=radial(1160,255,410,225,[4,11,14],0.20)
field+=radial(1090,305,320,245,[6,4,2],0.045)
t=np.clip((xx-565.0)/350.0,0,1); t=t*t*(3-2*t)
target=left_base[None,None,:]*(1-t[...,None])+field*t[...,None]
amount=(np.clip((xx-575.0)/245.0,0,1)**1.18)*(1-protected)*0.96; amount[yy<87]=0
src=src*(1-amount[...,None])+target*amount[...,None]
seam=np.exp(-((xx-695.0)/15.0)**2)*(1-protected); seam[yy<87]=0
src=src*(1-seam[...,None])+target*seam[...,None]

# P0: explicit non-structural floating wedge removal.
artifact=Image.new('L',(W,H),0); ad=ImageDraw.Draw(artifact)
ad.polygon([(701,334),(731,345),(748,385),(741,410),(711,431),(698,404)],fill=255)
artifact=artifact.filter(ImageFilter.GaussianBlur(1.25)); am=np.array(artifact).astype(np.float32)/255
src=src*(1-am[...,None])+target*am[...,None]

# P1 material: graphite depth, cold/blue steel, microscopic warm environment response.
steel=np.clip(np.maximum(rear,front)-chamber*0.72,0,1); lum=src.mean(axis=2)
graded=(src-19)*1.043+19; hi=np.clip((lum-34)/122,0,1)
graded[:,:,2]+=2.4*hi; graded[:,:,1]+=1.15*hi
warm=np.exp(-(((xx-1140)/275)**2+((yy-300)/235)**2)*2)*steel
graded[:,:,0]+=1.35*warm; graded[:,:,1]+=0.45*warm
mix=steel*0.54; src=src*(1-mix[...,None])+graded*mix[...,None]

# P1 chamber: darker recess boundary + three spatial depth volumes + quiet internal reflections.
cb=(chamber>0.46).astype(np.uint8); dist=cv2.distanceTransform(cb,cv2.DIST_L2,5)
edge=(1-np.clip(dist/54,0,1))*chamber; src*=1-(edge*0.072)[...,None]
for cx,cy,sx,sy,amp in [(945,488,175,115,.045),(1045,520,165,145,.058),(1130,528,92,145,.050)]:
    g=np.exp(-(((xx-cx)/sx)**2+((yy-cy)/sy)**2)*2)*chamber*amp
    src[:,:,0]+=23*g; src[:,:,1]+=88*g; src[:,:,2]+=105*g
rr=Image.new('RGBA',(W,H),(0,0,0,0)); rd=ImageDraw.Draw(rr,'RGBA')
rd.line([(890,466),(1110,444),(1170,466)],fill=(116,221,234,20),width=1)
rd.line([(875,536),(1090,520),(1172,540)],fill=(91,203,218,18),width=1)
rd.line([(900,596),(1082,584),(1162,602)],fill=(85,188,202,13),width=1)
rr=rr.filter(ImageFilter.GaussianBlur(.7)); ra=np.array(rr).astype(np.float32); ra[:,:,3]*=chamber
base=Image.fromarray(np.clip(src,0,255).astype(np.uint8),'RGB').convert('RGBA')
src=np.array(Image.alpha_composite(base,Image.fromarray(np.clip(ra,0,255).astype(np.uint8),'RGBA')).convert('RGB')).astype(np.float32)

# P2 controlled microcopy contrast lift.
for x0,y0,x1,y1 in [(58,650,405,694),(58,713,455,740)]:
    roi=src[y0:y1,x0:x1]; l=roi.mean(axis=2); text=(l>27)&(l<160)
    roi[text]=np.minimum(roi[text]*1.27+4,190); src[y0:y1,x0:x1]=roi

final=Image.fromarray(np.clip(src,0,255).astype(np.uint8),'RGB')
ui=Image.new('RGBA',(W,H),(0,0,0,0)); ud=ImageDraw.Draw(ui,'RGBA')
ud.line((400,634,470,634),fill=(86,181,195,100),width=1)
ud.line([(1185,39),(1189,43),(1193,39)],fill=(177,187,190,118),width=1)
final=Image.alpha_composite(final.convert('RGBA'),ui).convert('RGB'); arr=np.array(final)

# Locked architecture and output/rail QA.
header_before=r1_arr[:87]; header_after=arr[:87]; check=header_after.copy(); check[36:46,1182:1196]=header_before[36:46,1182:1196]
if not np.array_equal(check,header_before): raise SystemExit('Unexpected header drift')
for y0,y1,x0,x1 in [(230,575,55,610),(590,648,55,380)]:
    if not np.array_equal(arr[y0:y1,x0:x1],r1_arr[y0:y1,x0:x1]): raise SystemExit('Locked content drift')
keep=np.maximum(outputs,rail)>0.03
if not np.array_equal(arr[keep],r1_arr[keep]): raise SystemExit('Rail/output geometry drift')
OUT.parent.mkdir(parents=True,exist_ok=True); final.save(OUT,optimize=True)
print('R2_SHA256='+sha(OUT)); print('R2_DIMENSIONS=1440x900')
