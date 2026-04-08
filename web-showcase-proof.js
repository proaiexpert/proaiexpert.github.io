(function () {
  const sections = document.querySelectorAll('.showcase-proof-section');
  if (!sections.length) return;

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-live', entry.isIntersecting);
    });
  }, { threshold: 0.22 });

  sections.forEach((section) => {
    observer.observe(section);

    const scope = section.querySelector('[data-showcase-scope]');
    if (!scope) return;

    let frame = null;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      scope.style.setProperty('--showcase-shift-x', currentX.toFixed(2) + 'px');
      scope.style.setProperty('--showcase-shift-y', currentY.toFixed(2) + 'px');

      if (Math.abs(targetX - currentX) > 0.08 || Math.abs(targetY - currentY) > 0.08) {
        frame = window.requestAnimationFrame(render);
      } else {
        frame = null;
      }
    };

    const requestRender = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const onMove = (event) => {
      if (!finePointer.matches) return;
      const rect = scope.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = px * 26;
      targetY = py * 22;
      requestRender();
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      requestRender();
    };

    scope.addEventListener('mousemove', onMove, { passive: true });
    scope.addEventListener('mouseleave', onLeave, { passive: true });

    window.addEventListener('resize', () => {
      if (!finePointer.matches) onLeave();
    });
  });
})();
