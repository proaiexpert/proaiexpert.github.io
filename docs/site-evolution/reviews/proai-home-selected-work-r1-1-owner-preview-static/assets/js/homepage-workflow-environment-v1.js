(function () {
  'use strict';

  var body = document.body;
  var isRussian = body && body.classList.contains('lang-ru');
  var section = document.getElementById('tech-section-en');

  if (!section || section.querySelector('.hwe-environment')) return;

  function appendStylesheet(href, attribute, value) {
    if (document.querySelector('link[' + attribute + ']')) return;

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute(attribute, value);
    document.head.appendChild(link);
  }

  function installStyles() {
    appendStylesheet(
      '../css/homepage-workflow-environment-v1.css?v=20260803.2',
      'data-homepage-workflow-environment',
      'v1'
    );
    appendStylesheet(
      '../css/homepage-tool-marquee-premium-v1.css?v=20260803.3',
      'data-homepage-tool-marquee-premium',
      'v1'
    );
  }

  function svgOpen() {
    return '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false" style="display:block!important;width:15px!important;height:15px!important;opacity:1!important;visibility:visible!important;overflow:visible!important;fill:none!important;stroke:#75e7ff!important;stroke-width:1.9!important;stroke-linecap:round!important;stroke-linejoin:round!important">';
  }

  function visibleShape(tag) {
    return tag.replace('/>', ' style="opacity:1!important;visibility:visible!important;fill:none!important;stroke:#75e7ff!important;stroke-width:1.9!important;stroke-dasharray:none!important;stroke-dashoffset:0!important"/>');
  }

  function principleIcon(index) {
    var open = svgOpen();
    var icons = [
      open + visibleShape('<path d="M12 3.5 18.5 6v5.2c0 4.2-2.6 7.2-6.5 9.3-3.9-2.1-6.5-5.1-6.5-9.3V6L12 3.5Z"/>') + visibleShape('<path d="m9.4 12.1 1.7 1.7 3.7-4"/>') + '</svg>',
      open + visibleShape('<circle cx="12" cy="8" r="3"/>') + visibleShape('<path d="M6.8 19c.7-3.1 2.5-4.7 5.2-4.7s4.5 1.6 5.2 4.7"/>') + visibleShape('<path d="m16.8 10.8 1.4 1.4 2.3-2.6"/>') + '</svg>',
      open + visibleShape('<circle cx="6" cy="7" r="2"/>') + visibleShape('<circle cx="18" cy="17" r="2"/>') + visibleShape('<path d="M8 7h3.5a4 4 0 0 1 4 4v2a4 4 0 0 0 2.5 3.7"/>') + visibleShape('<path d="m15.7 14.4 2.3 2.3 2.3-2.3"/>') + '</svg>'
    ];

    return icons[index] || icons[0];
  }

  function buildMarkup(russian) {
    var content = russian ? {
      aria: 'Рабочий маршрут от обращения до отчётности',
      control: 'Контрольная точка',
      principlesLabel: 'Принципы рабочего процесса',
      principles: ['Понятная ответственность', 'Проверка человеком', 'Прослеживаемость'],
      steps: [
        ['01', 'Зафиксировать', 'Формы, звонки, почта и сообщения сохраняются вместе с исходным контекстом.'],
        ['02', 'Направить', 'Услуга, срочность и ответственный определяются по понятным правилам.'],
        ['03', 'Подготовить', 'Система собирает данные и готовит черновик на основе утверждённых фактов.'],
        ['04', 'Проверить человеком', 'Чувствительные и значимые случаи подтверждает ответственный сотрудник.'],
        ['05', 'Продолжить', 'Следующее действие, срок и статус не остаются только в памяти команды.'],
        ['06', 'Отчётность', 'Итоги, исключения и узкие места становятся видимыми для улучшения процесса.']
      ]
    } : {
      aria: 'Workflow from inquiry capture to reporting',
      control: 'Control point',
      principlesLabel: 'Workflow principles',
      principles: ['Clear ownership', 'Human review', 'Traceability'],
      steps: [
        ['01', 'Capture', 'Forms, calls, email, and messages are recorded with their original context.'],
        ['02', 'Route', 'Service, urgency, and ownership are assigned through explicit rules.'],
        ['03', 'Draft', 'The system organizes context and prepares a draft from approved facts.'],
        ['04', 'Human Review', 'Sensitive or consequential cases are confirmed by the responsible person.'],
        ['05', 'Follow-up', 'The next action, timing, and status do not remain only in team memory.'],
        ['06', 'Reporting', 'Outcomes, exceptions, and bottlenecks become visible for improvement.']
      ]
    };

    var items = content.steps.map(function (step, index) {
      var humanClass = index === 3 ? ' hwe-step--human' : '';
      var control = index === 3 ? '<span class="hwe-control-label">' + content.control + '</span>' : '';

      return '<li class="hwe-step' + humanClass + '">' +
        '<span class="hwe-index" aria-hidden="true">' + step[0] + '</span>' +
        '<strong class="hwe-title">' + step[1] + '</strong>' +
        '<span class="hwe-copy">' + step[2] + '</span>' +
        control +
      '</li>';
    }).join('');

    var principles = content.principles.map(function (item, index) {
      return '<span role="listitem"><span class="hwe-principle-icon">' + principleIcon(index) + '</span><span class="hwe-principle-text">' + item + '</span></span>';
    }).join('');

    return '<div class="hwe-environment" role="group" aria-label="' + content.aria + '">' +
      '<ol class="hwe-rail">' + items + '</ol>' +
      '<div class="hwe-signal" aria-hidden="true"></div>' +
      '<div class="hwe-principles" role="list" aria-label="' + content.principlesLabel + '">' + principles + '</div>' +
    '</div>';
  }

  function renderToolGroup(group, names, hidden) {
    group.innerHTML = names.map(function (name) {
      return '<div class="t-node">' + name + '</div>';
    }).join('');

    if (hidden) group.setAttribute('aria-hidden', 'true');
  }

  function refreshToolMarquee(tools) {
    var rows = tools.querySelectorAll('.t-main-row, .t-secondary-row');
    var toolSets = [
      ['OpenAI', 'Claude', 'Gemini', 'Chatbase', 'Make', 'n8n', 'Airtable'],
      ['Twilio', 'Google', 'GitHub', 'HubSpot', 'Cloudflare', 'Notion', 'Stripe']
    ];

    Array.prototype.forEach.call(rows, function (row, rowIndex) {
      var groups = row.querySelectorAll('.t-group');
      Array.prototype.forEach.call(groups, function (group, groupIndex) {
        renderToolGroup(group, toolSets[rowIndex], groupIndex > 0);
      });
    });
  }

  function installTapGlow(root) {
    if (!window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    var timer = null;
    root.addEventListener('pointerdown', function (event) {
      var target = event.target.closest('.t-node, .hwe-principles > span');
      if (!target || !root.contains(target)) return;

      root.querySelectorAll('.is-tap-glow').forEach(function (element) {
        element.classList.remove('is-tap-glow');
      });

      target.classList.add('is-tap-glow');
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        target.classList.remove('is-tap-glow');
      }, 620);
    }, { passive: true });
  }

  installStyles();

  var label = section.querySelector('.t-label');
  var title = section.querySelector('.t-title');
  var description = section.querySelector('.t-desc');
  var tools = section.querySelector('.t-container');

  if (label) label.textContent = isRussian ? '// СРЕДА РАБОЧЕГО ПРОЦЕССА' : '// WORKFLOW ENVIRONMENT';
  if (title) {
    title.id = 'workflow-environment-title';
    title.textContent = isRussian ? 'Сначала рабочий процесс. Инструменты — после.' : 'The workflow comes first. Tools support it.';
    section.setAttribute('aria-labelledby', title.id);
  }
  if (description) {
    description.textContent = isRussian
      ? 'Сначала мы проектируем путь от обращения до следующего действия, а затем выбираем подходящий слой автоматизации или AI. Инструменты могут меняться; ответственность, проверка человеком и прослеживаемость должны оставаться понятными.'
      : 'We design the path from inquiry to action before selecting the automation or AI layer. The stack can change; ownership, human review, and traceability should remain clear.';
  }

  if (!tools) return;

  refreshToolMarquee(tools);
  tools.insertAdjacentHTML('beforebegin', buildMarkup(isRussian));

  var caption = document.createElement('p');
  caption.className = 'hwe-tools-caption';
  caption.textContent = isRussian
    ? 'Платформы подбираются под процесс — не наоборот.'
    : 'Platforms follow the workflow — not the other way around.';
  tools.insertAdjacentElement('beforebegin', caption);
  tools.setAttribute('role', 'group');
  tools.setAttribute('aria-label', isRussian ? 'Инструменты рабочей среды' : 'Workflow environment tools');

  installTapGlow(section);
}());
