# Changelog — Artemis II Mission Control Dashboard

Historial de versiones del proyecto. Sigue [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`.

---

## v1.5.0 — 6 abril 2026

### Agregado
- **Panel de costo de misión** (`MissionCost.vue`) — contador en vivo que distribuye $4.1B a lo largo de la misión (~$4,745/seg), desglose por componente (SLS, Orion+ESM, Ground Systems, Mission Ops), métricas de perspectiva y datos curiosos (baño $23M, comida $83K, traje $1B)
- **Easter egg** — click 5 veces en el logo NASA → CREW-5 CONEJONAUTA cruza la pantalla en traje espacial
- **Google Analytics** (G-TBBTDV8N2X) integrado en `index.html`
- **Indicador de versión** en TopBar y ShareBar
- **ROADMAP.md** — documento de planificación estratégica post-Artemis II y preparación para Artemis III
- **CHANGELOG.md** — este archivo

### Mejorado
- Fuentes de datos en `InfoCard.vue` actualizadas: eliminado JPL Horizons (CORS), eliminado rss2json (422), agregado Spaceflight News API y NASA OIG + GAO
- URLs de reportes OIG/GAO apuntan a PDFs directos en lugar de portadas
- `ROADMAP.md` excluido del repositorio público vía `.gitignore`

---

## v1.4.0 — 5 abril 2026

### Agregado
- **PWA** (`vite-plugin-pwa`) — instalable como app en móvil y desktop, funciona offline con datos de fallback. Iconos 192×192 y 512×512 generados
- **Animación de trayectoria en tiempo real** — Orion se mueve con `requestAnimationFrame` + transición CSS `cubic-bezier` de 0.95s

### Mejorado
- RSS reemplazado por **Spaceflight News API** (JSON directo, sin proxy, busca `artemis`)
- **NASA API key** movida a variable de entorno (`VITE_NASA_API_KEY`) — eliminada del código fuente

### Corregido
- Errores 422 de `rss2json.com` resueltos al reemplazar el servicio
- Error 503 de NASA DONKI (servicio caído temporalmente) manejado por fallback estático

---

## v1.3.0 — 4 abril 2026

### Agregado
- **Phase-aware content** (`usePhaseContent.js` + `PhaseAlert.vue`) — panel dinámico que cambia según la fase activa de la misión: pre-lanzamiento, ascenso, órbita, TLI, tránsito, flyby lunar (con blackout), retorno, reentrada y amerizaje. Incluye barra de progreso de quemados, medidor de G-force durante reentrada y mini-mapa de trayectoria por fase
- **OG/meta tags** completos para redes sociales (`og:title`, `og:image`, Twitter Card)
- **Header status dinámico** — badges de estado (NOMINAL/CAUTION/CRITICAL) derivados de `useSystemStatus.js` en tiempo real
- **`useSystemStatus.js`** — composable que simula degradación de sistemas a lo largo de la misión con umbrales de advertencia/crítico

---

## v1.2.0 — 3 abril 2026

### Agregado
- **Mapa DSN** (`DSNMap.vue`) — visualización del Deep Space Network con rotación de estación activa por hora UTC (Goldstone, Madrid, Canberra)
- **Countdown a splashdown** en el header con formato dinámico (días/horas/minutos)
- **Botón fullscreen** con Fullscreen API y ícono adaptativo

---

## v1.1.0 — 2 abril 2026

### Agregado
- **Transmisión en vivo** (`LiveStream.vue`) — embed del stream oficial de NASA en YouTube
- **InfoCard** (`InfoCard.vue`) — panel de fuentes de datos, stack técnico y créditos
- **ShareBar** (footer) y **TopBar** con créditos a PHIREQUIEM y botones de redes sociales (X, LinkedIn, Facebook, Instagram, TikTok)
- **Compartir en Facebook**
- **README.md** completo para GitHub con badges, features, stack, estructura y tabla de tripulación

### Mejorado
- Legibilidad general del dashboard
- Tema visual inspirado en Vite: fondo oscuro con gradientes radiales púrpura

---

## v1.0.0 — 1 abril 2026 🚀

### Lanzamiento inicial

Dashboard completo de Mission Control para Artemis II con los siguientes paneles:

- **MissionClock** — MET gigante, barra de fases, próximo hito con countdown
- **TelemetryPanel** — velocidad, distancia a Tierra/Luna, altitud con datos en tiempo real
- **TrajectoryMap** — trayectoria Earth→Moon→Earth con arco bezier animado, marcadores por día
- **SystemStatus** — 6 sistemas con barras de progreso, gauges SVG y estados nominal/caution/critical
- **MissionTimeline** — 10 eventos de la misión con progreso visual
- **CrewPanel** — 4 astronautas con roles, agencias y datos históricos
- **AlertsLog** — alertas de clima espacial (DONKI) con fallback estático
- **DistanceGauge** — barras de distancia Tierra y Luna con velocidad relativa
- **`useMissionData.js`** — composable principal con MISSION_EPOCH, telemetría interpolada por día, polling de DONKI (20min) y noticias (10min)

**Stack:** Vue 3 + Vite 5 + Tailwind CSS v4 + Vercel

---

## Versiones futuras planificadas

Ver [ROADMAP.md](./ROADMAP.md) para el plan completo.

| Versión | Descripción | Estado |
|---|---|---|
| v1.6.0 | Modo archivo post-splashdown (`MissionArchive.vue`) | Planeado ~9 abril 2026 |
| v1.7.0 | Estado entre misiones (`NextMissionTeaser.vue`) | Planeado post-splashdown |
| v2.0.0 | Arquitectura multi-misión config-driven + soporte Artemis III | Planeado 2026-2027 |
