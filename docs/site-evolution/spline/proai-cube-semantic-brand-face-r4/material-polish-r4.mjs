import fs from 'node:fs';

const file = new URL('./main.generated.js', import.meta.url);
let source = fs.readFileSync(file, 'utf8');

const one = (find, replacement, label) => {
  const at = source.indexOf(find);
  if (at < 0 || source.indexOf(find, at + find.length) >= 0) throw new Error(`R4.2 material anchor ${label}`);
  source = source.slice(0, at) + replacement + source.slice(at + find.length);
};

const rx = (pattern, replacement, label) => {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  const matches = [...source.matchAll(new RegExp(pattern.source, flags))];
  if (matches.length !== 1) throw new Error(`R4.2 material regex ${label}: ${matches.length}`);
  source = source.replace(pattern, replacement);
};

one('  surfaceMaxOpacity: 0.065,', '  surfaceMaxOpacity: 0.020,', 'surface opacity');

const material = `const SEMANTIC_R4_MATERIAL_PALETTE = Object.freeze({shadowMetal:'#6B7176',midSilver:'#959CA1',pearlSilver:'#C7CAC7',peakReflection:'#E0E1DD'});
const SEMANTIC_R4_2_OPTICAL = Object.freeze({fieldAlong:.78,fieldAcross:.96,spatialPhase:.10,baseAlphaSharp:.034,baseAlphaSoft:.010,eventAlphaSharp:.48,eventAlphaSoft:.072,driver:'face normal + camera view + key RectAreaLight half-vector + broad surface-space lobe'});
const semanticOpticalScratch={q:new THREE.Quaternion(),center:new THREE.Vector3(),camera:new THREE.Vector3(),light:new THREE.Vector3(),normal:new THREE.Vector3(),tx:new THREE.Vector3(),ty:new THREE.Vector3(),view:new THREE.Vector3(),lightDir:new THREE.Vector3(),half:new THREE.Vector3(),axis:new THREE.Vector2(),fieldCenter:new THREE.Vector2()};
let semanticR42OpticalDiagnostics={alignment:0,faceView:0,halfDot:0,fieldCenter:[.5,.5],fieldAxis:[1,0],opportunity:0,presence:0,release:0};
function cutSemanticSeam(ctx,size,c,h,f,vertical){const a=c-h-f,b=c+h+f,g=vertical?ctx.createLinearGradient(a,0,b,0):ctx.createLinearGradient(0,a,0,b),t=f/Math.max(1,b-a);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(Math.min(.49,t),'rgba(0,0,0,1)');g.addColorStop(Math.max(.51,1-t),'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;vertical?ctx.fillRect(a,0,b-a,size):ctx.fillRect(0,a,size,b-a)}
function createSeamAwareBrandMaskTexture(texture,faceSpan){const canvas=texture.image,ctx=canvas.getContext('2d',{alpha:true}),size=canvas.width,stepY=Math.abs(latticeCenters.Y[1]-latticeCenters.Y[0]),stepZ=Math.abs(latticeCenters.Z[1]-latticeCenters.Z[0]),gapY=Math.max(0,stepY-GEOMETRY_R1.faceOuterSize),gapZ=Math.max(0,stepZ-GEOMETRY_R1.faceOuterSize),feather=Math.max(.65,Math.min(1.50,Math.max(gapY,gapZ)*.44));ctx.save();ctx.globalCompositeOperation='destination-out';for(const p of [(latticeCenters.Y[0]+latticeCenters.Y[1])*.5,(latticeCenters.Y[1]+latticeCenters.Y[2])*.5])cutSemanticSeam(ctx,size,(.5+p/faceSpan)*size,gapY*.5/faceSpan*size,feather/faceSpan*size,true);for(const p of [(latticeCenters.Z[0]+latticeCenters.Z[1])*.5,(latticeCenters.Z[1]+latticeCenters.Z[2])*.5])cutSemanticSeam(ctx,size,(.5-p/faceSpan)*size,gapZ*.5/faceSpan*size,feather/faceSpan*size,false);ctx.restore();texture.needsUpdate=true;texture.userData.semanticSeamMask={gapY,gapZ,feather,source:'latticeCenters + GEOMETRY_R1.faceOuterSize'};return texture}
function createSemanticTextMaterial(maskTexture){const peakReflection=SEMANTIC_R4_MATERIAL_PALETTE.peakReflection;const m=new THREE.MeshPhysicalMaterial({color:SEMANTIC_R4_MATERIAL_PALETTE.shadowMetal,map:maskTexture,metalness:.64,roughness:.52,clearcoat:.025,clearcoatRoughness:.37,envMapIntensity:.70,ior:1.48,specularIntensity:.54,specularColor:new THREE.Color(peakReflection),transparent:true,opacity:1,alphaTest:.0035,depthWrite:false,depthTest:true});m.toneMapped=true;m.userData.semanticMaterial='SEMANTIC_R4_2_SOFT_SPATIAL_OPTICAL_DISCOVERY';m.userData.semanticOpticalState={presence:0,opportunity:0,alignment:.65,baseAlpha:.034,eventAlpha:.48,center:new THREE.Vector2(.5,.5),axis:new THREE.Vector2(1,0)};m.customProgramCacheKey=()=> 'proai-r4-2-spatial-optical-v1';m.onBeforeCompile=(shader)=>{const s=m.userData.semanticOpticalState;shader.uniforms.uSemanticPresence={value:s.presence};shader.uniforms.uSemanticOpportunity={value:s.opportunity};shader.uniforms.uSemanticAlignment={value:s.alignment};shader.uniforms.uSemanticBaseAlpha={value:s.baseAlpha};shader.uniforms.uSemanticEventAlpha={value:s.eventAlpha};shader.uniforms.uSemanticFieldCenter={value:s.center.clone()};shader.uniforms.uSemanticFieldAxis={value:s.axis.clone()};shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\\nvarying vec2 vSemanticUv;').replace('#include <uv_vertex>','#include <uv_vertex>\\nvSemanticUv = uv;');shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\\nvarying vec2 vSemanticUv;\\nuniform float uSemanticPresence;\\nuniform float uSemanticOpportunity;\\nuniform float uSemanticAlignment;\\nuniform float uSemanticBaseAlpha;\\nuniform float uSemanticEventAlpha;\\nuniform vec2 uSemanticFieldCenter;\\nuniform vec2 uSemanticFieldAxis;').replace('#include <map_fragment>',\`#include <map_fragment>\\nvec2 semanticDelta=vSemanticUv-uSemanticFieldCenter;\\nvec2 semanticAxis=normalize(uSemanticFieldAxis+vec2(0.00001,0.0));\\nvec2 semanticCross=vec2(-semanticAxis.y,semanticAxis.x);\\nfloat semanticAlong=dot(semanticDelta,semanticAxis)/${SEMANTIC_R4_2_OPTICAL.fieldAlong.toFixed(2)};\\nfloat semanticAcross=dot(semanticDelta,semanticCross)/${SEMANTIC_R4_2_OPTICAL.fieldAcross.toFixed(2)};\\nfloat semanticBroad=exp(-(semanticAlong*semanticAlong+semanticAcross*semanticAcross)*1.35);\\nfloat semanticLocalOpportunity=clamp(uSemanticOpportunity*mix(0.80,1.00,semanticBroad)+(semanticBroad-0.58)*${SEMANTIC_R4_2_OPTICAL.spatialPhase.toFixed(2)},0.0,1.0);\\nsemanticLocalOpportunity=semanticLocalOpportunity*semanticLocalOpportunity*(3.0-2.0*semanticLocalOpportunity);\\nfloat semanticOptical=clamp(semanticLocalOpportunity*uSemanticAlignment,0.0,1.0);\\nfloat semanticAlpha=uSemanticBaseAlpha+uSemanticEventAlpha*uSemanticPresence*(0.10+0.90*semanticOptical);\\ndiffuseColor.a*=semanticAlpha;\`).replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\\nroughnessFactor=clamp(roughnessFactor-semanticOptical*0.085,0.22,1.0);').replace('#include <metalnessmap_fragment>','#include <metalnessmap_fragment>\\nmetalnessFactor=clamp(metalnessFactor+semanticOptical*0.035,0.0,1.0);');m.userData.semanticShader=shader};return m}
function updateSemanticOpticalState(mesh,index,presence,opportunity,release){const s=semanticOpticalScratch,q=mesh.getWorldQuaternion(s.q),center=mesh.getWorldPosition(s.center),cameraWorld=camera.getWorldPosition(s.camera),lightWorld=key.getWorldPosition(s.light),normal=s.normal.set(0,0,1).applyQuaternion(q).normalize(),tx=s.tx.set(1,0,0).applyQuaternion(q).normalize(),ty=s.ty.set(0,1,0).applyQuaternion(q).normalize(),view=s.view.copy(cameraWorld).sub(center).normalize(),lightDir=s.lightDir.copy(lightWorld).sub(center).normalize(),half=s.half.copy(view).add(lightDir).normalize();const faceView=THREE.MathUtils.clamp(normal.dot(view),0,1),halfDot=THREE.MathUtils.clamp(normal.dot(half),0,1),halfAlignment=smootherstep(THREE.MathUtils.clamp((halfDot-.46)/.50,0,1)),viewSupport=.88+.12*smootherstep(THREE.MathUtils.clamp((faceView-.52)/.42,0,1)),alignment=(.58+.42*halfAlignment)*viewSupport;let ax=lightDir.dot(tx),ay=lightDir.dot(ty),alen=Math.hypot(ax,ay);if(alen<.08){ax=.82;ay=.57;alen=Math.hypot(ax,ay)}s.axis.set(ax/alen,ay/alen);const hx=THREE.MathUtils.clamp(half.dot(tx),-.58,.58),hy=THREE.MathUtils.clamp(half.dot(ty),-.58,.58);s.fieldCenter.set(.5+hx*.13,.5+hy*.11);const soft=index===0,state=mesh.material.userData.semanticOpticalState;baseSemanticOpticalState(state,{presence,opportunity:opportunity*(1-release*.70),alignment,baseAlpha:soft?SEMANTIC_R4_2_OPTICAL.baseAlphaSoft:SEMANTIC_R4_2_OPTICAL.baseAlphaSharp,eventAlpha:soft?SEMANTIC_R4_2_OPTICAL.eventAlphaSoft:SEMANTIC_R4_2_OPTICAL.eventAlphaSharp,center:s.fieldCenter,axis:s.axis});const opticalMoment=THREE.MathUtils.clamp(opportunity*alignment*(1-release*.80),0,1),shadow=new THREE.Color(SEMANTIC_R4_MATERIAL_PALETTE.shadowMetal),mid=new THREE.Color(SEMANTIC_R4_MATERIAL_PALETTE.midSilver),pearl=new THREE.Color(SEMANTIC_R4_MATERIAL_PALETTE.pearlSilver),c=shadow.clone().lerp(mid,(soft?.10:.16)+opticalMoment*(soft?.12:.20));c.lerp(pearl,opticalMoment*(soft?.06:.16));const m=mesh.material;m.color.copy(c);m.metalness=THREE.MathUtils.lerp(soft?.56:.64,soft?.62:.71,opticalMoment);m.roughness=THREE.MathUtils.lerp(soft?.60:.52,soft?.50:.38,opticalMoment);m.clearcoat=THREE.MathUtils.lerp(soft?.012:.025,soft?.035:.060,opticalMoment);m.clearcoatRoughness=THREE.MathUtils.lerp(.39,soft?.35:.30,opticalMoment);m.envMapIntensity=THREE.MathUtils.lerp(soft?.58:.70,soft?.75:.98,opticalMoment);m.specularIntensity=THREE.MathUtils.lerp(soft?.42:.54,soft?.56:.72,opticalMoment);if(index===1)semanticR42OpticalDiagnostics={alignment,faceView,halfDot,fieldCenter:s.fieldCenter.toArray(),fieldAxis:s.axis.toArray(),opportunity,presence,release}}
function baseSemanticOpticalState(state,next){state.presence=next.presence;state.opportunity=next.opportunity;state.alignment=next.alignment;state.baseAlpha=next.baseAlpha;state.eventAlpha=next.eventAlpha;state.center.copy(next.center);state.axis.copy(next.axis);const shader=state===undefined?null:null}
function syncSemanticOpticalUniforms(material){const state=material.userData.semanticOpticalState,shader=material.userData.semanticShader;if(!shader||!state)return;shader.uniforms.uSemanticPresence.value=state.presence;shader.uniforms.uSemanticOpportunity.value=state.opportunity;shader.uniforms.uSemanticAlignment.value=state.alignment;shader.uniforms.uSemanticBaseAlpha.value=state.baseAlpha;shader.uniforms.uSemanticEventAlpha.value=state.eventAlpha;shader.uniforms.uSemanticFieldCenter.value.copy(state.center);shader.uniforms.uSemanticFieldAxis.value.copy(state.axis)}
function setSemanticOpticalState(mesh,index,presence,opportunity,release){updateSemanticOpticalState(mesh,index,presence,opportunity,release);syncSemanticOpticalUniforms(mesh.material)}`;

