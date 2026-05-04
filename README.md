# 🚀 Artemis Mission Control

> Dashboard interactivo del programa lunar Artemis de NASA — Artemis I, II, III y IV en un solo lugar.

![Status](https://img.shields.io/badge/STATUS-LIVE-a3e635?style=for-the-badge&labelColor=0d0d14)
![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646cff?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Deploy](https://img.shields.io/badge/Vercel-Live-a78bfa?style=for-the-badge&logo=vercel&logoColor=white)

---

## Misiones

| Misión | Estado | Descripción |
|--------|--------|-------------|
| **Artemis I** | `HISTÓRICA` | Primer vuelo integrado SLS + Orion sin tripulación (Nov 2022). 25 días, récord de distancia: 432,210 km. |
| **Artemis II** | `HISTÓRICA` | Primer vuelo tripulado Artemis. 4 astronautas, sobrevuelo lunar a 6,400 km (Abr 2026). |
| **Artemis III** | `PRE-LAUNCH` | Rediseñada Feb 2026: LEO rendezvous/docking con HLS comercial. NET Late 2027. |
| **Artemis IV** | `ANUNCIADA` | Primer alunizaje tripulado desde Apollo 17. Polo sur lunar. NET ~2028. |

---

## Features

### Artemis I & II — Dashboard Histórico
- **MET congelado en splashdown** — Mission Elapsed Time real de la misión
- **Telemetría interpolada** — velocidad, distancias Tierra/Luna, temperaturas, latencia DSN
- **Trayectoria orbital SVG** — animación Earth → Moon → Earth con posición real de Orion
- **Sistemas Orion** — barras de estado + gauges O₂ / H₂O / Battery
- **Timeline D1–D10** — eventos con estado done/active/pending congelado
- **Clima espacial** — alertas CME vía NASA DONKI
- **Costo de misión** — contador de $4.1B con desglose por sistema (NASA OIG)
- **Panel de tripulación** — 4 astronautas con hitos históricos

### Artemis III — Pre-Launch Dashboard
- **Countdown** — Launch Library 2 API, actualización automática cuando NASA confirme fecha
- **Mission Overview** — objetivos, vehículos (SLS/Orion/HLS), aviso alunizaje → Artemis IV
- **Milestone Tracker** — checklist de hitos hacia el lanzamiento
- **Hardware Tracker** — estado de SLS, Orion CM-004, SpaceX Starship HLS, Blue Moon MK2 + noticias live
- **Mission Comparator** — tabla I vs II vs III: distancia, duración, tripulación, costos, objetivos
- **Program Costs** — $4-5B estimado, desglose, acumulado del programa (~$93.4B), links OIG/GAO
- **Lunar South Pole** — SVG con 9 sitios candidatos, PSR, por qué el polo sur (Artemis IV preview)
- **NASA TV** — embed playlist reciente del canal NASA (YouTube, sin proxy)
- **News Feed** — Spaceflight News API en tiempo real, fallback con artículos reales

### Artemis IV — Anunciada
- Ruta de misión visual (Lanzamiento → NRHO → Gateway → HLS → Polo Sur → TEI → Reentrada)
- Highlights históricos, prerequisitos, detalles de vehículo

### General
- **Selector multi-misión** — número romano prominente con color por misión, URL hash compartible
- **Tema dinámico** — cada misión cambia el fondo, acentos y CSS vars del sitio
- **Transición animada** — fade+slide al cambiar de misión
- **PWA** — instalable, service worker precache
- **Responsive** — mobile-first, romano solo en pantallas pequeñas

---

## APIs en producción

| API | Uso | CORS |
|-----|-----|------|
| [Launch Library 2](https://ll.thespacedevs.com) | Countdown y status Artemis III | ✓ directo |
| [NASA DONKI](https://api.nasa.gov/DONKI/) | Clima espacial | ✓ directo |
| [NASA Images API](https://images-api.nasa.gov) | Galería Artemis III | ✓ directo |
| [Spaceflight News API](https://api.spaceflightnewsapi.net) | Noticias y hardware updates | ✓ directo |
| YouTube embed | NASA TV playlist reciente | ✓ embed |
| JPL Horizons | Telemetría Artemis II (fallback) | ✗ → interpolación |

Sin backend. Sin API keys requeridas. Todo desde el browser.

---

## Stack

```
Vue 3 (Composition API + <script setup>)
Vite 5
Tailwind CSS v4 (via @tailwindcss/vite)
Inter + Share Tech Mono + Orbitron (Google Fonts)
vite-plugin-pwa
```

---

## Correr localmente

```bash
git clone https://github.com/PhiRequiem/ARTEMIS-II-MISSION-CONTROL.git
cd ARTEMIS-II-MISSION-CONTROL
npm install
npm run dev
# → http://localhost:5173
```

---

## Build & Deploy

```bash
npm run build   # output en /dist
```

El proyecto incluye `vercel.json`. Solo conecta el repo en [vercel.com](https://vercel.com) — Vite se detecta automáticamente.

```
Build command:  npm run build
Output dir:     dist
```

---

## Estructura

```
src/
├── missions/               # Config de cada misión (epoch, crew, fases, APIs, cssVars)
│   ├── artemis1.js
│   ├── artemis2.js
│   ├── artemis3.js
│   └── artemis4.js
├── composables/
│   ├── useMission.js       # Store global: misión activa, epoch reactivo, useFrozenNow()
│   ├── useMissionData.js   # Polling APIs + fallback interpolado
│   ├── usePhaseContent.js  # Detección de fase + contenido dinámico
│   └── useSystemStatus.js  # Estado de sistemas Orion
├── components/
│   ├── MissionSelector.vue # Tabs I/II/III/IV con color por misión
│   ├── HistoricalCard.vue  # Vista Artemis I
│   ├── AnnouncedCard.vue   # Vista Artemis IV
│   ├── PreLaunchDashboard.vue
│   ├── artemis3/           # Paneles específicos A3
│   │   ├── LaunchCountdown.vue
│   │   ├── MissionOverview.vue
│   │   ├── HardwareTracker.vue
│   │   ├── MissionComparator.vue
│   │   ├── A3CostPanel.vue
│   │   ├── LunarSitePanel.vue
│   │   ├── NASATVPanel.vue
│   │   ├── A3NewsPanel.vue
│   │   ├── MilestoneTracker.vue
│   │   ├── MediaGallery.vue
│   │   └── A3SpaceWeather.vue
│   └── [componentes Artemis II...]
├── App.vue
└── style.css
```

---

## Paleta Artemis III

| Var | Hex | Uso |
|-----|-----|-----|
| Navy | `#1d3a4d` | Texto principal, strip oscuro |
| Steel | `#83b0b5` | Fondo página, strip default |
| Teal | `#7facaf` | Tiles cool |
| Amber | `#e3a957` | Tiles warm |
| Cream | `#f9f1d3` | Cells internas, texto en dark |
| Rust | `#b35a3c` | Links |

Todos los contrastes verificados WCAG AA (≥4.5:1).

---

## Licencia

MIT — úsalo como quieras. Si lo usas en algo cool, menciona a [@PhiRequiem](https://github.com/PhiRequiem).

---

<div align="center">

**[PhiRequiem](https://github.com/PhiRequiem)** · *Per aspera ad astra* 🌙

</div>
