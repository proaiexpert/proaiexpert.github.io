# Semantic Visibility + Premium Material Direction R2

## Статус

**SEMANTIC PREMIUM LIMITED**

Создан изолированный owner-review candidate на базе route proof. Семантические состояния сериализуются до запуска runtime и технически различаются. На доступном desktop WebGPU field сохраняет native Boxes Hover, но rest-режим остаётся очень тихим, а реальная iPhone-проверка в этой среде недоступна. Поэтому полный визуальный PASS не заявляется.

## Authorities

- Base branch: `agent/proai-boxes-hover-authority-threshold-route-r1`
- Base HEAD: `6d7002c7013813d1e3779026a846c2580f523d1c`
- Implementation branch: `agent/proai-boxes-hover-semantic-premium-r2`
- Runtime: `@splinetool/runtime@2.0.27`
- Loader authority: `@splinetool/loader@2.0.27`
- Input R3 payload SHA256: `1269ea60eb7725e59822ba2b9e789a2d9dd8956f557ffbbedfbb39e97a12c4d0`

The R3 payload was read as an immutable input. Every review state is a separate serialized copy. No Hero branch, main, merge, or production deployment was touched.

## Состав candidate

- `owner-preview/semantic-premium-r2.html` — frozen Hero shell with review-only state controls and semantic explanation.
- `owner-preview/assets/semantic-premium-r2.js` — fresh payload fetch and fresh Spline `Application` boot per URL/state.
- `scripts/ai-systems/boxes-hover/semantic_premium_r2.mjs` — deterministic pre-init encoder and semantic-diff gate.
- `state-*.bin` — six independent serialized payloads.
- `semantic-premium-diff.json` — compact deterministic diff and invariant record.
- `selected-route.json` — route selection record.

## Material/state recipe

The shared R2 base is neutral black-chrome:

- Neutral: `#9AA1A8 / #020304`
- Active: `#676BFF / #020304`
- Resolved: `#C9CDD1 / #020304`
- Decision Gate: `#F2F0EB / #020304`
- Physical layer: metalness `0.22`, roughness `0.29`, reflectivity `0.38`
- Transmission: unchanged from R3 (`1 / 1.5 / 2.7`)
- Light Material: unchanged

The neutral recipe keeps a graphite body with a silver response. Indigo is scoped to the active route instance only; Pearl is scoped to the gate instance and never becomes Indigo. No glow, cyan, teal, Violet, Champagne, labels, or timed choreography were added.

## Route instances

| Stage | Instance ID | Serialized path | Position |
|---|---|---|---|
| 01 AI AGENT | `46154286-13e1-464a-a27c-84bd720a9cce` | `root.scene.objects.0.children.2.children.97` | `[200, 0, 250]` |
| 02 AUTOMATION | `889ba072-8c04-4fa0-80f7-5c32e26dd963` | `root.scene.objects.0.children.2.children.110` | `[200, 0, 150]` |
| 03 API | `9d07611a-c5ce-4020-abf0-dd0f4ca95d89` | `root.scene.objects.0.children.2.children.129` | `[200, 0, 50]` |
| 04 CUSTOM CODE | `1687f9e7-cac3-4b61-b5f6-a6dd86082fff` | `root.scene.objects.0.children.2.children.142` | `[200, 0, -50]` |
| 05 DECISION GATE | `b3dc4e58-17e8-4fe9-a3f9-d22065e088fa` | `root.scene.objects.0.children.2.children.84` | `[200, 0, -150]` |

## Review states

| State | Active Indigo | Resolved Silver | Pearl |
|---|---|---|---|
| BASE | — | — | gate |
| 1 AGENT | agent | — | gate |
| 2 AUTOMATION | automation | agent | gate |
| 3 API | api | agent, automation | gate |
| 4 CUSTOM CODE | custom-code | agent, automation, api | gate |
| 5 GATE | — | agent, automation, api, custom-code | gate |

Payload evidence:

