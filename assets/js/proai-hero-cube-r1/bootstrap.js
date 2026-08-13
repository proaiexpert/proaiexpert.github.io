/* ProAI Expert Hero Cube Integration R1
   Production bootstrap around the exact Materials + Lighting R1 source.
   Integration-only adaptations: local asset URL, transparent Hero composition,
   mount lifecycle, ResizeObserver, DPR cap, and coarse-pointer safety. */

(async function proaiHeroCubeIntegrationR1() {
  'use strict';

  const mount = document.getElementById('proai-hero-cube-mount');
  const slot = mount && mount.closest('.proai-hero-object-slot[data-proai-hero-object]');
  const hero = mount && mount.closest('#hero');
  if (!mount || !slot || !hero) return;

  const SOURCE_URL = '/assets/js/proai-hero-cube-r1/source-materials-r1.js';
  const GLB_URL = '/assets/models/proai-cube/rubik_39_s_cube_animation.glb';
  const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dprCap = coarsePointer ? 1.5 : 2;

  if (!document.querySelector('script[data-proai-three-importmap]')) {
    const importMap = document.createElement('script');
    importMap.type = 'importmap';
    importMap.setAttribute('data-proai-three-importmap', 'r180');
    importMap.textContent = JSON.stringify({
      imports: {
        three: '/assets/vendor/three-r180/build/three.module.min.js',
        'three/addons/': '/assets/vendor/three-r180/examples/jsm/'
      }
    });
    document.head.appendChild(importMap);
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

  const strictReplace = (source, needle, replacement, label) => {
    const first = source.indexOf(needle);
    const second = first === -1 ? -1 : source.indexOf(needle, first + needle.length);
    if (first === -1 || second !== -1) {
      throw new Error(`freeze adaptation mismatch: ${label}`);
    }
    return source.slice(0, first) + replacement + source.slice(first + needle.length);
  };

  const syncLifecycle = () => {
    if (!runtime || !runtime.ready) return;
    const active = heroVisible && !document.hidden && !reducedMotion;
    if (typeof runtime.setRenderLoopActive === 'function') runtime.setRenderLoopActive(active);
    if (active) {
      if (typeof runtime.startChoreography === 'function') runtime.startChoreography();
    } else if (typeof runtime.stopChoreography === 'function') {
      runtime.stopChoreography();
    }
  };

  const visibilityObserver = new IntersectionObserver((entries) => {
    const entry = entries[0];
    heroVisible = Boolean(entry && entry.isIntersecting && entry.intersectionRatio > 0.02);
    syncLifecycle();
  }, { threshold: [0, 0.02, 0.12] });
  visibilityObserver.observe(hero);

  document.addEventListener('visibilitychange', syncLifecycle, { passive: true });

  const resizeObserver = new ResizeObserver(() => {
    if (runtime && runtime.ready && typeof runtime.resize === 'function') runtime.resize();
  });
  resizeObserver.observe(mount);

  try {
    const response = await fetch(SOURCE_URL, { cache: 'force-cache', credentials: 'same-origin' });
    if (!response.ok) throw new Error(`stable Cube source HTTP ${response.status}`);
    let source = await response.text();

    // Freeze sentinels. Integration aborts if the authoritative Materials R1 source drifts.
    const sentinels = [
      "turnDurationRangeMs: [1080, 1420]",
      "normalYawVelocityDegPerSec: [7, 12]",
      "inspectionYawVelocityDegPerSec: [18, 30]",
      "pitchEnvelopeDeg: 10.2",
      "rollEnvelopeDeg: 2.45",
      "graphiteFace: Object.freeze({ color: '#242a31', metalness: 0.84, roughness: 0.295, clearcoat: 0.16, clearcoatRoughness: 0.20, envMapIntensity: 1.18 })",
      "gunmetalFace: Object.freeze({ color: '#2b323a', metalness: 0.86, roughness: 0.265, clearcoat: 0.20, clearcoatRoughness: 0.18, envMapIntensity: 1.22 })",
      "blackChromeFace: Object.freeze({ color: '#181d23', metalness: 0.92, roughness: 0.225, clearcoat: 0.16, clearcoatRoughness: 0.16, envMapIntensity: 1.26 })",
      "smokedCore: Object.freeze({ color: '#0c0f13', metalness: 0.48, roughness: 0.44, clearcoat: 0.06, clearcoatRoughness: 0.28, envMapIntensity: 0.66 })",
      "hemisphereIntensity: 0.52, keyIntensity: 5.2, fillIntensity: 4.0, rimIntensity: 4.6",
      "renderer.toneMapping = THREE.ACESFilmicToneMapping;",
      "renderer.toneMappingExposure = 1.0;"
    ];
    for (const sentinel of sentinels) {
      if (!source.includes(sentinel)) throw new Error(`stable Cube freeze sentinel missing: ${sentinel.slice(0, 42)}`);
    }

    source = strictReplace(
      source,
      "const GLB_URL = new URL('./rubik_39_s_cube_animation.glb', import.meta.url).href;",
      `const GLB_URL = '${GLB_URL}';`,
      'production GLB URL'
    );

    source = strictReplace(source, "  alpha: false,", "  alpha: true,", 'transparent renderer');

    source = strictReplace(
      source,
      "renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, (captureMode || reviewMode) ? 1 : 2));",
      `renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, (captureMode || reviewMode) ? 1 : ${dprCap}));`,
      'DPR cap'
    );

    source = strictReplace(source, "renderer.setClearColor(0x050607, 1);", "renderer.setClearColor(0x000000, 0);", 'transparent clear color');

    source = strictReplace(
      source,
      "const scene = new THREE.Scene();\nscene.background = new THREE.Color(0x050607);",
      "const scene = new THREE.Scene();\nscene.background = null;",
      'transparent scene background'
    );

    source = strictReplace(
      source,
      "window.addEventListener('resize', resize, { passive: true });",
      "window.addEventListener('resize', resize, { passive: true });\napi.resize = resize;\napi.renderReviewFrame = renderReviewFrame;\napi.setInteractionEnabled = (enabled) => { controls.enabled = Boolean(enabled); };",
      'mount resize and interaction API'
    );

    source = strictReplace(
      source,
      "function render(now) {\n  updatePresentationMotion(now);\n  controls.update();\n  renderer.render(scene, camera);\n  requestAnimationFrame(render);\n}\nif (!captureMode) requestAnimationFrame(render);",
      "let renderLoopActive = false;\nlet renderFrameHandle = 0;\nfunction render(now) {\n  if (!renderLoopActive) { renderFrameHandle = 0; return; }\n  updatePresentationMotion(now);\n  controls.update();\n  renderer.render(scene, camera);\n  renderFrameHandle = requestAnimationFrame(render);\n}\nfunction setRenderLoopActive(active) {\n  const next = Boolean(active) && !captureMode;\n  if (next === renderLoopActive) return;\n  renderLoopActive = next;\n  if (renderLoopActive) {\n    presentationLastNow = 0;\n    if (!renderFrameHandle) renderFrameHandle = requestAnimationFrame(render);\n  } else if (renderFrameHandle) {\n    cancelAnimationFrame(renderFrameHandle);\n    renderFrameHandle = 0;\n  }\n}\napi.setRenderLoopActive = setRenderLoopActive;\nif (!captureMode) setRenderLoopActive(true);",
      'visibility-aware render loop'
    );

    source = strictReplace(source, "    if (captureMode) renderReviewFrame();", "    renderReviewFrame();", 'valid first frame before mount activation');

    const blob = new Blob([source], { type: 'text/javascript' });
    moduleUrl = URL.createObjectURL(blob);
    await import(moduleUrl);

    runtime = window.__PROAI_CUBE_ML_R1 || window.__PROAI_CUBE_R1_2;
    if (!runtime) throw new Error('stable Cube API unavailable after module initialization');

    if (coarsePointer && typeof runtime.setInteractionEnabled === 'function') {
      runtime.setInteractionEnabled(false);
      canvas.style.pointerEvents = 'none';
      canvas.style.touchAction = 'pan-y';
    } else {
      canvas.style.touchAction = 'none';
    }

    const startedAt = performance.now();
    while (!runtime.ready && runtime.motionState !== 'error') {
      if (performance.now() - startedAt > 15000) throw new Error('stable Cube initialization timeout');
      await new Promise((resolve) => setTimeout(resolve, 40));
    }
    if (!runtime.ready) throw new Error('stable Cube failed to become ready');

    if (typeof runtime.resize === 'function') runtime.resize();
    if (typeof runtime.renderReviewFrame === 'function') runtime.renderReviewFrame();

    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    slot.dataset.cubeMounted = 'true';
    if (typeof runtime.resize === 'function') runtime.resize();
    if (typeof runtime.renderReviewFrame === 'function') runtime.renderReviewFrame();
    mounted = true;
    syncLifecycle();

    window.__PROAI_HERO_CUBE_R1 = Object.freeze({
      sourceSha: 'd17806da42275db617d8a46b231a2d877706a179',
      glbSha256: 'DBB7FC4156F8C9ED2481DD76443DFFB9A45ECB5493463F99BFFB34DD3B59C79B',
      glbBytes: 279412,
      threeVersion: 'r180',
      dprCap,
      coarsePointer,
      reducedMotion,
      runtime
    });
  } catch (error) {
    slot.dataset.cubeMounted = 'false';
    if (runtime && typeof runtime.stopChoreography === 'function') runtime.stopChoreography();
    if (runtime && typeof runtime.setRenderLoopActive === 'function') runtime.setRenderLoopActive(false);
    if (!mounted) mount.replaceChildren();
    console.warn('[ProAI Hero Cube R1] initialization failed; using Obsidian fallback.', error);
  } finally {
    if (moduleUrl) URL.revokeObjectURL(moduleUrl);
  }
}());
