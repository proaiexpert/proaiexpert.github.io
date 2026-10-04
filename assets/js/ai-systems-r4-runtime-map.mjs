import { EVENT } from './controlled-agent-reference.mjs';

const LABELS = Object.freeze({
  en: Object.freeze({
    [EVENT.INCOMING_REQUEST]: ['INCOMING REQUEST', 'Reference request enters the controlled runtime.'],
    [EVENT.STATE_VALIDATED]: ['STATE VALIDATED', 'Required fields resolve into a frozen request state.'],
    [EVENT.CONTEXT_RECOVERED]: ['CONTEXT RECOVERED', 'Safe local fixture attaches known context to the same state.'],
    [EVENT.POLICY_CHECK]: ['POLICY CHECK', 'The action is permitted, but its authority requirement remains explicit.'],
    [EVENT.TOOL_CALL]: ['TOOL CALL', 'An allowed registry tool is invoked through the controlled runtime.'],
    [EVENT.TOOL_RESULT]: ['TOOL RESULT', 'The selected tool returns a dry-run result without committing the external change.'],
    [EVENT.TOOL_FAILURE]: ['TOOL FAILURE', 'The primary preview path fails inside the safe local reference fixture.'],
    [EVENT.RETRY]: ['RETRY', 'The runtime retries the approved primary tool within its configured limit.'],
    [EVENT.FALLBACK]: ['FALLBACK', 'The runtime selects the registered fallback after the primary path is exhausted.'],
    [EVENT.RISK_CHECK]: ['RISK / CONFIDENCE', 'Risk and confidence are evaluated before authority can resolve.'],
    [EVENT.HUMAN_AUTHORITY_REQUIRED]: ['HUMAN AUTHORITY', 'Capability is not permission. A separate authority condition is required.'],
    [EVENT.MACHINE_STOPPED]: ['MACHINE STOPPED', 'The agent can continue technically. The runtime refuses to proceed.'],
    [EVENT.AUTHORITY_APPROVED]: ['AUTHORITY APPROVED', 'The reference human-review condition is resolved explicitly.'],
    [EVENT.ACTION]: ['ACTION', 'Only after authority resolves may the final controlled tool execute.'],
    [EVENT.STOPPED]: ['STOPPED', 'The runtime terminates before an impermissible action can execute.'],
  }),
  ru: Object.freeze({
    [EVENT.INCOMING_REQUEST]: ['ВХОДЯЩИЙ ЗАПРОС', 'Референсная задача входит в управляемый runtime.'],
    [EVENT.STATE_VALIDATED]: ['СОСТОЯНИЕ ПРОВЕРЕНО', 'Обязательные поля собраны в неизменяемое состояние запроса.'],
    [EVENT.CONTEXT_RECOVERED]: ['КОНТЕКСТ ВОССТАНОВЛЕН', 'Безопасный локальный fixture добавляет известный контекст в то же состояние.'],
    [EVENT.POLICY_CHECK]: ['ПРОВЕРКА ПРАВИЛ', 'Действие разрешено политикой, но требование полномочий остаётся явным.'],
    [EVENT.TOOL_CALL]: ['ВЫЗОВ ИНСТРУМЕНТА', 'Разрешённый инструмент вызывается через контролируемый runtime.'],
    [EVENT.TOOL_RESULT]: ['РЕЗУЛЬТАТ ИНСТРУМЕНТА', 'Инструмент возвращает dry-run результат без внешнего изменения.'],
    [EVENT.TOOL_FAILURE]: ['ОШИБКА ИНСТРУМЕНТА', 'Основной preview-путь завершается ошибкой в безопасном локальном fixture.'],
    [EVENT.RETRY]: ['ПОВТОР', 'Runtime повторяет разрешённый основной инструмент в заданном лимите.'],
    [EVENT.FALLBACK]: ['РЕЗЕРВНЫЙ ПУТЬ', 'После исчерпания основного пути runtime выбирает зарегистрированный fallback.'],
    [EVENT.RISK_CHECK]: ['РИСК / УВЕРЕННОСТЬ', 'Риск и уверенность оцениваются до разрешения полномочий.'],
    [EVENT.HUMAN_AUTHORITY_REQUIRED]: ['РЕШЕНИЕ ЧЕЛОВЕКА', 'Техническая возможность не означает право действовать.'],
    [EVENT.MACHINE_STOPPED]: ['МАШИНА ОСТАНОВЛЕНА', 'Агент технически может продолжить. Runtime не разрешает.'],
    [EVENT.AUTHORITY_APPROVED]: ['ПОЛНОМОЧИЕ РАЗРЕШЕНО', 'Условие референсной проверки человеком закрыто явно.'],
    [EVENT.ACTION]: ['ДЕЙСТВИЕ', 'Только после разрешения полномочий выполняется финальный инструмент.'],
    [EVENT.STOPPED]: ['ОСТАНОВЛЕНО', 'Runtime завершает выполнение до недопустимого действия.'],
  }),
});

