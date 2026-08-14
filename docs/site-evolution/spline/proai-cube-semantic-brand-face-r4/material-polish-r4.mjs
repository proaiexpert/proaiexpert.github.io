import fs from 'node:fs';

const file = new URL('./main.generated.js', import.meta.url);
let source = fs.readFileSync(file, 'utf8');

const one = (find, replacement, label) => {
  const at = source.indexOf(find);
  if (at < 0 || source.indexOf(find, at + find.length) >= 0) throw new Error(`R4.3 material anchor ${label}`);
  source = source.slice(0, at) + replacement + source.slice(at + find.length);
};

const rx = (pattern, replacement, label) => {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  const matches = [...source.matchAll(new RegExp(pattern.source, flags))];
  if (matches.length !== 1) throw new Error(`R4.3 material regex ${label}: ${matches.length}`);
  source = source.replace(pattern, replacement);
};

one('  surfaceMaxOpacity: 0.065,', '  surfaceMaxOpacity: 0.000,', 'remove semantic slab');
one('  decelerationMs: 350,', '  decelerationMs: 0,', 'remove semantic deceleration');
one('  accelerationMs: 400,', '  accelerationMs: 0,', 'remove semantic acceleration');
one('  semanticVelocityMultiplier: 0.70,', '  semanticVelocityMultiplier: 1.0,', 'neutral semantic motion multiplier');

