# ProAI Spline Premium R1 Archive

Это архивная handoff-копия owner-review R1 prototype для Spline Rubik premium graphite object.

THIS IS AN OWNER-REVIEW R1 PROTOTYPE.
DO NOT MERGE OR DEPLOY.
DO NOT START HERO INTEGRATION UNTIL OWNER APPROVAL.

## Состав

- `base/scene.splinecode` - untouched base scene, сохранённая из локальной `PROAI_SPLINE_BASE`.
- `prototype/` - минимальный Vanilla JS/Vite runtime prototype для запуска R1.
- `prototype/out/scene.splinecode` - локальная копия сцены, которую prototype грузит через `/out/scene.splinecode`.
- `review/` - owner-review PNG/WebM assets.
- `PROAI_SPLINE_PREMIUM_R1_HANDOFF.md` - технический handoff.

## Локальный запуск prototype

```bash
cd docs/site-evolution/spline/proai-premium-r1/prototype
npm install
npm run dev
```

Prototype не является production integration и не должен подключаться к текущему Hero без owner approval.
