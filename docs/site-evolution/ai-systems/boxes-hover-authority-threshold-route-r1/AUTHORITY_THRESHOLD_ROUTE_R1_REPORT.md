# Authority Threshold route R1 — отчёт

## Итог

Статус: **ROUTE VISIBILITY LIMITED**.

В полном frozen Hero собран review-only route из пяти физических Cube Instance placements. Шесть состояний заранее сериализованы в отдельные payloads и запускаются через fresh `Application` boot. В реальном Chrome/WebGPU подтверждены загрузка, 143 Cube Meshes, 143 material identities, native center hover и native settling.

Desktop route читается: активный stage получает Indigo, Decision Gate остаётся Pearl, а легенда показывает один связный порядок `AI AGENT → AUTOMATION → API → CUSTOM CODE → DECISION GATE`. Строгий iPhone PASS не заявляется: доступный browser backend не предоставляет mobile emulation или реальное устройство. Кроме того, BASE и GATE оптически близки, поскольку утверждённый R3 neutral и resolved Silver используют один и тот же neutral recipe. Финальную 3.8s choreography не начинать.

## Authority и scope

- Branch: `agent/proai-boxes-hover-authority-threshold-route-r1`
- Start/base: `2b8ca329f755355bd143cd5e7f2e6950c4ee91ad`
- Selective-state technical authority: `agent/proai-boxes-hover-semantic-instance-state-r1`, `2b8ca329f755355bd143cd5e7f2e6950c4ee91ad`
- Accepted R3 payload: `1269ea60eb7725e59822ba2b9e789a2d9dd8956f557ffbbedfbb39e97a12c4d0`
- Runtime: `@splinetool/runtime@2.0.27`
- Loader: `@splinetool/loader@2.0.27`
- Requested choreography spec reference: `3b1a24ff56a965fd5169bcf217486129a27cde13`

The requested choreography commit was not present in this clone or fetched origin, and `docs/operations/CLOUDFLARE_REMOTE_VISUAL_REVIEW.md` was not present in the checkout/history. The full route requirements were supplied in the execution task and were followed. This repository discrepancy is preserved as a limitation; no guessed source document was created.

## Full instance map

The accepted R3 payload was decoded with the existing public msgpackr extension registration and all 142 `Instance` children were exported. Every record contains:

- instance ID;
- serialized path;
- serialized position;
- shared component ID.

The map is in `all-instance-map.json`. Source topology is one `Cube` component plus 142 instances under `Boxes`, for 143 children total. All instances reference component `59d52622-c138-4b29-ad19-059c64a37d07`.

## Selected coherent route

The route uses five adjacent placements on the same right-side field line, `x=200`, with `z` spacing of 100. This keeps the native camera, density and topology while making the semantic path a physical cluster rather than isolated arbitrary points.

| Stage | Instance ID | Serialized path | Position | State role |
|---|---|---|---|---|
| 01 AI AGENT | `46154286-13e1-464a-a27c-84bd720a9cce` | `root.scene.objects.0.children.2.children.97` | `[200, 0, 250]` | Indigo activation |
| 02 AUTOMATION | `889ba072-8c04-4fa0-80f7-5c32e26dd963` | `root.scene.objects.0.children.2.children.110` | `[200, 0, 150]` | Indigo activation |
| 03 API | `9d07611a-c5ce-4020-abf0-dd0f4ca95d89` | `root.scene.objects.0.children.2.children.129` | `[200, 0, 50]` | Indigo activation |
| 04 CUSTOM CODE | `1687f9e7-cac3-4b61-b5f6-a6dd86082fff` | `root.scene.objects.0.children.2.children.142` | `[200, 0, -50]` | Indigo activation |
| 05 DECISION GATE | `b3dc4e58-17e8-4fe9-a3f9-d22065e088fa` | `root.scene.objects.0.children.2.children.84` | `[200, 0, -150]` | Pearl endpoint |

## State model and exact recipes

All states keep `colorB #020304`, native pattern structure, physical layer, transmission layer, component references, geometry and events.

| State | Active Indigo | Resolved Silver | Pearl |
|---|---|---|---|
| BASE | none | none | Decision Gate |
| 1 AGENT | AI AGENT | none | Decision Gate |
| 2 AUTOMATION | AUTOMATION | AI AGENT | Decision Gate |
| 3 API | API | AI AGENT, Automation | Decision Gate |
| 4 CUSTOM CODE | Custom Code | AI Agent, Automation, API | Decision Gate |
| 5 GATE | none | AI Agent, Automation, API, Custom Code | Decision Gate |

Recipes:

- neutral / resolved Silver: R3 `colorA #C9CDD1`, `colorB #020304`;
- Indigo active: `colorA #676BFF`, `colorB #020304`;
- Pearl Gate: `colorA #F2F0EB`, `colorB #020304`.

