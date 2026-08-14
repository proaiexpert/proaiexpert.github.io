(() => {
  'use strict';

  const section = document.querySelector('[data-connected-system]');
  if (!section) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compactLayout = window.matchMedia('(max-width: 760px), (max-height: 500px) and (max-width: 1000px)');
  const stages = Array.from(section.querySelectorAll('[data-system-stage]'));
  let sectionPlayed = false;
  const stagePlayed = new WeakSet();

  const clearStageLight = () => {
    stages.forEach(stage => stage.classList.remove('is-lit'));
  };

  const playDesktopSequence = () => {
    if (sectionPlayed || reduceMotion.matches) return;
    sectionPlayed = true;
    section.classList.add('is-entered');

    stages.forEach((stage, index) => {
      const on = 470 + index * 145;
      const off = on + 300;
      window.setTimeout(() => {
        clearStageLight();
        stage.classList.add('is-lit');
      }, on);
      window.setTimeout(() => stage.classList.remove('is-lit'), off);
    });
    window.setTimeout(clearStageLight, 1500);
  };

  const setupDesktop = () => {
    if (reduceMotion.matches) {
      section.classList.add('is-entered');
      return;
    }
    section.classList.add('cs-motion-ready');
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (!entry || !entry.isIntersecting) return;
      playDesktopSequence();
      observer.disconnect();
    }, { threshold: 0.28 });
    observer.observe(section);
  };

  const setupMobile = () => {
    section.classList.add('is-entered');
    if (reduceMotion.matches) return;
    stages.forEach(stage => {
      const observer = new IntersectionObserver(entries => {
        const entry = entries[0];
        if (!entry || !entry.isIntersecting || stagePlayed.has(stage)) return;
        const rect = entry.boundingClientRect;
        const viewportH = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top > viewportH * 0.78 || rect.bottom < viewportH * 0.35) return;
        stagePlayed.add(stage);
        stage.classList.add('is-local-active');
        window.setTimeout(() => stage.classList.remove('is-local-active'), 720);
        observer.disconnect();
      }, { threshold: 0.35, rootMargin: '-12% 0px -20% 0px' });
      observer.observe(stage);
    });
  };

  if (compactLayout.matches) setupMobile();
  else setupDesktop();
})();
