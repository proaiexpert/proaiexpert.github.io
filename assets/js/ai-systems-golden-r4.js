import { EVENT, createReferenceRegistry, runControlledAgent } from './controlled-agent-reference.mjs';
import { REQUIRED_SOURCE_ANCHORS, visualForEvent } from './ai-systems-r4-runtime-map.mjs';

(() => {
  'use strict';

  const page = document.querySelector('[data-ai-r4-page]');
  if (!page) return;

  const lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopDepth = window.matchMedia('(min-width: 900px) and (min-height: 650px)');
  const phoneLandscape = window.matchMedia('(orientation: landscape) and (max-height: 540px) and (pointer: coarse)');
  const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));

  page.dataset.motion = reduce.matches ? 'reduced' : 'ready';

  const revealNodes = [...page.querySelectorAll('[data-r4-reveal]')];
  if (reduce.matches || !('IntersectionObserver' in window)) {
    revealNodes.forEach((node) => node.classList.add('is-r4-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-r4-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    revealNodes.forEach((node) => revealObserver.observe(node));
  }

  const register = page.querySelector('[data-r4-register]');
  const depthStory = page.querySelector('[data-r4-depth-story]');
  const authority = page.querySelector('[data-r4-authority]');
  const pearl = page.querySelector('[data-r4-pearl]');
  const spine = page.querySelector('[data-r4-spine]');
  const runtime = page.querySelector('[data-r4-runtime]');
  const runtimeStory = page.querySelector('[data-r4-runtime-story]');
  const sourceNodes = runtime ? [...runtime.querySelectorAll('[data-source-anchor]')] : [];

  if (pearl) {
    if (reduce.matches || !('IntersectionObserver' in window)) {
      pearl.classList.add('is-r4-pearl-live');
    } else {
      const pearlObserver = new IntersectionObserver((entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        pearl.classList.add('is-r4-pearl-live');
        observer.disconnect();
      }, { threshold: 0.2, rootMargin: '-8% 0px -14% 0px' });
      pearlObserver.observe(pearl);
    }
  }

  if (spine) {
    if (reduce.matches || !('IntersectionObserver' in window)) {
      spine.classList.add('is-r4-route-resolved');
    } else {
      const spineObserver = new IntersectionObserver((entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        spine.classList.add('is-r4-route-resolved');
        observer.disconnect();
      }, { threshold: 0.42 });
      spineObserver.observe(spine);
    }
  }

  let immutableTrace = null;
  let runtimeWeights = [];
  let runtimeWeightTotal = 1;
  let lastRuntimeIndex = -1;

  function setRuntimeInvalid(message, error) {
    if (!runtime) return;
    runtime.dataset.runtimeValid = 'false';
    const status = runtime.querySelector('[data-runtime-status]');
    if (status) status.textContent = lang === 'ru' ? 'SOURCE MAP INVALID' : 'SOURCE MAP INVALID';
    const activeTitle = runtime.querySelector('[data-runtime-active-title]');
    const activeDetail = runtime.querySelector('[data-runtime-active-detail]');
    if (activeTitle) activeTitle.textContent = lang === 'ru' ? 'Проверка привязки источника не пройдена' : 'Source mapping validation failed';
    if (activeDetail) activeDetail.textContent = message;
    console.error('[AI Systems R4 runtime mapping]', message, error || '');
  }

  function eventMeta(event) {
    const parts = [];
    if (event.detail?.tool) parts.push(event.detail.tool);
    if (event.detail?.attempt) parts.push(`attempt ${event.detail.attempt}`);
    if (event.detail?.risk) parts.push(`risk ${event.detail.risk}`);
    if (event.detail?.confidence) parts.push(`confidence ${event.detail.confidence}`);
    if (event.detail?.boundary) parts.push(event.detail.boundary);
    return parts.join(' · ');
  }

  function renderRuntime(index, force = false) {
    if (!runtime || !immutableTrace?.length) return;
    const next = clamp(Math.round(index), 0, immutableTrace.length - 1);
    if (!force && next === lastRuntimeIndex) return;
    lastRuntimeIndex = next;

    const event = immutableTrace[next];
    const visual = visualForEvent(event, lang);
    if (!visual) {
      setRuntimeInvalid(`No visual mapping for ${event.type}`);
      return;
    }

    runtime.dataset.runtimeState = event.type.toLowerCase().replaceAll('_', '-');
    runtime.classList.toggle('is-machine-stopped', event.type === EVENT.MACHINE_STOPPED);
    runtime.classList.toggle('is-authority-approved', next >= immutableTrace.findIndex((item) => item.type === EVENT.AUTHORITY_APPROVED));
    runtime.classList.toggle('is-action-available', next >= immutableTrace.findIndex((item) => item.type === EVENT.ACTION));

    sourceNodes.forEach((node) => {
      const active = visual.anchors.includes(node.dataset.sourceAnchor);
      node.classList.toggle('is-active', active);
      if (active) node.setAttribute('aria-current', 'true');
      else node.removeAttribute('aria-current');
    });

    const ledgerItems = [...runtime.querySelectorAll('[data-runtime-event-index]')];
    ledgerItems.forEach((item) => {
      const itemIndex = Number(item.dataset.runtimeEventIndex);
      item.classList.toggle('is-past', itemIndex < next);
      item.classList.toggle('is-active', itemIndex === next);
      item.classList.toggle('is-future', itemIndex > next);
      item.classList.toggle('is-near', itemIndex >= Math.max(0, next - 4) && itemIndex <= next);
      if (itemIndex === next) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });

    const title = runtime.querySelector('[data-runtime-active-title]');
    const detail = runtime.querySelector('[data-runtime-active-detail]');
    const meta = runtime.querySelector('[data-runtime-active-meta]');
    const count = runtime.querySelector('[data-runtime-count]');
    if (title) title.textContent = visual.title;
    if (detail) detail.textContent = visual.detail;
    if (meta) meta.textContent = eventMeta(event) || `EVENT ${String(event.seq).padStart(2, '0')}`;
    if (count) count.textContent = `${String(event.seq).padStart(2, '0')} / ${String(immutableTrace.length).padStart(2, '0')}`;
  }

  function runtimeIndexForProgress(progress) {
    const p = clamp(progress);
    const target = p * runtimeWeightTotal;
    let acc = 0;
    for (let i = 0; i < runtimeWeights.length; i += 1) {
      acc += runtimeWeights[i];
      if (target <= acc || i === runtimeWeights.length - 1) return i;
    }
    return runtimeWeights.length - 1;
  }

  async function initRuntime() {
    if (!runtime) return;
    try {
      const result = await runControlledAgent(
        {
          id: 'R4-REF-204',
          subject: 'Prepare a controlled CRM change through the reference runtime',
          action: 'change_record',
          route: 'operations',
        },
        {
          registry: createReferenceRegistry({ failPreviewAttempts: 2 }),
          approval: true,
          retryLimit: 1,
        },
      );

      immutableTrace = Object.freeze(result.trace.map((event) => Object.freeze(event)));
      const missingAnchors = REQUIRED_SOURCE_ANCHORS.filter((anchor) => !sourceNodes.some((node) => node.dataset.sourceAnchor === anchor));
      const unmapped = immutableTrace.filter((event) => !visualForEvent(event, lang));

      if (missingAnchors.length || unmapped.length) {
        const problems = [
          missingAnchors.length ? `missing source anchors: ${missingAnchors.join(', ')}` : '',
          unmapped.length ? `unmapped events: ${unmapped.map((event) => event.type).join(', ')}` : '',
        ].filter(Boolean).join('; ');
        setRuntimeInvalid(problems);
        return;
      }

      const ledger = runtime.querySelector('[data-runtime-ledger]');
      if (ledger) {
        ledger.replaceChildren();
        immutableTrace.forEach((event, index) => {
          const visual = visualForEvent(event, lang);
          const li = document.createElement('li');
          li.dataset.runtimeEventIndex = String(index);
          li.className = 'ai-r4-runtime-event is-future';
          const indexNode = document.createElement('span');
          indexNode.className = 'ai-r4-runtime-event__index';
          indexNode.textContent = String(event.seq).padStart(2, '0');
          const body = document.createElement('span');
          body.className = 'ai-r4-runtime-event__body';
          const strong = document.createElement('strong');
          strong.textContent = visual.title;
          const small = document.createElement('small');
          small.textContent = eventMeta(event);
          body.append(strong, small);
          li.append(indexNode, body);
          ledger.append(li);
        });
      }

      runtimeWeights = immutableTrace.map((event) => {
        if (event.type === EVENT.MACHINE_STOPPED) return 4.6;
        if (event.type === EVENT.HUMAN_AUTHORITY_REQUIRED) return 1.45;
        if (event.type === EVENT.AUTHORITY_APPROVED) return 1.35;
        return 1;
      });
      runtimeWeightTotal = runtimeWeights.reduce((sum, weight) => sum + weight, 0);
      runtime.dataset.runtimeValid = 'true';
      const status = runtime.querySelector('[data-runtime-status]');
      if (status) status.textContent = lang === 'ru'
        ? 'IMMUTABLE LOCAL TRACE · SAFE FIXTURE · NO NETWORK'
        : 'IMMUTABLE LOCAL TRACE · SAFE FIXTURE · NO NETWORK';

      if (reduce.matches) {
        runtime.dataset.runtimeReduced = 'true';
        renderRuntime(immutableTrace.length - 1, true);
        [...runtime.querySelectorAll('[data-runtime-event-index]')].forEach((item) => item.classList.add('is-past'));
      } else {
        renderRuntime(0, true);
        schedule();
      }
    } catch (error) {
      setRuntimeInvalid(lang === 'ru' ? 'Не удалось получить референсный trace.' : 'Unable to obtain the reference trace.', error);
    }
  }

  function ordinaryProgress(section, lead = 0.72, trail = 0.24) {
    if (!section) return 0;
    const rect = section.getBoundingClientRect();
    const vh = window.visualViewport?.height || window.innerHeight;
    const start = vh * lead;
    const distance = Math.max(1, rect.height + vh * (lead - trail));
    return clamp((start - rect.top) / distance);
  }

  function stickyProgress(story) {
    if (!story) return 0;
    const rect = story.getBoundingClientRect();
    const vh = window.visualViewport?.height || window.innerHeight;
    const travel = Math.max(1, rect.height - vh);
    return clamp(-rect.top / travel);
  }

  function updateRegister() {
    if (!register) return;
    if (reduce.matches) {
      register.dataset.registerStep = '3';
      register.style.setProperty('--register-progress', '0.78');
      return;
    }
    const p = ordinaryProgress(register, 0.78, 0.24);
    const step = p < 0.22 ? 0 : p < 0.45 ? 1 : p < 0.69 ? 2 : 3;
    register.dataset.registerStep = String(step);
    register.style.setProperty('--register-progress', String(Math.min(p, 0.79)));
  }

  function updateDepth() {
    if (!depthStory) return;
    const depth = depthStory.querySelector('[data-r4-depth]');
    if (!depth) return;
    if (reduce.matches || !desktopDepth.matches || phoneLandscape.matches) {
      depth.dataset.depthStep = '4';
      return;
    }
    const p = stickyProgress(depthStory);
    depth.dataset.depthStep = String(Math.min(4, Math.floor(clamp(p) * 5)));
  }

  function updateRuntime() {
    if (!runtime || !runtimeStory || !immutableTrace?.length || reduce.matches) return;
    const p = stickyProgress(runtimeStory);
    renderRuntime(runtimeIndexForProgress(p));
    runtime.style.setProperty('--runtime-progress', p.toFixed(4));
  }

  function updateAuthority() {
    if (!authority) return;
    if (reduce.matches) {
      authority.dataset.authorityState = 'crossed';
      return;
    }
    const p = ordinaryProgress(authority, 0.76, 0.18);
    authority.dataset.authorityState = p < 0.43 ? 'closed' : p < 0.68 ? 'resolved' : 'crossed';
    authority.style.setProperty('--authority-progress', p.toFixed(4));
  }

  let frame = 0;
  function runFrame() {
    frame = 0;
    updateRegister();
    updateDepth();
    updateRuntime();
    updateAuthority();
  }

  function schedule() {
    if (frame) return;
    frame = window.requestAnimationFrame(runFrame);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.visualViewport?.addEventListener('resize', schedule, { passive: true });
  desktopDepth.addEventListener?.('change', schedule);
  phoneLandscape.addEventListener?.('change', schedule);

  reduce.addEventListener?.('change', () => {
    page.dataset.motion = reduce.matches ? 'reduced' : 'ready';
    if (reduce.matches) {
      revealNodes.forEach((node) => node.classList.add('is-r4-visible'));
      pearl?.classList.add('is-r4-pearl-live');
      spine?.classList.add('is-r4-route-resolved');
    }
    schedule();
  });

  schedule();
  initRuntime();
})();