rx(/function createSemanticTextMaterial\(maskTexture\) \{[\s\S]*?\n\}\n\nfunction setupSemanticSurface/, `${material}\n\nfunction setupSemanticSurface`, 'physical spatial material');
one('  semanticMaskTexture = createBrandMaskTexture();', '  semanticMaskTexture = createSeamAwareBrandMaskTexture(createBrandMaskTexture(), faceSpan);', 'seam mask');
one('  semanticTextMeshes = [softText, sharpText];\n  semanticText = sharpText;', `  semanticTextMeshes = [softText, sharpText];
  semanticTextMeshes.forEach((mesh,index)=>{mesh.onBeforeRender=()=>setSemanticOpticalState(mesh,index,semanticTextFormation,semanticTextLuminance,semanticR42OpticalDiagnostics.release||0)});
  semanticText = sharpText;`, 'per-frame optical update');

const visual = `function setSemanticVisualState({ face = semanticFace, surface = 0, formation = 0, luminance = 0, sweep = 0.50, exit = 0 } = {}) {
  if (!semanticReady) return false;
  orientSemanticGroup(face);
  semanticSurfaceProgress=THREE.MathUtils.clamp(surface,0,1);semanticTextFormation=THREE.MathUtils.clamp(formation,0,1);semanticTextLuminance=THREE.MathUtils.clamp(luminance,0,1);semanticSweep=.50;
  const release=THREE.MathUtils.clamp(exit,0,1),presence=smootherstep(THREE.MathUtils.clamp((semanticTextFormation-.04)/.96,0,1)),opportunity=semanticTextLuminance;
  semanticR42OpticalDiagnostics.release=release;
  semanticSurface.material.opacity=SEMANTIC_R4.surfaceMaxOpacity*semanticSurfaceProgress*.25;semanticSurface.material.roughness=THREE.MathUtils.lerp(.405,.398,semanticSurfaceProgress);semanticSurface.material.envMapIntensity=THREE.MathUtils.lerp(.90,.93,semanticSurfaceProgress);
  semanticTextMeshes.forEach((mesh,index)=>setSemanticOpticalState(mesh,index,presence,opportunity,release));
  semanticGroup.visible=semanticSurfaceProgress>.001||presence>.001||opportunity>.001;return true;
}`;
rx(/function setSemanticVisualState\([\s\S]*?\n\}\n\nfunction setSemanticReviewState/, `${visual}\n\nfunction setSemanticReviewState`, 'visual state');

