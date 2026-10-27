(() => {
  'use strict';

  const root = document.documentElement;
  const sections = Array.from(document.querySelectorAll('[data-hst]'));
  if (!sections.length) return;

  root.classList.add('hst-r1-js');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileView = window.matchMedia('(max-width: 760px)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const stageOrder = ['signal', 'experience', 'context', 'decision', 'review'];

  const clearMappedState = (section) => {
    section.querySelectorAll('.is-linked').forEach((node) => node.classList.remove('is-linked'));
  };

  const setMappedState = (section, name, active) => {
    section.querySelectorAll('[data-hst-stage], [data-hst-map]').forEach((node) => {
      const matches = node.dataset.hstStage === name || node.dataset.hstMap === name;
      if (matches) node.classList.toggle('is-linked', active);
    });
  };

  const flashMap = (section, name, duration = 320) => {
    setMappedState(section, name, true);
    window.setTimeout(() => {
      if (!section.matches(':focus-within') && !section.matches(':hover')) setMappedState(section, name, false);
    }, duration);
  };

  const reachStage = (section, name) => {
    section.classList.add(`hst-step-${name}`);
    const stage = section.querySelector(`[data-hst-stage="${name}"]`);
    if (stage) stage.classList.add('is-reached');
    flashMap(section, name, name === 'review' ? 430 : 280);
  };

  const renderStaticFinal = (section) => {
    section.classList.add('is-reduced', 'is-surface', 'is-config', 'is-approved', 'is-ready', 'is-settled');
    stageOrder.forEach((name) => {
      section.classList.add(`hst-step-${name}`);
      const stage = section.querySelector(`[data-hst-stage="${name}"]`);
      if (stage) stage.classList.add('is-reached');
    });
  };

  const runSequence = (section) => {
    if (section.dataset.hstPlayed === 'true') return;
    section.dataset.hstPlayed = 'true';

    if (reducedMotion.matches) {
      renderStaticFinal(section);
      return;
    }

    const t = mobileView.matches
      ? { surface: 0, config: 120, signal: 280, experience: 450, context: 610, decision: 760, review: 940, approve: 1080, action: 1260, settle: 1480 }
      : { surface: 0, config: 180, signal: 430, experience: 650, context: 850, decision: 1030, review: 1280, approve: 1480, action: 1700, settle: 1950 };

    window.setTimeout(() => section.classList.add('is-surface'), t.surface);
    window.setTimeout(() => section.classList.add('is-config'), t.config);
    window.setTimeout(() => reachStage(section, 'signal'), t.signal);
    window.setTimeout(() => reachStage(section, 'experience'), t.experience);
    window.setTimeout(() => reachStage(section, 'context'), t.context);
    window.setTimeout(() => reachStage(section, 'decision'), t.decision);
    window.setTimeout(() => {
      reachStage(section, 'review');
      section.classList.add('is-gating');
    }, t.review);
    window.setTimeout(() => {
      section.classList.remove('is-gating');
      section.classList.add('is-approved');
    }, t.approve);
    window.setTimeout(() => {
      section.classList.add('is-ready');
      flashMap(section, 'action', 420);
    }, t.action);
    window.setTimeout(() => {
      section.classList.add('is-settled');
      clearMappedState(section);
    }, t.settle);
  };

  const attachInteractions = (section) => {
    const instrument = section.querySelector('[data-hst-instrument]');
    let reviewTimer = 0;
    let lastPointerUpdate = 0;

    const inspect = (name) => {
      if (!name) return;
      clearMappedState(section);
      setMappedState(section, name, true);
      if (name === 'review' && section.classList.contains('is-settled') && !reducedMotion.matches) {
        window.clearTimeout(reviewTimer);
        section.classList.add('is-review-peek');
        reviewTimer = window.setTimeout(() => section.classList.remove('is-review-peek'), 430);
      }
    };

    section.querySelectorAll('[data-hst-stage], [data-hst-map]').forEach((node) => {
      const name = node.dataset.hstStage || node.dataset.hstMap;
      node.addEventListener('mouseenter', () => { if (finePointer.matches) inspect(name); });
      node.addEventListener('focus', () => inspect(name));
      node.addEventListener('click', () => inspect(name));
      node.addEventListener('mouseleave', () => {
        if (finePointer.matches && !section.matches(':focus-within')) clearMappedState(section);
      });
      node.addEventListener('blur', () => {
        window.setTimeout(() => {
          if (!section.matches(':focus-within') && !section.matches(':hover')) clearMappedState(section);
        }, 0);
      });
    });

    if (!instrument) return;

    instrument.addEventListener('pointermove', (event) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      const now = performance.now();
      if (now - lastPointerUpdate < 34) return;
      lastPointerUpdate = now;
      const rect = instrument.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
      instrument.style.setProperty('--hst-sheen-x', `${x}px`);
    }, { passive: true });

    instrument.addEventListener('pointerleave', () => {
      instrument.style.setProperty('--hst-sheen-x', '54%');
    }, { passive: true });
  };

  sections.forEach((section) => {
    attachInteractions(section);

    if (reducedMotion.matches) {
      renderStaticFinal(section);
      return;
    }

    if (!('IntersectionObserver' in window)) {
      window.setTimeout(() => runSequence(section), 80);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.08) continue;
        runSequence(section);
        observer.disconnect();
        break;
      }
    }, { threshold: [0.08, 0.16, 0.28], rootMargin: '0px 0px -14% 0px' });

    observer.observe(section);
  });
})();
