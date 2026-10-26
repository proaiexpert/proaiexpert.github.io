/* ProAI Homepage Golden Assembly R1.2 — exact Cube 45% donor boot.
   Assembly/packaging only. Frozen Cube sources and motion constants are untouched.
   Topology recovered from docs/site-evolution/reviews/proai-cube-touch-auto-45-r1/review.html. */

const slot = document.querySelector('.proai-hero-object-slot[data-proai-hero-object]');
const mount = document.getElementById('proai-hero-cube-mount');
const canvas = document.getElementById('cube-canvas');
const status = document.getElementById('runtime-status');
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

if (slot && mount && canvas && status) {
  slot.dataset.cubeMounted = 'false';

  try {
    await import('./source-final-motion-r2-touch-auto-45-r1.js');

    const runtime = window.__PROAI_CUBE_TOUCH_AUTO_45_R1
      || window.__PROAI_CUBE_FINAL_MOTION_R2_INTERACTION_POLISH
      || window.__PROAI_CUBE_FINAL_MOTION_R2;

    const startedAt = performance.now();
    while (runtime && !runtime.ready && runtime.motionState !== 'error' && performance.now() - startedAt < 15000) {
      await new Promise((resolve) => setTimeout(resolve, 40));
    }
    if (!runtime?.ready) throw new Error('Golden 45% Cube did not become ready');

    // Exact proven review lifecycle: reveal the accepted square mount first,
    // let layout settle for two frames, then notify the existing Cube resize path.
    slot.dataset.cubeMounted = 'true';
    await nextFrame();
    await nextFrame();
    window.dispatchEvent(new Event('resize'));
    await nextFrame();
    runtime.startChoreography?.();

    window.__PROAI_HERO_CUBE_GOLDEN_R1 = Object.freeze({
      authorityCommit: '497308fd5e9add24d4fa4254287cbd17f9c0112c',
      sourceBlob: 'fc2c0ba13692c94f5838008d09f05dda9859e9d2',
      baseBlob: '67ca618cf10a47561d351715968187d2e4c50351',
      materialsBlob: 'f9298b0b00feaae4123eb5a7161f24f669ae0eca',
      activeAutoInfluence: 0.45,
      runtime
    });
    document.documentElement.dataset.goldenCubeReady = 'true';
  } catch (error) {
    slot.dataset.cubeMounted = 'false';
    document.documentElement.dataset.goldenCubeReady = 'error';
    console.error('[ProAI Golden Assembly R1] Cube initialization failed.', error);
  }
}
