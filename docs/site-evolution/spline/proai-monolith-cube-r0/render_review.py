import math, os, subprocess, sys
import numpy as np
import cv2
from numba import njit
from PIL import Image

ROOT=os.path.dirname(__file__)
REVIEW=os.path.join(ROOT,'review')
os.makedirs(REVIEW, exist_ok=True)

# ---------- geometry ----------
def normalize(v):
    v=np.asarray(v,dtype=np.float64); n=np.linalg.norm(v)
    return v/(n+1e-12)

def rounded_box_mesh(h=2.275, radius=0.18, n=14):
    verts=[]; norms=[]; faces=[]; mats=[]
    inner=h-radius
    # six cube faces; grid points are projected onto rounded-box surface
    for axis in range(3):
        other=[i for i in range(3) if i!=axis]
        for sign in (-1,1):
            base=len(verts)
            for j in range(n+1):
                v=-h + 2*h*j/n
                for i in range(n+1):
                    u=-h + 2*h*i/n
                    p=np.zeros(3,float); p[axis]=sign*h; p[other[0]]=u; p[other[1]]=v
                    q=np.clip(p,-inner,inner)
                    d=p-q; ln=np.linalg.norm(d)
                    if ln<1e-9:
                        nn=np.zeros(3); nn[axis]=sign
                    else: nn=d/ln
                    pos=q+nn*radius
                    verts.append(pos); norms.append(nn)
            for j in range(n):
                for i in range(n):
                    a=base+j*(n+1)+i; b=a+1; c=a+(n+1); d=c+1
                    # Winding is irrelevant for our two-sided software rasterizer.
                    faces.append((a,b,d)); mats.append(0)
                    faces.append((a,d,c)); mats.append(0)
    # No visible display layer in R0; future states are intentionally deferred.
    return np.array(verts,np.float64),np.array(norms,np.float64),np.array(faces,np.int32),np.array(mats,np.int32)

V0,N0,F,M=rounded_box_mesh()

def rot_xyz(rx,ry,rz):
    cx,sx=math.cos(rx),math.sin(rx); cy,sy=math.cos(ry),math.sin(ry); cz,sz=math.cos(rz),math.sin(rz)
    Rx=np.array([[1,0,0],[0,cx,-sx],[0,sx,cx]])
    Ry=np.array([[cy,0,sy],[0,1,0],[-sy,0,cy]])
    Rz=np.array([[cz,-sz,0],[sz,cz,0],[0,0,1]])
    return Rz@Ry@Rx

def camera_basis(cam,target=(0,0,0),up=(0,1,0)):
    cam=np.array(cam,float); target=np.array(target,float); up=np.array(up,float)
    f=normalize(target-cam); r=normalize(np.cross(f,up)); u=normalize(np.cross(r,f))
    return r,u,f

