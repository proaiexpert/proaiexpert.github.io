import { EVENT, runReferenceScenario } from './controlled-agent-reference.mjs';

(() => {
  'use strict';

  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('ai-r3-js');
  if (reduce) root.classList.add('ai-r3-reduce');

  const activate = (el) => el.classList.add('is-r3-live');
  const revealTargets = [...document.querySelectorAll('[data-r3-reveal], [data-r3-sequence]')];

  if (reduce || !('IntersectionObserver' in window)) {
    revealTargets.forEach(activate);
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        activate(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -7% 0px' });
    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  const hero = document.querySelector('[data-r3-hero]');
  const registerHero = () => hero?.classList.add('is-registered');
  if (reduce) registerHero();
  else requestAnimationFrame(() => setTimeout(registerHero, 220));

  const eventAlias = new Map([
    [EVENT.INCOMING_REQUEST, 'incoming'],
    [EVENT.STATE_VALIDATED, 'validated'],
    [EVENT.CONTEXT_RECOVERED, 'context'],
    [EVENT.POLICY_CHECK, 'policy'],
    [EVENT.TOOL_CALL, 'tool'],
    [EVENT.TOOL_RESULT, 'result'],
    [EVENT.RISK_CHECK, 'risk'],
    [EVENT.HUMAN_AUTHORITY_REQUIRED, 'human'],
    [EVENT.MACHINE_STOPPED, 'stop'],
    [EVENT.AUTHORITY_APPROVED, 'approved'],
    [EVENT.ACTION, 'action'],
  ]);

  const execution = document.querySelector('[data-r3-execution]');
  const executionSteps = execution ? [...execution.querySelectorAll('[data-event]')] : [];
  const codeLines = [...document.querySelectorAll('[data-code-stage]')];
  let executionStarted = false;

  const setStage = (alias) => {
    executionSteps.forEach((step) => {
      const active = step.dataset.event === alias;
      step.classList.toggle('is-active', active);
      if (active) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
    codeLines.forEach((line) => line.classList.toggle('is-active', line.dataset.codeStage === alias));
    execution?.setAttribute('data-current', alias);
  };

  const finalizeExecution = () => {
    execution?.classList.add('is-complete');
    setStage('action');
  };

  async function playExecution() {
    if (executionStarted || !execution) return;
    executionStarted = true;
    try {
      const result = await runReferenceScenario({ approval: true });
      const stages = result.trace.map((event) => eventAlias.get(event.type)).filter(Boolean);
      const orderedUnique = stages.filter((stage, index) => stages.indexOf(stage) === index);
      if (reduce) {
        orderedUnique.forEach((stage) => {
          const node = execution.querySelector(`[data-event="${stage}"]`);
          node?.classList.add('is-passed');
        });
        finalizeExecution();
        return;
      }
      let delay = 0;
      orderedUnique.forEach((stage, index) => {
        const hold = stage === 'stop' ? 900 : stage === 'human' ? 620 : 360;
        delay += index === 0 ? 0 : hold;
        window.setTimeout(() => {
          setStage(stage);
          const node = execution.querySelector(`[data-event="${stage}"]`);
          execution.querySelectorAll('[data-event].is-active').forEach((active) => {
            if (active !== node) active.classList.add('is-passed');
          });
          if (stage === 'stop') execution.classList.add('is-stopped');
          if (stage === 'approved') execution.classList.add('is-approved');
          if (stage === 'action') finalizeExecution();
        }, delay);
      });
    } catch (error) {
      execution.classList.add('is-error');
      finalizeExecution();
      console.error('[ProAI reference execution]', error);
    }
  }

  if (execution) {
    if (reduce || !('IntersectionObserver' in window)) playExecution();
    else {
      const executionObserver = new IntersectionObserver((entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        playExecution();
        observer.disconnect();
      }, { threshold: 0.34 });
      executionObserver.observe(execution);
    }
  }

  const pointerMaterials = [...document.querySelectorAll('[data-r3-material]')];
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (finePointer && !reduce) {
    pointerMaterials.forEach((material) => {
      material.addEventListener('pointermove', (event) => {
        const rect = material.getBoundingClientRect();
        material.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
        material.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
      });
      material.addEventListener('pointerleave', () => {
        material.style.removeProperty('--mx');
        material.style.removeProperty('--my');
      });
    });
  }

  const depth = document.querySelector('[data-r3-depth]');
  if (depth && finePointer && !reduce) {
    depth.addEventListener('pointermove', (event) => {
      const rect = depth.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      depth.style.setProperty('--rx', `${(-y * 2.2).toFixed(2)}deg`);
      depth.style.setProperty('--ry', `${(x * 3).toFixed(2)}deg`);
    });
    depth.addEventListener('pointerleave', () => {
      depth.style.setProperty('--rx', '0deg');
      depth.style.setProperty('--ry', '0deg');
    });
  }
})();
