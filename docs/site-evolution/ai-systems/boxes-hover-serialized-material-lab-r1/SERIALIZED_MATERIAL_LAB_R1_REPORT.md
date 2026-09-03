# Boxes Hover — Serialized Material Lab R1

## OWNER SUMMARY — RU

Дата: 2026-09-03.

Статус: **SERIALIZED PAYLOAD OPAQUE**.

Исходный Golden payload сохранён без изменений. Экспериментальные material payloads не создавались, байты вслепую не патчились, post-load material mutation не повторялась.

## Authorities

- Source material lab HEAD: `9ecfcc724ec64443cfa17ee870ed997e96391fd4`
- Hero frozen HEAD: `38ecb13e1a0d6b5814748d7741ba99ef58197e6b`
- Serialized lab branch: `agent/proai-boxes-hover-serialized-material-lab-r1`
- Runtime: `@splinetool/runtime@2.0.27`
- Golden payload: `owner-preview/assets/3d/boxes-hover/public-original-inline-scene-payload.bin`
- Expected SHA-256: `c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798`

## Deterministic payload format gate

Observed values:

- Byte length: `46,215`
- SHA-256: `c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798`
- Strict UTF-8 decode: **FAIL**
- JSON parse: **FAIL / not applicable after UTF-8 failure**
- First 16 bytes: `D4 72 40 95 A6 73 63 68 65 6D 61 A5 73 63 65 6E`
- Classification: binary compact serialization; no safely verified text/JSON schema or approved decoder was available in this task.

The byte prefix is not a normal JSON, UTF-8, GLB, gzip or ZIP signature. It contains recognizable compact-serialization markers such as `schema`, but that is not sufficient evidence to identify a reversible format or its field boundaries. No heuristic codec assumption was made.

## Stop condition

The payload is not safely interpretable as text/JSON. The task explicitly forbids hex-editing or heuristic binary patching when the payload is compressed, binary-encoded, checksummed or otherwise opaque.

Therefore the following gates are intentionally **NOT REACHED**:

- complete schema/navigation inventory;
- serialized material source mapping;
- no-op parse/serialize round-trip;
- pre-init physical-only payload;
- pre-init pattern color payload;
- Black Chrome / Champagne / Violet candidates;
- candidate payload hashes;
- Golden fidelity QA for experimental payloads;
- Owner material preview.

## Safety record

- Original Golden payload overwritten: **NO**
- Experimental payload copies created: **NO**
- Post-load material mutation used: **NO**
- Custom material factory used: **NO**
- Runtime material replacement used: **NO**
- Three.js reconstruction / BoxGeometry: **NO**
- Hero product modified: **NO**
- Main modified: **NO**
- Merged: **NO**
- Deployed: **NO**
- Enterprise purchased: **NO**

## Decision

The serialized pre-init material path cannot be safely executed from the currently recovered `.bin` payload without a verified decoder/schema. This is a technical stop, not evidence that native material adaptation is impossible in principle.

Stop and wait for Owner. Do not integrate materials into the Hero and do not attempt binary patching without a verified serialization parser or an independently recovered structured source.
