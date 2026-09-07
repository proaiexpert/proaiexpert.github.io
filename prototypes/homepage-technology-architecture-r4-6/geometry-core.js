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
    for(let c=0;c<4;c++)for(let r=0;r<4;r++)out[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];
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
  function planeFromPoint(name,normal,point){const n=norm(normal);return{name,n,c:-dot(n,point),point:point.slice(),constraint:true};}
  function faceBasis(n){const ref=Math.abs(n[1])<.88?[0,1,0]:[1,0,0],u=norm(cross(ref,n)),v=norm(cross(n,u));return[u,v];}

  // Locked R4 valid-configuration envelope. R4.8 changes only presentation INSIDE this solved volume.
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
  function faceTriangles(pts,normal){
    const pos=[],nor=[];
    for(let i=1;i<pts.length-1;i++)[pts[0],pts[i],pts[i+1]].forEach(p=>{pos.push(...p);nor.push(...normal);});
    return{positions:new Float32Array(pos),normals:new Float32Array(nor)};
  }

  function buildIntersectionGeometry(planes){
    const verts=[];
    for(let i=0;i<planes.length-2;i++)for(let j=i+1;j<planes.length-1;j++)for(let k=j+1;k<planes.length;k++){
      const p=intersect3(planes[i],planes[j],planes[k]);if(p&&insideAll(p,planes))uniquePush(verts,p);
    }
    const positions=[],normals=[],faceCenters={},facePolygons={},faceMeshes={};
    planes.forEach(pl=>{
      let pts=verts.filter(p=>Math.abs(dot(pl.n,p)+pl.c)<1e-4);
      if(pts.length<3)return;
      const center=pts.reduce((a,p)=>add(a,p),[0,0,0]).map(v=>v/pts.length);
      const [u,v]=faceBasis(pl.n);
      pts=pts.slice().sort((a,b)=>{const da=sub(a,center),db=sub(b,center);return Math.atan2(dot(da,v),dot(da,u))-Math.atan2(dot(db,v),dot(db,u));});
      const outward=mul(pl.n,-1);
      if(dot(cross(sub(pts[1],pts[0]),sub(pts[2],pts[0])),outward)<0)pts.reverse();
      const mesh=faceTriangles(pts,outward);
      positions.push(...mesh.positions);normals.push(...mesh.normals);
      faceCenters[pl.name]=center;facePolygons[pl.name]=pts.map(p=>p.slice());faceMeshes[pl.name]=mesh;
    });
    const edges=[],constraintEdges=[],seen=new Set(),seenConstraint=new Set();
    Object.entries(facePolygons).forEach(([name,pts])=>{
      const isConstraint=constraints.some(c=>c.name===name);
      for(let i=0;i<pts.length;i++){
        const a=pts[i],b=pts[(i+1)%pts.length],ka=pointKey(a),kb=pointKey(b),key=ka<kb?ka+'|'+kb:kb+'|'+ka;
        if(!seen.has(key)){seen.add(key);edges.push(...a,...b);}
        if(isConstraint&&!seenConstraint.has(key)){seenConstraint.add(key);constraintEdges.push(...a,...b);}
      }
    });
    const constraintFrontAnchors={},constraintFrontTangents={};
    constraints.forEach(pl=>{
      const pts=(facePolygons[pl.name]||[]).filter(p=>Math.abs(p[2]-D/2)<1e-4);
      if(pts.length>=2){constraintFrontAnchors[pl.name]=mul(add(pts[0],pts[1]),.5);constraintFrontTangents[pl.name]=norm(sub(pts[1],pts[0]));}
      else if(faceCenters[pl.name]){constraintFrontAnchors[pl.name]=faceCenters[pl.name].slice();constraintFrontTangents[pl.name]=faceBasis(pl.n)[0];}
    });
    return{positions:new Float32Array(positions),normals:new Float32Array(normals),vertices:verts,faceCenters,facePolygons,faceMeshes,constraintFrontAnchors,constraintFrontTangents,edgePositions:new Float32Array(edges),constraintEdgePositions:new Float32Array(constraintEdges)};
  }

  function mergeMeshes(meshes){
    const p=[],n=[];meshes.filter(Boolean).forEach(m=>{p.push(...m.positions);n.push(...m.normals);});
    return{positions:new Float32Array(p),normals:new Float32Array(n)};
  }
  function buildFrontAssembly(frontPts){
    const center=frontPts.reduce((a,p)=>add(a,p),[0,0,0]).map(v=>v/frontPts.length);
    const outer=frontPts.map(p=>p.slice());
    // Nonuniform inset keeps each requirement cut legible while creating a deep architectural reveal.
    const inner=outer.map((p,i)=>{
      const q=sub(p,center),radial=i%2===0?.855:.885;
      return[center[0]+q[0]*radial,center[1]+q[1]*radial,D/2-.265];
    });
    const rimP=[],rimN=[];
    for(let i=0;i<outer.length;i++){
      const j=(i+1)%outer.length,a=outer[i],b=outer[j],c=inner[j],d=inner[i];
      const normal=norm(cross(sub(b,a),sub(d,a)));
      [[a,b,c],[a,c,d]].forEach(t=>t.forEach(v=>{rimP.push(...v);rimN.push(...normal);}));
    }
    const innerMesh=faceTriangles(inner,[0,0,1]);
    // Pearl under-surface sits deeper and smaller. It remains very restrained and only reads through material falloff.
    const core=inner.map(p=>[center[0]+(p[0]-center[0])*.78,center[1]+(p[1]-center[1])*.78,D/2-.43]);
    const coreMesh=faceTriangles(core,[0,0,1]);
    return{
      outer,inner,core,center,
      rim:{positions:new Float32Array(rimP),normals:new Float32Array(rimN)},
      inset:innerMesh,coreMesh
    };
  }

  function buildBoxGeometry(w,h,d){
    const x=w/2,y=h/2,z=d/2,faces=[
      [[-x,-y,z],[x,-y,z],[x,y,z],[-x,y,z]],[0,0,1],
      [[x,-y,-z],[-x,-y,-z],[-x,y,-z],[x,y,-z]],[0,0,-1],
      [[-x,-y,-z],[-x,-y,z],[-x,y,z],[-x,y,-z]],[-1,0,0],
      [[x,-y,z],[x,-y,-z],[x,y,-z],[x,y,z]],[1,0,0],
      [[-x,y,z],[x,y,z],[x,y,-z],[-x,y,-z]],[0,1,0],
      [[-x,-y,-z],[x,-y,-z],[x,-y,z],[-x,-y,z]],[0,-1,0]
    ],pos=[],nor=[];
    for(let i=0;i<faces.length;i+=2){const q=faces[i],n=faces[i+1];[[0,1,2],[0,2,3]].forEach(t=>t.forEach(j=>{pos.push(...q[j]);nor.push(...n);}));}
    return{positions:new Float32Array(pos),normals:new Float32Array(nor)};
  }
  function buildBoxEdges(w,h,d){const x=w/2,y=h/2,z=d/2,v=[[-x,-y,-z],[x,-y,-z],[x,y,-z],[-x,y,-z],[-x,-y,z],[x,-y,z],[x,y,z],[-x,y,z]],e=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],out=[];e.forEach(([a,b])=>out.push(...v[a],...v[b]));return new Float32Array(out);}
  function buildFloor(){const y=-1.78,x=4.80,z=3.55,q=[[-x,y,-z],[x,y,-z],[x,y,z],[-x,y,z]],pos=[],nor=[];[[0,1,2],[0,2,3]].forEach(t=>t.forEach(i=>{pos.push(...q[i]);nor.push(0,1,0);}));return{positions:new Float32Array(pos),normals:new Float32Array(nor)};}

  const finalGeometry=buildIntersectionGeometry(allPlanes);
  const frontAssembly=buildFrontAssembly(finalGeometry.facePolygons.front);
  const shellGeometry=mergeMeshes(Object.entries(finalGeometry.faceMeshes).filter(([name])=>name!=='front').map(([,mesh])=>mesh));
  const boxGeometry=buildBoxGeometry(W,H,D),boxEdges=buildBoxEdges(W,H,D),floorGeometry=buildFloor();

  const zInset=D/2-.245;
  const anchorSets={
    wide:{models:[-1.40,.62,zInset],automation:[1.05,.57,zInset],communication:[-1.34,-.58,zInset],delivery:[1.02,-.64,zInset]},
    medium:{models:[-1.32,.64,zInset],automation:[.98,.55,zInset],communication:[-1.28,-.58,zInset],delivery:[.95,-.66,zInset]},
    // Portrait is a separate information architecture: staggered territories and greater center clearance.
    portrait:{models:[-1.18,.79,zInset],automation:[1.18,.35,zInset],communication:[-1.14,-.42,zInset],delivery:[1.10,-.91,zInset]},
    landscape:{models:[-1.24,.61,zInset],automation:[.94,.50,zInset],communication:[-1.17,-.54,zInset],delivery:[.88,-.66,zInset]}
  };
  const zoneIndex={models:1,automation:2,communication:3,delivery:4};

  window.__TAV46_CORE={clamp,mix,smooth,sub,add,mul,dot,cross,len,norm,perspective,lookAt,multiply,transform4,faceBasis,W,H,D,constraints,allPlanes,finalGeometry,shellGeometry,frontAssembly,boxGeometry,boxEdges,floorGeometry,anchorSets,zoneIndex};
})();