const material = `const SEMANTIC_R4_MATERIAL_PALETTE = Object.freeze({shadowMetal:'#20252A',midSilver:'#687077',pearlSilver:'#B8BBB8',peakReflection:'#D7D8D4'});
const SEMANTIC_R4_3_ENGRAVED_FACE = '+Z';
const SEMANTIC_R4_3_ENGRAVING = Object.freeze({bumpScale:-0.024,idleRoughness:.455,alignedRoughness:.285,idleMetalness:.84,alignedMetalness:.91,idleEnv:.76,alignedEnv:1.12,idleSpecular:.38,alignedSpecular:.74,driver:'persistent micro-normal + roughness/specular/metal response from face normal + camera view + stable key RectAreaLight half-vector + surface-space field'});
const semanticOpticalScratch={q:new THREE.Quaternion(),center:new THREE.Vector3(),camera:new THREE.Vector3(),light:new THREE.Vector3(),normal:new THREE.Vector3(),tx:new THREE.Vector3(),ty:new THREE.Vector3(),view:new THREE.Vector3(),lightDir:new THREE.Vector3(),half:new THREE.Vector3(),axis:new THREE.Vector2(),fieldCenter:new THREE.Vector2()};
let semanticR43OpticalDiagnostics={alignment:0,faceView:0,halfDot:0,fieldCenter:[.5,.5],fieldAxis:[1,0],opportunity:0,persistent:true,microNormal:true,alphaDominant:false,engravedFace:SEMANTIC_R4_3_ENGRAVED_FACE};
let semanticR43OpportunityCount=0,semanticR43OpportunityArmed=true;
const semanticMotionTrace=[];
function recordSemanticMotionSample(wallDeltaMs,effectiveDeltaMs){const wall=performance.now(),scale=wallDeltaMs>0?effectiveDeltaMs/wallDeltaMs:1;semanticMotionTrace.push({wallMs:wall,presentationMs:presentationSimTimeMs,semanticActive,semanticComplete,scale,yawVelocityDegPerSec:presentationYawVelocityDegPerSec,frameAngularDeltaRad:presentationFrameDeltaRad});if(semanticMotionTrace.length>960)semanticMotionTrace.splice(0,semanticMotionTrace.length-960)}
function cutSemanticSeam(ctx,size,c,h,f,vertical){const a=c-h-f,b=c+h+f,g=vertical?ctx.createLinearGradient(a,0,b,0):ctx.createLinearGradient(0,a,0,b),t=f/Math.max(1,b-a);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(Math.min(.49,t),'rgba(0,0,0,1)');g.addColorStop(Math.max(.51,1-t),'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;vertical?ctx.fillRect(a,0,b-a,size):ctx.fillRect(0,a,size,b-a)}
function createSeamAwareBrandMaskTexture(texture,faceSpan){const canvas=texture.image,ctx=canvas.getContext('2d',{alpha:true}),size=canvas.width,stepY=Math.abs(latticeCenters.Y[1]-latticeCenters.Y[0]),stepZ=Math.abs(latticeCenters.Z[1]-latticeCenters.Z[0]),gapY=Math.max(0,stepY-GEOMETRY_R1.faceOuterSize),gapZ=Math.max(0,stepZ-GEOMETRY_R1.faceOuterSize),feather=Math.max(.65,Math.min(1.50,Math.max(gapY,gapZ)*.44));ctx.save();ctx.globalCompositeOperation='destination-out';for(const p of [(latticeCenters.Y[0]+latticeCenters.Y[1])*.5,(latticeCenters.Y[1]+latticeCenters.Y[2])*.5])cutSemanticSeam(ctx,size,(.5+p/faceSpan)*size,gapY*.5/faceSpan*size,feather/faceSpan*size,true);for(const p of [(latticeCenters.Z[0]+latticeCenters.Z[1])*.5,(latticeCenters.Z[1]+latticeCenters.Z[2])*.5])cutSemanticSeam(ctx,size,(.5-p/faceSpan)*size,gapZ*.5/faceSpan*size,feather/faceSpan*size,false);ctx.restore();texture.needsUpdate=true;texture.userData.semanticSeamMask={gapY,gapZ,feather,source:'latticeCenters + GEOMETRY_R1.faceOuterSize'};return texture}
function createSemanticTextMaterial(maskTexture){const m=new THREE.MeshPhysicalMaterial({color:SEMANTIC_R4_MATERIAL_PALETTE.shadowMetal,map:maskTexture,bumpMap:maskTexture,bumpScale:SEMANTIC_R4_3_ENGRAVING.bumpScale,metalness:SEMANTIC_R4_3_ENGRAVING.idleMetalness,roughness:SEMANTIC_R4_3_ENGRAVING.idleRoughness,clearcoat:.035,clearcoatRoughness:.31,envMapIntensity:SEMANTIC_R4_3_ENGRAVING.idleEnv,ior:1.48,specularIntensity:SEMANTIC_R4_3_ENGRAVING.idleSpecular,specularColor:new THREE.Color(SEMANTIC_R4_MATERIAL_PALETTE.peakReflection),transparent:false,opacity:1,alphaTest:.025,depthWrite:false,depthTest:true,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});m.toneMapped=true;m.userData.semanticMaterial='SEMANTIC_R4_3_PERSISTENT_PHYSICAL_MICRO_ENGRAVING';m.userData.semanticOpticalState={alignment:0,center:new THREE.Vector2(.5,.5),axis:new THREE.Vector2(1,0),texel:new THREE.Vector2(1/Math.max(1,maskTexture.image?.width||2048),1/Math.max(1,maskTexture.image?.height||2048))};m.customProgramCacheKey=()=> 'proai-r4-3-micro-engraving-v1';m.onBeforeCompile=(shader)=>{const s=m.userData.semanticOpticalState;shader.uniforms.uSemanticAlignment={value:s.alignment};shader.uniforms.uSemanticFieldCenter={value:s.center.clone()};shader.uniforms.uSemanticFieldAxis={value:s.axis.clone()};shader.uniforms.uSemanticTexel={value:s.texel.clone()};shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\\nvarying vec2 vSemanticUv;').replace('#include <uv_vertex>','#include <uv_vertex>\\nvSemanticUv = uv;');shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\\nvarying vec2 vSemanticUv;\\nuniform float uSemanticAlignment;\\nuniform vec2 uSemanticFieldCenter;\\nuniform vec2 uSemanticFieldAxis;\\nuniform vec2 uSemanticTexel;').replace('#include <map_fragment>',\`#include <map_fragment>\\nvec2 semanticAxis=normalize(uSemanticFieldAxis+vec2(0.00001,0.0));\\nvec2 semanticCross=vec2(-semanticAxis.y,semanticAxis.x);\\nvec2 semanticDelta=vSemanticUv-uSemanticFieldCenter;\\nfloat semanticAlong=dot(semanticDelta,semanticAxis)/0.82;\\nfloat semanticAcross=dot(semanticDelta,semanticCross)/1.02;\\nfloat semanticBroad=exp(-(semanticAlong*semanticAlong+semanticAcross*semanticAcross)*1.20);\\nfloat semanticMask=texture2D(map,vSemanticUv).a;\\nfloat semanticL=texture2D(map,vSemanticUv-vec2(uSemanticTexel.x,0.0)).a;\\nfloat semanticR=texture2D(map,vSemanticUv+vec2(uSemanticTexel.x,0.0)).a;\\nfloat semanticD=texture2D(map,vSemanticUv-vec2(0.0,uSemanticTexel.y)).a;\\nfloat semanticU=texture2D(map,vSemanticUv+vec2(0.0,uSemanticTexel.y)).a;\\nvec2 semanticGrad=vec2(semanticR-semanticL,semanticU-semanticD);\\nfloat semanticEdge=clamp(length(semanticGrad)*2.4,0.0,1.0);\\nfloat semanticEdgeSide=dot(normalize(semanticGrad+vec2(0.00001)),semanticAxis);\\nfloat semanticLocal=clamp(uSemanticAlignment*(0.48+0.52*semanticBroad),0.0,1.0);\\nfloat semanticTone=0.86+semanticLocal*(0.12+0.10*semanticBroad)+semanticEdge*semanticEdgeSide*semanticLocal*0.055;\\ndiffuseColor.rgb*=semanticTone;\\ndiffuseColor.a*=step(0.025,semanticMask);\`).replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\\nroughnessFactor=clamp(roughnessFactor-semanticLocal*(0.055+0.070*semanticBroad)+semanticEdge*0.012,0.22,0.72);').replace('#include <metalnessmap_fragment>','#include <metalnessmap_fragment>\\nmetalnessFactor=clamp(metalnessFactor+semanticLocal*(0.025+0.025*semanticBroad),0.0,1.0);');m.userData.semanticShader=shader};return m}
function syncSemanticEngravingUniforms(material){const state=material.userData.semanticOpticalState,shader=material.userData.semanticShader;if(!shader||!state)return;shader.uniforms.uSemanticAlignment.value=state.alignment;shader.uniforms.uSemanticFieldCenter.value.copy(state.center);shader.uniforms.uSemanticFieldAxis.value.copy(state.axis)}
function updateSemanticEngravingState(mesh,index){if(index===0)return;const s=semanticOpticalScratch,q=mesh.getWorldQuaternion(s.q),center=mesh.getWorldPosition(s.center),cameraWorld=camera.getWorldPosition(s.camera),lightWorld=key.getWorldPosition(s.light),normal=s.normal.set(0,0,1).applyQuaternion(q).normalize(),tx=s.tx.set(1,0,0).applyQuaternion(q).normalize(),ty=s.ty.set(0,1,0).applyQuaternion(q).normalize(),view=s.view.copy(cameraWorld).sub(center).normalize(),lightDir=s.lightDir.copy(lightWorld).sub(center).normalize(),half=s.half.copy(view).add(lightDir).normalize();const faceView=THREE.MathUtils.clamp(normal.dot(view),0,1),halfDot=THREE.MathUtils.clamp(normal.dot(half),0,1),spec=smootherstep(THREE.MathUtils.clamp((halfDot-.57)/.36,0,1)),viewSupport=.34+.66*smootherstep(THREE.MathUtils.clamp((faceView-.30)/.58,0,1)),alignment=THREE.MathUtils.clamp(spec*viewSupport,0,1);let ax=lightDir.dot(tx),ay=lightDir.dot(ty),alen=Math.hypot(ax,ay);if(alen<.08){ax=.82;ay=.57;alen=Math.hypot(ax,ay)}s.axis.set(ax/alen,ay/alen);const hx=THREE.MathUtils.clamp(half.dot(tx),-.62,.62),hy=THREE.MathUtils.clamp(half.dot(ty),-.62,.62);s.fieldCenter.set(.5+hx*.14,.5+hy*.12);const state=mesh.material.userData.semanticOpticalState;state.alignment=alignment;state.center.copy(s.fieldCenter);state.axis.copy(s.axis);const shadow=new THREE.Color(SEMANTIC_R4_MATERIAL_PALETTE.shadowMetal),mid=new THREE.Color(SEMANTIC_R4_MATERIAL_PALETTE.midSilver),pearl=new THREE.Color(SEMANTIC_R4_MATERIAL_PALETTE.pearlSilver),c=shadow.clone().lerp(mid,.035+alignment*.30);c.lerp(pearl,alignment*.055);const m=mesh.material;m.color.copy(c);m.metalness=THREE.MathUtils.lerp(SEMANTIC_R4_3_ENGRAVING.idleMetalness,SEMANTIC_R4_3_ENGRAVING.alignedMetalness,alignment);m.roughness=THREE.MathUtils.lerp(SEMANTIC_R4_3_ENGRAVING.idleRoughness,SEMANTIC_R4_3_ENGRAVING.alignedRoughness,alignment);m.clearcoat=THREE.MathUtils.lerp(.028,.055,alignment);m.clearcoatRoughness=THREE.MathUtils.lerp(.34,.27,alignment);m.envMapIntensity=THREE.MathUtils.lerp(SEMANTIC_R4_3_ENGRAVING.idleEnv,SEMANTIC_R4_3_ENGRAVING.alignedEnv,alignment);m.specularIntensity=THREE.MathUtils.lerp(SEMANTIC_R4_3_ENGRAVING.idleSpecular,SEMANTIC_R4_3_ENGRAVING.alignedSpecular,alignment);syncSemanticEngravingUniforms(m);if(alignment>=.72&&semanticR43OpportunityArmed){semanticR43OpportunityCount++;semanticR43OpportunityArmed=false}else if(alignment<=.56)semanticR43OpportunityArmed=true;semanticR43OpticalDiagnostics={alignment,faceView,halfDot,fieldCenter:s.fieldCenter.toArray(),fieldAxis:s.axis.toArray(),opportunity:alignment,persistent:true,microNormal:true,alphaDominant:false,engravedFace:SEMANTIC_R4_3_ENGRAVED_FACE,naturalOpportunityCount:semanticR43OpportunityCount}}
function setSemanticOpticalState(mesh,index){updateSemanticEngravingState(mesh,index)}`;

