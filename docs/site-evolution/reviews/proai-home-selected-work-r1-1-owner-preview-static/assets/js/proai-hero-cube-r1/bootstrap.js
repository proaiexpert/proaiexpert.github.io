/* ProAI Hero Cube Integration R1.1 — frozen Cube source, Homepage-only adaptation. */
(async function proaiHeroCubeIntegrationR11() {
  'use strict';
  const mount = document.getElementById('proai-hero-cube-mount');
  const slot = mount && mount.closest('.proai-hero-object-slot[data-proai-hero-object]');
  const hero = mount && mount.closest('#hero');
  if (!mount || !slot || !hero) return;

  const SOURCE_URL = '../../js/proai-hero-cube-r1/source-materials-r1.js';
  const GLB_URL = '../../models/proai-cube/rubik_39_s_cube_animation.glb';
  const coarsePointer = matchMedia('(hover: none), (pointer: coarse)').matches;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dprCap = coarsePointer ? 1.5 : 2;

  if (!document.querySelector('script[data-proai-three-importmap]')) {
    const map = document.createElement('script');
    map.type = 'importmap';
    map.dataset.proaiThreeImportmap = 'r180';
    map.textContent = JSON.stringify({ imports: {
      three: '../../vendor/three-r180/build/three.module.min.js',
      'three/addons/': '../../vendor/three-r180/examples/jsm/'
    }});
    document.head.appendChild(map);
  }

  slot.dataset.cubeMounted = 'false';
  const canvas = document.createElement('canvas');
  canvas.id = 'cube-canvas';
  canvas.className = 'proai-hero-cube-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.tabIndex = -1;
  const status = document.createElement('span');
  status.id = 'runtime-status';
  status.hidden = true;
  status.setAttribute('aria-hidden', 'true');
  mount.replaceChildren(canvas, status);

  let heroVisible = true;
  let runtime = null;
  let moduleUrl = null;
  let mounted = false;

  const replaceOnce = (source, needle, replacement, label) => {
    const first = source.indexOf(needle);
    const second = first < 0 ? -1 : source.indexOf(needle, first + needle.length);
    if (first < 0 || second >= 0) throw new Error(`freeze adaptation mismatch: ${label}`);
    return source.slice(0, first) + replacement + source.slice(first + needle.length);
  };

  const syncLifecycle = () => {
    if (!runtime || !runtime.ready) return;
    const active = heroVisible && !document.hidden && !reducedMotion;
    runtime.setRenderLoopActive?.(active);
    if (active) runtime.startChoreography?.(); else runtime.stopChoreography?.();
  };

  new IntersectionObserver(([entry]) => {
    heroVisible = Boolean(entry && entry.isIntersecting && entry.intersectionRatio > 0.02);
    syncLifecycle();
  }, { threshold: [0, 0.02, 0.12] }).observe(hero);
  document.addEventListener('visibilitychange', syncLifecycle, { passive: true });
  new ResizeObserver(() => runtime?.ready && runtime.resize?.()).observe(mount);

  try {
    const response = await fetch(SOURCE_URL, { cache: 'force-cache', credentials: 'same-origin' });
    if (!response.ok) throw new Error(`stable Cube source HTTP ${response.status}`);
    let source = await response.text();

    const sentinels = [
      'turnDurationRangeMs: [1080, 1420]', 'normalYawVelocityDegPerSec: [7, 12]',
      'inspectionYawVelocityDegPerSec: [18, 30]', 'pitchEnvelopeDeg: 10.2', 'rollEnvelopeDeg: 2.45',
      "graphiteFace: Object.freeze({ color: '#242a31', metalness: 0.84, roughness: 0.295, clearcoat: 0.16, clearcoatRoughness: 0.20, envMapIntensity: 1.18 })",
      "gunmetalFace: Object.freeze({ color: '#2b323a', metalness: 0.86, roughness: 0.265, clearcoat: 0.20, clearcoatRoughness: 0.18, envMapIntensity: 1.22 })",
      "blackChromeFace: Object.freeze({ color: '#181d23', metalness: 0.92, roughness: 0.225, clearcoat: 0.16, clearcoatRoughness: 0.16, envMapIntensity: 1.26 })",
      "smokedCore: Object.freeze({ color: '#0c0f13', metalness: 0.48, roughness: 0.44, clearcoat: 0.06, clearcoatRoughness: 0.28, envMapIntensity: 0.66 })",
      'hemisphereIntensity: 0.52, keyIntensity: 5.2, fillIntensity: 4.0, rimIntensity: 4.6',
      'renderer.toneMapping = THREE.ACESFilmicToneMapping;', 'renderer.toneMappingExposure = 1.0;'
    ];
    for (const token of sentinels) if (!source.includes(token)) throw new Error(`stable Cube freeze sentinel missing: ${token.slice(0, 42)}`);

    const patches = [
      ["const GLB_URL = new URL('./rubik_39_s_cube_animation.glb', import.meta.url).href;", `const GLB_URL = '${GLB_URL}';`, 'production GLB URL'],
      ['  alpha: false,', '  alpha: true,', 'transparent renderer'],
      ['renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, (captureMode || reviewMode) ? 1 : 2));', `renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, (captureMode || reviewMode) ? 1 : ${dprCap}));`, 'DPR cap'],
      ['renderer.setClearColor(0x050607, 1);', 'renderer.setClearColor(0x000000, 0);', 'transparent clear'],
      ['const scene = new THREE.Scene();\nscene.background = new THREE.Color(0x050607);', 'const scene = new THREE.Scene();\nscene.background = null;', 'transparent scene'],
      ['controls.enablePan = false;\ncontrols.rotateSpeed = MOTION.orbitRotateSpeed;', 'controls.enablePan = false;\ncontrols.enableZoom = false;\ncontrols.rotateSpeed = MOTION.orbitRotateSpeed;', 'orbit only'],
      ['function presentationAutonomyBlocked() {\n  return interactionActive || performance.now() < manualResumeAt;\n}\n\nfunction sliceAutonomyBlocked() {\n  return interactionActive || performance.now() < sliceResumeAt;\n}', 'function presentationAutonomyBlocked() {\n  return false;\n}\n\nfunction sliceAutonomyBlocked() {\n  return false;\n}', 'non-blocking autonomy'],
      ["controls.addEventListener('start', () => {\n  interactionActive = true;\n  frozenPresentationQuaternion.copy(presentationRig.quaternion);\n  presentationResumeFrom.copy(presentationRig.quaternion);\n  manualResumeAt = Infinity;\n  sliceResumeAt = Infinity;\n  presentationResumeStart = 0;\n});\n\ncontrols.addEventListener('end', () => {\n  interactionActive = false;\n  const now = performance.now();\n  manualResumeAt = now + MOTION.manualResumeDelayMs;\n  sliceResumeAt = manualResumeAt + MOTION.sliceResumeStaggerMs;\n  presentationResumeStart = manualResumeAt;\n  presentationResumeFrom.copy(presentationRig.quaternion);\n});", "controls.addEventListener('start', () => { interactionActive = true; });\ncontrols.addEventListener('end', () => { interactionActive = false; });", 'Orbit start/end'],
      ["window.addEventListener('resize', resize, { passive: true });", "window.addEventListener('resize', resize, { passive: true });\napi.resize = resize;\napi.renderReviewFrame = renderReviewFrame;\napi.setInteractionEnabled = (enabled) => { controls.enabled = Boolean(enabled); };\napi.getHeroInteractionContract = () => ({ controlsEnabled: controls.enabled, zoomEnabled: controls.enableZoom, panEnabled: controls.enablePan, cameraDistance: camera.position.distanceTo(controls.target) });", 'runtime API'],
      ['function render(now) {\n  updatePresentationMotion(now);\n  controls.update();\n  renderer.render(scene, camera);\n  requestAnimationFrame(render);\n}\nif (!captureMode) requestAnimationFrame(render);', 'let renderLoopActive = false;\nlet renderFrameHandle = 0;\nfunction render(now) {\n  if (!renderLoopActive) { renderFrameHandle = 0; return; }\n  updatePresentationMotion(now);\n  controls.update();\n  renderer.render(scene, camera);\n  renderFrameHandle = requestAnimationFrame(render);\n}\nfunction setRenderLoopActive(active) {\n  const next = Boolean(active) && !captureMode;\n  if (next === renderLoopActive) return;\n  renderLoopActive = next;\n  if (next) { presentationLastNow = 0; if (!renderFrameHandle) renderFrameHandle = requestAnimationFrame(render); }\n  else if (renderFrameHandle) { cancelAnimationFrame(renderFrameHandle); renderFrameHandle = 0; }\n}\napi.setRenderLoopActive = setRenderLoopActive;\nif (!captureMode) setRenderLoopActive(true);', 'lifecycle render loop'],
      ['    if (captureMode) renderReviewFrame();', '    renderReviewFrame();', 'first frame']
    ];
    for (const [needle, replacement, label] of patches) source = replaceOnce(source, needle, replacement, label);

    moduleUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
    await import(moduleUrl);
    runtime = window.__PROAI_CUBE_ML_R1 || window.__PROAI_CUBE_R1_2;
    if (!runtime) throw new Error('stable Cube API unavailable after module initialization');

    if (coarsePointer) {
      runtime.setInteractionEnabled?.(false);
      canvas.style.pointerEvents = 'none';
      canvas.style.touchAction = 'pan-y';
    } else canvas.style.touchAction = 'none';

    const startedAt = performance.now();
    while (!runtime.ready && runtime.motionState !== 'error') {
      if (performance.now() - startedAt > 15000) throw new Error('stable Cube initialization timeout');
      await new Promise(resolve => setTimeout(resolve, 40));
    }
    if (!runtime.ready) throw new Error('stable Cube failed to become ready');

    runtime.resize?.();
    runtime.renderReviewFrame?.();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    slot.dataset.cubeMounted = 'true';
    runtime.resize?.();
    runtime.renderReviewFrame?.();
    mounted = true;
    syncLifecycle();

    window.__PROAI_HERO_CUBE_R1 = Object.freeze({
      sourceSha: 'd17806da42275db617d8a46b231a2d877706a179',
      glbSha256: 'DBB7FC4156F8C9ED2481DD76443DFFB9A45ECB5493463F99BFFB34DD3B59C79B',
      glbBytes: 279412, threeVersion: 'r180', interactionRevision: 'R1.1',
      dprCap, coarsePointer, reducedMotion, runtime
    });
  } catch (error) {
    slot.dataset.cubeMounted = 'false';
    runtime?.stopChoreography?.();
    runtime?.setRenderLoopActive?.(false);
    if (!mounted) mount.replaceChildren();
    console.warn('[ProAI Hero Cube R1.1] initialization failed; using Obsidian fallback.', error);
  } finally {
    if (moduleUrl) URL.revokeObjectURL(moduleUrl);
  }
}());
