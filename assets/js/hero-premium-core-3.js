(() => {
  'use strict';

  const root = document.documentElement;
  const canvas = document.querySelector('[data-hero-core2-canvas]');
  const visual = document.querySelector('[data-hero-core2-visual]');
  const stageItems = [...document.querySelectorAll('[data-hero-core2-stage]')];
  const stageButtons = [...document.querySelectorAll('[data-hero-core2-stage-button]')];
  if (!canvas || !visual) return;

  const params = new URLSearchParams(location.search);
  const reviewMode = params.get('review') || '';
  const forcedStage = params.has('stage') ? Math.max(0, Math.min(3, Number(params.get('stage')) || 0)) : null;
  const fixedTime = params.has('time') ? Math.max(0, Number(params.get('time')) || 0) : null;
  root.dataset.heroCore2Review = reviewMode;
  root.dataset.heroCore3 = 'breakthrough-r1';

  const reducedMotionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer = matchMedia('(pointer: coarse)');
  let motionReduced = reducedMotionQuery.matches;
  let activeStage = forcedStage ?? (motionReduced ? 3 : 0);
  let stageVisual = activeStage;
  let manualStageUntil = forcedStage === null ? 0 : Infinity;
  let narrativeTimers = [];
  let narrativeInterval = null;
  let captureFrozen = fixedTime !== null;
  let frozenTime = fixedTime ?? 0;
  let visible = true;
  let pointerTarget = [0, 0];
  let pointer = [0, 0];
  let lastFrame = performance.now();
  let startTime = performance.now();
  let elapsedBeforeFreeze = 0;

  function setActiveStage(index, manual = false) {
    activeStage = Math.max(0, Math.min(3, index));
    stageItems.forEach((item, i) => item.classList.toggle('is-active', i === activeStage));
    stageButtons.forEach((button, i) => button.setAttribute('aria-current', i === activeStage ? 'step' : 'false'));
    root.style.setProperty('--hero-core3-stage', String(activeStage));
    if (manual) manualStageUntil = performance.now() + 10000;
  }

  function clearNarrative() {
    narrativeTimers.forEach(clearTimeout);
    narrativeTimers = [];
    if (narrativeInterval) clearInterval(narrativeInterval);
    narrativeInterval = null;
  }

  function runNarrative() {
    if (motionReduced || forcedStage !== null) {
      setActiveStage(motionReduced ? 3 : activeStage);
      return;
    }
    narrativeTimers.forEach(clearTimeout);
    narrativeTimers = [];
    [[700, 0], [3700, 1], [6900, 2], [10200, 3]].forEach(([delay, stage]) => {
      narrativeTimers.push(setTimeout(() => {
        if (performance.now() >= manualStageUntil) setActiveStage(stage);
      }, delay));
    });
  }

  function scheduleNarrative() {
    clearNarrative();
    runNarrative();
    if (!motionReduced && forcedStage === null) {
      narrativeInterval = setInterval(() => {
        if (!document.hidden && performance.now() >= manualStageUntil) runNarrative();
      }, 24000);
    }
  }

  stageButtons.forEach((button, i) => {
    button.addEventListener('mouseenter', () => setActiveStage(i, true));
    button.addEventListener('focus', () => setActiveStage(i, true));
    button.addEventListener('click', () => setActiveStage(i, true));
  });
  setActiveStage(activeStage);
  scheduleNarrative();

  function buildSignalOverlay() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.classList.add('hero-core3__signal-overlay');
    svg.setAttribute('viewBox', '0 0 1000 1000');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    const defs = document.createElementNS(ns, 'defs');
    svg.appendChild(defs);
    const paths = [
      'M 168 266 C 294 275 335 408 444 470',
      'M 185 770 C 305 728 355 606 456 548',
      'M 838 326 C 716 338 686 418 575 474',
      'M 828 758 C 716 710 666 611 576 548'
    ];
    const secondary = [
      'M 250 210 C 380 168 525 188 632 282',
      'M 314 820 C 462 858 621 822 726 690',
      'M 688 254 C 744 377 745 520 696 645'
    ];
    paths.forEach((d, i) => {
      const p = document.createElementNS(ns, 'path');
      p.setAttribute('d', d);
      p.setAttribute('id', `hero-core3-path-${i}`);
      p.classList.add('hero-core3__signal-path');
      svg.appendChild(p);
      const node = document.createElementNS(ns, 'circle');
      const endpoints = [[168,266],[185,770],[838,326],[828,758]][i];
      node.setAttribute('cx', endpoints[0]); node.setAttribute('cy', endpoints[1]); node.setAttribute('r', '4.2');
      node.classList.add('hero-core3__signal-node');
      svg.appendChild(node);
      const pulse = document.createElementNS(ns, 'circle');
      pulse.setAttribute('r', i === activeStage ? '4.3' : '3.1');
      pulse.classList.add('hero-core3__signal-pulse');
      pulse.dataset.pathIndex = String(i);
      svg.appendChild(pulse);
    });
    secondary.forEach(d => {
      const p = document.createElementNS(ns, 'path'); p.setAttribute('d', d);
      p.classList.add('hero-core3__signal-path', 'hero-core3__signal-path--secondary'); svg.appendChild(p);
    });
    const coreNode = document.createElementNS(ns, 'circle');
    coreNode.setAttribute('cx','516'); coreNode.setAttribute('cy','511'); coreNode.setAttribute('r','8');
    coreNode.classList.add('hero-core3__signal-core-node'); svg.appendChild(coreNode);
    visual.appendChild(svg);

    const label = document.createElement('div');
    label.className = 'hero-core3__system-label';
    label.innerHTML = '<b></b><span>SYSTEM / LIVE</span>';
    visual.appendChild(label);
    return svg;
  }
  const signalSvg = buildSignalOverlay();
  const signalPaths = [...signalSvg.querySelectorAll('.hero-core3__signal-path:not(.hero-core3__signal-path--secondary)')];
  const signalPulses = [...signalSvg.querySelectorAll('.hero-core3__signal-pulse')];

  if (!coarsePointer.matches) {
    visual.addEventListener('pointermove', event => {
      const r = visual.getBoundingClientRect();
      pointerTarget[0] = ((event.clientX - r.left) / Math.max(r.width, 1) - .5) * 2;
      pointerTarget[1] = -(((event.clientY - r.top) / Math.max(r.height, 1) - .5) * 2);
    }, { passive: true });
    visual.addEventListener('pointerleave', () => { pointerTarget = [0, 0]; }, { passive: true });
  }

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
    const vec2 POS[3] = vec2[3](vec2(-1.,-1.), vec2(3.,-1.), vec2(-1.,3.));
    void main(){ gl_Position = vec4(POS[gl_VertexID], 0., 1.); }
  `;

  const fragmentSource = `#version 300 es
    precision highp float;
    uniform vec2 uResolution;
    uniform vec2 uPointer;
    uniform float uTime;
    uniform float uStage;
    uniform float uMotion;
    uniform float uQuality;
    uniform float uReview;
    out vec4 outColor;

    #define PI 3.14159265359
    mat2 rot(float a){ float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }
    float sat(float x){ return clamp(x,0.,1.); }
    float hash21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }

    float sdRoundBox(vec3 p, vec3 b, float r){ vec3 q=abs(p)-b+r; return min(max(q.x,max(q.y,q.z)),0.)+length(max(q,0.))-r; }
    float sdBox(vec3 p, vec3 b){ vec3 q=abs(p)-b; return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.); }
    float sdCapsule(vec3 p, vec3 a, vec3 b, float r){ vec3 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h)-r; }
    float sdSphere(vec3 p,float r){ return length(p)-r; }
    float sdCylinder(vec3 p, vec2 h){ vec2 d=abs(vec2(length(p.xz),p.y))-h; return min(max(d.x,d.y),0.)+length(max(d,0.)); }
    float sdTorus(vec3 p, vec2 t){ vec2 q=vec2(length(p.xz)-t.x,p.y); return length(q)-t.y; }
    float sdOctahedron(vec3 p,float s){ p=abs(p); return (p.x+p.y+p.z-s)*0.57735027; }
    float sdBoxFrame(vec3 p, vec3 b, float e){
      p=abs(p)-b; vec3 q=abs(p+e)-e;
      float a=length(max(vec3(p.x,q.y,q.z),0.))+min(max(p.x,max(q.y,q.z)),0.);
      float c=length(max(vec3(q.x,p.y,q.z),0.))+min(max(q.x,max(p.y,q.z)),0.);
      float d=length(max(vec3(q.x,q.y,p.z),0.))+min(max(q.x,max(q.y,p.z)),0.);
      return min(a,min(c,d));
    }
    float sdFacetBox(vec3 p, vec3 b, float r, float cut){
      float d=sdRoundBox(p,b,r);
      d=max(d,(abs(p.x)+abs(p.y)-b.x-b.y+cut)*.7071);
      d=max(d,(abs(p.x)+abs(p.z)-b.x-b.z+cut*.8)*.7071);
      return d;
    }

    vec3 rotateXYZ(vec3 p, vec3 a){ p.yz=rot(a.x)*p.yz; p.xz=rot(a.y)*p.xz; p.xy=rot(a.z)*p.xy; return p; }
    vec3 outerSpace(vec3 p){
      float yaw = -.22 + uMotion*(.27*sin(uTime*.145)+.05*sin(uTime*.043+1.7)) + uPointer.x*.075*uMotion;
      float pitch = .08 + uMotion*(.11*sin(uTime*.113+.8)+.025*sin(uTime*.039)) - uPointer.y*.055*uMotion;
      float roll = uMotion*.045*sin(uTime*.071+2.0);
      p.y -= uMotion*(.035*sin(uTime*.34)+.014*sin(uTime*.11));
      return rotateXYZ(p,vec3(-pitch,-yaw,-roll));
    }
    vec3 innerSpace(vec3 p){
      p.y -= uMotion*(.02*sin(uTime*.39+.5));
      float yaw = .17 + uMotion*(-.31*sin(uTime*.181+.7)-.07*sin(uTime*.057));
      float pitch = -.08 + uMotion*(.13*sin(uTime*.151+1.5));
      float roll = .04 + uMotion*(.08*sin(uTime*.127+2.4));
      return rotateXYZ(p,vec3(-pitch,-yaw,-roll));
    }
    vec3 opticalSpace(vec3 p){
      float a=uMotion*(.18*sin(uTime*.101)+.09*sin(uTime*.041+2.));
      p.xz=rot(-a)*p.xz; p.xy=rot(a*.35)*p.xy; return p;
    }

    vec2 opU(vec2 a, vec2 b){ return a.x<b.x?a:b; }
    vec2 mapOuter(vec3 p){
      vec3 q=outerSpace(p); vec2 r=vec2(99.,0.);
      float open=smoothstep(.2,2.9,uStage);
      float breathe=uMotion*sin(uTime*.31);
      vec3 z; float d;

      z=q-vec3(-.82-.05*open,.02,.08); z.xy=rot(-.11+.025*breathe)*z.xy; z.yz=rot(.08)*z.yz;
      d=sdFacetBox(z,vec3(.235,.79,.22),.045,.045); d=max(d,-sdRoundBox(z-vec3(.12,.02,.16),vec3(.12,.45,.10),.035)); r=opU(r,vec2(d,1.));

      z=q-vec3(-.04,.84+.04*open,.01); z.xy=rot(-.08-.02*breathe)*z.xy; z.xz=rot(.08)*z.xz;
      d=sdFacetBox(z,vec3(.72,.205,.235),.05,.055); d=max(d,-sdRoundBox(z-vec3(.22,-.02,.16),vec3(.24,.10,.11),.03)); r=opU(r,vec2(d,1.18));

      z=q-vec3(.04,-.82-.035*open,.02); z.xy=rot(.10+.017*breathe)*z.xy; z.xz=rot(-.06)*z.xz;
      d=sdFacetBox(z,vec3(.69,.19,.24),.048,.055); d=max(d,-sdRoundBox(z-vec3(-.23,.01,.17),vec3(.21,.09,.11),.03)); r=opU(r,vec2(d,1.06));

      z=q-vec3(.77+.06*open,.09,-.05); z.xy=rot(.08-.022*breathe)*z.xy; z.yz=rot(-.12)*z.yz;
      d=sdFacetBox(z,vec3(.20,.67,.21),.045,.04); d=max(d,-sdRoundBox(z-vec3(-.11,.04,.15),vec3(.10,.34,.10),.03)); r=opU(r,vec2(d,1.28));

      z=q-vec3(-.30,.36,.37+.03*open); z.xy=rot(-.19+.028*breathe)*z.xy; z.xz=rot(.11)*z.xz;
      d=sdFacetBox(z,vec3(.48,.13,.075),.028,.045); r=opU(r,vec2(d,2.0));

      z=q-vec3(.28,-.37,.39+.025*open); z.xy=rot(.17-.024*breathe)*z.xy; z.xz=rot(-.09)*z.xz;
      d=sdFacetBox(z,vec3(.49,.125,.07),.026,.04); r=opU(r,vec2(d,2.08));

      z=q-vec3(-.49,-.51,-.30-.03*open); z.xy=rot(.46+.02*breathe)*z.xy; z.xz=rot(.12)*z.xz;
      d=sdFacetBox(z,vec3(.38,.11,.12),.028,.04); r=opU(r,vec2(d,1.44));

      z=q-vec3(.48,.50,-.28); z.xy=rot(.48-.02*breathe)*z.xy; z.xz=rot(-.12)*z.xz;
      d=sdFacetBox(z,vec3(.35,.105,.12),.027,.04); r=opU(r,vec2(d,1.52));

      float ext=smoothstep(1.4,3.0,uStage);
      z=q-vec3(1.03+.18*ext,.06+.025*sin(uTime*.29)*uMotion,.05); z.xy=rot(-.05+.10*ext)*z.xy; z.yz=rot(.18)*z.yz;
      d=sdFacetBox(z,vec3(.30,.15,.16),.038,.04); r=opU(r,vec2(d,2.28));

      z=q-vec3(.17,.03,-.50); z.xy=rot(-.13)*z.xy; z.xz=rot(.08+.02*breathe)*z.xz;
      d=sdFacetBox(z,vec3(.56,.095,.09),.024,.035); r=opU(r,vec2(d,1.70));

      return r;
    }

    vec2 mapInner(vec3 p){
      vec3 q=innerSpace(p); vec2 r=vec2(99.,0.); vec3 z; float d;
      float pulse=.5+.5*sin(uTime*.62);

      z=q-vec3(0.,0.,.03); z.xy=rot(.10)*z.xy;
      d=sdBoxFrame(z,vec3(.48,.57,.16),.055); r=opU(r,vec2(d,3.0));

      z=q-vec3(.02,.01,.12); z.xy=rot(-.13)*z.xy; z.yz=rot(.10+.035*sin(uTime*.21)*uMotion)*z.yz;
      d=sdBoxFrame(z,vec3(.37,.45,.13),.045); r=opU(r,vec2(d,3.15));

      z=q-vec3(-.02,-.01,.22); z.xy=rot(.19+.04*sin(uTime*.27)*uMotion)*z.xy; z.xz=rot(-.13)*z.xz;
      d=sdBoxFrame(z,vec3(.27,.34,.10),.038); r=opU(r,vec2(d,3.32));

      z=q-vec3(.01,.0,.30); z.xy=rot(-.07-.05*sin(uTime*.23+.8)*uMotion)*z.xy;
      d=sdBoxFrame(z,vec3(.18,.24,.075),.030); r=opU(r,vec2(d,4.6));

      z=q-vec3(-.12,.02,-.05); z.xy=rot(-.24+.05*sin(uTime*.19)*uMotion)*z.xy;
      d=sdRoundBox(z,vec3(.31,.43,.025),.026); d=max(d,-sdRoundBox(z-vec3(.08,.0,.0),vec3(.18,.28,.05),.035)); r=opU(r,vec2(d,3.72));

      z=q-vec3(.11,-.03,.43); z.xy=rot(.19-.045*sin(uTime*.17+1.)*uMotion)*z.xy;
      d=sdRoundBox(z,vec3(.25,.34,.022),.023); d=max(d,-sdRoundBox(z-vec3(-.06,.0,.0),vec3(.14,.22,.04),.03)); r=opU(r,vec2(d,3.82));

      z=q-vec3(.0,.0,.20); z=rotateXYZ(z,vec3(.15,.2,.08));
      d=sdOctahedron(z,.155+.012*pulse*uMotion); r=opU(r,vec2(d,5.0));

      d=sdCapsule(q,vec3(-.43,-.31,.16),vec3(.42,.31,.18),.025); r=opU(r,vec2(d,4.2));
      d=sdCapsule(q,vec3(-.38,.35,.09),vec3(.41,-.25,.26),.020); r=opU(r,vec2(d,4.35));
      return r;
    }

    vec2 mapOptical(vec3 p){
      if(uReview>0.5) return vec2(99.,0.);
      vec3 q=opticalSpace(p); vec2 r=vec2(99.,0.); float d;
      d=sdCapsule(q,vec3(-1.38,.37,-.40),vec3(-.76,.12,-.02),.017); r=opU(r,vec2(d,5.35));
      d=sdCapsule(q,vec3(-.78,.12,-.02),vec3(-.20,-.03,.30),.014); r=opU(r,vec2(d,5.35));
      d=sdCapsule(q,vec3(.30,.39,.42),vec3(.86,.18,.04),.016); r=opU(r,vec2(d,5.48));
      d=sdCapsule(q,vec3(.86,.18,.04),vec3(1.38,.48,-.31),.013); r=opU(r,vec2(d,5.48));
      d=sdCapsule(q,vec3(-.43,-.51,.31),vec3(.19,-.72,.02),.014); r=opU(r,vec2(d,5.62));
      d=sdCapsule(q,vec3(.19,-.72,.02),vec3(.90,-.50,-.37),.011); r=opU(r,vec2(d,5.62));
      float t=fract(uTime*.105+uStage*.17);
      vec3 pulse=mix(vec3(-1.38,.37,-.40),vec3(-.20,-.03,.30),t); d=sdSphere(q-pulse,.032); r=opU(r,vec2(d,5.8));
      t=fract(uTime*.087+.33); pulse=mix(vec3(.30,.39,.42),vec3(1.38,.48,-.31),t); d=sdSphere(q-pulse,.028); r=opU(r,vec2(d,5.8));
      return r;
    }

    vec2 mapPlatform(vec3 p){
      if(uReview>.5 && uReview<1.5) return vec2(99.,0.);
      vec2 r=vec2(99.,0.); vec3 q=p-vec3(.06,-1.22,-.08); float d;
      q.xz=rot(-.08)*q.xz;
      d=sdCylinder(q,vec2(1.18,.055)); r=opU(r,vec2(d,6.2));
      q.y+=.095; d=sdCylinder(q,vec2(.91,.035)); r=opU(r,vec2(d,6.35));
      q.y+=.064; d=abs(sdTorus(q,vec2(.74,.022)))-.008; r=opU(r,vec2(d,5.18));
      return r;
    }

    vec2 mapBrand(vec3 p){
      vec3 q=outerSpace(p); vec2 r=vec2(99.,0.);
      vec3 c=vec3(.31,.79,.284); float d;
      d=sdCapsule(q,c+vec3(-.072,-.034,0.),c+vec3(0.,-.075,0.),.008); r=opU(r,vec2(d,7.0));
      d=sdCapsule(q,c+vec3(0.,-.075,0.),c+vec3(.072,-.034,0.),.008); r=opU(r,vec2(d,7.0));
      d=sdCapsule(q,c+vec3(.072,-.034,0.),c+vec3(.072,.045,0.),.008); r=opU(r,vec2(d,7.0));
      d=sdCapsule(q,c+vec3(.072,.045,0.),c+vec3(0.,.084,0.),.008); r=opU(r,vec2(d,7.0));
      d=sdCapsule(q,c+vec3(0.,.084,0.),c+vec3(-.072,.045,0.),.008); r=opU(r,vec2(d,7.0));
      d=sdCapsule(q,c+vec3(-.072,.045,0.),c+vec3(-.072,-.034,0.),.008); r=opU(r,vec2(d,7.0));
      d=sdCapsule(q,c+vec3(-.072,.045,0.),c+vec3(0.,.004,0.),.006); r=opU(r,vec2(d,7.0));
      d=sdCapsule(q,c+vec3(.072,.045,0.),c+vec3(0.,.004,0.),.006); r=opU(r,vec2(d,7.0));
      d=sdCapsule(q,c+vec3(0.,-.075,0.),c+vec3(0.,.004,0.),.006); r=opU(r,vec2(d,7.0));
      return r;
    }

    vec2 mapScene(vec3 p){
      vec2 r=mapOuter(p);
      r=opU(r,mapInner(p));
      r=opU(r,mapBrand(p));
      r=opU(r,mapOptical(p));
      r=opU(r,mapPlatform(p));
      return r;
    }

    vec3 normalAt(vec3 p){
      vec2 e=vec2(.0017,0.);
      float d=mapScene(p).x;
      return normalize(vec3(mapScene(p+e.xyy).x-d,mapScene(p+e.yxy).x-d,mapScene(p+e.yyx).x-d));
    }
    float calcAO(vec3 p, vec3 n){
      float occ=0., sca=1.;
      for(int i=0;i<4;i++){ float h=.035+.065*float(i); float d=mapScene(p+n*h).x; occ+=(h-d)*sca; sca*=.62; }
      return clamp(1.-occ*1.35,0.,1.);
    }
    float softShadow(vec3 ro, vec3 rd){
      float res=1., t=.05;
      for(int i=0;i<12;i++){ float h=mapScene(ro+rd*t).x; res=min(res,10.*h/t); t+=clamp(h,.025,.17); if(h<.001||t>4.2)break; }
      return clamp(res,.18,1.);
    }
    vec3 env(vec3 r){
      float up=sat(r.y*.5+.5);
      vec3 e=mix(vec3(.012,.016,.018),vec3(.075,.089,.093),up);
      float strip=pow(sat(dot(r,normalize(vec3(-.55,.58,.60)))),18.);
      float strip2=pow(sat(dot(r,normalize(vec3(.74,.20,.64)))),28.);
      e+=vec3(.58,.67,.69)*strip*.42+vec3(.18,.42,.48)*strip2*.28;
      return e;
    }
    vec3 materialBase(float id){
      if(id<1.1)return vec3(.055,.070,.076);
      if(id<1.9)return vec3(.075,.092,.098);
      if(id<2.2)return vec3(.035,.047,.052);
      if(id<2.8)return vec3(.095,.116,.122);
      if(id<3.5)return vec3(.052,.071,.078);
      if(id<4.0)return vec3(.025,.043,.050);
      if(id<4.5)return vec3(.047,.077,.086);
      if(id<5.3)return vec3(.035,.32,.385);
      if(id<6.0)return vec3(.07,.48,.57);
      if(id<6.5)return vec3(.025,.035,.038);
      return vec3(.38,.46,.48);
    }
    float roughness(float id){
      if(id>4.5&&id<6.)return .18;
      if(id>6.8)return .24;
      if(id>3.4&&id<4.)return .12;
      if(id>2.8&&id<3.5)return .28;
      return .34;
    }
    vec3 shade(vec3 p, vec3 n, vec3 rd, float id){
      vec3 base=materialBase(id);
      float rough=roughness(id);
      vec3 V=-rd;
      vec3 L=normalize(vec3(-2.8,4.2,3.7)-p);
      vec3 L2=normalize(vec3(3.0,1.2,2.2)-p);
      vec3 cyanL=normalize(vec3(-2.2,.1,1.0)-p);
      float ndl=max(dot(n,L),0.);
      float ndl2=max(dot(n,L2),0.);
      float sh=uQuality>.72?softShadow(p+n*.012,L):1.;
      float ao=calcAO(p,n);
      vec3 H=normalize(L+V);
      float spec=pow(max(dot(n,H),0.),mix(72.,20.,rough))*mix(.9,.42,rough)*sh;
      vec3 H2=normalize(L2+V);
      float spec2=pow(max(dot(n,H2),0.),mix(52.,16.,rough))*mix(.65,.28,rough);
      float fres=pow(1.-max(dot(n,V),0.),5.);
      vec3 refl=env(reflect(-V,n));
      float metal = id<3.0 || id>6.8 ? .88 : .62;
      vec3 col=base*(.13+.70*ndl*sh+.18*ndl2)*ao;
      col += refl*(.20+.40*metal)*(1.-rough*.45);
      col += vec3(.86,.92,.93)*spec*.78 + vec3(.36,.58,.62)*spec2*.42;
      col += vec3(.11,.58,.68)*pow(max(dot(n,cyanL),0.),2.)*.12;
      col += vec3(.22,.50,.57)*fres*.24;
      if(id>3.45&&id<4.05){ col=mix(col,env(reflect(rd,n))*.82+vec3(.018,.052,.064),.48); col+=vec3(.16,.44,.50)*fres*.23; }
      if(id>4.5&&id<6.05){ float em=.58+.30*sin(uTime*1.1+id*2.); col+=vec3(.12,.78,.92)*(1.0+em*.32); }
      if(id>6.8){ col+=vec3(.31,.42,.44)*spec*1.2; }
      return col;
    }

    void main(){
      vec2 frag=gl_FragCoord.xy;
      vec2 uv=(frag*2.-uResolution.xy)/uResolution.y;
      float aspect=uResolution.x/uResolution.y;
      float mobile=smoothstep(1.05,1.35,aspect);
      uv.x += mix(.00,.06,mobile);
      vec3 ro=vec3(.14,.08,4.65);
      vec3 ta=vec3(.04,-.06,0.);
      vec3 ww=normalize(ta-ro), uu=normalize(cross(ww,vec3(0.,1.,0.))), vv=cross(uu,ww);
      float focal=mix(1.72,1.84,mobile);
      vec3 rd=normalize(uu*uv.x+vv*uv.y+ww*focal);

      vec3 bg=mix(vec3(.004,.006,.007),vec3(.010,.016,.019),sat(uv.y*.28+.58));
      float aura=exp(-2.15*dot(uv-vec2(.055,.015),uv-vec2(.055,.015)));
      float lower=exp(-8.0*dot(uv-vec2(.055,-.62),uv-vec2(.055,-.62)));
      bg+=vec3(.014,.095,.115)*aura*.78+vec3(.012,.075,.090)*lower*.42;
      float vign=1.-.26*sat(dot(uv,uv)*.36); bg*=vign;

      float t=0., id=0.; bool hit=false; vec3 p=ro;
      int maxSteps = uQuality>.72 ? 88 : 68;
      for(int i=0;i<96;i++){
        if(i>=maxSteps) break;
        p=ro+rd*t;
        vec2 h=mapScene(p);
        if(h.x<.0016){ hit=true; id=h.y; break; }
        t+=max(h.x*.78,.006);
        if(t>8.5)break;
      }
      vec3 col=bg;
      if(hit){
        vec3 n=normalAt(p);
        col=shade(p,n,rd,id);
        float fog=sat((t-3.0)/5.0); col=mix(col,bg,fog*.28);
        float edge=pow(1.-max(dot(n,-rd),0.),3.2);
        if(id>4.4&&id<6.1) col+=vec3(.08,.58,.70)*edge*.65;
      }

      float rayNear=length(cross(ro,rd))/max(length(rd),.001);
      float centerGlow=exp(-rayNear*rayNear*3.6);
      col+=vec3(.008,.055,.067)*centerGlow*(.22+.10*sin(uTime*.55));
      float grain=(hash21(frag+floor(uTime*12.0))-.5)*.011;
      col+=grain;
      col=col/(col+vec3(.78));
      col=pow(max(col,0.),vec3(.88));
      outColor=vec4(col,1.);
    }
  `;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      console.error('Premium Core 3 shader compile failed:', info);
      throw new Error(info || 'shader compile failed');
    }
    return shader;
  }

  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'program link failed');
  } catch (error) {
    console.error(error);
    root.classList.add('hero-core2--fallback');
    return;
  }

  gl.useProgram(program);
  const loc = name => gl.getUniformLocation(program, name);
  const uniforms = {
    resolution: loc('uResolution'), pointer: loc('uPointer'), time: loc('uTime'), stage: loc('uStage'), motion: loc('uMotion'), quality: loc('uQuality'), review: loc('uReview')
  };
  const vao = gl.createVertexArray(); gl.bindVertexArray(vao);

  let quality = 1;
  function resize() {
    const rect = canvas.getBoundingClientRect();
    const area = rect.width * rect.height;
    const baseScale = area > 700000 ? .72 : area > 320000 ? .78 : .86;
    const dpr = Math.min(devicePixelRatio || 1, 1.25);
    const scale = Math.min(1, baseScale * dpr);
    const w = Math.max(2, Math.round(rect.width * scale));
    const h = Math.max(2, Math.round(rect.height * scale));
    if (canvas.width !== w || canvas.height !== h) { canvas.width=w; canvas.height=h; gl.viewport(0,0,w,h); }
    quality = Math.min(1, Math.max(.58, 1000000 / Math.max(w*h,1)));
    if (innerWidth >= 1000) quality = Math.max(quality,.78);
  }
  new ResizeObserver(resize).observe(canvas); resize();

  const observer = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? true; }, { rootMargin: '100px' });
  observer.observe(visual);

  function updateSignalOverlay(time) {
    signalPulses.forEach((pulse, i) => {
      const path = signalPaths[i];
      if (!path) return;
      const length = path.getTotalLength();
      let phase = (time * (.075 + i*.006) + i*.21) % 1;
      if (i >= 2) phase = 1 - phase;
      const pt = path.getPointAtLength(length * phase);
      pulse.setAttribute('cx', pt.x.toFixed(2)); pulse.setAttribute('cy', pt.y.toFixed(2));
      const active = i === activeStage;
      pulse.setAttribute('r', active ? '4.5' : '2.7');
      pulse.style.opacity = active ? '1' : '.48';
    });
  }

  function render(now) {
    requestAnimationFrame(render);
    if (!visible || document.hidden) return;
    const dt=Math.min(.05,Math.max(.001,(now-lastFrame)/1000)); lastFrame=now;
    pointer[0]+=(pointerTarget[0]-pointer[0])*(1-Math.exp(-dt*3.0));
    pointer[1]+=(pointerTarget[1]-pointer[1])*(1-Math.exp(-dt*3.0));
    stageVisual+=(activeStage-stageVisual)*(1-Math.exp(-dt*2.2));

    let time;
    if (fixedTime !== null) time=fixedTime;
    else if (captureFrozen) time=frozenTime;
    else time=elapsedBeforeFreeze+(now-startTime)/1000;
    if (motionReduced) time=18.0;

    resize();
    gl.useProgram(program);
    gl.uniform2f(uniforms.resolution,canvas.width,canvas.height);
    gl.uniform2f(uniforms.pointer,pointer[0],pointer[1]);
    gl.uniform1f(uniforms.time,time);
    gl.uniform1f(uniforms.stage,stageVisual);
    gl.uniform1f(uniforms.motion,motionReduced?0:1);
    gl.uniform1f(uniforms.quality,quality);
    gl.uniform1f(uniforms.review,reviewMode==='core'?1:reviewMode==='materials'?2:0);
    gl.drawArrays(gl.TRIANGLES,0,3);
    updateSignalOverlay(time);
    if (!root.classList.contains('hero-core2--ready')) root.classList.add('hero-core2--ready');
  }
  requestAnimationFrame(render);

  window.addEventListener('hero-core2:capture-freeze', event => {
    const freeze = event.detail !== false;
    if (freeze === captureFrozen || fixedTime !== null) return;
    if (freeze) {
      elapsedBeforeFreeze += (performance.now()-startTime)/1000;
      frozenTime=elapsedBeforeFreeze;
      captureFrozen=true;
      root.classList.add('hero-core3--capture-freeze');
    } else {
      startTime=performance.now(); captureFrozen=false;
      root.classList.remove('hero-core3--capture-freeze');
    }
  });

  reducedMotionQuery.addEventListener?.('change', event => {
    motionReduced=event.matches;
    if (motionReduced) setActiveStage(3);
    scheduleNarrative();
  });

  document.addEventListener('visibilitychange', () => { lastFrame=performance.now(); });
  window.__heroCore3Debug = {
    setStage: i => setActiveStage(i,true),
    getState: () => ({ activeStage, stageVisual, motionReduced, reviewMode, quality, canvas: [canvas.width,canvas.height] })
  };
})();
