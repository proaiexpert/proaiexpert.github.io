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
      void main(){
        vPos=aPosition;
        vNormal=aNormal;
        gl_Position=uVP*vec4(aPosition,1.0);
      }
    `;
    const fs=`
      precision mediump float;
      varying vec3 vPos;
      varying vec3 vNormal;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uUseClip;
      uniform float uUseLighting;
      uniform float uUseZones;
      uniform float uActiveZone;
      uniform float uRim;
      uniform float uShadowMode;
      uniform vec3 uLightDir;
      uniform vec3 uCameraPos;
      uniform vec3 uFocusPos;
      uniform float uFocusIntensity;
      uniform vec4 uClipPlanes[4];

      float hash21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}

      void main(){
        if(uUseClip>.5){
          for(int i=0;i<4;i++)if(dot(vec4(vPos,1.0),uClipPlanes[i])<0.0)discard;
        }

        if(uShadowMode>.5){
          vec2 q=vec2(vPos.x/4.35,(vPos.z+.18)/2.70);
          float r=length(q);
          float a=(1.0-smoothstep(.18,1.0,r))*uOpacity;
          gl_FragColor=vec4(uColor,a);
          return;
        }

        vec3 col=uColor;
        vec3 n=normalize(vNormal);
        vec3 v=normalize(uCameraPos-vPos);

        if(uUseZones>.5){
          float frontness=smoothstep(.82,.98,n.z);
          float zone=0.0;
          if(vPos.x<0.0&&vPos.y>=0.0)zone=1.0;
          else if(vPos.x>=0.0&&vPos.y>=0.0)zone=2.0;
          else if(vPos.x<0.0&&vPos.y<0.0)zone=3.0;
          else zone=4.0;
          float tone=1.0;
          if(zone<1.5)tone=.94;
          else if(zone<2.5)tone=1.025;
          else if(zone<3.5)tone=.975;
          else tone=1.055;
          col*=mix(1.0,tone,frontness*.72);
          float gx=1.0-smoothstep(.020,.052,abs(vPos.x));
          float gy=1.0-smoothstep(.020,.052,abs(vPos.y+.015));
          float groove=max(gx,gy)*frontness;
          col-=vec3(.022,.024,.026)*groove;
          float active=1.0-step(.45,abs(zone-uActiveZone));
          col+=vec3(.030,.033,.036)*active*frontness;
        }

        if(uUseLighting>.5){
          vec3 key=normalize(uLightDir);
          vec3 fill=normalize(vec3(-.56,.24,.79));
          vec3 low=normalize(vec3(.16,-.91,.38));
          float dk=max(dot(n,key),0.0);
          float df=max(dot(n,fill),0.0);
          float dl=max(dot(n,low),0.0);
          float hemi=.5+.5*n.y;
          float illum=.385+.41*dk+.235*df+.075*dl+.045*hemi;
          col*=illum;

          vec3 h=normalize(key+v);
          vec3 h2=normalize(fill+v);
          float spec=pow(max(dot(n,h),0.0),38.0)*.105;
          float sheen=pow(max(dot(n,h2),0.0),10.0)*.045;
          float fres=pow(1.0-max(dot(n,v),0.0),3.1)*uRim;
          float fd=length(vPos-uFocusPos);
          float focus=uFocusIntensity/(1.0+3.6*fd*fd);
          vec3 pearl=vec3(.78,.82,.84);
          col+=pearl*(spec+sheen+fres*.115+focus*.085);
          float grain=hash21(gl_FragCoord.xy)-.5;
          col*=1.0+grain*.018;
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
