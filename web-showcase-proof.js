(function () {
  const scopes = document.querySelectorAll('[data-wbcs-scope]');
  if (!scopes.length) return;

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const desktopLike = window.matchMedia('(min-width: 821px) and (orientation: landscape), (min-width: 981px)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-live', entry.isIntersecting);
    });
  }, { threshold: 0.28 });

  scopes.forEach((scope) => {
    observer.observe(scope);

    let frame = null;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      scope.style.setProperty('--wbcs-shift-x', currentX.toFixed(2) + 'px');
      scope.style.setProperty('--wbcs-shift-y', currentY.toFixed(2) + 'px');
      if (Math.abs(targetX - currentX) > 0.08 || Math.abs(targetY - currentY) > 0.08) {
        frame = window.requestAnimationFrame(render);
      } else {
        frame = null;
      }
    };

    const requestRender = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const reset = () => {
      targetX = 0;
      targetY = 0;
      requestRender();
    };

    scope.addEventListener('mousemove', (event) => {
      if (!finePointer.matches || !desktopLike.matches) return;
      const rect = scope.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = px * 18;
      targetY = py * 16;
      requestRender();
    }, { passive: true });

    scope.addEventListener('mouseleave', reset, { passive: true });
    window.addEventListener('resize', () => {
      if (!desktopLike.matches || !finePointer.matches) reset();
    }, { passive: true });
  });
})();
