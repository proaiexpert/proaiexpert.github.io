(function(){
  'use strict';
  const core=window.__TAV46_CORE,renderCore=window.__TAV46_RENDER;
  if(!core||!renderCore)return;
  const {clamp,mix,smooth,sub,add,mul,perspective,lookAt,multiply,transform4,faceBasis,constraints,finalGeometry,boxGeometry,boxEdges,floorGeometry,anchors,zoneIndex,D}=core;
  const {createProgram,makeBuffer,makeDynamicBuffer}=renderCore;
  const sections=Array.from(document.querySelectorAll('[data-tav46]'));
  if(!sections.length)return;
  const reducedQuery=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
  const fineQuery=window.matchMedia?window.matchMedia('(hover:hover) and (pointer:fine)'):null;

  function install(section){
    const visual=section.querySelector('[data-tav46-visual]');
    const canvas=section.querySelector('[data-tav46-canvas]');
    const controls=Array.from(section.querySelectorAll('[data-family]'));
    const cutLabels=Array.from(section.querySelectorAll('[data-cut-anchor]'));
    const resolvedLabel=section.querySelector('[data-resolved-anchor]');
    const reduced=!!(reducedQuery&&reducedQuery.matches);
    const REVEAL_MS=4200;

    let gl=null,program=null,loc=null,webgl=false,failed=false;
    let vp=null,camera=[6.9,4.15,10.7],target=[0,-.05,0],focus=[0,0,D/2],focusIntensity=0,activeZone=0;
    let animating=false,startTime=0,observer=null,rafId=0,completionTimer=0,nearTimer=0,lastW=0,lastH=0;
    let finalPos,finalNor,finalEdgePos,finalEdgeNor,constraintEdgePos,constraintEdgeNor,boxPos,boxNor,boxEdgePos,boxEdgeNor,floorPos,floorNor;
    let planePos,planeNor,planeEdgePos,planeEdgeNor;

    function setRuntime(state,error){
      section.dataset.tav46Runtime=state;
      if(error)section.dataset.tav46Error=String(error&&error.message?error.message:error).slice(0,180);
      else delete section.dataset.tav46Error;
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
      section.dataset.tav46Played='true';section.dataset.tav46Resolved='true';
      section.classList.add('is-constraining','is-body','is-capabilities','is-vendors','is-resolved');
      setRuntime('fallback-error',error||'WebGL fallback');
      if(error&&window.console&&console.error)console.error('[TAV46] fallback:',error);
    }

    function bind(posBuf,norBuf){
      gl.bindBuffer(gl.ARRAY_BUFFER,posBuf);gl.enableVertexAttribArray(loc.pos);gl.vertexAttribPointer(loc.pos,3,gl.FLOAT,false,0,0);
      gl.bindBuffer(gl.ARRAY_BUFFER,norBuf);gl.enableVertexAttribArray(loc.normal);gl.vertexAttribPointer(loc.normal,3,gl.FLOAT,false,0,0);
    }
    function material(color,opacity,opts){
      const o=opts||{};
      gl.uniform3fv(loc.color,color);gl.uniform1f(loc.opacity,opacity);
      gl.uniform1f(loc.useClip,o.clip?1:0);gl.uniform1f(loc.useLighting,o.lighting?1:0);gl.uniform1f(loc.useZones,o.zones?1:0);
      gl.uniform1f(loc.activeZone,activeZone);gl.uniform1f(loc.rim,o.rim||0);gl.uniform1f(loc.shadowMode,o.shadow?1:0);
      gl.uniform3fv(loc.lightDir,[.42,.76,.49]);gl.uniform3fv(loc.camera,camera);gl.uniform3fv(loc.focusPos,focus);gl.uniform1f(loc.focusIntensity,focusIntensity);
    }
    function setActive(family){
      if(family)visual.dataset.active=family;else delete visual.dataset.active;
      controls.forEach(c=>c.setAttribute('aria-pressed',c.dataset.family===family?'true':'false'));
      if(family&&anchors[family]){focus=anchors[family].slice();focusIntensity=.82;activeZone=zoneIndex[family]||0;}
      else{focus=[0,0,D/2];focusIntensity=0;activeZone=0;}
      if(webgl)safeRender(1,'interaction');
    }
    controls.forEach(control=>{
      const family=control.dataset.family;
      control.addEventListener('pointerenter',()=>{if(fineQuery&&fineQuery.matches)setActive(family);},{passive:true});
      control.addEventListener('pointerleave',()=>{if(fineQuery&&fineQuery.matches&&!control.matches(':focus-visible'))setActive(null);},{passive:true});
      control.addEventListener('focus',()=>setActive(family));
      control.addEventListener('blur',()=>{if(fineQuery&&fineQuery.matches)setActive(null);});
      control.addEventListener('click',()=>{if(fineQuery&&fineQuery.matches)return;setActive(control.getAttribute('aria-pressed')==='true'?null:family);});
    });

    function targetClipArray(offsets){
      const out=[];constraints.forEach((pl,i)=>out.push(pl.n[0],pl.n[1],pl.n[2],pl.c+offsets[i]));return new Float32Array(out);
    }
    function planeGeometry(offsets){
      const p=[],n=[],e=[],en=[];
      constraints.forEach((pl,i)=>{
        const center=sub(pl.point,mul(pl.n,offsets[i]));
        const basis=faceBasis(pl.n),u=basis[0],v=basis[1],su=3.65,sv=2.35;
        const q=[
          add(add(center,mul(u,-su)),mul(v,-sv)),add(add(center,mul(u,su)),mul(v,-sv)),
          add(add(center,mul(u,su)),mul(v,sv)),add(add(center,mul(u,-su)),mul(v,sv))
        ];
        [[0,1,2],[0,2,3]].forEach(t=>t.forEach(j=>{p.push(...q[j]);n.push(...pl.n);}));
        [[0,1],[1,2],[2,3],[3,0]].forEach(pair=>pair.forEach(j=>{e.push(...q[j]);en.push(0,0,0);}));
      });
      gl.bindBuffer(gl.ARRAY_BUFFER,planePos);gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(p));
      gl.bindBuffer(gl.ARRAY_BUFFER,planeNor);gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(n));
      gl.bindBuffer(gl.ARRAY_BUFFER,planeEdgePos);gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(e));
      gl.bindBuffer(gl.ARRAY_BUFFER,planeEdgeNor);gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(en));
      return{triCount:p.length/3,lineCount:e.length/3};
    }

    function projectPoint(point){
      if(!vp)return null;
      const clip=transform4(vp,[point[0],point[1],point[2],1]);if(Math.abs(clip[3])<1e-5)return null;
      return{x:(clip[0]/clip[3]*.5+.5)*100,y:(-clip[1]/clip[3]*.5+.5)*100,w:clip[3]};
    }
    function setProjectedElement(el,point,tangent){
      const a=projectPoint(point);if(!a)return;
      el.style.left=a.x.toFixed(2)+'%';el.style.top=a.y.toFixed(2)+'%';
      if(tangent){
        const b=projectPoint(add(point,mul(tangent,.55)));
        if(b){const dx=b.x-a.x,dy=b.y-a.y;el.style.setProperty('--surface-angle',(Math.atan2(dy,dx)*180/Math.PI).toFixed(2)+'deg');}
      }
    }
    function projectAnchors(){
      controls.forEach(el=>setProjectedElement(el,anchors[el.dataset.anchor],[1,0,0]));
      cutLabels.forEach(el=>{
        const name=el.dataset.cutAnchor;
        const point=finalGeometry.constraintFrontAnchors[name]||finalGeometry.faceCenters[name];
        const tangent=finalGeometry.constraintFrontTangents[name]||(constraints.find(c=>c.name===name)?faceBasis(constraints.find(c=>c.name===name).n)[0]:[1,0,0]);
        if(point)setProjectedElement(el,point,tangent);
      });
      if(resolvedLabel)setProjectedElement(resolvedLabel,[1.18,-1.27,D/2+.018],[1,0,0]);
    }
    function resize(){
      const rect=canvas.getBoundingClientRect();
      const dpr=Math.min(window.devicePixelRatio||1,rect.width<700?1.28:1.48);
      const w=Math.max(2,Math.round(rect.width*dpr)),h=Math.max(2,Math.round(rect.height*dpr));
      if(w!==lastW||h!==lastH){canvas.width=w;canvas.height=h;lastW=w;lastH=h;gl.viewport(0,0,w,h);}
      const aspect=w/h;let fov=32;
      if(rect.width<520){camera=[5.45,4.35,10.55];target=[0,-.08,0];fov=35;}
      else if(rect.height<310&&rect.width>520){camera=[6.45,3.45,10.35];target=[.02,-.08,0];fov=34;}
      else if(rect.width<920){camera=[6.05,3.95,10.65];target=[0,-.06,0];fov=33;}
      else{camera=[6.90,4.15,10.70];target=[0,-.05,0];fov=32;}
      vp=multiply(perspective(fov*Math.PI/180,aspect,.1,50),lookAt(camera,target,[0,1,0]));
      gl.uniformMatrix4fv(loc.vp,false,new Float32Array(vp));projectAnchors();
    }

    function render(progress){
      resize();
      const p=progress==null?1:progress;
      const move=smooth((p-.07)/.50);
      const offsets=constraints.map((_,i)=>4.05*(1-smooth(clamp(move*1.08-i*.035,0,1))));
      const bodyOpacity=smooth((p-.46)/.29);
      const ghostOpacity=mix(.23,.014,smooth((p-.48)/.34));
      const planeIn=smooth((p-.05)/.26),planeOut=smooth((p-.72)/.23);
      const planeOpacity=.018+planeIn*.125*(1-planeOut*.88);
      const cutOpacity=mix(.045,.205,smooth((p-.48)/.31));
      const edgeOpacity=mix(.05,.095,smooth((p-.55)/.28));
      const shadowOpacity=.10+.30*bodyOpacity;
      const pg=planeGeometry(offsets);

      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.uniform4fv(loc.clip,targetClipArray(offsets));

      gl.depthMask(false);
      bind(floorPos,floorNor);material([.015,.019,.023],shadowOpacity,{shadow:true});gl.drawArrays(gl.TRIANGLES,0,floorGeometry.positions.length/3);

      bind(planePos,planeNor);material([.34,.39,.43],planeOpacity,{lighting:false});gl.drawArrays(gl.TRIANGLES,0,pg.triCount);
      bind(planeEdgePos,planeEdgeNor);material([.67,.71,.74],Math.min(.19,planeOpacity*1.65),{});gl.drawArrays(gl.LINES,0,pg.lineCount);

      bind(boxPos,boxNor);material([.17,.19,.21],ghostOpacity,{clip:true,lighting:true,rim:.16});gl.drawArrays(gl.TRIANGLES,0,boxGeometry.positions.length/3);
      bind(boxEdgePos,boxEdgeNor);material([.54,.59,.63],mix(.16,.025,smooth((p-.56)/.30)),{clip:true});gl.drawArrays(gl.LINES,0,boxEdges.length/3);

      gl.depthMask(true);
      if(bodyOpacity>.001){
        bind(finalPos,finalNor);material([.185,.198,.211],Math.min(.985,bodyOpacity*.985),{lighting:true,zones:true,rim:.34});gl.drawArrays(gl.TRIANGLES,0,finalGeometry.positions.length/3);
        gl.depthMask(false);
        bind(finalEdgePos,finalEdgeNor);material([.67,.70,.72],edgeOpacity*bodyOpacity,{});gl.drawArrays(gl.LINES,0,finalGeometry.edgePositions.length/3);
        bind(constraintEdgePos,constraintEdgeNor);material([.80,.81,.80],cutOpacity*bodyOpacity,{});gl.drawArrays(gl.LINES,0,finalGeometry.constraintEdgePositions.length/3);
      }
      gl.depthMask(true);
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
      return{rect,vh,vw,visibleY,visibleX};
    }
    function clearlyVisible(){
      const m=viewportMetrics(),needY=Math.min(130,Math.max(66,m.rect.height*.17)),needX=Math.min(150,Math.max(90,m.rect.width*.16));
      return m.visibleY>=needY&&m.visibleX>=needX;
    }
    function nearViewport(){
      const m=viewportMetrics(),margin=Math.max(90,Math.min(190,m.vh*.18));
      return m.rect.bottom>=-margin&&m.rect.top<=m.vh+margin&&m.rect.right>=0&&m.rect.left<=m.vw;
    }
    function finish(){
      if(failed)return;
      if(section.dataset.tav46Resolved==='true'){if(webgl)safeRender(1,'resolved-refresh');return;}
      animating=false;section.dataset.tav46Resolved='true';
      if(rafId){cancelAnimationFrame(rafId);rafId=0;}if(completionTimer){clearTimeout(completionTimer);completionTimer=0;}
      disconnectStartWatchers();
      section.classList.add('is-constraining','is-body','is-capabilities','is-vendors','is-resolved');
      if(webgl&&!safeRender(1,'finish'))return;setRuntime('resolved');
    }
    function scheduleTick(){if(!rafId&&animating&&!failed)rafId=requestAnimationFrame(tick);}
    function tick(now){
      rafId=0;if(!animating||failed)return;
      const p=clamp((now-startTime)/REVEAL_MS,0,1);
      if(p>.08)section.classList.add('is-constraining');
      if(p>.50)section.classList.add('is-body');
      if(p>.72)section.classList.add('is-capabilities');
      if(p>.83)section.classList.add('is-vendors');
      if(p>.93)section.classList.add('is-resolved');
      if(!safeRender(p,'animation'))return;
      if(p<1)scheduleTick();else finish();
    }
    function start(){
      if(failed||animating||section.dataset.tav46Played==='true')return;
      section.dataset.tav46Played='true';disconnectStartWatchers();
      if(reduced){finish();return;}
      animating=true;setRuntime('animating');startTime=performance.now();completionTimer=setTimeout(finish,REVEAL_MS+950);scheduleTick();
    }
    function guardStart(){
      if(failed||section.dataset.tav46Played==='true')return;
      if(clearlyVisible()){start();return;}
      if(nearViewport()&&!nearTimer)nearTimer=setTimeout(()=>{nearTimer=0;if(!failed&&section.dataset.tav46Played!=='true'&&nearViewport())start();},650);
    }
    function syncRuntime(){
      if(failed)return;
      if(section.dataset.tav46Resolved==='true'){if(webgl)safeRender(1,'resume-resolved');return;}
      if(section.dataset.tav46Played!=='true'){guardStart();return;}
      if(reduced){finish();return;}
      const elapsed=performance.now()-startTime;
      if(elapsed>=REVEAL_MS){finish();return;}
      animating=true;if(!safeRender(clamp(elapsed/REVEAL_MS,0,1),'resume-animation'))return;scheduleTick();
    }
    function renderCurrentState(){
      if(!webgl||failed)return;
      if(section.dataset.tav46Resolved==='true'){safeRender(1,'resize-resolved');return;}
      if(animating){safeRender(clamp((performance.now()-startTime)/REVEAL_MS,0,1),'resize-animation');return;}
      safeRender(0,'resize-initial');
    }

    setRuntime('boot');
    try{
      gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true,powerPreference:'high-performance',preserveDrawingBuffer:true});
      if(!gl)throw new Error('WebGL unavailable');
      program=createProgram(gl);gl.useProgram(program);
      gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(0,0,0,0);
      loc={
        pos:gl.getAttribLocation(program,'aPosition'),normal:gl.getAttribLocation(program,'aNormal'),vp:gl.getUniformLocation(program,'uVP'),
        color:gl.getUniformLocation(program,'uColor'),opacity:gl.getUniformLocation(program,'uOpacity'),useClip:gl.getUniformLocation(program,'uUseClip'),
        useLighting:gl.getUniformLocation(program,'uUseLighting'),useZones:gl.getUniformLocation(program,'uUseZones'),activeZone:gl.getUniformLocation(program,'uActiveZone'),
        rim:gl.getUniformLocation(program,'uRim'),shadowMode:gl.getUniformLocation(program,'uShadowMode'),lightDir:gl.getUniformLocation(program,'uLightDir'),
        camera:gl.getUniformLocation(program,'uCameraPos'),focusPos:gl.getUniformLocation(program,'uFocusPos'),focusIntensity:gl.getUniformLocation(program,'uFocusIntensity'),clip:gl.getUniformLocation(program,'uClipPlanes[0]')
      };
      finalPos=makeBuffer(gl,finalGeometry.positions);finalNor=makeBuffer(gl,finalGeometry.normals);
      finalEdgePos=makeBuffer(gl,finalGeometry.edgePositions);finalEdgeNor=makeBuffer(gl,new Float32Array(finalGeometry.edgePositions.length));
      constraintEdgePos=makeBuffer(gl,finalGeometry.constraintEdgePositions);constraintEdgeNor=makeBuffer(gl,new Float32Array(finalGeometry.constraintEdgePositions.length));
      boxPos=makeBuffer(gl,boxGeometry.positions);boxNor=makeBuffer(gl,boxGeometry.normals);boxEdgePos=makeBuffer(gl,boxEdges);boxEdgeNor=makeBuffer(gl,new Float32Array(boxEdges.length));
      floorPos=makeBuffer(gl,floorGeometry.positions);floorNor=makeBuffer(gl,floorGeometry.normals);
      planePos=makeDynamicBuffer(gl,4*6*3*4);planeNor=makeDynamicBuffer(gl,4*6*3*4);planeEdgePos=makeDynamicBuffer(gl,4*8*3*4);planeEdgeNor=makeDynamicBuffer(gl,4*8*3*4);
      webgl=true;setRuntime('buffers-ready');
      if(!safeRender(0,'first-frame'))return;
      section.classList.add('is-webgl');section.dataset.webgl='frame-ready';setRuntime('first-frame');
    }catch(error){activateFallback(error);return;}

    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();activateFallback(new Error('WebGL context lost'));},false);
    window.addEventListener('resize',()=>{renderCurrentState();guardStart();},{passive:true});
    window.addEventListener('pageshow',syncRuntime,{passive:true});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncRuntime();},{passive:true});

    if(reduced){finish();}
    else{
      window.addEventListener('scroll',guardStart,{passive:true});
      if('IntersectionObserver' in window){
        observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)guardStart();}),{threshold:[0,.08,.22,.40],rootMargin:'14% 0px 14% 0px'});
        observer.observe(visual);
      }
      guardStart();
    }
  }
  sections.forEach(install);
})();
