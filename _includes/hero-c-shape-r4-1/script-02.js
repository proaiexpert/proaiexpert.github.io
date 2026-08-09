    railItems.forEach((item) => item.classList.remove('is-active'));
    branches.forEach((branch, i) => {
      branch.style.strokeDasharray = `0 ${(branchLengths[i] + 4).toFixed(2)}`;
      branch.style.opacity = '.18';
    });
    nodes.forEach((node) => { node.style.opacity = '.28'; node.style.filter = 'none'; });
    if (collector) {
      collector.style.strokeDasharray = `0 ${(collectorLength + 4).toFixed(2)}`;
      collector.style.opacity = '.22';
    }
  };

  const frame = (now) => {
    const elapsed = now - startAt;
    if (elapsed < 0) {
      raf = requestAnimationFrame(frame);
      return;
    }
    const cycleIndex = Math.floor(elapsed / CYCLE_MS);
    const local = elapsed - cycleIndex * CYCLE_MS;
    if (cycleIndex !== lastCycle) {
      lastCycle = cycleIndex;
      resetCycle();
    }

    if (local <= ACTIVE_MS) {
      // A — entry seed / short filament: no laser-beam start.
      const entryP = smooth(local / 520);
      const seedFade = local < 760 ? 1 : clamp(1 - (local - 760) / 460);
      if (entrySeed) entrySeed.style.opacity = String(.18 + .74 * entryP * seedFade);
      if (entryFilament) {
        entryFilament.style.opacity = String(.06 + .42 * entryP * seedFade);
        entryFilament.style.transform = `scaleX(${(.28 + .72 * entryP).toFixed(3)})`;
      }

      // B — multi-layer travel. Progress is concentrated between .45s and 2.85s.
      const travel = easeInOut((local - 430) / 2400);
      const travelling = local >= 350 && local <= 3020;
      const haloStart = travel - .17;
      const coreStart = travel - .085;
      setSegment(halo, haloStart, travel, travelling ? .30 : 0);
      setSegment(core, coreStart, travel, travelling ? .92 : 0);
      route.style.opacity = travelling ? '.24' : '0';

      const point = route.getPointAtLength(total * travel);
      head.setAttribute('transform', `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
      // Brief occlusion as the energy disappears behind a structural/glass layer before output.
      const occlusion = 1 - .72 * bell(travel, .74, .035);
      const headOpacity = travelling ? (.92 * occlusion) : 0;
      head.style.opacity = String(headOpacity);
      if (headHalo) headHalo.style.opacity = String(.58 * headOpacity);
      if (headCore) headCore.style.opacity = String(headOpacity);

      // C — local physical reaction only, never a global flash.
      const inner = clamp(.88 * bell(travel, .53, .19));
      scene.style.setProperty('--r41-react', inner.toFixed(3));

      // D — output collector, then ordered four-way semantic distribution.
      const outputStart = 2670;
      const collectorP = smooth((local - outputStart) / 380);
      if (collector) {
        collector.style.strokeDasharray = `${(collectorLength * collectorP).toFixed(2)} ${(collectorLength + 4).toFixed(2)}`;
        collector.style.opacity = String(.22 + .52 * collectorP);
      }

      const stageBase = 2880;
      const spacing = 235;
      const draw = 260;
      railItems.forEach((_, i) => {
        const s = stageBase + i * spacing;
        const p = smooth((local - s) / draw);
        const active = local >= s && local < s + 690;
        setBranchProgress(i, p, active);
      });
    } else {
      // Rest / calm state.
      setSegment(halo, 0, 0, 0);
      setSegment(core, 0, 0, 0);
      route.style.opacity = '0';
      head.style.opacity = '0';
      if (entrySeed) entrySeed.style.opacity = '0';
      if (entryFilament) entryFilament.style.opacity = '0';
      scene.style.setProperty('--r41-react', '0');
      const settle = clamp((local - ACTIVE_MS) / 760);
      if (collector) collector.style.opacity = String(.34 - .12 * settle);
      branches.forEach((branch) => branch.style.opacity = String(.30 - .12 * settle));
      railItems.forEach((item) => item.classList.remove('is-active'));
      nodes.forEach((node) => { node.style.opacity = '.28'; node.style.filter = 'none'; });
    }

    raf = requestAnimationFrame(frame);
  };

  resetCycle();
  raf = requestAnimationFrame(frame);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      clearStaticState();
    } else {
      root.classList.add('hero-r41-motion');
      startAt = performance.now() + 650;
      lastCycle = -1;
      raf = requestAnimationFrame(frame);
    }
  });

  window.addEventListener('pagehide', () => cancelAnimationFrame(raf), { once: true });
})();