| State | Bytes | SHA256 | Changed leaves | Disallowed |
|---|---:|---|---:|---:|
| BASE | 46,795 | `10fe04fdbe5be5ba80e8e06230a4306552a2c9978fc3c7bee32eb87f8497ccb4` | 71 | 0 |
| 1 AGENT | 47,111 | `cf01c3e255d59fc1ded91df0018121747187037f4babf2630478915c3c1a0c20` | 136 | 0 |
| 2 AUTOMATION | 47,435 | `b89c2897128b0a30d8ca465072aea41a5b2f7bb7368c2aac7f747edc7f3ad4c2` | 201 | 0 |
| 3 API | 47,759 | `c3ce77c4d905866aecf0fff2056c3171fd78ee9ced76ab45ae7eb9ad5c4bd829` | 266 | 0 |
| 4 CUSTOM CODE | 48,085 | `773167e57558db4983520c0a39bd9d18026cf9be24c04d89a9aea01c1b27f870` | 331 | 0 |
| 5 GATE | 48,093 | `4cd291668e211addd01630d356213065bcc9cd5f17113d26814c1087b3de50c9` | 331 | 0 |

Semantic changes are restricted to the source Cube Material recipe and the five selected instance override material records. Geometry, transforms, camera, hierarchy, events, and donor UI whitelist are outside the diff.

## Runtime QA

Fresh boots were verified in the real system Chrome session:

- Chrome reported by the session: `152.0.0.0`
- Viewport: `1117 × 721` CSS pixels
- DPR: `2.4000000953674316`
- `isSecureContext`: `true`
- `navigator.gpu`: `true`
- Adapter: available
- Runtime state: `ready`
- Cubes: `143`
- Materials: `143`
- Instance roots: `142`
- Horizontal overflow: `false`
- Native center hover: observed; dimensional cube cluster preserved
- Native edge hover: exercised; runtime remained ready and topology stayed intact
- Pointer-leave settling: existing native settling path preserved; no runtime mutation was introduced
- Console: no new fatal runtime error observed; known Spline/WebGPU warnings are not reclassified as failures

EN and RU fresh boots were checked. Approved copy and CTA text were not rewritten. The review page adds only review controls and a compact legend explaining Neutral, Indigo, Silver, and Pearl.

## Визуальный вердикт

Desktop confirms that the exact donor remains recognizable under native hover and that the semantic route is encoded correctly. The review legend makes the progression explicit: Indigo moves from 1 to 4, completed stages become Silver, and Pearl remains the human decision gate.

The candidate is **LIMITED**, not PASS, for two reasons:

1. In the available desktop viewport, the unhovered donor field is still subdued and small at rest; the material refinement improves the graphite/silver hierarchy but cannot make the route visually obvious without touching composition or geometry.
2. A real iPhone or trustworthy mobile emulation was not available in the browser control surface, so iPhone-legible route visibility remains unverified. The CSS includes responsive rules and no horizontal overflow was observed in desktop QA, but this is not evidence of a phone PASS.

This task therefore stops before final timed choreography. No material redesign beyond this candidate, no Indigo/Pearl animation, and no Hero production integration are authorized by this report.

## Review URLs

Local review page:

- `owner-preview/semantic-premium-r2.html?lang=en&state=base`
- `owner-preview/semantic-premium-r2.html?lang=en&state=agent`
- `owner-preview/semantic-premium-r2.html?lang=en&state=automation`
- `owner-preview/semantic-premium-r2.html?lang=en&state=api`
- `owner-preview/semantic-premium-r2.html?lang=en&state=custom-code`
- `owner-preview/semantic-premium-r2.html?lang=en&state=gate`
- Replace `lang=en` with `lang=ru` for the Russian copy.

The local preview server was running on `http://127.0.0.1:4193/` during QA. These are development-only URLs, not production links.

## Stop condition

The branch is ready for Owner/coordinator review as a **SEMANTIC PREMIUM LIMITED** candidate. Do not build the final 3.8-second choreography until the owner approves the material/readability direction and the phone review is performed.
