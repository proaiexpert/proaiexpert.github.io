
(() => {
  'use strict';

  const root = document.querySelector('[data-connected-next]');
  const artifact = root?.querySelector('[data-context-artifact]');
  if (!root || !artifact) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const lowLandscape = window.matchMedia('(max-height: 520px) and (min-width: 701px)');
  let lockTimer = 0;
  let lastState = artifact.dataset.state || '4';

  const lock = (state) => {
    if (reducedMotion.matches) {
      artifact.classList.remove('is-locking');
      return;
    }

    window.clearTimeout(lockTimer);
    root.dataset.lockTarget = state;
    artifact.classList.remove('is-locking');
    void artifact.offsetWidth;
    artifact.classList.add('is-locking');

    lockTimer = window.setTimeout(() => {
      artifact.classList.remove('is-locking');
      delete root.dataset.lockTarget;
    }, lowLandscape.matches ? 720 : 980);
  };

  const observer = new MutationObserver(() => {
    const next = artifact.dataset.state || lastState;
    if (next === lastState) return;
    lastState = next;
    lock(next);
  });

  observer.observe(artifact, { attributes: true, attributeFilter: ['data-state'] });

  reducedMotion.addEventListener?.('change', () => {
    if (reducedMotion.matches) artifact.classList.remove('is-locking');
  });

  // Establish the currently rendered state once without creating a loop.
  window.requestAnimationFrame(() => lock(lastState));
})();

