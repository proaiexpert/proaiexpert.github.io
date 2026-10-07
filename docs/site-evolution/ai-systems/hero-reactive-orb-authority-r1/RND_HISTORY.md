# R&D History — Clearance R1 / R1.1 / R1.2

Три изолированные технические ветки дали полезные сведения о пользовательском вводе и runtime, но их визуальная семья **tile / armored-shell / hollow-shell REJECTED**. Это не Hero authority и не отправная геометрия следующей стадии.

| Этап | Ветка | HEAD | Документированный источник |
|---|---|---|---|
| R1 feasibility | `agent/ai-systems-hero-clearance-feasibility-r1` | `840e20b8cb138e50dcf802f47a8f770912eacabc` | `docs/site-evolution/ai-systems/hero-clearance-feasibility-r1/FEASIBILITY_REPORT.md` |
| R1.1 volumetric recovery | `agent/ai-systems-hero-clearance-r1-1-volumetric-recovery` | `ae7453e4f8b93e985a1353e06b32e7a4127ef350` | `docs/site-evolution/ai-systems/hero-clearance-r1-1-volumetric/IMPLEMENTATION_REPORT.md` |
| R1.2 shell cohesion | `agent/ai-systems-hero-clearance-r1-2-shell-cohesion` | `57da228fde3b2312077a2690f259fd3edd958612` | `docs/site-evolution/ai-systems/hero-clearance-r1-2-shell/IMPLEMENTATION_REPORT.md` |

## Что подтвердили технически

По отчётам реализации/статической проверки и переданному project handoff, эти эксперименты показали осуществимость:

- локального pointer/touch влияния и распространения на соседей;
- контролируемого сжатия/упорядочивания под воздействием, с затуханием без spring/bounce;
- точного покоя после схождения и render-loop IDLE, когда нет работы;
- мобильной одноразовой последовательности REST → PRESSURE/TIGHTEN → HOLD/STILLNESS → RETURN → REST;
- геометрии класса authority как технического эксперимента;
- ограничений DPR, reduced-motion, паузы при скрытом документе и адаптации render scheduling;
- реализации custom Three.js/InstancedMesh и объёмных сценических вариантов.

Это выводы о реализуемости, не доказательство пригодности выбранного внешнего вида.

## Что не доказано / почему ветка закрыта

Отчёты прямо оставляют визуальный/browser/device/performance PASS непроверенным там, где среда не позволяла такую QA. Отдельные статические/геометрические проверки и сообщения о render IDLE не равны пользовательской визуальной приёмке. Независимо от технического результата владелец явно отверг общий визуальный язык плиток, бронированной или полой оболочки. Не продолжать и не переносить эту форму в Hero.

## Переносимые технические уроки

Сохранять как идеи для отдельной будущей адаптации: локальность реакции, управляемое соседнее влияние, демпфирование без пружины и отскока, значимый покой, мобильная одноразовая хореография, отсутствие бесконечного RAF в устойчивом состоянии, reduced-motion/DPR/visibility controls. Не переносить Clearance-геометрию как исходную форму. Следующая реализация начинает с оригинальной композиции и Cloner/local reaction Reactive Orb.
