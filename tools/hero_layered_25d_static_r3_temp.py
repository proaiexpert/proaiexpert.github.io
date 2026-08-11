#!/usr/bin/env python3
from pathlib import Path
import hashlib
import numpy as np
import cv2
from PIL import Image

W,H=1440,900
ROOT=Path('.')
R2=ROOT/'docs/site-evolution/review-artifacts/PROAI_HERO_LAYERED_25D_STATIC_R2.png'
OUT=ROOT/'docs/site-evolution/review-artifacts/PROAI_HERO_LAYERED_25D_STATIC_R3.png'
AS=ROOT/'assets/hero-layered-25d-r1'
EXPECTED_R2='fd049642b4b27b373f441621164ef3d1e7d2adf59f07bfe6061ca7b2e2a33ea2'
BASE=np.array([6.0,8.0,11.0],np.float32)

def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def alpha(path): return np.array(Image.open(path).convert('RGBA'))[:,:,3].astype(np.float32)/255.0

def radial(xx,yy,cx,cy,sx,sy,color,amp):
    g=np.exp(-(((xx-cx)/sx)**2+((yy-cy)/sy)**2)*2.0)[...,None]
    return g*np.array(color,np.float32)*amp

if sha(R2)!=EXPECTED_R2: raise SystemExit('Exact R2 SHA mismatch')
r2=Image.open(R2).convert('RGB')
if r2.size!=(W,H): raise SystemExit('R2 dimensions drift')
src=np.array(r2).astype(np.float32); src_u8=np.array(r2)
yy,xx=np.mgrid[0:H,0:W]

rear=alpha(AS/'rear_body_graphite.png')
chamber=alpha(AS/'internal_chamber_depth.png')
front=alpha(AS/'front_metal_shell.png')
collector=alpha(AS/'collector_emitter_zone.png')
contact=alpha(AS/'contact_shadow_floor_response.png')
outputs=alpha(AS/'external_output_impulses.png')
rail=alpha(AS/'rail_ui.png')
fg_occ=alpha(AS/'foreground_occlusion_mask.png')
core=np.maximum.reduce([rear,chamber,front,collector,contact,fg_occ])
core=np.clip(core,0,1)
ui_right=np.maximum(outputs,rail)

# One global near-black body base, with only localized wide-falloff light around the Core.
field=np.zeros((H,W,3),np.float32)+BASE
field += radial(xx,yy,1045,510,430,330,[3.0,11.0,14.0],0.58)
field += radial(xx,yy,1115,735,520,205,[2.5,8.0,10.0],0.42)
field += radial(xx,yy,1090,275,360,230,[2.0,5.0,7.0],0.22)
field += radial(xx,yy,875,690,470,150,[1.7,4.2,5.0],0.18)
left_fade=np.clip((xx-545.0)/410.0,0,1)
left_fade=left_fade*left_fade*(3-2*left_fade)
field=BASE[None,None,:]+(field-BASE[None,None,:])*left_fade[...,None]

# Remove obsolete low-frequency surface color while retaining high-frequency typography/control geometry.
clipped=np.minimum(src,38.0).astype(np.float32)
bg_est=cv2.GaussianBlur(clipped,(0,0),sigmaX=58,sigmaY=58,borderType=cv2.BORDER_REFLECT)
residual=src-bg_est
mag=np.sqrt(np.sum(residual*residual,axis=2))
detail=np.clip((mag-2.0)/12.0,0,1)
detail=detail*detail*(3-2*detail)
left_zone=np.clip((720.0-xx)/150.0,0,1)
left_detail=np.clip(detail*left_zone,0,1)
low_residual=np.clip(residual,-5.0,5.0)*0.10
new=field+low_residual
new=new*(1-left_detail[...,None])+(field+residual)*left_detail[...,None]

# Registered Core and journey system stay on the same geometry over the common room field.
core_a=np.clip(core,0,1)
new=new*(1-core_a[...,None])+src*core_a[...,None]
right_a=np.clip(ui_right,0,1)
new=new*(1-right_a[...,None])+src*right_a[...,None]
new[:87]=src[:87]
final=np.clip(new,0,255).astype(np.uint8)

keep=ui_right>0.45
keep_core=core>0.97
final[keep]=src_u8[keep]
final[keep_core]=src_u8[keep_core]
final[:87]=src_u8[:87]

if not np.array_equal(final[:87],src_u8[:87]): raise SystemExit('Header drift')
if not np.array_equal(final[keep],src_u8[keep]): raise SystemExit('Rail/output pixel drift')
if not np.array_equal(final[keep_core],src_u8[keep_core]): raise SystemExit('Core interior drift')

# Seam gate: physical upper background band around the former x≈695 divide, before the C-shape reaches it.
# Registered masks intentionally do not participate here because some cover invisible support/foreground areas.
qa_band=(yy>=105)&(yy<295)
left=qa_band&(xx>=610)&(xx<680)
right=qa_band&(xx>=710)&(xx<780)
L=final.astype(np.float32)
left_med=np.median(L[left],axis=0); right_med=np.median(L[right],axis=0)
if np.max(np.abs(left_med-right_med))>4.5: raise SystemExit(f'Seam gate failed {left_med} vs {right_med}')
gray=cv2.cvtColor(final,cv2.COLOR_RGB2GRAY).astype(np.float32)
mask=qa_band[:,694]&qa_band[:,695]
jump=np.median(np.abs(gray[:,695][mask]-gray[:,694][mask]))
if jump>1.6: raise SystemExit(f'Hard boundary jump {jump}')
# Diagnostic gamma/exposure lift is QA-only and never shipped.
gamma=np.clip((final.astype(np.float32)/255.0)**0.58*255.0,0,255)
lg=np.median(gamma[left],axis=0); rg=np.median(gamma[right],axis=0)
if np.max(np.abs(lg-rg))>8.0: raise SystemExit(f'Gamma seam gate failed {lg} vs {rg}')

OUT.parent.mkdir(parents=True,exist_ok=True)
Image.fromarray(final,'RGB').save(OUT,optimize=True)
print('R3_SHA256='+sha(OUT))
print('R3_DIMENSIONS=1440x900')
print('R3_SEAM_MEDIAN_LEFT='+','.join(f'{x:.2f}' for x in left_med))
print('R3_SEAM_MEDIAN_RIGHT='+','.join(f'{x:.2f}' for x in right_med))
print('R3_BOUNDARY_JUMP='+f'{jump:.3f}')
print('MICROCOPY_SIZE_CHANGE_PX=0')
