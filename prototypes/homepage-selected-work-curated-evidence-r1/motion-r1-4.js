(() => {
  const root = document.documentElement;
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (motionQuery.matches || !('IntersectionObserver' in window)) {
    return;
  }

  root.classList.add('reveal-ready');

  const decodeAndSettle = (img, media, state) => {
    if (state.settled) return;

    const settle = () => {
      if (state.settled) return;
      state.settled = true;
      media.classList.add('is-media-ready');
    };

    if (typeof img.decode !== 'function') {
      settle();
      return;
    }

    try {
      img.decode().then(settle).catch(settle);
    } catch (_error) {
      settle();
    }
  };

  const prepareMedia = (object) => {
    const media = object.querySelector('.proof-object__media');
    const img = media?.querySelector('img');
    const state = { settled: false, failOpenTimer: null };

    if (!media || !img) {
      media?.classList.add('is-media-ready');
      return () => {};
    }

    const settleFromLoad = () => decodeAndSettle(img, media, state);
    const failOpen = () => {
      if (state.settled) return;
      state.settled = true;
      media.classList.add('is-media-ready');
    };

    if (img.complete) {
      if (img.naturalWidth > 0) {
        settleFromLoad();
      } else {
        failOpen();
      }
    } else {
      img.addEventListener('load', settleFromLoad, { once: true });
      img.addEventListener('error', failOpen, { once: true });
    }

    return () => {
      if (state.settled || state.failOpenTimer) return;
      state.failOpenTimer = window.setTimeout(failOpen, 3200);
    };
  };

  const init = () => {
    try {
      const objects = Array.from(document.querySelectorAll('.proof-object'));

      if (!objects.length) {
        root.classList.remove('reveal-ready');
        return;
      }

      const startFailOpen = new WeakMap();
      objects.forEach((object) => startFailOpen.set(object, prepareMedia(object)));

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');
          startFailOpen.get(entry.target)?.();
          observer.unobserve(entry.target);
        });
      }, {
        root: null,
        rootMargin: '0px 0px -14% 0px',
        threshold: 0.2
      });

      objects.forEach((object) => observer.observe(object));
    } catch (_error) {
      root.classList.remove('reveal-ready');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
