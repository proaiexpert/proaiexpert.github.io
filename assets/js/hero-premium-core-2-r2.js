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
    out vec4 outColor;

    mat2 rot(float a){ float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }
    float hash21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }

    float sdRoundBox(vec3 p,vec3 b,float r){
      vec3 q=abs(p)-b+r;
      return min(max(q.x,max(q.y,q.z)),0.0)+length(max(q,0.0))-r;
    }
    float sdEllipsoid(vec3 p,vec3 r){
      float k0=length(p/r),k1=length(p/(r*r));
      return k0*(k0-1.0)/max(k1,0.0001);
    }
    float sdCapsule(vec3 p,vec3 a,vec3 b,float r){
      vec3 pa=p-a,ba=b-a;
      float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);
      return length(pa-ba*h)-r;
    }
    float sdPlane(vec3 p,vec3 n,float h){ return dot(p,n)+h; }

    float stageYaw(){
      if(uStage<0.5)return -0.12;
      if(uStage<1.5)return -0.035;
      if(uStage<2.5)return 0.075;
      return 0.14;
    }
    float stagePitch(){
      if(uStage<0.5)return 0.07;
      if(uStage<1.5)return 0.12;
      if(uStage<2.5)return 0.045;
      return -0.02;
    }

    vec3 objectSpace(vec3 p){
      p-=vec3(0.02,-0.015,0.0);
      float dy=uMotion*(0.052*sin(uTime*0.21)+0.020*sin(uTime*0.067+1.4));
      float dx=uMotion*(0.025*sin(uTime*0.16+0.9));
      float yaw=-0.29+stageYaw()+dy+uPointer.x*0.052*uMotion;
      float pitch=0.09+stagePitch()+dx-uPointer.y*0.032*uMotion;
      p.xz=rot(-yaw)*p.xz;
      p.yz=rot(-pitch)*p.yz;
      return p;
    }

    float innerDistanceFromObject(vec3 q){
      vec3 p=q-vec3(0.10,-0.01,0.035);
      p.xy=rot(0.18+uMotion*0.028*sin(uTime*0.34))*p.xy;
      p.xz=rot(-0.17-uMotion*uTime*0.012)*p.xz;
      float lens=sdEllipsoid(p,vec3(0.37,0.46,0.285));
      vec3 p2=p-vec3(0.065,-0.018,0.025);
      float kernel=sdEllipsoid(p2,vec3(0.205,0.305,0.175));
      return min(lens,kernel+0.030);
    }

    vec2 mapScene(vec3 p){
      vec3 q=objectSpace(p);
      vec2 res=vec2(1000.0,0.0);

      vec3 s=q-vec3(-0.50,0.01,-0.08);
      s.xy=rot(-0.21)*s.xy; s.yz=rot(0.08)*s.yz;
      float spine=sdRoundBox(s,vec3(0.20,0.82,0.32),0.115);
      vec3 spineCut=s-vec3(0.12,0.05,0.27);
      float spineNotch=sdRoundBox(spineCut,vec3(0.12,0.40,0.13),0.055);
      spine=max(spine,-spineNotch);
      if(spine<res.x)res=vec2(spine,1.0);

      vec3 c=q-vec3(0.03,0.69,0.08);
      c.xy=rot(-0.23)*c.xy; c.xz=rot(0.15)*c.xz;
      float crown=sdRoundBox(c,vec3(0.66,0.17,0.31),0.105);
      vec3 crownCut=c-vec3(0.32,-0.02,0.25);
      float crownNotch=sdRoundBox(crownCut,vec3(0.22,0.12,0.12),0.045);
      crown=max(crown,-crownNotch);
      if(crown<res.x)res=vec2(crown,2.0);

      vec3 k=q-vec3(0.18,-0.65,0.04);
      k.xy=rot(0.16)*k.xy; k.xz=rot(-0.19)*k.xz;
      float keel=sdRoundBox(k,vec3(0.58,0.19,0.35),0.115);
      vec3 keelCut=k-vec3(-0.33,0.00,0.29);
      float keelNotch=sdRoundBox(keelCut,vec3(0.18,0.12,0.12),0.045);
      keel=max(keel,-keelNotch);
      if(keel<res.x)res=vec2(keel,1.0);

      vec3 f=q-vec3(0.66,0.13,-0.14);
      f.xy=rot(0.13)*f.xy; f.yz=rot(0.31)*f.yz; f.xz=rot(0.20)*f.xz;
      float fin=sdRoundBox(f,vec3(0.15,0.50,0.23),0.095);
      if(fin<res.x)res=vec2(fin,2.0);

      // Two fine internal ribs: structural suggestion, not machinery.
      vec3 ribQ=q-vec3(0.05,0.0,-0.10);
      float rib1=sdCapsule(ribQ,vec3(-0.34,-0.25,0.0),vec3(0.25,0.36,0.0),0.036);
      float rib2=sdCapsule(ribQ,vec3(-0.18,0.34,-0.02),vec3(0.33,-0.16,0.02),0.027);
      float ribs=min(rib1,rib2);
      if(ribs<res.x)res=vec2(ribs,5.0);

      // Curved smoked aperture: a clipped front shell around the intelligence volume.
      vec3 g=q-vec3(0.10,0.0,0.025);
      g.xy=rot(0.07)*g.xy;
      float glass=abs(sdEllipsoid(g,vec3(0.445,0.525,0.34)))-0.018;
      glass=max(glass,0.055-g.z);
      glass=max(glass,g.x-0.31);
      glass=max(glass,-g.x-0.11);
      if(glass<res.x)res=vec2(glass,3.0);

      float inner=innerDistanceFromObject(q);
      if(inner<res.x)res=vec2(inner,4.0);

      float floorD=sdPlane(p,vec3(0.0,1.0,0.0),1.23);
      if(floorD<res.x)res=vec2(floorD,6.0);
      return res;
    }

    vec3 calcNormal(vec3 p){
      vec2 e=vec2(0.0017,0.0);
      float d=mapScene(p).x;
      return normalize(vec3(mapScene(p+e.xyy).x-d,mapScene(p+e.yxy).x-d,mapScene(p+e.yyx).x-d));
    }

    float softShadow(vec3 ro,vec3 rd,float mint,float maxt){
      float res=1.0,t=mint;
      for(int i=0;i<24;i++){
        float h=mapScene(ro+rd*t).x;
        res=min(res,13.0*h/t);
        t+=clamp(h,0.022,0.19);
        if(h<0.001||t>maxt)break;
      }
      return clamp(res,0.0,1.0);
    }

    float ambientOcclusion(vec3 p,vec3 n){
      float occ=0.0,sca=1.0;
      for(int i=0;i<4;i++){
        float h=0.04+0.085*float(i);
        float d=mapScene(p+n*h).x;
        occ+=(h-d)*sca;
        sca*=0.66;
      }
      return clamp(1.0-1.30*occ,0.0,1.0);
    }

    vec3 materialColor(float id,vec3 p,vec3 n,vec3 rd,float glow){
      vec3 graphite=vec3(0.042,0.055,0.061);
      vec3 steel=vec3(0.105,0.125,0.135);
      vec3 darkSteel=vec3(0.072,0.089,0.098);
      vec3 cyan=vec3(0.31,0.84,0.98);
      vec3 ice=vec3(0.60,0.76,0.81);
      vec3 warm=vec3(0.80,0.65,0.44);
      vec3 keyPos=vec3(-2.8,3.4,4.2),rimPos=vec3(3.5,1.5,2.4);
      vec3 l=normalize(keyPos-p),l2=normalize(rimPos-p),v=normalize(-rd),h=normalize(l+v);
      float ndl=max(dot(n,l),0.0),ndl2=max(dot(n,l2),0.0);
      float shadow=softShadow(p+n*0.009,l,0.026,6.0);
      float ao=ambientOcclusion(p,n);
      float facing=max(dot(n,v),0.0);
      float fres=pow(1.0-facing,4.2);
      float brush=0.5+0.5*sin((p.y+p.x*0.22)*76.0);

      if(id<1.5){
        float spec=pow(max(dot(n,h),0.0),62.0+28.0*brush);
        vec3 base=graphite*(0.44+0.90*ndl*shadow)*ao;
        base+=vec3(0.30,0.34,0.36)*spec*(0.25+0.14*brush);
        base+=cyan*fres*0.055+warm*ndl2*fres*0.025;
        return base;
      }
      if(id<2.5){
        float spec=pow(max(dot(n,h),0.0),104.0);
        vec3 base=steel*(0.47+0.94*ndl*shadow)*ao;
        base+=ice*spec*0.38;
        base+=cyan*fres*0.070+warm*ndl2*fres*0.040;
        return base;
      }
      if(id<3.5){
        float rim=pow(1.0-facing,2.6);
        float spec=pow(max(dot(n,h),0.0),86.0);
        vec3 smoke=vec3(0.012,0.028,0.034)*(0.48+ndl*0.18);
        smoke+=cyan*(rim*0.12+glow*0.035);
        smoke+=ice*spec*0.075;
        return smoke;
      }
      if(id<4.5){
        float rim=pow(1.0-facing,2.85);
        float phase=0.75+0.055*uMotion*sin(uTime*1.08+p.y*5.0)+uStage*0.018;
        float wave=0.5+0.5*sin(p.x*10.0+p.y*13.0-p.z*7.0+uTime*0.52*uMotion);
        float filament=pow(wave,9.0);
        float spec=pow(max(dot(n,h),0.0),72.0);
        vec3 inner=vec3(0.010,0.042,0.052)*(0.82+0.18*ndl)*phase;
        inner+=cyan*(rim*0.20+filament*0.095+glow*0.030);
        inner+=ice*spec*0.050;
        return inner;
      }
      if(id<5.5){
        float spec=pow(max(dot(n,h),0.0),80.0);
        vec3 base=darkSteel*(0.50+0.70*ndl*shadow)*ao;
        base+=ice*spec*0.22+cyan*fres*0.055;
        return base;
      }
      return vec3(0.006,0.009,0.010);
    }

    vec2 curveDistance(vec2 p,vec2 a,vec2 b,vec2 c,vec2 d){
      float md=10.0,mt=0.0; vec2 prev=a;
      for(int i=1;i<=32;i++){
        float t=float(i)/32.0,s=1.0-t;
        vec2 cur=s*s*s*a+3.0*s*s*t*b+3.0*s*t*t*c+t*t*t*d;
        vec2 pa=p-prev,ba=cur-prev;
        float h=clamp(dot(pa,ba)/max(dot(ba,ba),0.00001),0.0,1.0);
        float dd=length(pa-ba*h);
        if(dd<md){md=dd;mt=(float(i-1)+h)/32.0;}
        prev=cur;
      }
      return vec2(md,mt);
    }

    vec4 signalField(vec2 uv,bool objectHit,float objectDepth){
      vec3 cyan=vec3(0.31,0.84,0.98),ice=vec3(0.68,0.90,0.96);
      vec3 col=vec3(0.0); float alpha=0.0;
      vec2 a=curveDistance(uv,vec2(-1.08,0.36),vec2(-0.63,0.61),vec2(-0.18,-0.22),vec2(1.02,-0.07));
      vec2 b=curveDistance(uv,vec2(-0.90,-0.54),vec2(-0.27,-0.12),vec2(0.22,-0.58),vec2(1.00,-0.28));
      vec2 c=curveDistance(uv,vec2(-0.78,0.72),vec2(-0.28,0.26),vec2(0.38,0.64),vec2(0.95,0.39));
      vec2 d=curveDistance(uv,vec2(-0.30,0.00),vec2(0.06,0.19),vec2(0.46,0.08),vec2(0.86,0.18));
      float la=1.0-smoothstep(0.0012,0.0067,a.x);
      float lb=1.0-smoothstep(0.0010,0.0053,b.x);
      float lc=1.0-smoothstep(0.0008,0.0044,c.x);
      float ld=1.0-smoothstep(0.0008,0.0040,d.x);
      float segmented=smoothstep(0.30,0.62,fract(a.y*27.0-uTime*0.043*uMotion));
      la*=mix(segmented,1.0,smoothstep(0.44,0.70,a.y));
      float phase=uStage*0.087;
      float pa=exp(-170.0*pow(abs(fract(a.y-uTime*0.052*uMotion-phase)-0.5),2.0));
      float pb=exp(-150.0*pow(abs(fract(b.y-uTime*0.041*uMotion-0.27-phase)-0.5),2.0));
      float pc=exp(-180.0*pow(abs(fract(c.y-uTime*0.033*uMotion-0.59-phase)-0.5),2.0));
      float behindA=step(0.34,a.y)*(1.0-step(0.66,a.y));
      float behindC=step(0.41,c.y)*(1.0-step(0.72,c.y));
      if(objectHit&&objectDepth<6.0){ la*=mix(1.0,0.07,behindA); lc*=mix(1.0,0.09,behindC); }
      float aStrength=la*(0.060+pa*0.62);
      float bStrength=lb*(0.027+pb*0.16);
      float cStrength=lc*(0.018+pc*0.13);
      float dStrength=ld*0.026*smoothstep(0.7,2.5,uStage);
      col+=cyan*aStrength+ice*bStrength+cyan*cStrength+cyan*dStrength;
      alpha+=aStrength*1.5+bStrength*1.25+cStrength*1.15+dStrength*1.15;
      vec2 cell=floor((uv+1.4)*vec2(36.0,30.0));
      float rnd=hash21(cell);
      vec2 fp=fract((uv+1.4)*vec2(36.0,30.0))-0.5;
      float dust=(1.0-smoothstep(0.02,0.08,length(fp)))*step(0.968,rnd);
      float corridor=exp(-32.0*min(a.x,b.x));
      float dustStrength=dust*corridor*(0.012+0.020*smoothstep(0.5,2.5,uStage));
      col+=ice*dustStrength; alpha+=dustStrength*1.7;
      return vec4(col,clamp(alpha,0.0,0.55));
    }

    vec3 aces(vec3 x){
      float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14;
      return clamp((x*(a*x+b))/(x*(c*x+d)+e),0.0,1.0);
    }

    void main(){
      vec2 frag=gl_FragCoord.xy;
      vec2 p=(2.0*frag-uResolution.xy)/uResolution.y;
      p.x+=0.02;
      vec3 ro=vec3(0.02+uPointer.x*0.05*uMotion,0.07+uPointer.y*0.03*uMotion,4.12);
      vec3 ta=vec3(0.06,-0.015,0.0);
      vec3 ww=normalize(ta-ro),uu=normalize(cross(ww,vec3(0.0,1.0,0.0))),vv=cross(uu,ww);
      vec3 rd=normalize(uu*p.x+vv*p.y+ww*2.36);

      float t=0.0,id=0.0,glow=0.0; bool hit=false;
      int maxSteps=int(mix(48.0,70.0,uQuality));
      for(int i=0;i<72;i++){
        if(i>maxSteps)break;
        vec3 pos=ro+rd*t;
        vec2 h=mapScene(pos);
        vec3 q=objectSpace(pos);
        float innerD=innerDistanceFromObject(q);
        glow+=exp(-11.5*abs(innerD))*0.0070*exp(-0.08*t);
        if(h.x<0.0017){hit=true;id=h.y;break;}
        t+=max(h.x*0.78,0.0095);
        if(t>9.2)break;
      }

      vec3 color=vec3(0.0); float alpha=0.0;
      if(hit){
        vec3 pos=ro+rd*t;
        if(id<5.5){
          vec3 n=calcNormal(pos);
          color=materialColor(id,pos,n,rd,glow);
          float fog=1.0-exp(-0.03*t*t);
          color*=1.0-fog*0.18;
          alpha=1.0;
        }else{
          float shadow=exp(-1.45*(pos.x*pos.x+pos.z*pos.z));
          float light=exp(-3.5*(pos.x*pos.x+pos.z*pos.z));
          color=vec3(0.002,0.005,0.006)+vec3(0.18,0.54,0.62)*light*0.007;
          alpha=shadow*0.26;
        }
      }

      float halo=exp(-2.25*dot(p-vec2(0.05,-0.02),p-vec2(0.05,-0.02)));
      color+=vec3(0.035,0.11,0.13)*halo*(0.055+min(glow,0.28)*0.12);
      alpha=max(alpha,halo*0.042);
      color+=vec3(0.18,0.62,0.76)*min(glow,0.40)*(0.13+0.04*uStage);
      alpha=max(alpha,min(glow,0.40)*0.15);

      vec4 signals=signalField(p*vec2(0.92,0.92),hit&&id<5.5,t);
      color+=signals.rgb; alpha=max(alpha,signals.a);
      float grain=hash21(frag+floor(uTime*1.5*uMotion));
      color+=(grain-0.5)*0.0020*alpha;
      color=aces(color*1.32); color=pow(color,vec3(0.95));
      outColor=vec4(color,clamp(alpha,0.0,1.0));
    }
  `;

  const compile=(type,source)=>{
    const shader=gl.createShader(type);
    gl.shaderSource(shader,source);
    gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
      const message=gl.getShaderInfoLog(shader)||'Unknown shader compile failure';
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  };

  let program;
  try{
    const vertex=compile(gl.VERTEX_SHADER,vertexSource);
    const fragment=compile(gl.FRAGMENT_SHADER,fragmentSource);
    program=gl.createProgram();
    gl.attachShader(program,vertex); gl.attachShader(program,fragment); gl.linkProgram(program);
    gl.deleteShader(vertex); gl.deleteShader(fragment);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)||'Hero Core 2.0 program link failed');
  }catch(error){
    console.error('[Hero Core 2.0 material refinement]',error);
    root.classList.add('hero-core2--fallback');
    return;
  }

  gl.useProgram(program);
  const uniforms={
    resolution:gl.getUniformLocation(program,'uResolution'),
    pointer:gl.getUniformLocation(program,'uPointer'),
    time:gl.getUniformLocation(program,'uTime'),
    stage:gl.getUniformLocation(program,'uStage'),
    motion:gl.getUniformLocation(program,'uMotion'),
    quality:gl.getUniformLocation(program,'uQuality')
  };

  let pointer={x:0,y:0},pointerTarget={x:0,y:0};
  let visible=true,renderScale=1,quality=1,firstFrame=true;
  let frameSamples=[],lastFrame=performance.now();
  const mobileViewport=()=>window.innerWidth<=700;

  const resize=()=>{
    const rect=visual.getBoundingClientRect();
    const cssWidth=Math.max(1,Math.round(rect.width)),cssHeight=Math.max(1,Math.round(rect.height));
    const dprCap=mobileViewport()?1.10:1.48;
    const dpr=Math.min(window.devicePixelRatio||1,dprCap)*renderScale;
    const width=Math.max(2,Math.round(cssWidth*dpr)),height=Math.max(2,Math.round(cssHeight*dpr));
    if(canvas.width!==width||canvas.height!==height){ canvas.width=width; canvas.height=height; gl.viewport(0,0,width,height); }
  };

  const resizeObserver=new ResizeObserver(resize);
  resizeObserver.observe(visual);
  window.addEventListener('resize',resize,{passive:true});
  resize();

  const updatePointer=(event)=>{
    if(motionReduced||coarsePointer.matches)return;
    const rect=visual.getBoundingClientRect();
    const x=(event.clientX-rect.left)/Math.max(rect.width,1),y=(event.clientY-rect.top)/Math.max(rect.height,1);
    pointerTarget.x=(Math.max(0,Math.min(1,x))-0.5)*2;
    pointerTarget.y=(0.5-Math.max(0,Math.min(1,y)))*2;
  };
  visual.addEventListener('pointermove',updatePointer,{passive:true});
  visual.addEventListener('pointerleave',()=>{pointerTarget.x=0;pointerTarget.y=0;});

  const visibilityObserver=new IntersectionObserver((entries)=>{ visible=entries.some((entry)=>entry.isIntersecting); },{threshold:0.02});
  visibilityObserver.observe(visual);

  const adaptPerformance=(delta)=>{
    if(firstFrame||motionReduced)return;
    frameSamples.push(delta);
    if(frameSamples.length<70)return;
    const avg=frameSamples.reduce((s,v)=>s+v,0)/frameSamples.length;
    frameSamples=[];
    if(avg>26&&renderScale>0.72){ renderScale=Math.max(0.72,renderScale*0.86); quality=Math.max(0.60,quality-0.16); resize(); }
  };

  const start=performance.now();
  const render=(now)=>{
    requestAnimationFrame(render);
    if(!visible||document.hidden)return;
    const delta=now-lastFrame; lastFrame=now; adaptPerformance(delta);
    pointer.x+=(pointerTarget.x-pointer.x)*0.034;
    pointer.y+=(pointerTarget.y-pointer.y)*0.034;
    const elapsed=motionReduced?7.1:(now-start)*0.001;
    gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform2f(uniforms.resolution,canvas.width,canvas.height);
    gl.uniform2f(uniforms.pointer,pointer.x,pointer.y);
    gl.uniform1f(uniforms.time,elapsed);
    gl.uniform1f(uniforms.stage,activeStage);
    gl.uniform1f(uniforms.motion,motionReduced?0:1);
    gl.uniform1f(uniforms.quality,mobileViewport()?Math.min(quality,0.76):quality);
    gl.drawArrays(gl.TRIANGLES,0,3);
    if(firstFrame){ firstFrame=false; root.classList.add('hero-core2--ready'); }
  };
  requestAnimationFrame(render);
})();
