(() => {
  const cores = Array.from(document.querySelectorAll('[data-control-core]'));
  if (!cores.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine) and (hover: hover)');

  cores.forEach((core) => {
    if (reduceMotion.matches) {
      core.classList.add('is-reduced');
      return;
    }

    const start = () => {
      if (core.dataset.played === 'true') return;
      core.dataset.played = 'true';
      core.classList.add('is-running');
      window.setTimeout(() => {
        core.classList.remove('is-running');
        core.classList.add('is-settled');
      }, 4380);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          window.setTimeout(start, 180);
        }
      }, { threshold: 0.42 });
      observer.observe(core);
    } else {
      window.setTimeout(start, 250);
    }

    if (finePointer.matches) {
      core.addEventListener('pointermove', (event) => {
        if (!core.classList.contains('is-settled')) return;
        const rect = core.getBoundingClientRect();
        const nx = ((event.clientX - rect.left) / rect.width) - 0.5;
        const ny = ((event.clientY - rect.top) / rect.height) - 0.5;
        core.style.setProperty('--ry', `${(-8 + nx * 4).toFixed(2)}deg`);
        core.style.setProperty('--rx', `${(-4 - ny * 3).toFixed(2)}deg`);
        core.style.setProperty('--mx', `${(nx * 4).toFixed(2)}px`);
        core.style.setProperty('--my', `${(ny * 3).toFixed(2)}px`);
      }, { passive: true });
      core.addEventListener('pointerleave', () => {
        core.style.removeProperty('--ry');
        core.style.removeProperty('--rx');
        core.style.removeProperty('--mx');
        core.style.removeProperty('--my');
      });
    }
  });
})();
