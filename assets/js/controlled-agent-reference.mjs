/**
 * PROAI CONTROLLED AGENT REFERENCE IMPLEMENTATION
 * Verified ProAI reference implementation · real code · real tests · not a client deployment.
 * Safe local tools only. No network calls, client data, or external side effects.
 */

export const EVENT = Object.freeze({
  INCOMING_REQUEST: 'INCOMING_REQUEST',
  STATE_VALIDATED: 'STATE_VALIDATED',
  CONTEXT_RECOVERED: 'CONTEXT_RECOVERED',
  POLICY_CHECK: 'POLICY_CHECK',
  TOOL_CALL: 'TOOL_CALL',
  TOOL_RESULT: 'TOOL_RESULT',
  TOOL_FAILURE: 'TOOL_FAILURE',
  RETRY: 'RETRY',
  FALLBACK: 'FALLBACK',
  RISK_CHECK: 'RISK_CHECK',
  HUMAN_AUTHORITY_REQUIRED: 'HUMAN_AUTHORITY_REQUIRED',
  MACHINE_STOPPED: 'MACHINE_STOPPED',
  AUTHORITY_APPROVED: 'AUTHORITY_APPROVED',
  ACTION: 'ACTION',
  STOPPED: 'STOPPED',
});

const FORBIDDEN_ACTIONS = new Set(['delete_customer', 'wire_funds']);
const HUMAN_REQUIRED_ACTIONS = new Set(['send_external', 'change_record']);
const ALLOWED_TOOLS = new Set(['context.lookup', 'crm.preview', 'crm.previewFallback', 'crm.apply']);

const freezeEvent = (seq, type, detail = {}) => Object.freeze({ seq, type, detail: Object.freeze({ ...detail }) });
const appendTrace = (trace, type, detail) => Object.freeze([...trace, freezeEvent(trace.length + 1, type, detail)]);

export class ReferenceDecisionProvider {
  constructor(name = 'reference-policy-provider') {
    this.name = name;
  }

  async classify(request) {
    const risk = request.action === 'send_external' || request.action === 'change_record' ? 'elevated' : 'low';
    return Object.freeze({ route: request.route ?? 'operations', confidence: 0.93, risk });
  }
}

export class ToolRegistry {
  #tools = new Map();

  register(name, tool) {
    if (!ALLOWED_TOOLS.has(name)) throw new Error(`Tool not permitted by registry policy: ${name}`);
    if (typeof tool !== 'function') throw new TypeError(`Tool ${name} must be a function`);
    this.#tools.set(name, tool);
    return this;
  }

  get(name) {
    const tool = this.#tools.get(name);
    if (!tool) throw new Error(`Tool not registered: ${name}`);
    return tool;
  }
}

export function validateRequest(input) {
  if (!input || typeof input !== 'object') throw new TypeError('request must be an object');
  const request = {
    id: String(input.id ?? '').trim(),
    subject: String(input.subject ?? '').trim(),
    action: String(input.action ?? '').trim(),
    route: input.route ? String(input.route).trim() : undefined,
  };
  if (!request.id || !request.subject || !request.action) throw new Error('request requires id, subject and action');
  return Object.freeze(request);
}

function resolvePolicy(request) {
  if (FORBIDDEN_ACTIONS.has(request.action)) {
    return Object.freeze({ permitted: false, reason: 'forbidden-action', humanRequired: false });
  }
  return Object.freeze({
    permitted: true,
    reason: 'allowed-by-policy',
    humanRequired: HUMAN_REQUIRED_ACTIONS.has(request.action),
  });
}

async function callToolWithPolicy({ registry, primary, fallback, payload, retryLimit = 1, trace }) {
  let currentTrace = trace;
  for (let attempt = 1; attempt <= retryLimit + 1; attempt += 1) {
    currentTrace = appendTrace(currentTrace, EVENT.TOOL_CALL, { tool: primary, attempt });
    try {
      const result = await registry.get(primary)(payload, { attempt });
      currentTrace = appendTrace(currentTrace, EVENT.TOOL_RESULT, { tool: primary, attempt, ok: true });
      return { result, trace: currentTrace, usedFallback: false };
    } catch (error) {
      currentTrace = appendTrace(currentTrace, EVENT.TOOL_FAILURE, { tool: primary, attempt, message: String(error?.message ?? error) });
      if (attempt <= retryLimit) {
        currentTrace = appendTrace(currentTrace, EVENT.RETRY, { tool: primary, nextAttempt: attempt + 1 });
        continue;
      }
    }
  }

  currentTrace = appendTrace(currentTrace, EVENT.FALLBACK, { tool: fallback });
  currentTrace = appendTrace(currentTrace, EVENT.TOOL_CALL, { tool: fallback, attempt: 1 });
  const result = await registry.get(fallback)(payload, { attempt: 1 });
  currentTrace = appendTrace(currentTrace, EVENT.TOOL_RESULT, { tool: fallback, attempt: 1, ok: true });
  return { result, trace: currentTrace, usedFallback: true };
}