@njit(cache=True)
def rasterize(width,height, tri_scr, tri_world, tri_local, tri_norm, mats, bg):
    img=bg.copy(); zbuf=np.full((height,width),1e9,np.float32)
    # lighting constants in world space
    L=np.array([-0.47,0.73,0.49],np.float64); L=L/np.sqrt((L*L).sum())
    L2=np.array([0.63,0.24,-0.74],np.float64); L2=L2/np.sqrt((L2*L2).sum())
    cam=np.array([7.35,5.35,9.15],np.float64)
    for ti in range(tri_scr.shape[0]):
        p0=tri_scr[ti,0]; p1=tri_scr[ti,1]; p2=tri_scr[ti,2]
        minx=max(0,int(math.floor(min(p0[0],p1[0],p2[0])))); maxx=min(width-1,int(math.ceil(max(p0[0],p1[0],p2[0]))))
        miny=max(0,int(math.floor(min(p0[1],p1[1],p2[1])))); maxy=min(height-1,int(math.ceil(max(p0[1],p1[1],p2[1]))))
        if minx>maxx or miny>maxy: continue
        den=(p1[1]-p2[1])*(p0[0]-p2[0])+(p2[0]-p1[0])*(p0[1]-p2[1])
        if abs(den)<1e-8: continue
        for y in range(miny,maxy+1):
            py=y+0.5
            for x in range(minx,maxx+1):
                px=x+0.5
                a=((p1[1]-p2[1])*(px-p2[0])+(p2[0]-p1[0])*(py-p2[1]))/den
                b=((p2[1]-p0[1])*(px-p2[0])+(p0[0]-p2[0])*(py-p2[1]))/den
                c=1.0-a-b
                if a < -1e-6 or b < -1e-6 or c < -1e-6: continue
                z=a*p0[2]+b*p1[2]+c*p2[2]
                if z<=0 or z>=zbuf[y,x]: continue
                zbuf[y,x]=z
                wp=a*tri_world[ti,0]+b*tri_world[ti,1]+c*tri_world[ti,2]
                lp=a*tri_local[ti,0]+b*tri_local[ti,1]+c*tri_local[ti,2]
                nn=a*tri_norm[ti,0]+b*tri_norm[ti,1]+c*tri_norm[ti,2]
                nl=math.sqrt(nn[0]*nn[0]+nn[1]*nn[1]+nn[2]*nn[2])+1e-12; nn=nn/nl
                vv=cam-wp; vl=math.sqrt(vv[0]*vv[0]+vv[1]*vv[1]+vv[2]*vv[2])+1e-12; vv=vv/vl
                ndv=max(0.0,nn[0]*vv[0]+nn[1]*vv[1]+nn[2]*vv[2])
                ndl=max(0.0,nn[0]*L[0]+nn[1]*L[1]+nn[2]*L[2])
                ndl2=max(0.0,nn[0]*L2[0]+nn[1]*L2[1]+nn[2]*L2[2])
                # reflection direction of incoming view ray
                ix=-vv[0]; iy=-vv[1]; iz=-vv[2]
                dotin=ix*nn[0]+iy*nn[1]+iz*nn[2]
                rx=ix-2*dotin*nn[0]; ry=iy-2*dotin*nn[1]; rz=iz-2*dotin*nn[2]
                # broad studio panels in reflected environment
                dkey=rx*(-0.46)+ry*0.77+rz*0.43
                band=math.exp(-((dkey-0.67)/0.30)**2)
                dsil=rx*0.64+ry*0.25+rz*(-0.73)
                band2=math.exp(-((dsil-0.58)/0.23)**2)
                dw=rx*(-0.62)+ry*(-0.18)+rz*(-0.76)
                warm=math.exp(-((dw-0.70)/0.22)**2)
                fres=(1.0-ndv)**4.2
                # Blinn specular
                hx=L[0]+vv[0]; hy=L[1]+vv[1]; hz=L[2]+vv[2]; hl=math.sqrt(hx*hx+hy*hy+hz*hz)+1e-12; hx/=hl; hy/=hl; hz/=hl
                ndh=max(0.0,nn[0]*hx+nn[1]*hy+nn[2]*hz)
                spec=ndh**58
                qx=abs(lp[0])-(1.72-0.13); qy=abs(lp[1])-(1.72-0.13)
                mx=max(qx,0.0); my=max(qy,0.0)
                rr=math.sqrt(mx*mx+my*my)+min(max(qx,qy),0.0)-0.13
                is_panel = lp[2] > 2.24 and rr < 0.0
                if is_panel:
                    base0,base1,base2=0.010,0.014,0.021
                    panel_band=math.exp(-((lp[0]*0.16+lp[1]*0.24-0.15)/0.32)**2)
                    border=math.exp(-((abs(rr)-0.020)/0.030)**2)
                    env=0.012+0.20*band+0.11*band2+0.44*spec+0.095*fres+0.175*panel_band+0.075*border
                    c0=base0*(0.84+0.12*ndl)+env*0.49+warm*0.014
                    c1=base1*(0.84+0.12*ndl)+env*0.54+warm*0.012
                    c2=base2*(0.84+0.12*ndl)+env*0.63+warm*0.010
                else:
                    base0,base1,base2=0.023,0.028,0.036
                    stripe=math.exp(-((wp[0]*0.10+wp[1]*0.18-0.18)/0.34)**2)
                    env=0.012+0.23*band+0.13*band2+0.46*spec+0.072*fres+0.050*stripe
                    shade=0.60+0.22*ndl+0.07*ndl2
                    c0=base0*shade+env*0.46+warm*0.020
                    c1=base1*shade+env*0.51+warm*0.016
                    c2=base2*shade+env*0.58+warm*0.013
                # keep blacks rich, highlights controlled
                img[y,x,0]=min(1.0,max(0.0,c0)); img[y,x,1]=min(1.0,max(0.0,c1)); img[y,x,2]=min(1.0,max(0.0,c2))
    return img,zbuf

def background(width,height):
    yy,xx=np.mgrid[0:height,0:width]
    x=xx/width; y=yy/height
    base=np.zeros((height,width,3),np.float32)
    base[:]=np.array([0.0045,0.0055,0.0075],np.float32)
    halo=np.exp(-(((x-0.51)/0.36)**2+((y-0.47)/0.40)**2)*2.0)[...,None]
    base += halo*np.array([0.015,0.018,0.024],np.float32)
    halo2=np.exp(-(((x-0.70)/0.24)**2+((y-0.30)/0.28)**2)*2.8)[...,None]
    base += halo2*np.array([0.006,0.0075,0.010],np.float32)
    # subtle diagonal light planes, intentionally very weak
    d=np.abs((x*0.82+y*0.35)-0.78)
    plane=np.exp(-(d/0.055)**2)[...,None]
    base += plane*np.array([0.0018,0.0022,0.0032],np.float32)
    return np.clip(base,0,1)