rx(/function createSemanticTextMaterial\(maskTexture\) \{[\s\S]*?\n\}\n\nfunction setupSemanticSurface/, `${material}\n\nfunction setupSemanticSurface`, 'persistent physical engraving material');
one('  semanticMaskTexture = createBrandMaskTexture();', '  semanticMaskTexture = createSeamAwareBrandMaskTexture(createBrandMaskTexture(), faceSpan);', 'seam mask');
one('  semanticTextMeshes = [softText, sharpText];\n  semanticText = sharpText;', `  semanticTextMeshes = [softText, sharpText];
  softText.visible = false;
  sharpText.visible = true;
  semanticSurface.visible = false;
  semanticTextMeshes.forEach((mesh,index)=>{mesh.onBeforeRender=()=>setSemanticOpticalState(mesh,index)});
  semanticText = sharpText;`, 'single persistent engraving layer');
one('  orientSemanticGroup(SEMANTIC_R4.selectedFallbackFace);', `  semanticFace = SEMANTIC_R4_3_ENGRAVED_FACE;
  orientSemanticGroup(SEMANTIC_R4_3_ENGRAVED_FACE);`, 'fixed engraved face');

const visual = `function setSemanticVisualState() {
  if (!semanticReady) return false;
  semanticSurfaceProgress=0;semanticTextFormation=1;semanticTextLuminance=1;semanticSweep=.50;
  semanticSurface.material.opacity=0;semanticSurface.visible=false;
  semanticTextMeshes[0].visible=false;semanticTextMeshes[1].visible=true;
  semanticGroup.visible=true;
  semanticTextMeshes.forEach((mesh,index)=>setSemanticOpticalState(mesh,index));
  return true;
}`;
rx(/function setSemanticVisualState\([\s\S]*?\n\}\n\nfunction setSemanticReviewState/, `${visual}\n\nfunction setSemanticReviewState`, 'persistent visual state');