export async function runControlledAgent(input, options = {}) {
  let trace = Object.freeze([]);
  trace = appendTrace(trace, EVENT.INCOMING_REQUEST, { source: 'reference-scenario' });

  let request;
  try {
    request = validateRequest(input);
  } catch (error) {
    trace = appendTrace(trace, EVENT.STOPPED, { reason: 'invalid-input', message: String(error?.message ?? error) });
    return Object.freeze({ status: 'STOPPED', action: null, trace });
  }
  trace = appendTrace(trace, EVENT.STATE_VALIDATED, { requestId: request.id });

  const provider = options.provider ?? new ReferenceDecisionProvider();
  const registry = options.registry ?? createReferenceRegistry();
  const context = await registry.get('context.lookup')({ subject: request.subject }, { attempt: 1 });
  trace = appendTrace(trace, EVENT.CONTEXT_RECOVERED, { records: context.records, provider: provider.name });

  const policy = resolvePolicy(request);
  trace = appendTrace(trace, EVENT.POLICY_CHECK, { permitted: policy.permitted, humanRequired: policy.humanRequired });
  if (!policy.permitted) {
    trace = appendTrace(trace, EVENT.STOPPED, { reason: policy.reason });
    return Object.freeze({ status: 'STOPPED', action: null, trace });
  }

  const decision = await provider.classify(request);
  const toolRun = await callToolWithPolicy({
    registry,
    primary: 'crm.preview',
    fallback: 'crm.previewFallback',
    payload: { request, context, decision },
    retryLimit: options.retryLimit ?? 1,
    trace,
  });
  trace = toolRun.trace;

  trace = appendTrace(trace, EVENT.RISK_CHECK, { risk: decision.risk, confidence: decision.confidence });
  const needsHuman = policy.humanRequired || decision.risk === 'elevated' || decision.confidence < 0.85;

  if (needsHuman) {
    trace = appendTrace(trace, EVENT.HUMAN_AUTHORITY_REQUIRED, { reason: 'sensitive-or-uncertain-action' });
    trace = appendTrace(trace, EVENT.MACHINE_STOPPED, { boundary: 'human-authority' });
    if (options.approval !== true) {
      return Object.freeze({ status: 'WAITING_FOR_APPROVAL', action: null, trace, preview: toolRun.result });
    }
    trace = appendTrace(trace, EVENT.AUTHORITY_APPROVED, { authority: 'reference-human-review' });
  }

  const authorityResolved = !needsHuman || options.approval === true;
  if (!authorityResolved) throw new Error('Invariant violation: final action before authority resolution');

  const action = await registry.get('crm.apply')({ request, preview: toolRun.result }, { attempt: 1 });
  trace = appendTrace(trace, EVENT.ACTION, { action: request.action, status: action.status });
  return Object.freeze({ status: 'COMPLETED', action: Object.freeze(action), trace, usedFallback: toolRun.usedFallback });
}

export function createReferenceRegistry({ failPreviewAttempts = 0 } = {}) {
  const registry = new ToolRegistry();
  registry.register('context.lookup', async () => Object.freeze({ records: 2, source: 'safe-local-fixture' }));
  registry.register('crm.preview', async (payload, meta) => {
    if (meta.attempt <= failPreviewAttempts) throw new Error('simulated preview timeout');
    return Object.freeze({ change: payload.request.action, subject: payload.request.subject, dryRun: true });
  });
  registry.register('crm.previewFallback', async (payload) => Object.freeze({ change: payload.request.action, subject: payload.request.subject, dryRun: true, fallback: true }));
  registry.register('crm.apply', async ({ request, preview }) => {
    if (!preview?.dryRun) throw new Error('apply requires a validated dry-run preview');
    return Object.freeze({ status: 'reference-action-applied', requestId: request.id });
  });
  return registry;
}

export async function runReferenceScenario(options = {}) {
  return runControlledAgent(
    {
      id: 'REF-204',
      subject: 'Route a qualified request and prepare a controlled CRM update',
      action: 'change_record',
      route: 'operations',
    },
    {
      registry: createReferenceRegistry({ failPreviewAttempts: options.failPreviewAttempts ?? 0 }),
      approval: options.approval ?? true,
      retryLimit: 1,
    },
  );
}
