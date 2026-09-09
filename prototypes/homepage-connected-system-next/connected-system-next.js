
(() => {
  'use strict';

  const root = document.querySelector('[data-connected-next]');
  if (!root) return;

  const experience = root.querySelector('[data-experience]');
  const stickyStage = root.querySelector('.connected-next__sticky-stage');
  const artifact = root.querySelector('[data-context-artifact]');
  const ledger = root.querySelector('.ledger-zone');
  const stageButtons = [...root.querySelectorAll('[data-stage-button]')];
  const languageButtons = [...root.querySelectorAll('[data-lang]')];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const lowLandscape = window.matchMedia('(max-height: 520px) and (min-width: 701px)');
  const portrait = window.matchMedia('(max-width: 700px)');
  const tabletScroll = window.matchMedia('(max-width: 900px) and (min-width: 701px) and (pointer: coarse)');
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)');
  const desktopViewport = window.matchMedia('(min-width: 901px)');

  const copy = {
    en: {
      eyebrow: 'THE CONNECTED SYSTEM',
      title: 'What the system connects.',
      support: 'Each stage carries context forward — from the first customer impression to the next business action.',
      origin: 'ORIGIN',
      coherentImpression: 'COHERENT IMPRESSION',
      firstImpression: 'FIRST IMPRESSION',
      customerContext: 'CUSTOMER CONTEXT',
      assistiveStructure: 'ASSISTIVE STRUCTURE',
      humanAuthority: 'HUMAN AUTHORITY',
      resolution: 'RESOLUTION',
      nextAction: 'NEXT ACTION',
      artifactCaptionA: 'CONTEXT ACCRETION',
      artifactCaptionB: 'EACH STATE RETAINS ITS SOURCE',
      ledgerLabel: 'ONE CAUSAL RECORD',
      ledgerHint: 'CONTEXT ACCUMULATES',
      ledgerFoot: 'Nothing is replaced. Each new state is built from the context that came before it.',
      trust: 'TRUST', inquiry: 'INQUIRY', response: 'RESPONSE', result: 'RESULT',
      imprint: 'IMPRINT', attach: 'ATTACH', enrich: 'ENRICH', resolve: 'RESOLVE',
      trustPrimary: 'A credible first impression gives the customer confidence to act.',
      trustSecondary: 'Website, brand, offer clarity and proof align into one coherent business signal.',
      trustComponents: 'Website · Brand · Offer clarity · Proof',
      inquiryPrimary: 'Interest becomes a structured request.',
      inquirySecondary: 'New customer context attaches to the business context that already created trust.',
      inquiryComponents: 'Forms · Calls · Messaging · CRM intake',
      responsePrimary: 'The request becomes organized and easier to act on.',
      responseSecondary: 'AI, automation and routing structure the accumulated context while human authority remains.',
      responseComponents: 'AI · Automation · Routing · Follow-up',
      resultPrimary: 'Accumulated context points to a clearer next business action.',
      resultSecondary: 'The origin, customer request and assistive structure remain traceable inside the resolved state.',
      resultComponents: 'Booking · Proposal · Next action · Measurement',
      originWebsite: 'WEBSITE', originBrand: 'BRAND', originOffer: 'OFFER', originProof: 'PROOF',
      inquiryForm: 'FORM', inquiryCall: 'CALL', inquiryMessage: 'MESSAGE',
      responseAutomation: 'AUTOMATION', responseRouting: 'ROUTING', responseFollowup: 'FOLLOW-UP',
      booking: 'BOOKING', proposal: 'PROPOSAL', nextStep: 'NEXT STEP', measurement: 'MEASUREMENT',
      footerLine: 'From first impression to next business action — one connected, traceable system.'
    },
    ru: {
      eyebrow: 'ЕДИНАЯ СИСТЕМА',
      title: 'Что объединяет система.',
      support: 'Каждый этап передаёт контекст дальше — от первого впечатления клиента до следующего действия бизнеса.',
      origin: 'ОСНОВА', coherentImpression: 'ЦЕЛЬНОЕ ВПЕЧАТЛЕНИЕ', firstImpression: 'ПЕРВОЕ ВПЕЧАТЛЕНИЕ',
      customerContext: 'КОНТЕКСТ КЛИЕНТА', assistiveStructure: 'СТРУКТУРА ПОДДЕРЖКИ',
      humanAuthority: 'КОНТРОЛЬ ЧЕЛОВЕКА', resolution: 'РАЗРЕШЕНИЕ', nextAction: 'СЛЕДУЮЩЕЕ ДЕЙСТВИЕ',
      artifactCaptionA: 'НАКОПЛЕНИЕ КОНТЕКСТА', artifactCaptionB: 'КАЖДЫЙ ЭТАП СОХРАНЯЕТ ИСТОЧНИК',
      ledgerLabel: 'ОДНА ПРИЧИННАЯ ЗАПИСЬ', ledgerHint: 'КОНТЕКСТ НАКАПЛИВАЕТСЯ',
      ledgerFoot: 'Ничего не заменяется: каждое новое состояние строится на контексте предыдущего.',
      trust: 'ДОВЕРИЕ', inquiry: 'ОБРАЩЕНИЕ', response: 'ОТВЕТ', result: 'РЕЗУЛЬТАТ',
      imprint: 'ОТПЕЧАТОК', attach: 'ДОБАВЛЕНИЕ', enrich: 'ОБОГАЩЕНИЕ', resolve: 'НАПРАВЛЕНИЕ',
      trustPrimary: 'Убедительное первое впечатление помогает клиенту решиться на следующий шаг.',
      trustSecondary: 'Сайт, бренд, ясное предложение и подтверждения складываются в один цельный сигнал бизнеса.',
      trustComponents: 'Сайт · Бренд · Ясность предложения · Подтверждения',
      inquiryPrimary: 'Интерес превращается в структурированное обращение.',
      inquirySecondary: 'Новый контекст клиента присоединяется к тому, что уже сформировало доверие.',
      inquiryComponents: 'Формы · Звонки · Сообщения · CRM',
      responsePrimary: 'Обращение становится организованным и готовым к следующему действию.',
      responseSecondary: 'AI, автоматизация и маршрутизация структурируют накопленный контекст, сохраняя контроль за человеком.',
      responseComponents: 'AI · Автоматизация · Маршрутизация · Повторный контакт',
      resultPrimary: 'Накопленный контекст ведёт к более ясному следующему действию бизнеса.',
      resultSecondary: 'Основа, обращение клиента и структура поддержки остаются прослеживаемыми в итоговом состоянии.',
      resultComponents: 'Запись · Предложение · Следующий шаг · Измерение',
      originWebsite: 'САЙТ', originBrand: 'БРЕНД', originOffer: 'ПРЕДЛОЖЕНИЕ', originProof: 'ПОДТВЕРЖДЕНИЯ',
      inquiryForm: 'ФОРМА', inquiryCall: 'ЗВОНОК', inquiryMessage: 'СООБЩЕНИЕ',
      responseAutomation: 'АВТОМАТИЗАЦИЯ', responseRouting: 'МАРШРУТИЗАЦИЯ', responseFollowup: 'ПРОДОЛЖЕНИЕ',
      booking: 'ЗАПИСЬ', proposal: 'ПРЕДЛОЖЕНИЕ', nextStep: 'СЛЕДУЮЩИЙ ШАГ', measurement: 'ИЗМЕРЕНИЕ',
      footerLine: 'От первого впечатления до следующего действия бизнеса — одна связанная и прослеживаемая система.'
    }
  };

  let currentState = 4;
  let currentLanguage = new URLSearchParams(window.location.search).get('lang') === 'ru' ? 'ru' : 'en';
  let manualUntil = 0;
  let frameRequested = false;
  let modeFrame = 0;
  let knownLowLandscape = lowLandscape.matches;
  let knownPortrait = portrait.matches;
  let knownTabletScroll = tabletScroll.matches;
  let modeTransitionUntil = 0;
  let portraitRunway = null;
  let tabletRunway = null;
  let portraitInitialized = false;
  let tabletInitialized = false;
  let lastPortraitProgress = 0;
  let lastScrollY = window.scrollY;
  let knownViewportWidth = window.innerWidth;

  /* R1.4 one-shot interaction authority. */
  let autoplayState = 'idle';
  let autoplayVisibility = 0;
  let autoplayIdleTimer = 0;
  let autoplayTimers = [];
  let autoplayStartScrollY = window.scrollY;
  let autoplayStartedAt = 0;
  let autoplayArmScrollY = window.scrollY;
  let lastUserScrollAt = performance.now();
  let hoverIntentTimer = 0;
  let mobileCueDone = false;
  let mobileCueTimer = 0;

  const PORTRAIT_RUNWAY_MULTIPLIER = 2.10;
  const TABLET_RUNWAY_MULTIPLIER = 1.75;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const desktopAutoplayEligible = () => (
    desktopViewport.matches && finePointer.matches &&
    !tabletScroll.matches && !lowLandscape.matches && !portrait.matches &&
    !reducedMotion.matches
  );

  const clearAutoplayTimers = () => {
    window.clearTimeout(autoplayIdleTimer);
    autoplayIdleTimer = 0;
    autoplayTimers.forEach((timer) => window.clearTimeout(timer));
    autoplayTimers = [];
  };

  const cancelAutoplay = (reason = 'manual', hold = true) => {
    if (['complete','cancelled','abandoned'].includes(autoplayState)) return;
    clearAutoplayTimers();
    autoplayState = reason === 'abandoned' ? 'abandoned' : 'cancelled';
    root.dataset.autoplay = autoplayState;
    root.classList.remove('is-autoplaying','is-autoplay-armed');
    if (hold) manualUntil = Math.max(manualUntil, performance.now() + 1200);
  };

  const finishAutoplay = () => {
    clearAutoplayTimers();
    autoplayState = 'complete';
    root.dataset.autoplay = 'complete';
    root.classList.remove('is-autoplaying','is-autoplay-armed');
    setState(4,'autoplay');
  };

  const scheduleAutoplayStep = (delay, state) => {
    const timer = window.setTimeout(() => {
      if (autoplayState !== 'running' || document.hidden || autoplayVisibility < .42) return;
      setState(state,'autoplay');
    }, delay);
    autoplayTimers.push(timer);
  };

  const startAutoplay = () => {
    if (autoplayState !== 'armed' || !desktopAutoplayEligible() || document.hidden || autoplayVisibility < .58) return;
    autoplayState = 'running';
    autoplayStartedAt = performance.now();
    autoplayStartScrollY = window.scrollY;
    root.dataset.autoplay = 'running';
    root.classList.remove('is-autoplay-armed');
    root.classList.add('is-autoplaying');
    setState(1,'autoplay');
    scheduleAutoplayStep(2500,2);
    scheduleAutoplayStep(5200,3);
    scheduleAutoplayStep(8100,4);
    autoplayTimers.push(window.setTimeout(() => {
      if (autoplayState === 'running') finishAutoplay();
    }, 9100));
  };

  const scheduleAutoplayStart = () => {
    if (autoplayState !== 'armed') return;
    window.clearTimeout(autoplayIdleTimer);
    const idleRemaining = Math.max(0,650 - (performance.now() - lastUserScrollAt));
    autoplayIdleTimer = window.setTimeout(() => {
      if (autoplayState !== 'armed') return;
      if (!desktopAutoplayEligible() || document.hidden || autoplayVisibility < .58) return;
      if (performance.now() - lastUserScrollAt < 640) return scheduleAutoplayStart();
      startAutoplay();
    }, Math.max(820,idleRemaining));
  };

  const armAutoplay = () => {
    if (autoplayState !== 'idle' || !desktopAutoplayEligible() || document.hidden || autoplayVisibility < .58) return;
    autoplayState = 'armed';
    autoplayArmScrollY = window.scrollY;
    root.dataset.autoplay = 'armed';
    root.classList.add('is-autoplay-armed');
    setState(1,'autoplay');
    scheduleAutoplayStart();
  };

  const runMobileCue = () => {
    if (mobileCueDone || reducedMotion.matches || !portrait.matches || lowLandscape.matches || currentState !== 1) return;
    mobileCueDone = true;
    root.classList.add('is-mobile-cue');
    window.clearTimeout(mobileCueTimer);
    mobileCueTimer = window.setTimeout(() => root.classList.remove('is-mobile-cue'),820);
  };

  const setLanguage = (language) => {
    if (!copy[language]) return;
    currentLanguage = language;
    document.documentElement.lang = language;
    root.dataset.language = language;

    root.querySelectorAll('[data-copy]').forEach((node) => {
      const value = copy[language][node.dataset.copy];
      if (value) node.textContent = value;
    });

    languageButtons.forEach((button) => {
      const active = button.dataset.lang === language;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };

  const setState = (state, source = 'system') => {
    const next = clamp(Number(state) || 1, 1, 4);
    if (next === currentState && source === 'system') return;

    currentState = next;
    root.dataset.activeStage = String(next);
    artifact.dataset.state = String(next);

    stageButtons.forEach((button) => {
      const index = Number(button.dataset.stageButton);
      const active = index === next;
      button.classList.toggle('is-past', index < next);
      button.classList.toggle('is-active', active);
      button.classList.toggle('is-future', index > next);
      if (active) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });

    if (source === 'manual') manualUntil = performance.now() + 1600;
  };

  const stateFromProgress = (progress) => {
    if (progress < .23) return 1;
    if (progress < .48) return 2;
    if (progress < .73) return 3;
    return 4;
  };

  const desktopProgress = () => {
    const rect = experience.getBoundingClientRect();
    const viewport = window.innerHeight;
    const startLine = viewport * .30;
    const travel = Math.max(360, rect.height - viewport * .42);
    return clamp((startLine - rect.top) / travel, 0, 1);
  };

  const getPortraitRunway = () => {
    if (portraitRunway) return portraitRunway;

    const rect = experience.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const cssMinHeight = Number.parseFloat(getComputedStyle(experience).minHeight);
    const stableViewport = Number.isFinite(cssMinHeight) && cssMinHeight > window.innerHeight * 1.5
      ? cssMinHeight / PORTRAIT_RUNWAY_MULTIPLIER
      : window.innerHeight;
    const runwayHeight = Number.isFinite(cssMinHeight) && cssMinHeight > stableViewport
      ? cssMinHeight
      : stableViewport * PORTRAIT_RUNWAY_MULTIPLIER;

    portraitRunway = {
      startScroll: absoluteTop - stableViewport * .28,
      travel: Math.max(stableViewport * 1.05, runwayHeight - stableViewport * .84),
      stableViewport
    };
    return portraitRunway;
  };

  const portraitProgress = () => {
    const runway = getPortraitRunway();
    return clamp((window.scrollY - runway.startScroll) / runway.travel, 0, 1);
  };

  const stableStateFromProgress = (progress, direction, initialized) => {
    if (!initialized) return stateFromProgress(progress);

    if (direction > 0) {
      if (progress >= .78) return Math.max(currentState, 4);
      if (progress >= .52) return Math.max(currentState, 3);
      if (progress >= .26) return Math.max(currentState, 2);
      return currentState;
    }

    if (direction < 0) {
      if (progress <= .20) return Math.min(currentState, 1);
      if (progress <= .46) return Math.min(currentState, 2);
      if (progress <= .72) return Math.min(currentState, 3);
    }

    return currentState;
  };

  const getTabletRunway = () => {
    if (tabletRunway) return tabletRunway;

    const rect = experience.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const cssMinHeight = Number.parseFloat(getComputedStyle(experience).minHeight);
    const stableViewport = Number.isFinite(cssMinHeight) && cssMinHeight > window.innerHeight * 1.35
      ? cssMinHeight / TABLET_RUNWAY_MULTIPLIER
      : window.innerHeight;
    const runwayHeight = Number.isFinite(cssMinHeight) && cssMinHeight > stableViewport
      ? cssMinHeight
      : stableViewport * TABLET_RUNWAY_MULTIPLIER;

    tabletRunway = {
      startScroll: absoluteTop - stableViewport * .14,
      travel: Math.max(stableViewport * .78, runwayHeight - stableViewport * .70),
      stableViewport
    };
    return tabletRunway;
  };

  const tabletProgress = () => {
    const runway = getTabletRunway();
    return clamp((window.scrollY - runway.startScroll) / runway.travel, 0, 1);
  };

  const lowLandscapeProgress = () => {
    const rect = experience.getBoundingClientRect();
    const stageHeight = stickyStage?.getBoundingClientRect().height || window.innerHeight * .72;
    const travel = Math.max(window.innerHeight * .72, rect.height - stageHeight);
    return clamp((-rect.top) / travel, 0, 1);
  };

  const updateFromScroll = () => {
    frameRequested = false;
    if (reducedMotion.matches) return;

    if (desktopAutoplayEligible() && ['armed','running','complete','cancelled'].includes(autoplayState)) return;

    if ((portrait.matches && !lowLandscape.matches) || tabletScroll.matches) {
      const isTablet = tabletScroll.matches && !portrait.matches;
      const progress = isTablet ? tabletProgress() : portraitProgress();
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY;
      const direction = delta > 1 ? 1 : delta < -1 ? -1 : 0;

      lastScrollY = scrollY;
      if (!isTablet) lastPortraitProgress = progress;

      if (performance.now() < manualUntil) return;

      const initialized = isTablet ? tabletInitialized : portraitInitialized;
      const next = stableStateFromProgress(progress, direction, initialized);
      if (isTablet) tabletInitialized = true;
      else portraitInitialized = true;
      setState(next);
      return;
    }

    if (performance.now() < manualUntil) return;

    const progress = lowLandscape.matches
      ? lowLandscapeProgress()
      : desktopProgress();

    setState(stateFromProgress(progress));
  };

  const onScroll = () => {
    if (desktopAutoplayEligible()) {
      if (autoplayState === 'running' && Math.abs(window.scrollY - autoplayStartScrollY) > 4 && performance.now() - autoplayStartedAt > 120) {
        cancelAutoplay('manual',true);
      } else if (autoplayState === 'armed') {
        if (Math.abs(window.scrollY - autoplayArmScrollY) > window.innerHeight * .48) {
          cancelAutoplay('abandoned',false);
        } else {
          lastUserScrollAt = performance.now();
          scheduleAutoplayStart();
        }
      } else if (autoplayState === 'idle') {
        lastUserScrollAt = performance.now();
      }
    }
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateFromScroll);
  };

  const stateProgress = (state) => ({ 1: .08, 2: .35, 3: .60, 4: .86 })[state] || .08;
  const portraitStateProgress = (state) => ({ 1: .10, 2: .36, 3: .62, 4: .88 })[state] || .10;
  const tabletStateProgress = (state) => ({ 1: .10, 2: .36, 3: .62, 4: .88 })[state] || .10;

  const alignModeToState = (state) => {
    const progress = portrait.matches && !lowLandscape.matches
      ? portraitStateProgress(state)
      : tabletScroll.matches
        ? tabletStateProgress(state)
        : stateProgress(state);

    if (lowLandscape.matches) {
      const rect = experience.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;
      const stageHeight = stickyStage?.getBoundingClientRect().height || window.innerHeight * .72;
      const travel = Math.max(window.innerHeight * .72, rect.height - stageHeight);
      window.scrollTo({ top: Math.max(0, absoluteTop + travel * progress), behavior: 'auto' });
      setState(state);
      return;
    }

    if (portrait.matches) {
      const runway = getPortraitRunway();
      const target = Math.max(0, runway.startScroll + runway.travel * progress);
      window.scrollTo({ top: target, behavior: 'auto' });
      lastScrollY = target;
      lastPortraitProgress = progress;
      portraitInitialized = true;
      setState(state);
      return;
    }

    if (tabletScroll.matches) {
      const runway = getTabletRunway();
      const target = Math.max(0, runway.startScroll + runway.travel * progress);
      window.scrollTo({ top: target, behavior: 'auto' });
      lastScrollY = target;
      tabletInitialized = true;
      setState(state);
      return;
    }

    setState(state);
  };

  const configureMode = () => {
    const nextLowLandscape = lowLandscape.matches;
    const nextPortrait = portrait.matches;
    const nextTabletScroll = tabletScroll.matches;
    const modeChanged = nextLowLandscape !== knownLowLandscape || nextPortrait !== knownPortrait || nextTabletScroll !== knownTabletScroll;
    const preservedState = currentState;

    knownLowLandscape = nextLowLandscape;
    knownPortrait = nextPortrait;
    knownTabletScroll = nextTabletScroll;

    if (!modeChanged && performance.now() < modeTransitionUntil) return;

    window.cancelAnimationFrame(modeFrame);

    if (modeChanged) {
      if (autoplayState === 'running' || autoplayState === 'armed') cancelAutoplay('manual',true);
      portraitRunway = null;
      tabletRunway = null;
      portraitInitialized = false;
      tabletInitialized = false;
      lastScrollY = window.scrollY;
      modeTransitionUntil = performance.now() + 280;
      manualUntil = Math.max(manualUntil, performance.now() + 760);
      modeFrame = window.requestAnimationFrame(() => {
        modeFrame = window.requestAnimationFrame(() => {
          if (reducedMotion.matches) {
            setState(4);
            return;
          }
          alignModeToState(preservedState);
        });
      });
      return;
    }

    modeFrame = window.requestAnimationFrame(() => {
      manualUntil = 0;
      if (reducedMotion.matches) {
        setState(4);
        return;
      }
      updateFromScroll();
    });
  };

  stageButtons.forEach((button) => {
    const inspect = () => {
      const state = Number(button.dataset.stageButton);
      cancelAutoplay('manual',true);
      setState(state,'manual');
      if ((portrait.matches || tabletScroll.matches) && !lowLandscape.matches && !reducedMotion.matches) alignModeToState(state);
    };
    button.addEventListener('pointerdown', () => cancelAutoplay('manual',true));
    button.addEventListener('click', inspect);
    button.addEventListener('focus', inspect);
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') inspect();
    });
    if (finePointer.matches) {
      button.addEventListener('pointerenter', () => {
        window.clearTimeout(hoverIntentTimer);
        hoverIntentTimer = window.setTimeout(inspect,120);
      });
      button.addEventListener('pointerleave', () => window.clearTimeout(hoverIntentTimer));
    }
  });

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      cancelAutoplay('manual',true);
      const preservedState = currentState;
      setLanguage(button.dataset.lang);
      if ((portrait.matches || tabletScroll.matches) && !lowLandscape.matches && !reducedMotion.matches) {
        portraitRunway = null;
        tabletRunway = null;
        manualUntil = Math.max(manualUntil, performance.now() + 900);
        window.requestAnimationFrame(() => alignModeToState(preservedState));
      }
    });
  });

  const onResize = () => {
    if (Math.abs(window.innerWidth - knownViewportWidth) > 2) {
      knownViewportWidth = window.innerWidth;
      portraitRunway = null;
      tabletRunway = null;
    }
    onScroll();
  };

  const visibilityObserver = new IntersectionObserver((entries) => {
    const entry = entries[0];
    autoplayVisibility = entry?.intersectionRatio || 0;
    if (portrait.matches && autoplayVisibility >= .35) runMobileCue();
    if (!desktopAutoplayEligible()) return;
    if (autoplayVisibility >= .58 && autoplayState === 'idle') return armAutoplay();
    if (autoplayVisibility < .35) {
      if (autoplayState === 'running') cancelAutoplay('manual',true);
      else if (autoplayState === 'armed') cancelAutoplay('abandoned',false);
    }
  }, { threshold:[0,.35,.58,.72] });
  visibilityObserver.observe(stickyStage || experience);

  window.addEventListener('wheel', () => {
    if (autoplayState === 'running') cancelAutoplay('manual',true);
    else if (autoplayState === 'armed') {
      lastUserScrollAt = performance.now();
      scheduleAutoplayStart();
    }
  }, { passive:true });

  root.addEventListener('touchstart', () => cancelAutoplay('manual',true), { passive:true });
  window.addEventListener('keydown', (event) => {
    if (autoplayState === 'running' && ['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key)) cancelAutoplay('manual',true);
  });
  document.addEventListener('selectionchange', () => {
    if (autoplayState !== 'running') return;
    const selection = document.getSelection();
    if (!selection || selection.isCollapsed) return;
    const anchor = selection.anchorNode;
    const target = anchor?.nodeType === Node.TEXT_NODE ? anchor.parentNode : anchor;
    if (target && root.contains(target)) cancelAutoplay('manual',true);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (autoplayState === 'running') cancelAutoplay('manual',true);
      else if (autoplayState === 'armed') window.clearTimeout(autoplayIdleTimer);
    } else if (autoplayState === 'armed') scheduleAutoplayStart();
  });
  window.addEventListener('pagehide', () => {
    clearAutoplayTimers();
    window.clearTimeout(mobileCueTimer);
    window.clearTimeout(hoverIntentTimer);
  }, { once:true });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', configureMode, { passive: true });
  reducedMotion.addEventListener?.('change', configureMode);
  lowLandscape.addEventListener?.('change', configureMode);
  portrait.addEventListener?.('change', configureMode);
  tabletScroll.addEventListener?.('change', configureMode);
  finePointer.addEventListener?.('change', () => {
    if (!desktopAutoplayEligible() && (autoplayState === 'armed' || autoplayState === 'running')) cancelAutoplay('manual',true);
  });
  desktopViewport.addEventListener?.('change', configureMode);

  setLanguage(currentLanguage);
  root.dataset.autoplay = reducedMotion.matches ? 'disabled' : 'idle';
  if (reducedMotion.matches) setState(4);
  else {
    setState(1);
    window.requestAnimationFrame(updateFromScroll);
  }
})();

