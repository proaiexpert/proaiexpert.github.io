(function(){
  'use strict';
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  const mix = (a,b,t) => a+(b-a)*t;
  const smooth = t => { t=clamp(t,0,1); return t*t*(3-2*t); };
  const sub = (a,b) => [a[0]-b[0],a[1]-b[1],a[2]-b[2]];
  const add = (a,b) => [a[0]+b[0],a[1]+b[1],a[2]+b[2]];
  const mul = (a,s) => [a[0]*s,a[1]*s,a[2]*s];
  const dot = (a,b) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const len = a => Math.hypot(a[0],a[1],a[2]);
  const norm = a => { const l=len(a)||1; return [a[0]/l,a[1]/l,a[2]/l]; };

  function perspective(fovy,aspect,near,far){
    const f=1/Math.tan(fovy/2), nf=1/(near-far);
    return [f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*nf,-1, 0,0,(2*far*near)*nf,0];
  }
  function lookAt(eye,target,up){
    const z=norm(sub(eye,target));
    const x=norm(cross(up,z));
    const y=cross(z,x);
    return [x[0],y[0],z[0],0, x[1],y[1],z[1],0, x[2],y[2],z[2],0, -dot(x,eye),-dot(y,eye),-dot(z,eye),1];
  }
  function multiply(a,b){
    const out=new Array(16).fill(0);
    for(let c=0;c<4;c++) for(let r=0;r<4;r++){
      out[c*4+r]=a[0*4+r]*b[c*4+0]+a[1*4+r]*b[c*4+1]+a[2*4+r]*b[c*4+2]+a[3*4+r]*b[c*4+3];
    }
    return out;
  }
  function transform4(m,v){
    return [
      m[0]*v[0]+m[4]*v[1]+m[8]*v[2]+m[12]*v[3],
      m[1]*v[0]+m[5]*v[1]+m[9]*v[2]+m[13]*v[3],
      m[2]*v[0]+m[6]*v[1]+m[10]*v[2]+m[14]*v[3],
      m[3]*v[0]+m[7]*v[1]+m[11]*v[2]+m[15]*v[3]
    ];
  }

  function planeFromPoint(name,normal,point){
    const n=norm(normal);
    return {name,n,c:-dot(n,point),point:point.slice(),constraint:true};
  }

  const W=5.6,H=3.25,D=1.7;
  const basePlanes=[
    {name:'left',n:[1,0,0],c:W/2},
    {name:'right',n:[-1,0,0],c:W/2},
    {name:'bottom',n:[0,1,0],c:H/2},
    {name:'top',n:[0,-1,0],c:H/2},
    {name:'back',n:[0,0,1],c:D/2},
    {name:'front',n:[0,0,-1],c:D/2}
  ];
  const constraints=[
    planeFromPoint('process',[.52,-.82,.23],[-1.85,1.18,.20]),
    planeFromPoint('context',[-.74,-.52,.42],[1.85,1.00,.10]),
    planeFromPoint('control',[.68,.50,.54],[-1.70,-1.02,-.15]),
    planeFromPoint('integrations',[-.58,.62,-.53],[1.78,-1.10,.28])
  ];
  const allPlanes=basePlanes.concat(constraints);

  function intersect3(p1,p2,p3){
    const n1=p1.n,n2=p2.n,n3=p3.n;
    const n2xn3=cross(n2,n3), denom=dot(n1,n2xn3);
    if(Math.abs(denom)<1e-7) return null;
    const term1=mul(n2xn3,-p1.c);
    const term2=mul(cross(n3,n1),-p2.c);
    const term3=mul(cross(n1,n2),-p3.c);
    return mul(add(add(term1,term2),term3),1/denom);
  }
  function insideAll(p,planes){
    return planes.every(pl=>dot(pl.n,p)+pl.c>=-1e-5);
  }
  function uniquePush(arr,p){
    if(!arr.some(q=>len(sub(p,q))<1e-4)) arr.push(p);
  }
  function faceBasis(n){
    const ref=Math.abs(n[1])<.86?[0,1,0]:[1,0,0];
    const u=norm(cross(ref,n));
    const v=norm(cross(n,u));
    return [u,v];
  }
  function buildIntersectionGeometry(planes){
    const verts=[];
    for(let i=0;i<planes.length-2;i++) for(let j=i+1;j<planes.length-1;j++) for(let k=j+1;k<planes.length;k++){
      const p=intersect3(planes[i],planes[j],planes[k]);
      if(p&&insideAll(p,planes)) uniquePush(verts,p);
    }
    const positions=[],normals=[];
    const faceCenters={};
    planes.forEach(pl=>{
      let pts=verts.filter(p=>Math.abs(dot(pl.n,p)+pl.c)<1e-4);
      if(pts.length<3) return;
      const center=pts.reduce((a,p)=>add(a,p),[0,0,0]).map(v=>v/pts.length);
      const [u,v]=faceBasis(pl.n);
      pts=pts.slice().sort((a,b)=>{
        const da=sub(a,center), db=sub(b,center);
        return Math.atan2(dot(da,v),dot(da,u))-Math.atan2(dot(db,v),dot(db,u));
      });
      const outward=mul(pl.n,-1);
      if(dot(cross(sub(pts[1],pts[0]),sub(pts[2],pts[0])),outward)<0) pts.reverse();
      for(let i=1;i<pts.length-1;i++){
        [pts[0],pts[i],pts[i+1]].forEach(p=>{
          positions.push(p[0],p[1],p[2]);
          normals.push(outward[0],outward[1],outward[2]);
        });
      }
      faceCenters[pl.name]=center;
    });
    return {positions:new Float32Array(positions),normals:new Float32Array(normals),faceCenters,vertices:verts};
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
    for(let i=0;i<faces.length;i+=2){
      const q=faces[i],n=faces[i+1];
      [[0,1,2],[0,2,3]].forEach(t=>t.forEach(idx=>{const p=q[idx];pos.push(...p);nor.push(...n);}));
    }
    return {positions:new Float32Array(pos),normals:new Float32Array(nor)};
  }
  function buildBoxEdges(w,h,d){
    const x=w/2,y=h/2,z=d/2;
    const v=[[-x,-y,-z],[x,-y,-z],[x,y,-z],[-x,y,-z],[-x,-y,z],[x,-y,z],[x,y,z],[-x,y,z]];
    const e=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    const out=[];e.forEach(([a,b])=>out.push(...v[a],...v[b]));
    return new Float32Array(out);
  }

  const finalGeometry=buildIntersectionGeometry(allPlanes);
  const boxGeometry=buildBoxGeometry(W,H,D);
  const boxEdges=buildBoxEdges(W,H,D);

  const anchors={
    models:[-1.32,.58,.86],
    automation:[.84,.66,.86],
    communication:[-.86,-.58,.86],
    delivery:[1.34,-.40,.84]
  };

  window.__TAV4_CORE={
    clamp,mix,smooth,sub,add,mul,dot,cross,len,norm,perspective,lookAt,multiply,transform4,faceBasis,
    W,H,D,constraints,allPlanes,finalGeometry,boxGeometry,boxEdges,anchors
  };
})();