Pearl is never assigned the Indigo color. Since neutral and resolved Silver intentionally share the accepted R3 recipe, `state-base.bin` and `state-gate.bin` are byte-identical (`ac1bd488f3517d4295faace9c2eda243f81759ff4810798262f90eac09729e23`). This is a known visibility limitation, not a serialization error.

## Serialization method and diff gate

Each payload uses:

`decode → selected instance.data.overrides[source Cube Mesh UUID] → encode → fresh runtime boot`

The override is native `Ext6` and points to the source Cube Mesh UUID `2264fe3b-7194-4ee4-adea-5fa8fa9f00b1`. Each changed instance receives a source-compatible full `Cube Material` record with native `Ext2` layer table. Only the pattern `colorA` carries the semantic difference; the full record is required because the public runtime treats material as an entire composite override.

State payload evidence:

| State | Bytes | SHA256 | Changed leaves | Disallowed | Round-trip disallowed |
|---|---:|---|---:|---:|---:|
| BASE | 46,795 | `ac1bd488f3517d4295faace9c2eda243f81759ff4810798262f90eac09729e23` | 65 | 0 | 0 |
| 1 AGENT | 47,111 | `f7eca1985604ff57f29c112be5a221da7f980641d46a3bde91c04aa90bf68923` | 130 | 0 | 0 |
| 2 AUTOMATION | 47,111 | `54ff79c122387ee963a8cd41dbc8605c358b5664d4fa32a3935c7bca0378add3` | 130 | 0 | 0 |
| 3 API | 47,111 | `5adbcc081d5ae06ab582c5dbc7a153d135f29a4811a92064dd093d6fbac86ad6` | 130 | 0 | 0 |
| 4 CUSTOM CODE | 47,113 | `cdc0ba3d5c25d368834ffbd2981669620f4e6a5bdb378fb1e70c48a1060876de` | 130 | 0 | 0 |
| 5 GATE | 46,795 | `ac1bd488f3517d4295faace9c2eda243f81759ff4810798262f90eac09729e23` | 65 | 0 | 0 |

No global Cube Material, Light Material, camera, geometry, hierarchy or events were changed. No runtime material mutation was used. Exact state diffs are in `state-diffs.json`.

## Review page

Review-only page:

`owner-preview/authority-threshold-route-r1.html`

URL shape for the Coordinator mirror:

`/owner-preview/authority-threshold-route-r1.html?lang=en&state=base`

Supported query values:

- `lang=en|ru`;
- `state=base|agent|automation|api|custom-code|gate`.

Controls are review-only and navigate to a fresh page/payload boot. They are not product UI. The frozen Hero shell remains in place with approved EN/RU copy, accepted header/CTA system, exact donor canvas and the established 11-mesh demo UI whitelist cleanup.

## Runtime QA

Real system Google Chrome / WebGPU session:

- Chrome `152.0.0.0`;
- viewport `1117 × 721` CSS px;
- DPR `2.4000000953674316`;
- `isSecureContext = true`;
- `navigator.gpu = true`;
- adapter available;
- all six states `status = ready`;
- 143 runtime Cube Meshes;
- 143 runtime material identities;
- 142 runtime Instance roots;
- fatal console errors: 0;
- no horizontal overflow observed in the tested desktop-width session.

Fresh boots were performed for BASE, 1 AGENT, 2 AUTOMATION, 3 API, 4 CUSTOM CODE and 5 GATE. Runtime layer inspection showed the expected Indigo/Pearl/neutral colors for every state and no non-target changes.

Native interaction check:

- center hover: PASS; after real pointer positioning, the donor expanded into the native dimensional cube field;
- pointer leave / settling: PASS; returning pointer to the header and waiting restored the rest state;
- edge behavior: inherited from the same accepted component/runtime path and prior selective-state native hover proof; no event or geometry changes were introduced in this route payload.

## Visual verdict

### Desktop

**PASS for route visibility at the available desktop-width WebGPU viewport.** The Hero presents the approved copy on the left, the real Boxes Hover field on the right, a physically adjacent five-placement route, visible active Indigo/Pearl state markers and native hover depth. No global Indigo, glow, cyan, teal, camera change, or donor reconstruction was added.

### iPhone

**LIMITED / not authoritative.** The page has the bounded responsive rules for the review controls and no desktop-width horizontal overflow was observed, but this environment did not provide a real iPhone or mobile emulation. Therefore the requested phone legibility cannot be promoted to PASS. The known BASE/GATE optical equivalence also means the endpoint transition is not visually strong enough to claim final phone acceptance.

## Intentionally not done

- no final 3.8s autoplay choreography;
- no execution waves or propagation;
- no labels in the 3D scene, leader lines, badges or tooltips;
- no mobile camera redesign;
- no material tuning;
- no Hero production integration;
- no main modification, merge or deployment.

## Next recommendation

Stop at this gate. Coordinator should mirror the review page path above and inspect the state controls and route on the intended phone. Do not begin final choreography until the phone review either accepts this route or supplies a narrowly scoped visibility correction.

