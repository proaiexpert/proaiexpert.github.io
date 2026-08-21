/* ProAI Homepage Golden Assembly R1.2 — immutable-path-safe Cube 45% loader.
   Assembly/packaging only. Frozen Cube source and all motion constants remain untouched. */
(async function proaiHeroCubeGoldenR12() {
  'use strict';

  const script = document.currentScript;
  const mount = document.getElementById('proai-hero-cube-mount');
  const slot = mount && mount.closest('.proai-hero-object-slot[data-proai-hero-object]');
  if (!script || !mount || !slot) return;

  const marker = '/assets/js/proai-hero-cube-r1/bootstrap-golden-r1-2.js';
  const scriptUrl = new URL(script.src, document.baseURI);
  const markerAt = scriptUrl.href.indexOf(marker);
  const repoBase = markerAt >= 0 ? scriptUrl.href.slice(0, markerAt + 1) : new URL('../../../', scriptUrl).href;
  const asset = (path) => new URL(String(path).replace(/^\/+/, ''), repoBase).href;

  if (!document.querySelector('script[data-proai-three-importmap]')) {
    const map = document.createElement('script');
    map.type = 'importmap';
    map.dataset.proaiThreeImportmap = 'r180-golden-r12';
    map.textContent = JSON.stringify({ imports: {
      three: asset('assets/vendor/three-r180/build/three.module.min.js'),
      'three/addons/': asset('assets/vendor/three-r180/examples/jsm/')
    }});
    document.head.appendChild(map);
  }

  slot.dataset.cubeMounted = 'false';
  const canvas = document.createElement('canvas');
  canvas.id = 'cube-canvas';
  canvas.className = 'proai-hero-cube-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.tabIndex = -1;
  canvas.style.touchAction = 'none';

  const status = document.createElement('span');
  status.id = 'runtime-status';
  status.hidden = true;
  status.setAttribute('aria-hidden', 'true');
  mount.replaceChildren(canvas, status);

  try {
    await import(asset('assets/js/proai-hero-cube-r1/source-final-motion-r2-touch-auto-45-r1.js'));
    const runtime = window.__PROAI_CUBE_TOUCH_AUTO_45_R1;
    if (!runtime) throw new Error('Golden 45% Cube API unavailable');

    const startedAt = performance.now();
    while (!runtime.ready && runtime.motionState !== 'error') {
      if (performance.now() - startedAt > 18000) throw new Error('Golden 45% Cube initialization timeout');
      await new Promise((resolve) => setTimeout(resolve, 40));
    }
    if (!runtime.ready) throw new Error('Golden 45% Cube failed to become ready');

    window.dispatchEvent(new Event('resize'));
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    slot.dataset.cubeMounted = 'true';

    window.__PROAI_HERO_CUBE_GOLDEN_R1 = Object.freeze({
      authorityCommit: '497308fd5e9add24d4fa4254287cbd17f9c0112c',
      sourceBlob: 'fc2c0ba13692c94f5838008d09f05dda9859e9d2',
      baseBlob: '67ca618cf10a47561d351715968187d2e4c50351',
      materialsBlob: 'bab6b00e73b20fc2a51aeb00cb7fc08f16129e72',
      activeAutoInfluence: 0.45,
      assetBase: repoBase,
      runtime
    });
  } catch (error) {
    slot.dataset.cubeMounted = 'false';
    mount.replaceChildren();
    console.error('[ProAI Golden Assembly R1] Cube initialization failed.', error);
  }
}());
