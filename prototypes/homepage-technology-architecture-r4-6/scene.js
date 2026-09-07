(function(){
  'use strict';
  const core=window.__TAV46_CORE,renderCore=window.__TAV46_RENDER;
  if(!core||!renderCore)return;
  const {
    clamp,mix,smooth,sub,add,mul,norm,perspective,lookAt,multiply,transform4,faceBasis,
    constraints,finalGeometry,shellGeometry,frontAssembly,boxGeometry,boxEdges,floorGeometry,anchorSets,zoneIndex,D
  }=core;
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
    const REVEAL_MS=4100;

    let gl=null,program=null,loc=null,webgl=false,failed=false;
    let vp=null,camera=[6.25,3.55,9.15],target=[.08,-.10,.06],currentMode='wide',currentResolve=1;
    let focus=[0,0,D/2-.24],focusIntensity=0,activeZone=0;
    let animating=false,startTime=0,observer=null,rafId=0,completionTimer=0,nearTimer=0,lastW=0,lastH=0;

    let shellPos,shellNor,rimPos,rimNor,insetPos,insetNor,corePos,coreNor;
    let constraintEdgePos,constraintEdgeNor,boxPos,boxNor,boxEdgePos,boxEdgeNor,floorPos,floorNor;
    let fragmentPos,fragmentNor,fragmentEdgePos,fragmentEdgeNor;

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
      if(error&&window.console&&console.error)console.error('[TAV48] fallback:',error);
    }

    function bind(posBuf,norBuf){
      gl.bindBuffer(gl.ARRAY_BUFFER,posBuf);gl.enableVertexAttribArray(loc.pos);gl.vertexAttribPointer(loc.pos,3,gl.FLOAT,false,0,0);
      gl.bindBuffer(gl.ARRAY_BUFFER,norBuf);gl.enableVertexAttribArray(loc.normal);gl.vertexAttribPointer(loc.normal,3,gl.FLOAT,false,0,0);
    }
    function material(color,opacity,opts){
      const o=opts||{};
      gl.uniform3fv(loc.color,color);gl.uniform1f(loc.opacity,opacity);
      gl.uniform1f(loc.useClip,o.clip?1:0);gl.uniform1f(loc.useLighting,o.lighting?1:0);gl.uniform1f(loc.useZones,o.zones?1:0);
      gl.uniform1f(loc.activeZone,activeZone);gl.uniform1f(loc.role,o.role||0);gl.uniform1f(loc.resolve,currentResolve);
      gl.uniform1f(loc.rim,o.rim||0);gl.uniform1f(loc.shadowMode,o.shadow?1:0);
      gl.uniform3fv(loc.lightDir,[.47,.78,.40]);gl.uniform3fv(loc.camera,camera);gl.uniform3fv(loc.focusPos,focus);gl.uniform1f(loc.focusIntensity,focusIntensity);
    }

    function setActive(family){
      if(family)visual.dataset.active=family;else delete visual.dataset.active;
      controls.forEach(c=>c.setAttribute('aria-pressed',c.dataset.family===family?'true':'false'));
      const anchors=anchorSets[currentMode]||anchorSets.wide;
      if(family&&anchors[family]){focus=anchors[family].slice();focusIntensity=.70;activeZone=zoneIndex[family]||0;}
      else{focus=[0,0,D/2-.24];focusIntensity=0;activeZone=0;}
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

    // Constraint fragments stay on the actual requirement planes. Their limited extents create depth remnants,
    // not debug rectangles. Depth testing lets the resolved body physically occlude them at REST.
    function fragmentGeometry(offsets,progress){
      const p=[],n=[],e=[],en=[];
      const along=[-.88,.78,-.62,.70],vertical=[.10,-.08,.05,-.04],lengths=[2.45,2.30,2.20,2.30];
      constraints.forEach((pl,i)=>{
        const base=sub(pl.point,mul(pl.n,offsets[i]));
        const [u,v]=faceBasis(pl.n);
        const center=add(add(base,mul(u,along[i])),mul(v,vertical[i]));
        const halfL=lengths[i]*mix(.72,1.0,smooth((progress-.08)/.28));
        const halfW=mix(.12,.22,smooth((progress-.07)/.30));
        const q=[
          add(add(center,mul(u,-halfL)),mul(v,-halfW)),add(add(center,mul(u,halfL)),mul(v,-halfW)),
          add(add(center,mul(u,halfL)),mul(v,halfW)),add(add(center,mul(u,-halfL)),mul(v,halfW))
        ];
        [[0,1,2],[0,2,3]].forEach(t=>t.forEach(j=>{p.push(...q[j]);n.push(...pl.n);}));
        [[0,1],[2,3]].forEach(pair=>pair.forEach(j=>{e.push(...q[j]);en.push(0,0,0);}));
      });
      gl.bindBuffer(gl.ARRAY_BUFFER,fragmentPos);gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(p));
      gl.bindBuffer(gl.ARRAY_BUFFER,fragmentNor);gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(n));
      gl.bindBuffer(gl.ARRAY_BUFFER,fragmentEdgePos);gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(e));
      gl.bindBuffer(gl.ARRAY_BUFFER,fragmentEdgeNor);gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(en));
      return{triCount:p.length/3,lineCount:e.length/3};
    }

    function projectPoint(point){
      if(!vp)return null;
      const clip=transform4(vp,[point[0],point[1],point[2],1]);if(Math.abs(clip[3])<1e-5)return null;
      return{x:(clip[0]/clip[3]*.5+.5)*100,y:(-clip[1]/clip[3]*.5+.5)*100,w:clip[3]};
    }
    function setProjectedElement(el,point,tangent,angleLimit){
      const a=projectPoint(point);if(!a)return;
      el.style.left=a.x.toFixed(2)+'%';el.style.top=a.y.toFixed(2)+'%';
      if(tangent){
        const b=projectPoint(add(point,mul(tangent,.62)));
        if(b){let angle=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI;angle=clamp(angle,-angleLimit,angleLimit);el.style.setProperty('--surface-angle',angle.toFixed(2)+'deg');}
      }
      const depth=clamp((a.w-6.0)/8.0,0,1);el.style.setProperty('--surface-depth',depth.toFixed(3));
    }
    function chooseMode(rect){
      if(rect.width>470&&rect.width/Math.max(1,rect.height)>1.45&&(window.innerHeight||999)<520)return'landscape';
      if(rect.width<520)return'portrait';
      if(rect.width<920)return'medium';
      return'wide';
    }
    function projectAnchors(rect){
      currentMode=chooseMode(rect);
      const anchors=anchorSets[currentMode]||anchorSets.wide;
      const angleLimit=currentMode==='portrait'?1.0:currentMode==='landscape'?2.2:3.8;
      controls.forEach(el=>setProjectedElement(el,anchors[el.dataset.anchor],[1,0,0],angleLimit));
      cutLabels.forEach(el=>{
        const name=el.dataset.cutAnchor;
        const raw=finalGeometry.constraintFrontAnchors[name]||finalGeometry.faceCenters[name];
        const tangent=finalGeometry.constraintFrontTangents[name]||[1,0,0];
        if(!raw)return;
        const center=[0,0,D/2-.18];
        const amount=currentMode==='portrait'?.22:.16;
        const attached=add(raw,mul(norm(sub(center,raw)),amount));
        attached[2]-=.07;
        setProjectedElement(el,attached,tangent,angleLimit);
      });
      if(resolvedLabel){
        const point=currentMode==='portrait'?[.58,-1.25,D/2-.24]:[1.02,-1.27,D/2-.24];
        setProjectedElement(resolvedLabel,point,[1,0,0],angleLimit);
      }
    }

    function baseCamera(mode){
      if(mode==='landscape')return{camera:[5.75,3.00,8.55],target:[.12,-.12,.08],fov:37.0};
      if(mode==='portrait')return{camera:[4.55,3.25,9.55],target:[.04,-.16,.06],fov:33.5};
      if(mode==='medium')return{camera:[5.65,3.48,9.20],target:[.08,-.10,.06],fov:34.0};
      return{camera:[6.15,3.72,8.92],target:[.12,-.10,.06],fov:32.0};
    }
    function resize(progress){
      const rect=canvas.getBoundingClientRect();
      const dpr=Math.min(window.devicePixelRatio||1,rect.width<700?1.30:1.48);
      const w=Math.max(2,Math.round(rect.width*dpr)),h=Math.max(2,Math.round(rect.height*dpr));
      if(w!==lastW||h!==lastH){canvas.width=w;canvas.height=h;lastW=w;lastH=h;gl.viewport(0,0,w,h);}
      currentMode=chooseMode(rect);
      const base=baseCamera(currentMode),settle=1-smooth(((progress==null?1:progress)-.20)/.52);
      const drift=currentMode==='portrait'?[.10,.10,.34]:[.18,.12,.38];
      camera=[base.camera[0]+drift[0]*settle,base.camera[1]+drift[1]*settle,base.camera[2]+drift[2]*settle];
      target=[base.target[0]-.05*settle,base.target[1]+.04*settle,base.target[2]];
      const vpNext=multiply(perspective(base.fov*Math.PI/180,w/h,.1,50),lookAt(camera,target,[0,1,0]));
      vp=vpNext;gl.uniformMatrix4fv(loc.vp,false,new Float32Array(vp));projectAnchors(rect);
    }

    function render(progress){
      const p=progress==null?1:progress;
      resize(p);
      const move=smooth((p-.045)/.44);
      const offsets=constraints.map((_,i)=>4.20*(1-smooth(clamp(move*1.10-i*.040,0,1))));
      const ghostOpacity=mix(.15,.002,smooth((p-.38)/.28));
      const shellOpacity=smooth((p-.36)/.22);
      const rimOpacity=smooth((p-.44)/.22);
      const coreOpacity=smooth((p-.50)/.25);
      const insetOpacity=smooth((p-.54)/.24);
      currentResolve=smooth((p-.50)/.34);
      const fragmentIn=smooth((p-.035)/.22),fragmentSettle=smooth((p-.63)/.27);
      const fragmentOpacity=.010+fragmentIn*.105*(1-fragmentSettle*.72);
      const fragmentRest=.022+fragmentOpacity;
      const cutOpacity=mix(.025,.125,smooth((p-.48)/.32));
      const shadowOpacity=.06+.40*shellOpacity;
      const fg=fragmentGeometry(offsets,p);

      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.uniform4fv(loc.clip,targetClipArray(offsets));

      gl.depthMask(false);
      bind(floorPos,floorNor);material([.010,.014,.018],shadowOpacity,{shadow:true});gl.drawArrays(gl.TRIANGLES,0,floorGeometry.positions.length/3);
      bind(boxPos,boxNor);material([.135,.151,.166],ghostOpacity,{clip:true,lighting:true,role:1,rim:.05});gl.drawArrays(gl.TRIANGLES,0,boxGeometry.positions.length/3);
      bind(boxEdgePos,boxEdgeNor);material([.44,.48,.51],mix(.065,.004,smooth((p-.43)/.25)),{clip:true});gl.drawArrays(gl.LINES,0,boxEdges.length/3);
      gl.depthMask(true);

      // Resolved architecture: dense shell -> recessed pearl return -> machined rim -> smoked valid surface.
      if(shellOpacity>.001){
        bind(shellPos,shellNor);material([.155,.169,.181],Math.min(.995,shellOpacity),{lighting:true,role:1,rim:.25});gl.drawArrays(gl.TRIANGLES,0,shellGeometry.positions.length/3);
      }
      if(coreOpacity>.001){
        bind(corePos,coreNor);material([.40,.425,.435],Math.min(.34,coreOpacity*.32),{lighting:true,role:4,rim:.07});gl.drawArrays(gl.TRIANGLES,0,frontAssembly.coreMesh.positions.length/3);
      }
      if(rimOpacity>.001){
        bind(rimPos,rimNor);material([.176,.188,.198],Math.min(.99,rimOpacity*.99),{lighting:true,role:2,rim:.28});gl.drawArrays(gl.TRIANGLES,0,frontAssembly.rim.positions.length/3);
      }
      if(insetOpacity>.001){
        gl.depthMask(false);
        bind(insetPos,insetNor);material([.185,.199,.210],Math.min(.94,insetOpacity*.92),{lighting:true,zones:true,role:3,rim:.16});gl.drawArrays(gl.TRIANGLES,0,frontAssembly.inset.positions.length/3);
        gl.depthMask(true);
      }

      // Physical cut traces, never a full wireframe.
      if(shellOpacity>.001){
        gl.depthMask(false);
        bind(constraintEdgePos,constraintEdgeNor);material([.72,.75,.76],cutOpacity*shellOpacity,{role:2});gl.drawArrays(gl.LINES,0,finalGeometry.constraintEdgePositions.length/3);
        // Requirement remnants are rendered after the body so depth testing creates real occlusion/parallax.
        bind(fragmentPos,fragmentNor);material([.30,.35,.39],fragmentRest,{lighting:true,role:5,rim:.05});gl.drawArrays(gl.TRIANGLES,0,fg.triCount);
        bind(fragmentEdgePos,fragmentEdgeNor);material([.60,.64,.66],Math.min(.078,fragmentRest*1.20),{role:5});gl.drawArrays(gl.LINES,0,fg.lineCount);
        gl.depthMask(true);
      }
    }

    function safeRender(progress,phase){
      if(!webgl||!gl||failed)return false;
      try{
        if(gl.isContextLost&&gl.isContextLost())throw new Error('WebGL context lost before '+phase);
        render(progress);const err=gl.getError();if(err!==gl.NO_ERROR)throw new Error('WebGL error '+err+' during '+phase);return true;
      }catch(error){activateFallback(error);return false;}
    }

    function viewportMetrics(){
      const rect=visual.getBoundingClientRect(),vh=window.innerHeight||document.documentElement.clientHeight||0,vw=window.innerWidth||document.documentElement.clientWidth||0;
      const visibleY=Math.max(0,Math.min(rect.bottom,vh)-Math.max(rect.top,0)),visibleX=Math.max(0,Math.min(rect.right,vw)-Math.max(rect.left,0));
      return{rect,vh,vw,visibleY,visibleX};
    }
    function clearlyVisible(){const m=viewportMetrics(),needY=Math.min(124,Math.max(62,m.rect.height*.15)),needX=Math.min(142,Math.max(86,m.rect.width*.15));return m.visibleY>=needY&&m.visibleX>=needX;}
    function nearViewport(){const m=viewportMetrics(),margin=Math.max(90,Math.min(190,m.vh*.18));return m.rect.bottom>=-margin&&m.rect.top<=m.vh+margin&&m.rect.right>=0&&m.rect.left<=m.vw;}

    function finish(){
      if(failed)return;
      if(section.dataset.tav46Resolved==='true'){if(webgl)safeRender(1,'resolved-refresh');return;}
      animating=false;section.dataset.tav46Resolved='true';
      if(rafId){cancelAnimationFrame(rafId);rafId=0;}if(completionTimer){clearTimeout(completionTimer);completionTimer=0;}
      disconnectStartWatchers();section.classList.add('is-constraining','is-body','is-capabilities','is-vendors','is-resolved');
      if(webgl&&!safeRender(1,'finish'))return;setRuntime('resolved');
    }
    function scheduleTick(){if(!rafId&&animating&&!failed)rafId=requestAnimationFrame(tick);}
    function tick(now){
      rafId=0;if(!animating||failed)return;
      const p=clamp((now-startTime)/REVEAL_MS,0,1);
      if(p>.06)section.classList.add('is-constraining');
      if(p>.46)section.classList.add('is-body');
      if(p>.72)section.classList.add('is-capabilities');
      if(p>.84)section.classList.add('is-vendors');
      if(p>.94)section.classList.add('is-resolved');
      if(!safeRender(p,'animation'))return;
      if(p<1)scheduleTick();else finish();
    }
    function start(){
      if(failed||animating||section.dataset.tav46Played==='true')return;
      section.dataset.tav46Played='true';disconnectStartWatchers();
      if(reduced){finish();return;}
      animating=true;setRuntime('animating');startTime=performance.now();completionTimer=setTimeout(finish,REVEAL_MS+900);scheduleTick();
    }
    function guardStart(){
      if(failed||section.dataset.tav46Played==='true')return;
      if(clearlyVisible()){start();return;}
      if(nearViewport()&&!nearTimer)nearTimer=setTimeout(()=>{nearTimer=0;if(!failed&&section.dataset.tav46Played!=='true'&&nearViewport())start();},600);
    }
    function syncRuntime(){
      if(failed)return;
      if(section.dataset.tav46Resolved==='true'){if(webgl)safeRender(1,'resume-resolved');return;}
      if(section.dataset.tav46Played!=='true'){guardStart();return;}
      if(reduced){finish();return;}
      const elapsed=performance.now()-startTime;if(elapsed>=REVEAL_MS){finish();return;}
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
        color:gl.getUniformLocation(program,'uColor'),opacity:gl.getUniformLocation(program,'uOpacity'),useClip:gl.getUniformLocation(program,'uUseClip'),useLighting:gl.getUniformLocation(program,'uUseLighting'),useZones:gl.getUniformLocation(program,'uUseZones'),activeZone:gl.getUniformLocation(program,'uActiveZone'),role:gl.getUniformLocation(program,'uRole'),resolve:gl.getUniformLocation(program,'uResolve'),rim:gl.getUniformLocation(program,'uRim'),shadowMode:gl.getUniformLocation(program,'uShadowMode'),lightDir:gl.getUniformLocation(program,'uLightDir'),camera:gl.getUniformLocation(program,'uCameraPos'),focusPos:gl.getUniformLocation(program,'uFocusPos'),focusIntensity:gl.getUniformLocation(program,'uFocusIntensity'),clip:gl.getUniformLocation(program,'uClipPlanes[0]')
      };
      shellPos=makeBuffer(gl,shellGeometry.positions);shellNor=makeBuffer(gl,shellGeometry.normals);
      rimPos=makeBuffer(gl,frontAssembly.rim.positions);rimNor=makeBuffer(gl,frontAssembly.rim.normals);
      insetPos=makeBuffer(gl,frontAssembly.inset.positions);insetNor=makeBuffer(gl,frontAssembly.inset.normals);
      corePos=makeBuffer(gl,frontAssembly.coreMesh.positions);coreNor=makeBuffer(gl,frontAssembly.coreMesh.normals);
      constraintEdgePos=makeBuffer(gl,finalGeometry.constraintEdgePositions);constraintEdgeNor=makeBuffer(gl,new Float32Array(finalGeometry.constraintEdgePositions.length));
      boxPos=makeBuffer(gl,boxGeometry.positions);boxNor=makeBuffer(gl,boxGeometry.normals);boxEdgePos=makeBuffer(gl,boxEdges);boxEdgeNor=makeBuffer(gl,new Float32Array(boxEdges.length));
      floorPos=makeBuffer(gl,floorGeometry.positions);floorNor=makeBuffer(gl,floorGeometry.normals);
      fragmentPos=makeDynamicBuffer(gl,4*6*3*4);fragmentNor=makeDynamicBuffer(gl,4*6*3*4);fragmentEdgePos=makeDynamicBuffer(gl,4*4*3*4);fragmentEdgeNor=makeDynamicBuffer(gl,4*4*3*4);
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
      if('IntersectionObserver' in window){observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)guardStart();}),{threshold:[0,.08,.22,.40],rootMargin:'14% 0px 14% 0px'});observer.observe(visual);}
      guardStart();
    }
  }
  sections.forEach(install);
})();