const clear = `function clearSemanticReviewState(){if(!semanticReady)return false;semanticSurfaceProgress=0;semanticTextFormation=0;semanticTextLuminance=0;semanticSweep=.50;semanticSurface.material.opacity=0;semanticR42OpticalDiagnostics={...semanticR42OpticalDiagnostics,opportunity:0,presence:0,release:1};semanticTextMeshes.forEach((mesh,index)=>{setSemanticOpticalState(mesh,index,0,0,1)});semanticGroup.visible=false;return true;}`;
rx(/function clearSemanticReviewState\(\) \{[\s\S]*?\n\}\n\nfunction semanticTimelineState/, `${clear}\n\nfunction semanticTimelineState`, 'clear state');

const timeline = `function semanticTimelineState(elapsedMs) {
  const revealEnd=SEMANTIC_R2.revealMs,holdEnd=revealEnd+SEMANTIC_R2.readableHoldMs,exitEnd=holdEnd+SEMANTIC_R2.exitMs,accelStart=holdEnd+80,accelEnd=accelStart+SEMANTIC_R2.accelerationMs,blockRelease=holdEnd+SEMANTIC_R2.exitMs*SEMANTIC_R2.blockReleaseExitProgress,total=Math.max(exitEnd,accelEnd);
  let timeScale=SEMANTIC_R2.semanticVelocityMultiplier;if(elapsedMs<SEMANTIC_R2.decelerationMs)timeScale=THREE.MathUtils.lerp(1,SEMANTIC_R2.semanticVelocityMultiplier,smootherstep(elapsedMs/SEMANTIC_R2.decelerationMs));else if(elapsedMs>=accelStart)timeScale=THREE.MathUtils.lerp(SEMANTIC_R2.semanticVelocityMultiplier,1,smootherstep((elapsedMs-accelStart)/SEMANTIC_R2.accelerationMs));
  const surfaceIn=smootherstep(elapsedMs/SEMANTIC_R2.revealMs),surfaceLeave=1-smootherstep(THREE.MathUtils.clamp((elapsedMs-940)/760,0,1));let surface=surfaceIn*surfaceLeave;
  let formation=smootherstep((elapsedMs-SEMANTIC_R2.firstTypographyMs)/Math.max(1,SEMANTIC_R2.revealMs-SEMANTIC_R2.firstTypographyMs));
  const discoveryIn=smootherstep(THREE.MathUtils.clamp((elapsedMs-(SEMANTIC_R2.firstTypographyMs+70))/580,0,1)),discoveryOut=1-smootherstep(THREE.MathUtils.clamp((elapsedMs-900)/820,0,1));let luminance=discoveryIn*discoveryOut;
  let exit=0;if(elapsedMs>=holdEnd){exit=smootherstep((elapsedMs-holdEnd)/SEMANTIC_R2.exitMs);formation*=1-exit;luminance*=1-smootherstep(THREE.MathUtils.clamp(exit/.62,0,1));surface*=1-exit}
  return {timeScale,surface,formation,luminance,sweep:.50,exit,holdEnd,blockRelease,total};
}`;
rx(/function semanticTimelineState\(elapsedMs\) \{[\s\S]*?\n\}\n\nfunction beginSemanticRuntime/, `${timeline}\n\nfunction beginSemanticRuntime`, 'optical opportunity timeline');

