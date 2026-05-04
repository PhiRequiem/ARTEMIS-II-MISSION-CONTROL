# Artemis Mission Control — Plan Multi-Misión

> Estado: en progreso  
> Última actualización: 2026-05-04

---

## Fase 1 — Arquitectura Multi-Misión

### 1.1 Mission Registry
- [x] Crear `src/missions/index.js` — registro central de misiones (id, nombre, estado, epoch, fases, crew, etc.)
- [x] Crear `src/missions/artemis2.js` — extraer config de Artemis II (epoch, fases, fallbackData, crew)
- [x] Crear `src/missions/artemis3.js` — config Artemis III (estado: pre-launch, fecha NET, APIs, objetivos)
- [x] Crear `src/missions/artemis1.js` — tarjeta histórica mínima (sin dashboard completo)

### 1.2 Mission Store / Composable
- [x] Crear `src/composables/useMission.js` — misión activa global (persiste en localStorage)
  - `activeMissionId` (ref, default: 'artemis3')
  - `setMission(id)`
  - `currentMission` computed (devuelve config completa)
  - `missionState` computed ('historical' | 'pre-launch' | 'active')

### 1.3 Actualizar composables existentes
- [x] Actualizar `useMissionData.js` — lee epoch/phases/fallback desde `useMission.js` (reactive)
- [x] Actualizar `useSystemStatus.js` — getMissionDay() ahora usa `missionEpoch` reactivo
- [x] Actualizar `usePhaseContent.js` — usa `missionEpoch` reactivo
- [x] Actualizar 8 componentes — reemplazados imports estáticos por refs reactivas de `useMission.js`
  - MissionClock, TelemetryPanel, AlertsLog, DistanceGauge, MissionCost, MissionTimeline, TrajectoryMap, DSNMap
- [x] App.vue — MET clock y splashdown countdown usan `missionEpoch` / `missionSplashdown`

### 1.4 MissionSelector (componente header)
- [x] Crear `src/components/MissionSelector.vue`
  - Tabs o botones: ARTEMIS I · ARTEMIS II · ARTEMIS III
  - Badge por estado: HISTORICAL / PRE-LAUNCH / ACTIVE
  - Animación de transición al cambiar misión

### 1.5 App.vue — layout condicional
- [x] Actualizar header: título dinámico según misión activa
- [x] Integrar `MissionSelector` en el header
- [x] Renderizado condicional por `missionState`:
  - `historical` → layout actual de Artemis II (paneles completos, datos congelados)
  - `pre-launch` → layout nuevo Artemis III (ver Fase 2) ← stub funcional
  - `active` → layout completo con APIs live
- [x] Crear `HistoricalCard.vue` — tarjeta para Artemis I
- [x] Crear `PreLaunchDashboard.vue` — container stub para Artemis III

---

## Fase 2 — Paneles Pre-Launch Artemis III

### 2.1 LaunchCountdown
- [x] Crear `src/components/artemis3/LaunchCountdown.vue`
  - Launch Library 2 API — CORS directo, countdown si fecha confirmada, NET label si TBD
  - Detalles: vehículo, plataforma, estado

### 2.2 MissionOverview
- [x] Crear `src/components/artemis3/MissionOverview.vue`
  - Objetivos, vehículos (SLS/Orion/HLS), notice alunizaje movido a Artemis IV
  - Crew TBD placeholder

### 2.3 MilestoneTracker
- [x] Crear `src/components/artemis3/MilestoneTracker.vue`
  - Lee milestones de `mission.milestones`, barra de progreso global
  - Done/pending con iconos

### 2.4 MediaGallery
- [x] Crear `src/components/artemis3/MediaGallery.vue`
  - NASA Images API — grid 6 columnas, hover overlay con título
  - Lazy loading, fallback a vacío

### 2.5 A3NewsPanel
- [x] Crear `src/components/artemis3/A3NewsPanel.vue`
  - Fetcha `artemis/feed/` + `kennedy/feed/` via rss2json, merge y ordena por fecha
  - Refresh cada 10 min

### 2.6 A3SpaceWeather
- [x] Crear `src/components/artemis3/A3SpaceWeather.vue`
  - Mismo DONKI data del resto, badge "PRE-LAUNCH ENVIRONMENT MONITORING"

### 2.7 PreLaunchDashboard
- [x] Actualizar `PreLaunchDashboard.vue` — layout real con todos los paneles
  - Row 1: LaunchCountdown (3fr) + MissionOverview (2fr)
  - Row 2: MilestoneTracker + A3NewsPanel + A3SpaceWeather
  - Row 3: MediaGallery (full width)

---

## Extras post-Fase 3

