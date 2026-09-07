(() => {
  'use strict';

  const root = document.querySelector('[data-connected-next]');
  if (!root) return;

  const artifact = root.querySelector('[data-context-artifact]');
  const storySteps = [...root.querySelectorAll('[data-story-step]')];
  const stageButtons = [...root.querySelectorAll('[data-stage-button]')];
  const languageButtons = [...root.querySelectorAll('[data-lang]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const lowLandscape = window.matchMedia('(max-height: 520px) and (min-width: 700px)');

  const copy = {
    en: {
      eyebrow: 'THE CONNECTED SYSTEM',
      title: 'What the system connects.',
      support: 'Each stage carries context forward — from the first customer impression to the next business action.',
      originTrace: 'ORIGIN TRACE',
      customerContext: 'CUSTOMER CONTEXT',
      assistiveStructure: 'ASSISTIVE STRUCTURE',
      humanAuthority: 'HUMAN AUTHORITY',
      resolution: 'RESOLUTION',
      artifactCaptionA: 'CONTEXT ACCRETION',
      artifactCaptionB: 'PREVIOUS CONTEXT REMAINS TRACEABLE',
      trust: 'TRUST',
      inquiry: 'INQUIRY',
      response: 'RESPONSE',
      result: 'RESULT',
      nextAction: 'NEXT ACTION',
      imprint: 'IMPRINT',
      attach: 'ATTACH',
      enrich: 'ENRICH',
      resolve: 'RESOLVE',
      trustBody: 'A clear, credible first impression gives the customer confidence to take the next step.',
      inquiryBody: 'Interest becomes a structured request with new customer context attached to what already exists.',
      responseBody: 'AI and automation help organize, route and follow through around the accumulated record without removing human authority.',
      resultBody: 'The accumulated context resolves toward a defined next business action and a measurable state — without claiming a guaranteed outcome.',
      trustComponents: 'Website · Brand · Offer clarity · Proof',
      inquiryComponents: 'Forms · Calls · Messaging · CRM intake',
      responseComponents: 'AI · Automation · Routing · Follow-up',
      resultComponents: 'Booking · Proposal · Next action · Measurement',
      booking: 'BOOKING',
      proposal: 'PROPOSAL',
      nextStep: 'NEXT STEP',
      measurement: 'MEASUREMENT',
      footerLine: 'One continuous causal record. New context accumulates. Previous context remains traceable.'
    },
    ru: {
      eyebrow: 'ЕДИНАЯ СИСТЕМА',
      title: 'Что объединяет система.',
      support: 'Каждый этап передаёт контекст дальше — от первого впечатления клиента до следующего действия бизнеса.',
      originTrace: 'ИСХОДНЫЙ КОНТЕКСТ',
      customerContext: 'КОНТЕКСТ КЛИЕНТА',
      assistiveStructure: 'СТРУКТУРА ПОДДЕРЖКИ',
      humanAuthority: 'КОНТРОЛЬ ЧЕЛОВЕКА',
      resolution: 'СЛЕДУЮЩИЙ ШАГ',
      artifactCaptionA: 'НАКОПЛЕНИЕ КОНТЕКСТА',
      artifactCaptionB: 'ПРЕДЫДУЩИЙ КОНТЕКСТ СОХРАНЯЕТСЯ',
      trust: 'ДОВЕРИЕ',
      inquiry: 'ОБРАЩЕНИЕ',
      response: 'ОТВЕТ',
      result: 'РЕЗУЛЬТАТ',
      nextAction: 'СЛЕДУЮЩЕЕ ДЕЙСТВИЕ',
      imprint: 'ОСНОВА',
      attach: 'ДОБАВИТЬ',
      enrich: 'ОБОГАТИТЬ',
      resolve: 'НАПРАВИТЬ',
      trustBody: 'Понятная и убедительная подача помогает клиенту уверенно сделать следующий шаг.',
      inquiryBody: 'Интерес превращается в структурированный запрос: новый контекст клиента добавляется к уже существующей основе.',
      responseBody: 'AI и автоматизация помогают организовать, направить и продолжить работу с накопленным контекстом, сохраняя контроль за человеком.',
      resultBody: 'Накопленный контекст помогает перейти к конкретному следующему действию и измеримому состоянию — без обещания гарантированного результата.',
      trustComponents: 'Сайт · Бренд · Ясность предложения · Подтверждения',
      inquiryComponents: 'Формы · Звонки · Сообщения · CRM',
      responseComponents: 'AI · Автоматизация · Маршрутизация · Повторный контакт',
      resultComponents: 'Запись · Предложение · Следующий шаг · Аналитика',
      booking: 'ЗАПИСЬ',
      proposal: 'ПРЕДЛОЖЕНИЕ',
      nextStep: 'СЛЕДУЮЩИЙ ШАГ',
      measurement: 'ИЗМЕРЕНИЕ',
      footerLine: 'Одна причинная запись. Новый контекст накапливается. Предыдущий контекст остаётся прослеживаемым.'
    }
  };

  let currentState = 4;
  let currentLanguage = new URLSearchParams(window.location.search).get('lang') === 'ru' ? 'ru' : 'en';
  let observer = null;
  let scrollTick = false;

  const setLanguage = (language) => {
    if (!copy[language]) return;
    currentLanguage = language;
    document.documentElement.lang = language;
    root.dataset.language = language;

    root.querySelectorAll('[data-copy]').forEach((node) => {
      const key = node.dataset.copy;
      if (copy[language][key]) node.textContent = copy[language][key];
    });

    languageButtons.forEach((button) => {
      const active = button.dataset.lang === language;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };

  const setState = (state, source = 'system') => {
    const next = Math.max(1, Math.min(4, Number(state) || 1));
    currentState = next;
    artifact.dataset.state = String(next);
    root.dataset.activeStage = String(next);

    stageButtons.forEach((button) => {
      const active = Number(button.dataset.stageButton) === next;
      button.classList.toggle('is-current', active);
      if (active) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });

    storySteps.forEach((step) => {
      step.classList.toggle('is-current', Number(step.dataset.storyStep) === next);
    });

    if (source === 'button') {
      root.dataset.inspection = 'manual';
      window.clearTimeout(setState.manualTimer);
      setState.manualTimer = window.setTimeout(() => {
        delete root.dataset.inspection;
      }, 1600);
    }
  };

  const nearestStoryState = () => {
    if (root.dataset.inspection === 'manual' || lowLandscape.matches || reducedMotion.matches) return;

    const targetY = window.innerHeight * 0.58;
    let bestState = currentState;
    let bestDistance = Number.POSITIVE_INFINITY;

    storySteps.forEach((step) => {
      const rect = step.getBoundingClientRect();
      const center = rect.top + rect.height * 0.5;
      const distance = Math.abs(center - targetY);
      if (distance < bestDistance && rect.bottom > 0 && rect.top < window.innerHeight) {
        bestDistance = distance;
        bestState = Number(step.dataset.storyStep);
      }
    });

    if (bestDistance < Number.POSITIVE_INFINITY && bestState !== currentState) setState(bestState);
  };

  const onScroll = () => {
    if (scrollTick) return;
    scrollTick = true;
    window.requestAnimationFrame(() => {
      scrollTick = false;
      nearestStoryState();
    });
  };

  const configureMotionMode = () => {
    if (reducedMotion.matches || lowLandscape.matches) {
      setState(4);
      window.removeEventListener('scroll', onScroll);
      observer?.disconnect();
      observer = null;
      return;
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    observer?.disconnect();
    observer = new IntersectionObserver((entries) => {
      if (root.dataset.inspection === 'manual') return;
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setState(Number(visible.target.dataset.storyStep));
    }, {
      root: null,
      rootMargin: '-28% 0px -34% 0px',
      threshold: [0, .2, .45, .7, 1]
    });

    storySteps.forEach((step) => observer.observe(step));
    nearestStoryState();
  };

  stageButtons.forEach((button) => {
    button.addEventListener('click', () => setState(Number(button.dataset.stageButton), 'button'));
    button.addEventListener('focus', () => setState(Number(button.dataset.stageButton), 'button'));
  });

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
  });

  reducedMotion.addEventListener?.('change', configureMotionMode);
  lowLandscape.addEventListener?.('change', configureMotionMode);

  setLanguage(currentLanguage);
  if (reducedMotion.matches || lowLandscape.matches) {
    setState(4);
  } else {
    setState(1);
    window.requestAnimationFrame(configureMotionMode);
  }
})();
