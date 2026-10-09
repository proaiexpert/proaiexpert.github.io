// R1C controlled material diagnostic on the ORIGINAL donor. No reconstructed geometry.
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
const out='artifacts/orb-r1c';await mkdir(out,{recursive:true});
const srv=spawn('python3',['-m','http.server','8768','--bind','127.0.0.1'],{stdio:'ignore'});
await new Promise(r=>setTimeout(r,1000));
const report={task:'R1C',evidenceType:'browser visual material diagnostic',results:[],errors:[],time:new Date().toISOString()};
let browser;
try{
browser=await chromium.launch({headless:true,args:['--enable-unsafe-webgpu','--enable-features=WebGPU','--use-angle=swiftshader']});
const page=await browser.newPage({viewport:{width:1100,height:850},deviceScaleFactor:1});
page.on('pageerror',e=>report.errors.push('pageerror:'+String(e).slice(0,300)));
const src='http://127.0.0.1:8768/owner-preview/ai-systems-reactive-orb-runtime-r1b/index.html?view=adapted&qaPause=1';
await page.goto(src,{waitUntil:'domcontentloaded'});
await page.waitForFunction(()=>window.__proaiOrbR1B?.load==='PASS',null,{timeout:90000});
const bbox=await page.locator('#orb-canvas').boundingBox();
if(!bbox||bbox.width<400)throw Error('No renderable original runtime canvas');
const clip={x:Math.round(bbox.x),y:Math.round(bbox.y),width:Math.floor(bbox.width)-1,height:Math.floor(bbox.height)-1};
const measure=async(name)=>{
  const buf=await page.screenshot({clip,timeout:18000,animations:'disabled',path:out+'/'+name+'.png'});
  return page.evaluate(async b64=>{
    const binary=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
    const img=await createImageBitmap(new Blob([binary],{type:'image/png'}));
    const c=document.createElement('canvas');c.width=img.width;c.height=img.height;
    const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0);img.close();
    const p=x.getImageData(0,0,c.width,c.height).data;let lit=0,teal=0,red=0,neutral=0,total=0;
    for(let i=0;i<p.length;i+=4){let r=p[i],g=p[i+1],b=p[i+2];total++;
       if(r+g+b>90){lit++; if(g>r*1.35&&b>r*1.2&&g>45)teal++;if(r>g*1.45&&r>b*1.2&&r>70)red++;if(Math.max(r,g,b)-Math.min(r,g,b)<30)neutral++;}
    }return {lit,teal,red,neutral,total,tealPerLit:lit?+(teal/lit).toFixed(4):null,neutralPerLit:lit?+(neutral/lit).toFixed(4):null};
  },buf.toString('base64'));
};
function errsafe(e){return String(e?.message||e).slice(0,300)}
const inspect=await page.evaluate(()=>{
 const app=window.__proaiOrbRuntime,o=app.getAllObjects(),map=new Map(o.map(x=>[x.uuid,x]));
 const chain=s=>{let result=[],p=s;for(let j=0;j<7&&p;j++){result.push(p.name);p=map.get(p.parentUuid)}return result};
 const cl=o.filter(x=>x.name==='Sphere'&&Array.isArray(x.material?.layers)&&chain(x).some(n=>/^Clone (?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9])$/.test(n)));
 window.__r1cTargets=cl;
 const m=cl[0]?.material;
 const summarize=l=>({type:l.type,alpha:l.alpha,category:l.category,color:l.color,colors:l.colors,steps:l.steps,specular:l.specular,shininess:l.shininess,bias:l.bias,intensity:l.intensity,keys:Object.keys(l)});
 return {objectCount:o.length,clones:cl.length,material:m?.layers.map(summarize),requestRender:typeof app.requestRender,renderMode:app.renderMode,sceneRenderer:typeof app._controls};
});
report.inspection=inspect;
if(inspect.clones!==250||inspect.objectCount!==769)throw Error('Original clone topology mismatch');
await page.waitForTimeout(1200);
const baseline=await measure('original-rest');
report.baseline=baseline;
const variants=[
  {name:'fresnel-neutral',effect:'fresnel'},
  {name:'depth-neutral',effect:'depth'},
  {name:'lighting-neutral',effect:'light'}
];
for(const v of variants){
  const r=await page.evaluate(effect=>{
    const app=window.__proaiOrbRuntime,tar=window.__r1cTargets;
    const summary={targeted:tar.length,attempted:0,readback:0,errors:[],examples:[]};
    for(const o of tar){
      const layer=o.material.layers.find(l=>l.type===effect);
      if(!layer)continue;
      try{
        if(effect==='fresnel'){layer.color='#E1E6EC';summary.attempted++;if(layer.color==='#E1E6EC')summary.readback++;}
        if(effect==='depth'){
          const prior=layer.colors;if(!Array.isArray(prior)||prior.length===0)continue;
          const grays=[[0.065,0.078,0.105,1],[0.18,0.22,0.27,1],[0.37,0.42,0.48,1],[0.83,0.87,0.92,1]];
          layer.colors=prior.map((_,i)=>grays[Math.min(3,Math.floor(i*4/prior.length))]);
          summary.attempted++;if(layer.colors?.length===prior.length&&Array.isArray(layer.colors[0]))summary.readback++;
        }
        if(effect==='light'){
          if(layer.category!=='phong'||!layer.specular)continue;
          layer.specular={r:0.79,g:0.82,b:0.87};summary.attempted++;
          if(Math.abs(layer.specular?.r-0.79)<0.01)summary.readback++;
        }
        if(summary.examples.length<2)summary.examples.push({name:o.name,layerType:layer.type,after:effect==='depth'?layer.colors:effect==='fresnel'?layer.color:layer.specular});
      }catch(e){summary.errors.push(String(e).slice(0,100));}
    }
    app.requestRender?.();
    return summary;
  },v.effect);
  await page.waitForTimeout(1200);
  const pixels=await measure(v.name);
  report.results.push({variant:v.name,edit:r,pixels,deltaTealFraction:+(pixels.tealPerLit-baseline.tealPerLit).toFixed(4)});
  // Reload real untouched donor for next isolated layer test.
  if(v!==variants[variants.length-1]){
    await page.reload({waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.__proaiOrbR1B?.load==='PASS',null,{timeout:90000});
    await page.evaluate(()=>{const a=window.__proaiOrbRuntime,objs=a.getAllObjects(),map=new Map(objs.map(x=>[x.uuid,x]));const chain=x=>{let p=x,n=[];for(let j=0;j<7&&p;j++){n.push(p.name);p=map.get(p.parentUuid)}return n};window.__r1cTargets=objs.filter(o=>o.name==='Sphere'&&Array.isArray(o.material?.layers)&&chain(o).some(n=>/^Clone (?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9])$/.test(n)));});
    await page.waitForTimeout(1200);
  }
}
}catch(e){report.errors.push('harness:'+String(e?.stack||e))}
finally{await writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log('R1C_REPORT_BEGIN\n'+JSON.stringify(report,null,2)+'\nR1C_REPORT_END');await browser?.close().catch(()=>{});srv.kill('SIGTERM');}
if(report.errors.length||report.results.length!==3)process.exitCode=1;
