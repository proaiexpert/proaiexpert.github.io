#!/usr/bin/env python3
from pathlib import Path
import argparse, hashlib, json, subprocess
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W,H=1440,900
SCALE=0.955
RIGHT_X=695
HEADER_H=87


def font_path():
    try:
        p=subprocess.check_output(['fc-match','-f','%{file}','Inter'],text=True).strip()
        if p and Path(p).exists(): return p
    except Exception: pass
    return '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'


def rgba_blank(): return Image.new('RGBA',(W,H),(0,0,0,0))

def poly_mask(points, blur=0):
    m=Image.new('L',(W,H),0); d=ImageDraw.Draw(m); d.polygon(points,fill=255)
    if blur: m=m.filter(ImageFilter.GaussianBlur(blur))
    return m

def transform_points(points,cx,cy,scale):
    return [(round(cx+(x-cx)*scale),round(cy+(y-cy)*scale)) for x,y in points]

def bezier(p0,p1,p2,n=80):
    out=[]
    for i in range(n):
        t=i/(n-1)
        x=(1-t)**2*p0[0]+2*(1-t)*t*p1[0]+t*t*p2[0]
        y=(1-t)**2*p0[1]+2*(1-t)*t*p1[1]+t*t*p2[1]
        out.append((x,y))
    return out

def composite(base, layer):
    return Image.alpha_composite(base,layer)

def save_opt(img,path):
    path.parent.mkdir(parents=True,exist_ok=True)
    img.save(path,optimize=True)

