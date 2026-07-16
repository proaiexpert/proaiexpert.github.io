/* ProAI Expert Portfolio Experience Prototype v1
   Isolated, dependency-free interaction layer. */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.body;

  const revealItems = [...document.querySelectorAll('.pv-reveal')];
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const stages = [...document.querySelectorAll('.pv-stage')];
  const updateStages = () => {
    if (!stages.length) return;
    const viewport = window.innerHeight;
    stages.forEach((stage) => {
      const rect = stage.getBoundingClientRect();
      const centerDistance = Math.abs((rect.top + rect.height / 2) - viewport / 2);
      const active = centerDistance < viewport * 0.42;
      stage.classList.toggle('is-active', active);
      const total = Math.max(1, rect.height + viewport);
      const progress = Math.min(1, Math.max(0, (viewport - rect.top) / total));
      stage.style.setProperty('--stage-progress', `${Math.round(progress * 100)}%`);
    });
  };

  const sections = [...document.querySelectorAll('[data-chapter]')];
  const railLinks = [...document.querySelectorAll('.pv-chapter-rail a')];
  const updateChapters = () => {
    if (!sections.length || !railLinks.length) return;
    const anchor = window.innerHeight * 0.42;
    let activeId = sections[0].id;
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= anchor) activeId = section.id;
    });
    railLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const systemItems = [...document.querySelectorAll('.pv-system-item')];
  const systemDots = [...document.querySelectorAll('.pv-system-dot')];
  const systemCore = document.querySelector('.pv-system-core');
  const systemLabels = [
    'Bilingual architecture',
    'Services + Payroll',
    'Structured intake',
    'Calendar after context',
    'Content + SEO',
    'AI support + human control'
  ];
  let lastSystemIndex = 0;

  const renderSystemCore = (index) => {
    if (!systemCore) return;
    systemCore.setAttribute('aria-live', 'polite');
    systemCore.setAttribute('aria-atomic', 'true');
    systemCore.replaceChildren();
    const label = document.createElement('small');
    label.textContent = `Active layer ${String(index + 1).padStart(2, '0')}`;
    const value = document.createElement('span');
    value.textContent = systemLabels[index] || systemLabels[0];
    systemCore.append(label, value);
  };

  const updateSystem = () => {
    if (!systemItems.length) return;
    const anchor = window.innerHeight * 0.52;
    let best = Infinity;
    let candidate = lastSystemIndex;
    systemItems.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - anchor);
      if (rect.bottom > 0 && rect.top < window.innerHeight && distance < best) {
        best = distance;
        candidate = index;
      }
    });
    lastSystemIndex = candidate;
    systemItems.forEach((item, index) => item.classList.toggle('is-active', index === candidate));
    systemDots.forEach((dot, index) => { dot.style.opacity = index === candidate ? '1' : '.16'; });
    renderSystemCore(candidate);
  };

  let ticking = false;
  const updateAll = () => {
    updateStages();
    updateChapters();
    updateSystem();
    ticking = false;
  };
  const queueUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateAll);
  };

  window.addEventListener('scroll', queueUpdate, { passive: true });
  window.addEventListener('resize', queueUpdate);
  queueUpdate();

  if (!reduceMotion && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    window.addEventListener('pointermove', (event) => {
      root.style.setProperty('--pv-x', `${(event.clientX / window.innerWidth) * 100}%`);
      root.style.setProperty('--pv-y', `${(event.clientY / window.innerHeight) * 100}%`);
    }, { passive: true });
  }
})();
