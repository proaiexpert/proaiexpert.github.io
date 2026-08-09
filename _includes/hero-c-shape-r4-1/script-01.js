(() => {
  'use strict';

  const root = document.documentElement;
  const params = new URLSearchParams(window.location.search);
  const requestedStatic = params.get('motion') === '0' || params.get('mode') === 'static';
  const debugSceneEdges = params.get('debug') === 'scene-edges';
  const reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  if (debugSceneEdges) root.classList.add('hero-r41-debug-scene-edges');
  if (requestedStatic) root.classList.add('hero-r41-static');

  // R4's one-dash motion is explicitly superseded in R4.1.
  root.classList.remove('hero-r4-motion');

  const signal = document.querySelector('.hero-r41__signal-svg');
  const route = signal && signal.querySelector('[data-r41-route]');
  const halo = signal && signal.querySelector('[data-r41-halo]');
  const core = signal && signal.querySelector('[data-r41-core]');
  const head = signal && signal.querySelector('[data-r41-head]');
  const headHalo = signal && signal.querySelector('.hero-r41__head-halo');
  const headCore = signal && signal.querySelector('.hero-r41__head-core');
  const entrySeed = document.querySelector('.hero-r41__entry-seed');
  const entryFilament = document.querySelector('.hero-r41__entry-filament');
  const scene = document.querySelector('.hero-cshape__scene');
  const railItems = Array.from(document.querySelectorAll('.hero-cshape__rail-item'));
  const collector = document.querySelector('[data-r41-collector]');
  const branches = Array.from(document.querySelectorAll('[data-r41-branch]'));
  const nodes = Array.from(document.querySelectorAll('[data-r41-node]'));

  const clearStaticState = () => {
    root.classList.remove('hero-r41-motion');
    railItems.forEach((item) => item.classList.remove('is-active'));
    if (scene) scene.style.setProperty('--r41-react', '0');
    [halo, core].forEach((path) => {
      if (!path) return;
      path.style.opacity = '0';
      path.style.strokeDasharray = '0 9999';
    });
    if (head) head.style.opacity = '0';
    if (entrySeed) entrySeed.style.opacity = '0';
    if (entryFilament) entryFilament.style.opacity = '0';
    branches.forEach((branch) => {
      branch.style.strokeDasharray = '0 9999';
      branch.style.opacity = '.18';
    });
  };

  if (requestedStatic || reduce || !signal || !route || !halo || !core || !head || !scene) {
    clearStaticState();
    return;
  }

  root.classList.add('hero-r41-motion');

  const total = route.getTotalLength();
  const branchLengths = branches.map((branch) => branch.getTotalLength());
  const collectorLength = collector ? collector.getTotalLength() : 0;

  // Active choreography ~4.15s, then ~6.25s calm. The page is quiet most of the time.
  const ACTIVE_MS = 4150;
  const REST_MS = 6250;
  const CYCLE_MS = ACTIVE_MS + REST_MS;
  const FIRST_DELAY_MS = 1050;
  let startAt = performance.now() + FIRST_DELAY_MS;
  let raf = 0;
  let lastCycle = -1;

  const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
  const smooth = (t) => {
    t = clamp(t);
    return t * t * (3 - 2 * t);
  };
  const easeInOut = (t) => {
    t = clamp(t);
    return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };
  const bell = (x, c, w) => Math.exp(-Math.pow((x - c) / w, 2));

  const setSegment = (path, startP, endP, opacity) => {
    if (!path) return;
    const a = clamp(startP) * total;
    const b = clamp(endP) * total;
    const len = Math.max(0, b - a);
    path.style.strokeDasharray = `${len.toFixed(2)} ${(total + 6).toFixed(2)}`;
    path.style.strokeDashoffset = `${(-a).toFixed(2)}`;
    path.style.opacity = String(opacity);
  };

  const setBranchProgress = (index, progress, active) => {
    const branch = branches[index];
    if (!branch) return;
    const length = branchLengths[index];
    const p = clamp(progress);
    branch.style.strokeDasharray = `${(length * p).toFixed(2)} ${(length + 4).toFixed(2)}`;
    branch.style.strokeDashoffset = '0';
    branch.style.opacity = String(active ? .72 : .18);
    if (nodes[index]) {
      nodes[index].style.opacity = String(.28 + (active ? .68 : 0));
      nodes[index].style.filter = active ? 'drop-shadow(0 0 5px rgba(101,231,255,.48))' : 'none';
    }
    if (railItems[index]) railItems[index].classList.toggle('is-active', active);
  };

  const resetCycle = () => {
