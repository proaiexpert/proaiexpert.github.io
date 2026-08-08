(() => {
  'use strict';

  const stages = Array.from(document.querySelectorAll('[data-core-stage]'));
  if (!stages.length) return;

  stages.forEach((stage) => {
    const image = stage.querySelector('[data-core-image]');
    const blocker = stage.querySelector('[data-core-asset-blocker]');

    const setAssetState = (ready) => {
      stage.classList.toggle('is-core-asset-missing', !ready);
      if (blocker) blocker.hidden = ready;
    };

    if (!image) {
      setAssetState(false);
      return;
    }

    image.addEventListener('load', () => setAssetState(image.naturalWidth > 0), { once: true });
    image.addEventListener('error', () => setAssetState(false), { once: true });

    if (image.complete) setAssetState(image.naturalWidth > 0);
  });
})();
