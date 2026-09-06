(function(){
  'use strict';
  const core=window.__TAV4_CORE;
  if(!core)return;
  const {clamp,mix,smooth,sub,add,mul,perspective,lookAt,multiply,transform4,faceBasis,constraints,finalGeometry,boxGeometry,boxEdges,anchors}=core;
  const sections=Array.from(document.querySelectorAll('[data-tav4]'));
  if(!sections.length)return;
  const reducedQuery=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
  const fineQuery=window.matchMedia?window.matchMedia('(hover:hover) and (pointer:fine)'):null;
  const renderCore=window.__TAV4_RENDER;
  if(!renderCore)return;
  const {createProgram,makeBuffer,makeDynamicBuffer}=renderCore;

  function install(section){
    const visual=section.querySelector('[data-tav4-visual]');
    const canvas=section.querySelector('[data-tav4-canvas]');
    const controls=Array.from(section.querySelectorAll('[data-family]'));
    const reduced=!!(reducedQuery&&reducedQuery.matches);
    const REVEAL_MS=4250;
    let gl=null,program=null,webgl=false,loc=null;
    let finalPos=null,finalNor=null,boxPos=null,boxNor=null,edgePos=null,edgeNor=null,planePos=null,planeNor=null,planeEdgePos=null,planeEdgeNor=null;
    let vp=null,camera=[6.2,3.55,11.2],focus=[0,0,.65],focusIntensity=0;
    let animating=false,startTime=0,observer=null,rafId=0,completionTimer=0,nearTimer=0,lastW=0,lastH=0,failed=false;

    function setRuntime(state,error){
      section.dataset.tav4Runtime=state;
      if(error)section.dataset.tav4Error=String(error&&error.message?error.message:error).slice(0,180);
      else delete section.dataset.tav4Error;
    }
    function disconnectStartWatchers(){
      if(observer){observer.disconnect();observer=null;}
      if(nearTimer){clearTimeout(nearTimer);nearTimer=0;}
      window.removeEventListener('scroll',guardStart);
    }
    function activateFallback(error){
      if(failed)return;
      failed=true;webgl=false;animating=false;
      if(rafId){cancelAnimationFrame(rafId);rafId=0;}
      if(completionTimer){clearTimeout(completionTimer);completionTimer=0;}
      disconnectStartWatchers();
      section.classList.remove('is-webgl');
      section.dataset.webgl='fallback';
      section.classList.add('is-constraining','is-capabilities','is-vendors','is-resolved');
      section.dataset.tav4Played='true';section.dataset.tav4Resolved='true';
      setRuntime('fallback-error',error||'WebGL fallback');
      if(error&&window.console&&console.error)console.error('[TAV4] fallback:',error);
    }
    function setActive(family){
      if(family)visual.dataset.active=family;else delete visual.dataset.active;
      controls.forEach(c=>c.setAttribute('aria-pressed',c.dataset.family===family?'true':'false'));
      if(family){focus=anchors[family].slice();focusIntensity=.72;}else{focus=[0,0,.65];focusIntensity=0;}
      if(webgl)safeRender(1,'interaction');
    }
    controls.forEach(control=>{
      const family=control.dataset.family;
      control.addEventListener('pointerenter',()=>{if(fineQuery&&fineQuery.matches)setActive(family);},{passive:true});
      control.addEventListener('pointerleave',()=>{if(fineQuery&&fineQuery.matches&&!control.matches(':focus-visible'))setActive(null);},{passive:true});
      control.addEventListener('focus',()=>{if((fineQuery&&fineQuery.matches)||control.matches(':focus-visible'))setActive(family);});
      control.addEventListener('blur',()=>{if(fineQuery&&fineQuery.matches)setActive(null);});
      control.addEventListener('click',()=>{if(fineQuery&&fineQuery.matches)return;setActive(control.getAttribute('aria-pressed')==='true'?null:family);});
    });
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();activateFallback(new Error('WebGL context lost'));},false);

    function bind(posBuf,norBuf){
      gl.bindBuffer(gl.ARRAY_BUFFER,posBuf);gl.enableVertexAttribArray(loc.pos);gl.vertexAttribPointer(loc.pos,3,gl.FLOAT,false,0,0);
      gl.bindBuffer(gl.ARRAY_BUFFER,norBuf);gl.enableVertexAttribArray(loc.normal);gl.vertexAttribPointer(loc.normal,3,gl.FLOAT,false,0,0);
    }
    function material(color,opacity,useClip,useLighting,rim){
      gl.uniform3fv(loc.color,color);gl.uniform1f(loc.opacity,opacity);gl.uniform1f(loc.useClip,useClip?1:0);gl.uniform1f(loc.useLighting,useLighting?1:0);gl.uniform1f(loc.rim,rim||0);
      gl.uniform3fv(loc.lightDir,[.38,.78,.52]);gl.uniform3fv(loc.camera,camera);gl.uniform3fv(loc.focusPos,focus);gl.uniform1f(loc.focusIntensity,focusIntensity);
    }
    function targetClipArray(offsets){
      const a=[];constraints.forEach((pl,i)=>a.push(pl.n[0],pl.n[1],pl.n[2],pl.c+offsets[i]));return new Float32Array(a);
    }
    function planeGeometry(offsets){
      const p=[],n=[],e=[],en=[];
      constraints.forEach((pl,i)=>{
        const center=sub(pl.point,mul(pl.n,offsets[i]));const [u,v]=faceBasis(pl.n),su=4.0,sv=2.7;
        const q=[add(add(center,mul(u,-su)),mul(v,-sv)),add(add(center,mul(u,su)),mul(v,-sv)),add(add(center,mul(u,su)),mul(v,sv)),add(add(center,mul(u,-su)),mul(v,sv))];
        [[0,1,2],[0,2,3]].forEach(t=>t.forEach(j=>{p.push(...q[j]);n.push(...pl.n);}));
        [[0,1],[1,2],[2,3],[3,0]].forEach(pair=>pair.forEach(j=>{e.push(...q[j]);en.push(0,0,0);}));
      });
      gl.bindBuffer(gl.ARRAY_BUFFER,planePos);gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(p));
      gl.bindBuffer(gl.ARRAY_BUFFER,planeNor);gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(n));
      gl.bindBuffer(gl.ARRAY_BUFFER,planeEdgePos);gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(e));
      gl.bindBuffer(gl.ARRAY_BUFFER,planeEdgeNor);gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(en));
      return {triCount:p.length/3,lineCount:e.length/3};
    }
    function resize(){
      const rect=canvas.getBoundingClientRect();const dpr=Math.min(window.devicePixelRatio||1,rect.width<700?1.35:1.5);
      const w=Math.max(2,Math.round(rect.width*dpr)),h=Math.max(2,Math.round(rect.height*dpr));
      if(w!==lastW||h!==lastH){canvas.width=w;canvas.height=h;lastW=w;lastH=h;gl.viewport(0,0,w,h);}
      const aspect=w/h;
      if(rect.width<520)camera=[4.45,2.35,11.8];else if(rect.height<340&&rect.width>500)camera=[5.8,2.85,11.4];else camera=[6.2,3.55,11.2];
      vp=multiply(perspective(31*Math.PI/180,aspect,.1,50),lookAt(camera,[0,0,0],[0,1,0]));
      gl.uniformMatrix4fv(loc.vp,false,new Float32Array(vp));projectAnchors();
    }
    function projectAnchors(){
      if(!vp)return;
      controls.forEach(c=>{const a=anchors[c.dataset.anchor];if(!a)return;const clip=transform4(vp,[a[0],a[1],a[2],1]);if(Math.abs(clip[3])<1e-4)return;
        c.style.left=((clip[0]/clip[3]*.5+.5)*100).toFixed(2)+'%';c.style.top=((-clip[1]/clip[3]*.5+.5)*100).toFixed(2)+'%';});
    }
    function render(progress){
      resize();const p=progress==null?1:progress;const baseMotion=smooth((p-.10)/.50);
      const offsets=constraints.map((_,i)=>3.45*(1-smooth(clamp(baseMotion*1.08-i*.035,0,1))));
      const finalOpacity=smooth((p-.56)/.22),ghostOpacity=mix(.30,.045,smooth((p-.52)/.30));
      const planeOpacity=p<.1?.09:mix(.10,.17,smooth((p-.12)/.40)),planeRest=p>.84?mix(planeOpacity,.095,smooth((p-.84)/.16)):planeOpacity;
      const pg=planeGeometry(offsets);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform4fv(loc.clip,targetClipArray(offsets));
      gl.depthMask(false);
      bind(planePos,planeNor);material([.40,.46,.51],planeRest,false,false,0);gl.drawArrays(gl.TRIANGLES,0,pg.triCount);
      bind(planeEdgePos,planeEdgeNor);material([.69,.74,.78],Math.min(.24,planeRest*2.05),false,false,0);gl.drawArrays(gl.LINES,0,pg.lineCount);
      bind(boxPos,boxNor);material([.19,.22,.25],ghostOpacity,true,true,.24);gl.drawArrays(gl.TRIANGLES,0,boxGeometry.positions.length/3);
      bind(edgePos,edgeNor);material([.60,.66,.70],mix(.23,.105,smooth((p-.68)/.24)),true,false,0);gl.drawArrays(gl.LINES,0,boxEdges.length/3);
      gl.depthMask(true);
      if(finalOpacity>.001){bind(finalPos,finalNor);material([.205,.220,.235],Math.min(.98,finalOpacity*.98),false,true,.50);gl.drawArrays(gl.TRIANGLES,0,finalGeometry.positions.length/3);}
    }
    function safeRender(progress,phase){
      if(!webgl||!gl||failed)return false;
      try{
        if(gl.isContextLost&&gl.isContextLost())throw new Error('WebGL context lost before '+phase);
        render(progress);
        const err=gl.getError();if(err!==gl.NO_ERROR)throw new Error('WebGL error '+err+' during '+phase);
        return true;
      }catch(error){activateFallback(error);return false;}
    }
    function viewportMetrics(){
      const rect=visual.getBoundingClientRect(),vh=window.innerHeight||document.documentElement.clientHeight||0,vw=window.innerWidth||document.documentElement.clientWidth||0;
      const visibleY=Math.max(0,Math.min(rect.bottom,vh)-Math.max(rect.top,0)),visibleX=Math.max(0,Math.min(rect.right,vw)-Math.max(rect.left,0));
      return {rect,vh,vw,visibleY,visibleX};
    }
    function clearlyVisible(){const m=viewportMetrics(),needY=Math.min(140,Math.max(72,m.rect.height*.18)),needX=Math.min(160,Math.max(100,m.rect.width*.18));return m.visibleY>=needY&&m.visibleX>=needX;}
    function nearViewport(){const m=viewportMetrics(),margin=Math.max(80,Math.min(170,m.vh*.16));return m.rect.bottom>=-margin&&m.rect.top<=m.vh+margin&&m.rect.right>=0&&m.rect.left<=m.vw;}
    function finish(){
      if(failed)return;
      if(section.dataset.tav4Resolved==='true'){if(webgl)safeRender(1,'resolved-refresh');return;}
      animating=false;section.dataset.tav4Resolved='true';
      if(rafId){cancelAnimationFrame(rafId);rafId=0;}if(completionTimer){clearTimeout(completionTimer);completionTimer=0;}
      disconnectStartWatchers();section.classList.add('is-constraining','is-capabilities','is-vendors','is-resolved');
      if(webgl&&!safeRender(1,'finish'))return;setRuntime('resolved');
    }
    function scheduleTick(){if(!rafId&&animating&&!failed)rafId=requestAnimationFrame(tick);}
    function tick(now){
      rafId=0;if(!animating||failed)return;const p=clamp((now-startTime)/REVEAL_MS,0,1);
      if(p>.10)section.classList.add('is-constraining');if(p>.76)section.classList.add('is-capabilities');if(p>.87)section.classList.add('is-vendors');if(p>.94)section.classList.add('is-resolved');
      if(!safeRender(p,'animation'))return;if(p<1)scheduleTick();else finish();
    }
    function start(){
      if(failed||animating||section.dataset.tav4Played==='true')return;section.dataset.tav4Played='true';disconnectStartWatchers();
      if(reduced){finish();return;}animating=true;setRuntime('animating');startTime=performance.now();completionTimer=setTimeout(finish,REVEAL_MS+900);scheduleTick();
    }
    function guardStart(){
      if(failed||section.dataset.tav4Played==='true')return;if(clearlyVisible()){start();return;}
      if(nearViewport()&&!nearTimer)nearTimer=setTimeout(()=>{nearTimer=0;if(!failed&&section.dataset.tav4Played!=='true'&&nearViewport())start();},650);
    }
    function syncRuntime(){
      if(failed)return;
      if(section.dataset.tav4Resolved==='true'){if(webgl)safeRender(1,'resume-resolved');return;}
      if(section.dataset.tav4Played!=='true'){guardStart();return;}if(reduced){finish();return;}
      const elapsed=performance.now()-startTime;if(elapsed>=REVEAL_MS){finish();return;}
      animating=true;if(!safeRender(clamp(elapsed/REVEAL_MS,0,1),'resume-animation'))return;scheduleTick();
    }
    function renderCurrentState(){
      if(!webgl||failed)return;
      if(section.dataset.tav4Resolved==='true'){safeRender(1,'resize-resolved');return;}
      if(animating){safeRender(clamp((performance.now()-startTime)/REVEAL_MS,0,1),'resize-animation');return;}
      safeRender(0,'resize-initial');
    }

    setRuntime('boot');
    try{
      gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true,powerPreference:'high-performance',preserveDrawingBuffer:true});
      if(!gl)throw new Error('WebGL unavailable');setRuntime('context-ready');
      program=createProgram(gl);gl.useProgram(program);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(0,0,0,0);
      loc={pos:gl.getAttribLocation(program,'aPosition'),normal:gl.getAttribLocation(program,'aNormal'),vp:gl.getUniformLocation(program,'uVP'),color:gl.getUniformLocation(program,'uColor'),opacity:gl.getUniformLocation(program,'uOpacity'),useClip:gl.getUniformLocation(program,'uUseClip'),useLighting:gl.getUniformLocation(program,'uUseLighting'),rim:gl.getUniformLocation(program,'uRim'),lightDir:gl.getUniformLocation(program,'uLightDir'),camera:gl.getUniformLocation(program,'uCameraPos'),focusPos:gl.getUniformLocation(program,'uFocusPos'),focusIntensity:gl.getUniformLocation(program,'uFocusIntensity'),clip:gl.getUniformLocation(program,'uClipPlanes[0]')};
      finalPos=makeBuffer(gl,finalGeometry.positions);finalNor=makeBuffer(gl,finalGeometry.normals);boxPos=makeBuffer(gl,boxGeometry.positions);boxNor=makeBuffer(gl,boxGeometry.normals);edgePos=makeBuffer(gl,boxEdges);
      edgeNor=makeBuffer(gl,new Float32Array(Math.max(boxEdges.length,24)));planePos=makeDynamicBuffer(gl,4*6*3*4);planeNor=makeDynamicBuffer(gl,4*6*3*4);planeEdgePos=makeDynamicBuffer(gl,4*8*3*4);planeEdgeNor=makeDynamicBuffer(gl,4*8*3*4);
      setRuntime('buffers-ready');webgl=true;
      if(!safeRender(0,'first-frame'))return;
      section.classList.add('is-webgl');section.dataset.webgl='frame-ready';setRuntime('first-frame');
    }catch(error){activateFallback(error);return;}

    window.addEventListener('resize',()=>{renderCurrentState();guardStart();},{passive:true});
    window.addEventListener('pageshow',syncRuntime,{passive:true});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncRuntime();},{passive:true});
    if(reduced)finish();
    else if('IntersectionObserver' in window){
      observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting&&(entry.intersectionRatio>=.16||clearlyVisible()))start();}),{rootMargin:'8% 0px 8% 0px',threshold:[0,.08,.16,.28,.42]});
      observer.observe(visual);window.addEventListener('scroll',guardStart,{passive:true});requestAnimationFrame(guardStart);setTimeout(guardStart,800);
    }else requestAnimationFrame(()=>start());
  }
  sections.forEach(install);
})();
