(function(){
  'use strict';
  function createShader(gl,type,source){
    const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader)||'Shader compile failed');
    return shader;
  }
  function createProgram(gl){
    const vs=`
      attribute vec3 aPosition;
      attribute vec3 aNormal;
      uniform mat4 uVP;
      varying vec3 vPos;
      varying vec3 vNormal;
      void main(){vPos=aPosition;vNormal=aNormal;gl_Position=uVP*vec4(aPosition,1.0);}
    `;
    const fs=`
      precision highp float;
      varying vec3 vPos;
      varying vec3 vNormal;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uUseClip;
      uniform float uUseLighting;
      uniform float uUseZones;
      uniform float uActiveZone;
      uniform float uRole;
      uniform float uResolve;
      uniform float uRim;
      uniform float uShadowMode;
      uniform vec3 uLightDir;
      uniform vec3 uCameraPos;
      uniform vec3 uFocusPos;
      uniform float uFocusIntensity;
      uniform vec4 uClipPlanes[4];

      float hash21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
      float field(vec2 p,vec2 c,vec2 scale){vec2 d=(p-c)*scale;return exp(-dot(d,d));}

      void main(){
        if(uUseClip>.5){
          for(int i=0;i<4;i++)if(dot(vec4(vPos,1.0),uClipPlanes[i])<0.0)discard;
        }
        if(uShadowMode>.5){
          vec2 q=vec2(vPos.x/4.75,(vPos.z+.34)/3.15);
          float r=length(q);
          float a=(1.0-smoothstep(.10,1.0,r))*uOpacity;
          gl_FragColor=vec4(uColor,a);return;
        }

        vec3 n=normalize(vNormal);
        vec3 v=normalize(uCameraPos-vPos);
        vec3 col=uColor;
        float front=smoothstep(.82,.99,n.z);
        float top=smoothstep(.18,.92,n.y);
        float side=smoothstep(.18,.96,abs(n.x));

        // Physical capability territories are soft material fields, not a four-card grid.
        float f1=0.0,f2=0.0,f3=0.0,f4=0.0;
        if(uUseZones>.5){
          vec2 p=vPos.xy;
          f1=field(p,vec2(-1.18,.72),vec2(.72,1.10));
          f2=field(p,vec2(.96,.38),vec2(.76,1.16));
          f3=field(p,vec2(-1.14,-.46),vec2(.75,1.14));
          f4=field(p,vec2(.90,-.83),vec2(.72,1.10));
          float local=max(max(f1,f2),max(f3,f4));
          float tone=-.030*f1+.018*f2-.012*f3+.030*f4;
          col*=1.0+tone*front;
          col+=vec3(.012,.014,.015)*local*front*uResolve;
          float active=0.0;
          if(uActiveZone>.5&&uActiveZone<1.5)active=f1;
          else if(uActiveZone>1.5&&uActiveZone<2.5)active=f2;
          else if(uActiveZone>2.5&&uActiveZone<3.5)active=f3;
          else if(uActiveZone>3.5)active=f4;
          col+=vec3(.028,.030,.032)*active*front;
        }

        if(uUseLighting>.5){
          vec3 key=normalize(uLightDir);
          vec3 fill=normalize(vec3(-.50,.20,.84));
          vec3 low=normalize(vec3(.10,-.95,.28));
          vec3 rimDir=normalize(vec3(-.78,.28,-.56));
          float dk=max(dot(n,key),0.0);
          float df=max(dot(n,fill),0.0);
          float dl=max(dot(n,low),0.0);
          float dr=max(dot(n,rimDir),0.0);
          float hemi=.5+.5*n.y;

          float base=.315, keyW=.46, fillW=.245, lowW=.055, hemiW=.038;
          if(uRole>1.5&&uRole<2.5){base=.245;keyW=.53;fillW=.205;lowW=.035;hemiW=.026;}
          else if(uRole>2.5&&uRole<3.5){base=.345;keyW=.34;fillW=.31;lowW=.045;hemiW=.035;}
          else if(uRole>3.5&&uRole<4.5){base=.42;keyW=.18;fillW=.34;lowW=.025;hemiW=.025;}
          else if(uRole>4.5){base=.23;keyW=.22;fillW=.26;lowW=.02;hemiW=.02;}

          float illum=base+keyW*dk+fillW*df+lowW*dl+hemiW*hemi;
          illum*=mix(.94,1.08,top);
          illum*=mix(1.0,.79,side*(1.0-front));

          // Local ambient-occlusion approximation deepens the architectural perimeter and recess.
          float px=abs(vPos.x)/3.03,py=abs(vPos.y)/1.61;
          float perimeter=smoothstep(.66,1.03,max(px,py));
          float recessAO=(uRole>2.5&&uRole<3.5)?(.10+.08*perimeter):.055*perimeter;
          col*=max(.05,illum-recessAO);

          vec3 h=normalize(key+v),h2=normalize(fill+v);
          float broad=pow(max(dot(n,h2),0.0),4.5);
          float satin=pow(max(dot(n,h),0.0),16.0);
          float narrow=pow(max(dot(n,h),0.0),46.0);
          float fres=pow(1.0-max(dot(n,v),0.0),3.35)*uRim;
          float spec=.060*broad+.040*satin+.012*narrow;
          if(uRole>1.5&&uRole<2.5)spec=.074*broad+.045*satin+.016*narrow;
          if(uRole>2.5&&uRole<3.5)spec=.050*broad+.026*satin+.008*narrow;
          if(uRole>3.5&&uRole<4.5)spec=.095*broad+.020*satin;
          float fd=length(vPos-uFocusPos);
          float focus=uFocusIntensity/(1.0+3.5*fd*fd);
          vec3 pearl=vec3(.79,.82,.83);
          col+=pearl*(spec+fres*(.038+.035*dr)+focus*.060)*mix(.68,1.0,uResolve);

          // Very restrained internal pearl return on the recessed valid surface.
          if(uRole>2.5&&uRole<3.5){
            float local=max(max(f1,f2),max(f3,f4));
            col+=vec3(.028,.031,.032)*local*.42*uResolve;
          }

          float grain=(hash21(floor(vPos.xy*104.0)+gl_FragCoord.xy*.017)-.5)*.015;
          float brushed=(hash21(vec2(floor(vPos.y*156.0),floor(vPos.x*7.0)))-.5)*.008;
          col*=1.0+grain+brushed*front;
        }
        gl_FragColor=vec4(max(col,vec3(0.0)),uOpacity);
      }
    `;
    const p=gl.createProgram();
    gl.attachShader(p,createShader(gl,gl.VERTEX_SHADER,vs));
    gl.attachShader(p,createShader(gl,gl.FRAGMENT_SHADER,fs));
    gl.linkProgram(p);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p)||'Program link failed');
    return p;
  }
  function makeBuffer(gl,data){const b=gl.createBuffer();gl.bindBuffer(gl,gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);return b;}
  function makeDynamicBuffer(gl,bytes){const b=gl.createBuffer();gl.bindBuffer(gl,gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,bytes,gl.DYNAMIC_DRAW);return b;}
  window.__TAV46_RENDER={createProgram,makeBuffer,makeDynamicBuffer};
})();