one('    textMeshCount: semanticTextMeshes.length,\n', `    textMeshCount: semanticTextMeshes.length,
    materialModel: 'MeshPhysicalMaterial / R4.2 soft spatial optical discovery',
    materialPalette: SEMANTIC_R4_MATERIAL_PALETTE,
    revealCharacter: 'hidden material inlay / broad studio-light discovery / transient alignment / reflection-first return',
    opticalDriver: SEMANTIC_R4_2_OPTICAL.driver,
    opticalField: semanticR42OpticalDiagnostics,
    baseInlayTreatment: 'shadow-metal micro-presence via roughness/metalness/specular distinction; not continuously readable',
    seamAwareOcclusion: true,
    seamMaskSource: semanticMaskTexture?.userData?.semanticSeamMask?.source || null,
    emissive: false,
    glowHalo: false,
    scanWipeShimmer: false,
    letterWordStagger: false,
`, 'diagnostics');

fs.writeFileSync(file, source);
console.log(JSON.stringify({material:'MeshPhysicalMaterial / R4.2 soft spatial optical discovery',surfaceMaxOpacity:.020,palette:{shadowMetal:'#6B7176',midSilver:'#959CA1',pearlSilver:'#C7CAC7',peakReflection:'#E0E1DD'},opticalDriver:'face normal + camera view + key RectAreaLight half-vector + broad surface-space lobe',baseInlay:'shadow-metal roughness/metalness/specular micro-presence',peakHold:'bell-shaped optical opportunity; no flat fully-readable hold',exit:'specular opportunity leaves before material inlay formation fades',seamAwareOcclusion:true,emissive:false,glowHalo:false,scanWipeShimmer:false,letterWordStagger:false,timing:{revealMs:600,readableHoldContractMs:1250,exitMs:520,totalMs:2370},semanticVelocityMultiplier:.70,motionChanged:false},null,2));