const clear = `function clearSemanticReviewState(){if(!semanticReady)return false;semanticSurfaceProgress=0;semanticTextFormation=1;semanticTextLuminance=1;semanticSweep=.50;semanticSurface.material.opacity=0;semanticSurface.visible=false;semanticTextMeshes[0].visible=false;semanticTextMeshes[1].visible=true;semanticGroup.visible=true;semanticTextMeshes.forEach((mesh,index)=>setSemanticOpticalState(mesh,index));return true;}`;
rx(/function clearSemanticReviewState\(\) \{[\s\S]*?\n\}\n\nfunction semanticTimelineState/, `${clear}\n\nfunction semanticTimelineState`, 'persistent clear state');

const timeline = `function semanticTimelineState(elapsedMs) {
  const total=SEMANTIC_R4.revealMs+SEMANTIC_R4.readableHoldMs+SEMANTIC_R4.exitMs;
  const envelopeIn=smootherstep(THREE.MathUtils.clamp(elapsedMs/720,0,1)),envelopeOut=1-smootherstep(THREE.MathUtils.clamp((elapsedMs-1450)/920,0,1)),opportunityEnvelope=envelopeIn*envelopeOut;
  return {timeScale:1,surface:0,formation:1,luminance:opportunityEnvelope,sweep:.50,exit:0,holdEnd:SEMANTIC_R4.revealMs+SEMANTIC_R4.readableHoldMs,blockRelease:0,total,opportunityEnvelope};
}`;
rx(/function semanticTimelineState\(elapsedMs\) \{[\s\S]*?\n\}\n\nfunction beginSemanticRuntime/, `${timeline}\n\nfunction beginSemanticRuntime`, 'neutral opportunity envelope');

