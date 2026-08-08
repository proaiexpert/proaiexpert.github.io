(() => {
  'use strict';

  const stages = Array.from(document.querySelectorAll('[data-core-stage]'));
  if (!stages.length) return;

  stages.forEach((stage) => {
    const images = Array.from(stage.querySelectorAll('[data-ground-layer-image]'));
    const blocker = stage.querySelector('[data-core-asset-blocker]');

    const setAssetState = () => {
      const ready = images.length >= 2 && images.every((image) => image.complete && image.naturalWidth > 0);
      stage.classList.toggle('is-core-asset-missing', !ready);
      if (blocker) blocker.hidden = ready;
    };

    if (!images.length) {
      stage.classList.add('is-core-asset-missing');
      if (blocker) blocker.hidden = false;
      return;
    }

    images.forEach((image) => {
      image.addEventListener('load', setAssetState);
      image.addEventListener('error', setAssetState);
    });

    setAssetState();
  });
})();
