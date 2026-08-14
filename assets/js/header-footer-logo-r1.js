(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const logos = [...document.querySelectorAll('[data-proai-live-logo]')];
  if (!logos.length || reduced) return;
  const pending = new Map();
  const onMessage = (event) => {
    if (!event.data || event.data.type !== 'proai-logo-r341') return;
    for (const [frame, logo] of pending) {
      if (frame.contentWindow !== event.source) continue;
      if (event.data.state === 'ready') {
        logo.classList.add('is-live');
        logo.dataset.logoState = 'live';
      } else {
        logo.classList.remove('is-live');
        logo.dataset.logoState = 'fallback';
      }
      pending.delete(frame);
      break;
    }
  };
  window.addEventListener('message', onMessage);
  for (const logo of logos) {
    const frame = logo.querySelector('.proai-logo-r341__live[data-logo-live-src]');
    if (!frame) continue;
    logo.dataset.logoState = 'loading';
    pending.set(frame, logo);
    const fail = () => {
      if (!pending.has(frame)) return;
      pending.delete(frame);
      logo.classList.remove('is-live');
      logo.dataset.logoState = 'fallback';
    };
    frame.addEventListener('error', fail, { once: true });
    frame.src = frame.dataset.logoLiveSrc;
    setTimeout(fail, 15000);
  }
})();