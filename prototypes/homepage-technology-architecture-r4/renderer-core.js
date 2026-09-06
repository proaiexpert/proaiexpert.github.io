(function(){
  'use strict';
  function createShader(gl,type,source){
    const sh=gl.createShader(type); gl.shaderSource(sh,source); gl.compileShader(sh);
    if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh)||'Shader compile failed');
    return sh;
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
      uniform float uRim;
      uniform vec3 uLightDir;
      uniform vec3 uCameraPos;
      uniform vec3 uFocusPos;
      uniform float uFocusIntensity;
      uniform vec4 uClipPlanes[4];
      void main(){
        if(uUseClip>.5){
          for(int i=0;i<4;i++) if(dot(vec4(vPos,1.0),uClipPlanes[i])<0.0) discard;
        }
        vec3 col=uColor;
        if(uUseLighting>.5){
          vec3 n=normalize(vNormal);
          vec3 l=normalize(uLightDir);
          vec3 v=normalize(uCameraPos-vPos);
          float dif=max(dot(n,l),0.0);
          float dif2=max(dot(n,normalize(vec3(-.62,.18,.76))),0.0);
          float dif3=max(dot(n,normalize(vec3(.18,-.58,.79))),0.0);
          vec3 h=normalize(l+v);
          float spec=pow(max(dot(n,h),0.0),22.0)*0.18;
          float fres=pow(1.0-max(dot(n,v),0.0),2.05)*uRim;
          float fd=length(vPos-uFocusPos);
          float focus=uFocusIntensity/(1.0+2.8*fd*fd);
          float materialResponse=0.44+0.48*dif+0.22*dif2+0.11*dif3;
          col*=materialResponse;
          col+=vec3(.63,.69,.73)*(spec+fres*.18+focus*.18);
        }
        gl_FragColor=vec4(col,uOpacity);
      }
    `;
    const p=gl.createProgram();
    gl.attachShader(p,createShader(gl,gl.VERTEX_SHADER,vs));
    gl.attachShader(p,createShader(gl,gl.FRAGMENT_SHADER,fs));
    gl.linkProgram(p);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)||'Program link failed');
    return p;
  }

  function makeBuffer(gl,data){
    const b=gl.createBuffer();gl.bindBuffer(gl,gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);return b;
  }
  function makeDynamicBuffer(gl,bytes){
    const b=gl.createBuffer();gl.bindBuffer(gl,gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,bytes,gl.DYNAMIC_DRAW);return b;
  }

  window.__TAV4_RENDER={createProgram,makeBuffer,makeDynamicBuffer};
})();
