(() => {
  'use strict';

  const root = document.documentElement;
  const canvas = document.querySelector('[data-hero-core2-canvas]');
  const visual = document.querySelector('[data-hero-core2-visual]');
  const stageItems = [...document.querySelectorAll('[data-hero-core2-stage]')];
  const stageButtons = [...document.querySelectorAll('[data-hero-core2-stage-button]')];
  if (!canvas || !visual) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer = window.matchMedia('(pointer: coarse)');
  let motionReduced = reducedMotion.matches;
  let activeStage = motionReduced ? 3 : 0;
  let narrativeTimers = [];
  let replayTimer = null;
  let manualStageUntil = 0;

  const setActiveStage = (index, manual = false) => {
    activeStage = Math.max(0, Math.min(3, index));
    stageItems.forEach((item, i) => item.classList.toggle('is-active', i === activeStage));
    stageButtons.forEach((button, i) => button.setAttribute('aria-current', i === activeStage ? 'step' : 'false'));
    if (manual) manualStageUntil = performance.now() + 9000;
  };

  const clearNarrative = () => {
    narrativeTimers.forEach(window.clearTimeout);
    narrativeTimers = [];
    if (replayTimer) window.clearInterval(replayTimer);
    replayTimer = null;
  };

  const runNarrative = () => {
    if (motionReduced) {
      setActiveStage(3);
      return;
    }
    narrativeTimers.forEach(window.clearTimeout);
    narrativeTimers = [];
    [[800,0],[3000,1],[5350,2],[7900,3]].forEach(([delay, stage]) => {
      narrativeTimers.push(window.setTimeout(() => {
        if (performance.now() < manualStageUntil) return;
        setActiveStage(stage);
      }, delay));
    });
  };

  const scheduleNarrative = () => {
    clearNarrative();
    runNarrative();
    if (!motionReduced) {
      replayTimer = window.setInterval(() => {
        if (document.hidden || performance.now() < manualStageUntil) return;
        runNarrative();
      }, 24500);
    }
  };

  stageButtons.forEach((button, i) => {
    button.addEventListener('mouseenter', () => setActiveStage(i, true));
    button.addEventListener('focus', () => setActiveStage(i, true));
    button.addEventListener('click', () => setActiveStage(i, true));
  });

  setActiveStage(activeStage);
  scheduleNarrative();
  reducedMotion.addEventListener?.('change', (event) => {
    motionReduced = event.matches;
    scheduleNarrative();
  });

  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: 'high-performance'
  });

  if (!gl) {
    root.classList.add('hero-core2--fallback');
    return;
  }

  const vertexSource = `#version 300 es
    precision highp float;
    const vec2 POS[3] = vec2[3](vec2(-1.0,-1.0), vec2(3.0,-1.0), vec2(-1.0,3.0));
    void main(){ gl_Position = vec4(POS[gl_VertexID],0.0,1.0); }
  `;

  const fragmentSource = `#version 300 es
    precision highp float;

    uniform vec2 uResolution;
    uniform vec2 uPointer;
    uniform float uTime;
    uniform float uStage;
    uniform float uMotion;
    uniform float uQuality;
    out vec4 outColor;

    mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }

    float hash21(vec2 p){
      p=fract(p*vec2(123.34,456.21));
      p+=dot(p,p+45.32);
      return fract(p.x*p.y);
    }

    float sdRoundBox(vec3 p, vec3 b, float r){
      vec3 q=abs(p)-b+r;
      return min(max(q.x,max(q.y,q.z)),0.0)+length(max(q,0.0))-r;
    }

    float sdEllipsoid(vec3 p, vec3 r){
      float k0=length(p/r);
      float k1=length(p/(r*r));
      return k0*(k0-1.0)/max(k1,0.0001);
    }

    float sdPlane(vec3 p, vec3 n, float h){ return dot(p,n)+h; }

    float stageYaw(){
      if(uStage<0.5) return -0.13;
      if(uStage<1.5) return -0.045;
      if(uStage<2.5) return 0.065;
      return 0.14;
    }

    float stagePitch(){
      if(uStage<0.5) return 0.055;
      if(uStage<1.5) return 0.10;
      if(uStage<2.5) return 0.035;
      return -0.035;
    }

    vec3 objectSpace(vec3 p){
      p.y-=0.025;
      float driftY=uMotion*(0.050*sin(uTime*0.205)+0.020*sin(uTime*0.071+1.8));
      float driftX=uMotion*(0.024*sin(uTime*0.157+0.6));
      float yaw=-0.22+stageYaw()+driftY+uPointer.x*0.050*uMotion;
      float pitch=0.07+stagePitch()+driftX-uPointer.y*0.032*uMotion;
      p.xz=rot(-yaw)*p.xz;
      p.yz=rot(-pitch)*p.yz;
      return p;
    }

    float innerDistanceFromObject(vec3 q){
      vec3 p=q-vec3(0.075,-0.005,0.02);
      p.xy=rot(0.20+uMotion*0.030*sin(uTime*0.31))*p.xy;
      p.xz=rot(-0.20-uMotion*uTime*0.010)*p.xz;
      float a=sdEllipsoid(p,vec3(0.40,0.54,0.30));
      vec3 b=p-vec3(0.08,0.03,-0.02);
      b.yz=rot(0.42+uMotion*uTime*0.015)*b.yz;
      float c=sdRoundBox(b,vec3(0.22,0.36,0.20),0.17);
      return min(a,c+0.035);
    }

    vec2 mapScene(vec3 p){
      vec3 q=objectSpace(p);
      vec2 res=vec2(1000.0,0.0);
      float breathe=uMotion*sin(uTime*0.38)*0.012;

      // Rear diagonal spine: establishes monolithic ancestry without closing the silhouette.
      vec3 r=q-vec3(-0.08,0.01,-0.36);
      r.xy=rot(-0.31)*r.xy;
      r.xz=rot(0.10)*r.xz;
      float dr=sdRoundBox(r,vec3(0.25,0.88,0.105),0.075);
      vec3 rcut=q-vec3(-0.01,0.07,-0.29);
      rcut.xy=rot(-0.27)*rcut.xy;
      dr=max(dr,-sdEllipsoid(rcut,vec3(0.29,0.43,0.27)));
      if(dr<res.x) res=vec2(dr,1.0);

      // Left folded blade with a deep internal bite.
      vec3 a=q-vec3(-0.53+breathe*0.25,0.04,0.03);
      a.xy=rot(-0.14)*a.xy;
      a.yz=rot(-0.09)*a.yz;
      float da=sdRoundBox(a,vec3(0.235,0.77,0.39),0.14);
      vec3 ac=q-vec3(-0.28,0.10,0.20);
      ac.xy=rot(-0.11)*ac.xy;
      da=max(da,-sdEllipsoid(ac,vec3(0.29,0.49,0.35)));
      if(da<res.x) res=vec2(da,1.0);

      // Upper cantilever wing, cut and lifted away from the center.
      vec3 b=q-vec3(0.06,0.67+breathe,0.07);
      b.xy=rot(-0.24)*b.xy;
      b.xz=rot(0.10)*b.xz;
      float db=sdRoundBox(b,vec3(0.77,0.205,0.34),0.125);
      vec3 bc=q-vec3(0.30,0.52,0.24);
      bc.xy=rot(-0.18)*bc.xy;
      db=max(db,-sdEllipsoid(bc,vec3(0.39,0.22,0.30)));
      if(db<res.x) res=vec2(db,2.0);

      // Lower cradle breaks earlier and leaves a wider output channel.
      vec3 c=q-vec3(-0.01,-0.64-breathe*0.55,-0.01);
      c.xy=rot(0.18)*c.xy;
      c.xz=rot(-0.11)*c.xz;
      float dc=sdRoundBox(c,vec3(0.64,0.22,0.40),0.135);
      vec3 cc=q-vec3(0.40,-0.50,0.18);
      cc.xy=rot(0.13)*cc.xy;
      dc=max(dc,-sdEllipsoid(cc,vec3(0.34,0.23,0.31)));
      if(dc<res.x) res=vec2(dc,1.0);

      // Detached output fin: intentionally does not complete a frame.
      vec3 d=q-vec3(0.69+breathe*0.45,0.08,-0.13);
      d.xy=rot(0.20)*d.xy;
      d.yz=rot(0.25)*d.yz;
      d.xz=rot(0.18)*d.xz;
      float dd=sdRoundBox(d,vec3(0.17,0.48,0.28),0.105);
      vec3 dcut=q-vec3(0.60,0.02,0.08);
      dcut.xy=rot(0.17)*dcut.xy;
      dd=max(dd,-sdEllipsoid(dcut,vec3(0.18,0.31,0.24)));
      if(dd<res.x) res=vec2(dd,2.0);

      // Small front plate creates a second depth plane and asymmetry.
      vec3 e=q-vec3(0.32,0.18,0.43);
      e.xy=rot(-0.39)*e.xy;
      e.xz=rot(0.20)*e.xz;
      float de=sdRoundBox(e,vec3(0.29,0.115,0.07),0.055);
      if(de<res.x) res=vec2(de,2.0);

      // Smoked lens / aperture, elliptical rather than a rectangular screen.
      vec3 g=q-vec3(0.075,0.015,0.34);
      g.xy=rot(0.17)*g.xy;
      g.xz=rot(-0.09)*g.xz;
      float dg=sdEllipsoid(g,vec3(0.35,0.44,0.055));
      if(dg<res.x) res=vec2(dg,3.0);

      float di=innerDistanceFromObject(q);
      if(di<res.x) res=vec2(di,4.0);

      float floorD=sdPlane(p,vec3(0.0,1.0,0.0),1.27);
      if(floorD<res.x) res=vec2(floorD,6.0);
      return res;
    }

    vec3 calcNormal(vec3 p){
      vec2 e=vec2(0.0018,0.0);
      float d=mapScene(p).x;
      return normalize(vec3(
        mapScene(p+e.xyy).x-d,
        mapScene(p+e.yxy).x-d,
        mapScene(p+e.yyx).x-d
      ));
    }

    float softShadow(vec3 ro, vec3 rd, float mint, float maxt){
      float res=1.0, t=mint;
      for(int i=0;i<18;i++){
        float h=mapScene(ro+rd*t).x;
        res=min(res,13.0*h/t);
        t+=clamp(h,0.025,0.20);
        if(h<0.001||t>maxt) break;
      }
      return clamp(res,0.0,1.0);
    }

    float ambientOcclusion(vec3 p, vec3 n){
      float occ=0.0, sca=1.0;
      for(int i=0;i<3;i++){
        float h=0.045+0.10*float(i);
        float d=mapScene(p+n*h).x;
        occ+=(h-d)*sca;
        sca*=0.64;
      }
      return clamp(1.0-1.25*occ,0.0,1.0);
    }

    vec3 materialColor(float id, vec3 p, vec3 n, vec3 rd, float glow){
      vec3 graphite=vec3(0.068,0.082,0.090);
      vec3 steel=vec3(0.17,0.195,0.202);
      vec3 cyan=vec3(0.31,0.84,0.99);
      vec3 silver=vec3(0.74,0.80,0.82);
      vec3 warm=vec3(0.84,0.70,0.50);
      vec3 keyPos=vec3(-2.7,3.3,4.2);
      vec3 rimPos=vec3(3.3,1.8,2.6);
      vec3 l=normalize(keyPos-p);
      vec3 l2=normalize(rimPos-p);
      vec3 v=normalize(-rd);
      float ndl=max(dot(n,l),0.0);
      float ndl2=max(dot(n,l2),0.0);
      float sh=softShadow(p+n*0.009,l,0.03,5.6);
      float ao=ambientOcclusion(p,n);
      float fres=pow(1.0-max(dot(n,v),0.0),4.0);
      vec3 h=normalize(l+v);

      if(id<1.5){
        float rough=0.42+0.07*sin(p.x*7.0+p.y*4.0+p.z*5.0);
        float spec=pow(max(dot(n,h),0.0),mix(48.0,92.0,1.0-rough));
        vec3 base=graphite*(0.36+0.86*ndl*sh)*ao;
        base+=silver*spec*0.40;
        base+=cyan*fres*0.085;
        base+=warm*ndl2*fres*0.035;
        return base;
      }
      if(id<2.5){
        float spec=pow(max(dot(n,h),0.0),96.0);
        vec3 base=steel*(0.40+0.94*ndl*sh)*ao;
        base+=silver*spec*0.70;
        base+=cyan*fres*0.10;
        base+=warm*ndl2*fres*0.055;
        return base;
      }
      if(id<3.5){
        float facing=abs(dot(n,v));
        vec3 smoke=vec3(0.018,0.042,0.050);
        vec3 base=smoke*(0.36+ndl*0.24);
        base+=cyan*(0.055+fres*0.31+glow*0.16);
        base+=silver*pow(1.0-facing,3.0)*0.075;
        return base;
      }
      if(id<4.5){
        float pulse=0.78+0.10*uMotion*sin(uTime*1.18+p.y*5.4)+0.036*uStage;
        vec3 inner=mix(vec3(0.022,0.13,0.17),cyan,0.48+0.18*fres);
        inner*=pulse*(0.72+ndl*0.14);
        inner+=cyan*(0.18+fres*0.26);
        return inner;
      }
      float radial=exp(-0.72*dot(p.xz,p.xz));
      return vec3(0.008,0.010,0.011)+cyan*radial*0.004;
    }

    vec2 curveDistance(vec2 p, vec2 a, vec2 b, vec2 c, vec2 d){
      float md=10.0, mt=0.0;
      vec2 prev=a;
      for(int i=1;i<=24;i++){
        float t=float(i)/24.0, s=1.0-t;
        vec2 cur=s*s*s*a+3.0*s*s*t*b+3.0*s*t*t*c+t*t*t*d;
        vec2 pa=p-prev, ba=cur-prev;
        float h=clamp(dot(pa,ba)/max(dot(ba,ba),0.00001),0.0,1.0);
        float dd=length(pa-ba*h);
        if(dd<md){ md=dd; mt=(float(i-1)+h)/24.0; }
        prev=cur;
      }
      return vec2(md,mt);
    }

    vec4 signalField(vec2 uv, bool objectHit, float objectDepth){
      vec3 cyan=vec3(0.31,0.84,0.99), ice=vec3(0.64,0.91,0.98);
      vec3 col=vec3(0.0);
      float mask=0.0;
      vec2 c1=curveDistance(uv,vec2(-1.14,0.45),vec2(-0.56,0.76),vec2(-0.38,-0.20),vec2(1.12,-0.05));
      vec2 c2=curveDistance(uv,vec2(-1.00,-0.49),vec2(-0.42,-0.05),vec2(0.22,-0.70),vec2(1.04,-0.26));
      vec2 c3=curveDistance(uv,vec2(-0.82,0.76),vec2(-0.18,0.12),vec2(0.32,0.63),vec2(1.02,0.39));
      vec2 c4=curveDistance(uv,vec2(-0.54,-0.78),vec2(-0.05,-0.40),vec2(0.58,-0.31),vec2(0.87,0.10));

      float l1=1.0-smoothstep(0.0013,0.0085,c1.x);
      float l2=1.0-smoothstep(0.0010,0.0062,c2.x);
      float l3=1.0-smoothstep(0.0009,0.0052,c3.x);
      float l4=1.0-smoothstep(0.0008,0.0046,c4.x);
      float fragmentMix=smoothstep(0.46,0.72,c1.y);
      float dashes=smoothstep(0.20,0.52,fract(c1.y*29.0-uTime*0.052*uMotion));
      l1*=mix(dashes,1.0,fragmentMix);

      float phase=uStage*0.09;
      float p1=exp(-150.0*pow(abs(fract(c1.y-uTime*0.057*uMotion-phase)-0.5),2.0));
      float p2=exp(-135.0*pow(abs(fract(c2.y-uTime*0.045*uMotion-0.24-phase)-0.5),2.0));
      float p3=exp(-160.0*pow(abs(fract(c3.y-uTime*0.036*uMotion-0.58-phase)-0.5),2.0));
      float p4=exp(-145.0*pow(abs(fract(c4.y-uTime*0.041*uMotion-0.40-phase)-0.5),2.0));

      if(objectHit&&objectDepth<6.0){
        float behind1=step(0.34,c1.y)*(1.0-step(0.66,c1.y));
        float behind3=step(0.42,c3.y)*(1.0-step(0.73,c3.y));
        l1*=mix(1.0,0.08,behind1);
        l3*=mix(1.0,0.10,behind3);
      }

      col+=cyan*l1*(0.12+p1*0.70);
      col+=ice*l2*(0.050+p2*0.25);
      col+=cyan*l3*(0.045+p3*0.22);
      col+=ice*l4*(0.030+p4*0.16)*smoothstep(0.4,2.8,uStage);
      mask=max(max(l1,l2),max(l3,l4))*0.44+max(max(p1,p2),max(p3,p4))*0.18;

      float branch=1.0-smoothstep(0.0010,0.0052,curveDistance(uv,vec2(-0.12,0.01),vec2(0.12,0.23),vec2(0.34,0.08),vec2(0.56,0.18)).x);
      float branchOn=smoothstep(0.7,2.6,uStage);
      col+=cyan*branch*0.060*branchOn;
      mask=max(mask,branch*0.16*branchOn);

      float dust=0.0;
      vec2 cell=floor((uv+2.0)*32.0);
      float rnd=hash21(cell);
      if(rnd>0.91){
        vec2 center=(cell+vec2(hash21(cell+1.7),hash21(cell+4.2)))/32.0-2.0;
        dust=(1.0-smoothstep(0.002,0.013,length(uv-center)))*0.18;
      }
      col+=ice*dust*(0.25+0.18*uStage/3.0);
      mask=max(mask,dust*0.18);
      return vec4(col,mask);
    }

    vec3 aces(vec3 x){
      float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14;
      return clamp((x*(a*x+b))/(x*(c*x+d)+e),0.0,1.0);
    }

    void main(){
      vec2 frag=gl_FragCoord.xy;
      vec2 p=(2.0*frag-uResolution.xy)/uResolution.y;
      p.x+=0.01;

      vec3 ro=vec3(0.02+uPointer.x*0.050*uMotion,0.07+uPointer.y*0.032*uMotion,4.38);
      vec3 ta=vec3(0.035,-0.015,0.0);
      vec3 ww=normalize(ta-ro);
      vec3 uu=normalize(cross(ww,vec3(0.0,1.0,0.0)));
      vec3 vv=cross(uu,ww);
      vec3 rd=normalize(uu*p.x+vv*p.y+ww*2.30);

      vec3 bg=vec3(0.004,0.0065,0.0075);
      float halo=exp(-2.1*dot(p-vec2(0.04,-0.01),p-vec2(0.04,-0.01)));
      bg+=vec3(0.014,0.038,0.045)*halo*0.42;
      float warmEnv=exp(-6.3*dot(p-vec2(0.56,0.20),p-vec2(0.56,0.20)));
      bg+=vec3(0.034,0.022,0.012)*warmEnv*0.13;
      float grain=hash21(frag+floor(uTime*1.8*uMotion));
      bg+=(grain-0.5)*0.0022;

      float t=0.0,id=0.0,glow=0.0;
      bool hit=false;
      int maxSteps=int(mix(46.0,68.0,uQuality));
      for(int i=0;i<70;i++){
        if(i>maxSteps) break;
        vec3 pos=ro+rd*t;
        vec2 h=mapScene(pos);
        vec3 q=objectSpace(pos);
        float innerD=innerDistanceFromObject(q);
        glow+=exp(-11.0*abs(innerD))*0.0092*exp(-0.08*t);
        if(h.x<0.0017){ hit=true; id=h.y; break; }
        t+=max(h.x*0.78,0.010);
        if(t>10.0) break;
      }

      vec3 color=bg;
      float sceneAlpha=halo*0.055;
      if(hit){
        vec3 pos=ro+rd*t;
        vec3 n=calcNormal(pos);
        color=materialColor(id,pos,n,rd,glow);
        if(id>5.5){
          float contact=exp(-1.9*(pos.x*pos.x+pos.z*pos.z));
          color*=1.0-0.66*contact;
          color+=vec3(0.31,0.84,0.99)*contact*0.004;
          sceneAlpha=max(sceneAlpha,0.08+contact*0.22);
        }else{
          sceneAlpha=0.98;
        }
        float fog=1.0-exp(-0.036*t*t);
        color=mix(color,bg,fog*0.38);
      }

      color+=vec3(0.20,0.76,0.94)*min(glow,0.50)*(0.30+0.075*uStage);
      vec4 signal=signalField(p*vec2(0.93,0.93),hit&&id<5.5,t);
      color+=signal.rgb;
      sceneAlpha=max(sceneAlpha,clamp(signal.a+glow*0.25,0.0,0.56));

      float vignette=1.0-smoothstep(0.38,1.66,length(p*vec2(0.76,0.92)));
      color*=mix(0.68,1.0,vignette);
      color=aces(color*1.26);
      color=pow(color,vec3(0.95));
      sceneAlpha*=smoothstep(0.02,0.23,vignette+0.06);
      outColor=vec4(color,clamp(sceneAlpha,0.0,0.99));
    }
  `;

  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) || 'Unknown shader compile failure';
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  };

  let program;
  try {
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || 'Hero Core 2.0 program link failed');
    }
  } catch (error) {
    console.error('[Hero Core 2.0 V2]', error);
    root.classList.add('hero-core2--fallback');
    return;
  }

  gl.useProgram(program);
  const uniforms = {
    resolution: gl.getUniformLocation(program,'uResolution'),
    pointer: gl.getUniformLocation(program,'uPointer'),
    time: gl.getUniformLocation(program,'uTime'),
    stage: gl.getUniformLocation(program,'uStage'),
    motion: gl.getUniformLocation(program,'uMotion'),
    quality: gl.getUniformLocation(program,'uQuality')
  };

  let pointer={x:0,y:0};
  let pointerTarget={x:0,y:0};
  let visible=true;
  let renderScale=1;
  let quality=1;
  let firstFrame=true;
  let frameSamples=[];
  let lastFrame=performance.now();
  const mobileViewport=()=>window.innerWidth<=700;

  const resize=()=>{
    const rect=visual.getBoundingClientRect();
    const cssWidth=Math.max(1,Math.round(rect.width));
    const cssHeight=Math.max(1,Math.round(rect.height));
    const dprCap=mobileViewport()?1.12:1.50;
    const dpr=Math.min(window.devicePixelRatio||1,dprCap)*renderScale;
    const width=Math.max(2,Math.round(cssWidth*dpr));
    const height=Math.max(2,Math.round(cssHeight*dpr));
    if(canvas.width!==width||canvas.height!==height){
      canvas.width=width;
      canvas.height=height;
      gl.viewport(0,0,width,height);
    }
  };

  const resizeObserver=new ResizeObserver(resize);
  resizeObserver.observe(visual);
  window.addEventListener('resize',resize,{passive:true});
  resize();

  visual.addEventListener('pointermove',(event)=>{
    if(motionReduced||coarsePointer.matches) return;
    const rect=visual.getBoundingClientRect();
    const x=(event.clientX-rect.left)/Math.max(rect.width,1);
    const y=(event.clientY-rect.top)/Math.max(rect.height,1);
    pointerTarget.x=(Math.max(0,Math.min(1,x))-0.5)*2;
    pointerTarget.y=(0.5-Math.max(0,Math.min(1,y)))*2;
  },{passive:true});
  visual.addEventListener('pointerleave',()=>{ pointerTarget.x=0; pointerTarget.y=0; });

  const visibilityObserver=new IntersectionObserver((entries)=>{
    visible=entries.some((entry)=>entry.isIntersecting);
  },{threshold:0.02});
  visibilityObserver.observe(visual);

  const adaptPerformance=(delta)=>{
    if(firstFrame||motionReduced) return;
    frameSamples.push(delta);
    if(frameSamples.length<72) return;
    const avg=frameSamples.reduce((sum,value)=>sum+value,0)/frameSamples.length;
    frameSamples=[];
    if(avg>25&&renderScale>0.72){
      renderScale=Math.max(0.72,renderScale*0.86);
      quality=Math.max(0.60,quality-0.16);
      resize();
    }
  };

  const start=performance.now();
  const render=(now)=>{
    requestAnimationFrame(render);
    if(!visible||document.hidden) return;
    const delta=now-lastFrame;
    lastFrame=now;
    adaptPerformance(delta);
    pointer.x+=(pointerTarget.x-pointer.x)*0.035;
    pointer.y+=(pointerTarget.y-pointer.y)*0.035;
    const elapsed=motionReduced?7.8:(now-start)*0.001;
    gl.useProgram(program);
    gl.uniform2f(uniforms.resolution,canvas.width,canvas.height);
    gl.uniform2f(uniforms.pointer,pointer.x,pointer.y);
    gl.uniform1f(uniforms.time,elapsed);
    gl.uniform1f(uniforms.stage,activeStage);
    gl.uniform1f(uniforms.motion,motionReduced?0:1);
    gl.uniform1f(uniforms.quality,mobileViewport()?Math.min(quality,0.76):quality);
    gl.drawArrays(gl.TRIANGLES,0,3);
    if(firstFrame){
      firstFrame=false;
      root.classList.add('hero-core2--ready');
    }
  };

  requestAnimationFrame(render);
})();
