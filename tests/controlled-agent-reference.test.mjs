import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EVENT,
  createReferenceRegistry,
  runControlledAgent,
  runReferenceScenario,
} from '../assets/js/controlled-agent-reference.mjs';

const types = (result) => result.trace.map((event) => event.type);

test('valid state proceeds to a controlled final action', async () => {
  const result = await runControlledAgent(
    { id: 'T-1', subject: 'Classify intake', action: 'classify_only' },
    { registry: createReferenceRegistry(), approval: false },
  );
  assert.equal(result.status, 'COMPLETED');
  assert.equal(result.action.status, 'reference-action-applied');
  assert.equal(types(result).at(-1), EVENT.ACTION);
});

test('forbidden action stops before any tool call', async () => {
  const result = await runControlledAgent(
    { id: 'T-2', subject: 'Unsafe request', action: 'wire_funds' },
    { registry: createReferenceRegistry(), approval: true },
  );
  assert.equal(result.status, 'STOPPED');
  assert.ok(!types(result).includes(EVENT.TOOL_CALL));
  assert.equal(types(result).at(-1), EVENT.STOPPED);
});

test('configured sensitive action requires explicit human approval', async () => {
  const result = await runControlledAgent(
    { id: 'T-3', subject: 'Prepare outbound change', action: 'change_record' },
    { registry: createReferenceRegistry(), approval: false },
  );
  assert.equal(result.status, 'WAITING_FOR_APPROVAL');
  assert.ok(types(result).includes(EVENT.HUMAN_AUTHORITY_REQUIRED));
  assert.ok(types(result).includes(EVENT.MACHINE_STOPPED));
});

test('tool failure triggers retry and then fallback', async () => {
  const result = await runControlledAgent(
    { id: 'T-4', subject: 'Recover from tool failure', action: 'classify_only' },
    { registry: createReferenceRegistry({ failPreviewAttempts: 2 }), approval: false, retryLimit: 1 },
  );
  assert.equal(result.status, 'COMPLETED');
  assert.equal(result.usedFallback, true);
  assert.ok(types(result).includes(EVENT.TOOL_FAILURE));
  assert.ok(types(result).includes(EVENT.RETRY));
  assert.ok(types(result).includes(EVENT.FALLBACK));
});

test('final action cannot happen before authority is resolved', async () => {
  const result = await runControlledAgent(
    { id: 'T-5', subject: 'Approval boundary', action: 'send_external' },
    { registry: createReferenceRegistry(), approval: false },
  );
  assert.equal(result.status, 'WAITING_FOR_APPROVAL');
  assert.ok(!types(result).includes(EVENT.ACTION));
  assert.equal(types(result).at(-1), EVENT.MACHINE_STOPPED);
});

test('reference trace ordering is deterministic', async () => {
  const first = await runReferenceScenario({ approval: true });
  const second = await runReferenceScenario({ approval: true });
  assert.deepEqual(types(first), types(second));
  assert.deepEqual(first.trace.map((event) => event.seq), first.trace.map((_, index) => index + 1));
  assert.ok(types(first).indexOf(EVENT.AUTHORITY_APPROVED) < types(first).indexOf(EVENT.ACTION));
});
