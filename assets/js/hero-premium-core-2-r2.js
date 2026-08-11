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
  const reviewMode = new URLSearchParams(window.location.search).get('review') || '';
  root.dataset.heroCore2Review = reviewMode;

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
    [[800,0],[3000,1],[5400,2],[7900,3]].forEach(([delay, stage]) => {
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
      }, 25000);
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
    const vec2 POS[3] = vec2[3](vec2(-1.0,-1.0),vec2(3.0,-1.0),vec2(-1.0,3.0));
    void main(){ gl_Position=vec4(POS[gl_VertexID],0.0,1.0); }
  `;

  const fragmentSource = `#version 300 es
    precision highp float;

    uniform vec2 uResolution;
    uniform vec2 uPointer;
    uniform float uTime;
    uniform float uStage;
    uniform float uMotion;
    uniform float uQuality;
    uniform float uSignalMix;
    uniform float uFxMix;
    out vec4 outColor;

    mat2 rot(float a){ float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }
    float hash21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
    float sdRoundBox(vec3 p,vec3 b,float r){ vec3 q=abs(p)-b+r; return min(max(q.x,max(q.y,q.z)),0.0)+length(max(q,0.0))-r; }
    float sdCapsule(vec3 p,vec3 a,vec3 b,float r){ vec3 pa=p-a,ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0); return length(pa-ba*h)-r; }
    float sdPlane(vec3 p,vec3 n,float h){ return dot(p,n)+h; }
    float sdSeg2(vec2 p,vec2 a,vec2 b){ vec2 pa=p-a,ba=b-a; float h=clamp(dot(pa,ba)/max(dot(ba,ba),.00001),0.0,1.0); return length(pa-ba*h); }

    float stageYaw(){ if(uStage<0.5)return -0.045; if(uStage<1.5)return 0.015; if(uStage<2.5)return 0.075; return 0.135; }
    float stagePitch(){ if(uStage<0.5)return 0.055; if(uStage<1.5)return 0.080; if(uStage<2.5)return 0.030; return -0.028; }
    float stageProgress(){ return clamp(uStage/3.0,0.0,1.0); }
    float detailMix(){ return smoothstep(0.70,0.96,uQuality); }

    vec3 objectSpace(vec3 p){
      p-=vec3(0.03,-0.015,0.0);
      float detail=detailMix();
      float yaw=-0.24+stageYaw();
      yaw+=uMotion*(0.065*sin(uTime*0.115)+0.022*sin(uTime*0.041+1.7));
      yaw+=uMotion*detail*0.012*sin(uTime*0.015+0.8);
      yaw+=uPointer.x*0.050*uMotion;
      float pitch=0.10+stagePitch()+uMotion*(0.034*sin(uTime*0.087+0.9)+0.014*sin(uTime*0.027));
      pitch-=uPointer.y*0.030*uMotion;
      float roll=uMotion*detail*(0.018*sin(uTime*0.063+2.1));
      p.xz=rot(-yaw)*p.xz;
      p.yz=rot(-pitch)*p.yz;
      p.xy=rot(-roll)*p.xy;
      return p;
    }

    vec2 mapInternal(vec3 q){
      float detail=detailMix();
      vec2 res=vec2(1000.0,0.0);

      vec3 a=q-vec3(0.07,0.00,0.105);
      a.xy=rot(0.16+uMotion*0.030*sin(uTime*0.23))*a.xy;
      a.xz=rot(-0.18-uMotion*0.018*sin(uTime*0.17+0.6))*a.xz;
      float outer=abs(sdRoundBox(a,vec3(0.315,0.410,0.220),0.135))-0.027;
      outer=max(outer,-sdRoundBox(a-vec3(0.23,0.02,0.16),vec3(0.20,0.20,0.13),0.08));
      if(outer<res.x)res=vec2(outer,4.0);

      vec3 b=q-vec3(0.035,-0.015,0.085);
      b.xy=rot(-0.10-uMotion*detail*0.020*sin(uTime*0.29+1.1))*b.xy;
      b.yz=rot(0.20+uMotion*detail*0.015*sin(uTime*0.13))*b.yz;
      float mid=abs(sdRoundBox(b,vec3(0.235,0.315,0.165),0.105))-0.022;
      mid=max(mid,-sdRoundBox(b-vec3(-0.16,-0.02,0.12),vec3(0.13,0.18,0.11),0.07));
      if(mid<res.x)res=vec2(mid,4.24);

      vec3 c=q-vec3(0.060,-0.02,0.105);
      c.xz=rot(0.21+uMotion*detail*0.024*sin(uTime*0.31+2.2))*c.xz;
      c.xy=rot(0.05-uMotion*0.018*sin(uTime*0.19))*c.xy;
      float kernel=sdRoundBox(c,vec3(0.125,0.215,0.105),0.072);
      kernel=max(kernel,-sdRoundBox(c-vec3(0.00,0.015,0.08),vec3(0.052,0.130,0.055),0.035));
      if(kernel<res.x)res=vec2(kernel,4.52);

      vec3 r=q-vec3(0.04,-0.01,0.015);
      r.xy=rot(uMotion*detail*0.022*sin(uTime*0.21))*r.xy;
      float rail1=sdCapsule(r,vec3(-0.30,-0.27,0.0),vec3(0.27,0.32,0.0),0.031);
      float rail2=sdCapsule(r,vec3(-0.24,0.31,-0.025),vec3(0.31,-0.18,0.025),0.024);
      if(min(rail1,rail2)<res.x)res=vec2(min(rail1,rail2),5.0);

      if(uQuality>0.77){
        vec3 plane=q-vec3(0.02,0.0,-0.18);
        plane.xy=rot(-0.18+uMotion*0.012*sin(uTime*0.25))*plane.xy;
        float p1=abs(sdRoundBox(plane,vec3(0.29,0.39,0.018),0.035))-0.010;
        if(p1<res.x)res=vec2(p1,5.18);
      }
      return res;
    }

    vec2 mapScene(vec3 p){
      vec3 q=objectSpace(p);
      float detail=detailMix();
      float prog=stageProgress();
      float shellMotion=uMotion*mix(0.34,1.0,detail);
      vec2 res=vec2(1000.0,0.0);

      vec3 s=q-vec3(-0.55+0.010*shellMotion*sin(uTime*.19),0.01,-0.11);
      s.xy=rot(-0.23+0.018*shellMotion*sin(uTime*.13))*s.xy; s.yz=rot(0.10)*s.yz;
      float spine=sdRoundBox(s,vec3(0.19,0.81,0.30),0.118);
      spine=max(spine,-sdRoundBox(s-vec3(0.13,0.05,0.25),vec3(0.12,0.39,0.14),0.06));
      if(spine<res.x)res=vec2(spine,1.0);

      vec3 crown=q-vec3(0.00,0.72+0.018*shellMotion*sin(uTime*.21+1.0),0.06);
      crown.xy=rot(-0.24+0.014*shellMotion*sin(uTime*.17))*crown.xy; crown.xz=rot(0.18)*crown.xz;
      float crownD=sdRoundBox(crown,vec3(0.62,0.165,0.29),0.105);
      crownD=max(crownD,-sdRoundBox(crown-vec3(0.31,-0.015,0.24),vec3(0.21,0.11,0.12),0.048));
      if(crownD<res.x)res=vec2(crownD,2.0);

      vec3 keel=q-vec3(0.16,-0.68-0.010*shellMotion*sin(uTime*.16),0.01);
      keel.xy=rot(0.17+0.012*shellMotion*sin(uTime*.11+2.0))*keel.xy; keel.xz=rot(-0.22)*keel.xz;
      float keelD=sdRoundBox(keel,vec3(0.57,0.185,0.33),0.112);
      keelD=max(keelD,-sdRoundBox(keel-vec3(-0.32,0.0,0.28),vec3(0.18,0.12,0.12),0.045));
      if(keelD<res.x)res=vec2(keelD,1.0);

      vec3 fin=q-vec3(0.68+0.075*prog,0.10+0.015*shellMotion*sin(uTime*.27),-0.14+0.025*prog);
      fin.xy=rot(0.15+0.07*prog+0.018*shellMotion*sin(uTime*.20))*fin.xy;
      fin.yz=rot(0.34+0.035*prog)*fin.yz; fin.xz=rot(0.22)*fin.xz;
      float finD=sdRoundBox(fin,vec3(0.145,0.48,0.22),0.092);
      if(finD<res.x)res=vec2(finD,2.0);

      vec3 upper=q-vec3(-0.05,0.38,0.44+0.028*shellMotion*sin(uTime*.24+0.3));
      upper.xy=rot(-0.34+0.025*shellMotion*sin(uTime*.14))*upper.xy; upper.xz=rot(0.10)*upper.xz;
      float upperD=sdRoundBox(upper,vec3(0.39,0.105,0.060),0.058);
      if(upperD<res.x)res=vec2(upperD,7.0);

      vec3 lower=q-vec3(0.27,-0.31,0.405-0.022*shellMotion*sin(uTime*.18+1.7));
      lower.xy=rot(0.13-0.018*shellMotion*sin(uTime*.15))*lower.xy; lower.xz=rot(-0.13)*lower.xz;
      float lowerD=sdRoundBox(lower,vec3(0.42,0.11,0.066),0.060);
      if(lowerD<res.x)res=vec2(lowerD,1.0);

      vec3 bridge=q-vec3(-0.21,-0.10,0.29);
      bridge.xy=rot(-0.08+0.015*shellMotion*sin(uTime*.10+1.2))*bridge.xy; bridge.yz=rot(0.20)*bridge.yz;
      float bridgeD=sdRoundBox(bridge,vec3(0.105,0.42,0.10),0.070);
      bridgeD=max(bridgeD,-sdRoundBox(bridge-vec3(0.075,0.02,0.08),vec3(0.065,0.22,0.055),0.035));
      if(bridgeD<res.x)res=vec2(bridgeD,2.0);

      vec3 sail=q-vec3(-0.18,0.16,-0.34+0.018*shellMotion*sin(uTime*.12+0.7));
      sail.xy=rot(-0.19+0.012*shellMotion*sin(uTime*.10))*sail.xy;
      sail.xz=rot(-0.17)*sail.xz;
      float sailD=sdRoundBox(sail,vec3(0.34,0.48,0.055),0.075);
      sailD=max(sailD,dot(sail.xy,normalize(vec2(0.78,0.62)))-0.30);
      sailD=max(sailD,-sdRoundBox(sail-vec3(0.17,-0.08,0.035),vec3(0.22,0.25,0.045),0.055));
      if(sailD<res.x)res=vec2(sailD,1.0);

      vec3 brand=q-vec3(0.11,0.50,0.405);
      brand.xy=rot(-0.27)*brand.xy;
      brand.xz=rot(0.11)*brand.xz;
      float brandD=sdRoundBox(brand,vec3(0.235,0.062,0.030),0.032);
      if(brandD<res.x)res=vec2(brandD,7.0);

      if(uQuality>0.74){
        vec3 rear=q-vec3(0.08,0.02,-0.50-0.025*shellMotion*sin(uTime*.12));
        rear.xy=rot(0.09+0.012*shellMotion*sin(uTime*.09))*rear.xy; rear.xz=rot(-0.10)*rear.xz;
        float rearD=sdRoundBox(rear,vec3(0.46,0.46,0.055),0.070);
        rearD=max(rearD,-sdRoundBox(rear-vec3(0.15,0.00,0.03),vec3(0.31,0.30,0.05),0.055));
        if(rearD<res.x)res=vec2(rearD,1.0);
      }

      if(uQuality>0.84){
        vec3 jaw=q-vec3(0.50,0.43,0.12+0.030*shellMotion*sin(uTime*.22+2.5));
        jaw.xy=rot(0.38+0.018*shellMotion*sin(uTime*.13))*jaw.xy; jaw.xz=rot(0.24)*jaw.xz;
        float jawD=sdRoundBox(jaw,vec3(0.22,0.095,0.17),0.060);
        if(jawD<res.x)res=vec2(jawD,2.0);
      }

      vec3 glassQ=q-vec3(0.23,0.08,0.355);
      glassQ.xy=rot(-0.16)*glassQ.xy;
      glassQ.xz=rot(0.08)*glassQ.xz;
      float glass=sdRoundBox(glassQ,vec3(0.205,0.255,0.024),0.055);
      glass=max(glass,-sdRoundBox(glassQ-vec3(-0.055,0.015,0.018),vec3(0.105,0.145,0.030),0.040));
      if(glass<res.x)res=vec2(glass,3.0);

      vec2 inner=mapInternal(q);
      if(inner.x<res.x)res=inner;

      vec3 platformP=p-vec3(0.08,-1.145,-0.08);
      float platform=sdRoundBox(platformP,vec3(0.78,0.060,0.52),0.060);
      platform=max(platform,-sdRoundBox(platformP-vec3(0.36,0.035,0.36),vec3(0.30,0.055,0.20),0.045));
      if(platform<res.x)res=vec2(platform,6.0);
      vec3 platformTop=p-vec3(0.01,-1.075,-0.02);
      float platformTopD=sdRoundBox(platformTop,vec3(0.57,0.018,0.36),0.035);
      if(platformTopD<res.x)res=vec2(platformTopD,6.18);

      float floorD=sdPlane(p,vec3(0.0,1.0,0.0),1.215);
      if(floorD<res.x)res=vec2(floorD,8.0);
      return res;
    }

    vec3 calcNormal(vec3 p){
      vec2 e=vec2(0.0017,0.0); float d=mapScene(p).x;
      return normalize(vec3(mapScene(p+e.xyy).x-d,mapScene(p+e.yxy).x-d,mapScene(p+e.yyx).x-d));
    }

    float softShadow(vec3 ro,vec3 rd,float mint,float maxt){
      float res=1.0,t=mint;
      for(int i=0;i<24;i++){
        float h=mapScene(ro+rd*t).x; res=min(res,13.0*h/t); t+=clamp(h,0.022,0.19);
        if(h<0.001||t>maxt)break;
      }
      return clamp(res,0.0,1.0);
    }

    float ambientOcclusion(vec3 p,vec3 n){
      float occ=0.0,sca=1.0;
      for(int i=0;i<4;i++){
        float h=0.04+0.085*float(i),d=mapScene(p+n*h).x; occ+=(h-d)*sca; sca*=0.66;
      }
      return clamp(1.0-1.30*occ,0.0,1.0);
    }

    float brandMark(vec3 p){
      vec3 q=objectSpace(p)-vec3(0.11,0.50,0.405);
      q.xy=rot(0.27)*q.xy;
      vec2 uv=q.xy*4.2;
      float d=10.0;
      d=min(d,sdSeg2(uv,vec2(-0.32,-0.13),vec2(-0.32,0.15)));
      d=min(d,sdSeg2(uv,vec2(-0.32,0.15),vec2(-0.14,0.15)));
      d=min(d,sdSeg2(uv,vec2(-0.14,0.15),vec2(-0.11,0.02)));
      d=min(d,sdSeg2(uv,vec2(-0.11,0.02),vec2(-0.32,0.02)));
      d=min(d,sdSeg2(uv,vec2(0.00,-0.13),vec2(0.10,0.15)));
      d=min(d,sdSeg2(uv,vec2(0.10,0.15),vec2(0.21,-0.13)));
      d=min(d,sdSeg2(uv,vec2(0.045,-0.01),vec2(0.165,-0.01)));
      d=min(d,sdSeg2(uv,vec2(0.29,-0.13),vec2(0.29,0.15)));
      return 1.0-smoothstep(0.018,0.035,d);
    }

    vec3 materialColor(float id,vec3 p,vec3 n,vec3 rd,float glow){
      vec3 graphite=vec3(0.032,0.044,0.050),steel=vec3(0.095,0.116,0.126),darkSteel=vec3(0.058,0.073,0.082);
      vec3 cyan=vec3(0.29,0.82,0.98),ice=vec3(0.63,0.76,0.81),warm=vec3(0.77,0.61,0.41);
      vec3 keyPos=vec3(-2.7,3.5,4.2),rimPos=vec3(3.7,1.6,2.5),lowPos=vec3(0.0,-2.2,2.8);
      vec3 l=normalize(keyPos-p),l2=normalize(rimPos-p),l3=normalize(lowPos-p),v=normalize(-rd),h=normalize(l+v),h2=normalize(l2+v);
      float ndl=max(dot(n,l),0.0),ndl2=max(dot(n,l2),0.0),ndl3=max(dot(n,l3),0.0);
      float shadow=softShadow(p+n*0.009,l,0.026,6.0),ao=ambientOcclusion(p,n);
      float facing=max(dot(n,v),0.0),fres=pow(1.0-facing,4.1),brush=0.5+0.5*sin((p.y+p.x*0.22)*82.0);

      if(id<1.5){
        float spec=pow(max(dot(n,h),0.0),58.0+34.0*brush);
        vec3 base=graphite*(0.38+0.98*ndl*shadow)*ao;
        base+=vec3(0.28,0.31,0.33)*spec*(0.24+0.15*brush)+cyan*fres*0.045+warm*ndl2*fres*0.017;
        return base;
      }
      if(id<2.5){
        float spec=pow(max(dot(n,h),0.0),102.0),rimSpec=pow(max(dot(n,h2),0.0),68.0);
        vec3 base=steel*(0.42+1.02*ndl*shadow)*ao;
        base+=ice*spec*0.40+vec3(0.34,0.41,0.44)*rimSpec*0.12+cyan*fres*0.060+warm*ndl2*fres*0.026;
        return base;
      }
      if(id<3.5){
        float rim=pow(1.0-facing,2.55),spec=pow(max(dot(n,h),0.0),94.0);
        return vec3(0.008,0.020,0.026)*(0.42+ndl*0.16)+cyan*(rim*0.105+glow*0.024)+ice*spec*0.060;
      }
      if(id<4.18){
        float rim=pow(1.0-facing,2.7),pulse=0.82+0.045*uMotion*sin(uTime*.90+p.y*4.0);
        return vec3(0.012,0.060,0.074)*(0.80+0.20*ndl)*pulse+cyan*(0.020+rim*0.22+glow*0.030);
      }
      if(id<4.40){
        float rim=pow(1.0-facing,3.0),spec=pow(max(dot(n,h2),0.0),80.0);
        return vec3(0.018,0.084,0.100)*(0.74+0.14*ndl)+cyan*(0.026+rim*0.25+spec*0.085+glow*0.036);
      }
      if(id<4.75){
        float wave=0.5+0.5*sin(p.x*13.0+p.y*10.0-p.z*8.0+uTime*.48*uMotion),filament=pow(wave,10.0),rim=pow(1.0-facing,2.8);
        return vec3(0.016,0.098,0.120)*(0.82+0.10*ndl)+cyan*(0.075+rim*0.28+filament*0.105+glow*0.042);
      }
      if(id<5.5){
        float spec=pow(max(dot(n,h),0.0),88.0);
        return darkSteel*(0.46+0.72*ndl*shadow)*ao+ice*spec*0.20+cyan*fres*0.052;
      }
      if(id<6.5){
        float spec=pow(max(dot(n,h),0.0),74.0),pool=exp(-2.9*(p.x*p.x+(p.z+0.05)*(p.z+0.05)));
        return vec3(0.018,0.024,0.027)*(0.62+0.58*ndl3+0.16*ndl)+vec3(0.17,0.22,0.24)*spec*0.18+cyan*pool*(0.018+0.008*uStage);
      }
      if(id<7.5){
        float spec=pow(max(dot(n,h2),0.0),96.0),mark=brandMark(p);
        vec3 base=vec3(0.052,0.067,0.075)*(0.45+0.88*ndl*shadow)*ao;
        base+=ice*spec*(0.22+mark*0.42)+cyan*fres*0.040+vec3(0.16,0.22,0.24)*mark*0.035;
        base*=1.0-mark*0.085;
        return base;
      }
      return vec3(0.004,0.006,0.007);
    }

    vec2 curveDistance(vec2 p,vec2 a,vec2 b,vec2 c,vec2 d){
      float md=10.0,mt=0.0; vec2 prev=a;
      for(int i=1;i<=34;i++){
        float t=float(i)/34.0,s=1.0-t;
        vec2 cur=s*s*s*a+3.0*s*s*t*b+3.0*s*t*t*c+t*t*t*d;
        vec2 pa=p-prev,ba=cur-prev; float h=clamp(dot(pa,ba)/max(dot(ba,ba),0.00001),0.0,1.0); float dd=length(pa-ba*h);
        if(dd<md){md=dd;mt=(float(i-1)+h)/34.0;} prev=cur;
      }
      return vec2(md,mt);
    }

    vec4 signalField(vec2 uv,bool objectHit,float objectDepth){
      vec3 cyan=vec3(0.29,0.82,0.98),ice=vec3(0.68,0.88,0.94);
      vec3 col=vec3(0.0); float alpha=0.0;
      float detail=detailMix(),prog=stageProgress();
      vec2 a=curveDistance(uv,vec2(-1.18,0.31),vec2(-0.69,0.65),vec2(-0.17,-0.27),vec2(1.08,-0.04));
      vec2 b=curveDistance(uv,vec2(-1.02,-0.50),vec2(-0.40,-0.05),vec2(0.16,-0.66),vec2(1.12,-0.23));
      vec2 c=curveDistance(uv,vec2(-0.92,0.72),vec2(-0.35,0.15),vec2(0.38,0.69),vec2(1.00,0.36));
      vec2 d=curveDistance(uv,vec2(-0.76,0.02),vec2(-0.46,0.19),vec2(-0.22,0.05),vec2(-0.03,-0.02));
      vec2 e=curveDistance(uv,vec2(0.24,-0.08),vec2(0.47,0.05),vec2(0.67,0.00),vec2(0.94,0.17));
      vec2 f=curveDistance(uv,vec2(0.18,0.45),vec2(0.38,0.34),vec2(0.62,0.44),vec2(0.82,0.58));
      float la=1.0-smoothstep(0.0012,0.0076,a.x),lb=1.0-smoothstep(0.0011,0.0061,b.x),lc=1.0-smoothstep(0.0010,0.0054,c.x);
      float ld=1.0-smoothstep(0.0010,0.0048,d.x),le=1.0-smoothstep(0.0008,0.0041,e.x),lf=1.0-smoothstep(0.0008,0.0039,f.x);
      float inDash=smoothstep(0.29,0.62,fract(a.y*31.0-uTime*0.050*uMotion));
      la*=mix(inDash,1.0,smoothstep(0.43,0.72,a.y)*(0.45+0.55*prog));
      float bDash=smoothstep(0.34,0.66,fract(b.y*23.0-uTime*0.038*uMotion+0.2));
      lb*=mix(bDash,1.0,smoothstep(0.52,0.80,b.y)*(0.35+0.65*prog));
      float phase=uStage*0.083;
      float pa=exp(-180.0*pow(abs(fract(a.y-uTime*0.055*uMotion-phase)-0.5),2.0));
      float pb=exp(-155.0*pow(abs(fract(b.y-uTime*0.044*uMotion-0.24-phase)-0.5),2.0));
      float pc=exp(-190.0*pow(abs(fract(c.y-uTime*0.035*uMotion-0.57-phase)-0.5),2.0));
      float pe=exp(-210.0*pow(abs(fract(e.y-uTime*0.048*uMotion-0.42)-0.5),2.0));
      if(objectHit&&objectDepth<6.5){
        float behindA=step(0.30,a.y)*(1.0-step(0.69,a.y));
        float behindC=step(0.37,c.y)*(1.0-step(0.74,c.y));
        la*=mix(1.0,0.06,behindA); lc*=mix(1.0,0.08,behindC);
      }
      float aS=la*(0.068+pa*0.60),bS=lb*(0.034+pb*0.20),cS=lc*(0.025+pc*0.15);
      float dS=ld*0.038*(1.0-prog*0.25),eS=le*(0.034+pe*0.26)*(0.45+0.55*prog),fS=lf*0.024*detail*(0.35+0.65*prog);
      col+=cyan*aS+ice*bS+cyan*cS+ice*dS+cyan*eS+ice*fS;
      alpha+=aS*1.55+bS*1.25+cS*1.15+dS*1.12+eS*1.35+fS;
      if(uQuality>0.84){
        vec2 cell=floor((uv+1.5)*vec2(40.0,34.0));
        float rnd=hash21(cell),rnd2=hash21(cell+17.7);
        vec2 fp=fract((uv+1.5)*vec2(40.0,34.0))-0.5;
        float dust=(1.0-smoothstep(0.018,0.065,length(fp)))*step(0.975,rnd);
        float corridor=exp(-36.0*min(min(a.x,b.x),c.x));
        float ds=dust*corridor*(0.55+0.45*sin(uTime*0.40+rnd2*6.283))*(0.010+0.012*prog);
        col+=ice*ds; alpha+=ds*1.5;
      }
      return vec4(col,clamp(alpha,0.0,0.58));
    }

    vec3 aces(vec3 x){ float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14; return clamp((x*(a*x+b))/(x*(c*x+d)+e),0.0,1.0); }

    void main(){
      vec2 frag=gl_FragCoord.xy;
      vec2 p=(2.0*frag-uResolution.xy)/uResolution.y;
      p.x+=0.015;
      vec3 ro=vec3(0.02+uPointer.x*0.045*uMotion,0.06+uPointer.y*0.028*uMotion,4.02);
      vec3 ta=vec3(0.055,-0.02,0.0);
      vec3 ww=normalize(ta-ro),uu=normalize(cross(ww,vec3(0.0,1.0,0.0))),vv=cross(uu,ww);
      float focal=mix(2.82,2.42,detailMix());
      vec3 rd=normalize(uu*p.x+vv*p.y+ww*focal);
      float t=0.0,id=0.0,glow=0.0; bool hit=false;
      int maxSteps=int(mix(46.0,74.0,uQuality));
      for(int i=0;i<76;i++){
        if(i>maxSteps)break;
        vec3 pos=ro+rd*t;
        vec2 h=mapScene(pos);
        vec2 inner=mapInternal(objectSpace(pos));
        glow+=exp(-12.5*abs(inner.x))*0.0068*exp(-0.075*t);
        if(h.x<0.0017){hit=true;id=h.y;break;}
        t+=max(h.x*0.77,0.0092);
        if(t>9.3)break;
      }
      vec3 color=vec3(0.0); float alpha=0.0;
      if(hit){
        vec3 pos=ro+rd*t;
        if(id<7.6){
          vec3 n=calcNormal(pos); color=materialColor(id,pos,n,rd,glow);
          float fog=1.0-exp(-0.028*t*t); color*=1.0-fog*0.16; alpha=1.0;
        }else{
          float shadow=exp(-1.50*(pos.x*pos.x+(pos.z+0.04)*(pos.z+0.04)));
          float light=exp(-3.4*(pos.x*pos.x+(pos.z+0.02)*(pos.z+0.02)));
          color=vec3(0.0015,0.003,0.004)+vec3(0.16,0.46,0.54)*light*0.006;
          alpha=shadow*0.22;
        }
      }
      float halo=exp(-2.05*dot(p-vec2(0.04,-0.01),p-vec2(0.04,-0.01)));
      float lowerHalo=exp(-9.0*((p.x-0.04)*(p.x-0.04)+(p.y+0.47)*(p.y+0.47)));
      color+=vec3(0.028,0.105,0.132)*halo*(0.060+min(glow,0.32)*0.13)*uFxMix;
      color+=vec3(0.025,0.115,0.145)*lowerHalo*(0.035+0.010*uStage)*uFxMix;
      alpha=max(alpha,(halo*0.045+lowerHalo*0.055)*uFxMix);
      color+=vec3(0.16,0.59,0.75)*min(glow,0.42)*(0.14+0.035*uStage);
      alpha=max(alpha,min(glow,0.42)*0.15);
      vec4 signals=signalField(p*vec2(0.93,0.93),hit&&id<7.6,t);
      color+=signals.rgb*uSignalMix; alpha=max(alpha,signals.a*uSignalMix);
      float grain=hash21(frag+floor(uTime*1.4*uMotion));
      color+=(grain-0.5)*0.0018*alpha;
      color=aces(color*1.36); color=pow(color,vec3(0.95));
      outColor=vec4(color,clamp(alpha,0.0,1.0));
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
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Hero Core 2.0 R2 program link failed');
  } catch (error) {
    console.error('[Hero Core 2.0 R2 art direction]', error);
    root.classList.add('hero-core2--fallback');
    return;
  }

  gl.useProgram(program);
  const uniforms = {
    resolution: gl.getUniformLocation(program, 'uResolution'),
    pointer: gl.getUniformLocation(program, 'uPointer'),
    time: gl.getUniformLocation(program, 'uTime'),
    stage: gl.getUniformLocation(program, 'uStage'),
    motion: gl.getUniformLocation(program, 'uMotion'),
    quality: gl.getUniformLocation(program, 'uQuality'),
    signalMix: gl.getUniformLocation(program, 'uSignalMix'),
    fxMix: gl.getUniformLocation(program, 'uFxMix')
  };

  let pointer = { x: 0, y: 0 };
  let pointerTarget = { x: 0, y: 0 };
  let visible = true;
  let captureFreeze = false;
  let renderScale = 1;
  let quality = 1;
  let firstFrame = true;
  let frameSamples = [];
  let lastFrame = performance.now();
  const mobileViewport = () => window.innerWidth <= 700;

  const resize = () => {
    const rect = visual.getBoundingClientRect();
    const cssWidth = Math.max(1, Math.round(rect.width));
    const cssHeight = Math.max(1, Math.round(rect.height));
    const dprCap = mobileViewport() ? 1.08 : 1.48;
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap) * renderScale;
    const width = Math.max(2, Math.round(cssWidth * dpr));
    const height = Math.max(2, Math.round(cssHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(visual);
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const updatePointer = (event) => {
    if (motionReduced || coarsePointer.matches) return;
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
    const y = (event.clientY - rect.top) / Math.max(rect.height, 1);
    pointerTarget.x = (Math.max(0, Math.min(1, x)) - 0.5) * 2;
    pointerTarget.y = (0.5 - Math.max(0, Math.min(1, y))) * 2;
  };
  visual.addEventListener('pointermove', updatePointer, { passive: true });
  visual.addEventListener('pointerleave', () => { pointerTarget.x = 0; pointerTarget.y = 0; });

  const visibilityObserver = new IntersectionObserver((entries) => { visible = entries.some((entry) => entry.isIntersecting); }, { threshold: 0.02 });
  visibilityObserver.observe(visual);

  window.addEventListener('hero-core2:capture-freeze', (event) => {
    captureFreeze = Boolean(event.detail);
  });

  const adaptPerformance = (delta) => {
    if (firstFrame || motionReduced) return;
    frameSamples.push(delta);
    if (frameSamples.length < 68) return;
    const avg = frameSamples.reduce((sum, value) => sum + value, 0) / frameSamples.length;
    frameSamples = [];
    if (avg > 27 && renderScale > 0.70) {
      renderScale = Math.max(0.70, renderScale * 0.85);
      quality = Math.max(0.58, quality - 0.15);
      resize();
    }
  };

  const start = performance.now();
  const render = (now) => {
    requestAnimationFrame(render);
    if (!visible || document.hidden) return;
    if (captureFreeze && !firstFrame) return;
    const delta = now - lastFrame;
    lastFrame = now;
    adaptPerformance(delta);
    pointer.x += (pointerTarget.x - pointer.x) * 0.032;
    pointer.y += (pointerTarget.y - pointer.y) * 0.032;
    const elapsed = motionReduced ? 7.4 : (now - start) * 0.001;
    const mobileQuality = mobileViewport() ? Math.min(quality, 0.68) : quality;
    const coreOnly = reviewMode === 'core';
    const materialsOnly = reviewMode === 'materials';
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
    gl.uniform1f(uniforms.time, elapsed);
    gl.uniform1f(uniforms.stage, activeStage);
    gl.uniform1f(uniforms.motion, motionReduced ? 0 : 1);
    gl.uniform1f(uniforms.quality, mobileQuality);
    gl.uniform1f(uniforms.signalMix, coreOnly || materialsOnly ? 0 : 1);
    gl.uniform1f(uniforms.fxMix, coreOnly ? 0.28 : materialsOnly ? 0.55 : 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (firstFrame) { firstFrame = false; root.classList.add('hero-core2--ready'); }
  };
  requestAnimationFrame(render);
})();