def render_frame(width,height,angles=( -0.18,0.58,0.055), cam=(5.55,4.1,6.9), yoff=0.0, high=False):
    R=rot_xyz(*angles)
    V=(V0@R.T); N=(N0@R.T); V[:,1]+=yoff+0.14
    right,up,forward=camera_basis(cam,(0,0.02,0))
    rel=V-np.array(cam)
    xc=rel@right; yc=rel@up; zc=rel@forward
    f=height/(2*math.tan(math.radians(31.5)/2))
    sx=width*0.5+f*xc/zc; sy=height*0.505-f*yc/zc
    scr=np.stack([sx,sy,zc],axis=1)
    tri_scr=scr[F]; tri_world=V[F]; tri_local=V0[F]; tri_norm=N[F]
    bg=background(width,height)
    img,z=rasterize(width,height,tri_scr,tri_world,tri_local,tri_norm,M,bg)
    # soft contact shadow / grounding in screen space
    mask=(z>=1e8).astype(np.float32)
    ov=np.zeros((height,width),np.float32)
    cx=int(width*0.505); cy=int(height*0.815)
    ax=int(width*0.235); ay=int(height*0.047)
    cv2.ellipse(ov,(cx,cy),(ax,ay),0,0,360,0.46,-1)
    ov=cv2.GaussianBlur(ov,(0,0),sigmaX=width*0.035,sigmaY=height*0.016)
    ov*=mask
    img*= (1.0-ov[...,None]*0.58)
    # very subtle floor reflection ghost from the rendered object
    obj=(z<1e8).astype(np.float32)
    # tone/gamma + vignette
    img=np.clip(img,0,1)
    img=np.clip(img*1.22,0,1)
    yy,xx=np.mgrid[0:height,0:width]; dx=(xx-width/2)/(width/2); dy=(yy-height/2)/(height/2)
    vig=np.clip(1-0.20*(dx*dx+dy*dy),0.72,1.0)
    img*=vig[...,None]
    img=np.clip(img,0,1)**(1/2.2)
    img=np.clip(img*0.62,0,1)
    # controlled soft bloom from highlights only
    hi=np.maximum(img-0.70,0)
    bloom=cv2.GaussianBlur(hi,(0,0),sigmaX=6,sigmaY=6)
    img=np.clip(img+bloom*0.11,0,1)
    return (img*255+0.5).astype(np.uint8)

# warm up JIT at tiny resolution
render_frame(120,100,(-0.12,0.16,0.035),(7.35,5.35,9.15),0)

hero=render_frame(1280,1100,(-0.12,0.16,0.035),(7.35,5.35,9.15),0)
Image.fromarray(hero).save(os.path.join(REVIEW,'01-hero-angle.png'),quality=95)
motion=render_frame(1280,1100,(-0.24,-0.08,0.070),(7.25,5.1,9.30),0.025)
Image.fromarray(motion).save(os.path.join(REVIEW,'02-motion-angle.png'),quality=95)
if '--stills-only' in sys.argv:
    print('stills generated')
    raise SystemExit(0)

# 12-second slow motion master: 48 keyframes at 4 fps -> motion-interpolated 24 fps.
frames_dir=os.path.join(REVIEW,'frames_tmp'); os.makedirs(frames_dir,exist_ok=True)
key_fps=4; seconds=12; total=key_fps*seconds
for i in range(total):
    t=i/key_fps
    rx=-0.12 + math.sin(t*0.105+0.7)*0.082 + math.sin(t*0.036)*0.020
    ry= 0.16 + math.sin(t*0.082)*0.145 + math.sin(t*0.031+1.1)*0.035
    rz= 0.035+ math.sin(t*0.073+2.2)*0.040
    yoff=math.sin(t*0.095)*0.055
    fr=render_frame(720,620,(rx,ry,rz),(7.35,5.35,9.15),yoff)
    Image.fromarray(fr).save(os.path.join(frames_dir,f'f_{i:04d}.png'))

out=os.path.join(REVIEW,'03-monolith-motion-12s.mp4')
cmd=['ffmpeg','-y','-hide_banner','-loglevel','error','-framerate',str(key_fps),'-i',os.path.join(frames_dir,'f_%04d.png'),
     '-vf','minterpolate=fps=24:mi_mode=blend,format=yuv420p',
     '-c:v','libx264','-crf','20','-preset','medium','-movflags','+faststart',out]
subprocess.run(cmd,check=True)
for fn in os.listdir(frames_dir): os.remove(os.path.join(frames_dir,fn))
os.rmdir(frames_dir)
print('generated', hero.shape, motion.shape, os.path.getsize(out))