const runtime = `function beginSemanticRuntime(now) {
  semanticFace=SEMANTIC_R4_3_ENGRAVED_FACE;
  semanticVisibilityDot=semanticR43OpticalDiagnostics.faceView;
  semanticActive=true;semanticPending=false;semanticComplete=false;semanticBlocksSlices=false;semanticTimeScale=1;
  semanticStartWallMs=now;semanticElapsedMs=0;semanticEntryPresentationMs=presentationSimTimeMs;semanticHoldPresentationMs=null;semanticFirstSurfaceWallMs=null;semanticFirstTypographyWallMs=now;semanticCompletedWallMs=null;
  semanticSchedulerEntry={eventSerial:sliceEventSerial,eventsUntilBreath,seed:sliceSeed>>>0};
}

function replaySemanticBrandMoment(){if(!semanticReady||captureMode||prefersReducedMotion)return false;semanticReplayRequested=true;semanticComplete=false;semanticActive=false;semanticPending=false;semanticBlocksSlices=false;semanticTimeScale=1;return true}

function updateSemanticRuntime(now){
  if(captureMode||!semanticReady)return;
  semanticTimeScale=1;semanticBlocksSlices=false;
  if(prefersReducedMotion){setSemanticVisualState();return}
  if(!semanticActive&&!semanticComplete){
    if(!semanticReplayRequested&&presentationSimTimeMs<SEMANTIC_R4.triggerSearchStartMs)return;
    if(!semanticPending){semanticPending=true;semanticOpportunityWallMs=now;semanticOpportunityPresentationMs=presentationSimTimeMs;semanticOpportunityActiveTurns=activeTurns.size;semanticWaitedForActiveSlice=false}
    beginSemanticRuntime(now);semanticReplayRequested=false;
  }
  if(!semanticActive){setSemanticVisualState();return}
  semanticElapsedMs=Math.max(0,now-semanticStartWallMs);const state=semanticTimelineState(semanticElapsedMs);setSemanticVisualState();
  if(semanticHoldPresentationMs===null&&semanticElapsedMs>=SEMANTIC_R4.revealMs)semanticHoldPresentationMs=presentationSimTimeMs;
  if(semanticElapsedMs>=state.total){semanticTimeScale=1;semanticBlocksSlices=false;semanticActive=false;semanticPending=false;semanticComplete=true;semanticCompletedWallMs=now;semanticSchedulerExit={eventSerial:sliceEventSerial,eventsUntilBreath,seed:sliceSeed>>>0};clearSemanticReviewState()}
}`;
rx(/function beginSemanticRuntime\(now, best = getCurrentBestFaceVisibility\(\)\) \{[\s\S]*?\n\}\n\nfunction replaySemanticBrandMoment\(\) \{[\s\S]*?\n\}\n\nfunction updateSemanticRuntime\(now\) \{[\s\S]*?\n\}\n\nfunction getSemanticDiagnostics/, `${runtime}\n\nfunction getSemanticDiagnostics`, 'passive semantic lifecycle');

