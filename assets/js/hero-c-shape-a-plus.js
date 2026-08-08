(() => {
  'use strict';

  const stages = Array.from(document.querySelectorAll('[data-core-stage]'));
  if (!stages.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  stages.forEach((stage) => {
    const depth = stage.querySelector('[data-core-depth]');
    const image = stage.querySelector('[data-core-image] img');
    const blocker = stage.querySelector('[data-core-asset-blocker]');

    const setAssetState = (ready) => {
      stage.classList.toggle('is-core-asset-missing', !ready);
      if (blocker) blocker.hidden = ready;
    };

    if (image) {
      image.addEventListener('load', () => setAssetState(image.naturalWidth > 0), { once: true });
      image.addEventListener('error', () => setAssetState(false), { once: true });

      if (image.complete) {
        setAssetState(image.naturalWidth > 0);
      }
    } else {
      setAssetState(false);
    }

    if (!depth) return;

    let frame = 0;
    let nextX = 0;
    let nextY = 0;

    const applyPointer = () => {
      frame = 0;
      depth.style.setProperty('--pointer-x', `${nextX.toFixed(2)}deg`);
      depth.style.setProperty('--pointer-y', `${nextY.toFixed(2)}deg`);
    };

    const resetPointer = () => {
      nextX = 0;
      nextY = 0;
      if (!frame) frame = requestAnimationFrame(applyPointer);
    };

    stage.addEventListener('pointermove', (event) => {
      if (reducedMotion.matches || !finePointer.matches) return;

      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - .5) * 2));
      const ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - .5) * 2));
      const maxYaw = 2.35;
      const maxPitch = 1.55;

      nextX = -ny * maxPitch;
      nextY = nx * maxYaw;

      if (!frame) frame = requestAnimationFrame(applyPointer);
    }, { passive: true });

    stage.addEventListener('pointerleave', resetPointer, { passive: true });

    const onMotionPreferenceChange = () => {
      if (reducedMotion.matches) resetPointer();
    };

    if (typeof reducedMotion.addEventListener === 'function') {
      reducedMotion.addEventListener('change', onMotionPreferenceChange);
    } else if (typeof reducedMotion.addListener === 'function') {
      reducedMotion.addListener(onMotionPreferenceChange);
    }
  });
})();