def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('input',type=Path)
    ap.add_argument('outdir',type=Path)
    args=ap.parse_args()
    outdir=args.outdir; outdir.mkdir(parents=True,exist_ok=True)
    src=Image.open(args.input).convert('RGB')
    if src.size!=(W,H): raise SystemExit(src.size)
    src_np=np.array(src)

    # Explicit registered geometry masks derived from the approved recovered C-form.
    sx0,sy0,sx1,sy1=690,145,1360,850
    cx,cy=(sx0+sx1)/2,(sy0+sy1)/2
    outer=[(710,333),(1099,181),(1122,194),(1160,220),(1298,316),(1330,347),(1330,804),(1138,839),(696,650),(696,420)]
    chamber=[(810,500),(860,417),(955,360),(1098,330),(1198,385),(1210,625),(1110,653),(970,630),(860,590),(812,550)]
    front_polys=[
        [(728,333),(1099,181),(1119,193),(1119,294),(955,365),(850,409),(774,448),(698,418)],
        [(1120,194),(1160,220),(1298,316),(1298,444),(1184,415),(1184,315),(1120,294)],
        [(922,379),(1119,326),(1184,359),(1184,415),(1110,438),(922,413)],
        [(860,575),(930,600),(1130,641),(1130,752),(1055,727),(862,664)],
        [(1115,625),(1298,684),(1298,804),(1138,839),(1115,752)],
        [(696,420),(775,448),(811,510),(812,551),(774,618),(696,650)],
    ]
    outer_s=transform_points(outer,cx,cy,SCALE)
    chamber_s=transform_points(chamber,cx,cy,SCALE)
    front_s=[transform_points(p,cx,cy,SCALE) for p in front_polys]
    outer_m=poly_mask(outer_s,1.1)
    chamber_m=poly_mask(chamber_s,0.9)
    front_m=Image.new('L',(W,H),0); fd=ImageDraw.Draw(front_m)
    for p in front_s: fd.polygon(p,fill=255)
    front_m=front_m.filter(ImageFilter.GaussianBlur(0.45))

    # Remove only legacy rail UI/free-space traces. Material isolation never uses luminance alpha.
    work=src_np.copy()
    pdraw=Image.new('L',(W,H),0); pd=ImageDraw.Draw(pdraw)
    for p in front_polys: pd.polygon(p,fill=255)
    metal_protect=np.array(pdraw)
    chamber_protect=np.array(poly_mask(chamber,0))
    cleanup=np.zeros((H,W),np.uint8)
    for box in [(1237,374,1400,415),(1237,445,1400,486),(1237,516,1400,557),(1237,585,1400,628)]:
        x0,y0,x1,y1=box
        roi=work[y0:y1,x0:x1]
        hsv=cv2.cvtColor(roi,cv2.COLOR_RGB2HSV); gray=cv2.cvtColor(roi,cv2.COLOR_RGB2GRAY)
        cyan_ui=((hsv[:,:,0]>=76)&(hsv[:,:,0]<=112)&(hsv[:,:,1]>42)&(hsv[:,:,2]>38))
        neutral=((gray>72)&(hsv[:,:,1]<58))
        local_protect=metal_protect[y0:y1,x0:x1]>0
        raw=cyan_ui | (neutral & (~local_protect))
        cleanup[y0:y1,x0:x1][raw]=255
    x0,y0,x1,y1=1170,350,1365,690
    roi=work[y0:y1,x0:x1]; hsv=cv2.cvtColor(roi,cv2.COLOR_RGB2HSV)
    raw=(hsv[:,:,0]>=76)&(hsv[:,:,0]<=112)&(hsv[:,:,1]>52)&(hsv[:,:,2]>38)
    cleanup[y0:y1,x0:x1][raw]=255
    cleanup[(metal_protect>0)|(chamber_protect>0)]=0
    tx0,ty0,tx1,ty1=1236,374,1310,416
    troi=work[ty0:ty1,tx0:tx1]; thsv=cv2.cvtColor(troi,cv2.COLOR_RGB2HSV)
    tui=((thsv[:,:,0]>=76)&(thsv[:,:,0]<=112)&(thsv[:,:,1]>45)&(thsv[:,:,2]>42))
    cleanup[ty0:ty1,tx0:tx1][tui]=255
    cleanup=cv2.dilate(cleanup,np.ones((3,3),np.uint8),iterations=1)
    cleaned=cv2.cvtColor(cv2.inpaint(cv2.cvtColor(work,cv2.COLOR_RGB2BGR),cleanup,2.1,cv2.INPAINT_TELEA),cv2.COLOR_BGR2RGB)

    # Scale approved recovered plate 4.5% using explicit scene registration.
    crop=Image.fromarray(cleaned[sy0:sy1,sx0:sx1])
    nw,nh=round((sx1-sx0)*SCALE),round((sy1-sy0)*SCALE)
    crop_s=crop.resize((nw,nh),Image.Resampling.LANCZOS)
    dx,dy=round(cx-nw/2),round(cy-nh/2)
    scaled_plate=Image.new('RGB',(W,H),(0,0,0)); scaled_plate.paste(crop_s,(dx,dy))

    yy,xx=np.mgrid[0:H,0:W]
    bg=np.zeros((H,W,4),np.uint8)
    base=np.zeros((H,W,3),np.float32); base[:]=[4.3,5.6,6.4]
    def radial(cxg,cyg,sx,sy,color,amp):
        g=np.exp(-(((xx-cxg)/sx)**2+((yy-cyg)/sy)**2)*2.0)[...,None]
        return g*np.array(color,np.float32)*amp
    base+=radial(1040,500,420,340,[10,32,37],0.48)
    base+=radial(1130,720,470,180,[8,26,29],0.35)
    base+=radial(1160,265,320,180,[7,18,22],0.28)
    base=np.clip(base,0,255).astype(np.uint8)
    bg[:,:,:3]=base; bg[:,:,3]=0; bg[HEADER_H:,RIGHT_X:,3]=255
    rear_atm=Image.fromarray(bg,'RGBA')

    obj_a=np.array(outer_m).astype(np.float32)/255
    cham_a=np.array(chamber_m).astype(np.float32)/255
    front_a=np.array(front_m).astype(np.float32)/255
    rear_a=np.clip(obj_a-np.maximum(cham_a*0.96,front_a),0,1)
    rear_a=np.maximum(rear_a,obj_a*0.16*(1-front_a))
    plate_arr=np.array(scaled_plate)
    rear_body=Image.fromarray(np.dstack([plate_arr,(rear_a*255).astype(np.uint8)]),'RGBA')

    chamber_rgb=np.clip(plate_arr.astype(np.float32)*np.array([0.92,0.97,0.99])[None,None,:],0,255).astype(np.uint8)
    chamber_depth=Image.fromarray(np.dstack([chamber_rgb,(cham_a*246).astype(np.uint8)]),'RGBA')

    plate_bgr=cv2.cvtColor(plate_arr,cv2.COLOR_RGB2BGR)
    smooth=cv2.bilateralFilter(plate_bgr,5,18,18)
    mixed=cv2.addWeighted(plate_bgr,0.86,smooth,0.14,0)
    front_rgb=cv2.cvtColor(mixed,cv2.COLOR_BGR2RGB).astype(np.float32)
    steel=(0.985+0.025*np.clip((xx-820)/520,0,1))[...,None]
    front_rgb=np.clip(front_rgb*steel,0,255).astype(np.uint8)
    front_shell=Image.fromarray(np.dstack([front_rgb,(front_a*255).astype(np.uint8)]),'RGBA')

    cyan=rgba_blank(); cd=ImageDraw.Draw(cyan,'RGBA')
    for off,alpha,width in [(0,28,18),(9,20,12),(-10,16,9)]:
        pts=bezier((825,552+off),(930,432+off*0.3),(1173,494+off*0.18),100)
        cd.line(pts,fill=(76,205,222,alpha),width=width)
    for y0,a in [(448,20),(485,26),(525,32),(566,24),(605,18)]:
        cd.line([(916,y0),(1161,y0+18)],fill=(92,214,230,a),width=2)
    for x,y in [(936,470),(958,493),(978,516),(1001,478),(1028,540),(1053,505),(1080,570),(1107,458),(1131,530),(1152,588)]:
        cd.ellipse((x-1.2,y-1.2,x+1.2,y+1.2),fill=(108,225,238,80))
    cyan=cyan.filter(ImageFilter.GaussianBlur(1.8))
    ca=np.array(cyan); ca[:,:,3]=(ca[:,:,3].astype(np.float32)*cham_a).astype(np.uint8)
    internal_cyan=Image.fromarray(ca,'RGBA')
    bloom=rgba_blank(); bd=ImageDraw.Draw(bloom,'RGBA')
    bd.ellipse((850,405,1180,660),fill=(49,171,191,18)); bd.ellipse((925,430,1195,625),fill=(60,195,213,14))
    bloom=bloom.filter(ImageFilter.GaussianBlur(34)); ba=np.array(bloom)
    ba[:,:,3]=(ba[:,:,3].astype(np.float32)*cham_a).astype(np.uint8)
    internal_cyan=composite(Image.fromarray(ba,'RGBA'),internal_cyan)

    collector=rgba_blank(); kd=ImageDraw.Draw(collector,'RGBA')
    kd.ellipse((1138,474,1204,612),fill=(56,190,211,18))
    kd.line([(1146,510),(1191,510)],fill=(105,229,240,64),width=2)
    kd.line([(1144,546),(1191,546)],fill=(105,229,240,58),width=2)
    kd.line([(1147,579),(1191,579)],fill=(105,229,240,52),width=2)
    collector=collector.filter(ImageFilter.GaussianBlur(4.0))
    ke=rgba_blank(); ked=ImageDraw.Draw(ke,'RGBA')
    for x,y in [(1188,430),(1188,487),(1188,547),(1188,604)]:
        ked.ellipse((x-2.0,y-2.0,x+2.0,y+2.0),fill=(124,231,241,175))
    collector=composite(collector,ke)

    floor=rgba_blank(); fld=ImageDraw.Draw(floor,'RGBA')
    fld.ellipse((790,748,1320,875),fill=(0,0,0,105)); fld.ellipse((865,781,1255,848),fill=(54,170,185,9)); fld.ellipse((1055,785,1260,842),fill=(197,158,111,3))
    floor=floor.filter(ImageFilter.GaussianBlur(24))

    rows=[400,470,540,610]; node_x=1300
    origins=[(1178,431),(1180,487),(1181,547),(1182,603)]
    aa=4
    out_hi=Image.new('RGBA',(W*aa,H*aa),(0,0,0,0)); od=ImageDraw.Draw(out_hi,'RGBA')
    for origin,row in zip(origins,rows):
        pts=bezier(origin,(1215,(origin[1]+row)/2),(node_x-7,row),90)
        pts_hi=[(x*aa,y*aa) for x,y in pts]
        od.line(pts_hi,fill=(88,210,226,22),width=12); od.line(pts_hi,fill=(118,225,238,92),width=4)
    outputs=out_hi.resize((W,H),Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(0.35))
    occ=front_m.convert('L')

    rail_hi=Image.new('RGBA',(W*aa,H*aa),(0,0,0,0)); rd=ImageDraw.Draw(rail_hi,'RGBA')
    fp=font_path(); fnum=ImageFont.truetype(fp,15*aa); flab=ImageFont.truetype(fp,12*aa)
    labels=['TRUST','INQUIRY','RESPONSE','RESULT']; num_x,label_x=1318,1348
    for i,(row,label) in enumerate(zip(rows,labels),1):
        rd.ellipse(((node_x-2.4)*aa,(row-2.4)*aa,(node_x+2.4)*aa,(row+2.4)*aa),fill=(113,220,235,118))
        rd.line(((node_x+4)*aa,row*aa,(num_x-8)*aa,row*aa),fill=(105,210,225,38),width=2)
        rd.text((num_x*aa,(row-8)*aa),f'{i:02d}',font=fnum,fill=(120,223,237,203))
        rd.text((label_x*aa,(row-7)*aa),label,font=flab,fill=(221,230,233,160))
    rail=rail_hi.resize((W,H),Image.Resampling.LANCZOS)

    scene=Image.fromarray(src_np).convert('RGBA')
    for layer in [rear_atm,floor,rear_body,chamber_depth,internal_cyan,collector,outputs,front_shell,rail]:
        scene=composite(scene,layer)
    result=np.array(scene.convert('RGB'))
    result[:HEADER_H,:,:]=src_np[:HEADER_H,:,:]
    result[:, :RIGHT_X, :]=src_np[:, :RIGHT_X, :]
    result[:,694:695,:]=src_np[:,694:695,:]
    final=Image.fromarray(result,'RGB')

    assetdir=outdir/'assets/hero-layered-25d-r1'; assetdir.mkdir(parents=True,exist_ok=True)
    layers={
        'rear_atmosphere.png':rear_atm,
        'rear_body_graphite.png':rear_body,
        'internal_chamber_depth.png':chamber_depth,
        'internal_cyan_volume.png':internal_cyan,
        'collector_emitter_zone.png':collector,
        'front_metal_shell.png':front_shell,
        'foreground_occlusion_mask.png':occ,
        'contact_shadow_floor_response.png':floor,
        'external_output_impulses.png':outputs,
        'rail_ui.png':rail,
    }
    for name,img in layers.items(): save_opt(img,assetdir/name)
    depth=np.zeros((H,W),np.uint8)
    oa=np.array(outer_m)>0; ca2=np.array(chamber_m)>0; fa=np.array(front_m)>0
    depth[oa]=92; depth[ca2]=142; depth[fa]=214
    Image.fromarray(depth,'L').save(assetdir/'depth_map.png',optimize=True)

    candidate=outdir/'PROAI_HERO_LAYERED_25D_STATIC_R1.png'; save_opt(final,candidate)
    res=np.array(final)
    qa={
        'source_dimensions':[W,H], 'output_dimensions':[W,H],
        'source_sha256':sha(args.input), 'candidate_sha256':sha(candidate),
        'linear_scale':SCALE, 'linear_scale_reduction_percent':round((1-SCALE)*100,3),
        'rail_rows_y':rows,'rail_pitch_px':70,'rail_node_x':node_x,
        'rail_labels':['01 TRUST','02 INQUIRY','03 RESPONSE','04 RESULT'],
        'header_pixel_lock':bool(np.array_equal(res[:HEADER_H],src_np[:HEADER_H])),
        'left_copy_cta_pixel_lock':bool(np.array_equal(res[:, :RIGHT_X],src_np[:, :RIGHT_X])),
        'production_files_touched':False,'motion_implemented':False,
        'segmentation_method':'explicit registered polygons + spatially constrained legacy-route cleanup; no luminance/content-alpha material key',
        'occlusion_method':'external impulses rendered below explicit front_metal_shell; foreground_occlusion_mask retained',
        'depth_values':{'rear_body':92,'internal_chamber':142,'front_shell':214},
        'layer_files':list(layers.keys())+['depth_map.png'],
        'font_runtime':fp,
    }
    (outdir/'qa.json').write_text(json.dumps(qa,indent=2)+'\n')
    print(json.dumps(qa,indent=2))

if __name__=='__main__': main()