one('  const deltaMs = wallDeltaMs * semanticTimeScale;', `  const deltaMs = wallDeltaMs;
  recordSemanticMotionSample(wallDeltaMs, deltaMs);`, 'global presentation motion decoupling');

one('    textMeshCount: semanticTextMeshes.length,\n', `    textMeshCount: semanticTextMeshes.length,
    materialModel: 'MeshPhysicalMaterial / R4.3 persistent physical micro-engraving',
    materialPalette: SEMANTIC_R4_MATERIAL_PALETTE,
    revealCharacter: 'persistent engraving / orientation-driven legibility / no reveal animation',
    opticalDriver: SEMANTIC_R4_3_ENGRAVING.driver,
    opticalField: semanticR43OpticalDiagnostics,
    baseInlayTreatment: 'permanent black-chrome micro-engraving with bump-derived edge normals and restrained roughness/specular contrast',
    persistentInscription: true,
    alphaDominantReveal: false,
    microNormalEngraving: true,
    semanticMotionCoupled: false,
    semanticOrientationForcing: false,
    semanticAcceleration: false,
    semanticDeceleration: false,
    effectiveGlobalMotionScale: 1.0,
    naturalOpportunityCount: semanticR43OpportunityCount,
    motionTrace: semanticMotionTrace.slice(-960),
    seamAwareOcclusion: true,
    seamMaskSource: semanticMaskTexture?.userData?.semanticSeamMask?.source || null,
    emissive: false,
    glowHalo: false,
    scanWipeShimmer: false,
    letterWordStagger: false,
`, 'R4.3 diagnostics');

fs.writeFileSync(file, source);
console.log(JSON.stringify({material:'MeshPhysicalMaterial / R4.3 persistent physical micro-engraving',engravedFace:'+Z',surfaceMaxOpacity:0,persistentInscription:true,alphaDominantReveal:false,microNormalEngraving:true,opticalDriver:'persistent micro-normal + roughness/specular/metal response from face normal + camera view + stable key RectAreaLight half-vector + surface-space field',seamAwareOcclusion:true,emissive:false,glowHalo:false,scanWipeShimmer:false,letterWordStagger:false,semanticVelocityMultiplier:1,semanticAcceleration:false,semanticDeceleration:false,semanticOrientationForcing:false,semanticMotionCoupled:false,effectiveGlobalMotionScale:1,timing:{triggerSearchStartMs:3200,triggerSearchEndMs:4200,opportunityEnvelopeMs:2370},motionChangedBySemantic:false},null,2));
