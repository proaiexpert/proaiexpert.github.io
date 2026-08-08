# ProAI Expert — AI Workflow Rules

**Status:** Canonical project working rule

## Non-stop execution rule

For ProAI Expert work, the assistant/agent must not stop at analysis, commentary, or a recommendation alone.

Every meaningful project turn must end in one of these states:

1. **The next concrete step has already been executed**, or
2. **A complete next-action task/instruction is ready to run immediately**, with the exact source context and save destination defined.

## Handoff ownership

The user must not be used as a manual context-transfer layer between chats/agents.

The assistant/agent owns:
- preserving canonical decisions;
- saving handoff documents;
- naming exact GitHub/Drive locations;
- specifying where outputs must be saved;
- recording status and next action;
- avoiding repeated copy/paste of long prompts or research.

A new chat/agent should normally be able to continue from one concise instruction such as:

> Open the canonical project handoff and execute NEXT ACTION.

## No repeated research by default

Before starting new research, first inspect existing project strategy, handoff, review and implementation documents.

Do not reopen settled strategy unless:
- new evidence materially contradicts it;
- implementation reveals a genuine blocker;
- the owner explicitly reopens the decision.

## Forward-motion standard

Preferred workflow:

`inspect → decide → save decision → execute next step / create executable task → verify → save result → continue`

Avoid:

`inspect → explain → stop`

## Artifact rule

When a task creates an artifact (mockup, screenshot set, review, specification, code branch, QA output), the task must define and verify where that artifact is stored before completion.

Use GitHub for canonical text/spec/code state and Google Drive when binary/design artifacts cannot be stored cleanly through the available GitHub interface.

## Current example

Homepage Hero A+ workflow:

`strategy locked → static R1 → art-director review → static R2 → static approval → code/motion prototype → responsive QA → owner visual approval`

Do not skip approval gates and do not stall between them.
