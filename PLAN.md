# Artemis Mission Control — Plan Multi-Misión

> Estado: **v2.0 deployado en Vercel**
> Última actualización: 2026-05-04

---

## ✅ Fase 1 — Arquitectura Multi-Misión

- [x] `src/missions/` — registry con `artemis1.js`, `artemis2.js`, `artemis3.js`, `index.js`
- [x] `src/composables/useMission.js` — store global reactivo, persiste en localStorage
  - Exports de módulo: `missionEpoch`, `missionPhases`, `missionFallback`, `missionSplashdown`
  - `useFrozenNow()` — congela el reloj en splashdown para misiones históricas
- [x] Actualización de 8 componentes + 3 composables — epoch dinámico, no hardcodeado
- [x] `MissionSelector.vue` — tabs I/II/III con color permanente por misión
- [x] `App.vue` — layout condicional: `historical` / `pre-launch` / `active`
- [x] `applyMissionTheme()` — CSS vars + body bg + document.title + URL hash
- [x] `HistoricalCard.vue` — tarjeta para Artemis I con highlights y watermark
- [x] `PreLaunchDashboard.vue` — container con 6 filas de paneles

---

## ✅ Fase 2 — Paneles Pre-Launch Artemis III

- [x] `LaunchCountdown.vue` — Launch Library 2 API, countdown o NET label
- [x] `MissionOverview.vue` — objetivos, vehículos, aviso Artemis IV, fuentes
- [x] `MilestoneTracker.vue` — hitos hacia el lanzamiento con barra de progreso
- [x] `MediaGallery.vue` — NASA Images API, grid 6 columnas, lazy loading
- [x] `A3NewsPanel.vue` — Spaceflight News API + fallback estático 8 artículos
- [x] `A3SpaceWeather.vue` — DONKI reutilizado con paleta A3

---

## ✅ Fase 3 — Pulido y Detalles

- [x] Transición fade+slide al cambiar de misión (`<Transition name="mission" mode="out-in">`)
- [x] CSS vars dinámicas por misión — acento, background, glow
- [x] Fondo del `body` cambia con cada misión (seteo directo en JS)
- [x] `HistoricalCard` con watermark diagonal "HISTORICAL"
- [x] `MissionSelector` responsive — solo romano en mobile ≤520px
- [x] `document.title` y URL hash actualizados al cambiar misión
- [x] **Fix:** MET de Artemis II congelado en splashdown — `useFrozenNow()`
- [x] **Fix:** NOMINAL deja de parpadear — status `COMPLETED` con dot estático
- [x] **Fix:** Contraste WCAG AA en todos los textos del tema A3 (ratios verificados)
- [x] **Fix:** `--bg` del body no reactivo — seteo directo con `document.body.style`
- [x] **Fix:** CSS vars de A3 no contaminan Artemis II al cambiar de misión

---

## ✅ Fase 4 — Features de Datos

- [x] `NASATVPanel.vue` — YouTube playlist uploads NASA, sin proxy
- [x] `HardwareTracker.vue` — 4 cards de estado + noticias SNAPI + fallback estático
- [x] `MissionComparator.vue` — tabla I/II/III: 11 filas, zebra, columnas color-coded
- [x] `A3CostPanel.vue` — costos estimados, desglose, acumulado programa (~$93.4B), links OIG/GAO
- [x] `LunarSitePanel.vue` — SVG polo sur, 9 sitios candidatos, PSR, por qué el polo sur

---

## ✅ Fase 5 — Tema A3 (Wall-E palette)

- [x] Fondo página Artemis III: `#83b0b5` (steel blue)
- [x] Cards blancas `#ffffff` flotando sobre el fondo — `box-shadow` sutil
- [x] Strip de color en panel-title (amber / teal / navy) identifica cada panel
- [x] Contraste WCAG AA verificado con cálculos reales (todos ≥4.5:1)
- [x] Paleta: `#1d3a4d` navy · `#83b0b5` steel · `#7facaf` teal · `#e3a957` amber · `#f9f1d3` cream · `#b35a3c` rust
- [x] Tile classes: `.tile-warm` / `.tile-cool` / `.tile-dark` en PreLaunchDashboard
- [x] `MissionOverview` totalmente reescrito con variables `--t-*`

---

## ✅ Fixes de Producción / Deploy

- [x] `A3NewsPanel` — fallback 8 artículos reales cuando SNAPI falla en Vercel
- [x] `HardwareTracker` — fallback 5 noticias reales cuando SNAPI falla
- [x] Reemplazado `AbortSignal.timeout()` por `AbortController` manual (compatibilidad)
- [x] URL OIG IG-22-003 actualizada a `/2024/02/` (ruta movida por NASA)
- [x] `rss2json` eliminado — reemplazado por APIs directas sin proxy

---

## ✅ UX / Meta

- [x] `MissionSelector` rediseñado — número romano prominente, borde de color permanente, glow activo
- [x] Meta tags actualizados para dashboard multi-misión (og:title, og:description, twitter:card)
- [x] `index.html` título → "Artemis Mission Control"

---

## APIs en producción

| API | Uso | CORS | Fallback |
|-----|-----|------|---------|
| Launch Library 2 | Countdown A3 | ✓ | NET label estático |
| NASA DONKI | Space weather todas | ✓ | Datos estáticos |
| NASA Images API | Galería A3 | ✓ | Grid vacío |
| Spaceflight News API | News + Hardware | ✓ | Artículos hardcodeados |
| YouTube embed | NASA TV A3 | ✓ | — |
| JPL Horizons | Artemis II telemetría | ✗ proxy | Fallback interpolado |

---

## Datos clave Artemis III

- Lanzamiento: **NET Late 2027** (declarado a Congreso 27 Abr 2026)
- Rediseño anunciado: **27 Feb 2026** — sin alunizaje, LEO rendezvous/docking
- Alunizaje → **Artemis IV ~2028**
- SLS Core Stage en KSC desde **27-28 Abr 2026**
- Orion CM-004 production readiness: **Enero 2028**
- Crew: **no anunciado**

---

## Pendiente / Ideas futuras

- [ ] Artemis IV placeholder card (cuando haya info oficial)
- [ ] Actualizar milestones en `artemis3.js` cuando NASA confirme hitos
- [ ] og:image real (screenshot del dashboard como imagen de preview)
- [ ] Crew panel Artemis III cuando NASA lo anuncie
- [ ] Costos Artemis III cuando OIG publique reporte oficial