### Fixes
- [x] MET de Artemis II congelado en splashdown (no sigue corriendo después de la misión)
- [x] NOMINAL deja de parpadear cuando la misión completó — status pasa a "COMPLETED" estático con dot apagado
- [x] Links a fuentes oficiales en paneles Artemis III (NASA, SpaceX HLS, Blue Moon, La. Readiness ↗)

### Tema EVA/SpaceX Artemis III
- [x] Clase `.a3-theme` scoped al `PreLaunchDashboard` — no afecta Artemis I/II
- [x] CSS vars `--a3-*`: panel near-black, bordes ice-blue, texto cool-white, tipografía Inter/thin weight
- [x] Countdown font: Inter weight 200 (thin, limpio) en vez de Orbitron — estilo EVA
- [x] `--bg-glow` azul oscuro para Artemis III

## Fase 3 — Pulido y Detalles

### 3.1 Transiciones
- [x] Animación fade + slide al cambiar de misión (`<Transition name="mission" mode="out-in">` con key por misión)
- [x] CSS variables dinámicas — `--accent`, `--accent-dim`, `--accent-glow`, `--accent-border`, `--bg-glow` se actualizan con `watch(currentMission)`
- [x] Background gradient del body usa `var(--bg-glow)` → cambia de violeta → cyan → naranja según misión

### 3.2 Artemis I — Tarjeta histórica
- [x] `HistoricalCard.vue` funcional con highlights, crew, datos de la misión
- [x] Watermark "HISTORICAL" diagonal en el fondo del panel

### 3.3 Responsive / mobile
- [x] `MissionSelector` en mobile: muestra solo número romano (I/II/III) + badge en pantallas ≤480px

### 3.4 Accesibilidad y UX
- [x] `document.title` se actualiza al cambiar de misión
- [x] URL hash (`#artemis2`, `#artemis3`) se actualiza y se restaura al cargar la página

---

## Fase 4 — Features de Datos (en progreso)

### 4.1 NASA TV / Live Stream
- [x] Crear `src/components/artemis3/NASATVPanel.vue`
  - YouTube embed canal NASA (`UCNwkvBoDag92nHiZBzbYicA`)
  - Activo cuando hay evento en vivo, placeholder cuando no
  - Link a NASA+ y calendario de eventos

### 4.2 Hardware Tracker
- [x] Crear `src/components/artemis3/HardwareTracker.vue`
  - RSS NASA filtrado por SLS / Orion / HLS via Spaceflight News API
  - Cards de estado por componente: SLS Core, Orion CM-004, HLS SpaceX, HLS Blue Origin
  - Estado estático (config) + últimas noticias por hardware

### 4.3 Comparador de Misiones
- [x] Crear `src/components/artemis3/MissionComparator.vue`
  - Tabla Artemis I / II / III lado a lado
  - Datos: duración, distancia, tripulación, objetivos, costos, vehículo
  - Lee de los mission configs (no hardcoded)

### 4.4 Panel de Costos Artemis III
- [x] Crear `src/components/artemis3/A3CostPanel.vue`
  - Estimados de costo Artemis III basados en reportes OIG/GAO
  - Comparativa vs Artemis I y II
  - Link a fuentes oficiales (OIG reports)

### 4.5 Exploración Lunar — Artemis IV Preview
- [x] Crear `src/components/artemis3/LunarSitePanel.vue`
  - Sitios candidatos polo sur lunar (datos NASA confirmados)
  - Mini SVG del polo sur con marcadores
  - Contexto: por qué el polo sur, agua helada, etc.

### 4.6 Actualizar PreLaunchDashboard
- [x] Integrar todos los paneles nuevos en el layout
- [ ] Nuevo layout: 5 filas con todos los paneles

---

## APIs Integradas

| API | Misión | CORS | Proxy |
|-----|--------|------|-------|
| JPL Horizons | Artemis II (live) | No | rss2json / interno |
| NASA DONKI | Todas | Sí | No |
| NASA RSS (artemis/feed) | Artemis III pre-launch | No | rss2json |
| NASA RSS (kennedy/feed) | Artemis III pre-launch | No | rss2json |
| Launch Library 2 | Artemis III | Sí | No |
| NASA Images API | Artemis III | Sí | No |
| YouTube embed | Artemis III (launch day) | Sí | No |

---

## Notas de contexto

- Artemis III **ya no incluye alunizaje** (anunciado 27 Feb 2026 por Jared Isaacman)
- Alunizaje movido a **Artemis IV (~2028)**
- Artemis III target: **finales de 2027** (NET declarado a Congreso el 27 Abr 2026)
- SLS Block 1 core stage llegó a KSC el 27-28 Abr 2026
- Orion CM-004 production readiness target: Enero 2028
- Crew: **no anunciado aún**
