(function(){
  'use strict';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const mix=(a,b,t)=>a+(b-a)*t;
  const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
  const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
  const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
  const mul=(a,s)=>[a[0]*s,a[1]*s,a[2]*s];
  const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const len=a=>Math.hypot(a[0],a[1],a[2]);
  const norm=a=>{const l=len(a)||1;return[a[0]/l,a[1]/l,a[2]/l];};

  function perspective(fovy,aspect,near,far){
    const f=1/Math.tan(fovy/2),nf=1/(near-far);
    return[f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,(2*far*near)*nf,0];
  }
  function lookAt(eye,target,up){
    const z=norm(sub(eye,target)),x=norm(cross(up,z)),y=cross(z,x);
    return[x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1];
  }
  function multiply(a,b){
    const out=new Array(16).fill(0);
    for(let c=0;c<4;c++)for(let r=0;r<4;r++){
      out[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];
    }
    return out;
  }
  function transform4(m,v){
    return[
      m[0]*v[0]+m[4]*v[1]+m[8]*v[2]+m[12]*v[3],
      m[1]*v[0]+m[5]*v[1]+m[9]*v[2]+m[13]*v[3],
      m[2]*v[0]+m[6]*v[1]+m[10]*v[2]+m[14]*v[3],
      m[3]*v[0]+m[7]*v[1]+m[11]*v[2]+m[15]*v[3]
    ];
  }
  function planeFromPoint(name,normal,point){
    const n=norm(normal);return{name,n,c:-dot(n,point),point:point.slice(),constraint:true};
  }
  function faceBasis(n){
    const ref=Math.abs(n[1])<.88?[0,1,0]:[1,0,0];
    const u=norm(cross(ref,n)),v=norm(cross(n,u));return[u,v];
  }

  // R4.6: a deliberately thick architectural envelope. The broad front plane stays dominant;
  // four asymmetric requirement cuts shape the perimeter and expose depth instead of producing a gem.
  const W=5.90,H=3.10,D=2.55;
  const basePlanes=[
    {name:'left',n:[1,0,0],c:W/2},
    {name:'right',n:[-1,0,0],c:W/2},
    {name:'bottom',n:[0,1,0],c:H/2},
    {name:'top',n:[0,-1,0],c:H/2},
    {name:'back',n:[0,0,1],c:D/2},
    {name:'front',n:[0,0,-1],c:D/2}
  ];
  const constraints=[
    planeFromPoint('process',[.55,-.83,.08],[-2.04,1.10,.08]),
    planeFromPoint('context',[-.79,-.61,.10],[1.94,1.03,-.06]),
    planeFromPoint('control',[.66,.74,.11],[-2.10,-1.06,.00]),
    planeFromPoint('integrations',[-.60,.78,-.15],[1.98,-1.11,.12])
  ];
  const allPlanes=basePlanes.concat(constraints);

  function intersect3(p1,p2,p3){
    const n1=p1.n,n2=p2.n,n3=p3.n,n2xn3=cross(n2,n3),den=dot(n1,n2xn3);
    if(Math.abs(den)<1e-7)return null;
    return mul(add(add(mul(n2xn3,-p1.c),mul(cross(n3,n1),-p2.c)),mul(cross(n1,n2),-p3.c)),1/den);
  }
  function insideAll(p,planes){return planes.every(pl=>dot(pl.n,p)+pl.c>=-1e-5);}
  function uniquePush(arr,p){if(!arr.some(q=>len(sub(p,q))<1e-4))arr.push(p);}
  function pointKey(p){return p.map(v=>Math.round(v*10000)).join(',');}

  function buildIntersectionGeometry(planes){
    const verts=[];
    for(let i=0;i<planes.length-2;i++)for(let j=i+1;j<planes.length-1;j++)for(let k=j+1;k<planes.length;k++){
      const p=intersect3(planes[i],planes[j],planes[k]);if(p&&insideAll(p,planes))uniquePush(verts,p);
    }
    const positions=[],normals=[],faceCenters={},facePolygons={};
    planes.forEach(pl=>{
      let pts=verts.filter(p=>Math.abs(dot(pl.n,p)+pl.c)<1e-4);
      if(pts.length<3)return;
      const center=pts.reduce((a,p)=>add(a,p),[0,0,0]).map(v=>v/pts.length);
      const [u,v]=faceBasis(pl.n);
      pts=pts.slice().sort((a,b)=>{
        const da=sub(a,center),db=sub(b,center);
        return Math.atan2(dot(da,v),dot(da,u))-Math.atan2(dot(db,v),dot(db,u));
      });
      const outward=mul(pl.n,-1);
      if(dot(cross(sub(pts[1],pts[0]),sub(pts[2],pts[0])),outward)<0)pts.reverse();
      for(let i=1;i<pts.length-1;i++){
        [pts[0],pts[i],pts[i+1]].forEach(p=>{positions.push(...p);normals.push(...outward);});
      }
      faceCenters[pl.name]=center;facePolygons[pl.name]=pts.map(p=>p.slice());
    });

    const edges=[],constraintEdges=[];
    const seen=new Set(),seenConstraint=new Set();
    Object.entries(facePolygons).forEach(([name,pts])=>{
      const isConstraint=constraints.some(c=>c.name===name);
      for(let i=0;i<pts.length;i++){
        const a=pts[i],b=pts[(i+1)%pts.length];
        const ka=pointKey(a),kb=pointKey(b),key=ka<kb?ka+'|'+kb:kb+'|'+ka;
        if(!seen.has(key)){seen.add(key);edges.push(...a,...b);}
        if(isConstraint&&!seenConstraint.has(key)){seenConstraint.add(key);constraintEdges.push(...a,...b);}
      }
    });
    const constraintFrontAnchors={},constraintFrontTangents={};
    constraints.forEach(pl=>{
      const pts=(facePolygons[pl.name]||[]).filter(p=>Math.abs(p[2]-D/2)<1e-4);
      if(pts.length>=2){
        constraintFrontAnchors[pl.name]=mul(add(pts[0],pts[1]),.5);
        constraintFrontTangents[pl.name]=norm(sub(pts[1],pts[0]));
      }else if(faceCenters[pl.name]){
        constraintFrontAnchors[pl.name]=faceCenters[pl.name].slice();
        constraintFrontTangents[pl.name]=faceBasis(pl.n)[0];
      }
    });
    return{
      positions:new Float32Array(positions),normals:new Float32Array(normals),vertices:verts,
      faceCenters,facePolygons,constraintFrontAnchors,constraintFrontTangents,
      edgePositions:new Float32Array(edges),constraintEdgePositions:new Float32Array(constraintEdges)
    };
  }

  function buildBoxGeometry(w,h,d){
    const x=w/2,y=h/2,z=d/2;
    const faces=[
      [[-x,-y,z],[x,-y,z],[x,y,z],[-x,y,z]],[0,0,1],
      [[x,-y,-z],[-x,-y,-z],[-x,y,-z],[x,y,-z]],[0,0,-1],
      [[-x,-y,-z],[-x,-y,z],[-x,y,z],[-x,y,-z]],[-1,0,0],
      [[x,-y,z],[x,-y,-z],[x,y,-z],[x,y,z]],[1,0,0],
      [[-x,y,z],[x,y,z],[x,y,-z],[-x,y,-z]],[0,1,0],
      [[-x,-y,-z],[x,-y,-z],[x,-y,z],[-x,-y,z]],[0,-1,0]
    ];
    const pos=[],nor=[];
    for(let i=0;i<faces.length;i+=2){const q=faces[i],n=faces[i+1];[[0,1,2],[0,2,3]].forEach(t=>t.forEach(j=>{pos.push(...q[j]);nor.push(...n);}));}
    return{positions:new Float32Array(pos),normals:new Float32Array(nor)};
  }
  function buildBoxEdges(w,h,d){
    const x=w/2,y=h/2,z=d/2,v=[[-x,-y,-z],[x,-y,-z],[x,y,-z],[-x,y,-z],[-x,-y,z],[x,-y,z],[x,y,z],[-x,y,z]];
    const e=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],out=[];
    e.forEach(([a,b])=>out.push(...v[a],...v[b]));return new Float32Array(out);
  }
  function buildFloor(){
    const y=-1.72,x=4.55,z=3.25;
    const q=[[-x,y,-z],[x,y,-z],[x,y,z],[-x,y,z]],pos=[],nor=[];
    [[0,1,2],[0,2,3]].forEach(t=>t.forEach(i=>{pos.push(...q[i]);nor.push(0,1,0);}));
    return{positions:new Float32Array(pos),normals:new Float32Array(nor)};
  }

  const finalGeometry=buildIntersectionGeometry(allPlanes);
  const boxGeometry=buildBoxGeometry(W,H,D),boxEdges=buildBoxEdges(W,H,D),floorGeometry=buildFloor();
  const anchors={
    models:[-1.55,.55,D/2+.012],automation:[1.35,.55,D/2+.012],
    communication:[-1.50,-.62,D/2+.012],delivery:[1.35,-.62,D/2+.012]
  };
  const zoneIndex={models:1,automation:2,communication:3,delivery:4};

  window.__TAV46_CORE={
    clamp,mix,smooth,sub,add,mul,dot,cross,len,norm,perspective,lookAt,multiply,transform4,faceBasis,
    W,H,D,constraints,allPlanes,finalGeometry,boxGeometry,boxEdges,floorGeometry,anchors,zoneIndex
  };
})();
