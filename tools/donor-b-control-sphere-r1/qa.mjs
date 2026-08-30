import fs from 'node:fs';
import path from 'node:path';
const [,,portS,out,wS,hS,kind]=process.argv;
const port=+portS,w=+wS,h=+hS,sleep=ms=>new Promise(r=>setTimeout(r,ms));
fs.mkdirSync(out,{recursive:true});
let tabs=[];
for(let i=0;i<80;i++){
  try{tabs=await(await fetch(`http://127.0.0.1:${port}/json`)).json()}catch{}
  if(tabs.some(t=>t.type==='page'))break;
  await sleep(150);
}
const tab=tabs.find(t=>t.type==='page');
if(!tab)throw Error('CDP page target absent');
const ws=new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});
let id=0;
const pending=new Map(),exceptions=[],consoleErrors=[];
ws.onmessage=e=>{
  const m=JSON.parse(e.data);
  if(m.id&&pending.has(m.id)){
    const p=pending.get(m.id); pending.delete(m.id);
    m.error?p.j(Error(JSON.stringify(m.error))):p.r(m.result); return;
  }
  if(m.method==='Runtime.exceptionThrown')exceptions.push(m.params.exceptionDetails.text);
  if(m.method==='Log.entryAdded'&&m.params.entry.level==='error')consoleErrors.push(m.params.entry.text);
};
const send=(method,params={})=>new Promise((r,j)=>{const n=++id;pending.set(n,{r,j});ws.send(JSON.stringify({id:n,method,params}))});
const ev=async expression=>{const x=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(x.exceptionDetails)throw Error(x.exceptionDetails.text);return x.result?.value};
await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:kind==='mobile'});
if(kind==='reduce')await send('Emulation.setEmulatedMedia',{media:'',features:[{name:'prefers-reduced-motion',value:'reduce'}]});
await send('Page.navigate',{url:'http://127.0.0.1:4174/'});
let state=null;
for(let i=0;i<120;i++){state=await ev(`window.__PROAI_QA||null`);if(state)break;await sleep(200)}
if(!state)throw Error('PROAI runtime state absent');
const shot=async name=>{const x=await send('Page.captureScreenshot',{format:'png',fromSurface:true});fs.writeFileSync(path.join(out,name),Buffer.from(x.data,'base64'))};
const result={initial:state,exceptions,consoleErrors};
if(kind==='desktop'){
  await sleep(1100); const rest=await ev(`window.__PROAI_QA`); await shot('RUNTIME-DESKTOP-REST-1440x900.png');
  const rot0=rest.autoY; await sleep(1400); const rot1=(await ev(`window.__PROAI_QA`)).autoY;
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:840,y:390,button:'none',buttons:0});
  await sleep(1700); const engaged=await ev(`window.__PROAI_QA`); await shot('RUNTIME-DESKTOP-ENGAGED-1440x900.png');
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:1430,y:890,button:'none',buttons:0});
  await sleep(2200); const returned=await ev(`window.__PROAI_QA`);
  Object.assign(result,{rest,engaged,returned,rotationDelta:rot1-rot0});
  if(!(engaged.engaged>0.75))throw Error(`engaged state did not activate: ${engaged.engaged}`);
  if(!(returned.engaged<0.15))throw Error(`engaged state did not decay: ${returned.engaged}`);
  if(!(rot1-rot0>0.01))throw Error(`rotation did not advance: ${rot1-rot0}`);
}else if(kind==='mobile'){
  await sleep(1000); result.mobile=await ev(`window.__PROAI_QA`); await shot(`RUNTIME-MOBILE-${w}x${h}.png`);
}else{
  const a=(await ev(`window.__PROAI_QA`)).autoY; await sleep(1400); const b=(await ev(`window.__PROAI_QA`)).autoY;
  result.reducedMotionDelta=b-a;
  if(Math.abs(b-a)>0.001)throw Error(`reduced-motion rotation not frozen: ${b-a}`);
}
fs.writeFileSync(path.join(out,'QA.json'),JSON.stringify(result,null,2));
if(exceptions.length)throw Error('Runtime exceptions: '+exceptions.join(' | '));
const fatal=consoleErrors.filter(x=>!x.includes('Failed to load resource: the server responded with a status of 404'));
if(fatal.length)throw Error('Fatal console errors: '+fatal.join(' | '));
ws.close();
