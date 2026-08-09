(() => {
  const root = document.documentElement;
  const params = new URLSearchParams(location.search);
  const requestedStatic = params.get('motion') === '0' || params.get('mode') === 'static';
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const railItems = Array.from(document.querySelectorAll('.hero-cshape__rail-item'));

  if (requestedStatic || reduce) {
    root.classList.remove('hero-r4-motion');
    railItems.forEach((item) => item.classList.remove('is-active'));
    return;
  }

  root.classList.add('hero-r4-motion');

  const cycle = 8600;
  const stageAt = [1180, 1780, 2380, 2980];
  const activeFor = 760;
  let timers = [];

  const clearTimers = () => {
    timers.forEach(clearTimeout);
    timers = [];
  };

  const runRailCycle = () => {
    clearTimers();
    railItems.forEach((item) => item.classList.remove('is-active'));
    railItems.forEach((item, index) => {
      timers.push(setTimeout(() => item.classList.add('is-active'), stageAt[index]));
      timers.push(setTimeout(() => item.classList.remove('is-active'), stageAt[index] + activeFor));
    });
  };

  runRailCycle();
  const interval = setInterval(runRailCycle, cycle);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimers();
      railItems.forEach((item) => item.classList.remove('is-active'));
    } else {
      runRailCycle();
    }
  });

  window.addEventListener('pagehide', () => {
    clearInterval(interval);
    clearTimers();
  }, { once: true });
})();
