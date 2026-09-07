(function(){
  'use strict';
  function createShader(gl,type,source){const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(sh)||'Shader compile failed');return sh;}
  function createProgram(gl){
    const vs=`
      attribute vec3 aPosition;attribute vec3 aNormal;uniform mat4 uVP;varying vec3 vPos;varying vec3 vNormal;
      void main(){vPos=aPosition;vNormal=aNormal;gl_Position=uVP*vec4(aPosition,1.0);}
    `;
    const fs=`
      precision mediump float;
      varying vec3 vPos;varying vec3 vNormal;
      uniform vec3 uColor;uniform float uOpacity;uniform float uUseClip;uniform float uUseLighting;uniform float uUseZones;uniform float uActiveZone;uniform float uRim;uniform float uShadowMode;uniform float uResolve;
      uniform vec3 uLightDir;uniform vec3 uCameraPos;uniform vec3 uFocusPos;uniform float uFocusIntensity;uniform vec4 uClipPlanes[4];
      float hash21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float field(vec2 p,vec2 c,vec2 scale){vec2 d=(p-c)*scale;return exp(-dot(d,d));}
      void main(){
        if(uUseClip>.5){for(int i=0;i<4;i++)if(dot(vec4(vPos,1.0),uClipPlanes[i])<0.0)discard;}
        if(uShadowMode>.5){vec2 q=vec2(vPos.x/4.55,(vPos.z+.28)/2.92);float r=length(q);float a=(1.0-smoothstep(.12,1.0,r))*uOpacity;gl_FragColor=vec4(uColor,a);return;}
        vec3 n=normalize(vNormal),v=normalize(uCameraPos-vPos),col=uColor;
        float front=smoothstep(.84,.985,n.z),top=smoothstep(.18,.88,n.y),side=smoothstep(.12,.95,abs(n.x));
        if(uUseZones>.5){
          vec2 p=vPos.xy;
          float f1=field(p,vec2(-1.42,.56),vec2(.72,1.28));
          float f2=field(p,vec2(1.08,.57),vec2(.72,1.28));
          float f3=field(p,vec2(-1.40,-.60),vec2(.72,1.28));
          float f4=field(p,vec2(1.06,-.60),vec2(.72,1.28));
          float tone=(-.035*f1+.018*f2-.012*f3+.030*f4)*front;
          col*=1.0+tone;
          float nearest=max(max(f1,f2),max(f3,f4));
          col+=vec3(.010,.011,.012)*nearest*front*uResolve;
          float active=0.0;
          if(uActiveZone>.5&&uActiveZone<1.5)active=f1;
          else if(uActiveZone>1.5&&uActiveZone<2.5)active=f2;
          else if(uActiveZone>2.5&&uActiveZone<3.5)active=f3;
          else if(uActiveZone>3.5)active=f4;
          col+=vec3(.030,.032,.034)*active*front;
        }
        if(uUseLighting>.5){
          vec3 key=normalize(uLightDir),fill=normalize(vec3(-.46,.22,.86)),low=normalize(vec3(.10,-.94,.31)),edge=normalize(vec3(-.82,.18,-.54));
          float dk=max(dot(n,key),0.0),df=max(dot(n,fill),0.0),dl=max(dot(n,low),0.0),de=max(dot(n,edge),0.0);
          float hemi=.5+.5*n.y;
          float illum=.34+.43*dk+.25*df+.055*dl+.045*hemi;
          illum*=mix(.91,1.05,top);illum*=mix(1.0,.82,side*(1.0-front));
          float perimeter=max(abs(vPos.x)/3.08,abs(vPos.y)/1.63);
          float occlusion=smoothstep(.67,1.03,perimeter)*front*.105;
          col*=max(.0,illum-occlusion);
          vec3 h=normalize(key+v),h2=normalize(fill+v);
          float broad=pow(max(dot(n,h2),0.0),5.0)*.070;
          float satin=pow(max(dot(n,h),0.0),18.0)*.058;
          float rim=pow(1.0-max(dot(n,v),0.0),3.4)*uRim*(.055+.055*de);
          float fd=length(vPos-uFocusPos),focus=uFocusIntensity/(1.0+3.2*fd*fd);
          vec3 pearl=vec3(.78,.81,.82);
          col+=pearl*(broad+satin+rim+focus*.065)*mix(.78,1.0,uResolve);
          float grain=(hash21(floor(vPos.xy*92.0)+gl_FragCoord.xy*.021)-.5)*.018;
          float streak=(hash21(vec2(floor(vPos.y*135.0),floor(vPos.x*8.0)))-.5)*.010;
          col*=1.0+grain+streak*front;
        }
        gl_FragColor=vec4(max(col,vec3(0.0)),uOpacity);
      }
    `;
    const p=gl.createProgram();gl.attachShader(p,createShader(gl,gl.VERTEX_SHADER,vs));gl.attachShader(p,createShader(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p)||'Shader link failed');return p;
  }
  function makeBuffer(gl,data){const b=gl.createBuffer();gl.bindBuffer(gl,gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);return b;}
  function makeDynamicBuffer(gl,bytes){const b=gl.createBuffer();gl.bindBuffer(gl,gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,bytes,gl.DYNAMIC_DRAW);return b;}
  window.__TAV46_RENDER={createProgram,makeBuffer,makeDynamicBuffer};
})();