(() => {
  const roots = document.querySelectorAll('[data-home-proof-fs-r1]');
  if (!roots.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  roots.forEach((root) => {
    const reveals = [...root.querySelectorAll('[data-proof-reveal]')];
    const layers = [...root.querySelectorAll('[data-proof-layer]')];
    const interfacePlate = root.querySelector('[data-proof-interface]');

    if (reduced || !('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('is-visible'));
      layers.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    root.dataset.motion = 'ready';

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: .12 });

    reveals.forEach((el) => revealObserver.observe(el));

    const layerObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        layers.forEach((layer, index) => {
          window.setTimeout(() => layer.classList.add('is-visible'), index * 110);
        });
        observer.disconnect();
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: .18 });

    const layerHost = root.querySelector('.home-proof-fs-r1__layers');
    if (layerHost) layerObserver.observe(layerHost);

    if (interfacePlate && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      const clearInspection = () => layers.forEach((layer) => layer.classList.remove('is-inspected'));

      interfacePlate.addEventListener('pointermove', (event) => {
        const rect = interfacePlate.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(.999, (event.clientY - rect.top) / rect.height));
        const index = Math.min(layers.length - 1, Math.floor(ratio * layers.length));
        layers.forEach((layer, layerIndex) => layer.classList.toggle('is-inspected', layerIndex === index));
      }, { passive: true });

      interfacePlate.addEventListener('pointerleave', clearInspection, { passive: true });
      interfacePlate.addEventListener('blur', clearInspection, true);
    }
  });
})();