const SOURCE = Object.freeze({
  [EVENT.INCOMING_REQUEST]: ['run-entry'],
  [EVENT.STATE_VALIDATED]: ['validate-request'],
  [EVENT.CONTEXT_RECOVERED]: ['context'],
  [EVENT.POLICY_CHECK]: ['policy'],
  [EVENT.TOOL_CALL]: ['tool-call'],
  [EVENT.TOOL_RESULT]: ['tool-result'],
  [EVENT.TOOL_FAILURE]: ['tool-failure'],
  [EVENT.RETRY]: ['retry'],
  [EVENT.FALLBACK]: ['fallback'],
  [EVENT.RISK_CHECK]: ['risk'],
  [EVENT.HUMAN_AUTHORITY_REQUIRED]: ['human-required'],
  [EVENT.MACHINE_STOPPED]: ['machine-stop'],
  [EVENT.AUTHORITY_APPROVED]: ['authority-approved'],
  [EVENT.ACTION]: ['action'],
  [EVENT.STOPPED]: ['policy-stop'],
});

export function visualForEvent(event, lang = 'en') {
  const locale = LABELS[lang] ? lang : 'en';
  const labels = LABELS[locale][event.type];
  if (!labels || !SOURCE[event.type]) return null;

  let anchors = SOURCE[event.type];
  let title = labels[0];
  let detail = labels[1];

  if (event.type === EVENT.TOOL_CALL && event.detail?.tool === 'crm.previewFallback') {
    anchors = ['fallback-call'];
    title = locale === 'ru' ? 'ВЫЗОВ FALLBACK' : 'FALLBACK TOOL';
    detail = locale === 'ru'
      ? 'Зарегистрированный резервный инструмент получает тот же проверенный payload.'
      : 'The registered fallback tool receives the same validated payload.';
  }

  if (event.type === EVENT.TOOL_CALL && Number(event.detail?.attempt) > 1) {
    anchors = ['retry-call'];
    title = locale === 'ru' ? 'ПОВТОРНЫЙ ВЫЗОВ' : 'RETRY TOOL CALL';
    detail = locale === 'ru'
      ? 'Тот же разрешённый основной инструмент вызывается повторно в пределах лимита.'
      : 'The same allowed primary tool is called again within the configured retry limit.';
  }

  return Object.freeze({ type: event.type, title, detail, anchors: Object.freeze([...anchors]) });
}

export const REQUIRED_SOURCE_ANCHORS = Object.freeze([
  'run-entry',
  'validate-request',
  'context',
  'policy',
  'policy-stop',
  'tool-call',
  'tool-failure',
  'retry',
  'retry-call',
  'fallback',
  'fallback-call',
  'tool-result',
  'risk',
  'human-required',
  'machine-stop',
  'authority-approved',
  'action',
]);
